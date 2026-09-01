#!/usr/bin/env node
// Claim-level re-verification: every ledger claim names a source URL and an exact string
// that must still appear there. Complements reverify.mjs — that one mirrors ONE surface and
// reports any change; this one pins the SPECIFIC values we assert, across every surface we
// cite (Tao's repo at HEAD, arXiv abstracts, Wikipedia). Cross-surface drift is what produced
// the lane's founding finding; a same-repo mirror diff would never have caught it.
//
// usage: check-claims.mjs [--selftest]
// exit 0 = all fetchable claims hold · 1 = a claim no longer holds · 2 = error
// `manual: true` claims (source blocks automated fetch from CI) are reported UNVERIFIED, never
// green — but an ADVISORY fetch is attempted and its result printed, because the block is
// IP-dependent (403 from datacenter IPs, 200 from residential). The advisory line never changes
// counts or the exit code: a local run gains real information, CI output gains one honest line.

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fetchWithRetry } from "./reverify.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLAIMS = join(ROOT, "ledger", "claims.json");

const stripTags = (s) => s.replace(/<[^>]*>/g, "");
const squash = (s) => s.replace(/\s+/g, " ");

// A claim holds if its expected string survives in the raw body OR with tags stripped
// (values split across markup) — both whitespace-collapsed.
//
// BLIND CLASS — this is a PRESENCE test, so on its own it can only ever see a pin DISAPPEAR.
// It is structurally incapable of firing when a source ADDS a new, better bound while leaving
// the pinned text in place. For the generated pins that is covered: their sources are mirrored,
// and reverify.mjs sees any added line. Off-mirror sources have no such backstop, and "a new
// record appeared alongside the old one" is this lane's north-star event.
//
// PIN-A-NEGATIVE (A-11 leg b) closes it wherever the source is STRUCTURED: a claim may carry
// `nothingAfter`, the exact text that must still immediately FOLLOW its expected string. An
// insertion between the two breaks the pin, so the addition becomes visible. Implemented as
// plain concatenation — the matcher is unchanged; only what we ask of it is stronger.
//
// STILL BLIND, permanently: C-4/C-5 (arXiv prose, no stable structure to anchor a tail on) and
// C-7/C-9 (erdosproblems.com, the 403 surface, `manual: true` so nothing here fetches it in CI).
// Those four stay at option (c) — accepted and documented — per A-11.
function holds(body, expect) {
  const want = squash(expect);
  return squash(body).includes(want) || squash(stripTags(body)).includes(want);
}

// What a claim actually asserts: its value, plus (for a negative pin) the text that must still
// follow it. Kept in one place so the run loop and the break message cannot disagree.
const wanted = (c) => (c.nothingAfter ? c.expect + c.nothingAfter : c.expect);

// The verdict for one fetched body. Exported to the selftest so the branch that ships is the
// branch that gets tested — a copy of this logic in the test would prove nothing about the run.
//   "hold"  — the claim still holds
//   "added" — negative pin only: the value survives but something now sits below it
//   "gone"  — the pinned value itself is no longer present
function classify(body, c) {
  if (holds(body, wanted(c))) return "hold";
  if (c.nothingAfter && holds(body, c.expect)) return "added";
  return "gone";
}

function selftest() {
  const assert = (cond, msg) => { if (!cond) { console.error(`selftest FAIL: ${msg}`); process.exit(1); } };
  assert(holds("the bound is 0.380868 today", "0.380868"), "plain substring should hold");
  assert(holds("0.380<span>868</span>", "0.380868"), "tag-split value should hold");
  assert(holds("bound\n  is  0.380868", "bound is 0.380868"), "whitespace-collapsed phrase should hold");
  assert(!holds("the bound is 0.380871", "0.380868"), "absent value must NOT hold");
  assert(!holds("", "0.380868"), "empty body must NOT hold");
  // Blind class, asserted so it cannot be forgotten: on a claim with NO negative pin, a source
  // that ADDS a better bound below the pinned one still reads as holding. This test PASSING is
  // the defect, not the fix — it pins what a bare presence test cannot see, which is still the
  // permanent state of C-4/C-5 (arXiv prose) and C-7/C-9 (the 403 surface). See holds().
  assert(holds("upper bound 0.380868\n| $0.379005$ | [NEW2026] |", "0.380868"),
    "BLIND CLASS: an added better bound leaves a bare pin green — a presence test cannot see additions");

  // PIN-A-NEGATIVE, both sides demonstrated (W-4 / KP-78). Fixture is the real shape of the
  // wikitext table C-10 pins: record rows, then the table terminator.
  const row = (v, who) => `|-\n|<math>M(n) < (1+o(1)) ${v}... n</math>||${who}||2026`;
  const LAST = row("0.380868", "SimpleTES (Ye et al.)");
  const table = (...extra) => `{| class="wikitable"\n${row("0.380876", "TTT-Discover")}\n${LAST}${extra.join("")}\n|}`;
  const neg = { expect: LAST.split("\n")[1], nothingAfter: "\n|}" };

  assert(classify(table(), neg) === "hold",
    "negative pin must stay SILENT when the pinned row is still last");
  assert(classify(table("\n" + row("0.380800", "Somebody 2027")), neg) === "added",
    "negative pin must FIRE when a new record row is inserted below the pinned one");
  assert(classify(table().replace(neg.expect, row("0.380800", "Somebody 2027").split("\n")[1]), neg) === "gone",
    "a pinned row that is REPLACED must read as gone, not as an addition");
  assert(classify("nothing here", { expect: "0.380868" }) === "gone" &&
         classify("0.380868 and more below", { expect: "0.380868" }) === "hold",
    "a claim without nothingAfter must behave exactly as before (never 'added')");

  console.log("check-claims selftest: PASS (4 matcher cases + empty-body guard + 1 blind-class pin + negative pin fires on an inserted row, silent when last, and distinguishes added from gone)");
}

