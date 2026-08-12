# Findability menu — how a stranger could arrive

**Date:** 2026-08-12 (MT)
**Items:** G-1 (the north star), W-6 (arrival watch), A-2
**Status:** menu. Everything marked **David-send** is a proposal and has not been sent.
**Approved direction:** orchestrator bus `393e9ac0`, 2026-08-11.

## Why this exists

The instrument works. Six drift cycles caught and resolved, the alarm has been proven able
to fail, 231 claims re-verified on every push. The north star — one externally-acknowledged
correction — is still **0**, and it is not blocked on detection any more. It is blocked on the
fact that **nobody knows the repo exists.** Two unique viewers in five days public, and
**zero referrers recorded**: nothing on the internet links here.

Nobody can acknowledge a correction from a repo they have never heard of.

## What a stranger actually sees today — measured, not assumed

Read from the GitHub API this morning, not from memory:

| Surface | State |
|---|---|
| Repo **description** | **empty string** |
| Repo **topics** | **null** |
| Stars / watchers | 0 / 0 |
| Referrers (14-day window) | **none** |
| Most-viewed file | `scripts/history-sweep.mjs` (2 views, at two different commit shas) |

The first two lines are the finding. We have spent four sessions hardening detection while our
own front door carried a blank nameplate: a repo with no description shows an empty line in
every GitHub search result and appears on no topic page. This is the cheapest possible
arrival defect and it has been live since the flip on 8 August.

The most-viewed *file* being `history-sweep.mjs` is unattributed and probably us or a crawler.
Do not read it as interest.

---

## Tier 1 — our own surfaces. Agent-doable, no stranger is contacted.

**1a. Repo description and topics.** *(DONE this session — see below.)*
GitHub search ranks on description; topic pages are a browsable surface we appear on for free.
Cost: minutes. How we would know it worked: referrers in `continuity/traffic.json` start
showing `github.com` search traffic, where today there are none.

**1b. Keep the README's evidence table current.** *(DONE this session.)*
It claimed "four upstream drifts" and was two behind, missing the two best catches this repo
has ever made — the Grothendieck constant and a claimed proof of Crouzeix's conjecture, both
caught the morning upstream recorded them. A page whose pitch is that it notices stale numbers
must not be stale about itself. **This block has now gone stale twice in two days**, which is
the argument for generating it rather than hand-editing it (top line of
`docs/housekeeping-ledger.md`).

**1c. A root-level catch log.** *Not done — proposed, agent-doable.*
The drift evidence lives in `docs/findings/`, which a stranger will not open. One `DRIFTS.md`
at the root, one row per cycle with the date, what moved, and the primary source we checked it
against, is the product demo. Cost: about an hour. Weak point: it duplicates the README table,
so it is only worth building if it goes deeper than the table does.

## Tier 2 — outward. David-send. Nothing here happens without his word.

**2a. The upstream pull requests.** PR #141 is open and untouched since 5 August. A-14 was
re-verified this morning and is on his board.
This is the strongest channel we have, because it is the only one where we already have
standing: a merged PR is *both* halves at once — a public dated acknowledgement (the north
star itself) **and** a permanent backlink from a repo far busier than ours. Nothing else on
this menu does both.
Honest risk: two small corrections to one maintainer while the first sits unanswered can read
as noise. That is the substance of the decision now on his board.

**2b. Post where these people already are.** Mathstodon is small and exactly on target — the
maintainers of both surfaces we watch are active there. r/math is larger and colder. Hacker
News is a lottery with a real downside: a front-page arrival brings an audience that will
judge the repo in ten seconds, and we should want that only when the catch log is strong.
Recommend Mathstodon first, once there is a merged PR to point at. All three are David-send.

**2c. Ask upstream to link back.** The constants repo has no "who watches this" surface, so
this would be a request, not a contribution. Weaker than 2a and to be considered only after
a PR lands.

## Off the table — recorded so it is not rediscovered as a new idea

- **A public comment on erdosproblems.com/36 — DECIDED NO, 2026-08-02.** David's words: "I
  sent the email. I don't want to add a comment as well." This is a decision, not a deferral.
  Do not re-propose it.
- **Anything that contacts the erdosproblems.com maintainer again.** The July email is
  unanswered; W-3 holds, and the standing instruction is check, do not poll, do not nudge.

## The caveat that keeps this honest

**None of these produce an acknowledged correction.** Arrival is upstream of the north star,
not the north star. The only item on this menu that can move G-1 by itself is 2a, and it moves
it only if someone merges. Everything in Tier 1 improves the odds that a stranger who is
already looking finds us; none of it makes anyone look. A menu that implied otherwise would be
the same error this lane keeps catching in other people's numbers.

## Done this session

1a and 1b, both Tier 1, both on our own surfaces, neither contacting anyone:

- Repo description set (was empty) and eight topics added (was null).
- README catch table corrected from four cycles to six, and the "Current state" block
  re-derived from live output.

Adversarial pass on the description text before it went live: it reuses the README's existing
wording rather than inventing a new claim, every clause is demonstrated (six cycles for "goes
red when a record moves"; daily cron plus push for "re-checks"), and it claims one stewarded
surface rather than implying coverage of mathematics generally. It is reversible with one
command.
