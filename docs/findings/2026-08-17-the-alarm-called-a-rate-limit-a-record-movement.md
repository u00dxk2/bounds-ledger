# The alarm called a rate limit a record movement

**2026-08-17.** Found in production, while validating something else.

> **Where the fix lives.** The code described below — the workflow's title precedence and its guard
> in `scripts/reverify.test.mjs` — is committed on branch `alarm-title-honesty` (`4153c00`) and was
> deliberately **not merged on the day it was written**: the alarm's issue title is the most-read
> line this repository produces, which puts it in the trusted-print class the cross-family review
> lane exists for. This finding sits on `main` regardless, because a finding is a record and records
> should not wait on a merge queue. **A-17** tracks the merge and its ordering. So if you are reading
> this against a `main` that has no `join_list` in `.github/workflows/reverify.yml`, nothing is
> missing — the branch has not landed yet.

## What happened

The held `guard-catch-count` branch needed a run on a Linux CI runner before merging — the one
environment it had never executed in. `reverify.yml` only triggers `push` on `main`, so a feature
branch can never get a run by pushing; `workflow_dispatch` is the only route. I dispatched it.

The guard passed. The job failed anyway, on `HTTP 429` from `raw.githubusercontent.com`, and the
alarm filed issue #15:

```
Drift: claims C-1,pin:12a:U pin:37a:U,pin:37a:L pin:3c:U,pin:3c:L (2026-08-17)
```

That title asserts six mathematical records moved. Zero had. A local `npm run check` four minutes
earlier read `No drift. 113 files match upstream e70b4a4` and `233 claim(s): 231 hold, 0
broken/unreachable, 2 unverified (manual)`.

A second dispatch, to validate the rebased sha, hit the rate limit far harder and filed issue #17
with roughly thirty pins named — a title so long GitHub truncated it at 240 characters.

## The defect

The `Open finding` step derived its title like this:

```bash
parts=$(grep -hE '^(BROKEN|UNREACHABLE) ' finding.txt | awk '{print $2}' | ...)
[ -n "$parts" ] && parts="claims $parts"
if [ -n "$parts" ]; then title="Drift: $parts ..."
elif grep -qE '^error:' finding.txt; then title="Check error: ..."
```

`BROKEN` and `UNREACHABLE` are not the same kind of event and must never share a title:

- **`BROKEN`** — we read the cited source and the pinned string was gone. A record moved. `Drift:`
  is exactly right.
- **`UNREACHABLE`** — we never read the source. Nothing is known about whether it moved.

This is [A-5](2026-07-25-alarm-called-a-network-flake-a-drift.md) again — "a tool error was titled
`Drift:`, asserting a mathematical record moved when none did" — surviving in a branch A-5's own
fix could not reach. A-5 added the `error:` test, and it is correct, but it sits in an `elif`:
`UNREACHABLE` populates `$parts` and wins before the `error:` test can run. reverify's own
`error: fetch constants/11a.md: 429` was sitting in `finding.txt` and was never consulted.

Cost model, unchanged from A-5: a false `Drift:` spends a reader's trust hunting a change that
never happened, and repeated flakes train us to skim past `Drift:` issues — which is how a real
one gets missed.

## A second, smaller defect in the same line

`paste -sd', '` does not join with `", "`. `-d` takes a **list** of delimiters applied
**cyclically**, so three or more items come out `a,b c,d`. It is visible in #15's own title
(`C-1,pin:12a:U pin:37a:U,pin:37a:L`) and was latent in every multi-file drift title before it —
invisible only because two items consume just the first delimiter. Fixed with an explicit
`paste -sd, - | sed 's/,/, /g'`.

## The fix, and both answers

Precedence is now: mirror movement (`CHANGED`/`ADDED`/`REMOVED`) → claim movement (`BROKEN`) →
unreachable sources → tool error → generic failure. `UNREACHABLE` gets its own honest title,
`Check error: bounds-ledger could not reach N cited source(s)`.

