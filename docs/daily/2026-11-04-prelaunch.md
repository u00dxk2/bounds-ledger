# bounds-ledger — 2026-11-04 (Wednesday)

## BLUF

Thirty-six constant pages list the open pull requests that would change that constant upstream, and every one of those lists was last read on 28 October. Upstream has opened about thirty more since, and the pages do not say their list is a week old. Today's pick is to make the page say so when the list is old, and to refresh it.

### Selection packet

[P1 — Evidence and choice]

**Outcome:** `A-90` (a stale open-pull-requests list says so on the page), on the 36 `c/` pages that carry the block. Today the block reads "open and not merged when we read the source repository's list on 2026-10-28" with nothing to tell a reader that the date is old or that newer requests are missing.

**The user problem, in the user's words:** "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (`docs/evangelism-bar.md`.) Our own pull-request list now has that exact defect: a dated list that a reader cannot tell is a week behind.

**Section 0.**
- Primer: `docs/cold-starts/2026-11-03.md` (no 2026-11-04 primer; primers are named for the day they are written). Its banner names the seven gates due today and asks whether `W-14`'s empty read is the answer or a dead source.
- Listener: 🟢 SSE alive (restart marker 2026-11-04T14:53:48Z, pid 11296, with `hello` and `replay-complete` below it). The loop is armed by a `ScheduleWakeup` tool call; waker ranks 1 to 3 are running (rank 1 exited on purpose at the kickoff, a WAKE-SHORTEN fire, and was relaunched).
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, machine-level exec at 14:57:15Z).
- CI: GREEN at `a9433c4df8` for reverify.yml and page-check.yml (`check-ci-status.mjs --workflow <file>`, each "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending"). The overnight scheduled drift run, 41806658736 at 09:20Z on `a9433c4df8`, concluded success. `npm run verify` receipt: exitCode 0 at `a9433c4df8` (15:21:30Z); the first attempt was refused before running (exit 2, "1 untracked path(s)", this report file written while it queued) and re-run after staging it. Its page legs: "RESULT: PASS — 120 constant page(s) match committed state (@ 87b4ebb)"; the brief leg UNVERIFIABLE, as expected.
- Deploy drift: `check-deployed-sha-drift.mjs` exit 0, "0 finding(s) across 38 service(s)". This is a GitHub Pages lane with no Render service, so the read sweeps nothing of ours: neither a stop nor a pass.
- positive control: the same read listed 38 services with a live commit each (for example `skylark-site` in-sync-by-filter), so it read the fleet and was not empty.
- Harness: running 2.1.318 · fleet UNIFORM (28 of 28 panes) · installed 2.1.318 (SAME).
- Recs yesterday: none (the 11-03 report's Recommendation section reads "None for David yet").
- Working tree: `copying.html` was modified at session start by line endings only (`git diff --numstat` empty); restored with `git checkout`.
- Prior-day retro: 4 still-on-discipline findings. The one that bears on today: Q6, Codex rounds spent on topic-matching rules that an allowlist then replaced. Today's line is computed from two dates, not matched from text, so there is no matcher to grow; if review finds the same class twice, the shape changes.
- Product-love rotation: `check-cycle-rotation.mjs --lane bounds-ledger` exit 0, "no product-love cycle due — picked evangelism-bar (30d since 2026-10-05, within its 30d cadence)".

**Evidence** (each read today, 2026-11-04 MT):
- OBSERVED · `ledger/open-pull-requests.json` · `"readAt": "2026-10-28T19:54:15Z"`. Seven days from that is 19:54Z today.
- OBSERVED · `gh pr list -R teorth/optimizationproblems --state open --limit 200 --json number,createdAt` · 60 open, the newest #326 at 14:20:38Z today. The store holds 30 (`"number":` occurs 30 times in `ledger/open-pull-requests.json`), so the pages show half of today's open list.
- positive control: the same listing returned #249 (opened 2026-10-22), which the store also holds, so the read reached the right repository and is not empty.
- OBSERVED · `c/` · the block's heading "this constant's file upstream" appears on 36 pages.
- OBSERVED · `node scripts/open-pulls.mjs --selftest` (`A-90`'s read, through `--run A-90`) · "RESULT: PASS — listing rules, page block and the bound-cell guard (exit 0)". No check covers age, because no age rule exists yet.
- OBSERVED · code · `pullsBlock()` in `scripts/open-pulls.mjs:137` prints `mtDay(store.readAt)` and nothing derived from it.
- MISSING · any reader's word on a pull-request block. The pick rests on the bar's own problem statement and on a measured gap between the page and upstream.

**Permission:** `A-90` is open, not parked, waiting or frozen; no card is open on it. It was minted on the orchestrator's ruling (bus 2026-10-22T16:48Z) asking that the list "not age silently" (not David's words). Its onTrigger requires a red-armed selftest, a Codex read-only review, and the page sentence updated in the same commit. It is a public-page wording addition, so it gets the adversarial review before the push.

**Next action:** improve (the block's disclosure of its own age). The design question the row asks first, how the render date is read without making `render-constant-pages --check` depend on the clock, has two answers to choose between in P3:
1. Compute it at VIEW time: the block carries the read date as a data attribute, and the page's existing inline script (each `c/` page already has one) shows "This list was last checked on <date>; newer pull requests may be missing." when today in the reader's browser is more than 7 days later. The HTML bytes do not depend on the render clock, so `--check` stays deterministic. Without scripts, a reader still sees the dated sentence.
2. Compute it at RENDER time against a committed date (the mirror manifest's `fetchedAt`). Deterministic, but a page nobody re-renders never goes stale, which is the case that matters.
Leading option: 1. Also in P3, refresh the list (`node scripts/open-pulls.mjs --fetch`, then `render-constant-pages.mjs`), which makes today's 36 lists current. That is a data refresh through the existing reviewed path. First command, the read the acceptance rests on:

```
node C:/dev/skylark/bounds-ledger/scripts/open-pulls.mjs --selftest
```

**Acceptance condition:** the selftest renders the stale line for a store read more than 7 days before the comparison date and not for a fresh one, red-armed both ways; `render-constant-pages --check` passes twice at the commit with the same output; `npm test` passes; Codex read-only review dispositioned; the page sentence describing the block updated in the same commit; after the push, `npm run served` plus a live fetch of at least two changed `c/` pages show the refreshed list and the new markup.

**Delivery and encounter checks:** delivery = a live fetch of the changed `c/` pages after the push (`npm run served` reads only the anchor commit's first page, per `served-reads-only-the-anchor-commit`). Encounter = blind (`A-59`): the pages carry no analytics. The only countable event is a report filed through a row's own link, counted by `npm run reports`, readable at N = 1.

**USER-FACING:** yes · `scripts/open-pulls.mjs`, `scripts/render-constant-pages.mjs` (if the inline script changes), `ledger/open-pull-requests.json` (refresh), the `c/*.html` pages that carry or gain the block (re-rendered), `continuity/items.json`, `docs/daily/2026-11-04-prelaunch.md`.

**HYGIENE INPUTS**
- (a) due rows not bearing on the choice, 6, copied from `dated gates due today`: `A-50` (importing a CLI script can run it), `A-59` (encounter is blind on the public pages), `A-70` (phone touch targets on the index rows), `A-89` (the decimal-vs-exact census's six blind shapes), `A-9` (engineering-health P2 backlog), `W-14` (watch upstream issue 218). For `W-14` the read was run live this morning: `gh issue view 218 -R teorth/optimizationproblems --json state,comments,updatedAt,number,title` printed `"comments":[]`, `"state":"OPEN"`, `"updatedAt":"2026-10-07T19:39:29Z"`. positive control: the same response carried the issue's own title ("46a: the 4 − 2/15 bound is credited to Bourgain's GAFA 1991 paper, which proves 31/8", not David's words), so the read reached the right issue. The empty comment list is the answer, not a dead source; the draft should record that as `readCommandSourceEmptyOk` with that reason.
- (b) owed child rows: none. Read: "Rows owed to you in skylark-site's ledger: NONE — of 786 owner-stamped row(s), none names bounds-ledger and is still open."
- (c) CROSSED state reads: none. Read: dated gates 7 (owed, listed in (a) and the pick), HEAD CI GREEN, queued rows 0, stale-actionable 1 of 27 (threshold not crossed), missingLinkedCommits nothing swept. Board: card 87acfd78 is SPENT (A-95, executed 2026-11-03); dismiss it.

## What changed

- P1 read the due gates and selected `A-90`; posted as msg `c430ed25`.
- Prep, for the design choice: the `c/` page selftest pins exactly one script, the copy button's (`scripts/render-constant-pages.mjs:1080`, "a constant page carries exactly one script: the copy button"), and executes it under `new Function` against a stub DOM (`:1123`). So option 1 (view-time age) either extends the shared `copyCiteScript` in `scripts/lib/html.mjs` or relaxes that pin. Either way the age logic needs its own executed test with a stubbed clock, not a pattern match.
- The manager approved `A-90` with option 1 (msg `0bfd5a08`) and suggested an unattended refresh as the stronger version.
- P3 built it in `1cef357`: `scripts/open-pulls.mjs` gains the hidden stale sentence, `data-read-at` on the block, and `staleListScript()`; `scripts/render-constant-pages.mjs` appends that code inside the page's one script and styles it only under `.stale:not([hidden])`, because `.when{display:block}` beats the browser's own `[hidden]` rule. The sentence: "This list was last checked on <MT day>, more than a week ago, so it may be missing newer pull requests and may still show ones that have since closed."
- Selftests execute the script, never pattern-match it: `open-pulls.mjs --selftest` runs it against a stub built from the block's own markup with the reader's clock injected (shown at 7 days + 1 s; quiet at exactly 7 days, at 1 day, with a clock behind the read, and on an unparseable instant); `render-constant-pages.mjs --selftest` runs the RENDERED page's whole script against a stub answering only the attribute and class the page's markup carries.
- Red-arms, each restored from a hashed backup ("restore pulls: IDENTICAL", "restore pages: IDENTICAL"): `>` to `<` → open-pulls exit 3; `hidden` dropped → open-pulls exit 3 "FAIL … HIDDEN by default"; script selector `dd[data-read]` → render-constant-pages exit 1 "the page's own script must show the stale sentence …"; unscoped `.stale{display:block}` → exit 1 "the stale sentence's style must apply only when it is shown". The first try at the second mutation did not land (3 matches, the string is also in the tests) and was re-aimed at the template.
- Data refresh: `open-pulls.mjs --fetch` → "60 open pull request(s) … 59 changing a constant file, 50 distinct constant(s)". 120 pages re-rendered (every page gains the age code, which the bound-cell guard requires).
- `npm test` exit 0 before the commit. At `1cef357`: render-constant-pages --check "RESULT: PASS — 120 constant page(s) match committed state (@ 87b4ebb)", run twice with identical output; render-site --check "RESULT: PASS — index.html matches committed state (120 constants @ 87b4ebb)".
- Codex r1, read-only (banner `workdir: C:\dev\skylark\bounds-ledger`, on `1cef357`, verdict written 16:22:51Z): SHIP, no defects, all STATIC. It named test ceilings rather than defects: neither stub models HTML parsing, script placement or the full CSS cascade, so moving the script above the block or adding an unrelated `[hidden]{display:block}` rule could pass both stubs. Dispositioned DELIBERATE / accepted ceiling: the committed page has neither, and the live fetch below reads the real page.
- Pushed `a9433c4..1cef357`.
- CI green on `1cef357`: `check-ci-status.mjs --workflow reverify.yml` and `--workflow page-check.yml` each "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending".
- Delivery: the Pages build row for `1cef357` read "built" at 16:28:03Z. A live fetch of c/10a, c/10b, c/13a (with a block) and c/2a, c/87a (without one) returned HTTP 200, Last-Modified 16:28:02 GMT, each byte-identical to HEAD. The three with a block carry `data-read-at` 2026-11-04T15:56:26Z and one hidden stale sentence, and none still says "list on 2026-10-28". 46 pages carry the block now (`<span class="stale" hidden>` in 46 files of `c/`), up from 36 because the refreshed list touches more constants.
- Real browser, since that was the ceiling Codex named: `playwright-cli` on the live c/10a.html. With today's clock the sentence is `hidden`, computed `display: none`, height 0. After the page's own script ran with `Date.now` set 8 days past the read, it was shown, `display: block`, 40.9 px tall, with the sentence's text. The one console error was the browser's own request for `/favicon.ico` at the domain root (404), not this page.
- `A-90` CLOSED with that receipt (the id sweep: 53 mentions in 21 files, all dated primers and reports or the feature's own code comments in `scripts/open-pulls.mjs` and `scripts/render-constant-pages.mjs`; none is an open gate).
- Minted `A-96` (refresh the list without a human): no workflow here writes to the repo, so a scheduled refresh would be a new automatic publishing path, decided on 2026-11-11, not added today.
- Hygiene helper dispatched at P3 start; draft at `tmp/hygiene-draft-bounds-ledger-2026-11-04.md` (6 lines: 4 re-dates, 2 UNDECIDED, `A-9` and `A-50`). Its four READ-MUTATED lines name only the two files this P3 edited; status posted (msg `20d545e7`).

## Inputs (controllable)

- None yet.

## Outputs (lagging)

- Not read yet today.

## Recommendation

- None for David yet.

## On hold pending data

- None.

## State Appendix

Written at the close from live commands.
