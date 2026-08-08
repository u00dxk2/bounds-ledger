# The write-up of a redaction is the third copy of the thing redacted

**2026-08-08 · A-13 · found while building the show-me evidence David's reply requires**

## What happened

David's answer on card `bb4df56c` ends: *"Then show me the rewritten history and the diff of what
changed before anything goes public — the flip still needs a second yes from me after I've seen it."*

Building that evidence meant cloning the remote fresh and enumerating what a flip would publish,
rather than re-reading what we wrote. The enumeration found his personal email address still in the
repository — **four times in tracked files and once in the body of `HEAD` itself** — put there by
the documentation of the rewrite that removed it from every author field.

| where | what it is |
|---|---|
| `continuity/items.json` note20 | the rewrite record, naming the address it replaced |
| `docs/cold-starts/2026-08-08.md` ×3 | the pre-flight facts line, the `--email-callback` command, the before/after table |
| `HEAD` (`03186f8`) commit body | the same before/after line |

The 8/07 verification was not wrong about what it measured. It ran `git log --format='%ae%n%ce'`
and got one noreply address, which is true. That probe licenses the claim *no author or committer
field carries the address* — and it was read as *the address is gone*.

## This is the third time, which is the actual finding

1. **2026-08-06** — the eight-blocker list in `items.json` and `docs/cold-starts/2026-08-06.md`
   spelled out the three third-party forum handles and a personal email address verbatim, *while
   cataloguing them as things not to publish*. Recorded then as "the blocker list had become a
   disclosure."
2. **2026-08-07** — the rewrite succeeded and the very next commit re-contaminated the repo,
   because it was authored from a git config still holding the personal address. Caught only by
   cloning the remote.
3. **2026-08-08 (this one)** — the write-up of (2) put the address back into four tracked files
   and one commit body.

Each fix was applied to the location that was flagged. Each time, the *description of what was
fixed* became a fresh copy. **A redaction is not done when the flagged site is clean; it is done
when the string is absent from the repository, including from the record of the redaction.**

## Also found: a second blocker recorded as closed that is not

`items.json` note18 records blocker 4 (a portfolio-wide personal-data question belonging to other
repos) as "generalised here and in the cold-start primer." The exact specific phrase survived in
two files that sweep never touched — `CLAUDE.md` and `docs/cold-starts/2026-08-06.md`. Same shape:
the sweep covered the files named in the blocker, not the string.

## Adjudicated, not raised

- **Blocker 3** (`docs/engineering-health-review-2026-07-29.md`) is genuinely redacted, with a
  redaction note. Two concrete gaps remain in prose: no scheduled full-history sweep, and push
  protection unavailable for private repos on this tier. Neither is worth another pass — the first
  is readable straight off `.github/workflows/` in any public tree, and the second stops applying
  the moment the repo is public. Low harm, recorded rather than fixed.
- **Blocker 8** board/card IDs: opaque identifiers for an auth-gated system, per note18's read.

## What was done

Redacted in the working tree: 4 tracked-file occurrences of the address, 2 of the blocker-4 phrase.
Both answers per KP-78 — the grep returns zero hits on both redacted strings and still returns hits
on a positive control present in the same files.

**Not done, and it needs David:** the copy in `HEAD`'s commit body. Removing it rewrites a commit
already pushed. A rewrite of published history is his call in this repo — that is why 8/07's went
to him at the pane — and choosing a smaller equivalent operation to avoid asking would be the same
workaround the 8/07 session correctly refused to make.

## The check that would have caught all three

Run against a **fresh clone of the remote**, not the working tree, and enumerate rather than
confirm — ask what the repository discloses, not whether the named defect is gone:

```
git log --all --format='%ae%n%ce' | sort -u                       # author fields
grep -rIoE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' .     # tracked files
git log --all --format=%B | grep -oE '<same>'                     # commit bodies
```

Three surfaces. The 8/07 check ran the first and concluded for all three.
