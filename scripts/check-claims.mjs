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
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLAIMS = join(ROOT, "ledger", "claims.json");

const stripTags = (s) => s.replace(/<[^>]*>/g, "");
const squash = (s) => s.replace(/\s+/g, " ");

// A claim holds if its expected string survives in the raw body OR with tags stripped
// (values split across markup) — both whitespace-collapsed.
//
// BLIND CLASS — this is a PRESENCE test, so it can only ever see a pin DISAPPEAR. It is
// structurally incapable of firing when a source ADDS a new, better bound while leaving the
// pinned text in place. For the 218 generated pins that is covered: their sources are
// mirrored, and reverify.mjs sees any added line. It is NOT covered for the six claims whose
// sources are off-mirror — C-4/C-5 (arXiv), C-6 (Wikipedia), C-7/C-9 (erdosproblems.com),
// C-8 (teorth/erdosproblems) — where this checker is the ONLY instrument. "A new record
// appeared alongside the old one" is this lane's north-star event, and on exactly those six
// surfaces nothing here can report it. Named per the 2026-07-31 P2 rider (A-10); the fix is
// a design question (mirror those sources vs pin a negative), not a threshold tweak.
function holds(body, expect) {
  const want = squash(expect);
  return squash(body).includes(want) || squash(stripTags(body)).includes(want);
}

function selftest() {
  const assert = (cond, msg) => { if (!cond) { console.error(`selftest FAIL: ${msg}`); process.exit(1); } };
  assert(holds("the bound is 0.380868 today", "0.380868"), "plain substring should hold");
  assert(holds("0.380<span>868</span>", "0.380868"), "tag-split value should hold");
  assert(holds("bound\n  is  0.380868", "bound is 0.380868"), "whitespace-collapsed phrase should hold");
  assert(!holds("the bound is 0.380871", "0.380868"), "absent value must NOT hold");
  assert(!holds("", "0.380868"), "empty body must NOT hold");
  // Blind class, asserted so it cannot be forgotten: a source that ADDS a better bound below
  // the pinned one still reads as holding. This test PASSING is the defect, not the fix — it
  // pins the shape of what this instrument cannot see. See the note on holds().
  assert(holds("upper bound 0.380868\n| $0.379005$ | [NEW2026] |", "0.380868"),
    "BLIND CLASS: an added better bound leaves the pin green — this checker cannot see additions");
  console.log("check-claims selftest: PASS (4 matcher cases + empty-body guard + 1 blind-class pin)");
}

async function run() {
  const claims = JSON.parse(await readFile(CLAIMS, "utf8"));
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
        const res = await fetch(c.url);
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
        const res = await fetch(c.url, { headers: { "user-agent": "bounds-ledger-claims" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        body = await res.text();
        bodies.set(c.url, body);
      } catch (err) {
        broken++;
        rows.push(`UNREACHABLE ${c.id}  ${c.statement}\n            ${c.url} — ${err.message}`);
        continue;
      }
    }
    if (holds(body, c.expect)) {
      held++; // held claims are counted, not listed — a real break must not drown below the fold
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

try {
  if (process.argv.includes("--selftest")) selftest();
  else process.exitCode = await run();
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exitCode = 2;
}
