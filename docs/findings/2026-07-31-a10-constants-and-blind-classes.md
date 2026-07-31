# A-10: latency-derived constants inventory + detector blind-class sweep (2026-07-31)

**Trigger:** orchestrator P2 rider, 2026-07-31 — *"a threshold derived from a measurement of the old regime
silently keeps reading as authoritative after the regime changes,"* prompted by frame-dial's stale build fence
and agentic-news's structurally-blind hook canary. Run early at David's request rather than deferred.

## Headline

**Constants: zero stale, and the rider's specific regime change cannot reach this lane.** Every constant here
was checked; none was measured against model latency, because **this lane makes no LLM calls at all** (verified
this morning for the model audit — every provider-name hit in the repo is mirrored upstream *content*, not our
code). The 7/30 fleet model swap changed nothing measurable here.

**The value was in step 4, not step 1.** The pass-3 sweep found **two real blind classes** in the lane's two
production detectors — one of them a surviving instance of a defect inside a finding that was closed as fixed.

## Step 1–2 — constant inventory (7 candidates, all checked)

| # | Constant | Where | Measurement or policy | Measured against what → what is it now | Verdict |
|---|---|---|---|---|---|
| 1 | `CHUNK = 10` | `reverify.mjs:42` | **measurement-shaped** — fetch concurrency sized to a service's tolerance | Undocumented: no date, no source, no recorded observation. Behavior now: 110 files fetch clean daily, no 429s in any run to date | **Not stale, but undated.** No observable state to re-key to → annotated in place |
| 2 | `cron: "17 9 * * *"` | `reverify.yml:4` | **policy** — an arbitrary daily slot | Not derived from any measured duration; nothing downstream is spaced against it | Not a measurement |
| 3 | `node-version: 22` | `reverify.yml:20` | policy — version pin | — | Not a measurement |
| 4 | `actions/checkout@v4`, `setup-node@v4` | `reverify.yml:17-18` | policy — floating major pins (already tracked as A-9/R13) | — | Not a measurement |
| 5 | `title=${title:0:240}` | `reverify.yml:86` | **external limit with margin** — defensive truncation under GitHub's issue-title cap | The cap is GitHub's, not ours, and did not move | Not stale |
| 6 | `SKIP = new Set(["1b.md"])` | `extract-pins.mjs:31` | policy — hand-pinned as C-1/C-3 | — | Not a measurement |
| 7 | **fetch timeout — ABSENT** | `reverify.mjs:29,46`; `check-claims.mjs:55,69` | the inverse of the rider's class: not a stale constant but a **missing** one | No `AbortSignal`/timeout on any fetch, so a hung upstream inherits GitHub Actions' default job cap | **Latent, not stale.** Filed, not fixed — see below |

**Counts:** 7 inventoried · **0 stale** · 0 re-keyed to state · 0 re-numbered · **0 load-bearing on a
send/publish/customer path** (this lane has no send path; its only outward artifact is a GitHub issue the alarm
files, and no constant gates it).

On #7: a hung fetch would burn runner time and leave the alarm reporting nothing while looking in-progress.
It is not urgent — the cron is 24h apart so runs cannot overlap — and adding a timeout is a new failure mode
that would need its own KP-78 both-sides demo. Filed rather than fixed mid-sweep.

## Step 4 — pass-3 blind-class sweep (the substantive finding)

W-4/KP-78, filed this morning, asks *can this instrument fire at all*. Pass-3 asks a **different and sharper**
question: *can it report the condition it exists to detect* — agentic-news's canary could fire; it just could
never see a cliff. Both detectors here pass KP-78 and **both have a blind class**.

### BC-1 — `reverify.mjs`: fires with an empty body on set-identical changes · **FIXED**

`lineDiff` is an order-insensitive line-**set** diff (`reverify.mjs:63`, and the comment says so). A change that
preserves the line set — a **row reorder**, or a duplicated/deduplicated line — makes `a === b` false, so the
alarm fires, but `removed` and `added` are both empty, so the report body is **blank**.

Demonstrated by execution (swapped two adjacent data rows in a copy of `10a.md`):

```
CHANGED constants/10a.md

1 file(s) drifted.
```

That is **A-5's defect** — an alarm that fires with no stated reason — surviving inside the finding that closed
A-5. And it is not cosmetic here: **row order is load-bearing**, because the generated pins assert the
LAST-LISTED row of each table. A reorder changes what 218 of our own pins mean while the report says nothing.

**Fixed** (`reverify.mjs`): when the line set is unchanged, the report now says so and names the consequence.
Both sides demonstrated per W-4:

```
FIRE   (pure reorder)
CHANGED constants/10a.md
  (line SET unchanged — rows REORDERED or a line duplicated/deduplicated;
   the set-diff cannot show which. Row order is load-bearing: generated pins
   assert the LAST-LISTED row. Diff this file against the mirror by hand.)

SILENT (ordinary value change — note must NOT appear)
CHANGED constants/10a.md
  - …Israel J. Math. **19** (1974), 271–276.
  + …Israel J. Math. **19** (1974), 271–277.
grep -c 'line SET unchanged' → 0
```

### BC-2 — `check-claims.mjs`: structurally cannot see an ADDITION · **NAMED, not fixed**

`holds()` is a presence test, so the checker can only ever see a pin **disappear**. If a source keeps the
pinned text and **adds a new, better bound below it**, every claim still holds and the run is green.

- **Covered** for the 218 generated pins: their sources are mirrored, and `reverify.mjs` reports any added line.
- **Not covered** for the six off-mirror claims — **C-4/C-5** (arXiv), **C-6** (Wikipedia), **C-7/C-9**
  (erdosproblems.com), **C-8** (`teorth/erdosproblems`) — where `check-claims` is the **only** instrument.

"A new record appeared alongside the old one" is this lane's **north-star event**, and on exactly those six
surfaces nothing can report it. This is the agentic-news canary shape precisely: fires in one direction,
structurally incapable in the other.

**Named in the instrument** per the rider's step 4 — a comment on `holds()` scoping the blindness, plus a
selftest assertion that pins it:

```
assert(holds("upper bound 0.380868\n| $0.379005$ | [NEW2026] |", "0.380868"),
  "BLIND CLASS: an added better bound leaves the pin green — this checker cannot see additions");
```

**That test passing is the defect, not the fix.** It exists so the shape cannot be forgotten.

**Not fixed, deliberately.** The remedy is a design question — byte-mirror those six sources (A-6 territory,
and erdosproblems.com is the CI-blocked one), or pin a negative ("no row below the cited one"), or accept it
and say so. That is a David/orchestrator call, not a threshold tweak I should make unilaterally mid-sweep.

## What generalizes

- **A lane with almost no constants can still be full of the rider's actual disease.** Steps 1–3 returned zero
  stale in fifteen minutes; step 4 found two real defects. For detector-heavy projects, run the blind-class
  sweep first — the constants inventory is the cheap half, not the valuable half.
- **"Can it fire?" and "can it see the failure that matters?" are different questions**, and passing the first
  says nothing about the second. Both detectors here passed KP-78 this morning and both are blind to a class of
  event this lane exists to catch.
- **A closed finding is not a closed defect class.** A-5 was closed as fixed; its exact failure mode was still
  reachable through a different input shape. Worth re-checking closed findings by input class, not by title.
