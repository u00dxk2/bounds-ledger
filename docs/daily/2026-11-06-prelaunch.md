---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-06
lifecycle_stage: launched
last_deploy: d82ae0e (CI GREEN on reverify.yml and page-check.yml; GitHub Pages; no Render service)
on_hold_items: 0
top_action_today: the public README and page stop saying more than the code does (six sentences a reader would rely on)
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-06 (Friday, MT)

## BLUF

The public README and the page now say only what the code does, and the change is live. For example, the page no longer says every row links to its primary source; it says the link goes to upstream's file for that constant, not to the paper. A new test also catches a script that runs when it is only imported, and its first run found 16 scripts that do.

## What changed

- P1 chose the day's work (selection packet in the State Appendix).
- **The README and the public page now say only what the code does** (`b0d2f6a`, then review fixes `04b9be2`, `e0f3495`, `842a216`; live after the Pages build at 18:04:21Z). For example, the page said "Every row links to its primary source". It now says the row's source link goes to upstream's own file for that constant, whose table cites the reference, and that it does not go to the paper itself. Six sentences from `A-97` (the row listing the overstated sentences) were narrowed, five unsourced superlatives were cut, and three Codex rounds found and narrowed five more. A fetch of the live page after the build no longer contained the old sentence; positive control: the same fetch returned the new source sentence and 120 rows.
- **A test that importing one of our scripts does nothing** (`A-50`, the row for the import test; `63acb47`). It runs in `npm test` and as two CI steps, and both steps succeeded on `842a2167`. Its first full run found 16 of 48 scripts acting on import: four of them rewrite tracked files, and one would start the whole verify gate. Those 16 are listed and skipped, and `A-98` (the row for guarding them) is due 11-13. The proof that it can fail: a one-line mutation of `scripts/lookup.mjs` made it exit 1 and name four modules, and restoring the file made it exit 0.
- `A-99` (the row for linking each bound to its paper) records the manager review's suggestion, with a first measurement due 11-20.

## Inputs (controllable)

- Narrow six confirmed sentences in `README.md` and `scripts/render-site.mjs`, and re-render the page (`A-97`, the row listing them).
- Build the selftest that imports every command-line script and checks nothing ran (`A-50`, the row for that test).

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). The first Search Console read is due 11-11 on `W-18` (the watch for that read).

## Recommendation

- [A — user-visible] Ship `A-97` (the row listing the overstated sentences) through Codex review and the outward gate.
- [B] Build `A-50` (the row for the import test), red-armed, wired into `npm test` and CI.

## On hold pending data

- The first Search Console read, due 11-11, sits on `W-18` (the watch for that read).

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-05.md` (no 11-06 primer; the 11-05 file is the newest). Its banner governs: morning block, then `A-50` (the import test), with `A-97` (the overstated sentences) also due.
- Listener: SSE alive (hello 15:45:25Z, replay 0) + loop-tick armed by tool call; waker ladder ranks 1 to 3 running.
- Codex: GREEN per the kickoff's probe line (15:44:34Z, execute and write proved).
- CI, as of 15:55Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, both reading 1 non-scheduled success for `d82ae0e`. `git rev-list --count origin/main...HEAD` printed 0. Deployed-sha drift: NOTHING SWEPT (this lane publishes through GitHub Pages and owns no Render service; `docs/daily-config.md` § Deployed-sha drift).
- Local verify not run: the lead's rule is that CI green at HEAD replaces it.
- Harness: running 2.1.319 · fleet UNIFORM (28 of 28 panes) · installed 2.1.319 (SAME).
- Yesterday's Recommendations: one, the Search Console card. Executed (David answered card `901dddba` at 18:00:55Z: verified, sitemap submitted).
- Morning block: `npm run upstream` printed 0 transitions across 3 recorded reports. `npm run traffic` printed 7 unique repo viewers and 275 unique cloners in the latest 14-day window; page visitors are not counted.

### P1 selection packet

**Outcome:** the public README and page say only what the code does. Item `A-97` (the row listing the overstated sentences).

**The user problem, in the user's words** (from `docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out?" A reader who checks us is exactly the reader this page is for, and a sentence about our own method that they can check and find false costs us that reader.

