#!/usr/bin/env node
// check-ramsey-coloring.mjs -- A-54 phase 4. The recomputation behind the depth reading of
// R(7, 8) >= 219 [Tat] in continuity/depth-audit-ds1.json, committed so that reading can be
// re-derived by anyone rather than trusted: fetch the credited file, then run this on it.
// Written by a sub-agent in the 2026-09-18 session, reviewed and re-run by the session before
// it was committed. The graph file itself is NOT stored here; the reading names its URL and
// fingerprints.
//
// Exhaustive check of an edge 2-coloring file in the format of
// github.com/milostatarevic/ramsey-numbers/graphs. That directory's README defines it:
//   "The file name gXY.n gives a 2-coloring of the edges of K_n with no copy of
//    K_X colored 0, and no copy of K_Y colored 1.
//    In each file, the i-th entry in the j-th row gives the color assigned to the edge (i,j)."
//
// Usage:
//   node scripts/check-ramsey-coloring.mjs <file> <X> <Y> [expectedN]
//   node scripts/check-ramsey-coloring.mjs --selftest
//
// Two independent exhaustive methods are run for each colour class, and they must agree:
//   [A] exact maximum clique by branch-and-bound with a greedy-colouring upper bound
//       (Tomita MCQ style, on Uint32Array bitsets). Returns a witness clique, which is
//       re-checked against the raw character matrix, not the bitsets.
//   [B] exhaustive ordered enumeration v1<v2<...<vk of all k-cliques, counting them,
//       with only the trivial prune depth+|candidates| < k.
//
// Exit: 0 PASS  = no K_X in colour 0, no K_Y in colour 1 (and n == expectedN if given)
//       1 FAIL  = a forbidden monochromatic clique exists, or n != expectedN
//       2 UNREADABLE = not an n x n symmetric 0/1 matrix
//       3 INCONSISTENT = methods A and B disagree (a checker defect; no verdict)
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { isEntryModule } from './lib/entry-module.mjs';

