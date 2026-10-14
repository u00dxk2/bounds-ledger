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

On a phone, a number you type into the index filter is now highlighted where it appears, and a screen reader hears the bounds before the note about another row.

## What changed

### Day session round 1 — P1 selection packet

The kickoff arrived at 16:46Z and a correction at 16:55Z, but neither was surfaced to this pane; both were read from `tmp/.bus-events.jsonl` directly. The full packet, as posted to the bus, is `tmp/p1-2026-10-13-packet.md`. Its substance:

**Outcome:** `A-69` (phone reading order and the matched value). A reader who pastes `10.02` gets one card and has to find their number in a raw pinned row, while a screen reader announces a verdict about a different row before the values.

**Evidence:** WebKit 26.5 at 393x659 on the live index, `10.02` typed. Exactly one row is visible, `c-22a`, and it keeps its rowheader in WebKit, which is finding (b), now measured. Visual order is name, id, bound rows, verdict line; accessibility order is name, id, verdict line, bound rows (finding (a)). The typed value is unmarked (finding (c)). Encounter is MISSING (`A-59`).

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `index.html`, `continuity/items.json`, `docs/key-user-flows.md`.

**HYGIENE INPUTS:** (a) 3: `A-47` (depth audit slice 17), `A-79` (David's essay answer: he will edit the draft himself first, so we do not touch it; the P3 hygiene helper later read that his pass had already landed in the essay's own repository as `1d599d7`, an uncaged-minds sha that does not exist in this repo, at 23:08 MT on 10-12), `W-13` (served-bytes check). (b) none: 0 of 749. (c) none crossed: the kickoff state block.

Positive control: `git -C C:/dev/skylark/uncaged-minds cat-file -t 1d599d7` printed `commit`, while the same command in this repo exited 128 with "Not a valid object name 1d599d7", so the sha resolves in the essay's repository and not here.

### Day session round 1 — P3 product work

Manager review `2e21ac41`: APPROVE. **Kind: improve the product.** Commits `dba1472` (the change), `f46ebac` (Codex r1 fixes), `6437c2d` (r2 fixes), `7fb2e5c` (r3 fix), pushed together at 19:35:55Z (13:35 MT; the local reflog of `origin/main`).

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

### Close — day session round 1

ACTION: COMPLETED · item A-69 (phone card reading order and the matched value) · P3 5f5062a7 (bus msgId)

**No P5 prompt arrived.** P3 was posted about 20:00Z, and a `P5 not queued +30m` status went out as bus msgId fc9609bb. David then said "continue" in this pane at about 15:30 MT, and the close ran on that word. The self-start was announced first as bus msgId fc4ce55e.

**Manager review of P3** (P5 prompt, 21:38Z): COMPLETED. It raised one copy defect: the count line could read "1 of them have nothing highlighted". That is fixed in the close commit (the verb is now "has" when the count is 1), with the selftest pin updated. Checked by inspection, not sent to Codex: the change is a one-word agreement fix.

