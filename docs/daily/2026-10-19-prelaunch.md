---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-19
lifecycle_stage: launched
last_deploy: 57bac58 (HEAD at the 10-19 kickoff)
on_hold_items: 0
top_action_today: statement-check the next slice of OpenAI math-release pairs (A-78) so more constant pages say whether the release touches them
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-19 (Monday, MT)

## BLUF

Four more constant pages now tell a reader whether OpenAI's math release settles that bound, with the formal statement quoted and checked. Two older notes had turned false after yesterday's upstream update, and both are fixed. A future upstream change to any page with a note now fails our checks until a person re-reads it.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** more constant pages say plainly whether OpenAI's math release touches the bound, with the Lean statement read against the constant's definition. Item: `A-78` (OpenAI's math release mapped onto every watched constant).

**The user problem, in the user's words:** "I was about to cite this bound. Does OpenAI's new math release change it, and did anyone check the actual statement, or is it just a headline?" Today 8 of the 31 release-to-constant pairs answer that on the page; 23 are data only and show nothing.

**Evidence** (each read today, 2026-10-19 MT, unless marked):
- OBSERVED · `node scripts/openai-math.mjs` (stamped through `check-due-gates-dispositioned --run A-78`, exit 0) · the committed map · "372 of 372 families at openai/math@fd4aeeb (an upstream sha; it does not exist in this repo): 23 bear on a watched record, 349 do not; 31 pair(s): formal-proof 8, partial 0, none 0, unchecked 23; rendered 8". Limit: reads the committed map only. pragma: allowlist sha
- OBSERVED · `gh api repos/openai/math/commits` · the release repo · two commits after the pinned `fd4aeeb`: `2710f99` and `1581d4c` (2026-10-12, both upstream shas), "Lock pull request conversations when opened". `gh api repos/openai/math/compare/fd4aeeb...1581d4c` lists ONE changed file, `added .github/workflows/lock-prs.yml`. So no manuscript, Lean statement, `CONTENTS.md` or `history.md` moved, and the 8 rendered pairs' statement files are byte-unchanged at the new tip. pragma: allowlist sha
- OBSERVED · the map read through a JSON parser by family and record id (not by walking lines) · the unchecked pairs where both screening passes said "high": 74a (family 039), 67a (072), 34a (073), 46a (077), 77a (078), 25a (087), 20b (101), 4b (182), plus 8a (003), which the onTrigger's order list does not name. 52a (235) is medium/high; 23b (076) is Codex-only high. The rest are low.
- OBSERVED · `npm run reports` · 34 issues fetched, 34 ours, 0 outside arrivals; parts reconcile 34 + 0 + 0 = 34. The bar's metric (useful non-obvious answers delivered) stays NOT MEASURABLE, per `docs/evangelism-bar.md`.
- HYPOTHESIS · that each of the high/high pairs matches its constant on a statement read. The screening passes read headlines, not statements; some will turn out not to bear, and a pair dispositioned "not bearing after a read" also counts toward `closeWhen`.
- MISSING · any read of whether a visitor opens a constant page carrying a release note (the pages have no analytics; `A-59`, encounter blind on the public pages).

**Permission:** `A-78` is open and owned by this lane, opened 2026-10-12 on David's ask (skylark-site `docs/answers/2026-10-12-afternoon-plan-bounds-ledger-openai-math.md`) and the manager's redirect: tag only from a Lean statement read. Rendering a statement-checked note is the row's own decided shape. Outward gate: the page is public, so the new notes get an adversarial review and a cross-family claims pass before push. Step (3), an upstream note, is drafted only, never sent; any send is David's. `node scripts/sky.mjs answered-cards.mjs --project bounds-ledger`: no unread David-word.

**Next action** — kind: improve. For each pair in order (74a, 67a, 34a, 25a, 4b, 20b, 46a, 77a, then 8a), open the family's Lean statement file at the release tip, read it against the constant's definition in the mirrored `ledger/teorth-optimizationproblems/constants/<id>.md`, and record either `statementChecked: true` with `statement` and `match`, or a not-bearing disposition with the reason. Move `source.sha` to `1581d4c` (only a workflow file changed). Then render, run `--selftest`, and verify. First command: pragma: allowlist sha

```
gh api "repos/openai/math/contents/lean/docs/039.md?ref=1581d4cbdd69a0faf34b2089614fe2a814316a6a" --jq .download_url  # pragma: allowlist sha
```

(The ref is the full sha printed by `gh api repos/openai/math/commits --jq ".[0].sha"` at 2026-10-19 MT, pasted, not typed.) pragma: allowlist sha

**Acceptance condition:** `node scripts/openai-math.mjs` prints `unchecked` below 23 and `rendered` above 8 with `RESULT: VALID`; `node scripts/openai-math.mjs --selftest` exits 0; `npm run check` green after the commit; CI green on the pushed tip for `reverify.yml` and `page-check.yml`; `npm run served` reports SERVED for every changed `c/` page. A slice smaller than nine is reported with the remaining count, never as done.

**Delivery and encounter checks:** delivery is `npm run served` after the push (in-flight window 300 s). Encounter is blind (`A-59`): the event that would show a reader met a note is an issue through that page's "looks wrong?" link, counted by `npm run reports`; at today's arrival rate (0 outside in 72 days) no N makes it readable this week.

**USER-FACING: yes** — `ledger/openai-math-map.json`, `c/<id>.html` for each newly checked pair, `index.html` if a row's note changes it, possibly `scripts/openai-math.mjs` or the renderers only if a pair needs a shape the map lacks.

**Section 0:**
- Primer: `docs/cold-starts/2026-10-18.md` read, banner whole; no `2026-10-19.md` on disk.
- Listener: 🟢 SSE alive (hello 2026-10-19T14:25:02.858Z, slug bounds-ledger) + loop armed by `ScheduleWakeup`; waker ladder ranks 1-3 running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 2026-10-19T14:32:32Z).
- CI: `check-ci-status --workflow reverify.yml` GREEN and `--workflow page-check.yml` GREEN on `57bac58` (exit 0 each). Deploy drift: this is a GitHub Pages lane with no Render service declared, so the fleet drift read sweeps nothing for it: neither a stop nor a pass.
- Harness: running 2.1.303 · fleet UNIFORM (28 of 28 panes) · installed 2.1.303 (SAME); build moved from 2.1.277.
- Recs yesterday: none (`docs/daily/2026-10-18-prelaunch.md` § Recommendation: "None new for David").
- Prior-day retro finding that bears on today: read a JSON entry's field through a parser by id. Today's pair list above was read that way.
- Due-gates baseline: `check-due-gates-dispositioned --snapshot` → "3 gate(s) due on/before 2026-10-19" (A-2, A-77, A-78).

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice — 2: `A-2` (the standing drift-resolution log; its read is the drift leg of `npm run verify`), `A-77` (the filed-report check runs only when someone remembers; due to decide its caller, readCommand never run).
- (b) owed child rows — none: read the kickoff's "rows owed to you in skylark-site's ledger" (0 of 754).
- (c) state reads with a printed threshold — 2: dated gates due today 3 (of 102 swept); prior-day retro 8 still-on-discipline of 9 tagged findings. `missingLinkedCommits` was NOTHING SWEPT (0 of 0) and so could not be judged.

