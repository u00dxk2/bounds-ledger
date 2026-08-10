# G-2 / 27b round three: the record's own family cannot reach ten, and it is arithmetic that says so

**Date:** 2026-08-10 (MT) · **Target:** 27b, Earth-Moon problem (max chromatic number of a
biplanar graph; record lower bound **9**, Sulanke 1980) · **Instrument:**
`search/27b/round3-seeded.mjs` (self-test wired into `npm test` + CI, 11th self-test)

## Why round three exists

Round one proposed structured high-chromatic graphs and every one died by a razor-thin margin —
one edge over the biplanar budget, or one colour short. Round two inverted it, built graphs that
were biplanar by construction, and topped out at χ=8 — one colour *below* the record — even after
reaching Sulanke's exact density at his exact vertex count. Both rounds agreed from opposite
directions that the record is a **designed** object, and round two's finding asked round three to
stop searching the generic space and seed the search with the design.

It did. The instrument has two halves, and the cheap half turned out to be the decisive one.

## Part A — the family is closed, by edge count alone

Sulanke's graph is `K6 ∨ C5` (a 6-clique joined to a 5-cycle). That family has χ = r+3, so χ ≥ 10
needs r ≥ 7. Every biplanar graph obeys `m ≤ 6n−12` — two planar layers of at most `3n−6` each.
Scanning `K_r ∨ C_s` for r = 4..9 and odd s = 3..11 against that bound:

| | |
|---|---|
| family members scanned | 30 |
| members with χ ≥ 10 | 15 |
| of those, fitting `m ≤ 6n−12` | **1** |

The near misses are as thin as round one's were. `K7 ∨ C5` is **one edge** over budget (n=12,
m=61, budget 60). `K8 ∨ C3` is also one edge over (n=11, m=55, budget 54). Every other χ ≥ 10
member misses by 5 to 38.

**The single survivor is `K7 ∨ C3` — and joining a 7-clique to a triangle produces `K10`.**
Verified by execution rather than by inspection: the construction returns n=10 with m=45, and
C(10,2) = 45, so the graph is complete. Its χ was computed exactly, not taken from the r+3 formula
— 10, as the formula would have it.

So the family's only budget-surviving path to ten colours is `K10` itself, whose thickness is 3
(Battle–Harary–Kodama 1962; the classical `θ(K_n)` formula has exactly two exceptions, n = 9 and
n = 10). `K10` is therefore not biplanar, and the family is closed.

**Where this rests on a citation, and it must be said plainly:** the edge-budget half is ours and
runs; the last step — `θ(K10) = 3` — is cited, not executed. Our verifier can exhibit a biplanar
split when one exists, but it cannot prove that none does, and non-existence is exactly what this
step needs. It is the same citation round one leaned on for `K9`, and it carries the same status:
cited, with an independent executed fact sitting next to it (round two exhibited a split for
`K9 − e`), not proven here.

## Part B — the seed carries all of the chromatic number, and the greedy carries none

The other half is what round two's finding actually asked for: hold a verified certificate's layers
fixed, add the new vertices, and double-greedy only the edges the seed does not already own.

| `n` | best χ | `m` / budget | leftover | χ over 40 seeds |
|---|---|---|---|---|
| 11 | 9 | 50 / 54 | 5 | 9:1 (nothing random to do) |
| 12 | 9 | 57 / 60 | 9 | 9:40 |
| 13 | 9 | 64 / 66 | 14 | 9:40 |
| 14 | 9 | 70 / 72 | 21 | 9:40 |

Every graph re-checked end to end by `verifyCertificate`. Read it against round two's table and the
result is sharp in both directions:

- **Seeded, the search never falls below 9.** Round two's unseeded greedy reached 8 on 209 of 300
  seeds at n=10 and only 54 of 300 by n=13. Seeded, it is 9 on 40 of 40 at every n tested. The
  structure survives the growth.
- **Seeded, the search never rises above 9 either.** 160 growths, zero reached 10.

So the design contributes the entire ninth colour and the greedy contributes nothing on top of it.
That is a cleaner statement than round two could make: it was possible that unseeded growth
underperformed only because it never stumbled onto the structure. It did not — handed the structure
outright, it still adds no colour.

The leftover column behaves as round two's finding predicted it would: 5 → 9 → 14 → 21 as `n` grows.
The price of biplanarity rises faster than the extra vertices can pay for it.

## What this closes and what it does not

**Closes:** the clique-join-odd-cycle family as a route to χ=10, and the "extend the record graph
generically" idea. Both were live hypotheses this morning; neither needs another search.

**Does not close:** the Earth-Moon problem, obviously, or even the structured-search programme.
What it does is delete two branches cheaply — one by arithmetic in milliseconds, one by 160 verified
growths — which is the useful outcome for a lane that has to choose what to run next.

**Round four, if there is one, has to change the shape.** Every construction tried so far is a join.
The budget scan says why joins are the wrong instrument: a join adds `r·s` edges to buy three
colours, and the `6n−12` budget grows by only 6 per vertex. The next family should buy colour more
cheaply per edge than a complete join does.

## Guard

`node search/27b/round3-seeded.mjs --selftest`, wired into `npm test` and
`.github/workflows/reverify.yml`. Both instruments are proven to give **both** answers:

- The budget test **fires** on `K7 ∨ C5` (one edge over) and **stays silent** on Sulanke's own
  graph. That second half is load-bearing — a budget test that flagged the record would have closed
  the family by arithmetic error and the conclusion above would be worthless.
- The seeded grower's output verifies against the independent verifier, **every one of the 50 seed
  edges is asserted present in the union** (a grower that dropped the design would silently report
  round two's numbers under round three's name), and a **corrupted seed partition is rejected** —
  confirmed to throw for the right reason, `seed layers are not planar`, not by luck elsewhere.
- Chromatic numbers in the self-test are **computed**, never taken from the `r+3` formula.
- The prng seed is pinned, since an unreproducible search result is not a result.

## Scope honesty

**No mathematical claim, and nothing here is reportable to anyone.** Zero certificates at the
target, best χ found is 9 — equal to the record, not above it, and only because we handed the search
the record graph to begin with. The record lower bound of 9 stands untouched. The `K10` step rests
on a citation as stated above. Part B's negative result is a statement about *this* greedy over
*this* seed at n ≤ 14, not about biplanar graphs in general.
