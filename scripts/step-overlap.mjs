#!/usr/bin/env node
// A-82: the exact evaluator behind every 1b entry in ledger/newer-results.json. Moved from tmp/ on
// 2026-10-17 (it was tmp/arxiv-watch/2026-10-16/constants/confirm/eval-ntt.mjs), because a check the
// public page cites must be re-runnable from the tree.
//
// THE DEFINITION (ledger/teorth-optimizationproblems/constants/1b.md lines 5-9): an admissible f has
// 0 <= f <= 1 on [-1,1], g = 1 - f there, both zero outside, and int f = 1; it gives the upper bound
//   C_1b <= sup_{x in [-2,2]} int f(t) g(x+t) dt.
// A witness is a step function with n equal steps and integer heights h_i over one denominator D, so
// f = h_i/D on step i (a witness posted on [0,2] instead of [-1,1] is the same function translated,
// which changes no overlap). At the grid shift x = j*(2/n) the overlap is 2*S_j / (n*D^2), with
//   S_j = sum_i h_i * (D - h_{i+j}).
// Between grid shifts the overlap of two step functions on one grid is linear, so the sup is the max of
// S_j over j in [-(n-1), n-1]. That linearity is CHECKED near the maximum by a separate direct
// integration on the half grid (and at every shift under --oracle).
//
// HOW S IS COMPUTED. Every S_j at once, exactly, by a number-theoretic transform modulo several primes
// p < 2^26.5 (so a product of two residues stays exact in a double), recombined by the Chinese remainder
// theorem in BigInt. The primes' product is required to exceed 4x the largest possible S_j. The O(n)
// direct BigInt sum is re-run at the maximum and the lags around it, and every disagreement is counted.
//
// WHAT IT REFUSES (exit 2): a file in neither witness format, a height token that is not a plain
// non-negative integer (heights reach 2^60, past where JSON.parse rounds, so tokens are read as digits),
// denominators that differ, a length that disagrees with n, and too few primes for the bound.
//
// Usage:
//   node scripts/step-overlap.mjs --file <path> [--oracle]   evaluate one local witness file
//   node scripts/step-overlap.mjs --store                    re-check every 1b entry of the store from
//                                                            its pinned source (network; an indicator,
//                                                            never in npm run check or CI)
//   node scripts/step-overlap.mjs --selftest                 network-free; runs in CI

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { isEntryModule } from "./lib/entry-module.mjs";

export class Refusal extends Error {}

/**
 * A strict JSON parser that keeps every number as its SOURCE TEXT (heights reach 2^60, past where
 * JSON.parse rounds) and REFUSES what JSON.parse would silently accept or resolve: a duplicate key in
 * any object, and anything after the top-level value. Objects become Maps, numbers { num: "<source>" }.
 * (Codex r1, 2026-10-17: a regex reader let a nested or duplicate field supply the evaluated witness.)
 */
const LIT = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/y;
const STR = /"(?:[^"\\\u0000-\u001f]|\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))*"/y;
export function parseJsonExact(text) {
  let i = 0;
  const ws = () => { while (i < text.length && " \t\n\r".includes(text[i])) i++; };
  const fail = (what) => { throw new Refusal(`the file is not valid JSON (${what} at offset ${i})`); };
  const value = () => {
    ws();
    const c = text[i];
    if (c === "{") {
      i++; const m = new Map(); ws();
      if (text[i] === "}") { i++; return m; }
      for (;;) {
        ws(); if (text[i] !== '"') fail("expected a key");
        const k = str();
        if (m.has(k)) throw new Refusal(`a duplicate key ${JSON.stringify(k)} in one object`);
        ws(); if (text[i] !== ":") fail("expected ':'"); i++;
        m.set(k, value()); ws();
        if (text[i] === ",") { i++; continue; }
        if (text[i] === "}") { i++; return m; }
        fail("expected ',' or '}'");
      }
    }
    if (c === "[") {
      i++; const a = []; ws();
      if (text[i] === "]") { i++; return a; }
      for (;;) {
        a.push(value()); ws();
        if (text[i] === ",") { i++; continue; }
        if (text[i] === "]") { i++; return a; }
        fail("expected ',' or ']'");
      }
    }
    if (c === '"') return str();
    LIT.lastIndex = i;
    const lit = LIT.exec(text);
    if (!lit) fail("unexpected character");
    i += lit[0].length;
    return lit[0] === "true" ? true : lit[0] === "false" ? false : lit[0] === "null" ? null : { num: lit[0] };
  };
  const str = () => {
    STR.lastIndex = i;
    const m = STR.exec(text);
    if (!m) fail("a bad string");
    i += m[0].length;
    return JSON.parse(m[0]);
  };
  const v = value(); ws();
  if (i !== text.length) fail("content after the top-level value");
  return v;
}

