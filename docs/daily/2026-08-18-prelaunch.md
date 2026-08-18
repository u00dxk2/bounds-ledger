---
product: bounds-ledger
date: 2026-08-18
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: e351b6b
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "Nothing needs you today. The ledger is clean and the overnight check passed, which is streak day 26 of the 30 we need by Saturday. Today's catch was in our own instructions rather than in the mathematics. Yesterday I wrote a safety check into the top of tomorrow's start-up notes - one line that compares the code on this machine against the copy on GitHub, so a session cannot check the wrong version and report all-clear. I never ran it. It had a typo that makes it stop with an error, and because every later command was chained behind it, the whole morning routine would have quietly done nothing at all: no ledger check, no comparison against the source, no claim check. Anyone following the notes would have seen one error message about revisions and no other output. It is fixed, and I proved the new version both passes when the two copies match and stops when they differ. The lesson I am writing down is small and specific: a command written into instructions is only verified by running it."
---

# bounds-ledger — daily — 2026-08-18 (MT) — the first command in tomorrow's instructions had never been run

Paced rail, day 17. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — the steward cadence, now behind a sync guard that actually runs. Then check whether the cross-family review lane has replied on the held `alarm-title-honesty` branch; if it has, merge that branch **before** the guard branch (A-17 — the item tracking the two held PRs).

