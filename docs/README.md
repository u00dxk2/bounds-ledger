# docs — index

Every document in this folder, with one line on what it is for. Agents start at `../AGENTS.md`; this index is for finding the rest.

## Start here (agents)

1. `../AGENTS.md` — the invariants and commands every agent follows (loaded every session).
2. `../CLAUDE.md` — Claude-specific conventions and the reasons behind the invariants (Claude only).
3. `cold-starts/<latest MT date>.md` — the latest session primer: what the next session does first.
4. `../continuity/items.json` — the open work ledger: every goal, watch and action, with its due date.
5. `daily-config.md` — the first-action block the primer copies, and what each daily report owes.
6. `gotchas.md` — before debugging anything, or before trusting a red, a green or an absence.
7. `repo-layout.md` — before touching `ledger/`, `continuity/` or `scripts/`.
8. `commands.md` — before running any per-script command or indicator.
9. `close-session-config.md` — at the close of a session.

## Files

- `commands.md` — the per-script and indicator entries moved out of `AGENTS.md` § Commands on 2026-11-04: what each script reads, what it refuses, and its exit codes.
- `daily-config.md` — configuration for the daily run: the first-action block, CI-truth reads, the deployed-sha leg, the ledger gate battery, and the lines each daily report owes.
- `close-session-config.md` — the close-session battery (`close:primer`, a clean tree, `verify`), primer generation, and the close order.
- `repo-layout.md` — what lives where in `continuity/`, `docs/`, `ledger/`, `scripts/` and `search/27b/`, and what is never hand-edited.
- `gotchas.md` — traps and the incidents behind them.
- `lane-brief.md` — the source of the David-facing brief hosted on the Skylark site; voice-linted as a whole; the orchestrator ports it.
- `key-user-flows.md` — the product flows and their dated critiques.
- `evangelism-bar.md` — the core user problem, the would-tell-a-friend moment, the product-love metric, and the evangelism passes.
- `housekeeping-ledger.md` — small itches noticed but not done, and a Done log.
- `engineering-health-review-2026-07-29.md` — a dated engineering-health review with ranked findings (historical; an open item's read command reads it by path, so it stays here).
- `arxiv-watch-reader-brief.md` — the brief for reading agents on the Ramsey-area arXiv watcher.
- `arxiv-watch-constants-reader-brief.md` — the same brief for the constants-area watcher (`arxiv-watch.mjs --area constants`).
- `agents-md-archive.md` — passages cut from `AGENTS.md` in past compressions (provenance only).
- `claude-md-archive.md` — passages cut from `CLAUDE.md` in past compressions (provenance only).
- `gap-table.json` — output of `scripts/gap-table.mjs` (the G-2 ranker); data, not prose.

## Folders

- `cold-starts/` — session primers, one per MT date (the fleet's readers pick date-named files only); `cold-starts/archive/` holds files that were never primers.
- `daily/` — daily reports, `<date>-prelaunch.md`.
- `findings/` — verified catches and instrument findings, dated.
- `decisions/` — filed decisions and reviews, dated.
- `reconciliations/` — reconciliation write-ups (#1, the method template).
- `evidence/` — screenshots cited by the daily reports of 2026-10-10 and 2026-10-11.
- `housekeeping/` — housekeeping-night inventories.
- `archive/` — retired docs kept for provenance, each with an index line.
