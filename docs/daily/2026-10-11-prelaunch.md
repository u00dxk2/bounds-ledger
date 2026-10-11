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
<!-- findings:end -->

## Recommendation

- [B] 2026-10-12: `A-63`, read the remaining 17 under their pushed claims, as many as can be read with care. Also `A-54` census session 8.
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
