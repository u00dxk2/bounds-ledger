---
product: bounds-ledger
date: 2026-09-19
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 53c3abd
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "Two numbers on our public page said only that checking them had not settled anything. They now say what we actually tried, what stopped us, and what the source itself credits the number to. We also finished a job we had been carrying since late August: when a file we have written to the maintainers about changes, our own alarm now tells us to go and look. Along the way I claimed I had tested something in an ordinary browser when I had not, and the review caught it — that correction is in the page rather than tidied away. Nothing is waiting on you."
---

# Daily — bounds-ledger — 2026-09-19

## BLUF

**FIRST ACTION.** Read the constants-mirror bounds that slice 6 of `A-47` (the standing depth audit, which reads our own cited records against the papers they credit) already names — the rows at positions 125, 175, 225, 275 and 325 of that audit's sampling frame, drawn and stored on 2026-09-18 and listed on the row itself, owed 2026-09-21. The draw exists; what is owed is the reading.

```bash
node scripts/depth-audit.mjs --draw 125 175 225 275 325
```

**Today's ship is a page that says what we tried and failed to do, and the day's sharpest finding is that my first version of it was false.** The two [HW+] rows on `ramsey.html` — R(5, 13) ≤ 1138 and R(8, 14) ≤ 41525 — read *unresolved* and said nothing about why. They now carry the attempt and the attribution. I had written that attempt up as an ordinary browser session, which is exactly the question our own primer says would settle these rows; it was a headless one, and the block page said so, about thirty lines below where I stopped reading it. The claim was withdrawn before it was committed and the correction is recorded in the store rather than smoothed over. **`A-33` also closed** — both legs shipped with both directions demonstrated, after three postponements.

**DON'T-TOUCH.** `check:brief`'s A-41 advisory exclusion inside `npm run verify`. It printed `BRIEF UNVERIFIABLE — … REDIRECTED to /t/signin` again today and the gate still exited 0 with the verdict reported in full. It works because it separates what most gates merge: the verdict is loud and can never render green, while the exit code is untouched, so an unreachable surface neither fails the gate nor launders into a pass — and it names the command that would refute its own premise.

## What changed

**Section A, shipped and live: `645457a`.** Each of the two [HW+] readings — the upper bounds R(5, 13) ≤ 1138 and R(8, 14) ≤ 41525 — now says that the credited paper could not be opened at all, that an automated browser request on 2026-09-19 met the publisher's 403 block page again, that why it refuses us is undetermined, and that the survey's own note 2.1.o says Boza computed bounds marked HW+ in 2013 citing a personal communication — with *whether this cell is one of those is not established here* stated rather than implied. Bounds, credits and verdicts are unchanged; what changed is that a reader can tell "nobody has got to it" from "this is what happened when we tried".

**The guard that ships with it.** An UNRESOLVED or UNREACHABLE reading must carry its own sentence, that sentence must be plain text ending in the single "How it was read" link on a `dd` carrying only `class` and `data-state`, and the whole entry must be the shape the renderer emits. Thirteen mutations fire against it and they trip **seven** distinct assertions, not thirteen — one of them (the note inside an HTML comment) trips the earlier not-on-the-page leg, and its test label says so.

**Section B, shipped: `53c3abd`, and `A-33` closes with it.** At drift time a changed file whose path is in `ledger/upstream-reports.json` prints CANDIDATE CAUSAL EVENT and GO LOOK beside its CHANGED line, never instead of it, carrying the two statements the row requires: not a verdict that our report caused the change, and never a G-4 arrival, because G-4 forbids a causal path containing an artifact we authored and sent.

