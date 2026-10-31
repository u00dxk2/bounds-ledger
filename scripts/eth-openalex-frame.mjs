#!/usr/bin/env node
// A-92, design decision 5: the candidate frame for results that rest on ETH, built from OpenAlex,
// and its recall measured rather than assumed.
//
// THE FRAME is the union of two legs, each one OpenAlex query whose filter string and stated count
// are stored, with one timestamp for the run:
//   - full text: works whose full text matches the phrase "exponential time hypothesis";
//   - citers: works citing Impagliazzo-Paturi 2001 ("On the complexity of k-SAT") or
//     Impagliazzo-Paturi-Zane 2001 ("Which problems have strongly exponential complexity?"). Each
//     seed is looked up by its DOI at run time and must resolve to exactly one work with that DOI,
//     so the query follows the DOI, never an OpenAlex id remembered from an earlier run.
// A leg is accepted only if (1) its date slices hold, with no id twice, exactly as many distinct
// ids as the unsliced query states, and (2) the unsliced count read again AFTER the walk equals the
// one read before it. Coverage is that exact equality; the walk builds the slices. Anything else
// refuses (exit 2) and writes nothing. LIMIT: equal-and-opposite changes in membership during the
// walk keep both counts and pass; the run timestamp is the frame's date, not an instant.
//
// RECALL is the share of the distinct OpenAlex referenced-work ids of DOI 10.1007/978-3-319-21275-3_14
// (chapter 14 of the 2015 textbook Parameterized Algorithms) that each leg holds. The references are
// not classified, so background works sit in the denominator; the figure is NOT a recall over
// ETH-dependent results, nor a bound on one. The Lokshtanov-Marx-Saurabh 2011 survey is not in
// OpenAlex (searched by title, 2026-10-30), so it is not measured here. The precision set is the
// local arXiv abstract frame (tmp/eth-pilot-2026-10-30/frame.json; 638 entries when written): how
// many of its entries OpenAlex resolves by arXiv DOI, and how many of those the frame holds. An
// entry OpenAlex does not return is counted UNREAD, never a miss.
//
// The frame lists other people's papers by id only; stdout prints counts, filters and DOIs, never a
// title or an author. By default it is written under tmp/, and it is never committed (an operator
// rule: `--out` takes any directory). Unauthenticated OpenAlex shares a small daily budget per IP,
// and a key would need an email address, which this lane does not send.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert/strict";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.openalex.org";
export const SEEDS = { IP01: "10.1006/jcss.2000.1727", IPZ01: "10.1006/jcss.2001.1774" };
export const CHAPTER14_DOI = "10.1007/978-3-319-21275-3_14";
export const PHRASE = "exponential time hypothesis";
const ARXIV_FRAME = join(ROOT, "tmp", "eth-pilot-2026-10-30", "frame.json");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const short = (id) => String(id).replace(/^https:\/\/openalex\.org\//, "");

// One leg's date slices -> its distinct ids, or a throw naming why it does not reconcile. Each slice
// is one page holding every row its own stated count names; no id may appear twice; and the
// distinct ids must equal the count stated for the whole, unsliced query.
export function reconcileLeg(name, stated, slices, statedAfter) {
  if (!Number.isInteger(stated) || stated <= 0) throw new Error(`${name}: no stated count`);
  if (statedAfter !== stated) throw new Error(`${name}: the unsliced count moved during the walk, ${stated} -> ${statedAfter}`);
  if (!slices.length) throw new Error(`${name}: no slice was read`);
  const ids = new Set();
  for (const s of slices) {
    if (s.ids.length !== s.count) throw new Error(`${name}: slice ${s.range} returned ${s.ids.length} rows against its stated ${s.count}`);
    for (const id of s.ids) {
      const k = short(id);
      if (ids.has(k)) throw new Error(`${name}: ${k} appears twice across the slices`);
      ids.add(k);
    }
  }
  if (ids.size !== stated) throw new Error(`${name}: ${ids.size} distinct ids across ${slices.length} slices against a stated count of ${stated}`);
  return { stated, ids };
}

// Recall of a reference list against the legs. Refuses an empty denominator.
export function recallFigures(refs, legs) {
  const denom = [...new Set(refs.map(short))];
  if (denom.length === 0) throw new Error("recall: the reference list is empty, so there is no denominator");
  const hit = (set) => denom.filter((id) => set.has(id)).length;
  const union = new Set([...legs.fulltext, ...legs.citers]);
  return { denominator: denom.length, fulltext: hit(legs.fulltext), citers: hit(legs.citers), union: hit(union) };
}

// A 429 is OpenAlex's per-second limit (on 2026-10-30 a 429 was followed at once by a 200 on the same
// budget). Retried up to four times with a growing wait; any other status, or a fifth 429, refuses.
async function getJson(url) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (res.status === 200) return res.json();
    await res.body?.cancel();
    if (res.status !== 429 || attempt >= 4) throw new Error(`HTTP ${res.status} for ${url}`);
    await sleep(2000 * (attempt + 1));
  }
}

