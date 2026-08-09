---
product: bounds-ledger
date: 2026-08-09
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 56a8586
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "Built the counter that tells us whether anyone actually shows up. GitHub only remembers two weeks of visitor numbers, so the ninety-day question we said we would answer was quietly impossible to answer later - the days would simply be gone. It now saves them each day. First reading: one visitor since we went public, and the twenty-five people who appear to have downloaded the code are mostly us. The count of corrections anyone outside has acknowledged is still zero."
---

# bounds-ledger — daily — 2026-08-09 (MT) — building the thing that counts arrivals

Paced rail, day 8. Steward cadence first, then the increment. No self-rating.

## BLUF

The repository went public yesterday, and the honest next question is not whether that was good news. It is whether anyone shows up, and whether we would know if they did.

We would not have. GitHub tells you how many people visited a repository, but it only remembers the last two weeks. The watch we opened for this - W-6 (whether the "tell us this ledger is wrong" invitation in the README ever gets used) - says the answer needs ninety days of visitor numbers. Nobody had noticed that those numbers cannot be looked up at the end. They have to be written down as they go, or they are gone.

So today's build was the smallest thing that fixes that: a command that pulls the current two-week window and saves it, so the ninety-day figure can exist when we need it.

The first reading is worth stating plainly. **One visitor since the flip.** Twenty-five accounts appear to have downloaded the code, but every one of those landed on the 8th, which is the day we ourselves downloaded it over and over to check the cleaned-up history - so that number is mostly us, plus whatever automatically crawls a repository the moment it becomes public. Visits are the honest measure and visits read one.

Building it also turned up a limit in the question we had written. We had said the read needs a hundred unique visitors. GitHub only removes duplicate people within a two-week window, so any ninety-day figure is a sum of two-week counts and counts the same returning person once per day. That sum is an over-count. It is still useful, but only in one direction: if it is under a hundred we know for certain we have not had enough visitors to conclude anything, and if it is over a hundred we know nothing in particular. The watch now says so.

**The count of corrections anyone outside has acknowledged is still zero.** The pull request sent on Wednesday has no comments and no reviews and has not been touched since the 5th. The problem page we wrote to in July is unchanged - still the old number, still last edited in January. Our own issue tracker is empty, which is what an empty tracker means on day one.

## What changed

- **A daily traffic sample now exists** (`npm run traffic`). It pulls GitHub's two-week window of visits and downloads, merges it into a saved file, and prints how many days it has been since we went public alongside the running totals. It deliberately gives no verdict — it will not tell you whether the channel has had a fair read. That judgment belongs to a person, the same way our automatically-generated checks only ever assert where a number sits in a table and never assert that it is the record.
- **The credential stays out of the repository.** Reading visitor numbers needs permission, and this repository is now public, so nothing that carries a password may live in it. The command borrows the login the `gh` tool already holds on this machine. The consequence is that the sample cannot run on GitHub's own servers, which is fine — it is a once-a-day local step, and the same is already true of two other checks here for the same kind of reason.
- **The one part that can destroy data is guarded automatically.** The saved file is the only copy of anything older than two weeks, because GitHub has already forgotten it. A merge that kept only the incoming two weeks would silently delete the entire record we are building. That merge now has a self-check running in the automated build, and it was proven to work in both directions before shipping: with the bug deliberately put in, the check fails and names the missing history; with the bug removed, it passes. That is W-4 — the standing rule that a new detector must be shown to both fire and stay quiet — applied to today's work.
- **Weekly review of the open list, and something died.** A-7 is the item holding this repository's outstanding engineering-health fixes. Part of it was a question about paying GitHub for a protection feature. **That question is now dead** — going public granted the feature for free, so a deadline we had set for revisiting the spend can never arrive, and nobody should re-derive it. What did *not* die is the evidence: the protections are switched on, but neither has ever been shown to actually block anything, and in this lane a settings page is not a demonstration. That demonstration is still owed.
- **The stuck item got a date instead of another week of silence.** The rest of A-7 has waited eleven days on a fleet-wide fix that another team owns, and we were told not to fix it locally ahead of them. Saying it out loud: the waiting has now cost more than the duplicated work it was meant to avoid. **If that wave has not arrived by 16 August, we do the four fixes that need no coordination ourselves** — most importantly turning on protection for the main branch, which currently permits anyone with access to overwrite history on a public repository.

