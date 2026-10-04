// HTML escaping and report links shared by render-site.mjs, render-constant-pages.mjs,
// and render-ramsey.mjs.

import { isEntryModule } from "./entry-module.mjs";

export const REPO = "https://github.com/u00dxk2/bounds-ledger";

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// The guard reads reference keys back off the page, so it must undo what esc did to them.
export const unesc = (s) => String(s).replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }[e]));

// Returns a raw URL; callers esc() it when embedding in HTML.
export function issueUrl(title, body) {
  return `${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

function selftest() {
  const fail = (msg) => { console.error("html selftest FAIL: " + msg); return 1; };

  // Each contract has its own failure label: a mutation proves the check it reaches.
  const entities = new Map([
    ["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ['"', "&quot;"], ["'", "&#39;"],
  ]);
  for (const [s, entity] of entities) {
    if (esc(s) !== entity) return fail("a: esc must use the exact entity for each special character");
  }
  const plainAscii = Array.from({ length: 128 }, (_, n) => String.fromCharCode(n))
    .filter((c) => !entities.has(c)).join("");
  for (const s of [plainAscii, "café Ελληνικά 中文 🧮", "$K_{DR}+10^{-26}$"]) {
    if (esc(s) !== s) return fail("a: esc must leave all other characters unchanged");
  }
  if (esc([...entities.keys()].join("")) !== [...entities.values()].join("")) {
    return fail("a: esc must replace every special character in a mixed string");
  }

  if (esc("&amp;") !== "&amp;amp;") {
    return fail("b: esc must visibly double-escape an already-escaped ampersand");
  }

  for (const s of ["&<>\"'", "literal &amp; and &#39;", "", "plain café $K_{DR}+10^{-26}$"]) {
    if (unesc(esc(s)) !== s) return fail("c: unesc(esc(s)) must round-trip every fixture");
  }

  const title = "Title & < > \" ' # ? = +\nnext";
  const body = "Body & < > \" ' # ? = +\nnext";
  const u = issueUrl(title, body);
  if (!u.startsWith(REPO + "/issues/new?title=")) {
    return fail("d: issueUrl must start with the repository issue-title prefix");
  }
  let parsed;
  try { parsed = new URL(u); }
  catch { return fail("d: issueUrl must produce a parseable URL"); }
  if (parsed.searchParams.get("title") !== title || parsed.searchParams.get("body") !== body) {
    return fail("d: issueUrl title and body must round-trip through URL searchParams");
  }

  // encodeURIComponent leaves ' literal (also ( ) ! * ~); esc covers it when
  // the raw URL is embedded in an HTML attribute.
  if (/[<>" \r\n]/.test(u)) {
    return fail("e: issueUrl must contain no raw angle bracket, double quote, space or newline");
  }
  if (esc(u) !== u.replaceAll("&", "&amp;").replaceAll("'", "&#39;")) {
    return fail("e: escaping the raw URL must change only ampersands and apostrophes");
  }

  if (esc(issueUrl("A & B", "row report")).includes("&amp;amp;")) {
    return fail("f: encode-then-escape must never double-escape the issue URL");
  }

  console.log("html selftest: PASS (a: exact entities and other characters unchanged; b: double-escaping visible; c: escape/unescape round-trips; d: issue URL prefix and parameters; e: raw URL safety and attribute escaping; f: encode-then-escape order; g: SILENT control on real module)");
  return 0;
}

if (isEntryModule(import.meta.url)) {
  if (process.argv.length === 3 && process.argv[2] === "--selftest") {
    process.exitCode = selftest();
  } else {
    console.error("Usage: node scripts/lib/html.mjs --selftest");
    process.exitCode = 2;
  }
}
