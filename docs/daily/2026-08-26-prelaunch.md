---
product: bounds-ledger
date: 2026-08-26
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; re-pointed in the same commit per the close procedure so a closed goal's number never rides as the headline
last_deploy: c25cecd
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "One thing needs you, and it is good news. The ledger's top goal was whether anyone outside Skylark would actually use it. Three days ago someone did: a contributor read a correction we had filed about a mathematical record, fixed the record, and wrote our report number into his own commit as the reason. Terence Tao then closed our report as done. That appears to meet the finish line for the goal, but I wrote that finish line myself, so I have put it on your board rather than declaring my own work finished. The uncomfortable half is that it happened three days ago and nothing we run noticed; I found it by accident this afternoon while working on something else."
---

# Daily report — bounds-ledger — 2026-08-26

## BLUF

**FIRST ACTION**

```bash
git rev-parse HEAD origin/main && npm run verify > tmp/verify-out.txt 2>&1; echo "EXIT=$?"
```

Run from the repo root in exactly this shape. Verified as a compound at close today: two identical
shas, then `EXIT=0`. **No leading `cd`** — that compound cannot be statically resolved by the
permission classifier and parks at a silent prompt that reads like a hang. It is
`git rev-parse HEAD origin/main`, **not** `--short`, which takes a single revision and dies
`fatal: Needed a single revision`, silently skipping the whole cadence from a leading `&&`.

**THE NUMBER THAT WILL LIE TO YOU**

`check-ci-status` will very likely say **RED**, and a cold reader will take that to mean a check
failed. It does not. It reads the **run-level** conclusion, and today that field was wrong in *both*
directions inside four minutes: `8a35eaf` reported `completed/failure` with **zero steps executed**,
while `1cb3f65` reported `startup_failure` over a job that ran **29 of 29 steps green**. Read
`gh api repos/u00dxk2/bounds-ledger/actions/jobs/<id>` before believing either. A failed run is not
a failed check — the CI-layer twin of this lane's `UNREACHABLE is not BROKEN`.

**DON'T-TOUCH**

`scripts/render-site.mjs --check`. It reads `index.html` **from disk** and compares it to a fresh
render, which is the only reason today's malformed page was caught — the offline battery renders to
a string in memory and passed happily on a broken artifact. Do not "simplify" it into the selftest,
and do not move it into `npm test`: the file on disk is the only thing a visitor ever receives.

---

**G-3 — the Tier-0 goal that someone outside Skylark uses the ledger and acts on it — appears to
have been met on 2026-08-23, and no instrument we run noticed.** Upstream contributor Chessing234
(Taksh) committed `7848802` at 15:14:02Z, *"Attach the right witness to the 857.567 record in 87a"*,
whose message ends **"Reported in issue 150."** — the issue this ledger filed on 2026-08-20. He
cross-referenced it from PR #151 at 16:50:14Z; Terence Tao closed our issue `state_reason=completed`
at 17:15:36Z and committed a follow-up at 17:18:50Z. Causation is stated by the actor, not inferred
from timing. **Carded to David rather than self-closed** (card `8e8f547d`): the two-person bar is one
I wrote myself, and Tao is arguably already the single acknowledgement G-1 produced.

The binding constraint therefore **moved today**, for the first time since the goal was set — and
the instrument read that decided it was a hand-run `gh issue list`, not anything on the rail.

## What changed

**Shipped, user-visible:** every row on the public page now carries its own permalink (`784e4f4`,
repaired in `e391be7`) — a reader can send a colleague one constant instead of a 222-row page. The
evangelism bar names share-rate as one of only two metrics whose shape survives this lane's
citation-check loop, and sharing a row was previously impossible.

**Corrected, and all five are our own machinery:**

1. **The as-of rule** (`1b0f85e`). Three statements of a live instrument's value were falsified by
   the same session that wrote them — a primer banner true for seventeen seconds, a report calling
   `A-18` the only declared deferral 82 minutes before `A-30` was declared, and the primer
   contradicting itself on that same count. A hand-written claim about machine-readable state now
   carries an as-of and its read command. Approved by the orchestrator as a portfolio candidate.
