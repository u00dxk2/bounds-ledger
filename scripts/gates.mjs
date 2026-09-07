#!/usr/bin/env node
// vendored from skylark-site scripts/gates.mjs at d725cd73 (S-20260906-75) - sync by copy
// gates — the LANE-SIDE shim. Vendor this file plus scripts/lib/skylark-site-root.mjs
// into a lane and make its package.json read:  "gates": "node scripts/gates.mjs -- <your gate>"
// `node scripts/gates.mjs` resolves from the lane root AND from any linked worktree of it,
// which `node ../skylark-site/scripts/verify-with-receipt.mjs` does not (S-20260906-63).
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { resolveSkylarkSiteRoot, skylarkSiteRootRefusalLine } from "./lib/skylark-site-root.mjs";

if (process.argv.includes("--help")) {
  console.log(
    "gates — resolve the skylark-site checkout (git common dir, worktree-proof) and run\n" +
      "verify-with-receipt.mjs there, forwarding every argument and the TRUE exit code.\n" +
      "  node scripts/gates.mjs -- <gate command>   run that gate under the receipt writer\n" +
      "  node scripts/gates.mjs --read              inspect this lane's last receipt\n" +
      "Exit 2 = the skylark-site checkout could not be resolved (nothing ran, no receipt).",
  );
  process.exit(0);
}

const verdict = resolveSkylarkSiteRoot();
if (!verdict.ok) {
  console.error(skylarkSiteRootRefusalLine("gates", verdict));
  process.exit(2);
}
const wrapper = join(verdict.root, "scripts", "verify-with-receipt.mjs");
const run = spawnSync(process.execPath, [wrapper, ...process.argv.slice(2)], { stdio: "inherit" });
if (run.error) {
  console.error(`gates: NOT RUNNABLE — could not spawn ${wrapper} (${run.error.code ?? run.error.message}). Nothing ran; no receipt.`);
  process.exit(2);
}
process.exit(Number.isInteger(run.status) ? run.status : 2);
