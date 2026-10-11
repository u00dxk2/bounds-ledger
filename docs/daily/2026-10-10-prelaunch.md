---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-10
lifecycle_stage: launched
last_deploy: 618565c (the last page-changing push; npm run served read 2 of 2 served at 16:54:19Z, and c/43a and c/54a matched HEAD byte for byte at 16:54:45Z)
on_hold_items: 1
top_action_today: A-74, two constant pages now say where the paper's own citation differs from the reference entry
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-10 (Saturday, MT)

## BLUF

Two constant pages now tell a reader where the paper's own printed title or page range differs from the reference the table gives. We also read 32 more Small Ramsey Numbers bounds against their sources.

No first command: the change is live, and tomorrow's first command is in the primer.

## What changed

- `A-74` (two differences between a mirrored entry and its source) shipped and closed. c/43a and c/54a each print a sentence after the reading, under "About the reference itself, not the bound", putting what the paper prints first and what the entry gives second. Commits `860fb33` and `618565c`; live since the Pages build of 16:50:28 GMT.
- `A-54` (the Small Ramsey Numbers census) session 7 read 32 bounds: plan `2f6f487`, readings `8f5e0b8`. `node scripts/ds1-depth.mjs`: "census: 112 of 122 bound(s), across 35 of 42 credited paper(s) — 49 sound, 0 defective, 44 unresolved, 19 unreachable".
- The ledger closed `A-74` and recorded census session 7 on `A-54` in `c686ccd`.

### P1 selection packet

Posted as bus `e972fc97` before any work, and approved (inbox `935db40f`).

**Outcome:** two constant pages tell the reader where the paper's own printed citation differs from the citation the mirrored entry gives. Item `A-74` (two differences between a mirrored entry and its source, found by reading), option (a) on its own row: show them.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a bound and a referee told me it had been improved. I had no way to know." The same reader, at the moment of citing, takes the reference from the entry. On 43a and 54a that reference does not match what the paper prints, and today neither page says so.

**Evidence**
- OBSERVED today (Grep, the mirror): `ledger/teorth-optimizationproblems/constants/43a.md:39` gives the title "*Remarks on steiner minimal trees.*"; `ledger/teorth-optimizationproblems/constants/54a.md:73` gives "no. 7, 3603–3613".
- OBSERVED 2026-10-09, NOT re-read today: the 43a paper's p. 177 prints "A REMARK ON STEINER MINIMAL TREES"; the 54a article's p. 3603 masthead reads "Pages 3603–3612" (quoted in `A-47-0071.positiveControl`), and its last page is numbered 3612. Both are to be re-read from the page images before either is stated (the row's own rule).
- OBSERVED today: neither page carries either difference. The `A-74` readCommand printed nothing (exit 1). Its positive control printed `c/43a.html:1` and `c/54a.html:1`, so the right files were read.
- MISSING: the slice 15 saved copies. Glob over `tmp/depth-reads/**` finds no 43a or 54a file, so the sources are fetched again: the 43a scan from R. L. Graham's papers page, and the 54a PDF from the Internet Archive capture the entry records.
- OBSERVED today, real users: `npm run reports` printed "OUTSIDE ARRIVALS: 0" of 33 raw issues (33 + 0 + 0 = 33). This is the only arrival signal. The bar's metric is NOT MEASURABLE: there are no analytics and Pages provides no request log.
- OBSERVED today: `check-cycle-rotation.mjs --lane bounds-ledger` reported no product-love cycle due (exit 0). `answered-cards.mjs` reported no David-word cards.

**Permission.** `A-74` is open and not parked, and no board card covers it. Its row dates the choice to 2026-10-11 and records the lane's recommendation as (a). I am pulling it forward one day as a reader-facing page change under lane authority (David's 80% product ruling). That frees 10-11 for `A-47` slice 16. The change is not outward contact: reporting either difference upstream stays excluded, and still needs an adversarial review and David's word. Because the page is public, it gets a read-only review from the other model family (Codex) before push (David, 2026-08-01).

**Next action:** improve. First command (PowerShell; create `tmp\a74` first), which re-reads the 43a source before anything is written:
```
Invoke-WebRequest -Uri "https://mathweb.ucsd.edu/~ronspubs/76_10_steiner_trees.pdf" -OutFile "C:\dev\skylark\bounds-ledger\tmp\a74\gh1976.pdf"
```
Then:
1. Re-read 54a's first and last pages from the archived PDF.
2. Add one reader-facing store field per entry (`A-47-0069`, `A-47-0071`; not `notes`), one plain sentence each.
3. Have `scripts/render-constant-pages.mjs` print the field beside the reading, with a guard: the sentence appears only on its own entry, and it never says the bound or the verdict changed.
4. Red-arm the guard, run the Codex review, push, and read both live pages.

