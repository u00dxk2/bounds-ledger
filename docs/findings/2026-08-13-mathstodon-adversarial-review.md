# Adversarial review — the Mathstodon announcement post

**Date:** 2026-08-13 (MT)
**Items:** G-1 (the north star), W-6 (arrival watch)
**Artifact under review:** `docs/decisions/2026-08-13-mathstodon-announcement.md`
**Gate:** this is gate 1 of 2. Gate 2 is David's send. **Nothing has been posted anywhere.**
**Verdict:** SURVIVES, with **six required amendments** (all applied) and **one input we cannot
verify from here**, stated in the decision doc as a condition on the send rather than papered over.

The standing rule (David, 2026-08-01) is at least one adversarial refute-it review on everything
this project produces that might touch the public. Nine angles were run, each trying to kill the
post rather than improve it. The two the orchestrator named explicitly — **the method sentence**
and **the disclosure question** — are angles 1 and 5.

---

## The draft as first written (v1), reproduced so the review is checkable

> I built a ledger that watches mathematical records and goes red when one moves.
>
> Best-known bounds and constants drift. The papers, repos and index pages citing them don't all
> move together, so a number you looked up last month may already be stale and nothing tells you.
>
> bounds-ledger mirrors Terence Tao's optimization-constants repository byte-for-byte and pins 231
> claims across arXiv, Wikipedia and the erdosproblems metadata DB. CI re-checks them daily. Since
> 24 July it has caught eight upstream drifts — including the Grothendieck constant's tenths digit
> being settled, and Crouzeix's conjecture being claimed proved.
>
> One catch went back upstream: five broken citation keys, merged by the maintainer on 11 August.
>
> It's small, it's one surface, and the most useful thing you can do with it is tell me it's wrong.
>
> https://github.com/u00dxk2/bounds-ledger

Four of the six amendments below are to that middle paragraph. It is 20% of the post and carried
100% of the false or over-reaching content, which is itself the finding: **the sentence that
describes the method is where an outward artifact goes wrong**, exactly as on 2026-07-24.

---

## Angle 1 — the METHOD sentence (mandated angle)

*Attack: assume every clause describing how the thing works is false until each is separately
demonstrated. This angle exists because on 2026-07-24 a five-angle review passed a draft whose
method sentence was false — all five angles attacked the value, none the method.*

**FINDING 1 (material, fixed). "pins 231 claims across arXiv, Wikipedia and the erdosproblems
metadata DB" inflates cross-surface coverage by roughly twentyfold.** 220 of the 231 claims are
*generated* pins, and every one of them is checked against the upstream repo at live HEAD. Only the
11 hand claims reach arXiv, Wikipedia, or the `teorth/erdosproblems` metadata file. The sentence is
literally parseable as true ("claims" collectively span those surfaces) and will be read as "231
claims spread across four surfaces". That is the lane's own **curated-vs-live-never-blend** rule
broken in its own announcement — the same defect class as the A-3 draft naming an unvetted
leaderboard value.
**Fix applied:** the two mechanisms are separated. The post says a byte-level mirror of *one*
curated source, plus ~230 pinned claims. The cross-surface list is dropped rather than
re-quantified: it is real but it is 11 claims, and a number that small does not survive being
advertised.

**FINDING 2 (material, fixed). "CI re-checks them daily" is false of 2 of the 231 claims,** and
those 2 are not an implementation detail — they are the ledger's most-cited honesty feature. Their
source serves HTTP 403 to datacenter IPs, so CI can never check them and they report UNVERIFIED
permanently.
**Fix applied:** the limits paragraph now states it. This *strengthens* the post for the audience:
a claim that everything is checked invites one reply ("what about X"), and pre-empting it is the
cheaper trade.

**FINDING 3 (minor, fixed). "eight upstream drifts … since 24 July" is an open-ended count in a
frozen artifact.** A Mastodon post is permanent and unedited; the repo is not. A ledger whose pitch
is *your numbers go stale and nothing tells you* must not publish a number that starts going stale
the day it is posted.
**Fix applied:** the window is closed and dated — "between 24 July and 12 August 2026" — which
makes the figure a historical fact that stays true forever instead of a running total that decays.
Same reasoning as `npm run catches` quoting a per-week rate rather than a lifetime total.

**Also checked and found sound, so it is not re-litigated later:** "byte-level mirror" (true;
`reverify.mjs` diffs file bytes), "re-checked by CI daily and on every push" (true; 09:17 UTC cron
+ push + manual), "the build goes red and files what moved" (true, and demonstrated in production
eight times), "verified against primary sources before the mirror was allowed to follow" (true of
every one of the eight cycles, and it is the discipline the repo would be worthless without).

## Angle 2 — are we asserting mathematics we have not verified?

*Attack: read every clause as a mathematical claim made by us, in front of mathematicians.*

**FINDING 4 (material, fixed). "Crouzeix's conjecture being claimed proved" must come out.** Three
independent reasons, any one sufficient:

