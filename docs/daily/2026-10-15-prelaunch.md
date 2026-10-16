---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-15
lifecycle_stage: launched
last_deploy: 1eaaeab (HEAD at the 10-15 kickoff)
on_hold_items: 1
top_action_today: A-54 census session, up to four more Small Ramsey Numbers papers read against the bounds they are credited with
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-15 (Thursday, MT)

## BLUF

Every number on the Small Ramsey Numbers page has now been checked against the paper it credits, or says why it could not be.
That page went live this evening: each value now says whether we checked it ourselves or took it from the survey.

## What changed

### Day session — P1 selection packet

The full packet, as posted to the bus, is `tmp/p1-2026-10-15-packet.md`. Its substance:

**Outcome:** `A-54` (Small Ramsey Numbers, the second watched area), census session. Read up to four more papers credited in Table Ia, from XXER in the derived census order.

**The two "papers left" counts are reconciled, and neither moved.** The lead's 9 is the 7 Table Ia papers still unread (XXER, XSR2, XuXR, BurR, Ea1, ShZ1, Shi2: 10 bounds, which equals 122 − 112) plus AnM2 and AnM3, the Table Ib group credit. `ds1-depth.mjs` reads Table Ia only, so it prints 35 of 42.

**The census tripwire fires today.** The 10-14 census slot went to `A-47` slice 17 (the depth audit), and the row was moved to 10-15 without the tripwire being run. Through the 10-18 census end there are 2 census slots left (10-15 and 10-17), so capacity is 4 × 2 = 8, against 9 papers. Completion is restated at P3, before any source opens, from 2026-10-22 to 2026-10-23: the census ends in the 10-19 slot, the page renders in the 10-21 slot, and it lands in the 10-23 slot.

**Evidence:** `npm run reports` read 0 outside arrivals of 33 issues, and the parts sum. Encounter is MISSING (`A-59`, the blind spot on the public pages).

**CI disagreement, recorded:** the kickoff read HEAD as RED on a cancelled `pages-build-deployment` run (38654551415). A second Pages run for the same sha succeeded (38654554450), the builds API shows `built` for `1eaaeab`, and `check-ci-status` reads GREEN on both `reverify.yml` and `page-check.yml`.

**USER-FACING: yes** (conservative). Paths: `continuity/depth-audit-ds1.json`, `continuity/items.json`. Census rows stay off `ramsey.html` until the landing.

**HYGIENE INPUTS:** (a) 1: `W-11` (search our own record before calling a claim decision-ready; its read has never been run). (b) none: 0 of 754. (c) 1: HEAD CI RED in the kickoff, which the live reads above contradict.

### Day session — P3: the census closes

The manager redirected the packet (bus `5bb6bd4e`): read all seven remaining Table Ia papers today, not four, because four a slot is a planning rate and these seven carry only 10 bounds. The plan went up first as `22491a7`, before any source was opened.

**Result:** `node scripts/ds1-depth.mjs` reads "census: 122 of 122 bound(s), across 42 of 42 credited paper(s) — 53 sound, 0 defective, 49 unresolved, 20 unreachable" (exit 0). Every paper in the census order has now been attempted. Today's ten bounds:

| Key | Verdict | What was reached |
|---|---|---|
| XXER (2) | SOUND | the cited EJC edition; printed pp. 16 and 22 |
| Shi2 (1) | SOUND | Elsevier's typeset edition in full; printed p. 264, item 6 |
| Ea1 (2) | 3583 SOUND, 12677 UNRESOLVED | the survey's own 2.3(a) derivation; 12677 rests on ShZ1's 6588 |
| XSR2 (2) | UNRESOLVED | the authors' preprint plus SIAM's abstract; SIAM body behind a challenge |
| XuXR (1) | UNRESOLVED | the authors' preprint; Wiley body not reached |
| BurR (1) | UNRESOLVED | an abstract that names no value |
| ShZ1 (1) | UNREACHABLE | no public copy of the 2001 manuscript |

