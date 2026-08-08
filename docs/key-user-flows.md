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
| F-2 | **Spot-check one claim** — "is the number I'm about to cite current?" | outside researcher | **no surface at all** |
| F-3 | **Receive a correction** — a curator is told their published record is behind | upstream maintainer | sent once, 2026-07-24 (A-3, David-sent); awaiting reply — tracked as W-3 |

F-2 is where the core problem lives, and it has **zero** surface: the only way to ask "is this current?" is to clone a private repo and run `npm run check`. That is the gap, but closing it means a public status surface, which is the **public-repo flip — David-gated**. Not a micro-fix; do not ship it unasked.

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

### Render read (2026-07-24) — P-1/P-2/P-3 confirmed against the LITERAL render

The three proposals above were written from the code's intent, before the alarm could fire. On 2026-07-24 the alarm was fired for real (synthetic drift, issue #1, GitHub GFM API render captured) and the render is **worse than proposed**: the diff's `+/-` direction is destroyed (renders as bullet + nested sub-bullet, no removed/added marker), `$…$` numbers render as italic math, two H1s, 12 irrelevant HOLDS below-fold. Details in `docs/findings/2026-07-24-peak-moment-render.md`. **SHIPPED 2026-07-24 (David greenlit): code-fence + P-1 (title names the drift), both verified against GitHub's own GFM render.** P-2 (verdict-first) and P-3 (one rolling issue) deferred — polish that only pays on a multi-day real drift.
