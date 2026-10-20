---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-20
lifecycle_stage: launched
last_deploy: 83631da (HEAD at the 10-20 kickoff)
on_hold_items: 1
top_action_today: build the check that fails when an upstream update moves an audited row off its recorded line (A-85), while the 13a citation correction (A-87) waits for David to fetch two papers
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-20 (Tuesday, MT)

## BLUF

The correction to a wrong citation on the 13a page is drafted and on hold until David fetches two papers that no site would serve us. Meanwhile today's work is a check so that a reader never again sees a current verdict marked as out of date after an upstream update.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** a reader of a constant page never sees a verdict labelled "checked on an earlier version of the table" when the row it checked is unchanged and has only moved down a line. Item: `A-85` (a check that fails when an upstream update moves an audited row off its recorded line).

**Why not the kickoff's ONE JOB.** That job is `A-87` (the upstream correction of 13a's [GP1974] reference, its title and DOI). It is drafted (`docs/decisions/2026-10-20-A87-13a-GP1974-citation-correction-draft.md`, repository commit `83631da`) and HELD under David's own condition on board card 5d5d4962: hold if a paper cannot be opened. Neither paper could be opened on 2026-10-20 (about 15:20Z): the 1974 Gerriets and Poole paper and the 1976 Redheffer article both drew 403 from doi.org and Taylor & Francis and a challenge page from JSTOR, and the 1974 paper's Semantic Scholar and Wayback reads drew 429. Board card de2d2d07 asks David to save both PDFs to `tmp/papers/`. The trigger that resumes `A-87` is those files existing (its readCommand). Nothing has been sent.

**The user problem, in the user's words:** "This page says the check was done on an earlier version of the table. Is the verdict still good, or not?" From the 2026-10-18 resnap until repository commit `11f7861` on 2026-10-19, ten audited rows (8 SOUND, 1 UNRESOLVED, 1 UNREACHABLE) showed that wording on the public pages while their text was unchanged, and no check said so.

**Evidence** (each read today, 2026-10-20 MT, unless marked):
- OBSERVED (2026-10-19, `A-85.notes`) · the public constant pages · ten rows moved one to three lines by the 10-18 resnap, rendered as historical until fixed by hand in `11f7861`; `render-constant-pages --check` stayed green throughout. Found by the manager's question, not by an alarm. Limit: one resnap observed.
- OBSERVED · `npm run verify` · exit 0 at `76d99a1` (receipt 15:11:50Z); `83631da` is doc-only on top. `check-ci-status --workflow reverify.yml` GREEN at `83631da`.
- OBSERVED · `npm run reports` · 34 issues fetched, 34 ours, 0 outside arrivals; parts reconcile 34 + 0 + 0 = 34. The bar's metric (useful non-obvious answers delivered) stays NOT MEASURABLE, per `docs/evangelism-bar.md`.
- OBSERVED · `check-cycle-rotation --lane bounds-ledger` · "no product-love cycle picks this lane today", exit 0.
- HYPOTHESIS · that the next resnap moving an audited row would repeat the 10-18 failure silently. That is A-85's premise, and the red-arm proves it before the fix lands.
- MISSING · any read of whether a visitor opened an affected page during that window (the pages have no analytics; `A-59`, encounter blind on the public pages).

**Permission:** `A-85` is open, owner bounds-ledger, no park, no card; a check in this repo's own gate is the lane's own decision class. `A-87` is outward and David-gated: nothing is sent without his yes on the final text.

**Next action** (kind: repair the one measurement). First command, the read the row names, which is green today and is the defect:

```
node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --check
```

**Acceptance:** a committed check run by `npm run check` that fails, naming the entry and the re-point line, when an audited entry's exact row text sits on a different single line of its file than its `rowLine`, and passes when every entry is at its line or its row truly changed. Both outputs recorded on `A-85`, with the mutation proved landed by `git diff --numstat`.

**Delivery and encounter checks:** delivery is `npm run check` on the next resnap. At low traffic the encounter event is a resnap that moves an audited row; it reads at N=1, and the check must name the row before any page renders.

`USER-FACING: no` — paths: `scripts/` (the new check), `package.json` (wiring it into `npm run check`), `continuity/items.json`. The check changes no served page; it stops a stale page from passing.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice, 4: `G-2`, `W-13`, `W-4`, `W-8`. Each was read at 00:45 MT with exit 0 and outputs in `continuity/read-outputs/`; each still owes its disposition.
- (b) owed child rows in the orchestrator's ledger: none, read "0 of 754 considered".
- (c) state reads marked CROSSED: none, read across the kickoff's state block (dated gates 0 unread of 4, stale-actionable 0 of 25, missingLinkedCommits nothing swept, queued rows 0).

### Section 0

- Primer: `docs/cold-starts/2026-10-20.md` read (banner and first action).
- Listener: 🟢 SSE alive (hello 15:07:55Z) + loop armed by tool call.
- Codex: GREEN per the kickoff's `[codex-probe]` line (machine-level exec and write, 04:14Z).
- CI: `check-ci-status --workflow reverify.yml` GREEN at `83631da`. Deploy drift: NOTHING SWEPT. This is a GitHub Pages lane with no Render service declared, which is neither a stop nor a pass.
- Harness: running 2.1.304 · fleet UNIFORM · installed 2.1.304 (SAME).
- Recs yesterday: "None new for David" (`docs/daily/2026-10-19-prelaunch.md` § Recommendation), so nothing to disposition.
