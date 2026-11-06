#!/usr/bin/env node
/**
 * check-import-inert — A-50: importing one of our scripts must do nothing.
 *
 * THE CLASS. A script whose command-line entry runs at module top level also runs when another
 * file IMPORTS it to reuse a function. It has bitten this repo four times: lookup.mjs, then
 * render-site.mjs, then render-constant-pages.mjs (2026-09-14), then depth-audit.mjs on
 * 2026-10-21, when a scratch script imported boundRowsOf, the depth-audit summary printed, and
 * process.exit ended the importer before its own output appeared. Each was fixed with a main
 * guard in that one file, and a comment did not stop the next one.
 *
 * WHAT THIS TESTS: the PROPERTY, not the shape. A guard-presence lint passes on a guard that is
 * present and wrong (the junction case in scripts/lib/entry-module.mjs is one). So each module is
 * imported for real, in its own child process, and the import must be inert:
 *   - nothing on stdout or stderr;
 *   - the child reaches a marker written AFTER the import, so a process.exit on import is caught;
 *   - fetch is replaced with a function that throws, so a module that reaches the network on
 *     import fails loudly here instead of spending upstream's rate limit;
 *   - no file under the repository root (outside .git, node_modules and tmp) is created, deleted
 *     or has its mtime changed.
 * One child per module, so a failure names the module that caused it.
 *
 * POPULATION: every scripts/*.mjs and scripts/lib/*.mjs file except *.test.mjs (reverify.test.mjs
 * is a test runner and runs on import by design). The child is started with `node --input-type=module
 * -e`, so process.argv[1] is undefined and no module can mistake the importer for its own entry.
 *
 * BLIND TO, stated: a file change that leaves its size and mtime unchanged, or is undone before the
 * import returns (a write then a restore); directories, symlinks and permission bits; listeners or
 * timers that leave no end state; side effects that land outside the repository root (os.tmpdir, the network
 * through anything but global fetch, child processes that outlive the import); a module whose
 * top level does something only for some argv or env; files under tmp/ (other processes on this
 * machine write there constantly, so a change there would be noise); a concurrent writer inside
 * the repo during the run, which would read as a false failure, never a false pass; and modules
 * outside scripts/ (search/27b is not covered).
 *
 * Usage:
 *   node scripts/check-import-inert.mjs             # check every module; exit 1 on any failure
 *   node scripts/check-import-inert.mjs --selftest  # prove each failure kind fires on fixtures
 */
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtempSync, readdirSync, rmSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isEntryModule } from "./lib/entry-module.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// KNOWN NOT INERT, measured by this check's first full run on 2026-11-06: 16 of 48 modules acted
// on import (printed, exited, wrote ledger/claims.json, README.md, docs/gap-table.json or
// continuity/traffic.json, called fetch, or hung past the timeout; gates.mjs would start the whole
// verify gate on a clean tree). They are NOT imported here, because importing them has exactly
// those side effects. This list may only SHRINK: guard a module, delete its line, and this check
// then holds it inert. A module added to this list is a visible diff for review to refuse; a
// listed path that no longer exists fails the run. What the code does NOT catch (Codex r1,
// 2026-11-06): a listed module that has since been fixed but left on the list stays skipped and
// green. "May only shrink" is a review rule, and A-98's read is what finds a fixed module. Tracked as A-98.
export const KNOWN_NOT_INERT = Object.freeze([
  "scripts/anthropic-formal-math.mjs",
  "scripts/catch-rate.mjs",
  "scripts/check-brief.mjs",
  "scripts/check-next-primer.mjs",
  "scripts/check-orphan-shas.mjs",
  "scripts/check-resolvability.mjs",
  "scripts/check-self-attribution.mjs",
  "scripts/citation-footprint.mjs",
  "scripts/eth-openalex-frame.mjs",
  "scripts/extract-pins.mjs",
  "scripts/gap-table.mjs",
  "scripts/gates.mjs",
  "scripts/history-sweep.mjs",
  "scripts/render-state-block.mjs",
  "scripts/sky.mjs",
  "scripts/traffic-snapshot.mjs",
]);
// A per-run random marker, so a module cannot print the marker itself and then exit.
const SENTINEL = `IMPORT-INERT-${randomBytes(8).toString("hex")}`;
const SKIP_DIRS = new Set([".git", "node_modules", "tmp"]);

