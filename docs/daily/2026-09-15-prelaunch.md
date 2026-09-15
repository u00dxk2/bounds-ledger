---
product: bounds-ledger
date: 2026-09-15
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 2af6082
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "We were getting ready to tell the mathematician who keeps a widely-read table that one of his numbers has a wrong final digit. Today we read his paper again and found that his own summary writes the number exactly the way his table does, so the correction would not have survived his reply. We stopped it. Two things we had written down ourselves months ago said the same thing and nobody looked at them, so we also filed a standing note to search our own records before calling a question settled. The one visible change today: the record this whole project started from now appears on our public page as one we have read against the paper it cites, where the page had implied nobody ever checked it. Nothing needs you."
---

# Daily — bounds-ledger — 2026-09-15

## BLUF

This lane spent the day building a correction to send upstream and then refuted it with its own reading.

The evidence that killed it was already in this repository when the morning's analysis was written.

**FIRST ACTION.** Pull, then start the gate — three minutes of network, and a receipt on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE THING THAT WILL MISLEAD YOU.** `A-43` (the watch on upstream's rendering of Haugland's minimum-overlap bound) carries TWO corrections at the top of its `onTrigger`, written six hours apart, and they point in opposite directions. The first says the row's order was already carried out. The second says the conclusion that replaced it overstates the case. **Read the second one first; it is deliberately above the first.** The row is not decision-ready and nothing goes to David on it unless a draft answers the 2026-07-23 precedent named there.

**DON'T-TOUCH.** The `sourceRead` text on depth-audit entry `A-47-0019`. It is rendered verbatim on the public `c/1b.html` and it is the one sentence on that page that explains why a row can be read against its source and still be neither supported nor refuted. It was written to survive an adversarial review that specifically asked whether it claims more than the two quoted source sentences support.

## What changed

**The correction we were preparing does not survive its own source** (`9c23621`). Haugland's paper states the bound twice and differently: its abstract says "A step function that improves the upper bound from 0.382002... to 0.380926... is given.", and its final section says the step function "yields the value 0.3809268534330870 for (1)." Upstream's cell reads `$0.380926$` — the abstract's own six decimals with the ellipsis dropped. So the morning's finding that upstream "must CHOOSE a rendering" because only this row's source gives full precision was true and incomplete, and the one-cell correction's obvious reply is that 0.380926 is the figure in Haugland's own abstract. Both sentences were extracted from fetches taken today by script, never retyped; positive control that both artifacts are the paper: the title `[1609.08000] The minimum overlap problem revisited` in each fetch, with "Haugland" 6 and 4 times.

**This ledger already held the refutation, in two places, and neither reached the analysis.** Hand claim `C-4` pins the abstract's `0.380926...` verbatim. `docs/findings/2026-07-23-haugland-final-digit.md` wrote of the identical ellipsis-dropped form on Wikipedia: "Strictly, 0.380926 alone is not a valid upper bound (the proved bound exceeds it), but as citation shorthand it's common." — and declined to act: "A Wikipedia edit restoring the ellipsis (or switching to 0.380927) would be outward contact for a cosmetic nuance — low value, skipped." A correction sent upstream today would have had to explain why the same nuance is worth contact here when it was not there. That is a retrieval failure, not a reasoning failure, and it is now `W-11` — the standing watch that a claim is not decision-ready until this lane's own record has been searched for that claim's own terms (`2af6082`). The row's read command is a positive control on the search itself and was run before filing: `grep -rn "0.380926" ledger/claims.json` returns `C-2`, `C-4`, `C-5` and `C-6`.

**The row this ledger opened on is now on the public page** (`9c23621`), as read against its cited source, verdict UNRESOLVED. `c/1b.html` states "A row not listed here has NOT been checked", and the H2016 row was not listed — the 2026-09-13 transcription into `continuity/depth-audit.json` carried the four neighbouring rows and dropped the row the investigation started from. Verified on the live published page rather than local bytes: build row for `9c23621` at 18:22:21Z, then HTTP 200 and 8,426 bytes against 7,631 before, `H2016` present, and the block's own count moving from 4 to 5 rows chosen on suspicion (baseline: the same page fetched minutes earlier, before the build landed, at 7,631 bytes carrying 4 — both reads are `curl` of `https://u00dxk2.github.io/bounds-ledger/c/1b.html` on 2026-09-15). Labelled debt-paydown: it restores something silently broken on 09-13.

