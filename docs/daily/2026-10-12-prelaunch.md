---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-12
lifecycle_stage: launched
last_deploy: 6cc1076 (the last page-changing push; npm run served read 27 of 27 served at 08:14:51Z on 2026-10-12)
on_hold_items: 1
top_action_today: F-2, 46a discloses our open upstream issue 218 (overnight: a shown bound row reads its source key instead of HTML anchor markup)
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-12 (Monday, MT)

## BLUF

The public page for constant 46a now says we filed an open report upstream about it, with a link.

Overnight, 44 rows stopped showing link markup as text.

## What changed

### Overnight round 5 — P1 selection packet

Phase prompt inbox `5ea6018f` (08:44Z on 2026-10-12, 02:44 MT). The full packet, as posted to the bus, is `tmp/p1-r5-packet.md`. Its substance:

**Outcome:** a researcher reading a bound row sees the number and its source key, not HTML. Flow `F-2` (spot-check one claim).

**Evidence:** 73 shown bound cells on 44 of 115 index rows contain `&lt;a href`, and so do 73 cells on 44 constant pages. Every one of the 130 anchors has exactly the form `<a href="#KEY">[KEY]</a>`. No doc or decision records showing that markup as text. The only rationale for verbatim display is docs/evangelism-bar.md:38-39, which promises the exact pinned string, and the pin itself does not change. Encounter is MISSING (`A-59`).

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `scripts/render-constant-pages.mjs`, `index.html`, `c/*.html`, `docs/key-user-flows.md`.

**HYGIENE INPUTS:** (a) 2: `A-2` and `A-54`, both due 2026-10-12. (b) none: 0 of 749. (c) none crossed: the kickoff state block.

### Overnight round 5 — P3 product work

P1 review: APPROVE (inbox `5183e18d`), with one asked-for red-arm, a non-matching anchor shape staying verbatim.

**Action (improve):** shown bound cells read upstream's citation anchors as their key. Commits: `f09451a` (the change), `11dd2cb` (Codex r5 fixes) and `aad5e7e` (the Codex r6 test fix).

**Implementation:** `npm run verify` exit 0 at `aad5e7e`. It printed "No drift. 116 files match upstream" (an upstream sha, not one in this repo) and "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)". Both page `--check` legs passed. Four red-arms went red as intended. A fifth (feeding the transform into `data-find`) stayed green, which showed that assertion to be an equality pin, and it is now labelled as one.

**Review:** Codex r5 on `f09451a` found MED (the exact pinned string no longer reachable) and LOW (no lower-side case); both fixed in `11dd2cb`. Codex r6 on `11dd2cb`: all 73 exact-row blocks byte-match their pins, plus one LOW fixed in `aad5e7e`.

**Delivery:** `npm run served`: "115 checked — 115 served, 0 in flight, 0 stale, 0 unreachable" (anchor `11dd2cb`). The live index, fetched directly: 230 shown cells, 0 with `&lt;a href`, and 31 sha-pinned history links. The 44 live affected constant pages: 0 such cells, 73 exact-row blocks. CI GREEN for `aad5e7e`.

**Encounter:** blind, bug row `A-59`.

**Outcome:** open.

**Record-facing or instrument-facing:** no catch this round. The work was on the reader's path, not on a record.

### Close — overnight round 5

ACTION: COMPLETED · item F-2 (spot-check flow, rotation 10) · P3 4c12ad51 (bus msgId)

Manager review of P3 (inbox `7ef3318a`): COMPLETED, no defects. It re-read all 115 live constant pages and the index on its own. This P5 prompt never surfaced in the pane; it was found in the bus file after the retro and close-session prompts.

**Hygiene draft:** 2 lines, 1 accepted · 1 amended · 0 rejected.
- `A-2`: ACCEPTED on its own condition: `npm run verify` at `aad5e7e` printed "No drift."; the helper's own read was a GitHub API 403. Re-dated to 2026-10-19 with `--set`; the read is on `A-2.read2026_10_12`.
- `A-54`: AMENDED. Re-dated `expectedSignalBy` to 2026-10-14 with `--set`, not the drafted `--extend`. The tripwire fired (9 papers against 8 slots through 10-16), so completion is restated from 2026-10-20 to 2026-10-22 in onTrigger and closeWhen, recorded on `A-54.census8Skipped2026_10_12`.

