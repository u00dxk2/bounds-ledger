---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-08
lifecycle_stage: launched
last_deploy: f905a3f (CI GREEN on reverify.yml and page-check.yml; GitHub Pages; no Render service)
on_hold_items: 0
top_action_today: when a pasted number matches a constant only through an older row of its mirrored table, the index says so at that moment
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-08 (Sunday, MT)

## BLUF

Pasting a number from an earlier row of a constant's table now says so on its card, with a link to the table. Before, the page said only "nothing highlighted".

## What changed

- P1 chose the day's work (selection packet in the State Appendix).
- **A pasted number found only in an earlier table row now explains itself on its card** (`A-100`, the row for explaining an older-row match; `d675be9`). Pasting 0.380868 lands on 1b as before, and the card now reads: "“0.380868” appears in a table row of this constant's mirrored file, but not in the last-listed rows shown here. Read the file before citing it." The link opens our mirrored copy of `1b.md`. Pasting the shown value 0.3808585504, or a name and id such as "constant 1b", shows no such sentence.
- The morning block ran. `npm run upstream` printed "0 transition(s) across 3 recorded report(s)". `npm run traffic` printed 7 unique repo viewers and 290 unique cloners in the latest 14-day window (page visitors are not counted).
- The two reads dated today ran through `check-due-gates-dispositioned.mjs --run`. `A-45` (the stale-value resolvability floor) printed "RESULT: 257 of 257 resolvable (100.0%)". `A-91` (the watch on upstream's 67a citation of a withdrawn preprint) printed `[]`: no pull request names 1509.00270.

## Inputs (controllable)

- Pull `A-100` (the row for explaining an older-row match) forward from its 11-14 date and ship it through Codex review.

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). The first Search Console read is due 11-11 on `W-18` (the watch for that read).

## Recommendation

- [A — user-visible] Next: `A-101` (a desktop number wrapping mid-digit), the walk's other seam. Today's live measurement at 1366 px saw it on 1b: with 1b the only row shown, the lower-bound column was 96 to 97 px wide whether or not the new sentence showed, so it predates today's change.

## On hold pending data

- The first Search Console read, due 11-11, sits on `W-18` (the watch for that read).

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-07.md` (no 11-08 primer; the 11-07 file is the newest). Its banner governs: morning block, then the `A-45` and `A-91` reads.
- Listener: SSE alive (hello 15:46:26Z, replay of 0 rows since 2026-11-08T02:47:04Z) and loop-tick armed by tool call. Waker ladder ranks 1 to 3 running.
- Codex: GREEN per the kickoff's probe line (15:57:06Z, execute and write proved).
- CI, as of about 16:04Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each reading 1 non-scheduled success for `f905a3f`. `git rev-list --count origin/main...HEAD` printed 0. `git pull --ff-only` printed "Already up to date."
- Deployed-sha drift: NOTHING SWEPT for this lane. The fleet table covered 38 services and exited 3 on three red-drift rows (skylark-auto-progression, skylark-site, bloom-edu), none of them ours. This lane publishes through GitHub Pages (`docs/daily-config.md` § Deployed-sha drift).
- Local verify not run: the fleet rule is that CI green at HEAD replaces it.
- Harness: running 2.1.319 · fleet UNIFORM · installed 2.1.319 (SAME).
- Yesterday's Recommendations: one. Executed: `A-99` (the row for linking each bound to its source), closed in `15180f5`.
- Board: `update-david-board.mjs --list` returned 0 items for this lane in its 48-hour window. `answered-cards.mjs` reported 0 new. The one portfolio-wide card it shows, `9174731b`, covers BloomEDU, Decomposer and Syntopica and names nothing in this repo.
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` exited 2 (UNDETERMINED): no real-user-evidence artifact is on record and the registry does not say whether this lane owes one. That is not a pass that is due; it is a read the registry cannot make.

### P1 selection packet

**Outcome:** a reader who pastes an older bound learns, at that moment, why it matched a constant whose shown bounds differ. Item `A-100` (the row for explaining an older-row match), pulled forward from its 11-14 date.

**The user problem, in the user's words** (from `docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out without redoing the literature search I did last year?" Pasting the older number is the page's headline use. Today it lands on the right constant with no word on why the number shown is different.

**Evidence**

- OBSERVED · the 2026-11-07 journey walk (`docs/journey-walk-2026-11-07.md`) · the live index, phone and desktop · one walk, by us. Pasting 0.380868 lands on 1b, and the count line reads "1 constant matching "0.380868" — nothing highlighted" beside a card whose upper row is 0.3808585504. The explanation is in the notes section, below all 120 cards.
- OBSERVED · the 1b mirror file, `ledger/teorth-optimizationproblems/constants/1b.md`, line 26 · one constant. 0.380868 is in a table row that is not the last-listed one. In `index.html` it appears in 1b's `data-find` (one match for `<tr id="c-1b" data-find="…0.380868`).
- OBSERVED · `scripts/render-site.mjs` `findKey()` (line 583) · every row. The search text joins the title, the id, the shown cells, the previous cells, `tableValues` (the other rows of the mirrored table), aliases and typed forms. So a no-highlight match can come from several sources. The comment at lines 987-992 records that two Codex rounds refuted wording that guessed which one.
- HYPOTHESIS · a reader who sees "nothing highlighted" beside a different number concludes the page is wrong or the match is noise, and leaves without finding the notes.
- MISSING · any reading of what real readers paste or do next. The page has no analytics (`A-59`).