/** Every module this check imports, as absolute paths, in a stable order. */
export function modulesUnder(scriptsDir) {
  const out = [];
  for (const sub of ["", "lib"]) {
    const dir = join(scriptsDir, sub);
    let names = [];
    try { names = readdirSync(dir); } catch { continue; }
    for (const n of names.sort()) {
      if (n.endsWith(".mjs") && !n.endsWith(".test.mjs")) out.push(join(dir, n));
    }
  }
  return out;
}

/** path -> mtimeMs for every regular file under root, skipping SKIP_DIRS at any depth. */
export function snapshot(root) {
  const map = new Map();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name)); continue; }
      if (!e.isFile()) continue;
      const p = join(dir, e.name);
      try { const s = statSync(p); map.set(relative(root, p), `${s.mtimeMs}:${s.size}`); } catch { /* vanished mid-walk */ }
    }
  };
  walk(root);
  return map;
}

export function diffSnapshots(before, after) {
  const changes = [];
  for (const [p, m] of after) {
    if (!before.has(p)) changes.push(`created ${p}`);
    else if (before.get(p) !== m) changes.push(`modified ${p}`);
  }
  for (const p of before.keys()) if (!after.has(p)) changes.push(`deleted ${p}`);
  return changes;
}

// The fetch stub COUNTS calls as well as throwing, so a module that catches the throw
// (`try { await fetch(u) } catch {}`) still fails: the count rides out on the marker line.
const childSource = (sentinel) => `let fetchCalls = 0;
globalThis.fetch = () => { fetchCalls++; throw new Error("IMPORT-INERT: fetch called during import"); };
await import(process.env.IMPORT_INERT_TARGET);
process.stdout.write(${JSON.stringify(sentinel)} + ":" + fetchCalls);`;

/** Import one module in a fresh child; return the list of reasons it was not inert ([] = inert). */
export function checkModule(file, root) {
  const before = snapshot(root);
  const r = spawnSync(process.execPath, ["--input-type=module", "-e", childSource(SENTINEL)], {
    cwd: root,
    env: { ...process.env, IMPORT_INERT_TARGET: pathToFileURL(file).href },
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    timeout: 60_000,
  });
  const after = snapshot(root);
  const reasons = [];
  if (r.error) reasons.push(`child did not run: ${r.error.code || r.error.message}`);
  const stdout = r.stdout ?? "";
  // Any byte counts, whitespace included: the property is "nothing printed", not "nothing visible".
  const m = stdout.match(new RegExp(`${SENTINEL}:(\\d+)$`));
  const reached = m !== null;
  const printed = reached ? stdout.slice(0, m.index) : stdout;
  if (printed.length) reasons.push(`printed to stdout on import: ${JSON.stringify(printed.slice(0, 160))}`);
  if ((r.stderr ?? "").length) reasons.push(`printed to stderr on import: ${JSON.stringify(r.stderr.slice(0, 160))}`);
  if (!reached) reasons.push(`never reached the line after the import (exit ${r.status}${r.signal ? `, signal ${r.signal}` : ""}): it exited, threw, or hung on import`);
  if (reached && Number(m[1]) > 0) reasons.push(`called fetch ${m[1]} time(s) during import (the throw was caught)`);
  // A module can set process.exitCode and still let the marker print; the exit status is checked too.
  if (reached && r.status !== 0) reasons.push(`exited ${r.status} after the import returned (process.exitCode set on import)`);
  for (const c of diffSnapshots(before, after)) reasons.push(`${c} during import`);
  return reasons;
}

const posix = (p) => p.replace(/\\/g, "/");

