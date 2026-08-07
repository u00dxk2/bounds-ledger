#!/usr/bin/env node
// G-2 target 27b, PROPOSAL ROUND runner (Earth-Moon problem: max chromatic
// number of a biplanar graph; record lower bound 9, Sulanke 1980).
//
// The model proposes construction families; this runs each one through ordered
// gates and records WHICH gate killed it. Dead candidates are the campaign's
// data — a family that dies at a named gate for a stated reason narrows the
// search space, which is the only durable output a round like this can have.
//
// Gates, cheapest first (so an expensive exact computation never runs on a
// candidate a counting argument already excludes):
//
//   1. edge-bound   m <= 6n-12          EXECUTED. Two planar layers hold at
//                                       most 3n-6 edges each.
//   2. k9-free      omega(G) <= 8       CITED, not executed — see PROVENANCE.
//   3. chromatic    chi(G) >= target    EXECUTED, exact (branch and bound).
//   4. split        biplanar partition  EXECUTED when it succeeds; a failure
//                                       is INCONCLUSIVE, never a disproof.
//
// PROVENANCE — the k9-free gate is the one thing here we did not execute.
// theta(K9) = 3 (Battle-Harary-Kodama 1962; K9 and K10 are the exceptions to
// theta(Kn) = floor((n+7)/6)). We cannot brute-force it: K9 has 36 edges, so an
// exhaustive split scan is 2^36 and greedy restarts failing proves nothing.
// The gate is labelled CITED in every output line so it is never mistaken for
// an executed result. Note the failure DIRECTION is safe: a wrong citation can
// only make us skip a family we should have searched, never make us ship a
// false certificate — anything we would actually claim is gated by the
// executed verifier alone.
//
// ponytail: no annealing, no solver, no dependencies. The gates are counting,
// an exact clique, an exact colouring, and a random-restart greedy — all small
// enough for the maintainer to read and rerun.
//
// Usage:
//   node search/27b/propose-round.mjs [--target 10] [--tries 4000] [--json <path>]
//   node search/27b/propose-round.mjs --selftest

import { writeFileSync } from "node:fs";
import { isPlanar, chromaticNumber, verifyCertificate, normalizeEdges, completeGraph, sulankeGraph } from "./verifier.mjs";

// ---------- construction kit ----------

const cycle = (k) => ({ n: k, edges: Array.from({ length: k }, (_, i) => [i, (i + 1) % k]) });

// disjoint union then every cross edge — chi(A join B) = chi(A) + chi(B)
function join(...parts) {
  let n = 0;
  const edges = [];
  const blocks = [];
  for (const p of parts) {
    const off = n;
    for (const [u, v] of p.edges) edges.push([u + off, v + off]);
    blocks.push([off, off + p.n]);
    n += p.n;
  }
  for (let a = 0; a < blocks.length; a++)
    for (let b = a + 1; b < blocks.length; b++)
      for (let u = blocks[a][0]; u < blocks[a][1]; u++)
        for (let v = blocks[b][0]; v < blocks[b][1]; v++) edges.push([u, v]);
  return { n, edges };
}

// Mycielskian: chi goes up by exactly one, clique number does not move.
function mycielski(g) {
  const n = g.n;
  const edges = g.edges.map(([u, v]) => [u, v]);
  for (const [u, v] of g.edges) { edges.push([u + n, v]); edges.push([v + n, u]); }
  const w = 2 * n;
  for (let i = 0; i < n; i++) edges.push([w, n + i]);
  return { n: 2 * n + 1, edges };
}

const wheel = (k) => join(cycle(k), completeGraph(1));

// circulant C_n(S): i ~ j iff (i-j) mod n is in S or n-S
function circulant(n, S) {
  const edges = [];
  for (let i = 0; i < n; i++) for (const s of S) { const j = (i + s) % n; if (i < j) edges.push([i, j]); else edges.push([j, i]); }
  return { n, edges: normalizeEdges(edges) };
}

// Remove a NAMED edge. Deliberately not "drop the last k edges": in a join the
// trailing edges are all cross edges, so a positional drop silently builds the
// wrong graph while the candidate label still claims otherwise (caught in
// round one — two differently-labelled candidates came out byte-identical).
function removeEdge(g, u, v) {
  const before = g.edges.length;
  const edges = g.edges.filter(([a, b]) => !((a === u && b === v) || (a === v && b === u)));
  if (edges.length !== before - 1) throw new Error(`removeEdge: ${u}-${v} is not an edge of this graph`);
  return { n: g.n, edges };
}

// ---------- exact max clique (Bron-Kerbosch with pivot) ----------

function maxClique(n, edges) {
  const nb = Array.from({ length: n }, () => new Set());
  for (const [u, v] of edges) { nb[u].add(v); nb[v].add(u); }
  let best = 0;
  const bk = (R, P, X) => {
    if (!P.size && !X.size) { best = Math.max(best, R.length); return; }
    if (R.length + P.size <= best) return;
    let pivot = -1, pd = -1;
    for (const u of [...P, ...X]) { const d = [...P].filter((w) => nb[u].has(w)).length; if (d > pd) { pd = d; pivot = u; } }
    for (const v of [...P]) {
      if (pivot !== -1 && nb[pivot].has(v)) continue;
      bk([...R, v], new Set([...P].filter((w) => nb[v].has(w))), new Set([...X].filter((w) => nb[v].has(w))));
      P.delete(v); X.add(v);
    }
  };
  bk([], new Set([...Array(n).keys()]), new Set());
  return best;
}

