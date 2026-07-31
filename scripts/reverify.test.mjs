#!/usr/bin/env node
// Self-check for reverify.mjs drift detection — no network. Copies the ledger snapshot,
// verifies a pristine copy reads clean (exit 0) and a tampered digit is flagged (exit 1).

import { cp, readFile, writeFile, rm, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import assert from "node:assert";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SNAP = join(ROOT, "ledger", "teorth-optimizationproblems", "constants");
const TMP = join(ROOT, "tmp", "reverify-test-live");
const SCRIPT = join(ROOT, "scripts", "reverify.mjs");

function runCheck() {
  try {
    return { code: 0, out: execFileSync("node", [SCRIPT, "--check", "--live-dir", TMP], { encoding: "utf8" }) };
  } catch (err) {
    return { code: err.status, out: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

await rm(TMP, { recursive: true, force: true });
await cp(SNAP, TMP, { recursive: true });

const clean = runCheck();
assert.equal(clean.code, 0, `pristine copy should be clean, got exit ${clean.code}:\n${clean.out}`);

const victim = (await readdir(TMP)).find((n) => n.endsWith(".md"));
const orig = await readFile(join(TMP, victim), "utf8");
const tampered = orig.replace(/([0-9])([^0-9]*)$/s, (m, d, rest) => `${(Number(d) + 1) % 10}${rest}`);
assert.notEqual(tampered, orig, "tamper produced no change — no digit found?");
await writeFile(join(TMP, victim), tampered);

const dirty = runCheck();
assert.equal(dirty.code, 1, `tampered copy should exit 1, got ${dirty.code}`);
assert.ok(dirty.out.includes(`CHANGED constants/${victim}`), `report should name constants/${victim}:\n${dirty.out}`);

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

console.log(`reverify.test: PASS (synthetic drift in ${victim} detected; pristine copy clean; ${steps.length} workflow steps, piped steps pipefail-guarded; ${testCmds.length} self-tests present in CI)`);
