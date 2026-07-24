# Finding — the drift alarm was never armed (pipe-masked exit codes in CI)

**Date:** 2026-07-24 · **Status:** FIXED same session · **Item:** A-2 (G-1 green-streak clock reset)
**Severity:** the lane's single instrument was green-by-construction for its first 2 days.

## What was wrong

`.github/workflows/reverify.yml` ran both live checks through a pipe:

```yaml
run: node scripts/reverify.mjs --check | tee -a finding.txt
run: node scripts/check-claims.mjs   | tee -a finding.txt
```

GitHub Actions' **default** runner shell is `bash -e {0}` — `-e` but **no `-o pipefail`**. In a pipeline, the shell reports the exit status of the *last* command, which is `tee`, which always succeeds. So `reverify.mjs` exiting 1 on drift was reported as **exit 0**:

- the step passed,
- the job passed,
- `- name: Open finding / if: failure()` never fired, so **no issue was ever auto-filed**,
- and the run went **green through drift**.

Verified, not inferred:

- Run 30084664345's own log prints `shell: /usr/bin/bash -e {0}` — the default, no pipefail.
- Locally: `bash -e -c 'node -e "process.exit(1)" | tee -a /dev/null; echo $?'` → `pipeline-exit=0`.

## Why the existing self-test did not catch it

`scripts/reverify.test.mjs` proved the **script** exits 1 on synthetic drift, and it passed every run. It never tested the **workflow wiring** that consumes that exit code. The unit was correct and the alarm was still dead — the failure lived entirely in the seam between them. This is the same class of miss the lane exists to catch, one level up: *a green check is not evidence unless you have verified what the green is measuring.*

## Fix

Name the shell on both piped steps (`shell: bash` → `bash --noprofile --norc -eo pipefail {0}`). Two lines.

## Guard

`reverify.test.mjs` now parses `reverify.yml` and asserts every step whose `run:` contains a shell pipe declares `shell: bash`. Runs network-free in CI on every run. Negative control performed: deleting one `shell: bash` makes the self-test exit 1 and name the offending step.

## Consequence for G-1

The 30-day green-CI streak claimed from 2026-07-23 does not count — those greens carried no information. **The streak clock restarts 2026-07-24** on the first run whose green is load-bearing.
