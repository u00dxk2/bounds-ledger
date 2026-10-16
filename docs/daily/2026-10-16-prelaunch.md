---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-16
lifecycle_stage: launched
last_deploy: b010346 (HEAD at the 10-16 kickoff)
on_hold_items: 1
top_action_today: newer-result watcher for the mirrored optimization constants (the A-81 watch, second area)
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-16 (Friday, MT)

## BLUF

The new-paper watch now covers all 115 optimization constants, and its first run flagged three numbers that look better than our pages show.
None is checked yet; they stay private until someone reads each paper's construction.
Four more constant pages now say whether their cited source was read and what it showed.

## What changed

### Day round — P1 selection packet

**Recap of the 10-15 night P3 (bus msgId b2553167), which no manager review reached:**
1. `A-81` shipped `scripts/arxiv-watch.mjs`: it fetches the math.CO papers whose abstract says "Ramsey", submitted since the survey revision `ramsey.html` mirrors (2026-04-24).
2. Reading agents record what each paper states. The script, never the reader, decides whether a stated bound is stronger than the value the page shows (the smaller of Table Ia's and Table Ib's upper bound).
3. First run: 149 papers, 149 verdicts, 0 claims-a-better-bound, 10 mentions-only, 139 unrelated. Positive control 2409.15709v2 matched [AnM4] at 46.
4. Three Codex rounds (`3815d1c`, `d732e8d`, `1de85b0`). The output was rebuilt as fixed lines pinned exactly, instead of a search for forbidden text. Selftest: 53 cases.
5. Nothing renders and nothing goes upstream. Candidates stay in `tmp/` by operator rule. Next read is 2026-10-29.

**Outcome:** the same newer-result watch for the FIRST watched area, the 115 mirrored `teorth/optimizationproblems` constants, by extending `A-81`'s code (plain label: "newer-result watcher, optimization constants"). **The user's problem in their words:** "I cited a bound and a referee told me it had been improved. I had no way to know." (`docs/evangelism-bar.md`.) Today a paper that beats a constant on the public page goes unseen until upstream credits it and our mirror's drift alarm fires.

**Evidence** (OBSERVED / HYPOTHESIS / MISSING):
- OBSERVED, no watcher exists for this area. A Grep for `export\.arxiv|arxiv\.org/api|abs:` over `scripts/` hits only `scripts/arxiv-watch.mjs`. Its query is `cat:math.CO AND abs:Ramsey`, and it compares only against `ledger/ejc-ds1/section-2-1.json`. Positive control: the same search found that file, so it could see an arXiv API client.
- OBSERVED, arXiv is where this area's new results arrive. The mirror (`ledger/teorth-optimizationproblems/manifest.json`, fetched 2026-09-26) carries 185 arXiv abstract links (links, not distinct papers). 35 of them have 2601 to 2608 ids, between 3 and 7 a month. The newest is from 2608. Not every new result is on arXiv: 1a's smallest listed upper bound, 1.502862 [T2026], cites a GitHub repository.
- OBSERVED, a numeric comparison is possible on part of the area only. A scratch probe (not committed) read 230 bound tables (115 files × upper/lower, none empty) holding 788 rows. 404 bound cells are a plain decimal. In 83 tables every row is a plain decimal, and in 93 every row is a plain decimal or ends in "= decimal". Cells like `$K_{DR} + 10^{-26}$` and `$\pi/2-\delta$` cannot be ranked numerically. That is the lane's standing rule ("numeric record-ranking is defeated by symbolic cells"), now with a count beside it.
- OBSERVED, the population is the hard part. arXiv probes made at about 15:05Z today: six math categories since the mirror date returned 2,805 papers, above the 1,000 the Ramsey watcher will page through. `abs:"minimum overlap"` in 2026 returned 16, and the first five were unrelated (quantum sampling, LLM judges). `abs:autocorrelation AND abs:Sidon` in 2026 returned 0, while 1a's upper table credits a 2026 arXiv paper, 2601.16175 [YKLBMWKCZGS2026]. The AlphaEvolve-family query (`AlphaEvolve`, `ThetaEvolve`, `TTT-Discover`, `OpenEvolve`) returned 8 since the mirror date and 67 in 2026, and 2601.16175 was among the first five of those 67. Keyword queries both miss and over-match. So P3 needs a stated per-constant query map with its blind spots printed, not one query.
- HYPOTHESIS, the window start. The mirror has no revision date of the kind the Ramsey survey has. The obvious start is the manifest's `fetchedAt` (2026-09-26), with a blindTo line for any paper submitted earlier that upstream has not credited yet. P3 states this choice and does not tune it to produce a hit.
- MISSING, a scheduled CI run of the watcher. It stays local, for the same reason as `A-81`: CI stdout is a public surface.
- OBSERVED, product-love metric: NOT MEASURABLE (`docs/evangelism-bar.md`). `check-cycle-rotation.mjs --lane bounds-ledger` printed "no product-love cycle picks this lane today" (exit 0).

