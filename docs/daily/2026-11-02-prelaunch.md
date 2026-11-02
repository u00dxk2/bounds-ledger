---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: read
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-02
lifecycle_stage: launched
last_deploy: 4945a481e6 (CI GREEN at the kickoff read; GitHub Pages lane, no Render service)
on_hold_items: 0
top_action_today: tell the Ramsey page's reader what a dated arXiv search since the survey's revision found, in place of "not covered"; plus A-92's OpenAlex run at or after 17:00 MST
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-02 (Monday, MT)

## BLUF

The Ramsey page tells a reader it does not cover anything published after the survey's last revision. We do search arXiv for newer Ramsey papers, but the page never says so. Today's search screened 169 papers and found none that improves on a value the page shows. A dated paragraph saying so is built and switched off, and David's card asks whether to turn it on.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** `A-81` (the newer-result watch for the Small Ramsey Numbers area), on `ramsey.html`. The page's coverage paragraph says "Not covered: everything else in the survey, … and any result published after revision #18." (not David's words). The watch has searched arXiv for exactly that since 2026-10-15, and nothing on the page says so. Add one dated sentence stating the search's window, how many papers it read, and how many state a bound stronger than a value the page shows. This is the Ramsey counterpart of the constant pages' newer-papers line, `W-17` (the newer-papers watch).

**The user problem, in the user's words:** "I cited a bound and a referee told me it had been improved. I had no way to know." (`docs/evangelism-bar.md`.) A combinatorialist about to cite R(5, 5) ≤ 46 gets the survey's value here, and then a line saying anything newer is out of scope. A dated "we searched these months of arXiv and found none" is the bar's third label, "a believable nothing to see here".

**Section 0.**
- Primer: `docs/cold-starts/2026-11-01.md`, read whole (no 2026-11-02 primer; primers are named for the day they are written). Its banner names the five gates due today and `A-92`'s OpenAlex run, once, at or after 17:00 MST.
- Listener: 🟢 SSE alive (restart marker 2026-11-02T14:47:05Z, pid 46732, with `hello` and `replay-complete` below it). The loop is armed by `ScheduleWakeup` tool calls, and waker ranks 1 to 3 are running (rank 1 was relaunched after its wake-shorten fire).
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, machine-level exec at 14:49:31Z).
- CI: GREEN at `4945a481e6` for reverify.yml and page-check.yml (`check-ci-status.mjs --workflow <file>`, each "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending"). No local full gate was run; CI at HEAD is cited instead.
- Deploy drift: `check-deployed-sha-drift.mjs` exit 0, "0 finding(s) across 38 service(s)". This is a GitHub Pages lane with no Render service, so the read sweeps nothing of ours: neither a stop nor a pass.
- Harness: running 2.1.316 · fleet UNIFORM (29 of 29 panes) · installed 2.1.316 (SAME).
- Recs yesterday: none (the 11-01 report's Recommendation section reads "None for David yet").
- Prior-day retro: 10 still-on-discipline findings. The one that bears on today: Q2, run a fresh claims pre-pass over the first wording before Codex r1. It applies to the new page sentence and is planned in below.

**Evidence** (each read today, 2026-11-02 MT):
- OBSERVED · the committed `ramsey.html`, line 41 · the coverage paragraph quoted above; the page has no other statement about results after revision #18. Grep for "arXiv" found 2 hits outside it, both in depth-audit notes on single entries.
- OBSERVED · `node scripts/arxiv-watch.mjs --fetch` · "RESULT: FETCHED — 169 paper(s)", window "submitted 2026-04-24 to 2026-11-02, UTC dates (from revision 18 of the survey…)", query `cat:math.CO AND abs:Ramsey`, exit 0. The list is in `tmp/` and is not committed.
- OBSERVED · a comparison of today's list with the 2026-10-16 run's (`tmp/arxiv-watch/2026-10-15-r2/`), by a scratch script over both `papers.json` files · 149 of today's 169 papers carry the same id and version as a paper that run read; 20 are new. So the reading owed is 20 papers, and the 149 earlier verdicts apply unchanged.
- OBSERVED · `A-81`'s row, `firstRun2026_10_15` · 149 papers, 149 verdicts, `--check` COMPLETE exit 0: claims-a-better-bound 0, mentions-only 10, unrelated 139. Positive control: Angeltveit and McKay's arXiv 2409.15709v2 matched the R(5, 5) ≤ 46 row at the value the survey gives.
- HYPOTHESIS · the 20 new papers also hold no stronger bound. If one does (`--check` exit 1), that candidate is unverified, stays in `tmp/`, and the sentence is not built until a human reads it.
- OBSERVED · `npm run reports` (through `--run G-4`) · "raw issues fetched: 37 … OUTSIDE ARRIVALS: 0 … parts reconcile: 37 + 0 + 0 = 37". The 0 is expected at this traffic level; it does not show that nobody reads the pages.
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today … run the normal P3", exit 0.
- OBSERVED · `check-due-gates-dispositioned.mjs --snapshot` · "snapshot written — 5 gate(s) due on/before 2026-11-02" (`A-2`, `A-77`, `A-78`, `A-81`, `G-4`).
- MISSING · any real reader's word on the Ramsey page. There is no evidence ledger and no identified reader. The pick rests on the bar's coverage threat and on the page's own sentence.

**Permission:** `A-81` is open, not parked, waiting or frozen. Its onTrigger puts any rendering on `ramsey.html` behind the adversarial review and David's approval (the outward gate). So the sentence is built dark, gets a fresh claims pre-pass and then Codex code and claims rounds, goes to David on a card, and goes live only on his yes. David's 2026-09-20 freeze on `ramsey.html` was lifted when the rebuild landed (2026-10-15, `b167f64`).

**Next action:** improve (a reader-facing sentence), with the due read as its input. Prep, now: read the 20 new papers to `docs/arxiv-watch-reader-brief.md`, merge them with the 149 earlier verdicts into `tmp/arxiv-watch/2026-11-02/verdicts.json`, and run `--check`. In P3: a small committed store (window start, window end, papers read, the count stating a stronger bound), written only on `RESULT: COMPLETE`. `render-ramsey.mjs` renders the sentence from it, and `--check` refuses a store that disagrees with the page. Red-arm it: store present → sentence, absent → today's page byte-identical, malformed → refused. First command, the read:

```
node C:/dev/skylark/bounds-ledger/scripts/arxiv-watch.mjs --check
```

**Acceptance condition:** on David's yes, the live `ramsey.html` carries the dated sentence once, with the window and counts that `--check` printed today, and no other page changes. `render-ramsey.mjs --check` passes on the committed file, and `npm run served` reports `ramsey.html` SERVED.

**Delivery and encounter checks:** delivery = `npm run served` after the push. Encounter = blind (`A-59`): the pages carry no analytics. The only countable event is a report filed through an entry's own link, counted by `npm run reports` and readable at N = 1 (0 outside arrivals of 37 raw today).

**USER-FACING:** yes · `scripts/render-ramsey.mjs`, a new store under `ledger/ejc-ds1/`, `ramsey.html` (re-rendered), `continuity/items.json`, `docs/daily/2026-11-02-prelaunch.md`.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice, 4, each run through `--run <ID>` this morning:
  - `A-2` (the drift-resolution log): "No drift. 121 files match upstream 87b4ebbd426ff8db597a2004cc45da17903bdcf2." (an upstream sha; it does not exist in this repo), exit 0. The upstream sha moved since 10-26 and the file count did not; that is not a catch. pragma: allowlist sha
  - `A-77` (the filed-report check): exit 1, "UNRECORDED — issue 289 is ours and has no baseline row." Issue 289 is the 87a question watched by `W-16` (the watch on upstream issue 289). Its baseline row is owed.
  - `A-78` (OpenAI's math release map): "373 of 373 families at openai/math@4eaee87 (an upstream sha) … rendered 13", "RESULT: VALID (exit 0)". pragma: allowlist sha
  - `G-4` (an outside party acts without us filing): 0 outside arrivals of 37 raw, quoted in the evidence above.
- (b) owed child rows: none. Read: "Rows owed to you in skylark-site's ledger: NONE".
- (c) CROSSED state reads: none. Read: dated gates 5 (owed, listed in (a) plus `A-81`, the choice), HEAD CI GREEN, queued rows 0, stale-actionable 0 of 27, missingLinkedCommits nothing swept.
- Also, not a gate: `A-92`'s OpenAlex frame run, once, at or after 17:00 MST, per the primer banner.

## What changed

<!-- findings:begin -->
- **The search's end date was not the day we read arXiv.** The fetch ran at 15:04Z on 11-02 and its newest paper was submitted on 30 October, because arXiv lists a paper only once it is announced. A fresh claims pass caught "up to 2 November" before Codex saw it, so the page states the listing date and the newest submission separately. It also narrowed two clauses: "beyond the arXiv search" became "apart from the arXiv screen", and "stronger than a value shown here" became "improves on, or contradicts, what this page shows for the same R(k, l)". The second matters where Table Ia and Table Ib print different upper bounds.
- **Our second report on 87a cannot be recorded without a code change.** `A-77` (the filed-report check) wants a baseline row for issue 289. Adding it broke a `reverify.test.mjs` assertion, because two consumers each assume one report per upstream file: `reportFor()` in `scripts/render-site.mjs:156` keeps the FIRST (so the public 87a row discloses issue 150, "closed", and never issue 289), and `filedReports()` in `scripts/reverify.mjs:186` keeps the LAST. The row was taken back out the same hour. So the public 87a row says we reported it and that the report is closed, while a newer report of ours on the same row is open. That is a public-page gap, carried to the close as a new item, not fixed today.
<!-- findings:end -->

- P1 read the five due gates and ran the Ramsey watch: 169 papers, `--check` "RESULT: COMPLETE — no candidate (exit 0)".
- `586770d`, `8fe8abd`, `af44812`, `9418f5d`, `fb8fc5d` (pushed): `ramsey.html` can carry a dated paragraph stating that screen, rendered from `ledger/ejc-ds1/arxiv-search.json`, which ships with `"render": false`, so no page changed (`render-ramsey.mjs --check` PASS). CI: reverify.yml and page-check.yml each GREEN at `fb8fc5d`.
- Codex, four rounds, read-only, banner workdir checked each time. r1: claims every clause HOLDS; code DO NOT SHIP (completeness not gated, absence read as dark, CSS or ancestor hiding). r2: DO NOT SHIP (other note-box prose could claim a screen; a date that throws). r3: DO NOT SHIP (the table's survey id is free text in the note box). r4: SHIP WITH FIXES, one comment NIT, fixed in `fb8fc5d`. Three rounds found the same class, prose a check cannot read, so the guard now claims less and the class is a declared ceiling in the script header. Five mutations were red-armed; each failed the check it targets and was restored from a hashed backup.
- David's card `42e3d6c8` is filed (needs-decision msg `c6060c9b`). The switch-on is one store field, a re-render and a push, on his yes.
- `A-95` (the 87a row discloses our closed issue 150 and not our open issue 289) minted. `A-81` carries the run in `run2026_11_02` and is re-dated to 2026-11-16.

## Inputs (controllable)

- None yet.

## Outputs (lagging)

- `npm run reports`: 0 outside arrivals of 37 raw issues (read 2026-11-02).

## Recommendation

- None for David yet.

## On hold pending data

- None.

## State Appendix

Written at the close from live commands. The close commit itself cannot appear here.

- HEAD before the close commit: `7800321`, on origin/main (`git log -1` at the close). CI at `7800321`: reverify.yml "GREEN — 1 completed non-scheduled success(es) for HEAD" (`check-ci-status.mjs --workflow reverify.yml`). page-check.yml green at `fb8fc5d`, the last commit that touched code.
- Served: not read today. No page changed: `render-ramsey.mjs --check` "RESULT: PASS — ramsey.html matches the committed table", and the store ships `"render": false`.
- Due gates: `check-due-gates-dispositioned.mjs` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-02).

## Close

ACTION: DEFERRED — the Ramsey arXiv-screen paragraph is built and switched off; going live needs David's yes · trigger David's answer on card 42e3d6c8 (needs-decision msg c6060c9b) · item `A-81` (the Ramsey newer-papers watch) · P3 fe31c1a3

- The acceptance in force at P3 ("store, renderer and sentence built dark, claims pre-pass, Codex rounds, David card", the manager review) was met; the manager review of P3 read the live ramsey.html at Pages build `7800321` and found none of the paragraph's words on it. The switch-on is the deferred part: on David's yes, set `render` true, re-render, push, then `npm run served` and a live fetch as the delivery proof. If more than two weeks have passed since 2026-11-02, re-run the watch and update the store first.
- Ledger delta: `A-2`, `A-78` re-dated to 2026-11-09 and `G-4`'s expectedSignalBy to 2026-11-09 (hygiene draft, accepted). `A-77` (the filed-report check) re-dated to 2026-11-05, not 11-09 (amended: its baseline row waits on `A-95`), with the read in `read2026_11_02`. `A-81` re-dated to 2026-11-16 with `run2026_11_02` and `switchOnDeferred2026_11_02`. `A-95` (the 87a row discloses our closed issue 150 and not our open issue 289) minted, re-check 2026-11-05.
- Hygiene draft: 4 lines, 3 accepted, 1 amended, 0 rejected. Its checks: wait-justification "RESULT: PASS — 1 of 114 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)"; engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)". READ-MUTATED: none, 0 reads guarded (the reads ran before the helper did).
- Pending reads: `A-92`'s OpenAlex frame run, once, at or after 17:00 MST today (00:00 UTC), with its figures going into "Next steps" item 2 of `docs/decisions/2026-10-30-A92-eth-dependence-area-design.md`. Not run at this close (about 10:35 MST); the evening close records whether it ran.
- Classification of today's findings, one sentence of human judgment: both are instrument-facing (our own search's stated end date and our own disclosure renderer), no catch was counted, numeric or byte-only (A-2's read: "No drift."), and the running count of consecutive instrument-facing days is at least 3, counted by hand (the 10-31 report said "at least one" and the 11-01 report said the run continues).
- The standing prediction, quoted from CLAUDE.md: "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." Not tested today: there was no catch.
