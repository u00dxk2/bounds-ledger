# A-88 — the display-convention question, narrowed to one row (87a), held for a maintainer reply on 244

Drafted 2026-10-23 (MT). Nothing was sent, and nothing will be without David's yes. Ledger row `A-88` (draft the question once upstream answers pull request 244). David's answer on board card abab2375, paraphrased: wait for a reply on 244, then bring him the text. The census that raised the question is `A-76` (`scripts/decimal-vs-exact.mjs`).

## State of pull request 244 (read 2026-10-23, about 15:00Z)

`gh pr view 244 --repo teorth/optimizationproblems --json state,reviews,comments,updatedAt,mergedAt,closedAt`: open, not merged or closed, no comments, one review. That review is an approval from an account whose reported GitHub association is CONTRIBUTOR, not OWNER, MEMBER or COLLABORATOR; the same account approved pull request 243 the same way 36 minutes earlier. In a separate read, `gh pr list --repo teorth/optimizationproblems --state merged --limit 40 --json number,mergedBy,mergedAt`, the repository owner merged all 40 pull requests it returned. The read shows no response from the owner, so we treat `A-88`'s trigger, a maintainer response, as not yet met. The draft below is prepared early so that David can see it; under his answer it waits for that response.

## The three rows the census found

`node scripts/decimal-vs-exact.mjs --root C:/dev/skylark/bounds-ledger`, run 2026-10-23: exit 1, `RESULT: CUT — 3 member(s)`.

- `ledger/teorth-optimizationproblems/constants/87a.md` line 17, `$1058.565$` [Mar1978]. Martinet, *Inventiones Mathematicae* 44 (1978), p. 69, Exemple 4.2, gives the root discriminant as 2²(3·5·7·23·29)^{1/2} = 1058,565…, and p. 66 states the bound as < 1059 (depth-audit entry `A-47-0075`). 4√70035 = 1058.56506649331669696184… (integer square root to 20 places, run 2026-10-23; the reviewer reproduced it).
- `ledger/teorth-optimizationproblems/constants/1b.md` line 22, `$0.380926$` [H2016]. Haugland, arXiv:1609.08000 v1, gives "0.380926..." in the abstract and 0.3809268534330870 on p. 2 (depth-audit entry `A-47-0019`).
- `ledger/teorth-optimizationproblems/constants/1d.md` line 18, `$1.463071582607559$`, whose own Comments cell gives 1.4630715826075593….

Neither the 87a nor the 1b row is the best bound on its page: 87a later lists 857.567 [HMR2019], and 1b later lists the unstarred 0.380868 and smaller starred rows. Upstream's CONTRIBUTING.md calls the tables "histories, not just leaderboards", so a historical row's accuracy still matters even though no current best bound changes.

## Why the question is now one row

**1d: left out.** Upstream pull request 243 (another author's, open and not merged on 2026-10-23) proposes printing it rounded up. It was one of the three rows `A-88` was minted for; 243 is the reason to omit it while that pull request stays open.

**1b: left out, because upstream merged the opposite change on this exact row.** Upstream pull request 158 (opened 2026-08-31, merged 2026-09-05; its own merge record names the repository owner) changed the row from `$0.380927$` to `$0.380926$`. Its description, written by its author rather than the maintainer and paraphrased here: rounding the last place up would still be a valid upper bound, but it disagrees with the abstract's digits and with the neighbouring rows. Read 2026-10-23 with `gh pr diff 158 --repo teorth/optimizationproblems` and `gh pr view 158 --repo teorth/optimizationproblems --json body,mergedAt,mergedBy,createdAt`. Asking to round it up again would ask the owner to undo a change he merged seven weeks ago. Our own record already held the history: `continuity/depth-audit.json` entry `A-47-0015` (field `notesBefore2026_10_11`) calls the rounded-up 0.380927 "the form upstream moved away from on 2026-09-05", and ledger row `W-2` closed the 1b digit on 2026-07-23 as a rounding convention, not a typo. Neither `A-76` nor `A-88` records a search of that history, although `W-11` (search this lane's record before calling a claim decision-ready) asks for one. This is the third time the 1b digit has been raised here.

