---
product: bounds-ledger
date: 2026-08-12
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 4d06395
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "The page we watch changed four times in one day, and our alarm caught every change. Two famous numbers moved: one where a new paper pinned down a digit nobody had pinned down before, and one where a problem open since 2004 was claimed solved. Then it changed again to credit a second person who had claimed the same solution eight days earlier. We checked each one against the actual papers before we recorded anything. We also found that our own repository had no description and no tags at all, so nobody searching could find it. That is now fixed. The count of corrections anyone outside has acknowledged is still zero."
---

# bounds-ledger — daily — 2026-08-12 (MT) — the busiest day the mirror has had, and our own front door was blank

Paced rail, day 11. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — steward cadence, and read the log rather than the badge:

```powershell
gh run view (gh run list --limit 1 --json databaseId --jq '.[0].databaseId') --log
```

**THE NUMBER THAT WILL LIE TO YOU** — `231 claims: 229 hold, 0 broken, 2 unverified`. That
figure is **identical** to yesterday's, and a cold reader will take it as a quiet day. It was
the busiest day this mirror has had: upstream pushed four times, two named constants moved, and
two resolution cycles shipped. The count did not move because upstream changed *values inside
rows we already pin*, not the number of rows. Read the drift cycles, never the claim count, to
learn whether anything happened.

**DON'T-TOUCH** — the rule that a generated pin asserts **listing position, never "the
record"**. Today it carried a claimed proof of a conjecture open since 2004, and then a dispute
over who proved it first, and our ledger asserted neither. That is only true because the pins
make a mechanical claim about what upstream lists rather than a mathematical claim about what is
true.

**Upstream pushed five times today; we resolved three cycles (six, seven, eight)**, each verified
against primary sources before the mirror moved. **G-1 — the goal of getting one correction
acknowledged by someone outside — is still at 0**, and nothing today moved it.

The finding worth carrying: **our repository had an empty description and no topics.** Four
sessions of hardening detection while the front door carried a blank nameplate.

## What changed

**Cycle six (`ec01082`) — two named constants in one morning.**

