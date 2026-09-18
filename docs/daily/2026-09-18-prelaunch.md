---
product: bounds-ledger
date: 2026-09-18
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: db57062
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "We started checking the new area's numbers against the papers they come from. Five were picked by a rule written down before anyone opened a paper, so we could not quietly choose the easy ones. Two hold up, one is behind a paywall we cannot get through, and two we could reproduce exactly but could not confirm at the source, so they are marked unsettled rather than passed. All five now show on the public page with a line saying what was actually checked. Nothing is waiting on you."
---

# Daily — bounds-ledger — 2026-09-18

## BLUF

**FIRST ACTION.** Take slice 6 of the depth audit on the constants mirror — the draw is already printed and stored on `A-47` (the standing depth audit, which reads our own cited records against their sources), so the next step is reading the five rows it names, listed in § What changed, not drawing them.

```bash
node scripts/depth-audit.mjs --draw 125 175 225 275 325
```

**Today the second watched area got its first readings, and the strongest evidence carries the weakest-sounding label.** Five bounds from the Small Ramsey Numbers table were read against the papers the survey credits: R(3, 11) ≤ 50 and R(7, 8) ≥ 219 came out **sound**, R(4, 12) ≥ 128 **unreachable** behind a paywall, and the two [HW+] bounds **unresolved**. That last pair reproduced exactly — twice, from the survey's own smaller bounds — and is still unresolved, because the paper they are credited to could not be opened and the value's own source is a personal communication. A verdict here follows what was read, not how convincing the arithmetic was.

**DON'T-TOUCH.** The `--scheduled` refusals in `scripts/history-sweep.mjs`: the run refuses a shallow checkout and refuses a scan that walked fewer commits than `git rev-list --all --count` reports, printing both numbers every time. That is why `A-7` closed today on a measured 533 of 533 rather than on the workflow merely existing — which is the inspection-not-execution failure the row was opened about.

## What changed

**The first depth slice on the second watched area is live** (`db57062`, PR #38, from `f1c5e85` and `fc0bbba`). The draw came first on purpose: `f1c5e85` commits the rule and its output before any paper was opened, and `fc0bbba` carries what the readings found. The rule takes the midpoints of five equal strata over the 122 credited bounds of Table Ia — positions 13, 37, 62, 86 and 110 — so the bounds read are not the ones that looked easy.

**The readings, in the order the rule drew them:**

- R(3, 11) ≤ 50, credited to [GoeR1] — **sound**. The paper is open access and states the bound in its abstract and in Theorem 7.
- R(4, 12) ≥ 128, credited to [SuLL] — **unreachable**. Springer paywall, and no index carries an abstract. A paywall is not a defect in the survey's entry.
- R(5, 13) ≤ 1138, credited to [HW+] — **unresolved**.
- R(7, 8) ≥ 219, credited to [Tat] — **sound, by recomputation**. The credited construction is a published graph file on 218 vertices; an exhaustive check found no K7 in one colour and no K8 in the other, which is exactly what the bound asserts.
- R(8, 14) ≤ 41525, credited to [HW+] — **unresolved**.

Both [HW+] bounds reproduced exactly from the survey's own smaller bounds, by two independent restatements of the method they are credited to, and are unresolved because that paper could not be opened at all; a reading agent proposed SOUND for both and was overruled.

**The unit changed with it.** A read state now belongs to one credited bound, not to an entry: Table Ia credits an entry's lower and upper bounds to different papers, and reading one says nothing about the other. Of the 128 values Table Ia prints, the page now says: 2 sound, 0 defective, 2 unresolved, 1 unreachable, 117 not yet read, and 6 with nothing to read against (five credited to items of the survey's own Section 2.3, one with no reference printed at all).

**`A-7` CLOSED on its own closeWhen, by execution** (`70ebd63`). The scheduled sweep printed `533 reachable commit(s) per git rev-list --all --count; the scan walked 533` and CLEAN with five dispositioned fixture hits. Independent control, so the script is not merely agreeing with itself: `git rev-list --count --remotes=origin` reads 533 locally, and the two pull heads no branch shares are both inside `origin/main`. Named as not closed rather than glossed: `actions/checkout` does not fetch `refs/pull/*`, so a pull head on no branch would sit outside the sweep; none exists today.

