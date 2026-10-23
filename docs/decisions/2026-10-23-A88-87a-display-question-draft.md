# A-88 — the display-convention question, narrowed to one row (87a), held for a maintainer reply on 244

Drafted 2026-10-23 (MT). Nothing was sent, and nothing will be without David's yes. Ledger row `A-88` (draft the question once upstream answers pull request 244). David's answer on board card abab2375, paraphrased: wait for a reply on 244, then bring him the text. The census that raised the question is `A-76` (`scripts/decimal-vs-exact.mjs`).

## State of pull request 244 (read 2026-10-23, about 15:00Z)

`gh pr view 244 --repo teorth/optimizationproblems --json state,reviews,comments,updatedAt,mergedAt,closedAt`: open, not merged or closed, no comments, one review. That review is an approval from an account whose association is CONTRIBUTOR, not a maintainer; the same account approved pull request 243 the same way 36 minutes earlier. In a separate sample, `gh pr list --repo teorth/optimizationproblems --state merged --limit 40 --json number,mergedBy,mergedAt`, the repository owner merged all 40 of the 40 most recent merged pull requests. So `A-88`'s trigger, a maintainer response, has not occurred. The draft below is prepared early so that David can see it; under his answer it waits for that response.

## The three rows the census found

`node scripts/decimal-vs-exact.mjs --root C:/dev/skylark/bounds-ledger`, run 2026-10-23: exit 1, `RESULT: CUT — 3 member(s)`.

- `ledger/teorth-optimizationproblems/constants/87a.md` line 17, `$1058.565$` [Mar1978]. Martinet, *Inventiones Mathematicae* 44 (1978), p. 69, Exemple 4.2, gives the root discriminant as 2²(3·5·7·23·29)^{1/2} = 1058,565…, and p. 66 states the bound as < 1059 (depth-audit entry `A-47-0075`). 4√70035 = 1058.56506649331669696184… (integer square root to 20 places, run 2026-10-23; the reviewer reproduced it).
- `ledger/teorth-optimizationproblems/constants/1b.md` line 22, `$0.380926$` [H2016]. Haugland, arXiv:1609.08000 v1, gives "0.380926..." in the abstract and 0.3809268534330870 on p. 2 (depth-audit entry `A-47-0019`).
- `ledger/teorth-optimizationproblems/constants/1d.md` line 18, `$1.463071582607559$`, whose own Comments cell gives 1.4630715826075593….

Neither the 87a nor the 1b row is the best bound on its page: 87a later lists 857.567 [HMR2019], and 1b later lists the unstarred 0.380868 and smaller starred rows. Upstream's CONTRIBUTING.md calls the tables "histories, not just leaderboards", so a historical row's accuracy still matters even though no current best bound changes.

## Why the question is now one row

**1d: left out.** Upstream pull request 243 (another author's, open and not merged on 2026-10-23) proposes printing it rounded up. It was one of the three rows `A-88` was minted for; 243 is the reason to omit it while that pull request stays open.

**1b: left out, because upstream merged the opposite change on this exact row.** Upstream pull request 158 (opened 2026-08-31, merged 2026-09-05; its own merge record names the repository owner) changed the row from `$0.380927$` to `$0.380926$`. Its description, written by its author rather than the maintainer and paraphrased here: rounding the last place up would still be a valid upper bound, but it disagrees with the abstract's digits and with the neighbouring rows. Read 2026-10-23 with `gh pr diff 158 --repo teorth/optimizationproblems` and `gh pr view 158 --repo teorth/optimizationproblems --json body,mergedAt,mergedBy,createdAt`. Asking to round it up again would ask the owner to undo a change he merged seven weeks ago. Our own record already held the history: `continuity/depth-audit.json` entry `A-47-0015` (field `notesBefore2026_10_11`) calls 0.380926 "the form upstream moved away from on 2026-09-05", and ledger row `W-2` closed the 1b digit on 2026-07-23 as a rounding convention, not a typo. Neither `A-76` nor `A-88` records a search of that history, although `W-11` (search this lane's record before calling a claim decision-ready) asks for one. This is the third time the 1b digit has been raised here.

