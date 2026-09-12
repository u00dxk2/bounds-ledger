#!/usr/bin/env node
// Re-verification for the adopted record surface: teorth/optimizationproblems —
// every constants/*.md file PLUS the root README.md.
//
// README.md joined the mirror 2026-08-10 (W-5). The constants files carry the
// bound TABLES; the README is where upstream declares which of those rows it will
// STAND BEHIND — on 2026-08-02 commit dee1660 marked C_21 and C_71 unverified with
// asterisks and restored the peer-reviewed value as C_71's headline anchor. Our
// alarm reported three constants files and was SILENT on the semantically largest
// change of that day, because a demotion from headline to asterisked-unverified
// leaves every bounds table byte-identical. That is the most decision-relevant
// event class for anyone citing these numbers, and it was the one class we could
// not see.
//
// Modes:
//   --snapshot            fetch upstream at HEAD, write ledger copy + manifest
//   --check               fetch upstream, diff vs ledger copy; print drift report; exit 1 on drift
//   --live-dir <dir>      (testing) read the "live" side from a local dir instead of the network
//
// Drift is not an error condition — records are SUPPOSED to move. A nonzero exit is the
// alarm that a human/agent must re-verify the change against primary sources, then run
// --snapshot and commit the updated ledger copy deliberately.

import { mkdir, readFile, writeFile, readdir, rm } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = "teorth/optimizationproblems";
const SUBDIR = "constants";
// Mirrored files that live at the repo ROOT rather than under constants/. Keys in
// every file map are REPO-RELATIVE paths, so a report names `README.md` and
// `constants/1a.md` as upstream itself would — never `constants/README.md`.
const ROOT_FILES = ["README.md"];
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER_DIR = join(ROOT, "ledger", "teorth-optimizationproblems");
const SNAP_DIR = join(LEDGER_DIR, SUBDIR);
const MANIFEST = join(LEDGER_DIR, "manifest.json");

const UA = { "user-agent": "bounds-ledger-reverify" };
if (process.env.GITHUB_TOKEN) UA.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const norm = (s) => s.replace(/\r\n/g, "\n");

const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const RETRY_DELAYS_MS = [500, 1500];
// A-39: a 429 is NOT a server hiccup, it is the limiter already refusing us, so it gets its own
// ladder, honours Retry-After, and is jittered. The numbers matter: this alarm fetches ~450 URLs a
// run at CHUNK = 10 concurrency, so a mid-run 429 retried in lockstep at 500ms aims a burst at the
// one surface that just said stop — and GitHub's own secondary-limit guidance counts an immediate
// retry as a further violation. 502/503/504 keep the original ladder unchanged: the lockstep harm
// measured on this repo was the rate-limit case, and widening the change would move behaviour the
// A-20 tests pin without evidence that it does harm.
// BOTH LADDERS MUST STAY THE SAME LENGTH — the attempt count is derived from RETRY_DELAYS_MS.
const RATE_LIMIT_STATUSES = new Set([429]);
const RATE_LIMIT_DELAYS_MS = [2000, 8000];
const RETRY_AFTER_CEILING_MS = 30_000;
const RATE_LIMIT_JITTER_FRACTION = 0.25;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry-After arrives either as seconds or as an HTTP date. An unparseable header is NOT an
// instruction to retry immediately — it returns null and the caller falls back to its own ladder.
export function retryAfterMs(header, now = Date.now()) {
  if (header === null || header === undefined || String(header).trim() === "") return null;
  const raw = String(header).trim();
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.max(0, Math.round(seconds * 1000));
  const at = Date.parse(raw);
  return Number.isFinite(at) ? Math.max(0, at - now) : null;
}

// The wait for a rate-limited attempt: at least our ladder, at least what the server asked for,
// never more than the ceiling — then jitter UPWARD only, so ten concurrent retries stop landing in
// the same millisecond and we never wait LESS than a server-specified Retry-After.
export function rateLimitDelayMs(base, retryAfterHeader, rng = Math.random, now = Date.now()) {
  const asked = retryAfterMs(retryAfterHeader, now);
  const floor = Math.min(Math.max(base, asked ?? 0), RETRY_AFTER_CEILING_MS);
  return floor + Math.round(floor * RATE_LIMIT_JITTER_FRACTION * rng());
}

const fetchErrorText = (err) => {
  const message = err?.message ?? String(err);
  const code = err?.code ?? err?.cause?.code;
  return code && !message.includes(code) ? `${message} (${code})` : message;
};