const plainInt = (v) => v && typeof v === "object" && !(v instanceof Map) && !Array.isArray(v) && /^\d+$/.test(v.num) ? BigInt(v.num) : null;

/**
 * Parse either witness format from the raw bytes. Returns { h: BigInt[], D: BigInt, format }.
 * THE RULE: the file is one JSON object, and the witness is read from its TOP-LEVEL fields only, in
 * exactly one of two formats; anything else is refused, never guessed at.
 *   - "values": an array of "num/den" strings over one common denominator (and if a top-level "n" is
 *     present it must equal the array's length);
 *   - "a" with "n" and "D_log2": an array of plain non-negative integers over 2^D_log2, length n.
 */
export function parseWitness(raw) {
  const top = parseJsonExact(Buffer.isBuffer(raw) ? raw.toString("utf8") : String(raw));
  if (!(top instanceof Map)) throw new Refusal("the file's top-level value is not an object");
  const hasValues = top.has("values"), hasA = top.has("a");
  if (hasValues && hasA) throw new Refusal('the file carries both witness formats ("values" and "a")');
  if (hasValues) {
    const vals = top.get("values");
    if (!Array.isArray(vals) || !vals.length) throw new Refusal('"values" is not a non-empty array');
    let den = null;
    const h = vals.map((t) => {
      const m = typeof t === "string" ? /^(\d+)\/(\d+)$/.exec(t) : null;
      if (!m) throw new Refusal(`a value is not a "num/den" string of non-negative integers: ${JSON.stringify(t).slice(0, 40)}`);
      if (den === null) den = m[2];
      if (m[2] !== den) throw new Refusal("the values' denominators differ");
      return BigInt(m[1]);
    });
    if (BigInt(den) === 0n) throw new Refusal("the common denominator is zero");
    if (top.has("n") && plainInt(top.get("n")) !== BigInt(h.length)) throw new Refusal(`${h.length} values but the file's n says otherwise`);
    return { h, D: BigInt(den), format: `values num/den, common den = ${den}` };
  }
  if (!hasA) throw new Refusal("the file is in neither witness format");
  const n = plainInt(top.get("n")), dl = plainInt(top.get("D_log2")), a = top.get("a");
  if (n === null || dl === null) throw new Refusal('"n" and "D_log2" must be top-level plain non-negative integers');
  if (!Array.isArray(a)) throw new Refusal('"a" is not an array');
  const h = a.map((t) => { const x = plainInt(t); if (x === null) throw new Refusal(`a height is not a plain non-negative integer: ${JSON.stringify(t).slice(0, 40)}`); return x; });
  if (BigInt(h.length) !== n) throw new Refusal(`${h.length} heights but n = ${n}`);
  return { h, D: 1n << dl, format: `a over 2^${dl}` };
}

const LIMIT = 94906265; // floor(sqrt(2^53))
const isPrime = (x) => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
const powmod = (b, e, p) => { let r = 1n, B = BigInt(b) % BigInt(p), E = BigInt(e); const P = BigInt(p); while (E > 0n) { if (E & 1n) r = (r * B) % P; B = (B * B) % P; E >>= 1n; } return Number(r); };
const mul = (a, b, p) => (a * b) % p; // exact: a, b < p < 2^26.5
function primRoot(p) {
  const fs = []; let m = p - 1;
  for (let d = 2; d * d <= m; d++) if (m % d === 0) { fs.push(d); while (m % d === 0) m /= d; }
  if (m > 1) fs.push(m);
  for (let g = 2; ; g++) if (fs.every((q) => powmod(g, (p - 1) / q, p) !== 1)) return g;
}
function ntt(a, p, g, invert) {
  const len = a.length;
  for (let i = 1, j = 0; i < len; i++) { let bit = len >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { const t = a[i]; a[i] = a[j]; a[j] = t; } }
  for (let size = 2; size <= len; size <<= 1) {
    let w = powmod(g, (p - 1) / size, p); if (invert) w = powmod(w, p - 2, p);
    const half = size >> 1;
    const ws = new Float64Array(half); ws[0] = 1; for (let k = 1; k < half; k++) ws[k] = mul(ws[k - 1], w, p);
    for (let i = 0; i < len; i += size) for (let k = 0; k < half; k++) {
      const u = a[i + k], v = mul(a[i + k + half], ws[k], p);
      a[i + k] = u + v >= p ? u + v - p : u + v;
      a[i + k + half] = u - v < 0 ? u - v + p : u - v;
    }
  }
  if (invert) { const ninv = powmod(len, p - 2, p); for (let i = 0; i < len; i++) a[i] = mul(a[i], ninv, p); }
}

