---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-09
lifecycle_stage: launched
last_deploy: f34321e (the last page-changing commit; npm run served read 2 of 2 served at 18:59:14Z, and all five slice 15 pages matched HEAD byte for byte at 18:59:09Z)
on_hold_items: 1
top_action_today: A-47 slice 15, five cited rows read against their sources and shown on their pages
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-09 (Friday, MT)

## BLUF

Five more constant pages now say what we found when we read the paper each row cites. Four rows hold up. One could not be settled, because the journal's own pages were blocked.

No first command: the change is live, and tomorrow's first command is in the primer.

## What changed

- `A-47` (the depth audit: read our own cited rows against their sources) slice 15 landed. Five entries, `A-47-0067` to `A-47-0071`, on c/31a, c/3a, c/43a, c/4a and c/54a. Draw pushed first in `424bc06`; readings in `b3a9c05`, review fixes in `0ddaa45` and `f34321e`. Live since the Pages build at 18:54:55 GMT.
- The audit store's sampling rule gained the slice 14 paragraph it was missing, three days late, and the slice 15 one.
- `A-47`'s next check is re-dated to 2026-10-11. Four positions remain on the offset-6 grid.

### P1 selection

The P1 post (bus `0fd84192`, 15:09:31Z) selected slice 15 at positions 256, 306, 356, 406 and 456 and printed the draw. Its addendum (bus `d870166c`) named the user-visible change. It carried no HYGIENE INPUTS block. The boundary review arrived at 18:15Z (inbox `2274cb6f`); this lane posted holds at 16:41Z, 16:54Z and 17:55Z and did not open a source in between. The draw was committed and pushed at 16:52:58Z on the orchestrator's go-ahead to continue the phase (inbox `0bfcbb0a`).

### P3 product work

**Action (improve):** c/31a, c/3a, c/43a, c/4a and c/54a each now carry a reading that names the claim checked, says whether the cited source was reached, and says what it shows.

| Row | Verdict | What was read |
| --- | --- | --- |
| 31a [L2009], 0.788071 | UNRESOLVED | ACM answered 403. The author's extended version (a different edition) and the Crossref abstract both give the figure. |
| 3a [Z2025], 1.173077* | SOUND | The only arXiv version, pp. 1–11. Theorem 1 states the bound; it is a limit; no finite set is evaluated. |
| 43a [GH1976], 0.577 | SOUND | The 1976 journal scan, pp. 177–182. The theorem proves at least 1/√3. |
| 4a [T2023], 2.2180 | SOUND | The journal version (arXiv v2), pp. 1–18, with v1. Theorem 1.2 gives (2.218021…)^n. |
| 54a [BJ2008], 1.575 | SOUND | The Transactions article, pp. 3603–3612, from an Internet Archive capture; the AMS site answered 403. |

- The manager asked what the asterisk on 3a's value means. The mirror explains it at `3a.md` line 41: asterisked rows are limits, not certified by a finite-depth computation. The named claim already said that.
- `node scripts/depth-audit.mjs` (exit 0): "71 row(s) audited — 47 sound, 2 defective, 15 unresolved, 7 unreachable".

**Delivery.** A byte comparison of the Pages response with `git show HEAD:c/<id>.html` printed SERVED for c/31a, c/3a, c/43a, c/4a and c/54a at 18:59:09Z. `npm run served` at 18:59:14Z: "2 checked — 2 served, 0 in flight, 0 stale, 0 unreachable". It reads only the files the last page-changing commit touched, which is why the five-page comparison ran beside it.

**Encounter.** Blind: the pages have no analytics and Pages gives no request log, tracked on `A-59` (encounter is blind on the public pages), read 2026-10-28.

**Outcome.** Open: no read of whether a reader's check went better exists.

## Inputs (controllable)

