---
product: bounds-ledger
date: 2026-08-22
lifecycle_stage: launched
north_star_metric: someone outside Skylark uses the ledger and acts on it (G-3; leading indicator = are all five detection paths live)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
last_deploy: 8469903
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today. The first big goal is finished: the ledger watched 111 mathematical records every day for thirty days without missing one, and a mathematician accepted a correction we sent. You already approved closing it, so we closed it rather than asking again. The new top goal is whether someone outside this company uses the ledger and acts on it, and it will read zero for months, which is expected and not a problem. Today a visitor gained a way to tell us we are wrong: every row on the public page now has a looks-wrong link that opens a pre-filled report naming that exact number. The honest note is that everything we caught today was a fault in our own tools rather than in the mathematics, the sixth day running, and one of those faults was a plan we had written down that turned out to describe work that did not exist."
---

# Daily report — bounds-ledger — 2026-08-22

## BLUF

**FIRST ACTION** — read the overnight drift verdict for the commit you actually have, then the primer:

```bash
cd C:/dev/skylark/bounds-ledger && npm run verify && node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

**THE NUMBER THAT WILL LIE TO YOU** — `north_star_value: 0` in this report's own frontmatter. It moved from 1 to 0 today and that is a **promotion, not a regression**: G-1 (the 30-day stewardship goal) closed at value 1, and G-3 (the new Tier-0 goal — someone outside Skylark uses the ledger and acts on it) legitimately reads zero and will for months. A cold reader who sees a headline metric fall to zero will look for the breakage. There is none. The distinguishing question is not "is it zero" but "could we DETECT a non-zero", and that is what `G-3.readCommand` answers in one command.

**DON'T-TOUCH** — the two `manual: true` pins on erdosproblems.com (C-7, the bound; C-9, the page's edit date). They report UNVERIFIED on every run and green on none. What makes them work is that they refuse to be automated: the site's 403 is IP-dependent, so a local HTTP 200 says nothing about CI — that was tried on 2026-07-25 and CI went red four minutes later. Today's local run again fetched 200 with both strings present and again changed nothing.

**G-1 — the goal this lane was founded on — is CLOSED**, on David's 2026-08-20 approval, executed rather than re-asked. Both legs met: the external acknowledgement since 2026-08-11, and day 30 of the armed-and-functioning streak today. The binding constraint did not move today and could not have: G-3 is one day old and reads zero by construction.

## What changed

- **G-1 closed** (`a0df316`). Leg (b) met since the 2026-08-11 merge of the upstream PR; leg (a) reached day 30 under the `streakDayRule` pre-registered on 2026-08-17. All five remaining scheduled runs reached a verdict: 08-18, 08-19, 08-20, 08-21 and today at 09:25:18Z, every one a success. **Stated limit:** `gh` returned exactly 200 rows, which is its `--limit` cap, so today's read directly confirms 2026-08-02 onward (21 consecutive days, no gaps); the 07-24 to 08-01 leg rests on the API read recorded in the item on 08-17. That is a 21-day read plus a citation, and calling it a 30-day read would be the rounding this lane exists to refuse.
- **The public page gained a per-row report path** (`1995839`). All 111 constants now carry a "looks wrong?" link opening a pre-filled issue naming that constant, its id and the mirror sha. Verified on the served page with the H1 as a positive control.
- **Two gates became machine-readable.** G-1 and G-3 gained `readCommand` fields; G-2 (the Tier-1 goal — contribute a verified bound improvement) gained one today with its new date. Zero such fields existed in this ledger this morning.
- **A-22 closed** (the bus linter that reads a filename beside a sha as a modification claim), on an orchestrator ruling that the current breadth is intended.

## Inputs (controllable)

- Four commits, all pushed, CI GREEN at each: `a0df316`, `1995839`, `8469903`, plus today's hygiene commit.
- `npm run verify` exit 0 at every commit cited here; 16 offline self-tests green.
- Steward cadence run in the ruled order — `npm run check` first, then the overnight log.
- The visitor path was run as its own cadence step: the served page fetched and checked, not assumed.

## Outputs (lagging)

- **Externally-acknowledged corrections: 1** (unchanged; the 2026-08-11 upstream merge). This was G-1's north star and is now historical.
- **G-3 reads 0** and is one day old. Not a measurement of failure; the read that matters is 2026-09-22 and it asks whether detection works, not whether an outsider arrived.
- **Arrivals: 4 unique viewers against 183 unique cloners** over the trailing 14 days, re-read today at 15:11Z. The clone figure is largely our own CI, which checks the repo out daily and on every push and pull request; the sampler deducts none of it. **The viewer count is the only arrival figure here that is not mostly us**, and the sampler itself calls viewer-days an upper bound.
- **Drift catches this week: 0 movements.** Under the 2026-08-14 amendment the zeros do not fire the adopt-a-second-surface rule alone — that needs no movements AND no findings, and today produced three findings.

## Recommendation

**Do nothing differently.** The rail worked: the product ship landed first, the substrate stayed inside its budget, and the day's largest defect was caught before it cost anything. The one item worth a decision is G-2's new signal date, which the lane set rather than David — it is flagged for overrule rather than presented as settled.

## On hold pending data

- **W-3** (the watch on acknowledgement of the erdosproblems.com correction email, sent 2026-07-24): reads 2026-09-24. Denominator is a single reply and can fill any day. **Deliberately not closed** on the upstream PR merge — that is a different channel.
- **W-6** (the read window on the report-an-error channel): reads 2026-11-06, re-pointed on 2026-08-20 from "100 unique visitors" to a qualitative first-contact read precisely because the old denominator could not fill by its date.

## State Appendix

- **HEAD** `8469903`, tree clean, CI GREEN, `origin/main` in sync.
- **Mirror**: 113 files at upstream `e70b4a4` (an upstream sha; it does not resolve in this repo).
- **Claims**: 233 total — 231 hold, 0 broken/unreachable, 2 UNVERIFIED (`C-7` and `C-9`, the two `manual: true` erdosproblems pins, correct by design).
- **Engineering zero-state**: 0 open Dependabot alerts, 0 open issues (pull requests excluded from the count — `gh` counts them as issues), 0 open pull requests, 0 open drift issues. No Sentry project exists for this lane because nothing here deploys. No waiver needed.
  **Positive control:** the identical issue query run with `--state all` returned 5 rows (closed `Drift:` and `Check error:` issues from 08-17 and 08-18), and a `--search "Drift:"` read returned 3 — so the issue reader works and today's zero is measured, not a dead probe. A search for the new `Row looks wrong:` prefix returned 0 against that same working reader.
- **The 403 cited in the BLUF** is erdosproblems.com refusing automated fetches from datacenter addresses while serving residential ones — the asymmetry that makes `C-7` and `C-9` permanently `manual: true`. Full account, including the day it was wrongly declared stale: `docs/findings/2026-07-25-the-403-that-wasnt.md`.
  **Positive control:** today's local advisory fetch of that same page returned HTTP 200 with both pinned strings present, which is what proves the 403 is IP-dependent rather than the page being gone — and it still moved no count.
- **Open items**: 16, of which 9 carry dated gates through 2026-11-06. Nearest: `W-7` (the watch on whether the instrument-audit proposal was ever tracked) on 08-24; `A-18` (the generated STATE block for the primer), `A-19` (two non-blocking review nits), `A-25` (deferral expiry fields) and `A-26` (author the evangelism-bar doc and record a loop archetype) on 08-25. `A-25`'s single re-date is spent — Monday it ships or closes as declined.
- **Findings classification** (`A-23`, the standing convention that each report labels its window's findings): all three of today's findings are **instrument-facing** — a gate naming no command, a written plan describing work that did not exist, and a false zero caught inside a command before it shipped. Sixth consecutive instrument-facing day; last record-facing catch 2026-08-14. The standing prediction is carried forward unchanged and remains uncontradicted: the next record-facing catch will be a witness-value mismatch on a constant upstream added within roughly 30 days, found by a human recomputing a cited certificate and flagged by no instrument we run. If one arrives through an alarm instead, that prediction was wrong and this report's successor says so.