- **The real Grothendieck constant (10a).** Both ends improved by a single paper
  ([arXiv:2608.11158](https://arxiv.org/abs/2608.11158), 11 Aug): lower bound to
  $6\pi/11 \approx 1.71360$, upper to $\pi/(2\ln(1+\sqrt2)) - 10^{-4} \approx 1.78211$,
  settling the tenths digit as 7. Its abstract states the bracket verbatim, which is rare and is
  the opposite of the 2026-07-24 case where no cited abstract stated its own bound. Both decimals
  recomputed; the *old* formula reproduces the previous README figure to fifteen significant
  figures, so our prior mirror state and upstream's closed form agree independently.
- **Crouzeix's conjecture (2a), claimed proved.** Upper bound $1+\sqrt2 \to 2$, matching the
  trivial lower bound ([arXiv:2608.03841](https://arxiv.org/abs/2608.03841)).

**Cycle seven (`4d06395`) — a priority correction, a class we had not seen.** No bound moved
and 2a was already recorded as settled. What changed is *who is credited*: upstream added a
second, independent claimed proof (Jin, preprints.org `202607.1919`) posted eight days earlier.
Caught by CI going red on the very next push after cycle six resolved.

**The verification trap in cycle seven is the reusable part.** preprints.org returns **HTTP
200** for a 2,673-byte bot-protection page whose title is a non-breaking space and which never
says "Crouzeix". A status-code check would have recorded that as verified — the same shape as
the sign-in wall that made the brief checker blame the orchestrator. Confirmed instead through
**Crossref content negotiation**, which never touches the walled server: title *The Numerical
Range Is a 2-Spectral Set* (the conjecture stated as a theorem), author Shanmu Jin, posted
2026-07-27, MDPI AG. That confirms author, venue, date **and** the priority claim.

**Cycle eight — and the near-miss that is the most valuable thing recorded today.** Upstream
reworked the attribution a third time, now describing Lorist–Schwenninger's paper as one "which
acknowledges Jin". That is a checkable claim about a third party's paper, so it was checked. The
arXiv page shows only v1 and never says "Jin"; ar5iv then returned HTTP 200, 38,662 bytes, zero
occurrences of "Jin" — **and I was one step from writing that upstream's claim is unsupported.**
That would have been a public accusation about a real mathematician's paper, from a repo whose
entire pitch is care.

Checking that the response *was* the artifact caught it: ar5iv had fallen back to the arXiv
abstract page. I had read the abstract page twice and drawn a conclusion from its silence. The
correct state is that upstream's claim is **unverified by us, not contradicted**. The rule worth
more than the incident: **a positive match is self-validating; a negative match proves nothing
until you have separately proven you were looking at the right document.** "numerical range" and
"spectral set" were also absent from that page, which for a paper about the numerical range being
a spectral set should have been the tell.

positive control: the same fetch returned non-empty for "Crouzeix", "Lorist", "Schwenninger" and
"dilation", which is exactly why the fallback page looked like the paper; and the Crossref query
that *did* work returned a non-empty title and author (Shanmu Jin) for the Jin preprint. The
probe was live in both cases — what failed was assuming a live probe licensed a conclusion drawn
from what it did **not** return.

**The increment — the findability menu** (`369cedc`, `docs/decisions/2026-08-12-findability-menu.md`),
the direction the orchestrator approved on 8/11. Measured what a stranger actually sees, from the
API rather than from memory: **description empty, topics null, zero referrers.** Tier 1 items
(our own surfaces, nobody contacted) executed: description set, eight topics added, both verified
back from the API; README catch table corrected. Tier 2 (outward) stays a proposal and
David-gated.

**A-14 — the proposed one-character upstream correction — re-verified and surfaced.** Its own
`verifyBy` required re-running the enumeration at send time, and upstream's README changed twice
today, so this was not optional. Live re-run over 19 improvement lines against 111 table rows:
3b is still the sole exception and upstream has not fixed it. The comparison sharpened — 3a, the
adjacent constant, carries the asterisk on its improvement line; 3b does not. Posted as a
decision with a board card. **I did not send it**: the outward gate is David's.

**A numbering collision I introduced and then fixed.** My first write-up called today's drifts
"the fifth and sixth", which collided with yesterday's already being the fifth. Drifts are now
counted by *resolution cycle*, stated in `continuity/items.json`. A lane whose product is
noticing when numbers drift must not run two counters for its own headline figure.

## Inputs (controllable)

- 4 commits pushed: `ec01082`, `369cedc`, `4d06395`, and this report's
- `npm test` exit 0 and `npm run check` exit 0 after every snapshot, read as exit codes and never through a pipe
- 3 drift resolution cycles over 5 upstream pushes, each verified against primary sources before `--snapshot`
- Repo description + 8 topics set, verified back from the GitHub API rather than from the command's success
- W-3 — the watch on whether anyone outside acknowledges our July correction — both advisory legs read from this machine: erdosproblems.com/36 still shows `0.380876`, still dated 23 January 2026. Unchanged.
- `npm run traffic` sampled (W-6 — the arrival watch; GitHub forgets days older than 14)
- Codex calls: 0 (probe reported RED in the orchestrator session; scoped to this model, no delegation manufactured)

## Outputs (lagging)

- **G-1 — externally-acknowledged corrections: 0.** Unchanged. PR #141 open and untouched since 5 August; checked, not nudged.
- **W-6 — arrival: 2 unique viewers, day 5 of 90. Zero referrers recorded** — nothing on the internet links here. Viewer-days overcount distinct people, so treat 2 as an upper bound.
- Green-streak: day 20 of 30 (day 1 = 2026-07-24). Yesterday's evening primer said this would be day 21; it is 20, counted from that start date.
- 7 drift cycles caught and resolved since the alarm was armed.

## Recommendation

**Tomorrow's increment: generate the README's state block instead of hand-editing it.** It went
stale twice in two days, and I hand-corrected it **three times today alone**. It is the top line
of `docs/housekeeping-ledger.md` and it was deliberately deferred because a detector needs its
both-answers demonstration before it ships. Today is the evidence that deferring it costs more
than building it: the block is public, it invites the reader to re-derive it, and it was wrong
in front of anyone who looked.

Second: leave PR #141 alone and let A-14 sit on David's board. Both are his call and neither
benefits from a nudge.

## On hold pending data

- **W-3** — whether the erdosproblems.com maintainer responds to the July email. David's WAIT stands; check, do not poll, do not nudge. Both advisory legs unchanged today.
- **A-14** — the proposed upstream correction. On David's board with a draft reply; re-verified against live upstream this morning.
- **A-7** — the remaining leg is the scheduled verified history sweep, fleet-owned and not ours to move.

## State Appendix

- `main` at `4d06395`, pushed, tree clean, public.
- Mirror: 112 files at upstream `603052d` (an upstream sha — do not `git show` it locally). Upstream is in an active editing burst; a red run during one is the alarm working, not a defect.
- Ledger: 231 claims, 229 hold, 0 broken, 2 unverified by design (C-7 and C-9 — the two `manual: true` claims on the site that blocks datacenter fetches).
- `npm test` 11/11 self-tests. `npm run check` green with the pin set; the hosted brief reads in sync, 4 of 4 dated blocks.
- Open continuity items: 9. Cards waiting on David: 1 (A-14 — the proposed upstream correction, filed this session).
- New this session: `docs/findings/2026-08-12-two-record-movements-in-one-cycle.md`, `docs/decisions/2026-08-12-findability-menu.md`.
