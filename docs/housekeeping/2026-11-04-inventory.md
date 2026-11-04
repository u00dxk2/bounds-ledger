# Housekeeping inventory — bounds-ledger, 2026-11-04 (Stage 1, read-only)

Stage 1 of the orchestrator's housekeeping night (bus prompt `5f719164`, 2026-11-04T22:30Z). Nothing has been moved, deleted or edited except this file. Each proposal waits for the orchestrator's review before Stage 2.

Tags: **REPRODUCED** means a read-only command was run. **STATIC** means the files were only read. **UNREAD** means it was not verified. Four read-only helpers (Opus) did the long reads. I spot-checked their load-bearing claims against `package.json` and the gate output. Their reports are summarized here rather than pasted.

## Baseline

As of 2026-11-04 ~22:40Z, HEAD `d2ac516`, clean tree.

| Measure | Value | Command |
|---|---|---|
| Loaded bytes: CLAUDE.md + AGENTS.md (the only @-import) | 29,021 + 39,655 = **68,676** | `(Get-Item CLAUDE.md).Length`, same for AGENTS.md; `Select-String CLAUDE.md '^@'` → `@AGENTS.md` |
| MEMORY.md bytes / memory files | **11,527** / **59** topic files + the index (60 `.md`) | `(Get-Item <memory dir>/MEMORY.md).Length`; `Get-ChildItem <memory dir> -Filter *.md` |
| Tracked files | **656** | `git ls-files \| Measure-Object` |
| Dead references | **0** (193 unique paths across 7 docs; 40 gitignored refs skipped) | `node <skylark-site>/scripts/check-doc-references.mjs` → `RESULT: PASS — 0 dead references` (exit 0). It is blind to docs outside its 7-doc list. |
| Continuity rows open and past `nextCheckDate` | **0** of 27 open (26 open + 1 monitoring; 116 total) | PowerShell `ConvertFrom-Json` over `continuity/items.json`. Also 0 past `expectedSignalBy`. |
| CI on main at HEAD | **GREEN** for both `reverify.yml` and `page-check.yml` (1 success each, 0 failures, 0 pending) | `check-ci-status.mjs --workflow reverify.yml` and `--workflow page-check.yml` |

**Finding from the baseline itself:** open rows carry their due date in one of two fields. 16 use only `nextCheckDate`, 10 use only `expectedSignalBy`, and W-13 has both (16 + 10 + 1 = 27). "Past nextCheckDate" therefore misses half the ledger. For example, `W-3` and `W-16` are due 11-05 by `expectedSignalBy` and do not appear in a `nextCheckDate` read (REPRODUCED). The due-gate printer reads both; a hand query must too.

## Docs findings

### Contradictions and facts false today (fix in Stage 2)

