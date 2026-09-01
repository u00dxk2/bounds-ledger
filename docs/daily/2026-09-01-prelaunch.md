---
product: bounds-ledger
date: 2026-09-01
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 7ba4f3c
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. Our public page lists every mathematical constant we watch, and it asks visitors 'is the number you cited still current?' - but until today you could only search it by the constant's NAME. If you arrived holding a number, the page could not help you. Now you can paste the number itself. We also nearly shipped something worse: a line showing what each row used to say. A review caught that on Brun's constant, where the older number a reader might have cited is STILL correct - upstream simply added a second row beneath it, under an extra assumption. The page would have told that reader their number was out of date when it is not, which is exactly the mistake this project exists to catch in other people. The search works; the misleading line never went live."
---

# Daily report — bounds-ledger — 2026-09-01

## BLUF

The public page asks whether the number you cited is still current and could not be searched by a number. It can now. The same change nearly published a false supersession claim about Brun's constant, and an adversarial review caught it in the twenty minutes between commit and push.

**FIRST ACTION** — the declared block, five lines, from the repo root, one command per line.

```
node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

Line 4 takes about three minutes and makes roughly 450 network requests — give it a ten-minute tool timeout. Its exit code is in `tmp/.verify-receipt.json` beside the sha it ran at; do not append `; echo "EXIT=$?"`, which parks the permission classifier. Line 2 is written without `--short` on purpose — see *Inputs* for the exit code that combination produces.

**Expect line 4 to exit 1 on a leg this repo cannot fix.** The hosted brief is missing the 31 August block and the port is the orchestrator's. Everything else was green all day.

**THE NUMBER THAT WILL LIE TO YOU** — **`npm run catches` listing `pin:81a:U` as a catch.** The misread is that Brun's constant's upper bound moved. It did not. Upstream **appended** a row conditional on the Generalised Riemann Hypothesis (`2.1594`, [D2025]) *below* the unconditional `2.288513` ([PT2018]); both are still in the table at `constants/81a.md:13-14`, and upstream says in terms that they are not comparable. Our generated pin tracks the LAST-LISTED row, so the pin changed while nothing was superseded.

The script's own header already warns that positive counts are an activity ceiling, so this is not a defect in it — but it sharpens the classification clause this lane writes every day. That clause asks whether a counted catch was **numeric or byte-only**, and today shows the dichotomy is incomplete: `pin:81a:U` changed *numerically* and still was not a movement. **Numeric-but-an-append is a third category, and it is the one that can put a false statement in front of a reader.** Second misread, still live and older: 168 unique cloners against 3 unique viewers is not an audience — `reverify.yml` checks this repo out daily, on every push and on every pull request.

**DON'T-TOUCH** — **the `npm run verify` receipt gate**: `tmp/.verify-receipt.json` plus `agent-status`'s refusal of the day's first bus post without a receipt at the current HEAD. It works because it binds *the gate was green* to a **sha** rather than to somebody's memory, and the doc-only-ancestor carve-out means the ~450-request cost is paid once per code change rather than once per commit. It earned it this morning by recording `exitCode 1` at `f219f55` instead of letting a remembered "green all day yesterday" carry into a day that opened red.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing** — a check chain whose unfixable leg hid a fixable one, a gate that gave three different answers, a failure count blind to its own population, and a page feature that would have made a false claim about a record — **but the fourth is a kind this lane has not recorded before, and the distinction is worth keeping: it is the first instrument defect that would have published a false mathematical statement to the public**, rather than merely mis-measuring us. **Consecutive instrument-facing days: 5.** `npm run catches` reads **0 for the current partial week** and 3 for the week of 08-24; nothing has been recorded as numerically moving since, and see the number-that-will-lie above for why even the counted ones need reading twice. **The standing prediction, restated because a prediction never checked is decoration:** the next record-facing catch will be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. It has held once (20 August). If the next one arrives via an alarm instead, say so and correct the claim.

## What changed

- **The page can be searched by a number** (`3145ed9`, corrected by `7ba4f3c`). The filter matched the constant's name and its id — the page admitted as much in its own empty state — so the reader the headline addresses could not use it. It now matches the bound value of every pinned row, current and previously-pinned, on substrings. Verified live, not locally: `GET https://u00dxk2.github.io/bounds-ledger/` returned HTTP 200 / 260,837 bytes carrying `data-find="brun&#39;s constant 81a 2.1594 1.840503 2.288513"`.
- **The half that did not ship.** `3145ed9` also displayed the previously-pinned value as "our pinned row read X until then". An adversarial review refuted it before the push, on Brun's constant — the conditional `[D2025]` row appended below the unconditional `[PT2018]` one, both live at `constants/81a.md:13-14` — and the wording defence written into that commit body was itself wrong: a current value, a "value changed" date and a previous value form a from-to pair, and **a from-to pair is a movement claim whatever noun sits in the sentence**. `8a4192a` (2026-08-23) refused this exact inference on this exact row in writing; twelve days later it returned as a feature, past an author who quoted that rule in the same commit. Checked across all eight rows that rendered a previous value: **eight of eight were appends or restructures, not replacements.** Fixed by keeping the value searchable and never rendering it — search asserts nothing.
- **Four more from the same review, all fixed:** the seam between `findKey` and the row template was untested (reverting the template left every new assertion passing while no visitor could search by any number); a comment claimed a guard that does not exist (no test in this repo invokes `changeFor` — positive control: every selftest calls `buildRows` with `withDates: false`, the path that skips it, and those calls do run); the empty-state prose was false twice; and a latent `git log -S` substring collision was recorded, not fixed.
- **`check-brief.mjs` moved to the end of the `npm run check` chain** (`348593f`). It is the only leg this repo cannot fix and it sat fifth of six, ahead of `check-deferrals.mjs` — so this morning's stale-brief failure meant the deferral gate **never executed**, and today's answer was *unknown*, not *no*. A run in that state is indistinguishable from a clean one.
- **`A-18` closed** (`78c8e1d`) on `closeWhen` **branch 2** — explicitly killed — not branch 1. Branch 1 is a conjunction whose first conjunct was never built here.
- **`A-20`'s discriminator resolved to SHIP** (`a3dc9a5`), and the retry itself is built and on a branch (`8a4c2b8`), unmerged pending the cross-family review lane.

