# The brief check blamed the porter for a login wall

**2026-08-02** · found by the ordinary steward cadence · `scripts/check-brief.mjs`, A-12

## What happened

`npm run check` reported the hosted brief as **4 of 4 dated blocks missing**, up from 3 the day
before. The stated cause:

```
The source (docs/lane-brief.md) is ahead of the hosted page. This repo cannot fix it:
the port is the orchestrator's. Post a bus note naming the missing block(s) by date.
```

That sentence was false. The page is not stale — it is **behind a sign-in wall**, and the
checker had never seen it:

```
https://skylarkcreations.com/t/lanes/bounds-ledger
  -> 307 -> https://skylarkcreations.com/t/signin?next=%2Ft%2Flanes%2Fbounds-ledger
```

`fetch` follows the redirect, the sign-in page returns **HTTP 200**, so `res.ok` was true and the
checker happily compared our four dated blocks against the markup of a login form. Every block
was absent, so the missing-count rose to 4-of-4 — which reads exactly like "the port fell further
behind," and is the one conclusion the evidence cannot support.

Cause, confirmed in `skylark-site`: commit `53c87f83 feat(auth): Google sign-in (Supabase) human
wall for CC surfaces — PIN paths untouched`. Not bounds-ledger-specific; `/t/lanes/bank-see` and
`/t/lanes/forecast-lab` 307 identically. The wall is intentional and correct. Our reading of it
was not.

## Why it matters here

This is the lane's own founding defect, third variation:

- **2026-07-24** — the alarm could not speak (piped exit codes; green by construction).
- **2026-07-25 (A-5)** — the alarm spoke and said the wrong thing (a network flake titled `Drift:`).
- **2026-08-02** — the alarm spoke confidently about a page it never received.

A-12's escalation clause says: *if still red after 2026-08-07, escalate to David as a real blocker
(an outward artifact wrong for two weeks), naming the missing blocks by date.* Following that
clause on this evidence would have delivered a **false accusation to the orchestrator**, in a lane
whose entire product is not making claims it hasn't checked. The staleness is probably still real
underneath — it was real on 8/01 — but "probably still true underneath" is not a verified claim,
and this ledger does not ship those.

The mis-attribution also came with a monotonic-looking signal (3 → 4 missing) that invited exactly
the wrong story. A number that moves in the expected direction for an unexpected reason is worse
than no number.

## The fix

`check-brief.mjs` now establishes that the response **is the brief** before assessing staleness,
by testing for the source's own H1 — derived from `docs/lane-brief.md`, never hardcoded, per the
rule that burned the two hand-checks (a check that inherits its search term from a doc can only
confirm that doc). Absent title → new **exit 3**, `BRIEF UNVERIFIABLE`, naming the redirect target
when there is one, and explicitly stating that this is *not* evidence the re-port is behind.

Verdict logic was split into a pure `assess()` so every branch is reachable without a network;
`--selftest` covers in-sync / stale / wall / wall-behind-redirect, plus a guard asserting the wall
verdict never contains `BRIEF STALE` or blames the port.

Generalises past the login wall: a 404 shell, a renamed route, or a wrong-page port all now report
"not the brief" instead of manufacturing staleness.

## Both sides, demonstrated (W-4 / KP-78)

**Fires** — live production:

```
BRIEF UNVERIFIABLE — the response from https://skylarkcreations.com/t/lanes/bounds-ledger is not the brief.
  the source's title ("A record that moved, and a page that didn't") is absent from what came back
  the request was REDIRECTED to https://skylarkcreations.com/t/signin?next=%2Ft%2Flanes%2Fbounds-ledger — a wall, not a stale port
exit: 3
```

**Stays silent** — the *identical* captured sign-in HTML with only the brief's H1 prepended, so the
sole difference is the thing the gate tests:

```
BRIEF STALE — 4 of 4 dated block(s) missing from https://skylarkcreations.com/t/lanes/bounds-ledger
  MISSING  Sent — 24 July 2026
  ...
exit: 1
```

That second run is the load-bearing one. A gate that swallowed the stale verdict would pass
"can it fire" while blinding the alarm it lives inside — W-4's second question, not its first.
Mutation proved landed with `git diff --numstat` (102/19 on `check-brief.mjs`) before either
result was believed.

## Free second result: A-8's ratchet caught this one in production

Adding `check-brief.mjs --selftest` to `npm test` *without* a CI step failed immediately:

```
AssertionError: self-test(s) run by `npm test` but absent from the workflow — unguarded in CI:
node scripts/check-brief.mjs --selftest
```

That guard was built on 2026-07-31 against a fixture. This is its first fire against a real
newly-added self-test, and it named the exact offender. CI now runs 4 self-tests across 8 steps.

## What is still open

**A-12 is not resolved and its clock is not reset.** What changed is that we no longer know the
page is stale — we know we cannot read it. Two separate questions now go to the orchestrator:

1. Is `/t/lanes/*` meant to be gated? If yes, the brief is no longer readable by an unauthenticated
   check, and A-12's `closeWhen` ("check-brief.mjs exits 0 against production") is unreachable as
   written — the item needs re-scoping, not escalating.
2. Independently: are the four dated blocks ported? Unknown since 8/01, and only someone who can
   authenticate can answer it.

Do **not** escalate A-12 to David on 8/07 as "an outward artifact wrong for two weeks" until (1) is
answered. The honest escalation, if one is owed, is that we lost read access to our own outward
artifact — a different problem with a different owner.
