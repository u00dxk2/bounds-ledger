#!/usr/bin/env node
// render-ramsey.mjs — A-54's first reader-visible slice: ramsey.html, the second watched area.
//
// usage: render-ramsey.mjs            write ramsey.html from ledger/ejc-ds1/section-2-1.json
//        render-ramsey.mjs --check    exit 1 if the committed page is stale OR fails its own guard
//        render-ramsey.mjs --selftest network-free; every guard shown firing and staying silent
//
// THE READER THIS PAGE IS FOR. Someone about to cite a small Ramsey number, R(5, 5) <= 46 say,
// who wants to know what the survey the field cites actually prints for it, which paper that
// survey credits, and whether anyone has checked the two against each other. The page answers the
// first two exactly as printed and the third honestly: until an entry is read against the paper it
// credits, the entry says "not yet read". It never says which bound is "the" bound. Where Table Ia
// and Table Ib both print an upper bound, both are shown and neither is chosen for the reader.
//
// THE GUARD RUNS ON THE COMMITTED FILE, not only on a fixture. Every guard in render-site.mjs and
// render-constant-pages.mjs runs on HTML those scripts render inside their own selftests, so a
// page that drifted on disk would be invisible to them (found 2026-09-17 while scoping this page).
// Here `--check` renders the page AND runs guardPage() over the file actually committed, so the
// artifact a visitor loads is the one the guard reads.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isEntryModule } from "./lib/entry-module.mjs";
import { LEDGER } from "./extract-ds1.mjs";
import { arrivalKind } from "./report-rate.mjs";
import { frameOf, sameBound, readStore, STORE } from "./ds1-depth.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const OUT = join(ROOT, "ramsey.html");
const REPO = "https://github.com/u00dxk2/bounds-ledger";
const SITE = "https://u00dxk2.github.io/bounds-ledger/";
const AUTHOR_PAGE = "https://www.cs.rit.edu/~spr/ElJC/eline.html";
const RUNS = `${REPO}/actions/workflows/reverify.yml`;
const ALLOWED_HOSTS = new Set(["github.com", "u00dxk2.github.io", "www.combinatorics.org", "www.cs.rit.edu"]);

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

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// The guard reads reference keys back off the page, so it must undo what esc did to them.
const unesc = (s) => String(s).replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }[e]));

const STYLE = `:root{--ink:#111;--muted:#666;--line:#ddd;--code:#f6f6f6;--accent:#0b5fff;--soft:#fafafa}
*{box-sizing:border-box}body{margin:0;padding:1.5rem 1.25rem 3rem;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:var(--ink);max-width:52rem;margin-inline:auto}
a{color:var(--accent)}h1{font-size:1.4rem;line-height:1.3;margin:.2rem 0 .4rem}
h2{font-size:1.05rem;margin:0}h2 a{color:inherit;text-decoration:none}
.back{font-size:.85rem;display:inline-block;margin-bottom:1.2rem}
.lede{margin:.2rem 0 1rem}
.note{background:var(--soft);border:1px solid var(--line);padding:.2rem 1rem;margin:1rem 0;font-size:.93rem}
code{font:13px ui-monospace,SFMono-Regular,Menlo,monospace;background:var(--code);padding:.05rem .3rem;word-break:break-all}
.jump{margin:1.4rem 0;font-size:.9rem}.jump div{margin:.25rem 0}.jump .k{display:inline-block;min-width:3.6rem;color:var(--muted)}
.jump a{display:inline-block;min-width:1.9rem;padding:.1rem .15rem;text-align:center}
.group{margin-top:1.8rem;padding-top:.4rem;border-top:2px solid var(--ink);font-size:.9rem;color:var(--muted)}
.entry{border-bottom:1px solid var(--line);padding:.9rem 0}
dl{margin:.4rem 0 0;padding:0}dt{font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-top:.5rem}
dd{margin:.1rem 0 0}.v{font-size:1.05rem}.refs{display:block;font-size:.85rem;color:var(--muted)}
.none{color:var(--muted)}.flag{display:inline-block;margin-top:.5rem;font-size:.85rem}
footer{margin-top:2rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}`;

const key = (k, l) => `${k},${l}`;

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

const R = (k, l) => `R(${k}, ${l})`;

// A reference exactly as the survey prints it. "2.3.h" is an item of the survey's own Section 2.3,
// not a paper, so it is named as one rather than bracketed like a citation key.
function refLabel(s) {
  return /^\d+\.\d+\.[a-z]$/.test(s) ? `item ${s} of the survey` : `[${s}]`;
}

