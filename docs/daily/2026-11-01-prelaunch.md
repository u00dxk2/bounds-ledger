---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: read
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-11-01
lifecycle_stage: launched
last_deploy: 7d9dbcbf7e (CI GREEN at the kickoff read; GitHub Pages lane, no Render service)
on_hold_items: 0
top_action_today: tell the 1d page's reader that the better value a paper reports cannot be checked, because neither the paper nor its code publishes the function behind it; plus A-92's OpenAlex run at or after 18:00 MDT
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-11-01 (Sunday, MT)

## BLUF

The 1d page says a new paper reports a better value that we have not checked. We looked: the paper and its code share the function for five other problems but not for this one, so no reader can check the value either. Today the page will say that, so nobody cites 1.4564 as a bound. Tonight we run the paper count for the planned third area.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** `W-17` (the standing newer-papers line on every constant page), the 1d page only. Its line names arXiv:2609.40340v1 as reporting a value stronger than every 1d upper bound and says "We have not checked that value" (not David's words). Add what a reader needs before citing it: the paper and its code repository publish no function behind that value, so it cannot be checked from public material.

**The user problem, in the user's words:** "I cited a bound and a referee told me it had been improved. I had no way to know." (`docs/evangelism-bar.md`.) The 1d page now tells that reader about a possible improvement. It does not yet tell them whether they could cite it, and "we have not checked" reads as if someone could. Nobody can with what is public, and that is what decides whether the number belongs in their paper.

**Section 0.**
- Primer: `docs/cold-starts/2026-10-31.md`, read whole (no 2026-11-01 primer; primers are named for the day they are written). Its banner names `A-45` and `A-91` (both due today) and `A-92`'s OpenAlex run, once, at or after 18:00 MDT.
- Listener: 🟢 SSE alive (restart marker 2026-11-01T15:31:24Z, pid 2424; `hello` 15:31:26Z and `replay-complete` below it). The loop is armed by `ScheduleWakeup` tool calls, and waker ranks 1-3 are running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, machine-level exec at 05:03:38Z).
- CI: GREEN at `7d9dbcbf7e2bee577164c2ae9c15469f24054d57` for reverify.yml and page-check.yml (`check-ci-status.mjs --workflow <file>`, each "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending"). `npm run verify` exit 0 at the same sha (`tmp/.verify-receipt.json`, at 15:45:18Z).
- Deploy drift: `check-deployed-sha-drift.mjs` exit 3, "1 finding(s) across 38 service(s)". The finding is `skylark-auto-progression`, the orchestrator's service, not this lane's. This is a GitHub Pages lane with no Render service, so the read sweeps nothing of ours: neither a stop nor a pass. The same run listed 38 services by name with live and head commits, so its sweep read real rows.
- Harness: running 2.1.316 · fleet UNIFORM (27 of 27 panes) · installed 2.1.316 (SAME).
- Recs yesterday: none (the 10-31 report's Recommendation section reads "None for David yet").
- The kickoff lead asked to confirm card `905de666` is live. The 10-31 report recorded `npm run served` at `274fb98872`: "4 checked — 4 served, 0 in flight, 0 stale, 0 unreachable" (not David's words), plus a live fetch of the three pages. That was yesterday's read, so I read the pages again today.
- mechanism-verified: a live fetch of `https://u00dxk2.github.io/bounds-ledger/c/8a.html`, `c/46a.html` and `c/77a.html` this morning returned HTTP 200 for each, Last-Modified "Sat, 31 Oct 2026 21:28:36 GMT", bytes equal to the committed files at `7d9dbcb`, and 3 links to github.com/openai/math on each page. Card `905de666`'s ruling is live. Dismissing it and the two other carried-out cards (`d780e2ec`, `903a38ba`), which still show `[answered]` on the board, is P3 hygiene.
- The lead also asked whether the OpenAlex run owed after 18:00 MDT on 10-31 ran. It did not: the 10-31 close moved it to 11-01 at or after 18:00 MDT (primer "Session closed 15:30 MT"). It is owed tonight.
- Prior-day retro: 9 still-on-discipline findings, 1 carried. The carried one is this choice: `W-17` (the newer-papers watch) and its 1d value, "open and optional" (not David's words). It recurred as a premise, not as a defect.

**Evidence** (each read today, 2026-11-01 MT):
- OBSERVED · the committed `c/1d.html`, newer-papers sentence · "One of them, arXiv:2609.40340v1, reports a value for this constant stronger than every bound on its side in this page's tables. We have not checked that value, and this page's tables do not include it." (not David's words).
- OBSERVED · arXiv:2609.40340v1 HTML full text, downloaded whole (9,758,587 bytes) to the session scratchpad and searched · the string "1.4564" occurs twice, both in Table 9 ("Table 9: Mathematics"), in the AC3 column of the EvoDuet rows, as the Best of "Mean ± Std / Best" (rows "1.4569 ± 0.0008 / 1.4564" and "1.4579 ± 0.0022 / 1.4564"). "AC3" occurs 5 times: the task list, the Appendix C.1.2 description (signed heights on [−1/4, 1/4], minimize ‖f∗f‖∞/(∫f)²), Table 4 (NDG percentages) and Table 9. None of the five gives heights, a grid size or a link to a construction. Positive control: the same search found the value, so it ran over the right document.
- OBSERVED · the paper's code repository, `Open-Galapagos/EvoDuet` (linked as "Code" from the paper's project page), tree at commit `75c9ba36b5a17b53e6bfa74a4e63b633971a2fca` (a commit of that repository; it does not exist in this repo) (`gh api …/git/trees/HEAD?recursive=1`) · `benchmarks/math/third_autocorr_ineq/` holds a config, an evaluator and `initial_program.py`, and no `oracle/` directory. `best_programs/mathematics_discovery/` holds best constructions for five tasks (Hadamard 29, circle packing 26 and 32, Erdős minimum overlap, sums and differences) and none for the third autocorrelation. Positive control: `first_autocorr_ineq/oracle/` and `second_autocorr_ineq/oracle/` each hold a best program, so the search does find published constructions where they exist. pragma: allowlist sha
- HYPOTHESIS · the value could still be published later or on request. That is why the page sentence carries the date we looked.
- OBSERVED · `npm run reports` · "raw issues fetched: 37 … OUTSIDE ARRIVALS: 0 … parts reconcile: 37 + 0 + 0 = 37". The 0 is expected at this traffic level, not a reading that nobody reads the pages. (An earlier attempt this morning failed on a TLS handshake timeout and printed no figure, as designed.)
- OBSERVED · `check-cycle-rotation.mjs --lane bounds-ledger` · "no product-love cycle picks this lane today … run the normal P3", exit 0.
- OBSERVED · `check-due-gates-dispositioned.mjs --snapshot` · "snapshot written — 2 gate(s) due on/before 2026-11-01" (`A-45`, `A-91`).
- MISSING · any real reader's word on the 1d line. There is no evidence ledger and no identified reader. The pick rests on the bar's second phrasing and on the carried retro finding.

**Permission:** `W-17` (the newer-papers watch) is open, not parked, waiting or frozen. Its onTrigger sends "a change to the line's WORDING" (not David's words) back through review and David's yes, and this is a wording change. So the sentence is built dark behind a store field, gets a Codex code and claims pass, goes to David on a card, and goes live only on his yes. No freeze covers the `c/` pages.

**Next action:** improve (a reader-facing sentence). In P3: an optional field on the `perConstant` entry for a `reported-stronger` paper recording that its construction was looked for and not found, with the date and the two places searched. The renderer adds one sentence when the field is present. Self-test it red-armed (field present → sentence, absent → today's text unchanged, a malformed field → refused). Then Codex review, then the card. First command, the baseline:

```
node C:/dev/skylark/bounds-ledger/scripts/newer-results.mjs --selftest
```

**Acceptance condition:** on David's yes, the live `c/1d.html` carries the new sentence once, and every other constant page is byte-identical to today's. `render-constant-pages --check` reads "120 constant page(s) match committed state" (not David's words), and `npm run served` reports the changed page SERVED.

**Delivery and encounter checks:** delivery = `npm run served` after the push. Encounter = blind (`A-59`). The pages carry no analytics. The only countable event is a report filed through the page's own link, counted by `npm run reports` and readable at N = 1 (0 outside arrivals of 37 raw today).

**USER-FACING:** yes · `scripts/newer-results.mjs`, `ledger/newer-results.json`, `c/1d.html` (re-rendered), `continuity/items.json`, `docs/daily/2026-11-01-prelaunch.md`.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice, 2: `A-45` (the stale-value resolvability read) ran through `--run A-45` at 15:40Z: "RESULT: 257 of 257 resolvable (100.0%) — a figure, not a verdict (exit 0)". `A-91` (67a's withdrawn preprint, held at the outward gate) ran for the first time through `--run A-91`: output `[]`, exit 0. Its positive control (the same search for 87a) and the read of the mirrored 67a.md for "withdrawn" are still owed before re-dating it.
- (b) owed child rows: none. Read: "Rows owed to you in skylark-site's ledger: NONE".
- (c) CROSSED state reads: none. Read: dated gates 2 (owed, listed in (a)), HEAD CI GREEN, queued rows 0, stale-actionable 0 of 27, missingLinkedCommits nothing swept.
- Also: three answered cards (`905de666`, `d780e2ec`, `903a38ba`) still read `[answered]` on the board after their rulings were carried out; dismiss each as done, after today's live read of the pages they govern.

## What changed

<!-- findings:begin -->
- **The packet's premise held, and its wording did not.** The packet planned to say the repository "publishes" nothing for this problem. Codex found in three rounds running that any page clause about the repository claimed more than a read of its file names supports, and that such a clause contradicts the line's closing "We searched no source other than arXiv". The page sentence now reports only what we read in the paper. The repository finding lives on `W-17` (the newer-papers watch) and in David's card, not on the page. The orchestrator approved that in reply to the consult (msg 7fdb339c).
<!-- findings:end -->

- `e9b9115`, `f867b2a`, `5abd27d`, `0b33226`, `ed87b8d` (pushed): a `reported-stronger` entry may carry `constructionLookup { on, repository }`, and the line then adds: "On 2026-11-01 we looked for a function that gives that value and found none in the paper's text (version 1, appendices included). Until one is published and checked, cite that value as a result the paper reports, not as a bound." The repository is stored and validated but never rendered. The committed store has no lookup, so no page changed: `render-constant-pages --check` read "120 constant page(s) match committed state" after the push. CI: reverify.yml and page-check.yml each GREEN at `ed87b8d`.
- Codex reviewed it four times (read-only, banner workdir checked each time). r1 to r3 each said FIX FIRST on claims; r4's claims pass held on every clause, and its one test finding (an `endsWith` pin) is fixed in `ed87b8d`. Five mutations were red-armed, and each failed the check it targets.
- David's card 59503849 is filed (needs-decision msg 5bad7e97). The switch-on is one store edit, a re-render and a push, on his yes.
- `A-45` (the stale-value resolvability read) and `A-91` (67a's withdrawn preprint) were read and stamped. Cards 905de666, d780e2ec and 903a38ba were dismissed as done. The `W-17` (the newer-papers watch) row carries the lookup evidence in `lookup1d2026_11_01`.

## Inputs (controllable)

- None yet.

## Outputs (lagging)

- `npm run reports`: 0 outside arrivals of 37 raw issues (read 2026-11-01).

## Recommendation

- None for David yet.

## On hold pending data

- None.

## State Appendix

Written at the close from live commands. The close commit itself cannot appear here.
