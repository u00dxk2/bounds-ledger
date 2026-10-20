#!/usr/bin/env node
/**
 * check-audit-lines — A-85: fail when an upstream resnap moves an audited row off its recorded line.
 *
 * THE DEFECT IT CLOSES. The constant pages prove that an audit is about the row a reader sees by
 * finding the audited text at the audited line (`mirrorHas` in render-constant-pages.mjs). On
 * 2026-10-18 a resnap inserted rows above ten audited rows; their text was byte-identical, only
 * their line moved, and every one of them rendered as "checked on an earlier version of the table"
 * until repository commit 11f7861 re-pointed them by hand. `render-constant-pages --check` stayed
 * green the whole time, because it compares pages with the store, and a consistently stale page
 * passes. Nothing failed; a manager's question found it.
 *
 * WHAT IT DOES NOT DO: re-point anything. Searching the whole file is exactly what mirrorHas was
 * built to refuse (adversarial review round 2, 2026-09-13: a changed row whose OLD text survived
 * under a historical note would have been "found" elsewhere). So a text found on another line is
 * reported as a re-point that a person must make, never made here.
 *
 * For every value-vs-source entry in continuity/depth-audit.json, by the entry's trimmed rowText:
 *   AT        — the text is at rowLine. Fine.
 *   MOVED     — not at rowLine, and on exactly ONE other line of the same file. A re-point is owed
 *               and the pages are silently showing the verdict as historical. EXIT 1.
 *   CHANGED   — on no line of the file. The row changed; the verdict is historical by design and
 *               the renderer already says so. Reported, never fatal (it must not turn the check
 *               permanently red).
 *   AMBIGUOUS — not at rowLine, on two or more other lines. Cannot say which is the row, and the
 *               page shows the verdict as historical meanwhile, so a person must decide. EXIT 1
 *               (manager review of P1, 2026-10-20: a non-fatal AMBIGUOUS was a stale page passing).
 * A person who reads a MOVED or AMBIGUOUS hit and finds it is NOT the audited row (the 2026-09-13
 * shape) records that on the entry as `lineMoveDeclined: { lines: [<n>, …], reason: "<why>" }`
 * (`line: <n>` is accepted for one); those lines are then not counted as hits. A declined line that
 * no longer holds the text is reported as stale and fails, so a declination cannot outlive what it
 * declined; a declination with no valid line number or no reason is MALFORMED and refused.
 *
 * Two more ways the page shows historical while the text sits at its line are refused, using the
 * renderer's own predicates (Codex round 1, 2026-10-20): PATH, a rowFile the renderer's
 * `mirrorFileExact` refuses (an alias, a wrong case, outside the mirror); and IDENTITY, a row at its
 * line whose stored rowTextSha256 or table-row shape fails the renderer's `identityVerified`.
 *
 * Exit: 0 clean · 1 a re-point or a decision is owed (MOVED, AMBIGUOUS, or a stale declination) ·
 * 2 refused: the store unreadable, a malformed entry, a PATH or IDENTITY failure, no value-vs-source
 * entry checked, or a mirror file unreadable. A zero from a dead read must never look like a
 * measured zero.
 *
 * NOT SEEN: entries on other legs (counted, not checked; the renderer's historical state applies to
 * value-vs-source only); a row moved to a different FILE; audits deleted from the store; whether a
 * declination's reason is right; and anything about the mathematics. CI runs only the selftest.
 *
 * Flags: --root <dir> (default: the repo; used by the red-arm on a scratch copy) · --selftest.
 */
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
// The renderer's OWN predicates, never a copy (Codex round 1, 2026-10-20): a re-implemented path or
// identity test can disagree with the page it is meant to vouch for. Importing runs nothing; the
// renderer has a main-module guard.
import { mirrorFileExact, identityVerified } from "./render-constant-pages.mjs";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");

