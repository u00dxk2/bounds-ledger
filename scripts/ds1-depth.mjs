#!/usr/bin/env node
// ds1-depth.mjs — A-54 phase 4: the depth reads on the second watched area (Small Ramsey Numbers,
// Section 2.1), kept in their OWN store so they never enter A-47's count.
//
// usage: ds1-depth.mjs            verdict counts from continuity/depth-audit-ds1.json
//        ds1-depth.mjs --frame    every bound in the frame, numbered
//        ds1-depth.mjs --draw     the five positions the fixed rule picks, with the bound at each
//        ds1-depth.mjs --selftest network-free; both answers of every refusal
//
// THE UNIT IS ONE CREDITED BOUND, NOT ONE ENTRY. Table Ia credits R(3, 10)'s lower bound 40 to [Ex5]
// and its upper bound 41 to [Ang1]: two papers, two claims. Reading one says nothing about the other,
// so a verdict attaches to (k, l, which bound, the value, the key the survey credits) and the page
// shows each bound's state separately.
//
// THE FRAME. Every bound Table Ia prints with a credited PAPER, in k-then-l order, lower before upper.
// An exact value credited to one key is one bound; an exact value with separate lower and upper
// credits is two (the construction and the proof). Left out, and counted as left out: a value with no
// reference printed (R(3, 3) = 6), and a value credited to an item of the survey's own Section 2.3
// ("2.3.h"), which is not a paper. Table Ib is not in the frame: its caption credits its column to
// [AnM2], [AnM3], [AnM4] and [MR4] as a group, never cell by cell.
//
// THE DRAW RULE, fixed before any position was computed: the midpoints of five equal strata of the
// frame, position_i = floor((2i + 1) * N / 10) + 1 for i = 0..4, 1-based. It is deterministic, so
// anyone can re-derive it, and it was committed with its output before a single paper was opened.
// A record chosen by hand (the scope's R(5, 5) [AnM3]/[AnM4] question) is stored with
// selection "hand-picked" and never counted with the drawn ones.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isEntryModule } from "./lib/entry-module.mjs";
import { LEDGER } from "./extract-ds1.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const STORE = join(ROOT, "continuity", "depth-audit-ds1.json");
export const VERDICTS = ["SOUND", "DEFECTIVE", "UNRESOLVED", "UNREACHABLE"];
const SURVEY_ITEM = /^\d+\.\d+\.[a-z]$/;

export const isPaperKey = (ref) => typeof ref === "string" && ref !== "" && !SURVEY_ITEM.test(ref);

// Returns { frame, left } — the readable bounds in order, and the ones left out with why.
export function frameOf(doc) {
  const frame = [];
  const left = [];
  const cells = [...doc.tableIa].sort((a, b) => a.k - b.k || a.l - b.l);
  const take = (c, bound, value, ref) => {
    if (isPaperKey(ref)) frame.push({ k: c.k, l: c.l, bound, value, ref });
    else left.push({ k: c.k, l: c.l, bound, value, why: ref ? `credited to item ${ref} of the survey, not a paper` : "no reference printed" });
  };
  for (const c of cells) {
    if (c.exact !== undefined) {
      if (c.lowerRef || c.upperRef) { take(c, "lower", c.exact, c.lowerRef); take(c, "upper", c.exact, c.upperRef); }
      else take(c, "exact", c.exact, c.ref);
      continue;
    }
    if (c.lower !== undefined) take(c, "lower", c.lower, c.lowerRef);
    if (c.upper !== undefined) take(c, "upper", c.upper, c.upperRef);
  }
  return { frame, left };
}

export function drawPositions(n) {
  if (!Number.isInteger(n) || n < 5) throw new Error(`a frame of ${n} cannot give five distinct strata`);
  return [0, 1, 2, 3, 4].map((i) => Math.floor(((2 * i + 1) * n) / 10) + 1);
}

