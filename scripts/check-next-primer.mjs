#!/usr/bin/env node
// Close-boundary gate: the cold-start primer for the NEXT session must exist before a session closes.
//
// WHICH FILE (A-94, 2026-11-10). Since 2026-09-30 the fleet names a primer by the MT date it is
// WRITTEN, and the next session reads the newest one; tonight's close writes docs/cold-starts/<today>.md.
// Until 2026-11-10 this gate still demanded a file named for TOMORROW, so it exited 1 at every close
// from 2026-09-30 on (or a close wrote a file under the wrong name to satisfy it). It now owes the
// written-date file, chosen by the same rule as skylark-site's scripts/lib/primer-written-date.mjs
// choosePrimerTarget: a primer dated LATER than today (an old-convention tomorrow-named file, the
// switch-day hazard that rule names) is the one the next session reads, newest first; otherwise
// today's. Reimplemented, not imported: this repo is public, this script's selftest runs in CI, and
// the sibling checkout does not exist there. Yesterday's primer never satisfies it: the next session
// would open on a file that says nothing about today.
//
// Why this exists: 2026-08-20 opened with no `docs/cold-starts/2026-08-20.md` — 8/19's close
// never wrote it — so the session began by reconstructing state from the kickoff and the
// ledger. Nothing anywhere recorded the miss, which is why the question "is cold-start cost a
// recurring tax or a one-off?" was unanswerable: the misses left no trace.
//
// Why it is NOT in `npm run check` or CI, which is the obvious placement and the wrong one:
// tomorrow's primer legitimately does not exist for most of the day. A cadence or CI gate would
// be red from midnight until close-session ran — a permanently-red alarm, which carries exactly
// as much information as a permanently-green one and is this lane's founding defect. The
// condition is only actionable at the close boundary, so the gate lives there.
// Its SELF-TEST is deterministic and network-free, so that part does run in `npm test` + CI.
//
// MT, not UTC: the host clock is UTC and runs 6-7h ahead of Mountain, so an evening close (the
// normal case) computes tomorrow one day late off a UTC clock — the exact off-by-one this
// repo's date discipline exists to prevent. Calendar arithmetic is done on the MT date string
// via Date.UTC, so it is immune to DST rather than merely usually right.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mtToday } from "./lib/mt-date.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export { mtToday };

export function primerPath(dateStr, root = ROOT) {
  return join(root, "docs", "cold-starts", `${dateStr}.md`);
}

const DATED = /^(\d{4}-\d{2}-\d{2})\.md$/;

// The primer the close owes, as a date, or null when none exists. A later-dated file wins (newest
// first), then today's; nothing earlier counts. Pure: the caller lists the directory.
export function writtenPrimer(names, today) {
  const dates = (names ?? []).map((n) => DATED.exec(String(n))?.[1]).filter(Boolean);
  const later = dates.filter((d) => d > today).sort().reverse();
  if (later.length) return later[0];
  return dates.includes(today) ? today : null;
}

// ponytail: existence only, no content check beyond the --short trap below. A primer that exists but
// is empty is a different defect and this gate deliberately does not claim to catch it. The content
// leg is NOT tracked here any more: A-18 held it and closed 2026-09-01, killed because skylark-site's
// gen-primer-first-action.mjs already generates the block from the fleet side.
export function owedPrimer(today, root = ROOT) {
  const dir = join(root, "docs", "cold-starts");
  return writtenPrimer(existsSync(dir) ? readdirSync(dir) : [], today);
}