**The narrower form, chosen before building** (because two review rounds already refuted a guess at the source): the new sentence fires only when the typed text is a member of that row's own table values. The renderer would emit those values in their own attribute, so the client tests that attribute directly and never infers it from a missing highlight. Wording is listing-position only, never "superseded" or "the record", as `A-100`'s note gives it: '"x" appears in this constant's mirrored table, but not in the last-listed rows shown here. Read the table before citing it.' Any other no-highlight match keeps today's line unchanged.

**Permission:** `A-100` is open, owned by this lane, not parked, and has no card. Changing our own index page is this lane's call. The outward gate (`AGENTS.md` § Hard invariants: one adversarial review on anything a stranger could read) applies, as a Codex review of the exact diff plus a claims pass on the new sentence.

**Next action:** improve. First command:

```bash
node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
```

(Ran this morning: exit 0, the baseline before any change.)

**Acceptance condition:** on the live index, typing 0.380868 shows 1b with the new sentence, and typing 0.3808585504 (a last-listed value) does not show it. A name or typed-fraction match with nothing highlighted keeps today's count line. `render-site --selftest` asserts both answers, red-armed. `page-check.yml` and `reverify.yml` are green on the push tip, and a Pages build row exists for it. A live fetch of `index.html` carries the new attribute on 1b.

**Delivery and encounter checks:** delivery is the Pages builds API row for the push tip, then a live fetch of the index and an in-browser paste with `playwright-cli` at 390 px and desktop width. Encounter: nothing on the page can see a reader (`A-59`). The encounter is blind, not zero, and no read on the calendar can see this one: `W-18` (the watch for the Search Console read), due 11-11, counts arrivals from Google, never what a visitor types.

**Recurred retro finding that bears on this:** the report-lint repair loop (11-07 retro, still on discipline). This report glosses each tracker id in parentheses with no comma, and every count names its command.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `index.html`, `continuity/items.json`.

