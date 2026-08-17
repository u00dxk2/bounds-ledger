---
product: bounds-ledger
date: 2026-08-17
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: e2b9935
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. Our own alarm told a lie and we caught it. Several of our test runs failed today because GitHub itself was broken - a major outage on their side that started at 13:40 UTC and hit their whole service. My first note today blamed our own runs for that, which was wrong, and I have corrected it everywhere it was written down: their outage began nearly an hour before we ran anything. The problem was what the alarm then wrote: it announced that six mathematical records had changed, when none had. It could not tell the difference between 'we read the page and the number moved' and 'we never got the page at all'. That is the same mistake we fixed once in July, hiding in a spot the July fix could not reach. It is fixed properly now, with a test that fails if anyone undoes it. I also closed seven stale alarm notices, five of which had been sitting open for days over problems already solved - a warning light nobody turns off is one people stop reading."
---

# bounds-ledger — daily — 2026-08-17 (MT) — the alarm said six records moved; none had

Paced rail, day 16. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — the steward cadence, then check whether the review lane has replied on the held `alarm-title-honesty` branch. If it has, merge **that** branch before the guard branch: main's alarm has to be honest before any push-triggered run can mis-title a flake again.

```bash
cd C:/dev/skylark/bounds-ledger && npm run check && node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**THE NUMBER THAT WILL LIE TO YOU** — **the two failed CI runs dated today, and the two closed issues titled `Drift:`.** A cold reader will conclude either that a record moved or that G-1's green streak — the goal of becoming a re-verified steward of a drifting record inventory — broke. Neither happened. Both failures were `workflow_dispatch` runs on *feature branches*, triggered by me to validate a held merge; today's **scheduled** run on `main` (`e2b9935`, 09:27Z) passed, so the streak stands at day 25 of 30. And both issues were pure HTTP 429 rate-limiting: the sources were never read, so nothing could be found to have moved. Read the `event` and `headBranch` fields before reading a conclusion; the distinction is invisible in a bare red/green count. Today's three runs, from `gh run list --workflow reverify.yml`: `schedule` on `main` @ `e2b9935` → success (09:27Z); `workflow_dispatch` on `guard-catch-count` @ `dd336d8` → failure (14:32Z); `workflow_dispatch` on `guard-catch-count-v2` @ `f0fbd41` → failure (14:41Z).

**DON'T-TOUCH** — **a run must stay RED when a cited source is unreachable.** Today's obvious-looking lesson is that a network flake should not be able to threaten the streak, and acting on that would be the real disaster: an unreachable source means we could not verify, and a green there would launder an unverifiable result into a pass — the single thing this repo cannot do and still be worth anything. Only the *title* was wrong, and only the title was changed. If the fetch layer should retry on 429, that extends the instrument's reach rather than softening its verdict, and it belongs behind a review pass, not a quick patch.

## What changed

**The held guard branch was validated on a Linux runner, which is what the hold was for — and getting it there exposed that it could never have happened by pushing.** `reverify.yml` declares `push: branches: [main]`, so a feature branch gets **zero** CI runs no matter how often it is pushed; `gh run list --branch guard-catch-count` returned an empty list for a branch that had been sitting pushed since yesterday. `workflow_dispatch` is the only route. Dispatched, the guard behaved exactly as designed on a shallow checkout:

```
render-state-block selftest: PASS (... history checks SKIPPED — shallow clone)
state block: in sync (113 files @ e70b4a4, 233 claims).
catch table: UNKNOWN — shallow clone, so mirror history cannot be counted. Not a pass and not a failure...
```

**The merge would not have been clean, for a reason the hold did not anticipate.** `main` moved underneath the branch: `58345b8` fixed the state-block check's CRLF comparison yesterday, and the branch had independently fixed *the same lines* differently. `git merge-tree` reported a content conflict. So validating the pre-merge sha answered a question about code that could never have landed. Rebased onto main, conflict resolved in favour of main's shipped wording, re-validated locally (both answers, mutation proven to land) and on a runner again. Now `guard-catch-count-v2` at `f0fbd41`, a clean fast-forward from main.

**Then the run that validated the guard caught our own alarm lying.** The job failed on `HTTP 429` from `raw.githubusercontent.com` and filed:

```
Drift: claims C-1,pin:12a:U pin:37a:U,pin:37a:L pin:3c:U,pin:3c:L (2026-08-17)
```

Six records asserted to have moved. Zero had — `npm run check` four minutes earlier read 113 files in sync and 231 of 233 claims holding. The `Open finding` step grouped `UNREACHABLE` with `BROKEN`, and those are different events: `BROKEN` means we read the cited source and the pinned string was gone, `UNREACHABLE` means we never read it. This is **A-5** — the watch-item defect from 25 July where a network flake was titled `Drift:` — surviving in a branch A-5's own fix could not reach. A-5 added an `error:` test, but it sits in an `elif`, and `UNREACHABLE` matched first, so reverify's own `error: fetch constants/11a.md: 429` sat unread in the same file.

Fixed: precedence is now mirror movement → claim movement → unreachable sources → tool error → generic, and unreachable gets its own honest title. A second, latent defect in the same line went with it — `paste -sd', '` cycles its delimiter *list* rather than joining with `", "`, so three or more items came out `a,b c,d`, visible in that title and in every multi-file drift title before it.

**The guard for it extracts the step body from the deployed workflow rather than restating it**, per **A-4** — the July finding that this alarm's behaviour must be established by executing its actual body, not by reading it. Seven cases under GitHub's exact shell (`bash --noprofile --norc -eo pipefail`), including that a real move outranks a concurrent flake. Negative control performed: restoring `UNREACHABLE` to the drift group fails the test, with the mutation proven to land first.

**The guard fooled itself first, and that is the most useful thing here.** Its first version resolved `bash` from `PATH`, which this machine's PowerShell does not have. The spawn failed silently, the harness returned an empty string, and `assert.doesNotMatch(title, /^Drift:/)` **passed on the empty string** — a guard reporting success because it had never run. **KP-78** — the standing rule that no detector ships without demonstrating both answers — is usually read as "prove it fires". This is the other half: prove the absence of a fire means the condition is absent, not that the instrument is missing.

**Seven issues closed; the open count is now zero.** Two were today's false alarms. The other five (#10–#14) were resolved drifts from 11, 12 and 14 August that nobody closed at resolution time, each now closed naming its resolving commit. Five standing `Drift:` issues on a repo whose pitch is noticing stale things teaches the next reader that `Drift:` issues can be ignored, which is the precondition for missing a real one. Closing on resolution is part of the drift cycle. The zero was verified through the REST API after the GraphQL listing returned 503 — a failed query is not evidence of absence.

**Two mistakes of mine, recorded because they cost something — and a third, added after the 15:50Z incident update, which is the worst of the three.** A throwaway debug one-liner's escaping failed to strip the step's `gh issue create` before executing it, and it filed a real issue (#16) against the public repo; closed within minutes. Its title was `Check error: bounds-ledger could not reach 2 cited source(s)` — an accidental end-to-end proof that the fix works through the real `gh` path, which does not make it less of a mistake. Second, I shipped b1 and its guard to main without checking that the branch under review still merged — the rule I had written into `CLAUDE.md` that same morning.

**The third: this section originally opened "I caused the rate limit," and that was a false attribution.** GitHub was in a **critical outage from 13:40:03Z** — verified by reading githubstatus.com's incident API directly, not from the broadcast: impact critical, Actions degraded from 13:42Z, ~20% error rates across API, Issues, PRs and Actions. My first dispatch was **14:32Z, fifty-two minutes later**. Three pieces of disconfirming evidence were already in hand and I did not assemble them: the local `npm run check` at 14:28Z issued ~450 raw fetches and came back **fully green**, 48 minutes into the outage; a later *local* check failed even though my dispatches were runner-side and share no egress with this machine; and the errors included **502 and 503**, which no volume of requests produces. I wrote "the 502 is not explainable that way" in one place and left the self-blame standing in five others. Two dispatches in ten minutes is still poor practice and the guidance against it stands — as practice, not as the diagnosis. Retracted in the finding, `A-5 note4/note5`, `CLAUDE.md`, and on the bus. **This is precisely the failure this lane exists to catch, aimed inward: a confident causal story attached to a red, published without the positive control our own drift rule demands. Self-blame felt like rigour; nobody challenges you for it.**

## Inputs (controllable)

- **Steward cadence, all four legs green.** Mirror: no drift, 113 files match upstream `e70b4a4` (an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo). Claims: 233 total, 231 hold, 0 broken, 2 UNVERIFIED by design. README state block in sync. Hosted brief in sync, all 4 dated blocks present.
- **The visitor path ran as its own cadence step, from a shell with `CC_PROMPTS_PIN` stripped** — the credential-free entry point yesterday's review found broken. Both checks exit 0; the tamper step fires exit 1 naming `CHANGED constants/2a.md`; the restore step returns exit 0 and silence; tree clean afterwards. Yesterday this was verified in review, today from the stranger's environment.
- **`npm test`** green, 13 self-tests, 19 workflow steps, piped steps pipefail-guarded.
- **Two branches held, deliberately unmerged.** `alarm-title-honesty` (`4153c00`) and `guard-catch-count-v2` (`f0fbd41`). Both wait on one thing: the cross-family review lane. The alarm's issue title is the most-read line this repository produces, which puts it squarely in the trusted-print class the gate exists for, and merging the guard first would push a network run to main while the rate limit is still recovering and the alarm on main is still the dishonest one.
- **W-3** — the watch on the erdosproblems.com correction emailed 24 July — is 24 days unanswered. Both advisory legs read unchanged from this machine: `0.380876` still present, `last edited 23 January 2026` still present. That is evidence about the page and none about the reply.

## Outputs (lagging)

- **G-1 — externally-acknowledged corrections: 1.** Unchanged. The acknowledgement condition has been met since the 11 August merge of `teorth/optimizationproblems#141`; the item stays open on the 30-day green-streak leg alone, now **day 25 of 30**, which completes **2026-08-22**. Worth flagging five days out: on current trajectory G-1's stated close conditions are both satisfied next Saturday.
- **Catches per week (Tier-1 leading indicator):** current partial week **0**; **0 completed consecutive dry weeks**. The adopt-a-second-surface rule needs four completed dry weeks and is nowhere near firing. Prior completed weeks: 0, 4, 0, 4.
- **W-6 — the watch on whether anyone arrives:** 21 days recorded, **3 unique viewer-days** since the 8 August public flip against a threshold of 90 days and 100 unique visitors. Unchanged from yesterday. Nobody has been told the repo exists, so this is arithmetic and not a verdict.
- **Advocacy signal:** none. No issues opened by anyone else, no external contact, no reply on W-3 — the watch on the erdosproblems.com correction emailed 24 July.

