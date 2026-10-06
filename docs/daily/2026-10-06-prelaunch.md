---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-06
lifecycle_stage: launched
last_deploy: 60ecc83 (the last page-changing commit; npm run served read 2 of 2 served at 2026-10-06T15:14:50Z)
on_hold_items: 0
top_action_today: A-63 round-one defects, five constant pages stop showing raw TeX markup and 26a stops stating one limit twice
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-06 (prelaunch report)

## BLUF

Five constant pages no longer show raw math markup where the checked claim should be, and the page renderer now refuses that markup, so the next one cannot ship.

## What changed

- `A-63` (a constant page does not say which claim in a row was checked), round-one defects, commit `e02fe09`, live since 2026-10-06 16:53Z. On `c/26a.html` the claim now reads "that DMP2019 proves the Bohnenblust–Hille constant for functions of degree at most d on the Boolean cube is at most C raised to the power √(d log d), for an absolute constant C", where it used to print `BH^{≤d}_{±1} ≤ C^{√(d log d)}` literally. The same rewrite was made on 20b, 3b, 84a and 9a, and each keeps the scope it was named with before the reading.
- 26a's verdict states its bound-cell limit once, not twice. In the same pass, 37a dropped a "does not cover the proof itself" clause that its source note already says, and 46a keeps only the part its source note does not say.
- `scripts/render-constant-pages.mjs`: a claim field carrying `^{`, `_{` or a backslash command is refused with its own named reason, and the render refuses the whole store rather than publishing it.

## Inputs (controllable)

- Red-arm, selftest: `TEX_MARKUP` weakened one alternative at a time. Each run exited 1 naming its own form, for example "a claimReader carrying ^{ must be refused, not rendered"; outputs `tmp/redarm-caret-brace.txt`, `-underscore-brace.txt`, `-backslash.txt`. Restored, the selftest passed.
- Red-arm, wiring: the old 26a text was put back into the real store, and the real `render-constant-pages --check` printed "RESULT: FAIL … A-47-0041: a claim field carries TeX-style markup (^{, _{ or a backslash command), which no page renders" with exit 1 (`tmp/redarm-store-check.txt`). Restored, `--check` printed "RESULT: PASS — 115 constant page(s) match committed state".
- Reviews by the other model family (Codex, read-only, banner workdir checked each time): a sentence review of the seven claim edits before commit (5 OK, 1 SHOULD on 46a's provenance, restored; 1 NIT on 9a's wording, taken), and a code review of `e02fe09` (SHIP, no BLOCKER or SHOULD; 1 NIT below).
- Sibling sweep: in `continuity/depth-audit.json`, claim fields containing `^`, `_`, `$` or a backslash: 6 carried braces, all fixed. The rest use bare `^2`, `C_44` or `R^3` notation, which is allowed. The pinned bound cell shown in `<code>` on 40 pages (e.g. `$\infty$`) quotes the upstream cell verbatim on purpose, so it is not in scope.
- Manager's hypothesis on nested exponents: checked. Every multi-symbol power now reads "raised to the power", and the sentence review found no ambiguous reading in the seven.

## Outputs (lagging)

- The bar's metric is NOT MEASURABLE (no analytics, no request log). The encounter read is `A-59` (encounter is blind on the public pages), 2026-10-28.
- `npm run reports`: 0 outside arrivals of 33 raw issues (33 + 0 + 0 = 33), read this morning.
- Delivery: `npm run served` at 16:53Z read "7 checked — 7 served, 0 in flight, 0 stale, 0 unreachable" at anchor `e02fe096db`. A live fetch of the seven pages found the markup pattern 0 times on each. The positive control is that the same pattern matched the served 26a page this morning. Live 26a mentions "bound cell" once. CI on `e02fe09`: reverify GREEN.

<!-- findings:begin -->
- Codex's code review NIT on `e02fe09`'s commit body: (1) it says multi-symbol powers read "raised to the power", but 20b keeps `(log n)^2.082...`. That exponent is one decimal number, so it is not a multi-symbol power, but the sentence reads as if it covered every power. (2) It says the sibling sweep found "9 lines". That is the count of lines my Grep matched; Codex counted 11 claim fields under a wider pattern. Both counts agree on 6 carrying braces. The commit body was not rewritten, because the review attaches to that commit.
- `A-65`'s readCommand cannot answer its own question: the runner executes only the part before " — ", so the link count never runs (the hygiene helper's read timed out at 60 s with 0 bytes). A replacement is drafted in `tmp/hygiene-draft-bounds-ledger-2026-10-06.md` for the close.
<!-- findings:end -->

## Recommendation

Written at the close.

## On hold pending data

- **The encounter with today's change:** blind until `A-59`'s read on 2026-10-28.

