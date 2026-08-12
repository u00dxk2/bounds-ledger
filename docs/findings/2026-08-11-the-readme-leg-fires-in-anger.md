# The README leg fires in anger — and the improvement line disagrees with the table

**Date:** 2026-08-11 (MT), evening session
**Items:** A-2 (drift-resolution log), W-5 (mirror blind class, closed 2026-08-10), G-1
**Commit:** `d30d4e4`
**Upstream:** `teorth/optimizationproblems` `dee1660` → `400a9bb`

## What happened

The overnight drift job went red at `64b54ca`: two mirrored files drifted and `pin:15a:U`
reported BROKEN. Both were verified against primary sources, then snapshotted and re-pinned.

### `constants/15a.md` — editorial, and the check that mattered

Upstream renamed five bibliography keys in the matrix-multiplication-exponent file:
`L2014 → LG2014`, `DWZ23 → DWZ2022`, `WXXZ24 → VXXZ2023`, `ADWXXZ25 → ADVXXZ2024`,
`BCRL79 → BCRL1979`. Every bound value is byte-identical — `2.373689703`, `2.3728639`,
`2.371866`, `2.371552`, `2.371339` all unchanged. No record moved.

Editorial drift is still real drift, so it got a real check rather than a wave-through. The
failure mode worth looking for in a rename is a **half-renamed state** — a table row citing a
key the reference list no longer defines. Enumerated on the live file: every bracketed
citation key in it resolves to a definition in its References (30 distinct, zero dangling), and none of the five old keys survives anywhere
in the file. The rename is complete and internally consistent.

`pin:15a:U` broke because the last-listed row cites one of the renamed keys. That is the
post-snapshot ratchet working as designed, not an upstream error.

### `README.md` — W-5's first fire on a real change

The 3b summary row went `>1.77898` → `1.77898 (1.77898884*)`, and a recent-improvements line
was added: an improved lower bound of `1.77898884` by Mosaic Intelligence, citing a 13-point
entropy certificate.

**Our mirror's `constants/3b.md` already carried the `[MI2026]` row** — it was blessed in an
earlier snapshot. So every constants file was byte-identical today, and a mirror scoped to
`constants/**` would have reported *nothing*. The entire change lives in what upstream declares
it stands behind. That is precisely the blindness W-5 was opened for (upstream `dee1660`,
2026-08-02, where our alarm named three constants files and was silent on the largest semantic
change of the day) and closed on 2026-08-10 by pulling the repo-root README into the mirror.

Ten days later it caught the case it was built for, on a live change nobody staged.

Verification was of the **cited artifact, not the mathematics**: DOI `10.5281/zenodo.20794135`
resolves HTTP 200 to *"Certified sum-difference lower-bound certificates for C_3a, C_3b, and
C_3c"*. We assert listing position. We do not assert the bound.

## The catch: upstream's table and its improvement line disagree about 3b

Upstream's README states its own convention explicitly:

> Bounds for which the level of available verification is currently at minimal levels will be
> marked with an asterisk in the table below.

The 3b table row now carries that asterisk — `1.77898 (1.77898884*)`. The improvement line
announcing the same bound carries **neither** the asterisk nor the `(unverified)` tag that every
comparable line carries:

```
- [3b](…) **improved lower bound:** $C_{3b} \geq 1.77898884$ by Mosaic Intelligence, …
```

Before calling that an inconsistency, the practice was enumerated rather than eyeballed — all 17
improvement lines against all 111 table rows:

| group | lines | table row asterisked? |
|---|---|---|
| carries `(unverified)` | 6 | 6 of 6 yes |
| no tag, no asterisk on the value | 9 | 0 of 9 yes |
| no tag, asterisk on the value (3a ×2) | 2 | 2 of 2 yes |
| **3b — no tag, no asterisk on the value** | **1** | **yes** |

The practice is uniform, and 3b is the single entry that departs from it. 3a is a partial
precedent for dropping the `(unverified)` tag, but it still carries the asterisk on the value, so
a reader following the stated legend still sees the mark. On 3b a reader of the improvement line
alone sees an unqualified improved lower bound while the table says verification is at minimal
levels.

**The honest framing**, which is what would go upstream — and the strong version does not survive
its own audit. The stated legend scopes the asterisk to "the table below", so the improvement
line is not, strictly, governed by it, and someone could defend the omission as a changelog entry
carrying no verification status at all. That defence is what the enumeration answers: on 6 of 6
comparable entries upstream *does* state status on the changelog line, so the claim rests on
departure from upstream's own uniform practice, not on breach of a stated rule. So: these two
surfaces present the same bound differently, and
upstream should decide which is right. We are not claiming the bound is unverified — we are
claiming one of its two surfaces is out of step with the other. Either the table's asterisk is wrong or the
improvement line is missing its tag; both fixes are one word.

An enumeration artifact was caught and corrected on the way, worth recording because it would
have produced a second, false exception: the `[22]` improvement line points at a table row
labelled `[22a]`, so a naive id-join reports "tagged unverified but row not asterisked". The row
*is* asterisked (`10.76 (10.02*)`). The id label and the URL slug disagree across several entries
— join on both or you invent findings.

## Status

**Proposed, not sent.** Outward contact is David-gated (`A-14`). This is the same shape as the
correction that became PR #141: a one-line, checkable, non-mathematical fix to a page that
already documents the rule it departs from.

## Method lessons

1. **A detector built for a hypothetical is worth keeping until it fires on something real.** W-5
   was opened on a change we noticed by hand after the fact. It sat closed-and-quiet for ten days
   and then caught the live case unaided. The argument for scope was semantic ("where upstream
   declares what it stands behind"), not statistical — and the statistical case would have said
   the README was one file in 112.
2. **A blessed row can make today's change invisible.** Because `3b.md` already held the
   `[MI2026]` row, the constants layer was silent *precisely on the constant that moved*. When a
   report names a file, ask what the unchanged files would look like if the same event had been
   staged one snapshot earlier.
3. **Enumerate the convention before naming the exception.** The 3b claim is only worth sending
   because the other 16 lines were checked; and the join that produced it had a bug that would
   have manufactured a second finding. Recognition-over-recall applies to upstream's rules as
   much as to our own.
