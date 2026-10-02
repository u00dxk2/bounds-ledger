---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-02
lifecycle_stage: launched
last_deploy: f573da8 (the last page-changing commit; npm run served read 40 of 40 served at 2026-10-02T07:31:33Z)
on_hold_items: 0
top_action_today: A-64, the desktop index hides both bound columns; then A-54 census session 4
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-02 (prelaunch report)

## BLUF

Yesterday's change broke the front page on desktop screens: the two columns of numbers were pushed out of view and a visitor saw only names. That is fixed and live. The "line N" links on each constant's page now land on the row they name.

We also read four more of the papers that the Ramsey-number survey credits, covering 21 numbers. Ten are confirmed in the paper itself. Eleven could not be settled. Ten of those eleven are credited by the survey to a 1994 thesis, and the thesis only lists them in a table that it says the survey's own author compiled, with no proof. That is a finding about the survey's citations and not a confirmed error. Nothing about it is public, and nobody has been contacted.

## What changed

- **`A-64` closed** (on a desktop screen the index hid both bound columns behind a sideways scroll). Fix `f573da8`, review fix `25dd1b4`, pushed in `e120c4d..7f909e1`. This repairs a regression from yesterday's round 2, so it is corrective work and not new progress.
  - Measured on the live page at 1440 wide: the scroll box went from 1058 visible against 1471 of content to 1058 against 1058; columns from 1055 / 81 / 81 / 253 to 381 / 154 / 269 / 253; median row height from 820 to 311. At 1024 wide: 982 against 982. At 390 wide the page is unchanged.
  - Every row link on the constant pages now ends `?plain=1#L<N>`: 57 links on 39 pages. The 22a link opened on GitHub at 390 wide lands on line 18, highlighted.
- **`A-54` census session 4** (the Small Ramsey Numbers rebuild: read each bound against the paper the survey credits). Plan pushed in `7f909e1` before any source was opened; readings in `6ec8eac`, with the review's fixes in the commit that lands this report. Four papers attempted, 21 bounds: 10 SOUND and 11 UNRESOLVED.
  - ExT: five lower bounds SOUND, from the journal's own PDF.
  - HaKr1: two lower bounds SOUND, on OCR text of the cited volume only. No page image of a page carrying a bound was seen, and each entry says so.
  - Mac: three diagonal upper bounds SOUND. Ten off-diagonal upper bounds UNRESOLVED (see the findings block).
  - Ex16: UNRESOLVED on the reading, because the survey's key names a personal communication nobody can read. The 72-vertex colouring linked from the cited address passed this repository's own checker, and that result is stored apart from the verdict.
