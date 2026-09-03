# Key user flows — bounds-ledger

Living doc (built 2026-07-24, flow-craft first run). One rotating flow gets a world's-best-PM critique per daily run. Standard: `../skylark-site/docs/product-flow-critique-standard.md` (portfolio-level, lives in skylark-site — not in this repo).

## The ONE core problem, in the user's words

> "I cited a number. I have no idea if it's still the current one."

The user is a researcher, writer, or curator who **quotes a record** — a bound, a constant, a benchmark score — and has no cheap way to learn when it moves. Today they find out by accident, or from a reader, or never.

**Would-tell-a-friend moment:** *"the ledger caught a drift the field's own index missed."*

## The flows

| # | Flow | Who | Exists today? |
|---|---|---|---|
| F-1 | **Drift alarm** — a tracked record moves, and the steward learns within a day | us (steward) | yes — daily CI, as of today actually armed |
| F-2 | **Spot-check one claim** — "is the number I'm about to cite current?" | outside researcher | **live surface since 2026-08-21** — https://u00dxk2.github.io/bounds-ledger/ plus `scripts/lookup.mjs` |

**Already ships, read 2026-09-03 out of the code rather than out of this document.** One row per tracked constant with both pinned bounds, a change-kind label, filter, order-by-recency, a per-row `looks wrong?` report link, a per-constant page at `c/<id>.html`, and a `cite` block carrying that page's canonical address. Reads: `node -e "..."` counting `<tr id=` in `index.html` → **115**, equal to the mirror's constant-file count, with `grep -c 'bounds-ledger/c/' index.html` → 115 canonical cite URLs and `grep -c 'bounds-ledger/#c-' index.html` → **0**. Both figures are now ASSERTED rather than remembered: `render-site.mjs --selftest` fails if a cite block emits the anchor form, and `render-state-block.mjs --check` fails if the README's coverage sentences disagree with the page's row count.
| F-3 | **Receive a correction** — a curator is told their published record is behind | upstream maintainer | sent once, 2026-07-24 (A-3, David-sent); awaiting reply — tracked as W-3 |

F-2 is where the core problem lives. **Partial surface as of 2026-08-20** (`ce25d76`): the README now names twelve tracked constants and links each to its rendered bounds table, so a visitor can read the watched rows in one click with no clone. That answers *"is my number in here, and what does it say?"* for a recognisable subset. It does **not** answer it for an arbitrary constant, and it does not show when a row last moved — `scripts/lookup.mjs` does both and is held on PR #26 for the review lane. Treat F-2 as started, not done.

> **⚠ STALE BLOCKER, CORRECTED 2026-08-17.** This paragraph read: *"closing it means a public status surface, which is the public-repo flip — David-gated. Not a micro-fix; do not ship it unasked."* **That gate cleared on 2026-08-08** — David said "Yes, make it public" and the repo has been public for nine days ([A-13](../continuity/items.json) closed). The stated reason F-2 had no surface expired, nobody re-read the sentence, and the highest-value flow in this document sat behind a condition that no longer existed. This is the second stale blocker found in this repo in two days — A-7's said the repo was private and needed paid add-ons, corrected 2026-08-16 in `a896dfb`. **A ledger whose product is noticing stale records has now twice been the thing holding a stale record.** The pattern is specific enough to name: a blocker written while a gate was pending does not re-read itself when the gate opens, so *closing a gate must include a sweep for text that cited it.*

What is still true: F-2 needs a surface a stranger can use without cloning anything, and that is more than a micro-fix. What is no longer true: that it needs David first. It is now ordinary engineering work, and it is the one flow that addresses the core problem in the user's own words.

---

## Rotation 1 (2026-07-24) — F-1, the drift alarm

**Current concrete steps:** cron 09:17 UTC → `reverify.mjs --check` + `check-claims.mjs` → on drift the run fails → `gh issue create --title "Drift: bounds-ledger re-verification (<date>)" --body-file finding.txt` → steward reads the issue.

