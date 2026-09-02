# Bounds Ledger

**A continuously re-verified ledger of mathematical records, which alarms when a cited record drifts.**

Best-known bounds, constants and certificates move. The papers, repositories and index pages that cite them do not all move at the same time — so a number you looked up last month may already be stale, and nothing tells you. This repo is the thing that tells you.

It is not a record-search engine. It does not try to find better bounds. It watches records that already exist, re-checks them on a schedule, and goes red when one moves.

## One catch, verbatim

On **2026-08-02** the alarm went red on the [Fourier Entropy-Influence constant](ledger/teorth-optimizationproblems/constants/71a.md). Upstream had replaced its record: a certificate on 17 variables superseded by one on 18. This is the actual diff our mirror produced, copied out of the commit rather than retyped, so the spacing marks inside it are upstream's own LaTeX —

```diff
-C_{71}\ >\ 6.514326913930565372,
+C_{71}\ >\ 6.521845710923046575,
```

— from [`da17be3`](../../commit/da17be3), the first drift here that was purely records moving. Two other constants moved in the same cycle. Each was verified against the primary source **before** the mirror was updated, because a red alarm is the signal working, not a bug to be silenced.

If you had cited `6.5143…` the week before, nothing would have told you. That is the whole product, and everything below is detail.

## The problem, concretely

