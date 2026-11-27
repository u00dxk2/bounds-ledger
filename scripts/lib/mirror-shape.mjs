// THE MIRRORED-FILE SHAPE RULE (A-108, 2026-11-27, after Codex rounds 1 and 2 found the same defect class
// twice: the extractor misread unusual Markdown, first a pipe line after the table, then a fenced fake
// "Known upper bounds" heading and a comment that hid text). Portable rule 2: stop patching the parser and
// claim less. Every reader that takes text from a mirrored constant file (extract-pins.mjs per file, the
// renderers over the whole folder) REFUSES a file holding any of these shapes instead of parsing it:
//   (a) an HTML comment marker, "<!--" or "-->", anywhere in the file (it can hide a row, a heading or a
//       link from a human reader while a script still sees it);
//   (b) a "## Known upper bounds" or "## Known lower bounds" heading that appears more than once;
//   (c) a code fence (``` or ~~~) before the end of the bounds region, which runs from the top of the file
//       to the next "## " heading after the later of the two bounds headings (or to the end of the file).
// Fences AFTER that region are allowed: 10c.md keeps its certificates in fenced blocks below line 53.
// Measured 2026-11-27 over all 123 mirrored files: 0 comment markers, 0 repeated bounds headings, 0 fences
// in the bounds region, so the rule refuses no file today. A future upstream edit that adds one stops the
// next resnap red until a person reads the file: that is the alarm working, not a bug to route around.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isConstantId } from "./constant-id.mjs";

// The orchestrator's condition 3 (consult ffb8f460, 2026-11-27): a resnap that stops on one of these
// refusals must be SEEN. CI does not run extract-pins, so the refusal line itself carries the next step.
// Fixed text, printed only to the operator's terminal and the local run, never to reverify.mjs's public
// drift-issue output (docs/gotchas.md records the same rule).
// Conditional wording (Codex r4): the same refusal also prints during a plain CI --check, where no resnap ran.
export const RESNAP_STOPPED = "If this stopped a resnap, post a bus blocker naming this line, and comment it on the open drift issue.";

const BOUNDS = ["Known upper bounds", "Known lower bounds"];
const headingRe = (h) => new RegExp(`^##[ \\t]+${h}[ \\t]*$`);

/** null when the file's text keeps the rule, else a fixed-shape reason naming the first line that breaks it. */
export function mirrorShapeRefusal(body) {
  const lines = String(body).replace(/\r\n/g, "\n").split("\n");
  const commentAt = lines.findIndex((l) => l.includes("<!--") || l.includes("-->"));
  if (commentAt >= 0) return `line ${commentAt + 1} holds an HTML comment marker, which a mirrored constant file may not carry`;
  let lastBounds = -1;
  for (const h of BOUNDS) {
    const at = lines.map((l, i) => (headingRe(h).test(l) ? i : -1)).filter((i) => i >= 0);
    if (at.length > 1) return `the heading "## ${h}" appears ${at.length} times (lines ${at.map((i) => i + 1).join(", ")})`;
    if (at.length === 1) lastBounds = Math.max(lastBounds, at[0]);
  }
  let regionEnd = lines.length;
  if (lastBounds >= 0) {
    const next = lines.findIndex((l, i) => i > lastBounds && /^##[ \t]/.test(l));
    if (next >= 0) regionEnd = next;
  }
  const fenceAt = lines.findIndex((l, i) => i < regionEnd && /^[ \t]*(```|~~~)/.test(l));
  if (fenceAt >= 0) return `line ${fenceAt + 1} opens a code fence before the bounds tables' region ends (line ${regionEnd + 1})`;
  return null;
}

/**
 * The whole mirror folder, for a renderer to run BEFORE it composes anything (Codex r2 #3: a render must
 * refuse a planted bad file even when claims.json predates it). Every entry ending in ".md" must have a
 * constant-id stem and keep the shape rule. Returns null, or a fixed sentence naming the first file that
 * breaks a rule. An unreadable folder is a refusal too, never a pass.
 */
export function mirrorFolderRefusal(dir) {
  let names;
  try { names = readdirSync(dir).filter((f) => f.endsWith(".md")).sort(); }
  catch { return `the mirror folder could not be read`; }
  if (!names.length) return `the mirror folder holds no constant files`;
  for (const f of names) {
    const stem = f.slice(0, -3);
    if (!isConstantId(stem)) return `mirror file ${JSON.stringify(f)} does not have a constant-id name (one to three digits, then one lowercase letter)`;
    const why = mirrorShapeRefusal(readFileSync(join(dir, f), "utf8"));
    if (why) return `mirror file ${f}: ${why}`;
  }
  return null;
}