Today's fix made this flow *fire at all* (see `docs/findings/2026-07-24-drift-alarm-was-never-armed.md`). Now that it can fire, the delivery is worth critiquing — because the alarm's whole value is what the reader understands in the first three seconds.

### Proposals

**P-1 — the issue title names the drift.** WHO: steward (later: any watcher). WHAT: `Drift: bounds-ledger re-verification (2026-07-24)` → `Drift: C₁ᵦ upper bound 0.380868 → 0.380861 (constants/1b.md)`. WHY: *recognition over recall* — today every alarm looks identical, so the title carries no information and the reader must open the issue and read a raw diff to learn whether anything matters. EFFORT: ~10 lines (have `reverify.mjs` emit a one-line summary; pass it to `--title`). DELIGHT-IMPACT: high — this is the moment the product delivers its entire value, and right now it delivers it as a filename.

**P-2 — lead the body with the verdict, not the diff.** WHO: steward. WHAT: prepend `WHAT MOVED / OLD → NEW / WHICH SURFACES NOW DISAGREE / WHAT TO CHECK FIRST` above `finding.txt`. WHY: *progressive disclosure* — the diff is the evidence, not the message; the reader needs the judgment call ("legitimate record change → snapshot" vs "suspicious → investigate") surfaced before the 109-file context. EFFORT: small. DELIGHT-IMPACT: medium-high.

**P-3 — one alarm, not a pile.** WHO: steward. WHAT: reuse/update a single open drift issue instead of filing a new one each failing day. WHY: *Hick's law* — an unresolved drift that files a fresh issue daily converts one signal into a growing list, and the alarm starts reading as noise, which is exactly how a monitored surface stops being monitored. EFFORT: small (`gh issue list --search` before create). DELIGHT-IMPACT: medium — matters on day 2 of any real drift, not day 1.

### Not shipped today, deliberately

All three are reversible micro-fixes that would normally ship under default authority. Holding them: David held new work on this lane 2026-07-23, and today already spent its budget on a defect that made the alarm itself fake. Ship on the next greenlight; P-1 first.

> **Superseded 2026-07-24 — read the Render section below before acting on this paragraph.** The hold was lifted the same day, having been accidental, and **P-1 shipped**. Only P-2 and P-3 remain deferred. P-3's stated premise — that it "matters on day 2 of any real drift, not day 1" — was **falsified on 2026-07-25**: three consecutive pushes each filed their own issue for one condition, no real drift required. It still isn't worth shipping unasked, but the reason is now "small annoyance, rare" rather than "only pays during a multi-day drift."

### Validation status

Not persona-tested. `/persona-friction` drives a **browser** against a URL, and F-1 terminates in a GitHub issue with an audience of one — there is no page to test. The flow that will need persona validation is F-2, and it doesn't exist yet.

---

## Rotation 2 (2026-08-17) — F-2, the spot-check, now that its gate is gone

**The genuinely great version, named first.** A researcher about to cite a constant opens one page, types or clicks the constant they care about, and sees: the current best bound in both directions, the exact upstream row it came from, **the date that row last moved**, and a one-line "this was verified by machine N hours ago" stamp. No account, no clone, no trust required — the page links the primary source beside every number so they can check us in one hop. The delight is not "we have a database"; it is *"I asked a question I could not previously ask cheaply, and got an answer with its provenance attached."* That is F-2 done properly, and it is the only flow that speaks to the core problem in the user's own words.

**The floor (reduce-steps), for contrast.** Today the path is: guess that we mirror `teorth/optimizationproblems` → clone our repo → run `npm run check` → read 233 claim lines → still not know when the row last moved, because our output asserts *current sync*, never *history*. That is not a long flow; it is an absent one. **Named principle: recognition over recall** (Nielsen) — we require the visitor to recall which upstream repo we steward and how our ledger is laid out, when the interface should simply show them the constant they named.

