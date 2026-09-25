---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-22
lifecycle_stage: launched
last_deploy: aee164ce (the last page-changing commit; `npm run served` read 117 of 117 published files served as committed)
on_hold_items: 0
top_action_today: the citer's page says when we last looked, and the publish path gets a check that reads what a reader is served
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# Daily report — bounds-ledger — 2026-09-22 (MT)

**WRITTEN 2026-09-24, TWO DAYS LATE, AND THAT IS THE FIRST THING A READER SHOULD KNOW.** The session working 2026-09-22 was interrupted after its P4 post at 17:17Z and resumed at 2026-09-24 23:55Z. Nothing ran in this lane in between: `git log` shows no commit after `e359180` (2026-09-22 17:16Z) and the lane posted nothing to the bus. So this is the artifact of record for service day 2026-09-22, back-filled; every figure below carries the moment it was read, and the ones read on the 24th say so rather than being passed off as the 22nd's.

## BLUF

**FIRST ACTION (next session, 2026-09-25):** `A-47`'s depth-audit slice 7 (the standing read of our own cited sources) is dated 2026-09-25 and is the next scheduled work. Before it, one command, because two dark days sit between the last session and this one:

```bash
npm run served
```

**DON'T-TOUCH:** the daily scheduled drift alarm. It covered both dark mornings without anyone watching — 2026-09-23 09:28Z and 2026-09-24 09:29Z, both `success`, today's log reading `No drift. 116 files match upstream` and `244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)`. It works because it runs on GitHub's clock rather than ours, which is exactly what a two-day gap tests.

**The day in one line:** the page a citer actually lands on now says when the row was last checked, and the publish path got the check it was missing — then the session stopped for two days, which promptly demonstrated why that check needed a caller that is not a person.

## What changed

- **Every constant page says it is re-checked** (`aee164c`). The footer of all 115 `c/<id>.html` pages now says the row is re-checked daily, that an old date does not mean nobody has looked, and links the run history. That is the page a reader reaches from a search result or a "Cite this row" link; the index had carried this since 2026-08-27 and the pages a reader lands on never had.
- **The index stopped asserting a figure that had gone wrong** (`aee164c`). It read "the longest such quiet stretch so far was nine days", typed by hand on 2026-08-27. The mirror has not changed since 2026-09-05, so the open stretch is longer than the maximum the page claimed, and a stranger with a calendar reads abandonment. The figure is now derived from the manifest's own commit history over completed gaps, and the sentence says the open stretch is not counted.
- **Neither page promises an old date means nothing moved** (`aee164c`). Both said the records had been "steady", which is false during an unresolved drift: the alarm is red, upstream has moved, and the page still shows the old date until a person verifies and republishes.
- **The Ramsey page names its four gaps** (`aee164c`), on David's ruling at 13:58:51Z: "Yes, fix that one sentence now and leave the rest of the page as it is." One line changed on that page and none on `copying.html`. The figures were re-derived from `ledger/ejc-ds1/section-2-1.json` before the edit: the range holds 76 pairs, 72 are printed, and the four absent are R(9, 14), R(9, 15), R(10, 13) and R(10, 14).
- **`A-55` (the Pages-publish blind spot) closed on a check that reads what a reader is served** (`b1c1af9`, `a4a61c1`). `scripts/check-served.mjs` compares the bytes GitHub Pages returns with the bytes HEAD holds, for every published file the last page-changing commit touched. Both KP-78 answers were taken on the live path, not in a fixture: 117 STALE and exit 1 seconds after the push, 117 served and exit 0 once the build landed.
- **Eight due gates were read through the runner and three rows closed** (`f451cfa`): `A-46` (the fleet tense-token ask) on the measured cost of its alternative, `W-10` (the alarm-title test that failed once) as seen-once-never-again, and `W-9` (does detection find what the lane exists to find) on the evidence that it does. `G-2`, `W-8` and `W-4` were re-dated with reasons, and `W-8`'s read was replaced because it was blind to pull requests — the class of thing this lane's newest outward artifact is.
- **The comparator slip was said a third time with a date** (`e359180`), as its own row pre-committed.

**Findings classification, one sentence of human judgment: every defect found on 2026-09-22 was INSTRUMENT-FACING, and there were six of them.** The index's stale quiet-stretch figure; the false "this page changes only after an upstream change" sentence on 116 surfaces; `A-55`'s own diagnostic, which could no longer show the failure it was filed for; two guards of mine that pinned one phrasing and could be evaded by rewording; a test that could not fail, which the review proved by putting the removed literal back; and my own fabricated sha in a draft receipt. **Numeric or byte-only: neither** — `npm run catches` at 13:17Z read 23 movements on distinct pins across 10 weeks with **0 in the current week and 2 completed consecutive weeks at none**, so nothing was counted either way and the numeric-versus-byte question does not arise. **Consecutive instrument-facing days: 1** — 2026-09-21 was BOTH and ended a five-day run, so this is a fresh count, written by hand because nothing counts it. **The standing prediction was UNTESTED on 2026-09-22 and it is a NEW one:** `W-9`'s close retired the wording that had been falsified on 2026-08-27 and again on 2026-09-05 and then re-quoted as live by three later reports, because CLAUDE.md still carried it. The registered claim now: the next record-facing catch will be a citation-quality defect in a mirrored upstream entry, found by a human reading the cited source in the depth audit, not by any alarm.

