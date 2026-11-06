---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: not-read-yet
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-05
lifecycle_stage: launched
last_deploy: b296216 (CI GREEN on reverify.yml and page-check.yml; GitHub Pages; no Render service)
on_hold_items: 0
top_action_today: each constant page gets a plain-text title a mathematician would search for, and the site gets a sitemap
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-05 (Thursday, MT)

## BLUF

Every constant page now has a plain-text title a mathematician can search for, and the site has a sitemap. For example, "Sphere packing density in $\mathbf{R}^4$ (36a)" now reads "Sphere packing density in R⁴: upper and lower bounds (36a)". Both are live (commit `d81a1af`). Whether Google shows the pages to anyone is still unknown, because that needs David to verify the site in Google Search Console; a card asks him.

## What changed

- **Titles, descriptions and headings on all 120 constant pages are plain text** (`d81a1af`, live since the Pages build at 17:17:05Z). 22 titles carried LaTeX. Each now comes from a hand-written table, and a new LaTeX title from upstream stops the render until someone writes its plain form. The description says only what every page shows: the last-listed upper and lower bounds, a link to the upstream source file, and a citation you can copy.
- **`sitemap.xml`** lists the index and all 120 pages (121 URLs, served HTTP 200).
- **Three Codex review rounds.** Round 1 found four defects, all confirmed and fixed: two overclaiming description clauses, one notation that changed meaning (`μ(Z²)` reads as a function applied to Z²), and one gap in the refusal. Round 2 found the same two classes again, so the converter was replaced by the reviewed table and the description was cut further. Round 3 returned SHIP. Positive control: the same round's claims pass found 240 of 240 rendered bound rows and 120 of 120 upstream links, so it read the pages it judged.
- **A card for David** (card `207bbc2c`, bus msg `d44d230a`): verify the site in Search Console and submit the sitemap.
- **Round 2: the index rows and every citation now use the plain-text name too** (`ad69c6a`, live since the Pages build at 00:26:31Z on 11-06). The citation is the one text a reader pastes elsewhere; on each of the 22 affected constant pages it had read `$\mathbf{R}^4$` under a heading reading "R⁴". The index row's title link and its screen-reader labels changed with it. The search box still finds a row by the LaTeX name and now also by the plain one. Deliberately unchanged: the prefilled "looks wrong?" issue keeps the LaTeX name, because whoever triages it matches against upstream's file. Bound values are untouched. One Codex review (round 1 on `ad69c6a`): no defects.
- The traffic counter ran again (`npm run traffic`, 15:36:44Z): 7 unique repo viewers in the latest 14-day window. Visitors to the public pages are still not measured.

## Inputs (controllable)

- Plain-text titles and descriptions on the `c/` constant pages, and a sitemap (P3).

## Outputs (lagging)

- Google impressions and clicks on the `c/` pages: not readable until a Search Console property is verified. First read due 11-11. Until then the encounter is blind, not zero (`A-59`, the row saying nothing can see an arrival on the public pages).

## Recommendation

- David: press Verify in Google Search Console and submit `sitemap.xml` (card 901dddba). He answered the first card (`207bbc2c`) with the verification file at 17:26Z; it is live (`33f5001`). The goal's first impressions read is due 11-11.

## On hold pending data

- The first Search Console read, due 11-11, sits on `W-18` (the watch for that read). David answered card 901dddba at 18:00:55Z: the property is verified and `sitemap.xml` is submitted, so nothing blocks the read now.

## State Appendix

### Close

ACTION: COMPLETED · item goals-reset-2026-11-05 (search-reach setup week) · P3 msg e46d10b4

