---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-13
lifecycle_stage: launched
last_deploy: 3c13ad3 (HEAD at the 10-13 kickoff; CI green for it per the kickoff state block)
on_hold_items: 1
top_action_today: A-69, on a phone the index card reads in visual order and a typed number is marked where it appears
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-13 (Tuesday, MT)

## BLUF

Today's pick: on a phone, the index card will read aloud in the order it looks, and a number you typed into the filter will be marked where it appears.

## What changed

### Day session round 1 — P1 selection packet

The kickoff arrived at 16:46Z and a correction at 16:55Z, but neither was surfaced to this pane; both were read from `tmp/.bus-events.jsonl` directly. The full packet, as posted to the bus, is `tmp/p1-2026-10-13-packet.md`. Its substance:

**Outcome:** `A-69` (phone reading order and the matched value). A reader who pastes `10.02` gets one card and has to find their number in a raw pinned row, while a screen reader announces a verdict about a different row before the values.

**Evidence:** WebKit 26.5 at 393x659 on the live index, `10.02` typed. Exactly one row is visible, `c-22a`, and it keeps its rowheader in WebKit, which is finding (b), now measured. Visual order is name, id, bound rows, verdict line; accessibility order is name, id, verdict line, bound rows (finding (a)). The typed value is unmarked (finding (c)). Encounter is MISSING (`A-59`).

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `index.html`, `continuity/items.json`, `docs/key-user-flows.md`.

**HYGIENE INPUTS:** (a) 3: `A-47` (depth audit slice 17), `A-79` (David's essay answer: he will edit the draft himself first, so we do not touch it; the P3 hygiene helper later read that his pass had already landed in the essay's own repository as `1d599d7`, an uncaged-minds sha that does not exist in this repo, at 23:08 MT on 10-12), `W-13` (served-bytes check). (b) none: 0 of 749. (c) none crossed: the kickoff state block.

### Day session round 1 — P3 product work

Manager review `2e21ac41`: APPROVE. **Kind: improve the product.** Commits `dba1472` (the change), `f46ebac` (Codex r1 fixes), `6437c2d` (r2 fixes), `7fb2e5c` (r3 fix), pushed together at about 19:44Z.

**What a phone reader gets now.** A reader who types `10.02` on the index finds the number highlighted in the upper-bound row. A screen reader now reads the card in the order it is drawn: name, id, both bound rows, then the verdict line about another row (which it used to hear first). The desktop table is unchanged.

**How.** The badges are emitted twice from one string. The copy in the name cell shows only on the desktop table; the copy at the head of the links cell shows only on the card layout. Each layout hides the other copy with `display:none`. The filter marks the typed term inside the name, the id and the two bound cells only, ignoring case, and builds each mark from text nodes. When a matching row has nothing to mark, the count line says "nothing highlighted" and nothing more.

**Measured** (`playwright-cli`, local build served on 127.0.0.1, `10.02` typed at 393x659):
- WebKit 26.5: the rowheader holds the name and id; then the upper cell with a mark around `10.02`; then the lower cell; then the verdict link. On the live page before the change, the verdict link sat inside the rowheader, read first. Chromium reads the same order.
- At 1280x900 in Chromium, the accessibility snapshots of the live page and the local build are 3406 lines each, with 0 differing.
- On the page: `117/370` finds 74a and marks nothing. `SOFA` marks "Sofa" and "sofa". Typed markup creates no element. Clearing the box removes every mark.
- WebKit also exposed the generated text of hidden rows ("Upper-bound row (last listed) … ⚠") in its accessibility tree. That was already true on the live page this morning. It is now switched off for hidden rows and hidden badge copies.

**Review.** Three Codex rounds, all read-only, each with banner workdir `C:\dev\skylark\bounds-ledger`:
- r1 on `dba1472`: 2 findings plus coverage notes, all CONFIRMED.
- r2 on `f46ebac`: 2 findings, CONFIRMED.
- r3 on `6437c2d`: 1 finding, CONFIRMED.

Rounds 1 to 3 each refuted a sentence the count line said about the shown text. After the second, the shape changed (stop patching on the second appearance): the line now reports only whether a mark was drawn.

**Red-armed** (file restored byte-identical after each). Each mutation failed on the assertion named here:
- Badges back to `order:2`: "on the card layout the th's badges must leave the reading order, not only move visually".
- Card copy drops a badge: "the card-layout copy must equal the th's badges exactly".
- Whole-text mark on any hit: "a cell that does not contain the term must carry no mark".
- `innerHTML` marks: "the typed value must be marked in the bound cell that shows it". The fake DOM does not parse markup; this limit is known.
- Links cell emitted first: "the document order must be th, upper cell, lower cell, links cell".
- Old count wording: fails the strict-equality pin.

**Gates:** `npm test` exit 0 at `7fb2e5c`; `render-site --check` PASS at commit time.

## Inputs (controllable)

## Outputs (lagging)

## Recommendation

## On hold pending data

## State Appendix
