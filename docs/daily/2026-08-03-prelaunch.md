---
product: bounds-ledger
date: 2026-08-03
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 13af4c4
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "README-as-product shipped (13af4c4), taking the public-flip package to 4 of 4 on artifacts with only the package-level adversarial review left before David's gate. The increment's own adversarial review found three defects in my draft, and the serious one was a FABRICATED arXiv ID — I wrote 2601.11162 for TTT-Discover from a truncated grep when the real ID is 2601.16175. A made-up citation in the README of a repo whose entire thesis is cited-not-checked would have been the most damaging thing this project could publish, and nothing caught it except re-executing the grep instead of trusting my own fresh prose."
---

# bounds-ledger — daily (prelaunch) — 2026-08-03 (MT)

Paced rail, day 2. Steward cadence first, then a launch increment, plus the Monday forced-decision pass. No self-rating.

## BLUF

The launch package is artifact-complete. **README-as-product shipped (`13af4c4`)** — the last of the four flip artifacts (README, SECURITY.md, clean history sweep, adversarial review of the correction). What remains before David's gate is one thing: the **package-level** adversarial review, which is not the sum of the individual reviews — it asks what a stranger actually sees on landing, and that is the question none of the per-artifact reviews answered.

The steward cadence was green, log-read not badge-read: **no drift at `dee1660`, 229 claims / 227 hold / 0 broken / 2 UNVERIFIED by design. G-1 — the steward-credibility goal — is at green-streak day 11 of 30.**

The day's real finding is about my own output, not the records. The README review caught **a fabricated arXiv ID in my draft**: I wrote `2601.11162` for TTT-Discover, sourced from a grep whose output was truncated mid-number, when the real ID is `2601.16175`. It was caught only because I re-ran the grep rather than trusting prose I had written sixty seconds earlier. This project exists to catch cited-not-checked numbers, and it nearly published one about itself in the first document a stranger would read.

## What changed

- **`13af4c4` — README-as-product.** Rewritten for a stranger's first read: what it is, the concrete founding discrepancy, what the alarm has actually caught (the four drifts, each linked to its resolving commit), live counts, how to run it, the four load-bearing rules, and limits stated plainly. The prior version opened by describing itself as a "portfolio lane (pre-launch, lite rail)" and linked into a sibling repo a stranger cannot open. Zero internal jargon remains (verified by grep, not by reading).
- **`2210deb` — AGENTS.md canonicalized** (fleet convention, orchestrator dispatch). Cross-vendor invariants at repo root; `CLAUDE.md` imports it via `@AGENTS.md`. The Commands block was **moved**, not duplicated — drift between the two files is the documented failure mode of this convention. Flagged one deviation: 2977 chars vs the ~2k brief, because this repo carries more genuine hard invariants than most and cutting a load-bearing rule to hit a character target is the wrong trade.
- **A-2 — the re-verification CI item — moved, not closed** (Monday forced-decision pass). Its stated objective, "stand up re-verification CI", has been finished since 2026-07-23, but the item stayed open because it is where drift resolutions get logged. An item whose objective is done reads to a future session as unfinished work. Retitled to what it is — the standing drift log — so the ledger stops misreporting its own state. Not closed: closing would orphan four drift resolutions and leave the recurring cadence with no home.

## Inputs (controllable)

