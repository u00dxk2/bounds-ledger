#!/usr/bin/env node
// check-resolvability.mjs — A-45, the Tier-1 LEADING indicator approved 2026-09-06.
//
// THE QUESTION. Of every value this ledger has ever superseded, what fraction can a reader arriving
// with the OLD number still resolve to the constant's current row? That is the precondition for G-4:
// a citing mathematician who cannot find the record they hold cannot act on it.
//
// WHY IT IS NOT A TRAFFIC METRIC, and why it can be read at one viewer a fortnight. It is a property
// of the ARTIFACT, not of an audience. It reads the built page and committed history; it never reads
// a visitor, and the published page carries no analytics by deliberate design.
//
// WHY THE DENOMINATOR COMES FROM GIT HISTORY AND NOT FROM THE RENDERER. The obvious implementation
// — take each row's upperPrev/lowerPrev and check they are in the haystack — is CIRCULAR and would
// print 100% forever, because findKey() builds the haystack FROM those same fields. The failure this
// indicator exists to catch is exactly the one that circularity hides: on 2026-09-05 the value
// 0.380927 vanished from the haystack the moment upstream rewrote the cell, because it survived only
// in a hand claim's superseded expect (fixed in 88fe58f by hand-curated searchAliases). So the
// denominator is read from the COMMITTED HISTORY of ledger/claims.json — every distinct `expect` any
// claim has ever carried — which is independent of what the current render happens to include.
//
// THE LIMIT, DISCLOSED IN THE OUTPUT AND NOT ONLY HERE (A-45 note5). The denominator is OURS. A value
// a constant carried BEFORE we started pinning it is not in this history, so 100% means "every value
// we know we superseded resolves", never "every stale value in circulation resolves". That gap is not
// closable from our own history. Same family as the catches ceiling: the honest form of the number
// carries its own limit.

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// A claims row's `expect` is often a whole markdown table row. The comparable token is its first
// cell, which is what boundCell() in lookup.mjs extracts for the same reason. Kept local and tiny
// rather than imported so this file can be reasoned about on its own.
export function firstCell(expect) {
  if (typeof expect !== "string") return "";
  const s = expect.trim();
  if (!s.startsWith("|")) return s;
  const parts = s.split("|").map((x) => x.trim()).filter((x) => x.length);
  return parts.length ? parts[0] : s;
}

// Every distinct (constantId, value) this ledger has ever pinned, read from committed history.
export function historicalValues(root = ROOT, runner = gitShow) {
  const shas = execFileSync("git", ["-C", root, "log", "--format=%H", "--", "ledger/claims.json"], {
    encoding: "utf8",
  })
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const seen = new Map(); // value -> Set(constantId)
  for (const sha of shas) {
    let parsed;
    try {
      parsed = JSON.parse(runner(root, sha));
    } catch {
      continue; // a commit where the file did not parse is skipped, not fatal
    }
    const rows = Array.isArray(parsed) ? parsed : parsed.claims || [];
    for (const c of rows) {
      const v = firstCell(c.expect).toLowerCase();
      if (!v) continue;
      const id = c.constant || c.id || "";
      if (!seen.has(v)) seen.set(v, new Set());
      seen.get(v).add(id);
    }
  }
  return seen;
}

function gitShow(root, sha) {
  return execFileSync("git", ["-C", root, "show", `${sha}:ledger/claims.json`], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

// The haystacks a reader actually searches, read OUT of the built page rather than re-derived from
// the renderer — the assertion and the artefact must come from the same surface.
export function haystacks(html) {
  const out = [];
  const re = /data-find="([^"]*)"/g;
  let m;
  while ((m = re.exec(html))) out.push(m[1].toLowerCase());
  return out;
}

// A reader does not type our pin's markup — they type the NUMBER they are holding, off a paper.
// So the comparison is on numeric cores, not on the stored string. Two defects in the first draft
// made this necessary and both were visible in its own MISSES list, which is the only reason they
// were caught (2026-09-06, first real run):
//
//   FALSE MISS. "$>6.514326913930565372$" was reported unresolvable while the bare digits sit in the
//   haystack — the decoration failed the substring test, not the value. Half the first run's misses
//   were this shape, so the headline would have understated coverage in a known direction.
//
//   CONTAMINATED DENOMINATOR. Rows like 'prize: "no"' and 'this page was last edited 23 january
//   2026.' are metadata pins, not bounds. No reader arrives holding them, so counting them as
//   unresolvable VALUES is a category error. They are excluded and REPORTED as excluded — never
//   silently dropped, because a denominator that quietly shrinks is its own defect.
//
// Four or more digits: short enough to catch 0.860 and 3.792, long enough that a lone "2" or a year
// fragment does not match half the page by accident.
export function numericCores(s) {
  return [...String(s).matchAll(/\d[\d.]{3,}/g)].map((m) => m[0].replace(/\.+$/, "")).filter((x) => x.length >= 4);
}