READ-MUTATED: 2, both this lane's own concurrent P3 edit (status `b7ffa0a1`). Wait-justification: "RESULT: PASS — 1 of 93 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". Engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".

**Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned" — snapshot CURRENT (taken 2026-10-12).

**Stated limit recorded (the review's one thing):** the "other anchor shape stays verbatim" guarantee is test-only. All 130 live anchors have the matching shape. Recorded in `docs/key-user-flows.md`, rotation 10.

**Receipt:** unchanged from P3 `4c12ad51`.

**Pending reads:** `A-59` reader encounter, blind (next check 2026-10-28). `A-54` census slot, 2026-10-14. `A-2` drift re-read, 2026-10-19.

### Day session round 1 — P1 selection packet

Kickoff inbox `32ddc6bb`. The full packet as posted is `tmp/p1-d1-packet.md`. In brief:

**Outcome:** a reader weighing 46a's row sees that we ourselves filed an open report upstream against it (issue 218), linked, as the index's notes already promise for every row we have reported. Flow `F-2`, rotation 11.

**Evidence:** `node scripts/check-upstream-reports.mjs` printed "UNRECORDED — issue 218 is ours and has no baseline row" and exited 1. `ledger/upstream-reports.json` records issue 150 only. The live `c/46a.html` carries no disclosure, though it shows the depth audit's [Bo1991] reading. The checker needs `gh` and never runs in CI, so nothing raised this after 218 was sent on 2026-10-07. Out of scope today, as a stated limit: our two merged pull requests (194 on 1a and 1b, 141 on 15a), which the checker cannot see and the "we reported" wording would misdescribe. Encounter is MISSING (`A-59`).

**USER-FACING: yes.** Paths: `ledger/upstream-reports.json`, `index.html`, `c/46a.html`, `docs/key-user-flows.md`.

**HYGIENE INPUTS:** (a) none: 0 dated gates due (live `--print`; the overnight snapshot was not retaken). (b) none: 0 of 749. (c) none crossed: the kickoff state block.

### Day session round 1 — P3 product work

P1 review: APPROVE (inbox `7bc193d7`), with two extras: put the label beside the audit verdict if it is cheap and non-causal, and open a row for the checker that never runs in CI.

**Action (deliver built value):** issue 218's baseline row in `ledger/upstream-reports.json`, every field copied from `gh issue view 218`. The disclosure code already existed and was unchanged. Commits: `57756ec` (the change, with `A-77` opened) and `544c465` (Codex r1's one finding, fixed).

**Implementation:** `check-upstream-reports.mjs` went from "UNRECORDED — issue 218 is ours and has no baseline row" (exit 1) to "RESULT: PASS — 0 transition(s) across 2 recorded report(s)" (exit 0). The re-render changed one line in `index.html` and one in `c/46a.html` and no other page. `npm run verify` receipt: exitCode 0 at `57756ec`, no failed gates; `544c465` after it touches `continuity/` only.

**Review:** Codex r1, read-only, on `57756ec`, banner workdir `C:\dev\skylark\bounds-ledger`. One finding, LOW, STATIC, CONFIRMED: A-77's readCommand claimed "every issue our account filed", but the checker reads one `gh issue list --limit 100`. Fixed in `544c465`. Sibling sweep for the phrase over the tracked repo: 0 further hits.

**Delivery:** CI GREEN for `544c465` on `page-check.yml` and `reverify.yml`. `npm run served`: "2 checked — 2 served, 0 in flight, 0 stale, 0 unreachable" (anchor `57756ec`). Fetched directly, the live index row `c-46a` carries `we reported this row · open` linking issue 218, placed immediately before its existing badge "what we read does not support a claim in a row: … [Bo1991]". The live `c/46a.html` carries the same label under its heading.

