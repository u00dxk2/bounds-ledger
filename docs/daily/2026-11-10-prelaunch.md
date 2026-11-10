---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-10
lifecycle_stage: launched
last_deploy: 603e2aa (CI GREEN on reverify.yml and page-check.yml; GitHub Pages; no Render service)
on_hold_items: 0
top_action_today: on a desktop index, let long exact fractions and lists break between numbers, never inside one
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-10 (Tuesday, MT)

## BLUF

On a desktop screen, no exact number on the index splits mid-digit any more. A long fraction now breaks at its slash and a list at its commas, so each number stays whole. At 1366 px the count fell from 8 to 1, and the one left is a 64-character file hash, not a number. `A-101` (the row for numbers wrapping mid-digit on desktop) is closed.

## What changed

- P1 chose the day's work (selection packet in the State Appendix).
- **Long fractions and lists break between numbers** (`A-101`, the row for numbers wrapping mid-digit on desktop; `f01a0c6`, review fixes `f866a9d`). Live after the 16:13:01Z Pages build of `f866a9d`, broken single numbers, all rows shown: 1366 px 8 to 1, 1024 px 27 to 16, 961 px 32 to 18 (`docs/measurements/2026-11-10-a-101/`). Copied text and search are unchanged, and the phone layout is unchanged. `A-101` is closed.
- **`npm run close:primer` now asks for the primer named for the day it is written** (`A-94`, the close check wanting a tomorrow-named primer; `adad52d`, review fixes `f2794b1` and `b2d8d8d`). It had exited 1 at every close since 2026-09-30. `A-94` is closed.
- The morning block ran. `npm run upstream` printed "0 transition(s) across 3 recorded report(s)". `npm run traffic` printed 7 unique repo viewers and 284 unique cloners in the latest 14-day window (page visitors are not counted).

## Inputs (controllable)

- Show long exact fractions and comma lists so each number inside them stays whole at 1366 px, and keep that when the page's own search marks a cell.

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). The first Search Console read is due 11-11 on `W-18` (the watch for that read).
- `npm run reports` printed "parts reconcile: 37 + 0 + 0 = 37", so 0 outside arrivals of 37 raw issues.

## Recommendation

- [A — user-visible] Both of today's items are closed. At 1024 and 961 px, 16 and 18 single numbers still break, each wider than its column there (1d's two 43-digit runs are the longest). That is a different question from `A-101`'s 1366 px target, and no row tracks it. Mint one only if a reader is seen on a narrow desktop window; nothing can see one today (`A-59`, the row saying nothing can see an arrival on the page).
- [B — instrument] `W-4` (prove each new detector both ways): its read timed out under today's load and stamped nothing. Re-run it on a quiet tree at the close.

## On hold pending data

