#!/usr/bin/env node
// G-2 target 27b, ROUND TWO: the inverted search.
//
// Round one proposed high-chromatic graphs and asked whether they were
// biplanar. Every one of eleven died saying either "too dense to be biplanar"
// or "not chromatic enough" — nothing died subtly
// (docs/findings/2026-08-07-g2-27b-round-one-the-one-edge-vise.md). So invert
// it: build graphs that are biplanar BY CONSTRUCTION and measure how much
// chromatic number they carry. That searches the space where the hard
// constraint is free instead of the space where it is binding, and it puts the
// whole question onto the one gate we compute exactly and cheaply.
//
// Method: shuffle the edges of K_n; grow layer1 by adding an edge iff the layer
// stays planar under the exact DMP test, giving a MAXIMAL planar subgraph; grow
// layer2 the same way from what is left. The union of the two layers is a
// thickness-<=2 graph by construction. Then compute its exact chromatic number.
// Edges K_n had that neither layer could take are simply absent from the union
// (reported as "leftover") — they are the price of biplanarity, and watching
// that price is half the point of the experiment.
//
// Every reported graph is re-checked end-to-end by verifyCertificate, so the
// construction argument is never the only thing standing behind a result.
//
// ponytail: no annealing and no leftover-repair pass. Double-greedy is the
// simplest thing that samples the space at all, and its numbers tell us whether
// a cleverer search is even worth writing. Upgrade path if the ceiling here
// looks soft: reinsert leftover edges by swapping against layer edges that
// block them, then hill-climb on chi.
//
// Usage:
//   node search/27b/round2-grow.mjs [--min 9] [--max 13] [--seeds 300] [--json <path>]
//   node search/27b/round2-grow.mjs --selftest

import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { isPlanar, chromaticNumber, verifyCertificate, normalizeEdges, completeGraph } from "./verifier.mjs";

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

// Grow two maximal planar layers from the edge set of K_n. Returns the union as
// a graph plus the layer index sets, in the shape verifyCertificate expects.
export function growBiplanar(n, seed) {
  const all = normalizeEdges(completeGraph(n).edges);
  const rand = rng(seed);
  const order = all.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const cap = 3 * n - 6;

  const grow = (pool) => {
    const taken = [];
    let acc = [];
    for (const i of pool) {
      if (acc.length >= cap) break;
      const trial = [...acc, all[i]];
      if (isPlanar(n, trial)) { acc = trial; taken.push(i); }
    }
    return taken;
  };

  const l1 = grow(order);
  const inL1 = new Set(l1);
  const l2 = grow(order.filter((i) => !inL1.has(i)));

  // Re-index into the UNION's own edge list — a certificate describes the graph
  // it is about, not the K_n we carved it out of.
  const unionIdx = [...l1, ...l2];
  const edges = unionIdx.map((i) => all[i]);
  return {
    n,
    edges,
    layer1: l1.map((_, k) => k),
    layer2: l2.map((_, k) => l1.length + k),
    leftover: all.length - unionIdx.length,
    seed,
  };
}

// ---------- selftest: the construction must be checkable, and checkably wrong ----------

function selftest() {
  const fail = (msg) => { console.error(`27b round2-grow selftest: FAIL — ${msg}`); process.exit(1); };

  // Silent: what the grower builds really is biplanar, per the independent verifier.
  const g = growBiplanar(10, 7);
  const cert = { n: g.n, edges: g.edges, layer1: g.layer1, layer2: g.layer2, claimedChromaticAtLeast: 2 };
  const ok = verifyCertificate(cert);
  if (!ok.ok) fail(`grower produced a graph the verifier rejects: ${ok.reasons.join("; ")}`);
  if (g.layer1.length + g.layer2.length !== g.edges.length) fail("layers do not cover the union exactly");
  if (g.layer1.length > 3 * g.n - 6 || g.layer2.length > 3 * g.n - 6) fail("a layer exceeds the planar edge cap");

  // Fires: corrupt the partition and the same verifier must reject it. Without
  // this the check above would pass just as happily on a verifier that always
  // said yes.
  const moved = { ...cert, layer1: [...g.layer1, g.layer2[0]], layer2: g.layer2.slice(1) };
  if (verifyCertificate(moved).ok) fail("verifier accepted a layer1 that was handed an extra edge");

  // Fires: a layer that is not planar must be rejected. K5 in one layer.
  const k5 = completeGraph(5);
  const bad = { n: 5, edges: normalizeEdges(k5.edges), layer1: k5.edges.map((_, i) => i), layer2: [], claimedChromaticAtLeast: 2 };
  if (verifyCertificate(bad).ok) fail("verifier accepted K5 as a single planar layer");

  // The grower must be deterministic in its seed, or a reported result is not reproducible.
  const again = growBiplanar(10, 7);
  if (JSON.stringify(again.edges) !== JSON.stringify(g.edges)) fail("same seed produced a different graph");

  // And it must actually reach the density the experiment depends on.
  if (g.edges.length < 3 * g.n - 6) fail(`grower only reached ${g.edges.length} edges on n=10; layer1 alone should hit ${3 * g.n - 6}`);

  console.log(`27b round2-grow selftest: PASS (grower output verifies; corrupted partition and nonplanar layer both rejected; seed reproducible; n=10 reached ${g.edges.length} edges, chi=${chromaticNumber(g.n, g.edges)})`);
}

