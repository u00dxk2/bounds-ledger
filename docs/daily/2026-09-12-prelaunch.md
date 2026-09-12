---
product: bounds-ledger
date: 2026-09-12
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 3d65a09
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "We checked five more of our own records against the papers they cite, and this time all five held up. Three matched straight away, one matched once we read the paper's body rather than its summary, and one we could not check at all because the publisher blocked us — which we say plainly on the page rather than counting as a pass. Anyone can now see, for nine records, whether we checked them and what we found. We also fixed the way our daily alarm behaves when a server tells it to slow down: it used to retry ten requests in unison at the surface that just refused us. Nothing needs you."
---

# Daily — bounds-ledger — 2026-09-12

## BLUF

Five more records were read against the sources they cite, all five held up, and the machinery that picked them was wrong twice — caught by review before it shipped.

**FIRST ACTION.** Pull, then start the gate — three minutes of network, and a receipt on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** The public pages now say **9 bound rows read against their cited source**, and the store holds **13 audits**. Those are different populations and the gap is not an error: 13 counts everything attempted, 9 counts what was actually READ — it excludes three UNREACHABLE rows (a host that refused a connection, and two publishers that served bot challenges) and one reference-entry leg that is not a bound row. A cold reader takes 13 as coverage; coverage is 9, against 673 cited rows. Run `node scripts/depth-audit.mjs`, which prints its sampling rule above the counts, and `node scripts/depth-audit.mjs --corpus` for the denominator.

**DON'T-TOUCH.** The adversarial review on the working tree BEFORE the commit. Today it returned needs-attention on two defects in code written minutes earlier, and both were invisible to every other check: the row hash matched in both failure modes, so hashing could not catch a verdict pointing at commented-out text. What makes it work is the timing — it reads the tree before the commit exists, so the fixes land inside the shipped artifact rather than in a follow-up nobody schedules.

## What changed

**Five more cited rows read against their sources, and all five held up** (`3d65a09`). Slice 3 of the depth audit, drawn at positions 100, 200, 300, 550 and 650 of the 673 cited rows before any row was read: 17a SOUND, 3a SOUND, 88a SOUND, 77a SOUND, 24a UNREACHABLE. Coverage moves from 5 to 9 of 673. **Three of the five could only be settled from the paper's BODY** — the AlphaEvolve paper's abstract carries neither the figure our row states nor the superseded one it names, Polymath8a's abstract does not contain 4680, and 77a's attribution clause needed the second paper's body. After the same finding in slice 1, that is now the audit's most consistent methodological result.

**One cited source is a repository holding code and a certificate, not a paper.** 17a's current record cites a public repo whose front page states the bound and the method exactly as our row does. Recorded SOUND on the value-vs-source leg with the limitation written into the entry: **the verifier was not run**, and "the README says so" is the weakest support this audit has accepted. It is also the first concrete target `G-2` (contribute a verified bound improvement) has ever had for its interim milestone — reproducing a current record with a published verifier — and that is now recorded on the row.

**The draw is executable rather than described** (`3d65a09`). `node scripts/depth-audit.mjs --draw 100 200 300 550 650` prints the rows at those positions from the same parser and cited-row definition the denominator counts. Slices 1 and 2 were drawn by a script that was never committed — the same shape as the denominator nobody could re-derive on 09-11.

**The adversarial review blocked the ship, and both findings were mine.** (1) The draw re-found each row by searching the raw file for its text while the parser strips HTML comments, so a commented-out DUPLICATE returned the comment's line and an inline comment returned line 0 — with the row hash matching either way. (2) `--draw` bypassed the corpus refusals: over a fixture with one renamed heading it accepted 669 rows and position 100 silently became a different constant, while the corpus check exited 2 on the same directory. Both fixed at the root, both directions in the selftest (27 cases), and two controls that the parser rewrite moved nothing it should not: the corpus still reads 673 of 770, and the same draw returns the same five rows and hashes as before the fix.

**A verdict was upgraded on evidence the review found.** 77a went UNRESOLVED to SOUND: GOWWZ2025's own remark reads "Our Theorem 1.3 recovers the result in [Wu20] via a quite different and a slightly simpler approach", which is exactly what our row's comment claims. The first verdict was right on the evidence it had and stays on the row — the remedy for that kind of UNRESOLVED is to read further, never to relax the standard.

