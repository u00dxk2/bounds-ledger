# A-88 — the display-convention question for 87a and 1b: recommended NOT to send

Drafted 2026-10-23 (MT). Nothing was sent, and nothing will be without David's yes. Ledger row `A-88` (draft the question once upstream answers pull request 244). David's answer on board card abab2375, paraphrased: wait for a reply on 244, then bring him the text. The census that raised the question is `A-76` (`scripts/decimal-vs-exact.mjs`).

## What the question would have asked

The census (`node scripts/decimal-vs-exact.mjs --root C:/dev/skylark/bounds-ledger`, run 2026-10-23, exit 1, `RESULT: CUT — 3 member(s)`) finds three upper-bound rows whose printed decimal sits below the exact value it stands for, with no mark that it is cut:

- `ledger/teorth-optimizationproblems/constants/87a.md` line 17, `$1058.565$` [Mar1978]. Martinet, *Inventiones Mathematicae* 44 (1978), p. 69, Exemple 4.2, gives the root discriminant as 2²(3·5·7·23·29)^{1/2} = 1058,565…, and p. 66 states the bound as < 1059 (depth-audit entry `A-47-0075`). 4√70035 = 1058.56506649331669696184… (integer square root to 20 places, run 2026-10-23).
- `ledger/teorth-optimizationproblems/constants/1b.md` line 22, `$0.380926$` [H2016]. Haugland, arXiv:1609.08000 v1, gives "0.380926..." in the abstract and 0.3809268534330870 on p. 2 (depth-audit entry `A-47-0019`).
- `ledger/teorth-optimizationproblems/constants/1d.md` line 18, `$1.463071582607559$`, whose own Comments cell gives 1.4630715826075593…. Upstream pull request 243 (another author's, open and not merged on 2026-10-23) already proposes printing it rounded up, so it was never part of this question.

Neither the 87a nor the 1b row is the best bound on its page: 87a's current upper bound is 857.567 [HMR2019] and 1b's is 0.380871 [T2026]. So no current record is affected either way.

## Why it should not be sent

**Upstream has already decided this convention, on the 1b row itself.** Upstream pull request 158 (opened 2026-08-31, merged 2026-09-05 by the repository owner, who merged all 40 of the 40 most recent merged pull requests) changed that row from `$0.380927$` to `$0.380926$`. Its description, paraphrased: rounding the last place up would still be a valid upper bound, but it disagrees with the source's own digits and with the convention of the neighbouring rows, so the row now carries the abstract's figure. Read 2026-10-23 with `gh pr diff 158 --repo teorth/optimizationproblems` and `gh pr view 158 --repo teorth/optimizationproblems --json body,mergedAt,mergedBy,createdAt`. The 1b row is therefore printed exactly as upstream chose to print it, after the rounded-up form had been on the page.

**87a follows the same convention.** Martinet prints 1058,565…, and the row carries those digits with the ellipsis dropped. That is the form pull request 158 chose for 1b, whose abstract also carries an ellipsis ("0.380926...") that the merged row does not. Asking for 87a to be rounded up, or given a `\dots`, would ask upstream to apply to 87a a convention it declined for 1b.

**Our own record already held this.** `continuity/depth-audit.json` (entry `A-47-0015`, field `notesBefore2026_10_11`) calls 0.380926 "the form upstream moved away from on 2026-09-05", and ledger row `W-2` closed the same 1b question on 2026-07-23 as a rounding convention rather than a typo. `W-11` (search this lane's record before calling a claim decision-ready) exists because of the previous recurrence on 2026-09-15. Neither `A-76` nor `A-88` searched it when the question was raised. This is the third time the 1b digit has been raised here.

## What remains true

The census's line is still accurate as a fact: both rows print a decimal below the paper's exact value with no mark. What changed is that "a question for upstream about display convention" has an answer on record for this shape (the source's own digits, ellipsis dropped). `A-88` records that, so the census's CUT for these two rows reads as answered rather than as an open question.

## Recommendation for David

Do not send. Close `A-88` on that answer. Pull request 244 still has no maintainer response (its one review, on 2026-10-23, is an approval from an account whose association is CONTRIBUTOR, and that account left the same approval on pull request 243 36 minutes earlier), so no response there is lost by closing.

A second option, not recommended: a dated note on our own 87a and 1b pages giving the value each paper states. It would put our reading of a paper beside a row upstream has deliberately printed, and AGENTS.md treats a CUT as a question for upstream, never a correction we make. Not built.

## Review record

(Filled in below after the read-only claims pass.)
