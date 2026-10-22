---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-22
lifecycle_stage: launched
last_deploy: bcff34e (HEAD at the 10-22 kickoff)
on_hold_items: 1
top_action_today: show on each constant's page the open upstream pull requests that touch it (A-83), so a reader sees a pending change before it merges
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-22 (Thursday, MT)

## BLUF

Proposed for today: each constant's page lists the upstream pull requests that would change it and have not merged yet. 28 such requests are open now and touch 38 of our 117 pages. Today's reader of the 1d page cannot tell that three of them propose changing its bound.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** a reader of a constant's page can see that the source table's own repository has open, unmerged pull requests touching that constant, with links and the date we read the list, before any of them merges into the mirror. Item: `A-83` (add the mirrored list's own open pull requests to the constants newer-result watch's scope), due today by its own `onTrigger`; the kickoff's ONE JOB.

**The user problem, in the user's words:** "Is anyone already proposing a change to this bound?" On the 1d page today the answer is yes three times over (pull requests 247 and 248 propose smaller upper bounds; 243 proposes printing the current one rounded up), and the page says nothing about it.

**A correction to the job as written, found in P1.** The kickoff and `A-83.onTrigger` ask for the `watchScope` sentence "on the page" to change. That sentence renders only inside the newer-results note (`scripts/newer-results.mjs:178`), and the note renders only when `ledger/newer-results.json` holds an entry. It holds none (`"entries": []`, both 1b entries retired 2026-10-18). So editing `watchScope` alone changes no page a reader can open today, and the acceptance line "the live page showing the new watchScope sentence" cannot be met. The proposal below makes the pull-request list its own block, which carries its own source and date; `watchScope` is still widened in the same commit so the note says the right thing the next time it renders.

