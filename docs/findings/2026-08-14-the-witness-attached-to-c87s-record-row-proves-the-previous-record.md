# The explicit witness on C_87's record row computes to the *previous* record

**Date:** 2026-08-14 (MT)
**Surface:** `teorth/optimizationproblems`, `constants/87a.md`, added upstream `e70b4a4` (an upstream sha; it does not exist in this repo) on 2026-08-14T07:03:36Z
**Status:** verified by exact arithmetic; **not reported upstream** — that is outward contact and needs an adversarial review plus David's gate
**Severity:** the page's own numbers are inconsistent with each other. No bound in our ledger moved.

## The claim on the page

`constants/87a.md` is a new constant page for Martinet's constant for totally real number
fields. Its upper-bounds table has four rows; the last is the current record:

> | $857.567$ | [HMR2019] | Hajir–Maire–Ramakrishna, "cutting towers" via the refined
> Golod–Shafarevich criterion; explicit example is an $8$-th root class-field tower over the
> totally real field of [HM2002] with $2$-class group of rank $8$, yielding
> $\mathrm{rd} \le 3^4\cdot 5^4\cdot 7^4\cdot 13^2\cdot 29^4\cdot 53^2\cdot 109^2 \le 857.5662\dots$
> Current record. |

The row one above it is:

> | $913.493$ | [Mar2006] | Martin, further refinement of the [HM2002] construction. |

## What is wrong

**1. The inequality as typeset is false by twenty-one orders of magnitude.**

$3^4\cdot 5^4\cdot 7^4\cdot 13^2\cdot 29^4\cdot 53^2\cdot 109^2 = 484{,}887{,}097{,}019{,}201{,}067{,}725{,}625$

That is a 24-digit integer. The page asserts it is $\le 857.5662$. It is not. A root
discriminant is $\mathrm{rd}(K) = \Delta_K^{1/[K:\mathbb{Q}]}$, so the intended reading
must take a root of that product; the root notation is simply absent from the formula.

**2. Supplying the root does not rescue the row — it produces the previous record instead.**

The text describes an $8$-th root class-field tower with $2$-class group of rank $8$, so the
eighth root is the reading the sentence itself invites:

$484{,}887{,}097{,}019{,}201{,}067{,}725{,}625^{1/8} = 913.492694\dots$

Rounded to six significant figures that is **913.493** — character for character the value on
the `[Mar2006]` row directly above. The witness offered as evidence for the 857.567 record is
the arithmetic of the record it superseded.

**3. No integer degree makes the stated product yield 857.5662.**

The degree that would be required is $\ln(X)/\ln(857.5662) = 8.0748\dots$, which is not an
integer. The neighbouring integer roots are $X^{1/8} = 913.49$ and $X^{1/9} = 428.29$. The
first is larger than the claimed bound, so it does not establish it; the second is smaller by a
factor of two, and a "current record" row would not quote a witness that slack. Neither is
857.567.

**4. Single-factor transcription slips do not explain it.** If one prime power had been
dropped or mistyped, some nearby product should give $857.5662$ at degree 8. The required
product is $857.5662^8 = 2.926\times 10^{23}$ against the stated $4.849\times 10^{23}$ — a
ratio of $1.657$, which is not any prime power. Removing $29$ gives $599$; removing $109$
gives $508$. Both overshoot in the other direction. The product is not a near-miss of the
right one; it is a different number that happens to be exactly the row above.

## What this does and does not establish

**Established, with certainty:** the row is internally inconsistent. This needs no claim about
what any paper says — it is exact integer arithmetic on the page's own text, and the
factorization was re-extracted mechanically from the mirrored file rather than re-typed from a
reading of it.

**Not established:** what [HMR2019] actually proves. `arXiv:1901.04354` returns *Cutting towers
of number fields* by Hajir, Maire and Ramakrishna, published 2019-01-14, and its abstract says
they "achieve new records on Martinet constants (root discriminant bounds) in the totally real
and totally complex cases" — the positive control is that the abstract independently names the
**refined Golod–Shafarevich criterion**, the exact mechanism the row cites, so this is the
right document and not a lookalike or a redirect. But the abstract **states no numeric value**,
which is the same wall three abstracts put up on 2026-07-24. So nothing here confirms or
refutes 857.567 itself. The defect is in the witness, not necessarily in the bound.

Two readings survive, and this finding does not choose between them:

- the factorization belongs to the `[Mar2006]` row and was attached to the wrong one; or
- it is the right construction with a different error, and the true witness is some other product.

Either way the row as published does not support its own number.

## What we would say upstream

Fixed here in advance, so the reportable sentence is not composed at send time (amendment from the
2026-08-15 adversarial review, `docs/decisions/2026-08-15-A16-adversarial-review.md`, angle 6 —
the only angle that bit, and it bit on the headline rather than the arithmetic):

> The current-record row of `constants/87a.md` cites an explicit witness whose product is a
> 24-digit integer, so the inequality `≤ 857.5662` cannot be read literally; and the eighth root
> the surrounding sentence invites is 913.4927, which to six significant figures is the value on
> the row above. The row is inconsistent with itself. We have not checked 857.567 against
> [HMR2019], whose abstract states no numeric value.

That is the whole claim. It is deliberately **not** "the previous record is proved" — that would be
a statement about Martin's construction, which we have not checked and do not need. A reader who
quotes only this document's title would inherit the stronger claim, which is why the limited one is
written out here.

## Why the drift alarm did not catch this

It is not supposed to. The mirror's contract is byte-fidelity to the adopted surface, and the
surface is faithfully mirrored — `87a.md` in this repo is byte-identical to upstream, defect
included. **The alarm detects that a record moved, not that a record is wrong.** This was found
by reading a newly added page during the drift cycle, which is a human step with no detector
behind it. That is worth saying plainly rather than implying the machine caught it.

Nor could a generated pin have caught it. `pin:87a:U` pins that row verbatim as a listing
position; it asserts where the row sits, never that its contents are true. That rule exists
because auto-asserting "record" would put unverified mathematical statements in our own ledger
— and this page is a good argument for keeping it.

## Context worth carrying

The page's own contribution note says it was "prepared with assistance from Claude Opus 4.7"
and flags two items for verification before publication: the `[Mar2006]` bibliographic details,
and the exact form of the `[Odl1990]` figures. **It does not flag the witness arithmetic**, and
that is the one an outside reader can check in a minute with no library access. A self-audit
that names its soft citations while missing a false inequality in its headline row is a
recognisable shape, and it is the same shape as our own 2026-07-24 method-sentence defect: the
review attacked the values and never the sentence that said where the values came from.

## Not done, deliberately

No upstream contact. Under the outward gate this needs an adversarial refute-it review and then
David's explicit approval, in that order, and the review has not been run. Tracked as **A-16**.
Nothing about this is urgent — the page is a day old, the error is arithmetic rather than a
wrong record, and it will be exactly as reportable next week.
