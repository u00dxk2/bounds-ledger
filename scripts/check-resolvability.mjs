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

// THE POPULATION, NAMED BY KIND (A-45 calibration, 2026-09-13). The first split was "carries a 4+
// digit run", which dropped genuine short bounds ($668$, $1+\sqrt{2}$) and let in a wiki footer whose
// year satisfied the rule — wrong in both directions, by an unbounded amount. A pin's KIND is known
// without looking at its digits: a generated pin:<id>:U|L always pins a bound cell of constant <id>,
// and each hand claim is declared below. null = the claim pins page STATE (a yaml status, an edit
// date, a tag list), which no reader arrives holding. A hand claim missing from this table is
// UNCLASSIFIED and the run refuses rather than guessing a bucket for it.
export const HAND_CLAIMS = {
  "C-1": "1b", "C-2": "1b", "C-3": "1b", "C-4": "1b", "C-5": "1b", "C-6": "1b", "C-7": "1b", "C-10": "1b",
  "C-8": null, "C-9": null, "C-11": null,
};

export function constantOf(id) {
  const m = /^pin:([^:]+):[UL]$/.exec(id);
  if (m) return m[1];
  return Object.hasOwn(HAND_CLAIMS, id) ? HAND_CLAIMS[id] : undefined;
}

// Row id -> haystack. A value must reach ITS OWN constant's row: a digit run that happens to sit in
// some other constant's row answers nothing a reader asked. Refuses when the rows it keyed do not
// account for every data-find on the page, because a row it cannot key would be read as a MISS.
export function rowHaystacks(html) {
  const rows = new Map();
  for (const m of html.matchAll(/<tr id="c-([^"]+)" data-find="([^"]*)"/g)) {
    const hay = m[2].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    rows.set(m[1].toLowerCase(), hay.toLowerCase());
  }
  const all = haystacks(html).length;
  if (rows.size !== all) throw new Error(`keyed ${rows.size} row(s) but the page carries ${all} data-find attribute(s)`);
  return rows;
}

const squash = (s) => String(s).replace(/[$\s]/g, "");

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
  const rows = rowHaystacks(html);
  const hits = [];
  const misses = [];
  const excluded = [];
  const unclassified = [];
  for (const [value, ids] of values) {
    const idList = [...ids];
    const row = { value, ids: idList.join(",") };
    const cids = idList.map(constantOf);
    if (cids.some((c) => c === undefined)) {
      unclassified.push({ ...row, unknown: idList.filter((id) => constantOf(id) === undefined).join(",") });
      continue;
    }
    const own = [...new Set(cids.filter(Boolean))];
    if (!own.length) {
      excluded.push(row); // every pin carrying this string pins page STATE, not a bound
      continue;
    }
    row.rows = own;
    // A row named by a pin but absent from the page cannot be reached at all; that is a MISS about
    // the page, not about the value, and it is said in those words rather than scored as resolved.
    row.missingRows = own.filter((c) => !rows.has(c));
    const hays = own.map((c) => rows.get(c)).filter(Boolean);
    const cores = numericCores(value);
    row.cores = cores;
    // A value with no 4+ digit core is still a citable bound ($668$, $1+\sqrt{2}$). It is matched on
    // its own text with $ and spaces squashed out, and COUNTED in a stratum of its own, because a
    // reader searching a short value reaches its row among many — resolvable, but imprecise, and the
    // size of that stratum is the bound on how much it can flatter the figure.
    row.short = cores.length === 0;
    const found = cores.length
      ? cores.some((c) => hays.some((h) => h.includes(c)))
      : Boolean(squash(value)) && hays.some((h) => squash(h).includes(squash(value)));
    (found ? hits : misses).push(row);
  }
  return { hits, misses, excluded, unclassified, keys: keys.length, rows: rows.size };
}