**Evidence** (each read today, 2026-10-22 MT):
- OBSERVED · `A-83`'s readCommand, run through `check-due-gates-dispositioned --run A-83` (exit 0, stamped, output in `continuity/read-outputs/A-83.txt`) · a node count over that output: `{"open":28,"touchingConstants":28,"distinctConstants":38,"oldest":"2026-08-19T18:00:11Z"}`, and all 38 touched constants are among the 117 files the mirror carries · positive control: pull request 244 (our 13a citation fix) is in the list · limit: one read at one instant; 34 were open on 2026-10-16, so the set moves within days.
- OBSERVED · `gh pr diff 243 -R teorth/optimizationproblems` · another author's open pull request (opened 2026-10-20) changes `constants/1d.md` line 18 to `$1.4630715826075594$` and says the bound "is printed rounded up". That is the 1d.md:18 cut our census found yesterday (`A-76`). It bears on `A-88` (the question for David once #244 has a reply), not on today's choice: one of the three cuts is already proposed upstream by someone else. Recorded here; `A-88`'s own read stays dated 2026-10-24.
- OBSERVED · `npm run reports` · 34 issues fetched, 34 ours, 0 outside arrivals; parts reconcile 34 + 0 + 0 = 34. The bar's metric stays NOT MEASURABLE, per `docs/evangelism-bar.md`.
- OBSERVED · `check-cycle-rotation --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- OBSERVED · `answered-cards --project bounds-ledger` · 0 new; card abab2375 answered 10-21 (paraphrased: wait for a reply on #244, then bring him the question text), already tracked as `A-88`.
- MISSING · whether any reader has opened a page that an open pull request touches. The pages carry no analytics (`A-59`).

**Permission:** `A-83` is open, owner bounds-ledger, no park, no card. Its note leaves "what the page should say about an open proposal" as a product question, with the 1b note (`A-82`) as precedent; the kickoff decides it in favour of showing them ("so a reader of the page sees a pending upstream change to a constant before it merges"). Reading upstream is read-only and is not upstream contact. A new block on public pages needs the adversarial review CLAUDE.md requires of anything public, plus a Codex read-only review (the kickoff asks for both).

**Next action** (kind: improve). First command, the row's own read, already run once today:

```
gh pr list -R teorth/optimizationproblems --state open --limit 200 --json number,title,createdAt,files
```

Plan for P3 (names provisional):
1. `scripts/open-pulls.mjs --fetch` runs that read and writes `ledger/open-pull-requests.json`: the read date, the repository, the raw count, and per pull request only its number, its opening date and the constants it touches. **No titles and no author names are stored or rendered**: titles are other people's unverified claims, and one open title contains the word "record", which the pages ban. It REFUSES a listing of exactly 200 (it may be truncated) and an empty one with no positive control.
2. `--selftest` (network-free, red-armed before the build): an open pull request touching `constants/31a.md` appears on 31a; one touching only `README.md` appears on no page; a closed or merged one does not appear; counts reconcile.
3. On each `c/` page, after the newer-results slot (`render-constant-pages.mjs:975`), a block headed for example "Open pull requests on the source table's repository" listing "pull request 248 (opened 2026-10-21)" with a link, and the line "open and not merged when we read the list on 2026-10-22; we have not checked what they propose, and the rows above do not include them." The same byte-for-byte guard `newer-results.mjs` uses: the page minus the block equals the page without it.
4. `ledger/newer-results.json` `watchScope` widened to name both sources.
5. Codex read-only review (banner workdir checked), then an adversarial claims pass on the rendered wording, then commit, push, and the second `render-site` / `npm run check` after commit.

**Acceptance:** the selftest red, then green, both quoted; the 38 pages (or whatever today's listing gives) carry the block; the live 1d page served by GitHub Pages shows pull requests 243, 247 and 248 with today's read date (quoted from `npm run served` and a fetch of the page); `render-constant-pages --check` and `npm run check` green after the commit.

**Delivery and encounter checks:** delivery is `npm run served` after the push (SERVED for the touched `c/` pages) and a fetch of the live 1d page, both in the P3 post. Encounter is blind (no analytics, `A-59`); the only event that could show a reader acting is an outside issue through a per-row link (`npm run reports`), and at about one a month that is not readable at any N this week.

`USER-FACING: yes` — paths: `scripts/open-pulls.mjs` (new), `scripts/render-constant-pages.mjs`, `ledger/open-pull-requests.json` (new), `ledger/newer-results.json`, `c/*.html` (the touched pages), `package.json` (the selftest in `npm test`), `.github/workflows/reverify.yml` (the selftest step `reverify.test.mjs` requires), `AGENTS.md` (one Commands line), `continuity/items.json`.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice, 3: `A-47` (the depth audit David ruled on, slice 21 due today), `W-3` (the watch for acknowledgement of the erdosproblems.com/36 correction), `G-2` (the bound-improvement search goal; READ-TODAY per the kickoff).
- (b) owed child rows in the orchestrator's ledger: none, read "0 of 754 considered".
- (c) state reads marked CROSSED: none, read across the kickoff's state block (dated gates 3 unread of 4, stale-actionable 1 of 24, missingLinkedCommits nothing swept, queued rows 0).
- Carried, not due: `A-88` (the question for David once #244 has a reply) gains today's #243 observation above; its read stays dated 2026-10-24.

One prior-day retro finding that bears on today: Q2, "the four Codex prompt assemblies" should have been delegated. Today's Codex prompt gets built by a helper from the diff and read back once, not hand-spliced.

### Section 0

- Primer: `docs/cold-starts/2026-10-21.md` read (banner and first action). No primer is dated 2026-10-22.
- Listener: 🟢 SSE alive (hello 14:26:06Z) + loop armed by tool call.
- Codex: GREEN per the kickoff's `[codex-probe]` line (machine-level exec and write, 14:32:53Z).
- CI: `check-ci-status --workflow reverify.yml` GREEN and `--workflow page-check.yml` GREEN at `bcff34e`. Deploy drift: this lane's Pages site is not a Render service, so the fleet read sweeps nothing of ours; neither a stop nor a pass.
- Harness: running 2.1.308 · fleet UNIFORM · installed 2.1.308 (SAME).
- Recs yesterday: "For David: none new." (`docs/daily/2026-10-21-prelaunch.md` § Recommendation). Recs yesterday: none.
- Verify: today's `npm run verify` was started this session and had not finished when this packet was posted; its receipt is quoted at P3.

## What changed

(Written at P3.)

## Inputs (controllable)

(Written at P3.)

## Outputs (lagging)

(Written at close.)

## Recommendation

(Written at close.)

## On hold pending data

`A-88` (the question for David once #244 has a reply) waits on a maintainer reply to teorth/optimizationproblems#244, re-read 2026-10-24. `G-2` (the bound-improvement search goal) is held to 2026-11-19.

## State Appendix

(Written last, at close, from live commands.)
