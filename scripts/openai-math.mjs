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
import { createHash } from "node:crypto";
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
  // A pair we READ and chose not to show: the statement does not bear on the constant after all,
  // or the source table already lists the claim. The read is kept, with its reason, instead of the
  // pair being deleted (manager review 2026-10-19). It never renders.
  "read-no-note": "statement read; no note is shown, for the reason recorded in the map",
};
const READ_NO_NOTE = "read-no-note";

// A per-record status line, chosen from fixed wordings and never free text. The shared
// "formal-proof" line says the statement "matches this constant's definition", which overstates a
// note whose match needs a derivation, or facts from outside the Lean statement (8a, 46a, 77a; cycle
// 4, 2026-10-30, wording from the Codex pass on the 8a read). A record sets `status` to a key here
// and renders that line in place of its tag's. Allowed on a rendered pair carrying `tag`, and on a
// held read-no-note pair that bears, so a note can wait behind its board card with its line chosen.
export const STATUS_VARIANTS = {
  derivation: {
    tag: "formal-proof",
    text: "a Lean statement of it is published with a proof by its authors. We read the statement and checked the derivation above against this constant's definition; we have not compiled the proof, and we have not read the paper",
  },
};

/** The status line a note renders: its variant's when it names one, else its tag's. */
export function statusText(n) {
  // Own property only: an inherited `status` must never change a live note (Codex c4 r1).
  return Object.hasOwn(n, "status") && Object.hasOwn(STATUS_VARIANTS, n.status) ? STATUS_VARIANTS[n.status].text : TAGS[n.tag];
}

// Records outside the mirrored constants that the map may name.
export const OTHER_RECORDS = new Set(["erdos-36", "ramsey-classical"]);

const FORBIDDEN = /\brecords?\b/i;
const STATEMENT_PATH = /^lean\/ComparatorChallenges\/[A-Za-z0-9_]+\.lean$/;
const SHA40 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;

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
 * Does the mirrored source page for this constant cite the release? A rendered note ends "It is not
 * in the source table", so once upstream lists a release claim the note would be false on the very
 * page that shows the row (84a, 2026-10-18 resnap → found 2026-10-19). The rule is deliberately
 * coarse: ANY link to the release repo refuses EVERY note on that constant, and a human records each
 * pair as "read-no-note". Its failure mode is a refusal, never a false sentence.
 */
export function citesRelease(id, root = ROOT) {
  const p = join(root, "ledger", "teorth-optimizationproblems", "constants", `${id}.md`);
  return existsSync(p) && /github\.com\/openai\/math\b/i.test(readFileSync(p, "utf8"));
}

/**
 * The SHA-256 of a constant's mirrored page, line endings normalised to LF (a Windows checkout
 * holds CRLF, a CI runner LF). A rendered note's `match` compares the claim with that page's rows
 * ("against X in its last-listed upper-bound row"), so the note is pinned to the page it was read
 * against. Any upstream change to the page refuses the note until a human re-reads it and moves the
 * pin (Codex r1 2026-10-19, the second instance after 84a: 7a's note named a row that was no longer
 * last-listed). Null when the page is absent.
 */
export function sourceHash(id, root = ROOT) {
  const p = join(root, "ledger", "teorth-optimizationproblems", "constants", `${id}.md`);
  if (!existsSync(p)) return null;
  return createHash("sha256").update(readFileSync(p, "utf8").replace(/\r\n/g, "\n")).digest("hex");
}

/**
 * Every problem with the map, as sentences. Empty means valid. `constantExists(id)` answers
 * whether a mirrored constant file exists, `sourceCitesRelease(id)` whether its mirrored page
 * already cites the release, and `sourceHashOf(id)` the page's current hash (null skips only the
 * comparison, never the field's presence); all are injected so the self-test can run on fixtures.
 */
