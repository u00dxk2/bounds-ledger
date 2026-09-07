// vendored from skylark-site scripts/lib/skylark-site-root.mjs at d725cd73 (S-20260906-75) - sync by copy
// skylark-site-root — WHERE is the skylark-site checkout, asked from any cwd.
//
// S-20260906-63 (2026-09-06). Every lane invokes the shared scripts as
// `node ../skylark-site/scripts/<x>.mjs`, which is correct from a lane ROOT and
// wrong from everywhere else. From a linked worktree (`<lane>/.claude/worktrees/
// <name>`) `../skylark-site` resolves to `<lane>/.claude/worktrees/skylark-site`,
// which does not exist — and the two ways out of that are both worse than this
// file: MODULE_NOT_FOUND misdiagnosed as a gate failure (frolic's hook prints
// "a staged file looks like it contains a credential" for it), or a `skylark-site`
// JUNCTION dropped beside the worktree, which makes the path resolve and then
// silently defeats every one of those scripts' main guards (see
// scripts/lib/entry-module.mjs — measured exit 0, no output, no receipt).
//
// The three rules are `scripts/lib/fleet-root.mjs`'s, mirrored deliberately:
//   1. Resolve from git's COMMON dir, never from `__dirname` or cwd — that is
//      the one path that is the same from the canonical checkout and from any
//      worktree of it.
//   2. A fallback is DISCLOSED on stderr. A silent one is the same bug wearing
//      a different hat.
//   3. A candidate that does not actually hold the marker file is NOT the
//      checkout: `ok:false` with a reason, and the caller REFUSES (exit 2)
//      rather than spawning something that is not there.
//
// Node builtins only, deliberately: lanes vendor this beside `scripts/gates.mjs`
// and a `src/lib` import would throw ERR_MODULE_NOT_FOUND in their tree.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

/** The checkout directory name. A rename would be a fleet-wide event; it is
 * named once here rather than spelled into every caller. */
export const SKYLARK_SITE_DIR = "skylark-site";

/** Presence of this file is what makes a directory the skylark-site checkout
 * rather than a directory that happens to be called that. */
export const DEFAULT_MARKER = join("scripts", "verify-with-receipt.mjs");

/**
 * git's common dir for `dir`, absolute. In a LINKED WORKTREE this is the MAIN
 * checkout's `.git`.
 * @param {string} dir
 * @returns {string|null} null = git absent, or `dir` is not inside a repo
 */
function gitCommonDir(dir) {
  try {
    const out = execFileSync("git", ["-C", dir, "rev-parse", "--path-format=absolute", "--git-common-dir"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    return out || null;
  } catch {
    return null; /* git absent or not a repo */
  }
}

/**
 * Resolve the skylark-site checkout.
 *
 * Order, and why: the repo whose worktree `cwd` sits in is found from git's
 * common dir, so a linked worktree answers with its MAIN checkout. If that
 * checkout IS skylark-site we are done (`how: "self"`); otherwise skylark-site
 * is its sibling (`how: "git-common-dir"`). Only when git cannot answer at all
 * does this fall back to `<cwd>/../skylark-site` — the pre-existing behaviour,
 * which is right from a lane root and wrong from a worktree — and it says so on
 * stderr.
 *
 * @param {{cwd?: string, marker?: string, disclose?: boolean, io?: {commonDir?: (d: string) => string|null, exists?: (p: string) => boolean, warn?: (s: string) => void}}} [opts]
 * @returns {{ok: boolean, root: string|null, how: "self"|"git-common-dir"|"cwd-fallback", searched: string[], reason: string}}
 */
export function resolveSkylarkSiteRoot({
  cwd = process.cwd(),
  marker = DEFAULT_MARKER,
  disclose = true,
  io = {},
} = {}) {
  const commonDir = (io.commonDir ?? gitCommonDir)(cwd);
  const exists = io.exists ?? existsSync;
  const warn = io.warn ?? ((s) => console.error(s));
  const searched = [];
  const holdsMarker = (dir) => {
    searched.push(dir);
    return exists(join(dir, marker));
  };

  if (commonDir) {
    const repoRoot = resolve(dirname(commonDir));
    if (basename(repoRoot).toLowerCase() === SKYLARK_SITE_DIR && holdsMarker(repoRoot)) {
      return { ok: true, root: repoRoot, how: "self", searched, reason: `this repo IS ${SKYLARK_SITE_DIR}` };
    }
    const sibling = join(dirname(repoRoot), SKYLARK_SITE_DIR);
    if (holdsMarker(sibling)) {
      return { ok: true, root: sibling, how: "git-common-dir", searched, reason: `sibling of ${repoRoot}, via git's common dir` };
    }
    return {
      ok: false,
      root: null,
      how: "git-common-dir",
      searched,
      reason: `no ${marker} under any candidate — git says this checkout's root is ${repoRoot}, so ${SKYLARK_SITE_DIR} should sit beside it`,
    };
  }

  const fallback = resolve(join(cwd, "..", SKYLARK_SITE_DIR));
  if (disclose) {
    warn(
      `skylark-site-root: git could not answer rev-parse --git-common-dir, so the checkout was guessed as ${fallback} ` +
        "(cwd/../skylark-site). That fallback is NOT worktree-proof — from a linked worktree it names a directory that does not exist.",
    );
  }
  if (holdsMarker(fallback)) {
    return { ok: true, root: fallback, how: "cwd-fallback", searched, reason: "git unreadable; cwd/../skylark-site holds the marker" };
  }
  return {
    ok: false,
    root: null,
    how: "cwd-fallback",
    searched,
    reason: `git could not answer, and the cwd-relative guess ${fallback} holds no ${marker}`,
  };
}

/**
 * The refusal line a caller prints when `resolveSkylarkSiteRoot` says no. One
 * place so every lane words it the same and a reader can grep for it.
 * @param {string} script
 * @param {{searched: string[], reason: string}} verdict
 * @returns {string}
 */
export function skylarkSiteRootRefusalLine(script, verdict) {
  const looked = (verdict?.searched ?? []).join(", ") || "(nothing)";
  return (
    `${script}: NOT RUNNABLE — the ${SKYLARK_SITE_DIR} checkout could not be resolved. ${verdict?.reason ?? "no reason recorded"}. ` +
    `Searched: ${looked}. Refusing rather than exiting 0 having run nothing (S-20260906-63).`
  );
}
