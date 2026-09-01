#!/usr/bin/env node
// F-2, the spot-check: answer "is the number I'm about to cite current?" for ONE constant,
// without cloning the mirror or reading 233 claim lines.
//
// The core problem in the user's own words (docs/key-user-flows.md) is "I cited a number. I have
// no idea if it's still the current one." Until now this flow had ZERO surface: the only route
// was to guess which upstream repo we steward, clone, run `npm run check`, and read every claim —
// and still not learn WHEN the row last moved, because that output asserts current sync and never
// history. Named principle: recognition over recall (Nielsen). The visitor names the constant;
// the tool does the recalling.
//
// This deliberately prints PROVENANCE, never a verdict about mathematics. It reports the pinned
// last-listed table rows, the upstream sha they were snapshotted at, and the date the pin last
// changed. It does not rank rows, does not say which is "the record", and does not re-fetch: the
// generated pins assert LISTING POSITION, and upgrading that to a record claim is defeated by
// symbolic cells, negatives and O(-) asymptotics (the 2026-07-24 min/max prototype mis-picked
// 10a/21a/41a). Asserting an unverified mathematical statement in our own ledger is the one thing
// this repo must not do, and a lookup tool is exactly where that temptation reappears.
//
// ponytail: reads committed state only, no network. A visitor who wants live truth runs
// `npm run verify`; this answers the cheaper question of what we last verified and when.

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function normalizeId(raw) {
  return String(raw || "").trim().replace(/\.md$/i, "").toLowerCase();
}

export function pinsFor(id, claims) {
  const want = `pin:${normalizeId(id)}:`;
  return claims.filter((c) => typeof c.id === "string" && c.id.toLowerCase().startsWith(want));
}

