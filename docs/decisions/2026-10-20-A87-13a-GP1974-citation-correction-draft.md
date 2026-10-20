# A-87 — correction to the 13a entry's [GP1974] reference (DRAFT, HELD for the paper)

Drafted 2026-10-20 (MT). **Nothing has been sent.** David said yes to drafting this on board card 5d5d4962 (bus c853b6d9-1e76-4a8a-87eb-f1bbfa6971e2, typed 14:10:03Z): draft it, run a full adversarial review, be fully certain of it, and show him the text before anything is sent; and if a paper cannot be opened, hold so that he can get it (paraphrased; his words are not quoted in this public repository).

**HELD:** the 1974 paper itself has not been opened. On 2026-10-20 at about 15:20Z, doi.org and Taylor & Francis answered 403, JSTOR served a bot-challenge page, and Semantic Scholar and the Wayback Machine answered 429. OpenAlex lists no open copy. The proposed title rests on Crossref and on a catalogue snippet of the cited volume, not on the paper's own first page. Under David's condition that is not enough, so the review waits until the paper is in hand. The orchestrator's kickoff for 2026-10-20 asks for BOTH papers to be opened, the wrongly-linked 1976 Redheffer article too. It was not reachable either (doi.org and Taylor & Francis 403, JSTOR challenge page, about 15:21Z). David's board card de2d2d07 now asks for both, saved to `tmp/papers/gerriets-poole-1974.pdf` and `tmp/papers/redheffer-1976.pdf` (never committed).

## What the entry says now

Upstream file `constants/13a.md` (the upstream path; our mirror of it is `ledger/teorth-optimizationproblems/constants/13a.md`). Upstream main's blob for that file read `a66c6eee6217c16949a868ffd89598c8749c2e29` through the GitHub API on 2026-10-20, identical to our mirror's (an upstream blob id; it is not a commit in this repo).

- Line 15, upper-bounds table: `| $0.3214$ | [G1972]|`
- Line 16, upper-bounds table: `| $0.28610$ | [GP1974]| |`
- Line 45, references: `- [G1972] Gerriets, J. *An improved solution to Moser’s worm problem.* Unpublished, 1972.`
- Line 46, references: `- [GP1974] Gerriets, J.; Poole, G. *An improved solution to Moser’s worm problem.* American Mathematical Monthly 81 (1974), no. 1, 36–41. DOI: 10.2307/2318213.`

## The two defects

1. **Title.** Line 46 gives the [G1972] entry's title word for word. The 1974 Monthly paper by Gerriets and Poole is titled "Convex Regions which Cover Arcs of Constant Length" in Crossref's record for 10.2307/2318909, and the cited volume's catalogue snippet prints the title line "CONVEX REGIONS WHICH COVER ARCS OF CONSTANT LENGTH" with the byline "JOHN GERRIETS AND GEORGE POOLE" (`continuity/depth-audit.json` entry `A-47-0089`). **To be confirmed from the paper's first page.**
2. **DOI.** `10.2307/2318213` belongs to a different article. Crossref's record for it, read 2026-10-20: R. Redheffer, "Induced Transformations of the Derivative-Vector", The American Mathematical Monthly 83(4), 255–259, 1976. The DOI system's own handle record (`https://doi.org/api/handles/10.2307/2318213`, read 2026-10-20) carries HS_ALIAS `10.1080/00029890.1976.11994090` and the URL `https://www.jstor.org/stable/2318213?origin=crossref`. The 1974 paper's DOIs: `10.2307/2318909` (handle record: HS_ALIAS `10.1080/00029890.1974.11993494`), and Crossref's primary `10.1080/00029890.1974.11993494`. Crossref gives authors Gerriets and Poole, volume 81, issue 1, pages 36–41, year 1974 for both, matching the entry's other fields.

## Recommended form: a PULL REQUEST, once the paper is read

