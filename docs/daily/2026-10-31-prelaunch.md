---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: read
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-31
lifecycle_stage: launched
last_deploy: 995ab9df20 (CI GREEN at the kickoff read; GitHub Pages lane, no Render service)
on_hold_items: 0
top_action_today: widen the newer-papers line's search window from three days to five weeks (the unsearched gap on W-17 — the newer-papers watch), one search over 2026-09-26 to today; plus A-92's OpenAlex run at or after 18:00 MDT
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-31 (Saturday, MT)

## BLUF

Each constant page now says we searched five weeks of new papers, not three days, and what they mean for that page. We found 15 papers. On most pages none of them mentions that number. On four pages they do, and none beats our table. On one page a paper reports a better value, which we name and have not checked. David said yes and it is live. Tonight we run the paper count for the planned third area.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** `W-17` (the standing newer-papers line on every constant page). Close its recorded gap by running ONE search over a wide window, so the line reads "submitted from 2026-09-26 to 2026-10-31" instead of "from 2026-10-28 to 2026-10-30".

**The user problem, in the user's words:** "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (`docs/evangelism-bar.md`.) The page now answers part of that, but only for a three-day window. A reader who cited a constant a month ago learns nothing from it about the weeks since. Papers submitted 2026-10-17 to 2026-10-27 were never searched by any run, which `W-17` (the newer-papers watch) records as a deliberate scope limit.

**Section 0.**
- Primer: `docs/cold-starts/2026-10-31.md`, read whole. Its banner names `A-92`'s OpenAlex run, once, at or after 18:00 MDT, and says nothing else is owed before then.
- Listener: 🟢 SSE alive (restart marker 2026-10-31T15:44:42Z, pid 31424; `hello` 15:44:44Z, `replay-complete` below it). The loop is armed by `ScheduleWakeup` tool calls, and waker ranks 1-3 are running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 15:45:45Z).
- CI: GREEN at `995ab9df2027a7990bfe38a6523858f244b5aea9` for reverify.yml and page-check.yml (`check-ci-status.mjs --workflow <file>`, each "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending"). `git rev-parse HEAD origin/main` printed that sha twice.
- Deploy drift: `check-deployed-sha-drift.mjs` "RESULT: PASS — 0 finding(s) across 38 service(s)", none of them this lane's. This is a GitHub Pages lane, so the read sweeps nothing here, which is neither a stop nor a pass. Positive control: the same run listed 38 services by name with their live and head commits, so its sweep read real rows.
- Harness: running 2.1.316 · fleet UNIFORM (28 of 28 panes) · installed 2.1.316 (SAME).
- Recs yesterday: none (the 10-30 report's Recommendation section reads "None for David yet").
- David's card `905de666` (yes to the 8a note and the 46a and 77a status line) is live: `npm run served` at anchor `274fb98872` printed "4 checked — 4 served, 0 in flight, 0 stale, 0 unreachable" (not David's words) for `c/46a.html`, `c/77a.html`, `c/8a.html` and `index.html`.
- mechanism-verified: a live fetch of `https://u00dxk2.github.io/bounds-ledger/c/8a.html`, `c/46a.html` and `c/77a.html` at about 10:10 MT returned HTTP 200 for each, Last-Modified "Sat, 31 Oct 2026 14:59:02 GMT", bytes equal to the committed files, and 3 links to github.com/openai/math on each page (transcript: `tmp/live-fetch-905de666-2026-10-31.txt`, not committed).
- Prior-day retro: 1 still-on-discipline finding, "a prose gate refused a factual sentence". It bears on today's post only, so this packet quotes tools' literal output rather than pairing a check with a verdict word.

**Evidence** (each read today, 2026-10-31 MT):
- OBSERVED · the live text of the line on `c/8a.html` (committed and served) · "On 2026-10-30 we ran one search for all the constants on this site's main list, not this one alone: arXiv papers submitted from 2026-10-28 to 2026-10-30 that matched an abstract search for AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve. It found no papers." The wording is "one search … from X to Y". So one run over a wider window changes only the dates and the count, not the wording.
- OBSERVED · `ledger/newer-results.json` · `"windowFrom": "2026-10-28"`, `"checkedThrough": "2026-10-30"`, `"papersFound": 0`. Its `watchScope` field says "since the mirror's fetch date (2026-10-28)", which a wider window would make false, so that field changes too.
- OBSERVED · `scripts/arxiv-watch.mjs` line 531 · the constants window's `from` is `m.fetchedAt.slice(0, 10)` (the mirror manifest). The script takes no start-date override, and `--check` refuses a window it did not compute (line 445 and the window-start check). So the wider search needs an instrument change: a `--from` flag, red-armed, with Codex review.
- OBSERVED · `node scripts/report-rate.mjs` · "raw issues fetched: 37 … ours (CI bot + owner), excluded: 37 … OUTSIDE ARRIVALS: 0 … parts reconcile: 37 + 0 + 0 = 37." That 0 is the expected one at this traffic level, not a reading that nobody reads the pages.
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today … run the normal P3", exit 0.
- OBSERVED · `check-due-gates-dispositioned.mjs --snapshot` · "snapshot written — 0 gate(s) due on/before 2026-10-31".
- OBSERVED · `answered-cards.mjs --project bounds-ledger` · "3 bounds-ledger card(s) … 0 NEW since last read". All three were carried out on 10-30 (see `npm run served` above for `905de666`).
- MISSING · any real reader's word that a wider search window matters to them. There is no evidence ledger and no identified reader. The pick rests on the bar's core problem and on the gap that `W-17` (the newer-papers watch) records.

