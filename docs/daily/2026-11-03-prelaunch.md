---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: not-read-today
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-03
lifecycle_stage: launched
last_deploy: f7a2fe6027 (CI GREEN at the kickoff read; GitHub Pages lane, no Render service)
on_hold_items: 0
top_action_today: the public 87a row names our newer, still-open report (issue 289) beside the closed one (issue 150), instead of only the closed one
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-03 (Tuesday, MT)

## BLUF

The public page's row for constant 87a says we reported it and that the report is closed. A newer report of ours on the same row, filed on 29 October, is still open, and the page does not mention it. Today's change makes the row show both reports, each with its own state. It goes live only on David's yes.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** `A-95` (the 87a row discloses our closed issue 150 and not our open issue 289), on `index.html` and `c/87a.html`. A reader of the 87a row is told "we reported this row · closed 2026-08-23" and nothing else, so the row reads as settled while our own open question about its printed value (issue 289: "the [Mar1978] row prints 1058.565, slightly below the bound Martinet proves", not David's words) goes unmentioned.

**The user problem, in the user's words:** "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (`docs/evangelism-bar.md`.) For 87a our page currently answers "someone looked, and it is closed", which is half true. A reader about to cite 1058.565 is owed the open half: there is a live question about that very value.

**Section 0.**
- Primer: `docs/cold-starts/2026-11-02.md`, read whole (no 2026-11-03 primer; primers are named for the day they are written). Its banner names the five gates due today and `A-92`'s OpenAlex run, once, today.
- Listener: 🟢 SSE alive (restart marker 2026-11-03T14:40:18Z, pid 36136, with `hello` and `replay-complete` below it). The loop is armed by a `ScheduleWakeup` tool call, and waker ranks 1 to 3 are running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, machine-level exec at 14:27:52Z).
- CI: GREEN at `f7a2fe6027` for reverify.yml and page-check.yml (`check-ci-status.mjs --workflow <file>`, each "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending"). The overnight scheduled drift run, 41610165711 at 09:20Z on `f7a2fe6027`, concluded success. `npm run verify` receipt: exitCode 0 at `f7a2fe6027` (14:45:49Z), with `copying.html` dirty in the working tree by line endings only (`git diff --stat` empty).
- Deploy drift: `check-deployed-sha-drift.mjs` exit 0, "0 finding(s) across 38 service(s)". This is a GitHub Pages lane with no Render service, so the read sweeps nothing of ours: neither a stop nor a pass.
- Harness: running 2.1.317 · fleet UNIFORM (16 of 16 panes) · installed 2.1.317 (SAME).
- Recs yesterday: none (the 11-02 report's Recommendation section reads "None for David yet").
- Prior-day retro: 4 still-on-discipline findings. The one that bears on today: Q0's "run one fresh claims pre-pass by a fresh helper over the first wording before Codex r1" (not David's words). It applies to the new row wording and is planned in below.
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` exit 2, "UNDETERMINED — journey-walk: no journey-walk artifact on record for bounds-ledger; the registry does not declare which lanes owe one" (not David's words). That is not "nothing due"; it is a registry gap the rotation cannot judge, so no pass is run on it today.

**Evidence** (each read today, 2026-11-03 MT):
- OBSERVED · `node scripts/check-upstream-reports.mjs` (`A-95`'s and `A-77`'s read) · "2 recorded report(s) in teorth/optimizationproblems; 3 live row(s) read. UNRECORDED — issue 289 is ours and has no baseline row." exit 1. So the record of our own reports is incomplete, and the page renders from that record.
- OBSERVED · `W-8`'s read, `gh search issues --repo teorth/optimizationproblems --author u00dxk2 --include-prs --limit 5` · issue 289 open (filed 2026-10-29), issue 150 closed (2026-08-23), both on 87a. No new send since the last read.
- OBSERVED · code · `reportFor()` in `scripts/render-site.mjs:156` returns `reports.find(...)`, the FIRST report for a path; `render-constant-pages.mjs:973` renders that one link. `filedReports()` in `scripts/reverify.mjs:186` builds a `Map` keyed by path, which keeps the LAST. Adding the 289 row alone would therefore change nothing on the page and would swap which issue the drift report names.
- OBSERVED · `A-95`'s row note · adding the 289 row on 2026-11-02 made `reverify.test.mjs:259` fail, so it was taken back out the same hour.
- MISSING · any real reader's word on the 87a row. The pick rests on the bar's promise ("check us in one hop") and on our own record contradicting our own page.

**Permission:** `A-95` is open, not parked, waiting or frozen; no card is open on it. Its note says "A public-page wording change: adversarial review and David's yes before it goes live" (not David's words). So the code and test change is built and committed, the regenerated pages are NOT pushed live, a fresh claims pre-pass and Codex rounds review it, and a card goes to David. On his yes, re-render and push.

**Next action:** improve (the row's disclosure). Prep, now: write the failing test (two reports for one path → both disclosed, each with its own state; the drift report names both). In P3: `reportsFor()` returns every matching report in filing order and the row renders one link per report; `filedReports()` maps a path to a list; add the 289 row copied field by field from `gh issue view 289`; update `reverify.test.mjs` to assert both issues. Red-arm: drop the second report → one link; restore → two. First command, the read the acceptance rests on:

```
node C:/dev/skylark/bounds-ledger/scripts/check-upstream-reports.mjs
```

**Acceptance condition:** on David's yes, the live `index.html` 87a row and `c/87a.html` each carry two disclosure links, issue 150 marked closed 2026-08-23 and issue 289 marked open, with no causal wording; `check-upstream-reports.mjs` exits 0 with 3 recorded reports; `npm test` passes; `render-site --check` and `render-constant-pages --check` pass at the commit; `npm run served` reports both files SERVED.

**Delivery and encounter checks:** delivery = `npm run served` plus a live fetch of both pages after the push. Encounter = blind (`A-59`): the pages carry no analytics. The only countable event is a report filed through a row's own link, counted by `npm run reports`, readable at N = 1.

**USER-FACING:** yes · `scripts/render-site.mjs`, `scripts/render-constant-pages.mjs`, `scripts/reverify.mjs`, `scripts/reverify.test.mjs`, `ledger/upstream-reports.json`, `index.html` and `c/87a.html` (re-rendered), `continuity/items.json`, `docs/daily/2026-11-03-prelaunch.md`.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice, 5, each run through `--run <ID>` this morning:
  - `A-47` (the depth audit): "RESULT: PASS — 106 audited, 64 sound, 1 defective, 28 unresolved, 13 unreachable (exit 0)". No slice was read since 2026-10-30.
  - `A-94` (close:primer wants a tomorrow-named primer): exit 1, "RESULT: FAIL — no cold-start primer for tomorrow (2026-11-04 MT)." Expected mid-day; the row's question is whether the gate still matches the fleet's written-date naming.
  - `W-4` (KP-78 on every new detector): `node scripts/reverify.test.mjs` through `--run W-4` after verify, exit 0, last line "reverify.test: PASS (synthetic drift in 10a.md detected; pristine copy clean; …" (not David's words).
  - `W-8` (an amended outward artifact goes back to David): read quoted in the evidence above; no new send.
  - `W-13` (someone calls the served-bytes check): "1 checked — 1 served, 0 in flight, 0 stale, 0 unreachable", exit 0.
- (b) owed child rows: none. Read: "Rows owed to you in skylark-site's ledger: NONE".
- (c) CROSSED state reads: none. Read: dated gates 5 (owed, listed in (a)), HEAD CI GREEN, queued rows 0, stale-actionable 1 of 28 (threshold not crossed), missingLinkedCommits nothing swept.
- Also, not a gate: `A-92`'s OpenAlex frame run, once today per the primer banner, started at P1; its figures go into "Next steps" item 2 of `docs/decisions/2026-10-30-A92-eth-dependence-area-design.md`.

## What changed

- P1 read the five due gates and selected `A-95`. The manager approved it (msg `8071e964`), asking for a branch, a card naming the branch, and labels that name each issue and what it asked.
- P3 built `A-95` on branch `a95-87a-both-reports` in its own worktree: `0b8c0c6` (both consumers list every report; issue 289's row copied from `gh issue view 289`; a topic on each report; the 87a row and page show two links, 46a's one link gains its number and topic), then `fce4ba7` (Codex r1 fixes). Not on main, so nothing is live.
- Fresh claims pre-pass by a helper over the three topics, reading each issue with `gh issue view`: #150, #218, #289 each HOLDS. It noted that "we reported this row" beside "closed" invites a causal reading; the pairing is unchanged from the live page and the intro paragraph says in words that it is not a claim of cause, so it goes to David on the card rather than being changed here.
- Codex r1 (read-only, banner `workdir: C:\dev\skylark\bounds-ledger-a95`, on `0b8c0c6`): SHIP WITH FIXES, two MAJOR, both CONFIRMED and fixed in `fce4ba7`: the aria-label dropped each report's topic and state (screen readers heard neither), and topic validation failed open (missing topic accepted; "prompted by our report" passed the word list). The second was fixed by a shape rule (a topic may not contain a first-person word), not a longer list. Claims: all three topics HOLD.
- Red-arms, each restored from a hashed backup: first-only `reportsFor` → selftest exit 1 "must disclose BOTH"; keep-last `filedReports` → reverify.test exit 1; aria-label without the label → exit 1; first-person rule removed → exit 1; missing topic allowed → exit 1.
- Codex r2 (banner `workdir: C:\dev\skylark\bounds-ledger-a95`, on `fce4ba7`): SHIP WITH FIXES, 1 MAJOR and 3 MINOR, all CONFIRMED, fixed in `66ff14d`. The MAJOR was a causal topic ("the update prompted by this report", not David's words) passing the first-person rule: the second appearance of that class, so the topic check became an exact-membership allowlist of three phrases instead of a third matcher. MINORs: a mathematical "i" falsely refused (gone with the rule), a report with no filing time sorted first (now refused by both consumers), and the intro paragraph's singular "a link" (now "one or more").
- Codex r3 (same banner, on `66ff14d`): SHIP WITH FIXES, 1 Medium and 3 Low, all CONFIRMED, fixed in `7f8a0c1`: the allowlist took an override and was mutable (now a frozen array, no override, string-only); a non-integer issue rendered without its number (refused); an impossible filing time passed the shape check (now round-trips through Date); a validation refusal printed as "could not be read" (reworded; internal only, leg 2 never runs under CI). No fourth round: r3's fixes tighten refusal paths and change no rendered text, each was red-armed, and the merge waits on David's card regardless.
- Branch pushed (`git push -u origin a95-87a-both-reports`; a branch push publishes nothing). One CI run dispatched on it: reverify.yml run 41676059688.
- David's card `87acfd78` (needs-decision msg `38cdfed2`) names the branch and asks one question: merge it as written. It flags the "closed" wording (not David's words) beside our own "we reported this row" label (not David's words) as worth his eye, recommending no change.
- `render-constant-pages --check` at `0b8c0c6`: "RESULT: PASS — 120 constant page(s) match committed state (@ 87b4ebb)". `check-upstream-reports.mjs` on the branch: "RESULT: PASS — 0 transition(s) across 3 recorded report(s) (exit 0)".
- `A-92`'s OpenAlex frame run, today's one attempt (`node scripts/eth-openalex-frame.mjs --fetch`, started about 07:55 MT): exit 2, "REFUSED: fulltext: 3699 distinct ids across 29 slices against a stated count of 3706 (nothing written)" (not David's words). The full-text leg's date slices did not reconcile with OpenAlex's own stated count, so the script wrote nothing, as designed. It is not re-run today (once a day; a refused run spends the shared budget too). No figures go into the design note.

## Inputs (controllable)

- None yet.

## Outputs (lagging)

- Not read yet today.

## Recommendation

- None for David yet.

## On hold pending data

- None.

## State Appendix

Written at the close from live commands.
