---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-11
lifecycle_stage: launched
last_deploy: 55baf5b (CI GREEN on reverify.yml and page-check.yml; GitHub Pages; no Render service)
on_hold_items: 0
top_action_today: bring the open pull request lists on the constant pages up to date, and keep them fresh every rail day
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-11 (Wednesday, MT)

## BLUF

The open pull request lists on our constant pages are current again. They had shown a week-old list of 60, and upstream had 89 open. 59 pages now show the list read at 15:57 UTC today, and 13 of them show one for the first time. The refresh now runs every rail morning, so the lists stay current on the days a session runs.

## What changed

- P1 chose the day's work: `A-96` (refreshing the open-pull-requests list without a human). The selection packet is in the State Appendix.
- **The open pull request lists are refreshed** (`d9ae9b3`, CI green on `reverify.yml` and `page-check.yml`): 60 → 89 open, 59 constant pages changed, live after the Pages build of `d9ae9b3`. `A-96` is closed.
- **The refresh is in the morning block** (`docs/daily-config.md`; `9f26785`, review fixes `fd0d52a`, `5ae8b91`, `25546bb`). Each refresh commit gets the normal Codex review and is pushed by its own sha.
- **`W-18` (the first Search Console read):** the card asking David for the numbers is filed (`965831ba`).
- The morning block ran. `npm run upstream` printed "0 transition(s) across 3 recorded report(s)". `npm run traffic` printed 7 unique repo viewers and 286 unique cloners in the latest 14-day window (page visitors are not counted).

## Inputs (controllable)

- Refreshed `ledger/open-pull-requests.json` and the constant pages from the live upstream list, and added that refresh to the morning block in `docs/daily-config.md`.

## Outputs (lagging)

- Readers of the public page: not measured. The page has no analytics: see `A-59` (the row saying nothing can see an arrival there).
- `W-18` (the first Search Console read) was due today. David answered card `901dddba` on 11-05, so the read is not blocked; the numbers are in his Search Console account, and card `965831ba` asks him for them. No number yet.

## Recommendation

- [A — user-visible] Run the new morning refresh tomorrow and give its commit the normal review. If a live page is ever seen showing the out-of-date sentence, reopen option (a) of `A-96` (a scheduled job that pushes by itself).
- [B — instrument] Watch the open count against the 200-row refusal (89 today; re-check 11-25, recorded on `A-96`).

## On hold pending data

- None.

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-11-10.md` (no 11-11 primer; the 11-10 file is the newest, named for the day it was written). Its banner governs: morning block, then the reads dated today.
- Listener: `read-listener-strand.mjs --project bounds-ledger` printed "READ — 0 consecutive no-loop warning(s)", exit 0; SSE hello at 15:04:57Z (restarted by the session-start hook; the old pid 33624 was left alone because its command line could not be read). Loop-tick armed by tool call. Waker ladder ranks 1 to 3 launched at about 15:05Z.
- Codex: GREEN per the kickoff's probe line (15:09:46Z, execute and write proved).
- CI, as of about 15:25Z: `check-ci-status.mjs --workflow reverify.yml` exit 0 and `--workflow page-check.yml` exit 0, each reading "1 completed non-scheduled success(es) for HEAD" at `55baf5b`. `git rev-list --count origin/main...HEAD` printed 0. `git pull --ff-only` printed "Already up to date." `check-posted-unpushed.mjs` printed "0 findings over 13 claim(s)"; positive control: it read 13 commit claims across 10 task-completes, all found on origin.
- Deployed-sha drift: NOTHING SWEPT for this lane. The fleet table covered 38 services and exited 0, which is a verdict about those services and not about us; this lane publishes through GitHub Pages (`docs/daily-config.md` § Deployed-sha drift).
- Local verify not run: the fleet rule is that CI at HEAD replaces it.
- Harness: `check-claude-build.mjs --panes` printed "panes UNIFORM (2.1.322) · installedVsRunning SAME".
- Yesterday's Recommendations: two. [A] narrow desktop widths: dropping, by design (recorded on the closed `A-101` row; no reader seen on a narrow window). [B] re-run `W-4` (prove each new detector both ways) on a quiet tree: executed at yesterday's close (exit 0 in 103,511 ms).
- Board: `update-david-board.mjs --list` returned 0 items for this lane. `answered-cards.mjs` reported none unread. Positive control: looked up by id, the same store returned card `901dddba`, answered 11-05 18:00Z.
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` exited 0 and printed "no product-love cycle picks this lane today (4 cycle(s) rotate over 24 lanes); run the normal P3".
- The bar's metric: `docs/evangelism-bar.md` says it is NOT MEASURABLE, and nothing today changes that.
- Due gates: `check-due-gates-dispositioned.mjs --snapshot` printed "snapshot written — 6 gate(s) due on/before 2026-11-11".

