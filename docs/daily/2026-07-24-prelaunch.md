---
product: bounds-ledger
date: 2026-07-24
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 1f08828
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 1
top_action_today: "Caught + fixed a defect that made the drift alarm fake — piped steps masked exit codes, so CI was green-by-construction and would never have filed a drift issue; G-1 green-streak clock restarts today"
---

# bounds-ledger — daily (prelaunch) — 2026-07-24 (MT)

Lite rail. Not parked after all: the day's first-action check turned up a defect in the alarm itself.

## (1) Real-user signal

**Metric: drift catches + externally-acknowledged corrections. Value: 0 external acks, 1 confirmed catch (unreported).** Source: `continuity/items.json` + `ledger/claims.json` re-run live today — durable, in-repo, not ephemeral.

Live check re-run 13:26Z: mirror **no drift**, 109 files match upstream `a002311`. Claims: **6 HOLD, 0 broken, 1 UNVERIFIED** (C-7 erdosproblems.com — `manual: true`, reports UNVERIFIED by design because the site 403s bots; hand-verified 2026-07-23 and unchanged since).

Honest statement of the gap: there are **no real users** and no surface for one — the repo is private and the only way to consume the ledger is to clone it and run `npm run check`. The 0 is real, not a measurement failure.

## (2) Launch-readiness checklist

Against the pre-launch spine:

| Spine gate | State |
|---|---|
| 1. Core problem + would-tell-a-friend moment named | **done** — "I cited a number, I don't know if it's still current" / "the ledger caught a drift the field's own index missed" (`docs/key-user-flows.md`, built today) |
| 1. Instrument the metric | **done today, and only today** — the instrument existed since 7/23 but was not actually armed (below) |
| 2. persona-sprint / e2e | **n/a so far** — no browser surface exists to test (F-1 terminates in a GitHub issue, audience of one) |
| 3. real users at the moment | **0** — blocked behind the private repo + the A-3 gate |
| 4. free distribution | not started (gated on the public flip) |
| 5. paid | not started, correctly |

Project gates: G-1 open (30-day green-CI streak, **clock restarts today** — see below); A-2 live and now genuinely armed; A-3 gate-1 cleared today, gate-2 with David.

### The catch: the drift alarm was never armed

Today's first-action was "check the overnight CI." It was green — run 30084664345, 15s. It would have been green through a real drift.

Both live checks piped into `tee`, and the Actions **default** shell is `bash -e {0}` with **no `pipefail`** — so the step reported `tee`'s exit 0, the job passed, and `if: failure()` never fired, meaning **no drift issue would ever have been filed**. Verified two ways, not inferred: the run's own log prints `shell: /usr/bin/bash -e {0}`, and `bash -e -c 'node -e "process.exit(1)" | tee -a /dev/null; echo $?'` prints `0` locally.

The existing synthetic-drift self-test passed every run and could not have caught this — it tested the *script's* exit code, never the *workflow's* consumption of it. The bug lived in the seam.

Fixed (`shell: bash` on both piped steps) and guarded: `reverify.test.mjs` now asserts every piped workflow step declares `shell: bash`, network-free, every run. Negative control performed — deleting one `shell: bash` makes the self-test exit 1 and name the offending step. Finding: `docs/findings/2026-07-24-drift-alarm-was-never-armed.md`.

**Consequence:** the two green days claimed toward G-1 carried no information. The streak clock **restarts 2026-07-24**.

### Flow-craft (rotation 1 — F-1, the drift alarm)

`docs/key-user-flows.md` built today: core problem in the user's words, 3 flows, F-2 ("is the number I'm about to cite current?") identified as having **zero surface** — that's where the core problem lives, and closing it is the public-repo flip, which is David-gated. Not a micro-fix; not shipped.

Critiqued F-1 and filed 3 before→after proposals — P-1 title names the drift (recognition over recall: today every alarm is titled identically, so the title carries no information); P-2 verdict before diff (progressive disclosure); P-3 one rolling issue instead of a daily pile (Hick's law). All three are small and reversible, all three **held** — David held new work on this lane 7/23, and the day's budget went to the alarm being fake. P-1 first on greenlight.

## (3) One next action

**Get David's answer on the A-3 outward-send gate.** The blocker on the blocker was that no ask existed — the decision sat in a repo file with no channel to David. Fixed today: gate-1 (adversarial refute-it review) is now **complete**, and the gate-2 decision card is filed (board `83d32495`, reply-target `bounds-ledger`, so the answer lands in this pane).

The review did real work rather than rubber-stamping: it **sustained two objections** and amended the draft. It killed the 0.380871 line — its curated citation `[T2026]` resolves to a GitHub README, not a paper, and naming "EinsteinArena" points the maintainer at an unvetted ≈0.3808591 leaderboard value we explicitly do not endorse (that would have been our own curated-vs-live-never-blend convention violated in our first outward artifact). It also reframed the subject from "you're out of date" to a neutral FYI. The core fact — 0.380876 superseded by the curated, paper-cited 0.380868, bracket `0.379005 < c < 0.380868` — survived all five refutation angles and re-verified clean today. Review: `docs/decisions/2026-07-24-A3-adversarial-review.md`.

Nothing was sent. No contact made.

## (4) Cost + error health

$0 spend — no paid APIs, no hosting, no dependencies (Node stdlib + `fetch`). No Sentry project (no app surface). CI: 7 runs, all ≤15s, well inside free minutes. Nothing to flag.

## (5) Open David-decision

**A-3 — send the erdosproblems.com/36 correction, or keep holding?** Board card `83d32495-7ea4-4586-8342-cd23d0c80f13`, reply `SEND` / `HOLD` / `NO-REPORT`.

Both preconditions on the lane's side are now met: staleness hand-confirmed (David's 7/23 screenshot) and the adversarial review cleared with amendments. The only thing left is the outward-send gate, which is David's alone. This is the lane's sole path to its first external acknowledgement — the metric that is currently 0 and is the whole point of G-1.

One condition attached: if the gate opens after 2026-07-30, the page state needs re-confirming by hand first (the site 403s bots, so C-7 cannot age gracefully on its own).
