---
product: bounds-ledger
date: 2026-09-07
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 91fedef
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 3
top_action_today: "For a while now, anyone reading a maths paper who held a fraction like 117/370 and typed it into our page's search was told we do not track that number. The number was sitting right there on the row. Our search only understood numbers written the way we store them, not the way a paper prints them, and it was wrong on 13 of our 115 rows. That is fixed and live. Separately, we found that most of the note fields in our own tracking file are read by nothing, so care put into them was going nowhere; the fields that are read are now written down. Nothing needs you. The question you asked on 26 August is still owed and is dated tomorrow."
---
# Daily — bounds-ledger — 2026-09-07

## BLUF

The search served the reader holding our markup instead of the reader holding the number, and that was
the whole promise of the page.

**FIRST ACTION.** Pull before anything, then run the gate — the gate takes three minutes of network and
it is what finds the day, but a receipt taken on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** `npm run catches` prints `0` for the week of 2026-09-07. A cold
reader will take that as a quiet week. **It is a PARTIAL week** — the script says so itself and refuses
to count the current one toward its month-of-zeros rule — and the last completed week read **7**. The
figure to quote is the per-week one against completed weeks, never the partial cell and never the
all-weeks total the same output prints beside it.

**DON'T-TOUCH.** The `hand:begin banner` region of the lane's current cold-start primer — named as the
REGION, not as a dated filename, because yesterday's report protected this same thing by naming
`docs/cold-starts/2026-09-06.md` and that pointer was one day stale by the time anyone read it. What
makes the region work is that its pre-excuse states its own boundary: exit 3 **and** `check:brief` as
the sole failing leg. Any widening falls outside it automatically and lands back on the agent.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing,
without exception** — a page search that could not find a value the page itself displays, a ledger whose
note fields are read by nothing, a gate row that had promoted a moving file count to an invariant, an
assertion of mine that tested a different question than it stated, and a commit-hook trigger shape that
mistakes a mathematical constant for a sha — **no bound moved and no mathematical record changed today**.
**positive control: the drift alarm that would have reported a movement is live and was read today** —
`check:drift` exited 0 with `No drift. 116 files match upstream`, and the same alarm went red on two
real record movements on 2026-09-05, so today's silence is a reading and not a dead probe.

**Of the catches counted this week, the figure is 0 and the week is PARTIAL; the last completed week
read 7, of which the numeric-vs-byte-only split is not re-derived here** because no new movement landed
today and re-quoting yesterday's split as though it were freshly measured is the exact staleness this
clause exists to prevent. Read it from `npm run catches` at the time you need it.

**Consecutive instrument-facing days: 2.** Yesterday was 1. Written by hand, not by a counter, which is
the point of it — and two is the number worth watching, because a lane that only ever finds faults in
its own tooling is maintaining itself rather than stewarding records.

**The standing prediction is UNTESTED, and it brushed past something today worth recording honestly.**
The registered claim is that the next record-facing catch will come from the scheduled alarm rather than
a human, and that what our instruments will miss is not a bound but a CONVENTION — a value restated in a
form that changes what it asserts. Today's defect *was* a form-not-value problem. But it was **our**
form, not a curated table's, and it was found by a probe I wrote rather than by the alarm. So the
prediction's subject was apt and its locus and its finder were both wrong, and nothing record-facing
arrived to test it. The claim stands as registered.

## What changed

**A reader holding `117/370` typed it in and the page said we do not track it** (`b5bd53d`). The
page's headline question is "you cited a number, is it still current?" — and every fraction lived in
the search haystack only as LaTeX. A researcher reading `117/370` off Gal2025 and typing it into the
filter got the empty state while that exact value sat in row `74a`.

Measured on the built page before the fix: **41 backslash-frac occurrences inside `data-find`, and 13
of 115 rows** carried at least one whose plain `a/b` form was absent — `74a`'s `117/370`, `46a`'s
`22/7`, `12a`'s `19/10368`, `88b`'s `28/157`, `78a`'s `167/117` and eight more. After: **0 of 115, with
the frac count still 41.** That second number is the control and it is the reason this is a measurement
rather than a claim: a "repair" that shrank the haystack would have scored identically on the row count
alone.