1. `AGENTS.md:17` says `npm run verify` "Runs `npm test && npm run check`". It does not. It runs `verify:steps`, which omits `check:entry-guard` and `check:notation` (package.json:10 vs :32). A green receipt therefore does not mean `npm run check` was green. REPRODUCED.
2. `npm run resnap` is described as three steps at `AGENTS.md:32`, `CLAUDE.md:30` and `docs/claude-md-keeplist.txt:38`. package.json:26 runs **six**: snapshot, extract-pins, render-state-block, render-site, open-pulls --fetch, render-constant-pages. `AGENTS.md:48` already says open-pulls runs inside resnap. REPRODUCED.
3. `AGENTS.md:54` cites `reverify.yml` lines 283/287/294 for the tee into `finding.txt`. They are now at 362/366/373. This is the public-stdout invariant, so the pointer matters. REPRODUCED (helper).
4. `AGENTS.md:16` describes `npm run check` as two legs. It has **12** (package.json:10). `README.md:112` says "those two plus nine more" and misses `check:lines`, so the true count is two plus ten. README is public, so that fix goes through the outward review. REPRODUCED.
5. `CLAUDE.md:26` says "See the HTTP-200 gotcha below". It moved to `docs/gotchas.md:24` on 09-18. STATIC.
6. `CLAUDE.md:31` says hand claims are "C-1…C-9". They are C-1…C-14, as `AGENTS.md:57` and `ledger/claims.json` have it. REPRODUCED (helper).
7. `CLAUDE.md:15` lists five self-tests. `npm test` runs about 48. Replace it with "see AGENTS.md § Commands". STATIC.
8. `CLAUDE.md:58` says "redirect to a file and read `$?`". That contradicts `AGENTS.md:24` (read the exit code from the receipt) and `CLAUDE.md:59` (a `$VAR` parks the classifier). STATIC.
9. `CLAUDE.md:34`, about delegating to Codex, says to "prove mutations with `grep -c`". A 09-05 measurement in lane memory found that grep dies in the Codex sandbox and that a node evidence script works. STATIC.
10. `AGENTS.md:17` calls `npm run verify` "the day's FIRST command". Lane memory records that the first-post gate never required a receipt. On 10-21 the fleet ruled that CI green at HEAD means no local verify, and the 10-25 sessions worked that way. The two texts disagree, and the orchestrator should say which binds. STATIC.
11. `docs/repo-layout.md:3` says Gotchas "stayed in CLAUDE.md" (they moved 09-18). `:18` says `check-brief.mjs` "needs the pin" (it sends no credential since 10-05). STATIC.
12. `docs/gotchas.md:23` calls the brief leg "PERMANENTLY RED". Under A-41 it is advisory and excluded from the exit code. `:12` gives fetch counts of 113 + ~110, while the README state block now reads 121 mirrored files and 254 claims. `:9` says "above" where it means below. STATIC / REPRODUCED.
13. `AGENTS.md:63` and `gotchas.md:10` say "a feature branch gets NO CI run". Both workflows run on `pull_request` into main, so this is true only for a push with no PR, or for a stacked PR. STATIC.
14. `docs/daily-config.md:77` says "exactly one workflow". There are three: reverify, page-check, history-sweep. Lines `:44`, `:48` and `:54` refer to the first-action block by line number, and every reference is off by one since `git pull` was inserted. That is the very defect `:30-33` warns about. REPRODUCED / STATIC.
15. `docs/close-session-config.md:12` gives a bare `npm run verify`, not the required `> tmp/verify-out.txt 2>&1` shape. STATIC.
16. `docs/key-user-flows.md:23` says `scripts/lookup.mjs` is "held on PR #26". It is on main (`npm run lookup`), and `:18` of the same file treats it as live. STATIC.
17. `docs/housekeeping-ledger.md:11` is still open but already done: the README state block is generated and checked in CI. STATIC.
18. `docs/claude-md-keeplist.txt` has gone stale. Five of its keep strings no longer appear in CLAUDE.md or AGENTS.md, so a `compress-to-budget.mjs --keep` run would exit 3 before any trim. STATIC for the exit behaviour.
19. A comment at `.github/workflows/reverify.yml:503-511` still describes the pre-08-08 world: "CI holds no CC_PROMPTS_PIN", "heading for a public flip". STATIC.
20. `daily-config.md` "W-7" requirement: `:215-218` requires a line opening `W-7 —` in every report. Across 10-20 to 11-04 it appears **once** (10-23). It has lapsed and nobody flagged it. Either restore it or retire it on purpose, and record which. That choice is a process decision for the orchestrator, flagged here rather than fixed silently. REPRODUCED (helper grep).

Checked and holding: every "runs in CI" claim in AGENTS.md matches the workflows. The standing prediction in today's report quotes CLAUDE.md word for word. The Layout and Gotchas pointers resolve. Every concrete path in the audited docs exists (50 checked).

### Duplication (AGENTS.md is @-imported, so each duplicate is loaded twice)

