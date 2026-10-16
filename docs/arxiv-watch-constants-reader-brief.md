# Reader brief: arXiv watcher, optimization constants (bounds-ledger, 2026-10-16)

You are reading arXiv papers for a ledger that mirrors the constants in `teorth/optimizationproblems`: 115 named mathematical constants (autocorrelation constants, packing constants, Kakeya-type constants, and so on), each with tables of known upper and lower bounds. The question for each paper is narrow: **does this paper STATE an explicit numerical upper or lower bound for one of the listed constants?**

You do NOT compare against the ledger and you are not told its values. Report only what the paper states. A script does the comparison.

## Your input

1. One batch file: an array of papers, each with `id`, `version`, `title`, `categories`, `abstract`. Give a verdict for EVERY paper in it, in the same order, with no paper skipped and none added.
2. The constants list: `constants.json` beside the batch, each entry `{ "id": "1a", "title": "…" }`. A claim names a constant by its `id`. To check that a paper's problem IS a listed constant, open that constant's definition at `C:/dev/skylark/bounds-ledger/ledger/teorth-optimizationproblems/constants/<id>.md` and read ONLY its "Description of constant" section (read-only). Do not read its bound tables: you must not be anchored by them.

## Classes

- `bears`: the paper states at least one explicit numeric upper or lower bound for a listed constant, with a specific number (e.g. "we obtain an upper bound of 1.5029 for the autocorrelation constant", "C ≥ 0.9610"). Record each such statement as a claim.
- `unrelated`: everything else. That includes papers about program search, agents or benchmarks that report no number for a listed constant; numbers for problems that are not one of the listed constants (check the definition: a similar-sounding problem with a different normalisation is NOT the constant); and scores that are not stated as bounds.

If a paper works on a listed constant but states no explicit bound for it (for example, it reports a relative improvement or a plot only), use `bears` with `claims: []` and a one-line `why`.

## When to read beyond the abstract

Papers on automated discovery systems (AlphaEvolve and its relatives) usually report their mathematical results in tables or appendices, not in the abstract. **Open the full text of every paper in the batch** (`https://arxiv.org/abs/<id>v<version>`, then its PDF at `https://arxiv.org/pdf/<id>v<version>` or its HTML at `https://arxiv.org/html/<id>v<version>`), read the version given in the input, and search it for the listed constants' problems (autocorrelation, minimum overlap, packing, Kakeya, Sidon, uncertainty principle, and the rest of the titles). If you cannot open the full text of a paper, record what the abstract states AND set `"incomplete": "<what you could not open, and why>"` on that verdict. The check refuses to call a run complete while any reading is marked incomplete, so a blocked source is visible instead of passing as "nothing found".

## Each claim

`{ "constant": "<id from constants.json>", "side": "lower" | "upper", "value": "<the decimal, as a STRING>", "quote": "<the exact line from the paper>" }`

- `value` is a string holding a plain decimal exactly as the paper prints it (`"1.5029"`, `"0.380868"`, `"12"`), so no digits are lost. If the paper prints a fraction or an expression, put the decimal the paper itself also prints; if it prints none, do not compute one: record the claim under `why` instead and leave it out of `claims`.
- Which side: an upper bound on the constant (C ≤ x) is `upper`; a lower bound (C ≥ x) is `lower`. Read the constant's definition: some constants are minimised, some maximised, and a "score" in a results table may be either. If you cannot tell which side a number bounds, do not record it as a claim; say so in `why`.
- `quote` is copied verbatim from the paper (LaTeX is fine) and must contain the `value` string exactly, as a whole number: the script splits the quote into numbers (digits joined by `.`, `,`, `{,}`, `\,` or a thin space count as ONE number, so `1.50\,286` is one number) and the value must equal one of them. When the paper's sentence prints the number differently (e.g. in a table cell), quote the row or sentence AND add the value in square brackets at the end, e.g. `"... | 0.38087 | ... [= 0.38087]"`.
- Record claims on ANY listed constant the paper states, including ones it merely restates from earlier work. A restated known value is still a claim: record it.

## Output

Return as your FINAL MESSAGE a single JSON array, and nothing else after it:

```json
[
  { "id": "2610.00001", "version": 1, "class": "bears", "claims": [ { "constant": "1a", "side": "upper", "value": "1.5029", "quote": "..." } ] },
  { "id": "2610.00002", "version": 2, "class": "unrelated", "claims": [] },
  { "id": "2610.00003", "version": 1, "class": "bears", "claims": [], "why": "reports a relative improvement on the minimum overlap problem, no explicit bound" }
]
```

## Rules

- Fetch only from arxiv.org and export.arxiv.org. Send no email address, name or other identity to any service. Do not use Unpaywall or any service that asks for an email.
- Write no files, except a helper script or a downloaded PDF if you really need one, and only inside `C:/dev/skylark/bounds-ledger/tmp/arxiv-watch/<MT date>/constants/reader-<your batch number>/`. Never edit anything else in the repository, run no git command, and post nothing anywhere.
- On this Windows machine use ONE command per Bash call with absolute paths (no `&&`, `;`, pipes or `$VAR`); use the PowerShell tool for anything compound, and the Read tool for files. Space arXiv requests at least three seconds apart.
- Never invent a quote. If you are unsure whether a statement is about a listed constant, read the constant's definition. If still unsure, leave it out of `claims` and say so in `why`.
