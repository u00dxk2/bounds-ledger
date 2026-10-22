#!/usr/bin/env node
// A-83: the OPEN pull requests on the mirrored repository (teorth/optimizationproblems) that change a
// constant's file, shown on that constant's c/ page.
//
// WHY. The mirrored bound cells follow upstream's MERGED table. On 2026-10-16 the arXiv-only watch
// (A-81) found a construction for 1b while upstream pull request 225 already proposed a stronger bound:
// the watch's scope could never see it. An open pull request on the mirrored repository is the nearest
// place a change to a constant appears before the mirror moves, so a reader asking "is anyone already
// proposing a change to this bound?" gets the answer on the page they cite from.
//
// WHAT IS STORED (ledger/open-pull-requests.json). The read's instant, the raw count, and per pull
// request only its number, its opening date, the constant files it changes, and whether this ledger
// opened it. NO TITLE AND NO AUTHOR NAME: a title is someone else's unverified claim about a bound, and
// one open title on 2026-10-22 carried the word "record", which every page bans.
//
// WHAT THE PAGE SAYS. That the pull request changes this constant's file upstream, that it was open and
// not merged when we read the list (dated), that the list does not say what it proposes, and that the
// rows on the page come from the source table's merged version (true by construction: the mirror reads
// upstream's main branch). Nothing about what a pull request proposes, because "changes the file" is
// all the stored fields support: 234 is an archive pointer and 244 a citation fix.
//
// WHAT IT REFUSES. A listing of 200 or more (gh's --limit 200 may have truncated it), an empty listing
// (a zero from a dead read is indistinguishable from a measured one; this repository has never had
// none open since we mirrored it), a count that does not reconcile, and any row not entirely in the
// shape the read asked for (the stated rule in buildStore: OPEN, a complete file list, and every file
// entry ADDED, MODIFIED or DELETED with a path), and a malformed or impossible number, date or
// constant id. Each refusal refuses the whole fetch; nothing partial is ever written.
//
// REFRESH. `node scripts/open-pulls.mjs --fetch`, then render-constant-pages. `npm run resnap` runs it,
// because a pull request that merges into a constant's file is exactly what turns the drift alarm red.
// Between refreshes the page's date says how old the list is. Read-only: commenting on a pull request
// stays behind the outward gate.

import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { esc } from "./lib/html.mjs";
import { isEntryModule } from "./lib/entry-module.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const STORE = join(ROOT, "ledger", "open-pull-requests.json");
export const UPSTREAM = "teorth/optimizationproblems";
const OURS = "u00dxk2"; // the account this ledger publishes from; its pull requests are ours
export const LIMIT = 200;
const FORBIDDEN = /\brecords?\b/i;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const CONSTANT_FILE = /^constants\/([A-Za-z0-9]+)\.md$/;
const CONSTANT_ID = /^[A-Za-z0-9]+$/;
const FILE_CHANGES = new Set(["ADDED", "MODIFIED", "DELETED"]);
// A format match is not a date: "2026-99-99" and "2026-02-30" both match (Codex r1 #4). A value counts only
// when Date parses it AND prints it back unchanged, so a rollover (Feb 30 → Mar 2) is refused too.
const realInstant = (s) => ISO_INSTANT.test(String(s)) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 19) === String(s).slice(0, 19);
const realDay = (s) => ISO_DAY.test(String(s)) && realInstant(`${s}T00:00:00Z`);

/** The MT calendar day of an instant: the lane labels dates in Mountain Time. */
export const mtDay = (iso) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Denver", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));

/**
 * gh's JSON rows → the store. Throws (with a sentence) on anything it will not store.
 * @param {Array<{number:number, state?:string, createdAt:string, files?:Array<{path:string}>, author?:{login?:string}}>} rows
 */
