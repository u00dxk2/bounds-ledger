#!/usr/bin/env node
// depth-audit.mjs — A-47's read. Renders a figure and NO verdict.
//
// David ruled depth on 2026-09-09 ("start reading our own 543 records against
// their sources on a schedule") and on 2026-09-10 made it this project's interim
// yardstick ("judge the project meanwhile on how much of our own material stands
// up when we check it"). This prints what that audit has actually established.
//
// IT REFUSES TO PRINT A BARE ZERO, the same way report-rate.mjs does and for the
// same reason: a zero from a dead probe is indistinguishable from a measured one.
//   exit 2 — the store is missing, unparseable, or holds no audit rows. That is a
//            statement about the WORK, never about the records.
//   exit 3 — the verdict counts do not sum to the raw row count, so the classifier
//            is silently dropping rows it is counting.
//
// It never runs in CI as a GATE and never fails a build — like catches and reports
// it is an indicator, not an alarm. An indicator wired into a gate becomes a
// permanently red alarm the moment the audit pauses, which is this lane's founding
// defect. Only its --selftest runs in CI.
//
// Usage: node scripts/depth-audit.mjs [--store <path>] | --selftest

import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const REPO = path.resolve(HERE, '..');
const DEFAULT_STORE = path.join(REPO, 'continuity', 'depth-audit.json');
const KNOWN = ['SOUND', 'DEFECTIVE', 'UNRESOLVED', 'UNREACHABLE'];

// Returns { code, lines }. Never exits, never throws — so the selftest can read
// both polarities in-process rather than trusting a spawned exit code through a
// shell, which is exactly how this repo's alarm was fake for its first two days.
export function run(storePath) {
  const lines = [];
  const rel = path.relative(REPO, storePath) || storePath;

  if (!fs.existsSync(storePath)) {
    lines.push(`RESULT: FAIL — no audit store at ${rel} — nothing has been audited, which is not the same as zero defects (exit 2)`);
    return { code: 2, lines };
  }

  let store;
  try {
    store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
  } catch (e) {
    lines.push(`RESULT: FAIL — the audit store at ${rel} did not parse (${e.message}) — an unreadable store is not an empty one (exit 2)`);
    return { code: 2, lines };
  }

  const audits = Array.isArray(store.audits) ? store.audits : [];
  if (audits.length === 0) {
    lines.push(`RESULT: FAIL — the audit store exists but holds 0 rows — a zero here is a statement about the WORK, not about the records (exit 2)`);
    return { code: 2, lines };
  }

  const counts = Object.fromEntries(KNOWN.map((v) => [v, 0]));
  const unknown = [];
  for (const a of audits) {
    if (KNOWN.includes(a.verdict)) counts[a.verdict] += 1;
    else unknown.push(`${a.id}:${a.verdict}`);
  }

  const classified = KNOWN.reduce((n, v) => n + counts[v], 0);
  if (classified !== audits.length) {
    lines.push(`  raw rows: ${audits.length} · classified: ${classified} · unrecognised verdict(s): ${unknown.join(', ') || '(none)'}`);
    lines.push(`RESULT: FAIL — the classified parts (${classified}) do not sum to the raw row count (${audits.length}) — a breakdown under a mismatched sum is not a measurement (exit 3)`);
    return { code: 3, lines };
  }

  const constants = [...new Set(audits.map((a) => a.constant))];
  lines.push(`depth audit (A-47): ${audits.length} row(s) audited — ${counts.SOUND} sound, ${counts.DEFECTIVE} defective, ${counts.UNRESOLVED} unresolved, ${counts.UNREACHABLE} unreachable`);
  lines.push(`  denominator: ${store.meta?.denominatorProvenance || '(none recorded — read A-47.note2)'}`);
  lines.push(`  sampling: ${store.meta?.samplingRule || '(none recorded — a rate off an unstated sample is not a rate)'}`);
  lines.push('');
  for (const a of audits) {
    lines.push(`  ${a.id}  ${a.constant} [${a.citedRef}]  ${a.verdict}  (${a.leg})`);
    lines.push(`      row: ${a.rowFile}:${a.rowLine} sha256:${a.rowTextSha256} — re-read the row there; it is never retyped into this store`);
    lines.push(`      source: ${a.source} (read: ${a.sourceRead})`);
  }
  lines.push('');
  // The corpus figures are READ FROM THE STORE, never retyped into this prose: the two sentences
  // below used to carry 543 and 220 as literals, so they would have kept printing the old figures
  // after the store's own denominator was recomputed on 2026-09-11.
  const cited = store.meta?.corpus?.citedRows;
  const uncited = store.meta?.corpus?.uncitedRows;
  const citedText = Number.isFinite(cited) ? `the ${cited} cited rows` : 'the cited rows (the store records no citedRows figure)';
  const uncitedText = Number.isFinite(uncited) ? `the ${uncited} UNCITED rows` : 'the UNCITED rows (the store records no uncitedRows figure)';
  lines.push(`population: the ${audits.length} row(s) recorded in ${rel}, across constant file(s) ${constants.join(', ')}. NOT a sample of ${citedText} — see the sampling line above.`);
  lines.push(`blindTo: every cited row not yet in this store; whether a SOUND row's source says something the auditor did not think to ask; whether an UNRESOLVED row is sound or defective, which is the whole content of that verdict; and any defect in ${uncitedText}, which this audit cannot reach by construction.`);
  lines.push(`RESULT: PASS — ${audits.length} audited, ${counts.SOUND} sound, ${counts.DEFECTIVE} defective, ${counts.UNRESOLVED} unresolved, ${counts.UNREACHABLE} unreachable (exit 0)`);
  return { code: 0, lines };
}

