#!/usr/bin/env node
// G-2 target 27b, ROUND THREE: stop searching the generic space.
//
// Round one proposed structured high-chromatic graphs and every one died by a
// razor-thin margin (one edge, one colour). Round two built biplanar graphs by
// construction and topped out at chi=8 — one BELOW the record — even after
// reaching Sulanke's exact density at his exact vertex count. Both rounds agree
// from opposite directions: the record is a DESIGNED object, and the generic
// part of the biplanar space does not contain it
// (docs/findings/2026-08-07-g2-27b-round-two-density-is-not-the-thing.md).
//
// So round three seeds the search with the design. Two parts:
//
//   PART A — the family ceiling, by exact arithmetic. Sulanke's graph is
//   K6 join C5. The family K_r join C_s (s odd) has chi = r+3, so chi >= 10
//   needs r >= 7. Every biplanar graph obeys m <= 6n-12 (two planar layers,
//   3n-6 each). Scan the family against that bound and see whether ANY member
//   with chi >= 10 fits. This is decisive where a search is not: an over-budget
//   member is not biplanar, full stop, no search required.
//
//   PART B — seeded growth, which is what round two's finding asked for. Hold a
//   verified certificate's layers FIXED, add the new vertices, and double-greedy
//   only the remaining edges of K_n. Round two grew from a shuffled K_n and
//   never found the structure by chance; this hands it the structure and asks
//   whether generic growth can carry it further.
//
// ponytail: no annealing, no leftover repair, no clever seed family beyond the
// one that produced the record. Part A is arithmetic and Part B reuses the
// round-two greedy verbatim in spirit. If Part A closes the family, a cleverer
// search of that family is wasted work — which is the point of running it first.
//
// Usage:
//   node search/27b/round3-seeded.mjs [--max-n 14] [--seeds 60] [--json <path>]
//   node search/27b/round3-seeded.mjs --selftest

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { isPlanar, chromaticNumber, verifyCertificate, normalizeEdges, completeGraph, ekey } from "./verifier.mjs";

const RECORD = 9;   // Sulanke 1980, the lower bound we would have to beat
const TARGET = 10;

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

// ---------- Part A: the K_r join C_s family ----------

// Vertices 0..r-1 are the clique, r..r+s-1 the cycle. Every clique vertex is
// joined to every cycle vertex. r=6, s=5 is Sulanke's graph.
export function joinCliqueCycle(r, s) {
  const n = r + s;
  const edges = completeGraph(r).edges;
  for (let i = 0; i < s; i++) edges.push([r + i, r + ((i + 1) % s)]);
  for (let i = 0; i < r; i++) for (let j = r; j < n; j++) edges.push([i, j]);
  return { n, edges: normalizeEdges(edges) };
}

// The only hard fact available without a search: a graph of thickness <= 2 has
// at most 2*(3n-6) edges. Over that, it is not biplanar and no search can help.
export const biplanarEdgeBudget = (n) => (n >= 3 ? 6 * n - 12 : (n * (n - 1)) / 2);
export const overBudget = (n, m) => m > biplanarEdgeBudget(n);

// ---------- Part B: growth from a fixed seed ----------

// seed: { n, edges, layer1, layer2 } — a verified certificate. Its vertex labels
// are kept, the graph is extended to n >= seed.n, and only the edges the seed
// does not already own are greedily placed.
export function growFromSeed(n, prngSeed, seed) {
  if (n < seed.n) throw new Error(`n=${n} is smaller than the seed's ${seed.n}`);
  const seedEdges = normalizeEdges(seed.edges);
  const held = new Set(seedEdges.map(([u, v]) => ekey(u, v)));

  // Layers start as the seed's own layers, in the seed's own order.
  const e1 = seed.layer1.map((i) => seedEdges[i]);
  const e2 = seed.layer2.map((i) => seedEdges[i]);
  if (!isPlanar(n, e1) || !isPlanar(n, e2)) throw new Error("seed layers are not planar");

  const rest = normalizeEdges(completeGraph(n).edges).filter(([u, v]) => !held.has(ekey(u, v)));
  const rand = rng(prngSeed);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }

  let leftover = 0;
  for (const e of rest) {
    if (e1.length < 3 * n - 6 && isPlanar(n, [...e1, e])) { e1.push(e); continue; }
    if (e2.length < 3 * n - 6 && isPlanar(n, [...e2, e])) { e2.push(e); continue; }
    leftover++;
  }

  const edges = [...e1, ...e2];
  return {
    n,
    edges,
    layer1: e1.map((_, k) => k),
    layer2: e2.map((_, k) => e1.length + k),
    leftover,
    seedHeld: seedEdges.length,
    prngSeed,
  };
}

function loadSulanke() {
  return JSON.parse(readFileSync(new URL("./sulanke-certificate.json", import.meta.url), "utf8"));
}

