---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-26
lifecycle_stage: launched
last_deploy: 412cd1d3 (the last page-changing commit; `npm run served` read 2 of 2 changed files served as committed at 2026-09-26T16:27:39Z)
on_hold_items: 0
top_action_today: settle 46a's citation from the published body of Bourgain's 1991 paper; it proves 31/8, not the row's 58/15, and the public page now says so
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# Daily report — bounds-ledger — 2026-09-26 (MT)

Three-stage day (David, card `99bb9206`): P1 evidence and choice, P3 the product-work loop, P5 the delta-only close. Every figure below names the command it came from and when it was read.

## BLUF

**FIRST ACTION (next session, 2026-09-27):** `A-47` slice 8 (the depth audit, which renders on the public constant pages) is due. Draw it and push the draw before any source is opened:

```bash
node scripts/sky.mjs show-item.mjs A-47 --fields closeWhen,nextCheckDateNote,slice7Draw2026_09_24
```

**DON'T-TOUCH:** nothing goes upstream about 46a until `A-57` (the drafted correction) has had its adversarial review and David has decided.

**The day in one line:** a citer looking up constant 46a is now told that the 1991 paper it credits proves 31/8, not the row's 58/15, and is pointed to the companion paper where 58/15 is proved. We read the published paper page by page from a free scan to settle it.

## What changed

