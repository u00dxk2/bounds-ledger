---
product: bounds-ledger
date: 2026-08-16
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: 1eead7b
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. Two things got fixed, and both were our own mistakes rather than anything upstream. The public page describing what this project has caught was out of date - it said eight catches and the real number is nine, because one from Thursday never got written down. And the quick self-check I added so a visitor could confirm our claims in a minute turned out to work only on this machine: it depends on a password this laptop happens to have, so every stranger who tried it would have hit an error on the very first command. A review by a different AI model found that one, along with seven smaller problems, before any of it went out."
---

# bounds-ledger — daily — 2026-08-16 (MT) — the check for strangers that only ran at home

Paced rail, day 15. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — the ordinary steward cadence; nothing is pending and nobody is owed an answer.

```bash
cd C:/dev/skylark/bounds-ledger && npm run check
```

**THE NUMBER THAT WILL LIE TO YOU** — **`npm run check` exiting 0.** It means "the ledger is green *on a machine holding `CC_PROMPTS_PIN`*", and that qualifier is invisible in the output. Without the pin the same command exits 3 at its fourth leg. The misread a cold reader makes is treating today's green as a property of the repository rather than of this environment — which is exactly the error that put a broken command into the public README this morning, caught in review rather than by us. When you need a credential-free verdict, the two scripts are `reverify.mjs --check` and `check-claims.mjs`.

**DON'T-TOUCH** — the standing rule that **every public-touching artifact gets an adversarial refute-it review before it ships**. It works because the review is cross-model and runs against the *working tree*, so defects die before they are commits: today it returned DOES NOT SURVIVE on eight defects, one of which would have handed every visitor a first command that fails for them. A self-review would not have found it, because I was the environment that made it pass.

## What changed

**The README's catch table was stale, and now hands over the recipe instead of the number.** It claimed eight resolution cycles and stopped at 8/12; deriving the count from mirror history gives **nine** — `433091b` (2026-08-14, upstream added Martinet's constant for totally real number fields, taking the mirror to 113 files) was never recorded. A public page of ours carrying a stale count is the founding defect of this lane pointed at itself. The prose now gives the reader the command that produces the count, minus the two commits that resolved no drift.

**A three-step self-verification block landed — after review rebuilt it.** The point is that a visitor can confirm the alarm both fires *and* goes quiet, in about a minute, with no account. My draft failed that on its own terms:

- Step 1 was `npm run check`, verified from a shell holding `CC_PROMPTS_PIN`. For every actual reader it exits 3. I tested the stranger-facing artifact in the one environment that is not the stranger's — the lane's own written gotcha, committed against the artifact whose entire purpose is being checkable by outsiders.
- The block demonstrated the alarm **firing** and never demonstrated it going **quiet** — the both-answers rule broken inside the very section advertising it. `2b` now runs the check again after the restore.
- Five more: eight rows over nine cycles made "one row per cycle" false; `b5e3ac9` took the first snapshot but `2084008` armed the alarm, so "armed and extended" misnamed it; the sha hedge ignored that upstream can push mid-demo; `printf` is not shell-neutral on Windows (now `node -e`); and "nothing asks you to take our word for it" overclaimed what three commands can show.

The recipe was then executed verbatim as published: step 1 exit 0, 2a exit 1 `CHANGED constants/2a.md`, 2b exit 0 `No drift.`, step 3 exit 0 printing the three moved bounds. Shipped as `1eead7b`.

