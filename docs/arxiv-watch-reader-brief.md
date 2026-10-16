# Reader brief: arXiv watcher, Small Ramsey Numbers (bounds-ledger, 2026-10-15)

You are reading arXiv papers for a ledger that mirrors Table Ia of Radziszowski's survey "Small Ramsey Numbers" (revision 18, 2026-04-24). The table gives values and bounds of the classical two-colour Ramsey numbers R(k, l) for complete graphs, 3 <= k <= 10 and l <= 15. The question for each paper is narrow: **does this paper STATE an explicit numerical value or bound for a classical two-colour Ramsey number R(k, l), with specific integers k and l?**

You do NOT compare against the table and you are not told its values. Report only what the paper states. A script does the comparison.

## Your input

One batch file: an array of papers, each with `id`, `version`, `title`, `categories`, `abstract`. Give a verdict for EVERY paper in it, in the same order, with no paper skipped and none added.

## Classes

- `bears`: the paper states at least one explicit numeric value or bound for a classical two-colour R(k, l), meaning complete graphs K_k and K_l and two colours, for specific integers (e.g. "R(4,8) >= 59", "we prove R(3,13) <= 67", "R(5,5) <= 46"). Record each such statement as a claim.
- `unrelated`: everything else. That includes asymptotic results with no explicit small value, multicolour numbers, hypergraph Ramsey, Ramsey numbers of other graphs (cycles, books, trees, wheels, K_n versus a non-complete graph), Euclidean or canonical Ramsey, Ramsey theory in logic or ultrafilters, size or online Ramsey numbers, and Ramsey multiplicity.

If a paper is about the classical R(k, l) but states no explicit number, use `bears` with `claims: []` and a one-line `why`. Example: an asymptotic improvement for R(k, k).

## When to read beyond the abstract

When the abstract or title suggests explicit small classical values ("small Ramsey numbers", "new lower bounds for R(...)", "circulant/Paley constructions", "SAT", "flag algebras" with a two-colour classical number, "R(k,l) for small k"), open the paper's full text on arxiv.org (`https://arxiv.org/abs/<id>v<version>`, then its PDF or HTML at `https://arxiv.org/pdf/<id>v<version>`) and find the explicit statements. Read the version given in the input. If you cannot open the full text, say so in `why` and record only what the abstract states.

## Each claim

`{ "k": <int>, "l": <int>, "side": "lower" | "upper", "value": <int>, "quote": "<the exact line from the paper>" }`

- An exact value R(k,l) = n is TWO claims: side lower with value n, and side upper with value n.
- `R(k,l) >= n` and `R(k,l) > n-1` are both side lower, value n. Convert a strict inequality to the integer the bound implies (R > 58 means value 59), and keep the quote exactly as the paper writes it.
- `quote` is copied verbatim from the paper (LaTeX is fine) and must contain the number you put in `value`. When the paper writes it only as a strict inequality with another number, quote the paper's sentence AND add the converted form in square brackets at the end, e.g. `"... R(4,8) > 58 ... [= R(4,8) >= 59]"`.
- Record claims on ANY classical two-colour R(k,l) the paper states, including k or l outside the survey's range. A previously known value the paper restates (e.g. "R(4,5) = 25 [MR]") is still a claim: record it.

## Output

Return as your FINAL MESSAGE a single JSON array, and nothing else after it:

```json
[
  { "id": "2605.00001", "version": 1, "class": "bears", "claims": [ { "k": 4, "l": 8, "side": "lower", "value": 59, "quote": "..." } ] },
  { "id": "2605.00002", "version": 3, "class": "unrelated", "claims": [] },
  { "id": "2605.00003", "version": 1, "class": "bears", "claims": [], "why": "asymptotic bound on R(k,k), no explicit value" }
]
```

## Rules

- Fetch only from arxiv.org and export.arxiv.org. Send no email address, name or other identity to any service. Do not use Unpaywall or any service that asks for an email.
- Write no files, except a helper script if you really need one, and only inside `C:/dev/skylark/bounds-ledger/tmp/arxiv-watch/2026-10-15/reader-<your batch number>/`. Never edit anything else in the repository, run no git command, and post nothing anywhere.
- On this Windows machine use ONE command per Bash call with absolute paths (no `&&`, `;`, pipes or `$VAR`); use the PowerShell tool for anything compound, and the Read tool for files. Space arXiv requests at least three seconds apart.
- Never invent a quote. If you are unsure whether a statement is about the classical two-colour number, read the paper's definitions. If still unsure, record the claim and say so in `why`.
