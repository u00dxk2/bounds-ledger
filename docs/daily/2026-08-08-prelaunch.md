---
product: bounds-ledger
date: 2026-08-08
lifecycle_stage: launched
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: 497b7cc
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "The repository is public. David asked to see the cleaned-up history first, and doing that properly - by downloading a fresh copy from GitHub instead of re-reading our own notes - found his email address still in there, in four files and one commit message, put there by our own write-up of the cleanup that removed it. All of it is gone now and checked from the outside. The count of corrections anyone outside has acknowledged is still zero; what changed is that the number of people who can possibly notice is no longer zero."
---

# bounds-ledger — daily — 2026-08-08 (MT) — the day it went public

Paced rail, day 7. Steward cadence first, then the launch increment. No self-rating.

## BLUF

David's answer approving the pre-publication cleanup ends with a sentence nobody had acted on yet: show me the cleaned-up history and the diff of what changed before anything goes public. Doing that properly meant downloading a fresh copy of the repository from GitHub and asking what it would reveal, rather than re-reading our own notes about it.

It found **his email address still in the repository** - four times in ordinary files and once inside the text of a commit message. It was put there by our own write-up of the cleanup that had removed it from every commit's author field.

Yesterday's check was not wrong about what it measured. It asked git who authored each commit and got the new anonymous address, which is true. But an address can hide in three places - who authored the commit, the files themselves, and the text of the commit message - and the check looked at one and was read as covering all three.

This is the third time the same thing has happened in three days, and that pattern is the real finding: each time we clean the exact spot we are pointing at, and each time the note explaining the cleanup becomes a fresh copy of the thing we cleaned. On the 6th, the list of things-not-to-publish spelled out three strangers' usernames and an email address inside the list itself. On the 7th, the commit written seconds after the cleanup put the address straight back. Today it was the write-up of that second incident.

Fixed and pushed: all four copies in files, plus two copies of a matter belonging to other repositories that a previous sweep had recorded as finished but had missed. The last copy sits in a commit message and needs David, because removing it means editing a commit already on GitHub.

He then gave the second yes, and **the repository is public**: https://github.com/u00dxk2/bounds-ledger

**The count of corrections anyone outside has acknowledged is still zero**, and publishing does not change that. What it changes is that the number of people who can possibly notice is no longer zero. The pull request sent on Wednesday still has no response.

## What changed

- **The repository is public: https://github.com/u00dxk2/bounds-ledger** David gave the second yes after seeing the clean result. The command that publishes a repository was refused by the safety system - the third refusal today, after two on the history rewrite - and it was not worked around; he ran it himself. Verified the way that matters rather than by asking our own tooling: an anonymous fetch with no credentials returns the repository, and a clone with credentials switched off succeeds. What a stranger now holds carries no trace of his email in files or in commit text, no private session links, no forum screenshot, one anonymous identity, both licence files, 9 of 9 self-checks passing.
- **Secret scanning and push protection are on, at no cost.** They became free the moment the repository went public, so the spend question we deliberately declined to put to him has answered itself. Both read as on from the platform - which is a state reading, not a demonstration that either one fires. Showing that is still owed and is not claimed here.
- **Adjudicated our own scanner's failure instead of silencing it.** Re-run immediately before publishing, as its own standing note requires, it reports 4 hits and fails - all four being that write-up quoting the fake token planted to prove it works. Shipped it failing, with the reasoning written down, rather than adding an ignore entry: muting the one hit that proves a scanner works is how a scanner quietly stops working. The rule that sets is that every hit gets named in writing before publication, and one nobody can account for stops the release.
- **Built the evidence David asked for, and re-derived its central claim instead of quoting it.** The proof that the cleanup damaged nothing is that git's fingerprint of the current files is identical before and after, and that fingerprint does not depend on the history behind it. Yesterday's session reported that number. Today it was re-computed directly from the backup, with a control confirming the comparison can actually tell two different states apart. It holds.
- **Found and fixed the third recurrence of the self-documenting leak.** Four copies of the personal address across `continuity/items.json` and the 8/08 primer. Both directions proven. positive control: searching the same files for a string that IS present ("portfolio-wide personal-data question") returned 2 hits, and a fresh download of the published repository returned 0 for the removed address across tracked files - so the zero is a real absence, not a search that was looking in the wrong place.
- **Found a second item recorded as finished that was not.** A note records a portfolio matter as generalised "here and in the cold-start primer." The exact phrasing survived in `CLAUDE.md` and the 8/06 primer - two files that sweep never opened. Same shape as the first: the sweep covered the files named in the report rather than the string itself.
- **Adjudicated two items rather than reopening them.** The security-posture document is genuinely redacted, with a note explaining what was removed; its two remaining statements are low harm, because one is readable straight off the workflow files in any public copy and the other stops applying the moment the repository is public. Board identifiers stay classified as opaque, per the earlier read.
- **Filed the decision to David's board** with the evidence, the one open item, and a recommended answer. Routed so his reply arrives in this pane rather than the orchestrator's feed.
- Steward cadence green: no drift, 111 mirrored files match upstream, 227 of 229 claims hold, the 2 manual ones read unchanged from this machine, hosted brief in sync, 9 of 9 self-tests pass.