- **`A-65` filed** (the 10c page's source link names a line of the mirrored file that has since moved), found during `A-64`'s sibling sweep. Due 2026-10-06.
- **Findings classification, one sentence of human judgment:** today's findings were mostly instrument-facing (the desktop regression, an absence test that named the old link shape, a stale line number in a stored source link, and two more sentences about our own method that a reviewer refuted); one is record-facing but UNRESOLVED, the ten bounds the survey credits to a thesis that does not derive them, and it is not a catch until the 1993 report that thesis cites is read.
  - **Numeric or byte-only: neither.** The drift alarm counted nothing today. Positive control: `reverify.test.mjs` plants synthetic drift on every `npm test`, and both of today's verify runs ran it.
  - **Consecutive instrument-facing days: 3**, counted by hand, on the same reading as yesterday's 2: a record-facing finding that stays UNRESOLVED does not end the run.
  - **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." Not tested today: there was no catch. Today's Mac finding is of that kind (a citation-quality question, found by reading the cited source and not by any alarm), but it is in the second watched area and not a mirrored upstream entry, and it is UNRESOLVED.
- W-7 — the instrument read against its own claim today was the stale-row assertion in `scripts/render-constant-pages.mjs`'s selftest, `!/9z\.md#L24/`, whose message says a stale row "must NOT link the live line". Could its output ever have said otherwise? Only for one spelling of the link. The moment the link shape changed it would have passed on a stale row that did link. It now asks whether any line anchor is present, with a positive control, and was red-armed. Yesterday's report carries no W-7 line, so there was no instrument to rotate away from.

<!-- findings:begin -->
**The survey credits ten upper bounds to a thesis that states them and does not derive them.** `A-54` census session 4, key Mac (J. Mackey's 1994 University of Hawaii thesis), read in full from the university's repository.

- What the thesis does: it proves five diagonal bounds as numbered Calculations and its abstract presents exactly those five as new. Three of them are in Table Ia: R(6,6) ≤ 165, R(7,7) ≤ 540, R(8,8) ≤ 1870.
- What it does not do: derive any of the ten off-diagonal bounds the survey credits to it (R(4,7) ≤ 61, R(4,8) ≤ 84, R(4,9) ≤ 115, R(4,10) ≤ 149, R(5,9) ≤ 316, R(5,10) ≤ 442, R(6,8) ≤ 495, R(6,9) ≤ 780, R(6,10) ≤ 1171, R(7,10) ≤ 2826). Each appears in its Table 2, and four are used as inputs. Printed p. 16 says of that table: "Tables 1 and 2 which were compiled by Radziszowski [Rad]". Radziszowski is the survey's author.
- What was checked, and its limit: this session saw pp. 16 and 17 on their page images. A search of the extracted text for the notation R (a, b) finds 21 lines and no off-diagonal derivation; that search cannot see a bound written in prose. The cross-family reviewer read all three chapters and found no derivation.
- Three readings disagreed, and all three are recorded on the entries: the reading agent proposed DEFECTIVE, this session stored UNRESOLVED, and the reviewer held SOUND because the thesis states each bound. UNRESOLVED is kept, on David's words of 2026-09-20: "Independently source what you can, and mark anything you cannot as credited to the survey and not independently checked." A value supported in the credited source only by a table attributed to the survey's author is not independent of the survey.
- What it is not: evidence that any number is wrong, or that the credit is wrong. The compilation the thesis cites may itself include results Mackey communicated. Settled by: the thesis's reference [Rad] (a 1993 Rochester Institute of Technology report) or version #0 of the survey. Release: `node scripts/ds1-depth.mjs`, then entries DS1-0037 to DS1-0049 in `continuity/depth-audit-ds1.json`.

**Corrections to today's own earlier statements.**

- The selection packet below gives the cause of the desktop regression as a HYPOTHESIS. It is now measured: capping the three badge classes at a length moved the name column from 1055 to 381 with nothing else changed.
- `f573da8`'s commit body says the selftest helper collects "every #L href whatever its shape". Its pattern read one shape. Corrected in `25dd1b4`.
- `6ec8eac`'s commit body says of the Mac thesis "neither proves nor claims any of them", "Every Ramsey bound the thesis text states was listed (21 lines)", and that Ex16 is "SOUND by recomputation". The first is too strong (the thesis states them), the second describes a search as a census, and the third was changed to UNRESOLVED with the recomputation stored apart. The entries now carry the corrected wording.

**Measured at the close, by the orchestrator: now `A-66`.** Between about 897 and 938 wide the index table's 56rem minimum exceeds its box. At 920 wide the live box read 878 visible against 896 of content (the orchestrator's read, about 2026-10-02T08:04Z). Release: `playwright-cli` on the live index, `resize 920 900`, then compare `.scroll`'s clientWidth and scrollWidth.
<!-- findings:end -->

## Inputs (controllable)

- Two cross-family reviews, both Codex, read-only, with the banner's working directory checked against this repository before any finding was read. Round 1 on `f573da8`: PUSH, one NIT, fixed in `25dd1b4`. Round 2 on `6ec8eac`: FIX-THEN-PUSH, two blockers, two should-fix and one NIT. One blocker was taken (Ex16 from SOUND to UNRESOLVED). One was not (the reviewer wanted the ten Mac entries SOUND), with the reason written on each entry. The should-fix items and the NIT were taken.
- Four background reading agents, one per paper, under `tmp/census4-brief.md`, which is session 3's brief plus a rule that a table is read cell by cell. The brief forbids sending identity, completing a verification challenge and shadow libraries. This session checked each reader's key evidence itself: Mac pp. 16 and 17 on page images and the whole extracted text; ExT's Table 1 on its page image; HaKr1's two snippet files; Ex16's archived rows, and the colouring with `scripts/check-ramsey-coloring.mjs` (pass, and a planted-K4 control fails).
- One hygiene helper, dispatched before the build. Its draft holds one line (`A-54`), with wait-justification PASS and engineering-zero PASS for this lane.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report):** `npm run reports` at P1 read 0 outside arrivals of 32 raw issues, parts reconciling 32 + 0 + 0 = 32. By the rule of three, the 95% upper bound on the outside share of issues is about 3/32. It says nothing about readers who never file.
- **Delivery:** `npm run served` after the push read "40 checked — 40 served" with anchor `f573da8`. The live index was then measured at 1440 and 390, and one row link opened on GitHub. CI: GREEN at `7f909e1`. `npm run verify`: exit 0 at `7f909e1`. Encounter: blind (`A-59`, the encounter read, dated 2026-10-28).
- **The two depth counts, side by side and never summed:** the constants audit (`node scripts/depth-audit.mjs`) did not change today. The Small Ramsey Numbers census (`node scripts/ds1-depth.mjs`) reads "census: 52 of 122 bound(s), across 23 of 42 credited paper(s) — 32 sound, 0 defective, 15 unresolved, 5 unreachable"; this morning it read 31 of 122 and 19 of 42.

