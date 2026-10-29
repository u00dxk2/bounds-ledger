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

Two of the table's four rows print their bound rounded up from the value their own comment gives (913.4927 → 913.493, 857.5662… → 857.567). The [Mar1978] row prints 1058.565, which sits below the value Martinet proves. Martinet, *Inventiones Mathematicae* 44 (1978), p. 69, Exemple 4.2, gives the root discriminant as 2²(3·5·7·23·29)^{1/2} = 1058,565…, and p. 66 states the bound as < 1059 (depth-audit entry `A-47-0075`). 4√70035 = 1058.5650664933…, so 1058.565 is about 6.6 × 10⁻⁵ below it, and 1058.566 is above it (1058.566² − 16·70035 = 1.976356 > 0). The [HMR2019] row lists the better bound, so this is a historical row and the README's best-bound cell is unaffected. Upstream's CONTRIBUTING.md calls the tables "histories, not just leaderboards".

The cell form `$<exact form> \approx <decimal>$` is already in use upstream, for example `constants/10c.md:47` `$\sqrt{2}\approx 1.414214$` and `constants/11a.md:36` `$\sqrt{\pi/2} \approx 1.25331$`.

## 1d: kept OUT of the text we send

`constants/1d.md` now lists the [CERT2026] certificate twice: line 19, `$1.463071582607559*$` (the original row, starred), and line 23, `$1.4630715826075594$` (the rounded-up, unstarred row, last in the table). That is a duplicated row, not a display-convention question, and `A-88` covers only the display question. So it is left out of the outbound text. If it is worth raising, it needs its own row, its own review and David's own yes.

What this lane read on 2026-10-29, recorded for that later decision (each was read by this session; the Codex review could not repeat these reads because its GitHub calls failed at a network proxy):

- `gh pr diff 243 --repo teorth/optimizationproblems`: for `constants/1d.md`, one `-` line (the starred row) and one `+` line (the rounded-up row) in the same place. As proposed, 243 replaced the row.
- `gh api "repos/teorth/optimizationproblems/commits?path=constants/1d.md"`: merges of #247, #248, #234 and #261 between 03:51:37Z and 03:53:20Z on 2026-10-26, then a commit at 03:53:47Z whose message says it restores escapes that #261 reverted. Why the old row survived is not read.
- Open pull requests #286, #271 and #269 touch 1d (the 10-28 listing in `ledger/open-pull-requests.json`). Their diffs, read 2026-10-29, have no `-` line carrying `1.463071582607559`, so none removes the old row.

## 1b: one parenthetical, as on 10-23

Upstream pull request 158 (merged 2026-09-05) deliberately changed that row from 0.380927 to 0.380926. The 10-23 draft records the reasoning and the three earlier times this lane raised the digit. The issue mentions 1b only to say why it is not raised.

## Why there is no pull-request form

The manager review suggested also offering David a one-cell pull request. It is not offered. `A-88.onTrigger` asks for the question to be drafted as upstream issue text, the row's note calls it a display-convention question that is never sent as a correction, and AGENTS.md (the `decimal-vs-exact.mjs` entry) says the same of every census CUT. A pull request changes the cell, so it is a correction in substance, whatever its description says. The exact form the review suggested ($4\sqrt{70035} \approx 1058.565066$) is one of the options the issue offers. If the maintainer picks one, a pull request for that choice is a separate outward step: it needs its own adversarial refute-it review, its own claims pass, and David's yes on that final text.

## Our other open asks to this maintainer (read 2026-10-29)

