# Copy — first screen and search flow (design pass, 2026-11-17 MT)

Draft replacements for copy on the index page. None of it is on the page. `{N}` is the entry count,
filled in by the renderer (120 in the checkout on 2026-11-17). Product facts used here are on the
Known list in `docs/PRODUCT.md`.

## Review status, stated plainly

Two read-only review rounds by a reviewer from another model family both returned FIX FIRST.
Round 1 refuted nine of the thirteen visitor sentences: the draft had turned a lookup in a published
snapshot into a verdict on a number. Round 2 held seven of thirteen and refuted three for one
remaining fault: promising a change date on rows that carry only the date tracking began. Round 3
held eleven of thirteen and refuted headlines 3 and 4 for promising a date where the page can show
"date unknown". The sentences below adopt that reviewer's narrower wording each time. **Headlines
3 and 4 have not been reviewed since the last edit, and no round has returned a clean verdict.**
Every sentence gets a fresh claims pass before a visitor reads it.

## Headlines: five written, three kept

Each was put to four tests. Does a stranger who reads only this line know what the thing is? Can
they picture it? Could it be proven false? Could another site say the same?

| # | Headline | Verdict |
|---|---|---|
| 1 | Is the number you cited still current? | Dropped as a headline. A stranger cannot tell which number or what answers, and a question cannot be proven false. It is the page's title and heading today. |
| 2 | Search for a bound to find matching entries. Each entry shows the last-listed rows in its mirrored tables and, where available, when their pins changed or tracking began. | **Kept.** Accurate and long; a variant may set the first sentence as the headline and the second beneath it. |
| 3 | {N} mathematical constants with last-listed bounds rows and, where available, dates for pin changes or the start of tracking. | **Kept**, with a doubt: the round 1 reviewer judged that another monitoring page could say much the same. |
| 4 | A ledger of {N} mathematical constants showing the last-listed bounds rows and, where available, when their pins changed or tracking began. | **Kept**, with the same doubt. |
| 5 | Never cite a stale bound again. | Dropped. Any reference tool could say it, and the ledger cannot keep the promise. |

Which of the three leads a variant is settled by the blind pick, not here.

## Subhead (two sentences, how it works)

> A job scheduled daily compares this ledger's copy with the upstream files in
> teorth/optimizationproblems and tests that each pinned row's text is still there. When the ledger
> can classify a change to pinned text, the label gives its type and date; when history shows only
> the initial pin, the label says "no movement seen yet".

## Call to action

The next step is the search field itself. The list filters as the reader types.

- Field label: **Look up a bound you are about to cite**
- Placeholder: `Type a name, an id, or a bound value`
- A proposed secondary control under the field: **Browse all {N} constants**. It does not exist
  yet. The build has to make it clear the search, and until it does this line is a proposal.

## Empty state, rewritten

The rewrite says what happened, why, and the next step, with retrying ahead of reporting:

> **No entries match this search.**
> Search covers each constant's name, its id and its bound text. Some older values and alternate
> spellings also match. The index search does not index reference or comment columns.
> Try the constant's listed name or id, or clear the search to see every entry. No match tells you
> only that the search found no entry.
> Small Ramsey numbers are on their own page.
> **Tell us what you were looking for** (opens a GitHub issue draft carrying your search term;
> submitted issues are public).

A fault on the page today, found by the round 2 review and not fixed by this draft: that issue
draft is pre-titled "Constant not tracked", which a search that found nothing cannot support. The
build should retitle it to describe the search.

## Error state, rewritten

This rewrite covers a failed automatic copy from the Copy citation button.

> **Couldn't copy automatically.** The citation is selected below. Use your Copy command.

No cause is named: the page's handler does not keep one. No humour, and never the word "Copied"
unless the browser confirmed the copy.

## Success state

> Copied

One word, as the page says today.

## Sentences a visitor would newly read (for the claims pass)

1. Search for a bound to find matching entries. Each entry shows the last-listed rows in its
   mirrored tables and, where available, when their pins changed or tracking began.
2. {N} mathematical constants with last-listed bounds rows and, where available, dates for pin
   changes or the start of tracking.
3. A ledger of {N} mathematical constants showing the last-listed bounds rows and, where available,
   when their pins changed or tracking began.
4. A job scheduled daily compares this ledger's copy with the upstream files in
   teorth/optimizationproblems and tests that each pinned row's text is still there.
5. When the ledger can classify a change to pinned text, the label gives its type and date; when
   history shows only the initial pin, the label says "no movement seen yet".
6. Look up a bound you are about to cite
7. Browse all {N} constants (proposed control; unbuilt)
8. No entries match this search.
9. Search covers each constant's name, its id and its bound text. Some older values and alternate
   spellings also match.
10. The index search does not index reference or comment columns.
11. Try the constant's listed name or id, or clear the search to see every entry. No match tells you
    only that the search found no entry.
12. Tell us what you were looking for (opens a GitHub issue draft carrying your search term;
    submitted issues are public).
13. Couldn't copy automatically. The citation is selected below. Use your Copy command.
