---
product: bounds-ledger
date: 2026-08-25
lifecycle_stage: launched
north_star_metric: someone outside Skylark uses the ledger and acts on it (G-3; leading indicator = every detection path in G-3.readCommand is live)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
last_deploy: 1ba80fc
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 1
top_action_today: "Nothing needs you today. Four things had a deadline of today and all four are now settled rather than pushed back again. The one worth knowing about: we finally wrote down who this project is for and what would make someone tell a friend about it. The honest answer that came out of writing it is that we cannot yet measure whether people love it, because about three people have looked at the page and the only other number we have is mostly our own robots checking their own work. So instead of inventing a target we cannot read, we wrote down the smallest thing we would have to build first to read it at all. We also caught one of our own checks lying. It was written to answer yes or no, and it could only ever answer no, so a passing result was recorded for a question the check could not actually ask."
---

# Daily report — bounds-ledger — 2026-08-25

## BLUF

**FIRST ACTION**

```bash
git rev-parse HEAD origin/main && npm run verify > tmp/verify-out.txt 2>&1; echo "EXIT=$?"
```

Run from the repo root, in exactly this shape, and run as a compound at close today rather than
assumed from yesterday's note: two identical shas, then `EXIT=0`. **No leading `cd`** — a
`cd X && …` compound cannot be statically resolved by the permission classifier and parks at a
silent approval prompt that reads exactly like a hang. It is `git rev-parse HEAD origin/main`,
**not** `--short`, which takes a single revision and dies `fatal: Needed a single revision`; in
a leading `&&` position that failure silently skips the entire cadence. The redirect is not
cosmetic either — piping a gate into a pager is refused by the pre-commit corruption guard,
correctly, because the pipe's exit code would be the pager's.

**THE NUMBER THAT WILL LIE TO YOU**

`check-deferrals` prints **`1 declared deferral(s)`**, and the cold reader will take that as
*this lane has one outstanding deferral*. It does not mean that. It means **one deferral has
declared itself in the machine-readable form** the gate can see. A deferral still written as a
sentence in a note field is invisible to this count, which is exactly the population the gate
was built because we could not track. The figure is a measure of adoption, not of inventory,
and today it is 1 because the field shipped today and A-18 — the watch on generating the
primer's state block — is its first subject. Read a rise in that number as better coverage, not
as more debt.

**DON'T-TOUCH**

The alarm-title guard in `scripts/reverify.test.mjs`. It works because it **extracts the step
body from the deployed workflow YAML instead of keeping a retyped copy**, so it tests the alarm
rather than someone's transcription of it. Today it earned that on the record: it asserted the
old alarm title, and the first run after the title changed failed with the exact expected-vs-
actual strings. A guard that fails the moment the thing it guards moves is the whole point;
leave its extraction mechanism alone.

---

Four dated gates were due today — A-18 (the primer state block), A-19 (two review nits), A-25
(deferral expiry) and A-26 (the evangelism bar) — and all four are dispositioned by outcome
rather than re-dated. A-25 and A-26 shipped, both A-19 nits shipped, and A-18 is deferred in the
machine-readable form A-25 shipped this morning, making it that gate's first subject.

**Today's findings are instrument-facing.** No defect was found in the mathematics. The mirror
had no drift, and the two catches standing in the current week (`pin:53a:L`, `pin:56a:U`) are
**byte-only, not numeric** — upstream escaped a backslash inside inline math, which moves a
whole-row byte comparison while no bound moves anywhere. The last record-facing catch remains
**2026-08-14**. The standing prediction carries forward unchanged and is still uncontradicted:
the next record-facing catch will be a witness-value mismatch on a constant upstream added
within about a month, found by a human recomputing a cited certificate and flagged by no
instrument we run.

**USER-VISIBLE: none — today's owed set was four dated gates, every one of them substrate or
documentation by construction, and manufacturing a page change to satisfy the receipt would
have been worse than reporting the truth.** The evangelism bar written today names the next
real one and is the reason to trust that answer rather than resent it: the per-row report link
already on every row of the public page is an intent signal that nothing counts over time.
Counting it is the smallest user-visible-adjacent increment available and it is now written
down as step 1 of a three-step ladder.

## What changed

