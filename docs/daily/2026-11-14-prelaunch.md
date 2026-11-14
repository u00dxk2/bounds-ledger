---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-14
lifecycle_stage: launched
last_deploy: "b8f69cf (as of about 17:23Z on 2026-11-14, check-ci-status read reverify.yml and page-check.yml green on b8f69cf; release: node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml, then --workflow page-check.yml; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: make the README's live-check instruction work for a visitor who clones the repo with nothing else beside it
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-14 (Saturday, MT)

## BLUF

A visitor who clones this repo and runs the README's live check now gets every ledger check, not an error. One maintainer check is skipped there, and the README says so.

## What changed

- P1 chose the day's work: `A-103` (a visitor's `npm run check` exits 2 before any check runs). The selection packet is in the State Appendix.
- Morning refresh of the open pull request lists: `open-pulls.mjs --fetch` read 95 open upstream at about 17:27Z (94 yesterday). The render changed 59 constant pages: 54 only the list's read date, 5 the list itself (1a gains 367, 1b gains 368, 49a gains 370, 42a drops 305, 82a drops 301). Pushed alone by sha as `b4bd1c8` after a read-only Codex round that found 0 defects and 0 changes outside the pull request sections. CI `reverify.yml` and `page-check.yml` green on `b4bd1c8`; Pages build row built; a live fetch of those five pages showed the three additions and not the two removals.
- **`A-103` shipped** (`b7dd96f`, `0e2937a`, pushed together at about 18:10Z; CI `reverify.yml` and `page-check.yml` green on `0e2937a`; Pages build row for `0e2937a` built). In a clone with nothing beside it, `npm run check`'s first leg (`scripts/check-entry-guard-leg.mjs`, new) prints `ENTRY GUARD NOT RUN` and moves on, instead of `sky: NOT RUNNABLE` and exit 2. It skips only when git answered and no `skylark-site` entry exists where the resolver looked; every other case goes to `sky.mjs` unchanged. README.md:112 names the skipped check and claims less about the exit code; README.md:55 now gives the Small Ramsey Numbers census (122 of 122 bounds attempted, 53 sound, 0 defective, 49 unresolved, 20 unreachable, rebuilt into the page on 2026-10-15 in `b167f64`); README.md:87 names slice 24 by date.
- Acceptance read, after the push: a fresh `git clone` of `0e2937a` into a scratch directory with no skylark-site beside it and `CC_PROMPTS_PIN`, `GITHUB_TOKEN` and `GITHUB_PERSONAL_ACCESS_TOKEN` cleared; `npm run check` exited 0, reached all twelve legs, and printed the skip line once. Before (fresh clone of `b8f69cf`): exit 2 at the first leg, no ledger leg run.
- Live reads after the Pages build: the index page footer still names `npm run check` (now runnable in a bare clone); the README at `0e2937a` carries the skip line, the census line and the dated slice, and no longer says "is the most recent slice".
- Review: three read-only Codex rounds on `A-103`. Round 1 found four defects; three were fixed and one is disclosed and not fixed (below). Round 2 found two prose claims still too strong; both were narrowed to its wording. Round 3 (claims only) found the README, repo-layout and comment sentences hold, and two leftovers in the commit body, corrected by an amend that changed the body only (tree identical to the reviewed commit).
- **Deviation from the review's acceptance condition:** "runs every check it names" does not hold for the entry guard in a bare clone. The guard lives in skylark-site and imports six of its library files directly, so running it there needs that code supplied or a standalone guard written; neither is in this ship. README.md:112 states the exception.

## Inputs (controllable)

- Section 0 reads, the morning block, two fresh-clone runs (before and after), one new leg script with a 21-assertion selftest and three red-arms, one corrective fixture fix, four read-only Codex rounds (one on the refresh, three on `A-103`), and the hygiene helper's draft (0 lines; wait-justification and engineering-zero both PASS).

