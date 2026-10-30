# A-86 — the reader-facing newer-papers line (draft, 2026-10-30 MT)

Status: DRAFT. It renders on public pages only after a cross-family claims pass, an adversarial review, and David's yes on a board card (`A-86`'s onTrigger).

## What a reader sees

One new entry on every constant page (`c/<id>.html`), in the page's definition list beside the existing blocks:

> **Newer papers**
> On 2026-10-30 we searched arXiv for papers submitted from 2026-10-28 to 2026-10-30 whose abstracts name AlphaEvolve, ThetaEvolve, TTT-Discover or OpenEvolve. The search found no papers. Papers that name none of these tools, and results posted anywhere but arXiv, were not searched.

When the search finds papers, the second sentence reads "The search found N papers." and nothing more. Whether any of them bears on THIS constant is a per-paper reading the store does not hold, so the line does not say. A result we checked ourselves still appears in its own block, as today (none exists at present: `ledger/newer-results.json` holds `"entries": []`).

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

(filled in as the reviews run)
