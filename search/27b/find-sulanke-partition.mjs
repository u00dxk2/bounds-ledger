#!/usr/bin/env node
// Reproduce the KNOWN record before trusting the harness on a new one (G-2
// interim milestone): find an explicit biplanar edge partition of Sulanke's
// graph (K6 + C5 join, 11 vertices, 50 edges) and run the full certificate
// through verifyCertificate. The graph is known biplanar since 1980; if this
// search cannot exhibit a split our verifier accepts, the harness — not the
// record — is under suspicion.
//
// Method: random-restart greedy. Shuffle the edge order, grow layer1 as a
// maximal planar subgraph (add an edge iff the layer stays planar under the
// exact DMP test), put the rest in layer2, accept iff layer2 is also planar.
// ponytail: no annealing, no clever energy — restarts are cheap at n=11 and
// the greedy either finds a split in seconds or the loop count tells us to
// think harder. Deterministic PRNG so a found split is reproducible.

import { writeFileSync } from "node:fs";
import { isPlanar, verifyCertificate, sulankeGraph } from "./verifier.mjs";

// deterministic PRNG (mulberry32) — reruns reproduce the same discovery
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

const { n, edges } = sulankeGraph();
const m = edges.length;
console.log(`Sulanke graph: n=${n}, m=${m} (planar layer cap is ${3 * n - 6} edges, so layer1 needs >= ${m - (3 * n - 6)})`);

const MAX_TRIES = 20000;
let found = null;
for (let t = 0; t < MAX_TRIES && !found; t++) {
  const rand = rng(1000 + t);
  const order = edges.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const layer1 = [];
  let e1 = [];
  for (const i of order) {
    const trial = [...e1, edges[i]];
    if (trial.length <= 3 * n - 6 && isPlanar(n, trial)) { e1 = trial; layer1.push(i); }
  }
  const layer2 = order.filter((i) => !layer1.includes(i));
  if (layer2.length <= 3 * n - 6 && isPlanar(n, layer2.map((i) => edges[i]))) {
    found = { seed: 1000 + t, tries: t + 1, layer1: layer1.sort((a, b) => a - b), layer2: layer2.sort((a, b) => a - b) };
  }
}

if (!found) {
  console.log(`NO PARTITION FOUND in ${MAX_TRIES} greedy restarts — suspect the harness before the record (the graph IS biplanar).`);
  process.exit(1);
}

const cert = { target: "27b", graph: "Sulanke 1980 (K6 + C5 join)", n, edges, layer1: found.layer1, layer2: found.layer2, claimedChromaticAtLeast: 9, prngSeed: found.seed };
const result = verifyCertificate(cert);
console.log(`partition found on restart ${found.tries} (seed ${found.seed}): |layer1|=${found.layer1.length}, |layer2|=${found.layer2.length}`);
console.log(`verifyCertificate: ${JSON.stringify(result)}`);
if (!result.ok) process.exit(1);
writeFileSync(new URL("./sulanke-certificate.json", import.meta.url), JSON.stringify(cert, null, 2) + "\n");
console.log("KNOWN RECORD REPRODUCED: certificate written to search/27b/sulanke-certificate.json");