**Permission:** a local, read-only script under the lane's own authority, extending `A-81`. It makes no upstream contact and renders nothing. Candidates stay in `tmp/` (gitignored) and only their count leaves it. A reader-facing note is a later round, behind adversarial review and David's approval. No David decision is needed.

**Next action** (kind: improve):
```bash
node C:/dev/skylark/bounds-ledger/scripts/arxiv-watch.mjs --selftest
```
That is the baseline: 53 cases PASS before any change. Then I extend the script rather than copying it, with: (a) an area switch (`--area ramsey | constants`) that keeps the Ramsey path byte-identical; (b) a committed query map, one arXiv query per constant id, written from each file's title and description; the union is fetched, deduplicated and reconciled per query, and a query over its cap is refused; (c) a per-constant shown-value parser that returns a decimal only when EVERY row on that side parses (plain, `= d`, or `\approx d`), and otherwise marks the side UNJUDGED. A claim on an unjudged side or with an ambiguous precision is counted as "to read by hand", is never a silent pass, and is never called a candidate; (d) readers record only what a paper states (constant id, side, decimal value, quote), and the script decides the comparison.

**Acceptance condition (pass bar, written before building):** RED today: no record of any post-mirror paper exists for this area (`tmp/arxiv-watch/` holds only the Ramsey run). GREEN after: one run gives every fetched paper a verdict (claims-a-better-bound / mentions-only / unrelated), the parts sum to the fetched count, and a missing verdict is refused (exit 3). **Positive control:** a paper the mirror already credits, fed in as if new, matches its constant at the credited value. P3 picks it before any reading, from a table whose every row parses. **Negative control:** a no-bound fixture is classed unrelated. `A-81`'s 53-case selftest, `render-ramsey.mjs --check` and `check-claims.mjs` stay PASS.

**Delivery and encounter:** none, by design. The P3 receipt will be `USER-VISIBLE: none — …`. The read that matters is the first run's candidate count and how many survive a human reading.

`USER-FACING: no` — paths: `scripts/arxiv-watch.mjs`, a new committed query map under `ledger/` (query strings only, no paper data), `docs/arxiv-watch-reader-brief.md` (or a constants sibling), `package.json` and `.github/workflows/reverify.yml` only if a selftest step is added (network-free), `tmp/arxiv-watch/` (gitignored), `continuity/items.json`, `docs/`.

**Carries (not the choice):** `A-47` slice 18 is due today (draw `0a8dd77`: 27b [R1959], 33a [Ser1983], 3c [GGSWT2025], 45a [HR2006]). It runs in P3 beside the build, through reading agents on the `census8b` brief. `npm run verify`: exit 0, receipt at `b010346dcf…` (15:05:21Z). The 20c author name and 1a line 18's 1.503164 stay unfiled upstream. David's essay is untouched.

**Prior-day retro finding that bears on the choice:** the 10-15 claims pass refuted 11 page notes I wrote myself. The same risk applies to this watcher's prose and `blindTo` lines, so the claims pass runs as its own Codex call.

