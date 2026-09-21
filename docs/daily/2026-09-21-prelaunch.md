---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-21
lifecycle_stage: launched
last_deploy: 07b8f0be (GitHub Pages build "built" at 2026-09-21T16:32Z; this lane deploys by Pages, not Render)
on_hold_items: 0
top_action_today: slice 6 of the depth audit, read and published
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: it is pre-revenue with no billing, no analytics on the published page, and
# no Sentry project. A null is a fact about the instrument; a 0 would be a claim about the world.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# Daily report — bounds-ledger — 2026-09-21 (MT)

## BLUF

**FIRST ACTION (tomorrow, 2026-09-22):** build the published-page check for `A-55` (the Pages-publish blind spot filed today) — fetch a live page, assert a string the current commit put there. The first command prints what a reader is actually being served, which is the thing no gate here reads:

```bash
curl -s https://u00dxk2.github.io/bounds-ledger/c/35a.html
```

**DON'T-TOUCH:** the pre-commit sha guard (`check-staged-shas-resolve`) and the bus post's `verify-sha` gate. Between them they refused a nine-character commit id I had invented from a seven-character one, in the post reporting a send. They work because they resolve every sha-shaped token against real objects instead of checking that it looks like a sha.

**The day in one line:** slice 6 of the depth audit was read and published, and the audited count moved for the first time in five days.

Two things landed beside it: David approved the dead-link correction and it is open upstream as pull request #194, and a review before the commit downgraded one verdict and corrected a public sentence that had been under-counting our own draws.

## What changed

