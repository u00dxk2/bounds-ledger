#!/usr/bin/env node
// arxiv-watch.mjs — the newer-result watcher for the second watched area (Small Ramsey Numbers,
// Table Ia). It asks one question a reader of ramsey.html cannot easily ask alone: has a paper
// posted to arXiv since the survey revision we mirror claimed a bound that beats a value we show?
//
// usage: arxiv-watch.mjs --fetch [--out <dir>]   ask arXiv for the math.CO papers whose abstract says
//                                                 "Ramsey", submitted in the window, and write them to
//                                                 <dir>/papers.json only if the distinct ids returned
//                                                 reconcile with the total arXiv states (at most 1,000)
//        arxiv-watch.mjs --check [--control] [--out <dir>]
//                                                 judge <dir>/verdicts.json against papers.json and the table;
//                                                 --control judges a hand-made set and makes no coverage claim
//        arxiv-watch.mjs --selftest              network-free; both answers of the comparison and of the
//                                                 main refusals
//
// <dir> defaults to tmp/arxiv-watch/<MT date>/, and tmp/ is gitignored ON PURPOSE: a candidate is an
// UNVERIFIED claim about someone else's paper, and this repo is public. Keeping candidates out of
// ledger/, commits, CI output and bus posts is a RULE for whoever runs this (AGENTS.md), not something
// the script can enforce: --out accepts any directory. What the script does enforce: judge() prints no
// paper id, pair, quote or claimed value. Its lines are fixed text, counts it computed, the ledger's own
// revision and revision date, and one validated date from papers.json (the window end); an unparsable
// input file gets a fixed line; --check also prints the paths it was given. See THE OUTPUT RULE above
// judge() for how the selftest checks this, and what it cannot.
//
// THE WINDOW starts at the revision date the ledger records for the survey (revisionDate in
// ledger/ejc-ds1/section-2-1.json) and ends at the end of the current UTC day, because arXiv's
// submittedDate is UTC. THE QUERY is cat:math.CO AND abs:Ramsey. What it cannot see is printed as its
// blindTo line at the start of every fetch, and the query is never widened until something turns up.
//
// THE SPLIT OF WORK. The fetch is mechanical. Deciding what a paper claims is a READING, done outside
// this script by a reader who saves one verdict per paper into verdicts.json:
//   { "papers": [ { "id": "2409.15709", "version": 2, "class": "bears" | "unrelated",
//                   "claims": [ { "k": 5, "l": 5, "side": "upper", "value": 46, "quote": "…" } ],
//                   "incomplete": "<only when a source could not be read>" } ] }
// The reader is asked to report only what the paper STATES; the script cannot check that a quote is
// really from the paper, only that it contains the claimed value. Whether a stated bound BEATS the value
// we show is computed here, from ledger/ejc-ds1/section-2-1.json as it is on disk, so a reader never
// supplies that judgement. --check refuses to call a run complete unless papers.json RECORDS this
// watcher's query, revision and window start, and a window end equal to the UTC date of its own
// fetchedAt (recorded fields, not proof of where the file came from), every fetched id (each distinct)
// has exactly one verdict, and no reading is marked incomplete. The verdict-for-every-paper rule is the
// manager's 2026-10-15 condition; refusing a reading flagged incomplete was added after Codex r1, because
// a blocked source would otherwise pass as "nothing found". Neither rule checks the reading's accuracy.
//
// FINAL VERDICT per paper, derived:
//   claims-a-better-bound  at least one stated bound is STRONGER than a value we show: it beats a range,
//                          or contradicts an exact value. A weaker bound never counts.
//   mentions-only          class "bears", but nothing stated is stronger than what we show
//   unrelated              class "unrelated", and no claims
//
// Exit codes for --check: 0 complete · 1 complete AND at least one candidate (something to read)
//             · 2 could not read (a missing or unparsable file) · 3 refused (incomplete, malformed, off
//             the watcher's recorded population, or not reconciling). --fetch: 0 fetched · 2 arXiv
//             unreachable (a network failure, a non-2xx answer, or a body that dies mid-read) · 3
//             refused (a feed it cannot judge complete). Any other uncaught error, such as a failure to
//             write papers.json, exits 2.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isEntryModule } from "./lib/entry-module.mjs";
import { LEDGER } from "./extract-ds1.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://export.arxiv.org/api/query";
const PAGE = 200;
const MAX_PAPERS = 1000;
export const QUERY = "cat:math.CO AND abs:Ramsey";
export const BLIND_TO = [
  "papers not listed (even as a cross-list) in math.CO, e.g. cs.DM- or math.PR-only",
  "papers whose abstract never says \"Ramsey\" (a title-only or body-only mention)",
  "results announced anywhere but arXiv (a journal, a talk, a personal page)",
  "a bound on a row this table does not carry (k > 10 or l > 15), which is recorded but never a candidate",
  "anything the reader misreads: verdicts are a reading, and this script checks their shape and arithmetic, not their truth",
];
export const CLASSES = ["bears", "unrelated"];
export const VERDICTS = ["claims-a-better-bound", "mentions-only", "unrelated"];

