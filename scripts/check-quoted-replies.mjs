#!/usr/bin/env node
// Refuses a quoted span attributed to David in this PUBLIC repository.
//
// usage: check-quoted-replies.mjs [--staged | --tree | --selftest]
//   --staged  (the pre-commit hook) judge only lines ADDED in the staged diff
//   --tree    judge every line of every tracked text file in the index
// exit 0 = none found · 1 = at least one · 2 = could not read what it was asked to judge
//
// THE RULE IT ENFORCES (David, 2026-08-07, card bb4df56c, recorded on A-13 note19): his words
// are paraphrased out of this repository, keeping the decision, the reasoning and the intent.
// A full sweep applied it that day; new verbatim quotes arrived afterwards anyway, because the
// rule lived only in prose. This makes it mechanical.
//
// WHAT COUNTS: a double-quoted span of four or more words that opens within 100 characters after
// an attribution cue — "David said/wrote/answered/ruled…", "David's words/reply/answer",
// "David, verbatim", "his words", "he wrote/said/replied/answered/typed/asked", "verbatim" on a
// line that names David, a card id (`card 1a2b3c4d`), or "David:" / "David —" directly before
// the quote — or the bare name "David" up to 250 characters before it. It is a STATED RULE, not a
// detector of meaning: it refuses some quotations that are not his, and each of those carries
// "(not David's words)" right after its closing quote mark. It cannot see a quote with no cue
// near it; it is a floor, not a proof. This file is the one path it skips, because its own
// fixtures are quote-shaped by design.
//
// WHY NOT MATCH AGAINST THE BOARD: comparing against his actual card replies would need the
// Command Center PIN and network, which a public repo's CI must not hold and a pre-commit hook
// should not need. The cue rule runs anywhere and its failure mode is a refusal.

