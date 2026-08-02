# No-secrets history sweep — the A-13 pre-flip gate

**2026-08-02** · orchestrator-greenlit spare-capacity item · `scripts/history-sweep.mjs`

## Result

**CLEAN.** 75 reachable commits, 1.70 MB of diff, 13 structural patterns, zero hits.

```
history sweep — 75 reachable commit(s), 13 pattern(s), 1.70 MB of diff scanned
CLEAN — no secret-shaped content in reachable history.
exit: 0
```

This is the third of A-13's four package items (SECURITY.md landed 8/01; README-as-product and the
package-level adversarial review remain).

## Why the CLEAN is worth anything

A sweep that has never been shown to fire is indistinguishable from a sweep that cannot fire, and
this lane exists because of exactly that failure mode. Two demonstrations, both required:

**1. Every pattern fires on its own fixture.** `--selftest` gives each of the 13 patterns a positive
fixture it must match, plus 8 realistic lines from this repo's actual content that must NOT match
(commit shas in `manifest.json`, LaTeX from the mirror, `${{ secrets.GITHUB_TOKEN }}`, placeholder
assignments). It also asserts every pattern *owns* a fixture, so a new untested pattern cannot slip
in behind a green run.

**This caught two real bugs before the sweep was believed** — and both would have produced a
confident CLEAN:

- `sentry-auth-token` was `/sntr[a-z]_/`, but real Sentry tokens are `sntrys_` / `sntryu_` — two
  letters. The pattern could never have matched anything.
- `secret-assignment` keyed on `SECRET|PASSWORD|API_KEY|…` and therefore could not see
  **`CC_PROMPTS_PIN`**, a real credential in this portfolio. Fixed by broadening to `_PIN|_TOKEN|_KEY|CREDENTIAL`.

A third gap surfaced from the coverage assertion: `github-oauth` (`gho_`) had no fixture at all.

So at the moment the first "CLEAN — no secret-shaped content" line was printed, **three of thirteen
patterns were untested and two were incapable of matching**. The clean was real but it was not yet
*evidence*. That gap between "the alarm is silent" and "the alarm works and is silent" is the whole
subject of this lane.

**2. End-to-end fire against real git plumbing.** Fixtures test `scan()`, not the `git log -p --all`
path. So a real secret was committed to a throwaway branch:

```
=== planting a real commit on a throwaway branch ===
mutation proof:  921598a TEMP: planted secret …   1  0  planted.env

=== SWEEP WITH PLANTED SECRET (must FIRE) ===
history sweep — 76 reachable commit(s), 13 pattern(s), 1.70 MB of diff scanned
FOUND 2 secret-shaped hit(s):
  [github-pat] planted.env
      +GITHUB_TOKEN=ghp_Zz9Yy8Xx7Ww6Vv5Uu4Tt3Ss2Rr1Qq0Pp9Oo8
  [secret-assignment] planted.env
      +GITHUB_TOKEN=ghp_Zz9Yy8Xx7Ww6Vv5Uu4Tt3Ss2Rr1Qq0Pp9Oo8
exit: 1
```

Mutation proved landed with `--numstat` before the result was believed (the CRLF `\n` no-op trap).
Branch deleted, file removed, and the sweep re-run to confirm the control left nothing reachable:
back to **75 commits, CLEAN, exit 0**.

## Scope and ceiling, named not hidden

- Covers commits **reachable from refs** — the right scope for a pre-publish gate, since that is
  what a cloner receives. Dangling/unreachable objects are not scanned. The stronger claim would
  need `git cat-file --batch-all-objects`.
- Patterns are **structural** (credential prefixes and assignment shapes), never entropic. A
  generic long-hex rule would fire on every commit sha in `ledger/**/manifest.json` and on the
  mathematics itself — a constantly-firing alarm carries no information.
- The allowlist has exactly one entry (this scanner's own pattern definitions). An allowlist is
  where a secrets sweep goes to die; anything added belongs here with its justification.

## What this is NOT

**This does not close A-7's R7.** R7 is the *scheduled* history-sweep control, part of the
coordinated fleet wave with shared recipes, and the 2026-07-29 dispatch was explicit that this lane
must not solve it locally ahead of that wave. This is a one-time **gate** whose output goes in the
flip package.

The split in CI reflects that: the **sweep** is not in CI, but its **pattern selftest** is (a new
step in `reverify.yml`, now 5 self-tests across 9 steps) — because the patterns rot silently, as
they demonstrably did within an hour of being written.

## Standing caveat for whoever runs this before the flip

Re-run it immediately before the flip click, not just once. It is cheap, and the claim it supports
("no secrets in history") is only true as of the commit it was run against.
