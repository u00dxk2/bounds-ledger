---
product: bounds-ledger
date: 2026-07-31
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: ff476c2
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "Applied KP-78 to every detector in the lane. Demonstrated the pipefail guard's fire side for the first time (the one prior attempt produced a FALSE inert verdict), and built a detector that did not exist — A-8's own fix was a hand-added CI step nothing asserted. ff476c2, CI green. Streak day 8/30, ack still 0, page still untouched. Brief re-port has now failed to land for a SECOND day."
---

# bounds-ledger — daily (prelaunch) — 2026-07-31 (MT)

Lite rail, steward cadence. No self-rating.

## BLUF

**The lane audited its own instruments and found the gap was in yesterday's fix, not in the instruments.** KP-78
— the portfolio rule filed overnight, *"a clean reading from a detector never shown capable of a dirty one is
decoration"* — applies to almost everything here, since this lane ships little but detectors. Audited all four
by executing. Two were already two-sided by construction. The **pipefail guard's fire side had never been
demonstrated**, and is now (exit 1, names the offending step). The fourth finding is the one worth carrying:
**a detector that did not exist.**

`A-8` — the finding closed yesterday, that CI ran only 2 of the repo's 3 self-tests — was fixed by hand-adding a
YAML step **with nothing asserting it stays**. Deleting it would have been completely silent and would have
looked exactly like the six unguarded days it had just fixed. The rule's "revert the fix, watch it fail" clause
had no answer, because there was no test to revert. Built that guard (`ff476c2`), derived from `package.json` so a
newly-added self-test cannot be CI-less either, and demonstrated both sides at write time. **CI green on the
runner** (run `30633757959`) — a local green is not evidence in this lane.

**G-1** — the goal of becoming a reproducible steward of a drifting record — **green-streak: day 8 of 30**
(day 1 = 7/24; ends ~8/22). Scheduled run `30622527258` printed exactly the predicted shape.

**The north star has not moved and the reason is now measured, not assumed.** A local `npm run check` from a
residential IP got **HTTP 200 on both blocked pins** and found both expected strings still present: the bound
`0.380876` and `This page was last edited 23 January 2026.` The maintainer has not touched the page — **seven
days** after the correction went out. That is a real read CI structurally cannot produce.

**Still-unfixed and now two days old: the hosted brief.** `/t/lanes/bounds-ledger` returns 200 and still does
**not** carry the 28 July block. Yesterday's report found this and posted a bus note; a day later nothing
changed. Escalating rather than re-posting the identical note.

**CORRECTION, added later the same day.** That paragraph is wrong in a way worth keeping visible. Built
`check-brief.mjs` — a drift check on our own brief — and it found **two** missing blocks, not one: **26 July**
as well as 28 July. The page is stale since **26 July, five days**, not two. Both hand-checks (7/30 and 7/31)
searched for the block the primer named and therefore each found exactly one, which is recognition-over-recall
failing on our own instrument: **a hand-check that inherits its search term from a doc can only ever confirm
that doc.** The detector derives the expected set from the source and does not inherit anything. This is the
strongest available argument for the detector — it caught what two careful manual passes missed.

## What changed

| Commit | What |
|---|---|
| `ff476c2` | New guard — every self-test in `npm test` must appear in the workflow (+11 lines in `reverify.test.mjs`); the audit finding doc; a standing watch on demonstrating both sides of any new detector; CLAUDE.md convention |

Nothing in `ledger/` moved — no `--snapshot`, so no post-snapshot re-pin ratchet is owed.

Three inbound dispatches were answered as **not applicable, after checking rather than assuming**:

- Portfolio LLM model audit → this lane has **zero LLM call-sites**. Verified by grep, not by trusting
  `package.json`'s "no dependencies" line. Every provider-name hit in the repo is inside `ledger/` — mirrored
  upstream *content* (constant pages crediting AI assistance), not our code. Task-complete `8515bd99`.
- Shared-sink logger pollution → no logger here, and no writer to the shared sink from tests or otherwise, so
  there are no rows under this slug for anyone to subtract. Status `d621453b`.
- Shared-writer correction → this lane calls exactly **one** skylark-site script and it is the report linter,
  not `log-llm-call.mjs`. Status `7e2a9e3c`.

## Inputs (controllable)

- **KP-78 (prove the instrument can fail) — all 4 detectors audited by execution.** The drift check and the claim matcher were already
  two-sided; the pipefail guard is now demonstrated; the missing one is built. Both outputs recorded in
  `docs/findings/2026-07-31-kp78-prove-the-instrument-can-fail.md`, as the rule itself requires.
