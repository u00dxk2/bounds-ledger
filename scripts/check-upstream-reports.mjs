#!/usr/bin/env node
// A-33 leg 1: has an outward artifact WE filed changed STATE since we last recorded it?
//
// WHY THIS EXISTS. On 2026-08-23 an outside contributor fixed constants/87a.md citing our issue
// #150, and Terence Tao closed that issue. Our mirror ingested the fix and the page's change
// classifier labelled it "text edited, bound unchanged" — correct about the bytes and wrong about
// the event. The instrument watched the exact thing the lane's top goal exists to detect and
// reported it as routine. It was found by accident three days later.
//
// WHAT IT FIRES ON, and this is the whole design (A-33 note4). NOT "a filed report is closed" —
// once #150 is closed it is closed forever, so that check would fire every day from now on, and an
// alarm that cannot go quiet is this lane's founding defect. It fires on the TRANSITION: the live
// state differs from the state recorded in ledger/upstream-reports.json. The baseline lives in the
// repo and is updated deliberately when a finding is dispositioned, which is what lets it fall
// silent again.
//
// WHAT IT NEVER DOES. It renders no verdict and closes nothing. Deciding that an upstream change
// was CAUSED by our report is a judgment, so the output is "go look" (A-33 note3). And a hit here
// can never be a G-4 arrival: G-4 requires a causal path containing no artifact we authored and
// sent, and every row in that file is such an artifact by construction.
//
// Needs `gh`; never runs in CI (the reports live in someone else's repo and the auth is local).

