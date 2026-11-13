---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-13
lifecycle_stage: launched
last_deploy: "92fd997 (as of about 17:42Z on 2026-11-13, A-102's ship note recorded CI green and a built Pages row for 92fd997; release: node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml, then --workflow page-check.yml, and gh api repos/u00dxk2/bounds-ledger/pages/builds; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: on each constant page where we tried and failed to open a cited source, say which claim we meant to check and what reading would settle it
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-13 (Friday, MT)

## BLUF

Where we could not read a cited paper, six constant pages now say which claim we meant to check. Four pages also say what reading would settle it. Before today they said only that the source could not be read.

## What changed

- P1 chose the day's work: `A-102` (an UNREACHABLE audit entry has nowhere on its page to say what would settle it). The selection packet is in the State Appendix.
- **`A-102` shipped** (`fec3787`, review fixes `92fd997`, pushed 17:41Z; CI `reverify.yml` and `page-check.yml` green on `92fd997`; Pages build row for `92fd997` built). Where we tried to read a cited source and could not, the constant page now names the claim we meant to check and its result (7 entries, on 17b, 27b twice, 29a, 33a, 3e, 57b) and, where the entry's own record names one, what reading would settle it (4 entries: 17b, 27b, 33a, 80a). Live fetch of c/17b, c/27b, c/29a, c/33a, c/3e, c/57b and c/80a after the build: 7 claim sentences, 4 settle sentences, 0 lines on an unread source saying "the claim we checked". The row's read command at the pushed sha printed `92fd9972a4ac1f55c7584e03ac29e013d3e1224b:c/27b.html:1`.
- The 27b settle line names only the column "that begins on page 14": the record gives the end page as 21 (Crossref, OpenAlex) and 23 (the mirrored entry), unreconciled, so neither is printed.
- Codex round 1 on `fec3787` found the 33a source link was a malformed address (prose and a second URL in one link, there since 10-16) that the new settle line pointed readers to, and a punctuation gap. Both fixed in `92fd997` by rule: a stored source with whitespace inside it (after its ends are trimmed) is now refused (1 of 111 had it; corrected), and claim text ending in `!`, `?` or an ellipsis is refused (0 of 111 did). Round 2 on `92fd997`: no defects; it named what the source rule still cannot see (two URLs joined with no space) and found 0 such among the 111 stored sources.
- Morning refresh of the open pull request lists: `open-pulls.mjs --fetch` read 94 open upstream at 16:53:38Z (93 at yesterday's read). On 1c the list gains pull request 366; on 58 other pages only the read date moves. Pushed alone by sha as `7040534` after a read-only Codex round (all 59 pages identical to HEAD outside that section; its one finding, 11 pull-request-to-constant pairs on constants with no page here, is by design: we do not mirror 89b, 89c, 91a or 31b).

## Inputs (controllable)

- One renderer change and four stored audit values (`A-102`), a selftest block with six red-arm mutations, three read-only Codex rounds (one on the morning refresh, two on `A-102`), one round-0 fact list by a Sonnet helper, and the hygiene helper's draft (two re-dates).

<!-- findings:begin -->
- **The 33a page had linked readers to a malformed address since 2026-10-16.** `A-47-0081`'s stored source held a sentence and a second URL, and the page emitted the whole string as one link. Codex round 1 found it because today's new line pointed readers at that link. Fixed by rule, not by case: a stored source with whitespace inside it (after its ends are trimmed) is now refused (1 of 111 had it). The limit that rule cannot see, two URLs joined with no space, is recorded, not matched (0 of 111).
- **A guard of mine was weaker than it read.** The selftest's "never say 'the claim we checked'" guard was case-sensitive, so a sentence-initial "The claim we checked" passed it and was caught only by the exact pin after it. The red-arm found it; the guard is now case-insensitive and trips first.
- Classification (one sentence of judgment, never a counter): today's recorded findings concern our malformed stored source link and our case-sensitive selftest guard, so both are instrument-facing and neither is record-facing; `npm run catches` was not run. Running count of consecutive instrument-facing days: 1, since yesterday's 3b DOI was record-facing.
<!-- findings:end -->

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there). `npm run reports` read 0 outside arrivals of 37 raw issues today.

## Recommendation