export function resolvability(html, values) {
  const keys = haystacks(html);
  const hits = [];
  const misses = [];
  const excluded = [];
  for (const [value, ids] of values) {
    const cores = numericCores(value);
    const row = { value, ids: [...ids].join(",") };
    if (!cores.length) {
      excluded.push(row); // a metadata pin: no number a reader could be holding
      continue;
    }
    row.cores = cores;
    const found = cores.some((c) => keys.some((k) => k.includes(c)));
    (found ? hits : misses).push(row);
  }
  return { hits, misses, excluded, keys: keys.length };
}

function main() {
  const html = readFileSync(path.join(ROOT, "index.html"), "utf8");
  const values = historicalValues();
  const { hits, misses, excluded, keys } = resolvability(html, values);
  const M = hits.length + misses.length;

  console.log(`# Stale-value resolvability — A-45, ${new Date().toISOString()}`);
  console.log("");
  if (M === 0) {
    console.log("RESULT: NOTHING SWEPT — the denominator is empty (0 historical values read).");
    console.log("A zero denominator is not 100%: it means the history read found nothing, so this");
    console.log("says nothing about coverage. Check that ledger/claims.json has commit history.");
    process.exit(2);
  }

  const pct = ((hits.length / M) * 100).toFixed(1);
  console.log(`resolvability: ${hits.length} of ${M} (${pct}%) — UNCALIBRATED, see below`);
  console.log("");
  console.log("*** THE FRACTION IS NOT YET QUOTABLE. Read the MISSES; do not quote the percentage. ***");
  console.log("  Measured on the first real run, 2026-09-06, in BOTH directions — so this is a stated");
  console.log("  limit, not a caveat hedging an unexamined number:");
  console.log("  - OVER-EXCLUDES. The value/non-value split is 'has a numeric run of 4+ digits', which");
  console.log("    drops short integer and symbolic bounds a reader really could be holding — $0.5$,");
  console.log("    432, $668$, $1+\\sqrt{2}$ are all in the excluded list and several are genuine");
  console.log("    records. So the denominator is smaller than the true population.");
  console.log("  - LEAKS IN. 'this page was last edited 23 january 2026.' is counted as a value");
  console.log("    because 2026 is a 4-digit run. So the denominator also contains a non-value.");
  console.log("  Both directions move the percentage and neither is bounded yet. The MISSES list is");
  console.log("  the useful output today; the ratio becomes quotable when the split is calibrated.");
  console.log("");
  console.log("SEARCH SPACE, named so the figure is auditable:");
  console.log(`  denominator — every distinct first-cell 'expect' value in the committed history of`);
  console.log(`    ledger/claims.json (git log -- ledger/claims.json, then git show <sha>:ledger/claims.json)`);
  console.log(`  numerator   — those whose NUMERIC CORE appears in any data-find="..." attribute of`);
  console.log(`    the BUILT index.html (${keys} row haystacks read out of the page, not re-derived).`);
  console.log(`    Numeric cores, not raw strings: a reader types the number off a paper, never our`);
  console.log(`    markup, so "$>6.514326913930565372$" must match on its digits.`);
  console.log(`  excluded    — ${excluded.length} pinned string(s) carrying no number a reader could hold`);
  console.log(`    (metadata pins: status fields, tag lists, a wiki footer). Reported, never dropped`);
  console.log(`    silently — a denominator that quietly shrinks is its own defect.`);
  console.log("");
  if (misses.length) {
    console.log(`MISSES — a reader holding one of these gets the empty state:`);
    for (const m of misses) {
      console.log(`  ${m.value}`);
      console.log(`      digits a reader would type: ${m.cores.join(", ")}   (last pinned for ${m.ids || "unknown"})`);
    }
    console.log("");
  }
  if (excluded.length) {
    console.log(`EXCLUDED as non-value pins (shown so the denominator is auditable):`);
    for (const e of excluded) console.log(`  ${e.value.replace(/\s+/g, " ").slice(0, 90)}   (${e.ids || "unknown"})`);
    console.log("");
  }
  console.log("THE LIMIT, which travels with the figure and is not optional (A-45 note5):");
  console.log("  This denominator is OURS. A value a constant carried BEFORE this ledger started");
  console.log("  pinning it is not counted here, so a 100% reading means 'every value we know we");
  console.log("  superseded resolves' — never 'every stale value in circulation resolves'. That gap");
  console.log("  cannot be closed from our own history. Quote the figure with this sentence or not");
  console.log("  at all.");
  console.log("");
  console.log(`RESULT: ${hits.length} of ${M} resolvable (${pct}%) — a figure, not a verdict (exit 0)`);
  process.exit(0);
}

