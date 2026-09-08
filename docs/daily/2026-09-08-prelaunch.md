---
product: bounds-ledger
date: 2026-09-08
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: df460f0
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 2
top_action_today: "For four days our own health check had been failing for everyone, for a reason nobody could fix — and our public README told visitors three times to run that exact command and read its result. Anyone who followed our instructions got a failure and a sentence blaming a password they had been told they did not need. That is fixed. Separately: a reader holding a number like the square root of 2, or a very small number written as ten-to-the-minus-335, typed it into our page's search and was told we do not track it — the number was sitting on the row. Our search only understood our own notation, not the way papers print it, and it was wrong on 28 of our 115 entries. Also fixed and live. Nothing needs you. The question you asked on 26 August is still owed and has now slipped a fourth time; it is dated tomorrow."
---
# Daily — bounds-ledger — 2026-09-08

## BLUF

The gate that guards this ledger had been failing for four days for a reason no repository change could fix, and our own front door told visitors to run it.

**FIRST ACTION.** Pull, then start the gate — it is three minutes of network and it finds the day, but a receipt on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** `npm run catches` prints **0** for the week of 2026-09-07. A cold reader takes that as a quiet week. It is a **partial** week — the script excludes the current one from its own month-of-zeros rule and says so — and the last completed week read **7**. Quote the per-week figure against completed weeks, never the partial cell and never the 23-movement total printed beside it. Second trap in the same output: it counts drift **detection** only, so it is structurally blind to the defect class that produced this lane's only outside impact.

**DON'T-TOUCH.** `tmp/.verify-receipt.json`'s `failedGates` **array** — specifically, do not let anyone collapse it to a boolean. It is what let today's exit 2 be diagnosed in one read: the receipt said `["check:brief"]` from a run that never happened, while the process had actually refused at an untracked-file pre-flight. Reading the gate's stdout rather than trusting the receipt is what caught that the receipt predated the run.

## What changed

