---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-29
lifecycle_stage: launched
last_deploy: b2dbe8f (the last page-changing commit)
on_hold_items: 0
top_action_today: A-47 slice 9 and the 8a settle-step; 8a's credit is settled defective
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-09-29 (prelaunch report)

## BLUF

We checked five more numbers on the public pages against the papers they cite. Two hold up, and three could not be settled because we could not read the edition the page cites.

We also settled an open question on 8a. The number is right, but the page credits the wrong paper. We recorded it and sent nothing upstream.

## What changed

- **`A-47` slice 9** (the depth audit: reading our cited records against their sources). The draw was pushed in `113e098` before any source was opened, and the readings landed in `b2dbe8f`. `node scripts/depth-audit.mjs` now reads "44 row(s) audited — 25 sound, 2 defective, 9 unresolved, 8 unreachable"; this morning it read 39 — 23 / 1 / 7 / 8. The claim each row makes was named before reading, as the orchestrator's review asked (bus 3e8f9b4c).
  - SOUND: 20b [K2023] reports L_n ≤ C (log n)^{2.082…} as Lehec's personal communication, as the row's comment does, and does not prove it. 26a [DMP2019] is sound on its comment's attribution only; the row's infinity, credited to "Trivial", was not checked.
  - UNRESOLVED: 32a [FT23] never prints 3.45; the value follows only by converting a preprint line to bits (2 + 1/ln 2 ≈ 3.4427), and the ISIT edition was not reached. 3b [B1999] was read at the cited edition's preview pages only, which state the 13/25 Kakeya bound without its proof. 44a [CHS2020]'s preprint proves 26, and the Combinatorica body was not read.
- **8a is settled DEFECTIVE on its credit** (`A-47-0036`), by route (b) of the settle condition written on 2026-09-27. Rosser and Schoenfeld 1975, p. 250, was read from a Wayback `id_` capture of the AMS PDF. It says its R = 9.645908801 "improves Stechkin's Theorem 2 … by having a smaller value for R". The row's 9.64591 is theirs, and the bound is true. The translation our entry cites was read at its abstract only, and `c/8a.html` says so. Recorded, not filed upstream.
- **Findings classification, one sentence of human judgment:** today's 8a result is record-facing. It is a citation-quality defect (a credit) in a mirrored upstream entry, found by a human reading the cited sources in `A-47` and not by any alarm. Today's other findings were instrument-facing: an overclaimed "prove" on 3b's page, caught by review, and a stale `evidence` field on 8a, caught by the orchestrator's P3 review and fixed at the close.
  - **Numeric or byte-only: neither.** The drift alarm counted nothing today. Positive control: `reverify.test.mjs` plants synthetic drift in 10a.md on every `npm test` and asserts that it is detected, and today's verify ran it.
  - **Consecutive instrument-facing days: 0**, counted by hand. Yesterday was instrument-facing (1); today had a record-facing finding.
  - **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." **Today it HELD.**

## Inputs (controllable)

- Five background reading agents, one per row, run under `tmp/slice9-brief.md`. The brief forbids sending any identity, Unpaywall, completing a verification challenge and shadow libraries. It requires reading the cited edition and naming the claim before reading. Every quotation stored was checked by this session against the saved page image.
- The 8a retry was walked in order: the Wayback availability API (429 three times), its CDX index (503), OpenAlex and Semantic Scholar (bronze OA only at the AMS path, which served a Cloudflare challenge), and then the Wayback `id_` capture, which returned the PDF.
- One hygiene helper, whose draft is applied at the close.
- Codex adversarial review of the working tree, Target: working tree diff. Round 1: needs-attention, 1 medium, fixed; it judged the 8a verdict defensible with its edition disclosure. Round 2, on the fixes: approve. The review is recorded as `meta.reviewRounds` round 7 in `continuity/depth-audit.json`.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report), read by `npm run reports` after the push:** "OUTSIDE ARRIVALS: 0" of 32 raw issues, with the parts reconciling (32 + 0 + 0 = 32). By the rule of three, that puts a 95% upper bound of about 3/32 on the outside share of issues. It says nothing about readers who never file. Positive control: the probe saw all 32 issues and classified every one.
- **Delivery:** `npm run served` read "30 checked — 30 served, 0 in flight, 0 stale, 0 unreachable" (exit 0), anchored on `b2dbe8f`.
- **The two depth counts, side by side and never summed:** the constants mirror is above. Small Ramsey Numbers (`node scripts/ds1-depth.mjs`) did not change today; no census session was due.

