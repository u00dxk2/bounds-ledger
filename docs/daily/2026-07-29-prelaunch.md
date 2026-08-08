---
product: bounds-ledger
date: 2026-07-29
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: bbe7036
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 1
top_action_today: "First green day after the alarm's first real firings — CI clean at the new 110-file mirror, both manual pins read HTTP 200 locally (the /36 page is still untouched), and the David-facing brief now carries the drift news it was missing. Streak day 6/30, ack still 0."
---

# bounds-ledger — daily (prelaunch) — 2026-07-29 (MT)

Lite rail, steward cadence. No self-rating.

## BLUF

**The instrument absorbed two real drifts last night and came back green this morning — verified by log, not
badge.** Scheduled run `30442566840` at `bbe7036` prints exactly the expected shape: `No drift. 110 files match
upstream c4f83863…`, `227 claim(s): 225 hold, 0 broken/unreachable, 2 unverified (manual)`, both self-tests
PASS, and **two** `advisory fetch failed (HTTP 403)` lines — one each under the two `manual: true` claims.
**G-1 — the goal of becoming a reproducible steward of a drifting record — green-streak: day 6 of 30**
(day 1 = 7/24; ends ~8/22).

A local `npm run check` on a residential connection (exit code read from a file, never through a pipe; exit 0)
got **HTTP 200 on both manual claims with both expected strings present**: erdosproblems.com/36 still shows
`0.380876` and still reads `last edited 23 January 2026`. **The page has not been touched since our 24 July
correction** — five days post-send, **external-ack metric still 0**.

One thing shipped: `docs/lane-brief.md` — the David-facing brief — now carries the 7/28 drift news it was
missing. It was the only genuinely stale-in-substance artifact in the lane, deliberately deferred yesterday
for want of session room.

## What changed

**1 — the day's real content was a verification, not a change.** Nothing in `ledger/` moved: no `--snapshot`,
so no post-snapshot re-pin ratchet owed. The correct output of a steward on a no-drift day is a checked box
and a written line, and yesterday's two absorptions are now confirmed stable through a full CI cycle rather
than only through the commit that made them.

**2 — the brief was updated, and framed on the finding rather than the event.** The added block leads with
the fact that **neither** of last night's drifts was a record change — a dead cross-link, a missing character
in a formula, and one *added* constant — and with why that is the more useful result: the temptation with a
"nothing important changed" alarm is to wave it through, and the discipline of verifying against the source
before updating our copy is the only thing that keeps the alarm meaningful. It also states plainly what the
week did **not** move: the /36 page is untouched, so this was the curated table correcting itself, not an
acknowledgement of us. Line 86's older sentence (*"re-checked … on 24 July: no drift, all 109 files
identical"*) was left alone — it is date-anchored and still true; the new block supplies the current numbers.
A bus note follows so the orchestrator re-ports it; **never hand David an artifact link.**

**3 — Codex probed, not used, and the dispatcher's dead-queue signature reproduced.** `codex-cli 0.143.0` is
on PATH (direct path GREEN), while `codex-health` again shows 0 processes against 5 jobs marked "running" and
silent 10.9–68.1h — **all five foreign-workspace, none belonging to this repo**, so nothing here is blocked.
No Codex work was warranted regardless: the whole lane is a few hundred lines of dependency-free Node, with no
≥250-LOC single-context task open.

**4 — flow-craft rotation: honest skip again, same structural reason.** F-2 (*spot-check one claim* — the
outside-researcher flow) still has zero surface, and building one **is** the public-repo flip, which is
David-gated. F-3 (*receive a correction*) remains one sent email whose only open question is the ack watch,
not flow design. Rotation resumes when F-2 has a surface; inventing a critique to fill the slot would be
worse than the gap.

## Inputs (controllable)

- **CI read by log, not badge.** `gh run view 30442566840 --log`, grepped for the drift, claim-count, self-test
  and advisory lines. Both 403 advisories present — the runner-403 fact re-proved for free, as designed.
- **Local check executed, not assumed.** `npm run check` redirected to a file with `$LASTEXITCODE` checked
  separately (0). The pipe-hides-the-exit-code trap has bitten this lane in CI *and* locally.