**Scoped shippable slice, and it is deliberately not the great version:** `scripts/lookup.mjs <constant-id>` — prints the pinned upper/lower rows for one constant, the upstream sha they were snapshotted at, and the date that pin last changed (derivable today from `git log -- ledger/claims.json`, which is exactly what `catch-rate.mjs` already walks). Effort ~60 lines plus a self-test proving both answers. It is a trusted-print instrument, so it routes through the cross-family review lane; two of this lane's diffs are already queued there, so this one is **spec'd here and queued, not shipped today**.

**Why the great version is not shrunk to fit today:** a page needs a hosting decision and a generation step, and the ambition is the point — F-2 is the flow that turns this repo from *a record of our own honesty* into *a thing that answers someone else's question*. Surfaced for David rather than quietly reduced to a CLI.

### Render read (2026-07-24) — P-1/P-2/P-3 confirmed against the LITERAL render

The three proposals above were written from the code's intent, before the alarm could fire. On 2026-07-24 the alarm was fired for real (synthetic drift, issue #1, GitHub GFM API render captured) and the render is **worse than proposed**: the diff's `+/-` direction is destroyed (renders as bullet + nested sub-bullet, no removed/added marker), `$…$` numbers render as italic math, two H1s, 12 irrelevant HOLDS below-fold. Details in `docs/findings/2026-07-24-peak-moment-render.md`. **SHIPPED 2026-07-24 (David greenlit): code-fence + P-1 (title names the drift), both verified against GitHub's own GFM render.** P-2 (verdict-first) and P-3 (one rolling issue) deferred — polish that only pays on a multi-day real drift.

## Rotation 3 (2026-08-22) — F-2 again, the step AFTER the number is read

**The genuinely great version, named first.** A researcher spots a row that disagrees with the
paper in front of them, and telling us costs one click *from that row* — the report arrives already
naming the constant and the mirror sha, so the steward acts without a round-trip and the researcher
never has to explain which of 111 rows they meant. The delight is that doubting the ledger is as
cheap as reading it; a ledger whose product is honesty should make being told it is wrong the
easiest thing on the page.

**The step that was worst.** Reporting. The only path was a single link in the intro box, and a
reader deep in the table had scrolled roughly 700 lines past it — then had to reconstruct and retype
which row they were looking at. Named principle: **Nielsen heuristic 6, recognition rather than
recall.** The page already knows the row; making the user re-derive it is the classic violation.

**⚠ The premise this rotation started from was FALSE and was corrected before shipping.** Today''s
primer said the reporting link sat "in the footer, below all 111 rows". It did not — it was at
`index.html:41`, *above* the table, and the footer had no such link at all. Verified against the
artifact and against the served page, with a positive control on the absence claim. The conclusion
survived (above the fold is not beside the data); the premise did not, and shipping the sentence as
written would have been a no-op that looked like success. Full note in
`docs/cold-starts/2026-08-22.md`.

### Shipped

`before →` one reporting link for the whole page, in the intro, carrying no context.
`after  →` every row carries **"looks wrong?"** beside its source link, opening a GitHub issue
pre-filled with the constant name, its id and the upstream mirror sha, plus empty prompts for what
the source says and where they saw it. 111 rows, 111 links.

Encoding order is load-bearing and is pinned by the selftest: `encodeURIComponent` before `esc`.
Both KP-78 answers demonstrated at write time — the guard fires when encoding is removed (rc=1) and
is silent when restored (rc=0), with the mutation proven to land before the run.

### Validation status

Not persona-tested. `/persona-friction` drives a browser, and the change is one anchor per row on a
page whose render was already reviewed on 2026-08-21; the encoding risk it introduces is offline-
testable and is tested. **Below the traffic floor** — 4 unique viewers in the trailing 14 days
against a 30-arrivals/7-day bar — so there is no readable cohort and none is claimed.

---

## Rotation 4 (2026-08-23) — F-2 again, finding what MOVED without reading all 111

**The genuinely great version, named first.** A researcher who relies on a handful of constants
asks *"has anything I cite moved lately?"* and the page answers in one action, newest first, with
the date beside each row and the primary source one hop away. The delight is that the ledger stops
being a thing you consult about a number you already suspect, and becomes a thing that tells you
which of your numbers to suspect.

