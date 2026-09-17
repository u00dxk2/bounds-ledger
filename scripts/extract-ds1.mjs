#!/usr/bin/env node
// extract-ds1.mjs — A-54, the second watched area: Section 2.1 of "Small Ramsey Numbers"
// (Stanisław Radziszowski, The Electronic Journal of Combinatorics, dynamic survey DS1).
//
// usage:
//   extract-ds1.mjs --selftest                     network-free; both answers for every refusal
//   extract-ds1.mjs --check [--pdf <file>]         re-derive from the pinned PDF, compare to the ledger
//   extract-ds1.mjs --write --revision N --revision-date YYYY-MM-DD [--pdf <file>]
//
// exit 0 = the committed table is exactly what the pinned PDF says
//      1 = it is not: the PDF's bytes changed (a new revision is this area's alarm) or the table differs
//      2 = error: the PDF could not be fetched or read (UNREACHABLE is not a revision)
//      3 = REFUSED: the PDF was read but its layout is not one this reader can place with certainty
//
// WHAT IT READS. Tables Ia and Ib of Section 2.1 (two-colour classical Ramsey numbers R(k, l),
// k <= 10, l <= 15) and Table Ia's reference table, from the PDF the journal serves. The survey
// grants no licence to republish it, so the PDF's bytes are never stored here: only the values,
// the reference keys the survey prints beside them, and the PDF's sha256 (A-54 decision D1).
//
// HOW IT PLACES A NUMBER, and why that is the whole design. Each table is drawn inside a grid of
// ruled lines. This reader takes the grid from the PDF's own stroked segments and puts every
// printed number in the ruled cell that contains it, measured from the glyphs' positions and the
// fonts' /Widths. It never counts numbers from the left: rows in Table Ia have blank cells
// (row k = 6 prints no lower bound for l = 14), and counting would silently shift every value
// after the blank into the wrong column. In a cell, the survey prints an exact value centred
// on the row's middle line, a lower bound on the line above and an upper bound on the line below.
//
// REFUSES RATHER THAN GUESSES (exit 3). Any of these stops the run with the reason, and nothing
// is written: a number whose glyphs cross a ruled column boundary; two numbers on one line of one
// cell; a baseline that is not the row's middle, upper or lower line; an exact value and a bound
// in the same cell; a column header that is not the expected run of l; a row label that is not
// the expected run of k; a reference printed where its table has no value; a glyph with no known
// width; and the positive controls below. A partial table is never emitted.
//
// KNOWN LIMITS, named rather than left for someone to discover. Two constructions still read
// wrongly, both found by adversarial review (2026-09-17) and both requiring the PDF's BYTES to
// change: two glyphs painted at the same position can read 116064 where a reader sees 16064, and a
// reference key whose glyphs are drawn in reverse keeps its stream order (the disorder check
// condemns only runs containing a digit, because composing an accent moves backwards on purpose).
// What stands between those and the ledger is not this parser: `--check` refuses ANY change to the
// pinned sha256, and `--write` takes the new revision only from a person who has compared it with
// the published survey. Neither is a reason to trust a re-derivation nobody looked at.
//
// POSITIVE CONTROLS, taken from the survey's PROSE rather than from any table this reader parses:
// note (g) of Section 2.1 states R(3,9) = 36 and R(4,5) = 25, and note (e) states the lower bound
// 43 and the upper bound 46 for R(5,5). If the extracted tables disagree with the prose, the
// reader has misplaced something, and the run refuses.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isEntryModule } from "./lib/entry-module.mjs";
import { fetchWithRetry } from "./reverify.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const LEDGER = join(ROOT, "ledger", "ejc-ds1", "section-2-1.json");
export const PDF_URL = "https://www.combinatorics.org/ojs/index.php/eljc/article/download/DS1/pdf/";
export const LANDING_URL = "https://www.combinatorics.org/ojs/index.php/eljc/article/view/DS1";

export class Refusal extends Error {}
const refuse = (msg) => { throw new Refusal(msg); };

// ---------------------------------------------------------------------------------------------
// PDF objects. Classic cross-reference PDFs only: an object stream or an xref stream is refused,
// because this reader would silently miss the objects inside it.

export function parsePdf(buf) {
  const raw = buf.toString("latin1");
  if (!raw.startsWith("%PDF-")) refuse("not a PDF: no %PDF- header");
  if (/\/Type\s*\/ObjStm\b/.test(raw) || /\/Type\s*\/XRef\b/.test(raw)) {
    refuse("the PDF uses object or cross-reference streams, which this reader does not parse");
  }
  const at = new Map();
  for (const m of raw.matchAll(/(?:^|[\r\n\s])(\d+)\s+(\d+)\s+obj\b/g)) {
    at.set(Number(m[1]), m.index + m[0].length); // a later definition wins, as in an incremental update
  }
  const cache = new Map();
  function get(n) {
    if (cache.has(n)) return cache.get(n);
    const start = at.get(n);
    if (start === undefined) refuse(`object ${n} is referenced and not defined`);
    const end = raw.indexOf("endobj", start);
    if (end < 0) refuse(`object ${n} has no endobj`);
    const text = raw.slice(start, end);
    const s = text.search(/\bstream\r?\n/);
    let dict = text;
    let stream = null;
    if (s >= 0) {
      dict = text.slice(0, s);
      const dataStart = start + s + text.slice(s).match(/^stream\r?\n/)[0].length;
      const len = lengthOf(dict);
      const bytes = buf.subarray(dataStart, dataStart + len);
      const after = raw.slice(dataStart + len, dataStart + len + 12);
      if (!/^\s*endstream/.test(after)) refuse(`object ${n}: /Length does not end at endstream`);
      stream = /\/FlateDecode/.test(dict) ? inflateSync(bytes) : bytes;
    }
    const o = { n, dict, stream };
    cache.set(n, o);
    return o;
  }
  function lengthOf(dict) {
    const ind = dict.match(/\/Length\s+(\d+)\s+0\s+R/);
    if (ind) return Number(get(Number(ind[1])).dict.trim());
    const dir = dict.match(/\/Length\s+(\d+)/);
    if (!dir) refuse("a stream has no /Length");
    return Number(dir[1]);
  }
  const root = raw.match(/\/Root\s+(\d+)\s+0\s+R/);
  if (!root) refuse("no /Root in the trailer");
  const pagesRef = get(Number(root[1])).dict.match(/\/Pages\s+(\d+)\s+0\s+R/);
  if (!pagesRef) refuse("the catalog names no /Pages");
  const pages = [];
  (function walk(n, inherited) {
    const o = get(n);
    const res = resourcesOf(o.dict) ?? inherited;
    if (/\/Type\s*\/Pages\b/.test(o.dict)) {
      const kids = o.dict.match(/\/Kids\s*\[([^\]]*)\]/);
      if (!kids) refuse(`page tree node ${n} has no /Kids`);
      for (const k of kids[1].matchAll(/(\d+)\s+0\s+R/g)) walk(Number(k[1]), res);
    } else {
      pages.push({ n, dict: o.dict, resources: res });
    }
  })(Number(pagesRef[1]), null);

  function resourcesOf(dict) {
    const ref = dict.match(/\/Resources\s+(\d+)\s+0\s+R/);
    if (ref) return get(Number(ref[1])).dict;
    const i = dict.indexOf("/Resources");
    return i >= 0 ? balanced(dict, dict.indexOf("<<", i)) : null;
  }
  return { get, pages, raw };
}

// The text of a << ... >> dictionary starting at `from`, nesting respected.
function balanced(s, from) {
  if (from < 0) return null;
  let depth = 0;
  for (let i = from; i < s.length - 1; i++) {
    if (s[i] === "<" && s[i + 1] === "<") { depth++; i++; }
    else if (s[i] === ">" && s[i + 1] === ">") { depth--; i++; if (depth === 0) return s.slice(from, i + 1); }
  }
  refuse("an unbalanced dictionary");
}

// ---------------------------------------------------------------------------------------------
// Fonts: widths per code and a decoder. WinAnsiEncoding plus the /Differences a font declares.

