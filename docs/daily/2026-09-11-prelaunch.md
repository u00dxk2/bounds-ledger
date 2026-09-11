---
product: bounds-ledger
date: 2026-09-11
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 6feeebb
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "We checked our own published figures the way we check everyone else's, and they did not all survive. The number on our site saying how many records there are to check could not be recomputed by anyone, so we replaced it with one that can be — and it turned out we had been understating the size of the job. Two of yesterday's three positive verdicts also did not survive: each said a paper proves a number is strictly smaller than a value, while the paper itself only proves it is at most that value. We corrected both rather than let the better-looking number stand. Five more records were read against their sources today. Nothing needs you."
---

# Daily — bounds-ledger — 2026-09-11

## BLUF

The ledger turned its own method on itself and failed twice: a denominator nobody could re-derive, and verdicts more generous than their evidence.

Both are corrected and published, five more records were read against their sources, and the retry work that had been waiting on a review since 2026-09-01 is merged.

**FIRST ACTION.** Pull, then start the gate — three minutes of network, and a receipt on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** The audit reads **2 sound of 8 audited**. A cold reader takes that as a quarter of our records failing. It is not a rate in either direction: 2 rows are UNREACHABLE (a host that refused a connection and a publisher that served a bot challenge — facts about access, not about our records), 4 are UNRESOLVED (a source read that could not settle the question), and 0 are DEFECTIVE. The only figure that carries coverage is **5 of 673 cited bound rows read against their cited source** — and 673 is itself two days old as a computed figure. Run `node scripts/depth-audit.mjs`, which prints its sampling rule above the count, and `node scripts/depth-audit.mjs --corpus` for the denominator.

**DON'T-TOUCH.** The four-round adversarial review before a ship. It returned needs-attention four times today and nine findings, three of which were defects in checks written to fix the round before — including one that would have refused an intact corpus, which is the permanently-red alarm this lane was founded on. What makes it work is that it runs on the WORKING TREE before the commit, so the fixes land in the shipped artifact rather than in a follow-up.

## What changed

**The denominator on the public pages could not be re-derived.** `A-47` (the depth audit David ruled on 2026-09-09) recorded 543 cited rows of 763, measured 2026-09-09 by a script that was never committed, and `c/10a.html` published it. The mirror has not changed since 2026-09-07, and three predicates over that unchanged corpus give 673 cited of 770 (a reference token anywhere in the row), 656 (the reference column names one) and 461 (the column is exactly a token). None returns 543. The control `A-47.note2` left behind — 87a contributes 7 rows of which 6 are cited — passes under BOTH enumerations while the totals differ by 130 rows. `node scripts/depth-audit.mjs --corpus` now computes the figure with its definition, its control and four narrow checks printed beside it (`c7f4246`).

**Five more records read against their sources, drawn systematically for the first time.** Slice 1 hunted discrepancy and therefore cannot be projected onto the corpus. Slice 2 takes positions 50, 150, 250, 350 and 450 of the cited rows in file-then-line order, chosen before any row was read: 13a and 55a SOUND, 20a UNRESOLVED, 31a and 43a UNREACHABLE. Crossref confirms both unreachable rows' citations exactly, so what failed is access to the papers, not the entries.

**Two of yesterday's verdicts did not survive, and that is the finding worth keeping.** `A-47-0001` and `A-47-0002` pin rows whose value cells open with a STRICT inequality, while the passages recorded for them quote a NON-STRICT one at the same threshold. A source proving "at most X" does not establish "less than X". Both are now UNRESOLVED; yesterday's "2 sound of 3" is retired in the row itself rather than left standing in a nicer number.

**`A-20` (should the fetch layer retry with backoff on 429/502) is merged and closed** — `12e0937`, fix `dfe2b90`. It had been waiting since its 2026-09-01 review returned DO-NOT-SHIP with one blocking finding. Both findings are fixed: a main-module guard that exited 0 through a junction having run nothing, and a retry layer with no assertion about which statuses must NOT be retried.

**A verify leg was passing over a ledger it never read.** `check-deferrals` printed "0 declared deferral(s)" and PASS whether it read 61 rows or no file at all. It was printing exactly that today. Named in the 2026-09-08 report's Recommendation, carried by neither of the next two reports, and found only because P2 re-reads three days of Recommendations (`f1a3b2d`).

## Inputs (controllable)

**`W-7` — the standing rule that one instrument is read against its own claim every session — today's subject was `A-42`'s own readCommand, run through the fleet gate runner.** The runner stamped it exit 1. The failure was the runner's: `check-due-gates-dispositioned --run` shells through the Windows command shell, which stripped the caret out of the regex's negated character class before node saw it; the same stored bytes through bash exit 0. A second finding on the same probe: its 900-byte slice now truncates the label mid-word, and its own positive control ("both halves non-null") still passes on the truncated read. Reported to the orchestrator as a fleet fix, not patched here — it is skylark-site's file. **This line had been missing from five consecutive reports (09-06 to 09-10); restoring it was approved at P1 today and now lives in `docs/daily-config.md` rather than in memory.**

**Four adversarial rounds, nine findings, all fixed before the commit.** Three were defects in checks written to fix the previous round: a partition check that could never fail against real enumeration; a section baseline that missed partial loss; a table-syntax guard that both missed rows moved into a second block and REFUSED an intact corpus when a blockquote legally ended a table. The last is the one the orchestrator singled out, and rightly — a gate that reds on a healthy corpus is worse than no gate.

**Findings classification, one sentence of human judgment: today's findings are MIXED, with a genuine record-facing one.** Record-facing: the strictness mismatch on two 10a rows, plus two citation-reachability failures (a host refusing connections, a publisher serving a challenge page). Instrument-facing: the unreproducible denominator, the vacuous deferral leg, the gate runner's caret, and four rounds of defects in my own guards.