`findKey` now emits the slash form for every integer `frac`/`dfrac`. Digits-only deliberately — a
fraction over a square root has no form a reader would type, and inventing one puts a string in the
haystack matching nothing anybody holds. Negative controls over the shipped attributes with the shipped
predicate: `1/sqrt`, `sqrt{10}/1` and `999/998` each return no rows, so a hit means matching rather than
a haystack that swallows everything. Index-only: the 115 constant pages re-rendered byte-identically
because they carry no `data-find` at all and so have no filter to serve.

**Most of this ledger's note fields are read by nothing** (`dd42146`, corrected in `bd9d420`). Against
the fleet's field-consumer table, of 119 distinct field names in `continuity/items.json`: **33 tracked,
2 named, 80 unread, 4 too new to classify.** The 80 include the ordinary numbered notes from `note3`
onward — this is a property of the numbering convention, not only of ad-hoc names with a date welded
on. `A-44` (the row recording why the verify receipt named the wrong leg) had its close account moved
whole into `notes`, the most-read field in the table.

**And the correction to that finding was larger than the finding.** I read a three-verdict table as two,
splitting on "not `unread`", which silently counted every `named` field as read. `named` means
referenced only in a comment — read by nothing. `note2` is the trap: it looks like the obvious second
slot and is exactly as dead as `note7`. `docs/repo-layout.md`, the artifact shipped as the durable fix,
told the next row-writer that `note2` was a field a consumer reads; it was live and wrong for 25
minutes.

**`A-2`'s own note would have called a healthy mirror broken** (`bd9d420`). `A-2` (the standing
drift-resolution log) carried an addendum reading "the invariant is the words No drift. plus the FILE
COUNT". The count was 113 when that was written and 116 today, grown by our own resolution cycles on
09-05 and 09-06. A cold agent running the row against the invariant the row itself named would have
read a benign three-file gap as a violation. The 08-31 edit that added that paragraph fixed the sha half
of the same problem and promoted the count to invariant in the same stroke. The invariant is now the
words alone, with the count informational and carrying its as-of.

**`A-45`** (the Tier-1 leading indicator on stale-value resolvability) **has a date and an owner**
(`91fedef`): the value/non-value split calibration is dated 2026-09-13 — the same day as the row's own
`expectedSignalBy`, so it lands before the indicator's first verdict rather than after it — and owned by
this lane. Until it is done, the 14-consecutive-days-at-100% clause cannot start counting.

## Inputs (controllable)

- **Ships:** 4 commits, 1 user-visible, all pushed and all on `origin/main`.
- **Gate discipline, and it worked:** every ledger edit was batched and **one** `npm run verify` ran at
  the day's final HEAD covering four commits, instead of one run per commit. Yesterday paid three runs;
  today paid one, at roughly 450 requests each.
- **KP-78 (the standing rule that a detector ships only once it has been shown to fire with the
  condition present and stay silent without it) on the day's one new detector:** the slash-form
  assertion was red-armed by disabling the emit
  (mutation proven landed via `git diff --numstat`), producing `AssertionError: the emitted attribute
  must carry the SLASH form a reader types` at exit 1, then restored to exit 0. A second assertion
  covers the fabrication half and is reachable by a different mutation, so neither guard short-circuits
  the other.
- **Three errors of my own, all caught by execution rather than review:** a fabricated sha tail that made
  `gh run list` return an empty list indistinguishable from "no runs exist"; an assertion printing "no
  new ad-hoc key minted: false" that tested whether the row has ANY date-shaped key rather than whether
  this edit added one; and an inline regex whose `\f` became a form feed, silently reporting 0 affected
  rows where there were 13.
- **Sweeps:** approved-unshipped, tool-outage gates and prose commitments all clean. Instrument-liveness
  reads NOTHING-SWEPT, which is neither a pass nor a finding.

