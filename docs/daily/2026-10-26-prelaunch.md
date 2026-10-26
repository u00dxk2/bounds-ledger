---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: unread
north_star_classification: unread
product: bounds-ledger
date: 2026-10-26
lifecycle_stage: launched
last_deploy: 509dcaca8e (HEAD at the 10-26 kickoff)
on_hold_items: 1
top_action_today: resolve the overnight drift alarm (issue 45) once, to upstream's settled tip, after checking the moved rows against their sources
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-26 (Monday, MT)

## BLUF

Our alarm caught about thirty-five changes landing overnight in the table we mirror. Eight of the numbers our page showed went out of date, and three new constants appeared that we did not list. Today is a light day, so the only work is to check those changes against their sources and bring the page up to date in one pass. The change David asked us to wait on was accepted in the same batch, so the question he asked to see comes back to him on a later day, not today.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** the public page and its constant pages show upstream's current table again, resolved ONCE to the settled upstream tip `e95af44` (an upstream sha, which resolves only in teorth/optimizationproblems), with drift issue 45 closed by hand naming the resolving commit. Item: `A-2` (the drift-resolution log for the adopted surfaces), due today; the cycle is this row's log entry. pragma: allowlist sha

**The user problem, in the user's words:** "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (`docs/evangelism-bar.md`). Since 09:40Z our page has been showing a superseded last-listed row on eight constants and lacks three, which is the exact failure this ledger exists to prevent.

**Why this and nothing else (light day):** David's 10-26 instruction keeps the day to essentials, and a red drift alarm at HEAD is one. No new build, no new research, no review rounds beyond what the cycle itself owes.

**Section 0.**
- Primer: `docs/cold-starts/2026-10-25.md` (no 10-26 primer; the newest on or before today), banner read whole in the kickoff.
- Listener: 🟢 SSE alive (session start 14:48:21Z, pid 24868, relaunched by the SessionStart hook; `hello` and `replay-complete` read below the newest restart marker in `tmp/.bus-listen.err`), loop armed by a `ScheduleWakeup` tool call, waker ladder ranks 1-3 running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 14:48:08Z). Not used today.
- CI: RED on `reverify.yml` at `509dcaca8e` (run 40301378739, event `schedule`, 09:40:32Z): steps "Check adopted surface for drift" and "Check ledger claims across cited surfaces" failed; every self-test step passed. This is the alarm working, not a code fault.
- Deploy drift: NOTHING SWEPT for this lane (GitHub Pages, no Render service).
- Recs yesterday: none new for David (`docs/daily/2026-10-25-prelaunch.md`). Nothing to disposition.
- Verify: not run locally. HEAD's CI run is the read, and the light day forbids a heavy local job that the cycle does not need. The cycle's own `npm run check` after the commit is the one local network run owed.

