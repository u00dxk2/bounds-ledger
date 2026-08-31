---
product: bounds-ledger
date: 2026-08-30
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: dd23ddd
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "Nothing needs you today. Our public page of tracked mathematical constants had a problem on phones: the small report-a-problem link on each row sat off the right edge of the screen, with nothing showing there was anything to scroll to. That link is the only way a stranger can tell us a number looks wrong, which is the single outcome this project is trying to earn, so on a phone that path was effectively closed. Each row now stacks into a card on a narrow screen, with its two bounds labelled and all three links in the reading column. We checked the published page on a phone-sized screen and on a desktop one to be sure the desktop version did not get worse."
---

# Daily report — bounds-ledger — 2026-08-30

## BLUF

On a phone, the one control a stranger uses to tell us a number looks wrong was off the edge of the screen. It is now in the reading column, and the desktop layout is unchanged.

**FIRST ACTION** — the declared block, unchanged at five lines. Run it from the repo root, one command per line.

```
node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

Line 4 takes about three minutes (measured today, 15:04→15:07Z) because it makes roughly 450 network
requests — one per mirror file, 113 of them, plus one per claim URL, 233 of them. Give it a ten-minute
tool timeout rather than a default one. Line 2 is written without `--short` on
purpose: `git rev-parse --short HEAD origin/main` exits 128, which this session re-encountered live at
16:07Z while assembling the State Appendix below — the 2026-08-18 finding is still true.

**THE NUMBER THAT WILL LIE TO YOU** — **3 clean-detection days** for `G-4`. The misread is to take it
as three days in which an arrival could have been detected. It is three days in which a *desktop*
arrival could have been detected. Until this morning a phone visitor could not reach the reporting
control at all, and no instrument can tell us what share of our readers those were: GitHub's traffic
API carries no device breakdown and the page has no analytics, so the phone share renders
**not-ready** — never 0, and never "all of them". The second misread is the older one and still live:
**179 unique cloners against 3 unique viewers** is not an audience, because `reverify.yml` checks this
repo out daily and on every push.

**DON'T-TOUCH** — the `manual: true` → UNVERIFIED mechanism on `C-7` and `C-9`, the two claims on
erdosproblems.com/36. Today's runs are the argument for it: both advisory fetches returned HTTP 200
with their expected strings present, and both still printed UNVERIFIED. It works because it refuses to
convert a local success into a green — the site blocks automated fetch from datacenter addresses only,
so a residential HTTP 200 is evidence about this laptop and never about CI. Making it "smarter" would
let the ledger report zero unverified claims while the claim gating `W-3` — the watch for
acknowledgement of the erdosproblems.com/36 correction — was silently unverifiable on the runner, which is
exactly what happened on 2026-07-25.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing**
— a phone-unreachable control on the Tier-0 detection path, a report appendix that is stale by
construction, a `[linter-report]` marker whose scoping I had wrong, and a documented `git` trap that
fired again — **none of them about a mathematical record**. **Consecutive instrument-facing days: 3.**
No pin moved today, so the week's catch figure (**3**, on the partial week beginning 2026-08-24) is
unchanged by today and is an activity **ceiling**, not a count; yesterday's report characterised those
three as byte-only escaping edits rather than numeric movements, and I am carrying that as its claim
rather than re-deriving it. The **standing prediction is unchanged and still unfired**: the next
record-facing catch is claimed to be a witness-value mismatch on a constant upstream added within 30
days, flagged by a human recomputing a cited certificate and by no instrument we run.

## What changed

**The Tier-0 detection path was 365px off-screen on a phone, and now is not** (`ee19ee9`, closed in
`dd23ddd`). The `looks wrong?` link is the control `G-4` is measured through — `npm run reports`
counts exactly the arrivals that come through those per-row links. At 390×844 it sat at x=755, past
the right edge, behind a horizontal scroll nothing cued. A phone visitor who spotted a wrong row could
not reach the control that makes the goal fire, and at roughly three unique viewers a fortnight that
loss would never appear as a number.

Below 56rem — the table's own `min-width`, so the breakpoint sits exactly where horizontal scroll
would otherwise begin rather than at a number someone picked — each row now stacks into a card:
`thead` hidden, cells stacked, and each bound cell labelled from a new `data-label` attribute through
a CSS `::before`. The label is load-bearing, not decoration: stacking removes the column header, which
is the only thing distinguishing the upper bound from the lower one. Named principle: Nielsen #6,
recognition rather than recall — the same heuristic the per-row report link was built on.

**The finding worth carrying: a selftest picked the fix.** `A-38` listed three candidates and the
choice was not made on taste. Candidate (a), moving the controls into the first cell for phones, means
rendering them twice and hiding one copy by media query — and `render-site.mjs`'s own selftest asserts
one report link per row (`flagLinks.length === rows.length`), so it fails. **The right answer to a
verifier rejecting a candidate is a different candidate, never a weakened assertion.** This lane's
standing rule about never weakening the verifier to make a candidate pass has until now only ever been
applied to mathematical claims; this is its first application to a design choice. Candidate (b), a
sticky right-hand column, is one CSS rule but would permanently occlude about 200px of a 390px
viewport and behaves badly with the cite disclosure open. Candidate (c) shipped.

Evidence, read from the **live published page** after the Pages build for `ee19ee9` reported
`status: built` at 15:46:09Z — not from local bytes, because the item's close condition asks for the
published numbers and identical-input is not the same claim as measured-output. At 390×844:
`flagLinkVisibleNow` false → **true**, `flagLinkLeft` 755 → **87**, `sourceLinkLeft` 702 → 34,
`hiddenToRight` 684 → **0**, `wrapperScrollW` 1032 → 350. There is now no horizontal scroll inside the
table at all. At 1440×900 on the same live page, desktop is unregressed: `thead` visible with 4
headers, cell display `table-cell`, row cells sharing one baseline, `hiddenToRight` 0, and
`getComputedStyle(cell, "::before").content` resolving to `"none"` — so the mobile labels provably do
not leak. Negative control before restoring: moving the breakpoint to 20rem so a 390px viewport got
the old layout made the same probe report `flagLinkVisibleNow false`, `flagLinkLeft 772`,
`hiddenToRight 548`, with `git diff --numstat` proving the mutation landed before the verdict was
believed.

**A report cannot name the commit that lands it** (`af9b17e`). Yesterday's State Appendix asserted
HEAD `8f4a7ff`, CI green at `1830c45` and "51 items, 20 open"; all three were stale within hours.
Reading the history to write the correction turned a discipline lapse into a structural finding:
`8bcacd0` is the commit that *created* that report file, and it lands one commit after the `8f4a7ff`
the file's own appendix names as HEAD. So a bare `HEAD = <sha>` in a report is stale at the moment of
writing however careful the author is. A value is allowed to age — provided it says when it was read
and how to re-read it. The correction landed in a fenced block at the foot of the 08-29 report with a
pointer line at its top; nothing outside the fence was rewritten. **This report's State Appendix is
the first one written under that rule.**

Also landed in that pass: the `PARTLY SUPERSEDED` marker moved to the top of the block being *retired*
rather than only the top of the block doing the retiring; `docs/daily-config.md` line 4 annotated with
its measured runtime; and `G-4` `note7`, recording the viewport axis beside the existing time axis.

## Inputs (controllable)

- **Three commits**, all pushed, all linked to items or recorded as rail bookkeeping.
  `continuity-check` ends at **status OK**, 51 items, 17 commits checked, zero CRITICAL and zero WARN,
  with the `UNTRACKED_COMMITS` finding from this morning cleared (`c278854` linked onto `A-37`;
  `0258da4` and `a8a6344` recorded in `meta.untrackedCommits`).
- **Gates:** `npm run verify` TRUE exit 0 at `dd23ddd`, its roughly 450 requests being the 113 mirror
  files plus the 233 claim URLs; `npm test` exit 0; 233 claims — 231 hold, 0
  broken, 0 unreachable, 2 manual-unverified; `check-doc-references` **0 dead across 72 unique paths
  in 6 docs**; `check-due-gates-dispositioned` **0 due on or before today** across 51 items;
  `render-site --selftest` and `--check` both PASS.
- **Four P4 sweeps, all with real denominators:** no approved-but-unshipped >7d and no
  shipped-but-gated >3d; no tool-outage gates >3d dark; **37 of 37** docs scanned with no un-itemized
  commitments ≥7d; and `check-instrument-liveness` **exit 2, cannot run** — no Sentry on this lane by
  design, which is a not-ready and not a zero.
- **Overdue-signal scan: 0 overdue, on both axes.** The declared `meta.signalDateField` is
  `expectedSignalBy`; scanning the open rows on it gave 0 overdue and 3 date-less. Those three
  (`A-2` — the standing drift-resolution log; `A-9` — the engineering-health fix-on-touch backlog;
  `W-4` — the watch that every new detector be shown both to fire and to stay silent) all carry a future
  `nextCheckDate` — 2026-08-31, 2026-09-03 and 2026-09-22. A row is not date-less merely because this
  lane keys it elsewhere, and checking only the declared field would have reported them as such.
- **`W-7` — read one instrument against its own claim, today's rotation: the `[linter-report]`
  marker.** My P1 post carried two markers that suppressed nothing, and I assumed they had worked.
  They had not: the marker is scoped to the **physical line** the warning quotes, not to the logical
  sentence, and I had placed them at the end of wrapped sentences whose *first* line was the one
  quoted. Demonstrated both ways for free inside `--validate`: three warnings fired, I marked exactly
  one physical line, and on the re-run that one cleared while the other two still fired. Not a repeat
  of any previous rotation's instrument.
- **Codex:** GREEN (probe 2026-08-30T05:41:23.987Z, machine-level, quoted from the kickoff rather than
  re-run). `codexCalls: 0` every phase, all `probed-declined` — warm context and judgment-dense scopes
  throughout, no bulk-edit shape all day.

## Outputs (lagging)

- **`G-4` = 0**, and it is a MEASURED zero: `npm run reports` at 16:04Z fetched 26 issues, attributed
  all 26 to us, and the parts reconcile (26 + 0 + 0 = 26). Day 22 since the public flip; **3
  clean-detection days**, and from today that figure carries a second qualifier — desktop only, for
  the reason in the BLUF.
- **Arrivals (`W-6` — the watch on first unsolicited outside contact):** `npm run traffic` at 16:04Z
  recorded 35 days in `continuity/traffic.json` and read the trailing 14-day window as **3 unique
  viewers against 179 unique cloners**. Since the flip: 6 unique viewer-days, 375 cloner-days, and the
  sampler labels the viewer figure an upper bound because there is no cross-day dedup beyond 14 days.
  No unsolicited contact, no review, no referral, no share.
- **Catches:** 3 on the partial week beginning 2026-08-24, none today. Ceiling, not a count.
  Candidate-correction queue depth 0.
- **Which side of the traffic floor today's ship sits on:** the declared floor for demanding a real
  instrument read behind a product change is 30 new arrivals in the trailing 7 days on the surface
  touched. This page runs at 3 unique viewers a fortnight, so it is far below that, and the hook for
  the phone fix is therefore the named observable rather than a measurement: an issue arriving with
  the prefilled `Row looks wrong:` title from someone we did not contact, which `npm run reports`
  would move out of the excluded column. That becomes readable at n=1, and n=1 is `G-4` firing.
  Nothing observable yet; shipped on judgment.

## Recommendation

Nothing for David. The day's one user-visible change was ours to make and is shipped; the board is
clear and the awaiting set is empty.

## On hold pending data

- **`W-3`** — the watch for acknowledgement of the erdosproblems.com/36 correction. The reply leg is
  unverifiable from our side; we cannot read a maintainer's inbox. Its page leg IS ours and ran twice
  today inside `npm run verify`: HTTP 200 both times, page unchanged, and the claims stay UNVERIFIED
  regardless, which is the point of the `manual: true` mechanism. Escalation date 2026-09-24.
- **`A-29`** — GitHub accepts the secret-scanning validity-checks PATCH with HTTP 200 and silently
  ignores the field. The paid-entitlement explanation is a HYPOTHESIS with no positive control,
  because no second repo is known to have the feature on. 2026-09-08.
- **`A-20`** — whether the fetch layer should retry with backoff; either a reviewed implementation
  ships with a test demonstrating both answers, or the idea is declined with a recorded reason.
  2026-09-01.

## State Appendix

Every value below was read by a command at the stated time, and carries the command that re-reads it.
This is the first appendix written that way, and the reason is in *What changed*: a report cannot name
the commit that lands it, so a bare present-tense value here is stale by construction.

- **HEAD** `dd23ddd`, in sync with origin (`git rev-list --count origin/main...HEAD` = 0) — as of
  **16:07:32Z** — release: `git rev-parse HEAD origin/main` (no `--short`; that form exits 128).
- **CI** `reverify.yml` **GREEN at `dd23ddd`** — 1 completed non-scheduled success, 0 failures, 0
  pending — as of **16:03Z**, run-level verdict — release:
  `node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml`. Read the job layer before
  trusting a run-level verdict during a platform outage.
- **Verify receipt** exit 0 at `dd23ddd`, stamped **16:06:52Z**, written on a tree dirty only in
  `continuity/traffic.json` (doc-shaped, so committing it leaves the receipt a valid ancestor) —
  release: `npm run verify > tmp/verify-out.txt 2>&1`.
- **Ledger** 51 items — **18 open, 33 closed** — as of **16:07:32Z** — release:
  `node ../skylark-site/scripts/gen-primer-first-action.mjs --repo . --target-date 2026-08-30 --json`.
  Closed today: `A-38` (the watch that on a phone the report link sat 365px off-screen). Filed today:
  none.
- **Next dated gates:** `A-2` (the standing drift-resolution log) and `A-32` (the lane brief's voice
  check) 2026-08-31 · `A-18` (a generated state block in the primer) and `A-20` (fetch-layer retry
  with backoff) 2026-09-01 · `A-33` (a two-leg classifier for report-state and causal-event changes)
  and `A-34` (a ranked second-surface proposal for David to rule on) 2026-09-02 — as of **16:05Z** — <!-- prose-ruling-ok: a listing of upcoming gate DATES, not a rule-request; A-34's own onTrigger dates the board card to 2026-09-02 and carding it early ships the thinner version the item forbids. Dispositioned 2026-08-31, recorded on A-34.dispositionProseRulings2026_08_31. -->

  release: `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print`.
- **Mirror** 113 files at upstream `3a14910` (an upstream `teorth/optimizationproblems` sha; it does
  not resolve in this repo), no drift — as of **16:06Z** — release: `node scripts/reverify.mjs --check`.
- **Public page** 111 constants at that sha, matching committed state — as of **16:06Z** — release:
  `node scripts/render-site.mjs --check`.
- **Standing-rules hash** `b8974a3c`, 4 blocks all identical — as of **15:24Z** — release:
  `node ../skylark-site/scripts/rules-hash.mjs`.
- **Engineering zero-state:** Sentry and Dependabot both render **not-applicable** — this lane has
  neither instrument by design, so neither is a zero.