function iaText(e) {
  const c = e.ia;
  if (!c) return { value: "no entry in Table Ia", refs: "" };
  if (c.exact !== undefined) {
    const refs = c.ref ? `credited to ${refLabel(c.ref)}`
      : c.lowerRef || c.upperRef ? [c.lowerRef && `lower bound credited to ${refLabel(c.lowerRef)}`, c.upperRef && `upper bound credited to ${refLabel(c.upperRef)}`].filter(Boolean).join(" · ")
      : "no reference printed";
    return { value: `${R(e.k, e.l)} = ${c.exact}`, refs };
  }
  const value = c.lower !== undefined && c.upper !== undefined ? `${c.lower} ≤ ${R(e.k, e.l)} ≤ ${c.upper}`
    : c.lower !== undefined ? `${R(e.k, e.l)} ≥ ${c.lower} (no upper bound printed)`
    : `${R(e.k, e.l)} ≤ ${c.upper} (no lower bound printed)`;
  const refs = [
    c.lower !== undefined && (c.lowerRef ? `lower bound credited to ${refLabel(c.lowerRef)}` : "no reference printed for the lower bound"),
    c.upper !== undefined && (c.upperRef ? `upper bound credited to ${refLabel(c.upperRef)}` : "no reference printed for the upper bound"),
  ].filter(Boolean).join(" · ");
  return { value, refs };
}

const ibText = (e) => (e.ib ? `${R(e.k, e.l)} ≤ ${e.ib.upper}` : "no entry in Table Ib");

const STORE_URL = `${REPO}/blob/main/continuity/depth-audit-ds1.json`;
const NOT_YET = "not yet read";
const NOTHING = "nothing to read it against";
const BOUND_ORDER = { exact: 0, lower: 1, upper: 2 };

// Every value Table Ia prints for an entry, each with what it is credited to, in a fixed order.
function boundsFor(e, frame, left) {
  const mine = (b) => b.k === e.k && b.l === e.l;
  return [...frame.filter(mine).map((b) => ({ ...b, inFrame: true })), ...left.filter(mine).map((b) => ({ ...b, inFrame: false }))]
    .sort((a, b) => BOUND_ORDER[a.bound] - BOUND_ORDER[b.bound]);
}

function boundLabel(b) {
  const what = b.bound === "exact" ? `the exact value ${b.value}` : `the ${b.bound} bound ${b.value}`;
  if (b.inFrame) return `${what}, credited to ${refLabel(b.ref)}`;
  return b.ref ? `${what}, credited to ${refLabel(b.ref)}` : `${what}, with no reference printed`;
}

// One <dd> per bound. data-state is what the guard reads; the words are what a reader reads, and the
// guard checks the two agree.
function auditDds(e, bounds, rows) {
  if (!bounds.length) return [{ state: "nothing-to-read", html: `<dd class="none" data-state="nothing-to-read">Table Ia prints nothing here: ${NOTHING}</dd>` }];
  return bounds.map((b) => {
    const label = esc(boundLabel(b));
    if (!b.inFrame) return { state: "nothing-to-read", html: `<dd class="none" data-state="nothing-to-read">${label}: ${NOTHING}</dd>` };
    const row = rows.find((r) => sameBound(r, b));
    const o = row && OUTCOMES.find(([name]) => name === row.verdict);
    if (!o) return { state: "not-yet-read", html: `<dd class="none" data-state="not-yet-read">${label}: ${NOT_YET}</dd>` };
    const how = row.selection === "hand-picked" ? " Picked by hand, not drawn." : "";
    // WHAT WAS ACTUALLY READ, in one clause. Without it the page said "the credited source was
    // read as far as it could be" for two bounds whose credited paper was never opened at all —
    // true of the reading, misleading about the source (adversarial review round 2, 2026-09-18).
    const note = row.pageNote ? ` ${esc(row.pageNote)}` : "";
    return { state: o[0], html: `<dd data-state="${o[1]}">${label}: ${esc(o[1])} — ${esc(o[2])}.${note}${how} <a href="${esc(STORE_URL)}">How it was read</a></dd>` };
  });
}

