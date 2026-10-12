#!/usr/bin/env node
// A-78: which claims in OpenAI's math release (github.com/openai/math, 2026-10-06) bear on a
// record this ledger watches, and how far each one is formally stated.
//
// WHAT THE STORE IS. ledger/openai-math-map.json holds a verdict for EVERY result family in the
// release at one pinned upstream sha: `bears` (with the watched records it bears on) or `none`. The
// verdicts must account for the release's own family count, so the map can never quietly cover a
// sample and read as if it covered the whole release (portable rule 7).
//
// WHAT A READER SEES, and what they never see. Only a pair whose formal statement WE read and
// matched against the constant's own definition renders, on that constant's page and index row
// (manager review 2026-10-12: a scope page's prose is not a safe source for a public tag; release
// family 167's page was ambiguous about its own scope). Every rendered note:
//   - sits OUTSIDE the bound cells, which stay byte-identical to the mirror. The curated table and
//     a live claim are tracked side by side and never blended (CLAUDE.md, curated vs live);
//   - never uses the word "record". The release is a set of preprint claims, and "record" is a judgment
//     this ledger only lets a human make about a curated row;
//   - names its Lean statement file and quotes the statement. A `formal-proof` or `partial` tag with
//     no statement path is refused, because that tag is exactly the thing a reader cannot check.
//
// WHAT IT NEVER SAYS. That a proof compiles (we did not build the release), that anyone refereed it,
// or that upstream SHOULD list it. Upstream contact is David's gate.