export function validateMap(map, constantExists = () => true, sourceCitesRelease = () => false, sourceHashOf = null) {
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
      for (const r of recs) errs.push(...validateRecord(n, r, constantExists, sourceCitesRelease, sourceHashOf));
    } else errs.push(`family ${n} has verdict ${JSON.stringify(f.verdict)}; only "bears" and "none" are allowed`);
  }
  if (fams.length && bears + none !== fams.length) errs.push(`bears ${bears} + none ${none} does not equal ${fams.length}`);
  return errs;
}

function validateRecord(n, r, constantExists, sourceCitesRelease, sourceHashOf) {
  const errs = [];
  const where = `family ${n} → ${r && r.id}`;
  if (!r || typeof r.id !== "string") return [`family ${n} names a record with no id`];
  if (!OTHER_RECORDS.has(r.id) && !constantExists(r.id)) errs.push(`${where}: no mirrored constant has that id`);
  if (!(r.tag in TAGS)) errs.push(`${where}: tag ${JSON.stringify(r.tag)} is not one of ${Object.keys(TAGS).join(", ")}`);
  // A rendered note is pinned to the mirrored page it was compared with.
  if (r.statementChecked === true && !OTHER_RECORDS.has(r.id)) {
    if (!SHA256.test(String(r.sourceSha256 || ""))) errs.push(`${where}: a rendered note needs sourceSha256, the hash of the mirrored page it was read against (node scripts/openai-math.mjs --source-hash ${r.id})`);
    else if (sourceHashOf && sourceHashOf(r.id) !== r.sourceSha256) errs.push(`${where}: the mirrored page for ${r.id} changed since this note was read against it; re-read the note's claim and match against the page, then set sourceSha256 to the page's new hash (node scripts/openai-math.mjs --source-hash ${r.id})`);
  }
  // The note would say "It is not in the source table" on a page whose table now cites the release.
  if (r.statementChecked === true && sourceCitesRelease(r.id)) errs.push(`${where}: the mirrored source page for ${r.id} now cites the release (github.com/openai/math), so a note saying the claim is not in the source table would be false; record the pair as "${READ_NO_NOTE}" with that reason`);
  if (r.tag === READ_NO_NOTE) {
    if (r.statementChecked === true) errs.push(`${where}: a "${READ_NO_NOTE}" pair never renders, so it cannot be statementChecked`);
    if (r.statementRead !== true) errs.push(`${where}: a "${READ_NO_NOTE}" pair records a read, so it needs statementRead: true`);
    if (typeof r.bears !== "boolean") errs.push(`${where}: a "${READ_NO_NOTE}" pair needs bears: true or false, what the read found`);
    if (!r.reason || !String(r.reason).trim()) errs.push(`${where}: a "${READ_NO_NOTE}" pair needs the reason no note is shown`);
    if (!STATEMENT_PATH.test(String((r.statement || {}).path || ""))) errs.push(`${where}: a "${READ_NO_NOTE}" pair needs the Lean statement file that was read (lean/ComparatorChallenges/<name>.lean)`);
  } else if (r.statementRead === true && r.statementChecked !== true) errs.push(`${where}: a pair whose statement was read and is not shown must be tagged "${READ_NO_NOTE}", not "${r.tag}"`);
  if (r.statementChecked !== true && r.tag !== "unchecked" && r.tag !== READ_NO_NOTE) errs.push(`${where}: only a statement we read and matched may carry "${r.tag}"; an unread pair is "unchecked"`);
  // A RENDERED pair is one whose statement we read, so it must carry a proof tag and the statement
  // itself (Codex r1, 2026-10-12: checked + "unchecked" + an empty statement used to render bare).
  if (r.statementChecked === true && r.tag !== "formal-proof" && r.tag !== "partial") errs.push(`${where}: a statement-checked pair renders, so it must be tagged "formal-proof" or "partial", not "${r.tag}"`);
  if (r.statementChecked === true || r.tag === "formal-proof" || r.tag === "partial") {
    const s = r.statement || {};
    if (!STATEMENT_PATH.test(String(s.path || ""))) errs.push(`${where}: a "${r.tag}" tag needs the Lean statement's path (lean/ComparatorChallenges/<name>.lean)`);
    if (!s.text || !String(s.text).trim()) errs.push(`${where}: a "${r.tag}" tag needs the statement text quoted`);
    if (!r.match || !String(r.match).trim()) errs.push(`${where}: a "${r.tag}" tag needs the sentence saying how the statement matches the definition`);
  }
  if (Object.hasOwn(r, "status")) {
    const v = Object.hasOwn(STATUS_VARIANTS, r.status) ? STATUS_VARIANTS[r.status] : null;
    if (!v) errs.push(`${where}: status ${JSON.stringify(r.status)} is not one of ${Object.keys(STATUS_VARIANTS).join(", ")}`);
    else if (r.tag === READ_NO_NOTE ? r.bears !== true : r.tag !== v.tag) errs.push(`${where}: status "${r.status}" belongs on a "${v.tag}" pair, or on a held "${READ_NO_NOTE}" pair that bears, not on "${r.tag}"${r.tag === READ_NO_NOTE ? " with bears false" : ""}`);
  }
  if (r.statementChecked === true && !r.claim) errs.push(`${where}: a rendered note needs the claim in words`);
  for (const s of renderedStrings(r)) if (FORBIDDEN.test(s)) errs.push(`${where}: rendered text uses the word "record": ${JSON.stringify(s.slice(0, 80))}`);
  return errs;
}

