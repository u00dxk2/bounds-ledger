# Decision — A-3: report the erdosproblems.com/36 staleness upstream? (RECOMMEND yes, David-gated)

**Date:** 2026-07-23 · **Status:** DECISION FILED — held for David's outward-send gate · **Item:** A-3

## The confirmed fact

erdosproblems.com/36, hand-verified by David via screenshot 2026-07-23 (page last edited **23 January 2026**):

> The current records are **0.379005 < c < 0.380876**

Upper bound reads **0.380876**, attributed to "the TTT-Discover LLM [YKLBMWKCZGS26], improving slightly on earlier bounds due to AlphaEvolve [GGTW25] and Haugland [Ha16]." The two subsequent improvements are **absent**:

| Value | Who | When | On erdosproblems.com/36? |
|---|---|---|---|
| 0.380876 | TTT-Discover (arXiv:2601.16175) | Jan 2026 | **yes — shown as current** |
| 0.380871 | TogetherAI (EinsteinArena) | 2026 | no |
| **0.380868** | **SimpleTES (arXiv:2604.19341)** | **Apr 2026** | **no — this is the current curated best** |

The correct current bracket is **0.379005 < c < 0.380868**. The page is two curated improvements behind (three counting the intermediate that Tao's table also carries).

## The decision

**Recommendation: report it upstream — this is the lane's customer-zero payoff — BUT gated on two conditions and NOT to be sent until both clear.**

1. **Adversarial refute-it review** (portfolio standing rule for any outward artifact) — a reviewer tries to break the correction before it goes out. The factual chain is strong (SimpleTES 0.380868 sits in Tao's curated `constants/1b.md` with citation key `[YLTLYSTYLLGDHZSWZSHMELCZX2026]`), so this should pass, but it runs first regardless.
2. **David's outward-send gate** — the actual contact to the site maintainer (Thomas Bloom) is outward and David-gated. Do not contact them without it.

### Why report (not no-report)

- It is exactly why this lane exists: the founding thesis is "record surfaces drift faster than observers track"; erdosproblems.com/36 is the concrete customer-zero of that drift, on the field's most-used Erdős index.
- The correction is factual and low-controversy — updating a bound to a value already curated in Tao's repo with a paper citation, not a novel claim.
- It is the lane's first outward demonstration artifact: "the ledger caught a stale record the field's main index missed."

### Why the gate still matters (the case for caution)

- erdosproblems.com is curated personally by Thomas Bloom on his own cadence; an unsolicited correction from a still-pre-launch lane attaches the lane's identity to an outward contact before the public flip.
- No urgency: the value being stale harms no one on a clock; a wrong-but-static bound is a slow problem, so there is no cost to holding for the gate.

## Draft correction (copy-paste ready IF David greenlights — do not send before the gate)

> Subject: Problem 36 (minimum overlap) — upper bound is two curated improvements out of date
>
> The page currently lists the upper bound as 0.380876 (TTT-Discover, Jan 2026). Two later improvements have since been curated in Tao/Davis/Ivanisvili's optimization-constants repository (`constants/1b.md`):
> - 0.380871 — TogetherAI (EinsteinArena)
> - 0.380868 — SimpleTES, "Evaluation-driven Scaling for Scientific Discovery," arXiv:2604.19341 (Apr 2026)
>
> So the current best-known bracket is 0.379005 < c < 0.380868 (lower bound White 2022, arXiv:2201.05704). Sources cross-checked against the curated table and the source-paper abstracts on 2026-07-23.

## Next step

Held. When David opens the outward-send gate, run the adversarial review first, then send the draft above. Until then A-3 stays open with the decision recorded; no contact is made.
