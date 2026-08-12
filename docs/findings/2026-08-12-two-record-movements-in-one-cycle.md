# Two record movements in one cycle — and upstream moved again while we were resolving the first

**Date:** 2026-08-12 (MT), morning session
**Items:** A-2 (drift-resolution log), G-1
**Upstream:** `teorth/optimizationproblems` `400a9bb` → `fe7bf53` → `19694a8`

## What happened

The overnight scheduled run was green at 09:40Z — `No drift. 112 files match upstream
400a9bbe…`, 231 claims, 229 hold, 11 self-tests PASS. Four and a half hours later the local
`npm run check` was red on two files. It went red a second time, on two *different* files,
four minutes after the first resolution was already snapshotted and re-pinned.

Both are **pure record movement** — the fifth and sixth drifts this mirror has seen, and only
the second and third that are records actually moving rather than editorial or additive change.
Both are on constants a working mathematician would recognise by name.

## Drift one — `constants/10a.md` + `README.md`: the Grothendieck constant, both ends at once

Upper and lower bounds improved *simultaneously*, by one paper:

| | before | after |
|---|---|---|
| lower | $K_{DR} + 10^{-12}$ (anchor $\approx 1.67696$) | $\frac{6\pi}{11} \approx 1.71360$ |
| upper | $\frac{\pi}{2\ln(1+\sqrt2)} - 6.039\times10^{-5}$ | $\frac{\pi}{2\ln(1+\sqrt2)} - 10^{-4}$ |

Cited to [SLXCKKM26] — Saha, Li, Xue, Chaudhuri, Klivans, Kothari, Meka,
*New Lower and Upper Bounds for the Grothendieck Constant*, arXiv:2608.11158, 11 Aug 2026.

### Verified before snapshotting, by execution

- **The primary source states the bounds verbatim.** arXiv:2608.11158 fetched, HTTP 200; title,
  all seven authors and the 2026/08/11 date match upstream's citation exactly; and the abstract
  contains the bracket itself — $\frac{6\pi}{11} \le K_G \le \frac{\pi}{2\log(1+\sqrt2)} - 10^{-4}$.
  Worth calling out because it is the *opposite* of the 2026-07-24 method lesson, where none of
  three cited abstracts stated their own bounds and a draft that claimed otherwise nearly went
  out. Here the abstract genuinely is the evidence. Do not generalise from this case either.
- **Arithmetic re-derived, not eyeballed.** $6\pi/11 = 1.713595992867160$ (matches the stated
  $\approx 1.71360$); $\frac{\pi}{2\ln(1+\sqrt2)} - 10^{-4} = 1.782113978191369$ (matches the
  stated $\approx 1.78211$).
- **The old row cross-checks the formula.** $\frac{\pi}{2\ln(1+\sqrt2)} - 6.039\times10^{-5} =
  1.782153588191369$, reproducing the *previous* README decimal `1.78215358819137` to fifteen
  significant figures. Our prior mirror state and upstream's closed form agree independently.
- **Direction.** Lower bound rises ($1.71360 > 1.67696$), upper bound falls
  ($1.78211 < 1.78215$). Both are improvements; neither is a widening.
- **The tenths-digit claim is arithmetically sound given the bounds:** $[1.71360, 1.78211]
  \subset [1.7, 1.8)$. We verify that the interval forces the digit — not the theorems that
  produce the interval.
- **Citation keys audited:** 12 used, 12 defined, zero dangling. The old permuted key
  `[LSXKKMC26]` is *absent*, so this is a completed rename and not a half-renamed state — the
  same check that mattered on 15a yesterday.

### One thing that looks like a defect and is not

Upstream's note line states the bracket as $1.71360 \le K_G^{\mathbb R} \le 1.78212$, while the
table row says $\approx 1.78211$. The true value is $1.782113978\ldots$, which rounds to
`1.78211`. **This is bound-safe rounding, not a typo:** for an *upper* bound, rounding up keeps
the statement true, so $K_G \le 1.78212$ holds. Recorded explicitly because this lane has now
seen a rounding convention masquerade as an error twice — W-2 (Haugland, 2026-07-23) was the
first, and it cost a day. **Do not file this as a correction candidate.**

## Drift two — `constants/2a.md` + `README.md`: Crouzeix's conjecture, claimed solved

Upper bound $1+\sqrt2 \approx 2.41421$ [CP2017] → $2$ [LS2026], matching the trivial lower
bound, so $C_2 = 2$. Cited to Lorist and Schwenninger, *A solution to Crouzeix's conjecture*,
arXiv:2608.03841, 4 Aug 2026.

Verified the same way: HTTP 200, title and both authors and the 2026/08/04 date match, and the
abstract describes exactly the method upstream paraphrases — a perturbation lemma for
2-dilations applied to the iterates $f^n$ in the double-layer potential representation. Keys:
10 used, 10 defined, zero dangling. $2 < 2.41421$, so the bound improves.

### What we are NOT asserting, and why the pin rule earns its keep here

Upstream is careful: its own words are "claimed proof" and "the conjecture is (claimed to be)
settled". **Our generated pins assert listing position, never correctness** — so the ledger
records that this row is what upstream currently lists, and asserts nothing about whether
Crouzeix's conjecture is proved. If the proof is withdrawn and the row reverts, our alarm fires,
which is the correct behaviour. That rule has felt pedantic since 2026-07-24. This is the
highest-profile row it has ever covered, and it is the reason we can mirror a claimed solution
to a famous conjecture without ourselves claiming it.

## The method lesson: a snapshot is evidence about fetch time, not about now

Drift one was verified, snapshotted, re-pinned, and `git diff --numstat` confirmed exactly two
mirror files changed. That is the full ratchet, and it would have been reasonable to commit
there. The next `npm run check` — run only to confirm green before committing — came back red
on 2a. **Upstream had pushed again in the four minutes since our snapshot.**

Had the cycle ended at the ratchet's own output, the commit message would have said the drift
was resolved while the mirror was already stale, and the CI run for that commit would have gone
red minutes later. That is precisely the shape of the 2026-08-11 evening incident, where a
close-out verified CI green *before* its own final push and a red run sat unnoticed for seven
hours.

**Rule, stated so it can be followed mechanically:** the evidence that the mirror is in sync is
a `npm run check` that exits 0 *after* the last snapshot, read as an exit code and not through a
pipe. The snapshot's own success line is not that evidence.

## State after resolution

`npm test` exit 0; `npm run check` exit 0 — `No drift. 112 files match upstream 19694a8f…`,
`231 claim(s): 229 hold, 0 broken/unreachable, 2 unverified (manual)`, brief in sync (4 of 4
dated blocks). Mirror stays 112 files; **exactly three generated pins moved** — `pin:10a:U`,
`pin:10a:L`, `pin:2a:U` — confirmed from the `claims.json` diff rather than inferred from the
file count (`pin:10b:U` and `pin:2a:L` appear in the diff as unchanged context, which is how a
count read off the diff hunk rather than off the changed lines comes out too high). Ledger
unchanged at 231 claims.

W-3's two advisory legs read unchanged from this machine: erdosproblems.com/36 still shows
`0.380876` and is still dated `23 January 2026`. North star unmoved.
