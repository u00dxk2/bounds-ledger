---
product: bounds-ledger
date: 2026-09-14
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 433282c
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The front page now tells you which numbers we have actually opened the source paper for and checked. Nine of the 115 constants we track say so on their own row; two of those say the check could not settle the question. We deliberately did not put a tick mark next to them, because a green check invites people to read it as 'this is the best known result', which is a claim we do not make. We also found that a check we rely on for one of our own to-do items could never have run on this machine at all — it had been sitting there looking fine since it was written. And the comparison you asked for by Tuesday moved: the first candidate is scored, and it turned up that the three citation databases disagree about which surface is more cited, so reading only one would have ranked them backwards. Nothing needs you."
---

# Daily — bounds-ledger — 2026-09-14

## BLUF

The public index now says which rows we have actually read against their cited source.

A gate we were counting on for the one commitment David is owed turned out never to have been able to run on this machine at all.

**FIRST ACTION.** Pull, then start the gate — three minutes of network, and a receipt on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** The page now shows **9 badges across 115 constants**, and a cold reader takes the remaining **106 (115 − 9) as unchecked-and-therefore-suspect**. They are neither. A badge means one specific thing — a bound row of that constant was read against the source it cites, and the reading still matches the row standing there today. Its absence covers two different worlds: we have not done that reading, OR we did and the row has moved since, in which case that constant's own page still shows the reading and says it describes an earlier version of the table. The page says this in words under the table; that wording was wrong in its first draft and the adversarial review caught it. Run `node scripts/depth-audit.mjs` for the populations behind the 9.

**DON'T-TOUCH.** The `usableAudit` / `identityVerified` / `isStale` chain in `scripts/render-constant-pages.mjs`. Today it stopped a second surface from republishing a defect the first surface had already been fixed for: the new index badge asks the same three independent questions before it shows anything — the text is a table row, its hash is the one recorded when it was audited, and that exact line is still in the mirror. What makes it work is that all three can fail on their own, and that the code now has exactly ONE copy of the predicate rather than a copy per surface.

## What changed

**The index says which rows we opened the paper for** (`433282c`). Measured before building rather than assumed: the literals that match `c/1b.html` — "the source we read" ×4, "Selected:" ×5, "read against" ×1, "drawn by position" ×2 — all returned **0** against `index.html` (302,460 bytes), with `c/1b.html` as the positive control proving the literals can match at all. So the deepest checking this ledger does was invisible to anyone who did not click into an individual constant. Nine constants now carry it on the row: seven "read against its cited source", two "read against its source, not settled". The other 106 carry nothing, and the page explains that absence in words under the table rather than leaving a reader to infer it. Live and verified by fetch, not inferred from a build: `https://u00dxk2.github.io/bounds-ledger/` returns HTTP 200 with 115 rows and 9 badges.

**Three choices in that ship each had a flattering alternative.** The badge takes the WORST verdict among a constant's readings, so one supported row beside one unsupported row never reads as supported. There is no checkmark, because a tick beside "read against its cited source" invites exactly the inference `docs/evangelism-bar.md` says this page must keep refusing — that a watched row is the strongest known bound; the caution glyph stays because it can only make a citer more careful. And the predicate that decides what counts as read was hoisted out of the page renderer and shared rather than copied, because two copies are two chances for the page and the index to disagree.

**`A-48` — the second-area citation comparison promised to David for 2026-09-16 — had a gate that could never have run on this machine.** Its read was an inline `node -e` one-liner; the fleet runner spawns through the Windows command shell, which interprets the `)` at offset 148, so the child never spawned. The row had read `last run: NEVER` since it was created on 2026-09-09, and the resolver's own warning says why that matters: a gate that never executed looks exactly like one that passes. Replaced by `scripts/citation-footprint.mjs`, which reads three indices instead of one; the runner now executes and stamps it (`exit 0 in 805ms`).

**The two-index rule earned its keep on the first real use.** `A-48` surface 1 ("Small Ramsey Numbers") against surface 2 ("Graph Labeling"), both read 2026-09-14: Crossref 36 vs 156, Semantic Scholar 612 vs 143, OpenAlex 432 vs 188. Semantic Scholar and OpenAlex agree surface 1 is the more cited; **Crossref alone inverts the order**, consistent with the row's own note that Crossref counts only publisher-deposited references and so undercounts a preprint-heavy field. A Crossref-only comparison — which that row's `onTrigger` explicitly forbids — would have ranked the two surfaces backwards.

