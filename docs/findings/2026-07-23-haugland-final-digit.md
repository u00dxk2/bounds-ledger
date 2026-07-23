# Finding — Haugland 2016 final digit: 0.380927 vs 0.380926 (W-2)

**Date:** 2026-07-23 · **Status:** RESOLVED — no upstream PR warranted · **Item:** W-2

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