- Steward cadence run in full: CI log read (not the badge), then `npm run check` locally **with `CC_PROMPTS_PIN` set** — the only form of that run that is evidence, since the sign-in wall returns HTTP 200 to an anonymous fetch.
- Adversarial review executed on the README before commit, per the standing rule that everything public-touching gets one. Three defects found in my own draft, all fixed pre-commit: the fabricated citation, and two **method** overclaims — that `docs/findings/` records only instrument defects (it also holds drift write-ups), and that all four drifts were "verified against primary sources" (the editorial one was verified against upstream's own content, since no number moved). Both are the method-sentence class this repo has a standing convention about, and both survived until I attacked the sentence rather than the value.
- Every remaining README claim verified by executing: 111 mirrored files (matching `reverify`'s own count), 229 claims = 220 generated + 9 hand + 2 manual (read from `claims.json`), all four drift SHAs resolve, all link targets exist, cron 09:17 UTC read from the workflow, 5 self-tests via `npm test`.
- Weekly forced-decision pass over all 10 open items. One moved (A-2). Nothing died.

## Outputs (lagging)

- **North star — externally-acknowledged corrections: 0.** Unchanged. The 2026-07-24 email correction remains unanswered; W-3 — the watch on that acknowledgement — read both legs clean today, meaning erdosproblems.com/36 is unchanged since 23 January 2026 and the maintainer has not touched the page.
- **G-1 green streak: day 11 of 30** (day 1 = 7/24; ends ~8/22).
- **Ledger: 229 claims, 227 hold, 0 broken, 2 UNVERIFIED by design**, over a 111-file mirror clean at upstream `dee1660`.
- **A-12 — the hosted-brief drift item: still 3 of 4 dated blocks behind** (26 Jul, 28 Jul, 1 Aug), confirmed via the credentialed probe rather than an anonymous one. Issue #6 is the standing alarm; the David-escalation threshold is 2026-08-07, not today.

## Recommendation

**Run the package-level adversarial review as tomorrow's launch increment, and put the flip to David at streak day 14 (2026-08-06) as planned.** The artifacts are done; the untested claim is that they *cohere* for someone arriving cold. Review the landing experience, not the file list: does the README's opening survive a reader who has never heard of this project, do the four rules read as discipline rather than excuse-making, and does anything in the repo contradict anything else.

On the binding constraint: this project has no users and no funnel, so the honest analogue of product-love is **whether anyone outside can rely on the ledger** — and today nobody can, because the repo is private and the brief is behind a sign-in wall. The instrument does not need standing up; it works and has caught four drifts. **The flip is what converts a private instrument into something a stranger can rely on**, which is why README-as-product was the right increment and why the package review is the right next one — not more correction work.

Carry forward as the day's standing lesson: **treat my own fresh prose as an unverified source.** The fabricated ID was not a reasoning failure, it was trusting a sentence I had just written over a command I could re-run in two seconds.

## On hold pending data

- **W-3** — the ack watch on the erdosproblems.com/36 correction. Monitor only; both legs clean. Not ours to force, and deliberately decoupled from the launch: an inbox must not pace the flip.
- **A-12** — the hosted-brief drift. Escalation to David armed for 2026-08-07 naming the three missing dates; do not re-post daily.
- **W-5** — the mirror blind class: upstream's `README.md` is not mirrored, and it is where upstream states which records it stands behind. Read its `onTrigger` before building anything; the right shape is likely entry-level pins, not a byte mirror of a generated 421KB file that would go permanently red.
- **A-7 R6** — GitHub push protection. Deliberately not carded: the flip makes it free. Re-arm only if the flip is declined or unresolved by ~2026-08-16.

## State Appendix

- **Rail:** PACED (David-ruled 2026-08-01). Steward cadence first, then ≥1 launch increment, weekly forced-decision pass. No self-rating.
- **Upstream mirror:** `teorth/optimizationproblems` @ `dee1660`, 111 constant files, no drift.
- **Second surface:** `teorth/erdosproblems`, stewarded as entry-level pins (C-8 = problem 36), never a byte mirror — it is pushed near-daily and a whole-file alarm would be permanently red.
- **UNVERIFIED claims: 2, by design** — C-7 (the bound on erdosproblems.com/36) and C-9 (that page's last-edited date). The site 403s datacenter IPs, so CI can never check them; a local 200 proves nothing about CI and must not be used to re-automate them.
- **CI:** `reverify` green at HEAD, log-verified. Expected shape confirmed: `No drift. 111 files match upstream dee1660`, `229 claim(s): 227 hold, 0 broken`, two 403 advisory lines, brief job logging *not runnable from CI … Not filing an issue.*
- **Codex:** GREEN (codex-cli 0.143.0, `codex-health.mjs` exit 0). Not used today — no task met the Codex-first bar (scope ≥250 LOC, single-context-load, no taste calls); the README was pure taste work.
- **Open items (10):** G-1 — the steward-credibility goal · A-2 — the standing drift log (moved this pass) · W-3 — the watch on the erdosproblems.com/36 acknowledgement · A-7 — engineering-health P1s · A-9 — the P2 fix-on-touch backlog · W-4 — the rule that every new detector must demonstrate both answers (KP-78 — prove the instrument can fail) · A-11 — pin-a-negative for the two structured sources · A-12 — the hosted-brief drift · A-13 — the launch/public-flip package · W-5 — the mirror blind class on upstream's README.
- **Commits today:** `2210deb` (AGENTS.md), `13af4c4` (README-as-product), plus this report and the continuity update.
