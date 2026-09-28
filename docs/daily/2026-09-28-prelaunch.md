---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-28
lifecycle_stage: launched
last_deploy: 9649491 (the last page-changing commit; today's commits touch no public page)
on_hold_items: 0
top_action_today: A-54 census session 2 (seven papers, ten bounds) and the rebuild's rate checkpoint; the completion date is restated to 2026-10-20
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-09-28 (prelaunch report)

## BLUF

We checked seven more papers behind the Ramsey table, and five of them back their numbers. Readers see no change yet, because the page stays as it is until the rebuild is finished.

Twenty of the table's 122 values have now been checked. At the pace we have actually managed, the rebuilt page lands on 2026-10-20, four days later than planned.

## What changed

- **`A-54` census session 2** (the rebuild of the Small Ramsey Numbers table from the papers it credits). The plan was pushed in `2415d38` before any source was opened, and the ten readings were committed after it. `node scripts/ds1-depth.mjs` now reads "census: 20 of 122 bound(s), across 12 of 42 credited paper(s) — 14 sound, 0 defective, 2 unresolved, 4 unreachable". Positive control: the same line counts non-zero unresolved and unreachable verdicts, and the constants-mirror store holds one DEFECTIVE (A-47-0030), so the verdict class exists and is counted when it occurs.
  - SOUND (8 bounds, 5 papers, each read in the edition the survey cites): R(3, 8) ≤ 28 [McZ]; R(3, 10) ≤ 41 [Ang1]; R(3, 11) ≥ 47 [Ex20]; R(3, 11) ≤ 50, R(3, 13) ≤ 68, R(3, 14) ≤ 77 and R(3, 15) ≤ 87 [GoeR1, all four in its Theorem 7]; R(3, 12) ≤ 59 [Les].
  - R(3, 10) ≥ 40 [Ex5] is UNRESOLVED. Only SIAM's abstract was reached, and it names R(3, 10) without a value. A citing paper states the value, which is corroboration and does not settle the verdict.
  - R(3, 12) ≥ 53 [Kol1] is UNREACHABLE. The 2015 Tyumen issue is not online anywhere this census may use.
- **The rate checkpoint, due today, was read, and the completion date moves from 2026-10-16 to 2026-10-20** (`A-54.rebuildCheckpoint2026_09_28`). Sessions attempted 5 and then 7 papers, a mean of 6, which is above the floor of 4, so the rate rule itself did not fire. What moves the date is attendance: two of the last three census slots ran. At 6 papers a session and two slots in three, the seven slots through 12 October cover about 28 of the 32 remaining papers. Nine slots, through 16 October, cover them all, and rendering and review then take the 18th and the 20th. A tripwire restates the date again at the first session where the papers remaining exceed 4 per census slot left (6 papers a session times two slots in three).
- **My first draft held the old date, and the adversarial review refuted it** before commit. The draft used the best day's 7 papers as the forecast.
- **The orchestrator's hypothesis was measured.** Its conclusion, that the date would slip past 2026-10-16, is right at the measured figures. The cause is missed slots rather than per-session pace: at 5 papers a session with every slot run, the census would end on 12 October.
- **The Wikipedia comparator was dropped**, with its reason on `A-54.comparatorDropped2026_09_28`, and `A-54.closeWhen` no longer requires it. It is not re-dated a fourth time.
- **Findings classification, one sentence of human judgment:** today had no record-facing findings, because every bound that was read matched its source; today's findings were instrument-facing and about our own record: my checkpoint arithmetic forecast from the best day rather than the measured mean (caught by review), and A-54's closing condition and trigger still required the dropped comparator (caught partly by me and partly by review); all were fixed before commit.
  - **Numeric or byte-only: neither.** The drift alarm counted nothing. Positive control: `reverify.test.mjs` plants synthetic drift in 10a.md on every `npm test` and asserts that it is detected, and today's verify ran it.
  - **Consecutive instrument-facing days: 1**, counted by hand (yesterday had record-facing findings).
  - **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." Today NEITHER HELD NOR FALSIFIED IT: no record-facing catch was made.

## Inputs (controllable)

- Seven background reading agents, one per paper, run in parallel under `tmp/census2-brief.md`. That brief is session 1's brief plus the route ladder, the 20-minute access limit and the rule to read the cited edition. Every quotation stored was checked by this session against the saved text or the rendered page images.
- One hygiene helper, whose draft is applied at the close.
- One Codex adversarial review of the working tree before commit (Target: working tree diff). It confirmed all ten verdicts and the survey credits, and it raised two medium findings, both fixed before commit: the optimistic arithmetic (now restated) and A-54's live fields still reading the comparator as owed (rewritten). It also noted three normalised quotations, which are now labelled as normalised or transcribed from the page image.
- A second Codex review, focused on those fixes (Target: working tree diff), raised three medium findings, each applied as the reviewer recommended:
  - The tripwire ignored the attendance assumption its own forecast used. It now compares the papers remaining against 4 per slot left.
  - A-54's `closeWhen` did not require the rebuild to land. It now does.
  - This report said four blocked bounds where there are six. It now says six.
  - These last edits were checked by inspection, not by a third review.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report), read by `npm run reports` at 15:27:29Z:** 0 outside arrivals of 32 issues, and the parts sum (32 + 0 + 0). By the rule of three, that puts a 95% upper bound of about 3/32 on the outside share of issues. It says nothing about readers who never file. Positive control: the probe saw all 32 issues and classified every one of them.