**A-25 — the watch on deferrals carrying a machine-readable expiry — SHIPPED** as
`scripts/check-deferrals.mjs`, on the pre-approved design and without re-litigating it. It reads
`expiresOn` and `releaseTest`, fails when either is missing, and treats an open pull request
whose body says HELD with no release line as the same finding. It fires on **expiry** and on
**malformedness**, and is deliberately **silent on a well-formed unexpired deferral however many
exist** — a check that goes red whenever anything is outstanding is the permanently-red alarm
this lane was founded on, and that silence is asserted in the self-test rather than merely
intended. Wired into `npm test`, `npm run check` and a CI self-test step; CI now carries **17
self-tests, up from 16**, and `reverify.test.mjs` verifies that count so a new self-test cannot
quietly skip its workflow step.

**Two defects in that script, both found by testing against real artifacts rather than
fixtures.** The first draft required a literal `Release:` line and **passed its own self-test**
— against fixtures the file invented. Run against the actual bodies of pull requests 26 and 27
it reported a finding on **both**, because the form this lane already uses is a bold
`**Release test**` heading. A predicate tested only against a retyped copy of what you expect
tests the retyping; the fixtures are now the verbatim opening of PR #26's line. The second: the
module had no entry-point guard, so importing it to reuse the predicate **ran the check** and
could have exited out of its importer. That is F2 from the PR #26 review, the same omission
reappearing in new code the same week, caught only because the demo that imported the predicate
printed the check's own verdict above its own output.

**A-19 — the two non-blocking nits from the PR #21 review lane — both SHIPPED, neither struck.**
N-1: the alarm title said `could not reach N cited source(s)` while N counted unreachable claim
*lines*, so six claims pinning one rate-limited file would have asserted six unreachable
sources. It now reads `could not verify N claim(s) (cited source unreachable)`. N-2: the
bash-less branch printed PASS and exited 0 — reporting success for a guard that never ran, the
precise shape this repo ruled against on 2026-08-17 and which stopped being hypothetical on
2026-08-20. It now prints COULD NOT RUN and exits 2.

**A-26 — the evangelism bar — WRITTEN rather than re-reported a fourth time.** The core problem
is verification, not discovery: *"I cited a bound and a referee told me it had been improved. I
had no way to know."* The loop archetype is recorded as `citation-check` and is the
load-bearing finding, because it disqualifies the portfolio's default metrics — a tool used at
citation time *should* have a poor D7-return-rate, and optimising that number would push toward
engagement mechanics that make the product worse.

**A-18 — the watch on a generated state block for the primer — deferred in the machine-readable
form**, as the first consumer of the fields A-25 shipped hours earlier.

## Inputs (controllable)

- **Steward cadence, in the ruled order.** `npm run verify` first (exit 0), then the overnight
  log. The scheduled run at 09:26Z and yesterday's push run both succeeded **at the sha I
  actually hold**, which is the property that matters — a green badge on a stale sha is the
  failure mode this ordering exists to catch.
- **The visitor path.** Covered by the same gate: the credential-free legs (`reverify --check`,
  `check-claims`) ran green inside `npm run verify`.
- **W-7 — the standing instrument read — is below in its own section.** It produced a catch.
- **Delegation: `codexCalls: 0`, and this is a judgment, not an outage.** The probe line on
  today's kickoff reads GREEN at 2026-08-25T13:25:21Z, quoted rather than re-run per the hard
  step. Nothing was dispatched because the only mechanical-looking work available (A-19's two
  nits) is a roughly ten-line diff to the drift alarm and its guard — this lane's single most
  load-bearing instrument — where the coordination cost of briefing a subagent exceeds the edit
  cost and the blast radius of a scope slip is the alarm itself. The evangelism bar is
  authorship about the lane's own identity and the deferral gate is design-sensitive; neither
  is a delegation candidate either.

## Outputs (lagging)

- **Catches, per week:** current partial week **2** (`pin:53a:L`, `pin:56a:U`), both byte-only.
  Prior completed weeks: 5, 4, 0, 4, 0. Quote the per-week figure, never the running total.
- **Candidate-correction queue depth: 0.**
- **Arrivals, sampled today:** 14-day window **3 unique viewers against 194 unique cloners**;
  since the public flip, 5 unique viewer-days (an upper bound, not an estimate). The clone
  figure is largely our own CI, which checks out on a schedule and on every push and pull
  request, so it fails number-provenance rule 2 and is not an audience measure.
- **G-3 — the goal that someone outside Skylark uses the ledger and acts on it — remains 0**,
  and expected-zero.

## Recommendation