// The `--short` trap, mechanised after FIVE sessions hit it — including the one that wrote the
// warning into this repo, hours after writing it, and after CLAUDE.md had carried the same
// warning since 2026-08-18. Prose has now failed five times; that is not a documentation
// problem.
//
// The failure: `git rev-parse --short HEAD origin/main` takes a SINGLE revision and dies
// `fatal: Needed a single revision`, exit 128. Harmless alone — it fails loudly. The hazard is
// that the primer's first action puts it in a LEADING `&&` position, where failing loudly then
// silently skips the entire cadence behind it. `--short=7` fails identically.
//
// Narrow on purpose: only `rev-parse` lines that carry `--short` AND pass two or more
// revisions. A one-revision `--short` is legal and common, and flagging it would make this
// gate noisy enough to ignore — which is the failure mode this repo is named after.
// FENCED CODE ONLY, and this is not a refinement — it is the whole difference between a working
// gate and a permanently-red one. The first version scanned every line and fired on the primer's
// own WARNING SENTENCE ("Still `git rev-parse HEAD origin/main`, **not** `--short` …"), so every
// primer that documents the trap would have failed the gate that exists to catch it. Seventh
// instance in this repo of a fix note becoming a fresh instance of its own defect; caught only
// because the guard was run against the real primer rather than against fixtures it invented.
// A command only runs from inside a fence, so prose about the trap is out of scope by construction.
export function brokenFirstAction(text) {
  const findings = [];
  const lines = String(text ?? "").split(/\r?\n/);
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
    if (!inFence) continue;
    if (!/\bgit\s+rev-parse\b/.test(line)) continue;
    // Take only the shell segment that actually holds rev-parse: everything after a && or ;
    // belongs to a different command, and counting its words as revisions would fire on the
    // documented CORRECT form too.
    const seg = line
      .split(/\s(?:&&|\|\||;)\s/)
      .find((s) => /\bgit\s+rev-parse\b/.test(s));
    if (!seg) continue;
    if (!/--short(=\d+)?\b/.test(seg)) continue;
    const after = seg.slice(seg.search(/\bgit\s+rev-parse\b/)).replace(/\bgit\s+rev-parse\b/, "");
    const revs = after
      .split(/\s+/)
      .filter(Boolean)
      .filter((a) => !a.startsWith("-"))       // flags are not revisions
      .filter((a) => !/^[<>|]/.test(a));        // nor are redirections
    if (revs.length >= 2) findings.push({ line: i + 1, text: line.trim(), revs });
  }
  return findings;
}

// The whole gate as a function, so the selftest (and CI) exercise the command's own exit code and
// the file its content leg reads, not only the helper (Codex review of adad52d, finding 2).
export function runGate(today, root = ROOT) {
  const owed = owedPrimer(today, root);
  if (!owed) {
    return { code: 1, out: [], err: [
      `RESULT: FAIL — no cold-start primer written today (${today} MT).`,
      `  expected: docs/cold-starts/${today}.md (primers are named for the MT day they are written)`,
      `  Write it before closing: the next session opens cold without it,`,
      `  and the miss leaves no other trace (2026-08-20 opened this way).`,
    ] };
  }
  // Content leg: the primer exists, so now check the ONE thing that has actually gone wrong
  // five times. This is deliberately not a general content check — that belongs to the fleet
  // generator (skylark-site gen-primer-first-action.mjs), not to a closed row on this ledger.
  const broken = brokenFirstAction(readFileSync(primerPath(owed, root), "utf8"));
  if (broken.length) {
    const err = [`RESULT: FAIL — the next session's primer (docs/cold-starts/${owed}.md) carries a first action that cannot run.`];
    for (const b of broken) {
      err.push(`  line ${b.line}: ${b.text}`,
        `    \`git rev-parse --short\` takes ONE revision; this passes ${b.revs.length} (${b.revs.join(", ")}).`,
        `    It exits 128 with "fatal: Needed a single revision" — and in a leading && position`,
        `    that silently skips the whole cadence behind it. Drop --short.`);
    }
    return { code: 1, out: [], err };
  }
  return { code: 0, out: [`RESULT: PASS — the next session's primer exists and its first action runs (docs/cold-starts/${owed}.md)`], err: [] };
}