Upstream's `CONTRIBUTING.md` asks for Markdown-only pull requests. The 46a precedent (`docs/decisions/2026-10-07-A57-46a-attribution-correction-draft.md`) went as an issue because its replacement reference had not been read. Here the replacement is the same paper's own title and DOI, so once its first page is read, a PR asserts nothing unread. **If the paper cannot be read, the fallback is an issue that reports the DOI defect (settled by the DOI system's own records) and asks the maintainers to confirm the title.**

### The change, one line

```diff
-- [GP1974] Gerriets, J.; Poole, G. *An improved solution to Moser’s worm problem.* American Mathematical Monthly 81 (1974), no. 1, 36–41. DOI: 10.2307/2318213.
+- [GP1974] Gerriets, J.; Poole, G. *Convex regions which cover arcs of constant length.* American Mathematical Monthly 81 (1974), no. 1, 36–41. DOI: 10.2307/2318909.
```

Sentence case follows the file's other reference titles (lines 45, 51 and 52). The DOI keeps the entry's existing `10.2307/` form, so only the number changes; the PR body names the primary `10.1080/` DOI too.

### The pull request, as it would be written

> **13a: fix the title and DOI of the [GP1974] reference**
>
> The [GP1974] entry in `constants/13a.md` has two errors.
>
> - Its title, "An improved solution to Moser’s worm problem", is the title of the [G1972] entry on the line above. The 1974 paper by Gerriets and Poole in the American Mathematical Monthly 81(1), 36–41, is titled "Convex regions which cover arcs of constant length".
> - Its DOI, 10.2307/2318213, resolves to a different article: R. Redheffer, "Induced transformations of the derivative-vector", American Mathematical Monthly 83(4) (1976), 255–259. The 1974 paper's DOI is 10.2307/2318909, also registered as 10.1080/00029890.1974.11993494.
>
> Authors, journal, volume, issue and pages are unchanged, since they already match the paper. The bound row citing [GP1974] is not changed.
>
> Sources: the paper's first page; Crossref's records for both DOIs; the DOI handle records at https://doi.org/api/handles/10.2307/2318213 and https://doi.org/api/handles/10.2307/2318909.
>
> AI use: prepared with the help of an AI assistant (Claude). The references were checked against the paper by [TO BE CONFIRMED BY DAVID BEFORE SENDING].

The AI-use paragraph is required by upstream's `CONTRIBUTING.md` ("AI use policy"), which also asks that the human contributor review and verify every reference. **That sentence must be true when sent: David reads the first page and the DOI records, or the sentence changes.**

## What stays out of it

- The bound 0.28610 itself. `A-47-0089` is UNRESOLVED on the value: the cited edition's snippets reached do not print 0.28610. A 1974 Mathematical Reviews entry by Chakerian includes "(.2861) L2", but its omitted text leaves open which shape that figure applies to. The PR corrects the reference only and claims nothing about the value. If the paper is read, the value check is a separate result for `A-47`.
- The [G1972] entry (unpublished, 1972). Not touched.
- Upstream PR #223 (open, last updated 2026-10-12) adds a [K2026] row and reference to `constants/13a.md` but does not touch line 46. The two are textually disjoint; this note will state a merge-tree check against #223's head before sending.

## Upstream search

- 2026-10-20: `gh search issues --repo teorth/optimizationproblems --include-prs` for "Gerriets" returned `[]`. A-47-0089 recorded the same search for "2318213" and "Gerriets" as empty on 2026-10-20 UTC. Positive control owed before sending: the same probe, run on a term that should match, returns rows.
- Open PRs mentioning 13a (`--limit 200`): #223 only.

## Before sending (owed)

1. The paper's first page read: title, byline, journal, volume, pages. If the bound 0.28610 is read too, record it on `A-47-0089` as a separate result. The Redheffer article's first page read: title, author, volume, issue, pages, matching what the DOI records say 10.2307/2318213 opens.
2. Codex refute-it review (read-only, workdir banner checked) of this file and the one-line diff, quoting David's condition verbatim from the board, with each sentence of the PR text tagged HOLDS / REFUTED-AS-WRITTEN / UNVERIFIABLE-HERE and the 0.28610 row confirmed untouched. Each finding gets a disposition.
3. A claims pass on the PR text, sentence by sentence.
4. Re-fetch upstream `constants/13a.md` at send time; confirm line 46 is unchanged and that no issue or PR has fixed it.
5. Show David the final text and get his yes.

## Review record

None yet. HELD for the paper.
