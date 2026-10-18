---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-18
lifecycle_stage: launched
last_deploy: 840f3cb (HEAD at the 10-18 kickoff)
on_hold_items: 0
top_action_today: resolve the overnight upstream drift (23 files, 6 pins) and reconcile the 1b note now that pull request 225 is merged
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-18 (Sunday, MT)

## BLUF

Overnight the source table merged about twenty changes, so our public page is now behind it on 23 constants, and the alarm that should have told us could not file its report. P1 picks the catch-up and the alarm fix over the kickoff's audit slice, which moves behind them; nothing is committed until the manager's P1 review.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** the public page shows what the source table says this morning, and the 1b page stops describing pull request 225 as proposed. Items: the drift cycle (the steward cadence; no row, it is the lane's standing obligation), `A-82` (the human read that carries the 1b note), and a new defect row for the alarm (to mint at P3).

**The user problem, in the user's words:** someone about to cite one of these constants asks "is this the current best bound?" For 23 constants the page today answers from the source table as it stood on 2026-09-26, and for six of them the bound itself has moved (21a, 3b, 3c, 71a, 7a, 84a). On the 1b page they read that the strongest construction is "proposed and not merged"; upstream merged it at 2026-10-18T05:54:24Z.

**Evidence** (each read today unless marked):
- OBSERVED · scheduled `reverify.yml` run 39115261031 on `840f3cb`, 2026-10-18T09:25Z (`gh run view 39115261031 --json jobs`) · whole mirror · `Check adopted surface for drift` failed with "23 file(s) drifted"; `Check ledger claims across cited surfaces` failed with six BROKEN generated pins: `pin:21a:U`, `pin:3b:L`, `pin:3c:L`, `pin:71a:L`, `pin:7a:U`, `pin:84a:L`.
- OBSERVED · same run, step `Open finding` · `GraphQL: Body is too long (maximum is 65536 characters) (createIssue)`, exit 1 · `gh issue list --state open` returns `[]`. **The alarm fired and filed nothing:** on the largest drift this ledger has seen, no issue exists and nobody was told. The issue body is the whole of `finding.txt` with no length bound.
- OBSERVED · `gh api repos/teorth/optimizationproblems/commits?per_page=40` · upstream `main` · 2026-10-17T22:30Z to 2026-10-18T05:56Z · about twenty pull requests merged in one session (#198 to #231), newest `46dbf03` (an upstream sha; it does not exist in this repo). Our mirror's manifest pins `2c1968c` (also upstream), fetched 2026-09-26T18:10:37Z. One burst, so it is resolved once, to the latest sha. pragma: allowlist sha
- OBSERVED · `gh pr view 225 -R teorth/optimizationproblems --json state,mergedAt` · `{"mergedAt":"2026-10-18T05:54:24Z","state":"MERGED"}`. The upstream 1b table now carries `$0.3808585504$* | [A2026]`, whose row names construction SHA-256 `62a976fa1366`, the prefix of our store entry's `fileSha256`. Our posted 512-step entry (0.3808590566149) is now above both new 1b rows (0.3808585749 and 0.3808585504). Both 1b store entries therefore stop being newer than the table: the reconcile signal the 10-17 primer named, not a bug. pragma: allowlist sha
- OBSERVED · `npm run verify` (local; receipt `tmp/.verify-receipt.json`: `"exitCode": 1`, `"sha": "840f3cbe…"`, `"at": "2026-10-18T14:52:33.270Z"`) · `npm` (the self-tests) PASS; `check:drift` exit 1 with "23 file(s) drifted", the same count CI read; the eight later gates did not run ("skipped after check:drift failed"), so the claims leg is read from CI above, not locally.
- OBSERVED · `node scripts/depth-audit.mjs --draw 419 469 519 569 619` (exit 0, literal output `tmp/a47-slice19-draw.txt`, not committed) · "frame: 691 cited bound row(s)" · rows 50a [AGM20], 57a [AG1937], 65a [Xyl2011], 78a [FP2019], 84a [MO511514]; "0 of 5 drawn position(s) land on a row already held". Drawn before any resnap, as the ordering note requires; the commit of the draw waits for the review like everything else.
- OBSERVED · `node C:/dev/skylark/skylark-site/scripts/check-due-gates-dispositioned.mjs --snapshot` · "2 gate(s) due on/before 2026-10-18": `A-45` (stale-value resolvability) and `A-47` (the depth audit).
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- OBSERVED · `answered-cards.mjs --project bounds-ledger` · 0 new; card 0dfcf407 unchanged and still binding (no upstream contact).
- MISSING · who reads the page: no analytics by design (`A-59`).

**Why this and not the kickoff's A-47 slice 19:** the kickoff was composed with CI RED and named the audit as the one job. The red is a real record event on six cited bounds and a page 22 days behind its source, and the alarm built to surface it failed silently. A depth-audit slice proves five citations against their sources; the drift cycle makes 23 constants' page rows current. The audit slice stays owed today (dated) and is drawn first, see the ordering note below.

**Ordering note — draw A-47 before the snapshot.** `depth-audit.mjs --draw` reads its sampling frame from the mirror on disk, and the resnap adds rows (two new constants, 1c and 1d, and changes in 21 other files), so positions 419, 469, 519, 569, 619 name different rows after it. Slice 19 is drawn and its draw committed against the current mirror (`2c1968c`) first, then the resnap runs; the five reads can happen after.

**Permission:** the drift cycle is the steward cadence in `CLAUDE.md` (verify against primary sources, then `npm run resnap`, commit deliberately). The 1b reconcile is inside `A-82` and David's card 0dfcf407 (no upstream contact; the note updated after the reviews), paraphrased here as this repo records his words. The alarm fix is a lane-internal workflow change. Nothing goes upstream. None of the rows is parked or frozen.

**Next action — deliver built value** (the source table's own changes, verified, onto our page), in this order:
1. Draw A-47 slice 19 against the current mirror and commit the draw.
2. Verify the 23 drifted files against upstream at `46dbf03`: every changed row against its cited primary source wherever the row names one (the six moved pins first), byte-fidelity for the rest. A burst gets one resolution.
3. `npm run resnap`, commit, second `render-site.mjs` after the commit (the dates rule).
4. Reconcile the 1b store: retire the pull-request entry (now in the table, asterisked) and the 512-step entry (no longer below the table), so the note says nothing that is now false; claims pass on whatever sentence remains.
5. Bound the alarm's issue body under 65,536 characters with a pointer to the run, red-armed on an oversized `finding.txt`.
Codex read-only review before the push (code and claims), then push, `npm run served`, CI green.

First command:

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 419 469 519 569 619
```

**Acceptance condition (observable):** `node scripts/reverify.mjs --check` exits 0 against upstream `46dbf03` or later and `check-claims.mjs` shows no BROKEN pin; the live `index.html` and the `c/` pages of the 23 constants serve the new rows (`npm run served` SERVED); `c/1b.html` no longer says pull request 225 is open; `reverify.yml` and `page-check.yml` are green on the pushed tip; and the oversized-body test makes the alarm file a truncated issue rather than exit 1.

**Delivery and encounter checks:** delivery is `npm run served` plus one fetch of the live pages after the Pages build (about 3 minutes, measured 2026-09-22). Encounter: no analytics, so the only event that could appear is an outside issue through a row's "looks wrong?" link (`npm run reports`), readable at N = 1; the expected count today is zero.

**USER-FACING: yes.** Paths: `ledger/teorth-optimizationproblems/**` (via `--snapshot` only), `ledger/claims.json` (generated pins), `README.md` (state block), `index.html`, `c/*.html`, `ledger/newer-results.json`, `.github/workflows/reverify.yml`, `continuity/items.json`, `docs/daily/2026-10-18-prelaunch.md`.

**A prior-day retro finding that bears on the choice:** none recurred. The nearest is the 10-17 primer's own instruction (check pull request 225 first if the store goes red), which is what this packet did.

**HYGIENE INPUTS** (copied from the kickoff's reads):
- (a) dated gates due today and not the choice: `A-45` (stale-value resolvability, `node scripts/check-resolvability.mjs`, run locally). `A-47` is drawn today (step 1) and its five reads are owed today.
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger" (0 of 754).
- (c) state reads marked CROSSED: HEAD CI RED, 1 of 1 completed runs on `840f3cb` (today's selection, leaves this list); board cards carrying David's word, 1 of 1 (0dfcf407, binding, no action owed beyond A-82's reconcile); prior-day retro, 10 still-on-discipline of 10 tagged findings; missingLinkedCommits, NOTHING SWEPT (0 of 0 considered).