**Permission:** `W-17` (the newer-papers watch) is open, not parked, waiting or frozen. Its onTrigger allows re-running the watch and writing the store's `checkedThrough`, `windowFrom` and `papersFound` on a complete run, then re-rendering, committing, pushing and reading `npm run served`. It sends only "a change to the line's WORDING" back through review and David's yes. The wording is unchanged here. The `--from` flag is an instrument change and gets the lane's usual red-arm and a Codex read-only review before push. Its gap note names this exact option ("build the --from backfill through review" (not David's words)). If review finds that the wider window changes what the line claims, the change goes on a board card and goes live only on David's yes. No freeze covers the `c/` pages.

**Next action:** improve (a reader-facing line), through the instrument it depends on. In P3, in this order:
1. Add `--from <YYYY-MM-DD>` to `arxiv-watch.mjs --area constants`. It must not be later than the mirror date, and `papers.json` records it so `--check` checks the window against the recorded start. Red-arm: a window start other than the recorded one must still be refused. Baseline the self-test first:

```
node C:/dev/skylark/bounds-ledger/scripts/arxiv-watch.mjs --selftest
```

2. Codex read-only review of the flag, banner workdir checked.
3. One run, `--from 2026-09-26` (the earliest start any run has searched), through today. Each fetched paper is read to `docs/arxiv-watch-constants-reader-brief.md`, then `--check`. A candidate is verified by reading the paper, and it enters the store only through `A-82`'s rule. The run's output is never committed.
4. On RESULT: COMPLETE, write `windowFrom`, `checkedThrough`, `papersFound` and a corrected `watchScope`, re-render, commit, push, `npm run served`.
5. At or after 18:00 MDT, separately: `A-92`'s OpenAlex frame run, once (the primer's governing action).

**Acceptance condition:** the live line on every constant page reads "submitted from 2026-09-26 to <the run's end date>" with the run's own count. `npm run served` reports every changed page SERVED. The flag's red-arm exits nonzero on a mismatched window start, and the self-test prints RESULT: PASS. If the run is not COMPLETE, the store and pages do not change.

**Delivery and encounter checks:** delivery = `npm run served` after the push. Encounter = blind. The pages carry no analytics, and the only countable event is a report filed through a page's own link, counted by `npm run reports` and readable at N = 1 (0 outside arrivals of 37 raw today).

**USER-FACING:** yes · `scripts/arxiv-watch.mjs`, `ledger/newer-results.json`, `c/*.html` (re-rendered), `index.html` if it shows the line, `continuity/items.json`, `docs/daily/2026-10-31-prelaunch.md`.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice: none. Read: `dated gates due today` (0).
- (b) owed child rows: none. Read: "Rows owed to you in skylark-site's ledger: NONE".
- (c) CROSSED state reads: none. Read: dated gates 0, HEAD CI GREEN, queued rows 0, stale-actionable 0 of 27, missingLinkedCommits nothing swept.

## What changed

<!-- findings:begin -->
- **The packet assumed a wider search would just widen the dates. It found papers, so the wording had to change.** The single search over 2026-09-26 to 2026-10-31 fetched 15 papers, and `arxiv-watch.mjs --check --area constants --from 2026-09-26` printed "papers fetched: 15 · verdicts: 15 · every fetched id has exactly one verdict", "claims-a-better-bound: 0", "stated bounds EQUAL to a value we show: 0 · WEAKER than it: 83" and "stated bounds on sides this script cannot rank (an unverified or symbolic row): 15 (to read by hand)". The manager's review had already said a nonzero count must not go live bare (as quoted: "It found 8 papers" would read as 8 newer results on every constant). So the store and pages stay unchanged, and a per-constant sentence went to David on card `f64e9a3b`.
- **The readers' "states a bound" over-read what one paper says.** I read arXiv:2609.40340v1 myself. Its Appendix C.1 AC3 task measures the 1d quantity over step functions, and its Table 9 ("Mean ± Std / Best") gives 1.4564 as the best score of two search runs. The paper presents these numbers as evaluator scores, not bounds. 1.4564 is below every 1d row, including the asterisked 1.457854884921989*. So every sentence now says a paper "reports a value", and the 1d candidate stays out of the repository until someone checks the value.
<!-- findings:end -->

