---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-27
lifecycle_stage: launched
last_deploy: 9649491 (the last page-changing commit; `npm run served` read 25 of 25 changed files served as committed at 2026-09-27T16:53:03Z)
on_hold_items: 0
top_action_today: depth-audit slice 8 on the public constant pages (four rows sound, 8a unresolved) and the stale 673 denominator corrected to 691
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-09-27 (prelaunch report)

## BLUF

Five more constants on the public site now say whether their cited paper supports the page, and four do.

The fifth, 8a (the zero-free region constant), stays unsettled: the cited paper's original proves 9.65 where the page credits it with 9.64591. The coverage sentence on 20 pages had gone stale at 673 and now reads 691.

## What changed

- **`A-47` slice 8 (the depth audit, which reads our cited rows against their sources) landed** in `9649491`, after the draw was pushed in `3de22ae` before any source was opened. 84b, 10a, 13b and 19a are SOUND. 8a is UNRESOLVED.
- **The denominator on the public pages is fixed.** 673 became 691 on 20 constant pages. `depth-audit.mjs` now warns when the stored figure and the live one differ.
- **Ledger:**
  - `A-47` (the depth audit) re-dated to 2026-09-29, with the 8a settle-step and tomorrow's encounter read on the row.
  - `A-45` (the stale-value resolvability indicator) re-dated to 2026-10-04 instead of closed; the reason is in its notes.
- **Findings classification, one sentence of human judgment:** today's findings are mixed. The record-facing ones are the 8a attribution lead, plus two small entry-level notes seen while reading (13b's "Open PDF" link answers automated fetches with a challenge, and 10a's upper-bound row states a weaker constant and a strict "<" where the source proves "≤"). The instrument-facing ones are the stale denominator and a crash path in my own new check.
  - **Numeric or byte-only: neither.** Nothing was counted by the drift alarm.
  - **Consecutive instrument-facing days: 0**, counted by hand. Today had record-facing findings.
  - **The standing prediction, quoted from CLAUDE.md:** "the next record-facing catch will be a citation-quality defect in a mirrored upstream entry … found by a human reading the cited source in the depth audit (`A-47`), not by any alarm." Today NEITHER HELD NOR FALSIFIED IT. The 8a lead is exactly that shape, but it is UNRESOLVED, so it is not yet a catch.

## Inputs (controllable)

- Five sources read through five background reading agents. Every quotation stored was checked by this session against the saved text or page images.
- Two Codex adversarial reviews. They found three defects, all fixed before the push.
- One hygiene helper, whose draft was applied at the close.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report), measured by `npm run reports` at about 15:44Z:** 0 outside arrivals of 32 issues. The parts sum: 32 + 0 + 0. By the rule of three that is a 95% upper bound of about 3/32 on the outside share of issues. It says nothing about readers who never file.
- **Reach of today's change:** unknown. The pages are static and carry no analytics.

## Recommendation

- 2026-09-28: the `A-54` census session (the second watched area's depth reads), and slice 8's encounter read (`npm run reports`) first.
- 2026-09-29: `A-47` slice 9, and settle 8a through Rosser–Schoenfeld 1975 or the cited translation before anything is filed.

## On hold pending data

- **8a's credit:** a lead until the cited edition or RS1975 is read.
- **Encounter:** no read exists beyond the filed-report count.

## State Appendix

### Selection packet (P1, bus msgId 9c0a79e9 at 2026-09-27T15:44:35Z)

[P1 — Evidence and choice]

**Outcome:** `A-47` (the depth audit — reading our own cited records against their sources), slice 8: five more cited rows read against the papers they cite, with verdicts shown on the public constant pages.

**The user problem, in the user's words** (`docs/evangelism-bar.md` lines 20–21, verbatim): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (Corrected at P3 after the manager review: the P1 draft quoted a paraphrase as if it were the user's words.) The depth audit is the "has anybody looked" half of that sentence, because it reads a row against its source.

