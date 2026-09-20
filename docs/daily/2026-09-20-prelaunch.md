---
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
---

# Daily report — bounds-ledger — 2026-09-20 (MT)

## BLUF

**FIRST ACTION (tomorrow, 2026-09-21):** read slice 6 of the depth audit on the constants mirror — `A-47`, the read David ruled on, whose `nextCheckDate` is tomorrow — at the slice positions recorded on that row, drawn on 2026-09-18 before any of them was opened. Tomorrow's full gate order is written once, in `docs/cold-starts/2026-09-21.md`, and this report deliberately does not restate it.

```bash
node scripts/depth-audit.mjs
```

**DON'T-TOUCH:** the hand-authored banner region in `docs/cold-starts/<date>.md`. It survives regeneration *and* it quotes rather than paraphrases, so a ruling cannot soften between close and arrival — today it is the only reason the "say the slip on the 20th, not the 21st" deadline reached a cold agent at all, and it beat the generated First-action block sitting directly beneath it, which arrived stamped `HANDOFF INCOMPLETE — governing action not authored`.

**The day in one line:** the second watched area's disclosure shipped as its own page and the table now leads with its numbers; David then ruled that the table gets rebuilt from the underlying papers as our own arrangement, with the page frozen as written until that happens; and phase 2's own slip condition fired and was said today with a replacement date, not on the 21st.

## What changed

- **`copying.html` shipped** (`334e49a`) — one linked page stating what the Ramsey table reproduces (72 entries of Table Ia printing 124 numbers, 50 upper bounds from Table Ib, with the reference key credited beside each), what else the repository keeps, what is not copied, that the survey carries no licence permitting republication and remains the authority, and how its author or the journal can ask for a change or removal. `ramsey.html` reordered so the jump links precede the note box, plus one sentence linking the disclosure.
- **The scope document was corrected rather than quietly amended.** `docs/decisions/2026-09-17-a54-adopt-small-ramsey-numbers.md:71` claimed the disclosure pass asks the copyright question "before anything is published". The table went public 2026-09-17; the pass shipped today. That sentence was false for three days and is struck and corrected in place.
- **David ruled at 16:59Z** (`988ca44`, recorded verbatim on `A-54` as `davidRuling2026_09_20`): rebuild the table from the underlying papers as our own arrangement, say so on the page, keep the credit to the survey, and leave the page as written until that is done. The page is untouched.
- **`A-54`'s phase-2 slip fired and was said today** (`30d5e02`). `expectedSignalBy` 2026-09-21 → **2026-09-22** for the Wikipedia comparator; `onTrigger` rewritten because it still named the superseded date and re-demanded shipped work. The catch-counter question is **decided, not re-dated**: state the blind spot in all four places a detection figure is printed; do not make the second area countable.

**Findings classification: every defect found today was instrument-facing, and consecutive instrument-facing days now stand at five.** Four defects: two adversarial-review findings in the disclosure page's description of ourselves (a denial that the repository stores any of the survey's bibliography, when the audit store holds five entries verbatim and one quotation of item 2.1.o; and "72 values" published where the table prints 124 numbers, understating the copied material by 52), one fabricated 40-character sha of my own making — `control: the same query re-run with the sha from git rev-parse HEAD returned two run rows, so the empty array came from the token I typed rather than from the API or a missing run` — and one instrument read against its own claim. None is record-facing: **no bound moved and no cited record was found wrong today.** On the counted figure — `npm run catches` reports 23 movements across 9 weeks with 1 completed consecutive week at none, and that is a **ceiling on catches rather than a count of them**; the current partial week reads 0, none of today's four appears in it, and it still cannot see the second watched area at all. Whether the counted movements were numeric or byte-only is not re-derived here: today added none either way. The standing prediction — that the next record-facing catch is a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run — is **unchanged, and today did nothing to test it**; the depth read that would test it is tomorrow's first action.

## Inputs (controllable)

