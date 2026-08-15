# The dry-week counter could not count a drought

**Date:** 2026-08-15 (MT)
**Instrument:** `scripts/catch-rate.mjs` (`npm run catches`) — the Tier-1 leading indicator, shipped 2026-08-13
**Severity:** the decision rule the indicator carries rested on a counter that could not reach its own threshold
**Found by:** reading the script's own printed output during the steward cadence

## What was wrong

`catch-rate.mjs` builds its week buckets from `git log -- ledger/claims.json`. A week therefore
entered the table **only if some commit touched that file**. Weeks in which nothing happened were
not zero rows — they did not exist.

The cosmetic half is that today's table skipped a real week:

```
2026-07-20    0
2026-07-27    4  pin:10c:L pin:38a:L pin:3a:L pin:71a:L
2026-08-10    4 (6 movements) (current, partial)  ...
```

There is no `2026-08-03` row. `git log --format="%h %as" -- ledger/claims.json` confirms no commit
touched the file between `da17be3` (2026-08-02) and `7018cce` (2026-08-11), so that week was
genuinely dry — and the reader was shown a three-week history of a four-week repo.

The load-bearing half is the counter. `dryWeeks` walked backwards over the same buckets, so it
could only ever count weeks that were present. **In a real drought nothing commits `claims.json`
at all** — that file is rewritten only by `extract-pins.mjs` after a `--snapshot`, and a snapshot
only happens on drift — so the quiet weeks never enter the map, the backward walk hits the last
*active* week immediately, and the count stops at 1.

The rule attached to this indicator is *a month of zeros is the signal to adopt a second surface*.
A month is four. The counter could not reach two.

## Both answers, demonstrated

Executed against the pre-fix assembly, with one active week and four calendar weeks of silence:

```
weeks printed: 2026-07-06 2026-08-03
dryWeeks reported: 1   actual quiet weeks: 4
```

After the fix, the same shape is asserted in the self-test — one active week, then silence up to
and including the current partial week:

```
["2026-07-06","2026-07-13","2026-07-20","2026-07-27","2026-08-03","2026-08-10"]   trailingDry = 4
```

and the negative controls are asserted alongside it — a run of weeks with no gaps gains no rows
(`size` stays 2), and a movement in the newest week counts as 0 dry, not 1. A gap-filler
that always inserts would satisfy the first assertion while proving nothing.

## What the cross-family review changed

The branch went through the cross-family review lane armed the same morning, because
`catch-rate.mjs` is a trusted-print instrument — a script whose printed line a later reader
believes. The core fix was confirmed correct; three findings landed on top, all three fixed before
merge.

**F1, material.** `fillDryWeeks` fills up to *and including* the current week, and the first
version of `trailingDry` counted it. The printed table labels that row `(current, partial)` — but
the label sits on the surface a **human** reads while the rule acts on the **number**. So on the
Monday a drought completed its third week, the counter would read 4 and fire *a month of zeros* up
to six days early. A month is four **completed** weeks. `trailingDry` now takes the current week
and skips it, and skips anything dated after it for the same reason. A movement still breaks the
streak wherever it lands, current week included — if the surface moved this week it is not dry,
whatever the completed-week count says.

This is the caveat-on-the-wrong-surface class, and it is worth naming because this lane keeps
producing it: the honest hedge went on the table, not on the figure the decision consumes. It is
the same shape as the header rule on this script's own output, arrived at from the opposite
direction.

**F2.** Commit weeks came from git's `%as`, which is the author-**local** date, while "today" came
from a UTC clock. A Sunday-evening commit in a negative-offset zone buckets one week while *now*
buckets the next, and the movement reads as an immediate dry week. Both sides now use the local
calendar date.

**F3.** A future-dated key from author clock skew sat beyond the fill target with a gap in front of
it. The fill now runs to whichever of the current week and the last key is later, and the
out-of-range weeks are excluded from the count rather than dropped from the table.

Live output now carries the missing week:

```
2026-08-03    0
```

and the summary line reads `across 4 week(s)` rather than 3.

## Why this matters more than the row it adds

The indicator was built because G-1 has no gradient, and its whole decision value sits on the
**zero side** — the ledger's own note says so: *the positive side is an activity ceiling, the zero
side is exact*. The zero side is the half that was broken. The figure a reader would have quoted
("0 consecutive weeks with none") was not a measurement of the surface; it was a measurement of
whether we had committed a file.

This is the lane's own founding defect in miniature, for the third time. An alarm that cannot
fire, a checker that reported a login page as a stale brief, and now a counter whose maximum is
below its threshold — all three read as informative and all three were silent by construction.
**Suspect the instrument before the record** held again.

## Scope of the fix

`fillDryWeeks()` inserts the missing weeks between the first bucket and the current one;
`trailingDry()` is the same backward walk, extracted so the self-test can exercise the counter the
rule consumes rather than the table a human reads. Nothing about what counts as a catch changed —
`movedPins()` is untouched, and the historical figures are identical apart from the added zero row.

Not built: anything that infers activity from a source other than git history. The indicator stays
derived, for the reason it always was — a figure a human retypes weekly is stale between retypes.
