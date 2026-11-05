# docs/archive — retired docs, kept for provenance

No operational script targets these files by path and no agent loads them (the repository-wide public-tree checks still scan them, like every tracked file). Each line names what the file was and why it left `docs/`.

- `claude-md-keeplist.txt` — the strings a CLAUDE.md compression had to keep: the `--keep` input to skylark-site's `compress-to-budget.mjs` for the 2026-08-24 compression. Archived 2026-11-04: no script reads it by path, and six of its 32 strings no longer appear in CLAUDE.md or AGENTS.md (measured by review, 2026-11-04), so the documented command would refuse before trimming. Its own usage line still names its old path, `docs/claude-md-keeplist.txt`. Rebuild it from the current files before any future compression.
