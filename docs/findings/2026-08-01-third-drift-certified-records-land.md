# Finding — 2026-08-01: third real drift — certified record rows land, and the acceptance channel shows itself

**Status:** resolved same-day. Verify → `--snapshot` → re-pin executed in order; commit `32b138b`; CI run
`30710915822` green, log-read (`No drift. 111 files match upstream 621429c…` · `229 claim(s): 227 hold,
0 broken/unreachable, 2 unverified (manual).`). Issue #7 closed with the verification record.

**Alarm:** scheduled run `30694707057` (09:55Z) red → issue #7 auto-filed, correctly titled with the drifted
files. Third real drift event; at 12 files (`c4f8386` → `621429c`) the largest since the lane opened (the
7/28 events were 2 files and 1 file).

## What was verified, and how — by execution, not inspection

| File(s) | Change | Verification | Verdict |
|---|---|---|---|
| `3a.md` | Full rewrite: title typo fixed, table expanded with provenance comments, 4 new rows incl. two new records | Every directly-recomputable value recomputed in Node: Ru96 closed form `2−log6/log7 = 1.07922` (matches lemma form); GHR2007 rows 1.10780 / 1.116581 / 1.135596; `C(23,9)=817190`; K2026 mask grid `{3,4}×{506,508,529}` → all six generators; base conventions `2·44+1=89`, `2·17032+1=34065`. Citation-tag audit: 10 cited / 10 defined. | Real; improves the page |
| `3d.md` | **ADDED** — single-set sum-difference exponent | Read in full. The problem is recorded as **solved**: `C_3d = 2` ([LiLi26] arXiv:2607.27199, 29 July 2026 — construction "developed with the assistance of Hyra, an AI research agent"). Citation audit: 8/8 defined. Internally consistent (normalization caution, companion-direction note). | Real; first solved-problem page to enter the mirror |
| `1b.md` | Cross-link retarget `1.html` → `1a.html` | Mirror has no `1.md` (old target dead — same defect class as the 7/28 catch); fetched `1a.md`: title is exactly "An autocorrelation constant related to Sidon sets". | Real fix |
| `13a.md` | "Lebesgue" link retarget `22b.html` → `13b.html` | Fetched both: `13b.md` = "Lebesgue universal covering constant" ✓; old target `22b.md` = "Tight alternating knot constant" (was simply wrong). | Real fix |
| `42a.md` | `Aca` → `Acta` Math. Hungar. | Journal name. | Trivial, correct |
| `4a.md`, `8a.md` | List-marker spacing on reference lines | Eyeballed. | Trivial, correct |
| `3c.md`, `22a.md`, `22b.md` | "Contribution notes" heading cleanup/removal | Eyeballed against live files. | Editorial |
| `50a.md` | LaTeX: unbalanced paren closed; `λ_max(H)` → `λ_max(H_G)` | Live page defines `H_G` as the Quantum-Max-Cut Hamiltonian at its own line 6 — subscript now consistent. | Real fix |
| `86a.md` | Wikipedia link line removed | Full live file grepped: the link is gone, nothing else on the page touched; no bound moved. Plausibly deliberate (Wikipedia's article predates Smith 2024's disproof of the conjecture) — upstream's rationale is theirs; the mirror's contract is byte-fidelity. | Benign editorial |

Also confirmed by recomputation: **upstream's own erratum note is arithmetically right** — GHR2007 §2's stated
data (`|U+U|=4455634`, `|U−U|=110205905`, `q=5723906483`) gives **1.142789**, not the paper's printed 1.14465.
The page is candid that nothing downstream depends on it (all later rows exceed 1.14465).

## What entered the ledger

- Mirror **110 → 111** files; manifest now pins `621429c`.
- Post-snapshot ratchet run: generated pins **218 → 220** (`pin:3d:U`, `pin:3d:L` new), claims **227 → 229**.
- `pin:3a:L` moved from the [MI2026] row to the **[K2026] row (`1.19102809*`)** — the new last-listed record,
  which entered upstream via [PR #134](https://github.com/teorth/optimizationproblems/pull/134) with a
  directed-rounding certificate.
- `pin:3d:L` now pins the row that *closes* a previously-open problem. The listing-position rule did not need
  any modification to absorb a solved problem — "last-listed" is true by construction either way.

## Why this drift matters more than the record values

The rewritten 3a table is direct, dated evidence about **G-1's acknowledgement channel** (the lane's goal-item:
an externally-acknowledged correction), on the very surface we already steward:

1. **The repo accepts outside record submissions through ordinary PRs, with certificates.** [K2026] = a named
   individual via PR #134 (directed-rounding certificate). [Num2026] = "Numaro" (numaro.tech), Zenodo-archived
   interval-arithmetic certificate **with a replayable checker**. [MI2026] = "Mosaic Intelligence" (an X
   handle), exact-count certificate, PR #95. At least two of the three read as automated/AI entities, credited
   by name in the reference list.
2. **The venue's own norm is machine-checkability** — the page cites CONTRIBUTING.md's rule that the Bound
   column should hold values "a reader can recompute directly," and quarantines limit values with asterisks.
   That norm is this lane's exact differentiation.
3. **The community is doing steward-work in public** (the 1.14465 reproducibility note). The seat the thesis
   named as empty is being partially filled by the venue itself — the window for a distinct stewardship
   contribution is open but not indefinitely.

Consequence: **path (c) — independent certificate re-verification as a contribution** — moved today from
speculative to evidenced. Num2026's replayable checker is a concrete first candidate. Channel choice is the
subject of the contribution-channels deep-research David started running today (2026-08-01).

## What was deliberately NOT done

- **No certificate replay yet** — that is a candidate next build, deliberately held until the deep-research
  returns; a half-built verifier across a session boundary is worse than none (the A-11 lesson).
- **No outward contact of any kind.** Any PR, comment, or email stays behind the adversarial refute-it review
  and David's gate, unchanged.
- **No pin upgrades.** The new record rows stay listing-position pins, not "record" claims — two of the three
  are asterisked *limit* values that upstream itself declines to call finite-certified. The rule that felt
  pedantic when adopted (7/24) is again load-bearing.
