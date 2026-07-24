# A record that moved, and a page that didn't

**David-facing brief · bounds-ledger · 2026-07-24**

> **Source of truth for the hosted brief.** This file is the source; the orchestrator ports it to
> <https://skylarkcreations.com/t/lanes/bounds-ledger> (noindexed). Edit here, then post a bus note
> so it gets re-ported. Never hand David an artifact link — those are session-scoped and don't
> resolve in his browser (learned 2026-07-24, the hard way).

The most-used index of Erdős problems still lists a number that two later results have beaten. Telling them is your call — here is everything behind it, including what we did *not* check.

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

Right now that catch has an audience of one: us. The lane has produced **zero external acknowledgements**, and that number is the whole point — a steward nobody has ever confirmed is right is just a script. Sending this is the shortest path from "we think this works" to someone outside saying so.

The counterweight: it attaches our name to an unsolicited correction while we're still pre-launch and private. That's the part I can't decide for you.

## Who I'd send it to

erdosproblems.com is maintained by **Thomas Bloom**, a mathematician who built and curates the site personally. One person, own cadence, no team.

That shapes the tone: they are not a support desk with an SLA, and the page isn't neglected — it's a personal project that a fast-moving result outran. The message should read as a heads-up from someone who found it useful, not a bug report.

**I don't know the contact channel yet, and I can't look.** The site blocks automated visits, so I can't read its contact page. You'll be able to see in two seconds what's on offer — the site has historically taken corrections by email and via its GitHub repository. If you greenlight this, tell me which route you prefer, or just paste the address.

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

One expiry condition: your screenshot is from 23 July. Because the site blocks us, we cannot re-check it on our own, so it doesn't age gracefully. **If you greenlight this after 30 July, I'll ask you to glance at the page once more first.**

## What we'd say

> **Subject: Problem 36 (minimum overlap) — a later curated upper bound you may want**
>
> The page currently lists the upper bound as 0.380876 (TTT-Discover, Jan 2026). A later improvement has since been curated in the Tao/Davis/Ivanisvili optimization-constants repository (`constants/1b.md`):
>
> - **0.380868** — SimpleTES, "Evaluation-driven Scaling for Scientific Discovery," [arXiv:2604.19341](https://arxiv.org/abs/2604.19341) (Apr 2026)
>
> That would make the current bracket 0.379005 < c < 0.380868 (lower bound White 2022, [arXiv:2201.05704](https://arxiv.org/abs/2201.05704)). Cross-checked against the curated table; happy to be corrected if you're tracking it deliberately.

Short on purpose. It gives the value, the source, and a way to disagree — and it doesn't tell a mathematician what their own page should say.

## What the adversarial review changed

Standing rule: nothing goes outward until someone has genuinely tried to break it. Five angles of attack. Three bounced off, **two landed and changed the message** — which is the point of running it.

**Held up.** Two different problems? No — the equivalence is stated in the table, and both of the page's numbers match its rows.

**Held up.** Is the page lagging *deliberately*, on a stricter standard? No — it already cites AI-discovered bounds, so a later result of the same kind is in scope.

**Held up.** Has 0.380868 itself been superseded since? No — re-verified clean on 24 July.

**Landed — cut the 0.380871 line.** The earlier draft cited it too. Its source turns out to be a GitHub README rather than a paper — and naming the project attached to it would point Bloom at a public leaderboard showing an even lower, *unvetted* number we don't stand behind. We'd have broken our own rule about never mixing verified records with unverified claims, in our first outward message. It's also redundant: 0.380868 supersedes it anyway.

**Landed — rewrote the subject line.** It read "upper bound is two curated improvements out of date" — asserting error at someone about their own field. Now it offers information and lets them judge.

## What I need from you

Reply on board card `7b5c90a9` with one word:

- **SEND** — I send the message above and the item closes on send.
- **HOLD** — stays parked, no contact, ask again later.
- **NO-REPORT** — we deliberately don't report it, and I record that as the decision.

No contact has been made, and none will be without your word.

---

*Full detail in-repo: `docs/decisions/2026-07-24-A3-adversarial-review.md` (the review), `docs/decisions/2026-07-23-A3-erdosproblems-report.md` (the original decision), `docs/reconciliations/2026-07-22-minimum-overlap.md` (how the record sequence was established).*