Nothing is owed to David today, and nothing should be escalated. The next two sessions should
resist the pull toward a second surface: `npm run catches` shows a non-zero current week and the
dry-week rule needs *no movements and no findings*, which is not this fortnight. The nearest
real product move is step 1 of the instrument ladder written into the evangelism bar — count the
existing per-row report clicks over time — and it should be taken only when it can be taken
without inventing an analytics stack this lane does not want.

## On hold pending data

- **A-18** — held until the primer again forces a cold agent to reconcile superseding close-out
  sections. It now carries `expiresOn: 2026-09-01` and a runnable release command, so it will
  announce itself rather than waiting to be re-read. This is the only declared deferral.
- **A-28 — the eleven-day-old Mathstodon draft — remains dated 2026-08-31 and deliberately
  uncarded**, because its figures decayed while it waited and carding it today would hand David
  an artifact asserting numbers that are no longer true.

## State Appendix

### W-7 — the instrument read

**Instrument chosen: `A-18.readCommand`.** Rotated; yesterday's reads were the A-18/A-26 probes'
key-form traps and `A-2.nextCheckDateNote`.

Its recorded form was:

```
ls -1 docs/cold-starts/ ; grep -L "exit 0" docs/cold-starts/2026-08-*.md
```

with the documented verdict *"EMPTY means the property held and this item CLOSES."*

**Could its output ever have said otherwise? No — and that is the catch.** The glob spans the
**whole month**, including twelve primers written before the exit-code property was adopted
(08-01 to 08-12, and 08-16), none of which carry one. So the command returns twelve filenames
every time it is run, and its documented pass condition is **unreachable**. A cold agent running
the recorded command literally would read twelve hits as the property having failed — the
opposite of the truth, which is that it held for **all 8 primers in the window** (exit-code
counts 1, 6, 3, 3, 2, 2, 4, 5 over 08-17 to 08-25).

Worse, the field also carried *"Verified 2026-08-24: 7 primers over 08-17..08-24, all 7 carry an
exit code, grep -L empty."* That result **could not have come from that command**: those twelve
files were present and unchanged on 08-24 (last touched `fd70f11`, 2026-08-15). The verification
was real, but it was run against a week-scoped glob that was never written down, so the field
recorded a passing result for a question the recorded command cannot ask.

Corrected to a window-scoped glob whose pass condition is now reachable and, today, true —
verified by running it: empty output, exit 0.

### Closing state

- **HEAD `1ba80fc`**, in sync with `origin/main` at the time of the code push; this report and
  tomorrow's primer land after it. `npm run verify` **exit 0** (run twice, once as the
  documented compound). `check-doc-references` **PASS, 0 dead across 68 unique paths in 5
  docs** — it failed once before the commit, correctly, because it reads committed state and
  `scripts/check-deferrals.mjs` was still untracked. **Positive control:** that same checker
  returned a non-empty failure naming `scripts/check-deferrals.mjs` at line 804 of
  `continuity/items.json` before the commit, so the clean run afterwards is a real pass and not
  a checker that scanned nothing.
- Mirror **113 files at upstream `5c4aeee`** (an upstream sha; it does not resolve in this repo
  — `git cat-file -t 5c4aeee` exits 128 with `fatal: Not a valid object name 5c4aeee`).
  **No drift. Positive control:**
  `git cat-file -t 1ba80fc` returns `commit`, so the resolver demonstrably answers for a sha
  that does exist here, and the upstream sha's failure to resolve is a fact about the sha
  rather than about the command.
- **233 claims: 231 hold, 0 broken or unreachable, 2 UNVERIFIED** — `C-7` and `C-9`, the two
  `manual: true` pins on erdosproblems.com, correct by design and never green.
- **Items: 40 total, 15 open** (down from 18: `A-19`, `A-25` and `A-26` closed today).
- **CI: 17 self-tests, 23 workflow steps.** Zero open issues, zero open pull requests (two
  agreeing reads), zero Dependabot alerts — the last is structural, since `package.json` carries
  no dependencies at all. No Sentry project, also structural: nothing deploys here.
  **Positive control** for the two zeros: the same `gh` credential and query shape returned a
  non-empty body for pull requests 26 and 27 today (3,153 and 3,543 bytes, fetched for the
  deferral gate's release-marker test), so the issue and pull-request listings are reading a
  repository they can demonstrably see rather than failing silently to an empty list.
- **`A-2` — the drift-cycle watch — did not trigger**; there was no red to cycle.