- The acceptance condition is met. No served `c/` title carries `$` or a backslash. `sitemap.xml` serves 200 with 121 URLs. CI page-check.yml and reverify.yml are green on `d81a1af`. The card went to David.
- Since the P3 post: David sent the verification file (card `207bbc2c`). It is committed in `33f5001` and serves 200 with Google's token (17:31Z). Card 901dddba asks for Verify and the sitemap submission.
- Ledger delta:
  - `W-16` (watch on upstream issue 289) re-dated to 11-12. Its first read ran today: issue OPEN, no comments.
  - `W-3` (the erdosproblems.com/36 acknowledgement watch) re-dated to 11-12. Both page legs read "page unchanged".
  - `A-77` (who runs the filed-report check) has its caller DECIDED rather than a third bare re-date: `npm run upstream` now runs in the morning block of `docs/daily-config.md`, beside `npm run traffic`. The row is re-dated to 11-12 for its red-arm and its pull-request scope question.
  - `W-18` (the watch for the first Search Console read) was minted for 11-11.
- Due-gate verification: `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-05).
- Pending reads:
  - `W-18`, 11-11, Search Console impressions, gated on card 901dddba.
  - `A-50` (the import-is-inert selftest), due 11-06.
  - `A-97` (overstated sentences about our tooling), due 11-06.
  - `A-77` (the filed-report check's red-arm), `W-16` (issue 289 watch) and `W-3` (the erdosproblems.com/36 watch), all due 11-12.

### P1 selection packet

The packet as posted to the bus at P1: `tmp/p1-packet-2026-11-05.md`, quoted in the P1 task-complete body. Summary:

- Outcome: a mathematician searching for a constant can find its page on Google. Item: the goals reset of 2026-11-05 (skylark-site `docs/goals/2026-11-05-goals-reset.md` § Bounds Ledger).
- Evidence: the titles carry raw LaTeX (`c/36a.html:5`). There is no sitemap, robots file or verification file (Glob over the repo root, 0 files). The traffic counter ran today. Google readership is MISSING until verification.
- Next action: improve. Retitle the pages, rewrite the descriptions and add a generated `sitemap.xml`. File one card for Search Console verification.
- USER-FACING: yes — `scripts/render-constant-pages.mjs`, `c/*.html`, `sitemap.xml`.
- HYGIENE INPUTS: (a) `A-77` (who runs the filed-report check), `W-16` (watch upstream issue 289, never run), `W-3` (the erdosproblems.com/36 acknowledgement watch). (b) none. (c) none.

### P1 selection packet, round 2

Round 2 was approved on card d569a762. The packet as posted: `tmp/p1-packet-2026-11-05-r2.md`. Summary:

- Outcome: a mathematician who copies a citation, or scans the index, sees each constant's name in plain text. The 22 titles that carry LaTeX still show it in the index rows and in every cite block, including the cite block on each constant page, whose own heading is already plain (`c/36a.html`).
- Evidence: OBSERVED in `index.html` and `c/36a.html` at `3742fd9`; who copies a citation is MISSING (no instrument on the published pages).
- Next action: improve. Route the index row heading, its labels and the citation's title line through the reviewed plain-title table; keep the raw title searchable.
- USER-FACING: yes — `scripts/render-site.mjs`, `scripts/render-constant-pages.mjs`, `index.html`, `c/*.html`.
- HYGIENE INPUTS: (a) none. (b) none. (c) none.

### P3, round 2

- Delivered: Pages build row for `ad69c6a` reads `built` at 00:26:31Z (11-06). A live fetch found 120 of 120 index cite title lines with no `$` or backslash, and 22 of 22 changed `c/` pages carrying a plain cite title line that names their own id. CI page-check.yml and reverify.yml are green on `ad69c6a`.
- Test: the new render-site selftest went red on the unrouted code ("the citation's title line must carry no LaTeX source") and green after.
- Encounter: blind. The published pages carry no instrument: `A-59` (nothing can see an arrival on the public pages). The first readable signal is `W-18` (the first Search Console impressions read, due 11-11).
- A stated limit: 26 index row headings still contain `$` or a backslash. All 26 come from audit badge text that quotes mirrored bound values, not from a title.
