#!/usr/bin/env node
// A-55: IS A READER BEING SERVED THE TIP?
//
// WHY THIS EXISTS. On 2026-09-21 two GitHub Pages builds ERRORED while CI was green, `npm run
// verify` exited 0 and the drift alarm was silent. The live site served the previous tip and every
// instrument in this repo reported a successful ship. This lane's entire user-visible product is a
// published page, so a silent publish failure is indistinguishable, from inside the repo, from a
// successful one. It surfaced only because someone read the live page by hand. This makes that
// hand read mechanical.
//
// WHAT IT COMPARES, and why BYTES rather than a string. It fetches the published files the last
// page-changing commit touched and compares what the server returns against what HEAD holds. An
// asserted string needs someone to choose one on every ship, and it passes on a stale page that
// happens to carry it. Bytes need no choosing. The premise was measured on 2026-09-22: the served
// c/35a.html was byte-identical to HEAD:c/35a.html (5503 bytes each), and `.nojekyll` is present,
// so Pages serves committed bytes verbatim rather than rebuilding them.
//
// THE PATH SET IS DERIVED, NEVER TYPED. It is every tracked *.html at the repo root plus every
// tracked c/*.html, read from `git ls-files`. A hand-typed list would silently exclude a page added
// later — the rebuilt Ramsey page, say — and nothing would notice. The selftest pins that
// derivation against a fixture tree.
//
// THE IN-FLIGHT WINDOW IS MEASURED, NOT GUESSED. Pages answers with Cache-Control max-age=600 and a
// Last-Modified equal to the served build's time, so a page can legitimately lag its commit. The
// window below is set from a lag measured on a real ship (see LAG_MEASURED), not from a round
// number, and a tip pushed inside it reads IN-FLIGHT rather than STALE.
//
// INDICATOR, NEVER A GATE. It is not in `npm run check` and its live leg is not in CI. A transient
// GitHub failure must not turn this suite permanently red — that is this lane's founding defect —
// and both 2026-09-21 failures were transient. Only --selftest runs in CI.
//
// EXIT CODES. 0 every file SERVED or IN-FLIGHT · 1 at least one STALE · 2 REFUSED (the anchor, the
// path set, or a fetch could not be read). A refusal is never a pass: a zero from a dead probe is
// indistinguishable from a measured one.

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { realpathSync } from "node:fs";
import assert from "node:assert/strict";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://u00dxk2.github.io/bounds-ledger/";

// MEASURED 2026-09-22 on that day's first ship, by polling the live index every 15 s against
// HEAD's bytes. Commit aee164c is stamped 14:33:22Z; the page still served the previous build at
// 14:36:00Z and matched by 14:36:15Z, so the publish reached a reader between 158 s and 173 s after
// the commit. The new build's own Last-Modified was 14:34:36Z, about 74 s in — the rest is delivery,
// not build, which is why this window is measured at the READER rather than taken from the builds
// API. The window below is 300 s: above the measured upper bound with roughly 1.7x margin, and
// deliberately not larger, because a window wide enough to swallow a real failure says nothing.
// Poll record: A-55.lagMeasured2026_09_22.
export const LAG_MEASURED = { secondsLow: 158, secondsHigh: 173, measuredOn: "2026-09-22", anchor: "aee164c", note: "commit 14:33:22Z, stale at 14:36:00Z, served by 14:36:15Z" };
// CC_SERVED_WINDOW_MS overrides the window. It exists so the LIVE path can be red-armed: set it to 0
// immediately after a push and the same fetch that would read IN-FLIGHT reads STALE instead, which
// is how the firing half was demonstrated end to end rather than only in the selftest. It is a test
// hook, not a setting — nothing in the repo sets it, and a run that uses it says so below.
const WINDOW_OVERRIDE = process.env.CC_SERVED_WINDOW_MS;
export const IN_FLIGHT_WINDOW_MS = WINDOW_OVERRIDE !== undefined && WINDOW_OVERRIDE !== "" && Number.isFinite(Number(WINDOW_OVERRIDE))
  ? Number(WINDOW_OVERRIDE)
  : 5 * 60 * 1000;

