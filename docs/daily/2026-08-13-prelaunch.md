---
product: bounds-ledger
date: 2026-08-13
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: 6eec1e7
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "A quiet day on purpose, and the first one in a while. Everything we watch was unchanged, the overnight alarm ran clean, and we spent the time building the one measurement you approved yesterday but that nobody had built yet: how many records we catch moving each week. It matters because the headline number for this project sat at zero for three weeks and then jumped to one, which told us nothing on any day in between. The new number is worked out from our own history automatically, so it cannot go stale. Building it turned up two mistakes in my own work, both fixed and both written down, and the honest reading is that the number is a ceiling rather than an exact count. One correction to today's brief from the orchestrator: it asked where the proposed upstream correction stands and whether it is waiting on your approval. It is not. We dropped it yesterday after review found it would have told the maintainer his own deliberate edit was a mistake. Nothing is waiting on you."
---

# bounds-ledger — daily — 2026-08-13 (MT) — the gradient G-1 never had

Paced rail, day 12. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — steward cadence, live check before the log, with the pin in the environment:

```powershell
npm run check
```

**THE NUMBER THAT WILL LIE TO YOU** — the new indicator's **8 catches across 3 weeks**. A cold
reader will take that as eight records we caught moving. It is a **ceiling, not a count**. One of
the eight, `pin:15a:U`, is two kinds of wrong at once: it moved on a citation-key rename in which
every bound value stayed byte-identical, and it was **our own PR #141 landing** rather than
anything we caught. The script prints that caveat on every run precisely so this figure cannot be
quoted bare.

**DON'T-TOUCH** — the CI-wiring guard inside `reverify.test.mjs`, which refuses any self-test that
`npm test` runs but the workflow does not. It caught today's new self-test in the negative control
within seconds. What makes it work is that it **derives** the expected set from `package.json`
rather than checking a hand-maintained list, so it cannot fall behind the thing it guards — the
same property that makes the README state block trustworthy.

Nothing we watch moved today, which is the correct outcome and not a slow day: the alarm ran
overnight, read green from the log at the final pushed commit, and the increment shipped.

## What changed

**Shipped the Tier-1 leading indicator approved yesterday and unbuilt until now: verified catches
on named records, per week** (`scripts/catch-rate.mjs`, `npm run catches`, commit `6eec1e7`).

It exists because **G-1 — the goal of getting one correction acknowledged by someone outside — has
no gradient.** Its count sat at 0 for 21 days and then jumped to 1. On none of those 21 days could
you tell whether the project was working. The new figure answers the question that count cannot:
*is the adopted surface still alive enough to be worth stewarding?* A month of zeros is the signal
to adopt a second surface, not to try harder on this one.

**It is derived from git history, never hand-maintained** — the same reason README's state block is
generated. A figure a human retypes weekly is stale between retypes.

**The definition does real work.** A catch is a *generated pin whose expected string changed*. That
is not a proxy for record movement, it **is** record movement: generated pins are rewritten only by
`extract-pins.mjs` from the mirror, so the sole way one changes is that its bounds-table row moved
upstream. The editorial-versus-record split then falls out for free, and it reproduces this
ledger's own recorded history without being told it:

- `50c8096` — the 28 July editorial drift, a dead cross-link and a missing `C` in a LaTeX
  inequality — never touched `claims.json` at all. **Zero catches**, correctly, even though the
  mirror really drifted and the alarm really fired.
- `da17be3` — recorded at the time as the *first pure record movement* — moved exactly the three
  pins its note names.

**Two defects in my own instrument, found while building it.** Both are the more useful half of
today:

1. **The first version counted `pin:2a:U` three times.** Upstream reworded one attribution
   paragraph across three pushes on 12 August, and each push moved that pin. `CLAUDE.md` names
   *this indicator* as the thing an upstream editing burst corrupts — it says a burst measures
   upstream's typing speed and reads as productivity — and I built the inflation in anyway, one
   day after the rule was written. The headline is now **distinct records per week**, with the raw
   movement count kept visible in parentheses so the burst is not hidden either.
2. **`pin:15a:U` moved without any bound moving.** A citation-key rename changes the pinned row
   because the row contains the citation tag. The same pin was also our own merged PR, so it is
   not a catch in either sense.

**The second one is deliberately not fixed**, and that is the load-bearing decision. Separating a
value change from a citation change means parsing the value out of the cell, which symbolic cells
like `$K_{DR}+10^{-26}$`, negative entries and O(·) asymptotics defeat — a parser was already shown
to mis-rank three files this way on 24 July. Building it would put an unverified mathematical
judgment inside our own ledger. **The pin rule applies to the indicator built on the pins:** it
asserts that listing position moved, never that a record moved. So the figure is published as an
upper bound, and says so on every run rather than in a doc nobody re-reads.

**W-4 — the standing watch that every new detector must demonstrate both answers — exercised on
two levels.** The self-test fires on a moved generated pin and stays silent on unchanged, added
(upstream adding `86a` is not a catch), removed, hand-claim edits, and the commit before the file
existed. Fixtures rather than git history, deliberately: `actions/checkout` is depth-1, so a
history-walking self-test would pass on this laptop and be untestable on the runner — the same
test-it-from-the-environment-that-runs-it rule that the 25 July 403 taught us. Then the guard
itself was negative-controlled: delete the new workflow step and `reverify.test.mjs` exits 1 naming
`node scripts/catch-rate.mjs --selftest`; restore it and it exits 0 at 19 workflow steps and 13
self-tests. `git diff --numstat` proved the mutation landed before either result was believed.

