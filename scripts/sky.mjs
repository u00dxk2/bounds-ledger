#!/usr/bin/env node
// vendored from skylark-site scripts/sky.mjs at d725cd73 (S-20260906-75) - sync by copy
// sky — the LANE-SIDE runner for EVERY shared skylark-site script.
//
// S-20260906-75 (2026-09-06), the layer S-20260906-66 left open. S-66 made eleven
// lanes' `.githooks/pre-commit` and their receipt-wrapped `gates` script
// worktree-proof (scripts/gates.mjs + scripts/lib/skylark-site-root.mjs). Every
// OTHER lane-side call of a shared script is still spelled
//
//     node ../skylark-site/scripts/<x>.mjs …
//
// in a root package.json script or in loaded-doc prose — frolic's persona-test /
// validate-personas / wilson, billionaire-army's check:primer, bank-see's
// persona-test / validate-personas, reels' wilson, agentic-dir's wilson /
// persona-test / validate-personas, walking-denver's persona-test. `..` resolves
// from the CWD, so from `<lane>/.claude/worktrees/<name>` it names
// `<lane>/.claude/worktrees/skylark-site/<x>.mjs`, which does not exist:
// MODULE_NOT_FOUND, exit 1, an honest exit code attached to a wrong story. Same
// class as S-66, one layer out.
//
// The replacement, lane-relative and therefore worktree-proof:
//
//     node scripts/sky.mjs <script-basename-or-relative-path> [args…]
//
// A NODE FLAG the lane already typed is FORWARDED to the child through
// `process.execArgv`, so `node --import tsx ../skylark-site/scripts/x.ts` becomes
// `node --import tsx scripts/sky.mjs x.ts` and the loader still reaches the script
// that needs it. (Consequence, deliberate and disclosed: an `--inspect` on the
// parent is forwarded too and both processes will want the port.)
//
// ⚠ A JUNCTION IS NEVER THE FIX. Dropping a `skylark-site` directory junction
// beside a worktree makes the old path resolve and then silently defeats the
// fleet's ESM main guard (`import.meta.url` is the module's REALPATH, argv[1] is
// the path as typed), so the script exits 0 having run nothing — secret scanning
// included. See docs/rollups/2026-09-06-worktree-gate-resolution.md. This file
// carries NO main guard on purpose: it does its work at the top level, so there is
// no guard for a link to defeat.
//
// Node builtins only, and it imports exactly ONE local file, deliberately: lanes
// VENDOR this beside `scripts/gates.mjs` and `scripts/lib/skylark-site-root.mjs`,
// and a `src/lib` import would throw ERR_MODULE_NOT_FOUND in their tree.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveSkylarkSiteRoot, skylarkSiteRootRefusalLine } from "./lib/skylark-site-root.mjs";

/** Flags this runner OWNS. Everything after the script name belongs to the child,
 * so these are only recognised BEFORE it — `sky.mjs wilson.mjs --help` asks
 * wilson for its help, not this file. An unrecognised leading flag is a USAGE
 * ERROR, never a default (AGENTS.md § Commands). */
const OWN_FLAGS = new Set(["--help", "-h", "--where", "--selftest"]);

const HELP = `sky — run a shared skylark-site script from a lane, from the lane ROOT or from any
linked worktree of it. The checkout is resolved through git's common dir
(scripts/lib/skylark-site-root.mjs), never from the cwd, so \`..\` is never guessed.

  node scripts/sky.mjs <script> [args…]   run <root>/scripts/<script>, forwarding args
                                          AND the child's exit code, unchanged
  node scripts/sky.mjs --where <script>   print the resolved absolute path and run NOTHING
  node scripts/sky.mjs --help             this text
  node scripts/sky.mjs --selftest         real git fixture: lane root + linked worktree

<script> is relative to the skylark-site \`scripts/\` directory — a basename
(\`wilson.mjs\`), a nested path (\`persona-testing/run-persona.ts\`), or a bare name
whose \`.mjs\` is implied (\`wilson\`). An absolute path or one escaping \`scripts/\`
is REFUSED.

Node flags typed before this file are forwarded to the child, so the tsx lanes keep
their loader:  node --import tsx scripts/sky.mjs persona-testing/run-persona.ts

Exit: the CHILD's true exit code · 2 = this runner refused (checkout unresolvable,
script not there, bad usage) and NOTHING RAN. Both refusals print one line starting
\`sky: NOT RUNNABLE —\`.`;

