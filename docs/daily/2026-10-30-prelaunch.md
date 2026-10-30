---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: read
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-30
lifecycle_stage: launched
last_deploy: 908e1de698 (CI GREEN at the kickoff read; GitHub Pages lane, no Render service)
on_hold_items: 0
top_action_today: the evangelism pass (rotation due) — a dated "newer results checked through" line for readers, behind review and David's yes; plus A-84, the store refusal, built red first
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-30 (Friday, MT)

## BLUF

Every constant page now tells readers when we last searched for newer papers, and how narrow that search was. We ran the search again today (it found none), had the wording checked three times, and turned it on after David said yes. We also fixed a slow check that had been put off three times.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** the evangelism pass the rotation read calls due, carried by `A-86` (newer results the ledger checks itself) leg 2. That leg is the reader-facing "newer results checked through <date>" line. First a fresh constants-area watch, so the date it shows is current. Owed alongside it, as the primer's first action: `A-84` (the newer-results store refusal runs after the slow row build; move it ahead), built red first.

**The user problem, in the user's words:** "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (`docs/evangelism-bar.md`.) Our pages answer that for the upstream table: "Snapshot: this mirror last changed on 2026-10-28, which is not the last time it was checked." They do not answer it for the literature beyond the table. A reader cannot tell whether anyone has looked for a newer paper since the table was last edited. The store already records the date of that search (`ledger/newer-results.json` `"checkedThrough": "2026-10-16"`), and no page says so.

