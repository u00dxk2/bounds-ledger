---
product: bounds-ledger
date: 2026-09-17
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 76554fd
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "You said yes to watching a second area of mathematics, so we did the whole thing today rather than the small test we had recommended. The ledger now watches the standard reference table of Small Ramsey Numbers — 122 numbers read straight out of the published survey by a program that refuses to guess, cross-checked cell by cell by a second reader working from a different copy, and published as a page anyone can open. We also finished the last open piece of engineering health: a daily sweep of the whole project history for anything secret-shaped. Nothing is waiting on you."
---

# Daily — bounds-ledger — 2026-09-17

## BLUF

**FIRST ACTION.** Three gates come due today, and one of them can close. Run them in this order:

```bash
gh run list --workflow history-sweep.yml --limit 3
curl -sIL https://test-time-training.github.io/discover.pdf
node scripts/depth-audit.mjs --draw 125 175 225 275 325
```

The first is `A-7`: the scheduled secret sweep runs at 10:43 UTC, and `A-7` closes on the first run **whose log shows the full commit count** — not on the run merely existing. Open the log and read the two numbers it prints; a sweep that walked one commit also prints CLEAN.

**THE NUMBER THAT WILL LIE TO YOU.** `npm run catches` will keep reading **0** however much the Small Ramsey Numbers table moves. It counts generated pins on the `teorth/optimizationproblems` mirror whose `expect` changed, and the new area is pinned by three **hand** claims (`C-12`, `C-13`, `C-14`) against a different store — which that counter is silent on by construction, and its own self-test pins that silence. **So the lane doubled its watched surface today and its catch counter cannot see half of it.** Noted on `A-54`; phase 2 owns the decision.

**DON'T-TOUCH.** `gridsOf` and `readTable` in `scripts/extract-ds1.mjs`. They place each glyph in the cell the PDF itself draws rules for, rather than counting numbers left to right — which is the only reason a blank cell in Table Ib cannot silently shift every value after it into the wrong row. Five review rounds landed on this code; the geometry is load-bearing and it is not obvious.

## What changed

**David ruled ADOPT, and his words were not my wording** (`ba297b25`, typed 2026-09-16T18:57:51Z, surfaced to this pane 20.2 hours later). The card asked whether to adopt a second area; my recommendation was *not yet, run a small trial first*, with a drafted reply he did not send. He wrote: *"Yes let's do it! Scope and let's do it with excellence."* I read that as adopt now, scoped — with the trial demoted from a gate to phase 4 — and recorded the divergence in `A-54.davidRuling2026_09_16` rather than quietly treating "Yes" as agreement with the draft.

**The second watched area is Small Ramsey Numbers** (`9360084`, scope in `docs/decisions/2026-09-17-a54-adopt-small-ramsey-numbers.md`): Radziszowski's *Small Ramsey Numbers*, the Electronic Journal of Combinatorics dynamic survey DS1, currently revision #18. Four phases, eight named scope decisions, and an explicit statement of what is **not** covered — the survey's other sections, and every Ramsey number outside Tables Ia and Ib.

