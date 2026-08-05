# First PR package — `constants/15a.md` citation keys (teorth/optimizationproblems)

**Date:** 2026-08-05 (MT)
**Item:** A-13 (launch critical path — the correction-shaped PR channel; target approved by the orchestrator today)
**Status:** **DRAFTED AND ADVERSARIALLY REVIEWED. NOTHING SENT.** No fork, no branch, no PR, no account
action. This is outward contact and requires **David's explicit approval** — and, uniquely here, his
actual verification of the references (see Angle 7).

**Verdict: SURVIVES, with the severity claim narrowed and one precondition.**

---

## The change

**One file. Six lines. Five citation keys. No bound, value, attribution, or mathematical claim is touched.**

`constants/15a.md` (the matrix multiplication exponent ω) cites five keys in its bounds table and prose
that its own `## References` section does not define. Each has a near-identical definition under a
different key, so nothing is missing — the two halves of the page disagree about the spelling.

| Line | Current | Proposed | Why this direction |
|------|---------|----------|--------------------|
| 53 (ref) | `[BCRL79]` | `[BCRL1979]` | **Reference is the outlier.** It is the only two-digit year among 30 keys on a page that otherwise uses four digits throughout. |
| 24 (prose) | `[L2014]` | `[LG2014]` | Table is the outlier. The page uses `LG` for Le Gall (`LG2014`, `LG2017`), and `L2017` is already **Landsberg** — so `L2014` actively collides. |
| 27 (table) | `[L2014]` | `[LG2014]` | Same. This row is Le Gall's ISSAC 2014 bound (2.3728639). |
| 29 (table) | `[DWZ23]` | `[DWZ2022]` | Table is the outlier on two counts: two-digit year, and it uses the FOCS year where the reference uses the arXiv year (`arXiv:2210.10173`). |
| 30 (table) | `[WXXZ24]` | `[VXXZ2023]` | Table is the outlier. The page uses `V` for Vassilevska Williams (`V2012`, `V2012a`, `V2014`), not `W`. |
| 31 (table) | `[ADWXXZ25]` | `[ADVXXZ2024]` | Same `V`-not-`W` convention, same two-digit-year issue. |

**Four of five fixes change the table; one changes the reference list.** That asymmetry is the whole
review job — a patch that pushed all five one direction would be wrong in at least one place, and it is
precisely the kind of thing a bulk pass flattens.

**No README change is needed**, and this was checked rather than assumed: none of the seven affected
key strings appears in upstream `README.md`. CONTRIBUTING names "improves a bound but leaves the README
showing the old value" as *the most common defect in submissions here* — that rule is about **bounds**,
and we change no bound.

---

## Adversarial refute-it review

Eight angles. Five carried over from the 2026-07-24 and 2026-08-02 reviews, three new because the venue
is a code PR rather than a message.

### Angle 1 — Is the defect real, and present right now?
**Survives.** Verified by fetching live `raw.githubusercontent.com` at HEAD, not by reading our mirror:
upstream HEAD is `dee1660`, our mirror is `dee1660`, and this morning's `reverify --check` reported no
drift — so mirror and upstream are the same bytes. All five pairs confirmed in the live file. Also
confirmed on the **rendered** page (`teorth.github.io/.../15a.html`, HTTP 200).

### Angle 2 — Is it already fixed, or in flight?
**Survives.** Open PRs enumerated: only **#140** (`constants/3a.md` + README) and **#128** (README only).
**Nothing open touches `15a.md`.** This is the angle that killed the previous target set — #129/#130/#135
merged hours before we would have replayed them — so it was checked first and must be **re-checked
immediately before any send**.

### Angle 3 — Could the direction of fix be wrong?
**Survives, but this is the weakest angle and it is a judgment.** The argument rests on the page's own
internal convention (29 of 30 keys use four-digit years; `LG` for Le Gall; `V` for Vassilevska Williams),
plus one hard fact that is not merely stylistic: `L2014` collides with `L2017` = Landsberg, so leaving
the table's spelling would make two different authors share an initial on one page.

The maintainer may still prefer the reverse mapping — changing five reference keys instead. **The PR text
says so explicitly and offers it**, rather than presenting one direction as the only correct answer. The
change is trivially reversible either way.

### Angle 4 — The method sentence: what exactly are we claiming? *(the standing rule — audit the method, not just the claim)*
**Survives only after a narrowing, and this angle changed the wording.** The draft originally said the
keys were "broken" — which implies dead links. **They are not links.** The rendered page shows citation
keys as plain text in both the table cells and the `<li>` reference entries; nothing is a hyperlink and
nothing 404s. This was checked by fetching the rendered HTML, not inferred from the markdown.

The honest claim is narrower: **a reader cannot resolve these citations against the page's own reference
list.** That is the claim the PR makes, and no stronger one. Had I not fetched the HTML I would have
written "broken citation links" and been wrong in the first sentence of our first PR.

