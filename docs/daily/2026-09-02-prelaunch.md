---
product: bounds-ledger
date: 2026-09-02
lifecycle_stage: launched
north_star_metric: an outside party acts on a watched record WITHOUT us filing the report (G-4; primary indicator = npm run reports, arrivals through the per-row links)
north_star_value: 0
north_star_status: expected-zero
north_star_classification: expected-zero
prior_north_star: G-3 (someone outside Skylark uses the ledger and acts on it) — CLOSED MET 2026-08-26 on David's ruling, value 2; copied from docs/daily-config.md, never from yesterday's report
last_deploy: 096e126
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 2
top_action_today: "Nothing needs you today, but one thing is waiting on you and it is now a week old. Back on 26 August you asked where else this ledger could have the kind of impact it just had. You are owed a ranked answer with real evidence behind it, and we do not have the evidence yet — so rather than send you a tidy-looking list that is really just guesswork, we have moved the date and said so plainly. It has now moved twice, and it should not move a third time. Meanwhile the public page gained something a reader can see: when WE were the ones who reported a row to the maintainers, the page now says so and links to exactly what we said. On one constant that sits right beside our own note that the file was merely re-worded, so a reader can see both facts and decide for themselves whether our report mattered. We deliberately do not tell them it did."
---

# Daily report — bounds-ledger — 2026-09-02

## BLUF

A row we reported on now says so on the public page, beside the verdict that called it a text edit.

A repair we delegated turned out to be a quiet downgrade of working code, caught only because its constants looked wrong.

**FIRST ACTION** — the declared block, five lines, from the repo root, one command per line.

```
node ../skylark-site/scripts/update-david-board.mjs --list --json --full-ids --project bounds-ledger
git rev-parse HEAD origin/main
git rev-list --count origin/main...HEAD
npm run verify > tmp/verify-out.txt 2>&1
node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml
```

Line 4 takes about three minutes because it goes to the network for everything: it re-fetches all 113 mirror files and re-checks all 233 claims against their cited sources. **Launch it FIRST, in the background, before reading anything** — it needs no context, its whole answer is a receipt keyed to a sha, and reading the primer ahead of it serialises a three-minute wait behind a six-thousand-token read. That reordering is today's one approved process change. Line 2 is written without `--short` on purpose: two revisions plus `--short` exits 128.

**THE NUMBER THAT WILL LIE TO YOU** — **the return-rate proxy reading `1.00`.** The misread is that it means *no data*, or that it is a default. It is a measurement: three distinct viewers, three viewer-days, so **nobody came back twice** in fourteen days. `1.00` is the floor of the scale and it is also a real answer. The second misread is scope, and it is welded to the figure in the output for that reason: these are **repo views on github.com**, not readers of the published page. The page has no analytics by design — `render-site.mjs`'s selftest actively enforces that it references no third-party asset and fetches nothing — so page readership is unmeasured and no figure here proxies it.

**DON'T-TOUCH** — **the practice of diffing a delegated change against the branch it was supposed to fix, rather than against the tree it was written on.** It is not a script and it should not become one. It works because it asks a question no gate asks: *is this the code the review actually read?* Today that question was the only thing standing between us and shipping a retry no reviewer has seen, under a commit message describing the reviewed one.

**Findings classification, one sentence of human judgment:** today's findings are **instrument-facing, all four of them** — a return-rate instrument that refused its own first reading, a `readCommand` whose obvious form read the working tree and answered a committed-state question wrongly, a delegated repair that silently regressed reviewed code, and a self-attributed cause that shipped with a control clause incapable of failing — **and none is record-facing, because no bound moved anywhere today.** `npm run catches` reads **0 for the current partial week** (the last completed week, 2026-08-24, read 3), so there is no counted catch today to classify as numeric or byte-only; the distinction is stated anyway because a future reader will meet a non-zero here and needs to know the counter cannot tell a moved number from a changed backslash. **Consecutive instrument-facing days: 6.** That count is written by hand and is not a counter, which is the point of it. **The standing prediction, restated because a prediction never checked is decoration:** the next record-facing catch will be a witness-value mismatch on a constant upstream added within ~30 days, found by a human recomputing a cited certificate and by no instrument we run. It has held once (20 August). If the next one arrives via an alarm instead, say so and correct the claim.