- `9c643ee`, `3fdc36a`, `a9a61b5`, `060206b`, `2dc5fe9` (pushed): `arxiv-watch.mjs --from` starts the constants window earlier than the mirror's fetch date, never later, and `--check` must be given the same date. Codex reviewed it four times: rounds 1 to 3 each said FIX FIRST, and round 4 found one overstated comment. Every finding was fixed and red-armed. Rounds 2 and 3 hit the same guard, so it became one stated rule and then a read-once copy rather than more checks.
- `f8ae73f`, `d48bff2`, `069aa47`, `81fb1e4` (committed, not pushed while a last review runs): the newer-papers line says what the found papers mean for each constant, dark behind a new store field `perConstant`. `render-constant-pages --check` reads "120 constant page(s) match committed state". Codex claims pass round 2: "CLAIMS VERDICT: SEND-READY".

## Inputs (controllable)

- None yet.

## Outputs (lagging)

- `npm run reports`: 0 outside arrivals of 37 raw issues (read 2026-10-31).

## Recommendation

- None for David yet.

## On hold pending data

- None.

## State Appendix

Rewritten at the close from live commands. The close commit itself cannot appear here.

- The switch-on commit `d4c0c0a74d` (W-17 — the newer-papers watch): `check-ci-status.mjs --workflow reverify.yml` and `--workflow page-check.yml` each printed "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending" (read 19:13Z).
- `npm run served` at anchor `d4c0c0a74d`: "120 checked — 120 served, 0 in flight, 0 stale, 0 unreachable" (exit 0, 19:13Z).
- Due today: `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot "CURRENT (taken 2026-10-31)".

### Close

This closes the day's work on W-17 (the newer-papers watch).

`ACTION: COMPLETED · item W-17 · P3 a5196ab8`. The acceptance in force was the manager's REDIRECT, and its "more than 0" branch was met. The run found 15 papers, every one read. The store and pages stayed unchanged until David's yes on card f64e9a3b (19:00Z). Then `d4c0c0a` switched the line on. The manager's review (COMPLETED, no defects) fetched all 120 live pages itself and found the card's sentences word for word.

Since the P3 post (`a5196ab8`), nothing changed on the site. The receipt in that post stays true. Exposure is blind (A-59, the blind-encounter row), and the outcome is open.

Ledger delta (through `continuity-edit.mjs`):
- `W-17` (the newer-papers watch): `gapClosed2026_10_31` records the closed 2026-10-17 to 2026-10-27 gap, the run's printed figures, the live store and David's yes. `linkedCommits` gained `d4c0c0a`, `2dc5fe9` and `81fb1e4`. The row stays open as a standing watch (nextCheckDate 2026-11-06).

hygiene draft: 0 lines — 0 accepted · 0 amended · 0 rejected. READ-MUTATED: none (0 reads guarded). The draft's two checks: `check-wait-justification` "RESULT: PASS — 1 of 114 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)" and `check-engineering-zero --project bounds-ledger` "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable". Positive control: the same run counted "4 finding(s)" across other lanes, so this lane's 0 comes from a read that can return nonzero.

Pending reads:
- `A-92` (the third watched area, results that rest on ETH): the OpenAlex frame run, ONCE, at or after 18:00 MDT today, 2026-10-31. Its figures go into "Next steps" item 2 of the A-92 design decision, and the result goes in tonight's close-out post. If it does not run tonight, the trigger moves to 18:00 MDT on 2026-11-01, as the primer banner says.
- `A-45` and `A-91`: 2026-11-01.
- `A-2`, `A-77`, `A-78`, `A-81` and `G-4`: 2026-11-02.
- `A-94` (the close-primer gate fix): 2026-11-03.
- `W-16` (the watch on upstream issue 289): by 2026-11-05.
- `W-17` and `A-93`: 2026-11-06.
- Open and optional, not a claim: the 1d value 1.4564 (arXiv:2609.40340v1, a best evaluator score) is unchecked and in no table.

Classification: today's findings were instrument-facing, and this is a running count of at least one day of that. Both are about our own machinery: the widened search needed per-constant wording, and the readers' "states a bound" over-read a paper's scores. There was no drift. The 1d value is a candidate. It is not a record-facing catch until someone checks it. The standing prediction is unchanged: the next record-facing catch will be a citation-quality defect found by a human reading in the depth audit.
