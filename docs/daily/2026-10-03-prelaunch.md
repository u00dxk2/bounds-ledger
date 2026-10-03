---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-03
lifecycle_stage: launched
last_deploy: f2e545f (the last page-changing commit; npm run served read 1 of 1 served at 2026-10-03T15:55:19Z)
on_hold_items: 0
top_action_today: A-47 slice 12, five more cited rows read against their sources
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-03 (prelaunch report)

## BLUF

We read five more of the numbers our ledger cites against the papers they come from, and each one now says on its page what we found. All five hold up. One paper proves the answer is below 4.601+ (just over 4.601) while the ledger lists that paper as showing it is below 4.602; the paper's figure is the tighter one, so the ledger's number is still true, and the page now gives the paper's own figure.

## What changed

- **`A-47` slice 12** (the depth audit: read our own cited rows against their sources). The draw was committed and pushed in `a1014f5` before any source was opened, at positions 237, 287, 337, 387 and 437 of the 691-row frame. The readings are in `80cf29d`, and the review fixes are in `2a006a8` and `b99f256`; all were pushed together after the review. All five rows are SOUND:
  - 29a [KZ1873]: the 1873 paper prints a form in n variables with n(n−1) minimal representations up to sign; 40 is the n = 5 case, which it never writes out.
  - 37a [P2021]: Theorem 1 of arXiv v2 is the row's bound rearranged.
  - 41a [Hammersley1968]: Problem 8 on p. 84 says "Prove that A<2√2", set as an exercise with no proof in the article.
  - 46a [WW2022]: Theorem 1.2 of arXiv v2 covers the paraboloid with an L^p norm; the step to the sphere was not checked.
  - 52a [KKKS1998]: the journal edition prints 4.601+, "a value between 4.601 and 4.60108", and never 4.602. Below 4.60108 is below 4.602, so the paper proves the bound the row lists.
- `node scripts/depth-audit.mjs` (exit 0, 2026-10-03) reads "58 audited, 38 sound, 2 defective, 11 unresolved, 7 unreachable", 49 drawn by position and 9 chosen for suspicion; it read 53 / 33 / 2 / 11 / 7 this morning.
- **`A-47` re-dated** to 2026-10-05 for slice 13, at positions 487, 537, 587, 637 and 687. 687 is the last point the offset-37 grid reaches in a 691-row frame.
- **Findings classification, one sentence of human judgment:** today's findings were mostly record-facing: 52a's listed 4.602 against the printed 4.601+, 41a's reference line writing "modern mathematics" where the article prints 'Modern Mathematics' in quotation marks, and 29a's reference line naming the present-day publisher where the 1873 volume was published in Leipzig. The instrument-facing ones were my own first draft hiding 52a's caveat in a field the page does not render, and four wording findings from review.
  - **Numeric or byte-only: neither.** The drift alarm counted nothing today. Positive control: `reverify.test.mjs` plants synthetic drift on every `npm test`, and today's three verify runs ran it.
  - **Consecutive instrument-facing days: 0**, counted by hand. Yesterday's 3 ends because today carries record-facing findings, even though none is stored as a defect.
  - **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." It is WRONG "if the drift alarm produces the next record-facing catch, or if a human finds a NUMBER that disagrees with its source." **Not falsified.** 52a's 4.602 does not disagree with its source: the source proves a bound below 4.60108, which implies the listed 4.602. What differs is how the number is quoted, not whether it is supported, and a quotation difference in a mirrored entry, found by reading the cited source in this audit, is the shape the prediction names. Nothing was stored as a defect today, so this is also not a catch that confirms it. CLAUDE.md is unchanged.
- W-7 — the instrument read against its own claim today was the holder line `node scripts/depth-audit.mjs --draw` has printed since 2026-10-01, on its first live slice. It printed "held: none" for all five positions and "0 of 5 drawn position(s) land on a row already held, read against 53 audit store entries". Could it ever have said otherwise? Its self-test's FIRES arm names a holder for a row already in the store. Today the Codex review checked it independently, finding that none of the five fingerprints occurs in the store's 53 entries at the draw's parent. Yesterday's W-7 was a self-test assertion in `scripts/render-constant-pages.mjs`, a different instrument.

<!-- findings:begin -->
**52a: the ledger lists 4.602, the cited paper prints 4.601+.** The 1998 Random Structures & Algorithms paper by Kirousis, Kranakis, Krizanc and Stamatiou, read in its journal edition, states κ < 4.601+ (Theorem 3, p. 266) and glosses the figure as "a value between 4.601 and 4.60108" (p. 255). It never prints 4.602. The listed bound is weaker than the paper's and so is supported; the entry is SOUND, and its page says what the paper prints. The reading agent proposed DEFECTIVE; both review rounds agreed with SOUND. Nothing outward is proposed. A correction upstream would be outward contact, which needs review and David's approval, and it is not raised here. Release: entry A-47-0058 in `continuity/depth-audit.json`.

