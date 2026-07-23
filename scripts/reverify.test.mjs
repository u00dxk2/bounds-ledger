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
console.log(`reverify.test: PASS (synthetic drift in ${victim} detected; pristine copy clean)`);
