---
product: bounds-ledger
date: 2026-09-10
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: fd53cad
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "You answered both open questions and both are done. We dropped the November date for judging the outside-impact goal and left the goal itself alone. Then we did the thing you funded: we took three published numbers we track, opened the actual papers, and read them against what we had recorded. Two held up; one we could not settle because the paper's bibliography would not load. Anyone can now see this on the public page, and it says plainly that three of five hundred and forty-three is almost nothing. Nothing needs you."
---

# Daily — bounds-ledger — 2026-09-10

## BLUF

David dropped the November verdict date on the outside-impact goal and funded depth instead.

By the end of the day the ledger had read its first records against their sources, and put the result where a stranger can see it.

**FIRST ACTION.** Pull, then start the gate — three minutes of network, and a receipt on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** The public page now says *2 bound rows read against their cited source*, and the depth audit reads **2 sound of 3**. A cold reader takes that as a two-thirds pass rate for the ledger. It is not a rate at all. All three rows are listed in `continuity/depth-audit.json` and printed by `node scripts/depth-audit.mjs`: two bound rows of the real Grothendieck constant, plus one reference entry of Martinet's constant. The two bound rows were chosen because their values differed from the figures in their own papers' titles; the reference entry because the mirror already flagged it as unverified. A sample selected for suspicion has no rate in it. `node scripts/depth-audit.mjs` prints its sampling rule above the count for exactly this reason; the trap is quoting the count without it.

**DON'T-TOUCH.** The `agent-status` pre-POST gate set. It refused three of my posts today for three different real defects and each refusal named the remedy rather than rendering a verdict. What makes it work is the ORDER: it refuses BEFORE the row lands, so there is nothing to retract and no correction to chase, and each refusal quotes the offending token from my own body. A gate firing after the post would have produced correction rows and taught nothing.

## What changed

**David ruled, and both cards are closed.** His words on the outside-impact goal, verbatim: *"Yes — keep the goal as it is, drop the November verdict date, and judge the project meanwhile on how much of our own material stands up when we check it."* `G-4` (the Tier-0 goal that an outside party acts on a watched record without us filing the report) keeps its title, its operationalization, its close condition and its n=1 bar. The 2026-11-06 outcome read is **dropped, not re-dated**, and the retired sentence is kept verbatim on the row so the change reads as a decision rather than a typo. `W-6` (the watch on the README report-an-error channel) keeps its own November date — different row, different question, and re-dating it on the strength of a ruling that named this goal would be the quiet re-date the waits gate forbids.

**The mapping was mine and it is recorded as challengeable.** The card recommended judging the lane on `A-45` (stale-value resolvability — the fraction of superseded values that still reach their current row). His clause names a different property: material that stands up when we check it is a record read against its cited source, which is `A-47` (the depth audit he ruled on 09-09). So `A-47` carries the interim judgment and `A-45` stays a leading indicator beside the arrivals number. He said yes to a card naming one row and then wrote a clause naming another; collapsing those would read his agreement as agreement to my wording.

**The depth audit exists, and it has been run.** `A-47` had no instrument — its own read command said so in terms. It now has a store (`continuity/depth-audit.json`) and a reader (`node scripts/depth-audit.mjs`). First reading, literal: *"depth audit (A-47): 3 row(s) audited — 2 sound, 0 defective, 1 unresolved, 0 unreachable."* Record text is extracted from the mirror by file, line and hash, never retyped into the store.

**The method finding is worth more than the verdicts.** One row attributes an improvement of 6.039×10⁻⁵ to a paper whose title and abstract both claim only 10⁻⁵. Read from the abstract, our row looks wrong and I would have filed a defect against upstream. The body carries Theorem 1.1 stating exactly 6.039×10⁻⁵ — the title is the paper rounding its own sharper theorem. **Rule adopted: an abstract can settle a value-against-source row positively but never negatively.** A row whose abstract disagrees is UNRESOLVED until the body is read, never DEFECTIVE.