| Topic | Copies | Survivor |
|---|---|---|
| Pipe eats the exit code | AGENTS:66, AGENTS:23, CLAUDE:58, gotchas:29 | AGENTS:66 for the rule, gotchas for the incident; delete CLAUDE:58 |
| UNREACHABLE ≠ BROKEN | AGENTS:59, CLAUDE:60, gotchas:15 | AGENTS + gotchas; delete CLAUDE:60 |
| manual:true → UNVERIFIED | AGENTS:65, CLAUDE:20, gotchas:25 | AGENTS + gotchas; CLAUDE:20 keeps only its C-9 clause |
| KP-78 / CRLF | AGENTS:67, CLAUDE:33 (opening), gotchas:26 | AGENTS for the rule; CLAUDE:33 keeps "five ways" as rationale |
| Outward gate | AGENTS:68, CLAUDE:43 | AGENTS:68, absorbing the 08-01 "review everything public" extension, which is a portable fact |
| Snapshot ratchet | AGENTS:32, AGENTS:58, CLAUDE:30 | AGENTS (corrected per item 2); CLAUDE:30 keeps the editorial-drift rationale |
| Brief-check story | CLAUDE:35, AGENTS:49, gotchas:23, repo-layout:18 | gotchas (corrected); CLAUDE:35 cut to one line |
| verify receipt, close:primer | AGENTS:17-25, close-session-config:15-20, :29-33 | AGENTS; close-session-config points to it |
| Doppler and killing node processes | CLAUDE:61-62, gotchas:8-9 | both are portable, so the loaded copy belongs in AGENTS |
| The `rev-parse` block | daily-config:10-17/44-46 and :87-95 | keep one |

### Move candidates (whole sections only; no gotcha removed, since none was proven dead)

