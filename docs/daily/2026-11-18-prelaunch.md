---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-18
lifecycle_stage: launched
last_deploy: "8f97b41 (as of about 18:20Z on 2026-11-18, check-ci-status read reverify.yml and page-check.yml green on 8f97b41, Pages build row built 18:11:29Z; release: node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml, then --workflow page-check.yml; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: carry the handbook look from the index to the 120 constant pages and the two Ramsey pages, with no wording change
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-18 (Wednesday, MT)

## BLUF

Readers now see the handbook look past the front page. All 120 constant pages, the Small Ramsey Numbers page and its disclosure page have it, and not one sentence on them changed.

## What changed

- P1 chose the day's work: carry the design system to the constant pages (`c/<id>.html`, 120 pages), the first NEXT row in `docs/SCREENS.md`, pulled forward from its 2026-11-24 date. The selection packet is in the State Appendix.
- **Constant pages, shipped as `ed04369` and `1ce1f14`.**
  - The stylesheet in `scripts/render-constant-pages.mjs` moved onto `docs/DESIGN.md`'s tokens and type, and the 120 pages were re-rendered from it.
  - No sentence changed. The visible text of every page (tags, style and script stripped) was diffed before and after: "pages compared: 120 · differing visible text: 0". Red-armed: one mutated word on 8a printed "differing visible text: 1", exit 1.
  - The field labels were read in source, as the manager's review asked. All eleven are already written in sentence case, so dropping the uppercase transform shows them as written.
  - A read-only Codex round on `ed04369` (banner workdir checked) reproduced zero changed lines outside the stylesheet. It returned three LOW findings and "VERDICT: FIX FIRST":
    - Spacing off the scale: fixed in `1ce1f14`.
    - Bound values still in monospace: deliberate. That is the earlier state, and the live index does the same.
    - "date unknown" looks like "no movement seen yet": carried on `A-110`. 0 of 120 pages show it, and telling them apart needs a markup class.
  - Delivery:
    - CI `reverify.yml` and `page-check.yml` green on `1ce1f14`.
    - The Pages build row was built at 17:36:22Z.
    - `npm run served` printed "120 checked — 120 served, 0 in flight, 0 stale, 0 unreachable".
    - A signed-out GET of `c/1a.html`, `c/8a.html` and `c/1d.html` returned 200, each carrying `--paper:#fbfcfe` and the Palatino stack, and neither the old `--ink:#111` nor `text-transform:uppercase`.
- **`ramsey.html` and `copying.html`, shipped as `d520182` and `8f97b41`** (the stretch batch, with its own review).
  - Both pages share one stylesheet, `STYLE` in `scripts/render-ramsey-vocabulary.mjs`, which got the same treatment.
  - Visible text diffed: 0 of 2 pages differ. Every changed line is inside the stylesheet. `--selftest` exit 0 and `--check` PASS.
  - A read-only Codex round on `d520182` (banner workdir checked) verified both pages byte for byte outside the stylesheet. It returned one MEDIUM and two LOW findings:
    - The disclosure text was at 14px: fixed to 16px in `8f97b41`.
    - Only Table Ia's value got the serif: fixed in `8f97b41`, both tables' values now share one face.
    - Entry permalinks have no underline at rest: deliberate. That is the earlier state, and it matches the index.
  - Delivery:
    - CI green on `8f97b41` for both workflows.
    - The Pages build row was built at 18:11:29Z.
    - `npm run served` printed "2 checked — 2 served".
    - A signed-out GET of both pages returned 200 with `--paper:#fbfcfe`, the Palatino stack and the 16px note.
- `docs/SCREENS.md` now reads DONE 8, NEXT 2 (the 404 page and `README.md`, both dated 2026-11-24), HOLD 4.
- An untracked partial capture under `continuity/read-outputs/` was discarded, not committed. It was the capture of a `W-4` (prove every new detector both ways) read that was killed at its 300 s cap on 2026-11-17, and its header says the bytes are not a reading. The same row was re-read at that day's close (exit 0) and re-dated to 2026-11-24.

