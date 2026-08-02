# Public-route conversion of the /36 correction — draft wording + adversarial review

**2026-08-02** · A-3 (closed, sent) → public route per **W-3 note7** · **David-gated: nothing posted**

David, 2026-08-01: *"yes - we can still monitor that page to see if he accepts our correction, but
let's not wait on that to make our progress."* That is GO **to prepare**, not to post. His 7/26
conditions are unrevoked: a fresh adversarial review of the public wording, plus **his pre-send
read of the exact text**. This document is both halves.

---

## 1. Record state, re-verified today (not inherited)

| | |
|---|---|
| Curated best **upper** bound | **0.380868** — [YLTLYSTYLLGDHZSWZSHMELCZX2026] SimpleTES, arXiv:2604.19341 |
| Curated best **lower** bound | **0.379005** — [W2022] White, arXiv:2201.05704 |
| Source | `constants/1b.md`, mirror clean at upstream `621429c` |
| erdosproblems.com/36 shows | `0.379005 < c < 0.380876`, "last edited 23 January 2026" |

Both verified **2026-08-02**: the mirror by this morning's green CI run (no drift, 111 files at
`621429c`) and the live page by local advisory fetch from a residential IP (HTTP 200, both C-7 and
C-9 pins still present — i.e. the page has not moved since the email went). 0.380868 is still the
last-listed row of 1b's upper-bound table. **The correction still stands.**

## 2. Venue, verified today

`teorth/erdosproblems` CONTRIBUTING directs mathematical context to "the corresponding problem page
on the erdosproblems.com site." Confirmed that page actually supports it: /36 carries threaded
comments with quote-reply, and the site renders a status widget labelled **"Comment activity that
has not yet been incorporated into the remarks"** — comments are the maintainer's own intake path
for page updates, not a side channel.

**Operational caveat, unresolved:** the page served us `data-can-edit="0"` anonymously and exposes a
register link, so posting almost certainly requires an account on erdosproblems.com. I did not
create one and did not test the post path. **David would likely need to register or sign in.** Do
not treat this as confirmed — it is inference from anonymous markup.

## 3. Draft comment (NOT POSTED)

