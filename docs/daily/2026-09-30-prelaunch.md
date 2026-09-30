---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-30
lifecycle_stage: launched
last_deploy: 5a6f925 (HEAD at P1; the last page-changing commit is named at the close)
on_hold_items: 0
top_action_today: A-54 census session 3 on the Small Ramsey Numbers rebuild
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-09-30 (prelaunch report)

## P1 — Selection packet

[P1 — Evidence and choice]

**Outcome and item.** `A-54` (the Small Ramsey Numbers rebuild, the second watched area): census session 3, reading the next credited papers of Table Ia against the bounds the survey credits to them.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a bound and a referee told me it had been improved. I had no way to know." For the second area, a reader of `ramsey.html` can only trust a small Ramsey bound on our page if someone read the paper it is credited to. The census is that reading, done for every credited paper instead of a sample.

**Evidence** (each line OBSERVED unless marked):
- OBSERVED · `node scripts/ds1-depth.mjs`, run at P1 on 2026-09-30 · the frame is 122 credited bounds in Table Ia of revision #18 · "census: 20 of 122 bound(s), across 12 of 42 credited paper(s) — 14 sound, 0 defective, 2 unresolved, 4 unreachable". This is unchanged since session 2 on 2026-09-28.
- OBSERVED · the census tripwire (`A-54.rebuildCheckpoint2026_09_28`), applied before planning. Papers remaining are 32: 30 of Table Ia's 42, plus AnM2 and AnM3 from Table Ib's group credit. That is why the checkpoint said 32 while 42 − 12 = 30, which the primer asked about. The capacity is 4 papers × the 9 census slots left through 2026-10-16, counting today (09-30, 10-02, 10-04, 10-06, 10-08, 10-10, 10-12, 10-14, 10-16), so 36. **32 ≤ 36, so the wire does not fire, and completion stays 2026-10-20.**
- OBSERVED · the derived census order (`node scripts/ds1-depth.mjs --frame`, credited keys by first appearance) · the next keys after the 12 read are NaRT, Kol2, Ka1, MR4, Ex19, MR5, Ex3, then Mac. Mac carries 13 bounds, so a session that reaches it reads fewer papers, as the checkpoint says.
- OBSERVED · `npm run reports`, 2026-09-30 · "OUTSIDE ARRIVALS: 0" of 32 raw issues, with the parts reconciling (32 + 0 + 0 = 32). `G-4` (an outside party acting on a watched record without us filing the report) is still expected-zero.
- MISSING · any reader-side figure for `ramsey.html`. GitHub Pages gives us no request log, and the page carries no analytics by an enforced invariant (`docs/evangelism-bar.md` § "Reader reach is unmeasured").
- HYPOTHESIS · the four access-blocked papers (GrY, Ka2, Ex5, Kol1) may open through the Wayback `id_` route that reached Rosser–Schoenfeld 1975 on 2026-09-29. That retry is outside census pace and does not count toward the session.

**Permission.** `A-54` is open and not parked. The census is ruled work: David's 2026-09-09 depth ruling, and `A-54.onTrigger` as rewritten on 2026-09-28. **The page freeze is dated, funded and in flight:** census rows are held off both pages by `pageRows()` until the 2026-10-20 landing (David's freeze of 2026-09-20). Today's work stays inside the store and does not touch the pages. Nothing here is a send, so the outward gate is not engaged.

**Next action.** Kind: deliver built value (the rebuild that lifts the freeze). The first command below is the tripwire read, already run above and re-run at the start of P3. Then the plan is written into `continuity/depth-audit-ds1.json` and **pushed before any source is opened**, as sessions 1 and 2 were. Then the papers are read under `A-54.blockedSourceRule2026_09_25`.

```bash
node C:/dev/skylark/bounds-ledger/scripts/ds1-depth.mjs
```

**Acceptance condition.** A plan commit is pushed before any source is opened. It names about six papers in derived order, starting at NaRT, and the bounds each is credited with. A readings commit follows, and `node scripts/ds1-depth.mjs` prints a census line above "12 of 42 credited paper(s)", with every paper in the plan accounted for as read or blocked. Each verdict names the edition it read.

**Delivery and encounter checks.** None today, by construction: census rows are off the pages until 2026-10-20. The rebuilt page's delivery read is `npm run served` on the landing commit. Its encounter read is `A-59` (encounter on the public pages is blind), 2026-10-28 or the first outside arrival.

**USER-FACING: no.** The paths are `continuity/depth-audit-ds1.json`, `continuity/items.json`, `docs/daily/2026-09-30-prelaunch.md` and `docs/cold-starts/`. No page file is rendered, and `pageRows()` filters census rows from `ramsey.html` and `copying.html`.

**Section 0.**
- Primer: read (`docs/cold-starts/2026-09-30.md`).
- Listener: 🟢 SSE alive (hello 15:16:51Z, replay-complete) and the loop is armed by `ScheduleWakeup`; waker ladder of three rungs live.
- Codex: GREEN per the kickoff's `[codex-probe:]` line, 15:24Z.
- Verify: `npm run verify` receipt `exitCode: 0` at `5a6f925c82c1d418ec13d707f1af73bd5dfbb0fe`, 15:48:34Z. `check:brief` read UNVERIFIABLE, because the run had no `CC_PROMPTS_PIN` in its environment. That is its documented exit, not a pass.
- CI: `check-ci-status --workflow reverify.yml` GREEN for `5a6f925` (1 success, 0 failures, 0 pending).
- Deploy drift: this lane is a GitHub Pages lane with no checksPass Render service, so `check-deployed-sha-drift` sweeps nothing for it. That is neither a stop nor a pass. The fleet table read clean, 0 findings across 33 services.
- Harness: running 2.1.285 · fleet UNIFORM · installed 2.1.285 (SAME).
- Recs yesterday (`docs/daily/2026-09-29-prelaunch.md` § Recommendation): census session 3, carrying today → P3 (selected). `A-47` slice 10 on 2026-10-01, carrying → tomorrow. 8a and 46a as attribution corrections, dropping for today (David's gate, and neither is proposed).
- Cycle rotation: "no product-love cycle picks this lane today" (exit 0).
- David's board: no answered, waiting or pending-verify cards for this lane.

**One prior-day retro finding that bears on the choice.** The method-sentence defect recurred in my own verification on 2026-09-29. Today each census verdict's "read at edition X" sentence gets checked as its own angle, not folded into a combined review focus.

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice, 3 of the 4 in `check-due-gates-dispositioned --snapshot` ("4 gate(s) due on/before 2026-09-30"):
  - `A-50` (one selftest that imports every CLI module), readCommand never run.
  - `A-57` (the 46a attribution correction draft), readCommand never run.
  - `A-58` (four small upstream text defects), readCommand never run. The snapshot flags its readCommand's `constants/10c.md` as a path that does not exist in this repo (upstream's form; ours is `ledger/teorth-optimizationproblems/…`).
- (b) Owed child rows in the orchestrator's ledger: none (0 of 734 considered).
- (c) State reads marked CROSSED: none. The kickoff's reads printed no threshold clause as crossed. Stale-actionable read 1 of 18 (7-day window), with no crossed clause.
