---
product: bounds-ledger
date: 2026-08-31
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: c289a15
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. Our public page lists every mathematical constant we watch, and each row offers two links so a reader can check our number against the original document. Neither link worked: both handed the reader the raw file, which a browser shows as one run-on line of symbols instead of a readable table. Both now open a properly formatted page. That matters because checking a number in one click is the entire point of the page. We also brought the brief written for you up to date — it still said this project had never been confirmed right by anyone outside, which stopped being true on 23 August."
---

# Daily report — bounds-ledger — 2026-08-31

## BLUF

The page promised a reader could check any row against its source in one hop, and could not do it on either link it offered. Both now render. Separately, the brief written for David was five weeks stale and still said our one real metric was zero — it has been two since 23 August.

**FIRST ACTION** — the declared block, unchanged at five lines. Run it from the repo root, one command per line.

```
node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

Line 4 takes about three minutes because it makes one network request per mirror file (113 of them) and one per claim URL (233 of them) — give it a ten-minute tool timeout. **It no longer ends in `; echo "EXIT=$?"`**: `AGENTS.md` prescribed that until today, and a trailing `;` compound is the one shape the permission classifier cannot resolve, so it parks the pane at a silent prompt that reads exactly like a hang. The exit code is in `tmp/.verify-receipt.json`, beside the sha it was green at, which is the better read anyway. Line 2 is written without `--short` on purpose — `git rev-parse --short HEAD origin/main` fails outright, because two revisions plus `--short` is the failure; documented 2026-08-18 and hit live again on 08-30.

**THE NUMBER THAT WILL LIE TO YOU** — **`2 of 18` rows carrying `readCommandLastRun`.** The misread is to take it as "we have started stamping our gate reads and 16 remain". The 2 are the only two rows whose gates came *due* today, and the other 16 are not waiting on effort — **their `readCommand` fields cannot be run at all.** The gate runner executes the whole field with shell `#` comments stripped, and this lane house-styles the field as `command — prose`, so a row extracts its entire explanatory paragraph as its command. The number will move at roughly the rate gates come due, not at the rate anyone works on it, and a session that reads it as a backlog will bulk-convert 17 rows nobody is about to read. Second misread, still live and older: **177 unique cloners against 3 unique viewers** is not an audience — `reverify.yml` checks this repo out daily, on every push and on every pull request.

**DON'T-TOUCH** — the self-contained-page assertion in `render-site.mjs` that allows no third-party host. It rejected today's *better* candidate: upstream publishes typeset pages for all 111 constants (verified 111 of 111 by HEAD request, with a fabricated constant id returning not-found from the same host as the negative control, so the check discriminates) and they are nicer than the blob view we shipped. Linking there needs that assertion to separate an ASSET fetch from a NAVIGATION link. It works because it makes the page's independence checkable rather than intended — and relaxing a verifier to admit a candidate is exactly what this lane refused on 08-30. The better link is available whenever we decide that guard should be split, on its own merits, as a substrate decision.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing** — two unreadable document links on the reader's own verification path, a gate runner that could never stamp a row because of our own field convention, a rail gate that reads reports rather than the ledger it was pointed at, and a `readCommand` that cannot answer its own close condition — **none of them about a mathematical record**. **Consecutive instrument-facing days: 4.** `npm run catches` reads **0 for the current partial week** and 3 for the week of 08-24; the 08-24 figure was **byte-only**, so nothing has been recorded as numerically moving since. **The standing prediction, restated because a prediction never checked is decoration:** the next record-facing catch will be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. That is exactly what the 20 August issue was, so the prediction has held once; if the next one arrives via an alarm instead, say so and correct the claim.

## What changed

- **Both document links on every row now render** (`5011af8`). `source` handed the reader the checker's `raw.githubusercontent` URL, measured `content-type: text/plain`; the constant's name — the first link in every row — handed them our mirror off Pages, measured `text/markdown`. Opened in a real browser via `playwright-cli`: the document arrives as one plain-text node, bound tables inline as `| $\pi/2 = 1.57059$ | [SS2002] | |`. 111 rows × 2 links = 222 lines moved in `index.html`; the live page now carries 111 + 111 blob links and **0 raw URLs**.
- **`A-32` — the David-facing brief — closed, both halves** (`c289a15`). Voice check went `3 blocking, 2 advisory` exit 3 → **`voice: clean`** exit 0. The content half now states the `G-3` outcome in plain English with dates and names.
- **`A-2` — the standing drift-resolution log — dispositioned and re-dated to 09-07** (`d30fea2`). No cycle owed: no drift, 113 files, upstream moved from `5c4aeee` to `3a14910` without touching a mirrored byte.
- **`A-34` dispositioned dated-and-deferred to 09-02**, and the rail gate that flagged it was carved out at the physical report line it actually matched (`d30fea2`).
- **Two gates due tomorrow pre-staged** (`f96ba43`), one of which produced a finding — see *Recommendation*.

## Inputs (controllable)

