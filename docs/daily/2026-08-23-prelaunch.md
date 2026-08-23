---
product: bounds-ledger
date: 2026-08-23
lifecycle_stage: launched
north_star_metric: someone outside Skylark uses the ledger and acts on it (G-3; leading indicator = every detection path in G-3.readCommand is live)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
last_deploy: 137255f
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. The public ledger page got two changes a visitor can actually see. It can now be sorted so the ten records that have genuinely moved come to the top, instead of asking someone to read all 111 rows. And a search that finds nothing now explains itself - it says whether we have simply never tracked that constant, or whether it might be filed under a name you did not use, and it offers a one-click way to tell us what you were after. That last part matters more than it sounds: someone who searches, finds nothing and leaves is invisible to us, while someone who tells us is the only kind of evidence we can actually see about whether outsiders use this. We also caught our own traffic tool printing a number that had stopped being true three days ago, and fixed it."
---

# Daily report — bounds-ledger — 2026-08-23

## BLUF

**FIRST ACTION**

```bash
cd C:/dev/skylark/bounds-ledger && git rev-parse HEAD origin/main && npm run verify && node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

Ran clean this morning and again at close: exit 0, receipt written, mirror in sync at 113 files. It is `git rev-parse HEAD origin/main`, **not** `--short` — `--short` takes one revision, fails fatally, and its leading position in an `&&` chain silently skips the rest.

**THE NUMBER THAT WILL LIE TO YOU**

**The 111 dates on the public page.** 208 of 222 pins carry `2026-07-24` — the day the ledger first pinned them, not a day anything moved. A cold reader sees a dated row and reads *"this record was current as of that date."* It means only *"our pinned text last changed then,"* bounded by our snapshot cadence. Ten rows carry a later date; those are the ones that have actually moved.

**DON'T-TOUCH**

**The pre-commit inline-corruption guard.** It refused a piped `npm run verify` from me twice today, unprompted — the shape that made this lane's alarm fake for its first two days, because the pipe's exit code wins and a real failure reads as green. It works because it refuses at *write* time and names the fix in the refusal. Its second refusal caught the phrase inside a quoted heredoc, which is over-broad and still the right trade: a false refusal costs a retry, a false green costs a day.

---

**The binding constraint did not move, and it was not expected to.** G-3 (the Tier-0 goal that someone outside Skylark uses the ledger and acts on it) reads **0**. Instrument read: `G-3.readCommand` executed verbatim from file, **exit 0** — every detection path live. Zero is expected here for months; the 09-22 read asks *could we detect an outsider*, not *has one arrived*. Every section below references this verdict rather than re-deriving it.

**Two user-visible changes shipped and both are verified live on the served page**, with a positive control on the page H1 before any absence was asserted: 111 sort keys, the ordering control, the empty state and its report route all present at `https://u00dxk2.github.io/bounds-ledger/`.

## What changed

**Ordering control** (`2f9ff5d`) — rows publish the later of their two pin dates as a sort key; a native select offers *most recently updated first* beside the existing filter. **The planned ship was a "changed in the last 90 days" filter and the premise check killed it**: 208 of 222 pins share the bootstrap date, so 90 days back reaches past all of them and the filter would have matched all 111 rows — a control that looks like it narrows and does not. A sort has no threshold to justify or re-tune.

**Empty state** (`9208ff3`, `0698ab3`) — a search matching nothing now says which kind of miss it is (we have never looked, versus a name you did not use) and offers a report link **prefilled with the search term**. This is the day's most consequential change and the reason is not usability: it manufactures a countable observable where none existed. A visitor who searches, misses and leaves is invisible to every instrument we have.

