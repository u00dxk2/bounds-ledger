#!/usr/bin/env node
// arxiv-watch.mjs — the newer-result watcher for the second watched area (Small Ramsey Numbers,
// Table Ia). It asks one question a reader of ramsey.html cannot easily ask alone: has a paper
// posted to arXiv since the survey revision we mirror claimed a bound that beats a value we show?
//
// usage: arxiv-watch.mjs --fetch [--out <dir>]   list every math.CO paper in the window into <dir>/papers.json
//        arxiv-watch.mjs --check [--out <dir>]   judge <dir>/verdicts.json against papers.json and the table
//        arxiv-watch.mjs --selftest              network-free; both answers of every refusal
//
// <dir> defaults to tmp/arxiv-watch/<MT date>/. tmp/ is gitignored ON PURPOSE: a candidate is an
// UNVERIFIED claim about someone else's paper, and this repo is public, so candidates never go into
// ledger/, a commit, CI output or a bus post. This script prints COUNTS, never a candidate's content.
//
// THE WINDOW starts at the revision date the ledger records for the survey (revisionDate in
// ledger/ejc-ds1/section-2-1.json) and ends now. THE QUERY is cat:math.CO AND abs:Ramsey. What it
// cannot see is printed on every fetch as its blindTo line, never fixed by widening the query until
// something turns up.
//
// THE SPLIT OF WORK. The fetch is mechanical. Deciding what a paper claims is a READING, done outside
// this script by a reader who saves one verdict per paper into verdicts.json:
//   { "papers": [ { "id": "2409.15709", "version": 2, "class": "bears" | "unrelated",
//                   "claims": [ { "k": 5, "l": 5, "side": "upper", "value": 46, "quote": "…" } ] } ] }
// The reader says only what the paper STATES. Whether a stated bound BEATS the value we show is
// computed here, against the committed table, so no reader can call a match a beat. --check refuses
// to call a run complete unless every fetched id has exactly one verdict and the verdicts sum to the
// fetched count (the manager's 2026-10-15 condition: the model step cannot be self-tested, so the
// script refuses an incomplete one).
//
// FINAL VERDICT per paper, derived:
//   claims-a-better-bound  at least one stated bound beats (or contradicts an exact value) a value we show
//   mentions-only          class "bears", but nothing stated beats what we show
//   unrelated              class "unrelated", and no claims
//
// Exit codes: 0 complete · 1 complete AND at least one candidate (the alarm shape: something to read)
//             2 could not read (network, a missing file) · 3 refused (incomplete, malformed, or a count
//             that does not reconcile).

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

