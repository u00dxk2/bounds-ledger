# W-5 closed: the alarm can now see a record being demoted, not just moved

**Date:** 2026-08-10 (MT) · **Item:** W-5 · **Instrument:** `scripts/reverify.mjs`
(mirror scope) + `scripts/reverify.test.mjs` (the README leg, both ways) · **Commit:** see below

## The blind class, in one event

On 2026-08-02, upstream commit `dee1660` was titled *"Mark C_21 and C_71 unverified records with
asterisks in README"*. It restored the peer-reviewed OT2013 value as `C_71`'s headline anchor and
flagged the Numaro n=18 record — merged minutes earlier via PR #130, on Zenodo but not peer-reviewed
— as unverified.

Our drift alarm that day reported three constants files and said **nothing** about this.

It could not have. We mirrored `constants/**` only, and a demotion from headline to
asterisked-unverified leaves every bounds table byte-identical. The numbers do not move; what moves
is which of them upstream will **stand behind**. For anyone citing these constants that is arguably
the most decision-relevant event class there is, and it was the one class this ledger was
structurally unable to see.

Same shape as A-11's BC-2, and worth naming as a pattern rather than two coincidences: **both times,
the instrument was blind to the class the lane most exists to catch.** Neither gap was found by a
review of the instrument. Both were found by watching a real event go past it.

## What shipped

`README.md` joined the mirrored surface. The change is small on purpose:

- File maps are now keyed by **repo-relative path** (`constants/1a.md`, `README.md`) rather than by
  bare filename, so a report names files the way upstream does. Previously the report prefixed
  `constants/` by string concatenation, which would have printed `constants/README.md` — a lie about
  where the file lives, in an artifact whose whole value is being literally true.
- On disk nothing moved: the 111 constants files stay exactly where they were and the README sits
  beside them at the mirror root. `git diff --numstat` after the re-snapshot showed **zero** content
  lines changed in any constants file — the manifest, two scripts, and one new file.
- The post-snapshot ratchet ran: `extract-pins.mjs` regenerated **byte-identical** (220 generated +
  9 hand), independently confirming no bounds-table row moved.

Mirror is now **112 files @ `dee1660`**; ledger unchanged at 229 claims, 227 hold, 0 broken, 2
unverified by design.

## The item overstated its own cost by ~17×, and that is worth recording

W-5's `closeWhen` described the target as "teorth/optimizationproblems' generated 421KB index". The
actual file is **24KB**. The 421KB figure belongs to a *different* repository's README
(`teorth/erdosproblems`, from A-6's scoping) and was copied across when W-5 was written.

That single wrong number is a plausible reason the item sat for eight days: 421KB of near-daily
churn reads like a permanently-red alarm waiting to happen, which is precisely the thing this lane
refuses to ship. 24KB of curated table does not. The cost estimate, not the value, was what kept it
parked — and the estimate was wrong.

**The check that would have caught it costs one `curl`.** Before proposing the work, fetch the thing
and look at it. An item's own description of its cost is a claim like any other, and this repo does
not accept unexecuted claims from anyone — including from itself.

## Both answers demonstrated (KP-78 / W-4)

Wired into `reverify.test.mjs`, so it is guarded in CI on every run, not just today:

- **FIRES** — append an asterisk to a real README table row, in upstream's own convention, and the
  check exits 1 reporting `CHANGED README.md` with the asterisked row shown verbatim.
- **SILENT (restored)** — put the row back and the same run exits 0. A detector that cannot go quiet
  is indistinguishable from one that is stuck on.
- **SILENT (unrelated edit)** — tamper a constants file and the verdict list is *exactly*
  `CHANGED constants/<file>`. The README is not dragged in. Without this, a mirror that reported
  every file on every run would pass the FIRES assertion while carrying no information about which
  surface actually moved.
- **REMOVED** — delete the mirrored README and it reports `REMOVED README.md` rather than passing
  silently, because the reader that loads it swallows a missing file deliberately and lets the diff
  speak.

**Negative control performed, and the mutation was proven to land first.** Setting `ROOT_FILES = []`
and re-running gave `AssertionError: an asterisked README row should exit 1, got 0` — the alarm goes
silent on exactly the event class it was built for. `git diff --numstat` confirmed the edit applied
before the result was believed (files here are CRLF; a `\n` pattern silently no-ops and yields a
false verdict). Restoring the line returned PASS.

## One assertion was wrong the first time, and the alarm was right

The unrelated-edit check originally asserted that the string `README.md` was absent from the report.
It failed immediately — because the report **header** names the whole watched surface, README
included. The body was correct all along.

Recording it because the failure mode is the interesting one: a test that reads the wrong line of a
correct report looks exactly like a broken instrument. The fix was to assert on verdict lines
(`CHANGED` / `ADDED` / `REMOVED`) rather than on raw text, which is also the stricter check — it now
pins the *exact set* of files named, not merely the absence of one.

## Scope honesty

This watches upstream's **declaration** about its own records. It does not verify the underlying
mathematics, does not judge whether an asterisk is warranted, and does not make the asterisked
records any more or less true. When it fires, the response is the same as any drift: verify against
primary sources, then snapshot deliberately. And a byte-mirror will report *any* README edit — a
typo fix in the introduction fires it too. That is accepted: the file is small and curated, so the
false-positive cost is a read, and the alternative (pinning only the table spans) would reintroduce
a blind class to avoid a minor annoyance.