// When the pinned string last changed. `-S<string>` finds the commit that introduced the CURRENT
// expect value into claims.json, which is exactly "the date this row last moved" — the fact the
// existing `npm run check` output structurally cannot give you. Returns null rather than throwing:
// a shallow clone (CI uses depth-1) has no history to walk, and "unknown" is an honest answer
// where a fabricated date would not be.
export function lastChanged(expect, root = ROOT) {
  try {
    // Search the JSON-ENCODED form, not the decoded string. claims.json holds escaped bytes, so a
    // decoded expect containing " or \ — i.e. most LaTeX-bearing rows — occurs in NO revision's raw
    // bytes and `-S` silently finds nothing. That dated only the 63 escape-free pins of 222 and
    // returned null for the other 159, while the CLI blamed the checkout. Found by the cross-family
    // review lane, 2026-08-21. claims.json is written by JSON.stringify, so this escaping is
    // byte-identical across history. Proven: pin:2a:U (Crouzeix — en-dash, quotes, backslashes)
    // goes null -> 2026-08-12 under this needle.
    // ASSUMPTION, currently true and worth stating: expect strings are unique across pins, so a
    // count-change of this needle is a change to THIS row. Verified 2026-08-21 — 0 expect strings
    // are shared. If two constants ever pin identical rows, one's change would re-date the other.
    const needle = JSON.stringify(expect).slice(1, -1);
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%ad", "--date=short", `-S${needle}`, "--", "ledger/claims.json"],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    return out || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Was the last change to the VALUE, or only to the text around it?
//
// The page's headline promise is "the date each row last moved". On 2026-08-24 that promise went
// false for two rows: upstream escaped the markdown-active characters inside inline math, two
// generated pins broke on the backslash alone, and the page then dated 53a and 56a to that day —
// so a reader sorting by "most recently updated" saw two records at the top that had not moved.
// Editorial drift is real drift and the alarm is right to fire; what was wrong was publishing it
// to a reader in the same words as a record movement.
//
// What this decides, precisely: whether the numerals in the row's BOUND cell — the first cell of
// the pinned table row — are the same multiset as they were before the change. Nothing more. It
// does NOT rank rows, does not say which is the record, and does not say a bound improved. That
// restraint is the same one the generated pins themselves observe (they assert listing position,
// never "the record"), and it is why the comparison is confined to the bound cell: comparing the
// whole row would call a changed citation year a value change, which overclaims in exactly the
// direction that misleads.
//
// ponytail: set-equality on digit strings, no parsing of mathematics. A symbolic cell that stays
// symbolic reads as unchanged, which is correct — and a cell we cannot interpret is never given a
// verdict we cannot support.

// The first cell of a pipe table row. A row that is not a pipe table falls back to the whole
// string rather than to an empty one: comparing everything is a weaker claim than comparing
// nothing, and "nothing" would silently report every such row as text-only.
export function boundCell(row) {
  const s = String(row == null ? "" : row);
  if (!s.trimStart().startsWith("|")) return s;
  const parts = s.split("|");
  return parts.length > 1 ? parts[1] : s;
}

export function numbersIn(text) {
  const m = String(text == null ? "" : text).match(/\d+(?:\.\d+)?/g);
  return (m || []).slice().sort();
}

// null means "we cannot say" — a pin appearing for the first time has nothing to be compared
// against, and inventing "value" or "text" there would be a verdict with no evidence under it.
export function changeKind(prevExpect, nowExpect) {
  if (prevExpect == null) return null;
  const before = numbersIn(boundCell(prevExpect)).join(",");
  const after = numbersIn(boundCell(nowExpect)).join(",");
  return before === after ? "text" : "value";
}

// One `git log` per pin, same as before — the sha rides along on the call that was already being
// made for the date. Rendering 222 pins costs ~26s at one call each and would cost twice that at
// two, which is why this is folded in rather than added beside.
export function lastChangeMeta(expect, root = ROOT) {
  try {
    const needle = JSON.stringify(expect).slice(1, -1);
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%H %ad", "--date=short", `-S${needle}`, "--", "ledger/claims.json"],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    if (!out) return { date: null, sha: null };
    const bits = out.split(/\s+/);
    return { sha: bits[0] || null, date: bits[1] || null };
  } catch {
    return { date: null, sha: null };
  }
}

// Keyed by sha because a single cycle moves many pins in one commit: 222 pins resolve to a couple
// of dozen distinct commits, so the parent blob is read once per commit rather than once per pin.
const parentClaimsCache = new Map();

function claimsAtParent(sha, root) {
  if (!sha) return null;
  const key = `${root}@${sha}`;
  if (parentClaimsCache.has(key)) return parentClaimsCache.get(key);
  let parsed = null;
  try {
    const raw = execFileSync("git", ["show", `${sha}^:ledger/claims.json`], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 64 * 1024 * 1024,
    });
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }
  parentClaimsCache.set(key, parsed);
  return parsed;
}

// The one call a renderer needs: date, and what kind of change that date records.
export function changeFor(pin, root = ROOT) {
  const meta = lastChangeMeta(pin.expect, root);
  if (!meta.sha) return { date: meta.date, sha: null, kind: null };
  const prevClaims = claimsAtParent(meta.sha, root);
  if (!Array.isArray(prevClaims)) return { date: meta.date, sha: meta.sha, kind: null };
  const prev = prevClaims.find((c) => c && c.id === pin.id);
  // `prevExpect` is returned so the page can say what the row USED TO say. It was already being
  // computed and discarded, which is why this costs no extra git call. It is only ever surfaced
  // where kind === "value": on a "text" change the numbers are identical and a "was" line would
  // show a reader two indistinguishable strings and imply a movement that did not happen.
  // The parent read fine and this pin was not in it, so the commit that "changed" the row is the
  // commit that CREATED it. That distinction carries the page's single worst misreading: 203 of
  // 222 pins date to 2026-07-24, the day tracking started and not a day anything moved, and the
  // 2026-08-23 primer names it as the first thing that will mislead a reader. It is only sayable
  // because the null case above is kept separate: a shallow clone that cannot read the parent
  // returns null and gets the neutral wording, never a "never changed" we did not establish.
  if (!prev) return { date: meta.date, sha: meta.sha, kind: "first", prevExpect: null };
  const kind = changeKind(prev.expect, pin.expect);
  return { date: meta.date, sha: meta.sha, kind, prevExpect: kind === "value" ? prev.expect : null };
}

function render(id, claims, manifest, root = ROOT) {
  const pins = pinsFor(id, claims);
  const lines = [];
  if (!pins.length) {
    lines.push(`No pinned rows for "${id}".`);
    lines.push(`Known ids look like 27b, 1b, 87a — one per constants/<id>.md in the mirrored surface.`);
    return { lines, found: false };
  }
  lines.push(`${normalizeId(id)} — ${pins[0].statement.replace(/^Last-listed \w+-bound table row for /, "").replace(/ \(\S+\)$/, "")}`);
  lines.push("");
  for (const p of pins) {
    const side = p.id.endsWith(":U") ? "upper" : p.id.endsWith(":L") ? "lower" : p.id.split(":").pop();
    const when = lastChanged(p.expect, root);
    lines.push(`  last-listed ${side}-bound row:`);
    lines.push(`    ${p.expect}`);
    // Do not assert a REASON we cannot know. The old text said "no history available in this
    // checkout", which was a false diagnosis on a full clone and made a code defect read as an
    // environment fact. A trusted-print instrument may say it does not know; it may not invent why.
    lines.push(`    pin last changed: ${when || "unknown"}`);
    lines.push(`    primary source:   ${p.url}`);
    lines.push("");
  }
  lines.push(`  snapshotted at upstream sha ${String(manifest.sha).slice(0, 7)} (an upstream sha; it does not exist in this repo)`);
  lines.push(`  These are LISTING POSITIONS, not a claim about which row is the record.`);
  lines.push(`  Check us in one hop: the primary source above is the row we read.`);
  return { lines, found: true };
}

async function selftest() {
  const assert = (await import("node:assert/strict")).default;
  const claims = [
    { id: "pin:27b:U", statement: "Last-listed upper-bound table row for Widgets (27b.md)", url: "https://example.invalid/27b.md", expect: "| 12 | Trivial |" },
    { id: "pin:27b:L", statement: "Last-listed lower-bound table row for Widgets (27b.md)", url: "https://example.invalid/27b.md", expect: "| 9 | Sulanke |" },
    { id: "pin:41a:U", statement: "Last-listed upper-bound table row for Other (41a.md)", url: "https://example.invalid/41a.md", expect: "| 3 | Other |" },
    { id: "C-7", statement: "a hand claim, not a pin", url: "https://example.invalid/36", expect: "0.380876" },
  ];
  const manifest = { sha: "e70b4a45ae3a6218785088591e26521c20cfd49f" };

  // FIRES: a known id returns exactly its own two pins, and does not bleed in a neighbour's.
  const hit = render("27b", claims, manifest);
  assert.equal(hit.found, true, "known id must be found");
  const text = hit.lines.join("\n");
  assert.match(text, /\| 12 \| Trivial \|/, "must print the upper row");
  assert.match(text, /\| 9 \| Sulanke \|/, "must print the lower row");
  assert.doesNotMatch(text, /41a|Other/, "must not bleed a different constant's pin in");
  assert.doesNotMatch(text, /0\.380876/, "must not pick up hand claims — only generated pins");

  // SILENT: an unknown id reports not-found. Asserted only AFTER a known id was proven to
  // return output, so a wholly broken matcher cannot pass this as "correctly absent"
  // (KP-78's silent half; the 2026-08-17 empty-string trap).
  assert.equal(pinsFor("27b", claims).length, 2, "positive control: matcher returns rows before absence is asserted");
  const miss = render("99z", claims, manifest);
  assert.equal(miss.found, false, "unknown id must report not-found");

  // Input shapes a visitor will actually type.
  assert.equal(normalizeId("27b.md"), "27b");
  assert.equal(normalizeId(" 27B "), "27b");
  assert.equal(pinsFor("27B.md", claims).length, 2, "id normalisation must survive case and extension");

  // The sha is glossed as upstream. An unglossed chain of upstream shas reads to an outside
  // reader as local commits that do not exist — the repo's standing rule for anything public.
  assert.match(text, /an upstream sha; it does not exist in this repo/, "sha class must be glossed");
  // And it must never imply a record ranking.
  assert.match(text, /LISTING POSITIONS, not a claim about which row is the record/);

  console.log("lookup selftest: PASS (known id returns both its rows and neither a neighbour's pin nor a hand claim; unknown id reports not-found only after the matcher is proven to return rows; id normalisation survives case and .md; upstream sha glossed; no record-ranking claim emitted)");
}

// Run the CLI only when this file IS the entry point. Without this guard, `import`ing the module
// executes its argv handling in the importer's process — found 2026-08-20 the moment
// render-site.mjs imported it: `node scripts/render-site.mjs` printed lookup's usage and exited 2,
// and `--selftest` ran lookup's selftest as a side effect of loading it, so render-site's own
// selftest "passed" while partly measuring the wrong module. A defect in the PR #26 version of
// this file, found by using it rather than by reading it.
const isMain = process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (!isMain) {
  // imported as a library — export only
} else if (process.argv.includes("--selftest")) {
  await selftest();
} else {
  const id = process.argv[2];
  if (!id) {
    console.error("usage: node scripts/lookup.mjs <constant-id>       e.g. 27b, 1b, 87a");
    process.exit(2);
  }
  const claims = JSON.parse(readFileSync(join(ROOT, "ledger", "claims.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(join(ROOT, "ledger", "teorth-optimizationproblems", "manifest.json"), "utf8"));
  const { lines, found } = render(id, claims, manifest);
  console.log(lines.join("\n"));
  process.exit(found ? 0 : 1);
}