/**
 * Check every module except the known-not-inert ones. A known path that is not in the population
 * is itself a failure (`missingKnown`), so a renamed or deleted module cannot linger on the list.
 */
export function checkAll(scriptsDir, root, known = []) {
  const files = modulesUnder(scriptsDir);
  const rel = files.map((f) => posix(relative(root, f)));
  const knownSet = new Set(known);
  const missingKnown = known.filter((k) => !rel.includes(k));
  const results = [];
  const skipped = [];
  files.forEach((file, i) => {
    if (knownSet.has(rel[i])) { skipped.push(rel[i]); return; }
    results.push({ file: rel[i], reasons: checkModule(file, root) });
  });
  return { results, skipped, missingKnown };
}

/** The whole command: check, print, and return the exit code the CLI exits with. */
export function run(scriptsDir, root, known) {
  return report(checkAll(scriptsDir, root, known)) ? 1 : 0;
}

function report({ results, skipped, missingKnown }) {
  const bad = results.filter((r) => r.reasons.length);
  for (const r of bad) {
    console.log(`NOT INERT  ${r.file}`);
    for (const why of r.reasons) console.log(`           ${why}`);
  }
  for (const k of missingKnown) console.log(`STALE LIST ${k} is on KNOWN_NOT_INERT but is not a module under scripts/ — delete its line`);
  console.log(`${results.length - bad.length} of ${results.length} checked module(s) under scripts/ and scripts/lib/ are inert on import; ${skipped.length} known-not-inert module(s) were not imported (KNOWN_NOT_INERT, A-98).`);
  return bad.length + missingKnown.length;
}

