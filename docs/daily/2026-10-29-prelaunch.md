---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: unread
north_star_classification: unread
product: bounds-ledger
date: 2026-10-29
lifecycle_stage: launched
last_deploy: fb321f79e5 (CI GREEN at the kickoff read; GitHub Pages lane, no Render service)
on_hold_items: 0
top_action_today: finish A-88, the display question about 87a's [Mar1978] row, and put the final text to David on a card
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-29 (Thursday, MT)

## BLUF

Today I finish a question we owe the people who maintain the bounds page we copy. One historical row there prints a number slightly below the bound its own source paper proves, and I will bring David the final wording of a question asking how they would like it shown. Nothing goes to them without his yes. A full day, so the review rounds a light day skipped run today.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** finish `A-88` (the display-convention question about rows printed below their exact value): settle the draft's scope, run the adversarial refute-it review and a cross-family claims pass, and put the final text to David on a board card. Item: `A-88`.

**The user problem, in the user's words:** "I cited a bound and a referee told me it had been improved. I had no way to know." (`docs/evangelism-bar.md`.) Here the sting is the mirror image: a reader who copies 87a's [Mar1978] row as an exact upper bound copies a figure about 6.6 × 10⁻⁵ below what Martinet proves. The row is superseded, but upstream's CONTRIBUTING.md calls the tables "histories, not just leaderboards".

