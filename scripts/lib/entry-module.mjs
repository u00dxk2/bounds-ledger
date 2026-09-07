// vendored from skylark-site scripts/lib/entry-module.mjs at d725cd73 (S-20260906-75) - sync by copy
// entry-module — "was THIS file the one node was asked to run?", junction-proof.
//
// S-20260906-63 (2026-09-06). The fleet-standard main guard is
//
//     if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) { … }
//
// and it is FALSE — silently, at exit 0, having run nothing — whenever the path
// the caller typed reaches the file through a directory JUNCTION or symlink.
// `import.meta.url` is the module's REALPATH (node resolves reparse points when
// it loads a module); `process.argv[1]` is the path AS GIVEN, only absolutised.
// Through a junction those two strings name the same file and do not match, so
// the module's top level runs, `main()` never does, and node exits 0 with no
// output at all.
//
// Measured on this machine 2026-09-06 (scratchpad repro, junction `linkdir` →
// `realdir`):
//     argv[1]     = …\fleet\linkdir\probe.mjs
//     import.meta = file:///…/fleet/realdir/probe.mjs
//     MAIN GUARD  = false          exit = 0
//
// Why it bit tonight: a lane's gates live at `node ../skylark-site/scripts/*.mjs`.
// From a linked worktree (`<lane>/.claude/worktrees/<name>`) that path does not
// exist, so builders created a `skylark-site` JUNCTION beside the worktree to
// make the hooks resolve — and every one of those scripts then no-opped at
// exit 0. 60 scripts in this repo carry the naive guard, so the workaround
// silently disarmed the whole `../skylark-site/scripts` battery. The junction is
// not the bug; the guard is.
//
// PRESENCE-only and FAIL-CLOSED: an unreadable path answers `false` (the module
// declines to be the entry point), which is the direction that can only fail to
// RUN, never fail to notice. Node builtins only — hooks and vendoring lanes
// import this, and a `src/lib` import throws ERR_MODULE_NOT_FOUND in their tree.
import { realpathSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Do two absolute filesystem paths name the same file, for a given platform?
 * Windows compares case-insensitively and treats `/` and `\` alike; POSIX does
 * neither. Exported so both polarities are unit-testable without a real junction.
 * @param {string} a
 * @param {string} b
 * @param {string} [platform]
 * @returns {boolean}
 */
export function samePathForPlatform(a, b, platform = process.platform) {
  if (typeof a !== "string" || typeof b !== "string" || !a || !b) return false;
  const norm = (p) => {
    const slashed = p.replace(/\\/g, "/").replace(/(.)\/+$/, "$1");
    return platform === "win32" ? slashed.toLowerCase() : slashed;
  };
  return norm(a) === norm(b);
}

/**
 * Is `importMetaUrl`'s module the script node was invoked with?
 *
 * The cheap string comparison is tried FIRST and is unchanged, so nothing about
 * the ordinary case moves. Only when it says NO does this resolve both sides to
 * their realpath — which is the case the old guard got wrong.
 *
 * @param {string} importMetaUrl the caller's `import.meta.url`
 * @param {{argv1?: unknown, realpath?: (p: string) => string, platform?: string}} [io]
 *   test seam: inject argv[1], a realpath reader, and the platform.
 * @returns {boolean}
 */
export function isEntryModule(importMetaUrl, { argv1 = process.argv[1], realpath = realpathSync, platform = process.platform } = {}) {
  const self = typeof importMetaUrl === "string" ? importMetaUrl : "";
  if (!self || typeof argv1 !== "string" || !argv1) return false;
  let argvHref = null;
  try {
    argvHref = pathToFileURL(argv1).href;
  } catch {
    return false; // an argv[1] that is not a path cannot be this module
  }
  if (self === argvHref) return true;
  try {
    return samePathForPlatform(realpath(fileURLToPath(self)), realpath(argv1), platform);
  } catch {
    // One of the two could not be resolved (deleted, permission, a mount that
    // vanished). Declining is the fail-closed answer: the module does not run
    // its main, exactly as it would not have before this file existed.
    return false;
  }
}
