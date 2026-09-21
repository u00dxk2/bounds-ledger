# A-51 — draft upstream pull request: a dead citation link in two files

**Status:** DRAFT. Nothing is sent. The send decision is David's, on his board. This file is the
text he is asked to approve; the adversarial review of it is recorded at the foot.

**Channel: a pull request on `teorth/optimizationproblems`, not an issue.** Unlike A-16, where we
could show a row contradicted itself but could not supply the right value, here we can supply the
replacement and have verified it, so a two-line PR asks less of the maintainer than an issue would.

**Pre-send check, mandatory, run the same day as sending:**

1. **Compare upstream's CURRENT files with this draft's exact before-text — not with our mirror.**
   Fetch `https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants/1a.md` and
   `…/constants/1b.md` and confirm each still contains the before-line in the diff below, byte for
   byte. If either differs, stop and re-read it. (`reverify.mjs --check` is not this check: it
   compares upstream with the mirror, which a routine snapshot could already have moved to a fixed
   upstream, so it can print `No drift.` over an obsolete draft — adversarial review, 2026-09-21.)
2. **GET the dead URL, following redirects, and read the page — not only the headers.**
   `curl -sL -o discover-body.html -w "%{http_code} %{url_effective} %{content_type}\n" https://test-time-training.github.io/discover.pdf`,
   then confirm the final status is 404, the final URL is unchanged, and the saved body's `<title>`
   is `Site not found &middot; GitHub Pages`. Any other answer — a PDF, a redirect to an abstract, a
   different HTML page — means the PR body's present-tense sentence is no longer true: reassess, do
   not send as written. (The row's own readCommand, a header-only fetch, accepts any `text/html`
   and cannot tell the error page from a working one.)
3. `https://arxiv.org/abs/2601.16175` still answers HTTP 200 with the title below.
4. After opening the PR, read its diff on GitHub: exactly two changed lines, each a single URL
   substitution.

Last verified **2026-09-21**: step 1 as written, upstream `main`'s raw `constants/1a.md` (HTTP 200,
4,548 bytes) and `constants/1b.md` (HTTP 200, 4,015 bytes) still carry the before-link at lines 55
and 57; the mirror also matched upstream at 15:24Z (`npm run verify`, exit 0);
the dead URL answered `HTTP/1.1 404 Not Found` with `Content-Type: text/html; charset=utf-8` and
a body titled `Site not found &middot; GitHub Pages`; the arXiv page answered HTTP 200 with
`<title>[2601.16175] Learning to Discover at Test Time</title>` and eleven `citation_author`
entries matching our reference entry name for name and in order.

---

## Draft pull request

**Title:** `Fix dead link for [YKLBMWKCZGS2026] in constants/1a.md and constants/1b.md`

**Diff** (the same one-line change in each file; nothing else touched):

```diff
--- a/constants/1a.md
+++ b/constants/1a.md
@@ line 55 @@
-- [YKLBMWKCZGS2026] Yuksekgonul, Mert; Koceja, Daniel; Li, Xinhao; Bianchi, Federico; McCaleb, Jed; Wang, Xiaolong; Kautz, Jan; Choi, Yejin; Zou, James; Guestrin, Carlos; Sun, Yu. [Learning to Discover at Test Time](https://test-time-training.github.io/discover.pdf), 2026.
+- [YKLBMWKCZGS2026] Yuksekgonul, Mert; Koceja, Daniel; Li, Xinhao; Bianchi, Federico; McCaleb, Jed; Wang, Xiaolong; Kautz, Jan; Choi, Yejin; Zou, James; Guestrin, Carlos; Sun, Yu. [Learning to Discover at Test Time](https://arxiv.org/abs/2601.16175), 2026.
--- a/constants/1b.md
+++ b/constants/1b.md
@@ line 57 @@
-- [YKLBMWKCZGS2026] Yuksekgonul, Mert; Koceja, Daniel; Li, Xinhao; Bianchi, Federico; McCaleb, Jed; Wang, Xiaolong; Kautz, Jan; Choi, Yejin; Zou, James; Guestrin, Carlos; Sun, Yu. [Learning to Discover at Test Time](https://test-time-training.github.io/discover.pdf), 2026.
+- [YKLBMWKCZGS2026] Yuksekgonul, Mert; Koceja, Daniel; Li, Xinhao; Bianchi, Federico; McCaleb, Jed; Wang, Xiaolong; Kautz, Jan; Choi, Yejin; Zou, James; Guestrin, Carlos; Sun, Yu. [Learning to Discover at Test Time](https://arxiv.org/abs/2601.16175), 2026.
```

