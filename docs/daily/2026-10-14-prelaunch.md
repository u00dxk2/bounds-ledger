---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-14
lifecycle_stage: launched
last_deploy: 44aaaed (HEAD at the 10-14 kickoff)
on_hold_items: 1
top_action_today: A-47 slice 17, four more cited records read against their sources
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-14 (Wednesday, MT)

## BLUF

Pending: written at the close.

## What changed

### Day session — P1 selection packet

The full packet, as posted to the bus, is `tmp/p1-2026-10-14-packet.md`. Its substance:

**Outcome:** `A-47` (the depth audit David ruled on 2026-09-09), slice 17. It reads four more cited records against the papers they cite. It slid from 10-13.

**The grid, computed before any row on it was looked at:** offset 18 on the 50-step grid in the 691-row frame. It is the lowest of the offsets furthest from every offset used so far (0, 25, 12, 37, 6). The positions are 18, 68, 118 … 668 (14 in all). Slice 17 takes 18, 68, 118 and 168. The literal computation is in the packet. The 10-06 rule ("halve the largest gap") was stated and never computed, and it picked 6 when the largest gaps were 12 to 25 and 37 to 50. This rule was computed first.

**Evidence:** `depth-audit.mjs --corpus` read 691 cited of 788 bound rows today. The store stood at 75 audited at the 10-13 read. `npm run reports` read 0 outside arrivals of 33 issues, and the parts sum. Encounter is MISSING (`A-59`).

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, `continuity/items.json`, the drawn constants' `c/` pages, `index.html`.

**HYGIENE INPUTS:** (a) 4: `A-50` (the CLI-import selftest), `A-54` (the Small Ramsey Numbers census), `A-76` (decimals printed below an exact upper bound; folded in only if a drawn row has that shape), `W-14` (upstream issue 218: OPEN, 0 comments, last updated 2026-10-07). (b) none: 0 of 749. (c) none crossed in the kickoff state block.

### Day session — P3: the slice 17 grid, pre-registered before the draw

The manager approved offset 18 (bus `20057b9a`). It also raised a point to check: offsets 0 and 25 came from the 673-row frame, so in the 691-row frame they no longer pick the rows they once did. I measured that, and it is right, and it changes the grid. The rule and its positions below are committed and pushed before `--draw` runs for slice 17. The draw's record and the readings land in later commits, so `git log` shows the order.

**How the held rows were located.** `depth-audit.mjs --draw 1 2 … 691` printed every position in the frame with its holder line, to `tmp/a47-fullframe-draw.txt` (exit 0; `store: 71 of 691 drawn position(s) land on a row already held, read against 75 audit store entries`). That run prints each row's text too. Only the position numbers and holder lines were extracted from it, by script. No row's text was read before this rule was fixed.

**What it showed.** The 71 held rows sit at these residues mod 50: 2, 4, 5, 6, 7, 11, 12, 13, 25, 26, 27, 29, 30, 35, 36, 37, 38, 39. The old offset-0 and offset-25 slices now land on 2, 4, 5, 7, 11, 13 and 25 to 30. The suspicion-drawn rows add 35 to 39. So the declared offsets {0, 6, 12, 25, 37} were the wrong "used" set. Offset 18, picked from them at P1, sits 5 away from the held rows at residue 13.

**The rule.** Among offsets 0 to 49 on the 50-step grid in the current frame, take the offset whose circular distance (mod 50) to the nearest residue of a HELD row is largest. On a tie, take the lowest. Held means a row the draw's own holder line names, so the set is measured from the store and not taken from what earlier slices declared. A repeat is still possible in principle if the frame grows, and the collision rule (`collisionRule2026_10_01`) stays the check for that at each draw.

The literal output of the computation over that file:

```
frame: 691 · held positions: 71
residues mod 50 of held positions: 2,4,5,6,7,11,12,13,25,26,27,29,30,35,36,37,38,39
max min-distance: 6 achieved by offsets: 19,45,46
chosen (lowest): 19
positions (14): 19 69 119 169 219 269 319 369 419 469 519 569 619 669
grid positions already held: none
```

**Slice 17 takes 19, 69, 119 and 169.** The other ten are later slices. No position is swapped after it has been seen. This replaces the P1 packet's offset 18 (positions 18, 68, 118, 168), which was never drawn.

### Day session — P3: slice 17 read

The draw (`9f03b72`) was pushed before any source was opened. GitHub created its runs at 18:32:46Z. Four reading agents read one source each and returned text. The 14a and 1a reports are saved in `tmp/`; the 10c and 20c reports were returned as text, and their substance is in the entries. In this session I re-read page images: 14a p. 196, 1a p. 15, 10c p. 54, and 20c v2 pp. 3 and 19 (p. 19 after review r1). I also read Crossref's record for KL2022.

| Row | Verdict | What decides it |
|---|---|---|
| 10c [Bel2013] | UNRESOLVED | The thesis credits Schmidt and the personal communication, but prints only "K ≈ 3.65". The agent proposed SOUND. |
| 14a [LS1965] | SOUND | The cited JACM edition determines Σ(3) = 6 and SH(3) = 21. |
| 1a [GGSWT2025] | UNRESOLVED | The number holds: the stated bound 1.5032 implies 1.5053, which also appears as a caption score. The passages read do not connect 1.5053 to the May 2025 announcement the row names. |
| 20c [KL2022] | UNRESOLVED | arXiv v2 gives α = 5 and v1 gives 5 + o(1). The journal edition was not reached. The paragraph introducing Theorem 1.1 describes the improvement to a polylogarithmic bound without the word "first". The agent leaned SOUND. |

`node scripts/depth-audit.mjs` (exit 0): "79 row(s) audited — 51 sound, 1 defective, 20 unresolved, 7 unreachable". That is up from 75.

<!-- findings:begin -->
- **A citation defect in a mirrored entry, found by reading.** 20c.md line 91 names KL2022's second author "Jean Lehec". Crossref's record and arXiv v2 both give "Joseph Lehec". This is outside the claim checked. It is not filed upstream, because that is outward contact.
- **A value the cited paper may not print.** 1a.md line 18 credits GGSWT2025 with 1.503164. The reading agent's text search of v1 and v3 found no "50316". I did not re-read this myself, and the row was not drawn.
- **The entry-versus-source note cannot reach most entries.** `referenceNote` renders only when the entry line carries the bold key `**[Key]**`. In the mirror, 31 reference lines do and 621 plain `- [Key] ` lines in 66 files do not. So the 20c author difference could not go on its public page, and none was stored. The search space was lines starting `- **[` or `- [` in the 115 constant files.
<!-- findings:end -->

**Classification (by hand, not a counter):** the window holds one record-facing finding (the 20c author name) and one instrument-facing one (the note path's reach). The 1a value is a candidate that has not been confirmed. No counted catch moved today, numeric or byte-only. The standing prediction says "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm". A reading agent found the author-name difference and the lead agent rechecked it against Crossref. That matches the predicted defect and the predicted channel (reading the cited source in `A-47`, not an alarm). No human confirmed it, so the prediction's "found by a human" part is not established.

## Inputs (controllable)

## Outputs (lagging)

## Recommendation

## On hold pending data

## State Appendix
