---
product: bounds-ledger
date: 2026-08-11
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 7018cce
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "Our alarm could only ever tell us a number had vanished. It could not tell us a better number had appeared underneath ours — which is the one event this whole project exists to catch. We fixed that on the two sources where it can be done mechanically, by pinning what has to come immediately after the number we watch. If anything gets inserted below it, the alarm now trips and says so in those words. We proved it both ways on the real pages, not on made-up examples: untouched, it stays quiet; with a fake new record slipped in below, it fires. The count of corrections anyone outside has acknowledged is still zero."
---

# bounds-ledger — daily — 2026-08-11 (MT) — the alarm could not see a better number arrive

Paced rail, day 10. Steward cadence first, then the increment. No self-rating.

## BLUF

The ledger watched its sources by asking one question: is this exact number still on this page? That question can only ever notice a number going away. It cannot notice a better number arriving underneath it, and a better number arriving is the single event this project exists to catch. Today we closed that gap on the two sources where it can be done mechanically.

## What changed

- **We now pin what has to come next, not just the number.** A watched claim can carry the text that must still sit immediately after it. On Wikipedia's table of records for the overlap problem, we watch the newest row and require the end-of-table marker to follow it, so a new record row inserted below breaks the watch. On the community database behind the Erdős problem site, we already watched the top of problem 36's entry; we now also watch its bottom, so a field added to the entry can no longer slip past. The change to the checking code is small on purpose — the same matching it always did, asked a harder question.
- **Both watches were proven to fail correctly before we believed them.** Twice over. The self-check drives the code that actually ships rather than a copy of it, and covers four cases: quiet when the watched row is still last, firing when a new row is slipped in below it, and — the one that matters for reading a report — telling the difference between something being added below the row and the row itself being replaced. Then we did the same against the live pages: fetch both for real, splice a plausible new record in below the pin, and check the answer. Untouched, both read quiet. Mutated, both fire. The control refuses to report anything if the splice fails to land, because a mutation that silently does nothing is how this project once talked itself into a wrong verdict.
- **A break now says what happened in the right words.** If a better number appears, the report says something was added below the pinned row and calls it the event we are looking for, rather than reporting a missing pin and sending the reader off hunting for a deletion that never happened.
- **What stays blind is named, not quietly dropped.** Two sources are paper abstracts with no reliable structure to anchor to, and two are on the site that blocks our automated checks entirely. Those four cannot be fixed this way and are recorded as permanently blind. The self-check assertion that pins this gap was kept and reworded to describe them, so it cannot be forgotten now that the easier half is done.

## Inputs (controllable)

- **Steward cadence, run first and in full.** Last night's scheduled check read green *by its log, not its badge*: no drift, 112 files matching upstream, 229 pinned claims of which 227 held and none broken, and eleven self-checks passing. That is **day 19 of the 30-day green streak** the goal requires.
- **The local check ran with the pin set** — the only version that says anything about the two claims a machine on GitHub can never reach. Both read unchanged: the problem page still shows the old number and still says it was last edited in January. The hosted brief is in sync, all four dated blocks present.
- **Traffic sampled** (`npm run traffic`), sixteen days recorded. The window the sampler keeps is the only copy of anything older than a fortnight, which is why it runs every session.
- **The increment shipped and is pushed** — `7018cce`, closing **A-11 — the item tracking the blind spot described above**. Eleven of eleven self-checks pass; the live check is green.
- **One piece of housekeeping worth naming**: the push failed the first time because this clone had no tracking branch set. Fixed. It cost a minute, but it is the kind of thing that reads as a broken remote when it is nothing of the sort.

## Outputs (lagging)

- **Externally-acknowledged corrections: 0.** Unchanged. The pull request sent on the 5th has no comments and no reviews. The July email is unanswered. Both advisory checks on the problem page read unchanged from this machine this morning.
- **Arrivals: 1 unique viewer**, on day 4 since the repository went public. The clone figures are not deducted for our own checks and crawlers, so they are not evidence of a person.
- **Claims watched: 231**, of which 229 hold, none are broken, and two remain unverifiable by design.

## Recommendation

The next increment should be the one that has been deferred repeatedly: **being findable**. Two of the last four sessions improved the instrument, and today's addition closes the class the project most exists to catch — that is the right work, and it is still not the work that moves the number we care about. Nobody can acknowledge a correction from a repository they have never heard of. The instrument is now good enough that the binding constraint is plainly arrival, not detection.

## On hold pending data

- **W-3 — the watch for a reply** to the July correction. David's instruction stands: check, do not poll, do not nudge. Both legs read unchanged today.
- **A-7 — the last engineering-health item**, open on the scheduled verified history sweep alone, which is fleet-owned. Dated: if it has not landed by 2026-08-16 we take the per-repo fix.
- **G-2 — the goal of contributing a verified bound improvement.** Round four needs a family of graphs that buys colour more cheaply per edge than the joins rounds one to three all built; today's budget arithmetic is why that family is exhausted.

## State Appendix

- **Commits today:** 1 (`7018cce`). `main` pushed; local and origin agree.
- **CI:** scheduled run green, read by log — `No drift. 112 files match upstream dee1660…`, `229 claim(s): 227 hold, 0 broken/unreachable, 2 unverified (manual)`, 11 self-test PASS lines. Push run for today's commit triggered.
- **Ledger:** 231 claims (229 hold, 0 broken, 2 unverified). Mirror 112 files.
- **Open continuity items:** 8 — **G-1 — the stewardship goal**, **A-2 — the standing drift log**, **W-3 — the acknowledgement watch**, **A-7 — the engineering-health item**, **A-9 — the fix-on-touch backlog**, **W-4 — the watch requiring every new detector to be shown both firing and silent**, **W-6 — the read window on the report-an-error channel**, **G-2 — the contribution goal**. **A-11 — the blind-class item** closed today.
- **Cards awaiting David:** 0. **Codex calls:** 0.
- **Green streak:** day 19 of 30.
