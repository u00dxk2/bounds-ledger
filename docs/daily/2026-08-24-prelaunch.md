---
product: bounds-ledger
date: 2026-08-24
lifecycle_stage: launched
north_star_metric: someone outside Skylark uses the ledger and acts on it (G-3; leading indicator = every detection path in G-3.readCommand is live)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
last_deploy: bcb9b52
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. The public ledger page used to say 'last changed' for three completely different things - a number that actually moved, someone tidying the text around a number that did not move, and a row that has never changed since the day we started watching it. It now says which one happened, in plain words, on every row. That matters more than it sounds: 208 of our 222 tracked rows carry the date we started watching them, and the old wording made every one of those look like something had just happened. This morning's alarm is what proved it needed fixing - it fired for real, we checked it against the original source, and the answer was that someone had fixed formatting, not that a record had moved. We also found that an announcement we drafted eleven days ago has quietly gone out of date, so we booked a date to refresh it rather than send it stale."
---

# Daily report — bounds-ledger — 2026-08-24

## BLUF

**FIRST ACTION**

```bash
git rev-parse HEAD origin/main && npm run verify > tmp/verify-out.txt 2>&1; echo "EXIT=$?"
```

Run this morning in exactly this shape and it earned its keep: the overnight scheduled run had gone **red at 09:30Z** and filed issue #29, and nothing in the day's kickoff mentioned it. The gate found it in the first ninety seconds. Run it from the repo root with NO leading `cd`: a `cd X && ...` compound cannot be statically resolved by the permission classifier, so it parks at a silent approval prompt that reads as a hang. Note the redirect too — piping the gate into a pager is refused by the pre-commit guard, correctly, because the pipe's exit code would be the pager's. Both halves verified by running this exact line at close: exit 0, two identical shas. It is `git rev-parse HEAD origin/main`, **not** `--short`, which takes one revision and fails fatally with `fatal: Needed a single revision` — its leading position in an && chain then skips the whole cadence.

**THE NUMBER THAT WILL LIE TO YOU**

**The `2` that `npm run catches` reports for this week.** It is real — `pin:53a:L` and `pin:56a:U` both changed — and **no number moved in either.** Upstream escaped a backslash inside inline math; a pin is a byte comparison of a whole table row, so a backslash moves it. A cold reader sees "2 catches this week" and reads *two records moved*. The counter is honest by construction and says so in its own output; the seam is any report or bus line that quotes the bare figure. That is what today's new classification clause closes.

**DON'T-TOUCH**

**`npm run verify` first, unpiped, with its exit code read directly.** It is the only channel that reported this morning's four-and-a-half-hour-old red. What makes it work is the part that looks like friction: it refuses to be piped and prints its own TRUE exit code with a line telling you a zero read anywhere else came from a pipe. This lane's founding defect was an alarm reporting a pipe's exit status for two days.

---

**The binding constraint did not move, and it was not expected to.** G-3 (the Tier-0 goal that someone outside Skylark uses the ledger and acts on it) reads **0**. Instrument read: `G-3.readCommand` executed verbatim, **exit 0** — every detection path live, served page reachable with both report routes present. Every section below references this verdict rather than re-deriving it.

**Today's findings are instrument-facing, and both of this week's counted catches were byte-only rather than numeric.** Six commits, no defect found in the mathematics. Upstream's escaping sweep was real drift and correctly alarmed, but a formatting fix is not a record moving. The last record-facing catch remains **2026-08-14**. **The standing prediction carries forward unchanged and is still uncontradicted:** the next record-facing catch will be a witness-value mismatch on a constant upstream added within about a month, found by a human recomputing a cited certificate and flagged by no instrument we run. If one arrives through an alarm instead, that prediction was wrong — say so.

## What changed

**The public page now says what actually happened to each row** (`a7bf5ff`). Three labels replace one: `value changed` · `text edited — bound unchanged` · `first pinned — unchanged since`. Live distribution over 222 pins: **208 first-pinned, 8 value changed, 6 text edited.** The third label retires the misreading yesterday's report named as the first thing that would mislead a reader — 208 rows carried the bootstrap date and read as though something had happened that day. It cost one extra branch, because the comparison that separates value from text also detects "there was no previous version".

The comparison is confined to the **bound cell**, deliberately. Comparing whole rows would have called `87a`'s degree-8-to-degree-12 citation correction a moved bound; it reads `text`, and an assertion pins that case so a future widening fails a test rather than a reader. `value changed` asserts only that the numerals differ — not that a bound improved, not which row is the record.

**The eleventh drift cycle, resolved and closed** (`f5b5589`). The scheduled run went red at **09:30Z** and the session opened at 13:56Z, so the alarm stood unread for four and a half hours — the cadence working at its designed resolution, not a miss. Upstream `5c4aeee` (an upstream sha; it does not resolve in this repo) escaped markdown-active characters inside inline math on six constants pages. Verified against upstream's own commit before snapshotting: additions and deletions balanced per file, so no row was added or removed, with `7/64=0.109375` and `1.1835129324` byte-identical on both sides as positive controls.

**W-7 (the watch on the instrument-audit proposal that expired silently) was DECIDED and closed** (`ee3bb44`) — shipped as a cadence step, not a script, because a detector that audits detectors owes the same question it asks. Its first run found two things the same session, and a third by end of day.

**Read commands for tomorrow's gates** — A-18, A-19, A-25 and A-26, whose subjects are named under Recommendation (`892c25b`), each run before being written down, **two rewritten because they lied** — see Inputs.

**A-28 filed** (`bcb9b52`) — the arrival move that has waited eleven days with no board card and whose figures went stale while waiting.

