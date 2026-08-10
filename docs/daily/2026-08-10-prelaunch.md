---
product: bounds-ledger
date: 2026-08-10
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 575c01f
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "Closed off a whole branch of the maths search, and it took arithmetic rather than a search to do it. The record graph we are trying to beat is built from a known recipe. We checked every version of that recipe against a hard limit on how many lines a two-layer drawing can hold, and every stronger version needs more lines than the limit allows. So that recipe cannot be pushed further, and we can stop trying. We also handed the search the record graph outright and let it grow: it held the record every single time and never beat it once. The count of corrections anyone outside has acknowledged is still zero."
---

# bounds-ledger — daily — 2026-08-10 (MT) — the recipe that made the record cannot make a better one

Paced rail, day 9. Steward cadence first, then the increment. No self-rating.

## BLUF

Today closed a line of enquiry rather than opening one, and that is the useful kind of day for a search that has to choose what to run next.

We are trying to beat a 1980 record. The record is a specific graph — a network of dots and lines — and it is built from a recipe: take a group of six dots where every dot connects to every other, take a ring of five, and join every dot in the first group to every dot in the second. The obvious way to push further is to use a bigger first group. We checked whether that can work, and it cannot. Every graph that can be drawn in two layers has a hard ceiling on how many lines it can hold, and every stronger version of the recipe needs more lines than the ceiling allows. Two of them miss by exactly one line. One version squeaks under the ceiling, and when we built it, it turned out to be a graph that is already known to need three layers rather than two — so it fails for a different reason.

That is a real closure and it cost milliseconds, not a search.

The second half was the search that round two asked for. Instead of hunting for structure at random, we handed the search the record graph itself and let it grow around it, over a hundred and sixty attempts. It kept the record every single time and beat it not once. That is worth more than it sounds: after round two it was still possible that the random search failed only because it never stumbled on the right structure. Given the structure outright, it still adds nothing.

**The count of corrections anyone outside has acknowledged is still zero.** The pull request sent last Wednesday has no comments and no reviews and has not been touched since the 5th. The problem page we wrote to in July is unchanged — we checked it from this machine this morning and it still shows the old number and still says it was last edited in January. One visitor to the repository since it went public, on day two of ninety.

## What changed

- **A branch of the search is closed by arithmetic.** We scanned thirty versions of the recipe behind the record. Fifteen of them would be strong enough to beat it. Exactly one of those fits inside the two-layer line limit — and building it showed it is the complete ten-dot graph, every dot joined to every other, which is already known to need three layers. So none of them work. Worth being precise about what is ours and what is borrowed here: the line-counting is ours and it runs; the fact that the ten-dot graph needs three layers is a citation from 1962, not something we can execute. Our checker can show you a two-layer drawing when one exists, but it cannot prove that none does, and proving none does is exactly what that last step needs. The write-up says so plainly rather than letting the conclusion read as fully ours.
- **The seeded search ran and found nothing above the record, which is the informative outcome.** Holding the record graph fixed and growing around it, across four sizes and forty attempts each, the answer was the record every time. positive control: the same pipeline is not silently returning empty — every one of those hundred and sixty graphs came back with a strength of nine and passed the independent checker, and the checker separately re-confirmed the record graph itself at nine before the search started. Round two's unseeded version of the same growth could not even reach the record — it topped out one short. Between them these two results say the recipe carries the whole of the record's strength and the growing carries none of it.
- **The new tool was proven to fail correctly before it was believed.** Two checks matter here. The line-limit test must flag the too-big versions *and* stay quiet on the record graph itself — a test that flagged the record would have closed the family by arithmetic error and everything above would be worthless. And the growing code must actually hold the graph it was given: the self-check confirms all fifty of its lines survive, and that a deliberately corrupted starting graph is rejected — we confirmed it is rejected for the right reason rather than by luck. That is the standing rule (W-4 — the watch that says a new detector must be shown to both fire and stay silent) applied to today's work.
- **A stale number came out of the project instructions.** They said there were seven self-checks; there are now eleven. The count was removed rather than corrected, because the automated build already prints the live figure and a number written in two places will disagree eventually. Same reasoning we used the last time this happened.

## Inputs (controllable)

