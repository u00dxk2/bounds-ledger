---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: unread
north_star_classification: unread
product: bounds-ledger
date: 2026-10-28
lifecycle_stage: launched
last_deploy: 8be7f8ac9d (GitHub Pages build "built"; npm run served PASS)
on_hold_items: 1
top_action_today: resolve the overnight drift on 5a (the Sidon set constant) and keep the light day to essentials
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-28 (Wednesday, MT)

## BLUF

One of the constants we watch changed upstream overnight, and the public page now shows it. Upstream's listed upper bound for the Sidon set constant moved from 0.97633 to 0.94304, citing a 26 October preprint by Carter, O'Bryant and Tao; I checked the paper's abstract, not the corollary the figure comes from. Our overnight check flagged the change, and the page has carried the new figure since this afternoon's rebuild. It is otherwise a light day, so the rest of today's dated checks get a quick read or a new date.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** deliver built value: the mirrored record for 5a (the Sidon set constant) is current on the public page. Item: issue #47, the drift alarm for README.md and constants/5a.md (no ledger row; a drift cycle is the steward cadence, not an item).

**The user problem, in the user's words:** "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (`docs/evangelism-bar.md`). Today a reader of 5a's page gets an answer: the value changed on 2026-10-28, linked to upstream's history.

**Why this on a light day:** David's 10-28 instruction keeps the day to essentials, and the kickoff counts a red CI among them. HEAD's CI was RED (kickoff read: reverify run 40663767572 failed at `7d9b5b1`), and the red was a real record moving, not a defect.

**Section 0.**
- Primer: `docs/cold-starts/2026-10-27.md` (no 10-28 primer; the newest on or before today), banner read whole in the kickoff.
- Listener: 🟢 SSE alive (restart marker 2026-10-28T19:36:00Z, pid 40228; `hello` and `replay-complete` read below it). Loop armed by `ScheduleWakeup` tool calls; waker ladder ranks 1-3 running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 19:39:52Z). Not used today.
- CI: RED at `7d9b5b1` at kickoff (the drift); the resolving push `8be7f8a` is the read that matters, recorded in the State Appendix at close.
- Deploy drift: GitHub Pages, no Render service. `npm run served` is this lane's read: PASS below.
- Verify: `npm run verify` queued behind the machine-wide heavy gate (position 2 at last read); the scoped offline checks below ran instead, and CI runs the full suite on the push.