> The upper bound listed here (0.380876, TTT-Discover) appears to have been superseded. The curated
> optimization-constants repository maintained alongside this project lists a later value for the
> same constant, $C_{1b}$:
>
> **0.380868** — Ye et al., *Evaluation-driven Scaling for Scientific Discovery*, [arXiv:2604.19341](https://arxiv.org/abs/2604.19341)
>
> With White's 2022 lower bound ([arXiv:2201.05704](https://arxiv.org/abs/2201.05704)) that gives a
> current bracket of 0.379005 < c < 0.380868. Table:
> [teorth.github.io/optimizationproblems/constants/1b.html](https://teorth.github.io/optimizationproblems/constants/1b.html)
>
> To be precise about what I have and haven't checked: I compared this page against that curated
> table and they disagree. I have not independently verified the construction behind 0.380868.
>
> (Noticed by an automated re-verification ledger I maintain that watches cited records for drift;
> posted by hand.)

**Wording constraints this draft is honouring, each from a prior catch:**

- **No 0.380871 / EinsteinArena line.** Its citation `[T2026]` is a GitHub README, not a paper, and
  naming it points readers at an unvetted leaderboard — our own curated-vs-live-never-blend rule,
  broken in our first outward artifact and caught by the 7/24 review.
- **No claim of cross-checks against source-paper abstracts.** None of the three abstracts state
  their numeric bounds (all fetched and checked 7/24). Verification rests on the curated table alone,
  and the draft says exactly that.
- **"The curated repository lists" — never "the record is."** See Angle 7.
- **No mention of the 7/24 email, and no mention of the page's last-edited date.** See Angle 6.
- **AI disclosure present**, per the 8/01 deep-research finding that disclosed-AI + human-submitter
  is the community norm.

---

## 4. Adversarial refute-it review

Standing rule (David, 2026-08-01): at least one adversarial review on everything this lane produces
that might touch the public. Angles 1–5 re-run the 7/24 set against today's state; **6–8 are new,
and exist because the venue changed from a private inbox to a public page.**

**Angle 1 — Is 0.380868 still the curated best upper bound?**
Attempted refutation: an 8/01 drift touched 12 files; if 1b moved, the draft is stale.
**SURVIVES.** The 8/01 drift rewrote 3a and added 3d; 1b's tables are unchanged and 0.380868 remains
last-listed. Mirror clean at `621429c` this morning.

**Angle 2 — Is the page actually still stale?**
Attempted refutation: the maintainer may have quietly acted on David's email, making a public
correction wrong and embarrassing.
**SURVIVES,** and this is the angle most likely to flip between now and a send. Verified today: C-7
(`0.380876` present) and C-9 (`last edited 23 January 2026`) both still hold. **Re-run
`npm run check` immediately before posting** — this is a live precondition, not a settled fact.

**Angle 3 — the METHOD sentence (the 7/24 lesson).**
Attempted refutation: does the draft claim any verification we did not perform?
**SURVIVES, and this angle changed the draft.** We verified a *disagreement between two surfaces*.
We did not read arXiv:2604.19341's construction, did not reproduce it, and cannot vouch for it. An
earlier draft's "cross-checked against the curated table and the source-paper abstracts" was false
and survived five angles because every one attacked the value and none the method. The draft now
states the limit explicitly, in the comment itself, where the reader can see it.

**Angle 4 — curated-vs-live blend.**
**SURVIVES** — the 0.380871 line is absent by design. Confirmed against `1b.md:25`.

**Angle 5 — does the venue exist and is it sanctioned?**
**SURVIVES** with the account caveat in §2. Note this angle was checkable only because someone
actually fetched the page rather than reasoning from CONTRIBUTING.md.

**Angle 6 (NEW) — does posting publicly, nine days after an unanswered private email, read as
pressure?**
This one has real force. The 7/24 review never faced it: an email to one person and a permanent
public comment on that person's own site are different acts. A maintainer running a personal site
owes us nothing, and a public post following silence can read as escalation regardless of intent.
**Partially survives — with mitigations, and a residual judgment call that is David's.**
Mitigations applied: the draft never mentions the email, never mentions the last-edited date, never
implies non-response, and is written as a standalone contribution of a fact. Residual risk: the
maintainer may still connect them. **This is the reason to bring the tension to David explicitly
rather than treat "GO to prepare" as covering it.**

**Angle 7 (NEW) — is "superseded" even the right frame? Maybe the omission is deliberate.**
Strongest angle. 0.380868 comes from an AI-assisted discovery paper; a curated repository listing a
value is not the same as the field accepting it, and a maintainer may be deliberately conservative
about machine-found bounds pending peer review. If so, "the bound is out of date" is not a
correction — it is a disagreement about editorial policy, stated publicly on his page.
**Survives only in weakened form, and it rewrote the opening line.** The draft now says the curated
repository *lists* a later value and that the two pages *disagree*; it does not assert that the
record has moved or that this page is wrong. That framing is true under either reading, which is
the test.

**Angle 8 (NEW) — should an agent-drafted comment posted by a human disclose that?**
**Survives; disclosure added.** The 8/01 deep-research found disclosed-AI + human-submitter is the
norm in this community (Archivara PR #45, the Numaro/Kleinwaks rows our own 8/01 drift pinned).
Non-disclosure would be the anomaly, and this lane's whole claim is about not making unchecked
assertions.

**Verdict: the correction SURVIVES.** Two angles changed the wording (3, 7), one added a line (8),
and one (6) surfaces a judgment that is not ours to make.

---

## 5. What goes to David

1. The exact text in §3, for his pre-send read (his 7/26 condition, unrevoked).
2. **Angle 6 as an explicit question**: the private email is nine days unanswered; posting the same
   fact publicly on the maintainer's own site is a different act. Comfortable, or wait longer?
3. **Angle 7 as context**: if the maintainer is deliberately conservative about AI-discovered
   bounds, this is an editorial disagreement, not a correction. The draft is framed to be true
   either way, but he should know that reading exists.
4. The account caveat in §2 — posting is probably not anonymous.

**Not posted. No account created. No contact made.** Re-run `npm run check` immediately before any
send: Angle 2 is a live precondition.