**W-7 — one instrument read against its own claim: `A-55`'s `readCommand`, and it could no longer see the thing it existed to show.** It printed the three most recent Pages builds. Read ten deep on the morning of 2026-09-22, the two `errored` builds of 2026-09-21 sat sixth and seventh, so the row's own command returned three `built` rows about the failure it was filed for. Its output could only ever say otherwise for a failure among the last three pushes. It is now replaced by `npm run served`, which reads the served bytes rather than GitHub's record of its own builds. Rotation: 09-20 `answered-cards`, 09-21 `gh api rate_limit`, this one next.

## Inputs (controllable)

- **The adversarial review earned the day.** Codex was RED (probe 12:34:55Z), so the review ran as a Claude sub-agent that executed commands, re-derived every figure and landed mutations. It returned NEEDS-ATTENTION with two blockers, and both were real: a property claimed in the commit message with no guard behind it, and a public page that still invited the conclusion the change was meant to prevent. Four mediums with it, including a false sentence on 116 pages that this very commit falsified.
- **KP-78 was run five times, each mutation proved landed before its result was believed**, and one of the five proved nothing the first time: appending a steadiness sentence to the index note also edited the pin that guards it, because both live in one file. Re-run against text unique to the template, it fired. A mutation that edits the guard alongside the surface is not a red arm.
- **The publish lag was measured rather than assumed** — commit at 14:33:22Z, page still serving the previous build at 14:36:00Z, matching at 14:36:15Z, so 158 to 173 seconds at the reader, with the build's own timestamp about 74 seconds in. The in-flight window is 300s from that measurement. The polling script itself printed an elapsed figure six hours out, because a UTC-suffixed time was parsed as local; the timestamps it logged were sound and the figures come from those.
- **David answered a card in eight minutes** and the answer was the drafted reply verbatim, so there is no divergence between his wording and ours.

## Outputs (lagging)

