---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-26
lifecycle_stage: launched
last_deploy: "91b2e9f (as of 2026-11-26 P1; reverify.yml and page-check.yml GREEN; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: each constant page's search snippet and link preview carry the mirror date (and the footer states it); per-page values were planned and withdrawn after review (see the findings block)
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger: daily report, 2026-11-26

## BLUF

Every constant page's search snippet now says which day our copy of the source was taken, so a reader sees how old the listing is before clicking. The footer says the same day. I planned to show each page's own numbers too, but a second model's review showed that a number lifted out of its table can lose the condition that limits it, so the snippet now sends the reader to the rows instead.

## What changed

### P1 selection packet

- **Outcome:** a researcher who meets a constant page in a search result or a shared link sees that constant's last-listed upper and lower bounds in the snippet itself. Item: the carried product step (yesterday's Recommendation B, `docs/daily/2026-11-25-prelaunch.md`), which is tracked in that report and the primer rather than as its own item in `continuity/items.json`.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a bound and a referee told me it had been improved. I had no way to know." The snippet is the first place a looked-up value could appear. Today it says nothing about the value.
- **Evidence:**
  - OBSERVED: `pageDescription()` in `scripts/render-constant-pages.mjs:58-60` returns one template sentence whose only varying part is the title. All 123 pages' `<meta name="description">` and `og:description` differ only in the constant's name. `ogMismatch` already pins og:description to equal the page description byte for byte.
  - OBSERVED: a census over `buildRows(ledger/claims.json)` today (scratchpad script, read-only): 123 pages, 246 bound sides. 20 sides are already plain text and 115 are a bare decimal inside `$…$`, so 135 of 246 can be shown as plain numbers under one strict rule. The remaining 111 carry LaTeX or markup (for example 1c `$\frac{1}{2(1+\theta\_0)} = 0.4107675\dots$`, 1a `$1.292*$`) and need a stated fallback. 8 pages have both sides plain as stored.
  - OBSERVED: `W-19` (the second Search Console read), recorded 2026-11-25, window 2026-11-04..11-23: 168 impressions and 2 clicks, all on the index; 0 impressions on any `c/` page. So no searcher has seen a `c/` snippet yet. This change is ready for the first one, but nobody is waiting on it today.
  - HYPOTHESIS: a snippet with the number in it is more useful to the evangelism bar's archetype than one without. Nothing measures this. The proving metric is NOT MEASURABLE (`docs/evangelism-bar.md`, "Reader reach is unmeasured").
  - MISSING: whether anyone has shared a `c/` link. GitHub Pages gives no request log (`A-59`).