- **Steward cadence, run first and in full.** Last night's scheduled check read green *by its log, not its badge*: no drift, 111 files matching upstream, 229 pinned claims of which 227 hold and none are broken, and eleven self-checks passing. That is **day 18 of the 30-day green streak** the goal requires.
- **The local check ran with the pin set**, which is the only version of it that tells us anything about the two claims a machine on GitHub can never verify. Both read unchanged: the problem page still shows the old number, still dated January. The hosted brief is in sync — all four dated blocks present.
- **Traffic sampled** (`npm run traffic`), the second day the counter has existed. Fifteen days recorded.
- **One new instrument shipped** — the round-three search, eleventh self-check, wired into the automated build in the same commit rather than after it.

## Outputs (lagging)

- **Externally-acknowledged corrections: 0.** Unchanged since the lane opened. The pull request is open and untouched; the July email is unanswered.
- **Certificates at the maths target: 0.** Best result found today equals the record and only because we handed the search the record. The 1980 lower bound stands untouched.
- **Repository visitors since going public: 1**, on day 2 of the 90 the watch asks for. Arithmetic, not a verdict — and an over-count at that, for the reason recorded yesterday.
- **Our own issue tracker: empty.** What an empty tracker means on day two.

## Recommendation

**Round four should change the shape of what it builds, and the reason came out of today's own numbers.** Every construction tried across three rounds is a join — glue two pieces together by connecting everything to everything. The line-count scan shows why that is the wrong instrument: a join buys three extra colours at a cost of one line per pair of dots across the gap, while the two-layer ceiling only rises by six lines per new dot. The cost outruns the budget almost immediately, which is exactly what the table of near misses shows. The next family to try should buy strength more cheaply per line than a complete join does.

Second, smaller: nothing today touched the one number that matters, and nothing scheduled will. The north star moves when a stranger acts, and the only lever we hold is that the repository is now public and findable. That argues for the next non-maths increment being about being found, not about being more correct.

## On hold pending data

- **The pull request and the July email.** Check, do not poll, do not nudge — David's standing word. Both read unchanged today.
- **W-6 — the watch on whether the invitation to report errors in the README ever gets used.** Day 2 of 90. Nothing to conclude and nothing to do but keep sampling, which is now a daily step.
- **The engineering-health item's last open leg (A-7 R7 — the scheduled verified history sweep).** Fleet-owned, waiting on the orchestrator's wave, with a self-imposed fallback: if it has not landed by 2026-08-16 we take the per-repo fix ourselves.
- **The offer made to the orchestrator yesterday** — close that item and respawn its one fleet-owned leg as its own item — is unanswered. If they say yes, do exactly that; do not re-ask.

## State Appendix

- **Repository:** public since 2026-08-08. `main` at `575c01f`, pushed, tree clean.
- **G-1 — the goal of becoming a re-verifying steward with one externally-acknowledged correction:** green streak day 18 of 30; acknowledged corrections 0.
- **G-2 — the goal of contributing a verified bound improvement:** round three complete, 0 certificates, record untouched. Instrument `search/27b/round3-seeded.mjs`; finding `docs/findings/2026-08-10-g2-27b-round-three-the-family-is-closed.md`.
- **A-2 — the standing drift log:** no drift today; four resolutions to date, unchanged.
- **A-7 — the engineering-health controls:** open on R7 alone (the scheduled verified history sweep).
- **A-9 — the P2 fix-on-touch item:** unchanged, closes at the next audit.
- **A-11 — pin-a-negative for two claims:** unchanged, not blocked on anyone, still the strongest remaining instrument-hardening candidate.
- **W-3 — the watch on whether the correction is ever acknowledged:** both advisory legs read unchanged from this machine today.
- **W-4 — the watch that a detector must be shown to both fire and stay silent:** standing; exercised today on the line-limit test and the seeded grower.
- **W-5 — the upstream-README blind class:** unchanged.
- **W-6 — the watch on whether the invitation to report errors is ever used:** day 2 of 90; 1 visitor.
- **Ledger:** 111 mirrored files, 229 claims, 227 hold, 0 broken, 2 unverified by design.
- **Self-checks:** 11, all in the automated build. `npm test` green, `npm run check` green with the pin set.
- **Codex calls:** 0. **Cost:** no paid API in this lane; nothing to flag.
- **Open continuity items:** 10. **Waiting on David:** none.
