---
product: bounds-ledger
date: 2026-09-16
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 68e9764
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "For the first time, we checked one of our records by redoing the mathematics ourselves instead of reading someone else's word for it — a 17 by 17 matrix whose claimed property we recomputed over all 131,072 possibilities, and it held. Four more records went through the usual reading: two held, and two of the papers could not be opened at all today, which we recorded as unread rather than passing them. We also delivered the comparison you asked for on watching a second area of mathematics, with a recommendation not to adopt yet and to run a small test first — that is the one card waiting on you."
---

# Daily — bounds-ledger — 2026-09-16

## BLUF

**FIRST ACTION.** Answer `A-51` — whether upstream's dead citation link is worth a correction — after re-reading whether the link is still dead. It is dated today-plus-two and it is the only outward candidate this lane now holds.

```bash
curl -sIL https://test-time-training.github.io/discover.pdf
```

**THE NUMBER THAT WILL LIE TO YOU.** The public page says **10 rows drawn by position** (the sentence at the foot of any audited constant page, e.g. `c/4a.html`), and the audit store says 24 rows audited, of which 15 were drawn by position. Neither is wrong and they are not the same population: the page counts only rows whose source was actually READ (it drops UNREACHABLE ones) and only those that survive its own render filters, while the store counts every entry including the six unreachable. A reader who quotes "24 audited" as coverage is quoting attempts, not readings. **Today that gap hid a real defect for twenty minutes** — see below.

**DON'T-TOUCH.** `usableAudit` and `isBoundRead` in `scripts/render-constant-pages.mjs`. They are the single shared definition of what counts as a row read against its source, and the reason the index badge and the constant page cannot disagree with each other. The gap today was not in them; it was that nothing compares their output to the store's.

## What changed

**A record was checked by recomputation for the first time, and it held** (`739ce16`). `10c`'s cited source is not a paper but a 17 by 17 sign-matrix certificate printed in the constant's own file. A script read the matrix from the mirror's bytes and evaluated every one of the 2^17 = 131,072 sign vectors: the discrepancy is exactly 7, so the row's `7/sqrt(17) ≈ 1.697749` is what the certificate proves. The printed row-sets agree with the matrix. Red arm, so the check can say otherwise: the same evaluation on an all-ones 17 by 17 matrix returns 1, not 7.

**Four more records read against their sources, drawn before they were read** (positions 400, 500, 600, 25, 75 of the 673-row frame, via `depth-audit.mjs --draw`). `4a` SOUND on the FunSearch paper's own sentence — "a new lower bound on the cap set capacity of 2.2202" — read in Europe PMC's open-access copy after Nature answered HTTP 200 with a 3,036-byte "Client Challenge" page. `84a` SOUND on Theorem 1.1 and equation (2.2) of the unit-distance remarks paper. `65a` and `15a` UNREACHABLE: a journal DOI that returned HTTP 502 twice, and an Elsevier redirect page. The audit now reads **24 rows — 13 sound, 0 defective, 5 unresolved, 6 unreachable**.

**The second-surface comparison reached David on the promised date** (`e7fbcd2`, row closed `271cfe0`). Two EJC dynamic surveys scored against the four criteria listed in `docs/decisions/2026-09-16-a48-second-surface-comparison.md`, both PDFs read rather than described. The recommendation is **not to adopt yet**, but to run one small trial on *Small Ramsey Numbers*: take a handful of its records and read each against the paper it cites. Card `ba297b25`. Three rounds of adversarial review changed that recommendation twice — the first round killed a claimed advantage that turned out to be equally true of both candidates, and the second stopped the trial promising more than a handful of records can show.

**`A-43` closed on its own refutation** (`55297f7`). The rounding correction this lane spent two days building does not survive the source: Haugland's abstract states the bound the same way upstream's table does. The close is on `closeWhen`'s second branch — a review refuted it and the refutation is written down — so nothing goes upstream, and the research leg is not reopened. The dead-link correction in the same upstream file was minted as `A-51` **first**, so this close could not carry it along.