<!-- findings:begin -->
- **The maintainers' full `npm run check` had stopped at its first leg since 2026-11-06.** The fleet entry guard reds a realpath-against-typed-path comparison even inside a string, and `scripts/check-import-inert.mjs`'s selftest (added in `63acb47`) wrote its fixture with exactly that line: `[NAIVE-ENTRY-GUARD] scripts/check-import-inert.mjs:201`, exit 3. Neither `npm run verify` (which omits that leg) nor CI ran the guard, so the defect sat outside both. Fixed in `b7dd96f`; the guard now reads "0 naive comparisons over 54 file(s)".
- **My first version of the skip was too broad.** It skipped on any unresolved verdict, so a maintainer whose git subprocess was blocked would have read a skip; Codex round 1 reproduced it. The fix claims less: skip only when git answered and nothing exists where the resolver looked. A red-arm restoring the broad version fails 6 of 21 assertions.
- **The README's exit-code sentence was refuted twice**, so it was cut back to the reviewer's narrower wording rather than patched a third time.
- Classification (one sentence of judgment, never a counter): today's findings concern our own check chain and our own README prose, so all are instrument-facing and none is record-facing; `npm run catches` was not run. Running count of consecutive instrument-facing days: 2 (counting 11-13; the 11-13 refactor night recorded no findings window of its own).
<!-- findings:end -->

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). `npm run traffic` read 5 unique repo viewers and 272 unique cloners in the latest 14-day window (repo views, not page readers).

## Recommendation

- [A — user-visible] On 11-19 continue `A-47` (the depth audit) at slice 25.
- [B — instrument, optional] A standalone entry guard in this repo would let a visitor's `npm run check` run the guard too. The manager called it optional; worth it only if the scripts' main-guard shape starts drifting here.
- [C — outward, gated, carried] The 3b DOI correction from 11-12 is still unsent: adversarial review and David's word first.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-14.md` (written at last night's refactor close). Its banner governs: morning block, then the reads dated today. `git pull --ff-only` printed "Already up to date."; `git rev-parse HEAD origin/main` printed `b8f69cfc01466bd3a90520c943f17fd3eed60a61` twice; `git rev-list --count origin/main...HEAD` printed 0.
- Listener: `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0 (session start 17:10:41Z). Loop-tick armed by tool call; waker ladder ranks 1 to 3 launched at about 17:11Z, rank 1 relaunched after its wake-shorten exit.
- Codex: GREEN per the kickoff's probe line (17:15:47Z, execute and write proved).
- CI, as of about 17:23Z: `check-ci-status.mjs --workflow reverify.yml --sha b8f69cfc01466bd3a90520c943f17fd3eed60a61` exit 0 and the same with `--workflow page-check.yml` exit 0, each "1 completed non-scheduled success(es) for HEAD". No local full run of the battery: CI is cited at HEAD.
- Deployed-sha drift: NOTHING SWEPT for this lane. The fleet table covered 38 Render services and exited 0, which says nothing about us; this lane publishes through GitHub Pages.
- Harness: running 2.1.325 · fleet UNIFORM · installed 2.1.325 (SAME).
- Board: `update-david-board.mjs --list` returned 0 cards for this lane. `answered-cards.mjs` showed 3 portfolio riders (`dd410b2a` screenshot piles, `2516f28c` refactor-night commands, `210b0834` the heavy-job queue), 0 new; none asks anything of this lane today.
- Yesterday's recommendations (`docs/daily/2026-11-13-prelaunch.md`): [A] `A-47` (the depth audit) slice 25 on 11-19: carrying, not due. [B] `A-98` (scripts that act when imported) on 11-20: carrying, not due. [C] the 3b DOI correction: carrying, outward and gated on adversarial review and David's word; not today's choice.
- Morning block reads: `npm run upstream` "0 transition(s) across 3 recorded report(s)"; `npm run traffic` as above; `open-pulls.mjs --fetch` 95 open; `render-constant-pages.mjs` wrote 120 pages, 59 changed.
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` "no product-love cycle picks this lane today", exit 0.

### P1 selection packet

