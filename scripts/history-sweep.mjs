#!/usr/bin/env node
// Verified no-secrets sweep over the FULL reachable git history — the A-13 public-flip gate.
//
// usage: history-sweep.mjs [--selftest]
// exit 0 = no secret-shaped content found in any reachable commit · 1 = hits · 2 = error
//
// WHY THIS IS A GATE, NOT A MONITOR. Flipping this repo public exposes every commit, not just
// the tip. This runs once before that decision and its output goes in the flip package. It is
// deliberately NOT wired into CI: the SCHEDULED history-sweep control is A-7's R7, which is a
// coordinated fleet fix with shared recipes, and the 2026-07-29 dispatch was explicit that this
// lane must not solve it locally ahead of that wave. Standing one up here would diverge the
// solution. So: gate now, fleet-owned monitor later.
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
    const fm = line.match(/^\+\+\+ b\/(.+)$/);
    if (fm) { file = fm[1]; continue; }
    if (ALLOW.some((re) => re.test(line)) || ALLOW.some((re) => re.test(file))) continue;
    for (const [name, re] of PATTERNS) {
      if (re.test(line)) hits.push({ name, file, line: line.slice(0, 160), where: label });
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
  console.log(`history-sweep selftest: PASS (${FIRE.length} patterns each fired on their fixture; ${SILENT.length} realistic lines stayed silent)`);
  return 0;
}

try {
  const mode = process.argv.includes("--selftest") ? selftest : process.argv.includes("--staged") ? staged : sweep;
  process.exitCode = mode();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exitCode = 2;
}
