---
product: bounds-ledger
date: 2026-08-21
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: 07d1bb3
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. The ledger is clean, the overnight check passed, and tomorrow is the day the goal this project has worked toward for a month reaches both its finishing conditions. Whether to call it done is your decision and not ours, and the evidence is already written down and waiting. Today the front page changed: a visitor now sees an actual example of the thing this project does, a real number that moved shown as it moved, in the first few seconds instead of having to click through to find one. The honest note is that everything we caught today was a fault in our own tools rather than anything in the mathematics, which is the fifth day running, and the report says so plainly rather than dressing it up."
---

# bounds-ledger — daily — 2026-08-21 (MT) — the front page shows the product instead of describing it

Paced rail, day 20. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — the steward cadence behind the sync guard. Run verbatim from a fresh pane, from a file rather than retyped:

```bash
cd C:/dev/skylark/bounds-ledger && git rev-parse HEAD origin/main && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && npm run verify && node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

Run first thing this morning: printed `fdda259` twice, `npm run verify` exit 0 with the receipt at that sha, CI **GREEN**. Whole chain exit 0. **Note it is `git rev-parse HEAD origin/main` and NOT `--short`** — I reproduced the 2026-08-18 defect live this afternoon by reaching for `--short` on two revisions, which fails with `fatal: Needed a single revision`. That rule is already written in `CLAUDE.md`; writing it down did not stop me typing it.

**THE NUMBER THAT WILL LIE TO YOU** — **164 unique cloners against 3 unique viewers** in the current 14-day traffic window (`npm run traffic`, sampled 17:05Z today). A cold reader sees 164 and reads an audience: a repo being pulled dozens of times a day by interested strangers. **It is very largely us.** `reverify.yml` checks this repo out on a daily schedule, on every push, and on every pull request, so the clone figure accrues from our own CI whether or not a single human ever arrives. The sampler deliberately does not deduct our own clones, CI checkouts or crawlers, and says so in its own output. **The only arrival figure here that is not mostly ours is the viewer count, and it is 3.** Since the repo went public on 2026-08-08 the honest read is 4 unique viewer-days, itself stated by the sampler as an UPPER bound because it cannot dedupe people across windows.

**DON'T-TOUCH** — **the cold-start primer's "Tomorrow's first-action — VERIFIED, exit 0 in the turn that wrote this" block.** What makes it work is that it is a **receipt, not a plan**: the command is written to a file and *run* at close, and the primer states the exit code it actually produced. That is the 2026-08-18 defect — a documented first command nobody had ever executed — fixed and holding for a third day. It cost nothing this morning and carried the whole cadence. Do not tidy it into prose, and do not paraphrase the command inline to get it past a guard.

## What changed

**The user-visible ship: `f421ea6` — the README's first screen now shows a catch instead of describing one.** The table of drift stories was eight rows of commit links, so the moment that sells this project — *it caught a record moving, and told you* — sat three paragraphs and a click away. The first screen now carries one real drift verbatim: the Fourier Entropy-Influence constant on 2026-08-02, a 17-variable certificate superseded by an 18-variable one, shown as the actual `-`/`+` hunk the mirror produced, closing on the line a visitor cares about — *if you had cited 6.5143… the week before, nothing would have told you.* Content only, no new code.

**Its own defect, found and fixed the same hour: `07d1bb3`.** The first draft of that block was **not verbatim and said it was**. I retyped the two lines, losing upstream's LaTeX spacing and a trailing comma, under a sentence claiming *"the actual diff our mirror produced, unedited"*. It was caught by grepping the commit for my own quotation and getting zero hits, then fixed by **extracting** the lines from the commit in code rather than retyping them — proved in both directions, with a fabricated line of the same shape that matches neither file. **"Verbatim" and "unedited" are method claims**, so they fall under this repo's audit-the-method-sentence rule, and the audit is mechanical: grep the source for your own quotation and require a hit. Recorded in `CLAUDE.md`.

**`b63391b` — A-27 opened, and the held pull requests finally have an owner.** A-17 — the row that owned the *previous* held stack — closed on 2026-08-18, and PRs #26 and #27 were opened on 2026-08-20 into no row at all. This morning's retro then found that **no surface a next agent could read said a review had ever been requested for them.** The request is now posted (bus `160f0567`), the orchestrator has acknowledged receipt and will dispatch the review as a separate lane, and A-27 carries the request ID, the merge order, and a `releaseTest` that runs.

**`69c6e4b` — G-1's close procedure, completed the day before it fires.** G-1 — the north-star goal of becoming the reproducible steward of a drifting record inventory — reaches both its close conditions tomorrow, and its `onTrigger` stopped at "mark it closed". It now names the daily-report frontmatter re-point and the sweep for text that cited it. Also in that commit: A-16 — the row recording the upstream report — had an `onTrigger` instructing that the issue be filed tomorrow, which its own `resolution` field records as filed on 2026-08-20 as `#150`; and W-8 — the row parking the unresolved question of whether a materially amended outward artifact returns to David before sending — was opened.

**`71b54dd` and `bcb089d`** — the `dd336d8` disposition, and A-22's fourth false WARN.

## Inputs (controllable)