Guarded in `scripts/reverify.test.mjs`, which **extracts the step body from the deployed YAML**
rather than restating it — a copy in the test would verify my transcription, not the alarm (the
A-4 method). Seven cases, run under GitHub's exact shell (`bash --noprofile --norc -eo pipefail`):

| input | title |
|---|---|
| `UNREACHABLE` ×2 + `error:` (the real 429 shape) | `Check error: … could not reach 2 cited source(s)` |
| `BROKEN pin:10a:U` | `Drift: claims pin:10a:U` |
| `BROKEN` + `UNREACHABLE` together | `Drift: claims pin:10a:U` — a real move outranks a concurrent flake |
| `CHANGED constants/2a.md` | `Drift: constants/2a.md` |
| three changed files | `Drift: constants/2a.md, README.md, constants/99z.md` |
| `error: fetch failed` alone | `Check error: … could not complete` |
| no `finding.txt` | `Instrument failure: bounds-ledger self-test` |

Negative control performed (KP-78): restoring `UNREACHABLE` to the drift group, with the mutation
proven to land first (`git diff --numstat` → `20 2`), makes the test exit 1 with *"a transport
failure was titled as a record movement: Drift: claims C-1, pin:3c:L"*. Restored clean.

**The guard first fooled itself, and that is worth recording.** The initial version resolved
`bash` from `PATH`, which does not exist on this machine's PowerShell. The spawn failed, the
harness returned an empty string, and `assert.doesNotMatch(title, /^Drift:/)` **passed on the
empty string** — a guard reporting success because it had not run. The assertion that a title was
emitted at all had to come first. `bash` now resolves via `git --exec-path` on Windows, and if it
cannot be found the test says `SKIPPED` out loud and names what went unchecked, the same way this
repo already refuses to launder an unanswerable question into a pass (`UNVERIFIED`, `UNVERIFIABLE`,
`UNKNOWN`).

## Three things I got wrong

1. **I caused the rate limit.** Two dispatches in ten minutes, each issuing roughly 220 fetches
   against `raw.githubusercontent.com`, on top of the daily scheduled run. Dispatching this
   workflow is not free: it spends a shared budget that the *scheduled* run — the one G-1's green
   streak is measured on — depends on. Validate on a runner, but not repeatedly, and not twice in
   one window when the first run already answered the question.
2. **I filed a real issue by accident.** A throwaway debug one-liner's escaping failed to strip
   the step's `gh issue create` before executing it, and it filed #16 against the public repo.
   Closed within minutes. The harness in the test asserts the strip succeeded *before* running
   anything; the debug script did not. Ironically #16's title was
   `Check error: bounds-ledger could not reach 2 cited source(s)` — an accidental end-to-end proof
   that the fix works through the real `gh` path.
3. **Five resolved drifts were still open as `Drift:` issues** (#10–#14, resolved in `d30d4e4`,
   `ec01082`, `4d06395`, `433091b`). Nobody closed them at resolution time. Five standing reds on
   a repo whose entire pitch is noticing stale things is the founding defect wearing yet another
   hat, and it is worse than it looks: the next reader learns that `Drift:` issues can be ignored,
   which is the precondition for missing a real one. Closing on resolution is part of the drift
   cycle, not optional tidying. All five closed; open issues now zero, verified by REST after the
   GraphQL listing returned 503 (a failed query is not evidence of absence).

## What this says about the red

The red run was **correct and stays correct**. An unreachable source means we could not verify,
and reporting green would launder an unverifiable result into a pass — the one thing this repo
must never do. Only the title was wrong. Worth stating because the tempting fix is to make 429
non-fatal, and that would be the actual disaster.

Whether the fetch layer should retry on 429 is a separate, real question — it would extend the
instrument's reach rather than soften its verdict — and it touches two trusted instruments'
network paths, so it belongs behind the cross-family review lane rather than in this commit.
