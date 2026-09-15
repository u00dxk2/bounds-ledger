# A-43 asserted two incompatible states about the same work, and the false one was the one a cold agent acts on first

> **⚠ PARTLY SUPERSEDED THE SAME DAY (P3, 2026-09-15). The contradiction below is real and stays fixed; the conclusion that the one-cell correction is "the supported report shape" does not survive.** Haugland's own abstract states the bound as "0.380926...", so upstream's 0.380926 is the source's abstract figure with the ellipsis dropped. That fits "quote the source's own figure", the very convention the lookups found. This ledger already pinned the abstract figure (hand claim C-4), and on 2026-07-23 it wrote of the identical ellipsis-dropped form on Wikipedia: "Strictly, 0.380926 alone is not a valid upper bound (the proved bound exceeds it), but as citation shorthand it's common." — and declined to act, calling a Wikipedia edit "outward contact for a cosmetic nuance — low value, skipped." Neither was accounted for here. Current state: the SECOND CORRECTION paragraph at the top of `A-43.onTrigger`, and the H2016 entry in `continuity/depth-audit.json` (verdict UNRESOLVED).

**Found 2026-09-15 (P2), by a session that was parked before it could apply the fix.** The three corrected field texts are at the bottom of this file, ready to apply verbatim. Applying them is the first thing the next session should do — until then, A-43 will re-misread itself.

## The contradiction

`A-43.lookups2026_09_05` records all four neighbouring-row lookups as DONE, each with the source read and a named positive-control token proving the artifact.

`A-43.disposition2026_09_12`, written seven days later, says **"THE FOUR LOOKUPS ARE STILL OWED"** and re-dated `expectedSignalBy` from 2026-09-12 to 2026-09-15 on that basis.

## Which is true

```
git log -S 'FOUR LOOKUPS DONE 2026-09-05' --format='%h %ai %s' -- continuity/items.json
a3bd3fa 2026-09-05 11:00:19 -0600 The four lookups, and the fork A-43 registered was a false dichotomy
```

Exactly one commit. The lookups were done and committed on 2026-09-05, seven days **before** the disposition that declared them owed — and `a3bd3fa` was already listed in A-43's own `linkedCommits` when that disposition was written.

`disposition2026_09_12` is false. It cost the row three days of its clock, waiting for work that was finished and committed.

## Mechanism — the stale imperative outranked the fresh evidence

`onTrigger` said "On 2026-09-12 do the four lookups" and was never updated when they were done. The evidence of completion went into a **new** field (`lookups2026_09_05`) while the **order** stayed put. A disposition pass reading a row top-down hits the order before the evidence, and the order is phrased as an imperative while the evidence is phrased as a narrative. The imperative wins.

`closeWhen` was stale the same way, and worse: its second closing branch was "the four neighbouring rows have been checked … and the row closes with the finding that the column's convention is uniform" — a branch **refuted by the very check it asked for**. The convention is not uniform truncation; it is "quote the source's own figure".

Both fields now carry their correction at the TOP, where a top-down reader cannot miss it — the same reasoning A-17's `onTrigger` marker uses.

## What the four lookups actually established

Upstream truncates nothing. Four of the five recent rows have a source stating exactly six decimals. H2016 is the **only** row whose cited source gives full precision (0.3809268534330870), so it is the only cell where upstream must *choose* a rendering — and on 2026-09-05 that choice moved from the round-up (bound-safe, since rounding an upper bound up preserves validity) to the round-down, which sits strictly below the proved value and so is not a valid upper bound at the precision shown. The convention did not change; the one cell where the convention is silent flipped direction.

So the one-cell correction is the supported report shape and the convention-note shape is dead. **A-43 is decision-ready and `note3`'s gate condition is met** — it said this goes to David "WITH the four lookups done, or not at all", and they are done. Owed: a one-cell correction draft for `constants/1b.md`, the adversarial refute-it review, then David for the send decision.

## The bigger gap this exposed — owner A-47, not A-43

The H2016 row has **no entry** in `continuity/depth-audit.json`. The five 1b entries (`A-47-0014` … `A-47-0018`) cover the four neighbours plus one dead reference entry; the two that mention 0.380926/0.380927 do so only as context in their `notes`.

