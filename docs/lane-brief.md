# A record that moved, and a page that didn't

**David-facing brief · bounds-ledger · 2026-07-24**

> **Source of truth for the hosted brief.** This file is the source; the orchestrator ports it to
> <https://skylarkcreations.com/t/lanes/bounds-ledger> (noindexed). Edit here, then post a bus note
> so it gets re-ported. Never hand David an artifact link — those are session-scoped and don't
> resolve in his browser (learned 2026-07-24, the hard way).

> ## ✅ Sent — 24 July 2026
>
> David opened the gate and emailed the correction to the erdosproblems.com maintainer. **Nothing further is needed from him right now.**
>
> The wording that went out is the corrected version below — with the false "and the source-paper abstracts" clause removed, which *he* caught at his pre-send read.
>
> **What we're waiting for, and it isn't the same thing as being done:** sending is not acknowledgement. The lane's one real metric — externally-acknowledged corrections — is **still 0**. It moves only when the maintainer replies, or the page's bound changes to 0.380868, or its last-edited date moves.
>
> **Two things only David can do**, because the site blocks our bots and the reply goes to his inbox: paste or forward any reply, and glance at the page by hand now and then. An automated check proves nothing here. Tracked as **W-3**.

The most-used index of Erdős problems lists a number that two later results have beaten. Below is everything behind the correction that was sent, including what we did *not* check.

---

## What we found

There's an old Erdős puzzle: split the numbers 1 to 2N into two equal halves. No matter how cleverly you split them, some amount of "overlap" between the halves is unavoidable. The constant that measures how little overlap you can possibly get away with is what people have been chasing since 1955.

Nobody knows the exact value. What exists is a bracket — a floor and a ceiling that it must sit between. Lowering the ceiling means someone found a cleverer split. That's a search problem, which is why AI systems have been hammering on it: the ceiling has dropped three times since January.