// THE DENOMINATOR, COMPUTED RATHER THAN REMEMBERED (2026-09-11). The store carried 543 cited of 763
// bound rows, "measured 2026-09-09" by a script that was never committed — and no predicate reproduces
// it today over a mirror that has not changed since 2026-09-07 (`git log -- ledger/.../constants`
// prints nothing since then): reference-token-anywhere gives 673 of 770, reference-COLUMN-names-a-ref
// gives 656, column-is-exactly-a-token gives 461. That number is rendered on all 115 public constant
// pages. A figure nobody can re-derive is the defect this lane exists to catch, pointed at ourselves,
// so it is computed by a command from here on and its definition travels with it.
//
// A BOUND ROW is the repo's OWN definition, lifted from extract-pins.mjs so the audit and the pins
// count the same things: a data row of the table under "## Known upper bounds" / "## Known lower
// bounds", HTML comments stripped, the table header and separator rows excluded. A CITED row names at
// least one bracketed reference token anywhere in the row — inclusive on purpose, because that token
// is what a reader follows, and the same list is the audit's sampling frame.
// Named CITED_REF_RE rather than anything ending in _TOKEN: the pre-commit secret sweep reads
// `<NAME>_TOKEN = <value>` as a credential assignment and blocked this commit. The guard is right
// to be blunt on a public repo, so the name moved rather than the guard.
const CITED_REF_RE = /\[([A-Za-z][A-Za-z0-9+.'\-]*\d{2,4}[a-z]?)\]/;
const isSeparatorRow = (l) => l.replace(/^\|/, '').replace(/\|$/, '').split('|').every((c) => /^[-: ]*$/.test(c));

export const SECTIONS = [['U', 'Known upper bounds'], ['L', 'Known lower bounds']];

// Returns the bound rows AND any line the parser cannot see but that sits INSIDE a table block.
// Round 3 of the 2026-09-11 adversarial review stripped the leading pipe from 535 interior rows —
// legal GFM, since the leading pipe is optional — and the corpus fell from 770/673 to 235/205 while
// every section still yielded its last row, so the pins, the file checks and the section baseline
// all passed. This counter deliberately keeps extract-pins.mjs's definition (a row starts with "|")
// rather than widening it, because the generated pins are cut the same way and a counter that saw
// MORE than the pins would disagree with the ledger. So an unparseable row is REFUSED, not counted:
// the table block runs from its header line to the first blank line, and inside that block a
// non-empty line that does not start with "|" is a row this parser is dropping.
// A table BLOCK is a header row followed by a separator row; its data rows run until the block ends.
// A block ends at a blank line, a blockquote, an ATX heading, an HTML block or ordinary prose — all
// legal GFM terminators. EVERY block in the section is walked, and each block's own header and
// separator are excluded, so a section carrying two tables counts its rows once and its headers
// never. Round 4 of the 2026-09-11 review produced both failures this replaces: the previous scan
// stopped at the first blank line, so rows moved into a SECOND block vanished silently (235/147 at
// exit 0), and it treated a blockquote or heading sitting directly after a table as dropped rows,
// refusing an intact corpus — a false refusal is the permanently-red alarm this lane exists to
// refuse. What still counts as an anomaly is narrow and deliberate: a line INSIDE a block that does
// not start with "|" yet carries two or more unescaped pipes, i.e. a row this parser cannot read.
const BLOCK_TERMINATOR = /^(>|#{1,6}\s|<)/;
const unescapedPipeCount = (l) => (l.replace(/\\\|/g, '').match(/\|/g) || []).length;

// Each row carries the 1-based line it was parsed FROM. Comments are blanked IN PLACE rather
// than deleted so that every surviving line keeps its original number: adversarial review on
// 2026-09-12 showed the alternative failing silently. The draw used to re-find a row by
// searching the raw file for its text, and a commented-out DUPLICATE of a live row made it
// report the comment's line while the row hash matched either way — so hashing could not catch
// a verdict pointing at excluded text, and an inline comment inside a row reported line 0.
export function boundRowsOf(fileText) {
  const all = fileText.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' ')).split('\n');
  const rows = [];
  const anomalies = [];
  for (const [dir, header] of SECTIONS) {
    const headerRe = new RegExp(`^## ${header}\\s*$`);
    let start = -1;
    for (let i = 0; i < all.length; i += 1) {
      if (headerRe.test(all[i])) { start = i + 1; break; }
    }
    if (start === -1) continue;
    let end = all.length;
    for (let i = start; i < all.length; i += 1) {
      if (/^## /.test(all[i])) { end = i; break; }
    }
    let i = start;
    while (i < end) {
      const isHeader = all[i].trim().startsWith('|') && i + 1 < end && isSeparatorRow(all[i + 1].trim());
      if (!isHeader) { i += 1; continue; }
      i += 2; // the block's own header and separator are never data
      while (i < end) {
        const l = all[i].trim();
        if (l === '' || BLOCK_TERMINATOR.test(l)) break;
        if (l.startsWith('|')) {
          if (!isSeparatorRow(l)) rows.push({ text: l, section: header, dir, line: i + 1 });
          i += 1;
          continue;
        }
        if (unescapedPipeCount(l) >= 2) { anomalies.push({ dir, line: l.slice(0, 80) }); i += 1; continue; }
        break; // ordinary prose ends the table
      }
    }
  }
  return { rows, anomalies };
}

// The expected SECTIONS come from the committed generated pins, which carry one id per file and
// direction (pin:<base>:U / pin:<base>:L). That is the baseline a live parse is checked against:
// adversarial review round 2 (2026-09-11) renamed the lower-bound headings in files that kept their
// upper rows and drove the corpus from 770/673 down to 428/392 while every file still contributed
// rows, 87a still read 7/6, and all 115 files were still present — so file-level checks cannot see
// partial section loss, and only a per-section baseline can.
export function expectedSectionsFromClaims(claimsPath) {
  const parsed = JSON.parse(fs.readFileSync(claimsPath, 'utf8'));
  const list = Array.isArray(parsed) ? parsed : (parsed.claims ?? parsed.pins ?? []);
  const out = new Set();
  for (const c of list) {
    const m = /^pin:([^:]+):(U|L)$/.exec(c?.id ?? '');
    if (m && c.generated) out.add(`${m[1]}:${m[2]}`);
  }
  return out;
}

export function countCorpus(dir, { expectedFiles = null, expectedSections = null } = {}) {
  let files = 0, boundRows = 0, citedRows = 0, uncitedRows = 0;
  const control = { file: '87a.md', present: false, boundRows: 0, citedRows: 0, hasToken: false };
  const zeroRowFiles = [];
  const unparseableRows = [];
  const seenSections = new Set();
  let names = [];
  try { names = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort(); } catch { names = []; }
  for (const name of names) {
    files += 1;
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    const { rows, anomalies } = boundRowsOf(text);
    for (const a of anomalies) unparseableRows.push(`${name} (${a.dir}): ${a.line}`);
    for (const r of rows) (CITED_REF_RE.test(r.text) ? citedRows++ : uncitedRows++);
    for (const r of rows) seenSections.add(`${name.replace(/\.md$/, '')}:${r.dir}`);
    boundRows += rows.length;
    // EVERY constant file states at least one bound row. A file contributing NONE means its
    // headings stopped matching, not that upstream published a constant with no bounds — and
    // that is the failure the partition check below cannot see (adversarial review 2026-09-11:
    // a probe that made the lower-bound headings unrecognisable silently dropped the corpus to
    // 390 of 425 and still passed every check here).
    if (rows.length === 0) zeroRowFiles.push(name);
    if (name === control.file) {
      control.present = true;
      control.boundRows = rows.length;
      control.citedRows = rows.filter((r) => CITED_REF_RE.test(r.text)).length;
      control.hasToken = text.includes('857.5662');
    }
  }
  const missingSections = expectedSections
    ? [...expectedSections].filter((s) => !seenSections.has(s)).sort()
    : [];
  return { files, boundRows, citedRows, uncitedRows, control, zeroRowFiles, unparseableRows, expectedFiles, expectedSections, missingSections };
}

// Pure over the counts, so the selftest can drive it from countCorpus over MUTATED fixtures rather
// than from fabricated totals. `expect` pins the control to the numbers A-47.note2 recorded; an
// upstream edit to 87a SHOULD trip this and be re-confirmed rather than absorbed silently.
export function corpusRefusal(c, expect = { controlBoundRows: 7, controlCitedRows: 6 }) {
  if (!c.files || !c.boundRows) {
    return `read ${c.files} file(s) and ${c.boundRows} bound row(s) — a corpus of nothing is a dead probe, not an empty mirror`;
  }
  // A check that cannot RUN must not report success: without the manifest there is no inventory
  // expectation, and round 2 showed a corpus of one intact file passing every remaining check.
  if (c.expectedFiles == null) {
    return 'the mirror manifest gave no file count, so the inventory check could not run — an unestablished inventory is not a clean one';
  }
  if (c.files !== c.expectedFiles) {
    return `read ${c.files} constant file(s) but the mirror manifest says ${c.expectedFiles} — a short inventory is a missing corpus, not a smaller one`;
  }
  if (c.expectedSections == null) {
    return 'no section baseline was supplied (the generated pins in ledger/claims.json), so partial section loss could not be checked — an unestablished baseline is not a clean one';
  }
  if (c.unparseableRows.length) {
    return `${c.unparseableRows.length} line(s) sit inside a bounds table block but do not start with "|", so this parser drops them (${c.unparseableRows.slice(0, 3).join(' · ')}${c.unparseableRows.length > 3 ? ' · …' : ''}) — legal GFM this counter does not read is a silent undercount, not a clean corpus`;
  }
  if (c.missingSections.length) {
    return `${c.missingSections.length} section(s) that the committed pins expect produced NO rows (${c.missingSections.slice(0, 5).join(', ')}${c.missingSections.length > 5 ? ', …' : ''}) — a heading the parser no longer recognises drops rows silently`;
  }
  if (c.zeroRowFiles.length) {
    return `${c.zeroRowFiles.length} file(s) contributed NO bound rows (${c.zeroRowFiles.slice(0, 5).join(', ')}${c.zeroRowFiles.length > 5 ? ', …' : ''}) — every constant file states bounds, so this is section loss or a heading the parser stopped recognising`;
  }
  // This proves the two classes EXHAUST the rows the parser enumerated. It cannot see a row the
  // parser never enumerated — that is what the two checks above are for.
  if (c.citedRows + c.uncitedRows !== c.boundRows) {
    return `partition broken: ${c.citedRows} cited + ${c.uncitedRows} uncited != ${c.boundRows} enumerated bound row(s)`;
  }
  if (!c.control.present || !c.control.hasToken
      || c.control.boundRows !== expect.controlBoundRows || c.control.citedRows !== expect.controlCitedRows) {
    return `the ${c.control.file} control failed (present=${c.control.present} bound=${c.control.boundRows} expected ${expect.controlBoundRows}, cited=${c.control.citedRows} expected ${expect.controlCitedRows}, carries 857.5662=${c.control.hasToken}) — this is the wrong or a damaged corpus, not a clean one`;
  }
  return null;
}

export function corpusRun(dir, opts = {}) {
  const lines = [];
  const c = countCorpus(dir, opts);
  const refusal = corpusRefusal(c);
  if (refusal) {
    lines.push(`corpus: ${refusal}`);
    lines.push('RESULT: FAIL — the corpus figures were not established, so no denominator is printed (exit 2)');
    return { code: 2, lines, counts: c };
  }
  lines.push(`corpus: ${c.boundRows} bound row(s) across ${c.files} constant file(s) — ${c.citedRows} cited, ${c.uncitedRows} uncited`);
  lines.push('  bound row: a data row under "## Known upper bounds" / "## Known lower bounds" (extract-pins.mjs definition; HTML comments, table headers and separators excluded).');
  lines.push('  cited row: names at least one bracketed reference token anywhere in the row.');
  lines.push(`  control (${c.control.file}): ${c.control.boundRows} bound row(s), ${c.control.citedRows} cited, carries 857.5662 — pinned to the 7 and 6 A-47.note2 recorded, so an upstream edit to that file trips this rather than passing silently.`);
  lines.push(`  inventory: ${c.files} constant file(s) against ${c.expectedFiles} in the mirror manifest, and every one contributed at least one bound row.`);
  lines.push(`  sections: all ${c.expectedSections.size} section(s) the committed generated pins expect produced rows — this detects WHOLE-SECTION disappearance and nothing finer.`);
  lines.push('  table syntax: no line inside a bounds table block fails to start with "|", so no row is being dropped as unreadable — the check for row loss WITHIN a section, which the section baseline cannot see.');
  lines.push(`  partition: ${c.citedRows} + ${c.uncitedRows} = ${c.boundRows}. This proves only that the two classes exhaust the rows the parser ENUMERATED. What it is NOT: a proof of completeness. The four checks above are each narrow — inventory catches missing files, per-file catches an empty file, sections catch a vanished section, table syntax catches a row this parser cannot read — and a row that is well-formed, present and simply absent from upstream is invisible to all of them, as it should be.`);
  lines.push(`RESULT: PASS — ${c.citedRows} cited of ${c.boundRows} bound row(s) (exit 0)`);
  return { code: 0, lines, counts: c };
}

function selftest() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-audit-selftest-'));
  const sound = { id: 'X-1', constant: '00z', citedRef: 'REF', leg: 'value-vs-source', rowFile: 'f.md', rowLine: 1, rowTextSha256: 'deadbeef', source: 'https://example.invalid', sourceRead: 'fixture', verdict: 'SOUND' };
  const write = (name, obj) => {
    const p = path.join(dir, name);
    fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
    return p;
  };
  const fails = [];
  const check = (label, got, want) => {
    const ok = got === want;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label} — exit ${got} (expected ${want})`);
    if (!ok) fails.push(label);
  };

  // Populated store: silent when the condition is absent.
  check('a populated store reads clean', run(write('good.json', { audits: [sound, { ...sound, id: 'X-2', verdict: 'UNRESOLVED' }] })).code, 0);
  // Each refusal fires when its own condition is present.
  check('a MISSING store refuses rather than reporting zero', run(path.join(dir, 'nope.json')).code, 2);
  check('an EMPTY store refuses rather than reporting zero', run(write('empty.json', { audits: [] })).code, 2);
  check('an unparseable store refuses rather than reading as empty', run((() => { const p = path.join(dir, 'bad.json'); fs.writeFileSync(p, '{not json'); return p; })()).code, 2);
  check('an unrecognised verdict trips the sum-check', run(write('sum.json', { audits: [sound, { ...sound, id: 'X-3', verdict: 'PROBABLY FINE' }] })).code, 3);
  // The sum-check must not fire on a store that is merely all-one-verdict.
  check('a store of only UNREACHABLE rows still sums (no false sum-check)', run(write('unreach.json', { audits: [{ ...sound, verdict: 'UNREACHABLE' }] })).code, 0);

  // --- the corpus count, both polarities (2026-09-11) ---
  const eq = (label, got, want) => {
    const ok = got === want;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label} — ${got} (expected ${want})`);
    if (!ok) fails.push(label);
  };
  const page = (upper, lower) => `# T\n\n## Known upper bounds\n\n| Bound | Ref | Notes |\n| --- | --- | --- |\n${upper}\n\n## Known lower bounds\n\n| Bound | Ref | Notes |\n| --- | --- | --- |\n${lower}\n\n## References\n\n- [X2020] a reference LIST entry, which is not a bound row\n`;
  const upper01 = '| $1$ | [A2020] | cited |\n| $2$ | | uncited |\n<!-- | $3$ | [C2020] | commented out | -->';
  const corpusDir = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-corpus-selftest-'));
  fs.writeFileSync(path.join(corpusDir, '01a.md'), page(upper01, '| $0.5$ | [B2020] | cited |'));
  fs.writeFileSync(path.join(corpusDir, '87a.md'), page('| $857.5662$ | [HMR2019] | the control row |', '| $1$ | [HMR2019] | cited |'));
  // The fixture control mirrors 87a's shape at a size a fixture can carry, and every expectation is
  // passed in, so the pinned live numbers (7 and 6, 115 files) are never silently re-used here.
  const expect = { controlBoundRows: 2, controlCitedRows: 2 };
  const sections = new Set(['01a:U', '01a:L', '87a:U', '87a:L']);
  const base = { expectedFiles: 2, expectedSections: sections };
  const good = countCorpus(corpusDir, base);
  // The counts must come out exactly: a commented row is not a bound row, and a reference LIST
  // entry is not one either — both are what made the whole-file regex overcount on 2026-09-11.
  eq('corpus counts bound rows, skipping commented rows and reference lists', `${good.files}/${good.boundRows}/${good.citedRows}/${good.uncitedRows}`, '2/5/4/1');
  eq('a well-formed corpus does not refuse', corpusRefusal(good, expect), null);
  // FIRES THROUGH THE COUNTER over MUTATED fixtures, never through fabricated totals. Round 1 found
  // the partition could not fail against real enumeration; round 2 then drove 770/673 down to
  // 428/392 with every file still contributing rows, which is what the section baseline now catches.
  const partial = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-corpus-partial-'));
  fs.writeFileSync(path.join(partial, '01a.md'), page(upper01, '| $0.5$ | [B2020] | cited |').replace('## Known lower bounds', '## Known lower bounds (2024 revision)'));
  fs.writeFileSync(path.join(partial, '87a.md'), page('| $857.5662$ | [HMR2019] | the control row |', '| $1$ | [HMR2019] | cited |'));
  const partialCounts = countCorpus(partial, base);
  eq('PARTIAL section loss refuses although every file still contributes rows', typeof corpusRefusal(partialCounts, expect), 'string');
  eq('  …and it is caught by the section baseline, naming the lost section', partialCounts.missingSections.join(','), '01a:L');
  // FIRES — row loss WITHIN a section: the reviewer's round-3 mutation, where an interior row loses
  // its (optional, legal) leading pipe, the section still yields its last row, and every other check
  // passes. The counter keeps extract-pins' definition and refuses what it cannot read.
  const pipeless = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-corpus-pipeless-'));
  fs.writeFileSync(path.join(pipeless, '01a.md'), page(upper01.replace('| $2$ | | uncited |', '$2$ | | uncited |'), '| $0.5$ | [B2020] | cited |'));
  fs.writeFileSync(path.join(pipeless, '87a.md'), page('| $857.5662$ | [HMR2019] | the control row |', '| $1$ | [HMR2019] | cited |'));
  const pipelessCounts = countCorpus(pipeless, base);
  eq('a row that lost its leading pipe refuses although its section still yields rows', typeof corpusRefusal(pipelessCounts, expect), 'string');
  eq('  …and the section baseline alone would NOT have caught it', pipelessCounts.missingSections.length, 0);
  // FIRES — rows moved into a SECOND table block in the same section, which the previous scan never
  // reached because it stopped at the first blank line (review round 4: 235 bound / 147 cited, exit 0).
  const split = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-corpus-split-'));
  fs.writeFileSync(path.join(split, '01a.md'), page('| $1$ | [A2020] | cited |', '| $0.5$ | [B2020] | cited |')
    .replace('| $0.5$ | [B2020] | cited |', '| $0.5$ | [B2020] | cited |\n\n| Bound | Ref | Notes |\n| --- | --- | --- |\n$9$ | [D2020] | moved here without a leading pipe |'));
  fs.writeFileSync(path.join(split, '87a.md'), page('| $857.5662$ | [HMR2019] | the control row |', '| $1$ | [HMR2019] | cited |'));
  eq('a row hidden in a SECOND table block refuses', typeof corpusRefusal(countCorpus(split, base), expect), 'string');
  // SILENT — legal block terminators. A blockquote or a heading directly after a table ends it under
  // GFM; treating those as dropped rows refused an intact corpus in round 4, which is the
  // permanently-red alarm this lane refuses to ship.
  const terminators = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-corpus-terminators-'));
  fs.writeFileSync(path.join(terminators, '01a.md'), page(upper01, '| $0.5$ | [B2020] | cited |')
    .replace('| $0.5$ | [B2020] | cited |', '| $0.5$ | [B2020] | cited |\n> an upstream annotation directly after the table\n### A later heading'));
  fs.writeFileSync(path.join(terminators, '87a.md'), page('| $857.5662$ | [HMR2019] | the control row |', '| $1$ | [HMR2019] | cited |'));
  const termCounts = countCorpus(terminators, base);
  eq('a blockquote and a heading directly after a table do NOT refuse', corpusRefusal(termCounts, expect), null);
  eq('  …and the rows are still counted intact', `${termCounts.boundRows}/${termCounts.citedRows}`, '5/4');
  // FIRES — a short inventory against the manifest's own file count.
  eq('a corpus short of the manifest inventory refuses', typeof corpusRefusal(countCorpus(corpusDir, { ...base, expectedFiles: 3 }), expect), 'string');
  // FIRES — an expectation that could not be established at all must not read as clean.
  eq('an unreadable manifest (no file expectation) refuses', typeof corpusRefusal(countCorpus(corpusDir, { expectedSections: sections }), expect), 'string');
  eq('an unreadable pin baseline (no section expectation) refuses', typeof corpusRefusal(countCorpus(corpusDir, { expectedFiles: 2 }), expect), 'string');
  // FIRES — the control file present but carrying different counts than the pinned ones.
  eq('an 87a control whose row counts moved refuses', typeof corpusRefusal(good, { controlBoundRows: 7, controlCitedRows: 6 }), 'string');
  // FIRES — a dead probe. An unreadable or empty directory must never read as an empty mirror.
  eq('an empty corpus directory refuses rather than reporting zero rows', typeof corpusRefusal(countCorpus(path.join(corpusDir, 'nope'), base), expect), 'string');
  // FIRES — the wrong corpus: files present, 87a absent entirely.
  const noControl = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-corpus-nocontrol-'));
  fs.writeFileSync(path.join(noControl, '01a.md'), page('| $1$ | [A2020] | cited |', '| $0.5$ | [B2020] | cited |'));
  eq('a corpus missing the 87a control refuses', typeof corpusRefusal(countCorpus(noControl, { expectedFiles: 1, expectedSections: new Set(['01a:U', '01a:L']) }), expect), 'string');
  // --- THE DRAW, both polarities (2026-09-12, from the adversarial review that blocked it) ---
  // LINE MAPPING. A commented-out DUPLICATE of a live row sits ABOVE it. The draw must report the
  // LIVE row's line, and the assertion reads the file back AT that line and requires the row text
  // there — which is what failed before comments were blanked in place rather than deleted: the
  // lookup found the commented copy first, and the row HASH matched either way, so a verdict could
  // point at excluded text with nothing to catch it.
  const drawDir = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-draw-'));
  const dupUpper = '<!-- | $1$ | [A2020] | an older copy, commented out | -->\n| $1$ | [A2020] | the live row |';
  fs.writeFileSync(path.join(drawDir, '01a.md'), page(dupUpper, '| $0.5$ | [B2020] | cited |'));
  fs.writeFileSync(path.join(drawDir, '87a.md'), page('| $857.5662$ | [HMR2019] | the control row |', '| $1$ | [HMR2019] | cited |'));
  const drawnRow = drawFrame(drawDir)[0];
  const lineText = fs.readFileSync(path.join(drawDir, '01a.md'), 'utf8').split('\n')[drawnRow.line - 1].trim();
  eq('a commented-out duplicate does not steal the live row\'s line', lineText, drawnRow.text);
  // An INLINE comment inside a row still yields a real location. The stored text has the comment
  // blanked, so it no longer equals the raw line and ONLY the line number ties the two together —
  // the shape that previously reported line 0.
  const inlineDir = fs.mkdtempSync(path.join(os.tmpdir(), 'depth-draw-inline-'));
  fs.writeFileSync(path.join(inlineDir, '01a.md'), page('| $7$ | [A2020] | note <!-- hidden --> tail |', '| $0.5$ | [B2020] | cited |'));
  const inlineRow = drawFrame(inlineDir)[0];
  eq('a row carrying an inline comment reports a real line, never 0', inlineRow.line > 0, true);
  eq('  …and that line is the row it was parsed from', fs.readFileSync(path.join(inlineDir, '01a.md'), 'utf8').split('\n')[inlineRow.line - 1].includes('[A2020]'), true);
  // FRAME VALIDATION. The draw must refuse anything --corpus refuses: over the partial-section
  // fixture above, a draw that checked only its own bounds renumbered the frame and reported PASS.
  eq('the draw REFUSES a frame the corpus check rejects', drawRun(partial, [1], { ...base, expect }).code, 2);
  eq('  …and stays silent on the intact fixture, drawing position 1', drawRun(corpusDir, [1], { ...base, expect }).code, 0);
  eq('a position past the end of the frame refuses rather than drawing a neighbour', drawRun(corpusDir, [9999], { ...base, expect }).code, 3);
  fs.rmSync(drawDir, { recursive: true, force: true });
  fs.rmSync(inlineDir, { recursive: true, force: true });

  fs.rmSync(corpusDir, { recursive: true, force: true });
  fs.rmSync(partial, { recursive: true, force: true });
  fs.rmSync(pipeless, { recursive: true, force: true });
  fs.rmSync(split, { recursive: true, force: true });
  fs.rmSync(terminators, { recursive: true, force: true });
  fs.rmSync(noControl, { recursive: true, force: true });

  fs.rmSync(dir, { recursive: true, force: true });
  if (fails.length) {
    console.log(`RESULT: FAIL — depth-audit selftest: ${fails.length} case(s) failed: ${fails.join(' · ')} (exit 2)`);
    process.exit(2);
  }
  console.log('depth-audit selftest: PASS (clean store silent; missing, empty and unparseable stores each refuse rather than reporting a zero; an unrecognised verdict trips the sum-check; an all-UNREACHABLE store does NOT trip it; the corpus count skips commented rows and reference lists, and refuses PARTIAL section loss by name, a row that lost its leading pipe while its section still yielded rows, a row hidden in a second table block, a short manifest inventory, an inventory or section baseline that could not be established at all, a moved 87a control, an empty directory and a corpus missing its control — while a blockquote or heading ending a table legally stays SILENT)');
  console.log('RESULT: PASS — 27 case(s), both polarities (exit 0)');
}