export const boundText = (b) => (b.bound === "exact" ? `R(${b.k}, ${b.l}) = ${b.value}` : b.bound === "lower" ? `R(${b.k}, ${b.l}) >= ${b.value}` : `R(${b.k}, ${b.l}) <= ${b.value}`);
export const sameBound = (a, b) => a.k === b.k && a.l === b.l && a.bound === b.bound && a.value === b.value && a.ref === b.ref;

// Reads the store against the frame. Returns { code, lines }: 0 counts, 2 nothing to count, 3 a row
// the frame does not hold or counts that do not sum.
export function readStore(store, frame) {
  const rows = Array.isArray(store?.rows) ? store.rows : null;
  if (!rows || rows.length === 0) return { code: 2, lines: ["ERROR — the store holds no reads, so there is nothing to count. That is a fact about the work, not about the survey."] };
  const lines = [];
  for (const r of rows) {
    if (!VERDICTS.includes(r.verdict)) return { code: 3, lines: [`ERROR — ${r.id} has verdict ${JSON.stringify(r.verdict)}, which is not one of ${VERDICTS.join(", ")}`] };
    if (!frame.some((b) => sameBound(b, r))) return { code: 3, lines: [`ERROR — ${r.id} reads ${boundText(r)} credited to [${r.ref}], which the committed table no longer prints. A new revision moved it; re-read it before it is shown.`] };
  }
  for (const sel of ["systematic", "hand-picked"]) {
    const part = rows.filter((r) => r.selection === sel);
    const counts = VERDICTS.map((v) => `${part.filter((r) => r.verdict === v).length} ${v.toLowerCase()}`).join(", ");
    lines.push(`${sel === "systematic" ? "drawn by position" : "picked by hand"}: ${part.length} read — ${counts}`);
  }
  const counted = rows.filter((r) => r.selection === "systematic" || r.selection === "hand-picked").length;
  if (counted !== rows.length) return { code: 3, lines: [`ERROR — ${rows.length - counted} row(s) carry no selection, so they cannot be counted as drawn or as picked by hand`] };
  return { code: 0, lines: [`depth reads (A-54, Small Ramsey Numbers Section 2.1): ${rows.length} bound(s) read of a frame of ${frame.length}`, ...lines, "A drawn count is a sample of five-per-slice, not a rate, and is never projected onto the frame."] };
}