### Angle 5 — Does this class of contribution fit the repo's scope?
**Survives.** CONTRIBUTING documents only two paths — "Adding a New Constant" and "Updating Existing
Bounds" — and **neither covers an editorial fix**, so the doc alone does not authorise this. Practice
does: `git log` on this exact file shows `fc933d8` (2026-06-24, *"fix: escape inline subscripts on
matrix multiplication exponent page"*) merged, plus repo-wide `d2173be` (typos and clarity) and
`bb73a16` (LaTeX formatting). The repo merges editorial corrections, including to `15a.md` specifically.

This matters because the acceptance hierarchy puts **scope-and-literature fit first** — PR #72 was
rejected solely for insufficient literature despite shipping certificates. A citation-key fix carries
**zero literature risk**, because it advances no mathematical claim at all.

### Angle 6 — Does the PR overstate its own importance?
**Survives after a trim.** This is a small fix on a page whose bounds are all correct. The PR must not
imply the page is unreliable, and must not read as an audit of the maintainers' work. One paragraph,
a table of the six lines, the direction rationale, done.

**Deliberately omitted:** the page's own note that *"ChatGPT DeepResearch was used to prepare an initial
version of this page"* — which is very likely how the two key spellings diverged. Saying so adds nothing
mechanical and reads as a jab at a disclosure the maintainers made honestly and were not obliged to make.

### Angle 7 — AI disclosure, and a requirement most PRs do not carry *(new)*
**Survives, and it constrains David rather than us.** CONTRIBUTING's AI policy: use is permitted *"so
long as this is noted in the submission text, and that all references and other information provided by
the AI are reviewed and verified by the human contributor."*

So the disclosure line is mandatory — and so is **David's own verification**. This is not a
send-and-forget gate: the repo's stated condition is that the human contributor has checked the references. The six
proposed lines are individually checkable in about two minutes against the page itself, and the PR body
lists them explicitly so that check is cheap. **This must not be sent on our say-so alone.**

### Angle 8 — Is a first contact here worth spending at all? *(new)*
**Survives.** The north-star metric (an externally-acknowledged correction) is 0 and rests entirely on
one unanswered email. A merged PR is public, dated, attributable, and cannot be silently ignored into
ambiguity — the property the email channel lacks. The downside risk is small and bounded: if rejected,
the cost is one polite decline on a trivial patch, not a damaged relationship.

### Angle 9 — What did we NOT verify? *(new — the limits, stated so they cannot be implied away)*
- **No bound, value, or attribution was checked.** We do not assert any number on this page is right or
  wrong.
- **`[P1979]` at line 15 lists 2.6054, better than the 2.7802 listed for `[P1980]` a row later.** We did
  **not** investigate this and make **no claim** about it. CONTRIBUTING states the tables are
  *"histories, not just leaderboards"* and that *"superseded rows are kept, including bounds that are
  inferior to ones already recorded"* — so non-monotone ordering is explicitly normal here and is not a
  defect. Flagged only so a future session does not "discover" it and file a false finding.
- **`[LSXKKMC26]` in `10a.md` and the four other files' key mismatches are out of scope** for this PR by
  choice — one file, first contact, per the acceptance hierarchy.

---

## The submission text, verbatim as it would be sent

> **Title:** Fix five citation keys in `15a.md` that do not match the page's reference list
>
> The bounds table and comments on the matrix multiplication exponent page cite five keys that the
> page's own `## References` section does not define. Each has a near-identical entry under a different
> key, so no reference is missing — the table and the reference list just spell five of them
> differently, and a reader following a citation does not find it.
>
> | Line | Currently | Changed to |
> |---|---|---|
> | 53 (reference) | `[BCRL79]` | `[BCRL1979]` |
> | 24 (comment) | `[L2014]` | `[LG2014]` |
> | 27 (table) | `[L2014]` | `[LG2014]` |
> | 29 (table) | `[DWZ23]` | `[DWZ2022]` |
> | 30 (table) | `[WXXZ24]` | `[VXXZ2023]` |
> | 31 (table) | `[ADWXXZ25]` | `[ADVXXZ2024]` |
>
> I have changed the table in four cases and the reference in one, following the page's existing
> convention: keys use four-digit years (`BCRL79` is the only two-digit one of the thirty on the page),
> Le Gall is `LG` (`LG2014`, `LG2017`), and Vassilevska Williams is `V` (`V2012`, `V2012a`, `V2014`).
> `L2014` also collides with `L2017`, which is Landsberg. If you would rather keep the table spellings
> and change the five reference keys instead, I am happy to redo it that way.
>
> No bound, value, attribution, or reference target is changed, and no README cell is affected (none of
> these keys appears in README.md).
>
> *AI disclosure: an AI assistant was used to find these mismatches and prepare this patch. The
> references and proposed keys have been reviewed and verified by me.*

**Note on the last line:** it is written in David's voice because he is the contributor. It is only true
once he has actually done that check — see Angle 7. If he has not, the line must be changed or the PR
must not go.

## The precondition

**Re-run the target scan and re-check open PRs immediately before sending.** Upstream pushes near-daily
and the previous three candidates went stale inside a single day. A clean check today is not evidence
about tomorrow.

## What is owed, and by whom

1. **Us:** nothing further. Package is complete and reviewed.
2. **David:** the outward-send decision, **and** the reference verification that CONTRIBUTING requires of
   the human contributor. The submission would go out under his name and his GitHub account.

We hold **no recommendation on whether to send** beyond the review verdict above — the gate is his, as
it was for the 24 July email.
