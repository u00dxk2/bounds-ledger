# CLAUDE.md — bounds-ledger

Project-specific guidance. The global `~/.claude/CLAUDE.md` still applies (MT dates, secrets, task-completion docs step). Start each session with the cold-start primer at `docs/cold-starts/<today-MT>.md`, then `continuity/items.json`.

## What this lane is

A **steward** of drifting mathematical records: a reproducible, continuously re-verified ledger that alarms when a cited record (bound / constant / certificate) drifts. Not a record-search engine. Full thesis in `README.md`. Pre-launch, **lite rail**.

## Commands

```
npm test              # network-free self-tests (reverify matcher + claim matcher + pin extractor) — fast, deterministic
npm run check         # LIVE checks (hits the network): mirror diff + cross-surface claim re-verification
node scripts/reverify.mjs --check        # re-fetch adopted surface, diff vs ledger copy; exit 1 on drift
node scripts/reverify.mjs --snapshot     # refresh the ledger mirror from upstream HEAD (see discipline below)
node scripts/check-claims.mjs            # re-verify every pinned claim across its cited source
node scripts/extract-pins.mjs            # regenerate the 216 generated pins from the mirror (run after every --snapshot)
```

No dependencies — Node stdlib + `fetch` only. `npm install` is a no-op.

## Conventions (the load-bearing ones)

- **Curated vs live records: track both, labeled, NEVER blend.** A live/leaderboard claim graduates to the curated column only via a checkable construction or acceptance into a curated source. (Reconciliation #1 finding 3.)
- **A `manual: true` claim reports UNVERIFIED, never green.** When a source blocks automated fetch (erdosproblems.com 403s bots), the checker cannot re-run it, so it stays UNVERIFIED until a human re-verifies. A done-click or hand-verify does not flip it green — that is the "never silently trusted" rule made mechanical.
- **Snapshot-on-drift discipline.** A red `reverify` run is the alarm, not a bug — records are *supposed* to move. Only re-`--snapshot` after verifying the change against **primary sources**, then commit the updated mirror deliberately. Never snapshot just to silence the alarm. **Second step since 2026-07-24:** after every `--snapshot`, re-run `node scripts/extract-pins.mjs` and commit the regenerated pins — pins deliberately do NOT auto-follow the mirror, so a moved table row stays BROKEN in `check-claims` until re-pinned (the post-snapshot ratchet).
- **Generated pins assert listing position, never "the record".** The 216 generated claims pin the LAST-LISTED row of each bounds table verbatim. Do not "upgrade" them to record-row claims: numeric record-ranking is defeated by symbolic cells (`$K_{DR}+10^{-26}$`), negatives, and O(·) asymptotics (a min/max prototype mis-picked 10a/21a/41a on 2026-07-24), and auto-asserting "record" would put unverified mathematical statements in our own ledger. Hand claims (C-1…C-7) may say "record" because a human verified it.
- **Never hand David an artifact link.** `claude.ai/code/artifact/...` URLs are session-scoped and do not resolve in his browser — a brief delivered that way reads as page-not-found and the board card gets dismissed (happened 2026-07-24). David-facing briefs for lanes without their own site go on the Skylark site at `/t/lanes/<slug>`: keep the source at `docs/lane-brief.md`, post a bus note, the orchestrator ports it.
- **Audit the method sentence, not just the claim.** Any outward artifact that says "cross-checked against X" must have that sentence verified as its own review angle. On 2026-07-24 a draft claimed cross-checks against "the source-paper abstracts" when none of the three abstracts state their bounds — the phrase was inherited from an earlier, different claim and survived a 5-angle adversarial review because every angle attacked the *value*, not the *method*. A false claim about our own method is the one thing the recipient cannot check.
- **Outward gate.** Any upstream contact (PR, correction, email) or the public-repo flip goes through the **adversarial refute-it review first** (portfolio standing rule), and the actual send is **David-gated**. Never contact a maintainer or flip the repo public on your own.
- **No self-rating.** Lite rail has no self-rating/audit contract. Write the daily report + run the presence linters; skip `/daily-close` scoring.
- **Daily reports use the canonical H2 set** (adopted 2026-07-25, replacing the old numbered `## (1) …` format): BLUF / What changed / Inputs (controllable) / Outputs (lagging) / Recommendation / On hold pending data / State Appendix — BLUF first, State Appendix present. Lint with `node ../skylark-site/scripts/check-report-all.mjs docs/daily/<date>-prelaunch.md` (expect 4/4 PASS). Adopted rather than waived because a permanently-red linter gets ignored exactly like a permanently-green alarm carries no information — the lane's founding defect, applied to itself. Gloss every tracker ID on first mention per section (`W-3 — the watch on …`); `check-bare-itemids` is strict in the State Appendix.
- **MT for human labels** (commits, file slugs, doc headers, `docs/cold-starts/<MT-date>.md`); UTC only for cross-system timestamps (bus, git `%ai`, logs).

## Layout

- `continuity/items.json` — the item ledger (IDs: `G-` goal, `A-` active, `W-` watch). The source of truth for what's open.
- `docs/reconciliations/` — resolved record discrepancies (the lane's method template lives in #1).
- `docs/findings/` — smaller verified catches.
- `docs/decisions/` — filed decisions awaiting a gate (e.g. A-3's report-upstream draft).
- `docs/daily/<date>-prelaunch.md` — daily reports (needs §3a YAML frontmatter — the r8 linter FAILs without it).
- `docs/cold-starts/<MT-date>.md` — next-agent primer.
- `docs/lane-brief.md` — **source** for the David-facing brief hosted at `https://skylarkcreations.com/t/lanes/bounds-ledger`. Edit here, then post a bus note so the orchestrator re-ports it.
- `ledger/teorth-optimizationproblems/` — machine **mirror** of the adopted surface (109 files) + `manifest.json` pinning the upstream sha. **Do not hand-edit**; refresh only via `--snapshot`.
- `ledger/claims.json` — claim-level value pins (source URL + exact expected string per claim). 7 hand claims (C-1…C-7) + 216 generated pins (`pin:<file>:U|L`, `generated: true`) covering all 109 constants. Hand-edit only the hand claims; generated pins are rewritten wholesale by `extract-pins.mjs`.
- `scripts/` — `reverify.mjs` (mirror diff), `check-claims.mjs` (cross-surface claim check), `extract-pins.mjs` (regenerates generated pins from the mirror), `*.test.mjs` / `--selftest` (network-free).

## Gotchas

- **erdosproblems.com 403s automated fetch.** Re-verifying it needs David's browser; the value can reach you via a screenshot he attaches to a board card (the orchestrator reads it off local disk). Don't substitute a bot fetch — a 403 proves nothing.
- **LF→CRLF git warnings on Windows are benign** — ignore them on commit.
- **Never pipe a check step in CI without `shell: bash`.** GitHub Actions' default runner shell is `bash -e {0}` — no `pipefail` — so `node scripts/x.mjs | tee ...` reports `tee`'s exit 0 and a real drift passes green. This made the alarm fake for the lane's first two days (`docs/findings/2026-07-24-drift-alarm-was-never-armed.md`). `reverify.test.mjs` now guards it; don't defeat the guard.
- **The mirror diff only sees changes *inside* the adopted repo.** Cross-surface divergence (the lane's founding finding) is caught by `check-claims.mjs`, not `reverify.mjs`. Both run in CI.
