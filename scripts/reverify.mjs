#!/usr/bin/env node
// Re-verification for the adopted record surface: teorth/optimizationproblems constants/.
// Modes:
//   --snapshot            fetch upstream at HEAD, write ledger copy + manifest
//   --check               fetch upstream, diff vs ledger copy; print drift report; exit 1 on drift
//   --live-dir <dir>      (testing) read the "live" side from a local dir instead of the network
//
// Drift is not an error condition — records are SUPPOSED to move. A nonzero exit is the
// alarm that a human/agent must re-verify the change against primary sources, then run
// --snapshot and commit the updated ledger copy deliberately.

import { mkdir, readFile, writeFile, readdir, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "teorth/optimizationproblems";
const SUBDIR = "constants";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER_DIR = join(ROOT, "ledger", "teorth-optimizationproblems");
const SNAP_DIR = join(LEDGER_DIR, SUBDIR);
const MANIFEST = join(LEDGER_DIR, "manifest.json");

const UA = { "user-agent": "bounds-ledger-reverify" };
if (process.env.GITHUB_TOKEN) UA.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const norm = (s) => s.replace(/\r\n/g, "\n");

async function getJson(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`GET ${url}: ${res.status}`);
  return res.json();
}

async function fetchUpstream() {
  const head = await getJson(`https://api.github.com/repos/${REPO}/commits/HEAD`);
  const sha = head.sha;
  const tree = await getJson(`https://api.github.com/repos/${REPO}/git/trees/${sha}?recursive=1`);
  const paths = tree.tree
    .filter((e) => e.type === "blob" && e.path.startsWith(`${SUBDIR}/`) && e.path.endsWith(".md"))
    .map((e) => e.path);
  const files = new Map();
  const CHUNK = 10;
  for (let i = 0; i < paths.length; i += CHUNK) {
    await Promise.all(
      paths.slice(i, i + CHUNK).map(async (p) => {
        const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${sha}/${p}`, { headers: { "user-agent": UA["user-agent"] } });
        if (!res.ok) throw new Error(`fetch ${p}: ${res.status}`);
        files.set(p.slice(SUBDIR.length + 1), norm(await res.text()));
      })
    );
  }
  return { sha, files };
}

async function readDirFiles(dir) {
  const files = new Map();
  for (const name of (await readdir(dir)).filter((n) => n.endsWith(".md"))) {
    files.set(name, norm(await readFile(join(dir, name), "utf8")));
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
  for (const [name, text] of files) await writeFile(join(SNAP_DIR, name), text);
  await writeFile(
    MANIFEST,
    JSON.stringify({ surface: REPO, subdir: SUBDIR, sha, fetchedAt: new Date().toISOString(), fileCount: files.size }, null, 2) + "\n"
  );
  console.log(`snapshot: ${files.size} files @ ${REPO}@${sha.slice(0, 7)}`);
}

async function check(liveDir) {
  const snap = await readDirFiles(SNAP_DIR);
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  const live = liveDir ? { sha: "(local)", files: await readDirFiles(liveDir) } : await fetchUpstream();

  const names = [...new Set([...snap.keys(), ...live.files.keys()])].sort();
  let drift = 0;
  const lines = [`# Drift report — ${REPO}/${SUBDIR} — ${new Date().toISOString()}`, `Snapshot: ${manifest.sha} · Live: ${live.sha}`, ""];
  for (const name of names) {
    const a = snap.get(name), b = live.files.get(name);
    if (a === b) continue;
    drift++;
    if (a === undefined) lines.push(`ADDED ${SUBDIR}/${name}`);
    else if (b === undefined) lines.push(`REMOVED ${SUBDIR}/${name}`);
    else {
      lines.push(`CHANGED ${SUBDIR}/${name}`);
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