**The step that was worst.** Every row already carried the date its pinned text last changed —
that shipped with the page — but the dates were readable only one row at a time. Finding what had
moved meant scanning all 111 rows and holding a comparison in your head. The data was present and
the affordance was absent, which is the more expensive kind of gap: it looks finished.

**⚠ The obvious design was wrong, and the distribution is why.** The intended ship was a
"changed in the last 90 days" filter. **208 of 222 pins carry `2026-07-24`** — the day the ledger
first pinned them, not a day anything moved. Today minus 90 days reaches back past that, so the
filter would have matched all 111 rows: a control that looks like it is narrowing and is not. Even
a 30-day window lands within a day of the bootstrap date and will silently swallow it as the
calendar advances. **Shipped a sort instead** — no threshold to justify, none to re-tune, and it
degrades correctly as more rows move. Ten rows have moved since bootstrap; those are the ten the
sort surfaces.

### Shipped

`before →` 111 rows in id order, each dated, no way to ask which dates are recent.
`after  →` an **Order** control beside the filter: *by constant id* (default) or *most recently
updated first*. Each row publishes its date — the later of its two sides — as a sort key. The two
controls compose, so a filter on "Grothendieck" can also be ordered by recency.

**The default is deliberately still id order.** A page headlining "every constant this ledger
watches" that opens showing ten of 111 misrepresents the ledger, and at ~4 viewers/14 days there is
no usage signal that would justify the trade. The recency view is one action away, not the front
door.

**What the date means is stated on the page, not implied.** It is when *our pin* changed, which is
bounded by our snapshot cadence — not when the record moved in the world. The selftest asserts the
page never upgrades the one into the other, and that an undated row sorts **last**: could-not-date
is not changed-longest-ago.

### Validation status

**The reorder is executed, not read.** The selftest extracts the script from the page it generated
and runs it against a stub DOM — newest first, undated last, id order restored on switching back.
Four negative controls, each proven to land before its run: control removed, date taken from the
earlier side, undated sorted first, and id order left re-sorted; all four fired on their own
assertion, and the restored tree was silent.

**Not browser-verified.** The Chrome extension was not connected this session, so no live render
was captured. The stub-DOM run covers the ordering logic; it does not cover layout of the new
control at narrow widths, which remains unverified and is the honest gap in this rotation.

**Below the traffic floor** — ~4 unique viewers in the trailing 14 days against a 30-arrivals/7-day
bar. No readable cohort, none claimed; shipped on judgment.

---

## Rotation 5 (2026-08-24) — F-2 again, the word the page uses for two different events

**The genuinely great version, named first.** A researcher opens the page, orders by most recently
updated, and the top of the list is *only* the things that actually moved. Not the things someone
retyped. The ledger's whole claim on a reader's attention is that it knows the difference between a
record moving and a page being edited — so the page itself has to know it out loud, or the claim is
just a sentence in a README.

**The step that was worst, and today produced the proof.** Every row said `last changed <date>`.
That one phrase covered three different real-world events: a bound actually moved, someone edited
the text around a bound that did not move, and the row has never changed since the day we started
tracking it. This morning upstream escaped the markdown-active characters inside inline math on six
pages (`5c4aeee`, an upstream sha; it does not resolve in this repo). Two pinned rows broke on a
backslash. **No number changed anywhere** — and the page then dated `53a` and `56a` to today, so a
reader using yesterday's new Order control met two records at the top that had not moved. The
README promised "the date each row last moved" and that promise was false for two rows within
twenty-four hours of the control that made it visible.

Named principle: Nielsen's **match between system and the real world**. One system word standing
for three distinct real events is not concision, it is a mismatch the reader has to resolve without
the information to do it.

### Shipped — `a7bf5ff`

`before →` every row: `last changed 2026-08-24`, for all three cases alike.
`after  →` three honest labels, decided per row:

