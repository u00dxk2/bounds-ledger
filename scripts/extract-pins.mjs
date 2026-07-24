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
// verbatim, generated pins replaced wholesale. 1b.md is skipped — C-1/C-3 hand-pin it.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIRROR = join(ROOT, "ledger", "teorth-optimizationproblems", "constants");
const CLAIMS = join(ROOT, "ledger", "claims.json");
const RAW_BASE = "https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants";
const SKIP = new Set(["1b.md"]); // hand-pinned as C-1 (upper) / C-3 (lower)

// Last data row of the section's table: last |-line that isn't the header (first
// |-line) or a separator. Returned verbatim — cells are never parsed, so escaped
// pipes ($\|\|A\|\|$) and any LaTeX survive intact.
function lastDataRow(section) {
  const lines = section.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
  const isSep = (l) => l.replace(/^\|/, "").replace(/\|$/, "").split("|").every((c) => /^[-: ]*$/.test(c));
  const data = lines.slice(1).filter((l) => !isSep(l));
  return data.length ? data[data.length - 1] : null;
}

function extractPins(base, body) {
  const clean = body.replace(/<!--[\s\S]*?-->/g, "");
  const STD = /^(Description of constant|Known (upper|lower) bounds|Additional comments|Further remarks|References|Contribution notes|Certificate )/;
  const title = clean.match(/^# (.+)$/m)?.[1]?.trim()
    ?? [...clean.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()).find((h) => !STD.test(h))
    ?? base;
  const pins = [];
  const notes = [];
  for (const [dir, header] of [["upper", "Known upper bounds"], ["lower", "Known lower bounds"]]) {
    const m = clean.match(new RegExp(`^## ${header}\\s*$([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
    const row = m ? lastDataRow(m[1]) : null;
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
  const { title, pins } = extractPins("t1", fixture);
  assert(title === "Test constant", "title from H1");
  assert(pins.length === 2, "two pins");
  assert(pins[0].id === "pin:t1:U" && pins[0].expect === "| $\\|\\|A\\|\\|_2 \\le 0.41$ | [B] |", "upper pin = last raw row, escaped pipes intact");
  assert(pins[1].id === "pin:t1:L" && pins[1].expect === "| $0.31$ | [E] |", "lower pin = last raw row");

  const commented = fixture.replace("| $\\|\\|A\\|\\|_2 \\le 0.41$ | [B] |", "| $0.41$ | [B] |\n<!-- | $0.1$ | [H] | -->");
  assert(extractPins("t2", commented).pins[0].expect === "| $0.41$ | [B] |", "HTML-commented row ignored");

  const empty = fixture.replace(/\| \$0\.31\$ \| \[E\] \|\n/, "");
  const r3 = extractPins("t3", empty);
  assert(r3.pins.length === 1 && r3.notes.some((n) => n.includes("lower: no table rows")), "header-only table yields no pin + a note");

  const noH1 = fixture.replace("# Test constant\n", "");
  assert(extractPins("t4", noH1).pins[0].statement.includes("(t4.md)"), "missing H1 falls back to file base");

  console.log("extract-pins selftest: PASS (5 extraction cases)");
}

async function run() {
  const files = (await readdir(MIRROR)).filter((f) => f.endsWith(".md") && !SKIP.has(f)).sort();
  const generated = [];
  const noted = [];
  for (const f of files) {
    const base = f.replace(/\.md$/, "");
    const { pins, notes } = extractPins(base, await readFile(join(MIRROR, f), "utf8"));
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