**Section 0:** Listener 🟢 SSE alive (restart 14:30:27Z, hello 14:30:29Z), and the loop is armed by tool call. Codex GREEN by the prompt's own probe line (04:50:42Z). CI GREEN on HEAD `b010346dcf` for reverify.yml and page-check.yml (`check-ci-status.mjs`, exit 0 each). Deploy drift: not run. This is a Pages lane with no Render service declared (primer: "service: NOT DECLARED"), which reads NOTHING SWEPT. Harness: running 2.1.301 · fleet UNIFORM (28 of 28) · installed 2.1.301 (SAME). Recs from the 10-15 close: slice 18 carrying to today's P3; the Ramsey render executed (`b167f64`, `A-54` closed); the reading-brief rule carrying; the two upstream candidates held. Due-gates snapshot: "1 gate(s) due on/before 2026-10-16" (`A-47`).

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: `A-47` (nextCheckDate 2026-10-16). It is worked in P3 as slice 18, so the hygiene helper drafts only its date and readCommand stamp. Read: kickoff `dated gates due today: 1`.
- (b) owed child rows: none. Read: kickoff `rows owed to you … 0 of 754`.
- (c) CROSSED state reads: none crossed. One was not judgeable: `missingLinkedCommits` NOTHING SWEPT (0 of 0 considered).

### Day round — P3 product work

**Action (improve): the arXiv newer-result watch for the optimization constants, extending `A-81`.** `scripts/arxiv-watch.mjs --area constants` fetches the papers submitted since the mirror's fetch date (2026-09-26) whose abstract names AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve. That query is the manager review's suggested first cut, and its blindness is printed on every fetch. Reading agents record what each paper states. The script compares each stated bound with the BEST row on that side of the mirrored table, in exact decimal arithmetic. Candidates stay in `tmp/`, which is not committed, and only their count leaves it.

**Implementation:** `48b17e2`, then three rounds of review fixes: `b9950c2` (r1: exact decimal intervals), `67e2b40` (r2: number tokens as a stated rule), `99075a5` (r3, a cold round on stated invariants: a required `relation`, so a strict claim at the shown value goes to a human). Selftest: 112 PASS lines, up from 52. Nineteen mutations were red-armed, each failing its own case. Today's saved claims predate the `relation` field, so I set it from each quote's wording and marked every claim I edited.

**First run, against the pass bar:**
- Window 2026-09-26 to 2026-10-16 (UTC dates): 8 papers, 8 verdicts. `--check --area constants` printed claims-a-better-bound 2, mentions-only 0, unrelated 6 (2 + 0 + 6 = 8). Candidate bounds: 3. Within printed precision: 1. Equal: 1. Weaker: 5. Unrankable side: 0. Exit 1.
- Every candidate's number was found verbatim in the paper's own arXiv HTML at the version read. The candidates are UNVERIFIED claims about other people's work. A human reading against each paper's construction comes next; their details stay in `tmp/`.
- Positive control: 2604.19341v2, which the mirror credits with 1b's best upper bound 0.380868, was put unmarked into a reader's batch. `--check --control` printed 2 EQUAL claims and 0 candidates, exit 0, so it matched its constant at the credited value.
- Negative control: the selftest's no-bound fixture is classed unrelated.

**Also today: `A-47` slice 18** (`706ba1d`). 3c SOUND, 45a UNRESOLVED, 27b UNREACHABLE, 33a UNREACHABLE. `node scripts/depth-audit.mjs`: 83 audited (52 sound, 1 defective, 21 unresolved, 9 unreachable), up from 79.

