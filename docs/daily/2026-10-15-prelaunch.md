---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-15
lifecycle_stage: launched
last_deploy: 1eaaeab (HEAD at the 10-15 kickoff)
on_hold_items: 1
top_action_today: A-54 census session, up to four more Small Ramsey Numbers papers read against the bounds they are credited with
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-15 (Thursday, MT)

## BLUF

Every number on the Small Ramsey Numbers page has now been checked against the paper it credits, or says why it could not be.
The page's release moves three days earlier, from 10-22 to 10-19.

## What changed

### Day session — P1 selection packet

The full packet, as posted to the bus, is `tmp/p1-2026-10-15-packet.md`. Its substance:

**Outcome:** `A-54` (Small Ramsey Numbers, the second watched area), census session. Read up to four more papers credited in Table Ia, from XXER in the derived census order.

**The two "papers left" counts are reconciled, and neither moved.** The lead's 9 is the 7 Table Ia papers still unread (XXER, XSR2, XuXR, BurR, Ea1, ShZ1, Shi2: 10 bounds, which equals 122 − 112) plus AnM2 and AnM3, the Table Ib group credit. `ds1-depth.mjs` reads Table Ia only, so it prints 35 of 42.

**The census tripwire fires today.** The 10-14 census slot went to `A-47` slice 17 (the depth audit), and the row was moved to 10-15 without the tripwire being run. Through the 10-18 census end there are 2 census slots left (10-15 and 10-17), so capacity is 4 × 2 = 8, against 9 papers. Completion is restated at P3, before any source opens, from 2026-10-22 to 2026-10-23: the census ends in the 10-19 slot, the page renders in the 10-21 slot, and it lands in the 10-23 slot.

**Evidence:** `npm run reports` read 0 outside arrivals of 33 issues, and the parts sum. Encounter is MISSING (`A-59`, the blind spot on the public pages).

**CI disagreement, recorded:** the kickoff read HEAD as RED on a cancelled `pages-build-deployment` run (38654551415). A second Pages run for the same sha succeeded (38654554450), the builds API shows `built` for `1eaaeab`, and `check-ci-status` reads GREEN on both `reverify.yml` and `page-check.yml`.

**USER-FACING: yes** (conservative). Paths: `continuity/depth-audit-ds1.json`, `continuity/items.json`. Census rows stay off `ramsey.html` until the landing.

**HYGIENE INPUTS:** (a) 1: `W-11` (search our own record before calling a claim decision-ready; its read has never been run). (b) none: 0 of 754. (c) 1: HEAD CI RED in the kickoff, which the live reads above contradict.

### Day session — P3: the census closes

The manager redirected the packet (bus `5bb6bd4e`): read all seven remaining Table Ia papers today, not four, because four a slot is a planning rate and these seven carry only 10 bounds. The plan went up first as `22491a7`, before any source was opened.

**Result:** `node scripts/ds1-depth.mjs` reads "census: 122 of 122 bound(s), across 42 of 42 credited paper(s) — 53 sound, 0 defective, 49 unresolved, 20 unreachable" (exit 0). Every paper in the census order has now been attempted. Today's ten bounds:

| Key | Verdict | What was reached |
|---|---|---|
| XXER (2) | SOUND | the cited EJC edition; printed pp. 16 and 22 |
| Shi2 (1) | SOUND | Elsevier's typeset edition in full; printed p. 264, item 6 |
| Ea1 (2) | 3583 SOUND, 12677 UNRESOLVED | the survey's own 2.3(a) derivation; 12677 rests on ShZ1's 6588 |
| XSR2 (2) | UNRESOLVED | the authors' preprint plus SIAM's abstract; SIAM body behind a challenge |
| XuXR (1) | UNRESOLVED | the authors' preprint; Wiley body not reached |
| BurR (1) | UNRESOLVED | an abstract that names no value |
| ShZ1 (1) | UNREACHABLE | no public copy of the 2001 manuscript |

**Six readings were voided and redone.** The first six reading agents kept their helper scripts in a shared folder, which the brief's hard limit forbids ("any breach voids the reading"). My first answer was a ruling that kept them; the second Codex round refuted it, because the rule has no exception. All six were re-run under a corrected brief, every replacement complied, and the stored rows cite only the replacements. One verdict moved: Shi2 went from UNRESOLVED to SOUND, because its replacement reader found the publisher's PDF.

**Release date:** the census closed in today's slot, so the Ramsey page is rendered on 10-17 and reviewed and landed on 10-19, three days earlier than the 10-22 date this morning's tripwire would otherwise have pushed to 10-23. The census rows stay off `ramsey.html` until that landing.

**Found on a live page:** `copying.html` says the audit notes keep the survey's bibliography entries word for word, "5 of them so far". The notes also quote them in free text in 45 rows (15 from census session 6, 30 from session 7), which the count cannot see. The live sentence understates what we copy. It is owed in the 10-17 render (`A-54.disclosureUndercount2026_10_15`).

**Reviews:** three Codex read-only rounds, banner workdir checked each time: FIX-THEN-PUSH, FIX-THEN-PUSH (the blocker above), and no blocker on the third, whose two narrowings landed in `420f8e5`.

