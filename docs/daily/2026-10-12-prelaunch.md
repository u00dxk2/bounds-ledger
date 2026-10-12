---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-12
lifecycle_stage: launched
last_deploy: 6cc1076 (the last page-changing push; npm run served read 27 of 27 served at 08:14:51Z on 2026-10-12)
on_hold_items: 1
top_action_today: F-2, a shown bound row reads its source key instead of HTML anchor markup
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-12 (Monday, MT)

## BLUF

Overnight round 5 is choosing its change: 44 of the 115 public rows show upstream's HTML link markup as text where a reader expects a source key like [Bru2002].

## What changed

### Overnight round 5 — P1 selection packet

Phase prompt inbox `5ea6018f` (08:44Z on 2026-10-12, 02:44 MT). The full packet, as posted to the bus, is `tmp/p1-r5-packet.md`. Its substance:

**Outcome:** a researcher reading a bound row sees the number and its source key, not HTML. Flow `F-2` (spot-check one claim).

**Evidence:** 73 shown bound cells on 44 of 115 index rows contain `&lt;a href`, and so do 73 cells on 44 constant pages. Every one of the 130 anchors has exactly the form `<a href="#KEY">[KEY]</a>`. No doc or decision records showing that markup as text. The only rationale for verbatim display is docs/evangelism-bar.md:38-39, which promises the exact pinned string, and the pin itself does not change. Encounter is MISSING (`A-59`).

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `scripts/render-constant-pages.mjs`, `index.html`, `c/*.html`, `docs/key-user-flows.md`.

**HYGIENE INPUTS:** (a) 2: `A-2` and `A-54`, both due 2026-10-12. (b) none: 0 of 749. (c) none crossed: the kickoff state block.

### Overnight round 5 — P3 product work

P1 review: APPROVE (inbox `5183e18d`), with one asked-for red-arm, a non-matching anchor shape staying verbatim.

**Action (improve):** shown bound cells read upstream's citation anchors as their key. Commits: `f09451a` (the change), `11dd2cb` (Codex r5 fixes) and `aad5e7e` (the Codex r6 test fix).

**Implementation:** `npm run verify` exit 0 at `aad5e7e`. It printed "No drift. 116 files match upstream" (an upstream sha, not one in this repo) and "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)". Both page `--check` legs passed. Four red-arms went red as intended. A fifth (feeding the transform into `data-find`) stayed green, which showed that assertion to be an equality pin, and it is now labelled as one.

**Review:** Codex r5 on `f09451a` found MED (the exact pinned string no longer reachable) and LOW (no lower-side case); both fixed in `11dd2cb`. Codex r6 on `11dd2cb`: all 73 exact-row blocks byte-match their pins, plus one LOW fixed in `aad5e7e`.

**Delivery:** `npm run served`: "115 checked — 115 served, 0 in flight, 0 stale, 0 unreachable" (anchor `11dd2cb`). The live index, fetched directly: 230 shown cells, 0 with `&lt;a href`, and 31 sha-pinned history links. The 44 live affected constant pages: 0 such cells, 73 exact-row blocks. CI GREEN for `aad5e7e`.

**Encounter:** blind, bug row `A-59`.

**Outcome:** open.

**Record-facing or instrument-facing:** no catch this round. The work was on the reader's path, not on a record.

### Close — overnight round 5

ACTION: COMPLETED · item F-2 (spot-check flow, rotation 10) · P3 4c12ad51

Manager review of P3 (inbox `7ef3318a`): COMPLETED, no defects. It re-read all 115 live constant pages and the index on its own. This P5 prompt never surfaced in the pane; it was found in the bus file after the retro and close-session prompts.

**Hygiene draft:** 2 lines, 1 accepted · 1 amended · 0 rejected.
- `A-2`: ACCEPTED on its own condition: `npm run verify` at `aad5e7e` printed "No drift."; the helper's own read was a GitHub API 403. Re-dated to 2026-10-19 with `--set`; the read is on `A-2.read2026_10_12`.
- `A-54`: AMENDED. Re-dated `expectedSignalBy` to 2026-10-14 with `--set`, not the drafted `--extend`. The tripwire fired (9 papers against 8 slots through 10-16), so completion is restated from 2026-10-20 to 2026-10-22 in onTrigger and closeWhen, recorded on `A-54.census8Skipped2026_10_12`.

READ-MUTATED: 2, both this lane's own concurrent P3 edit (status `b7ffa0a1`). Wait-justification: "RESULT: PASS — 1 of 93 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". Engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".

**Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned" — snapshot CURRENT (taken 2026-10-12).

