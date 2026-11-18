# Selection — design pass, 2026-11-17 (MT)

**Update, round 3 (overnight 2026-11-17, MT): the owner picked variant c.** The rollout ports it
into `scripts/render-site.mjs` behind a committed build-time flag, `FIRST_SCREEN` ("classic" or
"handbook"), and retires the scratch generator this record describes
(`tools/design-variants.mjs`, deleted with the port, so variants a and b are no longer built
anywhere). The port adds two turn-on fixes this record lists under Known gaps: the search field
carries the brand blue at rest, and the phone cell labels are sentence case. Everything below is the
record as it stood before the pick.

**Every `after/` frame in this folder shows an unpublished candidate, not the live page.** The
committed `index.html` is unchanged and the published page has no variant switch. Variant c is the
blind judge's pick among three candidates. It is not a decision: the owner has not picked.

This record reports several things it cannot itself prove: the judge runs, the detector run, the
two command outputs quoted below, and the review rounds. Their transcripts are in git-ignored
scratch files on the author's machine. Only what `after/capture-log.json` records is checkable
here.

## The flag, and how to roll back

**Now (round 3):** the flag is `FIRST_SCREEN` in `scripts/render-site.mjs`, a committed build-time
value ("classic" or "handbook"). Turning it on or off is editing that line, re-rendering
`index.html` and pushing both; rollback is the same edit back. There is no switch inside the
published page, because every push to this repository's main branch publishes.

**Before the pick:** a scratch-only generator built the three candidates into git-ignored `tmp/`
and refused any write outside it. It was retired at the rollout and is in this repository's
history.

## The three variants

Each came from a different composition family, with the same tokens. The two that were not picked
are named by family only; their copy was removed at the rollout.

| Variant | Family | Headline |
|---|---|---|
| a | One dominant object: a large headline and search field lead the first screen | not picked; copy removed |
| b | An editorial column: a narrow measure, entries stacked beneath | not picked; copy removed |
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

By the author's account both sets came from one capture run: one local server, one browser, light
scheme, no sign-in (the page has none), 1440x900 and 390x844, first viewport, the same three
states. The log records the after set only; it does not record the before set's input. "Before" is
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
- `worstEventMs` in the log, the longest event duration the browser reported while the capture
  script typed "sofa": before 56, 112, 56 ms; after 64, 80, 72 ms.
  Three local loads are too few to call either figure a gain or a loss.

## Claims pass on the selected variant

One read-only Codex round on variant c's page returned FIX FIRST. Held: the masthead, headline,
field label, placeholder, "Browse all" and six empty-state sentences. Fixed with the reviewer's
wording: the sentence on what search covers. Restored after the reviewer found them dropped: that
the page lists the constants mirrored from teorth/optimizationproblems, and that a match can come
from a row higher in a table or a value pinned earlier. Changed: "Browse all" no longer scrolls
past the snapshot notice. A second, narrow read-only Codex round on the wording after those fixes held all four sentences of
the empty state's search paragraph and the "Browse all" behaviour, and returned SHIP. It did not
run the page in a browser. Every visitor sentence in variant c has now had a claims pass after its
last edit; a later edit to any of them reopens that.

## Known gaps

- The empty state's issue draft is still pre-titled "Constant not tracked", in the candidate as on
  the live page. The reviewer flagged it. It is left alone here because the arrival counter reads
  that title prefix; it needs its own change.
- On the phone layout the per-cell labels ("UPPER-BOUND ROW (LAST LISTED)") are still uppercase
  and tracked, which `docs/DESIGN.md` says should go. Seen in `after/first-screen-390.png`.
- The shown bound is still a raw table row with LaTeX source. This pass did not change it.

## What variant c changes, and what it keeps

Changes: it adds a masthead and a "Browse all" control, replaces the headline, removes the lede,
rewrites the field label, placeholder and empty state (which gains a link to the Ramsey page), and
restyles links, notes, labels and the citation control through shared CSS.

Keeps: the product name, favicon, accent colour values, every pin, the citation text and its
caveat, and the markup of the notes section and footer.

Untouched by this pass in the repository: `index.html`, `ramsey.html`, the constant pages, and
every script under `scripts/`.
