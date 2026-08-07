# G-2 / 27b round two: the inverted search saturates the density budget and still lands one *below* the record

**Date:** 2026-08-07 (MT) · **Target:** 27b, Earth-Moon problem (max chromatic number of a
biplanar graph; record lower bound **9**, Sulanke 1980) · **Instrument:**
`search/27b/round2-grow.mjs` (self-test wired into `npm test` + CI, 9th self-test)

## What round one said to do, and what round two did

Round one proposed high-chromatic graphs and asked whether they were biplanar; all eleven died
saying either *too dense to be biplanar* or *not chromatic enough*
(`docs/findings/2026-08-07-g2-27b-round-one-the-one-edge-vise.md`). So round two inverted it:
build graphs that are **biplanar by construction** and measure how much chromatic number they
carry.

Method, reusing already-verified components rather than adding machinery: shuffle the edges of
`K_n`; grow layer 1 by adding an edge iff the layer stays planar under the exact DMP test,
giving a maximal planar subgraph; grow layer 2 the same way from what is left. The union is
thickness-≤2 by construction. Edges `K_n` had that neither layer could take are absent from the
union — the *leftover*, which is the price of biplanarity.

## Result: a hard ceiling at 8, and it gets worse as `n` grows

`n` = 9..13, 300 seeds each, every reported graph re-checked end-to-end by `verifyCertificate`:

| `n` | best χ | `m` / budget `6n-12` | leftover | χ spread over seeds |
|---|---|---|---|---|
| 9 | 8 | 35 / 42 | 1 | 7:14 8:286 |
| 10 | 8 | 43 / 48 | 2 | 7:91 8:209 |
| 11 | 8 | 50 / 54 | 5 | 6:18 7:152 8:130 |
| 12 | 8 | 57 / 60 | 9 | 6:25 7:184 8:91 |
| 13 | 8 | 63 / 66 | 15 | 6:38 7:208 8:54 |

**Best χ found anywhere: 8.** Not 10, and not even 9 — the inverted search tops out one colour
*below* the record it was meant to beat. And the distribution degrades monotonically with `n`:
at `n`=9, 286 of 300 seeds reach 8; by `n`=13 only 54 do, while the leftover grows 1 → 15. Bigger
graphs are worse for this method, not better.

## The sentence worth keeping

**At `n`=11 the round-two best has exactly 50 edges and χ=8. Sulanke's graph has `n`=11 and
exactly 50 edges and χ=9.**

Same vertex count, same edge count, one colour apart — both verified by the same code in the
same run. Density is therefore *not* what the record is made of. The naive objective behind the
inverted search ("saturate the budget and the colour will follow") is measurably wrong, and this
is the cleanest possible refutation of it: the search reached Sulanke's exact density and still
could not reach his chromatic number.

What separates them is structure. Sulanke's graph is a designed object — a 6-clique joined to a
5-cycle — and the double-greedy explores the *generic* part of the biplanar space, where that
structure essentially never arises by chance.

## A side result, and an honest note about what it does and does not do

At `n`=9 the union has 35 edges with leftover 1. `K9` has 36. So the grower produced **`K9`
minus exactly one edge, and the verifier confirmed both layers planar** — an executed
demonstration that `K9`-minus-an-edge is biplanar, with χ=8.

That is *consistent with* the `theta(K9) = 3` citation round one leaned on (`K9` itself needs
three layers; removing a single edge drops it to two, putting `K9` exactly at the boundary). It
is **not** a proof of that citation, and must not be recorded as one — we exhibited a split for
`K9 - e`, which says nothing on its own about the non-existence of a split for `K9`. The citation
remains cited. What changed is that it now has an independent executed fact sitting next to it
that would have looked strange had the citation been wrong.

## What round three should do

Stop searching the generic space. Both rounds now agree from opposite directions that the record
is a *structured* object: round one showed the structured constructions fail only by
razor-thin margins (one edge, one colour), round two shows the unstructured ones do not get close
at all. So seed the growth with structure — take a designed core (a clique joined to an odd
cycle, the shape that produced the record) and grow the layers around it under the same
by-construction discipline, rather than growing from a shuffled `K_n`.

Concretely, the next instrument should accept a *seed subgraph* held fixed in the layers and
double-greedy only the remaining edges. The leftover column above is the thing to watch: it is
the price the construction pays, and at `n`≥12 it is already large enough to be where the missing
colour is going.

## Guard

`node search/27b/round2-grow.mjs --selftest` — the grower's output is checked against the
independent verifier, and that same verifier is proven to **reject** a corrupted partition (an
edge moved into layer 1 that does not belong) and a nonplanar layer (`K5` alone). Without the
second half the first would pass just as happily against a verifier that always said yes. Seed
reproducibility is pinned too, since an unreproducible search result is not a result. Wired into
`npm test` and `.github/workflows/reverify.yml`.

## Method note: the search ran as an import side effect

Cross-checking the `n`=11 comparison meant importing `round2-grow.mjs` to reuse one function —
and that silently re-ran the entire multi-minute search, printing a second full result table into
the middle of the check. It was harmless here only because the numbers happened to agree.

The hazard is not the wasted time, it is that a stray side effect prints output that looks
exactly like the answer to the question being asked, at precisely the moment attention is on the
comparison rather than on the plumbing. Both round scripts export functions *and* ran their main
body at import; both now guard on being the entry point, proven both ways — importing them prints
nothing and still exposes `growBiplanar` / `runGates`, while direct invocation still runs.

## Scope honesty

No mathematical claim. Zero certificates at the target, best χ found is 8, and the record lower
bound of 9 stands untouched — round two did not even reach it. Nothing here is reportable to
anyone, and the `K9 - e` observation above is a demonstration of biplanarity for one graph, not
a thickness result.
