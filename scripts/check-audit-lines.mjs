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
 *   AMBIGUOUS — not at rowLine, on two or more other lines. Cannot say which is the row; reported
 *               for a person, not fatal, for the same reason as CHANGED.
 * A person who reads a MOVED hit and finds it is NOT the audited row (the 2026-09-13 shape) records
 * that on the entry as `lineMoveDeclined: { line: <n>, reason: "<why>" }`; that one line is then not
 * counted as a hit. A declined line that no longer holds the text is reported as stale and fails, so
 * a declination cannot outlive what it declined.
 *
 * Exit: 0 clean · 1 a re-point is owed (or a stale declination) · 2 refused: the store unreadable,
 * no value-vs-source entry checked, or a mirror file unreadable. A zero from a dead read must never
 * look like a measured zero.
 *
 * Flags: --root <dir> (default: the repo; used by the red-arm on a scratch copy) · --selftest.
 */
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");

export function classify(audits, readLines) {
  const rows = [];
  let other = 0;
  for (const a of audits) {
    if (!a || a.leg !== "value-vs-source") { other++; continue; }
    if (typeof a.rowFile !== "string" || !Number.isInteger(a.rowLine) || typeof a.rowText !== "string" || !a.rowText.trim()) {
      rows.push({ id: a.id, kind: "MALFORMED" });
      continue;
    }
    const lines = readLines(a.rowFile);
    if (!lines) { rows.push({ id: a.id, kind: "UNREADABLE", file: a.rowFile }); continue; }
    const want = a.rowText.trim();
    const hits = [];
    lines.forEach((l, i) => { if (l.trim() === want) hits.push(i + 1); });
    const dec = a.lineMoveDeclined;
    const declined = dec && Number.isInteger(dec.line) ? dec.line : null;
    if (declined !== null && !hits.includes(declined)) {
      rows.push({ id: a.id, kind: "STALE-DECLINATION", file: a.rowFile, line: declined });
      continue;
    }
    const counted = hits.filter((n) => n !== declined);
    if (counted.includes(a.rowLine)) { rows.push({ id: a.id, kind: "AT" }); continue; }
    const others = counted.filter((n) => n !== a.rowLine);
    if (others.length === 1) rows.push({ id: a.id, kind: "MOVED", file: a.rowFile, from: a.rowLine, to: others[0] });
    else if (others.length > 1) rows.push({ id: a.id, kind: "AMBIGUOUS", file: a.rowFile, from: a.rowLine, lines: others });
    else rows.push({ id: a.id, kind: "CHANGED", file: a.rowFile, from: a.rowLine });
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
  const { rows, other } = classify(audits, readLines);
  const n = (k) => rows.filter((r) => r.kind === k).length;
  const checked = rows.length;
  for (const r of rows) {
    if (r.kind === "MOVED") out.push(`MOVED      ${r.id} ${r.file}: its row text is no longer at line ${r.from} and is at line ${r.to} only — re-point rowLine ${r.from} -> ${r.to}, keeping ${r.from} in a dated rowLineBefore field; until then its page shows the verdict as historical`);
    else if (r.kind === "STALE-DECLINATION") out.push(`STALE      ${r.id} ${r.file}: lineMoveDeclined names line ${r.line}, which no longer holds the row text — remove or re-judge the declination`);
    else if (r.kind === "AMBIGUOUS") out.push(`AMBIGUOUS  ${r.id} ${r.file}: not at line ${r.from}; the text is on lines ${r.lines.join(", ")} — a person decides which, if any, is the audited row`);
    else if (r.kind === "CHANGED") out.push(`CHANGED    ${r.id} ${r.file}: the row text is on no line of the file (was line ${r.from}) — the verdict is historical by design`);
    else if (r.kind === "UNREADABLE") out.push(`UNREADABLE ${r.id} ${r.file}: the mirror file could not be read`);
    else if (r.kind === "MALFORMED") out.push(`MALFORMED  ${r.id}: rowFile, rowLine or rowText missing`);
  }
  const counts = { AT: n("AT"), MOVED: n("MOVED"), CHANGED: n("CHANGED"), AMBIGUOUS: n("AMBIGUOUS"), STALE: n("STALE-DECLINATION"), UNREADABLE: n("UNREADABLE"), MALFORMED: n("MALFORMED") };
  const sum = Object.values(counts).reduce((x, y) => x + y, 0);
  out.push(`check-audit-lines: ${checked} value-vs-source entr${checked === 1 ? "y" : "ies"} checked — ${counts.AT} at their line, ${counts.MOVED} moved, ${counts.CHANGED} changed, ${counts.AMBIGUOUS} ambiguous, ${counts.STALE} stale declination(s), ${counts.UNREADABLE} unreadable, ${counts.MALFORMED} malformed (sum ${sum}); ${other} entr${other === 1 ? "y" : "ies"} on other legs not checked`);
  if (sum !== checked) { out.push("check-audit-lines: REFUSED — the classified parts do not sum to the entries checked"); return { code: 2, out }; }
  if (checked === 0) { out.push("check-audit-lines: REFUSED — no value-vs-source entry was checked, so a clean result would mean nothing"); return { code: 2, out }; }
  if (counts.UNREADABLE || counts.MALFORMED) return { code: 2, out };
  if (counts.MOVED || counts.STALE) return { code: 1, out };
  return { code: 0, out };
}

function selftest() {
  const dir = mkdtempSync(join(tmpdir(), "check-audit-lines-"));
  try {
    const file = "ledger/x/9z.md";
    mkdirSync(join(dir, "ledger", "x"), { recursive: true });
    mkdirSync(join(dir, "continuity"), { recursive: true });
    const body = ["# 9z", "| $1.0$ | [A] | |", "| $2.0$ | [B] | |", "| $3.0$ | [C] | |", "| $3.0$ | [C] | |", "| $4.0$ | [D] | |"];
    writeFileSync(join(dir, file), body.join("\r\n"));
    const e = (id, rowLine, rowText, extra = {}) => ({ id, leg: "value-vs-source", rowFile: file, rowLine, rowText, ...extra });
    const cases = [
      ["all at their line", [e("T1", 2, "| $1.0$ | [A] | |"), e("T2", 6, "| $4.0$ | [D] | |"), { id: "T0", leg: "citation-well-formed" }], 0, /2 value-vs-source entries checked — 2 at their line, 0 moved.*1 entry on other legs/],
      ["moved one line down", [e("T1", 2, "| $2.0$ | [B] | |")], 1, /MOVED +T1 .*re-point rowLine 2 -> 3/],
      ["changed row is not fatal", [e("T1", 2, "| $9.0$ | [Z] | |")], 0, /CHANGED +T1 .*historical by design/],
      ["ambiguous is not fatal", [e("T1", 2, "| $3.0$ | [C] | |")], 0, /AMBIGUOUS +T1 .*lines 4, 5/],
      ["declined line is not a hit", [e("T1", 2, "| $2.0$ | [B] | |", { lineMoveDeclined: { line: 3, reason: "fixture" } })], 0, /CHANGED +T1/],
      ["stale declination fails", [e("T1", 2, "| $2.0$ | [B] | |", { lineMoveDeclined: { line: 5, reason: "fixture" } })], 1, /STALE +T1 .*line 5/],
      ["no entry checked is refused", [{ id: "T0", leg: "citation-well-formed" }], 2, /REFUSED — no value-vs-source entry/],
      ["unreadable mirror file is refused", [{ ...e("T1", 2, "| $1.0$ | [A] | |"), rowFile: "ledger/x/missing.md" }], 2, /UNREADABLE T1/],
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) process.exit(selftest());
  const i = args.indexOf("--root");
  const root = i >= 0 ? args[i + 1] : REPO;
  const { code, out } = run(root);
  console.log(out.join("\n"));
  process.exit(code);
}