- **The two depth counts, side by side and never summed:** the constants mirror (`node scripts/depth-audit.mjs`) reads "39 audited, 23 sound, 1 defective, 7 unresolved, 8 unreachable", unchanged today. Small Ramsey Numbers (`node scripts/ds1-depth.mjs`) reads 5 drawn and a census of 20 of 122.
- **Reach of today's change:** none by construction. Census rows are held off both public pages until the rebuild lands.

## Recommendation

- 2026-09-29: `A-47` slice 9, and settle 8a through Rosser–Schoenfeld 1975 or the cited translation before anything is filed.
- 2026-09-30: census session 3, starting at NaRT. Apply the tripwire at the start.

## On hold pending data

- **8a's credit:** a lead until the cited edition or RS1975 is read.
- **Six census bounds across four papers blocked on access** (Ka2 holds three; GrY, Ex5 and Kol1 one each). Each row's notes name what would settle it. Retrying them is outside census pace.

## State Appendix

### Close

ACTION: COMPLETED · item A-54 · P3 bus msgId 0eb5686f. The acceptance condition was met:
- `node scripts/ds1-depth.mjs` prints a census of 12 papers, not 5.
- DS1-0016 to DS1-0025 carry `selection: "census"` and a 2026-09-28 `fetchedAt`.
- `render-ramsey --check` PASS, with 0 changed lines in either page.
- The checkpoint and the comparator disposition are both on A-54.
- The manager review of P3 (bus 2ca0f3ff) read all four independently.

State changed since the P3 post: none. The P3 receipt still stands, so no new receipt is written.

Ledger delta at the close:
- `A-2` (the drift-resolution log): `nextCheckDate` 2026-09-28 → 2026-10-05. This AMENDS the hygiene helper's `--extend`, because the row's own `nextCheckDateNote` says it deliberately carries no signal date.
- Hygiene draft: 1 line — 0 accepted · 1 amended · 0 rejected. READ-MUTATED: none. Wait-justification PASS, engineering-zero PASS for this lane.
- Everything else on A-54 was written during P3 and landed in `084546a`.

Due-gate verification: `check-due-gates-dispositioned.mjs` reads "verdict: CLEAR — every gate due at Phase 0 was dispositioned", and it names the snapshot CURRENT (taken 2026-09-28).

Pending reads, each dated on its row:
- `A-47` slice 9 and the 8a settle-step, 2026-09-29.
- The census tripwire at the start of session 3, 2026-09-30 (32 papers against 36 at this close).
- `A-2`'s next look, 2026-10-05.

