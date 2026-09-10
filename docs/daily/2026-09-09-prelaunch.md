---
product: bounds-ledger
date: 2026-09-09
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: e5ff23b
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 2
top_action_today: "You asked on 26 August where else this ledger could matter. You have the answer tonight and you already ruled on it: depth. The reasoning is that we track 115 quantities carrying 763 published bounds, 543 of which name the paper they came from, and we have checked exactly one of those against its source. That one check is the only thing this project has ever done that changed something outside it. Separately, the page had been answering the wrong question: someone asking what moved recently was shown what we started watching recently, on 97 of 115 rows. Fixed and live. Nothing needs you."
---
# Daily — bounds-ledger — 2026-09-09

## BLUF

David asked in August where else this ledger could matter, and tonight he ruled: read the 543 cited records we already hold, rather than reaching for a second subject area.

**FIRST ACTION.** Pull, then start the gate — three minutes of network, and a receipt on a stale tree says nothing.

```bash
git pull --ff-only
npm run verify > tmp/verify-out.txt 2>&1
```

**THE NUMBER THAT WILL LIE TO YOU.** `tmp/.verify-receipt.json` now shows `check:brief` with `resultVerdict: UNVERIFIABLE` where it showed `null` all week. A cold reader sees a new non-null value and reads it as a change in the world. It is not: the brief leg has been unverifiable since 2026-09-04 and still is. What changed is that the receipt can finally SAY so. The trap underneath is older and sharper — the receipt's `check:brief` leg and the banner's `node scripts/check-brief.mjs` are **different programs**, and reading A-41's reopen condition off the receipt cost five reads this morning before that was established.

**DON'T-TOUCH.** `check-brief-advisory.mjs`'s exclusion. It keys on the exit CODE, not on output text; it excludes exactly one code; its selftest asserts `gateCode` leaves every other exit code — zero, one, two and four — unchanged, so the exclusion cannot widen unnoticed; and a stale brief at exit 1 still reds the gate. That last clause is the whole point — the alarm that would mean something is still armed. Today's change added a line of output beside it and touched none of that.

## What changed

**David ruled DEPTH, and A-34 closed on the ruling** (`70d3917`). His words: *"Go with depth — start reading our own 543 records against their sources on a schedule, and bring me the second-area comparison when it is ready."* The proposal reached him on its fourth date, structured so the asymmetry between depth and breadth was stated as a premise he could overrule rather than as a conclusion reached after a survey. He did not overrule it, and he took the drafted reply verbatim — recorded as such, because a recommendation adopted unchanged is weaker evidence of independent assent than one argued down.

The evidence that turned a list of shapes into a ranking was measured, not asserted: **115 constant files carry 763 bound rows, 543 of which name their reference, citing 443 distinct references**, and we have audited one. Positive control that the count is over the right corpus — `87a.md` is present, contributes 7 rows of which 6 are cited, cites `HMR2019`, and contains the string `857.5662`. Precondition 5, whether anyone would be embarrassed to cite these wrong, was answered from inside the material: `87a.md`'s own text records that a 2026 paper quotes the record as "Martinet's constant C_2 <= 857.57".

Breadth was measured through one index and reported as a floor, not a score. Crossref `is-referenced-by-count`: the Ramsey dynamic survey 36, the paper behind our corrected record 4, its predecessor 21. The card told David plainly that Crossref counts only publisher-deposited references and undercuts mathematics badly, that all three are floors from a single index, and that Semantic Scholar and OpenAlex both refused that night — a transport failure is not evidence. The surviving citation read is promised to him for **2026-09-16** and minted as `A-48`; the scheduled reading is `A-47`.

**The survey control stopped answering the wrong question** (`fa4b407`). `data-changed` is the later of a row's two sides, and for a constant we added rather than watched through a move that date is the day WE started watching. So "Most recently updated first" ranked **18 rows we have actually seen move among 97 we have not**. The page already knew the difference — every cell renders a kind, and every row already displays "no movement seen yet" — and only the ordering ignored it. Nothing is hidden: never-moved rows follow, still present, still dated, still labelled.

**The adversarial review caught that fix being half a fix, before it was committed.** Grouping by movement left the original defect alive inside the group: a row joins it if either side changed, but its date was the newer of both, so a first pin on the other bound could still outrank a genuine movement. Fixed with a separate movement date that first pins never contribute to, kept as a new attribute rather than redefining a published one that A-42's own read command quotes.