import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CUE = new RegExp(
  [
    String.raw`\bDavid(?:'s)?,? (?:said|wrote|replied|answered|typed|ruled|asked|added|words|reply|answer|sentence|own words|direction)\b`,
    String.raw`\bDavid,? verbatim\b`,
    String.raw`\bhis (?:own |exact )?(?:words|reply|answer)\b`,
    String.raw`\bhe (?:wrote|said|replied|answered|typed|asked|added)\b`,
    String.raw`\bcard [\x60']?[0-9a-f]{8}`,
    String.raw`\bDavid\b[\x60*\s]*[:—-]`,
  ].join("|"),
  "gi",
);
const VERBATIM = /\bverbatim\b/gi;
const NAMES_DAVID = /\bDavid\b|\bhis\b|\bhe\b/i;
// A quote is a straight or curly double-quoted span, or a single-quoted one whose opening quote
// follows a space, bracket or colon (so an apostrophe in "David's" never opens one).
// A double quote left open at the end of a line is a quote that wraps onto the next one.
const QUOTE = /"([^"\n]+?)"|“([^“”\n]+?)”|(?<=[\s(:—])'((?:[^'\n]|'(?=[A-Za-z]))+?)'(?![A-Za-z])|"([^"\n]{12,})$/g;
// The waiver is per QUOTE, not per line: it must follow that quote's closing mark within 40
// characters. A line of continuity/items.json holds a whole note, so a line-wide waiver there
// would also excuse every real quote elsewhere in the note.
const WAIVER = "(not David's words)";
const WAIVER_REACH = 40;
const WINDOW = 100;
// The name alone is a cue with a longer reach. The phrasings that introduce his words are too
// varied to list ("approved it on the board:", "on David's ruling at 13:58Z:", "while his freeze
// stands (…)"), and a list that grows every time it misses is the wrong shape for this rule.
const NAME = /\bDavid\b/gi;
const NAME_WINDOW = 250;

// A line of a JSON file is judged on its DECODED string value, so an escaped \" inside a note is
// the quote mark it stands for and the JSON delimiters around the value are not.
export function decodeJsonLine(text) {
  const m = text.match(/^\s*(?:"(?:[^"\\]|\\.)*"\s*:\s*)?("(?:[^"\\]|\\.)*")\s*,?\s*$/);
  if (!m) return text;
  try { return JSON.parse(m[1]); } catch { return text; }
}

export function findQuotes(raw, { json = false } = {}) {
  const text = json ? decodeJsonLine(raw) : raw;
  const cues = [];
  for (const m of text.matchAll(CUE)) cues.push([m.index + m[0].length, WINDOW]);
  if (NAMES_DAVID.test(text)) for (const m of text.matchAll(VERBATIM)) cues.push([m.index + m[0].length, WINDOW]);
  for (const m of text.matchAll(NAME)) cues.push([m.index + m[0].length, NAME_WINDOW]);
  if (!cues.length) return [];
  const hits = [];
  for (const q of text.matchAll(QUOTE)) {
    const body = (q[1] ?? q[2] ?? q[3] ?? q[4]).trim();
    if (body.split(/\s+/).length < 4) continue;
    const after = q.index + q[0].length;
    if (text.slice(after, after + WAIVER_REACH).includes(WAIVER)) continue;
    if (cues.some(([end, w]) => end <= q.index && q.index - end <= w)) hits.push({ column: q.index + 1, preview: body.slice(0, 40) });
  }
  return hits;
}

const git = (args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
const SELF = "scripts/check-quoted-replies.mjs";
const SKIP = (f) => f === SELF || f.startsWith("ledger/") || /\.(png|jpg|pdf|svg)$/i.test(f);

function readTree() {
  const files = git(["ls-files", "--cached"]).split(/\r?\n/).filter((f) => f && !SKIP(f) && /\.(md|json|mjs|yml|txt|html)$/.test(f));
  const lines = [];
  for (const f of files) git(["show", `:${f}`]).split(/\r?\n/).forEach((text, i) => lines.push({ file: f, line: i + 1, text }));
  return { lines, files: files.length };
}

function readStaged() {
  const diff = git(["diff", "--cached", "--no-color", "-U0"]);
  const lines = [];
  let file = null, at = 0;
  for (const raw of diff.split(/\r?\n/)) {
    const fm = raw.match(/^\+\+\+ (?:b\/(.+)|\/dev\/null)$/);
    if (fm) { file = fm[1] ?? null; continue; }
    const hm = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hm) { at = Number(hm[1]); continue; }
    if (file && !SKIP(file) && raw.startsWith("+") && !raw.startsWith("+++")) lines.push({ file, line: at++, text: raw.slice(1) });
  }
  return { lines, files: new Set(lines.map((l) => l.file)).size };
}

function report(lines, scope) {
  const hits = [];
  for (const l of lines) for (const h of findQuotes(l.text, { json: l.file.endsWith(".json") })) hits.push({ ...l, ...h });
  if (!hits.length) {
    console.log(`quoted-reply check (${scope}): none`);
    return 0;
  }
  console.log(`QUOTED REPLY — ${hits.length} quoted span(s) attributed to David (${scope}). This repository is public; his words are paraphrased here, never quoted:`);
  for (const h of hits) console.log(`  ${h.file}:${h.line}:${h.column}  "${h.preview}…"`);
  console.log(`Paraphrase it, keeping the decision and the reasoning. If the quoted words are NOT his, add \`pragma: quoted-not-david\` on that line.`);
  return 1;
}

function selftest() {
  const fails = [];
  const fire = (t, why) => { if (findQuotes(t).length !== 1) fails.push(`did not fire: ${why}`); };
  const quiet = (t, why) => { if (findQuotes(t).length !== 0) fails.push(`fired: ${why}`); };
  fire(`David, verbatim: *"when do we start on the next thing please"*`, "a markdown verbatim quote");
  const fireJson = (t, why) => { if (findQuotes(t, { json: true }).length !== 1) fails.push(`did not fire: ${why}`); };
  fireJson(`      "note": "first \\"one two\\" then his words on card 1a2b3c4d: \\"Yes - make the new top goal\\" end",`, "a JSON-escaped quote after a card id, behind an earlier short quote");
  fire(`approved on card 4ea78b83 ('Go ahead and strip it from that commit message too.')`, "a single-quoted reply after a card id");
  quiet(`David's ruling stands and he's sure it's the one we'd keep for now`, "apostrophes, not quotes");
  fire(`he answered "ship the partial table and mark the rest"`, "a quote after 'he answered'");
  fire(`DAVID: “go with depth and read our own records”`, "a curly quote after 'David:'");
  quiet(`he said so, and then, much later in the same long paragraph, after a great deal of unrelated discussion of the mirror, the page reads "I got this constant from a page"`, "a phrase cue more than 100 characters before an unrelated quote");
  fire(`David approved it today on the board, after the review and the runner check: *"Yes - build the page."*`, "a quote whose only cue is the name, within 250 characters");
  fire(`David's answer on card \x60bb4df56c\x60 ends: *"Then show me the rewritten history and the diff of what`, "a quote that wraps onto the next line");
  quiet(`he answered "yes" to the card`, "a quote shorter than four words");
  quiet(`the upstream README says "claimed proof of the conjecture here"`, "a quote with no attribution cue");
  quiet(`David cited the paper by "DAVID BELTRAN AND TWO CO-AUTHORS" (not David's words)`, "a waived quote");
  fire(`the reviewer said "this part is fine as written" (not David's words), and David said "ship the partial table now"`, "a real quote on a line whose other quote is waived");
  quiet(`David approved it on 2026-08-20 and nothing was quoted at all`, "a cue with no quote");
  if (fails.length) {
    for (const f of fails) console.error(`check-quoted-replies selftest FAIL: ${f}`);
    return 1;
  }
  console.log("check-quoted-replies selftest: PASS (fires on markdown, JSON-escaped, curly and card-id quotes; silent on short, uncued, distant, waived and quote-free lines)");
  return 0;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) try {
  if (process.argv.includes("--selftest")) process.exitCode = selftest();
  else {
    const staged = process.argv.includes("--staged");
    const { lines, files } = staged ? readStaged() : readTree();
    if (!staged && !lines.length) {
      console.log("REFUSED — no tracked text line was read; a clean result would mean nothing.");
      process.exitCode = 2;
    } else process.exitCode = report(lines, staged ? `${lines.length} added line(s) in ${files} staged file(s)` : `${lines.length} line(s) in ${files} tracked file(s)`);
  }
} catch (err) {
  console.error(`check-quoted-replies: could not run (${err.message.split("\n")[0]})`);
  process.exitCode = 2;
}