- **Slice 6 landed and is live** (`874e411`). Five cited bound rows read against their sources: 1a [IX2026] SOUND, 21a [CNV1987] SOUND, 28a [Bon2014] SOUND, 3e [HRY1999] SOUND, 35a [B2015] UNRESOLVED. `node scripts/depth-audit.mjs` reads `29 row(s) audited — 17 sound, 0 defective, 6 unresolved, 6 unreachable`, where every read from 2026-09-16 to this morning printed 24 audited — 13 sound, 0 defective, 5 unresolved, 6 unreachable.
- **The correction was sent** (`2efa648`). David answered at 16:30:11Z; the four pre-send checks ran in the draft's order; https://github.com/teorth/optimizationproblems/pull/194 is open with 2 additions, 2 deletions, 2 files. `A-51` (the dead upstream citation link) closes on the send and `W-12` (does upstream act on it) watches the outcome, dated 2026-09-28.
- **Two defects fixed before the commit, both found by adversarial review.** 35a was stored SOUND on an overview passage that defers its hypotheses to an unread section — now UNRESOLVED. And every page printing the ledger-wide figure said "15 row(s) were drawn by position" while 20 had been drawn; it now reads "20 row(s) have been drawn by position … the sources of 15 were read and 5 could not be read at all".
- **One more page fix after the manager's read** (`9065909`): `c/35a.html` called [B2015] the row's cited source, where that row's Reference column reads Folklore. The page now says so.
- **Four rows moved**: `A-55` (the publish blind spot, dated tomorrow) and `W-12` (the watch on upstream's response to pull request #194) were minted; `A-53` (the audit store and the public page can disagree about how many rows were read) gained a second instance on the index badges; `A-54` (the second watched area, Small Ramsey Numbers) gained the two frozen-page defects and today's rebuild scoping.

**Findings classification: today was BOTH, and the instrument-facing streak ends at five.** Three findings are record-facing — all citation-level, none a bound movement — and all three sit in upstream files this lane mirrors: 21a's entry gives the title as "A low bound" and the year 1987 where the paper prints "A Lower Bound" and 1988; 3e's `[FrPi73]` spells the co-author "Pigaev" where HRY1999's own reference list has "Pigarev"; 28a's supporting quotes follow the arXiv wording rather than the journal the entry cites. Four more are instrument-facing: the 35a verdict, the drawn-count sentence, the 35a page's "cited source", and the Pages build that failed twice while every gate stayed green. On the counted figure, `npm run catches` reads **0 movements this week and 2 completed consecutive weeks at none** — so the numeric-or-byte-only question does not arise today, because nothing was counted either way, and that counter still cannot see the second watched area. **The standing prediction is now half-refuted and stays on the record:** it claims the next record-facing catch will be a witness-value mismatch on a recently added constant, found by a human recomputing a certificate. Today's record-facing catches were found by a human reading sources, as predicted — but they are citation metadata, not witness values, and the constants are not recent. The prediction is unchanged for what it claims; it did not describe what arrived.

## Inputs (controllable)

- **`W-7` — the standing step that takes one instrument and asks whether its output could ever have said otherwise — fell on `gh api rate_limit`, and it could not.** At 15:42Z it printed `{"limit":5000,"remaining":5000,"used":0}` for the account's core budget. Two minutes later the same account's token was refused: `API rate limit exceeded for user ID 58274543`, HTTP 403, on three separate attempts including a direct `reverify.mjs --check`. So the endpoint that exists to answer "have I any budget left" reported a full budget while the API was refusing the same credential — it reports the primary budget only and is silent about whatever refused us. The consequence was real: `A-2`'s (the standing drift-resolution log) gate-runner read stamped exit 2 UNREACHABLE and the row was dispositioned from the morning's verify run instead. Rotation: 09-16 the public coverage sentence, 09-17 `check-engineering-zero`, 09-18 the candidate-correction queue, 09-20 `answered-cards`, today this.
- **Five reading agents, and every quotation re-checked here before it was stored.** The two scans (21a's Numerische Mathematik PDF, 3e's Numdam Astérisque scan) were read as rendered page images by this session, not taken on a reading agent's word; the 1a, 28a and 35a quotes were matched against the saved extracted text.
- **The adversarial review earned its place twice.** Round 1 on the A-51 draft found both of its pre-send checks unsound — `reverify --check` compares upstream with our mirror rather than with the draft's before-text, and a header-only fetch accepts any HTML page. Both were rewritten, and the rewritten step 1 is what proved, immediately before the PR was opened, that upstream still carried the dead link.
- **The draw-before-read record held across three days.** `--draw 125 175 225 275 325` re-printed the same five rows and fingerprints drawn on 2026-09-18, so the sample was fixed before any source was opened and can be re-derived by anyone.

## Outputs (lagging)

- **`G-4` (an outside party acts on a watched record without us filing the report): 0 arrivals** — `npm run reports`, 16:59Z: 30 raw issues fetched, 30 ours, 0 outside, and the parts reconcile to 30. Expected-zero and measured, not a dead probe. positive control: the same fetch returned 30 non-empty issue rows and accounted for every one, so the zero is a classification result rather than an empty read.
- **Record-listing movements: 0 this week, 2 completed consecutive weeks at none** — `npm run catches`, 16:59Z. Quote the per-week figure; the 23 total is a ceiling across 10 weeks. positive control: the same table prints 7 movements for the week of 2026-08-31, so the git-history walk is not stuck at zero.
- **Candidate-correction queue depth: 0** — and it is 0 for the right reason today: the one flagged row was sent upstream and closed. Yesterday it read 1.
- **Depth coverage: 20 of 673 cited rows drawn by position, 15 of them read** — the figure now printed on every audited public page.
- **Repo traffic, 14-day window: 1 unique repo viewer, 269 unique cloners** — `npm run traffic`, 17:00Z. The published page has no analytics, so page readership stays unmeasured; the return-rate proxy is INAPPLICABLE at n=1, below its N_min of 3.
- **Upstream contact: 1 open pull request** (#194), opened today. `W-12` — the watch on whether upstream merges, closes or comments on it — reads its state on 2026-09-28.

## Recommendation

**[A — user-visible] Tomorrow: the published-page check (`A-55`), then `A-54`'s catch-counter blind-spot statement, in the places listed on `A-54.phase2Slip2026_09_20` (its own field names each surface a detection figure is printed on).** The first is the day's ship because the failure it covers is silent: today two Pages builds errored while CI, the gate and the drift alarm were all green, and only a by-hand read of the live page caught it. Both are small; the comparator (`A-54`'s other deliverable) is dated 2026-09-23 and carries the real build risk.

**[B] Ask for a ruling on the two frozen-page defects.** `ramsey.html` promises a range holding 76 pairs and prints 72 without naming the four it omits. The fix is one clause, and David's freeze says leave the page as written until the rebuild lands. I am not reading an exemption into his instruction; the request is on the record at P4.

## On hold pending data

**Nothing in this lane waits on David.** All three board cards read `[answered]` at 16:57Z (`answered-cards.mjs --project bounds-ledger --full`), and the work each authorised is done or dated: the partial-table ruling is scoped with dates on `A-54`, the page freeze stands until the rebuild lands, and the send he approved this morning is open upstream.

**No freeze is in force on a data read.** No wait here carries a denominator that must fill by a read date, so there is nothing to validate or lift. The one thing genuinely waiting is another party's attention: pull request #194, whose clock is `W-12` (the watch on what upstream does with it) — read 2026-09-28.

## State Appendix

Written last, from live commands. Every line is as-of the moment its command ran and carries the command that re-reads it; **this appendix cannot name the commit that lands it**, because that commit is made after the writing.

- **HEAD**: `9065909` "P4 2026-09-21: the 35a page names its own Reference column, and the publish blind spot gets a dated row" — `git -C . log -1 --format=%h%x20%s`, read 17:06Z. `git rev-parse HEAD origin/main` returned the same sha twice, so it is on origin.
- **CI**: **GREEN at `874e411640de15c01c55d65160e2a28f4a54b986`** — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml --sha …` printed `GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending`, exit 0, read 16:31Z. **CI at `9065909` is NOT READ in this report** — that commit landed at 16:56Z. Clearing read: the same command with that sha.
- **Gates**: `npm run verify` exit 0, receipt `{exitCode: 0, sha: 874e411640de15c01c55d65160e2a28f4a54b986, at: 2026-09-21T16:24Z}`, `failedGates: []`; `check:brief` UNVERIFIABLE (no PIN in this shell), advisory under A-41 and never a pass. Commits after it are doc-, ledger- and page-shaped.
- **Publish**: the live site serves the tip — `gh api repos/u00dxk2/bounds-ledger/pages/builds/latest` read `status: built`, `error: null`, 23.4s, at `07b8f0be`, 16:32Z, after two ERRORED builds and one requested rebuild. The five slice-6 pages and the corrected sentence were then read back unauthenticated from the live site.
- **Deploy drift**: NOTHING SWEPT for this lane, which is neither a stop nor a pass — this lane publishes through GitHub Pages and declares no Render service (`check-deployed-sha-drift.mjs`, 15:38Z, 0 findings across 33 checksPass services, none ours).
- **Ledger**: 70 rows, 21 open, 49 closed — counted over `continuity/items.json` by status at 17:06Z, after today's two mints and one close.
- **Due gates**: `1 gate(s) due on/before 2026-09-21` at P2 and it was `A-51`, now closed; re-read after the close returns none. `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print`.
- **Stale-actionable**: `items: []` of `consideredCount: 20`, `ledgerState: READABLE`, 10 excluded as parked/waived/clock-declared — `cc-endpoint-probe.mjs --endpoints items-stale-actionable`, exit 0, 16:55Z.
- **Engineering zero**: lane `bounds-ledger` 0 findings, 0 unreadable — `check-engineering-zero.mjs --project bounds-ledger`, exit 0, 17:00Z; open Dependabot alerts on this repo: **0**, read directly from the alerts API at the same time. The fleet's 2 findings in that run belong to other lanes — which is the positive control: the same run named buddha-ur and learn-the-dao, so the checker was not silent when it reported nothing here.
- **Dead references**: **1 found, 1 fixed, 1 self-clearing** — at 16:59Z `check-doc-references.mjs` (exit 1) flagged `docs/cold-starts/2026-09-21.md:18` naming `src/lib/cc-primer-first-action-blocks.mjs`, a skylark-site file that cannot resolve here; fixed in this pass by writing the sibling-repo path. The 17:06Z re-run (exit 1) reports a different one: tomorrow's primer names this report, which is untracked until the commit carrying it lands, and an untracked file reads DEAD by that checker's own rule.
- **Tomorrow's primer**: `docs/cold-starts/2026-09-22.md` — the path this lane owes, resolved by `check-next-primer-exists.mjs` (exit 3 ABSENT at 16:58Z, written in this pass). positive control: the same command resolved a non-empty path from this lane's declared convention and cross-checked the stamp, so ABSENT is a read of the file system rather than an unresolved convention.
