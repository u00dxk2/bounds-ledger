---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-04
lifecycle_stage: launched
last_deploy: bd0d1fb (the last page-changing commit; npm run served read 1 of 1 served at 2026-10-04T17:18:28Z)
on_hold_items: 0
top_action_today: A-70, the phone index's row controls made tappable and a copy-citation button added
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-04 (prelaunch report)

## BLUF

On a phone, every row of the ledger's main page now has links big enough to tap, and a Copy citation button that copies the exact citation in one tap. We also tried four more papers behind the Ramsey numbers page, and none could be opened in the edition the survey cites, so nothing there was confirmed or contradicted.

## What changed

- **`A-70` (the phone row controls and a copy-citation button), today's evangelism pass.** Shipped in `5f42ce7`, with review fixes `a371655`, `5b6bd04`, `bd0d1fb` and `b1e6b08`; pushed `3b445dc..b1e6b08`. On the live index under `playwright-cli --device "iPhone 15"` (touch proof: `pointer:coarse` true, `ontouchstart` true; 393x659), row c-22a's four controls went from 42x20, 32x20, 85x20 and 38x22 to 51x45, 41x45, 94x45 and 47x45. All 115 cite blocks got a button. One tap showed "Copied", and the pasted text was 516 characters and equal to the block. At 1440x900 the row, cells, controls, table and page height read identical before and after. The manager re-read the phone measurements live at about 17:44Z and matched them to the pixel (bus `321b12f8`). The row is `monitoring`, not closed: its encounter read is `A-59` (the encounter read on the public pages) on 2026-10-28.
- **`A-54` census session 5 (the Small Ramsey Numbers census).** The plan was pushed in `d28bbd2` before any source was opened, and the readings landed in `7793a25` with review fixes `42de6be` and `be1ce84`. Four papers were attempted and no cited edition was reached: Spe4's six bounds and SuLL's one are UNREACHABLE, and Ex4 (R(5, 5) ≥ 43) and AnM4 (R(5, 5) ≤ 46) are UNRESOLVED. Ex4's linked K42 colouring passes `scripts/check-ramsey-coloring.mjs 5 5 42` (exit 0), and a copy with a planted K5 fails (exit 1). That is recorded apart from the verdict, as for Ex16. `node scripts/ds1-depth.mjs`: "census: 61 of 122 bound(s), across 27 of 42 credited paper(s) — 32 sound, 0 defective, 17 unresolved, 12 unreachable" (exit 0).
- **`A-63` (a constant page does not say which claim a verdict checked)** was decided "not this round" at P1. 31 of its 51 read verdicts carry no recorded claim. Its 2026-10-06 date stands.
- **Findings classification, one sentence of human judgment:** today's findings were mostly instrument-facing: three of the four `A-70` review rounds found defects in our own copy script and self-test, and two census review rounds narrowed our own access sentences. The one record-facing observation is that the survey's own entry for AnM4 prints a placeholder volume and pages ("11x (2026) 1-11") where Crossref gives 112(3), 198-208. It is noted on DS1-0066 and asserted nowhere.
  - **Numeric or byte-only: neither.** The drift alarm counted nothing today: the drift leg of `npm run verify` exited 0 at `b1e6b08`, and that run's `npm test` leg runs `reverify.test.mjs`, which plants synthetic drift as its positive control.
  - **Consecutive instrument-facing days: 0**, counted by hand. Today carries one record-facing observation, though nothing was stored as a defect.
  - **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." It is WRONG "if the drift alarm produces the next record-facing catch, or if a human finds a NUMBER that disagrees with its source." **Not falsified, and not confirmed.** The AnM4 placeholder is citation-quality in shape, but it sits in the second watched area's survey, not in a mirrored upstream entry. It was found in the census (`A-54`), not the depth audit (`A-47`), and it is not stored as a catch. CLAUDE.md is unchanged.
- W-7 — the instrument read against its own claim today was `scripts/check-ramsey-coloring.mjs`. It claims to certify that a file is a two-colouring with no forbidden clique. Could it have said otherwise? Today it did, twice, each for the right reason. On the first fetch, a 253-byte 301 redirect body, it printed "RESULT: UNREADABLE" (exit 2) rather than reading the body as a colouring. On the planted-K5 copy it printed "FORBIDDEN: colour 0 contains a K5" and "RESULT: FAIL" (exit 1). Yesterday's W-7 was the `depth-audit --draw` holder line, a different instrument.