**`A-39` closed on its fix** (`2a40d62`). A 429 now has its own ladder, honours Retry-After under a 30-second ceiling, falls back when the header is unparseable, and jitters upward only; 502/503/504 keep the original ladder deliberately. An exhausted 429 is still returned unchanged, so the run stays RED. What the close records as unproven: no real 429 has ever been observed on this fetch path.

**All three gates due today were read by RUNNING them** (`4df975f`), listed in `continuity/items.json` as `A-39`, `A-33` and `A-43`, where two had never produced a genuine read: `A-39`'s stamp had been a spawn-error marker since 09-10, and `A-43`'s command had never run since the row was created on 09-05. `A-33` re-dated to 09-19 (its third re-date, said plainly on the row) and `A-43` to 09-15, each with the reason recorded.

## Inputs (controllable)

**`W-7` — the instrument read against its own claim today was `check-due-gates-dispositioned --print`'s RESULT line.** It printed "swept 61 ledger item(s)", listed 3 of 3 due gates, and then ended `RESULT: NOTHING-SWEPT (exit 2)`. Its verdict table maps EVERY exit 2 to that one word, while the genuine nothing-swept branch is one of several. The claim it makes about itself — that nothing was swept — was false on its own output. The same command over the same ledger after the gates were read exits 0 and says PASS, so the exit code tracks unread due rows while the word describes something else. A cold reader takes it as "the resolver could not read the ledger". Reported, not patched here: it is skylark-site's file. (Rotation: 09-11's subject was `A-42`'s readCommand under that runner; today's is the runner's own verdict vocabulary.)

**Findings classification, one sentence of human judgment: today's findings are INSTRUMENT-FACING without exception — the two draw defects, both in code I wrote today — and the audit itself produced ZERO record-facing findings.** None of the rows drawn turned out to be wrong, all five listed in `continuity/depth-audit.json` as `A-47-0009` to `A-47-0013`: four were read and supported their rows, and the fifth could not be read at all, which is a fact about a publisher's bot wall rather than about the record. That is a different result from a quiet day.

**Consecutive instrument-facing days: 1.** Yesterday's report reads 0 and I took that from it rather than recalling it. Written by hand; nothing counts this.

**Was the counted catch numeric or byte-only?** Neither, and the distinction does not apply today. `npm run catches` reports `2026-09-07  0 (current, partial)` against completed weeks of 4, 0, 4, 5, 3 and 7 — so nothing was counted either way this week. Today's work came from READING cited sources, which that instrument cannot see at all: it counts drift detection on pins, and no pin moved.

**The standing prediction, checked.** Yesterday's registered claim: the audit's next record-facing catch will be a mismatch between what a row ASSERTS and what its source SUPPORTS — a quantifier, a strictness, a rounding — rather than a wrong value or a wrong citation. **No record-facing catch arrived today, so it stands unchanged.** Worth noting what nearly tested it: 77a's attribution clause was exactly that shape — a claim in the row that the cited abstract did not support — and reading the body resolved it in the record's favour. The prediction survives untested rather than confirmed.

**Three verify runs today, and two were avoidable.** Ledger edits invalidate leg attribution because `check:deferrals` reads `continuity/items.json`, so a run after an edit is genuinely owed — but I made the day's ledger edits in three batches when one would have done. At roughly 450 network requests a run, that is the cost of sequencing rather than of rigour. The fix is a habit, not a tool: batch the ledger writes, then gate once.

## Outputs (lagging)