**Evidence**
- OBSERVED — `npm run reports` (G-4 — an outside party acting on a watched record without us filing the report) · every issue on the public repo · 50 days since the public flip · run 2026-09-27 ~15:44Z: 32 issues fetched, 32 ours, 0 outside, 0 outside arrivals; the three parts add up to 32 + 0 + 0 = 32. Limit: it counts filed issues, not people who read a row and acted without filing.
- OBSERVED — `node scripts/depth-audit.mjs`, run live this morning at exit 0, first line literal: "depth audit (A-47): 34 row(s) audited — 19 sound, 1 defective, 6 unresolved, 8 unreachable". The 1 defective is 46a, settled yesterday (`412cd1d`). Limit: 25 rows were drawn by position and 9 were chosen for suspicion, and they are counted apart; none of it is a random-sample rate.
- OBSERVED, a defect on the public pages that this slice fixes — the same run's denominator line claims "COMPUTED, not remembered", then prints the STORED 673 of 770 from `meta.corpus` (measuredAt 2026-09-11), while `--corpus` computes 691 of 788 today. 22 public pages (21 constant pages and `index.html`, which says it twice) carry "against 673 rows that name a source, counted on 2026-09-11". The date is on the page, so the sentence is not false, but it is stale by 18 rows. The fix: refresh `meta.corpus` from `--corpus` in the landing commit, so every audited page re-renders against 691.
- OBSERVED — `node scripts/depth-audit.mjs --corpus`, exit 0 this morning: "691 cited of 788 bound row(s)". The frame moved from 673 because of the upstream burst resolved in `ce5a57c`.
- OBSERVED — candidate draw (NOT committed, prep only): `node scripts/depth-audit.mjs --draw 625 675 12 62 112`, exit 0, frame 691. Rows: 84b [BSSZ2026] (upper), 8a [S1970] (upper), 10a [SLXCKKM26] (lower, 6π/11), 13b [Elek1994] (lower), 19a [She2011] (upper). None of the five row fingerprints is already in `continuity/depth-audit.json` (grepped; no match).
- HYPOTHESIS — reader reach for the audit verdicts on the constant pages. MISSING: the page is static with no analytics, so no read exists (`docs/evangelism-bar.md` § metric: NOT MEASURABLE).
- MISSING — a product-love rotation verdict: `check-cycle-rotation.mjs --lane bounds-ledger` exit 2, UNDETERMINED ("no journey-walk artifact on record … the registry does not declare which lanes owe one"). This is not "nothing due".

**Choice of positions (settled before any source is opened).** 625 and 675 finish the offset-25 grid that slices 5–7 laid down; with those, every position of the form 50k+25 up to the frame's end has been drawn. 12, 62 and 112 start the next grid, offset 12 from the 50-grid, going upward. **Caveat, recorded here so it is not rediscovered:** the frame grew by 18 rows, so earlier slices' positions no longer point at the same rows in the 691 frame. The stored fingerprints still tie each verdict to its row. What drifted is the position grid, not the verdicts, and the sampling rule has to say so when slice 8 lands.

**Permission:** A-47 is standing work David ruled on 2026-09-09 and made the interim yardstick on 2026-09-10. No card is open on it, and the row is not parked or frozen. Nothing is sent outward: every defect found is recorded, not filed, and anything upstream goes through the outward gate.

**Next action — kind: improve (deliver built value: more rows read, shown on the public pages).** First command, at P3 start. It commits the draw onto the row and pushes it before any source is opened:

```bash
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 625 675 12 62 112
```

**Acceptance condition:** `node scripts/depth-audit.mjs` prints a count five higher than the pre-slice store, and its four verdict counts add up to the row count. The draw commit is on `origin/main` before any reading agent is dispatched. `render-site --check` and `npm run check` pass after the landing commit and the second render. `npm run served` reports SERVED for the changed constant pages.

**Delivery and encounter checks:** delivery is `npm run served` after the push, and the page rows can be read with `playwright-cli`. Encounter: the event that would show a reader used it is an outside arrival through a row's "looks wrong?" link, counted by `npm run reports`. It is readable at N=1; today's baseline is 0 of 32.

