# The 403 is IP-dependent — and a local 200 proves nothing about CI

**2026-07-25 · I got this wrong first, shipped it, and CI caught it within four minutes. The correction is the finding.**

> **Superseded title:** this document was first written as "The 403 that wasn't," asserting the block did not exist. That was wrong. The original convention was right about the case that matters. What follows is the corrected account, kept in place deliberately — the mistake is the more useful artifact.

## What I claimed

David hand-checked erdosproblems.com/36 (unchanged) and asked for a Playwright poller so the page-check wouldn't be forgotten. Before building the workaround I tested the premise behind it — the lane's oldest operating constraint:

> **erdosproblems.com 403s automated fetch.** Re-verifying it needs David's browser.

From my machine:

```
node fetch (default UA) => HTTP 200 | bytes 35185 | bound readable | last-edited: 23 January 2026
with browser UA         => HTTP 200 | bytes 35185 | bound readable | last-edited: 23 January 2026
```

I concluded the constraint was stale, automated claim **C-7**, added **C-8** pinning the edit date, declared *"224 claims, 224 hold, zero UNVERIFIED — the lane no longer has an unverifiable claim,"* and pushed.

## What was actually true

CI went red on the next run. From a GitHub Actions runner:

```
UNREACHABLE C-7  https://www.erdosproblems.com/36 — HTTP 403
UNREACHABLE C-8  https://www.erdosproblems.com/36 — HTTP 403
224 claim(s): 222 hold, 2 broken/unreachable
```

**The block is real and it is IP-dependent.** The site serves 200 to a residential IP and 403 to datacenter ranges — the ordinary shape of a Cloudflare/datacenter rule. My local test measured a machine that will never run the check. The original convention was correct about the only context that mattered: **CI**.

Reverted — C-7 is `manual: true` again, C-8 removed, back to 223 claims with one honest UNVERIFIED.

## The actual lesson, which is sharper than the one I thought I had

**A capability test is only valid from the environment that will exercise the capability.** I verified a fact from my machine and generalised it to a runner in another network, and every number in that conclusion was wrong in the same direction — optimistically. Nothing about the local evidence was false; it simply did not license the claim I built on it.

This is a close cousin of the defect this lane was founded on. The 7/24 finding was a green that carried no information because the *harness* differed from what the test assumed. This is a green that carried no information because the *network* differed from what the test assumed. In both cases the check ran, passed, and answered a question nobody had asked.

And note the failure mode it *nearly* caused: had CI not exercised these claims immediately, we'd have carried a ledger asserting "zero unverified claims" while the one claim gating the lane's north-star watch was silently unverifiable. **The over-claim was in the safe direction only by luck of timing.**

## What survives, and it is worth keeping

The local 200 is real, and it buys something the screenshot round-trip did not:

- **An agent running `npm run check` on a residential connection genuinely re-verifies C-7 mechanically.** That is a real upgrade on "ask David for a screenshot" — same evidentiary strength, no human in the loop, available to any local session.
- **Three independent reads now agree** on the current page state: David's hand-check, a local Node fetch, and a Playwright browser read. All show `0.379005 < c < 0.380876`, no `0.380868`, last edited 23 January 2026.
- **CI can never do it**, so C-7 stays `manual: true` and keeps reporting UNVERIFIED. That is the "never silently trusted" rule working exactly as designed — and this episode is the argument for keeping it.

Also learned incidentally: three consecutive pushes each filed their own issue (#3, #4, #5) for one underlying condition. **P-3 (one rolling issue) was deferred on the grounds that it only pays during a multi-day real drift — that assumption is now falsified.** Any repeated red files a new issue per push.

## Rules adopted

1. **Test a capability from where it will run.** Before declaring a source fetchable, fetch it *from CI* — or treat the local result as a hint, never a verdict.
2. **`manual: true` still requires proof the fetch fails** — but the proof must come from the runner, not the laptop.
3. **Do not re-automate C-7 on the strength of a local 200.** It has now been tried; it fails in CI. If you want to revisit, the only evidence that counts is a green CI run.
