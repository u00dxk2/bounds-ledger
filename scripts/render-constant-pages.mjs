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
.none{color:var(--muted)}
.ours{display:inline-block;margin-top:.6rem;font-size:.85rem}
.actions{margin:1.6rem 0;padding-top:1rem;border-top:1px solid var(--line);font-size:.9rem}
.cite code{user-select:all;margin-top:.5rem}
footer{margin-top:2rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}`;

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

export function renderPage(r, sha) {
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

  // The filed-report disclosure appears only when the record maps this constant.
  const withReport = renderPage(
    buildRows(claims, { withDates: false, reports: [{ path: "constants/9z.md", url: "https://example.invalid/i/1", state: "CLOSED", closedAt: "2026-08-23T00:00:00Z" }] })[0],
    "abc1234def",
  );
  assert.match(withReport, /we reported this row/);
  assert.ok(!/we reported this row/.test(html), "a constant we filed nothing against must carry no disclosure");

  console.log(`render-constant-pages selftest: PASS (renders title, both pinned rows and the upstream sha after proving the page is non-empty; carries a canonical URL, and its cite block quotes the SHARED citation unchanged — so the table and the page hand out the same address for the same constant, and a re-added local substitution fails here; a missing side reads "not pinned"; a hostile title is escaped, with the raw fixture proven to contain the markup so the check tests the renderer; the filed-report disclosure appears only for a mapped constant)`);
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
    const stale = [...pages].filter(([f, html]) => onDisk.includes(f) && readFileSync(join(OUTDIR, f), "utf8") !== html).map(([f]) => f);
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
