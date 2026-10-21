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
 *            is evaluated here and the decimal compared with it in the bound's direction; any other
 *            shape is a member classified UNKNOWN, never dropped (Codex round 1, finding 9).
 *   COMMENT  a value cell that is a bare decimal, whose Comments cell prints a longer decimal agreeing
 *            with it to the cell's last place (87a: `$913.493$` beside "root discriminant < 913.4927").
 *            That is the table's own sharper statement, not the source's.
 *   SOURCE   a depth-audit entry (continuity/depth-audit.json) whose reading recorded the source's exact
 *            value. Those values live in ledger/source-exact-values.json, keyed by entry id, each with a
 *            quotation that must still be a verbatim substring of the entry's record; recorded prose is
 *            never parsed (manager review of P1, 2026-10-21).
 * Each member is AGREES, CUT (the printed decimal sits past the exact value in the overstating
 * direction and the cell does not mark it approximate), or UNKNOWN (an expression this evaluator
 * refuses, a precision past double range, or an interval that cannot decide). An approximation the
 * cell itself marks (≈ or a trailing …) with the exact form printed beside it, and within one unit of
 * its last place, AGREES: the reader is shown both.
 *
 * NOT SEEN: every bound row outside the three populations, which is most of them. A bare decimal whose
 * exact value lives only in its paper (the 87a shape itself) is visible ONLY for a row someone has read
 * and recorded in the SOURCE table; the output prints how many rows that leaves unlooked-at rather than
 * calling them agreeing. Also unseen: whether a COMMENT decimal is about the same quantity as the cell
 * (it is matched by agreement to the cell's precision, nothing more), and bare \log of unstated base
 * unless the value does not depend on the base.
 *
 * An INDICATOR, never a gate: it is not in `npm run check` (a known CUT would turn the check
 * permanently red) and only `--selftest` runs in CI. Any CUT is a question for upstream about display
 * convention and goes through the outward gate; nothing here contacts anyone.
 *
 * Exit: 0 no CUT · 1 at least one CUT · 2 refused (no bound rows read, a SOURCE entry that is
 * malformed, missing from the store, no longer quoted by it, or whose exact form and decimal disagree).
 * Flags: --root <dir> (default: the repo; the red-arm runs on a scratch copy) · --selftest.
 */
import { readFileSync, readdirSync, realpathSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { boundRowsOf, countCorpus, expectedSectionsFromClaims } from "./depth-audit.mjs";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const MIRROR = ["ledger", "teorth-optimizationproblems", "constants"];
const EULER_GAMMA = 0.5772156649015329;
// Doubles carry 15-17 significant digits; a decimal or literal with more than 14 cannot be compared
// against a value computed to a few ulps, so it is UNKNOWN or refused (Codex r1 #2, #5, #7).
const MAX_SIG = 14;

// ---------- a small evaluator for the LaTeX the value cells use. Anything else THROWS. ----------
function normalise(s) {
  return s
    .replace(/\$/g, "")
    .replace(/\\(left|right|bigl|bigr|Bigl|Bigr|big|Big|displaystyle)/g, "")
    .replace(/\\[!,;: ]/g, "")
    .replace(/\\(tfrac|dfrac)/g, "\\frac")
    .replace(/\\(cdot|times)/g, "*")
    // Unicode √ binds the whole number after it (4√70035 is 4·√70035, Codex r1 #4); LaTeX \sqrt2
    // keeps its own one-token argument.
    .replace(/√(\d+(?:\.\d+)?)/g, "\\sqrt{$1}")
    .replace(/√/g, "\\sqrt")
    .replace(/π/g, "\\pi")
    .replace(/\s+/g, "");
}

export function evaluate(src, bareLog = Math.log) {
  const s = normalise(src);
  let i = 0;
  const peek = () => s[i];
  const fail = (why) => { throw new Error(`${why} at ${i} in ${s}`); };
  const cmd = () => { const m = /^\\[A-Za-z]+/.exec(s.slice(i)); return m ? m[0] : null; };
  const eat = (t) => { if (s.startsWith(t, i)) { i += t.length; return true; } return false; };
  const startsPrimary = () => {
    const c = peek();
    if (c === undefined) return false;
    if (/[0-9.({]/.test(c)) return true;
    if (c === "e") return true;
    if (c === "\\") { const k = cmd(); return k !== null && k !== "\\frac" ? true : k === "\\frac"; }
    return false;
  };
  function number() {
    const m = /^(\d+(\.\d+)?|\.\d+)/.exec(s.slice(i));
    if (!m) fail("number expected");
    i += m[0].length;
    // A literal past double precision would silently become a different number (Codex r1 #5).
    if (m[0].replace(/^0*\.?0*/, "").replace(".", "").length > MAX_SIG) fail("literal carries more digits than double precision holds");
    return Number(m[0]);
  }
  // A LaTeX argument: {…}, or a single digit, or one command primary (\sqrt2, \frac12, ^2, ^\pi).
  function arg() {
    if (eat("{")) { const v = expr(); if (!eat("}")) fail("} expected"); return v; }
    const c = peek();
    if (/[0-9]/.test(c)) { i += 1; return Number(c); }
    if (c === "\\" || c === "e" || c === "(") return primary();
    return fail("argument expected");
  }
  function funcArg() {
    if (peek() === "(" || peek() === "{") return primary();
    return power();
  }
  function primary() {
    const c = peek();
    if (c === "(") { i += 1; const v = expr(); if (!eat(")")) fail(") expected"); return v; }
    if (c === "{") { i += 1; const v = expr(); if (!eat("}")) fail("} expected"); return v; }
    if (c === "e") { i += 1; return Math.E; }
    if (c === "\\") {
      const k = cmd();
      if (k === "\\frac") { i += k.length; const a = arg(); const b = arg(); return a / b; }
      if (k === "\\sqrt") {
        i += k.length;
        let n = 2;
        if (eat("[")) { n = expr(); if (!eat("]")) fail("] expected"); }
        const v = arg();
        return n === 2 ? Math.sqrt(v) : Math.pow(v, 1 / n);
      }
      if (k === "\\pi") { i += k.length; return Math.PI; }
      if (k === "\\gamma") { i += k.length; if (peek() === "_") fail("subscripted gamma is not Euler's constant"); return EULER_GAMMA; }
      if (k === "\\log") {
        i += k.length;
        if (eat("_")) { const b = arg(); const v = funcArg(); return Math.log(v) / Math.log(b); }
        return bareLog(funcArg());
      }
      const fns = { "\\ln": Math.log, "\\exp": Math.exp, "\\sin": Math.sin, "\\cos": Math.cos, "\\tan": Math.tan, "\\sinh": Math.sinh, "\\cosh": Math.cosh };
      if (fns[k]) { i += k.length; return fns[k](funcArg()); }
      return fail(`unsupported command ${k}`);
    }
    if (/[0-9.]/.test(c)) return number();
    return fail(`unexpected ${c}`);
  }
  function power() {
    const base = primary();
    if (eat("^")) return Math.pow(base, arg());
    return base;
  }
  function unary() {
    if (eat("-")) return -unary();
    if (eat("+")) return unary();
    return power();
  }
  function term() {
    let v = unary();
    for (;;) {
      if (eat("*")) v *= unary();
      else if (eat("/")) v /= unary();
      else if (startsPrimary()) v *= power();
      else return v;
    }
  }
  function expr() {
    let v = term();
    for (;;) {
      if (eat("+")) v += term();
      else if (eat("-")) v -= term();
      else return v;
    }
  }
  const v = expr();
  if (i !== s.length) fail("trailing input");
  if (!Number.isFinite(v)) fail("not finite");
  return v;
}

// Bare \log of unstated base: accepted only when the value does not depend on the base (a ratio).
export function evaluateExact(src) {
  const a = evaluate(src, Math.log);
  if (!/\\log(?!_)/.test(normalise(src))) return a;
  const b = evaluate(src, Math.log10);
  if (Math.abs(a - b) > 1e-12 * Math.max(1, Math.abs(a))) throw new Error("bare \\log whose value depends on the base");
  return a;
}

// ---------- decimals ----------
const DOTS = /(\\dots|\\ldots|…|\.\.\.)$/;
// "1058.565", "0.7853981633\dots", "-0.53". Returns null for anything else.
export function parseDecimal(raw) {
  let t = raw.replace(/\$/g, "").replace(/\\\*|\^\\?\*|\*/g, "").replace(/\\[!,;: ]/g, "").replace(/\s+/g, "");
  const dots = DOTS.test(t);
  t = t.replace(DOTS, "");
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const places = t.includes(".") ? t.split(".")[1].length : 0;
  const sig = t.replace(/^-?0*\.?0*/, "").replace(".", "").length;
  return { text: t, value: Number(t), places, ulp: Math.pow(10, -places), dots, sig };
}

// How far a printed decimal may sit from the value it stands for: half a unit in its last place when
// it is a rounding, a whole unit when a trailing … marks it as a truncation.
// A truncation (trailing …) of a NEGATIVE number continues toward smaller values (Codex r1 #6).
// A trailing … is written after roundings as well as truncations (13b:23 prints π/4 as
// 0.7853981634…), so with dots either reading is accepted.
const within = (dec, x) => {
  if (Math.abs(dec.value - x) <= (dec.ulp / 2) * (1 + 1e-9)) return true;
  if (!dec.dots) return false;
  const [lo, hi] = truncInterval(dec);
  return x >= lo - dec.ulp * 1e-9 && x <= hi + dec.ulp * 1e-9;
};
// A decimal stated to more digits than a double holds is cut to MAX_SIG significant digits and
// read as a truncation of itself (…), which is still a true statement about it. Used for the
// TABLE's and SOURCE's longer decimals only; a printed value that long stays UNKNOWN.
export function fitDecimal(dec) {
  if (dec.sig <= MAX_SIG) return dec;
  const neg = dec.text.startsWith("-");
  const digits = dec.text.replace("-", "");
  const [ip, fp = ""] = digits.split(".");
  const lead = ip.replace(/^0+/, "");
  const leadZerosInFrac = lead ? 0 : fp.length - fp.replace(/^0+/, "").length;
  const keepFrac = lead ? Math.max(0, MAX_SIG - lead.length) : leadZerosInFrac + MAX_SIG;
  if (lead && lead.length > MAX_SIG) return null;
  const text = (neg ? "-" : "") + ip + (keepFrac ? "." + fp.slice(0, keepFrac) : "");
  const out = parseDecimal(text);
  return out && { ...out, dots: true };
}
// The interval a decimal printed with a trailing … stands for: digits continue away from zero.
const truncInterval = (dec) => (dec.value < 0 || dec.text.startsWith("-") ? [dec.value - dec.ulp, dec.value] : [dec.value, dec.value + dec.ulp]);
// Equal within a few ulps of floating-point evaluation, and never for an infinite endpoint (Codex
// r1 #1: close(x, Infinity) was true). The old 1e-12 swallowed real cuts (#2).
const close = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 16 * Number.EPSILON * Math.max(1, Math.abs(a), Math.abs(b));
// Does the printed decimal OVERSTATE the bound? upper printed below exact, lower printed above.
const overstates = (dir, d, x) => !close(d, x) && (dir === "U" ? d < x : d > x);

export function cellsOf(rowText) {
  const t = rowText.trim();
  const parts = t.replace(/\\\|/g, "\u0000").split("|").map((p) => p.replace(/\u0000/g, "\\|"));
  // The trailing pipe is optional in GFM; drop the empty element only when it is there (Codex r1 #8).
  const end = /(^|[^\\])\|$/.test(t) ? -1 : undefined;
  return { value: (parts[1] ?? "").trim(), comments: parts.slice(3, end).join("|").trim() };
}

// ---------- IN-CELL ----------
// Something other than a plain decimal: a command, a power, a root, π, a quotient or Euler's e.
// Scientific notation (`\cdot 10^{-9}`) and the unverified marker (`^\*`) are not exact forms.
// Relation signs, \approx and \ldots are NOT exact forms (the first widening counted `\le 0.84…`).
const plainOf = (s) => s.replace(/\$/g, "").replace(/\^\\?\*|\\\*/g, "").replace(/\\(cdot|times)\s*10\s*\^\s*\{?\s*-?\d+\s*\}?/g, "");
const EXACT_CMD = /\\(frac|tfrac|dfrac|sqrt|pi|log|ln|exp|sin|cos|tan|sinh|cosh|Gamma|zeta|binom|sum|prod|gamma)(?![A-Za-z])/;
const looksExact = (s) => {
  const p = plainOf(s);
  return EXACT_CMD.test(p) || /[\^√π]/.test(p) || /[\d)}]\s*\/\s*[\d(\\e{]/.test(p) || /(^|[^A-Za-z\\])e([^A-Za-z]|$)/.test(p);
};
export function inCell(dir, value) {
  // `$0.75806746$ (exact $37903373/50000000$)` (4b) states the exact form after the decimal.
  const ex = /^\$([^$]+)\$\s*\(exact\s*\$([^$]+)\$\)\s*$/.exec(value.trim());
  const body = ex ? `${ex[2]}=${ex[1]}` : value.replace(/\$/g, "");
  const base0 = { pop: "IN-CELL", dir, cell: value };
  // A cell printing a decimal beside an exact-looking form is a member whatever its shape; a shape
  // this reader cannot split is UNKNOWN, never excluded (Codex r1 #9: `1/e = 0.4` was dropped).
  const member = /\d\.\d/.test(body) && looksExact(body);
  const seps = [...body.matchAll(/\\approx|≈|=/g)];
  const last = seps[seps.length - 1];
  const dec = last ? parseDecimal(body.slice(last.index + last[0].length)) : null;
  const exprs = [];
  let from = 0;
  for (const m of seps) { exprs.push(body.slice(from, m.index)); from = m.index + m[0].length; }
  if (!dec || !exprs.some(looksExact)) {
    return member ? { ...base0, printed: value, cls: "UNKNOWN", why: "a decimal beside an exact form, in a shape this reader does not split (no ≈ or = before a final decimal)" } : null;
  }
  const approx = last[0] !== "=" || dec.dots;
  const vals = [];
  for (const e of exprs) {
    // A leading label ("C_{20b}\ge 1/e") is read from its last relation onward.
    // \le must not match the start of \left (22a, 4b:19 and 4b:20 went UNKNOWN when it did).
    const rhs = e.split(/\\(?:geq?|leq?)(?![A-Za-z])|:|<|>|≤|≥/).pop();
    try { vals.push(evaluateExact(rhs)); } catch { /* not evaluable: ignored unless none is */ }
  }
  const base = { pop: "IN-CELL", dir, cell: value, printed: dec.text + (dec.dots ? "…" : ""), approx };
  if (!vals.length) return { ...base, cls: "UNKNOWN", why: "no expression in the cell is one this evaluator reads" };
  if (vals.some((v) => !close(v, vals[0]))) return { ...base, cls: "UNKNOWN", why: "the cell's own expressions disagree with each other" };
  if (dec.sig > MAX_SIG) return { ...base, cls: "UNKNOWN", why: "the decimal carries more digits than double precision checks" };
  const x = vals[0];
  const ok = within(dec, x);
  const over = overstates(dir, dec.value, x);
  const r = { ...base, exact: x, within: ok };
  if (!over) return { ...r, cls: "AGREES", why: ok ? "on the safe side of the exact value" : "on the safe side, but its digits do not match the expression to their printed place" };
  if (approx && ok) return { ...r, cls: "AGREES", why: "past the exact value, but marked approximate with the exact form printed beside it" };
  return { ...r, cls: "CUT", why: approx ? "marked approximate but further from the exact value than rounding (or, after …, truncation) to its last printed place allows" : "printed as equal to the exact value but sits past it" };
}

// ---------- COMMENT ----------
const COMMENT_NUM = /(<|>|\\(?:leq?|geq?)(?![A-Za-z])|≤|≥|=|\\approx|≈)?\s*(-?\d+\.\d+)\s*(\\dots|\\ldots|…|\.\.\.)?/g;
export function fromComment(dir, value, comments) {
  const d = parseDecimal(value);
  // An integer cell is not a rounded decimal (85a's "1" beside a comment's 0.1 matched to the unit).
  if (!d || d.places < 1) return null;
  const hits = [];
  for (const m of comments.matchAll(COMMENT_NUM)) {
    const raw = parseDecimal(m[2] + (m[3] ?? ""));
    if (!raw || raw.places <= d.places) continue;
    // Membership is judged on the comment's RAW digits: judged on its truncation, a cell longer than
    // a double holds dropped out of the population instead of reading UNKNOWN (1d:18, 3c:34, 3c:35).
    if (Math.abs(raw.value - d.value) > d.ulp * (1 + 1e-9)) continue;
    const c = fitDecimal(raw);
    if (!c) continue;
    hits.push({ rel: (m[1] ?? "").replace(/\\leq?|≤/, "<").replace(/\\geq?|≥/, ">").replace(/\\approx|≈/, "≈"), c });
  }
  if (!hits.length) return null;
  const base = { pop: "COMMENT", dir, cell: value, printed: d.text };
  const verdicts = hits.map(({ rel, c }) => {
    const said = `${rel ? rel + " " : ""}${c.text}${c.dots ? "…" : ""}`;
    // Past double precision the comparison cannot be trusted either way (Codex r1 #7).
    if (d.sig > MAX_SIG) return { cls: "UNKNOWN", said, why: "a decimal here carries more digits than double precision checks" };
    // The interval the exact value lies in, from what the comment says; a truncation of a negative
    // number continues downward (Codex r1 #6).
    let lo = -Infinity, hi = Infinity;
    const [tlo, thi] = c.dots ? truncInterval(c) : [c.value, c.value];
    if (rel === "<") hi = thi;
    else if (rel === ">") lo = tlo;
    else if (c.dots) { lo = tlo; hi = thi; }
    else if (rel === "≈") { lo = c.value - c.ulp / 2; hi = c.value + c.ulp / 2; }
    else { lo = c.value; hi = c.value; }
    if (dir === "U") {
      if (d.value >= hi || close(d.value, hi)) return { cls: "AGREES", said, why: "at or above every value the comment allows" };
      if (d.value < lo && !close(d.value, lo)) return { cls: "CUT", said, why: "below the value the comment states" };
    } else {
      if (d.value <= lo || close(d.value, lo)) return { cls: "AGREES", said, why: "at or below every value the comment allows" };
      if (d.value > hi && !close(d.value, hi)) return { cls: "CUT", said, why: "above the value the comment states" };
    }
    return { cls: "UNKNOWN", said, why: "the comment's statement does not decide which side the printed decimal is on" };
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
  const unevaluable = entry.evaluable === false;
  if (entry.evaluable !== undefined && typeof entry.evaluable !== "boolean") return { ...base, refuse: "evaluable must be true or false" };
  if (unevaluable && !has("exact")) return { ...base, refuse: "an unevaluable entry must still state its exact form" };
  // The exact value's interval: a closed form is a point; a source decimal is a point, or with a
  // trailing … the unit beyond its last printed digit, away from zero.
  let lo, hi;
  if (has("exact") && !unevaluable) {
    try { lo = hi = evaluateExact(entry.exact); } catch (e) { return { ...base, refuse: `exact form not evaluable (${e.message})` }; }
  }
  if (has("sourceDecimal")) {
    const sd0 = parseDecimal(entry.sourceDecimal);
    const sd = sd0 && fitDecimal(sd0);
    if (!sd) return { ...base, refuse: "sourceDecimal is not a decimal" };
    if (lo !== undefined) {
      if (!within(sd, lo)) return { ...base, refuse: `exact form evaluates to ${lo}, which sourceDecimal ${entry.sourceDecimal} does not match` };
    } else if (!unevaluable) [lo, hi] = sd.dots ? truncInterval(sd) : [sd.value, sd.value];
  }
  const x = lo;
  const at = lines?.[audit.rowLine - 1];
  const file = audit.rowFile.split("/").pop();
  const where = { file, line: audit.rowLine };
  if (!at || at.trim() !== String(audit.rowText).trim()) return { ...base, ...where, cls: "UNKNOWN", why: "the audited row is no longer at its recorded line (see check-audit-lines)" };
  const dir = dirAt(audit.rowLine);
  if (!dir) return { ...base, ...where, cls: "UNKNOWN", why: "the recorded line is not a bound row" };
  const value = cellsOf(at).value;
  const d = parseDecimal(value);
  const r = { ...base, ...where, dir, cell: value, exact: x, exactText: has("exact") ? entry.exact : entry.sourceDecimal, exactIsForm: has("exact") && !unevaluable };
  if (unevaluable) return { ...r, cls: "UNKNOWN", why: "the source's closed form is one this evaluator does not read" };
  if (!d) return { ...r, cls: "UNKNOWN", why: "the value cell is not a plain decimal" };
  if (d.sig > MAX_SIG) return { ...r, cls: "UNKNOWN", why: "the decimal carries more digits than double precision checks" };
  const safe = dir === "U" ? !overstates("U", d.value, hi) : !overstates("L", d.value, lo);
  if (safe) return { ...r, printed: d.text, cls: "AGREES", why: "on the safe side of the source's exact value" };
  const surely = dir === "U" ? overstates("U", d.value, lo) : overstates("L", d.value, hi);
  if (!surely) return { ...r, printed: d.text, cls: "UNKNOWN", why: "inside the interval the source's truncated decimal allows" };
  if (d.dots && within(d, x)) return { ...r, printed: d.text + "…", cls: "AGREES", why: "past the exact value, but marked with … as a truncation" };
  return { ...r, printed: d.text, cls: "CUT", why: `printed ${dir === "U" ? "below" : "above"} the exact value its source states, with no mark that it is rounded` };
}

// ---------- run ----------
const fmt = (x) => (typeof x === "number" ? x.toPrecision(13).replace(/0+$/, "").replace(/\.$/, "") : "");

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
  // run instead of vanishing from both the members and the "not looked at" count (Codex r1 #3): an
  // unreadable file, an inventory short of the mirror manifest, a line dropped inside a table block,
  // a section the committed pins expect that produced no rows, a file with no rows. (Its 87a row-count
  // control is not applied: a scratch tree for a red-arm need not carry 87a.)
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
  const why = corpus.expectedFiles == null ? "the mirror manifest gives no file count"
    : corpus.files !== corpus.expectedFiles ? `${corpus.files} constant file(s) read, the manifest says ${corpus.expectedFiles}`
    : corpus.expectedSections == null ? "ledger/claims.json gives no section baseline"
    : corpus.unparseableRows.length ? `${corpus.unparseableRows.length} line(s) inside a bounds table that this parser drops`
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
  let audits = [];
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
  for (const m of members) {
    const loc = `${m.file}:${m.line} ${dirWord(m.dir)}`;
    const detail = m.pop === "COMMENT"
      ? `prints ${m.printed}; comment says ${m.said}`
      : m.pop === "SOURCE"
        ? `prints ${m.printed ?? m.cell}; source states ${m.exactText}${m.exactIsForm ? ` = ${fmt(m.exact)}` : ""}`
        : `prints ${m.printed ?? m.cell}${m.exact !== undefined ? `; exact ${fmt(m.exact)}` : ""}`;
    out.push(`${m.cls.padEnd(8)} ${m.pop.padEnd(8)} ${m.id ? m.id + " " : ""}${loc} — ${detail} — ${m.why}`);
  }
  const tally = (pop) => {
    const ms = members.filter((m) => m.pop === pop);
    const c = (k) => ms.filter((m) => m.cls === k).length;
    return { n: ms.length, AGREES: c("AGREES"), CUT: c("CUT"), UNKNOWN: c("UNKNOWN") };
  };
  const A = tally("IN-CELL"), B = tally("COMMENT"), C = tally("SOURCE");
  const keyed = new Set(members.map((m) => `${m.file}:${m.line}`));
  out.push(`search space: ${rows.length} bound row(s) across ${texts.size} file(s) of ${MIRROR.join("/")} (depth-audit.mjs boundRowsOf, the --corpus definition)`);
  out.push(`IN-CELL  (a decimal beside an exact form in the value cell; checked when it follows the form's last ≈ or =): ${A.n} found, ${A.AGREES + A.CUT} checked — ${A.AGREES} agree, ${A.CUT} cut against the exact value, ${A.UNKNOWN} unknown`);
  out.push(`COMMENT  (a bare decimal whose Comments cell prints a longer decimal agreeing to its last place): ${B.n} found, ${B.AGREES + B.CUT} decided — ${B.AGREES} agree, ${B.CUT} cut, ${B.UNKNOWN} unknown`);
  out.push(`SOURCE   (ledger/source-exact-values.json, keyed to depth-audit entries): ${C.n} listed, ${C.AGREES + C.CUT} checked — ${C.AGREES} agree, ${C.CUT} cut against the source, ${C.UNKNOWN} unknown; drawn from ${vvs.length} value-vs-source entr${vvs.length === 1 ? "y" : "ies"}, the other ${vvs.length - C.n} carry no exact value on record (${Array.isArray(table.notEntered) ? table.notEntered.length : 0} of them considered and not entered, each with its reason in the table)`);
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
  eq("4√70035", evaluateExact("4\\sqrt{70035}"), 4 * Math.sqrt(70035));
  eq("\\dfrac{\\pi}{2\\ln(1+\\sqrt{2})}", evaluateExact("\\dfrac{\\pi}{2\\ln(1+\\sqrt{2})}"), Math.PI / (2 * Math.log(1 + Math.SQRT2)));
  eq("\\frac12", evaluateExact("\\frac12"), 0.5);
  eq("\\tfrac{5\\sqrt2}{4}", evaluateExact("\\tfrac{5\\sqrt2}{4}"), 5 * Math.SQRT2 / 4);
  eq("\\log_{70} 143640", evaluateExact("\\log_{70} 143640"), Math.log(143640) / Math.log(70));
  eq("3 \\log_{12} 10", evaluateExact("3 \\log_{12} 10"), 3 * Math.log(10) / Math.log(12));
  eq("\\frac{\\log 3}{\\log 2}", evaluateExact("\\frac{\\log 3}{\\log 2}"), Math.log(3) / Math.log(2));
  eq("e^{1-\\gamma}", evaluateExact("e^{1-\\gamma}"), Math.exp(1 - EULER_GAMMA));
  eq("4 e^{-0.14/e}", evaluateExact("4 e^{-0.14/e}"), 4 * Math.exp(-0.14 / Math.E));
  eq("134753^{1/10}", evaluateExact("134753^{1/10}"), Math.pow(134753, 0.1));
  eq("\\frac{13524e-7359}{9451e-3286}", evaluateExact("\\frac{13524e-7359}{9451e-3286}"), (13524 * Math.E - 7359) / (9451 * Math.E - 3286));
  eq("\\left(\\frac{4\\pi}{11}\\right)^{3/4}", evaluateExact("\\left(\\frac{4\\pi}{11}\\right)^{3/4}"), Math.pow(4 * Math.PI / 11, 0.75));
  eq("\\sqrt{4-\\sqrt{15}}", evaluateExact("\\sqrt{4-\\sqrt{15}}"), Math.sqrt(4 - Math.sqrt(15)));
  eq("2\\pi+2", evaluateExact("2\\pi+2"), 2 * Math.PI + 2);
  throws("bare \\log depending on base", () => evaluateExact("\\frac12\\log(2)"));
  throws("\\Gamma refused", () => evaluateExact("\\Gamma(1/3)"));
  throws("subscripted gamma refused", () => evaluateExact("2/\\log \\gamma_{1}"));
  throws("a letter refused", () => evaluateExact("\\pi/2-\\delta"));
  throws("\\sum refused", () => evaluateExact("\\sum_{k=1}^{\\infty}2^{-k}"));

  const cls = (name, got, want) => { if ((got?.cls ?? null) !== want) { fail++; console.log(`FAIL ${name}: ${got?.cls ?? "not a member"} (want ${want ?? "not a member"}) ${got?.why ?? ""}`); } };
  // IN-CELL
  cls("upper ≈ below exact, within rounding", inCell("U", "$\\pi/2 \\approx 1.57080$"), "AGREES");
  cls("upper = with … truncation", inCell("U", "$\\frac{\\pi}{4}=0.7853981633\\dots$"), "AGREES");
  cls("lower ≈ above exact, within rounding", inCell("L", "$\\sqrt{2}\\approx 1.414214$"), "AGREES");
  cls("upper printed = below exact, no mark", inCell("U", "$\\frac{\\pi}{4}=0.785$"), "CUT");
  cls("upper ≈ but far below exact", inCell("U", "$\\pi/2 \\approx 1.5$"), "CUT");
  cls("lower printed = above exact, no mark", inCell("L", "$\\sqrt{2} = 1.4143$"), "CUT");
  cls("exact equality", inCell("U", "$\\frac{13}{4}=3.25$"), "AGREES");
  cls("unreadable expression", inCell("U", "$\\pi/2-\\delta$ with $\\delta\\approx 0.00013$"), "UNKNOWN");
  cls("an expression with no separator is an UNKNOWN member", inCell("U", "$0.92117 - \\frac{9}{16} 10^{-6}$"), "UNKNOWN");
  cls("bare decimal is not a member", inCell("U", "$1058.565$"), null);
  cls("scientific notation is not a member", inCell("L", "$-5.895 \\cdot 10 ^ {-9}$"), null);
  cls("an unverified marker is not an exact form", inCell("U", "$1.7813^\\*$"), null);
  // Codex round 1 (2026-10-21), one fixture per finding, each the reviewer's own scenario.
  cls("r1#2 a 1e-13 cut is not swallowed", inCell("U", "$10000000000001/10000000000000 = 1.0$"), "CUT");
  cls("r1#4 unicode √ takes the whole number", inCell("U", "$4√70035 = 500.0$"), "CUT");
  cls("r1#5 a literal past double precision is refused", inCell("U", "$\\frac{10000000000000001-10000000000000000}{10}=0.0$"), "UNKNOWN");
  cls("r1#9 1/e is an exact form", inCell("L", "$1/e = 0.4$"), "CUT");
  cls("a labelled expression is read after its relation", inCell("L", "$C_{20b}\\ge 1/e \\approx 0.367879$"), "AGREES");
  cls("\\left is not read as \\le", inCell("L", "$\\left(\\frac{4\\pi}{11}\\right)^{3/4}\\approx 1.105$"), "AGREES");
  cls("a named symbol is UNKNOWN", inCell("U", "$c_0^2 \\approx 5.33386$"), "UNKNOWN");
  cls("the cell's two expressions agree", inCell("L", "$5/\\sqrt{8}=\\tfrac{5\\sqrt2}{4}\\approx 1.767767$"), "AGREES");
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
  cls("r1#7 past double precision is UNKNOWN", fromComment("L", "$1.0000000000000001$", "$1.00000000000000001$"), "UNKNOWN");
  cls("a long comment decimal is read as its truncation", fromComment("U", "$1.5027434868$", "$1.50274348670958337974\\dots$"), "AGREES");
  cls("a long comment decimal still catches a cut", fromComment("U", "$1.5027434867$", "$1.50274348670958337974\\dots$"), "CUT");
  cls("a cell past double precision stays a member, UNKNOWN", fromComment("U", "$1.463071582607559$", "$1.4630715826075593\\dots$"), "UNKNOWN");
  const fd = fitDecimal(parseDecimal("0.000123456789012345678"));
  if (!fd || fd.text !== "0.00012345678901234" || !fd.dots) { fail++; console.log(`FAIL fitDecimal keeps 14 significant digits: ${fd?.text}`); }
  cls("a rounding written with … agrees beside its exact form", inCell("L", "$\\frac{\\pi}{4}=0.7853981634\\dots$"), "AGREES");
  cls("\\le alone is not an exact form", inCell("U", "$$\\le 0.844137708436$$"), null);
  cls("\\approx alone is not an exact form", inCell("U", "$\\approx 2.15627$"), null);
  cls("(exact …) after a decimal is read", inCell("L", "$0.75806746$ (exact $37903373/50000000$)"), "AGREES");
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
  refuses("exact and decimal disagree", fromSource({ ...entry, sourceDecimal: "1058.5652" }, audit, lines, up));
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

  // The whole run on a scratch tree: a CUT exits 1, the same tree with the row printed 1058.566 exits 0,
  // an empty mirror and a bad table entry exit 2.
  const dir = mkdtempSync(join(tmpdir(), "decimal-vs-exact-"));
  try {
    const cd = join(dir, ...MIRROR);
    mkdirSync(cd, { recursive: true });
    mkdirSync(join(dir, "continuity"), { recursive: true });
    const page = (cell) => ["# 9z", "", "## Known upper bounds", "", "| Bound | Reference | Comments |", "| --- | --- | --- |", `| $${cell}$ | [Mar1978] | x |`, "", "## Known lower bounds", "", "| Bound | Reference | Comments |", "| --- | --- | --- |", "| $\\sqrt{2}\\approx 1.414214$ | [A] | |", ""].join("\r\n");
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
    want("87a shape", 1, /CUT +SOURCE +T1 9z\.md:7 upper[\s\S]*SOURCE .*1 listed, 1 checked — 0 agree, 1 cut[\s\S]*not looked at: 0 of 2/);
    write("1058.566");
    want("printed 1058.566", 0, /AGREES +SOURCE +T1[\s\S]*IN-CELL .*1 found, 1 checked — 1 agree[\s\S]*RESULT: PASS/);
    write("1058.565", { ...entry, quote: "not there" });
    want("stale quotation refuses", 2, /REFUSED +SOURCE T1: the quotation is no longer/);
    // r1#3: a row this parser drops (no leading pipe, legal GFM) refuses instead of vanishing.
    write("1058.565", entry, page("1058.565").replace("| $\\sqrt{2}", "$\\sqrt{2}"));
    want("r1#3 a dropped table line refuses", 2, /REFUSED — 1 line\(s\) inside a bounds table/);
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
