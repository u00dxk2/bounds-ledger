# Citation-key integrity across the mirror — and the first-PR targets it produced

**Date:** 2026-08-05 (MT)
**Item:** A-13 (launch critical path — first-PR target selection, note5 left this channel with no target)
**Status:** Targets identified and verified. **Nothing drafted, nothing sent.** A PR is outward contact:
adversarial refute-it review + David's gate, both still owed.

## Why this was run

A-13 note2 selected "one surgical correction-shaped PR to `teorth/optimizationproblems`" as the channel
for the north-star metric (an externally-acknowledged correction; still 0). note5 then killed the three
named candidates — PRs #129 / #130 / #135 all merged 2026-08-02, hours before we would have replayed
them — leaving the channel live with **no target**. Selection needs no gate; only a send does. So this
is target-finding, which is the highest-value unblocked work in the lane.

The search was deliberately aimed at the defect class upstream has already demonstrated it accepts fixes
for. Both real drifts the mirror caught in July were **editorial, not numeric**: a dead cross-link to a
`constants/2.html` that does not exist (7/28) and a missing `C` in `$C\_{41a} \ge \_{41b}$` (7/28). Those
are exact, local, one-file, mechanically checkable, and carry zero literature risk — which is the profile
that survives the acceptance hierarchy in note2, where PR #72 was rejected *solely* for insufficient
literature despite shipping certificates.

## The result

