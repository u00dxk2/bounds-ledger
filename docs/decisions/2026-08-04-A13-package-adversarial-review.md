# A-13 — package-level adversarial review of the public-flip set

**Date:** 2026-08-04 (MT) · **Gate:** the last one before David's flip decision · **Verdict:** **SURVIVES WITH ONE REQUIRED DECISION** (F-1)

The four artifact-level reviews each asked *"is this artifact right?"* This one asks the only question
they structurally could not: **what does a stranger actually receive when this repo goes public?**
Not the README — the repo. Everything in it, at once, to an audience that never agreed to read it.

Method: verify by executing. Every count re-derived, every link resolved, every citation re-fetched.
My own recent prose treated as an unverified source (2026-08-03: a fabricated arXiv ID reached a
README draft and was caught only by re-running the grep).

---

## F-1 — HIGH. The flip publishes a private correspondence and a named third party. Nobody decided that.

The history sweep (2026-08-02) is clean and it is correct. It swept for **credentials**.
**Nobody has swept for people.** These are tracked files and all of them go public on the flip:

| What | Where |
|---|---|
| The erdosproblems.com maintainer named, with our finding that his page is stale | `continuity/items.json`, `docs/decisions/2026-07-23-A3-erdosproblems-report.md`, `docs/lane-brief.md`, 2 cold-starts, 1 daily report |
| The **verbatim text of the private email David sent him** on 24 July | `docs/lane-brief.md` (`## What we said`, kept byte-faithful by deliberate rule) |
| That he has not replied — tracked as a watch with a decision date | `continuity/items.json` (W-3), ~8 cold-starts |
| The contingency of **publicly commenting on his site** — which David has since declined | ~10 tracked files |

None of this is a secret and none of it is dishonest. That is exactly why it slipped: every artifact
is individually fine, and the exposure exists only in the *set*. A stranger lands on a repo whose
headline is "a widely-cited page is three records stale" and finds, one directory down, a named
person, a private email he received, a note that he has not answered, and a discussed plan to post
on his site. He learns all of this from us, at once, without notice.

**This is a decision, not a defect.** Three defensible options, and it is David's call because the
email was his:

1. **Flip as-is.** Defensible: it is accurate, the tone is factual throughout, and radical
   transparency about our own operation is this repo's distinguishing asset.
2. **Flip with the correspondence redacted** — keep the finding, drop the verbatim email body and
   the declined-contingency notes. Costs the brief's byte-fidelity rule for one block.
3. **Flip, and tell the maintainer first.** Converts a discovery into a courtesy. Outward contact,
   so it is David-gated like the original send.

I hold no recommendation strong enough to substitute for his. **What the review asserts is only
that the 8/06 decision must now include this question** — it was not previously on it.

## F-2 — MEDIUM. A public security document under-states its own residual risk.

`SECURITY.md:8` — *"There is no supply chain to compromise beyond Node itself and GitHub Actions'
first-party actions."* True, and it reads as reassurance. Verified by execution today:

- `actions/checkout@v4`, `actions/setup-node@v4` — pinned by **mutable tag**, not SHA
- `sha_pinning_required: false`, `allowed_actions: "all"` on the repo

A repointed tag executes in a job holding `issues: write`. Blast radius is small today (private, no
secrets, no deploy keys) and it **grows at the flip**, which is when this sentence starts being read
by strangers. The sentence is not wrong; it declines to name the one thing it is about. That is the
method-sentence class this repo already has a standing rule for — the rule was applied to outward
prose and never to our own security doc.

**Smallest fix:** SHA-pin both actions, then the sentence becomes true without qualification.
Deliberately not shipped inside this review — CI is this lane's most load-bearing artifact and
changes there get deliberated, not slipped in alongside something else.

## F-3 — LOW, framing. The operating record is the stranger's frame, and the README does not say so.

`CLAUDE.md`, `AGENTS.md`, `continuity/items.json` (340 lines), and every cold-start and daily report
are tracked. A visitor meets the lane's private vocabulary — *PACED rail*, *G-1*, *A-13*, *the
outward gate* — before any explanation of it. Not a defect: for a repo whose credibility rests on
"we catch ourselves," the operating record is arguably the strongest artifact in the set. But it
should be a **stated** choice. One README line pointing at it as deliberate would convert confusion
into the intended impression.

---

## What I could not break

Attacked and survived, each re-derived by execution rather than read:

- **Counts.** 111 mirrored constant files; 229 claims = 220 generated + 9 hand. Re-counted off
  disk; matches the README, and matches today's scheduled CI log independently.
- **Links.** Every local path resolves; all four drift commits (`34a37fc`, `57442ae`, `32b138b`,
  `d7d66a8`) exist.
- **The citation that was fabricated once.** `arXiv:2601.16175` re-fetched today →
  *"Learning to Discover at Test Time."* Correct. Not trusted from the draft; executed.
- **"No credentials in the repo or its history."** Backed by a sweep whose own positive control
  planted a real secret and made it fire. Repo access re-verified today: 0 secrets, 0 deploy keys,
  1 collaborator, 0 forks — and the secrets check was proved able to return non-empty against
  other repos before its empty result here was believed.
- **The four load-bearing rules** read as discipline, not as excuse-making. Each names a concrete
  cost it pays: UNVERIFIED claims never counting green, pins refusing to assert "record."
- **No contradictions found** between README, SECURITY.md, AGENTS.md and CLAUDE.md.

## Verdict

The package is **technically sound and honestly stated**. The gate is not blocked by a defect in
any artifact. It is blocked by one question the package never asked itself — **F-1** — which is
David's to answer, and which should be answered before the flip click rather than discovered after.
