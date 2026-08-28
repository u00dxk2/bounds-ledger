# Mathstodon announcement v2 — rewritten around the 27 August retraction

**Date:** 2026-08-28 (MT)
**Items:** A-15 (reopened by David), G-4, W-6
**Status:** **DRAFT, GATE 1 CLEARED, NOT SENT.** Nothing has been posted and no account contacted.
**Supersedes:** `docs/decisions/2026-08-13-mathstodon-announcement.md` (v1, never sent).
**Review:** `docs/findings/2026-08-28-mathstodon-v2-adversarial-review.md`.

## Why this exists — the ruling, and the one it reverses

David, via the Command Center board, 2026-08-28T02:27:04Z (2026-08-27 20:27 MT), answering
*"The announcement post has sat unsent for 14 days. Rewrite it around today's story, or drop it?"*:

> Yes — rewrite it around today's correction and show me the new version tomorrow before anything goes out.

**This reverses a prior drop, and that is recorded here so nobody re-applies the old ruling.** A-15
was CLOSED on 2026-08-20 with the resolution *"DROPPED BY DAVID... he answered 'drop it'... no
future session should re-propose it."* David raised it himself and changed his mind, which A-15's
own `closeWhen` explicitly provided for. The 8/20 resolution is now history.

**One concern, stated once and not re-litigated.** The 8/20 drop carried a second reason beyond
David's word: sending this makes David the distribution channel, which the portfolio operating
principles rule out as a hard line. That objection is untouched by the rewrite — it is about the
channel, not the wording. David has asked for the artifact anyway, so here it is; the send is his.

## What changed from v1, and why

v1 led on a merged citation-key PR. This leads on the twelfth drift cycle (2026-08-27), because it
demonstrates the thesis far better: **a cited claim reversed with no number moving at all.**

| v1 | v2 |
|---|---|
| Lead: we filed a PR upstream and it merged | Lead: upstream withdrew a 15-day-old attribution; no number moved |
| "231 claims" / "~230 pinned" / "eight upstream changes" — all stale by 24 Aug (A-28) | `~230` (approximate, cannot decay), "twelve upstream changes" inside a **closed** window |
| Limits paragraph listed three caveats | Limits are now the argument, not a disclaimer |
| No statement of what the ledger did *not* do | Says plainly: it did not catch the error; upstream corrected itself |

The sharpest sentence is the new one: *for those fifteen days a reader of the source would have
believed it; a reader of the ledger saw "unverified".* That is the product, stated without
overclaiming.

**Amended the same day, after the orchestrator's kickoff pointed at a story the first draft had
left out.** The first cut of v2 told only the retraction — an episode in which the ledger did not
act — and that is a weak note to close an invitation on. The lane's strongest evidence is four days
older and was sitting in `A-33`: on 2026-08-20 we filed issue #150 upstream, on 2026-08-23 an
outside contributor fixed the record citing that report (`7848802`, *"Reported in issue 150."*), and
the maintainer closed it completed the same afternoon. That is `G-3`'s closing evidence, and
`A-33`'s own note calls it *"the most interesting thing this lane has ever had to tell David"*.

It now appears as one line before the invitation, and it is the line that makes the invitation
credible: *"tell me it's wrong"* is a request, but *"a stranger did exactly that and the maintainer
merged it"* is proof the request goes somewhere. **The two stories are not alternatives** — the
retraction carries the thesis, the report carries the evidence that acting on it works.

## The post, verbatim

Send this text exactly, or don't send it. **1697 characters** as Mastodon counts them, against
Mathstodon's limit of **1729** — both read live from `mathstodon.xyz/api/v2/instance` on 2026-08-28,
not assumed (`max_characters: 1729`, `characters_reserved_per_url: 23`). Margin is 32 characters, so
an edit at send time will not fit and has not been reviewed.

