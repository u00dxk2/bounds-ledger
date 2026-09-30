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

## BLUF

We checked seven more papers behind the small Ramsey numbers table against the bounds the survey credits to them. Five were read in the edition the survey cites and back their bounds; one web page could only be read in a later copy, and one book chapter could not be reached.

Nothing changed on the public pages today: these readings stay off them until the rebuilt table lands on 2026-10-20.

## What changed

- **`A-54` census session 3** (the Small Ramsey Numbers rebuild, the second watched area). The plan was pushed in `441c6f8` before any source was opened, the readings landed in `c0d2fbf`, and the cross-family review fixes landed in `3f4384c`. `node scripts/ds1-depth.mjs` now reads "census: 31 of 122 bound(s), across 19 of 42 credited paper(s) — 22 sound, 0 defective, 4 unresolved, 5 unreachable". That is 31 of 122 bounds COVERED, not read: this morning it was 20 of 122, 12 of 42.
  - SOUND: NaRT's four bounds (the arXiv preprint states them; its witness graphs on GitHub were not opened), Ka1, MR4 (the authors' copy and the publisher's abstract), Ex19, MR5 (the journal's abstract and the authors' preprint).
  - UNRESOLVED: Kol2's two bounds. The cited web page states both, but it was read only as archived in 2022-2025, and its equivalence to the 2016 version the survey cites is not established.
  - UNREACHABLE: Ex3, a chapter in a 1991 SIAM proceedings volume. The Internet Archive copy needs an account to borrow, and HathiTrust's copy is search-only.
  - Attempted 7, full text reached 6, read in the cited edition 5. The P1 review's floor was 4.
- **Findings classification, one sentence of human judgment:** today's findings were instrument-facing. The cross-family review caught my own overclaims: Kol2's edition, a read count that included it, a wrong comparison on MR4 and an access overclaim on Ex3. The one defect found in a source is a dropped "to 159" in NaRT's summary sentence (v3-v5), and it concerns a preprint's prose, not a mirrored upstream entry.
  - **Numeric or byte-only: neither.** The drift alarm counted nothing today. Positive control: `reverify.test.mjs` plants synthetic drift on every `npm test`, and today's verify ran it.
  - **Consecutive instrument-facing days: 1**, counted by hand. Yesterday had a record-facing finding (8a).
  - **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." There was no record-facing catch today, so it was not tested.

## Inputs (controllable)

- Seven background reading agents, one per paper, under `tmp/census3-brief.md` (session 2's rules, unchanged). The brief forbids sending identity, Unpaywall, completing a verification challenge and shadow libraries. Every stored quotation was checked by this session against the saved page images or HTML.
- The survey's bibliography entries were extracted from the survey PDF into `tmp/ds1-text.txt`, so each agent had the cited edition to look for.
- Codex read-only review: round 1 on `c0d2fbf` returned 4 findings, all confirmed and fixed in `3f4384c`. Round 2 on `3f4384c` read "Verdict: approve". A first launch was stopped by the low-memory reaper at 10:20 MT with no output. It was relaunched on the orchestrator's go-ahead (bus 3b41532d).
- One hygiene helper, whose draft was applied at the close.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report):** `npm run reports` at P1 read "OUTSIDE ARRIVALS: 0" of 32 raw issues, with the parts reconciling (32 + 0 + 0 = 32). By the rule of three, the 95% upper bound on the outside share of issues is about 3/32. It says nothing about readers who never file.
- **Delivery:** none by design. `node scripts/render-ramsey.mjs --check` read "RESULT: PASS — ramsey.html matches the committed table (72 entries, revision #18)". CI on `3f4384c`: GREEN.
- **The two depth counts, side by side and never summed:** the Small Ramsey Numbers census is above. The constants audit (`node scripts/depth-audit.mjs`) did not change today; its slice 10 is 2026-10-01.

## Recommendation