// ---------- selftest: every gate must fire AND stay silent ----------

function selftest() {
  const fail = (msg) => { console.error(`27b round3-seeded selftest: FAIL — ${msg}`); process.exit(1); };

  // Part A, silent: Sulanke's own family member fits the budget (it must — the
  // graph exists and is biplanar). A budget test that flagged it would be junk.
  const sul = joinCliqueCycle(6, 5);
  if (sul.n !== 11 || sul.edges.length !== 50) fail(`K6 join C5 built as n=${sul.n}, m=${sul.edges.length}; expected 11/50`);
  if (overBudget(sul.n, sul.edges.length)) fail("budget test flagged Sulanke's own graph, which is biplanar");

  // Part A, fires: K7 join C5 is over the budget and must be flagged.
  const k7c5 = joinCliqueCycle(7, 5);
  if (!overBudget(k7c5.n, k7c5.edges.length)) fail(`K7 join C5 (n=${k7c5.n}, m=${k7c5.edges.length}) not flagged over budget ${biplanarEdgeBudget(k7c5.n)}`);

  // The chi = r+3 shape is COMPUTED, never asserted from the join formula.
  const chiSul = chromaticNumber(sul.n, sul.edges);
  if (chiSul !== RECORD) fail(`K6 join C5 computed chi=${chiSul}, expected the record ${RECORD}`);
  const small = joinCliqueCycle(4, 5);
  const chiSmall = chromaticNumber(small.n, small.edges);
  if (chiSmall !== 7) fail(`K4 join C5 computed chi=${chiSmall}, expected 7`);

  // Part B, silent: growth from the real certificate verifies end to end and
  // keeps the seed's chromatic number.
  const seed = loadSulanke();
  const g = growFromSeed(12, 11, seed);
  const cert = { n: g.n, edges: g.edges, layer1: g.layer1, layer2: g.layer2, claimedChromaticAtLeast: RECORD };
  const ok = verifyCertificate(cert);
  if (!ok.ok) fail(`seeded growth produced a graph the verifier rejects: ${ok.reasons.join("; ")}`);

  // The seed must actually be HELD — every seed edge present in the union.
  const have = new Set(g.edges.map(([u, v]) => ekey(u, v)));
  for (const [u, v] of seed.edges) if (!have.has(ekey(u, v))) fail(`seed edge ${u},${v} was dropped; the seed is not held`);

  // Part B, fires: a corrupted seed must be REJECTED, not quietly grown around.
  // Move one layer2 edge into layer1 and the layer stops being planar.
  let corruptedRejected = false;
  const bad = { ...seed, layer1: [...seed.layer1, seed.layer2[0]], layer2: seed.layer2.slice(1) };
  try { growFromSeed(12, 11, bad); } catch { corruptedRejected = true; }
  if (!corruptedRejected) {
    // The moved edge may leave layer1 planar by luck; then the check is that the
    // resulting certificate is not silently blessed as a partition of the union.
    fail("a corrupted seed partition was accepted by growFromSeed");
  }

  // Deterministic in its prng seed, or a reported result is not reproducible.
  const again = growFromSeed(12, 11, seed);
  if (JSON.stringify(again.edges) !== JSON.stringify(g.edges)) fail("same prng seed produced a different graph");

  console.log(`27b round3-seeded selftest: PASS (budget test fires on K7+C5 and stays silent on Sulanke; chi computed not assumed (6+5=${chiSul}, 4+5=${chiSmall}); seeded growth verifies and holds all ${g.seedHeld} seed edges; corrupted seed rejected; prng reproducible)`);
}

