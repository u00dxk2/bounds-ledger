---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-24
lifecycle_stage: launched
last_deploy: c05232fa (the last page-changing commit; `npm run served` read 23 of 23 changed files served as committed)
on_hold_items: 0
top_action_today: five more cited rows read against their sources; one reference found not to support its row's value, published as not settled
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# Daily report — bounds-ledger — 2026-09-24 (MT)

This session resumed after a two-day stall. It closed the 2026-09-22 day first (that report landed tonight, two days late, and says so), then ran 2026-09-24's own rail, P1 through P5, in the evening. Every figure below names the command and the moment it was read.

## BLUF

**FIRST ACTION (next session, 2026-09-25):** `A-54`'s census session, the Small Ramsey Numbers rebuild (the second watched area), which was dated tonight and did not happen. The depth audit ran tonight, a day early, so on the alternation the rebuild's own scope fixes, 2026-09-25 belongs to the census. Start by reading the rebuild scope:

```bash
node scripts/sky.mjs show-item.mjs A-54
```

**DON'T-TOUCH:** the scheduled drift alarm, `.github/workflows/reverify.yml`. It covered both dark mornings with nobody watching, because it runs on GitHub's clock and not on a session's.

**The day in one line:** the depth audit read five more of our cited rows against the papers they credit, and one of them, 46a, credits a paper that proves a weaker exponent than the row claims. We published that as "not settled" rather than "defective", because the published article's body is paywalled and was not read.

## What changed

- **`A-47` (the depth audit: reading our own cited records against their sources), slice 7** (`c05232f`). Five rows were drawn by position and the draw was pushed as `0ed11f7` before any source was opened. This is the first slice whose draw has a timestamp GitHub holds, rather than only this lane's account. `node scripts/depth-audit.mjs` now prints "34 row(s) audited — 19 sound, 0 defective, 7 unresolved, 8 unreachable", up from 29 / 17 / 0 / 6 / 6.
  - **46a [Bo1991] UNRESOLVED.** The row credits Bourgain's GAFA 1991 paper with the exponent 58/15. The IHES preprint body and the published pp. 147–148 give 31/8. Bourgain's companion paper, IHES M/90/74, proves 58/15 (Proposition 2.15), and on its p. 1.1 it says the cited paper shows 31/8. Every quotation was checked by this session on the saved page images.
  - **5b [GL95] SOUND.** Corollary 2.5, g(n) ≤ 3n/5 + 1, read in the author-posted scan.
  - **71a [MI2026] SOUND.** The certificate's own truth table was recomputed independently, and H/(I−1) agrees with the archive's 60-digit floor.
  - **52a [DB1997] and 80a [KR1998] UNREACHABLE.** The publisher's bot check blocked every automated route. 80a's article is free to read at the publisher, so a person with a browser could settle it.
- **The public site shows it.** The index carries new badges on 5b, 71a and 46a, and the ledger-wide sentence on every audited page moved to 25 drawn by position, 18 read and 7 not readable. `npm run served` at 2026-09-25T02:14Z read 23 of 23 changed files served as committed.
- **`W-13` (someone must call the served-bytes check) cannot close on a file existing** (`ea25512`). Its closeWhen now requires the scheduled workflow the orchestrator approved to be seen firing on a stale page and staying silent on a settled one. It is still dated 2026-09-29.
- **`A-56` (settle 46a by reading the published body, pp. 149–187)** was minted (`b4003fa`), dated 2026-09-26. It names three routes and what each outcome does, and it forbids a re-date that retries the same routes.

**Findings classification, one sentence of human judgment: tonight's one finding is RECORD-FACING.** 46a's reference does not carry the value its row credits to it, and a reading agent found that by opening the cited paper in the depth audit, not through any alarm. **Numeric or byte-only: neither.** `npm run catches` at 2026-09-25T02:28Z read 0 in the current partial week and 2 completed consecutive weeks at none, so nothing was counted. **Consecutive instrument-facing days: 0.** 2026-09-22 made it 1, 2026-09-23 had no session, and tonight's finding is record-facing, so the run ends here, counted by hand. **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." Tonight's 46a is that shape: an attribution that does not carry its value, found by reading. It is UNRESOLVED, not confirmed, until `A-56` reads the published body, so the prediction is CONSISTENT and not yet tested either way.

**W-7 — one instrument read against its own claim: `depth-audit.mjs`'s "drawn by position" count, and it could never have said otherwise about ordering.** It counts entries whose `selection` field reads "systematic", and that field is written by the same hand that writes the verdict. So the count proves a label, not that a draw came first; a reading done before its draw would be counted identically. Tonight is the first slice where something outside this lane orders the two: the draw was pushed as `0ed11f7` before the agents were dispatched. The store's sampling rule now says so, and the count still does not check it. Rotation: 09-20 `answered-cards`, 09-21 `gh api rate_limit`, 09-22 `A-55`'s readCommand, this one tonight.

## Inputs (controllable)

- **The adversarial review earned the ship.** It returned needs-attention with one medium finding. I had stored 46a as DEFECTIVE, the store's first, on an argument rather than a reading, and the review refused it because the published body was unread. It was downgraded before the commit and recorded as round 6 in `continuity/depth-audit.json`. The same review confirmed the counts, that `ramsey.html` and `copying.html` are unchanged, and that no author-environment detail is in the additions.
- **Five reading agents, and every quote re-checked.** Each agent saved what it fetched under `tmp/depth-reads/slice7/`. This session re-read the key pages before anything was stored. That caught one agent describing a captcha page's title differently from the snapshot it had saved; the store quotes the snapshot.
- **A leak sweep with a positive control.** The IP-address and local-path pattern returned no match over `continuity/depth-audit.json`. `tmp/` is gitignored, so the saved reads never reach the repository.
  Positive control: the same pattern returned 2 hits over the saved 80a browser snapshot, which carries this machine's address.

