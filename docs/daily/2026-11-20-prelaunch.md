---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-20
lifecycle_stage: launched
last_deploy: "534a210 (as of the P1 read on 2026-11-20, check-ci-status read reverify.yml and page-check.yml green on 534a210; release: node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml, then --workflow page-check.yml; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: rewrite README.md, the repository's front page on GitHub, in the product's voice (exact, plain, checkable), keeping every command and every number it states
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-20 (Friday, MT)

## BLUF

A visitor who opens the repository on GitHub now reads "Is your number in here?" first, with the index link and a two-command check.

Two stale counts on that page were corrected from source, and the history and method now come after.

## What changed

- P1 chose the day's work: `README.md` in the product's voice, `docs/SCREENS.md`'s last NEXT row, pulled forward from its 2026-11-24 date under `A-110` (the design pass). The selection packet is in the State Appendix.
- **The README, shipped as `a387b16`, `8756443`, `a7b5119` and `4205be4`** (pushed `534a210..4205be4`).
  - The page opens with "Is your number in here?": the index link and what each row shows, the Ramsey page, and the two-command check. "One catch, verbatim" and "The problem, concretely" follow, then the unchanged history and method.
  - Numbers re-read from source today, not carried: the depth audit was stale in the README (34 audited, as of 2026-09-26). `node scripts/depth-audit.mjs` printed "111 row(s) audited — 66 sound, 1 defective, 30 unresolved, 14 unreachable", and the README now calls them 111 audit entries. The correction count was stale too: 2 → 3, adding upstream pull request #244 (the 13a reference title and DOI), merged by the maintainer 2026-10-26T03:45:09Z per `gh pr view`. The Ramsey census matched `node scripts/ds1-depth.mjs` and took today's as-of.
  - Commands: a script diff of fenced lines and `node`/`npm`/`git`/`gh` code spans found 22 in the old README and 22 in the new, 0 missing. It was red-armed by dropping one command in memory, which printed "MISSING: git show da17be3 ..." and exited 1.
  - Review: three read-only Codex rounds, banner workdir checked each time. Round 1 on `a387b16`: FIX FIRST, 21 sentences refuted or unverifiable as written, most of them wording carried from the old README ("goes red when one moves", "current upper and lower rows", "byte-identical", "verified against the primary source"); each narrowed in `8756443`. Round 2 on `8756443`: FIX FIRST; its HIGH was mine (below); the class repeated, so its own narrower sentences were adopted in `a7b5119` rather than reworded again. Round 3 on `a7b5119`: two sentences fixed with its wording in `4205be4`, one HIGH carried.
  - Delivery: CI `reverify.yml` and `page-check.yml` green on `4205be4`. A signed-out GET of the repository page returned 200, with "Is your number in here?" 6 times, "111 audit entries" 2, "three externally acknowledged corrections" 2, and "erdosproblems.com/36" 0 in the same fetch.