**R-2 (the fleet's CI-truth instruments) adopted, and its stated rationale corrected for this repo.** This lane had no `docs/daily-config.md` at all, so the file was created — which also makes `/listen`'s slug resolution deliberate rather than a lucky match on the directory name. Then the dispatch's reasoning turned out not to describe us: a bare `gh run list --commit <HEAD>` here returns `[]`, not a cron result, because that read is sha-scoped, so the multi-workflow trap does not reproduce in a one-workflow repo. The guard that actually protects this lane is the **unconditional event filter** (`check-ci-status.mjs:80`), not the `--workflow` flag. I had written the opposite and pushed it before checking; `c7a081f` fixes it. Positive control: at `fd70f11` two runs share the sha — a `schedule` success and a `push` success — and the script counted exactly one non-scheduled.

**The instrument refused to call my own ship green.** The first read on the pushed commit returned exit 2, *"a pending run is UNKNOWN, not a pass"*, while its run was still open. Waited; all three of today's commits are green on a completed non-scheduled run matching HEAD.

## Inputs (controllable)

- **Steward cadence, green.** 113 mirrored files byte-identical to upstream `e70b4a4` (an upstream sha; it does not exist in this repo). 233 claims: 231 hold, 0 broken or unreachable, 2 UNVERIFIED by design.
- **W-3 (the watch on the unanswered erdosproblems.com email) is unmoved.** Both `manual: true` claims got a real local advisory read: the page still shows `0.380876` and still says last edited 23 January 2026. Neither counts in CI, and neither should.
- **Three commits shipped**, each CI-verified against its own HEAD rather than a branch page.
- **One Codex dispatch** (the adversarial review). Open-status posted at hand-off per the visibility rule.

## Outputs (lagging)

- **G-1 (the north star — externally-acknowledged corrections) stays at 1.** The 8/11 merge of `teorth/optimizationproblems#141` remains the only acknowledgement. Nothing today moved it, and nothing today was meant to.
- **Catches indicator: the current partial week shows 4 distinct pins (6 movements); 0 completed consecutive dry weeks.** Quote the per-week figure — the running total only ever grows. The dry-week rule is nowhere near firing.
- **W-6 (the arrivals watch) has no read worth reporting.** The repo has been public eight days and nobody has been told it exists; a number here would be arithmetic, not a verdict.

## Recommendation

Keep the increment cadence on **README-as-product**, because it is now the surface a stranger meets and it has twice been wrong in ways only an outsider would have hit. The next candidate is the one thing today's work exposed and did not fix: nothing mechanically ties the catch table's count to mirror history, so it went stale silently for two days and only a hand-derivation caught it. That is a detector-shaped gap, and detectors here are trusted-print instruments — so it goes through the cross-family review gate rather than being written on impulse. Proposed, not started.

## On hold pending data

- **A-16 (the arithmetic defect on upstream's new Martinet-constant page) — gate 2 only, David's approval.** Gate 1 cleared 8/15. Not raised unprompted today, and deliberately **not** featured in the README's catch table: that table is our public scoreboard, and putting gate-pending criticism of upstream into it would be the declined-content-in-a-louder-channel move this lane has a rule against. The new row records the drift (upstream added the constant) and nothing more.
- **W-3 (the erdosproblems.com email, sent 24 July) — still unanswered**, 23 days. Separate channel from the merged PR; the merge says nothing about it.

## State Appendix

- **G-1 — the goal on externally-acknowledged corrections:** value 1, green. Open on the 30-day green-streak leg alone; the acknowledgement condition was met 2026-08-11.
- **G-2 — the goal on contributing a certificate (Earth-Moon target):** untouched today.
- **A-16 — the item holding the Martinet-constant arithmetic finding:** open, gate 1 cleared, gate 2 (David) pending. No action taken.
- **W-3 — the watch on the unanswered erdosproblems.com correction email:** open, unmoved, both pinned strings still present on the page.
- **W-6 — the watch on arrivals to the public repo:** open, no meaningful read yet.
- **R-2 — the fleet ask to adopt the CI-truth instruments:** adopted (`17e1392`), rationale corrected for this repo (`c7a081f`).
- **Mirror:** 113 files @ `e70b4a4` (an upstream sha; not a local object). **Claims:** 233 total — 222 generated, 11 hand-written, 2 `manual: true` reporting UNVERIFIED by design.
- **Commits:** `17e1392`, `c7a081f`, `1eead7b` — all pushed, all CI-green against their own HEAD.
- **Codex dispatches today:** 1.
