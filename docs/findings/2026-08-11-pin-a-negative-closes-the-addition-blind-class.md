# The ledger could not see a record being ADDED — on two sources it now can

**Date:** 2026-08-11 (MT) · **Item:** A-11 (closed by this) · **Commit:** see below

## The defect

`check-claims.mjs` asks one question per claim: *is this exact string still present at this URL?*
That is a presence test, and a presence test can only ever report a **disappearance**.

A source that keeps our pinned text and **adds a better bound underneath it** stays green forever.
A new record appearing is this lane's north-star event, so the instrument was structurally blind to
precisely the thing it exists to catch.

For the generated pins this never mattered: their sources are byte-mirrored, so `reverify.mjs`
reports any added line. It mattered for the six claims whose sources are **off-mirror**, where
`check-claims.mjs` is the only instrument — C-4/C-5 (arXiv), C-6 (Wikipedia), C-7/C-9
(erdosproblems.com), C-8 (`teorth/erdosproblems`).

The blind class was named on `holds()` and pinned by a passing selftest assertion on 2026-07-31
(A-10's P2 rider). Naming it was the minimum, not the fix.

## The fix, on the two sources where it is mechanical

A claim may now carry **`nothingAfter`**: the exact text that must still *immediately follow* its
expected string. Implemented as plain concatenation — the matcher is unchanged, only what we ask of
it is stronger. An insertion between the two breaks the pin, so the addition becomes visible.

- **C-10** — Wikipedia's minimum-overlap limit-superior table. Pins the SimpleTES `0.380868` row and
  requires the wikitext table terminator `|}` to follow it. A new record row inserted below breaks it.
- **C-11** — problem 36's entry in `teorth/erdosproblems:data/problems.yaml`. C-8 pins the entry's
  *head* (number → prize → informal_status.state) and stops before `last_update`, so a field
  **appended** to the entry is invisible to it. C-11 pins the *tail*: the `comments` + `tags` span
  must be immediately followed by the start of problem 37.

Two design choices worth keeping:

- C-11 is anchored on `comments: "minimum overlap problem"` (distinctive to problem 36) rather than
  on the `tags` line alone, so **deleting entry 36 outright cannot be masked** by a neighbour that
  happens to carry the same tags.
- C-11 deliberately skips every `last_update` field, so ordinary bookkeeping edits stay silent. That
  is the A-6 rule holding: an always-red alarm carries as much information as an always-green one.

**A negative pin still asserts LISTING POSITION, never "the record"** — the same discipline the
generated pins follow. Do not read C-10 as our assertion that `0.380868` is the true record.

## Both sides demonstrated (W-4 / KP-78)

The shipped `classify()` is exercised directly by the selftest, so the branch that ships is the
branch that gets tested — a copy of the logic in the test would prove nothing about the run.

Selftest, on a fixture with the real table's shape:

| condition | verdict |
|---|---|
| pinned row is still last | `hold` (silent) |
| a new record row inserted below it | `added` (fires) |
| the pinned row itself replaced | `gone` — an addition is never mis-reported as a deletion |
| a claim with no `nothingAfter` | behaves exactly as before; can never return `added` |

And against **live bytes**, not fixtures — both sources fetched, then a plausible entry spliced in
immediately below the pin while leaving the pinned text intact (the control aborts if the splice
does not land, per the CRLF no-op trap):

```
C-10  live source: hold   |   with an entry inserted below the pin: added
C-11  live source: hold   |   with an entry inserted below the pin: added
```

## What is still blind, and stays blind

**C-4/C-5 (arXiv prose)** — no stable structure to anchor a tail on. **C-7/C-9
(erdosproblems.com)** — the 403 surface, `manual: true`, nothing fetches it from CI at all. Those
four remain at option (c): accepted and documented. The selftest's blind-class assertion is kept,
reworded to describe them, so the remaining gap cannot be quietly forgotten either.

## Reading a break

A break on a negative pin reports **"SOMETHING WAS ADDED BELOW IT"** and says that on a record
surface this is the north-star event, not a defect. Verify against primary sources, then re-pin
deliberately — never re-pin to silence it.

## State

`231 claim(s): 229 hold, 0 broken/unreachable, 2 unverified (manual)` — up from 229/227 (the two
new claims, both holding). `extract-pins.mjs` re-run and proven to preserve them (`--numstat`:
20 lines added, 0 removed — the two claims and nothing else). 11/11 self-tests, `npm run check`
green with the pin set.
