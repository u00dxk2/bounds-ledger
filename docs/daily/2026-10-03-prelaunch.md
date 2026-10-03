---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-10-03
lifecycle_stage: launched
last_deploy: f2e545f (the last page-changing commit; npm run served read 1 of 1 served at 2026-10-03T15:55:19Z)
on_hold_items: 0
top_action_today: A-47 slice 12, five more cited rows read against their sources
# The four keys below have NO instrument in this lane and are left null rather than filled with a
# zero nobody measured: pre-revenue, no billing, no analytics on the published page, no Sentry project.
mrr_usd: null
n_active_users_28d: null
sentry_open_p1: null
sentry_open_p2: null
---

# bounds-ledger — 2026-10-03 (prelaunch report)

## BLUF

Written at the close. At P1 the day's choice is the scheduled reading of five more of our cited numbers against the papers they cite; the five were drawn before any paper was opened.

## What changed

Written at the close.

## Inputs (controllable)

Written at the close.

## Outputs (lagging)

- **`G-4` (an outside party acting on a watched record without us filing the report):** `npm run reports` at P1 read 0 outside arrivals of 32 raw issues, parts reconciling 32 + 0 + 0 = 32. It counts filed issues on github.com, never page readers.

## Recommendation

Written at the close.

## On hold pending data

Written at the close.

## State Appendix

### Selection packet (P1 — evidence and choice)

**Outcome:** five more cited rows of the constants ledger are read against the sources they cite, and each row's page says what the reading found. Item `A-47` (the depth audit David ruled on 2026-09-09: read our own cited records against their sources on a schedule), slice 12, due today on its own date.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." A citer who opens one of these five rows today is told only whether the row has moved. After the slice, the page also says whether anyone read the row against its cited source, and what that reading found.

#### Evidence

- OBSERVED — `check-due-gates-dispositioned --snapshot` (exit 0, taken once, this morning): "1 gate(s) due on/before 2026-10-03", the row `A-47`.
- OBSERVED — `check-due-gates-dispositioned --run A-47` (exit 0, stamped today): "RESULT: PASS — 53 audited, 33 sound, 2 defective, 11 unresolved, 7 unreachable (exit 0)", selection "44 drawn by position … 9 chosen because something already looked wrong", and "denominator check: the stored 691 cited rows match the live corpus at this read". The audited count has not moved since 2026-10-01, which is expected: 2026-10-02 was a census day.
- OBSERVED — the draw, `node scripts/depth-audit.mjs --draw 237 287 337 387 437` (exit 0, run at P1 before any source was opened): frame 691; "store: 0 of 5 drawn position(s) land on a row already held, read against 53 audit store entries". So the collision rule (`A-47.collisionRule2026_10_01`) has nothing to apply to, and the slice adds five new rows. The draw's output is pasted below.
- OBSERVED — `npm run verify`: receipt `exitCode` 0 at `f882d2a02e49a2944a9763f511d92adf4d686579`, stamped 2026-10-03T15:55:56Z. Its claims leg printed "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)." The brief leg read UNVERIFIABLE, which is excluded from the exit code and never a pass.
- OBSERVED — `npm run reports` (exit 0): 0 outside arrivals of 32 raw issues, parts reconcile 32 + 0 + 0 = 32.
- OBSERVED — `check-cycle-rotation --lane bounds-ledger` (exit 0): "no product-love cycle picks this lane today".
- OBSERVED — `answered-cards --project bounds-ledger`: "NO waiting/answered/pending-verify cards for bounds-ledger".
- MISSING — the evangelism bar's one metric. It is NOT MEASURABLE (the bar's own words): the page is static with no analytics and GitHub Pages gives no request log. The encounter read is `A-59`, dated 2026-10-28.
- MISSING — any read of a real person on these five pages.
- Prior-day retro findings, from the kickoff's quoted lines: none has recurred so far today. The one that bears on this work is the method sentence (four reviews refuted "the cited source was read" on 2026-10-01): each of today's five claims is named below before any reading, and the edition read is checked against the edition the row cites before any verdict other than UNRESOLVED or UNREACHABLE.

#### The draw (pasted from the command's output, not retyped)

```
frame: 691 cited bound row(s), file-then-line order — the same total the corpus counter reports over this directory, checked on this run rather than asserted

position 237 of 691 — 29a [KZ1873] (Known lower bounds)
  row:  ledger/teorth-optimizationproblems/constants/29a.md:49
  sha:  adfc91c311cca5cb  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

position 287 of 691 — 37a [P2021] (Known upper bounds)
  row:  ledger/teorth-optimizationproblems/constants/37a.md:47
  sha:  a670d0a724803fae  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

position 337 of 691 — 41a [Hammersley1968] (Known upper bounds)
  row:  ledger/teorth-optimizationproblems/constants/41a.md:13
  sha:  52aa23779c117235  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

position 387 of 691 — 46a [WW2022] (Known upper bounds)
  row:  ledger/teorth-optimizationproblems/constants/46a.md:25
  sha:  f5841da6c437ffd6  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

position 437 of 691 — 52a [KKKS1998] (Known upper bounds)
  row:  ledger/teorth-optimizationproblems/constants/52a.md:34
  sha:  71d439681161dc53  pragma: allowlist sha
  held: none — no audit store entry carries this fingerprint

store: 0 of 5 drawn position(s) land on a row already held, read against 53 audit store entries
RESULT: PASS — drew 5 position(s) from a frame of 691 (exit 0)
```

