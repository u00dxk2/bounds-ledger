# The failure count could not see the population it was counting

**2026-09-01 · instrument-facing · found while resolving `A-20`'s pre-registered discriminator**

## What happened

`A-20` — should the fetch layer retry with backoff on 429/502 — carried a pre-registered
gate: count transient transport failures in scheduled and push runs since 2026-08-18, and
if fewer than three occurred, the count cannot discriminate "worth a retry" from "noise",
so the read is inapplicable and the window extends.

The count stood at **2 against `N_min = 3`**, with one row sitting exactly on the boundary.
Issue #25 was filed `2026-08-18T15:57:50Z` with a transport-shaped title — *"Check error:
bounds-ledger re-verification could not complete"* — while `gh run list --status failure`
showed **no failed run on 2026-08-18 at all**, over a window reaching back to 2026-07-25.
The row said, correctly, that resolving issue #25's originating run *was* the decision.

## The resolution

```
gh api repos/u00dxk2/bounds-ledger/actions/runs/32157521934/attempts/1 --jq .conclusion
failure          # updated 2026-08-18T15:57:53Z, head_sha 95c12f1

gh api repos/u00dxk2/bounds-ledger/actions/runs/32157521934/attempts/2 --jq .conclusion
success          # positive control: the endpoint reports real per-attempt conclusions
```

The run failed on attempt 1 — filing issue #25 three seconds before the attempt's final
update — was re-run by hand, and attempt 2 passed.

## The finding

**`gh run list` reports only the LATEST attempt of a run.** A run that failed and was then
re-run to green does not appear under `--status failure`. It does not appear as a failure
anywhere in that view; it reads `success`, indistinguishable from a run that never failed.

So a failure count taken from `gh run list` **undercounts by exactly the re-run
population** — and for a question about *transient* failures, the re-run population is
precisely the population of interest. A transient failure is, almost by definition, one
somebody re-ran and cleared. The instrument the counting procedure named could not see its
own most relevant case.

This is the CI-layer sibling of the 2026-08-26 rule that a failed run is not a failed
check and the job layer must be read. Same shape, one level further out: the run-level
view is a summary, and a summary of attempts is not the attempts.

**Read attempts, not runs, whenever the question is "did this ever fail":**

```
gh api repos/OWNER/REPO/actions/runs/<id> --jq .run_attempt      # >1 means look closer
gh api repos/OWNER/REPO/actions/runs/<id>/attempts/<n> --jq .conclusion
```

An `Issue`-filed-but-no-failed-run mismatch is the tell, and it is worth treating as a
signal rather than a puzzle: the alarm files from inside the run, so a filed issue is
evidence of a failing attempt that the run list may have since overwritten.

## What it changed

The count resolves to **3 against `N_min = 3`**. Branch 0 does not apply and the registered
branch fires: ship a bounded retry with backoff that **logs every retry it performs**. The
logging is not decoration — `A-20 note3` records that a silent retry would have hidden both
of the 2026-08-18 observations that motivated the item, so the flake rate has to stay
visible rather than being smoothed away.

## The near miss

Before reading `onTrigger`, this session had assembled an evidenced case for the opposite
answer: 61 consecutive green runs back to 2026-08-27, zero transport failures in seven
days, and a ladder argument that adding retry logic to two trusted network instruments buys
fewer honest reds at the cost of new failure surface. It was a reasonable case and it was
about to override a discriminator registered precisely so that a day's reasoning could not
decide this.

`A-20 note6` records this lane making the identical error on 2026-08-27 in the *other*
direction — forcing a ship on one observation, against the same `N_min = 3`. That the error
recurs in both directions is the argument for pre-registration itself: the failure is not a
bias toward shipping or toward declining, it is the pull of the day's own evidence against
a rule written when the question was cold.

**A pre-registered gate outranks the day's reasoning, including reasoning that feels well
evidenced — and especially then.**
