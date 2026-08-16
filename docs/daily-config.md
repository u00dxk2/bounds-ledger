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

**Both answers demonstrated at adoption, 2026-08-16** (KP-78 — ship no detector without showing it can fail): `--workflow reverify.yml` at HEAD `fd70f11` → exit 0, *"GREEN — 1 completed non-scheduled success(es) for HEAD"*; `--workflow nonexistent.yml` at the same HEAD → exit 2, *"UNKNOWN — CI read failed/unparseable — UNKNOWN, not green"*. It distinguishes; it does not blanket-pass.