<!-- findings:begin -->
**The P3 close of `A-70` was premature, and P5 reopened it as monitoring.** At P3 I set the row to closed on its closeWhen. The close rule is that a shipped change still owed an encounter or outcome read stays `monitoring`. `A-70`'s encounter read is `A-59` on 2026-10-28, so the row is `monitoring` with `nextCheckDate` 2026-10-28 and a readCommand that is that read. The correction is on the row's `monitoring2026_10_04` field; the P3 close commit is `e7a972d`.
<!-- findings:end -->

## Inputs (controllable)

- `A-70` build: one file of code, `scripts/render-site.mjs`, plus the re-rendered `index.html`. Every copy-script and touch guard in its self-test was red-armed by its own mutation. Each mutation and the RED message it printed are in the commit bodies of `5f42ce7` through `b1e6b08`.
- Six Codex read-only review runs, each with its banner workdir checked against this repository before any finding was read. `A-70`: r1 on `5f42ce7`, r2 on `a371655`, r3 a cold round against six stated invariants on `5b6bd04`, and r4 on `bd0d1fb`. Every round returned FIX-THEN-PUSH, and r4 found no runtime defect. Census readings: r1 on `7793a25` and r2 on `42de6be`, both FIX-THEN-PUSH, with all nine verdicts held through both rounds.
- Four background reading agents for census session 5 under `tmp/census5-brief.md`, which is session 4's brief with only the folder changed. It forbids sending identity, solving a verification challenge and using shadow libraries.
- One hygiene helper, dispatched at P3 before the build. Its draft has 2 lines, both accepted at P5. Wait-justification PASS and engineering-zero PASS for this lane.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report):** `npm run reports` at P1 read 0 outside arrivals of 32 raw issues, parts reconciling 32 + 0 + 0 = 32. By the rule of three, the 95% upper bound on the outside share of issues is about 3/32. It counts filed issues on github.com, never page readers.
- **Delivery:** `npm run served` at 17:18:28Z read "1 checked — 1 served" at anchor `bd0d1fb`. reverify.yml was GREEN at `b1e6b08` and again at `be1ce84`. `npm run verify` exited 0 at `b1e6b08`, and every later commit touches only `continuity/` and `docs/`. Encounter: blind (`A-59`, the encounter read, dated 2026-10-28).
- **The two depth counts, side by side and never summed:** the constants audit (`A-47`) did not change today. The Small Ramsey Numbers census is as above.

## Recommendation

Tomorrow's order lives in the primer, written at this close.