## Inputs (controllable)

- Section 0 reads, `A-59` (encounter is blind on the public pages) run through the due-gate runner, and a read of the constant-page renderer's stylesheet and template.

<!-- findings:begin -->
- The day's findings are recorded under the State Appendix's Close. The overnight review's second defect (the "Other tracked files" row of `docs/SCREENS.md` omits `search/**`) is already fixed at HEAD, since that row names `search/**`, so it is not carried.
<!-- findings:end -->

## Outputs (lagging)

- Outside arrivals: `npm run reports` printed "raw issues fetched: 37", "OUTSIDE ARRIVALS: 0", "parts reconcile: 37 + 0 + 0 = 37", exit 0. Readers of the public pages are not measured (no analytics; `A-59`).

## Recommendation

- [A — today's outcome] Ship the handbook stylesheet on the 120 constant pages through the brief's gates: a visible-text diff showing no sentence changed, a cross-family review, CI green, and a signed-out GET of live pages.
- [B — stretch, same day] If A is live with time left, give `ramsey.html` and `copying.html` the same tokens, as a second batch with its own review.
- [C — carried, outward, gated] The 3b DOI correction from 2026-11-12 is still unsent: adversarial review and David's word first.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-18.md`. Its banner governs: the handbook first screen is live; `A-110` (the design pass) is monitoring with two reads owed 2026-11-24. `git pull --ff-only` printed "Already up to date."; commits after the primer's anchor `db4ac84`: `0f25337`, `4d6748d` (the round-3 close and the primer).
- Listener: 🟢 SSE alive + loop armed by tool call. `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0 (session start 16:00:49Z; last hello 16:28:58Z). Waker ladder ranks 1 to 3 launched at about 16:01Z.
- Codex: GREEN per the kickoff's probe line (04:40:50Z, execute and write proved).
- CI: `check-ci-status.mjs --workflow reverify.yml` and `--workflow page-check.yml` each "GREEN — 1 completed non-scheduled success(es) for HEAD" at `4d6748d`, exit 0. No local full run of the battery: CI is cited at HEAD.
- Deployed-sha drift: NOTHING SWEPT for this lane; it publishes through GitHub Pages and declares no Render service. The fleet read printed "RESULT: PASS — 0 finding(s) across 38 service(s)", none of them this lane's.
- Harness: running 2.1.327 · fleet UNIFORM · installed 2.1.327 (SAME).
- Board: `answered-cards.mjs --project bounds-ledger` printed "0 bounds-ledger card(s) + 8 portfolio-wide rider(s); 0 NEW". The eight are skylark-site cards about the portfolio site; none asks anything of this lane.
- Yesterday's recommendations (`docs/daily/2026-11-17-prelaunch.md`): [A] read the 9 candidates on the newer-papers line: carrying, not today's choice (David's direction today is the screens). [B] `A-108` (the narrower feed), due 2026-11-23: carrying. [C] the 3b DOI correction: carrying, outward and gated.
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` "no product-love cycle picks this lane today", exit 0.

### P1 selection packet

- **Outcome:** the 120 constant pages read as pages of the same handbook as the index. Item: `A-110` (the design pass), its `docs/SCREENS.md` NEXT row for `c/<id>.html`.
- **User problem, in the user's words** (`docs/evangelism-bar.md`): "is the number I already have still true?" A reader following a citation lands on a constant page, not the index. Each generated citation carries its constant page's address. Today that page is in the old look, so the handbook look ends one click in.
- **Evidence:**
  - OBSERVED · David's pick · the blind review page, 23 pairs, read back 21:21 MT 2026-11-17 (redesign 23, current 0, neither 0), per `skylark-site/docs/specs/design-rollout-brief-2026-11-17.md` · it covers the index first screen, not the constant pages.
  - OBSERVED · David's direction today, in chat at 08:52 MT as relayed by the kickoff, paraphrased: open every lane's window for today's run and keep carrying the new look through the screens not yet updated.
  - OBSERVED · `npm run reports` · all 37 issues on the repository since the public flip (102 days) · read 2026-11-18 · 0 outside arrivals; it counts filed issues only, never readers.
  - HYPOTHESIS · the constant pages are the most-seen NEXT screen · basis: every citation and the sitemap point to them · MISSING: any per-page reader count (no analytics, `A-59`; `W-19` (the second Search Console read) is UNREAD).
- **Permission:** `A-110` is monitoring, not parked or frozen, and no card is open on it. The NEXT rows' dates are this lane's own scheduling. The kickoff says pulling them forward is the lane's call at P1. Class: ship obvious first-order improvements under authority, from David's pick and today's direction. The outward gate still binds, because every push publishes. That means a cross-family adversarial review before the push.
- **Next action (improve):** move the constant-page stylesheet (`STYLE` in `scripts/render-constant-pages.mjs`) onto `docs/DESIGN.md`'s tokens and type, in the template. The changes are the cool tinted neutrals, the book serif for the headline, ink-and-underline links, sentence-case field labels in place of uppercase tracked ones, and a 2px radius. No markup or sentence changes, the page still loads nothing (its self-test refuses `url(` and `@import`), then re-render the 120 pages. First command:

  ```
  node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --check
  ```

- **Acceptance:** (1) the visible text of all 120 pages is identical before and after (tags and the style block stripped, diffed page by page: 0 of 120 differ); (2) `render-constant-pages.mjs --selftest` and `--check` pass; (3) a cross-family review of the diff, each finding dispositioned; (4) CI `reverify.yml` and `page-check.yml` green at the ship commit; (5) after its Pages build, `npm run served` reports all 120 served, and a signed-out GET of `c/1a.html` and `c/8a.html` returns the new stylesheet (it carries `#fbfcfe` and the Palatino stack). Goal at the close: 1 NEXT row DONE and confirmed live (the constant pages); 3 if the stretch batch lands (`ramsey.html`, `copying.html`). The 404 page and `README.md` stay dated 2026-11-24.
- **Delivery and encounter:** delivery by `npm run served` and the live GETs above, at the ship. The only encounter the page can show is an issue filed through a constant page's "looks wrong?" link, which `npm run reports` counts as an outside arrival. It is readable at N = 1 against a baseline of 0 of 37. The arrival counter reads the issue title's prefix, and this change leaves that title unchanged (`A-109`).
- **Prior-day retro finding that bears on this:** "list every string that reaches the output before the design" recurred on 11-16 and 11-17. A styling-only change sidesteps it by changing no string, and acceptance (1) proves that across all 120 pages rather than asserting it.
- **USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs`, `c/*.html` (120), `docs/SCREENS.md`; stretch: `scripts/render-ramsey.mjs`, `ramsey.html`, `copying.html`.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 4: `A-70` (the 44px touch targets; its read is `A-59`'s), `A-89` (the decimal-vs-exact census), `W-14` (upstream issue 218, read only), `W-19` (the second Search Console read; the agent reader is not registered for this lane, so UNREAD, never 0). `A-59` bears on the choice and was read above. Its no-arrival disposition (re-date, naming the reads) is applied at the close.
  - (b) owed child rows: none. Read: rows owed in skylark-site's ledger, "0 of 850 owner-stamped row(s)".
  - (c) state reads past threshold: dated gates due today, 5 of 5 unread at compose (now 1 read, `A-59`); board cards carrying David's word, 7, of which none governs this lane; key numbers, "no list yet": this lane has no `docs/key-metrics.json`; today's report, PENDING (owed at the close).

### Close

ACTION: COMPLETED · item `A-110` (the design pass) · P3 `06d30c18`. The acceptance condition was met, and the manager's review read COMPLETED with no defects. It ran its own signed-out GET of all 122 pages, byte-identical to `origin/main` at `8f97b41`. Its own visible-text diff against the pre-change versions found 0 of 122 differing.

- **Since the P3 post:** nothing shipped. `docs/SCREENS.md` gained the UNREACHED count. It reads DONE 8, NEXT 2, HOLD 4, not a screen 2, UNREACHED 0, 16 rows. Moved today, NEXT to DONE: the constant pages, `ramsey.html` and `copying.html`.
- **Hygiene draft:** 5 lines (3 accepted, 2 amended, 0 rejected).
  - `A-59` (encounter is blind on the public pages), `A-70` (the 44px touch targets) and `W-14` (upstream issue 218, read only) were accepted, each re-dated to 2026-11-25.
  - `A-89` (the decimal-vs-exact census) was amended to 2026-11-25 instead of 2026-12-02. Only the census re-ran ("RESULT: CUT — 3 member(s)"), not the six-shape check, so the two-week zero-hit interval is not earned.
  - `W-19` (the second Search Console read) was amended. It is re-dated to 2026-11-25, and the registration ask goes to the orchestrator in the close post instead of a card for David. `agent-status` refused `--relay-to skylark-site` as "not a roster lane" (not David's words). The agent-side Search Console reader still returned HTTP 400, so the read is UNREAD, not 0.
  - Its one READ-MUTATED line was my own edit of `scripts/render-constant-pages.mjs`. Its checks: wait-justification "RESULT: PASS — 2 of 133 row(s) carry `waitJustification`; 0 warn / 0 info" and engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings".
- **Due-gate verify:** `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned" against "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-11-18)".
- **Ledger delta:** five re-dates (above), each with a dated note. `A-110` gained two notes: today's ship and its proof, and every item it still owes, each dated 2026-11-24.
  - the real-Android serif frame;
  - a `404.html`;
  - `README.md` voice;
  - the "date unknown" markup class;
  - a second cross-family read of the fix commits `1ce1f14` and `8f97b41`.
- **Missed today:** the daily open pull request refresh that `docs/daily-config.md` lists (`open-pulls.mjs --fetch` and a re-render; `A-96`) did not run. The lists were last read on 2026-11-17, and a page calls its list out of date only after seven days. It is tomorrow's first action, with its own Codex round before the push.
- **Heavy jobs:** none went through the heavy-gate queue. Every render, self-test and `--check` ran directly, one at a time, so there were no queue waits. What cost the most time: on a busy machine, `render-constant-pages.mjs --check` and the two renderers' self-tests each ran past the 300 s tool cap. Three of them had to be moved to the background and waited on, about 25 minutes in all.
- **Pending reads:**
  - `A-59` (outside arrivals): `npm run reports`, 2026-11-25.
  - `A-110`: 2026-11-24, the items above.
  - `W-19`: 2026-11-25, waiting on the registration.
- positive control: the text diff behind every "0 differ" figure today printed "differing visible text: 1" and "DIFF 8a.html" when one word on 8a was changed, so it can see a difference.
- positive control: the fleet drift read behind "0 finding(s) across 38 service(s)" named each of those services with its state (for example "buddha-ur-web doc-only-drift"), so it was reading Render.
- positive control: the engineering-zero run behind "0 findings" for this lane named one unresolved Sentry issue in another lane (agentic-dir), so it reads Sentry.
- **Receipt:** P3's receipt line still holds. Exposure stays blind (`A-59`), and no outcome read exists.
- Classification (one sentence of judgment): today's work found two defects in my own stylesheets (spacing off the scale; a disclosure note below body size) and one carried rendering gap, all instrument-facing, so the streak of consecutive instrument-facing days continues; `npm run catches` was not run. The standing prediction stands, unchecked today: the next record-facing catch will be a citation-quality defect found by a human reading a cited source in the depth audit (`A-47`).