**Six adversarial rounds, every one returning needs-attention, and four of the findings were in code I had just written.** Round 1 caught the headless claim and an overstatement about what the unread paper could settle. Rounds 2, 3, 4 and 6 each broke the new guard at a wider scope than the last: a regex blind to a bare `hidden` attribute; a tag whitelist that exempted every anchor, so `<a hidden>` around the note passed at zero violations; an element check that never looked at ancestors, so a comment, a `<template>` or a hidden `<div>` around the whole reading passed; and finally a reading hidden inside a `<dt>`'s template, which vanished when the guard stripped the `dt` subtree. **Round 5 found the one that mattered most:** leg 2's stdout is piped into `finding.txt` by `.github/workflows/reverify.yml` and published verbatim into a public issue when the alarm fires, so printing the annotation unconditionally would have auto-published the exact label the 2026-09-02 decision declined. Internal-only is now a place in the code — `check()`'s `causal` parameter, defaulting to `!process.env.CI` — tested in both directions.

**Findings classification: every defect found today was instrument-facing, and consecutive instrument-facing days now stand at four.** Eight defects: six from the review rounds, one CRLF regression that would have failed a fresh Windows clone on unchanged content, and one from reading an instrument against its own claim. The record-facing attempt — reaching the paper behind the two [HW+] bounds — produced no defect in the records and did not discharge the question it set out to settle. On the counted figure: `npm run catches` reports 23 movements across 9 weeks with 1 completed consecutive week at none, and that is a **ceiling on catches rather than a count of them**; none of today's eight is in it, because it counts drift detection on the mirror's generated pins only, and it still cannot see the second watched area at all (`A-54` phase 2, 2026-09-21, owns that). The standing prediction — that the next record-facing catch is a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run — is unchanged, and today did nothing to test it either way.

## Inputs (controllable)

- **Gate discipline held all day.** `npm run verify` exit 0 with the receipt at `645457a` (16:15:54Z); `npm test` exit 0; `render-ramsey --check` PASS on the committed page after every guard change.
- **Six adversarial rounds run before the two commits, not after.** Rounds 1-4 preceded `645457a`; rounds 5-6 preceded `53c3abd`. No finding was argued with; each was fixed or the claim was withdrawn.
- **`W-7` — the standing cadence step that takes one instrument and asks whether its output could ever have said otherwise — fell today on `npm run upstream` (A-33 leg 1).** It printed `No state transitions … 0 transition(s) across 1 recorded report(s) (exit 0)` at 15:34:06Z. Asked whether it could ever say otherwise, the answer for its entire population is no — one report, issue 150, terminal since 2026-08-23 — so that sentence is the only one it can produce until we file another. That is what made building leg 2 the right call over closing around it: closing on leg 1's green would have been closing on a tautology.
- **A-33's gate was read and stamped before anything was decided about it** — `check-due-gates-dispositioned --run A-33`, exit 0 in 5416ms, one row, issue 150 CLOSED, digest unchanged from the 2026-09-12 stamp.

## Outputs (lagging)

- **G-4 arrivals: 0** — `npm run reports`, read 2026-09-19 MT, 42 days since the public flip: 30 raw issues fetched, 30 ours (CI bot + owner) excluded, 0 outside-not-an-arrival, **0 outside arrivals**, the parts summing to the raw total. A measured zero, not a dead probe — and expected, since this counts only the channel of an arriving report and someone can act on a wrong row without ever filing one.
- **Record-listing movements: 23 across 9 weeks, 1 completed consecutive week at none** — `npm run catches`, 16:25:13Z. Quote the per-week figure, never the total, and read it as a ceiling.
- **Candidate-correction queue depth: 1** (`A-51`, the dead-link correction in two mirrored files, dated 2026-09-21). A zero movement rate beside a non-zero queue is work found and blocked, not a quiet week.
- **The public page serves today's wording** — `fetch('https://u00dxk2.github.io/bounds-ledger/ramsey.html')` returned HTTP 200, 90,651 bytes, with the R(5, 13) entry and both new clauses present, read at 16:20Z.

## Recommendation

