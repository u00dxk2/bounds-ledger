#!/usr/bin/env node
// check-entry-guard-leg — the first leg of `npm run check`, made runnable from a bare clone.
//
// A-103 (2026-11-14). `npm run check` is an `&&` chain whose first leg was
// `node scripts/sky.mjs check-entry-guard.mjs --root .`. The entry guard is a FLEET
// script: it lives in the skylark-site checkout that sits beside this repo on the
// maintainers' machine, and it checks how this repo's scripts decide that they were
// run directly (no realpath-against-typed-path comparison; skylark-site
// scripts/check-entry-guard.mjs header), not the ledger. A visitor who clones this public repo has
// no such checkout, so `sky.mjs` refused with `sky: NOT RUNNABLE` and exit 2, and the
// chain stopped before any ledger leg ran. README.md promised that the command's exit
// code "means what it says". Measured in a fresh clone of b8f69cf the same day: the
// other eleven legs all exit 0 with nothing beside the clone.
//
// So this leg does ONE narrow thing differently from `sky.mjs`, and claims as little as
// it can (Codex round 1, 2026-11-14, reproduced a skip on a maintainer machine whose git
// subprocess was blocked, under the first version that skipped on ANY unresolved verdict):
//   - SKIP only when git ANSWERED (the resolver's `git-common-dir` branch) AND no
//     `skylark-site` directory exists at any place it looked: a clone with nothing beside
//     it. Then print `ENTRY GUARD NOT RUN — …` on stdout and exit 0.
//   - Everything else goes to `scripts/sky.mjs` exactly as before, and its TRUE exit code
//     is forwarded: a found checkout runs the guard; a `skylark-site` entry without its
//     marker, or a checkout without the guard script, REFUSES at exit 2 (sky.mjs's own
//     refusal, unchanged); unreadable git never skips and leaves resolution to sky.mjs,
//     which may still find the checkout through its cwd fallback and otherwise refuses.
//   - What the skip does NOT establish (Codex round 2): that the machine is a visitor's.
//     A maintainer whose sibling checkout is missing or moved also skips; the line printed
//     on every skip is the only safeguard, by design.
// `sky.mjs` itself is vendored from skylark-site and is NOT edited; its "refuse rather
// than exit 0 having run nothing" rule stays true for every other caller. This leg
// never claims the guard passed: the skip line is printed on every run that skips.
//
// --selftest builds four directory fixtures, each initialised as a git repository (the
// init is asserted), and runs the leg from each: no sibling; a sibling whose guard exits
// 5; a sibling without the guard; a `skylark-site` directory without its marker. Then
// unit arms on runLeg cover the git-unreadable verdict, which a fixture cannot produce.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isEntryModule } from "./lib/entry-module.mjs";
import { resolveSkylarkSiteRoot } from "./lib/skylark-site-root.mjs";

export const SKIP_PREFIX = "ENTRY GUARD NOT RUN";

/**
 * The line printed when the checkout cannot be found. Exported so the selftest pins
 * the exact emitted string rather than a pattern.
 * @param {{reason: string}} verdict
 * @returns {string}
 */
export function skipLine(verdict) {
  return (
    `${SKIP_PREFIX} — it is a maintainer check of how this repo's scripts detect that they were run directly, and it lives in the ` +
    `skylark-site checkout that is not beside this clone (${verdict.reason}). It checks nothing in the ledger; ` +
    "the ledger checks below run either way."
  );
}

/**
 * Do the searched places all appear absent? True only when git answered
 * (`how: "git-common-dir"`), something was searched, and no searched path exists at all
 * (a file counts as existing). An unreadable git (`cwd-fallback`), or a `skylark-site`
 * entry that exists without its marker, never answers true. A true answer is what a bare
 * clone looks like; it is not proof the machine is a visitor's.
 * @param {{ok: boolean, how?: string, searched?: string[]}} verdict
 * @param {(p: string) => boolean} [exists]
 * @returns {boolean}
 */
export function isBareClone(verdict, exists = existsSync) {
  if (verdict.ok || verdict.how !== "git-common-dir") return false;
  const searched = Array.isArray(verdict.searched) ? verdict.searched : [];
  return searched.length > 0 && searched.every((dir) => !exists(dir));
}

