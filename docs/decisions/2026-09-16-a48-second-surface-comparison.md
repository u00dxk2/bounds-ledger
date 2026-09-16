# A-48 — the second-surface comparison, for David

**2026-09-16.** This is the comparison promised for today. It scores two candidate surfaces against the four criteria and recommends a small trial of one. **Adopting a surface is David's call; this document does not adopt anything.**

## What the question is

Today this lane stewards one surface: `teorth/optimizationproblems`, mirrored byte-for-byte, with an alarm that fires when a cited record moves. A second surface would give the lane a second place where a wrong record can be found. The four criteria a candidate must pass, in order, come from `A-34`: is it **cited**, does it **drift**, is it **mirrorable** without an alarm that is permanently red, and does it have a **correction path that is not a cold email**.

## The two candidates

Both are Electronic Journal of Combinatorics dynamic surveys — living documents that collect the best-known results in an area and are revised for decades.

| | **Surface 1 — Small Ramsey Numbers** | **Surface 2 — Graph Labeling** |
|---|---|---|
| DOI | 10.37236/21 | 10.37236/27 |
| Author | Stanisław Radziszowski | Joseph A. Gallian |
| Latest revision | #18, **2026-04-24** | 28th edition, **2025-10-30** |
| Crossref | 36 | 156 |
| Semantic Scholar | **612** | 143 |
| OpenAlex | **432** | 188 |
| PDF size | 586 KB | 3.9 MB |

The citation figures come from `node scripts/citation-footprint.mjs <doi>`, run today and matching a read two days earlier. Both PDFs were downloaded and read today, not described from their landing pages. **How the PDFs were read, so nobody over-trusts it:** a one-off script in this session, not committed to the repository, pulled the text out of each PDF. That extraction loses most spaces between words. Every quotation below was then checked by a second session script against that extracted text, ignoring spacing, and each check was also run against a deliberately altered copy of the quote, which failed to match. The scripts are not in the repository, so this is a record of what was checked, not something a reader can re-run from here. What a reader CAN re-check is every quotation, against the PDFs at the download addresses recorded in `A-48` in `continuity/items.json`, which also records the exact size and fingerprint of the files read.

## Criterion by criterion

**Cited — both pass, and the indices disagree about which is bigger.** Semantic Scholar and OpenAlex both rank surface 1 well above surface 2; Crossref alone ranks it lower, 36 against 156. This is why the row was never allowed to answer from Crossref alone: **a Crossref-only comparison would have ranked these two backwards.** Crossref counts only references that publishers deposit, which undercounts a field that lives on preprint servers.

**Drifts — both pass, surface 1 more recently.** Surface 1 is on revision 18, four and a half months old; surface 2 is on its 28th edition, ten and a half months old.

**Mirrorable — open for both.** Both bodies are PDFs, not the markdown tables our tooling mirrors, and surface 2 is about seven times the size. Both pages expose their version date in the same way — split across two hidden fields in the page markup — so a cheap pin on "has it been revised?" is equally available on both. An earlier draft of this comparison said surface 2 was worse on that point; an adversarial review showed the identical check fails the same way on surface 1, and that claim was withdrawn. Size is the only mirroring difference actually measured.

**Correction path — both pass, on one reading of the criterion.** Surface 1's author writes that "Suggestions for any kind of corrections or additions will be greatly appreciated and considered for inclusion in the next revision of this survey", and thanks an outside contributor who "recommended several changes to the latest revision #18". Surface 2's author "requests that he be sent preprints and reprints as well as corrections for inclusion in the updated versions of the survey", and thanks two people for comments on one section. In both cases the route is an email to the author. **The pass depends on reading "not a cold email" as "not uninvited".** Here the author publishes a standing request for corrections, which is different from an unsolicited approach like our July email about an erdosproblems.com page, still unacknowledged. If the criterion was meant to rule out email altogether, both surfaces fail it. Neither acknowledgement identifies a correction that was accepted, so neither proves the channel works; each shows only that outside input is received and credited.

## Would it reproduce what worked before

The one externally-acknowledged correction this lane has produced came from four things together: a surface mirrored byte-for-byte, a human reading one row against the source it cites, a correction that was one line and checkable rather than a mathematical claim, and a maintainer who accepts corrections.

**None of those has been tested on either surface.** Surface 1 looks the more promising: its stated purpose is to present "all known nontrivial values and bounds", and it says it gives "references to all cited bounds and values", which is the shape a person reads against a cited paper. Surface 2 also has summary tables, inside a document seven times longer. That is a reading of how the documents are organised. Nobody has yet taken a single record from either survey and followed it to its source, which is the step that actually produced the earlier correction.

## What this does not settle

Two of the four candidate **shapes** were never tested: encyclopaedic articles on named constants, and record tables hosted as repositories. They are untested, not ruled out. Shape (b), community metadata databases, is excluded because we already partially adopted one.

## Recommendation

**Do not adopt either surface yet. If you want to go further, run a small trial on surface 1 — Small Ramsey Numbers — before deciding.** It is the more cited on the two indices that count preprints, the more recently revised, the smaller to mirror, and the more table-shaped.

**The trial is one step, and it tests one thing no one has tested: whether records in surface 1 can be checked against their sources at all.** Take a handful of records from its tables and read each against the paper it cites, the same way the depth audit already reads our current surface, and record each one as sound, defective, unresolved or unreachable — four separate outcomes, never merged.

What the trial can and cannot tell you. If most records turn out unreachable or unresolved, that is a real finding about how checkable this surface is. If every record reads sound, that says nothing about the rest of the survey — a handful is too few to rule a surface out. If one record's source does not support it, that shows a defect can be found there, and nothing more: mirroring a PDF and getting a correction accepted would both still be untested. So no outcome of the trial is a reason to adopt on its own. It is a reason to take the next question seriously, or not. Mirroring a PDF is new tooling and should not be started on the strength of this comparison alone.
