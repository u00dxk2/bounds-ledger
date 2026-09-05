#!/usr/bin/env node
// A-25: a deferral must carry a machine-readable expiry and a runnable release command,
// and something on a rail must evaluate them.
//
// WHY THIS EXISTS. Three stale blockers in this repo were each caught only because a human
// happened to re-read a sentence: the F-2 public-flip blocker (corrected 2026-08-17, the gate
// had cleared on 08-08), A-7 still claiming the repo was private (corrected 08-16), and F-2
// deferred because "two diffs are queued in the review lane" — those merged 08-18 and the
// staleness was found on 08-20, two days late, INSIDE the document that names the stale-blocker
// pattern. A deferral written in prose has no expiry, no owner, and nothing that reads it, so
// it survives its own cause and dies only by luck.
//
// WHAT IT DELIBERATELY DOES NOT DO — the load-bearing design constraint, from A-25 note4:
// it does NOT fire because a deferral exists. A check that is red whenever anything is
// outstanding is a permanently-red alarm, and a permanently-red alarm carries exactly as much
// information as a permanently-green one — this lane's founding defect. It fires on EXPIRY (the
// cited date has passed) and on MALFORMEDNESS (the deferral never named a date or a release
// command at all). A well-formed, unexpired deferral is silent, however many there are.
//
// WHY A COMMAND AND NOT A CONDITION (A-27 note2 a1): a hold names its release COMMAND, not its
// release condition. The 2026-08-21 primer named "if the review lane has returned" as the gate
// on this lane's largest ship four times and never once said how to evaluate it. releaseTest is
// required to be a non-empty string so the next reader runs it instead of inventing a test.
//
// THE PR LEG CANNOT REPORT SUCCESS WHEN IT CANNOT RUN. If --prs is asked for and gh is absent
// or returns nothing parseable, this exits 2 (could-not-run), never 0. That is A-19 N-2's
// lesson — a guard that cannot run must not read as a pass — applied here rather than only
// written down.

