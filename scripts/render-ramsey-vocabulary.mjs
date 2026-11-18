// render-ramsey-vocabulary.mjs — the words and shapes ramsey.html is written in, shared by the
// renderer (render-ramsey.mjs) and the page guards (render-ramsey-guards.mjs) so that each guard reads
// back exactly what the renderer emits. Moved out of render-ramsey.mjs unchanged on 2026-11-13; it
// imports nothing from either of those two files, so there is no import cycle.
import { sameBound } from "./ds1-depth.mjs";
import { REPO, esc } from "./lib/html.mjs";

// The day ramsey.html first served the table publicly (commit 0ad3615). The disclosure is a DATED
// ACCOUNT OF A PUBLISHED PAGE, not a clearance obtained beforehand: the scope doc said the pass
// would ask the copyright question "before anything is published" and that is simply not what
// happened, so the page says when it went up and this constant is that date.
export const PUBLISHED_ON = "2026-09-17";

// The depth audit's four outcomes, in its own vocabulary (continuity/depth-audit.json meta.verdicts).
// The selftest asserts this list equals that file's, so the page cannot quietly invent a fifth or
// merge two. "not yet read" is not an outcome: it is the absence of a reading, and it is shown as one.
// Neither is "nothing to read it against", which is a bound the survey credits to no paper.
//
// A READ STATE BELONGS TO ONE CREDITED BOUND, NOT TO AN ENTRY (A-54 phase 4, scripts/ds1-depth.mjs).
// R(3, 10)'s lower bound is credited to [Ex5] and its upper bound to [Ang1]; reading one says nothing
// about the other, so each entry lists its bounds and each bound carries its own state.
// Each phrase is a WHOLE clause about the reading, not a tail glued after "the credited source
// was". Two rewrites on 2026-09-18, both found by rendering the real readings rather than the
// fixtures: "could not be read" produced "the credited source was could not be read", and for a
// bound whose credited paper was never opened while its method was read elsewhere, the old
// unresolved wording claimed a reading of the source that did not happen.
export const OUTCOMES = [
  ["SOUND", "sound", "the credited source was read, and it supports this bound"],
  ["DEFECTIVE", "defective", "the credited source was read, and it does not support this bound"],
  ["UNRESOLVED", "unresolved", "what could be read did not settle this bound"],
  ["UNREACHABLE", "unreachable", "the credited source could not be read at all"],
];

// How many NUMBERS a set of table rows prints. An entry is not a number: 52 of Table Ia's 72
// entries print a lower AND an upper bound, so "72 values" understates what is reproduced by 52
// (adversarial review, 2026-09-20 — on the page whose whole job is to state that amount exactly).
// The disclosure states both units and its guard recomputes them from the committed table.
export const numbersIn = (rows) => rows.reduce((a, r) => a + ["exact", "lower", "upper"].filter((k) => r[k] !== undefined).length, 0);

