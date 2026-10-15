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

Written at the close.

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