1. It is a claim about a five-week-old preprint that has not been peer-reviewed. Upstream hedges it
   twice in its own table ("claimed proof", "(claimed to be) settled"). A post that compresses that
   to a headline drops the hedge that its own source insisted on.
2. It carries an unresolved **priority** question — upstream has since re-attributed the result to
   an independent preprint posted eight days earlier, and reworked that paragraph three times in
   one day. Announcing it means walking into a live attribution dispute between two sets of real
   authors, uninvited, as our first words on the instance.
3. We hold a recorded near-miss on exactly this material: on 2026-08-12 we were one step from
   publicly stating that one of those papers omits an acknowledgement, on the strength of a
   *negative* result from a document that turned out to be an arXiv fallback page rather than the
   paper. Our own position is UNVERIFIED-not-contradicted. That is not a thing to advertise.

**Fix applied:** the Crouzeix line is deleted. The Grothendieck line is **kept**, because it
survives the same attack: it is a bound improvement recorded by upstream and attributable to one
named published paper, both ends of the bracket were recomputed by us against the paper's own
abstract, and no attribution question attaches to it. The post attributes the *movement*, not the
theorem.

**FINDING 5 (minor, fixed). "the Grothendieck constant's tenths digit being settled" is our
inference, not upstream's sentence.** It follows from the bracket, and we verified that it follows
— but a post is not the place where a derived mathematical statement should make its debut.
**Fix applied:** reduced to "both ends improved by a single paper (arXiv:2608.11158)", which is the
table movement itself. The tenths-digit consequence stays in the repo where the interval that
forces it is also there to be read.

## Angle 3 — are we borrowing someone else's standing?

*Attack: read the post as the person named in it.*

**FINDING 6 (material, fixed). v1 names Terence Tao in the method sentence and "the maintainer" in
the merge sentence — two invocations of one person's authority in an eight-line post, to a
readership that includes him.** He is active on this instance. What he actually did is merge a
6-line citation-key fix; what the post implies, by proximity, is involvement. Borrowing standing is
bad in general and *specifically* risky when the lender reads the post.
**Fix applied:** the repository is named (`teorth/optimizationproblems`, which is its name), the
person is not, and the merge is stated as a fact with a link that proves itself. A reader who wants
to know who merged it can click and see. The evidence carries the claim instead of the name.

**Not a finding, recorded so it is not re-raised:** mirroring a public CC-licensed-style repo and
saying so is not free-riding; it is the honest description of what this repo does, and it links
upstream prominently. The fix above is about *implied endorsement*, not about naming the source.

## Angle 4 — does the post cross a decision David has already made?

*Attack: hunt for anything already ruled out, arriving under a new name.*

**FINDING 7 (material, and the one worth remembering). The single most compelling piece of content
for this audience is the piece David has ruled off-limits, and it took deliberate effort not to
write it.** The lane's founding finding is that a widely-cited index page has shown a superseded
bound since January. On an instance of mathematicians, "here is a number your favourite index page
has had wrong for seven months" is *by far* the most arresting thing we could say — and saying it
publicly is functionally the public comment on erdosproblems.com/36 that was **decided NO on
2026-08-02** ("I sent the email. I don't want to add a comment as well"), delivered on a louder
channel than the one that was declined.
**Fix applied:** neither the site nor the page is mentioned in the post, in any form. The
announcement stands on the upstream-merge story, which is weaker as a hook and is the one we are
permitted to tell. Recorded here because the pull toward that content was real and the next session
will feel it too: *a decision that forbids a channel forbids the content, not just the form.*

**Second check under this angle, clean:** the post is not contact with the erdosproblems.com
maintainer, does not mention the July email, and does not nudge W-3. W-3 remains a watch.

## Angle 5 — the DISCLOSURE question (mandated angle)

*Attack: not "is the post accurate?" but "what does driving strangers to this repository reveal,
and about whom?" This is the pass that returned eight blockers on 2026-08-05 when five
artifact-level reviews had cleared the same package.*

**FINDING 8 (material, fixed). The post did not disclose that the repo is agent-built.** It is
discoverable — every commit carries a `Co-Authored-By` model identity — so the choice is not
whether it comes out but whether it comes out from us. On an instance of mathematicians, an
AI-produced tool that presents as hand-built and is *found out* loses the credibility the whole
exercise is for; one that says so up front is merely accurate. The adopted surface itself credits
automated contributors by name in its own tables, so this is not a norm violation there.
**Fix applied:** one line, "Built with AI agents, human-gated before anything goes outward". It is
true in both halves — the outward gate is why this review exists and why nothing has been sent.

**Disclosure sweep of what a stranger arriving from this post would find, run as an enumeration of
what the repo reveals rather than a search for defects already known:**

