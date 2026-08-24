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
