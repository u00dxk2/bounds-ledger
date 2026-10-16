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
// THE SECOND AREA (--area constants, 2026-10-16): the 115 constants mirrored from teorth/optimizationproblems
// under ledger/teorth-optimizationproblems/. Every flag above takes --area; without it the area is ramsey
// and that path is unchanged. Its window starts at the mirror's fetch date (manifest.json fetchedAt), since
// the mirror has no revision date of its own; its query is CONSTANTS_QUERY, which reaches only papers whose
// abstract names one of four automated-discovery systems (CONSTANTS_BLIND_TO says what that misses). The
// value each claim is compared with is the BEST row on that side of the table (the smallest upper bound, the
// largest lower bound), never the last-listed row, because upstream does not keep rows in order (1a). A
// side the script cannot rank is UNJUDGED and every claim on it is counted "to read by hand": a side with
// a row marked unverified ("*", README asterisk convention) or a row that is not a decimal (symbolic cells
// such as $K_{DR}+10^{-26}$, which defeat numeric ranking). A shown decimal is a rounding to its last
// printed place, with or without "\dots" or "\approx" (only a bare integer or an "= decimal" identity is
// exact), so a claim that differs from it by at most one unit of that place, on EITHER side, is also
// counted to read by hand rather than called a candidate or weaker. All comparisons are exact decimal
// arithmetic on the printed strings (Codex r1). Readers name a constant by its file id (1a, 46a…); the script
// refuses an id the mirror does not carry.
//
// Exit codes for --check: 0 complete · 1 complete AND at least one candidate, or (constants) at least one
// stated bound to read by hand (something to read)
//             · 2 could not read (a missing or unparsable file) · 3 refused (incomplete, malformed, off
//             the watcher's recorded population, or not reconciling). --fetch: 0 fetched · 2 arXiv
//             unreachable (a network failure, a non-2xx answer, or a body that dies mid-read) · 3
//             refused (a feed it cannot judge complete). Any other uncaught error, such as a failure to
//             write papers.json, exits 2.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
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

// ---------- the constants area ----------

export const CONSTANTS_DIR = join(ROOT, "ledger", "teorth-optimizationproblems", "constants");
export const CONSTANTS_MANIFEST = join(ROOT, "ledger", "teorth-optimizationproblems", "manifest.json");
export const CONSTANTS_QUERY = '(abs:AlphaEvolve OR abs:ThetaEvolve OR abs:"TTT-Discover" OR abs:OpenEvolve)';
export const CONSTANTS_BLIND_TO = [
  "every paper whose abstract does not name AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve, which is most human-written work on these constants (a per-constant query map is the next step, not built)",
  "papers submitted before the mirror's fetch date that upstream has not credited yet",
  "results announced anywhere but arXiv (a GitHub repository, a blog, a talk): 1a's smallest listed upper bound cites a repository",
  "a bound on a constant this mirror does not carry, which a reader cannot record as a claim",
  "anything the reader misreads: verdicts are a reading, and this script checks their shape and arithmetic, not their truth",
];

const DEC = "-?\\d+(?:\\.\\d+)?";
const PLAIN_CELL = new RegExp(`^(${DEC})\\s*(\\\\dots|\\\\ldots)?$`);
const TAIL_CELL = new RegExp(`(=|\\\\approx)\\s*(${DEC})\\s*(\\\\dots|\\\\ldots)?$`);
const fracLen = (digits) => (digits.split(".")[1] ?? "").length;
const unitOf = (digits) => 10 ** -fracLen(digits);

// EXACT DECIMALS (Codex r1 on 48b17e2): every comparison is made on the decimal strings, scaled to
// BigInt, never on Number. "1.74999999999999999999" and "1.75" are one double; they are not one bound.
const toDec = (s) => { const neg = s.startsWith("-"); const [i, f = ""] = s.replace(/^-/, "").split("."); return { n: BigInt(`${neg ? "-" : ""}${i}${f}`), scale: f.length }; };
const scaled = (d, scale) => d.n * 10n ** BigInt(scale - d.scale);
const cmpDec = (a, b) => { const s = Math.max(a.scale, b.scale); const x = scaled(a, s), y = scaled(b, s); return x < y ? -1 : x > y ? 1 : 0; };
// |a - b| <= u, exactly
const withinDec = (a, b, u) => { const s = Math.max(a.scale, b.scale, u.scale); const d = scaled(a, s) - scaled(b, s); return (d < 0n ? -d : d) <= scaled(u, s); };

