---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-11
lifecycle_stage: launched
last_deploy: 9bd02e6 (the last page-changing push; npm run served read 115 of 115 served at 06:49:31Z on 2026-10-11)
on_hold_items: 1
top_action_today: A-63, every read verdict on a constant page names the claim it checked
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-11 (Sunday, MT)

## BLUF

Eight more checked entries on the constant pages now say which claim in their row we checked, and 17 still do not. We also read four new rows against their sources: two hold, and two could not be settled.

No first command: the change is live, and the next one is in the primer.

## What changed

### Cycle 6 — P1 selection packet

Cycle 6 of the rolling session (the third cycle since the 2026-10-10 evening), lead and phase prompt inbox `d4d36d0e`.

**Outcome:** every read verdict on a constant page says which claim it checked. Item `A-63` (a constant page does not say which claim in a row was checked).

**The user problem, in the user's words** (the lead's): "It says checked, but checked what?" A reader who sees "what we read supports the claim we checked in this row" on, say, c/13a cannot tell whether the bound, its credit or a comment was checked, which is the question they came to settle.

**Evidence**
- OBSERVED, the population, counted from the pages (a node read of every `c/*.html`, matching "the claim we checked: " against "This page does not yet say which part of the (row|entry) that reading checked"): 115 pages; 46 carry a read verdict; 27 of those name the claim on every read verdict, and 19 do not. Over the 46 pages there are 64 read-verdict lines: 39 named and 25 unnamed. The audit store agrees: 64 read verdicts, 39 with a `claimReader`, 25 without.
- OBSERVED: the 25 unnamed entries rest on 24 distinct cited sources (10a's [SLXCKKM26] carries two). 21 are SOUND and 4 UNRESOLVED; 17 were drawn by position and 8 chosen for suspicion.

**THE LEAD'S ROUTE CONFLICTS WITH A RULE ON `A-63` AND IN THE RENDERER.** The lead asks for the rest "generated from the same source the four used, never hand-typed per page". The four did not get their claims from a generator. Each was re-read under a claim named and pushed first (cycle 4: `7908972`, then `89a2282` and `faddb9d`). `scripts/render-constant-pages.mjs` says why, in its own words: "AN ENTRY WITH NO `claimReader` IS NEVER GIVEN ONE AFTER THE FACT: a claim named after the reading is the failure the depth audit exists to prevent." `A-63`'s `round1Shipped2026_10_05` says the same of these 25: "Their claims must NOT be written after the fact; the honest route is that each is re-read under a named claim when the ladder or a retry reaches it…" Generating a claim for an entry already read would put a sentence on a public page saying we checked something the reading was never pointed at. So I am not proposing that.

**What I propose instead (the honest form of "all of them, not four"):**
1. Name all 25 claims at once, in reader-facing words from each row's own text, with a Codex sentence review first, and push them as one draw on `A-63` before any source is opened. That is the generated part: one pass over the store, not a per-page hand job.
2. Re-read under those claims in batches, each entry recorded as a dated retry on its existing entry. Tonight's batch: the 17 drawn by position, which count toward the coverage figure, as many as the reading and review can carry with care. Cycle 4 needed two review rounds for four sources, and both of its verdict errors were mine.
3. The remaining entries carry with their claims already pushed, so a later batch only reads.

**Running beside it, a dated obligation and not the choice:** `A-47` (the depth audit) slice 16. Its draw is pushed already (`44d1929`, the four rows 65a, 75a, 83a and 87a, claims named in the draw). The draw printed "store: 0 of 4 drawn position(s) land on a row already held". These four new readings go with tonight's batch.

**Permission.** `A-63` is open, not parked, no board card. Re-reading under a claim named first is the route the row itself licenses. It is lane authority and not outward contact. The claims are public method sentences, so they get a read-only Codex review before the draw, and the results a claims pass before the push.

**Next action:** improve. First command, the population read, to be re-run at the close:
```
node C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-bounds-ledger/3f94d69e-b3b0-450b-af26-e2044f9a42cd/scratchpad/a63pop.mjs
```
(It is a scratch script and so not a durable read; the durable form is the Grep the row names: count `This page does not yet say which part` across `c/`, 19 files today.)

**Acceptance:**
- All 25 claims named and pushed before any of their sources is opened.
- The unnamed count falls from 25 by exactly the number of entries re-read, with the command printed both times. N of N is not promised tonight: it is reachable only by reading the remaining sources.
- A live 393x659 phone frame of one newly named page.
- Each changed sentence passes a claims pass; each verdict that moves is reported as such.

**Delivery and encounter:**
- Delivery: `npm run served`, a byte comparison, CI, and the browser read when memory allows 10 GB free.
- Encounter: blind, tracked on `A-59` (encounter is blind on the public pages), read 2026-10-28.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, the `c/*.html` pages whose entries are re-read, `index.html` if a verdict badge moves, and `continuity/items.json` (`A-63`, `A-47`; internal).

**Also tonight, small and already specified:** `A-75` (the index's self-test does not check the copy button's class, or that its scripts make no runtime request). The lead says to close it, and its `onTrigger` names the two assertions and their red-arm. `A-69` (screen-reader order) is second if time remains.

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice: 1, `A-45` (the tier-1 leading indicator), due 2026-10-11. Read: today's snapshot, "2 gate(s) due on/before 2026-10-11". The other row is `A-47`, worked beside the choice.
- (b) Owed child rows: none. Read: the cycle-4 kickoff's "rows owed to you in skylark-site's ledger", 0 of 749. This lead carried no state block.
- (c) State reads marked CROSSED: none. Read: no state block on this lead; the cycle-4 kickoff's reads showed none crossed.

**Section 0**
- Due-gates snapshot for 2026-10-11 taken: "snapshot written — 2 gate(s) due on/before 2026-10-11", `A-45` and `A-47`.
- Verify receipt exit 0 at `9bd02e6`, the last code commit. HEAD has moved by doc and ledger commits only since then.
- CI GREEN at `9bd02e6` for both workflows (read in cycle 5).
- Codex: the cycle-4 probe line stands for the session.

### Cycle 6 — P3 product work

Manager review `30ff3e3f` (re-delivered as `eb996e5b`) approved the P1 route: claims pre-registered on `A-63`, then batched re-reads.

**Shipped, user-visible.** Eight more read verdicts on the constant pages now say which claim they checked. The phone frame shows c/19a with its named claim at 393x659, with no horizontal scroll.

**Commits, in order:**
- `935349f`: the draw. The 25 claims, written to `A-63.cycle6Draw2026_10_11` after a Codex sentence review (4 BLOCKERs where "found by" turned a credit into a discovery claim, and one where 84b dropped its quantifiers; all 10 replacements taken). Pushed before any source was opened.
- `d5012e9`: the readings.
  - Eight re-reads, each stored as a dated retry on its existing entry with the old fields kept: A-47-0025 1a, 0026 21a, 0027 28a, 0029 3e, 0035 84b, 0037 10a, 0038 13b and 0039 19a. All eight are SOUND, so no verdict moved; each now names its claim.
  - `A-47` slice 16, the four new rows:
    - 65a SOUND.
    - 75a SOUND. This rests on arXiv v3, the version the entry links; the journal edition was not reached.
    - 83a UNRESOLVED (abstract only).
    - 87a, see below.
  - `A-75` (the index self-test gap).
- `0c32a8d`: review r1. It moved 87a to DEFECTIVE. It also made the index and page tests refuse every non-bare script or style tag, plus `Image`, a module script and a second style; all six mutations were red-armed, and each fired. It also narrowed the wording on 21a, 1a, 19a and 83a.
- `1e5b9fe`: review r2. 87a back to UNRESOLVED, with the exact expansion. Codex r3: SHIP.

**87a, the one verdict that moved twice.** The row's 1058.565 is the paper's 4√70035 = 1058.565066… rounded to three decimals. Read as an exact upper bound, it is about 0.0000665 below the paper's. The paper cannot say which the row means, so the verdict is UNRESOLVED, not DEFECTIVE. r1 had overstated it, and r2 corrected that, along with my own wrong expansion "1058.56507…".

**Acceptance, read:**
- Store, read verdicts without `claimReader`: 25 before, 17 after (`a63pop.mjs`). That is down by exactly the 8 re-read. Entries: 75. Read verdicts: 68, of which 51 are named.
- Durable Grep, files under `c/` carrying "This page does not yet say which part": 19 before, 12 after.
- Live, read at 2026-10-11T09:18:41Z: 116 files byte-equal to HEAD, 0 differ, 0 errors. Live read-verdict lines: 51 named, 17 unnamed, on 12 pages.
- `npm run served`: "2 checked — 2 served, 0 in flight, 0 stale, 0 unreachable".
- Phone frame at 09:20:56Z: c/19a, viewport 393x659, scrollWidth 393, named=1, unnamed=0. Saved as `docs/evidence/2026-10-11-a63/a63-live-19a-393x659.png`.
- `npm run verify`: exit 0 at `1e5b9fe` (09:09:26Z).
- CI on `1e5b9fe` (read 09:26Z): GREEN for both `reverify.yml` and `page-check.yml`.

**Not done:**
- N of N: 17 entries remain unnamed. Their claims are already pushed, so a later batch only reads.
- `A-69` was not reached.
- New grid for slice 17: owed.
- 87a's sibling question is open: are other upper-bound rows truncated downward?

**Why commit `d5012e9` touched 48 pages** (the manager's hypothesis, checked): every constant page that carries an audit list ends with the ledger-wide drawn-row sentence. Slice 16's four readings moved it, from "62 row(s) have been drawn by position … 56 were checked" to 66 and 60. Shown by `git diff -U0 --word-diff d5012e9~1 d5012e9 -- c/1b.html`, whose only change is that sentence. Counted by a scratch script that compares each page before and after with that sentence masked: "changed 48; only the count sentence 36; more 12". The 12 are exactly the eight re-read pages and the four slice-16 pages: 10a 13b 19a 1a 21a 28a 3e 65a 75a 83a 84b 87a. It was not a renderer change: that commit's only script change is to the self-test in scripts/render-site.mjs.

### Day session round 1 — P1 selection packet

Phase prompt inbox `5363e9be` (15:55Z). Verify receipt exit 0 at `7e1e548` (HEAD, 15:36Z).

**Outcome:** more read verdicts on the constant pages say which claim they checked. Item `A-63` (a constant page does not say which claim in a row was checked).

**The user problem, in the user's words** (the lead's, carried from cycle 6): "It says checked, but checked what?" On c/13a, for example, the read verdict still says "This page does not yet say which part of the row that reading checked."

**Evidence**
- OBSERVED, store: a node read of `continuity/depth-audit.json` in this session printed "entries: 75 · read verdicts (SOUND/DEFECTIVE/UNRESOLVED): 68 · with claimReader: 51 · without claimReader: 17". The 17 are the list on `A-63.openAfterCycle6_2026_10_11`, id for id.
- OBSERVED, pages: a Grep of `c/` for "This page does not yet say which part" matches 12 files (10a 10c 13a 17a 1b 3a 4a 55a 77a 84a 87a 88a). Positive control: the same files are the ones the 17 entries sit on (1b carries five, 10a two).
- OBSERVED: none of the nine entries drawn by position (A-47-0004 13a, 0008 55a, 0009 17a, 0011 3a, 0012 77a, 0013 88a, 0020 4a, 0022 84a, 0023 10c) has a saved source under `tmp/depth-reads/`: the listing has slice6 onward and cycle folders, and these nine were read in slices 1 to 5. So this batch fetches every source; cycle 6's batch did not.
- HYPOTHESIS: most of the nine cite arXiv-hosted or open papers, so they are reachable. Untested until each reading opens its source.
- OBSERVED, G-4 (an outside party acts on a watched record without us filing the report): `npm run reports` printed "raw issues fetched: 33 … ours … excluded: 33 … OUTSIDE ARRIVALS: 0", parts reconcile 33 + 0 + 0 = 33. Expected-zero; the bar's own metric stays NOT MEASURABLE (`docs/evangelism-bar.md`).
- MISSING: any read of whether a person opened a constant page. Encounter is blind, tracked on `A-59`, read 2026-10-28.

**Permission.** `A-63` is open, not parked, with no board card (`answered-cards`: none). Re-reading under a claim already pushed (`cycle6Draw2026_10_11`) is the route the row licenses. Lane authority, not outward contact. No dated freeze covers `c/` or the audit store.

**Next action:** improve. Re-read the nine drawn-by-position entries under their pushed claims, each recorded as a dated retry on its existing entry, then re-render. A batch of nine is the plan; if review rounds run long, a smaller batch that lands reviewed is better than nine unreviewed. First command, the before count:
```
node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --check
```

**Acceptance:**
- The store's unnamed count falls from 17 by exactly the number of entries re-read, and the `c/` Grep falls from 12 files, both printed before and after.
- Each verdict follows its reading: the edition read is the edition the entry cites, or the entry says which edition was read. A verdict that moves is reported as moving.
- `render-constant-pages --check` PASS after the commit, and `npm run served` reads the changed pages as served.

**Delivery and encounter:** delivery by `npm run served`, CI on the push, and a live read of one newly named page. Encounter: blind (`A-59`).

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, the `c/*.html` pages of the entries re-read, `index.html` if a verdict badge moves, `continuity/items.json` (`A-63`; internal).

**Prior-day retro finding that bears on this:** "a field padded past what its evidence shows" (10-10). Here that means a verdict or sourceRead sentence that says more than the reading opened. The guard is the edition question, asked for every entry before its verdict.

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice: none. Read: the kickoff's "dated gates due today: 0", and the due-gates verify leg against today's snapshot, which printed "2 gate(s) were due at Phase 0" (`A-45`, `A-47`), both re-dated overnight, "verdict: CLEAR".
- (b) Owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger: 0 of 749".
- (c) State reads marked CROSSED: none. Read: the kickoff's state block, on the phase prompt (inbox `5363e9be`). Its HEAD CI line read UNKNOWN (a 10 s gh timeout); re-read live in this session, `check-ci-status --workflow reverify.yml` printed GREEN for `7e1e548`.

**Section 0**
- Primer `docs/cold-starts/2026-10-11.md` read; its banner governs.
- Listener: relaunched by the session-start hook, connected 15:32:25Z.
- Codex: the `[codex-probe: GREEN …]` line on this prompt is the probe.
- CI: GREEN at `7e1e548` (above). No deploy service is declared for this lane; the public page is GitHub Pages.
- Due-gates: the `--snapshot` for 2026-10-11 already existed from the overnight session and refused a rewrite that would drop `A-45` and `A-47`; left as it was. The 10-12 snapshot belongs to tomorrow's first session.
- Cycle rotation: "no product-love cycle due" (exit 0).

### Day session round 1 — P3 product work

Manager review: APPROVE (inbox `368462cc`). Kind: improve.

**What a reader sees now:** nine more constant pages say which claim in the row was checked, and against which edition. On 88a the verdict moved from SOUND to UNRESOLVED, and the page says why.

**Implementation:** `43bad4b` (nine retries, nine pages, `index.html`) and `2934316` (review r1 fix), pushed together (`7e1e548..2934316`). Each retry re-read its source under the claim pushed in `935349f` before any source was opened. The reading agents started at 16:19Z, read bodies rather than abstracts, and never saw the store. Their reports are saved under `tmp/depth-reads/c7/<id>/report.md`.
- SOUND, now naming the claim: 13a (arXiv v2, the cited version), 55a (the arXiv correction the entry cites; the journal text answered 403), 17a (the repository's proof note; the verifier was not run), 3a (arXiv v3, checked against v1), 77a (arXiv v2; the cited journal edition reached only as its abstract), 4a (the published Nature article via Europe PMC), 84a (arXiv v1, the only version), 10c (certificate recomputed over all 131,072 sign vectors).
- 88a, SOUND to UNRESOLVED. The edition the entry cites, Algebra & Number Theory 8 (2014), says 4680 came from "the first version of this paper [Polymath 2014a]", and that "The present version of the work of POLYMATH8 therefore contains only the statement and proof of these estimates." The theorem stating 4680 was read only in arXiv 1402.0811v2, which the entry does not cite.

**Counts, before → after:**
- Store (a node read of `continuity/depth-audit.json`): read verdicts without a named claim 17 → 8, and 51 → 60 named, of 68.
- Pages (a Grep of `c/` for "This page does not yet say which part"): 12 → 3 files (10a, 1b, 87a).
- Red-arm: with the store written and the pages not re-rendered, `render-constant-pages --check` printed "RESULT: FAIL — 0 missing, 0 orphaned, 9 stale constant page(s)", naming the nine (exit 1). After the re-render it printed PASS.

**Review:** Codex r1, read-only, banner workdir `C:\dev\skylark\bounds-ledger`, on `43bad4b`. Verdict SHIP. It confirmed every `claimReader` is identical to the draw, and judged 88a's UNRESOLVED "defensible" rather than DEFECTIVE. One NIT: 55a's sentence dropped the ceiling in "⌈3.74(Δ−1)⌉+1". CONFIRMED, and the reviewer's sentence was taken verbatim in `2934316`.

**Gates:** `npm test` exit 0; `render-constant-pages --check` and `render-site --check` PASS after the commit. Pre-commit hook clean on both commits.

**Encounter:** blind (`A-59`, read 2026-10-28).

**Record-facing, not instrument-facing:** 88a is a citation-quality defect in a mirrored upstream entry, found by reading the cited source in the depth audit, not by any alarm. That is the shape the standing prediction in `CLAUDE.md` names.

**Left:** the 8 entries chosen for suspicion (10a ×2, 87a, 1b ×5), each with its claim already pushed. Recorded on `A-63.dayBatch2026_10_11`.

### Day session round 3 — P1 selection packet

Phase prompt inbox `ac2963bf` (01:04Z on 2026-10-12, 19:04 MT on 10-11). It is labelled round 3; round 1 is the last round this report records. The full packet, as posted to the bus, is `tmp/p1-round3-packet.md`. Its substance:

**Outcome:** every read verdict on a constant page says which claim in its row was checked. Item `A-63` (a constant page does not say which claim in a row was checked).

**Evidence:** the store reads "entries: 75 · read verdicts: 68 · with claimReader: 60 · without: 8". The 8 are A-47-0001 and 0002 (10a), 0003 (87a), and 0014, 0015, 0017, 0018 and 0019 (1b). The `c/` Grep finds 3 files: 10a, 1b and 87a. All 8 claims were pushed in `935349f`, so the batch only reads. No source is saved locally, so every one is fetched again. Encounter is MISSING (`A-59`).

**Next action:** improve. Re-read the 8 under their pushed claims with `tmp/reading-brief-c7.md`, store each as a dated retry, red-arm, re-render, run a Codex review, push, then check served bytes. A verdict that moves is reported as found.

**Acceptance:** the unnamed count falls from 8, and the Grep from 3 files, by what was read, with both printed before and after.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, `c/10a.html`, `c/1b.html`, `c/87a.html`, `index.html` if a badge moves, and `continuity/items.json`.

**HYGIENE INPUTS:** (a) none: "0 gate(s) due on/before 2026-10-11". (b) none: 0 of 749. (c) none crossed: the kickoff state block.

### Day session round 3 — P3 product work

Manager review: APPROVE (inbox `93bbe54e`). Kind: improve.

**What a reader sees now:** every constant page with a read verdict says which claim in the row was checked. c/1b, c/10a and c/87a no longer say "This page does not yet say which part of the row that reading checked." On c/10a, row 33 ([SLXCKKM26]) reads SOUND, and the index badge for 10a changed to match.

**Implementation:** `08d5e80` (the eight retries and the 32a sentence) and `0d35938` (review r1 fixes), pushed together (`8529fae..0d35938`). The eight readings started at 01:28Z on 2026-10-12 UTC, under claims pushed in `935349f`. The reports are under `tmp/depth-reads/c8/`.
- 10a row 33, A-47-0001: UNRESOLVED to SOUND. Theorem 4.2 proves K_G ≤ 1.7818666069360661, strictly below the row's threshold of 1.78211397819….
- 10a row 32, A-47-0002: UNRESOLVED, unchanged. The note now points to A-47-0062, which already settles it from the appendix table. I caught this against the store before review.
- 87a [Mar2006], A-47-0003: UNRESOLVED, unchanged. No matching work was located. The records found give Jason Martin's 2006 Cornell thesis a different title, and the thesis itself was not read. I first stored this as DEFECTIVE; review r1 refuted that.
- 1b: four SOUND entries now name their claim; A-47-0019 [H2016] stays UNRESOLVED (0.380926 is 0.3809268534330870 cut to six decimals).

**Counts, before → after:** in the store, read verdicts without a named claim went from 8 to 0 (68 of 68 named, out of 75 entries). In the pages, a Grep of `c/` for "This page does not yet say which part" went from 3 files to 0 (positive control: `scripts/render-constant-pages.mjs:256`).

**Red-arm:**
- `render-constant-pages --check` before the re-render: "RESULT: FAIL — 0 missing, 0 orphaned, 4 stale constant page(s)" (exit 1).
- After the r1 fix, before the re-render: the same line with "2 stale constant page(s)" (exit 1).
- PASS after each re-render.

**Delivery:**
- Live at 2026-10-12T01:57:20Z: 7 pages HTTP 200 and byte-equal to HEAD `0d35938`, including c/15a and c/26a, each naming its claim.
- `npm run served`: 2 of 2 served.
- CI GREEN at `0d35938` for both workflows.
- `npm run verify`: exit 0 at `0d35938` (02:02:52Z).

**Encounter:** blind (`A-59`). **Outcome:** open.

**Reviews:**
- Codex r1 on `08d5e80`: HOLD. 1 BLOCKER (the 87a DEFECTIVE), 2 SHOULD (two 10a row-32 sentences), 1 NIT. All four confirmed and fixed in `0d35938`.
- Codex r2 on `0d35938`: SHIP.

**Fold-ins:**
- c/32a's absence sentence now names what was searched.
- The ", and" wording: declined. Seven pre-registered fields share it, and under "does not cover" a joined list reads as none of them.

**`A-63`:** closeWhen met. Recorded on `A-63.round3_2026_10_11`. Closing the row, with the id sweep, is left to the close.

**Record-facing or instrument-facing:** no catch this round. The 87a title question is record-facing in shape but not settled.

### Overnight round 4 — P1 selection packet

Phase prompt inbox `34212844` (05:31Z on 2026-10-12, 23:31 MT on 10-11), the re-send of `9df41fb4`, which was marked surfaced but never reached the session. The full packet, as posted to the bus, is `tmp/p1-round4-packet.md`. Its substance:

**Outcome:** the "bound cell edited" label links to upstream's history for that constant's file, so a reader can see the edit in one click. Flow `F-2` (spot-check one claim).

**Evidence:** a cold walk at 390x844 of the index, c/1a.html and 2a. The slowest answer was 1a's lower bound, "bound cell edited 2026-09-26", which has no route but "upstream source", then history, then the diff. The label census reads 4 / 20 / 7 / 199 / 2 / 0 (bound cell edited / value changed / text edited / tracked since / last changed / date unknown), 232 labels over 115 rows. The four are 1a, 3b, 8a and 41a. Showing the previous cell inline is NOT chosen: `scripts/lookup.mjs:192-197` refuses it. Encounter is MISSING.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `scripts/render-constant-pages.mjs`, `index.html`, `c/*.html`, `docs/key-user-flows.md`.

**HYGIENE INPUTS:** (a) none: "0 gate(s) due on/before 2026-10-11". (b) none: 0 of 749. (c) none crossed: the kickoff state block.

### Overnight round 4 — P3 product work

The P1 review (APPROVE) and P3 prompt, inbox `896af847`, were marked surfaced at 06:11:44Z and never reached the session. The orchestrator pointed to them on disk at 06:28Z (inbox `3d5dc793`).

**Action (improve):** each label that records an observed change now links GitHub's commit history for that constant's upstream file, pinned to the sha the mirror records. Commits: `6cc1076` (the change), `d8a49b5` (the Codex review r1 fixes), `9375115` (docs).

**Implementation:** `npm run verify` exit 0 at `d8a49b5` (receipt; it covers HEAD's tree). It printed "No drift. 116 files match upstream" (an upstream sha, not one in this repo) and "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)". Both page `--check` legs passed. Red-arms: link disabled, pinned to `main`, markup in the citation, the lower call site's link dropped, and only one kind linked. Each turned its selftest red on the matching assertion.

**Review:** Codex r1 on `6cc1076`, read-only, banner workdir checked. Four questions found nothing. Two LOW findings were confirmed and fixed in `d8a49b5`: a code comment implied the pinned history's first entry is the dated edit, and the tests covered only an upper `expression` label. The fixes changed tests and a comment, no rendered byte, so they were not re-reviewed.

**Delivery:** `npm run served`: "27 checked — 27 served, 0 in flight, 0 stale, 0 unreachable" against anchor `6cc1076`. CI GREEN for `9375115` (3 completed successes, 0 failures).

**Encounter:** blind. Static Pages, no analytics, no request log. Bug row `A-59`. `npm run reports`: 33 raw issues, 33 ours, 0 outside arrivals.

**Outcome:** open. No read exists.

**Record-facing or instrument-facing:** no catch this round. The work was on the reader's path, not on a record.

## Inputs (controllable)

- Reviews by the other model family: four Codex calls, all foreground and read-only, with banner workdir `C:\dev\skylark\bounds-ledger`. Every finding was dispositioned before push.
  - The claims review of the 25 draw sentences returned 4 BLOCKERs. In those, "found by" turned a credit into a discovery claim, and 84b dropped its quantifiers. All 10 replacements were taken.
  - r1 on `d5012e9`: HOLD, 2 BLOCKER and 2 SHOULD.
    - One BLOCKER was rejected with reasons: it called a retry "naming after the fact", but a retry re-reads under a claim pushed first.
    - The 87a BLOCKER was taken, and moved 87a to DEFECTIVE.
  - r2 on `0c32a8d`: HOLD, 1 BLOCKER and 2 SHOULD. 87a went back to UNRESOLVED, and r2 corrected my wrong expansion "1058.56507…".
  - r3 on `1e5b9fe`: SHIP.
- `npm run verify` receipt: exit 0 at `1e5b9fe` (09:09:26Z). CI GREEN at `1e5b9fe` for `reverify.yml` and `page-check.yml`.
- Hygiene helper: dispatched in P1; one draft line, amended at the close.
- W-7 — the instrument read against its own claim today was `npm run served`.
  - It claims to say whether GitHub Pages serves the bytes HEAD holds.
  - It printed "2 checked — 2 served". Those two were the files the last page-changing commit (`1e5b9fe`) touched: c/87a and the index.
  - The other 46 pages `d5012e9` changed were outside its population, so for them it could not have said STALE.
  - The byte compare of all 116 published files was the read that covered them.

## Outputs (lagging)

- The bar's metric is NOT MEASURABLE: there are no analytics and no request log. The encounter with today's change is blind, tracked on `A-59`, 2026-10-28.
- `npm run reports` was not run today, so no arrivals figure is quoted.
- The live read-verdict count is from a read of every published page at 09:18:41Z: 51 named, 17 unnamed, on 12 pages.
- positive control: each zero in this report came from a read that returned something.
  - check-engineering-zero read 0 findings for this lane, and in the same run listed "8 waived, 6 stale waiver-notes across 26 lanes" for the fleet.
  - The owed-rows read that showed none for this lane read 749 rows.
  - `update-daily-brief.mjs` printed `"ok": true` and listed 23 other lanes' rows it preserved.

<!-- findings:begin -->
- 21a (A-47-0026), on its retry: the journal prints 1988 where the reference entry gives 1987. The verdict on the claim checked (the bound) stays SOUND, and the year is recorded in the entry's evidence. p. 497 reads "Received June 24, 1987", so 1987 is the submission year, not an invented one. It does not reach the page yet: the referenceNote helper must be extended for this entry's plain-key reference line. control: the retry's evidence field in continuity/depth-audit.json quotes "Numer. Math. 52, 483–497 (1988)" and "the reference entry gives 1987".
- 87a (A-47-0075): the row's 1058.565 is 4√70035 = 1058.565066… rounded. It is UNRESOLVED whether the row means an exact upper bound, and the sibling question across other rows is now `A-76`.
- Instrument-facing, from r1: my first A-75 test let through a module script, an `Image` request and a second stylesheet. All three are now asserted and red-armed.
- Instrument-facing, from r2: I wrote 87a's expansion as 1058.56507… when it is 1058.565066…. It was caught before the final push.
- Classification: today's window holds one record-facing finding (the 21a year, a citation-quality difference in a mirrored entry, found by a human reading the cited source in the depth audit) and two instrument-facing ones (the A-75 test gaps and my 87a expansion error). The 87a question is UNRESOLVED and is not classified as a defect.
- No counted catch is quoted, numeric or byte-only, because `npm run catches` was not run today and counts drift detection only.
- The run of consecutive instrument-facing days is 0 after today; 10-10 was 1.
- The standing prediction is consistent with the 21a year, in shape. It is not counted as confirmed, because the year was not the claim that reading checked.
- Day session: 88a (A-47-0013) moved SOUND → UNRESOLVED. The cited journal edition, Algebra & Number Theory 8 (2014), credits 4680 to "the first version of this paper [Polymath 2014a]", and the theorem stating it was read only in arXiv 1402.0811v2, which the entry does not cite. control: c/88a.html served live names the claim and the edition (byte compare of all ten changed files, Last-Modified 16:56:11 GMT).
- Classification, day session: one record-facing finding (88a) and no instrument-facing ones. 88a is a citation-quality defect in a mirrored upstream entry, found by reading the cited source in the depth audit, not by an alarm. That is the standing prediction coming true. Unlike the 21a year, the defect sits inside the claim the reading checked, which was whether the cited source gives 4680, so it counts as confirmed. No counted catch is quoted, because `npm run catches` was not run and counts drift detection only. The run of consecutive instrument-facing days stays 0.
<!-- findings:end -->

## Recommendation

- [B] 2026-10-12: `A-63`, read the remaining 8 under their pushed claims (all chosen for suspicion; 1b's five as one page). Also `A-54` census session 8. (Was 17 at the cycle-6 close; the day session read nine.)
- [B] 2026-10-13: `A-47` slice 17 under a new grid, written down and computed before the draw.

## On hold pending data

- **The encounter with today's change:** blind until `A-59` (encounter is blind on the public pages) is read on 2026-10-28.

## State Appendix

Written last. As of 12:05Z, HEAD was `0958a39` and equal to origin/main; this report's own commit comes after it. Release: `git -C C:/dev/skylark/bounds-ledger rev-parse HEAD origin/main`.

- **Pending reads:**
  - 2026-10-12: `A-63` (a constant page does not say which claim a verdict checked), `A-54` (the Small Ramsey Numbers census), `A-2` (the drift-resolution log).
  - 2026-10-13: `A-47` (the depth audit), `W-13` (someone must call the served-bytes check), `A-69` (a matched row's values on a phone).
  - 2026-10-14: `A-76` (upper-bound rows cut below their source), `A-50` (importing a CLI script can run it), `W-14` (watch issue #218 for a maintainer reply).
  - 2026-10-18: `A-45` (the tier-1 leading indicator).
  - 2026-10-28: `A-59` (encounter is blind on the public pages), `A-70` (phone-sized row links and the copy button).
- **Codex:** 4 calls, all foreground read-only reviews.

### Close

Cycle 6 close, written 2026-10-11 06:05 MT, on the manager's review `309ff964` (COMPLETED, no defects).

`ACTION: COMPLETED · item A-63 · P3 b5aec050`. The acceptance in force was met:
- store count 25 → 17;
- Grep 19 → 12 files;
- live phone frame of c/19a;
- the Codex sentence review before the draw push, plus three review rounds before the result was final;
- every moved verdict named (87a, DEFECTIVE then UNRESOLVED; it was never pushed as anything but UNRESOLVED at the final tip).

**State changed since the P3 post:** none on the public pages. The Pages build for `0a202d8` succeeded at 09:30:08Z (the manager's read).

**Ledger delta** (`0958a39`):
- `A-75` CLOSED. Its closeWhen was met, and the red-arm output is on `redArm2026_10_11`.
- `A-45` re-dated to 2026-10-18 with `--set expectedSignalBy`. That AMENDS the hygiene draft's `--extend`. The reason is on `redated2026_10_11`.
- `A-47`: `slice16Result2026_10_11` recorded. nextCheckDate moves to 2026-10-13 (2026-10-12 is the census day), and a new grid is owed.
- `A-63.openAfterCycle6_2026_10_11` created. It holds the manager's one carry: the 2026-10-12 read should show an unnamed count LOWER than 17, not zero.
- `A-76` minted (87a's sibling question), next check 2026-10-14.

**Hygiene draft:** 1 line, AMENDED (`--set expectedSignalBy`, never `--extend`). READ-MUTATED: "none — 1 read guarded". Its two checks:
- check-wait-justification: "RESULT: PASS — 1 of 92 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)";
- check-engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".

**Due gates:** `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." against the snapshot "CURRENT (taken 2026-10-11)".

**Today panel:** written with `--date 2026-10-10`. `update-daily-brief.mjs` printed `"ok": true`, `"shaSource": "contents"` (a commit made through the GitHub contents API on skylark-site's remote, not fetched into any local checkout) and "local sync OK".

**Receipt:** P3's still holds (`b5aec050`); nothing new.

**Pending reads:**
- 2026-10-12: `A-63`, the unnamed count, expected below 17; and the `A-54` census.
- 2026-10-13: `A-47` slice 17 (grid owed) and `A-69`.
- 2026-10-14: `A-76`.
- 2026-10-18: `A-45`.
- 2026-10-28: `A-59`, the encounter read.

### Close — day session round 1

Written on the manager's review (inbox `8a53e2c4`), verdict COMPLETED with no defects.

`ACTION: COMPLETED · item A-63 · P3 9e4b8a40`. The acceptance in force, the P1 APPROVE, was met:
- Store count 17 → 8.
- Grep 12 → 3 files (the manager re-read it on origin/main).
- All ten changed files served byte for byte (the manager's fetch re-confirmed it).
- Codex r1 SHIP before any stranger could read the pages.

**State changed since the P3 post:** none on the public pages. The manager read Last-Modified 16:58:55 GMT, the Pages build for `84beeca`. That commit changed no page.

**Ledger delta:** `A-63.dayBatch2026_10_11`, recorded in `84beeca` before the P3 post. No other row changed today in this session. `A-63` stays open, with nextCheckDate 2026-10-12.

**Hygiene draft:** 0 lines, so 0 accepted, 0 amended and 0 rejected. READ-MUTATED: "none — 0 reads guarded (no `--run` executed)". Its two checks:
- check-wait-justification: "RESULT: PASS — 1 of 93 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
- check-engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".

**Due gates:** `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." against "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-10-11)".

**Today panel:** written with `--date 2026-10-11`. `update-daily-brief.mjs` printed `"ok": true` and "local sync OK".

**Receipt:** P3's still holds (`9e4b8a40`); nothing new.

**Pending reads:**
- 2026-10-12: `A-63` (a constant page does not say which claim a verdict checked), the 8 suspicion entries (10a ×2, 87a, 1b ×5); `A-54` (the Small Ramsey Numbers census), session 8; `A-2` (the drift-resolution log).
- 2026-10-13: `A-47` (the depth audit), slice 17 with its grid owed; `W-13` (someone must call the served-bytes check); `A-69` (a matched row's values on a phone).
- 2026-10-14: `A-76` (upper-bound rows cut below their source); `A-50` (importing a CLI script can run it); `W-14` (watch issue #218 for a maintainer reply).
- 2026-10-18: `A-45` (the tier-1 leading indicator).
- 2026-10-28: `A-59` (encounter is blind on the public pages), the encounter read.

**Not done, and not owed today:**
- A reference note on c/88a through the `A-74` helper. This is lane authority.
- Any upstream contact about 88a. That is outward: it needs an adversarial review and a card for David before anything is sent.

### Close — day session round 3

ACTION: COMPLETED · item A-63 · P3 4bc47d59

The manager's review (inbox `726dea7d`) marks it COMPLETED with no defects, from its own read of origin/main and the live site. The acceptance condition was the P1 packet plus the APPROVE: every read verdict names its claim, and no page is left half-cleared. The store shows 0 of 68 read verdicts without a named claim, and `c/` has 0 pages with the unnamed line.

**Verdicts that moved in round 3, recorded as found:**
- 10a row 33 (A-47-0001) went from UNRESOLVED to SOUND.
- 87a [Mar2006] (A-47-0003) went to DEFECTIVE in `08d5e80` and back to UNRESOLVED in `0d35938`, after Codex review r1.

**State changed since the P3 post:** `718f624` (the report and ledger record, doc-only) was pushed. The manager's own read found index.html, the five changed pages, c/15a, c/26a and `continuity/depth-audit.json` all SHA-256-equal to their origin/main blobs.

**Ledger delta:**
- `A-63` CLOSED 2026-10-11, its note citing the three closeWhen legs: 0 of 68 unnamed; the self-test in `a75eea8` and `e920910`; c/15a and c/26a read live. The id sweep found 130 hits in 22 files. The 6 in `scripts/render-constant-pages.mjs` are provenance labels for code that stays; the other 21 files are dated primers and reports; top-level docs have 0.
- `A-47.pending87aMar2006_2026_10_11`: 87a's open question, carried as a pending read rather than closed. What settles it is the thesis title page or a library record. Trigger: the next depth-audit session (nextCheckDate 2026-10-13) or any session with a library route.

**Hygiene draft:** 0 lines (0 accepted, 0 amended, 0 rejected). READ-MUTATED: "none — 0 reads guarded (no `--run` executed)". Its two checks:
- check-wait-justification: "RESULT: PASS — 1 of 93 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
- check-engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".

**Due gates:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned.", against "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-10-11)".

**Today panel:** written with `--date 2026-10-11`; `"ok": true`, "local sync OK".

**Receipt:** P3's (`4bc47d59`) still holds; nothing new.

**Pending reads:**
- 2026-10-12: `A-54` (the Small Ramsey Numbers census), session 8; `A-2` (the drift-resolution log).
- 2026-10-13: `A-47` (the depth audit), slice 17 with its grid owed, plus the 87a pending read; `W-13` (someone must call the served-bytes check); `A-69` (a matched row's values on a phone).
- 2026-10-14: `A-76` (upper-bound rows cut below their source); `A-50` (importing a CLI script can run it); `W-14` (watch issue #218).
- 2026-10-18: `A-45` (the tier-1 leading indicator).
- 2026-10-28: `A-59` (encounter is blind on the public pages).

**Primer:** `docs/cold-starts/2026-10-12.md`, the date `npm run close:primer` expects. It printed "RESULT: FAIL — no cold-start primer for tomorrow (2026-10-12 MT)" before this close.
