---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-05
lifecycle_stage: launched
last_deploy: bd0d1fb (the last page-changing commit; npm run served read 1 of 1 served at 2026-10-05T14:56:17Z)
on_hold_items: 0
top_action_today: A-63 round 1, each read verdict on a constant page says which claim it checked, or that the claim was not recorded
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-05 (prelaunch report)

## BLUF

Each constant page now says which claim a reading checked: 25 verdicts name their claim, and 29 say the page does not name it yet.

## What changed

- `A-63` (a constant page does not say which claim in a row was checked), round 1, commits `a75eea8` and `e920910`. Each read verdict names its claim before the source link, for example on `c/15a.html`: "the claim we checked: that the cited paper proves the upper bound 2.371866 and introduces the asymmetric modification of the laser method that the row's comment names. What we read supports it. This verdict does not cover the comment's words 'and subsequent improvements'." A verdict whose claim was never named before its reading says "This page does not yet say which part of the row that reading checked." Those claims are not written after the fact.
- `A-47` (the depth audit) slice 13, draw `eee7fe3` pushed first, readings `f5f0037`: 80a UNRESOLVED and 9a UNRESOLVED (the cited edition was not reached; what was read supports the claim), 85a SOUND, and retries of 5b and 71a, both SOUND. `node scripts/depth-audit.mjs`: "61 audited, 39 sound, 2 defective, 13 unresolved, 7 unreachable".
- Reviews by the other model family, all read-only with the banner workdir checked: r1 on the 20 claim sentences before any code (2 BLOCKER, 6 SHOULD, 1 NIT, all taken), r2 on `a75eea8` (3 SHOULD, 1 NIT, fixed in `e920910`), r3 on `f5f0037` (6 SHOULD, 1 NIT: five SHOULD and the NIT taken, one refuted).

## Inputs (controllable)

- The renderer's self-test was red-armed with three mutations over four runs, each ending on its own guard: the fallback sentence removed; the named branch disabled (run twice: the first run tripped only the DEFECTIVE check, so a guard was added that names the dropped claim, and the second run tripped it); and an extra result appended. control: each run's `AssertionError` line names the guard that fired, in `tmp/rcp-redarm-1.txt`, `-2.txt`, `-2b.txt` and `-3.txt`, and the restored code passed (`tmp/rcp-selftest-4.txt`, exit 0).
- Acceptance read over `c/*.html` (`tmp/a63-acceptance.mjs`): 115 pages, 61 audit lines = 25 named + 29 unnamed + 7 unreachable. 0 lines carry the vague phrase alone. No internal process text reached a page (positive control: the same patterns match in the store).

## Outputs (lagging)

- The bar's metric is NOT MEASURABLE (no analytics, no request log). The encounter read is `A-59`, 2026-10-28.
- `npm run reports`: 0 outside arrivals of 32 raw issues (32 + 0 + 0 = 32), read this morning.
- Findings classification: no record-facing catch today. The one citation-quality observation, 71a's entry title appearing in neither cited item, was already recorded on 2026-09-25, so it is a re-observation. Everything else today was instrument- or wording-facing: the vague verdict text, and provenance wording in the store.

<!-- findings:begin -->
- Correction to the P1 packet: its acceptance line for `c/26a.html` ("says the attribution was checked and the bound cell was not") already passed before the change, as the orchestrator's review pointed out. The real defect there was placement, and the claim is now named before the source link.
- `continuity-edit --extend` sets `expectedSignalBy` and appends to `closeWhen`; it does not move `nextCheckDate`. Used on `A-47` and `A-63` today, it was reverted by hand from HEAD before any commit, and `nextCheckDate` was set instead.
<!-- findings:end -->

## Recommendation

Tomorrow's order lives in the primer (`docs/cold-starts/2026-10-06.md`), written at this close.