The `text:` lines are omitted here and kept in full on the ledger row. The five 16-hex values are depth audit row fingerprints (sha256 of the mirrored row text), not commits; the trailing `pragma: allowlist sha` on each is added for the commit guard and is not in the command's output.

#### Which claim each row makes, named before any reading

- 29a [KZ1873]: that Korkine and Zolotareff's 1873 paper contains the D5 lattice whose 40 minimal vectors give a kissing configuration of size 40 in dimension 5. The row's own quoted support says the construction is "implicit" in that paper, so the reading asks what the 1873 paper itself shows. The paper is in French.
- 37a [P2021]: that the cited arXiv paper proves bs(f) ≤ deg(f)² / (√10 − 2). The exponent 2 and the row's 0.8604 are arithmetic from that and are checked as arithmetic.
- 41a [Hammersley1968]: that Hammersley's 1968 article gives the upper bound 2√2 for the moving sofa area, at the place the reference names (Appendix IV, Problem 8, p. 84).
- 46a [WW2022]: that the cited arXiv paper proves the restriction estimate for p > 3 + 3/14. Whether it is stated for the sphere or for the paraboloid is recorded; the mirrored page's own remark covers that transfer and it is not re-proved here.
- 52a [KKKS1998]: that the cited 1998 paper proves the upper bound 4.602 on the random 3-SAT threshold.

#### Permission

- Lane-authorised and David-ruled: `A-47` is his 2026-09-09 ruling, "Go with depth — start reading our own 543 records against their sources on a schedule" (board card `2f90980a`, quoted from the row). No board card is open.
- `index.html` and the `c/` pages are not under the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html`.
- Outward gate: nothing beyond the ordinary Pages publish. The five readings are public sentences about other people's papers, so they get a review from the other model family before the readings are pushed. No author is contacted.

#### Next action

Kind: **deliver built value** (a scheduled read whose result readers see). The draw is committed and pushed first, before any source is opened. First command after the P3 go-ahead, on a clean tree:

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 237 287 337 387 437
```

It must print the same five fingerprints as above. Then the draw goes onto the `A-47` row, is committed and pushed, and only then are reading agents dispatched, under a brief that forbids sending identity to any service and names EuDML and GDZ for the two old journal papers.

#### Acceptance condition

`node scripts/depth-audit.mjs` exits 0 and prints 58 audited, with the four verdict counts summing to 58 and 49 drawn by position. Each of the five rows has a store entry carrying the drawn fingerprint, the edition read, and a positive control from the same fetch. Any row whose cited edition could not be read is UNRESOLVED or UNREACHABLE, never SOUND or DEFECTIVE. The five `c/` pages (29a, 37a, 41a, 46a, 52a) and the index show the readings, and `npm run check` passes after the commit.

#### Delivery and encounter checks

- Delivery: `npm run served` after the push, then one of the five `c/` pages opened on the live site.
- Encounter: blind (`A-59`). The event that would show it is an outside issue filed through a per-row link, counted by `npm run reports`, readable at N = 1.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json` (the audit store the pages render from), `continuity/items.json`, `index.html`, `c/29a.html`, `c/37a.html`, `c/41a.html`, `c/46a.html`, `c/52a.html`, and `c/4a.html` if its audit summary counts move. No script is expected to change.

#### HYGIENE INPUTS

- (a) due rows not bearing on the choice: none — read "dated gates due today: 1", and that one row (`A-47`) is the choice.
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 744 considered".
- (c) state reads marked CROSSED: none — read all the kickoff's state reads. Two could not be judged and are not zeros: missingLinkedCommits "NOTHING SWEPT (0 of 0 considered)", and key numbers "no list yet".

### Section 0

- Primer: `docs/cold-starts/2026-10-02.md` read whole; no file exists for 2026-10-03 until today's close writes it.
- Listener: 🟢 SSE alive (restart 2026-10-03T15:34:24Z, hello 15:34:27Z, slug bounds-ledger), wake loop armed by tool call, waker ranks 1 to 3 running.
- Codex: GREEN per the kickoff's probe line (real exec 2026-10-03T15:40:32Z). Not re-probed at P1.
- CI: GREEN at `f882d2a` (`check-ci-status --workflow reverify.yml`, exit 0). Drift: NOTHING SWEPT, this lane has no Render service and appears in none of the checker's blocks. The lane's own delivery read, `npm run served`, printed "1 checked — 1 served, 0 in flight, 0 stale, 0 unreachable" at anchor `f2e545f`.
- Harness: running 2.1.288 · fleet UNIFORM · installed 2.1.288 (SAME).
- Recs yesterday: `A-47` slice 12 → carrying today, P3. `A-54` census session 5 → carrying, dated 2026-10-04. `A-63` and `A-65` by 2026-10-06 → carrying, dated; not pulled forward. Marking the Mac and Ex16 cells at the 2026-10-18 render slot → carrying, dated.
