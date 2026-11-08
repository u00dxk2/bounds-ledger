# Housekeeping Ledger — bounds-ledger

Itches noticed but not done. The housekeeping pass reads this FIRST, then adds *and subtracts* — deletion counts as improvement (`skylark-site/docs/engineering-health-standard.md` § I, rule 33). Add a dated line when you notice something; strike it (move to Done) when handled.

**Format:** `- [ ] YYYY-MM-DD — <the itch, one line> (noticed during <context>)`

**Not for findings.** A real gap goes in `docs/findings/`, `continuity/items.json`, or a review doc — this file is for the smaller things that would otherwise be forgotten. The 2026-07-29 engineering-health findings live in `docs/engineering-health-review-2026-07-29.md`, not here.

## Open

- [ ] 2026-07-29 — six dated docs still say `/daily-close` (cold-starts 07-24/25/26/27/29, daily 07-25). Correct as historical record — they describe what the rail was called then. Leave them; this line exists so the next agent doesn't "discover" them again and re-sweep (noticed during the 2026-07-29 rename sweep)
- [ ] 2026-08-11 — the `tmp/` sweep needs a rule, not a habit. Tonight's pass used "dotfiles are live bus/loop state, everything else is a one-off artifact", which held for all 76 files — but it is a convention nothing enforces, so the first live file written without a leading dot gets deleted by the next agent applying it. Either document the rule at the top of the directory or have the scripts write one-offs to a `tmp/scratch/` subdirectory (noticed while doing the sweep)

- [ ] 2026-11-07 — `tmp/` in the main checkout holds 7,228 files / 863,483,228 bytes (read 2026-11-07 refactor census, `Get-ChildItem -Recurse -Force`). The 08-11 line above still governs: nothing deleted, because no rule separates live state from one-offs (noticed during the 2026-11-07 refactor census)
- [ ] 2026-11-07 — six scripts still inline the entry-module check instead of importing `isEntryModule` from `scripts/lib/entry-module.mjs`: check-claims, check-upstream-reports, depth-audit, openai-math, render-site, reverify. Left alone on 11-07 because a dated read due by 11-14 names each one (W-3, A-77, A-47, A-78, A-70/A-100, A-2). Migrate them once those reads close (noticed during the 2026-11-07 refactor census)
- [ ] 2026-11-07 — `p7-dont-touch.mjs` marks `AGENTS.md`, `docs/gotchas.md` and `docs/findings/2026-08-18-the-guard-against-a-wrong-commit-read-never-ran.md` RED as "inline: never touch (line 20)". CLAUDE.md line 20 is the "what-never-to-hand-edit" pointer, so this looks like a parse false positive, and it would block any refactor pass from fixing the lane's main contract. Report it to the fleet script's owner rather than work around it (noticed during the 2026-11-07 refactor census)
- [ ] 2026-11-07 — no unused-export instrument has ever run here: the 11-07 knip run through heavy-gate was refused by the permission classifier, and the repo has no eslint or tsc. "No dead exports" (10-03, 11-04) rests on reader greps alone (noticed during the 2026-11-07 refactor census)
- [ ] 2026-11-07 — `continuity/items.json` is 1,359,935 bytes for 122 rows. No CI ceiling or tooling ruling covers a split, so it stays as one file; recorded so its growth is visible (noticed during the 2026-11-07 refactor census)
- [ ] 2026-11-07 — render-site.mjs (~2,900 lines) and render-constant-pages.mjs (~2,400 lines) are still unsplit. The 10-03 entry below already deferred this to its own planned session; render-site is also named by A-100, due 11-14 (noticed during the 2026-11-07 refactor census)

## Done

_(strike-throughs land here with the date closed)_

- [x] 2026-11-07 (refactor night) — ~~`docs/README.md` promises every doc in `docs/` and did not name the 11-07 journey walk~~. Added (`c216b2c`)

- [x] 2026-08-11 → found done 2026-11-04 (housekeeping night) — ~~the README's "Current state" block is hand-maintained and goes stale~~. It is generated: `scripts/render-state-block.mjs` writes it, `npm run check` runs it as `check:state`, and CI runs that check as a `reverify.yml` step. The line had stayed open after the fix landed

- [x] 2026-10-03 (round 4, /refactor-pass, `A-71`) — ~~`esc` defined three times and the repository URL three times across the three page renderers, the report-a-row issue link built by hand twice~~. Moved into `scripts/lib/html.mjs` (`4baa57d`, pure: every published page re-rendered byte-identical, and the three page `--check` legs were shown failing on a mutation of the shared `esc`), then given its own `--selftest` wired into `npm test` and CI (`0050204`, each of its six checks shown failing on its own mutation). Picked because the code real users touch most is the published pages and coverage there was already dense; an export sweep found no dead exports. Not done, on purpose: splitting render-site / render-constant-pages (1,300 to 1,900 lines each, changed in nearly every `A-47` slice), which needs its own planned session. Also found: `.claude/p7-*` was not gitignored in this public repo; now it is

- [x] 2026-07-29 → closed 2026-08-11 — ~~README says the generated pins cover "all 110 mirrored constants"; they cover 109, because `1b.md` is deliberately skipped and hand-pinned as C-1/C-3~~. Fixed, and the wording found on arrival was already different from what this line described (the count sentence had been rewritten in between), so the fix was written against the live file rather than against this note. README now states the split explicitly: 220 generated pins over 110 files, `1b.md` hand-pinned as C-1/C-3, coverage complete. Was P2-5 in the engineering-health review
- [x] 2026-07-29 → closed 2026-08-11 — ~~`tmp/` has accumulated one-off artifacts from past sessions alongside the live bus files~~. Swept at close: 57 files / 544 KB removed, 19 live bus and loop-state files kept. Replaced above with the rule this sweep depended on and nothing enforces
- [x] 2026-07-29 → closed 2026-08-11 — ~~the snapshot-rollback path is nowhere in README; it lives only in an agent's head~~. Added as a *Rolling one back* note under the red-run rule: revert the snapshot commit, re-run `extract-pins.mjs`, commit that too — with the reason it is two steps (pins follow the mirror automatically in neither direction). Was P2-3
