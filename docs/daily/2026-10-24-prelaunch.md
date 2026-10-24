---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-24
lifecycle_stage: launched
last_deploy: 9a659d0 (HEAD at the 10-24 kickoff)
on_hold_items: 1
top_action_today: read five more cited rows against their sources (A-47 slice 21) and publish each verdict on its constant page
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-24 (Saturday, MT)

## BLUF

Five more numbers on our pages now say what their cited papers show. One paper fully backs its number. Two back it only in part, and two could not be opened. A review caught two of my first verdicts going the wrong way before they went live. Nothing goes upstream: David said to keep waiting on the 87a question.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** five more cited rows read against their sources, each verdict shown on its constant page, the audited count moving from 93 to 98. Item: `A-47` (the depth audit David ruled on 2026-09-09: read our own cited records against their sources on a schedule), slice 21, due today; the kickoff's ONE JOB.

**The user problem, in the user's words:** "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (`docs/evangelism-bar.md`). A row checked against its paper tells the reader the cited source actually says what we print, or says plainly where it does not.

**Section 0.**
- Primer: `docs/cold-starts/2026-10-23.md` (no 10-24 primer; the newest on or before today), banner read whole.
- Listener: 🟢 SSE alive (hello 14:53:36Z, pid 31240, relaunched by the SessionStart hook) + `/loop-tick` armed by tool call; waker ladder ranks 1-3 running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 15:00:18Z).
- CI: GREEN on `reverify.yml` and on `page-check.yml` at commit `9a659d0b2a88a6a5d742ae9201bb94fa9f204c7b` (`check-ci-status.mjs`, exit 0 each).
- Deploy drift: NOTHING SWEPT for this lane. It is a GitHub Pages lane with no Render service, so the fleet read (`check-deployed-sha-drift.mjs`, exit 0, 37 services) neither stops nor passes it.
- Harness: running 2.1.310 · fleet UNIFORM (27 of 27 panes) · installed 2.1.310 (SAME).
- Recs yesterday: one, for David on card `ec0cfe11`, to keep waiting on pull request 244. Ruled: his reply on the card agrees, so `A-88` keeps waiting; executed this morning as below.

**Evidence** (each read today, 2026-10-24 MT):
- OBSERVED · `node scripts/depth-audit.mjs` · exit 0, "93 row(s) audited — 58 sound, 1 defective, 24 unresolved, 10 unreachable", 84 drawn by position, stored 726 cited rows matching the live corpus · unchanged since the 10-22 read, because slice 21 has not been read yet; that is the gap today closes.
- OBSERVED · `node scripts/depth-audit.mjs --draw 300 350 400 450 500` · exit 0, frame 726, "store: 0 of 5 drawn position(s) land on a row already held, read against 93 audit store entries". The five: 35a [AP24] lower 1.271, 3e [FrPi73] upper 4/3, 46a [Tom1975] upper 4, 50a [LP24] lower 0.595, 57b [Yan1995] lower 1/2 + 10^−335. Positions are the next five on slice 20's offset-0 grid (`A-47.slice20Result2026_10_19`: "nine positions remain … 300 through 700"); four remain after today.
- OBSERVED · `gh pr view 244 --repo teorth/optimizationproblems --json state,reviewDecision,mergedAt,closedAt,updatedAt,reviews` (by hand) · OPEN, reviewDecision empty, updated 2026-10-23T14:12:51Z, one review, APPROVED, association CONTRIBUTOR. No owner response, so `A-88`'s next check moved to 2026-10-31 (`continuity-edit.mjs`, dry run first; before `2026-10-24`).
- OBSERVED · `npm run reports` · 34 issues fetched, 34 ours, 0 outside arrivals; parts reconcile 34 + 0 + 0 = 34. Expected zero.
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- MISSING · whether any reader opens the five pages. The pages carry no analytics (`A-59`, the blind encounter on the public pages).

**One prior-day retro finding recurred and bears on the choice:** yesterday's Q2, "wish I had delegated" the record-and-upstream search. Before any of today's five is called DEFECTIVE, a helper searches this lane's record and upstream's merged and open pull requests for that row's value, as `W-11` (search this lane's record before calling a claim decision-ready) asks.

**Permission:** `A-47` is open, David-ruled, not parked or frozen. Reading sources and storing verdicts is inside the lane's authority. Any citation defect found is recorded on our page, never filed upstream (outward gate).

**Next action:** improve (five rows of the public pages gain a checked verdict). Slice 20's procedure, unchanged: record the draw and each row's claim on `A-47` and push before any source is opened, then one reading agent per row, the lead dispositioning each verdict against the source, then store, render and re-read. First command:

```bash
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 300 350 400 450 500
```

**Acceptance condition:** `node scripts/depth-audit.mjs` exits 0 with 98 audited and 89 drawn by position, its sound / defective / unresolved / unreachable counts quoted before and after; the draw is pushed before the first reading agent's log begins; each of the five constant pages (`c/35a.html`, `c/3e.html`, `c/46a.html`, `c/50a.html`, `c/57b.html`) shows its new verdict, read back from the served page by `npm run served`; `npm run check` is green after the commit. Any DEFECTIVE row is today's fix on that page, with the census line quoted before and after.

**Delivery and encounter checks:** `npm run served` after the push (SERVED for every touched page, inside the 300 s in-flight window). The encounter would be an outside report through a per-row link on one of the five pages, counted by `npm run reports`; at this lane's traffic that is readable at N = 1 and expected zero today.