**A-41 closed — the brief leg is excluded from the exit code, and the front door works again** (`4021830`). `check:brief` is the last link in `npm run check`'s `&&` chain, so its permanent exit 3 *was* that command's exit code for us and for every visitor since 2026-09-04. The README told a reader to run it and read that code in three separate places, and its one explanatory sentence carried three defects: it blamed a missing `CC_PROMPTS_PIN` (false since 09-04 — the leg fails identically *with* the credential, which is A-41's entire content) and said the command runs "two more" checks when it runs six. Verified from the visitor's own environment: `env -u CC_PROMPTS_PIN npm run check` exits **0**, with `BRIEF UNVERIFIABLE` still printed in full.

The exclusion is one exit code wide and keyed on the **code**, not on output text — 3 is the only UNVERIFIABLE branch in `check-brief.mjs`. A **stale** brief (exit 1) still reds the gate, which is A-41 note4's counter-argument honoured rather than waived. `spawnSync`'s `.status` is the child's real exit code: no shell, no pipeline, no `tee` whose 0 could win.

**The reader holding `sqrt(2)` or `10^-335` stopped getting the empty state** (`df460f0`). Yesterday's fix served the reader holding `117/370`; it left the two other notations a paper prints reachable only by typing our LaTeX. Measured from the built page's own `data-find` attributes: **28 of 115 rows** carried a radical or a power with no form a reader could type — 22 radical, 10 power, four both. After: 0 and 0, with the probe's positive controls still finding 28 rows containing a radical and 13 containing a power, so the zero is a measured absence of the gap rather than a probe that stopped matching.

Transliteration, never arithmetic: `1+\sqrt{2}` enters as `sqrt(2)` and `sqrt2`, **never** as `2.414`. Computing a decimal would put a number in the search index that no source asserts and no pin backs — the same trap as promoting a generated pin to a "record" claim.

**A-29 closed** as not-available-on-this-plan, its registered second branch. `validity_checks` reads `disabled`; the positive control `.secret_scanning.status` reads `enabled`, so the field is real. The paid-tier pair refuses while `secret_scanning` and `push_protection` are both **enabled** — the posture is intact and what is missing is an enrichment, not a control. The entitlement hypothesis stays **UNVERIFIED**: the only control reachable today meant flipping a different security setting on a public repo as a test, and mutating a production setting to prove a hypothesis is not a trade worth making.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing** — a lead-composition grammar gap, a missing zero-guard in `check:deferrals`, a corrupted inline probe, and a freeze-check I drafted without running — while the two ships were **product-facing debt and product-facing improvement** respectively; **no record moved** (`No drift. 116 files match upstream 9d57db8` — an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo).

**Consecutive instrument-facing days: 3.** Yesterday's report says 2, and I read that off it rather than recalling it. Written by hand; nothing counts this.

**Byte-only vs numeric:** `npm run catches` reports **0** movements for the current partial week, so nothing was counted either way today — neither a numeric move nor a byte-only one. The last completed week read 7.

**The standing prediction, checked because a prediction never checked is decoration:** the registered claim is that the next record-facing catch will be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. **No record-facing catch arrived today, so the claim is neither confirmed nor refuted** — it stands unchanged into tomorrow.

## Inputs (controllable)

- Three commits pushed: `4021830` (A-41 — the row asking whether a permanently-unverifiable brief leg should keep contributing to the gate's exit code — closed, plus the visitor front door), `61cecd9` (the W-6 — the read window for the README report-an-error channel — traffic sample), `df460f0` (the notation ship). All three CI-green.
- Four dated gates dispositioned: two closed (A-41, A-29), two re-dated with stated reasons (A-20 → 09-11, A-34 → 09-09).
- Gate discipline held: **two** full `npm run verify` runs for the day's code, not one per commit — the batching rule working as intended. A third run was refused before it spawned, correctly, by the untracked-file pre-flight.
- One new detector shipped with both polarities proven and **two** red arms tripping **different** assertions.

## Outputs (lagging)

- **G-4 (Tier-0: an outside party acts on a watched record without us filing the report): 0.** `npm run reports` counts arrivals through the per-row "looks wrong?" links; expected-zero, and it refuses to print a bare zero without reconciling its parts against the raw total.
- **Traffic: 1 unique viewer in the trailing 14 days**, 193 unique cloners (unattributed — CI checks the repo out on schedule, on every push and every PR, and the sampler deducts nothing). Return-rate proxy **INAPPLICABLE** at n=1, below its N_min of 3; the arithmetic is printed anyway so the figure that replaces it stays auditable.
- **Today's product ship is UNMEASURED and is reported as such.** Delivery is verified — the served page returns the new aliases. Whether a human typed one is unknown: the published page carries no analytics, and the traffic figure measures repo views on github.com, never page readership. "It is live" is not "it worked."

## Recommendation

**Ship the `check:deferrals` zero-population guard, and dispatch it to Codex rather than hand-writing it.** The check prints `0 declared deferral(s)` then `RESULT: PASS — every declared deferral carries an unexpired expiresOn` — vacuously true over an empty set, with no zero-population branch in its verdict block. This lane built that guard twice (`check-resolvability` refuses to render an empty denominator as full coverage; `report-rate` refuses a bare zero) and put it on the two checks that are **not** verify legs. The one inside the exit code is the one missing it. It is also the honest answer to four consecutive `probed-declined` zeros today: this is the Codex-shaped task, it is carried rather than declined, and hand-writing it tomorrow would repeat the pattern.

## On hold pending data

- **G-2** (contribute a verified bound improvement to the stewarded inventory) — signal 2026-09-22.
- **W-3** (independent acknowledgement of the erdosproblems.com/36 correction) — signal 2026-09-24; the signal is someone else acting, so there is nothing to decide cold.

**Named and NOT re-dated: G-4's denominator cannot fill.** Its threshold is 30 unique viewers and today's read is 1; that arithmetic does not reach 30 by its 2026-09-26 read. Its 09-26 read is itself safe because `onTrigger` already converts it to an instrument read — *could we detect an arrival?* — which is answerable at n=0. The **2026-11-06 outcome read** inherits the unfillable denominator. Re-pointing a Tier-0 goal is David's call under his 2026-08-26 ruling, so it rides as evidence A-34 owes him rather than being quietly re-dated here.

<!-- findings:begin -->
<!-- findings:end -->

## State Appendix

_Written last, from live commands, because a report cannot name the commit that lands it — every value below carries the command that produced it._

**positive control: every zero in this report comes from a probe demonstrated to return non-empty.** The overdue-signal zero — the same predicate over the same 21-row read returned **4 due-today and 17 future** rows, so the comparator discriminates. The undated-rows zero — the same field read returned a date for all 19 open rows. The `items-stale-actionable` zero rows — the sibling endpoints on the identical PIN'd call returned **3** and **5** rows. The Dependabot zero — `check-engineering-zero` over the same panel read returned **20 open alerts for bloom-edu and 2 for billionaire-army**, so the alert path reports non-zero when alerts exist. The `npm run catches` zero — the same script's completed weeks read **4, 4, 5, 3, 7**. The notation-gap zero after the fix — the probe's own controls still found **28** rows containing a radical and **13** containing a power, so it was still looking at the notation when it reported the gap closed.

- **HEAD**: `df460f0` — `git -C . log -1 --format=%h%x20%s` → `df460f0 The reader holding sqrt(2) or 10^-335 got the empty state on 28 of 115 rows`
- **Working tree / push state**: `git rev-list --count origin/main..HEAD` → `0` at 22:23Z, before this report's own commit
- **Gate**: `npm run verify` → exit **0** at `df460f0`; `tmp/.verify-receipt.json` reads `exitCode: 0`, `failedGates: []`, `at 2026-09-08T22:22:44.853Z`. **First fully-green gate since 2026-09-04.**
- **CI**: `node ../skylark-site/scripts/check-ci-status.mjs --repo . --workflow reverify.yml` → `GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending`
- **Publish**: `gh api repos/u00dxk2/bounds-ledger/pages/builds` → a build row for `df460f0`, status `built`, created 2026-09-08T22:22:55Z. **The publish is not CI-gated** (A-31, reads 09-09).
- **Drift**: `node scripts/reverify.mjs --check` → `No drift. 116 files match upstream 9d57db8` (an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo)
- **Claims**: `node scripts/check-claims.mjs` → `241 claim(s): 239 hold, 0 broken/unreachable, 2 unverified (manual)` — C-7 and C-9, UNVERIFIED by design
- **Page**: `node scripts/render-site.mjs --check` → `PASS — index.html matches committed state (115 constants @ 9d57db8)`
- **Ledger**: 58 rows — 39 closed, **19 open**, 15 of them carried >7d, **0 undated** — from a read of `continuity/items.json` at 22:5xZ
- **Traffic**: `npm run traffic` at 2026-09-08T22:10:37Z → 1 unique viewer / 193 unique cloners in the latest 14-day window
- **Catches**: `npm run catches` at 2026-09-08T23:12:29Z → `0` for the current partial week; last completed week `7`; `0 COMPLETED consecutive week(s) with none`
- **Dependabot**: `gh api repos/u00dxk2/bounds-ledger/dependabot/alerts?state=open --jq length` → **0**. No dependency bump landed today — this repo has no lockfile and `npm install` is a no-op — so the read-after-the-bump ordering is satisfied vacuously and is stated that way rather than claimed as a post-bump read.
- **Continuity endpoints**: all three HTTP **200** with the PIN header — `items-stale-actionable` 0 rows, `upcoming-triggers` 3, `auto-decidable-items` 5
- **Deploy read**: `node ../skylark-site/scripts/check-deployed-sha-drift.mjs --service bounds-ledger` → exit 1, `no Render service matches "bounds-ledger" (52 services read)`. **NOTHING SWEPT** — this is a GitHub Pages lane with zero Render services; neither a stop nor a pass. The Pages builds row above is this class's equivalent read.