**10 citation-key defects across 6 of 111 mirrored files**, at mirror state `dee1660` (verified clean by
the same morning's `reverify --check`, so mirror == upstream HEAD; these are live).

A citation key is used in a bounds table or in prose as `[Tag]`, and the page's own `## References`
section is supposed to define it. In each case below it does not.

| File | Used in page | Defined in References | Line |
|------|--------------|----------------------|------|
| `15a.md` | `[BCRL1979]` | `[BCRL79]` | 14 |
| `15a.md` | `[L2014]` | `[LG2014]` | 24, 27 |
| `15a.md` | `[DWZ23]` | `[DWZ2022]` | 29 |
| `15a.md` | `[WXXZ24]` | `[VXXZ2023]` | 30 |
| `15a.md` | `[ADWXXZ25]` | `[ADVXXZ2024]` | 31 |
| `22b.md` | `[O2013]` | `[Olsen2013]` | 17 |
| `46a.md` | `[Ta2004]` | `[Tao2004]` | 41 |
| `50a.md` | `[PG25]` | `[P25]` | 21 |
| `52a.md` | `[AS2000]` | `[AC2000]` | 52 |
| `10a.md` | `[LSXKKMC26]` | *(nothing — no near-miss partner)* | 51 |

Nine are 1:1 near-miss pairs: a key used, a near-identical key defined, neither referencing the other.
That pairing is the signature of a rename or transcription slip, not a missing citation. `10a.md` is the
one genuine orphan — `[LSXKKMC26]` is cited in prose and defined nowhere on the page.

`15a.md` (the matrix multiplication exponent ω) carries five of the ten on its own, and it is the page
whose upper-bounds table runs from Strassen 1969 to the current 2.371339 record — i.e. one of the most
consulted pages in the inventory.

## Which side is wrong is NOT uniform — and that is the part needing review

Reading each page's own internal convention rather than assuming a direction:

- `15a.md` uses four-digit years throughout (`S1969`, `P1978`, `CW1990`, `LG2017`) and initials matching
  the author list. On that convention `[LG2014]` (Le Gall, matching the file's own `LG2017`),
  `[VXXZ2023]` and `[ADVXXZ2024]` (Vassilevska Williams → `V`, matching `V2012` / `V2014`) are the
  correct keys, and the **table** rows are the outliers. But `[BCRL79]` is a two-digit year in a
  four-digit file, so there the **reference** is the outlier and the table's `[BCRL1979]` is right.
  Direction of fix therefore differs *within a single file*.
- `52a.md`: the reference reads "D. Achioptas, and G.B. Sorkin" — Achlioptas + Sorkin gives `AS2000`,
  so the **table** is likely right and the reference key `AC2000` wrong. (Separately, "Achioptas" is
  itself a misspelling of Achlioptas — noted, not claimed.)
- `50a.md`: `[P25]` is defined for "S. Piddock", a single author, so `P25` is right and the table's
  `[PG25]` is likely contaminated by the same page's `[GP19]` (Gharibian & Parekh).

This is exactly why the package goes to review rather than straight to a patch: a PR that "fixes" ten
keys in one direction would be wrong in at least two places.

## The instrument was wrong three times before it was believed

Worth recording, because the numbers it produced along the way were confident and all three were
artifacts of my parser, not properties of the repo:

1. First pass: **532 undefined tags**. The pattern was matching LaTeX intervals (`[-1,1]`, `[0,1]`),
   multi-cites as single tokens (`[BCRL1979, B1980]`), and intra-page anchors.
2. Narrowed to tag-shaped tokens with multi-cites split: **41 of 111 files**. Still absurd for a
   Tao-curated inventory — and the tell was that most flagged files reported *N undefined, 0 unused*,
   whereas a genuine rename defect always produces a **pair**. Inspection found `19a.md` uses `* [Tag]`
   bullets and `50a.md` uses `- **[Tag]**` bold, neither matched by the definition regex.
3. Fixed those: **36 of 111**. Still too high. A third format appeared —
   `- <a id="Tag"></a>**[Tag]**` (used by `38a.md`, `40a.md`, `57b.md`) — with an HTML anchor between
   the bullet and the key.
4. Fixed that: **6 of 111**, five of them clean pairs. Believable, and then verified by reading the raw
   lines rather than trusting the count.

The ratio was the alarm each time. 41-of-111 basic citation breakage in this repo was never plausible,
and the lane's standing posture — **suspect the instrument before the record** — is what stopped three
false counts from becoming a finding. Had the first number been 6 instead of 532, it would have been
tempting to believe it immediately.

## What was NOT done, deliberately

- **No PR, no fork, no upstream contact.** Outward gate unchanged: adversarial refute-it review, then
  David's explicit approval.
- **No claim about any mathematics.** Not one bound, value, or attribution was checked here. These are
  citation-key defects only. That limit belongs in any outward wording (the method-sentence rule).
- **The scanner is not committed.** It lives in the session scratchpad; its source is below so the
  result is reproducible. Committing it would make it a detector, which under W-4/KP-78 owes a
  both-sides demonstration, and adding a sixth `--selftest` to `package.json` fails `reverify.test.mjs`
  until a matching CI workflow step exists. That is a real feature, not a selection increment — filed as
  a candidate, not smuggled in today.

## Reproduce

Run from the repo root against the mirror at `dee1660`:

```js
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'ledger/teorth-optimizationproblems/constants';
const files = readdirSync(DIR).filter(f => f.endsWith('.md')).sort();
const TAGISH = /^[A-Za-z][A-Za-z'+.-]*\d{2,4}[a-z]?$/;

for (const f of files) {
  const lines = readFileSync(join(DIR, f), 'utf8').split(/\r?\n/);
  const refIdx = lines.findIndex(l => /^##\s+References/i.test(l));
  if (refIdx === -1) continue;
  const body = lines.slice(0, refIdx), refs = lines.slice(refIdx + 1);

  const defined = new Set();
  for (const l of refs) {
    // three reference formats in this corpus: "- [T]", "* [T]", "- <a id=T></a>**[T]**"
    const m = l.match(/^\s*[-*]\s*(?:<a\b[^>]*>\s*<\/a>\s*)?\*{0,2}\[([^\]]+)\]\*{0,2}\s*(?!\()/);
    if (m) for (const t of m[1].split(',').map(s => s.trim())) if (TAGISH.test(t)) defined.add(t);
  }
  const used = new Map();
  body.forEach((l, i) => {
    for (const m of l.matchAll(/\[([^\]\n]+)\](?!\()/g))
      for (const t of m[1].split(',').map(s => s.trim()))
        if (TAGISH.test(t) && !used.has(t)) used.set(t, i + 1);
  });

  const undef = [...used.keys()].filter(t => !defined.has(t));
  if (!undef.length) continue;
  console.log(`### ${f}`);
  for (const t of undef) console.log(`   USED-UNDEFINED [${t}] line ${used.get(t)}`);
  for (const t of [...defined].filter(t => !used.has(t))) console.log(`   DEFINED-UNUSED [${t}]`);
}
```

Expected: six files, ten used-undefined keys, matching the table above.

## Next step for whoever picks this up

The candidate is **`15a.md` alone** — five defects, one file, one of the inventory's most-consulted
pages, and a self-contained patch. The other five files are a natural follow-up once the channel has
one acceptance, per note2's rule that nothing gets built out before a first merge.

Before any draft: re-run the scan (upstream pushes near-daily and #129/#130/#135 proved targets here go
stale inside a day), then the adversarial review, then David.
