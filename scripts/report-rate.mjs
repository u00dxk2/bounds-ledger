#!/usr/bin/env node
// G-3's missing leading indicator: has anyone OUTSIDE Skylark used the ledger and acted on it?
//
// WHY THIS EXISTS. G-3 reads 0 and will keep reading 0 for reasons that carry no information,
// because nothing counts the one intent signal this lane already emits. Every one of the 222
// rows on the public page carries its own prefilled "looks wrong?" link (render-site.mjs
// flagUrl), and a visitor who uses it files an issue whose title and body we authored. Nothing
// has ever counted those.
//
// WHY IT COUNTS ARRIVALS, NOT CLICKS. The page is static on GitHub Pages: we have no server
// logs and are not adding an analytics stack to get them. That constraint turns out to be an
// improvement — a click measures curiosity, a filed report measures someone who read a row,
// disbelieved it, and did something. The second is what G-3 actually asks about.
//
// WHY THE ZERO IS TRUSTWORTHY. A zero from a dead probe is indistinguishable from a measured
// zero, so this refuses to print a bare 0. It reports the RAW denominator, classifies every
// issue, and requires the classified parts to SUM to the raw count — 0 outside reports against
// 25 issues we can see and account for is a measurement; 0 against 0 fetched is a broken probe,
// and it says so. The number-provenance floor, applied to our own instrument.
//
// "IS THIS NUMBER MINE?" Our own CI files most of the issues in this repo (the drift alarm posts
// as app/github-actions) and we file some by hand. Those are excluded by AUTHOR and reported
// separately, exactly as the traffic sampler's clone count should have been and was not.

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const OWNER = "u00dxk2";
export const REPO = "u00dxk2/bounds-ledger";
// The public flip. Used only to say how long the zero has been a zero.
export const PUBLIC_SINCE = "2026-08-08";

// Authors whose issues are OURS. The bot files the drift alarm; the owner is us.
export function isOurs(issue) {
  const login = issue?.author?.login ?? "";
  return login === OWNER || login.startsWith("app/") || login === "github-actions";
}

// The two prefilled shapes render-site.mjs emits. Title match is primary; the body marker is a
// fallback because a reporter may retitle the issue before filing it, and that is a REAL report
// we would otherwise drop.
export function arrivalKind(issue) {
  const title = String(issue?.title ?? "");
  const body = String(issue?.body ?? "");
  if (/^Row looks wrong:/.test(title)) return "row-link";
  if (/^Constant not tracked:/.test(title)) return "empty-state";
  if (/^Ledger mirror: upstream /m.test(body)) return "row-link";
  return null;
}

export function classify(issues) {
  const out = { raw: issues.length, ours: 0, outsideArrivals: [], outsideOther: 0, byKind: {} };
  for (const it of issues) {
    if (isOurs(it)) { out.ours++; continue; }
    const kind = arrivalKind(it);
    if (kind) {
      out.outsideArrivals.push({ number: it.number, kind, title: it.title });
      out.byKind[kind] = (out.byKind[kind] ?? 0) + 1;
    } else {
      out.outsideOther++;
    }
  }
  // The sum-check. If these do not reconcile, the classifier is lying and the caller must not
  // report any component as a measurement.
  out.reconciles = out.ours + out.outsideArrivals.length + out.outsideOther === out.raw;
  return out;
}

export function daysSince(dateStr, today) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [Y, M, D] = today.split("-").map(Number);
  return Math.round((Date.UTC(Y, M - 1, D) - Date.UTC(y, m - 1, d)) / 86400000);
}

function mtToday(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: "America/Denver" });
}