**Tomorrow: take slice 6's five readings on the constants mirror (`A-47`) — the rows at positions 125, 175, 225, 275 and 325 of that audit's sampling frame, drawn on 2026-09-18 before any of them was read — and treat the ordinary-browser question as still open rather than answered.** Today's retest was headless; the primer's clearing condition for the two [HW+] rows is untouched and should not be deleted. If a genuinely non-automated session is ever available, that is the read — and if it is not, the honest end state is a re-verdict with a reason rather than an errand carried indefinitely.

**The one thing not to let slide:** `A-54` phase 2 on 2026-09-21. There are now two depth stores with two populations and no counter spans them, so the printed catches figure is silently scoped to one of the two watched areas. Either a counter that spans both, or an explicit re-scoping of the figure where it is printed — not a third deferral.

## On hold pending data

**Waiting on David: nothing.** No open ask. Positive control: `node scripts/sky.mjs answered-cards.mjs --project bounds-ledger --full` returned `NO waiting/answered/pending-verify cards for bounds-ledger`, read 15:07Z, so the reader can see this lane's cards and the empty list is a reading rather than a blind spot. Card `ba297b25` (the greenlight for the second watched area) is answered and executed, and the area is serving publicly — read live at 16:20Z by the fetch quoted above.

**No freeze is in force.** No data-wait carries a denominator that must fill by a read date, so there is nothing to validate or lift.

## State Appendix

Written last, from live commands. Every line is as-of the moment its command ran and carries the command that re-reads it; **this appendix cannot name the commit that lands it**, because that commit is made after the writing.

- **HEAD**: `53c3abd` "A-33 leg 2 ships and the row CLOSES: a drifted file we reported against says go look, to us only" — `git -C . log -1 --format=%h%x20%s`, read 16:24Z. `git rev-parse HEAD origin/main` returned that sha twice, so it is on origin.
- **CI**: **GREEN at `53c3abd`** — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml --sha <full 40-char sha>` printed `GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending`, exit 0, read 16:39Z. It read `UNKNOWN — 1 run(s) for HEAD still in progress` (exit 2) at 16:23Z, sixteen minutes earlier; that line carried a clearing condition and this is it being spent rather than carried. GREEN was also read at `645457a` at 16:02Z. The later commits are doc-only, and the closing receipt below sits at HEAD.
- **Gates**: `npm run verify` exit 0, closing receipt `{exitCode: 0, sha: eeb7935…, at: 2026-09-19T16:38:29.177Z}` with `failedGates: []` — taken at the hygiene commit, which is HEAD as this line is written. An earlier receipt sat at `645457a` (16:15:54Z), before leg 2 landed; this one is after every code commit of the day.
- **Deploy**: a Pages build row exists for `645457a`, status `built`, created 15:52:24Z — `gh api repos/u00dxk2/bounds-ledger/pages/builds`, read 15:53Z. No build row was read for `53c3abd`; that push is minutes old at writing.
- **Deploy drift**: NOTHING SWEPT for this lane, which is neither a stop nor a pass — `node scripts/sky.mjs check-deployed-sha-drift.mjs` passed with 0 findings across 33 checksPass Render services and **none of those 33 is ours**; this lane publishes through GitHub Pages and declares no Render service.
- **Ledger**: 68 rows, 20 open after today's close of `A-33` — `node -e` pass over `continuity/items.json`, read 16:19Z. 0 open rows carry no date field.
- **Stale-actionable**: `items:[]` of `consideredCount: 21`, `ledgerState: READABLE` — `node scripts/sky.mjs cc-endpoint-probe.mjs --project bounds-ledger --endpoints items-stale-actionable`, read 16:18Z; it judges the ledger as committed at GitHub HEAD with a 5-minute cache, so its 21 predates today's close.
- **Second area**: `ramsey.html` serves 72 entries at revision #18 and its counts line reads `So far, of the 128 values Table Ia prints: sound 2 …` — read live at 16:20Z by the fetch quoted above.