// What the page shows for each (k, l): the lower and upper value, each with the key the survey credits.
// The upper bound is the BETTER of Table Ia's and Table Ib's: ramsey.html prints Table Ib's newer upper
// bound beside Table Ia's (render-ramsey.mjs merges both per entry). Comparing against Table Ia alone
// makes the first run's verdicts report 19 false candidates, all Table Ib values one paper restates
// (measured 2026-10-15 by disabling this merge and re-running --check; 2605.26815).
// Table Ib credits its column as a group, never cell by cell, so its ref here is the group label.
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
  if (row.exact) return { comparison: "contradicts", ours, ref };
  const better = claim.side === "lower" ? claim.value > ours : claim.value < ours;
  return { comparison: better ? "beats" : "weaker", ours, ref };
}

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
    const res = await fetchImpl(queryUrl(from, to, start), { headers: { "user-agent": "bounds-ledger arxiv-watch (+https://github.com/u00dxk2/bounds-ledger)" } });
    if (!res.ok) throw Object.assign(new Error(`arXiv API HTTP ${res.status}`), { unreachable: true });
    const page = parseFeed(await res.text());
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
export function judge(papersDoc, verdictsDoc, shown) {
  const refuse = (why) => ({ code: 3, lines: [`REFUSED — ${why}`], tally: null });
  const papers = Array.isArray(papersDoc?.papers) ? papersDoc.papers : null;
  if (!papers) return refuse("papers.json holds no papers array");
  if (papers.length !== papersDoc.total) return refuse(`papers.json holds ${papers.length} paper(s) but records a total of ${papersDoc.total}`);
  const verdicts = Array.isArray(verdictsDoc?.papers) ? verdictsDoc.papers : null;
  if (!verdicts) return refuse("verdicts.json holds no papers array");

  const fetched = new Map(papers.map((p) => [p.id, p]));
  const seen = new Set();
  const tally = Object.fromEntries(VERDICTS.map((v) => [v, 0]));
  let candidates = 0;
  let notCarried = 0;
  let equals = 0;
  let weaker = 0;
  for (const v of verdicts) {
    const p = fetched.get(v?.id);
    if (!p) return refuse(`a verdict names ${JSON.stringify(v?.id)}, which this run did not fetch`);
    if (seen.has(v.id)) return refuse(`${v.id} has more than one verdict`);
    seen.add(v.id);
    if (v.version !== p.version) return refuse(`${v.id}: verdict read v${v.version} but the fetch listed v${p.version}`);
    if (!CLASSES.includes(v.class)) return refuse(`${v.id}: class ${JSON.stringify(v.class)} is not one of ${CLASSES.join(" / ")}`);
    const claims = Array.isArray(v.claims) ? v.claims : null;
    if (!claims) return refuse(`${v.id}: no claims array (write [] for none)`);
    if (v.class === "unrelated" && claims.length) return refuse(`${v.id}: class unrelated but ${claims.length} claim(s) recorded`);
    if (v.class === "bears" && !claims.length && !(typeof v.why === "string" && v.why.trim())) return refuse(`${v.id}: class bears with no claims needs a one-line "why"`);
    let beats = false;
    for (const c of claims) {
      if (![c.k, c.l, c.value].every(Number.isInteger) || !["lower", "upper"].includes(c.side)) return refuse(`${v.id}: a claim is malformed (integers k, l, value; side lower or upper)`);
      if (typeof c.quote !== "string" || !c.quote.trim()) return refuse(`${v.id}: a claim carries no quoted line`);
      if (!new RegExp(`(^|[^0-9])${c.value}([^0-9]|$)`).test(c.quote)) return refuse(`${v.id}: the quoted line for R(${c.k}, ${c.l}) does not contain the claimed value ${c.value}`);
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
  // With every verdict naming a distinct fetched id and none missing, the tally sums to the fetch by
  // construction; it is printed as the reconcile line, not re-checked by a guard that could never fire.
  const sum = VERDICTS.reduce((s, k) => s + tally[k], 0);
  const lines = [
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
    const to = mtDate();
    console.log(`window: submitted ${from} to ${to} (from revision ${doc.source.revision} of the survey, its revisionDate in the ledger)`);
    console.log(`query: ${QUERY}`);
    let got;
    try {
      got = await fetchWindow(from, to);
    } catch (err) {
      console.log(`RESULT: ${err.unreachable ? "UNREACHABLE" : "REFUSED"} — ${err.message} (exit ${err.unreachable ? 2 : 3})`);
      return err.unreachable ? 2 : 3;
    }
    mkdirSync(out, { recursive: true });
    const file = join(out, "papers.json");
    writeFileSync(file, JSON.stringify({ fetchedAt: new Date().toISOString(), window: { from, to }, query: QUERY, revision: doc.source.revision, total: got.total, papers: got.papers }, null, 2) + "\n");
    console.log(`blindTo: ${BLIND_TO.join("; ")}`);
    console.log(`RESULT: FETCHED — ${got.total} paper(s), every one listed in ${file} (exit 0)`);
    return 0;
  }

  if (args[0] === "--check") {
    const pf = join(out, "papers.json");
    const vf = join(out, "verdicts.json");
    for (const f of [pf, vf]) if (!existsSync(f)) { console.log(`RESULT: UNREADABLE — ${f} does not exist (exit 2)`); return 2; }
    const r = judge(JSON.parse(readFileSync(pf, "utf8")), JSON.parse(readFileSync(vf, "utf8")), shownValues(doc));
    for (const line of r.lines) console.log(line);
    if (r.code === 3) { console.log("RESULT: REFUSED (exit 3)"); return 3; }
    console.log(r.code === 1 ? "RESULT: COMPLETE — candidates to verify by reading the paper (exit 1)" : "RESULT: COMPLETE — no candidate (exit 0)");
    return r.code;
  }

  console.error("usage: node scripts/arxiv-watch.mjs --fetch | --check [--out <dir>] | --selftest");
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
    ["a verdict read on a different version", papersDoc, edit(0, { version: 1 }), "but the fetch listed"],
    ["a class outside bears / unrelated", papersDoc, edit(2, { class: "maybe" }), "is not one of"],
    ["an unrelated paper carrying a claim", papersDoc, edit(2, { claims: good.papers[0].claims }), "class unrelated but"],
    ["a bears paper with no claims and no why", papersDoc, edit(0, { claims: [] }), "needs a one-line"],
    ["a claim with no quoted line", papersDoc, edit(1, { claims: [{ k: 4, l: 6, side: "upper", value: 40, quote: " " }] }), "no quoted line"],
    ["a quote that does not contain the claimed value", papersDoc, edit(1, { claims: [{ k: 4, l: 6, side: "upper", value: 40, quote: "we show R(4,6) <= 401" }] }), "does not contain the claimed value"],
    ["papers.json whose count does not match its own total", { total: 4, papers: papersDoc.papers }, good, "records a total of"],
  ];
  for (const [label, pd, vd, reason] of refusals) {
    const r = judge(pd, vd, shown);
    check(`judge REFUSES ${label}`, r.code === 3 && r.lines[0].includes(reason));
  }
  check("judge stays SILENT on a bears paper with no claims but a stated why", judge({ total: 1, papers: [papersDoc.papers[0]] }, { papers: [{ ...good.papers[0], claims: [], why: "a survey of asymptotic bounds, no small value" }] }, shown).code === 0);

  // fetchWindow: reconciles, pages, refuses.
  return (async () => {
    const stub = (bodies) => { let i = 0; return async () => { const b = bodies[i++]; return { ok: b !== 429, status: b === 429 ? 429 : 200, text: async () => b }; }; };
    const noPause = async () => {};
    const ok = await fetchWindow("2026-04-24", "2026-10-15", { fetchImpl: stub([two]), pause: noPause });
    check("fetchWindow returns both papers when the count reconciles", ok.total === 2 && ok.papers.length === 2);
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
