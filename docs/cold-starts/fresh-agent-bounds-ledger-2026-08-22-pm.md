# Fresh-agent prompt — bounds-ledger, 2026-08-22 PM

Paste this whole file. You are building ONE user-visible change. Do not do ledger housekeeping.

## The goal, in one sentence

**Let a visitor see which tracked records moved MOST RECENTLY, without reading all 111 rows.**

What a user sees differently: the spot-check page at `https://u00dxk2.github.io/bounds-ledger/`
today shows 111 constants, each with the date its pinned row last changed — but the only way to
find what moved this month is to scan every row. After this build, the recently-moved rows are
reachable in one action.

**Why this and not more work on yesterday's "looks wrong?" link:** that reporting path shipped
today (`1995839`) and has zero usage signal, so iterating on it further is guessing. This ship
answers a question the page already holds the data for. If the orchestrator prefers the
reporting surface instead, that is a fine redirect — say so and switch.

## The great version first, then the floor

**Great:** the page opens on a "moved recently" view — the rows that changed in the last 90 days,
newest first, with the rest one click away; a researcher lands and immediately sees whether
anything they might cite has shifted.

**The floor you will actually ship:** a sort-or-filter control that surfaces recently-changed rows
in the existing table. Reuse the existing client-side filter pattern; no new dependency, no build
step, no framework. If the floor lands cleanly and time remains, move toward the great version.

## Scope — FROZEN

IN: `scripts/render-site.mjs` (the generator), the regenerated `index.html`, and the generator's
self-test. A rotation note appended to `docs/key-user-flows.md`.

OUT, explicitly: the claims ledger, the mirror, CI workflows, the README, the report-an-error
link shipped today, and anything in `continuity/`. No new npm dependency — the repo has zero and
that does not change.

## Freeze check

**None.** No live measurement freeze covers this surface. Traffic is ~4 unique viewers/14 days,
far below any experiment threshold, so there is nothing to confound.

## Files to read first (in this order)

1. `docs/cold-starts/2026-08-23.md` — tomorrow's primer; carries state, the traps, the verified
   first-action command. Read this even though it is dated tomorrow.
2. `CLAUDE.md` — the rules that will bite you. Non-negotiable.
3. `scripts/render-site.mjs` — the generator you are editing; read its selftest at the bottom too.
4. `index.html` — the artifact. **Read it before planning against it.** Today a named ship rested
   on a false claim about this file that nobody had checked.
5. `docs/key-user-flows.md` — F-2 is the flow; rotation 3 is today's entry.

## Gates, and the ordering

```
node scripts/render-site.mjs --selftest     # must pass, both answers
node scripts/render-site.mjs                # regenerate index.html
npm run verify                              # the whole gate; exit 0 required
```

Ordering is **commit → gates → post**, and the gates run AFTER your last commit: the bus refuses
the day's post unless a verify receipt exists at your current HEAD. Then push, read CI for that
sha, and only then post.

## ⛔ Do NOT touch

- `ledger/**` — machine mirror; refresh only via `--snapshot`, never by hand.
- The `generated: true` pins in `ledger/claims.json` — rewritten wholesale by a script.
- `C-7` / `C-9`, the two `manual: true` erdosproblems pins. They report UNVERIFIED forever and
  that is correct. Do not automate them; it has been tried and CI went red in four minutes.
- The README's state block between its HTML-comment markers — generated, not hand-edited.
- Anything that makes the page assert which row is "the record". Generated pins assert LISTING
  POSITION only. This is the one claim the page must never make.

## Prove your detector both ways

Any test you add must be shown to FIRE when the condition is present and stay SILENT when it is
absent, at write time, with the mutation proven to land (`git diff --numstat`) before you believe
a result. Files are CRLF, so a `\n` pattern silently no-ops. Gate every "X is absent" assertion
behind a positive control that there IS output — an empty string satisfies every `doesNotMatch`.

## Measurement hook

**Below the traffic floor and say so.** 4 unique viewers in the trailing 14 days against a
30-arrivals/7-day bar, so there is no readable cohort and you must not invent one. Name the
observable instead: if it worked, a visitor arriving with a specific constant in mind reaches a
moved row without scrolling the full table. Nothing is observable at N≈0 arrivals/day — ship on
judgment and write that sentence honestly.

## How to post the result

```
node ../skylark-site/scripts/agent-status.mjs --project bounds-ledger \
  --msg-type task-complete --urgency low --posted-by <your-model-id>-bounds-ledger \
  --title "<what shipped>" --body-file <path> --codex-calls <N>
```

Run it once with `--validate` first — it runs the whole pre-post chain and posts nothing. End the
body with the receipt line, exactly:

`USER-VISIBLE: <what a user sees differently, one clause> — <SHA>`

Keep a filename either inside a `[linter-report]` quote or off a commit sha's line; a filename
beside a sha is read as a modification claim, and that breadth is intended.