import { readFileSync, existsSync, realpathSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";
import { esc } from "./lib/html.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const MAP_PATH = join(ROOT, "ledger", "openai-math-map.json");
export const RELEASE = "https://github.com/openai/math";

export const TAGS = {
  "formal-proof": "a Lean statement of it is published with a proof by its authors. We read the statement and it matches this constant's definition; we have not compiled the proof, and we have not read the paper",
  partial: "a Lean statement covers only part of the claim (see the statement below); we have not compiled the proof",
  none: "the release publishes no Lean statement of this claim",
  unchecked: "claimed; statement not yet checked",
};

// Records outside the mirrored constants that the map may name.
export const OTHER_RECORDS = new Set(["erdos-36", "ramsey-classical"]);

const FORBIDDEN = /\brecords?\b/i;
const STATEMENT_PATH = /^lean\/ComparatorChallenges\/[A-Za-z0-9_]+\.lean$/;
const SHA40 = /^[0-9a-f]{40}$/;

/** Load the map. Absent file means no notes, never a crash. */
export function loadMap(root = ROOT) {
  const p = join(root, "ledger", "openai-math-map.json");
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8"));
}

/** Every reader-facing string a note can render. The word ban is judged over exactly these. */
export function renderedStrings(rec) {
  const out = [rec.claim, rec.match, rec.familyTitle];
  if (rec.statement) out.push(rec.statement.text, rec.statement.theorem);
  return out.filter((s) => typeof s === "string");
}

/**
 * Every problem with the map, as sentences. Empty means valid. `constantExists(id)` answers
 * whether a mirrored constant file exists; it is injected so the self-test can run on fixtures.
 */
export function validateMap(map, constantExists = () => true) {
  const errs = [];
  if (!map || typeof map !== "object") return ["the map is not an object"];
  const src = map.source || {};
  if (!SHA40.test(String(src.sha || ""))) errs.push("source.sha must be a full 40-character upstream sha");
  const fams = Array.isArray(map.families) ? map.families : [];
  if (!Number.isInteger(src.familyCount) || src.familyCount < 1) errs.push("source.familyCount must be a positive integer");
  else if (fams.length !== src.familyCount) errs.push(`verdicts cover ${fams.length} families; the release has ${src.familyCount}`);
  const seen = new Set();
  let bears = 0, none = 0;
  for (const f of fams) {
    const n = String(f && f.family);
    if (!/^\d{3}$/.test(n)) { errs.push(`family number ${JSON.stringify(n)} is not three digits`); continue; }
    if (seen.has(n)) errs.push(`family ${n} has more than one verdict`);
    seen.add(n);
    const recs = Array.isArray(f.records) ? f.records : [];
    if (f.verdict === "none") {
      none++;
      if (recs.length) errs.push(`family ${n} is "none" but names records`);
    } else if (f.verdict === "bears") {
      bears++;
      if (!recs.length) errs.push(`family ${n} is "bears" but names no record`);
      for (const r of recs) errs.push(...validateRecord(n, r, constantExists));
    } else errs.push(`family ${n} has verdict ${JSON.stringify(f.verdict)}; only "bears" and "none" are allowed`);
  }
  if (fams.length && bears + none !== fams.length) errs.push(`bears ${bears} + none ${none} does not equal ${fams.length}`);
  return errs;
}

function validateRecord(n, r, constantExists) {
  const errs = [];
  const where = `family ${n} → ${r && r.id}`;
  if (!r || typeof r.id !== "string") return [`family ${n} names a record with no id`];
  if (!OTHER_RECORDS.has(r.id) && !constantExists(r.id)) errs.push(`${where}: no mirrored constant has that id`);
  if (!(r.tag in TAGS)) errs.push(`${where}: tag ${JSON.stringify(r.tag)} is not one of ${Object.keys(TAGS).join(", ")}`);
  if (r.statementChecked !== true && r.tag !== "unchecked") errs.push(`${where}: only a statement we read and matched may carry "${r.tag}"; an unread pair is "unchecked"`);
  // A RENDERED pair is one whose statement we read, so it must carry a proof tag and the statement
  // itself (Codex r1, 2026-10-12: checked + "unchecked" + an empty statement used to render bare).
  if (r.statementChecked === true && r.tag !== "formal-proof" && r.tag !== "partial") errs.push(`${where}: a statement-checked pair renders, so it must be tagged "formal-proof" or "partial", not "${r.tag}"`);
  if (r.statementChecked === true || r.tag === "formal-proof" || r.tag === "partial") {
    const s = r.statement || {};
    if (!STATEMENT_PATH.test(String(s.path || ""))) errs.push(`${where}: a "${r.tag}" tag needs the Lean statement's path (lean/ComparatorChallenges/<name>.lean)`);
    if (!s.text || !String(s.text).trim()) errs.push(`${where}: a "${r.tag}" tag needs the statement text quoted`);
    if (!r.match || !String(r.match).trim()) errs.push(`${where}: a "${r.tag}" tag needs the sentence saying how the statement matches the definition`);
  }
  if (r.statementChecked === true && !r.claim) errs.push(`${where}: a rendered note needs the claim in words`);
  for (const s of renderedStrings(r)) if (FORBIDDEN.test(s)) errs.push(`${where}: rendered text uses the word "record": ${JSON.stringify(s.slice(0, 80))}`);
  return errs;
}

/** The notes that render for one constant: statement-checked pairs only, in family order. */
export function notesFor(id, map) {
  if (!map || !Array.isArray(map.families)) return [];
  const out = [];
  for (const f of map.families) {
    if (f.verdict !== "bears") continue;
    for (const r of f.records || []) {
      if (r.id === id && r.statementChecked === true) out.push({ ...r, family: f.family, familyTitle: r.familyTitle || f.title, source: map.source });
    }
  }
  return out;
}

/** The index badge. Short, flat, and says "claim". */
export function badgeText(notes) {
  const fams = [...new Set(notes.map((n) => n.family))];
  return `a preprint claim bears on this row · OpenAI release, family ${fams.join(", ")}`;
}

const statementUrl = (sha, path) => `${RELEASE}/blob/${sha}/${path}`;
const familyUrl = (sha) => `${RELEASE}/blob/${sha}/CONTENTS.md`;

/** The constant-page block: a <dt>/<dd> pair for the page's <dl>. Empty string when no notes. */
export function noteBlock(notes) {
  if (!notes || !notes.length) return "";
  const source = notes[0].source;
  const sha = String(source.sha);
  const items = notes.map((n) => {
    const st = n.statement && n.statement.path
      ? `<p>Its Lean statement, <a href="${esc(statementUrl(sha, n.statement.path))}">${esc(n.statement.path.split("/").pop())}</a>:</p><code>${esc(n.statement.text)}</code>`
      : "";
    return `<li><p><a href="${esc(familyUrl(sha))}">Family ${esc(n.family)}</a>, “${esc(n.familyTitle)}”, claims ${esc(n.claim)}</p>${st}<p>${esc(n.match || "")}</p><p class="tag">Status: ${esc(TAGS[n.tag])}.</p></li>`;
  }).join("");
  return `<dt>Outside the source table: a claim in OpenAI's math release</dt><dd><ul class="oai">${items}</ul><span class="when">A claim in a preprint release, read at <a href="${esc(`${RELEASE}/tree/${sha}`)}">openai/math@${esc(sha.slice(0, 7))}</a> on ${esc(source.readAt)}. It is not in the source table, and this ledger has not changed the rows above because of it.</span></dd>`;
}

/**
 * THE BOUND-CELL GUARD. Render every page that carries a note, and the index, twice: with the
 * notes and with none. Removing exactly the note's own markup from the first must give the second,
 * byte for byte. So nothing else on the page, and in particular no bound cell, can differ because a
 * claim was attached. Returns the problems as sentences; empty means the guard held.
 */
export async function boundCellGuard(root = ROOT) {
  const site = await import("./render-site.mjs");
  const pages = await import("./render-constant-pages.mjs");
  const map = loadMap(root);
  if (!map) return ["the map ledger/openai-math-map.json is absent, so this guard compared nothing"];
  const claims = JSON.parse(readFileSync(join(root, "ledger", "claims.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(join(root, "ledger", "teorth-optimizationproblems", "manifest.json"), "utf8"));
  const withN = site.buildRows(claims, { withDates: false, root, oaiMap: map });
  const without = site.buildRows(claims, { withDates: false, root, oaiMap: null });
  const errs = [];
  const touched = withN.filter((r) => r.oai.length);
  if (!touched.length) errs.push("positive control failed: the committed map renders no note on any page, so this guard compared nothing");
  for (const r of touched) {
    const a = pages.renderPage(r, manifest.sha);
    const b = pages.renderPage(without.find((x) => x.id === r.id), manifest.sha);
    const block = noteBlock(r.oai);
    if (!a.includes(block)) { errs.push(`${r.id}: the page does not carry its note block`); continue; }
    if (a.replace(block, "") !== b) errs.push(`${r.id}: the page differs from its no-note render by more than the note block`);
    for (const n of r.oai) {
      const p = n.statement && n.statement.path;
      if (!p || !STATEMENT_PATH.test(p) || !block.includes(esc(p))) errs.push(`${r.id}: a rendered note does not name its Lean statement file`);
    }
  }
  const ia = site.renderHtml(withN, manifest, "2026-10-12");
  const ib = site.renderHtml(without, manifest, "2026-10-12");
  const badges = ia.match(/<a class="oai"[^>]*>[^<]*<\/a>/g) || [];
  if (badges.length !== touched.length) errs.push(`the index carries ${badges.length} claim badge(s) for ${touched.length} noted constant(s)`);
  if (ia.replace(/<a class="oai"[^>]*>[^<]*<\/a>/g, "") !== ib) errs.push("the index differs from its no-note render by more than the claim badges");
  // Judged on the RAW markup, attributes included: an aria-label is read aloud, so it is rendered
  // text too (Codex r1, 2026-10-12: stripping tags first let "record" ride in the badge's aria-label).
  for (const s of [...badges, ...touched.map((r) => noteBlock(r.oai))]) if (FORBIDDEN.test(s)) errs.push(`rendered claim markup uses the word "record": ${s.slice(0, 80)}`);
  return errs;
}

export async function selftest() {
  const sha = "a".repeat(40);
  const good = {
    record_: undefined,
    source: { repo: "openai/math", sha, familyCount: 3, readAt: "2026-10-12" },
    families: [
      { family: "001", verdict: "none" },
      { family: "002", verdict: "bears", title: "Fast products", records: [{ id: "15a", tag: "formal-proof", statementChecked: true, claim: "a bound below 2.3 on omega", match: "Same quantity.", statement: { path: "lean/ComparatorChallenges/X.lean", theorem: "main", text: "theorem main : omega < 2.3" } }] },
      { family: "003", verdict: "bears", records: [{ id: "84a", tag: "unchecked" }] },
    ],
  };
  delete good.record_;
  assert.deepEqual(validateMap(good), [], "a complete, well-formed map validates");

  // The guards that carry the MEANING come first; each mutation must name the property it broke.
  const m = (f) => { const c = structuredClone(good); f(c); return validateMap(c); };
  // 1. The word ban, judged over every rendered string.
  assert.ok(m((c) => { c.families[1].records[0].claim = "a new record for omega"; }).some((e) => /uses the word "record"/.test(e)), "the word 'record' in a claim must be refused");
  assert.ok(m((c) => { c.families[1].records[0].match = "Matches; a Record."; }).some((e) => /uses the word "record"/.test(e)), "the ban is case-insensitive and covers the match sentence");
  // 2. A formal-proof tag with no statement path, or no statement text.
  assert.ok(m((c) => { delete c.families[1].records[0].statement.path; }).some((e) => /needs the Lean statement's path/.test(e)), "formal-proof with no statement path must be refused");
  assert.ok(m((c) => { c.families[1].records[0].statement.path = "lean/docs/002.md"; }).some((e) => /needs the Lean statement's path/.test(e)), "a scope page is not a statement path");
  assert.ok(m((c) => { c.families[1].records[0].statement.text = " "; }).some((e) => /statement text quoted/.test(e)), "formal-proof with no quoted statement must be refused");
  // 3. An unread pair carrying a proof tag.
  assert.ok(m((c) => { c.families[1].records[0].statementChecked = false; }).some((e) => /only a statement we read and matched/.test(e)), "an unchecked pair cannot carry formal-proof");
  // 3b. A RENDERED pair (statementChecked) with an "unchecked" tag and an empty statement (Codex r1).
  assert.ok(m((c) => { c.families[1].records[0].tag = "unchecked"; c.families[1].records[0].statement = { path: "", text: "" }; }).some((e) => /must be tagged "formal-proof" or "partial"/.test(e)), "a statement-checked pair cannot carry the unchecked tag");
  assert.ok(m((c) => { c.families[1].records[0].tag = "unchecked"; c.families[1].records[0].statement = { path: "", text: "" }; }).some((e) => /needs the Lean statement's path/.test(e)), "a statement-checked pair needs its statement path whatever its tag");
  // 4. The whole population: the verdicts must sum to the family count, once each.
  assert.ok(m((c) => { c.families.pop(); }).some((e) => /verdicts cover 2 families; the release has 3/.test(e)), "a missing family must be refused");
  assert.ok(m((c) => { c.families[2].family = "001"; }).some((e) => /more than one verdict/.test(e)), "a duplicate family must be refused");
  assert.ok(m((c) => { c.source.sha = "abc1234"; }).some((e) => /40-character/.test(e)), "an abbreviated sha must be refused");
  assert.ok(m((c) => { c.families[0].records = [{ id: "15a", tag: "unchecked" }]; }).some((e) => /"none" but names records/.test(e)), "a none verdict cannot name records");
  assert.ok(validateMap(good, (id) => id !== "84a").some((e) => /no mirrored constant has that id/.test(e)), "a record id must exist in the mirror");

  // Rendering: only statement-checked pairs render; unchecked ones stay data.
  assert.equal(notesFor("15a", good).length, 1);
  assert.equal(notesFor("84a", good).length, 0, "an unchecked pair must not render");
  const block = noteBlock(notesFor("15a", good));
  assert.ok(block.includes("lean/ComparatorChallenges/X.lean") && block.includes("theorem main : omega &lt; 2.3"), "the block names the statement file and quotes the statement");
  assert.ok(!FORBIDDEN.test(block.replace(/<[^>]+>/g, " ")), "the rendered block never says 'record'");
  assert.equal(noteBlock([]), "", "no notes, no block");
  assert.ok(!FORBIDDEN.test(badgeText(notesFor("15a", good))), "the badge never says 'record'");

  // The committed map is REQUIRED (Codex r1, 2026-10-12: an absent map used to skip both legs and
  // still print PASS), then validates against the real mirror.
  const real = loadMap();
  assert.ok(real, "the committed map ledger/openai-math-map.json is absent; this self-test checks it and refuses to pass without it");
  {
    const errs = validateMap(real, (id) => existsSync(join(ROOT, "ledger", "teorth-optimizationproblems", "constants", `${id}.md`)));
    assert.deepEqual(errs, [], `the committed map is invalid:\n${errs.join("\n")}`);
    const guard = await boundCellGuard();
    assert.deepEqual(guard, [], `the bound-cell guard failed:\n${guard.join("\n")}`);
  }
  console.log(`openai-math selftest: PASS (refuses the word "record" in any rendered string, a formal-proof or partial tag with no Lean statement path or quoted statement, a proof tag on a pair we did not read, and a map whose verdicts do not cover every family exactly once; renders only statement-checked pairs${real ? `; the committed map validates: ${real.families.length} families at ${String(real.source.sha).slice(0, 7)}, and every noted page and the index differ from their no-note render by exactly the note` : ""})`);
}

const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  // No top-level await: the guard imports the renderers, which import this module, and a pending
  // top-level await here would leave that cycle unsettled.
  if (process.argv.includes("--selftest")) selftest().catch((e) => { console.error(e && e.stack || e); process.exitCode = 1; });
  else {
    const map = loadMap();
    if (!map) { console.log("openai-math: no map at ledger/openai-math-map.json"); process.exit(2); }
    const errs = validateMap(map, (id) => existsSync(join(ROOT, "ledger", "teorth-optimizationproblems", "constants", `${id}.md`)));
    const bears = map.families.filter((f) => f.verdict === "bears");
    const pairs = bears.flatMap((f) => f.records);
    const byTag = Object.fromEntries(Object.keys(TAGS).map((t) => [t, pairs.filter((r) => r.tag === t).length]));
    console.log(`openai-math: ${map.families.length} of ${map.source.familyCount} families at openai/math@${String(map.source.sha).slice(0, 7)} (an upstream sha): ${bears.length} bear on a watched record, ${map.families.length - bears.length} do not; ${pairs.length} pair(s): ${Object.entries(byTag).map(([t, c]) => `${t} ${c}`).join(", ")}; rendered ${pairs.filter((r) => r.statementChecked === true).length}`);
    if (errs.length) { console.log(`INVALID:\n${errs.join("\n")}`); process.exit(1); }
    console.log("RESULT: VALID (exit 0)");
  }
}
