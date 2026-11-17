# DESIGN.md — Bounds Ledger

Written 2026-11-17 (MT) for the design and copy pass. It sets the art direction and the tokens for
the first screen of the index page and its search flow. It is a brief: none of its new treatments is
built or live. `docs/PRODUCT.md` is its companion and governs every sentence of copy.

**Not changed by this pass:** the product name, the favicon, the brand colour, the page's
navigation and structure, the generated pins, the citation text and its caveat, and the guards
against the page fetching anything. The draft copy does reword what the first screen says, so
every new sentence gets its own claims review before a visitor reads it.

## Art direction: taken from the subject

Five worlds native to this subject:

1. **A printed handbook of mathematical tables**, with dated errata slips pasted beside the
   entries that have been corrected.
2. A bookkeeper's ledger: ruled columns, dated postings, a double rule under a total.
3. An observatory's daily log: one reading per day, and "no change observed" written out.
4. A library card catalogue: one card per constant, with date stamps.
5. A standards laboratory's calibration certificate: the value, what it was compared against, when.

**Chosen: the handbook of tables with its errata slips.** The design assumes a reader arriving with a number
from a survey, an index or a paper, so the page should look like the place numbers are kept. The errata slip is the product in
one object: a dated note fixed to an entry, saying what changed. Three states must never look
alike: a recorded edit, a row tracked since a date with no movement seen, and a date the ledger
does not have. The bookkeeper's ledger was the obvious pick from the name and was passed over,
because it is a finance picture and this is a mathematics reference.

## Colour

- **Brand accent:** `#0b5fff` (dark scheme `#7aa2ff`), unchanged. It is the **only saturated
  colour**, and it appears on at most one primary action per view. On the first screen that is the
  search field.
- **Neutrals are tinted toward the brand hue** (cool, about 220 degrees): paper `#fbfcfe`, ink
  `#14181f`, muted ink `#566072`, rule `#dde2ea`, block tint `#f2f5fa`. The dark scheme keeps the
  page's existing values, which are already cool.
- Links other than the primary action are ink with an underline, never accent.
- A slip is told apart by weight and rule, never by a second colour: a "value changed" slip is ink
  on paper with a solid rule; a "no movement seen yet" line is muted ink with no rule.
- The search highlight keeps its present yellow mark. It is a marker, not an accent, and it is the
  one exception to the single-saturated-colour rule.
- The build must preserve AA contrast in both schemes, measured on every actual pairing and state.
  Nothing here is a measured result.

## Type

Two families for reading, three weights, and one functional exception that makes a third.

- **Display: a book serif from the faces already on the reader's device**
  (`"Palatino Linotype", Palatino, "Iowan Old Style", "Book Antiqua", Georgia, serif`), at 400 and
  700. Reason: the handbook treatment wants a book face, and this stack asks for Palatino first.
  Installed faces vary by device, so the first build tests the fallbacks and the phone rendering.
  Used for the headline, constant names and the bound values.
- **Text: the system interface face** (the page's current stack), at 400 and 600. Reason: it is
  what the page reads in today and it needs no font file.
- **No font file is loaded. This departs from the pass brief, which asks for self-hosted, subset
  fonts, and it needs a decision.** The index page's self-test rejects any `url(` or `@import` in
  its stylesheet, as one of its guards against the page fetching anything. A self-hosted face
  loaded through `@font-face` would fail that guard. Changing the guard is a decision for the
  repository's owner and is not made here.
- **The exception, which is a third family:** the proposed design limits the system monospace
  face to the "exact pinned row" and citation blocks, where a reader compares strings character by
  character. Today the page also sets constant ids and the snapshot commit in it.
- Body text is 16px or larger. Sizes: 14, 16, 20, 26, 34, 44 (each step at least 25% above the
  last, apart from 14 to 16, where 14 is used for secondary lines only).

## Space, shape, depth, motion

- **Spacing scale (px):** 4, 6, 8, 12, 16, 24, 32, 48, 72. Each step is at least 25% above the one
  before it.
- **One radius:** 2px. Printed tables and paper slips have square corners; 2px keeps the edge from
  looking broken on screen.
- **One shadow:** `0 1px 2px rgb(20 30 60 / 0.08)`, on the search field only.
- **Rules:** a hairline between entries, and a double rule under the table head, as in a printed
  table.
- **One motion signature, "the slip settles":** when a search answer or a matched entry appears, it
  fades in and moves 4px into place over 160ms. Nothing else moves. Under
  `prefers-reduced-motion` there is no fade and no movement.
- **Density:** dense and tabular on a desktop screen; one card per constant on a phone, as today.
- **Images:** none. Rules, slips and type only. The sigma favicon stays.

## The tells, and which ones this design keeps

Avoided: gradients and gradient text; a centred hero over icon cards; emoji as icons; a cream
background with a fashionable serif and a sage or terracotta accent; an italic accent word in the
headline; a badge above the headline; a statistics banner.

Kept or removed, each with its reason:

- **Monospace** is proposed only for exact pinned strings and the citation block (reason above).
- **Uppercase tracked column labels** are on the page today. They go, replaced by sentence-case
  table heads in the text face at 600.
- **A serif headline on a pale page** is close to one of the tells the pass brief lists. It is
  kept because the subject is a printed table, the paper is cool white, not cream, and the only
  accent is the existing blue.

## Three composition families for the build

The three first-screen variants come from different families, never three colourings of one layout:

1. **One dominant object:** the search field as the whole first screen, with the instruction as the
   headline.
2. **An editorial column:** a single dated catch told in a narrow column (a number that was cited,
   the day it changed), then the search.
3. **A working demonstration:** one real entry shown as the handbook prints it, slips and all,
   with the search above it.

**Existing quirks kept:** the question in the page title; the caveat that travels inside every
citation; the per-entry "looks wrong?" link.

## The flag, and why it is a build argument

Every push to this repository's main branch publishes the site, so a switch inside the published
page would itself be a change a visitor could reach. The proposal is a renderer mode that writes
variants to a scratch folder only. **It does not exist yet.** It has to be built to fail closed,
because today an argument the renderer does not recognise can fall through to writing
`index.html`. The default render and the committed `index.html` stay byte-identical until a variant
is picked. Rollback after a variant is published is a separate step, a revert of that commit, and
is specified when a variant is chosen.

## Registry row

| lane | subject world | display face | text face | neutral temperature | radius | density | motion signature | image vocabulary |
|---|---|---|---|---|---|---|---|---|
| bounds-ledger | printed handbook of mathematical tables, with errata slips | Palatino (device faces, no font file) | system interface face | cool, tinted to the brand blue | 2px | dense, tabular | "the slip settles": 160ms fade and 4px move | none: hairline and double rules, paper slips |