const WINANSI_HIGH = { 128: "€", 130: "‚", 131: "ƒ", 132: "„", 133: "…", 134: "†", 135: "‡", 136: "ˆ", 137: "‰", 138: "Š", 139: "‹", 140: "Œ", 142: "Ž", 145: "‘", 146: "’", 147: "“", 148: "”", 149: "•", 150: "–", 151: "—", 152: "˜", 153: "™", 154: "š", 155: "›", 156: "œ", 158: "ž", 159: "Ÿ" };
// Accent glyphs decode to COMBINING marks and are composed onto the letter before them (NFC).
const GLYPHS = {
  fi: "fi", fl: "fl", quoteright: "’", quoteleft: "‘", minus: "−", lessequal: "≤", greaterequal: "≥",
  multiply: "×", grave: "̀", acute: "́", breve: "̆", dieresis: "̈", cedilla: "̧",
  hungarumlaut: "̋", caron: "̌", ogonek: "̨", ring: "̊", Lslash: "Ł", lslash: "ł",
  dotlessi: "ı", endash: "–", emdash: "—", infinity: "∞", similar: "∼", arrowright: "→",
};

export function fontFrom(dict, get) {
  const first = Number((dict.match(/\/FirstChar\s+(\d+)/) || [])[1]);
  let wtxt = (dict.match(/\/Widths\s*\[([^\]]*)\]/) || [])[1];
  if (wtxt === undefined) {
    const wref = dict.match(/\/Widths\s+(\d+)\s+0\s+R/);
    if (wref) wtxt = (get(Number(wref[1])).dict.match(/\[([^\]]*)\]/) || [])[1];
  }
  const widths = new Map();
  if (Number.isFinite(first) && wtxt) wtxt.trim().split(/\s+/).forEach((w, i) => widths.set(first + i, Number(w)));
  let encDict = "";
  const eref = dict.match(/\/Encoding\s+(\d+)\s+0\s+R/);
  if (eref) encDict = get(Number(eref[1])).dict;
  else if (/\/Encoding\s*<</.test(dict)) encDict = balanced(dict, dict.indexOf("<<", dict.indexOf("/Encoding")));
  const diff = new Map();
  const d = encDict.match(/\/Differences\s*\[([^\]]*)\]/);
  if (d) {
    // Names follow numbers with no space between them ("174/fi/fl 193/grave/acute"), so this reads
    // tokens, not whitespace-separated words.
    let code = 0;
    for (const t of d[1].matchAll(/(\d+)|\/([^\s/[\]()<>]+)/g)) {
      if (t[1] !== undefined) code = Number(t[1]);
      else diff.set(code++, t[2]);
    }
  }
  const decode = (code) => {
    if (diff.has(code)) return GLYPHS[diff.get(code)] ?? "�";
    if (code >= 32 && code <= 126) return String.fromCharCode(code);
    if (WINANSI_HIGH[code]) return WINANSI_HIGH[code];
    if (code >= 160) return String.fromCharCode(code);
    return "�";
  };
  return { widths, decode };
}

function fontsOfPage(page, get) {
  const out = new Map();
  if (!page.resources) return out;
  let fdict = null;
  const ref = page.resources.match(/\/Font\s+(\d+)\s+0\s+R/);
  if (ref) fdict = get(Number(ref[1])).dict;
  else if (/\/Font\s*<</.test(page.resources)) fdict = balanced(page.resources, page.resources.indexOf("<<", page.resources.indexOf("/Font")));
  if (!fdict) return out;
  for (const m of fdict.matchAll(/\/([A-Za-z0-9_.+-]+)\s+(\d+)\s+0\s+R/g)) out.set(m[1], fontFrom(get(Number(m[2])).dict, get));
  return out;
}

// ---------------------------------------------------------------------------------------------
// Content streams: positioned text runs and stroked line segments, in page user space.

function tokenize(s) {
  const toks = [];
  let i = 0;
  const ws = (c) => c === " " || c === "\n" || c === "\r" || c === "\t" || c === "\f" || c === "\0";
  while (i < s.length) {
    const c = s[i];
    if (ws(c)) { i++; continue; }
    if (c === "%") { while (i < s.length && s[i] !== "\n" && s[i] !== "\r") i++; continue; }
    if (c === "(") {
      let depth = 1, j = i + 1, out = "";
      while (j < s.length && depth) {
        const ch = s[j];
        if (ch === "\\") {
          const nx = s[j + 1];
          if (/[0-7]/.test(nx)) { let oct = nx; j += 2; while (oct.length < 3 && /[0-7]/.test(s[j])) oct += s[j++]; out += String.fromCharCode(parseInt(oct, 8) & 255); continue; }
          const esc = { n: "\n", r: "\r", t: "\t", b: "\b", f: "\f" }[nx];
          if (nx === "\r" || nx === "\n") { j += nx === "\r" && s[j + 2] === "\n" ? 3 : 2; continue; }
          out += esc ?? nx; j += 2; continue;
        }
        if (ch === "(") depth++;
        if (ch === ")") { depth--; if (!depth) break; }
        out += ch; j++;
      }
      toks.push({ t: "str", v: out }); i = j + 1; continue;
    }
    if (c === "<" && s[i + 1] === "<") { toks.push({ t: "dict<" }); i += 2; continue; }
    if (c === ">" && s[i + 1] === ">") { toks.push({ t: "dict>" }); i += 2; continue; }
    if (c === "<") {
      const j = s.indexOf(">", i);
      let hex = s.slice(i + 1, j).replace(/\s+/g, "");
      if (hex.length % 2) hex += "0";
      toks.push({ t: "str", v: Buffer.from(hex, "hex").toString("latin1") }); i = j + 1; continue;
    }
    if (c === "[") { toks.push({ t: "[" }); i++; continue; }
    if (c === "]") { toks.push({ t: "]" }); i++; continue; }
    if (c === "/") { let j = i + 1; while (j < s.length && !ws(s[j]) && !"/[]()<>{}%".includes(s[j])) j++; toks.push({ t: "name", v: s.slice(i + 1, j) }); i = j; continue; }
    let j = i;
    while (j < s.length && !ws(s[j]) && !"/[]()<>{}%".includes(s[j])) j++;
    const word = s.slice(i, j);
    if (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(word)) toks.push({ t: "num", v: Number(word) });
    else toks.push({ t: "op", v: word });
    i = Math.max(j, i + 1);
  }
  return toks;
}

const mul = (A, B) => [
  A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3],
  A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3],
  A[4] * B[0] + A[5] * B[2] + B[4], A[4] * B[1] + A[5] * B[3] + B[5],
];
const apply = (M, x, y) => [x * M[0] + y * M[2] + M[4], x * M[1] + y * M[3] + M[5]];
const ID = [1, 0, 0, 1, 0, 0];

// A kern more negative than this many thousandths of an em ends a run inside one TJ array. Word
// spaces in running text are about -330; the table cells are separated by -1875 or more; the
// accent placements inside a reference key are small or positive.
const RUN_BREAK = -200;

