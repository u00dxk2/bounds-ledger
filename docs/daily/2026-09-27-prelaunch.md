# bounds-ledger — 2026-09-27 (prelaunch report)

## Selection packet (P1 — evidence and choice)

[P1 — Evidence and choice]

**Outcome:** `A-47` (the depth audit — reading our own cited records against their sources), slice 8: five more cited rows read against the papers they cite, with verdicts shown on the public constant pages.

**The user problem, in the user's words** (`docs/evangelism-bar.md` lines 20–21, verbatim): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." (Corrected at P3 after the manager review: the P1 draft quoted a paraphrase as if it were the user's words.) The depth audit is the "has anybody looked" half of that sentence, because it reads a row against its source.

**Evidence**
- OBSERVED — `npm run reports` (G-4 — an outside party acting on a watched record without us filing the report) · every issue on the public repo · 50 days since the public flip · run 2026-09-27 ~15:44Z: 32 issues fetched, 32 ours, 0 outside, 0 outside arrivals; the three parts add up to 32 + 0 + 0 = 32. Limit: it counts filed issues, not people who read a row and acted without filing.
- OBSERVED — `node scripts/depth-audit.mjs`, run live this morning at exit 0, first line literal: "depth audit (A-47): 34 row(s) audited — 19 sound, 1 defective, 6 unresolved, 8 unreachable". The 1 defective is 46a, settled yesterday (`412cd1d`). Limit: 25 rows were drawn by position and 9 were chosen for suspicion, and they are counted apart; none of it is a random-sample rate.
- OBSERVED, a defect on the public pages that this slice fixes — the same run's denominator line claims "COMPUTED, not remembered", then prints the STORED 673 of 770 from `meta.corpus` (measuredAt 2026-09-11), while `--corpus` computes 691 of 788 today. 22 public pages (21 constant pages and `index.html`, which says it twice) carry "against 673 rows that name a source, counted on 2026-09-11". The date is on the page, so the sentence is not false, but it is stale by 18 rows. The fix: refresh `meta.corpus` from `--corpus` in the landing commit, so every audited page re-renders against 691.
- OBSERVED — `node scripts/depth-audit.mjs --corpus`, exit 0 this morning: "691 cited of 788 bound row(s)". The frame moved from 673 because of the upstream burst resolved in `ce5a57c`.
- OBSERVED — candidate draw (NOT committed, prep only): `node scripts/depth-audit.mjs --draw 625 675 12 62 112`, exit 0, frame 691. Rows: 84b [BSSZ2026] (upper), 8a [S1970] (upper), 10a [SLXCKKM26] (lower, 6π/11), 13b [Elek1994] (lower), 19a [She2011] (upper). None of the five row fingerprints is already in `continuity/depth-audit.json` (grepped; no match).
- HYPOTHESIS — reader reach for the audit verdicts on the constant pages. MISSING: the page is static with no analytics, so no read exists (`docs/evangelism-bar.md` § metric: NOT MEASURABLE).
- MISSING — a product-love rotation verdict: `check-cycle-rotation.mjs --lane bounds-ledger` exit 2, UNDETERMINED ("no journey-walk artifact on record … the registry does not declare which lanes owe one"). This is not "nothing due".

**Choice of positions (settled before any source is opened).** 625 and 675 finish the offset-25 grid that slices 5–7 laid down; with those, every position of the form 50k+25 up to the frame's end has been drawn. 12, 62 and 112 start the next grid, offset 12 from the 50-grid, going upward. **Caveat, recorded here so it is not rediscovered:** the frame grew by 18 rows, so earlier slices' positions no longer point at the same rows in the 691 frame. The stored fingerprints still tie each verdict to its row. What drifted is the position grid, not the verdicts, and the sampling rule has to say so when slice 8 lands.

**Permission:** A-47 is standing work David ruled on 2026-09-09 and made the interim yardstick on 2026-09-10. No card is open on it, and the row is not parked or frozen. Nothing is sent outward: every defect found is recorded, not filed, and anything upstream goes through the outward gate.

**Next action — kind: improve (deliver built value: more rows read, shown on the public pages).** First command, at P3 start. It commits the draw onto the row and pushes it before any source is opened:

```bash
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 625 675 12 62 112
```

**Acceptance condition:** `node scripts/depth-audit.mjs` prints a count five higher than the pre-slice store, and its four verdict counts add up to the row count. The draw commit is on `origin/main` before any reading agent is dispatched. `render-site --check` and `npm run check` pass after the landing commit and the second render. `npm run served` reports SERVED for the changed constant pages.

**Delivery and encounter checks:** delivery is `npm run served` after the push, and the page rows can be read with `playwright-cli`. Encounter: the event that would show a reader used it is an outside arrival through a row's "looks wrong?" link, counted by `npm run reports`. It is readable at N=1; today's baseline is 0 of 32.

**USER-FACING: yes** — paths: `continuity/items.json` (draw and landing notes), `continuity/depth-audit.json` (verdict store and its `meta.corpus` denominator, both rendered publicly), `c/*.html` (the pages for 84b, 8a, 10a, 13b and 19a, plus the 21 constant pages whose denominator sentence re-renders), `index.html`.

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice — 1 of 2 due: `A-45` (the stale-value resolvability indicator). Read today through the gate: "RESULT: 209 of 209 resolvable (100.0%)", exit 0, stamped to `continuity/read-outputs/A-45.txt`. Its next date needs setting.
- (b) Owed child rows: none — read `show-item --index` of skylark-site's ledger in the kickoff: 0 of 724.
- (c) State reads marked CROSSED or not judged, from the kickoff: dated gates due 2 of 74 (A-45 above; A-47 is the choice). Prior-day retro: 2 of 2 findings still on discipline. Key numbers: no `docs/key-metrics.json` yet (0 of 1 files). missingLinkedCommits: NOTHING SWEPT, 0 of 0 considered, so not judged.

**Section 0:** `npm run verify` exit 0 at `34beb5c` (receipt `tmp/.verify-receipt.json`, 15:43:45Z; `check:brief` UNVERIFIABLE because this shell has no `CC_PROMPTS_PIN`, and the gate treats that as passing). CI `check-ci-status --workflow reverify.yml` GREEN at `34beb5c` (exit 0). Deploy drift: this Pages lane has no checksPass service, so the read found nothing to sweep, which is neither a stop nor a pass (fleet exit 0). Harness: running 2.1.283 · fleet UNIFORM · installed 2.1.283 (SAME). Listener up and loop armed. Codex probe GREEN from the kickoff line. Yesterday's recommendations: the one rec (`A-47` slice 8 on 2026-09-27) is carrying to today's P3.