- The first Search Console read, due 11-11, sits on `W-18` (the watch for that read).

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-09.md` (no 11-10 primer; the 11-09 file is the newest, named for the day it was written). Its banner governs: morning block, then the reads dated today.
- Listener: `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0; SSE hello at 14:59:54Z. Loop-tick armed by tool call. Waker ladder ranks 1 to 3 launched at 14:59Z.
- Codex: GREEN per the kickoff's probe line (15:08:16Z, execute and write proved).
- CI, as of about 15:22Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each reading 1 non-scheduled success for `603e2aa`. `git rev-list --count origin/main...HEAD` printed 0. `git pull --ff-only` printed "Already up to date."
- Deployed-sha drift: NOTHING SWEPT for this lane. The fleet table covered 38 services and exited 0, which is a verdict about those services and not about us; `bounds-ledger` appears in none of its blocks. This lane publishes through GitHub Pages (`docs/daily-config.md` § Deployed-sha drift).
- Local verify not run: the fleet rule is that CI at HEAD replaces it.
- Harness: `claude --version` printed 2.1.322.
- Yesterday's Recommendations: one, `A-101` (the row for numbers wrapping mid-digit on desktop). Carried into today's choice.
- Board: `update-david-board.mjs --list` returned 0 items for this lane. `answered-cards.mjs` reported 0 new. Its two portfolio-wide cards, `0a00d394` (the agent-map offer page) and `9174731b` (three repo cleanups), are skylark-site's and name nothing in this repo.
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` exited 0 and printed "no product-love cycle picks this lane today (4 cycle(s) rotate over 24 lanes); run the normal P3".
- The bar's metric: `docs/evangelism-bar.md` says it is NOT MEASURABLE, and nothing today changes that. There is no `docs/evangelism-evidence.md` in this repo (Glob `docs/*evidence*` returned no files; positive control: the same Glob tool found the 15 files under `docs/measurements/2026-11-09-a-101/`).
- Due gates: `check-due-gates-dispositioned.mjs --snapshot` printed "snapshot written — 5 gate(s) due on/before 2026-11-10".

### P1 selection packet

**Outcome:** a desktop reader sees every exact number in a bound cell whole, with long fractions and lists broken between numbers. Item `A-101` (the row for numbers wrapping mid-digit on desktop), pulled forward from its 11-14 date.

**The user problem, in the user's words** (from `docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out without redoing the literature search I did last year?" Answering that means comparing digits, and a numerator split across two lines is harder to compare.

**Evidence**

- OBSERVED · `docs/measurements/2026-11-09-a-101/live-1366.json`, the live page after the 11-09 Pages build of `020b56d` · all 120 rows, and one row at a time · read 11-09 by us. 8 broken single numbers at 1366 px in both views, each in a 379 px bound column: 1c (27 and 5 digits), 44a (29), 57c (18, 18 and 19 characters), 89a (38 and 39).
- OBSERVED · the source of each, read today in `ledger/teorth-optimizationproblems/constants/`: 1c, 44a and 89a are exact fractions written `$a/b$` with no spaces (89a: `$1126728298914655736634696330762614467/37384537381450758925419573570384691200 = …$`). 57c is a tuple written `$(x,y,z,w)$`. The 5-digit 1c entry, `09580`, is a digit run inside a 64-character SHA-256 hash in backticks, not a number.
- OBSERVED · cause, `scripts/render-site.mjs:845`: a bound cell is `code{white-space:pre-wrap;word-break:break-word}`. A token with no break opportunity is broken at any character, so a 77-character fraction splits wherever the column ends.
- OBSERVED · `scripts/render-site.mjs:991`: the page search resets each marked cell with `x.e.textContent=x.t` and rebuilds it from text nodes. Break points added only at render time would vanish the first time anyone searches.
- HYPOTHESIS · each piece fits once `/` and `,` are break points. At 12.5 px monospace (about 7.5 px a character) a 379 px column with 0.5rem padding holds about 48 characters. The longest piece after a split is 89a's margin denominator with its closing `$).`, about 42 characters. Not measured yet; P3 measures it with `run.ps1`.
- HYPOTHESIS · a `<wbr>` element changes neither copied text nor the search's `textContent`, so copy and search behave as they do now. P3 checks both in the browser.
- MISSING · any real reader hitting this. The page has no analytics (`A-59`).

**Permission:** `A-101` is open, owned by this lane, not parked, and has no card. `decisionOwner2026_11_09` on the row says this lane decides the display. The outward gate (`AGENTS.md` § Hard invariants: one adversarial review on anything a stranger could read) applies, as a Codex review of the exact diff.

**Next action:** improve. First command:

```bash
node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
```

**Acceptance condition:** `pwsh -File docs/measurements/2026-11-09-a-101/run.ps1 https://u00dxk2.github.io/bounds-ledger/ live` after the Pages build prints, at 1366 px, at most 1 broken single number in both views, and that one is the 1c hash. Each remaining break at 1024 and 961 px is listed with its length. No cell overflows and the table never scrolls sideways at any measured width. After typing `/` into the page search and clearing it, 89a's fraction still breaks at its slash. A copied 89a cell equals the mirror text byte for byte. `render-site --selftest` asserts both halves (render and search) and goes red with either removed. `page-check.yml` and `reverify.yml` are green on the push tip, and a Pages build row exists for it.

**Delivery and encounter checks:** delivery is the Pages builds API row for the push tip, then `run.ps1` on the live page at 1366, 1024, 961 and 1920 px, plus a screenshot of 89a at 1366. Encounter: nothing on the page can see a reader (`A-59`). The encounter is blind, not zero.

**Recurred retro finding that bears on this:** 11-09's Q2, "the layout probing" (still on discipline). Today measures with the committed `run.ps1` and `measure.js`, not ad-hoc browser probes.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `index.html`, `continuity/items.json`, `docs/measurements/`.

**HYGIENE INPUTS** (copied from the kickoff's reads):

- (a) Due rows not bearing on the choice, 5 of 5 due: `A-2` (the drift-resolution log), `A-94` (the close check wanting a tomorrow-named primer), `W-13` (the call of the served-bytes check), `W-4` (prove each new detector both ways), `W-8` (whether an amended outward artifact goes back to David).
- (b) Owed child rows in the orchestrator's ledger: none, from the kickoff read over 810 rows.
- (c) State reads marked as crossed: none carries the word. Those printing a threshold clause: dated gates due today, 5 of 5 (listed in (a)). Board cards carrying David's word: 2, `0a00d394` and `9174731b`, neither this lane's. Prior-day retro findings: 10 tagged, 9 still on discipline, 1 carried (`A-101`, today's choice). `missingLinkedCommits`: NOTHING SWEPT, 0 of 0. Key numbers: no list yet (no `docs/key-metrics.json`).

### P3 product work

The manager review approved the packet and suggested putting the break points back inside the search's own rebuild rather than a separate pass. That is how it shipped.

**What shipped (`A-101`).** The renderer writes a `<wbr>` after each `/` and each comma in a bound cell. A comma with a digit before it and exactly three digits after it is part of a number and gets none. The page search rebuilds a cell from text when it marks it, so its `mark()` now writes through a `put()` that inserts the same break points, decided on the whole cell text. A `<wbr>` adds no character, so copied text and the search's text are unchanged.

**Live, after the Pages build of `f866a9d`** (`live-<width>.json` in `docs/measurements/2026-11-10-a-101/`):

| width | all rows, before → after | one row, before → after |
|---|---|---|
| 1366 | 8 → 1 | 8 → 1 |
| 1024 | 27 → 16 | 27 → 16 |
| 961 | 32 → 18 | 32 → 18 |
| 1920 | 8 → 1 | 8 → 1 |

The one left at 1366 and 1920 px is 1c's SHA-256 hash, left on purpose: `measure.js` counts its digit run `09580`, and a hash is not a bound value. Cells overflowing: 0. No sideways scroll at any width. 1b's lower bound stays on one line. On 89a, `checks.js` read the numerator and denominator each on one line, breaking at the slash, before, during and after a search for `/`. The selected cell text holds the fraction exactly as `89a.md` writes it. The same check on the pre-push live page read the denominator on two lines. At 390 px the card layout reads as before.

**`A-94`, the second lead.** `scripts/check-next-primer.mjs` now owes the primer named for the day it is written, by the fleet's rule (a later-dated file wins). Live: exit 1 with only `2026-11-09.md` present, exit 0 with a temporary `2026-11-10.md`. `docs/close-session-config.md` now tells the close to generate the primer for today, not tomorrow.

**Review.** `A-101`: Codex round 1 on `f01a0c6` raised two findings, both confirmed and fixed in `f866a9d` (a check that could not locate the break, and no test of a mark beginning or ending on `/`). Those fixes reach no reader, so no second round. `A-94`: round 1 on `adad52d` raised three, all confirmed; two fixed in `f2794b1`, the third (outputs on the row) done in the ledger. Round 2 on `f2794b1` raised four, all confirmed and fixed in `b2d8d8d`; they are mechanical and each was shown to change its outcome, so no third round. Selftest red-arms are listed in each commit body; every mutation failed on the assertion that names it.

<!-- findings:begin -->
- A defect of our own, caught before commit by the local measurement: the first draft broke after every comma and split 65a's `4,196,879`, which had read whole. The thousands-group rule fixed it, and the selftest now covers it in both halves.
- Correction to the P1 packet's acceptance condition: it named `docs/measurements/2026-11-09-a-101/run.ps1`. The live run used a copy in `docs/measurements/2026-11-10-a-101/`, with `measure.js` byte-identical, so today's files sit beside today's checks.
- A measurement limit: the browser tool would not open a `file://` page, so the local render was measured through a localhost server started and stopped by its own PID.
<!-- findings:end -->
