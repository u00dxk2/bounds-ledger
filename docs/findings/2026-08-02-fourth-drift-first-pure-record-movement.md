# Fourth drift — the first that is purely records moving, and upstream adopts our Angle 7

**2026-08-02** · caught by CI run 30763625107 · resolved `621429c` → `dee1660`

## What moved

Three files, all **bound improvements** — the first drift where nothing editorial was involved:

| File | Was | Now | Source |
|---|---|---|---|
| `10c` | $5/3 \approx 1.666667$ (9×9 sign matrix) | $7/\sqrt{17} \approx 1.697749$ (17×17) | [L2026], PR #129 |
| `38a` | $2.625622$ [FV2017] | $2.6273856$ (span-17 certified enumeration) | [Num2026], PR #135 |
| `71a` | $>6.514326913930565372$ (n=17) | $>6.521845710923046575$ (n=18) | [Num2026], PR #130 |

Mirror stays 111 files; 3 generated pins moved (`pin:10c:L`, `pin:38a:L`, `pin:71a:L` — all
last-listed lower-bound rows). Ledger 229 claims / 227 hold / 0 broken / 2 UNVERIFIED, clean at
`dee1660`.

## Verified before snapshot, by recomputation

- **71a**: upstream claims the gain over the n=17 record is "exactly $1/133$". Checked:
  $6.521845710923046575 - 6.514326913930565372 = 0.0075187969924810\ldots$ and
  $1/133 = 0.0075187969924812\ldots$ — agree to double precision. The claim is self-consistent and
  the new value strictly improves the old.
- **10c**: $7/\sqrt{17} = 1.697749\ldots$ matches the stated decimal, improves $5/3 = 1.666667$, and
  the page now ships the explicit 17×17 sign matrix, so the discrepancy claim is replayable.
- **38a**: $2.6273856 < \mu(\mathbb{Z}^2) \approx 2.63815853$, the accepted connective constant — a
  lower bound below the true value, as required — and it improves $2.625622$.

None of this verifies the certificates themselves; it verifies internal consistency and direction.
The distinction matters and is the same one this lane makes outward.

## Two things that matter more than the numbers

**1. The three merged PRs are the exact PRs A-13 named as our first-PR replay targets.**
A-13 note2 (written 8/01 off the contribution-channels research) proposed: *"replay the open
unreviewed certificate PRs #129 / #130 / #135 — a discrepancy found upgrades a comment to a
correction."* All three merged today, hours before we would have replayed them. **That backlog item
is dead as imagined** — they are no longer open, no longer unreviewed, and a replay now finds
whatever the maintainers already found. The channel is not dead; the specific targets are. Whoever
picks up first-PR selection needs new targets, and should note the window: these sat open long
enough to appear in a research report and closed inside a day.

**2. Upstream just adopted, in its own repository, the distinction our /36 draft was rewritten
around this morning.** Commit `dee1660` — *"Mark C_21 and C_71 unverified records with asterisks in
README"* — restores the peer-reviewed OT2013 value as the headline anchor for C_71 and marks the
Numaro n=18 record (merged minutes earlier) as unverified, because it is on Zenodo but not yet
peer-reviewed.

Hours earlier, the adversarial review of our public erdosproblems.com/36 comment killed the framing
"the bound is out of date" on exactly this reasoning: *a curated repository listing a value is not
the field accepting it*, so the draft says the repository **lists** a later value and the two pages
**disagree**. That was written as a defensive hedge against a maintainer we cannot poll. Upstream
then formalised the same distinction in its own table, independently and on the same day. The hedge
was not over-caution — it was the convention the field is actively converging on.

## New blind class: the mirror cannot see the verified/unverified distinction

`dee1660`'s asterisk change lives in **README.md, which is not in our mirror** (we mirror
`constants/**` + `manifest.json`, 111 files). So the surface that now carries "is this record
peer-reviewed or merely submitted" is one we do not watch, and our drift alarm reported three files
while the semantically largest change of the day was invisible to it.

This is not academic. Our generated pins assert listing position in the per-constant tables; the
README is where upstream states which of those rows it will *stand behind*. A record could be
demoted from headline to asterisked — a real, meaningful event — and our alarm would stay silent.

Filed as **W-5**. Deliberately not fixed inside this drift cycle: adding README to the mirror is a
scope change to the adopted surface, it needs the both-sides demonstration W-4 requires, and
half-built instrument changes at the end of a long session are worse than none.

## Process notes

- The drift was caught by a CI run triggered by an unrelated push, not by the daily cron — the
  09:55Z scheduled run was green at `621429c` and upstream pushed four commits at ~16:05–16:10Z.
- `git status` again over-reported (all 111 mirror files touched by the snapshot rewrite);
  `git diff --numstat` confirmed exactly 3 content changes + manifest + pins, matching the drift
  report. Fourth time this has come up; the `--numstat` habit held.
- Full ratchet run in order: verify → `--snapshot` → `extract-pins.mjs` → commit.