**The suspicion count on the constant pages is right.** The pages say "6 more were chosen for suspicion and checked"; `node scripts/depth-audit.mjs` counts 9 suspicion-drawn entries. The page counts distinct bound rows read for value against source and not later drawn by position (`scripts/render-constant-pages.mjs` lines 605 to 610). Of the 9 entries, two check a citation rather than a bound value (A-47-0003 and A-47-0016). One more, A-47-0015, is on 1b's row, which slice 11 then drew by position (A-47-0052), so that row counts as drawn. That leaves 6 rows. The orchestrator's P3 review raised this as a hypothesis, and the first Codex round reached the same answer.
<!-- findings:end -->

## Inputs (controllable)

- Five background reading agents, one per paper, under `tmp/slice12-brief.md`. That is slice 11's brief plus three rules from the P1 review: a later paper's quotation is not the cited source; record the arXiv version; list which pages were viewed. The brief forbids sending identity, solving a verification challenge and using shadow libraries. This session viewed the page image carrying each row's key statement: 29a pp. 367 to 369, 37a p. 2, 41a the p. 84 crop, 46a p. 1, and 52a pp. 253, 255 and 266. For 29a it also recounted the form's minimal vectors apart from the reading (40 at n = 5).
- Two Codex read-only review rounds, each with the banner workdir checked against this repository before any finding was read. Round 1 on `80cf29d`: FIX-THEN-PUSH, with two should-fix findings and one nit, all on 29a and 46a wording, all fixed in `2a006a8`. Round 2 on `2a006a8`: FIX-THEN-PUSH, with one should-fix finding (41a misnamed where its volume number comes from), fixed in `b99f256` in the reviewer's own words.
- One hygiene helper, dispatched at P3 before the build. Its draft has 0 lines; wait-justification PASS and engineering-zero PASS for this lane.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report):** `npm run reports` at P1 read 0 outside arrivals of 32 raw issues, parts reconciling 32 + 0 + 0 = 32. By the rule of three, the 95% upper bound on the outside share of issues is about 3/32. It counts filed issues on github.com, never page readers.
- **Delivery:** `npm run served` at 17:05:06Z read "1 checked — 1 served" at anchor `b99f256`. CI: GREEN at `b99f256`. `npm run verify`: exit 0 at `b99f256`. The live 52a page at 390 wide carries the 4.601+ sentence with no sideways scroll. The orchestrator fetched the other four pages and found each returns 200 with its reading line. Encounter: blind (`A-59`, the encounter read, dated 2026-10-28).
- **The two depth counts, side by side and never summed:** the constants audit is as above. The Small Ramsey Numbers census did not change today.

## Recommendation

Tomorrow's order lives in the primer, written at the close.

- [B] 2026-10-04: `A-54` census session 5 (the Small Ramsey Numbers census), opening with Spe4.
- [B] 2026-10-05: `A-47` slice 13 at positions 487, 537, 587, 637 and 687, draw pushed before any source is opened.
- [A — user-visible] By 2026-10-06: `A-63` (a constant page does not say which claim a verdict checked) and `A-65` (the stale source line on the 10c page).

## On hold pending data

- **The ten Mac bounds on the Ramsey page** stay UNRESOLVED on who established them, as on 2026-10-02. Nothing new today.
- **52a's 4.602:** nothing is pending. The entry is settled as SOUND, and an upstream note would need David.

## State Appendix

### Selection packet (P1 — evidence and choice)

**Outcome:** five more cited rows of the constants ledger are read against the sources they cite, and each row's page says what the reading found. Item `A-47` (the depth audit David ruled on 2026-09-09: read our own cited records against their sources on a schedule), slice 12, due today on its own date.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." A citer who opens one of the drawn rows (29a, 37a, 41a, 46a, 52a, listed in the draw below) today is told only whether the row has moved. After the slice, the page also says whether anyone read the row against its cited source, and what that reading found.

#### Evidence

