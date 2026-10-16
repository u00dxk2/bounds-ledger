#!/usr/bin/env node
// A-82: newer constructions this ledger has CHECKED ITSELF that the mirrored source table does not list.
//
// WHAT THE STORE IS. ledger/newer-results.json holds one entry per construction we evaluated against a
// constant's own mirrored definition. An entry exists only after a cross-family claims pass and an
// adversarial review, on David's 2026-10-16 decision (card 73149a3b, paraphrased on A-82).
//
// WHAT A READER SEES. A note BESIDE the constant's table on its c/ page:
//   - it never touches a bound cell; the page with the note, minus exactly the note's markup, is byte
//     for byte the page without it (the guard below), so the mirrored rows cannot change because of it;
//   - it never uses the word "record" (the same rule as the OpenAI-release notes);
//   - it says what we checked and how, gives the exact value we computed and the rounded value, links
//     the construction at a pinned commit, and says what the watch searched and what it did not.
//
// WHAT IT REFUSES. An entry whose value is not a valid printed bound for its exact maximum (an upper
// bound must round UP, a lower one DOWN), an entry that does not beat the table's best row on its side
// under the arXiv watcher's own exact comparison, a source link not pinned to a full commit sha, and a
// constant the mirror does not carry.
//
// WHAT IT NEVER SAYS. That upstream is wrong (its rows remain true bounds; it is behind), that anyone
// refereed the construction, or that upstream SHOULD list it. Upstream contact is David's gate.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { esc } from "./lib/html.mjs";
import { isEntryModule } from "./lib/entry-module.mjs";
import { constantsShown, compareConstant, parseBoundCell } from "./arxiv-watch.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const STORE = join(ROOT, "ledger", "newer-results.json");
const CONSTANTS = join(ROOT, "ledger", "teorth-optimizationproblems", "constants");

const FORBIDDEN = /\brecords?\b/i;
const DECIMAL = /^-?\d+\.\d+$/;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const PINNED_GITHUB = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/blob\/[0-9a-f]{40}\/[^\s"<>]+$/;
const ARXIV = /^https:\/\/arxiv\.org\/abs\/\d{4}\.\d{4,5}v\d+$/;

/** Load the store. Absent file means no notes, never a crash. */
export function loadStore(path = STORE) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}

// Exact decimal comparison on the printed strings (BigInt), never floating point.
const dec = (s) => { const neg = s.startsWith("-"); const [i, f = ""] = s.replace(/^-/, "").split("."); return { n: BigInt(`${neg ? "-" : ""}${i}${f}`), k: f.length }; };
const at = (d, k) => d.n * 10n ** BigInt(k - d.k);
const cmp = (a, b) => { const k = Math.max(a.k, b.k); const x = at(a, k), y = at(b, k); return x < y ? -1 : x > y ? 1 : 0; };

/** The best row's printed decimal on a side of a constant, or null when the side cannot be ranked. */
export function bestShown(id, side, shown = constantsShown()) {
  const s = shown.get(id)?.[side];
  return s && !s.unjudged ? s.digits : null;
}

/** Every problem with the store, as sentences. Empty means valid. */
export function validateStore(store, { shown = constantsShown(), constantExists = (id) => existsSync(join(CONSTANTS, `${id}.md`)) } = {}) {
  const errs = [];
  if (!store || typeof store !== "object") return ["the store is not an object"];
  if (!ISO.test(String(store.checkedThrough || ""))) errs.push("checkedThrough must be a YYYY-MM-DD date");
  if (typeof store.watchScope !== "string" || !store.watchScope.trim()) errs.push("watchScope must say what the watch searched");
  const entries = Array.isArray(store.entries) ? store.entries : null;
  if (!entries) return [...errs, "entries must be an array"];
  for (const [i, e] of entries.entries()) {
    const at_ = `entry #${i + 1}`;
    if (!e || typeof e !== "object") { errs.push(`${at_} is not an object`); continue; }
    if (!constantExists(String(e.id))) errs.push(`${at_}: the mirror carries no constant ${JSON.stringify(e.id)}`);
    if (e.side !== "upper" && e.side !== "lower") { errs.push(`${at_}: side must be upper or lower`); continue; }
    if (!DECIMAL.test(String(e.value)) || !DECIMAL.test(String(e.exactMaximum))) { errs.push(`${at_}: value and exactMaximum must be decimal strings`); continue; }
    // A printed bound must be on the safe side of the exact value: an upper bound rounds UP, a lower DOWN,
    // and by less than one unit in its last printed place.
    const v = dec(e.value), x = dec(e.exactMaximum);
    const c = cmp(v, x);
    if (e.side === "upper" ? c < 0 : c > 0) errs.push(`${at_}: the printed value is on the wrong side of the exact value for a${e.side === "upper" ? "n upper" : " lower"} bound`);
    const k = Math.max(v.k, x.k);
    const gap = at(v, k) - at(x, k);
    if ((gap < 0n ? -gap : gap) >= 10n ** BigInt(k - v.k)) errs.push(`${at_}: the printed value is not a rounding of the exact value at its last printed place`);
    // It must beat the table's best row on its side, by the arXiv watcher's own exact comparison.
    const r = compareConstant(shown, { constant: String(e.id), side: e.side, relation: e.side === "upper" ? "<=" : ">=", value: String(e.value) }).comparison;
    if (r !== "beats") errs.push(`${at_}: the value does not beat the table's best ${e.side} row (the watcher's comparison says ${r})`);
    if (!PINNED_GITHUB.test(String(e.sourceUrl || ""))) errs.push(`${at_}: sourceUrl must be a GitHub blob link pinned to a full 40-character commit sha`);
    if (!ARXIV.test(String(e.foundVia || ""))) errs.push(`${at_}: foundVia must be a versioned arXiv abstract link`);
    for (const f of ["sourcePostedBy", "evaluatedOn"]) if (!ISO.test(String(e[f] || ""))) errs.push(`${at_}: ${f} must be a YYYY-MM-DD date`);
    for (const f of ["construction", "rounding", "method"]) if (typeof e[f] !== "string" || !e[f].trim()) errs.push(`${at_}: ${f} must be a non-empty sentence`);
  }
  for (const s of renderedStrings(store)) if (FORBIDDEN.test(s)) errs.push(`a reader-facing string uses the word "record": ${s.slice(0, 80)}`);
  return errs;
}