- [B] 2026-10-05: `A-47` slice 13 at positions 487, 537, 587, 637 and 687, with the draw pushed before any source is opened.
- [A — user-visible] 2026-10-06: decide `A-63` (which claim a verdict checked) again, or re-date it with the 31-of-51 count; `A-65` (the 10c page's stale source line) the same day.
- [B] 2026-10-06: `A-54` census session 6. 17 papers remain against a capacity of 4 x 6 = 24 through the 2026-10-16 slot.
- [B] 2026-10-08 at the latest: the `A-54` blocked-paper retry. Spe4's 1994 manuscript, SuLL p. 528, Ex4 pp. 97-98 and the AnM4 journal PDF join its list as candidates.

## On hold pending data

- **`A-70`'s encounter:** blind until `A-59`'s read on 2026-10-28. WebKit/Safari is unmeasured, and so is whether iOS Safari's clipboard call resolves or falls back to selecting the block. Chromium emulation cannot show either.
- **The ten Mac bounds and the Ex16 and Ex4 cells on the Ramsey page:** how they are marked is decided at the 2026-10-18 render slot, not before.

## State Appendix

### Selection packet (P1 — evidence and choice)

**Outcome:** on a phone, a reader about to cite a constant can tap each of a row's four controls (source, page, looks wrong?, cite) without hitting the wrong one, and can copy the row's citation with one button instead of drag-selecting about nine lines. Item `A-70` (on a phone the index rows' page and cite links are 20 to 22px tall, and the citation block has no copy button). This is today's evangelism pass: `check-cycle-rotation --lane bounds-ledger` printed "evangelism-pass DUE — P3 IS the pass", so P3 runs `/evangelism-pass` with this as its ship, and the pass is appended to `docs/evangelism-bar.md` § Passes.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." The bar's user is someone *about to cite a number*. The index's own heading is "Is the number you cited still current?", and its cite block is the one control built for that act. On a phone it is a 22px-tall summary beside three 20px links a dot apart, and once it is open it gives the reader no way to copy the citation except a long press and a drag.

#### Evidence

- OBSERVED: a live read today, by me, with `playwright-cli` (Chromium) on `https://u00dxk2.github.io/bounds-ledger/` at 393x659, with `10.02` typed into `#q`, on row `c-22a`, between 15:58Z and 16:00Z. `getBoundingClientRect()` read `source 42x20`, `page 32x20`, `looks wrong? 85x20`, `cite 38x22`, and `copyButton: false`. Population: one row, one viewport, one engine. It reproduces the 2026-10-02 walk's 32x20 and the cite summary's height of 22 (that walk measured the cite summary as 325 wide, so its width box differs; the height agrees).
- OBSERVED (synthetic, not a real user): the orchestrator's round-2 cold walk on 2026-10-02 (skylark-site `tmp/walks-2026-10-02-r2/bounds-ledger.md`, findings 3 and 4), quoted on the `A-70` row.
- HYPOTHESIS: the copy button earns its place on a phone. The cite `<code>` already carries `user-select:all` (`scripts/render-site.mjs` line 645), which may already make one tap select the whole block on some mobile browsers. Not measured. P3 measures what one tap on the block does in Chromium mobile emulation before building the button; if a tap already selects the whole citation, the button is cut and the row records why.
- OBSERVED: `npm run verify` receipt `exitCode` 0 at `f6c2dce177eb7556c361b8dd186e119ea015e5c0`, stamped 2026-10-04T15:57:26Z. The brief leg read UNVERIFIABLE, which is excluded from the exit code and never a pass.
- OBSERVED: `npm run reports`: 0 outside arrivals of 32 raw issues, parts reconcile 32 + 0 + 0 = 32.
- OBSERVED: `npm run served`: "1 checked — 1 served, 0 in flight, 0 stale, 0 unreachable" at anchor `b99f2561d4`, 15:59:35Z.
- OBSERVED: `answered-cards --project bounds-ledger`: "NO waiting/answered/pending-verify cards for bounds-ledger".
- MISSING: the bar's one metric. It is NOT MEASURABLE (the bar's own words): the page is static with no analytics, and GitHub Pages gives no request log. The encounter read is `A-59`, dated 2026-10-28.
- MISSING: any real person's encounter with the phone layout, and any WebKit/Safari measurement of these controls.
- Prior-day retro findings, from the kickoff's quoted lines: none has recurred so far today. The one that bears on this work is "a fix note became a fresh defect". The button's accessible name and any sentence on the page saying what the button copies get their own review angle, apart from the code.

#### Why `A-70`, and not `A-63` (yesterday's [A] recommendation)

`A-63` (a constant page does not say which claim a verdict checked) fires on "2026-10-06 or the next product round, whichever comes first", so it has to be decided today. **Decision: not this round.** The store holds 58 audit entries. 51 of them are read verdicts (every verdict except UNREACHABLE), and 31 of those 51 carry no `claimChecked` field. The 20 that do are written for us ("Named before reading (A-47.slice10Draw…)"). A reader-facing claim sentence for every read verdict therefore means first re-deriving 31 claims from their evidence and then writing 51 public method sentences. That is the sentence class four review rounds refuted on 2026-10-01. It is more than one round. Its 2026-10-06 date stands, and that day's session owes either the build or a re-date with this count. `A-65` (the 10c page's stale source line) stays dated 2026-10-06.

#### Permission

