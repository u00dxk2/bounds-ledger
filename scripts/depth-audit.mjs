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
  lines.push(`population: the ${audits.length} row(s) recorded in ${rel}, across constant file(s) ${constants.join(', ')}. NOT a sample of the 543 cited rows — see the sampling line above.`);
  lines.push(`blindTo: every cited row not yet in this store; whether a SOUND row's source says something the auditor did not think to ask; whether an UNRESOLVED row is sound or defective, which is the whole content of that verdict; and any defect in the 220 UNCITED rows, which this audit cannot reach by construction.`);
  lines.push(`RESULT: PASS — ${audits.length} audited, ${counts.SOUND} sound, ${counts.DEFECTIVE} defective, ${counts.UNRESOLVED} unresolved, ${counts.UNREACHABLE} unreachable (exit 0)`);
  return { code: 0, lines };
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

  fs.rmSync(dir, { recursive: true, force: true });
  if (fails.length) {
    console.log(`RESULT: FAIL — depth-audit selftest: ${fails.length} case(s) failed: ${fails.join(' · ')} (exit 2)`);
    process.exit(2);
  }
  console.log('depth-audit selftest: PASS (clean store silent; missing, empty and unparseable stores each refuse rather than reporting a zero; an unrecognised verdict trips the sum-check; an all-UNREACHABLE store does NOT trip it)');
  console.log('RESULT: PASS — 6 case(s), both polarities (exit 0)');
}

const argv = process.argv.slice(2);
if (argv.includes('--selftest')) {
  selftest();
} else {
  const i = argv.indexOf('--store');
  const storePath = i !== -1 && argv[i + 1] ? path.resolve(argv[i + 1]) : DEFAULT_STORE;
  const { code, lines } = run(storePath);
  for (const l of lines) console.log(l);
  process.exit(code);
}
