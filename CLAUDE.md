# CLAUDE.md — bounds-ledger

Project-specific guidance. The global `~/.claude/CLAUDE.md` still applies (MT dates, secrets, task-completion docs step). Start each session with the cold-start primer at `docs/cold-starts/<today-MT>.md`, then `continuity/items.json`.

## What this lane is

A **steward** of drifting mathematical records: a reproducible, continuously re-verified ledger that alarms when a cited record (bound / constant / certificate) drifts. Not a record-search engine. Full thesis in `README.md`. Pre-launch, **lite rail**.

## Commands

```
npm test              # network-free self-tests (reverify matcher + claim matcher) — fast, deterministic
npm run check         # LIVE checks (hits the network): mirror diff + cross-surface claim re-verification
node scripts/reverify.mjs --check        # re-fetch adopted surface, diff vs ledger copy; exit 1 on drift
node scripts/reverify.mjs --snapshot     # refresh the ledger mirror from upstream HEAD (see discipline below)
node scripts/check-claims.mjs            # re-verify every pinned claim across its cited source
```

No dependencies — Node stdlib + `fetch` only. `npm install` is a no-op.

## Conventions (the load-bearing ones)

- **Curated vs live records: track both, labeled, NEVER blend.** A live/leaderboard claim graduates to the curated column only via a checkable construction or acceptance into a curated source. (Reconciliation #1 finding 3.)
- **A `manual: true` claim reports UNVERIFIED, never green.** When a source blocks automated fetch (erdosproblems.com 403s bots), the checker cannot re-run it, so it stays UNVERIFIED until a human re-verifies. A done-click or hand-verify does not flip it green — that is the "never silently trusted" rule made mechanical.
- **Snapshot-on-drift discipline.** A red `reverify` run is the alarm, not a bug — records are *supposed* to move. Only re-`--snapshot` after verifying the change against **primary sources**, then commit the updated mirror deliberately. Never snapshot just to silence the alarm.
- **Outward gate.** Any upstream contact (PR, correction, email) or the public-repo flip goes through the **adversarial refute-it review first** (portfolio standing rule), and the actual send is **David-gated**. Never contact a maintainer or flip the repo public on your own.
- **No self-rating.** Lite rail has no self-rating/audit contract. Write the daily report + run the presence linters; skip `/daily-close` scoring.
- **MT for human labels** (commits, file slugs, doc headers, `docs/cold-starts/<MT-date>.md`); UTC only for cross-system timestamps (bus, git `%ai`, logs).

## Layout

- `continuity/items.json` — the item ledger (IDs: `G-` goal, `A-` active, `W-` watch). The source of truth for what's open.
- `docs/reconciliations/` — resolved record discrepancies (the lane's method template lives in #1).
- `docs/findings/` — smaller verified catches.
- `docs/decisions/` — filed decisions awaiting a gate (e.g. A-3's report-upstream draft).
- `docs/daily/<date>-prelaunch.md` — daily reports (needs §3a YAML frontmatter — the r8 linter FAILs without it).
- `docs/cold-starts/<MT-date>.md` — next-agent primer.
- `ledger/teorth-optimizationproblems/` — machine **mirror** of the adopted surface (109 files) + `manifest.json` pinning the upstream sha. **Do not hand-edit**; refresh only via `--snapshot`.
- `ledger/claims.json` — claim-level value pins (source URL + exact expected string per published claim).
- `scripts/` — `reverify.mjs` (mirror diff), `check-claims.mjs` (cross-surface claim check), `*.test.mjs` / `--selftest` (network-free).

## Gotchas

- **erdosproblems.com 403s automated fetch.** Re-verifying it needs David's browser; the value can reach you via a screenshot he attaches to a board card (the orchestrator reads it off local disk). Don't substitute a bot fetch — a 403 proves nothing.
- **LF→CRLF git warnings on Windows are benign** — ignore them on commit.
- **The mirror diff only sees changes *inside* the adopted repo.** Cross-surface divergence (the lane's founding finding) is caught by `check-claims.mjs`, not `reverify.mjs`. Both run in CI.