/**
 * Every S_j = sum_i h_i * gd_{i+j} for j in [-(N-1), N-1], exactly, for NON-NEGATIVE h and gd.
 * Returns a BigInt array indexed j + N - 1. `maxPrimes` is a TEST SEAM only: the selftest caps it to
 * prove the direct cross-check fires when the transform is wrong.
 */
export function correlate(h, gd, { maxPrimes = Infinity } = {}) {
  const N = h.length;
  let L = 1; while (L < 2 * N) L <<= 1;
  let hmax = 0n, gmax = 0n;
  for (const x of h) { if (x < 0n) throw new Refusal("a negative height reached the transform"); if (x > hmax) hmax = x; }
  for (const x of gd) { if (x < 0n) throw new Refusal("a negative complement reached the transform"); if (x > gmax) gmax = x; }
  const bound = BigInt(N) * (hmax || 1n) * (gmax || 1n);
  const primes = []; let prod = 1n;
  for (let c = Math.floor((LIMIT - 1) / L); c > 0 && prod <= 4n * bound && primes.length < maxPrimes; c--) {
    const p = c * L + 1;
    if (p < LIMIT && isPrime(p)) { primes.push(p); prod *= BigInt(p); }
  }
  if (maxPrimes === Infinity && prod <= 4n * bound) throw new Refusal("too few transform primes for this witness's size");
  const residues = primes.map((p) => {
    const g = primRoot(p), P = BigInt(p);
    const A = new Float64Array(L), B = new Float64Array(L);
    for (let i = 0; i < N; i++) { A[i] = Number(h[i] % P); B[i] = Number(gd[N - 1 - i] % P); }
    ntt(A, p, g, false); ntt(B, p, g, false);
    for (let i = 0; i < L; i++) A[i] = mul(A[i], B[i], p);
    ntt(A, p, g, true);
    return A;
  });
  const terms = primes.map((p) => { const P = BigInt(p), Mi = prod / P; let inv = 1n, b = Mi % P, e = P - 2n; while (e > 0n) { if (e & 1n) inv = (inv * b) % P; b = (b * b) % P; e >>= 1n; } return Mi * inv; });
  const S = new Array(2 * N - 1);
  for (let j = -(N - 1); j <= N - 1; j++) {
    const k = N - 1 - j; // conv(h, rev(gd))[N-1-j]
    let x = 0n; for (let t = 0; t < primes.length; t++) x += BigInt(residues[t][k]) * terms[t];
    S[j + N - 1] = x % prod;
  }
  return S;
}

/** The O(n) direct sum at one lag: the oracle the transform is checked against. */
export function direct(h, gd, j) {
  const N = h.length; let s = 0n;
  for (let i = Math.max(0, -j); i < Math.min(N, N - j); i++) s += h[i] * gd[i + j];
  return s;
}

/**
 * EVERY S_j a second time, by a method that shares no code with the transform: Kronecker substitution.
 * Pack h and the reversed complement into one integer each, one slot of B bits per step (2^B exceeds the
 * largest possible S_j, so no slot carries into the next), multiply once with native BigInt, and read
 * each slot back. Exact at every lag. (2026-10-17: on a large witness the direct sum re-runs only near
 * the maximum; three whole-range moment identities tried first have a blind spot — four errors in the
 * pattern -1, +3, -3, +1 pass all three, Codex r3 — so they were replaced by this full recomputation.)
 * Returns the BigInt array indexed j + N - 1, as correlate() does. Non-negative inputs only.
 */
export function correlateKronecker(h, gd) {
  const N = h.length;
  let hmax = 0n, gmax = 0n;
  for (const x of h) { if (x < 0n) throw new Refusal("a negative height reached the substitution"); if (x > hmax) hmax = x; }
  for (const x of gd) { if (x < 0n) throw new Refusal("a negative complement reached the substitution"); if (x > gmax) gmax = x; }
  const bound = BigInt(N) * (hmax || 1n) * (gmax || 1n);
  const hex = Math.ceil((bound.toString(2).length + 1) / 4); // hex digits per slot
  const pack = (arr) => BigInt("0x" + arr.map((x) => x.toString(16).padStart(hex, "0")).join(""));
  // Most significant slot first: h[N-1] ... h[0], so slot k holds h[k]; the reversed complement's slot i
  // holds gd[N-1-i]. The product's slot k is then sum_i h_i * gd[N-1-(k-i)] = S_{N-1-k}.
  const P = pack(h.slice().reverse()) * pack(gd.slice());
  const digits = P.toString(16).padStart((2 * N - 1) * hex, "0");
  if (digits.length !== (2 * N - 1) * hex) throw new Refusal("the substitution's product overflowed its slots");
  const S = new Array(2 * N - 1), L = digits.length;
  for (let k = 0; k < 2 * N - 1; k++) S[(N - 1 - k) + N - 1] = BigInt("0x" + digits.slice(L - (k + 1) * hex, L - k * hex));
  return S;
}