**Three corrections to our own machinery**, each found by a check doing its job rather than by inspection:
- `123dd12` — the dry-week rule read `docs/findings/`, which the classification stopped flowing into on 08-19 while the reports kept classifying. Read literally it would have called a busy fortnight dry, and that leg exists precisely to stop a zero movement count firing a surface change alone. Pointed at an empty directory it agrees instead of dissenting.
- `137255f` — `W-6` (the read window for the report-an-error channel) had its visitor threshold retired on 08-20, and the traffic sampler kept printing it on **every run for three days**, including the run twenty minutes before I found it. A printed line naming an item id reads as authoritative without being traced back.
- `c45091c` — the alarm-title test failed once and would not reproduce in ten runs. Filed, **not diagnosed**.

**Six detection paths, not five** — `G-3.readCommand` gained the `Constant not tracked:` search and a positive control on the served page, because today's ship created an arrival signal the goal's own read command could not see.

<!-- findings:begin -->
### Findings appended after the report was drafted

- **A test that identifies its subject by POSITION breaks when anything is inserted above it.** The hostile-name test matched the first `issues/new` href on the page; the empty-state link now sits above the table. Fixed by matching on the prefilled title. Locate a test's subject by identity, never by ordinal.
- **The stub DOM cannot prove what the injection assertion appears to prove** (`0698ab3`). Swapping `textContent` for `innerHTML` fails the test because the stub then never writes `textContent`, not because it parsed markup. Evidence the code still assigns text; not proof a browser is safe.

- **LATE, AND IT CHANGES THIS REPORT'S CLASSIFICATION — a real drift landed at close (`8a4192a`).** The close-battery gate went red on five upstream files, **two of them genuine record movements**: `15a` (matrix multiplication exponent) `2.371339 → 2.371177`, verified on the arXiv abstract page which carries both figures with the paper title and "AlphaEvolve" as positive controls; and `3a` (Gyarmati–Hennecart–Ruzsa) `1.1835129324 → 1.19102809`, verified through the GitHub API — upstream PR #146 merged, authored by `kleinwaks`, title matching the claim, cited proof repository live. Resolved through the documented cycle: verify against primary sources, then `npm run resnap`, then commit. Mirror now at upstream `b1a28ac`.
- **The listing-position rule paid for itself on a live case.** `81a`'s upper-bound pin moved from `2.288513 [PT2018]` to `2.1594 [D2025]` — but the new last-listed row is **conditional on the Generalised Riemann Hypothesis** and is not comparable with the unconditional rows above it. Upstream restructured the table specifically to say so. Because our generated pins assert **listing position and never "the record"**, this ledger does not now publish an improved unconditional bound on Brun's constant that nobody has proved. That rule has been defended on principle for a month; today was the first time it was load-bearing.
- **`87a`'s rows were corrected too** — the `[HMR2019]` example is a *degree-12* field, not degree-8. That is the same file and the same class of defect this lane recorded on 2026-08-14. Whether our note caused the fix cannot be established from here, so it is not claimed.
<!-- findings:end -->

## Inputs (controllable)

- **Nine commits**, all linked to items; `continuity-check` ends at `status: OK`, zero WARN.
- **Gates:** `npm run verify` exit 0 at HEAD, 16 of 16 self-tests, CI GREEN at `137255f`.
- **Detectors added:** six negative controls across two ships (control removed, date taken from the earlier side, undated sorted first, id order left re-sorted, empty state never revealed, term set as markup) — every one proven to land with `git diff --numstat` before its run, every one silent on the restored tree.
- **The cross-family review returned CLEAN** on `cdd97d5..b6a5ecf`; its sandbox could not run `npm test`, so I ran that leg and attached the receipt.

## Outputs (lagging)

- **G-3: 0.** See the BLUF verdict.
- **Arrivals:** 3 unique viewers in the trailing 14-day window; 5 unique viewer-days since the flip, stated by the sampler as an **upper bound**, never an estimate. **178 unique cloners in the same window is not an audience** — our own CI checks the repo out daily, on every push and every PR, and today had six pushes.
- **Tier-1 catches indicator:** 8 movements on distinct pins across 5 weeks; the current week is 0 and partial, which is never counted. **Zero completed consecutive dry weeks**, so the adopt-a-second-surface signal is not firing.
- **Engineering zero-state:** 0 open issues (filtered on `.pull_request == null`, read twice for the documented ~10s lag), 0 open PRs, 0 Dependabot alerts. No Sentry project — nothing is deployed.