export function classify(audits, readLines, pathOk = () => true) {
  const rows = [];
  let other = 0;
  for (const a of audits) {
    if (!a || a.leg !== "value-vs-source") { other++; continue; }
    if (typeof a.rowFile !== "string" || !Number.isInteger(a.rowLine) || a.rowLine < 1 || typeof a.rowText !== "string" || !a.rowText.trim()) {
      rows.push({ id: a.id, kind: "MALFORMED" });
      continue;
    }
    // A path the renderer refuses (an alias like `./`, a wrong case, outside the mirror) makes the page
    // show the verdict as historical however the text matches, so it is refused here, never read.
    if (!pathOk(a.rowFile)) { rows.push({ id: a.id, kind: "PATH", file: a.rowFile }); continue; }
    const lines = readLines(a.rowFile);
    if (!lines) { rows.push({ id: a.id, kind: "UNREADABLE", file: a.rowFile }); continue; }
    const want = a.rowText.trim();
    const hits = [];
    lines.forEach((l, i) => { if (l.trim() === want) hits.push(i + 1); });
    const dec = a.lineMoveDeclined;
    let declined = [];
    if (dec !== undefined) {
      const raw = dec && Array.isArray(dec.lines) ? dec.lines : dec && dec.line !== undefined ? [dec.line] : [];
      // Declining the recorded line itself contradicts the entry (Codex round 1): it would turn a row
      // the renderer correctly reads as current into a re-point toward some other line.
      if (!raw.length || !raw.every((n) => Number.isInteger(n) && n >= 1) || raw.includes(a.rowLine) || typeof dec.reason !== "string" || !dec.reason.trim()) {
        rows.push({ id: a.id, kind: "MALFORMED" });
        continue;
      }
      declined = raw;
    }
    const stale = declined.filter((n) => !hits.includes(n));
    if (stale.length) {
      rows.push({ id: a.id, kind: "STALE-DECLINATION", file: a.rowFile, line: stale.join(", ") });
      continue;
    }
    const counted = hits.filter((n) => !declined.includes(n));
    if (counted.includes(a.rowLine)) {
      // At its line, but the renderer ALSO needs a table row and the recorded hash; failing either, the
      // page shows the verdict as historical while the line matches (Codex round 1, its blind spot).
      rows.push({ id: a.id, kind: identityVerified({ ...a, inMirror: true }) ? "AT" : "IDENTITY", file: a.rowFile, from: a.rowLine });
      continue;
    }
    const others = counted.filter((n) => n !== a.rowLine);
    if (others.length === 1) rows.push({ id: a.id, kind: "MOVED", file: a.rowFile, from: a.rowLine, to: others[0], declined });
    else if (others.length > 1) rows.push({ id: a.id, kind: "AMBIGUOUS", file: a.rowFile, from: a.rowLine, lines: others, declined });
    else rows.push({ id: a.id, kind: "CHANGED", file: a.rowFile, from: a.rowLine, declined });
  }
  return { rows, other };
}

export function run(root) {
  const out = [];
  let audits;
  try {
    audits = JSON.parse(readFileSync(join(root, "continuity", "depth-audit.json"), "utf8")).audits;
  } catch {
    out.push("check-audit-lines: REFUSED — continuity/depth-audit.json could not be read or parsed");
    return { code: 2, out };
  }
  if (!Array.isArray(audits)) {
    out.push("check-audit-lines: REFUSED — the store holds no audits array");
    return { code: 2, out };
  }
  const cache = new Map();
  const readLines = (f) => {
    if (!cache.has(f)) {
      try { cache.set(f, readFileSync(join(root, f), "utf8").split(/\r?\n/)); } catch { cache.set(f, null); }
    }
    return cache.get(f);
  };
  const { rows, other } = classify(audits, readLines, (f) => mirrorFileExact(f, root));
  const n = (k) => rows.filter((r) => r.kind === k).length;
  const checked = rows.length;
  // Declined lines are named in every verdict they shaped, so "no line" never hides a declined match.
  const dnote = (r) => (r.declined && r.declined.length ? ` (declined: line${r.declined.length === 1 ? "" : "s"} ${r.declined.join(", ")})` : "");
  for (const r of rows) {
    if (r.kind === "MOVED") out.push(`MOVED      ${r.id} ${r.file}: its row text is no longer at line ${r.from} and is at line ${r.to} only${dnote(r)} — re-point rowLine ${r.from} -> ${r.to}, keeping ${r.from} in a dated rowLineBefore field; until then its page shows the verdict as historical`);
    else if (r.kind === "STALE-DECLINATION") out.push(`STALE      ${r.id} ${r.file}: lineMoveDeclined names line ${r.line}, which no longer holds the row text — remove or re-judge the declination`);
    else if (r.kind === "AMBIGUOUS") out.push(`AMBIGUOUS  ${r.id} ${r.file}: not at line ${r.from}; the text is on lines ${r.lines.join(", ")}${dnote(r)} — a person decides which, if any, is the audited row`);
    else if (r.kind === "CHANGED") out.push(`CHANGED    ${r.id} ${r.file}: ${r.declined && r.declined.length ? "every line holding the row text is declined" : "the row text is on no line of the file"} (was line ${r.from})${dnote(r)} — the verdict is historical by design`);
    else if (r.kind === "IDENTITY") out.push(`IDENTITY   ${r.id} ${r.file}: the row text is at line ${r.from}, but its stored rowTextSha256 or row shape fails the renderer's identity test, so its page shows the verdict as historical — fix the store entry`);
    else if (r.kind === "PATH") out.push(`PATH       ${r.id} ${r.file}: not a canonical mirror path (the renderer's mirrorFileExact refuses it), so its page shows the verdict as historical — fix rowFile`);
    else if (r.kind === "UNREADABLE") out.push(`UNREADABLE ${r.id} ${r.file}: the mirror file could not be read`);
    else if (r.kind === "MALFORMED") out.push(`MALFORMED  ${r.id}: rowFile, rowLine or rowText missing or invalid, or a lineMoveDeclined without valid line numbers and a reason, or one that declines the recorded line itself`);
  }
  const counts = { AT: n("AT"), MOVED: n("MOVED"), CHANGED: n("CHANGED"), AMBIGUOUS: n("AMBIGUOUS"), STALE: n("STALE-DECLINATION"), IDENTITY: n("IDENTITY"), PATH: n("PATH"), UNREADABLE: n("UNREADABLE"), MALFORMED: n("MALFORMED") };
  const sum = Object.values(counts).reduce((x, y) => x + y, 0);
  out.push(`check-audit-lines: ${checked} value-vs-source entr${checked === 1 ? "y" : "ies"} checked — ${counts.AT} at their line, ${counts.MOVED} moved, ${counts.CHANGED} changed, ${counts.AMBIGUOUS} ambiguous, ${counts.STALE} stale declination(s), ${counts.IDENTITY} identity failure(s), ${counts.PATH} non-canonical path(s), ${counts.UNREADABLE} unreadable, ${counts.MALFORMED} malformed (sum ${sum}); ${other} entr${other === 1 ? "y" : "ies"} on other legs not checked`);
  if (sum !== checked) { out.push("check-audit-lines: REFUSED — the classified parts do not sum to the entries checked"); return { code: 2, out }; }
  if (checked === 0) { out.push("check-audit-lines: REFUSED — no value-vs-source entry was checked, so a clean result would mean nothing"); return { code: 2, out }; }
  if (counts.UNREADABLE || counts.MALFORMED || counts.IDENTITY || counts.PATH) return { code: 2, out };
  if (counts.MOVED || counts.AMBIGUOUS || counts.STALE) return { code: 1, out };
  return { code: 0, out };
}