```
Best-known bounds and constants move, and so do the claims attached to them. A number you looked up last month can be stale, and nothing tells you.

bounds-ledger is the boring half of that: a byte-level mirror of one curated source (teorth/optimizationproblems) plus ~230 pinned claims, all but two re-checked daily and on every push. When a pinned row changes the build goes red and files what moved. It doesn't look for better bounds; it watches records that exist.

Between 24 July and 27 August 2026 the alarm fired on twelve upstream changes; the last is worth showing.

Upstream withdrew an attribution it had carried for fifteen days, writing that the old text "read a citation of prior public posting as a statement of dependence, and was incorrect". No number moved — the constant is byte-identical either side.

The ledger did less than that sounds. It did not catch the error: upstream corrected itself, and nobody told them. What it did was decline to repeat the claim. The fetch available returned an abstract page, not the paper, so it went in as "unverified". For those fifteen days a reader of the source would have believed it; a reader of the ledger saw "unverified".

A change with no number in it is invisible to every numeric check; this surfaced as a byte diff. Two claims can't be checked from CI at all; they report UNVERIFIED forever, never green.

It runs the other way too: I reported that a record cited the wrong witness, a stranger fixed it upstream citing that report, and the maintainer closed it.

Built with AI agents, human-gated before anything goes out.

The most useful thing you can do is tell me it's wrong — issues welcome.

https://github.com/u00dxk2/bounds-ledger

#math
```

## What is deliberately not in it

Carried forward from v1's review plus the new ones. Listed so a later session does not "improve"
the post by putting one back.

- **Any name.** Not the two author groups whose priority the retraction concerns, not the
  maintainer, not the repo owner. v1 cut Terence Tao's name on the reasoning that the repository
  can be named and the person need not be; **v2 extends that to third parties with far more
  force.** The retraction is about an attribution that was wrong about real people who did not ask
  to be discussed on a mathematics instance. Upstream has already corrected it on its own page. The
  structural story needs no names and is stronger without them; anyone who wants the specifics is
  one click away, reading upstream's own words rather than ours.
- **The word "Crouzeix", and the dispute itself.** v1 cut this as *"a five-week-old claimed proof
  with an unresolved priority question between two sets of real authors"*. What changed is that
  upstream has now resolved it publicly, in its own words — so v2 may tell the *shape* of the
  correction. What did **not** change is that amplifying the dispute is still not ours to do.
- **erdosproblems.com and its stale page.** Still our most arresting content, still the public
  comment David **decided NO on 2026-08-02**. Today's ruling reverses the *drop of the post*; it
  does not reverse the 8/02 content decision. A decision that forbids a channel forbids the
  content.
- **Exact live counts.** A Mastodon post is permanent and unedited. `~230` is approximate on
  purpose and the twelve-change figure sits in a closed date window, so neither can go stale. This
  is the A-28 defect designed out rather than patched: a ledger about staleness must not announce
  itself with a decaying number.
- **Any @-mention.** Outward contact, out of bounds regardless of the gate.
- **The merged PR #141.** Dropped, not forgotten — it was v1's lead. It cost budget the retraction
  story uses better, and "we also got a small fix merged" reads as a weaker second brag. The
  outward-contribution slot is now held by **issue #150** instead, which is the stronger of the two:
  #141 was us fixing upstream's citation keys, while #150 is a stranger acting on our report. If
  David wants #141 back it is a real change and goes back through review.
- **The contributor's name, and the maintainer's.** The post says "a stranger" and "the maintainer".
  Same rule as everywhere else here: the repository can be named, the person need not be. Naming an
  outside volunteer in our own announcement borrows their standing for our pitch, and they
  contributed to a maths repo, not to our marketing.

## Conditions on the send — for David, not for us

1. **Which account posts, and does it have any reach?** Unchanged from v1 and still unverifiable
   from here. Mastodon has no global full-text search for ordinary posts, so discovery runs through
   followers, boosts and the `#math` timeline. From a new account the honest expected result is
   close to nothing. Not a reason not to post — the cost is minutes — but it is the difference
   between an arrival move and a message in a bottle, and it should be known before, not after.
2. **The `#math` hashtag is the discovery mechanism, not decoration.** Dropped, the post reaches
   followers only.
3. **Timing is not load-bearing.** Nothing expires: the only figures are approximate or inside a
   closed window.
4. **If any word changes at send time it has not been reviewed, and it will not fit.** 23 characters
   of margin. Send verbatim or send it back.

## How we would know it worked

`continuity/traffic.json` (W-6 — the arrival watch) shows a `mathstodon.xyz` referrer where today
there are none of any kind, and unique viewers move off 3. **A post that produces no referrer is a
real, recordable answer** about this channel and is worth more than not knowing.

Note the indicator that is *not* this: `npm run reports` (G-4's primary) counts issues arriving
through the page's per-row "looks wrong?" links. The post's closing line invites exactly that, so an
arrival here could register there — but G-4 requires a causal path containing no artifact we
authored and sent, and this post **is** such an artifact. **A report traceable to this post does not
satisfy G-4.** It would be W-6 evidence and nothing more.
