# A-16 adversarial refute-it review — the C_87 witness defect

**Date:** 2026-08-15 (MT)
**Artifact under review:** `docs/findings/2026-08-14-the-witness-attached-to-c87s-record-row-proves-the-previous-record.md`
**Reviewer:** Codex (GPT-5-class), dispatched as an independent cross-model refutation pass — told to
refute, to default to *refuted* under uncertainty, and to recompute everything from the mirrored
file rather than from our prose. Read-only; no upstream contact.
**Verdict: SURVIVES**, with one framing amendment and one residual risk, both below.
**This clears gate 1 only.** Gate 2 is David's explicit approval, and nothing has been sent.

## Why a cross-model reviewer for this one

The claim is exact integer arithmetic, which is the rare case where an independent reviewer can
reach the same answer by a genuinely different route rather than by agreeing with a paragraph. The
expensive failure here is a wrong public accusation about a real mathematician's page, so the
review was pointed at the numbers first and the wording second.

## Angle by angle

| # | Angle | Verdict |
|---|---|---|
| 1 | The product is a 24-digit integer, so the typeset inequality is false | SURVIVES |
| 2 | The eighth root is 913.4926943720…, i.e. 913.493 to six significant figures | SURVIVES |
| 3 | That is character-for-character the row above | SURVIVES |
| 4 | No reading rescues the row | SURVIVES |
| 5 | The method sentence claims no more than it verified | SURVIVES |
| 6 | The conclusion's strength | OVERCLAIMED **only** if headlined as *proves the previous record* |

**Independently recomputed**, from a mechanical extraction of the row rather than from our text:
product `484887097019201067725625`; eighth root `913.4926943720098688908…`; required degree
`ln(X)/ln(857.5662) = 8.074831…`, not an integer; neighbouring integer roots `913.4926943720…`
and `428.2899143899…`. Every figure matches the finding.

**Angle 4 went further than we did.** The reviewer swept **275 one-edit candidates** — dropped
prime powers, exponents off by one, transposed digits — against **integer degrees 1 through 64**,
and none rounds or truncates to `857.5662` or `857.567`. The nearest misses were `796.278`
(`3^4→3^3`), `823.480` (`53→35`) and `854.740` (a digit swap in the product). Degrees above 64 were
excluded by bound rather than by sampling: the largest candidate's root there is below `2.524`.
Our finding tested a handful of variants by hand and asserted the same conclusion; it now rests on
a systematic sweep instead of a spot check.

## The one amendment

Angle 6 is the only one that bites, and it bites on the *headline*, not the arithmetic. What the
arithmetic establishes is that the witness is inconsistent with the row it sits on, and that its
natural eighth-root reading equals the value displayed on the row above. That is not the same
sentence as *the previous record is proved*, which would be a claim about Martin's construction
that we have not checked and do not need.

The finding's body already refuses to choose between the two readings and says "the arithmetic
of", so the reviewer found no line inside it that overclaims. The gap is that a reader who quotes
only the title inherits a stronger claim than the document supports — the same shape as this
lane's own rule about the header on `catch-rate.mjs`. Amendment applied: the finding now carries an
explicit **What we would say upstream** paragraph stating the limited claim in the words we would
actually use, so the reportable sentence is fixed in advance rather than composed at send time.

## Residual risk, and its closure

The reviewer's single named residual: *upstream may already have corrected the page since this
mirror snapshot.* That is checkable and was checked — `npm run check` at 2026-08-15T14:59Z reports
`No drift. 113 files match upstream e70b4a45ae3a6218785088591e26521c20cfd49f` (an upstream sha; it
does not exist in this repo), so `87a.md` is byte-identical to the live upstream file as of this
morning and the defect is uncorrected. **Re-run that check immediately before any send** — a
report of an error the maintainer has already fixed is worse than no report.

## Carried, not adopted

The reviewer states that the arXiv full text assigns this factorization to Martin's construction
and derives the new record by a different route. If true, that resolves the two open readings in
favour of *the factorization was attached to the wrong row*, which is a materially stronger and
more useful finding.

**It is recorded here and deliberately not adopted into the finding.** We have not read the paper
body from this pane, and on 2026-08-12 this lane came one step from publishing a false claim about
a mathematician's paper on the strength of a fetch that had silently fallen back to an abstract
page. A claim about a full text needs a positive control naming the token that proves the document
was the right one. Nothing is lost by holding it: the finding stands without it, and the report we
would send does not depend on it.

## Gate state

- Gate 1 — adversarial review: **CLEARED** (this document).
- Gate 2 — David's explicit approval to contact upstream: **NOT ASKED.** Per today's dispatch,
  A-16 is not urgent and nothing goes outward on this lane's own initiative. When it is raised, the
  ask is one sentence and the artifact is this file plus the finding.
