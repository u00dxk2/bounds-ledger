# A-54 — adopting Small Ramsey Numbers as a second watched area: the scope

**2026-09-17.** David ruled on the second-area question. This document scopes what the adoption is, what it is not, and the order it ships in. It is a plan with dated done-tests, not a report of work finished; each phase's status lives on `A-54` in `continuity/items.json`, never here.

## The ruling, and the reading acted on

The question on his board (card `ba297b25`, delivered with `docs/decisions/2026-09-16-a48-second-surface-comparison.md`) was: *should the ledger adopt a second area to watch?* The recommendation was **not yet**: first run a small trial that checks a handful of Small Ramsey Numbers results against the papers they cite. The drafted reply read "Not yet. Run the small trial first."

He did not send that reply. He typed, on 2026-09-16:

> Yes let's do it! Scope and let's do it with excellence.

**Reading acted on:** adopt the candidate the comparison ranked first, Small Ramsey Numbers, the Electronic Journal of Combinatorics dynamic survey DS1 by Stanisław Radziszowski (DOI 10.37236/21). The trial is not a gate before adoption. The check it described, records read against the papers they cite, becomes one leg of the adoption (phase 4 below), because it is the leg that produced this ledger's one accepted correction. His reply named no survey. DS1 is taken because it was the only one the recommendation proposed to try. **This reading departs from our recommendation, and it can be challenged in `A-54.davidRuling2026_09_16`.**

## What adopting a survey means here

The one correction this ledger has had accepted came from four things together (`A-34` note2): a record surface copied exactly enough that a defect was findable; a human reading one row against the source it cites; a correction that was one checkable line; and a maintainer who accepts corrections. An adoption that builds only an alarm reproduces one of the four. This scope builds toward all of them and says which phase carries each:

| Mechanism | Carried by |
|---|---|
| The surface held exactly enough to see a change | phase 1 (revision watch), phase 2 (fingerprint and record table) |
| A row read against its cited source | phase 4 (depth reads) |
| A defect stated as one checkable line | phase 4 output; any send is the existing outward gate |
| A maintainer who accepts corrections | not ours to build. The survey publishes a standing request for corrections (quoted in `A-48.surface1Scored`) |

## Facts read on 2026-09-17, before scoping

Each fact below was measured this morning, not copied from the comparison.