### P1 selection packet

**Outcome:** a reader on a constant page sees the pull requests that are open upstream today, not a week ago. Item `A-96` (refreshing the open-pull-requests list without a human).

**The user problem, in the user's words** (from `docs/evangelism-bar.md`): "is the number I already have still true, and how would I find out without redoing the literature search I did last year?" An open pull request on a constant is the earliest public sign that its number may be about to move, and a list that misses 30 of them answers that question wrongly.

**Evidence**

- OBSERVED · `ledger/open-pull-requests.json` · read today · `readAt` 2026-11-04T15:56:26Z, `count` 60, covering 50 constants. Last changed in `1cef357` (11-04).
- OBSERVED · `gh pr list -R teorth/optimizationproblems --state open --limit 200` · read 2026-11-11T15:36:13Z · 89 open. Against the stored list: 30 opened since (numbered between #327 and #360), 1 closed or merged (#278). The newest was opened 2026-11-11T01:33Z. About four new pull requests a day.
- OBSERVED · `scripts/render-constant-pages.mjs:1315` (selftest): each page's own script shows a stale sentence once the list is more than seven days old. For this list that is from about 2026-11-11T15:56Z.
- OBSERVED · `A-96` notes (11-04): no workflow under `.github/workflows` writes to the repo, and every push to `main` publishes through Pages with no CI gate. So option (a) would be a new automatic publishing path. Re-read today: the Grep tool found no `contents: write`, `git push` or `git commit` in `.github/workflows`; positive control: the same search for `issues: write` found it at `reverify.yml:42` and `history-sweep.yml:36`.
- HYPOTHESIS · a daily refresh in the morning block keeps every list under two days old on rail days. Upstream adds about four a day, so a two-day gap misses about eight, against 30 today.
- MISSING · any real reader meeting a stale list. The page has no analytics (`A-59`).

**Choice and why.** Option (b): add `node scripts/open-pulls.mjs --fetch` and `node scripts/render-constant-pages.mjs` to the morning block, committing the result when the list changed and `render-constant-pages.mjs --check` passes. It adds no publishing path: a human session already pushes every rail day. Option (a) is not chosen today because it would be the repo's first job that writes and publishes by itself, putting other people's pull request numbers on a public page with no one reading them first. Option (c) is what failed this week. Trigger to reopen (a): a live page showing the stale sentence again.

**Permission:** `A-96` is open, owned by this lane, not parked, and has no card. Its `onTrigger` asks this lane to decide between (a), (b) and (c). The outward gate (`AGENTS.md` § Hard invariants: one adversarial review on anything a stranger could read) applies to the refreshed pages, as a Codex review of the diff before the push.

**Next action:** deliver built value (the refresh tool exists; it has not been run for a week). First command:

```bash
node C:/dev/skylark/bounds-ledger/scripts/open-pulls.mjs --fetch
```

**Acceptance condition:** `ledger/open-pull-requests.json` carries a `readAt` from today and a `count` equal to a live `gh pr list` count taken within minutes of it. `render-constant-pages.mjs --check` passes. After the Pages build for the push tip, a live constant page changed by one of the new pull requests lists it, and #278 is gone from the page it was on. The morning block in `docs/daily-config.md` carries both commands, and the primer generator copies them (`gen-primer-first-action.mjs --check` passes). `A-96` is closed with option (b) and its reason on the row. `page-check.yml` and `reverify.yml` are green on the push tip.

**Delivery and encounter checks:** delivery is the Pages builds API row for the push tip, then a live fetch of two changed `c/` pages. Encounter: nothing on the page can see a reader (`A-59`). The encounter is blind, not zero.

**Key number:** open pull requests shown against open upstream, 60 against 89. It measures how far the page's list is behind upstream. It was measured this round (stored file and live `gh` read, 15:36Z).

**Recurred retro finding that bears on this:** none of yesterday's 10 bears on the choice. Q5 (re-date a row with `--set` on every clock it carries) governs today's re-dates.

**USER-FACING: yes.** Paths: `ledger/open-pull-requests.json`, `c/*.html`, `docs/daily-config.md`, `continuity/items.json`.

**HYGIENE INPUTS** (copied from the kickoff's reads):

- (a) Due rows not bearing on the choice, 5 of 6 due: `A-2` (the drift-resolution log), `A-59` (nothing can see an arrival on the page), `A-70` (the phone touch targets and copy button, shipped, waiting on `A-59`'s read), `W-14` (the watch on upstream issue 218), `W-18` (the first Search Console read; card `901dddba` is answered, so its `onTrigger` says to ask David for the numbers).
- (b) Owed child rows in the orchestrator's ledger: none, from the kickoff read over 810 rows.
- (c) State reads marked as crossed: none carries the word. Those printing a threshold clause: dated gates due today, 6 of 6 (5 listed in (a), `A-96` selected). Board cards carrying David's word: 0. Prior-day retro findings: 10 tagged, 8 still on discipline, 2 carried. stale-actionable: 0 of 26. `missingLinkedCommits`: NOTHING SWEPT, 0 of 0. Key numbers: no list yet (no `docs/key-metrics.json`).

### P3 product work

The manager review (inbox `3bb4480d`) approved the packet and asked for three things: write down what review each daily refresh gets, file the Search Console card for `W-18` (the first Search Console read), and record the 200-row ceiling on `A-96` (refreshing the open-pull-requests list without a human).

**What shipped (`A-96`).** `node scripts/open-pulls.mjs --fetch` at 15:57:50Z printed "89 open pull request(s) on teorth/optimizationproblems …, 88 changing a constant file, 63 distinct constant(s)"; a live `gh pr list` one second later counted 89. `render-constant-pages.mjs --check` printed "120 constant page(s) match committed state (@ 87b4ebb)" (87b4ebb is an upstream sha; it does not exist in this repo). <!-- pragma: allowlist sha --> Commit `d9ae9b3` holds the list and 59 pages: 20 pages had their list updated, 13 gained a list, and 26 had a list replaced or extended (49a's now leads with pull request 357). Pushed alone (`git push origin d9ae9b3…:main`); the Pages builds API shows a row for `d9ae9b3`, created 2026-11-11T16:18:34Z. Live reads after it: `c/49a.html` lists pull request 357, read date `2026-11-11T15:57:50Z`; `c/11a.html`, one of the 13 that gained a list, shows pull request 338, which is the list's only entry for 11a.

**The morning block** (`docs/daily-config.md`) now ends with `open-pulls.mjs --fetch`, `render-constant-pages.mjs` and its `--check`, so the list refreshes every rail day. Each refresh commit gets the normal read-only Codex round and is pushed by its own sha.

**Review.** Four Codex rounds, all read-only, banner `workdir` checked on each.

- Round 1 on `9f26785`: all 59 pages identical outside the pull request block (REPRODUCED by blob comparison), so `d9ae9b3` was pushed. Two findings on the review rule, both confirmed, fixed in `fd0d52a`.
- Round 2 on `fd0d52a`: the same defect class again (a store path set by an environment variable can change page prose while every stated precondition holds), plus one wording finding. Confirmed. The shape changed in `5ae8b91` to a fixed comparison prompt.
- Round 3, a cold round on `5ae8b91`: broke that prompt too (8 findings, 3 high). A run of the prompt on `d9ae9b3` printed `REFRESH-ONLY: no` only because its delimiter missed the singular heading; with both forms, all 59 pages passed. Each round found a new defect in the same mechanism, so `25546bb` deleted it: a refresh gets the normal review.
- Round 4, a verification round on `25546bb`. Its verdict, in its words: "Unreviewed-publication routes: None found under the stated procedure [STATIC]", having checked "fetch-before-render sequencing, whole-commit review scope—including `sitemap.xml` and changes outside pull-request blocks—the pinned head/base review recipe, the requirement for no other unpushed commits, and the explicit full-SHA push". No file at that head named the deleted prompt (`git grep -n -F 'open-pulls-refresh-review.md' HEAD -- .`, no matches). Its one note, that "Recorded on `A-96`" should be a forward claim, was met by pushing the ledger fields in the same push (`3704d91`).
- Not reviewed by Codex: `3704d91`, the ledger commit (closing `A-96`, the `W-18` note, the helper's read stamps, the traffic sample). It changes no page and no code; it had no round of its own.
- A stale line on the public record: `d9ae9b3`'s commit message says it was reviewed by three checks "and no Codex round", under a rule later deleted. In fact round 1 reviewed it before its push, REPRODUCED, and `fd0d52a`'s message records that. `main` is protected against history rewrites, so the message stays; this line is the correction.

**Search Console (`W-18`).** Card `901dddba` was answered on 11-05, so the card asking David for the last 7 days of impressions, clicks and pages is filed (`965831ba`, about 16:08Z) and noted on the row.

<!-- findings:begin -->
- Correction to the P1 acceptance condition: "#278 is gone from the page it was on" cannot apply. In the 11-04 list #278 changed no constant file (`"constants":[]`), so it was on no page.
- Correction to the P1 evidence: the 30 new pull requests reach 63 constants in all, and 4 of those (31b, 89b, 89c, 91a) have no page, so 59 pages changed, not 63.
- A defect of our own, caught by review before it was pushed: the first review rule for the daily refresh (staged file names) could not show why a page changed. Three rounds broke three lighter procedures; the rule now claims no lighter procedure.
<!-- findings:end -->

### Close

ACTION: COMPLETED · item `A-96` (refreshing the open-pull-requests list without a human) · P3 msgId `05675e00`. The manager review (inbox `3066480c`) read it COMPLETED: the refresh live, read after the publish, and in the morning block.

**Since the P3 post: the first Search Console numbers,** on `W-18` (the first Search Console read). David answered card `965831ba` (the ask for the first Search Console numbers) at 16:11:01Z with an export of the property. Its daily rows run 2026-11-04 to 2026-11-09 (Web search; the export's filter reads "Last 3 months"). **51 impressions and 2 clicks, every one on the index page; no constant page (`c/`) is listed yet.** By day, impressions/clicks: 11-04 0/0, 11-05 1/0, 11-06 15/0, 11-07 11/0, 11-08 19/0, 11-09 5/2; the days sum to 51 and 2. Desktop 49/2, mobile 2/0; 11 countries, United States 39 impressions. The sitemap went in on 11-05, so the `c/` pages reading zero four days later is "nothing yet as of 2026-11-09", not "no readers". Whether either click was ours cannot be told from the export. This is the first reach number this lane has had for the public page. The card is verified done. `W-18` is closed; the next read is `W-19` (the second Search Console read), due 11-18.

**An agent-side read, tested.** skylark-site's reader (`/api/cc/gsc-performance`) is configured and answered HTTP 400 "no GSC property registered for project "bounds-ledger"". Adding the property to its registry is a skylark-site change, asked for in this close's post. Whether David's grant of the property to the hello@ account lets that reader see it stays untested until then.

**Hygiene draft:** 6 lines: 5 accepted · 0 amended · 1 rejected.

- `A-2` (the drift-resolution log): ACCEPT, both clocks to 11-12.
- `A-59` (nothing can see an arrival on the page): ACCEPT, to 11-18.
- `A-70` (the phone touch targets and copy button): ACCEPT, to 11-18.
- `W-14` (the watch on upstream issue 218): ACCEPT, to 11-18.
- `W-18` (the first Search Console read): REJECT; the read arrived and the row is closed.
- Owed child rows: ACCEPT (none).

READ-MUTATED, quoted: "READ-MUTATED A-2 ledger/open-pull-requests.json — NOT named in the readCommand: lane's own concurrent edit" and "READ-MUTATED W-14 c/*.html (56 files, 10a..9a) — NOT named in the readCommand: lane's own concurrent edit". Both are this lane's refresh. Draft checks: check-wait-justification "RESULT: PASS — 2 of 122 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)"; check-engineering-zero "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".

**Verify:** `check-due-gates-dispositioned.mjs` (no flag) printed "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-11-11)" and "verdict: CLEAR — every gate due at Phase 0 was dispositioned.", exit 0.

**Ledger delta:** `A-96` closed (`decision2026_11_11`, `ceiling2026_11_11`, `linkedCommits`). `W-18` closed (`firstRead2026_11_11`; `readCommand` rewritten to say what was tested). Minted `W-19` (the second Search Console read, 11-18) and `W-20` (the 200-row ceiling on the open-pull-requests fetch, 11-25; its `readCommand` printed 89 at mint). `A-2`, `A-59`, `A-70`, `W-14` re-dated.

**Receipt:** P3's still holds (bus msgId `05675e00`). Its brackets are unchanged: the Search Console numbers count the index, not the changed `c/` pages, so the exposure stays blind.

**Pending reads:**

- 11-12: `A-2` (the drift-resolution log), `A-47` (the depth audit), `A-77` (the filed-report check's caller), `A-92` (results that rest on ETH), `W-3` (the erdosproblems.com/36 watch), `W-16` (the watch on upstream issue 289).
- 11-13: `A-93` (Anthropic's formal-math repository mapped onto watched constants), `A-98` (the sixteen scripts that act when imported).
- 11-15: `A-45` (the leading indicator), `A-91` (upstream's 67a citation, held at the outward gate), `W-11` (search before calling a claim decision-ready).
- 11-16: `A-78` (OpenAI's math release mapped onto watched constants), `A-81` (the Small Ramsey Numbers newer-result watcher), `G-4` (the goal of an outside party acting unprompted), `W-17` (the dated newer-papers line on each constant page).
- 11-17: `W-4` (prove each new detector both ways), `W-8` (an amended outward artifact back to David), `W-13` (the call of the served-bytes check).
- 11-18: `A-59` (nothing can see an arrival on the page), `A-70` (the phone touch targets and copy button), `W-14` (the watch on upstream issue 218), `W-19` (the second Search Console read), `A-89` (the decimal-vs-exact census's blind input shapes).
- 11-19: `G-2` (the goal of contributing a verified bound improvement).
- 11-25: `W-20` (the 200-row ceiling on the open-pull-requests fetch).
- 2027-01-03: `A-9` (the engineering-health backlog).

(Read from `continuity/items.json` at about 17:05Z: open rows, earliest of `nextCheckDate` and `expectedSignalBy`.)