// The handbook look (design rollout, 2026-11-18 MT; A-110's SCREENS.md NEXT rows for ramsey.html and
// copying.html, which both render with this one stylesheet): docs/DESIGN.md's cool tinted neutrals,
// the book serif for the headline and the entry names from faces already on the device (no font file),
// ink-and-underline links, sentence-case field labels (the <dt> strings are already written that way;
// only the uppercase transform is dropped), a double rule over each group as under a printed table
// head, hairlines between entries, and the one 2px radius. Styling only: no markup or sentence changes.
// The light values are the index's handbook values; like before, these pages set no dark scheme.
export const STYLE = `:root{--ink:#14181f;--muted:#566072;--line:#dde2ea;--code:#f2f5fa;--paper:#fbfcfe;--display:"Palatino Linotype",Palatino,"Iowan Old Style","Book Antiqua",Georgia,serif}
*{box-sizing:border-box}body{margin:0;padding:1.5rem 1.25rem 3rem;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:var(--ink);background:var(--paper);max-width:52rem;margin-inline:auto}
a{color:var(--ink);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.15em}
h1{font-family:var(--display);font-weight:700;letter-spacing:-.01em;font-size:1.625rem;line-height:1.3;margin:.25rem 0 .5rem}
h2{font-family:var(--display);font-size:1.25rem;font-weight:700;margin:0}h2 a{color:inherit;text-decoration:none}h2 a:hover,h2 a:focus{text-decoration:underline}
.back{font-size:.875rem;display:inline-block;margin-bottom:1.5rem}
.lede{margin:.25rem 0 1rem}
.note{background:var(--code);border:0;border-left:1px solid var(--ink);border-radius:0;padding:.25rem 1rem;margin:1rem 0;font-size:.875rem}
code{font:.875rem ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--code);border-radius:2px;padding:0 .25rem;word-break:break-all}
.jump{margin:1.5rem 0;font-size:.875rem}.jump div{margin:.25rem 0}.jump .k{display:inline-block;min-width:3.5rem;color:var(--muted)}
.jump a{display:inline-block;min-width:2rem;padding:.25rem;text-align:center}
.group{margin-top:2rem;padding-top:.5rem;border-top:3px double var(--ink);font-size:.875rem;color:var(--muted)}
.entry{border-bottom:1px solid var(--line);padding:1rem 0}
dl{margin:.5rem 0 0;padding:0}dt{font-weight:600;font-size:.875rem;color:var(--ink);margin-top:.5rem}
dd{margin:.125rem 0 0}.v{font-family:var(--display);font-size:1.125rem}.refs{display:block;font-size:.875rem;color:var(--muted)}
.none{color:var(--muted)}.flag{display:inline-block;margin-top:.5rem;font-size:.875rem}
footer{margin-top:2rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.875rem}`;

export const key = (k, l) => `${k},${l}`;

// Every (k, l) either table prints, in k-then-l order.
export function entriesOf(doc) {
  const map = new Map();
  for (const c of doc.tableIa) map.set(key(c.k, c.l), { k: c.k, l: c.l, ia: c });
  for (const c of doc.tableIb) {
    const e = map.get(key(c.k, c.l)) ?? { k: c.k, l: c.l };
    e.ib = c;
    map.set(key(c.k, c.l), e);
  }
  return [...map.values()].sort((a, b) => a.k - b.k || a.l - b.l);
}

export const R = (k, l) => `R(${k}, ${l})`;

export const STORE_URL = `${REPO}/blob/main/continuity/depth-audit-ds1.json`;

// THE REBUILD (A-54, David's rulings of 2026-09-20): the page is our own arrangement, the survey
// stays credited, and every value is marked one of two ways — independently sourced, or credited
// to the survey and not independently checked. The census (A-54 rebuildScope2026_09_21) read every
// bound Table Ia credits to a paper, so census readings render here. The freeze filter that held
// them off the page (`pageRows`, 2026-09-25 to the rebuild) was removed in the commit that lands it.
//
// ONE READING IS SHOWN PER BOUND. Five bounds were read twice, once in the drawn slice of 2026-09-18
// and once in the census; the census reading is the one shown, and the readings of one bound must
// carry the same verdict or the store is refused (readingConflicts), because showing either would
// hide the other's disagreement.
export function shownReading(rows, b) {
  const all = rows.filter((r) => sameBound(r, b));
  return all.find((r) => r.selection === "census") ?? all[0];
}
export function readingConflicts(rows) {
  const by = new Map();
  for (const r of rows) {
    const k = `${r.k},${r.l},${r.bound},${r.value},${r.ref}`;
    if (!by.has(k)) by.set(k, []);
    by.get(k).push(r);
  }
  return [...by.values()].filter((rs) => new Set(rs.map((r) => r.verdict)).size > 1)
    .map((rs) => `${R(rs[0].k, rs[0].l)} ${rs[0].bound} ${rs[0].value} [${rs[0].ref}] is read ${rs.map((r) => `${r.verdict} by ${r.id ?? "an unnamed row"}`).join(" and ")}`);
}

// David's two states (davidRuling2026_09_20_partialTable), close to his words. SOUND is the only
// verdict that sources a value independently; DEFECTIVE is neither, because either label would
// misstate a value its credited source contradicts (rebuildScope2026_09_21, DECISION 3).
export const SOURCED = "independently sourced";
export const SURVEY_ONLY = "credited to the survey and not independently checked";
export const stateOf = (verdict) => (verdict === "SOUND" ? SOURCED : verdict === "DEFECTIVE" ? null : SURVEY_ONLY);

