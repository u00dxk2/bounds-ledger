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
//     the construction at a pinned commit (a "posted" entry) or the open pull request on the mirrored
//     repository that proposes it (an "openPullRequest" entry, with the sha256 of the file we evaluated),
//     and says what the watch searched and what it did not.
// Every entry's value is re-derived from its pinned file by scripts/step-overlap.mjs --store.
//
// WHAT IT REFUSES. An entry whose value is not a valid printed bound for its exact maximum (an upper
// bound must round UP, a lower one DOWN), an entry that does not beat the table's best row on its side
// under the arXiv watcher's own exact comparison, a source link not pinned to a full commit sha (or, for
// a pull request, not on the mirrored repository), a missing or malformed file fingerprint or raw link,
// and a constant the mirror does not carry.
//
// WHAT IT NEVER SAYS. That upstream is wrong (its rows remain true bounds; it is behind), that anyone
// refereed the construction, or that upstream SHOULD list it. Upstream contact is David's gate.

import { readFileSync, existsSync, mkdtempSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { esc } from "./lib/html.mjs";
import { isEntryModule } from "./lib/entry-module.mjs";
import { constantsShown, compareConstant, parseBoundCell, CONSTANTS_QUERY } from "./arxiv-watch.mjs";
import { parsePinnedRaw } from "./step-overlap.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const STORE = join(ROOT, "ledger", "newer-results.json");
const CONSTANTS = join(ROOT, "ledger", "teorth-optimizationproblems", "constants");

const FORBIDDEN = /\brecords?\b/i;
const DECIMAL = /^-?\d+\.\d+$/;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const PINNED_PATH = /^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/blob\/[0-9a-f]{40}\/[A-Za-z0-9_.\/-]+$/;
// A GitHub blob link pinned to a full commit sha, judged on the URL AS A BROWSER RESOLVES IT (Codex r6:
// a pattern on the raw string accepted ".../<sha>/../main/f.json", which resolves to the main branch).
// Two separate rules, each with its own selftest case:
//   - the NORMALISED path must be a blob path pinned to a 40-hex sha, which refuses any traversal off the
//     commit, percent-encoded ("%2e%2e") included, since normalisation resolves both;
//   - the link must already BE its normalised form, so the page prints exactly the address a reader lands
//     on (".../<sha>/x/../f.json" resolves to the pinned file, but is refused for that reason).
export function isPinnedGithub(u) {
  let url;
  // A bare "?" or "#" leaves .search/.hash empty but stays in .href (Codex r2 on the raw-link twin; this is
  // its sibling, found by the same-turn sweep 2026-10-17), so refuse the characters themselves.
  if (/[?#]/.test(String(u))) return false;
  try { url = new URL(String(u)); } catch { return false; }
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.search || url.hash || url.username || url.port) return false;
  if (url.href !== String(u)) return false;
  return PINNED_PATH.test(url.pathname);
}
const ARXIV = /^https:\/\/arxiv\.org\/abs\/\d{4}\.\d{4,5}v\d+$/;
// The two kinds of entry (2026-10-17, card 99b614ec). "posted": a file someone posted, linked at a pinned
// commit. "openPullRequest": a construction proposed to the MIRRORED repository in a pull request it has
// not merged; the page links the pull request, never the construction's own repository, so the word ban
// below is judged on what a reader sees and is not narrowed. Either kind carries the sha256 of the bytes
// we evaluated and a pinned raw link to them (never rendered), which step-overlap.mjs --store re-derives.
const UPSTREAM_PR = /^https:\/\/github\.com\/teorth\/optimizationproblems\/pull\/[1-9]\d*$/;
const SHA256 = /^[0-9a-f]{64}$/;
/** For a "posted" entry, the raw link must name the very file the page links: same owner, repo, commit and path. */
function rawMatchesBlob(raw, blob) {
  const p = parsePinnedRaw(raw);
  return !!p && blob === `https://github.com/${p.owner}/${p.repo}/blob/${p.sha}/${p.path}`;
}

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
// constantExists defaults to the SAME exact-membership predicate searchLine uses (Codex r3: it still defaulted
// to a file-exists test, so "../README" validated while searchLine refused it).
export function validateStore(store, { shown = constantsShown(), constantExists = onMirror } = {}) {
  const errs = [];
  if (!store || typeof store !== "object") return ["the store is not an object"];
  if (!ISO.test(String(store.checkedThrough || ""))) errs.push("checkedThrough must be a YYYY-MM-DD date");
  if (typeof store.watchScope !== "string" || !store.watchScope.trim()) errs.push("watchScope must say what the watch searched");
  errs.push(...searchFieldErrors(store, constantExists));
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
    if (!SHA256.test(String(e.fileSha256 || ""))) errs.push(`${at_}: fileSha256 must be the 64-hex sha256 of the bytes we evaluated`);
    if (!parsePinnedRaw(e.fetchUrl)) errs.push(`${at_}: fetchUrl must be a raw.githubusercontent.com link pinned to a full 40-character commit sha`);
    if (e.kind === "posted") {
      if (!isPinnedGithub(e.sourceUrl)) errs.push(`${at_}: sourceUrl must be a GitHub blob link pinned to a full 40-character commit sha`);
      else if (!rawMatchesBlob(e.fetchUrl, e.sourceUrl)) errs.push(`${at_}: fetchUrl must name the same owner, repository, commit and path as sourceUrl`);
      if (!ARXIV.test(String(e.foundVia || ""))) errs.push(`${at_}: foundVia must be a versioned arXiv abstract link`);
    } else if (e.kind === "openPullRequest") {
      if (!UPSTREAM_PR.test(String(e.sourceUrl || ""))) errs.push(`${at_}: an openPullRequest entry's sourceUrl must be a pull request on the mirrored repository, teorth/optimizationproblems`);
      if (!ISO.test(String(e.pullRequestStateOn || ""))) errs.push(`${at_}: pullRequestStateOn must be the YYYY-MM-DD date we read the pull request as open`);
      if ("foundVia" in e) errs.push(`${at_}: an openPullRequest entry was found by reading the pull request, so it carries no foundVia`);
    } else errs.push(`${at_}: kind must be "posted" or "openPullRequest"`);
    for (const f of ["sourcePostedBy", "evaluatedOn"]) if (!ISO.test(String(e[f] || ""))) errs.push(`${at_}: ${f} must be a YYYY-MM-DD date`);
    for (const f of ["construction", "rounding", "method"]) if (typeof e[f] !== "string" || !e[f].trim()) errs.push(`${at_}: ${f} must be a non-empty sentence`);
  }
  // The word ban is judged on the RAW rendered block, links, values and attributes included, and only
  // there (Codex r6: a list of fields missed the URL, so ".../record.json" passed validation and reached
  // the page; the field list was then removed, since the whole block covers every field it named). It
  // runs once the entries are otherwise valid, because only a valid entry can be rendered.
  if (!errs.length) {
    for (const id of [...new Set(entries.map((e) => String(e.id)))]) {
      const block = newerBlock(newerFor(id, store), shown);
      if (FORBIDDEN.test(block)) errs.push(`${id}: the rendered block uses the word "record" (in a link, a value or a fixed phrase)`);
    }
  }
  return errs;
}

// A-86: the reader-facing newer-papers line. Three store fields carry the search it describes: windowFrom
// (the first submission date searched), tools (the names an abstract had to carry) and papersFound (what
// the search returned), beside checkedThrough (the last date searched, which is also the day it ran). All
// three or none: a partial set is refused, and none renders nothing, so the code ships with the line dark
// and only a reviewed data write turns it on (David's gate). Its wording states the window from and through,
// never "checked through": the 2026-10-16 claims pass found that phrase over-reads as complete coverage.
// Codex claims pass r1 (2026-10-30) narrowed the wording three ways: the search is one run for EVERY
// constant, said so on each page (a count read on c/87a.html must not suggest the papers concern 87a);
// papers "matched an abstract search for" the names, never "name" them (nothing here establishes arXiv's
// tokenisation); and "we searched no source other than arXiv" (a result posted both on arXiv and
// elsewhere is not outside the search). Its code review bound two fields to facts: `tools` must equal the
// watcher's own query terms, in order, so a changed query refuses a stale store; and both dates must be
// real calendar dates. `papersFound` stays a reviewed data write: the run's papers.json is never committed.
const SEARCH_FIELDS = ["windowFrom", "tools", "papersFound"];
// The watcher's query terms, read from its exported query string (a fixed constant of ours, not input).
// Codex r2: reading the terms alone discarded the Boolean structure, so an AND query read the same as the
// OR query the line describes. Rather than a third patch, a stated rule whose failure is a refusal: the
// query must be EXACTLY "(abs:T OR abs:T …)", each T a bare word or a quoted phrase; any other shape gives
// no terms, and a store carrying the search is then refused, so the line cannot describe a query it misreads.
const TERM = String.raw`abs:(?:"[^"]+"|[A-Za-z0-9-]+)`;
const OR_QUERY = new RegExp(String.raw`^\(${TERM}(?: OR ${TERM})*\)$`);
export const QUERY_TERMS = OR_QUERY.test(CONSTANTS_QUERY) ? [...CONSTANTS_QUERY.matchAll(/abs:(?:"([^"]+)"|([A-Za-z0-9-]+))/g)].map((m) => m[1] ?? m[2]) : [];
export const queryTermsOf = (q) => (OR_QUERY.test(q) ? [...q.matchAll(/abs:(?:"([^"]+)"|([A-Za-z0-9-]+))/g)].map((m) => m[1] ?? m[2]) : []);
const realDate = (s) => { if (!ISO.test(String(s))) return false; const d = new Date(`${s}T00:00:00Z`); return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s; };
// A constant id is a MEMBER of the mirror's set of constant files, never a path that happens to exist
// (Codex r2: "../README" resolved to the mirror's README.md and passed a file-exists check).
let mirrorIds = null;
const onMirror = (id) => {
  mirrorIds ??= new Set(readdirSync(CONSTANTS).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)));
  return typeof id === "string" && mirrorIds.has(id);
};
function searchFieldErrors(store, constantExists = onMirror) {
  const present = SEARCH_FIELDS.filter((f) => f in store);
  // Codex claims/code pass 2026-10-31: perConstant belongs to the search, so it is never valid alone.
  if (!present.length) return "perConstant" in store ? ["perConstant belongs to the newer-papers search: windowFrom, tools and papersFound are missing"] : [];
  if (present.length < SEARCH_FIELDS.length) return [`the newer-papers fields come together: ${SEARCH_FIELDS.filter((f) => !(f in store)).join(", ")} missing beside ${present.join(", ")}`];
  const errs = [];
  if (!realDate(store.checkedThrough)) errs.push("checkedThrough must be a real calendar date when the store carries the search");
  if (!realDate(store.windowFrom)) errs.push("windowFrom must be a real calendar date");
  else if (realDate(store.checkedThrough) && store.windowFrom > store.checkedThrough) errs.push("windowFrom must not be after checkedThrough");
  if (!QUERY_TERMS.length) errs.push("the watcher's query is not of the form (abs:T OR abs:T …), so this line cannot describe it");
  else if (!Array.isArray(store.tools) || store.tools.length !== QUERY_TERMS.length || !store.tools.every((t, i) => t === QUERY_TERMS[i])) errs.push(`tools must be the watcher's query terms, in order: ${QUERY_TERMS.join(", ")}`);
  if (!Number.isInteger(store.papersFound) || store.papersFound < 0) errs.push("papersFound must be a whole number, zero or more");
  errs.push(...perConstantErrors(store, constantExists));
  return errs;
}

// W-17 (2026-10-31, the manager's REDIRECT): a count alone does not answer the reader's question. When the
// search found papers, the store must also say what they mean for EACH constant, so the line never prints a
// bare "It found N papers" on a page those papers may not concern. perConstant maps a constant id to
// { papers, stronger }: papers = how many of the found papers state a bound on that constant (1..papersFound),
// stronger = "none" (every stated bound was compared and none is stronger than the strongest bound on its side
// of the page's tables), "reported-stronger" (one paper, named in `paper` by its versioned arXiv link, states a
// bound stronger than EVERY bound on its side of the page's tables, asterisked rows included; the line names
// and links it and says we have not checked its work, the manager's "names the one that does, with a link"),
// or "not-compared" (a comparison not finished; the line then says neither stronger nor weaker). `papers`
// counts PAPERS, not bounds, so the singular wording says "one or more bounds" (Codex claims pass: one 1d
// paper stated 12). A constant absent from the map had no paper stating a bound on it. Required when
// papersFound > 0, refused when it is 0, and refused alone. Every id must be a constant on the mirror, checked
// HERE so searchLine and validateStore agree (Codex: they did not).
export const STRONGER = ["none", "reported-stronger", "not-compared"];
function perConstantErrors(store, constantExists = onMirror) {
  if (!Number.isInteger(store.papersFound) || store.papersFound < 0) return [];
  const pc = store.perConstant;
  if (store.papersFound === 0) return pc === undefined ? [] : ["perConstant must be absent when the search found no papers"];
  if (!pc || typeof pc !== "object" || Array.isArray(pc)) return ["perConstant is required when the search found papers: say what they mean for each constant"];
  const errs = [];
  for (const [id, e] of Object.entries(pc)) {
    if (!constantExists(id)) errs.push(`perConstant: the mirror carries no constant ${JSON.stringify(id)}`);
    const keys = e && typeof e === "object" ? Object.keys(e).sort().join(",") : "";
    const want = e?.stronger === "reported-stronger" ? "paper,papers,stronger" : "papers,stronger";
    // W-17 (2026-11-01): a reported-stronger entry MAY also carry constructionLookup; no other state may.
    if (keys !== want && !(e?.stronger === "reported-stronger" && keys === `constructionLookup,${want}`)) { errs.push(`perConstant ${id}: must carry exactly ${want.split(",").join(", ")}${e?.stronger === "reported-stronger" ? " (and optionally constructionLookup)" : ""}`); continue; }
    if ("constructionLookup" in e) errs.push(...lookupErrors(id, e.constructionLookup));
    if (!Number.isInteger(e.papers) || e.papers < 1 || e.papers > store.papersFound) errs.push(`perConstant ${id}: papers must be a whole number from 1 to papersFound`);
    if (!STRONGER.includes(e.stronger)) errs.push(`perConstant ${id}: stronger must be one of ${STRONGER.join(", ")}`);
    if (e.stronger === "reported-stronger" && !(typeof e.paper === "string" && ARXIV.test(e.paper))) errs.push(`perConstant ${id}: paper must be a versioned arXiv abstract link`);
  }
  return errs;
}

// W-17 (2026-11-01): constructionLookup records that someone LOOKED for a function giving a reported-stronger
// value and found none in the paper's text (the linked version, appendices included). { on: the date looked,
// repository: the code repository the paper's project page links to, as a tree at the commit current that day }.
// The page tells the reader the date and the paper-text finding, and how to cite the value meanwhile. It never
// says the value is wrong. The repository is PROVENANCE ONLY: it stays in the store, validated, and is NEVER
// rendered. History: Codex r1 narrowed "the paper publishes it" to the version read, appendices included (the
// paper calls its Appendices I-K its supplementary materials); r2 and r3 found the same class twice more in the
// repository clause (contents claimed from a read of file names, and links listed but not opened), and r3 found
// that a repository clause contradicts the line's closing "We searched no source other than arXiv". So the
// repository clause was dropped (claim less, portable rule 2), never re-patched; the repository finding lives
// in the W-17 ledger row and the card to David, not on the page.
const ARXIV_VERSION = (url) => /v(\d+)$/.exec(url)[1]; // only called on a paper ARXIV already validated
const GH_TREE = /^https:\/\/github\.com\/[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/([A-Za-z0-9_.-]+)\/tree\/[0-9a-f]{40}$/;
function lookupErrors(id, lk) {
  if (!lk || typeof lk !== "object" || Array.isArray(lk) || Object.keys(lk).sort().join(",") !== "on,repository") return [`perConstant ${id}: constructionLookup must carry exactly on, repository`];
  const errs = [];
  if (!realDate(lk.on)) errs.push(`perConstant ${id}: constructionLookup.on must be a real calendar date`);
  const m = typeof lk.repository === "string" ? GH_TREE.exec(lk.repository) : null;
  if (!m || m[1] === "." || m[1] === "..") errs.push(`perConstant ${id}: constructionLookup.repository must be a GitHub repository tree at a full 40-character commit sha`);
  else if (FORBIDDEN.test(lk.repository)) errs.push(`perConstant ${id}: constructionLookup.repository contains the word "record", which this page never prints`);
  return errs;
}

// What the found papers mean for one constant, as sentences after the count. Only called on a valid store.
const SIDE_BEST = "the strongest bound on its side in this page's tables";
function perConstantSentence(store, id) {
  const e = store.perConstant?.[id];
  // "reports a value", never "states a bound" (2026-10-31, the lead's own reading of arXiv:2609.40340v1, Table 9:
  // its numbers are the best evaluator scores of its search runs, which the paper does not state as bounds).
  if (!e) return "None of them reports a value for this constant.";
  const one = e.papers === 1;
  const lead = one ? "One of them reports one or more values for this constant" : `${e.papers} of them report values for this constant`;
  if (e.stronger === "none") return `${lead}, and none of those values is stronger than ${SIDE_BEST}.`;
  if (e.stronger === "not-compared") return `${lead} that we have not finished comparing with this page's tables.`;
  const link = `<a href="${esc(e.paper)}">${esc(arxivLabel(e.paper))}</a>`;
  const lk = e.constructionLookup;
  // Manager review 2026-11-01: state what was found, not what follows from it, then one plain clause for the
  // reader about citing. "Cannot be checked" was refused: the evaluator is public, so a search could be re-run.
  const looked = lk ? ` On ${esc(lk.on)} we looked for a function that gives that value and found none in the paper's text (version ${ARXIV_VERSION(e.paper)}, appendices included). Until one is published and checked, cite that value as a result the paper reports, not as a bound.` : "";
  return `${one ? `One of them, ${link}, reports` : `${lead}. One of those, ${link}, reports`} a value for this constant stronger than every bound on its side in this page's tables. We have not checked that value, and this page's tables do not include it.${looked}`;
}
const orList = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} or ${xs[xs.length - 1]}`);

/** The newer-papers line: a <dt>/<dd> pair for a constant page's <dl>. Empty when the store does not carry the search. */
export function searchLine(store, id, { constantExists = onMirror } = {}) {
  if (!store || typeof store !== "object" || !SEARCH_FIELDS.every((f) => f in store) || searchFieldErrors(store, constantExists).length) return "";
  const n = store.papersFound;
  // A nonzero count renders only for a named constant, with what the papers mean for it (W-17, 2026-10-31).
  if (n > 0 && typeof id !== "string") return "";
  const found = n === 0 ? "It found no papers." : `It found ${n} paper${n === 1 ? "" : "s"}, and we read each one. ${perConstantSentence(store, id)}`;
  return `<dt>Newer papers</dt><dd>On ${esc(store.checkedThrough)} we ran one search for all the constants on this site's main list, not this one alone: arXiv papers submitted from ${esc(store.windowFrom)} to ${esc(store.checkedThrough)} that matched an abstract search for ${esc(orList(store.tools))}. ${found} We searched no source other than arXiv, and papers matching none of these names were outside the search.</dd>`;
}

/** The entries for one constant. */
export function newerFor(id, store = loadStore()) {
  return store && Array.isArray(store.entries) ? store.entries.filter((e) => e.id === id).map((e) => ({ ...e, checkedThrough: store.checkedThrough, watchScope: store.watchScope })) : [];
}

const arxivLabel = (url) => `arXiv:${url.replace(/^https:\/\/arxiv\.org\/abs\//, "")}`;
const prLabel = (url) => `pull request ${url.replace(/^.*\/pull\//, "")}`;

/** The constant-page block: a <dt>/<dd> pair for the page's <dl>. Empty string when no entries. */
export function newerBlock(entries, shown) {
  if (!entries || !entries.length) return "";
  shown ??= constantsShown(); // read the 115 tables only when there is something to render
  const items = entries.map((e) => {
    const best = bestShown(e.id, e.side, shown);
    const which = e.side === "upper" ? "an upper bound" : "a lower bound";
    const table = e.side === "upper" ? "the smallest upper bound" : "the largest lower bound";
    const cap = e.construction.charAt(0).toUpperCase() + e.construction.slice(1);
    const where = e.kind === "openPullRequest"
      ? `proposed in <a href="${esc(e.sourceUrl)}">${esc(prLabel(e.sourceUrl))} to the source table's repository</a>, which was open and not merged when we read it on ${esc(e.pullRequestStateOn)}`
      : `<a href="${esc(e.sourceUrl)}">the posted file</a>, at the commit current on ${esc(e.evaluatedOn)}`;
    const found = e.kind === "openPullRequest"
      ? `We evaluated the construction file in the repository that pull request links, at the commit it names (SHA-256 <code>${esc(e.fileSha256)}</code>, the hash the file's authors list). This pull request lies outside the search below, which reads arXiv only.`
      : `We found it on ${esc(e.evaluatedOn)} through a newer paper, <a href="${esc(e.foundVia)}">${esc(arxivLabel(e.foundVia))}</a>, which reports downloading posted constructions from the same repository and refining the best one; we did not check that paper's refined value.`;
    return `<li><p>${esc(cap)} (${where}) gives ${which} of <code>${esc(e.value)}</code> on this constant. That is ${e.side === "upper" ? "below" : "above"} ${table} in the mirrored source table, <code>${esc(best)}</code>.</p><p>${esc(e.method)} The exact maximum overlap begins ${esc(e.exactMaximum)}…, which we print as <code>${esc(e.value)}</code>: ${esc(e.rounding)}.</p><p>${found}</p></li>`;
  }).join("");
  const first = entries[0];
  const many = entries.length > 1;
  // Heading and scope wording from the 2026-10-16 claims pass (Codex r6): "newer construction" had no
  // comparator (the construction predates our mirror's fetch), and "checked through" over-read as
  // complete coverage; the search is one dated pass with a stated scope.
  // Claims passes r1/r2 (2026-10-17): "the source table" read as live upstream, and its first fix ("the
  // source table above") claimed a location the page does not render (only the last-listed rows are shown).
  // Second appearance of one class, so the wording now claims less: the MIRRORED table, with no location.
  // "The exact value is X…" read as a truncation presented as exact; it now says the maximum BEGINS X.
  return `<dt>Outside the mirrored source table: ${many ? "constructions" : "a construction"} we evaluated independently</dt><dd><ul class="oai">${items}</ul><span class="when">The mirrored source table does not list ${many ? "these constructions" : "this construction"}, and this ledger has not changed the rows above because of ${many ? "them" : "it"}. Search for newer results, run on ${esc(first.checkedThrough)}: we read ${esc(first.watchScope)}; results announced anywhere else may be missing.</span></dd>`;
}

/**
 * THE BOUND-CELL GUARD. Render every page that carries an entry twice, with the store and without it.
 * Removing exactly the block's markup from the first must give the second, byte for byte, so nothing
 * else on the page (no bound cell, no audit note, no footer) can differ because an entry exists.
 */
const insideDl = (page, line) => { const i = page.indexOf(line), open = page.indexOf("<dl>"), close = page.indexOf("</dl>"); return open >= 0 && i > open && i + line.length <= close; };
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
    // A-86: a store carrying the search also puts the newer-papers line on the page; it is removed the same
    // exact way, and must be there when the store carries it.
    const line = searchLine(store, id);
    if (line && !a.includes(line)) { errs.push(`${id}: the store carries the search but the page does not carry the newer-papers line`); continue; }
    if (a.replace(block, "").replace(line, "") !== b) errs.push(`${id}: the page differs from its no-note render by more than the block${line ? " and the newer-papers line" : ""}`);
    if (line && !insideDl(a, line)) errs.push(`${id}: the newer-papers line is not inside the page's <dl>`);
    if (FORBIDDEN.test(block)) errs.push(`${id}: the rendered block uses the word "record"`);
  }
  // A-86: the line is meant for EVERY constant page, so every page with no entry is checked too (Codex r1
  // asked for one, r2 showed one is a sample; the whole population is 120 cheap renders). Placement is by
  // position inside the page's single <dl> only: markup that hides the line there (a <template>, say) is a
  // hostile renderer edit this guard does not claim to catch (Codex r2, kept as a stated limit).
  // W-17: the line is per constant now (its found-papers sentence names this constant), so each page is
  // checked against its OWN line.
  if (rows.some((x) => searchLine(store, x.id))) {
    const ids = new Set(store.entries.map((e) => e.id));
    const plain = rows.filter((x) => !ids.has(x.id));
    if (!plain.length) errs.push("no constant without an entry to check the newer-papers line on");
    for (const p of plain) {
      const line = searchLine(store, p.id);
      const a = pages.renderPage(p, manifest.sha, undefined, store);
      const b = pages.renderPage(p, manifest.sha, undefined, null);
      if (!a.includes(line)) errs.push(`${p.id}: a page with no entry does not carry the newer-papers line`);
      else if (a.replace(line, "") !== b) errs.push(`${p.id}: a page with no entry differs from its no-store render by more than the newer-papers line`);
      else if (!insideDl(a, line)) errs.push(`${p.id}: the newer-papers line is not inside the page's <dl>`);
    }
  }
  return errs;
}

