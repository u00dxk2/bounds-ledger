# A-87 — correction to the 13a entry's [GP1974] reference (SENT as PR #244)

Drafted 2026-10-20 (MT). **SENT 2026-10-20 as https://github.com/teorth/optimizationproblems/pull/244**, after David attested the three reference checks on board card 6360dbc2 (18:10:57Z); the send-time list ran first and the posted title and body were read back byte-identical to the card's final text (record on A-87). David said yes to drafting this on board card 5d5d4962 (bus c853b6d9-1e76-4a8a-87eb-f1bbfa6971e2, typed 14:10:03Z): draft it, run a full adversarial review, be fully certain of it, and show him the text before anything is sent; and if a paper cannot be opened, hold so that he can get it (paraphrased; his words are not quoted in this public repository).

**The papers could not be opened:** the 1974 paper itself has not been opened. On 2026-10-20 at about 15:20Z, doi.org and Taylor & Francis answered 403, JSTOR served a bot-challenge page, and Semantic Scholar and the Wayback Machine answered 429. OpenAlex lists no open copy. At that stage the proposed title rested on Crossref and on a catalogue snippet of the cited volume, not on the paper's own first page. Under David's first condition that was not enough, so the draft was held for the paper. The orchestrator's kickoff for 2026-10-20 asks for BOTH papers to be opened, the wrongly-linked 1976 Redheffer article too. It was not reachable either (doi.org and Taylor & Francis 403, JSTOR challenge page, about 15:21Z). David's board card de2d2d07 asked him for both.

**ROUTE CHANGED 2026-10-20 at 16:10Z:** David replied on card de2d2d07 that he cannot download them either (no account) and asked for verification from other online sources (paraphrased). The orchestrator relayed the bar: every field in the correction needs TWO independent sources that agree, each cited by URL; a field that cannot reach two stays out and is named as unverified. Neither paper's own text has been read, and the correction below claims nothing that only the paper could show.

## Field-by-field verification (read 2026-10-20, about 16:15Z to 16:25Z)

| Field the correction asserts | Sources that agree | Count |
|---|---|---|
| Title of the 1974 paper: "Convex regions which cover arcs of constant length" | Crossref record for 10.2307/2318909; MathSciNet MR0333991 (free `mrlookup`, BibTeX `TITLE = {Convex regions which cover arcs of constant length}`). Corroboration, not counted as independent records: the cited volume's catalogue snippet (title line and byline, `A-47-0089`), and the same Google Books query returns books citing the paper under this title (Croft, Falconer and Guy, *Unsolved Problems in Geometry*; Santaló, *Integral Geometry and Geometric Probability*; Brass, Moser and Pach, *Research Problems in Discrete Geometry*) | 2 |
| 10.2307/2318909 is Gerriets and Poole, Monthly 81 (1974) | Crossref; MathSciNet MR0333991 (`DOI = {10.2307/2318909}`); zbMATH 0279.52007 (API: DOI link, author codes gerriets.john and poole.george-d, Monthly vol 81, 1974). The DOI handle record agrees but is the same registration as Crossref, so it is not counted | 3 |
| Also registered as 10.1080/00029890.1974.11993494 | Crossref and the DOI handle record, one registration chain | 1: REMOVED from the PR text (Codex A-87 round 1) |
| 10.2307/2318213 is R. Redheffer, "Induced transformations of the derivative-vector", Monthly 83 (1976), no. 4, 255–259 | Crossref; MathSciNet MR0409741 (all those fields). zbMATH 0338.05007 agrees on the DOI, author, volume and year only (its licence withholds title and pages), so it is listed among the records but not cited for this sentence | 2 (3 for DOI, author, volume, year) |
| Authors, journal, volume 81, year 1974, pages 36–41 (unchanged on the line) | Crossref; MathSciNet MR0333991 | 2 |
| Issue no. 1 (unchanged on the line) | Crossref (`iss 1`); Referativnyi Zhurnal: Matematika, 1974, abstracting the paper as "Amer. Math. Mon., 1974, 81, No 1, 36-41" (Google Books volume `x6xFAQAAIAAJ`, found by the Google Books query `https://www.google.com/books/feeds/volumes?q=%22Convex+regions+which+cover+arcs+of+constant+length%22`, read about 16:35Z). MathSciNet's record carries no issue and zbMATH's API returns an empty one | 2. Asserted in the PR prose (with both sources named) and kept unchanged on the reference line |
| What the paper proves (the 0.28610 row) | not claimed | out |