## Inputs (controllable)

- Steward cadence ran first and green. The overnight automated run was read by its **log, not its badge**: no drift, all 111 mirrored files match the upstream source, 229 pinned claims of which 227 hold, none broken, two unverified by design. That is **day 17 of the 30-day green streak** required by G-1 — the goal of becoming a genuine steward of a drifting record.
- The local run, which is the only one that can actually reach the blocked problem page, agrees: the page still shows the old number and still reports being last edited on 23 January. No movement on either leg of W-3 (the watch on whether our July correction is ever acknowledged).
- The hosted summary page for David is in sync — all four dated sections present.
- Ten self-checks now run in the automated build, up from nine. The suite refuses to let that number drift: a self-check added without a matching build step fails the build.
- Codex available and healthy; not used today, since the work was one small file and a set of judgment calls rather than bulk editing.

## Outputs (lagging)

- **Externally-acknowledged corrections: 0.** Unchanged. Publishing did not move it and was never going to.
- Pull request #141 to the upstream constants repository: open, no comments, no reviews, untouched since 5 August.
- The July email about the stale problem page: no reply. David's standing instruction is to wait, and to check rather than nudge.
- Visitors since going public: 1. Downloads: 25 accounts, almost entirely our own verification work on the 8th.
- Reports through the README channel: 0, on day 1 of a window that needs ninety. This is arithmetic, not a verdict.

## Recommendation

Tomorrow, take the standing technical increment rather than more instrument work: **round three of the Earth-Moon search** (G-2, the goal of contributing a verified improvement rather than only watching for drift). Two previous rounds agree from opposite directions that the known record is a deliberately designed object, so the next attempt should hold a designed structure fixed and search only around it.

The measurement rationale: G-2 is the only open path to the north-star number that does not depend on someone else replying to us. The email is unanswered, the pull request is untouched, and both are outside our control. A verified contribution is the one route we can advance alone.

The remaining instrument gap worth doing after that is A-11 — pinning a deliberate negative on our two structured sources, so a check that silently starts passing everything gets caught. It is not blocked on anybody.

## On hold pending data

- **A-7, the fleet-wide engineering-health fixes.** Waiting on another team's coordinated wave, eleven days. Now carries a 16 August fallback.
- **The last copy of David's email address**, which sits inside the text of one published commit. Removing it means editing history that is already on GitHub, so it needs his go-ahead. It is on his board.
- **W-3 — the watch for acknowledgement of the July correction — its reply leg.** Only David can supply a maintainer's reply; it lands in his inbox, not ours.
- **Pull request #141.** Check, do not nudge — his standing word.

## State Appendix

- **G-1 — the goal of becoming a reproducible steward of a drifting record:** open. Green streak day 17 of 30. Externally-acknowledged corrections 0.
- **G-2 — the goal of contributing a verified bound improvement:** open. Round three not started; the standing technical increment.
- **A-2 — the standing drift-resolution log:** open. Four drifts resolved to date; none today.
- **A-7 — the engineering-health P1s:** open, and the lane's only genuinely stuck item. The push-protection spend question died today; the fleet wave now has a 16 August fallback date.
- **A-9 — the engineering-health P2 backlog, fixed on touch:** open, unchanged.
- **A-11 — pinning a deliberate negative on the two structured sources:** open, unblocked, the strongest remaining instrument-hardening candidate.
- **W-3 — the watch for acknowledgement of the erdosproblems.com correction:** open. Both page legs read unchanged locally today; the reply leg is David's. Next scheduled look 24 September, which is a check-in and not a deadline.
- **W-4 — the standing rule that every new detector must be shown to both fire and stay quiet:** open by design, never closes. Exercised today on the traffic sampler's merge.
- **W-5 — the blind spot where upstream's own index is not mirrored:** open, unchanged.
- **W-6 — the read window for the README report-an-error channel:** open, day 1 of 90. Its sampler shipped today, and its hundred-visitor threshold was found to be measurable only as an over-count.
- Repository public. `main` at 56a8586, tree clean. 10 of 10 self-checks passing. Our own issue tracker empty. Open items: 10.