**87a: kept, as a genuine question.** Pull request 158 decided the 1b row only. It does not set a rule for other rows. It added an ellipsis to 1a's π/2 in the same change, and nothing shows a maintainer has considered 87a. Upstream's CONTRIBUTING.md asks for "the certified value in the Bound column". The certified value here is 4√70035 = 1058.565066…, and a bare `$1058.565$` read as an exact upper bound is about 6.6 × 10⁻⁵ below it.

## The draft issue text (87a only)

> **87a: the [Mar1978] row prints 1058.565, slightly below the bound Martinet proves**
>
> The [Mar1978] row in `constants/87a.md` reads $1058.565$. Martinet (Inventiones Mathematicae 44 (1978), 65–73) gets the bound from the field Q(√2, √(3·5·7·23·29)), whose root discriminant is 2²(3·5·7·23·29)^{1/2} = 4√70035 = 1058.565066… (Exemple 4.2, p. 69; the paper prints 1058,565…), and states the bound as < 1059 in the introduction (p. 66). Read as an exact upper bound, 1058.565 is about 6.6 × 10⁻⁵ below what the paper proves.
>
> Would you like it printed as $4\sqrt{70035} = 1058.565066\dots$, as $1058.566$, or left as it is? It is a superseded row, so the README cell is unaffected. I can send a pull request for whichever you prefer.
>
> (The [H2016] row in `constants/1b.md` has the same shape, but #158 deliberately changed it to the abstract's digits, so I have not raised it.)
>
> Source: page images of the volume at the Göttingen Digitisation Centre, https://gdz.sub.uni-goettingen.de/id/PPN356556735_0044
>
> AI use: prepared with the help of an AI assistant (Claude), which read the cited pages and computed 4√70035. I checked the value against p. 69 of the paper myself.

**The last sentence is in David's voice and must be true when sent.** Upstream's AI-use policy puts the check on the human sender. Before saying yes, David opens p. 69 at the link above (Exemple 4.2) and confirms it prints 2²(3·5·7·23·29)^{1/2} = 1058,565…, and that p. 66 states < 1059. His yes on the card is his statement that he did. If he would rather not check, nothing is sent.

## Recommendation for David

Keep waiting, as his answer asked: `A-88` stays open and is re-dated a week, to 2026-10-30. When a maintainer responds on 244, the lane brings him this 87a text again, re-checked against the live page, for a yes or no. Not recommended: a dated note on our own 87a page giving the value the paper states. AGENTS.md treats a CUT as a question for upstream, never a correction we make. Not built.

## Review record

**Codex claims pass, round 1, 2026-10-23, read-only, banner workdir `C:\dev\skylark\bounds-ledger`, on commit `b1f49073b13c8be36539a69ac0a79f9b6ad60954` (that draft recommended not sending at all and closing `A-88`). Verdict: NEEDS CHANGES.** 36 sentences tagged: 25 HOLDS, 10 REFUTED-AS-WRITTEN (its items 13, 14, 17, 21, 24, 25, 31, 32, 33, 34), 1 UNVERIFIABLE-HERE (item 28). Dispositions, each checked against source:

1. Extending pull request 158 to 87a was an overreach. 158's description is its author's, not the maintainer's. The same pull request added `\dots` to 1a. CONTRIBUTING asks for the certified value. CONFIRMED: 87a is kept as a question, and every sentence claiming a general convention is removed.
2. Closing `A-88` contradicts its `onTrigger` and `closeWhen`, since no maintainer has responded and the census still reports three CUTs. CONFIRMED: the recommendation is now to wait and re-date.
3. The 40-pull-request sample sentence implied that 158 was in the sample. It was not. CONFIRMED and reworded.
4. "1d was never part of this question" was false. CONFIRMED and reworded.
5. 1b's best row was given as 0.380871. The mirror lists a later unstarred 0.380868 (`1b.md:26`). CONFIRMED and fixed here and in the day's report.
6. "Neither row searched the record" cannot be shown from silence. CONFIRMED: narrowed to "records no search".
7. Disclosure: no third-party login, no review text, David paraphrased. HOLDS.

A second round runs on this text because it materially changed.
