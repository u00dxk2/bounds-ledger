# SCREENS.md — every user-facing surface of Bounds Ledger

Started 2026-11-17 (MT) for the design rollout (`A-110`). Built from the renderers and the served
tree, not from memory: `scripts/render-site.mjs` writes `index.html`, `scripts/render-ramsey.mjs`
writes `ramsey.html` and `copying.html`, and `scripts/render-constant-pages.mjs` writes `c/<id>.html`.
The site is GitHub Pages serving this whole repository from `main` at `/`
(`https://u00dxk2.github.io/bounds-ledger/`). It has no sign-in, no payment, no account, no settings,
no email and no share image (a grep of `scripts/` for `og:image`, `twitter:` and `mailto:` returned
nothing on 2026-11-17).

**Status key.** DONE: in the new system (`docs/DESIGN.md` tokens and type, `docs/PRODUCT.md` voice).
NEXT: dated, not done tonight. HOLD: deliberately not changed, with the reason. Statuses below are
as of the row's "last touched" date; a status changes only with the commit that changes the screen.

| Screen or state | Who sees it | What it is for | States | Last touched | Status |
|---|---|---|---|---|---|
| `index.html`, first screen (masthead, headline, search, order control, freshness line, table) | any visitor | find a constant and read its pinned rows | loaded; 120 rows | 2026-11-17 | NEXT: goes live with the flag turn-on (`FIRST_SCREEN = "handbook"`) tonight; DONE once a signed-out GET shows it |
| `index.html`, search with matches | any visitor | narrow to the constant asked about | 1 to 3 matches show the answer line under the box (`A-104`); more show the count | 2026-11-17 | as above |
| `index.html`, search with no match | any visitor | say the search found nothing, and what search covers | empty panel with "Tell us what you were looking for" | 2026-11-17 | as above; the issue draft it opens is HOLD (row below) |
| `index.html`, near-miss panel | any visitor | suggest the constant probably meant | shown on a near match | 2026-11-17 | as above (restyled through shared CSS; wording unchanged) |
| `index.html`, notes below the table and footer | any visitor | how to read the page before citing | static | 2026-11-17 | as above (restyled; wording unchanged) |
| `index.html`, landed row (`#c-<id>` permalink) | a visitor following a row link | land on one constant | target row marked | 2026-11-17 | as above |
| `c/<id>.html` ×120, constant pages | any visitor, and every citation's address | one constant: its rows, history, readings, newer-papers line, open pull requests | with or without readings, `reported-stronger` / `not-compared` / `none` newer-papers states, open pull requests or none | 2026-11-17 (content, `8981246`) | NEXT 2026-11-24: tokens and type only, no wording change; its own claims-free style review |
| `ramsey.html`, Small Ramsey numbers | any visitor | the second watched area, as printed in the survey | table; arXiv search section | 2026-10-15 | NEXT 2026-11-24: tokens and type only |
| `copying.html`, disclosure for the Ramsey table | a visitor following "The source" | what is reproduced and under what terms | static | 2026-10-15 | NEXT 2026-11-24: tokens only |
| GitHub Pages 404 (any mistyped address, e.g. a wrong constant id) | any visitor with a bad link | none today: GitHub's own default page | one state | never ours | NEXT 2026-11-24: a `404.html` in this system that points to the index and the search; a new page, so a claims pass first |
| "looks wrong?" issue draft (one per row, index and constant pages) | a visitor reporting a row | file a report naming the constant and the mirror commit | GitHub's new-issue form, prefilled | unchanged | HOLD: `npm run reports` (the G-4 arrival counter) reads these titles; a wording change is its own change with that counter's proof |
| Empty-search issue draft ("Constant not tracked") | a visitor whose search found nothing | ask for a constant to be watched | prefilled new-issue form | unchanged | HOLD on `A-109` (2026-11-24): the title is not supported by a search that found nothing, but the arrival counter reads its prefix |
| Near-miss issue draft | a visitor on the near-miss panel | say which constant was meant | prefilled new-issue form, titled "Constant not tracked: …" like the empty-search draft | unchanged | HOLD, same reason as the row above (`scripts/report-rate.mjs:60-61` reads the "Row looks wrong:" and "Constant not tracked:" prefixes) |
| Drift-alarm issues (filed by CI) | anyone watching the repository | public record that a pinned row moved | open, then closed by hand with the resolving sha | unchanged | HOLD: the alarm's stdout is published verbatim (`AGENTS.md`, hard invariants); a wording change is a separate review |
| `README.md` (GitHub repository page) | visitors to the repository | what the ledger is, the 1-minute check, method | static | 2026-11-14 | NEXT 2026-11-24: voice only (GitHub renders it, no CSS); claims-heavy, and `A-103`'s outcome read is open to 2026-12-14 |
| `SECURITY.md` | security reporters | how to report | static | unchanged | HOLD: policy text, not a designed screen |
| `sitemap.xml`, `google45610b69cae7202a.html` | crawlers | indexing and site verification | machine files | unchanged | not a screen |
| Everything else served (`docs/**`, `ledger/**`, `continuity/**`, `scripts/**`) | anyone typing the path | the repository's own files, served because Pages serves the tree | raw files | n/a | not a designed screen: reachable, linked only from the repository |

**Counts after tonight** are filled in by the close (DONE / NEXT / HOLD).
