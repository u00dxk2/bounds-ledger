#!/usr/bin/env node
// Which open ledger rows carry a readCommand the gate runner will MIS-EXECUTE?
//
// WHY THIS EXISTS, and it is a measurement story rather than a cleanup one. The runner executes a
// `readCommand` with `#` comments stripped, so `command # prose` runs the command and
// `command — prose` runs the whole field. This debt was carried as "15 remaining" from a
// 2026-08-31 retro, re-quoted as 15 in a bonus pitch, corrected to 17 as a stated CEILING (because
// a correctly converted row keeps em dashes inside its prose), and only measured at 9 when
// somebody finally asked the question that decides it: does the em dash come BEFORE the first
// hash? Three figures for one debt, two of them inherited rather than derived. The predicate now
// lives in code so the fourth figure does not have to be discovered the same way.
//
// Renders a figure and a list. No verdict, no exit code above 0 for findings — this is a
// diagnostic, not a gate, and it must never become a permanently-red alarm.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * True when the em dash is acting as the SEPARATOR — i.e. it precedes any `#`, so the runner
 * cannot find a comment marker before the prose starts and executes the lot.
 *
 * A row with no em dash at all is fine. A row whose em dashes all sit AFTER a `#` is also fine:
 * that is a converted row with ordinary prose behind its comment marker, and counting it is what
 * produced the inflated 17.
 */
export function separatorIsBroken(readCommand) {
  if (typeof readCommand !== "string") return false;
  const dash = readCommand.indexOf("—");
  if (dash === -1) return false;
  const hash = readCommand.indexOf("#");
  return hash === -1 || dash < hash;
}

function selftest() {
  // FIRES: em dash used as the separator, with and without a later hash.
  assert.equal(separatorIsBroken("npm run catches — counts movements"), true);
  assert.equal(separatorIsBroken("npm run catches — prose # trailing"), true, "an em dash BEFORE a later hash is still the separator");

  // SILENT: converted rows, including one whose prose keeps em dashes after the hash. This is the
  // case that made the naive count read 17 instead of 9, so it is the load-bearing assertion.
  assert.equal(separatorIsBroken("npm run catches # counts movements — and says so"), false);
  assert.equal(separatorIsBroken("npm run catches # plain prose"), false);
  assert.equal(separatorIsBroken("npm run catches"), false);
  assert.equal(separatorIsBroken(undefined), false);

  // Negative control: a predicate that merely looked for an em dash ANYWHERE would call the
  // converted row above broken. Proving that here means the assertion above tests the ordering
  // rather than the presence — without it, both could pass on a weaker implementation.
  const naive = (s) => typeof s === "string" && s.includes("—");
  assert.equal(naive("npm run catches # counts movements — and says so"), true);
  assert.notEqual(naive("npm run catches # counts movements — and says so"), separatorIsBroken("npm run catches # counts movements — and says so"));

  console.log("check-readcommand-separators selftest: PASS (fires on an em-dash separator with and without a later hash; silent on a converted row whose prose keeps em dashes, on plain prose, on a bare command and on undefined; a presence-only predicate proven to disagree, so the ordering is what is being tested)");
}

function main() {
  const raw = JSON.parse(readFileSync(join(ROOT, "continuity", "items.json"), "utf8"));
  const items = Array.isArray(raw) ? raw : raw.items;
  const open = items.filter((it) => it.status === "open");
  const broken = open.filter((it) => separatorIsBroken(it.readCommand));

  console.log(`# readCommand separators — ${new Date().toISOString()}`);
  console.log(`${broken.length} of ${open.length} open row(s) carry an em-dash SEPARATOR the runner will mis-execute.`);
  for (const it of broken) {
    const date = it.expectedSignalBy || it.nextCheckDate || "no-date";
    console.log(`  ${it.id.padEnd(5)} ${date}  ${it.readCommand.slice(0, it.readCommand.indexOf("—")).trim()}`);
  }
  console.log(`Counting em dashes ANYWHERE in a readCommand over-reports: a converted row keeps them in its prose.`);
  console.log(`Convert a row when its gate comes due, or at pre-stage — not in a sweep, so the rows that run get the attention.`);
}

process.argv.includes("--selftest") ? selftest() : main();