**UNRESOLVED was chosen by naming why the other two verdicts are unavailable.** Not DEFECTIVE, because the source itself uses the truncated form and this ledger has already called that common citation shorthand. Not SOUND, because hand claim `C-2` records that 0.380926 sits strictly below the proved bound. The source settles the value and cannot settle the convention. It is the store's first non-SOUND, non-UNREACHABLE bound-row verdict on a row anyone is likely to look up.

**`A-43`'s three corrected field texts were applied** (`6461898`), closing the park from the pane David closed at about 17:00Z. The row had asserted two incompatible states about the same work — `lookups2026_09_05` recorded four lookups DONE, while a disposition written seven days later said they were still owed and re-dated the row on that basis. Each text was extracted from the committed finding by script and asserted byte-exact against it after the write (2,398 / 1,185 / 3,539 chars; a one-character mutation read MISMATCH).

**A CI red that was not about the ledger.** `aea4f69` went red on ONE claim, `C-6` (Wikipedia's minimum-overlap article), whose fetch hit `ETIMEDOUT` three times; the same run printed `No drift. 116 files match upstream`. The alarm titled it a check error rather than drift, which is the distinction this lane has a finding about. Closed as issue #34 by run 35003267477 on `6461898`, and the local gate at that sha read `241 claim(s): 239 hold, 0 broken/unreachable`.

## Inputs (controllable)

**`W-7` — the instrument read against its own claim today is `check-ci-status.mjs`.** It claims to answer "is CI green at HEAD", and at 17:35Z it said `RED — 1 completed run(s) for HEAD did not succeed` for `aea4f69`. Could it ever have said otherwise? Yes, and it did twice later today on `9c23621` and `2af6082`, so it discriminates rather than printing a constant. What it cannot do is say WHY, and today the why was the whole question: the red came from one claim step whose cited source timed out, not from a record moving. The verdict line reads identically in both worlds. That is not a defect — the job layer and the issue title carry the distinction, and both did today — but it means this instrument's output must never be the last read before acting. Rotation: 09-12 the gate resolver's own RESULT line, 09-13 a selection-sum refusal, 09-14 the liveness probe, today the CI status reader.

**Findings classification, one sentence of human judgment: today's central finding is RECORD-FACING — the first in this stretch — and the two beside it are instrument-facing.** Record-facing: the cited source states its bound two ways, which is a fact about the mathematics and the cited paper, and it changes what we believe about the upstream cell rather than about our tooling. Instrument-facing: the retrieval gap now filed as `W-11` (the standing watch on searching this lane's own record before calling a claim settled), and a transcription that dropped the row its own investigation started from.

**Consecutive instrument-facing days: 0.** Yesterday's report reads 3 and I took that number from it rather than recalling it; today breaks the streak. Written by hand — nothing counts this, which is the point.

**Was the counted catch numeric or byte-only?** Neither. `npm run catches` reports `2026-09-14  0 (current, partial)` and `2026-09-07  0`, with 1 completed consecutive week at zero, so nothing was counted either way; today's finding came from re-reading a cited paper, which that instrument cannot see. Candidate-correction queue depth: 0.

**The standing prediction, checked, and it is the closest it has come to a verdict.** It registered that the next record-facing catch would be a mismatch between what a row ASSERTS and what its source SUPPORTS — a quantifier, a strictness, a rounding — found by a human reading the source rather than by any alarm. Today landed exactly there: a rounding question, on an assert-versus-support axis, found by re-reading the paper. **It resolved in the exculpatory direction — the row is defensible, not defective — which the prediction did not anticipate.** Carried forward unchanged, with that asymmetry now named: the prediction says nothing about which way such a reading will break.

## Outputs (lagging)

**G-4 (an outside party acts on a watched record without us filing the report) reads 0, and it is a MEASURED zero.** `npm run reports`, run today: 30 issues fetched, 30 ours, 0 outside-not-an-arrival, 0 outside arrivals, and the parts reconcile to the raw total — so the zero comes from a working probe rather than a dead one. Status expected-zero; the goal asks for n=1 and this loop is measured in months.

