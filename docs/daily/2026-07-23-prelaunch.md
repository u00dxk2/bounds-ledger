# bounds-ledger — daily (prelaunch) — 2026-07-23 (MT)

First /daily for this lane. Lite rail.

## (1) Engineering signals

- CI: none existed before today. `reverify.yml` ships today (daily cron + push + manual); the push-triggered first run is the live validation — result recorded below in (2).
- Sentry/deps: n/a (no app surface, no dependencies — scripts are Node stdlib only).
- Codex: GREEN (codex-cli 0.143.0, health OK). Not used today — both tasks were far under the ≥250-LOC Codex-first bar.

## (2) What shipped

**A-2 — re-verification CI stood up (the lane's core instrument).**
- `scripts/reverify.mjs`: `--snapshot` (ledger copy + manifest pinning upstream sha) / `--check` (re-fetch, diff vs ledger, drift report, exit 1 on drift).
- Initial snapshot: **109 constant files** @ `teorth/optimizationproblems@a002311` (the "~85" estimate was low — surface is bigger than scoped). Spot-verified `1b.md` matches reconciliation #1 row-for-row (0.380927 Haugland / 0.380868 current best / 0.379005 lower bound).
- **Synthetic-drift demo: PASS** (`scripts/reverify.test.mjs` — network-free tamper test, runs inside CI on every run, so the alarm's own health is continuously proven). This satisfies the "drift detection demonstrated on a synthetic change" half of A-2's close condition; the remaining half is the scheduled green streak.
- `.github/workflows/reverify.yml`: daily 09:17 UTC + push + manual; on drift the run fails AND auto-files a GitHub issue with the report. Semantics: drift is expected (records move); the alarm demands re-verification against primary sources, then a deliberate `--snapshot` commit.
- Deferred: external-surface cross-checks (Wikipedia, erdosproblems.com) — core drift alarm first; erdosproblems 403s bots anyway.

**W-2 — CLOSED, no upstream PR warranted.** Haugland's paper (arXiv:1609.08000, final section) gives the bound to full precision: **0.3809268534330870**. Tao's `0.380927` is round-to-nearest and bound-safe; the abstract's "0.380926…" is truncation-with-ellipsis; Wikipedia dropped the ellipsis. Not a typo — a rounding-direction convention. The repo is right, so the candidate one-character PR would have been a false correction; the adversarial gate never needed to fire. Finding: `docs/findings/2026-07-23-haugland-final-digit.md`.

## (3) Section B — North-Star

This lane's product-love analog is G-1's close condition: **an externally-acknowledged correction or confirmation** on a stewarded surface (the lane's word-of-mouth moment is "the ledger caught a drift the field missed"). Can't measure that until the instrument exists — so today's move WAS standing the instrument up. The re-verification CI is now live; the metric it feeds is *drift catches per month + external acknowledgements*. Next candidate acknowledgement: A-3 (erdosproblems.com/36 three records stale) once hand-verified.

## (4) Decisions / blocked

- Nothing newly blocked. Board checked (`answered-cards.mjs`) — no bounds-ledger cards outstanding.
- Standing (not new): A-3 needs a **hand-browse re-verification of erdosproblems.com/36** (site 403s bots; current provenance is agent-fetch only) before any upstream report, and any report to Thomas Bloom is David-gated. Zero-cost for David to defer; the lane is not waiting on it.

## (5) Continuity

- W-2 closed (finding recorded). A-2 progressed: synthetic-drift half ✓, scheduled-green-streak half begins tonight. A-3 unchanged. G-1 unchanged (30-day green CI clock starts now).

---

**David line — 2026-07-23:** The bounds ledger now watches Tao's optimization-constants repo automatically: a daily job re-fetches all 109 constants and files an issue the moment any record moves, and it proved on a planted change that it catches drift. Also closed yesterday's "possible typo" lead — Tao's table is right (it's a rounding-style difference), so no correction needed. Nothing needs you today.