**Six readings were voided and redone.** The first six reading agents kept their helper scripts in a shared folder, which the brief's hard limit forbids ("any breach voids the reading"). My first answer was a ruling that kept them; the second Codex round refuted it, because the rule has no exception. All six were re-run under a corrected brief, every replacement complied, and the stored rows cite only the replacements. One verdict moved: Shi2 went from UNRESOLVED to SOUND, because its replacement reader found the publisher's PDF.

**Release date:** the census closed in today's slot, so the Ramsey page is rendered on 10-17 and reviewed and landed on 10-19, three days earlier than the 10-22 date this morning's tripwire would otherwise have pushed to 10-23. The census rows stay off `ramsey.html` until that landing.

**Found on a live page:** `copying.html` says the audit notes keep the survey's bibliography entries word for word, "5 of them so far". The notes also quote them in free text in 45 rows (15 from census session 6, 30 from session 7), which the count cannot see. The live sentence understates what we copy. It is owed in the 10-17 render (`A-54.disclosureUndercount2026_10_15`).

**Reviews:** three Codex read-only rounds, banner workdir checked each time: FIX-THEN-PUSH, FIX-THEN-PUSH (the blocker above), and no blocker on the third, whose two narrowings landed in `420f8e5`.

<!-- findings:begin -->
- The 10-14 census slot moved to 10-15 without its tripwire being run; the tripwire run today fired (9 papers against 8 slots of capacity) and the redirect then closed the census, so the date moved earlier rather than later.
- Parallel reading agents share the session scratchpad. A brief that confines output files but not helper scripts lets them overwrite each other. The census8b brief confines scripts too.
- The live disclosure on `copying.html` understates what the repository copies from the survey (45 free-text rows against a stated 5).
<!-- findings:end -->

### Close (2026-10-15 afternoon MT)

**ACTION: COMPLETED** · item `A-54` (the Small Ramsey Numbers census) · P3 `b6a328a4`. The redirect's acceptance condition was met: `ds1-depth.mjs` prints 42 of 42 papers. The manager's review re-ran it and got the same line, and found the plan `22491a7` and the readings `91e5536`, `406e3c9`, `24c0347` and `420f8e5` on origin/main, the plan first (bus `4bb0fd20`).

**Since the P3 post:** the report went up as `430cf6a`. CI is GREEN on it for reverify.yml and page-check.yml.

**Ledger delta (hygiene draft: 2 lines — 0 accepted · 2 amended · 0 rejected):**
- W-11 (search our own record before calling a claim ready to send), AMENDED. The drafted read command was applied: `git grep -n -F 0.380926 -- ledger/claims.json docs/findings/` replaces a `grep` the runner's shell does not have. Its first real run exited 0 with 24 lines, hits in both expected files. The amendment: before re-dating, the 10-15 read the row asks for found ONE unsearched assertion. The A-57 correction was put to David as ready on 10-07 with no search of our record named in its draft or that day's report. A positive control proved the pattern works (2 hits on the A-51 draft). It is recorded as `W-11.read2026_10_15`. The re-date uses `--set expectedSignalBy 2026-11-15`, not the drafted `--extend`, because `--extend` also edits `closeWhen`.
- W-11 (the same watch, on the stale-actionable list), AMENDED the same way. One execution answers both lists.
- A-54 was re-dated at P3 to 10-17 (the render). The completion is 10-19, its census record is `census8_2026_10_15`, and the disclosure finding is `disclosureUndercount2026_10_15`.

The draft had no READ-MUTATED lines. Its checks read wait-justification PASS (1 of 97 rows carry a wait) and engineering-zero PASS (0 findings for this lane). Positive control: the same engineering-zero run printed RED for two other lanes' Sentry issues (buddha-ur, frame-dial), so it read live data. `check-due-gates-dispositioned.mjs`: "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-15).

**Receipt:** P3's line in `b6a328a4` still holds (`USER-VISIBLE: none`, the readings held off the page until the landing). No bracket changed.

