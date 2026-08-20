# close-session-config — bounds-ledger

What `/close-session` runs in this lane. Created 2026-08-20, because the primer gate approved that
morning was wired as an npm script and **nothing told the close skill to run it** — a gate with no
caller is a gate that never fires, which is this repo's founding defect wearing a new hat.

## The close battery, in order

```
npm run close:primer     # 1. tomorrow's cold-start primer must exist
git status --porcelain   # 2. must be EMPTY — see the warning below
npm run verify           # 3. gates + a receipt at the CURRENT HEAD
```

**1. `npm run close:primer`** — fails when `docs/cold-starts/<tomorrow-MT>.md` is missing.
Deliberately **not** in `npm run check` or CI: tomorrow's primer legitimately does not exist for most
of the day, so a cadence placement would be red from midnight until close ran, and a permanently-red
alarm carries as much information as a permanently-green one. Its self-test *is* in the offline
battery and in CI. Both answers demonstrated live on 2026-08-20 — exit 1 that morning, exit 0 that
evening.

**2. `git status --porcelain` must be empty — this is a real gate here, not tidiness.**
`continuity/traffic.json` is a **write-once record**: the GitHub API forgets days older than 14, so
that file is the only copy of anything outside the current window. An uncommitted sample is not
untidiness, it is **data that disappears silently when the session ends**. Found dirty on 2026-08-20
by a close-readiness sweep rather than by anyone remembering. When it is dirty, check the diff is
purely additive (`git diff --numstat`, 0 removed lines) before committing.

**3. `npm run verify`, not `npm run check`** — writes a receipt at the current HEAD.
`agent-status` refuses a post claiming gate results unless a receipt exists at the HEAD you actually
have; a receipt for another commit says nothing about the code in hand. Run it **after** the last
commit, or the receipt is stale before you post. Never reach for `--no-verify-receipt` or
`CC_VERIFY_RECEIPT_DISABLED=1` — the override buys one post and loses the cadence.

## Close shape

- **The primer is APPENDED, never overwritten.** `docs/cold-starts/<date>.md` is a multi-session
  document; later sections supersede earlier ones and the earlier ones stay as the record.
- **Engineering zero is structural here, not swept.** `package.json` carries zero dependencies and
  zero devDependencies, so Dependabot has nothing to find; there is no Sentry project, which is why
  `check-instrument-liveness` returns NOTHING SWEPT. Report that as *absence*, never as a clean
  sweep — an absent instrument renders null, never a count. No waiver is needed for residue that
  does not exist.
- **Correct with `--supersedes`, never a silent edit.** If a claim made earlier in the day proved
  wrong, supersede the post that carried it.
- **Held PRs are not loose ends.** Trusted-print instruments wait for the cross-family review lane.
  Open PRs at close are expected when a review has not returned; do not merge to tidy the count.

## What this lane does NOT have

No `carry-forward.md`, no `current-state.md`, no `report-caches.json`. The cold-start primer plus
`continuity/items.json` carry that role, which is the documented layout — their absence is by design
and should not be read as a gap.
