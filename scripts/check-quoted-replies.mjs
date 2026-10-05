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

// core.quotePath=false so a non-ASCII path arrives as itself; a path git still quotes (a tab, a
// quote mark, a backslash) is decoded by unquoteGitPath. Until review on 2026-10-05 a quoted path
// failed both readers and its lines were silently never read.
const git = (args) => execFileSync("git", ["-c", "core.quotePath=false", ...args], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
const SELF = "scripts/check-quoted-replies.mjs";
// Skipped: this file (its fixtures are quote-shaped by design) and the byte mirror of an upstream
// repository, whose text is upstream's own and is never written by this lane. Nothing else.
const SKIP = (f) => f === SELF || f.startsWith("ledger/teorth-optimizationproblems/");

export function unquoteGitPath(p) {
  if (!p.startsWith('"')) return p;
  const bytes = [];
  for (let i = 1; i < p.length - 1; i++) {
    const c = p[i];
    if (c !== "\\") { bytes.push(...Buffer.from(c, "utf8")); continue; }
    const n = p[++i];
    if (/[0-7]/.test(n)) { bytes.push(parseInt(p.slice(i, i + 3), 8)); i += 2; }
    else bytes.push({ n: 10, t: 9, r: 13, '"': 34, "\\": 92, a: 7, b: 8, f: 12, v: 11 }[n] ?? n.charCodeAt(0));
  }
  return Buffer.from(bytes).toString("utf8");
}

function readTree() {
  const files = git(["ls-files", "-z", "--cached"]).split("\0").filter((f) => f && !SKIP(f));
  const lines = [];
  const binary = [];
  for (const f of files) {
    const blob = git(["show", `:${f}`]);
    // A blob with a NUL byte is not text and is not judged; it is COUNTED and named, never dropped silently.
    if (blob.includes("\0")) { binary.push(f); continue; }
    blob.split(/\r?\n/).forEach((text, i) => lines.push({ file: f, line: i + 1, text }));
  }
  return { lines, files: files.length - binary.length, binary };
}

function readStaged() {
  const diff = git(["diff", "--cached", "--no-color", "--text", "-U0"]);
  const lines = [];
  let file = null, at = 0;
  for (const raw of diff.split(/\r?\n/)) {
    // Every file's diff starts here; forget the previous file so an unparsed path can never inherit it.
    if (raw.startsWith("diff --git ")) { file = null; continue; }
    const fm = raw.match(/^\+\+\+ (?:(b\/.+|"b\/.+")|\/dev\/null)$/);
    if (fm) { file = fm[1] ? unquoteGitPath(fm[1]).replace(/^"?b\//, "").replace(/"$/, "") : null; continue; }
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
  console.log(`Paraphrase it, keeping the decision and the reasoning. If the quoted words are NOT his, put "(not David's words)" right after the closing quote mark (within 40 characters).`);
  return 1;
}

function selftest() {
  const fails = [];
  const fire = (t, why) => { if (findQuotes(t).length !== 1) fails.push(`did not fire: ${why}`); };
  const quiet = (t, why) => { if (findQuotes(t).length !== 0) fails.push(`fired: ${why}`); };
  // EVERY fixture below is INVENTED: no real reply, card id or quotation. This file is the one path
  // the tree check skips, so a real quotation placed here would be published unchecked (it happened
  // in this file's first version and was caught by review on 2026-10-05).
  fire(`David, verbatim: *"please water the ferns before lunch"*`, "a markdown verbatim quote");
  const fireJson = (t, why) => { if (findQuotes(t, { json: true }).length !== 1) fails.push(`did not fire: ${why}`); };
  fireJson(`      "note": "first \\"one two\\" then his words on card 0a0a0a0a: \\"Yes - paint the fence green\\" end",`, "a JSON-escaped quote after a card id, behind an earlier short quote");
  fire(`approved on card 0b0b0b0b ('Go ahead and move the blue folder to the top shelf.')`, "a single-quoted reply after a card id");
  quiet(`David's ruling stands and he's sure it's the one we'd keep for now`, "apostrophes, not quotes");
  fire(`he answered "bring the ladder and the green paint"`, "a quote after 'he answered'");
  fire(`DAVID: “close the garden gate behind you”`, "a curly quote after 'David:'");
  quiet(`he said so, and then, much later in the same long paragraph, after a great deal of unrelated discussion of the mirror, the page reads "a sentence printed on some page"`, "a phrase cue more than 100 characters before an unrelated quote");
  fire(`David approved it today on the board, after the review and the runner check: *"Yes - plant the tulips."*`, "a quote whose only cue is the name, within 250 characters");
  fire(`David's answer on card \x600c0c0c0c\x60 ends: *"Then fold the towels and stack them by the`, "a quote that wraps onto the next line");
  quiet(`he answered "yes" to the card`, "a quote shorter than four words");
  quiet(`the upstream README says "an invented sentence for this test"`, "a quote with no attribution cue");
  quiet(`David cited the paper by "DAVID EXAMPLE AND TWO CO-AUTHORS" (not David's words)`, "a waived quote");
  fire(`the reviewer said "this part is fine as written" (not David's words), and David said "sweep the porch steps today"`, "a real quote on a line whose other quote is waived");
  quiet(`David approved it on a date and nothing was quoted at all`, "a cue with no quote");
  // Git quotes a path holding a tab, a quote mark or (without core.quotePath=false) non-ASCII bytes.
  if (unquoteGitPath('"docs/r\\303\\251sum\\303\\251.md"') !== "docs/résumé.md") fails.push("a git-quoted octal path did not decode");
  if (unquoteGitPath('"docs/a\\tb.md"') !== "docs/a\tb.md") fails.push("a git-quoted tab path did not decode");
  if (unquoteGitPath("docs/plain.md") !== "docs/plain.md") fails.push("an unquoted path was altered");
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
    const { lines, files, binary = [] } = staged ? readStaged() : readTree();
    if (!staged && !lines.length) {
      console.log("REFUSED — no tracked text line was read; a clean result would mean nothing.");
      process.exitCode = 2;
    } else {
      const skipped = binary.length ? `; ${binary.length} binary file(s) not judged: ${binary.join(", ")}` : "";
      process.exitCode = report(lines, staged ? `${lines.length} added line(s) in ${files} staged file(s)` : `${lines.length} line(s) in ${files} tracked text file(s)${skipped}`);
    }
  }
} catch (err) {
  console.error(`check-quoted-replies: could not run (${err.message.split("\n")[0]})`);
  process.exitCode = 2;
}