- **`W-7` — the standing step that takes one instrument and asks whether its output could ever have said otherwise — fell today on `answered-cards.mjs`, and it found something.** Its default listing states that `open/todo-sent/waiting/pending-verify` cards "always" show. At 17:27Z, `--project bounds-ledger` returned exactly one card and did not include `5910378d`, which had been filed at 17:09Z; `--id 5910378d` returned `[open]` one minute later. So the read that the day's Blocked-on-David section depends on could have said "no open cards" while an open card existed. Rotated away from yesterday's `npm run upstream`.
- **Three adversarial rounds ran before the commit, not after**, and two returned real defects — both in sentences about ourselves rather than in any mathematical claim. Each was reproduced against the file before it was accepted: the bibliography claim by reading the five `surveyRefEntry` values, the count by recomputing 72 entries → 124 numbers from the committed table. Both figures are now rendered from the store and re-derived by `guardCopying`, so neither can drift.
- **`guardCopying` is a guard of its own**, because a new rendering path does not inherit the guards that already exist. Ten mutations, each shown firing with the page silent as rendered, and red-armed end to end: removing "acted on, not argued with" made the selftest exit 1 naming that property.
- **Gate discipline held.** `npm run verify` exit 0 with the receipt at the shipped commit; `render-ramsey --check` PASS on the committed pages after every guard change; the pre-commit sweep CLEAN on every commit.
- **Two guards refused me and were right.** The long-string guard blocked an `onTrigger` overwrite and printed the full before-value, which is how the clause I was dropping was checked as spent instead of lost unseen. The inline-body guard blocked a bus post carrying backticks in an inline `--body`, where the shell eats the span before node sees it.

## Outputs (lagging)

- **`G-4` (an outside party acts on a watched record without us filing the report): 0 arrivals** — `npm run reports`, 17:41Z. A measured zero, not a dead probe: 30 raw issues fetched, 30 classified as ours, 0 outside, and the parts reconcile to the raw total. Expected-zero; this is not "it has not happened", it is the count the only channel we have can see.
- **Record-listing movements: 23 across 9 weeks, 1 completed consecutive week at none; current partial week 0** — `npm run catches`, 17:40Z. Quote the per-week figure, never the total, and read it as a ceiling.
- **Candidate-correction queue depth: 1** (`A-51`, the dead-link correction in two mirrored files). A zero movement rate beside a non-zero queue is work found and blocked, not a quiet week.
- **The public pages serve today's wording** — `ramsey.html` HTTP 200, 90,746 bytes with the jump nav at byte 2451 ahead of the note box at 6137; `copying.html` HTTP 200, 5,404 bytes carrying "124 numbers"; both read unauthenticated at 16:22Z. At 390×844 the whole jump nav sits at 283–652px inside the 844px first screen.
- **Depth coverage is unchanged at 5 bounds read of the second area's 124 numbers.** No new reading landed today.

## Recommendation

**[A — user-visible] Tomorrow: read slice 6 of the constants-mirror depth audit (`A-47`), whose clock is tomorrow.** Its verdicts appear on the public page, so this is the reader-visible move. Yesterday's recommendation to do this was carried, not dropped — today went to the disclosure and the slip instead, both of which had dated obligations that expire today and could not be moved.

**[B] The Wikipedia comparator and the catch-counter blind-spot statement, both dated 2026-09-22 on `A-54`.** The comparator is the one remaining phase-2 deliverable carrying real build risk; the blind-spot statement is decided and owes only its four edits.

**[A — user-visible, blocked] The table rebuild David ruled on has no date and cannot get one** until card `5910378d` is answered — see below.

## On hold pending data

**Waiting on David: one live card, `5910378d`** — verified open at 17:28Z by `node ../skylark-site/scripts/answered-cards.mjs --project bounds-ledger --id 5910378d`, which returned `[open] decision 5910378d`. The question: rebuilding the Ramsey table from the underlying papers cannot cover every value, because two of the bounds read so far are credited to Boza's 2013 personal communication and no paper contains them at any budget, while another sits behind a Springer paywall with no abstract in any index. Every reading taken on this area, with its verdict, is listed in `continuity/depth-audit-ds1.json`. Is a partial table acceptable? **If it stays blocked,** the rebuild has no start date; nothing else stalls, and the page stays up as written, which is what he instructed.

