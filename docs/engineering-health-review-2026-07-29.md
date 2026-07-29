# Engineering-health review — bounds-ledger — 2026-07-29

Reviewed against `skylark-site/docs/engineering-health-standard.md` v1.0 (34 rules). REVIEW ONLY — no fixes in this doc's commit. Repo age at review: 7 days (first commit 2026-07-22, 51 commits).

```
Counts: P0 0 · P1 6 · P2 6
```

**Top 3**

1. **R21 — CI runs 2 of the repo's 3 self-tests.** `extract-pins.mjs --selftest` is in `npm test` but has no workflow step, so the extractor that generates 218 of 227 claims can regress in CI unwatched.
2. **R5/R6/R7 — the three-layer secrets prevention stack is 0-of-3 present.** No pre-commit scan (`core.hooksPath` unset, `.git/hooks` empty), secret scanning reports disabled, no scheduled history sweep.
3. **R4/R16 — no `repo-health.json`** (repo is invisible to the monthly matrix sweep) and **no branch protection or ruleset on `main`** (force-push and branch deletion are both possible; the account plan is Pro, so this one is not plan-gated).

**Verdict — what would most alarm a skeptical staff engineer in their first 30 minutes?**

Not the code — the code is unusually careful, and the domain controls here are above the standard's bar. What would stop them is the irony in finding #1: a repo whose founding finding is *"an alarm that was never armed carries no information"* (`docs/findings/2026-07-24-drift-alarm-was-never-armed.md`) ships a CI workflow that silently omits one of its own three self-tests. Everything else on this list is generic portfolio hygiene that happens to be missing on a 7-day-old repo; that one is the lane's own thesis failing to close over itself.

---

## Ranked findings

### P1

**P1-1 · R5 — no pre-commit secret scan (prevention Layer 1 absent).**
Anchor: `git config core.hooksPath` → unset (exit 1); `.git/hooks/` contains only `*.sample`.
What fails: nothing blocks a candidate secret from being staged and committed. The standard weights this class heaviest — 3 of the 4 criticals in the 2026-07-07 portfolio review were secrets-in-git.
Mitigating (verified, not assumed): this repo has never carried secret material — `git log --all --diff-filter=A --name-only` across all 51 commits matches no `.env`/`secret`/`credential`/`*.pem`/`*.key`/`token` path, and the only credential the code touches is CI-injected (`GITHUB_TOKEN`, never written to disk). So the exposure is prospective, not live.
Smallest fix: seed `check-staged-secrets.mjs` from skylark-site and set `core.hooksPath`. Fleet-recipe candidate — identical in all 18 repos.

**P1-2 · R7 — no scheduled verified full-history sweep (Layer 3 absent); R6 Layer 2 plan-gated.**
Anchor: no TruffleHog/gitleaks workflow in `.github/workflows/` (only `reverify.yml`); `GET /repos/u00dxk2/bounds-ledger/secret-scanning/alerts` → HTTP 404 "Secret scanning is disabled on this repository."
What fails: Layer 3 answers the question layers 1–2 cannot — *which already-committed secrets are still live* — and is simply absent. It is **not** plan-gated and could be added today.
Layer 2 (R6, push protection) **is** plan-gated and is recorded honestly per R16 rather than claimed: the repo is private on a personal **Pro** account, where free secret scanning / push protection covers public repos only; enabling it on a private repo needs the paid Secret Protection add-on. Not verified by attempting to enable it (review-only scope).
Smallest fix: one scheduled workflow running TruffleHog `--only-verified` weekly. Fleet-recipe candidate.