**Evidence** (each read today, 2026-10-26 MT):
- OBSERVED · `gh issue list --repo u00dxk2/bounds-ledger --state open` · one open issue, 45, opened 09:41:12Z by `app/github-actions`, titled `Drift: README.md, constants/13a.md, …`. Its body: 26 constant files plus README CHANGED (27 as first written here, corrected at P3 from a recount of the issue's list), 3 ADDED (17b, 89a, 90a), and 8 BROKEN generated pins: `pin:16a:U`, `pin:1a:U`, `pin:1b:U`, `pin:1c:L`, `pin:24a:U`, `pin:31a:L`, `pin:3a:U`, `pin:84b:U`. Snapshot `46dbf03`, live `e95af44` (both upstream shas).
- OBSERVED · `gh api repos/teorth/optimizationproblems/compare/46dbf03…e95af44` · 116 commits ahead; the merge commits run from 03:44:26Z to 04:08:12Z on 2026-10-26, about 35 pull requests merged by the maintainer in 24 minutes. pragma: allowlist sha
- OBSERVED · `gh api repos/teorth/optimizationproblems/commits/main` · tip `e95af44`, committed 04:08:12Z, unchanged at this read, about ten and a half hours later. The burst has settled, so one resolution to that sha is the rule. pragma: allowlist sha
- OBSERVED · `gh pr view 244 --repo teorth/optimizationproblems --json state,mergedAt` · MERGED at 03:45:09Z. That is `A-88`'s trigger (any maintainer response on 244). `gh pr view 243 … --json state,mergedAt` · MERGED at 03:53:53Z, so the 1d.md:18 rounding is upstream's own change now.
- OBSERVED · `node C:/dev/skylark/skylark-site/scripts/answered-cards.mjs --project bounds-ledger` · no waiting, answered or pending-verify card.
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- MISSING · whether any reader opened a stale row between 09:40Z and the fix. The pages carry no analytics (`A-59`, the blind encounter on the public pages).

**One prior-day retro finding that bears on the choice:** Q5 of the 10-25 retro, "CI green at HEAD → do not queue a local full verify". It applies in reverse today: CI is red for a known reason, so the useful local run is the cycle's own `npm run check` after the commit, and nothing before it.

**Permission:** `A-2` is open and standing; a drift cycle (verify against primary sources, then `npm run resnap`, commit, second render, close the issue) is inside the lane's authority (`AGENTS.md` hard invariants). Nothing goes upstream. `A-88`'s onTrigger needs an adversarial review and a claims pass before a card goes to David; on a light day the row is only re-noted with the trigger and re-dated, and the drafting waits for a normal day.

**Next action:** deliver built value (the mirror back in sync). Steps, in order:
1. For each of the 8 broken pins, read the new last-listed row in upstream's merged text and check it against its cited primary source (the cited paper, preprint or certificate repository named in the row), recording what each source states. The other 18 changed constant files (changed, no pin broken, which does not make them editorial: a row above the last-listed one can move) and README are read in the upstream diff, and any bound row that moved is checked against its source the same way. The 3 added constants are checked for an existing cited source; their pins are generated, and they assert listing position only.
2. `npm run resnap` (snapshot, pins, state block, and the open pull request fetch it runs).
3. Commit; then `render-site.mjs` and `render-constant-pages.mjs` a second time (dates come from committed history) and commit that.
4. `npm run check` once, then push; read `npm run served`.
5. Close issue 45 by hand with a comment naming the resolving commit and the verification. No `Closes #45` trailer.
6. Re-note `A-88`: trigger fired 03:45:09Z, 243 also merged; rerun `decimal-vs-exact.mjs` on the new mirror and record the CUT rows; re-date to the next normal day for the draft, review and card.

First command:

```bash
gh api repos/teorth/optimizationproblems/compare/46dbf03669219cb2bcf33fd5bbf65209d137f994...e95af44bc6ae938f545a0fc62cd1b6c1f6088a56 --jq ".files[] | {filename, status, additions, deletions}" # pragma: allowlist sha
```

**Acceptance condition:** `node scripts/reverify.mjs --check` prints "No drift." at `e95af44`; `node scripts/check-claims.mjs` exits 0; `npm run check` exits 0 after the second-render commit; `grep -c '<tr id=' index.html` is 3 higher than at `509dcaca8e` (one row per constant; read both counts, never recall them); issue 45 closed with a comment naming the sha; the next push's `reverify.yml` run is GREEN. [linter-report]

**Delivery and encounter checks:** `npm run served` after the push (SERVED for every touched page within the 300 s window). The encounter would be an outside report through a per-row link, counted by `npm run reports`; readable at N = 1, expected zero.

**USER-FACING: yes** — paths: `ledger/teorth-optimizationproblems/**` (via `--snapshot` only), `ledger/claims.json` (generated pins via `extract-pins.mjs`), `ledger/open-pull-requests.json`, `README.md` (state block), `index.html`, `c/*.html` (touched and new constant pages), `continuity/items.json`, `docs/daily/2026-10-26-prelaunch.md`.

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: 4 — `A-77` (the filed-report state check), `A-78` (the OpenAI math release map), `A-86` (the newer-results store owner; readCommand never run), `G-4` (the Tier-0 goal: an outside party acts without our report), read from `check-due-gates-dispositioned.mjs --snapshot` ("5 gate(s) due on/before 2026-10-26"; the fifth, `A-2`, is the choice). Note for the helper: the resnap can turn `A-78`'s and `A-86`'s reads red if a noted constant changed. That is their reconcile signal, so read them AFTER the resnap.
- (b) owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger: 0 of 769".
- (c) state reads marked CROSSED: stale-actionable (7d), 1 of 25 considered; the kickoff read does not name the id, so the helper reads it from `items-stale-actionable?project=bounds-ledger&days=7`. missingLinkedCommits: NOTHING SWEPT (0 of 0), an empty read, not a clean one.

## What changed

`A-2` (the drift-resolution log) gains its 19th cycle, approved as the whole of P3 by the orchestrator (bus 37e9b7e2). Corrective work on a red default branch, not progress on a new outcome. Commits, pushed as 509dcac..fe27268:
- `f85e829`: resnap to upstream e95af44 (an upstream sha): 121 mirrored files, 240 generated pins, 120 constants (117 before; 17b, 89a, 90a added). The eight moved last-listed rows were read first by two read-only reading helpers against their cited sources: seven HOLD, and 3a's value holds while its registry page could not be read. I re-derived 3a's 1.3123733021151094 two ways. The commit body lists what was not read. `ledger/openai-math-map.json`: the 28a pair became `read-no-note`, because the 28a page now lists the OpenAI claim itself (`openai-math.mjs --selftest` refused the stale note, exit 1, then passed, exit 0). pragma: allowlist sha
- `f2e2397`: the second render, so dates come from committed history.
- `c883ba0`: README catch table row, 19 drifts, 120 constants (`npm run check`'s state leg had exited 1 on both).
- `0b4d501`: three 65a depth-audit entries re-pointed four lines down (the audit-lines leg's MOVED). While they were moved, every audited page's ledger-wide line read 90 drawn / 79 checked instead of 93 / 82. That figure was never pushed.
- `fe27268`: CI on 0b4d501 failed one self-test whose premise about the live mirror upstream had changed (1a's asterisks removed). It now asserts the new fact. Red-armed: mutated digits gave FAIL, exit 3; restored gave PASS, exit 0.

Drift issue 45 closed by hand at 15:46:38Z (`gh issue view 45 --json closedAt`), with a comment naming f85e829 and the verification.

`A-88` (the 87a display question) has had its trigger fire: #244 merged 03:45:09Z. The census still has three CUT rows, and 1d remains cut although #243 merged. Notes appended; re-dated 10-27 for the draft, review and card, held today by the light-day instruction.

## Inputs (controllable)

The drift cycle above.

## Outputs (lagging)

`G-4` (outside arrivals through the per-row links) not read yet today; it is a hygiene input.

## Recommendation

None new for David. The 87a display question (`A-88`) comes back to him on a normal day, now that #244 has merged.

## On hold pending data

`A-88`'s draft, review and card: the trigger fired, and the work is held for a normal day by David's 10-26 light-day instruction.

## State Appendix

### Close

ACTION: COMPLETED · item A-2 · P3 bus msgId ae701bfc. The acceptance condition held:
- `reverify.mjs --check` reads "No drift. 121 files match upstream e95af44…", re-read at the close through `--run A-2`, exit 0.
- Claims: "254 claim(s): 252 hold, 0 broken/unreachable".
- `npm run check` exits 0 after the commits.
- The index has 120 rows, up from 117.
- Issue 45 is closed with a comment.
- CI is green at commit fe27268.

Since the P3 post: nothing about the product changed. Ledger delta:
- Hygiene draft: 5 lines, 5 accepted. A-77, A-78, A-86 and G-4 are re-dated to 2026-11-02, and A-86 gets `readCommandTimeoutMs` 600000. A follow-up `--set nextCheckDate` on three of them was a no-op, because `--extend` had already moved that field.
- A-2 gets its cycle-19 log note and is re-dated to 2026-11-02.
- A-88 gets the trigger note and is re-dated to 2026-10-27 (P3).

Checks:
- `check-due-gates-dispositioned.mjs`: "snapshot: … CURRENT (taken 2026-10-26)", RESULT: PASS (exit 0).
- From the helper: wait-justification PASS and engineering-zero PASS, no READ-MUTATED lines.
- `continuity-check.mjs`: status WARN, exit 0. Its one finding is a standing clock note on A-84 (expiresOn read only by this lane's deferral gate).

Pending reads:
- A-88's draft, review and card (10-27).
- A-84's fix (10-27).
- The depth audit's denominator for the new mirror (`A-47`, 10-28).

### As of P1

As of 2026-10-26 14:57Z: HEAD `509dcaca8e`, tree clean before this file. CI `reverify.yml` RED at that commit (run 40301378739, scheduled); release: `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`. Upstream tip `e95af44` (an upstream sha); release: `gh api repos/teorth/optimizationproblems/commits/main --jq .sha`. pragma: allowlist sha