## Recommendation

**Watch for the first `Constant not tracked:` issue and treat its arrival as a lane event, not a weekly line.** It is a row that cannot exist today, so N=1 is unambiguous rather than noise against a baseline — and it is one of the exactly-four outside-arrival signals G-3's (the Tier-0 outside-use goal) detection ceiling says are reachable.

**Do not read today's three self-corrections as a healthy machine finding faults.** Every one was a *rule pointing at the wrong place* — a directory the findings had left, a threshold that had been retired, a read command blind to a path we had just built. That is a distinct class from a bug, and its signature is that all the individual parts look correct.

## On hold pending data

- **`W-3`** (the watch for acknowledgement of the erdosproblems.com correction email) — 09-24. Unreplied since 24 July. Deliberately not closed by the upstream PR merge; different channel.
- **`W-6`** (the read window for the report-an-error channel) — 11-06, re-pointed to a qualitative n=1 read after its denominator was shown unable to fill.

## State Appendix

- **HEAD** `137255f` · CI GREEN · tree clean · `npm run verify` exit 0.
- positive control: every absence claimed in this report was preceded by a read that returned something, because an absence proves nothing until the check is shown able to return a result. The served-page fetch returned 155,582 bytes carrying the page H1 before any element was asserted present. The findings directory listed 28 files before I said none carried a date later than 08-19. `git cat-file -t 137255f` prints `commit` in this repo, which is what makes the upstream sha's refusal below meaningful rather than a broken command.
- **Mirror:** 113 files at upstream `e70b4a4` (an upstream sha; it does not resolve in this repo). 233 claims — 231 hold, 2 UNVERIFIED (`C-7` and `C-9`, the `manual: true` erdosproblems pins, correct by design).
- **Items:** 39 total, 19 open. Nearest gates **08-24** — `A-2` (the standing drift-resolution log) and `W-7` (whether the 08-15 instrument-audit proposal was ever tracked); then four on **08-25** — `A-18` (a generated STATE block for the primer), `A-19` (two non-blocking review nits), `A-25` (give deferrals an expiry field and a check that reads it) and `A-26` (author the evangelism-bar doc). **`A-25` has spent its single re-date: Monday it ships or closes as declined.**
- **New watches today:** `W-9` (does this lane's detection method find what the lane exists to find) and `W-10` (the alarm-title test that failed once), both read 09-22.
- **Findings classification for this window — RECONCILED at close, and the earlier reading is retracted.** Through P5 this window was **instrument-facing, a seventh consecutive day**, and this line said so. **A real drift then landed at close** (`8a4192a`) carrying two verified record movements, so the honest classification for the day is **record-facing**, and the instrument-facing streak ends at six. **What that does NOT do is resolve the standing prediction, and the distinction matters:** the prediction claims the next record-facing *catch* will be a **witness-value mismatch** — a defect in a cited certificate — found by a human and flagged by no instrument we run. What arrived is upstream legitimately **moving its own records**, caught by the mirror diff exactly as designed. A movement is not a defect. The prediction is therefore **neither confirmed nor refuted** and is carried forward unchanged; the last record-facing *catch* in the prediction's sense remains 2026-08-14. `W-9` (the clock on whether this lane's detection method finds what the lane exists to find) now has a first data point on the other side of the ledger: the instruments do find movements, reliably and the same day. The standing prediction is **carried forward unchanged and still uncontradicted**: the next record-facing catch will be a witness-value mismatch on a constant upstream added within roughly 30 days, found by a human recomputing a cited certificate and flagged by no instrument we run. Nothing today moved it either way. `W-9` now puts a clock on the question that seven such days raise.