## Inputs (controllable)

- **Five commits on `main`, all pushed**: `348593f`, `78c8e1d`, `a3dc9a5`, `3145ed9`, `7ba4f3c`. One branch pushed unmerged: `a20-fetch-retry-backoff` at `8a4c2b8`.
- **Both dated gates due today dispositioned.** `A-18` closed; `A-20` resolved to ship with its implementation branched.
- **`A-18`'s close needed three criteria read against each other, and they disagreed.** Its `readCommand` (exit-code property) returned two files, reading literally as FAILED; `closeWhen` branch 1 was unsatisfiable because `render-state-block.mjs` has no `--primer` target (`grep -c "primer"` → 0 at exit 1; positive control `grep -c "check"` → 25); and its `releaseTest` FIRED (`grep -c "^## Session close-out"` → 2 on both the named and the newest primer, and ≥2 is documented to mean BUILD). The releaseTest fired and should not have — its proxy stopped discriminating once close-out sections began declaring themselves additive. Recorded on the row with an explicit instruction not to carry it forward unchanged.
- **`A-20` was nearly decided against its own pre-registered gate.** Before reading `onTrigger` I had assembled an evidenced case to DECLINE — 61 consecutive green runs, zero transport failures in seven days. The row carried `N_min = 3` and one unresolved boundary case. Resolving it flipped the answer to SHIP. `note6` records this lane making the identical error on 08-27 in the opposite direction.
- **Codex: GREEN (probe 2026-09-01T14:15:40.323Z).** `codexCalls: 1`, reason `dispatched` — the A-20 retry implementation. It hit two sandbox blockers (`.git` read-only; nested `execFileSync("node", …)` denied EPERM) and reported both rather than working around them. It supplied negative controls for both of its own test cases unprompted.
- **`npm test` exits 0** on the full offline battery, including the new retry tests on the branch and the new search tests on `main`.
- **Two first-action facts that belong here rather than in the BLUF.** `npm run verify` issues roughly **450** network requests — 113 mirror files plus one per claim URL — which is why it is run once after the last code-touching commit and not per commit. And `git rev-parse --short HEAD origin/main` exits **128**: two revisions plus `--short` is the failing combination, documented 2026-08-18 and hit live again on 08-30, which is why the declared block writes that line without `--short`.

## Outputs (lagging)

- **`G-4` = 0 arrivals against 3 unique viewers in 14 days.** Reported as arrivals **over** viewers, never as a bare zero, against the threshold pre-committed on 08-31: a zero carries product information only at **≥30 unique viewers / 14 days**. The zero is measured — 26 issues fetched, all 26 attributed to us, parts reconcile 26 + 0 + 0 = 26.
- **Traffic:** 3 unique viewers / 168 unique cloners on the trailing 14 days; 37 days recorded, day 24 since the public flip. The cloner figure is mostly our own scheduled CI.
- **`npm run catches`: 0 for the current partial week**, 3 for the week of 08-24, 16 movements across 7 weeks. Quote the per-week figure, never the total — and read the number-that-will-lie note above before quoting even that.
- **Retention / word-of-mouth instrument: not built, deliberately.** At 3 viewers a fortnight a return-rate manufactures a number rather than measuring one. Confirmed again today, not re-proposed.

## Recommendation

**Pre-commit a threshold for the consecutive-instrument-facing-days count, before tomorrow's read.** It stands at 5 and nothing happens at any value. A counter that cannot change a decision is exactly what this lane refuses everywhere else, and this one exists precisely because the dry-week rule cannot see a stretch that is busy with findings about our own machinery. Proposed: **7 consecutive instrument-facing days with `npm run catches` at 0 numeric movements over the same window** raises a David card for "adopt a second surface" — never a self-approval. Same discipline as the `G-4` viewer threshold pre-committed on 08-31: the number must mean something *before* it is read.