### P3 — Product-work loop

**Action (improve, plus one live correction found while doing it):** `A-78`, OpenAI's math release mapped onto the watched constants, under the manager's REDIRECT (a home for "read, does not bear").

**Implementation.** Commits `57fc7ae` and `0549b09` on `main`.
- `scripts/openai-math.mjs`: a `read-no-note` tag keeps a pair that was read and is not shown (`statementRead`, `bears`, `reason`, the statement file), counted apart from `unchecked`. Two new refusals tie a note to the page it sits on: a note on a constant whose mirrored page links github.com/openai/math, and a note whose page hash (`sourceSha256`, LF-normalised SHA-256) no longer matches. `--source-hash <id>` prints the value to paste after a re-read.
- `ledger/openai-math-map.json`: 74a, 67a, 34a and 25a statement-checked against their Lean files at the release tip and rendered; 4b read and recorded `read-no-note` (upstream already lists it); 84a withdrawn to `read-no-note`; 7a's comparison row corrected; pin moved to the release tip.
- `node scripts/openai-math.mjs` now prints "31 pair(s): formal-proof 11, partial 0, none 0, unchecked 18, read-no-note 2; rendered 11", `RESULT: VALID (exit 0)` (was unchecked 23, rendered 8).
- Red arms: (1) the HEAD-of-day map under the page-citation refusal exits 1 naming only 84a, in the CLI and in `--selftest` (map backed up, swapped, restored, hash-equal); (2) before hashes were stamped, all 11 rendered notes were refused for a missing `sourceSha256`; (3) 7a pinned to its page as mirrored before the 10-18 resnap is refused, and only 7a.
- Tests: `node scripts/openai-math.mjs --selftest` exit 0; `node scripts/render-constant-pages.mjs --check` "117 constant page(s) match committed state", exit 0. The full local `npm run verify` was stopped twice by the machine's low-memory reaper; on the orchestrator's instruction (bus a75a431f) CI is today's full gate.
- Review: Codex round 1 on `57fc7ae` (three findings, all CONFIRMED and fixed in `0549b09`: the stale-comparison gap, 67a's range, 74a's ratio restriction), round 2 on `0549b09` (no new defects; one comment-wording nit left as is). Both banners named this repo.