2. **"Nothing deploys" was false** (`ff164fa`, `1cb3f65`, `8a35eaf`). Every push to `main` publishes
   via GitHub Pages and has since 2026-08-21; the claim survived in four documents including today's
   primer. Measured from the builds API — 30 consecutive rows, one per commit.
3. **The publish is not CI-gated at all** — the Pages build for `c25cecd` was created **two seconds
   before** its CI run started. Opened as `A-31`.
4. **An assertion that could not fail** (`47815af`). A negative control found `/tr:target/` matching
   a second CSS rule, so deleting half the treatment passed.
5. **A malformed page** (`e391be7`). `784e4f4` shipped `index.html` with its first 45 bytes clobbered
   by a shell redirect racing the script's own write.

**Continuity** (`39c510c`): six `readCommand` gaps closed — each command *run* before being written
down, each carrying a positive control — plus `closeWhen` on `A-29` and `A-30`. The gap scan now
reports zero. `W-8` — the watch on whether a materially amended outward artifact returns to David
before it sends — caught a live miswrite while its command was being drafted: `gh pr list` is blind
to our most recent outward artifact, because #150 is an issue and not a pull request.

## Inputs (controllable)

- `npm run verify` **exit 0** at every commit, run four times today; the mirror holds at 113 files
  against upstream `5c4aeee` (an upstream sha; it does not resolve in this repo) with 233 claims —
  231 hold, 2 UNVERIFIED by design (`C-7`/`C-9`, the `manual: true` erdosproblems pins).
- Six `readCommand` gaps closed; **0 open items now missing** `readCommand`, `closeWhen` or
  `onTrigger`.
- Both forgotten-commitment sweeps and the prose-commitment sweep returned clean across 33 docs.
- Engineering zero: **0 open issues, 0 open PRs, 0 Dependabot alerts.**

## Outputs (lagging)

- **G-3 (outside use): 2 people, measured** — Chessing234 and Tao, both dated and evidenced above.
  Awaiting David's ruling on whether the bar counts Tao twice.
- **Traffic (W-6 — the read window on the report-an-error channel):** 3 unique viewers against 195
  unique cloners, trailing 14 days, re-read today rather than quoted from yesterday. The clone figure
  is mostly our own CI and is not deducted; the viewer count is the only arrival figure here that is
  not mostly ours.
- **`npm run catches`:** no new movements today. The current partial week stands at 2
  (`pin:53a:L`, `pin:56a:U`), both **byte-only** — an upstream backslash escape, no number moved.
- **The public page is frozen at yesterday's build.** Four consecutive Pages builds errored during
  the GitHub outage; a direct fetch confirms the served page carries **0** of today's permalinks.

## Recommendation

**Answer the card.** Everything else this lane could do next is downstream of whether the top goal is
finished. If it is, the honest next goal is harder and I would propose it in the same breath: whether
an outside correction happens *again without us hand-filing the report* — because what worked this
time required a human here to write an issue to a maintainer, and that does not scale.

**Do not gate the publish yet** (`A-31`). It is a real trade rather than an obvious fix — an ungated
publish has never actually published a bad page in this repo's life, and a workflow-based publish
adds a failure mode to the one surface a visitor sees. Decide it on 2026-09-09 with Pages healthy.

## On hold pending data

- **`A-18`** (a generated STATE block at the top of the primer) — declared deferral, `expiresOn`
  2026-09-01, release test runnable.
- **`A-30`** (adopt the primer generator so mechanical sections are re-derived) — declared deferral,
  2026-09-01. Its `onTrigger` conditional **fired today**: the generator moved, and the safety fix
  was re-verified as an ancestor, so safety is not the blocker.
- **`A-28`** (the Mathstodon announcement, unsent 13 days) — re-classified today. It was carried as
  though waiting on David and names no board card, which means we never asked. The un-wait action is
  **ours**: its figures decayed while it sat.

## State Appendix

### G-3 — the evidence behind the BLUF, row by row

`G-3` is the Tier-0 goal that someone outside Skylark uses the ledger and acts on it. Every figure in
the BLUF derives from the table below, read from the GitHub API today and not from memory:

| when (UTC) | what | evidence |
|---|---|---|
| 2026-08-20T22:38Z | we filed the correction | issue #150, *"constants/87a.md: the current-record row quotes Martin's degree-8 discriminant, not the degree-12 construction that gives 857.5662"* |
| 2026-08-23T15:14:02Z | an outside contributor fixed the record | commit `7848802` by Chessing234 (Taksh), *"Attach the right witness to the 857.567 record in 87a"*, message ending **"Reported in issue 150."** |
| 2026-08-23T16:50:14Z | he linked it to our report | timeline event `cross-referenced by Chessing234`, naming PR #151 |
| 2026-08-23T17:15:36Z | the maintainer closed ours as done | `closed by teorth`, `state_reason=completed`; his own follow-up `b1a28ac` landed at 17:18:50Z |

**The 857.567 figure is the record value itself, and it did not move** — Taksh's message says so
explicitly. What changed is the *witness*: which field the record is attributed to. That distinction
is the whole substance of what this ledger caught on 2026-08-14, and it is why the change read as a
text edit rather than a value change when our own mirror ingested it.

### W-7 — the instrument read

**Instrument chosen: `check-ci-status.mjs`.** Rotated — yesterday was `A-18.readCommand`.

**Its claim:** that it reports whether CI passed for your HEAD. **What it actually reads:** the
run-level `conclusion` field. Today those came apart in both directions on the same repo within four
minutes — `8a35eaf` `completed/failure` with zero steps executed, `1cb3f65` `startup_failure` over a
29-of-29 green job. **Could its output ever have said otherwise?** Yes, and that is what makes this a
finding rather than an outage anecdote: on any normal day the two layers agree, so the instrument has
been correct for a month by coincidence of a healthy platform rather than by construction. It is not
wrong — `RESULT: RED — 1 completed run did not succeed` is a true sentence — it is *insufficiently
specific*, and the gap only opens when the platform is degraded, which is exactly when it is read
most anxiously.

**Deliberately not mechanized.** Adding a job-layer read to our own wrapper is a fleet-owned script's
decision, and a detector auditing a detector owes this same question.

### The day's classification

**Instrument-facing — day seven, and the count is now the wrong question.** Every correction
enumerated under "What changed" — the as-of rule, the false deploy claim, the ungated publish, the
assertion that could not fail, and the malformed page — is a defect in our own machinery rather than
in the mathematics. By the rule in `CLAUDE.md` § Conventions requiring each report to
classify its window's findings as record-facing or instrument-facing, that makes this the seventh
consecutive instrument-facing day (the last record-facing catch remains 2026-08-14). **But
the day also produced something the classification has no slot for:** confirmation that the
2026-08-14 catch was *acted on by an outside party*. That is an outcome on a prior record-facing
catch, not a new one, so it does not reset the streak — and it answers, from a completely different
direction, the question the streak exists to prompt. *"A lane that only ever finds faults in its own
tooling is maintaining itself rather than stewarding records"* is the worry. Seven days of that is
still true, and the steward's last real catch just changed a published mathematical record.

**The standing prediction is now partly settled and I am marking it, because a prediction never
checked is decoration.** It said the next record-facing catch would be found by a human recomputing a
cited certificate and flagged by no instrument we run. The *outcome* of the last one arrived exactly
that way — found by hand, by accident, invisible to every instrument. The prediction's own subject —
the next *catch* — is still open and still uncontradicted.

### Verification state at close

`npm run verify` **exit 0** at HEAD. **CI: UNKNOWN, and named** — GitHub Actions was in
`major_outage` for most of the working window (githubstatus.com, read directly; `Pages:
degraded_performance`). The last real runner verdict is `1cb3f65`, whose `check` job passed 29 of 29
steps at 15:35Z; every commit since is doc-only. Nothing was closed, resolved or snapshotted on a red
produced inside that window.

**Fail-open sweep, deploy-anchored and paginated:** live sha `c25cecd`, `fetched=7/7` check-runs, our
real gate `check` **present and passing**; `git log c25cecd..HEAD` is 10 commits, none live. The
ungated range is empty because nothing published today.
