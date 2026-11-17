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
