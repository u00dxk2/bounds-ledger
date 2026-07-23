# Reconciliation #1 — the Erdős minimum-overlap record (C₁ᵦ / Erdős #36)

**Date:** 2026-07-22 (lane day one) · **Status:** RESOLVED · **Item:** A-1

## Verdict

The two values that triggered this lane are **not in conflict — they are consecutive entries in a fast-moving record sequence**, and the "contradiction" was a stale-snapshot artifact:

| Date | Value | Who | Status |
|---|---|---|---|
| Jan 2026 | 0.380876 | TTT-Discover (arXiv:2601.16175) | superseded |
| 2026 | 0.380871 | TogetherAI (EinsteinArena-new-SOTA) | superseded |
| **Apr 2026** | **0.380868** | **SimpleTES (arXiv:2604.19341)** | **current curated best** |

The current best known upper bound is **0.380868**. Both values appear as rows in the same curated history table — Terence Tao's `optimizationproblems` repo, `constants/1b.md`, updated 2026-04-30 — which supersedes and subsumes the January result. The sourcing research had compared a *stale single-value surface* against the *live history table*.

Full bracket as of today: **0.379005 < c < 0.380868** (lower bound: White 2022, arXiv:2201.05704).

## The three real findings (the reconciliation was the warm-up)

1. **erdosproblems.com/36 — the field's most popular problem index — is three records stale.** It still lists 0.380876 as "the current record" and was last edited 2026-01-23, missing both the TogetherAI and SimpleTES improvements. *(Source page quoted verbatim by our research agent 2026-07-22; the site now 403s automated re-fetch, so this claim carries agent-fetch provenance, not an independent re-fetch — re-verify by hand-browsing before any upstream report.)*
2. **The curated table itself has a final-digit discrepancy.** Tao's repo lists Haugland's 2016 bound as `0.380927`; Haugland's own arXiv abstract (1609.08000) and Wikipedia say `0.380926` (the true value ≈ 0.3809268 — likely a rounding-direction choice or a typo). Tracked as **W-2**; resolving it against the paper's final section is a candidate first upstream PR.
3. **"Curated" and "live-claimed" records have forked.** The EinsteinArena live leaderboard shows unvetted sub-record submissions (best ≈ 0.3808591, no visible dates or proofs) below the curated 0.380868. The ledger's convention, adopted now: **track both, as separate labeled columns — never blend them.** A live claim graduates to the curated column only via a checkable construction or acceptance into a curated source.

## Method note (this is the lane's template)

Claim → primary source → re-fetch → cross-check against every other surface tracking the same quantity → date every value → keep the full history, not just the head. The reconciliation took one research-agent session plus an independent spot-check of the load-bearing source (the Tao table re-fetched raw and matched row-for-row).

## Sources

- Tao / Davis / Ivanisvili, `optimizationproblems` repo: https://github.com/teorth/optimizationproblems — `constants/1b.md` (re-fetched + verified 2026-07-22); announced in Tao's blog 2026-01-22.
- TTT-Discover: "Learning to Discover at Test Time," arXiv:2601.16175 (v1 2026-01-22): "We improve the upper bound on Erdős' Minimum Overlap Problem to 0.380876."
- SimpleTES: "Evaluation-driven Scaling for Scientific Discovery," arXiv:2604.19341 (v1 2026-04-21); authors' blog: "SimpleTES reaches 0.380868."
- erdosproblems.com/36 (agent-fetch 2026-07-22; last edited 2026-01-23).
- Haugland: arXiv:1609.08000 ("…improves the upper bound…to 0.380926…"); White: arXiv:2201.05704.
- EinsteinArena live leaderboard: https://einsteinarena.com/problems/erdos-min-overlap (unvetted).

## First stewarded surface (feeds A-2)

Adopt **`teorth/optimizationproblems`** (~85 constants; one markdown file per constant; `| Bound | Reference | Comments |` tables; citation keys like `[H2016]`; crowdsourced via PRs — maintainers Davis, Ivanisvili, Tao). Re-verification CI: re-fetch each tracked constant file on a schedule, diff the tables against our ledger copy, cross-check named external surfaces (erdosproblems.com, Wikipedia, source-paper abstracts), and open a finding on any drift — exactly the class of catch that found #1 and #2 above.
