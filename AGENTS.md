# AGENTS.md — bounds-ledger

Cross-vendor invariants for ANY coding agent (Claude Code, Codex CLI, or other) working in this repo. Canonical: portable facts live HERE; Claude-specific behavior lives in `CLAUDE.md` (which imports this file). Fleet convention adopted 2026-08-02.

## What this is

A reproducible, continuously re-verified ledger of drifting mathematical records (bounds / constants / certificates) that alarms when a cited record moves. Node stdlib + `fetch` only; `npm install` is a no-op. **Nothing deploys** — doc/script-only; the only automation is the GitHub Actions drift job. The repo is PUBLIC (since 2026-08-08).

## Commands

- `npm test` — network-free self-tests, all wired into CI (`reverify.test.mjs` fails if you add another without a workflow step, and prints the live count so this line cannot go stale)
- `npm run check` — LIVE checks: mirror diff + cross-surface claim re-verification
- `npm run traffic` — sample GitHub traffic into `continuity/traffic.json` (W-6; the API keeps only 14 days, so skipping this for a fortnight loses those days permanently). Needs `gh` auth; never runs in CI.
- `npm run catches` — Tier-1 indicator: verified catches on named records, per week (derived from git history, so it cannot go stale). Renders a figure and no verdict; never fails a build, never runs in CI. A month of zeros is the signal to adopt a SECOND surface — but **the zeros do not fire that alone** (amended 2026-08-14): read `docs/findings/` over the same window first, and dry means no movements AND no findings. This counts drift DETECTION only; G-1's single acknowledgement came from manual error detection the indicator is built not to see. Adopting a second surface stays a surfaced decision for David, never self-approved on a firing rule.
- `npm run resnap` — the WHOLE post-snapshot ratchet in order: `--snapshot`, then `extract-pins.mjs`, then `render-state-block.mjs`. Prefer this over running the three by hand; on 2026-08-14 a cycle that did the first two looked finished and `npm run check` still exited 1 on the state block. Content-idempotent when already in sync (only the manifest's `fetchedAt` moves — don't commit that alone).
- `node scripts/reverify.mjs --check | --snapshot` — diff mirror vs upstream / refresh it
- `node scripts/extract-pins.mjs` — regenerate generated pins (run after EVERY `--snapshot`)
- `node scripts/check-claims.mjs` · `check-brief.mjs` (needs `CC_PROMPTS_PIN`) · `history-sweep.mjs`

## Hard invariants

- **Never commit secrets** — this repo is PUBLIC. Credentials come from user-scope env at run time, never from repo files or CI secrets.
- **In a fresh clone, arm the pre-commit scan first: `git config core.hooksPath .githooks`.** `hooksPath` is per-clone config, so the committed hook is the recipe and not the guarantee. It runs `history-sweep.mjs --staged` and refuses a commit whose staged diff carries secret-shaped content.
- **`main` is protected by a repository ruleset** (`main-history-integrity`, no bypass actors): deletion and non-fast-forward pushes are blocked for everyone including the owner. A rejected force-push is the control working, not a broken remote. A deliberate history rewrite requires disabling the ruleset first — that friction is the point.
- **Don't hand-edit** `ledger/teorth-optimizationproblems/**` (machine mirror; refresh only via `--snapshot`) or the `generated: true` pins in `ledger/claims.json` (rewritten wholesale by `extract-pins.mjs`). Only hand claims C-1…C-11 are hand-edited.
- **A red drift run is the alarm, not a bug.** Verify against primary sources first, then `--snapshot` + `extract-pins.mjs` + commit deliberately. Never snapshot to silence the alarm. Editorial drift is real drift.
- **A `manual: true` claim reports UNVERIFIED, never green.** A local pass does not license automating it — the upstream 403 is IP-dependent, so only a green CI run is evidence about CI.
- **Never read an exit code through a pipe**, in CI (`shell: bash` required — the runner default has no `pipefail`) or locally: the pipe's exit 0 wins and a real failure passes green.
- **Ship no detector without demonstrating both answers** — fires when the condition is present, silent when absent. Prove the test mutation landed (`git diff --numstat`) first; files are CRLF, so a `\n` pattern silently no-ops.
- **Outward gate:** no upstream contact (PR, correction, email) and no public flip without an adversarial refute-it review AND David's explicit approval.
- **Scope discipline for delegated work:** change only the files named in the task; if blocked, STOP and report rather than working around a check.
- **Commits carry the exact model identity:** `Co-Authored-By: <exact model name> <noreply@anthropic.com>` — never a generic "AI".
- Definition of done: `npm test` passes, `npm run check` is green (or the drift is deliberately resolved and committed), docs/continuity updated, pushed.