**State changed since the P3 post:** the agreement fix above; `A-79` (David's essay answer) closed; `A-47` (the depth audit) and `W-13` (the served-bytes check) re-dated.

**Hygiene draft:** 3 lines — 2 accepted · 1 amended · 0 rejected.
- `A-47` AMENDED: re-dated to 2026-10-14, not the draft's 10-15, because slice 17 did not run today.
- `A-79` ACCEPTED as close. The note paraphrases David's answer.
- `W-13` (the standing served-bytes check) ACCEPTED: re-dated to 2026-10-20, using the served read taken after today's push.

READ-MUTATED: none, 3 reads guarded. Wait-justification and engineering-zero: PASS (the helper ran both).

**Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT. The first run returned ROLLOVER on `W-13` (the served-bytes check): I had moved its `expectedSignalBy` but not its `nextCheckDate`, and the check resolves the earlier of the two. Moving the second field cleared it.

**Ledger delta:**
- `A-69` closed. The WebKit read is recorded on the row.
- `A-79` closed: David's edit landed in the essay's own repository, and the rest is tracked there.
- `A-47` (the depth audit) next check 2026-10-14. `W-13` (the served-bytes check) next check 2026-10-20.

**Findings classification, one sentence of human judgment:** today's findings were all instrument-facing: three review rounds each refuted a sentence our own count line said about the text, and WebKit exposed hidden rows' generated text. Nothing record-facing was found, because no depth-audit slice ran.
- **Byte-only catches:** no counted catch today, numeric or byte-only.
- **Consecutive instrument-facing days: 1** counted today, by hand. The last stated count was 0 on 2026-10-04. The reports of 10-05 to 10-12 carry no classification sentence, so the run before today is UNREAD, not zero.
- **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." Not tested today: there was no catch.

### Evening round — P1 selection packet

The kickoff arrived at 04:50Z on 10-14 (22:50 MT 10-13). The full packet as posted is `tmp/p1-2026-10-13-evening-packet.md`. Its substance:

**Outcome:** a reader who pastes the rounded number they are about to cite lands on its constant (new row `A-80`, minted with the change in P3). Typing `1.5029` on the live index (1a's upper row lists 1.502862) gives "0 constants matching", then "If yours is not among them, we are not watching it". That is false: 1a is watched.

**Evidence:** WebKit at 393x852 on the live index, 23:00 to 23:14 MT. An in-page probe rounded each of the 143 decimals in the marked cells to every shorter length (647 forms): 256 find their own row, 52 land only on another constant, 339 find nothing. Encounter is MISSING (`A-59`, the encounter blind spot): `npm run reports` read 0 outside arrivals of 33 raw issues.

**Next action:** improve. When a numeric query matches nothing, retry it shortened by trailing digits and say so. The typed string is shortened; cell values are never parsed.

**USER-FACING: yes.** Paths: `scripts/render-site.mjs`, `index.html`, `continuity/items.json`.

**HYGIENE INPUTS:** (a) none, 0 due on/before 2026-10-13. (b) none, 0 of 749. (c) none crossed.

### Evening round — P3 (finished 2026-10-14 morning, after the reboot)

The pane died mid-P3 when Windows Update restarted the machine at 00:29 MT 10-14; the work-in-progress survived in the tree. `A-80` (a rounded number typed into the search finds its constant) shipped as `a827d4b`: when a number with three or more decimals matches nothing, the page retries the typed string with trailing digits dropped, never below two decimals, and says the rows matched a shortened form and are not necessarily the one meant, with an ask link. The manager review's two hypotheses (a two-decimal floor with a multi-match disclaimer; keep a way to ask on the fallback) were both measured as right and both built. Four red-armed mutations, each restored. Codex r1 (read-only, banner workdir checked): no blocking defect, one LOW test gap, confirmed and fixed before commit. `npm run verify` exit 0 at `a827d4b`; CI green on both workflows at that tip; `npm run served` SERVED; a live search for 1.5029 at 393x852 showed only 1a with the notice. `A-80` CLOSED.

### Evening round — close (2026-10-14 morning)

ACTION: COMPLETED · item `A-80` · P3 4c07aa0e

**Acceptance clause 3**, which the manager review found unevidenced, was run at 15:25Z on the SERVED page (`7debb86`), not on a local build. The 10-13 probe script was never saved. I rebuilt it from the packet's definition, and the rebuild read a wider population: every 3+-place decimal in a row's visible cells, 168 decimals and 731 forms, against the packet's 143 and 647. On the same 731 forms, the old substring filter and the live page compare as follows:

| | own row | another constant only | nothing |
|---|---|---|---|
| old filter | 303 | 58 | 370 |
| live page | 531 | 117 | 83 |

All 83 forms that still find nothing show the empty state; none hide it. Of the 370 that found nothing before, 228 now reach their own row, 59 land only on another constant under the "not necessarily the one you meant" notice, and 83 still find nothing. The 58 old other-only forms are kept separate (117 = 58 + 59). This counts forms, not readers. Encounter stays blind (`A-59`, the encounter blind spot).

**Ledger delta:** `A-80` minted, then closed with evidence; clause 3 added to its notes. Hygiene draft: 0 lines. Due-gate check: UNRESOLVED, because the snapshot is from 10-13 (STALE) and `A-47` (the depth audit) reads as due on 10-14, which belongs to the day round. Pending reads: none owed by this round.

## Inputs (controllable)

One product change (`A-69`), four commits, three Codex review rounds (5 findings, all fixed), six red-armed mutations. One background hygiene helper.

## Outputs (lagging)

Encounter blind (`A-59`). `npm run reports` read 0 outside arrivals of 33 raw issues, every issue accounted for (read 2026-10-13).

## Recommendation

Tomorrow (10-14): run `A-47` slice 17 first. Compute and push its new grid before the draw, because it has slid one day. Then `A-54`'s census read.

## On hold pending data

`A-59`: reader encounter on the public pages, blind (next check 2026-10-28).

## State Appendix

Written at close from live commands, as of about 21:55Z on 2026-10-13. A report cannot name the commit that lands it, so release each value with its command.
- HEAD before the close commit: `5acca53`, equal to origin/main. Release: `git -C . log -1 --format=%h`.
- CI at `7fb2e5c`, the last page-changing commit: reverify GREEN and page-check GREEN. Release: `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`, then the same with `page-check.yml`.
- Served: `index.html` SERVED at `7fb2e5c`, 1 of 1. Release: `npm run served`.
- Verify receipt: exit 0 at `5acca53`. Release: `npm run verify`.
- Ledger: 96 rows, 76 closed, 19 open, 1 monitoring, read in the working tree after today's closes of `A-69` and `A-79`. Release: `node scripts/sky.mjs gen-primer-first-action.mjs --repo . --target-date 2026-10-14 --json`.