/**
 * May this pair render? A pair renders only when it is statement-checked, carries a proof tag, and
 * names its Lean statement file (Codex r1 2026-10-30: a held "read-no-note" pair with only
 * statementChecked flipped used to render). This is the cheap structural floor; the renderers add
 * the map's full per-record rule through recordCheck.
 */
export function mayRender(r) {
  return !!r && r.statementChecked === true && (r.tag === "formal-proof" || r.tag === "partial") && STATEMENT_PATH.test(String((r.statement || {}).path || ""));
}

/**
 * The map's own per-record rule, bound to one tree: returns (family, record) => problems. The
 * renderers never call validateMap, so they pass this to notesFor and a note renders only when its
 * record has NO problems (Codex r2 2026-10-30, the second finding on this guard: rather than add
 * clauses to mayRender, render iff the record passes the same validateRecord the map check runs).
 * Failure mode: an invalid note is ABSENT from the page while `npm test` reports why, never published.
 */
export function recordCheck(root = ROOT) {
  const exists = (id) => existsSync(join(root, "ledger", "teorth-optimizationproblems", "constants", `${id}.md`));
  return (n, r) => validateRecord(n, r, exists, (id) => citesRelease(id, root), (id) => sourceHash(id, root));
}

/**
 * A composed note may render: attached fields well-shaped, and its own block ban-clean.
 * SCOPE, stated narrowly (Codex r4, 2026-10-30): this covers NOTE-DERIVED content only. The index
 * badge also carries the row's own title and id, which come from the mirror and already appear in
 * the row; the word ban is about what a note asserts, not upstream's constant names. And it scans
 * each note inside the same wrapper the page emits. A page with several notes gets that wrapper
 * around the same <li> items, and a word-boundary match cannot span two items, because each opens
 * and closes with a tag.
 */
export function composedNoteOk(n) {
  const src = n && n.source;
  if (!/^\d{3}$/.test(String(n && n.family))) return false;
  if (typeof n.familyTitle !== "string" || !n.familyTitle.trim()) return false;
  if (!src || !SHA40.test(String(src.sha || "")) || !/^\d{4}-\d{2}-\d{2}$/.test(String(src.readAt || ""))) return false;
  return !FORBIDDEN.test(noteBlock([n]));
}

/**
 * The notes that render for one constant, in family order: pairs that pass mayRender and, when a
 * check is given (the renderers always give one), have no problems under it.
 */