**P1-3 · R21 — CI runs 2 of 3 self-tests; the pin extractor is unguarded in CI.**
Anchor: `.github/workflows/reverify.yml:21-24` runs `reverify.test.mjs` and `check-claims.mjs --selftest`. `package.json:8` (`npm test`) runs those **plus** `extract-pins.mjs --selftest`. There is no third step.
What fails: `extract-pins.mjs` generates 218 of the ledger's 227 claims, and its 5 extraction cases (escaped-pipe cells, HTML-commented rows, header-only tables, missing-H1 fallback) guard exactly the parsing edge cases that made last-listed-row pinning safe in the first place. A regression there is caught only if a human runs `npm test` locally. Verified the selftest exists and passes: `scripts/extract-pins.mjs:67-103`, `node scripts/extract-pins.mjs --selftest` → PASS, exit 0.
Smallest fix: add a fourth step `run: node scripts/extract-pins.mjs --selftest` after line 24. Checked the obvious hazard: `reverify.test.mjs:46,52` *counts* workflow steps but only *reports* the count (the assertion at :50 is on unguarded pipes), so adding a step does not break the guard test. No pipe in the new step, so no `shell: bash` needed.

**P1-4 · R4 — no `repo-health.json`.**
Anchor: absent from repo root (`git ls-files` top level: `.github`, `.gitignore`, `CLAUDE.md`, `continuity`, `docs`, `ledger`, `package.json`, `README.md`, `scripts`).
What fails: the monthly repo-health matrix reads the manifest, not prose. Without it this repo cannot be swept mechanically and will read as absent rather than as passing.
Smallest fix: a ~15-line manifest. Most fields are degenerate here and that is the useful signal: runtime `node22`, deploy target `none (CI-only, no service)`, datastores `none (flat JSON + file mirror)`, auth model `none`, secrets source `CI-injected github.token only`, privileged endpoints `[]`, class `service-only: false / artifact-shipping: false`, required checks `reverify`.

**P1-5 · R16 — no branch protection or ruleset on `main`.**
Anchor: `GET /repos/.../branches/main/protection` → HTTP 404 "Branch not protected"; `GET /repos/.../rulesets` → `[]`.
What fails: force-push and branch deletion on `main` are both permitted. This is **not** plan-gated (Pro covers protected branches and rulesets on private repos), so R16's honest-gap clause does not apply — it is a real, closable gap.
Honest scoping: PR-only-to-`main` would break this lane's operating model (a single agent commits directly to `main`, and `reverify.yml` runs on push). The cheap correct subset is a ruleset that blocks **force-push and deletion** only, and optionally requires the `reverify` check — both compatible with direct commits.

**P1-6 · R17/R18 — no lockfile, no frozen install, no dependency automation config.**
Anchor: no `package-lock.json` (nor yarn/pnpm/shrinkwrap); no `.github/dependabot.yml`; the workflow never runs `npm ci` or `npm install`.
What fails: by the standard's own priority mapping, "no lockfile discipline" is P1. Stated plainly, though: this repo has **zero dependencies** by design (`package.json` has no `dependencies`/`devDependencies`; `npm install` is a no-op), so today's exposure is latent, not live. What is genuinely missing is the *ratchet* — nothing mechanically notices the day a dependency first appears.
Smallest fix: commit the empty-tree `package-lock.json` (`npm install --package-lock-only`) so any future dependency shows up as a lockfile diff in review.

### P2

**P2-1 · R3 — no `SECURITY.md`.** Where secrets live (answer here: nowhere in-repo; CI-injected `github.token` only) and how a vulnerability gets reported are both unstated. Cheap, and the near-empty answer is itself worth writing down given the planned public-repo flip.

**P2-2 · R13 — actions pinned to floating tags, not SHAs.** Anchor: `reverify.yml:17` `actions/checkout@v4`, `:18` `actions/setup-node@v4`. Rule 13 scopes to *third-party* `uses:` refs and both of these are GitHub-owned first-party — the repo uses **no** third-party actions — so by the rule's literal text there is no violation. Filed as hardening-beyond-scope because Scorecard-style pinning would still remove a mutable-tag dependency. Flagging for the fleet consolidation: rule 13's scope needs an explicit first-party ruling, or every repo will file this ambiguously.

