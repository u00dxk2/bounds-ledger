#!/usr/bin/env node
// Drift check for OUR OWN outward artifact: the David-facing brief hosted at
// skylarkcreations.com/t/lanes/bounds-ledger, whose source is docs/lane-brief.md.
//
// usage: check-brief.mjs [--page-file <path>]      (--page-file reads the "live" page from
//                                                   disk instead of the network, for testing)
// exit 0 = every dated block in the source is present on the page · 1 = at least one is
// missing (the re-port did not land) · 2 = error
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

async function run(pageFile) {
  const md = await readFile(SOURCE, "utf8");
  const blocks = datedBlocks(md);
  if (!blocks.length) throw new Error(`no dated blocks found in ${SOURCE} — did the brief's format change?`);

  let page;
  if (pageFile) {
    page = textOf(await readFile(pageFile, "utf8"));
  } else {
    const res = await fetch(URL, { headers: { "user-agent": "bounds-ledger-brief-check" } });
    if (!res.ok) throw new Error(`GET ${URL}: HTTP ${res.status}`);
    page = textOf(await res.text());
  }

  const missing = [];
  for (const b of blocks) {
    const hasDate = page.includes(b.date);
    const hasProse = !b.prose || page.includes(b.prose);
    if (!hasDate || !hasProse) missing.push({ ...b, hasDate, hasProse });
  }

  if (!missing.length) {
    console.log(`brief: in sync — all ${blocks.length} dated block(s) present on ${URL}`);
    return 0;
  }
  console.log(`BRIEF STALE — ${missing.length} of ${blocks.length} dated block(s) missing from ${URL}`);
  for (const m of missing) {
    console.log(`  MISSING  ${m.header}`);
    console.log(`           date "${m.date}" ${m.hasDate ? "present" : "ABSENT"}; header prose ${m.hasProse ? "present" : "ABSENT"}`);
  }
  console.log(`\nThe source (docs/lane-brief.md) is ahead of the hosted page. This repo cannot fix it:`);
  console.log(`the port is the orchestrator's. Post a bus note naming the missing block(s) by date.`);
  return 1;
}

const args = process.argv.slice(2);
const pf = args.indexOf("--page-file");
try {
  process.exitCode = await run(pf >= 0 ? args[pf + 1] : null);
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exitCode = 2;
}