// Table Ib's marking, decided at the render (A-54 OPEN question, 2026-10-15). The census read Table
// Ia only, so no Table Ib value was read against a source, and every one is marked credited to the
// survey. The reason is said per value from the survey's own caption (revision #18, p. 7): "All of
// them were obtained by Angeltveit and McKay in 2019 [AnM2] and 2023-2024 [AnM3, AnM4], except
// R (4, 5) [MR4]" — a group credit for every value but one, which is why the frame left Table Ib out.
// The one value the caption credits to a single paper can still be sourced: when Table Ia prints the
// SAME upper bound credited to the SAME paper and its census reading is SOUND, that reading sources
// this value too (Codex claims pass r1b, 2026-10-15: R(4, 5) <= 25 [MR4] is DS1-0033, SOUND). Derived
// from the stored reading every render, never typed.
const IB_OWN_CREDIT = { "4,5": "MR4" };
export const ibNote = (e, rows = []) => {
  const own = IB_OWN_CREDIT[key(e.k, e.l)];
  if (!own) return `${SURVEY_ONLY}: the census read Table Ia only; the survey credits Table Ib's values as a group to [AnM2], [AnM3] and [AnM4], not each to one paper`;
  const twin = shownReading(rows, { k: e.k, l: e.l, bound: "upper", value: e.ib.upper, ref: own });
  // DEFECTIVE takes NEITHER state (DECISION 3), here as in Table Ia (Codex r2, 2026-10-15).
  if (twin?.verdict === "DEFECTIVE") return `marked neither way: the same bound, credited to [${own}] in Table Ia, was read there and its source does not support it (see the reading below)`;
  return twin?.verdict === "SOUND"
    ? `${SOURCED}: the survey credits this value to [${own}], and the same bound, credited to [${own}] in Table Ia, was found there (see the reading below)`
    : `${SURVEY_ONLY}: the census read Table Ia only; the survey credits this Table Ib value to [${own}]`;
};

export const keepsSurveyEntry = (r) => Boolean(String(r.surveyRefEntry ?? "").trim() || String(r.surveyEntryQuoted ?? "").trim());

// The ONE piece of markup a read state carries. Named here because the renderer writes it and leg 7b
// strips exactly this and then requires everything left to be plain text.
export const HOW_LINK = `<a href="${esc(STORE_URL)}">How it was read</a>`;
export const NOT_YET = "not yet read";
export const NOTHING = "nothing to read it against";
const BOUND_ORDER = { exact: 0, lower: 1, upper: 2 };

// Every value Table Ia prints for an entry, each with what it is credited to, in a fixed order.
export function boundsFor(e, frame, left) {
  const mine = (b) => b.k === e.k && b.l === e.l;
  return [...frame.filter(mine).map((b) => ({ ...b, inFrame: true })), ...left.filter(mine).map((b) => ({ ...b, inFrame: false }))]
    .sort((a, b) => BOUND_ORDER[a.bound] - BOUND_ORDER[b.bound]);
}

export const BRIEF_URL = `${REPO}/blob/main/docs/arxiv-watch-reader-brief.md`;

export function searchHtml(s) {
  return `<p id="arxiv-search"><strong>Newer papers on arXiv.</strong> We searched arXiv for papers listed under combinatorics (math.CO) with &ldquo;Ramsey&rdquo; in the abstract and submitted on or after ${esc(longDate(s.windowFrom))}, the date of revision #${esc(s.revision)}, as arXiv listed them on ${esc(longDate(s.listedOn))}: ${esc(s.papersFound)} papers, the newest submitted on ${esc(longDate(s.newestSubmitted))}. Language-model readers screened each one for an explicit value or bound on a two-colour classical R(k, l), with instructions to read the full text where the title or abstract suggested one, and a script compared what they recorded with the values on this page. As screened, none of the ${esc(s.papersFound)} states a bound that improves on, or contradicts, what this page shows for the same R(k, l). The screen can misread a paper, and the search cannot see a paper outside that listing, one whose abstract does not say &ldquo;Ramsey&rdquo;, or a result announced anywhere but arXiv, so a newer result could exist without appearing here. <a href="${esc(BRIEF_URL)}">How the papers were screened</a>.</p>`;
}

export function longDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}
