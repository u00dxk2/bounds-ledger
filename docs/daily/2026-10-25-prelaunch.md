---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-25
lifecycle_stage: launched
last_deploy: 97814b0 (HEAD at the 10-25 kickoff)
on_hold_items: 1
top_action_today: read the last four rows of the offset-0 grid against their sources (A-47 slice 22) and publish each verdict on its constant page
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-25 (Sunday, MT)

## BLUF

Four more numbers on our pages now say what their cited papers show. Three are backed, one only as a conjecture and one only as an unchecked forum comment, and the pages say which. One could not be settled because the journal copy was out of reach. One cited paper turned out to have been withdrawn by its author in August, and its page now says so. Nothing waits on David: the 87a question keeps waiting, as he said.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** four more cited rows read against their sources, each verdict shown on its constant page, the audited count moving from 98 to 102 (baseline: `node scripts/depth-audit.mjs`, read 2026-10-25 before the draw). Item: `A-47` (the depth audit David ruled on 2026-09-09: read our own cited records against their sources on a schedule), slice 22, pulled forward from its 10-27 re-read date on the kickoff's proposal. Nothing in the row forbids it: its `closeWhen` says it "gets a re-read date rather than a signal date" (not David's words), and the four positions were fixed by slice 20's grid, not chosen today.

**The user problem, in the user's words:** "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (`docs/evangelism-bar.md`). A row checked against its paper tells the reader the cited source actually says what we print, or says plainly where it does not.

