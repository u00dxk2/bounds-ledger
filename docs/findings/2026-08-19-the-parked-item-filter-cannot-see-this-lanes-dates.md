# The "deliberately parked" filter cannot see this lane's dates — 2026-08-19

**Class: measurement fit.** Not a defect in this repo. A defect in a fleet instrument that reads
this repo, found by checking a number instead of acting on it.

## What the number said

Today's kickoff carried, in its own machine-read State block:

```
stale-actionable (7d): 5 · threshold >3 = real P4 forced-decision pass
```

Five open items with no linked commit in seven days, and a documented threshold that turns five
into an owed forced-decision pass. The endpoint returns the five with `"filteredCount": 0`.

`filteredCount` is not decoration. Its interface doc in `skylark-site/src/lib/continuity-endpoints.ts`
says it counts the items **excluded** from the result because they are *"deliberately parked, not
actionably stale."* Zero exclusions means: the endpoint looked for parked items among these five
and found none.

## What is actually true of the five

| Item | Days stale | Why it has no commits |
|---|---|---|
| `W-3` | 24 | Waiting on a reply from a third party who may never send one. `expectedSignalBy` **2026-09-24**. |
| `W-6` | 9 | A read window whose own title says the clock does not start yet. `expectedSignalBy` **2026-11-06**. |
| `A-9` | 21 | Titled *"fix-on-touch, **not scheduled work**"*. |
| `A-7` | 9 | Open on R7 alone — a **fleet-owned** sweep, not ours to move. |
| `G-2` | 9 | A goal. Goals do not accrue daily commits. |

Every one of the five is an item whose **correct state is no activity**. Two of them are parked by
an explicit future date, months out. The instrument built to notice exactly that reported zero.

## Why the filter cannot fire

`hasFutureDateInCloseWhen`, `continuity-endpoints.ts:523`:

```ts
const text = `${continuityFieldText(item.closeWhen ?? item.closedWhen)} ${item.notes ?? ""}`;
```

It scans two fields. Measured against this lane's ledger, both are empty:

```
W-3  notes=UNDEFINED  expectedSignalBy=2026-09-24  futureDatesInCloseWhen=[]
A-9  notes=UNDEFINED  expectedSignalBy=-           futureDatesInCloseWhen=[]
A-7  notes=UNDEFINED  expectedSignalBy=-           futureDatesInCloseWhen=[]
W-6  notes=UNDEFINED  expectedSignalBy=2026-11-06  futureDatesInCloseWhen=[]
G-2  notes=UNDEFINED  expectedSignalBy=-           futureDatesInCloseWhen=[]
```

Two independent misses, and either alone is sufficient:

1. **`item.notes` is undefined on all 14 open items.** This lane writes prose into `note`, `note2`
   … `note9` — singular, numbered. The filter reads the plural `notes`. Half its input is
   permanently the empty string here.
2. **`expectedSignalBy` is never consulted**, and it is the field this lane actually parks items
   in. Nine of fourteen open items carry one. `closeWhen` carries **zero** future dates across all
   five flagged items.

So `filteredCount: 0` is not an observation about these items. It is structural: no item in this
lane can ever be excluded as parked, whatever its dates say.

## Why it matters more than five rows

This is the lane's founding defect wearing a different hat. A drift alarm that cannot go red is
decoration; an exclusion filter that cannot exclude is the same object. The number it produces is
not *wrong by five* — it is incapable of being right, and it sits directly upstream of a
documented threshold that converts it into owed work. A lane whose open items are mostly watches on
third parties, fleet-owned dependencies and explicit fix-on-touch backlogs will trip that threshold
every single day, forever, and each day's forced-decision pass will re-derive the same answer:
keep waiting.

That is how an alarm teaches the next reader to ignore it — the precondition for missing a real one.

## The fix, and the half of it to refuse

Read the **typed** field. One clause:

```ts
const parkedUntil = typeof item.expectedSignalBy === "string" ? item.expectedSignalBy : "";
const text = `${continuityFieldText(item.closeWhen ?? item.closedWhen)} ${item.notes ?? ""} ${parkedUntil}`;
```

**Do not also widen the scan across the `note*` prose family**, which is the obvious larger fix and
is worse. Those fields are narrative: `W-3.signalNote` alone mentions two dates, and A-20's note
argues about a future review. Any stray future date anywhere in the prose would park an item that
is genuinely neglected — converting a false-positive alarm into a false-negative silence, which is
the strictly more dangerous direction. `expectedSignalBy` is typed, singular, and means exactly
"parked until"; the prose means nothing in particular.

Smaller, and strictly more correct than the change it is tempting to make instead.

## Scope

`continuity-endpoints.ts` is **skylark-site's**, not ours, and it is a trusted-print instrument —
its number is believed by a later reader and feeds a threshold. Proposed upward in today's P1,
tracked here as **A-21**; not shipped from this lane. What this lane owns is the observation and
the evidence.

## Both answers, before anyone believes this

The claim "the filter cannot see our dates" is an **absence** claim, and this repo's own rule says
an absence claim needs a positive control naming what the same read *did* find. It did:
`futureDatesInCloseWhen=[]` was produced by the same scan, over the same items, that returned
`expectedSignalBy=2026-09-24` for W-3 and `2026-11-06` for W-6 — non-empty, correct, and from the
fields the filter ignores. The scan was working; the filter was pointed elsewhere.

## Method note

The route to this was checking a number rather than acting on it. The kickoff's instruction was to
run a forced-decision pass because five exceeded three. Both halves of the shortest path — run the
pass, or wave the five through as "all parked, fine" — end with the instrument un-examined and
firing again tomorrow.