The six MathSciNet, Crossref and zbMATH URLs the PR text cites were fetched at about 16:25Z and each holds its record; the Google Books search URL was added and fetched at about 17:15Z (with `max-results=20`; the default 10 results no longer included the entry) (HTTP 200 and the expected title or Zbl number in the body). zbMATH's web pages (`zbmath.org/?q=an:…`) answered 403 to a script, so the PR cites the zbMATH API query instead.

## What the entry says now

Upstream file `constants/13a.md` (the upstream path; our mirror of it is `ledger/teorth-optimizationproblems/constants/13a.md`). Upstream main's blob for that file read `a66c6eee6217c16949a868ffd89598c8749c2e29` through the GitHub API on 2026-10-20, identical to our mirror's (an upstream blob id; it is not a commit in this repo).

- Line 15, upper-bounds table: `| $0.3214$ | [G1972]|`
- Line 16, upper-bounds table: `| $0.28610$ | [GP1974]| |`
- Line 45, references: `- [G1972] Gerriets, J. *An improved solution to Moser’s worm problem.* Unpublished, 1972.`
- Line 46, references: `- [GP1974] Gerriets, J.; Poole, G. *An improved solution to Moser’s worm problem.* American Mathematical Monthly 81 (1974), no. 1, 36–41. DOI: 10.2307/2318213.`

## The two defects

1. **Title.** Line 46 gives the [G1972] entry's title word for word. The 1974 Monthly paper by Gerriets and Poole is titled "Convex Regions which Cover Arcs of Constant Length" in Crossref's record for 10.2307/2318909, and the cited volume's catalogue snippet prints the title line "CONVEX REGIONS WHICH COVER ARCS OF CONSTANT LENGTH" with the byline "JOHN GERRIETS AND GEORGE POOLE" (`continuity/depth-audit.json` entry `A-47-0089`). MathSciNet MR0333991 gives the same title independently (table above).
2. **DOI.** `10.2307/2318213` belongs to a different article. Crossref's record for it, read 2026-10-20: R. Redheffer, "Induced Transformations of the Derivative-Vector", The American Mathematical Monthly 83(4), 255–259, 1976. The DOI system's own handle record (`https://doi.org/api/handles/10.2307/2318213`, read 2026-10-20) carries HS_ALIAS `10.1080/00029890.1976.11994090` and the URL `https://www.jstor.org/stable/2318213?origin=crossref`. The 1974 paper's DOIs: `10.2307/2318909` (handle record: HS_ALIAS `10.1080/00029890.1974.11993494`), and Crossref's primary `10.1080/00029890.1974.11993494`. Crossref gives authors Gerriets and Poole, volume 81, issue 1, pages 36–41, year 1974 for both, matching the entry's other fields.

## Recommended form: a PULL REQUEST

Upstream's `CONTRIBUTING.md` asks for Markdown-only pull requests. The 46a precedent (`docs/decisions/2026-10-07-A57-46a-attribution-correction-draft.md`) went as an issue because its replacement reference had not been read and rested on one bibliographic record. Here the replacement title and DOI each rest on two or more independent bibliographic records (table above), and the PR says it relies on records, naming them. The paper's text is not needed for a title and a DOI, and nothing in the PR depends on it. The alternative, an issue asking the maintainers to confirm, remains available if David prefers it.

### The change, one line

```diff
-- [GP1974] Gerriets, J.; Poole, G. *An improved solution to Moser’s worm problem.* American Mathematical Monthly 81 (1974), no. 1, 36–41. DOI: 10.2307/2318213.
+- [GP1974] Gerriets, J.; Poole, G. *Convex regions which cover arcs of constant length.* American Mathematical Monthly 81 (1974), no. 1, 36–41. DOI: 10.2307/2318909.
```

Sentence case follows the file's other reference titles (lines 45, 51 and 52). The DOI keeps the entry's existing `10.2307/` form, so only the number changes. The PR body does not name the `10.1080/` form, which only one registration chain supports.

### The pull request, as it would be written

