#!/usr/bin/env node
// G-2 verifier for target 27b (Earth-Moon problem: maximum chromatic number of
// biplanar graphs; current record lower bound 9, Sulanke 1980). This is the
// DUMB half of the search: model proposes, this code disposes. Its authority
// comes from being small, exact, and runnable by anyone — including the
// upstream maintainer. Node stdlib only, no dependencies, no model calls.
//
// A certificate is: a graph G, an edge partition into two layers, and a claimed
// chromatic lower bound c. It verifies iff (1) the layers exactly partition
// E(G), (2) BOTH layers are planar (exact DMP test, not a heuristic), and
// (3) the exact chromatic number of G is >= c (branch-and-bound, so a "no
// (c-1)-coloring exists" answer is exhaustive, not sampled).
//
// ponytail: DMP (Demoucron-Malgrange-Pertuiset) is O(n^2) and the coloring is
// exponential worst-case — both fine at the n<=40 scale this search lives at.
// If a candidate ever needs industrial scale, the upgrade path is a DIMACS
// export + kissat/drat-trim certificate, not a smarter in-house solver.

// ---------- graph basics ----------

export const ekey = (u, v) => (u < v ? `${u},${v}` : `${v},${u}`);

export function normalizeEdges(edges) {
  const seen = new Set();
  const out = [];
  for (const [u, v] of edges) {
    if (u === v) throw new Error(`self-loop at ${u}`);
    const k = ekey(u, v);
    if (seen.has(k)) throw new Error(`duplicate edge ${k}`);
    seen.add(k);
    out.push(u < v ? [u, v] : [v, u]);
  }
  return out;
}

function adjacency(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  return adj;
}

// ---------- planarity: biconnected decomposition + DMP ----------

function biconnectedComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([u, v], i) => { adj[u].push([v, i]); adj[v].push([u, i]); });
  const num = new Array(n).fill(-1), low = new Array(n).fill(0);
  const stack = [], comps = [];
  let counter = 0;
  const dfs = (u, parentEdge) => {
    num[u] = low[u] = counter++;
    for (const [v, ei] of adj[u]) {
      if (ei === parentEdge) continue;
      if (num[v] === -1) {
        stack.push(ei);
        dfs(v, ei);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] >= num[u]) {
          const comp = [];
          let e;
          do { e = stack.pop(); comp.push(edges[e]); } while (e !== ei);
          comps.push(comp);
        }
      } else if (num[v] < num[u]) {
        stack.push(ei);
        low[u] = Math.min(low[u], num[v]);
      }
    }
  };
  for (let s = 0; s < n; s++) if (num[s] === -1 && adj[s].length) dfs(s, -1);
  return comps;
}

