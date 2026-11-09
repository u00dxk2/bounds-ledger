---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-09
lifecycle_stage: launched
last_deploy: 3be7236 (CI GREEN on reverify.yml and page-check.yml; GitHub Pages; no Render service)
on_hold_items: 0
top_action_today: on a desktop index, stop exact numbers breaking across two lines where they could fit on one
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-09 (Monday, MT)

## BLUF

Today's work is to stop exact numbers on the desktop index breaking across two lines. Measured this morning at 1366 px, 14 numbers break when one row is shown, including 1b's lower bound.

## What changed

- P1 chose the day's work (selection packet in the State Appendix). Nothing has shipped yet.
- The morning block ran. `npm run upstream` printed "0 transition(s) across 3 recorded report(s)". `npm run traffic` printed 7 unique repo viewers and 285 unique cloners in the latest 14-day window (page visitors are not counted).

## Inputs (controllable)

- Measure `A-101` (the row for numbers wrapping mid-digit on desktop) on the live page before changing anything, and test the obvious CSS fix in the browser before choosing it.

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). The first Search Console read is due 11-11 on `W-18` (the watch for that read).
- `npm run reports` printed "parts reconcile: 37 + 0 + 0 = 37", so 0 outside arrivals of 37 raw issues.

## Recommendation

- [A — user-visible] Ship `A-101` (the row for numbers wrapping mid-digit on desktop) in P3, on the acceptance condition in the packet below.

## On hold pending data

- The first Search Console read, due 11-11, sits on `W-18` (the watch for that read).

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-08.md` (no 11-09 primer; the 11-08 file is the newest). Its banner governs: morning block, then the reads dated today.
- Listener: SSE alive (hello 16:07:40Z in `read-listener-strand.mjs`, 0 consecutive no-loop warnings) and loop-tick armed by tool call. Waker ladder ranks 1 to 3 launched; rank 1 was relaunched at the kickoff's wake.
- Codex: GREEN per the kickoff's probe line (16:02:35Z, execute and write proved).
- CI, as of about 16:11Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each reading 1 non-scheduled success for `3be7236`. `git rev-list --count origin/main...HEAD` printed 0. `git pull --ff-only` printed "Already up to date."
- Deployed-sha drift: NOTHING SWEPT for this lane. The fleet table covered 38 services and exited 0, which is a verdict about those services and not about us. This lane publishes through GitHub Pages (`docs/daily-config.md` § Deployed-sha drift).
- Local verify not run: the fleet rule is that CI green at HEAD replaces it.
- Harness: running 2.1.319 · fleet UNIFORM · installed 2.1.319 (SAME).
- Yesterday's Recommendations: one. Carrying today to P3: `A-101` (the row for numbers wrapping mid-digit on desktop).
- Board: `update-david-board.mjs --list` returned 0 items for this lane. `answered-cards.mjs` reported 0 new. The one portfolio-wide card it shows, `9174731b`, read whole with `--id`, covers BloomEDU, Decomposer and Syntopica and names nothing in this repo.
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` exited 0 and printed "no product-love cycle picks this lane today (4 cycle(s) rotate over 24 lanes); run the normal P3".
- The bar's metric: `docs/evangelism-bar.md` says it is NOT MEASURABLE, and nothing today changes that. `docs/evangelism-evidence.md` does not exist in this repo (`Test-Path` printed False).
- positive control: `Test-Path docs/evangelism-bar.md` printed True from the same directory, so the False above is about the file and not the path; the board's 0 sits beside `answered-cards.mjs` returning card `9174731b` from the same store.

### P1 selection packet

**Outcome:** a desktop reader sees an exact number whole, on one line, wherever it can fit. Item `A-101` (the row for numbers wrapping mid-digit on desktop), pulled forward from its 11-14 date by choice.

**The user problem, in the user's words** (from `docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out without redoing the literature search I did last year?" Answering that means comparing digits. A value split across two lines is harder to compare, on a page whose product is the exact number.

**Evidence**

