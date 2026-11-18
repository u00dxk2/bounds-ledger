# Copy — first screen and search flow (design pass, 2026-11-17 MT)

The copy of the picked first screen (variant c, the table set as a handbook page), as
`scripts/render-site.mjs` renders it in its "handbook" mode. `{N}` is the entry count, counted from
the rendered rows (120 in the checkout on 2026-11-17). Product facts used here are on the Known
list in `docs/PRODUCT.md`.

**Trimmed at the rollout (round 3, overnight 2026-11-17).** This file used to hold the pass's
drafts: five headlines, a subhead, and rewrites of states the picked variant does not change. The
drafts the owner did not pick are removed, so nothing unpicked stays in the served tree. The
earlier version is in this repository's history.

## Review status

The design pass's claims rounds (read-only, from another model family) returned SHIP on these
sentences after their last edit, and the rollout's own claims pass re-checked each one against the
current code before the page change.

## The sentences a visitor reads

1. Masthead: **Bounds Ledger**
2. Headline: {N} mathematical constants with last-listed bounds rows and, where available, dates for
   pin changes or the start of tracking.
3. Field label: **Look up a bound you are about to cite**
4. Placeholder: `Type a name, an id, or a bound value`
5. Control under the field: **Browse all {N} constants** (it empties the search and shows every
   entry; it appears only when the page's script runs).
6. Empty state:
   > **No entries match this search.**
   > This page lists the constants mirrored from teorth/optimizationproblems. Search matches listed
   > names, ids, pinned value text, and digit-bearing value text extracted from the mirror, so a
   > match can come from a row higher in a constant's table or from a value pinned earlier, and part
   > of a number is enough. Some alternate spellings also match. The index search does not index
   > reference or comment columns.
   > Try the constant's listed name or id, or clear the search to see every entry. No match tells
   > you only that the search found no entry.
   > Small Ramsey numbers are on their own page.
   > **Tell us what you were looking for** (opens a GitHub issue draft carrying your search term;
   > submitted issues are public).

## Known gap

The issue draft the empty state opens is still titled "Constant not tracked: …", which a search that
found nothing cannot support. It is left alone because the outside-arrival counter
(`scripts/report-rate.mjs`) classifies issues by that title prefix; the change is row `A-109`.
