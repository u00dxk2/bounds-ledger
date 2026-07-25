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

## First artifact — DONE (2026-07-22, day one)

The 2-week target was a published reconciliation of the minimum-overlap discrepancy (0.380876 vs 0.380868). Delivered same-day: **`docs/reconciliations/2026-07-22-minimum-overlap.md`** — the two values were not in conflict but consecutive entries in a fast-moving record sequence (the stale surface was erdosproblems.com/36, not either primary source). That note is also the lane's method template.

## Re-verification CI (A-2, stood up 2026-07-23)

First adopted surface: **`teorth/optimizationproblems`** (109 constant files under `constants/`). Ledger copy lives at `ledger/teorth-optimizationproblems/` (snapshot + `manifest.json` pinning the upstream sha).

- `node scripts/reverify.mjs --snapshot` — refresh the ledger copy from upstream HEAD (run only after a drift has been re-verified against primary sources; commit the result).
- `node scripts/reverify.mjs --check` — re-fetch upstream, diff vs the ledger copy, print a drift report; exit 1 on drift.
- `node scripts/reverify.test.mjs` — network-free self-test: proves a synthetic single-digit tamper is caught.
- `node scripts/extract-pins.mjs` — regenerate the 216 generated claim pins from the mirror. Run after every `--snapshot` (see the ratchet below).
- `.github/workflows/reverify.yml` — daily cron (09:17 UTC) + on push + manual. A failed run IS the drift alarm; on a drift or a broken claim it auto-files a GitHub issue titled with what moved, body code-fenced so the `-/+` diff survives GFM. Drift is expected behavior (records move) — the alarm demands re-verification, then a deliberate `--snapshot` commit turns it green. *Known exception (A-4): if a **self-test** fails, the job goes red but files no issue — `finding.txt` doesn't exist yet, so the issue step exits early.*

### Claim-level checks (the second half of the constraint)

The mirror above watches ONE surface and reports any change. `ledger/claims.json` does the complementary job: each ledger claim names its source URL and the exact string that must still appear there, **across every surface we cite** — Tao's repo at live HEAD, arXiv abstracts, Wikipedia. Cross-surface divergence is what produced this lane's founding finding; a same-repo mirror diff would never have caught it.

- `node scripts/check-claims.mjs` — re-fetch every cited source, assert each claim still holds; exit 1 if any broke.
- `node scripts/check-claims.mjs --selftest` — network-free matcher self-check (also runs in CI).
- A claim marked `"manual": true` (source blocks automated fetch, e.g. erdosproblems.com) reports **UNVERIFIED** and never counts as green — the repo's "never silently trusted" rule, made mechanical.

Adding a claim to a published note means adding a row here; that's what keeps *re-fetchable citation + re-runnable check* true rather than aspirational.

**Coverage as of 2026-07-24: 223 claims** — 7 hand-written (C-1…C-7) plus **216 generated pins covering all 109 constants**, via `node scripts/extract-pins.mjs`.

A generated pin asserts the **last-listed row** of a bounds table, verbatim — *not* "the record". Numeric record-ranking is defeated by symbolic cells (`$K_{DR}+10^{-26}$`), negatives and O(·) asymptotics; a ranking prototype mis-picked three constants, and auto-asserting "record" 216 times would put unverified mathematical statements in our own ledger. Last-listed is true by construction, and an appended new record trips the mirror diff instead. Only the hand claims may say "record", because a human checked them.

Pins deliberately do **not** auto-follow the mirror. After any `--snapshot`, re-run `extract-pins.mjs` and commit the regenerated pins — until you do, a moved row stays BROKEN in `check-claims`. That is the post-snapshot ratchet, and it is the mechanism that stops a snapshot from silently blessing a change nobody read.

## First outward correction — SENT (2026-07-24)

erdosproblems.com/36, the most-used index for the minimum-overlap problem, still lists the January upper bound `0.380876`; the curated table has `0.380868` (SimpleTES, [arXiv:2604.19341](https://arxiv.org/abs/2604.19341)). After an adversarial refute-it review (which cut one claim and rewrote the subject line), David sent the correction to the site's maintainer by email.

**Sending is not acknowledgement.** The lane's north-star metric — externally-acknowledged corrections — is still **0**, and moves only on a maintainer reply or a hand-verified page change. Tracked as W-3 in `continuity/items.json`. The plain-English account of the whole episode, including what we did *not* verify, is `docs/lane-brief.md`.

## Constraints

- Every ledger claim carries a re-fetchable citation AND a re-runnable check; a claim without both is marked unverified — never silently trusted.
- Public-repo flip and any outward publication (arXiv note, upstream PR) go through the adversarial refute-it review first (portfolio standing rule), and outward sends remain David-gated.
- Lite rail: `dailyPrelaunch` prompt; reports at `docs/daily/{date}-prelaunch.md`.