- [A — user-visible] On 11-19 continue `A-47` (the depth audit) at slice 25; any new UNREACHABLE entry whose record names a route now gets a `settleReader` line.
- [B — instrument] On 11-20, `A-98` (scripts that act when imported) cannot be re-dated on "outranked" twice: guard the five file-writing or gate-starting modules or show what outranked it.
- [C — outward, gated, carried] The 3b DOI correction from 11-12 is still unsent: adversarial review and David's word first.

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-12.md` (no 11-13 primer; the 11-12 file is the newest, named for the day it was written). Its banner governs: morning block, then the reads dated today. `git pull --ff-only` printed "Already up to date."; HEAD `576d430` is the primer's own commit.
- Listener: `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0 (session start 16:29:45Z). Loop-tick armed by tool call; waker ladder ranks 1 to 3 launched at about 16:30Z.
- Codex: GREEN per the kickoff's probe line (16:33:15Z, execute and write proved).
- CI, as of about 16:52Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each "1 completed non-scheduled success(es) for HEAD" at `576d430`. `git rev-list --count origin/main...HEAD` printed 0. No local full verify: CI is green at HEAD.
- Deployed-sha drift: NOTHING SWEPT for this lane. The fleet table covered 38 Render services and exited 0, which says nothing about us; this lane publishes through GitHub Pages.
- Board: `update-david-board.mjs --list` returned one card for this lane, `965831ba`, state done. `answered-cards.mjs` showed one portfolio rider, `210b0834` (the skylark-site heavy-job queue); it asks nothing of this lane.
- Morning block reads: `npm run upstream` "0 transition(s) across 3 recorded report(s)"; `npm run traffic` "6 unique REPO viewer(s), 286 unique cloner(s)" in the latest 14-day window (repo views, not page readers); `open-pulls.mjs --fetch` 94 open; `render-constant-pages.mjs --check` "120 constant page(s) match committed state".

### P1 selection packet

