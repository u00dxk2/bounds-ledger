---
product: bounds-ledger
date: 2026-08-04
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: cefb72e
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "The package-level adversarial review shipped (000bd9a), clearing the last gate that was ours before David's flip decision. Verdict: survives with one required decision. The finding is that our clean history sweep swept for credentials and nobody swept for people - the flip would publish a named third party, the verbatim email David sent him, that he has not replied, and a contingency David has since declined. Every artifact is individually accurate; the exposure exists only in the set, which is exactly what four artifact-level reviews could not see."
---

# bounds-ledger — daily (prelaunch) — 2026-08-04 (MT)

Paced rail, day 3. Steward cadence first, then the launch increment, then five orchestrator dispatches. No self-rating.

## BLUF

The last gate that was ours is clear. **The package-level adversarial review shipped (`000bd9a`)** and the flip package survives, with one required decision that only David can make.

The finding is the reason a package review is not the sum of the artifact reviews. Our history sweep on 2 August came back clean and it was correct - it swept for **credentials**. Nobody swept for **people**. Going public would publish the erdosproblems maintainer by name alongside our finding that his page is stale, the verbatim text of the email David sent him on 24 July, the fact that he has not replied, and a contingency David declined on 2 August. Each of those documents is accurate on its own. The exposure lives only in the set.

Steward cadence green, read from the log and not the badge: **no drift at `dee1660`, 229 claims / 227 hold / 0 broken / 2 UNVERIFIED by design. G-1 - the steward-credibility goal - is at green-streak day 12 of 30.** Both legs of W-3 (the watch for a reply to the 24 July email) read clean from this machine: the page still shows 0.380876 and still says last edited 23 January 2026. No acknowledgement. The north star stays at 0.

Two further findings landed against our own claims rather than the records, which is the pattern this lane keeps producing. `SECURITY.md` told public readers there was no supply chain to compromise, which under-stated the mutable action tags it runs on (`a9b2881`). And tonight's access inventory - the one I posted to the fleet with a positive control attached - was **missing four entries**, found only because I opened an endpoint to confirm another project's finding (`cefb72e`).

## What changed

- **`000bd9a`** — the **package-level adversarial review**, the paced rail's launch increment and A-13's last owed gate. Verdict SURVIVES WITH ONE REQUIRED DECISION. Three findings (F-1 high, F-2 medium, F-3 low) plus an explicit list of what could not be broken, each item re-derived by execution rather than read: 111 mirror files, 229 claims = 220 generated + 9 hand, every link and all four drift commits resolving, and `arXiv:2601.16175` re-fetched — the citation that was fabricated in yesterday's draft, executed rather than trusted.
- **`a9b2881`** — `SECURITY.md` now names its own residual supply chain. F-2 resolved by prose, not by a control, and the reason came from David's words to two other panes.
- **`cefb72e`** — F-4 added to A-13: the access enumeration was incomplete, and I found it by accident.
- **No ledger state moved.** No drift, no snapshot, no claims touched, no pins regenerated.

## Inputs (controllable)

- Steward cadence run first, as the rail requires: overnight scheduled run read from its log, then a local `npm run check` with `CC_PROMPTS_PIN` set. Both green. `npm test` 5 of 5.
- One launch increment shipped, per the paced rail. It was the one A-13 named as remaining.
- Five orchestrator dispatches answered, four of which needed original verification rather than a restatement: the capacity round, the board-state correction, the `checksPass` deploy-gate finding and its correction, and the check-suites hazard.
- **Nothing was asked of David.** Two candidate asks were identified and both were withdrawn before filing — one because his own words to another pane disposed of it, one because it is our defect rather than his decision.

## Outputs (lagging)

- **North star: 0 externally-acknowledged corrections.** Unmoved since the email went out on 24 July, now day 11. Both watch legs clean, meaning the page has not changed at all.
- **G-1 green streak: day 12 of 30.** Ends approximately 22 August.
- **Ledger: 229 claims, 227 hold, 0 broken, 2 UNVERIFIED by design, 111 mirror files at `dee1660`.** Identical to yesterday.
- **Reach remains structurally zero.** Private repo, gated brief, noindex. The flip is still the only act that changes this.

## Recommendation

**Take F-1 to David with the flip decision, not as a separate ask.** A-13 was already scheduled to reach him at streak day 14 (6 August) and the package is now review-complete. F-1 does not need its own card; it needs to be on that decision when it is put to him. Three defensible options exist and I hold no recommendation strong enough to substitute for his, because the email was his.

**Do not re-open the two withdrawn asks.** The SHA-pinning ask was withdrawn on his stated reasoning; the four GitHub Apps are our completeness defect, not a request.

## On hold pending data

- **A-13 public flip** — David's decision, package now complete, proposed 6 August. Nothing further owed by us.
- **W-3** — the watch for acknowledgement of the 24 July correction email: an inbox we do not control. Monitor only; both legs re-read clean today.
- **A-7 engineering-health P1s** — a coordinated fleet wave; deliberately not solved locally.
- **A-6 scale-the-catches** — needs residential fetches; unbuilt by choice.

## State Appendix

- **CI:** `reverify: completed/success @ cefb72e`. Tree clean, everything pushed.
- **Ledger:** 229 claims / 227 hold / 0 broken / 2 UNVERIFIED (C-7 the bound, C-9 the edit date, both `manual: true` on erdosproblems.com/36). 111 mirror files at upstream `dee1660`. 220 generated pins + 9 hand claims.
- **G-1** — the steward-credibility goal: green-streak day 12 of 30, north star 0.
- **A-13** — the launch definition and public-flip package: review-complete as of today; notes 7, 8 and 9 added (F-1 through F-4).
- **W-3** — the watch on the 24 July correction email: open, both legs clean, day 11 without a reply.
- **A-2** — the standing drift log: unchanged, four drifts recorded, none today.
- Open continuity items: 9. Continuity check: OK, 18 items, no findings.
- **Deploy gate:** not applicable. This lane owns **0 Render services** (verified against the API, 46 services enumerated, 0 match). Nothing deploys.
