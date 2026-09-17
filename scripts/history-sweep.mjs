#!/usr/bin/env node
// Verified no-secrets sweep over the FULL reachable git history — the A-13 public-flip gate.
//
// usage: history-sweep.mjs [--selftest | --staged | --scheduled | --list-keys]
// exit 0 = no secret-shaped content found in any reachable commit · 1 = hits · 2 = error
//
// IT IS NOW BOTH A GATE AND A MONITOR. The no-flag `sweep()` is the one-time pre-flip gate (A-13):
// flipping this repo public exposed every commit, not just the tip, so it ran once before that
// decision and its output went in the flip package. `--scheduled` is A-7's R7, the daily monitor,
// which this file's header used to say was fleet-owned and must not be solved locally ahead of the
// coordinated wave. SUPERSEDED 2026-09-17: the orchestrator licensed this lane to ship it after
// fifty days with no fleet date (bus 63246b2b asked, b5932dd5 answered). It runs from
// .github/workflows/history-sweep.yml at fetch-depth 0.
//
// CEILING (ponytail: named, not hidden): `git log -p --all` covers commits reachable from refs.
// Dangling/unreachable objects are NOT scanned. That is the right scope for a pre-publish gate —
// a cloner gets reachable history — but it is not the same as "no secret has ever existed in
// this .git directory". If that stronger claim is ever needed, the upgrade is
// `git cat-file --batch-all-objects`.
//
// PATTERNS ARE STRUCTURAL, NOT ENTROPIC. A generic "long hex string" rule would fire on every
// commit sha in ledger/**/manifest.json and on the mathematical content itself, and an alarm
// that fires constantly carries no information (this lane's founding defect). Every pattern
// below keys on a credential's distinctive PREFIX or an assignment shape.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const DISPOSITIONS = join(ROOT, "continuity", "history-sweep-dispositions.json");

