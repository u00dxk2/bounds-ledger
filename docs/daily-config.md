---
project: bounds-ledger
---

# daily-config — bounds-ledger

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
git rev-parse HEAD origin/main && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]   # prints both; ABORTS on mismatch. No pipe — the exit code is real.
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**Both answers demonstrated at adoption, 2026-08-16** (KP-78 — ship no detector without showing it can fail): `--workflow reverify.yml` at HEAD `fd70f11` → exit 0, *"GREEN — 1 completed non-scheduled success(es) for HEAD"*; `--workflow nonexistent.yml` at the same HEAD → exit 2, *"UNKNOWN — CI read failed/unparseable — UNKNOWN, not green"*. It distinguishes; it does not blanket-pass.

## North-star frontmatter — RE-POINTED 2026-08-22 at G-1's close (b4)

Every `docs/daily/<date>-prelaunch.md` carries these four fields. **Copy them from HERE, never from
yesterday's report** — that copy-forward is exactly how a closed goal's flattering number survives.
G-1 closed 2026-08-22 with `north_star_value: 1` / `green`; carrying that forward would report a
CLOSED goal's value as the headline while the live Tier-0 goal reads zero.

```yaml
north_star_metric: someone outside Skylark uses the ledger and acts on it (G-3; leading indicator = every detection path in G-3.readCommand is live)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
```

**The metric line carries NO path COUNT, and that is deliberate — corrected 2026-08-23.** It said
"all four detection paths" while `G-3.readCommand` had five legs, and yesterday's report said five;
a sixth landed on 08-23 when the empty-state ship created a new observable. A hand-typed count in a
config that another file is the source of truth for drifts silently every time the command grows,
and drifts in the flattering direction — it under-states what we check. Count the legs of
`G-3.readCommand` if you need a number; do not re-introduce one here.

**`expected-zero` is a real status, not a red.** G-3 legitimately reads 0 for months — its own
`onTrigger` says the 2026-09-22 read is *could we DETECT an outsider*, not *has one arrived*; the
outcome read is 2026-11-06. A cold reader must be able to tell "zero because nobody has arrived
yet, which is expected" from "zero because the detector is dead", and only the second is
actionable. The detection paths ARE `G-3.readCommand` — run it; a green chain means we could
detect an outsider and says nothing about whether one came. (This sentence said "the four detection
paths" until 2026-08-23. The count above it was corrected first and this one was missed by twelve
lines — a correction that reaches one copy is not a correction, and the second copy was in the same
file as the first.)

**Do NOT substitute an arrival count.** The traffic sampler read 4 unique viewers against 183
unique cloners on 2026-08-22; the clones are largely our own CI, which checks the repo out daily,
on every push and every PR.
