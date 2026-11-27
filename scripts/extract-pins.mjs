#!/usr/bin/env node
// Generate claim-level value pins for every constant in the mirror (A-2 extension,
// greenlit 2026-07-24). For each ledger/teorth-optimizationproblems/constants/*.md,
// pin the LAST-LISTED row of the "Known upper bounds" and "Known lower bounds" tables
// (verbatim, as one raw line) as a claim against the file at upstream live HEAD.
//
// Why last-listed and not "the record": picking the record row is a mathematical
// judgment (symbolic cells like $K_{DR}+10^{-26}$, negatives, O(·) asymptotics defeat
// numeric ranking — verified against the corpus 2026-07-24), and auto-asserting it
// would put unverified statements in our own ledger. "Last-listed row" is true by
// construction, and detection power is the same: an edit to that row breaks the pin;
// an appended new record trips the mirror diff (reverify.mjs) instead.
//
// Pins are extracted from the MIRROR (our verified copy) and checked by
// check-claims.mjs against upstream HEAD — so after --snapshot accepts an upstream
// change, a moved row still reports BROKEN until pins are deliberately re-generated
// by re-running this script: the deliberate-update ratchet.
//
// usage: extract-pins.mjs [--selftest]
// Rewrites ledger/claims.json in place: hand claims (no `generated` flag) preserved
// verbatim, generated pins replaced wholesale. EVERY constant file is pinned — see the
// no-skip-list note below before excluding one.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isConstantId, firstBadConstantId, constantIdRefusal } from "./lib/constant-id.mjs";
import { mirrorShapeRefusal, RESNAP_STOPPED } from "./lib/mirror-shape.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIRROR = join(ROOT, "ledger", "teorth-optimizationproblems", "constants");
const CLAIMS = join(ROOT, "ledger", "claims.json");
const RAW_BASE = "https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants";
// THERE IS NO SKIP LIST, and its removal on 2026-09-03 is the ship — recorded here rather than in
// a commit body alone, because the shape of the mistake is what stops it being re-made.
//
// This file carried `SKIP = new Set(["1b.md"]) // hand-pinned as C-1 (upper) / C-3 (lower)` from
// 2026-07-22, when 1b WAS the whole ledger and a generated pin beside the hand claims would have
// been pure duplication. On 2026-08-21 the public page shipped, and it builds its rows from `pin:`
// ids alone — so from that day the skip stopped being a de-duplication and became a COVERAGE HOLE
// on the only user-visible surface this lane has. The Erdős minimum overlap constant is the record
// this repo opened on, it is the subject of reconciliation #1 and of the README's first paragraph,
// and it was the one constant of 115 with no row on the page. Nothing reported it: every instrument
// here checks the rows that EXIST against upstream, and none asks which rows are ABSENT.
//
// THE TWO CLAIM KINDS ARE NOT DUPLICATES, which is why removing the skip is safe rather than a
// weakening. A generated pin asserts a LISTING POSITION — "this is the last row of that table",
// nothing about the mathematics. C-1 and C-3 assert a RECORD — "the current best known upper bound
// is 0.380868" — which only a human may write here, and which the page's own guard forbids the
// table from carrying. They are different statements about the same file, they re-verify
// independently, and both should hold. If they ever disagree that disagreement is a finding of
// exactly the kind this ledger exists to produce, and carrying only one of them would hide it.
//
// So: do not re-add a skip for a file because a hand claim already mentions it. Any future
// exclusion must be one the PAGE can live with, and the README's "all N tracked constants"
// sentence — asserted by scripts/render-state-block.mjs — goes red until it is reworded to say
// something true.

// Last data row of the section's table: last |-line that isn't the header (first
// |-line) or a separator. Returned verbatim — cells are never parsed, so escaped
// pipes ($\|\|A\|\|$) and any LaTeX survive intact.
// A-108 Codex r1 (HIGH): the pin is "the last-listed row of the table", and the feed now announces a
// change to it, so a pipe-prefixed line that is NOT in the table (an example after it, a second table)
// must never become the pin. Stated rule, a refusal: a bounds section's pipe lines must form ONE
// contiguous block. Anything else throws, and run() refuses before claims.json is written. Measured
// 2026-11-27: 0 of 246 bounds sections in 123 files break it. (Comments cannot split a table: a file
// holding one is refused before this runs, by the shape rule in extractPins.)
export function tableIsContiguous(section) {
  const idx = section.split("\n").map((l, i) => (l.trim().startsWith("|") ? i : -1)).filter((i) => i >= 0);
  return idx.length === 0 || idx[idx.length - 1] - idx[0] + 1 === idx.length;
}