export function readPage(content, fonts) {
  const toks = tokenize(content);
  const runs = [];
  const segs = [];
  const stack = [];
  let ctm = ID, tm = ID, tlm = ID;
  let font = null, fontName = null, size = 0, Tc = 0, Tw = 0, Th = 1, TL = 0, Ts = 0;
  let run = null;
  let path = [], cur = null, start = null;
  const operands = [];
  let arr = null;

  const endRun = () => {
    if (run && run.text.trim()) runs.push({ ...run, text: run.text.normalize("NFC").trim() });
    run = null;
  };
  const show = (str) => {
    if (!font) refuse(`text shown with no font selected (${fontName ?? "none"})`);
    const M = mul(tm, ctm);
    if (Math.abs(M[1]) > 1e-6 || Math.abs(M[2]) > 1e-6) refuse("rotated or sheared text is not placed by this reader");
    // THE SUPPORTED GEOMETRY IS NARROW ON PURPOSE. This reader places text drawn upright and
    // unmirrored, and refuses anything else rather than interpreting it. A mirrored matrix hid a
    // boundary crossing and an upside-down one dropped a value, both reproduced against the real
    // PDF by adversarial review round 4 (2026-09-17), because Math.abs() had discarded the
    // direction the bounds depend on. Refusing an unsupported transform is the honest answer; a
    // reader that guesses at one is how a wrong number gets published.
    if (M[0] <= 0 || M[3] <= 0) refuse(`mirrored or flipped text is not placed by this reader (text matrix scale ${M[0].toFixed(3)}, ${M[3].toFixed(3)})`);
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      const w = font.widths.get(code);
      const M = mul(tm, ctm);
      // Text rise (Ts) moves the baseline. Ignoring it read a glyph drawn on the upper line as if it
      // sat on the middle one, which turns a lower bound into an exact value — reproduced by
      // adversarial review 2026-09-17 with `6 Ts` on a fixture. Position is what the reader sees.
      const [x0, y] = apply(M, 0, Ts);
      // THE GLYPH'S INK, IN PAGE COORDINATES, kept separate from the cursor's advance. Two defects
      // came from conflating them (adversarial review round 3, 2026-09-17): the advance includes
      // character spacing, so a negative Tc let a glyph cross a column rule while the recorded
      // extent stopped short of it; and an untransformed font size mismeasured height, so the same
      // text at size 4 with a 2x matrix was dropped while size 100 with a 0.1x matrix was refused.
      // Width and height are therefore scaled by the rendering matrix, and the advance moves the
      // cursor separately.
      const inkW = (w ?? 0) / 1000 * size * Th * Math.abs(M[0]);
      const h = size * Math.abs(M[3]);
      const adv = ((w ?? 0) / 1000 * size + Tc + (code === 32 ? Tw : 0)) * Th;
      tm = mul([1, 0, 0, 1, adv, 0], tm);
      if (!run) run = { x0, x1: x0, y, text: "", font: fontName, size, asc: 0, desc: 0, unknownWidth: false, disordered: false, lastX0: -Infinity };
      run.x0 = Math.min(run.x0, x0, x0 + inkW);
      run.x1 = Math.max(run.x1, x0, x0 + inkW);
      run.asc = Math.max(run.asc, 0.75 * h);
      run.desc = Math.max(run.desc, 0.25 * h);
      // GLYPHS DRAWN OUT OF ORDER. A positive TJ adjustment moves the cursor BACKWARDS, so the
      // characters a reader sees can be in a different order from the bytes in the stream: round 4
      // reproduced a cell printed 60641 that this reader concatenated as 16064, with every control
      // passing. The run's outer bounds cannot see it, so each glyph's start is compared with the
      // last. Composing an accent moves backwards deliberately, so this only condemns a run when
      // readTable finds a DIGIT in it — the survey's accents sit in reference keys, never in values.
      if (x0 < run.lastX0 - 0.1) run.disordered = true;
      run.lastX0 = x0;
      run.text += font.decode(code);
      // A zero advance is not a zero glyph, and a missing one is not a narrow glyph: both mean this
      // reader cannot bound the ink, so the run is unusable rather than small (round 4).
      if (w === undefined || (w === 0 && code !== 32)) run.unknownWidth = true;
    }
  };

  for (const tk of toks) {
    if (tk.t === "[") { arr = []; continue; }
    if (tk.t === "]") { operands.push({ t: "arr", v: arr }); arr = null; continue; }
    if (arr) { arr.push(tk); continue; }
    if (tk.t !== "op") { operands.push(tk); continue; }
    const n = (i) => operands[operands.length - i].v;
    switch (tk.v) {
      // The TEXT state is part of the graphics state, so q/Q must save and restore it too. Saving
      // only the matrix left a rise set inside a q/Q block applied after the Q — which draws a
      // glyph on the upper line while this reader called it centred, turning a lower bound into an
      // exact value (adversarial review round 2, 2026-09-17).
      case "q": stack.push({ ctm, font, fontName, size, Tc, Tw, Th, TL, Ts }); break;
      case "Q": {
        endRun();
        const s = stack.pop();
        if (s) ({ ctm, font, fontName, size, Tc, Tw, Th, TL, Ts } = s); else ctm = ID;
        break;
      }
      case "cm": ctm = mul([n(6), n(5), n(4), n(3), n(2), n(1)], ctm); break;
      case "BT": tm = tlm = ID; break;
      case "ET": endRun(); break;
      case "Tf": endRun(); fontName = n(2); font = fonts.get(fontName) ?? null; size = n(1); break;
      case "Tc": Tc = n(1); break;
      case "Tw": Tw = n(1); break;
      case "Tz": Th = n(1) / 100; break;
      case "Ts": endRun(); Ts = n(1); break;
      case "TL": TL = n(1); break;
      case "Td": endRun(); tlm = mul([1, 0, 0, 1, n(2), n(1)], tlm); tm = tlm; break;
      case "TD": endRun(); TL = -n(1); tlm = mul([1, 0, 0, 1, n(2), n(1)], tlm); tm = tlm; break;
      case "Tm": endRun(); tm = tlm = [n(6), n(5), n(4), n(3), n(2), n(1)]; break;
      case "T*": endRun(); tlm = mul([1, 0, 0, 1, 0, -TL], tlm); tm = tlm; break;
      case "Tj": endRun(); show(n(1)); endRun(); break;
      case "'": endRun(); tlm = mul([1, 0, 0, 1, 0, -TL], tlm); tm = tlm; show(n(1)); endRun(); break;
      case '"': endRun(); Tw = n(3); Tc = n(2); tlm = mul([1, 0, 0, 1, 0, -TL], tlm); tm = tlm; show(n(1)); endRun(); break;
      case "TJ": {
        endRun();
        for (const el of n(1)) {
          if (el.t === "str") show(el.v);
          else if (el.t === "num") {
            if (el.v < RUN_BREAK) endRun();
            tm = mul([1, 0, 0, 1, -el.v / 1000 * size * Th, 0], tm);
          }
        }
        endRun();
        break;
      }
      case "m": cur = start = apply(ctm, n(2), n(1)); break;
      case "l": { const p = apply(ctm, n(2), n(1)); if (cur) path.push([cur, p]); cur = p; break; }
      case "h": if (cur && start) path.push([cur, start]); cur = start; break;
      case "re": {
        const [x, y, w, h] = [n(4), n(3), n(2), n(1)];
        const c = [apply(ctm, x, y), apply(ctm, x + w, y), apply(ctm, x + w, y + h), apply(ctm, x, y + h)];
        path.push([c[0], c[1]], [c[1], c[2]], [c[2], c[3]], [c[3], c[0]]);
        break;
      }
      case "S": case "s": case "b": case "B": case "b*": case "B*":
        for (const [a, b] of path) segs.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
        path = []; cur = null; break;
      case "f": case "F": case "f*": case "n":
        path = []; cur = null; break;
      case "BI": refuse("an inline image in a table page is not handled by this reader");
      default: break;
    }
    operands.length = 0;
  }
  endRun();
  return { runs, segs };
}

export function readPdfPages(buf) {
  const pdf = parsePdf(buf);
  return pdf.pages.map((page) => {
    const fonts = fontsOfPage(page, pdf.get);
    const refs = [];
    const arrm = page.dict.match(/\/Contents\s*\[([^\]]*)\]/);
    if (arrm) for (const m of arrm[1].matchAll(/(\d+)\s+0\s+R/g)) refs.push(Number(m[1]));
    else { const one = page.dict.match(/\/Contents\s+(\d+)\s+0\s+R/); if (one) refs.push(Number(one[1])); }
    const content = refs.map((r) => {
      const s = pdf.get(r).stream;
      if (!s) refuse(`page content object ${r} carries no stream`);
      return s.toString("latin1");
    }).join("\n");
    return readPage(content, fonts);
  });
}

// ---------------------------------------------------------------------------------------------
// Grids and tables.

const TOL = 0.6; // user-space units; the rules and glyph edges in this document sit on whole 0.1 steps

