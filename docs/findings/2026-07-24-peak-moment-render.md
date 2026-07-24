# Finding — the drift alarm's peak moment renders garbled

**Date:** 2026-07-24 · **Status:** OPEN — one-line fix ready, not yet shipped (David held new work; surfaced for greenlight) · **Items:** A-2 render quality; supersedes this-morning's abstract P-1/P-2/P-3
**Method:** peak-moment render read (warm-context proposal, orchestrator-approved). Same class as the bloom-edu 2026-07-24 story defect — instruments read green, nobody read what the moment literally renders.

## The peak moment

This lane's product has exactly one peak moment: **the drift alarm firing.** What a steward literally reads when the ledger earns its keep is the GitHub issue that `reverify.yml` auto-files on drift. Until this morning's exit-code fix (`docs/findings/2026-07-24-drift-alarm-was-never-armed.md`) that issue **could never fire**, so its render had never been read — only predicted.

## Pre-registered prediction (written before the render was read)

> A generic dated title (`Drift: bounds-ledger re-verification (2026-07-24)`) over a raw 109-file diff dump.

## What actually renders (not predicted — captured)

Filed a real synthetic drift (upstream ceiling `0.380868 → 0.380861` in `constants/1b.md`) as issue #1 in the private repo, then rendered `finding.txt` through **GitHub's own GFM markdown API** (`POST /markdown`) — the literal HTML github.com serves, not a reasoning about it. Issue closed after capture.

**Title** (as predicted): `Drift: bounds-ledger re-verification (2026-07-24)` — carries zero drift-specific signal. After 30 green days, the one red title is indistinguishable from any other. A notification reader learns nothing.

**Body** — worse than predicted. It is not a plain dump; it is markdown-**mangled**, because a `console.log` terminal report was dumped raw into a markdown body:

1. **The diff's direction is destroyed.** The report's `  - | $0.380868$ | … |` (removed/old) and `  + | $0.380861$ | … |` (added/new) render as:

   ```html
   <p>CHANGED constants/1b.md</p>
   <ul>
     <li>| <math-renderer>$0.380868$</math-renderer> | [YLTLYS…] | SimpleTES |</li>
     <ul>
       <li>| <math-renderer>$0.380861$</math-renderer> | [YLTLYS…] | SimpleTES |</li>
     </ul>
   </ul>
   ```

   The `-`/`+` markers are **gone**. Old and new render as a bullet and a nested sub-bullet with no removed/added labelling. **The single most important fact in the whole alarm — which way the record moved — is exactly what the render obliterates.**

2. **`$0.380868$` becomes italic math.** GitHub's LaTeX renderer fires on the `$…$`, so the two numbers render as `<math-renderer>` math-italic fragments — buried in bullet text among raw `|` pipes and a raw citation key.

3. **Raw `|` pipes.** The source table cells copy through verbatim; with no header-separator row they form no table, just literal vertical bars.

4. **Two `<h1>` headers in one issue** — `# Drift report` and `# Claim check` both render as full H1s, each carrying a 40-char ISO timestamp.

5. **No separator between the two tool outputs.** `tee -a` concatenates `reverify` and `check-claims`; "1 file(s) drifted…" butts straight into `<h1>Claim check</h1>`.

6. **12 lines of irrelevant `HOLDS` on every drift.** All six holding claims + the long C-7 blurb render in full whether or not they relate to this drift, pushing the one line that moved below the fold (Hick's law — confirms this morning's P-3, now against the real render).

## Verdict against the promise

The moment promises: *"the ledger caught a drift the field's own index missed — here it is, act on it."* What renders is a two-H1, math-italic, bullet-mangled wall where the drift's **direction is unreadable**, the title says nothing, and a dozen irrelevant HOLDS bury the finding. The instrument fires; the render fails the moment. Reading the literal render caught the destroyed-diff-direction defect that *predicting* it did not — which is the entire point of the exercise.

## The fix (one line, ready — not shipped)

Wrap the report body in a fenced code block before it becomes the issue body. A code fence preserves the `+/-` diff verbatim, suppresses the H1/LaTeX/bullet rendering, and makes the terminal report read as the terminal report it is. In `.github/workflows/reverify.yml`, the `Open finding` step:

```bash
# before: --body-file finding.txt
{ echo '```'; cat finding.txt; echo '```'; } > issue-body.md
gh issue create --title "…" --body-file issue-body.md
```

Combined with a title that names the drift (this morning's P-1 — have `reverify.mjs` emit a one-line summary and pass it to `--title`), the moment becomes legible. **Held for greenlight:** it changes rendered behaviour, and today's discipline (the pre-send method-sentence catch) argues for the checkpoint over a unilateral ship. The one-liner above is ready to apply.

## Evidence

Synthetic issue #1 (closed), `finding.txt`, and the GFM-rendered HTML captured in the session scratchpad. The tamper was performed on a scratchpad copy; `ledger/` was never touched (`git status` clean throughout).
