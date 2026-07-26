# Adversarial review — lane-brief refresh, 26 July 2026

**Artifact reviewed:** `docs/lane-brief.md` (David-facing, hosted at `/t/lanes/bounds-ledger`) — the 26 July
refresh retiring one of the two standing asks. **Not an outward send**; this is David's own surface, but the
standing rule covers it because a false statement about our method is the one thing the reader cannot check.

**Result: 5 angles run · 1 held clean · 4 landed and changed the text.** Nothing blocks the refresh.

---

## Angle 1 — METHOD SENTENCE (the mandatory angle)

*The 2026-07-24 rule: audit the sentence that describes what we did, not just the value it reports. A five-angle
review passed a false method claim that day because every angle attacked the number.*

The refresh claims: **both page-side triggers are pinned and read mechanically.**

Executed, not remembered — `npm run check` run today with C-9 present: both advisory lines print
`HTTP 200, expected "…" still present`. Negative control run with the pinned date deliberately mutated to
24 January: the advisory flips to `HTTP 200 but expected "…" NOT FOUND — hand-verify now and follow the
claim's watch runbook`. `git diff` confirmed the mutation actually landed before the result was believed
(the CRLF no-op trap). **The pin fires. Verdict: FIRES, not UNKNOWN.**

**LANDED — overclaim in the cadence.** The draft said the triggers are read *"automatically whenever an agent
works this lane."* False in a way that matters: they are read when a session runs `npm run check`, which is not
implied by working the lane. Corrected to *"whenever a session runs the lane's check,"* and the limit stated
outright — *"it runs when someone runs it, not continuously."*

## Angle 2 — Is the retired ask genuinely retired?

The whole refresh rests on: David no longer needs to eyeball the page. Verified by execution today — a plain
default-UA fetch from this residential connection returns HTTP 200 with both the bound and the last-edited
date readable. Confirmed 2026-07-25 by three independent agreeing reads (hand-check, Node fetch, Playwright).

**Holds.** The ask is genuinely retired. It is the one substantive improvement in the refresh.

## Angle 3 — Does "one thing" understate what David still owns?

**LANDED.** The draft's header read *"One thing only David can do — forward any reply."* Not true: authorising
a public comment on the problem page, should the email go unanswered, is also only his. That is a decision
rather than an errand, but a brief that says *only* one thing is his, while a gated decision sits in his
future, is the kind of quiet understatement that gets noticed later and costs trust. Reworded to *"One thing
to send my way"* with the pending decision named explicitly in the same block.

## Angle 4 — Is "strictly better than screenshots" true?

**LANDED.** It is better on cadence and removes the human step. It is not stronger *evidence*: a substring
match on fetched HTML is not superior to a human reading the rendered page, and the source finding itself
says "same evidentiary strength, no human in the loop." "Strictly better" quietly promoted a cadence win into
an evidence win. Rewritten to claim exactly the cadence win and disclaim the rest.

## Angle 5 — Inherited claims, re-verified rather than trusted

The refresh repeats the A-6 phase-0 finding that **bounds do not live in `teorth/erdosproblems`** — the
justification for telling David that a correction can never be a PR there. That claim was established 7/25.
Re-fetched today rather than inherited: all five relevant values (`0.380876`, `0.380868`, `0.379005`,
`0.380871`, `0.380927`) **absent**; entry 36 still `open` / `prize: no`. **Holds.**

**LANDED (minor) — "never will."** The draft said CI *"never will"* be able to see the page. That is a
prediction about a third party's server configuration, not a fact we own. Softened to "won't for as long as
the site refuses datacenter traffic."

---

## What did not change, deliberately

The historical account of the sent correction. The evidence behind the 24 July email was David's screenshot,
and it stays described that way — later corroboration did not retroactively improve what we knew when we sent
it. Rewriting history to look better-verified than it was is the failure this lane exists to catch.

## Standing

No outward contact is proposed or performed here. The public-comment fallback remains David-gated and
un-drafted.