**The two extras:** (1) On the index, the label already sits beside the audit verdict, because both render in the row header. On the constant page it sits under the heading, a stated limit: the store keys a report to a file, never to a row. (2) `A-77` opened: the checker has no caller that does not depend on someone remembering, and it cannot see our two merged upstream pull requests.

**Encounter:** blind, bug row `A-59`. **Outcome:** open.

**Record-facing or instrument-facing:** instrument-facing. The defect was in our own disclosure data, and no record moved.

### Close — day session round 1

ACTION: COMPLETED · item F-2 (spot-check flow, rotation 11, disclosing our upstream issue 218) · P3 8017d8a5 (bus msgId)

Manager review of P3 (inbox `5b67407e`): COMPLETED, no defects. It re-read both live pages and the commit stats on its own.

**State changed since the P3 post:** none to the ship. The verify receipt at `7727c9d` (exitCode 0, no failed gates) is the one the P3 gates stamp cites.

**Hygiene draft:** 0 lines (no inputs), so 0 accepted · 0 amended · 0 rejected. READ-MUTATED: none, 0 reads guarded. Wait-justification: "RESULT: PASS — 1 of 93 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". Engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable" (exit 0).

positive control: the same engineering-zero run printed a nonzero fleet line ("8 waived across 26 lane(s)"), and one `check-upstream-reports.mjs` listing returned issue 150 as recorded beside issue 218 as UNRECORDED, so both instruments return non-empty when there is something to find.

**Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-12).

**Ledger delta:** `A-77` minted (`57756ec`), with its readCommand narrowed by Codex r1 (`544c465`). `W-14` (the watch on issue 218) has a dated note recording the disclosure; it is not re-dated, because issue 218 itself did not change.

**Receipt:** unchanged from P3 `8017d8a5`.

**Pending reads:** `A-77`, 2026-10-19: choose a caller for the upstream-report checker, which today runs only when someone remembers `npm run upstream` (why issue 218 sat undisclosed for five days), and decide whether merged pull requests are in scope. `W-14` (the watch on issue 218), 2026-10-14: read the issue for a maintainer reply. `A-59`: reader encounter, blind (2026-10-28).

### Day session round 2 — P1 selection packet

Kickoff inbox `fdf989f1`. The full packet as posted is `tmp/p1-d2-packet.md`. In brief:

**Outcome:** a reader about to cite a watched constant that a claim in OpenAI's 2026-10-06 math release (github.com/openai/math) bears on sees a labelled, unrefereed-claim note on that constant's page and index row. The note carries the claim's family and a formal-proof / partial / none tag taken from the release's own Lean scope page. It is never called a record and never touches a bound cell. Asked for by David (skylark-site `docs/answers/2026-10-12-afternoon-plan-bounds-ledger-openai-math.md`). A new `A-` row will be minted at P3.

**Evidence:** the release repo moved on 2026-10-08 (its tip is the sha pinned in `ledger/openai-math-map.json` `source.sha`, an upstream sha; it does not exist in this repo). Its `history.md` records 3 withdrawals and "300 / 719 = ~42%" formalized, so the figures compiled on 10-07 (722 / 162) are stale. For 15a, the mirror lists 2.371177 last, while release family 107's Lean page claims ω(F) < 2.371054886… over every field and ω(ℂ) ≤ 9/4. For 84a, the mirror's upper bound is 4/3, "not improved", while family 167's Lean page proves β < 4/3 with an inexplicit β. Its Comparator statement `PlanarUnitDistances.lean` (read after posting) asserts ∃ C β, 1 ≤ β < 4/3, u(n) ≤ C·n^β, which matches 84a's definition as an upper-bound claim. The page's earlier sentence "The separate unit-distance power-saving theorem is not included" most likely refers to the pinned-distance formalization only, so the page is ambiguous rather than self-contradictory. The P1 post said "contradicts itself", and a correction was posted. Our own record holds nothing on the release: 0 files, with a positive control. Encounter is MISSING (`A-59`).