## Recommendation

Tomorrow's order lives in the primer, written at the close.

- [B] 2026-10-03: `A-47` slice 12 (the depth audit of the constants ledger) at positions 237, 287, 337, 387 and 437, with its review from the other model family before the push.
- [B] 2026-10-04: `A-54` census session 5, opening with Spe4 (6 bounds). Tripwire at that slot: 21 papers remaining against 4 × 7 slots = 28.
- [A — user-visible] By 2026-10-06: `A-63` (a constant page does not say which claim a verdict checked) and `A-65` (the stale source line on the 10c page) are both due, and both change what a reader sees.
- [B] At the 2026-10-18 render slot, not before: decide how the ten Mac cells and the Ex16 cell are marked on the rebuilt page. Proposal on the `A-54` row.

## On hold pending data

- **The ten Mac bounds are UNRESOLVED on who established them.** The 1993 report the thesis cites, or version #0 of the survey, would settle it. Neither has been looked for yet.
- **Telling the survey's author** is outward contact. It is not proposed today, because the finding is unresolved; if the 1993 report settles it, it becomes a decision for David.
- **HaKr1's two bounds rest on OCR text.** A library copy of pp. 139 to 146 would make them page readings.

## State Appendix

### Selection packet (P1 — evidence and choice)

**Outcome:** on a desktop screen the index shows both bound columns again, and "line N" lands on the row a verdict names. Item `A-64` (on a desktop screen the index hides both bound columns behind a sideways scroll), minted today at P1.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." A citer who opens the index on a laptop to look up their number now sees a name and a badge and no number at all.

#### Evidence

