# bounds-ledger — 2026-10-10 (Saturday, MT)

## P1 selection packet

Posted before any work. P5 folds it into the canonical sections.

**Outcome:** two constant pages tell the reader where the paper's own printed citation differs from the citation the mirrored entry gives. Item `A-74` (two differences between a mirrored entry and its source, found by reading), option (a) on its own row: show them.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a bound and a referee told me it had been improved. I had no way to know." The same reader, at the moment of citing, takes the reference from the entry. On 43a and 54a that reference does not match what the paper prints, and today neither page says so.

**Evidence**
- OBSERVED today (Grep, the mirror): `ledger/teorth-optimizationproblems/constants/43a.md:39` gives the title "*Remarks on steiner minimal trees.*"; `ledger/teorth-optimizationproblems/constants/54a.md:73` gives "no. 7, 3603–3613".
- OBSERVED 2026-10-09, NOT re-read today: the 43a paper's p. 177 prints "A REMARK ON STEINER MINIMAL TREES"; the 54a article's p. 3603 masthead reads "Pages 3603–3612" (quoted in `A-47-0071.positiveControl`), and its last page is numbered 3612. Both are to be re-read from the page images before either is stated (the row's own rule).
- OBSERVED today: neither page carries either difference. The `A-74` readCommand printed nothing (exit 1). Its positive control printed `c/43a.html:1` and `c/54a.html:1`, so the right files were read.
- MISSING: the slice 15 saved copies. Glob over `tmp/depth-reads/**` finds no 43a or 54a file, so the sources are fetched again: the 43a scan from R. L. Graham's papers page, and the 54a PDF from the Internet Archive capture the entry records.
- OBSERVED today, real users: `npm run reports` printed "OUTSIDE ARRIVALS: 0" of 33 raw issues (33 + 0 + 0 = 33). This is the only arrival signal. The bar's metric is NOT MEASURABLE: there are no analytics and Pages provides no request log.
- OBSERVED today: `check-cycle-rotation.mjs --lane bounds-ledger` reported no product-love cycle due (exit 0). `answered-cards.mjs` reported no David-word cards.

**Permission.** `A-74` is open and not parked, and no board card covers it. Its row dates the choice to 2026-10-11 and records the lane's recommendation as (a). I am pulling it forward one day as a reader-facing page change under lane authority (David's 80% product ruling). That frees 10-11 for `A-47` slice 16. The change is not outward contact: reporting either difference upstream stays excluded, and still needs an adversarial review and David's word. Because the page is public, it gets a read-only review from the other model family (Codex) before push (David, 2026-08-01).

**Next action:** improve. First command (PowerShell; create `tmp\a74` first), which re-reads the 43a source before anything is written:
```
Invoke-WebRequest -Uri "https://mathweb.ucsd.edu/~ronspubs/76_10_steiner_trees.pdf" -OutFile "C:\dev\skylark\bounds-ledger\tmp\a74\gh1976.pdf"
```
Then:
1. Re-read 54a's first and last pages from the archived PDF.
2. Add one reader-facing store field per entry (`A-47-0069`, `A-47-0071`; not `notes`), one plain sentence each.
3. Have `scripts/render-constant-pages.mjs` print the field beside the reading, with a guard: the sentence appears only on its own entry, and it never says the bound or the verdict changed.
4. Red-arm the guard, run the Codex review, push, and read both live pages.

**Acceptance:**
- On HEAD, the `A-74` readCommand prints both `c/54a.html` and `c/43a.html` (exit 0).
- The Pages response for both pages equals `git show HEAD:c/<id>.html`, byte for byte.
- Each sentence is restated from a page image seen today, never from the row's note.

**Delivery and encounter:**
- Delivery: `npm run served`, plus a byte comparison of both pages, after the Pages build for the push.
- Encounter: blind. There are no analytics and no request log; this is tracked on `A-59` (encounter is blind on the public pages), read on 2026-10-28.
- The only event that could appear is a report filed through either row's "looks wrong?" link, counted by `npm run reports` and readable at N = 1. It reads 0 of 33 this morning.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, `scripts/render-constant-pages.mjs`, `c/43a.html`, `c/54a.html`; also `continuity/items.json` (the `A-74` row, internal).

**Running beside it (a dated standing obligation, not the choice): `A-54` census session 7** (the rebuild of the Small Ramsey Numbers table from its credited papers).
- Tripwire applied first, per `rebuildCheckpoint2026_09_28`: 13 papers remain (`census6_2026_10_08`: 11 of Table Ia's 42 credited papers, plus AnM2 and AnM3). The capacity is 4 × 4 slots (10-10 through 10-16) = 16, so the wire does not fire and completion stays 2026-10-20.
- Plan, in the order `ds1-depth.mjs --frame` derives: HW+ (25 bounds, one access budget, already known to be hard to reach), Tat (2), Math (3), HZ2 (2), 32 bounds in all.
- The plan touches only `continuity/depth-audit-ds1.json`, which the selected change does not touch. So I will commit and push the plan right after this post, before any source is opened, and then read under `blockedSourceRule2026_09_25`. Say so if you want it held instead.
- Census rows stay off both pages while the 2026-09-20 freeze holds.
- Free memory read 9.37 GB, under the 10 GB heavy-job bar, so reading agents are dispatched one at a time.

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice: 1, `A-54`. It is worked today as census session 7 above, and its disposition is that session's record plus `expectedSignalBy` stepped to 2026-10-12.
- (b) Owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger", 0 of 748.
- (c) State reads marked CROSSED: none. Read: the kickoff's state block (dated gates, owed rows, board cards, prior retro, primer, banner, listener, HEAD CI, report artifact, queued rows, key numbers, stale-actionable, missingLinkedCommits). One read is not green: key numbers reads "no list yet" (`docs/key-metrics.json` absent). That is not measured, not a zero.

**Section 0**
- Primer read.
- Listener 🟢: SSE hello at 14:56:16Z, loop ticking by tool call.
- Codex GREEN: the probe line on the kickoff.
- CI GREEN at `610d830` for both `reverify.yml` and `page-check.yml` (`check-ci-status`, exit 0 each).
- Deploy drift: not swept. This is a Pages lane, and no Render service is declared, so it is neither a stop nor a pass.
- Harness: running 2.1.296 · fleet UNIFORM · installed 2.1.296 (SAME).
- `npm run verify` receipt exit 0 at `610d830` (15:03:39Z).
- Due-gates snapshot taken: "1 gate(s) due on/before 2026-10-10", `A-54`.
- Recommendations from yesterday:
  - (1) Verify, then `A-54` session 7: carrying today, beside P3.
  - (2) Slice 16: carrying to 2026-10-11.
  - (3) Report upstream: not asked; David's call.

**Prior-day retro finding that bears on the choice:** 10-09's Q4 (the two differences, row `A-74`) is exactly what is selected.