**USER-FACING: yes.** Paths: a new `ledger/openai-math-map.json`, the site and constant-page renderers, `index.html`, touched `c/*.html`, a guard, `continuity/items.json`, `docs/key-user-flows.md`. Second item after it: the Uncaged Minds essay in `C:\dev\skylark\uncaged-minds\drafts`, behind a cross-family claims pass and one board card.

**HYGIENE INPUTS:** (a) none: 0 dated gates due (live `--print`; a re-snapshot was refused because it would drop A-2 and A-54, so the morning snapshot stands). (b) none: 0 of 749. (c) none crossed: the kickoff state block.

### Day session round 2 — P3 product work

P1 review: REDIRECT (inbox `b2d45f3e`). Render a formal-proof tag only from a Lean statement read and matched against the constant's definition. Keep the whole-population map as data. Render only what was statement-checked today. Public repo: no text from another publication's workspace.

**Action (improve):** `A-78` opened. `ledger/openai-math-map.json` gives all 372 families of the release a verdict, at the openai/math commit pinned in its `source.sha` (an upstream sha): 23 bear on a watched constant and 349 do not, from the union of two independent screening passes (a Claude agent, 19 families; Codex, 23, a superset). 31 pairs: 8 statement-checked and rendered, 23 unchecked and data only. The rendered constants: 15a (ω(F) < 2.371054886… over every field; ω(ℂ) ≤ 9/4), 15b (α > 0.465), 84a (unit-distance exponent below 4/3), 27a (no proper 5-colouring of the plane), 28a (Borsuk fails in dimension 9), 7a (irrationality measure of π is 2), 2a (complete Crouzeix with constant 2, a value the table already lists). Each note quotes its Lean statement and names the file. Commits: `8cfdacb` (the change), `89e12c3` (Codex r1 fixes and the claims-pass narrowing).

**Implementation:** `scripts/openai-math.mjs --selftest`, wired into `npm test` and its own `reverify.yml` step. Red-armed on the live files, each restored: "record" in a claim → exit 1 naming 7a; 7a's statement path emptied → exit 1; the page renderer altering the Upper cell when a note is present → exit 1 on all 7 pages; "record" only in the badge's aria-label → exit 1 on all 7 badges; the map hidden → exit 1. `npm run verify` receipt: exitCode 0 at `89e12c3`, no failed gates.