- Five commits, all pushed, **all CI green**: `d30fea2`, `5011af8`, `b3e7469`, `f96ba43`, `c289a15`.
- **Due gates for today: 0.** Both closed or dispositioned. 17 open items, **zero overdue, zero date-less**.
- **`readCommandLastRun`: 0 of 18 → 2 of 18.** The due-gates print now shows a real timestamp and exit code where it printed `NEVER` this morning.
- Four carried-item sweeps clean (approved-unshipped, tool-outage gates, prose-commitments over 38 docs, closewhen-drift). A fifth, `check-instrument-liveness`, returned **NOTHING SWEPT / 0 feeds** — no Sentry on this lane by design and no report-caches file, which renders **not-ready**, never 0.
- **`CLAUDE.md` + `AGENTS.md` loaded size: 59,963 / 60,000**, measured by `node ../skylark-site/scripts/check-claude-md-sizes.mjs --stamp` at 15:05Z, which reports UTF-8 bytes LF-normalized per the unit ruling in `docs/size-budgets.md`. I pushed it over to 60,345 with an `AGENTS.md` addition this morning — bounds-ledger was the only lane over — and compressed it back. **37 bytes of headroom** is the number that matters, not the total.

## Outputs (lagging)

- **`G-4` = 0 arrivals against 3 unique viewers in 14 days.** From today this goal is reported as arrivals **over** viewers, never as a bare zero — approved under default-decision authority, with the threshold pre-committed **before** the read: a zero carries product information only at **≥30 unique viewers per 14 days** (rule-of-three; at n=3 the upper bound on the arrival rate rules out nothing). The zero is measured, not assumed: the probe fetched 26 issues, attributed all 26 to us, and the parts reconcile 26 + 0 + 0 = 26.
- **Traffic:** 3 unique viewers / 177 unique cloners on the trailing 14 days, 36 days recorded, day 23 since the public flip. The cloner figure is mostly our own scheduled CI.
- **`npm run catches`: 0 for the current partial week**, 3 for the week of 08-24, 16 movements across 7 weeks. Quote the per-week figure, never the total.
- **Retention / word-of-mouth instrument: not built, deliberately.** At 3 viewers a fortnight a return-rate manufactures a number rather than measuring one. Confirmed today, not re-proposed.

## Recommendation

**Close `A-18` tomorrow on the evidence, and fix its `readCommand` rather than letting it decide.** Its close condition — the primer carries a generated STATE block — **is satisfied**: four primers carry the generator stamp (08-27, 08-28, 08-29, 08-31) and today's carries the block. But its `readCommand` tests a *different* property — it greps `-L` for `exit 0` over a primer window and calls EMPTY the pass, and run today it returns two files, which read literally says the property FAILED while the close condition is MET. This is the 2026-08-25 finding one layer up: that one was a note recording a result its command could not produce; this is a `readCommand` that cannot answer its own `closeWhen`.

**Second, for the orchestrator, not for this lane to fix:** today's P4 prompt never reached this pane. The bus row is in the listener log at `15:49:08Z` and its own record reads `surfacedAt 15:50:28Z`, `executedAt 16:03:19Z`, `surfacedSession` = this session. Every turn in that window was a bare idle tick. The pane was idle, not parked at a prompt — which is what the stall detector inferred. **A row marked both surfaced and executed while the body never reached the agent is worse than a dropped row, because the ledger says it landed.**

## On hold pending data

- **`W-3`** (watch for acknowledgement of the erdosproblems.com/36 correction) — the July email is unanswered at five weeks. Signal date 2026-09-24. The page leg is ours and reads unchanged; the reply leg is not readable from our side at all.
- **`A-20`** (should the fetch layer retry with backoff on 429/502) — due tomorrow, read today with its positive control: no matches in `scripts/reverify.mjs`, exit 1, while `grep -c -i fetch` on the same path returns 10, so the absence is real and not a wrong path. Nothing shipped, so the question is genuinely open.

## State Appendix

Every value below was read by the command beside it, at the time given. **This report cannot name the commit that lands it** — the appendix is written last, from live commands, and the commit carrying this file is by construction one commit later than the HEAD named here.

- **HEAD** `c289a15` "A-32 closes: the brief said the metric was zero, and it has been two since 23 August" — as of **17:44Z** — release: `git log -1 --format=%h%x20%s`
- **Working tree** clean, `## main...origin/main`, 0 commits unpushed — as of **17:44Z** — release: `git status --porcelain --branch` and `git rev-list --count origin/main..HEAD`
- **CI** GREEN on all five of today's commits (`d30fea2`, `5011af8`, `b3e7469`, `f96ba43`, `c289a15`), run-level conclusion — as of **17:46Z** — release: `node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml`
- **Mirror** 113 files at upstream `3a14910` (an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo), no drift — as of **17:44Z** — release: `node scripts/reverify.mjs --check`
- **Claims** 233 total: 231 hold, 0 broken/unreachable, 2 UNVERIFIED (the `manual: true` pair on erdosproblems.com/36) — as of **17:44Z** — release: `node scripts/check-claims.mjs`
- **Public page** 111 constants at that sha, matching committed state; live page carries 111 upstream blob links, 111 mirror blob links, 0 raw URLs — as of **17:40Z** — release: `node scripts/render-site.mjs --check`
- **Ledger** 51 items: 34 closed · 17 open · 0 due on/before today · 0 overdue — as of **17:44Z** — release: `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print`
- **Board** 0 cards; nothing waiting on David — as of **14:21Z** — release: `node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger`
- **`G-4`** 0 arrivals / 3 unique viewers (14d), 26 issues fetched and all 26 attributed to us, parts reconcile — as of **17:45Z** — release: `npm run reports` and `npm run traffic`