const mtDate = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Denver" }).format(d);
const defaultOut = () => join(ROOT, "tmp", "arxiv-watch", mtDate());

// ---------- the table ----------

// The value each comparison is made against, per (k, l): one lower and one upper value, with the key
// the survey credits where it credits one. ramsey.html prints Table Ib's newer upper bound BESIDE Table
// Ia's (render-ramsey.mjs keeps both per entry); for the comparison this takes the better (smaller) of
// the two, since a claim that only beats Table Ia's figure is not newer than what the page shows.
// Comparing against Table Ia alone makes the first run's verdicts report 19 false candidates, all
// Table Ib values one paper restates (measured 2026-10-15 by disabling this merge and re-running
// --check; 2605.26815). Where Table Ib's value wins, the ref is the label "Table Ib" rather than a key.
export function shownValues(doc) {
  const shown = new Map();
  for (const c of doc.tableIa) {
    const lower = c.exact ?? c.lower;
    const upper = c.exact ?? c.upper;
    shown.set(`${c.k},${c.l}`, {
      k: c.k, l: c.l, exact: c.exact !== undefined,
      lower: lower ?? null, lowerRef: c.lowerRef ?? c.ref ?? null,
      upper: upper ?? null, upperRef: c.upperRef ?? c.ref ?? null,
    });
  }
  for (const c of doc.tableIb ?? []) {
    const key = `${c.k},${c.l}`;
    const row = shown.get(key) ?? { k: c.k, l: c.l, exact: false, lower: null, lowerRef: null, upper: null, upperRef: null };
    if (Number.isInteger(c.upper) && (row.upper === null || c.upper < row.upper)) { row.upper = c.upper; row.upperRef = "Table Ib"; }
    shown.set(key, row);
  }
  return shown;
}

// beats | equals | weaker | contradicts | not-carried. R(k, l) = R(l, k), so the key is normalised.
export function compare(shown, claim) {
  const [k, l] = claim.k <= claim.l ? [claim.k, claim.l] : [claim.l, claim.k];
  const row = shown.get(`${k},${l}`);
  if (!row) return { comparison: "not-carried", ours: null, ref: null };
  const ours = claim.side === "lower" ? row.lower : row.upper;
  const ref = claim.side === "lower" ? row.lowerRef : row.upperRef;
  if (ours === null) return { comparison: "not-carried", ours: null, ref: null };
  if (claim.value === ours) return { comparison: "equals", ours, ref };
  // Direction first: a bound on the far side of ours is weaker and compatible even on an exact row
  // (R(4, 5) <= 26 beside R(4, 5) = 25). Only a STRONGER bound beats a range or contradicts an exact value.
  const stronger = claim.side === "lower" ? claim.value > ours : claim.value < ours;
  if (!stronger) return { comparison: "weaker", ours, ref };
  return { comparison: row.exact ? "contradicts" : "beats", ours, ref };
}

// The window's end is the UTC date at fetch time: arXiv's submittedDate is UTC, so an end built from
// the Mountain Time date drops everything submitted after UTC midnight on a Denver evening (Codex r1).
export const windowEnd = (now = new Date()) => now.toISOString().slice(0, 10);

// ---------- the fetch ----------

const unescapeXml = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? unescapeXml(m[1]).replace(/\s+/g, " ").trim() : null;
};

// Returns { total, entries } or throws on a feed it cannot read. total is null when the feed does not
// state it, which the caller treats as unreadable, never as zero.
export function parseFeed(xml) {
  if (typeof xml !== "string" || !xml.includes("<feed")) throw new Error("not an Atom feed");
  const t = xml.match(/<opensearch:totalResults[^>]*>\s*(\d+)\s*<\/opensearch:totalResults>/);
  const total = t ? Number(t[1]) : null;
  const entries = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const idUrl = tag(e, "id");
    const idm = idUrl && idUrl.match(/arxiv\.org\/abs\/(.+?)v(\d+)$/);
    if (!idm) throw new Error(`an entry carries an id this parser cannot read: ${JSON.stringify(idUrl)}`);
    const categories = [...e.matchAll(/<category[^>]*term="([^"]+)"/g)].map((c) => c[1]);
    entries.push({
      id: idm[1], version: Number(idm[2]),
      title: tag(e, "title"), published: tag(e, "published"), updated: tag(e, "updated"),
      categories, abstract: tag(e, "summary"),
    });
  }
  return { total, entries };
}

const yyyymmdd = (iso) => iso.replace(/-/g, "");
export function queryUrl(from, to, start) {
  const q = `${QUERY} AND submittedDate:[${yyyymmdd(from)}0000 TO ${yyyymmdd(to)}2359]`;
  return `${API}?search_query=${encodeURIComponent(q)}&start=${start}&max_results=${PAGE}&sortBy=submittedDate&sortOrder=ascending`;
}

