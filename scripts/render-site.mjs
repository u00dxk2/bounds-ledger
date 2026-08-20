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

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pinsFor, lastChanged } from "./lookup.mjs";

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

export function buildRows(claims, { withDates = true, root = ROOT } = {}) {
  return constantIds(claims).map((id) => {
    const pins = pinsFor(id, claims);
    const upper = pins.find((p) => p.id.endsWith(":U"));
    const lower = pins.find((p) => p.id.endsWith(":L"));
    const any = upper || lower;
    return {
      id,
      title: titleFrom(any && any.statement),
      url: any && any.url,
      upper: upper && upper.expect,
      lower: lower && lower.expect,
      upperChanged: withDates && upper ? lastChanged(upper.expect, root) : null,
      lowerChanged: withDates && lower ? lastChanged(lower.expect, root) : null,
    };
  });
}

function cell(row, changed) {
  if (!row) return `<td class="none">not pinned</td>`;
  const when = changed ? `<span class="when">last changed ${esc(changed)}</span>` : "";
  return `<td><code>${esc(row)}</code>${when}</td>`;
}

export function renderHtml(rows, manifest, generatedOn) {
  const sha = String(manifest.sha);
  const body = rows.map((r) => `<tr data-name="${esc((r.title + " " + r.id).toLowerCase())}">
<th scope="row"><a href="ledger/teorth-optimizationproblems/constants/${esc(r.id)}.md">${esc(r.title)}</a><span class="id">${esc(r.id)}</span></th>
${cell(r.upper, r.upperChanged)}
${cell(r.lower, r.lowerChanged)}
<td class="src"><a href="${esc(r.url)}">source</a></td>
</tr>`).join("\n");

  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bounds Ledger — is the number you cited still current?</title>
<meta name="description" content="A continuously re-verified ledger of mathematical records. Look up a constant and see the bounds rows we watch, when each last moved, and the primary source.">
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
input{width:100%;max-width:26rem;padding:.6rem .7rem;font-size:1rem;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg)}
.count{font-size:.85rem;color:var(--muted);margin:.6rem 0 1rem}
.scroll{overflow-x:auto;border:1px solid var(--line);border-radius:8px}
table{border-collapse:collapse;width:100%;font-size:.9rem;min-width:56rem}
th,td{text-align:left;vertical-align:top;padding:.6rem .75rem;border-bottom:1px solid var(--line)}
thead th{position:sticky;top:0;background:var(--bg);font-size:.78rem;letter-spacing:.03em;text-transform:uppercase;color:var(--muted)}
tbody th{font-weight:600;min-width:15rem}
.id{display:block;font:12px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted)}
code{display:block;font:12.5px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--code);padding:.4rem .5rem;border-radius:4px;white-space:pre-wrap;word-break:break-word}
.when{display:block;font-size:.75rem;color:var(--muted);margin-top:.3rem}
.none{color:var(--muted);font-style:italic}
.src{white-space:nowrap}
footer{margin-top:2.5rem;padding-top:1.25rem;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem;max-width:78ch}
tr[hidden]{display:none}
</style>
<div class="wrap">
<h1>Is the number you cited still current?</h1>
<p class="lede">Best-known bounds move, and the papers and index pages citing them do not all move at the same time. This is every mathematical constant this ledger watches, with the exact table rows it has pinned.</p>

<div class="note">
<p><strong>Read this before you trust a number here.</strong> This page is a <em>snapshot</em>, not a live read. It shows our mirror of <a href="https://github.com/teorth/optimizationproblems">teorth/optimizationproblems</a> at upstream commit <code style="display:inline;padding:.1rem .3rem">${esc(sha.slice(0, 7))}</code>, fetched ${esc(generatedOn)}.</p>
<p>Every row links to its primary source so you can check us in one hop — and if a row here disagrees with the source, that is a bug worth <a href="https://github.com/u00dxk2/bounds-ledger/issues">reporting</a>.</p>
<p><strong>These are last-listed table rows, not a claim about which bound is “the record.”</strong> Deciding that automatically is defeated by symbolic entries, negatives and asymptotic notation, so this ledger does not try; it reports position and leaves the judgement to you.</p>
</div>

<label for="q">Filter by name or id — try “sofa”, “Grothendieck”, “27b”</label>
<input id="q" type="search" autocomplete="off" placeholder="Type to filter&hellip;">
<p class="count" id="count">${rows.length} constants</p>

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
<p>Two claims cite a page that refuses automated requests from data-centre addresses, so they report UNVERIFIED permanently and never count toward a pass. That is the ledger declining to launder an unverifiable fact into a green.</p>
<p><a href="https://github.com/u00dxk2/bounds-ledger">Source, method and every catch it has made &rarr;</a></p>
</footer>
</div>
<script>
(function(){
  var q=document.getElementById('q'),rows=document.getElementById('rows'),count=document.getElementById('count');
  var trs=[].slice.call(rows.getElementsByTagName('tr'));
  q.addEventListener('input',function(){
    var v=q.value.trim().toLowerCase(),n=0;
    for(var i=0;i<trs.length;i++){
      var hit=!v||trs[i].getAttribute('data-name').indexOf(v)>-1;
      trs[i].hidden=!hit; if(hit)n++;
    }
    count.textContent=n+(n===1?' constant':' constants')+(v?' matching “'+v+'”':'');
  });
})();
</script>
</html>
`;
}

async function selftest() {
  const assert = (await import("node:assert/strict")).default;
  const claims = [
    { id: "pin:10a:U", statement: "Last-listed upper-bound table row for The real Grothendieck constant (10a.md)", url: "https://example.invalid/10a.md", expect: "| 1.7822 | Krivine |" },
    { id: "pin:10a:L", statement: "Last-listed lower-bound table row for The real Grothendieck constant (10a.md)", url: "https://example.invalid/10a.md", expect: "| 1.6769 | Davie |" },
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

  // Self-contained: no third-party asset can be fetched at render time.
  const externals = html.match(/(?:src|href)="https?:\/\/[^"]+"/g) || [];
  const badHost = externals.filter((h) => !/github\.com|example\.invalid/.test(h));
  assert.deepEqual(badHost, [], `page must fetch nothing at runtime; found ${badHost.join(", ")}`);

  console.log("render-site selftest: PASS (renders names, both pinned rows and the upstream sha; marks a missing side 'not pinned'; ids sort numerically and exclude hand claims; never asserts a record — checked after proving the page is non-empty; table content is escaped not injected; no third-party asset referenced)");
}

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
  const html = renderHtml(buildRows(claims), manifest, on);

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
