# Daily report — bounds-ledger — 2026-09-26 (MT)

Three-stage day (David, card `99bb9206`): P1 evidence and choice, P3 the product-work loop, P5 the delta-only close. This file opens with the P1 selection packet; the report's other sections are written at the close.

## Selection packet (P1, written 2026-09-26 at about 15:45Z)

**Outcome:** settle what the public page tells a reader about constant 46a's credited source. **Item:** `A-56` (settle 46a's depth-audit entry by reading the published body of Bourgain's GAFA 1991 paper, pp. 149–187).

**The user problem, in the user's words** (from `docs/evangelism-bar.md`): *"I cited a bound and a referee told me it had been improved. I had no way to know."* The version this item serves: a reader about to cite 46a's extension exponent 58/15 with the reference [Bo1991] sees a badge saying our check of that reference is UNRESOLVED, and no answer. Either the paper states 58/15, or the citation points at the wrong Bourgain paper.

**Evidence, one line each:**
- OBSERVED: `node scripts/depth-audit.mjs` at 2026-09-26 about 15:43Z printed `A-47-0030  46a [Bo1991]  UNRESOLVED  (value-vs-source)  selection: systematic`. Source: our audit store. Population: the 34 audited rows. Limit: this is our own reading, not a reader's.
- OBSERVED: at HEAD `08b739b`, a Grep count for `A-47-0030|46a` finds 10 matching lines in `c/46a.html` and 4 in `index.html`, so the committed pages carry the entry. [linter-report] Limit: I read the committed files, not the served bytes. Served bytes were last read on 2026-09-25 (`npm run served`: 23 of 23 served).
- OBSERVED, from `A-56.note` (the 2026-09-24 reading): the July 1990 IHES preprint of the paper (M/90/62) and the published pp. 147–148 give 31/8. Bourgain's companion paper, IHES M/90/74, proves 58/15 (Proposition 2.15).
- HYPOTHESIS: the published body does not state 58/15, which would make the citation defective. The adversarial review of 2026-09-24 (round 6) refused to store DEFECTIVE on this hypothesis, because a published paper that cites its companion could still state the value.
- MISSING: the text of the published pp. 149–187. That is the whole of what settles the entry.
- MISSING: any reader of `c/46a.html`. The page has no analytics and GitHub Pages provides no request log (`docs/evangelism-bar.md`, "Reader reach is unmeasured").

**Recurred prior-day finding that bears on this choice:** the 2026-09-25 retro's finding 4 (the census store fed the page David froze). It does not recur here. `A-47-0030` renders on the constants pages, which are not frozen; the freeze covers `ramsey.html` and `copying.html` only.

**Permission:** `A-56` is open with no park, and nothing is waiting on David for it. A depth-audit verdict with its re-render is lane work under David's 2026-09-09 depth ruling (`A-47`). The row's own limit binds: nothing goes upstream. A correction to the mirrored 46a entry is outward contact, so it needs adversarial review first and David's approval after that.

**Next action:** kind: **improve**. Run the three routes in `A-56.waitJustification.unWait` in order and record each one's literal HTTP result on the row. First command:

```bash
node scripts/sky.mjs show-item.mjs A-56 --fields onTrigger,waitJustification.unWait,closeWhen
```

Reading brief constraint (standing since 2026-09-25): the brief sends no email address or name to any service, and Unpaywall is not a route.

**Acceptance condition, observable:** one of these two outcomes.
- (a) `node scripts/depth-audit.mjs` prints `A-47-0030 … SOUND` or `… DEFECTIVE`, read from the published body and stored with that source. The adversarial review ran before the commit. `c/46a.html` and `index.html` are re-rendered and committed, and `npm run served` reads them SERVED.
- (b) The three routes are recorded on `A-56` with their literal results, `A-47-0030` stays UNRESOLVED with the routes named, and `A-56` closes as "no reachable copy". (b) changes nothing a user sees, and the P3 receipt says so.

**Delivery and encounter checks:** delivery is read by `npm run served` after the push. Encounter cannot be read: no reader of `c/46a.html` is measurable. The only event that could appear is a report filed through the 46a row's own link, counted by `npm run reports`. One such arrival is one event, not a rate.

**USER-FACING: yes** for outcome (a): `continuity/depth-audit.json` (user-read data), `c/46a.html` and `index.html` (served pages), and `continuity/items.json`. Outcome (b) touches `continuity/items.json` only, with the depth-audit notes possibly amended to name the routes.

