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

Today I check whether other rows on our pages print a rounded number that sits just past the limit their paper actually proves, as the 87a row does. A committed script will count them and report each one; anything it finds becomes a question for David, and nothing goes upstream.

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

For David: answer board card abab2375. Recommended reply: "Wait for a reply on #244 first, then bring me the text." (not David's words) That is the lane's draft. Nothing goes upstream without his yes.

## On hold pending data

## State Appendix
