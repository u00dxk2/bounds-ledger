# Bounds Ledger

**A continuously re-verified ledger of mathematical records, which alarms when a cited record drifts.**

Best-known bounds, constants and certificates move. The papers, repositories and index pages that cite them do not all move at the same time — so a number you looked up last month may already be stale, and nothing tells you. This repo is the thing that tells you.

It is not a record-search engine. It does not try to find better bounds. It watches records that already exist, re-checks them on a schedule, and goes red when one moves.

## The problem, concretely

This repo opened on a real discrepancy: TTT-Discover ([arXiv:2601.16175](https://arxiv.org/abs/2601.16175)) reported the Erdős minimum-overlap constant as **0.380876**, while Tao's optimization-constants repository listed **0.380868**. Neither was wrong. They were *consecutive entries in a fast-moving record sequence*, and the surface that was actually stale was a third one — the widely-cited index page at erdosproblems.com/36.

That reconciliation is [`docs/reconciliations/2026-07-22-minimum-overlap.md`](docs/reconciliations/2026-07-22-minimum-overlap.md), and it is also this repo's method template: identify the surfaces, date each value, find which one stopped moving.

## What it has actually caught

Since the alarm was armed on 2026-07-24, four upstream drifts — each verified before the mirror was updated, against primary sources where a number moved and against upstream's own content where the change was editorial:

| Drift | What moved |
|---|---|
| [`50c8096`](../../commit/50c8096) | Editorial: a dead cross-link and a missing `C` in a LaTeX inequality. **Zero bounds moved** — and it still counted. |
| [`e856de9`](../../commit/e856de9) | Upstream added a constant (20 minutes after the previous drift). |
| [`60a044e`](../../commit/60a044e) | Certified record rows landed; a constant for a problem *solved* in 2026 was added. |
| [`da17be3`](../../commit/da17be3) | The first drift that was purely records moving: `5/3 → 7/√17`, `2.625622 → 2.6273856`, `>6.5143 → >6.5218`. Verified by recomputation before snapshot. |

It has also caught itself. [`docs/findings/`](docs/findings/) holds both kinds of write-up — the drifts above, and every occasion the *instrument* was the thing that was wrong. The worst of the second kind: **the drift alarm was green-by-construction for its first two days**, because a piped command in CI reported the pipe's exit code instead of the check's ([`2026-07-24-drift-alarm-was-never-armed.md`](docs/findings/2026-07-24-drift-alarm-was-never-armed.md)). A ledger whose alarm cannot fail is decoration; those findings are the evidence that this one can.

## Current state

Read 2026-08-11. Re-derive it yourself with `npm run check`.

- **112** mirrored files — 111 constant files plus upstream's repo-root `README.md` — byte-identical to upstream [`teorth/optimizationproblems`](https://github.com/teorth/optimizationproblems) at `400a9bb`. The README is in scope because it is where upstream declares which bounds it stands behind: a bound demoted to "verification at minimal levels" leaves every constants file unchanged.
- **231 claims — 229 hold, 0 broken, 2 UNVERIFIED by design** (see below)
- Checks run daily in CI (09:17 UTC), on push, and on demand

## Run it

No dependencies — Node stdlib and `fetch` only. `npm install` is a no-op.

```
npm test         # network-free self-tests (11)
npm run check    # LIVE: re-fetch upstream, diff the mirror, re-verify every claim
```

Individual checks: `scripts/reverify.mjs --check` (mirror diff), `scripts/check-claims.mjs` (cross-surface claims), `scripts/extract-pins.mjs` (regenerate generated pins).

## How it works

Two complementary checks, because either alone has a blind spot.

**1. Mirror diff** (`reverify.mjs`) — `ledger/teorth-optimizationproblems/` holds a byte-level copy of the adopted surface, with `manifest.json` pinning the upstream sha. Any change upstream trips it. This catches everything *inside* one repo and nothing outside it.

**2. Claim pins** (`check-claims.mjs`) — `ledger/claims.json` names, per claim, a source URL and the exact string that must still appear there, **across every surface the ledger cites**: the upstream repo at live HEAD, arXiv abstracts, Wikipedia, the community metadata database behind erdosproblems.com. Cross-surface divergence produced this lane's founding finding; a same-repo mirror diff would never have seen it.

Coverage is 11 hand-written claims plus 220 pins generated from the mirror — an upper- and a lower-bound pin for each of 110 constant files. The 111th, `1b.md`, is deliberately excluded from generation and hand-pinned as C-1/C-3 instead, so ledger coverage is complete.

## Four rules that are load-bearing

**A red run is the alarm working, not a bug.** Records are *supposed* to move. Re-snapshotting to silence a red run is the one thing that would make this repo worthless. The discipline is: verify against primary sources → `--snapshot` → regenerate pins → commit deliberately. Editorial drift gets the same treatment as numeric drift; the mirror's contract is byte-fidelity, not just "the numbers still look right".

*Rolling one back:* a `--snapshot` that blessed an upstream change you should not have accepted is reverted like any other commit — `git revert` it (mirror, `claims.json` and `manifest.json` move together in one commit), then re-run `scripts/extract-pins.mjs` and commit that too. Pins do not follow the mirror automatically in either direction, which is what makes both the forward and the backward step deliberate.

**An unverifiable claim reports UNVERIFIED, never green.** Two claims cite a page that serves HTTP 403 to datacenter IPs, so CI can never check them. They stay UNVERIFIED permanently and never count toward a pass. A run from a residential connection prints an *advisory* result that touches neither the counts nor the exit code. Two UNVERIFIED claims are not a gap in the ledger — they are the ledger declining to launder an unverifiable fact into a green.

**A generated pin asserts listing position, not "the record".** Each pins the last-listed row of a bounds table, verbatim. Numeric record-ranking is defeated by symbolic cells (`$K_{DR}+10^{-26}$`), negatives and O(·) asymptotics — a ranking prototype mis-picked three constants — and auto-asserting "record" would put unverified mathematical statements into our own ledger. Last-listed is true by construction; a newly appended record trips the mirror diff instead. Only hand claims say "record", because a human checked them.

**A high-churn surface does not get a whole-file alarm.** The community metadata database behind erdosproblems.com is pushed near-daily; mirroring it byte-for-byte would produce a permanently red alarm, which carries exactly as much information as a permanently green one. It is stewarded through pins on specific, stable entries instead.

## Status and limits, stated plainly

- **One correction has been sent upstream** (2026-07-24, by email, after an adversarial review that cut one claim). It has **not** been acknowledged. The metric this project judges itself by — externally-acknowledged corrections — is **0**.
- **Two adopted surfaces.** This is not a survey of mathematical records; it is a deep watch on a small, named set.
- **Known blind spot:** upstream's `README.md` is not mirrored, and it is where upstream states which records it stands behind — including records flagged as not yet peer-reviewed. The alarm is silent on that today.
- Bounds do not live in the metadata repository, so a bound correction can never be filed there. Its PR channel covers metadata only.

## One thing deliberately removed

This repository records an outward correction sent to the maintainer of another site in July 2026. That
person is not named here, and the text of the message is not reproduced — both were removed before this
repository was made public. They were private correspondence with someone who never asked to be written
about, and nothing in the mathematics depends on either.

What remains is the finding itself, which is about a *page*, not a person: a widely-cited index listed an
upper bound that later curated work had superseded. Where documents here discuss the wording of that
message, they describe its substance and what review changed, which is the part with any methodological
value.

Citations of published papers by that author elsewhere in this repository are ordinary scholarly
references in mirrored upstream content, and are untouched.

## Tell us this ledger is wrong

**Open an issue.** A pinned value that no longer matches its source, a claim whose citation does not
support it, a record we have listed as current that has since moved, a check that passes when it should
not — those are the reports worth the most here, and they are welcome without ceremony. Quote the claim
id (`C-3`, `pin:15a:U`) or the file, and say what you expect instead.

This project exists because widely-cited numbers go unchecked for months. A ledger that had no way to be
told it was wrong would be making the same mistake it was built to catch — and unlike the surfaces it
watches, this one is small enough that a single reader can check it.

For security reports specifically, see [`SECURITY.md`](SECURITY.md).
