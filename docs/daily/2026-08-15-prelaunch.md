---
product: bounds-ledger
date: 2026-08-15
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: 8b1c018
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "Nothing needs you today. Yesterday's find about the mathematician's self-contradicting page went through an independent review by a different AI model, which was told to tear it apart and could not - it re-did every calculation from scratch and got the same answers, then went further than we had and tested 275 near-miss variations of the number to be sure none of them explains it. The claim survives, so it is now genuinely reportable - but reporting it is still yours to approve, and nobody is asking today. Separately, reading our own weekly indicator's output caught a bug in it: the counter that is supposed to notice when the thing we watch goes quiet could not count past one, so the rule it carries could never have fired. Fixed, and held back from the main branch pending a review."
---

# bounds-ledger — daily — 2026-08-15 (MT) — the counter that could not count to four

Paced rail, day 14. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — merge the held branch once the cross-family review verdict lands. See what is
waiting:

```bash
git -C C:/dev/skylark/bounds-ledger log --oneline main..origin/catch-rate-dry-weeks
```

**THE NUMBER THAT WILL LIE TO YOU** — the A-16 review reads **SURVIVES, unrefuted on every angle
it was given** (enumerated under Inputs below, and tabled in
`docs/decisions/2026-08-15-A16-adversarial-review.md`), and a cold reader will take that as cleared
to send. It is not. It clears **gate 1 of two**. Gate 2 is
David's explicit approval and it has not been asked for, deliberately. The verdict makes the claim
*reportable*; it does not make it *reported*, and nothing about the review shortens the outward
gate.

**DON'T-TOUCH** — `movedPins()` in `scripts/catch-rate.mjs`. Today's fix rebuilt the week
scaffolding around it and changed nothing about what counts as a catch, which is why every
historical figure in the table is identical before and after. What makes it work is that it
compares only *generated* pins present on both sides of a commit, so it cannot be moved by our own
editing — and leaving it alone is what made today's change auditable in one glance.

Steward cadence green, twice. `npm run check` at 14:59Z: no drift, 113 files matching upstream
`e70b4a4` (an upstream sha; it does not exist in this repo — **positive control:**
`git cat-file -t 8b1c018` returns `commit` here, so the lookup works and the upstream object
genuinely is not local), 233 claims — 231 hold, 0 broken, 2 UNVERIFIED by design. The overnight
scheduled run was read as a **log, not a badge**, and read against the **final** pushed commit
`4a96984`: run 31876943028 at 09:25 MT prints the same figures. Both manual claims re-read
unchanged from this machine.

One correction to today's dispatch, since the lane's rule is to verify state claims against the
item: the dispatch named `60b1820` as the final pushed commit. It was not — `4a96984` was, and is
what the CI log was read against. The difference did not change any conclusion.

## What changed

- **A-16 — the watch on C_87's self-contradicting record row — cleared gate 1** (`8b1c018`).
  Independent cross-model refute-it review; verdict SURVIVES.
  `docs/decisions/2026-08-15-A16-adversarial-review.md`.
- **A-15 — the watch on the parked Mathstodon send — is now dormant by instruction** (`66f3dd4`).
- **A defect found in our own Tier-1 indicator and fixed** (`c64fcd9`, on branch
  `catch-rate-dry-weeks`, **pushed but deliberately not merged** — see below).
  `docs/findings/2026-08-15-the-dry-week-counter-could-not-count-a-drought.md`.
- **W-6 — the watch on arrivals — sampled** (`66f3dd4`), which yesterday's report said was owed.

## Inputs (controllable)

**The day's real output came from reading our own instrument's output rather than the record.**
`npm run catches` printed three week rows for a four-week repo. The week of 2026-08-03 was simply
absent, and `git log -- ledger/claims.json` says why: nothing touched that file between 2 and 11
August, and the week buckets were built only from commits that did. **Positive control:** that same
command returns 17 commits in total, `da17be3` (2 Aug) and `7018cce` (11 Aug) among them — so the
query works and the gap between them is real rather than an empty result.

The missing row is cosmetic. The counter behind it was not. The trailing dry-week count walked the
same buckets, so it could only count weeks that were present — and **in a real drought nothing
commits `claims.json` at all**, because that file is rewritten only by `extract-pins.mjs` after a
snapshot and a snapshot happens only on drift. The quiet weeks never entered the map, the walk hit
the last active week immediately, and the count stopped at 1. The rule this indicator carries is
*a month of zeros is the signal to adopt a second surface*. A month is four. The counter could not
reach two.

**Both answers demonstrated, per W-4 — the standing watch on proving a detector can fail.**
Pre-fix, executed against one active week followed by four calendar weeks of silence:
`weeks printed: 2026-07-06 2026-08-03` / `dryWeeks reported: 1   actual quiet weeks: 4`. Post-fix
the same input is asserted in the self-test as five week keys with a trailing count of 4, and the
negative control is asserted beside it — an unbroken run of weeks gains no rows, and a newest week
with a movement in it counts 0 dry rather than 1. **Positive control:** the same filler on the
drought input adds four rows, so it is capable of inserting and its silence on the full run means
something. A gap-filler that always inserts would satisfy the first assertion while proving
nothing.

**This is the lane's founding defect for the third time.** An alarm that could not fire (7/24), a
checker that read a login page as a stale brief (8/02), and now a counter whose maximum sat below
its own threshold. All three read as informative. Suspect the instrument before the record.

**The A-16 review was dispatched to a different model on purpose.** The angles it was given, in
order: (1) the product is a 24-digit integer so the typeset inequality is false; (2) its eighth
root is 913.4926943720…; (3) that is character-for-character the row above; (4) no other reading
rescues the row; (5) the finding's method sentence claims no more than it verified; (6) the
conclusion is no stronger than the arithmetic. Five survive outright and the sixth survives with
the amendment below.

