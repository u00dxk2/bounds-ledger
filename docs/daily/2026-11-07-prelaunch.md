---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-07
lifecycle_stage: launched
last_deploy: 92b890b (CI GREEN on reverify.yml and page-check.yml; GitHub Pages; no Render service)
on_hold_items: 0
top_action_today: each displayed bound links to the reference entry its own row cites, where upstream's reference list gives a link
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-07 (Saturday, MT)

## BLUF

Today's plan is to link each bound on the constant pages to the work it cites, so a reader can check the number at its source in one click. A first count found a usable link for 132 of the 240 bounds shown. Bounds without one will say so plainly.

## What changed

- P1 chose the day's work (selection packet in the State Appendix). Nothing user-visible has shipped yet today.
- The morning block ran: `npm run upstream` printed "0 transition(s) across 3 recorded report(s)", and `npm run traffic` printed 7 unique repo viewers and 293 unique cloners in the latest 14-day window (page visitors are not counted).

## Inputs (controllable)

- Pull `A-99` (the row for linking each bound to its paper) forward from 11-20: measure, then build the per-bound link for the bounds whose cited entry carries a link.

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). The first Search Console read is due 11-11 on `W-18` (the watch for that read).
- Report arrivals: `npm run reports` printed "OUTSIDE ARRIVALS: 0" over 37 issues fetched, parts reconciling 37 + 0 + 0 = 37.

## Recommendation

- [A — user-visible] Build `A-99` (the row for linking each bound to its paper) in the narrower form described in the packet, through Codex review and the outward gate.

## On hold pending data

- The first Search Console read, due 11-11, sits on `W-18` (the watch for that read).

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-06.md` (no 11-07 primer; the 11-06 file is the newest). Its banner governs: morning block, then the `W-6` (the report-an-error read window) read.
- Listener: SSE alive (hello 17:00:09Z, replay of 0 rows since 2026-11-06T18:23:57Z) and loop-tick armed by tool call; waker ladder ranks 1 to 3 running (rank 1 relaunched after its 17:22Z wake-shorten fire).
- Codex: GREEN per the kickoff's probe line (17:09:32Z, execute and write proved).
- CI, as of 17:23Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each reading 1 non-scheduled success for `92b890b`. `git rev-list --count origin/main...HEAD` printed 0. The overnight scheduled reverify run (09:18Z) concluded success on the same sha. Deployed-sha drift: NOTHING SWEPT. The fleet table covered 38 services and this lane owns none; it publishes through GitHub Pages (`docs/daily-config.md` § Deployed-sha drift).
- Local verify not run: the fleet rule is that CI green at HEAD replaces it.
- Harness: running 2.1.319 · fleet UNIFORM · installed 2.1.319 (SAME).
- Yesterday's Recommendations: two. Executed, both: `A-97` (the row listing the overstated sentences, `842a216`) and `A-50` (the row for the import test, `63acb47`), closed in `a57ab95`.
- Board: `update-david-board.mjs --list` returned 2 cards for this lane, both answered on 11-05 (`901dddba` and `207bbc2c`); `answered-cards.mjs` reported no new answers since its last read.

### P1 selection packet

**Outcome:** a reader can go from a displayed bound to the reference its row cites in one click. Item `A-99` (the row for linking each bound to its paper), pulled forward from its 11-20 date.

**The user problem, in the user's words** (from `docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out without redoing the literature search I did last year?" Today a row's source link goes to upstream's constants file, and the reader must find the citation key in its References section by hand. That gap was named in `A-97`'s close (the row listing the overstated sentences).

**Evidence**

- OBSERVED · a read-only scratch script (not committed) that takes each of the 240 generated pins, reads the first citation key in its reference cell, and resolves it with `referenceEntryLine` from `scripts/render-constant-pages.mjs` · all 240 displayed bounds · mirror at HEAD `92b890b` · literal output: `{"pins":240,"noKey":28,"multiKey":13,"unresolved":34,"resolvedNoUrl":46,"paper":99,"nonPaper":33}` and "sum check: 240 of 240". So 132 bounds cite one entry that carries a link (99 to hosts my pattern calls paper hosts, 33 to others, 24 of those on github.com). Another 46 resolve to an entry with no link. Of the rest, 34 cite a key that does not resolve to exactly one entry and 28 cite no key. Limits: only the first key is read (13 cells cite more than one); the paper-host pattern is a guess and is NOT used in the plan below. Positive control: the same run returned 132 entry lines carrying a link, so the resolver was reading the mirror files and not failing on every key.
- HYPOTHESIS · a mathematician checking a bound wants the cited work, and a link that lands on a 600-line constants file loses some of them before they find the entry.
- MISSING · any reading of what real readers click. The page has no analytics, and `A-59` (the row saying nothing can see an arrival) records why.

**The narrower form, chosen before building** (yesterday's lesson, where review rounds converged by claiming less): the link is labelled as the link upstream's reference list gives for that key, never as "the paper". That drops the paper-or-not classifier, which would be a parser over URLs, and covers 132 of 240 instead of 99. A bound whose key has no single entry with a link says so in words.

**Permission:** `A-99` is open, owned by this lane, not parked, with no card on it. Changing our own constant pages is this lane's call. The outward gate (`AGENTS.md` § Hard invariants: one adversarial review on anything a stranger could read) applies, planned as a Codex review of the exact diff plus a claims pass on the new page sentence.

**Next action:** improve. First command:

```bash
node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --check
```

(The measurement script lives outside the repo and is not committed; P3 folds its count into a committed check.)

**Acceptance condition:** on the live constant pages, each bound whose cited key resolves to exactly one reference entry carrying a link shows that link, labelled as upstream's reference link for the key. Every other bound shows a plain sentence saying no single linked entry was found. `render-constant-pages --check` and `page-check.yml` and `reverify.yml` are green on the push tip. A Pages build row exists for that tip, and a live fetch of three changed pages shows the link.

**Delivery and encounter checks:** delivery is the Pages builds API row for the push tip, then live fetches of changed `c/` pages. Encounter: nothing on the page can see a reader, per `A-59` (the row saying nothing can see an arrival). The nearest readable signal is the 11-11 Search Console read on `W-18` (the watch for that read), which can show impressions on `c/` pages but not clicks on a link inside them. The encounter is blind, not zero.

**Recurred retro finding that bears on this:** the report-lint repair loop (11-06 retro, still on discipline). This report glosses each tracker id in parentheses with no comma, and every count names its command.

**USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs`, the generated `c/*.html` pages, `continuity/items.json`.

**HYGIENE INPUTS** (copied from the kickoff's reads):

- (a) Due rows not bearing on the choice, 1 of 1 due: `W-6` (the report-an-error read window). Its read today: `npm run reports` printed "OUTSIDE ARRIVALS: 0" over 37 issues, reconciling 37 + 0 + 0 = 37. The primer's instruction is to close it on that reading.
- (b) Owed child rows in the orchestrator's ledger: none, from the kickoff read over 798 rows.
- (c) State reads marked as crossed: dated gates due today, 1 of 1 (listed in (a)). Board cards carrying David's word: 5, none new since the last read. Prior-day retro findings: 5 tagged, of which 3 are still on discipline and 2 are carried (one to `A-98`, the row for guarding the scripts that act on import, on 11-13).
