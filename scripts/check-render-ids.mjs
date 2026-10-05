#!/usr/bin/env node
// Refuses a Render resource id (service, cron job, owner/team, database) in the tracked tree.
//
// usage: check-render-ids.mjs [--selftest]
// exit 0 = none in the index · 1 = at least one · 2 = could not read the tree
//
// WHY: this repository is public and runs nothing on Render. Any such id in it is another
// project's infrastructure identifier, published here by accident (one sat in a 2026-08-05 primer
// until 2026-10-05). An id is not a secret, but it names someone else's service, and this
// repository's rule is to describe other projects neutrally and not at all where it can.
//
// Reads the INDEX, so CI judges the checked-out commit and the pre-commit hook judges what is
// staged. Covers the four id prefixes Render issues for the resources this fleet uses; the
// broader rule (no other project's weaknesses or incidents in this tree) is a judgment, not a
// pattern, and stays with the author and the review.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readIndexBlobs, toLines } from "./lib/index-blobs.mjs";

const RENDER_ID = /\b(?:srv|crn|tea|dpg)-[a-z0-9]{20}\b/g;

export function findIds(lines) {
  const hits = [];
  for (const { file, line, text } of lines) for (const m of text.matchAll(RENDER_ID)) hits.push({ file, line, kind: m[0].slice(0, 3) });
  return hits;
}

// Every index blob, read by object id, including THIS file: it has no exemption. Its fixtures are
// assembled at run time (the section sign is removed), so its source never contains a match.
function check() {
  const blobs = readIndexBlobs();
  if (!blobs.length) {
    console.log("REFUSED — the index lists no files; the tree was not read.");
    return 2;
  }
  const hits = findIds(toLines(blobs));
  if (!hits.length) {
    console.log(`render-id check: none (${blobs.length} tracked file(s) read from the index)`);
    return 0;
  }
  console.log(`RENDER ID IN A PUBLIC TREE — ${hits.length} place(s); describe the service without its id:`);
  for (const h of hits) console.log(`  ${h.file}:${h.line}  (${h.kind}- id; not printed)`);
  return 1;
}

const J = (s) => s.replaceAll("\u00a7", "");

function selftest() {
  const fails = [];
  const n = (text) => findIds([{ file: "f", line: 1, text: J(text) }]).length;
  if (n("flagged `srv§-abcdefghij0123456789` as do-not-flip") !== 1) fails.push("did not fire on a service id");
  if (n("cron crn§-abcdefghij0123456789 and owner tea§-abcdefghij0123456789") !== 2) fails.push("did not fire on a cron and an owner id");
  if (n("the srv- prefix is described here without an id") !== 0) fails.push("fired on a bare prefix");
  if (n("server§-abcdefghij0123456789 is not a Render id") !== 0) fails.push("fired on a longer word ending in the same shape");
  // No exemption for this file, so its own source must be clean.
  const own = readFileSync(fileURLToPath(import.meta.url), "utf8");
  if (findIds(toLines([{ file: "self", text: own }])).length) fails.push("this file's own source contains a Render id; build fixtures with the section-sign join");
  if (fails.length) {
    for (const f of fails) console.error(`check-render-ids selftest FAIL: ${f}`);
    return 1;
  }
  console.log("check-render-ids selftest: PASS (fires on service, cron and owner ids; silent on a bare prefix and a look-alike word; its own source is clean)");
  return 0;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) try {
  process.exitCode = process.argv.includes("--selftest") ? selftest() : check();
} catch (err) {
  console.error(`check-render-ids: could not run (${err.message.split("\n")[0]})`);
  process.exitCode = 2;
}