export function buildStore(rows, readAt) {
  if (!Array.isArray(rows)) throw new Error("the listing is not an array");
  if (!realInstant(readAt)) throw new Error("readAt must be an ISO instant");
  if (rows.length === 0) throw new Error("the listing is empty: a zero from a dead read looks the same as a measured one, so nothing was written");
  if (rows.length >= LIMIT) throw new Error(`the listing has ${rows.length} rows, at gh's --limit ${LIMIT}, so it may be truncated; nothing was written`);
  // ONE STATED RULE, NOT A LIST OF GAPS (Codex r2, the second round to find a way a constant can go
  // silently missing from its page: a rename, an entry with no path, a row with no state). A row is
  // stored only when it is entirely in the shape the read asked for, and ANY departure refuses the whole
  // fetch, so the failure is loud and nothing partial is written:
  //   - state is exactly "OPEN" (the read is --state open, so anything else is the read misbehaving);
  //   - files is a list exactly as long as changedFiles (gh returns at most 100 files each, Codex r1 #1);
  //   - every file entry has a non-empty string path and a changeType of ADDED, MODIFIED or DELETED, the
  //     kinds where the path IS the file changed. A RENAMED or COPIED entry names only its destination,
  //     so its source constant could not be placed; it is refused, not guessed.
  const pulls = [];
  for (const r of rows) {
    if (!r || !Number.isInteger(r.number) || r.number < 1) throw new Error(`a row has no valid pull request number: ${JSON.stringify(r?.number)}`);
    if (r.state !== "OPEN") throw new Error(`pull request ${r.number} has state ${JSON.stringify(r.state)} in a listing of open pull requests; nothing was written`);
    if (!realInstant(r.createdAt)) throw new Error(`pull request ${r.number} has no valid createdAt`);
    if (!Array.isArray(r.files)) throw new Error(`pull request ${r.number} has no file list`);
    if (!Number.isInteger(r.changedFiles) || r.files.length !== r.changedFiles) throw new Error(`pull request ${r.number} lists ${r.files.length} file(s) but reports ${r.changedFiles} changed, so its file list may be incomplete; nothing was written`);
    for (const f of r.files) {
      if (!f || typeof f.path !== "string" || !f.path || !FILE_CHANGES.has(f?.changeType)) throw new Error(`pull request ${r.number} has a file entry outside the stated rule (path ${JSON.stringify(f?.path)}, changeType ${JSON.stringify(f?.changeType)}); only ADDED, MODIFIED or DELETED entries with a path are placed, so nothing was written`);
    }
    const constants = [...new Set(r.files.map((f) => CONSTANT_FILE.exec(f.path)?.[1]).filter(Boolean))].sort();
    pulls.push({ number: r.number, createdOn: r.createdAt.slice(0, 10), constants, byThisLedger: r.author?.login === OURS });
  }
  pulls.sort((a, b) => b.number - a.number);
  return { purpose: "Open pull requests on teorth/optimizationproblems and the constant files each changes (A-83), read by scripts/open-pulls.mjs --fetch and shown on each constant's c/ page. Numbers, dates and file names only: no titles and no author names.", repository: UPSTREAM, readAt, count: pulls.length, pulls };
}

/** Every problem with the store, as sentences. Empty means valid. */
export function validateStore(s) {
  const errs = [];
  if (!s || typeof s !== "object" || Array.isArray(s)) return ["the store is not an object"];
  if (s.repository !== UPSTREAM) errs.push(`repository must be ${UPSTREAM}`);
  if (!realInstant(s.readAt || "")) errs.push("readAt must be an ISO instant");
  if (!Array.isArray(s.pulls)) return [...errs, "pulls must be an array"];
  if (s.count !== s.pulls.length) errs.push(`count (${s.count}) does not reconcile with the ${s.pulls.length} stored pull request(s)`);
  if (!s.pulls.length) errs.push("the store holds no pull request; an empty read is refused at fetch, so this file was not written by it");
  if (s.pulls.length >= LIMIT) errs.push(`${s.pulls.length} pull requests is at gh's --limit ${LIMIT}; the read may be truncated`);
  const seen = new Set();
  for (const [i, p] of s.pulls.entries()) {
    const at = `pull #${i + 1}`;
    if (!p || typeof p !== "object") { errs.push(`${at} is not an object`); continue; }
    if (!Number.isInteger(p.number) || p.number < 1) errs.push(`${at}: number must be a positive integer`);
    else if (seen.has(p.number)) errs.push(`${at}: pull request ${p.number} is listed twice`);
    seen.add(p.number);
    if (!realDay(p.createdOn || "")) errs.push(`${at}: createdOn must be a YYYY-MM-DD date`);
    if (!Array.isArray(p.constants) || !p.constants.every((c) => typeof c === "string" && CONSTANT_ID.test(c))) errs.push(`${at}: constants must be an array of constant ids`);
    if (typeof p.byThisLedger !== "boolean") errs.push(`${at}: byThisLedger must be true or false`);
  }
  return errs;
}