> **13a: fix the title and DOI of the [GP1974] reference**
>
> The [GP1974] entry in `constants/13a.md` has two errors.
>
> - Its title, "An improved solution to Moser’s worm problem", is the title of the [G1972] entry on the line above. The 1974 paper by Gerriets and Poole in the American Mathematical Monthly 81, 36–41, is titled "Convex regions which cover arcs of constant length" (MathSciNet MR0333991; Crossref).
> - Its DOI, 10.2307/2318213, belongs to a different article: R. Redheffer, "Induced transformations of the derivative-vector", American Mathematical Monthly 83 (1976), no. 4, 255–259 (MathSciNet MR0409741; Crossref). The 1974 paper's DOI is 10.2307/2318909 (MathSciNet MR0333991; zbMATH 0279.52007; Crossref).
>
> Authors, journal, volume, year and pages are unchanged; they match the MathSciNet and Crossref records. The issue number, also unchanged, matches Crossref and Referativnyi Zhurnal: Matematika (1974), which lists it as Amer. Math. Mon., 1974, vol. 81, No 1, pp. 36-41. The bound row citing [GP1974] is not changed.
>
> Records:
> - https://api.crossref.org/works/10.2307/2318909
> - https://api.crossref.org/works/10.2307/2318213
> - https://mathscinet.ams.org/mrlookup?au=Gerriets&year=1974
> - https://mathscinet.ams.org/mrlookup?au=Redheffer&year=1976
> - https://api.zbmath.org/v1/document/_search?search_string=doi%3A10.2307%2F2318909
> - https://api.zbmath.org/v1/document/_search?search_string=doi%3A10.2307%2F2318213
> - https://www.google.com/books/feeds/volumes?q=%22Convex+regions+which+cover+arcs+of+constant+length%22&max-results=20 (Google Books search; the Referativnyi Zhurnal: Matematika 1974 volume, Google Books id x6xFAQAAIAAJ)
>
> AI use: prepared with the help of an AI assistant (Claude), which compared the corrected reference and both DOIs against the records linked above. I then checked the corrected reference against those records myself.

The AI-use paragraph is required by upstream's `CONTRIBUTING.md` ("AI use policy"), which also asks that the human contributor review and verify every reference. **Its second sentence is in David's voice and must be true when sent, because upstream's policy puts the reference check on the human sender. Before saying yes, David checks the corrected line himself against the records: title, authors, journal, volume, year, pages and DOI against MathSciNet MR0333991 (or Crossref), the issue number 1 against Crossref, and that 10.2307/2318213 is Redheffer's 1976 article (MathSciNet MR0409741). His yes on the card is his statement that he did. If he would rather not check, nothing is sent, since upstream's rule cannot then be met honestly.** (Codex A-87 round 3: a sentence saying he reviewed records he had only opened was UNVERIFIABLE; the AI-use sentence was the defect in two rounds, so instead of a third rewording the shape changed: the sentence states only what his reply attests.)

**PENDING DAVID'S YES on the full final text above (it changed after his 17:02Z yes):** the AI-use paragraph now says what happened. David opened the two MathSciNet records and supplied screenshots; the lane compared them field by field (both match) and checked Crossref, so the earlier first-person sentence would have been untrue. The issue number's two sources, Crossref and Referativnyi Zhurnal: Matematika (1974), are now named in the text and its records list, on the orchestrator's instruction.

## What stays out of it

- The bound 0.28610 itself. `A-47-0089` is UNRESOLVED on the value: the cited edition's snippets reached do not print 0.28610. A 1974 Mathematical Reviews entry by Chakerian includes "(.2861) L2", but its omitted text leaves open which shape that figure applies to. The PR corrects the reference only and claims nothing about the value. If the paper is read, the value check is a separate result for `A-47`.
- The [G1972] entry (unpublished, 1972). Not touched.
- Upstream PR #223 (open, last updated 2026-10-12) adds a [K2026] row and reference to `constants/13a.md` but does not touch line 46. The two are textually disjoint; this note will state a merge-tree check against #223's head before sending.

## Upstream search

- 2026-10-20: `gh search issues --repo teorth/optimizationproblems --include-prs` for "Gerriets" returned `[]`. A-47-0089 recorded the same search for "2318213" and "Gerriets" as empty on 2026-10-20 UTC. Re-run about 16:30Z: "2318213" returned `[]`; positive control, the same probe for "13a" returned #223 and #136 ("fix: correct cross-links on C_1b and C_13a pages"), so the probe sees this repository's issues and pull requests. Re-run at send time.
- Open PRs mentioning 13a (`--limit 200`): #223 only.