- **Outcome:** `A-103`, the visitor's live check. A visitor who clones the repo and follows the README to get the live verdict will be told to run a command that runs on their machine, and whose exit code means what the README says it means.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out without redoing the literature search I did last year?" The README answers "for the live verdict, clone and run `npm run check`" (README.md:30). A visitor who does that gets `sky: NOT RUNNABLE` and exit 2, and README.md:112 has just told them non-zero "is a real finding". So the first live answer they get is a false alarm about our own setup.
- **Evidence:**
  - OBSERVED · fresh `git clone` of the public repo into a scratch directory with no skylark-site beside it · HEAD `b8f69cfc01466bd3a90520c943f17fd3eed60a61` · today about 17:30Z · `node scripts/sky.mjs check-entry-guard.mjs --root .` (the first leg of `package.json` `check`) printed `sky: NOT RUNNABLE — the skylark-site checkout could not be resolved` and exited 2. One clone, one machine. Re-confirms the 11-13 reproduction at `96a2ffa`.
  - OBSERVED · `package.json:10-22` read today · of the twelve `check` legs, only `check:entry-guard` goes through `scripts/sky.mjs`; the other eleven call `node scripts/<name>.mjs` directly. `npm run check` is an `&&` chain, so the first leg's exit 2 stops all eleven.
  - OBSERVED · `git grep -n "its exit code means what it says" -- README.md` (`A-103`'s read command) · today · one hit, `README.md:112`. README.md:30 ("clone and run `npm run check`") and README.md:143 (`npm run check    # LIVE: …`) point visitors at the same command.
  - OBSERVED · README.md:102, step 1 of the one-minute check (`node scripts/reverify.mjs --check && node scripts/check-claims.mjs`), does not go through `sky.mjs`; `CLAUDE.md` names it as the credential-free visitor check.
  - HYPOTHESIS · that the other eleven legs run in a sibling-free clone with a meaningful exit code. Not measured yet; it decides which fix is honest, and it is the first P3 step.
  - HYPOTHESIS, same README pass · two other README sentences the 11-13 read found false: README.md:55 says the Ramsey table rebuild has not landed (the row records it landing 2026-10-15, `b167f64`), and README.md:87 names `--draw 375 425 475 525 575` as the most recent depth-audit slice (slice 24 drew `209 259 309 359 409` on 2026-11-12). Each gets verified against its source before it is edited. README.md:176's correction count is a ruling, not a fact, and is left out.
  - MISSING · whether any visitor has run `npm run check` and hit this. GitHub traffic counts repo views and clones, not commands run; the 272 cloners include our own CI.
- **Permission:** `A-103` is an open lane row (status open, owner bounds-ledger, no park, no card, minted 2026-11-13). README is our own documentation, and correcting it is inside the lane's authority; it contacts nobody and flips nothing. It is public, so the outward gate's adversarial review (cross-family, Codex) runs before push, plus a claims pass on every changed factual sentence.
- **Next action:** improve. First measure, in the fresh clone, what each of the other eleven legs does with no skylark-site beside it. Then pick one of two fixes: (a) the README sends a visitor to commands that run standalone for the live verdict, and describes `npm run check` as the maintainers' battery that needs the sibling checkout; or (b) a visitor-runnable script (the battery without the entry guard) that the README names, if every leg in it runs standalone. Correct README.md:55 and :87 in the same commit if their sources confirm them. Round 0 fact list, Codex review, claims pass, push, re-run in a fresh clone of the pushed sha. First command:

  ```
  npm --prefix C:/Users/david/AppData/Local/Temp/claude/d9c8c09cfd7bdb18/03f3e3dc-f866-4403-9729-bb37969ab026/scratchpad/fresh-a103 run check:drift
  ```

- **Acceptance condition:** in a fresh clone of the pushed sha, with no skylark-site beside it, the command the README gives for the live verdict runs every check it names and exits 0 or with a real finding, never `NOT RUNNABLE`. No README sentence promises that exit meaning for a command that cannot deliver it there: `git grep -n "its exit code means what it says" -- README.md` either prints nothing or sits beside a command that runs standalone. README.md:55 and :87 either match their sources or are left unchanged with the reason recorded on `A-103`.
- **Delivery and encounter checks:** delivery is the pushed README on github.com (the repo's front page) plus the fresh-clone run at the pushed sha. Encounter is blind: nothing counts who runs a command. The only arrival that can show up is an issue filed by a visitor, counted by `npm run reports`, readable at N = 1.
- **USER-FACING: yes.** Paths: `README.md`; `package.json` if fix (b) is chosen; `continuity/items.json` (the `A-103` row). Not `index.html`: the Pages entry page is a separate surface, and this change does not touch it.
- **Standing obligation beside it, not the choice:** the morning open pull request refresh (95 open, 59 pages changed). Its own commit, a read-only Codex round, and a push by its own sha, before any `A-103` commit.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned.mjs --snapshot`, "0 gate(s) due on/before 2026-11-14".
  - (b) owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger" (0 of 823).
  - (c) state reads marked CROSSED: none. Read: the kickoff's state reads (stale-actionable 0 of 28; missingLinkedCommits NOTHING SWEPT, 0 of 0).
- **Key number:** the plan's number is how many of the README's three pointers to `npm run check` (README.md:30, :112, :143) send a visitor with no sibling checkout to a command that runs: 0 of 3 today, measured this round by the fresh-clone run above. The target is 3 of 3, either because the pointer names a command that runs or because it says what the command needs. It measures what the README tells a visitor to do, not whether anyone does it. A Glob for `docs/{key-metrics.json,evangelism-bar.md}` returned only `docs\evangelism-bar.md` (positive control: the same Glob found that file), so this lane has no key-metrics list yet and no hub number applies.
- **A prior-day retro finding that bears on the choice:** Q2 on 11-13, "Round 0 should have covered the report and primer, not only the four settle sentences." Today's change is a set of public factual sentences, so round 0 lists every changed README sentence AND this report's and the primer's claims about it before review.

### Close

- ACTION: COMPLETED · item `A-103` · P3 `0d34186c`. The acceptance in force (the manager's REDIRECT) was met: in a fresh clone of `0e2937a` with no skylark-site beside it and credential variables cleared, `npm run check` exited 0 and reached all twelve legs, printing the entry-guard skip once; the manager reproduced it in an independent clone. Manager review of P3: COMPLETED, key number 5 of 5 by each pointer's own words (none of the five promises the entry guard; every claim leg runs).
- Changed since the P3 post: no shipped file. The close changes the ledger, `continuity/traffic.json`, this report and the primer.
- Ledger delta (`continuity-edit.mjs`): `A-103` open → monitoring (built and delivered; outcome read open), readCommand re-pointed from a README phrase this ship removed to `npm run reports`, next check 2026-11-21, closeWhen rewritten for the outcome read with a 2026-12-14 end, ship note with the literal acceptance output. The manager's review said close; this phase's rule keeps a shipped change still owed an outcome read at monitoring, as `A-102` was on 11-13. Hygiene draft: 0 lines (0 accepted, 0 amended, 0 rejected); its checks: wait-justification PASS (2 of 126 rows carry a wait), engineering-zero PASS for this lane; no READ-MUTATED lines.
- Due gates: `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-14).
- Pending reads, by date:
  - 11-15: `A-45` (the Tier-1 leading indicator), `A-91` (upstream's 67a citation, held at the outward gate), `W-11` (search our own record before calling a claim decision-ready).
  - 11-16: `A-78` (OpenAI's math release mapped onto our constants), `A-81` (newer-result watcher for the Ramsey area), `G-4` (an outside party acts on a watched record without our report), `W-17` (the newer-papers line on every constant page).
  - 11-17: `W-4` (every new detector shows both answers), `W-8` (a materially amended outward artifact goes back to review), `W-13` (someone must call the served-bytes check).
  - 11-18: `A-59` (encounter is blind on the public pages), `W-19` (the second Search Console read).
  - 11-19: `A-47` (the depth audit), slice 25.
  - 11-20: `A-93` (Anthropic's formal-math repository mapped onto our constants), `A-98` (scripts that act when imported), `A-102` (the unread-source settle lines' outcome read).
  - 11-21: `A-103` (the visitor's live check), its outcome read: the first outside report showing a visitor ran the check, N = 1.
- Overnight refactor: changed nothing in today's work. Instance: the two legs whose modules were split on 11-13, `check:ds1` and `check:ramsey`, printed "IN SYNC — revision #18" and "RESULT: PASS" in both fresh-clone runs, and no file edited today was one of the split files.
- W-7 — `npm run check:entry-guard` (the fleet entry guard) claims to refuse any script line comparing a realpath with the path as typed. Run on this machine it printed exit 3 on a selftest fixture string, a finding present since 2026-11-06 that no instrument surfaced, because `npm run verify` omits that leg and CI never runs it. Its output could say otherwise; nothing read it.
- Standing prediction (quoted from `CLAUDE.md`): the next record-facing catch will be a citation-quality defect in a mirrored upstream entry, found by a human reading the cited source in the depth audit. Today held no record-facing catch, so it was neither confirmed nor falsified.