/** The entries for one constant. */
export function newerFor(id, store = loadStore()) {
  return store && Array.isArray(store.entries) ? store.entries.filter((e) => e.id === id).map((e) => ({ ...e, checkedThrough: store.checkedThrough, watchScope: store.watchScope })) : [];
}

/** Every reader-facing string an entry can render (the word ban is judged over exactly these). */
export function renderedStrings(store) {
  const out = [store?.watchScope];
  for (const e of store?.entries || []) out.push(e.construction, e.rounding, e.method);
  return out.filter((s) => typeof s === "string");
}

const arxivLabel = (url) => `arXiv:${url.replace(/^https:\/\/arxiv\.org\/abs\//, "")}`;

/** The constant-page block: a <dt>/<dd> pair for the page's <dl>. Empty string when no entries. */
export function newerBlock(entries, shown) {
  if (!entries || !entries.length) return "";
  shown ??= constantsShown(); // read the 115 tables only when there is something to render
  const items = entries.map((e) => {
    const best = bestShown(e.id, e.side, shown);
    const which = e.side === "upper" ? "an upper bound" : "a lower bound";
    const table = e.side === "upper" ? "the smallest upper bound" : "the largest lower bound";
    const cap = e.construction.charAt(0).toUpperCase() + e.construction.slice(1);
    return `<li><p>${esc(cap)} (<a href="${esc(e.sourceUrl)}">the posted file</a>, at the commit current on ${esc(e.evaluatedOn)}) gives ${which} of <code>${esc(e.value)}</code> on this constant. That is below ${table} in this constant's source table, <code>${esc(best)}</code>.</p><p>${esc(e.method)} The exact value is ${esc(e.exactMaximum)}…, which we print as <code>${esc(e.value)}</code>: ${esc(e.rounding)}.</p></li>`;
  }).join("");
  const first = entries[0];
  return `<dt>Outside the source table: a newer construction we checked</dt><dd><ul class="oai">${items}</ul><span class="when">We found it on ${esc(first.evaluatedOn)} through a newer paper, <a href="${esc(first.foundVia)}">${esc(arxivLabel(first.foundVia))}</a>, which reports downloading posted constructions from the same repository and refining them; we did not check that paper's refined value. The source table does not list this construction, and this ledger has not changed the rows above because of it. Newer results checked through ${esc(first.checkedThrough)}: we read ${esc(first.watchScope)}; results announced anywhere else may be missing.</span></dd>`;
}

/**
 * THE BOUND-CELL GUARD. Render every page that carries an entry twice, with the store and without it.
 * Removing exactly the block's markup from the first must give the second, byte for byte, so nothing
 * else on the page (no bound cell, no audit note, no footer) can differ because an entry exists.
 */