**Classification (by hand, not a counter):** today's findings are all instrument-facing: our own live disclosure sentence, our own reading brief, and our own process (an unsearched assertion). No cited source contradicted its record; the census stored 0 DEFECTIVE. No counted catch moved, numeric or byte-only. The standing prediction (the next record-facing catch will be a citation-quality defect found by a human reading the cited source in `A-47`) was neither confirmed nor falsified today. **Consecutive instrument-facing days: 1**, counted by hand.

### Evening session — P1 selection packet

**Outcome:** `A-54` (Small Ramsey Numbers, the second watched area). Render the page with the census results, pulled forward from the 10-17 slot. Build it on a branch, not main: the freeze lifts only when it lands on 10-19, after its adversarial review. The `pageRows()` census filter is removed in the same commit. The `copying.html` undercount is fixed in the same change. Table Ib's 50 group-credited upper bounds get a marking, decided and written down.

**The user problem, in the reader's words (our paraphrase, not a real user's; no real-user words exist, see MISSING):** "I'm about to cite R(5, 5) ≤ 46. Did anyone check that number against the paper it's credited to, or is this just the survey copied?"

**Evidence:**
- OBSERVED: `node scripts/ds1-depth.mjs`, 2026-10-15 evening, at `aa76440`: "census: 122 of 122 bound(s), across 42 of 42 credited paper(s) — 53 sound, 0 defective, 49 unresolved, 20 unreachable" (exit 0). The same run reads 127 readings stored: 5 bounds were also read in the 09-18 drawn slice. I checked each of those 5 pairs, and the drawn verdict equals the census verdict in all 5.
- OBSERVED: the committed `ramsey.html` (`render-ramsey --check` PASS in tonight's verify) prints "So far, of the 128 values Table Ia prints: sound 2 … unresolved 2 … unreachable 1 · not yet read 117 · nothing to read it against 6". The census verdicts are invisible to a reader, as the freeze intends.
- OBSERVED, re-measured tonight because my rule is to re-measure any figure I quote: the live `copying.html` says "5 of them so far". The review's pattern finds 45 rows (session 6: 15, session 7: 30). A wider read finds whole survey entries quoted for identification in rows that pattern misses: DS1-0058 (Spe4), DS1-0064 (SuLL), and DS1-0068, DS1-0070, DS1-0076 and DS1-0081 (HZ1), so DS1-0064 is a census session 5 row. **45 is a floor, not the count.** The 5 `surveyRefEntry` fields come on top of it. The exact count will be measured against the survey's own reference list, which is saved locally under `tmp/` and not stored in the repo, before the disclosure is rewritten. If the pass bar's "45" differs from that figure, the difference will be named.
- OBSERVED: 69 census rows are UNRESOLVED or UNREACHABLE, and none carries a `pageNote`. The page guard refuses those verdicts without one (`render-ramsey.mjs` leg 7b), so the render owes 69 page notes. They fall into 22 groups of credited key and verdict.
- OBSERVED: `npm run reports`, 2026-10-15 evening: 0 outside arrivals. 33 issues were fetched and all 33 are ours, and the parts sum.
- MISSING: any real-user encounter with `ramsey.html`. Encounter on the public pages is blind (`A-59`), and the evangelism bar's metric is NOT MEASURABLE (`docs/evangelism-bar.md`).
- MISSING: `check-cycle-rotation --lane bounds-ledger` exited 2, UNDETERMINED: "no real-user-evidence artifact on record for bounds-ledger; the registry does not declare which lanes owe one". That is not "nothing due"; it is an unread state.

**Permission:** David ruled on 2026-09-20 to rebuild the table as our own arrangement and keep crediting the survey. His partial-table ruling the same day added: source whatever we can, and label the rest as credited to the survey and not independently checked. His freeze says to leave the page as written until the rebuild lands, so tonight's build stays on a branch and main's pages do not change. The 10-19 landing goes through an adversarial review first. No David decision is open: `answered-cards` read no waiting or answered cards. The Table Ib marking is a scoping choice inside his ruling, so I decide it and record why, and it goes into the review.

**Next action (deliver built value):** the readings exist and no reader can see them. First command:

```
git -C C:/dev/skylark/bounds-ledger switch -c a54-render
```

Then, in order:
1. Measure the copied-entry count against the survey's reference list, using an oracle that shares no code with the store.
2. Write the 69 page notes from each group's `sourceRead`.
3. Renderer changes: lift the filter; one state per bound, refusing a bound whose readings disagree; each value carries David's two states; Table Ib marked; the disclosure counts a structured field instead of a regex over free text; the lede and method sentences rewritten for a census.
4. Selftests, with both answers shown.
5. A Codex read-only round, with the method sentences as their own review call.
6. Open a PR, so `page-check.yml` runs on the branch through its `pull_request` trigger.

**Acceptance (pass bar):**
- RED, live: `ramsey.html` shows no census verdict ("not yet read 117"), and `copying.html` says 5.
- GREEN, on the branch: every Table Ia value shows its verdict and David's two-state label. The rendered counts read sound 53, defective 0, unresolved 49, unreachable 20, nothing to read it against 6. Every Table Ib value carries its marking.
- `copying.html` states the count measured at step 1, with any difference from 45 named.
- `node scripts/render-ramsey.mjs --check` and `--selftest` pass.
- Positive controls: `node scripts/check-claims.mjs` exits 0, and `page-check` passes on the PR.

**Delivery and encounter checks:** delivery is read when it lands on 10-19, by `npm run served` (SERVED for `ramsey.html` and `copying.html`). Encounter is blind (`A-59`). The one event that would show it is a looks-wrong report on a Ramsey entry, counted by `npm run reports`, and it is readable at N=1.

**USER-FACING: yes.** Paths: `scripts/render-ramsey.mjs`, `ramsey.html`, `copying.html`, `continuity/depth-audit-ds1.json` (page notes and the copied-entry marker), `continuity/items.json`. Main's pages stay as they are until the 10-19 landing.

**A finding of mine that recurred and bears on this:** "a measurement I quote gets re-measured at HEAD" (10-16 primer). The 45 handed on in the kickoff and in my own report was re-measured tonight and is a floor.

**HYGIENE INPUTS:**
- (a) none. Read: dated gates due today, 0 (`check-due-gates-dispositioned --print`, 97 rows swept).
- (b) none. Read: rows owed in skylark-site's ledger, 0 of 754.
- (c) none. Read: the kickoff's state reads; none is marked CROSSED. HEAD CI is GREEN on `aa76440` (3 successes, 0 failures), stale-actionable is 0 of 20, and missingLinkedCommits is NOTHING SWEPT, 0 of 0.

**Already done tonight, outside the choice:** the `A-47` slice 18 draw was pushed before any source opened, as `0a8dd77` (origin/main; `git rev-list --count origin/main..HEAD` read 0).

### Evening session — P3: the Ramsey page shows its census verdicts

**Landed on main as `b167f64` (PR #43),** four days ahead of the 10-19 slot, on the manager's ruling that the review, not the date, is the trigger (bus `894612a7`).

**What a reader now sees** on `ramsey.html`: every Table Ia value marked "independently sourced" or "credited to the survey and not independently checked". Each one marked the second way says why. The live count line reads sound 53, defective 0, unresolved 49, unreachable 20, not yet read 0, nothing to read it against 6. Before tonight it read "not yet read 117". `copying.html` now says 56 copied survey entries; it said 5.

**Table Ib, decided:** every value is credited to the survey, because the census read Table Ia only. R(4, 5) is the exception. The survey credits it to [MR4] alone, and the same bound was read SOUND in Table Ia, so it is marked independently sourced.

**The copied-entry count is 56, not the 45 handed on.** The pattern behind 45 missed six rows that quote an entry "for identification only", two of them from census session 5. The page now counts a field that a stated rule sets and checks, not free text.

**Review:** four Codex read-only rounds:
- code: 3 findings;
- a claims pass over 37 sentences: 11 overstated, all narrowed;
- the fixes: 1 MAJOR, a DEFECTIVE twin in Table Ib;
- final: SHIP.

Every fix that added a check was red-armed.

<!-- findings:begin -->
- The handed-on figure of 45 copied survey entries was a floor; re-measured at HEAD it is 51 quoted plus 5 stored, so 56. The review note's "none from sessions 1 to 5" was also false.
- The claims pass refuted 11 of 37 sentences I wrote, eight of them notes or method sentences claiming more than their rows recorded. The method sentence is still where my defects land.
- I reported a commit `9e3c4b1` that does not exist; the real one was `b31bf36`. That is the fabricated-sha shape again, in a chat status line rather than a post, where no `verify-sha` gate reads it.
<!-- findings:end -->

### Close (2026-10-15 evening MT)

**ACTION: COMPLETED** · item `A-54` (the Small Ramsey Numbers rebuild) · P3 `bdf6bc90`. The acceptance condition in force was the P1 review's: render the census verdicts and land once the adversarial review passes. Codex r3 returned SHIP on `f77a401`, the merge followed as `b167f64`, and the manager's P3 review re-fetched both live pages (bus `3654d23b`).

**Since the P3 post:** nothing on the page changed. The ledger and report went up as `e4e9411`.

**Ledger delta:**
- `A-54` CLOSED. The close note is on the row; the detail is in `rebuildLanded2026_10_15`. The fields that still scheduled a 10-17 render were retired before the close: `onTrigger` was rewritten as RETIRED, with its previous text kept verbatim in `onTriggerBeforeClose2026_10_15`; `expectedSignalBy` (2026-10-17) was deleted; `signalDateNote` gained a retirement line.
- AGENTS.md: the line saying census rows are held off the pages by `pageRows()` was false after the landing. It is rewritten to describe the two states and the `surveyEntryQuoted` rule.
- `A-47` slice 18 stays due 2026-10-16. Its draw is `0a8dd77`.

**Hygiene draft:** 0 lines (`tmp/hygiene-draft-bounds-ledger-2026-10-15-evening.md`). Wait-justification PASS (1 of 97 rows carry a wait); engineering-zero PASS (0 findings). No READ-MUTATED lines. `check-due-gates-dispositioned.mjs`: "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-15).

**Receipt:** P3's line in `bdf6bc90` still holds. No bracket changed.

**Pending reads:** `A-47` slice 18's reading on 10-16. The encounter on `ramsey.html` stays blind (`A-59`); its only signal is a filed report, read by `npm run reports`.

**Correction, as the manager asked:** the evening P1 report section was committed as `b31bf36`; the id I first reported for it resolves to no commit.

### Night round (round 3) — P1 selection packet

**Outcome:** a watcher for newer Ramsey results on arXiv (a new ledger item, filed at P3 with the next free id, read from the ledger rather than assumed; plain label: "newer-result watcher, Small Ramsey Numbers"). **The user's problem in their words:** "is the number I already have still true?" Tonight a newer arXiv paper that beats a bound on `ramsey.html` goes unseen until the survey publishes a new revision.

**Evidence** (OBSERVED / HYPOTHESIS / MISSING):
- OBSERVED, no watcher exists: Grep for `arxiv` (case-insensitive) over `scripts/` hits only `render-site.mjs`, `history-sweep.mjs` and `check-claims.mjs`, and none of them queries the arXiv API. The same Grep over `.github/` hits nothing. The positive control is that the search found `check-claims.mjs`'s known arXiv-abstract claims (C-4/C-5), so the search could see arXiv references.
- OBSERVED, the window start: `ledger/ejc-ds1/section-2-1.json` gives `"revision": 18` and `"revisionDate": "2026-04-24"`, the revision the page mirrors.
- OBSERVED, the API is reachable from THIS machine tonight (between the 04:56Z kickoff and this post; the probe printed no timestamp of its own): `export.arxiv.org/api/query?search_query=cat:math.CO AND abs:Ramsey AND submittedDate:[202604240000 TO 202610160000]&max_results=200` returned HTTP 200 with 149 entries (under the 200 cap, so the whole result set). The first five are canonical-Ramsey/geometry papers (e.g. 2608.19183 "The regular pentagon is canonically Ramsey"), so most of the 149 will be unrelated to small Ramsey numbers. This shows the window is not empty and the reader's main job is sorting.
- UNREAD, the API from the scheduled CI runner. CI does fetch `arxiv.org/abs/...` pages for C-4/C-5 through `check-claims.mjs`, but that is a different host from `export.arxiv.org`. Tonight's watcher runs locally, so this does not block it. A scheduled run is a later round, for the reason under Permission.
- HYPOTHESIS, the query's reach: `abs:Ramsey` within `cat:math.CO` (cross-lists included) should catch a small-Ramsey-number paper. A paper listed only in cs.DM or math.PR, or one that never says "Ramsey" in its abstract, would be missed. P3 states this limit in the script's own `blindTo` line and does not fix it by widening the query until something is found.
- OBSERVED, product-love metric: NOT MEASURABLE (`docs/evangelism-bar.md` § metric). G-4's indicator `npm run reports`, read tonight: 33 raw issues, 33 ours, 0 outside arrivals, and the parts reconcile. Encounter is blind on the public pages (`A-59`).
- `check-cycle-rotation.mjs --lane bounds-ledger`: exit 2 REVIEW, "UNDETERMINED — no real-user-evidence artifact on record … the registry does not declare which lanes owe one". So no product-love pass is shown as due. This is a registry gap, not "nothing due".

**Permission:** a new local, read-only script under the lane's own authority (ship obvious first-order improvements). It makes no upstream contact and does not render. **Two outward-gate constraints, both because the repo is PUBLIC:** (1) candidate records go to `tmp/arxiv-watch/` (gitignored), never `ledger/`. A committed "paper X claims to beat row Y" is an unverified mathematical statement about someone else's work, published. (2) The watcher does NOT run in CI tonight. A CI step's stdout is a public surface (AGENTS.md: the drift alarm's output is published verbatim), so a scheduled run needs its own adversarial review of what it prints. No David decision is needed for either.

**Next action** (kind: improve):
```bash
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --corpus
```
That is a read of the existing parser and population before building, so the watcher reuses the repo's own row keys rather than inventing a second parser. Then build `scripts/arxiv-watch.mjs`: (a) fetch the window, one page of 200 at most, and REFUSE rather than truncate if the total exceeds the page; (b) a model reader (a subagent brief returning text, saved by me) classifies each paper as `claims-a-better-bound`, `mentions-only` or `unrelated` from the abstract, and reads full text for any abstract naming a small Ramsey value; (c) each candidate record holds the row key, our shown value, the claimed value, the arXiv id and version, and the quoted line; (d) `--selftest` is network-free on fixtures.

**Acceptance condition (pass bar, written before building):** RED today, because no record of any post-revision paper exists (`tmp/arxiv-watch/` does not exist). GREEN after: one run lists EVERY paper in the window (the count printed equals the API's count, and the verdicts sum to it), each with a verdict, and every candidate quoted from the paper. **Positive control:** an arXiv paper the survey already credits, fed in as if it were new, is found and matched to its row with the value the survey gives it (P3 picks it from the frame's credited keys before any reading, because `ledger/ejc-ds1` holds no arXiv links). **Negative control:** a fixture with no bound is classed `unrelated`. The selftest red-arms both (KP-78), and `render-ramsey.mjs --check` and `check-claims.mjs` stay PASS.

**Delivery and encounter:** none, by design. Nothing a reader sees changes tonight. The read that matters is the first real run's candidate count and how many of those candidates survive a human reading of the paper. The P5 receipt will be `USER-VISIBLE: none — …`.

`USER-FACING: no` — paths: `scripts/arxiv-watch.mjs` (new), its fixtures under `scripts/fixtures/`, `package.json` (selftest in `npm test`), `.github/workflows/reverify.yml` (the selftest step only, which `reverify.test.mjs` requires; network-free), `tmp/arxiv-watch/` (gitignored), `continuity/items.json`, `docs/`.

**Carries (not the choice):** `A-47` slice 18 is due 2026-10-16 (draw `0a8dd77`: 27b, 33a, 3c, 45a). It is a dated obligation for the next day, not tonight's work. `npm run verify` is running now, and its receipt will be quoted at P3. The 20c author name and 1a line 18's 1.503164 stay unfiled upstream. David's essay is untouched.

**Prior-day retro finding that bears on the choice:** none recurred. The one carried finding (the KL2022 author-name note, on `A-47`) does not touch the watcher.

**Section 0:** Listener 🟢 SSE alive (restart 04:35:31Z, hello 04:35:32Z) and the thin loop is armed by tool call. Codex GREEN by the prompt's own probe line (04:50:42Z). CI GREEN on HEAD `19296da69c` for reverify.yml and page-check.yml (`check-ci-status.mjs`, exit 0 each). Deploy drift: not run. This is a Pages lane with no Render service declared (primer: "service: NOT DECLARED"), the class that reads NOTHING SWEPT. Harness: running 2.1.301 · fleet UNIFORM (27 of 27) · installed 2.1.301 (SAME). Recs from the 10-15 close: slice 18 is carried to 10-16. The 10-17 render was executed early (`b167f64`, A-54 closed). The reading-brief rule is carrying. The two upstream candidates are held. Due-gates: the morning snapshot for 2026-10-15 stands, and a re-snapshot was refused (exit 2, would drop A-54 and W-11, both dispositioned since the morning).

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: none. Read: kickoff `dated gates due today: 0`.
- (b) owed child rows: none. Read: kickoff `rows owed to you … 0 of 754`.
- (c) CROSSED state reads: none crossed. One was not judgeable: `missingLinkedCommits` NOTHING SWEPT (0 of 0 considered).

## Inputs (controllable)

- One census session: a tripwire, a plan pushed before any source opened, seven papers, six reading agents run twice (the first six readings voided), and three Codex read-only review rounds.
- The hygiene helper's two drafts, applied above.

## Outputs (lagging)

- `npm run reports`: 0 outside arrivals (33 raw, 33 ours; the parts sum). G-4 is still at expected zero.
- Encounter is blind on the public pages (`A-59`), and the census rows are held off `ramsey.html` until 10-19 by design.

## Recommendation

- Slice 18 of `A-47` on 10-16, at positions 219, 269, 319 and 369.
- The Ramsey page render on 10-17: census verdicts on the page, the `pageRows()` filter removed in the same commit, and the `copying.html` undercount fixed. Review and land on 10-19.
- New reading briefs copy `tmp/depth-reads/census8b/brief-common.md`, which keeps every helper script in its reader's own folder.
- The two upstream candidates (20c's author name, 1a line 18's 1.503164) stay behind the outward gate.

## On hold pending data

- G-4: an outside report through a per-row link. None yet.
- The Ramsey page's first outcome read is the 10-19 landing.
- W-14 (the watch on upstream issue 218): re-read on 10-21.

## State Appendix

Written last, from live commands, as of the close commit's parent. This report cannot name the commit that lands it.
- `git -C C:/dev/skylark/bounds-ledger rev-parse --short HEAD` before the close commit: `430cf6a`. CI GREEN there on reverify.yml and page-check.yml (`check-ci-status.mjs`, exit 0 each).
- `node scripts/ds1-depth.mjs`: census 122 of 122 bounds, 42 of 42 papers, 53 sound, 0 defective, 49 unresolved, 20 unreachable (exit 0).
- `check-due-gates-dispositioned.mjs`: CLEAR, snapshot CURRENT.
- Release: re-run those commands; never quote these values as current.