**Delivery.** `check-ci-status` GREEN on `0549b09` for `reverify.yml` and `page-check.yml`. Pages build for `0549b09` built at 2026-10-19T16:41:15Z. `npm run served` at 16:43:31Z: "3 served, 0 in flight, 0 stale" (an earlier read at 16:41:13Z, two seconds before the build finished, read 67a and 74a STALE). Live read of the `57fc7ae`-only pages: 84a and 4b carry no release note; 34a and 25a carry theirs.

**Encounter.** Blind: the pages have no analytics (`A-59`). The one event that would show a reader met a note is an issue through that page's "looks wrong?" link (`npm run reports`: 0 outside arrivals today, 34 of 34 issues ours).

**Outcome.** Open; no read exists.

**What remains on A-78** (re-dated to 2026-10-26): 18 unchecked pairs; families 077, 078 and 101 carry no `leanDoc`; 8a needs a second reader; onTrigger step (3), drafting upstream notes, was not done today.

## What changed

- Four constant pages gained a statement-checked note on OpenAI's math release: 74a (10-point Seshadri constant), 67a (Brennan's exponent), 34a (planar Falconer threshold), 25a (Mahler volume product). 84a's note was withdrawn and 7a's comparison row corrected, because both had turned false on the live site after the 2026-10-18 resnap.
- `scripts/openai-math.mjs` now refuses a note whose mirrored page cites the release or has changed since the note was read.

<!-- findings:begin -->
**Finding, P3 start (2026-10-19 MT), record-facing on our own page:** since the 2026-10-18 resnap, the served `c/84a.html` shows upstream's new last upper-bound row `[OAI2026]` (4/3 − ε, OpenAI's release), and the release note we render beneath it still said the claim was "below the 4/3 in this constant's last-listed upper-bound row" and "It is not in the source table". Both were false on the live page for about a day. No bound cell was wrong. The resnap cycle did not catch it because nothing compared a note's "not in the source table" with the mirrored page. 4b's upstream page also lists the release (its `[OAI2026]` row), so the packet's plan to statement-check 4b and render it would have published the same false sentence. Bus status 78e14d0e. Codex r1 then found the same class on 7a (a named "last-listed" row that no longer was), which is why the fix pins each note to its page rather than patching sentences.

**Premise corrections to the packet:** (1) families 101, 077 and 078 (pairs 20b, 46a and 77a) have no `leanDoc` in the map, so they cannot be statement-checked from a Lean file; the slice reads at most six. (2) 8a: the release's zero-free half-plane Re s > 7/8 would, together with the zeros known to lie on the critical line up to a large height, put this constant at its lower bound 2/log γ₁. That is our derivation plus an outside fact, not the statement's own content, so it is left unchecked for a second reader rather than rendered today.
<!-- findings:end -->

Classification: the day's findings are record-facing on our own page (two release notes contradicting their tables) and instrument-facing in the fix; no number in a mirrored upstream row was found to disagree with its source. The standing prediction (the next record-facing catch is a citation-quality defect in a mirrored upstream entry, found by a human in the depth audit) was neither confirmed nor falsified: today's catch was in our own notes, not a mirrored entry.

## Inputs (controllable)

The A-78 slice (one item); two Codex review rounds; one targeted page check before push; `npm run check` once at close.

## Outputs (lagging)

Outside report arrivals: 0 (`npm run reports`, 34 raw issues, 34 ours, parts reconcile). Encounter on the new notes: blind (`A-59`).

