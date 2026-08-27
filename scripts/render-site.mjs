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
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
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

export function buildRows(claims, { withDates = true, root = ROOT } = {}) {
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

function cell(row, changed, kind) {
  if (!row) return `<td class="none">not pinned</td>`;
  // Second half of review finding F1. Omitting the element when the date is null made "we could
  // not compute a date" indistinguishable from "this page does not date rows" — the zero-versus-
  // absent confusion this repo exists to police, on the page's own headline promise. Say it
  // explicitly instead. With the escaped-needle fix all 222 pins now date, so this path should be
  // unreachable in practice; it stays because the day it becomes reachable is the day it matters.
  const when = changed
    ? `<span class="when ${kind === "text" ? "text-only" : ""}">${whenLabel(changed, kind)}</span>`
    : `<span class="when">date unknown</span>`;
  return `<td><code>${esc(row)}</code>${when}</td>`;
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
  const body = rows.map((r) => `<tr id="c-${esc(r.id)}" data-name="${esc((r.title + " " + r.id).toLowerCase())}" data-changed="${esc(r.changed || "")}">
<th scope="row"><a href="ledger/teorth-optimizationproblems/constants/${esc(r.id)}.md">${esc(r.title)}</a><a class="id" href="#c-${esc(r.id)}" aria-label="Permalink to ${esc(r.title)}">${esc(r.id)}</a></th>
${cell(r.upper, r.upperChanged, r.upperKind)}
${cell(r.lower, r.lowerChanged, r.lowerKind)}
<td class="src"><a href="${esc(r.url)}">source</a> · <a href="${esc(flagUrl(r, sha))}" aria-label="Report a problem with ${esc(r.title)}">looks wrong?</a></td>
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
.id:hover,.id:focus{text-decoration:underline}
tr:target th{box-shadow:inset 3px 0 0 var(--accent)}
tr:target>*{background:var(--code)}
code{display:block;font:12.5px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--code);padding:.4rem .5rem;border-radius:4px;white-space:pre-wrap;word-break:break-word}
.when{display:block;font-size:.75rem;color:var(--muted);margin-top:.3rem}
.when.text-only{font-style:italic}
.none{color:var(--muted);font-style:italic}
.src{white-space:nowrap}
footer{margin-top:2.5rem;padding-top:1.25rem;border-top:1px solid var(--line);color:var(--muted);font-size:.85rem;max-width:78ch}
tr[hidden]{display:none}
</style>
<div class="wrap">
<h1>Is the number you cited still current?</h1>
<p class="lede">Best-known bounds move, and the papers and index pages citing them do not all move at the same time. This is every mathematical constant this ledger watches, with the exact table rows it has pinned.</p>

<div class="note">
<p><strong>Read this before you trust a number here.</strong> This page is a <em>snapshot</em>, not a live read. It shows our mirror of <a href="https://github.com/teorth/optimizationproblems">teorth/optimizationproblems</a> at upstream commit <code style="display:inline;padding:.1rem .3rem">${esc(sha.slice(0, 7))}</code>.</p>
<p><strong>${esc(generatedOn)} is the date this mirror last CHANGED &mdash; not the last time it was checked.</strong> Those are different dates and the difference matters here: a scheduled job re-verifies every pinned row on this page daily, and a day that finds nothing moved leaves this date untouched. So an old date means the records have been <em>steady</em>, not that nobody has looked. The longest such quiet stretch so far was nine days. To see the actual last check and its verdict, read the <a href="https://github.com/u00dxk2/bounds-ledger/actions/workflows/reverify.yml">run history</a> &mdash; that is the live read, and this page is deliberately not.</p>
<p>Every row links to its primary source so you can check us in one hop — and if a row here disagrees with the source, that is a bug worth <a href="https://github.com/u00dxk2/bounds-ledger/issues">reporting</a>.</p>
<p><strong>Every row has its own link.</strong> Click a row&rsquo;s short id — the grey code under the constant&rsquo;s name — and your address bar holds a link to that row alone. Send that to a colleague and they land on the constant, not on a page of two hundred.</p>
<p><strong>These are last-listed table rows, not a claim about which bound is “the record.”</strong> Deciding that automatically is defeated by symbolic entries, negatives and asymptotic notation, so this ledger does not try; it reports position and leaves the judgement to you.</p>
</div>

<div class="controls">
<div class="ctl grow">
<label for="q">Filter by name or id — try “sofa”, “Grothendieck”, “27b”</label>
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
<p>Filtering matches the constant&rsquo;s name and its id, so a constant listed under a name you do not use will hide from a search that is otherwise correct. Worth clearing the box and scanning once before concluding it is absent.</p>
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
      var hit=!v||trs[i].getAttribute('data-name').indexOf(v)>-1;
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
  // The prefix is load-bearing: a bare id like "10a" starts with a digit, which is a legal HTML id
  // but cannot be written as a bare CSS selector — :target styling would silently not apply.
  assert.match(html, /<tr id="c-10a"/, "row ids must carry the c- prefix so a numeric-leading constant id stays selectable");
  // Both :target rules are asserted SEPARATELY and by their declaration, not by the bare string
  // "tr:target". The first version of this assertion matched /tr:target/ and a negative control
  // proved it could not fail: deleting either rule left the other one matching, so an assertion
  // that read as "the landed row is marked" actually checked only that the words appeared once.
  assert.match(html, /tr:target th\{box-shadow/, "the landed row must carry an edge marker");
  assert.match(html, /tr:target>\*\{background/, "the landed row must carry a background fill");

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

  // Self-contained: no third-party asset can be fetched at render time.
  const externals = html.match(/(?:src|href)="https?:\/\/[^"]+"/g) || [];
  const badHost = externals.filter((h) => !/github\.com|example\.invalid/.test(h));
  assert.deepEqual(badHost, [], `page must fetch nothing at runtime; found ${badHost.join(", ")}`);

  console.log("render-site selftest: PASS (renders names, both pinned rows and the upstream sha; marks a missing side 'not pinned'; ids sort numerically and exclude hand claims; never asserts a record — checked after proving the page is non-empty; table content is escaped not injected; every row carries its own prefilled report link, with a hostile constant name percent-encoded before attribute-escaping and no raw markup reaching the href; no third-party asset referenced; a row publishes the LATER of its two dates as a sort key, an undated row publishes an empty one rather than a guess, and the page's own reorder script, extracted and executed against a stub DOM, puts newest first, undated last, and restores id order; a search matching nothing reveals an empty state that quotes the term back as TEXT and prefills a report link with it, and hides again on a match; a changed bound reads as a value change while an escaping-only edit and a changed citation detail both read as text edits with the bound held, a pin with no prior version gets no verdict, and all four reader-facing wordings are pinned; every row carries a c-prefixed id and a permalink that targets that row's OWN id in document order, with the landed row visibly marked)");
}

// Entry-point guard — review finding F2. Without it, ANY importer of renderHtml/buildRows runs the
// selftest or WRITES index.html as an import side effect. Latent today because nothing imports this
// module, but the defect class is proven live in this codebase: the commit that introduced this
// file also had to add this same guard to lookup.mjs after import-executes-CLI bit it, and the new
// module repeated the shape it had just fixed. Guarding it now rather than after it bites twice.
const isMain = process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (!isMain) {
  // imported as a library — export only
} else if (process.argv.includes("--selftest")) {
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
