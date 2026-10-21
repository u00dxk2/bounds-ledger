#!/usr/bin/env node
/**
 * decimal-vs-exact — A-76: does a bound row print a decimal that claims a little more than the exact
 * value it stands for?
 *
 * THE SHAPE. 87a's upper bound is printed $1058.565$; its source proves 4√70035 = 1058.565066…
 * (A-47-0075). Rounded to three places the row agrees. Read as an exact upper bound it is about
 * 0.0000665 BELOW what the paper proves, a claim the paper does not make. Only an upper bound printed
 * below its exact value, or a lower bound printed above it, overstates; the other direction is harmless.
 *
 * Three populations, counted and reported SEPARATELY and never summed into one verdict:
 *   IN-CELL  a value cell that prints a decimal beside an exact form. When the decimal follows the
 *            form's last ≈ or = (`\frac{\pi}{4}=0.7853981633\dots`, or `$D$ (exact $E$)`), the form
 *            is evaluated and the decimal compared with it in the bound's direction; any other shape
 *            is a member classified UNKNOWN, never dropped.
 *   COMMENT  a value cell that is a bare decimal, whose Comments cell prints a longer decimal agreeing
 *            with it to the cell's last place (87a: `$913.493$` beside "root discriminant < 913.4927").
 *            That is the table's own sharper statement, not the source's.
 *   SOURCE   a depth-audit entry (continuity/depth-audit.json) whose reading recorded the source's exact
 *            value. Those values live in ledger/source-exact-values.json, keyed by entry id, each with a
 *            quotation that must still be a verbatim substring of the entry's record; recorded prose is
 *            never parsed (manager review of P1, 2026-10-21).
 *
 * HOW IT DECIDES. Every verdict comes from EXACT rationals (BigInt fractions), never from floating
 * point. Three Codex rounds on 2026-10-21 kept finding precision and parsing defects in machinery that
 * decided irrational values in floating point; the orchestrator's answer to consult 1174368e was to
 * delete that machinery, not harden it (option A). So:
 *   - a decimal (printed, in a comment, or stated by a source) is an exact rational, no tolerance;
 *   - a rational form (integers, decimals, + − × ÷, integer powers, \frac) is evaluated exactly;
 *   - an irrational IN-CELL form beside a decimal the cell marks approximate is EXACT SHOWN (the reader
 *     sees both; not judged), and beside a bare = it is UNKNOWN;
 *   - a SOURCE entry is judged against the source's own decimal (or a rational closed form); an
 *     irrational closed form is evaluated in floating point ONLY to cross-check that decimal, and a
 *     disagreement REFUSES the run.
 * The exact value is an interval (a … decimal stands for its truncation). A member is AGREES only when
 * every value in it is on the safe side, or the cell marks its decimal approximate and the whole
 * interval lies inside the decimal's rounding (or truncation) window; CUT only when every value is past
 * the decimal in the overstating direction (and, for a marked decimal, outside that window); UNKNOWN
 * otherwise.
 *
 * NOT SEEN: every bound row outside the three populations, which is most of them. A bare decimal whose
 * exact value lives only in its paper (the 87a shape itself) is visible ONLY for a row someone has read
 * and recorded in the SOURCE table; the output prints how many rows that leaves unlooked-at rather than
 * calling them agreeing. Also unseen: whether a COMMENT decimal is about the same quantity as the cell
 * (it is matched by agreement to the cell's precision, nothing more), bare \log of unstated base unless
 * the value does not depend on the base, and the error of the platform's Math functions beyond the
 * margin allowed for them.
 *
 * An INDICATOR, never a gate: it is not in `npm run check` (a known CUT would turn the check
 * permanently red) and only `--selftest` runs in CI. Any CUT is a question for upstream about display
 * convention and goes through the outward gate; nothing here contacts anyone.
 *
 * Exit: 0 no CUT · 1 at least one CUT · 2 refused (a mirror file, the manifest or the pins unreadable,
 * the corpus short or dropping lines, a SOURCE entry malformed, missing, no longer quoted, or whose
 * closed form and decimal disagree). Flags: --root <dir> (default: the repo; the red-arm runs on a
 * scratch copy) · --selftest.
 */
