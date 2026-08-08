---
product: bounds-ledger
date: 2026-07-25
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 2c93cd4
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 1
top_action_today: "First scheduled green of the genuinely-armed alarm — 223 claims exercised (222 hold, 0 broken, 1 unverified by design), no mirror drift; the streak is now accruing real information"
---

# bounds-ledger — daily (prelaunch) — 2026-07-25 (MT)

Lite rail, steward cadence. Report adopts the canonical H2 set as of today (see § What changed).

## BLUF

**The overnight scheduled run is the first green that carries information, and it is green.** Run `30153551921` (09:54Z, `event: schedule`) exercised all **223 claims — 222 hold, 0 broken/unreachable, 1 unverified** (C-7, `manual: true`, UNVERIFIED by design) — and found **no mirror drift** (109 files match upstream `a002311`). Both selftests passed, including the guard asserting every piped workflow step is pipefail-protected. **G-1's real green-streak clock is at day 2** (day 1 = 2026-07-24).

Nothing else moved, correctly. W-3 — acknowledgement of the erdosproblems.com/36 correction — is David-owned on both legs and stays held. **External-ack metric remains 0.** No code shipped today; steward cadence means the day's deliverable is a verified instrument reading, not a diff.

## What changed

**A verified reading, not a badge.** This lane's founding defect was a green CI that was green-by-construction, so a green badge is not evidence here. I pulled the run log rather than the conclusion field. It confirms the four things that make the green meaningful:

| Check | Result |
|---|---|
| Mirror diff | No drift; 109 files match upstream `a002311f9b6b693d0907e04fe9484bb978dadd05` |
| Claim re-verification | 223 claims: **222 hold, 0 broken/unreachable, 1 unverified (manual)** |
| `reverify.test` selftest | PASS — synthetic drift in `10a.md` detected, pristine copy clean, **5 workflow steps, piped steps pipefail-guarded** |
| `check-claims` selftest | PASS — 4 matcher cases + empty-body guard |

This is also the first scheduled run to exercise the extended pin set — the 216 generated pins shipped 7/24 evening had only been run on push until now. 222/222 fetchable claims holding across Tao-at-HEAD, arXiv, ar5iv and Wikipedia is the pin extension's first unattended confirmation.

**Report format: canonical H2 set adopted (decision).** Yesterday's close-out left an open question — the lane's numbered prelaunch format FAILs the portfolio report-shape linter (BLUF not first, no State Appendix), and the choice was adopt-or-waive. Adopted, at zero cost: the canonical sections (BLUF / What changed / Inputs / Outputs / Recommendation / On hold pending data / State Appendix) carry this lane's content without loss, and the linter normalizes synonyms anyway. The reasoning is this lane's own thesis applied to itself: **a permanently-red linter gets ignored exactly like a permanently-green alarm carries no information.** Leaving a known-failing check failing forever is the same defect class the lane exists to catch. No waiver field needed.

**Continuity health: OK** (6 items, 18 commits checked). One informational `MODIFIED_ITEM_LAST_24H` on W-3 — that is yesterday's close-out adding W-3's `onTrigger` runbook (`6697cad`), a deliberate documented change, not scope drift. No new WARN classes fired.

## Inputs (controllable)

