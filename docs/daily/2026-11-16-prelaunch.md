---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-16
lifecycle_stage: launched
last_deploy: "079f2d0 (as of about 15:38Z on 2026-11-16, check-ci-status read reverify.yml and page-check.yml green on 079f2d0; release: node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml, then --workflow page-check.yml; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: give each constant page a feed a reader can subscribe to, so a moved number reaches them instead of waiting for a revisit
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-16 (Monday, MT)

## BLUF

Readers see one change today: the open pull request lists on 59 constant pages were refreshed, and the 1d page now lists a pull request opened yesterday.

The planned change, a feed per constant page that tells a subscriber when a pinned bound changes, did not ship: three review rounds each found a way for upstream's own text to reach the feed, and the rule set for this change ended the day at the third. Nothing of it was published.

## What changed

- P1 chose the day's work: `A-106` (a constant page cannot tell a reader that its number moved), minted this morning. The selection packet is in the State Appendix.
- Morning refresh of the open pull request lists: `open-pulls.mjs --fetch` read 97 open upstream at about 15:39Z (96 yesterday). The render changed the 59 constant pages that show a list, one line each (the read date; 1d also gains pull request 372). Committed alone as `0e8f6ff` after a read-only Codex round (banner workdir checked) that returned "SHIP — 0 defects", every commit-message sentence HOLDS or UNVERIFIABLE-HERE, none refuted. Pushed by sha; CI `reverify.yml` and `page-check.yml` green on `0e8f6ff`; Pages build row built 15:53:39Z to 15:54:04Z; a live fetch of `c/1d.html` returned 200 with pull request 372 and the 2026-11-16 read date.
- **`A-106` (a per-constant change feed) did not ship.** P1 chose it and the manager approved it. Three designs went through three read-only Codex rounds; each round found a route by which upstream-controlled text could reach a feed. Round 3 found it a third time, and the orchestrator's answer to my consult (`bus eefb4ab0`) had set that as the stop: no patch, no push. Main stayed at `0e8f6ff`. The last version (`4417f1f`) is on the local branch `a106-feed-draft`; the earlier two were amended away. Details under Inputs.
- `A-107` (bring a constant's name into its feed through a reviewed title table) was minted on the orchestrator's instruction, before round 3. With `A-106` stopped it has nothing to attach to; its disposition goes to the close.

## Inputs (controllable)

- Section 0 reads, the morning block, a label census of the live index, a read of the renderers for any existing feed, and the `A-106` mint.

<!-- findings:begin -->
- **My P1 design broke a rule this repo already held.** The packet planned each feed entry as the pinned row "before and after"; `scripts/render-constant-pages.mjs`'s own header refuses a former value beside a current one (Brun's constant, 2026-09-01), and the manager's review flagged the same. I dropped the "before" row before the first review, which was not enough: see round 1.
- **Round 1 on `214aba7` (DO NOT SHIP, 7 defects, class verdict YES).** Entries quoted the row pinned that day, so upstream's comment "First improvement on [GHR2007]'s $4/3$" (3a) reached a feed, and a feed with several entries for one side listed former and current values together (47a: 3.879 and 4). Also: wording that claimed a different row became last (false for an in-place edit), lone surrogates passing the escaper, a path-limited log over merges, same-day entries oldest first, an "each time" promise, and two false sentences in my own commit message (the carriage-return count; "parses no row"). Fixed by shape: entries carry no row and no value.
- **Round 2 on `664202c` (DO NOT SHIP, 3 defects, class verdict YES again).** A constant's title passed `plainTitle()` unchanged, so a constructed title such as "A bound improved from 4 to 3 (new record)" would have reached the feed. Same class twice, so I consulted (`bus e26365dd`) instead of patching; the answer ruled the title out and an allowlist test in.
- **Round 3 on `4417f1f` (DO NOT SHIP, 2 defects, class verdict YES a third time).** The constant id is the stem of upstream's file name, taken unchecked (`scripts/extract-pins.mjs:130`), so a file named with that same sentence would have put it into both feeds; Codex reproduced it in memory through the real `buildRows`, `pinEvents`, `feedXml` and `allFeedXml`. Today's 120 ids are all well-formed, so no live feed would have carried upstream text; the acceptance promised it for any input. The allowlist test I built checked the skeleton of feeds made from valid fixture ids, so it could not see this route: it proved the template, not the input boundary.
- What held across all three rounds: 32 first-parent versions, 73 events (65 value, 8 bound cell) on 51 constants; 57 of 57 moved page labels agreed with the newest event; all 121 files parsed. The history walk and the counts were right; what kept failing was what the feed could be made to say.
- Classification (one sentence of judgment, never a counter): today's findings concern our own renderer, my own P1 design and my commit messages, so all are instrument-facing and none is record-facing; `npm run catches` was not run.
<!-- findings:end -->

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). `npm run traffic` read 5 unique repo viewers and 267 unique cloners in the latest 14-day window (repo views, not page readers). `npm run reports` (the hygiene helper's `G-4` read) read 0 outside arrivals of 37 raw issues, parts reconciling 37 + 0 + 0 = 37.

## Recommendation

- [A — carried, first thing] Run the two arXiv searches that slipped, both dated 2026-11-17 and one reader batch: `A-81` (the Ramsey-area watcher, last run 11-02) and `W-17` (the newer-papers line on every constant page, whose store has said "checked through 2026-10-31" for 16 days). The public line states its window, so it is not false, but its weekly cadence has slipped three reads running.
- [B — user-visible, not before asking] `A-108`, the narrower feed, dated 2026-11-23. Ask the orchestrator first whether the id refusal belongs in `scripts/extract-pins.mjs` as well as the renderer: the id is born there, and refusing it at birth claims less than refusing it at render.
- [C — outward, gated, carried] The 3b DOI correction from 11-12 is still unsent: adversarial review and David's word first.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-15.md` (no `2026-11-16.md` exists; primers are named for the day written). Its banner governs: morning block, then the reads dated today (`A-78` (OpenAI's math release mapped onto watched constants), `A-81` (newer-result watcher for the Ramsey area), `G-4` (an outside party acts on a watched record), `W-17` (the newer-papers line on every constant page)). `git pull --ff-only` printed "Already up to date."; `git rev-list --count origin/main...HEAD` printed 0.
- Listener: `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0 (session start 15:17:42Z, relaunched by the session-start hook). Loop-tick armed by tool call; waker ladder ranks 1 to 3 launched at about 15:19Z.
- Codex: GREEN per the kickoff's probe line (15:21:06Z, execute and write proved).
- CI, as of about 15:38Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each "1 completed non-scheduled success(es) for HEAD" at `079f2d0`. No local full run of the battery: CI is cited at HEAD.
- Deployed-sha drift: NOTHING SWEPT for this lane; it publishes through GitHub Pages and declares no Render service.
- Board: `update-david-board.mjs --list` returned 0 cards for this lane (positive control: `answered-cards.mjs` the same morning returned 4 portfolio riders from the same board). The 4 riders (`2cf09a9d` draw page, `3784317b` skylark-site leftover work, `dd410b2a` screenshot piles, `2516f28c` refactor-night commands), 0 new; none asks anything of this lane today.
- Yesterday's recommendations (`docs/daily/2026-11-15-prelaunch.md`): [A] leave the bound display as it is: held, `A-105` stays closed and today's change does not touch the bound display. [B] `A-47` (the depth audit) slice 25 on 11-19: carrying, not due. [C] the 3b DOI correction: carrying, outward and gated on adversarial review and David's word; not today's choice.
- Morning block reads: `npm run upstream` "0 transition(s) across 3 recorded report(s)"; `npm run traffic` as above; `open-pulls.mjs --fetch` 97 open; `render-constant-pages.mjs` wrote 120 pages, 59 changed in content (git status listed all 120 as modified; the commit holds 59); `render-constant-pages.mjs --check` "RESULT: PASS — 120 constant page(s) match committed state (@ 87b4ebb)", exit 0 (it compares the working tree; `87b4ebb` is an upstream sha, it does not exist in this repo). <!-- pragma: allowlist sha (an upstream sha) -->
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` "no product-love cycle picks this lane today", exit 0.
- The night helper's uncommitted `docs/evangelism-bar.md` (a cold audit, 11-15 evening): its two load-bearing claims verified before building on them (no renderer writes a feed; the label census below). Its PROPOSAL block, a refreshed moment section, is David's taste call and is not adopted here. The file is committed with today's close.

