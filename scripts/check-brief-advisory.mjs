// check-brief-advisory.mjs — run the brief check, REPORT it always, and let only the
// UNVERIFIABLE verdict be excluded from the caller's exit code.
//
// WHY THIS EXISTS (A-41, decided 2026-09-08). On 2026-09-04 sign-in on /t/* went
// Google-session-only (skylark-site S-20260904-25) and the cc_pin cookie was retired, so an
// x-cc-pin header no longer signs anybody in. check-brief.mjs therefore returns 3 BRIEF
// UNVERIFIABLE on every run, forever, with no repo-side change that can make it pass — and it
// is the LAST link in `npm run check`'s && chain, so that command's exit code became a
// constant 3 for us and for every visitor who follows the README.
//
// A permanently-red alarm is this lane's FOUNDING DEFECT: an alarm that cannot go quiet
// carries no information, and the next real failure of `npm run check` lands on somebody who
// has learned that exit 3 is just the brief.
//
// THE PRECEDENT IS THE manual: true CLAIMS. C-7 and C-9 are pinned to a source that blocks
// automated fetch; they report UNVERIFIED, are never green, and never touch counts or the
// exit code. This wrapper puts the brief leg in exactly that position.
//
// WHAT THIS DOES NOT DO, because it is the tempting shortcut and it is forbidden: it does not
// make check-brief.mjs exit 0, and it does not swallow a real finding. `node
// scripts/check-brief.mjs` still exits 3 on the wall — its verdict is unchanged and honest.
// Only the UNVERIFIABLE code is decoupled from the gate, and every other code passes straight
// through:
//
//   check-brief exit 0  (brief in sync)      -> 0
//   check-brief exit 1  (BRIEF STALE)        -> 1   <- the real finding STILL REDS THE GATE
//   check-brief exit 2  (crashed)            -> 2
//   check-brief exit 3  (BRIEF UNVERIFIABLE) -> 0   <- reported, never green, never counted
//
// Exit 1 is the case note4 of A-41 protects: check-brief exists because the hosted brief
// drifted from its source and hand-checks under-reported it (7/30 and 7/31 — a hand-check
// found ONE missing block each time, the script derived TWO, stale since 26 July). Excluding
// staleness would delete the only automated read of this lane's one David-facing surface. It
// is not excluded here.
//
// NOT READ THROUGH A PIPE. spawnSync's .status IS the child's real exit code; there is no
// shell, no pipeline, and no `| tee` whose 0 could win. Reading an exit code through a pipe is
// the defect that made this repo's alarm fake for its first two days, and a wrapper whose
// whole job is exit codes is the last place to reintroduce it.
//
// KEYED ON THE CODE, NOT ON THE OUTPUT. The UNVERIFIABLE branch is the only `return { code: 3 }`
// in check-brief.mjs, so the code identifies the verdict exactly. Pattern-matching the prose
// would couple this to wording that is free to change.

