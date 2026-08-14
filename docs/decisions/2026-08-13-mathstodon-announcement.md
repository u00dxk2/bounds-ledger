# Mathstodon announcement — the post, ready for David's send

**Date:** 2026-08-13 (MT)
**Items:** G-1 (the north star), W-6 (arrival watch)
**Status:** **DRAFT, GATE 1 CLEARED, NOT SENT.** Nothing has been posted anywhere and no account
has been contacted.
**Review:** `docs/findings/2026-08-13-mathstodon-adversarial-review.md` — nine angles, verdict
SURVIVES with six amendments applied.
**Approved direction:** the findability menu (`docs/decisions/2026-08-12-findability-menu.md`, item
2b) named Mathstodon first, **conditional on having a merged PR to point at**. That condition was
met on 2026-08-11.

## Why this channel and not another

Arrival is the binding constraint. The instrument works — eight drift cycles caught and resolved,
231 claims re-verified on every push, the alarm proven able to fail — and one correction has now
been merged upstream. What has not happened is anyone finding out the repo exists: six days public,
three unique viewer-days, **zero referrers**. Nothing on the internet links here.

Mathstodon is small and exactly on target: the maintainers of both surfaces we watch are active
there. r/math is larger and colder. Hacker News is a lottery whose downside is real — a front-page
arrival brings an audience that judges a repo in ten seconds, and we should want that only when the
catch log is stronger than it is today.

## The post, verbatim

Send this text exactly, or don't send it. Every clause has been through the review; edits at send
time have not.

```
Best-known bounds and constants move. The papers, repos and index pages that cite them don't all move at the same time — so a number you looked up last month can already be stale, and nothing tells you.

bounds-ledger is an attempt at the boring half of that: a byte-level mirror of one curated source (teorth/optimizationproblems), plus ~230 pinned claims, re-checked by CI daily and on every push. When a pinned row changes, the build goes red and files what moved. It doesn't look for better bounds — it watches records that already exist.

Between 24 July and 12 August 2026 the alarm fired on eight upstream changes: some pure record movement, some editorial, one a priority correction. Each was verified against primary sources before the mirror was allowed to follow. One was the real Grothendieck constant, both ends improved by a single paper (arXiv:2608.11158).

One correction went the other way — five citation keys on a constants page that didn't match its own reference list, merged upstream on 11 August:
https://github.com/teorth/optimizationproblems/pull/141

What it says about its own limits: two claims can't be checked from CI at all, so they report UNVERIFIED forever rather than green; a generated pin asserts a table row's position, never "the record"; and it's one surface, not a survey.

Built with AI agents, human-gated before anything goes outward.

The most useful thing anyone can do with it is tell me it's wrong — issues welcome.

https://github.com/u00dxk2/bounds-ledger

#math
```

**Length: 1462 characters** as Mastodon counts them (each URL counts as 23 regardless of length),
against Mathstodon's limit of **1729** — read from `mathstodon.xyz/api/v2/instance` tonight, not
assumed. The common Mastodon default is 500; assuming it would have been wrong.

## What is deliberately not in it

Each of these was in the first draft or was the obvious thing to write, and each was cut for a
reason recorded in the review. They are listed here so a later session does not "improve" the post
by putting one back.

- **Any mention of erdosproblems.com or its stale page.** It is our most arresting piece of content
  and it is the public comment David **decided NO on 2026-08-02**, delivered on a louder channel. A
  decision that forbids a channel forbids the content, not just the form. (Review, Finding 7.)
- **Crouzeix's conjecture.** A five-week-old claimed proof with an unresolved priority question
  between two sets of real authors, on which our own recorded position is
  UNVERIFIED-not-contradicted. Not our first words to that instance. (Finding 4.)
- **Terence Tao's name.** The repository is named; the person is not. What he did was merge a
  6-line citation-key fix, and he reads that instance. The PR link proves the claim without
  borrowing anyone's standing. (Finding 6.)
- **"231 claims across arXiv, Wikipedia and the erdosproblems metadata DB."** True-ish and
  twentyfold misleading: 220 of the 231 are generated pins against the one mirrored surface. Only
  11 hand claims are genuinely cross-surface. (Finding 1.)
- **Exact live counts.** A Mastodon post is permanent and unedited. Every figure is either
  historical with a closed date window or approximate. A ledger about staleness must not publish a
  number that decays. (Finding 3.)
- **Any @-mention.** An @-mention is outward contact and is out of bounds regardless of the gate.

## Conditions on the send — for David, not for us

1. **Which account posts, and does it have any reach?** We cannot verify this from here, and it
   dominates the outcome: Mastodon has no global full-text search for ordinary posts, so discovery
   runs through followers, boosts, and the `#math` hashtag timeline. From a new account with no
   followers, the honest expected result is close to nothing. That is not a reason not to post —
   the cost is minutes and the downside is bounded — but it is the difference between "an arrival
   move" and "a message in a bottle", and it should be known before, not after.
2. **The hashtag is the discovery mechanism, not decoration.** If `#math` is dropped, the post
   reaches followers only.
3. **Timing is not load-bearing.** Nothing in the post expires except the closed date window, which
   stays true indefinitely.
4. **If any word is changed at send time, it has not been reviewed.** Send it verbatim or send it
   back.

## How we would know it worked

`continuity/traffic.json` (W-6) starts showing a `mathstodon.xyz` referrer where today there are
none at all, and unique visitors move off 3. The threshold on W-6 is 100 unique visitors across 90
days; day 6 of 90 today. **A post that produces no referrer is a real, recordable answer** about
this channel, and is worth more than not knowing.

## What this does not do

It does not move the north star. G-1 counts externally-acknowledged corrections; arrival is
upstream of that, not that. The only channel that can move it by itself is a merged upstream PR —
which is how the count got to 1, and it happened without anyone knowing this repo exists.
