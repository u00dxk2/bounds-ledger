---
product: bounds-ledger
date: 2026-09-05
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 5147d39
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 3
top_action_today: "Two mathematical records moved in the night and this ledger caught both of them by breakfast. The bound on gaps between primes came down from 240 to 186, and a constant from geometry moved as well, and each one was checked against the original work before we changed a thing here. We also caught something quieter and stranger: a well known table rewrote a number so that it now claims slightly more than the paper it cites actually proves. A check we wrote seven weeks ago is what noticed. Nobody outside Skylark knows any of this happened, which is the exact question you asked us on the 26th, and the answer to it comes to you Tuesday."
---
# Daily — bounds-ledger — 2026-09-05

## BLUF

Two mathematical records moved overnight, the alarm caught both, and the ledger now shows them.

**FIRST ACTION.** Read the overnight alarm before anything else; it fired today and it will fire again.

```bash
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** `npm run catches` reports **7** movements for the current week. A cold reader will read that as seven records moving. **Two did.** The other five are a row reorder in `47a`, a row reorder in `53a`, an asterisk added to `41a`, a row lifted out of `50a`'s table into prose, and an escaping fix in `8a` — not one number among them. The counter says so itself in its own first line, where it calls itself a ceiling; the misread happens when the figure is quoted without that line.

**DON'T-TOUCH.** The scheduled `reverify` alarm and its issue-filing step. It went red at 09:23Z, filed issue #33 naming all fifteen changed files, and titled a real record movement `Drift:` rather than `Check error:`. What makes it work is that it is allowed to go red for a reason nobody pre-excused, and that its title tells a moved record apart from a transport failure.

**Findings classification, one sentence of human judgment:** today's findings are **record-facing**, decisively and for the first time in nine days — two upstream bound movements (`C_88a` bounded prime gap, 240 to 186; `C_43` Steiner ratio lower bound, 0.8559 to 0.860 asterisked) — baseline: `node scripts/reverify.mjs --check`, read 2026-09-05, whose diff showed each old row REPLACED rather than a new row appended beside it, which is the distinction that made 2026-09-01's near-miss a near-miss, plus a curated table quietly moving a cited bound to its truncation, below the value the paper proves — **and the two instrument-facing findings beside them are small**: a primer banner that pre-excused a failing gate, and a documentation line that describes the CI brief job wrongly.

**Of the 7 counted catches this week, 2 are numeric and 5 are BYTE-ONLY.** Named above, because `npm run catches` cannot make that distinction and must not be quoted bare.

**Consecutive instrument-facing days: 0.** Yesterday's count was 8. Written by hand, not by a counter, which is the point of it.

**The standing prediction is FALSIFIED, and correcting it is the rule, not a courtesy.** The registered claim was that the next record-facing catch would be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. It arrived through the 09:23Z scheduled alarm; no human recomputed anything; and it was two bound movements plus a mass of citation fixes. The prediction was right about one thing and it is worth recording: yesterday it gained its first concrete address in `88a`, and `88a` is exactly where the record moved. **Right constant, wrong mechanism.** The replacement claim, registered now: the next record-facing catch will again come from the scheduled alarm rather than from a human, and the thing our instruments will miss is not a bound but a CONVENTION — a curated table restating a value in a form that changes what it asserts, the way `1b` did today, caught only because a hand claim happened to be pinned to the digit.

## What changed

**The drift cycle, in four commits.** `d834f10` resolved the mirror to upstream `9d57db8` (an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo — positive control: `git cat-file -t` returns `commit` for a local sha like `d834f10` and reports `9d57db8` as not a valid object name) and regenerated the pins. `b44e3c2` is the second render, the only one that can date rows that just moved, because `lastChanged()` shells `git log -S` over committed history. `7090832` re-pinned hand claim `C-2`. `5147d39` added the README catch-table row.

**Both record movements were verified against artifacts, not against the preprints' summaries of themselves.** For `C_88a` I read the Lean development rather than the paper: `openai/PrimeGaps186` is public and Apache-2.0, and its `formalization.yaml` records `sorry_count: 0` for both named theorems, three non-standard axioms beside Lean's own three, and a review block reading `self-assessed` with "No independent human semantic review". Upstream's characterisation of all of that is accurate, including the count of three, which correctly excludes Lean's own foundational axioms. For `C_43` the Zenodo record at `10.5281/zenodo.22223485` carries in its own description every number upstream quotes, including the 0.860 target itself: 330,193,755 certificate records re-verified at the old 0.8559, and 1,104,177,103 regions verified at 0.860, the exact rational 43/50.

**One hand claim broke and it is the most interesting thing in the cycle.** `C-2` pinned `0.380927` for Haugland's 2016 minimum-overlap bound. Upstream now lists `0.380926`. The paper proves `0.3809268534330870`, re-fetched today with "minimum overlap" and "Haugland" in the same response as the control, so the new figure is the truncation and sits strictly below the proved value. A finding from 23 July had already settled this exact distinction and concluded the repo was right; upstream has moved to the other side of it. `C-2` is re-pinned to bind value to reference, the finding carries a dated reversal, and `A-43` — the new row asking whether this is one wrong cell or the whole column's convention — was minted rather than sent anywhere.

**`A-33` — the row asking whether a change to a file we filed a report against is a candidate causal event — was re-dated to 09-12, not closed.** Today produced the first real event its declined leg would catch and its shipped leg cannot: `constants/87a.md` moved, and leg 1 was silent because it fires on issue-state transitions and issue 150 has been closed since 08-23. That exposes a limitation neither of the row's design notes named: **leg 1's window closes permanently once an issue closes**, so it is blind to every future change to that file. Closing today would have recorded "the declined leg has no subject" on the day it acquired one.

**`A-34` — the ranked proposal David asked for — slipped a third time and is dated 09-08.** Said plainly, as its own trigger requires: the citation-footprint research is not done and no thinner version was sent. The alarm fired first, and a drift cycle with records in it outranks a research task on the day it lands.

## Inputs (controllable)

- Drift cycle run end to end: verify, primary sources, snapshot, pins, state block, two renders, commit, close. Issue #33 closed by hand naming the four resolving shas.
- `npm run check` is back to its steady state: exit 3 with `check-brief` as the only failing leg, which is `A-41` — the row recording that the brief leg became permanently unverifiable when `/t/*` went Google-session-only.
- Three dated gates dispositioned: `A-33` re-dated with an event behind it, `A-34` dated with a reason, `A-43` minted.
- **`W-7` — the standing rule that one instrument is read against its own claim every session — today's subject was the CI `brief` job.** It reported SUCCESS this morning while the same script exits 3 locally. Reading its code answers why: on exit 3 it prints a sentence and exits 0, so a green `brief` job means "the brief is in sync OR the check could not run at all". The collapse is deliberate, argued at length in the file, and right — an issue for a check CI can never run would be a permanently-open alarm. But it corrects our own documentation, which says `check-brief.mjs` "stays out of CI permanently". It runs in CI every day; what stays out is its exit code's power to fail the run.

## Outputs (lagging)

- **Record-listing movements this week: 7 counted, 2 numeric.** See the BLUF; the counter is a ceiling by its own admission.
- **Outside report arrivals (`G-4`'s primary indicator): 0, measured.** 29 raw issues fetched, all 29 ours by author, parts reconcile to the raw total — so this is a measured zero and not a dead probe.
- **Traffic: 1 unique viewer in the latest 14-day window; 6 viewer-days since the public flip.** The return-rate proxy is INAPPLICABLE at n=1, below its N_min of 3, and prints its arithmetic so the figure stays auditable. Clone counts are mostly our own CI and are not deducted.
- **`G-4`'s denominator is the standing problem and it is routed.** The threshold is 30 unique viewers by 2026-09-26; the trajectory reaches roughly 8 to 10. The row already says its read date is uninterpretable in advance. Re-pointing it is David's call and is not being made here.

## Recommendation

**Give `A-34` the session on 09-08, and open the proposal with today.** The research it needs is a day's work and it has now slipped three times, which is an argument for doing it sooner rather than for restating that it matters. What changed today is that the proposal acquired an exhibit it could not have researched into existence: two records moved overnight, this ledger had both verified within six hours, a curated table moved a bound to a form that asserts something the paper does not, and a seven-week-old hand claim caught it. Nobody outside Skylark knows any of that. That sentence is `A-34`'s question stated as an observation, and it is datable and cheap for David to check.

**Look up the proved value behind each neighbouring row on `A-43` — the new row asking whether upstream's truncated bound is one wrong cell or the column's convention — before drafting anything outward.** They are:

1. 0.380924, cited to [GGSWT2025] (AlphaEvolve)
2. 0.380876, cited to [YKLBMWKCZGS2026] (TTT-Discover)
3. 0.380871, cited to [T2026] (TogetherAI)
4. 0.380868, cited to [YLTLYSTYLLGDHZSWZSHMELCZX2026] (SimpleTES)

If every one of them is a truncation of a longer value, the H2016 row is now consistent with its neighbours and the caveat belongs to the whole column; if they are not, one cell is out of step with four and the report is small and specific. Drafting before those values exist is how a lane reads one row and generalises in public.

**Fix the banner clause tonight, in one sentence.** A primer clause that pre-excuses a red must name the exit code and the failing leg, and give the clearing condition in both directions. Today's banner said `npm run verify` will exit 3 and is not yours to fix; it exited 1, on a real drift. The only thing between a tired reader and dismissing a live alarm was a digit the banner never mentioned.

## On hold pending data

- **`A-20`** — the row asking whether the fetch layer should retry on 429/502 — reads on 09-08 against an N_min of 3 transient failures since 08-18. Nothing today changes that, and its branch-0 clause already covers a thin read.
- **`W-3`** — the watch on acknowledgement of the erdosproblems.com/36 correction — remains UNVERIFIED in CI by design, with today's local advisory read showing the page unchanged since 23 January 2026.
- **`A-43`** — the row asking whether upstream's truncated minimum-overlap bound is one wrong cell or the column's convention — has its outward question on hold behind four primary-source lookups, listed in the Recommendation section above by value and citation key, then the adversarial review, then David's gate. Deliberately not surfaced as a board card today: the fork it asks him to rule on is undecidable until those lookups exist.

## State Appendix

Every value here was read live at the time stamped beside it, after the day's last code commit. A report cannot name the commit that lands it, so each line carries its release command instead of a promise.

- **HEAD at appendix time:** `5147d39` — release: `git -C . log -1 --format=%h%x20%s`
- **Pushed:** yes, verified server-side at 16:37Z — release: `git rev-list --count origin/main..HEAD` (0)
- **Mirror:** 116 files at upstream `9d57db8`, no drift, as of 16:32Z — release: `node scripts/reverify.mjs --check`
- **Claims:** 241 total, 239 hold, 0 broken, 2 unverified (both `manual: true` on the erdosproblems.com block), as of 16:32Z — release: `node scripts/check-claims.mjs`
- **`npm run verify`:** exit 3, `check-brief` the only failing leg, which is `A-41` and is expected. **Clearing condition, both directions:** exit 0 means the auth model changed and `A-41` has moved; any other non-zero code, or exit 3 with a different failing leg, is a real failure and is not pre-excused — release: `npm run verify > tmp/verify-out.txt 2>&1` then read `tmp/.verify-receipt.json`
- **CI at the pushed tip:** UNKNOWN at appendix time — the push landed minutes ago and the run had not settled. The morning run on the previous tip was RED and that was correct. **Read the job layer, never the run-level conclusion** — release: `node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml`, then `gh api repos/u00dxk2/bounds-ledger/actions/jobs/<id>`
- **Open issues:** 0 after closing #33 — release: `gh issue list --repo u00dxk2/bounds-ledger --state open --json number,title`
- **Ledger:** 56 rows after minting `A-43` — release: `node ../skylark-site/scripts/show-item.mjs --index --status open`
- **Deployed page:** GitHub Pages builds on push and is not CI-gated, so the page at `https://u00dxk2.github.io/bounds-ledger/` serves the pushed tip. Row count is one per constant and must be read, never recalled — release: `grep -c '<tr id=' index.html`
- **Deployed-sha drift:** NOTHING SWEPT — this is a Pages lane with no Render service, which is neither a stop nor a pass.

<!-- findings:begin -->
## Findings appended after the report was posted

**A FOURTH instance of the day's named pattern, and the most instructive one, because the claim was TRUE.** Commit `cb4be7c` closed `A-44` and its body states: *"grep -rn "A-44" over scripts/ docs/ and the root markdown files returns no hits."* That command **errored** — `grep` is not a PowerShell cmdlet, and the shell printed `The term 'grep' is not recognized`. The sweep never ran. I then ran it properly and the answer is the one I had claimed: the id appears in `continuity/items.json` and nowhere else.

**A true claim with fabricated provenance is still the defect.** This is the sharpest version of the pattern the 2026-09-05 EOD retro named, because the other three instances produced wrong strings and this one produced the right one. Nothing about the answer being correct makes the citation evidence: the next time the sweep would have found a hit, the same sentence would have shipped saying it found none, and no reader could tell the two apart. The three earlier instances were caught by running the command; this one was caught only because the shell error was visible in the same output pane.

**What it changes:** the retro's count of three is wrong and has been corrected on the bus against `b5783055`. The rule stands and is strengthened — *a sentence quoting a command's output is written by pasting from a terminal, never composed* — with the addition that **an errored command is not a run**, and a claim whose command failed must be re-run before the sentence stands, even when the expected answer is obviously right.
<!-- findings:end -->
