# A-92 — results that rest on the Exponential Time Hypothesis: design and pilot (2026-10-30)

Written 2026-10-30 (MT), cycle 2. **Design and pilot only. Nothing renders and nothing is sent.** David adopted this area in chat at about 13:40 MT on 2026-10-30 (paraphrased: he said yes to designing and piloting a third watched area, results that rest on ETH). Adopting an area is his call alone (CLAUDE.md, second-surface rule), and this paraphrase is the record of that call. Ledger row `A-92`; it links `G-4` (an outside party acts on a watched item without us filing the report) and `A-47` (the depth audit, whose draw-before-read pattern the pilot uses).

## The idea

A theorem proved under ETH stays true as a conditional statement. But its hypothesis is now reported refuted, so a reader citing the theorem as evidence that a problem is hard needs to know that the support has been reported withdrawn. The ledger would record, per paper, what the paper itself states its result rests on. It never says the result is false.

## What the primary sources say (read 2026-10-30)

Everything below was read from these documents, not from news coverage.

- **OpenAI.** `github.com/openai/math` at `4eaee87` (an upstream sha; it does not exist in this repo). Family 378 in `CONTENTS.md`, "Disproof of the Exponential Time Hypothesis", gives a deterministic algorithm that counts satisfying assignments of a k-CNF in time (n+m)^{O_k(1)}·2^{n/(log n)^{1/2+o(1)}} and polynomial space. `history.md` (26 October 2026) says an independent working group led by Russell Impagliazzo, Ramamohan Paturi and Ryan Williams will examine and explain the proof. Its Lean doc, `lean/docs/378.md`, scopes the formal statement (`lean/ComparatorChallenges/SubexponentialSAT.lean`) at a weaker bound than the headline, 2^{O_k(n (log log n)² / √log n)}, which is still subexponential.
- **Anthropic.** `github.com/anthropics/formal-math` at `16a5ce4` (an upstream sha; it does not exist in this repo), folder `eth/`. The paper, *A 2^{o(n)} Time Algorithm for 3-SAT*, is credited to Claude (`eth/paper.pdf`, SHA-256 `7af518b09342c967…`). It claims #3-SAT in time 2^{O(n log log n / √log n)}. The README states the Lean statement file (`MainResults.lean`), its two theorems (`ethIsFalse`, `mainTheorem`), and the axiom check. Appendix E of the paper says the Lean development was written by AI models, reviewed by other instances of the same models, and that at the time of writing no person is known to have checked it.
- **The paper's count of ETH-dependent work.** One sentence in the Anthropic paper's introduction says a literature search by Claude found more than 800 papers that prove at least one result of their own only under ETH or a hypothesis implying it (SETH, Gap-ETH). It did not count results also proved under a hypothesis the paper does not refute, such as Orthogonal Vectors. The paper also says it does not refute the Orthogonal Vectors hypothesis.
- **The list behind that count is not published, as far as was searched.** Searched: the paper's full text, for links, supplements and list language (only the Lean link and one OpenAI path appear); the complete, untruncated file tree of `anthropics/formal-math` at `16a5ce4`, filtered to data-file extensions under `eth/`, which found only `README.md`, `comparator.json`, `lake-manifest.json` and `proof/README.md`; and GitHub code search over the repository. Its Appendix H is about the algorithm's eight-square identity, not the literature search. So "more than 800" is a figure this ledger can quote, with its source, and cannot reproduce. It is never a denominator here. The tree read, to repeat it: `gh api repos/anthropics/formal-math/git/trees/16a5ce41304fcdaea4e0be7c132e1c361dc26da5?recursive=1 --jq '(.truncated|tostring), ([.tree[] | select(.type=="blob") | .path | select(test("(csv|json|tsv|bib|yaml|txt|md)$")) | select(startswith("eth/"))] | .[])'`. It printed `false` and the four files named above. The code search: `gh api "search/code?q=repo:anthropics/formal-math+ETH+papers"` (31 hits, all Lean or docs files, none a list). The PDF's SHA-256 is of the file downloaded on 2026-10-30: `Invoke-WebRequest -Uri https://raw.githubusercontent.com/anthropics/formal-math/16a5ce41304fcdaea4e0be7c132e1c361dc26da5/eth/paper.pdf -OutFile paper.pdf`, then `Get-FileHash paper.pdf -Algorithm SHA256`.

## The population this ledger can count