function flagUrl(e, doc) {
  const ia = iaText(e);
  const title = `Row looks wrong: Small Ramsey Numbers ${R(e.k, e.l)}`;
  const body = [
    `Survey: Small Ramsey Numbers (EJC dynamic survey DS1), revision #${doc.source.revision}`,
    `Entry: ${R(e.k, e.l)}`,
    `This page shows: Table Ia ${ia.value}; Table Ib ${ibText(e)}`,
    "",
    "What the survey or the paper it credits says:",
    "",
    "Where you saw it (link or citation):",
  ].join("\n");
  return `${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

export function renderRamsey(doc, rows = []) {
  const entries = entriesOf(doc);
  const src = doc.source;
  const { frame, left } = frameOf(doc);
  const counts = Object.fromEntries([...OUTCOMES.map(([n]) => [n, 0]), ["not-yet-read", 0], ["nothing-to-read", 0]]);
  const blocks = [];
  let lastK = null;
  for (const e of entries) {
    const ia = iaText(e);
    const dds = auditDds(e, boundsFor(e, frame, left), rows);
    for (const d of dds) counts[d.state]++;
    if (e.k !== lastK) { blocks.push(`<h2 class="group" id="k-${e.k}">k = ${e.k}</h2>`); lastK = e.k; }
    blocks.push(`<section class="entry" id="r-${e.k}-${e.l}">
<h2><a href="#r-${e.k}-${e.l}">${esc(R(e.k, e.l))}</a></h2>
<dl>
<dt>Table Ia prints</dt><dd><span class="v">${esc(ia.value)}</span>${ia.refs ? `<span class="refs">${esc(ia.refs)}</span>` : ""}</dd>
<dt>Table Ib prints</dt><dd${e.ib ? "" : ' class="none"'}>${esc(ibText(e))}</dd>
<dt>Read against its credited source</dt>
${dds.map((d) => d.html).join("\n")}
</dl>
<a class="flag" href="${esc(flagUrl(e, doc))}">looks wrong?</a>
</section>`);
  }
  const byK = new Map();
  for (const e of entries) { if (!byK.has(e.k)) byK.set(e.k, []); byK.get(e.k).push(e.l); }
  const jump = [...byK].map(([k, ls]) => `<div><span class="k">k = ${k}</span> ${ls.map((l) => `<a href="#r-${k}-${l}" aria-label="${esc(R(k, l))}">${l}</a>`).join(" ")}</div>`).join("\n");
  const total = Object.values(counts).reduce((a, n) => a + n, 0);
  const countLine = [...OUTCOMES.map(([n, label, what]) => `${label} ${counts[n]} (${what})`), `${NOT_YET} ${counts["not-yet-read"]}`, `${NOTHING} ${counts["nothing-to-read"]}`].join(" · ");

  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Small Ramsey numbers R(k, l) — Bounds Ledger</title>
<meta name="description" content="${esc(`What the survey Small Ramsey Numbers, revision #${src.revision}, prints for R(k, l) with k ≤ 10 and l ≤ 15, with the reference it credits for each, and what this ledger has checked.`)}">
<link rel="canonical" href="${esc(`${SITE}ramsey.html`)}">
<style>${STYLE}</style>
<a class="back" href="./">&larr; all constants</a>
<h1>Small Ramsey numbers R(k, l)</h1>
<p class="lede">What the survey <em>Small Ramsey Numbers</em> prints for every two-colour classical Ramsey number R(k, l) with 3 ≤ k ≤ 10 and k ≤ l ≤ 15, exactly as printed, with the reference it credits for each value, and what this ledger has and has not checked about it.</p>

<div class="note">
<p><strong>The source.</strong> Stanisław Radziszowski, <a href="${esc(src.landing)}">Small Ramsey Numbers</a>, The Electronic Journal of Combinatorics, dynamic survey ${esc(src.survey)}, <strong>revision #${esc(src.revision)}, ${esc(longDate(src.revisionDate))}</strong>, Section 2.1, Tables Ia and Ib. The survey is the authority. This page reproduces its values and reference keys, not the document.</p>
<p><strong>What is covered.</strong> Section 2.1 only: ${entries.length} values of R(k, l). Table Ia prints something for ${doc.tableIa.length} of them, and Table Ib prints a newer upper bound for ${doc.tableIb.length}. <strong>Not covered</strong>: everything else in the survey, including other graphs, more than two colours and hypergraphs, and any result published after revision #${esc(src.revision)}.</p>
<p><strong>What is watched.</strong> Once a day a scheduled job checks the journal&rsquo;s page and the <a href="${esc(AUTHOR_PAGE)}">author&rsquo;s revision list</a> for a newer revision, and re-reads this table from the survey&rsquo;s PDF, whose fingerprint is pinned. A new revision turns that job red until a person has compared it with this page. The <a href="${esc(RUNS)}">run history</a> is the live read; this page is not.</p>
<p><strong>What has been checked against its source.</strong> The survey credits each bound to a paper by the key shown beside it, such as [AnM4], and an entry can credit its lower and upper bound to different papers. So every bound carries its own state. A bound says <em>not yet read</em> until someone has tried to check it. Where one has been tried, the words beside it say what was actually read — sometimes the credited paper itself, sometimes only what could be reached when that paper could not be opened, and sometimes a construction the ledger recomputed rather than read. Bounds are chosen for reading by a fixed rule, written down and committed before any paper is opened, so the ones read are not the ones that looked easy. The <a href="${esc(STORE_URL)}">notes kept on each reading</a> name the paper, what exactly was read, and what it said. So far, of the ${total} values Table Ia prints: ${esc(countLine)}.</p>
<p><strong>Table Ia and Table Ib can print different upper bounds for the same number.</strong> Table Ib lists upper bounds from computations by Angeltveit and McKay ([AnM2], [AnM3], [AnM4]) and R(4, 5) from [MR4], and the survey says they improve on the upper bounds in Table Ia. Where both tables print one, this page shows both and does not choose between them for you.</p>
<p><strong>[HW+]</strong> is the survey&rsquo;s own abbreviation of [HWSYZH], as enhanced in [Boza5]. A reference written as <em>item 2.3.h of the survey</em> points to a numbered item of its Section 2.3, not to a paper.</p>
<p>If an entry disagrees with the survey or with the paper it credits, use <strong>looks wrong?</strong> on that entry. The report arrives already naming the entry and the revision.</p>
</div>

<nav class="jump" aria-label="Jump to an entry">
${jump}
</nav>

${blocks.join("\n")}

<footer>
<p>Values as printed in revision #${esc(src.revision)} of the survey, read from the journal&rsquo;s PDF (sha256 <code>${esc(src.sha256)}</code>, ${esc(src.bytes)} bytes) by <a href="${esc(`${REPO}/blob/main/scripts/extract-ds1.mjs`)}">scripts/extract-ds1.mjs</a> and stored in <a href="${esc(`${REPO}/blob/main/ledger/ejc-ds1/section-2-1.json`)}">ledger/ejc-ds1/section-2-1.json</a>. This page is generated from that file by scripts/render-ramsey.mjs.</p>
</footer>
</html>
`;
}

// A store that exists must be WELL-FORMED or the page refuses. Treating a malformed `rows` as an
// empty list silently republished every reading as "not yet read" while --check still exited 0
// (adversarial review round 3, 2026-09-18): schema drift would have erased published results with
// no alarm. An explicitly empty array stays legal — that is the state before the first reading.
// The store must EXIST, too. A deleted or unfetched file skipped validation entirely and
// regenerated the page with every reading back to "not yet read", --check passing against it
// (adversarial review round 4, 2026-09-18). Absence and emptiness are different states: an empty
// store says so, with "rows": [].
export function storeGate(storeExists, parsed) {
  if (!storeExists) return { error: 'is missing. A store with no readings yet declares "rows": [] — absence is not emptiness, and rendering without it would republish every reading as "not yet read".' };
  return rowsFromStore(parsed);
}

export function rowsFromStore(parsed) {
  if (parsed && typeof parsed.__unreadable === "string") return { error: `not readable JSON (${parsed.__unreadable})` };
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { error: "is not an object with a rows array" };
  if (!("rows" in parsed)) return { error: "has no rows field; an empty store declares \"rows\": []" };
  if (!Array.isArray(parsed.rows)) return { error: `has a rows field of type ${Array.isArray(parsed.rows) ? "array" : typeof parsed.rows}, not an array` };
  return { rows: parsed.rows };
}

function longDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}

// The page's own guard. Returns the violations found; an empty list is a pass. Run on a fixture in
// the selftest AND on the committed file by --check.
export function guardPage(html, doc, rows = []) {
  const v = [];
  const { frame, left } = frameOf(doc);
  const shownReads = [];
  const text = html.replace(/<[^>]+>/g, " ");
  // 1. It never claims which bound is the record.
  for (const re of [/\brecord\b(?!ed)/i, /\bbest[- ]known\b/i, /\bstrongest known\b/i, /\bstate of the art\b/i, /\bthe true value\b/i, /\bcurrent(ly)? best\b/i]) {
    if (re.test(text)) v.push(`claims a record: ${re}`);
  }
  // 2. It loads nothing from anywhere.
  if (/<script\b/i.test(html)) v.push("carries a <script>");
  if (/<(img|iframe|video|audio|source|embed|object)\b/i.test(html)) v.push("embeds media");
  if (/<link\b(?![^>]*rel="canonical")/i.test(html)) v.push("carries a <link> other than canonical");
  if (/\ssrc=/i.test(html) || /url\(/i.test(html) || /@import/i.test(html)) v.push("loads an external asset");
  // 3. Every absolute link goes to a host it has a reason to name.
  for (const m of html.matchAll(/href="(https?:\/\/[^"/]+)/g)) {
    const host = m[1].replace(/^https?:\/\//, "");
    if (!ALLOWED_HOSTS.has(host)) v.push(`links an unexpected host: ${host}`);
  }
  // 4. Every value the store holds is on the page, in its own entry — the store-vs-page gap (A-53)
  //    is asserted here rather than left to a hand count.
  const entries = entriesOf(doc);
  const sections = [...html.matchAll(/<section class="entry" id="r-(\d+)-(\d+)">([\s\S]*?)<\/section>/g)];
  if (sections.length !== entries.length) v.push(`renders ${sections.length} entries, the table holds ${entries.length}`);
  const ids = sections.map((m) => `${m[1]},${m[2]}`);
  if (new Set(ids).size !== ids.length) v.push("an entry id repeats");
  for (const e of entries) {
    const s = sections.find((m) => `${m[1]},${m[2]}` === key(e.k, e.l));
    if (!s) { v.push(`${R(e.k, e.l)} is missing from the page`); continue; }
    const body = s[3];
    for (const n of [e.ia?.exact, e.ia?.lower, e.ia?.upper].filter((x) => x !== undefined)) {
      if (!new RegExp(`(^|[^0-9])${n}([^0-9]|$)`).test(body.split("Table Ib prints")[0])) v.push(`${R(e.k, e.l)}: Table Ia value ${n} is not shown`);
    }
    if (e.ib && !new RegExp(`≤ ${e.ib.upper}<`).test(body.split("Table Ib prints")[1] ?? "")) v.push(`${R(e.k, e.l)}: Table Ib value ${e.ib.upper} is not shown`);
    // One read state per value Table Ia prints for the entry, and the machine state and the words
    // a reader sees must say the same thing.
    const auditPart = (body.split("Read against its credited source</dt>")[1] ?? "").split("</dl>")[0];
    const dds = [...auditPart.matchAll(/<dd([^>]*)>([\s\S]*?)<\/dd>/g)];
    const want = Math.max(1, boundsFor(e, frame, left).length);
    if (dds.length !== want) v.push(`${R(e.k, e.l)}: lists ${dds.length} read state(s), Table Ia prints ${want} value(s) for it`);
    for (const [, attrs, inner] of dds) {
      const ds = attrs.match(/data-state="([^"]+)"/)?.[1];
      const words = inner.replace(/<[^>]+>/g, "");
      const o = OUTCOMES.find(([, label]) => label === ds);
      const ok = o ? words.includes(`: ${o[1]} — ${o[2]}.`)
        : ds === "not-yet-read" ? words.endsWith(`: ${NOT_YET}`)
        : ds === "nothing-to-read" ? words.endsWith(`: ${NOTHING}`)
        : false;
      if (!ok) v.push(`${R(e.k, e.l)}: read state ${JSON.stringify(ds)} with the words "${words}" is not one of the four outcomes, "${NOT_YET}" or "${NOTHING}"`);
      if (!o) continue;
      // WHICH bound the reading is attached to, read off the page's own words. Counting readings is
      // not enough: a verdict moved from one bound of an entry to another keeps every count equal
      // (adversarial review round 2, 2026-09-18).
      const m = words.match(/the (exact value|lower bound|upper bound) (\d+), credited to \[([^\]]+)\]/);
      if (!m) v.push(`${R(e.k, e.l)}: a reading's words do not name the bound they belong to: "${words}"`);
      else shownReads.push({ k: e.k, l: e.l, bound: m[1] === "exact value" ? "exact" : m[1].split(" ")[0], value: Number(m[2]), ref: unesc(m[3]), verdict: o[0] });
    }
    const flag = body.match(/<a class="flag" href="([^"]+)">/);
    const title = flag ? decodeURIComponent(flag[1].replace(/&amp;/g, "&").match(/[?&]title=([^&]*)/)?.[1] ?? "") : "";
    if (title !== `Row looks wrong: Small Ramsey Numbers ${R(e.k, e.l)}`) v.push(`${R(e.k, e.l)}: its looks-wrong link has title "${title}"`);
  }
  // 5. The jump links go exactly to the entries.
  const jumps = [...html.matchAll(/<nav class="jump"[\s\S]*?<\/nav>/g)][0]?.[0] ?? "";
  const targets = [...jumps.matchAll(/href="#r-(\d+)-(\d+)"/g)].map((m) => `${m[1]},${m[2]}`);
  if (targets.length !== ids.length || targets.some((t) => !ids.includes(t))) v.push("the jump links do not match the entries");
  // 6. It says what is covered and what has been read, and the counts add up.
  if (!html.includes(`revision #${doc.source.revision}`)) v.push("does not name the revision");
  if (!/<strong>Not covered<\/strong>/.test(html)) v.push("does not say what is not covered");
  const so = html.match(/So far, of the (\d+) values Table Ia prints: ([^<]*)\./);
  if (!so) v.push("does not state what has been checked");
  else {
    const nums = [...so[2].matchAll(/(sound|defective|unresolved|unreachable|not yet read|nothing to read it against) (\d+)/g)];
    if (nums.length !== 6) v.push(`the checked-so-far line names ${nums.length} states, expected the four outcomes, "${NOT_YET}" and "${NOTHING}"`);
    const sum = nums.reduce((a, m) => a + Number(m[2]), 0);
    const expected = entries.reduce((a, e) => a + Math.max(1, boundsFor(e, frame, left).length), 0);
    if (sum !== expected || Number(so[1]) !== expected) v.push(`the checked-so-far counts sum to ${sum} and the sentence names ${so[1]}, but Table Ia prints ${expected} values`);
  }
  // 7. Every stored reading is on the page, ON ITS OWN BOUND, with its own verdict. A reading the
  //    store holds and the page does not show is the store-vs-page gap (A-53) in the new area's
  //    first week, so it is refused, not tolerated.
  for (const r of rows) {
    if (!shownReads.some((s) => sameBound(s, r) && s.verdict === r.verdict)) {
      v.push(`the stored reading ${r.id ?? `${R(r.k, r.l)} ${r.bound}`} (${r.verdict} on the ${r.bound} bound ${r.value}, credited to [${r.ref}]) is not shown on the page`);
    }
  }
  if (shownReads.length !== rows.length) v.push(`the page shows ${shownReads.length} reading(s) and the store holds ${rows.length}`);
  return v;
}