import { readFileSync, readdirSync, realpathSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { boundRowsOf, countCorpus, expectedSectionsFromClaims } from "./depth-audit.mjs";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIRROR = ["ledger", "teorth-optimizationproblems", "constants"];
const EULER_GAMMA = 0.5772156649015329;
// A float literal longer than this is refused on the floating-point path (Codex r1 #5); the exact
// rational path reads any length.
const MAX_FLOAT_SIG = 15;

// ---------- exact rationals ----------
const babs = (x) => (x < 0n ? -x : x);
const gcd = (a, b) => { a = babs(a); b = babs(b); while (b) [a, b] = [b, a % b]; return a || 1n; };
export function frac(n, d = 1n) {
  if (d === 0n) throw new Error("division by zero");
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
const fadd = (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const fsub = (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const fmul = (a, b) => frac(a.n * b.n, a.d * b.d);
const fdiv = (a, b) => frac(a.n * b.d, a.d * b.n);
export const fcmp = (a, b) => { const x = a.n * b.d - b.n * a.d; return x > 0n ? 1 : x < 0n ? -1 : 0; };
const fmin = (a, b) => (fcmp(a, b) <= 0 ? a : b);
const fmax = (a, b) => (fcmp(a, b) >= 0 ? a : b);
const pow10 = (k) => 10n ** BigInt(k);
// "-12.345" or "1e-14" (a JS number's shortest form) → an exact fraction.
export function fracOfText(t) {
  const m = /^(-?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(t);
  if (!m || (m[2] === "" && !m[3])) throw new Error(`not a decimal: ${t}`);
  const digits = (m[2] || "0") + (m[3] || "");
  const exp = Number(m[4] || 0) - (m[3] || "").length;
  const n = BigInt(digits) * (exp > 0 ? pow10(exp) : 1n);
  return frac(m[1] ? -n : n, exp < 0 ? pow10(-exp) : 1n);
}
const fracOfNum = (x) => fracOfText(String(x));
const fmt = (f) => (f ? (Number(f.n) / Number(f.d)).toPrecision(13).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "") : "∞");

// ---------- one parser, two arithmetics ----------
function normalise(s) {
  return s
    .replace(/\$/g, "")
    .replace(/\\(left|right|bigl|bigr|Bigl|Bigr|big|Big|displaystyle)/g, "")
    .replace(/\\[!,;: ]/g, "")
    .replace(/\\(tfrac|dfrac)/g, "\\frac")
    .replace(/\\(cdot|times)/g, "*")
    // Unicode √ binds the whole number after it (4√70035 is 4·√70035, Codex r1 #4).
    .replace(/√(\d+(?:\.\d+)?)/g, "\\sqrt{$1}")
    .replace(/√/g, "\\sqrt")
    .replace(/π/g, "\\pi")
    .replace(/\s+/g, "");
}

function parseWith(src, A) {
  const s = normalise(src);
  let i = 0;
  const peek = () => s[i];
  const fail = (why) => { throw new Error(`${why} at ${i} in ${s}`); };
  const cmd = () => { const m = /^\\[A-Za-z]+/.exec(s.slice(i)); return m ? m[0] : null; };
  const eat = (t) => { if (s.startsWith(t, i)) { i += t.length; return true; } return false; };
  const startsPrimary = () => { const c = peek(); return c !== undefined && (/[0-9.({\\]/.test(c) || c === "e"); };
  function number() {
    const m = /^(\d+(\.\d+)?|\.\d+)/.exec(s.slice(i));
    if (!m) fail("number expected");
    i += m[0].length;
    return A.lit(m[0]);
  }
  // A LaTeX argument: {…}, or a single digit, or one command primary (\sqrt2, \frac12, ^2, ^\pi).
  function arg() {
    if (eat("{")) { const v = expr(); if (!eat("}")) fail("} expected"); return v; }
    const c = peek();
    if (/[0-9]/.test(c)) { i += 1; return A.lit(c); }
    if (c === "\\" || c === "e" || c === "(") return primary();
    return fail("argument expected");
  }
  const funcArg = () => (peek() === "(" || peek() === "{" ? primary() : power());
  function primary() {
    const c = peek();
    if (c === "(") { i += 1; const v = expr(); if (!eat(")")) fail(") expected"); return v; }
    if (c === "{") { i += 1; const v = expr(); if (!eat("}")) fail("} expected"); return v; }
    if (c === "e") { i += 1; return A.cnst("e"); }
    if (c === "\\") {
      const k = cmd();
      if (k === "\\frac") { i += k.length; const a = arg(); const b = arg(); return A.div(a, b); }
      if (k === "\\sqrt") {
        i += k.length;
        let n = null;
        if (eat("[")) { n = expr(); if (!eat("]")) fail("] expected"); }
        return A.root(arg(), n);
      }
      if (k === "\\pi") { i += k.length; return A.cnst("pi"); }
      if (k === "\\gamma") { i += k.length; if (peek() === "_") fail("subscripted gamma is not Euler's constant"); return A.cnst("gamma"); }
      if (k === "\\log") {
        i += k.length;
        if (eat("_")) { const b = arg(); return A.log(funcArg(), b); }
        return A.log(funcArg(), null);
      }
      if (["\\ln", "\\exp", "\\sin", "\\cos", "\\tan", "\\sinh", "\\cosh"].includes(k)) { i += k.length; return A.fn(k.slice(1), funcArg()); }
      return fail(`unsupported command ${k}`);
    }
    if (/[0-9.]/.test(c)) return number();
    return fail(`unexpected ${c}`);
  }
  function power() {
    const base = primary();
    if (eat("^")) return A.pow(base, arg());
    return base;
  }
  function unary() {
    if (eat("-")) return A.neg(unary());
    if (eat("+")) return unary();
    return power();
  }
  function term() {
    let v = unary();
    for (;;) {
      if (eat("*")) v = A.mul(v, unary());
      else if (eat("/")) v = A.div(v, unary());
      else if (startsPrimary()) v = A.mul(v, power());
      else return v;
    }
  }
  function expr() {
    let v = term();
    for (;;) {
      if (eat("+")) v = A.add(v, term());
      else if (eat("-")) v = A.sub(v, term());
      else return v;
    }
  }
  const v = expr();
  if (i !== s.length) fail("trailing input");
  return v;
}

// Exact arithmetic: anything irrational throws, so a rational form is never approximated.
const RATIONAL = {
  lit: (t) => fracOfText(t),
  add: fadd, sub: fsub, mul: fmul, div: fdiv,
  neg: (a) => frac(-a.n, a.d),
  pow: (a, b) => {
    if (b.d !== 1n || babs(b.n) > 64n) throw new Error("non-integer or large exponent");
    let r = frac(1n);
    for (let k = 0n; k < babs(b.n); k++) r = fmul(r, a);
    return b.n < 0n ? fdiv(frac(1n), r) : r;
  },
  root: () => { throw new Error("irrational"); },
  cnst: () => { throw new Error("irrational"); },
  log: () => { throw new Error("irrational"); },
  fn: () => { throw new Error("irrational"); },
};
export function evaluateRational(src) { return parseWith(src, RATIONAL); }

// Floating point, recording the largest magnitude any intermediate reached and the number of steps,
// which together bound the accumulated rounding error.
function floatArith(bareLog, st) {
  const rec = (...vs) => { for (const v of vs) { if (!Number.isFinite(v)) throw new Error("not finite"); st.max = Math.max(st.max, Math.abs(v)); } st.ops += 1; return vs[vs.length - 1]; };
  const fns = { ln: Math.log, exp: Math.exp, sin: Math.sin, cos: Math.cos, tan: Math.tan, sinh: Math.sinh, cosh: Math.cosh };
  return {
    lit: (t) => {
      if (t.replace(/^0*\.?0*/, "").replace(".", "").length > MAX_FLOAT_SIG) throw new Error("literal carries more digits than double precision holds");
      return rec(Number(t));
    },
    add: (a, b) => rec(a, b, a + b), sub: (a, b) => rec(a, b, a - b), mul: (a, b) => rec(a, b, a * b), div: (a, b) => rec(a, b, a / b),
    neg: (a) => -a,
    pow: (a, b) => rec(a, b, Math.pow(a, b)),
    root: (v, n) => rec(v, n === null ? Math.sqrt(v) : Math.pow(v, 1 / n)),
    cnst: (k) => rec(k === "e" ? Math.E : k === "pi" ? Math.PI : EULER_GAMMA),
    log: (v, b) => rec(v, b === null ? bareLog(v) : Math.log(v) / Math.log(b)),
    fn: (k, v) => rec(v, fns[k](v)),
  };
}
export function evaluateFloat(src, bareLog = Math.log) {
  const st = { max: 0, ops: 0 };
  const x = parseWith(src, floatArith(bareLog, st));
  // Each step contributes at most a few ulps of the largest magnitude involved (Math functions are
  // allowed several); 64 per step is a deliberately generous margin.
  return { x, err: 64 * Number.EPSILON * Math.max(st.max, Math.abs(x)) * (st.ops + 1) };
}

// The exact value of a form as an interval [lo, hi] of exact fractions; throws if unreadable.
export function exactInterval(src) {
  try { const f = evaluateRational(src); return { lo: f, hi: f, rational: true }; } catch { /* irrational or unreadable */ }
  const a = evaluateFloat(src, Math.log);
  let err = a.err;
  if (/\\log(?!_)/.test(normalise(src))) {
    const b = evaluateFloat(src, Math.log10);
    if (Math.abs(a.x - b.x) > a.err + b.err) throw new Error("bare \\log whose value depends on the base");
    err = Math.max(a.err, b.err);
  }
  err += 4 * Number.EPSILON * Math.abs(a.x); // the conversion of the bounds themselves
  return { lo: fracOfNum(a.x - err), hi: fracOfNum(a.x + err), rational: false, x: a.x };
}

// ---------- printed decimals ----------
const DOTS = /(\\dots|\\ldots|…|\.\.\.)$/;
// "1058.565", "0.7853981633\dots", "-0.53" → { text, f (exact), ulp (exact), places, dots }.
export function parseDecimal(raw) {
  let t = raw.replace(/\$/g, "").replace(/\\\*|\^\\?\*|\*/g, "").replace(/\\[!,;: ]/g, "").replace(/\s+/g, "");
  const dots = DOTS.test(t);
  t = t.replace(DOTS, "");
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const places = t.includes(".") ? t.split(".")[1].length : 0;
  return { text: t, f: fracOfText(t), ulp: frac(1n, pow10(places)), places, dots };
}
// The values a decimal followed by … may stand for: its truncation, digits continuing away from zero.
const truncOf = (dec) => (dec.text.startsWith("-") ? { lo: fsub(dec.f, dec.ulp), hi: dec.f } : { lo: dec.f, hi: fadd(dec.f, dec.ulp) });
// The values a printed approximation stands for: its rounding, and with … also its truncation (13b:23
// prints π/4 as 0.7853981634…, a rounding written with dots).
function windowOf(dec) {
  const half = frac(dec.ulp.n, dec.ulp.d * 2n);
  const r = { lo: fsub(dec.f, half), hi: fadd(dec.f, half) };
  if (!dec.dots) return r;
  const t = truncOf(dec);
  return { lo: fmin(r.lo, t.lo), hi: fmax(r.hi, t.hi) };
}

// The one decision every population uses. X = { lo, hi } (null = unbounded on that side).
export function decide(dir, dec, X, marked) {
  const safe = dir === "U" ? X.hi !== null && fcmp(dec.f, X.hi) >= 0 : X.lo !== null && fcmp(dec.f, X.lo) <= 0;
  if (safe) return { cls: "AGREES", why: "on the safe side of every value the exact form allows" };
  const surelyOver = dir === "U" ? X.lo !== null && fcmp(dec.f, X.lo) < 0 : X.hi !== null && fcmp(dec.f, X.hi) > 0;
  if (marked) {
    const W = windowOf(dec);
    const inside = X.lo !== null && X.hi !== null && fcmp(X.lo, W.lo) >= 0 && fcmp(X.hi, W.hi) <= 0;
    if (inside) return { cls: "AGREES", why: "past the exact value, but marked approximate and the exact value lies within its rounding" };
    const apart = (X.hi !== null && fcmp(X.hi, W.lo) < 0) || (X.lo !== null && fcmp(X.lo, W.hi) > 0);
    if (apart && surelyOver) return { cls: "CUT", why: "marked approximate but outside the rounding (or truncation) of its last printed place" };
    return { cls: "UNKNOWN", why: "the exact value straddles the edge of the printed decimal's rounding" };
  }
  if (surelyOver) return { cls: "CUT", why: dir === "U" ? "printed below the exact value, with no mark that it is rounded" : "printed above the exact value, with no mark that it is rounded" };
  return { cls: "UNKNOWN", why: "too close to the exact value to decide either way" };
}

export function cellsOf(rowText) {
  const t = rowText.trim();
  const parts = t.replace(/\\\|/g, "\u0000").split("|").map((p) => p.replace(/\u0000/g, "\\|"));
  // The trailing pipe is optional in GFM; drop the empty element only when it is there (Codex r1 #8).
  const end = /(^|[^\\])\|$/.test(t) ? -1 : undefined;
  return { value: (parts[1] ?? "").trim(), comments: parts.slice(3, end).join("|").trim() };
}

// ---------- IN-CELL ----------
// IN-CELL claims less (orchestrator answer to consult 1174368e, option A): NO floating-point verdicts.
// Membership is broad: any value cell holding a decimal that is not itself a plain decimal. Only the
// FIRST form is read, and intermediate decimals never narrow it (Codex r3 #2). A rational first form is
// decided exactly; an irrational one is EXACT SHOWN when the cell marks the decimal approximate (the
// reader sees the exact form beside it; not judged) and UNKNOWN beside a bare =. Everything else a
// member does is UNKNOWN.
export function inCell(dir, value) {
  // `$0.75806746$ (exact $37903373/50000000$)` (4b) names its exact form explicitly.
  const ex = /^\$([^$]+)\$\s*\(exact\s*\$([^$]+)\$\)\s*$/.exec(value.trim());
  const body = ex ? `${ex[2]}=${ex[1]}` : value.replace(/\$/g, "");
  if (!/\d\.\d/.test(body) || parseDecimal(value)) return null;
  const base = { pop: "IN-CELL", dir, cell: value };
  const seps = [...body.matchAll(/\\approx|≈|=/g)];
  const last = seps[seps.length - 1];
  const dec = last ? parseDecimal(body.slice(last.index + last[0].length)) : null;
  if (!dec) return { ...base, printed: value, cls: "UNKNOWN", why: "no ≈ or = before a final decimal, so there is no printed value to judge" };
  const printed = dec.text + (dec.dots ? "…" : "");
  // A leading label ("C_{20b}\ge 1/e") is read from its last relation onward; \le must not match the
  // start of \left.
  const first = body.slice(0, seps[0].index).split(/\\(?:geq?|leq?)(?![A-Za-z])|:|<|>|≤|≥/).pop();
  const marked = !ex && (last[0] !== "=" || dec.dots);
  let f = null;
  try { f = evaluateRational(first); } catch { /* not rational, or unreadable */ }
  if (f) { const X = { lo: f, hi: f }; return { ...base, printed, X, ...decide(dir, dec, X, marked) }; }
  // Readable means the parser accepts the whole form (a symbol like c_0 or \delta is not); the float
  // value is never used as a verdict here.
  let readable = false;
  try { exactInterval(first); readable = true; } catch { /* a symbol, an unsupported command, a base-dependent log */ }
  if (readable && marked) return { ...base, printed, cls: "SHOWN", why: "an irrational exact form printed beside a decimal marked approximate; the reader sees both, and it is not judged" };
  return { ...base, printed, cls: "UNKNOWN", why: readable ? "an irrational form beside a bare =, which this census does not decide in floating point" : "the first form is not one this reader evaluates" };
}

// ---------- COMMENT ----------
// `$` is stripped first so a relation written outside the math (`> $1.23456$`) stays attached to its
// number (Codex r2 #7).
const COMMENT_NUM = /(<|>|\\(?:leq?|geq?)(?![A-Za-z])|≤|≥|=|\\approx|≈)?\s*(-?\d+\.\d+)\s*(\\dots|\\ldots|…|\.\.\.)?/g;
export function fromComment(dir, value, comments) {
  const d = parseDecimal(value);
  // An integer cell is not a rounded decimal (85a's "1" beside a comment's 0.1 matched to the unit).
  if (!d || d.places < 1) return null;
  const hits = [];
  // LaTeX spacing between a relation and its number is stripped too (Codex r3 #4: `> \,1.23456`).
  const plain = comments.replace(/\$/g, "").replace(/\\(?:quad|qquad|[,;:! ])|~/g, " ");
  for (const m of plain.matchAll(COMMENT_NUM)) {
    const c = parseDecimal(m[2] + (m[3] ?? ""));
    if (!c || c.places <= d.places) continue;
    const gap = fsub(c.f, d.f);
    if (fcmp(frac(babs(gap.n), gap.d), d.ulp) > 0) continue;
    hits.push({ rel: (m[1] ?? "").replace(/\\leq?|≤/, "<").replace(/\\geq?|≥/, ">").replace(/\\approx|≈/, "≈"), c });
  }
  if (!hits.length) return null;
  const base = { pop: "COMMENT", dir, cell: value, printed: d.text + (d.dots ? "…" : "") };
  const verdicts = hits.map(({ rel, c }) => {
    const said = `${rel ? rel + " " : ""}${c.text}${c.dots ? "…" : ""}`;
    const t = c.dots ? truncOf(c) : { lo: c.f, hi: c.f };
    const X = rel === "<" ? { lo: null, hi: t.hi } : rel === ">" ? { lo: t.lo, hi: null } : rel === "≈" ? windowOf(c) : t;
    return { said, X, ...decide(dir, d, X, d.dots) };
  });
  const pick = verdicts.find((v) => v.cls === "CUT") ?? verdicts.find((v) => v.cls === "UNKNOWN") ?? verdicts[0];
  return { ...base, ...pick };
}

// ---------- SOURCE ----------
export function fromSource(entry, audit, lines, dirAt) {
  const base = { pop: "SOURCE", id: entry.auditId };
  for (const k of ["auditId", "quote", "quoteField"]) {
    if (typeof entry[k] !== "string" || !entry[k].trim()) return { ...base, refuse: `field ${k} missing` };
  }
  const has = (k) => typeof entry[k] === "string" && entry[k].trim() !== "";
  if (!has("exact") && !has("sourceDecimal")) return { ...base, refuse: "neither exact nor sourceDecimal is given" };
  if (!audit) return { ...base, refuse: "no such entry in continuity/depth-audit.json" };
  if (audit.leg !== "value-vs-source") return { ...base, refuse: "the entry is not on the value-vs-source leg" };
  if (typeof audit[entry.quoteField] !== "string" || !audit[entry.quoteField].includes(entry.quote)) return { ...base, refuse: `the quotation is no longer in the entry's ${entry.quoteField}` };
  // A source closed form the evaluator cannot read (an infinite sum) is still a FOUND member, classified
  // UNKNOWN, never counted among entries with no exact value on record (Codex r1 #10).
  if (entry.evaluable !== undefined && typeof entry.evaluable !== "boolean") return { ...base, refuse: "evaluable must be true or false" };
  const unevaluable = entry.evaluable === false;
  if (unevaluable && !has("exact")) return { ...base, refuse: "an unevaluable entry must still state its exact form" };
  // Verdicts come from exact rationals only (option A): a rational closed form, or the source's own
  // decimal. An irrational closed form is evaluated in floating point ONLY to cross-check the decimal,
  // and a disagreement REFUSES; with no decimal beside it, the entry is UNKNOWN.
  let X = null;
  let irrational = false;
  let rationalForm = null;
  if (has("exact") && !unevaluable) {
    try { rationalForm = evaluateRational(entry.exact); X = { lo: rationalForm, hi: rationalForm }; } catch { irrational = true; }
  }
  if (has("sourceDecimal")) {
    const sd = parseDecimal(entry.sourceDecimal);
    if (!sd) return { ...base, refuse: "sourceDecimal is not a decimal" };
    const W = windowOf(sd);
    let C = X;
    if (irrational) {
      try { const iv = exactInterval(entry.exact); C = { lo: iv.lo, hi: iv.hi }; } catch (e) { return { ...base, refuse: `exact form not evaluable (${e.message})` }; }
    }
    if (C && (fcmp(C.hi, W.lo) < 0 || fcmp(C.lo, W.hi) > 0)) return { ...base, refuse: `the closed form (about ${fmt(C.lo)}) and sourceDecimal ${entry.sourceDecimal} disagree` };
    if (!rationalForm && !unevaluable) X = sd.dots ? truncOf(sd) : { lo: sd.f, hi: sd.f };
  } else if (irrational) {
    try { exactInterval(entry.exact); } catch (e) { return { ...base, refuse: `exact form not evaluable (${e.message})` }; }
  }
  const at = lines?.[audit.rowLine - 1];
  const file = audit.rowFile.split("/").pop();
  const where = { file, line: audit.rowLine, printed: String(audit.rowText ?? ""), exactText: has("exact") ? entry.exact : entry.sourceDecimal };
  if (!at || at.trim() !== String(audit.rowText).trim()) return { ...base, ...where, cls: "UNKNOWN", why: "the audited row is no longer at its recorded line (see check-audit-lines)" };
  const dir = dirAt(audit.rowLine);
  if (!dir) return { ...base, ...where, cls: "UNKNOWN", why: "the recorded line is not a bound row" };
  const value = cellsOf(at).value;
  const d = parseDecimal(value);
  const r = { ...base, ...where, dir, cell: value, printed: d ? d.text + (d.dots ? "…" : "") : value, X, exactText: has("exact") ? entry.exact : entry.sourceDecimal };
  if (unevaluable) return { ...r, cls: "UNKNOWN", why: "the source's closed form is one this evaluator does not read" };
  if (!d) return { ...r, cls: "UNKNOWN", why: "the value cell is not a plain decimal" };
  if (!X) return { ...r, cls: "UNKNOWN", why: "an irrational closed form with no source decimal beside it, which this census does not decide in floating point" };
  return { ...r, ...decide(dir, d, X, d.dots) };
}

// ONE closed rule for tables the shared parser cannot see (Codex r2 #6 and r3 #3 were two shapes of the
// same gap, so this replaces shape patterns): in a bounds section, outside HTML comments and `$$…$$`
// display math, every line holding an unescaped pipe must be a data row boundRowsOf returned, or the
// header or separator of a table it read (a "|"-led line directly above a "|"-led separator, and that
// separator). Any other piped line refuses the run. Its failure mode is a refusal, never a silent drop.
const SEPARATOR = /^\|[\s:|-]*-[\s:|-]*\|?$/;
export function unconsumedPipeLines(text, rowLines) {
  const lines = text.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " ")).split(/\r?\n/).map((l) => l.trim());
  const rows = new Set(rowLines);
  const out = [];
  let inBounds = false;
  let inMath = false;
  lines.forEach((t, i) => {
    if (/^## /.test(t)) { inBounds = /^## Known (upper|lower) bounds\s*$/.test(t); inMath = false; return; }
    if (!inBounds) return;
    // A line opening or closing display math toggles it; one that holds both delimiters does not.
    const fences = (t.match(/\$\$/g) || []).length;
    if (fences % 2 === 1) { inMath = !inMath; return; }
    // A one-line `$$ … $$` is math, not a row.
    if (inMath || !/(^|[^\\])\|/.test(t.replace(/\$\$[\s\S]*?\$\$/g, ""))) return;
    if (rows.has(i + 1)) return;
    const isSep = SEPARATOR.test(t) && i > 0 && lines[i - 1].startsWith("|");
    const isHeader = t.startsWith("|") && i + 1 < lines.length && SEPARATOR.test(lines[i + 1]);
    if (!isSep && !isHeader) out.push(i + 1);
  });
  return out;
}

// ---------- run ----------
export function run(root) {
  const out = [];
  const cdir = join(root, ...MIRROR);
  let files;
  try { files = readdirSync(cdir).filter((f) => f.endsWith(".md")).sort(); } catch { files = []; }
  const texts = new Map();
  const rows = [];
  for (const f of files) {
    let t;
    try { t = readFileSync(join(cdir, f), "utf8"); } catch {
      out.push(`decimal-vs-exact: REFUSED — ${f} could not be read; a skipped file would leave its rows uncounted`);
      return { code: 2, out };
    }
    texts.set(f, t);
    for (const r of boundRowsOf(t).rows) rows.push({ ...r, file: f });
  }
  if (!rows.length) {
    out.push(`decimal-vs-exact: REFUSED — no bound rows read from ${MIRROR.join("/")}, so any count would mean nothing`);
    return { code: 2, out };
  }
  // The corpus guards `depth-audit.mjs --corpus` applies, so a row this parser cannot see refuses the
  // run instead of vanishing from both the members and the "not looked at" count (Codex r1 #3). (Its
  // 87a row-count control is not applied: a scratch tree for a red-arm need not carry 87a.)
  let corpus;
  try {
    const man = JSON.parse(readFileSync(join(cdir, "..", "manifest.json"), "utf8"));
    const expectedFiles = Number.isFinite(man.fileCount) ? man.fileCount - (man.rootFiles?.length ?? 0) : null;
    const expectedSections = expectedSectionsFromClaims(join(root, "ledger", "claims.json"));
    corpus = countCorpus(cdir, { expectedFiles, expectedSections: expectedSections.size ? expectedSections : null });
  } catch {
    out.push("decimal-vs-exact: REFUSED — a mirror file, the mirror manifest or ledger/claims.json could not be read, so the corpus could not be established");
    return { code: 2, out };
  }
  const rowLinesOf = new Map();
  for (const r of rows) { if (!rowLinesOf.has(r.file)) rowLinesOf.set(r.file, []); rowLinesOf.get(r.file).push(r.line); }
  const pipeless = [...texts].flatMap(([f, t]) => unconsumedPipeLines(t, rowLinesOf.get(f) ?? []).map((n) => `${f}:${n}`));
  const why = corpus.expectedFiles == null ? "the mirror manifest gives no file count"
    : corpus.files !== corpus.expectedFiles ? `${corpus.files} constant file(s) read, the manifest says ${corpus.expectedFiles}`
    : corpus.expectedSections == null ? "ledger/claims.json gives no section baseline"
    : corpus.unparseableRows.length ? `${corpus.unparseableRows.length} line(s) inside a bounds table that this parser drops`
    : pipeless.length ? `${pipeless.length} line(s) holding a pipe in a bounds section are not a row, header or separator the parser read (${pipeless.slice(0, 3).join(", ")})`
    : corpus.missingSections.length ? `${corpus.missingSections.length} expected section(s) produced no rows (${corpus.missingSections.slice(0, 3).join(", ")})`
    : corpus.zeroRowFiles.length ? `${corpus.zeroRowFiles.length} file(s) contributed no bound rows`
    : corpus.boundRows !== rows.length ? `the corpus counts ${corpus.boundRows} bound rows and this census read ${rows.length}`
    : null;
  if (why) { out.push(`decimal-vs-exact: REFUSED — ${why}; a row this census cannot see must not read as not looked at`); return { code: 2, out }; }
  const members = [];
  for (const r of rows) {
    const { value, comments } = cellsOf(r.text);
    const a = inCell(r.dir, value);
    if (a) members.push({ ...a, file: r.file, line: r.line });
    const b = fromComment(r.dir, value, comments);
    if (b) members.push({ ...b, file: r.file, line: r.line });
  }
  let audits;
  let table;
  try { audits = JSON.parse(readFileSync(join(root, "continuity", "depth-audit.json"), "utf8")).audits; } catch { audits = null; }
  try { table = JSON.parse(readFileSync(join(root, "ledger", "source-exact-values.json"), "utf8")); } catch { table = null; }
  if (!Array.isArray(audits)) { out.push("decimal-vs-exact: REFUSED — continuity/depth-audit.json could not be read"); return { code: 2, out }; }
  if (!table || !Array.isArray(table.entries)) { out.push("decimal-vs-exact: REFUSED — ledger/source-exact-values.json could not be read or holds no entries array"); return { code: 2, out }; }
  const byId = new Map(audits.map((a) => [a?.id, a]));
  const vvs = audits.filter((a) => a?.leg === "value-vs-source");
  const refusals = [];
  const seen = new Set();
  for (const e of table.entries) {
    if (seen.has(e?.auditId)) { refusals.push(`${e.auditId}: listed twice`); continue; }
    seen.add(e?.auditId);
    const audit = byId.get(e?.auditId);
    const file = audit?.rowFile?.split("/").pop();
    const t = file ? texts.get(file) : undefined;
    const lines = t ? t.split(/\r?\n/) : null;
    const dirs = t ? new Map(boundRowsOf(t).rows.map((r) => [r.line, r.dir])) : new Map();
    const m = fromSource(e ?? {}, audit, lines, (n) => dirs.get(n));
    if (m.refuse) refusals.push(`${m.id ?? "(no id)"}: ${m.refuse}`);
    else members.push(m);
  }
  if (refusals.length) {
    for (const x of refusals) out.push(`REFUSED    SOURCE ${x}`);
    out.push(`decimal-vs-exact: REFUSED — ${refusals.length} entr${refusals.length === 1 ? "y" : "ies"} in ledger/source-exact-values.json could not be checked`);
    return { code: 2, out };
  }
  const dirWord = (d) => (d === "U" ? "upper" : "lower");
  const range = (X) => (!X ? "" : X.lo && X.hi && fcmp(X.lo, X.hi) === 0 ? `= ${fmt(X.lo)}` : `in [${fmt(X.lo)}, ${fmt(X.hi)}]`);
  for (const m of members) {
    const loc = `${m.file}:${m.line} ${dirWord(m.dir)}`;
    const detail = m.pop === "COMMENT"
      ? `prints ${m.printed}; comment says ${m.said}`
      : m.pop === "SOURCE"
        ? `prints ${m.printed}; source states ${m.exactText}${m.X ? ` (${range(m.X)})` : ""}`
        : `prints ${m.printed}${m.X ? `; exact ${range(m.X)}` : ""}`;
    out.push(`${m.cls.padEnd(8)} ${m.pop.padEnd(8)} ${m.id ? m.id + " " : ""}${loc} — ${detail} — ${m.why}`);
  }
  const tally = (pop) => {
    const ms = members.filter((m) => m.pop === pop);
    const c = (k) => ms.filter((m) => m.cls === k).length;
    return { n: ms.length, AGREES: c("AGREES"), CUT: c("CUT"), UNKNOWN: c("UNKNOWN"), SHOWN: c("SHOWN") };
  };
  const A = tally("IN-CELL"), B = tally("COMMENT"), C = tally("SOURCE");
  // Coverage counts only members sitting on a CURRENT bound row; a stale SOURCE location is reported
  // above but covers nothing (Codex r3 #6: it once drove "not looked at" negative).
  const current = new Set(rows.map((r) => `${r.file}:${r.line}`));
  const keyed = new Set(members.map((m) => `${m.file}:${m.line}`).filter((k) => current.has(k)));
  out.push(`search space: ${rows.length} bound row(s) across ${texts.size} file(s) of ${MIRROR.join("/")} (depth-audit.mjs boundRowsOf, the --corpus definition)`);
  out.push(`IN-CELL  (a value cell holding a decimal that is not a plain decimal; only a rational first form is decided): ${A.n} found, ${A.AGREES + A.CUT} decided — ${A.AGREES} agree, ${A.CUT} cut against the exact value, ${A.SHOWN} exact form shown beside a decimal marked approximate (not judged), ${A.UNKNOWN} unknown`);
  out.push(`COMMENT  (a bare decimal whose Comments cell prints a longer decimal agreeing to its last place): ${B.n} found, ${B.AGREES + B.CUT} decided — ${B.AGREES} agree, ${B.CUT} cut, ${B.UNKNOWN} unknown`);
  out.push(`SOURCE   (ledger/source-exact-values.json, keyed to depth-audit entries): ${C.n} listed, ${C.AGREES + C.CUT} decided — ${C.AGREES} agree, ${C.CUT} cut against the source, ${C.UNKNOWN} unknown; drawn from ${vvs.length} value-vs-source entr${vvs.length === 1 ? "y" : "ies"}, the other ${vvs.length - C.n} carry no exact value on record (${Array.isArray(table.notEntered) ? table.notEntered.length : 0} of them considered and not entered, each with its reason in the table)`);
  out.push(`not looked at: ${rows.length - keyed.size} of ${rows.length} bound row(s) are in none of the three populations — UNKNOWN by construction, never counted as agreeing`);
  const cuts = A.CUT + B.CUT + C.CUT;
  out.push(cuts
    ? `RESULT: CUT — ${cuts} member(s) print a decimal past the exact value in the overstating direction; each is a question for upstream about display convention, through the outward gate (exit 1)`
    : `RESULT: PASS — no member is cut against its exact value; the unknowns and the rows not looked at stay open (exit 0)`);
  return { code: cuts ? 1 : 0, out };
}

// ---------- selftest ----------
function selftest() {
  let fail = 0;
  const eq = (name, got, want) => { if (!(Math.abs(got - want) <= 1e-12 * Math.max(1, Math.abs(want)))) { fail++; console.log(`FAIL ${name}: ${got} != ${want}`); } };
  const throws = (name, fn) => { try { fn(); fail++; console.log(`FAIL ${name}: did not throw`); } catch { /* expected */ } };
  const fl = (s) => evaluateFloat(s).x;
  eq("4√70035", fl("4\\sqrt{70035}"), 4 * Math.sqrt(70035));
  eq("unicode 4√70035", fl("4√70035"), 4 * Math.sqrt(70035));
  eq("\\dfrac{\\pi}{2\\ln(1+\\sqrt{2})}", fl("\\dfrac{\\pi}{2\\ln(1+\\sqrt{2})}"), Math.PI / (2 * Math.log(1 + Math.SQRT2)));
  eq("\\tfrac{5\\sqrt2}{4}", fl("\\tfrac{5\\sqrt2}{4}"), 5 * Math.SQRT2 / 4);
  eq("\\log_{70} 143640", fl("\\log_{70} 143640"), Math.log(143640) / Math.log(70));
  eq("3 \\log_{12} 10", fl("3 \\log_{12} 10"), 3 * Math.log(10) / Math.log(12));
  eq("e^{1-\\gamma}", fl("e^{1-\\gamma}"), Math.exp(1 - EULER_GAMMA));
  eq("4 e^{-0.14/e}", fl("4 e^{-0.14/e}"), 4 * Math.exp(-0.14 / Math.E));
  eq("134753^{1/10}", fl("134753^{1/10}"), Math.pow(134753, 0.1));
  eq("\\frac{13524e-7359}{9451e-3286}", fl("\\frac{13524e-7359}{9451e-3286}"), (13524 * Math.E - 7359) / (9451 * Math.E - 3286));
  eq("\\left(\\frac{4\\pi}{11}\\right)^{3/4}", fl("\\left(\\frac{4\\pi}{11}\\right)^{3/4}"), Math.pow(4 * Math.PI / 11, 0.75));
  eq("\\sqrt{4-\\sqrt{15}}", fl("\\sqrt{4-\\sqrt{15}}"), Math.sqrt(4 - Math.sqrt(15)));
  eq("2\\pi+2", fl("2\\pi+2"), 2 * Math.PI + 2);
  const r = (s) => evaluateRational(s);
  if (fcmp(r("\\frac12"), frac(1n, 2n)) !== 0) { fail++; console.log("FAIL rational \\frac12"); }
  if (fcmp(r("4-2^{-7}"), frac(511n, 128n)) !== 0) { fail++; console.log("FAIL rational 4-2^{-7}"); }
  if (fcmp(r("10000000000000+1/10000-10000000000000"), frac(1n, 10000n)) !== 0) { fail++; console.log("FAIL rational cancellation"); }
  throws("rational refuses √", () => r("\\sqrt2"));
  throws("bare \\log depending on base", () => exactInterval("\\frac12\\log(2)"));
  throws("\\Gamma refused", () => exactInterval("\\Gamma(1/3)"));
  throws("subscripted gamma refused", () => exactInterval("2/\\log \\gamma_{1}"));
  throws("a letter refused", () => exactInterval("\\pi/2-\\delta"));
  throws("\\sum refused", () => exactInterval("\\sum_{k=1}^{\\infty}2^{-k}"));
  throws("a long float literal refused", () => evaluateFloat("\\sqrt{10000000000000001}"));
  // Cancellation widens the float interval instead of producing a confident wrong number (Codex r2 #2).
  const canc = exactInterval("\\sqrt{10000000000000}+1/10000-\\sqrt{10000000000000}");
  if (!(fcmp(canc.lo, frac(1n, 10000n)) <= 0 && fcmp(canc.hi, frac(1n, 10000n)) >= 0)) { fail++; console.log(`FAIL a cancelling float form's interval must contain the true value: [${fmt(canc.lo)}, ${fmt(canc.hi)}]`); }

  const cls = (name, got, want) => { if ((got?.cls ?? null) !== want) { fail++; console.log(`FAIL ${name}: ${got?.cls ?? "not a member"} (want ${want ?? "not a member"}) ${got?.why ?? ""}`); } };
  // IN-CELL
  cls("upper ≈ beside an irrational form is SHOWN", inCell("U", "$\\pi/2 \\approx 1.57080$"), "SHOWN");
  cls("= with … beside an irrational form is SHOWN", inCell("U", "$\\frac{\\pi}{4}=0.7853981633\\dots$"), "SHOWN");
  cls("lower ≈ beside √2 is SHOWN", inCell("L", "$\\sqrt{2}\\approx 1.414214$"), "SHOWN");
  cls("an irrational form beside a bare = is not decided", inCell("U", "$\\frac{\\pi}{4}=0.785$"), "UNKNOWN");
 cls("a rational form printed = past it is CUT", inCell("L", "$\\frac{7}{5} = 1.4001$"), "CUT");
  cls("exact rational equality", inCell("U", "$\\frac{13}{4}=3.25$"), "AGREES");
  cls("exact rational equality, lower", inCell("L", "$4 - 2^{-7} = 4 - \\frac{1}{128} = 3.9921875$"), "AGREES");
  cls("unreadable expression", inCell("U", "$\\pi/2-\\delta$ with $\\delta\\approx 0.00013$"), "UNKNOWN");
  cls("an expression with no separator is an UNKNOWN member", inCell("U", "$0.92117 - \\frac{9}{16} 10^{-6}$"), "UNKNOWN");
  cls("bare decimal is not a member", inCell("U", "$1058.565$"), null);
  cls("scientific notation is a member, UNKNOWN", inCell("L", "$-5.895 \\cdot 10 ^ {-9}$"), "UNKNOWN");
  cls("an unverified marker is not an exact form", inCell("U", "$1.7813^\\*$"), null);
  cls("\\le before a decimal is a member, UNKNOWN", inCell("U", "$$\\le 0.844137708436$$"), "UNKNOWN");
 cls("a labelled expression is read after its relation", inCell("L", "$C_{20b}\\ge 1/e \\approx 0.367879$"), "SHOWN");
  cls("\\left is not read as \\le", inCell("L", "$\\left(\\frac{4\\pi}{11}\\right)^{3/4}\\approx 1.105$"), "SHOWN");
 cls("only the first of two forms is read", inCell("L", "$5/\\sqrt{8}=\\tfrac{5\\sqrt2}{4}\\approx 1.767767$"), "SHOWN");
  cls("a rational rounding written with … agrees", inCell("L", "$\\frac{1}{3}=0.3333\\dots$"), "AGREES");
  cls("(exact …) after a decimal is read", inCell("L", "$0.75806746$ (exact $37903373/50000000$)"), "AGREES");
  cls("an irrational form printed = to full float precision is UNKNOWN, not AGREES", inCell("U", `$\\sqrt{2}=${Math.SQRT2}$`), "UNKNOWN");
  // Codex round 1 (2026-10-21), one fixture per finding, each the reviewer's own scenario.
  cls("r1#2 a 1e-13 cut is not swallowed", inCell("U", "$10000000000001/10000000000000 = 1.0$"), "CUT");
  cls("r1#4 an irrational form beside a bare = is not decided", inCell("U", "$4√70035 = 500.0$"), "UNKNOWN");
  cls("r1#5 a long literal is read exactly", inCell("U", "$\\frac{10000000000000001-10000000000000000}{10}=0.0$"), "CUT");
  cls("r1#9 1/e beside a bare = is a member, UNKNOWN", inCell("L", "$1/e = 0.4$"), "UNKNOWN");
  // Codex round 2.
  cls("r2#1 a cut near zero is not swallowed", inCell("U", "$1/10^{14}=0.000000000000009$"), "CUT");
  cls("r2#2 cancellation is exact on the rational path", inCell("U", "$10000000000000+1/10000-10000000000000=0.0$"), "CUT");
  cls("r2#5 an explicit (exact …) is always a member", inCell("U", "$3.9$ (exact $2+2$)"), "CUT");
  // Codex round 3, red first (the A shape, orchestrator answer to consult 1174368e).
  cls("r3#1 an irrational form beside a bare = is UNKNOWN", inCell("U", "$\\frac{\\ln(1+10^{-16})}{10^{-16}}=0.1$"), "UNKNOWN");
  cls("r3#2 an intermediate decimal never narrows the first form", inCell("U", "$\\sqrt{2}=1.414213562373095=1.414213562373095$"), "UNKNOWN");
  cls("r3#2 an unreadable first form is not skipped", inCell("U", "$\\binom{4}{2}=5.0=5.0$"), "UNKNOWN");
  cls("r3#5 implicit multiplication is a member and decided exactly", inCell("U", "$2(3)=5.9$"), "CUT");
  cls("an irrational form beside ≈ is EXACT SHOWN, not judged", inCell("U", "$\\pi/2 \\approx 1.5$"), "SHOWN");
  cls("a symbol beside ≈ is UNKNOWN, not SHOWN", inCell("U", "$c_0^2 \\approx 5.33386$"), "UNKNOWN");
  cls("any non-plain cell with a decimal is a member", inCell("U", "$\\approx 2.15627$"), "UNKNOWN");
  cls("r3#4 LaTeX spacing does not detach a relation", fromComment("U", "$1.235$", "$> \\,1.23456$"), "UNKNOWN");
  // COMMENT — the manager's two 87a examples are the positive controls.
  cls("87a:19 < 913.4927", fromComment("U", "$913.493$", "root discriminant $< 913.4927$."), "AGREES");
  cls("87a:20 < 857.5662…", fromComment("U", "$857.567$", "rd $< 770.6432$, giving $< 857.5662\\dots$ — a saving"), "AGREES");
  cls("upper below a stated equal value", fromComment("U", "$1.234$", "equals $1.23456\\dots$"), "CUT");
  cls("upper below a < bound cannot decide", fromComment("U", "$1.234$", "is $< 1.2345$"), "UNKNOWN");
  cls("lower above a stated value", fromComment("L", "$2.346$", "gives $2.34567$"), "CUT");
  cls("a comment number that does not agree is ignored", fromComment("U", "$857.567$", "rd $< 770.6432$"), null);
  cls("an integer cell is not a member", fromComment("L", "$1$", "a $0.1$ improvement"), null);
  cls("r1#1 an infinite endpoint is never close", fromComment("U", "$1.234$", "$> 1.23456$"), "CUT");
  cls("r1#1 lower mirror", fromComment("L", "$1.235$", "$< 1.23456$"), "CUT");
  cls("r1#6 a negative truncation runs downward", fromComment("L", "$-1.234$", "$-1.2340\\dots$"), "UNKNOWN");
  cls("r1#7 digits past double precision are compared exactly", fromComment("L", "$1.0000000000000001$", "$1.00000000000000001$"), "CUT");
  cls("a long comment decimal agrees exactly", fromComment("U", "$1.5027434868$", "$1.50274348670958337974\\dots$"), "AGREES");
  cls("a long comment decimal still catches a cut", fromComment("U", "$1.5027434867$", "$1.50274348670958337974\\dots$"), "CUT");
  cls("r2#4 a long integer part stays a member", fromComment("U", "$100000000000000.0$", "$100000000000000.01$"), "CUT");
  cls("r2#7 a relation outside the math stays attached", fromComment("U", "$1.235$", "> $1.23456$"), "UNKNOWN");
  const c8a = cellsOf("| $1.234$ | [R] | $1.23456$");
  const c8b = cellsOf("| $1.234$ | [R] | $1.23456$ |");
  if (c8a.comments !== "$1.23456$" || c8b.comments !== "$1.23456$") { fail++; console.log(`FAIL r1#8 trailing pipe: "${c8a.comments}" / "${c8b.comments}"`); }
  cls("r1#8 a row without its trailing pipe keeps its comment", fromComment("U", c8a.value, c8a.comments), "CUT");
  // SOURCE
  const row = "| $1058.565$ | [Mar1978] | x |";
  const audit = { id: "T1", leg: "value-vs-source", rowFile: "ledger/teorth-optimizationproblems/constants/9z.md", rowLine: 3, rowText: row, claimResult: "gives the bound 4√70035 = 1058.565066…, printed" };
  const entry = { auditId: "T1", exact: "4\\sqrt{70035}", sourceDecimal: "1058.565066…", quote: "4√70035 = 1058.565066…", quoteField: "claimResult" };
  const lines = ["# 9z", "", row];
  const up = () => "U";
  cls("87a shape is CUT", fromSource(entry, audit, lines, up), "CUT");
  cls("printed 1058.566 agrees", fromSource(entry, { ...audit, rowText: "| $1058.566$ | [Mar1978] | x |" }, ["# 9z", "", "| $1058.566$ | [Mar1978] | x |"], up), "AGREES");
  cls("as a lower bound it agrees", fromSource(entry, audit, lines, () => "L"), "AGREES");
  cls("a moved row is UNKNOWN", fromSource(entry, audit, ["# 9z", row, ""], up), "UNKNOWN");
  const refuses = (name, m) => { if (!m.refuse) { fail++; console.log(`FAIL ${name}: not refused`); } };
  refuses("a quotation no longer in the record", fromSource({ ...entry, quote: "4√70036" }, audit, lines, up));
  refuses("closed form and decimal disagree", fromSource({ ...entry, sourceDecimal: "1058.5652" }, audit, lines, up));
  refuses("a missing entry", fromSource(entry, undefined, lines, up));
  cls("r1#10 an unevaluable source form is an UNKNOWN member", fromSource({ ...entry, exact: "Σ_{i≥0} 2^i", evaluable: false, sourceDecimal: undefined }, audit, lines, up), "UNKNOWN");
  refuses("an unevaluable entry with no form", fromSource({ ...entry, exact: "", evaluable: false }, audit, lines, up));
  refuses("neither exact nor decimal", fromSource({ ...entry, exact: "", sourceDecimal: "" }, audit, lines, up));
  refuses("a missing quotation", fromSource({ ...entry, quote: "" }, audit, lines, up));
  // A source DECIMAL with no closed form (A-47-0019's shape): 0.380926 against 0.3809268534330870.
  const a19 = { ...audit, rowText: "| $0.380926$ | [H2016] | |", claimResult: "the body 0.3809268534330870" };
  const e19 = { auditId: "T1", sourceDecimal: "0.3809268534330870", quote: "the body 0.3809268534330870", quoteField: "claimResult" };
  cls("upper printed below a source decimal is CUT", fromSource(e19, a19, ["# 9z", "", a19.rowText], up), "CUT");
  cls("upper at a source decimal's rounding-up agrees", fromSource(e19, { ...a19, rowText: "| $0.380927$ | [H2016] | |" }, ["# 9z", "", "| $0.380927$ | [H2016] | |"], up), "AGREES");
  cls("inside a truncated source decimal is UNKNOWN", fromSource({ ...e19, sourceDecimal: "0.38092…", quote: "0.38092" }, { ...a19, rowText: "| $0.380925$ | [H2016] | |" }, ["# 9z", "", "| $0.380925$ | [H2016] | |"], up), "UNKNOWN");
  const aNeg = { ...audit, rowText: "| $-1.3\\dots$ | [N] | |", claimResult: "states -1.24…" };
  cls("r2#3 a … cell is judged against the whole source interval", fromSource({ auditId: "T1", sourceDecimal: "-1.24…", quote: "-1.24…", quoteField: "claimResult" }, aNeg, ["# 9z", "", aNeg.rowText], up), "UNKNOWN");
  // r2#6 / r3#3: one closed rule. A parsed table (header 3, separator 4, row 5) passes; one-line and
  // multi-line display math with |X| passes; the mixed-pipe table (header without a pipe over a separator
  // with one) is refused line by line; piped lines outside the bounds sections are not read.
  const pl = unconsumedPipeLines(["# 9z", "## Known upper bounds", "| A | B | C |", "| - | - | - |", "| 1 | x | |", "", "$$", "\\sigma := \\sup |X| - |Y|", "$$", "$$ |X| = |Y| $$", "Bound | Reference | Comments", "| --- | --- | --- |", "$\\sqrt{2}=1.4$ | [R] | x", "## Additional comments", "a | b", "--- | ---"].join("\n"), [5]);
  if (pl.join(",") !== "11,12,13") { fail++; console.log(`FAIL r3#3 unconsumed piped lines (want 11,12,13): ${pl.join(",")}`); }

  // The whole run on a scratch tree.
  const dir = mkdtempSync(join(tmpdir(), "decimal-vs-exact-"));
  try {
    const cd = join(dir, ...MIRROR);
    mkdirSync(cd, { recursive: true });
    mkdirSync(join(dir, "continuity"), { recursive: true });
    const page = (cell) => ["# 9z", "", "## Known upper bounds", "", "| Bound | Reference | Comments |", "| --- | --- | --- |", `| $${cell}$ | [Mar1978] | x |`, "", "## Known lower bounds", "", "| Bound | Reference | Comments |", "| --- | --- | --- |", "| $\\frac{3}{2}\\approx 1.5$ | [A] | |", ""].join("\r\n");
    const write = (cell, ent = entry, body = page(cell)) => {
      writeFileSync(join(cd, "9z.md"), body);
      writeFileSync(join(cd, "..", "manifest.json"), JSON.stringify({ fileCount: 1, rootFiles: [] }));
      writeFileSync(join(dir, "continuity", "depth-audit.json"), JSON.stringify({ audits: [{ ...audit, rowLine: 7, rowText: `| $${cell}$ | [Mar1978] | x |` }] }));
      mkdirSync(join(dir, "ledger"), { recursive: true });
      writeFileSync(join(dir, "ledger", "source-exact-values.json"), JSON.stringify({ entries: [ent] }));
      writeFileSync(join(dir, "ledger", "claims.json"), JSON.stringify([{ id: "pin:9z:U", generated: true }, { id: "pin:9z:L", generated: true }]));
    };
    const want = (name, wantCode, re) => { const { code, out } = run(dir); const t = out.join("\n"); if (code !== wantCode || !re.test(t)) { fail++; console.log(`FAIL run: ${name}: exit ${code} (want ${wantCode})\n${t}`); } };
    write("1058.565");
    want("87a shape", 1, /CUT +SOURCE +T1 9z\.md:7 upper[\s\S]*SOURCE .*1 listed, 1 decided — 0 agree, 1 cut[\s\S]*not looked at: 0 of 2/);
    write("1058.566");
    want("printed 1058.566", 0, /AGREES +SOURCE +T1[\s\S]*IN-CELL .*1 found, 1 decided — 1 agree[\s\S]*RESULT: PASS/);
    write("1058.565", { ...entry, quote: "not there" });
    want("stale quotation refuses", 2, /REFUSED +SOURCE T1: the quotation is no longer/);
    write("1058.565", entry, page("1058.565").replace("| $\\frac{3}{2}", "$\\frac{3}{2}"));
    want("r1#3 a dropped table line refuses", 2, /REFUSED — 1 line\(s\) inside a bounds table/);
    write("1058.565", entry, page("1058.565").replace("## Known lower bounds", "Bound | Reference | Comments\r\n--- | --- | ---\r\n$\\sqrt{2}=1.4$ | [R] | x\r\n\r\n## Known lower bounds"));
    want("r2#6 a pipeless table refuses", 2, /REFUSED — 3 line\(s\) holding a pipe in a bounds section are not a row, header or separator the parser read \(9z\.md:9, 9z\.md:10, 9z\.md:11\)/);
    // r3#3: a header without a leading pipe over a delimiter WITH one is still a table nobody parsed.
    write("1058.565", entry, page("1058.565").replace("## Known lower bounds", "Bound | Reference | Comments\r\n| --- | --- | --- |\r\n$\\sqrt{2}=1.4$ | [R] | x\r\n\r\n## Known lower bounds"));
    want("r3#3 a mixed-pipe table refuses", 2, /REFUSED — 3 line\(s\) holding a pipe in a bounds section are not a row, header or separator the parser read \(9z\.md:9, 9z\.md:10, 9z\.md:11\)/);
    // r3#6: a SOURCE location that is no longer a current row never counts as coverage.
    write("1058.565", { ...entry });
    writeFileSync(join(dir, "continuity", "depth-audit.json"), JSON.stringify({ audits: [{ ...audit, rowLine: 999, rowText: "| $1058.565$ | [Mar1978] | x |" }] }));
    want("r3#6 a stale SOURCE location is not coverage", 0, /not looked at: 1 of 2/);
    write("1058.565");
    writeFileSync(join(cd, "..", "manifest.json"), JSON.stringify({ fileCount: 2, rootFiles: [] }));
    want("r1#3 a short inventory refuses", 2, /REFUSED — 1 constant file\(s\) read, the manifest says 2/);
    write("1058.565");
    writeFileSync(join(dir, "ledger", "claims.json"), JSON.stringify([{ id: "pin:9z:U", generated: true }, { id: "pin:9y:L", generated: true }]));
    want("r1#3 a missing expected section refuses", 2, /REFUSED — 1 expected section\(s\) produced no rows \(9y:L\)/);
    rmSync(cd, { recursive: true, force: true });
    mkdirSync(cd, { recursive: true });
    want("empty mirror refuses", 2, /REFUSED — no bound rows/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(fail ? `decimal-vs-exact selftest: FAIL (${fail})` : "decimal-vs-exact selftest: PASS");
  return fail ? 1 : 0;
}

// MAIN-MODULE GUARD, the shape check-audit-lines.mjs uses.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) process.exit(selftest());
  const i = args.indexOf("--root");
  const { code, out } = run(i >= 0 ? args[i + 1] : REPO);
  console.log(out.join("\n"));
  process.exit(code);
} else if (process.argv[1]?.endsWith("decimal-vs-exact.mjs")) {
  console.error("decimal-vs-exact: COULD NOT RUN — invoked as main but module identity did not match");
  process.exit(2);
}