<!-- findings:begin -->
- **The upstream table's decimals are roundings.** 1b's 0.380868 is 0.380867675827 at more digits. The first live run counted that restatement as a better bound. The fix treats every printed decimal as an interval of one unit in its last place.
- **The same class came back in review r1** (5b's 4/7 ≈ 0.5714, and floating point collapsing 1.74999999999999999999 into 1.75). The shape changed instead of a second patch: exact BigInt decimals, with an interval on either side.
- **33a, outside the verdict:** Schoof 1992, which cites the 1983 note the row credits, gives the 1982–83 Bordeaux exposé 8/39 and dates Serre's 2/9 to 1985. It is not established, because the 1983 note was not read, and it is not filed upstream.
<!-- findings:end -->

**Delivery:** the slice 18 notes go live on the four `c/` pages once pushed. The watcher renders nothing, by design.

**Encounter:** blind. The public pages carry no analytics (bug row `A-59`).

### Close (2026-10-16 day round)

`ACTION: COMPLETED` · item `A-81` · P3 6353cedc. The packet's pass bar was met: every fetched paper has a verdict, the parts sum to the fetch, a missing verdict is refused, and both controls held. The manager review in the close prompt (bus fc272d5c) agreed, and found no defects in the shipped work.

**Since the P3 post:** nothing in the shipped work changed. The receipt posted at P3 is still true.

**Ledger delta (hygiene draft: 1 line — 0 accepted · 1 amended · 0 rejected):**
- A-47, AMENDED: re-dated to 2026-10-18 with `--set A-47 --field nextCheckDate`, not the drafted `--extend` (which on 2026-10-05 wrote the wrong fields on this row). The draft's reasoning gave 2026-10-17 to the A-54 census, but A-54 closed on 2026-10-15. The note now says 2026-10-17 goes to A-82 instead, and slice 19 is 2026-10-18. Read stamped at 83 after slice 18 landed.
- A-82, MINTED (as the manager review asked): the human read of the 3 candidates, nextCheckDate 2026-10-17. It also carries the next round's draft, a reader-facing line on each constant page saying "newer results checked through <date>", owed a claims pass, an adversarial review and David's gate before it reaches a page.
- A-81: `constantsArea2026_10_16` records the new area, its rule, the first run's counts and the review rounds.
- Helper checks: check-wait-justification "RESULT: PASS — 1 of 98 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)"; check-engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)"; READ-MUTATED none.
- `check-due-gates-dispositioned.mjs`: "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT.