export function notesFor(id, map, check = null) {
  if (!map || !Array.isArray(map.families)) return [];
  const out = [];
  for (const f of map.families) {
    if (f.verdict !== "bears") continue;
    for (const r of f.records || []) {
      if (r.id !== id || !mayRender(r)) continue;
      if (check && check(String(f.family), r).length) continue;
      const note = { ...r, family: f.family, familyTitle: r.familyTitle || f.title, source: map.source };
      // The record passed, but the family and source fields are attached HERE and render too
      // (Codex r3, 2026-10-30). So judge the COMPOSED note: the attached fields in the shapes the map
      // check requires, and the exact markup this note would emit free of the banned word.
      if (check && !composedNoteOk(note)) continue;
      out.push(note);
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
    return `<li><p><a href="${esc(familyUrl(sha))}">Family ${esc(n.family)}</a>, “${esc(n.familyTitle)}”, claims ${esc(n.claim)}</p>${st}<p>${esc(n.match || "")}</p><p class="tag">Status: ${esc(statusText(n))}.</p></li>`;
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
  // Since A-69 (2026-10-13) the index emits each row's badges twice, in the th and as a card-layout
  // copy in the links cell, and render-site's selftest holds the copy byte-equal to the th. So the
  // badge COUNT is read in the th, and the strip also drops a copy wrapper the note alone filled.
  const ths = (ia.match(/<th scope="row">[\s\S]*?<\/th>/g) || []).join("\n");
  const badges = ths.match(/<a class="oai"[^>]*>[^<]*<\/a>/g) || [];
  if (badges.length !== touched.length) errs.push(`the index carries ${badges.length} claim badge(s) for ${touched.length} noted constant(s)`);
  // The empty-wrapper strip is anchored to the head of the links cell, the one place the renderer
  // emits it (Codex r1, 2026-10-13: an unanchored strip accepted an empty wrapper anywhere).
  if (ia.replace(/<a class="oai"[^>]*>[^<]*<\/a>/g, "").replace(/<td class="src"><div class="later"><\/div>/g, '<td class="src">') !== ib) errs.push("the index differs from its no-note render by more than the claim badges");
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
      { family: "002", verdict: "bears", title: "Fast products", records: [{ id: "15a", tag: "formal-proof", statementChecked: true, sourceSha256: "b".repeat(64), claim: "a bound below 2.3 on omega", match: "Same quantity.", statement: { path: "lean/ComparatorChallenges/X.lean", theorem: "main", text: "theorem main : omega < 2.3" } }] },
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
  // 5. A note on a constant whose mirrored source page already cites the release would say "It is
  // not in the source table" falsely (84a, 2026-10-19). Refused for the rendered pair, and only it.
  {
    const errs = validateMap(good, () => true, (id) => id === "15a");
    assert.ok(errs.some((e) => /15a: the mirrored source page for 15a now cites the release/.test(e)), "a rendered note on a constant whose source page cites the release must be refused");
    assert.ok(!errs.some((e) => /84a/.test(e)), "an unrendered pair on such a constant is not refused");
  }

  // 5b. A rendered note is pinned to the mirrored page it was compared with (7a, 2026-10-19).
  assert.ok(m((c) => { delete c.families[1].records[0].sourceSha256; }).some((e) => /15a: a rendered note needs sourceSha256/.test(e)), "a rendered note with no page hash must be refused");
  assert.ok(validateMap(good, () => true, () => false, () => "c".repeat(64)).some((e) => /mirrored page for 15a changed since this note was read/.test(e)), "a rendered note whose page changed must be refused");
  assert.deepEqual(validateMap(good, () => true, () => false, () => "b".repeat(64)), [], "a rendered note whose page is unchanged validates");

  // 6. "read-no-note": a read that is kept without rendering. Valid both ways, and each part required.
  const readNo = (bears) => ({ id: "84a", tag: "read-no-note", statementChecked: false, statementRead: true, bears, reason: "The source table lists this claim.", statement: { path: "lean/ComparatorChallenges/Y.lean", theorem: "main", text: "theorem main : True" } });
  const withRead = (rec) => { const c = structuredClone(good); c.families[2].records = [rec]; return c; };
  assert.deepEqual(validateMap(withRead(readNo(true))), [], "a read that bears but is not shown validates");
  assert.deepEqual(validateMap(withRead(readNo(false))), [], "a read that does not bear validates");
  assert.deepEqual(validateMap(withRead(readNo(true)), () => true, (id) => id === "84a"), [], "a read-no-note pair on a page that cites the release is the remedy, not refused");
  const rn = (f) => { const r = readNo(false); f(r); return validateMap(withRead(r)); };
  assert.ok(rn((r) => { r.reason = " "; }).some((e) => /needs the reason no note is shown/.test(e)), "read-no-note with no reason must be refused");
  assert.ok(rn((r) => { delete r.bears; }).some((e) => /needs bears: true or false/.test(e)), "read-no-note with no bears verdict must be refused");
  assert.ok(rn((r) => { r.statementRead = false; }).some((e) => /needs statementRead: true/.test(e)), "read-no-note without statementRead must be refused");
  assert.ok(rn((r) => { r.statement.path = "lean/docs/167.md"; }).some((e) => /needs the Lean statement file that was read/.test(e)), "read-no-note must name a statement file, not a scope page");
  assert.ok(rn((r) => { r.statementChecked = true; }).some((e) => /never renders, so it cannot be statementChecked/.test(e)), "read-no-note cannot render");
  assert.ok(rn((r) => { r.tag = "unchecked"; }).some((e) => /must be tagged "read-no-note", not "unchecked"/.test(e)), "a read pair cannot hide as unchecked");
  assert.equal(notesFor("84a", withRead(readNo(true))).length, 0, "a read-no-note pair must not render");
  // 6b. The renderers never call validateMap, so notesFor itself must refuse a held pair whose
  // statementChecked alone was flipped (Codex r1, 2026-10-30), and a checked pair with no proof tag
  // or no statement path. Each case is invalid to validateMap too; the point is that it renders nothing.
  {
    const flipped = readNo(true); flipped.statementChecked = true;
    assert.equal(notesFor("84a", withRead(flipped)).length, 0, "a read-no-note pair with only statementChecked flipped must not render");
    const noTag = structuredClone(good); noTag.families[1].records[0].tag = "unchecked";
    assert.equal(notesFor("15a", noTag).length, 0, "a statement-checked pair tagged unchecked must not render");
    const noPath = structuredClone(good); noPath.families[1].records[0].statement.path = "";
    assert.equal(notesFor("15a", noPath).length, 0, "a statement-checked pair with no statement path must not render");
  }

  // 6c. The per-record status line (cycle 4, 2026-10-30). Meaning first: the derivation line says
  // what was checked and claims nothing the shared line does not, and it is what the block shows.
  {
    const shared = TAGS["formal-proof"], deriv = STATUS_VARIANTS.derivation.text;
    const [head, tail] = shared.split("it matches this constant's definition");
    // Exact: the shared line with ONE clause replaced, so nothing else can be slipped in (Codex c4 r1).
    assert.equal(deriv, `${head}checked the derivation above against this constant's definition${tail}`, "the derivation line is the shared line with only what was checked changed");
    assert.ok(tail !== undefined && !deriv.includes("it matches this constant's definition"), "the derivation line does not say the statement matches the definition");
    for (const v of Object.values(STATUS_VARIANTS)) assert.ok(!FORBIDDEN.test(v.text), "a status line never says 'record'");
    const withStatus = (s, tweak = () => {}) => { const c = structuredClone(good); const r = c.families[1].records[0]; r.status = s; tweak(r); return c; };
    const b = noteBlock(notesFor("15a", withStatus("derivation")));
    assert.ok(b.includes(`Status: ${esc(deriv)}.`) && !b.includes(esc(shared)), "a derivation note renders the derivation line in place of the shared one");
    assert.ok(noteBlock(notesFor("15a", good)).includes(`Status: ${esc(shared)}.`), "a note with no status keeps the shared line");
    assert.deepEqual(validateMap(withStatus("derivation")), [], "a formal-proof pair with the derivation status validates");
    assert.ok(validateMap(withStatus("checked")).some((e) => /status "checked" is not one of/.test(e)), "an unknown status must be refused");
    assert.ok(validateMap(withStatus("toString")).some((e) => /status "toString" is not one of/.test(e)), "an inherited property name is not a status");
    assert.ok(validateMap(withStatus("derivation", (r) => { r.tag = "partial"; })).some((e) => /status "derivation" belongs on a "formal-proof" pair/.test(e)), "the derivation status on a partial pair must be refused");
    const held = (bears) => { const r = readNo(bears); r.status = "derivation"; return withRead(r); };
    assert.deepEqual(validateMap(held(true)), [], "a held read-no-note pair that bears may carry its status while it waits");
    assert.ok(validateMap(held(false)).some((e) => /status "derivation" belongs on/.test(e)), "a read-no-note pair that does not bear cannot carry a status");
    assert.equal(notesFor("84a", held(true)).length, 0, "a held pair with a status still does not render");
  }

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
    const errs = validateMap(real, (id) => existsSync(join(ROOT, "ledger", "teorth-optimizationproblems", "constants", `${id}.md`)), (id) => citesRelease(id), (id) => sourceHash(id));
    assert.deepEqual(errs, [], `the committed map is invalid:\n${errs.join("\n")}`);
    const guard = await boundCellGuard();
    assert.deepEqual(guard, [], `the bound-cell guard failed:\n${guard.join("\n")}`);

    // 7. THE WIRING (Codex r2, 2026-10-30): the renderers' own buildRows must drop a rendered pair
    // whose record the map's rule refuses. Exercised through render-site, not through notesFor.
    const site = await import("./render-site.mjs");
    const claims = JSON.parse(readFileSync(join(ROOT, "ledger", "claims.json"), "utf8"));
    const target = real.families.flatMap((f) => (f.records || []).filter((r) => r.statementChecked === true))[0];
    assert.ok(target, "positive control failed: the committed map has no rendered pair to mutate");
    const rowsWith = (m) => site.buildRows(claims, { withDates: false, root: ROOT, oaiMap: m });
    const count = (m) => rowsWith(m).find((x) => x.id === target.id).oai.length;
    const before = count(real);
    assert.ok(before >= 1, `positive control failed: ${target.id} renders no note from the committed map`);
    const mutate = (f) => { const c = structuredClone(real); const r = c.families.flatMap((x) => x.records || []).find((x) => x.id === target.id && x.statementChecked === true); f(r); return c; };
    assert.equal(count(mutate((r) => { r.claim += " a new record"; })), before - 1, "a rendered pair whose claim says 'record' must be dropped by the renderers' buildRows");
    assert.equal(count(mutate((r) => { r.sourceSha256 = "0".repeat(64); })), before - 1, "a rendered pair whose page hash is stale must be dropped by the renderers' buildRows");
    assert.equal(count(mutate((r) => { delete r.match; })), before - 1, "a rendered pair with no match sentence must be dropped by the renderers' buildRows");
    assert.equal(count(mutate((r) => { r.status = "checked"; })), before - 1, "a rendered pair with an unknown status must be dropped by the renderers' buildRows");
    {
      // The status reaches the constant page through the renderers, not only through noteBlock.
      const pages = await import("./render-constant-pages.mjs");
      const manifest = JSON.parse(readFileSync(join(ROOT, "ledger", "teorth-optimizationproblems", "manifest.json"), "utf8"));
      const page = (m) => pages.renderPage(rowsWith(m).find((x) => x.id === target.id), manifest.sha);
      assert.ok(!page(real).includes(esc(STATUS_VARIANTS.derivation.text)), `positive control failed: ${target.id}'s committed page already shows the derivation line`);
      const p = page(mutate((r) => { r.status = "derivation"; }));
      assert.ok(p.includes(esc(STATUS_VARIANTS.derivation.text)), "a rendered pair given the derivation status shows that line on its constant page");
      // An INHERITED status opts nothing in: with Object.prototype polluted, the live page is unchanged.
      const clean = page(real);
      Object.prototype.status = "derivation";
      let polluted;
      try { polluted = page(real); } finally { delete Object.prototype.status; }
      assert.equal(polluted, clean, "an inherited status must not change a live note's page");
    }
    // 7b. Fields attached at composition, not on the record (Codex r3, 2026-10-30).
    const fam = (c) => c.families.find((x) => (x.records || []).some((r) => r.id === target.id && r.statementChecked === true));
    {
      const c = structuredClone(real); const f = fam(c); f.title = "A new record"; for (const r of f.records) if (r.id === target.id) delete r.familyTitle;
      assert.equal(count(c), before - 1, "a family title saying 'record', reached through the fallback, must be dropped by the renderers' buildRows");
    }
    {
      const c = structuredClone(real); c.source.readAt = "soon";
      assert.equal(count(c), 0, "a source read date that is not a date must drop every note (judged by shape, not by the word ban)");
    }
  }
  console.log(`openai-math selftest: PASS (refuses the word "record" in any rendered string, a formal-proof or partial tag with no Lean statement path or quoted statement, a proof tag on a pair we did not read, and a map whose verdicts do not cover every family exactly once, and a status line outside the fixed wordings or on the wrong tag; renders only statement-checked pairs${real ? `; the committed map validates: ${real.families.length} families at ${String(real.source.sha).slice(0, 7)}, and every noted page and the index differ from their no-note render by exactly the note` : ""})`);
}

const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  // No top-level await: the guard imports the renderers, which import this module, and a pending
  // top-level await here would leave that cycle unsettled.
  if (process.argv.includes("--selftest")) selftest().catch((e) => { console.error(e && e.stack || e); process.exitCode = 1; });
  else if (process.argv.includes("--source-hash")) {
    // Prints the hash to paste into a re-read note's sourceSha256. Exit 2 when the page is absent.
    const id = process.argv[process.argv.indexOf("--source-hash") + 1];
    const h = id ? sourceHash(id) : null;
    if (!h) { console.log(`openai-math: no mirrored page for ${JSON.stringify(id)}`); process.exit(2); }
    console.log(`${id} ${h}`);
  } else {
    const map = loadMap();
    if (!map) { console.log("openai-math: no map at ledger/openai-math-map.json"); process.exit(2); }
    const errs = validateMap(map, (id) => existsSync(join(ROOT, "ledger", "teorth-optimizationproblems", "constants", `${id}.md`)), (id) => citesRelease(id), (id) => sourceHash(id));
    const bears = map.families.filter((f) => f.verdict === "bears");
    const pairs = bears.flatMap((f) => f.records);
    const byTag = Object.fromEntries(Object.keys(TAGS).map((t) => [t, pairs.filter((r) => r.tag === t).length]));
    console.log(`openai-math: ${map.families.length} of ${map.source.familyCount} families at openai/math@${String(map.source.sha).slice(0, 7)} (an upstream sha): ${bears.length} bear on a watched record, ${map.families.length - bears.length} do not; ${pairs.length} pair(s): ${Object.entries(byTag).map(([t, c]) => `${t} ${c}`).join(", ")}; rendered ${(() => { const chk = recordCheck(ROOT); return bears.reduce((n, f) => n + f.records.filter((r) => mayRender(r) && !chk(String(f.family), r).length).length, 0); })()}`);
    if (errs.length) { console.log(`INVALID:\n${errs.join("\n")}`); process.exit(1); }
    console.log("RESULT: VALID (exit 0)");
  }
}
