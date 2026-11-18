---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-17
lifecycle_stage: launched
last_deploy: "8981246 (as of about 17:55Z on 2026-11-17, check-ci-status read reverify.yml and page-check.yml green on 8981246, Pages build row built 17:48:09Z; release: node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml, then --workflow page-check.yml; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: bring the newer-papers line on every constant page up to today, from a search that has said "through 2026-10-31" for 17 days
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-17 (Tuesday, MT)

## BLUF

Readers see one change today: every constant page's line about newer papers now covers a search through 17 November, 19 papers, not one that stopped on 31 October.

On four constants the line now says we have not finished comparing what the papers report. One of those, 1d, no longer names a paper. Nobody has read those values against the tables yet, so no page claims they are stronger.

## What changed

- P1 chose the day's work: `W-17` (the newer-papers line on every constant page states a dated search; keep it honest). The selection packet is in the State Appendix.
- The two arXiv reads that slipped ran this morning, as one reader batch:
  - `A-81` (the Ramsey-area watcher): `arxiv-watch.mjs --check` printed "papers fetched: 185 · verdicts: 185", "candidate bound(s) beating or contradicting a value we show: 0", "RESULT: COMPLETE — no candidate (exit 0)". 162 verdicts were reused from the 2026-11-02 run (same id and version); two readers read the 23 new papers or versions today.
  - `W-17` (the newer-papers line): `arxiv-watch.mjs --check --area constants --from 2026-09-26` printed "papers fetched: 19 · verdicts: 19", "claims-a-better-bound: 2", "candidate bound(s) beating or contradicting a value we show: 9 (details stay in verdicts.json, never printed)", "RESULT: COMPLETE — candidates, or bounds the script cannot rank, to verify by reading the paper (exit 1)". 14 verdicts were reused from the 2026-10-31 run; three readers read the 5 new papers or versions in full text today. Candidates stay in git-ignored `tmp/`, never in a commit, a page or a bus body.
- Morning refresh of the open pull request lists: `open-pulls.mjs --fetch` read 98 open upstream (97 yesterday). It was committed alone as `3a79d96`: 59 pages get the new read date, and the 8a page also lists pull request 373. A read-only Codex round (banner workdir checked, model gpt-6-astra) enumerated all 120 pages against the committed list and returned "VERDICT: SHIP", no defects. It was pushed by sha, and CI `reverify.yml` and `page-check.yml` passed on `3a79d96`. The Pages build row was built 17:31:38Z to 17:32:11Z.
- **The newer-papers line, shipped as `8981246`.** `ledger/newer-results.json` now has checkedThrough 2026-11-17 and papersFound 19, and its perConstant map was rebuilt by script with the watcher's own `compareConstant`. 3a (2 papers) and 3d (1 paper) stay `none`. 3a's rests on a hand reading: none of its six values is stronger than the strongest lower bound in its table (1.19519192, an asterisked row). Five are below the table's 1.19359680. The sixth, 1.193597 (the paper's restated "best known"), is above that row in raw digits and equal to it within printed precision. (Corrected at the close: my P3 post said all six were below. The manager's review caught it.) 1a, 1b, 1d (4, 4 and 2 papers) and 3b (1 paper) are `not-compared`. 1d's `reported-stronger` entry and its construction lookup are withdrawn, because a second paper in the window also bears on 1d and the sentence names exactly one paper. A read-only Codex round on `5addfd2` (banner workdir checked) recomputed all 120 claims ("120 claims = 88 weaker + 9 beats + 22 unjudged + 1 within-precision"). It found nothing outside the newer-papers block changed, and returned "VERDICT: SHIP". Its one narrowing, that the 19 readings include 14 carried over from 10-31, was applied to the unpushed commit's message (`--amend`; tree hash identical before and after), giving `8981246`, pushed by sha.
- Delivery: Pages build row for `8981246` built 17:48:09Z. `npm run served`, run 330 s after the build, printed "120 checked — 120 served, 0 in flight, 0 stale, 0 unreachable", exit 0. Live fetches of `c/1a.html`, `c/1d.html` and `c/3b.html` returned 200 with "from 2026-09-26 to 2026-11-17", "It found 19 papers" and "that we have not finished comparing", and none names 2609.40340. CI `reverify.yml` and `page-check.yml` passed on `8981246`.

## Inputs (controllable)

- Section 0 reads, the morning block, the two arXiv fetches and five reader agents, and a read of `scripts/extract-pins.mjs` and `scripts/reverify.mjs` for the `A-108` question.

<!-- findings:begin -->
- **A plain weekly fetch would have shortened the line's window, not extended it.** The onTrigger of `W-17` (the newer-papers line on every constant page) says to run `--fetch --area constants`, whose window opens at the mirror's fetch date (2026-10-28). The live store's window is 2026-09-26 to 2026-10-31, and its per-constant lines, 1d's named paper among them, rest on papers from before 10-28. Taken literally, the onTrigger would have dropped those lines. The row's own 10-31 note already says to use `--from` in this case, so today's run used `--from 2026-09-26`. The onTrigger text should say so too (a hygiene input).
- **My first commit-message draft broke the candidate rule.** It described what the other papers state for 1d and the not-compared constants. Candidates stay in `tmp/` and out of commits, so I took those sentences out before committing. The Codex round then confirmed that no candidate id, value or quote entered a committed file.
- **The hygiene helper's READ-MUTATED line was my own edit.** `W-4` (prove every new detector both ways) was reading while I changed `ledger/newer-results.json`, and the read timed out at its 300 s cap, as it did on 11-10. I explained it on the bus (`d078c59c`); it gets a quiet re-run at the close.
- **Nothing has gone outward since issue 289 on 2026-10-29.** `W-8` (does an amended outward artifact go back to David first) treats that quiet as its own finding. `gh search issues --repo teorth/optimizationproblems --author u00dxk2 --include-prs` lists issue 289 (2026-10-29) as the newest send, and its positive control held (issue 150 and pull request 194 listed). So the windows 11-03 to 11-10 and 11-10 to 11-17 were both empty. By `W-8`'s closeWhen, a quiet outward channel is the thing to report instead of the original question. The one send in waiting is the 3b DOI correction (Recommendation C), held at the outward gate on purpose.
- Classification (one sentence of judgment, never a counter): today's findings concern our own row's instruction, my own commit message, a timed-out read and a quiet outward channel, so all are instrument-facing; the 9 candidates are unverified claims about other people's papers and become findings only once someone reads them; `npm run catches` was not run.
<!-- findings:end -->

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). `npm run traffic` read 3 unique repo viewers and 226 unique cloners in the latest 14-day window (repo views, not page readers).

