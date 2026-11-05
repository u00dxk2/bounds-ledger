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
- The traffic counter ran again (`npm run traffic`, 15:36:44Z): 7 unique repo viewers in the latest 14-day window. Visitors to the public pages are still not measured.

## Inputs (controllable)

- Plain-text titles and descriptions on the `c/` constant pages, and a sitemap (P3).

## Outputs (lagging)

- Google impressions and clicks on the `c/` pages: not readable until a Search Console property is verified. First read due 11-11. Until then the encounter is blind, not zero (`A-59`, the row saying nothing can see an arrival on the public pages).

## Recommendation

- David: verify the site in Google Search Console and submit `sitemap.xml`. The steps are on card `207bbc2c`. The goal's first impressions read is due 11-11.

## On hold pending data

- None.

## State Appendix

### P1 selection packet

The packet as posted to the bus at P1: `tmp/p1-packet-2026-11-05.md`, quoted in the P1 task-complete body. Summary:

- Outcome: a mathematician searching for a constant can find its page on Google. Item: the goals reset of 2026-11-05 (skylark-site `docs/goals/2026-11-05-goals-reset.md` § Bounds Ledger).
- Evidence: the titles carry raw LaTeX (`c/36a.html:5`). There is no sitemap, robots file or verification file (Glob over the repo root, 0 files). The traffic counter ran today. Google readership is MISSING until verification.
- Next action: improve. Retitle the pages, rewrite the descriptions and add a generated `sitemap.xml`. File one card for Search Console verification.
- USER-FACING: yes — `scripts/render-constant-pages.mjs`, `c/*.html`, `sitemap.xml`.
- HYGIENE INPUTS: (a) `A-77` (who runs the filed-report check), `W-16` (watch upstream issue 289, never run), `W-3` (the erdosproblems.com/36 acknowledgement watch). (b) none. (c) none.