**Pending reads:** A-82 on 2026-10-17 (the three candidates, read against each paper's construction). A-47 slice 19 on 2026-10-18. A-81's next Ramsey read on 2026-10-29. W-14 (the watch on upstream issue 218) on 2026-10-21.

### Afternoon round (round 2) — P1 selection packet

**Outcome:** `A-82` (the human read of the 3 candidate bounds the constants watch flagged this morning). **The user's problem in their words:** "I cited a bound and a referee told me it had been improved. I had no way to know." (`docs/evangelism-bar.md`.) An unread candidate is not coverage: until each is read, the ledger cannot say whether any constant it shows has been beaten.

**Evidence** (OBSERVED / HYPOTHESIS / MISSING):
- OBSERVED, the RED baseline: `node scripts/arxiv-watch.mjs --check --area constants`, run at about 18:35Z, printed 3 candidate bounds and 1 within printed precision, exit 1. All four are in 2 papers, and none has a reading of its construction (`tmp/arxiv-watch/2026-10-16/constants/verdicts.json` holds only what each paper states).
- OBSERVED, every candidate's number appears verbatim in its paper's own arXiv HTML at the version read (lead check, P3 this morning).
- HYPOTHESIS, some candidates are checkable by computation: a construction posted as data can be evaluated directly against the constant's definition. Whether each paper's construction is downloadable is MISSING until it is read.
- HYPOTHESIS, some candidates may restate other systems' scores (a table of results) rather than claim a new bound. That decides the verdict, and only the paper can settle it.
- OBSERVED, product-love metric: NOT MEASURABLE (`docs/evangelism-bar.md`). CI GREEN on `5a243b7` for reverify.yml and page-check.yml (`check-ci-status.mjs`, exit 0 each).

**Permission:** `A-82` is open and due 2026-10-17. Reading is local and read-only, inside the lane's authority. **Outward gate, because the repo is PUBLIC:** nothing about a candidate goes into a commit, a page, the bus, or upstream. Only per-verdict counts reach `A-82`. If one SUPPORTS, the corrected row and a "newer results checked through <date>" line are drafted in tmp/ only and carded to David. Both are behind a claims pass, adversarial review and his gate.

**Next action** (kind: obtain a read, the one the ledger's coverage turns on):
```bash
node C:/dev/skylark/bounds-ledger/scripts/arxiv-watch.mjs --check --area constants
```
That is the baseline above. Then each paper is read at the version recorded: its construction, witness or proof, with page and equation numbers. Where a construction is posted as data, it is evaluated against the constant's mirrored definition by a script kept in tmp/. Each candidate gets SUPPORTS (a value stronger than the page shows), DOES NOT (with the reason: normalisation, a weaker variant, an asymptotic claim, a restated score, a misread) or CANNOT TELL HERE (what is missing), with its evidence path in tmp/. The within-precision claim gets a verdict too.

**Acceptance condition (pass bar, written before building):** RED now: 3 candidates, 0 verdicts. GREEN after: 3 of 3 (and the within-precision one) carry a verdict with an evidence path in tmp/, and `A-82` records the counts only. **Positive controls:** (1) a paper the mirror already credits with a constant's best value, chosen before any reading and read the same way, comes out DOES NOT at its credited value; (2) `git status` shows no tmp/ path staged, and `git grep` of the tracked tree finds neither candidate paper's id; (3) `arxiv-watch.mjs --selftest`, `render-ramsey.mjs --check` and `check-claims.mjs` stay PASS.

**Delivery and encounter:** none by design. Nothing renders. The receipt will be `USER-VISIBLE: none — …` unless a SUPPORTS verdict opens a page change, which waits for David's gate.

`USER-FACING: no` — paths: `tmp/` (gitignored), `continuity/items.json` (`A-82` counts), `docs/daily/2026-10-16-prelaunch.md`.

**Carries (not the choice):** `A-47` slice 19 on 2026-10-18. The verify receipt at `c30b484` covers HEAD; only doc and ledger paths changed since.

**Prior-day retro finding that bears on the choice:** "a verdict follows the reading" (memory). A SUPPORTS needs the construction itself read or evaluated, not the paper's sentence about it. A candidate resting on someone else's posted witness is read against that witness.

**Section 0:** Listener 🟢 SSE alive (restart 18:23:45Z, hello 18:23:47Z), and the loop is armed by tool call. Codex GREEN by the prompt's own probe line (18:20:02Z). CI GREEN on `5a243b7` (both workflows). Deploy drift: not run (a Pages lane with no Render service). Harness: unchanged since this morning's read (2.1.301, UNIFORM). Recs: this morning's close recommended exactly this read. Due-gates: the morning snapshot (2026-10-16) stands CURRENT; the kickoff read "dated gates due today: 0". No re-snapshot.

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: none. Read: kickoff `dated gates due today: 0`.
- (b) owed child rows: none. Read: kickoff `rows owed to you … 0 of 754`.
- (c) CROSSED state reads: none crossed. One was not judgeable: `missingLinkedCommits` NOTHING SWEPT (0 of 0 considered).

### Afternoon round (round 2) — P3 product work

**Action (obtain a read):** `A-82`, the 3 constants-watch candidates read against the construction each relies on (manager review APPROVE, bus 56292c15). Details are in tmp/ only (public repo); this section carries counts.

**Result:** 1 SUPPORTS a value stronger than the page shows, 0 DOES NOT, 2 CANNOT TELL HERE. The within-precision claim is DOES NOT: it is no new improvement over the credited construction.
- **The SUPPORTS** rests on an admissible construction that someone posted publicly before the mirror's fetch date, which a newer paper led us to. A lead-written evaluator checked it against the mirrored definition in exact rational arithmetic: it confirms 0 ≤ f ≤ 1 and ∫f = 1 exactly, and takes the maximum over every grid shift. The value is below the page's best upper bound by more than the page's printed precision. The paper's own further refinement is not verified.
- **The 2 CANNOT TELL HERE** restate another system's reported scores, and the source the citing paper points to prints no construction. The next read is that system's entries on the public leaderboard it names, evaluated the same way (`A-82` re-dated to 2026-10-20).
- **Side check (the review's hypothesis):** every claim was on the side the page tracks.
- **Positive control:** the construction behind the page's own credited value, evaluated the same way, reproduces that value exactly (DOES NOT, as required). `git grep` of the tracked tree finds neither candidate paper's id, while the same search finds the control paper's id. `arxiv-watch.mjs --selftest` PASS. `render-ramsey.mjs --check` PASS. `check-claims.mjs`: "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)".
- **Review:** Codex read-only r5 found the evaluator correct by inspection and returned "SUPPORTS NEEDS FIXES": one verdict was amended from DOES NOT to CANNOT TELL HERE, one attribution was narrowed, and the evaluator's labels were tightened.

**David's board:** card 73149a3b (bus 2856a464) asks whether to note the checked construction on our own minimum-overlap page, also tell the list we mirror, or hold. With no answer, nothing changes: the finding stays private. The card names his 2026-08-02 decision on a different correction to a different site.

<!-- findings:begin -->
- **The ledger's most important page is behind.** The best upper bound shown for the Erdős minimum overlap constant (the problem this repo opened on) is beaten by a construction posted about three months ago, and the list we mirror has not added it. The drift alarm could never catch this, because it watches the mirror and the mirror is faithful. Only the newer-result watch plus a human read could. This matches the shape `A-81` was built for, but it is not the standing prediction's citation-quality shape.
<!-- findings:end -->

**Delivery:** none yet, by design. Nothing renders until David answers the card.

**Encounter:** blind (bug row `A-59`).

## Inputs (controllable)

- One build: the constants area of the arXiv watch, one live run (8 papers, two reading agents, one hidden control paper), five Codex read-only reviews, and one CI fix.
- One depth-audit slice: four reading agents, with page images re-read by the lead.
- The hygiene helper's draft, applied above.

## Outputs (lagging)

- `npm run reports` was not re-read today. Its last read (2026-10-15) was 0 outside arrivals of 33 raw issues. G-4 is still at expected zero.
- Encounter is blind on the public pages (`A-59`).

**Classification (by hand, not a counter):** one instrument-facing finding (the upstream tables' decimals are roundings; the first live run counted a restatement as a better bound). One record-facing candidate that is not established: Schoof 1992, which cites the 1983 note credited on 33a's 2/9 row, gives that era's work 8/39 and dates Serre's 2/9 to 1985. It has the standing prediction's shape (an attribution defect found by reading a cited source in `A-47`) but nobody has read the 1983 note, so it does not confirm the prediction. The day holds no confirmed record-facing catch, so it counts as instrument-facing. Consecutive instrument-facing days: 2 (the 2026-10-15 report counted 1; counted by hand).

## Recommendation

- 2026-10-17: read the three candidates against the construction or proof each relies on (`A-82`).
- 2026-10-18: `A-47` slice 19.
- Next round: the per-constant query map, because most human-written work is outside today's query. Draft the "newer results checked through <date>" line, which is owed review and David's gate.

## On hold pending data

- G-4: an outside report through a per-row link. None yet.
- The three candidates: unverified until read (`A-82`).
- W-14 (the watch on upstream issue 218): re-read on 10-21.

## State Appendix

Written last, from live commands, as of the close commit's parent. This report cannot name the commit that lands it.
- `git -C C:/dev/skylark/bounds-ledger rev-parse --short HEAD` before the close commit: `c30b484`. CI GREEN on `90fb209` for reverify.yml and page-check.yml (`check-ci-status.mjs`, exit 0 each). Later commits are doc and ledger only.
- `node scripts/depth-audit.mjs`: "RESULT: PASS — 83 audited, 52 sound, 1 defective, 21 unresolved, 9 unreachable (exit 0)".
- `node scripts/arxiv-watch.mjs --check --area constants`: COMPLETE, 3 candidates and 1 within precision (exit 1).
- `npm run verify` receipt at `c30b484`: exit 0.
- Release: re-run those commands; never quote these values as current.