// One bound cell -> { value, half, digits, exact } (digits: the printed decimal; exact: false when the
// printed decimal is a rounding, true only for a bare integer or an "= decimal" identity; half: one unit
// in the last printed place when not exact, else 0), or { unjudged } when the script cannot rank it.
// Never a guess: anything else is unjudged. value and half are Numbers for reading only; comparisons
// use digits.
// approx: the cell printed "\approx" or "\dots", so its bound is the expression, not the decimal, and
// even a claim EQUAL to the printed digits is not shown to be the same bound (Codex r2).
const cellOf = (digits, exact, approx = false) => ({ value: Number(digits), half: exact ? 0 : unitOf(digits), digits, exact, approx });
export function parseBoundCell(raw) {
  const cell = String(raw).trim();
  if (cell.includes("*")) return { unjudged: "unverified" };
  const inner = /^\$[^$]*\$$/.test(cell) ? cell.slice(1, -1).trim() : cell;
  const plain = inner.match(PLAIN_CELL);
  // A decimal with fractional digits is itself a rounding to its last printed place (1b's 0.380868 is
  // 0.380867675827 at more digits; found by the first live run, 2026-10-16), so it carries one unit too.
  // A bare integer is exact.
  if (plain) return cellOf(plain[1], !plain[2] && !plain[1].includes("."), !!plain[2]);
  // A strict or perturbed expression ("< X", "X - \delta", "o(1)") is not the decimal it ends on.
  if (/[<>]|\\[lg]eq?\b|\\[lg]t\b|\\delta|\\epsilon|\\varepsilon|o\(/.test(inner)) return { unjudged: "symbolic" };
  const tail = inner.match(TAIL_CELL);
  if (tail) return cellOf(tail[2], tail[1] === "=" && !tail[3], tail[1] !== "=" || !!tail[3]);
  return { unjudged: "symbolic" };
}

const firstCell = (line) => line.replace(/^\|/, "").split(/(?<!\\)\|/)[0];

// id -> { title, upper, lower }, each side { value, half } for its best row, { unjudged } when any row
// on it cannot be ranked, or null when the file has no such table. Same section and row rules as
// extract-pins.mjs (HTML comments dropped, header and separator lines skipped).
export function parseConstant(body) {
  const clean = body.replace(/<!--[\s\S]*?-->/g, "");
  const title = clean.match(/^# (.+)$/m)?.[1]?.trim() ?? null;
  const out = { title };
  for (const [side, header] of [["upper", "Known upper bounds"], ["lower", "Known lower bounds"]]) {
    const m = clean.match(new RegExp(`^## ${header}\\s*$([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"));
    const lines = m ? m[1].split("\n").map((l) => l.trim()).filter((l) => l.startsWith("|")) : [];
    const isSep = (l) => l.replace(/^\|/, "").replace(/\|$/, "").split("|").every((c) => /^[-: ]*$/.test(c));
    const rows = lines.slice(1).filter((l) => !isSep(l));
    if (!rows.length) { out[side] = null; continue; }
    let best = null;
    for (const r of rows) {
      const p = parseBoundCell(firstCell(r));
      if (p.unjudged) { best = { unjudged: p.unjudged }; break; }
      const c = best ? cmpDec(toDec(p.digits), toDec(best.digits)) : 0;
      // On a tie the tighter print wins (exact, then more digits), so row order cannot widen the interval (Codex r2).
      const tighter = best && c === 0 && (p.exact && !best.exact || p.exact === best.exact && p.half < best.half);
      if (!best || (side === "upper" ? c < 0 : c > 0) || tighter) best = p;
    }
    out[side] = best;
  }
  return out;
}

export function constantsShown(dir = CONSTANTS_DIR) {
  const shown = new Map();
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".md")).sort()) shown.set(f.slice(0, -3), parseConstant(readFileSync(join(dir, f), "utf8")));
  return shown;
}

// equals | weaker | beats | within-precision | unjudged
// THE RULE (changed shape after Codex r1, the second rounding defect in one day): a shown value that is
// not exact is the interval [printed - one unit, printed + one unit]. A claim is EQUAL only when its
// decimal equals the printed one exactly; anywhere else inside the interval, on EITHER side, it is
// WITHIN-PRECISION (to read by hand), because the true value may sit on either side of a rounding (5b's
// 4/7 ~ 0.5714 is below 4/7, so 0.57142 is stronger though it exceeds the print). Only a claim outside
// the interval is called BEATS or WEAKER.
export function compareConstant(shown, claim) {
  const row = shown.get(claim.constant);
  const s = row ? row[claim.side] : null;
  // No table on that side (none in the mirror today) is read by hand like an unrankable one, so a
  // claim never drops out of the printed counts.
  if (!s || s.unjudged) return { comparison: "unjudged" };
  const v = toDec(claim.value);
  const p = toDec(s.digits);
  const c = cmpDec(v, p);
  // A plain printed decimal IS upstream's stated bound, so equal digits are the same bound. A print after
  // "\approx" or "\dots" stands for an expression: equal digits there are read by hand (Codex r2, 5b's
  // 4/7 ~ 0.5714: a paper stating C <= 0.5714 is below 4/7).
  if (c === 0) return { comparison: s.approx ? "within-precision" : "equals" };
  const unit = s.exact ? { n: 0n, scale: 0 } : { n: 1n, scale: fracLen(s.digits) };
  if (withinDec(v, p, unit)) return { comparison: "within-precision" };
  const stronger = claim.side === "lower" ? c > 0 : c < 0;
  return { comparison: stronger ? "beats" : "weaker" };
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
export function queryUrl(from, to, start, query = QUERY) {
  const q = `${query} AND submittedDate:[${yyyymmdd(from)}0000 TO ${yyyymmdd(to)}2359]`;
  return `${API}?search_query=${encodeURIComponent(q)}&start=${start}&max_results=${PAGE}&sortBy=submittedDate&sortOrder=ascending`;
}

// Pages through the window. Refuses (throws) a total it cannot read, a total past MAX_PAPERS, and a
// fetch whose unique ids do not reconcile with the total the API stated.
export async function fetchWindow(from, to, { fetchImpl = fetch, pause = () => new Promise((r) => setTimeout(r, 3100)), query = QUERY } = {}) {
  const byId = new Map();
  let total = null;
  for (let start = 0; ; start += PAGE) {
    if (start > 0) await pause(); // arXiv asks for three seconds between calls
    let res;
    try {
      res = await fetchImpl(queryUrl(from, to, start, query), { headers: { "user-agent": "bounds-ledger arxiv-watch (+https://github.com/u00dxk2/bounds-ledger)" } });
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
  // the constants area (--area constants)
  "REFUSED — papers.json was fetched against a different mirror than the ledger holds",
  "REFUSED — papers.json's window does not start at the mirror's fetch date",
  "REFUSED — verdict #{N}: a claim is malformed (a constant id this mirror carries, side lower or upper, a decimal value written as a string)",
  "coverage: this watcher's constants query · submitted {D} to {D} (UTC dates), from the mirror's fetch date",
  "stated bounds on sides this script cannot rank (an unverified or symbolic row): {N} (to read by hand)",
  "stated bounds within the printed precision of a value we show: {N} (to read by hand)",
];
const SHAPE_RES = OUTPUT_SHAPES.map((s) => new RegExp("^" + s.split(/(\{N\}|\{D\})/).map((p) => (p === "{N}" ? "\\d+" : p === "{D}" ? "\\d{4}-\\d{2}-\\d{2}" : p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join("") + "$"));
export const isShapedLine = (line) => SHAPE_RES.some((re) => re.test(line));

const positiveInt = (n) => Number.isSafeInteger(n) && n >= 1;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const DECIMAL_STRING = new RegExp(`^${DEC}$`);
export const numberTokens = (text) => (String(text).match(/[-\u2212]?\d+(?:(?:\.|,|\{,\}|\\,|\\ |\u2009|\u202f)\d+)*/g) ?? []).map((t) => t.replace(/^\u2212/, "-"));

// What differs between the two areas inside judge(): the refusal wording for a mismatched population,
// the claim's shape, the comparison, and the coverage line. Everything else is shared.
export const AREAS = {
  ramsey: {
    revisionRefusal: "papers.json was fetched against a different survey revision than the ledger mirrors",
    startRefusal: "papers.json's window does not start at the mirrored revision's date",
    malformed: "a claim is malformed (positive integers k, l, value; side lower or upper)",
    validClaim: (c) => [c.k, c.l, c.value].every(positiveInt) && ["lower", "upper"].includes(c.side),
    quoteHas: (quote, value) => new RegExp(`(^|[^0-9])${value}([^0-9]|$)`).test(quote),
    compare: (shown, c) => compare(shown, c),
    coverage: (expect, to) => `coverage: this watcher's query · submitted ${expect.from} to ${to} (UTC dates) · survey revision ${expect.revision}`,
  },
  constants: {
    revisionRefusal: "papers.json was fetched against a different mirror than the ledger holds",
    startRefusal: "papers.json's window does not start at the mirror's fetch date",
    malformed: "a claim is malformed (a constant id this mirror carries, side lower or upper, a decimal value written as a string)",
    validClaim: (c, shown) => typeof c.constant === "string" && shown.has(c.constant) && ["lower", "upper"].includes(c.side) && typeof c.value === "string" && DECIMAL_STRING.test(c.value),
    // A STATED RULE, not a matcher (changed shape after Codex r1 and r2 both beat the token regex): the
    // quote is split into whole number tokens, a sign then digits joined by ".", ",", "{,}", "\,", "\ " or
    // a thin space, so "1.50\,286" and "1{,}5" are ONE token each. The value must equal a token exactly
    // (a unicode minus read as "-"). Anything else is refused, and the reader appends "[= value]".
    quoteHas: (quote, value) => numberTokens(quote).includes(value),
    compare: (shown, c) => compareConstant(shown, c),
    coverage: (expect, to) => `coverage: this watcher's constants query · submitted ${expect.from} to ${to} (UTC dates), from the mirror's fetch date`,
  },
};

export function judge(papersDoc, verdictsDoc, shown, expect = null, areaName = "ramsey") {
  const area = AREAS[areaName];
  const refuse = (why) => ({ code: 3, lines: [`REFUSED — ${why}`], tally: null });
  const papers = Array.isArray(papersDoc?.papers) ? papersDoc.papers : null;
  if (!papers) return refuse("papers.json holds no papers array");
  if (!Number.isSafeInteger(papersDoc.total) || papers.length !== papersDoc.total) return refuse(`papers.json holds ${papers.length} paper(s), which is not the integer total it records`);
  let windowTo = null;
  if (expect) {
    if (papersDoc.query !== expect.query) return refuse("papers.json was fetched with a different query than this watcher's");
    if (papersDoc.revision !== expect.revision) return refuse(area.revisionRefusal);
    if (papersDoc.window?.from !== expect.from) return refuse(area.startRefusal);
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
  let unjudged = 0;
  let withinPrecision = 0;
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
      if (!c || !area.validClaim(c, shown)) return refuse(`${at}: ${area.malformed}`);
      if (typeof c.quote !== "string" || !c.quote.trim()) return refuse(`${at}: a claim carries no quoted line`);
      if (!area.quoteHas(c.quote, c.value)) return refuse(`${at}: a claim's quoted line does not contain the claimed value`);
      const r = area.compare(shown, c);
      if (r.comparison === "not-carried") notCarried++;
      if (r.comparison === "unjudged") unjudged++;
      if (r.comparison === "within-precision") withinPrecision++;
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
    expect ? area.coverage(expect, windowTo) : "CONTROL set: not a window run, so this makes no coverage claim",
    `papers fetched: ${papers.length} · verdicts: ${verdicts.length} · every fetched id has exactly one verdict`,
    ...VERDICTS.map((k) => `  ${k}: ${tally[k]}`),
    `parts reconcile: ${VERDICTS.map((k) => tally[k]).join(" + ")} = ${sum}`,
    `candidate bound(s) beating or contradicting a value we show: ${candidates} (details stay in verdicts.json, never printed)`,
    `stated bounds EQUAL to a value we show: ${equals} · WEAKER than it: ${weaker}`,
    ...(areaName === "constants"
      ? [
          `stated bounds on sides this script cannot rank (an unverified or symbolic row): ${unjudged} (to read by hand)`,
          `stated bounds within the printed precision of a value we show: ${withinPrecision} (to read by hand)`,
        ]
      : [`stated bounds on rows this table does not carry: ${notCarried}`]),
  ];
  const toHand = unjudged + withinPrecision;
  return { code: candidates || toHand ? 1 : 0, lines, tally, equals, weaker, candidates, notCarried, unjudged, withinPrecision };
}

// ---------- main ----------

function argValue(args, flag) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
}

// The population each area's run is tied to: the query, the revision papers.json must record, and the
// window start. Ramsey's are the survey revision and its date; the constants' are the mirror's upstream
// sha and the UTC date of its fetchedAt (manifest.json).
function population(areaName) {
  if (areaName === "constants") {
    const m = JSON.parse(readFileSync(CONSTANTS_MANIFEST, "utf8"));
    return { query: CONSTANTS_QUERY, revision: m.sha, from: m.fetchedAt.slice(0, 10), blindTo: CONSTANTS_BLIND_TO, shown: () => constantsShown(),
      describe: (from, to) => `window: submitted ${from} to ${to}, UTC dates (from the mirror's fetch date in ledger/teorth-optimizationproblems/manifest.json)`,
      out: () => join(defaultOut(), "constants") };
  }
  const doc = JSON.parse(readFileSync(LEDGER, "utf8"));
  return { query: QUERY, revision: doc.source.revision, from: doc.source.revisionDate, blindTo: BLIND_TO, shown: () => shownValues(doc),
    describe: (from, to) => `window: submitted ${from} to ${to}, UTC dates (from revision ${doc.source.revision} of the survey, its revisionDate in the ledger)`,
    out: defaultOut };
}

async function main(args) {
  if (args[0] === "--selftest") return selftest();
  const areaName = argValue(args, "--area") ?? "ramsey";
  if (!AREAS[areaName]) { console.error(`usage: --area takes ${Object.keys(AREAS).join(" or ")}`); return 2; }
  const pop = population(areaName);
  const out = argValue(args, "--out") ?? pop.out();

  if (args[0] === "--fetch") {
    const from = pop.from;
    // ONE timestamp for both the window end and fetchedAt: a fetch that crosses UTC midnight would
    // otherwise record two dates, and --check would refuse its own file (Codex r3).
    const startedAt = new Date();
    const to = windowEnd(startedAt);
    console.log(pop.describe(from, to));
    console.log(`query: ${pop.query}`);
    console.log(`blindTo: ${pop.blindTo.join("; ")}`);
    let got;
    try {
      got = await fetchWindow(from, to, { query: pop.query });
    } catch (err) {
      console.log(`RESULT: ${err.unreachable ? "UNREACHABLE" : "REFUSED"} — ${err.message} (exit ${err.unreachable ? 2 : 3})`);
      return err.unreachable ? 2 : 3;
    }
    mkdirSync(out, { recursive: true });
    const file = join(out, "papers.json");
    writeFileSync(file, JSON.stringify({ fetchedAt: startedAt.toISOString(), window: { from, to, dates: "UTC" }, query: pop.query, revision: pop.revision, total: got.total, papers: got.papers }, null, 2) + "\n");
    // The constants a reader may name, by id and title (upstream's own titles; no values, so a reader
    // is never told what we show).
    if (areaName === "constants") writeFileSync(join(out, "constants.json"), JSON.stringify([...pop.shown()].map(([id, c]) => ({ id, title: c.title })), null, 2) + "\n");
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
    const expect = args.includes("--control") ? null : { query: pop.query, revision: pop.revision, from: pop.from };
    const r = judge(parsed[0], parsed[1], pop.shown(), expect, areaName);
    for (const line of r.lines) console.log(line);
    if (r.code === 3) { console.log("RESULT: REFUSED (exit 3)"); return 3; }
    if (areaName === "constants" && r.code === 1) console.log("RESULT: COMPLETE — candidates, or bounds the script cannot rank, to verify by reading the paper (exit 1)");
    else console.log(r.code === 1 ? "RESULT: COMPLETE — candidates to verify by reading the paper (exit 1)" : "RESULT: COMPLETE — no candidate (exit 0)");
    return r.code;
  }

  console.error("usage: node scripts/arxiv-watch.mjs --fetch | --check [--control] [--out <dir>] | --selftest, each with [--area ramsey | constants]");
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

  // ---- the constants area ----
  // Cell parser: a decimal only when the cell IS one; everything else is unjudged, never guessed.
  const cell = (raw, want) => { const p = parseBoundCell(raw); return JSON.stringify({ value: p.value, half: p.half, unjudged: p.unjudged }) === JSON.stringify(want); };
  check("cell: a plain decimal is a rounding, one unit in its last place", cell("$1.502862$", { value: 1.502862, half: 1e-6 }));
  check("cell: a bare integer is exact", cell("12", { value: 12, half: 0 }));
  check("cell: \"= decimal\" with no \\dots is exact", cell("$1/2=0.5$", { value: 0.5, half: 0 }));
  check("cell: \"= decimal\\dots\" is a rounding, one unit in its last place", cell("$\\pi/2 = 1.5707963\\dots$", { value: 1.5707963, half: 1e-7 }));
  check("cell: \"\\approx decimal\" is a rounding, one unit in its last place", cell("$\\sinh(\\pi/2) \\approx 2.30130$", { value: 2.3013, half: 1e-5 }));
  check("cell: an asterisk (unverified) is UNJUDGED", cell("$1.292*$", { unjudged: "unverified" }));
  check("cell: a symbolic cell is UNJUDGED", cell("$K_{DR} + 10^{-26}$", { unjudged: "symbolic" }));
  check("cell: a strict bound ending in \\approx is UNJUDGED, not the decimal it ends on", cell("$< \\dfrac{\\pi}{2} \\approx 1.57080$", { unjudged: "symbolic" }));
  check("cell: a perturbed bound ending in \\approx is UNJUDGED", cell("$\\pi/2-\\delta$ with $\\delta\\approx 0.00013$", { unjudged: "symbolic" }));
  check("cell: text after the closing $ is UNJUDGED", cell("$3.65$ (unpublished)", { unjudged: "symbolic" }));

  // A 1a-shaped table: upper rows out of order (the best is not the last), lower side with an unverified row.
  const constFixture = (lowerTail) => `# Fixture constant

## Known upper bounds

| Bound | Reference | Comments |
| ----- | --------- | -------- |
| $\\pi/2 = 1.5707963\\dots$ | [A] | |
| $1.503133$ | [B] | |
| $1.503871$ | [C] | |
| $1.502862$ | [D] | |

## Known lower bounds

| Bound | Reference | Comments |
| ----- | --------- | -------- |
| $1$ | Trivial | |
| $1.2802$ | [E] | |
${lowerTail}
## References
`;
  const fx = parseConstant(constFixture("| $1.292*$ | [F] | Unverified |\n"));
  check("the shown upper value is the BEST row (1.502862), not the last-listed or first one", fx.upper.value === 1.502862 && fx.upper.half === 1e-6);
  check("a side with an unverified row is UNJUDGED (the 1a lower-bound case)", fx.lower.unjudged === "unverified");
  const fxOk = parseConstant(constFixture(""));
  check("without the unverified row the lower side ranks, best = largest (1.2802)", fxOk.lower.value === 1.2802);
  const cshown = new Map([["fx", fxOk], ["fu", fx], ["fr", { title: "r", upper: parseBoundCell("$\\sinh(\\pi/2) \\approx 2.30130$"), lower: null }]]);
  const cmp = (constant, side, value) => compareConstant(cshown, { constant, side, value }).comparison;
  check("constants: an upper claim equal to the best row EQUALS", cmp("fx", "upper", "1.502862") === "equals");
  check("constants: an upper claim equal to a non-best row (1.503133) is WEAKER", cmp("fx", "upper", "1.503133") === "weaker");
  check("constants: an upper claim below the best row BEATS", cmp("fx", "upper", "1.5028") === "beats");
  check("constants: a lower claim above the best row BEATS", cmp("fx", "lower", "1.29") === "beats");
  check("constants: a lower claim below the best row is WEAKER", cmp("fx", "lower", "1.28") === "weaker");
  check("constants: a claim on an unverified side is UNJUDGED", cmp("fu", "lower", "1.3") === "unjudged");
  check("constants: a claim on a side with no table is UNJUDGED, never dropped", cmp("fr", "lower", "1") === "unjudged");
  check("constants: a stronger claim inside a rounded value's last unit is WITHIN-PRECISION", cmp("fr", "upper", "2.301295") === "within-precision");
  check("constants: a stronger claim outside that unit BEATS", cmp("fr", "upper", "2.3012") === "beats");
  check("constants: more digits of the same rounded value are WITHIN-PRECISION, not a candidate (1b: 0.380867675827 vs 0.380868)", cmp("fx", "upper", "1.5028615") === "within-precision");
  // Codex r1 on 48b17e2, one case per finding.
  const one = (cellText, side, value) => compareConstant(new Map([["k", { title: "k", [side]: parseBoundCell(cellText) }]]), { constant: "k", side, value }).comparison;
  check("r1 #1: a claim past a rounded print but inside its unit is WITHIN-PRECISION, never WEAKER (5b: 4/7 ~ 0.5714, claim 0.57142)", one("$4/7 \\approx 0.5714$", "upper", "0.57142") === "within-precision");
  check("r1 #2: exact decimals — 1.74999999999999999999 BEATS an exact 7/4 = 1.75 (one double, two bounds)", one("$7/4 = 1.75$", "upper", "1.74999999999999999999") === "beats");
  check("r1 #2: exact decimals — 1.750 EQUALS 1.75", one("$7/4 = 1.75$", "upper", "1.750") === "equals");
  check("r1 #3: the quote must hold the value as a whole token — \"1\" is NOT in \"C >= 1.7\"", !AREAS.constants.quoteHas("C >= 1.7", "1") && AREAS.constants.quoteHas("C >= 1.7", "1.7") && AREAS.constants.quoteHas("bound 1.", "1"));
  check("r1 #3: a minus sign is part of the token — \"1\" is NOT in \"x = -1\"", !AREAS.constants.quoteHas("x = -1", "1") && AREAS.constants.quoteHas("x = -1", "-1"));
  // Codex r2 on b9950c2, one case per finding.
  check("r2 #1: \"1.50\\,286\" is ONE token: neither \"286\" nor \"1.50286\" is in it, \"[= 1.50286]\" is", !AREAS.constants.quoteHas("C ≤ 1.50\\,286", "286") && !AREAS.constants.quoteHas("C ≤ 1.50\\,286", "1.50286") && AREAS.constants.quoteHas("C ≤ 1.50\\,286 [= 1.50286]", "1.50286"));
  check("r2 #1: \"1{,}5\" is ONE token, so \"5\" is not in it; a unicode minus reads as \"-\"", !AREAS.constants.quoteHas("C = 1{,}5", "5") && AREAS.constants.quoteHas("C ≥ −0.5", "-0.5") && !AREAS.constants.quoteHas("C ≥ −0.5", "0.5"));
  check("r2 #2: a claim EQUAL to the digits of an \\approx print is WITHIN-PRECISION, not EQUAL (5b: C <= 0.5714 is below 4/7)", one("$4/7 \\approx 0.5714$", "upper", "0.5714") === "within-precision");
  check("r2 #2: a claim equal to a PLAIN printed decimal stays EQUAL (that decimal is upstream's stated bound)", one("$0.380868$", "upper", "0.380868") === "equals");
  const tie = (rows) => parseConstant(`# t\n\n## Known upper bounds\n\n| Bound | Reference |\n| --- | --- |\n${rows.map((r) => `| ${r} | [X] |`).join("\n")}\n\n## References\n`).upper;
  check("r2 #3: on equal values the tighter print wins whatever the row order (exact 3/2 = 1.5 over plain 1.5)", tie(["$1.5$", "$3/2 = 1.5$"]).exact === true && tie(["$3/2 = 1.5$", "$1.5$"]).exact === true);
  check("constants: a bare integer stays exact, so a stronger integer BEATS", (() => { const m = new Map([["i", { title: "i", upper: parseBoundCell("12"), lower: null }]]); return compareConstant(m, { constant: "i", side: "upper", value: "11" }).comparison === "beats"; })());

  // The live mirror, read as committed: the two points the 10-16 review asked about, on 1a itself.
  const live = constantsShown();
  // In 1a the best upper row happens also to be the last-listed one, so this live check cannot tell the
  // two rules apart; the out-of-order fixture above is the check that does.
  check("mirror: 1a's upper side shows 1.502862", live.get("1a")?.upper?.value === 1.502862);
  check("the constants query reaches the arXiv URL, the Ramsey query does not", decodeURIComponent(queryUrl("2026-09-26", "2026-10-16", 0, CONSTANTS_QUERY)).includes(CONSTANTS_QUERY) && !decodeURIComponent(queryUrl("2026-09-26", "2026-10-16", 0)).includes("AlphaEvolve"));
  check("mirror: 1a's lower side is UNJUDGED (its 1.292* row is marked unverified)", live.get("1a")?.lower?.unjudged === "unverified");
  check("mirror: every constant file parsed, and some sides rank and some do not", live.size >= 100 && [...live.values()].some((c) => c.upper?.value !== undefined) && [...live.values()].some((c) => c.upper?.unjudged));

  // judge(), constants area: the legal case, the constants-only refusals, and exact lines.
  const cPapers = { total: 3, papers: [{ id: "2601.16175", version: 2 }, { id: "2610.00001", version: 1 }, { id: "2610.00002", version: 1 }] };
  const cGood = { papers: [
    { id: "2601.16175", version: 2, class: "bears", claims: [{ constant: "fx", side: "upper", value: "1.502862", quote: "we obtain C ≤ 1.502862" }] },
    { id: "2610.00001", version: 1, class: "bears", claims: [{ constant: "fx", side: "upper", value: "1.5028", quote: "a new upper bound of 1.5028" }, { constant: "fu", side: "lower", value: "1.3", quote: "C ≥ 1.3" }] },
    { id: "2610.00002", version: 1, class: "unrelated", claims: [] },
  ] };
  const cj = judge(cPapers, cGood, cshown, null, "constants");
  check("constants judge: 1 better / 1 mentions-only / 1 unrelated, exit 1", cj.code === 1 && cj.tally["claims-a-better-bound"] === 1 && cj.tally["mentions-only"] === 1 && cj.tally.unrelated === 1 && cj.unjudged === 1);
  check("constants judge: the positive control (credited paper, best value) is mentions-only, one EQUAL claim, exit 0", (() => { const r = judge({ total: 1, papers: [cPapers.papers[0]] }, { papers: [cGood.papers[0]] }, cshown, null, "constants"); return r.code === 0 && r.tally["mentions-only"] === 1 && r.equals === 1 && r.candidates === 0; })());
  check("constants judge: a claim only on an unrankable side exits 1 (to read by hand), never 0", (() => { const r = judge({ total: 1, papers: [cPapers.papers[1]] }, { papers: [{ ...cGood.papers[1], claims: [cGood.papers[1].claims[1]] }] }, cshown, null, "constants"); return r.code === 1 && r.candidates === 0 && r.unjudged === 1; })());
  check("constants judge: the no-bound fixture is classed unrelated", (() => { const r = judge({ total: 1, papers: [cPapers.papers[2]] }, { papers: [cGood.papers[2]] }, cshown, null, "constants"); return r.code === 0 && r.tally.unrelated === 1; })());
  const cEdit = (i, patch) => ({ papers: cGood.papers.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  const cRefusals = [
    ["a constant id the mirror does not carry", cEdit(0, { claims: [{ constant: "99z", side: "upper", value: "1.5", quote: "1.5" }] }), "a constant id this mirror carries"],
    ["a value written as a number, not a string", cEdit(0, { claims: [{ constant: "fx", side: "upper", value: 1.5, quote: "1.5" }] }), "a constant id this mirror carries"],
    ["a value that is not a decimal", cEdit(0, { claims: [{ constant: "fx", side: "upper", value: "3/2", quote: "3/2" }] }), "a constant id this mirror carries"],
    ["a quote holding the value only as a prefix of a longer number", cEdit(0, { claims: [{ constant: "fx", side: "upper", value: "1.5028", quote: "we get 1.50286" }] }), "does not contain the claimed value"],
    ["a quote holding the value only as a suffix of a longer number", cEdit(0, { claims: [{ constant: "fx", side: "upper", value: "1.5028", quote: "we get 11.5028" }] }), "does not contain the claimed value"],
    ["a quote holding the value only after a decimal point", cEdit(0, { claims: [{ constant: "fx", side: "upper", value: "5028", quote: "we get 1.5028" }] }), "does not contain the claimed value"],
  ];
  for (const [label, vd, reason] of cRefusals) {
    const r = judge(cPapers, vd, cshown, null, "constants");
    check(`constants judge REFUSES ${label}`, r.code === 3 && r.lines[0].includes(reason));
  }
  const cExpect = { query: CONSTANTS_QUERY, revision: "a".repeat(40), from: "2026-09-26" };
  const cWindow = { ...cPapers, fetchedAt: "2026-10-16T15:40:00.000Z", query: CONSTANTS_QUERY, revision: cExpect.revision, window: { from: "2026-09-26", to: "2026-10-16" } };
  check("constants judge accepts a window run with this watcher's query, mirror and window", judge(cWindow, cGood, cshown, cExpect, "constants").code === 1);
  const cWindowRefusals = [
    ["a Ramsey query", { query: QUERY }, "different query"],
    ["a different mirror sha", { revision: "b".repeat(40) }, "a different mirror than the ledger holds"],
    ["a window that starts before the mirror's fetch date", { window: { from: "2026-04-24", to: "2026-10-16" } }, "the mirror's fetch date"],
  ];
  for (const [label, patch, reason] of cWindowRefusals) {
    const r = judge({ ...cWindow, ...patch }, cGood, cshown, cExpect, "constants");
    check(`constants judge REFUSES a window run with ${label}`, r.code === 3 && r.lines[0].includes(reason));
  }
  check("a Ramsey window run is REFUSED by the constants judge, and a constants one by the Ramsey judge", judge(windowDoc, good, cshown, cExpect, "constants").code === 3 && judge(cWindow, cGood, shown, expect, "ramsey").code === 3);
  const cEmitted = [
    ...cRefusals.map(([, vd]) => judge(cPapers, vd, cshown, null, "constants")),
    ...cWindowRefusals.map(([, patch]) => judge({ ...cWindow, ...patch }, cGood, cshown, cExpect, "constants")),
    judge(cWindow, cGood, cshown, cExpect, "constants"), judge(cPapers, cGood, cshown, null, "constants"),
    judge(cPapers, cEdit(0, { claims: [{ constant: HOSTILE, side: "upper", value: "1.5", quote: "1.5" }] }), cshown, null, "constants"),
  ].flatMap((r) => r.lines);
  const cUnshaped = cEmitted.filter((line) => !isShapedLine(line));
  check(`constants: every one of ${cEmitted.length} emitted line(s) matches an exact OUTPUT_SHAPES entry (${cUnshaped.length} do not)`, cEmitted.length > 10 && cUnshaped.length === 0);
  const cExact = judge(cWindow, cGood, cshown, cExpect, "constants").lines;
  const cExpected = [
    "coverage: this watcher's constants query · submitted 2026-09-26 to 2026-10-16 (UTC dates), from the mirror's fetch date",
    "papers fetched: 3 · verdicts: 3 · every fetched id has exactly one verdict",
    "  claims-a-better-bound: 1",
    "  mentions-only: 1",
    "  unrelated: 1",
    "parts reconcile: 1 + 1 + 1 = 3",
    "candidate bound(s) beating or contradicting a value we show: 1 (details stay in verdicts.json, never printed)",
    "stated bounds EQUAL to a value we show: 1 · WEAKER than it: 0",
    "stated bounds on sides this script cannot rank (an unverified or symbolic row): 1 (to read by hand)",
    "stated bounds within the printed precision of a value we show: 0 (to read by hand)",
  ];
  check("constants: a known window fixture prints exactly the expected lines, values included", JSON.stringify(cExact) === JSON.stringify(cExpected));

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