export async function boundCellGuard(store = loadStore()) {
  const pages = await import("./render-constant-pages.mjs");
  const site = await import("./render-site.mjs");
  if (!store || !(store.entries || []).length) return ["positive control failed: the committed store holds no entry, so this guard compared nothing"];
  const claims = JSON.parse(readFileSync(join(ROOT, "ledger", "claims.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(join(ROOT, "ledger", "teorth-optimizationproblems", "manifest.json"), "utf8"));
  const rows = site.buildRows(claims, { withDates: false, root: ROOT });
  const errs = [];
  for (const id of [...new Set(store.entries.map((e) => e.id))]) {
    const r = rows.find((x) => x.id === id);
    if (!r) { errs.push(`${id}: no row to render`); continue; }
    const a = pages.renderPage(r, manifest.sha, undefined, store);
    const b = pages.renderPage(r, manifest.sha, undefined, null);
    const block = newerBlock(newerFor(id, store));
    if (!block || !a.includes(block)) { errs.push(`${id}: the page does not carry its newer-construction block`); continue; }
    if (a.replace(block, "") !== b) errs.push(`${id}: the page differs from its no-note render by more than the block`);
    if (FORBIDDEN.test(block)) errs.push(`${id}: the rendered block uses the word "record"`);
  }
  return errs;
}

// ---------- selftest (network-free; KP-78: each refusal fires, and stays silent on the legal case) ----------

export async function selftest() {
  let failed = 0;
  const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); };
  // A fixture table: best upper 0.380868 (a rounding), best lower 0.379005.
  const shown = new Map([["t1", { title: "t", upper: parseBoundCell("$0.380868$"), lower: parseBoundCell("$0.379005$") }]]);
  const exists = (id) => id === "t1";
  const good = {
    checkedThrough: "2026-10-16", watchScope: "arXiv papers naming four systems",
    entries: [{ id: "t1", side: "upper", value: "0.3808590566149", exactMaximum: "0.38085905661480689909", rounding: "rounded up", construction: "a step function", sourceUrl: `https://github.com/o/r/blob/${"a".repeat(40)}/f.json`, sourcePostedBy: "2026-07-26", foundVia: "https://arxiv.org/abs/2609.40340v1", evaluatedOn: "2026-10-16", method: "We evaluated it." }],
  };
  const v = (patch, extra = {}) => validateStore({ ...good, ...extra, entries: [{ ...good.entries[0], ...patch }] }, { shown, constantExists: exists });
  check("a valid entry passes (the silent half)", validateStore(good, { shown, constantExists: exists }).length === 0);
  check("REFUSES an upper bound printed BELOW its exact value (rounded the wrong way)", v({ value: "0.3808590566148" }).some((e) => e.includes("wrong side")));
  // 0.3808591 IS a valid rounding up at the 7th place (gap 4.3e-8 < 1e-7); 0.3808592 is not (gap 1.4e-7).
  check("ACCEPTS a coarser rounding up (0.3808591), REFUSES one more than a unit away (0.3808592)", !v({ value: "0.3808591" }).some((e) => e.includes("not a rounding")) && v({ value: "0.3808592" }).some((e) => e.includes("not a rounding")));
  check("REFUSES a value that does not beat the table's best row", v({ value: "0.380869", exactMaximum: "0.3808685" }).some((e) => e.includes("does not beat")));
  check("REFUSES a value inside the best row's printed precision (not a clear beat)", v({ value: "0.3808675", exactMaximum: "0.38086745" }).some((e) => e.includes("does not beat")));
  check("REFUSES a source link not pinned to a full commit sha", v({ sourceUrl: "https://github.com/o/r/blob/main/f.json" }).some((e) => e.includes("pinned")));
  check("REFUSES an unversioned arXiv link", v({ foundVia: "https://arxiv.org/abs/2609.40340" }).some((e) => e.includes("versioned arXiv")));
  check("REFUSES a constant the mirror does not carry", v({ id: "zz" }).some((e) => e.includes("carries no constant")));
  check("REFUSES the word 'record' in a reader-facing string", v({ method: "This is a new record." }).some((e) => e.includes('"record"')));
  check("REFUSES a lower bound printed above its exact value", v({ side: "lower", value: "0.3790060", exactMaximum: "0.37900591" }).some((e) => e.includes("wrong side")));
  const block = newerBlock(newerFor("t1", good), shown);
  check("the block names the value, the table's best row, the exact value, the pinned link and the scope", block.includes("<code>0.3808590566149</code>") && block.includes("<code>0.380868</code>") && block.includes("0.38085905661480689909") && block.includes("a".repeat(40)) && block.includes("checked through 2026-10-16") && block.includes("arXiv:2609.40340v1"));
  check("no entries, no block", newerBlock([], shown) === "" && newerBlock(newerFor("zz", good), shown) === "");
  check("the block never says 'record'", !FORBIDDEN.test(block));
  // The committed store itself, and the guard over the real page.
  const store = loadStore();
  const real = validateStore(store);
  check(`the committed store validates (${real.length} problem(s)${real.length ? ": " + real.join("; ") : ""})`, store !== null && real.length === 0);
  const guard = await boundCellGuard(store);
  check(`the bound-cell guard holds on every noted page (${guard.length} problem(s)${guard.length ? ": " + guard.join("; ") : ""})`, guard.length === 0);
  console.log(failed ? `RESULT: FAIL — ${failed} case(s) (exit 3)` : "RESULT: PASS — store rules, rendering and the bound-cell guard (exit 0)");
  return failed ? 3 : 0;
}

if (isEntryModule(import.meta.url)) {
  if (process.argv.includes("--selftest")) selftest().then((c) => { process.exitCode = c; }, (err) => { console.error(`newer-results: ${err.message}`); process.exitCode = 2; });
  else {
    const errs = validateStore(loadStore());
    console.log(errs.length ? `RESULT: FAIL — ${errs.length} problem(s): ${errs.join("; ")} (exit 1)` : "RESULT: PASS — the newer-results store validates (exit 0)");
    process.exitCode = errs.length ? 1 : 0;
  }
}