- **Instrument coverage:** 223 claims across 109 constants + the mirror diff. Both halves of the check run in CI (mirror diff catches in-repo movement; `check-claims` catches cross-surface divergence — the lane's founding finding).
- **Alarm legibility:** shipped 7/24 (`df1e226`) — code-fenced issue body, drifted filename in the title. P-2 (verdict-before-diff) and P-3 (one rolling issue) remain deliberately deferred; they only pay on a multi-day real drift, and no real drift has occurred.
- **Post-snapshot ratchet:** discipline is documented in CLAUDE.md — after any `--snapshot`, re-run `extract-pins.mjs` and commit. Untested in anger; the first real drift will be its first exercise.
- **Not controllable and correctly not attempted:** re-fetching erdosproblems.com. It 403s bots; a 403 proves nothing.

## Outputs (lagging)

**Metric: externally-acknowledged corrections/confirmations. Value: 0.** Source: `continuity/items.json` (W-3) — durable, in-repo.

One correction has been *sent* (A-3, emailed by David 2026-07-24 to the erdosproblems.com maintainer). Sending is not acknowledgement; the 0 is honest. Leading indicator — confirmed drift catches — stands at 1 (the erdosproblems staleness, found 7/22), still the only one.

There are **no users and no consumption surface**: the repo is private, and the only way to read the ledger is to clone it and run `npm run check`. `n_active_users_28d: 0` is a real zero, not a measurement gap. The public flip is the gate and it is David-gated.

**Green-streak ledger for G-1:** day 1 = 2026-07-24, day 2 = 2026-07-25. 30-day target lands ~2026-08-22, assuming no legitimate drift resets attention (a drift is not a streak break — it is the instrument working).

## Recommendation

**Hold steward cadence; ship nothing.** The instrument is armed, verified, and covering all 109 constants; both open items — G-1 (the 30-day green-CI streak) and W-3 (the watch for external acknowledgement) — advance by *elapsed time and external response*, not by our commits. The highest-value action today was confirming the green is real, and it was done.

North-star note per the standing reminder: the binding constraint is retention/word-of-mouth, and this lane has **no instrument for it yet by design** — pre-launch, private, audience of zero. The move is therefore to stand the instrument up, not to write a funnel rec, and the instrument in question is the **public status surface**, which is gated behind the David-owned public flip. Not something to force. The nearest legitimate proxy — external acknowledgement (W-3 — the watch on the erdosproblems maintainer's response) — is already instrumented and already the north-star metric.

The one thing I would flag as worth doing *when* it becomes cheap: P-2/P-3 alarm polish is deferred correctly, but the post-snapshot pin ratchet has never actually run. If the streak reaches ~2 weeks with no real drift, a deliberate rehearsal (snapshot a synthetic upstream change, run the ratchet, revert) would be worth more than another week of unexercised green. Not today.

## On hold pending data

- **W-3 — acknowledgement of the erdosproblems.com/36 correction.** Both legs need David by necessity: the site 403s automated fetch (C-7 stays `manual: true`), and any maintainer reply lands in David's inbox. Ask stands: forward/paste any reply, and re-check the page by hand periodically. The `onTrigger` runbook in `continuity/items.json` is written, so when evidence arrives the response is mechanical. **Do not substitute an agent fetch for either leg.**

## State Appendix

**Items:** G-1 (GOAL: steward a drifting record inventory) open — real green-streak day 2, external-ack 0 · A-1 (min-overlap reconciliation) closed 7/22 · A-2 (re-verification CI) open — live, genuinely armed, 223 claims · A-3 (report erdosproblems staleness) closed 7/24 on send · W-2 (Haugland final digit) closed 7/23 — rounding convention · W-3 (watch for the correction's acknowledgement) open — David-owned both legs.

**Today's commands run:** `gh run list` / `gh run view 30153551921 --log` (first-action CI check), `continuity-check.mjs` (OK), `codex-health.mjs` (exit 0).

**Pre-flight:** Codex **GREEN** (codex-cli 0.143.0; 0 stuck/orphan/zombie). CI **green** on `main`. Listener 🟢 SSE alive + `/loop-tick 2m`. Cold-start primer `docs/cold-starts/2026-07-25.md` read first.

**Don't-touch (carried):** no hand edits to `ledger/` (machine mirror, `--snapshot` only); no "upgrade" of generated pins to record-row claims (listing-position is a deliberate call); no self-rating (lite rail has no rating contract — `/daily-close` skipped); P-2/P-3 stay deferred.

**Model-upgrade observation (Opus 5, day 1):** nothing re-calibrated, per instruction. One honest note: a single steward-cadence session is too thin a sample to claim a behavior delta, and I decline to report one. The only observable worth recording is that the session batched independent pre-flight probes (CI + Codex, primer + items) into parallel calls rather than serially — whether that is a model delta or task shape, one day cannot distinguish.
