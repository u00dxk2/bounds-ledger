# A-16 — draft upstream report, awaiting David's sign-off on the text

**Status:** David approved *reporting it* on 2026-08-20 and asked to see the draft first. Nothing is
sent. **Channel: a GitHub issue on `teorth/optimizationproblems`, not a pull request** — we can show
the row contradicts itself, but we cannot supply the correct value, and a PR would imply we can.

**Pre-send check, mandatory:** re-run `npm run check` immediately before sending. Reporting an error
the maintainer has already fixed is worse than not reporting. Last verified **2026-08-20**: no drift,
113 files matching upstream `e70b4a4`, so the defect is uncorrected as of today.

---

## Draft issue

**Title:** `constants/87a.md — the explicit witness on the current-record row doesn't match the row's own bound`

**Body:**

> The current-record row of `constants/87a.md` reads:
>
> > `| $857.567$ | [HMR2019] | … explicit example is an $8$-th root class-field tower … yielding $\mathrm{rd} \le 3^4\cdot 5^4\cdot 7^4\cdot 13^2\cdot 29^4\cdot 53^2\cdot 109^2 \le 857.5662\dots$  Current record. |`
>
> That product is `484887097019201067725625` — a 24-digit integer — so the chained inequality
> `≤ 857.5662` can't be read literally as written.
>
> Taking the 8th root the sentence itself invites gives **913.4927**, which to six significant
> figures is **913.493** — the value on the `[Mar2006]` row directly above it. No integer degree
> yields 857.5662 (the required degree is 8.0748). I also swept 275 single-edit variants of the
> factorization (dropped prime powers, exponents off by one, transposed digits) against integer
> degrees 1–64; none round or truncate to 857.5662 or 857.567, with nearest misses at 796.278,
> 823.480 and 854.740.
>
> **I don't think the bound is wrong** — 857.567 is independently corroborated further down the same
> page, where the Context section quotes it as the `$C_2 \le 857.57$` of `[BSSZ2026, §5]`. The
> mismatch looks like it's in the *witness attached to the row* rather than in the record itself.
>
> The reading I'd guess at, but haven't verified: that factorization belongs to the `[Mar2006]` row,
> since its 8th root is exactly that row's value.
>
> **What I have not checked:** whether 857.567 is what `[HMR2019]` actually proves. The abstract of
> [arXiv:1901.04354](https://arxiv.org/abs/1901.04354) states no numeric value, and I haven't worked
> through the full text, so I'm not making any claim about the paper.
>
> Happy to open a PR if you tell me which reading is right.

---

## Why it is worded this way

**The claim stops at "the row is inconsistent with itself."** Everything establishing that is exact
integer arithmetic on the page's own text, re-extracted mechanically from our mirror rather than
retyped. Everything beyond it — what the paper proves, which row the factorization belongs to — is
flagged as unverified, because on 2026-08-12 this lane came one step from publishing a false claim
about a mathematician's paper on the strength of a fetch that had silently fallen back to an abstract
page.

**The 2026-08-15 adversarial review's one amendment is applied.** Its only biting angle was that
"proves the previous record" would overclaim — that would be a statement about Martin's construction,
which we have not checked and do not need. The draft never says it.

**Deliberately not adversarial in tone.** The page itself records that it was prepared with AI
assistance and that several citations "should be verified before publication," so the maintainer has
already signposted uncertainty here. This is a reader returning a check, not catching someone out.