/** Run the guard through the vendored sky.mjs and forward its exit code. */
function delegateToSky(args) {
  const sky = join(dirname(fileURLToPath(import.meta.url)), "sky.mjs");
  const child = spawnSync(process.execPath, [...process.execArgv, sky, "check-entry-guard.mjs", ...args], { stdio: "inherit" });
  if (child.error) {
    console.error(`check-entry-guard-leg: could not spawn ${sky} (${child.error.code ?? child.error.message}). Nothing ran.`);
    return 2;
  }
  // A signal death leaves status null; 2 says "no exit code was obtained", never 0.
  return Number.isInteger(child.status) ? child.status : 2;
}

/**
 * @param {string[]} args forwarded to the guard (package.json passes `--root .`)
 * @param {{resolve?: typeof resolveSkylarkSiteRoot, out?: (s: string) => void, exists?: (p: string) => boolean, delegate?: (a: string[]) => number}} [io]
 * @returns {number} exit code
 */
export function runLeg(args, { resolve = resolveSkylarkSiteRoot, out = (s) => console.log(s), exists = existsSync, delegate = delegateToSky } = {}) {
  const verdict = resolve({ disclose: false });
  if (isBareClone(verdict, exists)) {
    out(skipLine(verdict));
    return 0;
  }
  return delegate(args);
}

