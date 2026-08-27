---
product: bounds-ledger
date: 2026-08-27
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 7547c01
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you. Upstream corrected one of the records we watch, and the interesting part is that it corrected the same sentence we declined to trust two weeks ago. On 12 August upstream said one mathematician's proof merely acknowledged another's; we could not check it, so we wrote down that we could not check it rather than repeating it. Today upstream withdrew that sentence itself and called it incorrect. Nobody told them; they found it on their own. That is the ledger being right by refusing to guess, which is the only kind of right it is trying to be."
---

# Daily report — bounds-ledger — 2026-08-27

## BLUF

Upstream retracted a fifteen-day-old attribution on a watched record, and our own file already said we could not verify it — the ledger was right by declining to guess.

**FIRST ACTION** — now DECLARED and machine-generated into the primer, one command per line:

```
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

## What changed

**The drift cycle — twelfth resolution, and the first retraction in the catch table.** Mirror
`5c4aeee` to `3a14910` (upstream shas; neither resolves in this repo). Two files drifted, one
generated pin moved (`pin:2a:U`). Upstream withdrew its description of Lorist–Schwenninger as a
second proof "which acknowledges Jin", replacing it with a *Priority and independence* note and
stating in its own words that the earlier text "read a citation of prior public posting as a
statement of dependence, and was incorrect".

Our `docs/findings/2026-08-12-two-record-movements-in-one-cycle.md` recorded that same claim as
*"unverified by us — not contradicted"*, because ar5iv served the arXiv abstract page twice and we
refused to assert an absence from a document we had not proven we were reading. Upstream has now
withdrawn it. The UNVERIFIED verdict was the right call and is settled in that direction — by
upstream, not by us.

Every leg of the replacement text was verified before the mirror moved, each with a positive
control: Crossref for Jin's title, author and v4 date; the arXiv API for LS2026's v2 and its
2026-08-04 posting; the rendered **v1** body for upstream's section 1 quotation. One trap worth
recording for whoever checks that quote next — **v2 rewords the clause, so checking it against v2
alone reads as a misquotation and is not one.** Upstream says "since its first version", and v1 is
where it is verbatim. I read it against v2 first and was wrong for about a minute.

**The queued dispatch — first-action fence declared, generated primer ADOPTED.**
`check-primer-generated` went NONE to ADOPTED in one pass. I did not pick either fence the
orchestrator offered, deliberately and with the deviation flagged on the bus: both were CI-truth
reads, and `AGENTS.md` says `npm run verify` is the day's first command. Declaring a CI read would
have copied a wrong instruction verbatim into every generated primer from here on.

Running the generator against **today's** primer instead of waiting for close is what paid: it
REFUSED at exit 2 because our primer held prose with no `hand:` markers and nothing would have
survived. That is a 20:00 discovery avoided. The merge was audited rather than trusted — all 11
original H2s survive and the narrative region is byte-identical at 16,068 chars.

**A stale goal reference in an instrument's own output.** `report-rate.mjs` printed "G-3 asks for
n=1" the day after G-3 closed. Fixed, and the replacement says the sharper thing: with G-3 closed
this stopped being a *leading* indicator and became the thing itself, because an issue arriving
through a per-row link has no artifact we authored in its causal path — which is G-4's whole
condition.

## Inputs (controllable)

- Drift cycle run and resolved; ratchet complete including the second `render-site` after commit.
- `A-30` — the deferral on adopting the primer generator — CLOSED met.
- `A-2` — the standing drift-resolution log — note 11 added.
- README catch table 11 to 12; the third ratchet leg caught the staleness, as designed.

## Outputs (lagging)

- `npm run reports` — **0 arrivals**, and a MEASURED zero: the probe saw 26 issues and reconciled
  every one (26 + 0 + 0). This is now G-4's primary indicator, not a leading one.
- `npm run catches` — current partial week reads 3 distinct pins. **`pin:2a:U` is in that figure and
  no number moved**, so the week's count overstates recorded movement by exactly the amount this
  sentence exists to correct.
- Gate green end to end at `7547c01`: no drift at `3a14910`, 233 claims (231 hold, 0 broken, 2
  manual UNVERIFIED by design), state block in sync, page matches committed state, brief in sync.

## Recommendation

Nothing for David. The lane did today what it is for.

## On hold pending data

- `W-3` — the watch for acknowledgement of the erdosproblems.com/36 correction. Both legs still need
  David; today's local advisory read shows the page unchanged (`0.380876` present, last edited 23
  January 2026).
- `A-28` — the watch on the Mathstodon announcement, ready-and-unsent, figures now further stale.
  Today's retraction is materially better material than what that draft carries.

## State Appendix

**Findings classification.** Today's window is **RECORD-FACING** — the first since 2026-08-14 — and
it ends the instrument-facing run at eight consecutive days (2026-08-15 through 2026-08-26). The
catch is `constants/2a.md`: upstream retracting an attribution on a watched record. It was
**BYTE-ONLY** in pin terms — `$C_2 = 2$` is byte-identical on both sides — so `npm run catches`
counts it while nothing numeric moved, which is exactly the seam this sentence closes.

**The standing prediction, checked rather than decorated.** The carried claim was that the next
record-facing catch would be a *witness-value mismatch on a constant upstream added within ~30 days,
flagged by a human recomputing a cited certificate*. **That was wrong on every clause.** What
arrived was an attribution retraction on a constant upstream has carried since July, surfaced by the
scheduled byte-diff — an alarm, not a human recomputation. Recording the miss per the rule. The
replacement prediction: the next record-facing catch is an upstream *self-correction of citation
metadata* — a date, a version, or an attribution — rather than a bound moving, because two of the
last three have been that shape.

**W-7 — the watch on reading one instrument against its own claim. My own positive control, and it
could not fail.** Verifying upstream's new text I wrote a control on the fetched LS2026 body:
`perturbation lemma`, `double-layer`, `dilation`. All three sit in the paper's **abstract**, so the
control could not discriminate the body from ar5iv's abstract-page fallback — and it *passed on the
fallback*, which would have licensed four false ABSENT readings about a real mathematician's paper.
Chrome markers that only the abstract page carries (`Skip to main content`, `View a PDF of the paper
titled`) failed it instantly, and `arxiv.org/html/<id>v1|v2` then served the real bodies at 4,121 and
5,370 words. positive control: `arxiv.org/html/2608.03841v2` returned 5,370 words containing the
footnote "The authors became aware of [17] on July 28, 2026" verbatim, which is what licenses every
reading taken from that fetch. This is the 2026-08-12 trap one layer up: the control existed and was
run; it just did not discriminate. Same shape as the 2026-08-23 premise-check finding — "does the field exist" and
"does the field discriminate" are different questions, and only the second can kill a design.

**Ledger.** 21 open items before today's close of `A-30` — the deferral on adopting the primer
generator; `G-4` — the Tier-0 goal that an outside party acts on a watched record without us filing
the report — is at 0.