## State Appendix

### Selection packet (P1 — evidence and choice)

**Outcome:** on five constant pages, the named claim beside a read verdict is printed in plain words or Unicode instead of raw TeX-style markup. On `c/26a.html` the bound-cell limit is stated once, not twice. The renderer refuses that markup in a claim field, red-armed, so the next one cannot ship. Item `A-63` (a constant page does not say which claim in a row was checked), field `roundOneDefects2026_10_05`, which the 10-05 close dated "fix before or with the 2026-10-12 decision".

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out without redoing the literature search I did last year?" Yesterday's round 1 answered part of that: each reading now says which claim it checked. On five pages that answer is unreadable. `c/26a.html` prints "the attribution in the row's comment, that DMP2019 proves BH^{≤d}_{±1} ≤ C^{…" as literal characters, because the pages load no math renderer. A reader who came to check a number gets markup where the claim should be.

#### Evidence

- OBSERVED: a Grep of the working tree's `c/` for `the claim we checked: [^<]*(\^\{|_\{|\\[a-z])`, this morning: 1 hit each in `c/20b.html`, `c/26a.html`, `c/3b.html`, `c/84a.html` and `c/9a.html`, 5 total. This matches the 5 the defect field names.
- OBSERVED: the LIVE page. `curl https://u00dxk2.github.io/bounds-ledger/c/26a.html` returned 200 with 6858 bytes. The same pattern matched line 30: "the claim we checked: the attribution in the row&#39;s comment, that DMP2019 proves BH^{≤d}_{±1} ≤ C^{". A case-insensitive search of that file for `katex|mathjax` returned 0, so nothing on the page renders the markup.
- OBSERVED: `npm run served`: "2 checked — 2 served, 0 in flight, 0 stale, 0 unreachable" at anchor `60ecc83d75`, 15:14:50Z. The live site is serving HEAD's page bytes, so the defect readers see is the one in the tree.
- OBSERVED: `check-ci-status --workflow reverify.yml`: GREEN at `1ed5125d4c`, exit 0.
- OBSERVED: `npm run reports`: 0 outside arrivals of 33 raw issues; the parts reconcile, 33 + 0 + 0 = 33.
- OBSERVED: `answered-cards --project bounds-ledger`: "NO waiting/answered/pending-verify cards for bounds-ledger".
- OBSERVED: `check-cycle-rotation --lane bounds-ledger`: "no product-love cycle picks this lane today", exit 0.
- MISSING: the bar's one metric. It is NOT MEASURABLE (the bar's own words).
- MISSING: any real reader's report of the markup. The defect is OBSERVED in the served text; that it costs a reader anything is a HYPOTHESIS.
- One of yesterday's retro findings bears on this: the claim sentences are method sentences, the class that keeps failing review. The five rewrites get their own review call from the other model family, separate from the code review, and each keeps the claim's scope exactly as it was named before the reading.

#### Permission

