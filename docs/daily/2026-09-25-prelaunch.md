---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-25
lifecycle_stage: launched
last_deploy: c05232fa (the last page-changing commit; `npm run served` read 23 of 23 changed files served as committed at 2026-09-25T14:20Z)
on_hold_items: 0
top_action_today: the first census session of the Small Ramsey Numbers rebuild; ten bounds read against five credited papers, held off the frozen page
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# Daily report — bounds-ledger — 2026-09-25 (MT)

The whole rail, P1 to P5, ran this morning in one session. Every figure below names the command it came from and when it was read.

## BLUF

**FIRST ACTION (next session, 2026-09-26):** `A-56` (settle 46a by reading the published body of Bourgain's GAFA 1991 paper) is due. Read its routes and its stop condition first:

```bash
node scripts/sky.mjs show-item.mjs A-56 --fields onTrigger,waitJustification.unWait,closeWhen
```

**DON'T-TOUCH:** the refusals in `scripts/ds1-depth.mjs`: an undrawn position, a value the committed table no longer prints, and now census papers read out of turn. The rebuild builds on them rather than replacing them.

**The day in one line:** we started re-checking the Small Ramsey Numbers table paper by paper. Ten of its 122 bounds were read against five credited papers: six were confirmed, one could not be settled, and three had no readable copy. The page David froze is unchanged.

## What changed

- **`A-54` (the Small Ramsey Numbers rebuild, the second watched area), census session 1.**
  - The plan was committed before any paper was opened, as `876caa4`, and the readings followed as `7bd7ec9`.
  - `node scripts/ds1-depth.mjs`, run after the readings were written and before `7bd7ec9` was committed, printed: "census: 10 of 122 bound(s), across 5 of 42 credited paper(s) — 6 sound, 0 defective, 1 unresolved, 3 unreachable".
  - SOUND, each checked by this session on the saved page images:
    - [GG] Greenwood and Gleason 1955: R(3,4)=9, R(3,5)=14 and R(4,4)=18.
    - [Kéry] Kéry 1964, in Hungarian: R(3,6)=18.
    - [GR] Grinstead and Roberts 1982: R(3,8) ≥ 28 and R(3,9) ≤ 36.
  - [GrY] Graver and Yackel 1968 is UNRESOLVED. Only the abstract was read, because ScienceDirect put a bot challenge in front of every automated route.
  - [Ka2] Kalbfleisch's 1966 thesis is UNREACHABLE on three bounds. No public copy was found.
- **The freeze, held in code** (`876caa4`). Census rows go into the store that `ramsey.html` renders from, so without a filter the first one would have changed the page David froze on 2026-09-20.
  - `pageRows()` holds census rows off both pages, and every row is still validated.
  - `copying.html`'s guard is judged against every stored row, so a census row that stores a survey bibliography entry is refused.
  - `render-ramsey.mjs --check` still passes on the committed pages.
- **Two rules written into `A-54` before they were needed:**
  - The census-day receipt rule (`89b4dd4`).
  - What a session does when a source is blocked (`3dd9b0c`). The 2026-09-28 rate checkpoint now reports papers ATTEMPTED and papers READ apart. Session 1: 5 attempted, 3 read.

**Findings classification, one sentence of human judgment: today's one finding is INSTRUMENT-FACING.** The census store fed the frozen page directly, and so did the disclosure guard. The rebuild scope written on 2026-09-21 did not see this. It is a defect in our own machinery, and it was found before any census row was written.
- **Numeric or byte-only: neither.** `npm run catches` at 2026-09-25T14:20Z read 0 in the current partial week and 2 completed consecutive weeks with none, so nothing was counted.
- **Consecutive instrument-facing days: 1**, counted by hand. 2026-09-24's finding (46a) was record-facing.
- **The census readings produced no record-facing finding.** None of the six SOUND bounds disagrees with its paper. The [Ka2] corroboration paper proves R(3,7) ≥ 22 rather than the 23 credited to the thesis, but it is not the credited source, so that is a note and not a defect.
- **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." Today did not test it: no record-facing catch was made, and today's reading was the second area's census, not `A-47`.
  Positive control: the same kind of reading produced a record-facing finding yesterday. 46a's reference was found not to carry its row's value, in `c05232f`, so this method can return one.

**W-7 — one instrument read against its own claim: `update-david-board.mjs --list --project bounds-ledger`, used at P4 to support "Blocked on David: none".** It returned `"items": []` over a window it states as `"hours": 48`. So it could never have shown an open card older than two days, and "none" from it alone covers two days, not the board. Today's claim stands because a second, independent read agreed: the kickoff composer's full board read at 2026-09-25T13:11Z found no card for this lane. Rotation: 09-21 `gh api rate_limit`, 09-22 `A-55`'s readCommand, 09-24 `depth-audit.mjs`'s drawn-by-position count, this one today.

## Inputs (controllable)

- **Three adversarial reviews, each on the right target.**
  - Round 1, on the working tree: needs-attention, with two medium findings. First, a census reading only the LAST of 42 papers counted as progress. Second, the disclosure guard was judged against the filtered rows. Both were fixed before the commit.
  - Round 2, on the committed branch against `89b4dd4`: approve.
  - Round 3, on the ten readings against the saved sources: approve.
- **Five reading agents, and every SOUND quote re-checked on page images.** This covered pp. 3–4 of [GG], pp. 207 and 220 of [Kéry], and pp. 32 and 36 of [GR]. The agents saved what they fetched under `tmp/depth-reads/census1/`, which is gitignored.
- **A disclosure.** The agent reading [GR] sent David's email address to api.unpaywall.org, a lookup service that requires one, in a single request. It reported this itself. No saved file carries the address: a Grep over `tmp/depth-reads/census1` returned 0 hits, and the same Grep found `"doi"` in 6 files as a positive control. The reading brief now forbids sending any identity and drops Unpaywall.
  Positive control: the same Grep over the same folder found `"doi"` in 6 files, so it read the saved sources.
- **A leak sweep with a positive control.** The IP, local-path, email and user-agent pattern hit none of the ten new rows in `continuity/depth-audit-ds1.json`. Its only two hits are in `DS1-0003`, which was reviewed and committed on 2026-09-19. The same pattern returned 2 hits over a saved browser snapshot.

## Outputs (lagging)

- **`G-4` (an outside party acts on a watched record without us filing the report): 0 arrivals.**
  - Source: `npm run reports` at 2026-09-25T14:20Z, exit 0.
  - It counted 30 raw issues: 30 ours by author, 0 outside, and the parts reconcile to 30.
  - The rule of three on 0 arrivals over the 29 clean-detection days since 2026-08-28 gives an upper 95% bound of about 0.10 arrivals a day.
  - Page readership is not measured at all.
- **Record-listing movements: 0 in the current partial week, and 2 completed consecutive weeks with none.** Source: `npm run catches` at 2026-09-25T14:20Z. The 23 across 10 weeks is a ceiling, not a rate.
- **Depth audit (the constants mirror):** "34 row(s) audited — 19 sound, 0 defective, 7 unresolved, 8 unreachable", from `node scripts/depth-audit.mjs`, run between 14:20:55Z and 14:21:02Z. It is unchanged today.
- **The second area, printed beside it and never summed:** "census: 10 of 122 bound(s), across 5 of 42 credited paper(s)". The drawn sample stays at 5 read.
- **Publish:** "23 checked — 23 served, 0 in flight, 0 stale, 0 unreachable", from `npm run served` at 2026-09-25T14:20Z, anchored on `c05232f`. Today's commits touched no published page.

## Recommendation

**[A] 2026-09-26: `A-56` (settle 46a by reading the published body of Bourgain's GAFA 1991 paper, pp. 149–187).** Try its three routes. If none reads the body, close the row as "no reachable copy" and do not re-date it. Nothing goes upstream.

**[A — user-visible] 2026-09-27: `A-47` slice 8 (the depth audit), which renders on the public constant pages.** Draw it and push the draw before any source is opened.

**[A] 2026-09-28: `A-54` census session 2 and the rate checkpoint.**
- Session 2 reads papers 6 to 10 of the order: McZ, Ex5, Ang1, Ex20 and GoeR1.
- It runs by `blockedSourceRule2026_09_25`.
- The reading brief sends no identity.
- The checkpoint reads papers attempted and papers read, apart.

## On hold pending data

**Nothing in this lane waits on David.** P4's board read returned `"items": []`, and the kickoff composer's full board read at 13:11Z found no card for this lane.

**`W-3`** (the watch for a reply to the 2026-07-24 email about erdosproblems.com/36) reads on 2026-10-08. Whether to close it for no response is David's call.

**Dated reads ahead:**
- `G-4`, `A-56` and `A-52` (write down how an outsider could act on a record without filing an issue): 2026-09-26. `A-52` is already overdue on its own trigger. It said to write the `arrivalShapes` field on 2026-09-23, and `show-item.mjs A-52 --fields arrivalShapes` printed "(absent)" today.
- `A-47`: 2026-09-27.
- `W-12` (upstream's handling of our pull request #194) and `A-54`'s checkpoint: 2026-09-28.
- `W-13` (someone must call the served-bytes check): 2026-09-29.

## State Appendix

Written last, from live commands, on 2026-09-25 morning MT. **This appendix cannot name the commit that lands it.**

- **HEAD before this pass**: `3dd9b0c` "P4 2026-09-25: A-54 gets a written rule for blocked sources before census session 2", equal to origin/main. Read with `git rev-parse HEAD` and `git rev-list --count origin/main..HEAD`, which printed 0, in the P4 commit step.
- **CI**: GREEN at `7bd7ec94170a5a9e9f1d4c5a4c047a6f67e91316`, the last commit to touch code-adjacent data. `check-ci-status.mjs --workflow reverify.yml` exited 0 and printed "1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending", read just before the P3 post at 2026-09-25T14:03:09Z. The commits after it are ledger- or doc-only.
- **Gates**: `npm run verify` exited 0. Its receipt reads `{exitCode: 0, sha: 7bd7ec94170a5a9e9f1d4c5a4c047a6f67e91316, at: 2026-09-25T14:02:18Z}`. The output says "No drift. 116 files match upstream" and "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)".
- **Publish**: `npm run served` printed "23 checked — 23 served, 0 in flight, 0 stale, 0 unreachable", exit 0, at 2026-09-25T14:20Z.
- **Deploy drift**: NOTHING SWEPT for this lane, which is neither a stop nor a pass. The lane publishes through GitHub Pages and declares no Render service. The bare `check-deployed-sha-drift.mjs`, run during Section 0, before the P1 post at 2026-09-25T13:18:15Z, printed "RESULT: PASS — 0 finding(s) across 33 service(s)", none of them ours.
  Positive control: the same run printed a classified row for each of those 33 services (in-sync, doc-only-drift or suspended), so it read the fleet table rather than an empty one.
- **Second area**: `node scripts/ds1-depth.mjs` exited 0. It printed "15 reading(s) stored against a frame of 122 bound(s)" and the census line quoted above.
- **Ledger**: 72 rows. `continuity-edit` printed "items.json items[] (72 rows)" at P2.
- **Tomorrow's primer**: `docs/cold-starts/2026-09-26.md`, written in this pass. `check-next-primer-exists.mjs` read it ABSENT earlier in this pass, before it was written. After it was written, `npm run close:primer` exited 0 and `gen-primer-first-action.mjs --check` printed "RESULT: PASS — checked candidate + target PASS, 3 owed gate(s)".