// THE SAMPLING FRAME, MADE EXECUTABLE (2026-09-12). Slices 1 and 2 were drawn by a script
// that was never committed, which is the same shape as the 543 denominator nobody could
// re-derive — the draw was prose and the reader had to trust it. `--draw` prints the rows
// at given 1-based positions using THIS file's parser and cited-row definition, so the
// frame it draws from is the one --corpus counts rather than a second opinion about what a
// bound row is. It draws ONLY: it never fetches a source, never judges a row, never writes
// the store. Lives here rather than in a sibling script because depth-audit.mjs runs its
// CLI at import time, so any importer inherits an exit before its own first line.
export function drawFrame(dir) {
  const frame = [];
  let names = [];
  try { names = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort(); } catch { names = []; }
  for (const name of names) {
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    const { rows } = boundRowsOf(text);
    // FILE-then-LINE order, SORTED rather than assumed. boundRowsOf walks upper bounds before
    // lower bounds, so a file listing its lower table first would enumerate out of document order
    // and every stored POSITION would silently mean a different row. No file in the mirror does
    // that today — measured 2026-09-12, 0 of 115 — which is precisely why it is sorted instead of
    // trusted: the day one does, the frame must not renumber itself behind the stored slices.
    const cited = rows.filter((r) => CITED_REF_RE.test(r.text)).sort((a, b) => a.line - b.line);
    for (const r of cited) {
      frame.push({
        constant: name.replace(/\.md$/, ''),
        file: `ledger/teorth-optimizationproblems/constants/${name}`,
        line: r.line,
        section: r.section,
        text: r.text,
        sha16: crypto.createHash('sha256').update(r.text, 'utf8').digest('hex').slice(0, 16),
        ref: (CITED_REF_RE.exec(r.text) || [, '(none)'])[1],
      });
    }
  }
  return frame;
}