// No paging at all. Cursor paging needs an API key (HTTP 401 "API key required for cursor paging",
// 2026-10-30), and page-number paging over OpenAlex's default order repeated and dropped rows (3773
// read, 3765 distinct), because no unique sort key is offered. So each query is split by
// publication-date range until every slice fits on one page of 200, and the slices must account for
// the unsliced count exactly. Each node makes one call (a 429 retry adds requests): it reads its own 200-row page and splits
// only when its stated count is larger (full-text requests cost $0.001 each against a shared $0.10
// daily budget; a count-then-fetch walk spent the day's budget on 2026-10-30 before finishing).
const DAY = 86400000;
const iso = (t) => new Date(t).toISOString().slice(0, 10);
async function pageOf(filter, perPage) {
  const j = await getJson(`${API}/works?filter=${encodeURIComponent(filter)}&per_page=${perPage}&select=id`);
  await sleep(400);
  return j;
}
async function fetchLeg(name, filter) {
  const stated = (await pageOf(filter, 1)).meta?.count;
  const slices = [];
  const walk = async (from, to) => {
    const f = `${filter},from_publication_date:${iso(from)},to_publication_date:${iso(to)}`;
    const j = await pageOf(f, 200);
    const count = j.meta?.count;
    if (count === 0) return;
    if (count <= 200) {
      slices.push({ range: `${iso(from)}..${iso(to)}`, count, ids: (j.results ?? []).map((r) => r.id) });
      return;
    }
    if (to - from < DAY) throw new Error(`${name}: ${count} works dated ${iso(from)} alone, more than one page holds`);
    const mid = from + Math.floor((to - from) / DAY / 2) * DAY;
    await walk(from, mid);
    await walk(mid + DAY, to);
  };
  await walk(Date.UTC(1900, 0, 1), Date.UTC(new Date().getUTCFullYear() + 1, 11, 31));
  const statedAfter = (await pageOf(filter, 1)).meta?.count;
  return { filter, ...reconcileLeg(name, stated, slices, statedAfter), slices: slices.length };
}

async function workByDoi(doi) {
  const j = await getJson(`${API}/works?filter=doi:${encodeURIComponent(doi)}&select=id,doi,referenced_works`);
  if (j.results?.length !== 1) throw new Error(`DOI ${doi}: ${j.results?.length ?? 0} works, expected exactly 1`);
  const w = j.results[0];
  if (String(w.doi).toLowerCase() !== `https://doi.org/${doi}`.toLowerCase()) throw new Error(`DOI ${doi}: OpenAlex returned ${w.doi}`);
  return w;
}

function mtDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Denver" }).format(new Date());
}

async function run(outDir) {
  const fetchedAt = new Date().toISOString();
  const seeds = {};
  for (const [k, doi] of Object.entries(SEEDS)) seeds[k] = short((await workByDoi(doi)).id);
  const fulltextFilter = `fulltext.search:"${PHRASE}"`;
  const citersFilter = `cites:${seeds.IP01}|${seeds.IPZ01}`;
  const fulltext = await fetchLeg("fulltext", fulltextFilter);
  const citers = await fetchLeg("citers", citersFilter);
  const union = new Set([...fulltext.ids, ...citers.ids]);

  const ch14 = await workByDoi(CHAPTER14_DOI);
  const recall = recallFigures(ch14.referenced_works ?? [], { fulltext: fulltext.ids, citers: citers.ids });

  // The arXiv precision set, resolved through the arXiv DOIs (10.48550/arXiv.<id>), 50 per request.
  let arxiv = null;
  if (existsSync(ARXIV_FRAME)) {
    const entries = JSON.parse(readFileSync(ARXIV_FRAME, "utf8")).entries.map((e) => e.id);
    const resolved = new Map();
    for (let i = 0; i < entries.length; i += 50) {
      const batch = entries.slice(i, i + 50);
      const j = await getJson(`${API}/works?filter=doi:${batch.map((id) => `10.48550/arxiv.${id}`).join("|")}&per_page=200&select=id,doi`);
      for (const w of j.results ?? []) resolved.set(String(w.doi).toLowerCase().replace("https://doi.org/10.48550/arxiv.", ""), short(w.id));
      await sleep(150);
    }
    const inFrame = [...resolved.values()].filter((id) => union.has(id)).length;
    arxiv = { entries: entries.length, resolved: resolved.size, unread: entries.length - resolved.size, inFrame };
  }

  mkdirSync(outDir, { recursive: true });
  const record = {
    fetchedAt,
    seeds,
    legs: {
      fulltext: { filter: fulltextFilter, stated: fulltext.stated, distinct: fulltext.ids.size, slices: fulltext.slices },
      citers: { filter: citersFilter, stated: citers.stated, distinct: citers.ids.size, slices: citers.slices },
    },
    union: union.size,
    overlap: fulltext.ids.size + citers.ids.size - union.size,
    recallChapter14: { work: short(ch14.id), ...recall },
    arxivPrecisionSet: arxiv,
    ids: { fulltext: [...fulltext.ids], citers: [...citers.ids] },
  };
  writeFileSync(join(outDir, "openalex-frame.json"), JSON.stringify(record, null, 2) + "\n");
  console.log(`fetched ${fetchedAt}; seeds IP01=${seeds.IP01} IPZ01=${seeds.IPZ01}`);
  console.log(`full text  ${fulltextFilter}: stated ${fulltext.stated}, distinct ${fulltext.ids.size} (reconciled over ${fulltext.slices} date slices)`);
  console.log(`citers     ${citersFilter}: stated ${citers.stated}, distinct ${citers.ids.size} (reconciled over ${citers.slices} date slices)`);
  console.log(`union ${union.size} (overlap ${record.overlap})`);
  console.log(`share of the ${recall.denominator} distinct OpenAlex references of DOI ${CHAPTER14_DOI} (${record.recallChapter14.work}; unclassified, so not a recall over ETH-dependent results): full text ${recall.fulltext}, citers ${recall.citers}, union ${recall.union}`);
  if (arxiv) console.log(`arXiv precision set: ${arxiv.entries} entries, ${arxiv.resolved} resolved by OpenAlex (${arxiv.unread} UNREAD), ${arxiv.inFrame} of the resolved in the union`);
  else console.log("arXiv precision set: UNREAD (the local frame file is absent)");
  console.log(`written to ${join(outDir, "openalex-frame.json")} (local; never commit)`);
}