- Reviews by the other model family (Codex, read-only, foreground, banner workdir `C:\dev\skylark\bounds-ledger` checked both times):
  - Round 1 on `b3a9c05`, the verdicts and the claims: 0 BLOCKER, 2 SHOULD, 1 NIT. All five verdicts kept. All three taken in `0ddaa45`.
  - Round 2 on `0ddaa45`, only the sentences that say how each source was read (100 listed): 0 BLOCKER, 3 SHOULD, 3 NIT. Five taken in `f34321e`, one refuted.
  - The round 2 fixes were not reviewed again. They are narrowings taken from the reviewer's own sentences.
- What this session re-read itself, from page images: 31a p. 7; 3a pp. 1 and 5; 43a pp. 177 and 178; 4a v2 p. 1; 54a pp. 3603, 3604 and 3612. Every other quotation is a reading agent's, and the entries say so.
- `npm run verify` receipt exit 0 at `f34321e` (18:54:23Z). CI `reverify`, `page-check` and the Pages build all succeeded at `f34321e`.
- Hygiene helper: dispatched at P3 start. No nonzero finding. Wait-justification PASS over 90 rows; engineering-zero PASS for this lane.
- W-7 — the instrument read against its own claim today was `npm run served`. It claims to say whether Pages serves what HEAD holds. Its output covered 2 of the 5 pages this slice changed, because it anchors on the last page-changing commit and that commit touched two. It said so in its own first line ("2 file(s) it changed, of 118 published"), so it did not overclaim; a multi-commit push needs the wider comparison beside it.

## Outputs (lagging)

- The bar's metric is NOT MEASURABLE: there are no analytics and no request log. Encounter with today's change is blind, tracked on `A-59` (encounter is blind on the public pages), 2026-10-28.
- `npm run reports`: 0 outside arrivals of 33 raw issues (33 + 0 + 0 = 33), read after the push. positive control: the probe fetched 33 issues and classified every one.

<!-- findings:begin -->
- Two differences between a mirrored entry and its source were found by reading. 43a's entry gives the title "Remarks on steiner minimal trees"; the paper prints "A Remark on Steiner Minimal Trees". 54a's entry gives pages 3603–3613; the article's first page says 3603–3612 and its last page is numbered 3612, while Crossref's record says 3613. Both are outside the claims named before reading, so no verdict changed. Both are recorded in the entries' notes and are not reported upstream.
- The audit store's sampling rule had no paragraph for slice 14. It was added today and says it is late.
- My summary of the 31a reading for the round 2 reviewer left out two things the reading agent had reported, and the reviewer flagged the entry for them. The entry was right; the summary was short.
- Classification: today's window holds two record-facing findings (the 43a title and the 54a page range) and two instrument-facing ones (the missing sampling paragraph and my short summary). No counted catch is quoted, numeric or byte-only, because `npm run catches` was not run today and it counts drift detection only. The run of consecutive instrument-facing days is 0 after today. The standing prediction held: the next record-facing catch was to be a citation-quality defect in a mirrored upstream entry, found by reading the cited source in the depth audit (`A-47`) and not by any alarm, and both of today's are that shape. It stays as written.
<!-- findings:end -->

## Recommendation

- [B] 2026-10-10: `npm run verify` first, then `A-54` (the Small Ramsey Numbers census) session 7, from HW+, with its tripwire applied before the plan is pushed.
- [B] 2026-10-11: `A-47` (the depth audit) slice 16 at positions 506, 556, 606 and 656, with the draw pushed before any source is opened. A new grid is owed after it.
- [C — David] The 43a title and the 54a page range could be reported upstream. That is outward contact, so it needs an adversarial review and David's approval. Not asked for today.

## On hold pending data

- **The encounter with today's change:** blind until `A-59` (encounter is blind on the public pages) is read on 2026-10-28.

## State Appendix

Written after the P3 post (bus `d652f60d`), from the commands named above. As of 19:00Z HEAD was `f34321e` and equal to origin/main; this report's own commit comes after it. Release: `git -C C:/dev/skylark/bounds-ledger rev-parse HEAD origin/main`.

