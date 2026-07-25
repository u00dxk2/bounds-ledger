# The 403 that wasn't — the lane's most load-bearing constraint was never re-tested

**2026-07-25 · found while trying to automate a workaround for it**

## The claim we had been operating on

From `CLAUDE.md`, since the lane opened:

> **erdosproblems.com 403s automated fetch.** Re-verifying it needs David's browser… Don't substitute a bot fetch — a 403 proves nothing.

This single sentence shaped four days of work. It is why claim **C-7** carried `manual: true` and reported UNVERIFIED forever. It is why **W-3** — the watch on the acknowledgement that is *G-1's second close condition* — was filed as **David-owned on both legs**. It is why the answer to "has the page changed?" was always "ask David to look."

## What is actually true

David asked for a Playwright poller so the page-check wouldn't be forgotten. Before building it, I tested the premise:

```
node fetch (default UA) => HTTP 200 | bytes 35185 | has 0.380876: true | last-edited: 23 January 2026
with browser UA         => HTTP 200 | bytes 35185 | has 0.380876: true | last-edited: 23 January 2026
```

**Plain `fetch`, no browser, no user-agent spoofing, HTTP 200.** The page body contains the bracket as raw LaTeX (`\[0.379005 &lt; c &lt; 0.380876,\]`) and the edit date as plain text. Playwright reads the identical content, so the browser was never needed either.

Whatever blocked us earlier — a transient Cloudflare rule, a different path, a bad early attempt — **no longer blocks us, and nobody had re-tested it.**

## What changed as a result

| Before | After |
|---|---|
| C-7 `manual: true`, reports UNVERIFIED forever | C-7 automated; pins the stale bracket verbatim |
| — | **C-8 added**: pins `This page was last edited 23 January 2026.` |
| 223 claims: 222 hold, **1 UNVERIFIED** | **224 claims: 224 hold, 0 UNVERIFIED** |
| W-3: both legs need David | W-3: **two of three triggers now mechanical**, checked daily in CI |

Both claims **hold while the page stays stale, and break when it changes** — and a break here is *good news*: it means our correction landed. Negative-controlled: re-pinning C-7 to the corrected value `0.380868` and C-8 to a future date makes both go BROKEN and the run exit 1; restoring makes them green again. The watch is armed, not decorative.

The only leg still genuinely David's is a **maintainer reply**, which arrives in his inbox and nowhere we can reach.

## Why this is the finding, not a footnote

The lane exists to catch **cited-not-checked** claims — facts that are true once, get written down, and are never re-examined while the world moves underneath them. Our own most load-bearing operational constraint was exactly that: asserted early, written into `CLAUDE.md`, and inherited by every session after without a single re-test. It cost four days of treating a mechanical check as a human errand, and it parked the lane's north-star watch on a person.

Three of this week's findings are now the same shape from different angles:

- **7/24** — the drift alarm was never armed (a green that couldn't go red)
- **7/25** — a network flake titled "Drift:" (an alarm that fired and said the wrong thing)
- **7/25** — this one (a constraint that was never true, or stopped being true unnoticed)

The unifying lesson: **an assertion about our own instruments deserves the same re-verification discipline we apply to the records.** We re-fetch 224 mathematical claims every single day and had never re-fetched the sentence that shaped how we work.

## Practical rule adopted

`manual: true` is now the fallback for a source we have **proven** we cannot fetch — not a standing state. Before marking anything manual, run the fetch. A stale "we can't check this" is worse than no claim at all, because it parks a question forever behind a human who was never told the block had lifted.

**Do not re-add `manual: true` to these claims without re-testing first.** If the block genuinely returns, it surfaces as UNREACHABLE — a legible check error since A-5 — not as a silent green.