Those entries say, in their own `fetchedAt`, that they were "transcribed into this store 2026-09-13 from A-43.lookups2026_09_05" — so the transcription pass carried the four neighbours and dropped the one row the investigation started from.

Consequence on our only user-visible surface: `c/1b.html` lists four read rows and states **"A row not listed here has NOT been checked"**. Our own page therefore implies the most-examined row in this ledger is unexamined — and yesterday's P3 (`433282c`, "the index says which rows we actually opened the paper for") shipped that render with the gap already in it.

The fix: a depth-audit entry for the H2016 row — its source, arXiv:1609.08000, was read 2026-09-05 with "minimum overlap" (7 occurrences) and "Haugland" (4) as positive controls in the same fetch — marked `selection: suspicion` so it stays out of the systematic coverage rate, then re-render.

## Why `expectedSignalBy` was not pushed forward again

It was due that day, not overdue, and the day was not over. The row had already been re-dated once on a false premise; re-dating it a second time during a continuity phase would have deferred that day's assigned work and would have looked, correctly, like drift.

---

## The three corrected field texts, ready to apply

Apply from this file with `continuity-edit`, one call each:

```
node ../skylark-site/scripts/continuity-edit.mjs --set A-43 --field onTrigger    --value-file <extracted onTrigger text>
node ../skylark-site/scripts/continuity-edit.mjs --set A-43 --field closeWhen    --value-file <extracted closeWhen text>
node ../skylark-site/scripts/continuity-edit.mjs --set A-43 --field disposition2026_09_15 --value-file <extracted disposition text>
```

A note for whoever applies them: on 2026-09-15 a `--set A-43 --field disposition2026_09_15 --value probe --dry-run` was **accepted**, printing `before: {"disposition2026_09_15":null}`. The fleet's reported "continuity-edit refuses date-suffixed fields" did not fire for `--set` on this store, so that field name should write cleanly. `--mint` was not tested.

### onTrigger

```text
CORRECTED 2026-09-15 — THIS FIELD'S ORDER WAS ALREADY CARRIED OUT AND THE FORK IT DESCRIBES IS REFUTED. Read this paragraph before acting on anything below it.

The four lookups this field ordered were DONE on 2026-09-05 and committed in a3bd3fa ("The four lookups, and the fork A-43 registered was a false dichotomy") — a sha already sitting in this row's own linkedCommits. They are recorded in full, with a per-source positive control naming a token that proves the artifact, in the lookups2026_09_05 field. DO NOT RE-RUN THEM. The disposition2026_09_12 field says "THE FOUR LOOKUPS ARE STILL OWED"; that sentence is FALSE and cost this row three days — see disposition2026_09_15 for how it happened.

NEITHER BRANCH OF THE REGISTERED FORK IS THE ANSWER. Upstream truncates nothing: the column's convention is "quote the source's own figure", and four of the five recent rows have a source that states exactly six decimals. H2016 is the ONLY row whose cited source gives full precision (0.3809268534330870), so it is the only cell where upstream must CHOOSE a rendering — and on 2026-09-05 that choice moved from the round-up (bound-safe, because rounding an upper bound up preserves validity) to the round-down, which sits strictly below the proved value and so is not a valid upper bound at the precision shown. The convention did not change; the one cell where the convention is silent flipped direction.

THE NEXT STEP IS A DECISION, NOT A DIG, AND note3's GATE CONDITION IS NOW MET. note3 withheld this from David because the fact that decides between the two report shapes had not been looked up, and said it goes to him "WITH the four lookups done, or not at all". They are done. What is owed is a one-cell correction draft for constants/1b.md, through the adversarial refute-it review, then David for the send decision. Nothing is sent on this row's own authority.

A SECOND CORRECTION IS AVAILABLE IN THE SAME FILE and is smaller and far less arguable than the rounding one: upstream's [YKLBMWKCZGS2026] reference cites test-time-training.github.io/discover.pdf, which is DEAD — GitHub Pages' "Site not found", served as HTTP 200 with a ~9 KB body, so a reader following the citation reaches nothing and a naive checker reads 200 as success. The paper itself sits at arXiv:2601.16175v2. Draft it with the rounding correction or split it deliberately; do not let it ride along unnoticed.
```

### closeWhen