/** Evaluate a parsed witness. `oracle` checks every lag directly (O(n^2)); otherwise a band of `band` lags each side of the maximum. */
// `tamper` is a TEST SEAM only: it edits the transform's output before any check reads it, so the selftest
// can prove that a wrong value OUTSIDE the direct band is refused through the full recomputation alone.
export function evaluate({ h, D }, { oracle = false, band = 64, maxPrimes, tamper } = {}) {
  const N = h.length;
  const n = BigInt(N);
  let bounded = N > 0;
  for (const x of h) if (x < 0n || x > D) bounded = false;
  const massOk = 2n * h.reduce((s, x) => s + x, 0n) === n * D;
  const out = { n: N, bounded, massOk, admissible: false };
  if (!bounded) return out; // a negative complement would break the transform's non-negativity bound
  const gd = h.map((x) => D - x);
  const S = correlate(h, gd, { maxPrimes });
  if (tamper) tamper(S);
  const s = (j) => (j >= -(N - 1) && j <= N - 1 ? S[j + N - 1] : 0n);
  let best = -1n, bestJ = 0;
  for (let j = -(N - 1); j <= N - 1; j++) if (s(j) > best) { best = s(j); bestJ = j; }
  const lo = oracle ? -N : Math.max(-N, bestJ - band), hi = oracle ? N - 1 : Math.min(N - 1, bestJ + band);
  let checked = 0, directMismatch = 0, linMismatch = 0;
  for (let j = lo; j <= hi; j++) {
    checked++;
    if (j >= -(N - 1) && direct(h, gd, j) !== s(j)) directMismatch++;
    let H = 0n; // the overlap at the half shift (j + 1/2) * (2/n), integrated on the half grid
    for (let k = 0; k < 2 * N; k++) { const m = k + 2 * j + 1; if (m >= 0 && m < 2 * N) H += h[k >> 1] * gd[m >> 1]; }
    if (H !== s(j) + s(j + 1)) linMismatch++;
  }
  const K = correlateKronecker(h, gd);
  let fullMismatch = 0;
  for (let k = 0; k < S.length; k++) if (K[k] !== S[k]) fullMismatch++;
  const num = 2n * best, den = n * D * D;
  return { ...out, bestJ, num, den, checked, directMismatch, linMismatch, fullMismatch, admissible: massOk && directMismatch === 0 && linMismatch === 0 && fullMismatch === 0 };
}

/** The first k decimal places of num/den (0 <= num/den < 1), truncated or rounded up. */
export function places(num, den, k, mode) {
  const q = num * 10n ** BigInt(k);
  const v = mode === "up" && q % den !== 0n ? q / den + 1n : q / den;
  if (v >= 10n ** BigInt(k)) throw new Refusal("the value is not below 1");
  return `0.${v.toString().padStart(k, "0")}`;
}
const gcd = (a, b) => (b === 0n ? a : gcd(b, a % b));
export function reduced(num, den) { const g = gcd(num, den) || 1n; return `${num / g}/${den / g}`; }

/** Does a printed decimal sit at or above the exact value num/den? Exact, BigInt. */
export function atOrAbove(decimal, num, den) {
  const [i, f = ""] = decimal.split(".");
  return BigInt(`${i}${f}`) * den >= num * 10n ** BigInt(f.length);
}

const RAW_PATH_RE = /^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/([0-9a-f]{40})\/([A-Za-z0-9_.\/-]+)$/;
/**
 * A raw.githubusercontent.com link pinned to a full commit sha, judged on the URL AS IT RESOLVES (Codex r1,
 * 2026-10-17: ".../<sha>/../main/f.json" matched a pattern on the raw string and resolves to a branch).
 * The link must already BE its resolved form, and no path segment may be "." or "..", so the address we
 * store is the address fetched. Returns { owner, repo, sha, path } or null. Shared by newer-results.mjs.
 */