**Evidence** (each read today, 2026-10-28 MT):
- OBSERVED · `gh run view 40663767572 --log-failed` · the scheduled run at 09:23Z: "CHANGED README.md", "CHANGED constants/5a.md", "2 file(s) drifted", exit 1; snapshot `e95af44`, live `87b4ebb` (upstream shas; neither exists in this repo).
- OBSERVED · `node scripts/reverify.mjs --check` at 19:50Z · the same live upstream sha as the overnight run, exit 1, so upstream had not moved again.
- OBSERVED · arXiv abstract page for 2610.36207 (Carter, O'Bryant, Tao, "On the diameter and distribution of Sidon sets", submitted 26 Oct 2026) · positive control: "diam(A) ≥ k² − 1.88607 k^{3/2} for k ≥ 483" and "|A| ≤ N^{1/2} + 0.945 N^{1/4} + 0.447", both as upstream quotes them. 1.88607 / 2 = 0.943035. The 0.94304 is not in the abstract; upstream cites Corollary 1.2, which I did not read.
- OBSERVED · arXiv abstract page for 2607.01169 (Hou, Zhao; v1 1 Jul, v3 4 Sep 2026) · "γ₀ = 0.94349… < 0.9435" and "improves the previously published coefficient 0.98183", as upstream's [HZ26] row and note say.
- OBSERVED · `npm run resnap` · "snapshot: 121 files @ teorth/optimizationproblems@87b4ebb", "240 generated pins", RESULT PASS; `git diff -U0 ledger/claims.json` · one pin moved, 5a's last-listed upper-bound row (0.97633 AlphaEvolve row → the [COT26] 0.94304 row).
- OBSERVED · after commit `e8f7e7f`, a second `render-site` + `render-constant-pages` · 5a's row "date unknown" → "value changed 2026-10-28"; committed as `8be7f8a`.
- OBSERVED · `render-constant-pages --check` exit 0, `render-site --check` exit 0, `openai-math --selftest` exit 0, `check-claims` "254 claim(s): 252 hold, 0 broken/unreachable, 2 unverified (manual)" exit 0. 5a has no entry in `ledger/openai-math-map.json` or `ledger/newer-results.json` (Grep for `"5a"`, no matches).
- OBSERVED · `gh api …/pages/builds` · newest row commit `8be7f8a…`, status "built", 20:29:56Z; `npm run served` · "2 checked — 2 served, 0 in flight, 0 stale, 0 unreachable", exit 0.
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- OBSERVED · issue #46 (10-26 "Re-verification failed") was still open: run 40352447282 at `0b4d501` failed the arXiv watcher self-test ("1a's upper side is UNJUDGED"); `fe27268` fixed it and the next run passed. Closed by hand today with that account.
- MISSING · whether any reader opened 5a's page. The pages carry no analytics (`A-59`, the blind encounter on the public pages).

**Classification:** today's one catch is record-facing and numeric: the drift alarm caught a real upper bound moving (0.97633 → 0.94304), not a byte-only edit. The standing prediction says it is WRONG "if the drift alarm produces the next record-facing catch"; the 10-18 report read a drift cycle as firing neither condition, because the alarm caught upstream's update rather than a defect. Decided at the close: not falsified, on the 10-18 reading (that report counted four numeric pin moves and judged that "neither falsifying condition fired"); the alarm caught upstream's own correct update, not a defect. The reading is now written into the CLAUDE.md clause itself.

**Permission:** a drift cycle is the steward cadence, inside the lane's authority (CLAUDE.md "Snapshot-on-drift discipline"). No upstream contact; nothing outward beyond our own page, which publishes on every push.

**Next action:** deliver built value, done; what remains is the close of issue #47 once the push's CI is read.

```
node C:/dev/skylark/skylark-site/scripts/check-ci-status.mjs --repo C:/dev/skylark/bounds-ledger
```

**Acceptance condition:** CI GREEN at `8be7f8a`, then issue #47 closed by hand with a comment naming `e8f7e7f` and the verification. Met at P1: `check-ci-status.mjs --repo` "GREEN — 3 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending" at `8be7f8ac9d`, and #47 closed with that account.

**Delivery and encounter checks:** delivery read done (`npm run served` PASS at 8be7f8a). Encounter: an outside arrival through 5a's "looks wrong?" link would appear in `npm run reports`; at this traffic it is readable at N=1 and is not expected.

**USER-FACING:** yes · `ledger/teorth-optimizationproblems/README.md`, `ledger/teorth-optimizationproblems/constants/5a.md`, `ledger/teorth-optimizationproblems/manifest.json`, `ledger/claims.json`, `ledger/open-pull-requests.json`, `README.md`, `index.html`, `c/*.html` (120 pages; only `c/5a.html` changed in value, the rest carry the new sha and pull-request list).

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice (8): `A-47` (the depth audit; the new 5a rows change its cited-row denominator), `A-50` (CLI import side effect), `A-59` (blind encounter), `A-70` (phone tap targets), `A-88` (the display question; its draft is a normal-day job), `A-89` (census blind shapes), `A-90` (stale pull-request list), `W-14` (issue 218 watch; its onTrigger cites `constants/46a.md`, a path the gate says does not exist here).
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: NONE".
- (c) CROSSED state reads (1): HEAD CI RED at `7d9b5b1`, 1 of 1 completed run failed; this packet is its resolution. Stale-actionable 3 of 25 and missingLinkedCommits (nothing swept) did not cross.

## What changed

- `e8f7e7f`: drift resolved, the mirror at `87b4ebb`, one generated pin moved (5a).
- `8be7f8a`: second render, so 5a's row carries its change date.
- Issue #46 closed by hand, naming `fe27268`.

## Inputs (controllable)

- One drift cycle on a light day; no Codex round.

## Outputs (lagging)

- `npm run reports` not read today (light day). G-4, the goal that an outside party acts on a watched record without us filing the report, has no new reading.

## Recommendation

- None for David today.

## On hold pending data

- `A-88` drafting, pending a normal day.

## State Appendix

Written at the close from live commands; a report cannot name the commit that lands it.

- HEAD `9820104` before the close commit; CI GREEN at `8be7f8a` (`check-ci-status.mjs --repo`: 3 completed non-scheduled successes, 0 failures); `9820104` is doc-only.
- Local `npm run verify` at `9820104`: exit 1 on one gate, `check:state` ("catch table: STALE — README.md claims 19 upstream drifts, but mirror history has 20 resolution cycles"). Every other gate passed. Fixed in the close commit: the README gains the `e8f7e7f` row and says 20; `render-state-block.mjs --check` then printed "catch table: 20 cycles, and README.md says 20.", exit 0. The full gate is not re-run (the fix is README prose; the other ten gates passed at `9820104`).
- Due today, all eight dispositioned: `check-due-gates-dispositioned.mjs` printed "snapshot … CURRENT (taken 2026-10-28)", "verdict: CLEAR — every gate due at Phase 0 was dispositioned", RESULT: PASS (exit 0).
- Due 2026-10-29 (`--print --today=2026-10-29`): `A-47` (the depth audit), `A-81` (the arXiv newer-result watcher), `A-84` (the store refusal), `A-88` (the display question).

### Close

`ACTION: COMPLETED · item #47 (the 5a drift) · P1 4da5f6be` — the review (`498ff7d3`) approved the shipped refresh and skipped P3. Acceptance met: CI GREEN at `8be7f8a`, #47 closed by hand with the verification.

Changed since the P1 post:
- The BLUF now says only what was verified (the review's suggested wording): upstream's listed bound, the abstract read, the corollary not read.
- The standing prediction is not falsified (the 10-18 reading); that reading is now written into CLAUDE.md's clause.
- README: the catch table gains the `e8f7e7f` row and its counts move to 20; the stale "seventeen rows … eighteen cycles" (missed on 10-26) now reads nineteen and twenty. Claims self-checked against the two abstracts and the mirror diff; a cross-family claims pass is owed 10-29 (light day, no Codex).

Ledger delta (all through `continuity-edit.mjs --set`, each with a `redate2026_10_28` note carrying its read):
- `A-88` (the display question), `A-47` (the depth audit): nextCheckDate → 2026-10-29.
- `A-89` (census blind shapes), `A-90` (stale pull-request list), `A-59` (blind encounter), `A-70` (phone tap targets): nextCheckDate → 2026-11-04.
- `A-50` (CLI import side effect), `W-14` (issue 218 watch): expectedSignalBy → 2026-11-04.
- Reads stamped today by `--run`: all eight; outputs in `continuity/read-outputs/`.

hygiene draft: ABSENT — no P3 ran, so no helper drafted one; dispositions done by hand. `check-wait-justification.mjs`: "RESULT: PASS — 1 of 109 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". `check-engineering-zero.mjs --project bounds-ledger`: "lane bounds-ledger: 0 findings, 0 unreadable", exit 0; positive control: the same run reported "8 waived across 26 lane(s)" fleet-wide, so it reads nonzero states.

Pending reads: `A-47`, `A-81`, `A-84`, `A-88` on 2026-10-29; the README row's claims pass on 2026-10-29.

Retro (one line): the README catch-table row is a hand step that `npm run resnap` does not prompt for and CI never checks (`check:state` runs only locally), so I pushed the drift fix without it and the queued local verify caught it about thirty minutes later; ending resnap with `render-state-block.mjs --check` would have caught it at resnap time. `sweep owed`.

`USER-VISIBLE: data: c/5a.html + index.html row c-5a ×1 constant — a reader of 5a sees upstream's new listed upper bound 0.94304 with "value changed 2026-10-28" linked to upstream's history, where it showed 0.97633 [proof: e8f7e7f + 8be7f8a; Pages build for 8be7f8a "built" 20:29:56Z; npm run served "2 checked — 2 served", exit 0] [coverage: npm run reports · last good read 2026-10-28 · founder+test excluded yes] [exposure: blind — the pages carry no analytics, only report arrivals are countable · bug row A-59]`