// DMP on one biconnected component (edges only; vertices are relabeled inside).
function bicompPlanar(compEdges) {
  if (compEdges.length <= 8) return true; // K5 needs 10 edges, K3,3 needs 9
  const verts = [...new Set(compEdges.flat())];
  const idx = new Map(verts.map((v, i) => [v, i]));
  const n = verts.length;
  const edges = compEdges.map(([u, v]) => [idx.get(u), idx.get(v)]);
  if (edges.length > 3 * n - 6) return false;
  const adj = adjacency(n, edges);

  // initial cycle via DFS back-edge
  const parent = new Array(n).fill(-1);
  const seen = new Array(n).fill(false);
  let cycle = null;
  const dfsCycle = (u) => {
    seen[u] = true;
    for (const v of adj[u]) {
      if (cycle) return;
      if (!seen[v]) { parent[v] = u; dfsCycle(v); }
      else if (v !== parent[u]) {
        const path = [u];
        for (let x = u; x !== v; x = parent[x]) path.push(parent[x]);
        cycle = path; // u ... v
        return;
      }
    }
  };
  dfsCycle(0);
  if (!cycle) return true; // acyclic component (bridge-ish) is planar

  const embV = new Set(cycle);
  const embE = new Set();
  for (let i = 0; i < cycle.length; i++) embE.add(ekey(cycle[i], cycle[(i + 1) % cycle.length]));
  let faces = [cycle.slice(), cycle.slice().reverse()];

  const totalEdges = edges.length;
  while (embE.size < totalEdges) {
    // fragments
    const fragments = [];
    for (const [u, v] of edges) {
      if (!embE.has(ekey(u, v)) && embV.has(u) && embV.has(v)) {
        fragments.push({ attach: new Set([u, v]), single: [u, v], compVerts: null });
      }
    }
    const unSeen = new Array(n).fill(false);
    for (let s = 0; s < n; s++) {
      if (embV.has(s) || unSeen[s]) continue;
      const comp = [];
      const queue = [s]; unSeen[s] = true;
      while (queue.length) {
        const u = queue.pop(); comp.push(u);
        for (const v of adj[u]) if (!embV.has(v) && !unSeen[v]) { unSeen[v] = true; queue.push(v); }
      }
      const attach = new Set();
      for (const u of comp) for (const v of adj[u]) if (embV.has(v)) attach.add(v);
      fragments.push({ attach, single: null, compVerts: new Set(comp) });
    }
    if (!fragments.length) return true;

    // admissible faces per fragment
    let best = null;
    for (const frag of fragments) {
      const adm = [];
      for (let fi = 0; fi < faces.length; fi++) {
        const fset = new Set(faces[fi]);
        let ok = true;
        for (const a of frag.attach) if (!fset.has(a)) { ok = false; break; }
        if (ok) adm.push(fi);
      }
      if (adm.length === 0) return false;
      if (!best || adm.length < best.adm.length) best = { frag, adm };
      if (best.adm.length === 1) break;
    }

    // path through chosen fragment between two distinct attachments
    const { frag, adm } = best;
    let path;
    if (frag.single) path = frag.single.slice();
    else {
      const attach = [...frag.attach];
      if (attach.length < 2) return false; // cannot occur in a biconnected comp
      const start = attach[0];
      const prev = new Map([[start, null]]);
      const queue = [start];
      let end = null;
      while (queue.length && end === null) {
        const u = queue.shift();
        for (const v of adj[u]) {
          if (prev.has(v)) continue;
          if (frag.compVerts.has(v)) { prev.set(v, u); queue.push(v); }
          else if (embV.has(v) && frag.attach.has(v) && v !== start && u !== start) { prev.set(v, u); end = v; break; }
          else if (embV.has(v) && frag.attach.has(v) && v !== start && u === start) {
            // start and v both embedded: only valid if some interior exists is not required —
            // but a direct start-v edge would have been a single-edge fragment; skip here.
            continue;
          }
        }
      }
      if (end === null) return false;
      path = [];
      for (let x = end; x !== null; x = prev.get(x)) path.push(x);
      path.reverse(); // start ... end
    }

    // split the chosen face by the path
    const face = faces[adm[0]];
    const a = path[0], b = path[path.length - 1];
    const ia = face.indexOf(a), ib = face.indexOf(b);
    const walk = (from, to) => {
      const w = [];
      for (let i = from; ; i = (i + 1) % face.length) { w.push(face[i]); if (i === to) break; }
      return w;
    };
    const interior = path.slice(1, -1);
    const f1 = walk(ia, ib).concat([...interior].reverse());
    const f2 = walk(ib, ia).concat(interior);
    faces.splice(adm[0], 1, f1, f2);

    for (const v of interior) embV.add(v);
    for (let i = 0; i + 1 < path.length; i++) embE.add(ekey(path[i], path[i + 1]));
  }
  return true;
}

export function isPlanar(n, edges) {
  edges = normalizeEdges(edges);
  if (n < 5 || edges.length <= 8) return true;
  if (n >= 3 && edges.length > 3 * n - 6) return false;
  return biconnectedComponents(n, edges).every(bicompPlanar);
}

// ---------- exact chromatic number ----------