- OBSERVED — the lane's own browser read of the live index at about 2026-10-02T06:19Z (`playwright-cli`, viewport 1440×900, page at `89bda4a`): column widths 1055 / 81 / 81 / 253; scroll box 1058 visible against 1471 of content; widest badge 1031 across 34 badges. Population: one page, one viewport. Limit: 390 wide was not re-measured by this lane today.
- OBSERVED by the orchestrator's cold walk, not re-run here (`skylark-site/docs/walks/2026-10-02/bounds-ledger.md`, a synthetic walk, not a real-user encounter): the page at `f2683e7` measured 478 / 127 / 200 / 253 with no sideways scroll; the phone is unaffected (innerWidth 393, scrollWidth 393); "line 18" on c/22a.html opens GitHub's rendered view at the top of the file with nothing highlighted.
- HYPOTHESIS on cause, from reading `scripts/render-site.mjs` lines 602 to 608: `.read`, `.ours` and `.tried` carry `width:max-content;max-width:100%`, and a percentage max-width does not limit what a table cell asks for, so the longer badges from `A-62` (the index read badge names its row, closed 2026-10-01) set the name column's width. Not proven until a change moves the measured widths.
- OBSERVED — `scripts/render-constant-pages.mjs` line 515 emits the line link as `#L<N>` with no `?plain=1`.
- OBSERVED — `npm run reports` (exit 0, today at P1): 0 outside arrivals of 32 raw issues, parts reconcile 32 + 0 + 0 = 32. It counts filed issues on github.com, never page readers.
- OBSERVED — `npm run verify`: receipt `exitCode` 0 at `89bda4ab42cfdce99f81607c02c6755200d33dcd`, stamped 2026-10-02T06:18:54Z. Its claims leg printed "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)." The brief leg read UNVERIFIABLE, which is excluded from the exit code and never a pass.
- OBSERVED — `check-ci-status --workflow reverify.yml`: GREEN at `89bda4a`, HEAD equal to origin/main. Deployed-sha drift: NOTHING SWEPT, this lane has no Render service and appears in none of the checker's blocks.
- OBSERVED — `check-cycle-rotation --lane bounds-ledger` (exit 0): "no product-love cycle picks this lane today".
- MISSING — any read of a real person meeting the broken index. The page is static with no analytics by design (`A-59`, the encounter read, dated 2026-10-28).
- Prior-day retro findings, from the kickoff's quoted lines: none has recurred so far today. The one that bears on this work is the verify receipt and a working tree that changes during the run; no code-shaped file was edited while today's verify ran.

#### Permission

- Lane-authorised: a repair to the lane's own public page, directed by the orchestrator's lead. `index.html` and the `c/` pages are not under the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html` until the `A-54` rebuild (the Small Ramsey Numbers census) lands. No board card is open (`answered-cards`: none).
- Outward gate: none touched beyond the ordinary Pages publish. The change gets a review from the other model family before its push.

#### Next action

Kind: **investigate a user failure**, then improve. First command, the baseline on a clean tree:

```
node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
```

#### Acceptance condition

On the live index at 1440 wide the scroll box's content width equals its visible width and each bound column is at least 120px. At 390 wide the page still has no sideways scroll. Every "line N" link on the constant pages ends `?plain=1#L<N>`, held by a selftest with both answers recorded, and one such link opened on GitHub shows the code view with that line highlighted.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, then the same browser read at 1440 and at 390 on the live page.
- Encounter: blind (`A-59`). The event that would appear is an outside issue filed through a per-row link, counted by `npm run reports`; it is readable at N = 1.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `scripts/render-constant-pages.mjs`, `index.html`, and every `c/` page that carries a line link (count read at render).

#### HYGIENE INPUTS

- (a) due rows not bearing on the choice: 1 — `A-54` (the Small Ramsey Numbers census, `expectedSignalBy` 2026-10-02). It is today's second action, after `A-64`: census session 4, tripwire first. `node scripts/ds1-depth.mjs` read "census: 31 of 122 bound(s), across 19 of 42 credited paper(s)" at P1.
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 739 considered".
- (c) state reads marked CROSSED: none — read all 13 kickoff state reads. Two could not be judged and are not zeros: missingLinkedCommits "NOTHING SWEPT (0 of 0 considered)", and key numbers "no list yet".

### Section 0

- Primer: `docs/cold-starts/2026-10-01.md` read whole; no file exists for 2026-10-02.
- Listener: 🟢 SSE alive (restart 2026-10-02T06:14:21Z, hello 06:14:28Z, slug bounds-ledger), wake loop armed by tool call, waker ranks 1 to 3 running.
- Codex: GREEN per the kickoff's probe line (real exec 2026-10-01T22:18Z). Not re-probed at P1.
- CI: GREEN at `89bda4a`. Drift: NOTHING SWEPT.
- Harness: running 2.1.287 · fleet UNIFORM · installed 2.1.287 (SAME).
- Recs yesterday: census session 4 on `A-54` → carrying today, P3, after `A-64`. `A-47` (the depth audit) slice 12 → carrying, dated 2026-10-03. Decide `A-62` by 2026-10-06 → executed (closed in round 2, commit `69f4160`).

### Close

ACTION: COMPLETED · item `A-64` (the desktop index hid both bound columns) · P3 279db3cd

