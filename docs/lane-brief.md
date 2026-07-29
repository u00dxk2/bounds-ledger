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
> **One thing to send my way** — forward any reply from the maintainer. Tracked as **W-3**. (Separately, one *decision* stays his: whether we ever comment publicly if the email goes unanswered. See the update below.)
>
> *(This said "two things" until 26 July: it also asked him to glance at the page by hand. That ask is retired — see the update below.)*

> ## Update — 26 July 2026: one of the two asks is retired
>
> **The hand-glance at the page is no longer needed.** When this brief was written we believed the site blocked us outright, so watching it had to be David's eyes. That was half wrong, and the half matters: the block is **IP-dependent** — it refuses our CI servers but serves an ordinary home connection normally. So the page *can* be checked mechanically; it just can't be checked by the always-on CI.
>
> As of today both page-side triggers are pinned and read whenever a session runs the lane's check: the **bound** (does it still say 0.380876?) and the **last-edited date** (has the page been touched since 23 January?). Both checked today — page unchanged on both.
>
> **The honest limit:** it runs when someone runs it, not continuously. If nobody works the lane for a week, nobody checks for a week. Against the screenshot round-trip it buys cadence and removes the human step — it is not stronger evidence than David's own eyes on the page, and it is not a 24/7 monitor. The daily CI alarm still can't see this page, and won't for as long as the site refuses datacenter traffic.
>
> **What's left for David is one thing: forward the maintainer's reply if it comes.** That's the acknowledgement, and no amount of engineering reaches his inbox.
>
> Also since he last read this: a **second surface** is now stewarded — the community metadata database behind erdosproblems.com. Worth knowing for one reason: we checked, and **the bounds are not in it**, so a correction like this one can never be submitted there as a code change. If the email goes unanswered, the remaining route is a **public comment on the problem page itself**. That is outward contact, so it would come to him for a decision first — not something to do on our own.

> ## Update — 28 July 2026: the alarm went off for real, twice
>
> Until this week the watcher had only ever been tested by us — it caught drift in a fake file we planted to
> prove it worked. On 28 July the real thing happened: the curated table we mirror was edited upstream, and
> the alarm caught it within the hour. Then it happened again twenty minutes later.
>
> **Neither was a record change, and that turns out to be the more useful result.** The first edit fixed a
> link that pointed at a page which doesn't exist, and restored a character missing from a formula. No number
> moved. The second added a brand-new constant to the table — the first time the thing we're watching has
> *grown* rather than shifted. Our copy went from 109 files to 110 and the number of individual values under
> watch went from 225 to 227, absorbed the same evening.
>
> **Why the boring version matters:** the temptation with a "nothing important changed" alarm is to wave it
> through. We didn't — each change was checked against the source before our copy was updated, which is the
> only discipline that keeps the alarm meaningful. An alarm you're allowed to silence isn't one.
>
> **What it does not change:** the erdosproblems.com page is still untouched — same bound, still last edited
> 23 January. This week's movement was the curated table correcting itself, not anyone acknowledging us. The
> lane's one real metric is still **0**.

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

- **What the page says.** From your own browser screenshot on 23 July: `0.379005 < c < 0.380876`, no sign of 0.380868, last edited 23 January. At the time we believed we could not check this ourselves, so it rested on your eyes. It has since been confirmed three independent ways that agree — your hand-check, a direct fetch from a home connection, and a real browser read — and re-confirmed on 26 July. The evidence behind the sent message was your screenshot; the corroboration came later and did not change it.
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

**One thing to send my way, and it's the only one I can't get myself:**

- **Any reply from the maintainer** — paste or forward it. That is the acknowledgement, and it's what moves the lane's metric off zero for the first time.

The other half of this ask used to be yours and no longer is. Both page-side signals — the bound changing to 0.380868, and the last-edited date moving off 23 January — are now pinned and read mechanically whenever a session works this lane (26 July; both checked today, page unchanged). If either moves, it surfaces here without you looking.

No reply is also an answer, just a slower one. Maintainers of personal projects have their own cadence, and a factual note that sits unanswered for weeks isn't a rejection.

Tracked as **W-3** until one of those arrives or we decide the watch has run its course.

---

*Full detail in-repo: `docs/decisions/2026-07-24-A3-adversarial-review.md` (the review), `docs/decisions/2026-07-23-A3-erdosproblems-report.md` (the original decision), `docs/reconciliations/2026-07-22-minimum-overlap.md` (how the record sequence was established).*