// Pages through the window. Refuses (throws) a total it cannot read, a total past MAX_PAPERS, and a
// fetch whose unique ids do not reconcile with the total the API stated.
export async function fetchWindow(from, to, { fetchImpl = fetch, pause = () => new Promise((r) => setTimeout(r, 3100)) } = {}) {
  const byId = new Map();
  let total = null;
  for (let start = 0; ; start += PAGE) {
    if (start > 0) await pause(); // arXiv asks for three seconds between calls
    let res;
    try {
      res = await fetchImpl(queryUrl(from, to, start), { headers: { "user-agent": "bounds-ledger arxiv-watch (+https://github.com/u00dxk2/bounds-ledger)" } });
    } catch {
      throw Object.assign(new Error("arXiv API could not be reached (network failure)"), { unreachable: true });
    }
    if (!res.ok) throw Object.assign(new Error(`arXiv API HTTP ${res.status}`), { unreachable: true });
    let body;
    try {
      body = await res.text();
    } catch {
      throw Object.assign(new Error("arXiv API response could not be read (network failure)"), { unreachable: true });
    }
    const page = parseFeed(body);
    if (page.total === null) throw new Error("the feed states no totalResults, so completeness cannot be judged");
    if (total === null) total = page.total;
    else if (page.total !== total) throw new Error(`totalResults moved between pages (${total} then ${page.total})`);
    if (total > MAX_PAPERS) throw new Error(`${total} papers in the window exceeds the ${MAX_PAPERS} this watcher will page through`);
    for (const e of page.entries) byId.set(e.id, e);
    if (page.entries.length === 0 || start + PAGE >= total) break;
  }
  if (byId.size !== total) throw new Error(`fetched ${byId.size} unique paper(s) but the API stated ${total}`);
  return { total, papers: [...byId.values()] };
}

// ---------- the check ----------