function greedyCliqueLB(n, adj) {
  let best = 0;
  const order = [...Array(n).keys()].sort((a, b) => adj[b].length - adj[a].length);
  for (const seed of order.slice(0, Math.min(n, 10))) {
    const clique = [seed];
    const cand = new Set(adj[seed]);
    while (cand.size) {
      let pick = -1, deg = -1;
      for (const v of cand) if (adj[v].length > deg) { deg = adj[v].length; pick = v; }
      clique.push(pick);
      const nb = new Set(adj[pick]);
      for (const v of [...cand]) if (!nb.has(v)) cand.delete(v);
      cand.delete(pick);
    }
    best = Math.max(best, clique.length);
  }
  return best;
}

function kColorable(n, adj, k) {
  const color = new Array(n).fill(-1);
  const neighborColors = Array.from({ length: n }, () => new Set());
  const pickNext = () => {
    let pick = -1, sat = -1, deg = -1;
    for (let v = 0; v < n; v++) {
      if (color[v] !== -1) continue;
      const s = neighborColors[v].size;
      if (s > sat || (s === sat && adj[v].length > deg)) { sat = s; deg = adj[v].length; pick = v; }
    }
    return pick;
  };
  let maxUsed = -1;
  const bt = () => {
    const v = pickNext();
    if (v === -1) return true;
    const limit = Math.min(k - 1, maxUsed + 1); // symmetry break: at most one brand-new color
    for (let c = 0; c <= limit; c++) {
      if (neighborColors[v].has(c)) continue;
      color[v] = c;
      const prevMax = maxUsed;
      maxUsed = Math.max(maxUsed, c);
      const bumped = [];
      for (const u of adj[v]) if (color[u] === -1 && !neighborColors[u].has(c)) { neighborColors[u].add(c); bumped.push(u); }
      if (bt()) return true;
      for (const u of bumped) neighborColors[u].delete(c);
      color[v] = -1;
      maxUsed = prevMax;
    }
    return false;
  };
  return bt();
}

export function chromaticNumber(n, edges) {
  edges = normalizeEdges(edges);
  const adj = adjacency(n, edges);
  if (!edges.length) return n ? 1 : 0;
  const lb = Math.max(2, greedyCliqueLB(n, adj));
  for (let k = lb; k <= n; k++) if (kColorable(n, adj, k)) return k;
  return n;
}

// ---------- certificate verification ----------

// cert: { n, edges: [[u,v]...], layer1: [edgeIndex...], layer2: [edgeIndex...], claimedChromaticAtLeast }
export function verifyCertificate(cert) {
  const reasons = [];
  const edges = normalizeEdges(cert.edges);
  const m = edges.length;
  const l1 = new Set(cert.layer1), l2 = new Set(cert.layer2);
  if (l1.size + l2.size !== m || [...l1].some((i) => l2.has(i)) || m !== cert.layer1.length + cert.layer2.length) {
    reasons.push("layers are not an exact disjoint partition of the edge set");
  }
  for (const i of [...l1, ...l2]) if (!(i >= 0 && i < m)) reasons.push(`edge index ${i} out of range`);
  if (!reasons.length) {
    const e1 = cert.layer1.map((i) => edges[i]);
    const e2 = cert.layer2.map((i) => edges[i]);
    if (!isPlanar(cert.n, e1)) reasons.push("layer1 is not planar");
    if (!isPlanar(cert.n, e2)) reasons.push("layer2 is not planar");
    const chi = chromaticNumber(cert.n, edges);
    if (chi < cert.claimedChromaticAtLeast) reasons.push(`chromatic number is ${chi}, below claimed ${cert.claimedChromaticAtLeast}`);
    if (!reasons.length) return { ok: true, chromaticNumber: chi, reasons: [] };
  }
  return { ok: false, chromaticNumber: null, reasons };
}

// ---------- known graphs (shared by selftest + search) ----------

export function completeGraph(k) {
  const edges = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) edges.push([i, j]);
  return { n: k, edges };
}

// Sulanke's graph: join of K6 (vertices 0-5) and C5 (vertices 6-10).
export function sulankeGraph() {
  const edges = completeGraph(6).edges;
  for (let i = 0; i < 5; i++) edges.push([6 + i, 6 + ((i + 1) % 5)]);
  for (let i = 0; i < 6; i++) for (let j = 6; j < 11; j++) edges.push([i, j]);
  return { n: 11, edges };
}
