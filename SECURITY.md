# Security

This repository holds no secrets, by design and by verification:

- **No credentials live in the repo or its history.** Verified during the 2026-07-29 engineering-health
  review: no secret-shaped path exists in any commit. The only credential any code here touches is the
  CI-injected `GITHUB_TOKEN` (used by the workflow to file finding issues), which is never written to disk.
- **Zero runtime dependencies.** Node stdlib + `fetch` only; `npm install` is a no-op. The remaining
  supply chain is Node itself and two first-party GitHub Actions (`actions/checkout`,
  `actions/setup-node`), which are pinned by **release tag, not commit SHA** — a tag is mutable, so a
  repointed tag would execute in a job holding `issues: write` on this repository. The job holds no
  other credential and can reach nothing else.
- **What the code does with the network:** read-only fetches of public mathematical sources
  (raw.githubusercontent.com, arxiv.org, en.wikipedia.org, erdosproblems.com) for re-verification. Nothing
  is ever sent outward by code; outward contact is human-gated policy, not automation.

**Reporting:** open a GitHub issue on this repository. If a report is sensitive, say only that in the issue
and a maintainer will provide a private channel.
