---
project: bounds-ledger
---

# daily-config — bounds-ledger

## The first action — DECLARED, and what the primer generator copies

<!-- primer:first-action -->
```
node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

Run from the repo root, one command per line, **no leading `cd`** and no `&&` chain — a compound the
permission classifier cannot statically resolve parks the pane at a silent prompt that reads exactly
like a hang. Read each exit code directly; never through a pipe (`| tail` reports the pager's `0`,
which is this lane's founding defect).

**Line 1 is new on 2026-08-28 and it is first on purpose.** Every other line in this block asks *is
the code green*; none can answer *does David want something*, and those are different questions. On
2026-08-28 David answered a board card at 02:27Z and the only reason this pane saw it is that a bus
dispatch happened to carry it — with a quiet bus the whole cadence would have run past a live answer
and the day would have closed reporting no blockers. Read the `state` field: `waiting` means he has
ALREADY replied and the ball is with us. Needs `CC_PROMPTS_PIN`; if it is missing the command fails
loudly, which is correct — an unread board is not an empty board.

**Line 3 MUST print `0`.** Any other number means your HEAD is not the commit CI read, so line 5's
verdict — green or red — describes a different tree. Both polarities demonstrated on 2026-08-27 at
adoption (KP-78): with two unpushed commits it printed `2`; after the push, `0`.

**Line 4 is the day's first GATE command and the reason this fence exists** (it was "the first real
command" until line 1 went in above it on 2026-08-28) — `npm run verify` writes
`tmp/.verify-receipt.json` at the current HEAD, and `agent-status` refuses the day's first bus post
without one. A bare `npm run check` leaves you refused later, at a worse moment. Its output goes to a
file because piping it is refused by the pre-commit corruption guard, correctly.

**Line 4 takes ≈3 minutes (~450 network requests; measured 2026-08-30, 15:04→15:07Z) — give the call a
10-minute tool timeout.** That is longer than the common 120-second default, so a run left on the
default can be cut off before it finishes. Do NOT background it instead: on this machine a
backgrounded run's exit code is only knowable from a completion notification, and the presence of
`tmp/.verify-receipt.json` is not its verdict — the receipt records an exit code, so read the code,
not the file's existence. What a foreground run returns when the timeout does cut it off has NOT been
measured here; do not assert a failure mode for it.

**Why this fence and not the CI-truth fence below** (declared 2026-08-27): the orchestrator's two
candidates were both CI-truth reads, and neither is what a cold agent runs first. `npm run verify` is,
per `AGENTS.md`. Declaring a CI read as the first action would have mechanically installed a wrong
instruction into every generated primer from here on — the CI read answers *may I claim green*, which
is a question you reach after the gate has run, not before.

**CI truth (R-2, 2026-08-15):** before any "shipped and verified" / "CI green" claim, run

```
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
node ../skylark-site/scripts/check-posted-unpushed.mjs --project bounds-ledger
```

Exit 0 GREEN (a completed run's headSha matches YOUR HEAD) · **2 UNKNOWN (never a pass)** · 3 RED. The second finds task-completes citing commits absent from origin >3h (exit 3 = findings).

⚠ Keep `--workflow reverify.yml`, but **know which guard is actually protecting this lane** — checked live 2026-08-16 rather than inherited from the dispatch. The fleet warning is about multi-workflow repos where a cron workflow's success masks a red `ci.yml`; we have exactly one workflow, so `--workflow` disambiguates nothing here. What protects us is the **event filter**, which is unconditional in `classifyCiRuns` and not gated on the flag: a `schedule` run can prove RED but never GREEN.

That filter is load-bearing here, because `reverify.yml` **is** the scheduled job (`cron: "17 9 * * *"`). Runs pile up at one sha: at `fd70f11` there were two — a `schedule` success at 09:25Z and a `push` success the previous 19:57Z — and the script counted `1 non-scheduled success`. On any quiet morning where HEAD has not moved since the cron, the overnight run is the **only** run at that sha, and an event-blind read would call that green while nothing had validated the commit. Do not "simplify" to a bare `gh run list --commit`.

`gh` also intermittently serves stale green pages: green must match the commit you have. Same failure the fleet hit 2026-08-15, when a bare read called every repo green over five consecutive `ci.yml` failures.

Both scripts carry `--help` / `--selftest`. Read the exit code by redirect, never through a pipe (`| tail` reports the pipe's 0).

⚠ **A FAILED RUN IS NOT A FAILED CHECK — read the JOB layer before believing this script in either direction (added 2026-08-26).** `check-ci-status.mjs` reads the run-level `conclusion`, and during the GitHub Actions outage that field was wrong **both ways on this repo inside four minutes**: `8a35eaf` reported `completed/failure` with both jobs `queued` and **zero steps executed**, while `1cb3f65` reported `startup_failure` over a `check` job that was `completed/success` with **29 of 29 steps**, drift and claims legs included. Neither verdict was a verdict. Read `gh api repos/u00dxk2/bounds-ledger/actions/jobs/<id>` — positive control that the endpoint reports real conclusions is a settled run (`c25cecd` → `completed/success`, 29 and 7 steps). The script is not wrong, it is **insufficiently specific**, and the gap opens only when the platform is degraded, which is exactly when it is read most anxiously.

⚠ **`check-ci-status.mjs` reads your LOCAL HEAD, so run it from a `main` checkout or its verdict is about a different commit.** Near-miss 2026-08-17: it printed *"GREEN — 1 completed non-scheduled success(es) for HEAD"* while I was checked out on a feature branch, so the green described that branch's PR run and said nothing about `main`, which was red at the time. The script names the sha it used on its first line (`local HEAD cf1e2786a4`) — read that line, not just the verdict. The prompt's standing rule already says to discriminate with `git rev-parse HEAD origin/main`, but it frames that as the response to an UNKNOWN; this failure produced a confident **GREEN**, which is the direction nobody double-checks. Make the rev-parse unconditional:

```
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**Line 2 MUST print `0`.** Any other number means your HEAD is not the commit CI read, so line 3's verdict — green or red — is about a different tree. Demonstrated both ways on 2026-08-27 at adoption (KP-78): with two unpushed commits it printed `2`; after the push, `0`. This replaced a one-line `&&` chain containing a `$(...)` comparison, which was correct as shell and could not be auto-approved by the permission classifier, so it PARKED the pane at a silent prompt that reads as a hang. One command per line; each exit code is read directly, never through a pipe.

