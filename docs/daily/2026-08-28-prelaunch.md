---
product: bounds-ledger
date: 2026-08-28
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: cea25f3
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 3
top_action_today: "One thing needs you, and it is on your board. You asked last night for the announcement post to be rewritten around yesterday's correction and shown to you before anything goes out. It is written, reviewed and unsent, and the card holds the whole post so you can read it without opening anything. Separately, today found that the page's most prominent 'tell us this is wrong' link was sending people to a general form instead of the button on the row they were reading — so a stranger who wanted to report an error got asked to explain which of two hundred rows they meant. That is fixed and live."
---

# Daily report — bounds-ledger — 2026-08-28

## BLUF

The page's loudest reporting link was steering doubting readers off the one path this lane's top goal is measured on, and that is fixed and live.

**FIRST ACTION** — the declared block, now five lines: a board read went in above the git checks today because none of the other four can answer *does David want something*.

```
node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**THE NUMBER THAT WILL LIE TO YOU** — `npm run reports` reads **0 outside arrivals**, and it is a
genuinely measured zero: 26 raw issues fetched, 26 accounted for as ours, and the parts reconcile
(26 + 0 + 0 = 26). The misread is not the zero, it is the *denominator of opportunity behind it*.
Until `888a1e5` shipped today, the page's most prominent reporting call-to-action pointed at the bare
issues list, and an issue filed from there is classified `outsideOther`, **never** as an arrival. So
a visitor who did exactly what the page asked would not have appeared in this figure. The zero is
honest; it was never a clean test of whether anyone wanted to report something.

**DON'T-TOUCH** — the `manual: true` → UNVERIFIED-never-green mechanism on `C-7` and `C-9` (the two
claims citing a page that serves HTTP 403 to datacenter IPs). What makes it work is that it refuses
to launder an unverifiable fact into a pass: today's local advisory read returned HTTP 200 with both
pinned strings present, and both claims still report UNVERIFIED. An attempt to automate this away on
2026-07-25 turned CI red in four minutes, and today's announcement draft leans on it as the
honest-limits argument that makes the whole ledger credible.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing**
— the page's report link competing with its own measurement, two ledger rows invisible to every
date-framed sweep, a missing `readCommand`, and the method sentence failing on a third consecutive
outward artifact — none of them about a mathematical record. **Consecutive instrument-facing days: 1.**
Yesterday was record-facing (upstream's retraction), so the eight-day run ended then and this is a
fresh count, not a continuation. The dry-week rule does not fire and a second surface is not indicated.

## What changed

- **`888a1e5` — the user-visible ship.** The intro's *"that is a bug worth [reporting]"* pointed at
  the bare GitHub issues list. `report-rate.mjs` classifies an arrival by the prefilled title
  `/^Row looks wrong:/` or the `Ledger mirror: upstream` body marker, so a report filed from that
  link has `arrivalKind() === null` and lands in `outsideOther` rather than in `outsideArrivals` —
  the page was competing with its own measurement, and charging the reader a round-trip to say which
  of 222 rows they meant. It now names the per-row **looks wrong?** control. This is the residue of
  the 2026-08-22 rotation: the better affordance shipped and the older instruction stayed in the
  highest-attention block. Both `KP-78` — the standing rule that no detector ships until it has been
  shown to fire with the condition present and stay silent without it — answers were demonstrated,
  with the mutation proven to land first.
- **`83210ce` — two ledger rows I filed this morning were invisible to every date-framed sweep.**
  `A-15` (the Mathstodon send decision) carried a live David decision with no date field; `A-35` (the
  CLAUDE.md budget overrun) carried `expiresOn` but not `expectedSignalBy`, so one instrument could
  see it and the other could not. Both dated; re-scan reads 21 dated, 0 undated, 0 overdue.
- **`4179f1e` — the first action now reads David's board.** He answered a card at 02:27Z and this
  pane found it only because a bus dispatch happened to carry it.
- **`87991df` — `A-36` filed:** the public page has never been checked at phone width, and three
  consecutive flow-rotations wrote *"not browser-verified"* in prose while nothing tracked it.
- **`cea25f3` — the traffic sample for `W-6` (the arrival watch)**, read today because P3's traffic
  floor needed a number younger than 24 hours.
- **Not shipped, deliberately:** the Mathstodon announcement. Rewritten around yesterday's retraction
  and amended to carry the outside-contributor evidence, adversarially reviewed, and **unsent**.

## Inputs (controllable)

- Gates green end to end: `npm run verify` exit 0, `npm test` exit 0, `check-doc-references` exit 0,
  `check-deferrals` exit 0, `render-site --selftest` exit 0. CI **GREEN** at `cea25f3`.
- `continuity-check --actions-only` went **CRITICAL → OK** today. It caught `A-35` carrying an
  `onTrigger` with no runnable `readCommand`. Worth stating plainly: the row already had a
  `releaseTest` holding exactly the right command, so it was fully compliant with one checker and
  critical under another — **the same half-visible shape written up in `83210ce` hours earlier, one
  field to the left**, and the phase that diagnosed the class shipped a fresh instance of it behind a
  green board because `continuity-check` was not in that phase's battery.
- Five commits were unlinked from any item; all now linked or given a written rationale in
  `meta.untrackedCommits`.

## Outputs (lagging)

- **`G-4` (the Tier-0 goal — an outside party acts on a watched record without us filing the report):
  0**, measured. The probe fetched 26 issues, attributed all 26 to us (the CI bot and the owner), and
  reconciled 26 + 0 + 0 = 26, which is what makes this a reading rather than a dead probe. Day 20
  since the public flip.
- **`W-6` (the arrival watch): 3 unique viewers** in the trailing 14 days; 194 unique cloners, which
  is not an audience — `reverify.yml` checks the repo out daily, on every push and every PR, and the
  sampler deliberately deducts nothing. The viewer count is the only arrival figure here that is not
  mostly ours.
- **`npm run catches` (verified catches on named records, per week):** unchanged today — no drift
  cycle ran, and nothing in today's work touched a pinned record.

## Recommendation

**Read the card.** `878ba107` holds the rewritten announcement with the full post inline. It is the
only thing today that needs David, it has been asked once, and it will not be asked again — `A-15`'s
own trigger forbids it.

Everything else was ours to do and is done.

## On hold pending data

- **`W-3`** — the watch for acknowledgement of the erdosproblems.com/36 correction. Both legs still
  need David. Today's local advisory read returned HTTP 200 with the page unchanged, and the claims
  stay UNVERIFIED anyway: that site answers 403 to datacenter IPs, so a CI runner can never confirm
  what this machine just saw, and a local 200 is not evidence about CI. The DON'T-TOUCH above,
  working as designed.
- **`A-15`** — the Mathstodon send. Written, reviewed, carded, unsent. Dated 2026-08-31, and the
  disposition that day is read-the-card, never re-ask.
- **`A-36`** — the phone-width check. Blocked on the Claude Chrome extension, which this pane could
  not connect today. Deliberately not carded: David has one live card and a browser-restart request
  would compete with a decision that matters more.

## State Appendix

- **HEAD** `cea25f3` on `main`, pushed; `git rev-parse HEAD origin/main` matches.
- **Items:** 49 total, 21 open and every one of them dated — 0 undated, 0 overdue. Verified as a
  measured zero by a positive control: the identical scan with the clock moved to 2026-09-10 reports
  10 overdue, so the probe discriminates.
- **Ledger:** 113 mirrored files at upstream `3a14910`; 233 claims — 231 hold, 0 broken, 2 UNVERIFIED
  by design (`C-7`, `C-9`, the two `manual: true` claims). Catch table: 12 cycles, and README agrees.
- **`A-2`** (the drift-resolution log), **`A-15`** (the Mathstodon send) and **`A-32`** (the lane-brief
  refresh) all signal 2026-08-31. **`A-35`** (the CLAUDE.md budget overrun) signals today and releases
  at P5. **`A-36`** (the phone-width check) signals 2026-09-04.
- **`A-33`** (the instrument that would see an outside party act on a filed report) remains dated
  2026-09-02, with the orchestrator's approval to pull it forward recorded and not yet taken.
- **Board:** one open card, `878ba107`. Two closed today — `7b693798` against the executed work and
  `6ef0afca` as superseded.
- **Codex:** 0 dispatches. No self-probe was run this session, so no GREEN is claimed; calibration put
  every phase on Sonnet-direct (warm context, sub-30-minute mechanical scopes, taste-heavy choices).

<!-- findings:begin -->

## Back-patch — 15:45 MT, after this report was written

**David answered card `878ba107` and the answer supersedes the Recommendation above.** His words
verbatim: *"Let's make this an uncaged-minds post - please send all the details to the orchestrator
to send to the uncaged-minds agent for a draft."*

Everything outside this fence was true when written and is deliberately not rewritten. What changed:

- **The Mathstodon post will not be sent, and never was.** Fifteen days written, reviewed and
  unsent, and it closes without a single thing being posted anywhere — which was the entire purpose
  of the gate. `A-15` closes as the third outcome its own `closeWhen` provided for: not yes, not no,
  **changed** — a different channel.
- **The material is routed, not authored here.** David named the uncaged-minds agent as the drafter.
  Drafting it in this lane would be scope creep past an explicit instruction, so this lane's job
  ends at a complete, accurate, correctly-caveated hand-off. `A-37` tracks it to acknowledgement.
- **The Recommendation above is discharged.** "Read the card" was the right ask at write time; he
  read it and answered within the hour. **Nothing now needs David from this lane today.**
- **The constraints travel with the material and get stronger, not weaker.** A Substack post is a
  louder surface than a Mastodon instance: name nobody, keep the erdosproblems.com/36 story out per
  his 2026-08-02 decision, let no figure decay, and do not trim the honest limits for length — the
  ledger did **not** catch the retraction, and two claims report UNVERIFIED forever.

**The classification sentence above is unchanged.** This is a routing decision, not a finding; today
remains instrument-facing with a consecutive count of 1.

<!-- findings:end -->