/** Load the store. An absent file means no block, never a crash; a present one is the caller's to validate. */
export function loadStore(path = STORE) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}

/** The open pull requests that change one constant's file, newest first. */
export function pullsFor(id, store = loadStore()) {
  return store && Array.isArray(store.pulls) ? store.pulls.filter((p) => Array.isArray(p.constants) && p.constants.includes(id)) : [];
}

/** The constant-page block: a <dt>/<dd> pair for the page's <dl>. Empty string when none. */
export function pullsBlock(id, store = loadStore()) {
  const list = pullsFor(id, store);
  if (!list.length) return "";
  const many = list.length > 1;
  const items = list.map((p) => `<li><a href="${esc(`https://github.com/${UPSTREAM}/pull/${p.number}`)}">pull request ${esc(String(p.number))}</a>, opened ${esc(p.createdOn)}${p.byThisLedger ? ", by this ledger" : ""}</li>`).join("");
  // Claims less after Codex r1 #3: the first wording said "we have not checked changes proposed by others"
  // and "the rows above include none of these changes". Neither is established by a listing (another
  // merge can carry part of an open request's change, and a newer-results entry can evaluate one), so
  // the block now says only what the listing and the mirror's own mechanism establish.
  return `<dt>Open pull ${many ? "requests that change" : "request that changes"} this constant's file upstream</dt><dd><ul class="oai">${items}</ul><span class="when">${many ? "Each was" : "It was"} open and not merged when we read the source repository's list on ${esc(mtDay(store.readAt))}. This list does not say what ${many ? "any of them proposes" : "it proposes"}. The rows above come from the source table's merged version.</span></dd>`;
}

function fetchListing() {
  const r = spawnSync("gh", ["pr", "list", "-R", UPSTREAM, "--state", "open", "--limit", String(LIMIT), "--json", "number,state,createdAt,files,changedFiles,author"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error || r.status !== 0) throw new Error(`gh pr list could not run (exit ${r.status ?? "none"}); nothing was written`);
  return JSON.parse(r.stdout);
}

// ---------- selftest (network-free; KP-78: each rule fires, and stays silent on the legal case) ----------

export async function selftest() {
  let failed = 0;
  const check = (label, ok) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${label}`); };
  const at = "2026-10-22T14:40:00Z";
  const fixture = [
    { number: 249, state: "OPEN", createdAt: "2026-10-22T13:30:33Z", author: { login: "someone" }, files: [{ path: "README.md" }, { path: "constants/31a.md" }] },
    { number: 250, state: "OPEN", createdAt: "2026-10-22T15:00:00Z", author: { login: "someone" }, files: [{ path: "README.md" }] },
    { number: 244, state: "OPEN", createdAt: "2026-10-20T18:25:00Z", author: { login: OURS }, files: [{ path: "constants/13a.md" }] },
    { number: 223, state: "OPEN", createdAt: "2026-10-12T17:19:54Z", author: { login: "someone" }, files: [{ path: "constants/13a.md" }, { path: "constants/1a.md" }, { path: "constants/1a.md" }] },
    // Codex r1 #5: a row WITH a title, hostile markup and the banned word in it, so the no-title rule is tested on real input.
    { number: 251, state: "OPEN", createdAt: "2026-10-22T16:00:00Z", title: '<script>alert(1)</script> new record for 2a', author: { login: "someone" }, files: [{ path: "constants/2a.md" }] },
  ].map((r) => ({ ...r, changedFiles: r.files.length, files: r.files.map((f) => ({ ...f, changeType: "MODIFIED" })) }));
  const merged = { number: 225, state: "MERGED", createdAt: "2026-10-13T10:00:00Z", changedFiles: 1, files: [{ path: "constants/1b.md", changeType: "MODIFIED" }] };
  const closed = { ...merged, number: 230, state: "CLOSED" };
  const s = buildStore(fixture, at);
  // Meaning first: what a reader would be told, then the bookkeeping that supports it.
  check("an open pull request that changes constants/31a.md appears on 31a's page", pullsBlock("31a", s).includes('href="https://github.com/teorth/optimizationproblems/pull/249"'));
  check("an open pull request that changes only README.md appears on no constant's page", !["31a", "13a", "1a", "1b"].some((id) => pullsBlock(id, s).includes("/pull/250")) && s.pulls.some((p) => p.number === 250 && p.constants.length === 0));
  // A closed or merged pull request never reaches a page: one in the listing REFUSES the whole fetch
  // (Codex r2 #3; the read asks gh for open ones only, so a non-OPEN row means the read misbehaved).
  const refusesAt = (rows, frag) => { try { buildStore(rows, at); return false; } catch (e) { return e.message.includes(frag); } };
  check("a MERGED or CLOSED pull request appears on no page: the fetch that carries one is refused", pullsBlock("1b", s) === "" && refusesAt([...fixture, merged], 'state "MERGED"') && refusesAt([...fixture, closed], 'state "CLOSED"'));
  check("this ledger's own pull request is labelled as ours, and another's is not", /pull\/244"[^<]*>pull request 244<\/a>, opened 2026-10-20, by this ledger</.test(pullsBlock("13a", s)) && !/pull request 223<\/a>, opened 2026-10-12, by this ledger/.test(pullsBlock("13a", s)));
  check("the page says the list does not say what they propose, and where the rows above come from", pullsBlock("13a", s).includes("This list does not say what any of them proposes. The rows above come from the source table's merged version.") && pullsBlock("31a", s).includes("This list does not say what it proposes."));
  check("Codex r1 #3: neither unsupported negative claim survives in any variant", ["13a", "31a", "1a"].every((id) => !/have not checked|include none of/.test(pullsBlock(id, s))));
  check("the date shown is the MT day of the read", pullsBlock("31a", s).includes("when we read the source repository's list on 2026-10-22") && mtDay("2026-10-23T03:00:00Z") === "2026-10-22");
  check("one pull request renders the singular, two the plural", pullsBlock("31a", s).includes("Open pull request that changes this constant's file upstream") && pullsBlock("31a", s).includes("It was open") && pullsBlock("13a", s).includes("Open pull requests that change") && pullsBlock("13a", s).includes("Each was open"));
  check("a constant file listed twice in one pull request is stored once", s.pulls.find((p) => p.number === 223).constants.join(",") === "13a,1a");
  check("newest first", pullsFor("13a", s).map((p) => p.number).join(",") === "244,223");
  check("positive control: the titled row is stored, on 2a", pullsFor("2a", s).some((p) => p.number === 251));
  check("no title and no author name is stored, though the input carried both", !JSON.stringify(s).includes("someone") && !JSON.stringify(s).includes(OURS) && !JSON.stringify(s).includes("alert(1)") && !s.pulls.some((p) => "title" in p || "author" in p));
  check("no block ever says 'record' or carries the title's markup, though one input title did", ["31a", "13a", "2a"].every((id) => !FORBIDDEN.test(pullsBlock(id, s)) && !pullsBlock(id, s).includes("<script")));
  check("a constant with no open pull request gets no block", pullsBlock("9z", s) === "" && pullsBlock("9z", null) === "");
  check("the built store validates (the silent half)", validateStore(s).length === 0);
  const refuses = (rows, frag) => { try { buildStore(rows, at); return false; } catch (e) { return e.message.includes(frag); } };
  check("REFUSES an empty listing", refuses([], "empty"));
  check(`REFUSES a listing of ${LIMIT} rows (possibly truncated)`, refuses(Array.from({ length: LIMIT }, (_, i) => ({ number: i + 1, state: "OPEN", createdAt: at, changedFiles: 0, files: [] })), "truncated"));
  // Codex r2, the stated rule: each departure it reproduced refuses the fetch, and a legal DELETED or ADDED entry is placed.
  check("r2 #3: REFUSES a row with no state, and a row whose state is unknown", refuses([{ ...fixture[0], state: undefined }], "state undefined") && refuses([{ ...fixture[0], state: "DRAFT" }], 'state "DRAFT"'));
  check("r2 #1: REFUSES a RENAMED or COPIED entry, whose source constant cannot be placed", refuses([{ ...fixture[0], changedFiles: 1, files: [{ path: "archive/1d.md", changeType: "RENAMED" }] }], "outside the stated rule") && refuses([{ ...fixture[0], changedFiles: 1, files: [{ path: "constants/1e.md", changeType: "COPIED" }] }], "outside the stated rule"));
  check("r2 #2: REFUSES a file entry with no path, an empty path, or no entry at all", [[{}], [null], [{ path: "", changeType: "MODIFIED" }], [{ path: "constants/1d.md" }]].every((files) => refuses([{ ...fixture[0], changedFiles: 1, files }], "outside the stated rule")));
  const legal = buildStore([{ ...fixture[0], changedFiles: 2, files: [{ path: "constants/1d.md", changeType: "DELETED" }, { path: "constants/99z.md", changeType: "ADDED" }] }], at);
  check("the silent half: DELETED and ADDED entries with a path are placed on their constants", pullsFor("1d", legal).length === 1 && pullsFor("99z", legal).length === 1);
  check("REFUSES a row with no valid number", refuses([{ ...fixture[0], number: "249" }], "no valid pull request number"));
  // Codex r1 #1 and #4, each from its reproduction.
  check("r1 #1: REFUSES a pull request whose file list is shorter than its changed-file count (gh's 100-file cap)", refuses([{ ...fixture[0], files: Array.from({ length: 100 }, (_, i) => ({ path: `assets/${i}.txt` })), changedFiles: 101 }], "may be incomplete"));
  check("r1 #1: REFUSES a pull request with no file list, never reading it as 'changes no constant'", refuses([{ ...fixture[0], files: undefined }], "no file list") && refuses([{ ...fixture[0], files: null }], "no file list"));
  check("r1 #1: REFUSES a pull request with no changed-file count", refuses([{ ...fixture[0], changedFiles: undefined }], "may be incomplete"));
  check("r1 #4: REFUSES an impossible read instant and an impossible opening instant", refuses(fixture, "never") === false && (() => { try { buildStore(fixture, "2026-99-99T15:00:00Z"); return false; } catch (e) { return e.message.includes("readAt"); } })() && refuses([{ ...fixture[0], createdAt: "2026-02-30T10:00:00Z" }], "createdAt"));
  check("r1 #4: validation REFUSES an impossible readAt or createdOn in a stored file", validateStore({ ...s, readAt: "2026-99-99T15:00:00Z" }).some((e) => e.includes("readAt")) && validateStore({ ...s, pulls: [{ ...s.pulls[0], createdOn: "2026-02-30" }], count: 1 }).some((e) => e.includes("createdOn")));
  const bad = (patch) => validateStore({ ...s, ...patch });
  check("validation REFUSES a count that does not reconcile", bad({ count: s.count + 1 }).some((e) => e.includes("does not reconcile")));
  check("validation REFUSES another repository", bad({ repository: "someone/optimizationproblems" }).some((e) => e.includes("repository must be")));
  check("validation REFUSES a duplicated pull request", bad({ pulls: [s.pulls[0], s.pulls[0]], count: 2 }).some((e) => e.includes("listed twice")));
  check("validation REFUSES a hostile constant id (it would reach a page)", bad({ pulls: [{ ...s.pulls[0], constants: ['31a"><script>'] }], count: 1 }).some((e) => e.includes("constant ids")));
  check("validation REFUSES an empty store", bad({ pulls: [], count: 0 }).some((e) => e.includes("holds no pull request")));
  // The committed store, and the guard over real pages: with the store, minus exactly the block, a
  // page is byte for byte the page without it, so no bound cell can differ because a pull request exists.
  const store = loadStore();
  const real = validateStore(store);
  check(`the committed store validates (${real.length} problem(s)${real.length ? ": " + real.join("; ") : ""})`, store !== null && real.length === 0);
  const pages = await import("./render-constant-pages.mjs");
  const site = await import("./render-site.mjs");
  const claims = JSON.parse(readFileSync(join(ROOT, "ledger", "claims.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(join(ROOT, "ledger", "teorth-optimizationproblems", "manifest.json"), "utf8"));
  const rows = site.buildRows(claims, { withDates: false, root: ROOT });
  const touched = [...new Set((store?.pulls || []).flatMap((p) => p.constants))].filter((id) => rows.some((r) => r.id === id));
  check(`positive control: the committed store touches at least one mirrored constant (${touched.length})`, touched.length > 0);
  const guardErrs = [];
  for (const id of touched) {
    const r = rows.find((x) => x.id === id);
    const a = pages.renderPage(r, manifest.sha, undefined, undefined, store);
    const b = pages.renderPage(r, manifest.sha, undefined, undefined, null);
    const block = pullsBlock(id, store);
    if (!block || !a.includes(block)) guardErrs.push(`${id}: the page does not carry its block`);
    else if (a.replace(block, "") !== b) guardErrs.push(`${id}: the page differs from its no-block render by more than the block`);
  }
  check(`the bound-cell guard holds on every page an open pull request touches (${guardErrs.length} problem(s)${guardErrs.length ? ": " + guardErrs.slice(0, 3).join("; ") : ""})`, guardErrs.length === 0);
  // Through main(): render-constant-pages --check must REFUSE an invalid store before composing anything.
  const dir = mkdtempSync(join(tmpdir(), "open-pulls-"));
  try {
    writeFileSync(join(dir, "bad.json"), JSON.stringify({ ...store, count: (store?.count || 0) + 1 }));
    const child = spawnSync(process.execPath, [join(ROOT, "scripts", "render-constant-pages.mjs"), "--check"], { encoding: "utf8", env: { ...process.env, CC_OPEN_PULLS_STORE: join(dir, "bad.json") } });
    check("render-constant-pages --check REFUSES an invalid store through main(), exit 1, before composing", child.status === 1 && child.stdout.includes("the open-pull-requests store is invalid, so nothing was composed or written"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log(failed ? `RESULT: FAIL — ${failed} case(s) (exit 3)` : "RESULT: PASS — listing rules, page block and the bound-cell guard (exit 0)");
  return failed ? 3 : 0;
}

if (isEntryModule(import.meta.url)) {
  const argv = process.argv.slice(2);
  if (argv.includes("--selftest")) selftest().then((c) => { process.exitCode = c; }, (err) => { console.error(`open-pulls: ${err.message}`); process.exitCode = 2; });
  else if (argv.includes("--fetch")) {
    try {
      const s = buildStore(fetchListing(), new Date().toISOString().replace(/\.\d+Z$/, "Z"));
      const errs = validateStore(s);
      if (errs.length) throw new Error(errs.join("; "));
      writeFileSync(STORE, JSON.stringify(s, null, 2) + "\n");
      const touched = new Set(s.pulls.flatMap((p) => p.constants));
      console.log(`open-pulls: ${s.count} open pull request(s) on ${UPSTREAM} (every row OPEN with a complete file list, or this run would have refused), ${s.pulls.filter((p) => p.constants.length).length} changing a constant file, ${touched.size} distinct constant(s); wrote ledger/open-pull-requests.json`);
      console.log("RESULT: PASS (exit 0)");
    } catch (e) {
      console.log(`RESULT: REFUSED — open-pulls: ${e.message} (exit 2)`);
      process.exitCode = 2;
    }
  } else {
    const errs = validateStore(loadStore());
    console.log(errs.length ? `RESULT: FAIL — ${errs.length} problem(s): ${errs.join("; ")} (exit 1)` : "RESULT: PASS — the open-pull-requests store validates (exit 0)");
    process.exitCode = errs.length ? 1 : 0;
  }
}
