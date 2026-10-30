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

Today we tell readers how recently we looked for newer papers. Each constant page can say that we searched for newer papers on that constant up to a stated date. The search itself is two weeks old, so we run it again first. The line goes live only after review and David's yes. We also fix a slow check that has been put off three times.

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
- Prior-day retro: 9 still-on-discipline findings and 1 carried (`W-16`, the watch on upstream issue 289, to 11-05). None bears on this choice. The one that recurs in shape is the 10-29 refusals: a sentence that pairs a check with "clean" gets refused by the verify-receipt gate. This packet names tools with their literal output instead.

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
