---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-02
lifecycle_stage: launched
last_deploy: not re-read at P1 (release: npm run served)
on_hold_items: 0
top_action_today: A-64, the desktop index hides both bound columns; then A-54 census session 4
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-02 (prelaunch report)

## BLUF

Written at P1; the close rewrites it. Yesterday's change to the front page broke it on desktop screens: the two columns of numbers are pushed off to the right and a visitor sees only names. Today we fix that first, and make the "line N" links on each constant's page land on the row they name. After that we read the next batch of Ramsey-number papers against the survey.

## What changed

Nothing yet. Written at the close.

## Inputs (controllable)

Written at the close.

## Outputs (lagging)

Written at the close.

## Recommendation

Written at the close. Tomorrow's order lives in the primer.

## On hold pending data

Written at the close.

## State Appendix

### Selection packet (P1 — evidence and choice)

**Outcome:** on a desktop screen the index shows both bound columns again, and "line N" lands on the row a verdict names. Item `A-64` (on a desktop screen the index hides both bound columns behind a sideways scroll), minted today at P1.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." A citer who opens the index on a laptop to look up their number now sees a name and a badge and no number at all.

#### Evidence

- OBSERVED — the lane's own browser read of the live index at about 2026-10-02T06:19Z (`playwright-cli`, viewport 1440×900, page at `89bda4a`): column widths 1055 / 81 / 81 / 253; scroll box 1058 visible against 1471 of content; widest badge 1031 across 34 badges. Population: one page, one viewport. Limit: 390 wide was not re-measured by this lane today.
- OBSERVED by the orchestrator's cold walk, not re-run here (`skylark-site/docs/walks/2026-10-02/bounds-ledger.md`, a synthetic walk, not a real-user encounter): the page at `f2683e7` measured 478 / 127 / 200 / 253 with no sideways scroll; the phone is unaffected (innerWidth 393, scrollWidth 393); "line 18" on c/22a.html opens GitHub's rendered view at the top of the file with nothing highlighted.
- HYPOTHESIS on cause, from reading `scripts/render-site.mjs` lines 602 to 608: `.read`, `.ours` and `.tried` carry `width:max-content;max-width:100%`, and a percentage max-width does not limit what a table cell asks for, so the longer badges from `A-62` (the index read badge names its row, closed 2026-10-01) set the name column's width. Not proven until a change moves the measured widths.
- OBSERVED — `scripts/render-constant-pages.mjs` line 515 emits the line link as `#L<N>` with no `?plain=1`.
- OBSERVED — `npm run reports` (exit 0, today at P1): 0 outside arrivals of 32 raw issues, parts reconcile 32 + 0 + 0 = 32. It counts filed issues on github.com, never page readers.
- OBSERVED — `npm run verify`: receipt `exitCode` 0 at `89bda4ab42cfdce99f81607c02c6755200d33dcd`, stamped 2026-10-02T06:18:54Z. Its claims leg printed "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)." The brief leg read UNVERIFIABLE, which is excluded from the exit code and never a pass.
- OBSERVED — `check-ci-status --workflow reverify.yml`: GREEN at `89bda4a`, HEAD equal to origin/main. Deployed-sha drift: NOTHING SWEPT, this lane has no Render service and appears in none of the checker's blocks.
- OBSERVED — `check-cycle-rotation --lane bounds-ledger` (exit 0): "no product-love cycle picks this lane today".
- MISSING — any read of a real person meeting the broken index. The page is static with no analytics by design (`A-59`, the encounter read, dated 2026-10-28).
- Prior-day retro findings, from the kickoff's quoted lines: none has recurred so far today. The one that bears on this work is the verify receipt and a working tree that changes during the run; no code-shaped file was edited while today's verify ran.

#### Permission

- Lane-authorised: a repair to the lane's own public page, directed by the orchestrator's lead. `index.html` and the `c/` pages are not under the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html` until the `A-54` rebuild (the Small Ramsey Numbers census) lands. No board card is open (`answered-cards`: none).
- Outward gate: none touched beyond the ordinary Pages publish. The change gets a review from the other model family before its push.

#### Next action

Kind: **investigate a user failure**, then improve. First command, the baseline on a clean tree:

```
node C:/dev/skylark/bounds-ledger/scripts/render-site.mjs --selftest
```

#### Acceptance condition

On the live index at 1440 wide the scroll box's content width equals its visible width and each bound column is at least 120px. At 390 wide the page still has no sideways scroll. Every "line N" link on the constant pages ends `?plain=1#L<N>`, held by a selftest with both answers recorded, and one such link opened on GitHub shows the code view with that line highlighted.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, then the same browser read at 1440 and at 390 on the live page.
- Encounter: blind (`A-59`). The event that would appear is an outside issue filed through a per-row link, counted by `npm run reports`; it is readable at N = 1.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `scripts/render-constant-pages.mjs`, `index.html`, and every `c/` page that carries a line link (count read at render).

#### HYGIENE INPUTS

- (a) due rows not bearing on the choice: 1 — `A-54` (the Small Ramsey Numbers census, `expectedSignalBy` 2026-10-02). It is today's second action, after `A-64`: census session 4, tripwire first. `node scripts/ds1-depth.mjs` read "census: 31 of 122 bound(s), across 19 of 42 credited paper(s)" at P1.
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 739 considered".
- (c) state reads marked CROSSED: none — read all 13 kickoff state reads. Two could not be judged and are not zeros: missingLinkedCommits "NOTHING SWEPT (0 of 0 considered)", and key numbers "no list yet".

### Section 0

- Primer: `docs/cold-starts/2026-10-01.md` read whole; no file exists for 2026-10-02.
- Listener: 🟢 SSE alive (restart 2026-10-02T06:14:21Z, hello 06:14:28Z, slug bounds-ledger), wake loop armed by tool call, waker ranks 1 to 3 running.
- Codex: GREEN per the kickoff's probe line (real exec 2026-10-01T22:18Z). Not re-probed at P1.
- CI: GREEN at `89bda4a`. Drift: NOTHING SWEPT.
- Harness: running 2.1.287 · fleet UNIFORM · installed 2.1.287 (SAME).
- Recs yesterday: census session 4 on `A-54` → carrying today, P3, after `A-64`. `A-47` (the depth audit) slice 12 → carrying, dated 2026-10-03. Decide `A-62` by 2026-10-06 → executed (closed in round 2, commit `69f4160`).