## Recommendation

- 2026-09-30: census session 3 on `A-54`. Apply the tripwire before planning.
- 2026-10-01: `A-47` slice 10.
- 8a and 46a (`A-57`) are now two attribution corrections of the same shape. Whether either goes upstream is David's gate after an adversarial review, and neither is proposed today.

## On hold pending data

- **Three slice 9 rows are UNRESOLVED on editions not read:** the ISIT paper (32a), the GAFA body pp. 258–282 (3b) and the Combinatorica article (44a). Each entry's notes name what would settle it. The Wayback `id_` route that reached RS1975 was also tried on all three publisher files, and it returned nothing: 404 for 32a and 3b, and a 302 with no content for 44a.

## State Appendix

### Close

ACTION: COMPLETED · item A-47 · P3 bus msgId ecd4c046. The acceptance condition was met:
- `node scripts/depth-audit.mjs` prints 44 rows audited, with the five slice 9 fingerprints in the store. Each verdict names the edition read.
- The five constant pages carry their entries live: `npm run served` 30 of 30, and a live fetch of `c/32a.html` contains "never prints 3.45".
- 8a carries a verdict that names the editions read.
- The orchestrator's P3 review (bus e381d193) read these independently and marked the work COMPLETED.

State changed since the P3 post: the 8a `evidence` field. The P3 review found that it still said RS1975 "was NOT read" beside a DEFECTIVE verdict resting on reading it. The public page did not render that sentence, but the record is public. The old text moved to `evidenceBefore2026_09_29`, and `evidence` now carries the p. 250 quotation. The P3 receipt still stands, so no new receipt is written.

Ledger delta at the close:
- Hygiene draft: 2 lines — 1 accepted · 1 amended · 0 rejected. READ-MUTATED: none. Its checks read "check-wait-justification: RESULT: PASS — 1 of 75 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)" and "check-engineering-zero --project bounds-ledger: RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
  - `W-13` (someone must call the served-bytes check): ACCEPTED, re-dated to 2026-10-06. Today's two literal reads are on `W-13.disposition2026_09_29`.
  - `A-49` (make the close gate fail on an empty or placeholder primer banner): the draft was UNDECIDED; AMENDED to a close as dropped. The fleet's `check-cold-readability.mjs` already fails a placeholder banner. Red-armed today: a placeholder copy of a primer gave "RESULT: FAIL — 1 cold-readability finding(s) (exit 1)", and the real primer gave "RESULT: PASS — 0 cold-readability finding(s) (exit 0)". The fleet treats an empty banner as a decision, not a defect, and a faithful build here would need a grammar this public repo's CI cannot import. Closed-id sweep, `\bA-49\b` over `scripts/`, `docs/` and `*.md`: 15 files, all dated reports and primers, none in `scripts/`.
- `A-47`: `nextCheckDate` 2026-09-29 → 2026-10-01, with the reason on `nextCheckDateNote`. Also new today: `slice9Draw2026_09_29`, `slice9Landed2026_09_29`, and `linkedCommits` += 113e098, b2dbe8f.
- Tomorrow's primer, `docs/cold-starts/2026-09-30.md`: generated, and its banner and narrative written by hand. `check-cold-readability.mjs` reads "RESULT: PASS — 0 cold-readability finding(s) (exit 0)". `npm run close:primer` reads "RESULT: PASS — tomorrow's primer exists and its first action runs".

Due-gate verification: `check-due-gates-dispositioned.mjs` reads "RESULT: PASS (exit 0)", with "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-09-29)".

Pending reads, each dated on its row:
- The census tripwire at the start of `A-54` session 3: 2026-09-30.
- `A-47` slice 10: 2026-10-01.
- `W-13`'s next served-bytes read: 2026-10-06.

### Selection packet (P1)

