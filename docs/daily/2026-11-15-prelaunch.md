---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-15
lifecycle_stage: launched
last_deploy: "96e3793 (as of about 17:00Z on 2026-11-15, check-ci-status read reverify.yml and page-check.yml green on 96e3793; release: node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml, then --workflow page-check.yml; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: on each constant page, show a bound's value apart from its citation key and comment instead of one raw table line
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-15 (Sunday, MT)

## BLUF

Readers see one change today: the open pull request lists on 59 constant pages were refreshed, and the 1d page now shows a pull request opened today.

The planned change, showing each bound's number apart from its run-on table row, did not ship: the last of three designs could still show the wrong number in a table shaped differently from today's, and the orchestrator's rule ended the day there. The pages stay as they were.

## What changed

- P1 chose the day's work: `A-105` (a constant page prints each bound as one raw table line). The selection packet is in the State Appendix.
- **`A-105` did not ship.** Three designs across five read-only Codex rounds; the last design's code round found one constructed route of the same defect class a third time, and the orchestrator's pre-set rule said not to patch or ship it today (details under Inputs). Both drafts sit on local branches (`a105-denylist-draft`, `a105-value-line-draft`); nothing of it was pushed. The row stays open with the finding, re-dated to 2026-11-16.
- Morning refresh of the open pull request lists: `open-pulls.mjs --fetch` read 96 open upstream at 17:01:41Z (95 yesterday; one added, 371 on 1d; none removed). The render changed 59 constant pages, one line each. Pushed alone by sha as `b507ad3` after a read-only Codex round (banner workdir checked) that found 0 defects and no reader-visible change outside the pull request sections (positive control: the same reviewer, on the same day, found 3 defects in commit `2e6d60e`). CI `reverify.yml` and `page-check.yml` green on `b507ad3`; Pages build row built 17:22:47Z; a live fetch of `c/1d.html` returned 200 and carries pull request 371.

## Inputs (controllable)

- Section 0 reads, the morning block, live reads of `c/5a.html` and the index at 390x844, a count of how the 240 generated pins split into cells, and the `A-105` mint.

<!-- findings:begin -->
- **`A-105`'s first design was a denylist, and two review rounds each found a new route of one class.** The class: a split row whose shown parts mislead (wrong column, a cut TeX span, Markdown link source, or a starred value losing its asterisk sentence). Round 1 on `2e6d60e`: `$$` and `\(` delimiters, a value ending in `^{*}`, and Markdown links with nested brackets. Round 2 on `f3f2ef7` ("class verdict: YES"): `^{\ast}`, a reference-style link, and an escaped dollar sign. Every route was a constructed input; both rounds found all real admitted rows right (234 of 234 in round 2). Per the stop rule I consulted (bus `d806fe5c`) instead of patching a third time, recommending a value line gated by an allowlist (136 of 240 sides by that estimate) over an allowlisted split (120 of 240). Neither commit was pushed.
- **The value line (the orchestrator's answer, bus `aa39c49e`) did not ship either, by the rule that answer set.** Built as `817627c`: 140 of 240 sides got a line (18 plain, 94 in dollar signs, 28 starred, each starred one with the README caveat), and the other 100 were byte-identical to `b507ad3`. Its one Codex code round returned "class verdict: YES": `valueLine('| 2026 | $0.5$ | [R] |', true)` shows `2026`, because the renderer takes the first cell as the bound, and `scripts/extract-pins.mjs:60` never reads the table header. No real table triggers it today (all 240 real sides passed; every bounds table is headed Bound first), but an upstream table with another first column would. The answer said a third appearance means no patch and no ship today, so `817627c` sits on a local branch and main stayed at `b507ad3`. A safe value line has to read the source table's own header.
- **The claims pass refuted part of my P1 premise.** S4.1, REFUTED-AS-WRITTEN: the page's cite block already prints `upper bound: $0.94304$` on its own line, so "printed it only inside a run-on line" was too strong. The true problem is narrower: the first thing a reader meets on each side is the run-on row.
- Classification (one sentence of judgment, never a counter): today's findings concern our own page renderer and my own premise about it, so all are instrument-facing and none is record-facing; `npm run catches` was not run.- Classification (one sentence of judgment, never a counter): filled at the close.
<!-- findings:end -->

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). `npm run traffic` read 5 unique repo viewers and 267 unique cloners in the latest 14-day window (repo views, not page readers). `npm run reports` read 0 outside arrivals of 37 raw issues.

## Recommendation