// ---------- bitset helpers ----------
function pc32(x) {
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return Math.imul((x + (x >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24;
}
function popcount(B) { let c = 0; for (let w = 0; w < B.length; w++) c += pc32(B[w]); return c; }
function isEmpty(B) { for (let w = 0; w < B.length; w++) if (B[w] !== 0) return false; return true; }
function lowest(B) {
  for (let w = 0; w < B.length; w++) {
    const x = B[w];
    if (x !== 0) return (w << 5) + (31 - Math.clz32(x & -x));
  }
  return -1;
}
function clearBit(B, v) { B[v >> 5] &= ~(1 << (v & 31)); }
function setBit(B, v) { B[v >> 5] |= (1 << (v & 31)); }

// ---------- parsing ----------
export function parseMatrix(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  const n = lines.length;
  const errors = [];
  for (let j = 0; j < n; j++) {
    if (lines[j].length !== n) errors.push(`row ${j} has length ${lines[j].length}, expected ${n}`);
    else if (!/^[01]+$/.test(lines[j])) errors.push(`row ${j} contains a character other than 0/1`);
    if (errors.length > 5) break;
  }
  return { n, lines, errors };
}

export function buildColourGraph(lines, n, colourChar) {
  const W = (n + 31) >>> 5;
  const adj = [];
  for (let v = 0; v < n; v++) {
    const B = new Uint32Array(W);
    for (let u = 0; u < n; u++) if (u !== v && lines[v][u] === colourChar) setBit(B, u);
    adj.push(B);
  }
  return adj;
}

// ---------- [A] branch and bound maximum clique ----------
export function maxClique(adj, n) {
  const W = (n + 31) >>> 5;
  let best = [];
  const cur = [];
  let nodes = 0;
  const bufs = [];
  const Ubuf = new Uint32Array(W), Qbuf = new Uint32Array(W);
  function expand(depth) {
    nodes++;
    const P = bufs[depth];
    // greedy sequential colouring of P -> order + nondecreasing colour numbers
    const m0 = popcount(P);
    const order = new Int32Array(m0), colour = new Int32Array(m0);
    Ubuf.set(P);
    let k = 0, m = 0;
    while (!isEmpty(Ubuf)) {
      k++;
      Qbuf.set(Ubuf);
      while (!isEmpty(Qbuf)) {
        const v = lowest(Qbuf);
        clearBit(Qbuf, v); clearBit(Ubuf, v);
        const a = adj[v];
        for (let w = 0; w < W; w++) Qbuf[w] &= ~a[w];
        order[m] = v; colour[m] = k; m++;
      }
    }
    if (!bufs[depth + 1]) bufs[depth + 1] = new Uint32Array(W);
    const NP = bufs[depth + 1];
    for (let idx = m - 1; idx >= 0; idx--) {
      if (cur.length + colour[idx] <= best.length) return;
      const v = order[idx];
      cur.push(v);
      const a = adj[v];
      let empty = true;
      for (let w = 0; w < W; w++) { NP[w] = P[w] & a[w]; if (NP[w] !== 0) empty = false; }
      if (empty) { if (cur.length > best.length) best = cur.slice(); }
      else expand(depth + 1);
      cur.pop();
      clearBit(P, v);
    }
  }
  bufs[0] = new Uint32Array(W);
  for (let v = 0; v < n; v++) setBit(bufs[0], v);
  expand(0);
  return { size: best.length, witness: best.slice().sort((x, y) => x - y), nodes };
}

// ---------- [B] exhaustive ordered enumeration of k-cliques ----------
export function countCliques(adj, n, k) {
  const W = (n + 31) >>> 5;
  let count = 0, first = null, nodes = 0;
  const stack = new Int32Array(k);
  const bufs = [];
  for (let d = 0; d <= k; d++) bufs.push(new Uint32Array(W));
  for (let v = 0; v < n; v++) setBit(bufs[0], v);
  function rec(depth) {
    nodes++;
    const C = bufs[depth];
    for (;;) {
      if (depth + popcount(C) < k) return;
      const v = lowest(C);
      clearBit(C, v);
      stack[depth] = v;
      if (depth + 1 === k) { count++; if (!first) first = Array.from(stack); continue; }
      const NC = bufs[depth + 1], a = adj[v];
      for (let w = 0; w < W; w++) NC[w] = C[w] & a[w];
      rec(depth + 1);
    }
  }
  if (k <= 0) return { count: 1, first: [], nodes: 0 };
  rec(0);
  return { count, first, nodes };
}

function verifyCliqueAgainstMatrix(lines, verts, colourChar) {
  for (let a = 0; a < verts.length; a++)
    for (let b = a + 1; b < verts.length; b++) {
      const i = verts[a], j = verts[b];
      if (i === j || lines[j][i] !== colourChar || lines[i][j] !== colourChar) return false;
    }
  return new Set(verts).size === verts.length;
}

function ms(t0) { return (Number(process.hrtime.bigint() - t0) / 1e6).toFixed(1); }

// ---------- main check ----------
export function checkText(text, X, Y, expectedN, log = console.log) {
  // INPUT VALIDATION FIRST. Without it an EMPTY file passed: no rows, so no forbidden clique, so
  // PASS — a checker that cannot fail on the one input a broken download actually produces
  // (adversarial review, 2026-09-18). Non-integer thresholds were accepted too, and would have
  // "verified" R(3.5, 3.5).
  const okInt = (v) => Number.isSafeInteger(v) && v >= 2;
  if (!okInt(X) || !okInt(Y)) { log(`INVALID ARGUMENTS: forbidden clique sizes must be integers >= 2, got X=${X}, Y=${Y}`); log('RESULT: UNREADABLE'); return 2; }
  if (expectedN !== undefined && !(Number.isSafeInteger(expectedN) && expectedN >= 1)) { log(`INVALID ARGUMENTS: expectedN must be a positive integer, got ${expectedN}`); log('RESULT: UNREADABLE'); return 2; }
  const { n, lines, errors } = parseMatrix(text);
  log(`rows: ${n}`);
  if (n < 1) { log('FORMAT ERROR: the file holds no rows'); log('RESULT: UNREADABLE'); return 2; }
  if (errors.length) { for (const e of errors) log(`FORMAT ERROR: ${e}`); log('RESULT: UNREADABLE'); return 2; }
  log(`every row has ${n} characters, all in {0,1}`);
  let diag0 = 0, diag1 = 0;
  for (let v = 0; v < n; v++) (lines[v][v] === '0' ? diag0++ : diag1++);
  log(`diagonal: ${diag0} x '0', ${diag1} x '1' (diagonal is not an edge; ignored)`);
  let asym = 0, pairs = 0, e0 = 0, e1 = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    pairs++;
    if (lines[i][j] !== lines[j][i]) asym++;
    else if (lines[i][j] === '0') e0++; else e1++;
  }
  log(`symmetric: ${asym === 0 ? 'yes' : 'NO'} (${asym} asymmetric pairs of ${pairs})`);
  if (asym) { log('RESULT: UNREADABLE (colour of an edge is not well defined)'); return 2; }
  log(`colour-0 edges: ${e0}, colour-1 edges: ${e1}, total ${e0 + e1} = C(${n},2) = ${pairs}`);
  let verdictFail = false, inconsistent = false;
  if (expectedN !== undefined && n !== expectedN) { log(`VERTEX COUNT MISMATCH: n=${n}, expected ${expectedN}`); verdictFail = true; }
  for (const [c, forb] of [['0', X], ['1', Y]]) {
    const adj = buildColourGraph(lines, n, c);
    let dmin = Infinity, dmax = 0;
    for (const B of adj) { const d = popcount(B); dmin = Math.min(dmin, d); dmax = Math.max(dmax, d); }
    log(`-- colour ${c} (forbidden: K${forb}); degree min ${dmin}, max ${dmax}`);
    let t0 = process.hrtime.bigint();
    const A = maxClique(adj, n);
    const okW = verifyCliqueAgainstMatrix(lines, A.witness, c);
    log(`[A] max clique in colour ${c} = ${A.size}; witness [${A.witness.join(',')}] ${okW ? 'verified against the raw matrix' : 'FAILED raw-matrix verification'}; search nodes ${A.nodes}; ${ms(t0)} ms`);
    if (!okW) inconsistent = true;
    t0 = process.hrtime.bigint();
    const Bf = countCliques(adj, n, forb);
    log(`[B] number of K${forb} in colour ${c} = ${Bf.count}${Bf.first ? `; first [${Bf.first.join(',')}] ${verifyCliqueAgainstMatrix(lines, Bf.first, c) ? 'verified against the raw matrix' : 'FAILED raw-matrix verification'}` : ''}; search nodes ${Bf.nodes}; ${ms(t0)} ms`);
    t0 = process.hrtime.bigint();
    const Bm = countCliques(adj, n, forb - 1);
    log(`[B] number of K${forb - 1} in colour ${c} = ${Bm.count}; search nodes ${Bm.nodes}; ${ms(t0)} ms`);
    // A and B must agree: A.size >= forb  <=>  Bf.count > 0 ; A.size >= forb-1 <=> Bm.count > 0
    if ((A.size >= forb) !== (Bf.count > 0) || (A.size >= forb - 1) !== (Bm.count > 0)) {
      log(`INCONSISTENT: method A says max ${A.size}, method B counts K${forb}=${Bf.count}, K${forb - 1}=${Bm.count}`);
      inconsistent = true;
    }
    if (A.size >= forb || Bf.count > 0) { log(`FORBIDDEN: colour ${c} contains a K${forb}`); verdictFail = true; }
  }
  if (inconsistent) { log('RESULT: INCONSISTENT (the two methods disagree; no verdict)'); return 3; }
  if (verdictFail) { log(`RESULT: FAIL -- this file is NOT a (${X},${Y})-colouring of K${n}${expectedN !== undefined ? ` with n=${expectedN}` : ''}`); return 1; }
  log(`RESULT: PASS -- no K${X} in colour 0 and no K${Y} in colour 1 on n=${n}: R(${X},${Y}) > ${n}, i.e. R(${X},${Y}) >= ${n + 1}`);
  return 0;
}

// ---------- self-test against brute force and known graphs ----------
function matrixText(n, edgeFn) {
  const rows = [];
  for (let j = 0; j < n; j++) {
    let s = '';
    for (let i = 0; i < n; i++) s += (i !== j && edgeFn(Math.min(i, j), Math.max(i, j))) ? '1' : '0';
    rows.push(s);
  }
  return rows.join('\n') + '\n';
}
function bruteMaxClique(lines, n, c) {
  let best = 0; const counts = new Array(n + 1).fill(0);
  for (let mask = 0; mask < (1 << n); mask++) {
    const vs = []; for (let v = 0; v < n; v++) if (mask & (1 << v)) vs.push(v);
    let ok = true;
    for (let a = 0; a < vs.length && ok; a++) for (let b = a + 1; b < vs.length; b++) if (lines[vs[a]][vs[b]] !== c) { ok = false; break; }
    if (ok) { counts[vs.length]++; if (vs.length > best) best = vs.length; }
  }
  return { best, counts };
}
function selftest() {
  let fails = 0;
  // 1) random graphs vs brute force (both colours), deterministic LCG
  let seed = 12345; const rnd = () => ((seed = (Math.imul(seed, 1103515245) + 12345) >>> 0) / 4294967296);
  let trials = 0;
  for (let t = 0; t < 120; t++) {
    const n = 6 + (t % 10), p = 0.2 + 0.6 * rnd();
    const E = new Map();
    const text = matrixText(n, (i, j) => { const key = i * 64 + j; if (!E.has(key)) E.set(key, rnd() < p); return E.get(key); });
    const { lines } = parseMatrix(text);
    for (const c of ['0', '1']) {
      const adj = buildColourGraph(lines, n, c);
      const bf = bruteMaxClique(lines, n, c);
      const A = maxClique(adj, n);
      if (A.size !== bf.best || !verifyCliqueAgainstMatrix(lines, A.witness, c)) { fails++; console.log(`selftest FAIL: random t=${t} colour ${c}: A=${A.size} brute=${bf.best}`); }
      for (let k = 1; k <= Math.min(n, 8); k++) {
        const B = countCliques(adj, n, k);
        if (B.count !== bf.counts[k]) { fails++; console.log(`selftest FAIL: random t=${t} colour ${c} k=${k}: B=${B.count} brute=${bf.counts[k]}`); }
      }
      trials++;
    }
  }
  console.log(`selftest: ${trials} random colour classes (n=6..15) compared with brute force over all subsets`);
  // 2) known graphs through the full text pipeline; edges = colour 1
  const QR17 = new Set([1, 2, 4, 8, 9, 13, 15, 16]);
  const known = [
    { name: 'Paley(17) as (4,4)-colouring', text: matrixText(17, (i, j) => QR17.has((j - i) % 17)), X: 4, Y: 4, expect: 0 },
    { name: 'Paley(17) as (3,4)-colouring', text: matrixText(17, (i, j) => QR17.has((j - i) % 17)), X: 3, Y: 4, expect: 1 },
    { name: 'C5 as (3,3)-colouring', text: matrixText(5, (i, j) => (j - i) === 1 || (j - i) === 4), X: 3, Y: 3, expect: 0 },
    { name: 'K6 any 2-colouring (R(3,3)=6): all colour 1', text: matrixText(6, () => true), X: 3, Y: 3, expect: 1 },
    { name: 'complete K7 (colour 1) as (2,7)-colouring', text: matrixText(7, () => true), X: 2, Y: 7, expect: 1 },
    { name: 'complete K7 (colour 1) as (2,8)-colouring', text: matrixText(7, () => true), X: 2, Y: 8, expect: 0 },
  ];
  for (const g of known) {
    const out = [];
    const code = checkText(g.text, g.X, g.Y, undefined, (s) => out.push(s));
    const ok = code === g.expect;
    if (!ok) fails++;
    console.log(`selftest ${ok ? 'ok  ' : 'FAIL'}: ${g.name}: exit ${code} (expected ${g.expect}); ${out[out.length - 1]}`);
  }
  // 3) Inputs that must NOT reach a verdict. Each of these returned PASS before 2026-09-18.
  const invalid = [
    { name: 'an empty file', text: '', X: 7, Y: 8, N: undefined },
    { name: 'a file of one blank line', text: '\n', X: 7, Y: 8, N: undefined },
    { name: 'non-integer clique sizes', text: matrixText(3, (i, j) => j - i === 1), X: 3.5, Y: 3.5, N: 3 },
    { name: 'a clique size below 2', text: matrixText(3, (i, j) => j - i === 1), X: 1, Y: 3, N: 3 },
    { name: 'a non-integer expectedN', text: matrixText(3, (i, j) => j - i === 1), X: 3, Y: 3, N: 2.5 },
  ];
  for (const g of invalid) {
    const out = [];
    const code = checkText(g.text, g.X, g.Y, g.N, (s) => out.push(s));
    const ok = code === 2;
    if (!ok) fails++;
    console.log(`selftest ${ok ? 'ok  ' : 'FAIL'}: ${g.name} is refused: exit ${code} (expected 2); ${out[out.length - 1]}`);
  }
  console.log(fails ? `SELFTEST: ${fails} FAILURE(S)` : 'SELFTEST: all passed');
  return fails ? 1 : 0;
}

// ---------- CLI ----------
function main(argv) {
  if (argv[0] === '--selftest') return selftest();
  if (argv.length < 3) { console.log('usage: node scripts/check-ramsey-coloring.mjs <file> <X> <Y> [expectedN] | --selftest'); return 2; }
  const [file, Xs, Ys, Ns] = argv;
  const buf = readFileSync(file);
  const text = buf.toString('latin1');
  const blob = createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex');
  console.log(`file: ${file}`);
  console.log(`bytes: ${buf.length}; sha256: ${createHash('sha256').update(buf).digest('hex')}; git blob sha1: ${blob}`);
  console.log(`checking: no K${Xs} in colour 0, no K${Ys} in colour 1${Ns ? `, n = ${Ns}` : ''}`);
  const t0 = process.hrtime.bigint();
  const code = checkText(text, Number(Xs), Number(Ys), Ns === undefined ? undefined : Number(Ns));
  console.log(`total time ${ms(t0)} ms; exit ${code}`);
  return code;
}

if (isEntryModule(import.meta.url)) process.exitCode = main(process.argv.slice(2));