- **Acceptance met, and re-measured by the orchestrator** (its P3 review, bus e874cf67, its own browser read at about 08:04Z): at 1440 wide the scroll box is 1058 / 1058 with columns 381 / 154 / 269 / 253; at 390 wide the document is 390 / 390; at 1024 the box is 982 / 982. Those are this lane's numbers. The highlighted-line read on GitHub is this lane's alone.
- **State changed since the P3 post:** CI on `78fa36d` settled GREEN (the orchestrator's `gh run list` read; the P3 post said pending). Not re-read by this lane.
- **Receipt:** the P3 receipt stands unchanged. Exposure is still blind (`A-59`, the encounter read) and the outcome is open.
- **Hygiene draft: 1 line — 1 accepted · 0 amended · 0 rejected.** `A-54` (the Small Ramsey Numbers census) re-dated to 2026-10-04, the next census slot, because session 4's readings landed today. The draft's READ-MUTATED line, quoted: "READ-MUTATED A-54 scripts/render-constant-pages.mjs — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks". Checked: it was this lane's own `A-64` edit, in progress while the helper ran. Its two checks: wait-justification "RESULT: PASS — 1 of 80 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)"; engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable". The helper also asked whether `A-54`'s stored read should move to the census counter. Judged: no change today. The stored read watches for a new survey revision, which the row still owes, and the census counter is named in the row's `onTrigger`.
- **Due gates:** `check-due-gates-dispositioned` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." and "snapshot CURRENT: taken today (2026-10-02)".
- **Ledger delta at the close:**
  - `A-66` minted (between about 897 and 938 wide the index table scrolls sideways inside its box), due 2026-10-06. It records the orchestrator's read at 920 wide, 878 visible against 896 of content, with its read command. Both stylesheet rules behind it are in `index.html` at `e120c4d`, the commit before today's fix, so the band is older than `A-64`; nobody measured the earlier page at that width. This replaces the "Not measured" line in the findings block above.
  - `A-64` gains its two linked commits, `f573da8` and `25dd1b4`.
  - `node scripts/sky.mjs continuity-check.mjs` reads WARN on one finding, UNTRACKED_COMMITS (21 commits in 48 hours not linked from any row). It is not new today and is not resolved today.
- **Does marking the Mackey cells need David before 2026-10-18? No card is filed, and here is why.** His 2026-09-20 ruling already gives the wording for a value we could not independently source: "credited to the survey and not independently checked". Marking the ten cells that way applies his sentence and asks nothing new of him. The Ex16 cell (verified by recomputing its colouring) follows the reading already recorded on the `A-54` row and used for one earlier cell. The rendered page gets its own cross-family review at the 2026-10-20 slot before the freeze lifts. What WOULD need his word, and is not being asked: telling the survey's author. That waits on the 1993 report being read.
- **Pending reads, each on its row:** 2026-10-03 `A-47` slice 12 (the depth audit of the constants ledger). 2026-10-04 `A-54` census session 5. 2026-10-06 `A-63` (which claim a verdict checked), `A-65` (the stale source line on the 10c page) and `A-66`. 2026-10-08 at the latest, the blocked-paper retry on `A-54`. 2026-10-28 `A-59`.
- **UNRESOLVED at the close:** none of the day's gates. The ten Mac verdicts are UNRESOLVED as verdicts, by design.

## Round 2

### Selection packet (P1 — evidence and choice, round 2)

**Outcome:** a number pasted into the index's filter shows its row on the first screen, on a phone and on a desktop. Item `A-67` (on the index a pasted number's matching row lands below the first screen, under the explanatory notes), minted at this P1. `A-66` (the index table scrolls sideways between about 897 and 938 wide) rides beside it: it is the same page and the same stylesheet.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." The index's own label tells that person to "paste a number you are about to cite". When they do, the answer sits below the first screen, under two paragraphs of explanation.

#### Evidence