- **A negative control is now proved-landed before it is believed.** Every mutation today was confirmed with
  `git diff --numstat` before any conclusion was drawn. This is not ceremony: the *only* prior attempt on the
  pipefail guard (2026-07-25) wrote `\n` against CRLF files, silently no-opped, and pronounced a working guard
  broken. A botched negative control is worse than none — it manufactures a false clean reading about the
  detector itself.
- **Exit codes read without a pipe** throughout (`> file 2> file`, then `$LASTEXITCODE`). The piped form is the
  local echo of this lane's founding defect and has bitten twice.
- **`W-4`** — the standing watch filed today, that every future detector ships with both a fire-side and a
  silent-side output recorded — is open and does not close.

## Outputs (lagging)

- **G-1 (the steward goal) green-streak: day 8 of 30.** `227 claim(s): 225 hold, 0 broken/unreachable, 2 unverified (manual)`,
  `No drift. 110 files match upstream c4f83863…`, and the two expected `HTTP 403` advisory lines. Read out of
  the run log, not the badge.
- **North star — externally-acknowledged corrections: 0.** Sent 2026-07-24; sending is not acknowledgement.
  Page confirmed untouched today by a real residential-IP fetch of both pins.
- **UNVERIFIED claims: 2**, both `manual: true`, both the same blocked page, both by design. `C-7` (the pin on
  the January bound) and `C-9` (the pin on the page's last-edited date) cover different evidence. David said
  "leave it at 2" on 7/26 — not to be re-raised.
- Ledger: 227 claims over a 110-file mirror, clean at upstream `c4f8386`. No issues, no PRs, no deploys.

## Recommendation

**Escalate the hosted-brief re-port instead of re-posting the same note.** The source file has carried the 28
July block since `2fd740b` (7/29); the hosted page has not picked it up across two report cycles and two bus
notes. The failure is outside this repo and this lane cannot fix it directly — and **never hand David an
artifact link** is the 7/24 lesson, so a workaround is not available either. Posting one bus note that names it
as a *repeat* failure, which is different information from the first note.

North-star-wise this is the only lever that moved-and-stalled: the brief is the lane's one David-facing surface,
and a two-day-stale brief is the closest thing this pre-launch lane has to a retention/word-of-mouth defect.

## On hold pending data

3 items, unchanged:

- **`W-3`** — the watch on erdosproblems.com/36 for acknowledgement of the 7/24 correction. Blocked on the
  maintainer, measured daily. Day 7 post-send, page untouched.
- **`A-7`** — the engineering-health P1s (fleet-shared controls: no pre-commit hooks, etc.). Awaiting a
  fleet-level ruling, not local work.
- **`A-9`** — the engineering-health P2 backlog, explicitly fix-on-touch. Not scheduled work by design.

## State Appendix

- **`G-1`** — GOAL: become the reproducible steward of at least one drifting record surface. Open. Green-streak
  day 8 of 30, ends ~2026-08-22.
- **`A-2`** — stand up re-verification CI for the first adopted surface. Open (the surface is live and green;
  the item carries the remaining hardening).
- **`A-7`** — engineering-health P1s, fleet-shared controls. Open, on hold pending a fleet ruling.
- **`A-9`** — engineering-health P2 backlog, fix-on-touch. Open by design.
- **`W-3`** — watch for acknowledgement on erdosproblems.com/36. Open. 0 acks, day 7.
- **`W-4`** — the standing watch applying KP-78 (prove the instrument can fail) to every detector added here:
  both sides demonstrated at write time, and the mutation proved landed before the result is believed. Opened
  today. Standing; does not close.
- Closed to date: `A-1`, `A-3`, `A-4`, `A-5`, `A-6`, `A-8`, `W-2` (7 of 13 items).
- Repo: `main`, clean, pushed to `ff476c2`. CI green (run `30633757959`). Codex GREEN (`codex-cli 0.143.0`,
  `codex-health` exit 0) — not used today; scope was 11 lines plus prose, far under the Codex-first threshold.
- Listener GREEN — SSE alive (pid 5736) + `/loop-tick 2m` armed.
- **Process gap, flagged not fixed:** no `docs/cold-starts/2026-07-31.md` existed this morning — the 7/30
  session shipped its report but no primer, so today's carry-forward was reconstructed from the 7/30 report.
  Cost was minutes, but the primer is the lane's designed cold-start path and it silently was not there.