/**
 * Split argv into this runner's own flags, the script name, and the child's args.
 * A bare `--` ends the runner's flags (so a lane may write `sky.mjs -- --odd-name`).
 * @param {string[]} argv
 * @returns {{flags: Set<string>, script: string|null, rest: string[], badFlag: string|null}}
 */
function parseSkyArgv(argv) {
  const flags = new Set();
  let i = 0;
  for (; i < argv.length; i++) {
    const tok = argv[i];
    if (tok === "--") {
      i++;
      break;
    }
    if (!tok.startsWith("-")) break;
    if (!OWN_FLAGS.has(tok)) return { flags, script: null, rest: [], badFlag: tok };
    flags.add(tok === "-h" ? "--help" : tok);
  }
  return { flags, script: argv[i] ?? null, rest: argv.slice(i + 1), badFlag: null };
}

/**
 * Where does `<name>` live under `<root>/scripts`, and is it there?
 *
 * Containment is checked BEFORE existence: a name that climbs out of `scripts/`
 * is refused even when the file it names exists, because this runner's contract
 * is "a shared script", not "any file on the box".
 *
 * @param {string} root the skylark-site checkout
 * @param {string} name as typed on the command line
 * @returns {{ok: boolean, path: string|null, kind: "found"|"absolute"|"escapes"|"missing", tried: string[]}}
 */
function resolveScriptPath(root, name) {
  const scriptsDir = resolve(join(root, "scripts"));
  if (isAbsolute(name)) return { ok: false, path: null, kind: "absolute", tried: [name] };

  // A bare name gets `.mjs` implied — the fleet's shared scripts are .mjs and
  // `sky.mjs wilson` is what a hand types. Both candidates are NAMED on a miss.
  const names = extname(name) === "" ? [name, `${name}.mjs`] : [name];
  const tried = [];
  for (const candidate of names) {
    const full = resolve(scriptsDir, candidate);
    if (full !== scriptsDir && !full.startsWith(scriptsDir + sep)) {
      return { ok: false, path: null, kind: "escapes", tried: [full] };
    }
    tried.push(full);
    if (existsSync(full)) return { ok: true, path: full, kind: "found", tried };
  }
  return { ok: false, path: null, kind: "missing", tried };
}

/**
 * The refusal line for a checkout that RESOLVED but does not hold the script.
 * Deliberately NOT `skylarkSiteRootRefusalLine` — that line says the checkout
 * could not be resolved, which here would be false. Same `sky: NOT RUNNABLE —`
 * prefix so one grep finds both.
 * @param {{kind: string, tried: string[]}} target
 * @param {{root: string|null, how: string}} verdict
 * @param {string} name
 */
function scriptRefusalLine(target, verdict, name) {
  const looked = target.tried.join(", ") || "(nothing)";
  const why =
    target.kind === "absolute"
      ? `\`${name}\` is an ABSOLUTE path — name a script RELATIVE to the skylark-site scripts/ directory`
      : target.kind === "escapes"
        ? `\`${name}\` resolves OUTSIDE ${join(verdict.root ?? "", "scripts")} — this runner runs shared scripts, not arbitrary files`
        : `the ${verdict.root} checkout holds no such script`;
  return (
    `sky: NOT RUNNABLE — ${why}. Looked for: ${looked}. ` +
    `Checkout resolved ${verdict.how}. Refusing rather than exiting 0 having run nothing (S-20260906-63).`
  );
}

/**
 * @param {string[]} argv process.argv.slice(2)
 * @returns {number} the process exit code
 */