**Four promises that lived only in bus posts became ledger rows** (`c5a964b`): `A-49`, `A-50`, `A-51`, `A-52`. One of them, `A-52`, was promised as a row yesterday and never filed; the orchestrator's ask did not name it and a search of `continuity/items.json` found it missing.

## Inputs (controllable)

**`W-7` — the instrument read against its own claim today is the public page's own coverage sentence**, rendered by `scripts/render-constant-pages.mjs`. It claims to say how many rows of this ledger have been read against their cited sources. Could it ever have said otherwise? Yes, and today it did — but the way it changed is the finding. Baseline: the render at the start of this slice printed nine rows drawn by position, read from `c/4a.html` after `node scripts/render-constant-pages.mjs` on 2026-09-16; the store held ten at that same moment, counted with `node scripts/depth-audit.mjs`. It said nine because `usableAudit` requires an http(s) `source` and today's `10c` entry carried a repository path, so the entry was dropped from the page with no warning and no non-zero exit anywhere. **The sentence was honest about what it counted and silent about what it had discarded**, which is the failure mode this lane exists to name in other people's records. Rotation: 09-12 the gate resolver's own RESULT line, 09-13 a selection-sum refusal, 09-14 the liveness probe, 09-15 `check-ci-status`, today this.

**Findings classification, one sentence of human judgment: all three of today's defects are INSTRUMENT-FACING, and the record-facing work produced none.** The three are the traffic label that called repository viewers page visitors, the audit entry the page silently dropped, and the audit entry that credited a reference it had not read. Against that, five records were read or recomputed against their sources and every one that could be reached held. **Consecutive instrument-facing days: 1.** Yesterday's report recorded 0 — its central finding was record-facing — and I took that figure from the report rather than recalling it.

**Was the counted catch numeric or byte-only? Neither — nothing was counted.** `npm run catches` reads `2026-09-14  0 (current, partial)` and `2026-09-07  0`, with 1 completed consecutive week at zero. The recomputation that is today's real result is invisible to that instrument by construction: it counts generated pins whose `expect` changed, and nobody's pin moved. Candidate-correction queue depth: 0 — `A-43` closed refuted, and `A-51` is dated 2026-09-18.

**The standing prediction fired its MECHANISM today and its OUTCOME did not follow.** It says the next record-facing catch will be a witness-value mismatch found by a human recomputing a cited certificate, not by any alarm we run. A human did exactly that — the `10c` certificate, recomputed over all 131,072 sign vectors — and found the record sound. So the method the prediction names is now demonstrated to work on this corpus; what it has not yet done is find a defect. Carried forward unchanged.

## Outputs (lagging)

**`G-4` reads 0, and it is a MEASURED zero.** `npm run reports`, run today: 30 issues fetched, 30 ours, 0 outside-not-an-arrival, 0 outside arrivals, and the parts reconcile to the raw total, so the probe demonstrably sees issues and accounts for every one. Status expected-zero; the goal asks for n=1 and this loop is measured in months.

**Arrivals: 1 unique REPO viewer in the trailing 14 days** (`npm run traffic`, sampled today), against 253 unique cloners which are not deducted and are mostly our own CI. **Visits to the published page are not measured at all** — that instrument counts views of the GitHub repository, and no page in this repo carries analytics. Yesterday's report called that figure page visits; it is not, and the sampler's own output now says so on both of its headline lines.

**Engineering zero: 0 and 0, read after today's last push.** `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open` returns 0; `check-engineering-zero.mjs --project bounds-ledger` reports `lane bounds-ledger: 0 finding(s), 0 unreadable`. positive control: the same engineering-zero sweep reported RED for two other lanes in the same run — agentic-dir with 1 unresolved Sentry issue, sinusoidal-cycles with 46 open Dependabot alerts — so this reader returns non-zero when there is something to return.

## Recommendation

**Tomorrow: decide `A-51` (the dead upstream citation) and take slice 6 of the depth audit.** Both are dated 2026-09-18 deliberately — they are the same kind of work on the same sources, and the slice's next positions are already fixed (125, 175, 225, 275, 325). `A-7` and `A-9`, the two engineering-health rows, come due tomorrow and each needs a decision or a written close rather than a re-date.