async function selftest() {
  const assert = (await import("node:assert/strict")).default;
  const fx = mkdtempSync(join(tmpdir(), "import-inert-"));
  try {
    const scripts = join(fx, "scripts");
    mkdirSync(join(scripts, "lib"), { recursive: true });
    // An inert module with a real main guard, written the way this repo's scripts are.
    writeFileSync(join(scripts, "good.mjs"),
      `import { pathToFileURL } from "node:url";\nexport const x = 1;\nif (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) console.log("ran");\n`);
    writeFileSync(join(scripts, "lib", "goodlib.mjs"), `export const y = 2;\n`);
    writeFileSync(join(scripts, "prints.mjs"), `console.log("summary: 3 rows");\n`);
    writeFileSync(join(scripts, "warns.mjs"), `console.error("warning");\n`);
    writeFileSync(join(scripts, "exits.mjs"), `process.exit(0);\n`);
    writeFileSync(join(scripts, "fetches.mjs"), `await fetch("https://example.invalid/");\n`);
    writeFileSync(join(scripts, "writes.mjs"), `import { writeFileSync } from "node:fs";\nwriteFileSync(new URL("../out.txt", import.meta.url), "x");\n`);
    writeFileSync(join(scripts, "touches.mjs"), `import { utimesSync } from "node:fs";\nconst t = new Date(Date.now() + 5000);\nutimesSync(new URL("./good.mjs", import.meta.url), t, t);\n`);
    // Codex r1 (2026-11-06): three shapes the first version read as inert.
    writeFileSync(join(scripts, "caughtfetch.mjs"), `try { await fetch("https://example.invalid/"); } catch {}\n`);
    writeFileSync(join(scripts, "exitcode.mjs"), `process.exitCode = 1;\n`);
    writeFileSync(join(scripts, "blank.mjs"), `console.log("");\n`);
    writeFileSync(join(scripts, "skipped.test.mjs"), `console.log("a test runner runs on import by design");\n`);

    const { results } = checkAll(scripts, fx);
    const by = Object.fromEntries(results.map((r) => [r.file, r.reasons]));

    // Population: *.test.mjs excluded, lib/ included, and the run is non-empty.
    assert.ok(results.length > 0, "positive control: the population must be non-empty");
    assert.ok(!("scripts/skipped.test.mjs" in by), "*.test.mjs must be excluded");
    assert.ok("scripts/lib/goodlib.mjs" in by, "scripts/lib/ must be included");

    // SILENT on the inert modules (both answers: these must pass while the others fail).
    assert.deepEqual(by["scripts/good.mjs"], [], "a guarded module must read inert");
    assert.deepEqual(by["scripts/lib/goodlib.mjs"], [], "a plain library must read inert");

    // FIRES on each failure kind, each naming its own property.
    assert.ok(by["scripts/prints.mjs"].some((r) => r.startsWith("printed to stdout")), "stdout on import must fail");
    assert.ok(by["scripts/warns.mjs"].some((r) => r.startsWith("printed to stderr")), "stderr on import must fail");
    assert.ok(by["scripts/exits.mjs"].some((r) => r.startsWith("never reached")), "process.exit on import must fail");
    assert.ok(by["scripts/fetches.mjs"].some((r) => r.startsWith("never reached")), "fetch on import must fail");
    assert.ok(by["scripts/writes.mjs"].some((r) => r === "created out.txt during import"), "a file written on import must fail");
    assert.ok(by["scripts/touches.mjs"].some((r) => r.replace(/\\/g, "/") === "modified scripts/good.mjs during import"), "an mtime changed on import must fail");

    assert.ok(by["scripts/caughtfetch.mjs"].some((r) => r.startsWith("called fetch 1 time(s)")), "a fetch whose throw is caught must still fail");
    assert.ok(by["scripts/exitcode.mjs"].some((r) => r.startsWith("exited 1 after the import")), "process.exitCode set on import must fail");
    assert.ok(by["scripts/blank.mjs"].some((r) => r.startsWith("printed to stdout")), "a blank line printed on import must fail");

    // THE WHOLE COMMAND'S EXIT CODE, both answers (Codex r1: the reasons were tested, the exit was not).
    const bad = ["caughtfetch", "exitcode", "blank", "prints", "warns", "exits", "fetches", "writes", "touches"].map((n) => `scripts/${n}.mjs`);
    assert.equal(run(scripts, fx, bad.filter((p) => p !== "scripts/prints.mjs")), 1, "one non-inert unlisted module must make the command exit 1");
    assert.equal(run(scripts, fx, bad), 0, "with every non-inert module listed the command must exit 0");

    // THE KNOWN LIST: a listed module is not imported (its side effect never runs), an unlisted one
    // still is, and a listed path that does not exist is reported so the list cannot go stale.
    const k = checkAll(scripts, fx, ["scripts/writes.mjs", "scripts/gone.mjs"]);
    assert.ok(k.skipped.includes("scripts/writes.mjs"), "a known module must be skipped");
    assert.ok(!k.results.some((r) => r.file === "scripts/writes.mjs"), "a known module must not be imported");
    assert.ok(k.results.some((r) => r.file === "scripts/prints.mjs" && r.reasons.length), "an unlisted module must still be checked");
    assert.deepEqual(k.missingKnown, ["scripts/gone.mjs"], "a listed path that is not a module must be reported");
    for (const p of KNOWN_NOT_INERT) assert.match(p, /^scripts\/[^/]+\.mjs$/, `KNOWN_NOT_INERT entries are posix paths under scripts/: ${p}`);

    console.log("check-import-inert selftest: PASS (an inert guarded module and a plain library read inert; stdout, stderr, process.exit, a fetch, a created file and a changed mtime on import each fail and name their own property, and so do a caught fetch, a process.exitCode and a blank line; the command exits 1 with one unlisted non-inert module and 0 with all of them listed; *.test.mjs is excluded and scripts/lib/ is included)");
  } finally {
    rmSync(fx, { recursive: true, force: true });
  }
}

if (isEntryModule(import.meta.url)) {
  if (process.argv.includes("--selftest")) {
    await selftest();
  } else if (process.argv.length > 2) {
    console.error(`usage: node scripts/check-import-inert.mjs [--selftest]`);
    process.exit(2);
  } else {
    process.exit(run(join(ROOT, "scripts"), ROOT, KNOWN_NOT_INERT));
  }
}
