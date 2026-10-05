#!/usr/bin/env node
// Refuses a tracked file that cites a commit which history rewrites removed from this repository
// but which GitHub still serves by sha.
//
// usage: check-orphan-shas.mjs [--selftest]
// exit 0 = no tracked file cites a listed commit · 1 = at least one does · 2 = could not read the tree
//
// WHY: a rewritten commit stops being reachable from any ref, yet GitHub keeps serving it by sha
// (its page, its .patch view) until the cached views are purged. A citation in the tracked tree is
// a link a reader can follow straight to it. The fix is to cite such a commit by a neutral label,
// never by sha, and this check keeps it that way.
//
// WHAT IT READS: the INDEX (`git grep --cached`), so in CI it reads the checked-out commit and in
// the pre-commit hook it reads exactly what is about to be committed. Every tracked text file is
// read, the mirror under ledger/ included.
//
// THE LIST holds the sha256 of each commit's 7-character prefix, never the prefix itself, so that
// this file is not one more citation. That keeps the strings out of the tree; it does not make
// them secret — seven hex characters are enumerable.
//
// CEILING: the list is closed. It names the commits found by a census of the tree on 2026-10-05
// (every sha-shaped token that does not resolve locally, each asked of the GitHub API). A future
// rewrite creates new orphans this list does not know; add them in the commit that does the
// rewrite.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const ORPHANED = new Set([
  "47955a4558386a26f3a5f2413e9d2a3d392ae0e56d14674adcaeb06ad213aeff",
  "9f1d973ba86a9e010c2589cbca4234f0685de7f97ee274087de8cc59b7a60bed",
  "5ef4dbc722283d5be6f596031192277e53dc13d4724ba9090bec1c7eafee16ae",
  "5638a64173857918523f2d1321301d5eeda44e937b39cb37e1ad28d475934810",
  "92ef09ccb446bb7074269b8ed5bdcf5c8cfdf7b288bb897cf82b59dea224c1d0",
  "67faac5a21a06c117354ccb95509d8bf99a460110077dde1c860092b5f4859f4",
]);

const prefixKey = (tok) => createHash("sha256").update(tok.slice(0, 7).toLowerCase()).digest("hex");

// A token is a run of 7 to 40 hex characters not glued to a letter, digit or decimal point on
// either side, so `2.6273856` and `x1234567` are not tokens.
const TOKEN = /(?<![0-9A-Za-z.])[0-9A-Fa-f]{7,40}(?![0-9A-Za-z])/g;

export function findCitations(lines, orphaned = ORPHANED) {
  const hits = [];
  for (const { file, line, text } of lines) {
    for (const m of text.matchAll(TOKEN)) {
      if (orphaned.has(prefixKey(m[0]))) hits.push({ file, line, column: m.index + 1 });
    }
  }
  return hits;
}

function readIndex() {
  let out;
  try {
    // -a: a file git classes as binary is searched as text, never skipped (review, 2026-10-05: `-I`
    // let a NUL byte hide a citation). -z: path, line number and text are NUL-separated, so a path
    // or a line containing ":12:" cannot be mis-split.
    out = execFileSync("git", ["-c", "core.quotePath=false", "grep", "--cached", "-a", "-z", "-n", "-i", "-E", "[0-9a-f]{7}"], {
      encoding: "utf8",
      maxBuffer: 512 * 1024 * 1024,
    });
  } catch (err) {
    if (err.status === 1) out = ""; // git grep: no line matched at all
    else throw err;
  }
  const lines = [];
  for (const raw of out.split(/\r?\n/)) {
    const [file, line, ...rest] = raw.split("\0");
    if (file && /^\d+$/.test(line ?? "")) lines.push({ file, line: Number(line), text: rest.join("\0") });
  }
  return lines;
}

function check() {
  const lines = readIndex();
  // Positive control: this repo's own manifests carry 40-character shas, so a read that returns no
  // hex-bearing line at all means the read failed, never that the tree is clean.
  if (!lines.length) {
    console.log("REFUSED — git grep returned no hex-bearing line from the index; the tree was not read, so a clean result would mean nothing.");
    return 2;
  }
  const files = new Set(lines.map((l) => l.file)).size;
  const hits = findCitations(lines);
  if (!hits.length) {
    console.log(`orphaned-commit citations: none (${lines.length} hex-bearing line(s) in ${files} tracked file(s) read from the index; ${ORPHANED.size} listed commit(s))`);
    return 0;
  }
  console.log(`ORPHANED-COMMIT CITATION — ${hits.length} place(s) cite a commit removed by a history rewrite that GitHub still serves by sha:`);
  for (const h of hits) console.log(`  ${h.file}:${h.line}:${h.column}`);
  console.log("Cite it by a neutral label (\"a pre-rewrite commit\") instead of its sha. The sha is not printed here on purpose.");
  return 1;
}

function selftest() {
  const fake = new Set([prefixKey("abcdef1")]);
  const fails = [];
  const fire = (text, why) => { if (findCitations([{ file: "f", line: 1, text }], fake).length !== 1) fails.push(`did not fire: ${why}`); };
  const quiet = (text, why) => { if (findCitations([{ file: "f", line: 1, text }], fake).length !== 0) fails.push(`fired: ${why}`); };
  fire("landed in `abcdef1` (now restamped)", "a bare 7-character citation");
  fire("abcdef1234567890abcdef1234567890abcdef12", "a full 40-character sha with that prefix");
  fire("(ABCDEF1→4cb9723)", "an uppercase citation inside an arrow pair");
  quiet("landed in `abcdef2`", "a different sha");
  quiet("value 2.abcdef1", "a token glued to a decimal point");
  quiet("xabcdef1", "a token glued to a letter");
  quiet("abcdef", "a run shorter than seven characters");
  if (ORPHANED.size !== 6 || [...ORPHANED].some((k) => !/^[0-9a-f]{64}$/.test(k))) fails.push("the list must hold six sha256 hex digests");
  if (fails.length) {
    for (const f of fails) console.error(`check-orphan-shas selftest FAIL: ${f}`);
    return 1;
  }
  console.log("check-orphan-shas selftest: PASS (fires on short, full and uppercase citations; silent on a different sha, decimals, glued and short runs)");
  return 0;
}

try {
  process.exitCode = process.argv.includes("--selftest") ? selftest() : check();
} catch (err) {
  console.error(`check-orphan-shas: could not run (${err.message.split("\n")[0]})`);
  process.exitCode = 2;
}