function selftest() {
  const fail = (msg) => { console.error(`render-ramsey selftest FAIL: ${msg}`); process.exitCode = 1; return 1; };
  const doc = {
    source: { survey: "DS1", revision: 18, revisionDate: "2026-04-24", landing: "https://www.combinatorics.org/ojs/index.php/eljc/article/view/DS1", sha256: "ab".repeat(32), bytes: 1 },
    tableIa: [
      { k: 3, l: 3, exact: 6 },
      { k: 3, l: 9, exact: 36, lowerRef: "Ka2", upperRef: "GR" },
      { k: 5, l: 5, lower: 43, upper: 46, lowerRef: "Ex4", upperRef: "AnM4" },
      { k: 6, l: 14, upper: 5033, upperRef: "HW+" },
      { k: 10, l: 15, lower: 1313, lowerRef: "2.3.i" },
      { k: 4, l: 6, lower: 36, upper: 41, lowerRef: "<b>&x", upperRef: "MR5" },
    ],
    tableIb: [{ k: 5, l: 5, upper: 46 }, { k: 4, l: 6, upper: 40 }],
  };
  const html = renderRamsey(doc);
  const guard = (h) => guardPage(h, doc);

  // Each guard FIRES on a page carrying its condition. Meaning first.
  const fires = [
    ["record wording", html.replace("<h1>", "<h1>The record for "), /claims a record/],
    ["best-known wording", html.replace("exactly as printed", "the best known values"), /claims a record/],
    ["an external script", html.replace("</style>", '</style><script src="https://cdn.example/x.js"></script>'), /carries a <script>/],
    ["an unexpected host", html.replace('href="./"', 'href="https://example.org/"'), /unexpected host: example\.org/],
    ["a dropped entry", html.replace(/<section class="entry" id="r-6-14">[\s\S]*?<\/section>/, ""), /R\(6, 14\) is missing from the page/],
    ["a changed value", html.replace("43 ≤ R(5, 5) ≤ 46", "43 ≤ R(5, 5) ≤ 47"), /Table Ia value 46 is not shown/],
    ["a merged audit state", html.replace(": not yet read</dd>", ": checked</dd>"), /is not one of the four outcomes/],
    ["a bound's read state dropped", html.replace(/\n<dd class="none" data-state="not-yet-read">the upper bound 46[^\n]*<\/dd>/, ""), /R\(5, 5\): lists 1 read state\(s\), Table Ia prints 2/],
    ["a looks-wrong title that report-rate would not count", html.replace("title=Row%20looks%20wrong%3A%20Small%20Ramsey%20Numbers%20R(5%2C%205)", "title=Wrong%20R(5%2C%205)"), /looks-wrong link has title/],
    ["counts that do not sum", html.replace("not yet read 7", "not yet read 6"), /counts sum to 8/],
    ["no not-covered statement", html.replace("<strong>Not covered</strong>", "Not covered"), /does not say what is not covered/],
  ];
  for (const [label, mutated, re] of fires) {
    if (mutated === html) return fail(`${label}: the mutation did not land`);
    const found = guard(mutated);
    if (!found.some((m) => re.test(m))) return fail(`${label}: the guard did not fire (it said ${JSON.stringify(found)})`);
  }
  // A title prefix report-rate classifies as an arrival, checked with report-rate's own function.
  const flagHref = html.match(/<a class="flag" href="([^"]+)">/)[1].replace(/&amp;/g, "&");
  const flagTitle = decodeURIComponent(flagHref.match(/[?&]title=([^&]*)/)[1]);
  if (arrivalKind({ title: flagTitle, body: "" }) !== "row-link") return fail(`report-rate does not count "${flagTitle}" as a row-link arrival`);
  // A reader who RETITLES the report must still count. The body marker is what carries it, and
  // without one such a report was classified as outsideOther while the sum-check still reconciled
  // — invisible loss of the only arrival signal this area has (adversarial review, 2026-09-17).
  const flagBody = decodeURIComponent(flagHref.match(/[?&]body=([^&]*)/)[1]);
  if (arrivalKind({ title: "R(3,3) source disagreement", body: flagBody }) !== "row-link") {
    return fail(`a RETITLED report from this page is not counted as an arrival; its body begins ${JSON.stringify(flagBody.slice(0, 60))}`);
  }
  // The page's outcome vocabulary is the depth audit's, word for word.
  const verdicts = Object.keys(JSON.parse(readFileSync(join(ROOT, "continuity", "depth-audit.json"), "utf8")).meta.verdicts);
  if (JSON.stringify(verdicts) !== JSON.stringify(OUTCOMES.map(([n]) => n))) return fail(`the four outcomes ${JSON.stringify(OUTCOMES.map(([n]) => n))} differ from depth-audit.json's ${JSON.stringify(verdicts)}`);
  // Hostile text is escaped, including inside a reference key.
  if (/<b>&x/.test(html) || !/\[&lt;b&gt;&amp;x\]/.test(html)) return fail("a reference key with markup was not escaped");
  // A reading renders on ITS bound only, moves the counts, and every stored reading must be shown.
  const row = { k: 5, l: 5, bound: "upper", value: 46, ref: "AnM4", verdict: "SOUND", selection: "systematic" };
  const audited = renderRamsey(doc, [row]);
  const g = (h) => guardPage(h, doc, [row]);
  if (!/the upper bound 46, credited to \[AnM4\]: sound — the credited source was read, and it supports this bound\./.test(audited) || !/the lower bound 43, credited to \[Ex4\]: not yet read/.test(audited) || !/sound 1 \(the credited source was read/.test(audited) || g(audited).length) return fail(`an audited bound did not render cleanly: ${JSON.stringify(g(audited))}`);
  for (const [label, mutated, re] of [
    ["a stored reading missing from the page", audited.replace(/<dd data-state="sound">the upper bound 46[^\n]*<\/dd>/, '<dd class="none" data-state="not-yet-read">the upper bound 46, credited to [AnM4]: not yet read</dd>'), /is not shown on the page/],
    ["a state whose words say another outcome", audited.replace('data-state="sound"', 'data-state="unresolved"'), /is not one of the four outcomes/],
    // The count-preserving one: the verdict moves to the OTHER bound of the same entry, so the page
    // still shows exactly one reading and every count is unchanged.
    ["a verdict moved to another bound of the same entry",
      audited.replace(/<dd data-state="sound">the upper bound 46, credited to \[AnM4\]:([^\n]*)<\/dd>/, '<dd class="none" data-state="not-yet-read">the upper bound 46, credited to [AnM4]: not yet read</dd>')
        .replace('<dd class="none" data-state="not-yet-read">the lower bound 43, credited to [Ex4]: not yet read</dd>', '<dd data-state="sound">the lower bound 43, credited to [Ex4]: sound — the credited source was read, and it supports this bound. <a href="x">How it was read</a></dd>'),
      /is not shown on the page/],
  ]) {
    if (mutated === audited) return fail(`${label}: the mutation did not land`);
    if (!g(mutated).some((m) => re.test(m))) return fail(`${label}: the guard did not fire (it said ${JSON.stringify(g(mutated))})`);
  }
  // A reading of a value the table no longer prints is not drawn on the page at all; --check refuses
  // it through readStore before rendering, which ds1-depth's own selftest shows firing.
  if (/sound — /.test(renderRamsey(doc, [{ ...row, value: 47 }]))) return fail("a reading of a value the table does not print was rendered");
  // A malformed store is REFUSED, never read as empty. Both answers.
  for (const [label, parsed] of [
    ["rows as an object keyed by id", { rows: { "DS1-0001": row } }],
    ["no rows field at all", { meta: {} }],
    ["rows as a string", { rows: "five" }],
    ["unreadable JSON", { __unreadable: "Unexpected token }" }],
    ["not an object", [row]],
  ]) {
    if (!storeGate(true, parsed).error) return fail(`a store with ${label} was accepted`);
  }
  if (!storeGate(false, { rows: [row] }).error) return fail("a MISSING store was accepted");
  if (storeGate(true, { rows: [] }).error || storeGate(true, { rows: [row] }).rows.length !== 1) return fail("a well-formed store was refused");
  // The SILENT half, last: the well-formed page passes every guard.
  const clean = guard(html);
  if (clean.length) return fail(`the well-formed page failed its own guard: ${JSON.stringify(clean)}`);
  console.log(`render-ramsey selftest: PASS (${fires.length} guards each fire on their condition — record wording, an external script, an unexpected host, a dropped entry, a changed value, a merged audit state, a bound's state dropped, an uncounted report title, unsummed counts, no not-covered line; report-rate counts the row link; outcomes equal depth-audit.json's; markup escaped; a reading renders on its own bound only; a missing reading, a state whose words disagree, and a verdict moved to another bound of the same entry with every count preserved all fire; a reading of an unprinted value is not drawn; the well-formed page passes)`);
  return 0;
}