const PATTERNS = [
  ["github-pat", /\bghp_[A-Za-z0-9]{20,}/],
  ["github-fine-grained-pat", /\bgithub_pat_[A-Za-z0-9_]{20,}/],
  ["github-oauth", /\bgho_[A-Za-z0-9]{20,}/],
  ["anthropic-key", /\bsk-ant-[A-Za-z0-9-]{20,}/],
  ["openai-key", /\bsk-(?:proj-|admin-)?[A-Za-z0-9]{32,}/],
  ["stripe-live-key", /\b[sr]k_live_[A-Za-z0-9]{20,}/],
  ["aws-access-key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["slack-token", /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ["sentry-auth-token", /\bsntr[a-z]{1,2}_[A-Za-z0-9]{20,}/],
  ["private-key-block", /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/],
  ["jwt", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\./],
  ["db-url-with-password", /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis):\/\/[^\s:@/]+:[^\s@/]+@/],
  // assignment shapes: KEY=<20+ non-space chars>, excluding obvious placeholders
  // Keyword set is deliberately broader than SECRET/PASSWORD: the portfolio's own credentials
  // include CC_PROMPTS_PIN, which the first draft of this pattern could not see. Caught by this
  // file's own fixture, not by review.
  ["secret-assignment", /\b[A-Z0-9_]*(?:SECRET|PASSWORD|PASSWD|API_?KEY|ACCESS_?TOKEN|AUTH_?TOKEN|PRIVATE_?KEY|CREDENTIAL|_PIN|_TOKEN|_KEY)[A-Z0-9_]*\s*[=:]\s*["']?(?!\s*$)(?!.*(?:\$\{|<|xxx|XXX|your|YOUR|example|EXAMPLE|placeholder|PLACEHOLDER|redacted|REDACTED|\*\*\*))[^\s"'`]{20,}/],
];

// Lines that are allowed to match — each needs a reason, and the list is deliberately tiny.
// An allowlist is where a secrets sweep goes to die, so anything added here belongs in the
// sweep record with its justification.
const ALLOW = [
  // The scanner's own pattern definitions, once this file is itself in history.
  /scripts\/history-sweep\.mjs/,
];

function scan(text, label) {
  const hits = [];
  const lines = text.split(/\r?\n/);
  let file = "(unknown)";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // A commit HEADER resets the file, because `git log -p` prints the commit message between the
    // header and the first diff — and without this reset those message lines are attributed to
    // whatever file the PREVIOUS commit happened to end on. Found 2026-09-17 while dispositioning
    // the known hits: a secret-shaped line quoted in one commit's message was reported as living in
    // a script it has never appeared in. The hit was real; the location was fiction.
    if (/^commit [0-9a-f]{40}$/.test(line)) { file = "(commit message)"; continue; }
    const fm = line.match(/^\+\+\+ b\/(.+)$/);
    if (fm) { file = fm[1]; continue; }
    if (ALLOW.some((re) => re.test(line)) || ALLOW.some((re) => re.test(file))) continue;
    for (const [name, re] of PATTERNS) {
      if (re.test(line)) hits.push({ name, file, line: line.slice(0, 160), full: line, where: label });
    }
  }
  return hits;
}

function sweep() {
  const log = execFileSync("git", ["log", "-p", "--all", "--no-color"], {
    encoding: "utf8",
    maxBuffer: 512 * 1024 * 1024,
  });
  const commits = execFileSync("git", ["rev-list", "--all", "--count"], { encoding: "utf8" }).trim();
  const hits = scan(log, "reachable-history");

  console.log(`history sweep — ${commits} reachable commit(s), ${PATTERNS.length} pattern(s), ${(log.length / 1e6).toFixed(2)} MB of diff scanned`);
  if (!hits.length) {
    console.log(`CLEAN — no secret-shaped content in reachable history.`);
    return 0;
  }
  console.log(`FOUND ${hits.length} secret-shaped hit(s):`);
  for (const h of hits) console.log(`  [${h.name}] ${h.file}\n      ${h.line}`);
  return 1;
}

// ---------------------------------------------------------------------------------------------
// A-7 R7: the SCHEDULED sweep. Licensed to this lane by the orchestrator on 2026-09-17 after the
// fleet wave it was waiting on had not arrived in fifty days.
//
// WHY THIS IS NOT AN ALLOWLIST, which this file's own comment calls where a secrets sweep goes to
// die. A scheduled run of `sweep()` would be RED every day: reachable history contains the fake
// `ghp_` token this repo planted in 2026-08 to prove the scanner fires, and AWS's published
// example key inside a test fixture. A permanently red alarm carries exactly as much information
// as a permanently green one — the defect this ledger was founded on — so each known hit is
// DISPOSITIONED IN WRITING and keyed to the sha256 of the exact line it matched.
//
// What that buys, and what an allowlist would not:
//   - a NEW secret in the SAME file still fires, because the key is the line, not the path;
//   - every dispositioned hit is PRINTED on every run with its reason, so nothing is hidden;
//   - a disposition that stops matching anything FAILS the run, so the list cannot rot quietly;
//   - the file stores only hashes, never the matched text, so it cannot itself become a hit.
//
// THE SHALLOW-CLONE TRAP, which is the one this control most needs to survive: a sweep run in a
// depth-1 checkout scans ONE commit and prints CLEAN. That is worse than no sweep. So the run
// refuses a shallow repository outright, and it requires the number of commits its own scan walked
// to equal `git rev-list --all --count` — the positive control the orchestrator named.
const lineKey = (hit) => createHash("sha256").update(`${hit.name}|~|${hit.file}|~|${hit.full}`).digest("hex");

export function partitionHits(hits, dispositions) {
  const byKey = new Map(dispositions.map((d) => [d.sha256, d]));
  const seen = new Set();
  const undispositioned = [];
  const dispositioned = [];
  for (const h of hits) {
    const key = lineKey(h);
    const d = byKey.get(key);
    if (d) { seen.add(key); dispositioned.push({ hit: h, disposition: d }); } else undispositioned.push({ hit: h, key });
  }
  const stale = dispositions.filter((d) => !seen.has(d.sha256));
  return { dispositioned, undispositioned, stale };
}

// Prints one line per hit in reachable history: pattern, file, and the sha256 the disposition file
// keys on. This is how that file is BUILT — by copying keys a run produced, never by retyping a
// line that contains secret-shaped text. It prints no matched text for the same reason.
function listKeys() {
  const log = execFileSync("git", ["log", "-p", "--all", "--no-color"], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
  const hits = scan(log, "reachable-history");
  const seen = new Set();
  for (const h of hits) {
    const key = lineKey(h);
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`${h.name}\t${h.file}\t${key}`);
  }
  console.log(`# ${hits.length} hit(s), ${seen.size} distinct line(s)`);
  return 0;
}

function scheduled() {
  const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], { encoding: "utf8" }).trim();
  if (shallow !== "false") {
    console.log(`REFUSED — this is a shallow checkout (${shallow}). A sweep here would scan a fraction of history and print CLEAN, which is worse than not running. Check out with fetch-depth: 0.`);
    return 2;
  }
  const log = execFileSync("git", ["log", "-p", "--all", "--no-color"], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
  const reachable = Number(execFileSync("git", ["rev-list", "--all", "--count"], { encoding: "utf8" }).trim());
  const walked = (log.match(/^commit [0-9a-f]{40}$/gm) ?? []).length;
  console.log(`scheduled history sweep — ${reachable} reachable commit(s) per git rev-list --all --count; the scan walked ${walked}; ${PATTERNS.length} pattern(s), ${(log.length / 1e6).toFixed(2)} MB of diff`);
  if (walked !== reachable) {
    console.log(`REFUSED — the scan walked ${walked} commit(s) but ${reachable} are reachable. It did not see all of history, so a CLEAN result would mean nothing.`);
    return 2;
  }
  if (reachable < 2) {
    console.log(`REFUSED — only ${reachable} commit(s) are reachable; this is not a full history.`);
    return 2;
  }
  const dispositions = existsSync(DISPOSITIONS) ? JSON.parse(readFileSync(DISPOSITIONS, "utf8")).dispositions : [];
  const { dispositioned, undispositioned, stale } = partitionHits(scan(log, "reachable-history"), dispositions);

  for (const { hit, disposition } of dispositioned) {
    console.log(`DISPOSITIONED [${hit.name}] ${hit.file}\n    ${disposition.reason}\n    dispositioned ${disposition.dispositionedOn} · line sha256 ${disposition.sha256.slice(0, 16)}…`);
  }
  // BOTH are reported before returning. An earlier draft returned on the stale list first, which
  // would have let a stale record hide a genuinely new secret found in the same run — the more
  // urgent of the two, silenced by the less.
  if (undispositioned.length) {
    console.log(`\nFOUND ${undispositioned.length} secret-shaped hit(s) with no disposition:`);
    for (const { hit, key } of undispositioned) console.log(`  [${hit.name}] ${hit.file}\n      ${hit.line}\n      line sha256 ${key}`);
    console.log("\nEvery hit is named and dispositioned in writing, or the sweep stays red. A hit nobody can account for is a finding, never an entry in that file.");
  }
  if (stale.length) {
    console.log(`\nSTALE DISPOSITION(S) — ${stale.length} recorded hit(s) no longer match anything in history:`);
    for (const d of stale) console.log(`  [${d.pattern}] ${d.file} — ${d.sha256.slice(0, 16)}… (${d.reason})`);
    console.log("History cannot normally lose a line, so this means the disposition file is wrong or history was rewritten. Re-derive the list; do not delete the entry to make this quiet.");
  }
  if (undispositioned.length || stale.length) return 1;
  console.log(`\nCLEAN — ${dispositioned.length} known fixture hit(s), each dispositioned above; no secret-shaped content in reachable history that is not accounted for.`);
  return 0;
}