// ---------- biplanar split search (same greedy that reproduced Sulanke) ----------

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function findBiplanarSplit(n, edges, maxTries = 4000, seedBase = 1000) {
  const cap = 3 * n - 6;
  for (let t = 0; t < maxTries; t++) {
    const rand = rng(seedBase + t);
    const order = edges.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const layer1 = [];
    let e1 = [];
    for (const i of order) {
      const trial = [...e1, edges[i]];
      if (trial.length <= cap && isPlanar(n, trial)) { e1 = trial; layer1.push(i); }
    }
    const inL1 = new Set(layer1);
    const layer2 = order.filter((i) => !inL1.has(i));
    if (layer2.length <= cap && isPlanar(n, layer2.map((i) => edges[i]))) {
      return { seed: seedBase + t, tries: t + 1, layer1: layer1.sort((a, b) => a - b), layer2: layer2.sort((a, b) => a - b) };
    }
  }
  return null;
}

// ---------- the gate pipeline ----------

export function runGates(g, target, tries) {
  const edges = normalizeEdges(g.edges);
  const n = g.n, m = edges.length;
  const bound = 6 * n - 12;
  const out = { n, m, bound };

  if (m > bound) return { ...out, verdict: "DEAD", gate: "edge-bound", cited: false, why: `m=${m} > 6n-12=${bound}: two planar layers cannot hold this many edges (over by ${m - bound})` };

  const omega = maxClique(n, edges);
  out.omega = omega;
  if (omega >= 9) return { ...out, verdict: "DEAD", gate: "k9-free", cited: true, why: `contains K${omega}; theta(K9)=3 so no biplanar graph contains K9 (CITED, not executed)` };

  const chi = chromaticNumber(n, edges);
  out.chi = chi;
  if (chi < target) return { ...out, verdict: "DEAD", gate: "chromatic", cited: false, why: `chi=${chi} < target ${target}${chi === target - 1 ? " (one colour short)" : ""}` };

  const split = findBiplanarSplit(n, edges, tries);
  if (!split) return { ...out, verdict: "INCONCLUSIVE", gate: "split", cited: false, why: `no biplanar split found in ${tries} greedy restarts — NOT a disproof of biplanarity` };

  const cert = { target: "27b", n, edges, layer1: split.layer1, layer2: split.layer2, claimedChromaticAtLeast: target, prngSeed: split.seed };
  const check = verifyCertificate(cert);
  if (!check.ok) return { ...out, verdict: "DEAD", gate: "split", cited: false, why: `split found but certificate REJECTED: ${check.reasons.join("; ")}` };
  return { ...out, verdict: "CERTIFIED", gate: null, cited: false, why: `biplanar split verified, chi=${check.chromaticNumber} >= ${target}`, cert };
}

// ---------- round-one candidate families ----------

export const CANDIDATES = [
  // A. Sulanke's own family, pushed to 10. chi(A join B) = chi(A)+chi(B).
  { name: "C5 + K7", family: "join", why10: "3+7; the direct successor to the 1980 record", build: () => join(cycle(5), completeGraph(7)) },
  { name: "W5 + K6", family: "join", why10: "4+6; swap Sulanke's C5 for the 4-chromatic wheel", build: () => join(wheel(5), completeGraph(6)) },
  { name: "K4 + K6 (=K10)", family: "join", why10: "4+6; the cheapest 10-chromatic join by vertex count", build: () => join(completeGraph(4), completeGraph(6)) },
  { name: "C5 + C5 + K4", family: "join", why10: "3+3+4; spread the colour across three cheap parts", build: () => join(cycle(5), cycle(5), completeGraph(4)) },
  { name: "Grotzsch + K6", family: "join", why10: "4+6; triangle-free part to keep the clique number down", build: () => join(mycielski(cycle(5)), completeGraph(6)) },

  // B. Pay the edge budget and see what it costs. C5+K7 is over by exactly one.
  // C5 occupies vertices 0-4, K7 occupies 5-11, so 5-6 is a clique edge and 0-5 is a cross edge.
  { name: "C5 + K7, minus one K7 edge", family: "budget-fitted", why10: "buy the one edge back from inside the clique", build: () => removeEdge(join(cycle(5), completeGraph(7)), 5, 6) },
  { name: "C5 + K7, minus one cross edge", family: "budget-fitted", why10: "buy the one edge back from the join instead", build: () => removeEdge(join(cycle(5), completeGraph(7)), 0, 5) },

  // C. Sparse and high-chromatic: dodge the clique cap instead of paying it.
  { name: "Mycielski(Sulanke)", family: "sparse", why10: "chi 9 -> 10 with the clique number unmoved", build: () => mycielski(sulankeGraph()) },
  { name: "C12(1..5)", family: "sparse", why10: "circulant sitting exactly on the 6n-12 budget", build: () => circulant(12, [1, 2, 3, 4, 5]) },
  { name: "C13(1..5)", family: "sparse", why10: "circulant just inside the budget", build: () => circulant(13, [1, 2, 3, 4, 5]) },
  { name: "C17(1..5)", family: "sparse", why10: "largest circulant of this shape still inside the budget", build: () => circulant(17, [1, 2, 3, 4, 5]) },
];