**Arrivals: 1 unique viewer in the trailing 14 days** (`npm run traffic`, sampled today), against 239 unique cloners which are not deducted and are mostly our own CI. The return-rate proxy printed INAPPLICABLE at n=1, below its N_min of 3, and showed its arithmetic instead of publishing a ratio. **Today's ship improved a page that one person visited in a fortnight, and the two halves belong in one sentence.**

**Engineering zero: 0 and 0.** `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open` returns 0, read after the day's last push; `check-engineering-zero.mjs --project bounds-ledger` reports `lane bounds-ledger: 0 finding(s), 0 unreadable`. The fleet had 2 findings in that same run, which is a note here and not this lane's verdict. **positive control: both readers demonstrably return non-zero** — the same `gh api` shape against `u00dxk2/skylark-site` returns 30 alerts, and the same engineering-zero sweep reported RED for two other lanes (buddha-ur, 2 unresolved Sentry issues; bank-see, 1) in the run that cleared this one.

## Recommendation

**Tomorrow's first action is `A-48`'s disqualifying criterion, before any comparison prose.** The comparison is promised to David for 2026-09-16. Surface 1's correction path — whether a route exists that is not a cold email — is still unestablished and the survey PDF body was never read. It is the criterion most likely to disqualify the candidate, so it goes first; a polished deliverable with its disqualifier unchecked is worse than a late one.

**Then decide `A-43` rather than carrying it.** Either a draft can explain why this nuance is worth upstream contact when the 2026-07-23 finding declined the identical one, or the row closes on that precedent. The dead-link correction in the same file — upstream's `[YKLBMWKCZGS2026]` reference cites a URL that serves GitHub Pages' "Site not found" as HTTP 200 — is untouched by any of this and remains the smaller, far less arguable candidate.

## On hold pending data

**`A-46`** (a close-out post announcing a FIX reads identically to one reporting a live defect) — the orchestrator is carrying it to tonight's substrate pass with the constraint that `check-ci-incident` deliberately fires on narration with no tense guard. Keep the 2026-09-22 date; escalate by name rather than re-dating if nothing has moved.

**`W-3`** (watch for acknowledgement of the erdosproblems.com/36 correction) reads 2026-09-24. **`G-4`** reads 2026-09-26. **`A-47`** (the depth audit) reads tomorrow. No item is overdue, and no wait in this ledger is undated.

## State Appendix

_Written last, from live commands. A report cannot name the commit that lands it: the HEAD below is the commit this file's own commit will sit on top of._

- **HEAD at writing:** `2af6082`, the commit that filed `W-11` (the standing watch on searching this lane's own record before calling a claim decision-ready); its subject reads "W-11: the record held the refutation and the analysis did not read it" — release: `git -C . log -1 --format=%h%x20%s`
- **CI:** GREEN at `2af6082`, 1 completed non-scheduled success, 0 failures, 0 pending — release: `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml` (read 19:32Z). Job-layer confirmation on today's ships: `9c23621` run 35007059259, both jobs success, `check` 38 of 38 steps.
- **Gate:** exit 0 at `9c23621`, `failedGates: []`, `check:brief` UNVERIFIABLE by design (A-41) — release: `npm run verify > tmp/verify-out.txt 2>&1`, receipt at `tmp/.verify-receipt.json`.
- **Claims:** 241 total, 239 hold, 0 broken/unreachable, 2 unverified (manual: `C-7`, `C-9`) — from the same gate run.
- **Mirror:** no drift, 116 files match upstream `9d57db8` — same run.
- **Ledger:** 62 rows, 18 open — release: `node C:/Users/.../stocktake.mjs` is a scratch script; the durable read is `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print --today=2026-09-15`, which listed 2 due (both dispositioned) and 0 overdue.
- **Depth audit:** 19 entries — 10 sound, 0 defective, 5 unresolved, 4 unreachable; 10 drawn by position, 9 on suspicion — release: `node scripts/depth-audit.mjs`.
- **Public page:** 115 constants; `c/1b.html` serves HTTP 200 at 8,426 bytes with the H2016 row present — release: a fetch of `https://u00dxk2.github.io/bounds-ledger/c/1b.html`.
- **Issues:** 0 open — release: `gh issue list --repo u00dxk2/bounds-ledger --state open`.
- **Commits today:** `3c07434`, `aea4f69`, `6461898`, `9c23621`, `2af6082`, all pushed.