**Stated limit recorded (the review's one thing):** the "other anchor shape stays verbatim" guarantee is test-only. All 130 live anchors have the matching shape. Recorded in `docs/key-user-flows.md`, rotation 10.

**Receipt:** unchanged from P3 `4c12ad51`.

**Pending reads:** `A-59` reader encounter, blind (next check 2026-10-28). `A-54` census slot, 2026-10-14. `A-2` drift re-read, 2026-10-19.

### Day session round 1 — P1 selection packet

Kickoff inbox `32ddc6bb`. The full packet as posted is `tmp/p1-d1-packet.md`. In brief:

**Outcome:** a reader weighing 46a's row sees that we ourselves filed an open report upstream against it (issue 218), linked, as the index's notes already promise for every row we have reported. Flow `F-2`, rotation 11.

**Evidence:** `node scripts/check-upstream-reports.mjs` printed "UNRECORDED — issue 218 is ours and has no baseline row" and exited 1. `ledger/upstream-reports.json` records issue 150 only. The live `c/46a.html` carries no disclosure, though it shows the depth audit's [Bo1991] reading. The checker needs `gh` and never runs in CI, so nothing raised this after 218 was sent on 2026-10-07. Out of scope today, as a stated limit: our two merged pull requests (194 on 1a and 1b, 141 on 15a), which the checker cannot see and the "we reported" wording would misdescribe. Encounter is MISSING (`A-59`).

**USER-FACING: yes.** Paths: `ledger/upstream-reports.json`, `index.html`, `c/46a.html`, `docs/key-user-flows.md`.

**HYGIENE INPUTS:** (a) none: 0 dated gates due (live `--print`; the overnight snapshot was not retaken). (b) none: 0 of 749. (c) none crossed: the kickoff state block.

### Day session round 1 — P3 product work

P1 review: APPROVE (inbox `7bc193d7`), with two extras: put the label beside the audit verdict if it is cheap and non-causal, and open a row for the checker that never runs in CI.

**Action (deliver built value):** issue 218's baseline row in `ledger/upstream-reports.json`, every field copied from `gh issue view 218`. The disclosure code already existed and was unchanged. Commits: `57756ec` (the change, with `A-77` opened) and `544c465` (Codex r1's one finding, fixed).

**Implementation:** `check-upstream-reports.mjs` went from "UNRECORDED — issue 218 is ours and has no baseline row" (exit 1) to "RESULT: PASS — 0 transition(s) across 2 recorded report(s)" (exit 0). The re-render changed one line in `index.html` and one in `c/46a.html` and no other page. `npm run verify` receipt: exitCode 0 at `57756ec`, no failed gates; `544c465` after it touches `continuity/` only.

**Review:** Codex r1, read-only, on `57756ec`, banner workdir `C:\dev\skylark\bounds-ledger`. One finding, LOW, STATIC, CONFIRMED: A-77's readCommand claimed "every issue our account filed", but the checker reads one `gh issue list --limit 100`. Fixed in `544c465`. Sibling sweep for the phrase over the tracked repo: 0 further hits.

**Delivery:** CI GREEN for `544c465` on `page-check.yml` and `reverify.yml`. `npm run served`: "2 checked — 2 served, 0 in flight, 0 stale, 0 unreachable" (anchor `57756ec`). Fetched directly, the live index row `c-46a` carries `we reported this row · open` linking issue 218, placed immediately before its existing badge "what we read does not support a claim in a row: … [Bo1991]". The live `c/46a.html` carries the same label under its heading.

**The two extras:** (1) On the index, the label already sits beside the audit verdict, because both render in the row header. On the constant page it sits under the heading, a stated limit: the store keys a report to a file, never to a row. (2) `A-77` opened: the checker has no caller that does not depend on someone remembering, and it cannot see our two merged upstream pull requests.

**Encounter:** blind, bug row `A-59`. **Outcome:** open.

**Record-facing or instrument-facing:** instrument-facing. The defect was in our own disclosure data, and no record moved.

## Inputs (controllable)

Two product rounds overnight on F-2. Two Codex reviews this round (r5, r6) and one in round 4. Red-arms on every new assertion; one (`data-find`) stayed green and was relabelled as an equality pin.

## Outputs (lagging)

Encounter blind (`A-59`). `npm run reports`: 33 raw issues, all ours, 0 outside arrivals (read 2026-10-12).

## Recommendation

Next F-2 rotation: the slowest remaining answer on a constant page, read in a fresh cold walk rather than carried from this one.

## On hold pending data

`A-59`: reader encounter on the public pages, blind (next check 2026-10-28).

## State Appendix

Written at close, from live commands.
