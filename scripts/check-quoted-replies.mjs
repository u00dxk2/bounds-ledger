#!/usr/bin/env node
// Refuses a quoted span attributed to David in this PUBLIC repository.
//
// usage: check-quoted-replies.mjs [--staged | --tree | --selftest]
//   --staged and --tree both judge every line of every blob in the git INDEX (in the pre-commit
//   hook the index is what is about to be committed); the flag only names the caller
// exit 0 = none found · 1 = at least one · 2 = could not read what it was asked to judge
//
// THE RULE IT ENFORCES (David, 2026-08-07, recorded on A-13 note19): his words
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
// near it; it is a floor, not a proof. No path is exempt except the upstream byte mirror.
//
// WHY NOT MATCH AGAINST THE BOARD: comparing against his actual card replies would need the
// Command Center PIN and network, which a public repo's CI must not hold and a pre-commit hook
// should not need. The cue rule runs anywhere and its failure mode is a refusal.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readIndexBlobs, toLines } from "./lib/index-blobs.mjs";

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
// varied to list (approved it on the board; on his ruling at a timestamp; while his freeze
// stands), and a list that grows every time it misses is the wrong shape for this rule.
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

// Every index blob, read by object id (scripts/lib/index-blobs.mjs), so no path or line is parsed
// out of a text stream: two review rounds on 2026-10-05 found ways for a git-quoted path, a NUL
// byte or a fake diff header to hide lines from the earlier readers. The one path skipped is the
// byte mirror of an upstream repository, whose text is upstream's and never written by this lane.
// THIS file is NOT skipped: its fixtures are assembled at run time, so its source holds no match.
const SKIP = (f) => f.startsWith("ledger/teorth-optimizationproblems/");

function readTree() {
  const blobs = readIndexBlobs({ skip: SKIP });
  return { lines: toLines(blobs), files: blobs.length };
}

function report(lines, scope) {
  const hits = [];
  for (const l of lines) for (const h of findQuotes(l.text, { json: l.file.endsWith(".json") })) hits.push({ ...l, ...h });
  if (!hits.length) {
    console.log(`quoted-reply check (${scope}): none`);
    return 0;
  }
  console.log(`QUOTED REPLY — ${hits.length} quoted span(s) attributed to David (${scope}). This repository is public; his words are paraphrased here, never quoted:`);
  for (const h of hits) console.log(`  ${h.file}:${h.line}:${h.column}  [${h.preview}…]`);
  console.log(`Paraphrase it, keeping the decision and the reasoning. If the quoted words are NOT his, put ${WAIVER} right after the closing quote mark (within ${WAIVER_REACH} characters).`);
  return 1;
}

// Quote marks for the fixtures, so the fixture SOURCE contains none and this file needs no exemption.
const Q = "\u0022", S = "\u0027", O = "\u201C", C = "\u201D";

function selftest() {
  const fails = [];
  const fire = (t, why) => { if (findQuotes(t).length !== 1) fails.push(`did not fire: ${why}`); };
  const quiet = (t, why) => { if (findQuotes(t).length !== 0) fails.push(`fired: ${why}`); };
  // EVERY fixture below is INVENTED: no real reply, card id or quotation (the first version of this
  // file copied real ones, and review caught it on 2026-10-05).
  fire(`David, verbatim: *${Q}please water the ferns before lunch${Q}*`, `a markdown verbatim quote`);
  const fireJson = (t, why) => { if (findQuotes(t, { json: true }).length !== 1) fails.push(`did not fire: ${why}`); };
  fireJson(`      ${Q}note${Q}: ${Q}first \\${Q}one two\\${Q} then his words on card 0a0a0a0a: \\${Q}Yes - paint the fence green\\${Q} end${Q},`, `a JSON-escaped quote after a card id, behind an earlier short quote`);
  fire(`approved on card 0b0b0b0b (${S}Go ahead and move the blue folder to the top shelf.${S})`, `a single-quoted reply after a card id`);
  quiet(`David${S}s ruling stands and he${S}s sure it${S}s the one we${S}d keep for now`, `apostrophes, not quotes`);
  fire(`he answered ${Q}bring the ladder and the green paint${Q}`, `a quote after he-answered`);
  fire(`DAVID: ${O}close the garden gate behind you${C}`, `a curly quote after the name and a colon`);
  quiet(`he said so, and then, much later in the same long paragraph, after a great deal of unrelated discussion of the mirror, the page reads ${Q}a sentence printed on some page${Q}`, `a phrase cue more than 100 characters before an unrelated quote`);
  fire(`David approved it today on the board, after the review and the runner check: *${Q}Yes - plant the tulips.${Q}*`, `a quote whose only cue is the name, within 250 characters`);
  fire(`David${S}s answer on card \x600c0c0c0c\x60 ends: *${Q}Then fold the towels and stack them by the`, `a quote that wraps onto the next line`);
  quiet(`he answered ${Q}yes${Q} to the card`, `a quote shorter than four words`);
  quiet(`the upstream README says ${Q}an invented sentence for this test${Q}`, `a quote with no attribution cue`);
  quiet(`David cited the paper by ${Q}DAVID EXAMPLE AND TWO CO-AUTHORS${Q} ${WAIVER}`, `a waived quote`);
  fire(`the reviewer said ${Q}this part is fine as written${Q} ${WAIVER}, and David said ${Q}sweep the porch steps today${Q}`, `a real quote on a line whose other quote is waived`);
  quiet(`David approved it on a date and nothing was quoted at all`, `a cue with no quote`);
  // No exemption for this file, so its own source must hold no match.
  const own = toLines([{ file: "self", text: readFileSync(fileURLToPath(import.meta.url), "utf8") }]);
  const selfHits = own.flatMap((l) => findQuotes(l.text).map((h) => `line ${l.line}: [${h.preview}]`));
  if (selfHits.length) fails.push(`this file's own source holds ${selfHits.length} match(es): ${selfHits.join("; ")}`);
  if (fails.length) {
    for (const f of fails) console.error(`check-quoted-replies selftest FAIL: ${f}`);
    return 1;
  }
  console.log("check-quoted-replies selftest: PASS (fires on markdown, JSON-escaped, curly, single-quoted, wrapped and card-id quotes; silent on short, uncued, distant, waived and quote-free lines; its own source is clean)");
  return 0;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) try {
  if (process.argv.includes("--selftest")) process.exitCode = selftest();
  else {
    // --staged and --tree read the same thing, the index, which in the pre-commit hook IS what is
    // about to be committed. The tree is clean, so judging all of it costs nothing and parses no diff.
    const { lines, files } = readTree();
    if (!lines.length) {
      console.log("REFUSED — no tracked line was read; a clean result would mean nothing.");
      process.exitCode = 2;
    } else process.exitCode = report(lines, `${lines.length} line(s) in ${files} tracked file(s) read from the index`);
  }
} catch (err) {
  console.error(`check-quoted-replies: could not run (${err.message.split("\n")[0]})`);
  process.exitCode = 2;
}