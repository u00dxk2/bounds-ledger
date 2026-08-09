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

  console.log("traffic-snapshot selftest: PASS (pre-window history survives merge and a truncating merge is caught; views/clones share a row; no day invented; restatement updates in place; sumSince boundary inclusive)");
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
  // uniques counts a returning visitor once per day, so this is an UPPER BOUND on distinct
  // people — which is the useful direction for W-6: an upper bound under 100 settles that the
  // threshold is not met, while a sum over 100 does NOT settle that it is.
  console.log(`W-6 thresholds are 90 days AND 100 unique visitors. Viewer-days OVERCOUNT distinct people (no cross-day dedup beyond 14 days), so treat ${visitors} as an upper bound.`);
  // Our own clones and CI are in these figures; the repo was private for most of the window.
  console.log(`Not deducted: our own clones, CI checkouts, and GitHub's crawlers. Treat clone figures as unattributed.`);
}

process.argv.includes("--selftest") ? selftest() : main();
