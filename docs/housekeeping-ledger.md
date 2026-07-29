# Housekeeping Ledger — bounds-ledger

Itches noticed but not done. The housekeeping pass reads this FIRST, then adds *and subtracts* — deletion counts as improvement (`skylark-site/docs/engineering-health-standard.md` § I, rule 33). Add a dated line when you notice something; strike it (move to Done) when handled.

**Format:** `- [ ] YYYY-MM-DD — <the itch, one line> (noticed during <context>)`

**Not for findings.** A real gap goes in `docs/findings/`, `continuity/items.json`, or a review doc — this file is for the smaller things that would otherwise be forgotten. The 2026-07-29 engineering-health findings live in `docs/engineering-health-review-2026-07-29.md`, not here.

## Open

- [ ] 2026-07-29 — README:47 says the generated pins cover "all 110 mirrored constants"; they cover 109, because `1b.md` is deliberately skipped and hand-pinned as C-1/C-3 (`scripts/extract-pins.mjs:31`). Ledger coverage is complete — only the sentence is wrong. Worth fixing precisely because 1b *is* the minimum-overlap constant a reader would chase (noticed during the engineering-health review; filed there as P2-5)
- [ ] 2026-07-29 — the snapshot-rollback path (revert a `--snapshot` that blessed an unverified upstream change → re-run `extract-pins.mjs` → re-commit) is nowhere in README; it lives only in an agent's head after reading CLAUDE.md's snapshot discipline. One line next to the snapshot commands (noticed during the engineering-health review; filed there as P2-3)
- [ ] 2026-07-29 — six dated docs still say `/daily-close` (cold-starts 07-24/25/26/27/29, daily 07-25). Correct as historical record — they describe what the rail was called then. Leave them; this line exists so the next agent doesn't "discover" them again and re-sweep (noticed during the 2026-07-29 rename sweep)
- [ ] 2026-07-29 — `tmp/` has accumulated one-off artifacts from past sessions (`drift.txt`, `ci-30442566840.log`, `local-check-2026-07-29.txt`) alongside the live bus files. Gitignored, so harmless — but the next agent reading `tmp/` for bus state wades through stale check output. Sweep the non-bus files at some close-session (noticed during the engineering-health review)

## Done

_(strike-throughs land here with the date closed)_