- [B] 2026-10-06: `A-54` census session 6, `A-65` (the 10c page's stale source line), and three standing reads: `W-13` (someone must call the served-bytes check), `W-4` (every new detector shows both answers) and `W-8` (an amended outward artifact goes back to David).
- [B] 2026-10-07: `A-47` slice 14. It needs a new grid, written on `A-47` before the draw is pushed.
- [A — user-visible] by 2026-10-12: fix `A-63`'s five raw-markup claims and the 26a repeat, and refuse that markup in `claimText` (`A-63.roundOneDefects2026_10_05`).

## On hold pending data

- **The encounter with today's change:** blind until `A-59`'s read on 2026-10-28.
- **`A-9` (the engineering-health backlog):** held until 2026-11-04 for the quarterly audit, which has not run and has no date.

## State Appendix

### Selection packet (P1 — evidence and choice)

**Outcome:** on each constant page, every read verdict says in plain words which claim in the row was checked, or says plainly that the claim was not recorded when the source was read. Item `A-63` (a constant page does not say which claim in a row was checked). Round 1 of that row, scoped below.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." Our constant pages answer with a reading, such as "what we read supports the claim we checked in this row". A reader cannot see which claim that was. On `c/15a.html` the reading deliberately left out the row's "and subsequent improvements" clause, and on `c/26a.html` it checked only the comment's attribution, not the bound. In both cases the page reads as if the whole row was checked.

#### Evidence

- OBSERVED: a Grep of `c/` for the literal "the claim we checked", today before 14:56Z (time not recorded), matched 39 files with 1 hit each. Positive control: the same search lists `c/15a.html` and `c/26a.html`, the two pages the `A-63` row names.
- OBSERVED: a tally of `continuity/depth-audit.json` by verdict and by whether `claimChecked` is present, today: 58 entries. SOUND 15 named + 23 none, UNRESOLVED 5 named + 6 none, DEFECTIVE 0 named + 2 none, UNREACHABLE 0 named + 7 none. Read verdicts (every verdict except UNREACHABLE) come to 51, of which 20 carry `claimChecked` and 31 do not. The parts sum: 15 + 23 + 5 + 6 + 2 + 7 = 58. This matches `node scripts/depth-audit.mjs` (exit 0): "58 audited, 38 sound, 2 defective, 11 unresolved, 7 unreachable".
- OBSERVED: the stored text is written for us, not for a reader. `A-47-0051` (15a) opens "Named before reading, verbatim from A-47.slice11Draw2026_10_01: …", and `A-47-0041` (26a) opens "Named before reading (A-47.slice9Draw2026_09_29): …". Publishing it as it stands would put internal process text on a public page, which the row's own caution forbids.
- OBSERVED: `npm run verify` receipt `exitCode` 0 at `f96b83ff7de9399591a10d74846151f016fa9ec4`, stamped 2026-10-05T14:56:01Z. The brief leg read UNVERIFIABLE, which is excluded from the exit code and is never a pass.
- OBSERVED: `npm run reports`: 0 outside arrivals of 32 raw issues; parts reconcile 32 + 0 + 0 = 32.
- OBSERVED: `npm run served`: "1 checked — 1 served, 0 in flight, 0 stale, 0 unreachable" at anchor `bd0d1fbee7`, 14:56:17Z.
- OBSERVED: `answered-cards --project bounds-ledger`: "NO waiting/answered/pending-verify cards for bounds-ledger".
- OBSERVED: `check-cycle-rotation --lane bounds-ledger`: "no product-love cycle picks this lane today", exit 0.
- MISSING: the bar's one metric. It is NOT MEASURABLE (the bar's own words): the page is static with no analytics, and GitHub Pages gives no request log. The encounter read is `A-59`, dated 2026-10-28.
- MISSING: any real reader's report that a verdict was misread. The defect is OBSERVED in the text; that it misleads anyone is a HYPOTHESIS.
- Prior-day retro finding that bears on this work: "a fix note became a fresh defect". The new reader-facing sentences ARE method sentences, the class that failed four review rounds on 2026-10-01, so they get their own review call from the other model family, separate from the code review.

#### Why round 1, and why not the whole row today

Yesterday's P1 deferred `A-63` because closing it means re-deriving 31 claims and writing 51 public method sentences. Its onTrigger fires on "2026-10-06 or the next product round, whichever comes first", and today is a product round. Round 1 does the part that needs no claim written after the reading:

