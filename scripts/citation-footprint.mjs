#!/usr/bin/env node
// Citation footprint for ONE DOI across three independent indices.
//
// WHY THIS EXISTS (A-48, 2026-09-14): the row's readCommand was an inline
// `node -e "…"` one-liner. On this box the fleet gate runner spawns through
// cmd.exe, which interprets the ")" at offset 148, so the child NEVER SPAWNED
// and the row read UNRUNNABLE rather than answered. A committed script has no
// escaping surface. It also does what the row actually needs: A-48 requires a
// footprint from at least TWO independent indices, and the old command read one.
//
// WHAT A COUNT HERE MEANS — and does not. Indices disagree by an order of
// magnitude on the same work (10.37236/21 read 36 / 612 / 433 on 2026-09-11),
// so surfaces are compared by ORDER ACROSS INDICES, never by one index's
// magnitude. This script prints figures and no verdict.
//
// A non-200, or a 200 whose body carries no count field, is BLOCKED — a fact
// about the index, never a low or zero footprint (A-48 onTrigger). Exit 2 when
// any index is BLOCKED, so a partial read cannot be presented as a comparison.

const INDICES = [
  {
    name: 'crossref',
    url: (doi) => `https://api.crossref.org/works/${doi}`,
    field: 'is-referenced-by-count',
    pick: (j) => j?.message?.['is-referenced-by-count'],
  },
  {
    name: 'semantic-scholar',
    url: (doi) => `https://api.semanticscholar.org/graph/v1/paper/DOI:${doi}?fields=citationCount`,
    field: 'citationCount',
    pick: (j) => j?.citationCount,
  },
  {
    name: 'openalex',
    url: (doi) => `https://api.openalex.org/works/doi:${doi}`,
    field: 'cited_by_count',
    pick: (j) => j?.cited_by_count,
  },
];

// Returns {name, status, count} — count is null when BLOCKED.
async function read(index, doi, fetchImpl = fetch) {
  let status = 0;
  let count = null;
  try {
    const res = await fetchImpl(index.url(doi), {
      headers: { 'user-agent': 'bounds-ledger citation-footprint (+https://github.com/u00dxk2/bounds-ledger)' },
    });
    status = res.status;
    if (res.ok) {
      const picked = index.pick(await res.json());
      if (Number.isInteger(picked)) count = picked;
    }
  } catch (err) {
    status = 0;
  }
  return { name: index.name, field: index.field, status, count };
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--selftest') return selftest();

  const doi = args[0];
  if (!doi) {
    console.error('usage: node scripts/citation-footprint.mjs <doi>   # e.g. 10.37236/21');
    process.exitCode = 2;
    return;
  }

  const rows = await Promise.all(INDICES.map((i) => read(i, doi)));
  for (const r of rows) {
    const shown = r.count === null ? 'BLOCKED (no usable count — a fact about the index, NOT a low footprint)' : r.count;
    console.log(`${r.name} HTTP ${r.status} ${r.field}: ${shown}`);
  }

  const blocked = rows.filter((r) => r.count === null);
  const ok = rows.filter((r) => r.count !== null);
  console.log(`indices readable: ${ok.length} of ${rows.length}${ok.length ? ` (${ok.map((r) => `${r.name} ${r.count}`).join(', ')})` : ''}`);
  console.log('figures only, no verdict: compare surfaces by ORDER across indices, never by one index’s magnitude.');

  if (blocked.length) {
    console.log(`RESULT: BLOCKED — ${blocked.map((r) => r.name).join(', ')} gave no usable count; a two-index comparison is NOT supported by this run (exit 2)`);
    process.exitCode = 2;
    return;
  }
  console.log(`RESULT: READABLE — ${ok.length} independent indices answered for ${doi} (exit 0)`);
}

// KP-78: the BLOCKED branch must be shown to fire and to stay silent.
async function selftest() {
  const idx = INDICES[0];
  const cases = [
    ['200 with a count field', { ok: true, status: 200, json: async () => ({ message: { 'is-referenced-by-count': 36 } }) }, 36],
    ['200 with NO count field', { ok: true, status: 200, json: async () => ({ message: {} }) }, null],
    ['429 rate limited', { ok: false, status: 429, json: async () => ({}) }, null],
    ['500 upstream error', { ok: false, status: 500, json: async () => ({}) }, null],
    ['200 with a count of ZERO', { ok: true, status: 200, json: async () => ({ message: { 'is-referenced-by-count': 0 } }) }, 0],
  ];

  let failed = 0;
  for (const [label, res, expected] of cases) {
    const got = (await read(idx, '10.37236/21', async () => res)).count;
    const pass = got === expected;
    if (!pass) failed++;
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${label} -> count ${JSON.stringify(got)} (expected ${JSON.stringify(expected)})`);
  }

  // The distinction the row turns on: a real zero is NOT the blocked state.
  const realZero = (await read(idx, 'x', async () => ({ ok: true, status: 200, json: async () => ({ message: { 'is-referenced-by-count': 0 } }) }))).count;
  const blocked = (await read(idx, 'x', async () => ({ ok: false, status: 429, json: async () => ({}) }))).count;
  const distinct = realZero === 0 && blocked === null;
  if (!distinct) failed++;
  console.log(`${distinct ? 'PASS' : 'FAIL'}  a measured 0 (${JSON.stringify(realZero)}) is distinguishable from BLOCKED (${JSON.stringify(blocked)})`);

  console.log(failed ? `RESULT: FAIL — ${failed} case(s)` : 'RESULT: PASS (6 cases: count read, no-count field, 429, 500, measured zero, and zero-vs-BLOCKED kept distinct)');
  process.exitCode = failed ? 3 : 0;
}

main().catch((err) => {
  console.error('citation-footprint: ' + err.message);
  process.exitCode = 2;
});
