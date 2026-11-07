# Journey walk, 2026-11-07: a cold stranger's first visit to the public page

First journey walk on this repo. A cold, logged-out first visit to https://u00dxk2.github.io/bounds-ledger/,
walked on an iPhone 15 viewport and at 1366x900 desktop, from the landing page to the answer to the
page's own question. There is no account, sign-in, email or payment anywhere in the flow, so the
whole flow was walkable. Every sentence is tagged OBSERVED (seen on the live page), HYPOTHESIS or
SUGGESTION. Screenshots: `docs/journey-walk-2026-11-07/`.

## BLUF

**Worst seam (OBSERVED):** a visitor who does exactly what the page invites, pasting the number they
once cited, lands on the right constant and is told only *"1 constant matching "0.380868" —
nothing highlighted"*, beside a card showing a different number. The page never says, at that
moment, that their number is in this constant's table but is not the last-listed row any more. The
answer to the page's headline question is delivered as something that reads like a glitch, and the
sentence that explains it sits in the notes below all 120 cards.

**The fix it points to (SUGGESTION):** when a filter match comes only from a value outside the shown
rows, say so on the count line and on the card: e.g. *""0.380868" appears in this constant's
mirrored table, but not in the last-listed rows shown here. Read the table before citing it."*
Same restraint as the rest of the page: a listing position, never "superseded" or "the record".

**Reversible micro-fix or taste reshape:** reversible micro-fix (client-script copy plus selftest
cases; no layout change). Small and clearly right, but it is outward-facing wording on a page whose
own guards forbid record claims, so it should go through the lane's usual cross-family review
before it ships rather than same-hour. Row `A-100`.

## The walk, in order

### Phone (iPhone 15)

1. **Landing** (`01`). OBSERVED: headline "Is the number you cited still current?", a two-sentence
   intro, the filter with three example terms, an order control, a snapshot paragraph (mirror last
   changed 2026-10-28, re-verified daily, last-listed is not "the record"), "120 constants", then
   the first card starts at the fold. Clear question, clear first action. Good.
2. **Filter by name, "sofa"** (`02`, `03`). OBSERVED: "2 constants matching "sofa" — highlighted where
   it appears"; the matches start below the fold, so on a phone the visitor types and sees no
   change on screen until they scroll. The card itself is legible: two labelled rows, a change
   label, `source · page · looks wrong? · cite`.
3. **Paste a number you once cited, "0.380868"** (`04`). This is the aha moment the headline
   promises. OBSERVED: the filter lands on 1b (Erdős minimum overlap) — the matching works — but the
   count line says "nothing highlighted" and the card's upper row reads `$0.3808585504$`. Nothing on
   screen connects the visitor's number to the one shown. The explanation exists (OBSERVED, notes
   section: "A number sitting higher up a constant's table, such as an older bound you once cited,
   still finds it") but is ~120 cards below. HYPOTHESIS: a stranger reads "nothing highlighted" as
   "the search half-worked", not as "your number has moved".
4. **Rounded number, "1.5029"**. OBSERVED: lands on 1a with an explicit near-match message ("Nothing
   matches "1.5029" exactly, so this shows the constant matching its first digits…"). This is the
   right pattern, and it is what step 3 is missing: the near-match case explains itself; the
   older-row case, which is the more important one, does not.
5. **cite** (`05`). OBSERVED: native disclosure, "Copy citation" button, a block carrying both rows,
   their labels, the upstream sha, the listing-position caveat and the canonical `c/1b.html`
   address. Strong; the caveat travels with the text.
6. **Per-constant page `c/1b.html`** (`06`). OBSERVED: "← all constants", both last-listed rows, the
   cited key resolved to upstream's reference link, change labels, the audit block. The page's
   text contains the string 0.380868 (OBSERVED by a text search) but the page has no filter, so a visitor who arrives
   here from search with their own number cannot ask the question here. Console: one error, a 404
   for `/favicon.ico` at the domain root (OBSERVED; cosmetic).

### Desktop (1366x900)

7. **Landing and the same paste** (`08`). OBSERVED: same seam, same count line. New on desktop: the
   lower-bound column is squeezed to roughly 70 px by the upper-bound row's long comment, so 1b's
   lower bound wraps mid-number as `$0.37900` / `5$`. On a page whose product is an exact number,
   a number split across two lines is a legibility defect. Row `A-101`.

## Three-axis score (the journey as one thing)

- **Narrative coherence: good, with one broken seam.** The page asks one question and every surface
  serves it; there is no ask before value (no account, no email, nothing). The single break is step
  3, where the payoff of the question is shown without being said.
- **Design / brand consistency: consistent.** Index, cards and constant pages share one type scale
  and one quiet style. The one inconsistency is that the near-match case explains itself and the
  older-row case does not (two sibling states, two levels of care). Desktop column wrap noted above.
- **Effectiveness: partial.** A stranger can find any tracked constant and quote it with provenance
  (the cite block is excellent). Whether they learn *their* number moved depends on reading the
  notes; the flow reaches the right card but does not deliver the verdict.

## Claims-vs-computed audit

- "120 constants" (OBSERVED on page) equals 120 `tr[id^=c-]` rows on the live page (OBSERVED via the
  DOM) and README's "All 120 tracked constants" (`render-state-block.mjs --check` asserts this). HOLDS.
- "A job re-verifies every pinned row on this page daily (run history)": `.github/workflows/reverify.yml`
  carries `cron: "17 9 * * *"`. HOLDS as a schedule; this walk did not read the run history.
- "this mirror last changed on 2026-10-28": not traced this walk (UNREAD, not checked false).
- Change labels ("bound cell edited 2026-10-26", "tracked since 2026-09-03 — no movement seen yet"):
  computed per pin by the render scripts (rotations 5 and 9 of `docs/key-user-flows.md`); not
  re-derived this walk.
- "N constants matching … — nothing highlighted" (`scripts/render-site.mjs`, the count-line
  expression): accurate as a statement about highlighting, and that is the problem. It is true and
  tells the visitor nothing about why the match happened.

## Map vs territory

`docs/key-user-flows.md` covers F-2 in depth through eleven rotations but never enumerated the
first-run screens as a walk. Missing from the map and added in this commit: the count line and its
three states, the near-match message, the older-row match (the step this walk found weakest), the
"Also watched, on its own page" Ramsey link, the notes section the snapshot paragraph points to, and
the per-constant page as a second entry point (from search) with no filter of its own.

## The pattern

**Answer present, verdict unsaid.** The page holds the information a stranger needs at every step,
and states its meaning in a notes section below the table. The ledger is careful never to
over-claim; at the one moment that matters most it under-says. The near-match message already
shows the fix's shape: say what just happened, at the moment it happens, in the same restrained
words.

## The one fix

`A-100`: when a match comes only from values outside the shown rows, say so on the count line and the
matching card, in listing-position language. Reversible, selftestable, no layout change.

Secondary: `A-101`, the desktop lower-bound column wrapping a number mid-digit.

Not walked: the `looks wrong?` link (it opens a prefilled GitHub issue; not submitted), the
Ramsey page, and the order-by-recency control.
