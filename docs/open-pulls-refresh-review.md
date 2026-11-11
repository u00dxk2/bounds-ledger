# Review prompt — a daily open pull request refresh

The review each daily refresh commit gets before it is pushed (`docs/daily-config.md`, the first
action; `A-96`). Copy this file to `tmp/bounds-ledger-codex-refresh-<MT date>.md`, fill the two
`<…>` values, read it back, and launch it by the one recipe in
`~/.claude/skills/_shared/codex-review.md` § 4 (foreground pipe, `--sandbox read-only`, `-C` this
repo, banner `workdir` checked before reading a finding). Push only on a verdict that reports no
page changed outside its block. Anything else: do not push; give the commit the normal review.

Why a review of the PROPERTY and not a list of preconditions: two rounds on 2026-11-11 (Codex
rounds 1 and 2 on `9f26785` and `fd0d52a`) each found a route by which a refresh could change other
page prose while every stated precondition held (an unstaged renderer input; a store path set by
an environment variable to an ignored or external file). The renderer reads too many inputs for a
precondition list to be complete, so the commit's own content is compared instead.

---

This review is STATIC: you cannot execute tests. You can read the repository and run read-only git
commands (`git show`, `git diff`, `git cat-file`, `git ls-tree`). Do not run any project script (no
`node scripts/...`, no `npm`), and make no network requests or web searches.

- Repository: C:/dev/skylark/bounds-ledger (branch main).
- Commit under review: `<full 40-character sha of the refresh commit>`. Confirm it with
  `git log --oneline -1 <sha>`; stop if it does not resolve.
- Its parent: `<full 40-character sha of the parent>`.

The rule this commit must meet: it changes `ledger/open-pull-requests.json` and `c/*.html` files
only, and on every changed `c/*.html` page the ONLY changed bytes are inside the block that starts
`<dt>Open pull requests that change this constant's file upstream</dt>` and ends at the `</dd>`
that closes it. A page that gains that block where it had none, or loses it, counts as inside it.

Check, and report each as REPRODUCED (with the command) or STATIC:

1. `git diff --name-only <parent> <sha>`: every path is `ledger/open-pull-requests.json` or a
   direct child `c/<name>.html`. Name any other path.
2. For EVERY changed `c/*.html`: take the parent blob and the commit blob, remove the block defined
   above from each (if present), and compare what is left byte for byte (normalise CRLF to LF
   first). Name every page where anything outside the block differs, and quote the differing text.
3. For every changed page, the pull request numbers listed in its block are exactly the numbers in
   the commit's `ledger/open-pull-requests.json` whose `constants` include that page's constant id,
   and the block's `data-read-at` equals the JSON's `readAt`.
4. The JSON's top-level fields are only `purpose`, `repository`, `readAt`, `count`, `pulls`; every
   pull request row has only `number`, `createdOn`, `constants`, `byThisLedger`; `count` equals the
   number of rows. No titles, no author names.

Verdict, on its own first line: `REFRESH-ONLY: yes` when all four hold for every page, else
`REFRESH-ONLY: no` followed by every exception. Say how many pages you compared.
