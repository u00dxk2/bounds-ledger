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
export const OUTCOMES = [
  ["SOUND", "sound", "read, and it supports the entry"],
  ["DEFECTIVE", "defective", "read, and it does not support the entry"],
  ["UNRESOLVED", "unresolved", "reached, and could not settle it"],
  ["UNREACHABLE", "unreachable", "could not be read"],
];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

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

function auditText(e, audits) {
  const a = audits.find((x) => x.k === e.k && x.l === e.l);
  if (!a) return { html: `<dd class="none">not yet read</dd>`, state: null };
  const o = OUTCOMES.find(([name]) => name === a.verdict);
  if (!o) return { html: `<dd class="none">not yet read</dd>`, state: null };
  return { html: `<dd>${esc(o[1])} — the credited source was ${esc(o[2])}</dd>`, state: o[0] };
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

export function renderRamsey(doc, audits = []) {
  const entries = entriesOf(doc);
  const src = doc.source;
  const counts = Object.fromEntries(OUTCOMES.map(([n]) => [n, 0]));
  let notYet = 0;
  const blocks = [];
  let lastK = null;
  for (const e of entries) {
    const ia = iaText(e);
    const audit = auditText(e, audits);
    if (audit.state) counts[audit.state]++; else notYet++;
    if (e.k !== lastK) { blocks.push(`<h2 class="group" id="k-${e.k}">k = ${e.k}</h2>`); lastK = e.k; }
    blocks.push(`<section class="entry" id="r-${e.k}-${e.l}">
<h2><a href="#r-${e.k}-${e.l}">${esc(R(e.k, e.l))}</a></h2>
<dl>
<dt>Table Ia prints</dt><dd><span class="v">${esc(ia.value)}</span>${ia.refs ? `<span class="refs">${esc(ia.refs)}</span>` : ""}</dd>
<dt>Table Ib prints</dt><dd${e.ib ? "" : ' class="none"'}>${esc(ibText(e))}</dd>
<dt>Read against its credited source</dt>${audit.html}
</dl>
<a class="flag" href="${esc(flagUrl(e, doc))}">looks wrong?</a>
</section>`);
  }
  const byK = new Map();
  for (const e of entries) { if (!byK.has(e.k)) byK.set(e.k, []); byK.get(e.k).push(e.l); }
  const jump = [...byK].map(([k, ls]) => `<div><span class="k">k = ${k}</span> ${ls.map((l) => `<a href="#r-${k}-${l}" aria-label="${esc(R(k, l))}">${l}</a>`).join(" ")}</div>`).join("\n");
  const countLine = [...OUTCOMES.map(([n, label, what]) => `${label} ${counts[n]} (${what})`), `not yet read ${notYet}`].join(" · ");

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
<p><strong>What has been checked against its source.</strong> The survey credits each bound to a paper by the key shown beside it, such as [AnM4]. Opening each paper and reading it against the entry is the next step, and until an entry has been read, it says <em>not yet read</em>. So far: ${esc(countLine)}.</p>
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

function longDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}

// The page's own guard. Returns the violations found; an empty list is a pass. Run on a fixture in
// the selftest AND on the committed file by --check.
export function guardPage(html, doc) {
  const v = [];
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
    const auditDd = (body.split("Read against its credited source</dt>")[1] ?? "").match(/<dd[^>]*>([\s\S]*?)<\/dd>/);
    const state = auditDd ? auditDd[1] : "";
    if (!(state === "not yet read" || OUTCOMES.some(([, label]) => state.startsWith(`${label} — `)))) v.push(`${R(e.k, e.l)}: audit state "${state}" is not one of the four outcomes or "not yet read"`);
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
  const so = html.match(/So far: ([^<]*)\./);
  if (!so) v.push("does not state what has been checked");
  else {
    const nums = [...so[1].matchAll(/(sound|defective|unresolved|unreachable|not yet read) (\d+)/g)];
    if (nums.length !== 5) v.push(`the checked-so-far line names ${nums.length} states, expected the four outcomes and "not yet read"`);
    const sum = nums.reduce((a, m) => a + Number(m[2]), 0);
    if (sum !== entries.length) v.push(`the checked-so-far counts sum to ${sum}, the page holds ${entries.length} entries`);
  }
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
    ["a merged audit state", html.replace('<dd class="none">not yet read</dd>', "<dd>checked</dd>"), /is not one of the four outcomes/],
    ["a looks-wrong title that report-rate would not count", html.replace("title=Row%20looks%20wrong%3A%20Small%20Ramsey%20Numbers%20R(5%2C%205)", "title=Wrong%20R(5%2C%205)"), /looks-wrong link has title/],
    ["counts that do not sum", html.replace("not yet read 6", "not yet read 5"), /counts sum to 5/],
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
  // An audited entry renders its outcome and moves the counts.
  const audited = renderRamsey(doc, [{ k: 5, l: 5, verdict: "SOUND" }]);
  if (!/sound — the credited source was read, and it supports the entry/.test(audited) || !/sound 1 \(read/.test(audited) || guard(audited).length) return fail(`an audited entry did not render cleanly: ${JSON.stringify(guard(audited))}`);
  // The SILENT half, last: the well-formed page passes every guard.
  const clean = guard(html);
  if (clean.length) return fail(`the well-formed page failed its own guard: ${JSON.stringify(clean)}`);
  console.log(`render-ramsey selftest: PASS (${fires.length} guards each fire on their condition — record wording, an external script, an unexpected host, a dropped entry, a changed value, a merged audit state, an uncounted report title, unsummed counts, no not-covered line; report-rate counts the row link; outcomes equal depth-audit.json's; markup escaped; an audited entry renders; the well-formed page passes)`);
  return 0;
}

function main(args) {
  if (args.includes("--selftest")) return selftest();
  if (!existsSync(LEDGER)) { console.log(`ERROR — no table at ${LEDGER}`); return 2; }
  const doc = JSON.parse(readFileSync(LEDGER, "utf8"));
  const html = renderRamsey(doc);
  if (args.includes("--check")) {
    if (!existsSync(OUT)) { console.log("STALE — ramsey.html is missing; run node scripts/render-ramsey.mjs and commit it."); return 1; }
    const onDisk = readFileSync(OUT, "utf8");
    const norm = (s) => s.replace(/\r\n/g, "\n");
    const violations = guardPage(onDisk, doc);
    if (violations.length) { console.log(`GUARD FAILED on the committed ramsey.html:\n  ${violations.join("\n  ")}`); return 1; }
    if (norm(onDisk) !== norm(html)) { console.log("STALE — ramsey.html does not match ledger/ejc-ds1/section-2-1.json; run node scripts/render-ramsey.mjs and commit it."); return 1; }
    console.log(`RESULT: PASS — ramsey.html matches the committed table (${entriesOf(doc).length} entries, revision #${doc.source.revision}) and the committed file passes its own guard.`);
    return 0;
  }
  const violations = guardPage(html, doc);
  if (violations.length) { console.log(`REFUSED to write: the rendered page fails its own guard:\n  ${violations.join("\n  ")}`); return 3; }
  writeFileSync(OUT, html);
  console.log(`WROTE ramsey.html — ${entriesOf(doc).length} entries from revision #${doc.source.revision}.`);
  return 0;
}

if (isEntryModule(import.meta.url)) process.exitCode = main(process.argv.slice(2));