function selftest() {
  const failures = [];
  let asserted = 0;
  const ok = (cond, what) => {
    asserted++;
    if (!cond) failures.push(what);
  };
  const self = fileURLToPath(import.meta.url);
  const here = dirname(self);
  const dirs = [];
  const git = (cwd, ...a) => spawnSync("git", a, { cwd, encoding: "utf8" });

  // A lane holding this leg and exactly the files it imports, vendored as a clone has them.
  const makeLane = (parent) => {
    const lane = join(parent, "lane");
    mkdirSync(join(lane, "scripts", "lib"), { recursive: true });
    for (const rel of ["check-entry-guard-leg.mjs", "sky.mjs", join("lib", "entry-module.mjs"), join("lib", "skylark-site-root.mjs")]) {
      writeFileSync(join(lane, "scripts", rel), readFileSync(join(here, rel)));
    }
    const init = git(lane, "init", "-q");
    ok(init.status === 0, `git init succeeded in ${lane} (status ${init.status}: ${String(init.stderr).slice(0, 120)})`);
    return lane;
  };
  const runIn = (lane) =>
    spawnSync(process.execPath, [join(lane, "scripts", "check-entry-guard-leg.mjs"), "--root", "."], { cwd: lane, encoding: "utf8" });

  try {
    // (1) NO sibling: the visitor's clone. Exit 0, the skip line, and no sky refusal.
    const lonelyParent = mkdtempSync(join(tmpdir(), "guard-leg-lonely-"));
    dirs.push(lonelyParent);
    const lonely = runIn(makeLane(lonelyParent));
    const lonelyOut = String(lonely.stdout);
    ok(lonelyOut.includes(SKIP_PREFIX), `no sibling: stdout names the skip (${lonelyOut.replace(/\s+/g, " ").slice(0, 120)})`);
    ok(!/NOT RUNNABLE/.test(`${lonelyOut}${lonely.stderr}`), "no sibling: sky.mjs's NOT RUNNABLE refusal is not printed");
    ok(lonely.status === 0, `no sibling: exits 0 so the ledger legs run (got ${lonely.status})`);

    // (2) Sibling WITH a guard that exits 5: the leg runs it and forwards 5.
    const fleet = mkdtempSync(join(tmpdir(), "guard-leg-fleet-"));
    dirs.push(fleet);
    const site = join(fleet, "skylark-site", "scripts");
    mkdirSync(site, { recursive: true });
    writeFileSync(join(site, "verify-with-receipt.mjs"), "// fixture marker\n");
    writeFileSync(join(site, "check-entry-guard.mjs"), "console.log('GUARD RAN ' + JSON.stringify(process.argv.slice(2))); process.exit(5);\n");
    const ran = runIn(makeLane(fleet));
    ok(String(ran.stdout).includes('GUARD RAN ["--root","."]'), `sibling present: the guard ran with its args (${String(ran.stdout).replace(/\s+/g, " ").slice(0, 120)})`);
    ok(!String(ran.stdout).includes(SKIP_PREFIX), "sibling present: no skip line");
    ok(ran.status === 5, `sibling present: the guard's TRUE exit code is forwarded (got ${ran.status}, want 5)`);

    // (3) Sibling found but WITHOUT the guard: still a refusal at exit 2, never a skip.
    const broken = mkdtempSync(join(tmpdir(), "guard-leg-broken-"));
    dirs.push(broken);
    mkdirSync(join(broken, "skylark-site", "scripts"), { recursive: true });
    writeFileSync(join(broken, "skylark-site", "scripts", "verify-with-receipt.mjs"), "// fixture marker\n");
    const missing = runIn(makeLane(broken));
    ok(missing.status === 2, `sibling without the guard: still refuses at exit 2 (got ${missing.status})`);
    ok(/NOT RUNNABLE.*holds no such script/.test(String(missing.stderr)), `sibling without the guard: sky.mjs's missing-SCRIPT refusal is printed (${String(missing.stderr).replace(/\s+/g, " ").slice(0, 120)})`);
    ok(!String(missing.stdout).includes(SKIP_PREFIX), "sibling without the guard: no skip line");

    // (4) A `skylark-site` DIRECTORY beside the lane but without its marker: a broken
    // maintainer setup, not a bare clone. It must refuse, never skip.
    const unmarked = mkdtempSync(join(tmpdir(), "guard-leg-unmarked-"));
    dirs.push(unmarked);
    mkdirSync(join(unmarked, "skylark-site", "scripts"), { recursive: true });
    const half = runIn(makeLane(unmarked));
    ok(half.status === 2, `skylark-site directory without its marker: refuses at exit 2 (got ${half.status})`);
    ok(/NOT RUNNABLE.*could not be resolved/.test(String(half.stderr)), `…with the resolver's refusal (${String(half.stderr).replace(/\s+/g, " ").slice(0, 120)})`);
    ok(!String(half.stdout).includes(SKIP_PREFIX), "…and no skip line");

    // (5) Unit arms on the decision, for verdicts a fixture cannot produce.
    const never = () => false;
    let delegated = 0;
    const del = () => { delegated++; return 9; };
    const quiet = () => {};
    // git unreadable: the resolver's cwd-fallback branch. Must delegate (sky refuses), never skip.
    delegated = 0;
    const fallback = runLeg([], { resolve: () => ({ ok: false, how: "cwd-fallback", searched: ["X"], reason: "R" }), exists: never, delegate: del, out: quiet });
    ok(fallback === 9 && delegated === 1, `git unreadable (cwd-fallback): delegates to sky.mjs and forwards its code (got ${fallback}, delegated ${delegated})`);
    // git answered but the searched place EXISTS (a directory without the marker): delegate.
    delegated = 0;
    const present = runLeg([], { resolve: () => ({ ok: false, how: "git-common-dir", searched: ["X"], reason: "R" }), exists: () => true, delegate: del, out: quiet });
    ok(present === 9 && delegated === 1, `git answered, sibling directory present: delegates (got ${present}, delegated ${delegated})`);
    // nothing searched: never read as a bare clone.
    ok(!isBareClone({ ok: false, how: "git-common-dir", searched: [] }, never), "an empty search list is not a bare clone");

    // (6) The exact emitted string, pinned LAST so the meaning-carrying arms above trip first.
    const lines = [];
    delegated = 0;
    const code = runLeg([], { resolve: () => ({ ok: false, how: "git-common-dir", searched: ["X"], reason: "R" }), exists: never, delegate: del, out: (s) => lines.push(s) });
    ok(code === 0 && lines.length === 1 && delegated === 0, `a bare clone prints one line, returns 0 and delegates nothing (got ${code}, ${lines.length} lines, delegated ${delegated})`);
    ok(
      lines[0] ===
        "ENTRY GUARD NOT RUN — it is a maintainer check of how this repo's scripts detect that they were run directly, and it lives in the skylark-site checkout that is not beside this clone (R). It checks nothing in the ledger; the ledger checks below run either way.",
      `the skip line is pinned verbatim (${lines[0]})`,
    );
  } catch (e) {
    failures.push(`the fixture threw: ${String(e && e.message ? e.message : e).slice(0, 200)}`);
    asserted++;
  } finally {
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
  console.log(
    `SELFTEST PASS — ${asserted} assertions (no sibling: skip line, no NOT RUNNABLE, exit 0; sibling with a guard: ` +
      "it runs with its args and its exit 5 is forwarded; sibling without the guard and a skylark-site directory " +
      "without its marker: each refuses at exit 2 with its own cause; git unreadable and a present sibling directory " +
      "delegate to sky.mjs; skip line pinned)",
  );
  return 0;
}

if (isEntryModule(import.meta.url)) {
  const argv = process.argv.slice(2);
  process.exitCode = argv[0] === "--selftest" ? selftest() : runLeg(argv);
}