async function selftest() {
  const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const assert = (await import("node:assert/strict")).default;

  const tmp = await mkdtemp(join(tmpdir(), "primer-gate-"));
  await mkdir(join(tmp, "docs", "cold-starts"), { recursive: true });

  // KP-78, both answers, on the real directory listing. The silent half is asserted only AFTER the
  // file is proven to exist, so a broken listing cannot masquerade as "condition absent" (2026-08-17:
  // an assertion that something is not present passes on an empty string from a spawn that never ran).
  // A-94 (2026-11-10): the owed file is the one named for the day it is WRITTEN.
  await writeFile(primerPath("2026-08-20", tmp), "# yesterday's primer\n");
  assert.equal(owedPrimer("2026-08-21", tmp), null, "FIRES: only yesterday's primer exists, so tonight's is missing");

  const p = primerPath("2026-08-21", tmp);
  await writeFile(p, "# primer\n");
  assert.equal(existsSync(p), true, "positive control: the fixture file must exist before absence is asserted");
  assert.equal(owedPrimer("2026-08-21", tmp), "2026-08-21", "SILENT: a primer named for the day written satisfies the close");

  // The switch-day hazard: a later-dated (old-convention tomorrow-named) file is the one the next
  // session reads, so it is the one owed, and the newest of several wins.
  await writeFile(primerPath("2026-08-22", tmp), "# tomorrow-named primer\n");
  assert.equal(owedPrimer("2026-08-21", tmp), "2026-08-22", "a later-dated primer is the one the next session reads");
  assert.equal(writtenPrimer(["2026-08-22.md", "2026-08-25.md", "2026-08-23.md"], "2026-08-21"), "2026-08-25", "newest later-dated file wins");
  assert.equal(writtenPrimer(["README.md", "2026-08-21-notes.md", "2026-8-21.md"], "2026-08-21"), null, "only YYYY-MM-DD.md names count");
  assert.equal(owedPrimer("2026-08-21", join(tmp, "nowhere")), null, "a missing cold-starts directory reads as no primer, never a crash");

  // The command itself, through runGate (Codex review of adad52d, F2): its exit code on each answer,
  // and that the --short leg reads the file the gate OWES, which here is the later-dated one.
  const gate = await mkdtemp(join(tmpdir(), "primer-gate-cli-"));
  await mkdir(join(gate, "docs", "cold-starts"), { recursive: true });
  await writeFile(primerPath("2026-08-20", gate), "# yesterday\n");
  const stale = runGate("2026-08-21", gate);
  assert.equal(stale.code, 1, "FIRES: the command exits 1 when only yesterday's primer exists");
  assert.match(stale.err[0], /no cold-start primer written today \(2026-08-21 MT\)/, "and says which day it wanted");
  await writeFile(primerPath("2026-08-21", gate), "# today\n\n```bash\ngit rev-parse HEAD origin/main\n```\n");
  const ok = runGate("2026-08-21", gate);
  assert.equal(ok.code, 0, "SILENT: the command exits 0 once today's primer exists with a runnable first action");
  assert.match(ok.out[0], /docs\/cold-starts\/2026-08-21\.md/, "and names the file it accepted");
  await writeFile(primerPath("2026-08-22", gate), "# later-dated\n\n```bash\ngit rev-parse --short HEAD origin/main\n```\n");
  const later = runGate("2026-08-21", gate);
  assert.equal(later.code, 1, "the --short leg must read the later-dated primer the gate owes, not today's clean one");
  assert.match(later.err[0], /2026-08-22\.md/, "and name that file");
  await rm(gate, { recursive: true, force: true });
  // A UTC-clock close at 20:00 MT is 02:00 UTC the NEXT day; MT must still read the MT date.
  assert.equal(mtToday(new Date("2026-08-21T02:00:00Z")), "2026-08-20", "evening MT close must not roll to the UTC date");

  // --- the --short trap, both answers ---
  // Fixtures are the two forms VERBATIM as this repo writes them, not retyped approximations:
  // the correct line is the one in every recent primer's first-action fence, and the broken one
  // differs from it by exactly the four characters that have now cost five sessions.
  const GOOD = 'git rev-parse HEAD origin/main && npm run verify > tmp/verify-out.txt 2>&1; echo "EXIT=$?"';
  const BAD = 'git rev-parse --short HEAD origin/main && npm run verify > tmp/verify-out.txt 2>&1; echo "EXIT=$?"';

  // FIRES, and on the right line, with the offending revisions named.
  const fired = brokenFirstAction(`# primer\n\n\`\`\`bash\n${BAD}\n\`\`\`\n`);
  assert.equal(fired.length, 1, "FIRES: --short with two revisions must be caught exactly once");
  assert.equal(fired[0].line, 4, "the finding must name the line the command is on");
  assert.deepEqual(fired[0].revs, ["HEAD", "origin/main"], "it must name the two revisions that break it");

  // SILENT on the documented correct form — asserted only AFTER the guard is proven able to
  // fire above, so a guard that never runs cannot masquerade as "condition absent".
  assert.deepEqual(brokenFirstAction(`# primer\n\n\`\`\`bash\n${GOOD}\n\`\`\`\n`), [],
    "SILENT: the documented correct form must not fire");

  // Everything below is inside a fence, because only fenced lines are in scope.
  const fenced = (cmd) => `# primer\n\n\`\`\`bash\n${cmd}\n\`\`\`\n`;

  // SILENT on the legal one-revision --short. Flagging this would make the gate noisy enough
  // to ignore, which is the failure mode this repo is named after.
  assert.deepEqual(brokenFirstAction(fenced("git rev-parse --short HEAD")), [], "one-revision --short is legal");
  assert.deepEqual(brokenFirstAction(fenced("git rev-parse --short=7 HEAD")), [], "one-revision --short=N is legal");
  // FIRES on the =N variant with two revisions, which fails identically.
  assert.equal(brokenFirstAction(fenced("git rev-parse --short=7 HEAD origin/main")).length, 1, "--short=N with two revisions must fire");
  // SILENT on unrelated prose and on a rev-parse with no --short at all.
  assert.deepEqual(brokenFirstAction(fenced("nothing to see here")), [], "prose must not fire");
  assert.deepEqual(brokenFirstAction(fenced("git rev-parse HEAD origin/main")), [], "two revisions without --short are correct");
  // The regression this guard's own segment-splitting exists to prevent: words belonging to a
  // LATER command in the same line must never be counted as revisions.
  assert.deepEqual(brokenFirstAction(fenced("git rev-parse --short HEAD && npm run verify")), [],
    "words after && belong to another command and are not revisions");

  // THE REGRESSION PIN, and the reason this guard is fenced-only. This is the verbatim warning
  // sentence carried by every recent primer. The first version of this guard fired on it, which
  // would have made the gate permanently red on exactly the primers that document the trap.
  const PROSE = "Still `git rev-parse HEAD origin/main`, **not** `--short`: it takes a single revision and dies";
  assert.deepEqual(brokenFirstAction(`# primer\n\n${PROSE}\n`), [],
    "the primer's own warning sentence is PROSE and must never fire");
  // ...and the same words INSIDE a fence still must not fire, because they carry one revision
  // per command, so the fence rule is not doing the work alone.
  assert.deepEqual(brokenFirstAction(fenced("git rev-parse --short HEAD")), [], "fence rule is not masking the arity rule");

  await rm(tmp, { recursive: true, force: true });
  console.log("check-next-primer selftest: PASS (fires when only yesterday's primer exists, silent once one is named for the day written after proving the fixture exists; a later-dated primer is the one owed, newest first; only YYYY-MM-DD.md names count; a missing directory reads as no primer; 20:00 MT close reads the MT date, not the UTC one; --short guard fires on two revisions naming line and revs, silent on the documented correct form, on a legal one-revision --short, on --short=N with one revision, on prose, and on words belonging to a later command)");
}

if (process.argv.includes("--selftest")) {
  await selftest();
} else {
  const r = runGate(mtToday());
  for (const l of r.err) console.error(l);
  for (const l of r.out) console.log(l);
  process.exit(r.code);
}