- Lane-authorised: `A-70` is open and not parked, with no board card. It is a first-order improvement to the lane's own page, shipped under authority (operating principles).
- `index.html` is not under the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html`.
- Outward gate: the change publishes on push, so it gets a review from the other model family (Codex, read-only, banner workdir checked) before the push, as the row's onTrigger requires. No one is contacted.

#### Next action

Kind: **improve**. The first command after the P3 go-ahead is a baseline of the renderer's own self-test, on a clean tree:

```
node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
```

Then, in `scripts/render-site.mjs` only, inside the card layout's `@media(max-width:60rem)` block: give the row's source, page and looks wrong? links and the cite summary a touch target of at least 44px. Add a copy-citation button inside the cite block, using the page's existing inline script and `navigator.clipboard`, with no new host and no analytics. Add self-test assertions for both, red-armed, with the meaning-carrying guards ahead of any exact-match pin. Re-render `index.html`.

#### Acceptance condition

The `A-70` closeWhen, verbatim: "On the live index at 393x659 each of the four row controls measures at least 44px tall; the cite block has a working copy button whose copied text equals the block text; 1440x900 unchanged; render-site --check passes." Also: the page still loads nothing from another host, and `npm run check` passes after the commit.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, then the same `playwright-cli` read on the live page at 393x659 (after) and at 1440x900 (no change against a before-read taken at P3).
- Encounter: blind (`A-59`). The event that would show it is an outside issue filed through a row's "looks wrong?" link (now a larger target), counted by `npm run reports` and readable at N = 1. A copy press is not counted and will not be: the page has no analytics, by an enforced invariant.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `index.html`, `continuity/items.json` (the `A-70` row), `docs/evangelism-bar.md` (the pass record).

#### HYGIENE INPUTS

- (a) due rows not bearing on the choice (2): `A-45` (expectedSignalBy 2026-10-04; its readCommand is `node scripts/check-resolvability.mjs`, run locally) and `A-54` (expectedSignalBy 2026-10-04; readCommand `node scripts/check-claims.mjs`). `A-54`'s census session 5, opening with Spe4, is a standing dated obligation and runs today beside the choice. It is not the choice.
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 744 considered".
- (c) state reads marked CROSSED (2): dated gates due today, 2 of 87 swept (the same two rows as (a)); and prior-day retro, 9 still on discipline of 10 tagged findings. Not judged, so not zeros: missingLinkedCommits "NOTHING SWEPT (0 of 0 considered)", and key numbers "no list yet".

### Section 0

- Primer: `docs/cold-starts/2026-10-04.md` read whole.
- Listener: SSE alive (restart 2026-10-04T15:47:24Z, hello 15:47:28Z, slug bounds-ledger). Wake loop armed by tool call. Waker ranks 1 to 3 running.
- Codex: GREEN per the kickoff's probe line (real exec 2026-10-04T15:48:36Z). Not re-probed at P1.
- CI: GREEN at `f6c2dce` (`check-ci-status --workflow reverify.yml`, exit 0). Deploy drift: this lane has no Render service. The lane's delivery read, `npm run served`, PASS as above.
- Harness: installed 2.1.289 (`claude --version`).
- Recs yesterday: `A-54` census session 5 → carrying, today. `A-47` slice 13 → carrying, dated 2026-10-05, not pulled forward. `A-63` and `A-65` by 2026-10-06 → `A-63` decided "not this round" above, with the count; both keep their 2026-10-06 date.

### Close

ACTION: COMPLETED · item `A-70` (the phone row controls and the copy-citation button) · P3 `240c2320`

- **Met:** the manager's replacement acceptance condition, on the live index (iPhone 15 emulation with touch proof; 1440x900 unchanged; `render-site --check` and `npm run verify` green), confirmed COMPLETED by the manager's own re-read (bus `321b12f8`).
- **Changed since the P3 post:** `A-70` moved from closed to `monitoring`, because its encounter read is still owed; see the findings block above. Nothing else changed.
- **Ledger delta at this close** (`continuity-edit.mjs`):
  - `A-45` (stale-value resolvability) re-dated to 2026-10-11, ACCEPTED from the hygiene draft. Its read stamped today: "209 of 209 resolvable (100.0%)".
  - `A-54` (the Small Ramsey Numbers census) re-dated to 2026-10-06, ACCEPTED. Session 5 landed in `7793a25`.
  - `A-70` set to `monitoring`, with `nextCheckDate` 2026-10-28, a link to `A-59`, and its readCommand set to `npm run reports`.
- **Hygiene draft:** 2 lines — 2 accepted · 0 amended · 0 rejected. READ-MUTATED: "none — 2 reads guarded". check-wait-justification: "RESULT: PASS". check-engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)". Positive control: the same run printed RED fleet rows for two other lanes (frame-dial Dependabot #115, frolic Sentry FROLIC-WEB-Q), so the probe can return findings.
- **Due gates:** `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." with "snapshot CURRENT: taken today (2026-10-04)".
- **Pending reads:** `A-59` on 2026-10-28 (the only pending read for `A-70`); `A-47` slice 13 on 2026-10-05; `A-63`, `A-65` and `A-54` session 6 on 2026-10-06; the `A-54` blocked-paper retry by 2026-10-08.
- **UNRESOLVED:** none.