- **`npm run reports` (`G-4`'s primary indicator): 0 outside arrivals.** positive control: the same probe fetched 29 issues and accounted for every one as ours, and the script refuses to print a bare zero for exactly that reason — so this is a measured exclusion, not an empty fetch.
- **Unique viewers: 1 in the trailing 14 days** (`npm run traffic`, sampled today, day 35 since the public flip; 7 unique viewer-days total, which the sampler prints as an upper bound because it does not dedup beyond 14 days). Return-rate proxy INAPPLICABLE at n=1, below its N_min of 3; the arithmetic is printed so the figure stays auditable. The 202 cloners in the same window are largely our own CI and are deliberately not deducted.
- **Depth audit (`A-47`): 13 audited — 6 sound, 0 defective, 4 unresolved, 3 unreachable.** positive control: the reader's own sum-check requires the four verdict counts to reach the raw row count, and 6+0+4+3 = 13. Coverage on the public pages is **9 of 673 cited rows**; the other four audits are three UNREACHABLE and one reference-entry leg, which the page excludes by construction.
- **Open issues: 0**, search space `gh issue list --repo u00dxk2/bounds-ledger --state open --limit 20`. positive control: the same listing with `--state all` returned 29 rows today, every one ours (the drift bot and the owner), so the reader is alive and the zero is an exclusion.

## Recommendation

**Take `A-48` tomorrow — the two-index citation comparison promised to David for 2026-09-16, now four days out.** Its blocker is gone and its first missing input is no longer missing: `A-34`'s four criteria and its candidate list are on the row itself as of today, extracted rather than retyped, so the work starts without a 30 KB read of a closed row. **Its progress is 0 of 3 candidate surfaces scored, and its denominator is surfaces × two indices × four criteria — NOT the 673 cited rows**, which belong to the depth audit. That conflation has now been relayed to this lane twice and corrected twice.

**Second, if there is room: the lookups `A-43` needs by 09-15 — the proved values behind the four machine-discovered rows listed in `ledger/teorth-optimizationproblems/constants/1b.md`.** They are source-reads of exactly the kind the depth audit performs, and the row already records how to keep them honest — a suspicion-drawn slice, recorded separately from the systematic sample, because a set chosen because one cell looked wrong carries no rate.

## On hold pending data

Nothing is on hold, and **no open row carries a David-wait**. The three longest-carried watches all wait on someone else acting and none can be advanced cold: `W-3` (independent acknowledgement of the erdosproblems.com/36 correction, 09-24), `G-2` (a contributed bound improvement, 09-22) and `W-6` (a first unsolicited outside contact through the README channel, 11-06 — its date deliberately unchanged, because re-dating a wait that cannot fill is what the waits gate forbids).

## State Appendix

_Written last, from live commands. This report cannot name the commit that lands it._

- **CI:** GREEN at `e035373` — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml` → "1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending". Read twice: the first read at 20:11Z returned UNKNOWN with a run still in progress, which is not a pass and is not written as one.
- **Gate:** `npm run verify` exit 0 at `2a40d62`, receipt 20:07:07Z, `failedGates []`. **The ledger leg re-run at HEAD after the P4 edits**, because `check:deferrals` reads the file those edits touched: `node scripts/check-deferrals.mjs` → "0 declared deferral(s) among 61 row(s) read from continuity/items.json", PASS, exit 0. That is the leg the edit could have broken, re-read on its own rather than assumed from a receipt that predates it.
- **Offline battery:** `npm test` exit 0 — 26 self-tests in CI across 32 workflow steps, including the depth-audit selftest at 27 cases (6 added today) and the A-39 rate-limit assertion.
- **Mirror:** no drift, 116 files match upstream `9d57db8` — an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo.
- **Claims:** 241 — 239 hold, 0 broken/unreachable, 2 unverified (manual).
- **Corpus:** 770 bound rows across 115 constant files, 673 cited, 97 uncited — `node scripts/depth-audit.mjs --corpus`, which refuses (exit 2) when either baseline cannot be established.
- **Dated gates due:** 0 remaining on/before today — `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print --today=2026-09-12`, exit 0. positive control: the same command listed **3** due rows this morning and **1** after the first two were dispositioned, so the zero is what closing and re-dating produced rather than an empty sweep.
- **Publish:** the Pages build rows read `built 3d65a09 2026-09-12T19:54:57Z` and `built 3d65a09 2026-09-12T20:10:23Z`. **The second row names `3d65a09` although the tip pushed at 20:10 was `e035373`, and I have not established why** — recorded rather than smoothed over. What it does not change: `3d65a09` is the commit that last altered published files (`c/*.html`, `index.html`), so the live page carries today's ship; the later commits touched only `scripts/` and the ledger.
- **Dependabot:** 0 open alerts — `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open` → 0.

<!-- findings:begin -->
<!-- findings:end -->
