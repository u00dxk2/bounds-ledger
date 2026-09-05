#!/usr/bin/env node
// Generates index.html — the public spot-check page. David approved building and hosting it on
// 2026-08-20 ("Yes - build the page"), answering the F-2 flow for ANY tracked constant rather
// than the twelve the README names by hand.
//
// It is the most trusted-print surface this lane has produced: a mathematician reads a number off
// it and believes it. Two consequences are wired in rather than left to discipline.
//
//   1. It states, on the page, that it is a snapshot at a pinned sha and NOT a live read, with
//      the date the MIRROR was fetched (not the render date) and a link to the primary source
//      for every single row. A reader
//      who wants live truth is told exactly where to get it.
//   2. It never says which row is "the record". Generated pins assert LISTING POSITION; numeric
//      ranking is defeated by symbolic cells, negatives and O(-) asymptotics. A public page is
//      where that temptation is strongest and where being wrong costs the most.
//
// No dependencies, no external assets, no fonts, no scripts fetched at runtime — the page is one
// self-contained file. The repo has zero dependencies and this does not change that.
//
// ponytail: static HTML + a client-side filter over an inlined table. No build step, no
// framework, no search index. 111 constants is small enough that the browser filters it
// instantly; revisit only if the mirror grows by an order of magnitude.

import { readFileSync, writeFileSync, existsSync, mkdtempSync, mkdirSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pinsFor, lastChanged, changeFor, changeKind, boundCell } from "./lookup.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "index.html");

export function titleFrom(statement) {
  return String(statement || "")
    .replace(/^Last-listed \w+-bound table row for /, "")
    .replace(/\s*\([^()]*\.md\)\s*$/, "")
    .trim();
}