**USER-FACING: yes** — paths: `continuity/items.json` (draw and landing notes), `continuity/depth-audit.json` (verdict store and its `meta.corpus` denominator, both rendered publicly), `c/*.html` (the pages for 84b, 8a, 10a, 13b and 19a, plus the 21 constant pages whose denominator sentence re-renders), `index.html`.

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice — 1 of 2 due: `A-45` (the stale-value resolvability indicator). Read today through the gate: "RESULT: 209 of 209 resolvable (100.0%)", exit 0, stamped to `continuity/read-outputs/A-45.txt`. Its next date needs setting.
- (b) Owed child rows: none — read `show-item --index` of skylark-site's ledger in the kickoff: 0 of 724.
- (c) State reads marked CROSSED or not judged, from the kickoff: dated gates due 2 of 74 (A-45 above; A-47 is the choice). Prior-day retro: 2 of 2 findings still on discipline. Key numbers: no `docs/key-metrics.json` yet (0 of 1 files). missingLinkedCommits: NOTHING SWEPT, 0 of 0 considered, so not judged.

<!-- findings:begin -->
**P3 findings (2026-09-27):**
- **Slice 8 landed: 5 rows, 4 SOUND, 1 UNRESOLVED.** 84b, 10a, 13b and 19a are SOUND. 8a [S1970] was first stored DEFECTIVE. The adversarial review downgraded it to UNRESOLVED before the commit, because the edition our entry cites, the English translation, was never opened. That is the 46a mistake of 2026-09-24 repeated: a wanted finding is where the reading path gets skipped. What is established: Stechkin 1970, read in the Russian original, proves R = 9.65 and computes nothing finer, and Mossinghoff–Trudgian list 9.64591 under Rosser–Schoenfeld 1975, which our reference list carries and no row cites. That is a strong lead that the credit is wrong; the bound itself is true. It would confirm the standing prediction in CLAUDE.md (a record-facing catch of citation quality, found by a human reading in the depth audit), but only once it is settled. Recorded, not filed.
- **The review's second finding was a real crash path in my new code.** The CLI's live-corpus read could throw on an unreadable mirror file before the audit summary printed. The read now goes through `liveCorpus()`, which never throws and returns a NOT RUN refusal instead. Red-armed on a copy with the catch removed: 2 cases FAIL, exit 2. The mutation was proven to land only on the second attempt, because the first plain-string replace silently no-opped on CRLF. That is the known trap, caught here by checking `mutated=` before trusting a PASS.
- **The review's hypothesis 2 was right, and slightly wider than stated.** `denominatorProvenance`, the slice-2 clause of `samplingRule` and `partitionControl` all carried 673 as a present-tense figure, and all three are now updated. The 20 per-row notes that say "position N of 673" are left as they are: each is true as of its own draw, and slice 8's rule now says positions are not comparable across the frame move.
- **My P1 count of affected pages was wrong: it was 20 constant pages, not 22.** I grepped for the bare token `673`. Two of the 22 files it matched, `index.html` and `c/59a.html`, carry 673 only inside other numbers (for example `3067398171` in a 59a formula), and they still match after the fix. The sentence-scoped literal `673 rows` would have been the right positive control. The manager review repeated my 22, so the figure reached the bus twice. Corrected here and in `A-47.slice8Landed2026_09_27`. After the render, `691 rows` appears on 24 pages: those 20 plus the four newly audited pages (84b, 8a, 13b and 19a).
- **The review's suggestion 3 shipped.** `depth-audit.mjs` now compares the stored denominator with the live corpus on every read. It fired on the live store before the refresh and is silent after it. The self-test grew from 27 to 36 cases (32 at first, 36 after the review's crash-path fix), and they exercise the check through `run()` itself, so what is tested is the wiring, not only the helper.
<!-- findings:end -->

