#!/usr/bin/env node
// Gap table for the G-2 contribution search (David-ruled 2026-08-06): for every
// mirrored constant, extract the CURRENT record rows (last-listed row of each
// bounds table, same convention as extract-pins.mjs), parse a numeric value
// where that is conservatively possible, and emit the lower/upper gap plus
// study-intensity signals (row counts, latest cited year, machine-search
// markers). Read-only over the mirror; regenerable at any time; never edits
// ledger state. Output ranks the HUNTING GROUND for certificate-checkable
// bound improvements — it asserts nothing mathematical itself.
//
// usage: gap-table.mjs [--selftest]
//   writes docs/gap-table.json and prints a ranked summary to stdout.
//
// ponytail: value parsing is deliberately conservative — a cell is numeric only
// if, after stripping a short list of known LaTeX decorations, no letters
// remain; then the RIGHTMOST decimal literal wins (handles `1/2=0.5` and
// `\sqrt{...} \approx 0.356393`). Anything with residual letters or `^` is
// symbolic and simply drops out of the numeric pool. Ceiling: symbolic records
// (asymptotics, named constants) are never ranked — that is correct for this
// table's purpose (we only hunt where a candidate improvement is a number a
// script can check); upgrade to per-class parsers only if a real target needs it.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIRROR = join(ROOT, "ledger", "teorth-optimizationproblems", "constants");
const OUT = join(ROOT, "docs", "gap-table.json");
const MACHINE = /AlphaEvolve|TTT-Discover|Test-Time Training|SimpleTES|EinsteinArena|Evaluation-driven Scaling|FunSearch|PatternBoost/i;

function lastDataRow(section) {
  const lines = section.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|"));
  const isSep = (l) => l.replace(/^\|/, "").replace(/\|$/, "").split("|").every((c) => /^[-: ]*$/.test(c));
  const data = lines.slice(1).filter((l) => !isSep(l));
  return { row: data.length ? data[data.length - 1] : null, count: data.length };
}

function parseValue(cell) {
  // strip $...$ wrappers and known non-semantic LaTeX; keep digits/operators
  let s = cell.replace(/\$/g, "")
    .replace(/\\(approx|le|leq|ge|geq|sim|dots|ldots|cdots|times|cdot|;|,|!|sqrt|frac|left|right)\b/g, " ")
    .replace(/[{}()\[\]]/g, " ");
  if (/\^/.test(s)) return null;          // exponents → symbolic (10^{-26} etc.)
  if (/[a-zA-Z]/.test(s)) return null;    // residual letters → symbolic
  const nums = s.match(/-?\d+\.\d+|-?\d+/g);
  if (!nums) return null;
  const v = Number(nums[nums.length - 1]); // rightmost literal is the stated value
  return Number.isFinite(v) ? v : null;
}

