#!/usr/bin/env node
// Samples GitHub's repository traffic API into continuity/traffic.json.
//
// WHY THIS EXISTS AT ALL: the API retains only 14 days. W-6 asks for a 90-day read of the
// README report-an-error channel and says explicitly that the visitor count "must be sampled
// periodically, not read once at the end" — so a sampler is not convenience, it is the only
// way the eventual read can exist. Run it during the daily steward cadence; miss 14 days in a
// row and those days are gone from GitHub too.
//
// WHAT IT DOES NOT DO: it renders no verdict. It reports arithmetic (days elapsed, visitors
// counted) and leaves "has the channel had a fair read" to the human/agent adjudicating W-6 —
// same reason a generated pin asserts listing position and never "the record".
//
// Auth is delegated to the `gh` CLI, which owns the credential. Nothing here reads, stores,
// or prints a token, and no credential enters this public repo.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STORE = join(ROOT, "continuity", "traffic.json");
const REPO = "u00dxk2/bounds-ledger";
const FLIP = "2026-08-08"; // repo went public ~20:20Z; W-6's clock starts here, not at f0b58d5

const dayOf = (ts) => ts.slice(0, 10);

/**
 * Merge a freshly-fetched 14-day window into the accumulated history.
 *
 * LOAD-BEARING: the incoming window must never truncate `existing`. A merge that returned
 * only the window would silently delete every day older than 14 — and since GitHub has
 * already forgotten them, this file would be the only copy destroyed. That is the failure
 * the self-test below exists to catch.
 */
export function mergeDays(existing, views, clones) {
  const out = { ...existing };
  const put = (rows, countKey, uniqueKey) => {
    for (const r of rows ?? []) {
      const d = dayOf(r.timestamp);
      out[d] = { ...(out[d] ?? {}), [countKey]: r.count, [uniqueKey]: r.uniques };
    }
  };
  put(views, "views", "viewUniques");
  put(clones, "clones", "cloneUniques");
  return out;
}

/** Sum a per-day field over the days on or after `from`. */
export function sumSince(days, from, key) {
  return Object.entries(days)
    .filter(([d]) => d >= from)
    .reduce((n, [, v]) => n + (v[key] ?? 0), 0);
}

/**
 * Average days-present per DISTINCT viewer across GitHub's own 14-day window.
 *
 * Numerator: per-day `viewUniques` summed over the window — unique viewer-DAYS, which
 * overcount people. Denominator: the window rollup's `viewUniques`, which GitHub dedups
 * ACROSS the window and is therefore the honest head-count. 1.0 means every viewer appeared
 * on exactly one day; above 1.0 means somebody came back.
 *
 * Returns null rather than a number whenever it cannot be computed, because a plausible-looking
 * ratio is worse than an absent one. Note the identity that makes the third guard a real check
 * and not defensive noise: viewer-days can never be FEWER than distinct viewers, so a sub-1.0
 * result means our day rows do not cover the window the rollup was taken over.
 */
// N_min for the ratio, copied from A-20's branch: below this the figure is COMPUTED but not
// READABLE, and printing a bare number would let a two-viewer artefact be quoted as a retention
// read. 3 is where the header comment above already says it starts separating
// "they looked once" from "they came back".
export const RETURN_RATE_N_MIN = 3;

export function returnRate(days, rollup, windowStart) {
  if (!rollup || !(rollup.viewUniques > 0)) return null;
  const viewerDays = sumSince(days ?? {}, windowStart, "viewUniques");
  if (viewerDays < rollup.viewUniques) return null;
  return {
    viewerDays,
    viewers: rollup.viewUniques,
    ratio: viewerDays / rollup.viewUniques,
    inapplicable: rollup.viewUniques < RETURN_RATE_N_MIN,
  };
}

