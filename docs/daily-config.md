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

⚠ `--workflow reverify.yml` **is the whole point — never drop it for a shorter command.** A bare branch read answers with whatever ran last, and this lane's `reverify.yml` is on a schedule, so the overnight cron's success is exactly the wrong thing to read a HEAD verdict off. (The script already filters to non-scheduled runs — that filter is only reachable with the flag.) `gh` also intermittently serves stale green pages: green must match the commit you have. Same failure the fleet hit 2026-08-15, when a bare read called every repo green over five consecutive `ci.yml` failures.

Both scripts carry `--help` / `--selftest`. Read the exit code by redirect, never through a pipe (`| tail` reports the pipe's 0).

**Both answers demonstrated at adoption, 2026-08-16** (KP-78 — ship no detector without showing it can fail): `--workflow reverify.yml` at HEAD `fd70f11` → exit 0, *"GREEN — 1 completed non-scheduled success(es) for HEAD"*; `--workflow nonexistent.yml` at the same HEAD → exit 2, *"UNKNOWN — CI read failed/unparseable — UNKNOWN, not green"*. It distinguishes; it does not blanket-pass.