export async function run({
  claims: suppliedClaims,
  fetchImpl = globalThis.fetch,
  wait,
} = {}) {
  const claims = suppliedClaims ?? JSON.parse(await readFile(CLAIMS, "utf8"));
  const rows = [];
  let broken = 0, unverified = 0, held = 0;
  const bodies = new Map(); // many pins share a source URL — fetch each once

  for (const c of claims) {
    if (c.manual) {
      unverified++;
      // Advisory only — default-UA fetch (the configuration proven to get 200 from residential
      // IPs). Whatever happens here, the claim stays UNVERIFIED and the exit code is untouched.
      let advisory;
      try {
        const res = await fetchWithRetry(c.url, {}, { fetchImpl, wait });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        advisory = holds(await res.text(), c.expect)
          ? `advisory fetch from THIS machine: HTTP 200, expected "${c.expect}" still present — page unchanged (stays UNVERIFIED; CI cannot see this)`
          : `advisory fetch from THIS machine: HTTP 200 but expected "${c.expect}" NOT FOUND — the cited page may have moved; hand-verify now and follow the claim's watch runbook`;
      } catch (err) {
        advisory = `advisory fetch failed (${err.message}) — expected from datacenter IPs (CI); hand/local verification still required`;
      }
      rows.push(`UNVERIFIED  ${c.id}  ${c.statement}\n            source blocks automated fetch (${c.url}) — ${c.note ?? "hand-verify"}\n            ${advisory}`);
      continue;
    }
    let body = bodies.get(c.url);
    if (body === undefined) {
      try {
        const res = await fetchWithRetry(c.url, { headers: { "user-agent": "bounds-ledger-claims" } }, { fetchImpl, wait });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        body = await res.text();
        bodies.set(c.url, body);
      } catch (err) {
        broken++;
        rows.push(`UNREACHABLE ${c.id}  ${c.statement}\n            ${c.url} — ${err.message}`);
        continue;
      }
    }
    const verdict = classify(body, c);
    if (verdict === "hold") {
      held++; // held claims are counted, not listed — a real break must not drown below the fold
    } else if (verdict === "added") {
      // The value is still there; what changed is what follows it. On a bounds surface that is
      // an ADDITION, i.e. the event this lane exists to catch — say so, don't report it as a
      // vanished pin and send the reader hunting for a deletion that never happened.
      broken++;
      rows.push(`BROKEN      ${c.id}  ${c.statement}\n            "${c.expect}" is still present at ${c.url}, but is NO LONGER followed by "${c.nothingAfter}" — SOMETHING WAS ADDED BELOW IT.\n            On a record surface that is the north-star event, not a defect: verify against primary sources, then re-pin deliberately.`);
    } else {
      broken++;
      rows.push(`BROKEN      ${c.id}  ${c.statement}\n            expected "${c.expect}" at ${c.url} — no longer present`);
    }
  }

  console.log(`# Claim check — ${new Date().toISOString()}`);
  if (rows.length) console.log(rows.join("\n"));
  console.log(`\n${claims.length} claim(s): ${held} hold, ${broken} broken/unreachable, ${unverified} unverified (manual).`);
  if (broken) console.log(`\nA broken claim means a cited surface moved. Re-verify against primary sources, update the claim (and the note that asserts it), then commit.`);
  return broken ? 1 : 0;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  try {
    if (process.argv.includes("--selftest")) selftest();
    else process.exitCode = await run();
  } catch (err) {
    console.error(`error: ${err.message}`);
    process.exitCode = 2;
  }
}