// ---------- selftest (network-free; KP-78: each refusal fires, and stays silent on the legal case) ----------

// The 512-step 1b entry as it stood in the committed store until 2026-10-18, kept only as a selftest
// fixture so the guards over real pages still compare something when the committed store is empty.
const RETIRED_1B_FIXTURE = {
  id: "1b", side: "upper", kind: "posted", value: "0.3808590566149", exactMaximum: "0.38085905661480689909",
  rounding: "the exact maximum overlap, rounded UP at the 13th decimal, so the printed number is itself a valid upper bound",
  construction: "a step function with 512 equal steps on [-1, 1], posted publicly on GitHub",
  sourceUrl: "https://github.com/bzanghi/erdos-minimum-overlap-bochner/blob/1ff3e99d12c75755dfee5620d097e8f781420d3f/lp_research_state/data/ub_certified_search512.json",
  fileSha256: "2d5de841a090c927d06eb603b64405da0e8bef7a4d648f20d9a29c5f77bfbbbf",
  fetchUrl: "https://raw.githubusercontent.com/bzanghi/erdos-minimum-overlap-bochner/1ff3e99d12c75755dfee5620d097e8f781420d3f/lp_research_state/data/ub_certified_search512.json",
  sourcePostedBy: "2026-07-26", foundVia: "https://arxiv.org/abs/2609.40340v1", evaluatedOn: "2026-10-16",
  method: "We evaluated the posted function ourselves, in exact rational arithmetic, against this page's definition.",
};