**Section 0.**
- Primer: `docs/cold-starts/2026-10-24.md` (no 10-25 primer; the newest on or before today), banner read whole.
- Listener: 🟢 SSE alive (session start 15:57:36Z, pid 23880, relaunched by the SessionStart hook; hello read in `tmp/.bus-listen.err` below the newest restart marker) + loop armed by `ScheduleWakeup` tool call; waker ladder ranks 1-3 running (rank 1 relaunched after its 16:16Z wake-shorten exit).
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 16:09:27Z).
- CI: GREEN on `reverify.yml` and on `page-check.yml` at commit `97814b09c9` (`check-ci-status.mjs --repo … --workflow <file>`, exit 0 each).
- Deploy drift: NOTHING SWEPT for this lane. It is a GitHub Pages lane with no Render service, so the fleet read (`check-deployed-sha-drift.mjs`, exit 0, 37 services) neither stops nor passes it.
- Harness: running 2.1.310 · fleet UNIFORM (27 of 27 panes) · installed 2.1.310 (SAME).
- Recs yesterday: none new for David (`docs/daily/2026-10-24-prelaunch.md` § Recommendation: "none new. `A-88` keeps waiting, as he ruled." (not David's words), our own report's line). Nothing to disposition.
- Verify: `npm run verify` was launched in this P1 (after the kickoff row's 16:12:32Z) and is still queued in the fleet heavy-job gate at 16:51:34Z ("waiting (position 6; holding 2/6: tomasmaps-nyfinal; …)", the newest line in `tmp/verify-out.txt`); no receipt yet. CI is GREEN at the same commit (above), so nothing in this packet rests on the local run. Its result is recorded at P3.

**Evidence** (each read today, 2026-10-25 MT):
- OBSERVED · `node scripts/depth-audit.mjs` · exit 0, "98 row(s) audited — 59 sound, 1 defective, 26 unresolved, 12 unreachable", 89 drawn by position, "the stored 726 cited rows match the live corpus at this read" · unchanged since slice 21 on 10-24, as expected before slice 22.
- OBSERVED · `node scripts/depth-audit.mjs --draw 550 600 650 700` (stdout to `tmp/a47-slice22-draw.txt`, nothing opened) · exit 0, frame 726, "store: 0 of 4 drawn position(s) land on a row already held, read against 98 audit store entries". The four: 67a [HC2015] upper 4 (a "conjectured endpoint"); 79a [BR1997] upper 1; 84a [MO511514] lower 1.0333487… (a MathOverflow comment the row itself marks "Unverified"); 88a [Pol14b] upper 246. These are the last four positions on slice 20's offset-0 grid (`A-47.slice21Result2026_10_24`: "four positions remain … 550, 600, 650 and 700").
- OBSERVED · `node C:/dev/skylark/skylark-site/scripts/answered-cards.mjs --project bounds-ledger` · "0 NEW since last read"; card `ec0cfe11` answered "Keep waiting." (governs `A-88`, re-read 10-31).
- OBSERVED · `npm run reports` · 34 issues fetched, 34 ours, 0 outside arrivals; parts reconcile 34 + 0 + 0 = 34. Expected zero.
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- MISSING · whether any reader opens the four pages. The pages carry no analytics (`A-59`, the blind encounter on the public pages).

**One prior-day retro finding that bears on the choice:** the 10-24 round's two review catches (35a stored SOUND on a rate proved only at chosen horizons; 46a stored UNREACHABLE while its saved OpenAlex record held the text). Both go into the reader brief as rules before any reader starts. 67a's row is a "conjectured endpoint" and 84a's is marked "Unverified" by the row itself, so each verdict must say what the row claims before it says whether the source backs it.

**Two HYPOTHESES for the review, both about the draw field, raised before anything is committed:**
- 84a's row text names a MathOverflow commenter by handle. The mirror already carries it (upstream's public text), but the slice 21 draw field pasted the draw's stdout whole into `continuity/items.json`. Proposal: the slice 22 draw field quotes 84a by position, fingerprint and reference key, and leaves the handle out, under the 2026-08-05 disclosure review's third-party-handle blocker.
- 88a's row says "Stood as the record for twelve years." That is upstream's wording. Our page and verdict text must not repeat "record", per this repo's rule that generated rows assert listing position, never "the record".

**Permission:** `A-47` is open, David-ruled, not parked or frozen. Reading sources and storing verdicts is inside the lane's authority. Any citation defect found is recorded on our page, never filed upstream (outward gate).

**Next action:** improve (four rows of the public pages gain a checked verdict). Slice 21's procedure, unchanged: record the draw and each row's claim on `A-47` and push before any source is opened, then one reading agent per row (brief copied from `tmp/depth-reads/slice21/brief-common.md`; a secondary source named in the row is corroboration only), the lead dispositioning each verdict against the saved source, then store, render, a Codex read-only review of the stored verdicts and the page diff, push, and read back. First command, after the review approves:

```bash
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 550 600 650 700
```

**Acceptance condition:** `node scripts/depth-audit.mjs` exits 0 with 102 audited and 93 drawn by position, its sound / defective / unresolved / unreachable counts quoted before and after and summing to 102; the draw is pushed before the first reading agent's first request; each of the four constant pages (`c/67a.html`, `c/79a.html`, `c/84a.html`, `c/88a.html`) shows its new verdict, read back from the served page by `npm run served`; `npm run check` is green after the commit. Any DEFECTIVE row is today's fix on that page, with the census line quoted before and after. The offset-0 grid is then exhausted; the next grid is derived and pre-registered on a later day, not today.

**Delivery and encounter checks:** `npm run served` after the push (SERVED for every touched page, inside the 300 s in-flight window). The encounter would be an outside report through a per-row link on one of the four pages, counted by `npm run reports`; at this lane's traffic that is readable at N = 1 and expected zero today.

**USER-FACING: yes** — paths: `continuity/depth-audit.json` (rendered onto the constant pages), `c/67a.html`, `c/79a.html`, `c/84a.html`, `c/88a.html`, `index.html` (if its audited count line moves), `continuity/items.json`, `docs/daily/2026-10-25-prelaunch.md`.

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: 2 — `A-45` (the stale-value resolvability indicator, `expectedSignalBy` 2026-10-25) and `A-84` (move the newer-results store refusal ahead of buildRows, `nextCheckDate` 2026-10-25, readCommand never run), read from `check-due-gates-dispositioned.mjs --snapshot` ("2 gate(s) due on/before 2026-10-25").
- (b) owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger: 0 of 769".
- (c) state reads marked CROSSED: none — read the kickoff's state block (stale-actionable 0 of 24; missingLinkedCommits NOTHING SWEPT, 0 of 0, which is an empty read, not a clean one).

## What changed

`A-47` (the depth audit) slice 22 is read, stored and live: the draw in `8881aa2`, the verdicts in `50ac7ce`, Codex round 1's fixes in `9288df5`, all pushed. The draw's runs were created at 2026-10-25T18:47:00Z, and the readers' first requests were 18:54:29Z to 18:55:00Z.

- `A-47-0099` 67a [HC2015]: SOUND, as a statement of the conjecture. The cited 2015 preprint states Brennan's conjecture for p in (4/3, 4) and presents it as a conjecture, not a proved bound. Its author withdrew it on arXiv on 13 August 2026 ("Incorrect theorem statement"), and the page says so.
- `A-47-0100` 79a [BR1997]: SOUND. The 1997 Compositio article's Theorem 6.5(c) proves ed(S_n) ≤ n − 3 for n ≥ 5. The step to the bound 1 is the row's own arithmetic, and the page says so.
- `A-47-0101` 84a [MO511514]: SOUND, only as to what the comment says. It exists, dated 22 May 2026, not edited, with δ = 0.0333487156372102 by the weighted-Zassenhaus route and no proof. Nothing about whether the bound holds.
- `A-47-0102` 88a [Pol14b]: UNRESOLVED. The journal edition was not reached; two arXiv editions state H1 ≤ 246 unconditionally.

`node scripts/depth-audit.mjs` before: "98 row(s) audited — 59 sound, 1 defective, 26 unresolved, 12 unreachable". After: "RESULT: PASS — 102 audited, 62 sound, 1 defective, 27 unresolved, 12 unreachable (exit 0)", with 93 drawn by position. The offset-0 grid is now exhausted; `A-47` is re-dated to 2026-10-28 for the next grid.

Codex read-only round 1 on `50ac7ce` returned do-not-ship with three findings, all CONFIRMED and fixed in `9288df5`; no verdict label changed. One was older than today: slice 19's entry `A-47-0088` named the MathOverflow commenter in our own evidence prose. Round 2 on `9288df5` returned ship. Both banners read `workdir: C:\dev\skylark\bounds-ledger`.

The P1 review's two hypotheses: the handle is out of every field this lane wrote, and the store's `rowText` keeps the mirrored row verbatim because the identity check requires it. "record" is absent from `c/88a.html`. Its third hypothesis held too: 67a and 84a each carry a SOUND whose sentence says what kind of claim it is.

<!-- findings:begin -->
67a's cited preprint (arXiv:1509.00270) was withdrawn by its author on 2026-08-13 with the comment "Incorrect theorem statement". Upstream's 67a file cites it for both rows and does not say so. We found it by reading the cited work's own arXiv record during the audit, after searching this lane's record and upstream's pull requests for the arXiv id first (`gh search prs --repo teorth/optimizationproblems 1509.00270`, 0 results). Positive control: the same search for `87a` returned pull request 151. The 3.422 lower row was not read. Nothing is sent upstream (outward gate).
<!-- findings:end -->

## Inputs (controllable)

Four reading agents (one per row) and one hygiene helper. The helper drafted `A-45` (230 of 230 resolvable, same as 10-18; re-date proposed) and left `A-84` undrafted because its self-test hit the 180 s `--run` cap and stamped nothing. Its checks passed: wait-justification ("1 of 108 row(s) carry `waitJustification`") and engineering-zero ("lane bounds-ledger: 0 findings"). Positive control: the same run counted 5 findings in other lanes, so it reads findings. Two Codex read-only rounds. The permission classifier refused the 88a reader's requests to the journal's SpringerOpen article page as "Bot Check Circumvention", and they were not retried.

`npm run verify` was stopped by the low-memory reaper before it ran its checks, and was not re-run: CI was green at each pushed commit (`reverify.yml` and `page-check.yml` green at `9288df5`, `check-ci-status.mjs --wait`, exit 0 each).

## Outputs (lagging)

`npm run reports` (G-4, an outside party acting on a watched record without us filing the report) read 34 raw issues, 34 ours, 0 outside arrivals; 34 + 0 + 0 = 34. Expected zero. Positive control: the probe saw and classified all 34 issues. Four pages changed today (`c/67a.html`, `c/79a.html`, `c/84a.html`, `c/88a.html`), and the pages carry no analytics (`A-59`, the blind encounter), so whether anyone read them is not observable. Delivery: the pages just listed and `index.html` are served byte-identical to HEAD (fetched and compared, Last-Modified 2026-10-25 19:29:41 GMT); `npm run served` read 2 of 2 SERVED for `9288df5`'s pages.

Today's findings were mixed, and I classify the day as record-facing: upstream's 67a file cites a preprint its author withdrew, found by a human reading the cited work's own arXiv record during the depth audit and not by any alarm, which is the shape the standing prediction names (a citation-quality defect in a mirrored entry, found that way), so the prediction holds and stays as written. The other three were instrument-facing, all in our own prose and caught by review: a forum handle in an older entry's notes, 84a's "not checked" and 88a's erratum sentence. No drift ran red, so no counted catch was numeric or byte-only. Running count of consecutive instrument-facing days: 0 (it was 2 at the 10-24 close).

## Recommendation

For David: none new. `A-88` keeps waiting, as he ruled. The withdrawn-preprint note is held on `A-91` at the outward gate; I am not asking to raise it upstream.

## On hold pending data

`A-88` (the 87a question to upstream): waiting on pull request 244, re-read 2026-10-31, per card `ec0cfe11`.

## State Appendix

Written last, from live commands. A report cannot name the commit that lands it, so HEAD here is the commit before this close.
- HEAD as of 2026-10-25T20:13Z: `262f767` (`git rev-parse HEAD`), equal to origin/main. Release: `git -C C:/dev/skylark/bounds-ledger log -1 --format=%h`.
- CI as of 2026-10-25T19:45Z: `reverify.yml` green at `262f767`; `reverify.yml` and `page-check.yml` green at `9288df5` (`check-ci-status.mjs --wait`, exit 0 each). Release: `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`.
- Depth audit: "RESULT: PASS — 102 audited, 62 sound, 1 defective, 27 unresolved, 12 unreachable (exit 0)". Release: `node scripts/depth-audit.mjs`.
- Ledger: 109 rows, 25 not closed (the primer generator's state line). Release: `node scripts/sky.mjs gen-primer-first-action.mjs --repo . --target-date 2026-10-25 --json`.

### Close

ACTION: COMPLETED · item `A-47` (the depth audit) · P3 83de08bf. The packet's acceptance condition held: 102 audited and 93 drawn by position, quoted before and after; the draw was pushed before the first reader's request; each of the four pages shows its verdict, served as committed. The orchestrator's review read it COMPLETED (bus 0949c24d) after fetching the pages itself.

Ledger delta at the close (`continuity-edit.mjs`, each dry-run first):
- `A-45` (the stale-value resolvability indicator): `expectedSignalBy` 2026-10-25 → 2026-11-01. AMENDED from the hygiene draft's `--extend`, because `--extend` also rewrites the row's other date fields (the 10-11 and 10-18 precedent).
- `A-84` (move the newer-results store refusal ahead of buildRows): `nextCheckDate` and `expiresOn` 2026-10-25 → 2026-10-27, with the reason on `A-84.redate2026_10_25`. Its self-test hit the 180 s `--run` cap and stamped nothing; the fix itself was not started.
- `A-47` (the depth audit): `slice22Result2026_10_25` recorded; `nextCheckDate` 2026-10-27 → 2026-10-28 for the next grid, because the offset-0 grid is exhausted.
- `A-91` minted: the 67a withdrawn-preprint note, held at the outward gate, re-checked 2026-11-01.

`check-due-gates-dispositioned.mjs`: "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot "CURRENT (taken 2026-10-25)".

Pending reads: the next grid's draw (2026-10-28, `A-47`); `A-84`'s fix (2026-10-27); `A-91`'s re-check (2026-11-01). The encounter on the four pages stays blind (`A-59`).
