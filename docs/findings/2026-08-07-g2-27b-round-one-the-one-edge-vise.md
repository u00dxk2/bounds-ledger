# G-2 / 27b round one: eleven candidates, zero survivors, and a vise that closes on exactly one

**Date:** 2026-08-07 (MT) · **Target:** 27b, Earth-Moon problem (max chromatic number of a
biplanar graph; record lower bound **9**, Sulanke 1980) · **Instrument:**
`search/27b/propose-round.mjs` (self-test wired into `npm test` + CI, 8th self-test)

## What ran

Eleven proposed construction families, each built as an explicit graph and put through four
ordered gates, cheapest first:

| Gate | Test | Status |
|---|---|---|
| `edge-bound` | `m <= 6n-12` (two planar layers hold `3n-6` each) | executed |
| `k9-free` | `omega(G) <= 8` | **CITED, not executed** — see provenance |
| `chromatic` | exact `chi(G) >= 10`, branch and bound | executed |
| `split` | random-restart greedy biplanar partition, then `verifyCertificate` | executed |

**Result: 0 certified, 11 eliminated** — 5 at `edge-bound`, 2 at `k9-free`, 4 at `chromatic`.
Machine-readable log: `search/27b/round1-results.json`.

## The finding: two unrelated families both land exactly one short

This is the part worth keeping. The eliminations are not scattered — they converge.

**The join family (Sulanke's own family, pushed to 10).** `chi(A join B) = chi(A) + chi(B)`, so
the direct successor to the record is `C5 + K7` (3+7). It fails twice over: `m=61` against a
budget of `6n-12 = 60`, **over by exactly one edge**, and `omega = 9`. `W5 + K6` (4+6) is also
`n=12, m=61` — over by exactly one.

Then buy that one edge back. There are two places to take it from, and both cost the graph:

- **from inside the clique** (`C5 + K7` minus one K7 edge): budget now met exactly (`m=60 =
  6n-12`), and `omega` drops to 8 — it clears the clique gate. But `chi = 9`. **One colour
  short**, which is to say: back to the record.
- **from the join** (`C5 + K7` minus one cross edge): budget met exactly, but `omega` stays
  **9**, so it dies on the clique gate instead.

**The sparse family, coming at it from the other side.** Circulants sized to sit inside the
budget rather than fight it: `C12(1..5)` (`m=60`, exactly on budget) gives `chi=6`;
`C13(1..5)` gives `chi=7`; `C17(1..5)` — the largest of that shape still inside the budget —
gives **`chi=9`. One colour short again.**

So a family built by stacking chromatic number until it breaks the density cap, and a family
built by respecting the density cap and asking how much chromatic number is left, arrive at the
same place from opposite directions: **nine.**

The vise is legible once stated. Thickness 2 caps average degree below 12, so a 10-chromatic
biplanar graph sits near the Brooks boundary, where graphs are pushed toward near-complete local
structure — and thickness 2 simultaneously forbids `K9`. The record has not moved since 1980,
and round one is a small piece of executed evidence for why: the obvious constructions are not
merely unlucky, they are squeezed from both sides at once.

## What this changes about round two

Every death was one of two sentences: *too dense to be biplanar*, or *not chromatic enough*.
Nothing died for a subtle reason. That points somewhere specific:

**Stop proposing high-chromatic graphs and hoping they are biplanar. Generate biplanar graphs by
construction and measure their chromatic number.** Glue two planar triangulations on a shared
vertex set: the union is biplanar *by construction* — the `edge-bound`, `k9-free` and `split`
gates are all satisfied for free, and the only open question is `chi`. That inverts the search
into the one gate we can compute exactly and cheaply, and it searches the space where
biplanarity costs nothing instead of the space where it is the binding constraint.

Round one's gates stay useful under that inversion: they become the check on candidates arriving
from elsewhere, not the search itself.

## Provenance: the one thing here we did not execute

`theta(K9) = 3` (Battle-Harary-Kodama 1962; `K9` and `K10` are the exceptions to
`theta(Kn) = floor((n+7)/6)`). We cannot brute-force it — `K9` has 36 edges, so an exhaustive
split scan is `2^36`, and greedy restarts failing proves nothing about non-existence.

So the `k9-free` gate is labelled **CITED** in the code, in every console line, and in the JSON
log, and is never presented as an executed result. Note the failure direction, which is what
makes it safe to use at all: a wrong citation can only make us **skip a family we should have
searched** — it can never make us **ship a false certificate**, because anything we would
actually claim is gated by the executed verifier alone. That asymmetry is the reason the gate is
allowed to run on a citation; a gate whose error pointed the other way would not be.

The `split` gate has the same honesty problem in miniature and is handled the same way: a
*found* split is verified and conclusive, a *not-found* is reported `INCONCLUSIVE` and is
explicitly not a disproof of biplanarity.

## Method note: the candidate labels lied, and only the output said so

The first run produced two differently-named candidates — "minus one K7 edge" and "minus one
cross edge" — with **identical** `n=12, m=60, omega=9`. They were the same graph. The helper
dropped the *last* edges of the list, and in a join the trailing edges are all cross edges, so
the clique-edge candidate had never been built. The label asserted one construction; the code
performed another.

Nothing caught this except reading the numbers and noticing two rows that should have differed
did not. The self-test did not catch it — it tests the *gates*, and the gates were correct; the
defect was in the *candidate list the gates were pointed at*. That is the A-13 F-4 shape again:
a verified probe licenses its own claim and nothing wider. Proving the four gates fire and stay
silent said nothing about whether the graphs fed to them were the graphs advertised.

Fixed by replacing the positional drop with `removeEdge(g, u, v)`, which throws if the named
edge is not present — so a mislabelled candidate now fails loudly instead of quietly becoming
its neighbour. And the correction mattered to the result: the real clique-edge candidate clears
the `k9-free` gate and dies at `chromatic` with `chi=9`, which is precisely the near-miss the
finding above is built on. The buggy version had hidden it.

## Guard

`node search/27b/propose-round.mjs --selftest` — each of the four gates proven to fire on a
graph that trips it and stay silent on one that does not; the split search proven to return
both of its outcomes; Sulanke's graph re-certified at target 9 end-to-end. Wired into `npm test`
and into `.github/workflows/reverify.yml`.

The CI wiring was itself proven both ways rather than assumed: removing the workflow step made
`reverify.test.mjs` exit 1 naming `node search/27b/propose-round.mjs --selftest` as unguarded,
and restoring it returned exit 0 with `8 self-tests present in CI`. The mutation was confirmed
to have landed with `git diff --numstat` before the result was believed (CRLF: a `\n` pattern
silently no-ops here).

## Scope honesty

No mathematical claim is made by any of this. Round one eliminated eleven candidate
constructions and produced no certificate. The instrument asserts nothing about the Earth-Moon
problem beyond the four gates' outputs on eleven specific graphs, and `chi=9` results merely
re-derive a bound that has stood since 1980 — they are not a rediscovery claim, and are not
worth reporting anywhere as one.
