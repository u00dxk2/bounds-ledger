# Security

This repository holds no secrets, by design and by verification:

- **No credentials live in the repo or its history.** Verified during the 2026-07-29 engineering-health
  review: no secret-shaped path exists in any commit. The only credential any code here touches is the
  CI-injected `GITHUB_TOKEN` (used by the workflow to file finding issues), which is never written to disk.
- **Zero runtime dependencies.** Node stdlib + `fetch` only; `npm install` is a no-op. There is no supply
  chain to compromise beyond Node itself and GitHub Actions' first-party actions.
- **What the code does with the network:** read-only fetches of public mathematical sources
  (raw.githubusercontent.com, arxiv.org, en.wikipedia.org, erdosproblems.com) for re-verification. Nothing
  is ever sent outward by code; outward contact is human-gated policy, not automation.

**Reporting:** open a GitHub issue on this repository. If a report is sensitive, say only that in the issue
and a maintainer will provide a private channel.