**Positive control:** three absence claims in this report were checked against a run of the same instrument that returned something. (1) `gh run list --branch guard-catch-count` returned an empty list; the identical command against `guard-catch-count-v2` returned run `32039895461`, so the query reaches branch runs. (2) The open-issue count is 0; the same REST endpoint listed five open issues minutes earlier, before they were closed. (3) `git cat-file -t e70b4a4` reports *Not a valid object name*, while `git cat-file -t e2b9935` reports `commit` — so the upstream sha genuinely does not resolve here, rather than the command being broken.

## Recommendation

Merge in the order the day argues for — `alarm-title-honesty` first, then `guard-catch-count-v2` — once the review lane replies, and not before, because the alarm-title diff is exactly the trusted-print class the gate was created for and its first use in this lane returned a boundary error a self-review had missed.

Raise nothing with David. Both pending decisions are his and neither is to be prompted.

One measurement question worth putting on the record rather than acting on: **G-1's remaining leg is called a "30-day green CI streak", and it is not being counted that way.** The scheduled run on 14 August failed, on a genuine upstream drift, and the streak was never reset — correctly, because this lane's own rule is that a red drift run is the alarm working. But that means the thing being counted is "the instrument has been armed and functioning for 30 days", not "CI has been green for 30 days". Those differ precisely when the project is succeeding at its purpose. With the leg completing on 22 August, the wording should be fixed before it is used to declare a goal met, or the close will rest on a sentence that does not describe the test that was applied.