Steward cadence ran first and green: mirror clean at **113 files @ `e70b4a4`**, **233 claims — 231 hold, 0 broken, 0 unreachable, 2 unverified** (C-7 and C-9, the two `manual: true` pins on erdosproblems.com/36, both advisory-HTTP-200 from this machine and correctly still UNVERIFIED because CI cannot see them). `npm test` exit 0, `npm run check` exit 0, CI **GREEN** at `07d1bb3`. Tree clean apart from today's traffic sample. The visitor path — the credential-free check the README advertises — was exercised as part of the ship rather than as a separate step.

**Overdue-signal scan: zero overdue open items**, with its own positive control — the same comparison returned 2 due today (A-23, A-25) and 4 dateless, so field resolution and date comparison both demonstrably fire. This is a measured zero, not a dead probe.

## Outputs (lagging)

**G-1 is unchanged at 1 externally-acknowledged correction** (Terence Tao merging `teorth/optimizationproblems#141` on 2026-08-11). The binding constraint did not move today; every other surface in this report refers back to this line rather than re-deriving it.

`npm run catches` — the Tier-1 catches-per-week indicator — reads **0 movements for the current week**, which is partial and never counted. The last completed non-zero week was 2026-08-10 at 4 distinct pins. **Candidate-correction queue depth: 0.** Upstream issue `#150`, sent 2026-08-20, is open with no maintainer reply; it is G-3's first live candidate and is deliberately not counted as a second acknowledgement.

### A-23 — this window's findings, classified

**Every finding this lane produced today was instrument-facing, and that is now the fifth consecutive day: the last record-facing catch was 2026-08-14** — `87a.md`'s current-record row citing a witness that proves the *previous* record — and today's five were a disposition of our own abandoned commit, a linter's fourth false WARN, a stale `onTrigger` inside a closed row, an incomplete close procedure, and my own README quotation claiming to be verbatim when it was not.

**What the first record-facing catch would look like, named as a claim so that it can be wrong:** it will be a **witness-value mismatch on a constant upstream added within the last thirty days** — the row's number is right, but the certificate or citation attached to it proves a different value — because the newest pages have had the least review and upstream's own README states the repository is AI-assisted with citations to be verified before publication, which is exactly the ground `87a.md` was found on. **And nothing we run automatically would flag it.** A witness mismatch is byte-stable, so the mirror diff sees nothing, the pins match, and the catches indicator correctly counts zero. It takes a human recomputing a row's cited certificate, which is how both record-facing catches this lane has ever produced were found. That is the falsifiable half: if the next one arrives through an alarm instead, this prediction was wrong.

## Recommendation

**Ship nothing further today unless the review verdict lands.** The user-visible increment is in, the dated gates are answered, and the two held pull requests are correctly waiting on a lane the orchestrator now owns. If the verdict arrives, merge #26 then #27 and enable Pages — that is the largest user-visible ship available to this lane and it is built and waiting.

**Do not read the fifth instrument-facing day as a reason to adopt a second surface yet.** The dry-week rule needs four *completed* zero weeks and a dry `docs/findings/`; findings are not dry, and the decision is David's regardless. What the classification is for is making the *next* quiet stretch legible, not this one.

## On hold pending data

- **PRs #26 and #27** — held for the cross-family review lane, request `160f0567` acknowledged, verdict pending. GitHub Pages stays off until it lands; publishing first would defeat the gate. Release test in A-27, run today: both `OPEN`, `reviewDecision` empty, verdict count still 2 and both historical.
- **G-1's close** — reaches both conditions tomorrow. **David's decision, never a self-approval.** Evidence pre-staged in the row.
- **W-3** — the watch on the erdosproblems.com correction email, unanswered since 2026-07-24, parked to 2026-09-24.
- **W-6** — the arrivals read, re-pointed 2026-08-20 to a qualitative n=1.
- **W-8** — whether a materially amended outward artifact returns to David before sending. Conservative default in force, so nothing is blocked while it waits.

## State Appendix

- **HEAD** `07d1bb3`, in sync with `origin/main`. CI **GREEN** at that sha. The morning steward cadence ran at `fdda259`, the day's opening sha, before any of today's commits landed.
- **Mirror** 113 files @ upstream `e70b4a4` (an upstream sha; it does not exist in this repo). **Claims** 233 — 231 hold, 2 unverified.
- **Commits today** — `71b54dd` the `dd336d8` disposition (**A-22** is the watch on the bus `sha-file-claim` linter; **A-17** is the closed row that owned the previous held stack) · `bcb089d` A-22's fourth false WARN · `69c6e4b` **G-1** — the north-star goal — close procedure completed, **A-16** — the upstream-report row — reconciled, and **W-8** — the parked question about materially amended outward artifacts — opened · `b63391b` **A-27** — the row owning the held pull requests — opened · `f421ea6` the README catch · `07d1bb3` its fix.
- **Dated gates due today** — **A-23**, the finding-classification row, is answered above. **A-25**, the row asking that deferrals carry an expiry and a check that reads it, is **NOT shipped**: re-dated once with the reason stated, per its own `onTrigger`, because the user-visible ship outranked it under the 80/20 ruling.
- **Traffic** — 3 unique viewers / 164 unique cloners in the 14-day window; 26 days recorded. Clone figure unattributed and largely our own CI.
- **Bus** — `7991fbbb` P1 · `53eeff71` P2 · `84386111` P3 · `160f0567` review request · `efa72f61`, `8e5dbe52`, `7234028f` fleet replies.
