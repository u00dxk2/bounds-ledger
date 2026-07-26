---
product: bounds-ledger
date: 2026-07-26
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: dd01132
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 1
top_action_today: "Retired one of the two standing asks on David — the page-watch leg is now mechanical (claim C-9 pins the page's last-edited date), leaving the maintainer's reply as the only thing that still needs him"
---

# bounds-ledger — daily (prelaunch) — 2026-07-26 (MT)

Lite rail, steward cadence. No self-rating.

## BLUF

**David's standing ask on this lane just halved, and it was verified by execution rather than argued.** The
brief he reads said two things needed him: forward any maintainer reply, and glance at erdosproblems.com/36 by
hand now and then. The second is obsolete — since 7/25 the block on that site is known to be IP-dependent, so a
local run genuinely reads the page. Today the *second* page signal was pinned too (**C-9**, the page's
`last edited 23 January 2026` string), so **both page-side triggers of the north-star watch are now read by any
local `npm run check`.** Only the reply still requires him.

**Overnight CI green, log read not badge**: no drift (109 files match upstream `a002311`), `224 claim(s): 223
hold, 0 broken/unreachable, 1 unverified (manual)`, and under C-7 the expected
`advisory fetch failed (HTTP 403) — expected from datacenter IPs (CI)`. **G-1 green-streak: day 3.**

**External-ack metric remains 0.** The page has not moved (checked twice today, HTTP 200, both pins present)
and no reply has arrived. Today bought cadence on the watch, not the ack.

## What changed

**1 — C-9 pins the second page signal (`ledger/claims.json`, ledger now 225 claims).**
C-7 pins the *bound*, so it catches the correction landing as a value change. C-9 pins the *last-edited date*,
which catches the maintainer touching the page at all — a note, a restructure, a citation added. That is
ack-adjacent evidence C-7 alone cannot see, and it completes the three trigger conditions on W-3 — the watch
for an acknowledgement of the /36 correction.

**This is not the thing that was reverted on 7/25, and the difference is the entire point.** A pin on this same
date briefly existed as C-8 that day and was *fetchable*; CI runners got 403, reported UNREACHABLE, and the
build went red. C-9 is `manual: true`, so it reports UNVERIFIED and never touches counts or the exit code. The
lane's rule — don't re-automate C-7 on the strength of a local 200 — is intact and was not tested against.

**2 — the David-facing brief was wrong and is corrected** (`docs/lane-brief.md`). It still instructed him to
watch the page by hand. A brief that overstates what the reader must do is the same class of defect as one that
overstates what we verified: unfalsifiable from his side. Corrected, with the retired ask shown as retired
rather than silently deleted.

**3 — adversarial review of that refresh** (`docs/decisions/2026-07-26-lane-brief-refresh-adversarial-review.md`).
Five angles, **four landed** against my own draft: an overclaimed cadence ("automatically whenever an agent
works this lane" → it runs only when someone runs the check), an understatement of what David still owns (the
public-comment decision is his), "strictly better than screenshots" promoting a cadence win into an evidence
win, and a "never will" prediction about a third party's server config. The mandatory method-sentence angle —
the 7/24 rule — is what caught the first.

## Inputs (controllable)

- **Executed both directions, not read.** Green run prints `HTTP 200, expected "…" still present`. Negative
  control with the date mutated to 24 January prints `NOT FOUND — hand-verify now and follow the claim's watch
  runbook`. `git diff` confirmed the mutation landed before the result was believed — the CRLF no-op trap that
  produced a false verdict on 7/25.
- **Exit codes never read through a pipe** — every run redirected to a file, `$LASTEXITCODE` checked separately.
- `npm test` 3/3 PASS. `npm run check` exit 0 at 225 claims. Continuity check: **OK, 0 WARN**.
- **Inherited claims re-verified rather than trusted**: the A-6 phase-0 finding that bounds are absent from
  `teorth/erdosproblems` is repeated in the brief, so it was re-fetched today — all five relevant values absent,
  entry 36 still `open`/`prize: no`.

## Outputs (lagging)

| Signal | Value | Movement |
|---|---|---|
| Externally-acknowledged corrections | **0** | none — sending ≠ ack (day 2 post-send) |
| Green-CI streak (G-1) | **day 3** of 30 (~8/22) | +1 |
| Claims under re-verification | **225** (223 hold / 0 broken / 2 unverified) | +1 (C-9) |
| Stewarded surfaces | 2 | unchanged |
| Page state (erdosproblems.com/36) | `0.380876`, last edited 23 Jan 2026 | unchanged |
| Things requiring David | **1** (was 2) | −1 |

The last row is the only one that moved by choice today. The two UNVERIFIED claims are both by design and both
the same blocked page — an increase in that count is not a regression in honesty, it is one more thing watched.

## Recommendation

**Do nothing outward. Keep the streak.** The lane's north-star is an external acknowledgement, and both
available routes are either waiting (the email) or David-gated (a public comment). The correct move on day 2
post-send is to keep the instrument honest and let the clock run.

Toward the pre-launch evangelism analog — *does the first-run journey earn a would-tell-a-friend moment* — the
honest read is that this lane's "user" is currently David, and today's move was aimed exactly there: it removed
a recurring chore from the one person who reads its output. That is the pre-launch shape of reducing friction.

## On hold pending data

- **W-3 — the watch for acknowledgement of the /36 correction.** Reply leg is David's inbox; nothing to do but
  wait. The `~2026-08-24` no-response close date remains **recommended, not David-confirmed** — raise it with
  him, do not decide alone. The fallback at that point is a public comment on the problem page (community-
  sanctioned venue), which is outward contact: adversarial review plus his send gate.

## State Appendix

| Item | What it is | Status |
|---|---|---|
| G-1 — the goal of becoming a reproducible steward of a drifting record | north-star: externally-acknowledged corrections | open · ack **0** · green-streak day 3/30 |
| A-2 — the re-verification CI standing up the first adopted surface | now 225 claims across 2 surfaces | open · closes with the 30-day streak |
| W-3 — the watch for an ack on the /36 correction | reply leg David's; **both page legs now mechanical** | open · held, no trigger |
| A-4 / A-5 / A-6 — alarm-honesty fixes and the second surface | closed 2026-07-25 | closed |
| A-1 / A-3 / W-2 — reconciliation #1, the sent correction, the Haugland digit | closed 2026-07-22 → 07-24 | closed |

**Ledger:** 225 claims / 223 hold / 0 broken / 2 UNVERIFIED (C-7 bound, C-9 edit-date — both `manual: true`,
both the same 403-from-datacenter page). Mirror clean at upstream `a002311`. **CI:** green, log-verified.

**Instrument-defect count this week: 5 found, 5 fixed, 0 drifts.** Every one was caught by executing the
deployed thing, never by reading it. Today's negative control is that discipline applied before shipping rather
than after.