const isTransientFetchError = (err) => {
  const code = err?.code ?? err?.cause?.code;
  return [
    "ECONNRESET",
    "ETIMEDOUT",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_BODY_TIMEOUT",
    "UND_ERR_SOCKET",
  ].includes(code) || /ECONNRESET|socket hang up|timed?\s*out|timeout/i.test(fetchErrorText(err));
};

// Retry extends reach; it never converts the final response or error into success.
// Callers still classify an exhausted HTTP response or transport error exactly as before.
export async function fetchWithRetry(url, options = {}, {
  fetchImpl = globalThis.fetch,
  wait = sleep,
  rng = Math.random,
} = {}) {
  const totalAttempts = RETRY_DELAYS_MS.length + 1;
  for (let attempt = 1; attempt <= totalAttempts; attempt++) {
    let delay = RETRY_DELAYS_MS[attempt - 1];
    try {
      const res = await fetchImpl(url, options);
      if (!RETRYABLE_STATUSES.has(res.status) || attempt === totalAttempts) return res;
      if (RATE_LIMIT_STATUSES.has(res.status)) {
        const header = res.headers?.get?.("retry-after") ?? null;
        delay = rateLimitDelayMs(RATE_LIMIT_DELAYS_MS[attempt - 1], header, rng);
        console.log(`Retrying ${url}: attempt ${attempt + 1}/${totalAttempts} after HTTP ${res.status} (rate limited; waiting ${delay}ms${header ? `, Retry-After: ${header}` : ""})`);
      } else {
        console.log(`Retrying ${url}: attempt ${attempt + 1}/${totalAttempts} after HTTP ${res.status}`);
      }
      try { await res.body?.cancel(); } catch { /* best effort: release this failed response */ }
    } catch (err) {
      if (!isTransientFetchError(err) || attempt === totalAttempts) throw err;
      console.log(`Retrying ${url}: attempt ${attempt + 1}/${totalAttempts} after ${fetchErrorText(err)}`);
    }
    await wait(delay);
  }
}

async function getJson(url) {
  const res = await fetchWithRetry(url, { headers: UA });
  if (!res.ok) throw new Error(`GET ${url}: ${res.status}`);
  return res.json();
}

async function fetchUpstream() {
  const head = await getJson(`https://api.github.com/repos/${REPO}/commits/HEAD`);
  const sha = head.sha;
  const tree = await getJson(`https://api.github.com/repos/${REPO}/git/trees/${sha}?recursive=1`);
  const paths = tree.tree
    .filter((e) => e.type === "blob" && ((e.path.startsWith(`${SUBDIR}/`) && e.path.endsWith(".md")) || ROOT_FILES.includes(e.path)))
    .map((e) => e.path);
  const files = new Map();
  const CHUNK = 10;
  for (let i = 0; i < paths.length; i += CHUNK) {
    await Promise.all(
      paths.slice(i, i + CHUNK).map(async (p) => {
        const res = await fetchWithRetry(`https://raw.githubusercontent.com/${REPO}/${sha}/${p}`, { headers: { "user-agent": UA["user-agent"] } });
        if (!res.ok) throw new Error(`fetch ${p}: ${res.status}`);
        files.set(p, norm(await res.text()));
      })
    );
  }
  return { sha, files };
}

// Read a mirror-shaped directory: <dir>/constants/*.md plus any ROOT_FILES sitting
// at <dir>/. Keys come back repo-relative, matching what fetchUpstream returns, so
// the same diff serves the live check and the network-free --live-dir mode.
async function readMirror(dir) {
  const files = new Map();
  for (const name of (await readdir(join(dir, SUBDIR))).filter((n) => n.endsWith(".md"))) {
    files.set(`${SUBDIR}/${name}`, norm(await readFile(join(dir, SUBDIR, name), "utf8")));
  }
  for (const name of ROOT_FILES) {
    // Absent is not an error here — it is drift, and the diff below reports it as
    // REMOVED/ADDED. Swallowing it would make a deleted mirror file look clean.
    try { files.set(name, norm(await readFile(join(dir, name), "utf8"))); } catch { /* reported as drift */ }
  }
  return files;
}

