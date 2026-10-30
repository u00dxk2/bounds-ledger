# A-86 — the reader-facing newer-papers line (draft, 2026-10-30 MT)

Status: DRAFT. It renders on public pages only after a cross-family claims pass, an adversarial review, and David's yes on a board card (`A-86`'s onTrigger).

## What a reader sees

One new entry on every constant page (`c/<id>.html`), in the page's definition list beside the existing blocks:

> **Newer papers**
> On 2026-10-30 we ran one search for all the constants on this site's main list, not this one alone: arXiv papers submitted from 2026-10-28 to 2026-10-30 that matched an abstract search for AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve. It found no papers. We searched no source other than arXiv, and papers matching none of these names were outside the search.

(This is the text after Codex claims passes 1 and 2. The first draft read "we searched arXiv for papers … whose abstracts name …" and "Papers that name none of these tools, and results posted anywhere but arXiv, were not searched." Round 1's text said "every constant on this site", and round 2 refuted that, because the small Ramsey numbers page is a separate area with its own search.)

When the search finds papers, the second sentence reads "It found N papers." and nothing more. Whether any of them bears on THIS constant is a per-paper reading the store does not hold, so the line does not say. A result we checked ourselves still appears in its own block, as today (none exists at present: `ledger/newer-results.json` holds `"entries": []`).

Every value in the line comes from a store field, never from the renderer or a clock:

| In the line | Store field (new unless noted) |
|---|---|
| "On 2026-10-30", "to 2026-10-30" | `checkedThrough` (exists) |
| "from 2026-10-28" | `windowFrom` |
| "AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve" | `tools` (array) |
| "found no papers" / "found N papers" | `papersFound` |

The line renders only when all three new fields are present and valid, so the code can ship with the store unchanged and nothing on any page moves. The data write that turns it on happens after David's yes.

## Why it is worded this way

- **Not "checked through <date>".** The 2026-10-16 claims pass (recorded in `scripts/newer-results.mjs`, the comment above `newerBlock`'s return) found that "checked through" over-reads as complete coverage. The manager review on 2026-10-30 raised the same trap: the scope has to sit beside the date.
- **The window is stated, not implied.** The watcher's window opens at the mirror's fetch date (`scripts/arxiv-watch.mjs`, `--area constants`). The 2026-10-16 run covered 2026-09-26 to 2026-10-16. Today's run covers 2026-10-28 to 2026-10-30. Nothing searched 2026-10-17 to 2026-10-27, so a line saying "since September" would be false.
- **Not "since this table was copied".** A later resnap moves the mirror date while the store keeps its old window, and the sentence would silently become false.
- **The exclusions are said in the same breath.** Most human-written work on these constants names none of the four tools, and 1a's smallest listed upper bound cites a repository, not a paper (the watcher's own blindTo).

## Evidence for today's values

`node scripts/arxiv-watch.mjs --fetch --area constants` (2026-10-30): "window: submitted 2026-10-28 to 2026-10-30 … RESULT: FETCHED — 0 paper(s)". `node scripts/arxiv-watch.mjs --check --area constants`: "papers fetched: 0 · verdicts: 0 · every fetched id has exactly one verdict … parts reconcile: 0 + 0 + 0 = 0 … RESULT: COMPLETE — no candidate (exit 0)". Positive control: the same query's 2026-10-16 run returned papers, including the three 1b candidates recorded on `A-82`.

## Review record

**Codex round 1** (cross-family; read-only; one run doing the claims pass and the code review, on `6600c0a`; the banner workdir matched). Clause results: "On 2026-10-30 we searched arXiv" HOLDS. "Submitted from 2026-10-28 to 2026-10-30" HOLDS (the watcher filters on submittedDate, inclusive UTC dates). "The search found no papers" HOLDS. "Whose abstracts name …" UNVERIFIABLE-HERE. "Results posted anywhere but arXiv … were not searched" REFUTED-AS-WRITTEN. Findings and fates:

1. MED, wording: "name" claims more about arXiv's matching than this repo can show. CONFIRMED; the text now says "matched an abstract search for".
2. MED, wording: on every constant page, the count reads as being about that constant. CONFIRMED; the text now says "one search for every constant on this site, not this one alone".
3. LOW, wording: a result posted both on arXiv and elsewhere is not outside the search. CONFIRMED; the text now says "We searched no source other than arXiv".
4. HIGH, code: the validator checked shapes only. Codex reproduced a store with `2026-99-99`, an invented tool and 42 papers that validated and rendered. CONFIRMED for the dates and the tools. Dates must now be real calendar dates, and `tools` must equal the watcher's own query terms in order, read from its exported query. A changed query therefore refuses a stale store. DELIBERATE for `papersFound`: it is a reviewed data write, because the run's `papers.json` is never committed (a candidate is an unverified claim about someone else's paper).
5. MED, code: no test tied `tools` to the query. Fixed by the binding in 4. Red-armed: removing the binding fails the mismatch case.
6. MED, code: the wiring check only exercised pages with an entry. CONFIRMED; the guard now also renders a page with no entry. Red-armed: rendering the line only on 1b fails on 1a.
7. LOW, code: nothing checked placement inside `<dl>`. CONFIRMED; checked now. Red-armed: the line placed after `</dl>` fails on both pages.

**Codex round 2** (same reviewer family; read-only; on `3ef254b`; the banner workdir matched). Every clause HOLDS except "every constant on this site", which is REFUTED-AS-WRITTEN. Findings and fates. Two of them land on guards round 1 had just patched, so the fix changes the guard's shape instead of adding a third patch:

1. HIGH, wording: "every constant on this site" includes the small Ramsey numbers page, which this search does not cover (`ramsey.html` is a separate watched area with a different query). CONFIRMED; the text now says "all the constants on this site's main list".
2. MED, code: reading the query's terms discarded its Boolean structure, so an AND query validated the old store and the line would have said "or". This is the second finding on the tools binding. New shape: a stated rule whose failure is a refusal. The query must be exactly `(abs:T OR abs:T …)`, and any other shape yields no terms, so a store carrying the search is refused. Red-armed: loosening the rule fails the shape case (AND, mixed, NOT, trailing text).
3. MED, code: the guard checked one page with no entry, which is a sample. This is the second finding on the wiring guard, so it now checks the whole population, every page. Red-armed: rendering the line only on 1b and 1a fails on all 118 other pages.
4. LOW, code: hiding the line in a `<template>` inside the `<dl>` would pass. DELIBERATE: that takes a hostile renderer edit. The guard claims position only, and its comment says so.