This repo opened on a real discrepancy: TTT-Discover ([arXiv:2601.16175](https://arxiv.org/abs/2601.16175)) reported the Erdős minimum-overlap constant as **0.380876**, while Tao's optimization-constants repository listed **0.380868**. Neither was wrong. They were *consecutive entries in a fast-moving record sequence*, and the surface that was actually stale was a third one — the widely-cited index page at erdosproblems.com/36.

That reconciliation is [`docs/reconciliations/2026-07-22-minimum-overlap.md`](docs/reconciliations/2026-07-22-minimum-overlap.md), and it is also this repo's method template: identify the surfaces, date each value, find which one stopped moving.

## Is your number in here?

**There is now a page for exactly this question: [u00dxk2.github.io/bounds-ledger](https://u00dxk2.github.io/bounds-ledger/).** All 111 tracked constants, filter as you type, and for each one the pinned upper and lower rows, **the date each row last changed and whether that change moved the bound or only the text around it**, and a link to the primary source beside every number. No account, no clone, nothing fetched at runtime. It is a snapshot at the sha pinned below, and it says so on the page — for the live verdict, clone and run `npm run check`.

The short answer for most visitors is "maybe, and you can check in one click". **112 named constants** are tracked. Twelve of them are below, chosen because you may recognise them — each link goes to this repo's mirrored copy, which GitHub renders as the bounds table itself, so you can read the current upper and lower rows **without cloning anything**.

| Constant | The bounds table we watch |
|---|---|
| The real Grothendieck constant | [`10a.md`](ledger/teorth-optimizationproblems/constants/10a.md) |
| Erdős minimum overlap constant | [`1b.md`](ledger/teorth-optimizationproblems/constants/1b.md) |
| Chromatic number of the plane | [`27a.md`](ledger/teorth-optimizationproblems/constants/27a.md) |
| Maximum chromatic number of biplanar graphs | [`27b.md`](ledger/teorth-optimizationproblems/constants/27b.md) |
| The Crouzeix constant | [`2a.md`](ledger/teorth-optimizationproblems/constants/2a.md) |
| Moving sofa constant | [`41a.md`](ledger/teorth-optimizationproblems/constants/41a.md) |
| Lehmer's Mahler measure constant | [`40a.md`](ledger/teorth-optimizationproblems/constants/40a.md) |
| Kissing number in dimension 5 | [`29a.md`](ledger/teorth-optimizationproblems/constants/29a.md) |
| Sphere packing density in **R**⁴ | [`36a.md`](ledger/teorth-optimizationproblems/constants/36a.md) |
| Hadwiger covering / illumination number in **R**³ | [`39a.md`](ledger/teorth-optimizationproblems/constants/39a.md) |
| Bloch's constant | [`57a.md`](ledger/teorth-optimizationproblems/constants/57a.md) |
| Erdős unit distance exponent | [`84a.md`](ledger/teorth-optimizationproblems/constants/84a.md) |

The full set is [`ledger/teorth-optimizationproblems/constants/`](ledger/teorth-optimizationproblems/constants/) — one file per constant, plus upstream's own README at [`ledger/teorth-optimizationproblems/README.md`](ledger/teorth-optimizationproblems/README.md), which is where upstream declares which rows it stands behind.

**What you are looking at when you click.** Not a live read — a byte-identical copy of upstream at the sha pinned in [`manifest.json`](ledger/teorth-optimizationproblems/manifest.json), which is what makes it checkable: if upstream's file and ours ever differ, the alarm goes red and one of us is out of date. The **last-listed row of each table is pinned verbatim**, so a newly appended record trips the mirror diff. What this cannot tell you is which row is "the record" — that judgement is deliberately not automated, for the reason set out under the four load-bearing rules below.

**If your number is not in the table above, it may still be tracked** — the twelve are a sample, not the set. And if it is not tracked at all, that is worth an issue: the surfaces this project watches are chosen, not exhaustive.

## What it has actually caught

Since the alarm was armed on 2026-07-24, 12 upstream drifts — each verified before the mirror was updated, against primary sources where a number moved and against upstream's own content where the change was editorial. One row per resolution *story*, not per changed file and not per cycle — the eleven rows below cover twelve cycles, because the 2026-08-12 row is two of them. To count them yourself: `git log --oneline -- ledger/teorth-optimizationproblems/manifest.json`, minus the initial-snapshot commit `b5e3ac9` and the mirror-extension commit `3a698b1`, neither of which resolved a drift:

| Drift | What moved |
|---|---|
| [`50c8096`](../../commit/50c8096) | Editorial: a dead cross-link and a missing `C` in a LaTeX inequality. **Zero bounds moved** — and it still counted. |
| [`e856de9`](../../commit/e856de9) | Upstream added a constant (20 minutes after the previous drift). |
| [`60a044e`](../../commit/60a044e) | Certified record rows landed; a constant for a problem *solved* in 2026 was added. |
| [`da17be3`](../../commit/da17be3) | The first drift that was purely records moving: `5/3 → 7/√17`, `2.625622 → 2.6273856`, `>6.5143 → >6.5218`. Verified by recomputation before snapshot. |
| [`d30d4e4`](../../commit/d30d4e4) | Upstream re-marked a bound as having minimal available verification. **Every constants file was byte-identical** — the change lived entirely in upstream's README, i.e. in which rows it declares it stands behind. |
| [`ec01082`](../../commit/ec01082) | Two named constants in one morning. The real **Grothendieck constant**: both ends improved by one paper ([arXiv:2608.11158](https://arxiv.org/abs/2608.11158)), settling its tenths digit as 7. And **Crouzeix's conjecture**, upper bound `1+√2 → 2`, claimed proved ([arXiv:2608.03841](https://arxiv.org/abs/2608.03841)). Both verified against the papers before the mirror moved. |
| [`2026-08-12`](docs/findings/2026-08-12-two-record-movements-in-one-cycle.md) | A **priority correction** — a class we had not seen, and it took two cycles as upstream refined the attribution. No bound moved: upstream credited a *second, independent* claimed proof of Crouzeix's conjecture, posted eight days earlier. The preprint server returns HTTP 200 for a bot-protection page, so the citation was confirmed through Crossref instead. |
| [`433091b`](../../commit/433091b) | Upstream added Martinet's constant for totally real number fields (`constants/87a.md`), taking the mirror to 113 files. An addition is not a movement, and the catches-per-week indicator correctly counted it as zero — which is why that indicator is read alongside [`docs/findings/`](docs/findings/) rather than alone. |
| [`8a4192a`](../../commit/8a4192a) | Two record movements in one cycle, and a third row that is the reason this ledger refuses to name records. **Matrix multiplication exponent** `2.371339 → 2.371177` ([arXiv:2608.16884](https://arxiv.org/abs/2608.16884), AlphaEvolve) and the **Gyarmati–Hennecart–Ruzsa sum–difference constant** `1.1835129324 → 1.19102809`, both verified against primary sources before the mirror moved. Meanwhile **Brun's constant** gained a last-listed upper-bound row of `2.1594` that is *conditional on the Generalised Riemann Hypothesis* and therefore **not comparable** with the unconditional `2.288513` above it. Our generated pins assert listing position and never "the record", so the ledger reports the row and makes no claim the bound improved. |
| [`f5b5589`](../../commit/f5b5589) | Editorial again, and the clearest case yet for why editorial still counts. Upstream escaped the markdown-active characters inside inline math on six pages so GitHub would stop rendering them as emphasis; **no number changed anywhere**, and two generated pins broke anyway, because a pin is a byte comparison of a whole table row. Verified against upstream's own commit before the mirror moved: additions and deletions balanced per file, so no row was added or removed, with `7/64=0.109375` and `1.1835129324` byte-identical on both sides as the positive controls. |
| [`3907e7a`](../../commit/3907e7a) | Upstream **retracted an attribution it had published for fifteen days**, in its own words: it had described Lorist–Schwenninger as merely acknowledging Jin, which "read a citation of prior public posting as a statement of dependence, and was incorrect." No number moved — `$C_2 = 2$` is byte-identical on both sides — so this is a byte-only pin change on a record-facing event. Our [2026-08-12 finding](docs/findings/2026-08-12-two-record-movements-in-one-cycle.md) had recorded that same claim as *unverified by us, not contradicted*, because a fetch returned the arXiv abstract page rather than the paper; declining to assert it turned out to be right. Every leg of the replacement text was verified before the mirror moved: Crossref for Jin's title, author and v4 date, the arXiv API for LS2026's v2 and posting date, and the rendered **v1** body for upstream's §1 quotation, which is verbatim there and reworded in v2 — so checking it against v2 alone reads as a misquotation and is not one. |

**And one of those catches is now in the source.** A correction we found — five citation keys in `constants/15a.md` that did not match the page's own reference list — was submitted upstream and **merged by the repository's maintainer on 2026-08-11** ([`teorth/optimizationproblems#141`](https://github.com/teorth/optimizationproblems/pull/141)). That is the bar this project set for itself: not "we noticed something", but "someone who owns the record agreed and changed it".

### Check any of that yourself, in about a minute

These three steps re-run the current mirror check, exercise the differ, and open one historical catch. They need Node and a clean clone — no package installation, no account. (Run them from a *fresh* clone: step 2 deliberately edits a mirrored file and then restores it with `git checkout`, which would also discard any other local edits to that file.)

```
node scripts/reverify.mjs --check && node scripts/check-claims.mjs   # 1. is the ledger green now?

node -e "require('node:fs').appendFileSync('ledger/teorth-optimizationproblems/constants/2a.md','x')"
node scripts/reverify.mjs --check          # 2a. exit 1, "CHANGED constants/2a.md"
git checkout -- ledger/teorth-optimizationproblems/constants/2a.md
node scripts/reverify.mjs --check          # 2b. exit 0, "No drift." — the half that matters

git show da17be3 -- 'ledger/teorth-optimizationproblems/constants/*.md'   # 3. a real catch, verbatim
```

Step 1 is the two checks that need nothing but a network connection. `npm run check` runs these plus two more, one of which verifies a sign-in-gated page and exits 3 without a `CC_PROMPTS_PIN` you have no reason to have — so it is the wrong entry point for a visitor, though the mirror and claim output still prints before it stops.

Step 2 is the one worth doing, and **2b is the half that matters**: an alarm that fires is easy, an alarm that also goes quiet on its own is the property this repo failed to have for its first two days. It demonstrates the differ, not upstream moving — provided step 1 was green and upstream has not pushed in the meantime, the manifest and live shas stay identical and the only change reported is the one you just made.

Step 3 prints the bounds from the fourth cycle as they actually changed: `5/3 → 7/√17`, `2.625622 → 2.6273856`, `>6.5143 → >6.5218`, each with the certificate text upstream attached to it.

What these steps do *not* do is re-derive the mathematics or re-check the primary sources behind each catch; for that the write-ups in [`docs/findings/`](docs/findings/) name their sources and you are invited to go after them.

It has also caught itself. [`docs/findings/`](docs/findings/) holds both kinds of write-up — the drifts above, and every occasion the *instrument* was the thing that was wrong. The worst of the second kind: **the drift alarm was green-by-construction for its first two days**, because a piped command in CI reported the pipe's exit code instead of the check's ([`2026-07-24-drift-alarm-was-never-armed.md`](docs/findings/2026-07-24-drift-alarm-was-never-armed.md)). A ledger whose alarm cannot fail is decoration; those findings are the evidence that this one can.

## Current state

<!-- state-block:start — generated by scripts/render-state-block.mjs; do not hand-edit -->

Generated from committed state by `scripts/render-state-block.mjs`. For the **live** verdict —
whether every claim still holds right now — run `npm run check` and read its exit code.

- **114** mirrored files — 113 constant files plus upstream's repo-root `README.md` — byte-identical to upstream [`teorth/optimizationproblems`](https://github.com/teorth/optimizationproblems) at `f215d41` (an upstream sha; it does not exist in this repo). The README is in scope because it is where upstream declares which bounds it stands behind: a bound demoted to "verification at minimal levels" leaves every constants file unchanged.
- **235 pinned claims** — 224 generated (one per bounds table, asserting the last-listed row's **position**, never "the record") and 11 hand-written. 2 are `manual: true` and therefore report UNVERIFIED by design: their source blocks automated fetch from CI runners.
- Checks run daily in CI (09:17 UTC), on push, and on demand

<!-- state-block:end -->

## Run it

No dependencies — Node stdlib and `fetch` only. `npm install` is a no-op.

```
npm test         # network-free self-tests (the run prints the live count)
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

- **The metric this project judges itself by — externally-acknowledged corrections — is 1.** Five citation keys, submitted as a pull request and merged by the maintainer of the adopted repository on 2026-08-11. A second correction, sent by email to a different site on 2026-07-24 after an adversarial review that cut one claim, is **still unanswered**; the two are separate channels and the merge says nothing about the email.
- **Two adopted surfaces.** This is not a survey of mathematical records; it is a deep watch on a small, named set.
- **Known limit:** this ledger checks that a cited record still says what it said, and that the surfaces citing it agree. It does not verify the mathematics behind any record. Where a bound is supported by a claimed proof that has not been refereed, the ledger tracks the row and upstream's own hedging — it does not adjudicate the proof.
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
