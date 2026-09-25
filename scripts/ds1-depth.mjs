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
//
// THE CENSUS (A-54's rebuild, rebuildScope2026_09_21 decision 2). A census reads EVERY bound in the
// frame, one credited paper at a time, so it is a different statistic from a draw and carries its own
// selection, "census", counted apart and never merged with the drawn count. Its order is not chosen:
// it is the frame's credited keys in order of first appearance, which censusOrder() derives and the
// store's census.order must equal, element by element. The unit of work is the PAPER, so a key the
// census has touched must have a census row for every bound the frame credits to it: half a paper is
// refused, because a coverage figure counting it would claim bounds nobody read.

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
    else left.push({ k: c.k, l: c.l, bound, value, ref: ref ?? null, why: ref ? `credited to item ${ref} of the survey, not a paper` : "no reference printed" });
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

// The census order: the frame's credited keys, each at its first appearance.
export function censusOrder(frame) {
  const order = [];
  for (const b of frame) if (!order.includes(b.ref)) order.push(b.ref);
  return order;
}

export const boundText = (b) => (b.bound === "exact" ? `R(${b.k}, ${b.l}) = ${b.value}` : b.bound === "lower" ? `R(${b.k}, ${b.l}) >= ${b.value}` : `R(${b.k}, ${b.l}) <= ${b.value}`);
export const sameBound = (a, b) => a.k === b.k && a.l === b.l && a.bound === b.bound && a.value === b.value && a.ref === b.ref;

