# bounds-ledger — 2026-10-08 (Thursday, MT)

## P1 selection packet

[P1 — Evidence and choice]

**Outcome and item:** `A-65` (the 10c page's source link names a line of the mirrored file that has since moved). A reader who follows the source link for the 10c certificate reading reaches the right place in the file, and the page says where to look in words that the renderer has checked.

**The user problem, in the user's words** (the bar's reader, `docs/evangelism-bar.md`): "I want to check what you checked." The 10c line says the certificate was recomputed, then offers a "source link" that points at line 281 of our mirror of `constants/10c.md`. The certificate's heading is at line 283, and line 281 closes a different certificate. GitHub opens a `.md` file rendered, where a `#L` anchor does nothing, so the link actually lands at the top of a 444-line file (line count read today).

**Evidence**
- OBSERVED: `git grep -n -E "\.md.L[0-9]" -- c/` on today's HEAD tree matches one line, `c/10c.html:30`, linking `.../constants/10c.md#L281`. Population: every committed constant page under `c/`. Window: HEAD today. Limit: it reads the committed pages, not the served ones. Positive control: the same line also carries the row link `10c.md?plain=1#L50`, which this pattern correctly does not match.
- OBSERVED: a Grep of the mirror for `^## Certificate for the` prints line 283, `## Certificate for the $7/\sqrt{17}$ lower bound`, today. Line 281 is not that heading. The 2026-10-02 reading on the row still holds.
- OBSERVED: a Grep of `continuity/depth-audit*.json` for `bounds-ledger/blob` counts 1 match in 1 file (`depth-audit.json:545`, entry `A-47-0023`). This is the sweep that `A-65`'s onTrigger asks for, and it finds no second source pointing into the mirror. Positive control: the match is the known 10c entry.
- HYPOTHESIS: a reader who wants to verify the recomputation is sent to the wrong place. No reader report of this exists.
- MISSING: any measure of whether a reader has followed this link. The published pages have no analytics and Pages gives no request log (`A-59`, encounter is blind on the public pages, read 2026-10-28).

**Permission:** lane-owned. This is a change to our own public page and our own store, with no upstream contact, so it ships under authority. As a public surface it gets a review from the other model family (Codex, read-only) before push. It is not covered by the `A-54` freeze, which holds census rows off `ramsey.html` and `copying.html` only. `A-63`'s ruling that `sourceRead` is the historical record and is not edited is honoured: the form chosen leaves `sourceRead` untouched.

**Next action (improve):** the form recorded on `A-65.disposition2026_10_06`, plus a text check. Store entry `A-47-0023`'s `source` becomes the mirror file with no line anchor. A NEW reader-facing field names the heading. `render-constant-pages.mjs` prints "under the heading …" beside the source link, and its `--check` refuses to render when that heading text is not present in the mirrored file. That checks the claim by its words rather than by a line number, which is the smaller version of onTrigger option (b). First command:

```
node C:/dev/skylark/bounds-ledger/scripts/render-constant-pages.mjs --selftest
```

**Acceptance condition**
1. A-65's own readCommand `git -C C:/dev/skylark/bounds-ledger grep -c -E \.md.L[0-9] -- c/` prints nothing and exits 1. Its positive control is that a `?plain=1#L` search under `c/` still finds the row-link files.
2. The live `https://u00dxk2.github.io/bounds-ledger/c/10c.html` shows the 10c reading's source link with no `#L` anchor and names the heading "Certificate for the 7/√17 lower bound" in readable text, not TeX.
3. `render-constant-pages --selftest` fails when a stored heading is absent from the mirrored file, and passes when it is present (red-armed, both outputs recorded).
4. `git diff` shows no change to any `sourceRead` value.
5. A Codex refute-it review of the diff and of the new reader-facing sentence has every finding dispositioned before push.

**Delivery and encounter checks:** delivery is `npm run served` after the push, then a live fetch of `c/10c.html` with a positive control (the new heading phrase found, `10c.md#L281` absent). Encounter stays blind. The event that would show it is an outside issue arriving through the 10c row's "looks wrong?" link (`npm run reports`), and at this traffic no N makes that readable soon.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json` (entry `A-47-0023`), `scripts/render-constant-pages.mjs` (renderer and selftest), `c/10c.html` (regenerated). Plus `continuity/items.json` for the `A-65` close, which is internal.