**Phase 1 — the revision watch** (`2661e95`, PR #35). `scripts/extract-ds1.mjs` reads Tables Ia and Ib out of the survey PDF with no external library: an xref-free object scan, `FlateDecode` through `zlib`, a content-stream tokenizer, and text-matrix algebra against the table's own ruled cells. **It refuses rather than emitting a partial table** — twenty-one distinct refusal conditions, each with a self-test. 72 cells from Table Ia and 50 from Table Ib landed in `ledger/ejc-ds1/section-2-1.json`, with `C-12`/`C-13`/`C-14` pinning the revision, its date and its sha256.

**Section A — the page a reader can use today** (`0ad3615`, PR #36), which is the evangelism pass's product change and the orchestrator's approved substitute for the 09-23 date. `ramsey.html` renders all 72 Table Ia entries, each carrying the four depth-audit outcomes **unmerged**, a coverage sentence that says what is not covered, and the same per-row report link the constants pages use. Live at `https://u00dxk2.github.io/bounds-ledger/ramsey.html`, verified by fetch after the Pages build, not by reading a config field.

**`A-7`'s last open leg shipped** (`76554fd`, PR #37): `.github/workflows/history-sweep.yml`, daily at 10:43 UTC at `fetch-depth: 0`. The trap is enforced in the script rather than the workflow — it refuses a shallow checkout and refuses a scan that walked fewer commits than `git rev-list --all --count` reports, because a sweep over one commit prints CLEAN. Its five known fixture hits are dispositioned by **sha256 of the matched line**, not allowlisted by path, so a new secret in the same file still fires.

**`A-9` got a decision instead of a re-date** (`0c61006`) — the fourth time that row came due, and the first time it was answered rather than pushed: re-pointed to 2026-10-05, the date its closing event is actually due.

## Inputs (controllable)

**`W-7` — the instrument read against its own claim today is `check-engineering-zero.mjs --project bounds-ledger`.** It claims to answer whether this lane is at engineering zero, and today it printed `lane bounds-ledger: 0 finding(s), 0 unreadable, nothing to waive (both counts are zero)` at exit 0. Could it have said otherwise? For the reader, demonstrably yes — the same run returned RED for buddha-ur with three unresolved Sentry issues named, so the sweep is not stuck at clean. **For this lane, only one of its two legs can ever speak.** The verdict is built from a Dependabot total and a Sentry `byProject` entry; bounds-ledger is a static Pages site with no deployed service and no Sentry project, and the check's own `blindTo` says a lane the endpoint served no entry for is judged **absent, never zero**. So the PASS here rests entirely on the Dependabot count — which I read independently as 0 — and **the PASS line does not say which leg carried it.** A silently broken Sentry leg and a genuinely clean lane print the same sentence here. positive control: the same sweep printed `RED buddha-ur: 3 unresolved Sentry issue(s)` with all three named, so the reader returns non-zero when a lane has something to return, and the absence above is about this lane rather than about a dead probe. Rotation: 09-12 the gate resolver's own RESULT line, 09-13 a selection-sum refusal, 09-14 the liveness probe, 09-15 `check-ci-status`, 09-16 the public page's coverage sentence, today this.

**Findings classification, one sentence of human judgment: every defect found today was INSTRUMENT-FACING, and the record-facing work produced none.** The instrument-facing ones, in order of severity: the secret scanner attributed a hit in a **commit message** to whichever file the previous commit's diff ended on, so a real AWS-shaped hit was reported as living in a file it has never appeared in; stale dispositions were printed **before** undispositioned hits, so a rotted record could have hidden a genuinely new secret in the same run; the manual-claim advisory ignored `nothingAfter`; and roughly a dozen geometry defects in the PDF extractor across five review rounds. Against that, 122 cells were transcribed from the survey and every one agreed with an independent sub-agent's transcription taken from a different file format, with a working negative control — **no record moved and no record was found wrong.** positive control: the extractor's own run printed `Table Ia 72 cell(s), Table Ib 50 cell(s)` with the R(3,9), R(4,5) and R(5,5) prose checks holding, so it demonstrably read the tables before reporting them unchanged. **Consecutive instrument-facing days: 2.** Yesterday's report reads 1 and I took that number from it rather than recalling it. Written by hand; nothing counts this, which is the point.

**Was the counted catch numeric or byte-only? Neither — nothing was counted.** `npm run catches` reads `2026-09-14  0 (current, partial)` with 1 completed consecutive week at zero. No generated pin moved. Candidate-correction queue depth: **1** — `A-51`, the dead upstream citation link, dated today; `A-43` closed refuted yesterday. And see the BLUF: today's new surface is outside that counter's population entirely, which is a fact about the counter and not about the surface.

**The standing prediction, restated because a prediction never checked is decoration:** the next record-facing catch will be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. Carried forward unchanged. Today does not test it — nothing record-facing arrived — but it is worth saying that the new area's 122 cells were checked by exactly that method (a second human-shaped reading, not an alarm) and found sound, which is the second consecutive day the predicted *mechanism* ran and returned clean.

## Outputs (lagging)

**`G-4` reads 0, and it is a MEASURED zero.** `npm run reports`, run today: 30 issues fetched, 30 ours, 0 outside-not-an-arrival, 0 outside arrivals, parts reconciling to the raw total — so the probe demonstrably sees issues and accounts for every one. Status expected-zero. As recorded on 2026-09-14, this indicator counts one channel (issues arriving through the per-row links) and G-4 names something wider, so a zero here is not a claim that nothing happened.

**Arrivals: 1 unique REPO viewer in the trailing 14 days** against 261 unique cloners, which are not deducted and are mostly our own CI checking the repo out. 53 days recorded. The returning-viewer proxy is **INAPPLICABLE** at n=1 — the sampler's own floor refuses to render a rate there rather than printing a meaningless 1.0. **Visits to the two published pages are still not measured at all**; this instrument counts views of the GitHub repository and no page in this repo carries analytics.

**Engineering zero: 0 and 0, read after today's last push.** `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts` returns 0 open; `check-engineering-zero.mjs --project bounds-ledger` reports 0 findings, 0 unreadable. positive control: the same engineering-zero sweep returned RED for buddha-ur in the same run, naming three unresolved Sentry issues, so that reader returns non-zero when there is something to return.

## Recommendation

**Tomorrow: close `A-7`, decide `A-51`, take slice 6.** `A-7` is the only row that can close, and it closes on reading the scheduled sweep's log for its two commit numbers — not on the workflow existing. `A-51` needs the `Content-Type` of the dead citation, not its status line: that page answered HTTP 200 on 2026-09-05 while serving GitHub Pages' "Site not found". Slice 6 of the depth audit continues the systematic ladder at positions 125, 175, 225, 275 and 325, and the draw must be printed before any row is read.

**The one thing not to let slide: the catch counter now covers half the watched surface.** `A-54` phase 2 (2026-09-21) should decide whether the Small Ramsey Numbers table gets a detection counter of its own or whether the lane's catch figure is explicitly re-scoped and says so where it is printed. The wrong outcome is the one where nobody chooses and the figure keeps reading as if it covered everything.

## On hold pending data

**Waiting on David: nothing.** Today's card was answered and there is no open ask. positive control: `node scripts/sky.mjs answered-cards.mjs --project bounds-ledger` returned one row for this lane — `[answered] ba297b25 … "Yes let's do it! Scope and let's do it with excellence."` — so the reader sees this lane's cards, and the empty waiting list is a reading rather than a blind spot.

**`W-3`** (acknowledgement of the erdosproblems.com/36 correction, emailed 2026-07-24) reads 2026-09-24, and that read is a decision to retire or re-point rather than another re-date. **`G-4`** reads 2026-09-26. **`A-53`** (the audit store and the public page can disagree about how many rows were read) reads 2026-09-24. **`A-50`** reads 2026-09-30, **`A-9`** 2026-10-05, **`W-6`** — the read window for the README report-an-error channel — 2026-11-06. No item is overdue and no wait in this ledger is undated.

## State Appendix

Written last, from live commands. Every line is as-of the moment its command ran and carries the command that re-reads it; **this appendix cannot name the commit that lands it**, because that commit is made after the writing.

- **HEAD**: `76554fd` "Merge A-7 R7: the scheduled full-history secret sweep (PR #37)" — `git -C . log -1 --format=%h%x20%s`, read 20:09Z.
- **Working tree**: two modified paths at appendix time, `continuity/items.json` (today's linkedCommits) and `continuity/traffic.json` (today's sample), plus this untracked report — `git -C . status --porcelain`.
- **CI**: GREEN at `76554fdd97`, 1 completed non-scheduled success, 0 failures, 0 pending — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`, read 20:12Z.
- **Gates**: `npm run verify` **exit 0 at `b5a73b7`**, stamped 20:19:16Z over a clean tree, `failedGates []`, `check:brief` UNVERIFIABLE — the permanent state recorded on `A-41` — `tmp/.verify-receipt.json`. It was run TWICE today and this is the second: the first, at `76554fdd`, was taken while `continuity/items.json` was still uncommitted, and `check:deferrals` reads that file, so that receipt could not say which leg was red after the edit. `b5a73b7` is the commit that lands this report, so this line is the one exception to the appendix's own rule above — it names its own commit because the gate ran after it.
- **Drift**: none — 116 files match upstream `9d57db86c8564cb623ec9f9e41429a34efd819fb` (an upstream sha; it does not resolve in this repo) — `node scripts/reverify.mjs --check`, read 20:11Z. positive control: `git cat-file -t 76554fd` prints `commit` while `git cat-file -t 9d57db86c8564cb623ec9f9e41429a34efd819fb` exits 128 with `could not get object info`, so the reader resolves local shas and the upstream one genuinely is not among them. pragma: allowlist sha
- **Claims**: 244 — 242 hold, 0 broken/unreachable, 2 unverified. Both unverified are the `manual: true` erdosproblems.com pins `C-7` and `C-9`, which report UNVERIFIED in CI by design; today's local advisory fetch returned HTTP 200 with both pinned strings still present, which is information here and never in CI.
- **Second area**: IN SYNC at revision #18, sha256 `9519a676ee381f02…`, Table Ia 72 cells and Table Ib 50 cells, with the R(3,9), R(4,5) and R(5,5) prose controls holding — `node scripts/extract-ds1.mjs --check`, exit 0, run unpiped. That sha256 digests the survey PDF, not a commit. pragma: allowlist sha
- **Published pages**: `GET https://u00dxk2.github.io/bounds-ledger/ramsey.html -> HTTP 200, 77072 bytes` and `GET https://u00dxk2.github.io/bounds-ledger/ -> HTTP 200, 115 rows`, read 20:13Z. The local `ramsey.html` is 709 bytes larger because it is CRLF on disk and served LF — 709 lines, 709 bytes, not drift.
- **Page guard**: `ramsey.html` matches the committed table at 72 entries, revision #18, and the committed file passes its own ten guards — `node scripts/render-ramsey.mjs --check`.
- **Depth audit**: 24 rows — 13 sound, 0 defective, 5 unresolved, 6 unreachable; 15 drawn by position, 9 chosen on suspicion. Denominator 770 bound rows across 115 constant files, 673 cited — `node scripts/depth-audit.mjs`.
- **Ledger**: 68 rows, 3 gates due on/before 2026-09-18 (`A-47`, `A-51`, `A-7`), 0 overdue, 0 undated — `node scripts/sky.mjs check-due-gates-dispositioned.mjs --print --today=2026-09-18`, read 20:12Z, `RESULT: PASS (exit 0)`, with `unread: 1 of 3 due: never-run 1` naming `A-51`, created yesterday and not yet read.
- **Indicators**: `npm run catches` 0 this partial week, 1 completed consecutive week at zero; `npm run reports` 0 outside arrivals, measured (30 fetched = 30 ours + 0 + 0); `npm run traffic` 1 unique REPO viewer / 261 cloners over the trailing 14 days, return-rate INAPPLICABLE at n=1.
- **Engineering zero**: 0 open Dependabot alerts, 0 lane findings — both read after the day's last push.
- **Dead references**: 1, and it is this file — `docs/cold-starts/2026-09-17.md:98` cites `docs/daily/2026-09-17-prelaunch.md`, which the check read as dead because it did not exist when the check ran — `node scripts/sky.mjs check-doc-references.mjs`, read 20:10Z.
- **Codex**: probe GREEN at 15:19:36Z, `SPAWN EPERM` on dispatch, so `codexCalls: 0` all day, reason `probed-declined`. 5 adversarial reviews executed.
- **Classifier**: `claude-sonnet-5[1m]` rate-limited twice today — ~16:01Z and from ~20:0xZ — refusing shell tool calls while read-only tools stayed available. Reported to the bus as `96348474`. Partial, not total: identical calls succeeded on retry within the same minute.
- **positive control for every zero in this report**: `npm run reports` printed its parts reconciling to the raw total (30 = 30 + 0 + 0), so the probe demonstrably sees issues; `check-engineering-zero.mjs` returned RED for buddha-ur in the same run, so that reader returns non-zero; and `npm run catches` printed non-zero weeks in the same output as this week's zero, so that counter is not stuck at 0.