**P2-3 · R29 — rollback not documented.** No repo deploys, so the standard's deploy-rollback sense is N/A — but the analogous bad state is real and undocumented: *a `--snapshot` commit that blessed an upstream change nobody verified.* The recovery (revert the snapshot commit, re-run `extract-pins.mjs`, re-commit) is obvious to an agent that has read `CLAUDE.md` and invisible to one that hasn't. One line in README next to the snapshot discipline.

**P2-4 · R33 — no `docs/housekeeping-ledger.md`.** Fixed in Part B of this dispatch.

**P2-5 · R34 — README overstates generated-pin coverage by one file.** Anchor: `README.md:47` — "218 generated pins covering all 110 mirrored constants". Verified counts: 227 claims = 9 hand + 218 generated, and the generated pins cover **109** distinct files, not 110. The 110th is `1b.md`, deliberately skipped (`scripts/extract-pins.mjs:21,31` — `SKIP`, hand-pinned as C-1 upper / C-3 lower). **Ledger coverage is complete; only the sentence is wrong** — every mirrored constant is pinned, one of them by hand. Worth correcting precisely because 1b is the lane's founding subject (the Erdős minimum-overlap constant), so a reader chasing the discrepancy would land on the one file the generator skips. Smallest fix: "…218 generated pins across 109 files, plus `1b.md` hand-pinned as C-1/C-3."

**P2-6 · R19 — Dependabot security *updates* disabled.** Anchor: `GET /repos/.../automated-security-fixes` → `{"enabled":false,"paused":false}`. Vulnerability **alerts** are ON (`GET /vulnerability-alerts` → 204) and the alert inbox is empty (`/dependabot/alerts` → `[]`), so R19's free-CVE-signal requirement is met and there is no backlog to zero. Inert at zero dependencies; worth flipping on when the first dependency lands, not before.

---

## Positives worth keeping (fix waves must not regress these)