**The public pages now show what we have CHECKED, not only what we mirror.** Two adversarial rounds said do not ship, and both were right — details under Inputs.

## Inputs (controllable)

**Two adversarial reviews caught what my own reading did not.** Round 1: the no-record prohibition ran only on the unaudited fixture, so the guard could not see the surface the audit block had just added, and a store verdict of `VERIFIED BEST KNOWN BOUND` was demonstrated publishing that prohibited claim on a public page. Also hostile store values reaching executable HTML, a `javascript:` source surviving attribute escaping, and a count that conflated two different populations. Round 2, after those fixes: an UNREACHABLE row still counted as READ, so the page printed *"the cited source could not be read at all"* beside *"1 bound row(s) here have been read"*; repeat audits inflated the numerator; verdicts did not identify which row; a malformed field type crashed generation of all 115 pages; and DEFECTIVE prose could be reversed to say the source SUPPORTS the row with the whole suite still passing.

**The pattern in both rounds was one thing: a guard that cannot see the surface it was built for.** That is this lane's founding defect, reintroduced twice in an afternoon inside the block whose entire purpose is honest reporting.

**Three self-inflicted problems, recorded because they nearly shipped silently.** control: if any of these had another cause, git log --format="%an <%ae>" -- continuity/depth-audit.json scripts/render-constant-pages.mjs would name an author or session other than this one, and the double-run would be absent from this session own background-task record (job b5vovx517) — both name only this session, so the attribution is checked rather than assumed. A non-idempotent script ran twice — once inside a backgrounded `&&` compound of the exact shape `CLAUDE.md` warns parks the permission classifier — and overwrote a field with its own output, destroying the original notes; restored from the committed store rather than retyped. An over-wide text cut removed four functions along with the block it meant to replace; spliced back from `HEAD` with a checker now proving every declaration and load-bearing comment survives. And a correction I wrote to a stale primer banner invented a clock stamp for a read whose time I never captured — the precise defect that block exists to correct.

**A five-hour strand, and it was not a listener fault.** The pane took no turns from about 14:21Z. The listener stayed healthy and loud throughout — SSE hellos at 18:36:21Z, 18:50:22Z and 19:04:23Z, proactive re-subscribes all succeeding — while writing **52 consecutive** `no /loop detected` warnings, ending at `STRAND (oldest 232m, no Stop fire 292m)`, and `auto-fire outcome: TURN-OBSERVED at 19:05:27.768Z — 220m after the auto-fire intent was set`. David's reply landed at 15:09:24Z into a pane that had already stopped taking turns and surfaced at 19:13:55Z. Three liveness alarms fired at 15:20, 15:34 and 15:35 — **all onto this lane's own bus timeline, the one channel a pane taking no turns cannot read.**

**Findings classification, one sentence of human judgment: today's findings are mixed, and that is the change** — one **record-facing** (`A-47-0003`, the reference entry for `[Mar2006]` on `87a`, where the citing source identifies the work as a Ph.D. thesis and our entry does not record that, leaving the title still unverified) beside a crowd of **instrument-facing** ones (the two review rounds, the stale primer banner, the invented stamp, the destroyed field, the over-wide cut).

**Consecutive instrument-facing days: the streak BREAKS at 4.** Yesterday's report says 4 and I read that off it rather than recalling it. Today is not instrument-facing without exception, because a record-facing finding arrived. Written by hand; nothing counts this.

**Was the counted catch numeric or byte-only?** Neither, and the distinction does not apply today: `npm run catches` reports *"23 movement(s) on distinct pins across 8 week(s)"* and it counts drift DETECTION only. Today's record-facing finding came from **reading a cited source**, which that instrument cannot see at all — it is not in the 23 and never would be.

