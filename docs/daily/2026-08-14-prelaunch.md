---
product: bounds-ledger
date: 2026-08-14
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 1
north_star_status: green
north_star_classification: emerging
last_deploy: 00fa1e9
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "The alarm went off overnight and it was right. A mathematician added a brand-new record page to the repository we watch, and while checking it I found the page contradicts itself: the worked example it offers as proof of its headline number actually works out to the previous record, not the new one. That is arithmetic anyone can check in a minute, and it is the second real error this project has found in a cited record. It is written up and going nowhere until it has been through a review and you have said yes. The one thing that needs you today is the Mathstodon post you parked yesterday - you said let us revisit it today, so here it is: send it, hold it, or change it."
---

# bounds-ledger — daily — 2026-08-14 (MT) — the alarm was right, and the page argues with itself

Paced rail, day 13. Steward cadence first, then the increment. No self-rating.

## BLUF

**FIRST ACTION** — resolve A-15 by asking David the parked question, one sentence, in the pane.
There is no command for it, but the artifact to read before asking is:

```bash
cd C:/dev/skylark/bounds-ledger && sed -n '1,40p' docs/decisions/2026-08-13-mathstodon-announcement.md
```

**THE NUMBER THAT WILL LIE TO YOU** — `npm run catches` shows **4 distinct pins this week**, and
today's work contributed **none** of them. A cold reader sees a busy indicator and assumes it
counted today's finding. It cannot: it counts generated pins whose text moved, and today's
upstream change was an *addition*, which the indicator is built to ignore. The defect I found is
invisible to it by construction.

**DON'T-TOUCH** — `catch-rate.mjs`'s silence on added and removed pins. It stayed correctly quiet
today while a constant was added, which is exactly the behaviour its self-test asserts. What
makes it work is that it counts only *movement* in text that is regenerated solely from the
mirror, so it cannot be inflated by our own edits.

The overnight drift alarm fired on `c83f94a` at 09:38Z and again on my own push at 14:19Z. One
cause, not two: upstream `e70b4a4` (an upstream sha — `git cat-file -t e70b4a4` returns *Not a
valid object name* here, while the same command on today's `00fa1e9` returns `commit`, which is
the positive control that the lookup works and the object genuinely is not local) added
`constants/87a.md`, Martinet's constant for totally real number fields, plus its row in the
repo-root README table. A single commit by Terence Tao at 07:03Z — one push, not a burst, so the
resolve-once rule did not need to bite.

Verifying the new page before snapshotting turned up the day's real output. Its current-record
row offers an explicit witness — `rd ≤ 3^4·5^4·7^4·13^2·29^4·53^2·109^2 ≤ 857.5662` — and that
product is a twenty-four-digit integer, so the inequality as typeset is false. Supplying the
eighth root the sentence itself invites gives **913.492694**, which to six significant figures is
**913.493**: the value on the row directly above, the record this one superseded. The witness
offered for the new record is the arithmetic of the old one.

Not reported upstream. That is outward contact, so it needs an adversarial review and then
David's yes, in that order. Tracked as A-16, and it is not urgent.

## What changed

- **Drift resolved to `e70b4a4`** (`433091b`). Mirror at 113 files; the full post-snapshot
  ratchet run — `extract-pins.mjs` (220 → 222 generated pins over 111 files) and the README state
  block re-rendered. 233 claims total: 231 hold, 0 broken, 2 manual/UNVERIFIED.
- **A-16 filed with its finding** (`00fa1e9`) —
  `docs/findings/2026-08-14-the-witness-attached-to-c87s-record-row-proves-the-previous-record.md`.
- **A-15 corrected to reflect David's actual ruling** (`e277875`, this morning) — see below.

## Inputs (controllable)

**The A-15 correction was a real catch about our own record-keeping.** Last night's close-out
committed at 22:43 MT and recorded the Mathstodon send gate as *unanswered*, because the board
card had been dismissed with every reply field empty. Thirteen minutes later David ruled: *"let's
revisit the post tomorrow."* The close-out was therefore wrong from thirteen minutes after it was
written, and it would have stayed wrong if the aged dispatch had been treated as stale and
skipped. A-15 now carries the ruling as a **dated park** with an explicit no-lapse clause: if
today passes without him in the pane, the park rolls forward rather than decaying into a no.