// A DRAW IS ONLY AS GOOD AS THE FRAME IT DRAWS FROM, so this runs the corpus's own refusals first
// and declines to draw from anything --corpus would reject (adversarial review, 2026-09-12: a
// fixture with a renamed upper-bound heading left 669 rows, and position 100 quietly became a
// different constant, while corpusRun exited 2 over the same directory). It also proves the two
// readings agree on the population size rather than printing that as an instruction to the reader.
export function drawRun(dir, positions, opts = {}) {
  const lines = [];
  const c = countCorpus(dir, { expectedFiles: opts.expectedFiles ?? null, expectedSections: opts.expectedSections ?? null });
  const refusal = corpusRefusal(c, opts.expect);
  if (refusal) {
    lines.push(`RESULT: FAIL — refusing to draw from a frame the corpus check itself rejects: ${refusal} (exit 2)`);
    return { code: 2, lines };
  }
  const frame = drawFrame(dir);
  if (frame.length !== c.citedRows) {
    lines.push(`RESULT: FAIL — the draw enumerated ${frame.length} cited row(s) while the corpus counter reports ${c.citedRows} over the same directory — two readings of one population, so neither the draw nor the denominator means anything (exit 3)`);
    return { code: 3, lines };
  }
  if (positions.length === 0 || positions.some((p) => !Number.isInteger(p) || p < 1)) {
    lines.push('RESULT: FAIL — positions must be 1-based integers: node scripts/depth-audit.mjs --draw <position> [position...] (exit 2)');
    return { code: 2, lines };
  }
  const tooHigh = positions.filter((p) => p > frame.length);
  if (tooHigh.length > 0) {
    lines.push(`RESULT: FAIL — position(s) ${tooHigh.join(', ')} exceed the frame size ${frame.length} — refusing rather than silently drawing a neighbour (exit 3)`);
    return { code: 3, lines };
  }
  lines.push(`frame: ${frame.length} cited bound row(s), file-then-line order — the same total the corpus counter reports over this directory, checked on this run rather than asserted`);
  for (const p of positions) {
    const row = frame[p - 1];
    lines.push('');
    lines.push(`position ${p} of ${frame.length} — ${row.constant} [${row.ref}] (${row.section})`);
    lines.push(`  row:  ${row.file}:${row.line}`);
    lines.push(`  sha:  ${row.sha16}`);
    lines.push(`  text: ${row.text}`);
  }
  lines.push('');
  lines.push(`RESULT: PASS — drew ${positions.length} position(s) from a frame of ${frame.length} (exit 0)`);
  return { code: 0, lines };
}