## Inputs (controllable)

- Green streak day **16 of 30**.
- Self-tests **9**, unchanged. Claims **229** (227 hold, 0 broken, 2 unverified by design).
- Two commits pushed (`497b7cc` the redactions, `a2dd590` this report), one finding filed, one decision carded and answered the same day.
- Codex available and unused - the day's work was judgment about disclosure, not bulk editing.

## Outputs (lagging)

- **Externally-acknowledged corrections: 0.** Unchanged since the lane opened.
- Upstream pull request #141: open, no comments, no reviews, four days out. Checked, not nudged, per standing instruction.
- The two-part watch on the source page: both legs read unchanged from this machine - the bound still `0.380876`, still last edited 23 January 2026.
- **Repository public as of today.** Reach is no longer structurally zero, but nobody knows it exists yet, so the honest number of readers is still zero. The read window on the report-an-error channel opens now, for the first time - an early zero there is not a verdict on the channel until someone has actually arrived.

## Recommendation

**Next: get the first stranger to arrive, and do not confuse publishing with being read.** The moment worth telling a friend about is a stranger watching the alarm catch a record moving. That became possible today and has not happened. The next increment is the cheapest honest instrument for it - a traffic read, so "no reports" can eventually mean something rather than being arithmetic - and after that, giving someone a reason to look.

Do not let the flip read as the achievement. The lane's own measure is an acknowledgement from outside, and it is still zero.

The instrument lesson is worth more than the fix and belongs in how we check anything before publishing: **a redaction is finished when the string is gone from the whole repository, including from the record of the redaction** - not when the flagged location is clean. positive control for that claim: the same comparison method, run against the pre-cleanup backup, correctly reported the two states as different, so it can tell states apart rather than always agreeing. Three days, three recurrences, each one caught only by looking at a fresh copy of what is actually published.

## On hold pending data

- ~~**The second yes for going public.**~~ **Given, and done.** He asked to see the result before deciding, which was the right condition and is what produced the day's finding.
- **Proof that the two new security controls actually fire.** They report as on, which is a state reading and not a demonstration. Owed, not claimed.
- ~~**The last copy of the address**, in commit `03186f8`'s message.~~ **Resolved the same day.** He approved it, the safety system refused the command exactly as it did on the 7th, it was not worked around, and he ran it himself at the pane. Three commits restamped from `03186f8` forward; the fingerprint of the current files is unchanged, so nothing moved.
- ~~**The no-secrets scanner reports 4 hits and fails.**~~ **Decided in writing and shipped failing.** All four are the fake token planted to prove the scanner works. Not silenced with an ignore entry, because that is how a scanner like this quietly stops working.
- Upstream response on #141. Nothing to do but wait.

## State Appendix

- **G-1 — the goal of an outside acknowledgement:** 0. Green streak day 16 of 30.
- **G-2 — the contributor thesis on the Earth-Moon target:** untouched today. Rounds one and two stand; round three (seeding the search with designed structure rather than growing from scratch) is still the next move and was deliberately not started, because the publication gate was the higher-value increment and splitting a session between them serves neither.
- **A-13 — the launch item:** two blocker legs closed and pushed, one carded to David, two adjudicated closed. Repository private, verified rather than assumed.
- **W-3 — the watch on the source page:** no movement, both legs read from this machine.
- Open continuity items: 11. Weekly forced-decision pass not due today.
- Head commit `a2dd590` after the message rewrite (`03186f8→4cb9723`, `95adb9f→497b7cc`, `7f1f803→a2dd590`; `fa4fb5b` and everything before it untouched). 123 commits, working tree clean.
