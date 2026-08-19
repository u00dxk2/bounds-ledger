---
product: bounds-ledger
date: 2026-08-19
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: 0d00e79
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. The ledger is clean, the overnight check passed, and that is streak day 27 of the 30 we need by Saturday. Today's catch was again in the machinery around the ledger rather than in the mathematics. Every morning this lane is handed a short list of numbers about its own health; one of them said five items have gone quiet and that a review was owed. I checked the number instead of doing the review, and it turns out the tool that produces it is built to set aside items that are deliberately waiting - and it cannot do that here, because it looks for the waiting-until date in two places and we keep ours in a third. Two of the five are parked until September and November. So the number is not five-too-high, it is a number that can never come out right for us, sitting in front of a rule that turns it into work. The fix is one line, but it belongs to a shared tool that other projects rely on, so I have written it up and passed it upward rather than changing it myself."
---

# bounds-ledger — daily — 2026-08-19 (MT) — a number that could never have come out right

Paced rail, day 18. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — the steward cadence behind the sync guard. Run verbatim in the turn that wrote this, against the **final pushed commit** `3eecd37`, and **exit 0** end to end. Nothing is held and nothing is owed to David today; G-1 reaches both its close conditions on Saturday 2026-08-22 and that is his decision, not ours.

```bash
cd C:/dev/skylark/bounds-ledger && git rev-parse HEAD origin/main && [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && npm run check && node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**THE NUMBER THAT WILL LIE TO YOU** — **`stale-actionable: 5`**, and it will lie in a specific way: it arrives in the kickoff beside its own documented threshold, *">3 = real P4 forced-decision pass"*, so a cold reader's shortest path is to run that pass. Both branches of the shortest path are wrong. Running it produces the same answer five times — keep waiting — because all five are items whose correct state is no activity, named here in full: (1) `W-3` — the erdosproblems.com acknowledgement watch — waits on a third party who may never reply; (2) `W-6` — the README report-an-error read window — has a clock that has not started; (3) `A-9` — the engineering-health P2 backlog — is titled *"fix-on-touch, not scheduled work"*; (4) `A-7` — the engineering-health P1s — is open on a **fleet-owned** sweep alone; (5) `G-2` — the goal of contributing a verified bound improvement — is a goal, and goals do not accrue daily commits. Waving them through as "all parked, fine" is the other wrong branch, because it leaves the instrument un-examined and firing again tomorrow. The endpoint reports `"filteredCount": 0` — its own count of items excluded as *deliberately parked* — and that zero is **structural**: the filter scans `closeWhen` and `item.notes`, this lane writes prose into `note`/`note2`…`note9` and parks items in `expectedSignalBy`, so no item here can ever be excluded, whatever its dates say. Two of the five are parked to **2026-09-24** and **2026-11-06**. Read the figure as *"the parked-item filter is blind on this lane"*, never as *"five items were neglected"*. Full write-up: [`docs/findings/2026-08-19-the-parked-item-filter-cannot-see-this-lanes-dates.md`](../findings/2026-08-19-the-parked-item-filter-cannot-see-this-lanes-dates.md); tracked as **A-21 — the proposal passed upward for the shared endpoint**.

**DON'T-TOUCH** — **`C-7` and `C-9`, the two `manual: true` claims, stay `manual: true`.** Today's local run makes the bait unusually concrete: `check-claims` printed *"advisory fetch from THIS machine: HTTP 200, expected `0.380876` still present"* for both, so a session reading only that line sees two claims that plainly could be automated and a headline figure of "2 unverified" that would drop to zero. It has been tried — 2026-07-25, on the strength of exactly this local 200 — and CI went red four minutes later, because erdosproblems.com 403s **datacenter** IPs and serves residential ones fine. What makes the current arrangement work is that the local fetch is *advisory*: it gives a session real information while touching neither the counts nor the exit code, so the claim keeps reporting UNVERIFIED in the one environment that cannot read it. A local 200 is not evidence about CI; only a green CI run is.

## What changed

**The steward cadence ran clean, in the documented order, and the visitor path was verified credential-free.** `npm run check` first, then the overnight log — the order is not arbitrary and is set out in `CLAUDE.md`. No drift, 113 files matching upstream `e70b4a4` (an upstream sha; it does not exist in this repo), 233 claims with 231 holding, 0 broken and 0 unreachable, and the 2 UNVERIFIED that are UNVERIFIED by design. State block in sync, catch-table guard agreeing at 9 cycles, hosted brief in sync on all 4 dated blocks. Overnight scheduled run `32237594877` completed at 09:26Z on `0d00e79` and **reached a verdict**, so it counts under G-1's pre-registered `streakDayRule`.

**The visitor path was run from a stripped environment and demonstrated both answers.** `env -u CC_PROMPTS_PIN`, the README's own commands verbatim: step 1 exit 0, step 2a **exit 1** with `CHANGED constants/2a.md`, step 2b **exit 0** with `No drift.` The mutation was proven to land with `git diff --numstat` (`1  1  …/2a.md`) before either verdict was believed.

**That proof was needed, because the first attempt at it silently did nothing and reported success.** Rewriting the README's `node -e` to get it past a shell guard turned the module name into `0node:fs`; the tamper threw `MODULE_NOT_FOUND`, the file was never modified, and step 2a then printed `No drift.` at **exit 0** — an alarm reporting green because the condition it was meant to detect had never been created. This is KP-78 — the standing rule that no detector ships without demonstrating both of its answers — failing on its silent half, reproduced live inside the check written to catch it, and the only thing that caught it was the `--numstat` line standing between the mutation and the verdict. The lesson is not new; the demonstration is, and it is worth more than the rule it re-proves. Nothing shipped from it — the guard already exists and already worked.

**A posted-unpushed alarm was diagnosed rather than obeyed.** The kickoff flagged commit `dd336d8`, cited 45.3h ago by task-complete `38070549`, present locally and on no origin branch, with the instruction *"push it or retract the claim."* Both options were wrong. `dd336d8` touched only `scripts/render-state-block.mjs` on the superseded `guard-catch-count` branch; diffing its version of that file against `main` shows `main` carries the same CRLF-normalising fix in refined form, landed through PR #22 as `f362ce7`. **The work shipped; only the sha citation is stale.** Pushing an abandoned commit to quiet a detector would publish dead history to satisfy an alarm about work already done, and a retraction post would not clear it either — `check-posted-unpushed.mjs` has no supersedes or retraction awareness. It has a **48h lookback**, the claim is 45.3h old, so it ages out of the window on its own within about three hours of this report. Recorded here so tomorrow does not re-derive it.

**One finding filed, one tracker row, in the same commit.** That pairing is the rule carried by W-7 — the watch on recommendations that get routed to a later pass and never tracked — which exists because the 2026-08-15 instrument-audit recommendation was routed to "the weekly pass", never became a row, and silently expired.

## Inputs (controllable)

- **Steward cadence** — `npm run check` exit 0; CI at HEAD **GREEN**; scheduled run reached a verdict.
- **Visitor path** — verified from a stripped environment, both answers demonstrated, mutation proven to land.
- **Self-tests** — 13 PASS, all wired into CI.
- **A verified measurement-fit defect** in a fleet instrument, with a named file, a named line, a one-clause fix and an argument for refusing the larger fix.
- **Codex** — GREEN, machine-level probe at 2026-08-19T13:30:39.819Z, quoted from the kickoff rather than re-run. `codexCalls: 0` today: the work was one measured read of an endpoint's source plus a set of local verifications, none of it a bulk diff and none of it a second opinion on a decision. Delegation would have added a hand-off larger than the task.

## Outputs (lagging)

- **North star — externally-acknowledged corrections: 1.** Unchanged. Tao merged `teorth/optimizationproblems#141` on 2026-08-11; that merge is the acknowledgement. `W-3` — the watch on the erdosproblems.com correction email — is a **different channel**, still unanswered, and does not close on this.
- **G-1 — streak day 27 of 30.** Both close conditions land **Saturday 2026-08-22**. Evidence is pre-staged in `G-1.signalPrestaged`. **Closing it is David's decision — never a self-approval and never a self-rating.**
- **`npm run catches` — 0 movements this week (current, partial), 0 completed dry weeks.** The current week is never counted, so the zero is arithmetic, not a verdict. The rule it feeds — *a month of zeros means adopt a second surface* — needs **four completed** dry weeks and, since the 2026-08-14 amendment, also needs `docs/findings/` dry over the same window. It is not: one landed today. Read it beside the **candidate-correction queue depth of 1** (`A-16` — a verified defect in a stewarded surface, blocked at David's gate). A zero rate beside a non-zero queue is work found and blocked, not a quiet week.
- **`W-6` — arrivals.** Read window open since the repo went public 2026-08-08; `expectedSignalBy` 2026-11-06. Early figures are arithmetic, not a verdict.

## Recommendation

**Ship nothing further today.** The steward cadence is green, the increment is filed, and the one actionable defect found is in another repo's trusted-print instrument, which this lane does not ship into. What it owes upward is the proposal, and that goes out with this report.

For the orchestrator, concretely: the fix in `skylark-site/src/lib/continuity-endpoints.ts:523` is to add the **typed** `expectedSignalBy` to the text `hasFutureDateInCloseWhen` scans, and to **refuse** the larger and more obvious version of the same change — widening the scan across the `note*` prose family. Those fields are narrative — `W-3` (the erdosproblems.com acknowledgement watch) carries a `signalNote` that alone names two dates — so a stray future date anywhere in prose would park a genuinely neglected item, turning a false-positive alarm into a false-negative silence. That is the more dangerous direction, and the smaller change is strictly more correct. It is a trusted-print instrument feeding a documented threshold, so it is squarely in the cross-family review-gate class.

## On hold pending data

- **`A-15` (the Mathstodon send)** — dormant by instruction. Do not ask.
- **`A-16` (the Martinet row whose cited witness yields the previous record)** — gate 2 is David's. Do not raise, do not PR, do not contact upstream.
- **`W-3` (the erdosproblems.com acknowledgement watch)** — waiting on a reply that arrives in David's inbox, not ours; `expectedSignalBy` 2026-09-24.
- **`A-18` (the generated primer state block) and `A-19` (the two review nits)** — forced review 2026-08-25. **`A-20` (retry-with-backoff on 429/502)** — 2026-09-01. **`W-7` (the untracked instrument-audit proposal)** — the next weekly pass, 2026-08-24. **`A-21` (today's endpoint proposal)** — 2026-08-26, and if nothing has come back by then the proposal was dropped rather than declined, which is the exact failure W-7 exists to catch.

## State Appendix

Every figure with the command that produced it. Point-in-time as written.

| Figure | Value | Command (exit) |
|---|---|---|
| HEAD / origin sync | `0d00e79` both at cadence time; **`3eecd37` both after today's push** | `git rev-parse HEAD origin/main` (0) |
| CI at HEAD | **GREEN at both** — 1 completed non-scheduled success, 0 failures, 0 pending, re-read at the **final pushed commit** `3eecd37` | `check-ci-status.mjs --workflow reverify.yml` (0) |
| Overnight scheduled run | `32237594877`, 09:26Z on `0d00e79`, completed/success — **reached a verdict** | `gh run list --workflow reverify.yml` (0) |
| G-1 (the north-star goal) — streak leg | **day 27 of 30**; both conditions land 2026-08-22 | derived from the above under `G-1.streakDayRule` |
| Mirror | **113 files @ upstream `e70b4a4`**, no drift | `npm run check` (0) |
| Ledger | **233 claims — 231 hold, 0 broken, 0 unreachable, 2 UNVERIFIED by design** | `check-claims.mjs` (0) |
| The 2 UNVERIFIED — `C-7` (the bound on erdosproblems.com/36) and `C-9` (that page's last-edited date) | advisory local read: HTTP 200, `0.380876` still present for `C-7`, `This page was last edited 23 January 2026.` still present for `C-9`; both stay UNVERIFIED | `check-claims.mjs` (0) |
| Visitor path — alarm fires | **exit 1**, `CHANGED constants/2a.md` | `env -u CC_PROMPTS_PIN`, README step 2a (1) |
| Visitor path — alarm silent | **exit 0**, `No drift.` | README step 2b (0) |
| Visitor tamper proven to land | `1  1  …/constants/2a.md` | `git diff --numstat` (0) |
| State block | in sync (113 files @ `e70b4a4`, 233 claims) | `render-state-block.mjs --check` (0) |
| Catch-table guard | "9 cycles, and README.md says 9" | `npm run check` (0) |
| Hosted brief | in sync — all **4** dated blocks present | `check-brief.mjs` (0, pin present) |
| Self-tests | **13 PASS** | `npm test` (0) |
| Catches | **0 this week (partial)**; 0 completed dry weeks; queue depth **1** (`A-16`) | `npm run catches` (0) |
| `stale-actionable` (7d) | **5**, `filteredCount: 0` — **structurally incapable of excluding a parked item on this lane**; see `A-21` | `/api/cc/items-stale-actionable` (200) |
| `missingLinkedCommits` | **0** | `/api/cc/items-health` (200) |
| Posted-unpushed | **1** — `dd336d8`, content landed as `f362ce7` via PR #22; ages out of the 48h window today | `check-posted-unpushed.mjs` (3) |
| Items | **29 total, 15 open** (`A-21` filed today) | `continuity/items.json` |
| Findings | **28** | `ls docs/findings/` |
| Codex | **GREEN** (probe 2026-08-19T13:30:39.819Z) · `codexCalls: 0` | quoted from kickoff, not re-run |

**Positive control: two absence claims in this report were checked against something that returned non-empty from the same read.** (1) *"the filter cannot see this lane's dates"* — the same scan that returned `futureDatesInCloseWhen=[]` for all five flagged items returned non-empty `expectedSignalBy` values from the ignored field, `2026-09-24` for `W-3` (the erdosproblems.com acknowledgement watch) and `2026-11-06` for `W-6` (the README report-an-error read window), so the reader was working and the filter was pointed elsewhere. (2) *"`e70b4a4` does not exist in this repo"* — `git cat-file -t e70b4a4…` exits non-zero with `could not get object info`, while the identical command on our own `0d00e79` prints `commit`, so the command can resolve a sha and the upstream one genuinely is not here.

**Engineering zero-state: structurally zero, not swept to zero.** `package.json` carries empty `dependencies` and `devDependencies`, so Dependabot has nothing to find; there is no Sentry project for this repo, which is why the frontmatter carries `sentry_open_p1: null` rather than `0`. An absent instrument renders null, never a count.