**Section 0.**
- Primer: `docs/cold-starts/2026-10-29.md` (no 10-30 file; the newest on or before today), read whole. Its banner names `A-84` as the first action, with no fourth re-date.
- Listener: 🟢 SSE alive (restart marker 2026-10-30T14:53:33Z, pid 36840; `hello` at 14:53:39Z and `replay-complete` below it). The loop is armed by `ScheduleWakeup` tool calls, and waker ranks 1-3 are running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 14:53:32Z).
- CI: GREEN at `908e1de6` for reverify.yml and page-check.yml (`check-ci-status.mjs --workflow <file>`, each "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending"). `git rev-parse HEAD origin/main` returned `908e1de6980dce934ba8ba7f71c7a39a995d6ecd` twice, and `git pull --ff-only` printed "Already up to date." No local full gate was run.
- Deploy drift: `check-deployed-sha-drift.mjs` "RESULT: PASS — 0 finding(s) across 37 service(s)", none of them this lane's. This is a GitHub Pages lane with no Render service, so the read sweeps nothing here. That is neither a stop nor a pass.
- Harness: running 2.1.314 · fleet UNIFORM (28 of 28 panes) · installed 2.1.314 (SAME).
- Recs yesterday: none (the 10-29 report's Recommendation section reads "None for David yet").
- Prior-day retro: 9 still-on-discipline findings and 1 carried, `W-16` (the watch on upstream issue 289) to 11-05. None bears on this choice. The one that recurs in shape is the 10-29 refusals: a sentence that pairs a check with "clean" gets refused by the verify-receipt gate. This packet names tools with their literal output instead.

**Evidence** (each read today, 2026-10-30 MT):
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "evangelism-pass DUE — P3 IS the pass (run /evangelism-pass); fleet cycle 40d since 2026-09-20 (lastRun 2026-09-20; cadence 7d)", exit 3. It disagrees with `docs/evangelism-bar.md`, which records a pass on 2026-10-04 (`A-70`). That is a finding about the rotation instrument: it does not see the 10-04 pass. The pass is still due either way, 26 days after 10-04 at a 7-day cadence.
- OBSERVED · `check-due-gates-dispositioned.mjs --snapshot` · "snapshot written — 1 gate(s) due on/before 2026-10-30": `A-84`, exit 2 (NOTHING-SWEPT), because its last read was killed at the 180000 ms cap on 2026-10-25.
- OBSERVED · `node scripts/report-rate.mjs` · "raw issues fetched: 37 … ours (CI bot + owner), excluded: 37 … OUTSIDE ARRIVALS: 0 … parts reconcile: 37 + 0 + 0 = 37." That 0 is the expected one at this traffic level, not a reading that nobody reads the pages.
- OBSERVED · `answered-cards.mjs --project bounds-ledger` · "NO waiting/answered/pending-verify cards".
- OBSERVED · Grep `ledger/newer-results.json` · line 3 `"checkedThrough": "2026-10-16"`, the only date field in the store.
- OBSERVED · the live index intro (`index.html` text) · "Snapshot: this mirror last changed on 2026-10-28, which is not the last time it was checked." Nothing on the page dates a search for newer papers.
- OBSERVED · `A-84` timing before the fix: one refusal case through `main()` (store file holding `null`, `CC_NEWER_RESULTS_STORE` hook), `render-constant-pages.mjs --check` under `Measure-Command`: "exit=1 seconds=17.4721448", stdout "RESULT: FAIL — render-constant-pages: the newer-results store is invalid, so nothing was composed or written: the store is not an object". The self-test spawns six such cases, so about 105 s of its time is refusals. That does not explain the row's "about 20 minutes", and it does not explain the 180 s cap kill either. The rest of the self-test's cost is unmeasured. P3 times the whole self-test before the fix, so the row records where the time actually goes rather than assuming it is the refusals.
- OBSERVED (prep, after the P1 post) · the whole self-test before the fix, `node scripts/newer-results.mjs --selftest` under `Measure-Command`: "exit=0 seconds=93.1899229", final line "RESULT: PASS — store rules, rendering and the bound-cell guard (exit 0)". So today it fits inside the 180 s cap that killed it on 10-25 and 10-26, and the row's "about 20 minutes" (10-17) does not reproduce. The fix still owes its acceptance condition, but the row's premise has changed. The refusal cases are a large share of 93 s, not a share of 20 minutes.
- MISSING · any real reader's word that the newer-paper date matters to them. There is no evidence ledger and no identified reader. The pick rests on the bar's own core problem and on judgment, as the 09-17 and 10-04 passes did.

**Permission:** `A-86`'s onTrigger allows the draft and requires "a cross-family claims pass, an adversarial review, and David's yes on a board card" before the line renders. So the line is built, reviewed and carded today, and it goes live only on his yes. `A-84`'s onTrigger allows the fix as written (red first, a skipped-refusal mutation goes red, Codex read-only review before push). Neither row is parked, waiting or frozen. No freeze covers the `c/` pages.

**Next action:** improve (a reader-facing line), preceded by the read it depends on. In P3, in this order:
1. `A-84` (one refusal case already timed above; the whole self-test is timed next, by its releaseTest). Move the newer-results and open-pull-requests store refusals ahead of `buildRows` in `scripts/render-constant-pages.mjs`. A mutation that skips the refusal must go red. Time the case after the fix, then a Codex read-only review before push.
2. The constants-area watch, from the mirror's `fetchedAt` date through today. Reading agents work to `docs/arxiv-watch-constants-reader-brief.md`, then `--check`. A candidate is verified by reading the paper and is never committed.
3. Draft the line, red-armed in the renderer self-test, from the store's `checkedThrough` field only. Then the cross-family claims pass and Codex adversarial review, then a board card for David with the exact text.

```
node C:/dev/skylark/bounds-ledger/scripts/arxiv-watch.mjs --area constants --fetch
```

**Acceptance condition:** (a) `A-84`: the refusal case's time before and after is recorded on the row, the skip-the-refusal mutation exits nonzero, and the whole newer-results self-test prints RESULT: PASS. (b) The watch: `--check` exits with every fetched paper carrying exactly one verdict, and `checkedThrough` moves to the window end only if that holds. (c) The line: it renders from the store field on a fixture and is absent when the field is absent (red-armed). A board card carries the exact text and the review record. The line reaches the `c/` pages only after David's yes; `npm run served` then reads the served bytes.

**Delivery and encounter checks:** delivery = `npm run served` after the push that carries the line (SERVED for every changed page). Encounter = blind. The pages carry no analytics, and the only countable event is a report filed through a page's own link, counted by `npm run reports` and readable at N = 1 (0 outside arrivals of 37 raw today). If David has not answered by the close, the receipt is `USER-VISIBLE: none`, naming the card.

**USER-FACING:** yes · `scripts/render-constant-pages.mjs` (A-84, and the line), `scripts/newer-results.mjs` (self-test), `ledger/newer-results.json` (`checkedThrough`), `c/*.html` (only after David's yes), `continuity/items.json`, `docs/daily/2026-10-30-prelaunch.md`.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice: none. The one due row, `A-84`, is executed today as the primer's first action. Read: `dated gates due today` (1 of 1).
- (b) owed child rows: none. Read: "Rows owed to you in skylark-site's ledger: NONE".
- (c) CROSSED state reads: none. Read: dated gates 1 of 1 listed, HEAD CI GREEN, queued rows 0, stale-actionable 0 of 25, missingLinkedCommits nothing swept. Also from the 10-29 close: `npm run close:primer` still expects a tomorrow-named primer, a small lane fix that does not displace either item.

## What changed

<!-- findings:begin -->
- **The packet's premise about the watch window was wrong.** The packet said a fresh watch would make the date current. `node scripts/arxiv-watch.mjs --fetch --area constants` printed "window: submitted 2026-10-28 to 2026-10-30, UTC dates (from the mirror's fetch date in ledger/teorth-optimizationproblems/manifest.json)". The window opens at the mirror's fetch date, which the 10-28 resnap moved, and the script takes no start-date override. The 10-16 run covered 2026-09-26 to 2026-10-16, so 2026-10-17 to 2026-10-27 has never been searched by any run. That is the design the script documents ("papers submitted before the mirror's fetch date that upstream has not credited yet" is in its blindTo), not a defect of today's run. It does change the line: the line must state the window it searched, from and through, rather than a bare "checked through". And it must not say "since this table was copied", because a later resnap would make that false while the store kept the old window.
- **`A-84`'s premise was also stale, and the manager's hypothesis was wrong.** The whole self-test took 93.2 s before the fix, not about 20 minutes. One refusal case went from 17.47 s to 4.52 s once the refusal moved ahead of `buildRows`, so about 13 s of the 17.5 s was `buildRows` and not node startup.
<!-- findings:end -->

- `89adfe9`, `60b7d9d`, `0f07d47` — `A-84` (the newer-results store refusal) is CLOSED. The newer-results and open-pull-requests store refusals now run before `buildRows` in `scripts/render-constant-pages.mjs`. One refusal case went from 17.47 s to 4.52 s, and the whole self-test from 93.19 s to 10.42 s, RESULT: PASS. Two self-test cases run `main()` in process and check that it refuses before calling its row builder. Codex round 1 refuted my first version, a source-order check, and round 2 found the injected-builder limit. That was the second finding on one guard, so the tests now claim only what they prove, and a comment names the limit. CI reverify.yml green on `0f07d474`. Evidence is on the row's `evidence2026_10_30` field.
- `6600c0a`, `3ef254b`, `fc1f071`, `a48d693` — `A-86` (newer results the ledger checks itself): the reader-facing newer-papers line, built dark. It renders on every constant page only when `ledger/newer-results.json` carries `windowFrom`, `tools` and `papersFound`. The committed store carries none, so no page changed ("120 constant page(s) match committed state"). Codex cross-family claims pass and adversarial review: round 1 had 7 findings, round 2 had 4, and round 3 returned "SEND-READY". The manager's scope point is in: the tools render from the store, bound to the watcher's own query, and a red-arm fails when they are missing or differ. Card `903a38ba` puts the exact text to David (needs-decision msg `0289b903`). CI reverify.yml green on `a48d6936`.
- `92bcf34` — **the newer-papers line is live on all 120 constant pages.** David answered card `903a38ba` at 17:16Z (paraphrased: yes, turn it on as written). The store gained `windowFrom` 2026-10-28, the four query terms and `papersFound` 0, and `checkedThrough` moved to 2026-10-30. GitHub Actions held the Pages build in its queue for about 14 minutes; it finished at 17:55:27Z. `npm run served` then read "120 checked — 120 served, 0 in flight, 0 stale, 0 unreachable" (exit 0). Before the build, the same read printed 120 stale, so this pass comes from a check that can fail. `A-86` is closed, and `W-17` (the standing watch on the newer-papers line and its store) is minted.
- Constants watch, 2026-10-30: "papers fetched: 0 · verdicts: 0 · every fetched id has exactly one verdict … parts reconcile: 0 + 0 + 0 = 0 … RESULT: COMPLETE — no candidate (exit 0)", over the window 2026-10-28 to 2026-10-30. Positive control: the same query's 2026-10-16 run returned papers, including the three 1b candidates recorded on `A-82`. Output stays in `tmp/` and is not committed.

## Inputs (controllable)

- None yet.

## Outputs (lagging)

- `npm run reports`: 0 outside arrivals of 37 raw issues (read 2026-10-30).

## Recommendation

- None for David yet. The line's card will carry its own.

## On hold pending data

- None.

## State Appendix

Written at the close from live commands.

- CI on `92bcf345` (the switch-on): reverify, page-check and pages-build-deployment are each "completed success" (`gh run list --commit 92bcf345c34f1918708699ebbad1f9ecccd0f7c0`). The P3 post at 18:01Z called reverify pending, and that run has since finished green.
- `npm run served` at `92bcf34`: "120 checked — 120 served, 0 in flight, 0 stale, 0 unreachable" (exit 0). A live fetch of `c/87a.html` returned HTTP 200, Last-Modified 17:55:26 GMT, with the "Newer papers" line once.
- Due today: `check-due-gates-dispositioned.mjs` printed "snapshot … CURRENT (taken 2026-10-30)" and "verdict: CLEAR — every gate due at Phase 0 was dispositioned", RESULT: PASS (exit 0).

### Close

`ACTION: COMPLETED · item A-86 · P3 8276804f`. The acceptance in force was the P1 manager review's APPROVE, which asked for the search scope in the line and not only a date. It was met. The line on all 120 constant pages gives the window, the four tool names, the count and the exclusion. It renders from the store's fields, and Pages serves it, per the two reads above. The manager review found no defects.

Ledger delta (all through `continuity-edit.mjs`):
- `A-84` closed, with the closeWhen outputs on `evidence2026_10_30` (`a6f8075`).
- `A-86` closed. The line went live on David's yes (card `903a38ba`), and the store's ownership moved to `W-17` (the newer-papers watch) in `d7bd11d`.
- `W-17` minted: the standing watch on the newer-papers line and its store (re-run weekly and after any resnap; nextCheckDate 2026-11-06).
- `W-17.gapScopeLimit2026_10_30`: the unsearched window, 2026-10-17 to 2026-10-27, is recorded as a DELIBERATE scope limit, as the manager review asked. A backfill needs a start-date flag on the reviewed watcher, which is an instrument change with its own review. The line states its exact window and never claims the gap. Revisit by 2026-11-06: build the backfill through review, or keep the limit and say why.

hygiene draft: 0 lines — 0 accepted · 0 amended · 0 rejected. READ-MUTATED: none (0 reads guarded). The draft's two checks: `check-wait-justification` "RESULT: PASS — 1 of 110 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)" and `check-engineering-zero --project bounds-ledger` "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable" (exit 0). Positive control: the same engineering-zero run reported 8 findings across other lanes, so its 0 for this lane comes from a read that can return nonzero.

Receipt: unchanged from P3 `8276804f`, which stays true. Exposure is blind, and the outcome is open.

Pending reads:
- `A-47` (the depth audit) 2026-10-31.
- `A-2` (the drift-resolution log), `A-77` (the filed-report check), `A-78` (the OpenAI math release map), `A-81` (the Ramsey newer-result watcher) and `G-4` (an outside party acting on a record) 2026-11-02.
- `W-16` (the watch on upstream issue 289) at each close and by 2026-11-05.
- `W-17` (the newer-papers watch) 2026-11-06.

Classification: today's findings were instrument-facing only. Both are about our own machinery: the watch window opening at the mirror's fetch date, and `A-84`'s stale timing premise. There was no drift and no record-facing catch. The standing prediction is unchanged.

### Cycle 2 close (15:56 MT)

A second cycle, started by David directly. In chat at about 13:40 MT he said yes (paraphrased) to three jobs: check OpenAI's reported Kakeya result against 3b, 3c and 46a; if it bears on one, build a hidden note for his yes; and adopt and pilot a new area, results that rest on the exponential time hypothesis (ETH). Adopting an area is his call alone, and this is that call. The trigger was a news article he pasted. It stays local and is quoted nowhere; every statement below rests on the primary sources.

- `8aa6e25` (pushed; CI reverify, page-check and pages-build-deployment each "completed success"; `npm run served` "9 checked — 9 served, 0 in flight, 0 stale, 0 unreachable", exit 0):
  - **`A-78` (the OpenAI math release map): pin moved** from `1581d4c` to `4eaee87` (upstream shas of openai/math; neither exists in this repo). The family count went from 372 to 373. The family-heading rule reproduces 372 at the old pin, and the release README states 721 manuscripts in 373 families. New family 378 (ETH) bears on no watched constant. Family 079 was revised to every dimension. The 12 statement files the map named before the move are blob-identical at both shas, so the 10 live notes changed only in their release link and read date.
  - **Job 1, family 079 against the definitions.** I read `LocalSmoothing.lean`; I did not compile the proof or read the paper. 46a: implies C₄₆ ≤ 3, equal to its listed lower bound. 77a, not named by David and covered by the same family: implies C₇₇ ≤ 3, also equal to its lower bound. 3b and 3c: no bearing. Both bearing pairs are recorded `read-no-note`, hidden.
  - **A render-guard gap, older than today, closed.** The renderers never called the map's validation, so a held pair with one field flipped would have published. A note now renders only if its record passes `validateRecord`, its composed family, title and source fields have the required shapes, and its emitted block passes the word ban. The failure mode is a missing note, never a published one. I red-armed it four ways: under each mutation the selftest failed on its named assertion, and after each restore it passed.
  - **`A-92` minted, job 3: results that rest on ETH.** The design is `docs/decisions/2026-10-30-A92-eth-dependence-area-design.md`. Anthropic's paper counts "more than 800" ETH-dependent papers (a quote of the paper, not David's words), but it publishes no list or method, and the named searches found none. Our frame is 638 arXiv abstracts carrying the exact phrase, reconciled against the API's own total. Pilot: 8 drawn by a rule written before the fetch, all 8 read; 3 at statement depth, 5 at abstract only. Two cases the starting rule could not label were added to the verdict set. No row is published and nothing is sent. Per-paper verdicts stay in the ignored `tmp/`.
- **Job 2: the two notes are on David's board.** Needs-decision `8b0f42a5` filed board card `d780e2ec` with the exact text of both notes. They render only on his yes.
- **Codex cross-family review, four rounds.** Round 1: 6 findings, including 77a's L^∞ endpoint, the direction of #ETH (ETH implies #ETH, not the reverse) and the render gap. Round 2: 5. Round 3: 2. Round 4 was a cold round on the one render invariant, run because the guard had drawn findings three rounds running; its two findings were over-claims in my statement of the invariant, and I narrowed the statement rather than add code. Every finding was confirmed, then fixed or narrowed. Process lapse: I minted `A-92` while round 1 was reading the tree. I disclosed that to round 2 and put the row in its scope.
- `/deep-research` prompt for job 3 handed to David (local: `tmp/deep-research-A92-eth-dependence-prompt.md`). It cites the two papers, never the article.

Classification, cycle 2: one record-adjacent read and one instrument-facing finding. The read: a preprint claim bears on 46a and 77a. That is a claim from outside the curated table, not a defect in any mirrored row, so it is not a record-facing catch. The finding: the renderer validation gap. The standing prediction (the next record-facing catch is a citation-quality defect found by a human reading a cited source) is neither met nor falsified.
