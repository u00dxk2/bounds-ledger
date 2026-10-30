#!/usr/bin/env node
// A-93: which statements in Anthropic's formal-math repository (github.com/anthropics/formal-math)
// bear on a constant this ledger watches. The sibling of A-78's openai-math.mjs, for a second
// release.
//
// WHY A SIBLING STORE AND NOT A-78's. A-78's map is keyed to OpenAI's numbered result families and
// its validator feeds the renderer of the notes already live on constant pages. This repository has
// no families: its unit is a project folder whose comparator configuration names the theorems that
// are claimed. Folding it into A-78's validator would change the code path of live notes for a
// store that renders nothing (no pair here bears; see the map). If a pair ever bears, its note
// takes A-78's fields and guard; until then this store is data plus this check.
//
// WHAT IS CHECKED (offline): within the map, no theorem is listed twice; every pair names a
// mirrored constant, one of four verdicts, and a reason; a bound-carrying verdict names its theorem
// and its bound, and `implies` carries its derivation; no pair asks to render; and every
// configuration the map leaves out (`excludedConfigs`) says why.
// WHAT --upstream ADDS (network): the project folders equal the ones the repository's README table
// lists at the pinned sha; every comparator configuration in the repository's tree under a mapped
// folder is either mapped or named in `excludedConfigs`; and each mapped configuration's
// theorem_names equal the map's. So the map's coverage is of the configurations it maps, and the
// ones it excludes are named, never silently missing.
//
// It never says a proof compiles (we did not build the projects) or that anyone refereed a claim.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const MAP_PATH = join(ROOT, "ledger", "anthropic-formal-math-map.json");
const MIRROR = join(ROOT, "ledger", "teorth-optimizationproblems", "constants");
export const VERDICTS = new Set(["states", "implies", "bears-without-number", "does-not-bear"]);
const BOUND_VERDICTS = new Set(["states", "implies"]);

// Returns a list of refusals; empty means the map holds. Order: the properties that carry meaning
// (coverage, verdicts, rendering) before the shape checks, so a mutation names what it broke.
export function validate(map, { mirrorHas = (id) => existsSync(join(MIRROR, `${id}.md`)) } = {}) {
  const errs = [];
  const projects = Array.isArray(map?.projects) ? map.projects : [];
  if (projects.length === 0) errs.push("no projects: the map covers nothing");
  const folders = new Set();
  for (const p of projects) {
    const where = `project ${p?.folder ?? "?"}`;
    if (folders.has(p.folder)) errs.push(`${where}: folder listed twice`);
    folders.add(p.folder);
    const names = new Set();
    const configs = Array.isArray(p.comparatorConfigs) ? p.comparatorConfigs : [];
    if (configs.length === 0) errs.push(`${where}: no comparator configuration, so no claimed theorem is covered`);
    for (const c of configs) {
      const list = Array.isArray(c.theoremNames) ? c.theoremNames : [];
      if (list.length === 0) errs.push(`${where}: ${c.path} lists no theorem`);
      for (const t of list) {
        if (names.has(t)) errs.push(`${where}: theorem ${t} listed twice`);
        names.add(t);
      }
      if (typeof c.path !== "string" || !c.path.startsWith(`${p.folder}/`) || !c.path.endsWith(".json")) {
        errs.push(`${where}: comparator path ${c.path} is not a .json file inside the folder`);
      }
    }
    const mappedPaths = new Set(configs.map((c) => c.path));
    for (const x of p.excludedConfigs ?? []) {
      if (mappedPaths.has(x.path)) errs.push(`${where}: ${x.path} is both mapped and excluded`);
      if (!(typeof x.reason === "string" && x.reason.trim().length >= 40)) errs.push(`${where}: excluded ${x.path} gives no reason`);
      if (typeof x.path !== "string" || !x.path.startsWith(`${p.folder}/`) || !x.path.endsWith(".json")) {
        errs.push(`${where}: excluded path ${x.path} is not a .json file inside the folder`);
      }
    }
    const pairs = Array.isArray(p.pairs) ? p.pairs : null;
    if (!pairs) errs.push(`${where}: pairs is not a list`);
    const seen = new Set();
    for (const r of pairs ?? []) {
      const at = `${where} / ${r.constant}`;
      if ("render" in r || "statementChecked" in r || "sourceSha256" in r) {
        errs.push(`${at}: asks to render, and no renderer reads this store (a note takes A-78's fields, guard, review and card)`);
      }
      if (!VERDICTS.has(r.verdict)) errs.push(`${at}: verdict ${r.verdict} is not one of ${[...VERDICTS].join(", ")}`);
      if (BOUND_VERDICTS.has(r.verdict) && !(typeof r.bound === "string" && r.bound.trim())) {
        errs.push(`${at}: verdict ${r.verdict} carries no bound`);
      }
      if (r.verdict === "implies" && !(typeof r.derivation === "string" && r.derivation.trim().length >= 40)) {
        errs.push(`${at}: verdict implies carries no derivation`);
      }
      if (r.verdict !== "does-not-bear" && !names.has(r.statementTheorem)) {
        errs.push(`${at}: verdict ${r.verdict} names no comparator theorem of this project`);
      }
      if (!(typeof r.reason === "string" && r.reason.trim().length >= 40)) errs.push(`${at}: no reason`);
      if (typeof r.constant !== "string" || !/^\d+[a-z]$/.test(r.constant) || !mirrorHas(r.constant)) {
        errs.push(`${at}: not a constant in the mirror`);
      }
      if (seen.has(r.constant)) errs.push(`${at}: constant paired twice in one project`);
      seen.add(r.constant);
    }
    if (!(typeof p.searched === "string" && p.searched.trim())) errs.push(`${where}: no searched statement, so a zero pairs would be unexplained`);
    if (typeof p.statementFile !== "string" || !p.statementFile.startsWith(`${p.folder}/`) || !p.statementFile.endsWith(".lean")) {
      errs.push(`${where}: statementFile is not a .lean file inside the folder`);
    }
  }
  if (map?.schema !== "anthropic-formal-math-map/1") errs.push("schema is not anthropic-formal-math-map/1");
  if (map?.source?.repo !== "anthropics/formal-math") errs.push("source repo is not anthropics/formal-math");
  if (!/^[0-9a-f]{40}$/.test(map?.source?.sha ?? "")) errs.push("source sha is not a full 40-hex commit");
  return errs;
}