- [A — user-visible] Leave the constant pages' bound display as it is. `A-105` (the bound shown apart from its run-on row) is closed: the cite block already prints each bound on its own line, and the only safe shape left (a value line gated on the source table's own header) costs a new design for little gain. Re-open as a new row only on a reader's report or a walk.
- [B — carried] On 11-19 continue `A-47` (the depth audit) at slice 25, as yesterday.
- [C — outward, gated, carried] The 3b DOI correction from 11-12 is still unsent: adversarial review and David's word first.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-14.md` (no `2026-11-15.md` exists; primers are named for the day written). Its banner governs: morning block, then the reads dated today (`A-45` (stale-value resolvability), `A-91` (upstream's 67a file cites a withdrawn preprint), `W-11` (search our own record before calling a claim decision-ready)). `git pull --ff-only` printed "Already up to date."; `git rev-list --count origin/main...HEAD` printed 0.
- Listener: `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0 (session start 16:51:33Z, relaunched by the session-start hook). Loop-tick armed by tool call; waker ladder ranks 1 to 3 launched at about 16:53Z.
- Codex: GREEN per the kickoff's probe line (16:52:43Z, execute and write proved).
- CI, as of about 17:00Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each "1 completed non-scheduled success(es) for HEAD" at `96e3793`. No local full run of the battery: CI is cited at HEAD.
- Deployed-sha drift: NOTHING SWEPT for this lane; it publishes through GitHub Pages and declares no Render service.
- Board: `update-david-board.mjs --list` returned 0 cards for this lane (positive control: the same board, read through `answered-cards.mjs` the same morning, returned 2 cards). `answered-cards.mjs` showed 2 portfolio riders (`dd410b2a` screenshot piles, `2516f28c` refactor-night commands), 0 new; none asks anything of this lane today.
- Yesterday's recommendations (`docs/daily/2026-11-14-prelaunch.md`): [A] `A-47` (the depth audit) slice 25 on 11-19: carrying, not due. [B] a standalone entry guard: optional, not taken today. [C] the 3b DOI correction: carrying, outward and gated on adversarial review and David's word; not today's choice.
- Morning block reads: `npm run upstream` "0 transition(s) across 3 recorded report(s)"; `npm run traffic` as above; `open-pulls.mjs --fetch` 96 open; `render-constant-pages.mjs` wrote 120 pages, 59 changed; `render-constant-pages.mjs --check` "RESULT: PASS — 120 constant page(s) match committed state", exit 0 (it compares the working tree; the upstream sha it names is the one in `ledger/teorth-optimizationproblems/manifest.json`).
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` "no product-love cycle picks this lane today", exit 0.

### P1 selection packet

- **Outcome:** `A-105`, a constant page's bound shown as a value. A reader who opens a constant's page to check the number they cited sees that number on its own line, with its citation key and the row's comment as separate labelled parts, and the exact pinned row one tap away.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out without redoing the literature search I did last year?" The page answers with a dated label, but the number the label is about is printed as `| $0.94304$ | [COT26] | Corollary 1.2: a Sidon set $\mathcal{A}\subseteq[1,N]$ with $k\ge 483$ elements satisfies … |`, so the reader has to find the value between pipe characters in a long line of TeX source.
- **Evidence:**
  - OBSERVED · live `https://u00dxk2.github.io/bounds-ledger/c/5a.html`, Playwright at 390x844 · 2026-11-15 about 17:07Z · `document.body.innerText`: under "UPPER BOUND, LAST-LISTED ROW" the row is one line beginning `| $0.94304$ | [COT26] |` and running through the whole comment to a closing `|`; the lower side reads `| $0$ | [Si38] | |`. One page, one browser.
  - OBSERVED · the same row on the live index card `c-5a` at 390 wide: 458px tall, the same raw line on each side.
  - OBSERVED · `scripts/render-constant-pages.mjs:1079-1081` (`side()`): the page prints `displayCell(row)` in one `<code>` element; `displayCell` (`scripts/render-site.mjs:421`) only strips upstream anchor links. The exact pinned row already sits behind a `details` element whenever the display differs from it.
  - OBSERVED · `ledger/claims.json`, the 240 generated pins (read by a PowerShell count today): 235 start and end with a pipe and contain exactly four pipe characters, so three cells; 5 contain three (for example `| $0.379005$ | [W2022] |`). A cell holding a literal pipe in TeX would change that count, so the split admits exactly four and anything else keeps today's display.
  - HYPOTHESIS · that a separate value line is easier to check against a cited number than the raw line. Judgment, not a measurement.
  - MISSING · any real reader's account of a constant page. There is no `docs/evangelism-evidence.md`, and the page has no analytics (`A-59`).
- **Permission:** `A-105` is a lane row (minted today, open, owner bounds-ledger, no park, no card). Layout on our own page, inside the lane's authority. Public, so the outward gate applies: a cross-family (Codex) review and a claims pass on any new label before push. No freeze covers `c/` (the 2026-09-20 freeze names `ramsey.html` and `copying.html`).
- **Next action:** improve. In `side()`, when the pinned row has exactly three cells, render the value cell, the reference cell and the comment cell as three labelled parts, keep the existing "exact pinned row" details element, and leave every other row as it renders today. The pin, the checker, the cite block and the index are not changed. Write the failing selftest case first. First command:

  ```
  node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --selftest
  ```