import { readFileSync, existsSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function mtToday(now = new Date()) {
  // en-CA renders YYYY-MM-DD; timeZone is what makes it Mountain rather than host-local UTC.
  return now.toLocaleDateString("en-CA", { timeZone: "America/Denver" });
}

// A deferral DECLARES itself. Scanning every open item would make the check fire on existence
// (see the note above), so the marker is explicit and opt-in.
export function isDeferral(item) {
  return item?.deferral === true && item?.status === "open";
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// The ITEMS leg. Pure: no clock, no filesystem, no network — today is passed in.
export function itemFindings(items, today) {
  const findings = [];
  for (const item of items) {
    if (!isDeferral(item)) continue;
    const { id, expiresOn, releaseTest } = item;

    if (!expiresOn || !ISO_DATE.test(String(expiresOn))) {
      findings.push({ id, kind: "MALFORMED", detail: "no machine-readable expiresOn (YYYY-MM-DD)" });
    } else if (String(expiresOn) < today) {
      findings.push({ id, kind: "EXPIRED", detail: `expiresOn ${expiresOn} has passed (today ${today})` });
    }

    if (typeof releaseTest !== "string" || releaseTest.trim() === "") {
      findings.push({ id, kind: "MALFORMED", detail: "no runnable releaseTest command" });
    }
  }
  return findings;
}

// The PR leg as a pure predicate over a body string, so both answers are testable offline.
// A held PR must say how it gets released.
//
// THE MARKER SHAPE WAS TAKEN FROM THE REAL PRs, NOT INVENTED. The first draft of this required
// a literal "Release:" line and PASSED its own selftest — against fixtures this file made up.
// Run against the actual bodies of #26 and #27 it reported a finding on BOTH, because the house
// form this lane already uses is a bold "**Release test**" heading followed by the command. A
// predicate tested only against a retyped copy of what you expect tests the retyping; the
// fixtures below are now the verbatim opening of PR #26's line 44.
const RELEASE_MARKER = /^\s*\*{0,2}Release(?:\s+test)?\*{0,2}\s*[:(]/mi;

export function prBodyFinding(body) {
  const text = String(body ?? "");
  if (!/\bHELD\b/.test(text)) return null;
  if (RELEASE_MARKER.test(text)) return null;
  return { kind: "MALFORMED", detail: "PR body says HELD with no Release test naming how the hold is released" };
}

export function countDeferrals(items) {
  return items.filter(isDeferral).length;
}

function loadItems(root = ROOT) {
  const path = join(root, "continuity", "items.json");
  if (!existsSync(path)) return [];
  const parsed = JSON.parse(readFileSync(path, "utf8"));
  return Array.isArray(parsed) ? parsed : (parsed.items ?? []);
}

async function livePrFindings() {
  const { execFileSync } = await import("node:child_process");
  let raw;
  try {
    raw = execFileSync("gh", ["pr", "list", "--state", "open", "--json", "number,body"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return { ok: false, findings: [], examined: 0 };
  }
  // An empty string is also what a spawn that never ran returns, so parse before trusting it.
  let prs;
  try { prs = JSON.parse(raw); } catch { return { ok: false, findings: [], examined: 0 }; }
  if (!Array.isArray(prs)) return { ok: false, findings: [], examined: 0 };

  const findings = [];
  for (const pr of prs) {
    const f = prBodyFinding(pr.body);
    if (f) findings.push({ id: `PR #${pr.number}`, ...f });
  }
  return { ok: true, findings, examined: prs.length };
}

async function selftest() {
  const assert = (await import("node:assert/strict")).default;
  const TODAY = "2026-08-25";

  const wellFormed = { id: "X-1", status: "open", deferral: true, expiresOn: "2026-09-01", releaseTest: "gh pr view 9" };
  const expired    = { id: "X-2", status: "open", deferral: true, expiresOn: "2026-08-24", releaseTest: "gh pr view 9" };
  const undated    = { id: "X-3", status: "open", deferral: true, releaseTest: "gh pr view 9" };
  const noCommand  = { id: "X-4", status: "open", deferral: true, expiresOn: "2026-09-01" };
  const closedOld  = { id: "X-5", status: "closed", deferral: true, expiresOn: "2026-01-01" };
  const plainOpen  = { id: "X-6", status: "open", expiresOn: "2026-01-01" };

  // Prove the fixtures are actually SEEN before asserting anything about silence — an empty
  // scan is silent for the wrong reason, which is how an absence assertion fools itself.
  assert.equal(countDeferrals([wellFormed, expired, undated, noCommand, closedOld, plainOpen]), 4,
    "the scan must recognise exactly the four OPEN declared deferrals");

  // FIRES — expiry.
  const fExpired = itemFindings([expired], TODAY);
  assert.equal(fExpired.length, 1, "an expired deferral must produce exactly one finding");
  assert.equal(fExpired[0].kind, "EXPIRED");

  // FIRES — malformed, each half independently.
  assert.equal(itemFindings([undated], TODAY).some(f => f.kind === "MALFORMED"), true,
    "a deferral with no expiresOn must fire");
  assert.equal(itemFindings([noCommand], TODAY).some(f => /releaseTest/.test(f.detail)), true,
    "a deferral with no releaseTest must fire");

  // SILENT — a well-formed, unexpired deferral. This half is what protects against the
  // permanently-red alarm the design forbids: existence alone is not a finding.
  assert.deepEqual(itemFindings([wellFormed], TODAY), [],
    "a well-formed unexpired deferral must be SILENT — firing on existence is the forbidden design");

  // SILENT — scope. A closed row and an undeclared open row are not this check's business.
  assert.deepEqual(itemFindings([closedOld, plainOpen], TODAY), [],
    "closed rows and undeclared items must not be scanned");

  // Boundary: expiring TODAY has not yet lapsed.
  assert.deepEqual(itemFindings([{ ...expired, expiresOn: TODAY }], TODAY), [],
    "a deferral expiring today has not yet lapsed");

  // PR leg, both answers. The SILENT fixture is the verbatim opening of PR #26's real release
  // line — not a retyped approximation of it, which is what the first draft got wrong.
  const realHeld = "**HELD for the cross-family review lane — do not merge until the read-only review returns.**";
  const realRelease = "**Release test** (run this rather than guessing whether the hold still applies): `gh pr view 26`";

  assert.ok(prBodyFinding(realHeld), "the real HELD opening with no release line must fire");
  assert.equal(prBodyFinding(`${realHeld}\n\n${realRelease}`), null,
    "the real HELD body WITH its real release line must be silent");
  assert.equal(prBodyFinding("This is HELD pending review.\nRelease: gh pr view 26 --json state"), null,
    "the plain 'Release:' form must also be accepted");
  assert.equal(prBodyFinding("Ordinary PR body, ready to merge."), null,
    "a body that is not held must not fire");
  assert.equal(prBodyFinding("**Release test** (gh pr view 26)"), null,
    "a release line without HELD is not a finding");
  // FIRES: the word "released" in ordinary prose is not a release command. If this passed as
  // silent, any held PR mentioning a release in passing would launder itself into compliance.
  assert.ok(prBodyFinding("We HELD off, then released the branch."),
    "prose containing 'released' must NOT satisfy the marker — it names no command");
  assert.equal(prBodyFinding(""), null, "an empty body is not a held PR");

  console.log("check-deferrals selftest: PASS (fires on expiry, on a missing expiresOn and on a missing releaseTest; " +
    "silent on a well-formed unexpired deferral, on closed and undeclared rows, and on the same-day boundary; " +
    "PR leg fires on HELD-without-Release and stays silent on a released, an ordinary and an empty body; " +
    "all four declared deferrals proven visible to the scan before any silence was asserted)");
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) { await selftest(); return; }

  const today = mtToday();
  const items = loadItems();
  const deferrals = countDeferrals(items);
  const findings = itemFindings(items, today);

  let prNote = "PR leg not run (pass --prs to include open pull requests)";
  let couldNotRun = false;
  if (args.includes("--prs")) {
    const pr = await livePrFindings();
    if (!pr.ok) {
      couldNotRun = true;
      prNote = "PR leg COULD NOT RUN — gh unavailable or returned nothing parseable";
    } else {
      findings.push(...pr.findings);
      prNote = `PR leg examined ${pr.examined} open PR(s)`;
    }
  }

  console.log(`check-deferrals: ${deferrals} declared deferral(s) in continuity/items.json, today ${today} MT`);
  console.log(`  ${prNote}`);
  for (const f of findings) console.log(`  ${f.kind}  ${f.id} — ${f.detail}`);

  if (couldNotRun) {
    console.log("RESULT: COULD NOT RUN (exit 2) — a guard that did not run must not report success");
    process.exit(2);
  }
  if (findings.length) {
    console.log(`RESULT: ${findings.length} finding(s) (exit 3)`);
    process.exit(3);
  }
  console.log("RESULT: PASS — every declared deferral carries an unexpired expiresOn and a releaseTest (exit 0)");
}

// ENTRY-POINT GUARD. Without it, importing this module to reuse prBodyFinding RUNS the check —
// it prints a verdict nobody asked for and can process.exit() out of its importer. That is F2
// from the PR #26 review (the same omission in render-site.mjs), and it recurred here in new
// code written the same week; caught because the PR-leg demo imported the predicate and the
// check's own output appeared above the demo's.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  await main();
} else if (process.argv[1]?.endsWith("check-deferrals.mjs")) {
  console.error("check-deferrals: COULD NOT RUN — invoked as main but module identity did not match");
  process.exit(2);
}