## Recommendation

- [A — the next step on today's outcome] Read the 9 candidates and the unranked values on 1a, 1b, 1d and 3b, whose line says "not finished comparing", against their tables, by hand. Settle each constant as `none` or as a `reported-stronger` entry. A new entry naming a paper goes through a cross-family claims pass and an adversarial review, then to David on a card before it is switched on, as 1d's did on 10-31. This includes how 1d should read with two papers. The details are in `tmp/arxiv-watch/2026-11-17/constants/`, never in a commit.
- [B — carried] `A-108` (the narrower feed), due 2026-11-23. The orchestrator answered today: refuse a malformed id in both places, `extract-pins.mjs` and the snapshot, with a red-and-green proof that `claims.json` stays unchanged on a bad stem. The `extract-pins` selftest's ids `t1` to `t4` would fail that pattern and need changing first.
- [C — outward, gated, carried] The 3b DOI correction from 11-12 is still unsent: adversarial review and David's word first.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-16.md` (no `2026-11-17.md` exists; primers are named for the day written). Its banner governs: the morning block, then `A-81` (the Ramsey-area watcher) and `W-17` (the newer-papers line on every constant page) as one reader batch before choosing the day's change. `git pull --ff-only` printed "Already up to date."; `git rev-list --count origin/main...HEAD` printed 0.
- Listener: `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0 (session start 16:25:56Z, relaunched by the session-start hook). Loop-tick armed by tool call; waker ladder ranks 1 to 3 launched at about 16:26Z, and rank 1 relaunched after its planned wake-shorten exit.
- Codex: GREEN per the kickoff's probe line (16:38:00Z, execute and write proved).
- CI, as of about 16:47Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each "1 completed non-scheduled success(es) for HEAD" at `2a60cfd`. No local full run of the battery: CI is cited at HEAD.
- Deployed-sha drift: NOTHING SWEPT for this lane; it publishes through GitHub Pages and declares no Render service. The fleet read printed "RESULT: PASS — 0 finding(s) across 38 service(s)", none of them this lane's.
- Harness: running 2.1.326 · fleet UNIFORM · installed 2.1.326 (SAME).
- Board: `update-david-board.mjs --list` returned 0 cards for this lane (positive control: `answered-cards.mjs` the same morning returned 3 portfolio riders from the same board: card `21ece8d9` deploy guard, card `2cf09a9d` draw page, card `3784317b` skylark-site leftover work, 0 new; none asks anything of this lane).
- Yesterday's recommendations (`docs/daily/2026-11-16-prelaunch.md`): [A] run `A-81` and `W-17`: executed (the two `--check` lines above). [B] `A-108`, ask the orchestrator first: carrying, the question is below in the packet. [C] the 3b DOI correction: carrying, outward and gated on adversarial review and David's word; not today's choice.
- Morning block reads: `npm run upstream` "0 transition(s) across 3 recorded report(s)"; `npm run traffic` as above; `open-pulls.mjs --fetch` 98 open; `render-constant-pages.mjs` wrote 120 pages (git status lists all 120; `git diff --numstat -- c/` counts 59 changed in content); `render-constant-pages.mjs --check` "RESULT: PASS — 120 constant page(s) match committed state (@ 87b4ebb)", exit 0 (it compares the working tree; `87b4ebb` is an upstream sha, it does not exist in this repo). <!-- pragma: allowlist sha (an upstream sha) -->
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` "no product-love cycle picks this lane today", exit 0.

### P1 selection packet

- **Outcome:** `W-17` (the newer-papers line on every constant page). A reader checking a constant sees a search of newer papers dated through today, not one that stopped 17 days ago.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a bound and a referee told me it had been improved. I had no way to know." The newer-papers line is the only place a constant page answers that question for work newer than the source table. Today it says "from 2026-09-26 to 2026-10-31".
- **Evidence:**
  - OBSERVED · `W-17`'s readCommand, this morning · the store reads `checkedThrough 2026-10-31 windowFrom 2026-09-26 papersFound 15`. Every constant page renders from it (`c/1a.html` in this morning's render: "On 2026-10-31 we ran one search ... from 2026-09-26 to 2026-10-31 ... It found 15 papers").
  - OBSERVED · `arxiv-watch.mjs --check --area constants --from 2026-09-26`, this morning · the window from 2026-09-26 to 2026-11-17 is COMPLETE over 19 papers and 19 verdicts. Its counts are quoted under What changed. 9 candidate bounds in 2 papers and 23 bounds the script cannot rank, or that lie within printed precision, are left for reading by hand.
  - OBSERVED · `scripts/newer-results.mjs:194-207` · the store already has a state for a comparison that isn't finished, `not-compared`, and the line then says neither stronger nor weaker. So the window can move today without asserting anything about the candidates.
  - HYPOTHESIS · that a reader trusts a dated search more when the date is recent. Judgment, not a measurement.
  - MISSING · any real reader's account. There is no `docs/evangelism-evidence.md`, and the page has no analytics (`A-59`).
