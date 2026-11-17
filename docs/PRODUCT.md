# PRODUCT.md — Bounds Ledger

Written 2026-11-17 (MT) for the design and copy pass. It is the brief a designer or copywriter
works from. Every product fact in page copy must be on the **Known** list below; anything on the
**Unknown** list is never written as fact. The fuller account of the reader and the problem is
`docs/evangelism-bar.md`; this file does not replace it.

## Who it is for, and the job it does

This is who the page is designed for. It is a design hypothesis: no real reader has been observed
(`docs/evangelism-bar.md`).

A mathematician, graduate student or referee who already has a bound or a constant to cite, in a
paper, a talk or a review. They got it from a survey, an index page or an earlier paper, and they
do not know whether it has moved since.

The job: **find the entries that match what the reader types, show what has changed in each
entry's published pins and when, and provide a citation that carries its own provenance.** It is a
lookup in a published snapshot. It does not judge the reader's number, and it does not search for
better bounds.

## The bad alternative people use today

Also hypotheses:

- Retrace the number's sources by hand.
- Rely on an index page's edit date, which does not by itself establish that the number was
  re-checked.
- Learn of a discrepancy during review.

## Voice

Three traits:

1. **Exact.** Dates, ids and counts, each with what it measures. "Tracked since 2026-07-24, no
   movement seen yet" and never "up to date".
2. **Plain.** Short declarative sentences. No superlatives, no "best", no urgency.
3. **Checkable.** A claim points at the thing the reader can open or run to test it.

One tone rule for each state:

- **Error:** say what failed, what was therefore not done, and the next step. Never humour. Never a
  word that implies the action succeeded.
- **Empty:** say what the search covers, and that no match is not a verdict on the number. Offer
  browsing and retrying before reporting.
- **Success:** state the fact once, quietly ("Copied"). Never celebrate, and never upgrade "no
  movement seen" into "current" or "correct".

## Anti-references (what this must NOT resemble)

1. **A software product landing page:** a centred hero over feature cards, a sign-up button, a row
   of statistics. This is a reference work, and nobody signs up for anything.
2. **A leaderboard or record scoreboard:** ranked rows, medals, "current record" banners. The
   generated pins on this page assert a listing position, not a rank.
3. **A service status page:** rows of green ticks and "all systems operational". Here "not read"
   is never shown as a pass, and a page of green ticks would say the opposite.

## Known (may be written as fact; each line names where to read it)

Figures carry an as-of date. Read the source again before printing one.

- The index page lists one entry per watched constant: **120 as of 2026-11-17** (the page's own
  count line; `grep -c '<tr id=' index.html`). The count comes from the rendered pins, so page copy
  takes it from the renderer and never from a typed number.
- The constants are mirrored from the public repository `teorth/optimizationproblems`. The mirror
  stores the adopted upstream files as text, with line endings normalised, at a recorded commit
  (`ledger/teorth-optimizationproblems/manifest.json`, `scripts/reverify.mjs`).
- A job is scheduled daily. It compares the mirror with upstream's files and tests that each pinned
  row's text is still present in its source file (`.github/workflows/reverify.yml`,
  `scripts/check-claims.mjs`). The index links its run history. "Scheduled daily" is the claim, not "verified
  every day": a required source that cannot be read fails the run. For the pins on the index, this
  compares with upstream's files, not with the papers they cite.
- For each constant the page displays each available **last-listed** pin, the upper-bound row and
  the lower-bound row of its table, and simplifies some inline anchors for display. Last-listed is a position in the table. It is not a statement about which
  bound is the strongest or the newest.
- Each shown row carries a label giving the type and date of the last change the ledger classified
  in its pinned text, or saying it has been tracked since a date with no movement seen yet. A label
  can also say "date unknown", or "last changed" with a date and no type. The code is the authority
  on label states (`scripts/lookup.mjs`); this line is a summary. Labels describe published pins, never a fresh check, and they do not
  show the edit itself. Vocabulary in the checkout on 2026-11-17: "tracked since", "value changed",
  "text edited", "bound cell edited" (`scripts/render-site.mjs`, `scripts/lookup.mjs`). "Value
  changed" means the set of number tokens in the bound cell differs, counting repeats; it does not
  say the bound improved.
- A label's date comes from the ledger's own pin history: the day the pin last changed, or the day
  tracking began. It is not the day a result was proved or published.
- Search filters as the reader types, with no submit button. It matches a constant's name, its id
  and its bound text; some older values and alternate spellings also match. It does not index the
  reference or comment columns. One typed value can match many entries.
- When nothing matches, the page shows an empty state with a link that opens a GitHub issue draft
  carrying the search term. A submitted issue is public. Clearing the search shows every entry
  again. `27b` is one id that matches exactly one entry.
- Each entry links to upstream's file for that constant, to the constant's own page
  (`c/<id>.html`), and to a pre-filled "looks wrong?" report. A "cite" control opens a citation block in
  place, with a Copy citation button.
- The citation block carries the constant's name and id, the bound-cell text of each available pinned row,
  the short upstream commit, the listing-position caveat and the constant page's address.
- The Copy citation button says "Copied" only when the browser confirms the copy. Otherwise the
  citation is selected and the page says so (`scripts/lib/html.mjs`).
- Some rows have a recorded reading against cited material (the cited source, or a reachable copy
  or edition of it). The constant's page names the row, the material and the result. This is not
  proof verification (`node scripts/depth-audit.mjs`).
- Small Ramsey numbers are watched on a separate page (`ramsey.html`).
- The page needs no account and has no analytics. Its self-test guards against loading a
  third-party asset or fetching at runtime (`node scripts/render-site.mjs --selftest`); those are
  guards, not a proof against every route.
- The repository is public, and its core checks can be run from a clone (`README.md`).
- The page's main heading today is the question "Is the number you cited still current?", and its
  browser title carries that question after the product name.

## Unknown — do not invent

- How many people read the page, or whether anyone does. The page has no analytics, and this
  repository's own account is that the host gives it no request log. Never write a reader count, a "trusted by", or a testimonial.
- Whether any outside reader has acted on a label. None is documented in this repository.
- Which bound is "the record", "the best known" or "current". The generated pins do not rank, so
  page copy never says so, including by implication ("latest", "state of the art").
- Whether a number is **correct**. An unchanged row is unchanged; it has not thereby been checked
  against its paper. A row with no reading shown is not thereby unread, and a reading is not a
  proof check.
- Whether a search that finds nothing means the constant is not watched. It does not establish that.
- When a reader last retrieved a page. The page is static, so it never prints a "retrieved on" date.
- Anything about mathematics outside the mirrored tables, the Ramsey page and the few hand-pinned
  claims. The copy never suggests wider coverage.
- Any endorsement by upstream's maintainers. None is documented in this repository.
- Speed or freshness beyond "daily". The page is a snapshot at a recorded commit, never "live" or
  "real time".