- 2026-10-01: `A-47` slice 10 (the depth audit of the constants ledger), then `A-53`'s guard choice, (a), (b) or (c).
- 2026-10-02: census session 4 on `A-54`, opening with Mac (13 bounds). Apply the tripwire first: 25 papers against 4 × 8 = 32 at this close.
- The Wayback `id_` retry of the five blocked census papers (GrY, Ka2, Ex5, Kol1, Ex3), at the first census slot with time to spare and no later than the 10-08 slot (`A-54.blockedRetry2026_09_30`).

## On hold pending data

- **Kol2's two bounds are UNRESOLVED on edition.** A 2016 copy of the page, or the 2016 communication itself, would settle them.
- **This lane's `npm run close:primer` is red under today's primer-naming change** (orchestrator, bus 8bac7908). A close now appends to the primer dated the day it is written, but the lane's check still looks for `docs/cold-starts/2026-10-01.md`: "RESULT: FAIL — no cold-start primer for tomorrow (2026-10-01 MT)". The fleet check `check-next-primer-exists.mjs` reads "RESULT: PASS" on `docs/cold-starts/2026-09-30.md`. UNRESOLVED: the lane check needs updating to the new rule, which is a code change for a later day.

## State Appendix

### Close

ACTION: COMPLETED · item A-54 · P3 dc0b2bcd (the P3 bus msgId). The acceptance condition in force was met: the plan was pushed before any source was opened (`441c6f8`), `node scripts/ds1-depth.mjs` prints a census line above "12 of 42 credited paper(s)", and every paper in the plan is accounted for. Of the 7 attempted, 5 were read in the cited edition, above the P1 review's floor of 4. Each verdict names the edition read. The orchestrator's P3 review (bus 4234d777) marked it COMPLETED.

State changed since the P3 post: the census figure is written as coverage, "31 of 122 bounds covered (22 sound, 4 unresolved, 5 unreachable)", per the P3 review. The P3 title's "31 of 122 bounds read" overstated it, because 5 of the 31 are unreachable and 4 are unresolved. The receipt still stands, so no new receipt is written.

Ledger delta at the close:
- Hygiene draft: 3 lines — 3 accepted · 0 amended · 0 rejected. READ-MUTATED: none. Its checks read "check-wait-justification: RESULT: PASS — 1 of 75 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)" and "check-engineering-zero --project bounds-ledger: RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
  - `A-50` (one selftest that imports every CLI module): re-dated to 2026-10-14, with the reason on `redate2026_09_30` as its onTrigger requires. The draft left one clause unchecked, whether a fourth instance of the class had appeared. I checked it: `git log -i --grep=import` since 2026-09-16 gave 1 hit (`85eb436`, not an instance), and the docs/ search found 5 files, all dated 2026-09-15 or earlier.
  - `A-57` (the 46a attribution correction draft): re-dated to 2026-10-07, with the reason on `redate2026_09_30`.
  - `A-58` (four small upstream text defects): re-dated to 2026-10-07, and its readCommand now names the mirrored `ledger/teorth-optimizationproblems/constants/…` path.
- `A-54`: `census3_2026_09_30` recorded, `expectedSignalBy` 2026-09-30 → 2026-10-02, and `blockedRetry2026_09_30` gives the blocked-paper retry its trigger and a hard date.
- Tonight's primer, `docs/cold-starts/2026-09-30.md`: banner and narrative rewritten by hand for 2026-10-01. `check-cold-readability.mjs` reads "RESULT: PASS — 0 cold-readability finding(s) (exit 0)".

Due-gate verification: `check-due-gates-dispositioned.mjs` reads "verdict: CLEAR — every gate due at Phase 0 was dispositioned", with "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-09-30)".

Pending reads, each dated on its row:
- `A-47` slice 10 and `A-53`'s guard choice: 2026-10-01.
- `A-54` census session 4: 2026-10-02. The blocked-paper retry: no later than the 2026-10-08 slot.
- `W-13` (someone must call the served-bytes check): its next read, 2026-10-06.
- `A-57` and `A-58`: 2026-10-07. `A-50`: 2026-10-14.
- `A-59` encounter: 2026-10-28 or the first outside arrival.

### Selection packet (P1)

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