// Judges a verdicts document against the fetched papers. Returns { code, lines, tally }.
// `expect` ({ query, revision, from }) is compared with the query, revision and window that papers.json
// RECORDS; a mismatch is refused (Codex r1). That checks recorded fields, not which query really produced
// the file. null marks a CONTROL set, which makes no coverage claim and says so.
// THE OUTPUT RULE (changed shape after Codex r1 and r2 both found input text reaching stdout): every
// line judge() returns is fixed text plus integers the script computed, the ledger's own revision and
// revision date, and ONE value taken from papers.json, its window end, printed only after it validated as
// a date equal to the UTC date of the file's fetchedAt. No other string from papers.json or verdicts.json
// is interpolated, so no paper id, pair, quote or claimed value is printed. The selftest checks every
// line it emits against an exact shape (OUTPUT_SHAPES) and, for known fixtures, the exact expected lines,
// so a value substituted into a number slot is caught too (Codex r3). Shapes replaced the r2-era search
// for forbidden content, which a pattern list can miss; they check syntax, the exact lines check values.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// Every line judge() may return, exactly: {N} is a script-computed integer, {D} a validated date.
export const OUTPUT_SHAPES = [
  "REFUSED — papers.json holds no papers array",
  "REFUSED — papers.json holds {N} paper(s), which is not the integer total it records",
  "REFUSED — papers.json was fetched with a different query than this watcher's",
  "REFUSED — papers.json was fetched against a different survey revision than the ledger mirrors",
  "REFUSED — papers.json's window does not start at the mirrored revision's date",
  "REFUSED — papers.json's window end is not a date on or after its start",
  "REFUSED — papers.json's window end is not the UTC date of its own fetchedAt",
  "REFUSED — a fetched paper lacks a string id or a positive integer version",
  "REFUSED — papers.json lists {N} paper(s) but only {N} distinct id(s)",
  "REFUSED — verdicts.json holds no papers array",
  "REFUSED — verdict #{N} names a paper this run did not fetch",
  "REFUSED — verdict #{N} is a second verdict for one paper (more than one verdict)",
  "REFUSED — verdict #{N} read a different version than the fetch listed",
  "REFUSED — verdict #{N}: its class is not one of bears / unrelated",
  "REFUSED — verdict #{N}: no claims array (write [] for none)",
  "REFUSED — verdict #{N}: class unrelated but claim(s) recorded",
  'REFUSED — verdict #{N}: class bears with no claims needs a one-line "why"',
  'REFUSED — verdict #{N}: "incomplete" must say why the reading could not be finished',
  "REFUSED — verdict #{N}: a claim is malformed (positive integers k, l, value; side lower or upper)",
  "REFUSED — verdict #{N}: a claim carries no quoted line",
  "REFUSED — verdict #{N}: a claim's quoted line does not contain the claimed value",
  "REFUSED — {N} of {N} fetched paper(s) have no verdict, so this run is NOT complete",
  "REFUSED — {N} reading(s) are marked incomplete (a source that could not be read), so this run is NOT complete",
  "coverage: this watcher's query · submitted {D} to {D} (UTC dates) · survey revision {N}",
  "CONTROL set: not a window run, so this makes no coverage claim",
  "papers fetched: {N} · verdicts: {N} · every fetched id has exactly one verdict",
  "  claims-a-better-bound: {N}",
  "  mentions-only: {N}",
  "  unrelated: {N}",
  "parts reconcile: {N} + {N} + {N} = {N}",
  "candidate bound(s) beating or contradicting a value we show: {N} (details stay in verdicts.json, never printed)",
  "stated bounds EQUAL to a value we show: {N} · WEAKER than it: {N}",
  "stated bounds on rows this table does not carry: {N}",
];
const SHAPE_RES = OUTPUT_SHAPES.map((s) => new RegExp("^" + s.split(/(\{N\}|\{D\})/).map((p) => (p === "{N}" ? "\\d+" : p === "{D}" ? "\\d{4}-\\d{2}-\\d{2}" : p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join("") + "$"));
export const isShapedLine = (line) => SHAPE_RES.some((re) => re.test(line));

export function judge(papersDoc, verdictsDoc, shown, expect = null) {
  const refuse = (why) => ({ code: 3, lines: [`REFUSED — ${why}`], tally: null });
  const papers = Array.isArray(papersDoc?.papers) ? papersDoc.papers : null;
  if (!papers) return refuse("papers.json holds no papers array");
  if (!Number.isSafeInteger(papersDoc.total) || papers.length !== papersDoc.total) return refuse(`papers.json holds ${papers.length} paper(s), which is not the integer total it records`);
  let windowTo = null;
  if (expect) {
    if (papersDoc.query !== expect.query) return refuse("papers.json was fetched with a different query than this watcher's");
    if (papersDoc.revision !== expect.revision) return refuse("papers.json was fetched against a different survey revision than the ledger mirrors");
    if (papersDoc.window?.from !== expect.from) return refuse("papers.json's window does not start at the mirrored revision's date");
    const fetchedAt = new Date(papersDoc.fetchedAt);
    const to = papersDoc.window?.to;
    if (typeof to !== "string" || !ISO_DATE.test(to) || to < expect.from) return refuse("papers.json's window end is not a date on or after its start");
    if (Number.isNaN(fetchedAt.getTime()) || windowEnd(fetchedAt) !== to) return refuse("papers.json's window end is not the UTC date of its own fetchedAt");
    windowTo = to;
  }
  if (!papers.every((p) => typeof p?.id === "string" && p.id && Number.isSafeInteger(p.version) && p.version >= 1)) return refuse("a fetched paper lacks a string id or a positive integer version");
  const fetched = new Map(papers.map((p) => [p.id, p]));
  if (fetched.size !== papers.length) return refuse(`papers.json lists ${papers.length} paper(s) but only ${fetched.size} distinct id(s)`);
  const verdicts = Array.isArray(verdictsDoc?.papers) ? verdictsDoc.papers : null;
  if (!verdicts) return refuse("verdicts.json holds no papers array");

  const seen = new Set();
  const tally = Object.fromEntries(VERDICTS.map((v) => [v, 0]));
  let candidates = 0;
  let notCarried = 0;
  let equals = 0;
  let weaker = 0;
  let incomplete = 0;
  const positive = (n) => Number.isSafeInteger(n) && n >= 1;
  for (const [i, v] of verdicts.entries()) {
    const at = `verdict #${i + 1}`;
    const p = fetched.get(v?.id);
    if (!p) return refuse(`${at} names a paper this run did not fetch`);
    if (seen.has(v.id)) return refuse(`${at} is a second verdict for one paper (more than one verdict)`);
    seen.add(v.id);
    if (v.version !== p.version) return refuse(`${at} read a different version than the fetch listed`);
    if (!CLASSES.includes(v.class)) return refuse(`${at}: its class is not one of ${CLASSES.join(" / ")}`);
    const claims = Array.isArray(v.claims) ? v.claims : null;
    if (!claims) return refuse(`${at}: no claims array (write [] for none)`);
    if (v.class === "unrelated" && claims.length) return refuse(`${at}: class unrelated but claim(s) recorded`);
    if (v.class === "bears" && !claims.length && !(typeof v.why === "string" && v.why.trim())) return refuse(`${at}: class bears with no claims needs a one-line "why"`);
    if (v.incomplete !== undefined) {
      if (typeof v.incomplete !== "string" || !v.incomplete.trim()) return refuse(`${at}: "incomplete" must say why the reading could not be finished`);
      incomplete++;
    }
    let beats = false;
    for (const c of claims) {
      if (![c.k, c.l, c.value].every(positive) || !["lower", "upper"].includes(c.side)) return refuse(`${at}: a claim is malformed (positive integers k, l, value; side lower or upper)`);
      if (typeof c.quote !== "string" || !c.quote.trim()) return refuse(`${at}: a claim carries no quoted line`);
      if (!new RegExp(`(^|[^0-9])${c.value}([^0-9]|$)`).test(c.quote)) return refuse(`${at}: a claim's quoted line does not contain the claimed value`);
      const r = compare(shown, c);
      if (r.comparison === "not-carried") notCarried++;
      if (r.comparison === "equals") equals++;
      if (r.comparison === "weaker") weaker++;
      if (r.comparison === "beats" || r.comparison === "contradicts") { beats = true; candidates++; }
    }
    tally[v.class === "unrelated" ? "unrelated" : beats ? "claims-a-better-bound" : "mentions-only"]++;
  }
  const missing = papers.filter((p) => !seen.has(p.id)).length;
  if (missing) return refuse(`${missing} of ${papers.length} fetched paper(s) have no verdict, so this run is NOT complete`);
  if (incomplete) return refuse(`${incomplete} reading(s) are marked incomplete (a source that could not be read), so this run is NOT complete`);
  // With ids distinct, every verdict naming a distinct fetched id and none missing, the tally sums to the
  // fetch by construction; it is printed as the reconcile line, not re-checked by a guard that could never fire.
  const sum = VERDICTS.reduce((s, k) => s + tally[k], 0);
  const lines = [
    expect
      ? `coverage: this watcher's query · submitted ${expect.from} to ${windowTo} (UTC dates) · survey revision ${expect.revision}`
      : "CONTROL set: not a window run, so this makes no coverage claim",
    `papers fetched: ${papers.length} · verdicts: ${verdicts.length} · every fetched id has exactly one verdict`,
    ...VERDICTS.map((k) => `  ${k}: ${tally[k]}`),
    `parts reconcile: ${VERDICTS.map((k) => tally[k]).join(" + ")} = ${sum}`,
    `candidate bound(s) beating or contradicting a value we show: ${candidates} (details stay in verdicts.json, never printed)`,
    `stated bounds EQUAL to a value we show: ${equals} · WEAKER than it: ${weaker}`,
    `stated bounds on rows this table does not carry: ${notCarried}`,
  ];
  return { code: candidates ? 1 : 0, lines, tally, equals, weaker, candidates, notCarried };
}

// ---------- main ----------

function argOut(args) {
  const i = args.indexOf("--out");
  return i >= 0 && args[i + 1] ? args[i + 1] : defaultOut();
}

async function main(args) {
  if (args[0] === "--selftest") return selftest();
  const doc = JSON.parse(readFileSync(LEDGER, "utf8"));
  const out = argOut(args);

  if (args[0] === "--fetch") {
    const from = doc.source.revisionDate;
    // ONE timestamp for both the window end and fetchedAt: a fetch that crosses UTC midnight would
    // otherwise record two dates, and --check would refuse its own file (Codex r3).
    const startedAt = new Date();
    const to = windowEnd(startedAt);
    console.log(`window: submitted ${from} to ${to}, UTC dates (from revision ${doc.source.revision} of the survey, its revisionDate in the ledger)`);
    console.log(`query: ${QUERY}`);
    console.log(`blindTo: ${BLIND_TO.join("; ")}`);
    let got;
    try {
      got = await fetchWindow(from, to);
    } catch (err) {
      console.log(`RESULT: ${err.unreachable ? "UNREACHABLE" : "REFUSED"} — ${err.message} (exit ${err.unreachable ? 2 : 3})`);
      return err.unreachable ? 2 : 3;
    }
    mkdirSync(out, { recursive: true });
    const file = join(out, "papers.json");
    writeFileSync(file, JSON.stringify({ fetchedAt: startedAt.toISOString(), window: { from, to, dates: "UTC" }, query: QUERY, revision: doc.source.revision, total: got.total, papers: got.papers }, null, 2) + "\n");
    console.log(`RESULT: FETCHED — ${got.total} paper(s), every one listed in ${file} (exit 0)`);
    return 0;
  }

  if (args[0] === "--check") {
    const pf = join(out, "papers.json");
    const vf = join(out, "verdicts.json");
    for (const f of [pf, vf]) if (!existsSync(f)) { console.log(`RESULT: UNREADABLE — ${f} does not exist (exit 2)`); return 2; }
    // A JSON.parse error message can quote the file's text, so an unparsable file gets a fixed line.
    const parsed = [];
    for (const f of [pf, vf]) {
      try { parsed.push(JSON.parse(readFileSync(f, "utf8"))); } catch { console.log(`RESULT: UNREADABLE — ${f} is not valid JSON (exit 2)`); return 2; }
    }
    const expect = args.includes("--control") ? null : { query: QUERY, revision: doc.source.revision, from: doc.source.revisionDate };
    const r = judge(parsed[0], parsed[1], shownValues(doc), expect);
    for (const line of r.lines) console.log(line);
    if (r.code === 3) { console.log("RESULT: REFUSED (exit 3)"); return 3; }
    console.log(r.code === 1 ? "RESULT: COMPLETE — candidates to verify by reading the paper (exit 1)" : "RESULT: COMPLETE — no candidate (exit 0)");
    return r.code;
  }

  console.error("usage: node scripts/arxiv-watch.mjs --fetch | --check [--control] [--out <dir>] | --selftest");
  return 2;
}

// ---------- selftest (KP-78: each refusal fires, and stays silent on the legal case) ----------

function selftest() {
  const doc = JSON.parse(readFileSync(LEDGER, "utf8"));
  const shown = shownValues(doc);
  let failed = 0;
  const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); };

  // The comparison is computed from the committed table, both directions.
  check("R(5, 5) <= 46 EQUALS the shown upper bound, credited to AnM4 (positive control)", (() => { const r = compare(shown, { k: 5, l: 5, side: "upper", value: 46 }); return r.comparison === "equals" && r.ours === 46 && r.ref === "AnM4"; })());
  check("R(5, 5) <= 45 BEATS the shown upper bound", compare(shown, { k: 5, l: 5, side: "upper", value: 45 }).comparison === "beats");
  check("R(4, 6) <= 40 EQUALS Table Ib's upper bound (Table Ia prints 41; the page shows both)", (() => { const r = compare(shown, { k: 4, l: 6, side: "upper", value: 40 }); return r.comparison === "equals" && r.ours === 40 && r.ref === "Table Ib"; })());
  check("R(7, 10) <= 2200 is WEAKER than Table Ib's 2119, though it would beat Table Ia's 2826", compare(shown, { k: 7, l: 10, side: "upper", value: 2200 }).comparison === "weaker");
  check("R(5, 5) >= 44 BEATS the shown lower bound", compare(shown, { k: 5, l: 5, side: "lower", value: 44 }).comparison === "beats");
  check("R(5, 5) >= 42 is WEAKER than the shown lower bound", compare(shown, { k: 5, l: 5, side: "lower", value: 42 }).comparison === "weaker");
  check("R(6, 4) is read as R(4, 6) (symmetric key)", compare(shown, { k: 6, l: 4, side: "upper", value: 40 }).comparison === "equals");
  check("R(4, 5) <= 24 CONTRADICTS the exact value 25", compare(shown, { k: 4, l: 5, side: "upper", value: 24 }).comparison === "contradicts");
  check("R(4, 5) >= 26 CONTRADICTS the exact value 25", compare(shown, { k: 4, l: 5, side: "lower", value: 26 }).comparison === "contradicts");
  check("R(4, 5) <= 26 is WEAKER than the exact value 25, never a contradiction", compare(shown, { k: 4, l: 5, side: "upper", value: 26 }).comparison === "weaker");
  check("R(4, 5) >= 24 is WEAKER than the exact value 25, never a contradiction", compare(shown, { k: 4, l: 5, side: "lower", value: 24 }).comparison === "weaker");
  check("the window ends on the UTC date: 05:22Z on 10-16 is 10-16, though it is still 10-15 in Denver", windowEnd(new Date("2026-10-16T05:22:16Z")) === "2026-10-16");
  check("R(3, 16) is NOT CARRIED (outside the table)", compare(shown, { k: 3, l: 16, side: "lower", value: 80 }).comparison === "not-carried");

  // The feed parser: two entries, a stated total, ids with versions.
  const entry = (id, v, title, cats) => `<entry><id>http://arxiv.org/abs/${id}v${v}</id><published>2026-05-01T00:00:00Z</published><updated>2026-05-02T00:00:00Z</updated><title>${title}</title><summary>An abstract &amp; more.</summary>${cats.map((c) => `<category term="${c}"/>`).join("")}</entry>`;
  const feed = (total, entries) => `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">${total === null ? "" : `<opensearch:totalResults xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">${total}</opensearch:totalResults>`}${entries.join("")}</feed>`;
  const two = feed(2, [entry("2605.00001", 1, "Upper bounds on small Ramsey numbers", ["math.CO"]), entry("2605.00002", 3, "Canonical Ramsey for simplices", ["math.CO", "math.MG"])]);
  const parsed = parseFeed(two);
  check("parseFeed reads the total, two ids, their versions and categories", parsed.total === 2 && parsed.entries.length === 2 && parsed.entries[1].version === 3 && parsed.entries[1].categories.includes("math.MG") && parsed.entries[0].abstract === "An abstract & more.");
  check("parseFeed reports a MISSING total as null, never 0", parseFeed(feed(null, [])).total === null);
  let threw = false; try { parseFeed("<html>rate limited</html>"); } catch { threw = true; }
  check("parseFeed refuses a body that is not a feed", threw);

  // The judge: the legal case, then each refusal.
  const papersDoc = { total: 3, papers: [{ id: "2409.15709", version: 2 }, { id: "2605.00001", version: 1 }, { id: "2605.00002", version: 3 }] };
  const good = { papers: [
    { id: "2409.15709", version: 2, class: "bears", claims: [{ k: 5, l: 5, side: "upper", value: 46, quote: "We prove that R(5,5) ≤ 46." }] },
    { id: "2605.00001", version: 1, class: "bears", claims: [{ k: 4, l: 6, side: "upper", value: 39, quote: "we show R(4,6) <= 39" }] },
    { id: "2605.00002", version: 3, class: "unrelated", claims: [] },
  ] };
  const g = judge(papersDoc, good, shown);
  check("judge: a complete run tallies 1 better / 1 mentions-only / 1 unrelated, exit 1 for the one candidate", g.code === 1 && g.tally["claims-a-better-bound"] === 1 && g.tally["mentions-only"] === 1 && g.tally.unrelated === 1);
  check("judge: the positive control (credited paper, value equal to ours) is mentions-only, counted as one EQUAL claim, not a candidate", (() => { const r = judge({ total: 1, papers: [papersDoc.papers[0]] }, { papers: [good.papers[0]] }, shown); return r.code === 0 && r.tally["mentions-only"] === 1 && r.equals === 1 && r.candidates === 0; })());
  check("judge: the no-bound fixture is classed unrelated", (() => { const r = judge({ total: 1, papers: [papersDoc.papers[2]] }, { papers: [good.papers[2]] }, shown); return r.code === 0 && r.tally.unrelated === 1; })());
  const without = (i) => ({ papers: good.papers.filter((_, j) => j !== i) });
  const edit = (i, patch) => ({ papers: good.papers.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  // Each refusal must fire for ITS OWN reason: a mutation that disables one guard must not be masked
  // by a different guard refusing the same input (found by red-arming, 2026-10-15).
  const refusals = [
    ["a fetched paper with no verdict", papersDoc, without(2), "have no verdict"],
    ["a verdict for a paper the run did not fetch", papersDoc, { papers: [...good.papers, { id: "9999.99999", version: 1, class: "unrelated", claims: [] }] }, "did not fetch"],
    ["two verdicts for one paper", papersDoc, { papers: [...good.papers, good.papers[2]] }, "more than one verdict"],
    ["a verdict read on a different version", papersDoc, edit(0, { version: 1 }), "read a different version"],
    ["a reading marked incomplete", papersDoc, edit(1, { incomplete: "the PDF would not open" }), "marked incomplete"],
    ["an empty incomplete note", papersDoc, edit(1, { incomplete: " " }), "must say why"],
    ["a claim with a non-positive index", papersDoc, edit(1, { claims: [{ k: -4, l: 6, side: "upper", value: 39, quote: "R(4,6) <= 39" }] }), "malformed"],
    ["papers.json listing one id twice", { total: 3, papers: [papersDoc.papers[0], papersDoc.papers[0], papersDoc.papers[2]] }, good, "distinct id"],
    ["papers.json with a paper missing its version", { total: 3, papers: [{ id: "2409.15709" }, papersDoc.papers[1], papersDoc.papers[2]] }, good, "positive integer version"],
    ["a class outside bears / unrelated", papersDoc, edit(2, { class: "maybe" }), "is not one of"],
    ["an unrelated paper carrying a claim", papersDoc, edit(2, { claims: good.papers[0].claims }), "class unrelated but"],
    ["a bears paper with no claims and no why", papersDoc, edit(0, { claims: [] }), "needs a one-line"],
    ["a claim with no quoted line", papersDoc, edit(1, { claims: [{ k: 4, l: 6, side: "upper", value: 40, quote: " " }] }), "no quoted line"],
    ["a quote that does not contain the claimed value", papersDoc, edit(1, { claims: [{ k: 4, l: 6, side: "upper", value: 40, quote: "we show R(4,6) <= 401" }] }), "does not contain the claimed value"],
    ["papers.json whose count does not match its own total", { total: 4, papers: papersDoc.papers }, good, "not the integer total it records"],
  ];
  for (const [label, pd, vd, reason] of refusals) {
    const r = judge(pd, vd, shown);
    check(`judge REFUSES ${label}`, r.code === 3 && r.lines[0].includes(reason));
  }
  // Coverage: a WINDOW run is tied to this watcher's query, revision, window start and a window end that
  // is the UTC date of its own fetchedAt.
  const expect = { query: QUERY, revision: doc.source.revision, from: doc.source.revisionDate };
  const windowDoc = { ...papersDoc, fetchedAt: "2026-10-16T05:22:16.835Z", query: QUERY, revision: doc.source.revision, window: { from: doc.source.revisionDate, to: "2026-10-16" } };
  check("judge accepts a window run fetched with this watcher's query, revision and window", judge(windowDoc, good, shown, expect).code === 1);
  const HOSTILE = "math/0301234v1 R(5,5)<=45";
  const windowRefusals = [
    ["a different query", { query: "cat:math.CO AND abs:Schur" }, "different query"],
    ["a different survey revision", { revision: 17 }, "different survey revision"],
    ["a window that starts elsewhere", { window: { from: "2026-06-01", to: "2026-10-16" } }, "does not start"],
    ["a window end that is not a date", { window: { from: doc.source.revisionDate, to: HOSTILE } }, "not a date on or after"],
    ["a window end that is not its fetch's UTC date", { window: { from: doc.source.revisionDate, to: "2026-10-15" } }, "UTC date of its own fetchedAt"],
    ["a total that is not an integer", { total: HOSTILE }, "not the integer total"],
  ];
  for (const [label, patch, reason] of windowRefusals) {
    const r = judge({ ...windowDoc, ...patch }, good, shown, expect);
    check(`judge REFUSES a window run with ${label}`, r.code === 3 && r.lines[0].includes(reason));
  }
  check("a CONTROL check says it makes no coverage claim", judge(papersDoc, good, shown, null).lines[0].startsWith("CONTROL set"));

  // THE OUTPUT RULE, pinned: every line judge() returns on every fixture above, hostile ones included,
  // matches one exact shape in OUTPUT_SHAPES. A line carrying any input text cannot match.
  const emitted = [
    ...refusals.map(([, pd, vd]) => judge(pd, vd, shown)),
    ...windowRefusals.map(([, patch]) => judge({ ...windowDoc, ...patch }, good, shown, expect)),
    judge(windowDoc, good, shown, expect), judge(papersDoc, good, shown, null),
    judge({ total: 1, papers: [papersDoc.papers[0]] }, { papers: [good.papers[0]] }, shown),
    judge(papersDoc, { papers: [{ id: HOSTILE, version: 1, class: "unrelated", claims: [] }] }, shown),
    judge(papersDoc, edit(2, { class: HOSTILE }), shown),
  ].flatMap((r) => r.lines);
  const unshaped = emitted.filter((line) => !isShapedLine(line));
  check(`every one of ${emitted.length} emitted line(s) matches an exact OUTPUT_SHAPES entry (${unshaped.length} do not)`, emitted.length > 20 && unshaped.length === 0);
  check("the shape rule fires on a line that carries input text", !isShapedLine(`REFUSED — papers.json holds 3 paper(s), which is not the integer total ${HOSTILE}`) && isShapedLine("REFUSED — papers.json holds 3 paper(s), which is not the integer total it records"));

  // Exact lines for a known fixture: shapes check syntax only, so a claimed value printed into a number
  // slot would pass them (Codex r3). Every value here is derived from the fixture by hand: 3 papers, one
  // candidate (R(4,6) <= 39 beats Table Ib's 40), one equal claim (R(5,5) <= 46), nothing weaker or uncarried.
  const exact = judge(windowDoc, good, shown, expect).lines;
  const expected = [
    `coverage: this watcher's query · submitted ${doc.source.revisionDate} to 2026-10-16 (UTC dates) · survey revision ${doc.source.revision}`,
    "papers fetched: 3 · verdicts: 3 · every fetched id has exactly one verdict",
    "  claims-a-better-bound: 1",
    "  mentions-only: 1",
    "  unrelated: 1",
    "parts reconcile: 1 + 1 + 1 = 3",
    "candidate bound(s) beating or contradicting a value we show: 1 (details stay in verdicts.json, never printed)",
    "stated bounds EQUAL to a value we show: 1 · WEAKER than it: 0",
    "stated bounds on rows this table does not carry: 0",
  ];
  check("a known window fixture prints exactly the expected lines, values included", JSON.stringify(exact) === JSON.stringify(expected));
  check("judge stays SILENT on a bears paper with no claims but a stated why", judge({ total: 1, papers: [papersDoc.papers[0]] }, { papers: [{ ...good.papers[0], claims: [], why: "a survey of asymptotic bounds, no small value" }] }, shown).code === 0);

  // fetchWindow: reconciles, pages, refuses.
  return (async () => {
    const stub = (bodies) => { let i = 0; return async () => { const b = bodies[i++]; return { ok: b !== 429, status: b === 429 ? 429 : 200, text: async () => b }; }; };
    const noPause = async () => {};
    const ok = await fetchWindow("2026-04-24", "2026-10-15", { fetchImpl: stub([two]), pause: noPause });
    check("fetchWindow returns both papers when the count reconciles", ok.total === 2 && ok.papers.length === 2);
    let unreachable = false;
    try { await fetchWindow("2026-04-24", "2026-10-15", { fetchImpl: async () => { throw new TypeError("fetch failed"); }, pause: noPause }); } catch (err) { unreachable = err.unreachable === true; }
    check("fetchWindow reports a network exception as UNREACHABLE (exit 2), not as a refusal", unreachable);
    let bodyUnreachable = false;
    try { await fetchWindow("2026-04-24", "2026-10-15", { fetchImpl: async () => ({ ok: true, status: 200, text: async () => { throw new TypeError("terminated"); } }), pause: noPause }); } catch (err) { bodyUnreachable = err.unreachable === true; }
    check("fetchWindow reports a body that dies mid-read as UNREACHABLE (exit 2), not as a refusal", bodyUnreachable);
    const fails = [
      ["a 429", [429]],
      ["a feed with no totalResults", [feed(null, [])]],
      ["a total the entries do not reach", [feed(3, [entry("2605.00001", 1, "a", ["math.CO"])])]],
    ];
    for (const [label, bodies] of fails) {
      let refused = false;
      try { await fetchWindow("2026-04-24", "2026-10-15", { fetchImpl: stub(bodies), pause: noPause }); } catch { refused = true; }
      check(`fetchWindow REFUSES ${label}`, refused);
    }
    console.log(failed ? `RESULT: FAIL — ${failed} case(s) (exit 3)` : "RESULT: PASS — comparison, parser, judge refusals and fetch reconciliation (exit 0)");
    return failed ? 3 : 0;
  })();
}

if (isEntryModule(import.meta.url)) {
  Promise.resolve(main(process.argv.slice(2))).then((code) => { process.exitCode = code; }, (err) => { console.error(`arxiv-watch: ${err.message}`); process.exitCode = 2; });
}
