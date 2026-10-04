---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-04
lifecycle_stage: launched
last_deploy: b99f256 (the last page-changing commit; npm run served read 1 of 1 served at 2026-10-04T15:59:35Z)
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

Written at the close.

## What changed

Written at the close.

## Inputs (controllable)

Written at the close.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report):** `npm run reports` at P1 read 0 outside arrivals of 32 raw issues, parts reconciling 32 + 0 + 0 = 32. It counts filed issues on github.com, never page readers.

## Recommendation

Written at the close.

## On hold pending data

Written at the close.

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