**Surface 1 scored against `A-34`'s four criteria — is it cited, does it drift, is it mirrorable without a permanently-red alarm, does it have a correction path that is not a cold email — with the weak one named.** They are extracted verbatim on the `A-48` row in field `criteriaExtractedFromA34_2026_09_12`, and the scoring is in field `surface1Scored`. Cited: yes. Drifts: yes, and invisibly — the EJC landing page reads `Version DS1: Apr 24, 2026` while Crossref reports the same DOI published 2011-08-22 with `update-to: null`, so one DOI stands for a living document. Mirrorable: promising, because that version string moves only on revision, but the PDF body is untested. A correction path that is not a cold email: **NOT ESTABLISHED**, recorded undecided rather than guessed — the landing page carries only journal navigation and the PDF was not read.

**`A-2`'s read command came down from 4,062 chars to 1,571 without losing its invariant** (`33ab324`). It was 4,062 chars, 27% of this ledger's entire read-command corpus, on a standing row whose date recurs — so every resolver run printed the whole thing, twice in one arrival this morning. The invariant stayed where resolvers print it; the four dated accounts of how that invariant came to be corrected moved verbatim to a field they do not print. Corpus 15,197 → 12,890 chars across the same 17 open rows; baseline and after-value both from a `node -e` sum of every open row's `readCommand` length in `continuity/items.json`, read 2026-09-14 before and after the edit. The rows were REPLACED in place, not appended to, so the pair is a movement in the same population.

## Inputs (controllable)

