---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-01
lifecycle_stage: launched
last_deploy: 3c34147 (the last page-changing commit; npm run served read SERVED at 18:00:41Z)
on_hold_items: 0
top_action_today: A-47 slice 11, with the A-53 render refusal and the A-60 draw guard
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-01 (prelaunch report)

## BLUF

We read five more cited rows of the constants ledger against the papers they cite, and those verdicts are live on the public pages. Three hold. Two could not be settled: one paper's worked example is not quite the case the row describes, and the other row's number is slightly below what the paper's own figure gives, but the edition it cites was out of reach.

The pages now refuse to rebuild if a reading would silently drop off them, and the ledger's draw warns when it picks a row already read. The review before publishing came from the same model family as the work, so a cross-family check on those five verdicts (88a, 11b, 15a, 1b and 22a, listed under What changed) is still owed, by 3 October at the latest.

## What changed

- **`A-47` slice 11** (the depth audit: read our own cited rows against their sources). The draw was pushed in `b23ee4a` before any source was opened, and the readings landed in `a1c0b81`. Review fixes landed in `a41c707` and `3c34147`. `node scripts/depth-audit.mjs` (exit 0) now reads "53 audited, 33 sound, 2 defective, 11 unresolved, 7 unreachable"; this morning it read 48 (30/2/9/7).
  - SOUND: 88a [Zha14], 15a [DWZ2022] (on the cited FOCS edition's abstract; body read in arXiv v5) and 1b [YKLBMWKCZGS2026].
  - UNRESOLVED: 11b [BIM2023] (the worked Hamming-ball example is on sets slightly larger than half the cube, while the constant is over half-size sets) and 22a [ACPR2011] (preprint only: its 10_124 figure gives 12.6389 against the row's 12.63).
  - Position 137 landed on 1b's row, already held by two suspicion-drawn readings. It was recorded as its own systematic entry under the rule written on `A-60` before the draw was pushed.
- **`A-53` closed** (the audit store and the public page could disagree about how many rows were read) on option (b): both page generators refuse to write when an entry would be silently dropped, including an absent store or an entry whose constant has no page. Stale entries are not refused. It was red-armed on the live store and through the wiring.
- **`A-60` closed** (the draw did not warn on a row already held): `--draw` now names the holders, red-armed both ways, and the collision rule is on `A-47`.
- **The systematic label** on the constant pages now reads "drawn by its position in the list of cited rows, not because it looked wrong", replacing wording the 2026-09-29 walk flagged as jargon.
- **Two rows filed:** `A-61` (the cross-family claims pass owed on the five verdicts, due 2026-10-03) and `A-62` (the index read badge can sit beside a row nobody read, due 2026-10-06).
- **Findings classification, one sentence of human judgment:** today's findings were mostly instrument-facing (the index badge, two refuted method sentences, a false sentence about our own CI in three places); one is record-facing but UNRESOLVED, 22a's 12.63, which is not a catch until the cited edition is read.
  - **Numeric or byte-only: neither.** The drift alarm counted nothing today. Positive control: `reverify.test.mjs` plants synthetic drift on every `npm test`, and today's verify ran it.
  - **Consecutive instrument-facing days: 2**, counted by hand. Yesterday's were instrument-facing too.
  - **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." Not tested today: there was no catch. If 22a resolves DEFECTIVE, that would be a NUMBER disagreeing with its source, which the prediction names as the case that makes it WRONG.

## Inputs (controllable)

- Five background reading agents, one per row, under `tmp/slice11-brief.md` (slice 10's brief, unchanged). The brief forbids sending identity, Unpaywall, completing a verification challenge and shadow libraries. The quoted page of each was checked by this session against the saved image: 88a p. 1122, 11b p. 16, 15a's arXiv v5 p. 1 and the FOCS abstract's JSON, 1b's v2 p. 8, and 22a's p. 40.
- Two adversarial reviews, both by same-family Claude reviewers because the Codex probe read RED at 15:14Z. Round 1 on `a1c0b81` returned FIX-THEN-PUSH with no blocker; its findings and their fates are in the `a41c707` commit body. Round 2 on `a41c707` returned PUSH; three wording nits were taken in `3c34147`.
- One hygiene helper. Its draft held 0 lines, with wait-justification and engineering-zero both PASS.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report):** `npm run reports` at P1 read 0 outside arrivals of 32 raw issues, with the parts reconciling (32 + 0 + 0 = 32). By the rule of three, the 95% upper bound on the outside share of issues is about 3/32. It says nothing about readers who never file.
- **Delivery:** `npm run served` at 18:00:41Z read "1 checked — 1 served" with anchor `3c34147`. A live fetch of c/4a.html, c/1b.html, c/88a.html and c/11b.html returned each page's new line from the 17:59Z build. CI on `3c34147`: GREEN. `npm run verify`: exit 0 at `3c34147`. Encounter: blind (`A-59`).
- **The two depth counts, side by side and never summed:** the constants audit is above. The Small Ramsey Numbers census (`node scripts/ds1-depth.mjs`) did not change today; its next session is 2026-10-02.

## Recommendation

- 2026-10-02: census session 4 on `A-54` (the Small Ramsey Numbers rebuild), opening with Mac (13 bounds). Apply the tripwire first.
- 2026-10-03: `A-47` slice 12 at positions 237, 287, 337, 387 and 437. Run `A-61`'s claims pass first if the Codex probe reads GREEN. If it is still RED, hold slice 12's push until both passes can run, or write down why it publishes without one.
- By 2026-10-06: decide whether `A-62` (the index read badge) is the next product round's change.

## On hold pending data

- **22a [ACPR2011] is UNRESOLVED on edition.** The published Experimental Mathematics tables (vol. 20, pp. 57-90) would settle it either way.
- **11b [BIM2023] is UNRESOLVED on what the paper writes out.** A computation of E h_A^β on an exactly half-size set, in this paper or a later version, would settle it.

## State Appendix

### Selection packet (P1 — evidence and choice)

**Outcome:** five more cited rows read against their cited sources, shown on the public constant pages. Item `A-47` (the depth audit: read our own cited records against their sources), slice 11, at positions 662, 37, 87, 137 and 187 in the 691-row frame.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." Each reading tells a citer whether the source a row cites supports the number shown, which they could not know without opening the paper themselves.

**Two dated gates that bear on this choice are settled as part of it, before the draw is pushed:**

- `A-53` (the audit store and the public page can disagree about how many rows were read). **Choice: (b). The render side refuses a dropped entry.** Today `usableAudit` in `scripts/render-constant-pages.mjs` silently drops any store entry that fails it, which is how slice 5's 10c entry left the page while `depth-audit.mjs` still counted it. Under (b), rendering exits non-zero and names the entry and the failing field. The alarm then sits where the loss happens and no third counter is added, which is the question W-7 (the rule that asks each instrument whether its output could ever have said otherwise) asked of option (a). This keeps the 2026-09-10 rule that one malformed row must never take the published site down: the refusal stops the render and the pre-commit hook, so the previous pages stay served and the bad entry is never committed. Rejected (a): a second counter reading two counters. Rejected (c): the instance happened once already and the direction of the error flatters us.
- `A-60` (the draw does not warn when a drawn position lands on a row already in the store). **Proposed rule for position 137:** the systematic slot re-reads `1b`'s row (fingerprint `e19d80316c75fd95`, a row fingerprint and not a commit) for its value-vs-source claim and records its own systematic entry. `A-47-0015` stays suspicion-drawn. Why not mark the position covered by `A-47-0015`: that needs a new rendering path, while a fresh systematic entry is already handled. The `rechecked` assertion in `render-constant-pages.mjs`'s selftest counts a row with both kinds of reading once, as systematic. It also re-reads the row against today's mirror rather than transcribing a 2026-09-05 suspicion read. **Guard: build it** (lane-authorised tooling). `--draw` prints, per position, every store id holding that fingerprint, with both KP-78 (prove the instrument can fail) answers recorded: it fires on 137 and stays silent on 662. pragma: allowlist sha

#### Evidence

- OBSERVED — `node scripts/depth-audit.mjs` (exit 0, read 2026-10-01 ~16:00Z): "48 audited, 30 sound, 2 defective, 9 unresolved, 7 unreachable"; selection "39 drawn by position · 9 chosen because something already looked wrong". Population: the store only, not the 691 cited rows.
- OBSERVED — `A-53`'s comparison, read today: `c/4a.html` (committed) reads "39 row(s) have been drawn by position … the sources of 33 were read and 6 could not be read at all. 7 more were chosen for suspicion". The store agrees: 39 systematic entries are 39 distinct rows (33 read + 6 unreachable: 31a, 43a, 24a, 15a, 52a, 80a), and 9 suspicion entries are 7 distinct bound rows (0003 and 0016 are citation-well-formed, and 0016 shares 0015's row). **No disagreement today.** Limit: after slice 11 records 137 systematically, the page's suspicion figure drops to 6 while the store's suspicion entries stay 9. That is the existing counted-once rule, not a defect, and the comparison has to be read with it.
- OBSERVED — `A-60`'s collision, measured 2026-09-30 before any source was opened (on the row): 137 → `e19d80316c75fd95` counts 2 in the store; 662, 37, 87 and 187 count 0. Re-run today through the gate after this packet was written (`check-due-gates-dispositioned --run A-60`, exit 0, 16:01:05Z): the same five fingerprints, and a Grep over `continuity/depth-audit.json` for all five returns 2 matches, both 137's. pragma: allowlist sha
- OBSERVED — `npm run reports` (exit 0): 0 outside report arrivals, as a measured figure. Parts reconcile 32 + 0 + 0 = 32 issues seen.
- OBSERVED — CI: `check-ci-status --workflow reverify.yml` GREEN at HEAD `b963732`. This lane has no Render service, so the drift check did not sweep it.
- MISSING — any read of whether a citer has opened a constant page's audit block. The page is static and carries no analytics by design (`A-59`, encounter blind, dated 2026-10-28).

#### Permission

- `A-47` is open, David-ruled 2026-09-09, and the ladder runs under that ruling. The constant pages are **not** under the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html` (`A-54`) until the census rebuild lands. No board card is open on any of the three rows (`answered-cards`: none).
- `A-53` and `A-60` are lane-authorised tooling decisions, recorded on their rows.
- Outward gate: none touched. No upstream contact, and nothing beyond the ordinary Pages publish of the constant pages.

#### Next action

Kind: **improve** (deliver five readings to the pages), preceded by the two guards.

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 662 37 87 137 187
```

Order in P3: (1) build the `A-60` draw-collision guard and red-arm it, (2) build the `A-53` render-side refusal and red-arm it, (3) commit and push the slice 11 draw with 137's rule written on `A-60` before any source is opened, (4) read the five, (5) render and commit, then run a second `render-site.mjs` after the commit and `npm run check`.

#### Acceptance condition

- The five constant pages (`88a`, `11b`, `15a`, `1b`, `22a`) each show slice 11's verdict, and `index.html` badges reflect them.
- `node scripts/depth-audit.mjs` reads 53 audited, and the store and `c/4a.html`'s ledger-wide sentence agree on drawn-by-position rows: 44.
- Mutating one store entry's `source` to a repository path makes rendering exit non-zero and name the entry. Restoring it gives exit 0 and a clean tree (`A-53`).
- `--draw 662 37 87 137 187` names `A-47-0015`/`A-47-0016` at 137 and nothing at 662 (`A-60`).
- `npm run served` reports SERVED for the changed pages after the push.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, and a live fetch of one changed page for its verdict line.
- Encounter: blind (`A-59`). An outside report arriving through a row's "looks wrong?" link would show in `npm run reports`, which is readable at n = 1.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json` (rendered into pages), `c/88a.html`, `c/11b.html`, `c/15a.html`, `c/1b.html`, `c/22a.html`, `c/4a.html` and every constant page carrying the ledger-wide sentence, `index.html`, `scripts/render-constant-pages.mjs`, `scripts/render-site.mjs` (if the refusal is wired there), `scripts/depth-audit.mjs`, `continuity/items.json`.

#### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none.** Read: `check-due-gates-dispositioned --snapshot` ("3 gate(s) due on/before 2026-10-01": `A-47`, `A-53`, `A-60`, and all three bear on the choice).
- (b) Owed child rows in the orchestrator's ledger: **none.** Read: the kickoff's "rows owed to you" read (0 of 739).
- (c) State reads marked CROSSED: **none.** Read: the kickoff state block. The fields that print a CROSSED marker carry none: stale-actionable 0 of 19, queued rows 0, and missingLinkedCommits NOTHING SWEPT (0 of 0, not a clean read).

### Findings (P3)

<!-- findings:begin -->
- **The index's read badge can sit beside a row nobody read** (instrument-facing, older than today; surfaced by the slice 11 review). The index badges a constant "read against its cited source" when ANY of its bound rows was read, and shows the constant's last-listed pinned row beside it. On 15a after slice 11, the badge sits beside 2.371177 [DEKMRSZAWB2026], which was never read: the reading was of the 2.371866 [DWZ2022] row. 88a and 22a show the same shape. The "tried" line was made to name its row on 2026-09-29 for exactly this misreading; the read badge never got that fix. Not fixed today. Candidate for the next product round, beside `A-53`'s walk candidates.
- **22a's 12.63 may be a truncation in the wrong direction** (record-facing, UNRESOLVED, not a defect finding). The arXiv preprint of [ACPR2011] gives 10_124 a ropelength of 71.0739, so 71.0739 / 10^{3/4} = 12.638925, while the row says 12.63, a bound the preprint's figure does not reach. The published Experimental Mathematics edition the entry cites was not read, so under the edition rule this is UNRESOLVED (`A-47-0053`). Settling it needs that edition's 10_124 table entry.
- **Slice 10 never got its paragraph in the store's sampling note**; added today, labelled as a day late.
- **Method sentences failed again, as predicted** (instrument-facing): the review refuted two of them. 1b's claimChecked labelled a post-reading clause as named before reading, and the sampling note credited slice 11's collision to a guard that did not exist at its draw. Both are fixed in `a41c707`. Separately, a false sentence about our own CI ("render-site --check runs in CI") was found in three places, one of which predates today.
<!-- findings:end -->

### Close

ACTION: COMPLETED · item A-47 · P3 5fed6e23 (the P3 bus msgId)

- **Acceptance condition met, with evidence.** All five pages show slice 11's verdict (live fetch, 17:59Z build). `node scripts/depth-audit.mjs` reads 53 audited, and the store's 44 drawn by position matches the ledger-wide sentence on c/4a.html. The refusal fires on a repository-path source and names the entry (`A-53`). The draw names `A-47-0015`/`A-47-0016` at 137 and nothing at 662 (`A-60`). `npm run served` read SERVED at `3c34147`.
- **Changed since the P3 post (5fed6e23):** CI on `d7f0858` went from pending to success (the orchestrator's review, bus 5d13b639). The review recorded the sequencing: the five verdicts first went public with `3c34147`, after round 2 said PUSH.
- **Ledger delta today:** `A-53` and `A-60` closed (`d7f0858`, each with closeReceipt2026_10_01). `A-47` got slice11Draw2026_10_01, slice11Result2026_10_01 and collisionRule2026_10_01, and was re-dated to 2026-10-03. `A-60` got positionRule2026_10_01. `A-61` and `A-62` were minted at this close.
- **Hygiene draft:** 0 lines (0 accepted · 0 amended · 0 rejected). It drafted nothing because the P1 packet listed no inputs. READ-MUTATED: none. check-wait-justification: "RESULT: PASS — 1 of 76 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". check-engineering-zero --project bounds-ledger: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".
- **Due gates:** `check-due-gates-dispositioned` (no flag) reads "snapshot CURRENT (taken 2026-10-01)" and "RESULT: PASS (exit 0)".
- **Pending reads:** `A-61`, the cross-family claims pass, at the next GREEN Codex probe and no later than 2026-10-03. `A-62`, the index read badge, by 2026-10-06. `A-59`, the encounter read, on 2026-10-28 or the first outside arrival. 22a's published edition, unscheduled; it is on `A-47-0053`'s notes.
- **Receipt:** P3's receipt line still holds; nothing new.