function selftest() {
  // firstCell pulls the comparable token out of a markdown row, and passes a bare value through.
  assert.equal(firstCell("| $0.380927$ | src |"), "$0.380927$", "a table row yields its first cell");
  assert.equal(firstCell("0.380868"), "0.380868", "a bare value passes through");
  assert.equal(firstCell(null), "", "a non-string is empty, never a crash");

  // haystacks reads the attribute OUT of the page. Positive control first: it must find something
  // before any absence below is meaningful.
  const page = '<tr id="c-1b" data-find="erdos 1b 0.380926 0.380927"></tr><tr data-find="crouzeix 2a 1.5"></tr>';
  const keys = haystacks(page);
  assert.equal(keys.length, 2, "positive control: both row haystacks are read before any miss is asserted");
  assert.ok(keys[0].includes("0.380927"), "positive control: the superseded value is present in the fixture");

  // FIRES: a value absent from every haystack is reported as a MISS — the 88fe58f failure mode.
  const values = new Map([
    ["0.380927", new Set(["C-2"])],
    ["0.380926", new Set(["C-2"])],
    ["9.99887766", new Set(["C-3"])],
  ]);
  const r = resolvability(page, values);
  assert.equal(r.hits.length, 2, "the two values present in the haystack resolve");
  assert.equal(r.misses.length, 1, "the value in no haystack is a MISS");
  assert.equal(r.misses[0].value, "9.99887766", "the MISS names the value a reader would arrive with");

  // SILENT: with the missing value aliased into the haystack, the miss disappears. Both polarities
  // on one fixture, which is what KP-78 asks for.
  const aliased = page.replace('data-find="crouzeix 2a 1.5"', 'data-find="crouzeix 2a 1.5 9.99887766"');
  assert.notEqual(aliased, page, "positive control: the alias mutation actually landed on the fixture");
  const r2 = resolvability(aliased, values);
  assert.equal(r2.misses.length, 0, "an aliased value resolves and the miss clears");
  assert.equal(r2.hits.length, 3, "all three now resolve");

  // A zero denominator must NOT read as 100%. This is the prove-the-zero half: an empty history and
  // a fully-covered history are different answers and must not render alike.
  const empty = resolvability(page, new Map());
  assert.equal(empty.hits.length + empty.misses.length, 0, "an empty denominator stays empty");

  // numericCores models what a reader TYPES. Both defects the first real run exposed are pinned here
  // so neither can come back silently.
  assert.deepEqual(numericCores("$>6.514326913930565372$"), ["6.514326913930565372"], "LaTeX decoration is stripped to the digits");
  assert.deepEqual(numericCores('prize: "no"'), [], "a metadata pin yields no number a reader could hold");
  assert.deepEqual(numericCores("0.379005 &lt; c &lt; 0.380876"), ["0.379005", "0.380876"], "an HTML-escaped range yields both endpoints");
  assert.deepEqual(numericCores("| $3$ | src |"), [], "a lone short digit is not a citable value");

  // FIRES: a DECORATED superseded value whose digits ARE in the haystack must resolve — the false
  // miss that would have understated the headline. The raw-string comparison this replaced fails it.
  const decorated = '<tr data-find="steiner 71a 6.514326913930565372"></tr>';
  const decoratedVals = new Map([["$>6.514326913930565372$", new Set(["C-71"])]]);
  assert.ok(decorated.includes("6.5143"), "positive control: the fixture haystack really carries the digits");
  const dr = resolvability(decorated, decoratedVals);
  assert.equal(dr.hits.length, 1, "a decorated value resolves on its digits");
  assert.equal(dr.misses.length, 0, "and is NOT reported as a miss");

  // SILENT the other way: change the haystack digits and it becomes a real miss, so the leg above
  // is not passing because the matcher matches everything.
  const dr2 = resolvability('<tr data-find="steiner 71a 9.999999999"></tr>', decoratedVals);
  assert.equal(dr2.misses.length, 1, "a value whose digits are absent is still a genuine miss");

  // Metadata pins leave the denominator and are REPORTED, never silently dropped.
  const meta = new Map([['prize: "no"', new Set(["C-8"])], ["0.380927", new Set(["C-2"])]]);
  const mr = resolvability(page, meta);
  assert.equal(mr.excluded.length, 1, "the metadata pin is excluded");
  assert.equal(mr.excluded[0].ids, "C-8", "and the exclusion names which claim it came from");
  assert.equal(mr.hits.length + mr.misses.length, 1, "only the value-bearing pin is in the denominator");

  console.log(
    "check-resolvability selftest: PASS (firstCell splits a table row and passes a bare value; " +
      "haystacks reads data-find out of the page with a positive control that both rows were read " +
      "before any absence; a value in no haystack is reported as a MISS naming the value, the same " +
      "value aliased into a haystack clears the miss with the mutation proven to land, and an empty " +
      "denominator does not render as full coverage)"
  );
}

const arg = process.argv[2];
if (arg === "--selftest") selftest();
else if (arg === "--help") {
  console.log("usage: check-resolvability.mjs [--selftest]");
  console.log("Prints the A-45 stale-value resolvability figure with its search space and its limit.");
  console.log("Exit 0 with a figure; exit 2 when the denominator is empty (NOTHING SWEPT, never 100%).");
} else main();