**HYGIENE INPUTS** (copied from the kickoff's reads):

- (a) Due rows not bearing on the choice, 2 of 2 due: `A-45` (the stale-value resolvability floor), read today at "257 of 257 resolvable (100.0%)", unchanged since 11-01. `A-91` (the watch on upstream's 67a citation), read today at `[]`. Its onTrigger says re-date one week when nothing changed. `check-due-gates-dispositioned` also flags it SOURCE_EMPTY: an empty result is the real answer here (no PR names the preprint), so it needs a one-line `readCommandSourceEmptyOk`.
  Positive control: the same search on the same repository with the term `67a` (`gh search prs --repo teorth/optimizationproblems 67a --json number,state --limit 5`) returned `[{"number":49,"state":"merged"}]`, so the search reaches upstream's pull requests and the `[]` is about the preprint id.
- (b) Owed child rows in the orchestrator's ledger: none, from the kickoff read over 800 rows.
- (c) State reads marked as crossed: dated gates due today, 2 of 2 (listed in (a)). Board cards carrying David's word: 1, `9174731b`, not this lane's. Prior-day retro findings: 4 tagged, all 4 still on discipline.

### P3 product work

<!-- findings:begin -->
- Correction to the P1 packet's wording, from the round-0 read: the sentence it proposed said "this constant's mirrored table" and "Read the table". `tableValuesFor` reads the first cell of every table row in the constant's file, which can hold several tables and a header carrying a digit, and the source link opens upstream's live file, which can differ from our mirror. The shipped sentence says "a table row of this constant's mirrored file" and links to our mirrored copy.
<!-- findings:end -->

- Hygiene helper: dispatched at about 16:55Z; draft `tmp/hygiene-draft-bounds-ledger-2026-11-08.md` present, three lines: re-date `A-45` (the stale-value resolvability floor) and `A-91` (the watch on upstream's 67a citation) one week, and add `A-91`'s `readCommandSourceEmptyOk`. Its checks: check-wait-justification "RESULT: PASS — 2 of 122 row(s) carry `waitJustification`; 0 warn / 0 info"; check-engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable".
- Manager review points, each checked: (1) table cells keep their LaTeX dollars, so membership is a substring test on the raw cells; (2) the shown rows are checked directly, so 0.3808585504 stays silent; (3) the shortened (`A-80`, the rounded-number row) path passes no reader text and stays silent; (4) the sentence sits on each card, not on the count line.
- Round 0: a Sonnet helper listed what the code does (4 sections, with file and line). It narrowed two clauses, recorded in the findings block above. It also listed the cases that get no sentence: values only in pin history, hand aliases or typed fraction forms; the shortened path; and a row with no table values.
- Selftest: nine new cases executed against the page's own script, plus the rendered row and a row with no table values. Red-arms, each restored byte-identical by file hash, each making `render-site.mjs --selftest` exit 1 on its own guard: membership check off ("a match through name and id must not claim a table row"), the shortened path passing the reader's text ("a shortened match must not quote the reader's number as found in the table"), and the shown-row check off ("a number in a shown row must not be called absent from it, highlight or not").
- Codex round 1 on `d675be9` (banner workdir matched this repo): no findings. It named two things a static read cannot see, browser attribute decoding and a future change to how shown rows are displayed. The live paste below covers the first.
- Delivery: the Pages build for `d675be9` built at 17:26:43Z (builds API). Live Playwright on the published page: 1b's `data-table` decodes to a list holding `$0.380868$`; pasting 0.380868 shows the sentence with the mirrored-file link; 0.3808585504 and "constant 1b" do not. At 390 px the sentence sits inside the card with page width 390 (no sideways scroll). At 1366 px, with 1b the only row shown, showing the sentence moved the lower-bound column by 1 px and the source column by 11 px. CI reverify.yml and page-check.yml green on `d675be9`.
- Encounter: blind. The page has no analytics, see `A-59` (the row saying nothing can see an arrival there), and no read on the calendar can see what a visitor types. Outcome: open.
- `A-100` (the row for explaining an older-row match) is closed. Files still naming it: `scripts/render-site.mjs` and `index.html` (provenance comments), `docs/journey-walk-2026-11-07.md`, `docs/key-user-flows.md` and `docs/README.md` (historical, the walk that minted it), `docs/housekeeping-ledger.md` (two itches that name it as a read due 11-14; that read is now done, so the render-site migration they wait on no longer waits on it), and this report.

### Close

ACTION: COMPLETED · item `A-100` (the row for explaining an older-row match) · P3 630852be

- The acceptance condition in force (the P1 packet, approved with four manager checks) is met: shipped in `d675be9`, live on the published page, CI reverify.yml and page-check.yml green on `d675be9`. The manager review of the P3 post found no defect.
- Changed since the P3 post: a cross-family claims pass, which the manager's review suggested and portable rule 6 owes for public text. Codex, read-only, banner workdir `C:\dev\skylark\bounds-ledger`, checked the sentence's clauses against `1b.md` and the rendered row. Clause 4 (no supersession or record claim): HOLDS. For 1b, clauses 1 and 2 HOLD: 0.380868 is at `1b.md:26`, the shown rows are the final rows of their tables (`1b.md:28`, `:38`), and neither contains it. In general it marked them REFUTED-AS-WRITTEN, on three grounds. Two are DELIBERATE: matching ignores case and reads the first cell of any line starting with `|`, the same rules as the page's search. The third is PLAUSIBLE, not fixed: the display strips fragment anchors while the shown-row check reads the raw row, so text crossing an anchor boundary could be visible and still trigger the sentence. Search space for that case: `^\|[^|]*<a ` over `ledger/teorth-optimizationproblems/constants/` returned 0 bound cells carrying an anchor, so no current row can produce it. Clause 3 (the link follows `main`, so its target can change after the render): DELIBERATE, it is the same mirrored file the constant's name link already opens.
- Hygiene draft: 3 lines, 1 accepted, 2 amended, 0 rejected. `A-45` (the stale-value resolvability floor) re-dated to 11-15 with `--set … expectedSignalBy` rather than the drafted `--extend` (this row's precedent of 10-11 and 10-18). `A-91` (the watch on upstream's 67a citation) re-dated to 11-15 with `--set … nextCheckDate`, because `--extend` writes the store's declared clock field and would not move this row's `nextCheckDate`. `A-91`'s `readCommandSourceEmptyOk` accepted as drafted. READ-MUTATED: none. Its two checks: check-wait-justification "RESULT: PASS — 2 of 122 row(s) carry `waitJustification`; 0 warn / 0 info"; check-engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable".
- Due-gate verification: `check-due-gates-dispositioned.mjs` printed "snapshot CURRENT: taken today (2026-11-08); this verdict certifies today's Phase-0 due set of 2 row(s)" and "RESULT: PASS (exit 0)".
- Ledger delta: closed `A-100`; re-dated `A-45` and `A-91` to 11-15; added `A-91`'s empty-source waiver; appended today's blind receipt to `A-59` (the row saying nothing can see an arrival on the page), keeping its re-look on 11-11.
- Pending reads, none done: on 11-11, the re-look on `A-59` (the row saying nothing can see an arrival on the page) and the first Search Console read on `W-18` (the watch for that read) (neither can see what a visitor types, so today's encounter stays blind); `A-47` (the depth audit), `A-92` (the reading of the claimed refutation of the exponential time hypothesis), `A-94` (the close-boundary primer gate that exits 1) and `W-17` (the weekly arXiv watch for newer results on the constants) on 11-09.
- `continuity/traffic.json` (this morning's `npm run traffic` sample) is committed with this close.
