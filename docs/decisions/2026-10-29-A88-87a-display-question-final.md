# A-88 — the 87a display question, final text for David (2026-10-29)

Written 2026-10-29 (MT). This is the successor to `docs/decisions/2026-10-23-A88-87a-display-question-draft.md`, which holds the history and the two 10-23 review rounds. Nothing has been sent, and nothing will be without David's yes. Ledger row `A-88` (draft the display-convention question once upstream answers pull request 244). The census that raised the question is `A-76` (`scripts/decimal-vs-exact.mjs`).

## What changed since the 10-23 draft

- **The trigger fired.** Upstream pull request 244 (our 13a citation fix) merged on 2026-10-26 at 03:45:09Z (`gh pr view 244 --repo teorth/optimizationproblems --json state,mergedAt`, stamped in `continuity/read-outputs/A-88.txt`). The row's 10-27 note records that the repository's maintainer merged it.
- **Upstream pull request 243 merged too** (2026-10-26 at 03:53:53Z), so the 10-23 reason for leaving 1d out ("while 243 is open") no longer holds. See the 1d section below.
- **Census re-run 2026-10-29.** `node scripts/decimal-vs-exact.mjs --root C:/dev/skylark/bounds-ledger` exit 1, `RESULT: CUT — 3 member(s)`. Those are its only CUT lines:
  - `1d.md:19` upper — prints 1.463071582607559; its comment says 1.4630715826075593…
  - `A-47-0075 87a.md:17` upper — prints 1058.565; the source states 4√70035 (in [1058.565066, 1058.565067])
  - `A-47-0019 1b.md:22` upper — prints 0.380926; the source states 0.3809268534330870

## 87a: the question

The mirrored `constants/87a.md` upper-bound table, as of the 2026-10-28 snapshot (upstream sha `87b4ebb`, which does not exist in this repo):

- line 17: `| $1058.565$ | [Mar1978] | Martinet's original construction … |`
- line 19: `| $913.493$ | [Mar2006] | … root discriminant $< 913.4927$. |`
- line 20: `| $857.567$ | [HMR2019] | … $< 857.5662\dots$ … |`

Two of the table's four rows print their bound rounded up from the value their own comment gives (913.4927 → 913.493, 857.5662… → 857.567). The [Mar1978] row prints 1058.565, which sits below the value Martinet proves. Martinet, *Inventiones Mathematicae* 44 (1978), p. 69, Exemple 4.2, gives the root discriminant as 2²(3·5·7·23·29)^{1/2} = 1058,565…, and p. 66 states the bound as < 1059 (depth-audit entry `A-47-0075`). 4√70035 = 1058.5650664933…, so 1058.565 is about 6.6 × 10⁻⁵ below it. The [HMR2019] row lists the better bound, so this is a historical row and the README's best-bound cell is unaffected. Upstream's CONTRIBUTING.md calls the tables "histories, not just leaderboards".

The cell form `$<exact form> \approx <decimal>$` is already in use upstream, for example `constants/10c.md:47` `$\sqrt{2}\approx 1.414214$` and `constants/11a.md:36` `$\sqrt{\pi/2} \approx 1.25331$`.

## 1d: one sentence, not a second question

`constants/1d.md` now lists the [CERT2026] certificate twice: line 19, `$1.463071582607559*$` (the original row, starred), and line 23, `$1.4630715826075594$` (the rounded-up, unstarred row, last in the table). Pull request 243's own diff replaced line 19 in place (`gh pr diff 243 --repo teorth/optimizationproblems`: one `-` line and one `+` line for that row). The merged file kept both, with three later rows between them. The upstream history shows the maintainer merged several pull requests touching that file within about two minutes that night (`gh api "repos/teorth/optimizationproblems/commits?path=constants/1d.md"`: merges of #247, #248, #234 and #261 at 03:51:37Z to 03:53:20Z, then a fix-up commit restoring escapes that #261 had reverted). Why the old row survived is not read. None of the three open pull requests touching 1d (#286, #271, #269, from the 10-28 listing in `ledger/open-pull-requests.json`) removes it: each diff was read on 2026-10-29 for a `-` line carrying `1.463071582607559`, and none has one.

The duplicate is not a display-convention question. Rounding up has already been done upstream, by someone else. So 1d gets one sentence in the text, framed as an observation, and does not ask anyone to change a convention.

## 1b: left out, as on 10-23

Upstream pull request 158 (merged 2026-09-05) deliberately changed that row from 0.380927 to 0.380926. The 10-23 draft records the reasoning and the three earlier times this lane raised the digit.

## Our other open asks to this maintainer (read 2026-10-29)