function main() {
  const html = readFileSync(path.join(ROOT, "index.html"), "utf8");
  const values = historicalValues();
  const { hits, misses, excluded, unclassified, keys, rows } = resolvability(html, values);
  const M = hits.length + misses.length;

  console.log(`# Stale-value resolvability — A-45, ${new Date().toISOString()}`);
  console.log("");
  if (unclassified.length) {
    console.log("RESULT: REFUSED — a pin belongs to no declared kind, so the population is unknown.");
    for (const u of unclassified) console.log(`  ${u.unknown}: ${u.value.slice(0, 80)}`);
    console.log("Classify it in HAND_CLAIMS (a constant id if it pins a bound, null if it pins page");
    console.log("state) and run again. Guessing a bucket is what the 2026-09-13 calibration removed.");
    process.exit(2);
  }
  if (M === 0) {
    console.log("RESULT: NOTHING SWEPT — the denominator is empty (0 historical values read).");
    console.log("A zero denominator is not 100%: it means the history read found nothing, so this");
    console.log("says nothing about coverage. Check that ledger/claims.json has commit history.");
    process.exit(2);
  }

  const shortCount = [...hits, ...misses].filter((r) => r.short).length;
  const pct = ((hits.length / M) * 100).toFixed(1);
  console.log(`resolvability: ${hits.length} of ${M} (${pct}%) — CALIBRATED 2026-09-13, see the limits`);
  console.log("");
  console.log("*** NOT COMPARABLE WITH ANY READING BEFORE 2026-09-13. Two things changed. ***");
  console.log("  The POPULATION is now named by pin KIND, not by digit count: a generated pin:<id>:U|L");
  console.log("  pins a bound cell, and each hand claim is declared as a constant or as page STATE. The");
  console.log("  old split ('a 4+ digit run') dropped genuine short bounds and let a wiki footer in.");
  console.log("  The MATCH is now against the value's OWN constant row, not against any row on the");
  console.log("  page: a digit run sitting in some other constant answers nothing a reader asked.");
  console.log("  WHAT STILL BOUNDS THE FIGURE, both of them counted rather than argued:");
  console.log(`  - SHORT/SYMBOLIC STRATUM: ${shortCount} of ${M} carry no 4+ digit core ($668$, $1+\\sqrt{2}$, $2$).`);
  console.log("    They are real bounds and stay in the denominator, but a reader searching one reaches");
  console.log("    its row among many, so they flatter the figure by at most this count.");
  console.log("  - The page's search text is built from this same pin history, so a high reading is");
  console.log("    partly structural. Read it as a REGRESSION FLOOR, not as a coverage trend.");
  console.log("");
  console.log("SEARCH SPACE, named so the figure is auditable:");
  console.log(`  denominator — every distinct first-cell 'expect' value in the committed history of`);
  console.log(`    ledger/claims.json (git log -- ledger/claims.json, then git show <sha>:ledger/claims.json)`);
  console.log(`    whose pin KIND is a bound (generated pin, or a hand claim declared in HAND_CLAIMS).`);
  console.log(`  numerator   — those reaching their OWN constant's row: the numeric core, or for a short`);
  console.log(`    or symbolic value its own text with $ and spaces squashed, appearing in that row's`);
  console.log(`    data-find="..." attribute in the BUILT index.html (${rows} row(s) keyed, ${keys} read).`);
  console.log(`  excluded    — ${excluded.length} pinned string(s) whose every pin is page STATE, not a bound`);
  console.log(`    (a yaml status, an edit date, a tag list). Excluded BY KIND and reported, never`);
  console.log(`    dropped silently — a denominator that quietly shrinks is its own defect.`);
  console.log("");
  if (misses.length) {
    console.log(`MISSES — a reader holding one of these gets the empty state:`);
    for (const m of misses) {
      console.log(`  ${m.value}`);
      const typed = m.cores.length ? `digits a reader would type: ${m.cores.join(", ")}` : "no digits: matched on its own text";
      console.log(`      ${typed}   (pinned for ${m.ids || "unknown"}, row(s) ${m.rows.join(",")})`);
      if (m.missingRows.length) console.log(`      NOT ON THE PAGE AT ALL: row(s) ${m.missingRows.join(",")} — a page defect, not a value defect`);
    }
    console.log("");
  }
  if (excluded.length) {
    console.log(`EXCLUDED BY KIND as page-state pins (shown so the denominator is auditable):`);
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
  const page = '<tr id="c-1b" data-find="erdos 1b 0.380926 0.380927"></tr><tr id="c-2a" data-find="crouzeix 2a 1.5"></tr>';
  const keys = haystacks(page);
  assert.equal(keys.length, 2, "positive control: both row haystacks are read before any miss is asserted");
  assert.ok(keys[0].includes("0.380927"), "positive control: the superseded value is present in the fixture");
  assert.equal(rowHaystacks(page).size, 2, "positive control: both rows are keyed by their constant id");

  // A row the keyer cannot read would be scored as a MISS, so an unkeyable page REFUSES instead.
  assert.throws(
    () => rowHaystacks('<tr id="c-1b" data-find="erdos"></tr><tr data-find="unkeyed"></tr>'),
    /keyed 1 row\(s\) but the page carries 2/,
    "a data-find the keyer cannot attribute to a row refuses rather than reading as absent"
  );

  // FIRES: a value absent from its own row's haystack is reported as a MISS — the 88fe58f mode.
  const values = new Map([
    ["0.380927", new Set(["C-2"])],
    ["0.380926", new Set(["C-2"])],
    ["9.99887766", new Set(["C-3"])],
  ]);
  const r = resolvability(page, values);
  assert.equal(r.hits.length, 2, "the two values present in their own row resolve");
  assert.equal(r.misses.length, 1, "the value in its own row's haystack is a MISS");
  assert.equal(r.misses[0].value, "9.99887766", "the MISS names the value a reader would arrive with");

  // OWN ROW, not any row (the 2026-09-13 calibration). Aliasing the missing value into a DIFFERENT
  // constant's row must NOT clear the miss; aliasing it into its own row must.
  const wrongRow = page.replace('data-find="crouzeix 2a 1.5"', 'data-find="crouzeix 2a 1.5 9.99887766"');
  assert.notEqual(wrongRow, page, "positive control: the wrong-row mutation actually landed on the fixture");
  assert.equal(resolvability(wrongRow, values).misses.length, 1, "a value found only in ANOTHER constant's row is still a MISS");
  const aliased = page.replace('data-find="erdos 1b 0.380926 0.380927"', 'data-find="erdos 1b 0.380926 0.380927 9.99887766"');
  assert.notEqual(aliased, page, "positive control: the own-row alias mutation actually landed on the fixture");
  const r2 = resolvability(aliased, values);
  assert.equal(r2.misses.length, 0, "an own-row alias resolves and the miss clears");
  assert.equal(r2.hits.length, 3, "all three now resolve");

  // KIND, both polarities on ONE string. The wiki footer leaked into the denominator under the old
  // digit rule because 2026 is a 4-digit run; pinned by C-9 it is page STATE and leaves by kind,
  // while the identical string under a BOUND pin stays in — so the exclusion is the kind, not the text.
  const footer = "this page was last edited 23 january 2026.";
  const asState = resolvability(page, new Map([[footer, new Set(["C-9"])]]));
  assert.equal(asState.excluded.length, 1, "a page-state pin is excluded by kind however many digits it carries");
  assert.equal(asState.hits.length + asState.misses.length, 0, "and it is not in the denominator");
  const asBound = resolvability(page, new Map([[footer, new Set(["pin:1b:U"])]]));
  assert.equal(asBound.excluded.length, 0, "the same string under a bound pin is NOT excluded");
  assert.equal(asBound.hits.length + asBound.misses.length, 1, "it is in the denominator, where kind put it");

  // SHORT AND SYMBOLIC bounds are citable records and are now IN the population, matched on their
  // own text. $668$ is a genuine lower bound the old split dropped.
  const shortPage = '<tr id="c-23a" data-find="ramsey 23a $668$ $\\infty$"></tr>';
  const shortVals = new Map([["$668$", new Set(["pin:23a:L"])]]);
  const sr = resolvability(shortPage, shortVals);
  assert.equal(sr.hits.length, 1, "a short bound present in its own row resolves");
  assert.ok(sr.hits[0].short, "and is counted in the short/symbolic stratum that bounds the figure");
  const sr2 = resolvability('<tr id="c-23a" data-find="ramsey 23a $667$"></tr>', shortVals);
  assert.equal(sr2.misses.length, 1, "a short bound absent from its own row is a genuine MISS");

  // An unclassified pin REFUSES rather than landing in a bucket by guess.
  const ur = resolvability(page, new Map([["0.380927", new Set(["C-99"])]]));
  assert.equal(ur.unclassified.length, 1, "a hand claim in no declared kind is reported unclassified");
  assert.equal(ur.hits.length + ur.misses.length + ur.excluded.length, 0, "and lands in no bucket at all");

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
  const decorated = '<tr id="c-71a" data-find="steiner 71a 6.514326913930565372"></tr>';
  const decoratedVals = new Map([["$>6.514326913930565372$", new Set(["pin:71a:U"])]]);
  assert.ok(decorated.includes("6.5143"), "positive control: the fixture haystack really carries the digits");
  const dr = resolvability(decorated, decoratedVals);
  assert.equal(dr.hits.length, 1, "a decorated value resolves on its digits");
  assert.equal(dr.misses.length, 0, "and is NOT reported as a miss");

  // SILENT the other way: change the haystack digits and it becomes a real miss, so the leg above
  // is not passing because the matcher matches everything.
  const dr2 = resolvability('<tr id="c-71a" data-find="steiner 71a 9.999999999"></tr>', decoratedVals);
  assert.equal(dr2.misses.length, 1, "a value whose digits are absent is still a genuine miss");

  // Metadata pins leave the denominator and are REPORTED, never silently dropped.
  const meta = new Map([['prize: "no"', new Set(["C-8"])], ["0.380927", new Set(["C-2"])]]);
  const mr = resolvability(page, meta);
  assert.equal(mr.excluded.length, 1, "the metadata pin is excluded");
  assert.equal(mr.excluded[0].ids, "C-8", "and the exclusion names which claim it came from");
  assert.equal(mr.hits.length + mr.misses.length, 1, "only the value-bearing pin is in the denominator");

  // Every hand claim in the live ledger must be classified, or the live run refuses. This is the
  // leg that makes a NEW C-12 a decision rather than a silent bucketing.
  const live = JSON.parse(readFileSync(path.join(ROOT, "ledger", "claims.json"), "utf8"));
  const liveRows = Array.isArray(live) ? live : live.claims || [];
  const unknownHand = liveRows.filter((c) => !c.generated).map((c) => c.id).filter((id) => constantOf(id) === undefined);
  assert.deepEqual(unknownHand, [], `every hand claim is declared in HAND_CLAIMS; undeclared: ${unknownHand.join(",")}`);
  assert.ok(liveRows.some((c) => !c.generated), "positive control: the live ledger really does carry hand claims to check");

  console.log(
    "check-resolvability selftest: PASS (firstCell splits a table row and passes a bare value; " +
      "haystacks reads data-find out of the page and rowHaystacks refuses a row it cannot key; a " +
      "value absent from ITS OWN row is a MISS that an alias into another constant's row does NOT " +
      "clear and an own-row alias does, both mutations proven to land; kind decides the population " +
      "on one string pinned two ways; short and symbolic bounds are counted with their stratum; an " +
      "unclassified pin refuses; and an empty denominator does not render as full coverage)"
  );
}

const arg = process.argv[2];
if (arg === "--selftest") selftest();
else if (arg === "--help") {
  console.log("usage: check-resolvability.mjs [--selftest]");
  console.log("Prints the A-45 stale-value resolvability figure with its search space and its limit.");
  console.log("Exit 0 with a figure; exit 2 when the denominator is empty (NOTHING SWEPT, never 100%).");
} else main();