**Section 0**
- Primer: `docs/cold-starts/2026-10-08.md` read. Commits after it: `98bd13a` (close-session docs) and `999e0a3` (A-57 sent), both read.
- Verify: `npm run verify` receipt exitCode 0 at sha `999e0a316e8dfa83c3aaa3d4bfb3afcf6b15e22a`, at 2026-10-08T15:06:06.606Z. Its live claim check printed "244 claim(s): 242 hold, 0 broken/unreachable, 2 unverified (manual)." Both C-7 and C-9 advisory lines appeared ("HTTP 200 … still present — page unchanged"). The output's earlier "1 claim(s): 0 hold, 1 broken/unreachable" line is the A-20 retry selftest's injected HTTP 503 against `example.invalid`, not a live claim.
- Listener: 🟢 SSE alive (hello 14:48:30Z on slug bounds-ledger) + loop armed by tool call; waker ladder ranks 1-3 running.
- Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 14:56:09Z).
- CI: `check-ci-status --workflow reverify.yml` GREEN and `--workflow page-check.yml` GREEN at `999e0a3`. Deploy drift: NOTHING SWEPT for this lane, which is a Pages lane with no Render service. That is neither a stop nor a pass.
- Harness: running 2.1.294 · fleet UNIFORM · installed 2.1.294 (SAME).
- Product-love rotation: `check-cycle-rotation --lane bounds-ledger` exit 0, no cycle picks this lane today.
- Due gates: `--snapshot` taken, "2 gate(s) due on/before 2026-10-08", namely `A-54` and `W-3`.
- Yesterday's recommendations: (1) verify, `A-54` census 6, `W-3` read: carrying today → P3, beside the product work. (2) `A-47` slice 15 on 10-09: carrying → 10-09. (3) `A-65` user-visible by 10-12: carrying today → selected above. (4) open `A-57` on David's yes: executed (issue #218, 2026-10-07 19:39Z).
- Retro finding that bears on today: Q2 (a lookup done inline, then padded with unsourced fields). The new heading field must be copied from the mirror bytes, never typed from memory.

**HYGIENE INPUTS**
- (a) Due rows not bearing on the choice, 2 of 2 due: `A-54` (Small Ramsey Numbers census; session 6 and its blocked-paper retry run today as the dated read, under the row's tripwire) and `W-3` (watch for acknowledgement of the erdosproblems.com/36 correction; readCommand `node scripts/check-claims.mjs`, C-7/C-9 advisory lines).
- (b) Owed child rows: none, read "rows owed to you in skylark-site's ledger: 0 of 747".
- (c) State reads with a threshold line: board cards 1 of 1 SPENT (`78c6bb41`, dismiss it); prior-day retro 6 of 6 still on discipline; key numbers, no `docs/key-metrics.json` list (0 of 0); missingLinkedCommits NOTHING SWEPT (0 of 0). Also carried from the primer: whether to mint a row that watches issue #218 for a maintainer reply. Read today: OPEN, 0 comments, updatedAt 2026-10-07T19:39:29Z.

## P3 product work

**Action (improve), on the manager's redirect (bus d446207c):** the 10c source link now lands on the certificate. The store keeps the heading's text, the renderer finds its one line in the mirror at render time and links that line in the code view, and the page names the heading in plain words: "source link, at the heading “Certificate for the 7/√17 lower bound”". No line number is stored. `sourceRead` is unchanged.

**Implementation.** Commits, in order: `23562a9` (the change), `40cbfcf` (review r1: the path read must be the path published, the selftest checks the stored entry, the confinement case holds the heading), `90da398` (r2: judge the URL as published), `762ff2c` (r3: a stored source carries no fragment on any host), `8ee420a` (r4: a bare `#` too). The r3 change is a change of shape, not a patch. Three rounds in a row found another spelling of "a link into this repository" (upper-case host, percent-encoded owner, `www.`), so the matcher was dropped for a rule with nothing to recognise. Red-arms, each tripping its own named assertion with the file restored byte-identical: a 7→9 edit to the stored heading made `--check` exit 1 naming `A-47-0023`; unwiring the refusal failed the selftest at "a heading absent from the mirror must be refused"; three more for the r1 to r4 guards. `npm run verify` receipt exit 0 at `8ee420a` (16:45:18Z). CI `reverify` and `page-check` green at `8ee420a`.

**Delivery.** The Pages build for `8ee420a` was built at 16:45:54Z. `npm run served`: "1 checked — 1 served, 0 in flight, 0 stale, 0 unreachable". Live `c/10c.html` (200, 6680 bytes, Last-Modified 16:45:52Z): 1 match for `10c.md?plain=1#L283">source link`, 1 for the heading words, 0 for `10c.md#L281`. Positive control: 1 match for the line-50 row link on the same page. Mirror line 283 is `## Certificate for the $7/\sqrt{17}$ lower bound`. `A-65`'s readCommand through the runner: empty output, exit 1, which is the row's pass. `?plain=1#L` under `c/` still lists 44 files. `A-65` closed in `127edb0`.

**Encounter.** Blind: the pages have no analytics and Pages gives no request log, tracked on `A-59` (encounter is blind on the public pages), read 2026-10-28.

**Outcome.** Open: no read of whether a reader's check went better exists.

## A-54 census session 6 and the blocked-paper retry (dated read, due today)

- Tripwire first: 17 papers remaining against 4 × 5 slots = 20, so it did not fire and completion stays 2026-10-20. The plan was pushed in `12055d3` before any source was opened.
- Four papers attempted. Kuz (13 bounds) SOUND on arXiv 1505.07186v5, the edition cited. Ex25 UNRESOLVED: the arXiv file is not shown to be the cited "manuscript (2023)". It was stored SOUND and downgraded before push on the other-family review. CaET UNRESOLVED (manuscript read, journal edition not). HZ1 (4 bounds) UNREACHABLE.
- Codex reviewed `97d54de` (read-only, from the saved files): FIX, six findings, all fixed in `3477c23`.
- Blocked-paper retry (hard date today): nine sources tried, none opened. Each of the 17 affected entries gained a dated note, and no verdict moved.
- `node scripts/ds1-depth.mjs`: "census: 80 of 122 bound(s), across 31 of 42 credited paper(s) — 45 sound, 0 defective, 19 unresolved, 16 unreachable" (exit 0). Next census slot 2026-10-10 (13 papers against 16).
