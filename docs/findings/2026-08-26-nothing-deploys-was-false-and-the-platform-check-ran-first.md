# "Nothing deploys" was false, and the platform check ran before the self-blame

**2026-08-26 · instrument-facing · found from an orchestrator one-grep ask**

Two findings from one thread, and the second is the one that matters for how this lane reasons.

## 1. Every push to `main` publishes — the doc said it did not

`AGENTS.md` line 9 read: **"Nothing deploys — doc/script-only; the only automation is the GitHub
Actions drift job."** Both halves are false.

The orchestrator's ask was a single grep for `do not deploy\|does not deploy\|doc-only`. **It matched
nothing.** The claim was found only because the *positive control on that grep* — `grep -c "deploy"`,
run to prove the files were actually being read — returned one hit on `AGENTS.md`, and that hit was
the claim in a wording the pattern did not cover.

That is the whole lesson of the first finding: **an absence check licenses only the pattern it ran.**
A stronger, differently-worded version of the same false claim sat one grep away, and the control run
purely to validate the instrument is what surfaced it.

### The corrected sweep found four more, and one was in TODAY'S primer

The orchestrator re-issued a wider pattern an hour later, having measured that the first one scored
**0 matches on a file carrying two live instances**. Their sentence for it is the keeper: **an
instance-shaped check is satisfied by the one instance it was built from.**

Re-run on the three named files, this lane was clean — the only hits were my own corrected lines. But
**the named file list was itself instance-shaped.** Widened to every doc an agent here actually
reads, it found the claim alive in:

- **`docs/cold-starts/2026-08-26.md` — today's primer**, the document a cold agent reads first.
- **`docs/engineering-health-review-2026-07-29.md`** — the capability table, asserting *"Auto-deploy
  on push: no — this repo does not deploy"* as an evidenced finding.
- `docs/cold-starts/2026-08-18.md`, which goes further and tells a future session **not to go looking
  for a deploy row** — the exact diagnostic step that would have caught this.
- Several daily reports, left as written.

**The dividing line is a date, and it is verifiable.** `10e1db3`, 2026-08-21, *"the spot-check page
is LIVE — review cleared, both PRs merged, Pages on."* Before it, "nothing deploys" was **true**.
After it, false. Every instance predating 08-21 was honest when written; the four that outlived it
were not swept.

**So this is the FIFTH gate-sweep failure in this repo**, after F-2's public-flip blocker, A-7's
private-repo claim, F-2's review-lane deferral and A-16's `onTrigger`. The rule those produced —
*closing a gate must include a sweep for text that cited it* — **did not fire because turning Pages
ON did not feel like closing a gate.** It was one: a condition several documents depended on stopped
holding, and nothing re-read them. The rule should be read as covering any change in a standing
condition, not only the closing of something labelled a gate.

**Treatment, which differs by document class and is deliberate:** today's primer and the standing
review are corrected in place with dated as-of notes, because they are read as current state. The
daily reports are **left exactly as written** — they are the record of what this lane believed on
each day, and silently repairing them would erase the evidence that the claim went stale at all.
That distinction is this morning's as-of rule applied to its own first real case.

Measured via the builds API rather than read off a config field — learn-the-dao's transferable rule,
that the deploys API is the only observable and the question is whether a build ROW exists:

```
gh api repos/u00dxk2/bounds-ledger/pages/builds
```

**30 consecutive rows, one per commit, doc-only commits included.** Pages is `build_type: legacy`,
source `main` at `/`, serving `https://u00dxk2.github.io/bounds-ledger/`. There are **two**
automations, not one.

The positive control is ours and unusually clean: **`1b0f85e`** touched only `CLAUDE.md`,
`continuity/items.json` and a cold-start primer — no script, no `index.html` — and produced a build
row that **failed**. A commit that supposedly could not deploy broke the deploy.

**Why the old wording was dangerous:** it is the fact an agent reaches for while diagnosing a
possibly-missing publish. "Nothing deploys" turns a stale public page into a non-event — and the
public page is this lane's only user-visible surface, the 222-row table whose per-row report links
are G-3's entire detection path.

## 2. The platform check ran BEFORE the self-blame, and it was the answer

Two consecutive Pages builds then failed (`1b0f85e` 15:04:16Z, `d3df477` 15:06:37Z) after 29
consecutive successes. The available and flattering-to-admit explanation was sitting right there:
*the failures started with my commit, so my commit broke it.*

**It was wrong.** GitHub was in a **Partial System Outage**, read directly from
`githubstatus.com/api/v2/summary.json`: `Actions = major_outage` (critical incident declared
15:11:58Z), `Pages = degraded_performance`, plus a minor services incident at 15:09:03Z.

Two corroborating observations that the outage predicts and self-blame does not:

- **`duration: 0` on both failed builds.** An instant rejection, not content processing. A markdown
  or Jekyll problem takes seconds.
- **Zero CI runs created for three pushed commits** whose SHAs match `origin` — which is also why
  `check-ci-status` returned `UNKNOWN`. Same root cause, different symptom.

`.nojekyll` is committed, and 29 prior builds of the same repo shape succeeded. Nothing about the
content changed class.

**This is the 2026-08-17 rule firing correctly.** On that day this lane blamed its own dispatch rate
for what turned out to be a GitHub outage, and wrote the rule that self-blame is still an unverified
attribution — the more dangerous kind, because nobody challenges you for blaming yourself. Today the
check ran *before* the attribution reached a commit body, a bus post or an item note. The commit that
records the deploy correction (`ff164fa`) states **"NO CAUSE IS ASSERTED"** and names the next build
as the discriminator; that was written while `d3df477` was still building, and it is left standing as
written rather than retro-edited, per the as-of rule shipped this morning.

**An instrument that failed on a class once and catches it the next time is the only evidence a fix
took.** That is what this entry records.

## What did NOT happen, deliberately

No snapshot, no drift resolution, no `workflow_dispatch` run while the incident is open. A red
arriving inside an outage window is not evidence about the records, and a dispatch would spend ~450
requests to learn nothing.

## Standing consequence

While Actions is out, **the lane has no scheduled verification** — the drift job is the whole alarm.
Local `npm run verify` is exit 0. That is a statement about this checkout, not about the world, and
it does not substitute for the scheduled run.