export async function selftest() {
  let failed = 0;
  const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); };
  // A fixture table: best upper 0.380868 (a rounding), best lower 0.379005.
  const shown = new Map([["t1", { title: "t", upper: parseBoundCell("$0.380868$"), lower: parseBoundCell("$0.379005$") }]]);
  const exists = (id) => id === "t1";
  const good = {
    checkedThrough: "2026-10-16", watchScope: "arXiv papers naming four systems",
    entries: [{ id: "t1", side: "upper", kind: "posted", value: "0.3808590566149", exactMaximum: "0.38085905661480689909", rounding: "rounded up", construction: "a step function", sourceUrl: `https://github.com/o/r/blob/${"a".repeat(40)}/f.json`, fileSha256: "b".repeat(64), fetchUrl: `https://raw.githubusercontent.com/o/r/${"a".repeat(40)}/f.json`, sourcePostedBy: "2026-07-26", foundVia: "https://arxiv.org/abs/2609.40340v1", evaluatedOn: "2026-10-16", method: "We evaluated it." }],
  };
  const pr = { id: "t1", side: "upper", kind: "openPullRequest", value: "0.3808585503165", exactMaximum: "0.38085855031642856010", rounding: "rounded up", construction: "a finer step function", sourceUrl: "https://github.com/teorth/optimizationproblems/pull/225", pullRequestStateOn: "2026-10-17", fileSha256: "c".repeat(64), fetchUrl: `https://raw.githubusercontent.com/x/records/${"d".repeat(40)}/g.json`, sourcePostedBy: "2026-10-13", evaluatedOn: "2026-10-17", method: "We evaluated it too." };
  const v = (patch, extra = {}) => validateStore({ ...good, ...extra, entries: [{ ...good.entries[0], ...patch }] }, { shown, constantExists: exists });
  check("a valid entry passes (the silent half)", validateStore(good, { shown, constantExists: exists }).length === 0);
  // A-86: the newer-papers line. Meaning first (scope words, window, date), the exact-string pin last, so a
  // mutation names the property it broke instead of only "the string differs".
  check("A-86: the watcher's query terms are read as the four names, in order (the positive control for the tools binding)", QUERY_TERMS.join("|") === "AlphaEvolve|ThetaEvolve|TTT-Discover|OpenEvolve");
  check("A-86: a query of any other shape gives no terms (AND, a mixed AND/OR, a NOT, trailing text), so the line is refused rather than describing it", ['(abs:A AND abs:B)', '(abs:A OR abs:B AND abs:C)', '(abs:A OR NOT abs:B)', '(abs:A OR abs:B) AND cat:math.CO', 'abs:A OR abs:B'].every((q) => queryTermsOf(q).length === 0) && queryTermsOf('(abs:A OR abs:"B-C")').join("|") === "A|B-C");
  const searched = { ...good, checkedThrough: "2026-10-30", windowFrom: "2026-10-28", tools: [...QUERY_TERMS], papersFound: 0 };
  const sl = searchLine(searched);
  check("A-86: the line says the search was one run for every constant, not this one alone", sl.includes("we ran one search for all the constants on this site's main list, not this one alone"));
  check("A-86: the line names every query term, as an abstract SEARCH, so the scope sits beside the date", QUERY_TERMS.every((t) => sl.includes(t)) && sl.includes("that matched an abstract search for"));
  check("A-86: the line says what was outside the search", sl.includes("We searched no source other than arXiv, and papers matching none of these names were outside the search."));
  check("A-86: the line states the window from AND through, and the day it ran", sl.includes("submitted from 2026-10-28 to 2026-10-30") && sl.startsWith("<dt>Newer papers</dt><dd>On 2026-10-30 "));
  check("A-86: the line never says 'checked through' or 'record'", !/checked through/i.test(sl) && !FORBIDDEN.test(sl));
  // W-17 (2026-10-31): a nonzero count renders only with what the papers mean for THIS constant.
  const found = (n, pc) => ({ ...searched, papersFound: n, perConstant: pc });
  const fx = { constantExists: exists };
  const SL = (s, id) => searchLine(s, id, fx);
  const EVO = "https://arxiv.org/abs/2609.40340v1";
  check("W-17: a nonzero count with NO perConstant is refused and renders nothing (never a bare count)", validateStore({ ...searched, papersFound: 3 }, { shown, constantExists: exists }).length > 0 && SL({ ...searched, papersFound: 3 }, "t1") === "");
  check("W-17: a nonzero count renders nothing without a constant to speak about", SL(found(3, {}), undefined) === "");
  check("W-17: a constant no paper bears on is told so", SL(found(3, {}), "t1").includes("It found 3 papers, and we read each one. None of them reports a value for this constant."));
  check("W-17: one paper, compared, none stronger: 'one or more bounds', since papers counts papers not bounds", SL(found(1, { t1: { papers: 1, stronger: "none" } }), "t1").includes("It found 1 paper, and we read each one. One of them reports one or more values for this constant, and none of those values is stronger than the strongest bound on its side in this page's tables."));
  check("W-17: several papers, compared, none stronger (plural)", SL(found(15, { t1: { papers: 3, stronger: "none" } }), "t1").includes("3 of them report values for this constant, and none of those values is stronger than the strongest bound on its side in this page's tables."));
  check("W-17: not-compared says so, and never says stronger or weaker", (() => { const l = SL(found(15, { t1: { papers: 1, stronger: "not-compared" } }), "t1"); return l.includes("One of them reports one or more values for this constant that we have not finished comparing with this page's tables.") && !/stronger|weaker|better/.test(l); })());
  // reported-stronger: the manager's "names the one that does, with a link" (Codex claims pass: hiding it misled).
  const ssOne = SL(found(15, { t1: { papers: 1, stronger: "reported-stronger", paper: EVO } }), "t1");
  check("W-17: reported-stronger NAMES and LINKS the paper, says it is stronger than every bound on its side, and says we have not checked it", ssOne.includes(`One of them, <a href="${EVO}">arXiv:2609.40340v1</a>, reports a value for this constant stronger than every bound on its side in this page's tables. We have not checked that value, and this page's tables do not include it.`));
  check("W-17: reported-stronger with several papers keeps the count and names the one", SL(found(15, { t1: { papers: 2, stronger: "reported-stronger", paper: EVO } }), "t1").includes(`2 of them report values for this constant. One of those, <a href="${EVO}">arXiv:2609.40340v1</a>, reports`));
  check("W-17: reported-stronger never says 'record'", !FORBIDDEN.test(ssOne));
  check("W-17: reported-stronger without a paper, with an unversioned or non-arXiv link, or a paper on another state, is refused", [{ papers: 1, stronger: "reported-stronger" }, { papers: 1, stronger: "reported-stronger", paper: "https://arxiv.org/abs/2609.40340" }, { papers: 1, stronger: "reported-stronger", paper: "https://example.com/x" }, { papers: 1, stronger: "none", paper: EVO }].every((e) => validateStore(found(3, { t1: e }), { shown, constantExists: exists }).length > 0 && SL(found(3, { t1: e }), "t1") === ""));
  // W-17 (2026-11-01): constructionLookup. Meaning first, the exact-string pin last.
  const REPO = `https://github.com/Open-Galapagos/EvoDuet/tree/${"7".repeat(40)}`;
  const LK = { on: "2026-11-01", repository: REPO };
  const rsl = (lk, papers = 1) => SL(found(15, { t1: { papers, stronger: "reported-stronger", paper: EVO, ...(lk === undefined ? {} : { constructionLookup: lk }) } }), "t1");
  const withLk = rsl(LK);
  check("W-17 lookup: the store with a lookup validates (positive control, so the refusals below are about the lookup)", validateStore(found(15, { t1: { papers: 1, stronger: "reported-stronger", paper: EVO, constructionLookup: LK } }), { shown, constantExists: exists }).length === 0 && withLk !== "");
  check("W-17 lookup: the line says the date looked and that we found none in the paper's text (v1, appendices included)", withLk.includes("On 2026-11-01 we looked for a function that gives that value and found none in the paper's text (version 1, appendices included)."));
  check("W-17 lookup (Codex r3): the repository is NEVER rendered, so the line claims nothing about its contents and stays inside the arXiv-only closing sentence", !withLk.includes(REPO) && !/github|repositor/i.test(withLk) && withLk.includes("We searched no source other than arXiv"));
  check("W-17 lookup: the line tells the reader to cite it as a reported result, not as a bound", withLk.includes("Until one is published and checked, cite that value as a result the paper reports, not as a bound."));
  check("W-17 lookup: the line never says the value is wrong, false, cannot be checked, or 'record'", !/\b(wrong|false|incorrect|cannot be checked|unverifiable)\b/i.test(withLk) && !FORBIDDEN.test(withLk));
  check("W-17 lookup: the lookup keeps the not-checked sentence and adds to it, it never replaces it", withLk.includes("We have not checked that value, and this page's tables do not include it. On 2026-11-01"));
  check("W-17 lookup: WITHOUT a lookup the line is exactly today's (no lookup text at all)", rsl(undefined) === ssOne && !ssOne.includes("we looked for a function"));
  check("W-17 lookup: the several-papers wording carries the lookup too", rsl(LK, 2).includes(`2 of them report values for this constant. One of those, <a href="${EVO}">arXiv:2609.40340v1</a>, reports`) && rsl(LK, 2).includes("we looked for a function that gives that value") && !rsl(LK, 2).includes(REPO) && !/github|repositor/i.test(rsl(LK, 2)));
  check("W-17 lookup: the version named is the linked paper's own (a v2 link says version 2, never a fixed 1)", withLk.includes("the paper's text (version 1, appendices included)") && SL(found(15, { t1: { papers: 1, stronger: "reported-stronger", paper: "https://arxiv.org/abs/2609.40340v2", constructionLookup: LK } }), "t1").includes("the paper's text (version 2, appendices included)"));
  const lkRefused = (lk, stronger = "reported-stronger") => { const e = { papers: 1, stronger, ...(stronger === "reported-stronger" ? { paper: EVO } : {}), constructionLookup: lk }; return validateStore(found(3, { t1: e }), { shown, constantExists: exists }).length > 0 && SL(found(3, { t1: e }), "t1") === ""; };
  check("W-17 lookup: on any state but reported-stronger it is refused and renders nothing", lkRefused(LK, "none") && lkRefused(LK, "not-compared"));
  check("W-17 lookup: a lookup that is not an object, or has a missing or extra key, is refused", [null, "2026-11-01", [LK], {}, { on: "2026-11-01" }, { repository: REPO }, { ...LK, note: "x" }].every((lk) => lkRefused(lk)));
  check("W-17 lookup: an impossible or malformed date is refused", ["2026-02-30", "2026-13-01", "11/01/2026", "", 20261101].every((on) => lkRefused({ ...LK, on })));
  check("W-17 lookup: a repository link that is not a GitHub tree at a full sha is refused (a branch, a short sha, a blob, another host, a query, a traversal, a dot repo)", [
    "https://github.com/Open-Galapagos/EvoDuet/tree/main", `https://github.com/Open-Galapagos/EvoDuet/tree/${"7".repeat(39)}`, `https://github.com/Open-Galapagos/EvoDuet/blob/${"7".repeat(40)}`,
    `https://gitlab.com/Open-Galapagos/EvoDuet/tree/${"7".repeat(40)}`, `http://github.com/Open-Galapagos/EvoDuet/tree/${"7".repeat(40)}`, `${REPO}?x=1`, `${REPO}/`, `${REPO}#a`,
    `https://github.com/Open-Galapagos/../tree/${"7".repeat(40)}`, `https://github.com/o/./tree/${"7".repeat(40)}`, `https://github.com/Open-Galapagos/EvoDuet/tree/${"7".repeat(40)}/benchmarks`, `https://github.com/O"><b>/EvoDuet/tree/${"7".repeat(40)}`, 42,
  ].every((repository) => lkRefused({ ...LK, repository })));
  check("W-17 lookup: a repository whose name carries the word 'record' is refused (store hygiene: the field is public JSON even though the page never prints it)", lkRefused({ ...LK, repository: `https://github.com/o/records/tree/${"7".repeat(40)}` }));
  check("W-17 lookup (production predicate): 1d with a lookup validates on the real mirror and renders the lookup", (() => { const s = { ...found(3, { "1d": { papers: 1, stronger: "reported-stronger", paper: EVO, constructionLookup: LK } }), entries: [] }; return validateStore(s).length === 0 && searchLine(s, "1d").includes("we looked for a function that gives that value"); })());
  check("W-17 lookup: the exact reported-stronger line with a lookup, the WHOLE line (pinned last; Codex r4: endsWith let a prefix through)", withLk === `<dt>Newer papers</dt><dd>On 2026-10-30 we ran one search for all the constants on this site's main list, not this one alone: arXiv papers submitted from 2026-10-28 to 2026-10-30 that matched an abstract search for AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve. It found 15 papers, and we read each one. One of them, <a href="${EVO}">arXiv:2609.40340v1</a>, reports a value for this constant stronger than every bound on its side in this page's tables. We have not checked that value, and this page's tables do not include it. On 2026-11-01 we looked for a function that gives that value and found none in the paper's text (version 1, appendices included). Until one is published and checked, cite that value as a result the paper reports, not as a bound. We searched no source other than arXiv, and papers matching none of these names were outside the search.</dd>`);
  // Codex code pass: searchLine and validateStore must agree on the same store.
  const orphan = { ...good, perConstant: { t1: { papers: 1, stronger: "none" } } };
  check("W-17: a perConstant with no search fields is refused (it never validates alone)", validateStore(orphan, { shown, constantExists: exists }).length > 0);
  const ghost = found(3, { zz: { papers: 1, stronger: "none" } });
  check("W-17: an unknown constant id in perConstant is refused by validateStore AND renders nothing through searchLine", validateStore(ghost, { shown, constantExists: exists }).length > 0 && SL(ghost, "t1") === "" && searchLine(found(3, { zz: { papers: 1, stronger: "none" } }), "2a") === "");
  // Codex r2, against the PRODUCTION mirror predicate (no injected fixture): a path that resolves to a real
  // file is not a constant, and a non-string link is refused, never coerced and then rendered.
  // Codex r3: the store under test carries NO entries, so a refusal can only come from perConstant (the fixture
  // entry "t1" is not on the real mirror and made every case refuse, a false green). Positive control first: the
  // same store with a real id validates with zero problems and renders.
  const prod = (pc) => ({ ...found(3, pc), entries: [] });
  const okProd = prod({ "1a": { papers: 1, stronger: "none" } });
  check("W-17 (production predicate): the control store with a real id validates with 0 problems and renders", validateStore(okProd).length === 0 && searchLine(okProd, "2a") !== "");
  const refusedOnMirror = (pc) => validateStore(prod(pc)).length > 0 && searchLine(prod(pc), "2a") === "";
  check("W-17: a path-shaped or case-variant id is refused by validateStore AND searchLine on the real mirror", ["../README", "./1a", "../constants/1a", "x/../1a", "constants/1a", "1a.md", "..\\README", "1A", "__proto__"].every((id) => refusedOnMirror({ [id]: { papers: 1, stronger: "none" } })));
  check("W-17: a reported-stronger paper that is not a string (an array, an object) is refused and renders nothing", validateStore(prod({ "1d": { papers: 1, stronger: "reported-stronger", paper: EVO } })).length === 0 && [[EVO], { href: EVO }].every((paper) => refusedOnMirror({ "1d": { papers: 1, stronger: "reported-stronger", paper } })));
  check("W-17: perConstant with a zero count is refused", validateStore({ ...searched, papersFound: 0, perConstant: {} }, { shown, constantExists: exists }).length > 0);
  const pcBad = (e) => validateStore(found(3, { t1: e }), { shown, constantExists: exists }).length > 0;
  check("W-17: a malformed perConstant entry is refused (0 papers, more than found, a non-integer, an unknown stronger, an extra field)", pcBad({ papers: 0, stronger: "none" }) && pcBad({ papers: 4, stronger: "none" }) && pcBad({ papers: 1.5, stronger: "none" }) && pcBad({ papers: 1, stronger: "weaker" }) && pcBad({ papers: 1, stronger: "none", note: "x" }));
  check("W-17: a perConstant id the mirror does not carry is refused", validateStore(found(3, { "9z": { papers: 1, stronger: "none" } }), { shown, constantExists: exists }).length > 0);
  check("W-17: a valid nonzero store passes (the silent half)", validateStore(found(15, { t1: { papers: 3, stronger: "none" } }), { shown, constantExists: exists }).length === 0);
  check("W-17: the exact 15-paper line for a constant with compared bounds (pinned last)", SL({ ...found(15, { t1: { papers: 3, stronger: "none" } }), checkedThrough: "2026-10-31", windowFrom: "2026-09-26" }, "t1") === "<dt>Newer papers</dt><dd>On 2026-10-31 we ran one search for all the constants on this site's main list, not this one alone: arXiv papers submitted from 2026-09-26 to 2026-10-31 that matched an abstract search for AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve. It found 15 papers, and we read each one. 3 of them report values for this constant, and none of those values is stronger than the strongest bound on its side in this page's tables. We searched no source other than arXiv, and papers matching none of these names were outside the search.</dd>");
  check("A-86: a store WITHOUT the search fields validates and renders no line (the dark state)", validateStore(good, { shown, constantExists: exists }).length === 0 && searchLine(good) === "");
  const searchRefused = (patch, drop) => { const s = { ...searched, ...patch }; if (drop) delete s[drop]; return validateStore(s, { shown, constantExists: exists }).length > 0 && searchLine(s) === ""; };
  check("A-86: a partial set (tools missing) is refused and renders nothing", searchRefused({}, "tools"));
  check("A-86: a partial set (windowFrom missing) is refused and renders nothing", searchRefused({}, "windowFrom"));
  check("A-86: tools that differ from the watcher's query (one missing, reordered, an extra or a stranger) are refused", searchRefused({ tools: QUERY_TERMS.slice(1) }) && searchRefused({ tools: [...QUERY_TERMS].reverse() }) && searchRefused({ tools: [...QUERY_TERMS, "FunSearch"] }) && searchRefused({ tools: ["<b>x</b>", ...QUERY_TERMS.slice(1)] }));
  check("A-86: impossible calendar dates are refused (Codex r1's 2026-99-99 and 2026-00-00, and 2026-02-30)", searchRefused({ checkedThrough: "2026-99-99" }) && searchRefused({ windowFrom: "2026-00-00" }) && searchRefused({ windowFrom: "2026-02-30" }));
  check("A-86: a window after its own end and a non-integer or negative count are refused", searchRefused({ windowFrom: "2026-10-31" }) && searchRefused({ papersFound: 1.5 }) && searchRefused({ papersFound: -1 }));
  check("A-86: the exact line (pinned last)", sl === "<dt>Newer papers</dt><dd>On 2026-10-30 we ran one search for all the constants on this site's main list, not this one alone: arXiv papers submitted from 2026-10-28 to 2026-10-30 that matched an abstract search for AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve. It found no papers. We searched no source other than arXiv, and papers matching none of these names were outside the search.</dd>");
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
  check("the block names the value, the table's best row, the exact value, the pinned link and the scope", block.includes("<code>0.3808590566149</code>") && block.includes("<code>0.380868</code>") && block.includes("0.38085905661480689909") && block.includes("a".repeat(40)) && block.includes("run on 2026-10-16") && block.includes("arXiv:2609.40340v1"));
  check("an upper entry renders 'below' the table's smallest upper bound", block.includes("That is below the smallest upper bound"));
  // Codex r6 on e554de2, one case per finding.
  const lowerStore = { ...good, entries: [{ ...good.entries[0], side: "lower", value: "0.379010", exactMaximum: "0.3790101" }] };
  check("r6 #3: a valid LOWER entry passes and renders 'above' the table's largest lower bound, never 'below'", validateStore(lowerStore, { shown, constantExists: exists }).length === 0 && newerBlock(newerFor("t1", lowerStore), shown).includes("That is above the largest lower bound") && !newerBlock(newerFor("t1", lowerStore), shown).includes("is below"));
  check("r6 #2: a link that resolves off the pinned commit ('../main') is refused", v({ sourceUrl: `https://github.com/o/r/blob/${"a".repeat(40)}/../main/f.json` }).some((e) => e.includes("pinned")));
  check("r6 #2: percent-encoded traversal ('%2e%2e') is refused", v({ sourceUrl: `https://github.com/o/r/blob/${"a".repeat(40)}/%2e%2e/main/f.json` }).some((e) => e.includes("pinned")));
  check("r6 #2: a link that still resolves to the pinned file but is not written in its resolved form is refused (the page must print the address a reader lands on)", v({ sourceUrl: `https://github.com/o/r/blob/${"a".repeat(40)}/x/../f.json` }).some((e) => e.includes("pinned")));
  check("r6 #2: a query or fragment on the link is refused", v({ sourceUrl: `https://github.com/o/r/blob/${"a".repeat(40)}/f.json?raw=1` }).some((e) => e.includes("pinned")) && v({ sourceUrl: `https://github.com/o/r/blob/${"a".repeat(40)}/f.json#L1` }).some((e) => e.includes("pinned")));
  check("r6 #4: the word 'record' in the LINK is refused (the ban is judged on the rendered block)", v({ sourceUrl: `https://github.com/o/r/blob/${"a".repeat(40)}/record.json`, fetchUrl: `https://raw.githubusercontent.com/o/r/${"a".repeat(40)}/record.json` }).some((e) => e.includes('"record"')));
  // 2026-10-17 (card 99b614ec): the openPullRequest kind, the file fingerprint and the raw link.
  const both = { ...good, entries: [pr, good.entries[0]] };
  const vp = (patch) => validateStore({ ...good, entries: [{ ...pr, ...patch }] }, { shown, constantExists: exists });
  check("a valid openPullRequest entry beside a posted one passes (the silent half)", validateStore(both, { shown, constantExists: exists }).length === 0);
  const twoBlock = newerBlock(newerFor("t1", both), shown);
  check("the pull-request entry links the pull request, says it was open and not merged on its date, and prints the fingerprint", twoBlock.includes('href="https://github.com/teorth/optimizationproblems/pull/225"') && twoBlock.includes("which was open and not merged when we read it on 2026-10-17") && twoBlock.includes(`<code>${"c".repeat(64)}</code>`));
  check("the raw link is NEVER rendered, so a construction repository named 'records' cannot reach the page through it", !twoBlock.includes("raw.githubusercontent.com") && !FORBIDDEN.test(twoBlock));
  check("two entries render the plural heading and footer; one renders the singular", twoBlock.includes("constructions we evaluated independently") && twoBlock.includes("does not list these constructions") && block.includes("a construction we evaluated independently") && block.includes("does not list this construction"));
  check("sweep 2026-10-17: a page link ending in a bare '?' or '#' is refused (the raw-link gap's sibling)", !isPinnedGithub(`https://github.com/o/r/blob/${"a".repeat(40)}/f.json?`) && !isPinnedGithub(`https://github.com/o/r/blob/${"a".repeat(40)}/f.json#`) && isPinnedGithub(`https://github.com/o/r/blob/${"a".repeat(40)}/f.json`));
  // Claims passes r1/r2 (2026-10-17): the wordings each refuted, pinned out of every rendered variant.
  check("claims r1/r2: no variant claims a table 'above' the note, calls the table bare, predicts upstream, or calls a truncation 'the exact value'", [block, twoBlock, newerBlock(newerFor("t1", lowerStore), shown)].every((b) => !/source table above|this constant's source table|may still accept|The exact value is/.test(b) && b.includes("in the mirrored source table, <code>") && b.includes("The exact maximum overlap begins ")));
  check("the arXiv sentence stays with the posted entry it describes, never with the pull-request entry", twoBlock.split("<li>")[2].includes("arXiv:2609.40340v1") && !twoBlock.split("<li>")[1].includes("arXiv:"));
  check("REFUSES a pull request on any repository but the mirrored one", vp({ sourceUrl: "https://github.com/someone/optimizationproblems/pull/225" }).some((e) => e.includes("mirrored repository")));
  check("REFUSES a pull-request link with a trailing path (/files, /commits)", vp({ sourceUrl: "https://github.com/teorth/optimizationproblems/pull/225/files" }).some((e) => e.includes("mirrored repository")));
  check("REFUSES a pull-request entry with no date for the open state", vp({ pullRequestStateOn: undefined }).some((e) => e.includes("pullRequestStateOn")));
  check("REFUSES a pull-request entry that also claims an arXiv foundVia", vp({ foundVia: "https://arxiv.org/abs/2609.40340v1" }).some((e) => e.includes("carries no foundVia")));
  check("REFUSES an entry with no kind, or an unknown one", v({ kind: undefined }).some((e) => e.includes("kind must be")) && v({ kind: "leaderboard" }).some((e) => e.includes("kind must be")));
  check("REFUSES a malformed fileSha256", v({ fileSha256: "b".repeat(63) }).some((e) => e.includes("fileSha256")) && vp({ fileSha256: "C".repeat(64) }).some((e) => e.includes("fileSha256")));
  check("REFUSES a raw link not pinned to a full commit sha", v({ fetchUrl: "https://raw.githubusercontent.com/o/r/main/f.json" }).some((e) => e.includes("fetchUrl must be")) && vp({ fetchUrl: "https://example.com/g.json" }).some((e) => e.includes("fetchUrl must be")));
  check("REFUSES a posted entry whose raw link names a different file, commit or repository than the page link", v({ fetchUrl: `https://raw.githubusercontent.com/o/r/${"a".repeat(40)}/other.json` }).some((e) => e.includes("same owner")) && v({ fetchUrl: `https://raw.githubusercontent.com/o/r/${"e".repeat(40)}/f.json` }).some((e) => e.includes("same owner")) && v({ fetchUrl: `https://raw.githubusercontent.com/o/q/${"a".repeat(40)}/f.json` }).some((e) => e.includes("same owner")));
  // Codex r1 #2/#3 (2026-10-17): judged by the shared validator (its own cases are in step-overlap.mjs's
  // selftest); here, through the store, for BOTH kinds, on a link otherwise valid in every other respect.
  check("r1 #2: a pull-request entry whose raw link resolves off its commit ('<sha>/../main/') is REFUSED", vp({ fetchUrl: `https://raw.githubusercontent.com/x/records/${"d".repeat(40)}/../main/g.json` }).some((e) => e.includes("fetchUrl must be")));
  check("r1 #2: a posted entry whose raw link resolves to the same file but is not written in resolved form is REFUSED", v({ fetchUrl: `https://raw.githubusercontent.com/o/r/${"a".repeat(40)}/x/../f.json` }).some((e) => e.includes("fetchUrl must be")));
  check("the coarser valid rounding yields ZERO errors, not only the absence of one (r6 note)", v({ value: "0.3808591" }).length === 0);
  check("no entries, no block", newerBlock([], shown) === "" && newerBlock(newerFor("zz", good), shown) === "");
  check("the block never says 'record'", !FORBIDDEN.test(block));
  // The committed store itself, and the guard over the real page.
  const store = loadStore();
  const real = validateStore(store);
  check(`the committed store validates (${real.length} problem(s)${real.length ? ": " + real.join("; ") : ""})`, store !== null && real.length === 0);
  // 2026-10-18 (Codex r2): the store can legitimately be EMPTY (both 1b entries were retired when upstream
  // merged pull request 225). The guard and the invalid-store refusal below must still compare something,
  // so with an empty committed store they run on a fixture holding the retired 512-step 1b entry, rendered
  // against the real 1b row and never written anywhere. An empty store must itself render no block.
  const guardStore = store && store.entries.length ? store : { ...store, entries: [RETIRED_1B_FIXTURE] };
  if (store && !store.entries.length) check("an empty committed store renders no block on any constant", (await import("./render-site.mjs")).buildRows(JSON.parse(readFileSync(join(ROOT, "ledger", "claims.json"), "utf8")), { withDates: false, root: ROOT }).every((r) => newerBlock(newerFor(r.id, store)) === ""));
  const guard = await boundCellGuard(guardStore);
  check(`the bound-cell guard holds on every noted page${guardStore === store ? "" : " (on the retired-entry fixture, the committed store being empty)"} (${guard.length} problem(s)${guard.length ? ": " + guard.join("; ") : ""})`, guard.length === 0);
  // A-86 WIRING: the same guard on a store that also carries the search fields. It requires renderPage to
  // put the newer-papers line on the page, and nothing else to change because of it.
  // W-17: a nonzero count needs perConstant, or no line renders and the guard below would check nothing.
  const searchFixture = { ...guardStore, checkedThrough: "2026-10-30", windowFrom: "2026-10-28", tools: [...QUERY_TERMS], papersFound: 2, perConstant: { "1b": { papers: 1, stronger: "none" } } };
  check("W-17: the guard's fixture renders a per-constant line on a noted page AND on a plain one (positive control, so the guard below checks something)", searchLine(searchFixture, "1b").includes("One of them reports one or more values for this constant") && searchLine(searchFixture, "2a").includes("None of them reports a value for this constant"));
  const wired = await boundCellGuard(searchFixture);
  check(`A-86: renderPage carries the newer-papers line, and the page differs from its no-store render by exactly the block and the line (${wired.length} problem(s)${wired.length ? ": " + wired.join("; ") : ""})`, wired.length === 0);
  // r6 #1, through main() itself: render-constant-pages --check must REFUSE an invalid store before it
  // composes or writes anything. The bad store (an upper bound printed below its exact value) lives in a
  // temp folder and is removed after; the hook env var is the only way it is reached.
  const dir = mkdtempSync(join(tmpdir(), "newer-results-"));
  try {
    const bad = { ...guardStore, entries: guardStore.entries.map((e, i) => (i === 0 ? { ...e, value: e.exactMaximum.slice(0, e.value.length - 1) + "0" } : e)) };
    writeFileSync(join(dir, "bad.json"), JSON.stringify(bad));
    const child = spawnSync(process.execPath, [join(ROOT, "scripts", "render-constant-pages.mjs"), "--check"], { encoding: "utf8", env: { ...process.env, CC_NEWER_RESULTS_STORE: join(dir, "bad.json") } });
    check("r6 #1: render-constant-pages --check REFUSES an invalid store through main(), exit 1, before composing", child.status === 1 && child.stdout.includes("the newer-results store is invalid, so nothing was composed or written"));
    // A-84: both store refusals must run BEFORE buildRows (about 115 `git log -S` calls), so moving either
    // refusal back below it goes red here rather than only slowing this selftest. Judged by BEHAVIOUR (Codex
    // r1 refuted a source-order check): main() runs in process with a buildRows that records whether it was
    // called, against a bad newer-results store, then a bad open-pull-requests store beside the real one.
    // What it does NOT see (Codex r2, kept as a stated limit rather than a third guard): a direct call to the
    // imported buildRows added somewhere above the refusals. It proves main() refuses before calling its
    // row builder, nothing wider.
    const { main: renderMain } = await import("./render-constant-pages.mjs");
    const refusedBeforeRows = (envKey, file, phrase) => {
      writeFileSync(join(dir, "seam.json"), file);
      let called = false;
      const out = [];
      const saved = { log: console.log, exitCode: process.exitCode, env: process.env[envKey] };
      console.log = (...a) => out.push(a.join(" "));
      process.env[envKey] = join(dir, "seam.json");
      try { renderMain({ check: true, buildRowsFn: () => { called = true; return []; } }); }
      finally {
        console.log = saved.log;
        if (saved.env === undefined) delete process.env[envKey]; else process.env[envKey] = saved.env;
      }
      const refused = process.exitCode === 1 && out.some((l) => l.includes(phrase));
      process.exitCode = saved.exitCode;
      return refused && !called;
    };
    check("A-84: a bad newer-results store is refused through main() before it calls its row builder (buildRowsFn)", refusedBeforeRows("CC_NEWER_RESULTS_STORE", "null", "the newer-results store is invalid"));
    check("A-84: a bad open-pull-requests store is refused through main() before it calls its row builder (buildRowsFn)", refusedBeforeRows("CC_OPEN_PULLS_STORE", "null", "the open-pull-requests store is invalid"));
    // r7: a store file that EXISTS but parses to a falsy value, or does not parse, is refused too.
    const refusedFor = (content) => {
      writeFileSync(join(dir, "odd.json"), content);
      const c = spawnSync(process.execPath, [join(ROOT, "scripts", "render-constant-pages.mjs"), "--check"], { encoding: "utf8", env: { ...process.env, CC_NEWER_RESULTS_STORE: join(dir, "odd.json") } });
      return c.status === 1 && c.stdout.includes("the newer-results store is invalid");
    };
    check("r7: a store file holding false, 0, \"\" or null is REFUSED through main(), never read as 'no store'", ["false", "0", '""', "null"].every(refusedFor));
    check("r7: a store file that is not JSON is REFUSED through main()", refusedFor("{not json"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
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
