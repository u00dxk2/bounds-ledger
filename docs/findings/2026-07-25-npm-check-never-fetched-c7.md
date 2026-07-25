# `npm run check` never fetched C-7 — the documented local re-verification didn't exist

**2026-07-25 (second session) · Instrument defect #5 of the 7/25 series. Zero record drift. Caught by executing the deployed command and comparing its output against the claim made about it.**

## What every document said

After the 403-is-IP-dependent episode earlier today, the corrected story was written into C-7's note, W-3's note3, CLAUDE.md, the cold-start primer, and the next-session handoff prompt:

> An agent running `npm run check` on a residential connection **genuinely re-verifies C-7 mechanically**.

## What the deployed instrument actually did

`check-claims.mjs` skipped `manual: true` claims unconditionally — `if (c.manual) { unverified++; rows.push(…); continue; }` — **no fetch, no pin comparison, on any machine**. A residential `npm run check` printed the same UNVERIFIED row CI prints and touched the network for C-7 exactly zero times.

The 7/25 "local Node fetch" that anchored the sentence was an **ad-hoc one-liner**, not the npm script. The sentence generalised a hand test to a command that never did it — the same shape as the method-sentence defect caught at A-3's pre-send review ("cross-checked against the source-paper abstracts" — inherited words describing work that wasn't done), this time aimed at ourselves.

## How it was caught

Session start, 21:04Z: ran `npm run check` locally *expecting* the documented C-7 re-verification, read the output, and the UNVERIFIED row carried no fetch evidence. Read the script: the manual branch has no fetch path. Five minutes, zero tools beyond running the deployed thing — **suspect the instrument before the record** keeps paying because the instrument keeps being the thing that's wrong.

## Fix

The manual branch now attempts an **advisory fetch** (default UA — the configuration proven to get 200 residentially) and prints the result as an indented continuation line:

- local, pin present → `advisory fetch from THIS machine: HTTP 200, expected "0.380876" still present — page unchanged (stays UNVERIFIED; CI cannot see this)`
- local, pin **absent** → a loud NOT FOUND line directing to the claim's watch runbook (for C-7: W-3 `onTrigger`)
- CI / fetch fails → `advisory fetch failed (HTTP 403) — expected from datacenter IPs (CI); hand/local verification still required`

**Counts and exit code are untouched in every case.** The claim stays UNVERIFIED, never green, never broken — this is deliberately NOT a re-run of the reverted C-7 automation, which made the 403 an exit-1 UNREACHABLE. Indented advisory lines cannot match the issue-title extractor's `^BROKEN|^UNREACHABLE|^error:` patterns, so alarm semantics are unchanged.

Verified by execution: local run 21:08Z shows the advisory HOLD line with exit 0 and `223 claim(s): 222 hold, 0 broken/unreachable, 1 unverified (manual)`. CI leg verified on the push run for this commit — green, with the advisory-403 line present in the log (per the standing rule: only a green CI run is evidence).

## Rule adopted

**A capability claim about an instrument is verified by executing the instrument, not by remembering an ad-hoc test that resembled it.** This is the method-sentence rule turned inward: "npm run check re-verifies C-7" was our own method sentence, written five places, checked zero times.