## Before sending (owed)

1. ~~The papers' first pages read.~~ Replaced on David's 16:10Z reply by the two-source verification above.
2. Codex refute-it review (read-only, workdir banner checked) of this file and the one-line diff, quoting David's condition verbatim from the board, with each sentence of the PR text tagged HOLDS / REFUTED-AS-WRITTEN / UNVERIFIABLE-HERE and the 0.28610 row confirmed untouched. Each finding gets a disposition.
3. A claims pass on the PR text, sentence by sentence.
4. Re-fetch every URL in the Records list at send time and confirm each still holds its record (the Google Books search ranks results, and on 2026-10-20 the Referativnyi Zhurnal entry fell outside the default 10, which is why the link asks for 20). Re-fetch upstream `constants/13a.md` at send time; confirm line 46 is unchanged and that no issue or PR has fixed it.
5. Show David the final text and get his yes.

## Review record

**Codex A-87 round 1, 2026-10-20, read-only, banner workdir C:\dev\skylark\bounds-ledger, head af3434f confirmed. Verdict: NOT SEND-READY.** Its sandbox could not fetch any of the six records, so every finding is STATIC, and its UNVERIFIABLE-HERE tags on the title, the two DOI mappings and the unchanged fields are a fact about its environment: the lead fetched all six on 2026-10-20 (REPRODUCED; each returned HTTP 200 with the expected title or Zbl number in the body). The cross-family reviewer did not independently re-fetch them, and that is disclosed on the card. Dispositions:

1. The `10.1080/` alias rests on one registration chain: CONFIRMED, removed from the PR text.
2. Issue `no. 1` on the + line has one source: CONFIRMED. Not changed by the PR, not asserted by its prose, named on the card as single-source. Superseded in round 2: a second independent source was found.
3. The table's counts were inflated (DOI handle not independent of Crossref; catalogue snippet uncited; zbMATH cannot support Redheffer's title or pages): CONFIRMED, counts corrected and zbMATH dropped from the Redheffer sentence.
4. The AI-use sentence must cover the whole reference and David must compare, not just open: CONFIRMED, reworded to "the corrected reference, and both DOIs" (not David's words); the card lists the fields he compares.
5. The MathSciNet URLs lack `format=bibtex`: DELIBERATE, the plain lookup page is human-readable and was checked to hold the title.
6. Character-by-character: the + line differs from mirror line 46 only in the title and the DOI number (Codex, STATIC, confirmed). Line 16 (0.28610) untouched; nothing claims what either paper proves.

**Codex A-87 round 2, 2026-10-20, read-only, banner workdir C:\dev\skylark\bounds-ledger, head 42cf3bd confirmed, against the records SUPPLIED verbatim. Verdict: SEND-READY WITH CHANGES.** Every PR sentence HOLDS except the two AI-use sentences, which are process facts no record can show (the first is true of how this draft was made; the second becomes true only when David compares). Three changes, each CONFIRMED and applied: the issue no. 1 on the line had one source and the rule covers every field in the line, so a second independent source was found (Referativnyi Zhurnal: Matematika, 1974; table row); the human-review instruction now says compare, not open; and the earlier title-evidence sentence now says "at that stage" (not David's words). No new bibliographic error was found.

**Codex A-87 round 3, 2026-10-20, read-only, banner workdir C:\dev\skylark\bounds-ledger, head d1b7982 confirmed, on the full final text against the records SUPPLIED verbatim (David's two screenshots transcribed, and the Referativnyi Zhurnal snippet). Verdict: NOT SEND-READY, because human verification was not established; every bibliographic sentence and every Records line HOLDS, and the issue-number paraphrase was judged faithful.** Dispositions: (1) the sentence saying David reviewed the MathSciNet records was UNVERIFIABLE, since he opened them and asked the lane to compare: CONFIRMED. The AI-use sentence was now the defect for the second round running, so the shape changed rather than the wording: the sentence states only what David's reply attests, and the card asks him to do the check himself (checklist above) or decline, in which case nothing is sent. (2) Three surrounding sentences were stale (the issue-number table row, the fetch-time sentence, the review instruction): CONFIRMED and fixed. (3) The Google Books line now names the volume id: CONFIRMED and fixed. No fourth round: what remains is David's own check, which no reviewer can do for him.
