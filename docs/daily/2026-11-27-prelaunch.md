---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: null
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-27
lifecycle_stage: launched
last_deploy: "30e227a (as of 2026-11-27 P1; page-check.yml GREEN, reverify.yml RED on the push run only, see State Appendix; GitHub Pages; no Render service)"
on_hold_items: 0
top_action_today: a per-constant change feed (A-108), naming each constant by id only, so a researcher can subscribe to the constant they cite
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger: daily report, 2026-11-27

## BLUF

Every constant page now has its own feed, so a researcher who cites a constant is told, with a date and a link, when our copy of its row changes. The feed names each constant by its short code only, repeats no numbers, and claims only what our own copy shows.

## What changed

### P1 selection packet

- **Outcome:** a researcher who cites a constant subscribes to that constant's feed and is told, with a date and a link, when its last-listed upper or lower row changes in this ledger's mirror. Item: `A-108` (the per-constant change feed), David's chosen first step of direction `G-5` (board card dd5392d3, decision 3c541ffb, as recorded on the row; paraphrased).
- **The user problem, in the user's words** (`docs/evangelism-bar.md`): "I cited a bound and a referee told me it had been improved. I had no way to know."
- **Evidence:**
  - OBSERVED · `gh api repos/u00dxk2/bounds-ledger/traffic/popular/paths` (`A-108`'s readCommand) · repository traffic · trailing 14 days · last read 2026-11-25, "4 popular paths, no feed exists to be read" (row note). It shows whether a feed's commit links are followed; it cannot see Pages visits.
  - HYPOTHESIS · the bar's loop archetype (citation check: low frequency, externally triggered) predicts that a reader returns when writing or refereeing, not on our cadence; a feed lets the change come to them. No reading tests it yet.
  - MISSING · any count of distinct page lookups (the bar's denominator, step 2). Pages serves no analytics, and a feed fetch is not visible to the repository traffic read.
  - MISSING · any real-user request for a feed. The case rests on the bar's problem statement and David's choice, not on an observed ask.
- **Permission:** `A-108` is `open`, owner bounds-ledger, not parked, no open card on it (positive control: the same `answered-cards.mjs` read returned the portfolio-wide card 312499ee, so the board read worked). David chose it as `G-5`'s first step. Pushing publishes (Pages), so the outward gate applies: Codex code rounds and a claims pass on the feed's sentences before push (AGENTS.md, Hard invariants), with the stop rule from round 1.
- **Next action (improve), scoped to claim less than `A-106` did:**
  1. Input boundary, both places, as the orchestrator answered on 2026-11-17 (bus d4c969c8): `extract-pins.mjs` exits non-zero with `ledger/claims.json` unchanged on a mirror file stem that is not `^[0-9]+[a-z]$`, and the feed render refuses the same before writing anything. The selftest ids t1 to t4 change first.
  2. The feed carries NO upstream title. Each string in it is fixed text, a valid id, an ISO date or a built URL. This drops `A-108`'s leg (2), the reviewed title table, by publishing no title at all, rather than building a second review surface.
  3. Entries come from committed history of each constant's generated pins (what `lastChanged()` already reads), one entry per change of a last-listed row, linking the constant's page and this ledger's commit page.
  4. Entry sentence (round 0 on THIS shape before the first build): title "`<id>`: last-listed upper-bound row changed" (or lower); body "The last-listed row of the upper-bound table changed in this ledger's mirror on `<YYYY-MM-DD>`. Read the rows and any notes on the page before citing." Its second sentence is the one already reviewed for the `c/` snippet (`a3eee2d`).
  5. The old draft on `a106-feed-draft` (`4417f1f`) predates several resnaps and is reused for its history walk only, rebased onto `main`.

  First command (prep: the failing extract-pins test):

  ```
  node C:/dev/skylark/bounds-ledger/scripts/extract-pins.mjs --selftest
  ```

- **Acceptance condition:** feeds live on Pages for every constant; a planted bad stem is refused by `extract-pins.mjs` and by the render (each shown red through the real script, then green); every feed string passes the fixed-text rule; a Codex round on the pushed commit returns class verdict NO. Then `A-108` closes as built.
- **Delivery and encounter checks:** after push, the Pages builds API row for the tip, then a live GET of two `c/<id>.xml` feeds and their `<link rel="alternate">` on the page. Encounter: a `/commit/` path in the popular-paths read, at the next read (2026-12-02, `A-108`'s date). At this traffic level, one such path is readable; zero by that date is said plainly, not called a failure.
- **USER-FACING: yes.** Paths: `scripts/extract-pins.mjs`, `scripts/render-constant-pages.mjs`, `scripts/lookup.mjs`, `c/*.html` (the alternate link), `c/*.xml` (new), `continuity/items.json`, this report.
- **Revenue:** what would make a stranger pay is a watch on the specific constants a journal, a referee or a research group cites, sent to them when any of them moves. The free per-constant feed is that service's smallest form, and whether anyone subscribes is the first demand read. No paid surface exists (the 2026-11-27 portfolio revenue snapshot lists no product for this lane), and none is built this session.
- **A prior-day finding that bears on this:** "editing a file while a background check reads it" recurred on 2026-11-26 (retro e0e970cf, still on discipline). This build runs Codex rounds and gates, so the tree stays frozen while each one runs.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 3 of 4 due (`dated gates due today`): `A-102` (an unreachable audit entry has nowhere to say what would settle it), `A-93` (the formal-math repository map), `A-98` (the scripts that act on import). The fourth, `W-17` (the weekly newer-papers run), is a standing obligation and is running now: fetched 21 papers for 2026-09-26 to 2026-11-27, three readers out.
  - (b) owed child rows: none, read "rows owed to you in skylark-site's ledger" (0 of 855).
  - (c) state reads marked CROSSED: none marked CROSSED, read every kickoff state read. HEAD CI read RED; dispositioned in the State Appendix.

### P3 outcome

- **Shipped:** `0fe74d5` on `main` (the tip of `2efd81e`, `2eb9075`, `492519c`, `063afbc`, `0fe74d5`, fast-forwarded from `8999351`). 123 feeds at `c/<id>.xml` (109 entries; 59 constants with none yet; at most 5, `10a`) and `changes.xml` for every constant on the main list. Each `c/` page links its own feed in the head and in a "Watch this constant" line.
- **Delivery:** Pages build `0fe74d5` read `built` (created 2026-11-27T18:28:13Z, `gh api repos/u00dxk2/bounds-ledger/pages/builds`). Live GETs: `c/5a.xml` 200 `application/xml`, `changes.xml` 200 with 109 entries, `c/5a.html` 200; each byte-equal to its committed blob (positive control: the comparator reads a committed file equal to itself). CI `reverify.yml` and `page-check.yml` green on `0fe74d57` (`check-ci-status.mjs`, both "1 completed non-scheduled success(es) for HEAD, 0 failures").
- **Encounter:** blind. Pages serves no analytics, and a feed reader's fetch never reaches repository traffic; only a click through to a commit page a feed links can appear (`A-59`, the row that records the public pages' blind encounter). Baseline read today: `gh api repos/u00dxk2/bounds-ledger/traffic/popular/paths` lists one commit page, `7d9b5b1`, at 1 view. It is not among the 218 commit links in `changes.xml` (positive control: the grep found all 218), so the 2026-12-02 outcome read must count only commit paths a feed links.
- **Outcome:** open, by design. `A-108` (the change feed) is read on 2026-12-02.

### P3 findings

<!-- findings:begin -->
- **Round 0 (feed sentences), 25 lines from a helper's source read.** Four sentences claimed more than the code does and were narrowed before the first build: "Upstream keeps" became "Upstream's tables can keep"; the date caveat now names that several upstream edits between two of our versions arrive as one entry and that an edit made and undone leaves none; the watch line says "for each change this ledger recorded" where it said "each time this ledger sees"; the all-constants title names the main list, not "every constant on this site".
- **The shape is narrower than the P1 packet said.** The packet proposed a new two-sentence entry. The build kept the A-106 draft's entry text instead, which two Codex rounds had already reviewed (2026-11-16), and narrowed it by round 0. The entry still carries no title and no value.
- **Codex round 1 on `2efd81e`** (gpt-6.2-sol, effort high, read-only, workdir `C:\dev\skylark\bounds-ledger` read from its session log; prompt `tmp/bounds-ledger-a108-codex-r1.md`): CLASS VERDICT: YES, four findings, all STATIC.
  - HIGH, `extract-pins.mjs:61`: a pipe line outside the bounds table (an example, a second table) could become the pin, and the feed would announce a "last-listed row" change the table never had. CONFIRMED by reading `lastDataRow()`; pre-existing in the extractor, made louder by the feed. Fixed by a stated rule, a refusal: a section's pipe lines must be one contiguous block. Measured first: 0 of 246 bounds sections in 123 files break it. Red-armed: the rule neutralised, the selftest failed on "a pipe line outside the table must be refused by name"; restored, it passed; the real script over the mirror left `claims.json` byte-identical.
  - MEDIUM, `render-constant-pages.mjs:2875`: a claim id such as `pin:999z:legacy:U` projected to `999z` and passed the row guard. CONFIRMED (`constantIds()` split on ":"). Fixed in `render-site.mjs` `constantIds()`, which both renderers use: every `pin:` claim must be exactly `pin:<id>:U` or `:L`, or the build throws before anything is composed. This also closes the index-page route the reviewer named (`render-site.mjs:900`).
  - MEDIUM, `render-constant-pages.mjs:1368`: a plain upstream title that announces an improvement can reach the page heading and link preview. CONFIRMED as a route; it predates A-108, and no feed reads a title. Not fixed today; a dated row for reviewed names is minted at the close (the manager's suggestion).
  - LOW, `render-constant-pages.mjs:1306`: the template test erases which id, date or commit filled a slot. CONFIRMED. Added direct checks: every page or feed URL in a fixture feed names its own constant, and every date and commit sha comes from the fixture's own history.
  - Named, not fixed: `reverify.mjs:254` can print a malformed upstream file name into the public drift issue before extraction runs. That is upstream's own public file name in our alarm; PLAUSIBLE as a defect, pre-existing, recorded for the close.
- **Codex round 2 on `2eb9075`** (same model, effort and workdir, read from its session log): CLASS VERDICT: YES. It traced all 109 entries against 34 first-parent versions of `ledger/claims.json` and found each matches a real change. Its findings 1 and 2 were round 1's HIGH class a second time (a fenced fake bounds heading; my round-1 comment regex backtracking past a `-->`), so the shape changed instead of the parser: `scripts/lib/mirror-shape.mjs` refuses a mirrored file holding an HTML comment, a repeated bounds heading or a fence in the bounds region (0 of 123 files today; 10c.md's fences sit after the region and pass). The round-1 comment-stripping code is gone. Findings 3 (a planted `Bad.md` with old claims did not stop a render) and 4 (a comment-hidden link reached a page) are closed by the renderers running the same folder check first. Consult `ffb8f460`; the orchestrator answered YES with six conditions (bus `9588e128`). Committed `492519c`.
- **Codex round 3 on `492519c`** (cold, asked to break six stated invariants): CLASS VERDICT: YES. I3 and I4 are the parser class a THIRD time: a heading with closing hashes, a fence inside a blockquote and a four-space-indented table each pass the shape rule. Condition 5 fired, so nothing was patched; consult `53be0c6e` asks whether to ship the feed claiming only what is true by construction, hold it for a whitelist grammar, or stop. Different classes, not yet fixed: crafted `claims.json` entries (an uppercase `PIN:` prefix; a duplicate pin) that make the page and the feed disagree; a git date outside four-digit years; an id long enough to hit the file-name limit after `c/` is cleared; and the documented resnap order, which renders feeds before the pin commit. **The finding that matters most:** the feed's truth rests on the extractor, which every page has trusted since 2026-07-24, so the parser-fidelity exposure predates A-108; the feed makes it louder.
- **The orchestrator answered (A)** (bus `e519f0cc`): the feed claims only the pin as this ledger's extractor reads it; no more line-pattern clauses; fix the other-class findings red first; a cross-family claims pass on the wording; do not send the parser to a fourth round. Built in `063afbc`: the wording narrowed to "as this ledger's extractor reads it"; I2 (the `pin:` prefix test made case-blind), I5 (a duplicate pin refused), I1 (a history date must be a real four-digit-year day) and the id length cap (one to three digits), each red first; the post-commit render in `AGENTS.md` now includes `render-constant-pages.mjs`; each refusal line ends with the instruction to post a bus blocker and comment on the drift issue.
- **Codex claims pass + fix review on `063afbc`** (same model, effort and workdir, read from its session log; prompt `tmp/bounds-ledger-a108-codex-r4.md`): CLASS VERDICT: YES, no parser-class finding. Part 1: two sentences REFUTED-AS-WRITTEN and narrowed to the reviewer's own sentences: "a pinned row is a listing position…, not the strongest bound" was false for 47a, whose pinned upper row is its source's current record (now "a pin selects a row by its listing position…, and that position alone says nothing about the bound's strength"); the watch line's "one entry for each change this ledger recorded" was too broad (now "for each bound-cell change found for one of this constant's pins between consecutive versions of this ledger's claims, as its extractor reads them"). Every other sentence HOLDS. Part 2, five gaps CONFIRMED and closed in `0fe74d5`, each red-armed: a duplicate whose second copy has no `expect` (counted before `expect` is read now; red-armed with only the old order restored); a case-variant pin id in history; a zero-entry feed's unchecked fallback date; a history refusal escaping as an uncaught throw; and an `AGENTS.md` sentence, older than today, that said CI never catches a stale index, untrue since `page-check.yml` arrived on 2026-10-05. The fixes in `063afbc..0fe74d5` have had no Codex read since they landed; `A-108` carries that as owed before its close.
- **Defect the manager named at the close (resnap order).** The `AGENTS.md` order sentence had no red-first evidence. The instrument that catches the slip already exists, `render-constant-pages --check` inside `npm run check` (not CI). Red-armed at the close: one entry removed from `c/5a.xml`, as a render one commit early would leave it, gave exit 1, "RESULT: FAIL — 0 missing, 0 orphaned, 1 stale constant page(s) or feed(s)", naming `5a.xml`; restored byte for byte, PASS.
- **Incident (recorded when it happened).** The first offline test run failed one check because the hygiene helper's `--run` stamps wrote `continuity/` while `check-import-inert` watched for writes on import. Re-run after the helper finished: exit 0. Yesterday's retro finding "editing a file while a background check reads it" recurred, this time between my own helper and my own gate.
- **The hygiene helper found an instrument that cannot fire (instrument-facing).** `A-93`'s read fetches upstream only at the pinned sha, so its "a new project folder exits 1" condition can never be true; upstream `anthropics/formal-math` is five commits past the pin and added a fourth project, `vp-vnp`. Drafted for the close.
<!-- findings:end -->

## Recommendation

- [A, today's outcome] `A-108`, the per-constant change feed, in the id-only shape above.
- [B, standing] `W-17` (the weekly newer-papers run) completes today: readers' verdicts, then `--check --from 2026-09-26`, and the store only on RESULT: COMPLETE.

## On hold pending data

- none.

## State Appendix

As of 2026-11-27 P1 (MT), from live commands:

- HEAD `30e227a` (`git rev-parse HEAD`; working tree clean at session start).
- `check-ci-status.mjs --workflow reverify.yml`: RED, exit 3, on push run 45882670431. Its issue #54 read "UNREACHABLE C-5 … HTTP 406" from ar5iv, with "No drift. 124 files match upstream" and 257 of 260 claims holding. The scheduled run 45972948471 on the same commit succeeded. Issue #54 closed by hand with that account. The RED verdict stays until the next push run.
- `check-ci-status.mjs --workflow page-check.yml`: GREEN, exit 0.
- `check-deployed-sha-drift.mjs`: PASS, 38 checksPass services; this lane has no Render service, so nothing of ours was swept (a Pages lane).
- `check-due-gates-dispositioned.mjs --snapshot`: "4 gate(s) due on/before 2026-11-27": `A-102` (the unreachable-entry wording), `A-93` (the formal-math map), `A-98` (the import-inert guard), `W-17` (the weekly newer-papers run).
- `check-cycle-rotation.mjs --lane bounds-ledger`: "no product-love cycle due", exit 0.
- `answered-cards.mjs --project bounds-ledger`: 0 lane cards, 0 new.
- Harness: running 2.1.332 · fleet UNIFORM · installed 2.1.332 (SAME).
- Codex: GREEN (the kickoff's machine probe, 2026-11-27T15:37:58Z).
- Listener: SSE alive (hello 2026-11-27T15:28:22Z), loop ticking by tool call.
- Recs yesterday (`docs/daily/2026-11-26-prelaunch.md`): A executed (`a3eee2d`); B carrying today (the newer-papers run, running); C carrying today (the change feed, selected).

### Close

ACTION: COMPLETED · item `A-108` (the per-constant change feed) · P3 e4b87f5b

- **State since the P3 post:** none changed. As of the close, HEAD `0fe74d5` with `origin/main..HEAD` 0; CI `reverify.yml` and `page-check.yml` green on `0fe74d57` (`check-ci-status.mjs`); Pages build `0fe74d5` `built`.
- **Hygiene draft:** 3 lines, 3 accepted, 0 amended, 0 rejected. Its checks: wait-justification "RESULT: PASS — 3 of 137 row(s) carry `waitJustification`; 0 warn / 0 info"; engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable"; READ-MUTATED "none — 3 reads guarded".
- **Ledger delta** (`continuity-edit.mjs`, each write echoed): `A-102` (the outside-arrivals count) re-dated to 2026-12-04; `A-93` (the formal-math map) readCommand re-pointed to upstream HEAD and re-dated to 2026-12-04; `A-98` (the import-inert guard) re-dated to 2026-12-04; `W-17` (the weekly newer-papers run) re-dated to 2026-12-04 with today's run recorded; `A-108` closeWhen replaced (old text quoted in its notes) and status open → monitoring; `A-114` (the bounds-region whitelist grammar) minted, due 2026-12-09; `A-115` (reviewed constant names, and the page-heading title route) minted, due 2026-12-09.
- **Due gates:** `check-due-gates-dispositioned.mjs` "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-27).
- **Pending reads:** `A-103` (the README's visitor check) and `A-104` (the phone filter's change dates) on 2026-11-28; `A-108`'s outcome read on 2026-12-02 (feed-linked commit paths only), with a cross-family read of `063afbc..0fe74d5` owed before it closes; `A-112` (the 22 newly last-listed rows) on 2026-12-02; `A-102`, `A-93`, `A-98` and `W-17` on 2026-12-04; `A-2`, `A-47` and `A-77` on 2026-12-03; `A-113`, `A-114` and `A-115` on 2026-12-09.
- **Receipt:** P3's receipt still holds; nothing new is written.