function selftest() {
  const fail = (m) => { console.error(`ds1-depth selftest FAIL: ${m}`); process.exitCode = 1; return 1; };
  const doc = { tableIa: [
    { k: 3, l: 3, exact: 6 },
    { k: 3, l: 4, exact: 9, ref: "GG" },
    { k: 3, l: 7, exact: 23, lowerRef: "Ka2", upperRef: "GrY" },
    { k: 3, l: 10, lower: 40, upper: 41, lowerRef: "Ex5", upperRef: "Ang1" },
    { k: 6, l: 14, upper: 5033, upperRef: "HW+" },
    { k: 5, l: 15, lower: 275, upper: 1878, lowerRef: "2.3.h", upperRef: "HW+" },
  ] };
  const { frame, left } = frameOf(doc);
  const got = frame.map((b) => `${b.k},${b.l},${b.bound},${b.value},${b.ref}`).join(" | ");
  const want = "3,4,exact,9,GG | 3,7,lower,23,Ka2 | 3,7,upper,23,GrY | 3,10,lower,40,Ex5 | 3,10,upper,41,Ang1 | 5,15,upper,1878,HW+ | 6,14,upper,5033,HW+";
  if (got !== want) return fail(`frame order or membership: got ${got}`);
  if (left.length !== 2 || !left.some((x) => x.why === "no reference printed") || !left.some((x) => /item 2\.3\.h/.test(x.why))) return fail(`left-out bounds: ${JSON.stringify(left)}`);
  // The rule: distinct, in range, one per stratum.
  for (const n of [5, 7, 10, 91, 200]) {
    const p = drawPositions(n);
    if (new Set(p).size !== 5 || p.some((x) => x < 1 || x > n)) return fail(`drawPositions(${n}) = ${p}`);
    // Position p covers [p - 1, p) of the frame; it must contain its stratum's midpoint.
    for (let i = 0; i < 5; i++) { const mid = ((2 * i + 1) * n) / 10; if (!(p[i] - 1 <= mid && mid < p[i])) return fail(`drawPositions(${n}) position ${p[i]} does not contain stratum ${i + 1}'s midpoint ${mid}`); }
  }
  try { drawPositions(4); return fail("a frame of 4 was drawn from"); } catch { /* refused, as it must */ }
  // The store: both answers of each refusal.
  const ok = { id: "DS1-0001", k: 3, l: 10, bound: "upper", value: 41, ref: "Ang1", verdict: "SOUND", selection: "systematic" };
  if (readStore({ rows: [] }, frame).code !== 2) return fail("an empty store was counted");
  if (readStore({}, frame).code !== 2) return fail("a store with no rows was counted");
  if (readStore({ rows: [{ ...ok, value: 42 }] }, frame).code !== 3) return fail("a read of a value the table no longer prints was counted");
  if (readStore({ rows: [{ ...ok, verdict: "CHECKED" }] }, frame).code !== 3) return fail("a fifth verdict was counted");
  if (readStore({ rows: [{ ...ok, selection: undefined }] }, frame).code !== 3) return fail("a row with no selection was counted");
  const good = readStore({ rows: [ok, { ...ok, id: "DS1-0002", k: 3, l: 4, bound: "exact", value: 9, ref: "GG", verdict: "UNREACHABLE", selection: "hand-picked" }] }, frame);
  if (good.code !== 0 || !good.lines.some((l) => /drawn by position: 1 read — 1 sound/.test(l)) || !good.lines.some((l) => /picked by hand: 1 read — 0 sound, 0 defective, 0 unresolved, 1 unreachable/.test(l))) return fail(`a well-formed store did not count cleanly: ${JSON.stringify(good)}`);
  console.log("ds1-depth selftest: PASS (frame order and left-outs, one position per stratum, a frame under 5 refused, empty store refused, a moved value refused, a fifth verdict refused, an unselected row refused, a well-formed store counted with drawn and hand-picked apart)");
  return 0;
}

function main(args) {
  if (args.includes("--selftest")) return selftest();
  if (!existsSync(LEDGER)) { console.log(`ERROR — no table at ${LEDGER}`); return 2; }
  const doc = JSON.parse(readFileSync(LEDGER, "utf8"));
  const { frame, left } = frameOf(doc);
  if (args.includes("--frame") || args.includes("--draw")) {
    console.log(`frame: ${frame.length} credited bound(s) in Table Ia of revision #${doc.source.revision}, k-then-l order, lower before upper; ${left.length} left out (${left.map((x) => `${boundText(x)}: ${x.why}`).join("; ")})`);
    const show = args.includes("--draw") ? drawPositions(frame.length) : frame.map((_, i) => i + 1);
    if (args.includes("--draw")) console.log(`rule: position_i = floor((2i + 1) * ${frame.length} / 10) + 1, i = 0..4 -> ${show.join(", ")}`);
    for (const p of show) { const b = frame[p - 1]; console.log(`position ${p} of ${frame.length} — ${boundText(b)}, ${b.bound} bound credited to [${b.ref}]`); }
    return 0;
  }
  if (!existsSync(STORE)) { console.log(`ERROR — no store at ${STORE}, so there is nothing to count.`); return 2; }
  const r = readStore(JSON.parse(readFileSync(STORE, "utf8")), frame);
  for (const l of r.lines) console.log(l);
  console.log(r.code === 0 ? `RESULT: PASS — ${JSON.parse(readFileSync(STORE, "utf8")).rows.length} read(s) counted (exit 0)` : `RESULT: REFUSED (exit ${r.code})`);
  return r.code;
}

if (isEntryModule(import.meta.url)) process.exitCode = main(process.argv.slice(2));