- **Landing page** `https://www.combinatorics.org/ojs/index.php/eljc/article/view/DS1`: HTTP 200, 17,621 bytes, title "Small Ramsey Numbers | The Electronic Journal of Combinatorics". The page shows `This Version DS1: Apr 24, 2026`. `run()` from `scripts/check-claims.mjs`, imported rather than copied, reports the phase 1 pin on that string as holding against the live page, and as broken when only that date is altered in the fetched body. The literal outputs are on `A-54`.
- **Survey PDF** at `.../article/download/DS1/pdf/`: HTTP 200, `application/pdf`, 585,821 bytes, sha256 `9519a676ee381f02f03269c22e3f101162b2fdcc9d432e4103cb1192fdff91bc`. That is identical to the bytes read on 2026-09-16.
- **Rights:** the landing page carries no licence. Its two rights fields are blank template fields: `<meta name="DC.Rights" content="Copyright (c)  "/>` names no holder, and the second `DC.Rights` field is empty. No licence link was found in the page (a search for `creativecommons` and `licen` in its links returned nothing). **No licence means no permission to republish, so this repository never holds the survey's bytes.**
- **The author's revision page** `https://www.cs.rit.edu/~spr/ElJC/eline.html`: HTTP 200. Its first entry reads "Small Ramsey Numbers, revision #18, April 24, 2026". Below that, it lists every revision from #18 back to #0 with dates and page counts, newest first. The head of that list is "revision #18 (ps | pdf), 149pp (87+62, 1066), April 24, 2026", followed by "revision #17 … June 7, 2024".
- **Text extraction works for this document:** a session script using only Node's standard library read 149 text streams, one per page of a 149-page survey. It recovered Table Ia and Table Ib (two-colour classical Ramsey numbers R(k, l), k ≤ 10, l ≤ 15) as readable numbers. The script is not committed; phase 2 replaces it with a committed, tested one.
- **Wikipedia's table** (the `Ramsey's theorem` article, raw wikitext): it lists R(r, s) for r, s ≤ 10 and cites DS1 as its source. It states: "Where not cited otherwise, entries in the table below are taken from the June 2024 edition", which is revision #17. A by-eye comparison of its cells for 3 ≤ r ≤ s ≤ 10 against revision #18's tables found no disagreement. **That read is not evidence.** Phase 2 replaces it with a script whose both answers are demonstrated.

## Design decisions

**D1 — Pins and fingerprints, not a byte copy.** The first watched area is copied byte for byte into `ledger/teorth-optimizationproblems/`. This one cannot be, for two reasons: the survey grants no licence to republish it, and the document is a PDF, not a text table. What this repository holds instead: revision identifiers, the PDF's sha256, and short strings for individual values with the reference key each is credited to. `A-6` set the precedent for pinning entries on a surface we do not mirror.

**D2 — The records in scope are Section 2.1 only:** Tables Ia and Ib, the classical two-colour numbers R(k, l). That is the table the field quotes and Wikipedia reproduces. Everything else in the survey (multicolour, hypergraph and cycle numbers, and 1,066 references over 149 pages) is out of scope until this part works end to end.

**D3 — Two revision pins on two hosts.** The journal's landing page and the author's revision page are separate publications of the same revision. Each can change without the other, and a revision that reaches one host and not the other is itself worth seeing. Both ride the existing claim checker unchanged.

**D4 — Records are derived, never hand-typed.** A committed standard-library extractor derives the table from bytes pinned by sha256, and its output is committed under `ledger/`. When the fingerprint moves, the table is re-derived and diffed. That is this area's version of the `npm run resnap` cycle. **The extractor refuses a layout it cannot parse**; it never guesses a column. A new revision can move the table, and a confident wrong number is worse than a refusal.

**D5 — Wikipedia's table is a second surface for the same records.** A script compares every cell of Wikipedia's R(r, s) table against the derived DS1 table, and a disagreement is recorded as a finding. Stale derivative copies of a curated table are the divergence this ledger was founded on. **Nothing in this adoption edits Wikipedia or contacts anyone.**

**D6 — Depth reads use the `A-47` method.** Positions are drawn before any row is read. Each record is read against the paper it credits. The verdicts are sound, defective, unresolved and unreachable, kept separate. A record picked by hand is labelled hand-picked and never counted in the drawn sample.

**D7 — The public page shows this area as its own section.** It carries the survey's name, revision and fingerprint. Its rows are never merged into the existing table, which asserts listing positions in a different curated source.

**D8 — The outward gate does not change.** Any correction to the author, or to Wikipedia, goes through an adversarial review and then David's explicit approval. This scope sends nothing.

## Phases

Each phase ends on a command whose output decides it. A date slipping is said on the row before the date passes, not after.

**Phase 1 — revision watch. Due 2026-09-17.** Three hand claims, all on the existing claim checker. `C-12` pins `Version DS1: Apr 24, 2026` on the journal's landing page. `C-13` pins the author page's first entry, "Small Ramsey Numbers, revision #18, April 24, 2026". `C-14` pins that nothing sits above revision #18 at the head of the author's revision list: it uses the `nothingAfter` form `C-10` and `C-11` already use, so a revision #19 inserted there breaks it even if the first entry is not updated. Both answers are demonstrated against the live bodies, and CI reachability is read on a GitHub runner. The phase is done when a pull-request run's `check` job, read at the job layer, completes with both claims holding. **If a host refuses runners**, that claim becomes `manual: true`. CI then reports it UNVERIFIED, and a local `npm run check` prints an advisory line about that host but never fails. That is a note someone has to read, not an alarm. It weakens the adoption, and David is told so in plain words rather than it being absorbed. An adversarial review of this document found that the advisory line could not see an insertion on a negative pin like `C-14`. `scripts/check-claims.mjs` was fixed before publication, with both answers demonstrated (recorded on `A-54`).

**Phase 2 — fingerprint and record table. Due 2026-09-21.** A committed extractor with a network-free self-test that proves it refuses a malformed layout. A committed table of Section 2.1 values, lower and upper bound separately, each with its credited reference key and the source sha256. A check that re-derives the table from the live PDF and fails on any difference. The Wikipedia comparator. Before publication, a disclosure pass on what the committed table reproduces from a copyrighted document.

**Phase 3 — public page. Due 2026-09-23.** The section described in D7, including a "looks wrong?" route on each row. That route is how `G-4` detects an outside party acting on a record.

**Phase 4 — first depth slice. Due 2026-09-24.** Five records at positions drawn before reading, each read against its credited paper. One candidate is already known and is **hand-picked, not drawn**. The survey's note (e) credits the upper bound R(5, 5) ≤ 46 to reference `[AnM3]` in 2023. The reference table for Table Ia, as extracted and read by column position, credits the same cell to `[AnM4]`. Both keys, and both papers, need to be read before anything is said about it. It is recorded here so the depth read does not have to rediscover it, not as a finding.

## What could make this wrong

- **A host blocks runners** (the erdosproblems.com shape). Phase 1 measures this first, on a runner, because a local 200 has already misled this ledger once (`docs/findings/2026-07-25-the-403-that-wasnt.md`).
- **The extractor misreads a future revision.** D4's refusal is the guard, and phase 2's self-test must show it refusing.
- **Copyright of the committed table.** Numbers are facts, but a table's selection can carry thin protection. The disclosure pass in phase 2 asks this before anything is published.
- **Noise.** The survey is revised every one to two years, so its alarm should be quiet. Wikipedia is edited more often, so its comparison pins individual cells, never the whole article.

## What this does not settle

The comparison's second candidate, Graph Labeling (DS6), is not adopted. The two candidate shapes the comparison never tested stay untested. `G-4` is unchanged. Nothing here shows the author would accept a correction; the comparison found only that corrections are invited and outside input is credited.