**Evidence**

- OBSERVED · `A-97`'s readCommand, run through the gate at 15:57Z · README.md and scripts/render-site.mjs · today · 9 matching lines, so all six confirmed sentences are still live. Limits: the grep pins phrases, so a sentence reworded without being narrowed would read as fixed.
- OBSERVED · the 2026-11-04 Codex claims pass, each finding read against source by the lead · README.md, the page text in the renderer, the lane brief · one night · 6 CONFIRMED, 5 PLAUSIBLE superlatives, 1 DATED, 3 REFUTED. Limits: the 461-sentence coverage figure is Codex's own and was not re-counted.
- HYPOTHESIS · a mathematician who follows "a link to the primary source beside every number" and lands on an upstream constant table, not the paper, trusts the rest of the page less.
- MISSING · any reading of how real people use the README or the page. The page has no analytics, and GitHub counts only repo views.

**Permission:** `A-97` is open, owned by this lane, not parked, and no card is open on it. Wording changes to our own README and page are this lane's call. The outward gate (`AGENTS.md` § Hard invariants: one adversarial review on anything a stranger could read) applies, and it is planned as a Codex review of the exact diff.

**Next action:** improve. First command:

```bash
git -C C:/dev/skylark/bounds-ledger grep -n -E "primary source beside|links to its primary source|those two plus nine more|is a no-op|never run in CI|Any change upstream trips|across every surface" -- README.md scripts/render-site.mjs
```

**Acceptance condition:** each of the six CONFIRMED sentences is narrowed or recorded on the row with its reason. Each of the five PLAUSIBLE superlatives is cut or kept with a reason. Every finding of a Codex review of the diff is dispositioned on the row. The served page at https://u00dxk2.github.io/bounds-ledger/ no longer carries "Every row links to its primary source" after a Pages build row exists for the push tip. `page-check.yml` and `reverify.yml` are green on that tip.

**Delivery and encounter checks:** delivery is the Pages builds API row for the push tip, then a live fetch of the index page and the README on github.com. Encounter: nothing on the page can see a reader, per `A-59` (the row saying nothing can see an arrival). The nearest readable event is a reply or issue that quotes one of these sentences, and at the current rate (7 repo viewers in 14 days) it would not be readable this month. The encounter is blind, not zero.

**Second item, beside the product work:** `A-50` (the row for the import test), due today. Its onTrigger has said "build it" since the fourth instance on 2026-10-21, and it has been re-dated twice without being built. The build is a selftest that imports every command-line module in one spawned process and asserts stdout stayed empty and no file mtime changed, wired into `npm test` and a `reverify.yml` step. Its proof is a mutation that makes one module act on import, shown red, then restored and shown green.

**Next change for a mathematician citing a constant, after these two:** none chosen today. The 11-11 Search Console read on `W-18` (the watch for that read) is the first signal on the 11-05 title change, and it should pick the next one.

**USER-FACING: yes.** Paths: `README.md`, `scripts/render-site.mjs`, `index.html` (re-rendered); for `A-50` (internal): a new `scripts/` selftest, `package.json`, `.github/workflows/reverify.yml`, `continuity/items.json`.

**HYGIENE INPUTS** (copied from the kickoff's reads):

- (a) Due rows not bearing on the choice, 6 of 8 due: `A-47` (the depth audit), `A-92` (the third watched area, ETH), `A-93` (the formal-math repository mapping), `A-94` (the tomorrow-named primer gate), `W-17` (the dated newer-papers line), `W-6` (the report-an-error read window).
- (b) Owed child rows in the orchestrator's ledger: none (0 of 798 considered).
- (c) State reads marked as crossed: dated gates due today, 8 of 8 (all listed in (a) or selected); board cards carrying David's word, 7, 0 new since the last read; prior-day retro findings, 10, of which 9 are still on discipline and 1 is carried to `W-18` (the watch for that read) on 11-11.