- OBSERVED · `playwright-cli eval` on the live index at 1366x900, about 16:12Z, HEAD `3be7236` · all 120 rows · one morning, by us. Definition: a run matching the pattern digit, digits or dots or commas, digit, inside a bound cell's `code[data-mark]`, whose Range has client rects on more than one line. With one row shown at a time: 14 such runs across 10 constants (1b, 1c, 3a, 4b, 31a, 44a, 57c three times, 65a, 82a, 89a three times). With all 120 rows shown: 39. 1b is `0.379005`, in a column 97 px wide; the row's widths read 376, 332, 97 and 253 px.
- OBSERVED · cause, `scripts/render-site.mjs` line 845: `code{word-break:break-word}` lets a bound cell's minimum width collapse, so the table's automatic layout hands the width to the cell with the long comment.
- OBSERVED · candidate 1, tried in the browser only: `code[data-mark]{word-break:normal;overflow-wrap:normal}`. Mid-number breaks fall to 0 in both views, but the all-rows table grows from 1058 to 1740 px inside a 1060 px box, and 18 single rows also overflow it. Rejected: it trades a broken number for links pushed off-screen on the default view.
- OBSERVED · candidate 2, tried in the browser only: a 15rem minimum on bound cells plus a 13.5rem cap on the badges under the name. 1b's lower-bound column goes from 97 to 241 px and 1b stops breaking, with the table still 1058 px. All rows shown falls from 39 to 25. One row shown rises from 14 to 19, because width moved off other cells (short runs in 22b and 83a now break). At 17rem it is 27 and 26. At 1024 px the live page reads 94 and 33; 15rem reads 30 and 32; 17rem overflows the box on all 120 rows. So column minimums alone are not the fix.
- HYPOTHESIS · one run probably cannot fit at this width: 57c has a run of 75 characters, an estimated 600 px at 12.5px monospace with the cell's padding, and the two bound columns share about 565 px of the 1058 px table once the name and links columns take their 240 and 253 px. `A-101`'s "target 0" may not be reachable at this container width, so the count is reported with its list, never rounded to done. Not every long run is in this class: 1d's two 43-digit runs do not break on the live page with one row shown, and they do break under candidate 2.
- HYPOTHESIS · the desktop container (`.wrap{max-width:1100px}`) is the real limit, and giving the table more of a 1366 px screen helps more than dividing the same 1058 px differently. Not measured yet; it is the first thing P3 tests.
- MISSING · any reading of a real reader hitting this. The page has no analytics (`A-59`). The defect is observed on the page, and whether it cost anyone anything is unknown.

**Permission:** `A-101` is open, owned by this lane, not parked, and has no card. Changing our own index page is this lane's call. The outward gate (`AGENTS.md` § Hard invariants: one adversarial review on anything a stranger could read) applies, as a Codex review of the exact diff.

**Next action:** improve. First command:

```bash
node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
```

**Acceptance condition:** on the live index at 1366x900 with one row shown, 1b's lower bound `$0.379005$` is on one line by line-box measurement. Both counts are re-measured by the same definition and recorded on `A-101` beside today's 14 and 39, and each break that remains is listed with its length. The all-rows table stays inside its box at 1366 px, and a table that scrolls sideways at any desktop width where it does not today is a failure. The 390 px card layout shows no new sideways scroll. `render-site --selftest` asserts the new rule and is shown red with the rule removed. `page-check.yml` and `reverify.yml` are green on the push tip, and a Pages build row exists for it.

**Delivery and encounter checks:** delivery is the Pages builds API row for the push tip, then the same `playwright-cli` measurement on the live page at 1366, 1024 and 390 px, plus a screenshot of 1b. Encounter: nothing on the page can see a reader (`A-59`). The encounter is blind, not zero. `W-18` (the watch for the Search Console read), due 11-11, counts arrivals from Google and cannot see this.

**Recurred retro finding that bears on this:** the report-lint repair loop (11-08 retro, still on discipline). This report glosses each tracker id in parentheses with no comma, and every count names its command.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `index.html`, `continuity/items.json`.

**HYGIENE INPUTS** (copied from the kickoff's reads):

- (a) Due rows not bearing on the choice, 7 of 7 due: `A-2` (the drift-resolution log), `A-47` (the depth audit), `A-78` (the map of OpenAI's math release), `A-92` (results that rest on ETH), `A-94` (the close check wanting a tomorrow-named primer), `G-4` (the goal of an outside party acting unprompted), `W-17` (the dated newer-papers line). Three were read this morning through `check-due-gates-dispositioned.mjs --run`. `A-47` printed "106 row(s) audited — 64 sound, 1 defective, 28 unresolved, 13 unreachable". `A-94` printed "RESULT: FAIL — no cold-start primer for tomorrow (2026-11-10 MT)", exit 1, as the primer's banner expected, so it still has to be fixed for today's close to pass. `G-4` printed "parts reconcile: 37 + 0 + 0 = 37".
- (b) Owed child rows in the orchestrator's ledger: none, from the kickoff read over 805 rows.
- (c) State reads marked as crossed: none carries the word. Those printing a threshold clause: dated gates due today, 7 of 7 (listed in (a)). Board cards carrying David's word: 1, `9174731b`, not this lane's. Prior-day retro findings: 4 tagged, all 4 still on discipline. `missingLinkedCommits`: NOTHING SWEPT, 0 of 0. Key numbers: no list yet (`Test-Path docs/key-metrics.json` printed False). positive control: `Test-Path docs/daily-config.md` printed True from the same directory.