**The standing prediction, checked because a prediction never checked is decoration.** The registered claim: the next record-facing catch would be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. **The mechanism half is CONFIRMED and the shape half is REFUTED.** It came from a human reading a source and from no instrument — exactly as claimed. But it is not a witness-value mismatch, and `87a` is not a recently-added constant; it is a bibliographic under-specification on a long-standing row. Correcting the claim rather than reading the near-miss as a hit: **the next prediction is that record-facing findings from this audit will be citation-quality defects — a work type, a venue, an attribution — before any of them is a number that moved.**

## Outputs (lagging)

- **`npm run reports` (G-4's primary indicator):** 0 arrivals. Expected, and its own pre-registered rule says a zero here carries information about the product only at 30 or more unique viewers in the window.
- **Unique viewers:** 1 in the trailing 14 days at the last sample (`dd05d3e`, 2026-09-09, day 33). Read the viewer count and never the clone count — the clones are largely our own CI.
- **Depth audit:** 3 rows audited, 2 sound, 1 unresolved, 0 defective, 0 unreachable — against 543 cited bound rows. Not a sample; see the BLUF trap.
- **Open issues:** 0. Search space `gh issue list --repo u00dxk2/bounds-ledger --state open --limit 20`, empty, with the positive control that `--state all` returns five closed rows.

## Recommendation

**Take `A-42` and `A-20` tomorrow, in that order, and do not bundle `A-42`'s two readers.** `A-42` (two user-facing readers still key off our own pin history and read as claims about the record) is decidable rather than a design session — both readers already changed, and its close condition asks exactly whether that is enough. `A-20` (should the fetch layer retry with backoff on 429/502) carries a do-not-ship review and a branch that must be checked for mergeability before any runner is spent on it.

**Do not let `A-48` slip.** It is the second-area citation comparison promised to David for 2026-09-16 — the only outstanding commitment made directly to him, six days out, and its predecessor slipped four dates before landing.

## On hold pending data

Nothing is on hold. **No open row carries a David-wait** — the two that existed were answered and closed today — and the waits gate passes all three of its tests for the first time in a while: (1) every David-wait names a live board card — there are none left; (2) every data-wait has a denominator that can fill by its read date; (3) no wait is undated. Test 2 was the standing failure, because `G-4`'s 30-viewer denominator could never fill by November, and David's ruling retired that verdict date rather than re-dating it.

## State Appendix

_Written last, from live commands. This report cannot name the commit that lands it._

- **CI:** GREEN at `fd53cad` — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml` → 1 completed non-scheduled success, 0 failures, 0 pending.
- **Gate:** `npm run verify` exit 0 at `fd53cad`, `failedGates []`, receipt 2026-09-10T22:04:32Z. `check:brief` reads UNVERIFIABLE as it has since the `/t/*` login wall — excluded from the exit code, never counted as a pass.
- **Offline battery:** `npm test` green, 27 selftests.
- **Mirror:** no drift, 116 files match upstream `9d57db8` — an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo. positive control: the same command against a local object DOES resolve — `git cat-file -t fd53cad` returns `commit`, so the upstream sha's failure is the object being absent here, not the command being broken.
- **Published page:** Pages build row `fd53cad built 2026-09-10T22:01:43Z` (`gh api repos/u00dxk2/bounds-ledger/pages/builds`); live fetches of `c/10a.html` and `c/87a.html` return HTTP 200 carrying the audit block, and `c/11a.html` correctly carries none.
- **Dated gates due:** 0 on/before today — `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print`, 61 rows swept.
- **Dependabot:** 0 open alerts, read after the last push; `check-engineering-zero.mjs` → PASS.
- **Continuity endpoints:** all three HTTP 200 with the PIN header. `items-stale-actionable` returns an empty `items` array over 20 considered; `auto-decidable-items` returns 6 rows, all tier LOW and all event-triggered.
- **CLAUDE.md size:** 41091 bytes, loaded 56279 against a 60000 budget — measured by `measureDocSize` in LF-normalized UTF-8 bytes per the unit ruling in `docs/size-budgets.md`, read via `check-claude-md-sizes.mjs --project bounds-ledger`, exit 0.