- **The pipefail guard is itself a test (R21, above the standard's bar).** `reverify.test.mjs:45-50` parses `reverify.yml`, strips comments, and asserts that every `run:` containing a pipe names `shell: bash`. This is a control that defends itself — the exact shape the standard asks for elsewhere. Confirmed live: `reverify.test: PASS (… 5 workflow steps, piped steps pipefail-guarded)`.
- **Explicit least-privilege `permissions:` block (R14).** `reverify.yml:9-11` — `contents: read`, `issues: write`, nothing more. Present at the workflow level, not inherited.
- **No `pull_request_target` anywhere (R15);** the only triggers are `schedule`, `workflow_dispatch`, and `push: [main]`. No fork trust boundary is crossed.
- **Cross-host credential hygiene (R9-adjacent).** `reverify.mjs:24` attaches `Bearer $GITHUB_TOKEN` to the shared header object, and `:46` deliberately rebuilds a `user-agent`-only header for `raw.githubusercontent.com` — the token reaches `api.github.com` and nothing else. Deliberate and easy to undo by accident during a refactor.
- **The token is never printed.** Only `err.message` reaches stdout/stderr (`reverify.mjs:125`), which matters more than usual here because `reverify.yml:35,39` pipe `2>&1` straight into a GitHub **issue body** — a path that becomes public the moment the repo flips.
- **Zero dependencies (R20 by construction).** No supply-chain surface, no install scripts, no transitive risk.
- **Clean history (R8).** No secret-shaped path ever added in 51 commits; `tmp/` gitignored; `.claude/` untracked.
- **The agent contract is current and true (R2).** Spot-checked every count `CLAUDE.md` asserts against live data: 110 mirror files (manifest `fileCount: 110` ✓), 218 generated pins across 109 files ✓, 9 hand claims ✓, C-7 + C-9 the two `manual: true` ✓. All four exact. Documented commands run: `npm test` → 3/3 PASS, exit 0.
- **Findings close (R25).** 6 of 9 continuity items closed inside 7 days; zero open GitHub issues; nothing within sight of the 90-day horizon. Three of the closed items (A-4, A-5, plus the 7/25 403 episode) are self-caught instrument failures, which is the behavior rule 25 is trying to buy.

## Not covered — honest scope

- **R9 built-bundle secret grep — N/A, not skipped.** There is no build step and no bundle; nothing is shipped to a client. The grep has no target.
- **R10 data-layer deny-by-default — N/A.** No Supabase, Firebase, or Mongo. State is flat JSON (`ledger/claims.json`, `continuity/*.json`) plus a file mirror; no RLS query to run, no allowlist, no rules file.
- **R11 privileged-endpoint probes — N/A.** The repo runs no service and exposes no endpoints. The manifest (P1-4) should record `privileged endpoints: []` explicitly so this reads as *verified empty* rather than *unchecked*.
- **R12 environment separation — N/A.** One environment; no dev/prod split exists.
- **R28/R30 deploy verification + Sentry — N/A.** Nothing deploys, so push≠live has no referent and there is no runtime to instrument. The lane's David-facing brief is *ported* to skylark-site by the orchestrator; that surface is skylark-site's to review, not this repo's.
- **R32 release discipline — N/A.** Not a release-class repo (no package published, no mobile/SDK artifact).
- **R6 push-protection enablement — asserted from the API's own error and the known plan tier, not tested.** I did not attempt to enable it; that is a write, and this was review-only.
- **R22/R23/R24 (independent review, money/data-integrity tests, patch-size gating) — assessed only structurally.** No money or user-data path exists in this repo. The nearest analogue is the snapshot ratchet, and it *is* independently gated (pins do not auto-follow the mirror, so a blessed change stays BROKEN until deliberately re-pinned). Whether the agent-authored math claims themselves get an independent pass is a lane-methodology question, not a repo-config one, and is out of this review's scope.
- **`ledger/teorth-optimizationproblems/` (110 files) was not read as source.** It is a machine mirror of upstream, byte-fidelity-checked by `reverify.mjs`; reviewing its content would be reviewing `teorth/optimizationproblems`, not this repo.

## Platform inventory

| Item | Value | How verified |
|---|---|---|
| Repo | `u00dxk2/bounds-ledger` | `git remote -v` |
| Visibility | **private** | `GET /repos/...` → `"private": true, "visibility": "private"` |
| Account / plan | personal user `u00dxk2`, **Pro** (not an org) | `GET /user` → `{"type":"User","plan":"pro"}` |
| Default branch | `main` | `GET /repos/...` |
| Branch protection | **none** | `GET /branches/main/protection` → 404 "Branch not protected" |
| Rulesets | **none** | `GET /rulesets` → `[]` |
| Push protection | **not enabled** (private repo on Pro → needs paid Secret Protection add-on; free tier is public-repo only) | inferred from plan + the 404 below; not tested by attempting to enable |
| Secret scanning | **disabled** | `GET /secret-scanning/alerts` → 404 "Secret scanning is disabled on this repository" |
| Dependabot alerts | **enabled**, inbox **empty** | `GET /vulnerability-alerts` → 204; `GET /dependabot/alerts` → `[]` |
| Dependabot security updates | **disabled** | `GET /automated-security-fixes` → `{"enabled":false,"paused":false}` |
| Auto-deploy on push | **no — this repo does not deploy.** No Render/Vercel service, no hosting target. Push to `main` triggers only the `reverify` workflow (CI alarm). | `.github/workflows/reverify.yml` is the only workflow; no deploy config in repo |
| CI health | last 5 runs all `success` (latest 2026-07-29T21:08Z) | `gh run list` |
| Frozen surfaces | none | — |

**Fleet-consolidation notes:** P1-1, P1-2, P1-4 and P1-6 are pure copy/config and identical across repos — they belong in Stage-0 recipes, not per-repo work. P1-5's *correct* form is repo-shaped (a direct-commit lane wants force-push/deletion blocking, not PR-only), so the recipe needs a variant. P1-3 and P2-5 are specific to this repo. P2-2 needs a fleet-level ruling on whether rule 13 covers first-party `actions/*`.