- **Ledger delta:** `A-47` (the depth audit) gained `slice15Draw2026_10_09` and `slice15Result2026_10_09`, with `nextCheckDate` 2026-10-11.
- **Pending reads:** 2026-10-10 `A-54` (the Small Ramsey Numbers census) session 7. 2026-10-11 `A-47` (the depth audit). 2026-10-12 `A-63` (a constant page does not say which claim a verdict checked). 2026-10-14 `W-14` (watch issue #218 for a maintainer reply). 2026-10-22 `W-3` (watch for acknowledgement of the erdosproblems.com/36 correction). 2026-10-28 `A-59` (encounter is blind on the public pages).
- **Codex:** 2 calls, both foreground read-only reviews.
- **Close:** see the section below.

### Close

ACTION: COMPLETED · item A-47 · P3 msgId d652f60d

- **Since the P3 post:** nothing changed in the shipped work. The manager's review (inbox `bd792f46`) re-read the five live pages and the counts and judged the action COMPLETED. It withdrew its own 3a hypothesis.
- **The two entry-versus-source differences** (43a's title, 54a's page range) now have a dated row: `A-74` (two differences between a mirrored entry and its source sit only in unrendered notes), read 2026-10-11. On that day the pages either show them, with a guard and an other-family review, or the row records a decision to keep them notes-only. The lane's recommendation is to show them.
- **The 5-versus-9 count the review asked about is two units, not an error.** `depth-audit.mjs` prints 9 suspicion ENTRIES. The pages print 5 suspicion ROWS. The 9 entries cover 8 distinct rows; 2 of those rows were later also drawn by position and count as drawn; 1 is a citation-format check and not a bound-row reading; that leaves 5. The page says "row(s)" throughout, so it is true as written. The script's first line calls entries "row(s)", which is loose; that wording is owed a look with slice 16. Recorded on `A-47.close2026_10_09`.
- **An outside time for the draw's push:** `gh run list --commit 424bc068…` shows GitHub created CI runs for the draw commit at 16:53:33Z and 16:53:34Z, before the 18:18:20Z first requests. Recorded on the same field.
- **Review label, kept:** `f34321e` changed public sentences on c/31a and c/54a after the second round and was checked BY-INSPECTION only.
- **Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected. The P1 packet carried no inputs, so the helper drafted nothing.
  - READ-MUTATED, quoted: "none — 0 reads guarded (no `--run` was executed, so no stamp was written; `git status --porcelain` was empty after the two step-5 checks)".
  - Wait-justification, quoted: "RESULT: PASS — 1 of 90 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
  - Engineering-zero, quoted: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable".
- **Due gates: UNRESOLVED by the instrument.** `check-due-gates-dispositioned` printed "snapshot: tmp\due-gates-snapshot.json — STALE · 1 MT day(s) old (taken 2026-10-08)", so its CLEAR verdict is about 2026-10-08. Today's snapshot was never taken, because P1 ran from the primer before the kickoff arrived. By hand: the one gate the kickoff listed as due today, `A-47` (the depth audit), was read (slice 15) and re-dated to 2026-10-11.
- **Ledger delta:** `A-47` (the depth audit) gained `close2026_10_09`. `A-74` minted.
- **Pending reads:** 2026-10-10 `A-54` (the Small Ramsey Numbers census) session 7. 2026-10-11 `A-47` (the depth audit) slice 16 and `A-74` (the two differences). 2026-10-14 `W-14` (watch issue #218 for a maintainer reply). 2026-10-22 `W-3` (watch for acknowledgement of the erdosproblems.com/36 correction). 2026-10-28 `A-59` (encounter is blind on the public pages).
- **Primer:** `docs/cold-starts/2026-10-10.md`, generated for 2026-10-10.
- **Receipt:** unchanged from the P3 post.