function selftest() {
  const dir = mkdtempSync(join(tmpdir(), "check-audit-lines-"));
  try {
    // A CANONICAL mirror path (Codex round 1: the old `ledger/x/9z.md` fixture is one the renderer
    // refuses, so "all at their line" proved nothing about agreeing with it). One CRLF file, one LF.
    const base = "ledger/teorth-optimizationproblems/constants";
    const file = `${base}/9z.md`;
    const lfFile = `${base}/9y.md`;
    mkdirSync(join(dir, ...base.split("/"), "9w.md"), { recursive: true }); // a directory named like a page: listed, unreadable
    mkdirSync(join(dir, "continuity"), { recursive: true });
    const body = ["# 9z", "| $1.0$ | [A] | |", "| $2.0$ | [B] | |", "| $3.0$ | [C] | |", "| $3.0$ | [C] | |", "| $4.0$ | [D] | |", "  | $5.0$ | [E] | |  "];
    writeFileSync(join(dir, file), body.join("\r\n"));
    writeFileSync(join(dir, lfFile), ["# 9y", "", "| $7.0$ | [G] | |"].join("\n"));
    const sha16 = (t) => createHash("sha256").update(t.trim(), "utf8").digest("hex").slice(0, 16);
    const e = (id, rowLine, rowText, extra = {}) => ({ id, leg: "value-vs-source", rowFile: file, rowLine, rowText, rowTextSha256: sha16(rowText), ...extra });
    const cases = [
      ["all at their line", [e("T1", 2, "| $1.0$ | [A] | |"), e("T2", 6, "| $4.0$ | [D] | |"), { id: "T0", leg: "citation-well-formed" }], 0, /2 value-vs-source entries checked — 2 at their line, 0 moved.*1 entry on other legs/],
      ["padded line and padded text still match", [e("T1", 7, " | $5.0$ | [E] | | ")], 0, /1 value-vs-source entry checked — 1 at their line/],
      ["an LF file is read too", [{ ...e("T1", 3, "| $7.0$ | [G] | |"), rowFile: lfFile }], 0, /1 at their line/],
      ["an LF file move is caught", [{ ...e("T1", 2, "| $7.0$ | [G] | |"), rowFile: lfFile }], 1, /MOVED +T1 .*2 -> 3/],
      ["moved one line down", [e("T1", 2, "| $2.0$ | [B] | |")], 1, /MOVED +T1 .*is at line 3 only — re-point rowLine 2 -> 3/],
      ["changed row is not fatal", [e("T1", 2, "| $9.0$ | [Z] | |")], 0, /CHANGED +T1 .*the row text is on no line of the file \(was line 2\) — the verdict is historical by design/],
      ["ambiguous fails", [e("T1", 2, "| $3.0$ | [C] | |")], 1, /AMBIGUOUS +T1 .*lines 4, 5 — /],
      ["declined line is not a hit, and the message says so", [e("T1", 2, "| $2.0$ | [B] | |", { lineMoveDeclined: { line: 3, reason: "fixture" } })], 0, /CHANGED +T1 .*every line holding the row text is declined \(was line 2\) \(declined: line 3\)/],
      ["declining every ambiguous line clears it", [e("T1", 2, "| $3.0$ | [C] | |", { lineMoveDeclined: { lines: [4, 5], reason: "fixture" } })], 0, /CHANGED +T1 .*\(declined: lines 4, 5\)/],
      ["declining one of two ambiguous lines leaves a move", [e("T1", 2, "| $3.0$ | [C] | |", { lineMoveDeclined: { lines: [4], reason: "fixture" } })], 1, /MOVED +T1 .*at line 5 only \(declined: line 4\) — re-point rowLine 2 -> 5/],
      ["declining the recorded line itself is refused", [e("T1", 4, "| $3.0$ | [C] | |", { lineMoveDeclined: { line: 4, reason: "fixture" } })], 2, /MALFORMED  T1/],
      ["stale declination fails", [e("T1", 2, "| $2.0$ | [B] | |", { lineMoveDeclined: { line: 5, reason: "fixture" } })], 1, /STALE +T1 .*line 5/],
      ["declination without a reason is refused", [e("T1", 2, "| $2.0$ | [B] | |", { lineMoveDeclined: { line: 3 } })], 2, /MALFORMED  T1/],
      ["declination with no valid line is refused", [e("T1", 2, "| $2.0$ | [B] | |", { lineMoveDeclined: { lines: [], reason: "fixture" } })], 2, /MALFORMED  T1/],
      ["rowLine 0 is refused", [e("T1", 0, "| $1.0$ | [A] | |")], 2, /MALFORMED  T1/],
      ["whitespace-only rowText is refused", [e("T1", 2, "   ")], 2, /MALFORMED  T1/],
      ["at its line with a wrong hash is an identity failure", [{ ...e("T1", 2, "| $1.0$ | [A] | |"), rowTextSha256: "0000000000000000" }], 2, /IDENTITY   T1 .*at line 2/],
      ["at its line but not a table row is an identity failure", [e("T1", 1, "# 9z")], 2, /IDENTITY   T1/],
      ["a ./ path alias is refused, never read", [{ ...e("T1", 2, "| $1.0$ | [A] | |"), rowFile: `${base}/./9z.md` }], 2, /PATH       T1/],
      ["a path outside the mirror is refused", [{ ...e("T1", 2, "| $1.0$ | [A] | |"), rowFile: "ledger/x/9z.md" }], 2, /PATH       T1/],
      ["a missing mirror file is refused", [{ ...e("T1", 2, "| $1.0$ | [A] | |"), rowFile: `${base}/9x.md` }], 2, /PATH       T1/],
      ["no entry checked is refused", [{ id: "T0", leg: "citation-well-formed" }], 2, /REFUSED — no value-vs-source entry/],
      ["unreadable mirror file is refused", [{ ...e("T1", 2, "| $1.0$ | [A] | |"), rowFile: `${base}/9w.md` }], 2, /UNREADABLE T1/],
    ];
    let fail = 0;
    for (const [name, audits, wantCode, wantRe] of cases) {
      writeFileSync(join(dir, "continuity", "depth-audit.json"), JSON.stringify({ audits }));
      const { code, out } = run(dir);
      const text = out.join("\n");
      const ok = code === wantCode && wantRe.test(text);
      if (!ok) { fail++; console.log(`FAIL ${name}: exit ${code} (want ${wantCode})\n${text}`); }
    }
    writeFileSync(join(dir, "continuity", "depth-audit.json"), "not json");
    if (run(dir).code !== 2) { fail++; console.log("FAIL an unparseable store must be refused"); }
    const total = cases.length + 1;
    console.log(fail ? `check-audit-lines selftest: FAIL (${fail} of ${total})` : `check-audit-lines selftest: PASS (${total} cases)`);
    return fail ? 1 : 0;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// MAIN-MODULE GUARD, the shape check-claims.mjs and reverify.mjs use (Codex round 1): through a
// junction a bare path comparison fails, nothing runs, and the process exits 0 with no output, which
// reads as a pass. realpathSync puts both sides in one space; the else-branch makes a guard that
// cannot run say so and exit 2.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
if (entry === import.meta.url) {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) process.exit(selftest());
  const i = args.indexOf("--root");
  const root = i >= 0 ? args[i + 1] : REPO;
  const { code, out } = run(root);
  console.log(out.join("\n"));
  process.exit(code);
} else if (process.argv[1]?.endsWith("check-audit-lines.mjs")) {
  console.error("check-audit-lines: COULD NOT RUN — invoked as main but module identity did not match");
  process.exit(2);
}