**ANSWERED — appended 2026-09-20T18:02Z, after the section above was written and left standing with its own as-of.** David answered card `5910378d` at 17:44:52Z, nineteen minutes before this append and sixteen minutes before it surfaced here: *"Yes — ship the partial table. Independently source what you can, and mark anything you cannot as credited to the survey and not independently checked."* The paragraph above is kept as written because its 17:28Z as-of is what makes it legible rather than false. **What changes: the rebuild is unblocked and nothing in this lane is now waiting on David.** What does not change: the page freeze stands until the rebuild lands, the ruling carries no date, and tomorrow's step on it is scoping rather than building — recorded on `A-54.davidRuling2026_09_20_partialTable` and in tomorrow's primer banner.

**No freeze is in force.** No data-wait carries a denominator that must fill by a read date, so there is nothing to validate or lift.

## State Appendix

Written last, from live commands. Every line is as-of the moment its command ran and carries the command that re-reads it; **this appendix cannot name the commit that lands it**, because that commit is made after the writing.

- **HEAD**: `30d5e02` "A-54 P4: the slip fired, and it is said today with a date rather than on the 21st" — `git -C . log -1 --format=%h%x20%s`. `git rev-parse HEAD origin/main` returned that sha twice, so it is on origin.
- **CI**: **GREEN at `334e49a419ce2f23fb5e46c2f0cd5508a5b07981`** — `node scripts/sky.mjs check-ci-status.mjs --workflow reverify.yml` printed `GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending`, exit 0, read 16:29Z. **CI at `30d5e02` is NOT READ in this report** — that commit landed at 17:33Z and no run was read for it before writing. Clearing read: the same command from a checkout at `30d5e02`.
- **Gates**: `npm run verify` exit 0, receipt `{exitCode: 0, sha: 334e49a419ce2f23fb5e46c2f0cd5508a5b07981, at: 2026-09-20T16:20:09.008Z}`, `failedGates: []`. Now three doc-shaped commits behind HEAD (`988ca44`, `30d5e02` and the report commit touch `continuity/` and `docs/` only) — the documented carve-out.
- **Deploy**: a Pages build row exists for `30d5e02ecb78ffa50827661d3e1a38dc5fde4085`, status `built`, created 17:32:33Z — `gh api repos/u00dxk2/bounds-ledger/pages/builds`, read 17:42Z. The tip is live.
- **Deploy drift**: NOTHING SWEPT for this lane, which is neither a stop nor a pass — `node scripts/sky.mjs check-deployed-sha-drift.mjs` passed with 0 findings across 33 checksPass Render services and **none of those 33 is ours**; this lane publishes through GitHub Pages and declares no Render service.
- **Ledger**: 68 rows, 20 open, 48 closed — read 17:41Z over `continuity/items.json`.
- **Due gates**: `0 gate(s) due on/before 2026-09-20`, exit 0 — `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print`, re-read after the re-date, so the moved clock left nothing due today.
- **Stale-actionable**: `items: []` of `consideredCount: 20`, `ledgerState: READABLE`, 5 excluded as parked / waived / clock-declared — `cc-endpoint-probe.mjs --endpoints items-stale-actionable`, exit 0.
- **`A-45` misses: 0** — `node scripts/check-resolvability.mjs` read locally, 198 claims, exit 0. A floor; the count is the misses, never a ratio.
- **Engineering zero**: lane `bounds-ledger` 0 findings, 0 unreadable — `node ../skylark-site/scripts/check-engineering-zero.mjs --project bounds-ledger`, exit 0, read after the day's last push; open Dependabot alerts on this repo: 0.
- **Dead references**: 0 across 110 unique paths in 7 docs, plus 1 not-yet-due forward reference to this report — `node ../skylark-site/scripts/check-doc-references.mjs`, exit 0.
- **Second area**: `copying.html` is live and `ramsey.html` links it; both read 200 unauthenticated at 16:22Z by a `fetch` against the published URLs.
