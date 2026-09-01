#!/usr/bin/env node
// Close-boundary gate: the NEXT day's cold-start primer must exist before a session closes.
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

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function mtToday(now = new Date()) {
  // en-CA renders YYYY-MM-DD; the timeZone option is what makes it Mountain rather than host-local.
  return now.toLocaleDateString("en-CA", { timeZone: "America/Denver" });
}

export function nextDay(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  // Date.UTC normalises month/day overflow (Aug 32 -> Sep 1), so no month-length table is needed.
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

export function primerPath(dateStr, root = ROOT) {
  return join(root, "docs", "cold-starts", `${dateStr}.md`);
}

// ponytail: existence only, no content check. A primer that exists but is empty is a different
// defect and this gate deliberately does not claim to catch it. The content leg is NOT tracked
// here any more: A-18 held it and closed 2026-09-01, killed because skylark-site's
// gen-primer-first-action.mjs already generates the block from the fleet side.
export function missingPrimer(dateStr, root = ROOT) {
  return !existsSync(primerPath(dateStr, root));
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

async function selftest() {
  const { mkdtemp, mkdir, writeFile, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const assert = (await import("node:assert/strict")).default;

  const tmp = await mkdtemp(join(tmpdir(), "primer-gate-"));
  await mkdir(join(tmp, "docs", "cold-starts"), { recursive: true });

  // KP-78, both answers. The silent half is asserted only AFTER the file is proven to exist,
  // so a broken existsSync cannot masquerade as "condition absent" (2026-08-17: an assertion
  // that something is not present passes on an empty string from a spawn that never ran).
  assert.equal(missingPrimer("2026-08-21", tmp), true, "FIRES: absent primer must report missing");

  const p = primerPath("2026-08-21", tmp);
  await writeFile(p, "# primer\n");
  assert.equal(existsSync(p), true, "positive control: the fixture file must exist before absence is asserted");
  assert.equal(missingPrimer("2026-08-21", tmp), false, "SILENT: present primer must report present");

  // The date arithmetic is the part most likely to be quietly wrong, so it is asserted, not trusted.
  assert.equal(nextDay("2026-08-20"), "2026-08-21", "same-month rollover");
  assert.equal(nextDay("2026-08-31"), "2026-09-01", "month-end rollover");
  assert.equal(nextDay("2026-12-31"), "2027-01-01", "year-end rollover");
  assert.equal(nextDay("2028-02-28"), "2028-02-29", "leap-year rollover");
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
  console.log("check-next-primer selftest: PASS (fires on an absent primer, silent on a present one after proving the fixture exists; month-end, year-end and leap rollovers correct; 20:00 MT close reads the MT date, not the UTC one; --short guard fires on two revisions naming line and revs, silent on the documented correct form, on a legal one-revision --short, on --short=N with one revision, on prose, and on words belonging to a later command)");
}

if (process.argv.includes("--selftest")) {
  await selftest();
} else {
  const today = mtToday();
  const tomorrow = nextDay(today);
  if (missingPrimer(tomorrow)) {
    console.error(`RESULT: FAIL — no cold-start primer for tomorrow (${tomorrow} MT).`);
    console.error(`  expected: docs/cold-starts/${tomorrow}.md`);
    console.error(`  Today is ${today} MT. Write it before closing: the next session opens cold without it,`);
    console.error(`  and the miss leaves no other trace (2026-08-20 opened this way).`);
    process.exit(1);
  }
  // Content leg: the primer exists, so now check the ONE thing that has actually gone wrong
  // five times. This is deliberately not a general content check — that belongs to the fleet
  // generator (skylark-site gen-primer-first-action.mjs), not to a closed row on this ledger.
  const broken = brokenFirstAction(readFileSync(primerPath(tomorrow), "utf8"));
  if (broken.length) {
    console.error(`RESULT: FAIL — tomorrow's primer (${tomorrow} MT) carries a first action that cannot run.`);
    for (const b of broken) {
      console.error(`  line ${b.line}: ${b.text}`);
      console.error(`    \`git rev-parse --short\` takes ONE revision; this passes ${b.revs.length} (${b.revs.join(", ")}).`);
      console.error(`    It exits 128 with "fatal: Needed a single revision" — and in a leading && position`);
      console.error(`    that silently skips the whole cadence behind it. Drop --short.`);
    }
    process.exit(1);
  }
  console.log(`RESULT: PASS — tomorrow's primer exists and its first action runs (docs/cold-starts/${tomorrow}.md)`);
}