**Review:** Codex r1 (read-only, head `8cfdacb`, banner workdir `C:\dev\skylark\bounds-ledger`): three MED, all CONFIRMED and fixed in `89e12c3`: the word ban skipped the aria-label; a checked pair could render with no statement; an absent map passed. Codex r2 (head `89e12c3`, same banner): all three FIXED. One new LOW, rejected as deliberate: a future class name containing "record" would be refused, which fails toward refusing. Cross-family claims pass (Codex, read-only, banner workdir = the release clone's folder): every claim and match sentence HOLDS. Two shared sentences were UNVERIFIABLE-HERE and are narrowed: "unrefereed" becomes "a claim in a preprint release", and "nothing in the rows above was changed because of it" becomes "this ledger has not changed the rows above because of it". Sibling sweep: "unrefereed" over the tracked scripts, pages, index and AGENTS.md returned 0 after the fix.

**Delivery:** pushed `082a808..89e12c3`. CI GREEN at `89e12c3` on `reverify.yml` and `page-check.yml` (`check-ci-status --wait`). `npm run served`: "8 checked — 8 served, 0 in flight, 0 stale, 0 unreachable" (anchor `89e12c3`). Live reads (playwright-cli): the index carries 7 `a.oai` badges, on c-2a, c-7a, c-15a, c-15b, c-27a, c-28a and c-84a. At 390 px the page scroll width is 390. At 1440 px the table's scroll box is 1058 of 1058 (no sideways scroll), and 15a's badge is 336 px inside a 382 px cell. The live `c/28a.html` shows the note with its Lean statement and no overflow at 390 px. The one console error is the site-wide favicon 404, which predates this change.

**Encounter:** blind, bug row `A-59`. **Outcome:** open.

**Not done, stated:** no proof compiled and no paper read. The 23 unchecked pairs include 46a (family 077), which has our open upstream issue 218. No upstream contact was drafted today. The essay is the next round's first item, per the review.

**Record-facing or instrument-facing:** record-facing. The release claims bounds beyond the last-listed rows on six watched constants, and the ledger now shows them as claims beside those rows.

### Close — day session round 2

ACTION: COMPLETED · item A-78 (OpenAI's math release mapped onto every watched constant; statement-checked claims shown on 7 pages) · P3 ad69ecd7 (bus msgId)

Manager review of P3 (inbox `00965f18`): COMPLETED, no defects. It re-read the live 15a page, the Pages build list (the first build of this work is `89e12c3`, after the claims-pass narrowing), and a `git log -G` sweep of this round's commits for material from another publication's workspace, which returned nothing.

**State changed since the P3 post:** the report commit `d180182` only.

**Hygiene draft:** 0 lines (no inputs), so 0 accepted · 0 amended · 0 rejected. READ-MUTATED: none, 0 reads guarded. Wait-justification: "RESULT: PASS — 1 of 94 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". Engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable" (exit 0). Positive control: the same engineering-zero run printed a nonzero fleet line ("7 waived across 26 lane(s)").

**Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-12).

**Ledger delta:** `A-78` minted, open (`8cfdacb`). Its onTrigger is 2026-10-19: re-read `gh api repos/openai/math/commits` for commits after the pinned sha, then statement-check the next pairs, 74a first. No other row changed this round.

**Receipt:** unchanged from P3 `ad69ecd7`.

**Carried, FIRST item next round: the Uncaged Minds essay.** David asked for it today, and the P1 review moved it out of this round. The essay:
- Adapts his v1 draft into `C:\dev\skylark\uncaged-minds\drafts` in his voice, with every quote, essay, frame and placeholder belonging to the other publication removed.
- Refreshes its facts against openai/math at its then-current tip. The 10-07 figures are stale: 3 manuscripts were withdrawn and 14 revised, per the release's own history file.
- Uses new charts only, with no outside branding.
- Gets a Codex claims pass, read-only with its banner workdir checked, over every factual sentence about OpenAI's papers before anything is published. Then ONE board card.

**Pending reads:**
- `A-78`, 2026-10-19: as above.
- `A-59`: reader encounter, blind (2026-10-28).

### Day session round 3 — P1 selection packet

Kickoff inbox `02634ac2`; posted as `d7f2fef8`. **Outcome:** David gets a fact-checked Uncaged Minds draft introducing the ledger through OpenAI's math release, then one board card. It is a carry from `A-78` and has no row of its own, because the essay lives in the private uncaged-minds repo. **USER-FACING: yes**, as text for publication under David's name, though nothing is published by us. **HYGIENE INPUTS:** none on all three lists.

### Day session round 3 — P3 product work

P1 review: APPROVE (inbox `334c532f`). It came with four points to hold: use David's .docx as the source, settle the update date from the release's history, give the method sentence its own line in the claims pass, and leave out the erdosproblems.com/36 story.

**Action (deliver built value):** the draft is `C:\dev\skylark\uncaged-minds\drafts\who-checks-the-ai-math.md` ("OpenAI Released 722 Math Papers. Who's Checking Them?"), with a fresh chart in `exports/assets/openai-math-what-got-checked.svg`. It is committed to the private uncaged-minds repo as `45af8b7` and pushed. Nothing from another publication's workspace is in this public repo.

**Facts re-read today, not carried over:**
- 722 at release (that commit's CONTENTS.md) and 719 now.
- The update is dated 7 October in the release's own history file; its commit is stamped 2026-10-08T05:03Z UTC.
- Lean scope pages: 235 at release, 242 now (contents API at both refs).
- The catalogue's review status still reads `unchecked`, and issues are still disabled.
- `HadwigerCounterexample.lean` returns 404 at the release commit and is present at the tip. So the earlier draft's "sharpest mismatch" went stale a few hours after it was written, and the essay is built on that.

**Claims pass** (Codex, read-only, banner workdir checked each time):
- Round 1: 99 verdicts, 86 HOLDS / 8 REFUTED-AS-WRITTEN / 5 UNVERIFIABLE-HERE. All 8 refuted items were fixed with the pass's narrower sentence. As the review predicted, one was the method sentence (Borsuk and Crouzeix match only through one extra step). The others: the family count's unit (21 constants and 2 Ramsey), Borsuk "9" becoming "at 9 or below", ω's full digits, Crouzeix's "independent route", the title, and the chart twice (its description and its third bar). α was rated HOLDS (3j); its field was added for precision only. (This list named "α's field" as a refutation until the close; corrected on the manager's review.)
- Round 2, on the changed sentences: 10 HOLDS / 0 / 5. Its catch: the body said "I read" in David's voice for readings the lane's agents did. They are now attributed to the agents. A sweep for first-person claims of that work found one more, which is fixed.

**Voice rules, stated:** own-prose share is about 0%. The uncaged-minds harness (§3.1) asks for a fifteen-minute sitting when no David sentences exist. The draft was written because David asked for the adaptation by name, and the card offers the sitting as the alternative.

**Card:** `49dabdc0`, filed by needs-decision `221bcad6`. It gives the path, a two-line summary, the claims-pass counts and "Publish as is, or edit first?".

**Encounter:** David's reply on the card is the read; pending. **Outcome:** open.

### Close — day session round 3

ACTION: COMPLETED · item A-79 (David's essay drafted, fact-checked and carded; carry from A-78) · P3 4ddbe9bb (bus msgId)

Manager review of P3 (inbox `2329eeb3`): COMPLETED, with three low items:
1. **Hadwiger wording.** The draft and the card now say the same narrow thing: a Lean formalization of the disproof, not compiled here (uncaged-minds `04b0a94`). The formalization directory at the tip holds 276 entries (`gh api …/lean/OAI/Combinatorics/HadwigerCounterexample`).
2. **Refutation list.** It named α as refuted when α held. Corrected in the draft note and in this report.
3. **Draft note.** It still carries internal mentions; it is stripped at export by its own instruction.

**State changed since the P3 post:** uncaged-minds `04b0a94` (the two fixes). This report and the ledger row land in the close commit.

**Hygiene draft:** 0 lines (no inputs), so 0 accepted · 0 amended · 0 rejected. READ-MUTATED: none, 0 reads guarded. Wait-justification: "RESULT: PASS — 1 of 95 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". Engineering-zero: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable" (exit 0). Positive control: the same run printed a nonzero fleet line ("1 finding(s) … 6 waived across 26 lane(s)").

**Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-12).

**Ledger delta:** `A-79` minted, open, next check 2026-10-13. Its read is David's answer on card `49dabdc0` (publish / edit / talk-through). It also carries his call on the author name left in commit `1718940`'s history; the recommendation is to leave it. That is not resolved.

**Receipt:** unchanged from P3 `4ddbe9bb`: none, because the draft is unpublished.

**Pending reads:** `A-79`, 2026-10-13: David's card answer. `A-78`, 2026-10-19: re-read the release after the pinned sha, then statement-check the next pairs, 74a first. `A-59`: reader encounter, blind (2026-10-28).

## Inputs (controllable)

Two product rounds overnight on F-2. Two Codex reviews this round (r5, r6) and one in round 4. Red-arms on every new assertion; one (`data-find`) stayed green and was relabelled as an equality pin.

## Outputs (lagging)

Encounter blind (`A-59`). `npm run reports`: 33 raw issues, all ours, 0 outside arrivals (read 2026-10-12).

## Recommendation

Next F-2 rotation: the slowest remaining answer on a constant page, read in a fresh cold walk rather than carried from this one.

## On hold pending data

`A-59`: reader encounter on the public pages, blind (next check 2026-10-28).

## State Appendix

Written at close, from live commands.