- **`A-56` (settle 46a's depth-audit entry from the published body) is done, and the entry is DEFECTIVE** (`412cd1d`).
  - The premise that the published body sat only behind Springer's paywall was wrong. EuDML's entry `eudml.org/doc/58112` links the Göttingen Digitisation Centre, which serves GAFA volume 1 as page images. All 41 pages, pp. 147–187, returned HTTP 200.
  - The published paper proves 31/8. p. 185 reads "Take p₀ = 31/8", from Proposition 6.47 on p. 182. 58/15 appears on no page. The one citation of the companion paper, on p. 186, is for "refinements" and gives no exponent.
  - The defect is in the attribution, not the number: 58/15 is proved in Bourgain's companion paper, IHES M/90/74, Proposition 2.15.
  - `c/46a.html`, the index badge and the README's audit paragraph were re-rendered or updated. `npm run served` reads both changed pages as served.
- **`A-56` closed** (`59c8cd0`), with its three routes and their literal results recorded on the row.
- **`A-52` (write down how an outsider could act on a record without filing an issue) closed at the close.** Its `arrivalShapes` field now lists 10 shapes: 7 with a trace and a read command, each run once today, and 3 marked "no trace we can see".
- **`A-57` filed:** draft the upstream correction to 46a's attribution, review it, then bring it to David. It carries `correctionCandidate`, so `npm run catches` now reads a correction queue of 1 (A-57).

**Findings classification, one sentence of human judgment: today's one finding is RECORD-FACING.** A mirrored upstream entry credits a value to a paper that does not state it, and a human found it by reading the cited source in the depth audit.
- **Numeric or byte-only: neither.** It was found by reading, not by the drift alarm. `npm run catches` at 2026-09-26T16:49Z read 0 in the current partial week and 2 completed consecutive weeks with none.
- **Consecutive instrument-facing days: 0**, counted by hand. The run of 1 that ended yesterday is broken by today's record-facing finding.
- **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." **Today HELD it:** an attribution defect in the mirrored 46a entry, found by reading the cited source for an `A-47` entry. It was not falsified, and CLAUDE.md needs no correction.

**W-7 — one instrument read against its own claim: `gh search code "u00dxk2.github.io/bounds-ledger" --limit 50`, used at the close to ask whether anyone outside links our pages.** It returned 50 hits, all in our own repository. So it could never have shown an outside hit ranked below the 50th: a clipped read of a 143-hit total, because `gh api search/code` without the limit reported `"total":143`. The shape was replaced before any conclusion was drawn, by excluding our repository in the query (`-repo:u00dxk2/bounds-ledger`). That returned total 1, in our own `skylark-site`, and it is the command recorded on `A-52`. Rotation: 09-22 `A-55`'s readCommand, 09-24 `depth-audit.mjs`'s drawn-by-position count, 09-25 `update-david-board.mjs --list`, this one today.

## Inputs (controllable)

- **One adversarial review, on the right target, before the commit.** Target: working tree diff. Verdict: approve, "No material findings". Its render re-checks hit the sandbox's git EPERM. `npm run check` was run outside the sandbox on that tree (exit 0), and both render checks were run again after the commit (PASS).
- **One reading agent** read all 39 body pages offline. I read pp. 147, 148, 182, 185, 186 and 187 on the images myself, and every quotation stored was checked against them.
- **One hygiene helper** drafted A-52 and G-4. Both lines were amended at the close; see § Close.
- **No identity sent anywhere.** The fetches used Node's default user agent, with no email address and no name. Unpaywall was not used.

## Outputs (lagging)

- **`G-4` (an outside party acts on a watched record without us filing the report): 0 arrivals.**
  - Source: `npm run reports` at 2026-09-26T15:53Z, exit 0. It counted 30 raw issues: 30 ours by author and 0 outside, and the parts reconcile to 30.
  - The rule of three on 0 arrivals over the 29 clean-detection days since 2026-08-28 gives an upper 95% bound of about 0.10 arrivals a day.
  - The six other traces written onto `A-52` today, each read once, found nothing from outside.
  - Page readership is not measured at all.
  - Positive control: the same run counted 30 issues and attributed every one, so it reads issues when they exist.
- **Depth audit (the constants mirror):** "34 audited, 19 sound, 1 defective, 6 unresolved, 8 unreachable", from `node scripts/depth-audit.mjs`, run after the verdict was written (store `recordedAt` 2026-09-26T15:54:17Z) and before the commit `412cd1d`. Yesterday it was 0 defective and 7 unresolved; the move is `A-47-0030`.
- **The second area, printed beside it and never summed:** "census: 10 of 122 bound(s), across 5 of 42 credited paper(s) — 6 sound, 0 defective, 1 unresolved, 3 unreachable", from `node scripts/ds1-depth.mjs`. It is unchanged today.
- **Record-listing movements:** 0 in the current partial week, and 2 completed consecutive weeks with none (`npm run catches`, 16:49Z). **Correction queue: 1 (A-57).**
  Positive control: the same run lists 7 movements in the week of 2026-08-31, so it counts movements when they happen.
- **Publish:** "2 checked — 2 served, 0 in flight, 0 stale, 0 unreachable", from `npm run served` at 2026-09-26T16:27:39Z, anchored on `412cd1d387`. CI: `check-ci-status --workflow reverify.yml` on `59c8cd0d7f` returned GREEN.

## Recommendation

**[A — user-visible] 2026-09-27: `A-47` slice 8 (the depth audit), which renders on the public constant pages.** Draw it and push the draw before any source is opened. The model to follow is slice 7's draw, stored on the row as `slice7Draw2026_09_24` on 2026-09-24 and pushed before any of its five sources was opened.

**[A] 2026-09-28: `A-54` census session 2 and the rate checkpoint**, by `blockedSourceRule2026_09_25`. The reading brief sends no identity.

**[A] 2026-09-30: `A-57`.**
- Fetch the companion paper's published form.
- Draft the correction to the mirrored 46a entry into `docs/decisions/`.
- Run the adversarial review, including the method sentence.
- Then file ONE needs-decision with the reviewed draft attached. Send nothing.

## On hold pending data

**Nothing in this lane waits on David today.** `node scripts/sky.mjs answered-cards.mjs --project bounds-ledger` at P1 found no waiting or answered card. `A-57` becomes a David decision only after its draft is reviewed.

**Dated reads ahead:**
- `A-47` and `A-45` (the Tier-1 leading indicator): 2026-09-27.
- `A-54`, `A-2` and `W-12` (upstream's handling of our PR #194): 2026-09-28.
- `W-13` (someone must call the served-bytes check) and `A-49`: 2026-09-29.
- `A-57`: 2026-09-30.
- `G-4`: 2026-10-26.
- `W-3` (the watch for a reply about erdosproblems.com/36): 2026-10-08.

## State Appendix

### Selection packet (P1, posted as bus msgId b4c305ba at 2026-09-26T15:45:58Z)

**Outcome:** settle what the public page tells a reader about constant 46a's credited source. **Item:** `A-56`.

**The user problem, in the user's words** (from `docs/evangelism-bar.md`): *"I cited a bound and a referee told me it had been improved. I had no way to know."*

**Evidence at P1:**
- OBSERVED: `A-47-0030` stored UNRESOLVED.
- OBSERVED: the 2026-09-24 reading gave 31/8 in the preprint and in the published pp. 147–148, and 58/15 in the companion.
- HYPOTHESIS: the published body does not state 58/15.
- MISSING: the published pp. 149–187.
- MISSING: any reader of `c/46a.html`.

**Acceptance condition, (a):** a verdict read from the published body, adversarial review before the commit, the pages re-rendered and committed, and `npm run served` reading them SERVED. **Met.** The manager review on the bus (`60dbe402`) confirmed each leg and fetched the live page itself.

**HYGIENE INPUTS (as copied at P1):**
- (a) `A-52` and `G-4`.
- (b) none, from "0 of 724 considered".
- (c) three reads: dated gates 3 of 3 UNREAD; prior-day retro 2 of 2 "still on discipline"; missingLinkedCommits NOTHING SWEPT.

**Yesterday's recommendations** (Step 0.10):
- `A-56`: executed (`412cd1d`).
- `A-47` slice 8: carrying, to 2026-09-27.
- `A-54` session 2: carrying, to 2026-09-28.

**Section 0:**
- `npm run verify` at `08b739b`: TRUE exit 0.
- CI GREEN on `08b739bd42`.
- Deploy drift: NOTHING SWEPT for this lane. It is a GitHub Pages lane, which is neither a stop nor a pass; its own read is `npm run served`.
- Harness: running 2.1.283 · fleet UNIFORM · installed 2.1.283 (SAME).
- Codex: GREEN.
- Cycle rotation: no product-love cycle today.

### Close

ACTION: COMPLETED · item A-56 · P3 9b86d9d9 (the P3 task-complete's bus msgId)

**State changed since the P3 post (bus msgId `9b86d9d9`):** none to the product. The P3 receipt still holds, and no new one is posted.

**Hygiene draft** (`tmp/hygiene-draft-bounds-ledger-2026-09-26.md`): 2 lines, 0 accepted · 2 amended · 0 rejected.
- **`A-52`, AMENDED: the draft proposed a re-date; I wrote the list and closed the row instead**, because it is a definition and had slipped twice. `arrivalShapes` was written, and the row's own readCommand prints `## arrivalShapes` at line 73, with the control `## title (119c)` at line 10. Then `--close A-52`.
- **`G-4`, AMENDED from UNDECIDED.** Today's read and judgment went into `disposition2026_09_26`: none of the new traces is worth reading daily at this arrival rate. Then `--extend G-4 --new-target 2026-10-26`, the next instrument read, because David's 2026-09-10 ruling dropped the outcome date and set no cadence.
- READ-MUTATED: "none — 2 reads guarded", with the HEAD commit unchanged across both runs.
- Check verdicts, from the helper:
  - check-wait-justification: "RESULT: PASS — 1 of 72 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". That one row was `A-56`, which is now closed.
  - check-engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
    Positive control: the same run printed red rows for agentic-dir, bloom-edu and buddha-ur, so it reports findings where they exist.

**The rest of today's ledger delta:**
- `A-56`: closed naming `412cd1d`, with `routes2026_09_26` (in `59c8cd0`).
- `A-57`: minted, then `correctionCandidate: true` set. `npm run catches` then printed "Candidate-correction queue depth: 1 (A-57)".

**Verify:** `check-due-gates-dispositioned.mjs` (no flag) printed "snapshot CURRENT: taken today (2026-09-26); this verdict certifies today's Phase-0 due set of 3 row(s)". A-52 and A-56 were closed and G-4 re-dated, and the run ended "RESULT: PASS (exit 0)". The ledger gate battery, `continuity-check.mjs`, printed "status: OK • items: 73 • commits checked: 15", with information lines only.

**Pending reads, scheduled and not done:** the encounter and outcome reads on the 46a change cannot be taken, because no instrument reads a page reader. The only one that could fire is a report through the 46a row link, counted by `npm run reports` at `G-4`'s next read on 2026-10-26.

### Afternoon addendum: the lane reopened for an upstream merge burst

Written after the close, when David pasted the maintainer's merge notice for our PR #194. The figures above were true as of the close and are not rewritten.

- **What happened.** Upstream merged 17 queued pull requests between 16:49:24Z and 17:05:43Z, ours among them. The drift alarm failed on this lane's own pushes `aa1b917` and `0b413c4` and opened issues #40 and #41. The close-out had read CI only for `59c8cd0`, so both reds went unnoticed until David's message. A correction was posted on the bus as msgId `2980dc74`.
- **Resolved** in `ce5a57c` and `eb0405a`. 16 files were verified against their primary sources by four reading agents plus this session, and the 10c certificate was recomputed. 13 generated pins moved. CI is GREEN on `eb0405a`, and #40 and #41 are closed by hand with the account. The full log is `A-2.drift2026_09_26`.
- **The public correction figure moved from 1 to 2** on the #194 merge. The maintainer's comment corrected our premise: the old URL was serving the paper again, and the swap was accepted for stability. The README says so beside the figure.
- **Record-listing movements this week: no longer 0.** `npm run catches` will count this cycle's moved pins once `ce5a57c` is in history. 88a's pin moving to 240 is a listing artifact; the record, 186, stands.
- **Findings, one sentence of human judgment:** the afternoon added record-facing findings, four small citation-quality and editorial defects in text upstream merged today (`A-58`), found by reading sources during a drift cycle rather than in the depth audit. So they neither confirm nor falsify the standing prediction, which concerns the depth audit. Positive control: the same readings found every changed bound value supported, so the readers were reading the right documents.

### Live state

Written last. A report cannot name the commit that lands it, so every value carries its as-of and the command that re-reads it.
- **HEAD before this close's commit:** `59c8cd0`, the commit tomorrow's primer was composed against at 2026-09-26T16:53:32Z. Re-read with `git rev-parse HEAD origin/main`.
- **CI on `59c8cd0d7f`:** GREEN, as of 16:27Z. Re-read with `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`.
- **Served:** 2 of 2 changed files served, anchored on `412cd1d387`, as of 16:27:39Z. Re-read with `npm run served`.
- **Depth audit:** 34 audited, 19 sound, 1 defective, 6 unresolved, 8 unreachable. Re-read with `node scripts/depth-audit.mjs`.
- **Ledger:** 73 rows, per `continuity-check.mjs` at the close. Re-read with `node scripts/sky.mjs continuity-check.mjs`.
- **Open correction queue:** 1 (`A-57`, the drafted upstream correction to 46a's attribution). Re-read with `npm run catches`.