// Reads the store against the frame. Returns { code, lines }: 0 counts, 2 nothing to count, 3 a row
// the frame does not hold or counts that do not sum.
export function readStore(store, frame) {
  const rows = Array.isArray(store?.rows) ? store.rows : null;
  if (!rows || rows.length === 0) return { code: 2, lines: ["ERROR — the store holds no reads, so there is nothing to count. That is a fact about the work, not about the survey."] };
  const lines = [];
  // THE DRAW IS RECONCILED, NOT TRUSTED. Without this a reading of ANY bound could carry
  // selection "systematic" and publish as chosen by the fixed rule (adversarial review round 5,
  // 2026-09-18) — which would quietly undo the one property the draw exists to give: that the
  // bounds read are not the ones that looked easy.
  const draws = Array.isArray(store?.draws) ? store.draws : [];
  const drawnAt = new Map();
  for (const d of draws) {
    if (d.frameSize !== frame.length) return { code: 3, lines: [`ERROR — draw ${d.slice} was taken over a frame of ${d.frameSize} and the committed table now gives ${frame.length}. A revision moved the table; the slice needs re-drawing before its readings are shown.`] };
    const want = drawPositions(frame.length);
    // ELEMENT BY ELEMENT, and against the RULE's own list. Comparing String(d.positions) accepted
    // the string "13,37,62,86,110", and `includes` then matched substrings, so position 3 read as
    // drawn (adversarial review round 6, 2026-09-18).
    if (!Array.isArray(d.positions) || d.positions.length !== want.length || want.some((p, i) => d.positions[i] !== p)) {
      return { code: 3, lines: [`ERROR — draw ${d.slice} records positions ${JSON.stringify(d.positions)} but the rule over a frame of ${frame.length} gives [${want}]`] };
    }
    for (const b of d.bounds ?? []) {
      if (!want.includes(b.position)) return { code: 3, lines: [`ERROR — draw ${d.slice} names position ${b.position}, which the rule did not pick`] };
      if (!sameBound(b, frame[b.position - 1])) return { code: 3, lines: [`ERROR — draw ${d.slice} says position ${b.position} is ${boundText(b)} credited to [${b.ref}]; the frame holds ${boundText(frame[b.position - 1])} credited to [${frame[b.position - 1].ref}]`] };
      drawnAt.set(b.position, b);
    }
  }
  for (const r of rows) {
    if (r.selection !== "systematic") continue;
    const b = drawnAt.get(r.position);
    if (!b) return { code: 3, lines: [`ERROR — ${r.id} says it was drawn at position ${r.position}, which no recorded draw picked. A reading not in a draw is hand-picked, and is counted as such.`] };
    if (!sameBound(b, r)) return { code: 3, lines: [`ERROR — ${r.id} reads ${boundText(r)} credited to [${r.ref}] at position ${r.position}, where the draw picked ${boundText(b)} credited to [${b.ref}]`] };
  }
  for (const r of rows) {
    if (!VERDICTS.includes(r.verdict)) return { code: 3, lines: [`ERROR — ${r.id} has verdict ${JSON.stringify(r.verdict)}, which is not one of ${VERDICTS.join(", ")}`] };
    if (!frame.some((b) => sameBound(b, r))) return { code: 3, lines: [`ERROR — ${r.id} reads ${boundText(r)} credited to [${r.ref}], which the committed table no longer prints. A new revision moved it; re-read it before it is shown.`] };
  }
  // THE CENSUS IS RECONCILED TOO: its order against the rule, each row against a key the order
  // holds, one row per bound, and every bound of a touched key present.
  const census = rows.filter((r) => r.selection === "census");
  const order = censusOrder(frame);
  if (census.length || store?.census !== undefined) {
    const stored = store?.census?.order;
    if (!Array.isArray(stored) || stored.length !== order.length || order.some((k, i) => stored[i] !== k)) {
      return { code: 3, lines: [`ERROR — the store's census order ${JSON.stringify(stored)} is not the frame's keys in order of first appearance [${order.join(", ")}]. The census order is derived, never chosen.`] };
    }
    // THE PROGRESSION IS RECONCILED, NOT ONLY THE ORDER (adversarial review, 2026-09-25): without
    // this a census of the LAST paper alone counted, skipping forty-one. Sessions plan a prefix of
    // the order, and the papers read are a prefix of what was planned.
    const planned = (Array.isArray(store?.census?.sessions) ? store.census.sessions : []).flatMap((s) => (Array.isArray(s.keys) ? s.keys : [null]));
    if (planned.some((k, i) => k !== order[i])) {
      return { code: 3, lines: [`ERROR — the census sessions plan [${planned.join(", ")}], which is not the start of the census order [${order.slice(0, planned.length).join(", ")}]. Sessions take the order in turn, never a paper out of it.`] };
    }
    const touched = new Set(census.map((r) => r.ref));
    const readPrefix = order.slice(0, touched.size);
    if (readPrefix.some((k) => !touched.has(k)) || touched.size > planned.length) {
      return { code: 3, lines: [`ERROR — the census has read [${[...touched].join(", ")}], which is not the first ${touched.size} paper(s) of the order [${readPrefix.join(", ")}] within the ${planned.length} planned. A paper the census reaches is read in turn; one that cannot be opened is recorded UNREACHABLE, never skipped.`] };
    }
    const seen = new Set();
    for (const r of census) {
      const key = `${r.k},${r.l},${r.bound},${r.value},${r.ref}`;
      if (seen.has(key)) return { code: 3, lines: [`ERROR — ${r.id} is a second census reading of ${boundText(r)} credited to [${r.ref}]; a census reads each bound once, so a second row would count it twice`] };
      seen.add(key);
    }
    for (const ref of new Set(census.map((r) => r.ref))) {
      const missing = frame.filter((b) => b.ref === ref && !census.some((r) => sameBound(r, b)));
      if (missing.length) return { code: 3, lines: [`ERROR — the census touched [${ref}] but has no census row for ${missing.map(boundText).join("; ")}. The unit is the paper: half a paper would be counted as coverage nobody read.`] };
    }
  }
  for (const sel of ["systematic", "hand-picked"]) {
    const part = rows.filter((r) => r.selection === sel);
    const counts = VERDICTS.map((v) => `${part.filter((r) => r.verdict === v).length} ${v.toLowerCase()}`).join(", ");
    lines.push(`${sel === "systematic" ? "drawn by position" : "picked by hand"}: ${part.length} read — ${counts}`);
  }
  const censusKeys = new Set(census.map((r) => r.ref)).size;
  const censusCounts = VERDICTS.map((v) => `${census.filter((r) => r.verdict === v).length} ${v.toLowerCase()}`).join(", ");
  lines.push(`census: ${census.length} of ${frame.length} bound(s), across ${censusKeys} of ${order.length} credited paper(s) — ${censusCounts}`);
  const counted = rows.filter((r) => r.selection === "systematic" || r.selection === "hand-picked" || r.selection === "census").length;
  if (counted !== rows.length) return { code: 3, lines: [`ERROR — ${rows.length - counted} row(s) carry no selection this reader knows, so they cannot be counted as drawn, picked by hand or census`] };
  return { code: 0, lines: [`depth reads (A-54, Small Ramsey Numbers Section 2.1): ${rows.length} reading(s) stored against a frame of ${frame.length} bound(s)`, ...lines, "A drawn count is a sample of five-per-slice, not a rate, and is never projected onto the frame. The census count is coverage of the frame and is never summed with the drawn count."] };
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
  // The fixture frame is 7 long, so the rule picks these positions; the draw below is the honest one.
  const pos = drawPositions(frame.length);
  const at = (p) => ({ position: p, ...frame[p - 1] });
  const draw = { slice: 1, frameSize: frame.length, positions: pos, bounds: pos.map(at) };
  const drawn = at(pos[0]);
  const ok = { id: "DS1-0001", ...drawn, verdict: "SOUND", selection: "systematic" };
  const withDraw = (rows) => ({ draws: [draw], rows });
  if (readStore(withDraw([]), frame).code !== 2) return fail("an empty store was counted");
  if (readStore({ draws: [draw] }, frame).code !== 2) return fail("a store with no rows was counted");
  if (readStore(withDraw([{ ...ok, value: ok.value + 1 }]), frame).code !== 3) return fail("a read of a value the table no longer prints was counted");
  if (readStore(withDraw([{ ...ok, verdict: "CHECKED" }]), frame).code !== 3) return fail("a fifth verdict was counted");
  if (readStore(withDraw([{ ...ok, selection: undefined }]), frame).code !== 3) return fail("a row with no selection was counted");
  // The draw reconciliation, both answers.
  const undrawn = frame.findIndex((b, i) => !pos.includes(i + 1)) + 1;
  if (readStore(withDraw([{ ...ok, ...at(undrawn) }]), frame).code !== 3) return fail(`a "systematic" read at position ${undrawn}, which no draw picked, was counted`);
  if (readStore(withDraw([{ ...ok, position: pos[1] }]), frame).code !== 3) return fail("a read whose bound is not the one drawn at its position was counted");
  if (readStore({ draws: [{ ...draw, positions: pos.map((p) => p) .map((p, i) => (i === 0 ? p + 1 : p)) }], rows: [ok] }, frame).code !== 3) return fail("a draw whose positions disagree with the rule was counted");
  if (readStore({ draws: [{ ...draw, bounds: draw.bounds.map((b, i) => (i === 0 ? { ...b, value: b.value + 1 } : b)) }], rows: [ok] }, frame).code !== 3) return fail("a draw whose bounds disagree with the frame was counted");
  if (readStore({ draws: [{ ...draw, frameSize: frame.length + 1 }], rows: [ok] }, frame).code !== 3) return fail("a draw taken over a different frame was counted");
  // Positions as a STRING, with a reading at a position that only appears inside it as a substring.
  const asString = { draws: [{ ...draw, positions: pos.join(",") }], rows: [{ ...ok, ...at(undrawn) }] };
  if (readStore(asString, frame).code !== 3) return fail("a draw whose positions are a string, admitting an undrawn position by substring, was counted");
  const good = readStore(withDraw([ok, { id: "DS1-0002", k: 3, l: 4, bound: "exact", value: 9, ref: "GG", verdict: "UNREACHABLE", selection: "hand-picked" }]), frame);
  if (good.code !== 0 || !good.lines.some((l) => /drawn by position: 1 read — 1 sound/.test(l)) || !good.lines.some((l) => /picked by hand: 1 read — 0 sound, 0 defective, 0 unresolved, 1 unreachable/.test(l))) return fail(`a well-formed store did not count cleanly: ${JSON.stringify(good)}`);
  // THE CENSUS, both answers. The fixture's order is GG, Ka2, GrY, Ex5, Ang1, HW+ (first appearance).
  const cOrder = censusOrder(frame);
  if (cOrder.join(",") !== "GG,Ka2,GrY,Ex5,Ang1,HW+") return fail(`census order: got ${cOrder}`);
  const cRow = (b, id, verdict = "SOUND") => ({ id, ...b, verdict, selection: "census" });
  const byKey = (k) => frame.filter((b) => b.ref === k);
  const readKeys = (keys) => keys.flatMap(byKey).map((b, i) => cRow(b, `DS1-C${i + 1}`));
  const withCensus = (rows, { order = cOrder, sessions = [{ session: 1, keys: cOrder.slice(0, 2) }] } = {}) => ({ draws: [draw], census: { order, sessions }, rows: [ok, ...rows] });
  // Each refusal is asserted by its OWN message, so a mutation names the property it broke rather
  // than tripping whichever check happens to run first.
  const refused = (store, re, label) => { const r = readStore(store, frame); return r.code === 3 && r.lines.some((l) => re.test(l)) ? null : fail(`${label}: ${JSON.stringify(r)}`); };
  const cGood = readStore(withCensus(readKeys(["GG", "Ka2"])), frame);
  if (cGood.code !== 0) return fail(`a well-formed census was refused: ${JSON.stringify(cGood)}`);
  if (!cGood.lines.some((l) => l === "census: 2 of 7 bound(s), across 2 of 6 credited paper(s) — 2 sound, 0 defective, 0 unresolved, 0 unreachable")) return fail(`census count line: ${JSON.stringify(cGood.lines)}`);
  if (!cGood.lines.some((l) => /drawn by position: 1 read — 1 sound/.test(l))) return fail("a census row leaked into the drawn count");
  if (readStore(withCensus([]), frame).code !== 0) return fail("a planned census with nothing read yet was refused");
  const allSix = { sessions: [{ session: 1, keys: cOrder }] };
  if (refused(withCensus(readKeys(["GG"]), { order: [...cOrder].reverse() }), /is not the frame's keys in order of first appearance/, "a census order that is not first appearance was counted")) return 1;
  if (refused({ draws: [draw], rows: [ok, ...readKeys(["GG"])] }, /is not the frame's keys in order of first appearance/, "a census with no recorded order was counted")) return 1;
  if (refused(withCensus([], { sessions: [{ session: 1, keys: ["Ka2", "GG"] }] }), /which is not the start of the census order/, "a session planning papers out of order was counted")) return 1;
  if (refused(withCensus(readKeys(["HW+"]), allSix), /which is not the first 1 paper\(s\) of the order/, "the LAST paper read alone, skipping the rest, was counted")) return 1;
  if (refused(withCensus(readKeys(["GG", "Ka2", "GrY"])), /within the 2 planned/, "a paper read beyond what the sessions planned was counted")) return 1;
  if (refused(withCensus([...readKeys(["GG"]), { ...readKeys(["GG"])[0], id: "DS1-C9" }]), /is a second census reading/, "the same bound read twice by the census was counted")) return 1;
  const fiveAndHalf = [...readKeys(["GG", "Ka2", "GrY", "Ex5", "Ang1"]), cRow(byKey("HW+")[0], "DS1-C9")];
  if (refused(withCensus(fiveAndHalf, allSix), /has no census row for R\(6, 14\) <= 5033/, "half a paper (one of [HW+]'s two bounds) was counted as census coverage")) return 1;
  if (refused(withCensus([{ ...readKeys(["GG"])[0], value: frame[0].value + 1 }]), /which the committed table no longer prints/, "a census read of a value the table no longer prints was counted")) return 1;
  if (refused(withCensus([{ ...readKeys(["GG"])[0], selection: "censsu" }]), /carry no selection this reader knows/, "a misspelt selection was counted")) return 1;
  console.log("ds1-depth selftest: PASS (the census counted apart from the drawn and hand-picked reads with its own coverage line, a planned census with nothing read yet accepted; each refused by its own message: an order that is not first appearance or is absent, a session planning out of order, the last paper read alone, a paper beyond the plan, a bound read twice, half a paper, a moved value, a misspelt selection; frame order and left-outs, one position per stratum, a frame under 5 refused, empty store refused, a moved value refused, a fifth verdict refused, an unselected row refused; the draw reconciled — a systematic read at an undrawn position, a read whose bound is not the one drawn there, a draw disagreeing with the rule, with the frame, taken over another frame, or carrying its positions as a string that admits an undrawn one by substring are each refused; a well-formed store counted with drawn and hand-picked apart)");
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