**The verify receipt could not see the transition its own banner tells you to watch for** (`618226a`). `resultVerdicts["check:brief"]` was `null` on every run while `check:deferrals` filled its own with `PASS`. The fleet writer populates that slot from a `RESULT: <VERDICT> ... (exit N)` line, and this script printed none. It does now, reporting `UNVERIFIABLE` — deliberately not a pass token, because laundering an unverifiable into one is what A-41 refused.

**Two due gates had never been RUN, and running them broke both readers** (`90481bc`). `A-31`'s stored command could not be executed by the runner meant to execute it — the runner strips the `#` comment and the win32 shell mangles the quotes — and its first execution stamped a jq parse error onto the row as though it were the gate's reading. `A-39` is worse and is not anyone's bug: `git grep -c` exits 1 with no output when there are no matches, which is exactly what that row documents as its own answer, so a genuine read is indistinguishable from a failed spawn and the row will read NEVER-RUN however many times it is run. Deliberately not "fixed" by making it always emit output, which would trade a false NEVER-RUN for a read that cannot fail.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing** without exception — a primer banner that named a gate which was never due, a receipt blind to its own reopen condition, a gate command unrunnable by its runner, and a gate whose correct answer is unstampable — while the day's ship was a **product-facing improvement** and **no record moved** (`No drift. 116 files match upstream 9d57db8` — an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo).

**Consecutive instrument-facing days: 4.** Yesterday's report says 3 and I read that off it rather than recalling it. Written by hand; nothing counts this. Four days is the point at which the dry-week rule's blindness matters — it fires only on "no movements AND no findings", so this stretch reports "not dry" while every finding in it has been about our own machinery. That is precisely the situation David's depth ruling addresses, which is worth saying plainly rather than treating the timing as coincidence.

**Byte-only vs numeric:** `npm run catches` reports **0** movements for the current partial week, so nothing was counted either way today — neither a numeric move nor a byte-only one. The last completed week read **7**.

**The standing prediction, checked because a prediction never checked is decoration:** the registered claim is that the next record-facing catch will be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. **No record-facing catch arrived today, so the claim is neither confirmed nor refuted** — it stands unchanged. Note what did change around it: David has now funded exactly the activity the prediction describes, so the next test of it will come from work we are doing on purpose rather than by accident.

## Inputs (controllable)

- Seven commits pushed, all CI-green. `dd05d3e` — the daily traffic sample for W-6 — the read window for the README report-an-error channel. `618226a` — the receipt slot. `e8668a8` — the re-scoped read on G-4 — the Tier-0 goal that an outside party acts on a watched record without us filing the report. `fa4b407` — the survey control. `e5ff23b` — the record of the proposal sent for A-34 — David's question about where else this ledger can have impact. `70d3917` — his ruling, that row closed, and A-47 — the scheduled depth audit — plus A-48 — the second-area citation comparison — minted. `90481bc` — the reads for A-31 — whether the public page publish should be CI-gated — and A-39 — whether a mid-run rate limit should be retried.
- **Three dated gates dispositioned by READING them rather than by reasoning about them.** `A-34` closed on David's ruling. `A-31` and `A-39` were read and stamped; their dispositions are left for the manager's half of the P3→P4 boundary, which had not arrived.
- One David decision reached him and came back answered inside the same session — filed 03:39Z, ruled 04:18Z.
- **Gate discipline: four full `npm run verify` runs, each one owed.** Two were forced by ledger edits invalidating leg attribution, one by the dirty-tree rule refusing to let a receipt taken over uncommitted code back a green claim at a sha. None was a repeat of a question already answered.
- One adversarial review run pre-commit, returning a real finding that changed the shipped code.

## Outputs (lagging)

- **G-4 (Tier-0): 0.** `npm run reports` reconciles `29 + 0 + 0 = 29`, so the zero is measured rather than dead. Its 2026-09-26 read is now bound to detection health only and may draw no inference about product or interest from the arrival count; the 2026-11-06 outcome read still inherits a denominator that cannot fill, and re-pointing it remains David's.
- **Traffic: 1 unique viewer in the trailing 14 days**, day 33 since the public flip, 6 unique viewer-days total. Down from 2 at day 27, so the earlier projection of 8-10 by 09-26 was optimistic. Return-rate proxy INAPPLICABLE at n=1, below its N_min of 3.
- **Today's product ship is UNMEASURED, and is reported as such.** Delivery is verified — the live page returns the new attributes and the new control label. Whether a human used the reordered control is unknown: the published page carries no analytics by design, and the traffic figure measures repo views on github.com, never page readership.

## Recommendation