export function gridsOf(segs) {
  const vert = segs.filter((s) => Math.abs(s.x1 - s.x2) < 0.05 && Math.abs(s.y1 - s.y2) > 5)
    .map((s) => ({ x: s.x1, ylo: Math.min(s.y1, s.y2), yhi: Math.max(s.y1, s.y2) }));
  const horiz = segs.filter((s) => Math.abs(s.y1 - s.y2) < 0.05 && Math.abs(s.x1 - s.x2) > 5)
    .map((s) => ({ y: s.y1, xlo: Math.min(s.x1, s.x2), xhi: Math.max(s.x1, s.x2) }));
  const groups = new Map();
  for (const v of vert) {
    const key = `${v.ylo.toFixed(1)}|${v.yhi.toFixed(1)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(v);
  }
  const grids = [];
  for (const vs of groups.values()) {
    if (vs.length < 3) continue;
    const xs = uniq(vs.map((v) => v.x));
    const { ylo, yhi } = vs[0];
    const xlo = xs[0], xhi = xs[xs.length - 1];
    const ys = uniq(horiz.filter((h) => Math.abs(h.xlo - xlo) < TOL && Math.abs(h.xhi - xhi) < TOL && h.y > ylo - TOL && h.y < yhi + TOL).map((h) => h.y));
    if (ys.length >= 3) grids.push({ xs, ys: ys.sort((a, b) => b - a), xlo, xhi, ylo, yhi });
  }
  return grids.sort((a, b) => b.yhi - a.yhi);
}

function uniq(nums) {
  const out = [];
  for (const v of [...nums].sort((a, b) => a - b)) if (!out.length || v - out[out.length - 1] > 0.05) out.push(v);
  return out;
}

// Read one ruled table. `cols` and `rows` are the expected header runs (l values and k labels);
// anything else refuses. Returns cells keyed "k,l" with { top, mid, bottom } strings.
export function readTable(page, grid, { name, cols, rows }) {
  const bands = (edges) => {
    const out = [];
    for (let i = 0; i + 1 < edges.length; i++) if (Math.abs(edges[i + 1] - edges[i]) > 3) out.push([edges[i], edges[i + 1]]);
    return out;
  };
  const colBands = bands(grid.xs); // [left, right]
  const rowBands = bands(grid.ys); // [top, bottom], y descending
  if (colBands.length !== cols.length + 1) refuse(`${name}: the grid has ${colBands.length - 1} data column(s), expected ${cols.length}`);
  if (rowBands.length !== rows.length + 1) refuse(`${name}: the grid has ${rowBands.length - 1} data row(s), expected ${rows.length}`);
  const inBand = (r, [top, bottom]) => r.y < top - TOL && r.y > bottom + TOL;
  const inGrid = (r) => r.x1 > grid.xlo + TOL && r.x0 < grid.xhi - TOL;
  // COMPLETENESS. Every text run inside the ruled box must end up in a cell, a header or a row
  // label. Without this, a run the band test excludes — one sitting ON a rule, or inside the 2-unit
  // gap between the double rules — is silently DROPPED, and a missing value reads as a blank cell,
  // which Table Ia legitimately has. Found by adversarial review 2026-09-17: moving one Table Ib
  // number onto its row boundary returned 49 cells instead of 50 and refused nothing, with every
  // positive control still passing. A dropped value is the one failure a per-cell check cannot see.
  // A run's INK, not its baseline: a glyph drawn just outside a rule still overlaps the table, and
  // testing the baseline alone let one sit a unit below the bottom rule and vanish (adversarial
  // review round 2, 2026-09-17: the real Table Ib's 16064 moved that way returned 49 cells with
  // R(10,10) missing and every positive control passing). Ascender and descender are approximated
  // from the font size, which is the only vertical extent the content stream gives us.
  const box = (r) => {
    const xOverlap = r.x1 > grid.xlo - TOL && r.x0 < grid.xhi + TOL;
    const yOverlap = r.y - r.desc < grid.ys[0] + TOL && r.y + r.asc > grid.ys[grid.ys.length - 1] - TOL;
    return xOverlap && yOverlap;
  };
  const inside = page.runs.filter(box);
  const placed = new Set();
  // Checked on everything that overlaps the table, BEFORE any run can be filtered out by a band
  // test: a glyph this reader cannot bound must stop the run, not be quietly excluded from it
  // (round 4 found a fixture glyph dropped before its unusable width was ever looked at).
  for (const r of inside) {
    if (r.unknownWidth) refuse(`${name}: "${r.text}" contains a glyph with no usable width, so its extent cannot be bounded`);
    if (r.disordered && /\d/.test(r.text)) refuse(`${name}: "${r.text}" is drawn with its glyphs out of left-to-right order, so the characters a reader sees may not be in this order`);
  }
  const colOf = (r) => {
    const hits = colBands.map((b, i) => (r.x0 >= b[0] - TOL && r.x1 <= b[1] + TOL ? i : -1)).filter((i) => i >= 0);
    if (hits.length !== 1) refuse(`${name}: "${r.text}" at x ${r.x0.toFixed(1)}–${r.x1.toFixed(1)} crosses a ruled column boundary`);
    return hits[0];
  };
  const runsIn = (band) => {
    const out = inside.filter((r) => inBand(r, band));
    for (const r of out) placed.add(r);
    return out;
  };

  // Header: exactly one integer per data column, equal to the expected l.
  const header = runsIn(rowBands[0]);
  const found = new Map();
  for (const r of header) {
    if (r.y + r.asc > rowBands[0][0] + TOL || r.y - r.desc < rowBands[0][1] - TOL) {
      refuse(`${name}: the header entry "${r.text}" crosses the rules of the header row`);
    }
    const c = colOf(r);
    if (c === 0) continue; // the corner label ("l", "k")
    if (!/^\d+$/.test(r.text)) refuse(`${name}: header cell holds "${r.text}", not a column number`);
    if (found.has(c)) refuse(`${name}: header column ${c} holds two numbers`);
    found.set(c, Number(r.text));
  }
  cols.forEach((l, i) => {
    if (found.get(i + 1) !== l) refuse(`${name}: header column ${i + 1} reads ${found.get(i + 1) ?? "nothing"}, expected l = ${l}`);
  });

  const cells = new Map();
  const offsets = { top: [], bottom: [] };
  rows.forEach((k, ri) => {
    const band = rowBands[ri + 1];
    const inRow = runsIn(band);
    // The glyphs must also FIT the row they are assigned to. asc/desc were used only to decide
    // whether a run touches the table at all, so text scaled tall enough to span two ruled rows was
    // still accepted into one of them (round 4, reproduced with a 5x vertical matrix).
    for (const r of inRow) {
      if (r.y + r.asc > band[0] + TOL || r.y - r.desc < band[1] - TOL) {
        refuse(`${name}: "${r.text}" is drawn ${(r.y + r.asc).toFixed(2)}–${(r.y - r.desc).toFixed(2)}, which crosses the rules of the row it sits in (${band[0].toFixed(2)}–${band[1].toFixed(2)})`);
      }
    }
    const labels = inRow.filter((r) => colOf(r) === 0);
    if (labels.length !== 1 || labels[0].text !== String(k)) {
      refuse(`${name}: row ${ri + 1} is labelled ${JSON.stringify(labels.map((r) => r.text))}, expected k = ${k}`);
    }
    const mid = labels[0].y;
    const data = inRow.filter((r) => colOf(r) > 0);
    const above = uniq(data.filter((r) => r.y > mid + 1).map((r) => r.y));
    const below = uniq(data.filter((r) => r.y < mid - 1).map((r) => r.y));
    if (above.length > 1 || below.length > 1) refuse(`${name}: row k = ${k} has more than three text lines`);
    for (const r of data) {
      // A line sits on the row label's baseline (middle) or a plausible line-height above or below
      // it. Anything in between is a glyph this reader cannot assign to a line, so it refuses.
      const dy = r.y - mid;
      let line;
      if (Math.abs(dy) <= 1) line = "mid";
      else if (Math.abs(dy) >= 4 && Math.abs(dy) <= 9) { line = dy > 0 ? "top" : "bottom"; offsets[line].push(Math.abs(dy)); }
      else refuse(`${name}: "${r.text}" in row k = ${k} sits ${dy.toFixed(2)} from the row's middle line, which is not its middle, upper or lower line`);
      const l = cols[colOf(r) - 1];
      const key = `${k},${l}`;
      if (!cells.has(key)) cells.set(key, { k, l });
      const cell = cells.get(key);
      if (cell[line] !== undefined) refuse(`${name}: cell R(${k},${l}) has two entries on its ${line} line ("${cell[line]}", "${r.text}")`);
      cell[line] = r.text;
    }
  });
  for (const line of ["top", "bottom"]) {
    const o = offsets[line];
    if (o.length && Math.max(...o) - Math.min(...o) > 1) refuse(`${name}: the ${line} line sits at different heights in different rows (${Math.min(...o).toFixed(2)} to ${Math.max(...o).toFixed(2)})`);
  }
  const dropped = inside.filter((r) => !placed.has(r));
  if (dropped.length) {
    const d = dropped[0];
    refuse(`${name}: ${dropped.length} text run(s) inside the table were not placed in any row — the first is "${d.text}" at y ${d.y.toFixed(2)}, which sits on a ruled boundary rather than on a row's line. A value this reader cannot place is not a blank cell.`);
  }
  return cells;
}