- OBSERVED — `check-due-gates-dispositioned --snapshot` (exit 0, taken once, this morning): "1 gate(s) due on/before 2026-10-03", the row `A-47`.
- OBSERVED — `check-due-gates-dispositioned --run A-47` (exit 0, stamped today): "RESULT: PASS — 53 audited, 33 sound, 2 defective, 11 unresolved, 7 unreachable (exit 0)", selection "44 drawn by position … 9 chosen because something already looked wrong", and "denominator check: the stored 691 cited rows match the live corpus at this read". The audited count has not moved since 2026-10-01, which is expected: 2026-10-02 was a census day.
- OBSERVED — the draw, `node scripts/depth-audit.mjs --draw 237 287 337 387 437` (exit 0, run at P1 before any source was opened): frame 691; "store: 0 of 5 drawn position(s) land on a row already held, read against 53 audit store entries". So the collision rule (`A-47.collisionRule2026_10_01`) has nothing to apply to, and the slice adds five new rows. The draw's output is pasted below.
- OBSERVED — `npm run verify`: receipt `exitCode` 0 at `f882d2a02e49a2944a9763f511d92adf4d686579`, stamped 2026-10-03T15:55:56Z. Its claims leg printed "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)." The brief leg read UNVERIFIABLE, which is excluded from the exit code and never a pass.
- OBSERVED — `npm run reports` (exit 0): 0 outside arrivals of 32 raw issues, parts reconcile 32 + 0 + 0 = 32.
- OBSERVED — `check-cycle-rotation --lane bounds-ledger` (exit 0): "no product-love cycle picks this lane today".
- OBSERVED — `answered-cards --project bounds-ledger`: "NO waiting/answered/pending-verify cards for bounds-ledger".
- MISSING — the evangelism bar's one metric. It is NOT MEASURABLE (the bar's own words): the page is static with no analytics and GitHub Pages gives no request log. The encounter read is `A-59`, dated 2026-10-28.
- MISSING — any read of a real person on these five pages.
- Prior-day retro findings, from the kickoff's quoted lines: none has recurred so far today. The one that bears on this work is the method sentence (four reviews refuted "the cited source was read" on 2026-10-01): each of today's five claims is named below before any reading, and the edition read is checked against the edition the row cites before any verdict other than UNRESOLVED or UNREACHABLE.

#### The draw (pasted from the command's output, not retyped)

```
frame: 691 cited bound row(s), file-then-line order — the same total the corpus counter reports over this directory, checked on this run rather than asserted

position 237 of 691 — 29a [KZ1873] (Known lower bounds)
  row:  ledger/teorth-optimizationproblems/constants/29a.md:49
  sha:  adfc91c311cca5cb  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

position 287 of 691 — 37a [P2021] (Known upper bounds)
  row:  ledger/teorth-optimizationproblems/constants/37a.md:47
  sha:  a670d0a724803fae  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

position 337 of 691 — 41a [Hammersley1968] (Known upper bounds)
  row:  ledger/teorth-optimizationproblems/constants/41a.md:13
  sha:  52aa23779c117235  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

position 387 of 691 — 46a [WW2022] (Known upper bounds)
  row:  ledger/teorth-optimizationproblems/constants/46a.md:25
  sha:  f5841da6c437ffd6  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

position 437 of 691 — 52a [KKKS1998] (Known upper bounds)
  row:  ledger/teorth-optimizationproblems/constants/52a.md:34
  sha:  71d439681161dc53  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

store: 0 of 5 drawn position(s) land on a row already held, read against 53 audit store entries
RESULT: PASS — drew 5 position(s) from a frame of 691 (exit 0)
```

The `text:` lines are omitted here and kept in full on the ledger row. The five 16-hex values are depth audit row fingerprints (sha256 of the mirrored row text), not commits; the trailing `pragma: allowlist sha` on each is added for the commit guard and is not in the command's output.

#### Which claim each row makes, named before any reading

- 29a [KZ1873]: that Korkine and Zolotareff's 1873 paper contains the D5 lattice whose 40 minimal vectors give a kissing configuration of size 40 in dimension 5. The row's own quoted support says the construction is "implicit" in that paper, so the reading asks what the 1873 paper itself shows. The paper is in French.
- 37a [P2021]: that the cited arXiv paper proves bs(f) ≤ deg(f)² / (√10 − 2). The exponent 2 and the row's 0.8604 are arithmetic from that and are checked as arithmetic.
- 41a [Hammersley1968]: that Hammersley's 1968 article gives the upper bound 2√2 for the moving sofa area, at the place the reference names (Appendix IV, Problem 8, p. 84).
- 46a [WW2022]: that the cited arXiv paper proves the restriction estimate for p > 3 + 3/14. Whether it is stated for the sphere or for the paraboloid is recorded; the mirrored page's own remark covers that transfer and it is not re-proved here.
- 52a [KKKS1998]: that the cited 1998 paper proves the upper bound 4.602 on the random 3-SAT threshold.

#### Permission

- Lane-authorised and David-ruled: `A-47` is his 2026-09-09 ruling, "Go with depth — start reading our own 543 records against their sources on a schedule" (board card `2f90980a`, quoted from the row). No board card is open.
- `index.html` and the `c/` pages are not under the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html`.
- Outward gate: nothing beyond the ordinary Pages publish. The five readings (of the rows listed in the draw above) are public sentences about other people's papers, so they get a review from the other model family before the readings are pushed. No author is contacted.

#### Next action

Kind: **deliver built value** (a scheduled read whose result readers see). The draw is committed and pushed first, before any source is opened. First command after the P3 go-ahead, on a clean tree:

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 237 287 337 387 437
```