The claim is exact integer
arithmetic, which is the rare case where an independent reviewer reaches the same answer by a
genuinely different route rather than by agreeing with a paragraph. It recomputed the product, the
eighth root, the required degree and both neighbouring integer roots — all matching to the digit —
and then beat our own work on one angle: we hand-checked a handful of transcription slips, and it
swept 275 one-edit candidates against integer degrees 1 through 64, excluding everything above 64
by bound rather than by sampling.

**One amendment came out of it, and it landed on the headline rather than the arithmetic.** Nothing
inside the finding overclaims, but a reader quoting only its title inherits *proves the previous
record*, which is a statement about Martin's construction that we have not checked and do not need.
The finding now writes out the sentence we would actually send, so the reportable claim is fixed in
advance instead of composed at send time — the same instinct as the self-describing header on the
catches indicator.

**One thing the reviewer offered was deliberately not adopted.** It states the arXiv full text
attributes this factorization to Martin's construction, which would resolve the two readings the
finding leaves open. We have not read that paper body from this pane, and on 12 August this lane
came one step from publishing a false claim about a mathematician's paper on the strength of a
fetch that had silently fallen back to an abstract page. Held until a positive control names the
token proving the document is the right one. The finding stands without it.

**The catch-rate fix is held, not shipped.** Today's dispatch armed a cross-family review gate for
diffs touching a trusted-print instrument — a script whose printed line a later reader believes —
and that is exactly what `catch-rate.mjs` is. The branch is pushed with 13/13 self-tests green, the
review-lane request is posted, and the merge waits for the verdict. Holding it costs nothing: the
indicator renders a figure and no verdict, so nothing is blocked by the old version staying on
`main` one more day.

## Outputs (lagging)

- **G-1 — the goal tracking externally-acknowledged corrections: 1, unchanged.** PR #141 remains
  the only one. Green-streak day 23 of 30 (day 1 = 2026-07-24); today's scheduled run was green.
- **W-3 — the watch on the erdosproblems.com email: still unanswered.** Both manual claims re-read
  green locally — the page still shows `0.380876` and still says last edited 23 January 2026. Both
  stay UNVERIFIED by design; CI cannot see either, and a local 200 is evidence about this machine
  only.
- **`npm run catches`: 4 distinct pins in the current week, partial** — and the same 4 as
  yesterday. Nothing upstream moved today. The window is now correctly 4 weeks rather than 3.
- **W-6 — the watch on arrivals: 3 unique viewer-days since the repo went public on 8 August**, an
  upper bound, 7 days into a 90-day read. It answers nothing yet and is sampled only because the
  API forgets days older than fourteen.

## Recommendation

**Merge `catch-rate-dry-weeks` when the review verdict arrives, and do nothing else with it.** The
change is small and self-tested; the only reason it is not on `main` is the gate.

**Leave A-16 alone until David raises it.** Gate 1 is cleared, the artifact is written, and the
error is arithmetic rather than a wrong record — it is exactly as reportable next week. The one
thing that expires is the premise: re-run `npm run check` immediately before any send, because
reporting an error the maintainer has already fixed is worse than not reporting.

**Do not ask about A-15.** Today's ruling parked it at David's discretion with no date. The item
stays open so the finished artifact is findable the day he asks, and no session raises it.

**The instrument-audit habit deserves a slot, not a resolution.** Two of the last four findings came
from reading our own scripts' output rather than the record, and both were defects that made a
figure look informative while it was structurally incapable of saying anything. That is a better
hit rate than anything else in the cadence. Proposed for the weekly forced-decision pass rather
than shipped today: read one instrument's own output against what it claims to measure, in the same
pass that reviews the items.

## On hold pending data

- **A-15 — the watch on the parked Mathstodon send.** Dormant by instruction. Not a no.
- **A-16 — the watch on C_87's self-contradicting record row.** Gate 1 cleared, gate 2 not asked.
- **The `catch-rate-dry-weeks` branch.** Pushed, green, waiting on the cross-family review verdict.

## State Appendix

`main` at `8b1c018`, tree clean, local and origin agree, PUBLIC. Two commits pushed to `main` today
(`66f3dd4` the A-15 park plus the traffic sample, `8b1c018` the A-16 review clearance), plus
`c64fcd9` on `catch-rate-dry-weeks`, pushed and unmerged.

`npm test` exit 0 (13 self-tests, run on the branch, which is `main` plus the held commit).
`npm run check` exit 0 with the pin set: no drift at 113 files against `e70b4a4`; 233 claims, 231
hold, 0 broken or unreachable, 2 unverified and manual; state block in sync; brief in sync, all 4
dated blocks present. Overnight scheduled run 31876943028 read from its log at 09:25 MT against the
final pushed commit `4a96984` — not `60b1820`, which the dispatch named and which is one commit
behind — same figures.

Open continuity items: **10**. **G-1 — the goal tracking externally-acknowledged corrections**
stands at 1 and stays open on the 30-day green streak alone, now day 23. **A-16 — the watch on
C_87's self-contradicting record row** has cleared its adversarial review and waits on David only.
**A-15 — the watch on the parked Mathstodon send** is dormant by instruction as of today and must
not be raised. **W-3 — the watch on the erdosproblems.com email** is unanswered and is a different
channel from G-1; do not close it on PR #141. **W-4 — the watch on proving a detector can fail**
was exercised today on the dry-week counter. **W-6 — the watch on arrivals** was sampled today.

Cards waiting on David: **0**. **Codex calls: 1** — the A-16 adversarial review, dispatched as an
independent cross-model refutation pass.