// ponytail: line-set diff (order-insensitive, no LCS) — fine for bound tables; upgrade to a real diff if reports get noisy
function lineDiff(oldText, newText) {
  const o = oldText.split("\n"), n = newText.split("\n");
  const oSet = new Set(o), nSet = new Set(n);
  return {
    removed: o.filter((l) => !nSet.has(l) && l.trim()),
    added: n.filter((l) => !oSet.has(l) && l.trim()),
  };
}

async function snapshot() {
  const { sha, files } = await fetchUpstream();
  await rm(SNAP_DIR, { recursive: true, force: true });
  await mkdir(SNAP_DIR, { recursive: true });
  for (const [path, text] of files) await writeFile(join(LEDGER_DIR, path), text);
  await writeFile(
    MANIFEST,
    JSON.stringify({ surface: REPO, subdir: SUBDIR, rootFiles: ROOT_FILES, sha, fetchedAt: new Date().toISOString(), fileCount: files.size }, null, 2) + "\n"
  );
  console.log(`snapshot: ${files.size} files @ ${REPO}@${sha.slice(0, 7)}`);
}

async function check(liveDir) {
  const snap = await readMirror(LEDGER_DIR);
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  const live = liveDir ? { sha: "(local)", files: await readMirror(liveDir) } : await fetchUpstream();

  const names = [...new Set([...snap.keys(), ...live.files.keys()])].sort();
  let drift = 0;
  const lines = [`# Drift report — ${REPO} (${SUBDIR}/ + ${ROOT_FILES.join(", ")}) — ${new Date().toISOString()}`, `Snapshot: ${manifest.sha} · Live: ${live.sha}`, ""];
  for (const name of names) {
    const a = snap.get(name), b = live.files.get(name);
    if (a === b) continue;
    drift++;
    if (a === undefined) lines.push(`ADDED ${name}`);
    else if (b === undefined) lines.push(`REMOVED ${name}`);
    else {
      lines.push(`CHANGED ${name}`);
      const d = lineDiff(a, b);
      // The set-diff is blind to changes that preserve the line SET — a row REORDER or a
      // duplicate-line edit. Those fired the alarm with a completely empty body, which is
      // A-5's defect (an alarm that fires with no stated reason) surviving inside the finding
      // that closed it. Row order is load-bearing here: the generated pins assert the
      // LAST-LISTED row, so a reorder changes what our own pins mean. Say so explicitly.
      if (!d.removed.length && !d.added.length) {
        lines.push(`  (line SET unchanged — rows REORDERED or a line duplicated/deduplicated;`);
        lines.push(`   the set-diff cannot show which. Row order is load-bearing: generated pins`);
        lines.push(`   assert the LAST-LISTED row. Diff this file against the mirror by hand.)`);
      }
      for (const l of d.removed) lines.push(`  - ${l}`);
      for (const l of d.added) lines.push(`  + ${l}`);
    }
  }
  if (!drift) {
    console.log(`No drift. ${snap.size} files match upstream ${live.sha}.`);
    return 0;
  }
  lines.push("", `${drift} file(s) drifted. Re-verify against primary sources, then run --snapshot and commit.`);
  console.log(lines.join("\n"));
  return 1;
}

// MAIN-MODULE GUARD, F1 from the 2026-09-01 cross-family review of this branch. Comparing
// pathToFileURL(process.argv[1]) against import.meta.url fails SILENTLY GREEN when the checkout is
// reached through a symlink or a junction: Node realpaths the ESM entry and not argv[1], so the
// identity check fails, main never runs, and the process exits 0 having printed nothing — a checker
// reporting success for work it never did. Measured on the branch through a junction: `--check`
// exited 0 with 0 bytes, and `npm test` reported PASS with one self-test never executed.
// realpathSync puts both sides in the same space; the else-branch is A-19 N-2's rule that a guard
// which cannot run must not read as a pass, and it is why the failure is loud rather than absent.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  const args = process.argv.slice(2);
  const liveDirIdx = args.indexOf("--live-dir");
  try {
    if (args.includes("--snapshot")) await snapshot();
    else if (args.includes("--check")) process.exitCode = await check(liveDirIdx >= 0 ? args[liveDirIdx + 1] : null);
    else {
      console.error("usage: reverify.mjs --snapshot | --check [--live-dir <dir>]");
      process.exitCode = 2;
    }
  } catch (err) {
    console.error(`error: ${err.message}`);
    process.exitCode = 2;
  }
} else if (process.argv[1]?.endsWith("reverify.mjs")) {
  console.error("reverify: COULD NOT RUN — invoked as main but module identity did not match");
  process.exitCode = 2;
}
