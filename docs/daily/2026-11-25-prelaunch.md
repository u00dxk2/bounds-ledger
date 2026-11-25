---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-25
lifecycle_stage: launched
last_deploy: "c2501c8 (as of 2026-11-25 P1; page-check.yml GREEN, reverify.yml RED on the drift alarm since 2026-11-22; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: resolve the 2026-11-22/23 upstream merge burst so the public ledger shows the current records again (46 mirrored files, 17 moved pins, 2 new constants)
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger: daily report, 2026-11-25

## BLUF

Upstream merged about fifty pull requests on Sunday and Monday, and our public page has shown the old records for four days. Today I check the moved rows against their sources and refresh the page, so a reader sees the current bounds and the three new constants.

## What changed

### P1 selection packet

- **Outcome:** a reader who opens the index or a constant page sees the bounds upstream currently lists, with the date each moved. Item: the drift cycle on issues 50 to 53 (the `Drift:` issues the scheduled run filed on 11-22, 11-23, 11-24 and 11-25); no ledger row, because a red drift run is the alarm working, not a backlog item.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a bound and a referee told me it had been improved. I had no way to know." Today our own page is the thing that would not have told them.
- **Evidence:**
  - OBSERVED — `check-ci-status.mjs --workflow reverify.yml` at HEAD `c2501c82c7e78bb5411e6ef0856d5ffe782b1699`: RED, 4 completed runs failed (exit 3). `--workflow page-check.yml`: GREEN (exit 0). Read 2026-11-25 ~19:40Z.
  - OBSERVED — the newest scheduled run (45584648819, 2026-11-25T09:21Z), its log read with `gh run view --log-failed`: "46 file(s) drifted"; `check-claims`: "254 claim(s): 235 hold, 17 broken/unreachable, 2 unverified (manual)". All 17 are BROKEN, none UNREACHABLE: 16a:L, 1c:L, 20c:U, 22a:U, 31a:U, 31a:L, 42a:U, 57c:L, 70a:L, 78a:U, 80a:U, 80a:L, 82a:U, 83a:U, 83a:L, 86a:U, 8a:L. ADDED: 89b, 89c.
  - OBSERVED — `gh api repos/teorth/optimizationproblems/compare/87b4ebb...main` (87b4ebb is an upstream sha; it does not exist in this repo): 157 commits, 49 files. The merges run 2026-11-22T06:52Z to 2026-11-23T23:56Z: 49 commits titled "Merge pull request #N", plus a few pull requests landed as direct commits (corrected at P3 from "about sixty", which the resnap commit `4210b26` body still says). Upstream main still reads `83e93c3` (an upstream sha), committed 2026-11-23T23:56:20Z, so the burst is finished: resolve once, to that sha. pragma: allowlist sha
  - OBSERVED — four open drift issues (50, 51, 52, 53), one per scheduled run.
  - HYPOTHESIS — some of the 17 are byte-only (asterisks removed after replays on 82a and 86a; 83a's abbreviated centre corrected). Being checked now; see prep below.
  - OBSERVED — `W-19` (the second Search Console read), through the agent reader, now registered: 2026-11-04..11-23 (the last day with data), 168 impressions and 2 clicks, all on the index; **0 impressions on any `c/` page**. The date rows sum to 168. Positive control: the index row in the same read. The page dimension returned 1 row, under the reader's 10-row cap, so no `c/` row was cut.
  - MISSING — whether any reader opened a stale row in the four days. The page has no analytics, by design (`A-59`).
- **Permission:** the steward cadence (`CLAUDE.md`, snapshot-on-drift discipline): verify against primary sources, then `npm run resnap` and commit deliberately. Lane-owned files only. Nothing goes upstream. The items held for a ruling are untouched.
- **Next action — deliver built value (the drift cycle).** Prep running now, read-only: two reading helpers check each of the 17 moved last-listed rows against the source it cites, with a positive control from the same fetch. After review: first command
  ```
  npm --prefix C:/dev/skylark/bounds-ledger run resnap
  ```
  then `npm test`, the commit with the verification paragraph, a second `render-site.mjs` and `render-constant-pages.mjs` after the commit, and `npm run check`.
- **Acceptance:** `reverify.yml` GREEN at the pushed sha; issues 50 to 53 closed by hand, each naming the resolving sha; live GETs of `index.html`, `c/89b.html`, `c/89c.html` and two moved pages (`c/1c.html`, `c/8a.html`) show the new rows; `npm run served` exit 0.
- **Delivery and encounter checks:** delivery at P5 by the Pages build row for the pushed sha and the live GETs. Encounter: blind (`A-59`). The only arrival this page can show is an outside issue through a row's report link (`npm run reports`), readable at N = 1.
- **USER-FACING: yes.** Paths: `ledger/teorth-optimizationproblems/**`, `ledger/claims.json`, `README.md` (state block), `index.html`, `c/*.html` (incl. new `c/89b.html`, `c/89c.html`), `sitemap.xml`, `ledger/open-pull-requests.json`; possibly `ledger/openai-math-map.json` or the step-overlap store if their self-tests refuse the new rows.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 15 (morning snapshot, "16 gate(s) due on/before 2026-11-25", less the Search Console read above): `A-45` (stale-value resolvability), `A-91` (67a's withdrawn preprint, held at the outward gate), `A-108` (per-constant change feed, 2 days late), `A-109` ("Constant not tracked" title, 1 day late), `A-110` (design-pass candidate, 1 day late), `G-5` (checking AI-found results), `W-13` (call the served-bytes check), `W-17` (newer-papers line), `W-4` (prove every new detector can fail), `W-8` (amended outward artifact back to David), `A-59` (encounter blind), `A-70` (phone link heights), `A-89` (decimal-vs-exact census), `W-14` (upstream issue 218; the kickoff reports it closed 2026-11-22), `W-20` (the 200 open pull request ceiling).
  - (b) owed child rows: none. Kickoff read: 0 of 855 in skylark-site's ledger.
  - (c) CROSSED state reads: stale-actionable 7 of 32 (threshold >3). missingLinkedCommits: NOTHING SWEPT (0 of 0), not crossed.

### Verification prep (read-only, before review)

Two reading helpers read each of the 17 moved last-listed rows at upstream `83e93c3` against the source it cites, each with a positive control from the same fetch; the lead re-derived two figures. This is the set reviewed: the rows the pins assert, not every change in the 46 files.

- **All 17 hold against their sources.** Numeric moves: 1c:L (new last row `0.4103735*` [Esc2026], exact fraction in its repository README), 20c:U (`C_{20c} < ∞`, two preprints, arXiv 2610.05474 and 2610.01447, proofs not read), 42a:U (`0.686360751` [Vat26], replay `RESULT C42 <= 686360751/1000000000: PASS`), 57c:L (new row `0.61230*` [P2026]), 78a:U (`4/3` [Sim2026], arXiv 2610.31589), 83a:U and 83a:L (the abbreviated centre corrected to `…4764297`; it matches OEIS A038517's b-file and the paper's Theorem 1.1). Byte-only (an asterisk added or removed, a replay note, a comment clause; no number moved): 16a:L, 22a:U, 31a:U, 31a:L, 70a:L, 80a:U, 80a:L, 82a:U, 86a:U, 8a:L.
- Lead re-derivation: 31a:U, `2·ln(2·0.3376)/ln λ` = 0.8241195407 with the replay's λ and 0.8241197833 with the source's, both ≤ 0.824120 (`node -e`). 57c below.
- **Two record-facing findings in the mirrored upstream pages** (contact nobody; the outward gate applies):
  1. **86a contradicts itself.** The `1.8084990` [Kos2026] row lost its asterisk, but the same row's comment still ends "Asterisked: a self-archived computer-assisted certificate, not yet independently replayed." The page's opening prose still calls that bound "currently asterisked". Read in the CI log of run 45584648819 (the `+` lines for `constants/86a.md`). The number holds: the PR #292 replays give T/m = 1.80849897300…, "rounded up" to 1.8084990.
  2. **57c's cited preprint has a newer version with a larger bound.** arXiv 2610.34580, "Bounds for the univalent Bloch-Landau constant" (positive control: the title), lists `[v2] Thu, 5 Nov 2026`; its abstract reads "We prove $0.619\le\mathcal{U}<0.6562681$". The mirrored page quotes v1's 0.612242, and its last-listed row is 0.6123*. Read by the lead, live GET 2026-11-25.
- Also noted, not defects: on 1c the last-listed row is not the best row ([Sag2026] 0.410378195 sits earlier), which is why a generated pin asserts listing position only; 22a's 10.02 traces only to a 2023 post cited by the arXiv paper; 16a's bound holds under the "Equivalently" definition, which the page's comment now says.
- **Scope, found by the Codex claims pass at P3:** 39 existing generated pins changed `expect` (`git diff c2501c8 4210b26 -- ledger/claims.json`, 39 removed `expect` lines). The 17 above are the ones whose old row left the page (BROKEN). The other 22 moved to a newly last-listed row while the old row stayed, so `check-claims` never flagged them, and **those 22 new rows were not read**.
- UNREAD: the 16a upper bound; the proofs behind 20c; the 31a [T2026] report page; the 78a 1.385 row (abstract cut off); the Nakajima–Sun step on 80a:L; the rows of the two added constants, 89b and 89c (their pins assert listing position only).

### P3 — the drift cycle, shipped

- **Implementation:** five commits on main, `4210b26` (resnap to upstream `83e93c3`, an upstream sha; plain titles for 89b and 89c; `openai-math` notes on 8a and 15b withdrawn because upstream now lists those claims itself, 46a's source hash updated), `d8ee54f` (second render: change dates from committed history), `a58e060` (README drift row, 21 cycles, 123 constants), `054d735` (six depth-audit entries re-pointed, `rowLineBefore2026_11_25` kept), `a53c180` (index re-render). `npm test` passed through `verify-with-receipt` at the pre-commit tree (exit 0); `npm run check` passed leg by leg after the fixes. pragma: allowlist sha
- **What the checks caught on the way, each fixed:** the plain-title guard refused the new 89b title; `openai-math --selftest` refused the stale map; `render-state-block --check` refused the README (20 cycles, 120 constants); `check-audit-lines` found six moved audit rows; `page-check.yml` went RED at `054d735` (run 45702069387, "index.html is stale") because I re-rendered the constant pages after the re-point and not the index, fixed in `a53c180`. Sibling sweep: four renderers read `continuity/depth-audit.json`, all four pass their checks at `a53c180`. Between the `054d735` and `a53c180` Pages builds (21:11:47Z, 21:15:26Z), four index badges showed the pre-re-point audit counts.
- **Review:** two read-only Codex rounds (gpt-6.2-sol, reasoning effort high, banner workdir checked). Round 1 on the hand-written parts of `4210b26`: no defect in them; its one FIX FIRST finding, "date unknown" on moved rows, was the second render, fixed in `d8ee54f`. Round 2, a claims pass on the README row: three sentences narrowed before commit, the main one being scope (39 pins changed, 17 broke and were read, 22 were not read).
- **Delivery:** CI `reverify.yml` and `page-check.yml` green on `a53c180` (`check-ci-status.mjs --wait`, exit 0 each). Pages build row for `a53c180`, built 2026-11-25T21:15:26Z. Live GETs with no JavaScript: index 200, 123 rows, `c-89b` present, `83e93c3` present; `c/89b.html` 200 with title "Ramsey multiplicity constant of K₅"; `c/89c.html`, `c/31b.html` 200; `c/1c.html` carries `0.4103735`; `c/42a.html` carries `0.686360751`; `c/8a.html` carries `4.81406` and no longer the withdrawn note's phrase "not in the source table" (positive control: `c/46a.html`, whose note stays, carries it); `sitemap.xml` 126 URLs. `npm run served`: PASS, exit 0.
- **Drift issues 50 to 53:** closed by hand (issue 53 closedAt 2026-11-25T21:17:06Z), each with a comment naming `4210b26` and CI green at `a53c180`. Open issues after: 0 (the same query read 4 this morning).
- **Encounter:** blind. The pages carry no analytics by design (`A-59` (encounter blind)); the only visible arrival is an outside issue through a row's report link. `npm run reports`, read by the hygiene helper today before the push: 0 outside arrivals of 41 raw issues, parts reconcile.
- **Outcome:** open.
- **Not done, carried:** the 22 pins that moved to a newly last-listed row were not read against their sources; the rows of 31b, 89b and 89c were not read.

## Inputs (controllable)

- P1 reads and read-only verification prep. No commit touches the change paths before the manager's review.

## Outputs (lagging)

- Search Console, 2026-11-04..11-23: 168 impressions, 2 clicks (both 11-09), index only; `c/` pages 0 (`W-19` (the second Search Console read)).

## Recommendation

- [A — today's outcome] The drift cycle above: verify, resnap, commit, close issues 50 to 53.
- [B — next product step, carried] Per-page `og:description` carrying each page's own data, through a Codex claims pass at high effort. It goes after A, because it must describe the refreshed rows.
- [C — late] `A-108` (the per-constant change feed): its id refusal (due 11-23), red then green.

## On hold pending data

- none.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-21.md` (no 2026-11-25 file; the written-date convention).
- Listener: 🟢 SSE alive (hello 2026-11-25T19:24:03Z) + idle loop armed by `ScheduleWakeup`.
- Codex: GREEN (the kickoff's machine-level probe, 2026-11-25T19:32:13Z).
- CI at HEAD `c2501c82c7e78bb5411e6ef0856d5ffe782b1699`: `reverify.yml` RED (the drift alarm; exit 3), `page-check.yml` GREEN (exit 0). The red is the alarm, not a broken build, and today's action resolves it. Deployed-sha drift: not applicable. This is a GitHub Pages lane with no Render service, so the fleet sweep has nothing to read here, which is neither a stop nor a pass.
- Harness: running 2.1.332 · fleet UNIFORM · installed 2.1.332 (SAME).
- Recs from 11-21: A executed (`49f9e0a`, released after the close); B, the open pull request refresh, carried into today's resnap, whose fifth step is `open-pulls.mjs --fetch`; C, `A-108` (the per-constant change feed), carrying as late work.
- Product-love rotation: "no product-love cycle picks this lane today" (`check-cycle-rotation.mjs`, exit 0).
- Due gates (`check-due-gates-dispositioned.mjs --snapshot`): "16 gate(s) due on/before 2026-11-25".
- Prior-day retro: no prior-day retro on record for this lane.

### Close

ACTION: COMPLETED · item drift issues 50 to 53 (the 2026-11-22/23 upstream merge burst) · P3 msg 9123c38c

- **Acceptance met** (the P1 packet's): `reverify.yml` and `page-check.yml` green at `a53c180fec9569f7635e35ad18f9a773daa4edf0`; issues 50 to 53 closed by hand naming `4210b26`; live GETs of the index, `c/89b.html`, `c/89c.html`, `c/1c.html` and `c/8a.html` show the new rows; `npm run served` exit 0. The manager review (msg e9e709d3) read the same and marked it COMPLETED. Its note stands: `served` checked the one file `a53c180` touched, and the constant pages were proved by the live GETs.
- **Since the P3 post:** nothing changed on the public pages. The close commit carries the report, this close, the primer and the ledger.
- **Ledger delta** (`continuity/items.json`, through `continuity-edit.mjs`):
  - Minted `A-112` (read the 22 pins that moved without breaking, and recheck the 86a and 57c findings), due 2026-12-02 or at the next drift cycle, readCommand the `claims.json` diff that enumerates them.
  - Closed `W-14` (upstream issue 218, closed 2026-11-22T07:16:17Z; the 46a change verified in the drift cycle).
  - `W-19` (the second Search Console read) answered: index 168 impressions and 2 clicks, `c/` pages nothing yet through 2026-11-23; next read 2026-12-09.
  - Re-dated with `--set` on every clock each row carries, each with a dated note: `A-45` (stale-value resolvability), `A-91` (67a's withdrawn preprint), `A-108` (the per-constant change feed), `A-109` ("Constant not tracked" title), `A-110` (design-pass candidate), `G-5` (checking AI-found results), `W-13` (the served-bytes check), `W-4` (prove every new detector can fail), `W-8` (amended outward artifact back to David), `A-59` (encounter blind), `A-70` (phone link heights) and `A-89` (decimal-vs-exact census) to 2026-12-02; `W-17` (newer-papers line) to 2026-11-27; `W-20` (the 200 open pull request ceiling) to 2026-12-09.
  - `continuity/depth-audit.json`: six entries re-pointed in `054d735`.
- **Hygiene draft:** 22 lines — 8 accepted · 14 amended · 0 rejected. Accepted: the `W-14` close and the 7 stale-actionable lines (command `none`, covered by their due lines). Amended: the 14 re-dates, each an `--extend` turned into `--set` on every clock the row carries, because `--extend` does not move `nextCheckDate`. `READ-MUTATED`: all five paths (README.md, `ledger/claims.json`, `index.html`, `ledger/open-pull-requests.json`, `scripts/lib/plain-titles.mjs`) were my own concurrent resnap writes. Checks: `check-wait-justification` "RESULT: PASS — 3 of 135 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)"; `check-engineering-zero` "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
- **Due gates:** `check-due-gates-dispositioned.mjs` "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-25). Its first run read ROLLOVER on `W-19` alone, which I had answered at P1 without writing to the row; recorded, then CLEAR.
- **Closed-id sweep for `W-14`:** `grep W-14` over `scripts/`, `docs/` and the root `*.md`: 0 in `scripts/` and in the root files; 65 files under `docs/`, all dated primers and daily reports plus `docs/decisions/2026-10-29-A88-87a-display-question-final.md`, which are historical records and are not edited.
- **Findings classification** (one sentence of judgment, never a counter): today's window holds two record-facing findings, 86a's row whose asterisk was removed while its own comment still calls it not yet replayed, and 57c quoting v1 of a preprint whose v2 states a larger bound, both recorded on `A-112`. Several instrument-facing ones were fixed the same day: my index not re-rendered, my overstated sentences, the reads I did not run. Neither counted catch was numeric: `npm run catches` was not run, and the 17 broken pins split 7 whose shown value moved and 10 whose value did not. The run of consecutive instrument-facing days that began on 11-13 ends today. On the standing prediction (the next record-facing catch is a citation-quality defect found by a human reading a cited source in the depth audit, `A-47`): 57c fits its shape and its "a human reading the cited source" clause, but arrived through the drift cycle's verification read and not the depth audit. 86a is a page-internal inconsistency first seen in the alarm's own diff. Neither meets the written falsifier (the alarm surfacing a row its own source does not support), so the prediction is not corrected in `CLAUDE.md` today. The route is strained, and I say so.
- **Pending reads:** `W-17` 2026-11-27; `A-112`, `A-45`, `A-91`, `A-108`, `A-109`, `A-110`, `G-5`, `W-13`, `W-4`, `W-8`, `A-59`, `A-70`, `A-89` 2026-12-02; `W-19`, `W-20` 2026-12-09. Re-derive with `node C:/dev/skylark/skylark-site/scripts/check-due-gates-dispositioned.mjs --print`.
- **codexCalls:** 2 (both read-only reviews at P3).