import { readFileSync, realpathSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STORE = join(ROOT, "ledger", "upstream-reports.json");

/**
 * Compare recorded reports against a live listing.
 *
 * `changed` — a report whose state moved since we recorded it. That is the transition, and the
 * only thing worth a human's attention.
 * `unrecorded` — live rows we hold no baseline for. An artifact we sent and never wrote down is
 * a gap in the baseline itself, and staying silent about it would make the store look complete.
 * `missing` — recorded rows absent from the live listing. Never treated as "deleted": the listing
 * is filtered by author and repo, so absence is far more likely to mean the query changed shape.
 */
export function diffReports(recorded, live) {
  const byNumber = new Map((live || []).map((r) => [Number(r.number), r]));
  const seen = new Set();
  const changed = [];
  const missing = [];
  for (const rec of recorded || []) {
    const n = Number(rec.issue);
    const now = byNumber.get(n);
    if (!now) { missing.push(rec); continue; }
    seen.add(n);
    if (String(now.state) !== String(rec.state)) {
      changed.push({ issue: n, path: rec.path, was: rec.state, now: now.state, closedAt: now.closedAt || null });
    }
  }
  const unrecorded = (live || []).filter((r) => !seen.has(Number(r.number)) && !(recorded || []).some((x) => Number(x.issue) === Number(r.number)));
  return { changed, unrecorded, missing };
}

function fetchLive(repo) {
  const out = execFileSync("gh", [
    "issue", "list", "--repo", repo, "--author", "u00dxk2", "--state", "all",
    "--limit", "100", "--json", "number,state,closedAt,title",
  ], { encoding: "utf8" });
  return JSON.parse(out);
}

function main() {
  let store;
  try {
    store = JSON.parse(readFileSync(STORE, "utf8"));
  } catch {
    console.log(`RESULT: ERROR — cannot read ${STORE}; the baseline IS the instrument, so this is not a silent pass (exit 2)`);
    process.exit(2);
  }
  const recorded = store.reports || [];
  let live;
  try {
    live = fetchLive(store.repo);
  } catch {
    // A fixed string: nothing from the failure is echoed. An unreachable listing is UNVERIFIED,
    // never "no transitions" — the distinction this repo exists to police.
    console.log("RESULT: UNREACHABLE — could not list upstream issues via gh; this is NOT evidence that nothing moved (exit 2)");
    process.exit(2);
  }

  const { changed, unrecorded, missing } = diffReports(recorded, live);
  console.log(`# upstream report states — ${new Date().toISOString()}`);
  console.log(`${recorded.length} recorded report(s) in ${store.repo}; ${live.length} live row(s) read.`);

  for (const c of changed) {
    console.log(`\nCANDIDATE CAUSAL EVENT — issue ${c.issue} (${c.path}) went ${c.was} -> ${c.now}${c.closedAt ? ` at ${c.closedAt}` : ""}.`);
    console.log(`  GO LOOK. This says a report we filed changed state, and NOTHING about whether we caused it.`);
    console.log(`  Not a G-4 arrival by construction: we authored and sent this artifact.`);
    console.log(`  To quiet it, verify what happened and update state/closedAt in ledger/upstream-reports.json, saying in the commit what you verified.`);
  }
  for (const u of unrecorded) {
    console.log(`\nUNRECORDED — issue ${u.number} is ours and has no baseline row. Add it, or the store's completeness is fiction.`);
  }
  for (const m of missing) {
    console.log(`\nNOT IN LISTING — recorded issue ${m.issue} did not come back. Suspect the QUERY before concluding it is gone.`);
  }

  if (!changed.length && !unrecorded.length && !missing.length) {
    console.log(`\nNo state transitions. Every recorded report still reads as it did when the baseline was taken.`);
    console.log(`RESULT: PASS — 0 transition(s) across ${recorded.length} recorded report(s) (exit 0)`);
    return;
  }
  console.log(`\nRESULT: ATTENTION — ${changed.length} transition(s), ${unrecorded.length} unrecorded, ${missing.length} not in listing (exit 1)`);
  process.exit(1);
}

function selftest() {
  const base = [{ issue: 150, path: "constants/87a.md", state: "CLOSED" }];

  // SILENT: the permanent fact that 150 is closed must never fire. This is the assertion note4 is
  // about — a check that fires every day once a report closes is the founding defect in a new hat.
  const quiet = diffReports(base, [{ number: 150, state: "CLOSED", closedAt: "2026-08-23T17:15:35Z" }]);
  assert.equal(quiet.changed.length, 0, "an unchanged state must not fire — this alarm has to be able to go quiet");
  assert.equal(quiet.unrecorded.length, 0);
  assert.equal(quiet.missing.length, 0);

  // FIRES: the transition itself. Reversed polarity on purpose — a report recorded OPEN that has
  // since closed is the 2026-08-23 event, which is the fixture this row was filed about.
  const openBase = [{ issue: 150, path: "constants/87a.md", state: "OPEN" }];
  const fired = diffReports(openBase, [{ number: 150, state: "CLOSED", closedAt: "2026-08-23T17:15:35Z" }]);
  assert.equal(fired.changed.length, 1, "a state transition must fire — it is the only thing this checks");
  assert.equal(fired.changed[0].was, "OPEN");
  assert.equal(fired.changed[0].now, "CLOSED");
  assert.equal(fired.changed[0].closedAt, "2026-08-23T17:15:35Z", "the transition must carry when it happened");

  // It fires the OTHER way too — a reopened report is equally a candidate causal event, and a
  // one-directional check would read a reopen as routine.
  assert.equal(diffReports(base, [{ number: 150, state: "OPEN" }]).changed.length, 1, "a reopen must fire as well as a close");

  // Proof the two fixtures are genuinely different inputs, so the pair above cannot both be
  // passing against one accidental object.
  assert.notDeepEqual(base, openBase);

  // An artifact we sent and never recorded is surfaced rather than silently making the store
  // look complete.
  const extra = diffReports(base, [{ number: 150, state: "CLOSED" }, { number: 151, state: "OPEN" }]);
  assert.equal(extra.unrecorded.length, 1);
  assert.equal(extra.unrecorded[0].number, 151);
  assert.equal(extra.changed.length, 0, "an unrecorded row must not also be counted as a transition");

  // A recorded row absent from the listing is reported as a query suspicion, never as a deletion.
  const gone = diffReports(base, []);
  assert.equal(gone.missing.length, 1);
  assert.equal(gone.changed.length, 0, "an absent row is not a state change — we did not read a state");

  // Empty inputs are not an error and are not a transition.
  assert.deepEqual(diffReports([], []), { changed: [], unrecorded: [], missing: [] });

  // The real baseline parses and carries what the differ needs — a fixture-only selftest would
  // pass against a store shape that does not exist.
  const real = JSON.parse(readFileSync(STORE, "utf8"));
  assert.ok(Array.isArray(real.reports) && real.reports.length > 0, "positive control: the committed baseline must be readable and non-empty");
  for (const r of real.reports) {
    assert.ok(Number.isFinite(Number(r.issue)), "every recorded report needs a numeric issue id");
    assert.ok(typeof r.state === "string" && r.state.length, "every recorded report needs a state, or there is nothing to transition from");
  }

  console.log("check-upstream-reports selftest: PASS (silent on the permanent fact that a closed report is closed — the thing that would make it a permanently-red alarm; fires on a close and on a reopen, carrying when; surfaces an unrecorded report of ours without counting it as a transition; treats a recorded row missing from the listing as a query suspicion rather than a deletion; empty in, empty out; and the committed baseline is proven readable with the fields the differ reads)");
}

const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
const isMain = entry === import.meta.url;
if (isMain) {
  if (process.argv.includes("--selftest")) selftest();
  else main();
} else if (process.argv[1]?.endsWith("check-upstream-reports.mjs")) {
  console.error("check-upstream-reports: COULD NOT RUN — invoked as main but module identity did not match");
  process.exit(2);
}
