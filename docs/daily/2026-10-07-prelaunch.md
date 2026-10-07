---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-07
lifecycle_stage: launched
last_deploy: e6e6635 (the last page-changing commit; npm run served read 1 of 1 served at 2026-10-07T18:51:10Z, Pages build of d40c7a7)
on_hold_items: 1
top_action_today: A-73, the public index stops naming 10a's row 32 as not settled after a later reading settled it
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-07 (Wednesday, MT)

## BLUF

The public index and the Grothendieck constant's own page now agree: the index stops calling a row unsettled after a later reading settled it.

No first command — the change is live, and tomorrow's first command is in the primer.

## What changed

- `A-73` (the index badge named a row "not settled" after a later reading settled it), shipped in `e6e6635`, `9e02b48` and `d40c7a7`, and live since 18:56Z (the manager's read of the served page). A later reading now DECLARES which earlier reading it settles, in a typed `settles` field on its store entry. The index sets the earlier reading aside only when the declaring reading is SOUND, the settled one is UNRESOLVED, the two share constant, cited key and row-text hash, and the named id is unique in the whole store. Nothing is ordered by date, id or store order. `A-47-0062` carries `settles: "A-47-0002"`.
- `A-57` (the 46a page credits 58/15 to the wrong Bourgain paper): the correction is drafted, reviewed twice and put to David on card `78c6bb41`. The recommended form is an issue, not a pull request, because the published chapter that would replace the citation was never read. Nothing sent.
- `A-58` (four small defects in upstream text): closed, all four dropped with a reason each.

## Inputs (controllable)

- Red-arm on `settledIds`: ten mutations. Nine each tripped their own named assertion in `render-site --selftest`. The self-link guard is the one mutant that changes no output, and the code says so. Removing the malformed-`settles` refusal name trips its own assertion in `render-constant-pages --selftest`. Each file was restored byte-identical and its selftest passed. control: the same selftest on the restored file exits 0, so each failure came from its mutation, not from the harness.
- Reviews by the other model family (Codex, read-only, foreground, banner workdir checked each time as `C:\dev\skylark\bounds-ledger`): A-73 r1 on `e6e6635` (2 findings, both CONFIRMED, fixed in `9e02b48`); A-73 r2 on `9e02b48` (1 LOW, CONFIRMED, fixed in `d40c7a7`); A-57 r1 (5 findings, all CONFIRMED, fixed in `e1f9ce6`); A-57 r2 (no new defects).
- Sibling sweep for "an id-uniqueness map built after filtering": `new Map(` and id-keyed lookups across `render-constant-pages.mjs` and `render-site.mjs`, 7 hits. Only `settledIds` resolves an id; it was fixed.
- `npm test` exit 0 (foreground, after the low-memory reap, on the orchestrator's go-ahead). `npm run verify` exit 0 at `d40c7a7` (receipt 2026-10-07T18:44:28Z).

## Outputs (lagging)

- The bar's metric is NOT MEASURABLE (no analytics, no request log). Encounter for today's change is blind, tracked on `A-59` (encounter is blind on the public pages), 2026-10-28.
- `npm run reports`: 0 outside arrivals of 33 raw issues (33 + 0 + 0 = 33), read this morning.
- Delivery: `npm run served` at 18:51:10Z read "1 checked — 1 served, 0 in flight, 0 stale, 0 unreachable" (index.html, 328478 bytes). The manager's own fetch of the live index at ~19:0xZ: 200, 328478 bytes, Last-Modified 18:56:02Z, 0 matches for LSXCKKM26 and 4 for SLXCKKM26 (bus 0d8d1f96). CI on `d40c7a7`: reverify and page-check both succeeded.
- positive control: `npm run reports` fetched 33 raw issues and classified all 33 as ours, so its 0 comes from a probe that returns rows; the live-index fetch that found 0 LSXCKKM26 found SLXCKKM26 4 times, and `git grep -c SLXCKKM26 HEAD -- index.html` printed `HEAD:index.html:3`.

<!-- findings:begin -->
- The P1 packet's design was wrong, and the manager's review caught it before the build. It proposed ordering a row's readings by a stored reading date, but no entry in `continuity/depth-audit.json` carries its own `recordedAt` (only `meta` does), and every `fetchedAt` is prose. Built as planned, acceptance 1 would have failed. The redirect (a declared `settles` field) replaced it, and `A-73.closeWhen` was amended to match, with the reason on `A-73.closeWhenAmended2026_10_07`.
- My first red-arm passed two mutants that the code was meant to catch, because their test cases could not tell the mutant from the correct code (a non-SOUND declarer, a duplicated id stored last). Both cases were reshaped before commit. Codex r1 then found that the duplicate-id check counted only filtered readings, and r2 found that the type guard I had called untestable is reachable. A guard written over my own new field failed review twice in one day; each round narrowed the claim rather than adding a matcher.
- The `A-57` draft first recommended a pull request naming a chapter nobody here had read, and listed a volume number, a seminar date and a place that the Crossref record does not carry. The refute-it review blocked it; the issue form and a sourced-only reference replaced it. This is the same failure as the 2026-09-24 and 2026-09-27 instances in memory (`verdict-follows-the-reading.md`): an edition that was not read, presented as the source.
- Today's findings are all instrument-facing: they are defects in our own design, tests and outward draft, and none is a fault found in a mirrored record. The 10-06 and recent reports carry no running count of consecutive instrument-facing days, so none is quoted here. The standing prediction is unchanged and was not tested today: the next record-facing catch will be a citation-quality defect in a mirrored upstream entry, found by a human reading the cited source in the depth audit (`A-47`), not by any alarm.
<!-- findings:end -->

## Recommendation

- [B] 2026-10-08: `npm run verify` first, then the `A-54` census session 6 with its blocked-paper retry, and the `W-3` (watch for acknowledgement of the erdosproblems.com/36 correction) read.
- [B] 2026-10-09: `A-47` slice 15 (offset-6 grid, positions 256 to 456).
- [A — user-visible] by 2026-10-12: decide `A-65`'s 10c source-link form without editing `sourceRead`, and ship it.
- On David's yes on card `78c6bb41`: open the `A-57` issue exactly as drafted, and record its link on the row.

## On hold pending data

- **The encounter with today's change:** blind until `A-59` (encounter is blind on the public pages) is read on 2026-10-28.
- **`A-57` (the 46a credit correction):** no longer on hold. After the close, David approved it on card `78c6bb41` (19:32:30Z), on condition of full certainty and full adversarial review. It was sent as https://github.com/teorth/optimizationproblems/issues/218 at 19:39:29Z, the body was read back as identical to the reviewed draft, and the row is closed. Codex r1's finding 4 was refuted on recheck: upstream and our mirror both have an en dash. Recorded in the draft file.

## State Appendix

### Close

ACTION: COMPLETED · item A-73 · P3 post (bus msgId) a1ce0ea1

- **Since the P3 post:** the manager's review (bus 0d8d1f96) judged A-73 COMPLETED against the redirect's acceptance and found no defects. It read the live index itself: LSXCKKM26 0, SLXCKKM26 4, Last-Modified 18:56:02Z. It also confirmed that nothing was sent upstream (no issue, PR or comment by u00dxk2 on teorth/optimizationproblems since 2026-10-06).
- **Hygiene draft: 2 lines — 1 accepted · 1 amended · 0 rejected.**
  - `A-58` accepted: closed with the drafted reasons, (1) to (4).
  - `A-57` amended: the draft proposed pursuing it with a drop date of 2026-10-09. The work was done the same day instead (draft, two reviews, card), so the row carries `decision2026_10_07` and waits on card `78c6bb41`, with both clocks at 2026-10-14.
- **Helper READ-MUTATED, quoted:** "none — 2 reads guarded (HEAD commit dbd0cbf, unchanged before and after both reads; …)", shortened here.
- **Helper checks:** check-wait-justification "RESULT: PASS — 1 of 89 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". check-engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
- **Ledger delta:** `A-73` closed on the live read, with its closeWhen amended and `e6e6635` linked. `A-58` closed. `A-57` gained `decision2026_10_07`, and `expectedSignalBy` and `nextCheckDate` moved to 2026-10-14. The A-57 and A-58 read stamps and sidecars were refreshed by the helper's `--run`. `continuity/depth-audit.json`: `A-47-0062.settles`.
- **Close sweep for A-73 and A-58** (`Grep A-73\b|A-58\b` over `scripts/**`, `docs/**`, `*.md`): 31 occurrences in 17 files. `scripts/render-constant-pages.mjs` (2) and `scripts/render-site.mjs` (1) are comments citing A-73 as the provenance of the settlement rule, which stays correct. The rest are dated historical reports and primers, plus today's report, primer and A-57 draft. None treats either row as open.
- **Due-gate verify:** `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned.", snapshot CURRENT (taken 2026-10-07).
- **Pending reads:** `A-57` re-reads card `78c6bb41` on 2026-10-14, the only open trigger from today's work. `A-59` encounter, 2026-10-28.
- **David:** `A-57` waits on his card `78c6bb41`, to open one issue upstream: yes or no. It is waiting on him, not in flight.

### Selection packet (P1 — evidence and choice)

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
