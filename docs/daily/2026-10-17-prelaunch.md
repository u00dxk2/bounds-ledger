---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-17
lifecycle_stage: launched
last_deploy: 3c183c5 (HEAD at the 10-17 kickoff)
on_hold_items: 0
top_action_today: name upstream pull request 225's stronger 1b construction on the 1b page note (A-82)
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-17 (Saturday, MT)

## BLUF

P1 chose one change: the 1b page note will name the stronger construction proposed upstream in pull request 225, on David's answer to card 0dfcf407. It is built and reviewed once in the working tree, and nothing is committed until the manager's P1 review.

No first command until the P1 review: the change is built, and its commit waits on the manager.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** the 1b constant page names the stronger upper bound that pull request 225 proposes to the mirrored table (an upstream pull request, `teorth/optimizationproblems`, by another author), as proposed and not accepted, with exactly what this ledger checked. Item `A-82` (the human read of the constants-watch candidates, which carries the 1b note).

**The user problem, in the user's words:** someone about to cite the Erdős minimum overlap constant asks "is 0.380868 still the best upper bound anyone has?" Today the page answers with a 512-step construction at 0.3808590566149 and says nothing about a stronger one that has been public since 2026-10-13.

**Evidence** (each read today unless marked):
- OBSERVED · `gh pr view 225 --repo teorth/optimizationproblems` · one pull request · read 2026-10-17 MT · state OPEN, mergedAt null, its head commit unchanged since 2026-10-16 (compare `headRefOid` in that command's `--json` output with the saved 10-16 view), last updated 2026-10-15T23:12:43Z.
- OBSERVED · `node scripts/step-overlap.mjs --store` · both 1b entries, fetched from their pinned commits · 2026-10-17 · MATCHES twice; the pull request's construction gives exactly 10919976354672639675467789613614419/28672000000000000000000000000000000 = 0.38085855031642856010…, below the table's 0.380868 and below our existing note's 0.3808590566149.
- OBSERVED · `node scripts/step-overlap.mjs --file … --oracle` on the 512-step and 2400-step witnesses · every lag · 0 mismatches each; the 2400-step one (the table's credited construction, as hosted beside the 512-step one) reproduces 0.380868 as the positive control. Literal output: `tmp/a82-note-review-2026-10-17/out-evaluator-2026-10-17.txt` (local, not committed).
- OBSERVED · `npm run reports` · 34 raw issues, all ours · 70 days since the public flip · 0 outside arrivals, and the parts reconcile (34 + 0 + 0 = 34).
- OBSERVED · `docs/evangelism-bar.md` line 120 · the bar's own metric is NOT MEASURABLE (a static page with no analytics); unchanged today.
- MISSING · who reads `c/1b.html`: no instrument; the page carries no analytics by design.
- HYPOTHESIS · a reader of this page is better served by the strongest checked proposal beside the table than by a weaker one; not measured.

**Permission:** David's answer to card 0dfcf407 (needs-decision bus 99b614ec): no upstream contact, and yes to the note revision after the reviews; paraphrased, as this repo records his words (his 2026-08-07 ruling). That is why A-82 carries a paraphrase and not the verbatim text the kickoff asked for (`A-82.davidRuling2026_10_16b`). Nothing goes upstream. A-82 is open, not parked or frozen.

**Next action — improve.** The change is built in the working tree (uncommitted, P1 prep): the evaluator moved from tmp/ into `scripts/step-overlap.mjs` with a selftest and a red-arm; `ledger/newer-results.json` gains the pull-request entry; `scripts/newer-results.mjs` renders it. Reviews run so far, both Codex read-only: a code review (DO NOT SHIP, 1 blocker and 2 smaller findings, all three confirmed and fixed in the tree) and a claims pass (PUBLISH WITH FIXES, 3 fixes, all applied). A second round of both runs on the fixed tree before any commit. First command after the review:

```
node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs
```

**Pass bar:** written on `A-82.passBar2026_10_17` before the commit. One divergence from the kickoff, stated there: the word ban is NOT narrowed; the page links the pull request on the mirrored repository and prints the construction file's SHA-256, and the construction repository's address is stored and never rendered.

**Acceptance condition (observable):** the live `https://u00dxk2.github.io/bounds-ledger/c/1b.html` carries the pull-request sentence ("proposed in pull request 225 to the source table's repository …"), `npm run served` reports SERVED for `c/1b.html`, every other `c/` page is unchanged, and `reverify.yml` and `page-check.yml` are green on the pushed commit.

**Delivery and encounter checks:** delivery is `npm run served` plus one fetch of the live page after the Pages build (about 3 minutes, measured 2026-09-22). Encounter: the page is static with no analytics, so the only event that could appear is an outside issue through the row's "looks wrong?" link (`npm run reports`); it is readable at N = 1, and the expected count today is zero.

**USER-FACING: yes.** Paths: `c/1b.html`, `ledger/newer-results.json`, `scripts/newer-results.mjs`, `scripts/step-overlap.mjs` (new), `package.json`, `.github/workflows/reverify.yml`, `continuity/items.json`.

**A prior-day retro finding that bears on the choice:** 10-16's Q2 (writing the exact evaluator myself, in tmp/) recurred in a sharper form: its regex reader, carried into scripts/ unchanged, was the blocker today's code review found. A witness nested in another field could have been evaluated in place of the file's own.

**HYGIENE INPUTS** (copied from the kickoff's reads):
- (a) dated gates due today: none — read `check-due-gates-dispositioned.mjs --print` at compose and `--snapshot` this morning (0 due).
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger" (0 of 754).
- (c) state reads marked CROSSED: board cards carrying David's word, 1 of 1 (card 0dfcf407, which is today's selection and leaves this list); prior-day retro, 9 still-on-discipline of 10 tagged findings; missingLinkedCommits, NOTHING SWEPT (0 of 0 considered).

## What changed

Nothing committed yet (P1 holds at the manager boundary).

## Inputs (controllable)

The note revision above; two Codex read-only reviews.

## Outputs (lagging)

`npm run reports`: 0 outside arrivals (of 34 raw issues, all ours).

## Recommendation

Approve the selection; the second review round runs while the review is pending.

## On hold pending data

None beyond the encounter read above.

## State Appendix

Written last, at close, from live commands.
