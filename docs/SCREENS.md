# SCREENS.md — inventory of the visitor surfaces of Bounds Ledger

Started 2026-11-17 (MT) for the design rollout (`A-110`). An index of surfaces, not a description of
their behaviour: each state is named and pointed at the code that defines it, which is the authority
on when it appears and what it says. `scripts/render-site.mjs` writes `index.html`,
`scripts/render-ramsey.mjs` writes `ramsey.html` and `copying.html`, and
`scripts/render-constant-pages.mjs` writes `c/<id>.html`. The site is GitHub Pages serving this whole
repository from `main` at `/` (`https://u00dxk2.github.io/bounds-ledger/`). The checked-in product
pages have no sign-in, payment, account, settings or email flow, and declare no share image.

**Status key.** DONE: in the new system (`docs/DESIGN.md` tokens and type, `docs/PRODUCT.md` voice),
confirmed by a signed-out GET of the published page. NEXT: scheduled work, with a date. HOLD:
deliberately not changed, with the reason. "File last changed" is the last commit touching the
served file, not the date any one state changed.

| Surface or state | Who sees it | Defined in | File last changed | Status |
|---|---|---|---|---|
| `index.html`: first screen (headline, search, order control, freshness line, table) | any visitor | `renderHtml()` in `scripts/render-site.mjs` (handbook mode: masthead and Browse control added) | 2026-11-17 (rail day), commit `3e1f947` | DONE: `FIRST_SCREEN = "handbook"`; a signed-out GET of the published page after the Pages build of `3e1f947` showed the masthead, "Browse all 120 constants" and 120 rows; live frames in `docs/design-pass-2026-11-17/live/` |
| `index.html`: search results and the answer line under the box (`A-104`) | any visitor | the page's filter script in `scripts/render-site.mjs` | as above | as above |
| `index.html`: empty-search panel | any visitor | `renderHtml()` and the filter script | as above | as above; the issue draft it opens is HOLD (below) |
| `index.html`: near-miss panel | any visitor | `renderHtml()` and the filter script | as above | as above (restyled; wording unchanged) |
| `index.html`: notes below the table, footer, landed-row marker | any visitor | `renderHtml()` | as above | as above (restyled; wording unchanged) |
| `c/<id>.html` ×120, constant pages, with their newer-papers line and open pull request list | any visitor; each generated citation contains its constant page's address | `scripts/render-constant-pages.mjs`, `scripts/newer-results.mjs`, `scripts/open-pulls.mjs` | 2026-11-17, commit `8981246` | NEXT 2026-11-24: tokens and type only, no wording change |
| `ramsey.html`, Small Ramsey numbers, with its arXiv search section | any visitor | `scripts/render-ramsey.mjs` | 2026-11-02, commit `fa00067` | NEXT 2026-11-24: tokens and type only |
| `copying.html`, disclosure for the Ramsey table, with its issue draft | a visitor following "The source" | `scripts/render-ramsey.mjs` | 2026-10-15, commit `216526a` | NEXT 2026-11-24: tokens only; the issue draft unchanged |
| A missing address | any visitor with a bad link | the repository has no `404.html`; the host's response is not read here | n/a | NEXT 2026-11-24: a `404.html` in this system pointing to the index; a new page, so a claims pass first |
| "Row looks wrong" issue drafts (index rows, constant pages, Ramsey entries) | a visitor reporting a row | `flagUrl` in `scripts/render-site.mjs`, `scripts/render-ramsey.mjs` | as the index, constant-page and Ramsey rows above | HOLD: `scripts/report-rate.mjs:60` (the outside-arrival counter) reads this title prefix |
| "Constant not tracked" issue drafts (empty-search and near-miss) | a visitor with no matches, or a visitor offered matches for a shortened query | the filter script | 2026-11-14, commit `57ca289` (`index.html`) | HOLD on `A-109` (2026-11-24): the counter reads this prefix (`scripts/report-rate.mjs:61`) |
| CI findings filed as issues | anyone watching the repository | `.github/workflows/reverify.yml` | 2026-11-14, commit `0e2937a` (the workflow) | HOLD: the alarm's captured output is public (`AGENTS.md`, hard invariants); a wording change is a separate review |
| `README.md` (GitHub repository page) | visitors to the repository | the file itself | 2026-11-14, commit `0e2937a` | NEXT 2026-11-24: voice only (GitHub renders it); `A-103`'s outcome read is open to 2026-12-14 |
| `SECURITY.md` | security reporters | the file itself | 2026-10-05, commit `c169b5b` | HOLD: policy text, not a designed screen |
| `sitemap.xml`, `google45610b69cae7202a.html` | crawlers | the files themselves | 2026-11-05, commits `2373a50` and `33f5001` | not a screen |
| Other tracked files (`docs/**`, `ledger/**`, `continuity/**`, `scripts/**`) | anyone with the path | tracked under the configured Pages source | n/a | not a designed screen |

Totals after the turn-on (rail day 2026-11-17): DONE 5 (the five `index.html` rows), NEXT 5 (constant pages, `ramsey.html`, `copying.html`, a 404 page, `README.md`, each dated 2026-11-24), HOLD 4 (the two issue-draft families, CI findings, `SECURITY.md`), not a screen 2.