// The same pattern set, pointed at what is about to be committed instead of at what already was.
// A-7's R5. Reuse rather than a second scanner is the whole point: two secret matchers drift
// apart, and the one you are not looking at is the one that goes quiet.
//
// SCOPE, stated because it is narrower than it looks: this sees the STAGED DIFF only. It cannot
// catch a secret already committed (that is `sweep()`), and it is a local hook, so it protects
// this machine and not the repository — core.hooksPath is per-clone config, never a repo-wide
// guarantee. It is the cheap first layer of a three-layer stack, not the stack.
function staged() {
  const diff = execFileSync("git", ["diff", "--cached", "--no-color"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const hits = scan(diff, "staged");
  if (!hits.length) {
    console.log(`pre-commit sweep — CLEAN (${PATTERNS.length} pattern(s) over the staged diff).`);
    return 0;
  }
  console.log(`pre-commit sweep — COMMIT BLOCKED, ${hits.length} secret-shaped hit(s) staged:`);
  for (const h of hits) console.log(`  [${h.name}] ${h.file}\n      ${h.line}`);
  console.log(`Nothing was committed. Credentials come from the operator's environment at run time,`);
  console.log(`never from a repo file — remove the value and re-stage. This repo is PUBLIC.`);
  return 1;
}

// W-4/KP-78: a sweep that has never been shown to FIRE is indistinguishable from a sweep that
// cannot. Each pattern gets a positive fixture (must match) and the corpus gets a negative one
// (realistic repo content that must NOT match), so "clean" carries information.
function selftest() {
  const FIRE = [
    ["github-pat", "  GITHUB_TOKEN=ghp_A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8"],
    ["github-fine-grained-pat", "github_pat_11ABCDEFG0abcdefghijklmnopqrstuvwxyz012345"],
    ["github-oauth", "token: gho_A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8"],
    ["anthropic-key", "key = 'sk-ant-api03-AAAAAAAAAAAAAAAAAAAAAAAAAAAA'"],
    ["openai-key", "OPENAI: sk-proj-abcdefghijklmnopqrstuvwxyz0123456789"],
    ["stripe-live-key", "sk_live_abcdefghijklmnopqrstuvwx"],
    ["aws-access-key", "aws_access_key_id = AKIAIOSFODNN7EXAMPLE"],
    ["slack-token", "xoxb-123456789012-abcdefghijklmnop"],
    ["sentry-auth-token", "sntrys_abcdefghijklmnopqrstuvwxyz0123"],
    ["private-key-block", "-----BEGIN RSA PRIVATE KEY-----"],
    ["jwt", "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc"],
    ["db-url-with-password", "DATABASE_URL=postgres://user:hunter2hunter2@db.host:5432/x"],
    ["secret-assignment", "CC_PROMPTS_PIN=8f3a2b91c0d4e5f6a7b8c9d0e1f2a3b4"],
  ];
  // Every pattern must own a fixture. Without this, adding a pattern with no fixture leaves it
  // untested and the sweep still prints CLEAN — which is how two broken patterns (sentry-auth-token,
  // secret-assignment) shipped in this file's first draft and reported a clean history anyway.
  const covered = new Set(FIRE.map(([name]) => name));
  const uncovered = PATTERNS.map(([name]) => name).filter((n) => !covered.has(n));
  if (uncovered.length) {
    console.error(`history-sweep selftest FAIL: pattern(s) with no fixture — untested, and a clean sweep would not prove they work: ${uncovered.join(", ")}`);
    return 1;
  }

  for (const [want, line] of FIRE) {
    const hits = scan(`+++ b/fixture.txt\n${line}`, "fixture");
    if (!hits.some((h) => h.name === want)) {
      console.error(`history-sweep selftest FAIL: pattern "${want}" did not fire on its own fixture`);
      console.error(`  line: ${line}`);
      return 1;
    }
  }

  // Content this repo actually contains, which must stay silent. Commit shas and the mirror's
  // mathematics are the realistic false-positive sources here.
  const SILENT = [
    `"sha": "621429cb2e2599bc4d174673224ac95365ea1a64"`,
    `| $1.19102809^{*}$ | [K2026] | directed-rounding certificate |`,
    `| $0.380868$ | [YLTLYSTYLLGDHZSWZSHMELCZX2026] | SimpleTES |`,
    `- [H2016] Haugland, J. K. arXiv:1609.08000 (2016).`,
    `GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
    `API_KEY=your-key-here`,
    `password: <redacted>`,
    `$$\\sup_{x \\in [-2,2]} \\int_{-1}^1 f(t) g(x+t)\\ dt\\geq C_{1b}$$`,
  ];
  for (const line of SILENT) {
    const hits = scan(`+++ b/fixture.txt\n${line}`, "fixture");
    if (hits.length) {
      console.error(`history-sweep selftest FAIL: false positive [${hits[0].name}] on realistic content`);
      console.error(`  line: ${line}`);
      return 1;
    }
  }
  // A-7 R7: the disposition mechanism, both polarities. A dispositioned hit must pass; the SAME
  // file with a DIFFERENT line must still fire (which is what an allowlist by path would not do);
  // and a disposition matching nothing must fail rather than sit there rotting.
  const hitsFor = (line, file = "fixture.txt") => scan(`+++ b/${file}\n${line}`, "fixture");
  const planted = hitsFor("  GITHUB_TOKEN=ghp_A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8", "docs/findings/known.md");
  // One planted line fires TWO patterns, so a disposition is written per (pattern, file, line):
  // dispositioning one of them must NOT silence the other.
  const keyOf = (h) => createHash("sha256").update(`${h.name}|~|${h.file}|~|${h.full}`).digest("hex");
  const list = planted.map((h) => ({ pattern: h.name, file: h.file, sha256: keyOf(h), reason: "fixture", dispositionedOn: "2026-09-17" }));
  const same = partitionHits(planted, list);
  if (same.dispositioned.length !== planted.length || same.undispositioned.length || same.stale.length) {
    console.error(`history-sweep selftest FAIL: a dispositioned hit was not recognised (${JSON.stringify(same.undispositioned.map((u) => u.hit.name))})`);
    return 1;
  }
  const partial = partitionHits(planted, [list[0]]);
  if (partial.dispositioned.length !== 1 || partial.undispositioned.length !== planted.length - 1) {
    console.error("history-sweep selftest FAIL: dispositioning ONE pattern on a line must leave the line's other pattern firing");
    return 1;
  }
  const other = partitionHits(hitsFor("  GITHUB_TOKEN=ghp_Z9y8X7w6V5u4T3s2R1q0P9o8N7m6L5k4J3i2", "docs/findings/known.md"), list);
  if (other.undispositioned.length !== planted.length || other.stale.length !== list.length) {
    console.error("history-sweep selftest FAIL: a DIFFERENT secret in the same file must still fire, and the unmatched dispositions must read as stale");
    return 1;
  }
  // A secret-shaped line in a COMMIT MESSAGE is reported as one, and never attributed to the file
  // the previous commit ended on.
  const msgHits = scan([
    "+++ b/scripts/innocent.mjs",
    "+const x = 1;",
    "commit 0123456789abcdef0123456789abcdef01234567",
    "    dismissing an alert for ghp_A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8",
  ].join("\n"), "fixture");
  if (msgHits.length !== 1 || msgHits[0].file !== "(commit message)") {
    console.error(`history-sweep selftest FAIL: a secret-shaped line in a commit message was reported as ${JSON.stringify(msgHits.map((h) => h.file))}, expected ["(commit message)"]`);
    return 1;
  }
  const rotted = partitionHits([], list);
  if (rotted.stale.length !== list.length) {
    console.error("history-sweep selftest FAIL: a disposition matching nothing must be reported as stale");
    return 1;
  }
  console.log(`history-sweep selftest: PASS (${FIRE.length} patterns each fired on their fixture; ${SILENT.length} realistic lines stayed silent; a dispositioned hit passes, a different secret in the same file still fires, and a disposition matching nothing reads as stale)`);
  return 0;
}

try {
  const mode = process.argv.includes("--selftest") ? selftest
    : process.argv.includes("--staged") ? staged
    : process.argv.includes("--scheduled") ? scheduled
    : process.argv.includes("--list-keys") ? listKeys
    : sweep;
  process.exitCode = mode();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exitCode = 2;
}
