#!/usr/bin/env node
// Self-check for reverify.mjs drift detection — no network. Copies the ledger snapshot,
// verifies a pristine copy reads clean (exit 0) and a tampered digit is flagged (exit 1).

import { cp, readFile, writeFile, rm, readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import assert from "node:assert";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER = join(ROOT, "ledger", "teorth-optimizationproblems");
const SNAP = join(LEDGER, "constants");
const TMP = join(ROOT, "tmp", "reverify-test-live");
const SCRIPT = join(ROOT, "scripts", "reverify.mjs");

function runCheck() {
  try {
    return { code: 0, out: execFileSync("node", [SCRIPT, "--check", "--live-dir", TMP], { encoding: "utf8" }) };
  } catch (err) {
    return { code: err.status, out: (err.stdout ?? "") + (err.stderr ?? "") };
  }
}

// The live side is a mirror-shaped copy: constants/ plus the mirrored root files.
// manifest.json is deliberately NOT copied — it is ours, not upstream's.
const freshLive = async () => {
  await rm(TMP, { recursive: true, force: true });
  await cp(LEDGER, TMP, { recursive: true });
  await rm(join(TMP, "manifest.json"), { force: true });
};

await freshLive();

const clean = runCheck();
assert.equal(clean.code, 0, `pristine copy should be clean, got exit ${clean.code}:\n${clean.out}`);

const victim = (await readdir(SNAP)).find((n) => n.endsWith(".md"));
const orig = await readFile(join(TMP, "constants", victim), "utf8");
const tampered = orig.replace(/([0-9])([^0-9]*)$/s, (m, d, rest) => `${(Number(d) + 1) % 10}${rest}`);
assert.notEqual(tampered, orig, "tamper produced no change — no digit found?");
await writeFile(join(TMP, "constants", victim), tampered);

const dirty = runCheck();
assert.equal(dirty.code, 1, `tampered copy should exit 1, got ${dirty.code}`);
assert.ok(dirty.out.includes(`CHANGED constants/${victim}`), `report should name constants/${victim}:\n${dirty.out}`);
// SILENT half for W-5: a constants edit must NOT drag the README into the report.
// Without this, a mirror that reported every file on every run would pass the FIRES
// assertion below while carrying no information about which surface actually moved.
// Match VERDICT lines only — the report header names the whole watched surface,
// README included, and asserting on the raw text failed on that header the first
// time it ran. The alarm was right; the assertion was reading the wrong line.
const verdicts = (out) => out.split("\n").filter((l) => /^(CHANGED|ADDED|REMOVED) /.test(l));
assert.deepEqual(verdicts(dirty.out), [`CHANGED constants/${victim}`], `a constants-only edit should name exactly that one file:\n${dirty.out}`);

// ---- W-5: the README leg, proven BOTH ways ----------------------------------
// Upstream's README is where it declares which rows it will STAND BEHIND. On
// 2026-08-02 a demotion to asterisked-unverified left every bounds table
// byte-identical and our alarm said nothing. FIRES: reproduce that edit shape.
await freshLive();
const readmePath = join(TMP, "README.md");
const readme = await readFile(readmePath, "utf8");
// Upstream's asterisk convention is a bare `*` appended to the bound value inside
// the row (e.g. `1.2802 (1.292*)`), so the fixture appends one to the last cell of
// a real table row — the same shape as marking a record unverified.
const anchor = readme.split("\n").find((l) => /^\| \[\w+\]\(http/.test(l));
assert.ok(anchor, "no constants-table row found in upstream README — the asterisk fixture needs rewriting");
const asterisked = anchor.replace(/\s*\|\s*$/, "* |");
assert.notEqual(asterisked, anchor, "asterisk fixture produced no change");
await writeFile(readmePath, readme.replace(anchor, asterisked));

const readmeDirty = runCheck();
assert.equal(readmeDirty.code, 1, `an asterisked README row should exit 1, got ${readmeDirty.code}`);
assert.deepEqual(verdicts(readmeDirty.out), ["CHANGED README.md"], `a README-only edit should name exactly README.md:\n${readmeDirty.out}`);
assert.ok(readmeDirty.out.includes(`+ ${asterisked}`), `report should show the asterisked row verbatim:\n${readmeDirty.out}`);

// SILENT: restore it and the same run goes quiet. A detector that cannot go quiet
// is indistinguishable from one that is stuck on.
await writeFile(readmePath, readme);
const readmeClean = runCheck();
assert.equal(readmeClean.code, 0, `restored README should be clean, got exit ${readmeClean.code}:\n${readmeClean.out}`);

// REMOVED: a mirrored root file that vanishes is drift, not a silent pass.
await rm(readmePath, { force: true });
const readmeGone = runCheck();
assert.equal(readmeGone.code, 1, `a missing README should exit 1, got ${readmeGone.code}`);
assert.ok(readmeGone.out.includes("REMOVED README.md"), `report should name the removal:\n${readmeGone.out}`);

await rm(TMP, { recursive: true, force: true });

// The script exiting 1 is worthless if the WORKFLOW swallows it. Default runner shell is
// `bash -e {0}` (no pipefail), so a piped step reports the pipe's last command — a drift
// exits green. Every piped `run:` must name `shell: bash` (which adds -o pipefail).
const wfText = await readFile(join(ROOT, ".github", "workflows", "reverify.yml"), "utf8");
// Comment-stripped, for the pipefail/CI-coverage scans below. The alarm-title guard further down
// needs the ORIGINAL lines instead: it extracts a step body by indentation, and blanking comment
// lines in place would hand it a body full of holes.
const wfRaw = wfText.replace(/\r\n/g, "\n").split("\n");
const wf = wfText.replace(/^[ \t]*#.*$/gm, "");
const steps = wf.split(/^      - name:/m).slice(1);
// strip the YAML block-scalar indicator (`run: |`) first — it is not a shell pipe
const runBody = (s) => (s.match(/^\s*run:[\s\S]*/m)?.[0] ?? "").replace(/^\s*run:[ \t]*\|-?[ \t]*$/m, "");
const unguarded = steps.filter((s) => runBody(s).includes("|") && !/^\s*shell:[ \t]*bash[ \t]*$/m.test(s));
assert.equal(unguarded.length, 0, `piped workflow step(s) missing \`shell: bash\` — exit codes will be masked:\n${unguarded.join("\n---\n")}`);

// A self-test that `npm test` runs but the WORKFLOW never executes is the lane's founding
// defect turned on itself (an alarm that isn't armed carries no information) — it left the
// pin extractor unguarded in CI for six days (A-8). The A-8 fix was a hand-added step with
// nothing asserting it stays, so deleting it would be silent. Derived from package.json so
// a newly-added self-test cannot be CI-less either. KP-78: prove the instrument can fail.
const pkg = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
const testCmds = pkg.scripts.test.split("&&").map((c) => c.trim()).filter(Boolean);
const uncied = testCmds.filter((c) => !wf.includes(c));
assert.equal(uncied.length, 0, `self-test(s) run by \`npm test\` but absent from the workflow — unguarded in CI:\n${uncied.join("\n")}`);

// b1 must STAY. A branch with no path to a runner is how `guard-catch-count` sat unvalidated for a
// day, and A-8's lesson is that a hand-added workflow line with nothing asserting it stays can be
// deleted silently. Asserted on the comment-stripped text so a commented-out trigger cannot pass.
assert.match(wf, /^\s*pull_request:\s*$/m, "reverify.yml no longer triggers on `pull_request` — a feature branch gets NO runner verdict, which is the hold-with-no-release-command defect (b1, 2026-08-17)");

// The alarm's TITLE is the only part of it most readers ever see, so a title that asserts the
// wrong KIND of event is a defect in the alarm itself. A drift is a record MOVING: the mirrored
// surface changed, or a claim's cited surface no longer carries its pinned string (BROKEN).
// UNREACHABLE is not that — it means we never read the source. Lumping the two titled a pure
// HTTP 429 rate-limit flake `Drift: claims C-1,pin:12a:U …` on 2026-08-17 (issue #15) while a
// local run four minutes earlier read 231 hold / 0 broken. That is A-5's defect surviving in a
// branch A-5's fix could not reach, and A-5 was itself caught in production rather than by a
// test — so this asserts it instead of trusting the prose. The step body is EXTRACTED from the
// deployed YAML, never retyped: a copy here would test my transcription, not the alarm (A-4).
let alarmVerdict;
// A-19 N-2: set when the alarm-title guard could not run at all. It must not be possible to
// reach a PASS line with this true — see the exit-2 branch at the bottom of this file.
let alarmCouldNotRun = false;
{
  const nameIdx = wfRaw.findIndex((l) => l.trim() === "- name: Open finding");
  assert.notEqual(nameIdx, -1, "the `Open finding` step is GONE from the workflow — this guard asserts its title logic");
  const runIdx = wfRaw.findIndex((l, i) => i > nameIdx && l.trim() === "run: |");
  assert.notEqual(runIdx, -1, "the `Open finding` step no longer uses a `run: |` block");
  const body = [];
  for (let i = runIdx + 1; i < wfRaw.length; i++) {
    const l = wfRaw[i];
    if (l.trim() === "") { body.push(""); continue; }
    if (!l.startsWith("          ")) break;
    body.push(l.slice(10));
  }
  const raw = body.join("\n");
  assert.match(raw, /if \[ -s finding\.txt \]/, "extracted Open-finding body does not look like the title logic");
  // Strip ONLY the side effect; the title logic runs untouched.
  const harness = raw.replace(/gh issue create \\[\s\S]*?--repo "\$GITHUB_REPOSITORY"/, 'echo "TITLE => $title"');
  assert.notEqual(harness, raw, "could not strip `gh issue create` — refusing to run the step body with its side effect live");

  // The step is bash, so the guard needs bash. On the runner it is `bash` on PATH; on this
  // Windows machine it is NOT on the PowerShell PATH but Git ships it, and Git's own location
  // gives it away. If neither resolves, say SKIPPED out loud and name what went unchecked —
  // a guard that quietly passes when it could not run is this lane's founding defect, and the
  // repo already refuses that in three other places (UNVERIFIED, UNVERIFIABLE, UNKNOWN).
  const resolveBash = () => {
    const tryRun = (bin) => {
      try { execFileSync(bin, ["-c", "exit 0"], { stdio: "ignore" }); return bin; } catch { return null; }
    };
    if (tryRun("bash")) return "bash";
    try {
      const gitDir = dirname(dirname(execFileSync("git", ["--exec-path"], { encoding: "utf8" }).trim()));
      for (const rel of [join(gitDir, "bin", "bash.exe"), join(gitDir, "..", "bin", "bash.exe")]) {
        if (tryRun(rel)) return rel;
      }
    } catch {}
    return null;
  };
  const BASH = resolveBash();

  const ALARM_TMP = join(ROOT, "tmp", "reverify-test-alarm");
  await rm(ALARM_TMP, { recursive: true, force: true });
  await mkdir(ALARM_TMP, { recursive: true });
  await writeFile(join(ALARM_TMP, "open-finding.sh"), harness + "\n");

  const titleFor = async (finding) => {
    if (finding === null) await rm(join(ALARM_TMP, "finding.txt"), { force: true });
    else await writeFile(join(ALARM_TMP, "finding.txt"), finding);
    let out;
    try {
      out = execFileSync(BASH, ["--noprofile", "--norc", "-eo", "pipefail", "open-finding.sh"],
        { cwd: ALARM_TMP, encoding: "utf8", env: { ...process.env, GITHUB_REPOSITORY: "u00dxk2/bounds-ledger" } });
    } catch (err) { out = (err.stdout ?? "") + (err.stderr ?? ""); }
    const m = out.match(/^TITLE => (.*)$/m);
    // No title at all means the harness never ran — that must fail loudly, not read as "no
    // Drift: prefix, so the transport assertion passes". An empty string satisfies
    // doesNotMatch(/^Drift:/) trivially, which is how this guard first fooled itself.
    assert.ok(m, `the extracted Open-finding body emitted no title (harness did not run):\n${out}`);
    return m[1].trim();
  };

  if (!BASH) {
    alarmVerdict = "alarm title guard COULD NOT RUN — no bash found, so Drift-vs-Check-error went UNCHECKED here";
    alarmCouldNotRun = true;
    console.warn(`reverify.test: ${alarmVerdict}`);
    await rm(ALARM_TMP, { recursive: true, force: true });
  } else {
  // Silent on a transport failure: it must NOT claim a record moved. Verbatim shape of the
  // 2026-08-17 run, including reverify's own `error:` line, which UNREACHABLE used to outrank.
  const flake = await titleFor(
    "error: fetch constants/11a.md: 429\nUNREACHABLE C-1  upper bound on the minimum-overlap constant\nUNREACHABLE pin:3c:L  last-listed lower-bound row\n"
  );
  assert.doesNotMatch(flake, /^Drift:/, `a transport failure was titled as a record movement: ${flake}`);
  // A-19 N-1: the fixture pins TWO UNREACHABLE claim lines against ONE unreachable source
  // (constants/11a.md, whose 429 is on the line above them). The old title said "could not
  // reach 2 cited source(s)" — counting claim lines while naming sources, which is why the
  // wording changed. This assertion is what makes the count-referent a tested property rather
  // than a comment: it caught the wording change on the first run after it was made.
  assert.match(flake, /^Check error: bounds-ledger could not verify 2 claim\(s\) \(cited source unreachable\)/, `unexpected flake title: ${flake}`);

  // Fires on each real record movement.
  assert.match(await titleFor("BROKEN pin:10a:U  pinned string gone\n"), /^Drift: claims pin:10a:U/);
  assert.match(await titleFor("CHANGED constants/2a.md\n"), /^Drift: constants\/2a\.md/);
  // A real move outranks a concurrent flake — otherwise a 429 could mask a genuine drift.
  assert.match(await titleFor("BROKEN pin:10a:U  gone\nUNREACHABLE pin:3c:L  HTTP 429\n"), /^Drift: claims pin:10a:U/);
  // `paste -sd', '` cycles its delimiters rather than joining with ", ", so three or more items
  // came out `a,b c`. Visible in issue #15's own title.
  assert.match(
    await titleFor("CHANGED constants/2a.md\nCHANGED README.md\nADDED constants/99z.md\n"),
    /^Drift: constants\/2a\.md, README\.md, constants\/99z\.md/
  );
  // The two paths that already worked must not regress.
  assert.match(await titleFor("error: fetch failed\n"), /^Check error: bounds-ledger re-verification could not complete/);
  assert.match(await titleFor(null), /^Instrument failure: bounds-ledger self-test/);
  await rm(ALARM_TMP, { recursive: true, force: true });
  alarmVerdict = "alarm titles a record movement Drift: and a transport failure Check error:, with the real move outranking a concurrent flake";
  }
}

const summary = `synthetic drift in ${victim} detected; pristine copy clean; README leg fires on an asterisked row, silent when restored, REMOVED when deleted, and untouched by a constants-only edit; ${steps.length} workflow steps, piped steps pipefail-guarded; ${testCmds.length} self-tests present in CI; ${alarmVerdict}`;

// A-19 N-2. Previously the bash-less path printed PASS and exited 0, so on a machine without
// bash this file reported success for a guard that never ran — the precise shape this repo
// ruled against on 2026-08-17 ("prove non-firing means the CONDITION is absent, not the
// INSTRUMENT"), sitting in the test that guards the drift alarm. It stopped being hypothetical
// on 2026-08-20, when bash was genuinely absent from PATH under PowerShell here and a spawn
// returned an empty string. House convention elsewhere on the rail is that could-not-run gets
// its own exit code, distinct from both pass and fail; 2 is that code.
// CI always has bash, so this changes nothing there — which is the point: it only speaks up in
// the environment that was silently under-testing.
if (alarmCouldNotRun) {
  console.log(`reverify.test: COULD NOT RUN (${summary})`);
  console.log("reverify.test: exiting 2 — a guard that did not run must not report success");
  process.exit(2);
}
console.log(`reverify.test: PASS (${summary})`);