**`A-51` (the dead upstream citation) got a decision, not a re-date.** The page is still dead — HTTP 404 now where 2026-09-05 read 200, `Content-Type: text/html`, body title `Site not found`. `W-11` (the standing rule to search this lane's own record before calling a claim decision-ready) then changed the correction: the same dead link is in `ledger/teorth-optimizationproblems/constants/1a.md` as well as the mirrored 1b file, so a fix drafted from this row's title would have left the 1a citation dead. The replacement was verified by its own page title, `[2601.16175] Learning to Discover at Test Time`. Decision: draft it, dated 2026-09-21, through the refute-it review and then David's send decision.

**`A-47` reports the finding its own closeWhen names:** the audited count has not moved since 2026-09-16's 24. Slice 6 was drawn and stored before any read — positions 125, 175, 225, 275 and 325 of the 673-row frame, which are R(3, 11)-unrelated rows of the constants mirror: `1a [IX2026]`, `21a [CNV1987]`, `28a [Bon2014]`, `35a [B2015]` and `3e [HRY1999]`. The reads move to 2026-09-21, because today's depth-reading capacity went to the second area.

## Inputs (controllable)

**`W-7` (the standing rule to read one instrument against its own claim every session) — today's is the candidate-correction queue leg of `npm run catches`.** It claims to count "verified defects in a stewarded surface awaiting a gate or a send". Today it printed `Candidate-correction queue depth: 0`. Could it have said otherwise? Only by a row carrying an explicit `correctionCandidate: true` flag: it counts that field and nothing else, by design, because a figure that GUESSES which items qualify prints next to a productivity rate. **Yesterday's report states `Candidate-correction queue depth: 1 — A-51`.** Run against yesterday's own committed ledger the counter also reads 0 — the only flagged row is `A-16`, closed since 2026-08-20 — so that 1 was written by hand beside an instrument that said otherwise, and nothing in the artifact marks the difference. positive control: the counter's self-test asserts it counts an open flagged row as 1 and stays silent on a closed one, an unflagged one, and a truthy-string flag, so it is not stuck at zero. The judgment underneath yesterday's line was right and the mechanism was simply never set: `A-51` is a verified defect in a watched surface awaiting a gate, which is the flag's own definition, so it is flagged today and the counter now reports 1 because it is true rather than because someone typed it. Rotation: 09-13 a selection-sum refusal, 09-14 the liveness probe, 09-15 `check-ci-status`, 09-16 the public page's coverage sentence, 09-17 `check-engineering-zero`, today this.

**Findings classification, one sentence of human judgment: every defect found today was INSTRUMENT-FACING, and the record-facing work — five bounds read against their sources — found no defect in the records.** The instrument-facing ones, in order of severity: a coloring checker that returned PASS on an empty file, so a broken download would have "verified" a bound; a page guard that matched readings by COUNT, so a verdict moved to the other bound of an entry passed every check; a store whose absence or malformation republished every reading as "not yet read" at exit 0; a "systematic" label that nothing reconciled against the recorded draw, and then that reconciliation comparing positions as a string, which admitted an undrawn position by substring; page wording that claimed a reading of sources never opened; and the queue-depth figure above. Six of them were found by adversarial review across seven rounds, two by rendering the real readings rather than the fixtures, one by reading an instrument against its claim. **Consecutive instrument-facing days: 3.** Yesterday's report reads 2 and this number is taken from it rather than recalled.

**Was the counted catch numeric or BYTE-ONLY? Neither — nothing was counted.** `npm run catches` reads `2026-09-14  0 (current, partial)` with 1 completed consecutive week at zero. No generated pin moved. And the blind spot recorded yesterday still holds: that counter reads the mirror's generated pins and cannot see the second area at all, so today's five readings are outside its population by construction. Candidate-correction queue depth: 0 as printed, 1 once `A-51` carries the flag it qualifies for — see the instrument-against-its-own-claim line above.

**The standing prediction, restated because a prediction never checked is decoration:** the next record-facing catch will be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. Today is the third consecutive day the predicted MECHANISM ran — a human-shaped reading, not an alarm — and the second time it came back clean. One correction to the prediction's own wording is now owed: today's strongest check was a recomputation of a cited CONSTRUCTION (a graph file), not of a certificate on the constants mirror, so the mechanism is broader than the sentence says while the claim about where the catch appears is untested.

## Outputs (lagging)

**`G-4` reads 0, and it is a MEASURED zero.** `npm run reports`, run today: 30 issues fetched, 30 ours, 0 outside-not-an-arrival, 0 outside arrivals, the parts reconciling to the raw total, so the probe demonstrably sees issues and accounts for every one. Status expected-zero. As recorded on 2026-09-14, this counts one channel — issues arriving through the per-row links — and G-4 names something wider, so a zero here is not a claim that nothing happened.

**Arrivals: 1 unique REPO viewer in the trailing 14 days** against 275 unique cloners, which are not deducted and are mostly our own CI checking the repo out. 54 days recorded; 7 unique viewer-days since the flip. The returning-viewer proxy is INAPPLICABLE at n=1 — the sampler prints the arithmetic it refused to render rather than a meaningless 1.00. **Visits to the two published pages are still not measured at all**; this instrument counts views of the GitHub repository, and the page a reader actually lands on carries no analytics.

**Engineering zero: 0 and 0.** `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts` returns 0 open; `check-engineering-zero.mjs --project bounds-ledger` reports `0 finding(s), 0 unreadable, nothing to waive`. The caveat recorded yesterday stands and is not re-derived here: for this lane only the Dependabot leg can ever speak, because it is a static Pages site with no deployed service and no Sentry project.

## Recommendation

**Tomorrow: read slice 6, and decide the catch counter's population.** Slice 6's five rows are drawn and stored; reading them is the work, and if the audited count has not moved by then that is a two-read stall and gets reported as one. The second decision is the one `A-54` phase 2 owns on 2026-09-21 and today made concrete: the lane now has two depth stores and two populations, and `npm run catches` still reads only the mirror's generated pins. Either the second area gets a detection counter of its own or the printed figure is re-scoped where it is printed. The wrong outcome is the one where nobody chooses and the figure keeps reading as though it covered everything.

**The one thing not to let slide: the two UNRESOLVED [HW+] readings are settleable by a person with an ordinary browser.** *Discrete Mathematics* 307 (2007) 760-763 is in Elsevier's open archive; an automated fetch gets a bot wall, a human session very likely does not. That is the difference between "reproduced exactly" and "checked at the source" on two of the five bounds this slice read, which are listed in § What changed.

## On hold pending data

**Waiting on David: nothing.** No open ask. positive control: `node scripts/sky.mjs update-david-board.mjs --list --json --full-ids --project bounds-ledger` returned one row for this lane — card `ba297b25`, state `answered`, his reply "Yes let's do it! Scope and let's do it with excellence." — so the reader sees this lane's cards and the empty waiting list is a reading rather than a blind spot.

`A-51` (the dead upstream citation) reads 2026-09-21, for the draft, its review, and then his send decision. `A-47` (the depth audit) reads 2026-09-21, for slice 6. `A-54` (the second watched area) reads 2026-09-21, for phase 2 and the counter decision. `W-3` (acknowledgement of the erdosproblems.com/36 correction, emailed 2026-07-24) reads 2026-09-24, and that read is a decision to retire or re-point rather than another re-date. `A-53` (the audit store and the public page can disagree about how many rows were read) reads 2026-09-24. `G-4` (the north star: an outside party acts on a watched record without us filing the report) reads 2026-09-26. `A-50` (importing a CLI script can run it) reads 2026-09-30. `A-9` (the engineering-health P2 backlog) reads 2026-10-05. `W-6` (the read window for the README report-an-error channel) reads 2026-11-06. No item is overdue and no wait in this ledger is undated.

## State Appendix

Written last, from live commands. Every line is as-of the moment its command ran and carries the command that re-reads it; **this appendix cannot name the commit that lands it**, because that commit is made after the writing. The Gates line is the one exception and says why.

- **HEAD**: filled in by the follow-up commit named in Gates below — `git -C . log -1 --format=%h%x20%s`.
- **CI**: GREEN at `db57062`'s parent chain — `fc0bbbad16` read GREEN with 1 completed non-scheduled success, and at the job layer both jobs completed/success (`check` 44 steps, `brief` 7), no step concluding other than success or skipped — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml --sha <full 40-char sha>`, read 18:05Z. A 7-character sha padded to 40 was REFUSED by that same checker rather than answered with an empty run list, which is the guard working.
- **Gates**: filled in by the follow-up commit, which names the receipt taken AFTER this report's own commit — the shape yesterday's `a7c7fc5` landed.
- **Published pages**: `ramsey.html` answered HTTP 200 with 90,459 bytes and carries the five per-bound readings and the counts line; the Pages build row for `db57062` reads `built` at 17:44:36Z — `gh api repos/u00dxk2/bounds-ledger/pages/builds`, read 17:47Z.
- **Second area**: IN SYNC at revision #18, Table Ia 72 cells and Table Ib 50, with the R(3,9), R(4,5) and R(5,5) prose controls holding — read on the scheduled run's `check` job this morning (run 35329665515), and locally by `npm run check`.
- **Claims**: 244 — 242 hold, 0 broken/unreachable, 2 unverified, read on the same scheduled run. Both unverified are the `manual: true` erdosproblems.com pins `C-7` and `C-9`, UNVERIFIED in CI by design. C-12, C-13 and C-14, the second area's revision pins, held on a SCHEDULED run for the first time today — by count, inside the 242; the log prints no per-claim line for a claim that holds.
- **Depth audit (constants mirror, A-47)**: 24 rows — 13 sound, 0 defective, 5 unresolved, 6 unreachable; 15 drawn by position, 9 suspicion-drawn, counted apart. Denominator 770 bound rows across 115 constant files, 673 cited — `node scripts/depth-audit.mjs`.
- **Depth reads (second area, A-54)**: 5 bounds read of a frame of 122 — 2 sound, 0 defective, 2 unresolved, 1 unreachable; all 5 drawn by position, 0 picked by hand — `node scripts/ds1-depth.mjs`.
- **Indicators**: `npm run catches` 0 movements this partial week, 1 completed consecutive week at zero; `npm run reports` 0 outside arrivals, measured (30 fetched = 30 ours + 0 + 0); `npm run traffic` 1 unique REPO viewer / 275 cloners over the trailing 14 days, return rate INAPPLICABLE at n=1.
- **Engineering zero**: 0 open Dependabot alerts, 0 lane findings.
- **Dead references**: 1 before this file existed, and it was this file — `docs/cold-starts/2026-09-18.md:66` cites `docs/daily/2026-09-18-prelaunch.md` — `node scripts/sky.mjs check-doc-references.mjs`, read 19:09Z. Re-run after this commit is the check that it cleared.
- **Codex**: probe GREEN at 15:09:03Z with `SPAWN: FAILED EPERM`, so `codexCalls: 0` all day, reason `probed-declined`. 7 adversarial reviews executed; the seventh approved with no material findings.
- **Sub-agents**: 3 dispatched for the paper reads, each re-checked by this session against its own saved files before anything reached the store. One proposed SOUND on the two [HW+] bounds and was overruled.
- **positive control for every zero in this report**: `npm run reports` printed its parts reconciling to the raw total (30 = 30 + 0 + 0); `check-engineering-zero.mjs` reports per-lane rather than a fleet aggregate and named this lane's row explicitly; `npm run catches` printed non-zero weeks in the same output as this week's zero; and the candidate-correction counter's own self-test fires on an open flagged row.