## Outputs (lagging)

- **`G-4` = 0**, expected, and MEASURED rather than assumed: `npm run reports` fetched 29 issues,
  excluded 29 as ours by author, and the parts reconcile to the raw total, so the probe demonstrably
  sees issues and accounts for every one.
- **Reach, 14-day window: 1 unique viewer.** `returnRate` is INAPPLICABLE at n=1 against its own N_min
  of 3; the arithmetic is printed rather than hidden so the figure that eventually replaces it stays
  auditable. Clone figures are unattributed by construction — our own CI checkouts are in them.
- **The page is verifiably serving the fix**, which is the one output that moved: a live GET returned
  200 and 297,180 bytes, positive controls first (`c-74a` present, 115 rows), then `74a`'s `data-find`
  carrying `117/370`.

## Recommendation

**Calibrate `check-resolvability`'s value/non-value split by naming the population, not by tuning the
digit threshold — it is now dated 2026-09-13 and owned, so the recommendation is to hold that date
rather than to re-decide it.** The current split is "has a numeric run of 4+ digits", which drops
genuine short and symbolic records out of the denominator and admits a Wikipedia footer year. Today
supplies a second reason beyond the ratio: the excluded list is where the fraction defect was hiding,
because `$\frac{117}{370}$` carries no 4-digit run and so was never tested for resolvability at all. The
split is not only distorting the number, it is deciding what gets checked.

**Treat the commit hook's third trigger shape as a fleet report, not a local workaround.** In a ledger
whose subject is high-precision constants, any bound of 16-plus digits is indistinguishable from hex —
today's refusal was Haugland's `0.3809268534330870` with the decimal stripped. A fix keyed only to
`sha256`-named JSON keys clears neither that nor the legitimately-cited upstream commit sha.

## On hold pending data

- **`W-3`** (watch for acknowledgement of the erdosproblems.com/36 correction) — the signal is an
  upstream human action nobody here can schedule, and the row exists to stop us re-asking.
- **`W-6`** (read window for the README report-an-error channel) — the arrival count is a measured 0 and
  the denominator cannot fill quickly at 1 unique viewer per 14 days. Not re-dated to hide that.
- **`G-2`** (contribute a verified bound improvement upstream) — gated on finding one; `gap-table.mjs`
  is the instrument and it asserts nothing mathematical.

## State Appendix

Written last, from live commands, because a report cannot name the commit that lands it.

- **HEAD** `91fedef` — `git rev-parse HEAD`, and `git rev-list --count origin/main..HEAD` = 0, so
  everything described here left this machine.
- **Verify receipt** — `exitCode 3`, `sha 91fedef22beb1176fd5873f901b5f05fee7ca254`, at
  `2026-09-07T16:20:56.296Z`, `failedGates: ["check:brief"]` as the sole entry with every other leg at
  exit 0. That is the pre-excused `A-41` auth wall (the brief check became script-unverifiable when
  `/t/*` went Google-session-only), not a lane failure. Its clearing condition — an exit 0 — is unmet,
  so `A-41` has not moved.
- **Claims** — `241 claim(s): 239 hold, 0 broken/unreachable, 2 unverified (manual)`, the two manual
  being the pins on a site that 403s CI, which is their designed state.
- **CI** — `dd42146` and `b5bd53d` both `success` on `reverify` AND `pages-build-deployment`, read with
  full 40-hex shas from `git rev-parse` after a fabricated abbreviation returned an empty list.
- **Dependabot** — 0 open alerts, read after the last push of the day.
- **Continuity endpoints** — all three returned HTTP 200.
- **CLAUDE.md budget** — 41,091 bytes; 56,279 loaded against a ruled 60,000, measured by
  `check-claude-md-sizes.mjs --project bounds-ledger` in the unit that script declares
  (`utf8-bytes-lf`, LF-normalized UTF-8 bytes via `measureDocSize`) against the budget ruled in
  `docs/size-budgets.md` — not self-counted. Within budget, exit 0.
