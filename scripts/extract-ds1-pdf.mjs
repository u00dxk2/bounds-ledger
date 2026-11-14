// extract-ds1-pdf.mjs — the minimal PDF text reader extract-ds1.mjs reads the survey with: classic
// cross-reference objects, fonts and glyph widths, and each page's positioned text runs and ruled
// segments. Moved out of extract-ds1.mjs unchanged on 2026-11-13; it imports nothing from that file,
// so there is no import cycle. It refuses (throws Refusal) rather than guess.

import { inflateSync } from "node:zlib";

export class Refusal extends Error {}
export const refuse = (msg) => { throw new Refusal(msg); };

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