**Acceptance:**
- On HEAD, the `A-74` readCommand prints both `c/54a.html` and `c/43a.html` (exit 0).
- The Pages response for both pages equals `git show HEAD:c/<id>.html`, byte for byte.
- Each sentence is restated from a page image seen today, never from the row's note.

**Delivery and encounter:**
- Delivery: `npm run served`, plus a byte comparison of both pages, after the Pages build for the push.
- Encounter: blind. There are no analytics and no request log; this is tracked on `A-59` (encounter is blind on the public pages), read on 2026-10-28.
- The only event that could appear is a report filed through either row's "looks wrong?" link, counted by `npm run reports` and readable at N = 1. It reads 0 of 33 this morning.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, `scripts/render-constant-pages.mjs`, `c/43a.html`, `c/54a.html`; also `continuity/items.json` (the `A-74` row, internal).

**Running beside it (a dated standing obligation, not the choice): `A-54` census session 7** (the rebuild of the Small Ramsey Numbers table from its credited papers).
- Tripwire applied first, per `rebuildCheckpoint2026_09_28`: 13 papers remain (`census6_2026_10_08`: 11 of Table Ia's 42 credited papers, plus AnM2 and AnM3). The capacity is 4 × 4 slots (10-10 through 10-16) = 16, so the wire does not fire and completion stays 2026-10-20.
- Plan, in the order `ds1-depth.mjs --frame` derives: HW+ (25 bounds, one access budget, already known to be hard to reach), Tat (2), Math (3), HZ2 (2), 32 bounds in all.
- The plan touches only `continuity/depth-audit-ds1.json`, which the selected change does not touch. So I will commit and push the plan right after this post, before any source is opened, and then read under `blockedSourceRule2026_09_25`. Say so if you want it held instead.
- Census rows stay off both pages while the 2026-09-20 freeze holds.
- Free memory read 9.37 GB, under the 10 GB heavy-job bar, so reading agents are dispatched one at a time.

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice: 1, `A-54`. It is worked today as census session 7 above, and its disposition is that session's record plus `expectedSignalBy` stepped to 2026-10-12.
- (b) Owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger", 0 of 748.
- (c) State reads marked CROSSED: none. Read: the kickoff's state block (dated gates, owed rows, board cards, prior retro, primer, banner, listener, HEAD CI, report artifact, queued rows, key numbers, stale-actionable, missingLinkedCommits). One read is not green: key numbers reads "no list yet" (`docs/key-metrics.json` absent). That is not measured, not a zero.

**Section 0**
- Primer read.
- Listener 🟢: SSE hello at 14:56:16Z, loop ticking by tool call.
- Codex GREEN: the probe line on the kickoff.
- CI GREEN at `610d830` for both `reverify.yml` and `page-check.yml` (`check-ci-status`, exit 0 each).
- Deploy drift: not swept. This is a Pages lane, and no Render service is declared, so it is neither a stop nor a pass.
- Harness: running 2.1.296 · fleet UNIFORM · installed 2.1.296 (SAME).
- `npm run verify` receipt exit 0 at `610d830` (15:03:39Z).
- Due-gates snapshot taken: "1 gate(s) due on/before 2026-10-10", `A-54`.
- Recommendations from yesterday:
  - (1) Verify, then `A-54` session 7: carrying today, beside P3.
  - (2) Slice 16: carrying to 2026-10-11.
  - (3) Report upstream: not asked; David's call.

**Prior-day retro finding that bears on the choice:** 10-09's Q4 (the two differences, row `A-74`) is exactly what is selected.

### P3 product work

**Action (improve):** the manager approved the selection (inbox `935db40f`). Its two points were checked, not assumed:
- The 54a sentence states the disagreement and names Crossref as agreeing with the entry. Crossref's record was read today: "page: 3603-3613".
- The title-case hypothesis held: the case-sensitive readCommand matches "A Remark on Steiner".

The two sentences, as live:
- c/43a: "About the reference itself, not the bound: The paper's first page (p. 177) prints its title in capitals as A REMARK ON STEINER MINIMAL TREES, that is, "A Remark on Steiner Minimal Trees"; the table's reference entry for [GH1976] gives the title as "Remarks on steiner minimal trees"."
- c/54a: "About the reference itself, not the bound: The article's first page gives its pages as 3603–3612, and its last page is numbered 3612; the table's reference entry for [BJ2008] gives 3603–3613, as does Crossref's record for the article."

Both were restated from page images viewed today: the 1976 scan on R. L. Graham's papers page, and the Internet Archive capture of the AMS PDF dated 2024-03-29.

**Implementation:**
- Two store fields on `A-47-0069` and `A-47-0071`: referenceNote and referenceNoteEntryText.
- A renderer guard. The sentence is printed only when its quoted text stands on the entry's own reference line, found by the exact bold key with exactly one line carrying it. Otherwise it is withheld. Malformed shapes are refused by name.
- Seven mutations, each tripping the assertion written for it; the list is in the bodies of `860fb33` and `618565c`.

**Delivery:**
- `npm run served` at 16:54:19Z: "2 checked — 2 served, 0 in flight, 0 stale, 0 unreachable".
- A byte comparison at 16:54:45Z: both live pages equal `git show HEAD`.
- `A-74`'s readCommand on HEAD printed `c/43a.html:1` and `c/54a.html:1` (exit 0). It printed nothing this morning.

**Encounter:** blind, tracked on `A-59` (encounter is blind on the public pages), read 2026-10-28.

**Outcome:** open.

### Census session 7, beside it

- **Tripwire:** it did not fire. 13 papers were left against 4 × 4 slots = 16.
- **HZ2:** 2 SOUND. The 1998 paper's abstract and Table 2 state both bounds, and the page images were viewed.
- **Tat:** 2 SOUND by recomputation of the credited graph files.
  - R(6,11) ≥ 262 passed both exhaustive methods on 261 vertices in 57 minutes.
  - The checker was re-armed today on a planted K7 and printed "RESULT: FAIL", exit 1.
- **HW+:** 25 UNRESOLVED. Only the abstract has ever been reached, and Elsevier blocked the body.
- **Math:** 3 UNREACHABLE. Only metadata was reached.
- Census rows stay off both pages under the 2026-09-20 freeze.

### Cycle 4 — P1 selection packet

Cycle 4 of a continuous session. The lead arrived as inbox `853f8a78` and this phase's prompt as `c4f16958`.

**Outcome:** four more constant pages say WHICH claim their reading checked. Item `A-63` (a constant page does not say which claim in a row was checked). Today the two DEFECTIVE verdicts on the site (c/46a, c/8a) and two systematic UNRESOLVED ones (c/20a, c/35a) tell a reader that a source was read and does not support, or cannot settle, "the claim we checked in this row" — and then say "This page does not yet say which part of the row that reading checked."

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "is the number I already have still true". A reader about to cite 58/15 on 46a, or 9.64591 on 8a, is told our reading does not support the row. They cannot tell whether that verdict is about the value, the attribution or the reference. That is exactly the decision they came to make.

**Evidence**
- OBSERVED tonight, the store (`continuity/depth-audit.json`, a node read of every entry): 71 entries, 64 with a read verdict, 29 of those with no `claimReader`. Those are the same 29 the row recorded on 2026-10-05, so no slice since then has reached one.
- OBSERVED tonight, the pages: Grep of `c/` for "This page does not yet say which part" matches 23 files. That reconciles with 29 entries: 10a carries 3 and 1b carries 5 (29 − 2 − 4 = 23). The positive control is that c/46a, c/8a, c/20a and c/35a are among the 23.
- OBSERVED, the four entries: `A-47-0030` (46a, [Bo1991], DEFECTIVE), `A-47-0036` (8a, [S1970], DEFECTIVE), `A-47-0005` (20a, [KL2025], UNRESOLVED, whose sourceRead says "settles part of the row and cannot settle the rest"), and `A-47-0028` (35a, [B2015], UNRESOLVED, a "see, e.g." pointer under a Folklore credit). These are the only two DEFECTIVE verdicts in the store. 20a is the example `A-63`'s own note names.
- OBSERVED tonight, real users: `npm run reports` printed "OUTSIDE ARRIVALS: 0" of 33 raw issues (33 + 0 + 0 = 33). The bar's metric is NOT MEASURABLE: there are no analytics and Pages provides no request log.
- OBSERVED tonight: `check-cycle-rotation.mjs --lane bounds-ledger` printed "UNDETERMINED — journey-walk: no journey-walk artifact on record for bounds-ledger; the registry does not declare which lanes owe one" (exit 2, REVIEW). That is not "nothing due". It is a registry gap about journey-walk, the same gap this morning's exit-0 read did not show. `answered-cards.mjs`: no David-word cards.
- HYPOTHESIS: the saved copies for 46a (`tmp/depth-reads/a56/gdz/`) and 8a (`tmp/depth-reads/slice8/8a/`) still exist, so those two re-reads need no new fetch. NOT checked yet. If they are gone, the sources are fetched again from the routes each entry records.
- MISSING: any reader's report of confusion on these four pages. The case rests on the pages' own text, not on an observed reader.

**Permission.** `A-63` is open, not parked, with no board card. Its row licenses this route in writing: the 29 "are never back-filled", and each "is re-read under a claim named first when the A-47 ladder or a retry reaches it". This is a retry under that rule, on lane authority, as a reader-facing page change (David's 80% product ruling). It is not outward contact. Because the pages are public, the four claim sentences get a read-only review from the other model family before any reading, since a claim sentence is a method sentence. The diff gets a second review before push (David, 2026-08-01).

**Next action:** improve. Write the four claims first, in reader-facing words, scoped to what each row says. Store them on the `A-63` row and push before any source is opened. Then re-read each source under its claim and record the result on the existing entry (retry, under `collisionRule2026_10_01`'s shape). The verdict may move, and a moved verdict is reported as such. Finally re-render and red-arm. First command, the baseline count before anything changes:
```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs
```

**Acceptance:**
- Grep of `c/` for "This page does not yet say which part" matches 19 files, none of them 46a, 8a, 20a or 35a.
- Each of those four pages carries "the claim we checked:" followed by the pre-pushed claim, verbatim.
- The claim-push commit precedes every reading agent's first fetch timestamp.
- `render-constant-pages.mjs --check` passes.
- The live pages equal `git show HEAD:c/<id>.html` byte for byte.

**Delivery and encounter:**
- Delivery: `npm run served`, plus a byte comparison of all four pages after the Pages build.
- Encounter: blind, tracked on `A-59`, read 2026-10-28. The only event that could appear is a report through one of these rows' "looks wrong?" links, counted by `npm run reports` and readable at N = 1. It reads 0 of 33 tonight.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, `c/46a.html`, `c/8a.html`, `c/20a.html`, `c/35a.html`; `index.html` only if a verdict moves; `scripts/render-constant-pages.mjs` only if the retry shape needs it; `continuity/items.json` (the `A-63` row, internal).

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice: none. Read: the kickoff's "dated gates due today", 0. The morning snapshot holds `A-54`, already worked in round 1. My re-snapshot tonight was refused (exit 2) because it would have dropped `A-54`, and the morning file is unchanged.
- (b) Owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger", 0 of 749.
- (c) State reads marked CROSSED: none. Read: the kickoff's state block. Key numbers reads "no list yet", which is not measured, not a zero.

**Section 0**
- Primer read.
- Listener 🟢: SSE hello at 02:15:20Z.
- Codex GREEN: the probe line on `c4f16958`.
- CI GREEN at `3dbcaf3` (the kickoff's read).
- Deploy drift: not swept. This is a Pages lane with no Render service declared.
- `npm run verify` receipt exit 0 at `3dbcaf3` (02:33:45Z): 244 claims, 242 hold, 0 broken or unreachable.
- Free memory 17.3 GB.
- Carried to 2026-10-11, not this cycle: `A-47` slice 16 (draw 506 556 606 656, pushed before reading) and `A-45`.

**Prior-day retro finding that bears on the choice:** 10-09 Q0, "a field padded past what the entry's own evidence shows", recurred mildly that day. Writing four claims is exactly where it would recur, so each claim is scoped to the row's own words and nothing more, and that is the review's first angle.

### Cycle 4 — P3 product work

**Action (improve):** the manager approved the selection (inbox `32e7624e`) with three holds: no repeats, read deeper, and a claims pass. Four pages now say which claim their reading checked.

| Page | Entry | Live before | Live now | What the page says was found |
|---|---|---|---|---|
| c/46a | `A-47-0030` | does NOT support | does NOT support | The paper's condition works out to p > 31/8; 4 − 2/15 was not found in the pages read; its note added in proof points to Bourgain's companion paper. |
| c/8a | `A-47-0036` | does NOT support | could not settle | The Russian original gives R = 9.65; the English translation the entry cites could not be read; Rosser and Schoenfeld's R rounds to 9.64591. |
| c/20a | `A-47-0005` | could not settle | supports | Read in the body this time: Theorem 1.1 states the variance bound, and the paper says σ_n ≤ C follows. |
| c/35a | `A-47-0028` | could not settle | could not settle | The book's overview states an O(1/k) bound under "some reasonable conditions"; whether those cover this constant's class was not checked. |

**Implementation:**
- Claims named first. Codex reviewed the four sentences before any reading (46a, 20a and 35a CHANGE; 8a OK; all applied). The draw went to `A-63` in `7908972`, committed 03:03:52Z and pushed before any source was opened. The agents' first requests were at 03:08:07Z, 03:08:36Z and 03:10:59Z; 46a used saved page images and no network.
- Read deeper, as the manager asked. 20a was read in the paper's body and its verdict settled. 35a's Section 6.1 was tried by four routes (the author's site, Athena Scientific, Google Books, the Internet Archive) and not reached. So the manager's hypothesis held for 35a and not for 20a.
- The retries are in `89a2282`; the review fixes are in `faddb9d`. No renderer change was needed.
- Red-arm: with the store updated and the pages not re-rendered, `render-constant-pages.mjs --check` printed "RESULT: FAIL — 0 missing, 0 orphaned, 4 stale constant page(s)", naming 8a, 20a, 35a and 46a (exit 1).

**What the review caught before the push.** Codex round 1 on `89a2282` returned HOLD with two blockers, and both were verdicts I had got wrong:
- 8a: I kept DEFECTIVE although the English edition the entry cites was not read. That is the edition rule, broken again (46a on 09-24 and 8a itself on 09-27 are the earlier cases). It is now UNRESOLVED, which re-opens the 2026-09-29 settlement.
- 35a: I stored SOUND, reasoning that the narrowed claim asks only what the book states. The review held that a conditional overview statement does not establish the listed exponent's scope. It stays UNRESOLVED.
- Two SHOULDs and two NITs were also taken: 46a's absence claim was narrowed to the pages read, a repeated locator on 35a was cut, 8a says "rounds to", and 20a says who read text and who checked images.
- Round 2 on `faddb9d` returned SHIP, with no changed public sentence refuted.

**Sibling sweep** for whole-source absence claims in published result and source-note sentences (3 hits in `continuity/depth-audit.json`):
- 5b (`A-47-0032`) said "it never prints 3/5 on its own" with six pages unread. It is narrowed to "the pages read".
- 32a (`A-47-0042`) says "The preprint never prints 3.45". The entry does not record whether the whole preprint was read, so it is not changed and is carried on `A-63`.
- The third hit is 8a's own new wording, scoped to the original, which was read in full.

**Delivery:**
- `npm run verify` receipt exit 0 at `faddb9d` (04:23:02Z).
- `npm run served` at 04:24:51Z: "6 checked — 6 served, 0 in flight, 0 stale, 0 unreachable".
- A direct read at 04:25:24Z: all four pages HTTP 200, last-modified 04:23:48 GMT, byte-equal to `git show HEAD`, each carrying "the claim we checked: that".
- Grep of `c/` for "This page does not yet say which part": 19 files, none of the four (23 before). The store holds 25 read verdicts with no named claim (29 before).

**Encounter:** blind, tracked on `A-59` (encounter is blind on the public pages), read 2026-10-28. `npm run reports` read 0 outside arrivals of 33 tonight.

**Outcome:** open.

**What remains:** `A-63` stays open on the 25 unnamed verdicts. 8a needs the body of Math. Notes 8(4):706–711. 35a needs Section 6.1 of the book. The 32a sentence is carried.

### Cycle 5 — P1 selection packet

Cycle 5 of the rolling session. The lead and this phase's prompt arrived together as inbox `034e8dcf`.

**Outcome:** a reader on any constant page can take the citation away with one tap, and reach the page's links with a thumb. Item `A-70` (on a phone the index rows' page and cite links are 20 to 22px tall, and the citation block has no copy button), extended from the index to the 115 constant pages.

**The user problem, in the user's words** (the lead's, after `docs/evangelism-bar.md`): "Let me just cite this." The constant page is where a reader lands from a search or a shared link, and it ends in a "Cite this row" block. To take that citation away today, a phone reader long-presses and drags across five or more lines of monospace text.

**Evidence**
- OBSERVED, the lead's premise is half stale. The index half of `A-70` shipped on 2026-10-04 (`5f42ce7` through `b1e6b08`; the row's `shipped2026_10_04` field records 45px controls and 115 copy buttons, read live that day). The row has been `monitoring` since.
- OBSERVED tonight, the live index, without a browser (a fetch at 05:06:13Z): HTTP 200, last-modified 04:51:14 GMT, byte-equal to `git show HEAD:index.html`. It carries "min-height:44px" twice, one "Copy citation" in its script, one clipboard call, 115 cite blocks for 115 rows, and no script or stylesheet from another host. So the 10-04 ship is still being served.
- OBSERVED tonight, the constant pages: Grep of `c/` for "Copy citation" or a script tag returns 0 matches in 0 files. The positive control is that the same search for the cite block's class matches all 115 pages. So no constant page has a copy button, and none carries any script at all.
- OBSERVED, c/8a.html lines 32 to 41: three inline links a dot apart ("the mirrored file", "upstream source", "looks wrong?") and a five-line "Cite this row" block. Each bound's line in that block already carries its dated label, such as "(tracked since 2026-07-24 — no movement seen yet)".
- MISSING: every pixel measurement. Free memory read 7.56 GB a few minutes before the 05:06Z fetch above, under the 10 GB bar for a browser job, so the 393x659 read of the live index and of a constant page is not taken yet. It is the first step of the work, once memory allows.
- MISSING: WebKit. The 10-04 measurements were Chromium with an iPhone user agent, and the row says so.
- OBSERVED tonight, real users: `npm run reports` read 0 outside arrivals of 33 raw issues earlier tonight, before the cycle-4 selection post of 02:40Z (33 + 0 + 0 = 33). The bar's metric is NOT MEASURABLE.
- OBSERVED tonight: `check-cycle-rotation.mjs --lane bounds-ledger` printed "UNDETERMINED — journey-walk: no journey-walk artifact on record for bounds-ledger" (exit 2, REVIEW), the same registry gap as in cycle 4. `answered-cards.mjs`: no David-word cards.

**Permission.** `A-70` is `monitoring`, not parked, with no board card. Its encounter read stays owed on 2026-10-28 and is untouched by this. The change is to our own pages under lane authority (David's 80% product ruling). It is not outward contact and adds no reader instrument: a copy press is not counted, and the pages keep loading nothing from another host. Because the pages are public, a read-only review from the other model family comes before the push.

**One reading of the lead to confirm at review.** The lead asks for a button "that copies the citation with the verdict date in it". I read "verdict date" as the dated label each bound's line already carries in the cite block. The button will copy the block's own text, so the copied citation cannot differ from the shown one. I do not plan to add the depth-reading verdicts ("supports", "could not settle") to the citation: that would be new public text about our own method, and it would need its own claims pass. Say so if the reading verdict is what was meant.

**Next action:** improve. First, when 10 GB is free, measure the live index and c/8a at 393x659 (iPhone 15 emulation). Then, in `scripts/render-constant-pages.mjs`: a 44px floor on the three action links at phone width only, and a "Copy citation" button inserted by script inside the cite block, copying the block's text, with the same fall-back the index has when the clipboard refuses. Then a self-test with both answers, a red-arm, the Codex review, the push and the live read. First command:
```
node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --selftest
```

**Acceptance:**
- On the live c/8a at 393x659, each of the three action links measures at least 44px tall, and the cite block has a "Copy citation" button of at least 44px.
- One tap copies text equal to the cite block's text; the pasted text is quoted in the post.
- 1440x900 reads unchanged for the action links and the cite block's position.
- All 115 constant pages carry the button's script, and none loads anything from another host.
- `render-constant-pages.mjs --check` passes, and the live pages are byte-equal to HEAD.
- Frames of the live index and of one constant page at 393x659, taken after the deploy.

**Delivery and encounter:**
- Delivery: `npm run served`, a byte comparison, and the browser read above.
- Encounter: blind, tracked on `A-59` (encounter is blind on the public pages), read 2026-10-28. The only event that could appear is a report through a "looks wrong?" link, counted by `npm run reports` and readable at N = 1.

**USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs`, `c/*.html` (115 files); `continuity/items.json` (the `A-70` row, internal). `index.html` only if the live read finds a regression.

**HYGIENE INPUTS** (copied from the cycle-4 kickoff's reads; this lead carried no state block of its own)
- (a) Due rows not bearing on the choice: none. Read: "dated gates due today", 0. `check-due-gates-dispositioned` printed CLEAR against this morning's snapshot at the cycle-4 close.
- (b) Owed child rows: none. Read: "rows owed to you in skylark-site's ledger", 0 of 749.
- (c) State reads marked CROSSED: none. Key numbers reads "no list yet", which is not measured, not a zero.

**Second, if time:** `A-69` (a screen reader still hears the verdict first, and the matched value is not marked). It needs a WebKit browser read first, which is also behind the 10 GB bar.

**Prior-day retro finding that bears on the choice:** none recurred. The 10-09 finding about a padded field does not apply to a control that copies existing text.

## Inputs (controllable)

- Reviews by the other model family: three runs of Codex (read-only, foreground). The banner workdir was `C:\dev\skylark\bounds-ledger` each time, and every finding was taken before push.
  - `A-74` round 1, on an earlier form of `860fb33`: FIX-THEN-PUSH.
    - 1 BLOCKER: the first guard matched the quoted text anywhere in the file, so an old wording surviving elsewhere would keep the sentence printed after the entry changed.
    - 1 SHOULD: the placement test counted the label, not the sentence.
  - `A-74` round 2, on `860fb33`: FIX-THEN-PUSH, 2 SHOULD (two guards untested). Fixed in `618565c`.
  - Census round 1, on an earlier form of `8f5e0b8`: FIX-THEN-PUSH, 2 SHOULD and 1 NIT.
    - An HW+ note said the cells "are not the paper's own values" where the survey says "most"; it was narrowed in all 25 rows.
    - Two commit-message sentences.
- `npm run verify` receipt: exit 0 at `618565c` (16:49:53Z). CI GREEN at `618565c` for `reverify.yml` and `page-check.yml`. The manager's review reports `c686ccd`'s CI green too: page-check, reverify and the Pages build.
- Hygiene helper: dispatched at P3 start; one draft line, applied at the close.
- W-7 — the instrument read against its own claim today was `check-next-primer-exists.mjs`.
  - It claims to say whether the next primer is on disk.
  - At the close it printed "PRESENT docs/cold-starts/2026-10-10.md · primer offset +0", a file yesterday's close wrote, while tomorrow's `docs/cold-starts/2026-10-11.md` did not yet exist.
  - This lane names a primer for the day it is FOR, while the checker reads the day it was WRITTEN. So before tonight's primer is written, it can only say PRESENT; its output could not have said otherwise.
  - `npm run close:primer`, which checks tomorrow's MT date, is the lane's own read of that question.

## Outputs (lagging)

- The bar's metric is NOT MEASURABLE: there are no analytics and no request log. The encounter with today's change is blind, tracked on `A-59`, 2026-10-28.
- `npm run reports` this morning: "OUTSIDE ARRIVALS: 0" of 33 raw issues (33 + 0 + 0 = 33). It was not re-run after the push.
- positive control: the reports probe fetched 33 issues and classified every one; `check-engineering-zero`, which read 0 findings for this lane, named a finding in another lane (buddha-ur) in the same run; and the findings read below returned four instrument-facing findings, so each zero above came from a read that returned something.

<!-- findings:begin -->
- My first form of the `A-74` guard checked the quoted entry text against the whole mirror file. An old wording surviving in another reference, or in a table row, would have kept "the entry gives" printed after the entry itself changed. The cross-family review caught it before push, and the guard now reads the entry's own reference line.
- Red-arm M1 first tripped a count assertion that sits before the withholding guard, so the guard it was meant to prove never ran. The assertions were reordered so each mutation names its own property. That is the assertion-order trap in this repo's KP-78 (prove the instrument can fail) notes, met again. control: the first run's log was overwritten by the re-run after the reorder, so tmp/a74/redarm-M1-no-withholding.txt now holds the WITHHELD message; the first run's count-assertion message survives only in this session's transcript, so that sentence rests on the transcript, not on a saved file.
- A scripted form of mutation M6 failed on a ReferenceError (its replacement left `hits` undefined), not on the guard. It was not counted, and M6 was re-run by hand, where it tripped its own assertion. control: tmp/a74/redarm-M6-first-of-duplicates.txt prints "ReferenceError: hits is not defined", and tmp/a74/redarm-M6-by-hand.txt prints the duplicate-key assertion's message.
- The harness refused file writes from the three reading agents ("Subagents should return findings as text"), so each report was saved by the lead from the returned text. One brief also carried a wrong publisher id for HW+, which the agent caught against Crossref.
- Classification: today's window holds no record-facing finding and four instrument-facing ones (the whole-file guard, the M1 order, the M6 script, the reading-agent tooling). No counted catch is quoted, numeric or byte-only, because `npm run catches` was not run today and counts drift detection only. The run of consecutive instrument-facing days is 1 after today; 10-09 had two record-facing findings. The standing prediction is neither confirmed nor falsified, since no record-facing catch arrived: the next record-facing catch will be a citation-quality defect in a mirrored upstream entry, found by a human reading the cited source in the depth audit (`A-47`), not by any alarm.
<!-- findings:end -->

## Recommendation

- [B] 2026-10-11: `A-47` (the depth audit) slice 16 at positions 506, 556, 606 and 656, with the draw pushed before any source is opened.
- [B] 2026-10-12: `A-54` (the Small Ramsey Numbers census) session 8, from XXER, with the tripwire applied first: 9 papers against 4 × 3 slots = 12.

## On hold pending data

- **The encounter with today's change:** blind until `A-59` (encounter is blind on the public pages) is read on 2026-10-28.

## State Appendix

Written last, from the commands named. As of 17:47Z, HEAD was `c686ccd` and equal to origin/main; this report's own commit comes after it. Release: `git -C C:/dev/skylark/bounds-ledger rev-parse HEAD origin/main`.

- **Ledger delta:**
  - `A-74` (two differences between a mirrored entry and its source) closed, option (a).
  - `A-54` (the Small Ramsey Numbers census) gained `census7_2026_10_10`, and `expectedSignalBy` moved 2026-10-10 → 2026-10-12.
  - `A-54`'s read stamp came from the hygiene helper's `--run`.
- **Census store:** `DS1-0086` to `DS1-0117` added.
- **Audit store:** referenceNote fields on `A-47-0069` and `A-47-0071`.
- **Pending reads,** the earliest dated field per open row, read from `continuity/items.json` at the close:
  - 2026-10-11: `A-45` (the tier-1 leading indicator), `A-47` (the depth audit).
  - 2026-10-12: `A-2` (the drift-resolution log), `A-54` (the census), `A-63` (a constant page does not say which claim a verdict checked).
  - 2026-10-13: `W-13` (someone must call the served-bytes check), `A-69` (a matched row's values on a phone).
  - 2026-10-14: `A-50` (importing a CLI script can run it), `W-14` (watch issue #218 for a maintainer reply).
  - 2026-10-15: `W-11` (search the record before calling a claim decision-ready).
  - 2026-10-20: `G-2` (contribute a verified bound improvement), `W-4` (prove each new detector both ways), `W-8` (does an amended outward artifact go back to David before it sends).
  - 2026-10-22: `W-3` (the erdosproblems.com/36 acknowledgement).
  - 2026-10-26: `G-4` (an outside party acts on a watched record).
  - 2026-10-28: `A-59` (encounter is blind on the public pages), `A-70` (phone-sized row links and the citation copy button, monitoring).
  - 2026-11-04: `A-9` (the engineering-health backlog).
  - 2026-11-06: `W-6` (the report-an-error channel's read window).
- **Codex:** 3 calls, all foreground read-only reviews.

### Close

ACTION: COMPLETED · item A-74 · P3 msgId 2d1c649e

- **Since the P3 post:** nothing changed in the shipped work. The manager's review (inbox `9fc972f6`) re-read both live pages and judged the action COMPLETED with no defect. It also reported `c686ccd`'s CI green, which my P3 post had called pending.
- **Hygiene draft:** 1 line — 0 accepted · 1 amended · 0 rejected.
  - `A-54`'s re-date to 2026-10-12 was AMENDED from `--extend` to `--set` on `expectedSignalBy`, because `--extend` has rewritten other fields before. `git diff -U0` showed only `expectedSignalBy` and `lastEvaluated` changed.
  - READ-MUTATED: none, with one read guarded. HEAD was commit `2f6f487` before and after; the tree was clean before, and afterwards only continuity/items.json and continuity/read-outputs/A-54.txt had changed, both excluded by design.
  - Wait-justification, quoted: "RESULT: PASS — 1 of 91 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
  - Engineering-zero, quoted: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
- **Due gates:** `check-due-gates-dispositioned` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned", with "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-10-10)".
- **Primer:** `docs/cold-starts/2026-10-11.md`, generated for 2026-10-11.
- **Receipt:** unchanged from the P3 post.

### Cycle 4 close

ACTION: COMPLETED · item A-63 · P3 msgId f4034d13

As of 04:50Z on 2026-10-11 (22:50 MT on 10-10). This report's own commit comes after it. Release: `git -C C:/dev/skylark/bounds-ledger rev-parse HEAD origin/main`.

- **Since the P3 post:** nothing changed in the shipped work. The manager's review (inbox `5a98249c`) read all four live pages, found them byte-equal to origin/main with last-modified 04:28:18 GMT (the Pages build of the report commit `a89b956`), and judged the action COMPLETED.
- **One small defect from that review, not fixed tonight:** c/46a and c/20a print "This verdict does not cover X, and Y", where "and" can read as joining something the verdict does state. It is carried on `A-63` (a constant page does not say which claim a verdict checked) as item 4 of `openAfterCycle4_2026_10_10`.
- **Claims pass, per sentence** (the manager asked for the tally; both counts are rows of Codex's own tables):
  - Round 1, on `89a2282`, 12 rows (7 + 2 + 1 + 2): 7 HOLDS; 2 HOLDS for the Russian original with the cited translation UNVERIFIABLE-HERE (both 8a); 1 UNVERIFIABLE-HERE (46a's whole-paper absence); 2 REFUTED-AS-WRITTEN in part (35a's opening "supports it", and 8a's "is the value" if numerical identity is meant, fixed as "rounds to"). 20a's page-image provenance was also marked UNVERIFIABLE-HERE inside one of the HOLDS rows.
  - Round 2, on `faddb9d`, 10 rows: 10 HOLDS, 0 REFUTED-AS-WRITTEN. It notes that what 8a's unread translation prints, and whether 35a's conditions cover the constant's class, remain UNVERIFIABLE-HERE, which is what those two results now say.
- **Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected. The helper ran its two checks only.
  - READ-MUTATED: none (no read was run).
  - Wait-justification, quoted: "RESULT: PASS — 1 of 91 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
  - Engineering-zero, quoted: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
- **Due gates:** `check-due-gates-dispositioned` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned", with "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-10-10)".
- **Ledger delta:**
  - `A-63` gained `cycle4Draw2026_10_10`, `cycle4Result2026_10_10` and `openAfterCycle4_2026_10_10`. It stays open, next read 2026-10-12, on 25 read verdicts that name no claim.
  - `A-47` (the depth audit) gained `settle8aReopened2026_10_10`: 8a's 2026-09-29 settlement is re-opened.
- **Audit store:** four retries on `A-47-0005`, `A-47-0028`, `A-47-0030` and `A-47-0036`, and one narrowed sentence on `A-47-0032`. `node scripts/depth-audit.mjs` printed "71 row(s) audited — 48 sound, 1 defective, 15 unresolved, 7 unreachable".
- **Open, for the next draw** (all on `A-63.openAfterCycle4_2026_10_10`):
  - 8a needs the body of Mathematical Notes 8(4):706–711.
  - 35a needs Section 6.1 of Bertsekas's book.
  - 32a's "The preprint never prints 3.45" needs checking against what was read.
- **Pending reads:** unchanged from the State Appendix above. The earliest are 2026-10-11: `A-45` (the tier-1 leading indicator) and `A-47` slice 16.
- **Primer:** the banner is rewritten in `docs/cold-starts/2026-10-10.md` and `docs/cold-starts/2026-10-11.md`. Neither file was regenerated tonight, so their generated "what shipped" lists stop at round 1; `git log` is the record.
- **Receipt:** unchanged from the P3 post.
- **Codex:** 3 calls this cycle, all foreground and read-only.
