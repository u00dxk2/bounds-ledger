# Adversarial review — Mathstodon announcement v2

**Date:** 2026-08-28 (MT)
**Artifact:** `docs/decisions/2026-08-28-mathstodon-announcement-v2.md`
**Verdict:** SURVIVES, with five amendments applied before the draft was recorded.
**Gate:** this is gate 1 of 2 (the standing rule: at least one adversarial review on everything this
project produces that might touch the public). Gate 2 is David's send and is NOT given.

**Stated limitation, because it changes how much this review is worth.** It was run in the same
session, by the same author, as the draft. v1's review on 2026-08-13 had the same property. A
same-author review reliably catches figure and fidelity defects — those are checkable — and is
weakest exactly where v1's was weakest: on whether the *story* should be told at all. Angle 8 below
is that question, and it is surfaced to David rather than resolved here.

## Angle 1 — the method sentence. FOUND A DEFECT, as it has every time.

This lane's outward artifacts have now failed on the method sentence three times running: the A-3
draft's false "cross-checked against the source-paper abstracts" (2026-07-24), v1's "231 claims
across arXiv, Wikipedia and the erdosproblems metadata DB" (2026-08-13, four of six amendments on
that one sentence), and this draft.

The defect: **"233 pinned claims, re-checked daily and on every push" is false for two of them.**
The two `manual: true` claims are never fetched by CI at all. The post disclosed this two paragraphs
later, so the artifact contradicted itself rather than lying outright — which is exactly the shape
of v1's failure, where the sentence was true-ish and twentyfold misleading.

**Amendment 1:** "plus ~230 pinned claims, all but two re-checked daily and on every push". The
later paragraph now *pays off* the earlier one instead of correcting it.

This angle should be run first on every outward artifact this lane produces. Three for three.

## Angle 2 — figure decay. FOUND A DEFECT.

A-28 (2026-08-24) killed v1 on precisely this: three of its figures had gone stale in eleven days,
and *"a ledger whose entire product is noticing that cited numbers have gone stale must not announce
itself with three stale numbers."* A Mastodon post is permanent and unedited, so the defect is
unfixable after the fact.

The draft carried `233`, a live count that moves whenever upstream adds a constant.

**Amendment 2:** `233` → `~230` (approximate, cannot decay), and the twelve-change figure is stated
inside the closed window "Between 24 July and 27 August 2026", which stays true indefinitely. No
figure in the post can now go stale. Designed out, not patched.

## Angle 3 — third-party amplification. THE LOAD-BEARING JUDGMENT OF THE REWRITE.

The correction David asked us to build around concerns an attribution that was wrong about real
people in a priority matter. v1 cut this material outright (its Finding 4: *"a five-week-old claimed
proof with an unresolved priority question between two sets of real authors"*).

What changed: upstream has now **resolved it publicly, in its own words, on its own page.** We are
no longer speculating about a live dispute. What did not change: the people involved did not ask to
be discussed on a mathematics instance, and upstream fixed it quietly.

Resolution: **tell the structure, name nobody.** The post names no author, no paper, no maintainer
and not the conjecture. Verified by grep over the final text — zero hits for every relevant name —
**with a positive control**, the same pattern returning 20 hits against the mirrored source file, so
the zero is evidence and not a broken pattern.

The quoted retraction sentence was checked separately: it contains no names either.

## Angle 4 — content forbidden by a prior decision. CLEAN.

David decided NO to a public comment on erdosproblems.com/36 on 2026-08-02, and the standing rule is
that a decision forbidding a channel forbids the *content*, not just the form. Today's ruling
reverses the drop of *this post*; it does not touch 8/02. The stale-index-page story is absent —
same grep, same positive control.

## Angle 5 — overclaiming and self-credit. CLEAN, and deliberately inverted.

The obvious way to write this post is "our ledger caught upstream in an error". That would be false.
Upstream corrected itself; nobody told them; our alarm saw the text change afterwards.

The post says so in its own words — *"It did not catch the error — upstream corrected itself, and
nobody told them"* — before it says anything favourable. Checked against the repo record: the
2026-08-12 finding did record the claim as unverified-not-contradicted, fifteen days before the
retraction, so the chronology is honest and in-repo.

Note this is the `check-self-attribution` discipline (2026-08-27) running in the opposite direction:
that gate exists because self-blame is an unverified attribution nobody challenges. Self-*credit* is
the same defect with the sign flipped, and the audience for this post is the one most likely to
check.

## Angle 6 — quote fidelity. CLEAN, by construction.

The 2026-08-21 rule is that "verbatim" is a method claim and must be audited by grepping the source.
The retraction sentence was **extracted from the mirror, never retyped**
(`ledger/teorth-optimizationproblems/constants/2a.md`), and
`grep -F` confirms the exact string in both the mirror and the final post.

The post text inside the decision file was assembled by **concatenation**, not retyping, and the
embedded block was then extracted back out and diffed against the counted text: identical but for a
trailing newline. This closes the failure mode where a reviewed artifact and the artifact that ships
quietly differ.

## Angle 7 — what a stranger arriving actually sees. CLEAN today.

v1's review found two false sentences on our own landing page that no post-accuracy review could
have caught, because it asks a different question. Re-run today: `npm run verify` is green end to
end (no drift at `3a14910`, 233 claims, state block in sync, page matches committed state, brief in
sync), and the README lead is consistent with the post's framing. The "repo stays private" falsehood
in the lead was fixed 2026-08-27 (`0dfe218`).

## Angle 8 — does the showcased story undercut the pitch? SURVIVES, UNRESOLVED, FOR DAVID.

The strongest objection to the whole rewrite, and it is not disposable.

The post's centrepiece is an episode in which **the ledger did not act.** A sceptic reads it and
asks: upstream found and fixed its own error, so what did this thing buy anyone? If the answer is
"nothing", the post argues against its own project, and it argues that to the audience least likely
to miss it.

The counter, which the post now makes explicitly: for fifteen days a reader of the *source* would
have believed a claim its own author later withdrew, while a reader of the *ledger* saw
"unverified". That is a real difference and it is the product. It is also, honestly, a modest one.

**Why this is surfaced rather than resolved:** it is a judgment about whether the story is worth
telling, David asked for this specific story, and a same-session author-reviewer is the wrong
instrument for overruling him on it. He should know the objection exists before he sends.

## Angle 9 — send-verbatim discipline. FOUND A DEFECT.

The draft first came in at 1723 of 1729 characters — six characters of margin. The "send verbatim or
send it back" condition then becomes unenforceable in practice: David cannot fix a typo without
breaking the limit, and the realistic outcome is an unreviewed edit at send time.

**Amendment 5:** trimmed to **1706**, leaving 23 characters. Limit and URL reserve were **read live**
from `mathstodon.xyz/api/v2/instance` on 2026-08-28 (`max_characters: 1729`,
`characters_reserved_per_url: 23`) rather than carried forward from v1's note — a hand-written value
of a live instrument needs its own read, which is this repo's own standing rule.

## Amendments applied

1. `233 pinned claims, re-checked daily` to `~230 pinned claims, all but two re-checked daily` (Angle 1)
2. Every figure made non-decaying: approximate, or inside a closed date window (Angle 2)
3. Added the value sentence the draft was missing: *for those fifteen days a reader of the source would have believed it; a reader of the ledger saw "unverified"* (Angle 8's counter)
4. `the fetch available to us` to `the fetch available` — removed a first-person clash with the closing `tell me it's wrong` (minor, register)
5. Trimmed 1723 to 1706 characters for a workable send margin (Angle 9)
