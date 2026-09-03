# Evangelism bar — bounds-ledger

Authored 2026-08-25 (A-26). The portfolio asks every project for three things: the ONE core
problem in the user's words, the would-tell-a-friend moment, and the metric that proves movement
toward product-love. This lane had none of them written down, and the gap had been re-reported
as a gap on three consecutive days, which is the stale-blocker pattern this repo is trying to
kill. So it is written now, including the parts that are uncomfortable.

## Who the user is

A mathematician, graduate student, or referee who is **about to cite a number** — a bound, a
constant, a certificate — in a paper, a talk, a problem set, or a review.

They are not looking for records. They already have the number. They got it from a source they
had no particular reason to distrust: a survey, a course page, a well-known problem index, a
previous paper of their own.

## The ONE core problem, in the user's words

> "I got this constant from a page that says it was last edited in January. I don't know if
> that means it's current or that nobody has looked at it since."

Second phrasing of the same problem, which is the one that actually stings:

> "I cited a bound and a referee told me it had been improved. I had no way to know."

The problem is **not** "find me the best known bound". That is a search problem and other people
are better placed to solve it. The problem is **"is the number I already have still true, and
how would I find out without redoing the literature search I did last year?"** Verification, not
discovery. The lane's whole thesis is that these are different jobs and only the second one is
unowned.

## The would-tell-a-friend moment

A user looks up a constant they are about to cite and the page tells them something about their
own citation that they could not have known without re-deriving it themselves:

- **"value changed 2026-08-23"** — the numerals in that row moved, recently, and here is the
  upstream sha and the exact pinned string so you can check it yourself.
- **"text edited 2026-08-24 — bound unchanged"** — somebody touched the row and the number
  held. This is the one that saves a wasted afternoon.
- **"first pinned 2026-07-24 — unchanged since"** — tracked for a month, never moved. A
  believable "nothing to see here", which is worth more than silence.

The moment is the **third** label as much as the first. Before 2026-08-24 all 222 rows carried a
bootstrap date and read as though something had happened that day; a reader could not tell "this
moved" from "we started watching". Telling those apart is what converts a page of numbers into a
page of answers.

The friend-telling sentence we are trying to earn is roughly: *"there's a thing that watches the
bounds page and tells you when a number you cited moved."*

## What would make this NOT worth telling a friend

Stated plainly, because a bar that only lists successes is decoration:

- **Coverage.** One mirrored upstream surface plus a handful of hand claims. If the constant a
  user cares about is not among the 111 constants files, the page has nothing for them and the
  visit is a dead end. Coverage is the single biggest threat to the moment above.
- **The record/listing distinction.** The generated pins assert the LAST-LISTED row of a table,
  never "the record". That is correct and deliberate — numeric record-ranking here is defeated
  by symbolic cells, negatives and asymptotics — but a user who reads "value changed" as "the
  record improved" has been misled by their own inference, and the page has to keep saying so.
- **Frequency.** See the loop archetype below. If the answer is almost always "unchanged since",
  the honest read is that the instrument is working and the user still has little reason to
  return.

## Loop archetype: the citation check

**Low-frequency, high-stakes, externally triggered.** The user does not come back daily. They
come back when they are writing, refereeing, or revising — a cadence of weeks to months, driven
by their calendar and not by ours.

This is recorded as `loopArchetype: "citation-check"` in `continuity/health.json`, and it is the
most decision-relevant line in this document, because it disqualifies the metrics the portfolio
reaches for by default:

- **D7-return-rate is the wrong instrument.** A tool used at citation time SHOULD have a bad
  D7 number. Optimising it would push toward engagement mechanics that make the product worse.
- **Session frequency is the wrong instrument** for the same reason.
- **Share-rate and repeat-visit-over-a-quarter are the right shape**, because they survive a
  loop measured in months.

## The metric that would prove movement toward product-love

**The one we want:** the count of *useful non-obvious answers delivered* — a distinct person
looking up a specific constant and getting either a "value changed" or a dated "unchanged since"
they then acted on. That is the moment above, counted.

**The honest status: we cannot read it, and we are not going to pretend otherwise.**

What exists today is a static page on GitHub Pages with no analytics of any kind, and the
arrival figures we do have are close to unusable. **Sampled 2026-08-25** (`npm run traffic`;
re-run it rather than quoting this line later): the trailing 14-day window reads **3 unique
viewers against 194 unique cloners**. The clone figure is largely our own CI, which checks out
on a schedule and on every push and every PR, so number-provenance rule 2 — *is this number
mine?* — disqualifies it outright. The viewer count is the only arrival figure here that is not
mostly ours, and 3 is not a denominator you can compute a rate against.

The date stamp on that paragraph is deliberate. A ledger whose product is noticing stale cited
numbers must not carry undated ones of its own; the first draft of this section quoted a
figure lifted from yesterday's primer and was already a day behind when it was written.

**So the highest-leverage move is to stand up the instrument, not to write a retention target
against a number nobody can read.** The smallest honest instrument, in order:

1. **A per-row "report a problem" click already exists on every row.** That is a real
   intent signal, it requires no analytics stack, and it lands in a place we control. Nothing
   currently counts it over time.
2. **A denominator.** Any privacy-respecting count of distinct lookups — even server-side and
   coarse — turns (1) from an anecdote into a rate.
3. **Only then** a share-rate or quarter-scale return read.

Until (1) and (2) exist, this lane's product-love metric is **NOT MEASURABLE**, and any number
quoted as if it were should be treated as a defect in this document.

## What this bar is not

It is not a launch metric, not a funnel, and not a self-rating. This lane has refused a
self-rating contract on purpose, and an evangelism bar that quietly became a score would be the
same thing wearing a different hat.

## Reader reach is unmeasured, and that absence is CONSIDERED

Approved 2026-09-03. The orchestrator's ruling is the reason this section exists in words rather
than as a shrug: **a clean absence with nothing considered-and-declined reads as a question rather
than an answer.** So the two options are named, and both are dead.

**(a) Client-side analytics on the published page — refused by an enforced invariant.**
`render-site.mjs`'s selftest asserts the page references no third-party asset and fetches nothing
at runtime. That invariant is load-bearing for a public mathematics ledger, and it is checked, not
merely intended.

**(b) A server-side request log — NOT forbidden by that invariant, and this is the correction
worth holding.** The no-fetch rule says nothing about the server. What actually kills this option
is that **GitHub Pages hands us no request log at all.** Anyone re-deriving this will otherwise
conclude the selftest is the whole blocker and propose a server-side read as the way around it.

**Consequences, so they are not re-derived each session:**

- `[reached: …]` on a page ship reads `unknown` with that reason. That is the honest answer, not a
  gap awaiting an instrument.
- `npm run traffic` (repo views) and `npm run reports` (report arrivals) both count github.com,
  **never page readers.** Neither may be quoted as readership.
- Standing up a reach instrument is **not** a substrate task to self-approve. Whether to move to a
  surface that can be measured is `A-34`'s breadth-versus-depth question, and it is David's.

## Review

Re-read this whenever coverage changes materially, when an arrival instrument first produces a
readable number, or at the next forced-decision pass — whichever comes first. If the loop
archetype above turns out to be wrong, most of the metric section is wrong with it.
