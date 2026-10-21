---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-21
lifecycle_stage: launched
last_deploy: ebed670 (HEAD at the 10-21 kickoff)
on_hold_items: 1
top_action_today: count the bound rows whose printed decimal could sit on the wrong side of the exact value their source proves (A-76), with a committed script
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-21 (Wednesday, MT)

## BLUF

A new check over every row on our pages found three where the printed ceiling sits a hair below what was proved. As David asked, we wait for the upstream maintainers to answer our 13a fix before raising them. Nothing on the public pages changed today.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** every bound row whose printed decimal stands for an exact value is counted and classified, so a reader is never shown, without anyone having looked, a number that claims slightly more than its source proves. Item: `A-76` (are other upper-bound rows printed as a decimal that sits below the exact bound their source proves?), due today; it is the kickoff's ONE JOB.

**The user problem, in the user's words:** "The page says the upper bound is 1058.565. Is that what the paper proves, or a rounding of it?" For 87a the paper proves 4√70035 = 1058.565066…; read as an exact upper bound, the row's 1058.565 is about 0.0000665 below it, which is a claim the paper does not make (`A-47-0075`, UNRESOLVED). Nothing has looked at whether other rows share that shape.

**Evidence** (each read today, 2026-10-21 MT, unless marked):
- OBSERVED (2026-10-11, `A-47-0075` in `continuity/depth-audit.json`) · the 87a row against the 1978 paper, all nine pages · one row · limit: one instance, found by the depth audit's systematic draw, not by any check.
- OBSERVED · `node scripts/depth-audit.mjs --corpus` (A-76's readCommand) · "826 bound row(s) across 117 constant file(s) — 726 cited, 100 uncited", exit 0 · this is the space the question is drawn from.
- OBSERVED · a scratch census (not committed; `a76-explore.mjs` in this session's scratchpad) over those 826 rows' value cells · 130 cells print a decimal beside an exact expression (√, fractions, π, logs, powers, Γ), 101 of those marked "≈"; 381 print a decimal with no expression; 64 print an expression with no decimal · limit: the parser here is a rough copy of `boundRowsOf` and its total (826) agrees with `--corpus`; the classes are by token match and will be redone by the committed script.
- HYPOTHESIS · that the 87a shape (a bare decimal whose exact value lives only in the paper) is findable only through rows someone has READ: the 381 decimal-only cells say nothing about their sources. So the script can classify the in-table population (the 130) mechanically and the source-stated population only over the 93 depth-audit entries already read; every other row is UNKNOWN by construction, and the output must say so rather than count it as agreeing.
- OBSERVED · `npm run reports` · 34 issues fetched, 34 ours, 0 outside arrivals; parts reconcile 34 + 0 + 0 = 34. The bar's metric (useful non-obvious answers delivered) stays NOT MEASURABLE, per `docs/evangelism-bar.md`.
- OBSERVED · `check-cycle-rotation --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- OBSERVED · `answered-cards --project bounds-ledger` · no waiting or answered cards for this lane.
- MISSING · whether any reader has relied on a printed decimal as an exact bound (the pages carry no analytics; `A-59`).

**Permission:** `A-76` is open, owner bounds-ledger, no park, no card. Counting our own mirror with a committed script is the lane's own decision class. Any member found cut against its source is a question for upstream about display convention: it goes to David as a card through the outward gate, and nothing is sent (the row's own `onTrigger`).

**Next action** (kind: investigate; the read the row names, then a committed script). First command:

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --corpus
```

Plan for P3: `scripts/decimal-vs-exact.mjs` (name provisional) reusing `boundRowsOf` from `depth-audit.mjs` (the module needs an import guard first: importing it today runs its CLI). Two populations, reported separately and never summed into one verdict: (1) in-table, a cell with an exact expression and a decimal, the expression evaluated where the evaluator can and the decimal compared in the bound's direction, honouring the cell's own "≈", "=" and "…" marks; (2) source-stated, the depth-audit entries whose recorded reading names an exact value, classified from that record. Each member is AGREES, CUT AGAINST SOURCE, or UNKNOWN (an expression the evaluator refuses, a precision past double range, or a row nobody has read). It prints the search space and refuses a bare zero.

**Acceptance:** the script is committed and pushed, red-proven on the 87a case (it classifies `A-47-0075` as cut against its source; a mutated copy where the decimal is printed as 1058.566 classifies as agreeing), with the mutation proved landed by `git diff --numstat`; P3's post quotes the count found and the count checked for each population, each member classified, and the search space named. `A-76` closes on that, per its `closeWhen`.

**Delivery and encounter checks:** delivery is the script's own output in the P3 post and on `A-76`. No page changes today, so there is no encounter to read; if a member is cut against its source, the next event is David's reply on the card.

`USER-FACING: no` — paths: `scripts/` (the new script and an import guard in `depth-audit.mjs`), `package.json` (its `--selftest` in `npm test`), `.github/workflows/reverify.yml` (the selftest step `reverify.test.mjs` requires), `continuity/items.json`. No served page changes.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice, 2: `G-2` (the bound-improvement search goal; due 2026-10-20, already read today per the kickoff, "READ-TODAY"), `W-14` (the watch on upstream issue 218, the 46a credit correction): `gh issue view 218` read today returns OPEN, no comments, last updated 2026-10-07T19:39:29Z. The morning snapshot also flags `W-14`'s onTrigger path `constants/46a.md` as not existing in this repo (it is upstream's path) and its stamped read as SOURCE_EMPTY.
- (b) owed child rows in the orchestrator's ledger: none, read "0 of 754 considered".
- (c) state reads marked CROSSED: none, read across the kickoff's state block (dated gates 2 unread of 3, stale-actionable 0 of 23, missingLinkedCommits nothing swept, queued rows 0).
- Carried, not due: upstream PR #244 (the A-87 13a citation fix) read today: OPEN, no comments, no reviews, not merged.

### Section 0

- Primer: `docs/cold-starts/2026-10-20.md` read (banner and first action). No primer is dated 2026-10-21.
- Listener: 🟢 SSE alive (hello 19:10:42Z) + loop armed by tool call.
- Codex: GREEN per the kickoff's `[codex-probe]` line (machine-level exec and write, 19:17:50Z).
- CI: `check-ci-status --workflow reverify.yml` GREEN at `ebed670`. Deploy drift: NOTHING SWEPT. This is a GitHub Pages lane with no Render service declared, which is neither a stop nor a pass.
- Harness: `claude --version` reads 2.1.306.
- Recs yesterday: "reply on board card 65fc7648 … or reply 'don't send'" (`docs/daily/2026-10-20-prelaunch.md` § Recommendation). Done: David attested on card 6360dbc2 and the fix went upstream as PR #244.
- Verify: the receipt reads exit 0 at `eaf5162` (2026-10-20T16:55:23Z); `git diff --name-only eaf5162 HEAD` lists only `continuity/items.json` and three files under `docs/`, so it covers `ebed670` under the doc-only carve-out. Today's `npm run verify` is queued in the machine-wide heavy-job queue (waiting on memory, head of queue at 19:45Z) and will write a fresh receipt when it runs.

## What changed

### Close

ACTION: COMPLETED · item A-76 · P3 msg 737b2d82

The acceptance in force (the P1 packet, the manager's two additions, and the orchestrator's option-A ruling on consult msg 1174368e) was met: the census is committed and pushed, red-proven on the 87a case both ways, and the P3 post quotes the count found and the count checked for each population, with the search space named. The manager's P3 review (bus 38b6bafb) read it as COMPLETED.

**Changed since the P3 post (21:41Z).**
- David answered card abab2375 at 21:49Z. He chose to wait for a reply on teorth/optimizationproblems#244 (an upstream PR; it does not exist in this repo) before raising the three rows, then see the drafted text (paraphrased). He picked the card's recommended reply.
- That answer is now `A-88` (commit `40e3da8`). Its read is `gh pr view 244 --repo teorth/optimizationproblems`, next 10-24. The acknowledgement (bus e54fc40f) superseded the needs-decision 2bb8da6e.

**Ledger delta.**
- Hygiene draft: 2 lines, 2 accepted, 0 amended, 0 rejected. ACCEPTED: `G-2` (the bound-improvement search goal), with no command, since it is already held to 11-19. ACCEPTED: `W-14` (the watch on upstream issue 218, the 46a credit correction), re-dated to 10-28 per its own on-no-change trigger.
- READ-MUTATED: none, 2 reads guarded. Helper checks: wait-justification "RESULT: PASS — 1 of 105 row(s) carry `waitJustification`; 0 warn / 0 info"; engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable".
  - positive control: the same engineering-zero run listed 15 findings for other lanes, so the probe returns findings when they exist.
  - positive control: `gh pr view 244 --repo teorth/optimizationproblems` returned state OPEN (read 21:20Z), so #244 exists upstream although it does not exist in this repo.
- `A-76` (the decimal-vs-exact census) CLOSED in `c78e4bb`. `A-88` (wait on #244, then the question text) minted. `A-89` (the census's six round-4 blind spots, the manager's P3 review) minted with next check 10-28.
- `A-50` (importing a CLI script can run it) gained a note recording a fourth instance of its class today (`depth-audit.mjs` ran on import; guarded in `ce28589`). Its own trigger makes building the class-wide selftest the answer at its 10-28 read.
- `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-21).

**Receipt.** The P3 receipt still holds: `USER-VISIBLE: none`, since no served page changed.

**Pending reads.**
- `A-88`: upstream #244, next 10-24.
- `A-89`: the six shapes over the mirror, next 10-28.
- `W-14` (the watch on upstream issue 218, the 46a credit correction): next 10-28.
- `A-50`: the class-wide import selftest, next 10-28.

**Findings classification.** Today's findings are record-facing: three mirrored upstream rows print a ceiling below what their source or their own comment states. The running count of consecutive instrument-facing days resets to 0. All three are numeric-strictness defects; none was a byte-only catch, and none came from the drift alarm.

The standing prediction: the next record-facing catch will be a citation-quality defect in a mirrored upstream entry, found by a human reading the cited source in the depth audit. It is wrong if the drift alarm produces the next catch, or if a human finds a number that disagrees with its source. Neither happened. 87a and 1b had already been found by human reading (`A-47-0075`, `A-47-0019`, both UNRESOLVED). 1d.md:18 was found by a committed script reading the row's own comment, which is neither the predicted path nor a stated falsifier. That edge is recorded here rather than silently absorbed.

### P3 — A-76 shipped and closed

`A-76` (are other ceilings printed as a decimal that sits below what their source proves?) is closed. `scripts/decimal-vs-exact.mjs` counts the population and classifies each member; pushed `ebed670..247d60b`, CI `reverify.yml` and `page-check.yml` GREEN at `247d60b` (run 39677445847 ran the new selftest step).

Live run at `247d60b`, pasted from its summary lines:

- `search space: 826 bound row(s) across 117 file(s)`
- IN-CELL `187 found, 56 decided — 56 agree, 0 cut against the exact value, 71 exact form shown beside a decimal marked approximate (not judged), 60 unknown`
- COMMENT `13 found, 13 decided — 12 agree, 1 cut, 0 unknown`
- SOURCE `10 listed, 4 decided — 2 agree, 2 cut against the source, 6 unknown`
- `not looked at: 620 of 826`

Three cuts, each a ceiling printed a hair below its exact value: 87a (`A-47-0075`, 1058.565 against 4√70035 = 1058.565066…), 1b (`A-47-0019`, 0.380926 against 0.3809268534330870), and 1d.md:18 (1.463071582607559 against its own comment's exact 1.4630715826075593…, a row upstream marks unverified). They went to David as a question on board card abab2375 (bus 2bb8da6e), recommending we wait for a reply on teorth/optimizationproblems#244 (an upstream PR; it does not exist in this repo) before raising them. Nothing was sent.

<!-- findings:begin -->
**The review history overturned the packet's plan, and the record should say how.** The packet planned one script evaluating LaTeX in floating point. Four read-only Codex rounds (banner workdir checked each time) found 10, 7, 6 and 6 defects. Round 2 repeated round 1's classes, so the core was replaced with exact BigInt fractions (`d149a36`); round 3 repeated them again, so the lane consulted (bus 1174368e) and the orchestrator ruled option A, claim less, one more round, stop on any repeat (bus 80a26a72). Option A (`0a8ef71`) deleted floating-point verdicts entirely: an irrational form beside a decimal marked approximate is now EXACT SHOWN, not judged. Round 4 found no floating-point path to a verdict but repeated three classes (an invisible row, a detached relation, an excluded member), so per the ruling the census shipped unpatched. A read-only check of today's mirror and table found no current verdict resting on any round-4 shape (tabs 0 of 1,832 bounds-section lines; a brace after a relation 0; a `*` inside a value 0; a leading-dot decimal 0; three bare brace groups, all already UNKNOWN; one closed form beside a `…` decimal, 87a, whose true value lies inside the truncation interval). The six remain open gaps for future rows of those shapes. Exact arithmetic also found the third cut, 1d.md:18, which floating point could not see (a gap of about 3×10⁻¹⁶).
<!-- findings:end -->

## Recommendation

For David: none new. He answered card abab2375 at 21:49Z; the lane brings him the question text once #244 has a reply.

## On hold pending data

`A-88` (raise upstream the ceilings listed in § What changed, P3) waits on a maintainer reply to teorth/optimizationproblems#244, re-read 2026-10-24. `G-2` (the bound-improvement search goal) is held to 2026-11-19 with its reason on the row.

## State Appendix

As of the close, from live commands (this report cannot name the commit that lands it):
- HEAD before the close commit: `40e3da8` (`git -C C:/dev/skylark/bounds-ledger log -1`), "A-88: track David's answer on card abab2375 (wait for #244, then the question text)"; 0 commits ahead of origin/main (`git rev-list --count origin/main..HEAD`). The close commit adds this report, tomorrow's primer and `continuity/items.json`, all doc-shaped.
- `npm run verify`: exit 0 at `c78e4bb` (tmp/.verify-receipt.json, 21:41:10Z). `247d60b` was the last commit to touch code; every commit since touches only docs/ and continuity/.
- CI at `40e3da8`: `check-ci-status --workflow reverify.yml` GREEN, `--workflow page-check.yml` GREEN. Release: re-run both for the close commit's sha.
- `A-76`: closed. `A-88`: open, re-read 10-24. `A-89`: open, re-read 10-28. Release: `node scripts/sky.mjs show-item.mjs <ID> --repo .`.