**USER-FACING: yes** — paths: `continuity/depth-audit.json` (rendered onto the constant pages), `c/35a.html`, `c/3e.html`, `c/46a.html`, `c/50a.html`, `c/57b.html`, `index.html` (if its audited count line moves), `continuity/items.json`, `docs/daily/2026-10-24-prelaunch.md`.

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: none — read `check-due-gates-dispositioned.mjs --snapshot` ("1 gate(s) due on/before 2026-10-24", A-47, which is the choice; `A-88` was re-dated this morning and is no longer due).
- (b) owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger: 0 of 764".
- (c) state reads marked CROSSED: none — read the kickoff's state block (stale-actionable 0 of 24; missingLinkedCommits NOTHING SWEPT, 0 of 0, which is an empty read, not a clean one).

## What changed

`A-47` (the depth audit) slice 21 is read, stored and live, in `ab59444` and `bcfa882` on top of the draw in `2ec1d7b`. The draw's runs were created at 2026-10-24T15:21:41Z, and the readers' first requests were 15:22:55Z to 15:23:29Z.

- `A-47-0094` 35a [AP24]: UNRESOLVED. The article's Theorem 1 gives the rate n^(−log2(1 + √2)) for its Silver Stepsize Schedule, but only at the horizons n = 2^k − 1. The constant asks for every k.
- `A-47-0095` 3e [FrPi73]: UNREACHABLE. No copy of the 1973 Kalinin collection was found through the recorded routes. MR spells the second author "Pigarev"; not settled.
- `A-47-0096` 46a [Tom1975]: UNRESOLVED. OpenAlex's extracted text of the note proves the theorem for 1 < p < 2(n + 1)/(n + 3), with the endpoint credited to Stein. The row's 4 for the 2-sphere is our substitution and duality. The note itself credits the case n = 3, p < 4/3 to Sjölin.
- `A-47-0097` 50a [LP24]: SOUND. The ICALP 2024 paper's Theorem 11 says "a 0.595-approximation for any weighted input graph".
- `A-47-0098` 57b [Yan1995]: UNREACHABLE (paywall). The row's own survey [BS2023] was read as corroboration only. It credits Yanagihara with a bound on the locally univalent Bloch constant, from which the bound on Landau's constant follows.

`node scripts/depth-audit.mjs` before: "93 row(s) audited — 58 sound, 1 defective, 24 unresolved, 10 unreachable". After: "98 row(s) audited — 59 sound, 1 defective, 26 unresolved, 12 unreachable", with 89 drawn by position.

Codex read-only round 1 on `ab59444` returned do-not-ship with four findings, all CONFIRMED and fixed in `bcfa882`. 35a went from SOUND to UNRESOLVED and 46a from UNREACHABLE to UNRESOLVED; the other two were wording fixes on 3e and 57b. Round 2 on `bcfa882` returned ship. Both banners read `workdir: C:\dev\skylark\bounds-ledger`. The review's second hypothesis held: the draw named 3e's and 57b's secondary sources before reading, and neither became SOUND on them.

<!-- findings:begin -->
The packet's acceptance condition named 98 audited and 89 by position, which held. Its draft verdicts did not: the first stored version had 35a SOUND and 46a UNREACHABLE, and both were wrong in opposite directions, caught by review before the push.
<!-- findings:end -->

## Inputs (controllable)

Five reading agents (one per row) and one hygiene helper, which drafted no dispositions because all three input lists were none; its two checks passed (wait-justification and engineering-zero). Positive control: the wait-justification check found 2 of 108 rows in scope, so it was reading the ledger. Two Codex read-only rounds. The permission classifier refused two batches of 57b's routes, and they were not retried: an Internet Archive capture of the Springer PDF and its availability check, Springer preview images, the zbMATH search API, BASE, and two Internet Archive searches.

Low-memory reap: the reaper stopped all three waker rungs and the first Codex run. The rungs were relaunched at 16,090,452 KB free. The orchestrator's 10:37 MT heavy-job slot reached this pane after both Codex runs had finished (the round 1 rerun ended 10:23:20 MT, round 2 ran 10:29 to 10:35 MT), so both overlapped other lanes' slots. `npm run check` ran after 10:37.

## Outputs (lagging)

`npm run reports` (G-4, an outside party acting on a watched record without us filing the report) read 34 raw issues, 34 ours, 0 outside arrivals; 34 + 0 + 0 = 34. Expected zero. Five pages changed today, and the pages carry no analytics (`A-59`, the blind encounter), so whether anyone read them is not observable.

Today's findings were instrument-facing: both of the day's real defects were in our own verdicts (35a stored too strong, 46a too weak), caught by review, not in a mirrored record. Three record-side observations stay unsettled and are not catches: 3e's "Pigarev" against "Pigaev" (metadata only), 46a's credit of the n = 3 range to Sjölin (from an index's extracted text), and 57b's attribution through the locally univalent Bloch constant (from a secondary source). Each is of the predicted citation-quality shape, but none was read in the cited work. No drift ran red, so no counted catch was numeric or byte-only. Running count of consecutive instrument-facing days: 2. The standing prediction in `CLAUDE.md` is unchanged.

## Recommendation

For David: none new. `A-88` keeps waiting, as he ruled.

## On hold pending data

`A-88` (the 87a question) waits on an owner response to teorth/optimizationproblems#244, re-read 2026-10-31. `G-2` (the bound-improvement search goal) is held to 2026-11-19.

## State Appendix
