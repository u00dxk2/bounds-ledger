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

## Inputs (controllable)

Pending this round's close.

## Outputs (lagging)

Pending this round's work.

## Recommendation

Pending this round's work.

## On hold pending data

`A-59`: reader encounter on the public pages, blind (next check 2026-10-28).

## State Appendix

Written at close, from live commands.