## On hold pending data

- **A-16** — upstream's Martinet-constant row cites a witness whose arithmetic yields the previous record. Gate 1 (adversarial review) cleared 15 August; gate 2 is David's approval. Not to be raised unprompted, not to be PR'd, no upstream contact. Its precondition still holds: the mirror is in sync at `e70b4a4`, the upstream commit that added the page. Deliberately kept out of the README's public catch table — that table is our scoreboard, and routing gate-pending criticism into it is the same content through a louder channel.
- **A-15** — the Mathstodon post. Dormant by instruction; card dismissed. Do not ask, do not card, do not send.

## State Appendix

- **Rail:** paced, day 16 (ruled 2026-08-01, effective 2026-08-02). No self-rating.
- **HEAD:** `main` at `e2b9935`, unchanged today — nothing merged. Working tree clean.
- **Branches held:** `alarm-title-honesty` at `4153c00` (alarm-title fix + guard + finding); `guard-catch-count-v2` at `f0fbd41` (catch-count guard, rebased onto main, runner-validated twice). The pre-rebase `guard-catch-count` at `dd336d8` remains on the remote and is superseded — a force-push to rewrite it was declined by the permission classifier, so the rebased state was published as a new ref instead. It should be deleted once its replacement merges.
- **Mirror:** 113 files @ upstream `e70b4a4`. **Ledger:** 233 claims — 11 hand (C-1…C-11), 220 generated; 231 hold, 0 broken, 2 UNVERIFIED (`C-7`, `C-9`, both `manual: true` on erdosproblems.com, UNVERIFIED by design).
- **CI:** scheduled run 2026-08-17 09:27Z on `main` @ `e2b9935` — **success**. Verified with `check-ci-status.mjs --workflow reverify.yml`, exit 0, on a completed non-scheduled run matching HEAD. Two `workflow_dispatch` failures today on feature branches, both HTTP 429, neither on `main`.
- **Open GitHub issues: 0** (seven closed today; verified via REST after a GraphQL 503).
- **G-1** — the goal of becoming a reproducible steward of a drifting record inventory: acknowledgement 1, streak day 25 of 30, completes 2026-08-22.
- **A-2** — the standing drift-resolution log: 9 resolution cycles, unchanged today; no drift to resolve.
- **W-3** — the watch on the erdosproblems.com email: 24 days unanswered, both page legs unchanged.
- **W-4** — the standing watch carrying KP-78 (the rule that no detector ships without demonstrating both answers, fires and stays silent): exercised twice today, and it caught a detector that passed by not running.
- **W-5** — the watch on upstream's README as a blind class: in scope, mirrored, no change.
- **W-6** — the watch on arrivals: 3 unique viewer-days since the public flip, 21 days recorded.
- **A-7** — the engineering-health item: open on R7 alone (the scheduled verified history sweep, fleet-owned).
- **Findings added today:** `docs/findings/2026-08-17-the-alarm-called-a-rate-limit-a-record-movement.md`.
- **Codex calls today:** 0.