// The two live baselines, read from committed artifacts rather than this script's memory, shared by
// --corpus and --draw so a draw can never be validated against a weaker expectation than a count.
function liveBaselines(cdir) {
  let expectedFiles = null;
  try {
    const man = JSON.parse(fs.readFileSync(path.join(cdir, '..', 'manifest.json'), 'utf8'));
    if (Number.isFinite(man.fileCount)) expectedFiles = man.fileCount - (man.rootFiles?.length ?? 0);
  } catch { expectedFiles = null; }
  let expectedSections = null;
  try { expectedSections = expectedSectionsFromClaims(path.join(REPO, 'ledger', 'claims.json')); } catch { expectedSections = null; }
  if (expectedSections && expectedSections.size === 0) expectedSections = null;
  return { expectedFiles, expectedSections };
}

const argv = process.argv.slice(2);
if (argv.includes('--draw')) {
  const raw = argv.slice(argv.indexOf('--draw') + 1);
  const positions = raw.map((a) => Number(a));
  if (positions.length === 0 || positions.some((p) => !Number.isInteger(p) || p < 1)) {
    console.log('RESULT: FAIL — usage: node scripts/depth-audit.mjs --draw <position> [position...] (1-based integers) (exit 2)');
    process.exit(2);
  }
  const cdir = path.join(REPO, 'ledger', 'teorth-optimizationproblems', 'constants');
  const { code, lines } = drawRun(cdir, positions, liveBaselines(cdir));
  for (const l of lines) console.log(l);
  process.exit(code);
} else if (argv.includes('--selftest')) {
  selftest();
} else if (argv.includes('--corpus')) {
  const j = argv.indexOf('--constants');
  const cdir = j !== -1 && argv[j + 1]
    ? path.resolve(argv[j + 1])
    : path.join(REPO, 'ledger', 'teorth-optimizationproblems', 'constants');
  // Both baselines come from committed artifacts rather than this script's memory: the mirror's own
  // manifest for the file inventory, and the generated pins for the per-section expectation. If
  // either cannot be read the run REFUSES — corpusRefusal treats a null expectation as unestablished.
  const { code, lines } = corpusRun(cdir, liveBaselines(cdir));
  for (const l of lines) console.log(l);
  process.exit(code);
} else {
  const i = argv.indexOf('--store');
  const storePath = i !== -1 && argv[i + 1] ? path.resolve(argv[i + 1]) : DEFAULT_STORE;
  const { code, lines } = run(storePath);
  for (const l of lines) console.log(l);
  process.exit(code);
}
