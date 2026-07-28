---
product: bounds-ledger
date: 2026-07-28
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 350a625
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 1
top_action_today: "Covered a two-day gap — no session ran 7/27, and the check proves it cost nothing: both unattended days went green in CI and a local advisory read confirms erdosproblems.com/36 is untouched. Streak day 5/30, ack still 0."
---

# bounds-ledger — daily (prelaunch) — 2026-07-28 (MT)

Lite rail, steward cadence. No self-rating. Covers 7/27 as well — see below.

## BLUF

**No session ran on 2026-07-27** — zero commits that day, and the `/daily` dispatch for it sat queued ~24h
before this pane picked it up. **The lane ran itself anyway, which is the point of it.** Both unattended days'
scheduled runs went green (`30258283202` 7/27, `30349642294` 7/28), and the 7/28 run's **log** — not its badge
— prints exactly the expected shape: no drift at upstream `a002311`, `225 claim(s): 223 hold, 0
broken/unreachable, 2 unverified (manual)`, and **two** `advisory fetch failed (HTTP 403)` lines, one each
under C-7 and C-9. **G-1 — the goal of becoming a reproducible steward of a drifting record — green-streak:
day 5 of 30** (day 1 = 7/24; ends ~8/22).

A local `npm run check` (residential IP, exit 0 read from a file, never through a pipe) got **HTTP 200 on both
manual claims with both expected strings present**: the bound on erdosproblems.com/36 is still `0.380876` and
the page still reads `last edited 23 January 2026`. **The page has not been touched since our 24 July
correction.**

**External-ack metric remains 0**, day 4 post-send. Nothing shipped today beyond one stale-cell correction;
that is the correct output for a lane whose product is an alarm that did not need to fire.

## What changed

**1 — a missed day, and what it did and didn't cost.** The 7/27 gap is worth recording rather than papering
over: the daily *report* is a human artifact and it was skipped, but the *instrument* is a cron and it was not.
The two-day window is fully reconstructable from CI logs plus today's local read, so no verification was
actually lost — the streak is intact and honest at day 5. The only real cost was a day of latency on noticing,
which for a watch whose next check-in is 2026-09-24 is immaterial.

**2 — `docs/key-user-flows.md` had a stale cell.** F-3 (*receive a correction* — the upstream-maintainer flow)
was still listed as "drafted, never exercised." It was exercised on 2026-07-24, when David sent the correction
to the erdosproblems.com maintainer. Corrected to "sent once (2026-07-24); awaiting reply." Small, but this doc
is the flow-craft rotation's own input, and a rotation reading a stale premise is how a critique lands on the
wrong flow.

**3 — flow-craft rotation: honest skip, with a reason.** Rotation is due on F-2 (*spot-check one claim* — the
outside-researcher flow) or F-3. **Neither is critiquable right now and that is a structural fact, not
laziness:** F-2 has **zero surface** — the only way to ask "is this number current?" is to clone a private repo
— and building one *is* the public-repo flip, which is David-gated. F-3 is a single sent email whose only open
question is whether a reply arrives, which is W-3 — the watch for an acknowledgement of the /36 correction —
not a flow-design question. The one flow with a critiquable surface, F-1 (the drift alarm), was rotated 7/24
and its remaining proposals P-2/P-3 are deliberately deferred. **Rotation resumes the moment F-2 has a
surface**; until then the honest output is this paragraph rather than an invented critique.

## Inputs (controllable)

- **CI read by log, not badge.** `gh run view 30349642294 --log`, grepped for the claim-count and advisory
  lines. Both 403 advisories present — the runner-403 fact re-proved for free, as designed.
- **Local check executed, not assumed.** `npm run check` redirected to a file, `$LASTEXITCODE` checked
  separately (0). The pipe-hides-the-exit-code trap has bitten this lane both in CI and locally.
- **Both manual claims genuinely re-verified this morning** — C-7 (the bound) and C-9 (the page's edit date),
  each HTTP 200 with its expected string present. This is the local-only capability that CI structurally
  cannot have.
- No code changed. `ledger/` untouched, no `--snapshot`, so no post-snapshot re-pin ratchet owed.

## Outputs (lagging)

| Signal | Value | Movement |
|---|---|---|
| Externally-acknowledged corrections | **0** | none — day 4 post-send |
| Green-CI streak (G-1) | **day 5** of 30 (~8/22) | +2 (7/27 unattended, 7/28) |
| Claims under re-verification | **225** (223 hold / 0 broken / 2 unverified) | unchanged |
| Stewarded surfaces | 2 | unchanged |
| Page state (erdosproblems.com/36) | `0.380876`, last edited 23 Jan 2026 | unchanged — no maintainer touch |
| Things requiring David | **1** (forward a maintainer reply) | unchanged |
| Daily reports written | 7/27 **missed**, 7/28 written | −1 day of cadence |

## Recommendation

**Keep doing nothing outward. Let the clock run.** Both routes to the north-star metric are parked by David's
own decisions of 7/26 — the email is waiting, and the public comment on /36 is approved *in principle only*,
pending his explicit go plus a pre-send read. Neither is mine to advance.

The pre-launch evangelism read is unchanged and honest: this lane's only user is David, his standing ask is 1
(down from 2 on 7/26), and today added no friction to it. The would-tell-a-friend moment — *the alarm caught a
drift the field's own index missed* — has not occurred, because no drift has occurred.

## On hold pending data

- **W-3 — the watch for an acknowledgement of the /36 correction.** Held, no trigger. Reply leg is David's
  inbox; both page legs are now mechanical and were read green today. `signalDate` 2026-09-24 is a **check-in,
  not a deadline** — closing this watch needs David's word, not the arrival of a date.
- **The public comment on erdosproblems.com/36** — approved in principle 7/26, explicitly *not now*. Do not
  re-raise; it would be this lane's first genuinely public act.
- **F-2, the spot-check surface** — blocked on the public-repo flip, David-gated. This is where the core
  problem actually lives.

## State Appendix

| Item | What it is | Status |
|---|---|---|
| G-1 — the goal of becoming a reproducible steward of a drifting record | north-star: externally-acknowledged corrections | open · ack **0** · green-streak day 5/30 |
| A-2 — the re-verification CI standing up the adopted surfaces | 225 claims across 2 surfaces | open · closes with the 30-day streak |
| W-3 — the watch for an ack on the /36 correction | reply leg David's; both page legs mechanical, read green today | open · held, no trigger |
| A-4 / A-5 / A-6 — the alarm-honesty fixes and the second stewarded surface | closed 2026-07-25 | closed |
| A-1 / A-3 / W-2 — reconciliation #1, the sent correction, the Haugland digit | closed 2026-07-22 → 07-24 | closed |

**Ledger:** 225 claims / 223 hold / 0 broken / 2 UNVERIFIED (C-7 the bound, C-9 the edit-date — both
`manual: true`, both the same page that 403s datacenter IPs). Mirror clean at upstream `a002311`.
**CI:** green ×2, log-verified. **Local advisory:** both pins HTTP 200 and present.

**Instrument-defect count this week: 5 found, 5 fixed, 0 drifts** — unchanged; nothing new was executed
against today beyond the two checks above.