- Issue 218 (the 46a credit question, watched by ledger row `W-14`): OPEN on the 2026-10-29 read, created 2026-10-07T19:39:29Z, and its updatedAt is the same instant, so it shows no activity since 7 October (`gh issue view 218 --repo teorth/optimizationproblems --json state,closedAt,updatedAt,createdAt`).
- `A-91` (upstream's 67a cites a preprint its author withdrew): a held watch at the outward gate. No upstream text has been drafted or sent.
- Our pull requests on the 2026-10-29 author listing: #141 (merged 2026-08-11), #194 (merged 2026-09-26) and #244 (merged 2026-10-26). Our issues: #150 (closed 2026-08-23) and #218 (open). (`gh pr list --repo teorth/optimizationproblems --author u00dxk2 --state all` and `gh issue list --repo teorth/optimizationproblems --author u00dxk2 --state all`.)

So, if issue 218 is still open when this is sent, this issue would be our second open item with this maintainer.

## The issue text (the one form)

> **87a: the [Mar1978] row prints 1058.565, slightly below the bound Martinet proves**
>
> The [Mar1978] row in `constants/87a.md` reads $1058.565$. Martinet (Inventiones Mathematicae 44 (1978), 65–73) gets the bound from the field Q(√2, √(3·5·7·23·29)), whose root discriminant is 2²(3·5·7·23·29)^{1/2} = 4√70035 = 1058.565066… (Exemple 4.2, p. 69; the paper prints 1058,565…), and states the bound as < 1059 in the introduction (p. 66). Read as an exact upper bound, 1058.565 is about 6.6 × 10⁻⁵ below what the paper proves. The [Mar2006] and [HMR2019] rows in the same table print their bounds rounded up (913.493 for < 913.4927, and 857.567 for < 857.5662…).
>
> Would you like it printed as $4\sqrt{70035} \approx 1058.565066$, as $1058.566$, or left as it is? It is a superseded row, so the README cell is unaffected. I can send a pull request for whichever you prefer.
>
> (The [H2016] row in `constants/1b.md` reads $0.380926$, the value set by merged pull request #158, so I am not raising it here.)
>
> Source: page images of the volume at the Göttingen Digitisation Centre, https://gdz.sub.uni-goettingen.de/id/PPN356556735_0044
>
> AI use: prepared with AI assistance (Claude drafted it; OpenAI's Codex reviewed it and independently recomputed the arithmetic). I checked the Martinet citation, the field, the displayed formula and the < 1059 statement against the paper, and checked the 87a rows, the README's 87a value, the 1b row and pull request #158 against this repository.

## The self-check that makes "send" true

The last sentence is in David's voice. Upstream's AI-use policy asks the human contributor to review and verify all references and other information the AI provided. So a yes on the card counts only as his statement that he did all of these himself:

At the Göttingen link:
1. p. 65 shows *Inventiones math.* 44, 65–73 (1978) and the author Jacques Martinet;
2. p. 69 (Exemple 4.2) shows the field Q(√2, √(3·5·7·23·29)) and 2²(3·5·7·23·29)^{1/2} = 1058,565…;
3. p. 66 states the bound < 1059.

On upstream's live repository (github.com/teorth/optimizationproblems):
4. `constants/87a.md` still reads `$1058.565$` for [Mar1978], and below it `$913.493$` with "< 913.4927" and `$857.567$` with "< 857.5662" in their comments;
5. the README's 87a best upper bound is 857.567, not the [Mar1978] figure;
6. `constants/1b.md` shows the [H2016] row as `$0.380926$`, and pull request #158 is the merged change that set it.

Who drafted and who reviewed (the AI-use parenthetical) is stated on this card, so it rests on this record rather than on a check of his. The arithmetic (4√70035 = 1058.565066…, a gap of about 6.6 × 10⁻⁵, and 1058.566 above the exact value) was recomputed independently by the Codex review; David can take it from there or recompute it. If he would rather not do the six checks, nothing is sent.

## Recommendation for David

Send it, if the six checks hold for you. It is one historical row, the question offers the maintainer three choices including leaving it, and the text says why 1b is not raised. Not sending is also a reasonable answer: the row is superseded, and issue 218 has had no activity since 7 October.

## Review record

**Codex refute-it review and claims pass, round 1, 2026-10-29, read-only, banner workdir `C:\dev\skylark\bounds-ledger`, session `01a1883b-e6e0-7f01-864d-967bc7720686`, on commit `ebc7b890b8ece7f1bc88bc07704189a8192128c4`. Verdict: NEEDS CHANGES.** Its GitHub reads all failed at a network proxy, so every claim resting on a live upstream read was UNVERIFIABLE to it. The mirror byte-match, the table syntax, the two rounded-up neighbours and the arithmetic HOLD. Dispositions, each checked against source:

1. BLOCKER, the pull-request form contradicts `A-88`'s contract (issue text; never a correction we send). CONFIRMED: Form B removed. See "Why there is no pull-request form".
2. BLOCKER, the 1d aside reports a separate defect in a display-convention question. CONFIRMED: removed from the outbound text, kept here as a record.
3. BLOCKER, the four-item self-check did not cover "every figure above". CONFIRMED: the attestation is narrowed to what David checks, and the checklist now has six items covering every outbound fact.
4. BLOCKER, the 1d history, the open-pull-request diffs and issue 218's state were unverified. PARTLY REFUTED: this session ran each of those reads on 2026-10-29 and they succeeded (outputs in the 1d section and the open-asks section). It stands as a limit of the review, not of the facts. None of the 1d reads is in the outbound text any more.
5. SHOULD-FIX, `A-91` called "drafted". CONFIRMED and reworded: a held watch, nothing drafted or sent. The "third item" count is conditioned.
6. NIT, "22 days". CONFIRMED: now "no activity since 7 October".

**Codex claims pass, round 2, 2026-10-29, read-only, banner workdir `C:\dev\skylark\bounds-ledger`, on commit `84c96bc1940bb991d55f5bf80bcd6b4ca787c371` (no network calls this round, by the prompt). Verdict: NEEDS CHANGES.** It mapped all 28 factual clauses in the issue text to a checklist item or the arithmetic note: 17 covered and holding in the mirror, and the rest on the 1b parenthetical and the attestation. Dispositions:

1. BLOCKER, the 1b parenthetical asserted "same shape", "the abstract's digits" and "have not raised", none of which item 6 covers. CONFIRMED: replaced with the reviewer's narrower sentence (the row reads 0.380926, the value merged #158 set, so not raised here).
2. BLOCKER, the attestation ("its figures", "the other facts above") reached past the six checks. CONFIRMED: it now lists exactly what items 1 to 6 cover, and the computed decimals are attributed to Codex in the AI-use parenthetical. The parenthetical's who-drafted, who-reviewed facts are DELIBERATE: they are disclosures stated on the card, not facts David verifies.
3. SHOULD-FIX, a later pull request needs the whole outward gate, not only a yes. CONFIRMED and reworded.
4. SHOULD-FIX, round 1's disposition 3 was marked confirmed while uncovered clauses remained. CONFIRMED: it is closed by this round's fixes 1 and 2, not by round 1's.

**No round 3.** Both rounds found the same class (an outbound sentence claiming more than the human's check covers). Following the lane's rule for a repeated class, the fix is to claim less. Every outbound factual clause now maps to a numbered check or to the AI-use parenthetical, and the two fixes above are the reviewer's own narrower wording.