- `value changed 2026-08-23` — the numerals in the bound cell differ from the previous version.
- `text edited 2026-08-24 — bound unchanged` — the row changed byte-wise and the bound did not.
- `first pinned 2026-07-24 — unchanged since` — this row has never changed since tracking began.

Live distribution across 222 pins: **208 first-pinned, 8 value changed, 6 text edited.**

**The third label is the bigger win and it was nearly missed.** 208 of 222 pins carry `2026-07-24`,
and yesterday's rotation named that as *the thing that will mislead you first* — the bootstrap date
reading as a change date. It cost one extra branch to retire, because the same comparison that
distinguishes value from text also distinguishes *there was no previous version*.

**What it does NOT claim, deliberately.** `value changed` says the numerals in the bound cell are a
different multiset than before. It does not say the bound improved, does not rank rows, and does
not name a record — the same restraint the generated pins observe. Confining the comparison to the
first cell is why: a changed citation year is not a moved bound, and comparing whole rows would
have called `87a`'s degree-8-to-degree-12 correction a value change. It reads `text` instead, and
an assertion pins that so a future simplification to whole-row comparison fails a test rather than
a reader.

**Ordering was left alone.** A text edit still sorts as recent. Changing sort semantics is a
different decision with no usage signal behind it, and the label already tells the reader what they
are looking at.

### Validation status

**Both KP-78 answers, on production data and on fixtures.** The classifier was run against the real
ledger before it was wired in: today's two escaping edits read `text`, yesterday's two genuine
movements (`15a` `2.371339 → 2.371177`, `3a` `1.1835129324 → 1.19102809`) read `value`, and `87a`'s
citation correction reads `text`. Negative control: `changeKind` forced to return `"value"`
unconditionally — the selftest failed on *"an escaping-only edit must read as a text edit"*, exit 1.
Restored, exit 0. The mutation was proven to take effect by that exit-code flip, not by a diff
count, and the file was restored from a copy rather than `git checkout` because the tree was dirty.

**Not browser-verified.** Same honest gap as Rotation 4: no live render captured this session, so
the label's appearance at narrow widths is unverified. The wording, the classification and the CSS
class are covered by assertions; the layout is not.

**Observable, stated in the sub-floor shape.** The surface is at 3 unique viewers in the trailing
14 days, far below the 30-arrivals-in-7-days floor, so this carries no instrument read. What would
be observed if it worked: a `looks wrong?` report disputing a row we labelled *text edited* would
mean the classifier mis-called it, and would arrive as a titled GitHub issue. **Nothing observable
yet at N=3; shipped on judgment.**

---

## Rotation 6 (2026-08-28) — F-2, the report link that competed with its own measurement

Shipped `888a1e5`; the write-up lives in `docs/daily/2026-08-28-prelaunch.md` and was never copied
here, which is why this heading exists. In one line: the intro's *"that is a bug worth reporting"*
pointed at the bare GitHub issues list, and `report-rate.mjs` classifies an arrival by the prefilled
title or body marker — so an issue filed from the page's loudest link scored `arrivalKind() === null`
and never counted. The intro now names the per-row **looks wrong?** control.

---

## Rotation 7 (2026-08-29) — F-2, the one thing the page is named after and never supported

**The genuinely great version, named first.** A researcher who has just satisfied themselves that a
bound is what they thought copies a single block of text into their paper, their talk, or the forum
thread they are arguing in — and that block carries the constant, both pinned bounds, the upstream
commit it was mirrored from, the date each side last moved, a permalink back to the exact row, and,
travelling with it, the honest statement of what the numbers are and are not. The delight is that
the ledger stops being a thing you *consult* and becomes a thing you can *quote*, with its
provenance already attached, so the person reading your paper can check you the same way you checked
us.