**Section 0:** `npm run verify` exit 0 at `34beb5c` (receipt `tmp/.verify-receipt.json`, 15:43:45Z; `check:brief` UNVERIFIABLE because this shell has no `CC_PROMPTS_PIN`, and the gate treats that as passing). CI `check-ci-status --workflow reverify.yml` GREEN at `34beb5c` (exit 0). Deploy drift: this Pages lane has no checksPass service, so the read found nothing to sweep, which is neither a stop nor a pass (fleet exit 0). Harness: running 2.1.283 · fleet UNIFORM · installed 2.1.283 (SAME). Listener up and loop armed. Codex probe GREEN from the kickoff line. Yesterday's recommendations: the one rec (`A-47` slice 8 on 2026-09-27) is carrying to today's P3.

### Close

ACTION: COMPLETED · item A-47 · P3 b9570518 (the P3 task-complete's bus msgId)

COMPLETED against the acceptance condition the P1 review left standing:
- 39 audited (`node scripts/depth-audit.mjs`, exit 0);
- the draw `3de22ae` pushed at 16:01:27Z, before the first fetch at 16:04Z;
- `npm run served` at 16:53:03Z read 25 of 25 SERVED at `9649491`;
- `check-ci-status --workflow reverify.yml` GREEN on `9649491`.

The manager review (bus `36b88e83`) confirmed COMPLETED.

**State changed since the P3 post:** none to the product. The P3 receipt still holds, and no new one is posted.

**Hygiene draft:** 1 line — 0 accepted · 1 amended · 0 rejected.
- `A-45`: AMENDED from close to `--extend A-45 --new-target 2026-10-04`. Closing retires the only scheduled run of the floor, its guard line has no other home, and note3's 14-day condition is not met.
- READ-MUTATED, quoted: `READ-MUTATED A-45 scripts/depth-audit.mjs — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks`. It is my own P3 edit: HEAD `3de22ae` did not move, and `check-resolvability.mjs` does not write that file.
- check-wait-justification: "RESULT: PASS — 1 of 74 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
- check-engineering-zero --project bounds-ledger: "RESULT: PASS — lane bounds-ledger: 0 findings, 0 unreadable (exit 0)".

**Ledger delta:**
- `A-47`: `nextCheckDate` 2026-09-27 → 2026-09-29, `nextCheckDateNote` replaced. New fields: `slice8Draw2026_09_27`, `slice8Landed2026_09_27`, `settle8a2026_09_27`, `encounterRead2026_09_28`. `--run A-47` stamped "RESULT: PASS — 39 audited, 23 sound, 1 defective, 7 unresolved, 8 unreachable (exit 0)".
- `A-45`: `expectedSignalBy` 2026-09-27 → 2026-10-04, with the reason appended to its notes.
- `continuity/depth-audit.json`: A-47-0035 to A-47-0039 added, and `meta.corpus` set to 691 / 788 / 97.

**Due-gate verify:** `check-due-gates-dispositioned.mjs` (no flag), exit 0: "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-09-27)" and "RESULT: PASS (exit 0)".

**Pending reads:**
- slice 8's encounter read (`npm run reports`), 2026-09-28;
- `A-47` slice 9 and the 8a settle-step, 2026-09-29;
- `A-45` floor, 2026-10-04.

**As of this writing (not the commit that lands this report, which cannot name itself):**
- HEAD `9649491` (`git rev-parse HEAD`);
- CI GREEN on it (`node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml`);
- `npm run verify` receipt exit 0 at `9649491`.

Re-run these three, never trust these values.
Positive controls for the zeros above:
- positive control: `Grep` for `RS1975` over `ledger/teorth-optimizationproblems/constants/8a.md` returned its reference entry at line 43, so the search that found no row citing it was reading the right file.
- positive control: the same fleet `check-deployed-sha-drift.mjs` run swept 33 checksPass services, so "nothing to sweep" is a fact about this Pages lane, not a dead probe.
- positive control: the same `check-engineering-zero` run reported RED findings for other lanes (agentic-dir and buddha-ur, 2 Sentry each), so this lane's "0 findings" came from a probe that can return non-zero.