function fetchIssues() {
  // `gh issue list` excludes pull requests by construction. The REST .../issues endpoint does
  // NOT — it counts PRs as issues, which silently inflated an open-issue count in this repo on
  // 2026-08-17. Using the porcelain here is deliberate.
  const raw = execFileSync("gh", [
    "issue", "list", "--repo", REPO, "--state", "all", "--limit", "500",
    "--json", "number,title,author,body,createdAt",
  ], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  return JSON.parse(raw);
}

async function selftest() {
  const assert = (await import("node:assert/strict")).default;

  const bot = { number: 1, title: "Drift: constants/2a.md (2026-08-12)", author: { login: "app/github-actions" }, body: "" };
  const mine = { number: 2, title: "Check error: bounds-ledger could not reach 2 cited source(s)", author: { login: OWNER }, body: "" };
  const rowReport = { number: 3, title: "Row looks wrong: The real Grothendieck constant (10a)", author: { login: "a-stranger" }, body: "Constant: ...\nLedger mirror: upstream 5c4aeee" };
  const retitled = { number: 4, title: "this bound moved in June", author: { login: "a-stranger" }, body: "Constant: X (12a)\nLedger mirror: upstream 5c4aeee\n" };
  const notTracked = { number: 5, title: "Constant not tracked: Freiman", author: { login: "a-stranger" }, body: "" };
  const unrelated = { number: 6, title: "typo in the readme", author: { login: "a-stranger" }, body: "" };

  // FIRES: each arrival shape is recognised, including the retitled one via its body marker.
  assert.equal(arrivalKind(rowReport), "row-link", "the prefilled row title must be recognised");
  assert.equal(arrivalKind(retitled), "row-link", "a RETITLED report must still be caught by its body marker");
  assert.equal(arrivalKind(notTracked), "empty-state", "the empty-state prefill must be recognised");

  // SILENT: ours and unrelated are not arrivals.
  assert.equal(arrivalKind(unrelated), null, "an unrelated outside issue is not an arrival");
  assert.equal(isOurs(bot), true, "the CI bot is ours");
  assert.equal(isOurs(mine), true, "the owner is ours");
  assert.equal(isOurs(rowReport), false, "a stranger is not ours");

  // The whole-corpus behaviour, including the sum-check.
  const c = classify([bot, mine, rowReport, retitled, notTracked, unrelated]);
  assert.equal(c.raw, 6);
  assert.equal(c.ours, 2, "both of ours must be excluded by author");
  assert.equal(c.outsideArrivals.length, 3, "three outside arrivals");
  assert.equal(c.outsideOther, 1, "one unrelated outside issue");
  assert.equal(c.reconciles, true, "parts must sum to the raw count");

  // THE MEASURED-ZERO CASE, which is the state this repo is actually in: issues exist, all ours,
  // zero arrivals — and it must still reconcile, because that is what makes the zero a
  // measurement rather than a dead probe.
  const allOurs = classify([bot, mine]);
  assert.equal(allOurs.outsideArrivals.length, 0);
  assert.equal(allOurs.raw, 2, "the denominator must be reported even when the numerator is 0");
  assert.equal(allOurs.reconciles, true, "a measured zero still reconciles");

  // A BROKEN probe (nothing fetched) must be distinguishable from a measured zero.
  const empty = classify([]);
  assert.equal(empty.raw, 0, "an empty fetch reports a zero DENOMINATOR, which the caller must refuse to read as a measurement");

  assert.equal(daysSince("2026-08-08", "2026-08-25"), 17, "day arithmetic");

  console.log("report-rate selftest: PASS (recognises the prefilled row title, a RETITLED report via its body marker, and the empty-state prefill; " +
    "silent on an unrelated outside issue; excludes the CI bot and the owner by author; parts sum to the raw count; " +
    "a measured zero still reports its denominator and reconciles; an empty fetch is distinguishable from a measured zero)");
}

async function main() {
  if (process.argv.includes("--selftest")) { await selftest(); return; }

  const today = mtToday();
  let issues;
  try {
    issues = fetchIssues();
  } catch {
    console.log("report-rate: COULD NOT RUN — gh unavailable or the issue list could not be read.");
    console.log("A zero here would be indistinguishable from a measured zero, so no figure is printed.");
    process.exit(2);
  }

  const c = classify(issues);
  console.log(`# Report arrivals — ${today} MT · ${daysSince(PUBLIC_SINCE, today)} day(s) since the public flip`);
  console.log(`raw issues fetched: ${c.raw} (pull requests excluded by construction — gh issue list, not the REST issues endpoint)`);
  console.log(`  ours (CI bot + owner), excluded: ${c.ours}`);
  console.log(`  outside, not an arrival:        ${c.outsideOther}`);
  console.log(`  OUTSIDE ARRIVALS:               ${c.outsideArrivals.length}`);
  for (const a of c.outsideArrivals) console.log(`    #${a.number} [${a.kind}] ${a.title}`);

  if (!c.reconciles) {
    console.log(`\nRECONCILE FAILED: ${c.ours} + ${c.outsideArrivals.length} + ${c.outsideOther} != ${c.raw}.`);
    console.log("Do NOT quote any component above — the classifier is not accounting for every row.");
    process.exit(3);
  }
  if (c.raw === 0) {
    console.log("\nDENOMINATOR IS ZERO — nothing was fetched, so the 0 above is a DEAD PROBE, not a measurement.");
    process.exit(2);
  }

  console.log(`\nparts reconcile: ${c.ours} + ${c.outsideArrivals.length} + ${c.outsideOther} = ${c.raw}.`);
  console.log(`So ${c.outsideArrivals.length} is a MEASURED figure: the probe demonstrably sees ${c.raw} issue(s) and accounts for every one.`);
  console.log("This counts ARRIVALS, never clicks — the page is static and we are not adding an analytics stack.");
  console.log("A click measures curiosity; a filed report measures someone who read a row, disbelieved it, and acted.");
  console.log("G-3 asks for n=1. This is its leading indicator, and it renders no verdict.");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