- **A.** The thirteen per-script entries in AGENTS.md § Commands (`depth-audit`, `decimal-vs-exact`, `citation-footprint`, `extract-ds1`, `render-ramsey`, `ds1-depth`, `history-sweep`, `openai-math`, `anthropic-formal-math`, `eth-openalex-frame`, `arxiv-watch`, `step-overlap`, `open-pulls`) would move to a new `docs/commands.md`. That saves **~19.9 KB**. One pointer line stays loaded, and it must say that several entries carry never-commit or never-publish rules (arxiv-watch output, the eth frame, no titles or authors from open-pulls, the openai-math resnap reconcile signal) and must be read before running the script. The "public-tree checks" entry stays loaded, because the pre-commit hook enforces it on every commit.
- **B.** The indicator entries (`traffic`, `reports`, `catches`, `served`) would also move to `docs/commands.md`, saving ~3.1 KB.
- **C.** The CLAUDE.md daily-report contract (lines 45-47, ~4.3 KB) would move to `docs/daily-config.md`. Caveat: the standing prediction says "Quote it from HERE", and reports say "quoted from CLAUDE.md". Both pointers change in the same commit, or the single-source property that clause's own history explains is lost.
- **Estimated loaded size** (today 68,676 B): about 49.1 KB after A, about 46.3 KB after A+B, and about 41 KB after A+B+C plus the dedupe above, **a cut of roughly 40%**.
- **Must stay loaded** (governs every command): every push publishes, and the publish is not CI-gated; the verify shape and the no-pipe rule; all of AGENTS § Hard invariants (secrets, the drift alarm's stdout is public, hooksPath, the ruleset, never hand-edit, UNREACHABLE, KP-78, the outward gate, scope discipline, model identity); the public-tree checks; one command per call; never kill a node process; never run doppler; pins assert listing position; a decision that forbids a channel forbids the content; snapshot discipline.

### Start-here and docs index

- `README.md` is the public product page. It has no agent entry and does not mention AGENTS.md. Proposal: add a **`docs/README.md`**, which GitHub renders on the docs/ folder page, listing every doc with one line of purpose. Then add one pointer line in AGENTS.md § What this is, plus a single "For agents and contributors: start at `AGENTS.md`" line in README. The README line is a public surface and goes through review.
- **Start-here order (paths only):** `AGENTS.md`, then `CLAUDE.md` (Claude only), then `docs/cold-starts/<latest MT>.md`, then `continuity/items.json`, then `docs/daily-config.md` (first-action block), then `docs/gotchas.md` (before debugging), then `docs/repo-layout.md` (before touching `ledger/`, `continuity/` or `scripts/`), then `docs/close-session-config.md` (at close).
- Index lines are drafted for all 15 files at the docs/ root and the six subfolders. They are held for Stage 2.

## File proposals (each with its reader grep)

Method (helper): a read-only node script over the 656 `git ls-files` paths, matching path and basename, plus Grep over skylark-site `scripts/` and `src/` and the fleet skills directory. A **code** hit is a file in `scripts/`, `search/`, `.github/`, `.githooks/` or `package.json`; anything else is prose. **Nothing on the list is safe to DELETE.**

| Path | Proposal | Reader grep | Reason |
|---|---|---|---|
| `docs/evidence/` (4 PNGs, ~1 MB) | KEEP | repo: 3 prose hits in 2 daily reports (10-10, 10-11); items.json 0; skylark-site 0; skills 0 | Small; two links |
| `search/27b/` (10 files) | KEEP | CODE: npm test runs 4 of its selftests; `reverify.yml` 8 hits; open `G-2` readCommand runs `verifier.mjs` on `sulanke-certificate.json`; `docs/repo-layout.md` | Live. `find-sulanke-partition.mjs` has no code reader but generated the certificate, so keep it as provenance |
| `docs/engineering-health-review-2026-07-29.md` | KEEP in place | CODE: the open `A-9` readCommand reads it by path; skills `refactor-pass` and `repo-health-audit` glob `docs/engineering-health-review-*.md`; skylark-site `readcommand-triage.mjs`, `check-roster-recitations.mjs` | Moving it breaks an open gate and two fleet skills |
| `docs/reconciliations/2026-07-22-minimum-overlap.md` | KEEP | README (public link), `docs/lane-brief.md`, `ledger/claims.json`, items.json A-1 | Linked from public surfaces |
| `docs/daily/` (103) and `docs/cold-starts/` (100), Jul–Sep to `archive/` | **DEFER / leave** | Fleet readers `readdirSync` the flat directory and pick today or the newest (`check-primer-freshness`, `phase-7d-primer-stub`, `check-daily-report-exists`, `check-primer-warn-counts`, `check-doc-references`); no recursive glob found. Outside links to Jul–Sep files: items.json 13, 3 findings, `docs/key-user-flows.md` 2 (a substrate-read file), CLAUDE.md 1, 1 decision, 1 script comment; 112 cross-links between the two directories | Neither directory is loaded into context, so archiving saves no loaded bytes and would break about 120 historical links |
| `docs/cold-starts/fresh-agent-bounds-ledger-2026-08-22-pm.md` | ARCHIVE to `docs/cold-starts/archive/` | 4 prose hits (items.json, 2 primers, 1 report); no code reader (fleet primer readers filter on date-named files) | A one-off 08-22 paste-in prompt, not a primer. Update the items.json mention in the same commit |
| `continuity/read-outputs/` (47) | KEEP | WRITER: skylark-site `check-due-gates-dispositioned.mjs --run`; READER: skylark-site `lib/due-gates-io.mjs`, which treats a row whose `readCommandLastOutputRef` names a missing file as UNREADABLE; items.json 60 mentions | 25 sidecars belong to closed rows. Whether every reader skips closed rows is UNREAD, so pruning is deferred. Already dangling: closed `A-79` carries a ref with no sidecar |
| `docs/gap-table.json` | KEEP | CODE: `scripts/gap-table.mjs` writes it; its selftest runs in npm test and CI; open `G-2` names it | Generated output of a live script; staleness UNREAD |
| `docs/claude-md-keeplist.txt` | ARCHIVE to `docs/archive/` | only itself and one primer (prose); skylark-site `compress-to-budget.mjs` takes `--keep <file>` as an argument, not this path | A one-off input to the 08-24 compression, and stale (Docs item 18) |
| `docs/findings/` (33), `docs/decisions/` (21) | KEEP | CLAUDE.md, README and gotchas.md link into both; 1–9 inbound links per file; one finding has 0 | Dated history, no duplicates |
| `scripts/` (43 incl. `lib/`) | KEEP all | every script has at least one code reader (most run as a `--selftest` in npm test and `reverify.yml`) | No dead script found |
| Untracked / ignored | list only | `git status --porcelain --ignored`: nothing untracked; ignored `.claude/`, `.playwright-cli/`, three continuity logs, `tmp/` (3,817 entries) | Never published. A `tmp/` prune is local only and must spare fleet-read files (verify receipt, bus events, bookmark, pidfiles, waker state). List before deleting |

**Substrate paths named in the housekeeping prompt that do not exist here:** `docs/key-metrics.json` and `docs/model-seats.json` (`git ls-files` returns neither). Question for the orchestrator: does this lane owe them? I will not invent them tonight.

## Memory findings

Auto-memory directory, read by a helper; nothing edited.

- 59 index lines map one-to-one onto 59 files. No missing file, no orphan. All frontmatter is valid. The directory holds 207,634 B, and the bootstrap file alone is about 41 KB.
- **Wrong or superseded content, checked against the repo:**
  - The bootstrap says `docs/daily-config.md` does not exist. It does.
  - It still describes the weekly forced-decision pass, which the three-stage day replaced on 09-25.
  - It says "G-3 is Tier-0". G-3 is closed and G-4 is Tier-0.
  - It says "A-7 open on R7". A-7 is closed and R7 shipped 09-17.
  - It says the history sweep "ships red on 4 hits". The dispositions file replaced that.
  - It calls the flip "on hold", but the repo has been public since 08-08, and its claim counts are stale.
  - Instance 5 in `catches-blind-to-added-constants` is listed as OPEN, but it is addressed (`scripts/catch-rate.mjs:374-378`).
  - `p1-before-the-kickoff` says to run verify after /listen, which the 10-21 CI-green rule superseded.
  - `sub-agents-authorized-2026-08-20` names the Codex companion route, retired 09-29.
  - `measurement-composed-not-run` contradicts itself on whether a mechanical sha check exists.
  - One `[[link]]` is broken.
- **Proposed:**
  - Delete 4 files whose content the repo already holds, including the RETIRED waker note. Its 09-12 ruling is carried into the rulings ledger.
  - Make 13 merges that fold 19 files into survivors.
  - Rewrite the bootstrap as a **rulings ledger**, about 41 KB → about 6 KB. Every David ruling is kept, dated and verbatim, and marked superseded only where a later ruling names it.
  - Compact `measurement-composed-not-run`, about 20 KB → about 6 KB.
- **Result:** 59 → 36 files; MEMORY.md about 11.5 KB → about 7 KB, comfortably under the 24.4 KB limit. A 36-line target index is drafted. Each merge updates its index line in the same edit.

## Code (optional)

None proposed. The file read found no dead script or export with no reader. The behaviour-preserving changes available are all doc or comment fixes (Docs items 1–19, including the stale `reverify.yml` comment). Nothing touches money, auth, data or migrations.

## Goals proposal (a PROPOSAL for David; not adopted, and we start 11-05 on the current goals)

Evidence (helper read of the reports 10-29 to 11-04, the 11-03 and 11-04 retros, `continuity/traffic.json` and items.json G-4):

- OBSERVED: `npm run reports` read 0 outside report arrivals of 37 raw issues (reports 10-30:95, 11-04:103). All 7 issues filed since 09-26 are ours.
- OBSERVED: **the traffic sampler (W-6, `npm run traffic`) has not run since 2026-09-25.** GitHub keeps only 14 days, so the views from about 09-24 to 10-20 are permanently lost. This also blinds G-4's "is traffic still accumulating" trigger. A live read covering 10-21 to 11-03 (helper, `gh api …/traffic/views`) shows **6 views, 6 uniques** of the repo.
- OBSERVED: G-4's own pre-commitment (`denominatorPreCommit2026_08_31`) says a zero carries information only at 30 or more uniques per 14 days. The current figure is 6. David dropped G-4's outcome date on 09-10 and moved the interim judgment to `A-47`.
- OBSERVED: all 7 days were instrument-facing by the reports' own classification sentences. Each day's main ship was a user-visible sentence or label, and around them ran at least 16 Codex rounds plus several new instruments that render nothing (A-92, A-93).
- HYPOTHESIS: the goal points the right way, but no week can test it. The binding constraint is that nobody arrives, not that arrivals fail to act.

**Proposal:**

- **One user problem.** A mathematician citing a constant from a page "last edited in January" cannot tell whether it is still current (`docs/evangelism-bar.md:20`). That person does not reach our page. (OBSERVED for the problem statement; HYPOTHESIS that reach is the binding gap.)
- **The measure.** Search impressions and clicks on the `c/` pages per week, from Google Search Console. Verification is a static file on Pages that loads no third-party asset. (SUGGESTION. It needs David's Google account, so the verification step is his, and it changes a public surface, so it gets the adversarial review first.)
- **7-day target.** Search Console verified and a sitemap submitted; each `c/` page's title and first line name the constant the way a mathematician would search for it; the first impressions figure read by 11-11; the traffic sampler running again from tonight. (SUGGESTION)
- **What we would stop.** (SUGGESTION)
  - Opening new watched areas or mapping more releases (`A-92`, `A-93`, more `A-78` pairs) until reach is above zero.
  - Going past round 2 of review on a dark or internal guard: at round 2, change shape or ship with the ceiling declared, as the lane's own rule already says.
  - The report's ceremony sections: the Section 0 recitations, empty Inputs, Recommendation and On-hold sections, the running instrument-facing count, and the untested-prediction line, all of which are near-identical every day.
- This reaches David only through the orchestrator's one fleet card tonight, per the housekeeping prompt. This lane files no card of its own.

**Report and process review:**

- OBSERVED: the manager reads the P1 packet and the P3 result, and both drive approvals. David's rulings come from board cards and never cite a report. The Recommendation section was empty all week.
- SUGGESTION: the load-bearing parts are the BLUF, the selection packet and the Close block's ledger changes.
- HYPOTHESIS: the close-time report-lint loop, which recurred 11-03 and 11-04 and which both retros said to delegate, and hygiene passes that only re-date `nextCheckDate` (4 of 6 lines on 11-04) are ceremony.

## What slowed us this week

All OBSERVED, with source lines in the daily reports and the two retros (`tmp/` retros are local and not committed).

- **11-04:**
  - `npm run verify` refused because the day's report was untracked, after it had already waited in the queue.
  - The close lint went 5/8, then the pre-commit hook refused an upstream sha.
  - The 44 KB kickoff and the close prompt each entered context twice.
  - `npm test` overran the 600 s foreground limit.
  - The P1 review took 21 minutes.
- **11-03:**
  - 3 Codex rounds on A-95's report labels; a matcher was replaced by an allowlist at round 2.
  - David's card was answered after P5 had posted, forcing a second close, for the second day running.
  - A typed "no new send" contradicted the output quoted beside it.
  - The `A-92` OpenAlex run refused (exit 2), its fourth day of attempts.
- **10-31:** 4 Codex rounds on `--from`; rounds 2 and 3 hit the same guard.
- **10-30:**
  - Two stale premises: the watch window, and A-84's timing (93 s, not about 20 min).
  - The Codex sandbox called every page stale, a false HIGH finding.
  - `A-92` was minted while Codex round 1 was reading the tree.
  - A Pages build sat 14 minutes in the Actions queue.
- **10-29 and 10-30:** the verify-receipt gate refused a post sentence that paired a check with the word "clean"; the 10-29 upstream question took 3 Codex rounds.
- **This inventory:** the docs above disagree with package.json on what `verify`, `check` and `resnap` run (Docs items 1, 2 and 4). An agent that trusts the docs mis-reads a green receipt.

## Carried items (untouched tonight)

The 11-05 due gates (`A-77`, `W-16`, `W-3`), `A-50` (due 11-06), `A-96` (11-11), the 11-11 stale-list date on the `c/` pages, and every open row stay as they are. No proposal here archives or rewords any of them.