// ---------- main ----------

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (!isMain) { /* imported for its exports; do nothing */ } else {

const args = process.argv.slice(2);
const argv = (k, d) => { const i = args.indexOf(`--${k}`); return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d; };

if (args.includes("--selftest")) { selftest(); process.exit(0); }

const maxN = Number(argv("max-n", 14));
const seeds = Number(argv("seeds", 60));
const jsonPath = argv("json", null);

console.log(`# 27b round three — seed the search with the design`);
console.log(`# record to beat: ${RECORD} (Sulanke 1980, K6 join C5). Target: ${TARGET}.\n`);

// --- Part A ---
console.log(`## Part A — can the record's own family reach chi ${TARGET}?`);
console.log(`## K_r join C_s (s odd). Biplanar requires m <= 6n-12; over that is decisive.\n`);
console.log(`  r   s |  n    m  budget | chi | verdict`);
console.log(`  ------+-----------------+-----+---------`);

const family = [];
for (let r = 4; r <= 9; r++) {
  for (let s = 3; s <= 11; s += 2) {
    const g = joinCliqueCycle(r, s);
    const m = g.edges.length;
    const budget = biplanarEdgeBudget(g.n);
    const over = overBudget(g.n, m);
    // Compute chi exactly where it is cheap; the family formula is r+3 but this
    // ledger does not assert numbers it has not run.
    const chi = g.n <= 13 ? chromaticNumber(g.n, g.edges) : null;
    const chiShown = chi === null ? `${r + 3}?` : `${chi}`;
    const verdict = over
      ? `NOT biplanar (m exceeds budget by ${m - budget})`
      : (chi ?? r + 3) >= TARGET ? `fits budget — worth a search` : `fits budget, chi < ${TARGET}`;
    family.push({ r, s, n: g.n, m, budget, over, chi, chiComputed: chi !== null });
    console.log(`  ${String(r).padStart(2)}  ${String(s).padStart(2)} | ${String(g.n).padStart(2)} ${String(m).padStart(4)} ${String(budget).padStart(6)}   | ${chiShown.padStart(3)} | ${verdict}`);
  }
}

const reachers = family.filter((f) => (f.chi ?? f.r + 3) >= TARGET);
const survivors = reachers.filter((f) => !f.over);
console.log(`\n# ${reachers.length} family member(s) reach chi >= ${TARGET}; ${survivors.length} of them fit the biplanar edge budget.`);
if (!survivors.length) {
  console.log(`# THE FAMILY IS CLOSED: every K_r join C_s with chi >= ${TARGET} is over 6n-12 and therefore not biplanar.`);
  console.log(`# Sulanke's shape cannot be pushed one colour further. This is arithmetic, not a failed search.`);
}

// --- Part B ---
const seedCert = loadSulanke();
const seedCheck = verifyCertificate({ ...seedCert, claimedChromaticAtLeast: RECORD });
if (!seedCheck.ok) { console.error(`seed certificate does not verify: ${seedCheck.reasons.join("; ")}`); process.exit(1); }

console.log(`\n## Part B — hold the record fixed and grow around it`);
console.log(`## seed: Sulanke K6 join C5, n=11, m=${seedCert.edges.length}, chi=${seedCheck.chromaticNumber} (re-verified just now)`);
console.log(`## only the edges the seed does not own are double-greedied.\n`);

const rows = [];
let champion = null;
for (let n = seedCert.n; n <= maxN; n++) {
  let best = null;
  const hist = {};
  const trials = n === seedCert.n ? 1 : seeds;   // nothing random to do at the seed's own n
  for (let s = 0; s < trials; s++) {
    const g = growFromSeed(n, 9000 + s, seedCert);
    const chi = chromaticNumber(g.n, g.edges);
    hist[chi] = (hist[chi] ?? 0) + 1;
    if (!best || chi > best.chi || (chi === best.chi && g.edges.length > best.g.edges.length)) best = { chi, g };
    if (chi >= TARGET) break;
  }
  const cert = { target: "27b", n, edges: best.g.edges, layer1: best.g.layer1, layer2: best.g.layer2, claimedChromaticAtLeast: best.chi, prngSeed: best.g.prngSeed };
  const check = verifyCertificate(cert);
  const spread = Object.keys(hist).map(Number).sort((a, b) => a - b).map((k) => `${k}:${hist[k]}`).join(" ");
  rows.push({ n, bestChi: best.chi, m: best.g.edges.length, budget: biplanarEdgeBudget(n), leftover: best.g.leftover, prngSeed: best.g.prngSeed, verified: check.ok, spread: hist });
  console.log(`n=${n}  best chi=${best.chi}  m=${best.g.edges.length}/${biplanarEdgeBudget(n)}  leftover=${best.g.leftover}  seed=${best.g.prngSeed}  verifier=${check.ok ? "OK" : "REJECTED: " + check.reasons.join("; ")}`);
  console.log(`      chi spread over ${trials} trial(s): ${spread}`);
  if (best.chi >= TARGET && check.ok) champion = cert;
}

console.log(`\n# best chi found: ${Math.max(...rows.map((r) => r.bestChi))} (record to beat: ${RECORD})`);
if (champion) {
  console.log(`\n# A GRAPH REACHED chi >= ${TARGET} AND VERIFIED. This is NOT yet a result:`);
  console.log(`# exact re-verify + literature/priority check + adversarial review + David's gate all owed (G-2).`);
  writeFileSync(new URL("./round3-champion.json", import.meta.url), JSON.stringify(champion, null, 2) + "\n");
} else {
  console.log(`# no graph reached chi >= ${TARGET}; the record stands and nothing here is reportable.`);
}

if (jsonPath) {
  writeFileSync(jsonPath, JSON.stringify({ maxN, seeds, generated: "search/27b/round3-seeded.mjs", family, rows }, null, 2) + "\n");
  console.log(`\nwrote ${jsonPath}`);
}

}
