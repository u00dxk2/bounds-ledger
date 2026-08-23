# The alarm-title test failed once and then would not reproduce

**2026-08-23 · instrument-facing · UNRESOLVED, recorded rather than diagnosed**

## What happened

During a routine `npm run verify` — the gate run after committing `0698ab3` — `reverify.test.mjs`
failed on its alarm-title leg:

```
AssertionError [ERR_ASSERTION]: The input did not match the regular expression
/^Drift: constants\/2a\.md/. Input:

'Re-verification failed: bounds-ledger (2026-08-23)'
```

`npm run verify` exited **1**, correctly and loudly. The same gate had exited 0 minutes earlier on
the same tree.

## Why it is worth a file rather than a shrug

The alarm's TITLE is the entire product at the moment the product delivers value. A steward reads
it in the first three seconds and decides whether anything matters. This lane already has one
finding about a mistitled alarm — `2026-08-17-the-alarm-called-a-rate-limit-a-record-movement.md`,
where a transport failure was titled as a record movement — and the guard that failed here is part
of what was built to stop that recurring.

So a test that intermittently reports the wrong alarm title is not noise. It is the guard on the
lane's most reader-facing behaviour, flickering.

## What was actually established

- **Not reproduced in 10 consecutive runs** immediately afterwards — 2 by hand, then 8 in a loop,
  all exit 0. Observed rate is therefore about 1 in 11, from a single occurrence, which is a rate
  with essentially no confidence attached; state it as "seen once" rather than as a frequency.
- **The working tree was clean** before and after, so this was not a leftover mutation from an
  earlier negative control.
- **This is NOT the 2026-08-17 failure mode.** That one had the guard spawn `bash`, fail, and
  return the empty string, so an absence assertion passed against nothing. Here the title was a
  **real, well-formed fallback** — `Re-verification failed: bounds-ledger (2026-08-23)` — which
  means the alarm path ran and chose the generic branch, rather than the harness producing nothing.
  That distinction is the most useful thing in this file and is why it is written down.

## What was NOT established

**The cause. I did not diagnose it, and this file does not guess at one.**

The tempting explanation is that the synthetic mutation the test writes into `2a.md` did not land
on that run — the CRLF trap this repo has hit repeatedly, which would leave the checker seeing no
per-file drift and falling back to the generic title. That story fits the evidence and has a
precedent in this codebase, which is exactly why it should not be written down as the cause on the
strength of fitting. The 2026-08-17 lesson here was that a plausible, self-blaming causal story
went into six surfaces before anyone checked it, and it was wrong.

## What the next occurrence should do

1. **Do not re-run it first.** The failing state is the evidence and a passing re-run destroys it.
   Capture the run's full output and the tree state before anything else.
2. **Check whether the synthetic mutation landed** — `git diff --numstat` on the mirror file inside
   the test's window. An empty numstat there confirms the mutation story; a non-empty one refutes
   it and the cause is downstream in the title derivation.
3. **Then** decide whether this is a test defect or an alarm defect. They have very different
   consequences: a flaky test costs a retry, a flaky title costs a missed record movement.

## Tracked

`W-10`, re-read 2026-09-22 alongside the other watches. If it has not recurred by then, the row
closes as "seen once, never again" — which is a legitimate outcome and must be recorded as that,
not quietly deleted.
