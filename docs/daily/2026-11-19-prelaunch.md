---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-19
lifecycle_stage: launched
last_deploy: "f040ba3 (as of the P1 read on 2026-11-19, check-ci-status read reverify.yml and page-check.yml green on f040ba3; release: node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml, then --workflow page-check.yml; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: give a mistyped or dead link on the public site a page in the handbook look that points back to the index, instead of GitHub's 503 error page
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-19 (Thursday, MT)

## BLUF

A reader who follows a bad link to the site now gets a page in the site's own look with a link to the index. Before, the host showed its own error page, sometimes a 503 that reads as if the whole site were down, and neither of its pages linked back.

## What changed

- P1 chose the day's work: a `404.html` for the public site, `docs/SCREENS.md`'s "A missing address" NEXT row, pulled forward from its 2026-11-24 date under `A-110` (the design pass). The selection packet is in the State Appendix.
- **The missing-address page, shipped as `644b87c` and `99a9154`.**
  - `404.html` at the repository root: `docs/DESIGN.md`'s tokens and type, the index's dark values, absolute links to `/bounds-ledger/` and `/bounds-ledger/ramsey.html`, inline styles, noindex.
  - Review: read-only Codex round 1 on `644b87c` (banner workdir checked) returned FIX FIRST. The claim "Each constant has a page" was refuted as written, since the 72 Ramsey entries have no `c/` pages; it was narrowed to "each constant on the index" in `99a9154`. The masthead link's missing underline was fixed in the same commit. A request to add a sentence stating the consequence was declined as already said by the heading. Round 2 on `99a9154`: VERDICT: PUSH, no new finding.
  - Delivery: CI `reverify.yml` and `page-check.yml` green on `99a9154`; the Pages build row for `99a9154` was built (created 15:58:34Z). Signed-out GETs of `c/46.html`, `no-such-page` and `c/x/y.html`, twice each, returned HTTP 404 with 1,931 bytes carrying the page's title, both links home and the narrowed sentence (6 of 6); the index link target returned 200. At 390 and 360 px (playwright-cli, the live nested address) the page's scroll width equalled the viewport, the headline rendered in Palatino Linotype, and the masthead link was underlined.
- **The open pull request refresh, shipped as `019e0b7`** (standing, `A-96` option b): 100 open upstream (89 on 2026-11-11), 59 constant pages re-dated. Read-only Codex round on `019e0b7`: VERDICT: PUSH, no findings (all 120 pages match the list; no titles or author names). CI green on both workflows; Pages build row built 15:48:58Z; the live `c/46a.html` carries `data-read-at="2026-11-19T15:38:08Z"`.
- Choice changed by a read: the lead candidate was `A-110` item 4 ("date unknown" must look different from "no movement seen yet"). A count over `index.html` and `c/*.html` found "date unknown" on 0 pages; the positive control, same glob, found "no movement seen yet" 809 times across 110 files. Item 4 guards a state no reader sees today, so it stays on `A-110` for 2026-11-24 and is not today's user-visible change.

## Inputs (controllable)

- Section 0 reads (State Appendix), `npm run traffic`, the repository's popular paths, and two signed-out GETs of bad addresses on the live site.

<!-- findings:begin -->
- A bad address on the public site returns HTTP 503 with GitHub's "Unicorn!" page (54,887 bytes, the same both times), for `c/46.html` and for `no-such-page`. A real page, `c/46a.html`, returned 200 in the same minute, so the site was up. Record-facing or instrument-facing: neither; this is a defect in the reader's path, found by a probe, not by a reader.
- Correction from the manager's P1 review, measured: the host flips between two pages for a missing path. At 15:39Z the manager got GitHub's plain 404 "Page not found" for two paths and the 503 "Unicorn!" for `/a/b/c`. So the acceptance read asked for this page's title and link, never only "not Unicorn". After the build, 6 of 6 fetches returned this page; 0 returned "Unicorn!".
<!-- findings:end -->

## Outputs (lagging)

- Readers of the public pages are not measured (no analytics; `A-59`, encounter blind). Repository traffic, 14-day window: 3 unique repository viewers, 214 unique cloners (unattributed); popular paths list 3 blob views, none of them the README.

## Recommendation