// ---------- main ----------

// Run the search ONLY when invoked directly. This file also exports
// growBiplanar, and without this guard `import`ing it to reuse one function
// silently launches a full multi-minute search — observed 2026-08-07 while
// cross-checking a result, which is exactly when a stray side effect is most
// likely to be mistaken for the answer.
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (!isMain) { /* imported for its exports; do nothing */ } else {

const args = process.argv.slice(2);
const argv = (k, d) => { const i = args.indexOf(`--${k}`); return i !== -1 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d; };

if (args.includes("--selftest")) { selftest(); process.exit(0); }

const minN = Number(argv("min", 9));
const maxN = Number(argv("max", 13));
const seeds = Number(argv("seeds", 300));
const jsonPath = argv("json", null);
const TARGET = 10;

console.log(`# 27b round two — inverted search: biplanar BY CONSTRUCTION, measure chi`);
console.log(`# n=${minN}..${maxN}, ${seeds} seeds each. Record to beat: 9 (Sulanke 1980).`);
console.log(`# every reported graph is re-checked end-to-end by verifyCertificate.\n`);

const rows = [];
let champion = null;

for (let n = minN; n <= maxN; n++) {
  let best = null;
  const hist = {};
  for (let s = 0; s < seeds; s++) {
    const g = growBiplanar(n, 5000 + s);
    const chi = chromaticNumber(g.n, g.edges);
    hist[chi] = (hist[chi] ?? 0) + 1;
    if (!best || chi > best.chi || (chi === best.chi && g.edges.length > best.g.edges.length)) best = { chi, g };
    if (chi >= TARGET) break;
  }
  const cert = { target: "27b", n, edges: best.g.edges, layer1: best.g.layer1, layer2: best.g.layer2, claimedChromaticAtLeast: best.chi, prngSeed: best.g.seed };
  const check = verifyCertificate(cert);
  const spread = Object.keys(hist).map(Number).sort((a, b) => a - b).map((k) => `${k}:${hist[k]}`).join(" ");
  rows.push({ n, bestChi: best.chi, m: best.g.edges.length, budget: 6 * n - 12, leftover: best.g.leftover, seed: best.g.seed, verified: check.ok, spread: hist });
  console.log(`n=${n}  best chi=${best.chi}  m=${best.g.edges.length}/${6 * n - 12}  leftover=${best.g.leftover}  seed=${best.g.seed}  verifier=${check.ok ? "OK" : "REJECTED: " + check.reasons.join("; ")}`);
  console.log(`      chi spread over seeds: ${spread}`);
  if (best.chi >= TARGET && check.ok) champion = cert;
}

console.log(`\n# best chi found: ${Math.max(...rows.map((r) => r.bestChi))} (record to beat: 9)`);
if (champion) {
  console.log(`\n# A GRAPH REACHED chi >= ${TARGET} AND VERIFIED. This is NOT yet a result:`);
  console.log(`# exact re-verify + literature/priority check + adversarial review + David's gate all owed (G-2).`);
  writeFileSync(new URL("./round2-champion.json", import.meta.url), JSON.stringify(champion, null, 2) + "\n");
} else {
  console.log(`# no graph reached chi >= ${TARGET}; the record stands and nothing here is reportable.`);
}

if (jsonPath) {
  writeFileSync(jsonPath, JSON.stringify({ minN, maxN, seeds, generated: "search/27b/round2-grow.mjs", rows }, null, 2) + "\n");
  console.log(`\nwrote ${jsonPath}`);
}

}