**Outcome:** five more cited records on the public constant pages are checked against the papers they cite, and the open question on 8a is either settled or its remaining routes are named. Item: `A-47` — the depth audit of the constants mirror (David-ruled 2026-09-09; the lane's interim yardstick since 2026-09-10).

**The user problem, in the user's words:** "Can I cite this number, and does the paper it names actually say it?" (`docs/evangelism-bar.md`: the reader is someone about to cite a bound).

**Evidence**
- OBSERVED — `npm run reports`, run at P1 today: "OUTSIDE ARRIVALS: 0" of 32 raw issues, parts reconcile 32 + 0 + 0 = 32. Population: GitHub issues on this repo · window: 52 days since the public flip · limits: blind to any reader who does not file.
- OBSERVED — `node scripts/depth-audit.mjs`, exit 0: "39 row(s) audited — 23 sound, 1 defective, 7 unresolved, 8 unreachable", unchanged since 2026-09-27. `--corpus`: "691 cited of 788 bound row(s)", and the stored denominator matches the live corpus.
- OBSERVED — 8a settle routes already walked (`A-47.settle8aAttempt2026_09_28`): the AMS page for RS1975 served a Cloudflare challenge (HTTP 403); Springer served the translation's abstract only (R = 9.65), with the body paywalled at USD 39.95.
- OBSERVED — this morning the Wayback Machine availability API answered HTTP 429 to both the RS1975 PDF query and the translation PDF query. Neither was retried; this is a route not yet walked, and slice 5 read a Springer body through an Internet Archive capture (A-47-0034's source line).
- MISSING — any read of who opens a constant page. The pages are static with no analytics, by standing decision; arrivals are the only encounter read.
- HYPOTHESIS — the standing prediction (CLAUDE.md): the next record-facing catch is a citation-quality defect found by a human reading a cited source in this audit.

**Permission:** `A-47` is open, not parked, not frozen, with no open card on it. It is standing work David ruled on 2026-09-09, and today is its due date (`nextCheckDate=2026-09-29`). Reading and recording is inside the lane's authority. Anything sent upstream is not: the outward gate applies (adversarial review plus David's explicit approval), and nothing today sends anything.

**Next action — kind: improve (deliver built value).** Slice 9 was drawn at P1 by `node scripts/depth-audit.mjs --draw 162 212 262 312 362`, exit 0, before any source was opened. The draw continues slice 8's offset-12 grid. Frame 691: 20b [K2023], 26a [DMP2019], 32a [FT23], 3b [B1999], 44a [CHS2020]. None of the five fingerprints is in `continuity/depth-audit.json` (grep count 0; positive control: 8a's row fingerprint `e69d94cf39be033e`, a sha256 of the mirrored row text and not a commit, counts 1). P3 re-derives the draw, commits and pushes it before any reading agent is dispatched, and then retries 8a first, as the primer orders. The 8a retry is a query to the Wayback Machine's availability API for the RS1975 PDF path at the AMS and for the translation's PDF at Springer. The first command: <!-- pragma: allowlist sha -->

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 162 212 262 312 362
```

**Acceptance condition:** `node scripts/depth-audit.mjs` prints 44 rows audited, with the five slice-9 fingerprints in the store, each verdict naming the edition read. The five constant pages (`c/20b.html`, `c/26a.html`, `c/32a.html`, `c/3b.html`, `c/44a.html`) carry their audit entries live. 8a either carries a verdict that names the edition read, or stays UNRESOLVED with today's routes recorded on `A-47-0036`.

**Delivery and encounter checks:** `npm run served` after the push (exit 0 = the pushed bytes are served), and `npm run reports` at the close. The event that would appear is an outside issue arriving through a row's "looks wrong?" link. At this traffic it is readable only at n = 1, and a zero is expected, not a verdict.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, `c/20b.html`, `c/26a.html`, `c/32a.html`, `c/3b.html`, `c/44a.html`, possibly `c/8a.html`, `index.html` (the audited count), `continuity/items.json`.

**Prior-day retro finding that bears on the choice:** the placeholder timestamp recurred on 2026-09-28 and is still on discipline. This packet states no clock time it did not read.

**HYGIENE INPUTS** (copied from the kickoff's reads)
- (a) Due rows not bearing on the choice, 2 of 3 due: `A-49` (tomorrow's-primer check; `expectedSignalBy` 2026-09-29, its last read was empty) and `W-13` (the standing call of the served-bytes check; due 2026-09-29, never run). `A-47` is selected and leaves this list.
- (b) Owed child rows: none. Read: "rows owed to you in skylark-site's ledger: 0 of 729".
- (c) State reads marked crossed: key numbers, no `docs/key-metrics.json` (0 of 1 file present); missingLinkedCommits, nothing swept (0 of 0 considered, so not judged). All other kickoff reads are within threshold: CI GREEN at `796ed7f`, 0 queued, 0 stale-actionable of 19, 0 answered cards.

### Round 2 selection packet (P1)

David asked for a second product round on 2026-09-29. Round 1 above is done and is not redone. The round 2 packet was posted as written in `tmp/p1-packet-r2.md`. In summary:

- **Outcome:** on the public index, a constant whose cited source we tried to read and could not is told apart from one we never looked at. Item: `A-53` (the store and the page can disagree about how many rows were read), its second instance, found by the orchestrator on 2026-09-21.
- **Evidence:** `node scripts/depth-audit.mjs` reads 8 unreachable, and 7 of them are bound rows on constants with no reading at all: 31a, 43a, 24a, 65a, 15a, 52a, 80a. The index shows nothing on those, by the assertion at `scripts/render-site.mjs:1023`. The other route was tried first: a Wayback `id_` fetch of 24a's PDF returned 404, with 0 CDX captures.
- **Next action (improve):** a third index badge meaning attempted-and-unreadable, never worded as a reading, tested through the index render.
- **Acceptance:** the live index badges exactly the attempted-and-never-read constants, no read badge changes, and the self-test is red-armed both ways.
- **USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs`, `scripts/render-site.mjs`, `index.html`, `continuity/items.json`.