**Start the depth audit tomorrow, and let the first pass establish the rate rather than promising one.** `A-47` exists, David has ruled, and the population is known — 543 cited rows, one audited. What does not exist is any store recording what has been audited, which is why that row's own read command says plainly that no command answers it yet. The first session's job is to create that store and read a handful of rows against their sources, so the 2026-09-16 re-read has a real number instead of an intention. Resist the temptation to instrument this before doing any of it: a coverage dashboard over an audit nobody has started is the exact shape this lane keeps catching in other people's work.

## On hold pending data

- **G-2** (contribute a verified bound improvement to the stewarded inventory) — signal 2026-09-22.
- **W-3** (independent acknowledgement of the erdosproblems.com/36 correction) — signal 2026-09-24; the signal is someone else acting, so there is nothing to decide cold.

<!-- findings:begin -->
<!-- findings:end -->

## State Appendix

_Written last, from live commands, because a report cannot name the commit that lands it — every value below carries the command that produced it._

**Positive control: every zero in this report comes from a probe demonstrated to return non-empty.** The overdue-signal zero — the same comparator over the same 17-row read returned **3** due-today and **14** future, and the three partition the dated set exactly. The G-4 arrivals zero — `npm run reports` reconciles its parts against a raw total of **29**. The `npm run catches` zero — the same script's completed weeks read **4, 5, 3, 7**. The A-39 absence — the same command against the branch that has the retry prints a count at exit 0.

- **HEAD**: `90481bc` — `git -C . log -1 --format=%h%x20%s` → `90481bc Two due gates had never been RUN, and running them broke both readers`
- **Working tree / push state**: `git status --porcelain` → empty; `git rev-list --count origin/main..HEAD` → `0`, before this report's own commit
- **Gate**: `npm run verify` → exit **0** at `e5ff23b`, `failedGates []`, `contradictions []`, `dirtyAtStamp false`, at 2026-09-10T04:04:53Z. Commits after it changed only doc-shaped paths, so no further receipt is owed and no claim is made here about which leg is red at `90481bc`.
- **CI**: `node scripts/sky.mjs check-ci-status.mjs --repo . --workflow reverify.yml` → `GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending`
- **Publish**: `gh api repos/u00dxk2/bounds-ledger/pages/builds` → a build row for `e5ff23b`, status `built`, created 2026-09-10T04:04:03Z. `fa4b407` has no row of its own: a multi-commit push publishes only its tip.
- **Live page**: `fetch('https://u00dxk2.github.io/bounds-ledger/')` → HTTP **200**, 302460 bytes, carrying `data-moved="1"` ×18, `data-moved="0"` ×97, `data-moved-date` ×115, and the new control label. Positive control that it is our page: the same fetch contains the Bounds Ledger title.
- **Drift**: `node scripts/reverify.mjs --check` → `No drift. 116 files match upstream 9d57db8` (an upstream `teorth/optimizationproblems` sha; it does not resolve in this repo)
- **Claims**: `node scripts/check-claims.mjs` → `241 claim(s): 239 hold, 0 broken/unreachable, 2 unverified (manual)` — C-7 and C-9, UNVERIFIED by design
- **Page**: `node scripts/render-site.mjs --check` → `PASS — index.html matches committed state (115 constants @ 9d57db8)`
- **Ledger**: 61 rows — 40 closed, **21 open** — from a parse of `continuity/items.json`. Two rows minted today (`A-47`, `A-48`), one closed (`A-34`).
- **Traffic**: `npm run traffic` at 2026-09-10T03:28:46Z → 1 unique viewer / 191 unique cloners in the latest 14-day window
- **Catches**: `npm run catches` → `0` for the current partial week; last completed week `7`; `0 COMPLETED consecutive week(s) with none`; candidate-correction queue depth `0`
- **G-4 arrivals**: `npm run reports` → `parts reconcile: 29 + 0 + 0 = 29`
- **Deploy read**: `node scripts/sky.mjs check-deployed-sha-drift.mjs --service bounds-ledger` → exit 1, `no Render service matches "bounds-ledger" (52 services read)`. **NOTHING SWEPT** — a Pages lane with zero Render services; neither a stop nor a pass, and the 52-services read is the control that the sweep ran. The Pages build row above is this class's equivalent read.
- **Codex**: probe GREEN at 2026-09-10T02:08:10Z. One dispatch, **REFUSED at admission** — read-only filesystem, escalation disabled, no edit made. `node scripts/sky.mjs codex-health.mjs` → exit 2, 7 orphan pids, reported to the orchestrator by PID and deliberately untouched.