export function git(args, root = ROOT) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 });
}

/** Every tracked page this site publishes: root *.html plus c/*.html. Derived, never typed. */
export function publishedPaths(lsFilesOutput) {
  return lsFilesOutput
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((p) => /^[^/]+\.html$/.test(p) || /^c\/[^/]+\.html$/.test(p))
    .sort();
}

/** The published files a commit touched — the discriminating set, since a stale publish differs exactly there. */
export function touchedPublished(nameOnlyOutput, published) {
  const set = new Set(published);
  return nameOnlyOutput
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((p) => set.has(p))
    .sort();
}

export function classify({ servedBytes, headBytes, pushedAtMs, nowMs, windowMs = IN_FLIGHT_WINDOW_MS }) {
  if (servedBytes === null) return "UNREACHABLE";
  if (Buffer.compare(servedBytes, headBytes) === 0) return "SERVED";
  if (typeof pushedAtMs === "number" && nowMs - pushedAtMs < windowMs) return "IN-FLIGHT";
  return "STALE";
}

async function fetchPage(path) {
  try {
    const res = await fetch(`${SITE}${path}`, { headers: { "cache-control": "no-cache" } });
    if (!res.ok) return { bytes: null, lastModified: null, status: res.status };
    const buf = Buffer.from(await res.arrayBuffer());
    return { bytes: buf, lastModified: res.headers.get("last-modified"), status: res.status };
  } catch (err) {
    return { bytes: null, lastModified: null, status: `fetch failed: ${err.message}` };
  }
}

function selftest() {
  // Path set: derived from ls-files, and a page added later is INCLUDED without anyone editing a list.
  const ls = ["index.html", "ramsey.html", "copying.html", "c/1a.html", "c/35a.html", "docs/x.html", "README.md", "scripts/y.mjs", "c/sub/deep.html"].join("\n");
  assert.deepEqual(publishedPaths(ls), ["c/1a.html", "c/35a.html", "copying.html", "index.html", "ramsey.html"]);
  assert.ok(publishedPaths([...ls.split("\n"), "rebuilt-ramsey.html"].join("\n")).includes("rebuilt-ramsey.html"),
    "a page added later must enter the set with no edit here — a typed list is the defect this guards");
  assert.ok(!publishedPaths(ls).includes("docs/x.html"), "docs/ is not published as a page");
  assert.deepEqual(publishedPaths(""), [], "an empty tree yields an empty set, never a guess");

  // Touched set: intersected with what is actually published.
  assert.deepEqual(touchedPublished(["c/35a.html", "scripts/render-site.mjs", "index.html"].join("\n"), publishedPaths(ls)), ["c/35a.html", "index.html"]);
  assert.deepEqual(touchedPublished("scripts/only.mjs", publishedPaths(ls)), [], "a commit touching no page yields nothing to check");

  // BOTH POLARITIES of the verdict, which is the whole KP-78 obligation here.
  const head = Buffer.from("<html>fresh</html>");
  const stale = Buffer.from("<html>old</html>");
  const now = Date.parse("2026-09-22T12:00:00Z");
  assert.equal(classify({ servedBytes: Buffer.from(head), headBytes: head, pushedAtMs: now - 1000, nowMs: now }), "SERVED",
    "identical bytes must be silent");
  assert.equal(classify({ servedBytes: stale, headBytes: head, pushedAtMs: now - 60 * 60 * 1000, nowMs: now }), "STALE",
    "differing bytes on an old push must FIRE");
  assert.equal(classify({ servedBytes: stale, headBytes: head, pushedAtMs: now - 30 * 1000, nowMs: now }), "IN-FLIGHT",
    "differing bytes inside the measured window are a publish in progress, not a failure");
  assert.equal(classify({ servedBytes: null, headBytes: head, pushedAtMs: now - 1000, nowMs: now }), "UNREACHABLE",
    "a failed fetch is UNREACHABLE, never SERVED");
  // The window boundary is read from the constant, not retyped: a push exactly at the edge is STALE.
  assert.equal(classify({ servedBytes: stale, headBytes: head, pushedAtMs: now - IN_FLIGHT_WINDOW_MS, nowMs: now }), "STALE",
    "at the window edge the verdict must fall to STALE, or the window can never expire");

  console.log("check-served selftest: PASS (path set derived from ls-files and open to a page added later; touched set intersected with it; SERVED silent, STALE fires, IN-FLIGHT only inside the measured window, UNREACHABLE never reads as served; window edge falls to STALE)");
}