- Issue 218 (the 46a credit question, watched by ledger row `W-14`): OPEN, created 2026-10-07T19:39:29Z, updatedAt the same instant, so there has been no activity in 22 days (`gh issue view 218 --repo teorth/optimizationproblems --json state,closedAt,updatedAt,createdAt`).
- `A-91` (upstream's 67a cites a preprint its author withdrew): drafted and held at the outward gate. Not sent.
- Our merged pull requests: #141 (2026-08-11), #194 (2026-09-26) and #244 (2026-10-26). Issue 150 is closed (2026-08-23). (`gh pr list --author u00dxk2 --state all` and `gh issue list --author u00dxk2 --state all`, both 2026-10-29.)

So sending either form below makes this our second open item with this maintainer, after issue 218. If `A-91` is also sent later, it would be the third.

## Form A — an issue (asks his preference)

> **87a: the [Mar1978] row prints 1058.565, slightly below the bound Martinet proves**
>
> The [Mar1978] row in `constants/87a.md` reads $1058.565$. Martinet (Inventiones Mathematicae 44 (1978), 65–73) gets the bound from the field Q(√2, √(3·5·7·23·29)), whose root discriminant is 2²(3·5·7·23·29)^{1/2} = 4√70035 = 1058.565066… (Exemple 4.2, p. 69; the paper prints 1058,565…), and states the bound as < 1059 in the introduction (p. 66). Read as an exact upper bound, 1058.565 is about 6.6 × 10⁻⁵ below what the paper proves. The [Mar2006] and [HMR2019] rows in the same table print their bounds rounded up (913.493 and 857.567).
>
> Would you like it printed as $4\sqrt{70035} \approx 1058.565066$, as $1058.566$, or left as it is? It is a superseded row, so the README cell is unaffected. I can send a pull request for whichever you prefer.
>
> Two smaller things I noticed and have not raised separately: the [H2016] row in `constants/1b.md` has the same shape, but #158 deliberately changed it to the abstract's digits; and `constants/1d.md` now lists the [CERT2026] certificate twice ($1.463071582607559*$ and $1.4630715826075594$), although #243's diff replaced the first row rather than adding a second.
>
> Source: page images of the volume at the Göttingen Digitisation Centre, https://gdz.sub.uni-goettingen.de/id/PPN356556735_0044
>
> AI use: prepared with AI assistance (Claude drafted it and helped read the cited pages; OpenAI's Codex reviewed the text and the arithmetic). I verified the reference and every figure above against the paper myself.

## Form B — a pull request (one cell)

Diff, `constants/87a.md` line 17 only:

```
-| $1058.565$ | [Mar1978] | Martinet's original construction of infinite $2$-class field towers of totally real number fields. |
+| $4\sqrt{70035} \approx 1058.565066$ | [Mar1978] | Martinet's original construction of infinite $2$-class field towers of totally real number fields. |
```

Pull request title and description:

> **87a: print the [Mar1978] bound as 4√70035 ≈ 1058.565066**
>
> The row read $1058.565$, which is about 6.6 × 10⁻⁵ below the bound Martinet proves. Martinet (Inventiones Mathematicae 44 (1978), 65–73) gets it from the field Q(√2, √(3·5·7·23·29)), whose root discriminant is 2²(3·5·7·23·29)^{1/2} = 4√70035 = 1058.565066… (Exemple 4.2, p. 69; the paper prints 1058,565…). This prints the exact form beside the decimal, as `constants/10c.md` and `constants/11a.md` already do for their bounds, so the cell keeps the paper's digits and is exact. Happy to print $1058.566$ instead, matching the rounded-up [Mar2006] and [HMR2019] rows, if you prefer.
>
> Two smaller things I noticed and have not changed: the [H2016] row in `constants/1b.md` has the same shape, but #158 deliberately changed it to the abstract's digits; and `constants/1d.md` now lists the [CERT2026] certificate twice ($1.463071582607559*$ and $1.4630715826075594$), although #243's diff replaced the first row rather than adding a second.
>
> Source: page images of the volume at the Göttingen Digitisation Centre, https://gdz.sub.uni-goettingen.de/id/PPN356556735_0044
>
> AI use: prepared with AI assistance (Claude drafted it and helped read the cited pages; OpenAI's Codex reviewed the text and the arithmetic). I verified the reference and every figure above against the paper myself.

## The self-check that makes "send" true

The AI-use sentence is in David's voice. Upstream's AI-use policy asks the human contributor to review and verify all references and other information the AI provided. So a yes on the card counts only as his statement that he did these four things himself, at the link above:

1. p. 65 shows *Inventiones math.* 44, 65–73 (1978) and the author Jacques Martinet;
2. p. 69 (Exemple 4.2) shows the field Q(√2, √(3·5·7·23·29)) and 2²(3·5·7·23·29)^{1/2} = 1058,565…;
3. p. 66 states the bound < 1059;
4. the live `constants/87a.md` on upstream still reads `$1058.565$`, with 913.493 and 857.567 below it, and `constants/1d.md` still lists both [CERT2026] rows.

If he would rather not check, nothing is sent.

## Recommendation for David

Send Form B (the one-cell pull request). It is our pattern that has worked three times with this maintainer (#141, #194, #244 all merged). It changes one cell, keeps the paper's digits, and so does not run into the objection behind #158. Form A asks him to do more work for the same result. Do not send at all is also a reasonable answer: the row is superseded, and issue 218 has sat unanswered for 22 days.

## Review record

(Filled in below as the 2026-10-29 rounds run.)