- [A — today's outcome] Ship `404.html` in the handbook look with one link to the index: claims pass on every sentence first (a new page), a cross-family review, CI green, then a signed-out GET of two bad addresses showing the new page.
- [B — standing, runs regardless] The open pull request refresh missed on 11-18 (`docs/daily-config.md`, `A-96`'s option b): its own commit and its own read-only Codex round before its push.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-18.md` (no 2026-11-19 file; written-date convention). `git pull --ff-only`: "Already up to date." HEAD `f040ba3`.
- Listener: SSE alive, `hello` 2026-11-19T15:28:27.942Z, 0 replayed; waker ranks 1-3 armed; `/loop-tick 2m` armed by tool call.
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (machine-level exec and write proved 2026-11-19T15:27:26Z).
- CI at HEAD `f040ba3`: `reverify.yml` GREEN, `page-check.yml` GREEN (`check-ci-status`, exit 0 each). No local full verify owed.
- Deploy drift: `check-deployed-sha-drift` exit 0 over 38 Render services; this lane is GitHub Pages with no Render service, so NOTHING SWEPT for it, neither a stop nor a pass.
- Harness: running 2.1.328 · fleet UNIFORM (26 of 27 panes read) · installed 2.1.328 (SAME). The checker exits 3 because the tracked record (2.1.277, 2026-09-18) is old; not a stop.
- Recommendations yesterday (`docs/daily/2026-11-18-prelaunch.md`): A executed (`ed04369`, `1ce1f14`); B executed (`d520182`, `8f97b41`); C (the 3b DOI correction) carrying, outward and gated on adversarial review and David's word; not today's work.
- Due gates: `check-due-gates-dispositioned --snapshot` printed "snapshot written — 7 gate(s) due on/before 2026-11-19".
- Board: `answered-cards` printed "0 bounds-ledger card(s) + 6 portfolio-wide rider(s); 0 NEW since last read".
- Rotation: `check-cycle-rotation` printed "no product-love cycle picks this lane today", exit 0.

### P1 selection packet

- **Outcome:** a reader with a bad link lands on a page that says the address does not exist and links to the index. Item: `A-110` (the design pass), its `docs/SCREENS.md` row "A missing address".
- **The user problem, in the user's words:** the evangelism bar's reader is about to cite a number and is checking it; a dead link that shows "Unicorn!" and a 503 tells them the site is broken, so they leave before the index can answer them ("The coverage threat": a visit that dead-ends).
- **Evidence:**
  - OBSERVED · two signed-out GETs of bad addresses (`/bounds-ledger/c/46.html`, `/bounds-ledger/no-such-page`) · our own probe, not a reader · 2026-11-19 at P1 · limits: two paths, one minute; whether GitHub serves 503 or 404 for a missing path may vary by time, and the repository has no `404.html` (`docs/SCREENS.md`).
  - OBSERVED · positive control · `c/46a.html` returned 200 (17,191 bytes) in the same minute.
  - HYPOTHESIS · GitHub Pages serves a repository's root `404.html` for missing paths under a project site, with status 404. The acceptance read below tests it.
  - MISSING · how many readers hit a bad address. The published pages have no analytics (`A-59`), and GitHub traffic counts the repository, not the Pages site.
- **Permission:** `docs/SCREENS.md` lists the row as NEXT; David's chat line on 11-18 asked to stay on track with the design and copy updates; `A-110` is monitoring and its notes list this item. A new public page is a publication, so it passes the outward gate's adversarial review (`AGENTS.md`) as a claims pass plus a cross-family review. Nothing here needs David's word: no new claim about a record, no outreach.
- **Next action:** improve. First command:

```bash
node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --check
```

  (read how the index's stylesheet is built so the 404 takes the same tokens, then draft `404.html` with absolute links under `/bounds-ledger/`, since a missing path can be nested like `c/…`).
- **Acceptance condition:** after the Pages build of the commit, a signed-out GET of `/bounds-ledger/c/46.html` and of `/bounds-ledger/no-such-page` each returns the new page (its title and the link to `/bounds-ledger/`), not the "Unicorn!" page; the status code is recorded as returned.
- **Delivery and encounter checks:** delivery: the Pages builds API row for the commit, then the two GETs above. Encounter: blind (`A-59`); the event that would show a reader used it is none we can see, so this is reported as unmeasured.
- **USER-FACING: yes.** Paths: `404.html` (new), `docs/SCREENS.md`, `continuity/items.json`; possibly a renderer under `scripts/` if the page is generated rather than hand-written, decided at P3.
- **HYGIENE INPUTS**
  - (a) due rows not bearing on the choice, 7 of 7: `A-2`, `A-47`, `A-77`, `A-92` (waived), `G-2`, `W-16` (the watch on upstream issue 289), `W-3` (the watch for acknowledgement of the erdosproblems.com/36 correction).
  - (b) owed child rows in the orchestrator's ledger: none, read "0 of 850 considered".
  - (c) state reads past their threshold: dated gates due 7 (7 unread of 7); board cards carrying David's word 7 (all skylark-site riders, 0 new); key numbers: no list yet (`docs/key-metrics.json` absent); stale-actionable 1 of 32.

### Close

- ACTION: COMPLETED · item `A-110` · P3 `051ffa17`. The acceptance in force (the manager's P1 review: at least three bad addresses, one nested two deep, each fetched twice, returning this page's title and a working link to `/bounds-ledger/`) was met: 6 of 6 of our fetches, 8 of 8 of the manager's (review `13dd35f4`).
- Changed since the P3 post: none for users. The doc commits `891e21e` (`docs/SCREENS.md`, this report) and `4616712` (traffic sample) ride the close push; `docs/SCREENS.md` counts as DONE 9 / NEXT 1 / HOLD 4 / not a screen 2 / UNREACHED 0 once that push is on main. The row moved today: the missing-address page, NEXT to DONE.
- Hygiene draft (`tmp/hygiene-draft-bounds-ledger-2026-11-19.md`): 7 lines — 5 accepted (`A-2`, `A-47`, `A-77` re-dated to 2026-11-26; `W-3` (the watch for acknowledgement of the erdosproblems.com/36 correction) to 2026-12-03; `A-92` held to 2026-12-17) · 1 amended (`G-2` (the lane's own record-search goal): option A, the park-or-keep question went to David as decision msg `3e38e944`, board card `0c232c6c`, and the row is held to 2026-12-19) · 1 rejected (`G-2`'s park line, superseded by option A). READ-MUTATED: none (5 reads guarded). Checks: wait-justification "RESULT: PASS — 2 of 133 row(s) carry `waitJustification`; 0 warn / 0 info" (not David's words); engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable" (not David's words).
- Not drafted: `W-16` (the watch on upstream issue 289) is UNREAD today. The classifier refused the helper's `--run W-16` twice; not rerouted. Re-dated to 2026-11-26 with that recorded on the row.
- `A-110`: note appended (item 2 done; items 1, 3, 4, 5 dated 2026-11-24). Status stays monitoring.
- positive control: "no movement seen yet" returned 809 hits across 110 files over the same `index.html` and `c/*.html` glob that returned 0 for "date unknown"; the real page `c/46a.html` returned 200 in the same minute the bad addresses failed; "Each constant on the index has" returned `404.html:1` over the same glob as the 0-hit sibling sweep; the hygiene helper's W-3 read printed both advisory lines, and `check-engineering-zero` and the round-1 Codex review on `644b87c` each returned findings on other inputs (frolic's Sentry issue; the refuted sentence), so neither is a dead instrument.
- `A-47` (the depth audit): the audited count is 111, unchanged since 2026-11-12. Its closeWhen calls that the finding; the next slice is owed by 2026-11-26.
- Due-gate verification: `check-due-gates-dispositioned` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." against the snapshot "CURRENT (taken 2026-11-19)".
- Heavy-gate waits: none. No local verify was queued; CI was green at every pushed sha.
- What cost the most time: the two read-only Codex rounds on the 404 page, which was worth it, because round 1 refuted the one sentence that said more than its source.
- Pending reads: `A-108` 2026-11-23; `A-110` and `A-109` 2026-11-24; `W-16`, `A-2`, `A-47`, `A-77` 2026-11-26; `W-3` 2026-12-03; `A-92` hold to 2026-12-17; `G-2` hold to 2026-12-19 (David's card).