function analyze(base, body) {
  const clean = body.replace(/<!--[\s\S]*?-->/g, "");
  const title = clean.match(/^# (.+)$/m)?.[1]?.trim() ?? base;
  const rec = { file: `${base}.md`, title };
  for (const [key, header] of [["upper", "Known upper bounds"], ["lower", "Known lower bounds"]]) {
    const m = clean.match(new RegExp(`^## ${header}\\s*$([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
    const { row, count } = m ? lastDataRow(m[1]) : { row: null, count: 0 };
    const cell = row ? row.split("|").map((c) => c.trim()).filter(Boolean)[0] ?? "" : "";
    // (?<!\d)…(?!\d) not \b — citation keys glue years to letters ([MRS1956]), where \b never matches
    const years = m ? [...m[1].matchAll(/(?<!\d)(19|20)\d{2}(?!\d)/g)].map((y) => Number(y[0])) : [];
    rec[key] = { cell, value: row ? parseValue(cell) : null, rows: count, latestYear: years.length ? Math.max(...years) : null };
  }
  rec.machineSearched = MACHINE.test(clean);
  const u = rec.upper.value, l = rec.lower.value;
  rec.gap = u != null && l != null ? u - l : null;
  rec.relGap = rec.gap != null && u !== 0 ? Math.abs(rec.gap) / Math.abs(u) : null;
  rec.parseSuspect = rec.gap != null && rec.gap < 0; // lower > upper ⇒ our parse is wrong, not the mathematics
  return rec;
}

function selftest() {
  const assert = (cond, msg) => { if (!cond) { console.error(`selftest FAIL: ${msg}`); process.exit(1); } };
  // fires: plain decimals, rightmost-literal rule, approx forms
  assert(parseValue("$0.380868$") === 0.380868, "plain decimal");
  assert(parseValue("$1/2=0.5$") === 0.5, "rightmost literal after equals");
  assert(parseValue("$\\sqrt{4-\\sqrt{15}} \\approx 0.356393$") === 0.356393, "approx form takes the decimal");
  // stays silent: symbolic cells must NOT parse
  assert(parseValue("$K_{DR}+10^{-26}$") === null, "named constant stays symbolic");
  assert(parseValue("$O(n \\log n)$") === null, "asymptotic stays symbolic");
  assert(parseValue("$2^{-d}$") === null, "exponent stays symbolic");
  const fixture = `# T\n\n## Known upper bounds\n\n| Bound | Ref |\n| --- | --- |\n| $0.5$ | [A1999] |\n| $0.4$ | [B2004] |\n\n## Known lower bounds\n\n| Bound | Ref |\n| --- | --- |\n| $0.1$ | [C2001] |\n`;
  const r = analyze("t", fixture);
  assert(r.upper.value === 0.4 && r.lower.value === 0.1, "last rows parsed");
  assert(Math.abs(r.gap - 0.3) < 1e-12 && !r.parseSuspect, "gap from last rows");
  assert(r.upper.rows === 2 && r.upper.latestYear === 2004, "row count + latest year");
  const inverted = analyze("t2", fixture.replace("$0.1$", "$0.9$"));
  assert(inverted.parseSuspect, "inverted gap flags parseSuspect");
  console.log("gap-table selftest: PASS (6 parse cases + gap/flag fixture)");
}

async function run() {
  const files = (await readdir(MIRROR)).filter((f) => f.endsWith(".md")).sort();
  const recs = [];
  for (const f of files) recs.push(analyze(f.replace(/\.md$/, ""), await readFile(join(MIRROR, f), "utf8")));
  const numeric = recs.filter((r) => r.gap != null && !r.parseSuspect);
  const suspects = recs.filter((r) => r.parseSuspect);
  await writeFile(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), fileCount: recs.length, records: recs }, null, 2) + "\n");
  const fmt = (r) => `${r.file.padEnd(9)} gap ${r.gap.toPrecision(3).padStart(10)}  rel ${(r.relGap * 100).toFixed(1).padStart(6)}%  rows ${String(r.upper.rows + r.lower.rows).padStart(3)}  latest ${r.upper.latestYear ?? "?"}/${r.lower.latestYear ?? "?"}  ${r.machineSearched ? "ML" : "  "}  ${r.title.slice(0, 44)}`;
  console.log(`gap-table: ${recs.length} constants — ${numeric.length} with a numeric gap, ${suspects.length} parse-suspect, ${recs.length - numeric.length - suspects.length} symbolic/partial -> docs/gap-table.json`);
  console.log(`\nUnder-studied first (numeric gap, no machine-search marker, sorted rows asc then relGap desc):`);
  const quiet = numeric.filter((r) => !r.machineSearched).sort((a, b) => (a.upper.rows + a.lower.rows) - (b.upper.rows + b.lower.rows) || b.relGap - a.relGap);
  for (const r of quiet.slice(0, 20)) console.log("  " + fmt(r));
  if (suspects.length) console.log(`\nparse-suspect (lower parsed > upper — instrument, not mathematics):\n${suspects.map((r) => "  " + r.file).join("\n")}`);
}

if (process.argv.includes("--selftest")) selftest();
else await run();
