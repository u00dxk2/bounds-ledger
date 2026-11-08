// Today's date in Mountain Time (America/Denver) as YYYY-MM-DD. Every human-facing date label in
// this repo is MT, and the host clock must never decide it: an evening MT close computed off a UTC
// clock lands one day late. en-CA renders YYYY-MM-DD; the timeZone option is what makes it Mountain
// rather than host-local.
//
// One copy, imported by check-deferrals.mjs, check-next-primer.mjs and report-rate.mjs, which each
// carried a definition with the same signature and body until 2026-11-07. The first two still re-export it, so their
// importers are unchanged. check-next-primer's --selftest pins the evening-close case.
export function mtToday(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: "America/Denver" });
}
