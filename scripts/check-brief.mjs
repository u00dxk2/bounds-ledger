#!/usr/bin/env node
// Drift check for OUR OWN outward artifact: the David-facing brief hosted at
// skylarkcreations.com/t/lanes/bounds-ledger, whose source is docs/lane-brief.md.
//
// usage: check-brief.mjs [--page-file <path>]      (--page-file reads the "live" page from
//                                                   disk instead of the network, for testing)
//        check-brief.mjs --selftest                (network-free; asserts all three verdicts)
// exit 0 = every dated block in the source is present on the page · 1 = at least one is
// missing (the re-port did not land) · 2 = error · 3 = the response is not the brief at all
// (sign-in wall / wrong or renamed port), so staleness cannot be assessed from here
//
// Why this exists: the brief is ported to the site by the orchestrator, not by this repo, so
// the page can silently fall behind its source. It did — twice, found both times by a human
// hand-fetching and grepping (2026-07-30, 2026-07-31). A lane that runs a drift alarm on
// someone else's repo while its own cited artifact rots by hand-inspection is not applying
// its own thesis. This is that thesis, pointed inward.
//
// NOT wired into the CI drift job on purpose. It would go red immediately and STAY red until
// an orchestrator re-port lands — and a permanently-red alarm carries exactly as much
// information as a permanently-green one, which is this lane's founding defect. It runs in
// `npm run check` (every local/live run) and joins CI the run after the page first reads
// green. G-1's green streak measures the LEDGER; a stale brief must not silently consume it.

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "docs", "lane-brief.md");
const URL = "https://skylarkcreations.com/t/lanes/bounds-ledger";

