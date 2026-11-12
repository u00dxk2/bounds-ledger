---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-12
lifecycle_stage: launched
last_deploy: bd8c00e (CI GREEN on reverify.yml and page-check.yml; GitHub Pages; no Render service)
on_hold_items: 0
top_action_today: read five more of our cited records against their sources, so five more constant pages say whether their number was checked
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-12 (Thursday, MT)

## BLUF

Five more constant pages now say whether their number was read against the paper it cites; the 3b page also warns that its bibliography's DOI does not resolve. Two of the five checked out, two could not be settled, and one source could not be opened. No audit entry had been added since 30 October.

## What changed

- P1 chose the day's work: `A-47` (the depth audit: reading our own cited records against their sources), slice 24. The selection packet is in the State Appendix.
- **The depth audit had not moved since 30 October.** `node scripts/depth-audit.mjs` read 106 audited rows at the 11-09 read and again this morning; the row's own close condition names an unmoved count as the finding. Slice 24 is the response.
- **`A-47` slice 24, five rows audited against their sources** (three cited editions and one other edition read; the fifth source could not be opened; draw pushed in `0d801a4` before any source was opened; verdicts in `1415258`, review fixes `eb9c4fd`, `43a0a5d`, `bd8c00e`). `depth-audit.mjs` now reads "111 row(s) audited — 66 sound, 1 defective, 30 unresolved, 14 unreachable".
  - 21a [Kor2026] SOUND: Corollary 1.2 states Λ < 0.172422.
  - 43a [S2026] SOUND on both halves the manager review asked for: the bound and its stated condition on the Ke et al. lemma layer.
  - 33a [DV1983] UNRESOLVED: the Russian original proves A(q) ≤ √q − 1 for every prime power q; the cited English translation was behind a bot check. The page says reading its pp. 53–54 would settle it.
  - 3b [L2015] UNRESOLVED: Theorem 2.1 gives 1.77898 for the paper's own formulation; nothing read connects it to the definition this page prints. The page says what would settle it.
  - 27b [G1980] UNREACHABLE: the publisher's landing page only.
- **A record-facing catch: the 3b bibliography's DOI, 10.1090/proc/12731, does not resolve** (doi.org handle "not found", Crossref 404; control 10.1090/S0002-9939-2015-12603-2 resolves to the paper). The searches we ran of upstream's issues and pull requests (for "12731" and "L2015") found no report of it. The 3b page carries it as a note about the reference, not the bound. Telling upstream is outward contact: outward gate.
- **The open pull request lists were refreshed** (`3b8abc7`, pushed alone by sha after a read-only Codex round with no findings): 89 → 93 open, 59 pages.
- The morning block ran: `npm run upstream` printed "0 transition(s) across 3 recorded report(s)"; `npm run traffic` printed 8 unique repo viewers and 291 unique cloners in the latest 14-day window (page visitors are not counted); `open-pulls.mjs --fetch` read 93 open pull requests (89 on 11-11) touching 63 constants.

## Inputs (controllable)

- Five sources attempted by five reading agents (four reached, three of them the cited edition), each deciding page image read by the lead; four read-only Codex rounds on the slice's commits (rounds 1 to 3 found wording and one verdict defect, round 4 approved); one on the refresh.

<!-- findings:begin -->
- **The 3b verdict was wrong for three rounds before it was right.** The reading proposed SOUND, and the sentence about whether the paper's definition matches the page's was flagged by Codex in rounds 1, 2 and 3. Round 2 was the second appearance, answered by claiming less; round 3 showed the claim itself was not supported once the normalization was excluded, so the fix moved from the wording to the verdict (SOUND → UNRESOLVED), before any push. Same rule as 1b in slice 23: a claim named before reading is not narrowed by the result.
- Classification (one sentence of judgment, never a counter): today's window holds one record-facing finding, the 3b DOI that does not resolve, a citation-quality defect in a mirrored upstream entry found by reading the cited source in the depth audit, which is the shape the standing prediction names; the 3b wording rounds are instrument-facing. Nothing was counted by `npm run catches` today (no drift).
<!-- findings:end -->

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there).

## Recommendation