## What changed

- **A row we filed an upstream report against now discloses it** (`4c2fd97`, live-verified). Every public-page row we reported upstream links that report and its state. On `87a` the page now reads `text edited 2026-08-23 — bound unchanged` directly above `we reported this row · closed 2026-08-23`. **That juxtaposition is `A-33`'s finding — the watch on our own outward artifacts being invisible to the drift classifier — handed to the reader instead of to us.** The classifier answered *did a number move* correctly and had no way to ask *is this a file we reported against*; a human seeing both lines can ask it in a second.
- **It asserts no cause, deliberately and permanently.** `A-33` leg 2 as designed labels a movement in a mapped file `CANDIDATE CAUSAL EVENT`. On a public page that publishes a judgment about causation, which the item's own note forbids in terms. The page says in words that it is not a claim that anything upstream changed because of us, and a selftest pins that the emitted markup carries no causal wording — proven by a mutation that put "caused by our report" in the aria-label alone, where the label-equality assertion cannot see it.
- **A return-rate instrument, and it refused its own first reading** (`b51a705`). `returnRate()` divides unique viewer-days by the window-deduplicated head-count GitHub reports for the same fourteen days. Its first live run printed `NOT READY` rather than `0.67 days per viewer` — a ratio that is arithmetically impossible, since viewer-days can never be fewer than viewers. **The cause was an off-by-one of mine:** the window boundary was *computed* as today-minus-13, which starts 2026-08-20 and excludes the 2026-08-19 bucket holding the third viewer. It now *reads* the boundary from the response's own first bucket, because GitHub is the only authority on which days its rollup covers. After the fix the two figures reconcile exactly, and that exact reconciliation is the positive control that they measure one window rather than two that happen to agree.
- **`AGENTS.md` reconciled to per PUSH** (`b51a705`), from our own 09-01 measurement: Pages builds once per push, a multi-commit push publishes only its tip. Paid for inside the same line to stay under the 60,000-byte fleet budget, measured three times during the edit and landing at 59,998.
- **`A-39` filed** (`096e126`) — the A-20 review's F3, moved out of a rollup living in another repo into a dated row here.

## Inputs (controllable)

- **Three commits, all pushed**: `b51a705`, `4c2fd97`, `096e126`. `npm run verify` exit 0 at `4c2fd97`; the two commits since are doc-shaped, so that receipt still covers HEAD.
- **Both dated gates dispositioned, and neither was closed.** `A-33` — the watch on reported-against files — is partially discharged and re-dated to 09-05: its trigger asked for leg 1, the transition poller, which is *not built*, and saying otherwise would have been the easy lie. What shipped instead is the reader-facing half plus `ledger/upstream-reports.json`, which is exactly the recorded baseline leg 1 needs in order to fire on a transition rather than on the permanent fact that issue 150 is closed.
- **`A-34` — David's own question about where else this ledger can have impact — fired with no card minted, and that is the row's instruction rather than a slip.** Its trigger says that if the research is not done, say so plainly and give a date rather than send a thinner version, because a ranked list with no citation-footprint evidence is a brainstorm wearing a ranking. It is not done.
- **Three Codex dispatches, two of them lost to a sandbox limit.** Dispatches 1 and 2 died on `Permission denied` under `.git/`; dispatch 3 ran with git forbidden and its write probe succeeded. Settled: Codex can edit files in this repo and cannot write anything under `.git/`. Delegate the edit, keep the commit.

## Outputs (lagging)

