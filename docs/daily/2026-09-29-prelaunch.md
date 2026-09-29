---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
product: bounds-ledger
date: 2026-09-29
lifecycle_stage: launched
---

# bounds-ledger — 2026-09-29 (prelaunch report)

## Selection packet (P1 — evidence and choice)

**Outcome:** five more cited records on the public constant pages are checked against the papers they cite, and the open question on 8a is either settled or its remaining routes are named. Item: `A-47` — the depth audit of the constants mirror (David-ruled 2026-09-09; the lane's interim yardstick since 2026-09-10).

**The user problem, in the user's words:** "Can I cite this number, and does the paper it names actually say it?" (`docs/evangelism-bar.md`: the reader is someone about to cite a bound).

**Evidence**
- OBSERVED — `npm run reports`, run at P1 today: "OUTSIDE ARRIVALS: 0" of 32 raw issues, parts reconcile 32 + 0 + 0 = 32. Population: GitHub issues on this repo · window: 52 days since the public flip · limits: blind to any reader who does not file.
- OBSERVED — `node scripts/depth-audit.mjs`, exit 0: "39 row(s) audited — 23 sound, 1 defective, 7 unresolved, 8 unreachable", unchanged since 2026-09-27. `--corpus`: "691 cited of 788 bound row(s)", and the stored denominator matches the live corpus.
- OBSERVED — 8a settle routes already walked (`A-47.settle8aAttempt2026_09_28`): the AMS page for RS1975 served a Cloudflare challenge (HTTP 403); Springer served the translation's abstract only (R = 9.65), with the body paywalled at USD 39.95.
- OBSERVED — this morning the Wayback Machine availability API answered HTTP 429 to both the RS1975 PDF query and the translation PDF query. Neither was retried; this is a route not yet walked, and slice 5 read a Springer body through an Internet Archive capture (A-47-0034's source line).
- MISSING — any read of who opens a constant page. The pages are static with no analytics, by standing decision; arrivals are the only encounter read.
- HYPOTHESIS — the standing prediction (CLAUDE.md): the next record-facing catch is a citation-quality defect found by a human reading a cited source in this audit.

**Permission:** `A-47` is open, not parked, not frozen, with no open card on it. It is standing work David ruled on 2026-09-09, and today is its due date (`nextCheckDate=2026-09-29`). Reading and recording is inside the lane's authority. Anything sent upstream is not: the outward gate applies (adversarial review plus David's explicit approval), and nothing today sends anything.

**Next action — kind: improve (deliver built value).** Slice 9 was drawn at P1 by `node scripts/depth-audit.mjs --draw 162 212 262 312 362`, exit 0, before any source was opened. The draw continues slice 8's offset-12 grid. Frame 691: 20b [K2023], 26a [DMP2019], 32a [FT23], 3b [B1999], 44a [CHS2020]. None of the five fingerprints is in `continuity/depth-audit.json` (grep count 0; positive control: 8a's row fingerprint `e69d94cf39be033e`, a sha256 of the mirrored row text and not a commit, counts 1). P3 re-derives the draw, commits and pushes it before any reading agent is dispatched, and then retries 8a first, as the primer orders. The 8a retry is a query to the Wayback Machine's availability API for the RS1975 PDF path at the AMS and for the translation's PDF at Springer. The first command: <!-- pragma: allowlist sha -->

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 162 212 262 312 362
```

**Acceptance condition:** `node scripts/depth-audit.mjs` prints 44 rows audited, with the five slice-9 fingerprints in the store, each verdict naming the edition read. The five constant pages (`c/20b.html`, `c/26a.html`, `c/32a.html`, `c/3b.html`, `c/44a.html`) carry their audit entries live. 8a either carries a verdict that names the edition read, or stays UNRESOLVED with today's routes recorded on `A-47-0036`.

**Delivery and encounter checks:** `npm run served` after the push (exit 0 = the pushed bytes are served), and `npm run reports` at the close. The event that would appear is an outside issue arriving through a row's "looks wrong?" link. At this traffic it is readable only at n = 1, and a zero is expected, not a verdict.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json`, `c/20b.html`, `c/26a.html`, `c/32a.html`, `c/3b.html`, `c/44a.html`, possibly `c/8a.html`, `index.html` (the audited count), `continuity/items.json`.

**Prior-day retro finding that bears on the choice:** the placeholder timestamp recurred on 2026-09-28 and is still on discipline. This packet states no clock time it did not read.

**HYGIENE INPUTS** (copied from the kickoff's reads)
- (a) Due rows not bearing on the choice, 2 of 3 due: `A-49` (tomorrow's-primer check; `expectedSignalBy` 2026-09-29, its last read was empty) and `W-13` (the standing call of the served-bytes check; due 2026-09-29, never run). `A-47` is selected and leaves this list.
- (b) Owed child rows: none. Read: "rows owed to you in skylark-site's ledger: 0 of 729".
- (c) State reads marked crossed: key numbers, no `docs/key-metrics.json` (0 of 1 file present); missingLinkedCommits, nothing swept (0 of 0 considered, so not judged). All other kickoff reads are within threshold: CI GREEN at `796ed7f`, 0 queued, 0 stale-actionable of 19, 0 answered cards.