## Outputs (lagging)

- **`G-4` (an outside party acts on a watched record without us filing the report): 0 arrivals**, from `npm run reports` at 2026-09-25T02:28Z, exit 0: 30 raw issues, 30 ours by author, 0 outside, and the parts reconcile to 30. The rule of three on 0 arrivals over the 28 clean-detection days since 2026-08-28 gives an upper 95% bound of about 0.11 arrivals a day. Page readership is not measured at all.
- **Record-listing movements: 0 in the current partial week, 2 completed consecutive weeks at none**, from `npm run catches` at 2026-09-25T02:28Z. The 23 across 10 weeks is a ceiling, not a rate.
- **Depth audit: 34 rows audited of 673 cited rows** (the 673 counted on 2026-09-11 by `depth-audit.mjs --corpus`). Of the 25 drawn by position, 18 sources were read and 7 could not be. This is not a rate: 25 systematic draws settle nothing on their own.
- **Publish: 23 of 23 changed files served as committed**, from `npm run served` at 2026-09-25T02:14Z, anchored on `c05232f`.

## Recommendation

**[A — user-visible] 2026-09-25: `A-54`'s census session**, which was dated 2026-09-24 and did not run, because the depth audit took that evening. The rebuild's rate checkpoint is 2026-09-28, and the dark window had already cost it two days.

**[A] 2026-09-26: `A-56` (settle 46a by reading the published body of Bourgain's GAFA 1991 paper).** Try its three routes to the published text: Springer's per-page preview beyond p. 148; an openly posted copy of the published text; and Bourgain's collected or selected works. If none reads it, close the row as "no reachable copy" and leave 46a UNRESOLVED with the routes named. Do not re-date it. Nothing goes upstream: a correction to the mirrored entry is outward contact, and it goes through the adversarial review and David's gate.

**[B] 2026-09-29: `W-13` (the watch that someone must call the served-bytes check): its scheduled caller**, approved at P2. It is the served-bytes check on a cron, filing or updating one issue on a stale page, and it counts only when both firing checks are quoted.

## On hold pending data

**Nothing in this lane waits on David.** P4's probe read `"items":[]` of 18 open rows considered, and no board card for this lane carries an unanswered ask. The one row that touches his inbox, `W-3` (the watch for a reply to the 2026-07-24 email about erdosproblems.com/36), reached its two-month mark today: both page legs read unchanged, and it was re-dated to 2026-10-08. Closing it for no response remains his call.

**Dated reads ahead:**
- `G-4` (an outside party acts on a watched record without us filing the report): 2026-09-26.
- `A-56` (settle 46a by reading the published body): 2026-09-26.
- `A-47` (the depth audit): 2026-09-27.
- `W-12` (upstream's handling of our pull request #194): 2026-09-28.
- `A-54` (the second watched area, Small Ramsey Numbers): comparator checkpoint 2026-09-28.
- `W-13` (the watch that someone must call the served-bytes check): 2026-09-29.

## State Appendix

Written last, from live commands, on 2026-09-24 evening MT. **This appendix cannot name the commit that lands it.**

- **HEAD before this pass**: `b4003fa` "A-56: 46a's UNRESOLVED badge gets a named way out, dated 2026-09-26" — `git -C . log -1 --format=%h%x20%s`, read at the start of P5, equal to origin/main.
- **CI**: GREEN at `c05232faab2dd0c95474d8c5469cd311061f1568` — `check-ci-status.mjs --workflow reverify.yml`, exit 0, "1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending", read at 2026-09-25T02:14Z. The two commits after it are ledger-only.
- **Gates**: `npm run verify` exit 0, receipt `{exitCode: 0, sha: c05232faab2dd0c95474d8c5469cd311061f1568, at: 2026-09-25T02:12:45Z}`. The commits after it touch only `continuity/`.
- **Publish**: `npm run served` — "23 checked — 23 served, 0 in flight, 0 stale, 0 unreachable", exit 0, 2026-09-25T02:14Z, anchored on `c05232faab`.
- **Deploy drift**: NOTHING SWEPT for this lane, which is neither a stop nor a pass: it publishes through GitHub Pages and declares no Render service. `check-deployed-sha-drift.mjs`, bare, during Section 0, before the P1 post at 2026-09-25T01:27:57Z: "RESULT: PASS — 0 finding(s) across 33 service(s)", none of them ours.
  Positive control: the same run printed a classified row for each of those 33 services (in-sync, doc-only-drift, unprovable, suspended or not-drift-eligible), so it read the fleet table rather than an empty one.
- **Depth audit**: "34 row(s) audited — 19 sound, 0 defective, 7 unresolved, 8 unreachable" — `node scripts/depth-audit.mjs`, exit 0, read on the working tree `c05232f` carries.
- **Ledger**: 72 rows after `A-56`'s mint; `continuity-edit --mint A-56` printed "items[] 72 rows".
- **Tomorrow's primer**: `docs/cold-starts/2026-09-25.md` — `check-next-primer-exists.mjs`, exit 0, PRESENT (written by this session's earlier close). Its banner is rewritten in this pass, because its first action pointed at a depth-audit slice that has now run.
