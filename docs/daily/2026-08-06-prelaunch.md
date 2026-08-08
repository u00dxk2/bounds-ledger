---
product: bounds-ledger
date: 2026-08-06
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: fbd63e7
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "The list of reasons we could not publish had itself become one of those reasons. It named three strangers by their forum handles and a personal email address, in tracked files, while explaining that those must never be published. Four of the eight publication blockers are now cleared, and two more turned out to have a part we could fix today rather than a part only David can rule on."
---

# bounds-ledger — daily (prelaunch) — 2026-08-06 (MT)

Paced rail, day 5. Steward cadence first, then the launch increment. No self-rating.

## BLUF

The list of reasons we could not publish had itself become one of those reasons.

Yesterday's review gave eight things to fix before this repository can go public. Four are now fixed. Writing them down, though, is what produced today's real finding: two of the eight were filed as problems buried in our commit history that only David can rule on - and both turned out to have a second half sitting in plain sight in today's files. The blocker list named three strangers by their forum handles and named a personal email address, spelled out, in files we were about to publish, inside the sentence explaining that those must never be published. Both are now removed from the working files. The buried half stays untouched and stays his call.

Nothing about the ledger itself moved, which is correct. **The count of corrections anyone outside has acknowledged is still zero.** The pull request sent yesterday has had no reply in about eighteen hours, which is normal this early and is not progress.

## What changed

**Steward cadence, read from the run log rather than the badge.** No drift; 111 files still match upstream `dee1660`. 229 claims, 227 hold, 0 broken, 2 unverified by design — C-7 and C-9, the two claims on a site that refuses automated readers from data centres. **G-1 — the goal that measures whether anyone outside ever confirms one of our corrections — is at green streak day 14 of 30.** A local run with the credential set read both legs of **W-3 — the watch for a reply to the 24 July email** — and both are unchanged: the page still shows the same bound and still says it was last edited on 23 January. No acknowledgement.

**Four publication blockers cleared, in commit `fbd63e7`.**

The mirrored files had no licence statement at all, while this repository redistributes 111 files of someone else's work. Upstream is Apache-2.0 and has no notice file of its own, so its licence is now copied in verbatim alongside the mirror, with a root `NOTICE` recording what was copied, from which commit, and that nothing was edited. Where to put that file was checked by reading the snapshot code rather than guessing: the refresh deletes only the folder of mirrored pages, and the comparison only ever looks at `.md` files, so the licence survives a refresh and is never mistaken for drift.

A generated file was carrying an absolute path from this machine. It is now untracked rather than edited, because it is rewritten every session and nothing in this repository reads it — and the fleet's own test fixture already declares that this file is meant to be ignored. Tracking it here was the odd one out.

An internal engineering review was publishing, control by control, which of our protections are switched off, with the responses proving it. That is a map. The findings, their severity and their fixes all stay; only the values that would tell a reader exactly where the gaps are are now withheld. **Redaction is the publishing fix, not the real one** — the real one is the coordinated fleet wave, which we are explicitly told not to do repo by repo.

**The finding: two blockers were misfiled.** Numbers 5 and 7 were recorded as history-only, needing David. Both also had a working-tree half — the three forum handles and the personal email address, written out in `continuity/items.json` and in today's cold-start primer. Cleared today. The history half is untouched.

**Checked both ways.** The search found those names in two tracked files before and finds none now, while the same search still returns hits for a string that is genuinely present — so the zero is a real zero and not a broken search. Three leftover matches on a number were looked at rather than replaced: two are mathematics, one of them inside a mirrored page, and replacing them blindly would have corrupted the mirror and turned the drift alarm red.

**Ride-along, one line as asked:** every check script in this repository is wired somewhere. Six scripts, zero orphans, controls run both ways.

**A stale card asked David for a decision he had already made.** He was asked to approve sending the pull request. He had approved it yesterday and it went out yesterday. He caught it himself.

## Inputs (controllable)

- Publication blockers cleared: **4 of 8**, plus the near half of two more.
- Self-tests: **5 of 5 pass**. Nothing in the ledger was touched — no claim, bound or pin changed.
- Local checks green with the credential set; hosted brief in sync, all four dated blocks present.
- Orphan audit: 6 scripts, 0 orphans.

## Outputs (lagging)

- **Externally-acknowledged corrections: 0.** Unchanged.
- Pull request `teorth/optimizationproblems#141`: open, no comments, no review, no merge, about eighteen hours old.
- The 24 July email: still unanswered.
- Reachable users: **zero, structurally** — the repository is private, so the report-an-error channel added on 5 August can still be used by nobody.

## Recommendation

Finish the publication package by answering the questions that are David's rather than by doing more work on our own. Three are open and none of them needs engineering: what licence our own scripts and documents carry, whether his quoted private words can appear in a public repository, and whether the three history items are acceptable. The engineering half is nearly done; the decisions are now the blocker.

On the north star: do nothing about the pull request. Watch it, do not chase it, and do not line up a second one while this one has no outcome.

## On hold pending data

- **The flip** — on hold at David's word. Four blockers cleared today, three decisions still his.
- **W-3** — the ack watch. Monitor only; his standing instruction is to wait.
- **W-6 — the read window on the report-an-error channel** — the clock has not started and must not be read early. The repository is private, so the number of people who could file a report is zero. Silence here means nothing yet.
- **#141** — with upstream. Nothing owed by us.

## State Appendix

- **G-1 — the goal tracking whether anyone outside ever confirms one of our corrections:** value 0, green streak day 14 of 30.
- **A-13 — the launch item covering the public flip:** open, on hold. Blockers 1–4 cleared plus the working-tree half of 5 and 7; note18 records the detail.
- **W-3 — the watch for a reply to the 24 July email:** both legs read clean from this machine today. No acknowledgement.
- **W-4 — the watch that every detector proves it can fail:** honoured today, both answers recorded.
- **W-5 — the mirror blind class:** unchanged.
- **W-6 — the read window on the report-an-error channel:** clock not started.
- Ledger: 111 mirrored files at upstream `dee1660`; 229 claims, 227 hold, 0 broken, 2 unverified by design.
- CI: green at `fbd63e7`. Open GitHub issues: 0. Open continuity items: 10.
- Commits today: 1 (`fbd63e7`).
