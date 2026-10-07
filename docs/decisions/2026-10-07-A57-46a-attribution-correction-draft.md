# A-57 — draft correction to the 46a entry's attribution (NOT SENT)

Drafted 2026-10-07 (MT). Nothing in this file has been sent anywhere. Sending it is outward contact with the maintainers of `teorth/optimizationproblems`, so it needs an adversarial refute-it review and then David's explicit approval.

## What the entry says now

Upstream file `constants/46a.md` (the upstream path; our mirror of it is `ledger/teorth-optimizationproblems/constants/46a.md`), as mirrored at upstream `2c1968cd` (an upstream sha; it does not exist in this repo):

- Row 18 of the upper-bounds table: `| $4-\frac{2}{15} \approx 3.86667$ | [Bo1991] | |`
- Reference line 45: `- [Bo1991] Bourgain, J. *Besicovitch-type maximal operators and applications to Fourier analysis.* Geom. Funct. Anal. **1** (2) (1991), 147–187.`

`[Bo1991]` is cited nowhere else in the file.

## The proposed change

One line, the reference entry. The table row and the key stay as they are:

```diff
-- [Bo1991] Bourgain, J. *Besicovitch-type maximal operators and applications to Fourier analysis.* Geom. Funct. Anal. **1** (2) (1991), 147–187.
+- [Bo1991] Bourgain, J. *On the restriction and multiplier problems in $\mathbb{R}^3$.* In: *Geometric Aspects of Functional Analysis (1989–90)*, Lecture Notes in Math. **1469**, Springer, Berlin, 1991, 179–191.
```

(Optional, NOT recommended in the same change: add a row `| $\frac{31}{8} = 3.875$ | [Bo1991a] | |` crediting the GAFA paper. It is true, but it adds a row the maintainers did not ask for, and it widens what has to be checked.)

## The reason, as it would be written to the maintainers

The 4 − 2/15 = 58/15 bound is proved in Bourgain's IHES preprint M/90/74, "On the restriction and multiplier problem in R³" (Proposition 2.15); the GAFA paper currently cited proves 31/8 (p. 185, from Proposition 6.47 on p. 182) and does not state 58/15. That preprint is the companion the GAFA paper cites on p. 187 as "to appear in Springer LNM", and the reference above is the Lecture Notes chapter of the same title and author.

## What we read, and what we did not (the method sentence, for review)

- READ: the published GAFA paper, vol. 1 (1991) pp. 147–187, from the Göttingen Digitisation Centre's page images. A reading agent read pp. 148–186 and reported every exponent stated; this lane read pp. 147, 148, 182, 185, 186 and 187 itself. Recorded on `continuity/depth-audit.json` entry `A-47-0030`, settled under `A-56` on 2026-09-26.
- READ: the IHES preprint M/90/74, pp. 1.1 and 2.3 (Proposition 2.15 with p > 58/15). Same record.
- NOT READ: the Lecture Notes chapter itself. Springer's page redirects to a sign-in. Its bibliographic data comes from Crossref's record for DOI 10.1007/BFb0089225, fetched 2026-10-07: title "On the restriction and multiplier problems in R3", author Jean Bourgain, *Geometric Aspects of Functional Analysis*, Lecture Notes in Mathematics, pp. 179–191, 1991, Springer Berlin Heidelberg. That the chapter still contains Proposition 2.15 with 58/15 is therefore NOT verified here. The identification rests on the same author and title (Crossref has "problems", the preprint has "problem") and on the GAFA paper's own note that the preprint was to appear in Springer LNM.

## Form

**Recommended: a pull request** changing line 45 only, whose description carries the reason above and says plainly that the Lecture Notes chapter itself was not read. Precedent: upstream PR #194 (`W-12`, a dead-link fix on 1b), opened on 2026-09-21 after David's approval.

The alternative is an issue that describes the discrepancy and lets the maintainers choose the reference. That costs them more work, but it fits better if the reviewers judge the unread Lecture Notes edition too big a gap for a PR that asserts a replacement.

This is not to be folded into `W-12`'s thread or any other channel.

## What stays out of it

`A-58`'s four defects (10c, 74a, 3c, 47a) are decided separately and are not part of this change.