function lastDataRow(section, label = "section") {
  if (!tableIsContiguous(section)) throw new Error(`${label}: its pipe lines are not one contiguous table, so the last-listed row is not well defined`);
  const lines = section.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
  const isSep = (l) => l.replace(/^\|/, "").replace(/\|$/, "").split("|").every((c) => /^[-: ]*$/.test(c));
  const data = lines.slice(1).filter((l) => !isSep(l));
  return data.length ? data[data.length - 1] : null;
}

function extractPins(base, body) {
  // A-108 (Codex r2, the same parser class a second time): a file holding an HTML comment, a repeated
  // bounds heading or a fence in the bounds region is REFUSED, not parsed (scripts/lib/mirror-shape.mjs).
  // So there is no comment left to strip, and the round-1 comment-stripping regex is gone.
  const shape = mirrorShapeRefusal(body);
  if (shape) throw new Error(`${base}.md: ${shape}`);
  const clean = body.replace(/\r\n/g, "\n");
  const STD = /^(Description of constant|Known (upper|lower) bounds|Additional comments|Further remarks|References|Contribution notes|Certificate )/;
  const title = clean.match(/^# (.+)$/m)?.[1]?.trim()
    ?? [...clean.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()).find((h) => !STD.test(h))
    ?? base;
  const pins = [];
  const notes = [];
  for (const [dir, header] of [["upper", "Known upper bounds"], ["lower", "Known lower bounds"]]) {
    const m = clean.match(new RegExp(`^## ${header}\\s*$([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
    const row = m ? lastDataRow(m[1], `${base}.md ${header}`) : null;
    if (!row) { notes.push(`${dir}: no table rows`); continue; }
    pins.push({
      id: `pin:${base}:${dir === "upper" ? "U" : "L"}`,
      statement: `Last-listed ${dir}-bound table row for ${title} (${base}.md)`,
      url: `${RAW_BASE}/${base}.md`,
      expect: row,
      asserts: `ledger/teorth-optimizationproblems/constants/${base}.md`,
      generated: true,
    });
  }
  return { title, pins, notes };
}

function selftest() {
  const assert = (cond, msg) => { if (!cond) { console.error(`selftest FAIL: ${msg}`); process.exit(1); } };
  const fixture = `# Test constant

## Known upper bounds

| Bound | Reference |
| ----- | --------- |
| $1/2=0.5$ | [A] |
| $\\|\\|A\\|\\|_2 \\le 0.41$ | [B] |

## Known lower bounds

| Bound | Reference |
| ----- | --------- |
| $0.31$ | [E] |

## References
`;
  // A-108: fixture ids follow the constant-id rule too (they were t1 to t4, which the rule refuses).
  const { title, pins } = extractPins("91t", fixture);
  assert(title === "Test constant", "title from H1");
  assert(pins.length === 2, "two pins");
  assert(pins[0].id === "pin:91t:U" && pins[0].expect === "| $\\|\\|A\\|\\|_2 \\le 0.41$ | [B] |", "upper pin = last raw row, escaped pipes intact");
  assert(pins[1].id === "pin:91t:L" && pins[1].expect === "| $0.31$ | [E] |", "lower pin = last raw row");

  // A-108 (Codex r2): a comment is REFUSED, no longer stripped (scripts/lib/mirror-shape.mjs).
  const refusalOf = (base, body) => { try { extractPins(base, body); return null; } catch (e) { return e.message; } };
  const commented = fixture.replace("| $\\|\\|A\\|\\|_2 \\le 0.41$ | [B] |", "| $0.41$ | [B] |\n<!-- | $0.1$ | [H] | -->");
  assert(/92t\.md: line \d+ holds an HTML comment marker/.test(refusalOf("92t", commented) || ""), "a file holding an HTML comment is refused by name and line, never parsed");

  const empty = fixture.replace(/\| \$0\.31\$ \| \[E\] \|\n/, "");
  const r3 = extractPins("93t", empty);
  assert(r3.pins.length === 1 && r3.notes.some((n) => n.includes("lower: no table rows")), "header-only table yields no pin + a note");

  const noH1 = fixture.replace("# Test constant\n", "");
  assert(extractPins("94t", noH1).pins[0].statement.includes("(94t.md)"), "missing H1 falls back to file base");

  // A-108: THE STEM RULE, both answers. A stem that is not digits-then-one-lowercase-letter is refused
  // with its position; the real call site in run() checks EVERY stem before it reads or writes anything.
  for (const ok of ["1a", "10c", "90a"]) assert(isConstantId(ok), `a plain constant id must pass: ${ok}`);
  for (const bad of ["t1", "1A", "1ab", "a1", "1", "1a ", "1a\n", "../1a", "1a.md", "１a", "", "1234a", "0".repeat(251) + "a"]) {
    assert(!isConstantId(bad), `a stem breaking the rule must be refused: ${JSON.stringify(bad)}`);
  }
  // A-108 Codex r1: THE TABLE IS ONE CONTIGUOUS BLOCK. A pipe line after the table (here a fenced
  // example or second table) must be refused, never pinned.
  const withExample = fixture.replace("## Known lower bounds", "Example:\n\n| 0.0001 | [Z] |\n\n## Known lower bounds");
  const refused = refusalOf("95t", withExample);
  assert(refused && /not one contiguous table/.test(refused) && refused.includes("95t.md Known upper bounds"), `a pipe line outside the table must be refused by name, never pinned: ${refused}`);
  // A-108 (Codex r2 #1): a fenced fake heading before the real one, a repeated heading, and a fence in
  // the bounds region are each refused; a fence AFTER the bounds region (10c.md's certificates) is not.
  const fakeHeading = fixture.replace("## Known upper bounds", "```\n## Known upper bounds\n\n| Bound | Reference |\n| --- | --- |\n| 0.0001 | [Z] |\n```\n\n## Known upper bounds");
  assert(/opens a code fence|appears 2 times/.test(refusalOf("96t", fakeHeading) || ""), "a fenced fake bounds heading before the real one must be refused");
  const twice = fixture + "\n## Known upper bounds\n\n| Bound | Reference |\n| --- | --- |\n| 9 | [Q] |\n";
  assert(/"## Known upper bounds" appears 2 times/.test(refusalOf("98t", twice) || ""), "a repeated bounds heading must be refused");
  const fenceInRegion = fixture.replace("## Known lower bounds", "```text\nnot a table\n```\n\n## Known lower bounds");
  assert(/opens a code fence before the bounds tables' region ends/.test(refusalOf("99t", fenceInRegion) || ""), "a fence inside the bounds region must be refused");
  const fenceAfter = fixture.replace("## References\n", "## Certificate for the bound\n\n```text\n| 1 | 2 |\n```\n\n## References\n");
  assert(fenceAfter !== fixture && refusalOf("90t", fenceAfter) === null, "a fence after the bounds region (10c.md's certificate shape) is allowed");
  assert(extractPins("97t", fixture.replace(/\n/g, "\r\n")).pins[0].expect === "| $\\|\\|A\\|\\|_2 \\le 0.41$ | [B] |", "CRLF input pins the same row");

  const hit = firstBadConstantId(["1a", "2b", "Bad", "3c"]);
  assert(hit && hit.index === 2 && hit.id === "Bad", "the refusal names the first bad stem and its position");
  assert(firstBadConstantId(["1a", "10c"]) === null, "every good stem: no refusal");

  console.log("extract-pins selftest: PASS (5 extraction cases, the constant-id rule both ways)");
}

async function run() {
  const files = (await readdir(MIRROR)).filter((f) => f.endsWith(".md")).sort();
  // A-108: every stem is checked BEFORE any file is read or claims.json is written, so a refusal
  // leaves claims.json byte-identical. Checked here, at the source of the id, AND in each renderer
  // (orchestrator, bus d4c969c8): a file that reaches the mirror another way skips a snapshot-only check.
  const bad = firstBadConstantId(files.map((f) => f.replace(/\.md$/, "")));
  if (bad) {
    console.error(`${constantIdRefusal("extract-pins", bad)}. ${RESNAP_STOPPED}`);
    process.exitCode = 1;
    return;
  }
  const generated = [];
  const noted = [];
  for (const f of files) {
    const base = f.replace(/\.md$/, "");
    let out;
    try { out = extractPins(base, await readFile(join(MIRROR, f), "utf8")); }
    catch (e) {
      // A-108: nothing is written when any file breaks a stated rule (claims.json stays byte-identical).
      console.error(`extract-pins: refusing — ${e.message}; nothing was composed or written. ${RESNAP_STOPPED}`);
      process.exitCode = 1;
      return;
    }
    const { pins, notes } = out;
    generated.push(...pins);
    if (notes.length) noted.push(`${f}: ${notes.join("; ")}`);
  }
  const existing = JSON.parse(await readFile(CLAIMS, "utf8"));
  const hand = existing.filter((c) => !c.generated);
  const all = [...hand, ...generated];
  await writeFile(CLAIMS, JSON.stringify(all, null, 2) + "\n");
  console.log(`extract-pins: ${generated.length} generated pins from ${files.length} files (+ ${hand.length} hand claims kept) -> ledger/claims.json`);
  if (noted.length) console.log(`sections without pins:\n${noted.map((l) => `  ${l}`).join("\n")}`);
}

if (process.argv.includes("--selftest")) selftest();
else await run();