positive control: `npm run reports` read 34 raw issues and classified every one, and today's refusal checks returned non-empty on real data (84a refused on the HEAD-of-day map; 7a refused when pinned to its pre-resnap page), so the zeros above are measured, not dead probes.

## Recommendation

None new for David. Upstream notes for the rendered pairs stay draft-only and are not drafted yet.

## On hold pending data

`A-84` (render-constant-pages store-validation fix, a declared deferral) expires 2026-10-25. `A-77`'s caller decision is carried to 2026-10-26.

## State Appendix

As of the close, from live commands (this report cannot name the commit that lands it):
- HEAD before the close commit: `7f35237` (`git -C C:/dev/skylark/bounds-ledger log -1`), "Report 2026-10-19: P1 packet and P3 state for A-78; ledger reads".
- CI on that HEAD: `check-ci-status --workflow reverify.yml` GREEN.
- Map: `node scripts/openai-math.mjs` → "31 pair(s): formal-proof 11, partial 0, none 0, unchecked 18, read-no-note 2; rendered 11", RESULT: VALID (exit 0).
- Due gates: `check-due-gates-dispositioned` → "verdict: CLEAR".

## Close

ACTION: COMPLETED · item A-78 · P3 bus bebe147c

Against the manager's REDIRECT acceptance (bus d9b6f6ba reviewed it COMPLETED, a slice under nine): `openai-math.mjs` unchecked 18 (was 23), rendered 11, read-no-note 2, RESULT: VALID; `--selftest` exit 0 with the new shape. **Why a resnap now turns the selftest red:** two public notes (84a, 7a) said something false about their own tables for about a day after the 2026-10-18 resnap, so rather than fixing the sentences alone, every rendered note is now pinned to its mirrored page (`sourceSha256`) and refused when that page cites the release or changes (`0549b09`).

**The two acceptance receipts the review asked for:**
- `npm run check`: RUN at `7f35237` (docs only since `0549b09`), exit 0, 2026-10-19 close; free memory 25313760 KB before it. "No drift. 118 files match upstream" at the upstream commit the mirror pins; "catch table: 18 cycles, and README.md says 18."; index, 117 constant pages, ramsey.html and deferrals PASS; brief UNVERIFIABLE (as every run). pragma: allowlist sha
- Claims pass: RUN, as the two Codex rounds' Part B. Round 1 checked every factual sentence of the four new notes' `claim` and `match`, and the two `read-no-note` reasons, against the Lean files and the mirrored pages, each marked HOLDS / REFUTED-AS-WRITTEN / UNVERIFIABLE-HERE; it refuted two (67a's range, 74a's restriction), fixed in `0549b09`. Round 2 checked the three changed sentences and the six unchanged notes' comparisons the same way: 74a and 67a HOLD, 7a's table comparison HOLDS and its Lean-to-definition sentence was UNVERIFIABLE-HERE (its Lean file was not fetched today; that sentence was checked on 2026-10-12 and did not change), all six unchanged notes HOLD. `57fc7ae` was never served on its own (no Pages build for it), so the two refuted sentences never reached readers.

**State since the P3 post:** unchanged; no new commits to pages.

**Ledger delta** (`node scripts/sky.mjs continuity-edit.mjs`):
- `A-78` (OpenAI's math release on the watched constants): note for today; nextCheckDate 2026-10-26. 18 unchecked pairs; families 077, 078 and 101 carry no leanDoc; 8a needs a second reader; onTrigger step (3), upstream note drafts, not done (draft-only, any send David's).
- `A-2` (standing drift log): hygiene line ACCEPTED in substance, AMENDED to `--set nextCheckDate 2026-10-26` (the draft's `--extend` writes a different clock field); note14 records the read.
- `A-77` (who calls the filed-report check): hygiene line UNDECIDED, AMENDED to a re-date to 2026-10-26 with the reason (the caller decision was not made today); note appended.
- `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned." with "snapshot CURRENT: taken today (2026-10-19)".

**Hygiene draft:** 2 lines, 0 accepted · 2 amended · 0 rejected. READ-MUTATED: none. check-wait-justification PASS (1 of 102 rows carry one); check-engineering-zero PASS, 0 findings for this lane.

**Pending reads:** 2026-10-20 `A-47` slice 20 and `A-82`; 2026-10-22 `A-83`; 2026-10-25 `A-45`, `A-84`; 2026-10-26 `A-78`, `A-77`, `A-2`. Encounter on the new notes stays blind (`A-59`).