- **Acceptance condition:** on the live `c/5a.html` at 390x844 after the Pages build, the upper side shows `$0.94304$` as its own part, `[COT26]` as the reference, the comment apart, and "exact pinned row" opens to the byte-identical pin. A two-cell row's page (one of the 5) renders as it does today. `render-constant-pages --selftest` asserts both, and a red-arm (the split disabled, or admitting a five-pipe row) turns them red. `render-constant-pages --check` matches after the commit.
- **Delivery and encounter checks:** delivery is the Pages build row for the pushed sha plus a Playwright read of `c/5a.html` and one two-cell page at 390x844 and 1366x900. Encounter is blind (`A-59`). The arrival that can show up is an outside issue started through a page's "looks wrong?" link, counted by `npm run reports`, readable at N = 1, read on 11-21 beside `A-103` and `A-104`.
- **USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs` (markup and selftest), `c/*.html` (regenerated), `continuity/items.json` (`A-105`). Not `index.html`: the index cards feed the filter's highlighting and the `A-104` answer line, which this change leaves alone.
- **Standing obligation beside it, not the choice:** the morning open pull request refresh (96 open, 59 pages changed, one line each). Its own commit on top of `origin/main`, a read-only Codex round, and a push by its own sha, before any `A-105` commit.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: 3 of 3 due. `A-45` (stale-value resolvability, expectedSignalBy 2026-11-15), `A-91` (upstream's 67a file cites a withdrawn preprint, nextCheckDate 2026-11-15), `W-11` (search our own record before calling a claim decision-ready, expectedSignalBy 2026-11-15). Read: `check-due-gates-dispositioned.mjs --snapshot`, "3 gate(s) due on/before 2026-11-15".
  - (b) owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger" (0 of 823).
  - (c) state reads marked CROSSED: none. Read: the kickoff's state reads (stale-actionable 1 of 29 with no threshold clause; missingLinkedCommits NOTHING SWEPT, 0 of 0).
- **Key number:** of the 235 three-cell pinned rows, how many constant-page sides show the value as its own part: 0 of 235 today, read from the renderer's code path and the live 5a page this round. Target 235 of 235, with the other 5 unchanged. It measures what the page shows, not whether anyone reads it. This lane has no `docs/key-metrics.json`, so no hub number applies.
- **A prior-day retro finding that bears on the choice:** 11-14 Q5, a second review round finding the same defect class requires a consult before the third. Splitting a row on pipe characters is a parser over a format, so if two Codex rounds both find a row that splits wrongly, I stop and consult rather than add a third rule.

### Close

- ACTION: DEFERRED — `A-105` (a constant page's bound shown apart from its run-on row) did not meet its acceptance condition; the value-line design's code round on `817627c` returned "class verdict: YES", and the orchestrator's answer (bus `aa39c49e`) set that as the end of the day · trigger: a reader's report or a walk showing a misread of which number a row states (no date) · item `A-105` · P3 `4f38bc22`.
- Since the P3 post: manager review `27e7a29a` read DEFERRED as the correct end and asked for `A-105`'s stale closeWhen (it described the first design) to be rewritten. Rewritten to say the page stays as it is and why, then the row closed (recommendation [A] above). The two draft branches stay local.
- Ledger delta (`continuity-edit`): `A-105` minted (P1), closeWhen rewritten, closed; `A-45` expectedSignalBy 2026-11-15 to 2026-11-22; `A-91` re-dated to 2026-11-22 after its onTrigger read (Grep for `withdrawn` over the mirrored `67a.md`, case-insensitive: 0 hits; positive control `HC2015` on 15 lines, line 71 still cites arXiv:1509.00270); `W-11` (search our own record before calling a claim decision-ready) re-dated to 2026-12-15 with a note on today's posts.
- Hygiene draft: 3 lines, 2 accepted (`A-45`, `A-91`), 1 amended (`W-11`: same re-date plus a note on the standing read the helper did not do), 0 rejected. Its READ-MUTATED section: "none — 3 reads guarded". Its checks: `check-wait-justification` "RESULT: PASS — 2 of 128 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)"; `check-engineering-zero --project bounds-ledger` "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable" (exit 0; positive control: the same run counted 1 finding fleet-wide, in another lane).
- Due-gate verify: `check-due-gates-dispositioned.mjs` "verdict: CLEAR — every gate due at Phase 0 was dispositioned.", snapshot CURRENT (taken 2026-11-15).
- Dependabot open alerts: 0 (`gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open --jq length`). No Sentry project.
- Receipt: the P3 post's `USER-VISIBLE: data:` line for the open pull request refresh (`b507ad3`) still holds; nothing new.
- Pending reads: 11-16 `A-78` (OpenAI's math release mapped onto the watched constants), `A-81` (the newer-result watcher for Small Ramsey Numbers), `G-4` (an outside party acts on a watched record), `W-17` (the newer-papers line on every constant page); 11-21 `A-103` (a visitor's live check in a bare clone) and `A-104` (the search-box answer line), both read with `npm run reports`; 11-22 `A-45`, `A-91`; 12-15 `W-11`.
- Primer: `docs/cold-starts/2026-11-15.md`.