[erdosproblems.com/36](https://www.erdosproblems.com/36) — the reference page most people land on for this problem — still shows the January ceiling. It was last edited 23 January 2026.

**What the page shows:** `0.379005 < c < 0.380876`
**What the field's curated table shows:** `0.379005 < c < 0.380868`

The full sequence of ceilings, and where the page stopped:

| Ceiling | Found by | When | On the page? |
|---|---|---|---|
| 0.380927 | Haugland | 2016 | yes |
| 0.380924 | AlphaEvolve | 2025 | yes |
| **0.380876** | TTT-Discover | Jan 2026 | **shown as current** |
| 0.380871 | Together AI | 2026 | no |
| **0.380868** | SimpleTES | Apr 2026 | **no — current best** |

The correction is one line: the ceiling is 0.380868, not 0.380876.

## Why it matters

Honestly? The number itself barely matters. The difference is eight parts in a million, nobody's work breaks because of it, and a stale bound harms no one on a clock. If this were only about the number, I'd say drop it.

It matters because it is **the exact thing this lane was built to do, actually happening**. The premise was that published records drift faster than the pages citing them get updated, and that a machine watching continuously would catch it. That premise is now demonstrated rather than argued — on the field's most-used index, on the very first surface we watched.

Until now that catch had an audience of one: us. The lane has produced **zero external acknowledgements**, and that number is the whole point — a steward nobody has ever confirmed is right is just a script. Sending this was the shortest path from "we think this works" to someone outside saying so.

The counterweight, which David weighed and accepted: it attaches our name to an unsolicited correction while we're still pre-launch and private.

## Who it went to

erdosproblems.com is maintained by **Thomas Bloom**, a mathematician who built and curates the site personally. One person, own cadence, no team.

That shapes the tone: they are not a support desk with an SLA, and the page isn't neglected — it's a personal project that a fast-moving result outran. The message should read as a heads-up from someone who found it useful, not a bug report.

The site blocks automated visits, so I could never read its contact page myself. **David found the route and sent it by email on 24 July.**

## How sure we are

Sure about the disagreement. Not sure about the mathematics — and the difference matters, so let me be exact.

**What we verified ourselves:**

- **What the page says.** From your own browser screenshot on 23 July: `0.379005 < c < 0.380876`, no sign of 0.380868, last edited 23 January. We could not check this ourselves — the site blocks our bots — so it rests on your eyes, not a fetch we could have fooled ourselves with.
- **What the curated table says.** Terence Tao and two collaborators (Davis and Ivanisvili) maintain a reviewed table of these constants. It lists 0.380868 as current, citing a published paper. We keep a byte-for-byte mirror of that table and re-checked it against the live version on 24 July: **no drift**, all 109 files identical.
- **That the two pages are about the same quantity.** The obvious way to be wrong here is to compare two different problems. The curated table states the equivalence outright and links to that exact page — and independently, *both* of the page's numbers (the floor 0.379005 and the ceiling 0.380876) appear as rows in the table. Two coincidental matches isn't plausible.

> ### What we did *not* verify
>
> **We have not checked the mathematics behind 0.380868.** We did not reproduce the construction or read the proof. We are trusting the authors' paper and Tao's curation of it.
>
> So the claim we can actually stand behind is *"your page disagrees with the field's curated table, and the table is newer"* — not *"we proved this number."* The draft below is worded to claim only the first. If it ever drifted toward the second, it would be overclaiming and I'd pull it.
>
> **This nearly went wrong.** The draft said "cross-checked against the curated table *and the source-paper abstracts*" right up to the moment of sending. It isn't true: none of the three cited abstracts (SimpleTES 2604.19341, White 2201.05704, TTT-Discover 2601.16175) state their numeric bounds — verified 2026-07-24. The phrase was carried over from the Haugland work on 7/23, where the abstract *did* carry the value, and no one re-examined it. The adversarial review attacked the claim from five angles and never audited the evidence sentence. **Our verification of 0.380868 rests on Tao's curated table alone.** Caught at David's pre-send check; clause removed.

The evidence was one day old when it went out — David's screenshot on 23 July, sent 24 July — so the expiry condition we'd set (re-check by hand if the gate opened after 30 July) never came into play.

## What we said

> **Subject: Problem 36 (minimum overlap) — a later curated upper bound you may want**
>
> The page currently lists the upper bound as 0.380876 (TTT-Discover, Jan 2026). A later improvement has since been curated in the Tao/Davis/Ivanisvili optimization-constants repository (`constants/1b`):
>
> <https://teorth.github.io/optimizationproblems/constants/1b.html>
>
> - **0.380868** — SimpleTES, "Evaluation-driven Scaling for Scientific Discovery," [arXiv:2604.19341](https://arxiv.org/abs/2604.19341) (Apr 2026)
>
> That would make the current bracket 0.379005 < c < 0.380868 (lower bound White 2022, [arXiv:2201.05704](https://arxiv.org/abs/2201.05704)). Cross-checked against the curated table; happy to be corrected if you're tracking it deliberately.

Short on purpose. It gave the value, the source, and a way to disagree — and it doesn't tell a mathematician what their own page should say.

## What the adversarial review changed

Standing rule: nothing goes outward until someone has genuinely tried to break it. Five angles of attack. Three bounced off, **two landed and changed the message** — which is the point of running it.

**Held up.** Two different problems? No — the equivalence is stated in the table, and both of the page's numbers match its rows.

**Held up.** Is the page lagging *deliberately*, on a stricter standard? No — it already cites AI-discovered bounds, so a later result of the same kind is in scope.

**Held up.** Has 0.380868 itself been superseded since? No — re-verified clean on 24 July.

**Landed — cut the 0.380871 line.** The earlier draft cited it too. Its source turns out to be a GitHub README rather than a paper — and naming the project attached to it would point Bloom at a public leaderboard showing an even lower, *unvetted* number we don't stand behind. We'd have broken our own rule about never mixing verified records with unverified claims, in our first outward message. It's also redundant: 0.380868 supersedes it anyway.

**Landed — rewrote the subject line.** It read "upper bound is two curated improvements out of date" — asserting error at someone about their own field. Now it offers information and lets them judge.

## What happens next

**Sent 24 July 2026, by David, by email.** A-3 is closed.

Nothing is owed by anyone right now. The open question is whether it lands, and that's out of our hands — which is the honest shape of a first outward result.

Two things to send my way whenever they happen, neither of which I can get myself:

- **Any reply from the maintainer** — paste or forward it. That is the acknowledgement, and it's what moves the lane's metric off zero for the first time.
- **A hand-glance at [the page](https://www.erdosproblems.com/36) now and then** — if the upper bound becomes 0.380868, or the last-edited date moves, that's the correction landing. The site blocks our bots, so an automated check proves nothing; it has to be your eyes.

No reply is also an answer, just a slower one. Maintainers of personal projects have their own cadence, and a factual note that sits unanswered for weeks isn't a rejection.

Tracked as **W-3** until one of those arrives or we decide the watch has run its course.

---

*Full detail in-repo: `docs/decisions/2026-07-24-A3-adversarial-review.md` (the review), `docs/decisions/2026-07-23-A3-erdosproblems-report.md` (the original decision), `docs/reconciliations/2026-07-22-minimum-overlap.md` (how the record sequence was established).*
