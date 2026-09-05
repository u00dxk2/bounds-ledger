# Finding — Haugland 2016 final digit: 0.380927 vs 0.380926 (W-2)

**Date:** 2026-07-23 · **Status:** REOPENED 2026-09-05 — upstream changed to the form this finding
called not-bound-safe; see the reversal at the foot. The 2026-07-23 verdict below is left exactly as
written, because it was correct about the table it read · **Item:** W-2

## Verdict

**Not a typo. A rounding-direction convention difference.** Haugland's paper (arXiv:1609.08000, final section) states the bound to full precision: the 51-step function "yields the value **0.3809268534330870**".

- **Tao's table (`constants/1b.md`): `0.380927`** — round-to-nearest at 6 decimals (7th digit is 8 → round up). Also *bound-safe*: rounding an upper bound up preserves its validity.
- **Haugland's abstract: "0.380926..."** — leading digits with a trailing ellipsis (digits-of-value notation, also correct).
- **Wikipedia: `0.380926`** — the same truncation with the ellipsis dropped. Strictly, 0.380926 alone is not a valid upper bound (the proved bound exceeds it), but as citation shorthand it's common.

Both primary presentations are internally consistent; Tao's rounded form is arguably the *better* citation form for an upper bound. **No one-character PR to `teorth/optimizationproblems` — the repo is right.**

## Provenance

- arXiv:1609.08000 abstract (fetched 2026-07-23): "improves the upper bound from 0.382002... to 0.380926..."
- Paper final section via ar5iv (fetched 2026-07-23): "yields the value 0.3809268534330870" — consistent with reconciliation #1's independent ≈ 0.3809268.

## Deliberately not pursued

A Wikipedia edit restoring the ellipsis (or switching to 0.380927) would be outward contact for a cosmetic nuance — low value, skipped.

---

## Reversal — 2026-09-05

**Upstream changed `constants/1b.md` from `0.380927` to `0.380926`.** The drift alarm caught it in
the 09:23Z scheduled run and hand claim C-2 went BROKEN, which is the claim doing its job: it was
pinned to the digit precisely because this finding said the digit was the interesting thing.

**Primary source re-fetched today, not recalled.** The ar5iv rendering of arXiv:1609.08000 contains
the exact string `0.3809268534330870`. Positive control that this is the paper and not a bot page or
a neighbouring preprint: the same fetch contains "minimum overlap" seven times and "Haugland" four
times.

**What that makes the new figure.** 0.380926 < 0.3809268534330870, so the value now listed in a table
headed "Known upper bounds" is strictly below the bound the cited paper proves. Read as a bound at
the precision shown, it asserts something Haugland did not establish. The old entry, 0.380927, was
the round-to-nearest form and was bound-safe. This is the exact distinction the 2026-07-23 verdict
drew when it concluded the repo was right — and the repo has now moved to the other side of it.

**What is NOT claimed here.** Whether the table's convention across all rows is "a valid bound" or
"the leading digits of the value" is not established. Several neighbouring rows (0.380924, 0.380876,
0.380871, 0.380868) may be truncations of longer values too, in which case the H2016 row is now
CONSISTENT with its neighbours and the whole column carries the caveat rather than this one cell.
That question decides whether an upstream report is a one-cell correction or a convention note, and
it has not been done. Nobody should file anything on the strength of this section alone.

**Status of the outward question.** Filing anything upstream is David-gated behind an adversarial
review (the standing outward gate). Surfaced as a decision the same day rather than carried.
