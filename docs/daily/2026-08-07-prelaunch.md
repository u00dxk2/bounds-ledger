---
product: bounds-ledger
date: 2026-08-07
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 5db3194
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "Eleven ways to beat a 1980 record, all eleven dead - and the way they died is the finding. Two approaches with nothing in common both stopped exactly one step short, which says the record is not stuck by bad luck but squeezed from two sides at once, and it says where to look next."
---

# bounds-ledger — daily (prelaunch) — 2026-08-07 (MT)

Paced rail, day 6. Steward cadence first, then the launch increment. No self-rating.

## BLUF

We tried eleven ways to beat a mathematical record that has stood since 1980. All eleven failed, and that is the useful result, because of *how* they failed.

Two approaches with nothing in common both stopped exactly one step short. One works by piling on structure until the graph gets too crowded to draw the way the problem demands; it overshoots by a single connection. The other works by staying inside the crowding limit and asking how much you can get for free; it comes up one short too. Arriving at the same wall from opposite directions says the record is not sitting there because nobody has been lucky - it is squeezed from two sides at once. That also told us where to look next, and the new direction is the reverse of what we did today.

Nothing about the ledger itself moved, which is correct. **The count of corrections anyone outside has acknowledged is still zero.** David asked us to send the pull request today and to check first whether we had already sent it. We had - Wednesday. So we sent nothing, and said so.

## What changed

**The steward cadence, first and clean.** The overnight run passed on every leg, read from its log rather than its badge: no drift across all 111 mirrored files, 229 claims with 227 holding, and the eight self-tests passing. That is **G-1 — the goal of getting an outside project to acknowledge one of our corrections — at green streak day 15 of 30.** The local run with the sign-in pin set agreed, and the hosted brief is in sync with its source, all four dated blocks present.

The two claims that never go green stayed exactly as designed. **C-7 and C-9 — the two pins on a page that blocks automated reading from data-centre machines** both fetched fine from this laptop and both showed the page unchanged: the value still reads as it did in January, and the page still says it was last edited on 23 January 2026. That is the watch called **W-3 — the wait for the maintainer to react to what we sent** reporting no movement, which is information, not silence.

**David's card, answered by checking rather than remembering.** He wrote: *"Looked at the six lines and they check out. Send it. (first double check that we didn't send it yesterday? I thought you did)"*. The double-check was the instruction that mattered. We had sent it - Wednesday 5 August at 2:45pm, as pull request 141 on the project we mirror, and it is the same six lines. Our own commit from Wednesday records the send, and there is exactly one pull request from us upstream, so there was nothing to send and sending again would have opened a duplicate. Reported back to him in his words rather than acting on the first half of the sentence.

**The day's real increment: round one of the record campaign.** This is **G-2 — the goal of contributing a verified improvement, not just watching for drift.** A new proposal-round runner builds each proposed construction as an explicit graph and puts it through four gates in cheapest-first order, recording which gate killed it. Eleven candidates, zero survivors: five too crowded to be drawable the required way, two containing a structure that is provably impossible there, four not reaching the tenth colour.

The convergence is the finding. The natural successor to the 1980 construction misses the crowding limit by **exactly one connection**. There are two places to buy that one connection back, and both cost you the win: take it from inside the dense core and you fit, but you drop back to the old record; take it from the join and you keep an impossible structure. Separately, a completely different family built to respect the crowding limit from the start tops out one short as well. Written up in full at `docs/findings/2026-08-07-g2-27b-round-one-the-one-edge-vise.md`.

**And it pointed at round two.** Every death was one of two plain sentences - too crowded, or not enough colour. Nothing died subtly. So stop proposing ambitious graphs and hoping they are drawable, and instead build graphs that are drawable *by construction* and measure how much colour they carry. That searches the space where the hard constraint is free instead of the space where it is binding.

**Two instrument catches, both from executing rather than reading.** First, the initial run built two differently-named candidates as the *same graph* - a helper dropped the last connections in the list, which in this construction are all of one kind, so the candidate we thought we were testing had never been built. Nothing caught it except noticing that two rows which should have differed did not. The self-tests did not catch it, because they test the gates and not the list of graphs pointed at the gates - the same shape as the enumeration lesson filed under **A-13 — the work to make this repository publishable**. It is now fixed so that a mislabelled candidate fails loudly, and the fix changed the answer: it exposed the one-short near-miss the whole finding rests on. Second, the new self-test's CI wiring was proven both ways rather than assumed - removing the workflow step made the guard fail and name the missing test, restoring it returned green with all eight present.

## Inputs (controllable)

- Ran the steward cadence before anything else, and read the CI **log** rather than the badge.
- Answered David's card by verifying against the upstream project and our own commit history, not from memory - which is what stopped a duplicate pull request going out.
- Shipped the round-one runner with its self-test wired into both `npm test` and CI, each of its four gates proven to fire when it should and stay silent when it should not.
- Labelled the one gate we could not execute as cited-not-executed in the code, the console output and the saved results, and recorded why its failure direction is the safe one.
- Recorded the negative result in full, including the two candidates that died for reasons we did not predict.

## Outputs (lagging)

- **Corrections acknowledged by anyone outside: 0.** Unchanged. Pull request 141 has been open about 42 hours with no comment and no review.
- **G-1 green streak: day 15 of 30.**
- Ledger: 111 mirrored files, 229 claims, 227 holding, 2 unverified by design.
- **G-2 certificates produced: 0.** Eleven candidates eliminated.
- Reach is still zero, because the repository is still private.

## Recommendation

Run round two on the inverted search: build the graph so the hard constraint is satisfied by construction, then measure the quantity we can compute exactly. Round one's gates stop being the search and become the check on whatever the new method produces.

Do not read today's near-misses as encouragement. Landing one short twice is evidence about the shape of the obstacle, not evidence that a small push finishes it - and both near-misses simply re-derive a bound that has stood since 1980. Nothing here is reportable to anyone, and no mathematical claim has been made.

Keep waiting on pull request 141. David's standing word is to wait rather than nudge, and 42 hours is ordinary for a small correction to a busy project.

## On hold pending data

- **The public flip stays on hold**, on David's word of 5 August, until the remaining publication blockers are cleared.
- Three of those are his decisions and not ours: whether to put a licence on our own work, his private words quoted in our decision documents, and the parts of the blockers that live in commit history rather than in current files.
- **W-3 — the watch for the maintainer to react to what we sent** stays a wait, not a nudge. The advisory read shows the page untouched since January.
- Round-two scale beyond a laptop would need a decision from David about paying for it. Not needed yet, and not asked.

## State Appendix

- **G-1** (the goal of an externally-acknowledged correction): open. North star 0. Green streak day 15 of 30.
- **G-2** (the goal of contributing a verified improvement): open. Round one complete, logged at `note3`. Zero certificates, eleven candidates eliminated, round-two direction recorded.
- **A-13** (the work to make this repository publishable): open, on hold on David's 5 August word. Four of eight blockers cleared, plus the current-files halves of two more; the rest are his.
- **W-3** (the watch for a maintainer reaction to what we sent): open, no movement. Both advisory legs read the page unchanged.
- **C-7** and **C-9** (the two pins on the page that blocks data-centre fetches): unverified by design, as always. Both read HTTP 200 locally with the expected text present.
- Repo: private, tree clean at time of writing, CI green. Self-tests now 8, up from 7.
- Open continuity items: 11.