## Inputs (controllable)

**The instrument-audit step earned its place on day one.** Three findings, none of which any assertion we run could have made:

1. **A word-form probe reports a missing feature as PRESENT precisely because it is absent and being discussed.** A bare word count for the deferral-expiry field returns 1 — the hit is A-25's own note describing the field it is asking for. A loose recursive match for the loop-archetype key matches two files, both A-26's own title and its generated line. Both read commands switched to the quoted key form, returning 0, with the signal-date key returning 23 recorded in the item as the positive control that the probe can see a real key.
2. **A-2's `nextCheckDateNote` called 2026-08-24 "the next Sunday".** It is a Monday, as was the 08-17 pass the field cites — the same weekday-label slip corrected in the 08-23 primer, sitting in the field whose only job is dating the cadence. Corrected with the old wording quoted so the change is legible.
3. **A read command was flagged as a dead reference by our own checker** because it named the evangelism-bar doc path — the file whose absence it exists to detect. Reshaped to search a directory listing instead; positive control: the same listing form returns `key-user-flows.md` for a file that does exist. The probe changed rather than the checker: a permanently-red checker is this lane's founding defect.

**Two of my own P1 claims were wrong and are retracted.** There is no auto-close in `reverify.yml`; issue #29 was closed by the `Closes #29` keyword in my own commit, and the close event names the resolving commit. And `index.html` does not embed the README drift count — `render-site.mjs` opens exactly `ledger/claims.json` and the mirror manifest. The real mechanism is sharper: row dates come from a pickaxe search over **committed** history, so `resnap` renders before the new `claims.json` is committed and the page publishes `date unknown` for exactly the rows that just moved — while their `data-changed` sort key still holds the old date. Label and sort key disagreed, and the sort key is what the Order control reads. Both corrections are in the AGENTS.md `resnap` entry.

**A-23's classification sentence gained its numeric-vs-byte-only clause**, which is what stops this week's `2` travelling unqualified.

## Outputs (lagging)

- **G-3** (Tier-0: someone outside Skylark uses the ledger and acts on it): **0**, expected-zero, all detection paths live.
- **W-6** (the read window on the README report-an-error channel): **zero unsolicited outside contact**, and the zero is a measurement rather than a dead probe. Every issue this repo has ever had: 23 from the Actions bot, 2 from the repo owner. Positive control: the same query returns 25 issues in total, so the channel demonstrably can receive them and this zero is a measurement rather than a dead probe. The honest wording stays *no contact yet*, never *nobody had anything to say*.
- **Traffic**: 3 unique viewers against 180 unique cloners in the trailing 14 days; 5 unique viewer-days since the repo went public on 2026-08-08, an upper bound rather than an estimate. The clones are largely our own CI, which checks out on a daily schedule and on every push and PR — six pushes today.
- **`npm run catches`**: 2 this partial week, both byte-only. Last completed week was 5.

## Recommendation

**Tomorrow is a four-gate day and the constraint is space, not time.** A-18 (a generated STATE block for the primer), A-19 (two review nits), A-25 (deferral expiry field) and A-26 (the evangelism-bar doc this repo lacks) all come due, each now carrying a read command that answers its own question in one line. **CLAUDE.md sits at 44,660 bytes against a 45,000 warn threshold — 340 bytes of headroom** (read from `check-claude-md-sizes.mjs` against the unit ruling in `docs/size-budgets.md` — UTF-8 bytes, LF-normalized via `measureDocSize`; never self-counted), and four gates each wanting a line will breach it. Do the compression as scoped work at the start, not as a squeeze at the end of a gate write-up; done badly it cuts the load-bearing sentences.

## On hold pending data

- **W-3** — the watch for acknowledgement of the erdosproblems.com/36 correction David sent 24 July. Read today rather than recalled: C-9's pin on the page's `last edited 23 January 2026` string still holds and C-7's bound pin still reads `0.380876`, both fetched from this machine at HTTP 200 and both UNVERIFIED in CI by design. No maintainer touch. Signal date 2026-09-24.
- **W-6** — first unsolicited outside contact, qualitative n=1, no visitor threshold. Read above. Window to 2026-11-06.

Both are Tier B: aging on a signal that has not arrived, with a named date. Neither is a decision waiting to be made.

## State Appendix

- **HEAD** `bcb9b52`, in sync with origin, **CI GREEN** at that commit. `npm run verify` exit 0; `continuity-check` exit 0; dead-reference check **0 across 66 paths in 5 docs**.
- **Mirror** 113 files at upstream `5c4aeee`. **233 claims**: 231 hold, 2 UNVERIFIED (`C-7` and `C-9`, the `manual: true` erdosproblems pins, correct by design).
- **Items: 40 total, 18 open.** W-7 (the instrument-audit routing watch) closed as SHIPPED. A-28 (the stale, uncarded arrival move) opened, dated 2026-08-31. Four gates due 2026-08-25.
- **Engineering zero:** 0 open issues, 0 open PRs, 0 Dependabot alerts. No Sentry project — nothing deploys, which is structural here and not a sweep anyone performed. `check-instrument-liveness` exits 2 with "0 feeds examined"; that is swept-nothing, not clean.
- **Board:** 95 cards across 18 projects, **bounds-ledger among none of them**. Positive control: a filter for "skylark" returns 8 cards, so the search matches and the zero is a reading rather than a broken query. Nothing owed to David.
- **CLAUDE.md** 44,660 bytes against the 45,000 warn threshold — measured by `node ../skylark-site/scripts/check-claude-md-sizes.mjs`, which is the canonical measurer (UTF-8 bytes, LF-normalized, per `docs/size-budgets.md`); never self-counted.