async function main() {
  let anchor, pushedAtMs, published, touched;
  try {
    const paths = publishedPaths(git(["ls-files"]));
    if (paths.length === 0) {
      console.error("check-served: REFUSED — the published path set is EMPTY, so there is nothing this read could ever fire on (exit 2)");
      process.exit(2);
    }
    published = paths;
    anchor = git(["log", "-1", "--format=%H %cI", "--", ...published]).trim();
    if (!anchor) {
      console.error("check-served: REFUSED — no commit touches any published page; the anchor cannot be read (exit 2)");
      process.exit(2);
    }
    const [sha, when] = anchor.split(/\s+/);
    pushedAtMs = Date.parse(when);
    touched = touchedPublished(git(["show", "--name-only", "--format=", sha]), published);
    anchor = { sha, when };
  } catch (err) {
    console.error(`check-served: REFUSED — git could not be read (${err.message}) (exit 2)`);
    process.exit(2);
  }

  if (touched.length === 0) {
    console.error(`check-served: REFUSED — anchor ${anchor.sha.slice(0, 10)} touched no published page, so this run would compare nothing (exit 2)`);
    process.exit(2);
  }

  console.log(`# Served vs HEAD — ${new Date().toISOString()}`);
  if (WINDOW_OVERRIDE !== undefined && WINDOW_OVERRIDE !== "") {
    console.log(`in-flight window OVERRIDDEN to ${IN_FLIGHT_WINDOW_MS} ms by CC_SERVED_WINDOW_MS — a test hook; a normal run uses the measured window`);
  }
  console.log(`anchor ${anchor.sha.slice(0, 10)} (${anchor.when}), the last commit to touch a published page; ${touched.length} file(s) it changed, of ${published.length} published`);

  const rows = [];
  for (const path of touched) {
    const headBytes = Buffer.from(git(["show", `HEAD:${path}`]), "utf8");
    const served = await fetchPage(path);
    const verdict = classify({ servedBytes: served.bytes, headBytes, pushedAtMs, nowMs: Date.now() });
    rows.push({ path, verdict, served });
    const detail = verdict === "SERVED"
      ? `${headBytes.length} bytes`
      : verdict === "UNREACHABLE"
        ? `not read: ${served.status}`
        : `served Last-Modified ${served.lastModified || "absent"} — which build is being served`;
    console.log(`${verdict.padEnd(11)} ${path}  ${detail}`);
  }

  const stale = rows.filter((r) => r.verdict === "STALE");
  const unreachable = rows.filter((r) => r.verdict === "UNREACHABLE");
  const inFlight = rows.filter((r) => r.verdict === "IN-FLIGHT");
  console.log(`\n${rows.length} checked — ${rows.length - stale.length - unreachable.length - inFlight.length} served, ${inFlight.length} in flight, ${stale.length} stale, ${unreachable.length} unreachable.`);
  console.log("This is an INDICATOR: it never gates a build and never runs in CI. A page can also be stale for a reader behind a cache this read does not share.");

  if (stale.length > 0) {
    console.error(`check-served: STALE — ${stale.length} published file(s) do not match HEAD; the publish did not reach readers (exit 1)`);
    process.exit(1);
  }
  if (unreachable.length > 0) {
    console.error(`check-served: REFUSED — ${unreachable.length} file(s) could not be read, which is not a pass (exit 2)`);
    process.exit(2);
  }
  console.log("RESULT: PASS — every file the last page-changing commit touched is being served as committed (exit 0)");
}

const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  if (process.argv.includes("--selftest")) selftest();
  else await main();
} else if (process.argv[1]?.endsWith("check-served.mjs")) {
  console.error("check-served: COULD NOT RUN — invoked as main but module identity did not match");
  process.exit(2);
}