// ---------------------------------------------------------------------------------------------
// Section 2.1 of DS1.

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const int = (name, key, s) => {
  if (!/^\d+$/.test(s)) refuse(`${name}: cell R(${key}) holds "${s}", not an integer`);
  return Number(s);
};

function findCaption(pages, label) {
  const hits = [];
  pages.forEach((p, pi) => {
    for (const r of p.runs) {
      if (r.text !== label) continue;
      if (p.runs.some((q) => q.text === "Table" && Math.abs(q.y - r.y) < 0.5 && q.x1 <= r.x0 + 0.5 && r.x0 - q.x1 < 8)) hits.push({ pi, y: r.y });
    }
  });
  return hits;
}

export function extractSection21(buf) {
  const pages = readPdfPages(buf);
  const ia = findCaption(pages, "Ia.").filter((h) => pages[h.pi].runs.some((r) => r.text === "Known" && Math.abs(r.y - h.y) < 0.5));
  const ib = findCaption(pages, "Ib.").filter((h) => pages[h.pi].runs.some((r) => r.text === "Upper" && Math.abs(r.y - h.y) < 0.5));
  if (ia.length !== 1) refuse(`expected exactly one "Table Ia. Known …" caption, found ${ia.length}`);
  if (ib.length !== 1) refuse(`expected exactly one "Table Ib. Upper …" caption, found ${ib.length}`);

  const pageIa = pages[ia[0].pi];
  const gridsIa = gridsOf(pageIa.segs);
  const valuesGrid = gridsIa.filter((g) => g.ylo > ia[0].y).sort((a, b) => a.ylo - b.ylo)[0];
  const refsGrid = gridsIa.filter((g) => g.yhi < ia[0].y).sort((a, b) => b.yhi - a.yhi)[0];
  if (!valuesGrid) refuse("no ruled grid above the Table Ia caption");
  if (!refsGrid) refuse("no ruled grid below the Table Ia caption (its reference table)");
  const pageIb = pages[ib[0].pi];
  const gridIb = gridsOf(pageIb.segs).filter((g) => g.ylo > ib[0].y).sort((a, b) => a.ylo - b.ylo)[0];
  if (!gridIb) refuse("no ruled grid above the Table Ib caption");

  const vals = readTable(pageIa, valuesGrid, { name: "Table Ia", cols: range(3, 15), rows: range(3, 10) });
  const refs = readTable(pageIa, refsGrid, { name: "Table Ia references", cols: range(4, 15), rows: range(3, 10) });
  const ibCells = readTable(pageIb, gridIb, { name: "Table Ib", cols: range(5, 15), rows: range(4, 10) });
  const tableIa = assembleIa(vals, refs);
  const tableIb = assembleIb(ibCells);
  checkControls(tableIa, tableIb);
  return { tableIa, tableIb, pages: { tableIa: ia[0].pi + 1, tableIb: ib[0].pi + 1 }, firstPageText: pages[0].runs.map((r) => r.text).join(" ") };
}

// Table Ia's values joined to its reference table, cell by cell. Exported so each refusal is
// tested directly, not only through a PDF.
export function assembleIa(vals, refs) {
  const K = range(3, 10);
  const tableIa = [];
  for (const k of K) {
    for (const l of range(3, 15)) {
      const key = `${k},${l}`;
      const v = vals.get(key);
      const rf = refs.get(key) ?? {};
      if (!v) {
        if (rf.top || rf.mid || rf.bottom) refuse(`Table Ia references: R(${key}) carries a reference where Table Ia prints no value`);
        continue;
      }
      if (l < k) refuse(`Table Ia: R(${key}) is below the diagonal and should be empty`);
      if (v.mid !== undefined && (v.top !== undefined || v.bottom !== undefined)) refuse(`Table Ia: R(${key}) prints an exact value and a bound together`);
      if (v.mid !== undefined) {
        if (rf.mid && (rf.top || rf.bottom)) refuse(`Table Ia references: R(${key}) has a centred reference and a split pair`);
        tableIa.push({ k, l, exact: int("Table Ia", key, v.mid), ...(rf.mid ? { ref: rf.mid } : {}), ...(rf.top ? { lowerRef: rf.top } : {}), ...(rf.bottom ? { upperRef: rf.bottom } : {}) });
      } else {
        if (rf.mid) refuse(`Table Ia references: R(${key}) has a centred reference but Table Ia prints bounds`);
        if (rf.top && v.top === undefined) refuse(`Table Ia references: R(${key}) credits a lower bound Table Ia does not print`);
        if (rf.bottom && v.bottom === undefined) refuse(`Table Ia references: R(${key}) credits an upper bound Table Ia does not print`);
        tableIa.push({ k, l,
          ...(v.top !== undefined ? { lower: int("Table Ia", key, v.top) } : {}),
          ...(v.bottom !== undefined ? { upper: int("Table Ia", key, v.bottom) } : {}),
          ...(rf.top ? { lowerRef: rf.top } : {}), ...(rf.bottom ? { upperRef: rf.bottom } : {}) });
      }
    }
  }
  for (const key of refs.keys()) if (!vals.has(key)) refuse(`Table Ia references: R(${key}) has references and no value`);
  return tableIa;
}

export function assembleIb(ibCells) {
  const tableIb = [];
  for (const k of range(4, 10)) {
    for (const l of range(5, 15)) {
      const c = ibCells.get(`${k},${l}`);
      if (!c) continue;
      if (c.top !== undefined || c.bottom !== undefined) refuse(`Table Ib: R(${k},${l}) is printed off the row's line`);
      if (l < k) refuse(`Table Ib: R(${k},${l}) is below the diagonal and should be empty`);
      tableIb.push({ k, l, upper: int("Table Ib", `${k},${l}`, c.mid) });
    }
  }
  for (const key of ibCells.keys()) {
    const [k, l] = key.split(",").map(Number);
    if (k < 4 || k > 10 || l < 5 || l > 15) refuse(`Table Ib: R(${key}) is outside the table's range`);
  }
  return tableIb;
}

// The positive controls, from the survey's prose (see the header). Exported so the selftest can
// show each one refusing a table that disagrees with it.
export function checkControls(tableIa, tableIb) {
  const ia = (k, l) => tableIa.find((c) => c.k === k && c.l === l) ?? {};
  const ib = (k, l) => tableIb.find((c) => c.k === k && c.l === l) ?? {};
  const fails = [];
  if (ia(3, 9).exact !== 36) fails.push(`R(3,9) should read exact 36 (note (g)); Table Ia gave ${JSON.stringify(ia(3, 9))}`);
  if (ia(4, 5).exact !== 25) fails.push(`R(4,5) should read exact 25 (note (g)); Table Ia gave ${JSON.stringify(ia(4, 5))}`);
  if (ia(5, 5).lower !== 43 || ia(5, 5).upper !== 46) fails.push(`R(5,5) should read 43 to 46 (note (e)); Table Ia gave ${JSON.stringify(ia(5, 5))}`);
  if (ib(5, 5).upper !== 46) fails.push(`R(5,5) upper bound should read 46 (note (e)); Table Ib gave ${JSON.stringify(ib(5, 5))}`);
  if (fails.length) refuse(`positive control failed — the reader has misplaced something:\n  ${fails.join("\n  ")}`);
}