**The step that was worst, and it is the page's own title.** The page is called *"Is the number you
cited still current?"*, the core problem is stated in the user's words as *"I cited a number"*, and
the visitor is defined in this document as someone who **quotes a record** — and until today the
page offered nothing to quote. Rotations 2 through 6 all improved *reading* a row: finding it,
dating it, ordering it, labelling it, disputing it. Every one of them served the check; none served
the citation, which is the action the reader came to perform and the action that carries this
ledger's work to anyone else. Named principle: **Nielsen heuristic 7, flexibility and efficiency of
use** — the page supported the diagnostic path and left the accelerator for the frequent, expert
task entirely unbuilt.

**It is also the only arrival shape we do nothing for.** `G-4` names three qualifying shapes, and
*"someone cites the public page in a paper, a forum post or an upstream discussion"* is the one that
requires no GitHub account, no issue, and no contact with us at all. It was the shape with zero
affordance behind it.

### Shipped — `b1a73bd`

`before →` a row you can read, check and dispute, and nothing you can quote. A reader who wanted to
cite it retyped the constant, the number and a bare link by hand, dropping the sha and the caveats.
`after  →` every row carries a **cite** disclosure beside `source` and `looks wrong?`, revealing a
ready-made block:

```
Bounds Ledger — The real Grothendieck constant (10a)
upper bound: $< \dfrac{\pi}{2\ln(1+\sqrt{2})} - 10^{-4}$ (value changed 2026-08-12)
lower bound: $\dfrac{6\pi}{11}\approx 1.71360$ (value changed 2026-08-12)
Mirrored from teorth/optimizationproblems@3a14910. These are the last-listed rows of that
constant's bounds table — a listing position, not a statement that this bound is the strongest
or most recent. A snapshot at that sha, not a live read.
https://u00dxk2.github.io/bounds-ledger/#c-10a
```

**The caveat is inside the citation, and that is the whole design.** A citation is the only artifact
on this page that *leaves* the page. Every honesty the page provides in context — that these are
last-listed table rows and not a ranking, that this is a snapshot at a pinned sha rather than a live
read — is stripped the instant the text is pasted somewhere else. So it travels in the text or it
does not travel at all. A ledger whose product is catching other people's stale citations must not
become a source of them.

**Native `<details>`, no JavaScript.** The block is revealed by the element the platform already
provides and the `<code>` carries `user-select:all`, so one click selects the whole citation. A
clipboard button was considered and declined: it needs a permissions path, an insecure-context
fallback and a test for each, which is gold-plating at 3 viewers per fortnight. The lazy version is
also the one that works with JS off.

**Deliberately NOT included: a "retrieved on" date.** It is the most conventional line in any
citation and it would have been the dishonest one — the page is regenerated on commit, so it cannot
know when it was last read, and the page says so directly two paragraphs above the table. A citation
implying a retrieval date the artifact cannot support would be this lane's own defect, printed 111
times.

### Validation status

**Both KP-78 answers, on the assertion that actually matters.** The load-bearing property is not
that a citation renders — it is that the caveat travels. Negative control: the caveat line deleted
from `citation()`, the mutation proven to land by `diff` against a file copy (not `git diff`, which
showed 72 lines of unrelated new work and could not isolate it), selftest exit 1 failing by name on
*"a citation without its caveat invites the mis-citation this ledger exists to catch"*. Restored
from the copy — `git checkout --` would have discarded the uncommitted fix — exit 0. Escaping is
pinned the same way as `flagUrl`: plain text built first, `esc` at embed, with a hostile constant
name asserted to arrive escaped once and never double-escaped.

**The page's own record-claim guard caught the first draft, and it was right to.** The caveat
originally read *"not a claim about the current record"*; the standing
`doesNotMatch(/is the record|current record|best known bound is/i)` fired on it, reading a
disclaimer as a claim because a substring guard cannot parse negation. **The fix was to reword the
caveat, not to loosen the guard.** Weakening a verifier so a candidate passes is the move this repo
forbids everywhere else, and a page one edit away from asserting a record is exactly what that
assertion is for.