**Both answers demonstrated at adoption, 2026-08-16** (KP-78 — ship no detector without showing it can fail): `--workflow reverify.yml` at HEAD `fd70f11` → exit 0, *"GREEN — 1 completed non-scheduled success(es) for HEAD"*; `--workflow nonexistent.yml` at the same HEAD → exit 2, *"UNKNOWN — CI read failed/unparseable — UNKNOWN, not green"*. It distinguishes; it does not blanket-pass.

## North-star frontmatter — RE-POINTED 2026-08-26 at G-3's close (previously 2026-08-22 at G-1's)

Every `docs/daily/<date>-prelaunch.md` carries these four fields. **Copy them from HERE, never from
yesterday's report** — that copy-forward is exactly how a closed goal's flattering number survives.
G-1 closed 2026-08-22 with `north_star_value: 1` / `green`; carrying that forward would report a
CLOSED goal's value as the headline while the live Tier-0 goal reads zero.

```yaml
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
```

**The metric line carries NO path COUNT, and that is deliberate — corrected 2026-08-23.** It said
"all four detection paths" while the goal's readCommand had five legs, and yesterday's report said five;
a sixth landed on 08-23 when the empty-state ship created a new observable. A hand-typed count in a
config that another file is the source of truth for drifts silently every time the command grows,
and drifts in the flattering direction — it under-states what we check. Count the legs of
the live goal's `readCommand` if you need a number; do not re-introduce one here.

**`expected-zero` is a real status, not a red.** G-4 legitimately reads 0 for months — its own
`onTrigger` says the 2026-09-26 read is *could we DETECT an outsider*, not *has one arrived*; the
outcome read is 2026-11-06. (This block named G-3 until 2026-08-26, when David closed G-3 as MET on
the 08-23 upstream correction and set G-4 in its place. **G-4 is the harder question**, because it
removes our own outbound effort — G-3's single instance ran entirely through an issue we wrote — so a
zero here is even more expected than a zero there was.) A cold reader must be able to tell "zero because nobody has arrived
yet, which is expected" from "zero because the detector is dead", and only the second is
actionable. The detection paths ARE the live goal's `readCommand` — run it; a green chain means we could
detect an outsider and says nothing about whether one came. (This sentence said "the four detection
paths" until 2026-08-23. The count above it was corrected first and this one was missed by twelve
lines — a correction that reaches one copy is not a correction, and the second copy was in the same
file as the first.)

**Do NOT substitute an arrival count.** The traffic sampler read 4 unique viewers against 183
unique cloners on 2026-08-22; the clones are largely our own CI, which checks the repo out daily,
on every push and every PR.

## Reading `tmp/.bus-listen.err` — two bounded calls, never a bare `Read`

```
Grep '^--- restart' -n   (on tmp/.bus-listen.err)
Read offset=<line number of the LAST hit> limit=12
```

**Why this is a declared recipe and not a preference.** The `/listen` skill's verification step says
`tail -n 30`, and this lane cannot follow that — file reads go through Read/Grep/Glob here, and `Read`
has no tail affordance. On 2026-08-29 the obvious substitute (a bare `Read` of the file) returned lines
1–386 of 1365 and consumed the entire ~25k-token read cap on the **first tool call of the session**. The
file is append-only *by design* — `listen.mjs` keeps prior sessions above the newest `--- restart`
marker (S-20260827-08) — so it only grows, and the cost recurs every session, larger each time. The
only region anyone ever needs is the one below the newest marker.

**ESCALATE-IF: the newest `--- restart` hit is not the last line-numbered hit Grep returns.** That means
the file rotated or two listeners are writing to it — stop and read the whole marker list before
trusting any line under it. (The fleet-side half — the `/listen` skill's own `tail -n 30` instruction —
is the orchestrator's, routed 2026-08-29 as a fleet-skill defect.)

## P2 gate battery

```
node ../skylark-site/scripts/continuity-check.mjs
```

Run it **inside P2**, and read its own RESULT line rather than inferring from a clean commit.

**Why it is pinned here.** On 2026-08-28 P2 diagnosed the tracked-and-untracked class — `A-35` carrying
`expiresOn` but no `expectedSignalBy`, visible to one instrument and invisible to another — and then
shipped a fresh instance of that same class on the same row, `releaseTest` present and `readCommand`
empty, **behind a green board, because `continuity-check` was not in that phase's battery**. The phase
that names a defect class is the phase most likely to ship one, and the only thing that would have
caught it was the checker nobody had wired in. Approved 2026-08-29.