function run(argv) {
  const { flags, script, rest, badFlag } = parseSkyArgv(argv);
  if (badFlag) {
    console.error(`sky: unknown flag ${badFlag} — nothing ran. Run \`node scripts/sky.mjs --help\` for the flag list.`);
    return 2;
  }
  if (flags.has("--help")) {
    console.log(HELP);
    return 0;
  }
  if (flags.has("--selftest")) return selftest();
  if (!script) {
    console.error("sky: no script named. usage: node scripts/sky.mjs [--where] <script> [args…]  (--help for the contract)");
    return 2;
  }

  const verdict = resolveSkylarkSiteRoot();
  if (!verdict.ok) {
    console.error(skylarkSiteRootRefusalLine("sky", verdict));
    return 2;
  }
  const target = resolveScriptPath(verdict.root, script);
  if (!target.ok) {
    console.error(scriptRefusalLine(target, verdict, script));
    return 2;
  }
  if (flags.has("--where")) {
    // stdout is the PATH ALONE so the line pastes; the provenance goes to stderr.
    console.error(`sky: skylark-site resolved to ${verdict.root} (${verdict.how} — ${verdict.reason})`);
    console.log(target.path);
    return 0;
  }

  const child = spawnSync(process.execPath, [...process.execArgv, target.path, ...rest], { stdio: "inherit" });
  if (child.error) {
    console.error(
      `sky: NOT RUNNABLE — could not spawn ${target.path} (${child.error.code ?? child.error.message}). Nothing ran.`,
    );
    return 2;
  }
  // A signal death leaves status null. This runner may never INVENT a code, and
  // it may never report one as 0 either: 2 says "we did not get an exit code".
  return Number.isInteger(child.status) ? child.status : 2;
}

/**
 * --selftest: the REAL geometry, built with real git.
 *
 * A hand-built directory would not prove the worktree case at all — the whole
 * defect lives in what `..` means from `<lane>/.claude/worktrees/<name>`, and the
 * resolver's answer comes from `git rev-parse --git-common-dir`. So: a fixture
 * fleet parent holding a `skylark-site` sibling (marker + stub script) and a lane
 * git repo with this runner vendored into it, plus a real linked worktree of that
 * lane. Every arm runs from BOTH the lane root and the worktree.
 *
 * @returns {number} 0 pass · 1 an assertion failed
 */
