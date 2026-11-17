# Selection — design pass, 2026-11-17 (MT)

Nothing here is on the live page. The committed `index.html` is unchanged.

## The flag, and how to roll back

There is no switch inside the published page, because every push to this repository's main branch
publishes. The variants are produced by `docs/design-pass-2026-11-17/tools/design-variants.mjs`,
which takes the default render as a string and writes transformed copies under the git-ignored
`tmp/design-pass/variants/` only.

- Build: `node docs/design-pass-2026-11-17/tools/design-variants.mjs --variant c` (or `a`, `b`, `all`).
- Off is the default: nothing runs it, and no page is built from it.
- Rollback before a pick: nothing to roll back. After a pick is published, rollback is a revert of
  that commit.
- Its self-check, `--selfcheck`, printed on 2026-11-17:
  `{"refusedUnknown":true,"refusedEmpty":true,"refusedMiss":true,"buildsAll":true,"indexUnchanged":true}`.
  An unrecognised argument printed "REFUSED — unrecognised arguments ["--bogus"]. Nothing was
  written." and exited 2.
- The variant pages themselves are deliberately not committed. This repository is served whole, so
  a committed variant page would be a page a visitor could open.

## The three variants

Each came from a different composition family, with the same tokens.

| Variant | Family | Headline |
|---|---|---|
| a | One dominant object: the search field fills the first screen | "Search for a bound to find matching entries." |
| b | An editorial column: a narrow measure, entries stacked beneath | "A ledger of 120 mathematical constants showing the last-listed bounds rows and, where available, when their pins changed or tracking began." |
| c | A working demonstration: the table set as a handbook page, high on the screen | "120 mathematical constants with last-listed bounds rows and, where available, dates for pin changes or the start of tracking." |

## The blind pick

Judge: Codex, read-only, given four unlabelled images per run (left and right, desktop and phone)
and the prompt in `blind-judge-prompt.md`, verbatim. The frames were named 1, 2 and 3 (1 = b,
2 = c, 3 = a). Every pair was judged twice with the sides swapped. The judge was not told which
design was new or who made any of them. Each run's banner workdir was its own scratch folder.

| Left | Right | Pick | Winner |
|---|---|---|---|
| 1 | 2 | RIGHT | 2 |
| 2 | 1 | LEFT | 2 |
| 1 | 3 | RIGHT | 3 |
| 3 | 1 | LEFT | 3 |
| 2 | 3 | LEFT | 2 |
| 3 | 2 | RIGHT | 2 |

All six verdicts survived the swap. Frame 2, variant **c**, won both of its pairs. Order: c, a, b.

## Frames for the review page (like for like)

Both sets came from one capture run: the same local server on this machine, the same browser,
light scheme, signed out, 1440x900 and 390x844, first viewport, the same three states. "Before" is
the committed `index.html`; "after" is variant c.

- Before: `docs/design-pass-2026-11-17/before-same-path/` — `first-screen-1440.png`,
  `first-screen-390.png`, `flow-match-1440.png`, `flow-match-390.png`, `flow-empty-1440.png`,
  `flow-empty-390.png`.
- After: `docs/design-pass-2026-11-17/after/` — the same six names, with `capture-log.json`.
- The earlier `before/` frames are of the live site and stay as the record. They are not the pair.

## Checks on the selected variant (one run, 2026-11-17)

- Design detectors, eight rules, 1280x800 and 390x844: 0 findings, 0 errors.
- Face that rendered the headline and the constant names: Palatino Linotype, at both widths, on
  this Windows machine. No Android render was taken, so the Android fallback is unmeasured.
- Reduced motion: the empty panel's animation name read "none" with reduced motion asked for and
  "settle" without.
- Layout shift: 0 before and 0 after, three loads each.
- Largest paint, three local loads each: before 228, 200, 148 ms; after 236, 140, 172 ms.
- Worst input delay while typing "sofa": before 56, 112, 56 ms; after 64, 80, 72 ms.
  Three local loads are too few to call either figure a gain or a loss.

## Claims pass on the selected variant

One read-only Codex round on variant c's page returned FIX FIRST. Held: the masthead, headline,
field label, placeholder, "Browse all" and six empty-state sentences. Fixed with the reviewer's
wording: the sentence on what search covers. Restored after the reviewer found them dropped: that
the page lists the constants mirrored from teorth/optimizationproblems, and that a match can come
from a row higher in a table or a value pinned earlier. Changed: "Browse all" no longer scrolls
past the snapshot notice. **The wording after those fixes has not been reviewed again.**

## Known gaps

- The empty state's issue draft is still pre-titled "Constant not tracked", in the candidate as on
  the live page. The reviewer flagged it. It is left alone here because the arrival counter reads
  that title prefix; it needs its own change.
- On the phone layout the per-cell labels ("UPPER-BOUND ROW (LAST LISTED)") are still uppercase
  and tracked, which `docs/DESIGN.md` says should go. Seen in `after/first-screen-390.png`.
- The shown bound is still a raw table row with LaTeX source. This pass did not change it.

## Not changed

The product name, favicon, brand colour, navigation and page structure, every pin, the citation
text and its caveat, the notes section, the footer, `ramsey.html`, the constant pages, and every
script under `scripts/`.
