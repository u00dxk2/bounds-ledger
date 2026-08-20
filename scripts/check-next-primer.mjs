#!/usr/bin/env node
// Close-boundary gate: the NEXT day's cold-start primer must exist before a session closes.
//
// Why this exists: 2026-08-20 opened with no `docs/cold-starts/2026-08-20.md` — 8/19's close
// never wrote it — so the session began by reconstructing state from the kickoff and the
// ledger. Nothing anywhere recorded the miss, which is why the question "is cold-start cost a
// recurring tax or a one-off?" was unanswerable: the misses left no trace.
//
// Why it is NOT in `npm run check` or CI, which is the obvious placement and the wrong one:
// tomorrow's primer legitimately does not exist for most of the day. A cadence or CI gate would
// be red from midnight until close-session ran — a permanently-red alarm, which carries exactly
// as much information as a permanently-green one and is this lane's founding defect. The
// condition is only actionable at the close boundary, so the gate lives there.
// Its SELF-TEST is deterministic and network-free, so that part does run in `npm test` + CI.
//
// MT, not UTC: the host clock is UTC and runs 6-7h ahead of Mountain, so an evening close (the
// normal case) computes tomorrow one day late off a UTC clock — the exact off-by-one this
// repo's date discipline exists to prevent. Calendar arithmetic is done on the MT date string
// via Date.UTC, so it is immune to DST rather than merely usually right.

import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function mtToday(now = new Date()) {
  // en-CA renders YYYY-MM-DD; the timeZone option is what makes it Mountain rather than host-local.
  return now.toLocaleDateString("en-CA", { timeZone: "America/Denver" });
}

export function nextDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  // Date.UTC normalises month/day overflow (Aug 32 -> Sep 1), so no month-length table is needed.
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

export function primerPath(dateStr, root = ROOT) {
  return join(root, "docs", "cold-starts", `${dateStr}.md`);
}

// ponytail: existence only, no content check. A primer that exists but is empty is a different
// defect and this gate deliberately does not claim to catch it — see A-18 for the content leg.
export function missingPrimer(dateStr, root = ROOT) {
  return !existsSync(primerPath(dateStr, root));
}

async function selftest() {
  const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const assert = (await import("node:assert/strict")).default;

  const tmp = await mkdtemp(join(tmpdir(), "primer-gate-"));
  await mkdir(join(tmp, "docs", "cold-starts"), { recursive: true });

  // KP-78, both answers. The silent half is asserted only AFTER the file is proven to exist,
  // so a broken existsSync cannot masquerade as "condition absent" (2026-08-17: an assertion
  // that something is not present passes on an empty string from a spawn that never ran).
  assert.equal(missingPrimer("2026-08-21", tmp), true, "FIRES: absent primer must report missing");

  const p = primerPath("2026-08-21", tmp);
  await writeFile(p, "# primer\n");
  assert.equal(existsSync(p), true, "positive control: the fixture file must exist before absence is asserted");
  assert.equal(missingPrimer("2026-08-21", tmp), false, "SILENT: present primer must report present");

  // The date arithmetic is the part most likely to be quietly wrong, so it is asserted, not trusted.
  assert.equal(nextDay("2026-08-20"), "2026-08-21", "same-month rollover");
  assert.equal(nextDay("2026-08-31"), "2026-09-01", "month-end rollover");
  assert.equal(nextDay("2026-12-31"), "2027-01-01", "year-end rollover");
  assert.equal(nextDay("2028-02-28"), "2028-02-29", "leap-year rollover");
  // A UTC-clock close at 20:00 MT is 02:00 UTC the NEXT day; MT must still read the MT date.
  assert.equal(mtToday(new Date("2026-08-21T02:00:00Z")), "2026-08-20", "evening MT close must not roll to the UTC date");

  await rm(tmp, { recursive: true, force: true });
  console.log("check-next-primer selftest: PASS (fires on an absent primer, silent on a present one after proving the fixture exists; month-end, year-end and leap rollovers correct; 20:00 MT close reads the MT date, not the UTC one)");
}

if (process.argv.includes("--selftest")) {
  await selftest();
} else {
  const today = mtToday();
  const tomorrow = nextDay(today);
  if (missingPrimer(tomorrow)) {
    console.error(`RESULT: FAIL — no cold-start primer for tomorrow (${tomorrow} MT).`);
    console.error(`  expected: docs/cold-starts/${tomorrow}.md`);
    console.error(`  Today is ${today} MT. Write it before closing: the next session opens cold without it,`);
    console.error(`  and the miss leaves no other trace (2026-08-20 opened this way).`);
    process.exit(1);
  }
  console.log(`RESULT: PASS — tomorrow's primer exists (docs/cold-starts/${tomorrow}.md)`);
}