### P1 selection packet

- **Outcome:** `A-106`, a constant page that can tell its reader when its number moves. A reader who cited a constant subscribes to that constant's feed and is told, in their own feed reader, the day the pinned row changes.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a bound and a referee told me it had been improved. I had no way to know." The bar's own friend sentence is "a thing that watches the bounds page and **tells you** when a number you cited moved". On the bar's loop archetype (weeks to months between visits), the page tells nobody: 50 rows say `value changed`, 35 of those dated in October, and each was announced only to someone who happened to come back.
- **Evidence:**
  - OBSERVED · `scripts/render-site.mjs`, `scripts/render-constant-pages.mjs`, `scripts/lookup.mjs`, grep for `atom|application/rss|feed` · this morning · no feed is written anywhere (the only hits are code comments using "feeds" as a verb). There is no way to be told; only a revisit shows a change.
  - OBSERVED · `index.html` at `079f2d0`, counted by PowerShell regex this morning · 120 rows; 525 `tracked since … no movement seen yet`, 150 `value changed`, 24 `text edited`, 21 `bound cell edited`, each label printed three times per row, so 175 / 50 / 8 / 7 labels over 240 sides. This matches the night helper's census exactly.
  - OBSERVED · `git rev-list --count HEAD -- ledger/claims.json` printed 32 · a constant's whole change history is derivable from 32 committed versions, the same way `changeFor()` (`scripts/lookup.mjs:186`) already derives the last change.
  - HYPOTHESIS · that a researcher who is about to cite a constant would subscribe to its feed. Judgment, not a measurement.
  - MISSING · any real reader's account. There is no `docs/evangelism-evidence.md`, and the page has no analytics (`A-59`).
