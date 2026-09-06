---
product: bounds-ledger
date: 2026-09-06
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 0bac107
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 3
top_action_today: "For weeks this page told you a number had been unchanged since a date. That was only ever true about when we started watching it — we know nothing about what the number did before we arrived — and it was printed on 418 of the rows, which made it the single most repeated claim on the whole site and the one claim we had no right to make. It now says tracked since, and no movement seen yet. Separately, a new check we built today found on its first run that a value one of the source papers actually proves could not be found by our own search; that is fixed. Nothing needs you. The question you asked on 26 August is still owed and is dated Tuesday."
---
# Daily — bounds-ledger — 2026-09-06

## BLUF

The page's most repeated sentence was the one claim we had no standing to make, and it is gone.

**FIRST ACTION.** Run the gate before reading anything; it is three minutes of network and it is what
finds the day.

```bash
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** `check-resolvability.mjs` prints a coverage ratio in the high
nineties, derived in *What changed* below. A cold reader will quote it as coverage. **Do not.** The
script prints its own `UNCALIBRATED` banner because its value/non-value split is a digit-run heuristic
that mis-sorts in both directions — it drops real short and symbolic bounds out of the denominator and
lets one non-value in. Both directions move the ratio and neither is bounded. The MISSES list is the
output; the percentage is not yet a number.

**DON'T-TOUCH.** The banner clause in `docs/cold-starts/2026-09-06.md` that pre-excuses `npm run
verify`'s exit 3, paired with the receipt's `failedGates` field. What makes it work is that the
pre-excuse **states its own boundary** — exit 3 *and* `check:brief` as the only failing leg — so any
widening falls outside it automatically and lands back on the agent. Widened to "verify is expected to
be red" it becomes the blanket dismissal that is this lane's founding defect.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing,
decisively** — a page label that asserted a property of the record, a search haystack that could not
find a value its own source paper proves, an assertion order that made two new guards unreachable, a
probe that would have reported a shipped fix as a broken probe, and a trigger field naming a date
already past — **no bound moved and no mathematical record changed**, so every defect today was in our
own machinery. **positive control: the same drift check that reports no movement today reported 15
changed files carrying two real record movements on 2026-09-05**, so today's silence is a reading and
not a dead probe.

**Of the 7 counted catches this week, 2 are numeric and 5 are BYTE-ONLY** — unchanged from yesterday
because `npm run catches` read 7 again at 18:06:35Z and no new movement landed today; the five remain a
row reorder in `47a`, a reorder in `53a`, an asterisk on `41a`, a row lifted from `50a`'s table into
prose, and an escaping fix in `8a`.

**Consecutive instrument-facing days: 1.** Yesterday's count was 0 because 09-05 was record-facing.
Written by hand, not by a counter, which is the point of it.

**The standing prediction is UNTESTED today, not confirmed and not falsified.** The registered claim is
that the next record-facing catch will come from the scheduled alarm rather than a human, and that what
our instruments will miss is not a bound but a CONVENTION — a curated table restating a value in a form
that changes what it asserts. No record-facing catch arrived today, so nothing tested it. The claim
stands as registered. **positive control: the alarm that would have tested it is live** — this
morning's scheduled `reverify` run completed `success`, and the same alarm went red on a real record
movement yesterday.

## What changed

**The date label, and it is the day's user-visible ship.** `whenLabel`'s `first` branch read
`first pinned <date> — unchanged since` on **418 of the rendered rows**. Both halves are true about our
pinning; only the first is true about the record. It now reads `tracked since <date> — no movement seen
yet`. The date survives deliberately — deleting the disclosure to avoid the over-read would trade it
for a silence, which is worse — and the subject moves to the only thing we observed. One change point,
two surfaces: `render-constant-pages.mjs` imports `whenLabel`, so `index.html` and all 115 constant
pages moved together (`5f9f021`).

**The worked case is the founding record.** Constant `1b`, the Erdős minimum-overlap constant this repo
opened on, read "unchanged since" at **one day old** while upstream's own `1b.md` lists two superseded
values as separate rows.

**The on-page hint was amended in the same commit, as a disclosure rather than a fix.** It said
"anything dated later is a row that has moved since", which is false for a constant we merely started
mirroring later. Shipping the label while leaving that paragraph asserting the twin over-claim one
screen below would have been half a fix. The `data-changed` sort key itself is untouched and still owns
its 09-11 gate.

**A value the source paper proves was unfindable on our own page** (`36a6b77`). `0.3809268534330870`,
pinned by `C-5`, returned zero hits on `index.html`. **positive control: the same `grep` over the same
file returned one hit each for `id="c-1b"`, for `0.380927` and for `0.380926`** — so the file was the
right document and the search could produce hits; only that value was missing. `C-5` could never have
supplied it: `aliasesFor` maps an alias to a constant by matching `constants/<id>.md` in the claim url,
and `C-5` points at the ar5iv paper. Aliased onto `C-2`; it now returns one hit.

**The resolvability figure, derived rather than asserted.** `node scripts/check-resolvability.mjs` at
18:0xZ printed `resolvability: 140 of 141 (99.3%) — UNCALIBRATED`. The denominator is every distinct
first-cell `expect` value in the committed history of `ledger/claims.json`; the numerator is those whose
numeric core appears in a `data-find` attribute of the built `index.html`. **Why 140 of 141 is not
coverage:** 60 further pinned strings were EXCLUDED as carrying no number a reader could hold, and that
exclusion is a 4-plus-digit-run heuristic which wrongly drops genuine short and symbolic bounds —
`$0.5$`, `432`, `$668$` and `$1+\sqrt{2}$` are all in the excluded list — while wrongly admitting a
Wikipedia footer line whose trailing year satisfies the same digit rule. Shrinking the denominator
raises the ratio and admitting a non-value lowers it, so the error is unbounded in both directions.

**`check-resolvability.mjs` exists** (`36a6b77`), `A-45`'s instrument, approved this morning as a Tier-1
leading indicator. Its denominator is deliberately NOT the renderer's: taking each row's `upperPrev` and
`lowerPrev` and checking they are in the haystack is circular, because `findKey()` builds the haystack
from those same fields, and it would print 100% forever while hiding exactly the failure it exists to
catch. It reads the committed history of `ledger/claims.json` instead.

**Two defects found in my own work, both caught by execution rather than review.** The first red-arm
proved less than it appeared to — the equality assertion ran first and short-circuited, so the two new
semantic guards could never fire (`13a8f72` reorders them). Then `A-42`'s own probe would have reported
the shipped fix as a broken probe, and rewriting it, the first draft recorded a two-match output the
command does not produce (`06f5b46`).

## Inputs (controllable)

- **Ships:** 6 commits, 2 user-visible. Both live on Pages, verified by build row and ancestry rather
  than assumed.
- **Gate discipline:** the gate was re-run at HEAD three times today rather than carried, each time
  because `check:deferrals` reads `continuity/items.json` and every commit touched it. A receipt over
  changed code cannot say which leg is red.
- **Ledger:** `A-45` minted and built the same day; `A-42` updated with the ship and a corrected probe;
  `A-34`'s `onTrigger` date corrected; `A-44`'s malformed key renamed; `docs/daily-config.md` gained the
  Step 0.7 drift leg with an as-of and a falsifier.
- **Sweeps:** four ran clean (approved-unshipped, tool-outage gates, prose commitments, due gates);
  instrument-liveness reads NOTHING SWEPT, which is neither a pass nor a finding.

## Outputs (lagging)

- **`G-4` = 0**, expected. `npm run reports` → a measured 0 outside arrivals, parts reconciling to the
  raw total.
- **Reach unchanged and tiny:** 1 unique viewer in the trailing 14-day window; `returnRate`
  INAPPLICABLE at n=1 against its own N_min of 3.
- **Resolvability: first reading taken, and not quotable.** See the BLUF.

## Recommendation

**Calibrate `check-resolvability`'s value/non-value split before its next reading, and do it by naming
the population rather than by tuning a digit threshold.** The current split is "has a 4+ digit run",
which is a proxy for "is a number a reader could hold" and fails in both directions. The honest fix is
to decide what counts as a citable bound — a symbolic bound like `$1+\sqrt{2}$` plainly is one, a status
field plainly is not — and until that is done the ruling's 14-consecutive-days-at-100% clause cannot
start counting. That clause is the one thing on this row with a clock, so leaving the split
uncalibrated quietly parks it.

**Give `A-34` its session on 09-08 and open with today, not with 09-05.** Yesterday's exhibit was a day
on which two records moved and the ledger had both by breakfast. Today's is smaller and sharper: an
instrument built in an afternoon found, on its first run, that a value the source paper proves could not
be found on our own page. Both belong in the proposal, because together they say the instrument works
and nobody is pointed at it.

**Do not let today's label fix stand as the whole of `A-42`.** The sort key is untouched, the disclosure
now says so out loud, and its 09-11 decision is real work rather than a formality.

## On hold pending data

- **`A-41`** — the brief leg became permanently unverifiable on 09-04 — reads 09-08. Pre-staged today:
  `check-brief.mjs` exits 3 and its positive control fires, naming the redirect target, so the
  Google-session wall still stands and the cheap escape is closed.
- **`A-20`** — should the fetch layer retry on 429/502 — reads 09-08, superseded in part by `note8`; F1
  is the owed fix, not the transient count.
- **`G-4`** — the Tier-0 goal — reads 09-26 as an INSTRUMENT read, which is answerable at n=0. Its
  OUTCOME read at 2026-11-06 inherits a denominator that cannot fill, and that is now recorded on
  `A-34` as evidence rather than re-dated.

## State Appendix

Written last, from live commands run at close. A document cannot name the commit that lands it, so the
HEAD below is the HEAD these commands read, not the one carrying this file.

- **HEAD at close:** `0bac107` — `git rev-parse HEAD`, 2026-09-06 ~18:0xZ.
- **Gate:** exit 3, `failedGates: ["check:brief"]`, seven other gates 0 — receipt at `0bac107`, written
  18:00:50Z, from `npm run verify`. That is `A-41`, dated 09-08; it is the banner's pre-excused shape
  and it is NOT a pass.
- **CI:** `RESULT: PASS — GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending
  (exit 0)` — from `node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml`.
- **Published page:** build row `e31b4ff ... built 2026-09-06T17:59:05Z` — from `gh api
  repos/u00dxk2/bounds-ledger/pages/builds`. Both ships are ancestors of it, proven with
  `git merge-base --is-ancestor`.
- **Mirror:** `No drift. 116 files match upstream 9d57db8` (an upstream `teorth/optimizationproblems`
  sha, which does not resolve in this repo — **positive control: `git cat-file -t` returns `commit` for
  a local sha such as `0bac107` and rejects `9d57db8` as not a valid object**, so the failure is the
  sha's origin and not a broken command) — from `npm run check:drift`.
- **Page:** 115 constants, both README sentences say 115 — from `npm run check:site` and
  `npm run check:state`.
- **Ledger:** 21 open of 58 rows, 0 gates due on or before today — from
  `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print`.
- **Reach:** 1 unique viewer in the latest 14-day window — from `npm run traffic`, 2026-09-06T17:15:43Z.
- **Arrivals:** 0 outside arrivals, measured and reconciled — from `npm run reports`.
- **Dependabot:** 0 open alerts — from `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open`,
  read after the last push of the day; `check-engineering-zero` → `RESULT: PASS (exit 0)`.
- **CLAUDE.md:** 39416 bytes, loaded 54604 against the ruled budget of 60000 — from
  `node ../skylark-site/scripts/check-claude-md-sizes.mjs --project bounds-ledger`, exit 0. Unit and
  budget are the ruling's, not mine: LF-normalized UTF-8 bytes via `measureDocSize`, budgets declared in
  `docs/size-budgets.md`. Not self-measured — three projects measured this wrong in one day on 8/07.