- **`G-4` (an outside party acts on a watched record without us filing the report): 0 arrivals, measured read in this pass, 2026-09-24 evening MT** — `npm run reports`, exit 0: 30 raw issues fetched, 30 ours by author, 0 outside, and the parts reconcile to 30. Positive control is the reconciliation itself: a dead fetch exits 2 rather than printing this. 47 days since the public flip. NOT read on 2026-09-22 — this figure is two days after the service day and says so.
- **Record-listing movements: 0 in the current week, 2 completed consecutive weeks at none** — `npm run catches` at 2026-09-22 13:17Z, through `W-9`'s gate. Quote the per-week figure; the 23 total across 10 weeks is a ceiling. Positive control: the same table prints 7 for the week of 2026-08-31.
- **Repo traffic: 9 unique viewer-days and 912 unique cloner-days since the public flip on 2026-08-08** — `npm run traffic`, same pass. Viewer-days overcount distinct people, so 9 is an upper bound. The return-rate proxy is INAPPLICABLE at n=2 distinct viewers, below its N_min of 3, and the arithmetic is printed anyway so the figure that replaces it stays auditable. The published page has no analytics, so page readership stays unmeasured.
- **Publish: 117 of 117 published files served as committed** — `npm run served`, 2026-09-25T00:03:53Z, anchored on `aee164c`. This is the read that did not exist before 2026-09-22.
- **Upstream contact: 1 open pull request** (#194), opened 2026-09-21. `W-12` reads its state on 2026-09-28.

## Recommendation

**[A — user-visible] Next session (2026-09-25): `A-47` slice 7, the depth audit's standing read of our own cited sources against the papers they credit.** It is dated 2026-09-25 and it is the lane's only Tier-0-adjacent work that produces record-facing findings; four of the last six record-facing catches came from it. Run `npm run served` first, because two dark days sit behind this session and nothing has looked at the served pages since.

**[B] Price the scheduled caller for the served-bytes check.** `W-13` now carries that read on a date, which is still a person remembering to read a row. The shape worth costing is a scheduled workflow that runs the check and files or updates ONE issue on a STALE verdict, kept out of the reverify suite so a transient GitHub failure cannot red it. The dark window is the argument: for two days the only instrument watching the product was one a human had to type.

## On hold pending data

**Nothing in this lane waits on David.** Both board cards read `[answered]` — `943ef827` at 2026-09-22T13:58:51Z and `5910378d` on 2026-09-20 — and the work each authorised is done: the one-sentence Ramsey correction shipped in `aee164c`, and the partial-table ruling is scoped with dates on `A-54`.

**One wait is genuinely another party's attention:** pull request #194 upstream, whose clock is `W-12`, read 2026-09-28. **One wait is now unfillable on its original terms and says so:** `A-54`'s Wikipedia comparator, slipped a third time on 2026-09-22 and re-dated to 2026-09-28, with a written condition that forbids a fourth silent re-date. The two dark days cost that row its census session, which was dated 2026-09-24, and its correction field records that the 09-28 checkpoint therefore has two days less work behind it.

## State Appendix

Written last, from live commands, on 2026-09-24 unless a line says otherwise. Every line carries the command that re-reads it; **this appendix cannot name the commit that lands it**, because that commit is made after the writing.

- **HEAD**: `e359180` "P4 2026-09-22: the comparator slip is said a third time with a date, and the date is not tomorrow" — `git -C . log -1 --format=%h%x20%s`, read in this pass on 2026-09-24 evening MT. `git status --porcelain` showed only `continuity/items.json` modified, the edits this pass made.
- **CI**: **GREEN at `e35918084bc10c3cf376ceebbc4784ffd67c9a57`** — `check-ci-status.mjs --workflow reverify.yml`, exit 0, `GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending`, read on 2026-09-22 shortly before the P4 post at 17:17:48Z; the two scheduled runs since (09-23 09:28Z, 09-24 09:29Z) also read `success` on that same sha, from `gh run list --workflow reverify.yml`.
- **The dark window's alarm runs**: both scheduled runs on the same sha read `success` — 2026-09-23 09:28:40Z and 2026-09-24 09:29:06Z, from `gh run list --repo u00dxk2/bounds-ledger --workflow reverify.yml`. Today's log, read with `gh run view 35981508419 --log`, prints `state block: in sync (116 files @ 9d57db8, 244 claims)`, `No drift. 116 files match upstream <upstream sha elided here; reprint it with node scripts/reverify.mjs --check, or read it from ledger/teorth-optimizationproblems/manifest.json>` — an upstream teorth/optimizationproblems commit, which does not resolve in this repo and `244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)` — the two unverified being C-7 and C-9, manual by design. That is where the 244 and 242 in the BLUF come from.
- **Gates**: `npm run verify` exit 0, receipt `{exitCode: 0, sha: ddf5a2b905ff2d9ca0f66f0fe7bca84be5a245f7, at: 2026-09-22T12:53:43Z}`. Commits after it are page-, script-, doc- and ledger-shaped; `check:brief` read UNVERIFIABLE (the brief route redirects to sign-in), advisory under `A-41` and never a pass.
- **Publish**: `npm run served` — `117 checked — 117 served, 0 in flight, 0 stale, 0 unreachable`, exit 0, 2026-09-25T00:03:53Z, anchored on `aee164c`.
- **Deploy drift**: NOTHING SWEPT for this lane, which is neither a stop nor a pass — this lane publishes through GitHub Pages and declares no Render service (`check-deployed-sha-drift.mjs`, run bare during Section 0 on 2026-09-22, 0 findings across 33 checksPass services, none ours).
- **Ledger**: 71 rows, 17 open — `show-item.mjs --index --status open` read 17 open of 70 before this pass; `W-13` was minted in it, so the row count is 71 after this pass.
- **Due gates**: four came due inside the dark window and all four were read through the runner in this pass, the W-3 sidecar stamped 2026-09-25T00:04:38Z — `A-49` EMPTY (the check is still unbuilt), `A-52` no `## arrivalShapes` line (the list is unwritten), `A-53` store and page AGREE at 20 drawn by position, `W-3` both advisory lines present and the page unchanged on both legs. All four re-dated with reasons.
- **Stale-actionable**: `items: []` of `consideredCount: 17`, `ledgerState: READABLE`, 4 excluded as parked/waived/clock-declared — `cc-endpoint-probe.mjs --endpoints items-stale-actionable`, exit 0, read at P4 on 2026-09-22.
- **Dead references**: **3 found, 3 addressed** — `check-doc-references.mjs` (exit 1) in this pass flagged two candidate script names inside `A-54`'s slip note, which existed only as names of things that are absent and are now described rather than cited, and this report's own path in the 09-22 primer, which this file resolves.
- **Tomorrow's primer**: `docs/cold-starts/2026-09-25.md` — the path this lane owes, resolved by `check-next-primer-exists.mjs` (exit 3 ABSENT in this pass, written here). Positive control: the same command resolved a non-empty path from this lane's declared convention and cross-checked the stamp, so ABSENT is a read of the file system rather than an unresolved convention.