- Lane-authorised: `A-63` is open and not parked, with no board card. The fix shape was set at the 10-05 close from the orchestrator's P3 review (bus fd4ef947).
- The constant pages (`c/`) are outside the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html`.
- Outward gate: the change publishes on push. Codex (read-only, banner workdir checked) reviews the five sentences and then the code before the push. No one is contacted.

#### Next action

Kind: **improve**. The first command after the P3 go-ahead is a baseline of the page renderer's own selftest, on a clean tree:

```
node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --selftest
```

Then: rewrite the five `claimReader` values (`A-47-0040` 20b, `A-47-0041` 26a, `A-47-0043` 3b, `A-47-0048` 84a, `A-47-0061` 9a) in `continuity/depth-audit.json`, and have Codex review them alone. Drop `claimNotCovered`'s bound-cell clause on `A-47-0041`; `sourceRead` stays untouched because it is the historical record. Check 37a and 46a for the same repeat. Add a refusal of `^{`, `_{` and backslash-letter sequences to `claimText` in `scripts/render-constant-pages.mjs`, with a selftest assertion, and red-arm it. Re-render `c/` in the background, restore any line-ending-only files, review the code, commit, push, and run `render-constant-pages --check` again after the commit.

#### Acceptance condition

- The Grep above returns 0 over `c/`. Positive control: the same pattern matches the old 26a string in `git show HEAD:c/26a.html`.
- `c/26a.html` states the bound-cell limit once.
- The selftest fails when a claim field carries `^{`, `_{` or a backslash-letter sequence. Shown by a recorded red-arm, then a pass on the restored tree.
- `render-constant-pages --check` passes after the commit, and `npm run check` is green.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, then a live read of the five pages on `https://u00dxk2.github.io/bounds-ledger/`, repeating this morning's Grep against each.
- Encounter: blind (`A-59`, 2026-10-28). The event that would show it is an outside issue filed through a constant page's report link, counted by `npm run reports`, readable at N = 1.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json` (five `claimReader` values, one `claimNotCovered`), `scripts/render-constant-pages.mjs` (the `claimText` refusal and its selftest), `c/20b.html`, `c/26a.html`, `c/3b.html`, `c/84a.html`, `c/9a.html` (and 37a or 46a only if the repeat check finds one), `continuity/items.json` (the `A-63` row).

#### Standing work beside it: `A-54` census session 6

`A-54` (adopt Small Ramsey Numbers as the second watched area) has a census slot today on its own ruled schedule (`A-54.census5_2026_10_04`: 17 papers remain, four per slot, completion 2026-10-20). It runs today because it is scheduled; it is not the choice. Its readings stay off both pages under the 2026-09-20 freeze, so no reader sees them today. Plan pushed before any source is opened, reading agents told never to send identity to any service, and readings reviewed by the other model family before they are pushed. Its blocked-paper retry is due by 2026-10-08.

#### HYGIENE INPUTS

- (a) due rows not bearing on the choice (5), from the morning snapshot (`check-due-gates-dispositioned --snapshot`: "6 gate(s) due on/before 2026-10-06", exit 3 because `A-65` has never been read):
  - `A-9` (engineering-health P2 backlog), due 2026-10-05. Kickoff lists it as read today.
  - `A-65` (the 10c page's source link names a line that has since moved). Read this morning: a Grep of `c/` for hrefs ending `.md#L<digits>"` returned 1 hit, `c/10c.html`, so the row is still open. Its onTrigger asks for a choice by today. The choice touches the same store and renderer as the selection, but option (a) asks for a `sourceRead` edit, and `A-63`'s defect note calls `sourceRead` the historical record that is not edited. That conflict needs a decision before either change, so this row is not folded into the selection.
  - `W-13` (someone must call the served-bytes check). Read above: `npm run served` exit 0, 2 of 2 served.
  - `W-4` (every new detector shows both answers). Its read (`node scripts/reverify.test.mjs`) ran inside `npm run verify`: "47 workflow steps, piped steps pipefail-guarded; 39 self-tests present in CI".
  - `W-8` (does an amended outward artifact go back to David). `gh search issues --repo teorth/optimizationproblems --author u00dxk2 --include-prs --limit 5`: PR 194 merged 2026-09-26, issue 150 closed 2026-08-23, PR 141 merged 2026-08-11. No send since the last read; the positive control holds (both #150 and #194 are listed).
  - `A-54`'s own readCommand (`check-claims`) ran inside `npm run verify`: "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)". The 244 is the row's positive control that C-12 to C-14 are in the set.
- `npm run verify`: receipt `exitCode` 0 at `1ed5125d4c2a6bc5ee153603f3651e2f50510cf9`, stamped 2026-10-06T16:04:01Z (started 15:13Z). The drift leg read "No drift. 116 files match upstream" at an upstream sha (it does not exist in this repo).
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 747 considered".
- (c) state reads marked CROSSED (2): dated gates due today, 6 of 88 swept; and prior-day retro, 8 still on discipline of 10 tagged findings. Not judged, so not zeros: missingLinkedCommits "NOTHING SWEPT (0 of 0 considered)", and key numbers "no list yet".

### Section 0

- Step 0, primer: `docs/cold-starts/2026-10-06.md` read whole. `git pull --ff-only`: already up to date at `1ed5125`.
- Step 0.5, listener: SSE alive (hello at 2026-10-06T14:52:31Z, replay 1). The loop is armed by `ScheduleWakeup`, and the waker ladder has 3 rungs running.
- Step 0.6, Codex: GREEN, from the kickoff's `[codex-probe: GREEN …]` line (14:53:10Z).
- Step 0.7, CI: `check-ci-status --workflow reverify.yml` GREEN at `1ed5125d4c`, exit 0. Deploy drift: this is a GitHub Pages lane with no Render service, so the fleet table has no row for it (NOTHING SWEPT), which is neither a stop nor a pass. Pages serving is read by `npm run served` (above).
- Step 0.9: the binding constraint is retention and word of mouth. This change does not move a measurable metric, and its encounter is unmeasured (`A-59`).
- Step 0.10, yesterday's recommendations: `A-54` census session 6 → carrying today, beside the choice; `A-65` → read today, decision needed (above); `W-13`, `W-4`, `W-8` → read today (above); `A-47` slice 14 → carrying → 2026-10-07; `A-63`'s raw-markup claims and the 26a repeat → pulled into today as the selection.
- Step 0.11, harness: running 2.1.291 · fleet UNIFORM · installed 2.1.291 (SAME).
