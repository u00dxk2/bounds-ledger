# Adversarial refute-it review — A-3 upstream correction to erdosproblems.com/36

**Date:** 2026-07-24 · **Status:** REVIEW COMPLETE — correction SURVIVES with 2 required amendments · **Item:** A-3
**Reviews:** `docs/decisions/2026-07-23-A3-erdosproblems-report.md` (gate 1 of 2; gate 2 = David's outward-send gate, still closed)

The job of this review is to **break the correction before a maintainer does**. Each angle below was an attempt to refute, not to confirm.

## Angle 1 — variant mismatch (the classic trap): REFUTED

*Attack:* erdosproblems.com/36 and Tao's `constants/1b.md` might track different quantities, making the "correction" a category error.

*Why it fails:* `constants/1b.md` states the equivalence explicitly ("The problem of determining $C_{1b}$ is known to be equivalent to [Erdős problem #36]", equivalence due to [H2016]) and links the page. Independently, **two** values match row-for-row across the surfaces: the page's upper bound 0.380876 = the `[YKLBMWKCZGS2026]` row, and its lower bound 0.379005 = the `[W2022]` row. A coincidental two-value match across a different problem is not credible. Same quantity.

## Angle 2 — curated-vs-live blend in our own outward artifact: **SUSTAINED (amendment required)**

*Attack:* the draft asks a curated index to adopt a value we cannot show is curated — the exact error our own convention forbids (reconciliation #1 finding 3: track curated and live separately, **never blend**).

*Result on the load-bearing value:* fails to refute **0.380868**. It sits in the curated table with a paper citation — `[YLTLYSTYLLGDHZSWZSHMELCZX2026]`, arXiv:2604.19341 — and re-verified clean today (claim C-1 HOLDS; mirror diff no-drift @ upstream `a002311`).

*Result on the secondary value:* **lands on 0.380871.** Its curated citation `[T2026]` resolves to a **GitHub repo README** (`togethercomputer/EinsteinArena-new-SOTA`), not a paper. Worse, naming "EinsteinArena" in an outward artifact points the maintainer at the **live leaderboard**, which carries an unvetted ≈0.3808591 (reconciliation #1 finding 3) that we explicitly do **not** endorse. The line buys nothing — 0.380868 supersedes it — and costs the correction its clean paper-cited footing.

→ **Amendment A: delete the 0.380871 line from the draft.** Cite the single current curated best, paper-backed.

## Angle 3 — the page may lag deliberately, not erroneously: PARTIALLY SUSTAINED (tone)

*Attack:* if erdosproblems.com only admits results meeting a stricter bar, it is not stale — it is curated differently, and the correction is presumptuous.

*Why it mostly fails:* the page already cites AlphaEvolve `[GGTW25]` and TTT-Discover, i.e. it does admit machine-discovered bounds and is not peer-review-only. So a same-class later result is in scope.

*What survives:* we cannot know the maintainer's cadence or intent, and the draft's subject ("upper bound is two curated improvements out of date") asserts error rather than offering information.

→ **Amendment B: reframe as neutral FYI** — offer the later curated entries and their sources, let the maintainer judge.

## Angle 4 — our evidence could be stale by send time: NOT REFUTED, but time-boxed

The page state is a 2026-07-23 hand-verification (David's screenshot). C-7 is `manual: true` and **reports UNVERIFIED by design** — the checker cannot re-run it, so it does not age gracefully on its own.

→ **Send condition: if the outward gate opens more than 7 days after 2026-07-23, re-confirm the page by hand before sending.**

## Angle 5 — the superseding value could itself have moved: REFUTED (as of today)

`npm run check` on 2026-07-24: mirror no-drift @ `a002311`, C-1/C-3 HOLD. 0.380868 is still the curated best and 0.379005 still the lower bound.

## Verdict

*(Verdict below was written before Angle 6 was found at the pre-send check — it stands, but note that the review as originally run was incomplete.)*

**SURVIVES.** The core factual claim — erdosproblems.com/36's upper bound 0.380876 is superseded by the curated, paper-cited 0.380868, correct bracket `0.379005 < c < 0.380868` — withstood every angle. Two amendments are required before send (A: drop 0.380871; B: neutral framing), plus the 7-day re-confirmation condition.

Gate 1 of 2 is now **clear**. Gate 2 (David's outward-send gate) remains **closed** — no contact made.

## Amended draft (supersedes the 2026-07-23 draft; send ONLY after David's gate)

> Subject: Problem 36 (minimum overlap) — a later curated upper bound you may want
>
> The page currently lists the upper bound as 0.380876 (TTT-Discover, Jan 2026). A later improvement has since been curated in the Tao/Davis/Ivanisvili optimization-constants repository (`constants/1b.md`):
>
> - **0.380868** — SimpleTES, "Evaluation-driven Scaling for Scientific Discovery," [arXiv:2604.19341](https://arxiv.org/abs/2604.19341) (Apr 2026)
>
> That would make the current bracket 0.379005 < c < 0.380868 (lower bound White 2022, [arXiv:2201.05704](https://arxiv.org/abs/2201.05704)). Cross-checked against the curated table; happy to be corrected if you're tracking it deliberately.

## Angle 6 — added at the pre-send check (2026-07-24): **SUSTAINED — the review missed this**

*Attack (David's pre-send read, not the review's):* the draft's own evidence sentence claimed "cross-checked against the curated table **and the source-paper abstracts**."

*Result:* **false.** Verified 2026-07-24 by fetching all three abstracts — SimpleTES `2604.19341`, White `2201.05704`, TTT-Discover `2601.16175` — **none states its numeric bound**. (SimpleTES's abstract does claim "new Erdos minimum overlap constructions that surpass the best-known results", but prints no digits.) The clause was inherited from the W-2 Haugland work on 7/23, where the abstract genuinely *did* carry the value, and was never re-examined when the draft was rewritten for a different constant.

**Our verification of 0.380868 rests on Tao's curated table alone.** Clause removed from the draft.

*Lesson for the next outward artifact:* angles 1–5 all attacked the **claim**. None audited the **evidence sentence** — the part that tells the recipient what work we did. A false claim about our own method is worse than a wrong value: it is the one thing the recipient cannot check and must take on trust. **Audit the method sentence as its own angle, every time.**