- OBSERVED by the orchestrator's cold walk of round 1, not re-run here (`skylark-site/docs/walks/2026-10-02-r1/bounds-ledger.md`, findings 1 and 2; a synthetic walk, not a real-user encounter; window 08:28Z to 08:37Z): with `10.02` typed, the one matching row sat 929px below the box on a 393×659 phone and 709px below it on a 1440×900 desktop. Unfiltered, the box is 1708px down on the phone and 1000px on desktop.
- OBSERVED — `index.html` at `8a0ff25`, lines 69 to 106: lede, the also-watched line, a six-paragraph note, the controls, the count, two long hint paragraphs, then the table. The note and hints are deliberate honesty text, so the change moves them and does not cut them.
- OBSERVED by the same walk: at 920 wide the scroll box is 878 visible against 896 of content and the "cite" link is clipped (`A-66`'s own read, unchanged since round 1's close).
- OBSERVED — `npm run reports` (exit 0, at this P1): 0 outside arrivals of 32 raw issues; parts reconcile 32 + 0 + 0 = 32. It counts filed issues, never page readers.
- OBSERVED — `check-ci-status --workflow reverify.yml`: GREEN at `8a0ff25`, HEAD equal to origin/main after `git pull` ("Already up to date.").
- OBSERVED — `check-cycle-rotation --lane bounds-ledger` (exit 0): "no product-love cycle picks this lane today".
- OBSERVED — `answered-cards`: no waiting, answered or pending-verify card for this lane.
- PENDING at posting — `npm run verify` was started at this P1 and had not finished when this packet was written; its receipt is read before any P3 commit. One ledger file (`continuity/items.json`, the `A-67` row) was edited while it ran; the row carries no deferral fields, so the deferral leg's answer is the same either way.
- MISSING — any read of a real person using the filter. The page is static with no analytics by design (`A-59`, the encounter read, dated 2026-10-28).
- Prior-day retro findings: the one that bears here is the receipt and a working tree that changes during the run, and it recurred in the mild form above (a doc-shaped edit, not code).

#### Not chosen this round

- `A-63` (a constant page does not say which claim a verdict checked) is the larger reader-visible change. Its public sentence is a method sentence and needs its own review angle before it is written. It keeps its 2026-10-06 date. If it is not the next round's change, it gets a new date and the reason at that round's close.
- `A-65` (the stale `#L281` source link on the 10c page) stays a small fix. It is done only if P3 has room after `A-67` and `A-66` are reviewed. Otherwise it keeps its date.
- Marking the Mackey cells and Ex16 on the frozen page (owed 2026-10-18): **no board card is needed.** Round 1's close gives the reason: David's 2026-09-20 sentence already supplies the wording. The question that would need him, telling the survey's author, is not being asked.

#### Permission

- Lane-authorised: a layout change to the lane's own public index, on the orchestrator's round-2 lead. `index.html` is not under the 2026-09-20 freeze (that covers `ramsey.html` and `copying.html`). No board card is open.
- Outward gate: none beyond the ordinary Pages publish. The moved text and the new pointer line get a cross-family review before the push, because the change moves a public disclaimer.

#### Next action

Kind: **improve**. First command, the baseline on a clean tree:

```
node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
```

#### Acceptance condition

On the live index, with `10.02` in the filter, the matching row's top is inside the first screen at 393×659 and at 1440×900. The "Read this before you trust a number here" note is still on the page and is named from above the table. For `A-66`, the scroll box's content width equals its visible width at 900, 920, 940 and 960 wide, and 390 and 1440 match `A-64`'s close read. `render-site --check` passes after the commit.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, then the same browser reads on the live page.
- Encounter: blind (`A-59`). The event that would appear is an outside issue filed through a per-row link or the empty-result link, counted by `npm run reports`. It is readable at N = 1.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs` (order of the blocks, the pointer line, the card-layout breakpoint) and `index.html` (regenerated).

#### HYGIENE INPUTS

- (a) due rows not bearing on the choice: none — read "dated gates due today: 0". The morning snapshot stands: a re-snapshot at this P1 was refused with exit 2 because it would drop `A-54`, which round 1's close re-dated to 2026-10-04.
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 739 considered".
- (c) state reads marked CROSSED: none — read the kickoff's state reads. Two could not be judged and are not zeros: missingLinkedCommits "NOTHING SWEPT (0 of 0 considered)", and key numbers "no list yet".