It must print the same five fingerprints as above. Then the draw goes onto the `A-47` row, is committed and pushed, and only then are reading agents dispatched, under a brief that forbids sending identity to any service and names EuDML and GDZ for the two old journal papers.

#### Acceptance condition

`node scripts/depth-audit.mjs` exits 0 and prints 58 audited, with the four verdict counts summing to 58 and 49 drawn by position. Each of the five rows (29a, 37a, 41a, 46a, 52a, listed in the draw above) has a store entry carrying the drawn fingerprint, the edition read, and a positive control from the same fetch. Any row whose cited edition could not be read is UNRESOLVED or UNREACHABLE, never SOUND or DEFECTIVE. The five `c/` pages (29a, 37a, 41a, 46a, 52a) and the index show the readings, and `npm run check` passes after the commit.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, then one of the five `c/` pages opened on the live site.
- Encounter: blind (`A-59`). The event that would show it is an outside issue filed through a per-row link, counted by `npm run reports`, readable at N = 1.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json` (the audit store the pages render from), `continuity/items.json`, `index.html`, `c/29a.html`, `c/37a.html`, `c/41a.html`, `c/46a.html`, `c/52a.html`, and `c/4a.html` if its audit summary counts move. No script is expected to change.

#### HYGIENE INPUTS

- (a) due rows not bearing on the choice: none — read "dated gates due today: 1", and that one row (`A-47`) is the choice.
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 744 considered".
- (c) state reads marked CROSSED: none — read all the kickoff's state reads. Two could not be judged and are not zeros: missingLinkedCommits "NOTHING SWEPT (0 of 0 considered)", and key numbers "no list yet".

### Section 0

- Primer: `docs/cold-starts/2026-10-02.md` read whole; no file exists for 2026-10-03 until today's close writes it.
- Listener: 🟢 SSE alive (restart 2026-10-03T15:34:24Z, hello 15:34:27Z, slug bounds-ledger), wake loop armed by tool call, waker ranks 1 to 3 running.
- Codex: GREEN per the kickoff's probe line (real exec 2026-10-03T15:40:32Z). Not re-probed at P1.
- CI: GREEN at `f882d2a` (`check-ci-status --workflow reverify.yml`, exit 0). Drift: NOTHING SWEPT, this lane has no Render service and appears in none of the checker's blocks. The lane's own delivery read, `npm run served`, printed "1 checked — 1 served, 0 in flight, 0 stale, 0 unreachable" at anchor `f2e545f`.
- Harness: running 2.1.288 · fleet UNIFORM · installed 2.1.288 (SAME).
- Recs yesterday: `A-47` slice 12 → carrying today, P3. `A-54` census session 5 → carrying, dated 2026-10-04. `A-63` and `A-65` by 2026-10-06 → carrying, dated; not pulled forward. Marking the Mac and Ex16 cells at the 2026-10-18 render slot → carrying, dated.

### Close

ACTION: COMPLETED · item `A-47` (the depth audit: read our own cited rows against their sources) · P3 bus msgId 7fdcd13f

- **Acceptance met.** `node scripts/depth-audit.mjs` exits 0 at 58 audited, the four counts summing to 58, with 49 drawn by position. Each of the five new entries carries the drawn fingerprint, the edition read and a positive control. The pages show the readings, and `npm run verify` exited 0 after the last commit, `b99f256`. The orchestrator's P3 review (bus msgId f91e73ea) read it COMPLETED and fetched all five live pages.
- **Changed since the P3 post:** nothing on the pages. The orchestrator's hypothesis about the suspicion count was checked and the page sentence holds (findings block above).
- **Hygiene draft (P3 helper): 0 lines — 0 accepted · 0 amended · 0 rejected.** No READ-MUTATED lines. Its two checks, quoted: wait-justification "RESULT: PASS — 1 of 86 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)"; engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable".
- **Due gates:** `check-due-gates-dispositioned` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." and "snapshot CURRENT: taken today (2026-10-03)".
- **Ledger delta:** `A-47` gained `slice12Draw2026_10_03` (in `a1014f5`) and `slice12Result2026_10_03`, and was re-dated to 2026-10-05 with a new `nextCheckDateNote` (in `2a006a8`). Its read is stamped at 58 audited (re-stamped in `b99f256`). No other row changed.
- **Receipt:** the P3 receipt stands unchanged. Exposure is blind (`A-59`); the outcome is open.
- **Pending reads, each on its row:** 2026-10-04 `A-54` census session 5. 2026-10-05 `A-47` slice 13. 2026-10-06 `A-63` and `A-65`. 2026-10-08 at the latest, the `A-54` blocked-paper retry. 2026-10-13 `A-69` and `A-70`. 2026-10-28 `A-59`.
- **UNRESOLVED at the close:** none.