// The project folders named in the repository README's table: rows of the form | [`x/`](x/) | ...
export function readmeProjects(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = /^\|\s*\[`([A-Za-z0-9_-]+)\/`\]\(\1\/\)\s*\|/.exec(line);
    if (m) out.push(m[1]);
  }
  return out;
}

// The repository README: "comparator.json next to the lakefile, or comparator/config*.json"; the
// 3sum-apsp and zeta23 projects also use comparator-<name>.json beside it.
export function isComparatorConfig(folder, path) {
  if (!path.startsWith(`${folder}/`)) return false;
  const rest = path.slice(folder.length + 1);
  return /^comparator(-[^/]+)?\.json$/.test(rest) || /^comparator\/config[^/]*\.json$/.test(rest);
}

function sameSet(a, b) {
  const x = [...new Set(a)].sort();
  const y = [...new Set(b)].sort();
  return x.length === a.length && y.length === b.length && JSON.stringify(x) === JSON.stringify(y);
}

// Compares the map with what the repository states at the pinned sha. Returns refusals; a fetch
// failure throws, because an unread source is UNREAD, never a match.
export async function upstreamDiffs(map, fetchText) {
  const errs = [];
  const base = `https://raw.githubusercontent.com/${map.source.repo}/${map.source.sha}`;
  const listed = readmeProjects(await fetchText(`${base}/README.md`));
  if (listed.length === 0) throw new Error("the README table yielded no project folder");
  const mapped = map.projects.map((p) => p.folder);
  if (!sameSet(listed, mapped)) errs.push(`projects differ: README lists ${listed.join(", ")}; map has ${mapped.join(", ")}`);
  // Every comparator configuration in the tree, discovered rather than taken from the map.
  const tree = JSON.parse(await fetchText(`https://api.github.com/repos/${map.source.repo}/git/trees/${map.source.sha}?recursive=1`));
  if (tree.truncated !== false || !Array.isArray(tree.tree)) throw new Error("the repository tree was truncated or unreadable");
  for (const p of map.projects) {
    const inTree = tree.tree.filter((e) => e.type === "blob" && isComparatorConfig(p.folder, e.path)).map((e) => e.path);
    if (inTree.length === 0) throw new Error(`no comparator configuration found under ${p.folder}/ (positive control failed)`);
    const accounted = new Set([...p.comparatorConfigs.map((c) => c.path), ...(p.excludedConfigs ?? []).map((x) => x.path)]);
    for (const path of inTree) if (!accounted.has(path)) errs.push(`${path}: a comparator configuration the map neither maps nor excludes`);
    for (const path of accounted) if (!inTree.includes(path)) errs.push(`${path}: named by the map but not in the tree`);
  }
  for (const p of map.projects) {
    for (const c of p.comparatorConfigs) {
      const cfg = JSON.parse(await fetchText(`${base}/${c.path}`));
      if (!Array.isArray(cfg.theorem_names)) throw new Error(`${c.path} has no theorem_names list`);
      if (!sameSet(cfg.theorem_names, c.theoremNames)) errs.push(`${c.path}: theorem_names differ from the map`);
    }
  }
  return errs;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (res.status !== 200) {
    await res.body?.cancel();
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

function summary(map) {
  const theorems = map.projects.reduce((n, p) => n + p.comparatorConfigs.reduce((m, c) => m + c.theoremNames.length, 0), 0);
  const pairs = map.projects.flatMap((p) => p.pairs);
  const by = {};
  for (const r of pairs) by[r.verdict] = (by[r.verdict] ?? 0) + 1;
  const counts = [...VERDICTS].map((v) => `${v} ${by[v] ?? 0}`).join(", ");
  return `${map.projects.length} project(s), ${theorems} comparator theorem(s), ${pairs.length} pair(s): ${counts}`;
}

function selftest() {
  const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));
  // Positive control first: the committed map holds, with a population that is not empty.
  assert.deepEqual(validate(map), [], "the committed map must validate");
  assert.ok(map.projects.length > 0 && map.projects.some((p) => p.pairs.length > 0), "the committed map must carry pairs");

  const mutate = (fn) => { const m = structuredClone(map); fn(m); return validate(m); };
  const fires = (label, fn, re) => {
    const errs = mutate(fn);
    assert.ok(errs.some((e) => re.test(e)), `${label}: expected a refusal matching ${re}, got ${JSON.stringify(errs)}`);
  };
  const p0 = (m) => m.projects.find((p) => p.pairs.length > 0);
  fires("a pair asks to render", (m) => { p0(m).pairs[0].statementChecked = true; }, /asks to render/);
  fires("a theorem listed twice", (m) => { const c = m.projects[0].comparatorConfigs[0]; c.theoremNames.push(c.theoremNames[0]); }, /listed twice/);
  fires("a config lists no theorem", (m) => { m.projects[0].comparatorConfigs[0].theoremNames = []; }, /lists no theorem/);
  fires("an unknown verdict", (m) => { p0(m).pairs[0].verdict = "bears"; }, /is not one of/);
  fires("implies with no derivation", (m) => { Object.assign(p0(m).pairs[0], { verdict: "implies", bound: "<= 3", statementTheorem: p0(m).comparatorConfigs[0].theoremNames[0] }); }, /no derivation/);
  fires("states with no bound", (m) => { Object.assign(p0(m).pairs[0], { verdict: "states", statementTheorem: p0(m).comparatorConfigs[0].theoremNames[0] }); }, /carries no bound/);
  fires("a bearing verdict naming no theorem", (m) => { p0(m).pairs[0].verdict = "bears-without-number"; }, /names no comparator theorem/);
  fires("a constant not in the mirror", (m) => { p0(m).pairs[0].constant = "999z"; }, /not a constant in the mirror/);
  fires("a constant paired twice", (m) => { const p = p0(m); p.pairs.push(structuredClone(p.pairs[0])); }, /paired twice/);
  fires("a pair with no reason", (m) => { p0(m).pairs[0].reason = "no"; }, /no reason/);
  fires("no searched statement", (m) => { m.projects[0].searched = ""; }, /no searched statement/);
  fires("a folder listed twice", (m) => { m.projects.push(structuredClone(m.projects[0])); }, /folder listed twice/);
  fires("an empty map", (m) => { m.projects = []; }, /covers nothing/);
  fires("a short sha", (m) => { m.source.sha = m.source.sha.slice(0, 7); }, /40-hex/);
  const withExcluded = (m) => m.projects.find((p) => (p.excludedConfigs ?? []).length > 0);
  assert.ok(withExcluded(map), "the committed map must exclude at least one configuration, or these two tests prove nothing");
  fires("an exclusion with no reason", (m) => { withExcluded(m).excludedConfigs[0].reason = ""; }, /gives no reason/);
  fires("a path both mapped and excluded", (m) => { const p = withExcluded(m); p.excludedConfigs[0].path = p.comparatorConfigs[0].path; }, /both mapped and excluded/);
  assert.ok(isComparatorConfig("eth", "eth/comparator.json") && isComparatorConfig("zeta23", "zeta23/comparator-xiprime.json") && isComparatorConfig("x", "x/comparator/config1.json"));
  assert.ok(!isComparatorConfig("eth", "eth/lake-manifest.json") && !isComparatorConfig("eth", "zeta23/comparator.json") && !isComparatorConfig("eth", "eth/sub/comparator.json"));

  // The upstream comparison, on fixtures (no network).
  const readme = "| Project | Statement |\n|---|---|\n| [`zeta23/`](zeta23/) | x |\n| [`3sum-apsp/`](3sum-apsp/) | y |\n| [`eth/`](eth/) | z |\n";
  assert.deepEqual(readmeProjects(readme), ["zeta23", "3sum-apsp", "eth"]);
  assert.deepEqual(readmeProjects("no table here"), []);
  return (async () => {
    const files = { "README.md": readme };
    const blobs = [];
    for (const p of map.projects) {
      for (const c of p.comparatorConfigs) { files[c.path] = JSON.stringify({ theorem_names: c.theoremNames }); blobs.push(c.path); }
      for (const x of p.excludedConfigs ?? []) blobs.push(x.path);
      blobs.push(`${p.folder}/lakefile.toml`);
    }
    const treeOf = (paths, truncated = false) => JSON.stringify({ truncated, tree: paths.map((path) => ({ type: "blob", path })) });
    files.TREE = treeOf(blobs);
    const from = (f) => async (url) => {
      const k = url.includes("/git/trees/") ? "TREE" : url.split(`${map.source.sha}/`)[1];
      if (!(k in f)) throw new Error(`no fixture ${k}`);
      return f[k];
    };
    assert.deepEqual(await upstreamDiffs(map, from(files)), [], "a matching upstream must compare clean");
    const extraCfg = { ...files, TREE: treeOf([...blobs, `${map.projects[0].folder}/comparator-new.json`]) };
    assert.ok((await upstreamDiffs(map, from(extraCfg))).some((e) => /neither maps nor excludes/.test(e)), "an unmapped configuration in the tree must be reported");
    const goneExcluded = { ...files, TREE: treeOf(blobs.filter((b) => !b.endsWith("comparator-paperstatements.json"))) };
    assert.ok((await upstreamDiffs(map, from(goneExcluded))).some((e) => /not in the tree/.test(e)), "an excluded configuration missing from the tree must be reported");
    await assert.rejects(upstreamDiffs(map, from({ ...files, TREE: treeOf(blobs, true) })), /truncated/, "a truncated tree must refuse");
    const extra = { ...files, "README.md": readme + "| [`new/`](new/) | w |\n" };
    assert.ok((await upstreamDiffs(map, from(extra))).some((e) => /projects differ/.test(e)), "a new upstream project must be reported");
    const c0 = map.projects[0].comparatorConfigs[0];
    const dropped = { ...files, [c0.path]: JSON.stringify({ theorem_names: c0.theoremNames.slice(1) }) };
    assert.ok((await upstreamDiffs(map, from(dropped))).some((e) => /theorem_names differ/.test(e)), "a changed theorem list must be reported");
    await assert.rejects(upstreamDiffs(map, from({ "README.md": "nothing" })), /no project folder/, "an unreadable README must refuse, never compare clean");
    console.log(`anthropic-formal-math selftest: PASS (committed map: ${summary(map)}; 16 refusals fire; upstream compare fires on a new project, an unmapped configuration, a missing excluded one and a changed list, and refuses an empty README or a truncated tree)`);
  })();
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--selftest")) {
    try { await selftest(); } catch (e) { console.error(`anthropic-formal-math selftest: FAIL — ${e.message}`); process.exit(1); }
    return;
  }
  const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));
  const errs = validate(map);
  if (errs.length) {
    for (const e of errs) console.log(`REFUSED: ${e}`);
    process.exit(1);
  }
  console.log(`map holds at ${map.source.repo}@${map.source.sha} (an upstream sha): ${summary(map)}`);
  if (args.includes("--upstream")) {
    let diffs;
    try { diffs = await upstreamDiffs(map, fetchText); } catch (e) {
      console.log(`UNREAD: the upstream comparison could not run (${e.message})`);
      process.exit(2);
    }
    if (diffs.length) { for (const d of diffs) console.log(`UPSTREAM DIFFERS: ${d}`); process.exit(1); }
    console.log("upstream at the pinned sha: the README's project folders equal the map's, every comparator configuration in the tree is mapped or excluded, and every mapped theorem list equals the map's");
  }
}

main();