**HYGIENE INPUTS** (copied from the kickoff's reads, composed at 2026-09-26T15:41:40Z):
- (a) Due rows not bearing on the choice, **2**:
  - `A-52` (write down how an outsider could act on a record without filing an issue), expectedSignalBy 2026-09-26. The kickoff shows its last run as 2026-09-25T00:04:16Z, and the `arrivalShapes` field is still absent.
  - `G-4` (an outside party acts on a watched record without us filing the report), expectedSignalBy 2026-09-26, last run NEVER.
- (b) Owed child rows in the orchestrator's ledger: **none**. Read: "rows owed to you in skylark-site's ledger: 0 of 724 considered".
- (c) State reads marked CROSSED or not judged, **3**:
  - Dated gates due today: 3 of 3 due, 3 UNREAD. One of them is `A-56`, selected above.
  - Prior-day retro: 2 of 2 tagged findings "still on discipline".
  - missingLinkedCommits: NOTHING SWEPT (0 of 0 considered), so it was not judged.

**Yesterday's recommendations** (Section 0, Step 0.10, from `docs/daily/2026-09-25-prelaunch.md` § Recommendation):
- `A-56` on 2026-09-26: carrying today, to P3 (selected above).
- `A-47` slice 8 on 2026-09-27: carrying, to tomorrow.
- `A-54` census session 2 and the rate checkpoint on 2026-09-28: carrying, to 2026-09-28.

## Prep while P1 is under review (nothing stored, nothing committed)

**Route 2 reached the published text, so the premise that the body sits only behind Springer's paywall was wrong.**
- EuDML's entry `https://eudml.org/doc/58112` links "Access to full text" to the Göttingen Digitisation Centre (GDZ), which holds GAFA volume 1 as page images.
- The IIIF manifest returned HTTP 200 with 437 canvases, and canvas n is printed page n−6.
- All 41 images for pp. 147–187 returned HTTP 200. They are saved under `tmp/depth-reads/a56/gdz/`, which is gitignored, and are not republished.
- Route 1 (Springer's preview) still stops at p. 148. Route 3 (collected works) found no volume and was not needed.
- The literal HTTP results are in `tmp/depth-reads/a56/routes-log.md`.
- Nothing identifying was sent: default Node user agent, no email address and no name.

**Positive control (I read these images myself).**
- p. 147 carries "Geometric and Functional Analysis Vol. 1, No. 2 (1991)" and "© 1991 Birkhäuser Verlag, Basel".
- p. 187 carries "[Bo2] J. BOURGAIN, On the restriction and multiplier problem in R³, Preprint IHES, M/90/74" and "Submitted: February 7, 1990".

**The reading.**
- A sub-agent read all 39 images, pp. 148–186, offline and reported a per-page summary. It found no "58/15", no "4 − 2/15" and no 3.866… anywhere.
- I read pp. 148, 182, 185 and 186 myself:
  - p. 182: Proposition 6.47, the L^∞(S_{d−1}) → L^p(R^d) extension bound for p > 2{p(d)′/(d+1) + d/(d−1)}, and Theorem 6.49 with r ≤ 31/23.
  - p. 185: "Take p₀ = 31/8. By discretization of Proposition 6.47 …".
  - p. 186: the single citation of [Bo2], "Added in proof: The reader may find some refinements of the techniques and results of the present paper in [Bo2]", which states no exponent.
  - p. 148: "for d = 3, one gets (0.6) for p < 31/23".
- My arithmetic: with p(3) = 7/3, (6.48) gives 2(7/16 + 24/16) = 31/8.

**What this supports, pending P3 and the adversarial review:** `A-47-0030` DEFECTIVE. The published [Bo1991] proves the extension exponent 31/8. The row's 58/15 is Bourgain's companion paper [Bo2] (IHES M/90/74, Proposition 2.15), which the published paper names only as a source of "refinements" and never with that exponent.

**Section 0 lines:**
- Gate: `npm run verify` at HEAD `08b739b` printed `[verify] TRUE exit 0`. Its output included "No drift. 116 files match upstream" and "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)". The brief leg was UNVERIFIABLE because of a sign-in redirect, which is advisory under `A-41` (the rule that an unreachable brief is reported but not counted).
- CI: `check-ci-status --workflow reverify.yml` on `08b739bd42` returned GREEN (exit 0).
- Deploy: `check-deployed-sha-drift` is clean across 33 services but swept NOTHING for this lane. This lane publishes to GitHub Pages and has no Render service, so the read is neither a stop nor a pass. The lane's own served-bytes read is `npm run served`.
- Harness: running 2.1.283 · fleet UNIFORM · installed 2.1.283 (SAME).
- Codex: GREEN, from the probe line on the kickoff (2026-09-26T15:31Z). Not used for this choice.
- Cycle rotation: no product-love cycle picks this lane today (exit 0).
