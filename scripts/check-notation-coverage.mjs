// check-notation-coverage.mjs — does every LaTeX notation on the published page also carry the
// form a READER would type?
//
// WHY THIS IS A SCRIPT AND NOT A NOTE (2026-09-08). The gap it guards was found by hand today
// and fixed in df460f0: 28 of 115 rows carried a radical or a power reachable only by typing our
// LaTeX. The retro's first instinct was to file the lesson as a memory note. That is not a fix —
// a note tells tomorrow to remember something, and five lanes reported the same defect recurring
// immediately after its lesson was written down. This refuses instead.
//
// AND IT GUARDS THE MEASUREMENT, NOT ONLY THE PAGE — which is the actual lesson of the day.
// The first measurement of that gap ran inline through `node -e` and reported ZERO radical rows.
// The shell had collapsed the backslashes: "$1+\\sqrt{2}$" reached JS as $1+sqrt{2}$ and
// /\\sqrt/ became /\sqrt/, a regex that cannot match what it is hunting. A confident zero from a
// probe that could never have fired — and believing it would have shipped the power-only half
// while reporting 22 rows as clean, WITH a measurement behind the claim.
//
// So the control here is not "count the gaps". It is: PROVE THE PROBE CAN SEE THE NOTATION
// BEFORE REPORTING ANY ABSENCE. If neither pattern matches anywhere in the corpus, this exits 2
// as NOTHING SWEPT rather than printing a zero that reads exactly like success. A zero from a
// dead probe is indistinguishable from a measured one.
//
// exit 0 = every numeric radical/power carries its typed form · 1 = gaps found (they are listed)
//        · 2 = NOTHING SWEPT, the probe matched no notation at all, so it read nothing

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { realpathSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Digits-only, matching render-site.mjs's aliasing rules exactly. A non-numeric radical
// (\sqrt{\log n}) is deliberately NOT aliased there, so it must not be demanded here — a guard
// that asks for a form the renderer refuses to mint would be permanently red, which is this
// repo's founding defect.
const RADICAL = /\\sqrt\s*\{\s*(\d+)\s*\}/g;
const POWER = /(\d+)\s*\^\s*\{\s*(-?\d+)\s*\}/g;
// Presence patterns — deliberately looser than the digits-only ones above, so a corpus that has
// symbolic notation ONLY still proves the probe is looking at the right document.
const ANY_RADICAL = /\\sqrt/;
const ANY_POWER = /\d\s*\^\s*\{/;

export function rowsOf(html) {
  return [...html.matchAll(/<tr id="(c-[^"]+)"[^>]*data-find="([^"]*)"/g)].map((m) => ({
    id: m[1],
    hay: m[2],
  }));
}

export function gapsIn(rows) {
  const out = [];
  for (const { id, hay } of rows) {
    const missing = [];
    for (const m of hay.matchAll(RADICAL)) {
      if (!hay.includes(`sqrt(${m[1]})`)) missing.push(`sqrt(${m[1]})`);
    }
    for (const m of hay.matchAll(POWER)) {
      const typed = `${m[1]}^${m[2]}`;
      if (!hay.includes(typed)) missing.push(typed);
    }
    if (missing.length) out.push({ id, missing: [...new Set(missing)] });
  }
  return out;
}

// The control. Returns how many rows contain each notation AT ALL — the question that must be
// answered before any absence claim is allowed to mean anything.
export function control(rows) {
  return {
    radicalRows: rows.filter((r) => ANY_RADICAL.test(r.hay)).length,
    powerRows: rows.filter((r) => ANY_POWER.test(r.hay)).length,
  };
}

function run() {
  const html = readFileSync(join(ROOT, "index.html"), "utf8");
  const rows = rowsOf(html);
  const ctl = control(rows);

  console.log(`# Typed-notation coverage — ${new Date().toISOString()}`);
  console.log(`rows with a search haystack: ${rows.length}`);
  console.log(`POSITIVE CONTROL — rows containing a LaTeX radical at all: ${ctl.radicalRows}`);
  console.log(`POSITIVE CONTROL — rows containing a LaTeX power at all:   ${ctl.powerRows}`);

  if (rows.length === 0 || (ctl.radicalRows === 0 && ctl.powerRows === 0)) {
    console.log("");
    console.log("RESULT: NOTHING SWEPT — the probe matched no notation anywhere in the corpus, so a");
    console.log("  zero below would be a fact about the probe and not about the page. Exiting 2");
    console.log("  rather than printing a clean-looking zero. (2026-09-08: an inline version of this");
    console.log("  read reported 0 radical rows because the shell had eaten its backslashes.)");
    console.log("RESULT: NOTHING SWEPT (exit 2)");
    return 2;
  }

  const gaps = gapsIn(rows);
  console.log("");
  if (gaps.length) {
    console.log(`${gaps.length} row(s) carry notation a reader cannot type:`);
    for (const g of gaps) console.log(`   ${g.id} :: ${g.missing.join(", ")}`);
    console.log("");
    console.log("  Fix in scripts/render-site.mjs (radicalAliases / powerAliases), then re-render.");
    console.log(`RESULT: FAIL — ${gaps.length} row(s) with an un-typeable value (exit 1)`);
    return 1;
  }
  console.log(`RESULT: PASS — every numeric radical and power on ${rows.length} row(s) also carries the form a reader types (exit 0)`);
  return 0;
}

// KP-78: both answers, plus the control's own both answers — because the control is the part
// that actually failed today.
function selftest() {
  const ok = (c, m) => {
    if (!c) {
      console.error(`check-notation-coverage selftest FAIL: ${m}`);
      process.exitCode = 1;
      throw new Error(m);
    }
  };

  const withAlias = `<tr id="c-1" data-find="komlos $1+\\sqrt{2}$ sqrt(2) sqrt2"></tr>`;
  const withoutAlias = `<tr id="c-2" data-find="komlos $1+\\sqrt{2}$"></tr>`;
  const powerNoAlias = `<tr id="c-3" data-find="bloch $10^{-335}$"></tr>`;
  const symbolic = `<tr id="c-4" data-find="psi $c\\sqrt{\\log n}$"></tr>`;
  const noNotation = `<tr id="c-5" data-find="crouzeix $2$"></tr>`;

  // Control first: it must SEE the notation before any absence means anything.
  ok(control(rowsOf(withoutAlias)).radicalRows === 1, "control must count a row containing a radical");
  ok(control(rowsOf(noNotation)).radicalRows === 0, "control must count zero when no radical is present");
  ok(control(rowsOf(powerNoAlias)).powerRows === 1, "control must count a row containing a power");

  // FIRES on a real gap, both notations.
  ok(gapsIn(rowsOf(withoutAlias)).length === 1, "an un-aliased radical must be reported as a gap");
  ok(gapsIn(rowsOf(powerNoAlias))[0].missing[0] === "10^-335", "an un-aliased power must name the typed form, sign included");

  // SILENT when the alias is present, and silent on a SYMBOLIC radical — render-site refuses to
  // mint a form for \sqrt{\log n}, so demanding one here would make this permanently red.
  ok(gapsIn(rowsOf(withAlias)).length === 0, "a row carrying its typed alias must not be reported");
  ok(gapsIn(rowsOf(symbolic)).length === 0, "a NON-NUMERIC radical must not be demanded — render-site deliberately mints no alias for it");
  ok(gapsIn(rowsOf(noNotation)).length === 0, "a row with no notation contributes no gap");

  // The shape that started this: a haystack whose backslashes were destroyed must NOT read as a
  // clean page. It reads as NOTHING SWEPT via the control, never as zero gaps.
  const corrupted = `<tr id="c-6" data-find="komlos $1+sqrt{2}$"></tr>`;
  const c = control(rowsOf(corrupted));
  ok(c.radicalRows === 0 && c.powerRows === 0, "a corpus whose backslashes were eaten must fail the control, not pass the gap check");
  ok(gapsIn(rowsOf(corrupted)).length === 0, "and its gap count is 0 — which is exactly why the control, not this number, decides the verdict");

  console.log(
    "check-notation-coverage selftest: PASS (control counts notation present and absent; gaps fire " +
      "on an un-aliased radical and an un-aliased power naming the typed form; silent on an aliased " +
      "row, on a NON-NUMERIC radical render-site deliberately refuses to alias, and on a row with no " +
      "notation; and a corpus with its backslashes eaten fails the CONTROL while its gap count reads " +
      "a clean 0 — the case that makes the control load-bearing rather than decorative)"
  );
  return 0;
}

// ENTRY-POINT GUARD — importing this to reuse gapsIn/control must not run the check.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  process.exitCode = process.argv.includes("--selftest") ? selftest() : run();
}
