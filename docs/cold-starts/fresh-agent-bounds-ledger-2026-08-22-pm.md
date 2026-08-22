# Fresh-agent prompt — bounds-ledger, 2026-08-22 PM

Paste this whole file. Build ONE user-visible change. No ledger housekeeping.

## Goal, in one sentence

**Let a visitor see which tracked records moved MOST RECENTLY, without reading all 111 rows.**

What a user sees differently: the page at `https://u00dxk2.github.io/bounds-ledger/` already shows,
per row, the date its pinned row last changed — but finding what moved this month means scanning
every row. After this, recently-moved rows are reachable in one action.

**Why not more work on today's "looks wrong?" link:** it shipped hours ago (`1995839`) with zero
usage signal, so iterating on it is guessing; this answers a question the page already holds data
for. If the orchestrator prefers the reporting surface, that is a fine redirect — switch.

## Great version, then the floor

**Great:** the page opens on a "moved recently" view — changed in the last 90 days, newest first,
the rest one click away.
**Floor you will actually ship:** a sort-or-filter control surfacing recently-changed rows in the
existing table, reusing the client-side filter pattern already there. If the floor lands cleanly
and time remains, move toward the great version.

## Scope — FROZEN

IN: `scripts/render-site.mjs`, its selftest, the regenerated `index.html`, a rotation note in
`docs/key-user-flows.md`.
OUT: the claims ledger, the mirror, CI workflows, the README, today's report-an-error link,
anything in `continuity/`. **No new dependency** — the repo has zero and that does not change.

## Freeze check

**None.** No measurement freeze covers this surface; traffic is ~4 unique viewers/14 days, far
below any experiment threshold, so there is nothing to confound.

## Read first (in order)

1. `docs/cold-starts/2026-08-23.md` — state, traps, the verified first-action command. Read it
   even though it is dated tomorrow.
2. `CLAUDE.md` — the rules that will bite you.
3. `scripts/render-site.mjs` — what you are editing; read its selftest at the bottom too.
4. `index.html` — the artifact. **Read it before planning against it.** Today a named ship rested
   on a false claim about this exact file that nobody had checked.
5. `docs/key-user-flows.md` — F-2 is the flow; rotation 3 is today.

## Gates and ordering

```
node scripts/render-site.mjs --selftest    # both answers
node scripts/render-site.mjs               # regenerate index.html
npm run verify                             # exit 0 required
```

**commit → gates → push → read CI → post.** The gates run AFTER your last commit: the bus refuses
the day's post unless a verify receipt exists at your current HEAD.

## ⛔ Do NOT touch

- `ledger/**` (machine mirror; only `--snapshot`) and the `generated: true` pins in `claims.json`.
- `C-7` / `C-9`, the two `manual: true` erdosproblems pins — UNVERIFIED forever is correct.
  Automating them has been tried; CI went red in four minutes.
- The README state block between its HTML-comment markers — generated.
- Anything making the page assert which row is "the record". Pins assert LISTING POSITION only.
  That is the one claim this page must never make.

## Prove your detector both ways

Any test must FIRE when the condition is present and stay SILENT when absent, demonstrated at
write time, with the mutation proven to land (`git diff --numstat`) before you believe a result.
Files are CRLF, so a `\n` pattern silently no-ops. Gate every "X is absent" assertion behind a
positive control that there IS output — an empty string satisfies every `doesNotMatch`.

## Measurement hook — below the floor, and say so

4 unique viewers/14 days against a 30-arrivals/7-day bar: no readable cohort, and do not invent
one. The observable if it worked: a visitor arriving with a constant in mind reaches a moved row
without scrolling the full table. Nothing is observable at N≈0 arrivals/day — ship on judgment and
write that sentence honestly.

## Post the result

Run `agent-status.mjs` once with `--validate` first (runs the whole chain, posts nothing), then for
real: `--project bounds-ledger --msg-type task-complete --urgency low --posted-by <model>-bounds-ledger
--title "<what shipped>" --body-file <path> --codex-calls <N>`. End the body exactly:

`USER-VISIBLE: <what a user sees differently, one clause> — <SHA>`

Keep a filename either inside a `[linter-report]` quote or off a commit sha's line — a filename
beside a sha reads as a modification claim, and that breadth is intended.
