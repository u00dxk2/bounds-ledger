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

The live 1b page now leads its note with the stronger construction from upstream pull request 225 (0.3808585503165, below the mirrored table's 0.380868), read as open and not merged on 2026-10-17, with the file's SHA-256 and what this ledger checked. Three commits, pushed together: `af684fe` (the note, and the evaluator moved into `scripts/step-overlap.mjs`), `4d1f4f8` (every lag recomputed by an independent exact method; it also corrects `af684fe`'s message, which called the coverage gap closed by checks a review then defeated), `a2a1f53` (a comment fix). Only `c/1b.html` changed under `c/`.

The evaluator now refuses a witness it cannot read structurally (a regex reader could have evaluated a nested witness instead of the file's own) and a raw link not already in resolved form. It recomputes every lag sum a second time by Kronecker substitution: 0 mismatches over all 229,375 lags of the pull request's file.

## Inputs (controllable)

Six Codex read-only reviews, each banner checked against this repo: code r1 (DO NOT SHIP, 3 findings), claims r1 (PUBLISH WITH FIXES, 3), code r2 (SHIP WITH FIXES, 1), claims r2 (PUBLISH WITH FIXES, 2), r3 on `af684fe` (SHIP WITH FIXES, 2), r4 on `4d1f4f8` (SHIP, 1 comment nit). All twelve findings were confirmed against the source and fixed; none was rejected. The manager's P3 hypothesis (only 129 lags of the large witness were checked independently) was confirmed and is answered on `A-82.fullRangeCoverage2026_10_17`.

## Outputs (lagging)

`npm run reports`, after the ship: 34 raw issues, all ours, 0 outside arrivals; the parts reconcile (34 + 0 + 0 = 34). Whether any reader met the changed page cannot be seen: the page is static with no analytics (`A-59`, the row recording that encounter on the public pages is blind).

## Recommendation

None new. The two CANNOT TELL HERE candidates and the reader-facing "newer results checked through" line stay on `A-82` for 2026-10-20; `W-15` (the watch on pull request 225) is what notices upstream merging it, which would make both 1b entries fail validation and turn `npm run check` red as the reconcile signal.

## On hold pending data

`W-15` (the watch on upstream pull request 225): upstream's decision on it, next read 2026-10-23.

## State Appendix

As of 2026-10-17T17:01:53Z (UTC, the `npm run served` read), from live commands:
- HEAD and origin/main: `a2a1f53` (`git rev-list --count origin/main..HEAD` → 0).
- CI at `a2a1f53`: GREEN for `reverify.yml` and for `page-check.yml` (`node scripts/sky.mjs check-ci-status.mjs --workflow <file> --wait`).
- Verify receipt: exit 0 at `a2a1f53` (`tmp/.verify-receipt.json`).
- Delivery: `npm run served` → SERVED `c/1b.html` (1 checked, 0 stale); a fetch of the live page returned 200 with the pull-request sentence once and "record" zero times.
- Release for anything above: re-run the command named beside it.

## Close

ACTION: COMPLETED · item A-82 (the item carrying the 1b note) · P3 6e9e7681 (the P3 task-complete's bus msgId)

The acceptance condition approved at P1 was met (manager review COMPLETED, bus bdc8fbb1): the live c/1b.html carries the pull-request sentence, `npm run served` reported SERVED, only c/1b.html changed under c/, both workflows are green, and `npm run reports` ran after the ship.

**State changed since the P3 post:** CI is now read GREEN on the 55c4274 tip for `reverify.yml` and `page-check.yml` (`check-ci-status --wait`, one completed non-scheduled success each, 0 failures).

**Ledger delta** (`continuity-edit`): `A-82` gained `linkedCommits` (af684fe, 4d1f4f8, a2a1f53) and a dated note recording the shipped revision and what stays owed on 2026-10-20; `W-15` (the watch on pull request 225) gained the reconcile signal for a merge. No row closed, none re-dated: both were already on their dates (`A-82.nextCheckDate` 2026-10-20, `W-15.expectedSignalBy` 2026-10-23).

**Hygiene draft:** 0 lines (0 accepted · 0 amended · 0 rejected); its READ-MUTATED section reads "none"; check-wait-justification PASS (1 of 101 rows carry a wait justification), check-engineering-zero PASS (0 findings for this lane). Due-gate verify: CLEAR, snapshot CURRENT (today's Phase-0 due set of 0 rows). Ledger battery (`continuity-check`) exit 0 with two warnings: UNTRACKED_COMMITS (today's A-82 commits, now linked) and STANDING_PATTERN_CONTRADICTION on `A-81` (the Ramsey-area newer-result watcher), which predates today and was not touched.

Positive control: the same due-gate resolver listed 1 due row on 2026-10-16 (yesterday's primer, "Owed gates — 1 due on/before 2026-10-16"), and the engineering-zero run that read 0 findings for this lane returned 1 finding fleet-wide in the same read (another lane's Sentry issue), so both checks can return non-empty.

**Pending reads:** 2026-10-18 `A-47` (the depth audit) slice 19; 2026-10-20 `A-82`: the two CANNOT TELL HERE candidates and the reader-facing "newer results checked through" line (outward text, owing a cross-family claims pass and a review before it renders); 2026-10-23 `W-15` (the watch on pull request 225).