export function constantIds(claims) {
  return [...new Set(
    claims.filter((c) => typeof c.id === "string" && c.id.startsWith("pin:"))
      .map((c) => c.id.split(":")[1])
  )].sort((a, b) => {
    const na = parseInt(a, 10), nb = parseInt(b, 10);
    return na === nb ? a.localeCompare(b) : na - nb;
  });
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const REPO = "https://github.com/u00dxk2/bounds-ledger";

// The row's two document links are for a HUMAN to read, and until 2026-08-31 neither of them
// rendered. `claims.json` holds the CHECKER's fetch URL — raw.githubusercontent, `text/plain` — and
// the page handed that same URL to the reader; our own mirror copy was served off Pages as
// `text/markdown`, which browsers also do not render. Measured in a real browser: the bound tables
// arrived as one run-on line of pipe characters and LaTeX source. That defeats the page's own
// promise, "every row links to its primary source so you can check us in one hop" — you cannot
// compare a row against a wall of text. `readable()` maps a raw URL to GitHub's blob view, which
// renders the table, and leaves anything else untouched. It is display-only: the pin's `url` is
// still what the checker fetches, and must stay raw.
// CEILING, named rather than fixed: upstream publishes its OWN typeset pages at
// teorth.github.io/optimizationproblems/constants/<id>.html (verified 111 of 111, with a fabricated
// id 404ing as the negative control), and those are nicer than a blob view. Linking there would
// need the self-contained-page assertion below to separate an ASSET fetch from a NAVIGATION link,
// which is a guard change and does not belong inside a product ship.
export const readable = (u) =>
  typeof u === "string"
    ? u.replace(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/(.+)$/, "https://github.com/$1/$2/blob/$3")
    : u;

// A visitor who doubts a row can tell us from THAT row, and the report arrives already naming the
// constant and the mirror sha. Nielsen heuristic 6, recognition rather than recall: the page knows
// which row they were looking at, so it must not make them reconstruct and retype it. Before this,
// the only reporting path was one link in the intro box — above the table, and therefore hundreds
// of rows behind a reader who is deep in it.
//
// ENCODING ORDER IS LOAD-BEARING and is what the selftest pins: encodeURIComponent FIRST (so any
// markup, quote or ampersand in a title becomes %XX and can never break out of the attribute),
// then esc() for the HTML attribute itself, which only has the '&' query separators left to fix.
// Reversing the two would percent-encode the entity text and emit a URL carrying "&amp;amp;".
// Deliberately does NOT interpolate the pinned row values: they can be long LaTeX and would push
// the URL toward GitHub's length ceiling for no gain, since the constant id already identifies them.
export function flagUrl(r, sha) {
  const title = `Row looks wrong: ${r.title} (${r.id})`;
  const body = [
    `Constant: ${r.title} (${r.id})`,
    `Ledger mirror: upstream ${String(sha).slice(0, 7)}`,
    "",
    "What the source says:",
    "",
    "Where you saw it (link or citation):",
  ].join("\n");
  return `${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

const SITE = "https://u00dxk2.github.io/bounds-ledger/";

// The page is TITLED "Is the number you cited still current?" and, until this shipped, gave the
// reader nothing to cite with. The visitor this lane is built for is someone who QUOTES a record —
// that is the core problem in their own words — so the one action the page never supported was the
// one they came to perform. Five rotations of F-2 all improved READING a row.
//
// WHY THE CAVEAT IS INSIDE THE CITATION AND NOT JUST ON THE PAGE, which is the whole design:
// a citation is the only artifact here that LEAVES the page. Every honesty the page provides in
// context — that these are last-listed table rows and not a claim about the record, that this is a
// snapshot at a pinned sha and not a live read — is stripped the instant the text is pasted
// somewhere else. So the caveat travels in the text or it does not travel at all, and a ledger
// whose product is other people's mis-citations must not become a source of them.
//
// PLAIN TEXT, escaped only at embed time — the same encode-then-escape order flagUrl pins, for the
// same reason: a constant title carrying & or < must reach the reader's clipboard as itself.
//
// THE ADDRESS IT HANDS OUT IS THE CONSTANT'S OWN PAGE, not the table anchor (A-40, 2026-09-03).
// It ended at `<SITE>#c-<id>` from 2026-08-29 until then because that was the only citable URL in
// existence; `c/<id>.html` shipped 2026-09-02 and each of those pages declares ITSELF canonical.
// So for two days this site handed a reader one address and told search engines a different one was
// authoritative — a ledger whose product is citation accuracy publishing two names for one object.
// The anchor is also the weaker of the two on its own merits: it drops whoever follows it into the
// middle of a long table with no context for the row under their cursor, and it is a position in a
// document rather than a document about the constant. (No row count is written here on purpose —
// `--check` prints the live figure and the mirror grows whenever upstream adds a constant.)
// WHAT DID NOT CHANGE, and must not: the row PERMALINK (`<a class="id" href="#c-<id>">`) still
// targets the in-page anchor, which is what a reader wants when pointing a colleague at a row of the
// table they are already reading. Two addresses for two different jobs is fine; two addresses for
// the same job is the defect.
export function citation(r, sha) {
  const side = (label, row, changed, kind) => {
    if (!row) return `${label} bound: not pinned`;
    const when = changed ? ` (${whenLabel(changed, kind)})` : "";
    return `${label} bound: ${boundCell(row).trim()}${when}`;
  };
  return [
    `Bounds Ledger — ${r.title} (${r.id})`,
    side("upper", r.upper, r.upperChanged, r.upperKind),
    side("lower", r.lower, r.lowerChanged, r.lowerKind),
    `Mirrored from teorth/optimizationproblems@${String(sha).slice(0, 7)}. These are the last-listed rows of that constant's bounds table — a listing position, not a statement that this bound is the strongest or most recent. A snapshot at that sha, not a live read.`,
    `${SITE}c/${r.id}.html`,
  ].join("\n");
}

/**
 * The report WE filed upstream against this constant's file, or null.
 *
 * DISCLOSURE, NOT ATTRIBUTION. This renders "we reported this row" and links the issue. It must
 * never render a claim that our report caused anything — A-33 note3: "the output is 'go look',
 * never a verdict, because deciding that a change was CAUSED by our report is a judgment." The
 * selftest pins that by asserting the emitted markup carries no causal wording.
 *
 * Why a reader is owed it: the page's whole promise is check us in one hop. A row we have
 * ourselves reported against is the one row where our own involvement is part of what a reader
 * needs in order to judge it, and until today the page was silent about that.
 */
export function reportFor(id, reports) {
  if (!Array.isArray(reports)) return null;
  return reports.find((r) => r && r.path === `constants/${id}.md`) || null;
}

/**
 * The reader-facing label for a filed report. Deliberately flat: what we did, and where it
 * stands. No verb here may imply that upstream acted BECAUSE of us — "closed" is the issue's
 * own state, reported as such.
 */
export function reportLabel(report) {
  const state = String(report.state || "").toUpperCase();
  const when = state === "CLOSED" && report.closedAt ? ` ${String(report.closedAt).slice(0, 10)}` : "";
  return `we reported this row · ${state === "CLOSED" ? `closed${when}` : "open"}`;
}

/** Load the filed-report record. Absent file means no disclosures, never a crash. */
export function loadReports(root = ROOT) {
  const p = join(root, "ledger", "upstream-reports.json");
  if (!existsSync(p)) return [];
  const parsed = JSON.parse(readFileSync(p, "utf8"));
  return Array.isArray(parsed.reports) ? parsed.reports : [];
}

export function buildRows(claims, { withDates = true, root = ROOT, reports = null } = {}) {
  const filed = reports ?? loadReports(root);
  return constantIds(claims).map((id) => {
    const pins = pinsFor(id, claims);
    const upper = pins.find((p) => p.id.endsWith(":U"));
    const lower = pins.find((p) => p.id.endsWith(":L"));
    const any = upper || lower;
    const none = { date: null, kind: null };
    const uc = withDates && upper ? changeFor(upper, root) : none;
    const lc = withDates && lower ? changeFor(lower, root) : none;
    return {
      id,
      title: titleFrom(any && any.statement),
      url: any && any.url,
      upper: upper && upper.expect,
      lower: lower && lower.expect,
      upperChanged: uc.date,
      lowerChanged: lc.date,
      upperKind: uc.kind,
      lowerKind: lc.kind,
      upperPrev: uc.prevExpect || null,
      lowerPrev: lc.prevExpect || null,
      report: reportFor(id, filed),
      tableValues: tableValuesFor(id, root),
      aliases: aliasesFor(id, claims),
    };
  }).map((r) => ({ ...r, changed: newerOf(r.upperChanged, r.lowerChanged) }));
}

// A row's date is the later of its two sides: a constant whose upper bound moved last week has
// moved, whatever its lower-bound row says. ISO dates compare correctly as strings, so no Date
// parsing is needed — and none is wanted, since `new Date("2026-07-24")` would drag timezone
// interpretation into a value that is already a plain calendar day.
export function newerOf(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  return a >= b ? a : b;
}

// The words a reader actually sees, and the reason this function exists at all. "last changed" was
// true and misleading: on 2026-08-24 two rows carried that day's date because upstream escaped a
// backslash, and a reader sorting by most-recently-updated met two records that had not moved.
// "value changed" and "text edited" are the same fact split along the only line this lane cares
// about. `kind === null` keeps the old neutral wording, which is the honest answer when the pin is
// new and there is nothing to compare it against.
export function whenLabel(changed, kind) {
  if (kind === "value") return `value changed ${esc(changed)}`;
  if (kind === "text") return `text edited ${esc(changed)} — bound unchanged`;
  if (kind === "first") return `first pinned ${esc(changed)} — unchanged since`;
  return `last changed ${esc(changed)}`;
}

// `label` is rendered as a data-label attribute and surfaced by CSS ::before ONLY below the
// card-stacking breakpoint, where <thead> is hidden. Without it a phone reader meets two code
// blocks with no way to tell the upper bound from the lower one — the column header is the only
// thing that distinguishes them, and stacking is what takes it away.
// THE PREVIOUS PINNED ROW IS DELIBERATELY NOT DISPLAYED, and this is the load-bearing decision on
// this page. It was displayed for one commit (3145ed9) as "our pinned row read X until then" and
// an adversarial review refuted it before the push, on a live case:
//
//   Brun's constant. Upstream APPENDED a row conditional on the Generalised Riemann Hypothesis
//   ($2.1594$, [D2025]) BELOW the unconditional $2.288513$ ([PT2018]). Both are still in the
//   table — 81a.md:13-14 — and upstream says in terms that they are not comparable. Our pin
//   tracks the LAST-LISTED row, so the pin changed while nothing was superseded. The page then
//   showed a reader who had cited $2.288513$ that it "read 2.288513 until then", which reads as
//   an improvement to a conditional bound nobody has proved unconditionally.
//
// The wording was not the defect and no rewording fixes it: a current value, a "value changed"
// date and a previous value form a from-to pair, and a from-to pair IS a movement claim whatever
// noun sits in the sentence. `prevExpect` is a LISTING POSITION we used to pin, never a
// superseded record, and the two coincide only sometimes — 8 of 8 live cases on 2026-09-01 were
// appends or restructures, not replacements. Commit 8a4192a refused this exact inference on this
// exact row; displaying it here would have published what that commit declined to.
//
// It stays in the SEARCH HAYSTACK (see findKey), because matching asserts nothing. A visitor who
// pastes $2.288513$ still lands on the row and reads the live table for themselves.
function cell(row, changed, kind, label) {
  if (!row) return `<td class="none" data-label="${esc(label)}">not pinned</td>`;
  // Second half of review finding F1. Omitting the element when the date is null made "we could
  // not compute a date" indistinguishable from "this page does not date rows" — the zero-versus-
  // absent confusion this repo exists to police, on the page's own headline promise. Say it
  // explicitly instead. With the escaped-needle fix all 222 pins now date, so this path should be
  // unreachable in practice; it stays because the day it becomes reachable is the day it matters.
  const when = changed
    ? `<span class="when ${kind === "text" ? "text-only" : ""}">${whenLabel(changed, kind)}</span>`
    : `<span class="when">date unknown</span>`;
  return `<td data-label="${esc(label)}"><code>${esc(row)}</code>${when}</td>`;
}

// Every value cell in the constant's mirrored bound tables — not only the two rows we pin.
//
// WHY THIS EXISTS, measured 2026-09-04: the pinned pair plus prevExpect covers values that moved
// WHILE WE WATCHED. It does not cover a value already superseded in upstream's table when we first
// pinned it, and that is most of them. Two live misses, both of them the exact reader this page is
// for: "0.380876" — the Erdős minimum overlap value erdosproblems.com has shown since January,
// which C-7 pins as three records stale — returned ZERO matches, although it sits in 1b.md line 24,
// two rows above the row we pin. "246" for the bounded prime gap returned zero the same way:
// upstream ADDED 88a.md on 2026-09-02 with 240 already listed, so 246 was never a pin of ours.
// Same blind spot as npm run catches on an ADDED constant — every instrument keyed to our pin
// history is blind to a constant's past when we arrived after it.
//
// This asserts NOTHING. It is the search haystack, and the note above cell() already settles why
// that differs in kind from displaying a from-to pair: matching a string is not a claim that one
// number superseded another. Nothing here is pinned, dated, or displayed as a value — a visitor
// who pastes an old number lands on the row and reads the live table for themselves.
export function tableValuesFor(id, root = ROOT) {
  const f = join(root, "ledger", "teorth-optimizationproblems", "constants", `${id}.md`);
  let text;
  try { text = readFileSync(f, "utf8"); } catch { return []; }
  const out = new Set();
  for (const line of text.split(/\r?\n/)) {
    if (!line.trimStart().startsWith("|")) continue;
    const cell = boundCell(line).trim();
    // Separator rows (---), header rows and empty cells carry no digit and are dropped. A header
    // that happens to contain one is harmless: it can only make a row findable, never assert.
    if (!cell || !/\d/.test(cell)) continue;
    out.add(cell.toLowerCase());
  }
  return [...out];
}

// Hand-curated search aliases for a constant: values a reader may arrive HOLDING that no longer
// appear anywhere the haystack above can reach. The tableValues haystack reads the CURRENT mirrored
// table and upperPrev/lowerPrev come from GENERATED pin history, so a value that lived only in a
// hand claim's superseded `expect` disappears from the page the instant upstream rewrites the cell.
// That happened on 2026-09-05: upstream changed 1b's Haugland row from 0.380927 to 0.380926 and the
// older figure — still cited nine times in arXiv:2601.16175 — became unsearchable here the same day.
//
// Like tableValues, this ASSERTS NOTHING. It is not displayed, not pinned and not dated; it is a
// string the filter matches so a reader holding an old number lands on the row and reads the live
// table for themselves. Deliberately HAND-curated rather than derived from git history: deriving it
// would mean shelling `git log -S` per value per render, and the population worth carrying is a
// judgement about which numbers a reader plausibly holds, not every byte a cell has ever contained.
export function aliasesFor(id, claims) {
  const all = Array.isArray(claims) ? claims : claims.claims || [];
  const out = new Set();
  for (const c of all) {
    if (!c || !Array.isArray(c.searchAliases)) continue;
    if (!(c.url || "").includes(`constants/${id}.md`)) continue;
    for (const a of c.searchAliases) if (typeof a === "string" && a.trim()) out.add(a.trim().toLowerCase());
  }
  return [...out];
}

// The haystack the filter searches. It carries the constant's name and id AND the bound cells,
// current and superseded — because the page's own headline asks "is the number you cited still
// current?" and until today it could not be searched by a number at all. A reader holding a stale
// value is the reader most likely to have a problem worth telling us about, and they were the one
// reader the search could not serve. Substring matching means a truncated citation finds the full
// pinned value: "6.5143" hits "6.514326913930565372".
export function findKey(r) {
  const cells = [r.upper, r.lower, r.upperPrev, r.lowerPrev]
    .filter(Boolean)
    .map((s) => boundCell(s).trim());
  return [r.title, r.id, ...cells, ...(r.tableValues || []), ...(r.aliases || [])]
    .filter(Boolean).join(" ").toLowerCase();
}

// manualCount is DERIVED and passed in, never hard-coded — review finding F5. The footer used to
// say "Two claims", a roster count baked into a generated page, which drifts silently the day a
// third manual claim joins. Same class as the README state block this repo already generates
// rather than types. Defaults to null so an omitted count prints a countless sentence instead of
// a wrong number.
export function renderHtml(rows, manifest, generatedOn, manualCount = null) {
  const manualPhrase = manualCount === null
    ? "Some claims cite"
    : manualCount === 1
      ? "One claim cites"
      : `${manualCount} claims cite`;
  // NOTE on the CSS below, review finding F4: thead th deliberately carries NO position:sticky.
  // It was there and was inert — sticky binds to the nearest SCROLLING ancestor, which is the
  // .scroll overflow-x wrapper, so at scrollY 2000 the header sat 1450px above the viewport.
  // Removed rather than repaired by giving .scroll a max-height, because that trades a header
  // nobody sees for a vertical scroll region on mobile, and the render check that would settle
  // which is better is one I cannot run here. Dead CSS promising behaviour the page lacks is worse
  // than no promise. This note lives in the SOURCE, not in a CSS comment: the first version of it
  // sat inside the style template literal and shipped the whole explanation to every visitor.
  const sha = String(manifest.sha);
  const body = rows.map((r) => `<tr id="c-${esc(r.id)}" data-find="${esc(findKey(r))}" data-changed="${esc(r.changed || "")}">
<th scope="row"><a href="${esc(REPO)}/blob/main/ledger/teorth-optimizationproblems/constants/${esc(r.id)}.md">${esc(r.title)}</a><a class="id" href="#c-${esc(r.id)}" aria-label="Permalink to ${esc(r.title)}">${esc(r.id)}</a>${r.report ? `<a class="ours" href="${esc(r.report.url)}" aria-label="The report we filed upstream about ${esc(r.title)}">${esc(reportLabel(r.report))}</a>` : ""}</th>
${cell(r.upper, r.upperChanged, r.upperKind, "Upper-bound row (last listed)")}
${cell(r.lower, r.lowerChanged, r.lowerKind, "Lower-bound row (last listed)")}
<td class="src"><a href="${esc(readable(r.url))}">source</a> · <a href="c/${esc(r.id)}.html" aria-label="The page for ${esc(r.title)}">page</a> · <a href="${esc(flagUrl(r, sha))}" aria-label="Report a problem with ${esc(r.title)}">looks wrong?</a> · <details class="cite"><summary aria-label="How to cite ${esc(r.title)}">cite</summary><code>${esc(citation(r, sha))}</code></details></td>
</tr>`).join("\n");

  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ctext y='13' font-size='13'%3E%E2%88%91%3C/text%3E%3C/svg%3E">
<title>Bounds Ledger — is the number you cited still current?</title>
<meta name="description" content="A continuously re-verified ledger of mathematical records. Look up a constant and see the bounds rows we watch, when each last changed and whether the bound moved, and the primary source.">
<style>
:root{--bg:#fff;--fg:#16181d;--muted:#5c6370;--line:#e3e6ea;--accent:#0b5fff;--code:#f6f7f9}
@media(prefers-color-scheme:dark){:root{--bg:#14161a;--fg:#e8eaed;--muted:#9aa1ac;--line:#2b2f36;--accent:#7aa2ff;--code:#1c1f25}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:2.5rem 1.25rem 5rem}
h1{font-size:1.7rem;line-height:1.25;margin:0 0 .4rem}
.lede{color:var(--muted);margin:0 0 1.5rem;max-width:62ch}
a{color:var(--accent)}
.note{border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:6px;padding:.85rem 1rem;margin:0 0 1.5rem;font-size:.92rem;max-width:78ch}
.note p{margin:.35rem 0}
label{display:block;font-size:.85rem;color:var(--muted);margin:0 0 .35rem}
input,select{width:100%;padding:.6rem .7rem;font-size:1rem;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg)}
.controls{display:flex;flex-wrap:wrap;gap:.9rem 1.5rem;align-items:flex-end}
.ctl{flex:0 0 auto}
.ctl.grow{flex:1 1 18rem;max-width:26rem}
.count{font-size:.85rem;color:var(--muted);margin:.9rem 0 .3rem}
.hint{font-size:.8rem;color:var(--muted);margin:0 0 1.1rem;max-width:72ch}
.empty{border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:6px;padding:.85rem 1rem;margin:0 0 1.5rem;font-size:.92rem;max-width:78ch}
.empty p{margin:.35rem 0}
#emptyq{font-weight:600}
.empty[hidden]{display:none}
.scroll{overflow-x:auto;border:1px solid var(--line);border-radius:8px}
table{border-collapse:collapse;width:100%;font-size:.9rem;min-width:56rem}
th,td{text-align:left;vertical-align:top;padding:.6rem .75rem;border-bottom:1px solid var(--line)}
thead th{background:var(--bg);font-size:.78rem;letter-spacing:.03em;text-transform:uppercase;color:var(--muted)}
tbody th{font-weight:600;min-width:15rem}
.id{display:block;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted);text-decoration:none;width:max-content}
.ours{display:block;margin-top:.25rem;font-size:12px;color:var(--muted);width:max-content;max-width:100%}
.id:hover,.id:focus{text-decoration:underline}
tr:target th{box-shadow:inset 3px 0 0 var(--accent)}
tr:target>*{background:var(--code)}
code{display:block;font:12.5px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--code);padding:.4rem .5rem;border-radius:4px;white-space:pre-wrap;word-break:break-word}
.when{display:block;font-size:.75rem;color:var(--muted);margin-top:.3rem}
.when.text-only{font-style:italic}
.none{color:var(--muted);font-style:italic}
.src{white-space:nowrap}
.cite{display:inline-block;vertical-align:top}
.cite summary{cursor:pointer;color:var(--accent)}
.cite code{display:block;white-space:pre-wrap;margin-top:.4rem;padding:.5rem;background:var(--code);font-size:.8rem;line-height:1.45;max-width:40rem;user-select:all}
footer{margin-top:2.5rem;padding-top:1.25rem;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem;max-width:78ch}
tr[hidden]{display:none}
@media(max-width:56rem){
.scroll{overflow-x:visible;border:0;border-radius:0}
table{min-width:0;display:block}
thead{display:none}
tbody{display:block}
tr{display:block;border:1px solid var(--line);border-radius:8px;margin:0 0 .75rem}
th,td{display:block;border-bottom:0;padding:.45rem .8rem}
tbody th{min-width:0;padding-top:.7rem}
td[data-label]::before{content:attr(data-label);display:block;font-size:.72rem;letter-spacing:.03em;text-transform:uppercase;color:var(--muted);margin-bottom:.3rem}
.src{white-space:normal;padding-bottom:.7rem}
.cite code{max-width:none}
}
</style>
<div class="wrap">
<h1>Is the number you cited still current?</h1>
<p class="lede">Best-known bounds move, and the papers and index pages citing them do not all move at the same time. This is every mathematical constant this ledger watches, with the exact table rows it has pinned.</p>

<div class="note">
<p><strong>Read this before you trust a number here.</strong> This page is a <em>snapshot</em>, not a live read. It shows our mirror of <a href="https://github.com/teorth/optimizationproblems">teorth/optimizationproblems</a> at upstream commit <code style="display:inline;padding:.1rem .3rem">${esc(sha.slice(0, 7))}</code>.</p>
<p><strong>${esc(generatedOn)} is the date this mirror last CHANGED &mdash; not the last time it was checked.</strong> Those are different dates and the difference matters here: a scheduled job re-verifies every pinned row on this page daily, and a day that finds nothing moved leaves this date untouched. So an old date means the records have been <em>steady</em>, not that nobody has looked. The longest such quiet stretch so far was nine days. To see the actual last check and its verdict, read the <a href="https://github.com/u00dxk2/bounds-ledger/actions/workflows/reverify.yml">run history</a> &mdash; that is the live read, and this page is deliberately not.</p>
<p>Every row links to its primary source so you can check us in one hop — and if a row disagrees with its source, that is a bug worth reporting. Use the <strong>looks wrong?</strong> link on that row: the report arrives already naming the constant and the exact mirror commit, so you never have to work out how to describe which of ${rows.length} rows you meant.</p>
<p>Some rows carry a <strong>we reported this row</strong> link. That means we ourselves filed a report upstream about that row, and the link goes to it so you can read what we said and judge it. We show it because our own involvement in a row is part of what you need in order to weigh the row — and <strong>it is not a claim that anything upstream changed because of us</strong>. The state shown is the report's own; whether it caused anything is a separate question this page does not answer.</p>
<p><strong>Every row has its own link.</strong> Click a row&rsquo;s short id — the grey code under the constant&rsquo;s name — and your address bar holds a link to that row alone. Send that to a colleague and they land on the constant, not on a page of two hundred.</p>
<p><strong>These are last-listed table rows, not a claim about which bound is “the record.”</strong> Deciding that automatically is defeated by symbolic entries, negatives and asymptotic notation, so this ledger does not try; it reports position and leaves the judgement to you.</p>
</div>

<div class="controls">
<div class="ctl grow">
<label for="q">Filter by name, id, or a bound value — paste a number you are about to cite, or try “sofa”, “Grothendieck”, “27b”</label>
<input id="q" type="search" autocomplete="off" placeholder="Type to filter&hellip;">
</div>
<div class="ctl">
<label for="sort">Order</label>
<select id="sort">
<option value="id">By constant id</option>
<option value="recent">Most recently updated first</option>
</select>
</div>
</div>
<p class="count" id="count">${rows.length} constants</p>
<p class="hint">Each date is when that row&rsquo;s pinned text last changed <em>in this ledger</em>. Most rows share the day the ledger first pinned them, so anything dated later is a row that has moved since &mdash; order by most recently updated to bring those to the top.</p>

<div class="empty" id="empty" hidden>
<p><strong>Nothing here matches <span id="emptyq"></span>.</strong> That is an answer, but not a useful one on its own, so: this ledger mirrors the ${rows.length} constants in <a href="https://github.com/teorth/optimizationproblems">teorth/optimizationproblems</a>. If yours is not among them, we are not watching it — it is not that the number is unavailable, it is that this ledger has never looked.</p>
<p>Filtering matches the constant&rsquo;s name, its id, and <em>every value cell in the bound tables we mirror for it</em> &mdash; not only the two rows we pin, and including values this ledger pinned earlier and no longer does. A number sitting higher up a constant&rsquo;s table still finds it, which is where most numbers already in circulation sit. So you can paste a number you cited and land on its constant, then read the current table yourself. A partial number works, since matching is on substrings. Two things are <em>not</em> matched: the reference and comment cells beside a bound (an author tag or a bracketed citation key will find nothing), and a name we do not list the constant under. Both are worth a scan of the full list before concluding a constant is absent.</p>
<p><a id="emptyask" href="${esc(REPO)}/issues/new">Tell us what you were looking for &rarr;</a> — it arrives naming your search term, and a constant someone actually asked for is the best evidence we have about what to watch next.</p>
</div>

<div class="scroll">
<table>
<thead><tr><th scope="col">Constant</th><th scope="col">Upper-bound row (last listed)</th><th scope="col">Lower-bound row (last listed)</th><th scope="col">Primary</th></tr></thead>
<tbody id="rows">
${body}
</tbody>
</table>
</div>

<footer>
<p>Generated from <code style="display:inline;padding:.1rem .3rem">ledger/claims.json</code> by <code style="display:inline;padding:.1rem .3rem">scripts/render-site.mjs</code>. For the live verdict — whether every claim still holds right now — clone the repo and run <code style="display:inline;padding:.1rem .3rem">npm run check</code>.</p>
<p>${manualPhrase} a page that refuses automated requests from data-centre addresses, so they report UNVERIFIED permanently and never count toward a pass. That is the ledger declining to launder an unverifiable fact into a green.</p>
<p><a href="https://github.com/u00dxk2/bounds-ledger">Source, method and every catch it has made &rarr;</a></p>
</footer>
</div>
<script>
(function(){
  var q=document.getElementById('q'),s=document.getElementById('sort'),
      rows=document.getElementById('rows'),count=document.getElementById('count'),
      empty=document.getElementById('empty'),emptyq=document.getElementById('emptyq'),
      ask=document.getElementById('emptyask');
  var trs=[].slice.call(rows.getElementsByTagName('tr'));
  function filter(){
    var raw=q.value.trim(),v=raw.toLowerCase(),n=0;
    for(var i=0;i<trs.length;i++){
      var hit=!v||trs[i].getAttribute('data-find').indexOf(v)>-1;
      trs[i].hidden=!hit; if(hit)n++;
    }
    count.textContent=n+(n===1?' constant':' constants')+(v?' matching “'+v+'”':'');
    // A search that matches nothing used to leave an empty table and no explanation, so a visitor
    // could not tell "we do not track this" from "you spelled it differently". textContent, never
    // innerHTML — the term is visitor input and must never become markup.
    empty.hidden=n>0;
    if(!n){
      emptyq.textContent='“'+raw+'”';
      ask.href='${REPO}/issues/new?title='+encodeURIComponent('Constant not tracked: '+raw)+
        '&body='+encodeURIComponent('I searched the ledger for: '+raw+'\\n\\nWhat I was trying to check:\\n\\nWhere the record lives (link or citation):\\n');
    }
  }
  function order(){
    var seq=trs.slice();
    if(s.value==='recent'){
      // Array.prototype.sort is stable (ES2019), so rows sharing a date keep their id order and
      // no tiebreak is needed. A row with no date sorts LAST, never first: "we could not date it"
      // is not "it changed longest ago".
      seq.sort(function(a,b){
        var x=a.getAttribute('data-changed')||'',y=b.getAttribute('data-changed')||'';
        if(x===y)return 0;
        if(!x)return 1;
        if(!y)return -1;
        return x<y?1:-1;
      });
    }
    for(var i=0;i<seq.length;i++)rows.appendChild(seq[i]);
  }
  q.addEventListener('input',filter);
  s.addEventListener('change',order);
})();
</script>
</html>
`;
}

async function selftest() {
  const assert = (await import("node:assert/strict")).default;
  const claims = [
    // 10a carries the REAL raw-URL shape so the rendered page proves the rewrite in situ; 2a keeps an
    // example.invalid URL so the same render proves the pass-through leg. Both polarities, one fixture.
    { id: "pin:10a:U", statement: "Last-listed upper-bound table row for The real Grothendieck constant (10a.md)", url: "https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants/10a.md", expect: "| 1.7822 | Krivine |" },
    { id: "pin:10a:L", statement: "Last-listed lower-bound table row for The real Grothendieck constant (10a.md)", url: "https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants/10a.md", expect: "| 1.6769 | Davie |" },
    { id: "pin:2a:U", statement: "Last-listed upper-bound table row for The Crouzeix constant (2a.md)", url: "https://example.invalid/2a.md", expect: "| 2 | <script>x</script> |" },
    { id: "C-7", statement: "hand claim", url: "https://example.invalid/36", expect: "0.380876" },
  ];
  const manifest = { sha: "e70b4a45ae3a6218785088591e26521c20cfd49f" };

  assert.deepEqual(constantIds(claims), ["2a", "10a"], "ids sort numerically, not lexically, and exclude hand claims");
  assert.equal(titleFrom(claims[0].statement), "The real Grothendieck constant");

  const rows = buildRows(claims, { withDates: false });
  assert.equal(rows.length, 2);
  const html = renderHtml(rows, manifest, "2026-08-20");

  // FIRES: the page carries the content it is supposed to carry.
  assert.match(html, /The real Grothendieck constant/, "must render the constant name");
  assert.match(html, /Krivine/, "must render the pinned upper row");
  assert.match(html, /Davie/, "must render the pinned lower row");
  assert.match(html, /e70b4a4/, "must state the upstream sha it is a snapshot of");

  // The snapshot date must be labelled as LAST CHANGED, never as last checked. Measured 2026-08-27:
  // fetchedAt only moves on a --snapshot, which only happens when something drifted, so a quiet
  // stretch freezes it -- the longest so far was NINE days (2026-08-14 -> 2026-08-23), during which
  // the scheduled job verified every row daily. Reading that date as "last looked at" makes a
  // diligently-checked ledger look abandoned -- the inverse of this repo's founding defect, and it
  // costs exactly the trust this page exists to earn.
  assert.match(html, /last CHANGED/, "must label the snapshot date as last-changed, not last-checked");
  assert.match(html, /actions[/]workflows[/]reverify[.]yml/, "must hand the reader a live read for the last actual check");
  // NEGATIVE CONTROL: the old phrasing implied the date was when we last looked. It must be GONE,
  // not merely outnumbered by the new sentence.
  assert.doesNotMatch(html, /[<][/]code[>], fetched /, "the bare fetched-date phrasing must not survive");

  // A missing side must be shown as missing, never silently blank — 2a has no lower pin here.
  assert.match(html, /not pinned/, "a constant with only one pinned side must say so");

  // SILENT half, asserted only AFTER the page is proven non-empty above: it must not claim a
  // record. A broken renderer producing "" would satisfy these doesNotMatch checks trivially,
  // which is the 2026-08-17 empty-string trap, so the positive assertions above are the guard.
  assert.ok(html.length > 2000, "positive control: page must be substantial before absences are asserted");
  assert.doesNotMatch(html, /is the record|current record|best known bound is/i, "must never assert which row is the record");

  // Escaping: a table cell containing markup must not become live markup on a public page.
  assert.doesNotMatch(html, /\| 2 \| <script>/, "cell content must be escaped, not injected");
  assert.match(html, /&lt;script&gt;x&lt;\/script&gt;/, "the escaped form must be what appears");

  // --- Per-row report link, added 2026-08-22. Both KP-78 answers. ---
  // FIRES: every row carries its OWN prefilled link. One link for the whole page was the defect;
  // a test that only asserted "an /issues link exists" would have passed against that too.
  const flagLinks = html.match(/looks wrong\?<\/a>/g) || [];
  assert.equal(flagLinks.length, rows.length, "every row must carry its own report link");
  assert.match(html, /issues\/new\?title=Row%20looks%20wrong%3A/, "the link must PREFILL, not merely point at /issues");
  // NB: encodeURIComponent leaves parentheses literal — they are legal in a query string. The
  // first draft of this assertion expected %2810a%29 and failed, which is the test earning its keep.
  assert.match(html, /title=Row%20looks%20wrong%3A%20The%20real%20Grothendieck%20constant%20\(10a\)/, "the prefilled title must name the constant the visitor was reading");

  // --- No UNCLASSIFIABLE report path, added 2026-08-28. ---
  // The intro used to close with "that is a bug worth [reporting]" pointing at the bare issues
  // LIST. That link outlived the per-row control shipped 2026-08-22 and quietly competed with it:
  // report-rate.mjs classifies an arrival by the prefilled title (/^Row looks wrong:/) or the
  // "Ledger mirror: upstream" body marker, so an issue opened from the bare list has
  // arrivalKind() === null and lands in outsideOther, NOT in outsideArrivals. Nothing lies — the
  // sum-check still reconciles — but the page's most prominent reporting call-to-action steered a
  // visitor OFF the one path G-4 is measured on, and made them retype which of 222 rows they meant.
  // The assertion is deliberately about the bare LIST url, not about the word "reporting": the
  // prefilled /issues/new links must keep passing.
  assert.ok(!/href="[^"]*\/issues"/.test(html),
    "no link may point at the bare issues LIST — a report filed there is unclassifiable by report-rate.mjs (outsideOther, not an arrival)");
  assert.match(html, /Use the <strong>looks wrong\?<\/strong> link on that row/,
    "the intro must send a doubting reader to the per-row control, which is the path G-4 is measured on");

  // --- Per-row permalinks, added 2026-08-26. A reader cannot tell a colleague about ONE constant
  // when the only address is the whole 222-row page, and "send them a link" is how this ledger gets
  // told to a friend at all. The row's id attribute and the anchor pointing at it are generated in
  // two different places, so they can drift apart silently — and a permalink targeting an id that
  // does not exist scrolls nowhere, which reads to a visitor as the page ignoring the click rather
  // than as a bug. Assert they agree row by row, not merely that both exist.
  const rowIds = [...html.matchAll(/<tr id="([^"]+)"/g)].map((m) => m[1]);
  const permalinks = [...html.matchAll(/<a class="id" href="#([^"]+)"/g)].map((m) => m[1]);
  assert.equal(rowIds.length, rows.length, "positive control: every rendered row must carry an id before any linkage is asserted");
  assert.equal(permalinks.length, rows.length, "every row must expose its own permalink");
  assert.deepEqual(permalinks, rowIds, "each row's permalink must target that row's own id, in document order");
  // --- The two address forms, whole-page (A-40, 2026-09-03). ---
  // The permalinks asserted above are the anchor form and are CORRECT: a reader pointing a colleague
  // at a row of the table they are both reading wants the row, in the table. The citation is the
  // other job — it leaves the page — and owes the constant's own canonical page. So this is not
  // "the anchor is banned"; it is that the two jobs must not swap. Scoped to the cite blocks for
  // exactly that reason: a page-wide absence assertion would fire on a perfectly correct page.
  const citeBlocks = [...html.matchAll(/<details class="cite">.*?<\/details>/gs)].map((m) => m[0]);
  assert.equal(citeBlocks.length, rows.length, "positive control: every row must render a cite block before their contents are asserted");
  for (const [i, block] of citeBlocks.entries()) {
    assert.ok(block.includes(`/bounds-ledger/c/${rows[i].id}.html`),
      `row ${rows[i].id}'s citation must carry that constant's canonical page URL`);
    assert.ok(!block.includes("/bounds-ledger/#c-"),
      `row ${rows[i].id}'s citation emits the in-table anchor — the site would hand out one address and declare another canonical`);
  }
  // Positive control that the anchor form DOES still exist on this page, so the absence above is a
  // statement about cite blocks and not about a page that quietly lost its permalinks.
  assert.match(html, /<a class="id" href="#c-/, "positive control: the anchor form must still be present as the row permalink");

  // The prefix is load-bearing: a bare id like "10a" starts with a digit, which is a legal HTML id
  // but cannot be written as a bare CSS selector — :target styling would silently not apply.
  assert.match(html, /<tr id="c-10a"/, "row ids must carry the c- prefix so a numeric-leading constant id stays selectable");
  // Both :target rules are asserted SEPARATELY and by their declaration, not by the bare string
  // "tr:target". The first version of this assertion matched /tr:target/ and a negative control
  // proved it could not fail: deleting either rule left the other one matching, so an assertion
  // that read as "the landed row is marked" actually checked only that the words appeared once.
  assert.match(html, /tr:target th\{box-shadow/, "the landed row must carry an edge marker");
  assert.match(html, /tr:target>\*\{background/, "the landed row must carry a background fill");

  // --- The filed-report disclosure: fires on a mapped row, silent on every other, and NEVER
  // --- says our report caused anything. The last of those is the one worth a test: a causal
  // --- claim here would be this lane publishing exactly the kind of unverified statement it
  // --- exists to catch in other people (A-33 note3).
  const discloseClaims = [
    { id: "pin:87a:U", statement: "Last-listed upper-bound table row for Widget (87a.md)", url: "https://example.invalid/87a.md", expect: "| 857.5662 |" },
    { id: "pin:10a:U", statement: "Last-listed upper-bound table row for Gadget (10a.md)", url: "https://example.invalid/10a.md", expect: "| 4 |" },
  ];
  const filedFixture = [{
    path: "constants/87a.md",
    issue: 150,
    url: "https://example.invalid/issues/150",
    state: "CLOSED",
    closedAt: "2026-08-23T17:15:35Z",
  }];
  const disclosed = renderHtml(buildRows(discloseClaims, { withDates: false, reports: filedFixture }), manifest, "2026-09-02");
  // Positive control FIRST: both rows must actually be on the page, or "absent" below proves nothing.
  assert.match(disclosed, /<tr id="c-87a"/, "positive control: the mapped row must render before its disclosure is asserted");
  assert.match(disclosed, /<tr id="c-10a"/, "positive control: the unmapped row must render before its silence is asserted");

  // FIRES: the mapped row carries the link, pointing at the report we filed.
  const ours = disclosed.match(/<a class="ours"[^>]*>([^<]*)<\/a>/);
  assert.ok(ours, "the mapped row must disclose the report we filed against it");
  assert.match(ours[0], /href="https:\/\/example\.invalid\/issues\/150"/, "the disclosure must link the report itself, not the repo");
  assert.equal(ours[1], "we reported this row · closed 2026-08-23");

  // SILENT: exactly one disclosure on a two-row page, so the unmapped row carries none.
  assert.equal((disclosed.match(/class="ours"/g) || []).length, 1, "a row we filed nothing against must carry no disclosure");

  // Negative control on the SILENCE: with the fixture removed the count drops to zero, proving
  // the assertion above tracks the map rather than counting a string that is always there once.
  const undisclosed = renderHtml(buildRows(discloseClaims, { withDates: false, reports: [] }), manifest, "2026-09-02");
  assert.equal((undisclosed.match(/class="ours"/g) || []).length, 0, "the disclosure must disappear when nothing is filed");

  // NO CAUSAL CLAIM anywhere in the emitted disclosure or the prose that explains it.
  for (const forbidden of [/caused/i, /because of us/i, /candidate causal/i, /thanks to/i, /led to/i, /our report fixed/i]) {
    assert.ok(!forbidden.test(ours[0]), `the disclosure must assert no cause — matched ${forbidden}`);
  }
  assert.match(disclosed, /it is not a claim that anything upstream changed because of us/,
    "the page must say in words that the disclosure asserts no cause");

  // An OPEN report reads "open" and gets no date — a closed-on date on an open report would be
  // a fabricated fact, and the label builds that date from state rather than from presence.
  assert.equal(reportLabel({ state: "OPEN", closedAt: null }), "we reported this row · open");
  assert.equal(reportLabel({ state: "OPEN", closedAt: "2026-08-23T17:15:35Z" }), "we reported this row · open");

  // reportFor keys on the exact upstream path, so a neighbouring id never inherits a disclosure.
  assert.equal(reportFor("87a", filedFixture).issue, 150);
  assert.equal(reportFor("7a", filedFixture), null);
  assert.equal(reportFor("87a", []), null);
  assert.equal(reportFor("87a", null), null);

  // A hostile url in the record is attribute-escaped rather than breaking out of the href.
  const hostileFiled = [{ path: "constants/87a.md", issue: 1, url: 'https://example.invalid/"><script>x</script>', state: "OPEN" }];
  const hostileDisclosed = renderHtml(buildRows(discloseClaims, { withDates: false, reports: hostileFiled }), manifest, "2026-09-02");
  assert.ok(hostileDisclosed.length > 2000, "positive control: the hostile-disclosure page must render before any absence is asserted");
  assert.ok(!/<script>x<\/script>/.test(hostileDisclosed), "a url in the filed-report record reached the page as markup");

  // A constant name carrying markup, a quote and an ampersand. This is what pins the encoding
  // ORDER: encodeURIComponent must run before esc, or a name can break out of the href attribute.
  const hostile = [{
    id: "pin:3a:U",
    statement: 'Last-listed upper-bound table row for Tea & "q" <b>x</b> (3a.md)',
    url: "https://example.invalid/3a.md",
    expect: "| 3 | X |",
  }];
  const hostileHtml = renderHtml(buildRows(hostile, { withDates: false }), manifest, "2026-08-20");
  assert.ok(hostileHtml.length > 2000, "positive control: the hostile page must render before any absence is asserted");
  // Match the ROW link by its prefilled title, not by being the first issues/new href on the page.
  // It was positional, and adding the empty state's plain /issues/new link above the table made
  // this grab that one instead — the assertion then failed against a URL it was never about.
  // A test that identifies its subject by position breaks when anything is inserted above it.
  const href = hostileHtml.match(/href="(https:\/\/github\.com\/[^"]*issues\/new\?title=Row%20looks%20wrong[^"]*)"/)[1];
  assert.match(href, /%3Cb%3E/, "markup in a constant name must arrive percent-encoded");
  assert.match(href, /Tea%20%26%20/, "a literal ampersand in a name must be percent-encoded, not left as a separator");
  assert.match(href, /&amp;body=/, "the real query separator must be HTML-escaped in the attribute");
  // SILENT half, asserted only after the positive control above.
  assert.doesNotMatch(href, /<b>|<\/b>/, "raw markup must never reach the href");
  assert.doesNotMatch(href, /%26amp%3B/, "esc must not have run before encodeURIComponent");

  // --- Per-row citation, added 2026-08-29. Both KP-78 answers. ---
  // The load-bearing property is NOT that a citation renders: it is that the citation carries its
  // own caveat, because a citation is the only artifact on this page that travels away from the
  // context that qualifies it. A citation naming a bound with no "not a claim about the current
  // record" beside it is this lane manufacturing exactly the mis-citation it exists to catch.
  const citeRow = buildRows([{
    id: "pin:15a:U",
    statement: "Last-listed upper-bound table row for A test constant (15a.md)",
    url: "https://example.invalid/15a.md",
    expect: "| $2.371177$ | [XYZ] | prose |",
  }], { withDates: false })[0];
  const cite = citation(citeRow, "abcdef1234567890");
  assert.ok(cite.length > 80, "positive control: the citation must render before any absence is asserted");
  assert.match(cite, /A test constant \(15a\)/, "the citation must name the constant and its id");
  assert.match(cite, /upper bound: \$2\.371177\$/, "the citation must carry the pinned bound, not just a link");
  assert.match(cite, /lower bound: not pinned/, "a missing side must say so rather than be omitted");
  assert.match(cite, /teorth\/optimizationproblems@abcdef1/, "the citation must name the upstream sha it was mirrored at");
  // THE CAVEAT MUST TRAVEL. Worth recording how this wording was reached: the first draft said
  // "not a claim about the current record", and the page's own standing guard — doesNotMatch
  // /is the record|current record|best known bound is/ — fired on it. The guard cannot parse
  // negation, so it read a DISCLAIMER as the claim. The fix was to reword the caveat, never to
  // loosen the guard: a page one edit away from asserting a record is exactly what it is for, and
  // "weaken the verifier so the candidate passes" is the move this repo forbids everywhere else.
  assert.match(cite, /a listing position, not a statement that this bound is the strongest or most recent/,
    "a citation without its caveat invites the mis-citation this ledger exists to catch");
  assert.match(cite, /A snapshot at that sha, not a live read/, "the citation must say it is a snapshot");
  // THE ADDRESS MUST BE THE CANONICAL ONE (A-40). Both polarities, because the failure this pins is
  // a silent REGRESSION to the anchor form rather than a broken render: a citation ending at
  // `#c-15a` still looks like a working citation, and the only thing wrong with it is that the site
  // declares a different URL authoritative for the same object.
  assert.match(cite, /https:\/\/u00dxk2\.github\.io\/bounds-ledger\/c\/15a\.html/,
    "the citation must carry the constant's own canonical page, which is the address this site declares authoritative");
  assert.doesNotMatch(cite, /bounds-ledger\/#c-/,
    "a citation must not hand out the in-table anchor: the site would then publish two addresses for one constant");
  // The row must never be described in a way the generated pins do not support (header point 2).
  assert.doesNotMatch(cite, /\bbest known\b|\brecord is\b|\bcurrent best\b/i,
    "a citation must not upgrade a listing-position pin into a record claim");
  // Rendered form: escaped at embed, never double-escaped, and reachable without JS.
  const hostileCite = hostileHtml.match(/<details class="cite">.*?<\/details>/s)[0];
  assert.match(hostileCite, /<summary[^>]*>cite<\/summary>/, "the citation must be revealed by native details/summary, not script");
  assert.match(hostileCite, /Tea &amp; &quot;q&quot; &lt;b&gt;x&lt;\/b&gt;/, "a hostile constant name must be HTML-escaped in the citation block");
  assert.doesNotMatch(hostileCite, /&amp;amp;/, "esc must run once — a double-escaped citation would paste as &amp;amp;");
  assert.doesNotMatch(hostileCite, /<b>x<\/b>/, "raw markup must never reach the citation block");

  // --- Order-by-most-recently-updated, added 2026-08-23. Both KP-78 answers. ---
  // The date CHOICE is the real logic and is exported so it can be tested for real; the reorder
  // itself is four lines of DOM glue in the inlined script, which this suite can only assert is
  // wired, not execute. Saying which is which matters: an assertion that a <script> contains a
  // string is evidence the code SHIPPED, not evidence it WORKS.
  assert.equal(newerOf("2026-07-24", "2026-08-14"), "2026-08-14", "a row's date is the later of its two sides");
  assert.equal(newerOf("2026-08-14", "2026-07-24"), "2026-08-14", "argument order must not matter");
  assert.equal(newerOf(null, "2026-08-14"), "2026-08-14", "one dated side is enough to date the row");
  assert.equal(newerOf("2026-08-14", null), "2026-08-14", "one dated side is enough, either side");
  assert.equal(newerOf(null, null), null, "no dated side leaves the row undated, never today's date");

  // FIRES: a dated row publishes the LATER date, so ordering can reach it without re-deriving.
  const dated = renderHtml([
    { id: "10a", title: "Grothendieck", url: "https://example.invalid/10a.md", upper: "| 1.78 | K |", lower: "| 1.67 | D |", upperChanged: "2026-07-24", lowerChanged: "2026-08-14", changed: newerOf("2026-07-24", "2026-08-14") },
    { id: "2a", title: "Crouzeix", url: "https://example.invalid/2a.md", upper: "| 2 | X |", lower: null, upperChanged: null, lowerChanged: null, changed: null },
  ], manifest, "2026-08-20");
  assert.ok(dated.length > 2000, "positive control: the dated page must render before any absence is asserted");
  assert.match(dated, /data-changed="2026-08-14"/, "a moved row must carry its later date as sortable data");
  assert.match(dated, /<select id="sort"/, "the page must offer an ordering control");
  assert.match(dated, /value="recent"/, "the ordering control must offer most-recently-updated");
  assert.match(dated, /rows\.appendChild/, "the reorder must actually be wired into the page script");

  // SILENT half, asserted only after the positive control above. An undated row must publish an
  // EMPTY data-changed — not today, not the bootstrap date, not omitted-and-guessed-at. This is
  // the zero-versus-absent line the repo polices, now on a sort key.
  assert.match(dated, /data-changed=""/, "an undated row must publish an empty date, not a fabricated one");
  assert.doesNotMatch(dated, /data-changed="20\d\d-\d\d-\d\dT/, "dates must stay plain calendar days, never timestamps");
  // The page must not upgrade "our pin text changed" into "the record moved on this date".
  assert.doesNotMatch(dated, /moved on|changed upstream on|record moved/i, "the date means our pin changed, and the page must not claim more");

  // The glue, EXECUTED rather than read. The four assertions above prove the reorder shipped; they
  // cannot prove it works, and "assert the source contains appendChild" is exactly the shape this
  // repo calls a detector that has never been shown to fire. So: pull the script out of the page it
  // actually generated — never a retyped copy, per the 2026-08-21 rule — and run it against a stub
  // DOM. No browser needed, and it guards the ordering permanently rather than once.
  const script = dated.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.ok(/appendChild/.test(script), "positive control: the extracted script must be the reorder, not an empty match");

  const tr = (id, changed) => ({ id, hidden: false, getAttribute: (k) => (k === "data-changed" ? changed : id) });
  const order = [];
  const trs = [tr("aug14", "2026-08-14"), tr("jul24", "2026-07-24"), tr("undated", ""), tr("aug02", "2026-08-02")];
  const el = (extra = {}) => ({ addEventListener(ev, fn) { this["on" + ev] = fn; }, ...extra });
  const sortEl = el({ value: "id" });
  const qEl = el({ value: "" });
  const emptyEl = el({ hidden: true });
  const emptyqEl = el({ textContent: "" });
  const askEl = el({ href: "" });
  const rowsEl = el({ getElementsByTagName: () => trs, appendChild: (n) => order.push(n.id) });
  const nodes = { q: qEl, sort: sortEl, rows: rowsEl, count: el({ textContent: "" }), empty: emptyEl, emptyq: emptyqEl, emptyask: askEl };
  const stub = { getElementById: (i) => nodes[i] };

  new Function("document", script)(stub);
  sortEl.value = "recent";
  sortEl.onchange();

  // FIRES: newest first, and the undated row lands LAST rather than leading as an empty string would.
  assert.deepEqual(order, ["aug14", "aug02", "jul24", "undated"],
    "ordering by most recent must put the newest date first and an undated row last");

  // SILENT half: switching back to id order restores the document order exactly.
  order.length = 0;
  sortEl.value = "id";
  sortEl.onchange();
  assert.deepEqual(order, ["aug14", "jul24", "undated", "aug02"],
    "switching back to id order must restore the original row order, not a re-sorted one");

  // --- Empty state, added 2026-08-23. Both KP-78 answers, executed not read. ---
  // A search matching nothing used to leave an empty table under a "0 constants" line, which
  // cannot distinguish "we do not watch this constant" from "you typed a name we file differently".
  assert.match(dated, /id="empty"[^>]*hidden/, "the empty state must ship hidden, not shown by default");

  qEl.value = "not-a-constant";
  qEl.oninput();
  // FIRES: a miss explains itself and offers a route that names what they searched for.
  assert.equal(emptyEl.hidden, false, "a search matching nothing must reveal the empty state");
  assert.equal(emptyqEl.textContent, "“not-a-constant”", "the empty state must quote the term back");
  assert.match(askEl.href, /issues\/new\?title=Constant%20not%20tracked%3A%20not-a-constant/,
    "the ask link must prefill with the visitor's own search term");

  // A term carrying markup must reach the link percent-encoded and the page as text, never markup.
  qEl.value = '<img src=x onerror=alert(1)>';
  qEl.oninput();
  assert.doesNotMatch(askEl.href, /<img/, "a hostile term must never reach the href as raw markup");
  assert.match(askEl.href, /%3Cimg/, "positive control: the term must arrive percent-encoded");
  assert.equal(emptyqEl.textContent, '“<img src=x onerror=alert(1)>”',
    "the term is set as TEXT — assigning it as markup would make the filter box an injection point");
  // HONEST LIMIT on the line above. The stub is a plain object, so it does not PARSE markup the way
  // a browser would; swapping textContent for innerHTML fails this assertion because textContent is
  // then never written, not because the stub observed an injection. The detector fires either way,
  // which is what a guard needs to do — but it is evidence that the code still assigns text, not
  // proof that a browser is safe. The real guarantee is that the value never touches an HTML string
  // on any path, which is readable in the four lines above and is why they are kept that short.

  // SILENT half: a search that matches something must hide the empty state again.
  qEl.value = "aug14";
  qEl.oninput();
  assert.equal(emptyEl.hidden, true, "a search that matches must hide the empty state");
  qEl.value = "";
  qEl.oninput();
  assert.equal(emptyEl.hidden, true, "an empty search shows every row, so the empty state stays hidden");

  // --- Search by the number you cited, added 2026-09-01. Both KP-78 answers.
  // The page's headline asks "is the number you cited still current?" and until today the filter
  // matched only the constant's name and its id — so the one reader who arrives holding a STALE
  // value, the reader most likely to have found something worth telling us, was the reader the
  // search could not serve.

  // FIRES: the haystack carries the current bound cells AND the previously-pinned one.
  // NOTE the word: PREVIOUSLY PINNED, not superseded. `prevExpect` is the row that used to be
  // last-listed. Upstream appending a row below the one we pin changes it while superseding
  // nothing — 8 of 8 live cases on 2026-09-01 were appends or restructures. That distinction is
  // why this value is searchable and never displayed.
  const moved = {
    id: "71a", title: "Fourier Entropy-Influence",
    upper: "| $C_{71} > 6.521845710923046575$ | [New] |",
    lower: null,
    upperPrev: "| $C_{71} > 6.514326913930565372$ | [Old] |",
    lowerPrev: null,
  };
  const key = findKey(moved);
  assert.ok(key.length > 20, "positive control: the haystack must be built before any absence is asserted");
  assert.ok(key.includes("6.521845710923046575"), "the current pinned value must be searchable");
  assert.ok(key.includes("6.514326913930565372"), "the previously-pinned value must be searchable — the whole point");
  assert.ok(key.includes("6.5143"), "a truncated citation must hit, since matching is on substrings");
  assert.ok(key.includes("fourier entropy-influence") && key.includes("71a"),
    "name and id must keep working — this extends the haystack, it does not replace it");

  // --- Hand-curated aliases, added 2026-09-05. Both KP-78 answers, and a real fixture.
  // The case that motivated it: upstream rewrote 1b's Haugland cell from 0.380927 to 0.380926, so
  // the older value — which the mirrored table no longer contains and which was never a GENERATED
  // pin — left the haystack the same day. A reader holding it got the empty state.
  const aliasClaims = [
    { id: "C-2", url: "https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants/1b.md", searchAliases: ["0.380927"] },
    { id: "C-9", url: "https://www.erdosproblems.com/36" },
    { id: "C-3", url: "https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants/2a.md", searchAliases: ["9.99887766"] },
  ];
  const alias1b = aliasesFor("1b", aliasClaims);
  assert.deepEqual(alias1b, ["0.380927"],
    "the alias must be collected for the constant its claim's URL names");
  assert.deepEqual(aliasesFor("2a", aliasClaims), ["9.99887766"],
    "positive control: a DIFFERENT constant collects its own alias, so the match is on the url and not on returning the first list it finds");
  assert.deepEqual(aliasesFor("47a", aliasClaims), [],
    "a constant with no aliased claim collects nothing — no phantom value");

  // FIRES: the alias reaches the haystack.
  const aliased = findKey({ id: "1b", title: "Erdos minimum overlap", upper: "| $0.380926$ | [H2016] |", lower: null, upperPrev: null, lowerPrev: null, aliases: alias1b });
  assert.ok(aliased.includes("0.380926"), "positive control: the CURRENT value is in the haystack before any claim about the old one");
  assert.ok(aliased.includes("0.380927"), "the aliased value a reader is holding must be searchable — the whole point");

  // SILENT: a row with no aliases contributes nothing, and never the word undefined.
  const unaliased = findKey({ id: "2a", title: "Crouzeix", upper: "| $2$ | [X] |", lower: null, upperPrev: null, lowerPrev: null, aliases: [] });
  assert.ok(unaliased.includes("crouzeix"), "positive control: the unaliased row still builds a haystack");
  assert.doesNotMatch(unaliased, /undefined|null/, "an absent alias list must contribute nothing, not the word undefined");

  // THE SEAM: an alias is a SEARCH string and must never become a displayed value. If it leaked
  // into the visible row a reader would read 0.380927 as something this ledger asserts, which it
  // is not — nobody pinned it and upstream no longer lists it.
  const aliasPage = renderHtml(
    [{ id: "1b", title: "Erdos minimum overlap", url: "https://example.invalid/1b.md", upper: "| $0.380926$ | [H2016] |", lower: null, upperChanged: null, lowerChanged: null, upperKind: null, lowerKind: null, upperPrev: null, lowerPrev: null, changed: null, report: null, tableValues: [], aliases: ["0.380927"] }],
    { commit: "deadbee", fetchedAt: "2026-09-05" }, "2026-09-05", 1);
  const visible1b = aliasPage.replace(/<[^>]*>/g, " ");
  assert.ok(aliasPage.includes("0.380927"), "positive control: the alias IS emitted, into the search attribute");
  assert.ok(!visible1b.includes("0.380927"),
    "an alias must never reach the visible page — it is a search string, not a value this ledger publishes");

  // SILENT: a row with no earlier pin contributes no phantom previous value.
  const still = findKey({ id: "2a", title: "Crouzeix", upper: "| $2$ | [X] |", lower: null, upperPrev: null, lowerPrev: null });
  assert.ok(still.includes("crouzeix") && still.includes("2a"), "positive control: the unmoved row still builds a haystack");
  assert.doesNotMatch(still, /undefined|null/, "an absent previous value must contribute nothing, not the word null");

  // THE SEAM, and it is the assertion that actually protects the feature. Everything above tests
  // findKey in isolation; the review of 3145ed9 showed that reverting the row template to the old
  // name-and-id expression left every one of those assertions passing while no visitor could
  // search by any number at all. So parse the attribute back OUT of the rendered page — never
  // re-derive it by calling findKey again, which is what made the first version blind.
  const wasPage = renderHtml([{
    ...moved, url: "https://example.invalid/71a.md",
    upperChanged: "2026-08-02", lowerChanged: null, upperKind: "value", lowerKind: null, changed: "2026-08-02",
  }], manifest, "2026-09-01");
  assert.ok(wasPage.length > 2000, "positive control: the page must render before any absence is asserted");
  const emitted = wasPage.match(/<tr id="c-71a" data-find="([^"]*)"/);
  assert.ok(emitted, "the rendered row must carry a data-find attribute — the filter reads this and nothing else");
  assert.ok(emitted[1].includes("6.521845710923046575"), "the emitted attribute must carry the current value");
  assert.ok(emitted[1].includes("6.514326913930565372"),
    "the emitted attribute must carry the previously-pinned value — the whole point, and the half a findKey-only test cannot see");

  // --- Search by a value we never pinned, added 2026-09-04. Both KP-78 answers.
  // The 09-01 work above covers values that moved WHILE WE WATCHED. It missed the commoner case:
  // a value already superseded in upstream's table when we first pinned the constant. Measured
  // that morning against the live page, "0.380876" (Erdős minimum overlap, the value
  // erdosproblems.com has shown since January) and "246" (bounded prime gap) each returned ZERO
  // rows, although both sit in tables this ledger mirrors. Those are the readers the page exists
  // for, and it turned them away with a not-tracked message.
  //
  // Fixtured rather than read from the live mirror on purpose: an assertion keyed to upstream's
  // current bytes would fail the day upstream edits a table, which is a fact about them and not
  // a regression here. The live values were verified by hand and recorded in the commit body.
  const tmpRoot = mkdtempSync(join(tmpdir(), "bl-tv-"));
  try {
    mkdirSync(join(tmpRoot, "ledger", "teorth-optimizationproblems", "constants"), { recursive: true });
    writeFileSync(join(tmpRoot, "ledger", "teorth-optimizationproblems", "constants", "fx.md"), [
      "# Fixture constant",
      "",
      "| Bound | Reference |",
      "| --- | --- |",
      "| $0.380876$ | [Old2026] |",
      "| $0.380868$ | [New2026] |",
      "",
      "Prose mentioning 12345 outside any table.",
    ].join("\n"));

    // FIRES: a value two rows above the pinned one is extracted.
    const vals = tableValuesFor("fx", tmpRoot);
    assert.ok(vals.length > 0, "positive control: the extractor must return something before any absence is asserted");
    assert.ok(vals.some((v) => v.includes("0.380876")), "a value we never pinned must still be extracted — the whole point");
    assert.ok(vals.some((v) => v.includes("0.380868")), "the pinned value must survive extraction too");

    // SILENT: the separator row, the header row and prose outside the table contribute nothing.
    assert.ok(!vals.some((v) => v.includes("---")), "a separator row must not enter the haystack");
    assert.ok(!vals.some((v) => v === "bound"), "a header cell must not enter the haystack");
    assert.ok(!vals.some((v) => v.includes("12345")), "prose outside a table row must not enter the haystack");
    assert.deepEqual(tableValuesFor("no-such-constant", tmpRoot), [],
      "a constant with no mirrored file must yield an empty list, never throw");
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true });
  }

  // THE SEAM again, for this half: read the value back OUT of the rendered attribute. findKey
  // passing in isolation is exactly what the 3145ed9 review showed can coexist with a template
  // that emits none of it.
  const withTable = { ...moved, tableValues: ["$9.991234$"], url: "https://example.invalid/71a.md",
    upperChanged: "2026-08-02", lowerChanged: null, upperKind: "value", lowerKind: null, changed: "2026-08-02" };
  const tablePage = renderHtml([withTable], manifest, "2026-09-04");
  assert.ok(tablePage.length > 2000, "positive control: the page must render before any absence is asserted");
  const tableEmitted = tablePage.match(/<tr id="c-71a" data-find="([^"]*)"/);
  assert.ok(tableEmitted, "the rendered row must still carry a data-find attribute");
  assert.ok(tableEmitted[1].includes("9.991234"),
    "the emitted attribute must carry a table value we never pinned — the half a findKey-only test cannot see");

  // AND IT MUST NOT BE VISIBLE, for the same reason a previously-pinned value must not be: it is
  // a row in upstream's table, not a record we assert anything about. Searchable, never displayed.
  const tableVisible = tablePage.replace(/ data-find="[^"]*"/g, "");
  assert.ok(!tableVisible.includes("9.991234"),
    "a table value must never be rendered as text — the haystack asserts nothing, the page would");

  // THE PREVIOUS VALUE MUST NOT BE VISIBLE. It is a listing position we used to pin, not a
  // superseded record, and displaying it beside the current value asserts a movement. Refuted on
  // Brun's constant before 3145ed9 was pushed: both values are still in upstream's table and are
  // explicitly not comparable. Strip the attribute before looking, or this assertion trivially
  // fails on the haystack it is not talking about.
  const visible = wasPage.replace(/ data-find="[^"]*"/g, "");
  assert.ok(visible.includes("6.521845710923046575"), "positive control: the CURRENT value is visible on the page");
  assert.ok(!visible.includes("6.514326913930565372"),
    "a previously-pinned value must never be rendered as text — searchable, never displayed");
  assert.doesNotMatch(visible, /used to read|until then|was previously|the bound was/i,
    "the page must make no claim that a pinned row was superseded");

  // The filter glue, EXECUTED against the page's own script rather than read — same discipline as
  // the ordering test above, and now fed from the EMITTED attribute rather than from findKey.
  const findScript = wasPage.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.ok(/data-find/.test(findScript), "positive control: the extracted script must be the filter, not an empty match");
  const findTr = (id, hay) => ({ id, hidden: false, getAttribute: (k) => (k === "data-find" ? hay : "") });
  const findTrs = [findTr("71a", emitted[1]), findTr("2a", still)];
  const fNodes = {
    q: el({ value: "" }), sort: el({ value: "id" }),
    rows: el({ getElementsByTagName: () => findTrs, appendChild: () => {} }),
    count: el({ textContent: "" }), empty: el({ hidden: true }),
    emptyq: el({ textContent: "" }), emptyask: el({ href: "" }),
  };
  new Function("document", findScript)({ getElementById: (i) => fNodes[i] });
  fNodes.q.value = "6.5143";
  fNodes.q.oninput();
  assert.equal(findTrs[0].hidden, false, "searching a SUPERSEDED value must reveal the row that replaced it");
  assert.equal(findTrs[1].hidden, true, "and must hide every row that has nothing to do with it");

  // --- Value-vs-text change labelling, added 2026-08-24. Both KP-78 answers, on the shape that
  // caused it. Upstream escaped a backslash in six pages, two pinned rows changed byte-wise, no
  // number moved, and the page dated both to that day in the same words it uses for a record
  // movement. These assertions are what stop that wording coming back.
  const rowAt = (bound, tail) => `| ${bound} | ${tail} |`;

  // FIRES: the bound cell's numerals changed, so this is a value change.
  assert.equal(
    changeKind(rowAt("$2.371339$", "[Prev2024]"), rowAt("$2.371177$", "[Prev2024]")),
    "value",
    "a changed bound must read as a value change"
  );

  // SILENT: escaping around the mathematics moved and no numeral did — 2026-08-24's actual case.
  assert.equal(
    changeKind(rowAt("$3$", "$d^*(C_n^3)$"), rowAt("$3$", "$d^\*(C_n^3)$")),
    "text",
    "an escaping-only edit must read as a text edit, not a value change"
  );

  // The reason the comparison is confined to the FIRST cell, asserted so a future simplification to
  // whole-row comparison fails here rather than on the page. A changed citation year is not a moved
  // bound, and calling it one overclaims in the direction that misleads a reader.
  assert.equal(
    changeKind(rowAt("$857.567$", "[HMR2019] degree 8"), rowAt("$857.567$", "[HMR2019] degree 12")),
    "text",
    "a changed citation detail with a fixed bound must stay a text edit"
  );

  // A pin with no previous version gets no verdict at all — the honest answer, and separate from
  // the "first pinned" case, which is decided in changeFor where the parent read actually succeeded.
  assert.equal(changeKind(null, rowAt("$3$", "x")), null, "a pin with no prior version gets no verdict");

  // A non-pipe row falls back to comparing everything rather than nothing: comparing nothing would
  // silently report every such row as unchanged.
  assert.equal(boundCell("0.380868"), "0.380868", "a non-table row compares whole");
  assert.equal(boundCell("| $3$ | src |").trim(), "$3$", "a table row compares its first cell");

  // The three wordings a reader sees. The `first pinned` case is the page's single worst documented
  // misreading — 208 of 222 pins carry the bootstrap date, which is when tracking started and not a
  // day anything moved.
  assert.match(whenLabel("2026-08-23", "value"), /^value changed 2026-08-23$/, "value wording");
  assert.match(whenLabel("2026-08-24", "text"), /bound unchanged$/, "text wording must say the bound held");
  assert.match(whenLabel("2026-07-24", "first"), /^first pinned 2026-07-24 — unchanged since$/, "first-pinned wording");
  assert.match(whenLabel("2026-08-01", null), /^last changed 2026-08-01$/, "an unknown kind keeps the neutral wording");

  // Both document links a reader can click must land on something that RENDERS. Fires when either
  // reverts to a raw/relative form; silent on the blob form. The pass-through leg matters as much as
  // the rewrite: readable() is display-only and must not touch a hand claim's arbitrary URL.
  assert.equal(readable("https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants/1a.md"),
    "https://github.com/teorth/optimizationproblems/blob/main/constants/1a.md", "raw source URL must become the rendered blob view");
  assert.equal(readable("https://en.wikipedia.org/wiki/Chromatic_number"),
    "https://en.wikipedia.org/wiki/Chromatic_number", "a non-raw URL passes through untouched");
  assert.equal(readable(null), null, "a row with no pinned URL must not crash the transform");
  assert.ok(!/href="ledger\/teorth-optimizationproblems/.test(html),
    "the constant-name link must not point at the Pages-served .md, which browsers show as raw text");
  assert.ok(!/href="https:\/\/raw\.githubusercontent\.com[^"]*">source/.test(html),
    "the source link must not hand a reader the checker's raw URL");
  assert.equal((html.match(/href="https:\/\/github\.com\/u00dxk2\/bounds-ledger\/blob\/main\/ledger\/[^"]*">/g) || []).length, rows.length,
    "every row's name must link to our mirror copy in a form that renders");
  assert.ok(html.includes('href="https://github.com/teorth/optimizationproblems/blob/main/constants/10a.md">source'),
    "a raw-URL row must render its source link as the blob view");
  assert.ok(html.includes('href="https://example.invalid/2a.md">source'),
    "a non-raw URL must reach the page untouched — readable() is a rewrite, not a rule about hosts");

  // Every generated page must be reachable FROM the table. We shipped 114 of them on 2026-09-02
  // with nothing linking to them, which is the same as not shipping them. The per-id loop is also
  // the wrong-row control: a template that emitted one constant's href on every row would satisfy
  // the count assertion and fail here.
  assert.equal((html.match(/href="c\/[^"]+\.html"/g) || []).length, rows.length,
    "every row must link to its own constant page, or the pages are unreachable from the table");
  for (const id of [...html.matchAll(/<tr id="c-([^"]+)"/g)].map((m) => m[1])) {
    assert.ok(html.includes(`href="c/${id}.html"`),
      `row ${id} must link to c/${id}.html, not to another row's page`);
  }

  // Self-contained: no third-party asset can be fetched at render time.
  const externals = html.match(/(?:src|href)="https?:\/\/[^"]+"/g) || [];
  const badHost = externals.filter((h) => !/github\.com|example\.invalid/.test(h));
  assert.deepEqual(badHost, [], `page must fetch nothing at runtime; found ${badHost.join(", ")}`);

  console.log("render-site selftest: PASS (renders names, both pinned rows and the upstream sha; marks a missing side 'not pinned'; ids sort numerically and exclude hand claims; never asserts a record — checked after proving the page is non-empty; table content is escaped not injected; every row carries its own prefilled report link, with a hostile constant name percent-encoded before attribute-escaping and no raw markup reaching the href; no third-party asset referenced; a row publishes the LATER of its two dates as a sort key, an undated row publishes an empty one rather than a guess, and the page's own reorder script, extracted and executed against a stub DOM, puts newest first, undated last, and restores id order; a search matching nothing reveals an empty state that quotes the term back as TEXT and prefills a report link with it, and hides again on a match; a changed bound reads as a value change while an escaping-only edit and a changed citation detail both read as text edits with the bound held, a pin with no prior version gets no verdict, and all four reader-facing wordings are pinned; every row carries a c-prefixed id and a permalink that targets that row's OWN id in document order, with the landed row visibly marked; the filter haystack carries current AND previously-pinned bound values so a truncated stale citation matches, a row with no earlier pin contributes no phantom value, it also carries every value cell in the constant's mirrored tables — proven on a fixture where a value two rows above the pinned one is extracted while separators, headers and prose outside the table are not, and proven ABSENT from the visible page — the attribute is read back OUT of the rendered row rather than re-derived, a previously-pinned value is proven searchable and proven ABSENT from the visible page, and the page's own filter script, extracted and executed against the emitted attribute, reveals the right row and hides the rest; a row we filed an upstream report against discloses it and links the report, an unfiled row carries none and the count drops to zero when the record is emptied, the label reads open with no date for an open report, a neighbouring id inherits nothing, a hostile url reaches the page escaped, and neither the disclosure nor its explanatory prose claims our report caused anything; every row links to its OWN constant page, so a one-href-fits-all template passes the count and fails the per-id check; and every row's citation hands out that constant's canonical c/<id>.html address while the in-table anchor is proven absent from the cite blocks and proven still present as the row permalink, so the two address forms cannot swap jobs)");
}

// Entry-point guard — review finding F2. Without it, ANY importer of renderHtml/buildRows runs the
// selftest or WRITES index.html as an import side effect. Latent today because nothing imports this
// module, but the defect class is proven live in this codebase: the commit that introduced this
// file also had to add this same guard to lookup.mjs after import-executes-CLI bit it, and the new
// module repeated the shape it had just fixed. Guarding it now rather than after it bites twice.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
const isMain = entry === import.meta.url;

if (isMain) {
  if (process.argv.includes("--selftest")) {
    await selftest();
  } else {
    const claims = JSON.parse(readFileSync(join(ROOT, "ledger", "claims.json"), "utf8"));
    const manifest = JSON.parse(readFileSync(join(ROOT, "ledger", "teorth-optimizationproblems", "manifest.json"), "utf8"));
    // The date shown is the MIRROR's fetch date, not "now". Two reasons, and the second is the
    // load-bearing one. (1) It is what the reader actually needs: the page reflects upstream as of
    // when we fetched it, not as of when the HTML was rendered. (2) "now" would make `--check` fail
    // the day after any regeneration — a permanently-red alarm, which carries as much information
    // as a permanently-green one and is this repo's founding defect. Keyed to fetchedAt, the page is
    // stable until the mirror itself moves, which is exactly when it SHOULD be regenerated.
    const on = String(manifest.fetchedAt || "").slice(0, 10) || "an unrecorded date";
    const manualCount = (claims.claims || claims).filter((c) => c.manual === true).length;
    const html = renderHtml(buildRows(claims), manifest, on, manualCount);

    if (process.argv.includes("--check")) {
      let current = "";
      try { current = readFileSync(OUT, "utf8"); } catch { /* missing counts as stale */ }
      if (current.replace(/\r\n/g, "\n") !== html.replace(/\r\n/g, "\n")) {
        console.error("RESULT: FAIL — index.html is stale. Re-run `node scripts/render-site.mjs` and commit it.");
        process.exit(1);
      }
      console.log(`RESULT: PASS — index.html matches committed state (${buildRows(claims, { withDates: false }).length} constants @ ${String(manifest.sha).slice(0, 7)})`);
    } else {
      writeFileSync(OUT, html);
      console.log(`wrote index.html — ${buildRows(claims, { withDates: false }).length} constants @ ${String(manifest.sha).slice(0, 7)}`);
    }
  }
} else if (process.argv[1]?.endsWith("render-site.mjs")) {
  console.error("render-site: COULD NOT RUN — invoked as main but module identity did not match");
  process.exit(2);
}
