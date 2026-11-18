# SCREENS.md — inventory of the visitor surfaces of Bounds Ledger

Started 2026-11-17 (MT) for the design rollout (`A-110`). Built from the renderers and the served
tree: `scripts/render-site.mjs` writes `index.html`, `scripts/render-ramsey.mjs` writes `ramsey.html`
and `copying.html`, and `scripts/render-constant-pages.mjs` writes `c/<id>.html`. The site is GitHub
Pages serving this whole repository from `main` at `/` (`https://u00dxk2.github.io/bounds-ledger/`).
The site has no sign-in, payment, account, settings or email, and the published page sources declare
no share image.

**Status key.** DONE: in the new system (`docs/DESIGN.md` tokens and type, `docs/PRODUCT.md` voice),
confirmed by a signed-out GET of the published page. NEXT: scheduled work, with a date. HOLD:
deliberately not changed, with the reason.

| Screen or state | Who sees it | What it is for | States | Last changed | Status |
|---|---|---|---|---|---|
| `index.html`, first screen (headline, search, order control, freshness line, table; the staged handbook adds a masthead and a Browse control) | any visitor | find a constant and read its pinned rows | 120 constant entries in the 2026-11-17 checkout | 2026-11-14 (commit `57ca289`); handbook staged 2026-11-17 | NEXT 2026-11-17: the handbook first screen is staged behind `FIRST_SCREEN` in `scripts/render-site.mjs`; DONE after a signed-out GET of the regenerated, published page |
| `index.html`, search | any visitor | narrow to the constant asked about | search narrows the list to matching entries and updates the count; with one to three direct matches, the answer line under the box (`A-104`) lists eligible name matches or entries showing the older-row explanation, and even one direct match can leave it hidden | 2026-11-14 | as above |
| `index.html`, search with no match | any visitor | say the search found nothing, and what search covers | empty panel with "Tell us what you were looking for", shown when direct matching and any shortened search both leave zero entries | 2026-11-14 | as above; the issue draft it opens is HOLD (row below) |
| `index.html`, near-miss panel | any visitor | explain matches found by dropping trailing digits | shown when a decimal with at least three fractional digits has no direct match and a match appears after dropping trailing digits (keeping at least two) | 2026-11-14 | as above (restyled through shared CSS; wording unchanged) |
| `index.html`, notes below the table and footer | any visitor | how to read the page before citing | static | 2026-11-14 | as above (restyled; wording unchanged) |
| `index.html`, landed row (`#c-<id>` permalink) | a visitor following a row link | land on one constant | target row marked | 2026-11-14 | as above |
| `c/<id>.html` ×120, constant pages | any visitor; each generated citation contains its constant page's address | one constant: its rows, history, readings, newer-papers line, open pull requests | with or without readings; the newer-papers line in its `reported-stronger`, `not-compared` or `none` states, or no paper for this constant; an open pull request list, none, or a list with a stale warning after seven days | 2026-11-17 (content, commit `8981246`) | NEXT 2026-11-24: tokens and type only, no wording change |
| `ramsey.html`, Small Ramsey numbers | any visitor | the second watched area, as printed in the survey | table; arXiv search section | 2026-11-02 (commit `fa00067`) | NEXT 2026-11-24: tokens and type only |
| Ramsey "looks wrong?" issue draft | a visitor reporting a Ramsey entry | file a report naming the entry and survey revision | prefilled new-issue form | unchanged | HOLD: `scripts/report-rate.mjs:60` reads the "Row looks wrong:" prefix |
| `copying.html`, disclosure for the Ramsey table | a visitor following "The source" | what is reproduced and under what terms | static, with a correction or removal issue draft | 2026-10-15 (commit `216526a`) | NEXT 2026-11-24: tokens only; the issue draft unchanged |
| 404 for an address with no file behind it (a mistyped constant id can instead land on another tracked page) | any visitor with a bad link | none today | the repository supplies no custom 404 page; the host's response is not read here | never ours | NEXT 2026-11-24: a `404.html` in this system that points to the index and its search; a new page, so a claims pass first |
| "looks wrong?" issue draft (one per row, index and constant pages) | a visitor reporting a row | file a report naming the constant and the mirror commit | GitHub's new-issue form, prefilled | unchanged | HOLD: `npm run reports` (the outside-arrival counter) reads these titles; a wording change is its own change with that counter's proof |
| Empty-search issue draft ("Constant not tracked") | a visitor whose search found nothing | ask for a constant to be watched | prefilled new-issue form | unchanged | HOLD on `A-109` (2026-11-24): the title is not supported by a search that found nothing, but the arrival counter reads its prefix |
| Near-miss issue draft | a visitor on the near-miss panel | say which constant was meant | prefilled new-issue form, titled "Constant not tracked: …" and carrying the original term and the shortened match | unchanged | HOLD, same reason as the row above (`scripts/report-rate.mjs:60-61` reads the "Row looks wrong:" and "Constant not tracked:" prefixes) |
| CI findings filed as issues | anyone watching the repository | public record of a verification failure (a moved pin, an added or removed file, an unreachable source, a failed check) | CI publishes captured check output, status lines first when it exceeds the issue budget; resolved drift issues are closed by hand with the resolving sha | unchanged | HOLD: the alarm's captured output is public (`AGENTS.md`, hard invariants); a wording change is a separate review |
| `README.md` (GitHub repository page) | visitors to the repository | what the ledger is, a quick check, and the method | static | 2026-11-14 | NEXT 2026-11-24: voice only (GitHub renders it, no CSS); claims-heavy, and `A-103`'s outcome read is open to 2026-12-14 |
| `SECURITY.md` | security reporters | how to report | static | unchanged | HOLD: policy text, not a designed screen |
| `sitemap.xml`, `google45610b69cae7202a.html` | crawlers | indexing and site verification | machine files | unchanged | not a screen |
| Other tracked files (`docs/**`, `ledger/**`, `continuity/**`, `scripts/**`) | anyone with the path | the repository's own files | raw files, reachable at their Pages paths | n/a | not a designed screen |

DONE, NEXT and HOLD totals are pending; the rollout's close fills them in.