**87a: kept, as a genuine question.** Pull request 158 chose the 1b display explicitly and, in the same change, added an ellipsis to 1a's π/2; nothing in it addresses 87a, and it states no rule for other rows. Upstream's CONTRIBUTING.md asks for "the certified value in the Bound column". The certified value here is 4√70035 = 1058.565066…, and a bare `$1058.565$` read as an exact upper bound is about 6.6 × 10⁻⁵ below it.

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
> AI use: prepared with AI assistance (Claude drafted it and helped read the cited pages; OpenAI's Codex reviewed the text and the arithmetic). I verified the reference and every figure above against the paper myself.

**The last sentence is in David's voice and must be true when sent.** Upstream's AI-use policy requires the human contributor to review and verify all references and other information the AI provided. The card therefore makes "send" conditional on a checklist he does himself: at the link above, p. 65 shows *Inventiones math.* 44, 65–73 (1978) and the author Jacques Martinet; p. 69 (Exemple 4.2) shows the field Q(√2, √(3·5·7·23·29)) and 2²(3·5·7·23·29)^{1/2} = 1058,565…; p. 66 states the bound < 1059; and the mirrored `constants/87a.md` row still reads `$1058.565$`. A yes counts only as his statement that he did all four. If he would rather not check, nothing is sent.

## Recommendation for David

Keep waiting, as his answer asked. `A-88` stays open on its current check date, 2026-10-24. If there is still no maintainer response then, it is re-dated one week, to 2026-10-31. If a maintainer responds, `A-88`'s own steps run in full before anything reaches him: re-run the census, shrink the question if the rows changed, redraft, run the refute-it review and a claims pass again, and only then card the final text. Today's text may not survive that unchanged. Not recommended: a dated note on our own 87a page giving the value the paper states. AGENTS.md treats a CUT as a question for upstream, never a correction we make. Not built.

## Review record

**Codex claims pass, round 1, 2026-10-23, read-only, banner workdir `C:\dev\skylark\bounds-ledger`, on commit `b1f49073b13c8be36539a69ac0a79f9b6ad60954` (that draft recommended not sending at all and closing `A-88`). Verdict: NEEDS CHANGES.** 36 sentences tagged: 25 HOLDS, 10 REFUTED-AS-WRITTEN (its items 13, 14, 17, 21, 24, 25, 31, 32, 33, 34), 1 UNVERIFIABLE-HERE (item 28). Dispositions, each checked against source:

1. Extending pull request 158 to 87a was an overreach. 158's description is its author's, not the maintainer's. The same pull request added `\dots` to 1a. CONTRIBUTING asks for the certified value. CONFIRMED: 87a is kept as a question, and every sentence claiming a general convention is removed.
2. Closing `A-88` contradicts its `onTrigger` and `closeWhen`, since no maintainer has responded and the census still reports three CUTs. CONFIRMED: the recommendation is now to wait and re-date.
3. The 40-pull-request sample sentence implied that 158 was in the sample. It was not. CONFIRMED and reworded.
4. "1d was never part of this question" was false. CONFIRMED and reworded.
5. 1b's best row was given as 0.380871. The mirror lists a later unstarred 0.380868 (`1b.md:26`). CONFIRMED and fixed here and in the day's report.
6. "Neither row searched the record" cannot be shown from silence. CONFIRMED: narrowed to "records no search".
7. Disclosure: no third-party login, no review text, David paraphrased. HOLDS.

**Codex claims pass, round 2, 2026-10-23, read-only, banner workdir `C:\dev\skylark\bounds-ledger`, on commit `580799e38a86856485ab0d25f69c1dd9e993977b`. Verdict: NEEDS CHANGES.** All seven round-1 dispositions confirmed landed. The arithmetic (4√70035 = 1058.565066493316696961846763…, the gap 6.6493 × 10⁻⁵, 1058.566 a valid upper bound), the page references, the name "root discriminant" for d^{1/4} of this degree-4 field, the #158 parenthetical and the disclosure check all HOLD. Dispositions:

1. The `A-47-0015` quotation was reversed: the form upstream moved away from is 0.380927. CONFIRMED and fixed.
2. "Decided the 1b row only" ignored its 1a change, and "nothing shows a maintainer considered 87a" was an unbounded absence. CONFIRMED and narrowed.
3. "The 40 most recent" and "not a maintainer" overstated what the reads show. CONFIRMED and narrowed to the reported association and "all 40 it returned".
4. The re-date to 2026-10-30 contradicted the row: its check date is 2026-10-24, and a re-date then gives 2026-10-31. And bringing "this text again" skipped the trigger's own steps. CONFIRMED and fixed.
5. The AI-use paragraph named only Claude and had David verify one value, where the policy covers all references and information. A bare yes would not attest that. CONFIRMED: both models are named, the sentence covers everything, and the card makes "send" conditional on a four-item checklist.
6. Round-1 history items it could not inspect without git: DELIBERATE. They are this file's record of what happened, not claims sent upstream.

No round 3. These are narrowings in the reviewer's own words. The AI-use sentence was already in the attestation shape (it states only what David's yes attests, the shape the A-87 rounds settled on). And any maintainer response re-opens the full review loop under `A-88.onTrigger` before anything is sent.