export function parsePinnedRaw(u) {
  let url;
  // A bare "?" or "#" leaves .search/.hash empty while staying in .href (Codex r2), so refuse the characters.
  if (/[?#]/.test(String(u))) return null;
  try { url = new URL(String(u)); } catch { return null; }
  if (url.protocol !== "https:" || url.hostname !== "raw.githubusercontent.com" || url.search || url.hash || url.username || url.password || url.port) return null;
  if (url.href !== String(u)) return null;
  const m = RAW_PATH_RE.exec(url.pathname);
  if (!m || m[4].split("/").some((s) => s === "" || s === "." || s === "..")) return null;
  return { owner: m[1], repo: m[2], sha: m[3], path: m[4] };
}

/** Judge one fetched file against its store entry. Returns { verdict, lines }; verdict is MATCHES / SOURCE CHANGED / DIFFERS / NOT ADMISSIBLE. */
export function judgeEntry(entry, raw) {
  // A witness gives an UPPER bound on C_1b (the constant is a sup over the overlaps it must exceed).
  if (entry.side !== "upper") throw new Refusal("a 1b witness gives an upper bound; this entry is not one");
  const sha = createHash("sha256").update(raw).digest("hex");
  if (sha !== entry.fileSha256) return { verdict: "SOURCE CHANGED", lines: [`sha256 ${sha} is not the pinned ${entry.fileSha256}`] };
  const r = evaluate(parseWitness(raw));
  if (!r.admissible) return { verdict: "NOT ADMISSIBLE", lines: [`0<=f<=1: ${r.bounded}, int f = 1: ${r.massOk}, transform mismatches: ${r.directMismatch ?? "-"}, linearity mismatches: ${r.linMismatch ?? "-"}, every-lag recomputation mismatches: ${r.fullMismatch ?? "-"}`] };
  const k = entry.exactMaximum.split(".")[1].length;
  const exact = places(r.num, r.den, k, "down");
  const lines = [`exact maximum ${places(r.num, r.den, 40, "down")}… (${reduced(r.num, r.den)})`, `all ${2 * r.n - 1} lags recomputed independently (Kronecker substitution), 0 mismatches; ${r.checked} lags re-summed directly, 0 mismatches`];
  if (exact !== entry.exactMaximum) return { verdict: "DIFFERS", lines: [...lines, `the store's exactMaximum ${entry.exactMaximum} is not its first ${k} places, ${exact}`] };
  if (!atOrAbove(entry.value, r.num, r.den)) return { verdict: "DIFFERS", lines: [...lines, `the printed value ${entry.value} is on the wrong side of the exact value`] };
  return { verdict: "MATCHES", lines };
}

async function storeMode() {
  const { loadStore } = await import("./newer-results.mjs");
  const store = loadStore();
  const entries = (store?.entries || []).filter((e) => e.id === "1b");
  if (!entries.length) { console.log("RESULT: REFUSED — the store holds no 1b entry, so nothing was checked (exit 2)"); return 2; }
  let worst = 0;
  for (const e of entries) {
    if (!parsePinnedRaw(e.fetchUrl)) { console.log(`1b ${e.value}: REFUSED — fetchUrl is not a raw.githubusercontent.com link pinned to a full commit sha`); worst = Math.max(worst, 2); continue; }
    let res;
    try { res = await fetch(e.fetchUrl); } catch { console.log(`1b ${e.value}: UNREACHABLE — the fetch failed`); worst = Math.max(worst, 2); continue; }
    if (res.status !== 200) { console.log(`1b ${e.value}: UNREACHABLE — HTTP ${res.status}`); worst = Math.max(worst, 2); continue; }
    const raw = Buffer.from(await res.arrayBuffer());
    let j;
    try { j = judgeEntry(e, raw); } catch (err) { if (!(err instanceof Refusal)) throw err; console.log(`1b ${e.value}: REFUSED — ${err.message}`); worst = Math.max(worst, 2); continue; }
    console.log(`1b ${e.value}: ${j.verdict}`);
    for (const l of j.lines) console.log(`  ${l}`);
    if (j.verdict !== "MATCHES") worst = Math.max(worst, 1);
  }
  console.log(worst === 0 ? `RESULT: PASS — ${entries.length} 1b entr${entries.length === 1 ? "y" : "ies"} re-derived from the pinned files (exit 0)` : `RESULT: ${worst === 1 ? "FAIL" : "REFUSED"} (exit ${worst})`);
  return worst;
}

function fileMode(path, oracle) {
  const raw = readFileSync(path);
  console.log(`sha256 of bytes evaluated: ${createHash("sha256").update(raw).digest("hex")} (${raw.length} bytes)`);
  const w = parseWitness(raw);
  console.log(`format: ${w.format}`);
  const r = evaluate(w, { oracle });
  console.log(`n=${r.n}  0<=f<=1: ${r.bounded}  int f = 1 exactly: ${r.massOk}`);
  if (!r.bounded) { console.log("ADMISSIBLE: false (exit 3)"); return 3; }
  console.log(`lags checked directly: ${r.checked}; transform vs direct mismatches: ${r.directMismatch}; half-shift linearity mismatches: ${r.linMismatch}`);
  console.log(`every lag, all ${2 * r.n - 1}: transform vs an independent recomputation (Kronecker substitution) mismatches: ${r.fullMismatch}`);
  console.log(`argmax lag j = ${r.bestJ}`);
  console.log(`M (40 places, truncated): ${places(r.num, r.den, 40, "down")}`);
  console.log(`M rounded UP at 13 places: ${places(r.num, r.den, 13, "up")}`);
  console.log(`M exact fraction (reduced): ${reduced(r.num, r.den)}`);
  console.log(`ADMISSIBLE: ${r.admissible} (exit ${r.admissible ? 0 : 3})`);
  return r.admissible ? 0 : 3;
}

// ---------- selftest (network-free; KP-78: each check fires on the defect and stays silent without it) ----------

export function selftest() {
  let failed = 0;
  const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); };
  const refuses = (fn, part) => { try { fn(); return false; } catch (e) { return e instanceof Refusal && e.message.includes(part); } };

  // Two witnesses whose maximum overlap is known by hand.
  // f = 1 on [-1,0], 0 on [0,1]: g = 1 on [0,1], and the shift x = 1 lines them up, overlap 1.
  const a = evaluate({ h: [1n, 0n], D: 1n });
  check("hand case f = 1 then 0 (n=2): exact maximum 1, at lag 1", a.admissible && reduced(a.num, a.den) === "1/1" && a.bestJ === 1);
  // f = g = 1/2 on [-1,1]: at x = 0 the overlap is 2 * 1/4 = 1/2, the most any shift gives.
  const b = evaluate({ h: [1n], D: 2n });
  check("hand case f = 1/2 throughout (n=1): exact maximum 1/2", b.admissible && reduced(b.num, b.den) === "1/2");

  // The transform against the direct sum at EVERY lag, on random heights up to 2^60.
  let seed = 0x9e3779b9;
  const rnd = () => { seed = (Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) + 0x6d2b79f5) >>> 0; return BigInt(seed); };
  const D60 = 1n << 60n;
  let mism = 0, cases = 0;
  for (let N = 1; N <= 48; N++) {
    const h = Array.from({ length: N }, () => ((rnd() << 32n) | rnd()) % (D60 + 1n));
    const gd = h.map((x) => D60 - x);
    const S = correlate(h, gd);
    for (let j = -(N - 1); j <= N - 1; j++) { cases++; if (S[j + N - 1] !== direct(h, gd, j)) mism++; }
  }
  check(`the transform equals the direct BigInt sum at every lag of 48 random witnesses, heights to 2^60 (${mism} mismatches of ${cases})`, mism === 0 && cases === 48 * 48);

  // Red-arm of that cross-check, inside the test: one prime cannot hold sums near 2^121, so the
  // recombined S is wrong, and evaluate() must SEE it rather than report a maximum.
  {
    const N = 16;
    const h = Array.from({ length: N }, (_, i) => (i % 2 ? D60 : 0n));
    const S1 = correlate(h, h.map((x) => D60 - x), { maxPrimes: 1 });
    const wrong = S1.some((x, k) => x !== direct(h, h.map((y) => D60 - y), k - (N - 1)));
    const r = evaluate({ h, D: D60 }, { maxPrimes: 1 });
    check("with too few primes the transform is wrong AND evaluate() reports mismatches, not admissible (the cross-check can fire)", wrong && r.directMismatch > 0 && !r.admissible);
    const ok = evaluate({ h, D: D60 });
    check("the same witness with the full prime set: 0 mismatches, admissible (the silent half)", ok.directMismatch === 0 && ok.linMismatch === 0 && ok.admissible);
    check("the whole-range oracle agrees on it too", evaluate({ h, D: D60 }, { oracle: true }).directMismatch === 0);
  }

  // The independent every-lag recomputation (Kronecker substitution), Codex r3.
  {
    let km = 0, kc = 0;
    for (let N = 1; N <= 48; N++) {
      const h = Array.from({ length: N }, () => ((rnd() << 32n) | rnd()) % (D60 + 1n));
      const gd = h.map((x) => D60 - x);
      const K = correlateKronecker(h, gd);
      for (let j = -(N - 1); j <= N - 1; j++) { kc++; if (K[j + N - 1] !== direct(h, gd, j)) km++; }
    }
    check(`the Kronecker recomputation equals the direct sum at every lag of 48 random witnesses, heights to 2^60 (${km} mismatches of ${kc})`, km === 0 && kc === 48 * 48);
    // A wrong value OUTSIDE the direct band, one that does not change the maximum, so ONLY the full
    // recomputation can see it: the witness is admissible untampered, and refused tampered.
    const N = 400;
    const h = Array.from({ length: N }, (_, i) => (i < N / 2 ? D60 : 0n)); // f = 1 on [-1,0]: int f = 1, max at lag N/2
    const clean = evaluate({ h, D: D60 }, { band: 8 });
    const far = -(N - 1); // the far end, never inside an 8-lag band around a maximum at a positive lag
    const tampered = evaluate({ h, D: D60 }, { band: 8, tamper: (S) => { S[far + N - 1] = S[far + N - 1] > 0n ? S[far + N - 1] - 1n : 0n; S[1 + N - 1] -= 1n; } });
    check("untampered: admissible, 0 every-lag mismatches (the silent half)", clean.admissible && clean.fullMismatch === 0 && clean.directMismatch === 0);
    check("r3 #2: a wrong value outside the direct band, maximum unchanged, is REFUSED through the every-lag recomputation alone", !tampered.admissible && tampered.fullMismatch > 0 && tampered.directMismatch === 0 && tampered.linMismatch === 0 && tampered.massOk && tampered.num === clean.num);
  }

  // Admissibility.
  check("REFUSES admissibility when int f is not exactly 1", !evaluate({ h: [1n, 1n], D: 1n }).admissible && !evaluate({ h: [1n, 1n], D: 1n }).massOk);
  check("REFUSES admissibility when a height exceeds the denominator (f > 1)", !evaluate({ h: [2n, 0n], D: 1n }).bounded);

  // Parsing: both formats, and the 2^53 trap.
  const big = "1152921504606846977"; // 2^60 + 1, which JSON.parse would round
  const p1 = parseWitness(`{"n": 2, "D_log2": 61, "a": [${big}, 1152921504606846975]}`);
  check("reads a height past 2^53 exactly, as digits (JSON.parse would round it)", p1.h[0] === BigInt(big) && p1.D === 1n << 61n && JSON.parse(`[${big}]`)[0].toString() !== big);
  const p2 = parseWitness(`{"values": ["3/4", "1/4"]}`);
  check("reads the num/den format over one common denominator", p2.D === 4n && p2.h[0] === 3n && p2.h[1] === 1n);
  check("REFUSES a height token that is not a plain integer", refuses(() => parseWitness(`{"n": 2, "D_log2": 1, "a": [1.5, 0]}`), "not a plain"));
  check("REFUSES denominators that differ", refuses(() => parseWitness(`{"values": ["1/2", "1/3"]}`), "differ"));
  check("REFUSES a length that disagrees with n", refuses(() => parseWitness(`{"n": 3, "D_log2": 1, "a": [1, 1]}`), "but n = 3"));
  check("REFUSES a file in neither format", refuses(() => parseWitness(`{"heights": [1]}`), "neither"));
  check("REFUSES a negative value token", refuses(() => parseWitness(`{"values": ["-1/2", "1/2"]}`), 'not a "num/den"'));
  // Codex r1 (2026-10-17), one case per counterexample: the witness is the file's TOP-LEVEL fields only.
  const top = parseWitness(`{"meta": {"values": ["1/2"]}, "values": ["1/1", "0/1"]}`);
  check("r1: a witness NESTED in another field is ignored; the top-level one is the one evaluated", top.h.length === 2 && top.D === 1n && (({ num, den }) => reduced(num, den))(evaluate(top)) === "1/1");
  check("r1: a file whose only witness is nested is REFUSED (neither format at the top level)", refuses(() => parseWitness(`{"meta": {"n": 1, "D_log2": 1, "a": [1]}}`), "neither"));
  check("r1: a duplicate key is REFUSED, at the top level and inside a nested object", refuses(() => parseWitness(`{"values": ["1/2"], "values": ["1/1", "0/1"]}`), "duplicate key") && refuses(() => parseWitness(`{"m": {"x": 1, "x": 2}, "values": ["1/2"]}`), "duplicate key"));
  check("r1: a file carrying BOTH formats is REFUSED", refuses(() => parseWitness(`{"values": ["1/2"], "n": 1, "D_log2": 1, "a": [1]}`), "both witness formats"));
  check("r1: invalid JSON is REFUSED (unclosed, trailing content, a leading-zero number)", refuses(() => parseWitness(`{"values": ["1/2"]`), "not valid JSON") && refuses(() => parseWitness(`{"values": ["1/2"]} x`), "after the top-level") && refuses(() => parseWitness(`{"n": 01, "D_log2": 1, "a": [1]}`), "not valid JSON"));
  check("r1: a top-level n that disagrees with the length of \"values\" is REFUSED; one that agrees passes", refuses(() => parseWitness(`{"n": 3, "values": ["1/2"]}`), "n says otherwise") && parseWitness(`{"n": 1, "values": ["1/2"]}`).h.length === 1);
  check("r1: a string with escapes parses, and a value must be a STRING, not a number", parseJsonExact(`{"k\\u0041": "a\\"b"}`).get("kA") === 'a"b' && refuses(() => parseWitness(`{"values": [0.5]}`), 'not a "num/den"'));
  // Codex r1 #2/#3: the shared raw-link validator, tested directly.
  const S40 = "a".repeat(40);
  check("r1 #2: a pinned raw link in its resolved form passes (the silent half)", parsePinnedRaw(`https://raw.githubusercontent.com/o/r/${S40}/d/f.json`)?.path === "d/f.json");
  check("r1 #2: a raw link that resolves OFF the pinned commit is refused ('..', '%2e%2e', '.')", [`${S40}/../main/f.json`, `${S40}/%2e%2e/main/f.json`, `${S40}/./f.json`].every((p) => parsePinnedRaw(`https://raw.githubusercontent.com/o/r/${p}`) === null));
  check("r1 #2: a raw link with a query, a fragment, another host, a short sha or an empty segment is refused", [`https://raw.githubusercontent.com/o/r/${S40}/f.json?x=1`, `https://raw.githubusercontent.com/o/r/${S40}/f.json#L1`, `https://example.com/o/r/${S40}/f.json`, `https://raw.githubusercontent.com/o/r/${"a".repeat(39)}/f.json`, `https://raw.githubusercontent.com/o/r/${S40}//f.json`, `http://raw.githubusercontent.com/o/r/${S40}/f.json`].every((u) => parsePinnedRaw(u) === null));
  check("r2: a raw link ending in a bare '?' or '#' is refused (.search and .hash read empty for those)", parsePinnedRaw(`https://raw.githubusercontent.com/o/r/${S40}/f.json?`) === null && parsePinnedRaw(`https://raw.githubusercontent.com/o/r/${S40}/f.json#`) === null);

  // Printing.
  check("places() truncates and rounds up exactly", places(1n, 3n, 4, "down") === "0.3333" && places(1n, 3n, 4, "up") === "0.3334" && places(1n, 4n, 2, "up") === "0.25");
  check("atOrAbove() is exact at the boundary", atOrAbove("0.25", 1n, 4n) && !atOrAbove("0.2499", 1n, 4n));

  // judgeEntry, end to end on a tiny file.
  const file = Buffer.from(`{"values": ["1/2"]}`);
  const sha = createHash("sha256").update(file).digest("hex");
  const entry = { id: "1b", side: "upper", value: "0.5", exactMaximum: "0.50", fileSha256: sha };
  check("judgeEntry: a matching file MATCHES (the silent half)", judgeEntry(entry, file).verdict === "MATCHES");
  check("judgeEntry: different bytes are SOURCE CHANGED", judgeEntry({ ...entry, fileSha256: "0".repeat(64) }, file).verdict === "SOURCE CHANGED");
  check("judgeEntry: a wrong stored exact maximum DIFFERS", judgeEntry({ ...entry, exactMaximum: "0.49" }, file).verdict === "DIFFERS");
  check("judgeEntry: an upper value below the exact maximum DIFFERS", judgeEntry({ ...entry, value: "0.4999" }, file).verdict === "DIFFERS");
  const bad = Buffer.from(`{"values": ["2/2", "2/2"]}`); // f = 1 on [-1,1]: int f = 2, not 1
  check("judgeEntry: an inadmissible file is NOT ADMISSIBLE", judgeEntry({ ...entry, fileSha256: createHash("sha256").update(bad).digest("hex") }, bad).verdict === "NOT ADMISSIBLE");

  console.log(failed ? `RESULT: FAIL — ${failed} case(s) (exit 3)` : "RESULT: PASS — the exact 1b evaluator (exit 0)");
  return failed ? 3 : 0;
}

if (isEntryModule(import.meta.url)) {
  const args = process.argv.slice(2);
  const run = async () => {
    if (args.includes("--selftest")) return selftest();
    if (args.includes("--store")) return storeMode();
    const fi = args.indexOf("--file");
    if (fi >= 0 && args[fi + 1]) return fileMode(args[fi + 1], args.includes("--oracle"));
    console.log("usage: step-overlap.mjs --file <path> [--oracle] | --store | --selftest");
    return 2;
  };
  run().then((c) => { process.exitCode = c; }, (err) => { console.log(err instanceof Refusal ? `RESULT: REFUSED — ${err.message} (exit 2)` : `step-overlap: ${err.message}`); process.exitCode = 2; });
}