- **Permission:** `A-106` is a lane row (minted today, open, owner bounds-ledger, no park, no card). A new output of our own page renderer, inside the lane's authority (the copy button on 10-04 and `ramsey.html` on 09-17 were the same class). Public, so the outward gate applies: a cross-family (Codex) code round and a claims pass on the feed's words before push. No freeze covers `c/` (the 2026-09-20 freeze names `ramsey.html` and `copying.html`). It does not touch the bound display, so `A-105`'s stop holds.
- **Next action:** improve. In `render-constant-pages.mjs`, write `c/<id>.xml` (Atom) beside each `c/<id>.html`: one entry per observed `value` or `expression` change of either side's pin across committed history of `ledger/claims.json`, each entry carrying the whole pinned row before and after as escaped text, never a parsed cell (the `A-105` lesson: no splitting a row on pipes), plus the existing last-listed-row caveat. Each constant page gets `<link rel="alternate" type="application/atom+xml">` in its head and a visible "watch this constant" link. The cite block's copied text is not changed. `--check` compares the feeds as well as the pages. Selftests run on fixture histories, not git: the CI `check` job's checkout is shallow (`reverify.yml:48`, depth 1). Write the failing selftest first. First command:

  ```
  node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --selftest
  ```

- **Acceptance condition:** after the Pages build, `https://u00dxk2.github.io/bounds-ledger/c/5a.xml` returns 200 and parses as XML with an Atom `feed` root; its entry count equals the count derived from committed history for 5a (5a's upper pin moved 0.97633 → 0.94304 on 2026-10-28, so at least that entry is present with both rows); a constant with no observed change (a `tracked since` on both sides) has a valid feed with zero entries; each of the 120 pages links its own feed; `render-constant-pages --check` matches after the commit, and a red-arm (an entry dropped, or an unescaped `<` in a row) turns the selftest red.
- **Delivery and encounter checks:** delivery is the Pages build row for the pushed sha, a live fetch of `c/5a.xml` and one zero-entry feed, and a Playwright read of `c/5a.html` at 390x844 showing the watch link. Encounter is blind: feed subscriptions cannot be counted here (`A-59`; GitHub Pages hands us no request log). The arrival that can show up is an outside issue started through a page's "looks wrong?" link, counted by `npm run reports`, readable at N = 1, read on 11-21 beside `A-103` and `A-104`.
- **USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs` (feed writer, head link, watch link, selftest, `--check`), possibly `scripts/lookup.mjs` (a history walk beside `changeFor()`), `c/*.html` (regenerated), `c/*.xml` (120 new files), `sitemap.xml` if the renderer lists the feeds, `continuity/items.json` (`A-106`). Not `index.html`.
- **Standing obligation beside it, not the choice:** the morning open pull request refresh (97 open; 120 pages showed as modified, 59 changed in content, one line each, corrected at commit). Its own commit on top of `origin/main`, a read-only Codex round, and a push by its own sha, before any `A-106` commit.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: 4 of 4 due. `A-78` (OpenAI's math release mapped onto watched constants, expectedSignalBy 2026-11-16), `A-81` (newer-result watcher for the Ramsey area, nextCheckDate 2026-11-16), `G-4` (an outside party acts on a watched record, expectedSignalBy 2026-11-16), `W-17` (the newer-papers line on every constant page, expectedSignalBy 2026-11-16). Read: `check-due-gates-dispositioned.mjs --snapshot`, "4 gate(s) due on/before 2026-11-16".
  - (b) owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger" (0 of 823).
  - (c) state reads marked CROSSED: none. Read: the kickoff's state reads (stale-actionable 1 of 29 with no threshold clause; missingLinkedCommits NOTHING SWEPT, 0 of 0).
- **Key number:** of the 120 constant pages, how many offer a way to be told that their number moved: 0 of 120 today, read from the renderers' code this round. Target 120 of 120, each feed's entry count equal to the history-derived count. It measures what the page offers, not whether anyone subscribes. This lane has no `docs/key-metrics.json`, so no hub number applies.
- **A prior-day retro finding that bears on the choice:** 11-15 Q2, "before writing rowCells I should have handed a read-only helper the 240 pinned cells and asked for every cell shape a three-way split or a first-cell value could misread." The feed shows whole pinned rows and parses none of them, and before writing the escaper I hand a read-only helper the 32 historical versions' pinned strings to list every character a feed entry must escape.

### Close

ACTION: DEFERRED — stopped by the stop rule at Codex round 3 (the same class a third time: upstream-controlled text could reach a feed) · trigger 2026-11-23, `A-108` (the narrower successor) · item A-106 · P3 bus 050e6176

- **State since the P3 post:** none of the shipped state moved. `origin/main` is `0e8f6ff` (the pull-list refresh). The orchestrator's close review (`bus 4481454a`) read `c/1d.xml` and `changes.xml` as 404 on the live site, and found no a106 branch on the remote. The draft is only on the local branch `a106-feed-draft` (`4417f1f`).
- **Ledger delta:** `A-106` (a per-constant change feed) closed by the stop rule, with its `closeWhen` replaced, because it described the design that failed. `A-107` (a reviewed title table) closed and folded into `A-108`, which was minted as the successor, dated 2026-11-23: the render refuses any id not matching `^[0-9]+[a-z]$` before composing; names come only from a reviewed table; same reader signal (the popular-paths read of our commit pages).
- **Hygiene draft** (the helper's file, in git-ignored `tmp/`; its lines are reproduced here): 4 lines, 2 accepted, 2 amended, 0 rejected. `A-78` (OpenAI's math release mapped onto watched constants) ACCEPT, re-dated 2026-11-30: the release tip is still `4eaee87` (an upstream sha; it does not exist in this repo) and the read is byte-identical to 11-09. `G-4` (an outside party acts on a watched record) ACCEPT, re-dated 2026-11-30: 0 outside arrivals, parts reconcile 37 + 0 + 0 = 37, 80 clean-detection days. `A-81` (the Ramsey watcher) AMEND to 2026-11-17, not 11-18: its run is owed, and it is now the primer's first item. `W-17` (the newer-papers line) AMEND to 2026-11-17, not 11-18: a third plain re-date is the slip the helper named, so the run is the first item of the next day rather than another deferral. Every clock on all four moved (read back: `nextCheckDate` and `expectedSignalBy` both at the new date). READ-MUTATED, quoted: "READ-MUTATED G-4 scripts/lookup.mjs — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks". It was my own `A-106` edit, and `report-rate.mjs` does not import `lookup.mjs` (bus `bd8ee3f7`). Checks: wait-justification "RESULT: PASS — 2 of 129 row(s) carry `waitJustification`; 0 warn / 0 info"; engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable". <!-- pragma: allowlist sha (an upstream sha) -->
- **Due-gate verification:** `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." with the snapshot CURRENT (taken 2026-11-16, 4 rows).
- **Receipt:** unchanged from P3 (`bus 050e6176`): the pull-list refresh `0e8f6ff`, encounter blind (`A-59`).
- **Pending reads:** `A-81`, `W-17` 2026-11-17; `A-103` (the README's visitor command), `A-104` (phone search answer line) 2026-11-21; `A-45` (stale-value resolvability), `A-91` (67a's withdrawn preprint) 2026-11-22; `A-108` 2026-11-23; `A-78`, `G-4` 2026-11-30.
- **Committed with this close:** `docs/evangelism-bar.md` (the night helper's cold audit, its two load-bearing claims verified at P1; its PROPOSAL block is David's taste call and is not adopted), `continuity/traffic.json`, the four read-output stamps, the ledger, this report and the primer `docs/cold-starts/2026-11-16.md`.
