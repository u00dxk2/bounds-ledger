# The guard against a wrong-commit CI read was never run

**Date:** 2026-08-18 (MT) · **Found by:** running the primer's own stated first-action command
**Severity:** the whole first-action chain aborted at command one; nothing after it executed.

## What was wrong

`docs/cold-starts/2026-08-18.md` opened with this as tomorrow's first action:

```
cd C:/dev/skylark/bounds-ledger && git rev-parse --short HEAD origin/main && npm run check && node scripts/reverify.mjs --check && node scripts/check-claims.mjs
```

`git rev-parse --short` accepts **exactly one** revision. Given two it exits **128** with
`fatal: Needed a single revision` — and because the chain is `&&`, **every later command is
skipped**. A cold agent pasting the primer's first action got no `npm run check`, no mirror
diff, no claim check: the entire steward cadence, silently not run, behind an error message
about revision parsing that looks like a repo problem rather than a typo.

The same broken string had reached three surfaces in two files (`docs/cold-starts/2026-08-18.md`
twice, `docs/daily-config.md` once) — the fix-one-surface pattern this repo has now hit
repeatedly.

## Why it survived review

The guard was added on 2026-08-17 to close a real near-miss: `check-ci-status.mjs` reads
**local HEAD**, so on a feature branch it printed a confident GREEN about a branch run while
`main` was red. The response — make the `rev-parse` unconditional — was correct.

The `--short` was not. And the working form was sitting **one line above it in the same
section's prose**: *"the standing rule already says to discriminate with `git rev-parse HEAD
origin/main`"* — no `--short`. The prose was right; the code block, which is the part anyone
actually pastes, was a decoration of it that was never executed.

The section immediately below the block is headed **"Both answers demonstrated at adoption,
2026-08-16 (KP-78 — ship no detector without showing it can fail)"**. That demonstration
covered `check-ci-status.mjs`, the block's *second* line. The first line — the new guard — was
never run at all, and the KP-78 header sitting under the block read as though it covered both.
**A demonstration attached to a block certifies only the command it actually ran.**

## The fix

```
git rev-parse HEAD origin/main && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]
```

It prints both shas (so you see what it compared) and then **aborts** on mismatch, so in the
`&&` first-action chain a diverged checkout stops the cadence instead of letting it run against
the wrong commit. No pipe anywhere — the exit code is genuinely `test`'s.

**The first repair written for this finding was wrong, and it is worth recording why.** It was
`git rev-parse HEAD origin/main | uniq` — one line of output means in sync, two means stop.
Compact and readable, and it breaks `AGENTS.md`'s hard invariant *"Never read an exit code
through a pipe … the pipe's exit 0 wins and a real failure passes green"*: in an `&&` chain the
status consulted is `uniq`'s, which is 0 whatever `git rev-parse` did. A fix for a guard that
never ran, itself introducing the failure mode the repo forbids by name, caught only by
re-reading the invariant before committing. **The pipe rule is not only about CI steps and
`--selftest` calls; it governs any command whose success another command depends on.**

## Both answers demonstrated (KP-78), on the form actually shipped

| Case | Result |
|---|---|
| Negative control — the old form, `git rev-parse --short HEAD origin/main` | `fatal: Needed a single revision`, **exit 128** |
| Condition absent — in sync | both shas printed, **exit 0** |
| Condition present — diverged (`origin/alarm-title-honesty`, a real divergent ref) | both shas printed, **exit 1** |
| Chain behaviour when diverged | `… && echo RAN` printed **nothing** — the cadence aborts |

`--short=7` fails identically (exit 128): the arity limit is on `--short` itself, not its
optional argument, so do not "fix" a future recurrence by adding `=N`.

The table above describes the exact string now in `docs/cold-starts/2026-08-18.md` and
`docs/daily-config.md` — not the draft it replaced. That distinction is the finding.

## The class

Same family as the 2026-08-16 README finding — *an artifact written FOR an audience is verified
from that audience's environment* — with the environment stripped to its smallest case: **a
command written into a doc is verified by running it.** The 8/16 instance failed only for
visitors, so re-running it as the author could not have caught it. This one failed for
**everyone, including the author**, which means it was never run once, by anyone, before being
handed to tomorrow's cold agent as the first thing to do.