### Close (round 2)

ACTION: COMPLETED · item A-53 · P3 b004dad2. The acceptance condition was met:
- The live index (https://u00dxk2.github.io/bounds-ledger/, HTTP 200) carries 7 `class="tried"` lines, on exactly the constants the store says were attempted and never read: 15a, 24a, 31a, 43a, 52a, 65a, 80a.
- It still carries 29 `class="read read-` badges, as before.
- `npm run served` read SERVED for index.html at `920f2ae`, and `reverify.yml` read GREEN on it.
- The self-test was red-armed both ways (P3 post b004dad2). The orchestrator's P3 review (bus d66bc252) read these independently and marked the work COMPLETED with no defects.

State changed since the P3 post: none in the code or on the page.

The review's process point is answered here, not implied. The Codex review's focus text named the new index hint among four challenges, but nobody attacked it as its own angle, which CLAUDE.md asks for with a method sentence. This session then checked it by hand against each of the seven records. "We tried on the date it gives and were turned away or found nothing" holds for all seven:
- Five were turned away: 43a, 24a, 52a and 80a by a bot challenge, and 31a by a host that refused the connection.
- 65a's DOI service returned HTTP 502 twice.
- 15a's publisher returned a redirect page and metadata only.
Each printed date is that attempt's `fetchedAt` day. It is MT for 52a and 80a, whose attempts were at 01:46Z on 09-25. "That row's number has not been checked" is true for all seven, since none has any other reading. This was one reviewer checking their own sentence, not an independent review.

Ledger delta at the close:
- Hygiene draft (`tmp/hygiene-draft-bounds-ledger-2026-09-29-r2.md`): 0 lines — 0 accepted · 0 amended · 0 rejected. READ-MUTATED: "none — 0 reads guarded (no `--run` executed)". Checks: "check-wait-justification: RESULT: PASS — 1 of 75 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)" and "check-engineering-zero --project bounds-ledger: RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
- `A-53`: `renderFix2026_09_29` was added in `920f2ae`. The row stays OPEN. Its guard choice between (a), (b) and (c) on its onTrigger is due 2026-10-01 (`expectedSignalBy`, unchanged), and tomorrow's primer banner now names that read.
- Tomorrow's primer (`docs/cold-starts/2026-09-30.md`): its banner was rewritten in place for round 2, at 1,115 characters. `check-cold-readability.mjs` exit 0.

Due-gate verification: `check-due-gates-dispositioned.mjs` read "RESULT: PASS (exit 0)", with "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-09-29)".

Pending reads:
- `A-53`'s guard choice: 2026-10-01.
- `A-59`, the encounter on the public pages: 2026-10-28, or the first outside arrival counted by `npm run reports`. The outcome of this change stays open until then.