**The finding's method sentence was audited as its own angle**, per the rule that exists because
we got this wrong twice. The claim is *internal inconsistency*, proven by exact integer
arithmetic on the page's own text, with the prime factorization re-extracted mechanically from
the mirror rather than re-typed from my reading of it. It is explicitly **not** a claim that
857.567 was checked against the paper. `arXiv:1901.04354` is the right document — the positive
control is that its abstract independently names the *refined Golod–Shafarevich criterion*, the
mechanism the row cites — but the abstract states no numeric value, the same wall three abstracts
put up on 24 July. Two readings of the defect survive and the finding refuses to choose.

**The derivation, so the BLUF's numbers are checkable here rather than only in the finding.** The
witness multiplies out to
`3^4·5^4·7^4·13^2·29^4·53^2·109^2 = 484,887,097,019,201,067,725,625` — twenty-four digits, which
is why the typeset `≤ 857.5662` cannot be read literally. A root discriminant is
`Δ_K^(1/[K:Q])`, and the row describes an 8-th root class-field tower with 2-class group of rank
8, so the eighth root is the reading the sentence invites: the eighth root of that product is
**913.492694**, and the row directly above it in the same table reads **913.493**. Six
significant figures, exact.

**Three things I ruled out before writing it down**, because a wrong accusation about a
mathematician's page is the expensive failure here: no integer degree yields 857.5662 (8.0748 is
required); the neighbouring roots are 913.49 and 428.29, neither of which is the claimed value;
and no single dropped or mistyped prime power closes the gap, since the needed product is
2.926×10²³ against the stated 4.849×10²³, a ratio of 1.657, which is not a prime power.

**Said plainly rather than implied:** the drift alarm did not catch this and was never meant to.
The mirror is byte-faithful *including* the defect, and `pin:87a:U` asserts that row's listing
position, never that its contents are true. A human reading a new page found it, and there is no
detector behind that step.

## Outputs (lagging)

- **G-1 — the externally-acknowledged-corrections watch: 1, unchanged.** PR #141 remains the only
  acknowledgement. Nothing today touched it.
- **W-3 — the erdosproblems.com email: still unanswered.** Both manual claims re-read green from
  this machine: the page still shows `0.380876` and still says last edited 23 January 2026. Both
  stay UNVERIFIED by design; CI cannot see either.
- **`npm run catches`: 4 distinct pins in the current week, partial.** See the BLUF warning — none
  of them are today's.
- **W-6 — arrivals: unsampled today.** `npm run traffic` was not run; the 14-day window has not
  been lost, but it should run tomorrow.

## Recommendation

**Ask David the A-15 question today, once, in one sentence.** He set today as the date. That is
the whole recommendation — no card, no second artifact.

**Do not rush A-16 outward.** The error is arithmetic rather than a wrong record, the page is one
day old, and it is exactly as reportable next week. The adversarial review is the next increment,
not today's.

**One decision rule needs amending, and it leans simpler rather than more complicated.**
`catch-rate.mjs` carries the rule that *a month of zeros means adopt a second surface*. Today
shows the zeros can be silent while the lane is producing its most valuable output, because the
indicator counts record *movement* and today's product was error *detection*. Those are different
things, and the one external acknowledgement we have came from the second. The cheap fix is to
amend the rule so the zeros do not fire alone — not to build a second indicator that counts our
own findings files, which would be trivially inflatable by writing more of them. Proposed, not
shipped.

## On hold pending data

- **A-15 — the Mathstodon send.** Parked by David to today. Written, reviewed across nine angles,
  unsent. Nothing goes out without his word.
- **A-16 — the C_87 witness defect.** Held behind the adversarial review, then David's gate.

## State Appendix

`main` at `00fa1e9`, tree clean, local and origin agree, PUBLIC. Three commits today
(`e277875` the A-15 ruling, `433091b` the drift resolve, `00fa1e9` the finding), all pushed.

`npm test` exit 0 (13 self-tests). `npm run check` exit 0 with the pin set: no drift at 113 files
against `e70b4a4`; 233 claims, 231 hold, 0 broken or unreachable, 2 unverified and manual; state
block in sync; brief in sync, all 4 dated blocks present.

Open continuity items: **10** — **A-16 — the watch on C_87's self-contradicting record row** is
new today; **A-15 — the watch on the parked Mathstodon send** is live rather than dormant,
because today is its parked date. **G-1 — the goal tracking externally-acknowledged corrections**
stands at 1 and stays open on the 30-day green streak alone. **W-3 — the watch on the
erdosproblems.com email** is unanswered and is a different channel from G-1; do not close it on
PR #141. **W-6 — the watch on arrivals** needs `npm run traffic` tomorrow.

Cards waiting on David: **0**. **Codex calls: 0** — the orchestrator's probe read RED at 14:18Z,
so nothing was dispatched and nothing was debugged solo.
