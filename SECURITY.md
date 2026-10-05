# Security

This repository holds no secrets, by design and by verification:

- **No credentials live in the repo or its history.** History does contain a few secret-SHAPED strings
  that are not credentials: a fake token planted to prove the secret scanner fires, and the example key
  from a cloud provider's public documentation, quoted in one commit message about a dismissed
  scanner alert. Each is dispositioned in writing in
  `continuity/history-sweep-dispositions.json`, and a scheduled sweep of every reachable commit
  (`.github/workflows/history-sweep.yml`) checks every diff line of every reachable commit against
  structural credential patterns (known key prefixes and assignment shapes) and fails on a match that is
  not dispositioned. Structural patterns are a floor, not a proof. The only credential any workflow uses
  is the CI-injected `GITHUB_TOKEN` (used to file issues), and every checkout step is configured with
  `persist-credentials: false`.
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