<!-- findings:begin -->
- The 10-14 census slot moved to 10-15 without its tripwire being run; the tripwire run today fired (9 papers against 8 slots of capacity) and the redirect then closed the census, so the date moved earlier rather than later.
- Parallel reading agents share the session scratchpad. A brief that confines output files but not helper scripts lets them overwrite each other. The census8b brief confines scripts too.
- The live disclosure on `copying.html` understates what the repository copies from the survey (45 free-text rows against a stated 5).
<!-- findings:end -->

### Close (2026-10-15 afternoon MT)

**ACTION: COMPLETED** · item `A-54` (the Small Ramsey Numbers census) · P3 `b6a328a4`. The redirect's acceptance condition was met: `ds1-depth.mjs` prints 42 of 42 papers. The manager's review re-ran it and got the same line, and found the plan `22491a7` and the readings `91e5536`, `406e3c9`, `24c0347` and `420f8e5` on origin/main, the plan first (bus `4bb0fd20`).

**Since the P3 post:** the report went up as `430cf6a`. CI is GREEN on it for reverify.yml and page-check.yml.

**Ledger delta (hygiene draft: 2 lines — 0 accepted · 2 amended · 0 rejected):**
- W-11 (search our own record before calling a claim ready to send), AMENDED. The drafted read command was applied: `git grep -n -F 0.380926 -- ledger/claims.json docs/findings/` replaces a `grep` the runner's shell does not have. Its first real run exited 0 with 24 lines, hits in both expected files. The amendment: before re-dating, the 10-15 read the row asks for found ONE unsearched assertion. The A-57 correction was put to David as ready on 10-07 with no search of our record named in its draft or that day's report. A positive control proved the pattern works (2 hits on the A-51 draft). It is recorded as `W-11.read2026_10_15`. The re-date uses `--set expectedSignalBy 2026-11-15`, not the drafted `--extend`, because `--extend` also edits `closeWhen`.
- W-11 (the same watch, on the stale-actionable list), AMENDED the same way. One execution answers both lists.
- A-54 was re-dated at P3 to 10-17 (the render). The completion is 10-19, its census record is `census8_2026_10_15`, and the disclosure finding is `disclosureUndercount2026_10_15`.

The draft had no READ-MUTATED lines. Its checks read wait-justification PASS (1 of 97 rows carry a wait) and engineering-zero PASS (0 findings for this lane). Positive control: the same engineering-zero run printed RED for two other lanes' Sentry issues (buddha-ur, frame-dial), so it read live data. `check-due-gates-dispositioned.mjs`: "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-15).

**Receipt:** P3's line in `b6a328a4` still holds (`USER-VISIBLE: none`, the readings held off the page until the landing). No bracket changed.

**Classification (by hand, not a counter):** today's findings are all instrument-facing: our own live disclosure sentence, our own reading brief, and our own process (an unsearched assertion). No cited source contradicted its record; the census stored 0 DEFECTIVE. No counted catch moved, numeric or byte-only. The standing prediction (the next record-facing catch will be a citation-quality defect found by a human reading the cited source in `A-47`) was neither confirmed nor falsified today. **Consecutive instrument-facing days: 1**, counted by hand.

## Inputs (controllable)

- One census session: a tripwire, a plan pushed before any source opened, seven papers, six reading agents run twice (the first six readings voided), and three Codex read-only review rounds.
- The hygiene helper's two drafts, applied above.

## Outputs (lagging)

- `npm run reports`: 0 outside arrivals (33 raw, 33 ours; the parts sum). G-4 is still at expected zero.
- Encounter is blind on the public pages (`A-59`), and the census rows are held off `ramsey.html` until 10-19 by design.

## Recommendation

- Slice 18 of `A-47` on 10-16, at positions 219, 269, 319 and 369.
- The Ramsey page render on 10-17: census verdicts on the page, the `pageRows()` filter removed in the same commit, and the `copying.html` undercount fixed. Review and land on 10-19.
- New reading briefs copy `tmp/depth-reads/census8b/brief-common.md`, which keeps every helper script in its reader's own folder.
- The two upstream candidates (20c's author name, 1a line 18's 1.503164) stay behind the outward gate.

## On hold pending data

- G-4: an outside report through a per-row link. None yet.
- The Ramsey page's first outcome read is the 10-19 landing.
- W-14 (the watch on upstream issue 218): re-read on 10-21.

## State Appendix

Written last, from live commands, as of the close commit's parent. This report cannot name the commit that lands it.
- `git -C C:/dev/skylark/bounds-ledger rev-parse --short HEAD` before the close commit: `430cf6a`. CI GREEN there on reverify.yml and page-check.yml (`check-ci-status.mjs`, exit 0 each).
- `node scripts/ds1-depth.mjs`: census 122 of 122 bounds, 42 of 42 papers, 53 sound, 0 defective, 49 unresolved, 20 unreachable (exit 0).
- `check-due-gates-dispositioned.mjs`: CLEAR, snapshot CURRENT.
- Release: re-run those commands; never quote these values as current.