**Consecutive instrument-facing days: 0.** Yesterday's report broke the streak at 4 and today does not restart it, because a record-facing finding arrived again. Written by hand; nothing counts this.

**Was the counted catch numeric or byte-only?** Neither, and the distinction does not apply today. `npm run catches` reports 23 movements on distinct pins across 8 weeks with the current partial week at 0; today's record-facing findings came from READING cited sources, which that instrument cannot see at all.

**The standing prediction, checked.** Yesterday's corrected claim: record-facing findings from this audit would be citation-quality defects — a work type, a venue, an attribution — before any of them is a number that moved. **Half confirmed, and sharpened.** Nothing that moved was a number, as claimed. But the sharpest finding was not bibliographic either: it was a STATEMENT-quality defect, a row asserting a strict inequality its source does not prove. **The next prediction: the audit's next record-facing catch will again be a mismatch between what a row ASSERTS and what its source SUPPORTS — a quantifier, a strictness, a rounding — rather than a wrong value or a wrong citation.**

## Outputs (lagging)

- **`npm run reports` (`G-4`'s primary indicator):** 0 outside arrivals. positive control: the same probe fetched 29 issues and accounted for every one as ours, so the zero is a measured exclusion rather than an empty fetch — and the script refuses to print a bare zero for exactly that reason.
- **Unique viewers:** 1 in the trailing 14 days at day 34 (`npm run traffic`, sampled today). Return-rate proxy INAPPLICABLE at n=1, below its N_min of 3 — the arithmetic is printed so the figure stays auditable.
- **Depth audit (`A-47`):** 8 rows audited — 2 sound, 0 defective, 4 unresolved, 2 unreachable. positive control: the reader's own sum-check requires the four verdict counts to reach the raw row count, and 2+0+4+2 = 8, so the zero sits inside a breakdown that was checked rather than beside an unread store. Coverage is 5 of 673 cited bound rows read against their source; the other 3 audits are 2 unreachable and 1 reference-entry leg, which the page excludes by construction.
- **Open issues:** 0 outside-authored, from `gh issue list --repo u00dxk2/bounds-ledger`. positive control: that same listing returned 29 rows today, every one ours (the CI drift bot and the owner), so the reader is alive and the zero is an exclusion.

## Recommendation

**Take `A-48` next — the second-area citation comparison promised to David for 2026-09-16.** Its blocker is gone: all three citation indices answered today for one known DOI — Crossref returned 36, Semantic Scholar 612, OpenAlex 433 — so the two-index read the row requires is obtainable. That one work is counted as 36, 612 and 433 by three indices is itself why no single index can rank surfaces. Five days out, and its predecessor slipped four dates before landing.

**Tomorrow's gate order is written once, in the primer** (`docs/cold-starts/2026-09-12.md`), and this section deliberately does not restate it — that rule was approved today after the 09-10 report and the 09-11 primer disagreed about which gate came first.

## On hold pending data

Nothing is on hold, and **no open row carries a David-wait** — `answered-cards.mjs --project bounds-ledger --full` returned no waiting, answered or pending-verify card at 16:39Z. `G-2` (contribute a verified bound improvement) signals 2026-09-22 and `W-3` (independent acknowledgement of the erdosproblems.com/36 correction) signals 2026-09-24; both wait on someone else acting, which is not a decision anyone can take cold.

## State Appendix

_Written last, from live commands. This report cannot name the commit that lands it._

- **CI:** GREEN at `6feeebb` — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml` → 1 completed non-scheduled success, 0 failures, 0 pending.
- **Gate:** `npm run verify` exit 0 at `6feeebb`, `failedGates []`, receipt 16:33Z. `check:brief` reads UNVERIFIABLE as it has since the `/t/*` login wall — excluded from the exit code, never counted as a pass.
- **Offline battery:** `npm test` exit 0, 26 self-tests in CI, 32 workflow steps.
- **Mirror:** no drift, 116 files match upstream `9d57db8` — an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo.
- **Claims:** 241 — 239 hold, 0 broken/unreachable, 2 unverified (manual).
- **Corpus:** 770 bound rows across 115 constant files, 673 cited, 97 uncited — `node scripts/depth-audit.mjs --corpus`, which refuses (exit 2) when either baseline cannot be established.
- **Dated gates due:** 0 remaining on/before today — `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print`. positive control: the same command swept 61 ledger rows and listed both of today's gates (`A-20`, `A-42`) this morning; the zero is what closing them produced, not an empty sweep.
- **Dependabot:** 0 open alerts, read after the last push — `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open` → 0; `check-engineering-zero.mjs --project bounds-ledger` → PASS, 0 findings for this lane. positive control: that same sweep read 23 lanes and named 2 of them RED, so a live reader returned this lane's zero rather than an empty panel.
- **Continuity endpoints:** all three HTTP 200 with the PIN header — `items-stale-actionable` 0 rows, `upcoming-triggers` 3 (`A-39`, `A-33`, `A-43`, all clocked 2026-09-12), `auto-decidable-items` 5, every one tier LOW. positive control for the first endpoint's zero: the other two answered with 3 and 5 rows on the same credential in the same run.
- **CLAUDE.md size:** 41801 bytes for CLAUDE.md and 57633 loaded against the 60000 budget, read after P5's two doc additions, in UTF-8 bytes LF-normalized via `measureDocSize` per the unit ruling in `docs/size-budgets.md` — read with `check-claude-md-sizes.mjs --project bounds-ledger`, exit 0.

<!-- findings:begin -->
<!-- findings:end -->
