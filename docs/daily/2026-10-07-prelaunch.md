# bounds-ledger — 2026-10-07 (Wednesday, MT)

## Selection packet (P1 — evidence and choice)

**Outcome:** the public index stops telling a reader that a row is unsettled when that row's own page shows a reading that settled it. Item: `A-73` (the index badge keeps an earlier UNRESOLVED reading of a row after a later reading of the same row settled it).

**The user problem, in the user's words** (the bar's reader is someone about to cite a number; `docs/evangelism-bar.md`): *"The index says this bound isn't settled, the constant's own page says it was checked and holds. Which one do I believe?"* A verification ledger that contradicts itself between two of its own pages gives the citer a reason to trust neither.

**Evidence**

- OBSERVED: the index still names the row as not settled. `git -C C:/dev/skylark/bounds-ledger grep -c LSXCKKM26 -- index.html` printed `index.html:1` (exit 0) at 2026-10-07 ~14:45Z. The matching line carries the key twice, both inside 10a's badge: the `title` attribute ("checked against material for its source, not settled: 2 rows, … 6.039\times 10^{-5} [LSXCKKM26]") and its visible text. Population: the one committed `index.html`, as it stands at today's HEAD. Limits: a read of the committed file, not the served page.
- OBSERVED: the same row (10a, mirror line 32, `[LSXCKKM26]`) carries two stored readings in `continuity/depth-audit.json`. `A-47-0002` is UNRESOLVED on strictness and names no claim. `A-47-0062` is SOUND, with a `claimChecked` naming "the question A-47-0002 left UNRESOLVED". `c/10a.html` labels the second as another reading of the same row (`728fe02`). Source: the store, read by Grep this morning.
- OBSERVED: the cause is `badgeFor` in `scripts/render-constant-pages.mjs` (the WORST VERDICT WINS comment), which takes the worst verdict across all readings of a constant, row by row. Source: `A-73.note`, Codex review r1 of `9a9e8ea`, finding 4, CONFIRMED against source on 2026-10-06. Not re-read in source today; P3 re-reads it first.
- OBSERVED: no outside reader has reported it. `npm run reports` at 2026-10-07 ~14:45Z: 33 raw issues, 33 ours, 0 outside, 0 OUTSIDE ARRIVALS, and the parts reconcile. Population: github.com issues on this repo. It sees issues only, never page readers.
- HYPOTHESIS: a reader who compares the index with the 10a page notices the disagreement. Unmeasured, and unmeasurable here: the page has no analytics and GitHub Pages gives no request log (`docs/evangelism-bar.md`, "Reader reach is unmeasured").
- MISSING: real-user evidence of any kind for this surface. This ships on judgment, as the 09-17 and 10-04 passes did.

**Permission.** `A-73` is open, not parked, waiting or frozen, and no card is on it (`answered-cards.mjs --project bounds-ledger`: none). The change is to our own renderer and our own public page, which is ship-under-authority. Because it is public-facing, it owes an adversarial review from the other model family (Codex) before push (David's 2026-08-01 extension; portable rule 3). The 2026-09-20 freeze covers `ramsey.html` and `copying.html` only; `index.html` and the `c/` pages are outside it. `A-73.closeWhen` itself names the two acceptable ends, so neither needs David.

**Next action — improve.** Change the badge rule so that a row read more than once is judged by its latest reading, ordered by a STORED reading date (`recordedAt`), never by id text or store order. Codex refuted both of those as proof of chronology on 2026-10-06, r1 and r3. Where the order cannot be read from stored dates, the renderer keeps worst-verdict-wins and says nothing new. That is the design hypothesis. If P3's source read shows the stored dates cannot carry it, the other end `closeWhen` allows is a written decision that worst-verdict-wins stays, stating what a reader sees on 10a. First command:

```bash
git -C C:/dev/skylark/bounds-ledger grep -n -e "WORST VERDICT WINS" -e "function badgeFor" -- scripts/render-constant-pages.mjs scripts/render-site.mjs
```

**Acceptance condition (observable)**

1. `git -C C:/dev/skylark/bounds-ledger grep -c LSXCKKM26 -- index.html` prints nothing and exits 1. 10a's badge still names `[SLXCKKM26]`, which no later reading settled.
2. A selftest, red-armed both ways: the badge drops an earlier UNRESOLVED row when a later-dated SOUND reading of the same row exists. It keeps the row when the later reading is UNRESOLVED or DEFECTIVE, when the two dates tie, or when either date is missing. Each mutation is reported by the guard it trips, with the meaning guards placed before any equality pin.
3. `render-site --check` and `render-constant-pages --check` both pass AFTER the commit (`npm run check`).
4. The cross-family review comes back with every finding dispositioned.

**Delivery and encounter checks.** Delivery: `npm run served` reads SERVED for `index.html` after the push, plus a fetch of the live index that no longer carries `LSXCKKM26`. Encounter: the only arrival this page can show is a report through a row's "looks wrong?" link, counted by `npm run reports`, and readable at N = 1. It read 0 outside arrivals of 33 raw this morning. A fix that removes a contradiction produces no event when it works, so encounter for this change is expected-zero by construction.

**USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs` (`badgeFor`); `scripts/render-site.mjs` if the index badge is assembled there; `index.html`; any `c/*.html` the re-render changes; `continuity/items.json` (`A-73`); this report.

**Prior-day retro finding that recurred (2026-10-05's reply, the newest):** rendered-twice prompts. This morning's kickoff and P1 header read 38,234 bytes, shown twice.

**HYGIENE INPUTS**

(a) Due rows not bearing on the choice (kickoff `dated gates due today`: 2 of 2):
- `A-57` (draft a correction to the mirrored 46a entry's attribution, then David decides whether it is sent). expectedSignalBy 2026-10-07. Its onTrigger work (fetch the companion's LNM form, draft, refute-it review, needs-decision card) has not started, and it was re-dated once already, on 2026-09-30. The read is READ_UNREADABLE: the sidecar hash `f394874e58406fd1` does not match the row's `readCommandLastOutputRef.sha256` `092742f4a87a4c1b` (both are file content hashes, not commits). pragma: allowlist sha
- `A-58` (four small defects in text upstream merged on 2026-09-26). expectedSignalBy 2026-10-07. Its readCommand's leg ran inside this morning's `npm run verify` (check:drift exit 0 at `dbd0cbf`, receipt 14:33:04Z), so none of 10c, 74a, 3c or 47a has changed upstream. That is not a sidecar stamp on the row.

(b) Owed child rows in the orchestrator's ledger: none (`rows owed to you in skylark-site's ledger: 0 of 747`).

(c) State reads marked CROSSED: none. One read was NOT judged: `missingLinkedCommits` swept nothing (0 of 0 considered), so that line says nothing either way. The key-numbers read reports no `docs/key-metrics.json` yet, which is "not measured", not a crossing.
