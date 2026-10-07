# A-57 — draft correction to the 46a entry's attribution (NOT SENT)

Drafted 2026-10-07 (MT); revised the same day after a Codex refute-it review (round 1, read-only). Nothing in this file has been sent anywhere. Sending it is outward contact with the maintainers of `teorth/optimizationproblems`, so it waits for David's explicit approval.

## What the entry says now

Upstream file `constants/46a.md` (the upstream path; our mirror of it is `ledger/teorth-optimizationproblems/constants/46a.md`), as mirrored at upstream `2c1968cd` (an upstream sha; it does not exist in this repo):

- Row 18 of the upper-bounds table: `| $4-\frac{2}{15} \approx 3.86667$ | [Bo1991] | |`
- Reference line 45: `- [Bo1991] Bourgain, J. *Besicovitch-type maximal operators and applications to Fourier analysis.* Geom. Funct. Anal. **1** (2) (1991), 147-187.`

`[Bo1991]` is cited nowhere else in the file.

## Recommended form: an ISSUE, not a pull request

The review's blocking finding was that a pull request would put a replacement reference into the table that nobody here has read. We can show the current attribution is wrong. We cannot show that the proposed replacement contains the result. An issue states what we verified and asks the maintainers to confirm the published source; a PR would assert it.

### The issue, as it would be written

> **46a: the 4 − 2/15 bound is credited to Bourgain's GAFA 1991 paper, which proves 31/8**
>
> The upper-bounds row `4 − 2/15 ≈ 3.86667` cites [Bo1991], Bourgain, *Besicovitch type maximal operators and applications to Fourier analysis*, GAFA 1 (1991) 147-187. That paper proves the exponent 31/8 (p. 185, "Take p₀ = 31/8", from Proposition 6.47 on p. 182) and does not state 58/15. The 58/15 bound is Proposition 2.15 of Bourgain's IHES preprint M/90/74, *On the restriction and multiplier problem in R³*, which the GAFA paper cites on p. 186 and lists on p. 187 as "to appear in Springer LNM".
>
> A likely published form is Bourgain, *On the restriction and multiplier problems in R3*, in *Geometric Aspects of Functional Analysis*, Lecture Notes in Mathematics, Springer, 1991, pp. 179-191, doi:10.1007/BFb0089225. We have not read that chapter, so we cannot confirm that it contains the 58/15 result, or where; we identified it from its bibliographic record only. Would you confirm the right reference for this row?

## What we read, and what we did not (the method sentence)

- READ: the published GAFA paper, vol. 1 (1991) pp. 147-187, from the Göttingen Digitisation Centre's page images. A reading agent read pp. 148-186 and reported every exponent stated for the restriction, extension and multiplier problems in R³, and every citation of [Bo1], [Bo2] and [Bo3]; this lane read pp. 147, 148, 182, 185, 186 and 187 itself. Recorded on `continuity/depth-audit.json` entry `A-47-0030`, settled under `A-56` on 2026-09-26.
- READ: the IHES preprint M/90/74, pp. 1.1 and 2.3 (Proposition 2.15, opening "Let p > 58/15"). Same record.
- NOT READ: the Lecture Notes chapter. Springer's page redirects to a sign-in. Every element of the candidate reference above comes from Crossref's record for DOI 10.1007/BFb0089225, fetched 2026-10-07: author Jean Bourgain; title "On the restriction and multiplier problems in R3"; container titles "Lecture Notes in Mathematics" and "Geometric Aspects of Functional Analysis"; pages 179-191; published 1991; publisher Springer Berlin Heidelberg. That record carries no volume number, so none is given. Whether the chapter contains the 58/15 result, and where, is not verified here. The identification rests on the same author, a near-identical title (the preprint has "problem", the chapter "problems"), and the GAFA paper's own note that the preprint was to appear in Springer LNM.

## Precedent

Upstream PR #194 (`W-12`), opened 2026-09-21 after David's approval, replaced the 1b entry's link. By the time it was accepted the old URL was serving the paper again, so the maintainer took it as a change for stability rather than a fix of a dead link (`docs/daily/2026-09-26-prelaunch.md`). It is precedent for the outward-contact process only. It says nothing about this chapter's contents.

## The alternative, not recommended

A pull request changing reference line 45 to the candidate above, with the same disclosure in its description. Not recommended: it would make the unread chapter the table's source for 58/15.

## What stays out of it

`A-58`'s four defects (10c, 74a, 3c, 47a) are decided separately and are not part of this change. Nothing is folded into `W-12`'s thread or any other channel.

## Review record

Codex refute-it review, round 1, 2026-10-07, read-only, workdir verified as this repository. Five findings, each CONFIRMED against the record and addressed above:

1. BLOCKER: a PR asserted an unread edition, so the form was changed to an issue.
2. MAJOR: "1469", "(1989–90)" and "Berlin" were not in the Crossref record; all three were removed.
3. MINOR: the agent's reading scope was widened; it is qualified to restriction, extension and multiplier exponents.
4. MINOR: the quoted reference line used an en dash where the mirror has a hyphen; it now matches.
5. MINOR: the precedent was described as a dead-link fix; it is now described as an accepted change for stability.