function selftest() {
  // Positive: history OLDER than the incoming window survives the merge.
  const history = { "2026-07-01": { views: 5, viewUniques: 3 } };
  const merged = mergeDays(
    history,
    [
      { timestamp: "2026-07-26T00:00:00Z", count: 3, uniques: 1 },
      { timestamp: "2026-07-27T00:00:00Z", count: 0, uniques: 0 },
    ],
    [{ timestamp: "2026-07-26T00:00:00Z", count: 9, uniques: 1 }],
  );
  assert.deepEqual(merged["2026-07-01"], { views: 5, viewUniques: 3 }, "merge dropped pre-window history");

  // Negative control, the same assertion pointed at a merge that DOES truncate — proving the
  // check above can fail, not just pass (KP-78: a detector that only ever agrees proves nothing).
  const truncating = (_existing, v) => Object.fromEntries((v ?? []).map((r) => [dayOf(r.timestamp), { views: r.count }]));
  assert.throws(
    () => assert.ok(truncating(history, [{ timestamp: "2026-07-26T00:00:00Z", count: 3, uniques: 1 }])["2026-07-01"]),
    "the truncation check cannot fail — it would not catch the bug it exists for",
  );

  // Views and clones for the same day land in ONE row rather than clobbering each other.
  assert.deepEqual(merged["2026-07-26"], { views: 3, viewUniques: 1, clones: 9, cloneUniques: 1 });

  // A day present in neither the history nor the window is not invented.
  assert.equal(merged["2026-07-15"], undefined, "merge invented a day that was never reported");

  // An overlapping day is UPDATED in place, not duplicated — GitHub restates recent days as
  // they complete, and the later read is the correct one.
  const restated = mergeDays(merged, [{ timestamp: "2026-07-26T00:00:00Z", count: 4, uniques: 2 }], []);
  assert.equal(restated["2026-07-26"].views, 4);
  assert.equal(restated["2026-07-26"].clones, 9, "restating views wiped the clone figures for that day");
  assert.equal(Object.keys(restated).length, Object.keys(merged).length);

  // sumSince counts from the boundary INCLUSIVE and ignores everything before it.
  assert.equal(sumSince(restated, "2026-07-26", "viewUniques"), 2);
  assert.equal(sumSince(restated, "2026-07-01", "viewUniques"), 5);
  assert.equal(sumSince(restated, "2027-01-01", "viewUniques"), 0);

  // --- returnRate: both polarities, then every way it must refuse to answer. ---
  // FIRES: 5 viewer-days over 3 distinct people means somebody came back.
  const returning = {
    "2026-08-20": { viewUniques: 2 },
    "2026-08-21": { viewUniques: 2 },
    "2026-08-22": { viewUniques: 1 },
  };
  const rr = returnRate(returning, { viewUniques: 3 }, "2026-08-20");
  assert.equal(rr.viewerDays, 5);
  assert.equal(rr.viewers, 3);
  assert.ok(rr.ratio > 1, "returnRate did not rise above 1 on a window where a viewer returned");

  // SILENT: three people, one day each, deduped to three — reads exactly 1.00 and never above it.
  const once = { "2026-08-20": { viewUniques: 1 }, "2026-08-21": { viewUniques: 1 }, "2026-08-22": { viewUniques: 1 } };
  assert.equal(returnRate(once, { viewUniques: 3 }, "2026-08-20").ratio, 1);

  // Proof the two fixtures are actually different inputs and not the same one read twice —
  // without this, both assertions above could pass against one accidental object.
  assert.notDeepEqual(returning, once);

  // Refuses rather than guessing: no rollup sampled, nobody in the window, and day rows that do
  // not cover the rollup's window (viewer-days below the head-count is arithmetically impossible,
  // so it means our coverage is short, not that people un-visited).
  // The N_min floor, both polarities. Below it the ratio is computed and must not be READ;
  // at it the flag must be off, or the floor would suppress every reading this repo will ever take.
  assert.equal(returnRate(returning, { viewUniques: 2 }, "2026-08-20").inapplicable, true);
  assert.equal(returnRate(returning, { viewUniques: 3 }, "2026-08-20").inapplicable, false);
  assert.ok(returnRate(returning, { viewUniques: 2 }, "2026-08-20").ratio > 0, "the floor must not blank the arithmetic it refuses to have read");
  assert.equal(returnRate(returning, null, "2026-08-20"), null);
  assert.equal(returnRate(returning, { viewUniques: 0 }, "2026-08-20"), null);
  assert.equal(returnRate({ "2026-08-22": { viewUniques: 1 } }, { viewUniques: 3 }, "2026-08-20"), null);

  console.log("traffic-snapshot selftest: PASS (pre-window history survives merge and a truncating merge is caught; views/clones share a row; no day invented; restatement updates in place; sumSince boundary inclusive; return-rate rises above 1 when a viewer returns, reads exactly 1 when none do on a proven-different fixture, and refuses on a missing rollup, an empty window and day rows short of the rollup's window; and the N_min floor flags a 2-viewer read INAPPLICABLE while leaving a 3-viewer read readable, without blanking the arithmetic)");
}

