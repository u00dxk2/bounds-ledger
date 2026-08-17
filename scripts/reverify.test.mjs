#!/usr/bin/env node
// Self-check for reverify.mjs drift detection — no network. Copies the ledger snapshot,
// verifies a pristine copy reads clean (exit 0) and a tampered digit is flagged (exit 1).

import { cp, readFile, writeFile, rm, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import assert from "node:assert";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER = join(ROOT, "ledger", "teorth-optimizationproblems");
const SNAP = join(LEDGER, "constants");
const TMP = join(ROOT, "tmp", "reverify-test-live");
const SCRIPT = join(ROOT, "scripts", "reverify.mjs");

function runCheck() {
  try {
    return { code: 0, out: execFileSync("node", [SCRIPT, "--check", "--live-dir", TMP], { encoding: "utf8" }) };
  } catch (err) {
    return { code: err.status, out: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

// The live side is a mirror-shaped copy: constants/ plus the mirrored root files.
// manifest.json is deliberately NOT copied — it is ours, not upstream's.
const freshLive = async () => {
  await rm(TMP, { recursive: true, force: true });
  await cp(LEDGER, TMP, { recursive: true });
  await rm(join(TMP, "manifest.json"), { force: true });
};

await freshLive();

const clean = runCheck();
assert.equal(clean.code, 0, `pristine copy should be clean, got exit ${clean.code}:\n${clean.out}`);

const victim = (await readdir(SNAP)).find((n) => n.endsWith(".md"));
const orig = await readFile(join(TMP, "constants", victim), "utf8");
const tampered = orig.replace(/([0-9])([^0-9]*)$/s, (m, d, rest) => `${(Number(d) + 1) % 10}${rest}`);
assert.notEqual(tampered, orig, "tamper produced no change — no digit found?");
await writeFile(join(TMP, "constants", victim), tampered);

const dirty = runCheck();
assert.equal(dirty.code, 1, `tampered copy should exit 1, got ${dirty.code}`);
assert.ok(dirty.out.includes(`CHANGED constants/${victim}`), `report should name constants/${victim}:\n${dirty.out}`);
// SILENT half for W-5: a constants edit must NOT drag the README into the report.
// Without this, a mirror that reported every file on every run would pass the FIRES
// assertion below while carrying no information about which surface actually moved.
// Match VERDICT lines only — the report header names the whole watched surface,
// README included, and asserting on the raw text failed on that header the first
// time it ran. The alarm was right; the assertion was reading the wrong line.
const verdicts = (out) => out.split("\n").filter((l) => /^(CHANGED|ADDED|REMOVED) /.test(l));
assert.deepEqual(verdicts(dirty.out), [`CHANGED constants/${victim}`], `a constants-only edit should name exactly that one file:\n${dirty.out}`);

// ---- W-5: the README leg, proven BOTH ways ----------------------------------
// Upstream's README is where it declares which rows it will STAND BEHIND. On
// 2026-08-02 a demotion to asterisked-unverified left every bounds table
// byte-identical and our alarm said nothing. FIRES: reproduce that edit shape.
await freshLive();
const readmePath = join(TMP, "README.md");
const readme = await readFile(readmePath, "utf8");
// Upstream's asterisk convention is a bare `*` appended to the bound value inside
// the row (e.g. `1.2802 (1.292*)`), so the fixture appends one to the last cell of
// a real table row — the same shape as marking a record unverified.
const anchor = readme.split("\n").find((l) => /^\| \[\w+\]\(http/.test(l));
assert.ok(anchor, "no constants-table row found in upstream README — the asterisk fixture needs rewriting");
const asterisked = anchor.replace(/\s*\|\s*$/, "* |");
assert.notEqual(asterisked, anchor, "asterisk fixture produced no change");
await writeFile(readmePath, readme.replace(anchor, asterisked));

const readmeDirty = runCheck();
assert.equal(readmeDirty.code, 1, `an asterisked README row should exit 1, got ${readmeDirty.code}`);
assert.deepEqual(verdicts(readmeDirty.out), ["CHANGED README.md"], `a README-only edit should name exactly README.md:\n${readmeDirty.out}`);
assert.ok(readmeDirty.out.includes(`+ ${asterisked}`), `report should show the asterisked row verbatim:\n${readmeDirty.out}`);

// SILENT: restore it and the same run goes quiet. A detector that cannot go quiet
// is indistinguishable from one that is stuck on.
await writeFile(readmePath, readme);
const readmeClean = runCheck();
assert.equal(readmeClean.code, 0, `restored README should be clean, got exit ${readmeClean.code}:\n${readmeClean.out}`);

// REMOVED: a mirrored root file that vanishes is drift, not a silent pass.
await rm(readmePath, { force: true });
const readmeGone = runCheck();
assert.equal(readmeGone.code, 1, `a missing README should exit 1, got ${readmeGone.code}`);
assert.ok(readmeGone.out.includes("REMOVED README.md"), `report should name the removal:\n${readmeGone.out}`);

await rm(TMP, { recursive: true, force: true });

// The script exiting 1 is worthless if the WORKFLOW swallows it. Default runner shell is
// `bash -e {0}` (no pipefail), so a piped step reports the pipe's last command — a drift
// exits green. Every piped `run:` must name `shell: bash` (which adds -o pipefail).
const wf = (await readFile(join(ROOT, ".github", "workflows", "reverify.yml"), "utf8")).replace(/^[ \t]*#.*$/gm, "");
const steps = wf.split(/^      - name:/m).slice(1);
// strip the YAML block-scalar indicator (`run: |`) first — it is not a shell pipe
const runBody = (s) => (s.match(/^\s*run:[\s\S]*/m)?.[0] ?? "").replace(/^\s*run:[ \t]*\|-?[ \t]*$/m, "");
const unguarded = steps.filter((s) => runBody(s).includes("|") && !/^\s*shell:[ \t]*bash[ \t]*$/m.test(s));
assert.equal(unguarded.length, 0, `piped workflow step(s) missing \`shell: bash\` — exit codes will be masked:\n${unguarded.join("\n---\n")}`);

// A self-test that `npm test` runs but the WORKFLOW never executes is the lane's founding
// defect turned on itself (an alarm that isn't armed carries no information) — it left the
// pin extractor unguarded in CI for six days (A-8). The A-8 fix was a hand-added step with
// nothing asserting it stays, so deleting it would be silent. Derived from package.json so
// a newly-added self-test cannot be CI-less either. KP-78: prove the instrument can fail.
const pkg = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
const testCmds = pkg.scripts.test.split("&&").map((c) => c.trim()).filter(Boolean);
const uncied = testCmds.filter((c) => !wf.includes(c));
assert.equal(uncied.length, 0, `self-test(s) run by \`npm test\` but absent from the workflow — unguarded in CI:\n${uncied.join("\n")}`);

// b1 must STAY. A branch with no path to a runner is how `guard-catch-count` sat unvalidated for a
// day, and A-8's lesson is that a hand-added workflow line with nothing asserting it stays can be
// deleted silently. Asserted on the comment-stripped text so a commented-out trigger cannot pass.
assert.match(wf, /^\s*pull_request:\s*$/m, "reverify.yml no longer triggers on `pull_request` — a feature branch gets NO runner verdict, which is the hold-with-no-release-command defect (b1, 2026-08-17)");

console.log(`reverify.test: PASS (synthetic drift in ${victim} detected; pristine copy clean; README leg fires on an asterisked row, silent when restored, REMOVED when deleted, and untouched by a constants-only edit; ${steps.length} workflow steps, piped steps pipefail-guarded; ${testCmds.length} self-tests present in CI)`);
