# The alarm called a network flake a drift — and said nothing about why

**2026-07-25 · caught in production, from a real auto-filed issue (#2)**

## What happened

CI run `30168372746` (push of the gate-sweep commit `8856fb3`, 17:48Z) failed and auto-filed [issue #2](https://github.com/u00dxk2/bounds-ledger/issues/2). The issue read:

> **Drift: bounds-ledger re-verification (2026-07-25)**
>
> ```
> # Claim check — 2026-07-25T17:48:54.727Z
> UNVERIFIED  C-7  erdosproblems.com/36 still shows 0.380876 …
> 223 claim(s): 222 hold, 0 broken/unreachable, 1 unverified (manual).
> ```

**No record drifted.** `scripts/reverify.mjs --check` hit a transient network failure fetching upstream, printed `error: fetch failed`, and exited 2. The claims step then ran (correctly, via `if: '!cancelled()'`) and everything held. The next push, ten minutes later, was green.

## The two defects

**1. A tool error was labelled `Drift:`.** The title asserts a mathematical record moved when none did. The title-extraction grep found no `CHANGED/ADDED/REMOVED` and no `BROKEN/UNREACHABLE` lines, so it fell through to the generic `${parts:-bounds-ledger re-verification}` default — which is still prefixed `Drift:`.

**2. The reason was invisible.** `reverify.mjs` reports errors via `console.error`, i.e. **stderr** — and the step was `node scripts/reverify.mjs --check | tee -a finding.txt`, which captures **stdout only**. So `error: fetch failed` reached the CI log and never reached `finding.txt`, and therefore never reached the issue body.

Combined, they produce the worst possible artifact: a title claiming a drift, over a body showing **222 hold, 0 broken** — self-contradictory, with the actual cause available nowhere in the issue.

## Why this matters more than it looks

This lane's product is a trustworthy alarm. A false `Drift:` costs a reader real time hunting a record change that never happened — and worse, repeated flakes teach us to skim past `Drift:` issues. That is how a *real* drift gets missed. It is the same failure family as the 2026-07-24 never-armed defect, arriving from the opposite direction: that alarm couldn't speak, this one spoke and said the wrong thing.

## Fix

Both halves, in `.github/workflows/reverify.yml`:

- `2>&1` added to both piped check steps, so stderr lands in `finding.txt` and therefore in the issue body.
- The title branches three ways instead of falling through: `Drift: <what moved>` when there are real drift/claim lines; `Check error: … could not complete` when `finding.txt` contains an `^error:` line; `Re-verification failed` otherwise. (A-4 already added a fourth: `Instrument failure` when `finding.txt` does not exist at all.)

Verified by executing the deployed step body under GitHub's exact shell (`bash --noprofile --norc -eo pipefail`) against four real inputs, including a byte-accurate replay of run `30168372746`:

| Input | Title produced |
|---|---|
| Replay of the production fetch failure | `Check error: bounds-ledger re-verification could not complete (2026-07-25)` |
| No `finding.txt` (self-test failure) | `Instrument failure: bounds-ledger self-test (2026-07-25)` |
| Real injected mirror drift | `Drift: constants/21a.md (2026-07-25)` |
| Real broken pin | `Drift: claims pin:10a:U (2026-07-25)` |

## The part worth keeping

Two hours earlier, the gate-execution sweep marked exactly this path **UNKNOWN** — "`if: failure()` → `gh issue create` has never executed in production, and closing it would require pushing a corrupted mirror." Production closed it within the hour, for free, and the answer was more interesting than a green would have been: the path *fires* (so does `if: '!cancelled()'`, proven by the claim output appearing in the body) — **and its output was wrong.**

An honest UNKNOWN left the question open, so the evidence was recognised when it arrived. A fabricated green would have closed it, and issue #2 would have been read as a real drift.

**Standing note:** a transient fetch failure still files an issue. Retry/backoff was deliberately not built today — one flake in four days does not justify it. If check-error issues become frequent, add retry to `reverify.mjs` rather than suppressing the alarm.