- **Outcome:** `A-102`, the UNREACHABLE audit entries on the constant pages. Where we tried to read a cited source and could not, the page will name the claim we meant to check (already stored, never shown) and, where our notes name one, the reading that would settle it.
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." For an entry we could not read, the page today says only "the cited source could not be read at all (tried <date>)". The reader learns that we looked. They don't learn what was left open, or what reading would settle it, and they are the person who may hold a library login we lack.
- **Evidence:**
  - OBSERVED · `git grep -c "would settle" -- c/27b.html` (the row's readCommand) · read 2026-11-13 about 17:00Z · no output: zero matches, the state the row was minted to change. Positive control: `git grep -c "could not be read at all" -- c/27b.html` printed `c/27b.html:1` on the same page, so the grep reads that file.
  - OBSERVED · a read-only count over `continuity/depth-audit.json` · all audit entries · read 2026-11-13 · 14 entries are UNREACHABLE. Seven of them (`A-47-0080`, `-0081`, `-0093`, `-0095`, `-0098`, `-0105`, `-0108`, on 27b twice, 33a, 29a, 3e, 57b and 17b) carry a claim named before reading (`claimReader`) and a stated result (`claimResult`); the other seven carry neither.
  - OBSERVED · `scripts/render-constant-pages.mjs:916` · read today · for an UNREACHABLE entry with a tried date the verdict text is `${v.text} (tried <date>)` and nothing else; the claim branch at `:919` requires a read verdict, and its own comment says "UNREACHABLE never reaches this branch". So the seven stored claims never reach a page.
  - OBSERVED · `continuity/items.json` `A-102.notes` · for 27b [G1980] (`A-47-0108`) the settling reading is known and sits only in the store's notes: pages 14 to 21 of Scientific American vol. 242 no. 2 (February 1980).
  - HYPOTHESIS · whether all seven of those entries still sit on a current row (not stale). The stale branch at `:915` wins first, so a stale entry would not change. Checked at P3 against the render.
  - MISSING · whether any reader sees an audit verdict: the page has no analytics (`A-59`).
- **Permission:** `A-102` is an open lane row (status open, owner bounds-ledger, no park, no card), minted 2026-11-12 from the manager's review of slice 24. It changes how our own audit results are worded on our own pages, which is inside the lane's authority. It is a public-surface change, so the outward gate's adversarial review runs before push. It contacts nobody.
- **Next action:** improve. Render the stored claim for an UNREACHABLE entry, and add an optional reader-facing field (working name `settleReader`) that says what reading would settle it, refused by name in `UNUSABLE_CHECKS` when malformed. Selftest in both polarities: the field renders, and a malformed one is refused. Fill it for `A-47-0108` and for any other UNREACHABLE entry whose notes name such a reading. Render, review, push. First command:

  ```
  node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --selftest
  ```

- **Acceptance condition:** the live `c/27b.html` shows the claim we meant to check and a line saying what reading would settle it; `git grep -c "would settle" -- c/27b.html` prints at least 1 at the pushed sha; the renderer's selftest proves the field renders and that a malformed one is refused (red-armed); each of the other pages that gains a line is live-fetched after the Pages build row for the push tip exists.
- **Delivery and encounter checks:** delivery is the Pages build row for the push tip, plus a live fetch of each changed page. Encounter is blind (`A-59`). The only arrival a page can show is a report filed through a row's link, counted by `npm run reports` and readable at N = 1.
- **USER-FACING: yes.** Paths: `scripts/render-constant-pages.mjs`, `continuity/depth-audit.json`, `continuity/items.json`, and the rendered pages for the affected constants (expected `c/27b.html`, `c/33a.html`, `c/29a.html`, `c/3e.html`, `c/57b.html`, `c/17b.html`, plus any constant whose entry gains a settling line).
- **Standing obligation beside it, not the choice:** the morning open pull request refresh (94 open). Committed and pushed alone by its sha (`7040534`) after its read-only Codex round, before any `A-102` commit.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 2: `A-93` (Anthropic's formal-math repository mapped onto every watched constant; readCommand `node scripts/anthropic-formal-math.mjs --upstream`, last run 2026-11-06 exit 0) and `A-98` (sixteen scripts act when imported; readCommand `node scripts/check-import-inert.mjs`, no prior `--run` stamp on the row; the script itself first ran 2026-11-06). Read: `check-due-gates-dispositioned.mjs --snapshot`, "2 gate(s) due on/before 2026-11-13".
  - (b) owed child rows: none. Read: the kickoff's "rows owed to you in skylark-site's ledger" (0 of 822).
  - (c) state reads marked CROSSED: none. Read: the kickoff's state reads (stale-actionable 0 of 27; missingLinkedCommits NOTHING SWEPT, 0 of 0).
- **Key number:** the plan's number is the count of UNREACHABLE entries whose page names the claim we meant to check: 0 of 14 today, measured this round by the count above and the renderer branch at `:916`. The target is 7 of 14 plus every settling line our notes support. It measures what the page says, not whether anyone reads it.
- **A prior-day retro finding that bears on the choice:** Q0 on 11-12, "one claim keeps failing review rounds" (3b took three Codex rounds). This change adds public sentences about claims we did not settle, which is that same exposure, so the claim and result lines repeat stored sentences unchanged; the four new settle sentences are composed from each entry's stored fields and checked against them (round 0) before review.

### Close

- ACTION: COMPLETED · item `A-102` · P3 `260e2e57`. The acceptance in force (the P1 packet's, approved by the manager) was met: live `c/27b.html` names the claim and what would settle it; the read command at the pushed sha printed `92fd9972a4ac1f55c7584e03ac29e013d3e1224b:c/27b.html:1`; the selftest renders the field and refuses a malformed one, red-armed; all seven changed pages were live-fetched after the Pages build of `92fd997`. Manager review of P3: COMPLETED.
- Changed since the P3 post: no constant page. The close changes the ledger, the two read sidecars, `continuity/traffic.json`, this report and the primer.
- Ledger delta (`continuity-edit.mjs`): `A-102` open → monitoring (the build is done; the outcome read is open), its read command re-pointed to `npm run reports`, next check 2026-11-20, onTrigger and closeWhen rewritten for the outcome read, ship note with the literal read output. `A-93` and `A-98` re-dated 2026-11-20, each with a note (hygiene draft: 2 lines, 2 accepted). Plus the helper's two read stamps and the new sidecar `continuity/read-outputs/A-98.txt`.
- Due gates: `check-due-gates-dispositioned.mjs` printed "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-13). Wait-justification and engineering-zero, both run by the hygiene helper: PASS (2 of 125 rows carry a wait, 0 warnings; 0 findings, 0 unreadable).
- Pending reads, by date:
  - 11-18: `A-59` (encounter is blind on the public pages) and `W-19` (the second Search Console read).
  - 11-19: `A-47` (the depth audit), slice 25, and others.
  - 11-20: `A-93` (the Anthropic formal-math map), `A-98` (scripts that act when imported) and `A-102` (today's outcome read: the first outside report filed through one of the seven rows, N = 1).
- W-7 — `node scripts/check-import-inert.mjs` (`A-98`'s read, run today through the hygiene helper's `--run`) claims that the modules it checks are inert on import, and names its exclusions. It printed exit 0 with "33 of 33 checked module(s) … are inert on import; 16 known-not-inert module(s) were not imported". Its pass covers only the 33 it imports; for the 16 on its own exclusion list it cannot say otherwise, so its exit 0 is silent on exactly the modules the row exists for.
- Standing prediction (quoted from `CLAUDE.md`): the next record-facing catch will be a citation-quality defect in a mirrored upstream entry, found by a human reading the cited source in the depth audit. Today held no record-facing catch, so it was neither confirmed nor falsified.