Frame: every arXiv entry whose abstract contains the exact phrase "exponential time hypothesis". **638 entries**, fetched 2026-10-30 at 20:23:32Z through the arXiv API query `search_query=abs:"exponential time hypothesis"`. It was accepted only because the distinct ids returned (638) equal the total the API states (638). The fetch-and-draw script is local, kept beside the frame as `tmp/eth-pilot-2026-10-30/eth-frame.mjs` and not committed. It refuses (exit 2) a frame whose distinct ids do not equal the stated total.

This frame differs from the paper's 800 in both directions, and the two figures are never compared as if they measured one thing:
- It misses papers that use ETH only in the body, or say only "SETH" or "ETH" in the abstract. The same API on the same day returned `opensearch:totalResults` 44 for `http://export.arxiv.org/api/query?search_query=abs:%22Gap-ETH%22&start=0&max_results=1` and 231 for the same URL with `abs:%22strong%20exponential%20time%20hypothesis%22`. These are count reads only, with no frame saved; the second is largely inside the 638.
- It includes papers whose abstract mentions ETH while their results do not rest on it: algorithms, surveys, tightness remarks.
- It is arXiv only.

A full frame would need the union of phrase and acronym queries, with the acronym disambiguated (ETH Zurich, Ethereum), plus non-arXiv venues. That is the `/deep-research` question below, not a guess made here.

## What the ledger would assert, per paper

The minimum, and nothing stronger: **this paper states its result R under hypothesis H, and H is reported refuted, by one of two named routes.** Route 1, *by implication*: H implies ETH, so ETH's failure refutes it (SETH, Gap-ETH, randomized ETH). Route 2, *directly*: the reported algorithms contradict H themselves, although ETH's failure alone would not. `#ETH` is route 2 only. ETH implies #ETH, not the reverse, but both preprints give subexponential *counting* algorithms, which contradict #ETH directly. Every row names its route. Hypotheses the reported algorithms leave standing include Orthogonal Vectors (the Anthropic paper says so), 3SUM, APSP, the k-Clique hypothesis and the Set Cover Conjecture: falsifying ETH does not by itself give a faster algorithm for any of them. The source of that sentence is the paper's own statement of R (a theorem number and page), never the abstract alone, and never a list. The ledger would not assert that R is false, that R fails without H, or that no other proof of R exists.

Verdicts. The pilot found two cases the draw rule's four verdicts did not separate, so the set below has six:

| Verdict | Meaning |
| --- | --- |
| `ETH-FAMILY` | A main result is stated only under ETH or a hypothesis refuted by route 1 or 2 above, and the paper gives no proof under a hypothesis left standing. |
| `ETH-STATED-PROVED-VIA-OTHER` | The result is stated under SETH (or another ETH-family hypothesis), but the paper's own proof is a reduction from a problem whose hardness hypothesis the reported refutation leaves standing (typically Orthogonal Vectors). The statement as printed has lost its support; the proof's content survives under the other hypothesis. *(Pilot gap 1.)* |
| `OPTIMALITY-ONLY` | The main result is unconditional (usually an algorithm), and only its optimality ("tight under ETH") rests on ETH. The algorithm stands; only the tightness claim loses its support. *(Pilot gap 2.)* |
| `OTHER-HYPOTHESIS` | Conditional only on hypotheses the reported refutation leaves standing (OV, 3SUM, APSP, k-Clique, Set Cover), or also proved under one. |
| `NOT-CONDITIONAL` | ETH is mentioned, but no main result rests on it. |
| `UNREAD` | Not read. Never a verdict about the paper. |

Each verdict also carries its **evidence depth**: `abstract` or `statement` (the theorem as printed, with its number and page). **Only a `statement`-depth verdict could ever render.** An abstract-depth verdict is a screening result.

## How a refutation that no human has confirmed is worded

"Refuted" alone over-claims. The ledger would say, with the date:

> ETH is **reported refuted**: two preprints posted in October 2026, one from OpenAI and one from Anthropic, each claim an algorithm that contradicts it, and each publishes a Lean proof. Anthropic's paper says its Lean development was written by AI models and that, at the time of writing, no person was known to have checked it. OpenAI's release says its manuscripts are model-produced and names a working group (Impagliazzo, Paturi, Williams) that will examine its proof; its README and history report no human check yet. *(This ledger has not read OpenAI's paper itself; the sentence about OpenAI rests on those two documents only.)*

The wording changes only on a published reading by a human, such as that working group's report, and then it quotes that reading. A watch row would hold the clearing condition and its read command. A second clause applies to `ETH-STATED-PROVED-VIA-OTHER`: the surviving hypothesis is named, so the page never implies the result is gone.

## Where it would live, and the guards it needs

A new page, `eth.html`, separate from the constants index. **Only the three affected verdicts render as rows** (`ETH-FAMILY`, `ETH-STATED-PROVED-VIA-OTHER`, `OPTIMALITY-ONLY`), each at `statement` depth, because only those carry the per-paper assertion above. `OTHER-HYPOTHESIS` and `NOT-CONDITIONAL` are counted in a denominator line ("of N papers read from the frame, …"), and `UNREAD` is counted separately beside it ("M could not be read"). None of them is shown as a row, since a row would assert nothing about ETH. It is not a mirror and there are no bound cells, so neither `ledger/openai-math-map.json` (A-78's store, keyed by watched constants) nor `ledger/newer-results.json` (A-82's store, which assumes an exact evaluator for one constant) fits: the unit here is a third-party paper and its stated hypothesis. A new store would be `ledger/eth-dependence.json`. Each entry would hold the arXiv id, the theorem number and page, a quotation that must contain the hypothesis's name, the verdict, the depth, and the reader. Every row would be re-derivable by opening that page.

The page would need its own guard, in the shape the second area's page already has (`render-ramsey.mjs --check`):
- the committed page is regenerated and compared, as `--check` does;
- nothing loads from another host;
- the words "false", "wrong" and "record" are banned in any rendered verdict;
- each quotation is present in its entry, and each names its hypothesis;
- only the three affected verdicts at `statement` depth render as rows; every other entry is counted in the denominator line and never rendered;
- three separate sums, each refused when it fails: the counts of the five read verdicts sum to the papers read; papers read plus `UNREAD` sum to the frame entries processed; and the rendered rows equal the `statement`-depth entries among the three affected verdicts;
- each row's "looks wrong?" link is titled so `scripts/report-rate.mjs` counts it as an arrival.

**And the public-surface rule:** a row asserts something about another person's paper on a public page. So every row's text goes through the outward gate (adversarial review, a cross-family claims pass, David's yes) before the page exists at all.

## Pilot (2026-10-30)

Drawn before reading, by a rule written to `tmp/eth-pilot-2026-10-30/draw-rule.md` before the frame was fetched. Order: ascending SHA-256 of `A-87 pilot 2026-10-30|<arXiv id>`. Slice: the first 8 of the 638. *(The salt names A-87 in error: A-87 is the 13a citation row. The rule was written with that salt before the draw, and it is kept, because changing it now would be a redraw.)* Two reading agents read four papers each, under the rule's verdicts quoted verbatim.

Result: 8 drawn, 8 read, 0 unread. Under the six verdicts above: `ETH-FAMILY` 5, `ETH-STATED-PROVED-VIA-OTHER` 1, `OPTIMALITY-ONLY` 1, `OTHER-HYPOTHESIS` 1, `NOT-CONDITIONAL` 0. **Depth: 3 at `statement`, 5 at `abstract` only.** The three statement-depth entries all carry affected verdicts, so they meet the depth-and-verdict rule for a row. **None is publishable yet:** each quotation must be re-read raw, and every row must pass the outward gate (adversarial review, a claims pass, David's yes). The counts are not a rate (8 of a frame that is not the population). The per-paper ids, verdicts and quotations stay local in `tmp/eth-pilot-2026-10-30/`. Several quotations came through a summarising fetch tool and must be re-read raw before any is banked.

What the pilot taught:
1. **The verdict set needed two more values** (gaps 1 and 2 above). The pilot found one paper of each among eight, and the four-value rule did not classify either cleanly. How common the two shapes are across the frame is not known from eight papers.
2. **Abstracts settled five of the eight screening verdicts, and no assertion.** Statement depth stays mandatory for any row. In the gap-1 paper, the abstract itself named the Orthogonal Vectors reduction, so abstract depth can reveal that gap. It cannot show that a paper *lacks* such a reduction.
3. **The population question is open.** A frame of 638 abstracts and a claimed 800 papers do not measure one thing.

## Next steps (none is self-approved past the design)

1. Re-read the 5 abstract-depth pilot papers at statement depth, re-quoting raw.
2. **`/deep-research`** (recommended, now that the primary sources are read): what corpus of ETH-dependent results exists (surveys of fine-grained complexity; whether a published list exists), how conditional results are customarily labelled, and how other stewards track a refuted assumption. The prompt cites the two papers above and never the news article.
3. A watch row on the refutation's status: clearing condition = a published human reading of either proof.
4. Building `eth.html` is a separate decision for David, with the exact rows in front of him.