function selftest() {
  const slice = (range, count, ids) => ({ range, count, ids: ids.map((id) => `https://openalex.org/${id}`) });
  // Positive control: a leg that reconciles.
  const ok = reconcileLeg("t", 3, [slice("a", 2, ["W1", "W2"]), slice("b", 1, ["W3"])], 3);
  assert.equal(ok.ids.size, 3);
  // The refusals, meaning first.
  assert.throws(() => reconcileLeg("t", 3, [slice("a", 2, ["W1", "W2"]), slice("b", 1, ["W3"])], 4), /moved during the walk, 3 -> 4/, "a count that moved during the walk must refuse");
  assert.throws(() => reconcileLeg("t", 3, [slice("a", 2, ["W1", "W2"]), slice("b", 1, ["W2"])], 3), /appears twice/, "an id seen twice must refuse");
  assert.throws(() => reconcileLeg("t", 3, [slice("a", 2, ["W1", "W2"])], 3), /2 distinct ids across 1 slices against a stated count of 3/, "slices short of the whole must refuse");
  assert.throws(() => reconcileLeg("t", 2, [slice("a", 2, ["W1", "W2"]), slice("b", 1, ["W3"])], 2), /3 distinct ids across 2 slices against a stated count of 2/, "slices past the whole must refuse");
  assert.throws(() => reconcileLeg("t", 3, [slice("a", 3, ["W1", "W2"]), slice("b", 1, ["W3"])], 3), /returned 2 rows against its stated 3/, "a slice short of its own count must refuse");
  assert.throws(() => reconcileLeg("t", 3, [], 3), /no slice was read/, "no slices must refuse");
  assert.throws(() => reconcileLeg("t", 0, [], 0), /no stated count/, "a zero count must refuse, never read as an empty frame");
  // Recall: figures, and a refusal on an empty denominator.
  const r = recallFigures(["https://openalex.org/W1", "W2", "W3", "W4"], { fulltext: new Set(["W1", "W2"]), citers: new Set(["W2", "W3"]) });
  assert.deepEqual(r, { denominator: 4, fulltext: 2, citers: 2, union: 3 });
  assert.throws(() => recallFigures([], { fulltext: new Set(), citers: new Set() }), /no denominator/);
  console.log("eth-openalex-frame selftest: PASS (a reconciling leg passes; a count that moved during the walk, an id seen twice, a shortfall, a surplus, a short slice, no slices and a zero count each refuse; recall counts the union and refuses an empty denominator)");
}

const args = process.argv.slice(2);
if (args.includes("--selftest")) {
  try { selftest(); } catch (e) { console.error(`eth-openalex-frame selftest: FAIL — ${e.message}`); process.exit(1); }
} else if (args.includes("--fetch")) {
  const i = args.indexOf("--out");
  const out = i >= 0 ? args[i + 1] : join(ROOT, "tmp", "eth-openalex-frame", mtDate());
  try { await run(out); } catch (e) { console.log(`REFUSED: ${e.message} (nothing written)`); process.exit(2); }
} else {
  console.log("usage: node scripts/eth-openalex-frame.mjs --fetch [--out <dir>] | --selftest");
  process.exit(2);
}