**The one thing not to let slide: `A-53`.** Nothing compares the audit store's count to the page's, and today that gap hid a dropped entry. Its own row forces a three-way choice on 2026-09-24 — build the comparison, make the renderer refuse a dropped entry, or drop the row with the reason written down.

## On hold pending data

**Waiting on David: one card.** `ba297b25` — whether to adopt a second area to watch. The recommendation is not yet, so nothing stalls while it sits.

**`W-3`** (acknowledgement of the erdosproblems.com/36 correction, emailed 2026-07-24) reads 2026-09-24, and that read is a decision to retire or re-point rather than another re-date. **`G-4`** reads 2026-09-26. **`A-46`** is carried by the orchestrator to a substrate pass, 2026-09-22. No item is overdue and no wait in this ledger is undated.

## State Appendix

Written last, from live commands. Every line is as-of the moment its command ran and carries the command that re-reads it; **this appendix cannot name the commit that lands it**, because that commit is made after the writing.

- **HEAD**: `68e9764` "P4: the store-vs-page gap gets a row, A-47 re-dated after its read, and today's gate stamp" — `git -C . log -1 --format=%h%x20%s`, read 17:42Z.
- **Working tree**: one untracked file, this report — `git -C . status --porcelain`, read 17:42Z.
- **CI**: GREEN at `68e97645a6`, 1 completed non-scheduled success, 0 failures, 0 pending — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`, read 17:33Z.
- **Gates**: `npm run verify` exit 0 at `739ce16c`, `failedGates []`, `check:brief` UNVERIFIABLE (the permanent state recorded on `A-41`); every commit since touches only `continuity/` and `docs/`, which the receipt reader accepts as doc-only — `tmp/.verify-receipt.json`.
- **Published page**: `GET https://u00dxk2.github.io/bounds-ledger/c/10c.html -> HTTP 200 5609 bytes | contains "131,072 sign vectors": true`, read 17:34:18Z. The Pages build row for `739ce16c9321bb9a5a911d7486240070f089b66d` reads status built, created 16:23:19Z — `gh api repos/u00dxk2/bounds-ledger/pages/builds`.
- **Depth audit**: 24 rows — 13 sound, 0 defective, 5 unresolved, 6 unreachable; 15 drawn by position, 9 chosen on suspicion — `node scripts/depth-audit.mjs`, stamped through the gate runner at 17:15Z.
- **Public page coverage sentence**: 10 rows drawn by position and 7 chosen on suspicion, read from `c/4a.html` after `node scripts/render-constant-pages.mjs`. It counts only rows whose source was read, so it is smaller than the store's 15 and 9, which include the unreachable ones.
- **Ledger**: 67 rows, 21 open, all 21 dated, 0 undated — `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print`.
- **Owed tomorrow**: 2 gates, `A-7` and `A-9` (both engineering-health), and **both readCommands have NEVER been run since the rows were created on 2026-07-29** — `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print --today=2026-09-17`, read 17:43Z, `RESULT: PASS (exit 0)` with `unread: 2 of 2 due: never-run 2`.
- **Indicators**: `npm run catches` 0 this partial week, 0 the week before, 1 completed consecutive week at zero, candidate-correction queue 0; `npm run reports` 0 outside arrivals, measured (30 fetched, 30 ours, parts reconcile); `npm run traffic` 1 unique REPO viewer / 253 cloners in the trailing 14 days.
- **Engineering zero**: 0 open Dependabot alerts, 0 lane findings — both read after the day's last push.
- **Codex**: probe GREEN at 2026-09-16T14:03:22.264Z, quoted from the kickoff, never re-run mid-session. `codexCalls: 0` all day; 5 adversarial reviews executed.
- **positive control for every zero in this report**: `npm run reports` printed its parts reconciling to the raw total (30 fetched = 30 ours + 0 + 0), so the probe demonstrably sees issues; `check-engineering-zero.mjs` returned RED for two other lanes in the same run (agentic-dir, 1 unresolved Sentry issue; sinusoidal-cycles, 46 open Dependabot alerts), so that reader returns non-zero; and `npm run catches` printed non-zero weeks in the same output as this week's zero (7 movements on 2026-08-31, 5 on 2026-08-17), so that counter is not stuck at 0.