import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { realpathSync, writeFileSync, mkdtempSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECK_BRIEF = join(HERE, "check-brief.mjs");

const UNVERIFIABLE = 3;

// Run check-brief.mjs and return its REAL exit code. stdio is inherited, so its output reaches
// the reader unchanged and unbuffered — "reported" is not negotiable, only "counted" is.
export function runBrief(extraArgs = [], opts = {}) {
  const res = spawnSync(process.execPath, [CHECK_BRIEF, ...extraArgs], {
    stdio: opts.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
  });
  if (res.error) return { code: 2, stdout: "", stderr: String(res.error.message) };
  return {
    code: res.status === null ? 2 : res.status,
    stdout: res.stdout || "",
    stderr: res.stderr || "",
  };
}

// The whole policy, isolated so the selftest can exercise it without a subprocess.
export function gateCode(briefCode) {
  return briefCode === UNVERIFIABLE ? 0 : briefCode;
}

// THE RECEIPT COULD NOT SEE THIS LEG AT ALL. `tmp/.verify-receipt.json` carries a
// `resultVerdicts` slot per gate, and this leg's was `null` on every run while
// `check:deferrals` filled its own with `PASS`. The fleet writer populates that slot from a
// `RESULT: <VERDICT> ... (exit N)` line in a step's output (skylark-site's
// `src/lib/cc-verify-receipt.mjs`, RESULT_LINE_RE) and this script printed no such line, so a
// mapped 3 and a genuine 0 were byte-identical in the artifact the cold-start banner tells the
// next reader to trust — "read failedGates, never infer it". That banner also says a 0 from
// check-brief.mjs means the auth model changed and A-41 reopens, which is a transition the
// receipt was structurally unable to show. This function closes that, and closes ONLY that.
//
// IT DOES NOT TOUCH THE EXCLUSION. `gateCode` is unchanged and `main`'s return values are
// unchanged; the process gains one line of stdout and nothing else. The exclusion stays exactly
// one exit code wide.
//
// THE EXIT NUMBER IN THE LINE IS `gateCode(briefCode)`, NEVER the child's code. The fleet
// parser flags a contradiction when the number on the RESULT line differs from the process's
// real exit, so on the UNVERIFIABLE branch the honest line reads `(exit 0)` — the process really
// does exit 0 — while the VERDICT TOKEN carries the fact that nothing was verified. The token is
// deliberately not PASS: the parser treats PASS/GREEN/CLEAN as a pass verdict, and laundering an
// unverifiable into one is the exact thing A-41 refused.
export function resultLine(briefCode) {
  const exit = gateCode(briefCode);
  if (briefCode === UNVERIFIABLE) {
    return `RESULT: UNVERIFIABLE — the brief was never read, so it is neither stale nor in sync; excluded from this gate's exit code per A-41, reported every run and never counted as a pass (exit ${exit})`;
  }
  if (briefCode === 0) {
    return `RESULT: PASS — the hosted brief matches docs/lane-brief.md (exit ${exit})`;
  }
  if (briefCode === 1) {
    return `RESULT: FAIL — the hosted brief is STALE against docs/lane-brief.md, and a stale brief still reds this gate (exit ${exit})`;
  }
  return `RESULT: COULD_NOT_RUN — check-brief.mjs exited ${briefCode}, which is neither a verdict nor unreachability (exit ${exit})`;
}

function main(argv) {
  const { code } = runBrief(argv);
  if (code === UNVERIFIABLE) {
    console.log("");
    console.log("check:brief — ADVISORY, not counted toward this gate's exit code (A-41).");
    console.log("  The verdict above stands: the brief could not be verified, and UNVERIFIABLE");
    console.log("  is not a pass. It is excluded from the exit code the same way the manual:true");
    console.log("  claims C-7 and C-9 are — reported every run, never green, never counted.");
    console.log("  A stale brief (exit 1) still fails this gate. Only unreachability is excused.");
    console.log("  Re-check the premise: node scripts/check-brief.mjs — a 0 means the auth model");
    console.log("  changed and A-41 should be reopened.");
    console.log(resultLine(code));
    return 0;
  }
  console.log(resultLine(code));
  return code;
}

// Both polarities, per KP-78 and A-41's closeWhen, which names them explicitly: "a stale brief
// still prints its finding; an unreachable brief no longer reds the gate". Both cases drive the
// REAL check-brief.mjs through --page-file rather than a retyped copy of its logic — a retyped
// copy tests the retyping (the 2026-08-18 lesson).
function selftest() {
  const dir = mkdtempSync(join(tmpdir(), "brief-advisory-"));

  // The fixtures are built from the LIVE source doc, and the in-sync one is simply the SOURCE
  // ITSELF served as the page. That derives nothing: whatever check-brief.mjs's parser decides
  // a dated block is, the source necessarily contains it. An earlier draft of this selftest
  // synthesised `<h2>Update — <date></h2>` headers from a regex of my own, which produced
  // "5 of 5 dated blocks missing" — the parser also requires each header's PROSE. The positive
  // control below caught that, which is the entire reason it is written first.
  const SRC = join(HERE, "..", "docs", "lane-brief.md");
  let md;
  try {
    md = readFileSync(SRC, "utf8");
  } catch (e) {
    console.error(`check-brief-advisory selftest FAIL: cannot read ${SRC} — ${e.message}`);
    return 1;
  }
  const headerLines = md.split(/\r?\n/).filter((l) => /^>\s*#{2,3}\s*.*\d{1,2} \w+ \d{4}/.test(l));
  if (headerLines.length < 2) {
    console.error(
      `check-brief-advisory selftest FAIL: found ${headerLines.length} dated header line(s) in ` +
        `docs/lane-brief.md; need >=2 to build a stale fixture that drops exactly one`
    );
    return 1;
  }

  // POSITIVE CONTROL FIRST: the source served as the page must read in-sync at 0. Without it, a
  // fixture that matches nothing would make the stale case "fire" for the wrong reason and be
  // indistinguishable from the wall case.
  const syncedPath = join(dir, "synced.html");
  writeFileSync(syncedPath, md);
  const synced = runBrief(["--page-file", syncedPath], { capture: true });
  if (synced.code !== 0) {
    console.error(
      `check-brief-advisory selftest FAIL: positive control did not read in-sync — check-brief ` +
        `exited ${synced.code} on the source doc served as its own page.`
    );
    console.error(synced.stdout);
    return 1;
  }

  // (a) STALE — the page is real (title present) but ONE dated block is gone. check-brief must
  //     return 1 and the gate must STAY RED. This is the case that must never be excused.
  const dropped = headerLines[headerLines.length - 1];
  const staleMd = md.split(/\r?\n/).filter((l) => l !== dropped).join("\n");
  if (staleMd === md) {
    console.error("check-brief-advisory selftest FAIL: the stale mutation did not change the fixture");
    return 1;
  }
  const stalePath = join(dir, "stale.html");
  writeFileSync(stalePath, staleMd);
  const stale = runBrief(["--page-file", stalePath], { capture: true });
  if (stale.code !== 1) {
    console.error(
      `check-brief-advisory selftest FAIL: dropping one dated header did not produce BRIEF STALE ` +
        `(check-brief exited ${stale.code}, expected 1) — the mutation did not land, so the ` +
        `silence of the next case would prove nothing.`
    );
    console.error(stale.stdout);
    return 1;
  }
  // Exactly one block missing — proves the mutation removed what it meant to and nothing else.
  if (!new RegExp(`BRIEF STALE — 1 of ${headerLines.length} dated block`).test(stale.stdout)) {
    console.error(
      `check-brief-advisory selftest FAIL: expected exactly 1 of ${headerLines.length} blocks ` +
        `missing; the mutation removed more or less than the one header it dropped.`
    );
    console.error(stale.stdout);
    return 1;
  }
  if (!/BRIEF STALE/.test(stale.stdout)) {
    console.error("check-brief-advisory selftest FAIL: exit 1 without a BRIEF STALE finding in the output");
    return 1;
  }
  if (gateCode(stale.code) !== 1) {
    console.error(
      `check-brief-advisory selftest FAIL: a STALE brief was excused — gateCode(1) returned ` +
        `${gateCode(stale.code)}. This is the regression A-41 note4 exists to prevent.`
    );
    return 1;
  }

  // (b) UNVERIFIABLE — a sign-in wall. check-brief must return 3 and the gate must go quiet,
  //     while the finding is still printed.
  const wallPath = join(dir, "wall.html");
  writeFileSync(wallPath, `<h1>Sign in</h1><p>Sign in to Skylark Creations to continue.</p>`);
  const wall = runBrief(["--page-file", wallPath], { capture: true });
  if (wall.code !== UNVERIFIABLE) {
    console.error(
      `check-brief-advisory selftest FAIL: the wall fixture exited ${wall.code}, expected ${UNVERIFIABLE}`
    );
    console.error(wall.stdout);
    return 1;
  }
  if (!/BRIEF UNVERIFIABLE/.test(wall.stdout)) {
    console.error("check-brief-advisory selftest FAIL: exit 3 without a BRIEF UNVERIFIABLE finding in the output");
    return 1;
  }
  if (gateCode(wall.code) !== 0) {
    console.error(`check-brief-advisory selftest FAIL: gateCode(3) returned ${gateCode(wall.code)}, expected 0`);
    return 1;
  }

  // The exclusion must be EXACTLY one code wide. A wrapper that excused 1 or 2 as well would
  // pass both cases above and still blind the gate.
  for (const c of [0, 1, 2, 4]) {
    if (gateCode(c) !== c) {
      console.error(`check-brief-advisory selftest FAIL: gateCode(${c}) returned ${gateCode(c)} — the exclusion is wider than exit 3`);
      return 1;
    }
  }

  // THE RESULT LINE, asserted against the REAL fleet regex rather than a retyped idea of it.
  // This copy is pinned by the assertion below: if skylark-site changes RESULT_LINE_RE, this
  // selftest keeps passing while the receipt slot silently goes null again — so the pin is
  // recorded as a known limit, not claimed as coupling.
  const FLEET_RESULT_RE = /^\s*(RESULT:\s+([A-Z][A-Z0-9_-]*)\b.*\(exit\s+(-?\d+)\)\s*)$/i;

  // ORDER IS DELIBERATE — the guards that carry the MEANING run first and the exact-string pin
  // runs LAST. With the pin first, every mutation trips the pin and short-circuits, and these
  // three properties become dead code inside the commit that adds them (2026-09-06).
  for (const c of [0, 1, 2, 3, 4]) {
    const line = resultLine(c);
    const m = line.match(FLEET_RESULT_RE);

    // (1) The line must be PARSEABLE. An unparseable line leaves the slot null, which is the
    // exact defect being fixed — a line that merely looks right fixes nothing.
    if (!m) {
      console.error(`check-brief-advisory selftest FAIL: resultLine(${c}) does not match the fleet RESULT_LINE_RE — the receipt slot would stay null: ${line}`);
      return 1;
    }

    // (2) The exit number must be the PROCESS's exit, not the child's. A mismatch is flagged by
    // the fleet writer as a contradiction between the verdict and the real exit.
    if (Number(m[3]) !== gateCode(c)) {
      console.error(`check-brief-advisory selftest FAIL: resultLine(${c}) says (exit ${m[3]}) but the process exits ${gateCode(c)} — that is a receipt contradiction`);
      return 1;
    }

    // (3) THE ONE THAT MATTERS. On the excused branch the verdict token must NOT be one the
    // fleet writer reads as a pass. This is the laundering A-41 refused, and it is the assertion
    // that would survive if someone "simplified" the excused branch to RESULT: PASS.
    if (c === UNVERIFIABLE && ["PASS", "GREEN", "CLEAN"].includes(m[2].toUpperCase())) {
      console.error(`check-brief-advisory selftest FAIL: the UNVERIFIABLE branch reports verdict ${m[2]}, which the fleet writer reads as a PASS — an unverifiable leg must never launder into one`);
      return 1;
    }
  }

  // LAST: the equality pin, so a wording change is caught but never masks the three above.
  const WALL_LINE = "RESULT: UNVERIFIABLE — the brief was never read, so it is neither stale nor in sync; excluded from this gate's exit code per A-41, reported every run and never counted as a pass (exit 0)";
  if (resultLine(UNVERIFIABLE) !== WALL_LINE) {
    console.error(`check-brief-advisory selftest FAIL: the UNVERIFIABLE result line changed wording:\n  got:  ${resultLine(UNVERIFIABLE)}\n  want: ${WALL_LINE}`);
    return 1;
  }

  console.log(
    "check-brief-advisory selftest: PASS (positive control reads in-sync at 0 before any absence " +
      "is asserted; a dropped dated block produces BRIEF STALE and STILL reds the gate; a sign-in " +
      "wall produces BRIEF UNVERIFIABLE, prints its finding, and does NOT red the gate; the " +
      "exclusion is exactly one exit code wide — 0/1/2/4 all pass through unchanged; and every " +
      "resultLine parses under the fleet RESULT_LINE_RE, carries the PROCESS exit rather than the " +
      "child's, and never reports the excused branch as a pass verdict)"
  );
  return 0;
}

// ENTRY-POINT GUARD — F2 from the PR #26 review. Without it, importing gateCode/runBrief to
// reuse the policy RUNS the check and can process.exit() out of the importer.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  const args = process.argv.slice(2);
  process.exitCode = args.includes("--selftest") ? selftest() : main(args);
}