### Selection packet (P1)

[P1 — Evidence and choice]

**Outcome:** `A-54` (adopting Small Ramsey Numbers, the second watched area), census session 2 of the table rebuild David ruled on 2026-09-20, plus the rate checkpoint the rebuild scope dated for today.

**The user problem, in the user's words** (`docs/evangelism-bar.md` lines 20–21, verbatim): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." The census answers the "has anybody looked" half for ramsey.html: each Section 2.1 value ends up either independently sourced or labelled as credited to the survey and not checked.

**Evidence, one line each:**
- OBSERVED · `node scripts/ds1-depth.mjs` at P1 today · the store `continuity/depth-audit-ds1.json` · all time · counts only what is stored: "census: 10 of 122 bound(s), across 5 of 42 credited paper(s) — 6 sound, 0 defective, 1 unresolved, 3 unreachable"; drawn by position 5, never summed with the census.
- OBSERVED · the census rows' `fetchedAt` fields · the same store · 2026-09-18 to today · every census row is dated 2026-09-25, so **one** census session has run, not the two the checkpoint was dated to follow. Session 1 attempted 5 papers and read 3 (GG, Kéry, GR); the 2 it could not reach were GrY and Ka2 (`A-54.blockedSourceRule2026_09_25`).
- OBSERVED · `node scripts/ds1-depth.mjs --frame` · Table Ia, revision #18 · today · the census order, by first appearance, puts McZ, Ex5, Ang1, Ex20, Kol1, Les, NaRT and Kol2 next (GoeR1 was read in the drawn slice; the scope counts it as attempted).
- OBSERVED · `npm run reports`, run at 2026-09-28T15:27:29Z (the output file's write time; its count and reconcile lines are quoted here because the file is gitignored) · issues on this repo · 51 days since the flip · "raw issues fetched: 32 … OUTSIDE ARRIVALS: 0 … parts reconcile: 32 + 0 + 0 = 32." This is slice 8's encounter read (`A-47.encounterRead2026_09_28`). It counts filed reports only and says nothing about readers who never file.
- OBSERVED · `npm run verify` receipt at 15:27:59Z, sha `f603e18963a9c4c5d0dcdb0c58424f6b91d5938a`, exitCode 0 · includes both due rows' readCommands: "No drift. 116 files match upstream <upstream teorth/optimizationproblems sha, elided because it does not exist in this repo; reprint with `node scripts/reverify.mjs --check`>." and "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)."
- MISSING · how many readers open ramsey.html at all. The pages are static and carry no analytics.

**Permission:** `A-54` is open and not parked. The census is the rebuild David ruled for on 2026-09-20. Census rows are written to the store and held off both public pages by `pageRows()` while his freeze stands ("Until that is done, leave the page as written"). The alternation (census day, then A-47 day) and the census-day receipt were approved by the orchestrator (bus 64c23ecf). No card is open on the item.

**Next action — kind: improve (census reads), with the checkpoint read beside it.**

```
node scripts/ds1-depth.mjs --frame
```

Then attempt the next papers in census order under the route ladder and the 20-minute access limit, with background reading agents under the brief rules: no email, no Unpaywall, no human-verification challenge, no shadow library, and a citing paper never used as a route to the source. Every quotation gets checked against the saved text before any verdict is stored. A verdict follows the edition actually read (see the retro line below).

**The checkpoint, due today** (`A-54.rebuildScope2026_09_21`, "if it is below 4 papers per session, the completion date is restated ON 2026-09-28"): it is reported as two numbers, papers ATTEMPTED per session and papers READ, with the difference named by source. Session 1 attempted 5, which is above the floor of 4. What moved the plan is that only one of the two expected sessions happened. So the completion date of 2026-10-16 is re-read against about 37 remaining papers today and restated if the arithmetic no longer holds.

**The comparator's pre-committed condition also fires today** (`A-54.phase2Slip3_2026_09_22`): there is no rebuilt table to point a Wikipedia comparator at. The condition forbids a fourth re-date, so the close names one of two outcomes: the comparator is dropped with a written reason, or it is scoped against the survey's own table and says so.

**Acceptance condition, observable:** `node scripts/ds1-depth.mjs` prints a census line with more than 5 papers after the commit, and every new row has `selection: "census"` and a `fetchedAt` dated 2026-09-28. `node scripts/render-ramsey.mjs --check` passes. `git diff --numstat` shows 0 changed lines in ramsey.html and copying.html (positive control: the same read lists the census store's changed lines). The checkpoint line and the comparator disposition are both written onto `A-54`.

**Delivery and encounter checks:** none today, by construction. Census rows do not render until the rebuild lands (planned for 2026-10-16), so nothing reaches a reader. `npm run reports` stays the encounter read. At the current traffic, an arrival is a single filed issue through a per-row link, and one is enough to count (n=1).

**USER-FACING: no.** Paths: `continuity/depth-audit-ds1.json`, `continuity/items.json`, and `docs/daily/2026-09-28-prelaunch.md`. Census rows are filtered off ramsey.html and copying.html by `pageRows()`, and `render-ramsey --check` enforces that the committed pages match. Tomorrow's primer is also touched.

**One prior-day retro finding that bears on the choice:** "the verdict follows the reading" broke twice in the last week (46a on 09-24, 8a on 09-27), each time on a DEFECTIVE stored from an edition other than the one the entry cites. A census session is the same shape of read, so before any non-SOUND verdict is stored, check that the edition read is the edition the credit names.

**HYGIENE INPUTS:**
- (a) Due rows that do not bear on the choice — 1: `A-2` (the drift-resolution log), due 2026-09-28. Its readCommand ran inside today's verify: "No drift. 116 files match upstream …", and the second leg read "catch table: 17 cycles, and README.md says 17." No cycle is owed. (`A-54` is also due today, but it is the selection, so it is not on this list.)
- (b) Owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger" (0 of 729).
- (c) State reads marked CROSSED: none. Read: the kickoff state block, where no threshold clause printed as crossed. Stale-actionable was 0 of 18, and missingLinkedCommits swept nothing (0 of 0), which is not a clean read.

**Section 0 lines:**
- Listener: 🟢 SSE alive (restart 15:06:15Z, hello 15:06:17Z) + wake loop armed by ScheduleWakeup.
- Codex: GREEN (codex-cli 0.157.0; the kickoff's probe line at 15:13:18Z).
- CI: `check-ci-status --workflow reverify.yml` GREEN for f603e18963a9c4c5d0dcdb0c58424f6b91d5938a (exit 0). Deploy drift: NOTHING SWEPT for this lane, because it is a GitHub Pages lane with no checksPass Render service. That is neither a stop nor a pass. The fleet table exited 0.
- Harness: running 2.1.283 · fleet UNIFORM · installed 2.1.283 (SAME).
- Recommendations from yesterday: (1) the A-54 census session with the encounter read first — the encounter read is done and the census is carried into P3. (2) A-47 slice 9 and settling 8a — carried to 2026-09-29, as dated.
- Rotation: `check-cycle-rotation` says no product-love cycle picks this lane today (exit 0).

### Live state at the close (as of 2026-09-28T16:21:12Z; this report cannot name the commit that lands it)

- HEAD before the close commit: `084546ad70746784223d2853b9537fcad52b76f4`, 0 commits apart from origin/main. Release: `git rev-parse HEAD origin/main`.
- CI on that commit: GREEN, per `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`, which is also the release command.
- `npm run verify` receipt: exitCode 0 at that sha (`tmp/.verify-receipt.json`). The close commit touches only doc-shaped paths (`docs/`, `continuity/`), so the receipt carries forward under the ancestor carve-out.
- The census: `node scripts/ds1-depth.mjs` reads "census: 20 of 122 bound(s), across 12 of 42 credited paper(s) — 14 sound, 0 defective, 2 unresolved, 4 unreachable". That command is also the release.