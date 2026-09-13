#!/usr/bin/env node
// One static page per constant, at c/<id>.html, generated from the same ledger the table reads.
//
// WHY: until now the only way to point at a constant was `#c-<id>` — an anchor into a single
// long table. A citation could not name a page, a search engine had one document to index for
// every constant we watch, and a reader arriving on the anchor landed mid-table with no context
// for the row under their cursor. A per-constant URL makes the row citable and findable.
//
// WHAT IT DOES NOT DO, and this is the same refusal the table makes: it asserts no record. The
// pins are LAST-LISTED table rows, a listing position, and every page says so in those words.
// It also renders no previously-pinned value as a from-to pair — a current value beside a former
// one is a movement claim whatever noun sits in the sentence (refuted 2026-09-01 on Brun's
// constant, where upstream APPENDED a conditional row below an unconditional one).
//
// ponytail: flat files, no router, no index of its own — the table already is the index, and the
// pages are small enough that 114 of them cost nothing. Revisit if the mirror grows an order of
// magnitude.

import { writeFileSync, readFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { buildRows, flagUrl, citation, reportLabel, whenLabel } from "./render-site.mjs";
import { boundCell } from "./lookup.mjs";
import crypto from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTDIR = join(ROOT, "c");
const REPO = "https://github.com/u00dxk2/bounds-ledger";
const SITE = "https://u00dxk2.github.io/bounds-ledger/";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const STYLE = `:root{--ink:#111;--muted:#666;--line:#ddd;--code:#f6f6f6;--accent:#0b5fff}
*{box-sizing:border-box}body{margin:0;padding:1.5rem 1.25rem 3rem;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:var(--ink);max-width:52rem;margin-inline:auto}
a{color:var(--accent)}h1{font-size:1.4rem;line-height:1.3;margin:.2rem 0 .1rem}
.id{font:13px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted)}
.back{font-size:.85rem;display:inline-block;margin-bottom:1.2rem}
dl{margin:1.4rem 0;padding:0}dt{font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-top:1.1rem}
dd{margin:.35rem 0 0}code{display:block;background:var(--code);padding:.6rem .7rem;font-size:.85rem;overflow-x:auto;white-space:pre-wrap;word-break:break-word}
.when{display:block;font-size:.8rem;color:var(--muted);margin-top:.3rem}
.sel{color:var(--muted);font-size:.85rem}
.none{color:var(--muted)}
ul.audit{margin:.35rem 0 0;padding-left:1.1rem}ul.audit li{margin:.2rem 0}
.ours{display:inline-block;margin-top:.6rem;font-size:.85rem}
.actions{margin:1.6rem 0;padding-top:1rem;border-top:1px solid var(--line);font-size:.9rem}
.cite code{user-select:all;margin-top:.5rem}
footer{margin-top:2rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}`;

/**
 * A-47 depth audit, surfaced. Until now a reader could see what we MIRROR and never what we have
 * CHECKED. Those are different claims and only one of them takes work: mirroring is byte-fidelity,
 * checking means somebody opened the cited paper and read it against the row.
 *
 * THE DENOMINATOR IS THE HONEST HALF, and it is load-bearing rather than decoration. A block that
 * showed verdicts without the ratio would read as "this ledger is verified", which is exactly the
 * coverage claim the audit is instructed NOT to manufacture before the auditing exists. Both the
 * numerator and the denominator come from the store; neither is typed on this page.
 */
export function loadAudits() {
  try {
    const s = JSON.parse(readFileSync(join(ROOT, "continuity", "depth-audit.json"), "utf8"));
    const audits = Array.isArray(s.audits) ? s.audits : [];
    // COMPUTED HERE AND OVERWRITTEN ON EVERY ENTRY, so a stored `inMirror: true` can never assert it.
    for (const a of audits) {
      if (a && typeof a === "object") a.inMirror = mirrorHas(a.rowFile, a.rowLine, a.rowText);
    }
    return { audits, corpus: s.meta?.corpus || null };
  } catch {
    // No store, or an unreadable one: the pages render exactly as they did before this existed.
    // An audit block is ADDITIVE, so its absence must never take a constant page down with it.
    return { audits: [], corpus: null };
  }
}

/**
 * VERDICTS ARE AN ALLOWLIST, and an unknown one is DROPPED rather than printed. Adversarial review
 * 2026-09-10 demonstrated the alternative: a store value of "VERIFIED BEST KNOWN BOUND" was emitted
 * verbatim onto a public constant page — the exact claim this file forbids — because the old code
 * fell back to `VERDICT_PROSE[v] || v`. The store is ours, but a renderer that trusts its input to
 * be well-formed is one bad row away from publishing a record claim in this lane's name.
 *
 * LINK TEXT IS PER VERDICT, because "the source we read" beside UNREACHABLE contradicts itself.
 */
/**
 * A VALUE IS SHOWN ONLY WHEN IT IS PROVABLY THE ROW THAT WAS AUDITED AND THAT ROW STILL STANDS.
 * Adversarial review, 2026-09-13: printing the stored rowText's first cell beside "supports this row"
 * trusted the store completely — an entry edited to $9.999999$ with its hash left alone rendered that
 * number as a supported bound, and non-table text or a comment-only cell came through wholesale.
 * Three independent conditions, each able to fail on its own: the text is a table row; its hash is
 * the one recorded when it was audited; and the identical line is still in the mirror today. Any one
 * failing shows NO value — the verdict line still renders, because the reading happened; only the
 * number is withheld, since we can no longer say it is the number that was read.
 */
const MIRROR_PREFIX = "ledger/teorth-optimizationproblems/constants/";
/**
 * THE AUDITED ROW, AT THE AUDITED LINE — not the audited text anywhere in the file (adversarial
 * review round 2, 2026-09-13). The first version searched every line, so changing 1b:23 while the old
 * text survived under a historical note left the check passing and printed the OLD value beside the
 * NEW row. Identity is the recorded location plus the recorded text; an upstream insertion that moves
 * the row is correctly read as "cannot prove it", never guessed at.
 */
export function mirrorHas(rowFile, rowLine, rowText, root = ROOT) {
  if (typeof rowFile !== "string" || typeof rowText !== "string") return false;
  if (!Number.isInteger(rowLine) || rowLine < 1) return false;
  if (!rowFile.startsWith(MIRROR_PREFIX) || rowFile.includes("..")) return false;
  const want = rowText.trim();
  if (!want) return false;
  try {
    const line = readFileSync(join(root, rowFile), "utf8").split(/\r?\n/)[rowLine - 1];
    return typeof line === "string" && line.trim() === want;
  } catch {
    return false;
  }
}

/** Is this audit PROVABLY about the row that stands at its recorded line today? */
export function identityVerified(a) {
  if (!a || typeof a.rowText !== "string" || typeof a.rowTextSha256 !== "string") return false;
  const t = a.rowText.trim();
  if (!t.startsWith("|")) return false;
  const sha16 = crypto.createHash("sha256").update(t, "utf8").digest("hex").slice(0, 16);
  if (sha16 !== a.rowTextSha256) return false;
  return a.inMirror === true;
}

export function verifiedValue(a) {
  return identityVerified(a) ? boundCell(a.rowText.trim()).replace(/<!--[\s\S]*?-->/g, "").trim() : "";
}

/**
 * A PINNED bound-row audit whose identity can no longer be proved is HISTORICAL (round 2's second
 * finding): the reading happened, but on a version of the table that is not the one a reader sees, so
 * the page must neither link the live line nor say the source "supports this row", and it is not
 * counted as a read. Review round 3 closed the gap this left: an audit with NO stored rowText cannot
 * prove identity either, so it is historical too — no identity, no live link, no support claim, no count.
 */
const isStale = (a) => a.leg === "value-vs-source" && !identityVerified(a);

const VERDICT_PROSE = {
  SOUND: { text: "the cited source was read and it supports this row", link: "the source we read" },
  DEFECTIVE: { text: "the cited source was read and it does NOT support this row", link: "the source we read" },
  UNRESOLVED: { text: "the cited source was reached but could not settle the question", link: "the source we reached" },
  UNREACHABLE: { text: "the cited source could not be read at all", link: "the source we could not read" },
};

/** What each audit leg actually examined. A reference entry is NOT a bound row. */
const LEG_LABEL = { "value-vs-source": "bound row", "citation-well-formed": "reference entry" };

/**
 * HOW THE ROW WAS CHOSEN, which decides what its count can mean. A row drawn by position before
 * anybody read it can accumulate into a coverage figure; a row chosen BECAUSE something already
 * looked wrong cannot — the set is selected on the outcome, so it carries no rate. The store has
 * said this in prose since 2026-09-10 and the PAGE said nothing, so a reader saw one undifferentiated
 * count with two suspicion-drawn rows inside it. Added 2026-09-13 with slice 4.
 *
 * AN ENTRY WITH NO `selection` COUNTS AS SUSPICION, never as systematic: the unlabelled direction
 * has to be the one that understates coverage rather than the one that flatters it.
 */
const SELECTION_PROSE = {
  systematic: "drawn by position before it was read",
  suspicion: "chosen because something already looked wrong",
};
const isSystematic = (a) => a.selection === "systematic";
const selectionNote = (a) => SELECTION_PROSE[isSystematic(a) ? "systematic" : "suspicion"];

/** Only http(s) reaches the page: `javascript:` survives attribute escaping and stays executable. */
export function safeUrl(u) {
  try {
    const p = new URL(String(u));
    return p.protocol === "http:" || p.protocol === "https:" ? p.href : null;
  } catch { return null; }
}

/**
 * A row reaches the page only if EVERY field it renders is a well-formed string. Type checks are
 * not defensive habit here: adversarial review 2026-09-10 reproduced `sourceRead: {toString: null}`
 * throwing inside escaping and aborting generation of ALL 115 pages, and the same shape in `verdict`
 * throwing during property lookup. One malformed row must never take the published site down.
 */
export function usableAudit(a) {
  return !!a && typeof a === "object"
    && typeof a.constant === "string"
    && typeof a.citedRef === "string"
    && typeof a.verdict === "string"
    && Object.prototype.hasOwnProperty.call(VERDICT_PROSE, a.verdict)
    && (a.leg === undefined || typeof a.leg === "string")
    && (a.sourceRead === undefined || typeof a.sourceRead === "string")
    && safeUrl(a.source) !== null;
}

/**
 * THE SOURCE WAS ACTUALLY READ for these three verdicts. UNREACHABLE is the one that means we never
 * got to it, and counting it as read was a self-contradiction the page printed in one breath:
 * "the cited source could not be read at all" beside "1 bound row(s) here have been read against
 * their cited source". A count of attempts presented as a count of readings overstates the work,
 * which is the defect this whole block exists to avoid.
 */
const READ_VERDICTS = new Set(["SOUND", "DEFECTIVE", "UNRESOLVED"]);

/**
 * A row IDENTITY, so a recheck of the same row does not read as a second row audited. The store
 * pins each audit to a file and line with a hash of the row text; falling back to the citation
 * would merge genuinely different rows, so an unpinned audit keeps its own id and counts once.
 */
function rowKey(a) {
  if (typeof a.rowTextSha256 === "string" && a.rowTextSha256) return `${a.constant}|${a.rowTextSha256}`;
  if (typeof a.rowFile === "string" && Number.isInteger(a.rowLine)) return `${a.rowFile}:${a.rowLine}`;
  return `id|${a.id}`;
}

function rowLink(a) {
  if (typeof a.rowFile !== "string" || !Number.isInteger(a.rowLine)) return "";
  const href = `${REPO}/blob/main/${a.rowFile.split("/").map(encodeURIComponent).join("/")}#L${a.rowLine}`;
  return ` <a href="${esc(href)}">line ${esc(String(a.rowLine))}</a>`;
}

/**
 * The audit block for ONE constant. Empty string when nothing usable here has been audited.
 *
 * THE COUNTS SEPARATE POPULATIONS, because the denominator does. 543 counts CITED BOUND ROWS, so
 * only `value-vs-source` audits may be measured against it; a reference-entry check is real work and
 * a different population. It also counts DISTINCT rows actually READ — not audit entries, and not
 * attempts. Every one of those three distinctions was a way to overstate the work, and every one of
 * them landed in the sentence describing our own method, which is where this lane's defects live.
 */
export function auditBlock(id, store) {
  const all = (Array.isArray(store?.audits) ? store.audits : []).filter(usableAudit);
  const mine = all.filter((a) => a.constant === id);
  if (mine.length === 0) return "";

  const items = mine.map((a) => {
    const v = VERDICT_PROSE[a.verdict];
    const leg = LEG_LABEL[a.leg];
    // THE VALUE IS THE THING CHECKED (orchestrator P3 ack, 2026-09-13): the page named the line and
    // the citation but not the number, so three of 1b's four audited values appeared nowhere in the
    // served HTML. It is the row's own first cell, read from the stored rowText — never retyped, never
    // recomputed — only for a bound row, and only when verifiedValue can prove it is the audited row
    // and that row still stands in the mirror.
    const value = leg === "bound row" ? verifiedValue(a) : "";
    const shown = value ? ` <code style="display:inline;padding:.1rem .3rem">${esc(value)}</code>` : "";
    // A pinned audit whose identity can no longer be proved keeps its reading but loses the live line
    // link and the support claim — a reader must never be pointed at a row nobody read.
    const stale = isStale(a);
    const what = leg ? `${esc(leg)}${shown}${leg === "bound row" && !stale ? rowLink(a) : ""} citing ` : "";
    const note = a.sourceRead ? ` (${esc(a.sourceRead)})` : "";
    const verdictText = stale
      ? (READ_VERDICTS.has(a.verdict) ? "this row was read against its cited source on an earlier version of the table, and the row at that line has since changed or cannot be matched, so this verdict says nothing about the row there now" : "a check of this row was attempted on an earlier version of the table and the cited source could not be read; the row at that line has since changed or cannot be matched, so nothing is said about the row there now")
      : v.text;
    return `<li>${what}<code style="display:inline;padding:.1rem .3rem">[${esc(a.citedRef)}]</code> &mdash; ` +
      `${esc(verdictText)}. <a href="${esc(safeUrl(a.source))}">${esc(v.link)}</a>${note}. ` +
      `<span class="sel">Selected: ${esc(selectionNote(a))}.</span></li>`;
  }).join("");

  // A STALE audit (pinned, identity no longer provable) was read on an earlier version of the table,
  // so it is not a reading of the row a reader sees today and is never counted as read.
  const isBoundRead = (a) => a.leg === "value-vs-source" && READ_VERDICTS.has(a.verdict) && !isStale(a);
  const countRows = (rows) => new Set(rows.map(rowKey)).size;
  /**
   * PARTITION BY ROW, THEN BY SELECTION — never the other way round (adversarial review, 2026-09-13).
   * Counting each selection's rows independently let ONE row audited twice, once by position and once
   * on suspicion, enter both groups: the page printed "1 bound row(s) here" split into "1 drawn by
   * position, 1 chosen because…", which both inflates the work and contradicts itself. A distinct row
   * counts as systematic if ANY of its readings was drawn by position — that is a true statement about
   * how the ladder reached it — and the two groups therefore always sum to the deduplicated count.
   */
  const splitRows = (rows) => {
    const byRow = new Map();
    for (const a of rows.filter(isBoundRead)) {
      byRow.set(rowKey(a), (byRow.get(rowKey(a)) || false) || isSystematic(a));
    }
    const systematic = [...byRow.values()].filter(Boolean).length;
    return { total: byRow.size, systematic, suspicion: byRow.size - systematic };
  };
  const here = splitRows(mine);
  const ledger = splitRows(all);
  const boundHere = here.total;
  const sysHere = here.systematic;
  const susHere = here.suspicion;
  const sysAll = ledger.systematic;
  const susAll = ledger.suspicion;
  const unreachedHere = new Set(mine.filter((a) => a.leg === "value-vs-source" && !READ_VERDICTS.has(a.verdict) && !isStale(a)).map(rowKey)).size;
  const otherHere = new Set(mine.filter((a) => a.leg !== "value-vs-source").map(rowKey)).size;

  const cited = store?.corpus?.citedRows;
  const citedOk = Number.isSafeInteger(cited) && cited >= 0;
  const when = typeof store?.corpus?.measuredAt === "string" ? store.corpus.measuredAt : null;

  const parts = [];
  if (boundHere > 0) {
    const split = `${boundHere} bound row(s) here have been read against their cited source (${sysHere} drawn by position, ${susHere} chosen because something already looked wrong).`;
    parts.push(citedOk
      ? `${split} Across this whole ledger ${sysAll} row(s) were drawn by position, against ${esc(String(cited))} rows that name a source${when ? `, counted on ${esc(when)}` : ""}; ${susAll} more were chosen for suspicion and are counted apart, because a set selected for suspicion carries no rate.`
      : `${split} Across this whole ledger ${sysAll} row(s) were drawn by position and ${susAll} were chosen for suspicion. The size of the corpus they came from is not recorded, so this is a count and not a proportion.`);
  }
  if (unreachedHere > 0) {
    parts.push(`${unreachedHere} further bound row(s) here were attempted and the source could NOT be read; those are not counted as read.`);
  }
  if (otherHere > 0) {
    const n = `${otherHere} reference entr${otherHere === 1 ? "y" : "ies"}`;
    const verb = otherHere === 1 ? "was" : "were";
    parts.push(boundHere > 0
      ? `${n} here ${verb} also checked; those are not bound rows and are not counted against that figure.`
      : countRows(mine.filter(isStale)) > 0 ? `${n} here ${verb} checked. That is a citation check, not a bound row, and no bound row of this constant has been verified against the current table.` : `${n} here ${verb} checked. That is a citation check, not a bound row, so no bound row of this constant has been read against its source yet.`);
  }
  const staleHere = countRows(mine.filter(isStale));
  if (staleHere > 0) {
    parts.push(`${staleHere} audited bound row(s) here no longer match the current table at the line they were checked against; those verdicts describe an earlier version and are not counted.`);
  }
  parts.push("A row not listed here has NOT been checked.");

  return `<dt>Read against its cited source</dt><dd><ul class="audit">${items}</ul><span class="when">${parts.join(" ")}</span></dd>`;
}

/** The one sentence every page owes, because a pinned row is a listing position and not a record. */
export const DISCLAIMER =
  "These are the LAST-LISTED rows of this constant's bounds table upstream — a listing position, not a statement that either bound is the strongest or most recent known. Upstream keeps superseded and inferior rows because the tables are histories. Read the source file before citing.";

function side(label, row, changed, kind) {
  if (!row) return `<dt>${esc(label)} bound</dt><dd class="none">not pinned</dd>`;
  const when = changed ? `<span class="when">${esc(whenLabel(changed, kind))}</span>` : `<span class="when">date unknown</span>`;
  return `<dt>${esc(label)} bound, last-listed row</dt><dd><code>${esc(row)}</code>${when}</dd>`;
}

/**
 * `pageCitation()` IS GONE (A-40, 2026-09-03) and its absence is the ship.
 *
 * It existed for two days as a `.replace()` that swapped the shared citation's table anchor for
 * this page's own URL, on the reasoning that "the table's shape is out of scope for this change".
 * That reasoning left the site handing out TWO addresses for one constant — the table's cite block
 * gave `#c-<id>` while this page declared `c/<id>.html` canonical in a `<link rel=canonical>` two
 * lines from the same citation. A ledger whose product is citation accuracy cannot publish a
 * second-best address for its own records, so `citation()` now emits the canonical page URL itself
 * and both surfaces quote the same block, byte for byte. One object, one address.
 */

export function renderPage(r, sha, audits = loadAudits()) {
  const upstream = `${REPO}/blob/main/ledger/teorth-optimizationproblems/constants/${encodeURIComponent(r.id)}.md`;
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(r.title)} (${esc(r.id)}) — Bounds Ledger</title>
<meta name="description" content="${esc(`What this ledger has pinned for ${r.title}, mirrored from teorth/optimizationproblems at ${String(sha).slice(0, 7)}.`)}">
<link rel="canonical" href="${esc(`${SITE}c/${r.id}.html`)}">
<style>${STYLE}</style>
<a class="back" href="${esc(`${SITE}#c-${r.id}`)}">&larr; all constants</a>
<h1>${esc(r.title)}</h1>
<div class="id">${esc(r.id)}</div>
${r.report ? `<a class="ours" href="${esc(r.report.url)}">${esc(reportLabel(r.report))}</a>` : ""}
<dl>
${side("Upper", r.upper, r.upperChanged, r.upperKind)}
${side("Lower", r.lower, r.lowerChanged, r.lowerKind)}
${auditBlock(r.id, audits)}
</dl>
<div class="actions">
<a href="${esc(upstream)}">the mirrored file</a> &middot;
<a href="${esc(r.url || upstream)}">upstream source</a> &middot;
<a href="${esc(flagUrl(r, sha))}">looks wrong?</a>
</div>
<div class="cite"><strong>Cite this row</strong><code>${esc(citation(r, sha))}</code></div>
<footer><p>${esc(DISCLAIMER)}</p>
<p>Mirrored from <code style="display:inline;padding:.1rem .3rem">teorth/optimizationproblems@${esc(String(sha).slice(0, 7))}</code> — a snapshot at that commit, not a live read.</p></footer>
</html>`;
}

function selftest() {
  const claims = [
    { id: "pin:9z:U", statement: "Last-listed upper-bound table row for Test Constant (9z.md)", url: "https://example.invalid/9z.md", expect: "| 2.5 |" },
    { id: "pin:9z:L", statement: "Last-listed lower-bound table row for Test Constant (9z.md)", url: "https://example.invalid/9z.md", expect: "| 1.5 |" },
  ];
  const [row] = buildRows(claims, { withDates: false, reports: [] });
  const html = renderPage(row, "abc1234def");

  // Positive control BEFORE any absence is asserted.
  assert.ok(html.length > 800, "positive control: the page must render before anything is asserted absent");
  assert.match(html, /Test Constant/);
  assert.match(html, /\| 2\.5 \|/);
  assert.match(html, /\| 1\.5 \|/);
  assert.match(html, /abc1234/, "the page must name the upstream sha it is a snapshot of");
  assert.match(html, /canonical/, "each page needs a canonical URL or duplicates compete in search");

  // It must NEVER assert a record. This is the table's refusal, carried to the page.
  assert.ok(html.includes("listing position"), "the page must say its pins are a listing position");
  for (const forbidden of [/\brecord\b(?!ed)/i, /strongest known/i, /best known bound/i]) {
    const body = html.replace(DISCLAIMER, "");
    assert.ok(!forbidden.test(body), `a constant page must not claim a record — matched ${forbidden}`);
  }

  // The cite block names THIS PAGE, not the table anchor — the whole point of the page. Both
  // polarities: the page URL is present AND the anchor form is proven absent, because a citation
  // carrying both would still send readers to the table.
  // Scoped to the CITE BLOCK, not the whole page: the "all constants" back-link at the top uses
  // the table anchor on purpose, so a page-wide absence assertion fails on a correct page. The
  // first draft of this test did exactly that and caught itself.
  const citeBlock = html.match(/<div class="cite">.*?<\/div>/s)[0];
  assert.match(citeBlock, /bounds-ledger\/c\/9z\.html/, "the page's cite block must cite the page, not the table row");
  assert.ok(!citeBlock.includes(`${SITE}#c-9z`), "the table anchor must not survive in the page's citation");
  assert.match(html, new RegExp(`href="${SITE}#c-9z"`), "positive control: the back-link DOES use the anchor, so the absence above is about the cite block alone");
  // A-40: the SHARED citation now carries the canonical page URL, so this page quotes it unmodified
  // and the table quotes the same bytes. Asserted here as well as in render-site's own suite, on
  // purpose: this file is where the divergence was introduced, so this is where a reintroduction
  // would be silent. If someone re-adds a local substitution, the equality below fails.
  assert.ok(
    citeBlock.includes(esc(citation(row, "abc1234def"))),
    "the page must quote the shared citation unchanged — one object, one address, on both surfaces",
  );
  assert.ok(citation(row, "abc1234def").includes(`${SITE}c/9z.html`),
    "the shared citation itself must carry the canonical page URL, not a form this file patches afterwards");

  // A missing side reads as "not pinned" rather than vanishing.
  const [oneSided] = buildRows([claims[0]], { withDates: false, reports: [] });
  const oneHtml = renderPage(oneSided, "abc1234def");
  assert.match(oneHtml, /not pinned/, "a constant with one pinned side must say the other is not pinned");

  // Escaping: a hostile title reaches the page as text, and the id is URL-encoded into hrefs
  // before attribute-escaping — the same ordering the table's own selftest pins.
  const hostile = [{ id: "pin:9z:U", statement: 'Last-listed upper-bound table row for Tea & "q" <b>x</b> (9z.md)', url: "https://example.invalid/9z.md", expect: "| 1 |" }];
  const [hostileRow] = buildRows(hostile, { withDates: false, reports: [] });
  const hostileHtml = renderPage(hostileRow, "abc1234def");
  assert.ok(hostileHtml.length > 800, "positive control: the hostile page must render before any absence is asserted");
  assert.ok(!/<b>x<\/b>/.test(hostileHtml), "a constant name carrying markup reached the page unescaped");

  // Negative control on the escaping assertion: the RAW title does contain the markup, so the
  // check above is testing the renderer rather than passing on an input that never had it.
  assert.match(hostile[0].statement, /<b>x<\/b>/);

  // ---- A-47 audit block. ASSERTION ORDER IS DELIBERATE (2026-09-06): the guards carrying the
  // MEANING come first, any exact string pin last, so a mutation names the property it broke.
  //
  // EVERY CASE BELOW EXISTS BECAUSE AN ADVERSARIAL REVIEW BROKE THE FIRST VERSION (2026-09-10).
  // It demonstrated three mutations that passed the whole suite — a hardcoded denominator, the
  // source anchor replaced by a span, and "Verified best known bound" inside the block — plus
  // hostile store values reaching executable HTML. The worst was structural: the no-record
  // prohibition ran ONLY on the unaudited fixture, so the guard could not see the surface the
  // audit block had just added. That is this lane's founding defect in a new place.
  const pinId = (text) => ({ rowText: text, rowTextSha256: crypto.createHash("sha256").update(text.trim(), "utf8").digest("hex").slice(0, 16), inMirror: true });
  const store = {
    audits: [
      { id: "T-1", constant: "9z", citedRef: "REF1", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/p1", sourceRead: "read in the abstract", selection: "systematic", ...pinId("| $5.555555$ | [REF1] | x |") },
      { id: "T-2", constant: "9z", citedRef: "REF2", leg: "citation-well-formed", verdict: "UNRESOLVED", source: "https://example.invalid/p2", sourceRead: "read in the body", selection: "systematic" },
      { id: "T-3", constant: "OTHER", citedRef: "REF3", leg: "value-vs-source", verdict: "DEFECTIVE", source: "https://example.invalid/p3", sourceRead: "read in the abstract", selection: "systematic", ...pinId("| $6.555555$ | [REF3] | x |") },
    ],
    // Deliberately NOT 543: a fixture equal to the live figure cannot tell a rendered
    // denominator from a hardcoded one.
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  };
  const audited = renderPage(row, "abc1234def", store);

  assert.ok(audited.length > 800, "positive control: the audited page must render before anything is asserted about it");

  // (a) THE PROHIBITION APPLIES TO THE AUDITED PAGE. This is the assertion whose absence the
  //     review called out: the block is new surface, and the no-record rule must reach it.
  for (const forbidden of [/\brecord\b(?!ed)/i, /strongest known/i, /best known bound/i]) {
    assert.ok(!forbidden.test(audited.replace(DISCLAIMER, "")),
      `the AUDITED page must not claim a record either — matched ${forbidden}`);
  }
  // ...and an unknown verdict is DROPPED, never printed, which is how a store row could smuggle
  //     such a claim onto the page in the first place.
  const smuggle = renderPage(row, "abc1234def", {
    audits: [{ id: "T-X", constant: "9z", citedRef: "REF9", leg: "value-vs-source", verdict: "VERIFIED BEST KNOWN BOUND", source: "https://example.invalid/x" }],
    corpus: { citedRows: 999 },
  });
  assert.ok(!/best known bound/i.test(smuggle), "an unrecognised verdict must never reach the page verbatim");
  assert.ok(!smuggle.includes("Read against its cited source"), "a store of only unusable rows must render no block at all");

  // (b) MEANING: the verdict is stated in words, and the link text matches the verdict — "the
  //     source we read" beside UNREACHABLE would contradict itself.
  assert.ok(audited.includes("the cited source was read and it supports this row"), "a SOUND row must say what was done");
  assert.ok(audited.includes("the cited source was reached but could not settle the question"), "UNRESOLVED must read as its own outcome");
  const unreach = renderPage(row, "abc1234def", { audits: [{ id: "T-U", constant: "9z", citedRef: "R", leg: "value-vs-source", verdict: "UNREACHABLE", source: "https://example.invalid/u", ...pinId("| $7.555555$ | [R] | x |") }], corpus: { citedRows: 999 } });
  assert.ok(!/>the source we read</.test(unreach), "an UNREACHABLE row must not offer 'the source we read'");
  assert.ok(unreach.includes("the source we could not read"), "positive control: UNREACHABLE has its own link text");

  // (c) MEANING: the source is a real anchor pointing at the stored URL — a span containing the
  //     text would satisfy a substring check while giving the reader nothing to click.
  assert.match(audited, /<a href="https:\/\/example\.invalid\/p1">the source we read<\/a>/,
    "each audited row must link its source as an anchor whose href IS that source");

  // (d) MEANING: only http(s) is rendered. `javascript:` survives attribute escaping.
  const hostileUrl = renderPage(row, "abc1234def", { audits: [{ id: "T-J", constant: "9z", citedRef: "R", leg: "value-vs-source", verdict: "SOUND", source: "javascript:alert(1)" }], corpus: { citedRows: 999 } });
  assert.ok(!/javascript:/i.test(hostileUrl), "a javascript: source must never reach the published page");
  assert.ok(!hostileUrl.includes("Read against its cited source"), "a row whose only source is unusable is dropped, not rendered link-less");

  // (e) MEANING: hostile store text is escaped rather than interpolated as markup.
  const hostileStore = renderPage(row, "abc1234def", {
    audits: [{ id: "T-H", constant: "9z", citedRef: '<img src=x onerror=alert(1)>', leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/h", sourceRead: '<b>note</b>' }],
    corpus: { citedRows: 999 },
  });
  assert.ok(hostileStore.includes("Read against its cited source"), "positive control: the hostile-store page DID render a block, so the absences below are real");
  assert.ok(!/<img src=x/.test(hostileStore), "a hostile citedRef reached the page as markup");
  assert.ok(!/<b>note<\/b>/.test(hostileStore), "a hostile sourceRead reached the page as markup");

  // (f) MEANING: a malformed entry must not take all 115 pages down with it.
  const withNull = renderPage(row, "abc1234def", { audits: [null, store.audits[0]], corpus: { citedRows: 999 } });
  assert.ok(withNull.includes("Read against its cited source"), "a null entry beside a good one must not abort rendering");

  // (g) MEANING, and the one that keeps this honest: it must never read as coverage. The
  //     denominator is RENDERED FROM THE STORE (999 here, not the live 543) and the not-checked
  //     disclaimer is present.
  assert.ok(audited.includes("999"), "the denominator must come from the store, not be hardcoded on the page");
  assert.ok(!audited.includes("543"), "a fixture denominator of 999 must not render the live figure — that would prove the number is baked in");
  assert.ok(audited.includes("2026-01-02"), "the denominator must carry the date it was measured, or it goes stale in silence");
  assert.ok(audited.includes("has NOT been checked"), "the block must say plainly that unlisted rows are unchecked");

  // (h) MEANING: populations are not conflated. 543 counts cited BOUND ROWS, so a reference-entry
  //     check must be reported separately rather than folded into that ratio.
  assert.ok(/1 bound row\(s\) here/.test(audited), "bound rows are counted on their own against the bound-row denominator");
  assert.ok(/1 reference entry here was also checked/.test(audited), "a reference-entry check must be named as a different population");
  assert.ok(/ledger 2 row\(s\) were drawn by position/.test(audited), "the ledger-wide figure counts bound rows only (2 of the 3 fixtures), never every audit row");

  // (h2) THE EXTREME CASE, and the fixture above could not show it: a constant with a reference
  //      check and NO bound rows. The first version said "also checked ... not counted against
  //      that figure" while stating no figure at all, because both legs were always present in
  //      the fixture. Caught by reading the real 87a page, not the test.
  const refOnly = renderPage(row, "abc1234def", {
    audits: [{ id: "T-R", constant: "9z", citedRef: "R", leg: "citation-well-formed", verdict: "UNRESOLVED", source: "https://example.invalid/r" }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(refOnly.includes("Read against its cited source"), "positive control: the reference-only page renders a block");
  assert.ok(!/also checked/.test(refOnly), "with no bound rows there is no earlier figure for 'also' to refer back to");
  assert.ok(!/that figure/.test(refOnly), "a dangling 'that figure' points at a number the sentence never stated");
  assert.ok(/no bound row of this constant has been read against its source yet/.test(refOnly),
    "a reference-only constant must say plainly that none of its bound rows have been read");

  // (h3) EVERY VERDICT IS RENDERED ON THE TARGET CONSTANT AND ITS MEANING ASSERTED. The review
  //      showed DEFECTIVE prose could be reversed to say the source SUPPORTS the row and the suite
  //      still passed, because DEFECTIVE only ever appeared on the OTHER constant and so was never
  //      read. A verdict rendered somewhere the assertions cannot see is an unchecked verdict.
  const defective = renderPage(row, "abc1234def", {
    audits: [{ id: "T-D", constant: "9z", citedRef: "RD", leg: "value-vs-source", verdict: "DEFECTIVE", source: "https://example.invalid/d", ...pinId("| $8.555555$ | [RD] | x |") }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(defective.includes("does NOT support this row"),
    "DEFECTIVE must say the source does NOT support the row — reversing it silently inverts an audit outcome");
  assert.ok(!/ it supports this row/.test(defective), "DEFECTIVE must never render the SOUND sentence");

  // (h4) AN UNREACHABLE SOURCE WAS NOT READ, and the summary must not count it as read. The page
  //      previously printed "could not be read at all" beside "1 bound row(s) ... have been read".
  const unreadOnly = renderPage(row, "abc1234def", {
    audits: [{ id: "T-U2", constant: "9z", citedRef: "RU", leg: "value-vs-source", verdict: "UNREACHABLE", source: "https://example.invalid/u2", ...pinId("| $9.555555$ | [RU] | x |") }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(unreadOnly.includes("Read against its cited source"), "positive control: the unreachable-only page renders a block");
  assert.ok(!/have been read against their cited source/.test(unreadOnly),
    "a source that could not be read must not be counted as read");
  assert.ok(/attempted and the source could NOT be read/.test(unreadOnly),
    "an attempted-but-unreachable row must be disclosed as its own category");

  // (h5) A REPEAT AUDIT OF THE SAME ROW IS ONE ROW. Counting entries let a recheck inflate apparent
  //      coverage without examining any new material.
  const pinned = { constant: "9z", citedRef: "RP", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/p", rowFile: "ledger/x/9z.md", rowLine: 33, rowTextSha256: "abc123", ...pinId("| $3.333333$ | [RP] | x |") };
  const repeated = renderPage(row, "abc1234def", {
    audits: [{ ...pinned, id: "T-P1" }, { ...pinned, id: "T-P2" }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(/1 bound row\(s\) here/.test(repeated),
    "two audits of the SAME row are one row read — counting entries would inflate coverage on a recheck");
  assert.ok(!/2 bound row\(s\) here/.test(repeated), "negative control: the inflated count must not appear");

  // (h6) THE AUDITED ROW IS IDENTIFIED. On the live 10a page both bounds cite the same reference,
  //      so "supports this row" is ambiguous without the line the audit actually covered.
  assert.match(repeated, /<a href="[^"]*9z\.md#L33">line 33<\/a>/,
    "a pinned bound row must link the exact line it audited, or the reader cannot tell which bound was checked");

  // (h7) HOSTILE measuredAt is escaped — it reaches the page like any other store string.
  const hostileWhen = renderPage(row, "abc1234def", {
    audits: [{ ...pinned, id: "T-W" }],
    corpus: { citedRows: 999, measuredAt: '<img src=x onerror=alert(1)>' },
  });
  assert.ok(hostileWhen.includes("Read against its cited source"), "positive control: the hostile-date page renders a block");
  assert.ok(!/<img src=x/.test(hostileWhen), "a hostile measuredAt reached the page as markup");

  // (h8) A MALFORMED FIELD TYPE must not abort generation of every page.
  const malformed = renderPage(row, "abc1234def", {
    audits: [{ id: "T-M", constant: "9z", citedRef: "RM", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/m", sourceRead: { toString: null } }, { ...pinned, id: "T-OK" }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(malformed.includes("line 33"), "a malformed entry must be dropped without taking the good one, or the page, down with it");

  // (h9) HOW THE ROW WAS CHOSEN REACHES THE READER, and the two populations are counted apart.
  //      Slice 1 was suspicion-drawn and sat inside the ledger-wide figure with nothing saying so.
  //      The MEANING guards come first; the count pins last (the 2026-09-06 assertion-order rule).
  const mixed = renderPage(row, "abc1234def", {
    audits: [
      { id: "T-S1", constant: "9z", citedRef: "RS", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/s", rowFile: "ledger/x/9z.md", rowLine: 10, rowTextSha256: "s1", selection: "systematic", ...pinId("| $1.111111$ | [RS] | x |") },
      { id: "T-S2", constant: "9z", citedRef: "RH", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/h2", rowFile: "ledger/x/9z.md", rowLine: 11, rowTextSha256: "s2", selection: "suspicion", ...pinId("| $1.222222$ | [RH] | x |") },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(mixed.includes("Read against its cited source"), "positive control: the mixed-selection page renders a block");
  assert.ok(mixed.includes("drawn by position before it was read"), "a systematic row must say it was drawn by position");
  assert.ok(mixed.includes("chosen because something already looked wrong"), "a suspicion-drawn row must say so on the page, not only in the store");
  assert.ok(/carries no rate/.test(mixed), "the page must say why a suspicion-drawn set is counted apart");
  assert.ok(/1 drawn by position, 1 chosen because/.test(mixed), "the per-page count names both populations");
  assert.ok(/ledger 1 row\(s\) were drawn by position, against 999 rows/.test(mixed),
    "the ledger-wide coverage figure counts ONLY the rows drawn by position");
  assert.ok(/1 more were chosen for suspicion and are counted apart/.test(mixed), "and the suspicion-drawn rows are stated beside it, not hidden");

  // ...and ONE ROW AUDITED TWICE under different selections is ONE row, in ONE group. Found by
  // adversarial review 2026-09-13: counting each group's rows independently printed "1 bound row(s)
  // here" beside "1 drawn by position, 1 chosen because…", inflating the work and contradicting the
  // recheck invariant (h5) in the same sentence.
  const recheckPin = { constant: "9z", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/r2", rowFile: "ledger/x/9z.md", rowLine: 20, rowTextSha256: "same-row", ...pinId("| $2.222222$ | [RR] | x |") };
  const rechecked = renderPage(row, "abc1234def", {
    audits: [
      { ...recheckPin, id: "T-R1", citedRef: "RR", selection: "systematic" },
      { ...recheckPin, id: "T-R2", citedRef: "RR", selection: "suspicion" },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(/1 bound row\(s\) here/.test(rechecked), "positive control: two audits of one row are one row read");
  assert.ok(/\(1 drawn by position, 0 chosen because/.test(rechecked),
    "a row read twice under different selections lands in ONE group — a row the ladder reached stays coverage");
  assert.ok(!/1 drawn by position, 1 chosen because/.test(rechecked), "negative control: the double-counted split must not appear");
  assert.ok(/ledger 1 row\(s\) were drawn by position/.test(rechecked), "and the ledger-wide figure counts it once");
  assert.ok(/0 more were chosen for suspicion/.test(rechecked), "with nothing left over in the suspicion set");

  // ...and the UNLABELLED case goes to suspicion, the direction that understates coverage. An
  // entry with no `selection` must never be counted into the systematic figure by default.
  const unlabelled = renderPage(row, "abc1234def", {
    audits: [{ id: "T-N", constant: "9z", citedRef: "RN", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/n", rowFile: "ledger/x/9z.md", rowLine: 12, rowTextSha256: "n1", ...pinId("| $4.444444$ | [RN] | x |") }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(/ledger 0 row\(s\) were drawn by position/.test(unlabelled), "an unlabelled row must NOT count as systematic coverage");
  assert.ok(/1 more were chosen for suspicion/.test(unlabelled), "an unlabelled row is counted with the suspicion set");

  // ...and the prohibition runs on THIS new surface too, which is the guard that was missing when
  // the audit block itself was added (2026-09-10) and again when a second render path appeared.
  for (const forbidden of [/\brecord\b(?!ed)/i, /strongest known/i, /best known bound/i]) {
    assert.ok(!forbidden.test(mixed.replace(DISCLAIMER, "")),
      `the selection-labelled page must not claim a record either — matched ${forbidden}`);
  }

  // (h10) THE VALUE CHECKED IS ON THE PAGE. On 2026-09-13 three of 1b's four audited values appeared
  //       nowhere in the served HTML — the row was named by line and citation only. MEANING first: the
  //       number is visible for a bound row, absent for a reference entry (whose first cell is not a
  //       bound), escaped when hostile, and a malformed rowText neither crashes nor prints.
  const sha16 = (t) => crypto.createHash("sha256").update(t.trim(), "utf8").digest("hex").slice(0, 16);
  const goodText = "| $0.380876$ | [RV] | TTT-Discover |";
  const goodRow = { id: "T-V1", constant: "9z", citedRef: "RV", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/v", rowFile: "ledger/x/9z.md", rowLine: 24, rowTextSha256: sha16(goodText), rowText: goodText, inMirror: true, selection: "suspicion" };
  const refText = "| $9.111111$ | [RV] | should not print |";
  const valued = renderPage(row, "abc1234def", {
    audits: [
      goodRow,
      { id: "T-V2", constant: "9z", citedRef: "RV", leg: "citation-well-formed", verdict: "UNREACHABLE", source: "https://example.invalid/dead", rowFile: "ledger/x/9z.md", rowLine: 25, rowTextSha256: sha16(refText), rowText: refText, inMirror: true, selection: "suspicion" },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(valued.includes("Read against its cited source"), "positive control: the valued page renders a block");
  assert.ok(valued.includes("0.380876"), "a VERIFIED bound row must show the value that was checked, not only its line and citation");
  assert.ok(!valued.includes("9.111111"), "a reference entry must not print a first cell as though it were a checked bound");

  // A PINNED audit whose identity can no longer be proved renders as HISTORICAL (review round 2): the
  // reading is kept, but the page must not say the source supports the row, must not link the live
  // line, must not print the number, and must not count it as read. MEANING FIRST, so a mutation names
  // the property it broke (the 2026-09-06 assertion-order rule).
  const staleHtml = (a, msg) => {
    const html = renderPage(row, "abc1234def", { audits: [a], corpus: { citedRows: 999, measuredAt: "2026-01-02" } });
    assert.ok(html.includes("says nothing about the row there now"), `(${msg}) a pinned audit that fails identity must render as HISTORICAL`);
    assert.ok(!html.includes("it supports this row"), `(${msg}) and must NOT say the cited source supports the row there now`);
    assert.ok(!/9z\.md#L24/.test(html), `(${msg}) and must NOT link the live line a reader would land on`);
    assert.ok(!/have been read against their cited source/.test(html), `(${msg}) and must NOT be counted as read`);
    assert.ok(/no longer match the current table/.test(html), `(${msg}) and the page must disclose it rather than drop it`);
    return html;
  };
  // (1) THE ROUND-1 REPRODUCTION: the stored value edited after its audit, hash left alone.
  assert.ok(!staleHtml({ ...goodRow, rowText: "| $9.999999$ | [RV] | TTT-Discover |" }, "edited value").includes("9.999999"),
    "a rowText whose hash no longer matches its recorded audit hash must NOT print its value");
  // (2) THE ROUND-2 REPRODUCTION: the row no longer stands at its recorded line.
  assert.ok(!staleHtml({ ...goodRow, inMirror: false }, "not at its line").includes("0.380876"),
    "a row that no longer stands at its recorded line must NOT print its value");
  // (3) non-table text comes through boundCell wholesale, so it is refused before boundCell sees it.
  const prose = "the bound is 7.777777 per the survey";
  assert.ok(!staleHtml({ ...goodRow, rowText: prose, rowTextSha256: sha16(prose) }, "non-table text").includes("7.777777"),
    "non-table rowText must NOT print, even with a matching hash");
  // (4) a VERIFIED row whose first cell is only a comment keeps its verdict and prints no value.
  const commentOnly = "| <!-- 6.666666 --> | [RV] | x |";
  const commentHtml = renderPage(row, "abc1234def", { audits: [{ ...goodRow, rowText: commentOnly, rowTextSha256: sha16(commentOnly) }], corpus: { citedRows: 999 } });
  assert.ok(commentHtml.includes("it supports this row"), "positive control: a verified row keeps its verdict even when its cell is empty");
  assert.ok(!commentHtml.includes("6.666666"), "a comment-only first cell must not print its comment");
  assert.ok(!/padding:\.1rem \.3rem"><\/code>/.test(commentHtml), "and must not print an empty code span");

  // (5) REVIEW ROUND 3, first reproduction: an audit with NO stored rowText cannot prove identity, so it
  //     is historical too, with no live link, no support claim and no count, however complete it looks.
  staleHtml({ ...goodRow, rowText: undefined }, "unpinned");
  // (6) REVIEW ROUND 3, second reproduction: a stale UNREACHABLE audit must NOT claim the source was read.
  const staleUnreach = renderPage(row, "abc1234def", { audits: [{ ...goodRow, verdict: "UNREACHABLE", inMirror: false }], corpus: { citedRows: 999, measuredAt: "2026-01-02" } });
  assert.ok(staleUnreach.includes("attempted on an earlier version of the table and the cited source could not be read"), "a stale UNREACHABLE audit must say a check was ATTEMPTED, not that the source was read");
  assert.ok(!staleUnreach.includes("was read against its cited source"), "and must never claim the source was read");
  assert.ok(staleUnreach.includes("the source we could not read"), "positive control: its link text still says the source could not be read");
  assert.ok(!staleUnreach.includes("were attempted and the source could NOT be read"), "and it is not double-counted in the current-table attempted sentence");
  assert.ok(staleUnreach.includes("no longer match the current table"), "it is disclosed with the other historical audits instead");

  // (7) REVIEW ROUND 4: every bound audit here historical AND a reference check present. The summary
  //     must not deny readings the list above just described as historical.
  const staleWithRef = renderPage(row, "abc1234def", { audits: [{ ...goodRow, inMirror: false }, { id: "T-RF", constant: "9z", citedRef: "RF", leg: "citation-well-formed", verdict: "UNRESOLVED", source: "https://example.invalid/rf", selection: "suspicion" }], corpus: { citedRows: 999, measuredAt: "2026-01-02" } });
  assert.ok(!staleWithRef.includes("has been read against its source yet"), "a page with historical bound reads must not claim no bound row was ever read");
  assert.ok(staleWithRef.includes("has been verified against the current table"), "it says instead that none has been verified against the current table");
  assert.ok(staleWithRef.includes("no longer match the current table"), "and the historical audit is still disclosed");

  // mirrorHas reads the live mirror AT THE RECORDED LINE, both polarities, and refuses a path outside
  // it. The positive leg is a row this lane audited on 2026-09-13, so a reader that always returned
  // false could not pass it.
  const aeText = "| $0.380924$ | [GGSWT2025] | AlphaEvolve |";
  assert.equal(mirrorHas("ledger/teorth-optimizationproblems/constants/1b.md", 23, aeText), true,
    "positive control: an audited row standing at its recorded line is found there");
  assert.equal(mirrorHas("ledger/teorth-optimizationproblems/constants/1b.md", 24, aeText), false,
    "the SAME text asked at a different line is NOT the audited row — surviving text elsewhere must not vouch for a changed row");
  assert.equal(mirrorHas("ledger/teorth-optimizationproblems/constants/1b.md", 23, "| $0.380925$ | [GGSWT2025] | AlphaEvolve |"), false,
    "a row differing by one digit at the recorded line is NOT the audited row");
  assert.equal(mirrorHas("ledger/teorth-optimizationproblems/constants/../../../package.json", 1, "{"), false,
    "a rowFile escaping the mirror directory is refused rather than read");

  const hostileText = "| <img src=x onerror=alert(1)> | [RH] | x |";
  const hostileValue = renderPage(row, "abc1234def", {
    audits: [{ id: "T-HV", constant: "9z", citedRef: "RH", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/hv", rowText: hostileText, rowTextSha256: sha16(hostileText), inMirror: true }],
    corpus: { citedRows: 999 },
  });
  assert.ok(hostileValue.includes("&lt;img"), "positive control: the hostile value DID pass verification and render, so the absence below is escaping");
  assert.ok(!/<img src=x/.test(hostileValue), "a hostile rowText reached the page as markup");
  const oddValue = renderPage(row, "abc1234def", {
    audits: [{ id: "T-OV", constant: "9z", citedRef: "RO", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/ov", rowText: { toString: null } }],
    corpus: { citedRows: 999 },
  });
  assert.ok(oddValue.includes("Read against its cited source"), "a malformed rowText must neither crash rendering nor drop the row");
  assert.match(valued, /<code style="display:inline;padding:\.1rem \.3rem">\$0\.380876\$<\/code>/, "and the value renders as an inline code span, exactly");

  // (i) MEANING: only THIS constant's audits appear.
  assert.ok(!audited.includes("REF3"), "a constant page must not show another constant's audit rows");
  assert.ok(store.audits.some((a) => a.citedRef === "REF3"), "negative control: REF3 IS in the store, so the absence above is about filtering");

  // (j) BOTH POLARITIES: no audits, no block — and the page still renders.
  const unaudited = renderPage(row, "abc1234def", { audits: [], corpus: { citedRows: 999 } });
  assert.ok(unaudited.length > 800, "positive control: the unaudited page must still render");
  assert.ok(!unaudited.includes("Read against its cited source"), "a constant nobody has audited must carry no audit block");
  assert.ok(audited.includes("Read against its cited source"), "positive control: the heading IS present when there are audits");

  // (k) A missing corpus renders a COUNT and explicitly refuses to imply a proportion.
  const noCorpus = renderPage(row, "abc1234def", { audits: [store.audits[0]], corpus: null });
  assert.ok(noCorpus.includes("not recorded"), "with no denominator the block must say so rather than showing verdicts alone");
  // The filed-report disclosure appears only when the record maps this constant.
  const withReport = renderPage(
    buildRows(claims, { withDates: false, reports: [{ path: "constants/9z.md", url: "https://example.invalid/i/1", state: "CLOSED", closedAt: "2026-08-23T00:00:00Z" }] })[0],
    "abc1234def",
  );
  assert.match(withReport, /we reported this row/);
  assert.ok(!/we reported this row/.test(html), "a constant we filed nothing against must carry no disclosure");

  console.log(`render-constant-pages selftest: PASS (renders title, both pinned rows and the upstream sha after proving the page is non-empty; carries a canonical URL, and its cite block quotes the SHARED citation unchanged — so the table and the page hand out the same address for the same constant, and a re-added local substitution fails here; a missing side reads "not pinned"; a hostile title is escaped, with the raw fixture proven to contain the markup so the check tests the renderer; the filed-report disclosure appears only for a mapped constant; and the A-47 audit block carries the no-record prohibition on the AUDITED page rather than only the unaudited one, drops an unrecognised verdict instead of printing it, matches link text to verdict so UNREACHABLE never offers 'the source we read', links each source as an anchor whose href IS that source, refuses a javascript: scheme, escapes hostile citedRef and sourceRead, survives a null entry beside a good one, renders the denominator FROM THE STORE with a fixture of 999 proving it is not baked in, carries the date it was measured, counts bound rows separately from reference entries against a bound-row denominator, shows only THIS constant's rows with the other proven present in the fixture, is ABSENT for an unaudited constant, says 'not recorded' rather than implying a proportion when the corpus is missing, and — since 2026-09-13 — tells the reader how each row was CHOSEN, counts the ledger-wide coverage figure from rows drawn by position ONLY, files an unlabelled row with the suspicion set rather than as coverage, and carries the no-record prohibition on that selection-labelled surface too)`);
}

function main({ check = false } = {}) {
  const claims = JSON.parse(readFileSync(join(ROOT, "ledger", "claims.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(join(ROOT, "ledger", "teorth-optimizationproblems", "manifest.json"), "utf8"));
  const rows = buildRows(claims);
  const pages = new Map(rows.map((r) => [`${r.id}.html`, renderPage(r, manifest.sha)]));

  if (check) {
    const onDisk = existsSync(OUTDIR) ? readdirSync(OUTDIR).filter((f) => f.endsWith(".html")) : [];
    const missing = [...pages.keys()].filter((f) => !onDisk.includes(f));
    const extra = onDisk.filter((f) => !pages.has(f));
    // Compare CONTENT, not line endings — the same normalisation render-site.mjs's --check already
    // does, and for the same measured reason: the renderer writes LF while a Windows checkout
    // materialises these files as CRLF, so a byte-exact comparison calls a CORRECT tree stale. That
    // fired on README.md on 2026-08-16 simply from switching branches; this comparison was the last
    // one in the repo still unnormalised (cold-review finding, 2026-09-03). A red that means nothing
    // is worse than no alarm — it is the polarity that teaches people to ignore one.
    const lf = (s) => s.replace(/\r\n/g, "\n");
    const stale = [...pages]
      .filter(([f, html]) => onDisk.includes(f) && lf(readFileSync(join(OUTDIR, f), "utf8")) !== lf(html))
      .map(([f]) => f);
    if (missing.length || extra.length || stale.length) {
      console.log(`RESULT: FAIL — ${missing.length} missing, ${extra.length} orphaned, ${stale.length} stale constant page(s)`);
      for (const f of [...missing, ...extra, ...stale].slice(0, 10)) console.log(`  ${f}`);
      process.exitCode = 1;
      return;
    }
    console.log(`RESULT: PASS — ${pages.size} constant page(s) match committed state (@ ${String(manifest.sha).slice(0, 7)})`);
    return;
  }

  // Rewrite wholesale: a constant removed upstream must lose its page rather than linger as a
  // document nobody links but search engines still serve.
  if (existsSync(OUTDIR)) rmSync(OUTDIR, { recursive: true, force: true });
  mkdirSync(OUTDIR, { recursive: true });
  for (const [name, html] of pages) writeFileSync(join(OUTDIR, name), html);
  console.log(`wrote ${pages.size} constant page(s) to c/ @ ${String(manifest.sha).slice(0, 7)}`);
}

if (process.argv.includes("--selftest")) selftest();
else main({ check: process.argv.includes("--check") });