// ---------------------------------------------------------------------------------------------
// The committed ledger file.

export function serialize(doc) {
  const line = (o) => `    ${JSON.stringify(o)}`;
  return [
    "{",
    `  "source": ${JSON.stringify(doc.source, null, 2).replace(/\n/g, "\n  ")},`,
    `  "extractedBy": ${JSON.stringify(doc.extractedBy)},`,
    `  "tableIa": [\n${doc.tableIa.map(line).join(",\n")}\n  ],`,
    `  "tableIb": [\n${doc.tableIb.map(line).join(",\n")}\n  ]`,
    "}",
    "",
  ].join("\n");
}

async function loadPdf(args) {
  const i = args.indexOf("--pdf");
  if (i >= 0) return readFileSync(args[i + 1]);
  const res = await fetchWithRetry(PDF_URL, { headers: { "user-agent": "bounds-ledger-ds1" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${PDF_URL}`);
  return Buffer.from(await res.arrayBuffer());
}

const sha256 = (b) => createHash("sha256").update(b).digest("hex");

// WHAT THE RESPONSE IS, BEFORE WHAT IT HASHES TO. The order is the finding (adversarial review,
// 2026-09-17): comparing the fingerprint first classified an HTTP-200 sign-in page as SOURCE
// CHANGED, which the workflow titles as survey drift — a false record movement produced by a proxy.
// An HTTP 200 is evidence a server answered, never evidence you received the artefact you named
// (CLAUDE.md, 2026-08-12). A body that is not a PDF is a check error, and never a revision.
// Returns null when the bytes are the pinned PDF, or { code, message } when they are not.
export function preflight(buf, committed) {
  const head = buf.subarray(0, 8).toString("latin1");
  if (!head.startsWith("%PDF-")) {
    return { code: 2, message: `error: the survey URL answered ${buf.length} byte(s) that are not a PDF — it begins ${JSON.stringify(buf.subarray(0, 32).toString("latin1"))}. An HTTP 200 can be a sign-in or bot-challenge page. Nothing was compared, and this is NOT a revision.` };
  }
  if (!committed) return { code: 2, message: `error: no committed table at ${LEDGER}; nothing to compare against.` };
  const digest = sha256(buf);
  if (digest !== committed.source.sha256) {
    return { code: 1, message: `SOURCE CHANGED — the survey PDF's sha256 is now ${digest} (${buf.length} bytes); the ledger pins ${committed.source.sha256} (revision #${committed.source.revision}).\nA new revision is the event this area exists to see. Verify it against the survey, then re-derive with --write and commit deliberately. Never re-derive to silence this.` };
  }
  return null;
}

async function main(args) {
  if (args.includes("--selftest")) return selftest();
  const write = args.includes("--write");
  if (!write && !args.includes("--check")) {
    console.error("usage: extract-ds1.mjs --selftest | --check [--pdf <file>] | --write --revision N --revision-date YYYY-MM-DD [--pdf <file>]");
    return 2;
  }
  let buf;
  try { buf = await loadPdf(args); } catch (err) {
    // Prefixed `error:` so the workflow titles it as a check error, never as a record movement.
    console.log(`error: the survey PDF could not be read (${err.message}). This is not a revision; nothing was compared.`);
    return 2;
  }
  const digest = sha256(buf);
  const committed = existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, "utf8")) : null;

  if (write) {
    const notPdf = preflight(buf, { source: { sha256: digest, revision: 0 } }); // fingerprint cannot mismatch itself
    if (notPdf) { console.log(notPdf.message); return notPdf.code; }
  } else {
    const verdict = preflight(buf, committed);
    if (verdict) { console.log(verdict.message); return verdict.code; }
  }

  let ex;
  try { ex = extractSection21(buf); } catch (err) {
    if (err instanceof Refusal) { console.log(`REFUSED — ${err.message}\nNothing was written or compared. A partial table is never emitted.`); return 3; }
    throw err;
  }

  if (write) {
    const rv = args[args.indexOf("--revision") + 1];
    const rd = args[args.indexOf("--revision-date") + 1];
    if (!args.includes("--revision") || !/^\d+$/.test(rv ?? "") || !/^\d{4}-\d{2}-\d{2}$/.test(rd ?? "")) {
      console.log("ERROR — --write needs --revision N and --revision-date YYYY-MM-DD, read from the survey's front matter by a human.");
      return 2;
    }
    // Cross-check the hand-given revision against the PDF's own front matter, spaces ignored.
    if (!ex.firstPageText.replace(/\s+/g, "").includes(`revision#${rv}:`)) {
      console.log(`REFUSED — the first page does not state "revision #${rv}:"; the revision given does not match this PDF.`);
      return 3;
    }
    const doc = {
      source: {
        title: "Small Ramsey Numbers", author: "Stanisław Radziszowski", journal: "The Electronic Journal of Combinatorics",
        survey: "DS1", doi: "10.37236/21", revision: Number(rv), revisionDate: rd,
        landing: LANDING_URL, pdf: PDF_URL, sha256: digest, bytes: buf.length,
        section: "2.1 Values and bounds for R(k, l), k <= 10, l <= 15",
        pages: ex.pages,
      },
      extractedBy: "scripts/extract-ds1.mjs --write",
      tableIa: ex.tableIa,
      tableIb: ex.tableIb,
    };
    mkdirSync(dirname(LEDGER), { recursive: true });
    writeFileSync(LEDGER, serialize(doc));
    console.log(`WROTE ${LEDGER}: Table Ia ${ex.tableIa.length} cell(s), Table Ib ${ex.tableIb.length} cell(s), from ${buf.length} bytes sha256 ${digest}.`);
    return 0;
  }

  const expected = serialize({ ...committed, tableIa: ex.tableIa, tableIb: ex.tableIb });
  const actual = serialize(committed);
  if (expected !== actual) {
    const a = expected.split("\n"), b = actual.split("\n");
    const firstDiff = a.findIndex((line, i) => line !== b[i]);
    console.log(`DIFFERS — the pinned PDF re-derives to a different table than the ledger holds. First differing line ${firstDiff + 1}:\n  derived:   ${a[firstDiff]}\n  committed: ${b[firstDiff]}`);
    return 1;
  }
  console.log(`IN SYNC — revision #${committed.source.revision} (sha256 ${digest.slice(0, 16)}…) re-derives to the committed table: Table Ia ${ex.tableIa.length} cell(s), Table Ib ${ex.tableIb.length} cell(s); positive controls R(3,9), R(4,5) and R(5,5) hold.`);
  return 0;
}

// ---------------------------------------------------------------------------------------------
// Selftest: a synthetic PDF with a ruled table, built here, read by the same functions the check
// uses. Every refusal is shown refusing, and the good table is shown reading. Meaning first,
// exact-match last (the 2026-09-06 assertion-order rule).

export function buildPdf(pages, { zeroWidthFor = null } = {}) {
  const objs = [];
  const add = (body) => { objs.push(body); return objs.length; };
  const widths = Array.from({ length: 95 }, (_, i) => (zeroWidthFor && String.fromCharCode(32 + i) === zeroWidthFor ? 0 : 500));
  const fontObj = add("<</Type/Font/BaseFont/Times-Roman/FirstChar 32/LastChar 126/Widths[" + widths.join(" ") + "]/Encoding<</Type/Encoding/BaseEncoding/WinAnsiEncoding/Differences[194/acute]>>>>");
  const fontsObj = add(`<</R9 ${fontObj} 0 R>>`);
  const pageRefs = [];
  const pagesObjIndex = add(null);
  for (const content of pages) {
    const z = deflateSync(Buffer.from(content, "latin1"));
    const c = add({ z });
    pageRefs.push(add(`<</Type/Page/Parent ${pagesObjIndex} 0 R/Resources<</Font ${fontsObj} 0 R>>/Contents ${c} 0 R>>`));
  }
  objs[pagesObjIndex - 1] = `<</Type/Pages/Kids[${pageRefs.map((r) => `${r} 0 R`).join(" ")}]/Count ${pageRefs.length}>>`;
  const catalog = add(`<</Type/Catalog/Pages ${pagesObjIndex} 0 R>>`);
  const parts = [Buffer.from("%PDF-1.4\n", "latin1")];
  objs.forEach((body, i) => {
    if (body && body.z) {
      parts.push(Buffer.from(`${i + 1} 0 obj\n<</Length ${body.z.length}/Filter /FlateDecode>>\nstream\n`, "latin1"), body.z, Buffer.from("\nendstream\nendobj\n", "latin1"));
    } else {
      parts.push(Buffer.from(`${i + 1} 0 obj\n${body}\nendobj\n`, "latin1"));
    }
  });
  parts.push(Buffer.from(`trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R >>\n%%EOF\n`, "latin1"));
  return Buffer.concat(parts);
}