```bash
cd C:/dev/skylark/bounds-ledger && git rev-parse HEAD origin/main && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && npm run check && node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**THE NUMBER THAT WILL LIE TO YOU** — **"0 catches this week"** from `npm run catches`. A cold reader sees a zero beside a rule that says *a month of zeros means adopt a second surface*, and starts drafting that proposal. Three things stop that being the right read. The current week is **partial** and is never counted; the completed-dry-week counter reads **0**, not four. The indicator counts **drift detection only** — a generated pin whose expected string moved — and today's actual catch was a broken command in our own docs, which it is built not to see. And the amendment of 2026-08-14 says the zeros do not fire that rule alone: dry means no movements **and** no findings, and `docs/findings/` gained one today. Read it beside the **candidate-correction queue depth of 1** — one verified defect in a stewarded surface, found and then blocked at a gate, named and glossed under Outputs below: a zero rate next to a non-zero queue is not a quiet week, it is work found and blocked.

**DON'T-TOUCH** — **the rule that a run stays RED when a cited source is unreachable.** Two claims (C-7, C-9 — the two `manual: true` pins on erdosproblems.com/36) reported UNVERIFIED again in this morning's CI run on a 403, exactly as designed, and the standing temptation is to make that non-fatal so the board is all-green. It works because UNVERIFIED is an honest verdict about a source we could not read, and a green there would launder an unverifiable result into a pass — the one thing this repo cannot do and remain worth anything.

## What changed

**The catch: the primer's own first-action command exited 128 and skipped the entire cadence.** Yesterday's session closed a real near-miss — `check-ci-status.mjs` reads *local* HEAD, so on a feature branch it had printed a confident GREEN about that branch while `main` was red — and added an unconditional sync guard at the top of today's first action. The guard was written `git rev-parse --short HEAD origin/main`. **`--short` accepts exactly one revision;** given two it exits 128 with `fatal: Needed a single revision`. It sat at the head of an `&&` chain, so a cold agent pasting today's first action would have run **no `npm run check`, no mirror diff, no claim check** — the whole steward cadence skipped, behind an error message about revision parsing that reads like a repo problem rather than a typo.

The working form was quoted **one line above it in the same section's prose**. The block was a decoration of a correct sentence, never executed. The section immediately below it is headed *"Both answers demonstrated at adoption (KP-78 — ship no detector without showing it can fail)"* — and that demonstration covered the block's **second** line, `check-ci-status.mjs`. The first line was never run at all, while the KP-78 header underneath read as though it covered both.

Three surfaces in two files (`docs/cold-starts/2026-08-18.md` twice, `docs/daily-config.md` once) — the fix-one-surface-leave-the-others pattern this repo keeps hitting. All three replaced with a form that prints both shas and **aborts** on mismatch, so a diverged checkout stops the cadence instead of running it against the wrong commit. Shipped in `e351b6b`; finding at `docs/findings/2026-08-18-the-guard-against-a-wrong-commit-read-never-ran.md`.

**My first repair was also wrong, and the finding says so.** I drafted `git rev-parse HEAD origin/main | uniq` — compact, one line of output means in sync. It breaks `AGENTS.md`'s hard invariant *never read an exit code through a pipe*: in an `&&` chain the status consulted is `uniq`'s, which is 0 whatever `git rev-parse` did. A fix for a guard that never ran, introducing by hand the failure mode the repo forbids by name. Caught by re-reading the invariant before committing, not by any check. Recorded rather than quietly swapped, because the near-miss is the useful part.

**Steward cadence, all green.** `npm run check` first, then the overnight log — that order, per `CLAUDE.md`'s rule *"Steward cadence runs `npm run check` FIRST, then reads the overnight CI log"*, which exists because the two answer different questions and a stale green log buys false confidence. No drift, 113 mirror files at upstream `e70b4a4` (an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo). **Positive control: `git cat-file -t e351b6b` returns `commit`, while `git cat-file -t e70b4a4` returns `fatal: Not a valid object name` — the resolver works, so the upstream sha's absence is a fact about the sha and not about a broken command.** The overnight log also carries the expected `advisory fetch failed (HTTP 403)` beside both manual claims — the same 403 named in the BLUF, seen from a datacenter IP. 233 claims: 231 hold, 0 broken, 2 UNVERIFIED by design. State block in sync; hosted brief in sync, all 4 dated blocks present. The **credential-free visitor path** ran as its own step and exits 0 — the README's front door works for someone who is not me.

**A-17 unchanged and correctly still held.** Both branches re-verified as merging clean today (`git merge-tree --write-tree`, exit 0 each) — GitHub reports `mergeable=UNKNOWN` for both, which the local check settles. **No reply from the review lane on PR #21**, so nothing merges: `alarm-title-honesty` touches the alarm's printed verdict, squarely a trusted-print instrument, and the cross-family gate is not mine to waive.

## Inputs (controllable)

- Steward cadence run in the prescribed order; visitor path run as its own step; traffic sampled (`npm run traffic`) so the 14-day window is not lost.
- One concrete increment shipped and pushed: `e351b6b` — the sync-guard fix across three surfaces plus the finding.
- **Codex: GREEN (probe 2026-08-18T14:16:50.085Z)** — quoted from the kickoff's prepended probe line, not re-run. `codexCalls: 0` today, and that is a judgment I will defend rather than a tooling gap: the day's work was reading a primer, executing its commands, and writing one finding plus a three-line documentation fix. There was no bulk diff and no second-implementation question — the two shapes that earn a dispatch.
- KP-78 — the standing rule that no detector ships without both of its answers demonstrated — satisfied **on the string actually shipped**, which is this finding's own lesson: old form exit 128; in sync exit 0; diverged against `origin/alarm-title-honesty` (a real divergent ref) exit 1; and the chain printed nothing when diverged, proving it aborts.
- Dead-reference check re-run **after** the commit and clean at 63 paths — it resolves against HEAD, so a new finding referenced in its own commit necessarily fails the pre-commit read and passes the post-commit one. Worth knowing before treating that FAIL as real.
- `npm test` exit 0, 13 self-tests. Pre-commit secret sweep clean, 13 patterns.

## Outputs (lagging)

- **G-1** (the goal of becoming a reproducible steward of a drifting record) — acknowledgement leg **met since 2026-08-11**; streak leg now **day 26 of 30**. Today's scheduled run (`32121595508`, 09:26Z, `afed5e6`) completed and **reached a verdict**, so it counts under the pre-registered `streakDayRule`. Both legs are on course for **Saturday 2026-08-22**, and closing G-1 is David's decision.
- Catches indicator: current partial week **0**; **0 completed dry weeks**. Candidate-correction queue depth **1** (A-16).
- **W-6** (the read window on the README's report-an-error channel): 3 unique viewer-days since the flip, 23 days recorded. Thresholds are 90 days **and** 100 unique visitors; unreadable until **2026-11-06**. An early zero here is arithmetic, not a verdict.
- True open issues **0**; Dependabot alerts **0** (structurally — the dependency set is empty).

## Recommendation

Hold. Nothing needs David today. The one decision approaching is **G-1's close on Saturday 2026-08-22**, and its evidence is already pre-staged in the item — that read should be a decision, not a dig.

For tomorrow's session: the day's work is the cadence plus whichever of A-17's two PRs the review lane has cleared, in the stated order. If the lane has still not replied by 2026-08-20, that is worth surfacing as a question about the gate's latency rather than a reason to merge unreviewed.

## On hold pending data

- **A-17** — both PRs validated, mergeable, and waiting on the cross-family review lane (request `8ecb03e8`). Not mine to release.
- **A-16** — the upstream record row whose cited witness yields the previous record. Gate 2 is David's. Do not raise, do not PR, do not contact upstream.
- **A-15** — the Mathstodon send, dormant by instruction. Do not ask.
- **W-3** — the erdosproblems.com/36 correction email, still unanswered. A different channel from the merged PR; it does **not** close on that.
- The kickoff's live read shows **stale-actionable (7d) = 5**, above the >3 threshold that makes the weekly forced-decision pass a real one rather than a formality. That belongs to P4, not to this phase, and is flagged here so it is not lost.

## State Appendix

| Figure | Value | Command |
|---|---|---|
| HEAD / origin sync | **`e351b6b` both**, exit 0 | `git rev-parse HEAD origin/main` then a `test` comparison of the two |
| CI at HEAD | **GREEN**, 1 non-scheduled success | `node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml` (exit 0) |
| Overnight scheduled run | **success**, verdict reached — streak day 26 | `gh run view 32121595508 --log` |
| Mirror | **113 files @ upstream `e70b4a4`**, no drift | `npm run check` |
| Ledger | **233 claims — 231 hold, 0 broken, 2 UNVERIFIED by design** | `npm run check` |
| Visitor path (no credentials) | **exit 0 / exit 0** | `env -u CC_PROMPTS_PIN node scripts/reverify.mjs --check` then `check-claims.mjs` |
| Hosted brief | **in sync**, 4/4 dated blocks | `node scripts/check-brief.mjs` |
| Self-tests | **13/13**, exit 0 | `npm test` |
| Dead doc references | **0** across 63 paths | `node ../skylark-site/scripts/check-doc-references.mjs` (exit 0, post-commit) |
| True open issues | **0** | `gh api` on the issues endpoint, filtered to drop pull requests |
| Open PRs | **2** (#21 then #22), both merge clean | `git merge-tree --write-tree main origin/<branch>` (exit 0 each) |
| Open items | **11** of 24 | `continuity/items.json` |
| Catches | partial week **0**; **0** completed dry weeks; queue depth **1** | `npm run catches` |
| Arrivals (W-6) | **3 unique viewer-days**, 23 days recorded | `npm run traffic` |