function selftest() {
  const failures = [];
  let asserted = 0;
  const ok = (cond, what) => {
    asserted++;
    if (!cond) failures.push(what);
  };
  const dirs = [];
  const self = fileURLToPath(import.meta.url);

  try {
    const fleet = mkdtempSync(join(tmpdir(), "sky-selftest-"));
    dirs.push(fleet);

    // (i) the skylark-site sibling: the MARKER the resolver looks for, plus a stub
    // that PRINTS (a silent gate is a different failure mode — S-20260906-63 leg b)
    // and exits 7, a code no runner would produce by accident.
    const site = join(fleet, "skylark-site");
    mkdirSync(join(site, "scripts", "nested"), { recursive: true });
    writeFileSync(join(site, "scripts", "verify-with-receipt.mjs"), "// fixture marker\n");
    writeFileSync(
      join(site, "scripts", "stub.mjs"),
      "console.log('STUB RAN args=' + JSON.stringify(process.argv.slice(2)));\n" +
        "import('node:fs').then((fs) => { fs.writeFileSync(process.env.SKY_SELFTEST_SENTINEL, 'ran'); process.exit(7); });\n",
    );
    writeFileSync(join(site, "scripts", "nested", "deep.mjs"), "console.log('DEEP RAN'); process.exit(0);\n");

    // (ii) the lane: a real git repo with this runner + its resolver vendored in,
    // exactly as a lane would hold them.
    const lane = join(fleet, "lane");
    mkdirSync(join(lane, "scripts", "lib"), { recursive: true });
    writeFileSync(join(lane, "scripts", "sky.mjs"), readFileSync(self));
    writeFileSync(
      join(lane, "scripts", "lib", "skylark-site-root.mjs"),
      readFileSync(join(dirname(self), "lib", "skylark-site-root.mjs")),
    );
    const git = (cwd, ...args) => spawnSync("git", args, { cwd, encoding: "utf8" });
    git(lane, "init", "-q");
    git(lane, "config", "user.email", "selftest@example.invalid");
    git(lane, "config", "user.name", "sky selftest");
    git(lane, "config", "commit.gpgsign", "false");
    writeFileSync(join(lane, ".gitignore"), ".claude/\ntmp/\n");
    git(lane, "add", "-A");
    git(lane, "commit", "-q", "--no-verify", "-m", "vendored runner");
    const wt = join(lane, ".claude", "worktrees", "wt");
    const added = git(lane, "worktree", "add", "-q", "--detach", wt, "HEAD");
    ok(added.status === 0, `a REAL linked worktree was created (git said ${added.status}: ${String(added.stderr).slice(0, 120)})`);

    const sentinel = join(fleet, "ran.txt");
    const env = { ...process.env, SKY_SELFTEST_SENTINEL: sentinel };
    const sky = (cwd, ...args) =>
      spawnSync(process.execPath, [join(cwd, "scripts", "sky.mjs"), ...args], { cwd, encoding: "utf8", env });
    const clearSentinel = () => {
      try {
        rmSync(sentinel, { force: true });
      } catch { /* absent is the state we want */ }
    };
    const expected = resolve(join(site, "scripts", "stub.mjs"));

    // (iii) POSITIVE CONTROL that the fixture reproduces the DEFECT — without it,
    // every arm below could be passing for reasons unrelated to worktrees. The OLD
    // spelling from the lane ROOT runs; the SAME spelling from the WORKTREE does not.
    const oldFromRoot = spawnSync(process.execPath, ["../skylark-site/scripts/stub.mjs"], { cwd: lane, encoding: "utf8", env });
    ok(oldFromRoot.status === 7, `CONTROL: the OLD \`node ../skylark-site/scripts/…\` spelling runs from the lane ROOT (exit ${oldFromRoot.status}, want 7)`);
    const oldFromWt = spawnSync(process.execPath, ["../skylark-site/scripts/stub.mjs"], { cwd: wt, encoding: "utf8", env });
    ok(oldFromWt.status !== 7, `CONTROL: …and CANNOT run from the linked worktree (exit ${oldFromWt.status}, want anything but 7)`);
    ok(
      /Cannot find module|MODULE_NOT_FOUND/i.test(String(oldFromWt.stderr)),
      `CONTROL: …failing as a missing module, which is the defect this file replaces (${String(oldFromWt.stderr).replace(/\s+/g, " ").slice(0, 120)})`,
    );

    // (iv) --where resolves to the SAME path from both, and runs NOTHING.
    for (const [label, cwd] of [["lane root", lane], ["linked worktree", wt]]) {
      clearSentinel();
      const where = sky(cwd, "--where", "stub.mjs");
      ok(where.status === 0, `--where from the ${label} exits 0 (got ${where.status}: ${String(where.stderr).slice(0, 120)})`);
      ok(
        resolve(String(where.stdout).trim()) === expected,
        `--where from the ${label} names ${expected} (got ${String(where.stdout).trim()})`,
      );
      ok(!existsSync(sentinel), `--where from the ${label} ran NOTHING (no sentinel written)`);
    }

    // (v) the stub RUNS from both, with its true exit code and its args forwarded.
    for (const [label, cwd] of [["lane root", lane], ["linked worktree", wt]]) {
      clearSentinel();
      const ran = sky(cwd, "stub.mjs", "--flag", "value with space");
      ok(ran.status === 7, `the stub's TRUE exit code is forwarded from the ${label} (got ${ran.status}, want 7)`);
      ok(existsSync(sentinel), `…and it really ran from the ${label} (sentinel present)`);
      ok(
        String(ran.stdout).includes('["--flag","value with space"]'),
        `…with its arguments forwarded verbatim from the ${label} (${String(ran.stdout).replace(/\s+/g, " ").slice(0, 120)})`,
      );
    }

    // (vi) a nested path and an implied `.mjs` both resolve.
    ok(sky(wt, "nested/deep.mjs").status === 0, "a NESTED relative path resolves from the worktree");
    ok(resolve(String(sky(wt, "--where", "stub").stdout).trim()) === expected, "a bare name implies `.mjs`");

    // (vii) REFUSALS — each names the thing it refused, and none of them is exit 0.
    const missing = sky(wt, "no-such-script.mjs");
    ok(missing.status === 2, `an unknown script name REFUSES at exit 2 (got ${missing.status})`);
    ok(String(missing.stderr).includes("NOT RUNNABLE"), "…saying NOT RUNNABLE");
    ok(String(missing.stderr).includes("no-such-script.mjs"), "…NAMING the path it looked for");
    const escapes = sky(wt, "../../etc/passwd");
    ok(escapes.status === 2 && /OUTSIDE/.test(String(escapes.stderr)), `a name escaping scripts/ REFUSES (exit ${escapes.status})`);
    const abs = sky(wt, expected);
    ok(abs.status === 2 && /ABSOLUTE/.test(String(abs.stderr)), `an ABSOLUTE path REFUSES (exit ${abs.status})`);
    const badFlag = sky(wt, "--nope", "stub.mjs");
    ok(badFlag.status === 2 && /unknown flag/.test(String(badFlag.stderr)), `an unknown leading flag is a USAGE ERROR (exit ${badFlag.status})`);
    const noArgs = sky(wt);
    ok(noArgs.status === 2 && /no script named/.test(String(noArgs.stderr)), `no script name at all is a USAGE ERROR (exit ${noArgs.status})`);

    // (viii) a flag AFTER the script name belongs to the CHILD, not to this runner.
    const childHelp = sky(wt, "stub.mjs", "--help");
    ok(childHelp.status === 7 && String(childHelp.stdout).includes('["--help"]'), `\`--help\` after the script name is the CHILD's (exit ${childHelp.status})`);

    // (ix) POSITIVE CONTROL for the resolver leg — a lane with NO skylark-site
    // sibling refuses with the resolver's own line and runs nothing.
    const lonely = join(mkdtempSync(join(tmpdir(), "sky-lonely-")), "lane");
    dirs.push(dirname(lonely));
    mkdirSync(join(lonely, "scripts", "lib"), { recursive: true });
    writeFileSync(join(lonely, "scripts", "sky.mjs"), readFileSync(self));
    writeFileSync(join(lonely, "scripts", "lib", "skylark-site-root.mjs"), readFileSync(join(dirname(self), "lib", "skylark-site-root.mjs")));
    git(lonely, "init", "-q");
    const orphan = spawnSync(process.execPath, [join(lonely, "scripts", "sky.mjs"), "stub.mjs"], { cwd: lonely, encoding: "utf8", env });
    ok(orphan.status === 2, `a lane with NO skylark-site sibling REFUSES at exit 2 (got ${orphan.status})`);
    ok(
      String(orphan.stderr).includes("checkout could not be resolved"),
      `…with the RESOLVER's line, not the missing-script one (${String(orphan.stderr).replace(/\s+/g, " ").slice(0, 140)})`,
    );

    // (x) --help prints the contract and exits 0 without touching git or a checkout.
    const help = spawnSync(process.execPath, [self, "--help"], { cwd: fleet, encoding: "utf8" });
    ok(help.status === 0 && String(help.stdout).includes("node scripts/sky.mjs"), `--help prints the contract at exit 0 (got ${help.status}, ${String(help.stdout).length} bytes)`);
  } catch (e) {
    failures.push(`the fixture threw: ${String(e && e.message ? e.message : e).slice(0, 200)}`);
    asserted++;
  } finally {
    // Cleanup only. git can still hold a fixture directory on Windows for a beat
    // after it exits (EPERM/EBUSY), so retry briefly and then give up QUIETLY —
    // a leaked temp dir is not an assertion. (S-20260906-76 is extracting the
    // shared helper for the TEST files; this file is vendored and may not import it.)
    for (const dir of dirs) {
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          rmSync(dir, { recursive: true, force: true });
          break;
        } catch {
          const until = Date.now() + 100;
          while (Date.now() < until) { /* brief synchronous backoff */ }
        }
      }
    }
  }

  if (failures.length) {
    console.error(`SELFTEST FAIL (${failures.length} of ${asserted}):`);
    for (const f of failures) console.error(`  - ${f}`);
    return 1;
  }
  // COUNTED, never typed: a hand-maintained number drifts the moment an arm is
  // added, and an inflated one is exactly the claim a selftest exists to make
  // unfalsifiable.
  console.log(
    `SELFTEST PASS — ${asserted} assertions (the fixture's OLD \`../skylark-site\` spelling runs from the lane root ` +
      "and dies MODULE_NOT_FOUND from a real linked worktree, while sky.mjs --where names the SAME absolute path from " +
      "both and runs nothing, the stub's exit 7 and its arguments survive from both, nested paths and an implied .mjs " +
      "resolve, a missing script / an escaping name / an absolute path / an unknown leading flag / no script at all each " +
      "REFUSE at exit 2 naming what they refused, a flag after the script name reaches the CHILD, and a lane with no " +
      "skylark-site sibling refuses with the RESOLVER's line)",
  );
  return 0;
}

process.exit(run(process.argv.slice(2)));