**Second, for the review lane:** `a20-fetch-retry-backoff` is ready and unmerged. It touches the network paths of two trusted instruments, which is why it is not on `main`. Check it still merges (`git merge-tree --write-tree main a20-fetch-retry-backoff`) before spending a runner on it.

**Third, a correction to `AGENTS.md`, measured today.** It says GitHub Pages builds "one per commit, doc-only included". Today's push carried **two** commits and produced **one** build row, for the tip — no row exists for `3145ed9`. Positive control: the same fetch returned rows for `7ba4f3c`, `a3dc9a5` and `348593f`, so the endpoint was answering and the absence is real rather than an empty read. Pages builds per **push**, not per commit. Every earlier sample was a single-commit push and could not discriminate. This is load-bearing in both directions: it is why the refuted page was never served, and it means a multi-commit push cannot be assumed to publish its intermediate states.

## On hold pending data

- **`W-3`** (the watch for acknowledgement of the erdosproblems.com/36 correction) — the July email is unanswered at five weeks. Signal date 2026-09-24. The page leg is ours and reads unchanged; the reply leg is not readable from our side at all.
- **The hosted brief** — missing the 31 August block, so `npm run verify` exits 1 on a leg this repo cannot fix. Posted to the bus as `c507aab3`; the port is the orchestrator's.

## State Appendix

Every value below was read by the command beside it, at the time given. **This report cannot name the commit that lands it** — the appendix is written last, from live commands, and the commit carrying this file is by construction one commit later than the HEAD named here.

- **HEAD** `7ba4f3c` "Searchable, never displayed: the review refuted the visible half before it published" — as of **15:11Z** — release: `git log -1 --format=%h%x20%s`
- **Working tree** `## main...origin/main`, 0 commits unpushed at read time; `continuity/traffic.json` modified by today's sampler and this report untracked, both landing in the commit after this line — as of **15:11Z** — release: `git status --porcelain --branch` and `git rev-list --count origin/main..HEAD`
- **CI** GREEN at HEAD, run-level conclusion, 1 completed non-scheduled success and 0 failures — as of **15:11Z** — release: `node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml`
- **Mirror** 113 files at upstream `3a14910` (an upstream `teorth/optimizationproblems` sha; `git cat-file -t 3a14910` reports it is not a valid object here — positive control: the same command on `7ba4f3c` returns `commit`), no drift — as of **14:30Z**, the last live read, taken by `npm run verify` at `348593f`; nothing under `ledger/` has changed since — release: `node scripts/reverify.mjs --check`
- **Claims** 233 total: 231 hold, 0 broken/unreachable, 2 UNVERIFIED (the `manual: true` pair on erdosproblems.com/36, both advisory-200 locally) — as of **14:30Z**, same run as above — release: `node scripts/check-claims.mjs`
- **Public page** LIVE and verified against the published site, not the local file: HTTP 200, 260,837 bytes, carrying `data-find="brun&#39;s constant 81a 2.1594 1.840503 2.288513"` and **0** occurrences of "until then"; Pages build for `7ba4f3c` reports `built` — as of **15:06Z** — release: `Invoke-WebRequest https://u00dxk2.github.io/bounds-ledger/` and `gh api repos/u00dxk2/bounds-ledger/pages/builds`
- **Ledger** 51 items: 35 closed · 16 open · **0 due on/before today** · 0 overdue · 0 of 16 open gate-shaped rows without a read command — as of **15:12Z** — release: `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print`
- **Three open rows carry no `expectedSignalBy` and that is deliberate, not drift** — `A-2` (standing drift-resolution log), `A-9` (fix-on-touch backlog), `W-4` (the standing watch on KP-78 — the rule that no detector ships until it has been shown both to fire and to stay silent — a watch that by design never closes). The canonical resolver counts them as gate-shaped-with-a-command rather than undated; a hand-written predicate over `expectedSignalBy` alone reports them as a 3-row gap and is wrong. Read the resolver, not the field — as of **15:12Z**
- **Branch** `a20-fetch-retry-backoff` at `8a4c2b8`, pushed, unmerged, and it still merges cleanly into `main` — as of **15:12Z** — release: `git merge-tree --write-tree main a20-fetch-retry-backoff` (exit 0)
- **Board** 0 cards; nothing waiting on David — as of **15:11Z** — release: `node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger`
- **`G-4`** 0 arrivals / 3 unique viewers (14d); 26 issues fetched, all 26 attributed to us, parts reconcile 26 + 0 + 0 = 26. Traffic 3 viewers / 168 cloners, 37 days recorded, day 24 since the public flip — as of **15:09Z** — release: `npm run reports` and `npm run traffic`
