# Housekeeping Ledger — bounds-ledger

Itches noticed but not done. The housekeeping pass reads this FIRST, then adds *and subtracts* — deletion counts as improvement (`skylark-site/docs/engineering-health-standard.md` § I, rule 33). Add a dated line when you notice something; strike it (move to Done) when handled.

**Format:** `- [ ] YYYY-MM-DD — <the itch, one line> (noticed during <context>)`

**Not for findings.** A real gap goes in `docs/findings/`, `continuity/items.json`, or a review doc — this file is for the smaller things that would otherwise be forgotten. The 2026-07-29 engineering-health findings live in `docs/engineering-health-review-2026-07-29.md`, not here.

## Open

- [ ] 2026-08-11 — the README's "Current state" block is hand-maintained and went stale on nearly every number in eight days (sha, file count, claim counts, self-test count, hand-claim count — all corrected tonight). A lane whose product is *noticing when numbers drift* should not be hand-copying its own. Candidate: have `npm run check` emit the block, or a linter that fails when README's figures disagree with live output. Not built tonight — it needs the W-4 both-sides demonstration, and half a detector is worse than none (noticed while fixing the stale figures)
- [ ] 2026-07-29 — six dated docs still say `/daily-close` (cold-starts 07-24/25/26/27/29, daily 07-25). Correct as historical record — they describe what the rail was called then. Leave them; this line exists so the next agent doesn't "discover" them again and re-sweep (noticed during the 2026-07-29 rename sweep)
- [ ] 2026-07-29 — `tmp/` has accumulated one-off artifacts from past sessions (`drift.txt`, `ci-30442566840.log`, `local-check-2026-07-29.txt`) alongside the live bus files. Gitignored, so harmless — but the next agent reading `tmp/` for bus state wades through stale check output. Sweep the non-bus files at some close-session (noticed during the engineering-health review)

## Done

_(strike-throughs land here with the date closed)_

- [x] 2026-07-29 → closed 2026-08-11 — ~~README says the generated pins cover "all 110 mirrored constants"; they cover 109, because `1b.md` is deliberately skipped and hand-pinned as C-1/C-3~~. Fixed, and the wording found on arrival was already different from what this line described (the count sentence had been rewritten in between), so the fix was written against the live file rather than against this note. README now states the split explicitly: 220 generated pins over 110 files, `1b.md` hand-pinned as C-1/C-3, coverage complete. Was P2-5 in the engineering-health review
- [x] 2026-07-29 → closed 2026-08-11 — ~~the snapshot-rollback path is nowhere in README; it lives only in an agent's head~~. Added as a *Rolling one back* note under the red-run rule: revert the snapshot commit, re-run `extract-pins.mjs`, commit that too — with the reason it is two steps (pins follow the mirror automatically in neither direction). Was P2-3