- [A — user-visible] Continue `A-47` at its next re-read: seven positions remain on slice 23's grid (459 … 759).
- [B — outward, gated] Draft a correction issue for the 3b DOI (`10.1090/proc/12731` → `10.1090/S0002-9939-2015-12603-2`) for adversarial review and David's approval. Not sent.
- [C — instrument] An UNREACHABLE entry has no field on its page for "what would settle it" (27b's lives in the store notes only). Worth a small renderer change if the manager agrees.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-11.md` (no 11-12 primer; the 11-11 file is the newest, named for the day it was written). Its banner governs: morning block, then the reads dated today. `git log 3704d91..HEAD` showed only the 11-11 close and primer commits.
- Listener: `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0 (restarted by the session-start hook at 15:34:51Z). Loop-tick armed by tool call; waker ladder ranks 1 to 3 launched at about 15:35Z.
- Codex: GREEN per the kickoff's probe line (15:41:21Z, execute and write proved).
- CI, as of about 15:53Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each "1 completed non-scheduled success(es) for HEAD" at `dcb0a7b`. `git pull --ff-only` printed "Already up to date."; `git rev-list --count origin/main...HEAD` printed 0. No local full verify: CI is green at HEAD.
- Deployed-sha drift: NOTHING SWEPT for this lane. The fleet table covered 38 Render services and exited 0, which says nothing about us; this lane publishes through GitHub Pages.
- Board: `update-david-board.mjs --list` returned one card for this lane, `965831ba`, state done. Nothing waits on David.

### P1 selection packet

- **Outcome:** `A-47` (the depth audit), slice 24: five more cited rows audited against their sources, and each verdict shown on its constant page.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." A row we have read against its source answers the second half of that sentence; a row we have not read cannot.
- **Evidence:**
  - OBSERVED · `node scripts/depth-audit.mjs` · all 798 cited rows · read 2026-11-12 about 16:00Z · "106 row(s) audited — 64 sound, 1 defective, 28 unresolved, 13 unreachable", the same 106 as the 11-09 read. The row's own close condition says an unmoved audited count is the finding. The last slice (23) was read 2026-10-30.
  - OBSERVED · `node scripts/depth-audit.mjs --corpus` · 901 bound rows, 120 files · read today · "798 cited of 901", matching the stored denominator, so slice 23's frame and grid still apply.
  - OBSERVED · `node scripts/depth-audit.mjs --draw 209 259 309 359 409` · read today, read-only, nothing stored · positions 209 (21a), 259 (27b), 309 (33a), 359 (3b), 409 (43a); "0 of 5 drawn position(s) land on a row already held".
  - HYPOTHESIS · the standing prediction (`CLAUDE.md`): the next record-facing catch will be a citation-quality defect found by a human reading the cited source in this audit. Today's slice is a chance to test it, nothing more.
  - MISSING · whether any reader sees an audit verdict: the page has no analytics (`A-59`).
- **Permission:** `A-47` is David-ruled standing work: on 2026-09-09 he directed the project toward depth over breadth, and on 2026-09-10 he asked that it be judged meanwhile by how much of our own material holds up when checked (paraphrased; the record is in `docs/evangelism-bar.md`). Status open, no park, no card. Reading public sources and recording verdicts is inside the lane's authority; the published verdicts get the outward gate's adversarial review before push.
- **Next action:** improve, delivered as data. Store the draw on the ledger row as `A-47.slice24Draw2026_11_12`, commit and push it BEFORE any source is opened (slice 23's grid: offset 9 in the 798-row frame, positions 209 … 409 next). Then read each source (reading agents, no identity sent), write each verdict to the audit store, render the constant pages, review, push. First command:

  ```
  node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 209 259 309 359 409
  ```

- **Acceptance condition:** `node scripts/depth-audit.mjs` prints 111 rows audited (106 + 5) with a verdict per row, and the live constant pages for 21a, 27b, 33a, 3b and 43a show the checked row and its verdict (live-fetched after the Pages build row for the push tip exists).
- **Delivery and encounter checks:** delivery is the Pages build row for the push tip plus a live fetch of each of the five pages. Encounter is blind (`A-59`); the only arrival the pages can show is a report filed through a row's link, counted by `npm run reports`, readable at N = 1.
- **USER-FACING: yes.** Paths: `continuity/depth-audit.json` (or the store `depth-audit.mjs` writes), `continuity/items.json`, `c/21a.html`, `c/27b.html`, `c/33a.html`, `c/3b.html`, `c/43a.html` (exact page names from the render), possibly `index.html` if it shows audit counts.
- **Standing obligation beside it, not the choice:** the morning open-pull-request refresh (93 open). Its render is running; its commit gets the normal read-only Codex round and is pushed alone by its sha, before the slice's draw commit, so "nothing else unpushed" holds.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice — 5: `A-2` (drift log), `A-77` (filed-report check; `npm run upstream` ran this morning, 0 transitions), `A-92` (ETH area, read WAIVED), `W-16` (issue 289 watch), `W-3` (erdosproblems.com/36 acknowledgement watch). Read: `check-due-gates-dispositioned.mjs --snapshot`, "6 gate(s) due on/before 2026-11-12"; `A-47` is the sixth and is the selection.
  - (b) owed child rows — none: read the kickoff's "rows owed to you in skylark-site's ledger" (0 of 813).
  - (c) state reads marked CROSSED — none: read the kickoff's state reads (stale-actionable 0 of 26; missingLinkedCommits NOTHING SWEPT, 0 of 0).

### Close

- ACTION: COMPLETED · item `A-47` (the depth audit) · P3 `fb99534e`. Acceptance met: `node scripts/depth-audit.mjs` prints "111 row(s) audited — 66 sound, 1 defective, 30 unresolved, 14 unreachable"; the Pages build for `bd8c00e` was built at 17:11:55Z; a live fetch of c/21a, c/27b, c/33a, c/3b and c/43a returned HTTP 200 with each new verdict line (the manager review re-fetched all five). CI `reverify.yml` and `page-check.yml` green on `bd8c00e`.
- **The audited count moved 106 → 111 today, after sitting at 106 from 2026-10-30 (slice 23) through the 2026-11-09 read and this morning's.**
- Receipt (unchanged from P3): `USER-VISIBLE: data: depth-audit verdicts ×5` at `bd8c00e`, exposure blind (`A-59`, the row saying nothing can see an arrival on the pages; re-read 2026-11-18). `npm run reports` read 0 outside arrivals of 37 raw issues (37 + 0 + 0 = 37).
- Ledger delta: `A-47` re-dated to 2026-11-19 (both clocks), with `redate2026_11_12` naming the next slice: seven positions remain on slice 23's offset-9 grid in the 798-row frame, 459, 509, 559, 609, 659, 709, 759. `A-102` minted (an UNREACHABLE audit entry has nowhere on its page to say what would settle it; the 27b case), next check 2026-11-19; its readCommand `git grep -c "would settle" -- c/27b.html` exits 1 today, and on c/3b.html prints 1 (positive control). Hygiene draft applied: 5 lines, 5 accepted (`A-2`, `A-77`, `A-92`, `W-16` (the watch on upstream issue 289), `W-3` (the watch for an erdosproblems.com/36 acknowledgement) re-dated to 2026-11-19; every clock on each row read back as 2026-11-19 or absent).
- Checks: `check-due-gates-dispositioned.mjs` "snapshot CURRENT: taken today (2026-11-12)", RESULT: PASS; from the helper, `check-wait-justification` PASS (2 of 124 rows carry a wait) and `check-engineering-zero --project bounds-ledger` PASS (0 findings, 0 unreadable). READ-MUTATED: none.
- W-7 — `npm run reports` claims to count outside arrivals through the per-row links. Its sum check (37 + 0 + 0 = 37) shows only that every fetched issue was given a category, not that each category is right: in today's claims pass, a synthetic outside report with its identifying markers removed was classified "outside, not an arrival" while the sum still reconciled. The script's own comment (`scripts/report-rate.mjs:52`) records the same failure once happening for real. So today's 0 means no fetched issue carried an arrival's markers; it cannot rule out a retitled report with its markers stripped.
- Standing prediction: today's record-facing catch (the 3b DOI) is a citation-quality defect in a mirrored upstream entry, found by reading the cited source in the depth audit. That is the shape the prediction names, so it held; nothing to correct in `CLAUDE.md`.
- Pending reads: `A-47`, `A-102`, `A-2`, `A-77`, `A-92`, `W-16`, `W-3` on 2026-11-19; `A-59` and `W-19` (the second Search Console read) on 2026-11-18; `W-20` (the open-pull-request fetch's 200 ceiling) on 2026-11-25.
- positive control: each stated zero or absence above has a read that came back non-empty beside it. For the DOI, the lead's own doi.org and Crossref lookups returned 302 (to the AMS page) and 200 for 10.1090/S0002-9939-2015-12603-2. For "no row since 30 October", `depth-audit.mjs` printed 106 on 11-09 and 111 today. For the reviews with no findings, the same Codex rounds returned findings on commits `1415258`, `eb9c4fd` and `43a0a5d`. For the engineering-zero 0 findings, the same fleet run named 2 findings in other lanes. For A-102's absent line, its grep printed 1 on c/3b.html.
- Gated, not started: an upstream correction issue for the 3b DOI (outward contact: adversarial review and David's word first).