**Section 0.**
- Primer: `docs/cold-starts/2026-10-28.md` (no 10-29 primer; the newest on or before today), banner quoted whole in the kickoff and read in the file.
- Listener: 🟢 SSE alive (restart marker 2026-10-29T14:48:43Z, pid 34024; `hello` and `replay-complete` below it). The loop is armed by `ScheduleWakeup` tool calls, and waker ranks 1-3 are running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 14:49:27Z).
- CI: GREEN at `fb321f79` (kickoff read at 14:49:38Z: page-check, pages-build-deployment and reverify all succeeded, 0 failures). HEAD unchanged since (`git rev-parse HEAD` → `fb321f79e5199b6289bb5624b67afcdbc4df4878`; `git pull --ff-only` → "Already up to date."). This packet relies on that CI result and makes no claim of its own about the test suite.
- Deploy drift: GitHub Pages lane with no Render service, so the fleet drift read sweeps nothing here. This is neither a stop nor a pass. `npm run served` is this lane's read, and it last passed at `8be7f8a`. Every commit since then is doc-only.
- Harness: running 2.1.312 · fleet UNIFORM · installed 2.1.312 (SAME).
- Recs yesterday: none (the 10-28 report's Recommendation section names none for David). The 10-28 On-hold line (`A-88` drafting, pending a normal day) is carrying today → P3.
- Prior-day retro: no prior-day retro on record for this lane (kickoff read). The 10-28 close's own retro line (the README catch-table row is a hand step that resnap does not prompt for) does not bear on this choice.

**Evidence** (each read today, 2026-10-29 MT):
- OBSERVED · `check-due-gates-dispositioned.mjs --snapshot` · "snapshot written — 4 gate(s) due on/before 2026-10-29": `A-47`, `A-81`, `A-84`, `A-88`. Exit 2 (NOTHING-SWEPT), because `A-81` has never run and `A-84` timed out at its last attempt.
- OBSERVED · `A-88`'s last stamped read (`continuity/read-outputs/A-88.txt`, 2026-10-28T20:57:23Z) · pull request 244 `"state":"MERGED"`, `"mergedAt":"2026-10-26T03:45:09Z"`. The trigger fired on 10-26. The row was re-dated on 10-27 and 10-28, each time because David's instruction made it a light day.
- OBSERVED · `node scripts/decimal-vs-exact.mjs --root C:/dev/skylark/bounds-ledger` · exit 1, "RESULT: CUT — 3 member(s)": `1d.md:19` (prints 1.463071582607559 against its comment's 1.4630715826075593…), `A-47-0075 87a.md:17` (prints 1058.565 against 4√70035), `A-47-0019 1b.md:22` (prints 0.380926 against 0.3809268534330870). Those three are the run's only CUT lines.
- OBSERVED · Grep `ledger/teorth-optimizationproblems/constants/87a.md` · line 17 still reads `| $1058.565$ | [Mar1978] | …`.
- OBSERVED · Grep `ledger/teorth-optimizationproblems/constants/1d.md` · line 19 is `$1.463071582607559*$` [CERT2026], starred unverified upstream. The 10-27 row note records that pull request 243 added a rounded-up row beside it and did not remove this one.
- OBSERVED · `docs/decisions/2026-10-23-A88-87a-display-question-draft.md` · two Codex claims rounds on 10-23 (on `b1f4907` and `580799e`). The question is narrowed to 87a, 1b is left out because of pull request 158, and 1d was left out while pull request 243 stayed open. Pull request 243 has since merged, so the 1d reasoning is stale and must be redone.
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- OBSERVED · `answered-cards.mjs --project bounds-ledger` · "NO waiting/answered/pending-verify cards".
- MISSING · whether a maintainer would prefer an issue or a pull request for this. That is the question itself, and only a reply answers it.

**Permission:** the row's own onTrigger allows the draft, review and card. Sending is outward contact, so the outward gate applies: adversarial review plus David's explicit yes (AGENTS.md "Outward gate"). David's answer on card abab2375, paraphrased: wait for a reply on 244, then bring him the text. 244 has merged, so the wait is over. Not parked, waiting or frozen.

**Next action:** deliver built value (a drafted, reviewed outward question, ready for David's decision). First, decide whether 1d's superseded starred row belongs in the question. Then redraft, run the Codex refute-it review and the claims pass (read-only), and file the card.

```
gh pr diff 243 --repo teorth/optimizationproblems
```

**Acceptance condition:** a board card carries the final issue text, a four-item self-check for David (the page references, the field, the bound and the mirrored row), and the review record. The draft file records every Codex finding with a disposition, and `A-88` records that the card was filed. `A-88` closes only on David's answer (send, or do not send) or on a fresh census that no longer reports the rows as CUT.

**Delivery and encounter checks:** delivery = the card exists (the writer's own posted line, then `update-david-board.mjs --list --project bounds-ledger`). Encounter = David's answer on the card. Nothing reaches upstream today unless he says yes and does the check himself.

**USER-FACING:** no · `docs/decisions/2026-10-23-A88-87a-display-question-draft.md` (or a 10-29 successor), `continuity/items.json`, `docs/daily/2026-10-29-prelaunch.md`. Nothing on the public page changes. The receipt will be `USER-VISIBLE: none` unless David sends, and even then the change lands on upstream's page, not ours. An alternative user-visible pick on our own page is `A-90` (a stale open-pull-requests list says so on each `c/` page). It is dated 11-04, and the list was refreshed on 10-28, so the line it adds would not render for a week. I did not pick it over the overdue outward item.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice (3): `A-47` (the depth audit; the 5a resnap added cited rows, so the denominator moves: `depth-audit.mjs --corpus`), `A-81` (the Ramsey arXiv watcher; its readCommand has never run), `A-84` (the store refusal, a declared deferral whose `expiresOn` is 2026-10-29; its readCommand timed out at the 180000 ms cap on its last attempt).
- (b) owed child rows: none (read: "rows owed to you in skylark-site's ledger: NONE").
- (c) CROSSED state reads: none (read: dated gates 4 of 4 listed, HEAD CI GREEN, queued rows 0, stale-actionable 1 of 25 not crossed, missingLinkedCommits nothing swept). Also owed today from the 10-28 close: a cross-family claims pass on the README catch-table row for `e8f7e7f`, plus the primer's two small path fixes (`W-14`'s onTrigger naming upstream's 46a path bare; `A-49`'s notes citing two skylark-site files bare).

## What changed

- Nothing committed yet today. P1 is reads and the census only.

## Inputs (controllable)

- None yet.

## Outputs (lagging)

- `npm run reports` not yet read today.

## Recommendation

- None for David yet. The `A-88` card will carry its own.

## On hold pending data

- None.

## State Appendix

Written at the close from live commands.