**Not browser-verified — fourth consecutive rotation, and now tracked.** The Chrome extension is
still not connected (`tabs_context_mcp` → *"Browser extension is not connected"*, tried once, not
retried). Unlike Rotations 4 and 5 this is no longer only a paragraph here: it is `A-36`, due
2026-09-03, whose `onTrigger` forbids closing it by reasoning from the CSS. The `<details>` element
collapses to the word *cite* and the revealed block is `max-width:40rem` with `pre-wrap`, so the
narrow-width risk is real and unmeasured.

**Below the traffic floor** — 3 unique viewers in the trailing 14 days against a 30-arrivals-in-7-days
bar. No instrument read is claimed. What would be observed if it worked: an inbound link or a
citation naming `u00dxk2.github.io/bounds-ledger/#c-<id>` with a row anchor — the anchor is the tell,
because it can only come from someone who used this control rather than the bare page URL. It would
surface as a GitHub referrer row in `npm run traffic`, or in the text of an issue or upstream
discussion. **Nothing observable yet at N=3; shipped on judgment.**

> **The tell named above is now WRONG, corrected 2026-09-03 rather than left to rot.** Rotation 8
> repointed the citation at `c/<id>.html`, so a citation arriving from this control no longer carries
> `#c-<id>`. The observable is the same shape at a different address: an inbound link or citation
> naming `u00dxk2.github.io/bounds-ledger/c/<id>.html`. This is the stale-blocker pattern this repo
> keeps catching, caught this time in the same session that caused it.

---

## Rotation 8 (2026-09-03) — F-2, the two promises the page made about itself

**The genuinely great version, named first.** A researcher who has satisfied themselves that a bound
is what they thought copies one block out of the table, and the address inside it is the page that
exists for that one constant — the same address we declare canonical, the one that still resolves
when the table is reordered and the row moves. Nobody reading their paper is dropped into the middle
of a long table to hunt for the row being cited, and every constant this ledger tracks is actually
on the page they land on. The delight is that quoting us is as trustworthy as reading us: a ledger
whose entire product is catching other people's stale citations must not publish a second-best
address for its own records, nor promise a coverage it does not have.

**The step that was worst, and there were two of them — both were the page describing ITSELF.**
Rotations 2 through 7 all improved what the page says about the mathematics. Nothing had audited what
it says about itself, and both statements were false.

1. **Two addresses for one object.** Every row's `cite` block emitted `<SITE>#c-<id>` — an anchor
   into the table. Since 2026-09-02 each constant also has its own page at `c/<id>.html` which
   declares itself `rel="canonical"`. So for two days the site handed a reader one address while
   telling search engines a different one was authoritative. Filed as `A-40` earlier the same day,
   whose `onTrigger` dated the ship 2026-09-04; this session ran a day early on spare capacity, so
   the row closes on 09-03 rather than slipping. Named principle:
   **Nielsen's consistency and standards** — one object, one name.
2. **The founding record was not on the page at all, and the README said it was.** `constantIds()`
   returned 114 while the mirror carried 115 constant files. The absent one was `1b`, the Erdős
   minimum overlap constant — the discrepancy this repo opened on, the subject of reconciliation #1,
   and the number in the README's own first paragraph. Three lines under that paragraph the README
   promised "All 111 tracked constants" (and, three lines later again, "112 named constants are
   tracked" — two hand-typed numbers, both stale, guarding a promise that was false for a third
   reason nobody had checked). **A visitor who read the opening story and clicked through could not
   find the number the story was about.**

**Why the second one was invisible.** `extract-pins.mjs` carried `SKIP = new Set(["1b.md"])` from
2026-07-22, when 1b *was* the whole ledger and a generated pin beside hand claims C-1/C-3 would have
been pure duplication. The public page shipped 2026-08-21 and builds its rows from `pin:` ids alone,
so from that day a de-duplication silently became a coverage hole. Nothing reported it, and the
reason is worth keeping: **every instrument here checks the rows that EXIST against upstream, and
none asks which rows are ABSENT.** That is the founding defect in a new hat — an alarm that cannot
fire on the thing that is missing.