**The indicator never runs in CI.** It renders a figure and no verdict, so there is nothing for a
build to fail on — the same class as the traffic sampler and the gap table.

**One correction to today's kickoff.** It asked where the outreach PR stands against David's words
*"Draft it and show me the PR, codex adversarial review it, then after I approve you can send it"*,
and framed the send as gated on his approval. **It is not: A-14 — the proposed 3b asterisk
correction — was closed yesterday, dropped by the adversarial review before it ever reached him.**
`git log` on the exact line showed the maintainer had put that asterisk where it is *on purpose*,
in a commit whose stated subject was that marking. We would have told him his own deliberate edit
of the previous day was incomplete, one day after he merged PR #141 — our first correction, and
the single event that moved this project's headline number from 0 to 1. Verified against
`continuity/items.json` rather than inherited from the prose — which is the failure that produced
the "checked, not nudged" line on 12 August.

## Inputs (controllable)

- 2 commits pushed: `6eec1e7` and this report's
- `npm run check` exit 0 with the pin set, read as an exit code and never through a pipe: no drift, 112 files at upstream `603052d`, 231 claims, state block in sync, hosted brief in sync at 4 of 4 dated blocks
- Overnight CI read **from the log, at the final pushed commit** `0a3af88` (run `31687656601`): real check output, not a badge
- `npm test` exit 0 — 13 self-tests, up from 12
- W-3 — the watch on whether anyone outside acknowledges our July correction — both advisory legs read from this machine: erdosproblems.com/36 still shows `0.380876`, still dated 23 January 2026. Unchanged. Not nudged.
- `npm run traffic` sampled (W-6 — the arrival watch; GitHub forgets days older than 14)
- Codex calls: 0 — no task today warranted delegation; the day was one small script and its controls, and P1 is not Codex-shaped

## Outputs (lagging)

- **G-1 — externally-acknowledged corrections: 1.** Unchanged today. The acknowledgement condition is met; the item stays open on the 30-day green streak alone.
- **Green-streak: day 21 of 30** (day 1 = 2026-07-24).
- **New Tier-1 reading — distinct records caught moving per week: 4, 4, and 0** for the weeks of 27 July, 10 August and 20 July respectively. Treat every figure as a ceiling for the reason in the BLUF; the honest count for this week is 3.
- **W-6 — arrival: 3 unique viewer-days since the repo went public, day 6 of 90, still 0 referrers.** Nothing on the internet links here. Viewer-days overcount distinct people, so 3 is an upper bound on an upper bound. The threshold is 100 unique visitors across 90 days.
- 8 drift cycles caught and resolved since the alarm was armed.

## Recommendation

**Tomorrow's increment: the adversarial review of the Mathstodon post, and only the review.**
W-6 — the arrival watch — says nothing on the internet links here, which makes arrival the binding constraint on a *second*
acknowledgement — and the findability menu named Mathstodon first, conditional on having a merged
PR to point at. We now have one. The review is ours to do; the send is David's, and it must not be
carded before the review exists, because the standing rule is that every public-touching artifact
is refuted first. Doing the review is what turns this from an idea into a decision he can actually
take.

If that stalls, **G-2 round four** remains the standing technical increment — it needs a family
that buys colour more cheaply per edge than the joins of rounds one through three.

**Do not build the value-parser** that would make the new indicator exact. That is the most obvious
next move and it is the wrong one, for the reason recorded above.

## On hold pending data

- **W-3** — whether the erdosproblems.com maintainer answers the July email. David's WAIT stands; check, do not poll, do not nudge. This is a different channel from the merged PR and does not close on it. Both advisory legs unchanged today.
- **A-7** — the remaining leg is the scheduled verified history sweep, fleet-owned and not ours to move.

## State Appendix

- `main` at `6eec1e7`, pushed, tree clean, public. Local and origin agree.
- Mirror: 112 files at upstream `603052d` (an upstream sha — it does not resolve in this repo, so do not `git show` it locally). positive control: in the same repo `git cat-file -t 6eec1e7` returns `commit`, so the command works and the object is genuinely foreign rather than the check being broken.
- Ledger: 231 claims, 229 hold, 0 broken, 2 unverified by design — C-7 and C-9, the two `manual: true` claims on the site that blocks datacenter fetches.
- `npm test` 13 self-tests, all present in the workflow, verified by the guard rather than by reading. `npm run check` green with the pin set.
- New this session: `scripts/catch-rate.mjs`, `npm run catches`.
- Open continuity items: 8. A-14 — the dropped 3b correction — closed yesterday.
  - G-1 (the goal of one correction acknowledged from outside)
  - A-2 (the standing drift-resolution log)
  - W-3 (the watch on the July email to erdosproblems.com)
  - A-7 (engineering health, open on the fleet-owned scheduled history sweep)
  - A-9 (the fix-on-touch engineering backlog)
  - W-4 (the both-answers rule every new detector must satisfy)
  - W-6 (the arrival watch on the report-an-error channel)
  - G-2 (the goal of contributing a verified bound improvement)
- Cards waiting on David: 0. Nothing was carded today, deliberately — the one candidate has not passed its adversarial review yet.