- **Permission:** lane-owned renderer and generated pages; ship-under-authority (an obvious first-order product improvement). Outward gate: the change publishes new sentences on public pages, so it gets an adversarial claims pass from the other model family (Codex, high effort) before it is pushed, per `AGENTS.md` § Hard invariants and portable rule 6. Nothing goes upstream. No board card is open on it.
- **Next action, kind: improve.** Change `pageDescription(r)` to name each side's last-listed value when it passes the strict plain-number rule, and fall back to the existing wording for a side that does not. Add a selftest that first proves a positive control (a known page's value appears), then asserts no `$` or `\` in any description. Red-arm it. Re-render index and `c/`, run both `--check`s, and run the Codex claims pass on a sample of the new sentences. The work stays on a local branch until review. First command (prep, read-only):
  ```
  node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --selftest
  ```
- **Acceptance:** live GETs of at least three `c/` pages (one both-plain, one mixed, one full-fallback) show a `<meta name="description">` and `og:description` that name that page's own value(s), or the fallback wording where a side is not plain. The two tags are byte-equal on each page. Neither contains `$` or `\`. `render-constant-pages.mjs --check` and `render-site.mjs --check` exit 0. `page-check.yml` and `reverify.yml` are GREEN at the pushed sha. The Codex claims pass returns no unresolved REFUTED-AS-WRITTEN.
- **Delivery and encounter checks:** delivery at P3/P5 by the Pages build row for the pushed sha, plus the live GETs above (`npm run served` checks only the anchor commit's files). Encounter: Search Console impressions on any `c/` page, readable at N = 1. Next scheduled read 2026-12-09 (on the Search Console watch row named above), and Google may take weeks to re-crawl a snippet. Until then the encounter is blind and stays labelled that way.
- **USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs`, `c/*.html` (123 pages, head only), possibly `index.html` if a shared helper moves (it should not).
- **HYGIENE INPUTS** (copied from the kickoff's reads):
  - (a) due rows not bearing on the choice, 4 (morning snapshot: "4 gate(s) due on/before 2026-11-26"): `A-2` (drift-resolution log), `A-47` (the depth audit), `A-77` (the filed-report check), `W-16` (upstream issue 289, the 87a display question).
  - (b) owed child rows: none. Kickoff read: 0 of 855 in skylark-site's ledger.
  - (c) CROSSED state reads: none. Read: stale-actionable 0 of 32; missingLinkedCommits NOTHING SWEPT (0 of 0), which is not a crossing; queued rows 0.

<!-- findings:begin -->
### Correction to the packet's premise (P3)

The packet's outcome was a snippet naming each page's own last-listed values. **That outcome was withdrawn after review.** What shipped is the mirror date in every snippet and footer, with no values. The values were wrong to show, for these reasons:

- Codex round 1 on `ec9ff93`, gpt-6.2-sol, high effort, read-only: lifting a row's first cell drops a condition written in the row's own note. Examples: 81a's upper 2.1594 assumes the Generalised Riemann Hypothesis; 67a's is a conjectured endpoint; 86a's awaits replay; several 0 and 1 rows are noted trivial.
- Round 2 on `918fb8a`, after narrowing to note-free rows (11 values on 9 pages): the condition can sit outside the row, in the table's prose. 45a's two values bound an upper and a lower density that may not exist. 52a's bound a limsup and a liminf of a threshold whose existence is conjectured.
- Two rounds, one defect class, so the shape changed: the snippet claims less. A word list of qualifiers is the shape both rounds ruled out.
- Round 3 on `e97ac00`: two checker gaps, fixed in `a3eee2d`, and the 10c title note (its name, "six standard deviations suffice", carries a value, and the snippet repeats titles as it did before today).
- Round 4 on `a3eee2d`: "VERDICT: SHIP".

The manager's point (1), the date beside the rows, shipped. Point (2), the per-value check, became moot. It was replaced by a stated rule: one description tag and one og:description with equal content; the description opens with the mirror day; the footer's mirror sentence states the same day; no other number outside the title.

The round-0 helper's census (110 of 246 sides are bare decimals, and 99 of those rows carry a note) is the population that sank the value design.
<!-- findings:end -->

## Inputs (controllable)

- P1 reads and one read-only census. No commit touches the change paths before the manager's review.

## Outputs (lagging)

- Search Console, 2026-11-04..11-23: 168 impressions, 2 clicks, index only; `c/` pages 0 (`W-19` (the second Search Console read), recorded 2026-11-25).

## Recommendation

- [A, today's outcome] Per-page description carrying each page's own last-listed values, behind a Codex claims pass. Shipped as the date-only form in `a3eee2d` after review withdrew the values (findings block above); do not re-add values without a design that carries each value's context.
- [B, dated] `W-17` (the weekly newer-papers run), due 2026-11-27. Take it at P3 if time allows; never commit its output.
- [C, late] `A-108` (the per-constant change feed).

## On hold pending data

- none.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-25.md` (no 2026-11-26 file; the written-date convention).
- Listener: 🟢 SSE alive (hello 2026-11-26T15:49:08Z) + idle loop armed by `ScheduleWakeup`; waker ladder ranks 1-3 running.
- Codex: GREEN (the kickoff's machine-level probe, 2026-11-26T15:55:09Z).
- CI at HEAD `91b2e9f0dc913e43075ee7d53b813c8d6df70976`: `reverify.yml` GREEN (exit 0), `page-check.yml` GREEN (exit 0). Deployed-sha drift: not applicable, because this is a GitHub Pages lane with no Render service. The fleet sweep has nothing to read here, which is neither a stop nor a pass.
- Harness: running 2.1.332 · fleet UNIFORM · installed 2.1.332 (SAME).
- Recs from 11-25: A executed (`4210b26` through `a53c180`, closed COMPLETED in the 11-25 close). B is carrying today as today's outcome. C, `A-108` (the per-constant change feed), is still carrying as late work.
- Product-love rotation: "no product-love cycle picks this lane today" (`check-cycle-rotation.mjs`, exit 0).
- Due gates (`check-due-gates-dispositioned.mjs --snapshot`): "4 gate(s) due on/before 2026-11-26"; unread 0 of 4.
- Board: `answered-cards.mjs --project bounds-ledger`: 0 lane cards, 0 new; the one portfolio rider (312499ee, machine memory) does not govern this lane's work.
- Prior-day retro finding (still on discipline): the 11-25 Q0 judged recurrence against standing memory entries. It bears on today only through the measurement-composed-not-run rule, which the census above follows.

### Close

ACTION: DEFERRED — the selected outcome, per-page bound values in the snippet, was withdrawn on review (Codex r1 and r2 found one defect class: a value loses the context that limits it); the date-only snippet shipped instead · trigger 2026-12-09, the read of `W-19` (the Search Console watch), and a design that carries each value's limiting context passing one Codex claims round · item `A-113` (the per-page values deferral) · P3 ef718243

- **Shipped and live:** `a3eee2d` (the tip of `ec9ff93`, `918fb8a`, `e97ac00`, `a3eee2d`). The Pages build was built 2026-11-26T18:16:14Z, and `reverify.yml` and `page-check.yml` are green at `a3eee2d`. Live GETs of `c/45a.html`, `c/81a.html` and `c/10c.html` show the new description, an equal og:description and the dated footer. The manager review (msg 54ee5623) read the same and marked it DEFERRED.
- **Since the P3 post:** `ledger/upstream-reports.json` re-baselined issues 218 and 289 to CLOSED (2026-11-22T07:16:17Z and 07:16:18Z, copied from `gh issue view`). The reported-row labels on the index and on `c/46a.html` and `c/87a.html` now read closed 2026-11-22 instead of open. `check-upstream-reports.mjs` then printed "RESULT: PASS — 0 transition(s) across 3 recorded report(s) (exit 0)".
- **Ledger delta** (`continuity/items.json`, through `continuity-edit.mjs`):
  - Minted `A-113` (the per-page values deferral): `deferral: true`, `expiresOn` 2026-12-09, a release test, readCommand `render-constant-pages.mjs --check`.
  - Closed `W-16` (the watch on upstream issue 289). It was closed upstream 2026-11-22T07:16:18Z with 0 comments and no commit; the closer's association was not read. The 87a [Mar1978] row moved to the exact form in `4210b26`. This is our own filed report, so it is G-3's shape, never G-4's.
  - `A-2` (the drift-resolution log), `A-47` (the depth audit) and `A-77` (the filed-report check): re-dated to 2026-12-03 by `--set` on both clocks, each with a dated note.
- **Hygiene draft:** 4 lines — 0 accepted · 4 amended · 0 rejected.
  - A-2, A-47 and A-77 were amended from `--extend` to `--set` on both clocks. A-77 also got the baseline update its line named as the lane's.
  - W-16 was UNDECIDED and is resolved as AMEND to a close, after the by-hand metadata read.
  - The helper's verdicts: wait-justification "RESULT: PASS — 3 of 136 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)", and engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable".
  - Its READ-MUTATED lines: "READ-MUTATED A-77 scripts/render-constant-pages.mjs — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks" and the same line for W-16. Both were my own P3 edit, and neither readCommand reads that file.
- **Due gates:** `check-due-gates-dispositioned.mjs` "verdict: CLEAR — every gate due at Phase 0 was dispositioned.", snapshot CURRENT (taken 2026-11-26).
- **Findings classification** (one sentence of judgment, never a counter): today's window holds no record-facing finding. The 87a row moved upstream on 11-22/23 and was verified in yesterday's cycle; it is not a defect we found. The day's findings are instrument- and product-facing: four review rounds on our own snippet, `A-47`'s 87a control gone stale, and my own splice and polling slips. That makes 1 consecutive instrument-facing day, since 11-25 ended the last run. No catch was counted today, numeric or byte-only, because no drift fired. The standing prediction (the next record-facing catch is a citation-quality defect found by a human reading a cited source in the depth audit, `A-47`) is neither met nor falsified today.
  - positive control: the same window returned non-empty instrument- and product-facing findings (the four Codex verdict files `tmp/bounds-ledger-codex-r1..r4-verdict.md` and `A-47`'s read output), so the reading could see a finding. The drift alarm could fire and did not: `reverify.yml` green at `a3eee2d`.
- **Pending reads:** `W-17` (the weekly newer-papers run) 2026-11-27; `A-112` (the 22 moved pins never read) 2026-12-02; `A-2` (the drift-resolution log), `A-47` (the depth audit), `A-77` (the filed-report check) 2026-12-03; `A-113` (the per-page values deferral) and `W-19` (the Search Console watch) 2026-12-09.
- **codexCalls:** 4 (rounds 1-4 at P3, read-only, gpt-6.2-sol, high effort).