- **Permission:** `W-17` is a standing lane row (open, owner bounds-ledger, no park, no card), and its onTrigger is this exact refresh: on COMPLETE, write checkedThrough, windowFrom and papersFound, re-render, commit, push, read `npm run served`. No code changes: the per-constant sentences come from the existing templates in `scripts/newer-results.mjs`, and the line went live on David's yes on cards `903a38ba` and `f64e9a3b` (10-30 and 10-31). Whether a `not-compared` sentence has ever rendered on a live page is UNREAD; P3 reads its rendered text and says what it says before push. A new `reported-stronger` entry, which names another paper on a public page, is outside today's change. It enters the store only after a person reads the paper, a cross-family claims pass and an adversarial review (`A-82`'s rule). Because the 1d precedent went to David by name, it goes to him on a card before it is switched on. Public, so the outward gate applies to today's change too: a read-only Codex round on the store edit and the rendered pages before push. No freeze covers `c/`.
- **Next action:** deliver built value. In `ledger/newer-results.json`: windowFrom 2026-09-26, checkedThrough 2026-11-17, papersFound 19, and a `perConstant` rebuilt from today's verdicts, with each constant's paper count taken from them. Constants whose stated bounds the script compared and none is stronger stay `none`. Constants touched by an unread candidate, or by a bound read by hand, become `not-compared` until they are read, except 1d, whose existing `reported-stronger` entry stands if the reading confirms it. Then re-render, `render-constant-pages --check`, the Codex round, push by sha, `npm run served`. Reading the candidates by hand is today's second leg, if time allows. The per-constant map is drafted by a script from `tmp/` verdicts, so no candidate detail is typed into a commit. First command:

  ```
  node C:/dev/skylark/bounds-ledger/scripts/newer-results.mjs --selftest
  ```

- **Acceptance condition:** after the Pages build, `https://u00dxk2.github.io/bounds-ledger/c/1a.html` contains "from 2026-09-26 to 2026-11-17" and "It found 19 papers". No page's line says a newer value is stronger unless that constant's entry is `reported-stronger` and a person has read it. `node scripts/newer-results.mjs --selftest` and `render-constant-pages --check` pass after the commit. `npm run served` reads every changed page SERVED.
- **Delivery and encounter checks:** delivery is the Pages build row for the pushed sha, `npm run served`, and a live fetch of `c/1a.html` and one constant page whose entry is `not-compared`. Encounter is blind: the page has no analytics (`A-59`), and GitHub Pages hands us no request log. The only arrival that can show up is an outside issue started through a page's "looks wrong?" link, counted by `npm run reports` and readable at N = 1. It is read on 11-21 beside `A-103` and `A-104`.
- **USER-FACING: yes.** Paths: `ledger/newer-results.json`, `c/*.html` (regenerated), `continuity/items.json` (`W-17`, `A-81`). Not `index.html`, not any script.
- **Standing obligation beside it, not the choice:** this morning's open pull request refresh (98 open; 59 pages changed in content, one read date each plus any new pull request). It is committed on its own on top of `origin/main`, gets a read-only Codex round, and is pushed by its own sha before the `W-17` commit, because both commits regenerate `c/`.
- **The `A-108` question for the orchestrator (asked by yesterday's banner), with what the code does today:** a constant id is not born in `extract-pins.mjs`. It is born one step earlier, in `reverify.mjs --snapshot`, which writes upstream's own tree paths into the mirror. The only filter is "starts with `constants/` and ends in `.md`" (`scripts/reverify.mjs:139-141`; the write is `:222`). `extract-pins.mjs` then takes each file's name stem unchecked (`:134`) and puts it into a claim's `id`, its fetch `url` and its `asserts` path (`:80-84`). Every renderer that lists constants reads those ids. My recommendation is to refuse a non-matching `^constants/[0-9]+[a-z]\.md$` path at the snapshot, before anything is written, so no consumer ever sees one. The renderer keeps its own refusal as the feed's boundary. A refusal at `--snapshot` is a reconcile signal, like the open-pulls ceiling, never a strip. The one existing guard of this shape is `scripts/anthropic-formal-math.mjs:88`. This is not today's change.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: 3 of 5 due. `W-13` (call the served-bytes check, expectedSignalBy 2026-11-17; it will run as today's delivery check anyway), `W-4` (prove every new detector both ways, nextCheckDate 2026-11-17), `W-8` (does an amended outward artifact go back to David, expectedSignalBy 2026-11-17). `A-81` and `W-17` are the day's work. `A-81` has its COMPLETE run, and its ledger fields and the Ramsey store's counts are recorded at the close. Also: `W-17`'s onTrigger should name `--from` (finding above). Read: `check-due-gates-dispositioned.mjs --snapshot`, "5 gate(s) due on/before 2026-11-17".
  - (b) owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger" (0 of 850).
  - (c) state reads marked CROSSED: none. Read: the kickoff's state reads (stale-actionable 0 of 30; missingLinkedCommits NOTHING SWEPT, 0 of 0).
- **Key number:** of the 120 constant pages, how many state a newer-papers search through today: 0 of 120 this morning (every page reads "to 2026-10-31", from this morning's render). Target 120 of 120 through 2026-11-17. It measures what the page states, not whether anyone reads it. This lane has no `docs/key-metrics.json`, so no hub number applies.
- **A prior-day retro finding that bears on the choice:** 11-16 Q5, "the P1 packet for any change to a public renderer gets a required line, inputs that reach the output, each with its origin". Today's inputs: the store's dates and counts (ours, from a script's output), the per-constant states (ours, derived from `tmp/` verdicts by script), and any paper link (an arXiv id upstream of us, which enters only through the gated `reported-stronger` path). No renderer code changes.

### Close

ACTION: COMPLETED · item W-17 (the newer-papers line on every constant page) · P3 bus `ad8113e8`

- **State since the P3 post:** none of the shipped state moved. `origin/main` is `8981246`. The manager's close review (`bus e09a0c1c`) fetched `c/1a`, `c/1d` and `c/3a` itself and read the latest Pages build as `8981246`, built 17:48:09Z. It named one wording slip, corrected above under What changed: 3a's value 1.193597 is equal within printed precision to the table's 1.19359680, not below it.
- **Ledger delta** (`continuity-edit.mjs`, 15 writes, each exit 0; `git diff -U0 -- continuity/items.json` shows only the clocks, notes, the one onTrigger append and the read stamps named here):
  - `A-81` (the Ramsey-area watcher): re-dated to 2026-12-01 on both clocks, two weeks per its onTrigger. Today's COMPLETE run is noted: 185 papers, 0 candidates. `ledger/ejc-ds1/arxiv-search.json`, which is dark, was not updated.
  - `W-17` (the newer-papers line): re-dated to 2026-11-24 on both clocks. The ship is noted, with the hand readings still owed. Its onTrigger gains a sentence: pass `--from <the store's windowFrom>` when the mirror's fetch date is later.
  - `W-4` (prove every new detector both ways): re-run on a quiet tree with `check-due-gates-dispositioned.mjs --run W-4`, exit 0 in 29316 ms, "59 workflow steps, piped steps pipefail-guarded; 51 self-tests present in CI", last line "reverify.test: PASS". Re-dated to 2026-11-24 on that stamp.
  - `W-13` (call the served-bytes check): re-dated to 2026-11-24 on both clocks. The note cites today's delivery read ("120 checked — 120 served"), not the helper's in-flight one.
  - `W-8` (does an amended outward artifact go back to David): re-dated to 2026-11-24. The note records the second empty window.
  - `A-108` (the narrower feed): the orchestrator's answer, "both", is noted with its acceptance test.
- **Hygiene draft** (the helper's file, in git-ignored `tmp/`; its lines are reproduced here): 2 lines, 0 accepted, 2 amended, 0 rejected. `W-13` AMEND: same date, set with `--set` on both clocks instead of the drafted `--extend`, which mints fields. The note cites the served read of `8981246` taken after the in-flight window. `W-8` AMEND: same date by `--set` on its one clock, and its UNDECIDED clause resolved by surfacing the empty windows in the findings above. Not drafted: `W-4`, handled above. READ-MUTATED, quoted: "READ-MUTATED W-4 ledger/newer-results.json — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks". It was my own `W-17` store edit (status `d078c59c`). Checks: wait-justification "RESULT: PASS — 2 of 131 row(s) carry `waitJustification`; 0 warn / 0 info"; engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable".
- **Due-gate verification:** `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." with the snapshot CURRENT (taken 2026-11-17, 5 rows).
- **Receipt:** unchanged from P3 (`bus ad8113e8`): `89812469`, encounter blind (`A-59`, encounter on the public pages is blind).
- **Pending reads:** `A-103` (the README's visitor command), `A-104` (phone search answer line) 2026-11-21; `A-45` (stale-value resolvability), `A-91` (67a's withdrawn preprint) 2026-11-22; `A-108` 2026-11-23; `W-4`, `W-8`, `W-13`, `W-17` 2026-11-24; `A-78` (OpenAI's math release), `G-4` (an outside party acts on a watched record) 2026-11-30; `A-81` 2026-12-01.
- **Committed with this close:** this report, the primer `docs/cold-starts/2026-11-17.md`, `continuity/items.json`, `continuity/traffic.json` and the read-output stamps (`W-4`, `W-8`, `W-13`).

### Round 2 selection packet (design and copy pass)

A second kickoff arrived at 21:56Z (bus `16560d24`), after the close above: a design and copy pass across the lanes. Its first phase replaces the usual work list. It ships nothing a visitor sees.

- **Outcome:** no ledger item. The pass's bar: a blind reader shown before and after frames picks "after" as the professionally designed one, and after five seconds on the first screen can say what the product is and why they would use it. This phase delivers before frames, a product brief, a design brief and draft copy.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a number. I have no idea if it's still the current one." The cold audit of 2026-11-15 in that file is the evidence this pass acts on: the shown bound is a raw table row about 70 words long, and several hundred words of caveats sit around the table.
- **Evidence:**
  - OBSERVED · the six before frames, live site, logged out, captured 2026-11-17 at 1440x900 and 390x844 · `docs/design-pass-2026-11-17/before/capture-log.json` records status 200, 120 rows, and for the search "sofa" 2 visible rows, for "qqqq" 0 rows with the empty panel shown.
  - OBSERVED · on the 1440 first screen the first entry's upper-bound cell fills the column with a pipe-delimited row and raw LaTeX (`first-screen-1440.png`). On the 390 empty state the panel's first two paragraphs fill the screen below the controls (`flow-empty-390.png`).
  - HYPOTHESIS · that a calmer first screen makes a stranger understand the page faster. No reader has been observed.
  - MISSING · any real reader's account; the page has no analytics (`A-59`, the row saying nothing can see an arrival there).
- **Permission:** the lead says David approved the pass in chat at about 12:00 MT. That lead carries no source row, so I could not re-read his words; I proceeded because this phase changes nothing a visitor sees. The round's rule holds: nothing on the page changes without his pick.
- **Delivered in this phase:**
  - Before frames, six PNGs under `docs/design-pass-2026-11-17/before/`: `first-screen-1440.png`, `first-screen-390.png`, `flow-match-1440.png`, `flow-match-390.png`, `flow-empty-1440.png`, `flow-empty-390.png`, with `capture-log.json`. One heavy-job admit, "admitted after 35m48s in queue".
  - `docs/PRODUCT.md` and `docs/DESIGN.md`.
  - `docs/design-pass-2026-11-17/copy.md`: five headlines with three kept, a two-sentence subhead, the call to action, one empty state and one error state rewritten.
  - Registry row, posted on the bus (`f7c7ade0`): a printed handbook of mathematical tables with errata slips; Palatino from the reader's device; 2px radius.
- **Review:** three read-only Codex rounds (banner workdir checked each time) on the three written files. All three returned "VERDICT: FIX FIRST". Round 1 refuted nine of the thirteen visitor sentences: the draft turned a lookup in a published snapshot into a verdict on a number. Round 2 held seven and refuted three, for promising a change date on rows that carry only the date tracking began. Round 3 held eleven and refuted two headlines, for promising a date where the page can show "date unknown"; it found no disclosure and no refuted sentence in `docs/DESIGN.md`. I adopted the reviewer's narrower wording each time and stopped there: the last edits are unreviewed, the copy file says so, and **the commit is local, not pushed**, because this repository is public and no round returned a ship verdict. The same fault class came back three rounds running (a short sentence about the page leaves out a state the code has), so the build phase should take visitor sentences from the reviewer's wording, not write new ones.
- **Three things this lane does differently from the brief, each needing the orchestrator's eye:**
  - No font file. The index page's self-test rejects any `url(` or `@import` in its stylesheet ("the index stylesheet must load nothing"), so a self-hosted face would fail it. The design uses device faces. Changing that guard is not mine to decide.
  - The "flag" is a renderer mode that writes variants to a scratch folder, never a switch in the published page, because every push to main publishes. That mode does not exist yet and has to fail closed: Codex read that an unrecognised renderer argument can fall through to writing `index.html`.
  - A third type family survives as an exception: the system monospace face, for exact pinned strings only.
- **A fault on the live page, found by the review, not caused by this pass:** the empty state's issue draft is pre-titled "Constant not tracked", which a search that found nothing cannot support. Not fixed here; a hygiene input.
- **Next action (the build phase, after the manager's review):** improve. Build the fail-closed scratch render mode first, then three first-screen variants from three composition families. First command:

  ```
  node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
  ```

- **Acceptance condition for this phase:** six before frames committed; every product fact in the copy on the Known list of `docs/PRODUCT.md`; the world and display face absent from the live registry; scope held to the first screen and the search flow; `index.html` unchanged (`git status --porcelain` lists no tracked file).
- **Delivery and encounter checks:** none in this phase. Nothing is delivered to a visitor.
- **USER-FACING: no.** Paths: `docs/PRODUCT.md`, `docs/DESIGN.md`, `docs/design-pass-2026-11-17/` and this report. No page, script or ledger file.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none — read `check-due-gates-dispositioned.mjs --print`, "0 gate(s) due on/before 2026-11-17".
  - (b) owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger" (0 of 850).
  - (c) state reads marked CROSSED: none — read the kickoff's state reads (stale-actionable 0 of 30; missingLinkedCommits NOTHING SWEPT).
  - Added by this phase: the "Constant not tracked" issue title above.
- **Build phase, same day:** three variants were built behind a scratch-only generator, the blind pick chose variant c (the table set as a handbook page; all six swapped verdicts agreed), and its after frames and a like-for-like before set are committed. The record, with the frames, checks, claims pass and known gaps, is `docs/design-pass-2026-11-17/selection.md`. `index.html` is unchanged and no visitor sees a change; the variant goes live only on David's pick.
- **Round 2 close.** ACTION: COMPLETED · item A-110 (the design-pass first-screen candidate) · P3 bus `81c4e364`
  - **Push state, the one thing this close must record:** `7b0743e` and `87618fd` are on `origin/main`. `9ebb7a4` (after frames, generator, record), `1b966ee` (review fixes) and this close's commit are LOCAL ONLY. The orchestrator's review (bus `a6df145d`) says the push ruling is its own and had not made it. Because a push of any later commit carries the earlier ones, this close is committed and NOT pushed. **The variant stays off until David picks.**
  - **Brand blue:** the after first screen shows none at rest, and that is not intended. `docs/DESIGN.md` puts the accent on the search field; the build gave the field an ink border and kept blue for its focus ring only. Recorded on `A-110` as owed before the page change.
  - **Codex calls for round 2: 11** (three claims rounds on the briefs, six blind judge runs, one claims pass on the variant, one review of `9ebb7a4`). My build-phase post's body said 12; 11 is right.
  - **Ledger delta:** two rows minted with `continuity-edit.mjs --mint`, each "UNALLOCATED across 1 file(s)" before the write: `A-109` (the empty-search issue title, 2026-11-24) and `A-110` (the candidate, 2026-11-19).
  - **Hygiene draft, round 2:** 1 line, 0 accepted, 1 amended, 0 rejected. The helper proposed a new row and drafted no command; I minted it as `A-109` with its four close conditions. READ-MUTATED: "none — 0 reads guarded". Checks, quoted: "RESULT: PASS — 2 of 131 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)" and "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable".
  - **Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned.", snapshot CURRENT (taken 2026-11-17, 5 rows).
  - **Receipt:** unchanged from the build-phase post: none, no visitor sees a change.
  - **For the design-pass notes.** About 126 lane-minutes from the kickoff's arrival (about 15:00 MT) to the build-phase post (17:06 MT). Heavy-job queue waits, quoted from its own lines: "admitted after 35m48s in queue", "29m42s", "4m56s", "9m36s"; about 80 minutes in all, most of the round. What cost time: the queue, and four claims rounds that each found one more state the short copy left out. What I would cut: write visitor sentences from a helper's list of what the code does before the first review, and give a public lane its frame-publishing rule at kickoff.
  - **Pending reads:** `A-110` 2026-11-19; the morning close's list is unchanged, plus `A-109` 2026-11-24.
- **Machine notes for the round:** `scripts/heavy-gate.mjs` does not exist in skylark-site; the queue tool is `C:/dev/manager/shared-tools/heavy-gate/heavy-gate.mjs`. The registry file was absent from the shared checkout at 15:00 MT and readable from `origin/main` by 15:30 MT.

### Round 3 selection packet (design rollout)

A third kickoff arrived at 04:42Z on 11-18 (bus `bcea28cd`, round 3): the design rollout on David's pick. Its P1 replaces the usual work list.

Round 3 (overnight design rollout), rail day 2026-11-17. P1 covers brief steps 1 and 2, plus the plan for steps 3 to 6. Nothing is committed, pushed or rendered into index.html in this phase.

- **Outcome:** A-110 (the design-pass first-screen candidate, variant c: the table set as a handbook page). By morning a visitor to https://u00dxk2.github.io/bounds-ledger/ sees variant c, with the four turn-on defects fixed. Every other user-facing surface is either in the same system or listed in docs/SCREENS.md as DONE, NEXT or HOLD.
- **The user problem, in the user's words** (docs/evangelism-bar.md): "I cited a number. I have no idea if it's still the current one." The 2026-11-15 cold audit found the first screen buries that answer under raw table rows and several hundred words of caveats.
- **Evidence:**
  - SUPPLIED · David's pick: the rollout brief (skylark-site docs/specs/design-rollout-brief-2026-11-17.md) says 23 of 23 pairs went to the redesign, read back 21:21 MT, and quotes his 21:30 MT go. That file is the orchestrator's record. It names no board card and I have not re-read his words myself. The kickoff lead carries no source row.
  - OBSERVED · docs/design-pass-2026-11-17/selection.md: variant c won six of six swapped blind runs; 0 findings from the design detectors; layout shift 0. A second narrow claims round after the last edit returned SHIP.
  - OBSERVED · four defects recorded as turn-on conditions on A-110: (1) no brand blue on the search field at rest. The variant gives it an ink border (design-variants.mjs:34), while DESIGN.md "Colour" puts the accent on the search field. (2) The Android serif fallback is unmeasured. (3) The phone cell labels are still uppercase and tracked (render-site.mjs:937, `td[data-label]::before`; the table head at :875 is overridden by the variant's CSS). (4) A claims pass is owed again if any visitor sentence is edited after the SHIP.
  - OBSERVED · the variant does not exist in the renderer. design-variants.mjs transforms buildIndexHtml()'s string into git-ignored tmp/. `npm run check` runs `render-site --check`, so a hand-edited index.html would go red. Shipping means porting the transform into scripts/render-site.mjs.
  - OBSERVED · git: 5 local commits past origin/main commit `87618fd` (`9ebb7a4`, `1b966ee`, `86be013`, `7aed72c`, `2afb255`). The lead names four; commit `2afb255` is the primer, doc-only. CI on commit `87618fd` is GREEN per the kickoff (3 successes, 0 failures).
  - MISSING · any real reader's account. The page has no analytics (A-59).
- **Step 2, dated reads: one disagreement with the lead.** The lead says none of my dated rows watches the first screen. A-104 does: it is the phone answer line directly under the search box, 2026-11-21, and its readCommand is `npm run reports`. Taken early, read early at 21:54 MT because the variant goes live tonight; the window was 2026-11-15 (A-104's ship, commit `57ca289`) to now. Output: "raw issues fetched: 37 … OUTSIDE ARRIVALS: 0 … parts reconcile: 37 + 0 + 0 = 37", exit 0. A-104 is readable at N = 1 and n = 0, so this is UNREADABLE-EARLY, n=0. P3 writes this into the row, and from tonight the next read is the variant's own baseline. A-103 (the README's visitor command) is not on a screen this rollout changes, because the README stays as it is (see the plan). A-109 (11-24): the "Constant not tracked" issue title is not renamed, because the arrival counter reads its prefix. A-108 (11-23): unaffected.
- **Permission:** A-110 is an open lane row whose closeWhen is "David picks and the page change ships". Per the kickoff, the orchestrator has lifted its no-push ruling (bus d36b6487) on David's pick. The outward gate binds: a claims pass, cross-family review and CI before anything is published. No auth, payment or account screens exist (static page, no sign-in).
- **Next action: deliver built value.** Plan for P3, in the brief's order:
  1. **Fixes first** (a), (b) and (c), applied in the port, not in the tmp generator:
     - (a) the search field's at-rest border becomes the accent `var(--accent)`, with focus kept as a 2px ring. Checked for AA contrast in both schemes.
     - (b) an emulated Android render at 390: the named faces stripped so the stack falls to generic `serif`, as Android does, where that resolves to Noto Serif. The frame is committed, with the face that rendered as read back by the browser. An emulation, labelled as one.
     - (c) the phone labels lose uppercase and tracking: sentence case, text face at 600.
     - (d) a claims pass only if any visitor sentence changes. None is planned, since (a) to (c) are CSS.
  2. **Port with a build-time flag:** a committed constant in scripts/render-site.mjs, `FIRST_SCREEN = "classic" | "handbook"`, with no query string, cookie or client script. Selftest both answers: classic reproduces today's index.html byte for byte; handbook carries the variant markers. The flag is read on the renderer's existing guards (no url(), no @import).
  3. **Gates:** a Codex claims pass on every visitor sentence of the handbook render, then a cross-family Codex review of the diff (read-only, banner workdir checked, each finding dispositioned), then CI green on a PR branch into main (pull_request runs reverify.yml and page-check.yml).
  4. **Two pushes:**
     - PUSH 1 carries the 5 held commits, the port with the flag OFF and the fixes. index.html stays byte-identical, and a signed-out GET shows today's page.
     - PUSH 2 sets the flag ON and regenerates index.html. A signed-out GET shows the variant, and frames of the live first screen at 1440 and 390 are committed.
     - Rollback, tested once: the flag set back to classic, re-render, push, a GET shows the old page, then back on.
     - The orchestrator's eye is needed here. The lead says the held commits go "in ONE push" with the page change, but brief step 3 orders merge-OFF before flip-ON, which is two pushes. Since David has picked, the frames going public a few minutes before the page is harmless, so I default to the brief's two pushes. Nothing unrelated rides either push. Overrule at review if one push is meant.
  5. **Dead weight:** delete tools/design-variants.mjs, which holds variants a and b and is the preview path. selection.md gains a one-line note that the generator was retired into the renderer at <sha>. No unrendered CSS stays in index.html, because the port carries only the shared CSS and c's.
  6. **docs/SCREENS.md**, built from the renderers and the tree, then walked. Proposed status after tonight:
     - index.html first screen and search flow (match, empty, near-miss, the A-104 answer line): DONE in push 2.
     - Batch 1, ramsey.html (scripts/render-ramsey.mjs): tokens and type only, no copy change. DONE tonight if it clears its own review.
     - Batch 2, c/*.html ×120 (render-constant-pages.mjs): tokens and type only, no copy change. DONE tonight if review clears, otherwise NEXT 11-24.
     - Batch 3, copying.html: tokens only.
     - README.md (GitHub-rendered, so voice only): NEXT 11-24, because it is claims-heavy and A-103's outcome read is open to 12-14.
     - The empty-search and "looks wrong?" issue drafts: HOLD on A-109 (11-24).
     - CI-filed drift issues: HOLD, because the alarm's stdout is a public surface and a wording change is a separate review.
     - The GitHub Pages 404: UNREACHED-ours (GitHub's default page; the repo has none).
     - docs/** served whole: listed, not a designed screen.
     - No email, sign-in, payment, settings or share image exists. Confirmed in P3 by a grep for og:image and mailto in the renderers.

  First command:

  ```
  node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
  ```

- **Acceptance condition:** after push 2's Pages build, a signed-out GET of https://u00dxk2.github.io/bounds-ledger/ contains `<p class="mast">Bounds Ledger</p>` and "Browse all", and the search input's computed at-rest border colour is the accent. On the 390 frame the cell labels are not uppercase. `render-site --check` and `npm test` pass after the commit, and CI on main is green. Rollback was proven once. docs/SCREENS.md exists with DONE / NEXT / HOLD counts.
- **Delivery and encounter checks:** delivery means the Pages build row for each push tip, `npm run served`, and a live fetch of index.html plus each restyled page. Encounter is blind (A-59). The only visible arrival is an outside issue counted by `npm run reports`, readable at N = 1; the variant's baseline is the early read above (0 of 37).
- **USER-FACING: yes.** Paths: scripts/render-site.mjs, index.html, scripts/render-ramsey.mjs, ramsey.html, scripts/render-constant-pages.mjs, c/*.html, copying.html (and its renderer if it has one), docs/SCREENS.md, docs/design-pass-2026-11-17/ (frames and the tool's deletion), continuity/items.json (A-110, A-104).
- **Inputs that reach the output, each with its origin** (from the 11-16 Q5 retro finding):
  - The headline count `n`: ours, counted from rendered rows.
  - The masthead, headline, label, placeholder, "Browse all" and empty-state sentences: ours, claims-passed.
  - The empty state's issue href: ours, already on the live page.
  - The ramsey and constant page text: unchanged.
  - Upstream text reaches only through the existing pins and cells, which this rollout does not touch.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none. Read check-due-gates-dispositioned.mjs (verify leg): "5 gate(s) were due at Phase 0 … verdict: CLEAR"; all 5 (A-81 (the Ramsey-area watcher), W-13 (call the served-bytes check), W-17 (the newer-papers line), W-4 (prove every new detector both ways), W-8 (does an amended outward artifact go back to David)) were already re-dated at today's first close. A re-snapshot was refused with exit 2, as designed.
  - (b) owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger" (0 of 850).
  - (c) state reads marked CROSSED: none. Read: the kickoff's state reads (stale-actionable 0 of 30; missingLinkedCommits NOTHING SWEPT, 0 of 0).
- **A prior-day retro finding that bears on the choice:** 11-16 Q0, "a renderer change to the public page died at Codex round 3 on one class, upstream-controlled text reaches what we publish". Hence the inputs line above. The port adds no new input path.
- Codex calls in P1: 0 (a reading phase; the kickoff carries a GREEN probe).

### Round 3 review log

Every round below is Codex, read-only, foreground pipe, banner `workdir: C:\dev\skylark\bounds-ledger` checked before reading, model `gpt-6.2-sol`. Each was pinned to its head commit by sha.

- **Round 1, commit `6e82d48`** (the port, flag OFF): claims table marked HOLDS on the masthead, headline, label, placeholder, "Browse all", and each empty-state sentence. Diff verdict FIX FIRST, six findings, all CONFIRMED and fixed in commit `57f233e`: unpicked copy left in `copy.md` and `selection.md`; `SCREENS.md` wording; a nested block could half-replace the empty state; the selftest did not drive `buildIndexHtml` or click Browse; resource markup and non-CSS comments unguarded; Browse visible without scripts.
- **Round 2, commit `57f233e`**: FIX FIRST. The same class came back (HTML shapes slipping past a matcher over the rendered page), so the matcher was deleted and `renderHtml()` now chooses the handbook markup in its template (commit `da45cba`). The other findings were fixed: the Browse event order, the wrapper check, an allowlist resource guard, `.browse[hidden]`, the `cli()` wiring, doc wording.
- **Round 3, commit `da45cba`**: every round-2 code item FIXED; the classic branch reproduces the pre-rollout template; the handbook branch matches the retired transform. Open items: one Low (an empty handbook render printed "0 constants"), guard-limit notes it called unreachable from today's code, and doc wording. Inventory prose had now been refuted three rounds running, so `SCREENS.md` was cut back to naming each state and pointing at the code that defines it. The Low and the `PRODUCT.md` and `copy.md` sentences were fixed in the next commit.