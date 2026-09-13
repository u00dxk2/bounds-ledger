---
product: bounds-ledger
date: 2026-09-13
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: f95006d
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "We checked four more of our own records against the papers they cite, and all four held up. We also fixed something about how we report that work: some records get checked because we already suspected them, and others get picked in order regardless of what we think. Those two are not the same evidence, and until today the page added them together. Now every checked record says which kind it was, and the headline count only includes the ones picked in order — which honestly means that number is now 7, where yesterday's page said 9. One real problem did surface: a paper the table cites has a dead link, so anyone following it reaches nothing. We have not contacted anyone about it. Nothing needs you."
---

# Daily — bounds-ledger — 2026-09-13

## BLUF

Four more cited records were read against their sources, and all four held.

The page now says how each audited record was chosen, and the published coverage figure is now 7 because two suspicion-drawn rows had been sitting inside it (baseline: the 9 printed on the public pages rendered at `3d65a09`, recorded in `docs/daily/2026-09-12-prelaunch.md` § Outputs, read 2026-09-12).

**FIRST ACTION.** Pull, then start the gate — three minutes of network, and a receipt on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** Coverage reads **7 of 673** today and read **9 of 673** yesterday, and no record was dropped from the audit. Two of the nine (`A-47-0001` and `A-47-0002`, the depth audit's slice 1) were chosen BECAUSE a value looked wrong, so they carry no rate and cannot accumulate into a coverage figure. They now count in a separate suspicion-drawn set of 6, which the page states beside the 7. A cold reader takes the drop as lost work; it is a correction to how the work was counted. Run `node scripts/depth-audit.mjs` — its `selection:` line prints both populations.

**DON'T-TOUCH.** `depth-audit.mjs --corpus` and the four narrow checks under it. Today I added a fifth check beside them and had to delete it within the hour: it asserted that the two selection counts sum to the total, which is true by construction and could never have failed. What makes the existing four work is that each one names the single failure it catches and has a demonstrated failing case; the deleted one had neither.

## What changed

**Four more cited rows read against their sources, all four SOUND** (`f95006d`). The rows neighbouring the H2016 cell in the minimum-overlap table — `0.380924` [GGSWT2025], `0.380876` [YKLBMWKCZGS2026], `0.380871` [T2026], `0.380868` [YLTLYSTYLLGDHZSWZSHMELCZX2026]. Every source states its own figure at exactly six decimals, so upstream quotes rather than truncates, and **the H2016 row is the only one in the column whose source gives full precision** — the only cell where upstream must choose a rendering, which is what makes `A-43` (the watch on that cell) a one-row question rather than a column-wide one. The readings were made 2026-09-05 and recorded on `A-43` that day; today they were transcribed into the audit store, and the row text and hashes were re-read from the mirror, with the 88a:20 hash recomputed as a control that the extraction uses the store's own convention.

**Two of the four carry something a future reader needs.** The SimpleTES paper **contradicts itself**: its introduction headlines `0.380856` (eleven occurrences against five for `0.380868`), while its results section says "Our best result is 0.380868" and the authors exclude the smaller figure from their table themselves, for fair comparison. Anyone grepping that paper will conclude our table is stale; it is not. And upstream's cited URL for [YKLBMWKCZGS2026] is **dead** — it returns GitHub Pages' "Site not found" at HTTP 200 — so a reader following the citation reaches nothing. That is recorded as its own UNREACHABLE citation leg beside the SOUND value leg, and **nothing has been sent to anyone**: the outward gate is unchanged.

**How a row was chosen now reaches the reader** (`f95006d`). Every audit entry carries `selection`, the page prints it under each row, and the two populations are counted apart. The store has said this in prose since 2026-09-10 and the page said nothing, so a reader saw one undifferentiated count with two suspicion-drawn rows inside it.

**The adversarial review blocked the ship on my own new code.** The two groups deduplicated independently, so one row audited twice — once by position, once on suspicion — would have entered both, printing "1 bound row(s) here" beside "1 drawn by position, 1 chosen because…". Fixed by partitioning by row first. **My first red-arm was not good enough**: the mutation tripped an older assertion about rechecks and said nothing about the new guard, so a second mutation was needed to make my own assertion name the property it broke. control: `git show 80b9942:scripts/render-constant-pages.mjs` carries no selection split at all, so the double-count could only have arrived with today's change — had that file already split the counts, the defect would have predated this session and the attribution here would be wrong.

**`A-45` calibrated, then ruled a regression floor** (`80b9942`). The value/non-value split was "carries a 4+ digit run", wrong in both directions by an unbounded amount: 58 genuine short and symbolic bounds were outside the measured population and a Wikipedia footer was inside it. The population is now named by pin KIND. It reads 198 of 198, and the stricter own-row match produced zero new misses, so the old leniency was never load-bearing.

## Inputs (controllable)

**`W-7` — the instrument read against its own claim today was a check I wrote and deleted the same hour.** Adding the selection split to `depth-audit.mjs`, I wrote a refusal asserting that the systematic and suspicion counts sum to the row total. Asked what it claims to measure and whether its output could ever have said otherwise, the answer is no: the suspicion count is computed as `total − systematic`, so the sum is an identity and the branch is unreachable. It was replaced with one that can fire — an unrecognised `selection` value, red-armed by writing `systemattic` into the store, which printed `RESULT: FAIL — 1 row(s) carry a selection outside systematic|suspicion` at exit 3 and would otherwise have been filed silently as suspicion-drawn. (Rotation: 09-12 was the gate resolver's own RESULT line; today is a check of mine that had no failing case.)

**Findings classification, one sentence of human judgment: today's findings are INSTRUMENT-FACING without exception, and the record-facing material published today was found on 2026-09-05, not in this window.** Every value read held up, and what was wrong was ours, in four places listed here: (1) two populations added together on the public page; (2) a coverage split that would have double-counted a rechecked row; (3) `A-45`'s value/non-value threshold, wrong in both directions; (4) a dead figure in `docs/daily-config.md`. The dead upstream citation is genuinely record-facing, and it belongs to the 09-05 window where it was found.

**Consecutive instrument-facing days: 2.** Yesterday's report reads 1 and I took the number from it rather than recalling it. Written by hand; nothing counts this.

**Was the counted catch numeric or byte-only?** Neither: `npm run catches` reports `2026-09-07  0 (current, partial)`, so nothing was counted either way this week. Today's work came from READING cited sources and from correcting our own counting, neither of which that instrument can see.

**The standing prediction, checked.** Yesterday registered: the next record-facing catch will be a mismatch between what a row ASSERTS and what its source SUPPORTS — a quantifier, a strictness, a rounding — rather than a wrong value or a wrong citation. **No new record-facing catch arrived today, so it stands untested.** Worth noting against it: the dead cited URL published today is exactly the shape the prediction excludes (a wrong citation), but it was found on 09-05, before the prediction existed, so it neither confirms nor refutes it. The older form of this prediction in `CLAUDE.md` — a witness-value mismatch on a recently added constant — is superseded by yesterday's; carrying one, not two.

**One gate run per phase, and the sequencing held.** Three `npm run verify` runs today, one per phase that changed code, each taken after its commit landed with nothing committing during it: `8172726` at 15:46Z, `80b9942` at 16:20Z, `f95006d` at 16:36Z, all exit 0 with `failedGates []` and no `headMovedDuringRun`. Yesterday cost four runs for the same amount of work.

## Outputs (lagging)

- **`npm run reports` (`G-4`'s primary indicator): 0 outside arrivals.** positive control: the same probe fetched 29 issues and accounted for every one as ours (`29 + 0 + 0 = 29`), and it refuses to print a bare zero for that reason.
- **Depth audit (`A-47`): 18 audited — 10 sound, 0 defective, 4 unresolved, 4 unreachable.** positive control: the reader's own sum-check requires the four verdict counts to reach the raw row count, and 10+0+4+4 = 18. **Coverage on the public pages is 7 of 673 cited rows drawn by position, with 6 more chosen for suspicion counted apart.**
- **Unique viewers: 1 in the trailing 14 days** (`npm run traffic`, sampled today, 49 days recorded). Return-rate proxy INAPPLICABLE at n=1, below its N_min of 3; the arithmetic is printed so the figure stays auditable. The 210 cloners in the same window are largely our own CI and are deliberately not deducted.
- **Open issues: 0** — search space `gh issue list --repo u00dxk2/bounds-ledger --state open`. positive control: the same reader saw 29 issues with `--state all` today, every one ours, so the zero is an exclusion rather than an empty fetch.
- **`A-45` floor: 0 misses** — `node scripts/check-resolvability.mjs`, run locally, 198 of 198. The ratio is the floor's pass condition, not a coverage figure; the MISSES count is the line that matters.

## Recommendation

**`[A — user-visible]` Take `A-48` tomorrow — the two-index citation comparison promised to David for 2026-09-16, now three days out at 0 of 3 candidate surfaces scored.** Its denominator is surfaces × two indices × four criteria, never the 673 cited rows. It is David-facing rather than page-facing, so if it lands early there is room for a systematic depth slice behind it.

**`[B]` Finish the readCommand sweep — seven open rows still carry one over 800 characters**, each listed with its length in today's P2 post (`736cba48`) and re-derivable from `continuity/items.json` by reading every open row's `readCommand` length. Three were cut today; the rest is the same mechanical shape and is the first thing worth delegating.

**Tomorrow's gate order is written once, in the primer** (`docs/cold-starts/2026-09-14.md`); this section deliberately does not restate it.

## On hold pending data

Nothing is on hold, and **no open row carries a David-wait** — `answered-cards.mjs --project bounds-ledger` returned no waiting, answered or pending-verification card for this lane today. `W-3` (independent acknowledgement of the erdosproblems.com/36 correction, 09-24), `G-2` (a contributed bound improvement, 09-22) and `W-6` (a first unsolicited outside contact through the README channel, 11-06) all wait on someone else acting and none can be advanced cold.

**`A-43` — the watch on the H2016 minimum-overlap cell — is now decidable and is not being decided here.** The lookups it required, the proved values behind `0.380924`, `0.380876`, `0.380871` and `0.380868`, are done and published; what remains is the report-shape decision, which is gated on adversarial review and David's approval. Its date stands at 09-15.

## State Appendix

_Written last, from live commands. This report cannot name the commit that lands it._

- **CI:** GREEN at `80b9942` — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml` → "1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending". The run for `f95006d` had not completed when this was written; UNKNOWN is not a pass and is not written as one.
- **Gate:** `npm run verify` exit 0 at `f95006d`, receipt 16:36:08Z, `failedGates []`, no `headMovedDuringRun`. `check:brief` reads UNVERIFIABLE as it has since the `/t/*` login wall (`A-41`), excluded from the exit code and never counted as a pass.
- **Offline battery:** `npm test` exit 0.
- **Mirror:** no drift, 116 files match upstream `9d57db8` — an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo.
- **Corpus:** 770 bound rows across 115 constant files, 673 cited, 97 uncited — `node scripts/depth-audit.mjs --corpus`, which refuses (exit 2) when either baseline cannot be established.
- **Publish:** the Pages build row for `f95006d` reads `built 2026-09-13T16:36:42Z`, and the live page at `/c/1b.html` returned HTTP 200 with the four labelled rows and the summary sentence quoting 7 and 6. **Yesterday's open question is CLOSED:** `e035373` does have a build row, `built 2026-09-12T20:16:11Z` — it simply did not exist yet when yesterday's read was taken at about 20:10Z. There was no anomaly; the read was early. Release: `gh api repos/u00dxk2/bounds-ledger/pages/builds`.
- **Dated gates due:** 0 remaining on/before today — `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print --today=2026-09-13`. positive control: the same command listed `A-45` as due this morning and its read has since been run and stamped, so the zero is what dispositioning produced.
- **Continuity:** `continuity-check` status OK — it read WARN with 6 untracked commits this morning and OK after each was recorded with its rationale.