**Body:**

> The `[YKLBMWKCZGS2026]` reference in `constants/1a.md` and `constants/1b.md` links to
> `https://test-time-training.github.io/discover.pdf`, which no longer serves the paper: it returns
> GitHub Pages' "Site not found" page (currently HTTP 404; it answered HTTP 200 with the same page
> when first checked on 5 September).
>
> This PR points both entries at the arXiv listing with the same title and author list,
> [arXiv:2601.16175](https://arxiv.org/abs/2601.16175). Nothing else in either file changes.
>
> One thing I haven't checked: I never saw the PDF that used to be at the old address, so I can't
> say it was identical to the arXiv version — only that the title and authors match.

---

## Why it is worded this way

**The claim is one fact about a URL and one about a replacement, and both were read today.** It says
nothing about the paper's results, the records it set, or any other entry. The "not checked" line
is there because it is true: the old PDF was already gone when this lane first followed the link on
2026-09-05, so "same document" is not something we can assert.

**Both files, not one.** The ledger row was first filed against the minimum-overlap table alone; the
W-11 search on 2026-09-18 found the same reference entry in `constants/1a.md`. A fix drafted from the
row's title would have left one dead link behind.

**Not a G-4 event.** G-4 is an outside party acting on a record without us filing the report; this
is us filing one. It is the lane's ordinary stewarding output, and nothing about it should be
counted as outside uptake if it is merged.

**What the decision forbids is untouched.** David declined a public comment on erdosproblems.com/36
(2026-08-02). This draft does not mention that page, the minimum-overlap record's history, or any
stale bound anywhere.

## W-11 search, run 2026-09-21 before calling this decision-ready

Search space: every tracked file in this repository outside `tmp/`, for
`YKLBMWKCZGS2026|discover\.pdf|2601\.16175` — 70 occurrences in 33 files, against 61 in 28 on
2026-09-18. What was actually read: the 2026-09-18 run read every hit then present; today's run read
the hits in files written since (the 2026-09-18 report, the 2026-09-19 to 2026-09-21 primers, this
lane's own ledger dispositions and read-output files), plus the README, `docs/lane-brief.md:185`,
`scripts/render-site.mjs:379` and the A-43 finding. Those are the reference entry and its two table
rows in the mirror, this lane's own records of the dead link (A-43, A-47-0015/0016, A-51), and the
paper's role in the README's origin story and the 2026-07-24 method-sentence lesson.
**Nothing read argues against sending**, and the one finding that bears on it
(`docs/findings/2026-09-15-a43-asserted-two-states-about-the-same-work.md:77`) says to draft it.

## Adversarial review

**Round 1, 2026-09-21, Codex adversarial-review, `Target: working tree diff` (this file) — verdict
needs-attention, two medium findings, both accepted and fixed above.** It found the claims, the
replacement, the diff and the "not checked" limitation sound, and attacked only the pre-send
procedure:

1. *"A synchronized mirror does not establish that the draft still applies."* `reverify.mjs --check`
   compares upstream with our mutable mirror, not with this draft's before-text, so a snapshot taken
   after an upstream fix would print `No drift.` over an obsolete draft. Fixed: step 1 now compares
   upstream's current raw files with the exact before-lines.
2. *"HTML headers cannot reconfirm the claimed error page."* A header-only fetch accepts any
   `text/html`, including a working landing page. Fixed: step 2 now GETs with redirects and checks
   the final status, the final URL and the body's title.

**Round 2, 2026-09-21, same reviewer, `Target: working tree diff`, run together with slice 6 of the
depth audit:** "The revised PR checks close both previous findings." No new finding on this file.

Both round-1 findings are about the check that runs on the day of sending, which is exactly where this draft
could go wrong after today: everything it asserts was read today, and the risk is that it stops
being true before David answers.