1. For the 20 read verdicts whose `claimChecked` was named before the source was opened: add a reader-facing field (`claimReader`) to each entry, a plain restatement of the stored claim and nothing more. Render it beside the verdict on its constant page.
2. For the 31 read verdicts with no stored claim: render one fixed sentence saying that which part of the row this reading checked was not recorded when it was read. Do NOT re-derive those claims from their evidence notes. A claim named after the reading is the verdict-follows-the-reading failure. These rows stay listed on `A-63` for a later round.
3. A selftest that fails when a read verdict renders with neither a named claim nor the fixed sentence, red-armed. Meaning-carrying guards come first and any exact-match pin last.

After round 1, `A-63` stays open: its closeWhen asks that every read verdict NAME its claim, and 31 will not.

#### Permission

- Lane-authorised: `A-63` is open and not parked, with no board card. It is a first-order improvement to the lane's own pages, shipped under authority.
- The constant pages (`c/`) are not under the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html`.
- Outward gate: the change publishes on push. Two reviews from the other model family (Codex, read-only, banner workdir checked) come before the push: one on the code, and one of its own on every new public sentence. No one is contacted.

#### Next action

Kind: **improve**. The first command after the P3 go-ahead is a baseline of the page renderer's own selftest, on a clean tree:

```
node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --selftest
```

Then: write the 20 `claimReader` restatements into `continuity/depth-audit.json`, have Codex review them on their own, render them and the fixed sentence in `scripts/render-constant-pages.mjs`, add the selftest assertions, red-arm, re-render `c/`, review the code, commit, push, and run a second `render-constant-pages --check` after the commit.

#### Acceptance condition

- `c/15a.html` names the claim checked and says that the "and subsequent improvements" clause was not checked. `c/26a.html` says that the attribution was checked and the bound cell was not.
- None of the 39 pages that carry "the claim we checked" today shows that phrase without a named claim or the fixed not-recorded sentence beside it. Shown by a Grep of `c/` with a positive control.
- No public page carries internal process text ("Named before reading", a slice-draw field name, an `A-47-` id). Shown by a Grep of `c/` with a positive control that the same Grep finds the text in `continuity/depth-audit.json`.
- `render-constant-pages --check` passes after the commit, and `npm run check` is green.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, then a live read of `c/15a.html` and `c/26a.html` on `https://u00dxk2.github.io/bounds-ledger/`.
- Encounter: blind (`A-59`, 2026-10-28). The event that would show it is an outside issue filed through a constant page's report link, counted by `npm run reports`, readable at N = 1.

**USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs`, `c/*.html` (the 39 pages above, plus any that slice 13 adds), `continuity/depth-audit.json` (the 20 `claimReader` fields), `continuity/items.json` (the `A-63` row).

#### The dated read beside it: `A-47` slice 13

`A-47` is due today and bears on this choice: every reading it adds will render under the new rule. The draw, run today before 14:56Z (exact time not recorded) and before any source was opened:

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 487 537 587 637 687
```

It read "frame: 691 cited bound row(s)", "store: 2 of 5 drawn position(s) land on a row already held", "RESULT: PASS — drew 5 position(s) from a frame of 691 (exit 0)". The positions: 487 on 5b [GL95], held by `A-47-0032` (systematic, SOUND); 537 on 71a [MI2026], held by `A-47-0033` (systematic, SOUND); 587 on 80a [H2024], 637 on 85a [Bil26] and 687 on 9a [PS2018], none held. Under `A-60`'s rule (1), recorded as `A-47.collisionRule2026_10_01`, both held positions are held only by systematic entries, so each is a RETRY recorded as a new dated attempt on its existing entry. Slice 13 is 3 new reads and 2 retries. Each new entry's claim is named before its source is opened, and in reader-facing words from the start. The draw is pushed before any source is opened. The readings get a review from the other model family before they are pushed.

#### HYGIENE INPUTS

- (a) due rows not bearing on the choice (2): `A-2` (drift-resolution log; read today inside `npm run verify`: "No drift. 116 files match upstream …" and "catch table: 17 cycles, and README.md says 17.", exit 0) and `A-9` (engineering-health P2 backlog). **`A-9`'s read returned EMPTY today**, and its readCommand's own positive control cannot fire any more. The control names a 2026-08-26 commit, which is now outside the command's 30-day window (09-05 to 10-05), so empty here does not tell "untouched" apart from "wrong path". The readCommand needs a control that cannot age out.
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 744 considered".
- (c) state reads marked CROSSED (2): dated gates due today, 3 of 87 swept (`A-2`, `A-47`, `A-9`); and prior-day retro, 8 still on discipline of 10 tagged findings. Not judged, so not zeros: missingLinkedCommits "NOTHING SWEPT (0 of 0 considered)", and key numbers "no list yet".

### Section 0

- Step 0, primer: `docs/cold-starts/2026-10-05.md` read. Commits after it: `4c61170`, `f96b83f`, both the 10-04 close.
- Step 0.5, listener: SSE alive (hello at 2026-10-05T14:40:35Z, replay 0); the loop is armed by `ScheduleWakeup`; the waker ladder has 3 rungs running.
- Step 0.6, Codex: GREEN, from the kickoff's `[codex-probe: GREEN …]` line (14:41:44Z).
- Step 0.7, CI: `check-ci-status --workflow reverify.yml` GREEN at `f96b83ff7d`, exit 0. Deploy drift: NOTHING SWEPT for this lane. It is a GitHub Pages lane with no Render service, so the fleet table (exit 0) has no row for it. That is neither a stop nor a pass. Pages serving is read by `npm run served` (above).
- Step 0.9, the binding constraint is retention and word of mouth. This change does not move a measurable metric, and its encounter is unmeasured (`A-59`).
- Step 0.10, yesterday's recommendations: `A-47` slice 13 → carrying today, drawn above; `A-63`/`A-65` dated 2026-10-06 → `A-63` pulled into today by its own "next product round" trigger, and `A-65` carrying → 2026-10-06; `A-54` census session 6 → carrying → 2026-10-06; `A-54` blocked-paper retry → carrying → by 2026-10-08.
- Step 0.11, harness: running 2.1.289 · fleet UNIFORM · installed 2.1.289 (SAME).

### Close

ACTION: COMPLETED · item A-63 · P3 bus msgId 07151aef. The acceptance in force was the P1 review's redirect: the claim is named in the verdict sentence itself, before the source link. The orchestrator's P3 review (bus fd4ef947) read c/26a.html and confirmed it met.

Changed since the P3 post:
- The orchestrator's review found two defects in the shipped pages. Five named claims carry raw TeX-style markup on pages with no math renderer: 20b, 26a, 3b, 84a and 9a. This session re-ran a Grep of c/ for `the claim we checked: [^<]*(\^\{|_\{|\\[a-z])`, which matched those 5 files, and a Grep for katex or mathjax in c/26a.html, which returned 0. Separately, c/26a.html states the bound-cell limit twice. Both are recorded with dated fix shapes as `A-63.roundOneDefects2026_10_05`, due by 2026-10-12.
- The P3 receipt still holds; no bracket has changed. The encounter stays blind (bug row A-59).

Ledger delta (continuity-edit):
- `A-2`: `nextCheckDate` set to 2026-10-12 (hygiene draft, AMENDED: set directly rather than through `--extend`).
- `A-9`: held to 2026-11-04 with its reason, and its readCommand re-pointed. The old one is kept as `readCommandBefore2026_10_05` (hygiene draft, ACCEPTED).
- `A-63`: `roundOneDefects2026_10_05` added.
- Earlier today: `A-47` (`slice13Result2026_10_05`, `nextCheckDate` 2026-10-07) and `A-63` (`round1Shipped2026_10_05`, `nextCheckDate` 2026-10-12).

hygiene draft: 3 lines — 2 accepted · 1 amended · 0 rejected. READ-MUTATED: "none — 2 reads guarded". check-wait-justification: "RESULT: PASS — 1 of 87 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". check-engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".

Due-gate verification: `check-due-gates-dispositioned` printed "snapshot CURRENT: taken today (2026-10-05); this verdict certifies today's Phase-0 due set of 3 row(s)" and "RESULT: PASS (exit 0)".

Pending reads, each dated on its row: `A-47` slice 14 on 2026-10-07; `A-63` by 2026-10-12; `A-2` on 2026-10-12; `A-59` on 2026-10-28; `A-9` on 2026-11-04.