### Shipped

`before →` a `cite` block handing out `<SITE>#c-<id>`; 114 rows; a README promising 111 in one
sentence and 112 in the next; `1b` nowhere on the page.
`after  →` every row's citation carries that constant's canonical `c/<id>.html`; the table and the
per-constant page now quote the **same citation, byte for byte** (`pageCitation()`, a local
`.replace()` substitution, is deleted — the divergence it papered over is gone rather than patched);
115 rows including `1b`; both README sentences read 115 and are **asserted**, not typed.

**The count was fixed by making the claim true, not by rewording it.** "All N tracked constants" was
wrong in two ways at once, and only one of them was the number. Editing 111 to 114 would have
produced a true sentence about a page that still omitted the record this repo exists because of.

**The two generated pins added for `1b` assert a LISTING POSITION and nothing more** —
`| $0.380868$ | [...] | SimpleTES |` and `| $0.379005$ | [W2022] |` — which is the same refusal the
other 228 observe. They do **not** replace or duplicate C-1/C-3: those are human-verified RECORD
claims ("the current best known upper bound is 0.380868"), a statement the table's own guard forbids
it from carrying. Different claims about the same file, re-verified independently. If they ever
disagree, that disagreement is exactly the kind of finding this ledger exists to produce, and holding
only one of them would have hidden it.

**The absent-row class got an instrument, because the judgment that found it will not recur on
schedule.** `render-state-block.mjs --check` now asserts the README's coverage sentences against the
number of rows in `index.html` — the artifact a visitor actually loads, not the ledger it came from,
with `render-site --check` already closing the ledger-to-page link. A future skip is therefore not
merely discouraged by a comment: it turns the front-door promise red until someone reword it to say
something true.

### Validation status

**Both KP-78 answers, three times, each proving the assertion it actually tripped.** (1) Anchor form
restored in `citation()` → `render-site --selftest` exit 1 on *"row 2a's citation must carry that
constant's canonical page URL"*. (2) The same mutation with the per-row loop neutralised → exit 1 on
the unit-level assertion instead, so both levels are proven live rather than one shadowing the other
— the 2026-09-02 lesson that a mutation proves the assertion it TRIPPED, not the one you meant.
(3) The same mutation against `render-constant-pages --selftest` → exit 1 on *"the page's cite block
must cite the page, not the table row"*, which is the assertion that now catches a re-added local
substitution. Restored, all silent. Every mutation was proven to land by grep before its verdict was
read. The coverage guard carries six fixture cases including both sentences failing independently,
the heading removed, the phrases appearing outside their section, and a zero row count reported as
**UNREADABLE rather than stale** — a guard that reads a broken selector as a content failure sends
the next reader to rewrite correct prose.

**Verified on the LIVE PUBLISHED PAGE, not on local bytes**, because identical-input is not the
same claim as measured-output and this lane has been bitten by the difference. Pages build row for
the push tip `3b08874` reports `built` at 2026-09-03T21:23:18Z; fetched immediately after.
Positive control first — the page's own title string is present — then: **115 rows**, `id="c-1b"`
present, **0** anchor-form cite URLs, **115** canonical cite URLs, **115** row permalinks still
`href="#c-"`. `c/1b.html` serves **200**, declares itself canonical, carries both pinned bounds, and
its cite block ends at its own address. Before, on the same probe: 114 rows, no `c-1b`, 114
anchor-form cite URLs.

**Reader reach is unknown and that is the honest answer, not a gap.** GitHub Pages hands us no
request log and client-side analytics are refused by an enforced selftest
(`docs/evangelism-bar.md` § Reader reach). `npm run traffic` counts repo views and `npm run reports`
counts issue arrivals; neither is readership. Latest read 2026-09-03: ≤6 distinct viewers in 26 days,
2 in the trailing 14. **Nothing observable yet; shipped on judgment.** What would be observed if it
worked: a citation or inbound link naming `c/<id>.html` — the path is the tell, because it can only
come from someone who used the cite control.