- **`G-4` — the goal that an outside party acts on a watched record without us filing the report — reads 0 arrivals against 3 unique viewers over fourteen days.** Measured, not assumed: 26 issues fetched, all 26 attributed to us, parts reconcile to 26 + 0 + 0. The pre-committed threshold says a zero carries product information only at **30 or more unique viewers**; at 3 it says nothing about the product and everything about reach.
- **Return rate: 1.00 days present per viewer**, 2026-08-19 to today, three viewer-days over three distinct viewers. Nobody returned. Repo views, not page readers.
- **`npm run catches`: 0 for the current partial week**; the last completed week read 3.

## Recommendation

**Do not let `A-34` move a third time.** David asked on 26 August; it is seven days old and this is its second re-date. The blocker is real — nobody has established any candidate surface's citation footprint, and a surface nobody cites produces no impact however wrong it is — but at some point *the research is not done* stops being a reason and becomes the finding.

**And the row itself argues the question may be the wrong one.** Its own note observes that G-3's instance was not found by the drift alarm at all: the alarm catches upstream *changing* and is structurally blind to upstream being *wrong and staying wrong*, because a row that never moves never fires anything. `87a` was caught by a human reading a record row against the paper it cites. We mirror 111 constants carrying citations and have applied that check to almost none of them. **Breadth versus depth is the real choice, and sending David only a list of candidate surfaces would silently answer it for him.**

## On hold pending data

- **`A-20` — the retry-with-backoff question — F1 and F2 unshipped; the branch is untouched at `8a4c2b8`.** F1 stays blocking: a main-module guard that exits 0 with no output through a junction path is a check that cannot fail. No merge without it.
- **`A-29` — the secret-scanning validity-checks row — escalation 09-08**, likely a paid feature and therefore a spend decision rather than an engineering one.

## State Appendix

Written last, from live commands run at 2026-09-02T16:25Z. Every value here is a snapshot; the release command sits beside it because a hand-written state line is stale the moment it is committed — and this report cannot name the commit that lands it.

- **HEAD**: `096e126` at write time — release: `git -C . log -1 --format=%h%x20%s`. The commit carrying this report is necessarily *later* than that and is not knowable from inside the file.
- **Working tree**: clean but for `continuity/items.json` (this pass's linked-commit attaches) — release: `git -C . status --porcelain`
- **CI**: GREEN for `81ffb9c` when read at 14:29Z — release: `node ../skylark-site/scripts/check-ci-status.mjs --workflow reverify.yml`
- **Gate**: `npm run verify` exit 0, receipt at `4c2fd97c02f0b41ff998af22ebdc6453fce59443`, written 15:49:28Z — release: `npm run verify > tmp/verify-out.txt 2>&1`
- **Mirror**: no drift, 113 files at upstream `3a14910` — an upstream `teorth/optimizationproblems` sha, so `git cat-file -t 3a14910` here answers `fatal: Not a valid object name` at exit 128. **positive control**: the same command on `096e126` prints `commit` at exit 0, so the tool does resolve objects that exist and the failure is about provenance, not a broken read — release: `node scripts/reverify.mjs --check`
- **A trap worth not re-deriving**: `git rev-parse --short HEAD origin/main` also exits **128**. Two revisions plus `--short` is a usage error, not a repo problem — drop `--short` and it works. Same exit code as the line above, different cause.
- **Claims**: 233 total, 231 hold, 0 broken or unreachable, 2 unverified by design (`C-7` and `C-9`, both `manual: true` on a source that blocks datacenter IPs) — release: `node scripts/check-claims.mjs`
- **Ledger**: 17 open rows of 52 — release: `node ../skylark-site/scripts/check-due-gates-dispositioned.mjs --print`
- **Continuity endpoints**: all three 200 — `items-stale-actionable`, `upcoming-triggers`, `auto-decidable-items`. Three auto-decidable rows, all tier LOW; `A-7` triggers in about 8 hours.
- **Sizes**: `CLAUDE.md` 44,966 · loaded 59,998 against the ruled 60,000 — release: `node ../skylark-site/scripts/check-claude-md-sizes.mjs --project bounds-ledger`

<!-- findings:begin -->
<!-- findings:end -->
