# Bounds Ledger

**Skylark portfolio lane (pre-launch, lite rail). Opened 2026-07-22 (David-approved in-session). Working title — rename freely.**

## Thesis

The computational-conjecture frontier (AlphaEvolve, Aletheia, OpenAI, Sakana, Harmonic, TTT-Discover…) is crowded with **searchers** — and has almost no **stewards**. Record surfaces (best-known bounds, constants, certificates) are drifting faster than observers track. Customer-zero example found by the sourcing research: TTT-Discover reports the Erdős minimum-overlap constant at **0.380876** while Tao's optimization-constants repository lists **0.380868**. This lane is the steward: a reproducible, continuously re-verified ledger of records — the "cited-not-checked" immune system from the Skylark substrate pointed at mathematical records.

Source research: `skylark-site/docs/research-library/2026-07-22-portfolio-verifier-rich-domains.md` (both sources independently converge on stewardship-not-search as the neglected seat).

## Why this lane fits the substrate

- **Verifier**: mechanical and mature — DRAT/LRAT SAT certificates (drat-trim/GRAT), Lean/Coq proof checking, interval-arithmetic/SDP bound verification, direct-arithmetic construction checks. Acceptance is mechanical, not review-queue-gated.
- **The product is not-drifting** — exactly the substrate's differentiated strength (sustained integrity over months).
- Zero client acquisition, zero spend.

## What this lane is NOT

- Not another record-search engine (that frontier is the most crowded in the domain map).
- Not an OEIS contributor (OEIS forbids AI-generated submissions — closed route).
- Not a mathlib-primary contributor (2,600+ open-PR review backlog; human-supervision norms). Formalization rides **inside** this lane opportunistically where acceptance is mechanical: DeepMind's Formal Conjectures repo (1,170 open statements), the Equational Theories successor challenge (SAIR Foundation, Mar 2026 — explicitly welcomes automated contributions).

## First artifact (2-week target)

A published reconciliation of the minimum-overlap discrepancy (0.380876 vs 0.380868): which is current, why they differ, with both sources cited and the checkable artifact (certificate/computation) reproduced in this repo.

## Constraints

- Every ledger claim carries a re-fetchable citation AND a re-runnable check; a claim without both is marked unverified — never silently trusted.
- Public-repo flip and any outward publication (arXiv note, upstream PR) go through the adversarial refute-it review first (portfolio standing rule), and outward sends remain David-gated.
- Lite rail: `dailyPrelaunch` prompt; reports at `docs/daily/{date}-prelaunch.md`.
