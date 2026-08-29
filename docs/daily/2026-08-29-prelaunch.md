---
product: bounds-ledger
date: 2026-08-29
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 8f4a7ff
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "Nothing needs you today. Our public page of tracked mathematical constants is titled: is the number you cited still current? Until today it gave readers nothing to actually cite, which is odd for a page named after citing. Every row now offers a ready made reference with both bounds, where they came from, when each last changed, and a link back to that exact row. We also looked at the page at phone size for the first time. The layout holds up, but the report-a-problem link, which is the one way a stranger can tell us a number looks wrong, sits past the right edge of the screen with nothing hinting it is there. That is tomorrow's first job."
---

# Daily report — bounds-ledger — 2026-08-29

## BLUF

Our public page now gives readers a ready made citation for every row.

Checking it at phone size for the first time found the report link sitting off the right edge of the screen, which is the one control a stranger needs to tell us a number looks wrong.

**FIRST ACTION** — the declared block, unchanged at five lines. Run it from the repo root, one command per line.

```
node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**THE NUMBER THAT WILL LIE TO YOU** — **3 unique viewers** in the trailing 14 days, printed beside
**194 unique cloners**. The misread is to treat the clone figure as audience: `reverify.yml` checks
this repo out on a daily schedule, on every push and on every PR, so the clones accrue whether or not
a human ever arrives, and the sampler deliberately does not deduct them. The viewer count is the only
arrival figure here that is not mostly ours. Second-order misread, and the one that matters more
today: **3 viewers is also the denominator behind every "shipped on judgment" line below.** No product
change this lane can make is readable at that N, which is why today's two ships carry named
observables instead of instrument reads.

**DON'T-TOUCH** — the record-claim assertion in `render-site.mjs`
(`doesNotMatch(/is the record|current record|best known bound is/i)`). It works because it is blunt: it
cannot parse negation, so it rejected today's first draft of a *disclaimer* that contained the phrase
"current record". That looked like a false positive and was the guard doing its job — a public page
one edit away from asserting a record is exactly what it exists to prevent. The caveat got reworded;
the guard did not get loosened. Do not "improve" it into something context-aware.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing**
— a citation affordance the page never had, a phone-layout defect on the goal path, a measurement
window that was scoped wrong, a listener log that costs 25k tokens to read, and a probe whose field
vocabulary was narrower than the ledger's — **none of them about a mathematical record**.
**Consecutive instrument-facing days: 2.** No pin moved today, so the week's catch figure (**3**, on
the partial week beginning 2026-08-24) is unchanged by today and is an activity **ceiling**, not a
count; those three were byte-only escaping edits, not numeric movements. The **standing prediction is
unchanged and still unfired**: the next record-facing catch is claimed to be a witness-value mismatch
on a constant upstream added within ~30 days, flagged by a human recomputing a cited certificate and
by no instrument we run.

## What changed

**The page is named after citing a number and gave the reader nothing to cite** (`b1a73bd`). `index.html`
is titled *"Is the number you cited still current?"*, `docs/key-user-flows.md` states the core problem
as *"I cited a number"*, and the visitor is defined there as someone who **quotes a record**. Five
rotations of the F-2 spot-check flow all improved *reading* a row — finding, dating, ordering,
labelling, disputing it. None served the quote. Every row now carries a `cite` disclosure yielding
both bounds, the upstream mirror sha, each side's change label, and the row's own permalink.

The design decision worth keeping: **the caveat lives inside the citation**, because a citation is the
only artifact on the page that *leaves* the page. Every honesty the page supplies in context — these
are last-listed table rows, this is a snapshot at a pinned sha — is stripped the moment the text is
pasted elsewhere. A ledger whose product is catching other people's stale citations must not become a
source of them. Native `<details>` plus `user-select:all`, no JavaScript; a clipboard button was
declined as gold-plating at this traffic. No "retrieved on" date, deliberately: the page is
regenerated on commit and cannot know when it was last read.

**The phone read finally happened, and it was never blocked on David** (`8f4a7ff`). `A-36` — the watch
that the public page had never been checked at phone width — sat two days recording a David action
(connect the Chrome extension). The orchestrator pointed out `playwright-cli` is installed
machine-wide and needs no extension. The item is closed on a live 390×844 DOM read of the published
page. **What held:** the body does not scroll horizontally (390 against a 390 viewport), so the
`.scroll` wrapper plus table `min-width` pattern does exactly what it was written to do; the filter
(350px) and the Order select (232px) both fit; all 111 citation disclosures are live, which
independently confirms `b1a73bd` reached the published page. **What did not:** the scroll wrapper shows
348px of 1032px, and the `looks wrong?` link's left edge is at **x=755** — 365px past the right edge —
with the first column ending at x=274. A phone reader sees a constant name and part of a bounds cell
and nothing cues that three controls exist to the right.

**`G-4`'s zero was never a 31-day zero** (`f859acd`). `G-4` — the Tier-0 goal that an outside party acts
on a watched record without us filing the report — reads its arrivals through `npm run reports`, which
classifies an arrival only by a prefilled title or body marker. Until `888a1e5` (2026-08-28, day 20 of
the public window) the page's highest-attention call to action pointed at the bare issues list, so an
issue filed from the loudest link scored `arrivalKind() === null` **by construction**. The item now
records detection-valid-from 2026-08-28, so the 2026-09-26 read asks for the clean-detection day count
(29) rather than days-since-flip (49). The measure is untouched; only the window moved.

Also landed: the two-call recipe for reading `tmp/.bus-listen.err` and `continuity-check.mjs` as the
declared P2 gate battery, both in `docs/daily-config.md` (`f859acd`); Rotation 7 written into the flow
doc along with a Rotation 6 heading that had never been recorded there (`1830c45`).

## Inputs (controllable)

- **Five commits**, all pushed, all linked to items or exempt as rail bookkeeping. `continuity-check`
  ends at **status OK**, 51 items, 35 commits checked, zero CRITICAL and zero WARN.
- **Gates:** `npm test` exit 0; `npm run check` exit 0 (233 claims — 231 hold, 0 broken, 0 unreachable,
  2 manual-unverified); `check-doc-references` **0 dead across 70 unique paths in 5 docs**;
  `check-due-gates-dispositioned` **0 due on or before today** across 51 items.
- **Four P4 sweeps, all with real denominators:** no approved-but-unshipped >7d, no shipped-but-gated
  >3d; no tool-outage gates >3d dark; 36 of 36 docs scanned with no un-itemized commitments ≥7d; and
  `check-instrument-liveness` **exit 2, cannot run** — no Sentry on this lane by design, which is a
  not-ready and not a zero.
- **`W-7` — read one instrument against its own claim, today's rotation: my own overdue-waits query.**
  It claimed to list open items carrying no signal date, and it named three: `A-2` (the standing
  drift-resolution log), `A-9` (the engineering-health fix-on-touch backlog) and `W-4` (the watch that every new
  detector must be shown both to fire and to stay silent before it ships).
  Its output **could never have said otherwise** for those three — it read `expectedSignalBy` and
  `signalDate` only, and all three carry `nextCheckDate`, so the query was structurally incapable of
  reporting them as dated. Acting on it would have "fixed" three items that needed nothing. Not a
  repeat of any previous rotation's instrument.
- **Codex:** GREEN (probe 2026-08-29T17:22:12.816Z). `codexCalls: 0` every phase, all
  `probed-declined` — warm context and sub-30-minute judgment-dense scopes throughout, no bulk-edit
  shape all day.

## Outputs (lagging)

- **`G-4` = 0**, and it is a MEASURED zero: `npm run reports` fetched 26 issues, attributed all 26 to
  us, and the parts reconcile (26 + 0 + 0 = 26). Day 21 since the public flip; **29 days of clean
  detection** is the honest denominator, not 21.
- **Arrivals (`W-6` — the watch on first unsolicited outside contact):** `npm run traffic` at
  2026-08-29T19:11Z recorded 33 days in `continuity/traffic.json` and read the trailing 14-day window
  as **3 unique viewers against 194 unique cloners** — the pair quoted in the BLUF. Since the flip:
  6 unique viewer-days, 354 cloner-days, and the sampler itself labels the viewer figure an upper
  bound because there is no cross-day dedup beyond 14 days. No unsolicited contact, no review, no
  referral, no share.
- **Catches:** 3 on the partial week beginning 2026-08-24, none today. Ceiling, not a count.

## Recommendation

Nothing for David. The one item that looked like it needed him did not, and that was the day's most
useful correction: `A-36` — the phone-width watch — carried a David action for two days that was one
command away the whole time. It is closed on the read.

## On hold pending data

- **`W-3`** — the watch for acknowledgement of the erdosproblems.com/36 correction. The reply leg is
  unverifiable from our side; we cannot read a maintainer's inbox. Its page leg IS ours and ran today:
  HTTP 200, page unchanged, and the claim stays UNVERIFIED regardless, which is the point of the
  `manual: true` mechanism. Escalation date 2026-09-24.
- **`A-29`** — GitHub accepts the secret-scanning validity-checks PATCH with HTTP 200 and silently
  ignores the field. The paid-entitlement explanation is a HYPOTHESIS with no positive control,
  because no second repo is known to have the feature on. 2026-09-08.
- **`A-37`** — the Uncaged Minds hand-off. Its own trigger forbids drafting, carding David, or
  reopening the question he answered; it is a watch on the orchestrator side. 2026-09-02.

## State Appendix

- **HEAD** `8f4a7ff` on `main`, in sync with origin (`git rev-list --count origin/main...HEAD` = 0).
  **CI GREEN** at `1830c45` — 1 completed non-scheduled success, 0 failures, 0 pending, read at the
  run-level; read the job layer before trusting a run-level verdict during a platform outage.
- **Verify receipt** at `1830c45`, exit 0. Standing-rules hash `d0e495aa`, verified against
  `rules-hash.mjs`.
- **Ledger:** 51 items, 20 open. Closed today: `A-36` (the watch that the public page had never been
  checked at phone width). Filed today: `A-38` (the watch that on a phone the report link sits 365px
  off-screen behind an uncued horizontal scroll).
- **Next dated gates:** `A-38` (phone reachability of the report link) 2026-08-30 · `A-2` (the standing
  drift-resolution log) and `A-32` (the lane brief's voice check) 2026-08-31 · `A-18` (a generated state
  block in the primer) and `A-20` (whether the fetch layer should retry with backoff) 2026-09-01.
- **Mirror:** 113 files at upstream `3a14910` (an upstream `teorth/optimizationproblems` sha; it does
  not resolve in this repo). No drift today.
- **Engineering zero-state:** 0 Sentry issues and 0 Dependabot alerts — this lane has neither
  instrument by design, so both render not-applicable rather than zero.
