---
product: bounds-ledger
date: 2026-08-20
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: d1db3e7
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. The ledger is clean, the overnight check passed, and that is streak day 28 of the 30 we need by Saturday. The good news today is not about the mathematics. Yesterday I found that one of the shared tools the whole workshop uses could never give this project a correct answer, wrote up the one-line fix, and passed it upward rather than changing a tool other projects rely on. It came back fixed inside a day, and I checked it properly rather than taking anyone's word for it: the two items that should now be set aside as deliberately waiting are set aside, and I proved nothing on our side moved to cause that. The one thing worth your attention is Saturday. The goal this project has been working toward reaches both of its finishing conditions on the 22nd, the evidence is already written down and waiting, and whether to call it done is your call and not mine."
---

# bounds-ledger — daily — 2026-08-20 (MT) — the proposal came back inside a day

Paced rail, day 19. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — the steward cadence behind the sync guard, now running `npm run verify` rather than `npm run check`. That change was earned today: the receipt writer wired yesterday means **`agent-status` refuses the day's first bus post unless a receipt exists at the current HEAD**, so the bare check leaves you refused later, at a worse moment. Run verbatim from a fresh pane:

```bash
cd C:/dev/skylark/bounds-ledger && git rev-parse HEAD origin/main && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && npm run verify && node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**THE NUMBER THAT WILL LIE TO YOU** — **`stale-actionable` fell from 5 to 3, and `filteredCount` rose from 0 to 2.** The misread a cold reader will make is that somebody worked two items off a backlog, or that the lane got tidier overnight. **Neither happened, and no item's state changed.** The fleet endpoint was *fixed*: it now reads the typed `expectedSignalBy` field, so `W-3` — the watch on the erdosproblems.com correction acknowledgement, parked to 2026-09-24 — and `W-6` — the README report-an-error read window, parked to 2026-11-06 — are finally excluded as deliberately parked. That is the whole movement, and it is the close condition of **`A-21` — yesterday's proposal upward about that filter** — met word for word. The second misread is subtler: 3 is now *below* the documented ">3 = real P4 forced-decision pass" threshold, which invites reading the figure as retired. It is not. The three still returned (`A-9`, `A-7`, `G-2`) carry **no date field at all**, so the fixed filter correctly cannot exclude them either; the figure is now *interpretable* rather than structurally broken, and it still does not mean three neglected items.

**DON'T-TOUCH** — **the verify-receipt gate, and specifically do not reach for `--no-verify-receipt` or `CC_VERIFY_RECEIPT_DISABLED=1`.** Today it refused a post of mine and printed both overrides in the refusal text, which is the most tempting shape a guard can take. What makes it work is that it compares the receipt's sha against the checkout you actually have — a receipt for another commit says nothing about the code in hand — and complying is what caused today's steward cadence to run at all. The override would have bought a post and lost the cadence.

## What changed

**`A-21` closed — the proposal shipped upstream inside a day, and I verified it rather than accepting it.** Yesterday's finding was that the fleet's `stale-actionable` endpoint scans `closeWhen` and `item.notes`, while this lane writes prose into `note`/`note2`…`note9` and parks items in `expectedSignalBy` — so `filteredCount: 0` was structural and no item here could ever be excluded, whatever its dates said. The row carried its own close condition: *ship the `expectedSignalBy` clause, then re-read `filteredCount` and confirm the two parked watches are excluded* — `W-3` — the erdosproblems.com acknowledgement watch — and `W-6` — the README report-an-error read window. Today's live read returns `filteredCount: 2` and an items array of exactly `A-9`, `A-7`, `G-2`, so both are gone from it. **The change is endpoint-side, proven rather than assumed:** those two watches' `closeWhen`, `expectedSignalBy` and `notes` are byte-identical between commit `3eecd37` and HEAD, `notes` is still `undefined` on both, and the dates still read 2026-09-24 and 2026-11-06. Nothing this lane wrote could have moved them from returned to filtered.

**What closed is a loop, not a row.** The proposal went up with a named file, a named line, and an argument for refusing the wider fix — widening the scan across the `note*` prose family would park a genuinely neglected item on a stray date in narrative, converting a false positive into false-negative silence. It came back inside a day and was checkable when it did, because **`W-7` — the watch on recommendations routed to a later pass and never tracked** — requires the tracker row to land in the same commit as the report proposing it. W-7 exists on the strength of the opposite outcome. This is the first time it has paid out.

**Yesterday's retro was posted 17h late, from a closed pane, and reconstructed from artifacts.** The dispatch fired at 14:42 MT on 8/19 into a session that closed at 08:08 MT. The answers came from the daily report, git log and `items.json` rather than from the day, and the reply says so at the top. The dispatch ordering, not the 08:14–10:55 host-restart gap, is the cause — this lane had already shipped and closed six minutes before that gap opened.

**Posting it produced a new finding, filed as `A-22`.** The bus `sha-file-claim` linter drew three WARNs on the retro body; all three are false, each verified with `git show --stat`, the command the WARN itself prescribes. `cb4f6f5` touches `package.json` only; `dd336d8` touches `scripts/render-state-block.mjs`; `f362ce7` touches `README.md` and the same script. The defect is the **relation**, not the parse: prose puts a sha beside a filename when the commit modified it, when the file is the *detector that flagged* it, when the file lives in another repo, or when it is gitignored and written at runtime — and only the first is worth linting. A retro is dense in the other three.

**The A-22 report pre-registered a control in its own posted body, before the outcome was known**: if the report about the false WARNs also drew false WARNs, the finding was reproducing itself. It drew zero. So the linter has both answers and is **miscalibrated on the relation rather than broken** — narrow it, do not disable it. That result was written back to the row, because a control pre-registered in a message others will read later must not end up existing only in one terminal. That is the transcribed-number problem `cb4f6f5` shipped a receipt to kill, one day earlier.

**One instrument misfire deliberately NOT filed.** The verify-receipt gate refused this session's first task-complete. Half the refusal was a correct and valuable catch — a receipt existed at `cb4f6f5` while HEAD was `d1db3e7`. The other half quoted my own sentence *"no gate-green claim is made"* **as** a gate-green claim: polarity-blind, the same relation-versus-token shape as A-22. It gets no row because its outcome was right and complying produced the day's cadence, the streak verdict and a receipt at HEAD. It is worth watching only because it means a careful disclaimer is what trips the alarm; if that recurs, it earns a row then.

**Three fleet instruments misread this lane in one morning** — A-21's field scan, A-22's relation, the receipt gate's polarity. Individually each is small. Together they are the more interesting signal, and they are the reason this report spends more words on machinery than on mathematics for the third day running.

## Inputs (controllable)

- **Steward cadence** — `npm run verify` exit 0 with the receipt written at HEAD; no drift; CI green at HEAD; the overnight scheduled run reached a verdict.
- **A closed loop with an outside party** — `A-21` proposed 8/19, shipped upstream, verified 8/20 against its own pre-registered condition with a positive control on the disconfirming side.
- **One finding filed with its tracker row in the same commit** (`A-22`), per W-7 — the discipline that made A-21 checkable today.
- **Codex** — GREEN, machine-level probe at 2026-08-20T13:41:25.018Z, quoted from the kickoff rather than re-run. `codexCalls: 0`: today was one endpoint read, a set of local verifications and three documents. No bulk diff, no second opinion on a decision, so a hand-off would have cost more than the task.

## Outputs (lagging)

- **North star — externally-acknowledged corrections: 1.** Unchanged. Tao merged `teorth/optimizationproblems#141` on 2026-08-11; that merge is the acknowledgement. `W-3` — the erdosproblems.com acknowledgement watch — is a **different channel**, still unanswered, and does not close on it.
- **`G-1` — the north-star goal — streak day 28 of 30.** Both close conditions land **Saturday 2026-08-22**. Evidence pre-staged in `G-1.signalPrestaged`. **Closing it is David's decision — never a self-approval and never a self-rating.** This is the one thing in this report that wants a human before the date rather than on it.
- **`npm run catches` — 0 movements this week (current, partial), 0 completed dry weeks, queue depth 1.** The current week is never counted, so the zero is arithmetic. The rule it feeds needs **four completed** dry weeks and, since the 2026-08-14 amendment, `docs/findings/` dry over the same window too — which it is not. Read beside the candidate-correction queue depth of 1 (`A-16` — a verified defect in a stewarded surface, blocked at David's gate): a zero rate beside a non-zero queue is work found and blocked, not a quiet week.
- **`W-6` — arrivals.** Read window open since the repo went public 2026-08-08; `expectedSignalBy` 2026-11-06. Early figures are arithmetic, not a verdict.

## Recommendation

**Ship nothing further today.** The cadence is green, one loop closed, one row filed, and the remaining open questions belong to other people: `A-22` to the orchestrator, `G-1` to David.

Two things to carry forward, both small and both concrete:

**There was no cold-start primer for today.** `docs/cold-starts/` stops at 2026-08-19, so this session began by reconstructing state from the kickoff and the ledger. That cost real tokens before any work started and it is the single change that would most speed up tomorrow. It is a close-session output, not a P1 one, so the fix belongs at end of day rather than here — noted so that end-of-day actually does it.

**The kickoff's lead line said "Lite rail today."** The rail of record is **PACED**, David-ruled 2026-08-01 and explicitly replacing the lite default, as `CLAUDE.md` states in its second paragraph. That lead carried the `[UNVERIFIED — this lead cites no item id]` marker, and the STANDING clause says leads may be stale or false, so the machinery worked as designed and I followed the repo. Flagging it because a rail is the one lead a cold agent is least likely to check against the repo, and a lane quietly reverting to a rail David replaced would be invisible for a while.

## On hold pending data

- **`A-15` (the Mathstodon send)** — dormant by instruction. Do not ask.
- **`A-16` (the C_87 row whose cited witness yields the previous record)** — gate 2 is David's. Do not raise, do not PR, do not contact upstream.
- **`W-3` (the erdosproblems.com acknowledgement watch)** — waiting on a reply that arrives in David's inbox, not ours; `expectedSignalBy` 2026-09-24. Now correctly excluded from the stale-actionable read.
- **`A-22` (the sha-file-claim linter)** — with the orchestrator; **2026-08-27**. Silence by then means dropped rather than declined, which is the `W-7` — the watch on recommendations routed onward and never tracked — failure mode; surface it, do not silently re-file.
- **`A-18` (the generated primer state block) and `A-19` (the two review nits)** — forced review 2026-08-25. **`A-20` (retry-with-backoff on 429/502)** — 2026-09-01. **`W-7` (the untracked instrument-audit proposal)** — next weekly pass, 2026-08-24.

## State Appendix

Every figure with the command that produced it. Point-in-time as written.

| Figure | Value | Command (exit) |
|---|---|---|
| HEAD / origin sync | `d1db3e7` both at cadence time; **this report's own commit moves HEAD — re-read before quoting** | `git rev-parse HEAD origin/main` (0) |
| CI at HEAD | **GREEN** — push runs at `845b9a0` and `d1db3e7` both completed/success | `gh run list --workflow reverify.yml` (0) |
| Overnight scheduled run | `32353879439`, 09:26Z on `cb4f6f5`, completed/success — **reached a verdict** | `gh run list --workflow reverify.yml` (0) |
| `G-1` (the north-star goal) — streak leg | **day 28 of 30**; both conditions land 2026-08-22 | derived from the above under `G-1.streakDayRule` |
| Verify receipt | `{exitCode: 0, sha: d1db3e7a…, at: 2026-08-20T13:44:48Z}` — matches the HEAD it was run on | `npm run verify` (0) |
| Mirror | **113 files @ upstream `e70b4a4`** (an upstream sha; it does not exist in this repo), no drift | `npm run verify` (0) |
| Ledger | **233 claims — 231 hold, 0 broken, 0 unreachable, 2 UNVERIFIED by design** | `check-claims.mjs` (0) |
| The 2 UNVERIFIED — `C-7` (the bound on erdosproblems.com/36) and `C-9` (that page's last-edited date) | advisory local read: HTTP 200, `0.380876` and `This page was last edited 23 January 2026.` both still present; both stay UNVERIFIED | `check-claims.mjs` (0) |
| State block | in sync (113 files @ `e70b4a4`, 233 claims) | `render-state-block.mjs --check` (0) |
| Catch-table guard | "9 cycles, and README.md says 9" | `npm run verify` (0) |
| Hosted brief | in sync — all **4** dated blocks present | `check-brief.mjs` (0, pin present) |
| Self-tests | **13 PASS** | `npm test` (0) |
| Catches | **0 this week (partial)**; 0 completed dry weeks; queue depth **1** (`A-16`) | `npm run catches` (0) |
| `stale-actionable` (7d) | **3** — `A-9`, `A-7`, `G-2`; **`filteredCount: 2`**, `W-3` and `W-6` now correctly excluded (was 5 / `filteredCount: 0` on 8/19) | `/api/cc/items-stale-actionable` (200) |
| `missingLinkedCommits` | **0** | `/api/cc/items-health` (200) |
| Dated gates due today | **0** | `check-due-gates-dispositioned.mjs --print` (0) |
| Items | **30 total, 15 open** (`A-21` closed today) | `continuity/items.json` |
| Findings | **28** | `ls docs/findings/` |
| Codex | **GREEN** (probe 2026-08-20T13:41:25.018Z) · `codexCalls: 0` | quoted from kickoff, not re-run |

**Positive control: the report's central absence claim was checked against something that returned non-empty from the same read.** The claim is *"`W-3` and `W-6` are absent from the stale-actionable list."* The same response returned three fully-populated item rows (`A-9`, `A-7`, `G-2`) with titles, `daysStale` and `staleBasis` fields, so the reader was working and the response was not empty; and `filteredCount: 2` independently accounts for exactly the two missing ids. The disconfirming side was checked too: the change could have come from this lane editing those items, so `W-3` and `W-6`'s date fields were diffed between `3eecd37` and HEAD and are byte-identical.

**Engineering zero-state: structurally zero, not swept to zero.** `package.json` carries empty `dependencies` and `devDependencies`, so Dependabot has nothing to find; there is no Sentry project for this repo, which is why the frontmatter carries `sentry_open_p1: null` rather than `0`. An absent instrument renders null, never a count.
