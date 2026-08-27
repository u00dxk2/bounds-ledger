#!/usr/bin/env node
// check-self-attribution — a self-attributed CAUSE carries its control on the same line.
//
// WHY THIS EXISTS. On 2026-08-17 this lane wrote "two dispatches inside ten minutes tripped
// raw.githubusercontent.com secondary rate limiting" into a finding, a commit body, an item note
// and two issue comments. It was false — GitHub was in a critical outage — and three pieces of
// disconfirming evidence were already in hand. The repo's rule ("a cause you find flattering to
// admit still needs a positive control") existed and did not fire, twice more on 2026-08-27.
// A rule that has missed three times has lost its reader, so this moves the control from a
// discipline note to the line where the claim is written.
//
// SELF-BLAME FEELS LIKE RIGOUR AND IS JUST ANOTHER UNVERIFIED ATTRIBUTION — and it is the more
// dangerous kind, because nobody challenges you for blaming yourself. That asymmetry is the whole
// argument for gating this shape and not the symmetric "upstream broke it" shape.
//
// WHAT IT DEMANDS. A flagged line carries `control:` followed by the command or observation that
// would show the cause is NOT ours. Naming what WOULD have disconfirmed you is the work; the
// linter only checks you did it.
//
// THE TRIGGER LIST IS MEASURED, NOT GUESSED (2026-08-27). Grepping every daily report and finding
// in this repo for the candidate list returned 6 lines. `exhausted` produced the only false
// positives (2/6 — search-space and quota senses, no blame), so it is NOT in the list. The
// remaining terms fire on exactly the three real self-attributions in the corpus and nothing else:
// 2026-08-02 "a self-inflicted defect", 2026-08-17 "I caused the rate limit", 2026-08-26 a page
// shipped "clobbered". A trigger that matched every line would have passed every gate this repo
// runs while discriminating nothing — the 2026-08-23 premise-check lesson.
//
// DELIBERATELY NOT A DETECTOR OF DETECTORS. It reads prose for one phrase class. It cannot know
// whether the named control is a good one, and it does not try; that judgment stays W-7's.

import { readFileSync } from "node:fs";

/** Self-attributed cause. Measured against this repo's corpus — see the header before adding one. */
const CAUSE = /\b(tripped|self-inflicted|my fault|our fault|clobbered|i caused|we caused|of (?:my|our) own making)\b/i;
/** The control clause. `control:` is the token; what follows is the author's to defend. */
const CONTROL = /\bcontrol:/i;

/** @returns {{line:number, text:string, term:string}[]} */
export function findUncontrolled(text) {
  const out = [];
  const lines = String(text ?? "").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(CAUSE);
    if (!m || CONTROL.test(lines[i])) continue;
    out.push({ line: i + 1, text: lines[i].trim().slice(0, 120), term: m[1] });
  }
  return out;
}

function selftest() {
  const eq = (name, got, want) => {
    const ok = JSON.stringify(got) === JSON.stringify(want);
    console.log(`  ${ok ? "ok  " : "FAIL"} ${name}${ok ? "" : ` — got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
    if (!ok) process.exitCode = 1;
  };

  // FIRES — the real 2026-08-17 sentence, verbatim in shape.
  const real = "Two dispatches inside ten minutes tripped raw.githubusercontent.com rate limiting.";
  eq("fires on the 08-17 sentence", findUncontrolled(real).length, 1);
  eq("names the term it matched", findUncontrolled(real)[0].term.toLowerCase(), "tripped");

  // SILENT — the same sentence once a control is named. This is the pass the rule wants.
  eq("silent once a control is on the line", findUncontrolled(real.slice(0, -1) + " — control: githubstatus.com incident API for the window.").length, 0);

  // SILENT — the measured false positives that kept `exhausted` off the list.
  eq("silent on search-space exhaustion", findUncontrolled("Round four exhausted the edge budget before n=11.").length, 0);
  eq("silent on quota exhaustion", findUncontrolled("The UT workspace reported pipeline_minutes_exhausted.").length, 0);

  // SILENT — ordinary prose, including blame pointed AWAY from us (the asymmetry is deliberate).
  eq("silent on upstream-blame", findUncontrolled("Upstream rewrote the paragraph three times in one hour.").length, 0);
  eq("silent on an empty body", findUncontrolled("").length, 0);
  eq("silent on a plain drift line", findUncontrolled("2 file(s) drifted. Re-verify against primary sources.").length, 0);

  // FIRES — every remaining trigger term, so none is decorative.
  for (const [term, line] of [
    ["self-inflicted", "A self-inflicted defect, found and closed."],
    ["clobbered", "784e4f4 shipped index.html with its first 45 bytes clobbered."],
    ["I caused", "This section originally opened \"I caused the rate limit\"."],
    ["our fault", "The stale page was our fault."],
    ["of my own making", "The conflict was of my own making."],
  ]) eq(`fires on ${term}`, findUncontrolled(line).length, 1);

  // Multi-line: one flagged line among clean ones, reported once at the right number.
  const doc = "clean line\nWe caused the outage.\nanother clean line";
  eq("reports the right line number", findUncontrolled(doc).map((f) => f.line), [2]);

  console.log(process.exitCode ? "self-attribution selftest: FAIL" : "self-attribution selftest: PASS (fires on all 6 trigger terms and on the real 08-17 sentence; silent once a control is named, on both measured false positives, on upstream-blame, on an empty body and on a plain drift line)");
  return process.exitCode ? 1 : 0;
}

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log("check-self-attribution — a self-attributed CAUSE carries `control:` on the same line.\n" +
    "  <file>...    files to scan (daily reports, findings, a commit body)\n" +
    "  --selftest   both-polarity check\n" +
    "Exit: 0 clean · 1 finding(s) · 2 usage.");
  process.exit(0);
}
if (args.includes("--selftest")) process.exit(selftest());

const files = args.filter((a) => !a.startsWith("--"));
if (!files.length) {
  console.error("check-self-attribution: no files given (pass paths, or --selftest). Exit 2.");
  process.exit(2);
}

let total = 0;
for (const f of files) {
  let text;
  try { text = readFileSync(f, "utf8"); } catch (e) { console.error(`  UNREADABLE ${f}: ${e.code}`); process.exit(2); }
  for (const hit of findUncontrolled(text)) {
    total++;
    console.log(`  [self-attribution] ${f}:${hit.line} — "${hit.term}" with no control on the line`);
    console.log(`      ${hit.text}`);
    console.log("      Add `control: <command or observation that would show the cause is NOT ours>`.");
  }
}
console.log(total
  ? `RESULT: FAIL — ${total} self-attributed cause(s) with no control (exit 1)`
  : `RESULT: PASS — ${files.length} file(s), every self-attributed cause carries its control (exit 0)`);
process.exit(total ? 1 : 0);
