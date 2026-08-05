---
product: bounds-ledger
date: 2026-08-05
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 3dba7cd
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "The correction-shaped PR channel had no target since 2 August. It now has ten, across six mirrored files, all of them citation keys used on a page that the same page never defines. The recommended target is 15a.md alone, the matrix multiplication exponent, which carries five of them. Nothing drafted and nothing sent - a PR is outward contact and still owes an adversarial review and David's gate. The scan reported 532, then 41, then 36, then 6, and the first three counts were my own parser rather than the repo."
---

# bounds-ledger — daily (prelaunch) — 2026-08-05 (MT)

Paced rail, day 4. Steward cadence first, then the launch increment. No self-rating.

## BLUF

The lane's one actionable channel to its north star had no target, and now it has ten.

A-13 note5 recorded on 2 August that the three named first-PR candidates all merged hours before we could replay them, leaving the correction-shaped-PR route live but pointing at nothing. Today it points at **ten citation-key defects across six of the 111 mirrored files** — a key cited as `[Tag]` in a bounds table or in prose that the page's own References section never defines. Nine are one-to-one near-miss pairs, which is the fingerprint of a transcription slip rather than a missing source. The recommended target is **`15a.md`, the matrix multiplication exponent, which carries five on its own** and is one of the most consulted pages in the inventory.

**Nothing was drafted and nothing was sent.** Selecting a target needs no gate; a PR is outward contact and still owes an adversarial review and David's approval.

Steward cadence green, read from the log and not the badge: **no drift at `dee1660`, 229 claims / 227 hold / 0 broken / 2 UNVERIFIED by design. G-1 — the steward-credibility goal — is at green-streak day 13 of 30.** Both legs of W-3 (the watch for a reply to the 24 July email) read clean from this machine: the page still shows 0.380876 and still says last edited 23 January 2026. No acknowledgement. The north star stays at 0.

The scan that found the ten was wrong three times first. It reported 532 defects, then 41, then 36, then 6 — and the first three numbers were my parser, not the repository. The corpus writes references three different ways and I had matched one of them. What caught it each time was the ratio: 41 of 111 files carrying basic citation breakage in an inventory curated by Terence Tao was never a plausible reading, and a genuine rename defect always leaves a **pair**, so every file reporting defects with no orphaned partner was a tell. Suspect the instrument before the record, for the fourth time this week.

## What changed

- **Finding: `docs/findings/2026-08-05-citation-key-integrity-first-pr-targets.md`** — the target set, the per-file verification, the direction-of-fix analysis, and the three-times-wrong instrument history, with the scanner source pasted in so the result is reproducible.
- **A-13 note10** — closes the gap note5 opened. Records the ten targets, the recommended single-file scope, and the reason the scanner was not committed.
- **No ledger state moved.** No drift, no snapshot, no claims touched, no pins regenerated. The mirror stands at `dee1660`, 111 files.

## Inputs (controllable)

- **Steward cadence, run first as always.** Overnight scheduled run `30996257546` read by log, not badge: `No drift. 111 files match upstream dee1660…`, `229 claim(s): 227 hold, 0 broken/unreachable, 2 unverified (manual)`, the two expected `403` advisory lines for C-7/C-9, and the brief job logging that it is not runnable from CI and is deliberately filing nothing. Local `npm run check` with `CC_PROMPTS_PIN` set: green, both advisory legs HTTP 200 and unchanged, brief in sync on all four dated blocks.
- **Launch increment: first-PR target selection**, the highest-value unblocked work in the lane now that A-13's review gate is clear. Aimed deliberately at the defect class upstream has already shown it accepts fixes for — both real drifts the mirror has caught were editorial, not numeric.
- **Direction of fix was analysed per page rather than assumed**, and it is not uniform. Within `15a.md` alone, the table is the outlier for three keys and the reference list is the outlier for a fourth. A patch that pushed all ten one way would be wrong in at least two places. That is the review's job, and it is why no draft exists today.
- **The scanner was deliberately not committed.** Committing it makes it a detector, which under W-4 — the watch requiring every detector to prove it can both fire and stay silent — owes a both-sides demonstration, and a sixth `--selftest` in `package.json` fails `reverify.test.mjs` until a matching CI step exists. That is a real feature, not a selection increment.

## Outputs (lagging)

- **North star — externally-acknowledged corrections: 0.** Day 12 since the 24 July email. No reply. Both page legs unchanged.
- **G-1 green streak: day 13 of 30.** CI green at `3dba7cd`, log-verified.
- **Ledger: 229 claims / 227 hold / 0 broken / 2 UNVERIFIED** (C-7 and C-9, both by design, both the same blocked page) over a 111-file mirror.
- **Open GitHub issues: 0. Open continuity items: 9.**

## Recommendation

**The flip decision goes to David tomorrow, 6 August, at streak day 14, as already planned — and F-1 must be on it.** Nothing about today changes that, and no separate card should be filed; A-7 note3 is explicit that a redundant card is the wrong move. We hold no recommendation on F-1 itself. The email was his.

For the lane's own next increment: **the first-PR draft for `15a.md`**, which now has a target and needs the adversarial review before anything else. Re-run the scan immediately before drafting — upstream pushes near-daily and the last three targets went stale inside a day.

## On hold pending data

- **W-3** — the reply leg. Not ours to force; David's inbox, his standing word is wait. The page leg is read by any local `npm run check` and was clean today.
- **A-7** — the fleet-coordinated engineering-health wave; this lane must not fix ahead of it. R6 push protection stays deliberately uncarded, re-arming only if the flip is declined or unresolved by ~16 August.
- **A-11** — pin-a-negative for the two structured off-mirror sources, still open and unblocked.
- **W-5** — the mirror blind class on upstream's unmirrored `README.md`. Read its `onTrigger` before adopting; the right shape is likely A-6's entry-level pins, not a byte mirror of a 421KB generated file.

## State Appendix

- **Mirror:** 111 files, clean at upstream `dee1660`. No snapshot taken today; no pins regenerated.
- **Claims:** 229 total — 220 generated (`pin:<file>:U|L`) + 9 hand (C-1…C-9). 227 hold, 0 broken, 2 UNVERIFIED.
- **CI:** `reverify` green at `3dba7cd`; scheduled run `30996257546` log-read this morning. 5 self-tests, 9 workflow steps, piped steps pipefail-guarded.
- **G-1 — the goal of becoming a reproducible steward of a drifting record inventory:** green-streak day 13 of 30, external acknowledgements 0.
- **W-3 — the watch for acknowledgement of the erdosproblems.com/36 correction:** open, both page legs clean from this machine, reply leg outstanding at day 12.
- **A-13 — the launch critical path and public-flip package:** package complete, package-level review done, decision with David tomorrow. note10 added today.
- **W-4 — the watch requiring every detector to demonstrate both answers, that it fires when the condition is present and stays silent when it is absent:** applied today as the reason the scanner stayed out of `scripts/`.
- **Known and unfixed, deliberately:** `docs/lane-brief.md` fails `check-david-voice.mjs` with 2 jargon BLOCKs and 2 em dashes. The em dashes are the documented carve-out — the verbatim quote of David's 24 July email, where byte-fidelity beats style. The brief was not edited today.