// ---------- selftest: every gate must fire AND stay silent (KP-78) ----------

function selftest() {
  const fail = (msg) => { console.error(`27b propose-round selftest: FAIL — ${msg}`); process.exit(1); };
  const sul = sulankeGraph();

  // edge-bound gate: fires on C5+K7 (61 > 60), silent on Sulanke (50 <= 54)
  const a = runGates(join(cycle(5), completeGraph(7)), 10, 50);
  if (a.gate !== "edge-bound") fail(`edge-bound gate did not fire on C5+K7 (got ${a.gate})`);
  const b = runGates(sul, 9, 4000);
  if (b.gate === "edge-bound") fail("edge-bound gate fired on Sulanke, which is inside the budget");

  // k9-free gate: fires on K10, silent on Sulanke (omega 8)
  const c = runGates(completeGraph(10), 10, 50);
  if (c.gate !== "k9-free") fail(`k9-free gate did not fire on K10 (got ${c.gate})`);
  if (!c.cited) fail("k9-free gate must be labelled CITED");
  if (b.omega !== 8) fail(`Sulanke clique number should be 8, got ${b.omega}`);

  // chromatic gate: fires on Sulanke at target 10, silent at target 9
  const d = runGates(sul, 10, 50);
  if (d.gate !== "chromatic" || d.chi !== 9) fail(`chromatic gate should fire on Sulanke at target 10 with chi=9 (got ${d.gate}/${d.chi})`);

  // split gate, BOTH outcomes: certified on Sulanke at target 9; not-found on K9
  if (b.verdict !== "CERTIFIED") fail(`Sulanke at target 9 should certify (got ${b.verdict}: ${b.why})`);
  if (!verifyCertificate(b.cert).ok) fail("Sulanke certificate did not verify");
  const e = runGates(completeGraph(9), 9, 40);
  if (e.gate !== "k9-free") fail(`K9 should die at the k9-free gate (got ${e.gate})`);
  // and with the citation set aside, the search half returns its OTHER answer:
  const k9 = completeGraph(9);
  if (findBiplanarSplit(k9.n, normalizeEdges(k9.edges), 40) !== null) fail("split search claims a biplanar split of K9");

  console.log("27b propose-round selftest: PASS (4 gates, each fires and stays silent; split search returns both outcomes; Sulanke re-certifies at target 9)");
}

// ---------- main ----------

const args = process.argv.slice(2);
const argv = (k, d) => { const i = args.indexOf(`--${k}`); return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d; };

if (args.includes("--selftest")) { selftest(); process.exit(0); }

const target = Number(argv("target", 10));
const tries = Number(argv("tries", 4000));
const jsonPath = argv("json", null);

console.log(`# 27b proposal round — target chi >= ${target}, ${CANDIDATES.length} candidates, ${tries} restarts per split search`);
console.log(`# record to beat: 9 (Sulanke 1980). Gates: edge-bound, k9-free (CITED), chromatic, split.\n`);

const results = [];
for (const cand of CANDIDATES) {
  const r = runGates(cand.build(), target, tries);
  results.push({ name: cand.name, family: cand.family, why10: cand.why10, ...r });
  const tag = r.verdict === "CERTIFIED" ? "CERTIFIED" : `${r.verdict} at ${r.gate}${r.cited ? " (CITED)" : ""}`;
  console.log(`${cand.name}`);
  console.log(`  n=${r.n} m=${r.m} (budget ${r.bound})${r.omega !== undefined ? ` omega=${r.omega}` : ""}${r.chi !== undefined ? ` chi=${r.chi}` : ""}`);
  console.log(`  ${tag}: ${r.why}\n`);
}

const certified = results.filter((r) => r.verdict === "CERTIFIED");
const byGate = {};
for (const r of results) if (r.gate) byGate[r.gate] = (byGate[r.gate] ?? 0) + 1;
console.log(`# ${results.length} candidates: ${certified.length} certified, ${results.length - certified.length} eliminated`);
console.log(`# eliminated by gate: ${Object.entries(byGate).map(([g, c]) => `${g}=${c}`).join(", ")}`);

if (certified.length) {
  console.log(`\n# A CANDIDATE CERTIFIED AT TARGET ${target}. This is NOT yet a result:`);
  console.log(`# exact re-verify + literature/priority check + adversarial review + David's gate all owed (G-2).`);
}

if (jsonPath) {
  writeFileSync(jsonPath, JSON.stringify({ target, tries, generated: "search/27b/propose-round.mjs", results }, null, 2) + "\n");
  console.log(`\nwrote ${jsonPath}`);
}
