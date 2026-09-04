---
product: bounds-ledger
date: 2026-09-04
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: f6192e2
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 2
top_action_today: "Nothing needs you today, and tomorrow does. The page has always asked whether the number you are about to cite is still current, and today we found it could not answer that for the one person it was built for: if you arrived holding an out of date number, the search told you we do not track that constant, even when we do. The exact value a well known problem index has shown since January returned nothing at all. That is fixed and live. Tomorrow you get the ranked list you asked for about where else this could matter, which is the question that has been sitting with you since the 26th."
---

# Daily report — bounds-ledger — 2026-09-04

## BLUF

A reader holding an out of date number was told we do not track their constant, and now the page finds it.

**FIRST ACTION** — the declared block from `docs/daily-config.md`, five lines, from the repo root, one command per line. Line 4 goes to the network for everything and takes about three minutes, so launch it FIRST in the background before reading anything; its whole answer lands in a receipt keyed to a sha.

```
node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**Expect line 4 to exit 3, and do not spend the morning on it.** The brief leg cannot pass any more: `/t/*` sign-in went Google-session-only on 2026-09-04 and the `cc_pin` cookie was retired, so `x-cc-pin` signs nobody in. Every other leg passes. That is `A-41` (the row asking whether a permanently unverifiable leg should keep contributing to the gate's exit code), filed today and dated 2026-09-08.

**THE NUMBER THAT WILL LIE TO YOU** — **`npm run catches` reading 0 for the current partial week.** The misread is "quiet week, nothing moved". A catch is a GENERATED pin whose `expect` changed, and when upstream ADDS a constant there is no prior `expect` to change — so a week in which the mirror gained a record still reads 0. That happened on 09-02 with `88a`/`88b`, and it is the same root cause as two of today's findings. Never quote the figure without reading the same window's drift log. Last completed week (2026-08-24) reads 3; 16 movements across 7 weeks; 0 completed consecutive dry weeks.

**DON'T-TOUCH** — **`check-brief.mjs`'s refusal to render a verdict.** It got an HTTP 307 to a sign-in page this morning and printed, in its own words, that *staleness cannot be assessed from a page we never received*. What makes it work is that it separates what it READ from what it may CONCLUDE, and exits 3 rather than 0 or 1, so neither a pass nor a drift can be manufactured from a page that never arrived. That refusal is the only reason the question stayed open long enough to find that the documented cause was the wrong one — the tempting read was green-adjacent and false.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing, all five** — (1) the search dead-end, (2) a review verdict that never reached the row it judged, (3) the brief leg's third cause, (4) the date label reading "unchanged since" on a one-day-old pin, and (5) the sort key ranking newly mirrored constants as recently moved — **and none is record-facing, because no bound moved anywhere today and the mirror is in sync.** But the classification deserves a qualifier it has not needed before: **the largest of the five is a defect in what a READER experiences, not in a detector**, and the standing worry behind this whole sentence is that a lane which only ever finds faults in its own tooling is maintaining itself rather than stewarding records. A page that turned away the one visitor it was built for is closer to the lane's purpose than a broken alarm is, even though both land on the instrument-facing side of the line.

**Consecutive instrument-facing days: 8.** Written by hand, not by a counter, which is the point of it.

**The standing prediction, restated because a prediction never checked is decoration:** the next record-facing catch will be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. It has held once (2026-08-20). Yesterday it gained its first concrete address in `88a`, whose own provenance note says upstream prepared it from abstracts and that no bound was independently verified. If the next one arrives via an alarm instead, say so and correct the claim.

## What changed

- **Pasting a number you are about to cite now finds its constant, even when that value is not the row we pin** (`356987f`, live). Measured against the live page BEFORE the change: `0.380876` — the Erdős minimum overlap value erdosproblems.com has shown since January, which `C-7` (the manual claim pinning that page's bound) records as three records stale — returned **0 rows**. So did `246`, the bounded prime gap value superseded by `240` in a preprint of 31 August. Both sit in tables this ledger mirrors, at `1b.md` line 24 and `88a.md` line 22. After: 1 row and 2 rows. The reader arriving with exactly the problem this lane exists for was being shown *"we are not watching it"* about a constant we track.
- **Why the earlier work did not cover it, which is the transferable half.** `findKey` already carried previously-pinned values and its design note says in terms that a reader holding a stale value is the one most likely to have something worth telling us. But a previous pin is a value that moved *while we watched*; a value already superseded when we first pinned the constant was never a pin of ours, and that is most of them. **Every instrument keyed to our pin history is blind to a constant's past when we arrived after it.**
- **The values are SEARCHABLE and never DISPLAYED, and that line is load-bearing.** A current value shown beside a previous one is a from-to pair, and a from-to pair is a movement claim whatever noun sits in the sentence — commit `8a4192a` refused exactly that inference on exactly this data. Matching a string asserts nothing. A selftest asserts a table value is absent from the rendered text, and the live page was confirmed to carry `0.380876` only inside the search attribute.
- **A DO-NOT-SHIP verdict never reached the row it was about** (`a962921`). `A-20` (the open question of whether the fetch layer should retry on 429/502) says in its own fields that the cross-family review it requires is "NOT done". The review landed 2026-09-01T23:59:54Z with **DO-NOT-SHIP as-is** — one blocking finding, four should-fix, three nits — about four hours after that sentence was written, and nothing updated the row. Its 09-08 instruction is *"if the branch has not been reviewed, surface the LATENCY"*, so a cold agent next week would have chased a week-old review while the actual blocker sat unnamed. **F1 and F2 are both still open.**
- **`A-41` filed: the brief leg went permanently red today.** `npm run verify` exits 3 on `check-brief` alone. The documented cause is a missing `CC_PROMPTS_PIN`; the pin was present, and a probe carrying `x-cc-pin` still returned 307 to `/t/signin`. The actual cause is that `/t/*` sign-in went Google-session-only and the `cc_pin` cookie was retired the same day. The brief is fine; no script can read it. A leg that fails forever with no repo-side fix is this lane's founding defect, so the question was filed rather than patched.
- **`A-33` leg 1 shipped a day before its gate** (`7e741c8`). `scripts/check-upstream-reports.mjs` diffs the recorded state of reports we filed upstream against a live listing and fires on the TRANSITION, never on the standing fact that an issue is closed. Two mutations proved both directions; the one that matters made it *always* fire and tripped *"an unchanged state must not fire — this alarm has to be able to go quiet"*. control: the unmutated selftest exits 0, so the red belongs to the mutation and not to a test that fails on everything.
- **`A-42` filed: two more readers keyed to pin history, both user-facing** (`f6192e2`). A one-pass audit — `grep -rn "prevExpect|changeFor("` over `scripts/`, the primitive plus exactly two remaining consumers — found that `1b`, the constant this repo opened on, reads live as *"first pinned 2026-09-03 — unchanged since"*, which is true about our pinning and reads as a claim about the record; and that `data-changed` for an added constant is the day WE pinned it, so "most recently updated first" ranks newly mirrored constants as though their record had just moved. Filed rather than patched because both change what the page ASSERTS.
- **`returnRate` gained an N_min floor** (`a962921`), and it is already doing its job in the real cadence rather than only in a test: today's `npm run traffic` printed *"INAPPLICABLE at n=2 distinct viewer(s), below the N_min of 3"* with the arithmetic beside it, where yesterday it printed a bare `1.00` into a report.

## Inputs (controllable)

- **Five commits, all pushed, CI green at each**: `a962921` (P2 continuity), `356987f` (the search fix), `7e741c8` (A-33 leg 1), `f6192e2` (A-42 + traffic sample), plus this report's commit. `npm test` exit 0 across 22 self-tests; `reverify.test.mjs` reports 28 workflow steps with every self-test present in CI, which is the guard confirming the new wiring rather than my say-so.
- **KP-78 (the standing rule that no detector ships until it has been shown to fire with the condition present and stay silent without it) was run on every detector shipped today, with two mutations each**, because a mutation proves the assertion it TRIPPED and not the one you meant. control: every unmutated run exited 0, so each red is attributable to its mutation rather than to a battery that was already failing. For the search fix: killing the extractor tripped its positive control, and killing only the SEAM — `findKey` no longer consuming the values while the extractor still worked — tripped the emitted-attribute assertion, which is the regression a `findKey`-only test cannot see. For `A-33` leg 1: never-fire and always-fire, and the second is the one that matters. Every mutation was proven landed before its verdict was read, and every restore was from a byte copy rather than `git checkout --`, because the fixes were uncommitted.
- **Codex: GREEN (probe 2026-09-04T17:05:54.042Z), one dispatch.** `codexCalls: 1` — the CLAUDE.md section split, which is the case the calibration names as typing bulk under a judgment. Every earlier phase declined with the reason recorded: the day's diffs were judgments whose artifacts *are* the thought, not boilerplate beneath one.
- **The corruption guard refused one of my commands and was right.** I piped `npm test` into `tail`, which is this lane's founding defect in my own hands. The refusal cost under a minute.

## Outputs (lagging)

- **`G-4` = 0 outside arrivals, and it is a MEASURED zero.** `npm run reports` fetched 27 issues, excluded 27 as ours by author, and the parts reconcile 27 + 0 + 0 = 27. **positive control:** that same run returned 27 non-empty issue rows, so the probe reaches GitHub and the zero is a classification of real data rather than an empty read — which is what separates it from a zero out of a dead probe. Day 27 since the public flip.
- **2 unique viewers in the trailing 14 days; 6 unique viewer-days since the flip.** `G-4`'s pre-committed threshold for its zero to mean anything is 30 unique viewers by 2026-09-26. **It cannot fill**, and that arithmetic is escalated into `A-34` rather than re-dated. The return-rate proxy now reads INAPPLICABLE at n=2 rather than a bare 1.00. 166 unique cloners in the window, mostly our own CI, deducted for nothing and said so.
- **`npm run catches`: 0 for the current partial week**, 3 for the last completed week, 16 movements across 7 weeks, correction-queue depth 0. Read the BLUF paragraph before quoting the 0.
- **The mirror is in sync**: no drift, 116 files matching upstream `01a0bc8` (an upstream `teorth/optimizationproblems` sha, which does not resolve in this repo), 241 claims of which 239 hold, 0 broken, 0 unreachable, and 2 are the `manual: true` pair that reports UNVERIFIED by design. **positive control:** that same run printed UNVERIFIED for those two rather than a uniform verdict, so the field discriminates and the two zeros beside it are real rather than a checker that reports one answer for everything.

## Recommendation

**Give `A-34` a session tomorrow, not a spare hour.** It is the question David asked on 26 August — where else this ledger can have the kind of impact `G-3` produced — and its own trigger says the answer goes to him as a board card with the ranking and the costs, off "real research into each candidate's citation footprint and correction path, which is a day's work rather than an afternoon's". The row holds candidate shapes and evaluation criteria but no per-candidate evidence, which is exactly the gap. It has slipped twice. If the research is not complete by the gate, the row is explicit that we give a date rather than send a thinner version, because a ranked list with no citation-footprint evidence behind it is a brainstorm wearing a ranking.

**Take `A-20`'s F1 on its own date with a whole session.** The branch merges cleanly and the verdict is specific: a main-module guard that exits 0 with no output through a junction path, which is this lane's founding defect in a new shape. A half-started fix is worse than an untouched one, and 09-02 already produced one regression from beginning a DO-NOT-SHIP fix late.

**Do not let today's search fix stand as the whole answer to the coverage question.** It fixed the lookup, not the reach: the same reader still has to know this page exists. That is `A-34`'s territory and it is David's call.

## On hold pending data

- **`G-4` (an outside party acts on a watched record without us filing the report)** — 0 arrivals, day 27, threshold 30 unique viewers by 2026-09-26 which cannot fill. Not re-dated; the re-point rides on `A-34`.
- **`W-6` (the read window for the README report-an-error channel)** — re-pointed 2026-08-20 to the first unsolicited outside contact at n=1, dated 2026-11-06. Today's traffic figures are context for that read, not a gate on it.

## State Appendix

Written last, from live commands, because a report cannot name the commit that lands it. Every figure below carries the command that produced it and the instant it was read.

- **HEAD**: `f6192e2` = `origin/main`, working tree clean at the time of writing — `git -C . rev-parse HEAD origin/main` and `git status --porcelain`, read 2026-09-04 12:52 MT. This report's own commit lands after that read and is therefore not in it.
- **CI**: GREEN at `f6192e2` — `node ../skylark-site/scripts/check-ci-status.mjs --repo . --workflow reverify.yml`, read 2026-09-04 12:47 MT, 1 completed non-scheduled success, 0 failures, 0 pending.
- **Gates**: `npm test` exit 0, 22 self-tests, 28 workflow steps. `npm run check` is exit 3 on the brief leg and passes every other — that is `A-41`, not a regression, and it is stated rather than called green.
- **Public page**: 115 rows, `c-1b` present, 115 canonical cite URLs, 0 anchor-form — fetched from `https://u00dxk2.github.io/bounds-ledger/` with the page title present as the positive control. **295,508 bytes at `7e741c8`'s build**; a byte count without its sha invites a false drift reading, since `356987f`'s build measured 293,251 seven minutes earlier.
- **Pages**: build row `status: built` for push tip `356987f` at 2026-09-04T18:14:11Z and for `7e741c8` at 2026-09-04T18:21:29Z — `gh api repos/u00dxk2/bounds-ledger/pages/builds`.
- **Deploy drift**: NOTHING SWEPT — `node ../skylark-site/scripts/check-deployed-sha-drift.mjs --service bounds-ledger` reports `no Render service matches "bounds-ledger" (47 services read)`, `population: nothing`, `blindTo: every Render service`. This is a Pages lane with no Render service, so that sweep has no subject here and no green may be manufactured from it. **positive control:** the same command read 47 Render services before finding no match, so it reached the API and the empty result is about this lane rather than a dead probe.
- **Ledger**: 19 open rows of 55, 0 due on or before 2026-09-04, 0 broken path citations, 0 of 19 open gate-shaped rows missing a `readCommand` — `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print` and `node scripts/check-readcommand-separators.mjs`, read 2026-09-04 12:46 MT. **positive control:** the same run swept 54 rows and resolved 19 open ones to dates, so it read the ledger; a zero from an unread file would report 0 considered, not 0 due of 54.
- **Dependabot**: 0 open alerts — `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open`, read 2026-09-04 12:50 MT. No dependency changed today, so the read-after-the-lockfile rule has no subject; `npm install` is a no-op on this repo (Node stdlib only). **positive control:** `check-engineering-zero.mjs` swept 23 lanes in the same pass and reported RED on three of them, so the alert path does return non-empty and this lane's zero is a measured absence.
- **Continuity endpoints**: all three 200 OK with the PIN header, read 2026-09-04 12:53 MT — `items-stale-actionable` (0 items, 19 considered), `upcoming-triggers`, `auto-decidable-items` (3: `A-33`, `A-34`, `A-2`; this lane's rows carry no severity field, so no HIGH/MED split exists to report).
