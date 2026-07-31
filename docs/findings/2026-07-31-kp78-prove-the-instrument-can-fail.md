# KP-78 audit: prove the instrument can fail (2026-07-31)

**Trigger:** orchestrator broadcast of KP-78 — *"a clean reading from a detector never shown capable of a dirty one is decoration, not evidence."* This lane ships almost nothing BUT detectors, so the rule applies to the whole surface. Every result below was produced by **executing**, never by reading the code.

## Verdict

Four detectors audited. Two were already two-sided by construction, one had a **never-demonstrated fire side** (now demonstrated), and the audit surfaced **one detector that did not exist** — the A-8 fix shipped 2026-07-30 was itself unguarded.

| # | Detector | Fires when condition present? | Silent when absent? | Status before today |
|---|---|---|---|---|
| 1 | `reverify.test.mjs` drift check | yes — asserted every run (tampered copy must exit 1 **and** name the file) | yes — asserted every run (pristine copy must exit 0) | ✅ already compliant |
| 2 | `check-claims.mjs --selftest` matcher | yes — 3 positive cases | yes — 2 explicit negative cases (`!holds(...)`) | ✅ already compliant |
| 3 | `reverify.test.mjs` pipefail guard | **never demonstrated** | asserted every run | ⚠ fixed below |
| 4 | "self-tests are actually in the workflow" | **detector did not exist** | — | ⚠ built below |

Detector 1 is the counter-example KP-78 asks for, and it is stronger than a one-time demonstration: it runs *both* sides on every single invocation, so it re-proves its own fire side continuously.

## Detector 3 — the pipefail guard's fire side

This guard protects the lane's **founding defect**: GitHub Actions' default shell is `bash -e {0}` with no `pipefail`, so `node scripts/reverify.mjs --check | tee` reports `tee`'s exit 0 and a real drift passes green. The alarm was fake for the lane's first two days.

It had never been shown to fire. Worse, the one prior attempt (2026-07-25 gate sweep) produced a **false INERT verdict** — the negative-control mutation was written with `\n` against CRLF files on disk and silently no-opped, so the guard was pronounced broken when it was fine. That is a detector whose only failure evidence was itself fabricated by a broken instrument, one level up.

Negative control, run today. Mutation applied by exact-string replacement (errors on no-match) and **proved landed with `--numstat` before believing any result**, per the CLAUDE.md gotcha:

Injected into `.github/workflows/reverify.yml` — a piped step with no `shell: bash`:

```yaml
      - name: KP-78 negative control (temporary)
        run: node -e "console.log(1)" | cat
```

**FIRE side** (`git diff --numstat` → `2  0`, mutation confirmed on disk):

```
EXIT=1
AssertionError [ERR_ASSERTION]: piped workflow step(s) missing `shell: bash` — exit codes will be masked:
 KP-78 negative control (temporary)
        run: node -e "console.log(1)" | cat
```

**SILENT side** (`git restore`, `--numstat` empty):

```
EXIT=0
reverify.test: PASS (synthetic drift in 10a.md detected; pristine copy clean; 6 workflow steps, piped steps pipefail-guarded)
```

Guard is real. Exit codes read without a pipe (`> file 2> file` then `$LASTEXITCODE`) — reading an exit code through a pipe is the local form of the same defect and has bitten this lane before.

## Detector 4 — the gap the audit surfaced

A-8 (shipped yesterday, `ebd52f2`) fixed this: `extract-pins.mjs --selftest` ran in `npm test` but **not** in the workflow, leaving the extractor that generates 218 of the ledger's 227 claims unguarded in CI for six days. That is the lane's founding defect — an alarm that isn't armed carries no information — turned on itself.

The fix was a hand-added YAML step **with nothing asserting it stays**. Deleting it would be completely silent, and the failure would look exactly like the six days it just cost us. KP-78 assertion 3 has no answer here because there was no test to revert.

Built the missing detector (`scripts/reverify.test.mjs`, +11 lines). It derives the expected set from `package.json` rather than hardcoding a list, so a *newly added* self-test cannot be CI-less either:

```js
const pkg = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
const testCmds = pkg.scripts.test.split("&&").map((c) => c.trim()).filter(Boolean);
const uncied = testCmds.filter((c) => !wf.includes(c));
assert.equal(uncied.length, 0, `self-test(s) run by \`npm test\` but absent from the workflow — unguarded in CI:\n${uncied.join("\n")}`);
```

`wf` already has YAML comments stripped, so a *commented-out* step correctly counts as absent.

Demonstrated both ways at write time, which is the whole point of KP-78:

**SILENT side** (clean tree):

```
EXIT=0
reverify.test: PASS (... piped steps pipefail-guarded; 3 self-tests present in CI)
```

**FIRE side** — deleted the exact A-8 step it exists to protect (`--numstat` → `0  2`, deletion confirmed):

```
EXIT=1
AssertionError [ERR_ASSERTION]: self-test(s) run by `npm test` but absent from the workflow — unguarded in CI:
node scripts/extract-pins.mjs --selftest
```

It names the missing command, so the alarm is actionable rather than merely red.

Workflow restored; `git diff --numstat` shows `scripts/reverify.test.mjs` as the only changed file. Full suite green.

## What generalizes

- **The audit's most valuable output was not a fixed detector but a missing one.** Asking "can this fire?" of each existing instrument is cheap; asking it of *yesterday's fix* is what found that the fix was load-bearing and unprotected. Run KP-78 against recent commits, not just against the test directory.
- **A botched negative control is worse than none** — it produces a *false* clean reading about the detector itself. The 7/25 CRLF no-op is the anchor. Proving the mutation landed (`--numstat`) costs one command and is now non-optional here.
- **Corollary confirmed from the other direction:** verify at the sink, never at the caller. This lane's founding defect *is* that rule violated — we read the alarm's exit code through `tee` (the caller) instead of checking whether an issue was actually filed (the sink).