- **The open pull request refresh, committed as `8d245ec`** (standing, `A-96` option b): 103 open upstream, 100 changing a constant file (100 open on 11-19); 61 constant pages re-dated; `render-constant-pages.mjs --check` printed "PASS — 120 constant page(s) match committed state". Read-only Codex round on `8d245ec` (banner workdir checked): VERDICT: PUSH, no findings ("Every changed HTML line is fully explained by the ledger update"; no titles or author names). Pushed by sha (`4205be4..8d245ec`); CI `reverify.yml` and `page-check.yml` green on `8d245ec`; the Pages build row for `8d245ec` was built (16:35:59Z). Signed-out GETs of `c/4a.html`, `c/65a.html` and `c/84b.html` each returned 200 carrying its newly listed pull request (#378, #377, #376) and the 2026-11-20 read date.

## Inputs (controllable)

- Section 0 reads (State Appendix), the `A-108`, `A-110` and `A-103` rows, `docs/evangelism-bar.md`, `docs/PRODUCT.md` § Voice, and a word count and voice-lint read of `README.md`.

<!-- findings:begin -->
- My round-1 fix to the founding paragraph added the value the problem index page displayed and the month it was read. Codex round 2 rated it HIGH: it said more about that page than the parent README did, the substance of the public comment declined on 2026-08-02. Narrowed in `a7b5119`; the page is no longer named in README.md. Record-facing or instrument-facing: neither; a defect in our own outward text, caught by review before push.
- Carried, not fixed (Codex round 3's HIGH): README.md still links the July reconciliation write-up, and its "One thing deliberately removed" note describes the finding. Both are unchanged from the parent `534a210`. Whether to unlink a published write-up is a publication decision for the orchestrator, not a voice pass.
- The hygiene helper's `A-98` read (whether scripts act when imported) reported README.md changed during its run. That was my concurrent edit; the README commit holds only intended hunks. `A-98` is re-read at the close on a quiet tree.
<!-- findings:end -->

## Outputs (lagging)

- Readers of the repository page are not measured past GitHub's 14-day repository traffic (`A-59`, encounter blind).

## Recommendation

- [A — today's outcome] `README.md` in the product's voice: claims pass on every sentence after its last edit, a cross-family review, CI green, then a signed-out GET of the repository page showing the new text.
- [B — standing, runs regardless] The open pull request refresh (`docs/daily-config.md`, `A-96`'s option b): its own commit and its own read-only Codex round before its push.
- [C — next product step, dated 2026-11-23] `A-108` (the per-constant change feed, the first step of `G-5` on David's card `dd5392d3`): the id refusal in `extract-pins.mjs` and the feed render, shown red and green, before any feed is built.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-19.md` (no 2026-11-20 file; written-date convention). `git pull --ff-only`: "Already up to date." HEAD `534a210`.
- Listener: SSE alive, `hello` 2026-11-20T14:48:29.207Z, 3 replayed; waker ranks 1-3 armed; the idle loop armed by tool call.
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (machine-level exec and write proved 2026-11-20T14:49:53Z).
- CI at HEAD `534a210`: `reverify.yml` GREEN, `page-check.yml` GREEN (`check-ci-status`, exit 0 each). No local full verify owed.
- Deploy drift: `check-deployed-sha-drift` printed "RESULT: PASS — 0 finding(s) across 38 service(s)"; this lane is GitHub Pages with no Render service, so NOTHING SWEPT for it, neither a stop nor a pass.
- Harness: running 2.1.329 · fleet UNIFORM (28 of 28 panes read) · installed 2.1.329 (SAME). The checker printed NOTE because its tracked record (2.1.277, 2026-09-18) is old; not a stop.
- Recommendations yesterday (`docs/daily/2026-11-19-prelaunch.md`): A executed (`644b87c`, `99a9154`); B executed (`019e0b7`).
- Due gates: `check-due-gates-dispositioned --snapshot` printed "snapshot written — 4 gate(s) due on/before 2026-11-20".
- Board: `answered-cards` printed "1 bounds-ledger card(s) + 4 portfolio-wide rider(s); 0 NEW since last read". Card `dd5392d3` (David chose direction A, with the change feed as its first step, and shelved the lane's own search; paraphrased) is already recorded in `96c2d41`; card `0c232c6c` is closed, so the 11-19 retro's line that it waited on David is out of date and nothing waits on him.
- Rotation: `check-cycle-rotation` printed "no product-love cycle picks this lane today", exit 0.

### P1 selection packet

- **Outcome:** a visitor who opens the repository on GitHub reads, in its first screen, what the ledger does and how to check one number, in short exact sentences, with the detail after. Item: `A-110` (the design pass), its `docs/SCREENS.md` row `README.md`, "NEXT 2026-11-24: voice only".
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." The README is where a visitor from a citation or a search lands; if it reads as a maintainer's log, they leave before the index link answers them.
- **Evidence:**
  - OBSERVED · `README.md` at `534a210` · the whole file · today · 208 lines, 5,951 words, 11 sections; the paragraph under "Is your number in here?" alone is a single 140-word block. Limits: a word count says nothing about whether a reader finishes it.
  - OBSERVED · `check-david-voice.mjs README.md` · the whole file · today · exit 3, 6 blocking and 4 advisory, including 79 em dashes. Limits: that linter is David's voice standard, and this repository's own rule lists only the lane brief and the report BLUF as linted surfaces. "bound" and "claim" are the readers' own words here. It is used as a count of what a pass would touch, not as the acceptance test.
  - OBSERVED · `docs/PRODUCT.md` § Voice · the three traits (exact, plain, checkable) the index, the constant pages and the 404 page were rewritten to; the README is the one surface listed in `docs/SCREENS.md` that has not had that pass.
  - HYPOTHESIS · leading with the question and the one-click check, and moving the history and method after it, gets more visitors to the index. Not testable here (below).
  - MISSING · how many visitors read the README or follow its index link. GitHub traffic gives 14-day repository views only; 3 unique viewers on 2026-11-19.
- **Permission:** `docs/SCREENS.md` lists the row as NEXT; David's chat lines of 11-18 and the kickoff ask for a full design and copy round today; `A-110` is monitoring and its notes list this item as (3). The README is public, so it passes the outward gate's adversarial review (`AGENTS.md`) as a claims pass plus a cross-family review. Nothing here needs David's word: no new claim about a record, no outreach. `A-103`'s outcome read (a visitor running `npm run check` from a clone, open to 2026-12-14) is a data-wait, not a freeze: the commands the README tells visitors to run stay exactly as they are, so that read is not disturbed. David's quoted words, if any appear, stay unchanged.
- **`A-108` and its date:** 2026-11-23 governs. It is the next product step (Recommendation C), not today's, because today is the design and copy round and its first slice, the id refusal, is not something a reader sees.
- **Next action:** improve. First command (read every number and command the README states, so the rewrite can be diffed against them):

```bash
node C:/dev/skylark/bounds-ledger/scripts/render-state-block.mjs --check
```

- **Acceptance condition:** after the push, a signed-out GET of `https://github.com/u00dxk2/bounds-ledger` shows the new opening; every command line in the old README appears unchanged in the new one (a script diff of fenced and inline commands, 0 missing); every number in the new README is either carried from the old one or has a named source command; `render-state-block.mjs --check` passes; a read-only Codex round returns no refuted sentence.
- **Delivery and encounter checks:** delivery: CI green on both workflows at the pushed sha, then the signed-out GET above. Encounter: blind (`A-59`); the one visible arrival is an outside issue counted by `npm run reports`, readable at N = 1, so this is reported as unmeasured.
- **USER-FACING: yes.** Paths: `README.md`, `docs/SCREENS.md`, `continuity/items.json`, this report.
- **HYGIENE INPUTS**
  - (a) due rows not bearing on the choice, 4 of 4: `A-92` (waived), `A-102`, `A-93`, `A-98`.
  - (b) owed child rows in the orchestrator's ledger: none, read "0 of 850 considered".
  - (c) state reads past their threshold: dated gates due 4 (4 unread of 4, 1 waived); board cards carrying David's word 5 (1 lane card, 4 skylark-site riders, 0 new); key numbers: no list yet (`docs/key-metrics.json` absent); stale-actionable 1 of 32.

### Close

- ACTION: COMPLETED · item `A-110` · P3 `39290ef9`. The manager's review (bus `60eac942`) read it COMPLETED against the P1 review's acceptance: a signed-out GET of raw `README.md` on main was byte-equal to origin/main, and every dated figure re-checked against its source held (the census 53 / 0 / 49 / 20; 111 audit entries; three merged corrections, #141, #194, #244; 254 claims, 2 manual). One part of the packet's own acceptance is not met as written: "a read-only Codex round returns no refuted sentence". Round 3 on `a7b5119` returned one HIGH, carried below; `4205be4` (two sentences in round 3's own wording) had no round of its own.
- **OPEN publication question (owned by the orchestrator, review `60eac942`; no card yet):** Codex round 3's HIGH. `README.md` links `docs/reconciliations/2026-07-22-minimum-overlap.md`, which names the problem index page at erdosproblems.com/36 as stale, and the "One thing deliberately removed" note is byte-identical to `534a210`. Today's rewrite says less about that page, which shows today did not make it worse; it does not settle the HIGH. Neither the link nor the note was changed at the close. Same question, dated follow-up: that write-up says "three records stale" at its line 21 while listing two later values at lines 11-13.
- Correction to the P3 post (`39290ef9`): it said the disclosure pass ran "in each Codex round". Only round 1's prompt asked the disclosure question; rounds 2 and 3 asked only about the /36 rule.
- Changed since the P3 post: none for users. `docs/SCREENS.md` (the README row DONE, totals DONE 10 / NEXT 0 / HOLD 4 / not a screen 2 / UNREACHED 0), this report, the ledger and the read stamps ride the close commit. The row that moved today: `README.md`, NEXT to DONE. A reviewer fetched it live, signed out (the manager's review).
- Hygiene draft (`tmp/hygiene-draft-bounds-ledger-2026-11-20.md`): 5 lines — 3 accepted · 2 amended · 0 rejected. Accepted: `A-92` hold to 2026-12-17 (no command); `A-102` re-dated to 2026-11-27; `A-93` re-dated to 2026-11-27. Amended: `A-98` re-dated to 2026-11-27 with the reason corrected, because the helper's failing read was my concurrent README edit; re-run on a quiet tree it printed "37 of 37 checked module(s) under scripts/ and scripts/lib/ are inert on import; 16 known-not-inert module(s) were not imported (KNOWN_NOT_INERT, A-98)" (exit 0, stamped). `A-92` park: the four-field wait as drafted, plus its `nextCheckDate` and `expectedSignalBy` moved to 2026-12-17 so no earlier clock out-votes the hold. READ-MUTATED, verbatim: "READ-MUTATED A-98 README.md — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks." (it was; status `158d336a`).
- Checks: wait-justification, re-run after the `A-92` edits: "RESULT: PASS — 3 of 134 row(s) carry `waitJustification`; 0 warn / 0 info". Engineering-zero (the helper's run): "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable" (exit 0).
- Due-gate verification: `check-due-gates-dispositioned` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned." against the snapshot "CURRENT (taken 2026-11-20)".
- Ledger delta: `A-110` (two notes: item 3 done; the open publication question); `A-102`, `A-93`, `A-98` re-dated to 2026-11-27 with reasons; `A-92` wait and clocks to 2026-12-17.
- positive control: the signed-out GET that returned 0 for "erdosproblems.com/36" returned 6 for "Is your number in here?" in the same fetch; the command diff that read 0 missing printed one MISSING line when a command was dropped in memory; the `A-98` read that went clean on a quiet tree had failed on a real file change during P3.
- Heavy jobs: none. No local verify was queued; CI was green at every pushed sha (`4205be4`, `8d245ec`).
- What cost the most time: four read-only Codex rounds, two of them on the same class (a sentence saying more than its source, the /36 one included). The third round was narrowed to the changed lines rather than run again over the whole file.
- Pending reads (each row's earliest clock, read from `continuity/items.json` at the close): `A-103` 2026-11-21 (its outcome read runs to 2026-12-14); `A-108` 2026-11-23; `A-110` (items 1, 4, 5) and `A-109` 2026-11-24; `A-59`, `A-70`, `A-89`, `W-14` (the watch on upstream issue 218, the 46a credit correction), `W-19` (the second Search Console read of the constant pages) 2026-11-25; `W-16` (the watch on upstream issue 289), `A-2`, `A-47`, `A-77` 2026-11-26; `A-102`, `A-93`, `A-98` 2026-11-27; `W-3` (the watch for acknowledgement of the erdosproblems.com/36 correction) 2026-12-03; `A-92` 2026-12-17. `A-96` is closed; its 200-ceiling re-check on 2026-11-25 is a note on that row, not a clock, and the refresh read 103 open today.
- Follow-up, undated until ruled: the generated "Current state" block in `README.md` still says upstream's README is where it "declares which bounds it stands behind", the wording round 1 refuted elsewhere; it comes from `scripts/render-state-block.mjs`, so it needs a renderer change with its own review.