```text
CORRECTED 2026-09-15. The previous text offered two closing branches and its second one — "the four neighbouring rows have been checked against their sources and the row closes with the finding that the column's convention is uniform and no report is warranted" — is REFUTED BY THE CHECK IT ASKED FOR. The four rows were checked (2026-09-05, a3bd3fa, recorded in lookups2026_09_05); the column's convention is not uniform truncation but "quote the source's own figure", and under that convention the H2016 cell is the single row where upstream must choose a rendering and chose one that is not bound-safe. So there is no uniform-convention finding to close on, and closing on it now would be closing on a premise this row's own evidence killed.

This row CLOSES when a one-cell correction to constants/1b.md has passed the adversarial refute-it review and reached David for the send decision — or when a review REFUTES the correction and that refutation is written down, which is also a close. It does NOT close on further lookups: the research leg is finished and re-opening it is the failure mode this row now exists to prevent, the mirror image of the one it was created to prevent.
```

### disposition2026_09_15

```text
CONTRADICTION FOUND AND RESOLVED AT ROW LEVEL (P2, 2026-09-15). This row asserted two incompatible states about the same work, and the false one was the one a cold agent would act on first.

WHAT THE ROW SAID. lookups2026_09_05 records all four neighbouring-row lookups as DONE, each with the source read and a named positive-control token. disposition2026_09_12, written SEVEN DAYS LATER, says "THE FOUR LOOKUPS ARE STILL OWED" and re-dated expectedSignalBy from 2026-09-12 to 2026-09-15 on that basis, stating as its reason that the lookups are "source-reads of exactly the kind A-47's depth audit performs" and should not be rushed alongside that day's ship.

WHICH IS TRUE, AND HOW IT WAS SETTLED. `git log -S 'FOUR LOOKUPS DONE 2026-09-05' --format='%h %ai %s' -- continuity/items.json` returns exactly one commit: a3bd3fa, 2026-09-05 11:00:19 -0600, "The four lookups, and the fork A-43 registered was a false dichotomy". The lookups were done and committed seven days BEFORE the disposition that declared them owed, and a3bd3fa was already listed in this row's linkedCommits at the time that disposition was written. disposition2026_09_12 is wrong.

COST. Three days of this row's clock, spent waiting for work that was finished and committed. Not a missed catch — a row that deferred itself on a false reading of its own contents.

MECHANISM, because the class matters more than the instance. The stale instruction outranked the fresh evidence. onTrigger said "On 2026-09-12 do the four lookups" and was never updated when they were done; the evidence of completion went into a NEW field (lookups2026_09_05) while the ORDER stayed put. A disposition pass reading top-down hits the order before the evidence, and the order is phrased as an imperative while the evidence is phrased as a narrative. Both onTrigger and closeWhen have now been corrected in place rather than left to be re-misread, and each carries its correction at the TOP of the field where a top-down reader cannot miss it — the same reasoning A-17's onTrigger marker uses.

WHY THE SIGNAL DATE WAS NOT PUSHED FORWARD AGAIN. It is due TODAY, not overdue, and the day is not over. This row has already been re-dated once on a false premise; re-dating it a second time during the continuity phase would defer the orchestrator's own Section-A assignment for today and would look, correctly, like drift. The row is handed on decision-ready with its next action named: draft the one-cell correction, adversarial review, then David.

WHAT THIS EXPOSED ELSEWHERE, and it is the bigger finding. The H2016 row — the cell this entire row is about, whose cited source (arXiv:1609.08000, proving 0.3809268534330870) was read on 2026-09-05 with "minimum overlap" and "Haugland" as positive controls in the same fetch — has NO entry in continuity/depth-audit.json. The store's five 1b entries (A-47-0014 through A-47-0018) cover the four NEIGHBOURS and one dead reference entry; both entries that mention 0.380926/0.380927 do so only as context in their `notes`. Those entries were, by their own fetchedAt text, "transcribed into this store 2026-09-13 from A-43.lookups2026_09_05" — so the transcription pass carried the four neighbours and dropped the one row the investigation started from. Consequence on the public surface: c/1b.html lists four read rows and states "A row not listed here has NOT been checked", so our own page implies the most-examined row in this ledger is unexamined. Owner is A-47, not this row; recorded here because this row is where the evidence lives.
```