function main() {
  const gh = process.platform === "win32" ? "gh.exe" : "gh";
  const api = (path) => JSON.parse(execFileSync(gh, ["api", `repos/${REPO}/${path}`], { encoding: "utf8" }));

  const views = api("traffic/views");
  const clones = api("traffic/clones");

  const store = existsSync(STORE) ? JSON.parse(readFileSync(STORE, "utf8")) : { repo: REPO, publicSince: FLIP, days: {} };
  store.days = mergeDays(store.days ?? {}, views.views, clones.clones);
  // GitHub's own 14-day rollups are deduplicated ACROSS days; the per-day uniques are not.
  // Keep the rollups as sampled so the honest number survives alongside the summable one.
  store.rollups = { ...(store.rollups ?? {}), [new Date().toISOString().slice(0, 10)]: { window: "14d", viewUniques: views.uniques, cloneUniques: clones.uniques } };
  writeFileSync(STORE, JSON.stringify(store, null, 2) + "\n");

  const elapsed = Math.floor((Date.parse(new Date().toISOString().slice(0, 10)) - Date.parse(FLIP)) / 86400000);
  const visitors = sumSince(store.days, FLIP, "viewUniques");
  const cloners = sumSince(store.days, FLIP, "cloneUniques");

  console.log(`# Traffic sample — ${new Date().toISOString()}`);
  console.log(`${Object.keys(store.days).length} day(s) recorded in ${STORE.slice(ROOT.length + 1)}; latest 14-day window: ${views.uniques} unique viewer(s), ${clones.uniques} unique cloner(s).`);
  console.log(`Since the repo went public (${FLIP}, day ${elapsed}): ${visitors} unique viewer-day(s), ${cloners} unique cloner-day(s).`);
  // Stated every run because it is the number someone will otherwise misread. Summing per-day
  // uniques counts a returning visitor once per day, so this is an UPPER BOUND on distinct people.
  //
  // THIS LINE USED TO PRINT "W-6 thresholds are 90 days AND 100 unique visitors" AND THAT WAS
  // RETIRED ON 2026-08-20 — corrected here 2026-08-23. W-6 was re-pointed under the waits gate
  // because the denominator could not fill: reaching 100 distinct people by the read date needed
  // about four times the observed rate. The watch now reads a qualitative n=1 — the first
  // unsolicited outside contact of any kind — and these figures are CONTEXT, not a gate. The
  // retired number outlived its retirement in an instrument that prints it to every reader, which
  // is this repo's A-11 class exactly: a threshold from the old regime still reading as
  // authoritative after the regime changed.
  console.log(`Viewer-days OVERCOUNT distinct people (no cross-day dedup beyond 14 days), so treat ${visitors} as an upper bound, never an estimate.`);
  console.log(`W-6 no longer has a visitor threshold — re-pointed 2026-08-20 to the first unsolicited outside contact (n=1). These figures are context for that read, not a gate on it.`);
  // Our own clones and CI are in these figures; the repo was private for most of the window.
  console.log(`Not deducted: our own clones, CI checkouts, and GitHub's crawlers. Treat clone figures as unattributed.`);

  // C2 (orchestrator-assigned 2026-09-02): a return-rate proxy out of figures we already hold.
  // It is readable at n=3 in a way G-4's arrival count is not — at three viewers it still separates
  // "three people looked once" from "three people came back", which are different worlds. It renders
  // a figure and NO verdict, and it carries no threshold: attaching one is David's call.
  // The window boundary is READ from the response's own first bucket, never computed as
  // today-minus-N. Computing it got this wrong on the first live run: `today - 13` started at
  // 2026-08-20 and excluded the 2026-08-19 bucket that held the third viewer, so the numerator
  // came out at 2 against a denominator of 3 and the guard below correctly refused an
  // arithmetically impossible ratio. GitHub is the only authority on which days its rollup covers.
  const windowStart = views.views?.length ? dayOf(views.views[0].timestamp) : null;
  const rr = windowStart ? returnRate(store.days, { viewUniques: views.uniques }, windowStart) : null;
  if (rr) {
    console.log(
      rr.inapplicable
        ? `Return-rate proxy: INAPPLICABLE at n=${rr.viewers} distinct viewer(s), below the N_min of ${RETURN_RATE_N_MIN}. The arithmetic ran and is printed so the figure that replaces it stays auditable: ${rr.viewerDays} viewer-day(s) over ${rr.viewers}, ratio ${rr.ratio.toFixed(2)}. At this n the ratio can take only a couple of values, so it cannot separate nobody-came-back from noise. Not zero and not a low ratio: unreadable at this count.`
        : `Return-rate proxy, ${windowStart} to today: ${rr.viewerDays} viewer-day(s) over ${rr.viewers} distinct viewer(s) = ${rr.ratio.toFixed(2)} day(s) present per viewer. Exactly 1.00 means nobody came back twice.`,
    );
  } else {
    console.log(`Return-rate proxy: NOT READY — needs a non-zero 14-day viewer count and day rows covering ${windowStart ?? "the reported window"} onward. Not zero, and not a low ratio: it is unmeasured.`);
  }
  // The caveat is part of the figure, not a footnote to it: GitHub's traffic API counts the
  // REPOSITORY on github.com. The published Pages site has no analytics at all (G-4 note4), so
  // this says nothing about how many people READ the ledger — only about repo visitors.
  console.log(`Scope: this ratio is REPO views on github.com. The published page has no analytics, so page readership stays unmeasured and no figure here is a proxy for it.`);
}

process.argv.includes("--selftest") ? selftest() : main();