// A 2 x 3 ruled table like Table Ia's shape: columns l = 3, 4, 5 and rows k = 3, 4.
// Row k = 3: exact 6 at l = 3; exact 9 at l = 4; lower 14 over upper 15 at l = 5.
// Row k = 4: exact 18 at l = 4; upper 25 only at l = 5 (a blank lower bound, which is legal).
export function fixtureTable({ shift = 0, extraOnLine = false, badBaseline = false, badHeader = false, onRule = false, rise = false, belowRule = false, acrossLeftRule = false, nestedRise = false, negTc = false, scaledOk = false, scaledBelowRule = false, mirrored = false, tallRow = false, backwardTJ = false } = {}) {
  const V = (x) => `${x} 50 m ${x} 130 l S`;
  const H = (y) => `50 ${y} m 250 ${y} l S`;
  const rules = [V(50), V(90), V(140), V(190), V(250), H(130), H(110), H(80), H(50)].join("\n");
  const txt = (x, y, s) => `BT /R9 10 Tf 1 0 0 1 ${x} ${y} Tm (${s}) Tj ET`;
  // `6 Ts` draws the glyph 6 units ABOVE the baseline the text matrix names — visibly on the row's
  // upper line, where a lower bound goes.
  const risen = (x, y, s) => `BT /R9 10 Tf 1 0 0 1 ${x} ${y} Tm 6 Ts (${s}) Tj 0 Ts ET`;
  return [
    rules,
    txt(60, 117, "l"), txt(110, 117, "3"), txt(160, 117, badHeader ? "7" : "4"), txt(215, 117, "5"),
    // row k = 3: middle line y = 94, upper line 100, lower line 88
    txt(65, 94, "3"), txt(110, 94, "6"),
    // A rise that survives a nested q/Q: the inner state sets it back to 0, the Q restores 6, and
    // the glyph is drawn on the upper line.
    nestedRise ? `BT /R9 10 Tf 6 Ts ET q BT 0 Ts ET Q BT /R9 10 Tf 1 0 0 1 160 94 Tm (9) Tj 0 Ts ET`
      // Negative character spacing shrinks the CURSOR's advance, never the glyph: this 9 starts at
      // 188 and its ink reaches 193, across the rule at 190, while the cursor stops at 190.
      : negTc ? `BT /R9 10 Tf -3 Tc 1 0 0 1 188 94 Tm (9) Tj 0 Tc ET`
      : rise ? risen(160, 94, "9") : txt(160, 94, "9"),
    txt(212 + shift, badBaseline ? 97 : 100, "14"), txt(212, onRule ? 80 : 88, "15"),
    extraOnLine ? txt(225, 100, "16") : "",
    // row k = 4: middle line y = 64. `belowRule` drops it a unit under the bottom rule and
    // `acrossLeftRule` hangs it over the left rule — both still overlap the table's ink.
    txt(65, 64, "4"), backwardTJ ? "" : txt(157, 64, "18"),
    // `scaledOk` draws the same visible glyphs as txt() by another route (size 100 at a 0.1x
    // matrix); it must be ACCEPTED. `scaledBelowRule` uses size 4 at 2x below the bottom rule,
    // where the glyphs still overlap the table; it must be REFUSED. Both come from round 3's
    // reproduction: geometry must be measured in page coordinates, not in font-size units.
    scaledOk ? `BT /R9 100 Tf 0.1 0 0 0.1 212 58 Tm (25) Tj ET`
      : scaledBelowRule ? `BT /R9 4 Tf 2 0 0 2 212 49 Tm (25) Tj ET`
      // Mirrored horizontally; upright bounds cannot be derived from it.
      : mirrored ? `BT /R9 10 Tf -1 0 0 1 222 58 Tm (25) Tj ET`
      // Five times tall: its glyphs cross the rules of the row it sits in.
      : tallRow ? `BT /R9 10 Tf 1 0 0 5 212 58 Tm (25) Tj ET`
      : txt(acrossLeftRule ? 40.5 : 212, belowRule ? 49 : 58, "25"),
    // A positive TJ adjustment moves the cursor BACKWARDS: the stream says 1 then 8, the page shows
    // 8 then 1. Drawn in the k = 4 row's l = 4 cell, replacing its plain 18.
    backwardTJ ? `BT /R9 10 Tf 1 0 0 1 165 64 Tm [(1) 2500 (8)] TJ ET` : "",
  ].join("\n");
}

