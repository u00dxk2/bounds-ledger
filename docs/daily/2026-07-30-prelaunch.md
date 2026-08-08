---
product: bounds-ledger
date: 2026-07-30
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 1ec47ce
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "Closed A-8: all three of the repo's self-tests now run in CI (the pin extractor had been unguarded for six days), log-verified on run 30544580239. Found by fetch that yesterday's brief re-port never landed on the hosted page — bus note posted. Streak day 7/30, ack still 0, page still untouched."
---

# bounds-ledger — daily (prelaunch) — 2026-07-30 (MT)

Lite rail, steward cadence. No self-rating.

## BLUF

**The alarm now runs all three of the self-tests it depends on.** `A-8` — the finding that CI executed 2 of the
repo's 3 self-tests — is **closed** (commit `1ec47ce`). The unguarded one was `extract-pins.mjs --selftest`,
which covers the extractor that generates **218 of the ledger's 227 claims**; it passed in `npm test` and was
never executed by the workflow, for six days. Closed to this lane's own standard: `extract-pins selftest: PASS
(5 extraction cases)` read out of the **CI log** for run `30544580239`, under its own named step — not inferred
from a green badge.

**G-1** — the goal of becoming a reproducible steward of a drifting record — **green-streak: day 7 of 30**
(day 1 = 7/24; ends ~8/22). Scheduled run `30533198226` printed the exact shape the primer predicted:
`No drift. 110 files match upstream c4f83863…`, `227 claim(s): 225 hold, 0 broken/unreachable, 2 unverified
(manual)`, and **two** `advisory fetch failed (HTTP 403)` lines — one each under the two `manual: true` claims.

**The one thing that was silently wrong was outside this repo.** Yesterday's ship updated the David-facing
brief and asked for a re-port; the hosted page at `/t/lanes/bounds-ledger` returns 200 and **does not contain
the 28 July block**. Caught by fetching the page and grepping the response rather than trusting the close-out's
"needs an orchestrator re-port" note — the source file has the block, so this was a re-port that never landed.
Bus note posted.

**North star unmoved: externally-acknowledged corrections = 0**, day 7 post-send. A local `npm run check`
(exit code read from a file, never through a pipe; exit 0) got **HTTP 200 on both manual pins with both
expected strings present** — erdosproblems.com/36 still shows `0.380876` and still reads `last edited 23
January 2026`. The maintainer has not touched the page.

## What changed

| Commit | What |
|---|---|
| `1ec47ce` | `reverify.yml` gains a `Self-test pin extractor (no network)` step — **A-8**, the CI self-test gap, closed |

Also: `continuity/items.json` — **A-8** (the CI self-test gap) closed with its resolution and the log-verified
run id. Two bus posts: the Step-0.5 listener-confirm line, and the re-port ask for the brief.

**Nothing in `ledger/` moved** — no `--snapshot`, so no post-snapshot re-pin ratchet is owed. Mirror still at
upstream `c4f8386`, 110 files.

Two hazards were checked before believing anything, both of them this repo's own documented traps:

1. **The CRLF trap** — `git diff` was run to prove the workflow edit actually landed before running the test
   that depends on it. It did (6 insertions).
2. **The step-count assertion** — `A-8` had pre-checked that `reverify.test.mjs` *reports* the workflow step
   count without asserting it. Confirmed by reading the assertion, then by execution: the test prints
   `6 workflow steps, piped steps pipefail-guarded` and passes. The new step contains no pipe, so it needed no
   `shell: bash`.

## Inputs (controllable)

- **CI self-test coverage: 2/3 → 3/3.** The gap window was six days (the 7/24 pin-extension ship → today).
  Nothing regressed inside it — the generated pins came back **byte-identical** across both 7/28 snapshots,
  which is independent evidence the extractor was behaving. So this closes a **prospective** gap, not a live
  miss; the value is the ratchet, not a caught bug.
- **Local advisory read executed** for both page legs of W-3 — the watch on acknowledgement of our /36
  correction. Both `manual: true` pins fetched 200 from a residential connection, which CI structurally cannot
  do.
- **Shared note #2 (CC read-auth PIN gate) — grep sweep run, zero matches.** `skylarkcreations.com/api/cc`
  appears **nowhere** in this repo, so there is no caller here to convert from `?pin=` to the `x-cc-pin`
  header, and no `CC_PROMPTS_PIN` env need on any service (this lane has no service). Reported as requested
  rather than assumed from "we have no dependencies".
- **Codex: GREEN** (`codex-cli 0.143.0`, `codex-health` exit 0). Not used: today's scope was one line plus
  docs, far under the ≥250 LOC Codex-first threshold, and Sonnet was already warm in the workflow file.

## Outputs (lagging)

| Metric | Value | Move |
|---|---|---|
| Externally-acknowledged corrections (north star) | **0** | none — day 7 post-send |
| G-1 green streak | **day 7 / 30** (ends ~8/22) | +1 |
| Ledger claims | 227 (225 hold · 0 broken · 2 UNVERIFIED) | flat |
| Mirror | 110 files @ `c4f8386` | flat |
| Self-tests executed by CI | **3 / 3** | +1 |
| Open P0 / P1 / P2 (engineering-health) | 0 / **5** (was 6) / 6 | P1 −1 |

The two UNVERIFIED claims are **C-7** (the bound) and **C-9** (the page's edit date), both `manual: true`, both
on the same blocked page, both by design. David ruled on 7/26 that it should be left as is.

## Recommendation

**Nothing to decide today.** The one actionable item in the lane was A-8 (the CI self-test gap) and it is
closed; A-7 (the five
fleet-shared control P1s — secret scan, history sweep, repo manifest, branch protection, lockfile ratchet) is
explicitly blocked on a coordinated wave this lane must not front-run, and A-9 (the P2 backlog) is fix-on-touch
by construction.

**The standing recommendation, unchanged and still the highest-leverage move available:** the **"scale the
catches"** half of the closed A-6 (the second-surface adoption) is specified and **not built** — a
local-session pipeline diffing erdosproblems.com's per-problem bounds against Tao's curated table across many
problems, which needs residential fetches and therefore can never live in CI. **Which metric it moves:** the
north star directly. External-ack is this pre-launch lane's honest proxy for product-love (no users, no public
surface, private repo — so retention and word-of-mouth have no instrument *by design*, and the proxy is
already instrumented as W-3 — the watch on acknowledgement of our /36 correction). Today that metric rests
entirely on **one email to one busy
maintainer who owes us nothing**, sent six days ago, with the page provably untouched. A candidate pipeline is
the only path that does not require that inbox to answer. It is a real feature build — not close-out work —
and it needs a session with room.

## On hold pending data

1. **W-3** — the watch on acknowledgement of our /36 correction — is waiting on its **reply leg**: a maintainer
   reply lands in David's inbox, not ours. Passive; he forwards if one arrives. The **page** leg needs nobody:
   today's local `npm run check` read it mechanically. Its `signalDate` 2026-09-24 is a **check-in, not a
   deadline** — David's standing word since 7/26 is *wait*.
2. **A-7** — the five fleet-shared control P1s (secret scan, history sweep, repo manifest, branch protection,
   lockfile ratchet) — blocked on the orchestrator's coordinated fleet wave.
3. **R6 push protection**, the one control carved out of that item, is plan-gated and therefore a David spend
   decision: free secret scanning covers public repos only, and this repo is private on a personal Pro account.
   **No board card exists for it** as of today; surfaced in yesterday's close-out and re-surfaced here, since
   infra cards are not this lane's to create.

Also standing and **not** to be re-raised: David decided all three open questions on 7/26 (wait on the ack
watch, the public comment on /36 approved *in principle only*, UNVERIFIED stays at 2), and
`continuity/items.json` is not to be compressed absent his word.

## State Appendix

| Item | What it is | Status |
|---|---|---|
| G-1 — the goal: steward a drifting record inventory | 30-day green CI + ≥1 external ack | open — streak **day 7/30**; external-ack **0** |
| A-2 — the re-verification CI | 227 claims across 2 surfaces, 110-file mirror | open — `closeWhen` met 7/28; closes with the streak |
| W-3 — the ack watch on the /36 correction | reply leg (David) + two page legs (mechanical) | open — page read green + unchanged today |
| A-7 — the five fleet-shared control P1s | secret scan, history sweep, manifest, branch protection, lockfile | open — blocked on the fleet wave; R6 David-gated |
| A-8 — the CI self-test gap | `extract-pins --selftest` had no workflow step | **closed 7/30** — `1ec47ce`, log-verified run 30544580239 |
| A-9 — the engineering-health P2 backlog | six findings, fix-on-touch | open — not scheduled work by design |
| A-1 / W-2 / A-3 / A-4 / A-5 / A-6 — reconciliation, Haugland, correction sent, alarm fixes, second surface | — | closed 7/22–7/25 |

**Instrument state:** mirror 110 files at upstream `c4f8386`; `ledger/claims.json` 9 hand claims (C-1…C-9) +
218 generated pins; 3/3 self-tests in CI; working tree clean at `main` = `1ec47ce`, pushed. No open issues, no
open PRs, no deploys (this lane has no service).

**Tier 0 / evangelism read (pre-launch, day 9).** Core problem in the user's words: *"I cited a number. I have
no idea if it's still the current one."* Would-tell-a-friend moment: the alarm catches a stale citation before
the citer is embarrassed by it. **Distance from it:** unchanged — the alarm has now fired on real upstream
movement twice (7/28), but both catches were the curated table correcting *itself*, so the moment still has not
occurred. Advocacy signal this session: **none**, which is correct at day 9 pre-launch with a private repo.