**`W-7` — the instrument read against its own claim today is `check-instrument-liveness.mjs`, and for this lane it cannot say anything but one thing.** It exited 2, NOTHING SWEPT, naming an unregistered Sentry slug. Re-run with `--no-sentry`, the escape its own remedy line offers, it still reports NOTHING SWEPT — 0 feeds examined — because the lane declares no report caches either. So the honest reading is that this leg has no subject here: running it daily cannot distinguish a healthy monitoring feed from a dead one, because there is no feed. That is correct for a lane that ships no error tracking by design, and it is worth saying out loud rather than logging a daily "cannot run" that reads like a near-miss. The supporting positive reading, on a different instrument the same day: the verify-receipt gate showed BOTH polarities within one session — it passed at P2 and P3 where the receipt covered the tree being committed, and REFUSED the P4 post because a one-file commit had moved HEAD past the receipt. An alarm that fires and stays silent on the same day needs no defence. (Rotation: 09-12 was the gate resolver's own RESULT line, 09-13 a selection-sum refusal written and deleted the same hour, today the liveness probe.)

**Findings classification, one sentence of human judgment: today's findings are INSTRUMENT-FACING without exception, and there were six of them.** Every defect found today was in our own machinery: a gate that could never spawn; my own overdue scan implementing the signal-date rule in a way that missed a row due today; my own new script printing the right verdict at the wrong exit code (127 from a libuv abort, not 2); an importer that deleted the published `c/` directory as a side effect; a test suite I made non-hermetic in the same commit that needed it hermetic; and a sentence on the index that would have contradicted the constant pages. No cited value was found wrong and no bound moved.

**Was the counted catch numeric or byte-only?** Neither: `npm run catches` reports `2026-09-14  0 (current, partial)` and `2026-09-07  0`, so nothing was counted either way. Today's work came from reading citation indices and from correcting our own machinery, neither of which that instrument can see.

**Consecutive instrument-facing days: 3.** Yesterday's report reads 2 and I took the number from it rather than recalling it. Written by hand; nothing counts this, which is the point.

**The standing prediction, checked.** Yesterday registered: the next record-facing catch will be a mismatch between what a row ASSERTS and what its source SUPPORTS — a quantifier, a strictness, a rounding — rather than a wrong value or a wrong citation. **No record-facing catch arrived today, so it stands untested for a second day.** Worth noting against it: the A-48 index-order finding is a genuine surprise about the world rather than about our code, but it is about a citation-counting apparatus and not about a mathematical record, so it neither confirms nor refutes the prediction.

**The arrival cost is no longer in our own documents.** This morning's kickoff and P1 arrived as a single 37,492-byte emission against roughly 12k chars of the lane's own artifacts actually read. The primer is not where tomorrow's start gets cheaper.

## Outputs (lagging)

**G-4 (an outside party acts on a watched record without us filing the report) reads 0, and it is a MEASURED zero.** `npm run reports`: the probe demonstrably sees 29 issues and accounts for every one, so the zero comes from a working pipeline rather than a dead one. Status expected-zero; the goal asks for n=1 and the loop is measured in months.

**Arrivals: 1 unique viewer in the trailing 14 days** (`npm run traffic`, sampled 2026-09-14T20:08:47Z), against 224 unique cloners which are not deducted and are mostly our own CI. Down from 3 on 2026-08-25. The sampler's return-rate proxy printed INAPPLICABLE at n=1, below its N_min of 3, and showed its arithmetic instead of publishing a ratio — the correct refusal, because at that count it cannot separate nobody-came-back from noise. **Today's ship was a page improvement and almost nobody is arriving at the page to see it; both halves belong in the same sentence.**

**Claims: 241 total — 239 hold, 0 broken, 0 unreachable, 2 UNVERIFIED (manual).** The two are `C-7` and `C-9`, the erdosproblems.com pins that the site's datacenter-IP block keeps unverifiable in CI; a local run reads them advisory-only and they stay UNVERIFIED, which is the rule working rather than a gap.

**Mirror: no drift.** 116 files match upstream. The catch table reads 16 cycles and the README agrees.

## Recommendation

**Tomorrow is `A-48` surface 2, then the delivery on 2026-09-16, and nothing should displace it.** Surface 1 is scored and two of its four criteria carry open sub-questions — whether the survey PDF body is mirrorable, and whether a correction path exists that is not a cold email. Both must be settled before the comparison reaches David, and the second is the one most likely to disqualify the candidate, which makes it the one to read first rather than last.

**Take the import-executes-CLI mechanism if the orchestrator will fund it.** The class has now bitten three times here — `lookup.mjs`, then `render-site.mjs` (whose own guard comment records it repeating the shape its own commit had just fixed), then `render-constant-pages.mjs` today. A fourth comment will not stop a fourth instance. The proposal is one selftest that imports every CLI module in a single spawned process and asserts the import was inert: stdout empty, file mtimes unchanged. It tests the property rather than the shape, which matters because a guard-presence lint passes on a guard that is present and wrong.

## On hold pending data

**Nothing is on hold and nothing is waiting on David.** `answered-cards.mjs --project bounds-ledger --full` reports no waiting, answered or pending-verification cards. Every one of the 17 open items carries a live future date and was updated within the last 6 days; the passive-aging tier is empty.

## State Appendix

_Written last, from live commands. A report cannot name the commit that lands it, so the shas below are the last ones pushed before this file was written; re-run each command rather than trusting a value here._

- **HEAD at writing**: `c9791f9` — `git log -1 --format=%h%x20%s`. The commit landing this report is necessarily later.
- **Working tree**: clean before this file; `git status --porcelain`.
- **Pushed**: `git rev-list --count origin/main..HEAD` = 0.
- **CI**: GREEN on `c9791f9` — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`, 1 completed non-scheduled success, 0 failures, 0 pending.
- **Gate**: `npm run verify` exit 0 at 2026-09-14T20:24:29Z at HEAD `c9791f9`, `failedGates []` — receipt at `tmp/.verify-receipt.json`.
- **Deploy**: NOTHING SWEPT in the fleet sense — this lane owns no Render service and publishes through GitHub Pages, so `check-deployed-sha-drift`'s exit 0 is a verdict about 33 other services and never about us. Our evidence is the Pages build row: `433282c built 2026-09-14T20:06:12Z` (`gh api repos/u00dxk2/bounds-ledger/pages/builds`), confirmed by a live fetch returning 115 rows and 9 badges.
- **Ledger**: 61 rows, 17 open, 0 due on/before today, 0 overdue — `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print --today=2026-09-14`.
- **Engineering zero**: PASS for this lane — 0 findings, 0 unreadable (`check-engineering-zero.mjs --project bounds-ledger`); 0 open Dependabot alerts, read after the last push (`gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open`). No Sentry on this lane by design. positive control: the SAME run reported the fleet at 2 findings across 23 lanes, so the probe returns non-zero when there is something to find — our zero is a reading, not a dead query.
- **Gate 2 (doc-only CI fast path)**: NOT APPLICABLE — this lane has no doc-only fast path.
