# Daily report — bounds-ledger — 2026-10-01

## Selection packet (P1 — evidence and choice)

**Outcome:** five more cited rows read against their cited sources, shown on the public constant pages. Item `A-47` (the depth audit: read our own cited records against their sources), slice 11, at positions 662, 37, 87, 137 and 187 in the 691-row frame.

**The user problem, in the user's words** (`docs/evangelism-bar.md`): "I got this constant from a page that says it was last edited in January. I don't know if that means it's current or that nobody has looked at it since." Each reading tells a citer whether the source a row cites supports the number shown, which they could not know without opening the paper themselves.

**Two dated gates that bear on this choice are settled as part of it, before the draw is pushed:**

- `A-53` (the audit store and the public page can disagree about how many rows were read). **Choice: (b). The render side refuses a dropped entry.** Today `usableAudit` in `scripts/render-constant-pages.mjs` silently drops any store entry that fails it, which is how slice 5's 10c entry left the page while `depth-audit.mjs` still counted it. Under (b), rendering exits non-zero and names the entry and the failing field. The alarm then sits where the loss happens and no third counter is added, which is the question W-7 asked of option (a). This keeps the 2026-09-10 rule that one malformed row must never take the published site down: the refusal stops the render and the pre-commit hook, so the previous pages stay served and the bad entry is never committed. Rejected (a): a second counter reading two counters. Rejected (c): the instance happened once already and the direction of the error flatters us.
- `A-60` (the draw does not warn when a drawn position lands on a row already in the store). **Proposed rule for position 137:** the systematic slot re-reads `1b`'s row (fingerprint `e19d80316c75fd95`, a row fingerprint and not a commit) for its value-vs-source claim and records its own systematic entry. `A-47-0015` stays suspicion-drawn. Why not mark the position covered by `A-47-0015`: that needs a new rendering path, while a fresh systematic entry is already handled. The `rechecked` assertion in `render-constant-pages.mjs`'s selftest counts a row with both kinds of reading once, as systematic. It also re-reads the row against today's mirror rather than transcribing a 2026-09-05 suspicion read. **Guard: build it** (lane-authorised tooling). `--draw` prints, per position, every store id holding that fingerprint, with both KP-78 answers recorded: it fires on 137 and stays silent on 662. pragma: allowlist sha

### Evidence

- OBSERVED — `node scripts/depth-audit.mjs` (exit 0, read 2026-10-01 ~16:00Z): "48 audited, 30 sound, 2 defective, 9 unresolved, 7 unreachable"; selection "39 drawn by position · 9 chosen because something already looked wrong". Population: the store only, not the 691 cited rows.
- OBSERVED — `A-53`'s comparison, read today: `c/4a.html` (committed) reads "39 row(s) have been drawn by position … the sources of 33 were read and 6 could not be read at all. 7 more were chosen for suspicion". The store agrees: 39 systematic entries are 39 distinct rows (33 read + 6 unreachable: 31a, 43a, 24a, 15a, 52a, 80a), and 9 suspicion entries are 7 distinct bound rows (0003 and 0016 are citation-well-formed, and 0016 shares 0015's row). **No disagreement today.** Limit: after slice 11 records 137 systematically, the page's suspicion figure drops to 6 while the store's suspicion entries stay 9. That is the existing counted-once rule, not a defect, and the comparison has to be read with it.
- OBSERVED — `A-60`'s collision, measured 2026-09-30 before any source was opened (on the row): 137 → `e19d80316c75fd95` counts 2 in the store; 662, 37, 87 and 187 count 0. Re-run today through the gate after this packet was written (`check-due-gates-dispositioned --run A-60`, exit 0, 16:01:05Z): the same five fingerprints, and a Grep over `continuity/depth-audit.json` for all five returns 2 matches, both 137's. pragma: allowlist sha
- OBSERVED — `npm run reports` (exit 0): 0 outside report arrivals, as a measured figure. Parts reconcile 32 + 0 + 0 = 32 issues seen.
- OBSERVED — CI: `check-ci-status --workflow reverify.yml` GREEN at HEAD `b963732`. This lane has no Render service, so the drift check did not sweep it.
- MISSING — any read of whether a citer has opened a constant page's audit block. The page is static and carries no analytics by design (`A-59`, encounter blind, dated 2026-10-28).

### Permission

- `A-47` is open, David-ruled 2026-09-09, and the ladder runs under that ruling. The constant pages are **not** under the 2026-09-20 freeze, which covers `ramsey.html` and `copying.html` (`A-54`) until the census rebuild lands. No board card is open on any of the three rows (`answered-cards`: none).
- `A-53` and `A-60` are lane-authorised tooling decisions, recorded on their rows.
- Outward gate: none touched. No upstream contact, and nothing beyond the ordinary Pages publish of the constant pages.

### Next action

Kind: **improve** (deliver five readings to the pages), preceded by the two guards.

```
node C:/dev/skylark/bounds-ledger/scripts/depth-audit.mjs --draw 662 37 87 137 187
```

Order in P3: (1) build the `A-60` draw-collision guard and red-arm it, (2) build the `A-53` render-side refusal and red-arm it, (3) commit and push the slice 11 draw with 137's rule written on `A-60` before any source is opened, (4) read the five, (5) render and commit, then run a second `render-site.mjs` after the commit and `npm run check`.

### Acceptance condition

- The five constant pages (`88a`, `11b`, `15a`, `1b`, `22a`) each show slice 11's verdict, and `index.html` badges reflect them.
- `node scripts/depth-audit.mjs` reads 53 audited, and the store and `c/4a.html`'s ledger-wide sentence agree on drawn-by-position rows: 44.
- Mutating one store entry's `source` to a repository path makes rendering exit non-zero and name the entry. Restoring it gives exit 0 and a clean tree (`A-53`).
- `--draw 662 37 87 137 187` names `A-47-0015`/`A-47-0016` at 137 and nothing at 662 (`A-60`).
- `npm run served` reports SERVED for the changed pages after the push.

### Delivery and encounter checks

- Delivery: `npm run served` after the push, and a live fetch of one changed page for its verdict line.
- Encounter: blind (`A-59`). An outside report arriving through a row's "looks wrong?" link would show in `npm run reports`, which is readable at n = 1.

**USER-FACING: yes.** Paths: `continuity/depth-audit.json` (rendered into pages), `c/88a.html`, `c/11b.html`, `c/15a.html`, `c/1b.html`, `c/22a.html`, `c/4a.html` and every constant page carrying the ledger-wide sentence, `index.html`, `scripts/render-constant-pages.mjs`, `scripts/render-site.mjs` (if the refusal is wired there), `scripts/depth-audit.mjs`, `continuity/items.json`.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none.** Read: `check-due-gates-dispositioned --snapshot` ("3 gate(s) due on/before 2026-10-01": `A-47`, `A-53`, `A-60`, and all three bear on the choice).
- (b) Owed child rows in the orchestrator's ledger: **none.** Read: the kickoff's "rows owed to you" read (0 of 739).
- (c) State reads marked CROSSED: **none.** Read: the kickoff state block. The fields that print a CROSSED marker carry none: stale-actionable 0 of 19, queued rows 0, and missingLinkedCommits NOTHING SWEPT (0 of 0, not a clean read).