function selftest() {
  const fail = (msg) => { console.error(`extract-ds1 selftest FAIL: ${msg}`); process.exitCode = 1; return 1; };
  const read = (opts, pdfOpts) => {
    const pages = readPdfPages(buildPdf([fixtureTable(opts)], pdfOpts));
    const grid = gridsOf(pages[0].segs)[0];
    return readTable(pages[0], grid, { name: "fixture", cols: [3, 4, 5], rows: [3, 4] });
  };
  const refusesWith = (opts, re, label, pdfOpts) => {
    try { read(opts, pdfOpts); } catch (err) {
      if (!(err instanceof Refusal)) return fail(`${label}: threw a non-refusal error: ${err.message}`);
      if (!re.test(err.message)) return fail(`${label}: refused for the wrong reason: ${err.message}`);
      return 0;
    }
    return fail(`${label}: did NOT refuse`);
  };

  // Refusals carry the meaning, so they go first.
  if (refusesWith({ shift: 30 }, /crosses a ruled column boundary/, "a number shifted across a column rule")) return 1;
  if (refusesWith({ extraOnLine: true }, /two entries on its top line/, "two numbers on one line of one cell")) return 1;
  if (refusesWith({ badHeader: true }, /header column 2 reads 7, expected l = 4/, "a header that is not the expected l")) return 1;
  if (refusesWith({ badBaseline: true }, /not its middle, upper or lower line/, "a baseline off the row's three lines")) return 1;
  if (refusesWith({ onRule: true }, /not placed in any row/, "a number sitting ON a ruled boundary (it must refuse, never drop it)")) return 1;
  if (refusesWith({ belowRule: true }, /not placed in any row/, "a number whose glyphs hang below the bottom rule")) return 1;
  if (refusesWith({ acrossLeftRule: true }, /crosses a ruled column boundary/, "a number hanging across the left-hand rule")) return 1;
  if (refusesWith({ negTc: true }, /crosses a ruled column boundary/, "a glyph whose INK crosses a column rule while negative character spacing keeps the cursor inside")) return 1;
  if (refusesWith({ scaledBelowRule: true }, /not placed in any row/, "scaled text whose glyphs overlap the table from below the bottom rule")) return 1;
  if (refusesWith({ mirrored: true }, /mirrored or flipped text/, "a mirrored text matrix")) return 1;
  if (refusesWith({ tallRow: true }, /crosses the rules of the row it sits in/, "text tall enough to span two ruled rows")) return 1;
  if (refusesWith({ backwardTJ: true }, /out of left-to-right order/, "digits drawn out of order by a positive TJ adjustment")) return 1;
  if (refusesWith({}, /no usable width/, "a glyph whose font gives it no usable width", { zeroWidthFor: "9" })) return 1;
  // Text rise survives a nested q/Q, because the text state is part of the saved graphics state.
  try {
    const nested = read({ nestedRise: true });
    const c = nested.get("3,4");
    if (!(c && c.top === "9" && c.mid === undefined)) return fail(`a rise restored by Q was read as ${JSON.stringify(c)}, expected the glyph on the row's upper line`);
  } catch (err) { return fail(`the nested-rise fixture threw: ${err.message}`); }
  // Text rise moves a glyph to the line a reader sees it on, so the classification follows it.
  try {
    const risen = read({ rise: true });
    const c = risen.get("3,4");
    if (!(c && c.top === "9" && c.mid === undefined)) return fail(`a glyph raised by 6 Ts was read as ${JSON.stringify(c)}, expected it on the row's upper line`);
  } catch (err) { return fail(`the text-rise fixture threw: ${err.message}`); }
  // Preflight order: what the response IS, before what it hashes to.
  const committed = { source: { sha256: "a".repeat(64), revision: 18 } };
  const html = Buffer.from('<!DOCTYPE html><html><head><title>Sign in</title></head><body>…</body></html>');
  const notPdf = preflight(html, committed);
  if (!notPdf || notPdf.code !== 2 || !/not a PDF/.test(notPdf.message) || /SOURCE CHANGED/.test(notPdf.message)) {
    return fail(`an HTTP-200 HTML body was classified as ${JSON.stringify(notPdf)}, expected a check error and never a source change`);
  }
  const moved = preflight(Buffer.from("%PDF-1.4\nnot the pinned bytes"), committed);
  if (!moved || moved.code !== 1 || !/SOURCE CHANGED/.test(moved.message)) return fail(`a real PDF with different bytes was classified as ${JSON.stringify(moved)}, expected SOURCE CHANGED`);
  const pinned = Buffer.from("%PDF-1.4\npinned");
  if (preflight(pinned, { source: { sha256: createHash("sha256").update(pinned).digest("hex"), revision: 18 } }) !== null) return fail("the pinned bytes did not pass preflight");
  // Assembly refusals, on cell maps shaped exactly as readTable returns them.
  const cellMap = (entries) => new Map(entries.map((c) => [`${c.k},${c.l}`, c]));
  const assemblyRefuses = (fn, re, label) => {
    try { fn(); } catch (err) {
      if (err instanceof Refusal && re.test(err.message)) return 0;
      return fail(`${label}: refused for the wrong reason: ${err.message}`);
    }
    return fail(`${label}: did NOT refuse`);
  };
  if (assemblyRefuses(() => assembleIa(cellMap([{ k: 3, l: 5, mid: "14", top: "14" }]), new Map()), /exact value and a bound together/, "an exact value printed beside a bound")) return 1;
  if (assemblyRefuses(() => assembleIa(cellMap([{ k: 3, l: 5, top: "14", bottom: "15" }]), cellMap([{ k: 3, l: 6, top: "Ex1" }])), /carries a reference where Table Ia prints no value/, "a reference in a cell with no value")) return 1;
  if (assemblyRefuses(() => assembleIa(cellMap([{ k: 3, l: 5, bottom: "15" }]), cellMap([{ k: 3, l: 5, top: "Ex1" }])), /credits a lower bound Table Ia does not print/, "a lower-bound reference with no lower bound")) return 1;
  if (assemblyRefuses(() => assembleIa(cellMap([{ k: 5, l: 4, mid: "25" }]), new Map()), /below the diagonal/, "a value below the diagonal")) return 1;
  // The silent half of assembly: a well-formed cell pair joins without refusing.
  const joined = assembleIa(cellMap([{ k: 3, l: 5, top: "14", bottom: "15" }]), cellMap([{ k: 3, l: 5, top: "Ex1", bottom: "GG" }]));
  if (JSON.stringify(joined) !== JSON.stringify([{ k: 3, l: 5, lower: 14, upper: 15, lowerRef: "Ex1", upperRef: "GG" }])) return fail(`a well-formed cell joined wrong: ${JSON.stringify(joined)}`);
  try { parsePdf(Buffer.from("not a pdf")); return fail("a non-PDF was not refused"); } catch (err) { if (!(err instanceof Refusal)) return fail("a non-PDF threw a non-refusal error"); }
  try { parsePdf(Buffer.from("%PDF-1.5\n1 0 obj\n<</Type/ObjStm>>\nendobj\n")); return fail("an object-stream PDF was not refused"); } catch (err) { if (!(err instanceof Refusal)) return fail("an object-stream PDF threw a non-refusal error"); }
  try { checkControls([{ k: 3, l: 9, exact: 36 }, { k: 4, l: 5, exact: 25 }, { k: 5, l: 5, lower: 43, upper: 47 }], [{ k: 5, l: 5, upper: 46 }]); return fail("a table contradicting note (e) passed the positive controls"); } catch (err) { if (!(err instanceof Refusal) || !/R\(5,5\) should read 43 to 46/.test(err.message)) return fail(`the positive control refused for the wrong reason: ${err.message}`); }

  // The silent half: the well-formed table reads, blank lower bound included — and text expressed
  // at a different font size and matrix scale, but drawn in the same place, reads identically. A
  // completeness test that over-fires on legitimate geometry is as bad as one that under-fires.
  let cells;
  try { cells = read({}); } catch (err) { return fail(`the well-formed fixture was refused: ${err.message}`); }
  try {
    const scaled = read({ scaledOk: true });
    const asText = (m) => JSON.stringify([...m].map(([k, c]) => [k, c.mid, c.top, c.bottom]));
    if (asText(scaled) !== asText(cells)) return fail(`the same glyphs drawn at size 100 with a 0.1x matrix read differently: ${asText(scaled)}`);
  } catch (err) { return fail(`equivalent scaled text was refused: ${err.message}`); }
  const want = { "3,3": { mid: "6" }, "3,4": { mid: "9" }, "3,5": { top: "14", bottom: "15" }, "4,4": { mid: "18" }, "4,5": { bottom: "25" } };
  const got = Object.fromEntries([...cells].map(([k, c]) => [k, Object.fromEntries(Object.entries(c).filter(([f]) => f !== "k" && f !== "l"))]));
  if (JSON.stringify(got) !== JSON.stringify(want)) return fail(`the well-formed fixture read wrong: ${JSON.stringify(got)}`);

  // An accent glyph composes onto the letter before it (the survey's reference key "Kéry").
  const f = fontFrom("<</FirstChar 32/Widths[" + Array.from({ length: 200 }, () => 500).join(" ") + "]/Encoding<</Differences[194/acute]>>>>", () => ({ dict: "" }));
  const accent = readPage("BT /R9 10 Tf 1 0 0 1 10 10 Tm [(K)-7(e)402(\\302)-63(ry)] TJ ET", new Map([["R9", f]]));
  if (accent.runs.length !== 1 || accent.runs[0].text !== "Kéry") return fail(`accent composition read ${JSON.stringify(accent.runs.map((r) => r.text))}, expected ["Kéry"]`);
  console.log("extract-ds1 selftest: PASS (refuses a number crossing a column rule, two numbers on one line, a wrong header, an off-line baseline, a number ON a ruled boundary, a number hanging BELOW the bottom rule, a number hanging ACROSS the left rule, a glyph whose ink crosses a rule while negative character spacing hides it, scaled text overlapping the table from outside it, a mirrored text matrix, text tall enough to span two ruled rows, digits drawn out of order by a backwards TJ adjustment, a glyph whose font gives it no usable width, an exact value beside a bound, a reference with no value, a reference to a bound not printed, a value below the diagonal, a non-PDF, an object-stream PDF and a table contradicting the prose controls; honours text rise, including a rise restored by Q, so a raised glyph reads on the line it is drawn on; classifies a non-PDF body as a check error and never as a source change; reads a well-formed table with a blank lower bound; reads equivalent text drawn at size 100 with a 0.1x matrix identically; joins a well-formed cell; composes an accent onto its letter)");
  return 0;
}

if (isEntryModule(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; }).catch((err) => {
    console.error(`extract-ds1: error: ${err.message}`);
    process.exitCode = 2;
  });
}