- **Both manual claims genuinely re-verified this morning** — C-7 (the bound) and C-9 (the page's edit date),
  each HTTP 200 with its expected string present. This is the local-only capability CI structurally cannot
  have, and a local 200 is still **not** evidence about a runner.
- **First full CI cycle over the grown mirror.** Last night's absorption (109 → 110 files, 225 → 227 claims)
  was verified by the commit that made it; today it is verified by an independent scheduled run.
- No code changed; one doc changed (`docs/lane-brief.md`).

## Outputs (lagging)

| Signal | Value | Movement |
|---|---|---|
| Externally-acknowledged corrections | **0** | none — day 5 post-send |
| Green-CI streak (G-1 — the steward goal) | **day 6** of 30 (~8/22) | +1 |
| Claims under re-verification | **227** (225 hold / 0 broken / 2 unverified) | unchanged since last night's absorption |
| Mirror size | **110** files at upstream `c4f8386` | unchanged since last night |
| Stewarded surfaces | 2 | unchanged |
| Page state (erdosproblems.com/36) | `0.380876`, last edited 23 Jan 2026 | unchanged — no maintainer touch |
| Real drifts caught, lifetime | **2** (both 7/28, both editorial) | unchanged |
| Things requiring David | **1** (forward a maintainer reply) | unchanged |

## Recommendation

**Keep doing nothing outward; let the clock run.** Both routes to the north-star metric are parked by David's
own 7/26 decisions — the email is waiting, and the public comment on /36 is approved *in principle only*,
pending his explicit go plus a pre-send read. Neither is mine to advance, and neither should be re-raised.

**On the evangelism read:** this lane has no retention or word-of-mouth instrument **by design** — no users, no
public surface, private repo — so the honest proxy is the external-ack metric, already instrumented as
W-3 — the watch for an acknowledgement of the /36 correction. Both of its page-side legs are mechanical and
were read green today; only the reply leg is human. **The instrument is already standing**, so today's rec is not
"stand one up" — it is that the single surface the lane's only reader actually sees (the hosted brief) is now
current, which is the one comprehension move available pre-launch. The would-tell-a-friend moment — *the alarm
caught a drift the field's own index missed* — has still not occurred; last night's catches were the curated
table fixing itself, which is a working alarm but not a story.



## On hold pending data

- **W-3 — the watch for an acknowledgement of the /36 correction.** Live instrument, no trigger: both page
  legs read green today, reply leg is David's inbox. `signalDate` 2026-09-24 is a **check-in, not a deadline**.
- **The public comment on erdosproblems.com/36** — approved in principle 7/26, explicitly *not now*; David's
  go plus a pre-send read. Do not re-raise.
- **F-2, the spot-check surface** — blocked on the public-repo flip, David-gated; where the core problem lives.
- **Compressing `continuity/items.json`'s closed notes** — optional, surfaced 7/28; rec was leave it, default
  on silence is do nothing.

## State Appendix

| Item | What it is | Status |
|---|---|---|
| G-1 — the goal of becoming a reproducible steward of a drifting record | north-star: externally-acknowledged corrections | open · ack **0** · green-streak day 6/30 |
| A-2 — the re-verification CI standing up the adopted surfaces | 227 claims across 2 surfaces | open · `closeWhen` (drift detection demonstrated) satisfied 7/28; closes with the 30-day streak |
| W-3 — the watch for an ack on the /36 correction | reply leg David's; both page legs mechanical, read green today | open · held, no trigger |
| A-4 / A-5 / A-6 — the alarm-honesty fixes and the second stewarded surface | closed 2026-07-25 | closed |
| A-1 / A-3 / W-2 — reconciliation #1, the sent correction, the Haugland digit | closed 2026-07-22 → 07-24 | closed |

**Ledger:** 227 claims / 225 hold / 0 broken / 2 UNVERIFIED — C-7 the bound and C-9 the edit-date, both
`manual: true`, both on the page that 403s datacenter IPs. Mirror clean at upstream `c4f8386`, 110 files.
**CI:** green, log-verified (`30442566840`). **Local advisory:** both pins HTTP 200 and present.

**Instrument-defect count this week: 5 found, 5 fixed. Real drifts caught: 2** (both 7/28, both editorial,
both absorbed with the full verify → snapshot → re-pin cycle). Nothing new was executed against today beyond
the two checks above.