const squash = (s) => s.replace(/\s+/g, " ").trim();
// The page is server-rendered HTML with the prose also embedded in Next.js flight data, where
// quotes arrive escaped. Strip tags, then decode the entities that actually appear in our text.
const textOf = (html) =>
  squash(
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/&#x27;|&#39;|\\u2019/g, "'")
      .replace(/&quot;|\\"/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
  );

// A dated block is a blockquoted H2 carrying a date: "> ## Update — 28 July 2026: …" or
// "> ## ✅ Sent — 24 July 2026". Both the DATE and the header's prose must reach the page —
// the date alone can appear incidentally in body text (it does), so it is not sufficient.
// The page must first BE the brief. If it is not — a sign-in wall, a 404 shell, a wrong or
// renamed port — then every dated block reads "missing" and the stale verdict below names a
// cause that is false with total confidence. That happened: on 2026-08-02 skylarkcreations.com
// put /t/* behind a Google sign-in wall (307 → sign-in page, HTTP 200, res.ok true), and this
// script reported "4 of 4 dated blocks missing … the port is the orchestrator's" about a page
// it had never actually seen. Same family as the alarm that titled a network flake "Drift:"
// (A-5): an instrument speaking confidently about a condition it cannot observe.
//
// The presence test is the SOURCE'S OWN H1 — derived, never hardcoded, per the rule that burned
// the two hand-checks: a check that inherits its search term from a doc can only confirm that doc.
function sourceTitle(md) {
  const m = md.match(/^#\s+(.+)$/m);
  if (!m) throw new Error(`no H1 found in ${SOURCE} — did the brief's format change?`);
  return squash(m[1]);
}

function datedBlocks(md) {
  const out = [];
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^>\s*#{2,3}\s*(.+)$/);
    if (!m) continue;
    const header = squash(m[1].replace(/[✅❌⚠]/g, ""));
    const date = header.match(/(\d{1,2} \w+ \d{4})/)?.[1];
    if (!date) continue;
    // prose after the date, if any (":"-separated); may be empty for a bare "Sent — 24 July 2026"
    const prose = squash(header.slice(header.indexOf(date) + date.length).replace(/^[:\s—-]+/, ""));
    out.push({ header, date, prose });
  }
  return out;
}

// Pure verdict logic, so every branch is reachable from --selftest without a network.
// Returns { code, lines }.
function assess(md, page, redirectedTo) {
  const lines = [];
  const title = sourceTitle(md);
  const blocks = datedBlocks(md);
  if (!blocks.length) throw new Error(`no dated blocks found in ${SOURCE} — did the brief's format change?`);

  if (!page.includes(title)) {
    lines.push(`BRIEF UNVERIFIABLE — the response from ${URL} is not the brief.`);
    lines.push(`  the source's title ("${title}") is absent from what came back`);
    if (redirectedTo) lines.push(`  the request was REDIRECTED to ${redirectedTo} — a wall, not a stale port`);
    lines.push(``);
    lines.push(`This is NOT evidence that the re-port is behind: staleness cannot be assessed from`);
    lines.push(`a page we never received. Check whether the route is gated or renamed first.`);
    return { code: 3, lines };
  }

  const missing = [];
  for (const b of blocks) {
    const hasDate = page.includes(b.date);
    const hasProse = !b.prose || page.includes(b.prose);
    if (!hasDate || !hasProse) missing.push({ ...b, hasDate, hasProse });
  }

  if (!missing.length) {
    lines.push(`brief: in sync — all ${blocks.length} dated block(s) present on ${URL}`);
    return { code: 0, lines };
  }
  lines.push(`BRIEF STALE — ${missing.length} of ${blocks.length} dated block(s) missing from ${URL}`);
  for (const m of missing) {
    lines.push(`  MISSING  ${m.header}`);
    lines.push(`           date "${m.date}" ${m.hasDate ? "present" : "ABSENT"}; header prose ${m.hasProse ? "present" : "ABSENT"}`);
  }
  lines.push(``);
  lines.push(`The source (docs/lane-brief.md) is ahead of the hosted page. This repo cannot fix it:`);
  lines.push(`the port is the orchestrator's. Post a bus note naming the missing block(s) by date.`);
  return { code: 1, lines };
}

async function run(pageFile) {
  const md = await readFile(SOURCE, "utf8");

  let page;
  let redirectedTo = null;
  if (pageFile) {
    page = textOf(await readFile(pageFile, "utf8"));
  } else {
    const res = await fetch(URL, { headers: { "user-agent": "bounds-ledger-brief-check" } });
    if (!res.ok) throw new Error(`GET ${URL}: HTTP ${res.status}`);
    if (res.redirected && res.url !== URL) redirectedTo = res.url;
    page = textOf(await res.text());
  }

  const { code, lines } = assess(md, page, redirectedTo);
  console.log(lines.join("\n"));
  return code;
}

// Both sides of the gate branch, plus proof it stays SILENT while a real stale page still
// fires — a gate check that swallowed the stale verdict would pass "can it fire" and blind
// the alarm it lives inside (W-4 / KP-78: the second question is what it can no longer see).
function selftest() {
  const md = [
    `# A test brief title`,
    ``,
    `> ## Update — 1 January 2026: the first thing`,
    `> ## Update — 2 January 2026: the second thing`,
  ].join("\n");
  const synced = textOf(
    `<h1>A test brief title</h1><h2>Update &mdash; 1 January 2026: the first thing</h2>` +
      `<h2>Update &mdash; 2 January 2026: the second thing</h2>`
  );
  const stale = textOf(`<h1>A test brief title</h1><h2>Update — 1 January 2026: the first thing</h2>`);
  const wall = textOf(`<h1>Sign in</h1><p>Sign in to Skylark Creations to continue.</p>`);

  const cases = [
    ["in-sync page", synced, null, 0],
    ["stale page (gate must stay silent)", stale, null, 1],
    ["sign-in wall", wall, null, 3],
    ["sign-in wall behind a redirect", wall, "https://skylarkcreations.com/signin", 3],
  ];
  for (const [name, page, red, want] of cases) {
    const { code, lines } = assess(md, page, red);
    if (code !== want) {
      console.error(`check-brief selftest FAIL: ${name} => exit ${code}, expected ${want}`);
      console.error(lines.join("\n"));
      return 1;
    }
  }
  // the wall verdict must not read as staleness — that mis-attribution is the whole defect
  const wallOut = assess(md, wall, null).lines.join("\n");
  if (/BRIEF STALE|port is the orchestrator/.test(wallOut)) {
    console.error(`check-brief selftest FAIL: wall verdict still blames the port`);
    return 1;
  }
  console.log(`check-brief selftest: PASS (${cases.length} verdict cases + wall-not-blamed-on-port guard)`);
  return 0;
}

const args = process.argv.slice(2);
const pf = args.indexOf("--page-file");
try {
  process.exitCode = args.includes("--selftest") ? selftest() : await run(pf >= 0 ? args[pf + 1] : null);
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exitCode = 2;
}