function main(args) {
  if (args.includes("--selftest")) return selftest();
  if (!existsSync(LEDGER)) { console.log(`ERROR — no table at ${LEDGER}`); return 2; }
  const doc = JSON.parse(readFileSync(LEDGER, "utf8"));
  // The depth readings (A-54 phase 4). A stored reading of a value the table no longer prints is
  // REFUSED here rather than silently left off the page.
  const storeExists = existsSync(STORE);
  let parsed = null;
  if (storeExists) { try { parsed = JSON.parse(readFileSync(STORE, "utf8")); } catch (e) { parsed = { __unreadable: e.message }; } }
  const got = storeGate(storeExists, parsed);
  if (got.error) { console.log(`REFUSED — continuity/depth-audit-ds1.json ${got.error}`); return args.includes("--check") ? 1 : 3; }
  const rows = got.rows;
  const r = rows.length ? readStore(parsed, frameOf(doc).frame) : { code: 0 };
  if (r.code !== 0) { console.log(`REFUSED — continuity/depth-audit-ds1.json does not match the committed table:\n  ${r.lines.join("\n  ")}`); return args.includes("--check") ? 1 : 3; }
  const html = renderRamsey(doc, rows);
  if (args.includes("--check")) {
    if (!existsSync(OUT)) { console.log("STALE — ramsey.html is missing; run node scripts/render-ramsey.mjs and commit it."); return 1; }
    const onDisk = readFileSync(OUT, "utf8");
    const norm = (s) => s.replace(/\r\n/g, "\n");
    const violations = guardPage(onDisk, doc, rows);
    if (violations.length) { console.log(`GUARD FAILED on the committed ramsey.html:\n  ${violations.join("\n  ")}`); return 1; }
    if (norm(onDisk) !== norm(html)) { console.log("STALE — ramsey.html does not match ledger/ejc-ds1/section-2-1.json; run node scripts/render-ramsey.mjs and commit it."); return 1; }
    console.log(`RESULT: PASS — ramsey.html matches the committed table (${entriesOf(doc).length} entries, revision #${doc.source.revision}) and the committed file passes its own guard.`);
    return 0;
  }
  const violations = guardPage(html, doc, rows);
  if (violations.length) { console.log(`REFUSED to write: the rendered page fails its own guard:\n  ${violations.join("\n  ")}`); return 3; }
  writeFileSync(OUT, html);
  console.log(`WROTE ramsey.html — ${entriesOf(doc).length} entries from revision #${doc.source.revision}.`);
  return 0;
}

if (isEntryModule(import.meta.url)) process.exitCode = main(process.argv.slice(2));