| Surface | Read |
|---|---|
| Third-party personal data | The 2026-08-05 pre-publication pass found seven classes and one screenshot of a forum carrying third-party handles; all were removed and the removal was verified from a fresh clone of the remote, not the working tree. |
| The erdosproblems.com maintainer | Not named; the email text is not reproduced. README states this explicitly. Unchanged by this post. |
| Named living authors in `docs/` | Present, and correctly: they are authors of cited papers, discussed in terms of what upstream's table records. The one place we discuss a *priority* question states our position as UNVERIFIED-not-contradicted. A reader who follows the post is not being handed an accusation. |
| Our own security posture | The doc that published which platform-side controls were off was removed 2026-08-05. |
| Author email / session URLs | Rewritten out of history and out of tracked files; last sweep 2026-08-09 after a recurrence found one in a tracked file when only commit bodies had been swept. |
| What we collect about visitors | GitHub's own aggregate traffic counts, sampled into `continuity/traffic.json`. No analytics, no third-party tracker, nothing identifying. Nothing to disclose, but we can answer it if asked. |

**No new disclosure defect was found.** That is a weaker statement than "the repo is clean" and is
deliberately worded that way: this pass enumerated by shape and found nothing, which licenses the
post and nothing wider.

## Angle 6 — will it read as spam or as self-promotion?

*Attack: read as a moderator.*

Clean. No @-mentions of anyone (an @-mention would be outward contact and is out of bounds
regardless), one hashtag, two links both of which are evidence rather than funnel, no call to
action beyond "tell me it's wrong", and the post spends four of its ten lines on its own
limitations. **Not a finding, but the ratio is the reason it reads as a report rather than a pitch,
so do not "tighten" the limits paragraph away in a later edit.**

## Angle 7 — is the falsifiability invitation real?

Clean, and load-bearing. "Tell me it's wrong" matches a README section that says the same thing and
names the shapes of report that are most useful. Issues are open. If this invitation were decorative
the post would be worse than nothing on this particular instance, where the readership is entirely
capable of taking it up.

## Angle 8 — the arithmetic, re-run rather than inherited

Every figure in the post was re-derived tonight rather than copied from a primer:

- **PR #141**: `gh pr view` against the live API — state MERGED, `mergedAt` 2026-08-11T17:18:12Z,
  `mergedBy` teorth, 1 file, 6 additions / 6 deletions on `constants/15a.md`. The post's "five
  citation keys" matches the PR title and the diff.
- **"~230 pinned claims"**: 231 committed. Deliberately written as "~230" — see Finding 3; an exact
  count in a permanent post is a hostage.
- **Eight cycles between 24 July and 12 August 2026**: enumerated in `continuity/items.json` A-2
  and shown in the README table as seven rows — its last row spans two cycles and says so, because
  upstream refined one attribution twice. Cycles, not changed files and not upstream pushes.
- **arXiv:2608.11158**: the Grothendieck paper, fetched and its abstract read on 2026-08-12; both
  endpoints recomputed to match the stated decimals before the mirror was allowed to move.
- **Post length**: 1462 characters as Mastodon counts them (URLs count as 23 each), against
  Mathstodon's limit of **1729** — read from `mathstodon.xyz/api/v2/instance`, not assumed. The
  common Mastodon default is 500, which the draft would have failed; assuming it would have caused
  a silent truncation or a hasty rewrite at send time.

## Angle 9 — the refutation the post itself cannot answer

**FINDING 9 (unresolved, and it is an input to David's decision, not a defect in the text). We
cannot verify from here that the account posting this has any reach, and expected arrival is
dominated by that, not by the wording.** Mastodon has no global full-text search for ordinary
posts: discovery runs through followers, boosts, and hashtag timelines. If the posting account is
new or has no followers on the instance, the honest expected outcome is a hashtag-timeline
impression count near zero — in which case the post is not harmful, it is simply not the arrival
move it is being treated as.

This is stated in the decision doc as a condition on the send rather than hidden in a review nobody
re-reads, because it is the kind of thing that decides whether the move is worth making at all.
**It does not block the send** — the cost is minutes and the downside is bounded — but a menu that
implied a post equals arrival would be making the same error this lane keeps catching in other
people's numbers.

---

## Verdict

**SURVIVES.** Six amendments applied (Findings 1, 2, 3, 4+5, 6, 8); one channel-level constraint
recorded and obeyed (Finding 7); one unverifiable input surfaced to David rather than assumed
(Finding 9). The revised text is in `docs/decisions/2026-08-13-mathstodon-announcement.md` and is
what a send would post, verbatim.

**The send remains David's.** Nothing has been posted, no account has been contacted, and no
@-mention appears in the text.

## Two things this review changed about the repo itself

Running the disclosure angle meant reading the README as a stranger arriving from the post would,
and that found **two false sentences on the landing page** — both fixed in the same commit, because
inviting people to a page that contradicts itself is worse than not inviting them:

1. *"The metric this project judges itself by — externally-acknowledged corrections — is 0."*
   It has been **1** since 2026-08-11, and the same README says so 50 lines earlier. A page whose
   pitch is that widely-cited numbers go stale had its own headline number stale for two days.
2. *"Known blind spot: upstream's README.md is not mirrored."* It has been mirrored since
   2026-08-10 (W-5), and the generated state block ten lines above said so. The blind class this
   bullet describes was closed and the bullet outlived it.

Both are the same shape as the drift this lane exists to catch, in our own front door, found only
because the review asked what a stranger would see rather than whether our sentences were true when
written.
