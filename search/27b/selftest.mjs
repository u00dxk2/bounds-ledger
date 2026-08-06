#!/usr/bin/env node
// KP-78 selftest for the 27b verifier: every check demonstrates BOTH answers —
// it fires when the condition is present and stays silent when absent. The
// planarity cases include Petersen and K3,3, which pass the edge-count
// shortcuts and exercise the actual DMP embedding, not just the arithmetic.

import { isPlanar, chromaticNumber, verifyCertificate, completeGraph, sulankeGraph, ekey } from "./verifier.mjs";

const fail = (msg) => { console.error(`27b selftest FAIL: ${msg}`); process.exit(1); };
const assert = (cond, msg) => { if (!cond) fail(msg); };

// --- planarity fires on nonplanar graphs ---
assert(!isPlanar(5, completeGraph(5).edges), "K5 must be nonplanar");
const k33 = { n: 6, edges: [] };
for (let i = 0; i < 3; i++) for (let j = 3; j < 6; j++) k33.edges.push([i, j]);
assert(!isPlanar(6, k33.edges), "K3,3 must be nonplanar (DMP, not edge count)");
const petersen = { n: 10, edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[5,7],[7,9],[9,6],[6,8],[8,5],[0,5],[1,6],[2,7],[3,8],[4,9]] };
assert(!isPlanar(10, petersen.edges), "Petersen must be nonplanar (DMP)");
assert(!isPlanar(6, completeGraph(6).edges), "K6 must be nonplanar");

// --- planarity stays silent on planar graphs ---
assert(isPlanar(4, completeGraph(4).edges), "K4 must be planar");
const k5minus = completeGraph(5).edges.filter(([u, v]) => !(u === 0 && v === 1));
assert(isPlanar(5, k5minus), "K5 minus an edge must be planar");
// octahedron = K6 minus a perfect matching (0-1, 2-3, 4-5)
const matching = new Set([ekey(0, 1), ekey(2, 3), ekey(4, 5)]);
const octa = completeGraph(6).edges.filter(([u, v]) => !matching.has(ekey(u, v)));
assert(isPlanar(6, octa), "octahedron must be planar");
const grid = { n: 9, edges: [] };
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
  if (c < 2) grid.edges.push([3 * r + c, 3 * r + c + 1]);
  if (r < 2) grid.edges.push([3 * r + c, 3 * (r + 1) + c]);
}
assert(isPlanar(9, grid.edges), "3x3 grid must be planar");

// --- chromatic number: exact values on known graphs ---
assert(chromaticNumber(6, completeGraph(6).edges) === 6, "chi(K6)=6");
assert(chromaticNumber(5, [[0,1],[1,2],[2,3],[3,4],[4,0]]) === 3, "chi(C5)=3");
assert(chromaticNumber(10, petersen.edges) === 3, "chi(Petersen)=3");
assert(chromaticNumber(6, k33.edges) === 2, "chi(K3,3)=2");
const sul = sulankeGraph();
assert(chromaticNumber(sul.n, sul.edges) === 9, "chi(Sulanke K6+C5 join)=9 — the 1980 record value");

// --- certificate verification: passes a correct certificate ---
// K6 split as octahedron + perfect matching; chi(K6)=6.
const k6 = completeGraph(6);
const layer2 = k6.edges.map((e, i) => [e, i]).filter(([e]) => matching.has(ekey(e[0], e[1]))).map(([, i]) => i);
const layer1 = k6.edges.map((_, i) => i).filter((i) => !layer2.includes(i));
const good = { n: 6, edges: k6.edges, layer1, layer2, claimedChromaticAtLeast: 6 };
const g = verifyCertificate(good);
assert(g.ok && g.chromaticNumber === 6, `correct K6 certificate must verify (got ${JSON.stringify(g)})`);

// --- certificate verification: fires on each defect class ---
const overclaim = { ...good, claimedChromaticAtLeast: 7 };
assert(!verifyCertificate(overclaim).ok, "overclaimed chromatic bound must fail");
const badPartition = { ...good, layer2: layer2.slice(1) }; // an edge in neither layer
assert(!verifyCertificate(badPartition).ok, "incomplete partition must fail");
const nonplanarLayer = { ...good, layer1: k6.edges.map((_, i) => i), layer2: [] };
const npl = verifyCertificate(nonplanarLayer);
assert(!npl.ok && npl.reasons.some((r) => r.includes("not planar")), "all-of-K6-in-one-layer must fail planarity");

console.log("27b verifier selftest: PASS (4 nonplanar fire + 4 planar silent + 5 exact chi + 1 good cert + 3 bad certs)");
