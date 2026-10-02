#!/usr/bin/env node
// One static page per constant, at c/<id>.html, generated from the same ledger the table reads.
//
// WHY: until now the only way to point at a constant was `#c-<id>` — an anchor into a single
// long table. A citation could not name a page, a search engine had one document to index for
// every constant we watch, and a reader arriving on the anchor landed mid-table with no context
// for the row under their cursor. A per-constant URL makes the row citable and findable.
//
// WHAT IT DOES NOT DO, and this is the same refusal the table makes: it asserts no record. The
// pins are LAST-LISTED table rows, a listing position, and every page says so in those words.
// It also renders no previously-pinned value as a from-to pair — a current value beside a former
// one is a movement claim whatever noun sits in the sentence (refuted 2026-09-01 on Brun's
// constant, where upstream APPENDED a conditional row below an unconditional one).
//
// ponytail: flat files, no router, no index of its own — the table already is the index, and the
// pages are small enough that 114 of them cost nothing. Revisit if the mirror grows an order of
// magnitude.

import { writeFileSync, readFileSync, mkdirSync, readdirSync, rmSync, existsSync, realpathSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { buildRows, flagUrl, citation, reportLabel, whenLabel, readable } from "./render-site.mjs";
import { boundCell } from "./lookup.mjs";
import crypto from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTDIR = join(ROOT, "c");
const REPO = "https://github.com/u00dxk2/bounds-ledger";
const SITE = "https://u00dxk2.github.io/bounds-ledger/";
const RUNS = `${REPO}/actions/workflows/reverify.yml`;

/**
 * WHEN WE LAST LOOKED, said on the page a citer actually lands on (2026-09-22). The index has
 * said this since 2026-08-27; the constant pages never did. Those pages are what a search result
 * or a "Cite this row" link reaches, which makes them the page this lane's user reads just before
 * citing. Their only freshness words were "a snapshot at that commit, not a live read", which
 * answers the reader's question ("is it current, or has nobody looked since?", docs/evangelism-bar.md)
 * with half of the truth. A dated row can look abandoned when it has been checked every day.
 *
 * DELIBERATELY NOT "an old date means the row has been steady". The page changes only after a
 * person verifies an upstream change and republishes, so during an unresolved drift the alarm is
 * red, upstream HAS moved, and this page still shows the old date. The sentence therefore claims
 * only what the date cannot mean (neglect), and it sends the reader to the run history for the
 * verdict, which is the one read that knows about an unresolved change.
 *
 * SCOPED TO THE DATES AND VALUES, not to "this page" (adversarial review, 2026-09-22). The first
 * draft said "This page changes only after a change upstream has been verified and published here",
 * which this very commit falsifies: the mirror is untouched at 9d57db8 and all 115 pages changed,
 * because a page is also rewritten whenever its renderer is. It also hung the daily-re-check
 * conclusion on the wrong clause — an old date is not neglect BECAUSE of the daily check, not
 * because of what publishing does.
 */
export const FRESHNESS =
  "This row is re-checked against upstream every day by a scheduled job, so an old date above does not mean nobody has looked. The dates and values above change only after an upstream change has been verified and published here, so an old date does not prove nothing has moved upstream either.";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const STYLE = `:root{--ink:#111;--muted:#666;--line:#ddd;--code:#f6f6f6;--accent:#0b5fff}
*{box-sizing:border-box}body{margin:0;padding:1.5rem 1.25rem 3rem;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:var(--ink);max-width:52rem;margin-inline:auto}
a{color:var(--accent)}h1{font-size:1.4rem;line-height:1.3;margin:.2rem 0 .1rem}
.id{font:13px ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--muted)}
.back{font-size:.85rem;display:inline-block;margin-bottom:1.2rem}
dl{margin:1.4rem 0;padding:0}dt{font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin-top:1.1rem}
dd{margin:.35rem 0 0}code{display:block;background:var(--code);padding:.6rem .7rem;font-size:.85rem;overflow-x:auto;white-space:pre-wrap;word-break:break-word}
.when{display:block;font-size:.8rem;color:var(--muted);margin-top:.3rem}
.sel{color:var(--muted);font-size:.85rem}
.none{color:var(--muted)}
ul.audit{margin:.35rem 0 0;padding-left:1.1rem}ul.audit li{margin:.2rem 0}
.ours{display:inline-block;margin-top:.6rem;font-size:.85rem}
.actions{margin:1.6rem 0;padding-top:1rem;border-top:1px solid var(--line);font-size:.9rem}
.cite code{user-select:all;margin-top:.5rem}
footer{margin-top:2rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}`;

/**
 * A-47 depth audit, surfaced. Until now a reader could see what we MIRROR and never what we have
 * CHECKED. Those are different claims and only one of them takes work: mirroring is byte-fidelity,
 * checking means somebody opened the cited paper and read it against the row.
 *
 * THE DENOMINATOR IS THE HONEST HALF, and it is load-bearing rather than decoration. A block that
 * showed verdicts without the ratio would read as "this ledger is verified", which is exactly the
 * coverage claim the audit is instructed NOT to manufacture before the auditing exists. Both the
 * numerator and the denominator come from the store; neither is typed on this page.
 */
export function loadAudits() {
  try {
    const s = JSON.parse(readFileSync(join(ROOT, "continuity", "depth-audit.json"), "utf8"));
    const audits = Array.isArray(s.audits) ? s.audits : [];
    // COMPUTED HERE AND OVERWRITTEN ON EVERY ENTRY, so a stored `inMirror: true` can never assert it.
    for (const a of audits) {
      if (a && typeof a === "object") a.inMirror = mirrorHas(a.rowFile, a.rowLine, a.rowText);
    }
    return { audits, corpus: s.meta?.corpus || null };
  } catch {
    // No store, or an unreadable one: the pages render exactly as they did before this existed.
    // An audit block is ADDITIVE, so its absence must never take a constant page down with it.
    return { audits: [], corpus: null };
  }
}

/**
 * VERDICTS ARE AN ALLOWLIST, and an unknown one is DROPPED rather than printed. Adversarial review
 * 2026-09-10 demonstrated the alternative: a store value of "VERIFIED BEST KNOWN BOUND" was emitted
 * verbatim onto a public constant page — the exact claim this file forbids — because the old code
 * fell back to `VERDICT_PROSE[v] || v`. The store is ours, but a renderer that trusts its input to
 * be well-formed is one bad row away from publishing a record claim in this lane's name.
 *
 * LINK TEXT IS PER VERDICT, because "the source we read" beside UNREACHABLE contradicts itself.
 */
/**
 * A VALUE IS SHOWN ONLY WHEN IT IS PROVABLY THE ROW THAT WAS AUDITED AND THAT ROW STILL STANDS.
 * Adversarial review, 2026-09-13: printing the stored rowText's first cell beside "supports this row"
 * trusted the store completely — an entry edited to $9.999999$ with its hash left alone rendered that
 * number as a supported bound, and non-table text or a comment-only cell came through wholesale.
 * Three independent conditions, each able to fail on its own: the text is a table row; its hash is
 * the one recorded when it was audited; and the identical line is still in the mirror today. Any one
 * failing shows NO value — the verdict line still renders, because the reading happened; only the
 * number is withheld, since we can no longer say it is the number that was read.
 */
const MIRROR_PREFIX = "ledger/teorth-optimizationproblems/constants/";
/**
 * THE AUDITED ROW, AT THE AUDITED LINE — not the audited text anywhere in the file (adversarial
 * review round 2, 2026-09-13). The first version searched every line, so changing 1b:23 while the old
 * text survived under a historical note left the check passing and printed the OLD value beside the
 * NEW row. Identity is the recorded location plus the recorded text; an upstream insertion that moves
 * the row is correctly read as "cannot prove it", never guessed at.
 */
export function mirrorHas(rowFile, rowLine, rowText, root = ROOT) {
  if (typeof rowFile !== "string" || typeof rowText !== "string") return false;
  if (!Number.isInteger(rowLine) || rowLine < 1) return false;
  if (!rowFile.startsWith(MIRROR_PREFIX) || rowFile.includes("..")) return false;
  const want = rowText.trim();
  if (!want) return false;
  try {
    const line = readFileSync(join(root, rowFile), "utf8").split(/\r?\n/)[rowLine - 1];
    return typeof line === "string" && line.trim() === want;
  } catch {
    return false;
  }
}

/** Is this audit PROVABLY about the row that stands at its recorded line today? */
export function identityVerified(a) {
  if (!a || typeof a.rowText !== "string" || typeof a.rowTextSha256 !== "string") return false;
  const t = a.rowText.trim();
  if (!t.startsWith("|")) return false;
  const sha16 = crypto.createHash("sha256").update(t, "utf8").digest("hex").slice(0, 16);
  if (sha16 !== a.rowTextSha256) return false;
  return a.inMirror === true;
}

export function verifiedValue(a) {
  return identityVerified(a) ? boundCell(a.rowText.trim()).replace(/<!--[\s\S]*?-->/g, "").trim() : "";
}

/**
 * A PINNED bound-row audit whose identity can no longer be proved is HISTORICAL (round 2's second
 * finding): the reading happened, but on a version of the table that is not the one a reader sees, so
 * the page must neither link the live line nor say the source "supports this row", and it is not
 * counted as a read. Review round 3 closed the gap this left: an audit with NO stored rowText cannot
 * prove identity either, so it is historical too — no identity, no live link, no support claim, no count.
 */
const isStale = (a) => a.leg === "value-vs-source" && !identityVerified(a);

const VERDICT_PROSE = {
  // "source link", NOT "the source we read/reached" (2026-10-01, round 2): the store's `source` is
  // sometimes the copy that was read and sometimes the cited edition's DOI while the reading happened
  // elsewhere (examples, not an inventory: A-47-0020, -0038, -0047, -0048 and -0053, the last being 22a,
  // whose link went to the publisher that refused us). The
  // label now claims nothing about which; the `sourceRead` note beside it says what was actually read.
  // VERDICT TEXT CLAIMS ONLY WHAT THE VERDICT GUARANTEES (review round 3, 2026-10-01, the third round
  // in a row to refute a sentence about our own reading). "The cited source was read/reached" was false
  // for 22a and 32a, where only a preprint was; "supports this row" was wider than the claim checked on
  // 15a and 26a. Every audit checks ONE named claim against what was read, so the text says exactly that,
  // and the sourceRead note beside it says what was read.
  SOUND: { text: "what we read supports the claim we checked in this row", link: "source link" },
  DEFECTIVE: { text: "what we read does NOT support the claim we checked in this row", link: "source link" },
  UNRESOLVED: { text: "what we read could not settle the claim we checked in this row", link: "source link" },
  UNREACHABLE: { text: "the cited source could not be read at all", link: "the source we could not read" },
};

/** What each audit leg actually examined. A reference entry is NOT a bound row. */
const LEG_LABEL = { "value-vs-source": "bound row", "citation-well-formed": "reference entry" };

/**
 * HOW THE ROW WAS CHOSEN, which decides what its count can mean. A row drawn by its position, without
 * looking at it, can accumulate into a coverage figure; a row chosen BECAUSE something already
 * looked wrong cannot — the set is selected on the outcome, so it carries no rate. The store has
 * said this in prose since 2026-09-10 and the PAGE said nothing, so a reader saw one undifferentiated
 * count with two suspicion-drawn rows inside it. Added 2026-09-13 with slice 4.
 *
 * AN ENTRY WITH NO `selection` COUNTS AS SUSPICION, never as systematic: the unlabelled direction
 * has to be the one that understates coverage rather than the one that flatters it.
 */
// The systematic wording was "drawn by position before it was read" until 2026-10-01; the 2026-09-29
// cold walk read it as jargon (A-53.walkCandidates2026_09_29r3), so it now says what "drawn by position"
// means, in the same words the page's count sentence uses. "Before it was read" was dropped: a row
// drawn this way may have been read earlier under suspicion (A-47-0052, 1b's row, first read
// 2026-09-05). "Fixed list" was rejected by review: the list grew from 673 to 691 rows at slice 8.
const SELECTION_PROSE = {
  systematic: "drawn by its position in the list of cited rows, not because it looked wrong",
  suspicion: "chosen because something already looked wrong",
};
const isSystematic = (a) => a.selection === "systematic";
const selectionNote = (a) => SELECTION_PROSE[isSystematic(a) ? "systematic" : "suspicion"];

/** Only http(s) reaches the page: `javascript:` survives attribute escaping and stays executable. */
export function safeUrl(u) {
  try {
    const p = new URL(String(u));
    return p.protocol === "http:" || p.protocol === "https:" ? p.href : null;
  } catch { return null; }
}

/**
 * A row reaches the page only if EVERY field it renders is a well-formed string. Type checks are
 * not defensive habit here: adversarial review 2026-09-10 reproduced `sourceRead: {toString: null}`
 * throwing inside escaping and aborting generation of ALL 115 pages, and the same shape in `verdict`
 * throwing during property lookup. One malformed row must never take the published site down.
 */
export function usableAudit(a) {
  return !!a && typeof a === "object"
    && typeof a.constant === "string"
    && typeof a.citedRef === "string"
    && typeof a.verdict === "string"
    && Object.prototype.hasOwnProperty.call(VERDICT_PROSE, a.verdict)
    && (a.leg === undefined || typeof a.leg === "string")
    && (a.sourceRead === undefined || typeof a.sourceRead === "string")
    && safeUrl(a.source) !== null;
}

/**
 * THE RENDER SIDE REFUSES A DROPPED ENTRY (A-53, option (b), decided 2026-10-01). `usableAudit` keeps
 * one malformed entry from crashing all 115 pages, and that stays: the renderers below still filter.
 * What it also did was make the entry VANISH — slice 5's 10c entry, recorded with a repository path
 * as its source, left the public count while `depth-audit.mjs` went on counting it, with no warning
 * and no non-zero exit anywhere. So both GENERATORS (this file's main, which writes c/ through
 * auditBlock, and render-site.mjs, which writes the index through badgeFor) call
 * `auditStoreRefusal()` first and write nothing when it names an entry. The alarm sits where the loss
 * happens, not in a second counter comparing two counts.
 *
 * SCOPED TO WHAT IS DROPPED, never to what is STALE. A stale entry (its row edited upstream since it
 * was read) passes usableAudit and renders as historical; refusing it would stop every render on
 * every upstream edit, and upstream drift is the event this ledger exists to show.
 *
 * ALSO REFUSED (adversarial review, 2026-10-01): an entry that passes usableAudit but whose `constant`
 * names no page — badgeFor and auditBlock both filter on `a.constant === id`, so it reached no page
 * while the ledger-wide sentence and depth-audit.mjs still counted it; and an ABSENT store, which
 * would drop every entry from every page while depth-audit.mjs refuses the same absence (exit 2).
 * The store is tracked, so its absence is never legitimate here.
 *
 * ACCEPTED EDGE (second review, 2026-10-01): if upstream DELETES a constant that holds audit entries,
 * those entries name no page and the render refuses, mid-`npm run resnap`, after the snapshot and the
 * pins have moved. That is deliberate. Their readings would otherwise vanish from every page in
 * silence; a human decides what a deleted constant's readings become, then renders.
 *
 * Not covered, and where it is caught instead: a THIRD importer of badgeFor or auditBlock that skips
 * this call. And CI does not run either --check (reverify.yml runs only the --selftests), so the
 * refusal fires in `npm run check`, `npm run resnap`, any render, and the pre-commit hook only when
 * index.html is staged. A commit that touches ONLY continuity/depth-audit.json — the 10c shape — is
 * refused by none of those until the next render or `npm run check`. The selftest drives both mains
 * against a bad store, so deleting either call fails it.
 */
const UNUSABLE_CHECKS = [
  ["not an object", (a) => !!a && typeof a === "object"],
  ["constant is not a string", (a) => typeof a.constant === "string"],
  ["citedRef is not a string", (a) => typeof a.citedRef === "string"],
  ["verdict is not a string", (a) => typeof a.verdict === "string"],
  ["verdict is outside SOUND / DEFECTIVE / UNRESOLVED / UNREACHABLE", (a) => Object.prototype.hasOwnProperty.call(VERDICT_PROSE, a.verdict)],
  ["leg is not a string", (a) => a.leg === undefined || typeof a.leg === "string"],
  ["sourceRead is not a string", (a) => a.sourceRead === undefined || typeof a.sourceRead === "string"],
  ["source is not an http(s) URL", (a) => safeUrl(a.source) !== null],
];

/** `pageIds`, when given, is the set of constant ids that get a page; an entry naming none is dropped too. */
export function droppedAudits(store, pageIds = null) {
  const audits = Array.isArray(store?.audits) ? store.audits : [];
  const out = [];
  audits.forEach((a, i) => {
    const at = a && typeof a === "object" && typeof a.id === "string" ? a.id : `audits[${i}]`;
    if (usableAudit(a)) {
      if (pageIds && !pageIds.has(a.constant)) out.push({ at, why: `constant "${a.constant}" names no page` });
      return;
    }
    const failed = UNUSABLE_CHECKS.find(([, ok]) => !ok(a));
    out.push({ at, why: failed ? failed[0] : "fails usableAudit" });
  });
  return out;
}

export const DEFAULT_AUDIT_STORE = join(ROOT, "continuity", "depth-audit.json");

/** null when nothing would be dropped; otherwise one line per entry that would vanish from the pages. */
export function auditStoreRefusal(storePath = DEFAULT_AUDIT_STORE, pageIds = null) {
  if (!existsSync(storePath)) return ["the audit store is absent, so every audited entry would be dropped from every page"];
  let s;
  try { s = JSON.parse(readFileSync(storePath, "utf8")); } catch (e) {
    return [`the audit store did not parse (${e.message}), so every entry in it would be dropped from every page`];
  }
  if (!Array.isArray(s?.audits)) return ["the audit store has no audits array, so every entry in it would be dropped from every page"];
  const dropped = droppedAudits(s, pageIds);
  return dropped.length ? dropped.map((d) => `${d.at}: ${d.why}`) : null;
}

/** Prints the refusal in the repo's RESULT shape; returns true when the caller must stop. */
export function refuseDroppedAudits(label, { storePath = DEFAULT_AUDIT_STORE, pageIds = null } = {}) {
  const refusal = auditStoreRefusal(storePath, pageIds);
  if (!refusal) return false;
  console.error(`RESULT: FAIL — ${label}: ${refusal.length} problem(s) would silently drop audit store entries from the published pages; fix the store, nothing was written (A-53):`);
  for (const line of refusal) console.error(`  ${line}`);
  return true;
}

/**
 * THE SOURCE WAS ACTUALLY READ for these three verdicts. UNREACHABLE is the one that means we never
 * got to it, and counting it as read was a self-contradiction the page printed in one breath:
 * "the cited source could not be read at all" beside "1 bound row(s) here have been read against
 * their cited source". A count of attempts presented as a count of readings overstates the work,
 * which is the defect this whole block exists to avoid.
 */
const READ_VERDICTS = new Set(["SOUND", "DEFECTIVE", "UNRESOLVED"]);

/**
 * WHAT COUNTS AS A READING OF A BOUND ROW, in ONE place. It lived as a local inside auditBlock until
 * 2026-09-14, when the index began showing it too — and two copies of this predicate are two chances
 * for the page and the index to disagree about whether a row was read. A STALE audit (pinned, identity
 * no longer provable) was read on an earlier version of the table, so it is not a reading of the row a
 * reader sees today and is never counted as read.
 */
export const isBoundRead = (a) => a.leg === "value-vs-source" && READ_VERDICTS.has(a.verdict) && !isStale(a);

/**
 * THE INDEX BADGE (2026-09-14). The index said nothing about which rows had been read against their
 * cited source: a citer who found their constant there could not tell a row we had opened the paper
 * for from one we only watch as a listing, without opening each of 115 pages. The page's audit block
 * stays authoritative; the badge says only that a provable reading EXISTS and which way the worst
 * one went, and links there.
 *
 * WORST VERDICT WINS. A constant with one SOUND row and one DEFECTIVE row must never badge as
 * supported: the badge's job is to stop a citer trusting a number, never to reassure them, so a mixed
 * constant takes the verdict that understates — the same direction this file already takes for an
 * unlabelled selection.
 *
 * NEVER A RECORD CLAIM. Each wording is about a ROW being read against ITS OWN cited source; none says
 * or implies the row is the strongest or most recent bound (see DISCLAIMER).
 */
const BADGE = {
  DEFECTIVE: "what we read does not support a claim in a row",
  UNRESOLVED: "checked against material for its source, not settled",
  SOUND: "checked against material for its cited source",
};
const BADGE_SEVERITY = ["DEFECTIVE", "UNRESOLVED", "SOUND"];

export function badgeFor(id, store, shown = []) {
  const usable = (Array.isArray(store?.audits) ? store.audits : [])
    .filter(usableAudit)
    .filter((a) => a.constant === id);
  const reads = usable.filter(isBoundRead);
  const worst = BADGE_SEVERITY.find((v) => reads.some((a) => a.verdict === v));
  if (worst) return { verdict: worst, text: `${BADGE[worst]}: ${namedRows(reads.filter((a) => a.verdict === worst), shown)}` };
  return triedFor(usable, shown);
}

/**
 * THE READ BADGE NAMES ITS ROW (A-62, 2026-10-01 round 2), as the tried line has since 2026-09-29. The
 * badge sat beside the last-listed row while the reading was of another: 15a read "read against its
 * cited source" beside 2.371177 [DEKMRSZAWB2026], and the row read was 2.371866 [DWZ2022]. It names the
 * rows that carry the badge's own (worst) verdict, one per row, and says "another row" or "the row
 * shown" by whole-row equality with the pins, never by assumption.
 */
function namedRows(reads, shown) {
  const byRow = new Map();
  for (const a of reads) if (!byRow.has(rowKey(a))) byRow.set(rowKey(a), a);
  const rows = [...byRow.values()];
  return rows.length === 1
    ? `${isShownRow(rows[0], shown) ? "the row shown" : "another row"}, ${plainRowName(rows[0])}`
    : `${rows.length} rows, ${rows.map((a) => `${plainRowName(a)}${isShownRow(a, shown) ? " (shown)" : ""}`).join("; ")}`;
}

/**
 * The attempted bound rows of one constant, ONE per row (a retry of the same row is one row), in the
 * order they were stored. Only rows whose identity is still provable, so every one can be named by its
 * value.
 */
//
// A row that was also READ is not an attempted row (review R2, 2026-09-29): the page would name it
// "not counted as read" beside a count that includes it. A retried row carries EVERY reference key it
// was tried through, in store order (reviews R4 and B2): picking "the latest attempt's key" needs a
// chronology the store's day-only dates cannot give, so the line claims less instead of guessing.
function attemptedRows(usable) {
  const read = new Set(usable.filter(isBoundRead).map(rowKey));
  const byRow = new Map();
  for (const a of usable) {
    if (a.leg !== "value-vs-source" || a.verdict !== "UNREACHABLE" || isStale(a) || read.has(rowKey(a))) continue;
    const prev = byRow.get(rowKey(a));
    if (!prev) byRow.set(rowKey(a), { ...a, triedRefs: [a.citedRef], attempts: [a] });
    else {
      if (!prev.triedRefs.includes(a.citedRef)) prev.triedRefs.push(a.citedRef);
      prev.attempts.push(a);
    }
  }
  return [...byRow.values()];
}

const refsOf = (a) => (Array.isArray(a.triedRefs) ? a.triedRefs : [a.citedRef]);

/** Is this audited row one of the last-listed rows the reader sees? Whole-row equality, never a substring. */
const isShownRow = (a, shown) => typeof a.rowText === "string" && shown.some((s) => typeof s === "string" && s.trim() === a.rowText.trim());

/** A row named in plain text for the index: its first cell without the math delimiters, then its key. */
function plainRowName(a) {
  const v = verifiedValue(a).replace(/^\$([\s\S]*)\$$/, "$1").trim();
  const keys = refsOf(a).map((r) => `[${r}]`).join(", ");
  if (!v) return keys;
  // A value is paired with a key ONLY when the row credits that value to it (review R2, 2026-10-01
  // round 2): 26a's row credits infinity to "Trivial" and cites DMP2019 in its comment, and the badge
  // read "the row shown, \infty [DMP2019]", a pairing the row never makes.
  // RULE (review round 2 changed the SHAPE here rather than patch the matcher a second time): the value
  // is paired ONLY with keys the credit cell names as whole citation keys; a retry key the credit cell
  // does not name is listed as "also tried through", never beside the value; keys found as whole keys
  // only in the comment are said to be cited there, and nothing more (35a's comment cites B2015 FOR its
  // bound, so "not for its bound" was false); anything citeLocation cannot place gets the keys alone,
  // a claim of nothing.
  const refs = refsOf(a);
  const fmt = (rs) => rs.map((r) => `[${r}]`).join(", ");
  const credited = refs.filter((r) => citeLocation(a, r) === "credit");
  if (credited.length) {
    const rest = refs.filter((r) => !credited.includes(r));
    return `${v} ${fmt(credited)}${rest.length ? ` (also tried through ${fmt(rest)})` : ""}`;
  }
  if (refs.every((r) => citeLocation(a, r) === "comment")) return `${keys}, cited in the comment of that row`;
  return keys;
}

/**
 * WHERE A ROW CITES A KEY: "credit" (its second cell), "comment" (any later cell), or null. A key counts
 * only as a WHOLE citation key — `[KEY]` or the linked form `[[KEY](#KEY)]` — never as a substring, so
 * `H2016` is not found inside `[H2016b]`. Cells split on UNESCAPED pipes only, so `$\|x\|$` stays one
 * cell. Read from the stored, hash-checked rowText; a row whose identity cannot be proved is null.
 */
function citeLocation(a, ref) {
  if (!identityVerified(a)) return null;
  const cells = a.rowText.trim().split(/(?<!\\)\|/);
  const key = new RegExp(`\\[\\[?${ref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]`);
  if (key.test(cells[2] ?? "")) return "credit";
  if (key.test(cells.slice(3).join("|"))) return "comment";
  return null;
}

/**
 * THE ATTEMPTED BADGE (2026-09-29, A-53's second instance). Until today a constant whose cited source
 * we went to and were turned away from carried NO line on the index, exactly like a constant we never
 * looked at, so the work was invisible and a citer could not tell the two apart. This is a THIRD kind
 * of line, never a fourth way of saying "read": it has its own class (`tried`, not `read`), and its
 * wording says the number was NOT checked.
 *
 * It takes the read badge's exclusions: only a bound row (a citation-check leg is not one), only an
 * attempt we can still prove is of the row a reader sees (not stale), and ANY reading on the constant
 * wins, because badgeFor returns before reaching here.
 *
 * DATED, because an unreachable host is a moment and not a fact: 1b's cited link was down on
 * 2026-09-05 and serving again by 2026-09-26. The date is the latest attempt's, read from its
 * `fetchedAt`; an attempt with no parseable date gives the line without one rather than a guessed date.
 */
//
// IT NAMES THE ROW (2026-09-29, round 3). The first wording said only "we could not open its cited
// source" and sat above the two last-listed rows, so a cold walker read it as doubt about the number
// shown — while all seven attempted rows were older rows further up their tables. The line now carries
// the tried row's value and reference key, and says whether that row is one of those shown, decided by
// whole-row equality with the pins, never assumed. No year is printed: a key's digits are a label, and
// 65a's `Xyl2011` row credits Graham 1981.
function triedFor(usable, shown = []) {
  const rows = attemptedRows(usable);
  if (rows.length === 0) return null;
  const dates = rows.flatMap((r) => r.attempts).map((a) => attemptDate(a.fetchedAt)).filter(Boolean).sort();
  const date = dates.length ? dates[dates.length - 1] : null;
  const which = rows.length === 1
    ? `the source for ${isShownRow(rows[0], shown) ? "the row shown" : "another row"}, ${plainRowName(rows[0])}`
    : `the sources for ${rows.length} rows: ${rows.map((a) => `${plainRowName(a)}${isShownRow(a, shown) ? " (shown)" : ""}`).join("; ")}`;
  return {
    verdict: "UNREACHABLE",
    kind: "tried",
    date,
    text: `we could not open ${which}${date ? ` (tried ${date})` : ""}`,
  };
}

/**
 * The attempt's day, as a human label in MOUNTAIN TIME when the record states one ("2026-09-25 UTC
 * (2026-09-24 evening MT)" gives 2026-09-24), else the first ISO date the field carries. Free text is
 * never trusted further than that: no date found means none is printed.
 */
export function attemptDate(fetchedAt) {
  if (typeof fetchedAt !== "string") return null;
  const mt = fetchedAt.match(/\((\d{4}-\d{2}-\d{2})[^)]*\bMT\)/);
  if (mt) return mt[1];
  const first = fetchedAt.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  return first ? first[1] : null;
}

/**
 * A row IDENTITY, so a recheck of the same row does not read as a second row audited. The store
 * pins each audit to a file and line with a hash of the row text; falling back to the citation
 * would merge genuinely different rows, so an unpinned audit keeps its own id and counts once.
 */
function rowKey(a) {
  if (typeof a.rowTextSha256 === "string" && a.rowTextSha256) return `${a.constant}|${a.rowTextSha256}`;
  if (typeof a.rowFile === "string" && Number.isInteger(a.rowLine)) return `${a.rowFile}:${a.rowLine}`;
  return `id|${a.id}`;
}

function rowLink(a) {
  if (typeof a.rowFile !== "string" || !Number.isInteger(a.rowLine)) return "";
  // `?plain=1` IS WHAT MAKES THE ANCHOR WORK (2026-10-02 cold walk, finding 2): GitHub opens a .md file
  // rendered, where `#L<N>` does nothing, so "line 18" on c/22a landed at the top of the file. The code
  // view honours the anchor and highlights the line. Both callers reach here only for a row that still
  // stands at its recorded line (`!stale` at the verdict list, `isStale` inside attemptedRows), which
  // matters more now that the link points at one highlighted line.
  const href = `${REPO}/blob/main/${a.rowFile.split("/").map(encodeURIComponent).join("/")}?plain=1#L${a.rowLine}`;
  return ` <a href="${esc(href)}">line ${esc(String(a.rowLine))}</a>`;
}

/**
 * The audit block for ONE constant. Empty string when nothing usable here has been audited.
 *
 * THE COUNTS SEPARATE POPULATIONS, because the denominator does. The corpus figure counts CITED BOUND ROWS, so
 * only `value-vs-source` audits may be measured against it; a reference-entry check is real work and
 * a different population. It also counts DISTINCT rows actually READ — not audit entries, and not
 * attempts. Every one of those three distinctions was a way to overstate the work, and every one of
 * them landed in the sentence describing our own method, which is where this lane's defects live.
 */
export function auditBlock(id, store, shown = []) {
  const all = (Array.isArray(store?.audits) ? store.audits : []).filter(usableAudit);
  const mine = all.filter((a) => a.constant === id);
  if (mine.length === 0) return "";

  const items = mine.map((a) => {
    const v = VERDICT_PROSE[a.verdict];
    const leg = LEG_LABEL[a.leg];
    // THE VALUE IS THE THING CHECKED (orchestrator P3 ack, 2026-09-13): the page named the line and
    // the citation but not the number, so three of 1b's four audited values appeared nowhere in the
    // served HTML. It is the row's own first cell, read from the stored rowText — never retyped, never
    // recomputed — only for a bound row, and only when verifiedValue can prove it is the audited row
    // and that row still stands in the mirror.
    const value = leg === "bound row" ? verifiedValue(a) : "";
    // Named valueHtml, not `shown`: that name is the PARAMETER holding the pinned rows, and shadowing it
    // here would hand isShownRow a string (orchestrator review, 2026-10-01 round 2).
    const valueHtml = value ? ` <code style="display:inline;padding:.1rem .3rem">${esc(value)}</code>` : "";
    // A pinned audit whose identity can no longer be proved keeps its reading but loses the live line
    // link and the support claim — a reader must never be pointed at a row nobody read.
    const stale = isStale(a);
    // WHICH ROW, RELATIVE TO THE ROWS SHOWN (2026-10-01 cold walk, finding 1): c/22a showed 10.02 and its
    // verdict was about 12.63, and a reader checking 10.02 took the verdict as being about it. Said only
    // where whole-row equality can decide it: a bound row whose identity is still provable. A stale row
    // gets neither phrase (we cannot say what it is today), nor does a reference entry (not a row).
    // "another row", never "an earlier/older row": nothing here proves where that row is listed.
    const relation = leg === "bound row" && value
      ? `<span class="rel">${isShownRow(a, shown) ? "The row shown above:" : "Another row, not one shown above:"}</span> `
      : "";
    // "citing" pairs the value with the key; where the row credits its bound to someone else and names
    // the key only in its comment (26a, 35a), say so instead (review R2, 2026-10-01 round 2).
    const where = value ? citeLocation(a, a.citedRef) : "credit";
    const cites = where === "credit" ? "citing" : where === "comment" ? "whose comment cites" : "audited against";
    const what = leg ? `${esc(leg)}${valueHtml}${leg === "bound row" && !stale ? rowLink(a) : ""} ${cites} ` : "";
    const note = a.sourceRead ? ` (${esc(a.sourceRead)})` : "";
    const verdictText = stale
      ? (READ_VERDICTS.has(a.verdict) ? "this row was checked against material for its cited source on an earlier version of the table, and the row at that line has since changed or cannot be matched, so this verdict says nothing about the row there now" : "a check of this row was attempted on an earlier version of the table and the cited source could not be read; the row at that line has since changed or cannot be matched, so nothing is said about the row there now")
      : a.verdict === "UNREACHABLE" && attemptDate(a.fetchedAt) ? `${v.text} (tried ${attemptDate(a.fetchedAt)})`
        // A reference-entry check is not a row (87a, found reading every rendered verdict line).
        : leg === "reference entry" ? v.text.replace(/ in this row$/, " in this entry") : v.text;
    return `<li>${relation}${what}<code style="display:inline;padding:.1rem .3rem">[${esc(a.citedRef)}]</code> &mdash; ` +
      `${esc(verdictText)}. <a href="${esc(safeUrl(a.source))}">${esc(v.link)}</a>${note}. ` +
      `<span class="sel">Selected: ${esc(selectionNote(a))}.</span></li>`;
  }).join("");

  const countRows = (rows) => new Set(rows.map(rowKey)).size;
  /**
   * PARTITION BY ROW, THEN BY SELECTION — never the other way round (adversarial review, 2026-09-13).
   * Counting each selection's rows independently let ONE row audited twice, once by position and once
   * on suspicion, enter both groups: the page printed "1 bound row(s) here" split into "1 drawn by
   * position, 1 chosen because…", which both inflates the work and contradicts itself. A distinct row
   * counts as systematic if ANY of its readings was drawn by position — that is a true statement about
   * how the ladder reached it — and the two groups therefore always sum to the deduplicated count.
   */
  const splitRows = (rows) => {
    const byRow = new Map();
    for (const a of rows.filter(isBoundRead)) {
      byRow.set(rowKey(a), (byRow.get(rowKey(a)) || false) || isSystematic(a));
    }
    const systematic = [...byRow.values()].filter(Boolean).length;
    return { total: byRow.size, systematic, suspicion: byRow.size - systematic };
  };
  const here = splitRows(mine);
  const boundHere = here.total;
  const sysHere = here.systematic;
  const susHere = here.suspicion;
  /**
   * THE LEDGER-WIDE SENTENCE DESCRIBES THE DRAW, so it counts every drawn row whether or not its
   * source could be read (adversarial review, 2026-09-21). It had counted read rows only and called
   * them "drawn by position", which dropped every unreachable draw from the sampling history. By row:
   * drawn = any reading drawn by position; read = any reading that read the source. A row the ladder
   * reached stays a draw even if a suspicion read later settled it, the same rule splitRows applies.
   */
  const readKeys = new Set(all.filter(isBoundRead).map(rowKey));
  const drawnKeys = new Set(all.filter((a) => a.leg === "value-vs-source" && !isStale(a) && isSystematic(a)).map(rowKey));
  const drawnAll = drawnKeys.size;
  const drawnRead = [...drawnKeys].filter((k) => readKeys.has(k)).length;
  const drawnUnread = drawnAll - drawnRead;
  const susAll = [...readKeys].filter((k) => !drawnKeys.has(k)).length;
  const unreachedHere = new Set(mine.filter((a) => a.leg === "value-vs-source" && !READ_VERDICTS.has(a.verdict) && !isStale(a)).map(rowKey)).size;
  const otherHere = new Set(mine.filter((a) => a.leg !== "value-vs-source").map(rowKey)).size;

  const cited = store?.corpus?.citedRows;
  const citedOk = Number.isSafeInteger(cited) && cited >= 0;
  const when = typeof store?.corpus?.measuredAt === "string" ? store.corpus.measuredAt : null;

  const parts = [];
  if (boundHere > 0) {
    const split = `${boundHere} bound row(s) here have been checked against material for their cited source (${sysHere} drawn by position, ${susHere} chosen because something already looked wrong).`;
    parts.push(citedOk
      ? `${split} Across this whole ledger ${drawnAll} row(s) have been drawn by position, against ${esc(String(cited))} rows that name a source${when ? `, counted on ${esc(when)}` : ""}: ${drawnRead} were checked against material for their cited sources and for ${drawnUnread} the cited source could not be read at all. ${susAll} more were chosen for suspicion and checked; they are counted apart, because a set selected for suspicion carries no rate.`
      : `${split} Across this whole ledger ${drawnAll} row(s) have been drawn by position (${drawnRead} were checked against material for their cited sources and for ${drawnUnread} the cited source could not be read at all) and ${susAll} more were chosen for suspicion and checked. The size of the corpus they came from is not recorded, so this is a count and not a proportion.`);
  }
  // NAMED, NOT COUNTED (2026-09-29, round 3): "1 further bound row(s) here were attempted" did not say
  // which row, and with nothing read there was nothing for "further" to be further than.
  const tried = attemptedRows(mine);
  if (tried.length > 0) {
    const named = tried.map((a) => {
      const value = verifiedValue(a);
      const shownNote = isShownRow(a, shown) ? ", one of the last-listed rows shown above" : "";
      return `the bound row${value ? ` <code style="display:inline;padding:.1rem .3rem">${esc(value)}</code>` : ""} citing ${refsOf(a).map((r) => `[${esc(r)}]`).join(", ")}${rowLink(a)}${shownNote}`;
    }).join("; ");
    parts.push(`${boundHere > 0 ? "Also attempted" : "Attempted"}, and the source could NOT be read: ${named}. ${tried.length === 1 ? "That row is" : "Those rows are"} not counted as read.`);
  }
  if (boundHere === 0 && tried.length > 0 && otherHere === 0 && countRows(mine.filter(isStale)) === 0) {
    parts.push("No bound row of this constant has been read against its source, including the last-listed rows shown above.");
  }
  if (otherHere > 0) {
    const n = `${otherHere} reference entr${otherHere === 1 ? "y" : "ies"}`;
    const verb = otherHere === 1 ? "was" : "were";
    parts.push(boundHere > 0
      ? `${n} here ${verb} also checked; those are not bound rows and are not counted against that figure.`
      : countRows(mine.filter(isStale)) > 0 ? `${n} here ${verb} checked. That is a citation check, not a bound row, and no bound row of this constant has been verified against the current table.` : `${n} here ${verb} checked. That is a citation check, not a bound row, so no bound row of this constant has been read against its source yet.`);
  }
  const staleHere = countRows(mine.filter(isStale));
  if (staleHere > 0) {
    parts.push(`${staleHere} audited bound row(s) here no longer match the current table at the line they were checked against; those verdicts describe an earlier version and are not counted.`);
  }
  parts.push("A row not listed here has NOT been checked.");

  // THE HEADING SAYS WHAT HAPPENED (2026-09-29, round 3). It read "Read against its cited source" above
  // a bullet saying the source could not be read at all. When no audit of this constant reached its
  // source, it says it was tried and not opened, with the latest attempt's date.
  // THREE cases, not two (review R3): a block holding both readings and failed attempts is headed as
  // both, so neither a citation-only reading nor an attempt is presented as the other.
  const anyRead = mine.some((a) => READ_VERDICTS.has(a.verdict));
  const anyTried = mine.some((a) => a.verdict === "UNREACHABLE");
  const triedDates = mine.filter((a) => a.verdict === "UNREACHABLE").map((a) => attemptDate(a.fetchedAt)).filter(Boolean).sort();
  const heading = !anyTried
    ? "Checked against material for its cited source"
    : anyRead
      ? "Checked or tried against material for its cited source"
      : `Tried, could not open its cited source${triedDates.length ? ` (${triedDates[triedDates.length - 1]})` : ""}`;
  return `<dt>${esc(heading)}</dt><dd><ul class="audit">${items}</ul><span class="when">${parts.join(" ")}</span></dd>`;
}

/** The one sentence every page owes, because a pinned row is a listing position and not a record. */
export const DISCLAIMER =
  "These are the LAST-LISTED rows of this constant's bounds table upstream — a listing position, not a statement that either bound is the strongest or most recent known. Upstream keeps superseded and inferior rows because the tables are histories. Read the source file before citing.";

function side(label, row, changed, kind) {
  if (!row) return `<dt>${esc(label)} bound</dt><dd class="none">not pinned</dd>`;
  const when = changed ? `<span class="when">${esc(whenLabel(changed, kind))}</span>` : `<span class="when">date unknown</span>`;
  return `<dt>${esc(label)} bound, last-listed row</dt><dd><code>${esc(row)}</code>${when}</dd>`;
}

/**
 * `pageCitation()` IS GONE (A-40, 2026-09-03) and its absence is the ship.
 *
 * It existed for two days as a `.replace()` that swapped the shared citation's table anchor for
 * this page's own URL, on the reasoning that "the table's shape is out of scope for this change".
 * That reasoning left the site handing out TWO addresses for one constant — the table's cite block
 * gave `#c-<id>` while this page declared `c/<id>.html` canonical in a `<link rel=canonical>` two
 * lines from the same citation. A ledger whose product is citation accuracy cannot publish a
 * second-best address for its own records, so `citation()` now emits the canonical page URL itself
 * and both surfaces quote the same block, byte for byte. One object, one address.
 */

export function renderPage(r, sha, audits = loadAudits()) {
  const upstream = `${REPO}/blob/main/ledger/teorth-optimizationproblems/constants/${encodeURIComponent(r.id)}.md`;
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(r.title)} (${esc(r.id)}) — Bounds Ledger</title>
<meta name="description" content="${esc(`What this ledger has pinned for ${r.title}, mirrored from teorth/optimizationproblems at ${String(sha).slice(0, 7)}.`)}">
<link rel="canonical" href="${esc(`${SITE}c/${r.id}.html`)}">
<style>${STYLE}</style>
<a class="back" href="${esc(`${SITE}#c-${r.id}`)}">&larr; all constants</a>
<h1>${esc(r.title)}</h1>
<div class="id">${esc(r.id)}</div>
${r.report ? `<a class="ours" href="${esc(r.report.url)}">${esc(reportLabel(r.report))}</a>` : ""}
<dl>
${side("Upper", r.upper, r.upperChanged, r.upperKind)}
${side("Lower", r.lower, r.lowerChanged, r.lowerKind)}
${auditBlock(r.id, audits, [r.upper, r.lower])}
</dl>
<div class="actions">
<a href="${esc(upstream)}">the mirrored file</a> &middot;
<a href="${esc(readable(r.url) || upstream)}">upstream source</a> &middot;
<a href="${esc(flagUrl(r, sha))}">looks wrong?</a>
</div>
<div class="cite"><strong>Cite this row</strong><code>${esc(citation(r, sha))}</code></div>
<footer><p>${esc(DISCLAIMER)}</p>
<p>Mirrored from <code style="display:inline;padding:.1rem .3rem">teorth/optimizationproblems@${esc(String(sha).slice(0, 7))}</code> — a snapshot at that commit, not a live read.</p>
<p>${esc(FRESHNESS)} The latest check and its verdict: <a href="${esc(RUNS)}">run history</a>.</p></footer>
</html>`;
}

// The footer's exact rendered text for the fixture below (sha abc1234def). Updated DELIBERATELY
// when the footer changes; an added sentence cannot slip in unreviewed.
const FOOTER_PIN = "These are the LAST-LISTED rows of this constant&#39;s bounds table upstream — a listing position, not a statement that either bound is the strongest or most recent known. Upstream keeps superseded and inferior rows because the tables are histories. Read the source file before citing. Mirrored from teorth/optimizationproblems@abc1234 — a snapshot at that commit, not a live read. This row is re-checked against upstream every day by a scheduled job, so an old date above does not mean nobody has looked. The dates and values above change only after an upstream change has been verified and published here, so an old date does not prove nothing has moved upstream either. The latest check and its verdict: run history.";

function selftest() {
  const claims = [
    { id: "pin:9z:U", statement: "Last-listed upper-bound table row for Test Constant (9z.md)", url: "https://example.invalid/9z.md", expect: "| 2.5 |" },
    { id: "pin:9z:L", statement: "Last-listed lower-bound table row for Test Constant (9z.md)", url: "https://example.invalid/9z.md", expect: "| 1.5 |" },
  ];
  const [row] = buildRows(claims, { withDates: false, reports: [] });
  const html = renderPage(row, "abc1234def");

  // Positive control BEFORE any absence is asserted.
  assert.ok(html.length > 800, "positive control: the page must render before anything is asserted absent");
  assert.match(html, /Test Constant/);
  assert.match(html, /\| 2\.5 \|/);
  assert.match(html, /\| 1\.5 \|/);
  assert.match(html, /abc1234/, "the page must name the upstream sha it is a snapshot of");
  assert.match(html, /canonical/, "each page needs a canonical URL or duplicates compete in search");

  // FRESHNESS (2026-09-22). Meaning first: the page says it is re-checked, says an old date is not
  // neglect, and hands the reader the live read. Scoped to the FOOTER, where it is rendered, and
  // proven non-empty before anything is asserted inside it.
  const footer = (html.match(/<footer>.*?<\/footer>/s) || [""])[0];
  assert.ok(footer.length > 100, "positive control: the footer must exist before anything is asserted inside it");
  assert.ok(footer.includes("re-checked against upstream every day"), "a constant page must say it is re-checked, not only that it is a snapshot");
  assert.ok(footer.includes("does not mean nobody has looked"), "a constant page must say an old date is not neglect");
  assert.match(footer, /href="https:\/\/github\.com\/u00dxk2\/bounds-ledger\/actions\/workflows\/reverify\.yml"/, "a constant page must link the live read of the last check");
  // THE WHOLE FOOTER IS PINNED (adversarial review, 2026-09-22), for two reasons it found.
  // (a) `footer.includes(esc(FRESHNESS))` was a TAUTOLOGY — the footer is built FROM esc(FRESHNESS),
  //     so it compared the output with its own input and survived every rewrite of that constant.
  // (b) A literal guard on one steadiness phrasing was evaded by appending a fresh one ("An old date
  //     above means this bound has been steady."), selftest still green. Enumerating forbidden words
  //     cannot work here — the text legitimately says "does not prove nothing has moved" — so this
  //     pins the EXACT emitted text instead, and any added or reworded sentence fails until someone
  //     updates the pin deliberately.
  const footerText = footer.replace(/<[^>]+>/g, "").replace(/&mdash;/g, "--").replace(/&rsquo;/g, "'").replace(/\s+/g, " ").trim();
  assert.equal(footerText, FOOTER_PIN);

  // It must NEVER assert a record. This is the table's refusal, carried to the page.
  assert.ok(html.includes("listing position"), "the page must say its pins are a listing position");
  for (const forbidden of [/\brecord\b(?!ed)/i, /strongest known/i, /best known bound/i]) {
    const body = html.replace(DISCLAIMER, "");
    assert.ok(!forbidden.test(body), `a constant page must not claim a record — matched ${forbidden}`);
  }

  // The cite block names THIS PAGE, not the table anchor — the whole point of the page. Both
  // polarities: the page URL is present AND the anchor form is proven absent, because a citation
  // carrying both would still send readers to the table.
  // Scoped to the CITE BLOCK, not the whole page: the "all constants" back-link at the top uses
  // the table anchor on purpose, so a page-wide absence assertion fails on a correct page. The
  // first draft of this test did exactly that and caught itself.
  const citeBlock = html.match(/<div class="cite">.*?<\/div>/s)[0];
  assert.match(citeBlock, /bounds-ledger\/c\/9z\.html/, "the page's cite block must cite the page, not the table row");
  assert.ok(!citeBlock.includes(`${SITE}#c-9z`), "the table anchor must not survive in the page's citation");
  assert.match(html, new RegExp(`href="${SITE}#c-9z"`), "positive control: the back-link DOES use the anchor, so the absence above is about the cite block alone");
  // A-40: the SHARED citation now carries the canonical page URL, so this page quotes it unmodified
  // and the table quotes the same bytes. Asserted here as well as in render-site's own suite, on
  // purpose: this file is where the divergence was introduced, so this is where a reintroduction
  // would be silent. If someone re-adds a local substitution, the equality below fails.
  assert.ok(
    citeBlock.includes(esc(citation(row, "abc1234def"))),
    "the page must quote the shared citation unchanged — one object, one address, on both surfaces",
  );
  assert.ok(citation(row, "abc1234def").includes(`${SITE}c/9z.html`),
    "the shared citation itself must carry the canonical page URL, not a form this file patches afterwards");

  // A missing side reads as "not pinned" rather than vanishing.
  const [oneSided] = buildRows([claims[0]], { withDates: false, reports: [] });
  const oneHtml = renderPage(oneSided, "abc1234def");
  assert.match(oneHtml, /not pinned/, "a constant with one pinned side must say the other is not pinned");

  // Escaping: a hostile title reaches the page as text, and the id is URL-encoded into hrefs
  // before attribute-escaping — the same ordering the table's own selftest pins.
  const hostile = [{ id: "pin:9z:U", statement: 'Last-listed upper-bound table row for Tea & "q" <b>x</b> (9z.md)', url: "https://example.invalid/9z.md", expect: "| 1 |" }];
  const [hostileRow] = buildRows(hostile, { withDates: false, reports: [] });
  const hostileHtml = renderPage(hostileRow, "abc1234def");
  assert.ok(hostileHtml.length > 800, "positive control: the hostile page must render before any absence is asserted");
  assert.ok(!/<b>x<\/b>/.test(hostileHtml), "a constant name carrying markup reached the page unescaped");

  // Negative control on the escaping assertion: the RAW title does contain the markup, so the
  // check above is testing the renderer rather than passing on an input that never had it.
  assert.match(hostile[0].statement, /<b>x<\/b>/);

  // ---- A-47 audit block. ASSERTION ORDER IS DELIBERATE (2026-09-06): the guards carrying the
  // MEANING come first, any exact string pin last, so a mutation names the property it broke.
  //
  // EVERY CASE BELOW EXISTS BECAUSE AN ADVERSARIAL REVIEW BROKE THE FIRST VERSION (2026-09-10).
  // It demonstrated three mutations that passed the whole suite — a hardcoded denominator, the
  // source anchor replaced by a span, and "Verified best known bound" inside the block — plus
  // hostile store values reaching executable HTML. The worst was structural: the no-record
  // prohibition ran ONLY on the unaudited fixture, so the guard could not see the surface the
  // audit block had just added. That is this lane's founding defect in a new place.
  const pinId = (text) => ({ rowText: text, rowTextSha256: crypto.createHash("sha256").update(text.trim(), "utf8").digest("hex").slice(0, 16), inMirror: true });
  const store = {
    audits: [
      { id: "T-1", constant: "9z", citedRef: "REF1", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/p1", sourceRead: "read in the abstract", selection: "systematic", ...pinId("| $5.555555$ | [REF1] | x |") },
      { id: "T-2", constant: "9z", citedRef: "REF2", leg: "citation-well-formed", verdict: "UNRESOLVED", source: "https://example.invalid/p2", sourceRead: "read in the body", selection: "systematic" },
      { id: "T-3", constant: "OTHER", citedRef: "REF3", leg: "value-vs-source", verdict: "DEFECTIVE", source: "https://example.invalid/p3", sourceRead: "read in the abstract", selection: "systematic", ...pinId("| $6.555555$ | [REF3] | x |") },
    ],
    // Deliberately NOT the live figure (read from the store below): a fixture equal to it cannot tell a rendered
    // denominator from a hardcoded one.
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  };
  const audited = renderPage(row, "abc1234def", store);

  assert.ok(audited.length > 800, "positive control: the audited page must render before anything is asserted about it");

  // (a) THE PROHIBITION APPLIES TO THE AUDITED PAGE. This is the assertion whose absence the
  //     review called out: the block is new surface, and the no-record rule must reach it.
  for (const forbidden of [/\brecord\b(?!ed)/i, /strongest known/i, /best known bound/i]) {
    assert.ok(!forbidden.test(audited.replace(DISCLAIMER, "")),
      `the AUDITED page must not claim a record either — matched ${forbidden}`);
  }
  // ...and an unknown verdict is DROPPED, never printed, which is how a store row could smuggle
  //     such a claim onto the page in the first place.
  const smuggle = renderPage(row, "abc1234def", {
    audits: [{ id: "T-X", constant: "9z", citedRef: "REF9", leg: "value-vs-source", verdict: "VERIFIED BEST KNOWN BOUND", source: "https://example.invalid/x" }],
    corpus: { citedRows: 999 },
  });
  assert.ok(!/best known bound/i.test(smuggle), "an unrecognised verdict must never reach the page verbatim");
  assert.ok(!smuggle.includes("Checked against material for its cited source"), "a store of only unusable rows must render no block at all");
  assert.ok(!smuggle.includes('<ul class="audit">'), "no block under either heading");

  // (b) MEANING: the verdict is stated in words, and the link text matches the verdict — "the
  //     source we read" beside UNREACHABLE would contradict itself.
  // Review round 3 (C2): a read verdict must not say the CITED source was read or reached (22a and 32a
  // reached only a preprint), nor that it supports the whole row (15a and 26a checked one claim).
  // MEANING FIRST, the exact wording pins after it.
  // Round 4 (B3): the HEADING and the COUNT said the same thing on 22a and 32a ("Read against its cited
  // source", "have been read against their cited source") where only a preprint was read.
  // Round 5 (R5-3a/b): the CLASS, closed from an enumeration of every rendered sentence about reading a
  // source, not one surface per round: the ledger-wide count and the suspicion clause said "were read".
  for (const claim of [/the cited source was read/, /the cited source was reached/, /supports this row/,
    /<dt>Read against its cited source/, /<dt>Read or tried against its cited source/, /read against their cited source/,
    /sources of \d+ were read/, /for suspicion and read/]) {
    assert.ok(!claim.test(audited), `a read verdict must claim only what its verdict guarantees — matched ${claim}`);
  }
  //   T-2 is a reference-entry check, which is not a row (87a's page said "in this row" for one).
  assert.ok(!/reference entry citing <code[^>]*>\[REF2\]<\/code> &mdash; [^<]*in this row/.test(audited), "a reference-entry verdict must not call the entry a row");
  assert.ok(audited.includes("could not settle the claim we checked in this entry"), "positive control: the reference-entry verdict rendered, about the entry");
  assert.ok(audited.includes("what we read supports the claim we checked in this row"), "a SOUND row must say what was done");
  assert.ok(audited.includes("what we read could not settle the claim we checked in this entry"), "UNRESOLVED must read as its own outcome (the fixture's UNRESOLVED is T-2, a reference entry)");
  const unreach = renderPage(row, "abc1234def", { audits: [{ id: "T-U", constant: "9z", citedRef: "R", leg: "value-vs-source", verdict: "UNREACHABLE", source: "https://example.invalid/u", ...pinId("| $7.555555$ | [R] | x |") }], corpus: { citedRows: 999 } });
  assert.ok(!/>source link</.test(unreach), "an UNREACHABLE row must not offer the read verdicts' link text");
  assert.ok(unreach.includes("the source we could not read"), "positive control: UNREACHABLE has its own link text");
  // 2026-10-01 round 2: the stored `source` is not always the copy that was read (22a linked the
  // publisher that refused us under "the source we reached"), so no read verdict's link may say it was.
  for (const claim of [/>the source we read</, />the source we reached</]) {
    assert.ok(!claim.test(audited), `a read verdict's link must not claim which copy was read — matched ${claim}`);
  }

  // (c) MEANING: the source is a real anchor pointing at the stored URL — a span containing the
  //     text would satisfy a substring check while giving the reader nothing to click.
  assert.match(audited, /<a href="https:\/\/example\.invalid\/p1">source link<\/a>/,
    "each audited row must link its source as an anchor whose href IS that source");

  // (c2) WHICH ROW EACH VERDICT JUDGES, relative to the rows shown (2026-10-01 cold walk, finding 1).
  //      The fixture pins "| 2.5 |" and "| 1.5 |", so T-1's row is NOT shown. MEANING first.
  const rel = (h) => [...h.matchAll(/<span class="rel">([^<]*)<\/span>/g)].map((m) => m[1]);
  assert.deepEqual(rel(audited), ["Another row, not one shown above:"],
    "a verdict on a row the reader is not looking at must say so, and only the bound row gets a phrase (T-2 is a reference entry)");
  //      The SHOWN case, with the audited row pinned as the upper bound. This is the case that proves
  //      the pinned rows reach isShownRow: pass it anything else and this fails.
  const shownClaims = [{ ...claims[0], expect: "| $5.555555$ | [REF1] | x |" }, claims[1]];
  const [shownRow] = buildRows(shownClaims, { withDates: false, reports: [] });
  const shownPage = renderPage(shownRow, "abc1234def", store);
  assert.deepEqual(rel(shownPage), ["The row shown above:"], "a verdict on the row shown must say it is that row");
  //      The same, when the audited row is the LOWER pin (review gap: only the upper match was tested).
  const lowerClaims = [claims[0], { ...claims[1], expect: "| $5.555555$ | [REF1] | x |" }];
  const [lowerRow] = buildRows(lowerClaims, { withDates: false, reports: [] });
  assert.deepEqual(rel(renderPage(lowerRow, "abc1234def", store)), ["The row shown above:"], "a verdict on the shown LOWER row must say it is that row");
  //      DEFECTIVE's link must not claim which copy was read either (review gap: the fixture lacked it).
  const defPage = renderPage(row, "abc1234def", { audits: [{ ...store.audits[0], verdict: "DEFECTIVE" }], corpus: { citedRows: 999 } });
  assert.ok(defPage.includes("does NOT support the claim we checked"), "positive control: the DEFECTIVE verdict rendered");
  assert.ok(!/>the source we read</.test(defPage), "a DEFECTIVE verdict's link must not claim which copy was read");
  //      Review R2: a row crediting its bound to someone else, citing the key only in its comment, must not
  //      read "bound row <value> citing [KEY]".
  const commentPage = renderPage(row, "abc1234def", { audits: [{ ...store.audits[0], citedRef: "DMP2019", ...pinId("| $\\infty$ | Trivial | best estimate [DMP2019] |") }], corpus: { citedRows: 999 } });
  assert.ok(commentPage.includes("whose comment cites"), "a comment-cited key must be said to be cited in the comment");
  //      Review round 2: a key in BOTH the credit cell and the comment is credited, so "citing", never
  //      "whose comment cites"; a key found in neither (here only inside the VALUE cell) is placed nowhere.
  const bothPage = renderPage(row, "abc1234def", { audits: [{ ...store.audits[0], ...pinId("| $5.555555$ | [REF1] | see also [REF1] |") }], corpus: { citedRows: 999 } });
  assert.ok(bothPage.includes("Another row") && !bothPage.includes("whose comment cites"), "a credited key also named in the comment is still credited");
  assert.match(bothPage, /<\/code> citing <code/, "positive control: the credited form says citing");
  const nowherePage = renderPage(row, "abc1234def", { audits: [{ ...store.audits[0], ...pinId("| $[REF1]$ | Trivial | x |") }], corpus: { citedRows: 999 } });
  assert.ok(nowherePage.includes("audited against") && !/<\/code> citing <code/.test(nowherePage) && !nowherePage.includes("whose comment cites"),
    "a key the row places nowhere gets the claim-free form, neither credited nor comment-cited");
  assert.ok(!/<\/code>[^<]*<a [^>]*>line [^<]*<\/a> citing /.test(commentPage) && !/<\/code> citing <code/.test(commentPage), "and the value must not be said to be credited to it");
  //      A STALE row gets no phrase: we cannot prove what the row at that line is today.
  const stalePage = renderPage(row, "abc1234def", { audits: [{ ...store.audits[0], inMirror: false }], corpus: { citedRows: 999 } });
  assert.ok(stalePage.includes("earlier version of the table"), "positive control: the stale verdict rendered");
  assert.ok(!/was read against its cited source/.test(stalePage), "a stale read verdict must not say the cited source itself was read (R5-3b)");
  assert.deepEqual(rel(stalePage), [], "a stale verdict must not be placed relative to the rows shown");

  // (c3) "upstream source" opens the RENDERED GitHub page, never raw markdown (cold walk, finding 2):
  //      on a phone the raw file rendered at about 4px and its paper links could not be tapped.
  const rawClaims = claims.map((c) => ({ ...c, url: "https://raw.githubusercontent.com/teorth/optimizationproblems/main/constants/9z.md" }));
  const [rawRow] = buildRows(rawClaims, { withDates: false, reports: [] });
  const rawPage = renderPage(rawRow, "abc1234def");
  assert.match(rawPage, /<a href="https:\/\/github\.com\/teorth\/optimizationproblems\/blob\/main\/constants\/9z\.md">upstream source<\/a>/,
    "upstream source must link the rendered GitHub page");
  assert.ok(!rawPage.includes("raw.githubusercontent.com"), "no raw.githubusercontent.com link may survive on a constant page");

  // (d) MEANING: only http(s) is rendered. `javascript:` survives attribute escaping.
  const hostileUrl = renderPage(row, "abc1234def", { audits: [{ id: "T-J", constant: "9z", citedRef: "R", leg: "value-vs-source", verdict: "SOUND", source: "javascript:alert(1)" }], corpus: { citedRows: 999 } });
  assert.ok(!/javascript:/i.test(hostileUrl), "a javascript: source must never reach the published page");
  assert.ok(!hostileUrl.includes("Checked against material for its cited source"), "a row whose only source is unusable is dropped, not rendered link-less");
  assert.ok(!hostileUrl.includes('<ul class="audit">'), "no block under either heading");

  // (e) MEANING: hostile store text is escaped rather than interpolated as markup.
  const hostileStore = renderPage(row, "abc1234def", {
    audits: [{ id: "T-H", constant: "9z", citedRef: '<img src=x onerror=alert(1)>', leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/h", sourceRead: '<b>note</b>' }],
    corpus: { citedRows: 999 },
  });
  assert.ok(hostileStore.includes("Checked against material for its cited source"), "positive control: the hostile-store page DID render a block, so the absences below are real");
  assert.ok(!/<img src=x/.test(hostileStore), "a hostile citedRef reached the page as markup");
  assert.ok(!/<b>note<\/b>/.test(hostileStore), "a hostile sourceRead reached the page as markup");

  // (f) MEANING: a malformed entry must not take all 115 pages down with it.
  const withNull = renderPage(row, "abc1234def", { audits: [null, store.audits[0]], corpus: { citedRows: 999 } });
  assert.ok(withNull.includes("Checked against material for its cited source"), "a null entry beside a good one must not abort rendering");

  // (f2) A-53 (b), 2026-10-01: the renderer above stays robust, and the GENERATORS refuse instead.
  //      Meaning first, the count last, so each mutation names the property it broke.
  const goodEntry = store.audits[0];
  const staleEntry = { ...goodEntry, id: "T-ST", inMirror: false };
  const toDrop = { audits: [
    null,
    { ...goodEntry, id: "T-RP", source: "ledger/teorth-optimizationproblems/constants/10c.md#L281" },
    { ...goodEntry, id: "T-UV", verdict: "VERIFIED" },
    staleEntry,
    goodEntry,
  ] };
  const dropped = droppedAudits(toDrop);
  assert.ok(isStale(staleEntry) && !dropped.some((d) => d.at === "T-ST"),
    "a STALE entry renders as historical and must never trip the refusal — upstream drift would stop every render");
  assert.ok(!dropped.some((d) => d.at === goodEntry.id), "SILENT: a usable entry is never named");
  assert.ok(dropped.some((d) => d.at === "T-RP" && d.why === "source is not an http(s) URL"),
    "FIRES: the 2026-09-16 instance — a repository path as source — is named with its reason");
  assert.ok(dropped.some((d) => d.at === "T-UV" && /verdict is outside/.test(d.why)), "FIRES: an unknown verdict is named");
  assert.ok(dropped.some((d) => d.at === "audits[0]" && d.why === "not an object"), "FIRES: a null entry is named by position");
  assert.equal(dropped.length, 3, "exactly the three unusable entries, no more");
  const refusalDir = join(ROOT, "tmp", `a53-selftest-${process.pid}`);
  mkdirSync(refusalDir, { recursive: true });
  try {
    writeFileSync(join(refusalDir, "bad.json"), "{ not json");
    writeFileSync(join(refusalDir, "good.json"), JSON.stringify({ audits: [goodEntry, staleEntry] }));
    writeFileSync(join(refusalDir, "drops.json"), JSON.stringify({ audits: [goodEntry, { ...goodEntry, id: "T-RP", source: "ledger/x.md" }] }));
    assert.ok(/did not parse/.test((auditStoreRefusal(join(refusalDir, "bad.json")) || [""])[0]),
      "an unparseable store refuses: every entry in it would vanish from every page");
    assert.ok(/^T-RP: source is not an http\(s\) URL$/.test((auditStoreRefusal(join(refusalDir, "drops.json")) || [""])[0]),
      "a store file holding a droppable entry refuses and names it");
    assert.equal(auditStoreRefusal(join(refusalDir, "good.json")), null, "SILENT: good and stale entries alone do not refuse");
    assert.ok(/absent/.test((auditStoreRefusal(join(refusalDir, "absent.json")) || [""])[0]),
      "an ABSENT store refuses: it would drop every entry from every page, and depth-audit.mjs refuses it too");
    writeFileSync(join(refusalDir, "nopage.json"), JSON.stringify({ audits: [goodEntry, { ...goodEntry, id: "T-PG", constant: "zz9" }] }));
    const noPage = auditStoreRefusal(join(refusalDir, "nopage.json"), new Set([goodEntry.constant]));
    assert.ok(noPage && noPage.includes('T-PG: constant "zz9" names no page'), "FIRES: a usable entry whose constant has no page is refused, not silently dropped");
    assert.ok(!noPage.some((l) => l.startsWith(`${goodEntry.id}:`)), "SILENT: an entry whose constant has a page is not named");
    // THE WIRING, not only the helper: main() itself must refuse a droppable store and write nothing.
    // Deleting its refuseDroppedAudits call makes this fail (it would compare pages and PASS).
    const before = process.exitCode;
    const errs = [];
    const origErr = console.error;
    console.error = (...a) => errs.push(a.join(" "));
    try { main({ check: true, storePath: join(refusalDir, "drops.json") }); } finally { console.error = origErr; }
    // The NAMING comes first: exit code 1 alone is also what a stale page produces, so it cannot tell
    // the refusal from staleness (red-armed 2026-10-01: with the call deleted and the pages stale, the
    // exit-code check still passed and only this one failed).
    assert.ok(errs.some((l) => l.includes("T-RP: source is not an http(s) URL")), "main() must refuse a droppable store and name the entry it refused");
    assert.equal(process.exitCode, 1, "…and exit 1");
    process.exitCode = before;
  } finally {
    rmSync(refusalDir, { recursive: true, force: true });
  }

  // (g) MEANING, and the one that keeps this honest: it must never read as coverage. The
  //     denominator is RENDERED FROM THE STORE (999 here, not the live corpus figure) and the not-checked
  //     disclaimer is present.
  assert.ok(audited.includes("999"), "the denominator must come from the store, not be hardcoded on the page");
  const liveCited = JSON.parse(readFileSync(join(ROOT, "continuity", "depth-audit.json"), "utf8")).meta?.corpus?.citedRows;
  assert.ok(Number.isSafeInteger(liveCited) && liveCited > 0 && liveCited !== 999, "positive control: the live cited-row figure is readable from the store and differs from the fixture");
  assert.ok(!audited.includes(String(liveCited)), "a fixture denominator of 999 must not render the LIVE figure — that would prove the number is baked in");
  assert.ok(audited.includes("2026-01-02"), "the denominator must carry the date it was measured, or it goes stale in silence");
  assert.ok(audited.includes("has NOT been checked"), "the block must say plainly that unlisted rows are unchecked");

  // (h) MEANING: populations are not conflated. The corpus figure counts cited BOUND ROWS, so a reference-entry
  //     check must be reported separately rather than folded into that ratio.
  assert.ok(/1 bound row\(s\) here/.test(audited), "bound rows are counted on their own against the bound-row denominator");
  assert.ok(/1 reference entry here was also checked/.test(audited), "a reference-entry check must be named as a different population");
  assert.ok(/ledger 2 row\(s\) have been drawn by position/.test(audited), "the ledger-wide figure counts bound rows only (2 of the 3 fixtures), never every audit row");

  // (h2) THE EXTREME CASE, and the fixture above could not show it: a constant with a reference
  //      check and NO bound rows. The first version said "also checked ... not counted against
  //      that figure" while stating no figure at all, because both legs were always present in
  //      the fixture. Caught by reading the real 87a page, not the test.
  const refOnly = renderPage(row, "abc1234def", {
    audits: [{ id: "T-R", constant: "9z", citedRef: "R", leg: "citation-well-formed", verdict: "UNRESOLVED", source: "https://example.invalid/r" }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(refOnly.includes("Checked against material for its cited source"), "positive control: the reference-only page renders a block");
  assert.ok(!/also checked/.test(refOnly), "with no bound rows there is no earlier figure for 'also' to refer back to");
  assert.ok(!/that figure/.test(refOnly), "a dangling 'that figure' points at a number the sentence never stated");
  assert.ok(/no bound row of this constant has been read against its source yet/.test(refOnly),
    "a reference-only constant must say plainly that none of its bound rows have been read");

  // (h3) EVERY VERDICT IS RENDERED ON THE TARGET CONSTANT AND ITS MEANING ASSERTED. The review
  //      showed DEFECTIVE prose could be reversed to say the source SUPPORTS the row and the suite
  //      still passed, because DEFECTIVE only ever appeared on the OTHER constant and so was never
  //      read. A verdict rendered somewhere the assertions cannot see is an unchecked verdict.
  const defective = renderPage(row, "abc1234def", {
    audits: [{ id: "T-D", constant: "9z", citedRef: "RD", leg: "value-vs-source", verdict: "DEFECTIVE", source: "https://example.invalid/d", ...pinId("| $8.555555$ | [RD] | x |") }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(defective.includes("does NOT support the claim we checked in this row"),
    "DEFECTIVE must say the source does NOT support the row — reversing it silently inverts an audit outcome");
  assert.ok(!/ supports the claim we checked/.test(defective), "DEFECTIVE must never render the SOUND sentence");

  // (h4) AN UNREACHABLE SOURCE WAS NOT READ, and the summary must not count it as read. The page
  //      previously printed "could not be read at all" beside "1 bound row(s) ... have been read".
  const unreadOnly = renderPage(row, "abc1234def", {
    audits: [{ id: "T-U2", constant: "9z", citedRef: "RU", leg: "value-vs-source", verdict: "UNREACHABLE", source: "https://example.invalid/u2", fetchedAt: "2026-09-16 at 15:51Z", ...pinId("| $9.555555$ | [RU] | x |") }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(unreadOnly.includes('<ul class="audit">'), "positive control: the unreachable-only page renders a block");
  assert.ok(!/have been checked against material for their cited source/.test(unreadOnly),
    "a source that could not be read must not be counted as read");
  assert.ok(/Attempted, and the source could NOT be read/.test(unreadOnly),
    "an attempted-but-unreachable row must be disclosed as its own category");
  // (h4b) THE HEADING SAYS WHAT HAPPENED, AND THE ROW IS NAMED (2026-09-29, round 3). The block was
  //       headed "Read against its cited source" over a bullet saying the source could not be read at
  //       all, and it counted "1 further bound row(s)" without saying which. MEANING first, pins last.
  assert.ok(!unreadOnly.includes("<dt>Checked against material for its cited source</dt>"), "a block where nothing was read must not be headed as a reading");
  assert.ok(unreadOnly.includes("<dt>Tried, could not open its cited source (2026-09-16)</dt>"), "and is headed as an attempt, with the attempt's date");
  assert.ok(unreadOnly.includes("could not be read at all (tried 2026-09-16)"), "the attempted row's own line carries the date the index line promised");
  assert.ok(!/further bound row/.test(unreadOnly), "with nothing read there is nothing for 'further' to be further than");
  assert.ok(/the bound row <code[^>]*>\$9\.555555\$<\/code> citing \[RU\]/.test(unreadOnly), "the attempted row is named by its value and key, not counted");
  assert.ok(!/one of the last-listed rows shown above/.test(unreadOnly), "a tried row that is not a displayed pin must not be called one");
  assert.ok(unreadOnly.includes("No bound row of this constant has been read against its source, including the last-listed rows shown above."),
    "the page must say the rows shown are unread too, so the attempt cannot be read as doubt about them alone");
  // ...and when the tried row IS a displayed pin (0 of 7 live on 2026-09-29, so only a fixture can
  // reach this branch), the page says so. Whole-row equality: the fixture's pin is `| 2.5 |`.
  const shownUnread = renderPage(row, "abc1234def", {
    audits: [{ id: "T-U3", constant: "9z", citedRef: "RU", leg: "value-vs-source", verdict: "UNREACHABLE", source: "https://example.invalid/u3", ...pinId("| 2.5 |") }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(/one of the last-listed rows shown above/.test(shownUnread), "an attempt of a displayed row must say it is one of those shown");
  assert.ok(shownUnread.includes("<dt>Tried, could not open its cited source</dt>"), "an undated attempt gives the heading without a guessed date");
  // A page with a READING keeps the reading heading.
  assert.ok(audited.includes("<dt>Checked against material for its cited source</dt>"), "a block with a reading keeps the reading heading");
  // (h4c) Review R3 (2026-09-29): a citation-check READING beside a bound row that could only be
  //       TRIED was headed as a reading over the attempt. A block holding both is headed as both.
  const citeReadBoundTried = renderPage(row, "abc1234def", {
    audits: [
      { id: "T-C1", constant: "9z", citedRef: "RC", leg: "citation-well-formed", verdict: "SOUND", source: "https://example.invalid/c1" },
      { id: "T-C2", constant: "9z", citedRef: "RU", leg: "value-vs-source", verdict: "UNREACHABLE", source: "https://example.invalid/c2", ...pinId("| $9.555555$ | [RU] | x |") },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(!citeReadBoundTried.includes("<dt>Checked against material for its cited source</dt>"), "an attempt must not sit under a reading-only heading because a citation check was read");
  assert.ok(!citeReadBoundTried.includes("<dt>Tried, could not open"), "nor a reading under an attempt-only heading");
  assert.ok(citeReadBoundTried.includes("<dt>Checked or tried against material for its cited source</dt>"), "a block with both is headed as both");
  // (h4d) Review R2 (2026-09-29): a row that was tried AND later read is a read row. Naming it among
  //       the attempted rows printed "That row is not counted as read" beside a count that included it.
  const triedThenRead = renderPage(row, "abc1234def", {
    audits: [
      { id: "T-TR1", constant: "9z", citedRef: "RT", leg: "value-vs-source", verdict: "UNREACHABLE", source: "https://example.invalid/t1", fetchedAt: "2026-09-11", ...pinId("| $3.141592$ | [RT] | x |") },
      { id: "T-TR2", constant: "9z", citedRef: "RT", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/t2", ...pinId("| $3.141592$ | [RT] | x |") },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(/1 bound row\(s\) here have been checked/.test(triedThenRead), "positive control: the row is counted as read");
  assert.ok(!/not counted as read/.test(triedThenRead), "a row that was read must never also be named as not counted as read");

  // (h5) A REPEAT AUDIT OF THE SAME ROW IS ONE ROW. Counting entries let a recheck inflate apparent
  //      coverage without examining any new material.
  const pinned = { constant: "9z", citedRef: "RP", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/p", rowFile: "ledger/x/9z.md", rowLine: 33, rowTextSha256: "abc123", ...pinId("| $3.333333$ | [RP] | x |") };
  const repeated = renderPage(row, "abc1234def", {
    audits: [{ ...pinned, id: "T-P1" }, { ...pinned, id: "T-P2" }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(/1 bound row\(s\) here/.test(repeated),
    "two audits of the SAME row are one row read — counting entries would inflate coverage on a recheck");
  assert.ok(!/2 bound row\(s\) here/.test(repeated), "negative control: the inflated count must not appear");

  // (h6) THE AUDITED ROW IS IDENTIFIED. On the live 10a page both bounds cite the same reference,
  //      so "supports this row" is ambiguous without the line the audit actually covered.
  assert.match(repeated, /<a href="[^"]*9z\.md\?plain=1#L33">line 33<\/a>/,
    "a pinned bound row must link the exact line it audited, in GitHub's code view (?plain=1#L<N>; a bare #L<N> lands at the top of a rendered .md), or the reader cannot tell which bound was checked");

  // (h7) HOSTILE measuredAt is escaped — it reaches the page like any other store string.
  const hostileWhen = renderPage(row, "abc1234def", {
    audits: [{ ...pinned, id: "T-W" }],
    corpus: { citedRows: 999, measuredAt: '<img src=x onerror=alert(1)>' },
  });
  assert.ok(hostileWhen.includes("Checked against material for its cited source"), "positive control: the hostile-date page renders a block");
  assert.ok(!/<img src=x/.test(hostileWhen), "a hostile measuredAt reached the page as markup");

  // (h8) A MALFORMED FIELD TYPE must not abort generation of every page.
  const malformed = renderPage(row, "abc1234def", {
    audits: [{ id: "T-M", constant: "9z", citedRef: "RM", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/m", sourceRead: { toString: null } }, { ...pinned, id: "T-OK" }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(malformed.includes("line 33"), "a malformed entry must be dropped without taking the good one, or the page, down with it");

  // (h9) HOW THE ROW WAS CHOSEN REACHES THE READER, and the two populations are counted apart.
  //      Slice 1 was suspicion-drawn and sat inside the ledger-wide figure with nothing saying so.
  //      The MEANING guards come first; the count pins last (the 2026-09-06 assertion-order rule).
  const mixed = renderPage(row, "abc1234def", {
    audits: [
      { id: "T-S1", constant: "9z", citedRef: "RS", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/s", rowFile: "ledger/x/9z.md", rowLine: 10, rowTextSha256: "s1", selection: "systematic", ...pinId("| $1.111111$ | [RS] | x |") },
      { id: "T-S2", constant: "9z", citedRef: "RH", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/h2", rowFile: "ledger/x/9z.md", rowLine: 11, rowTextSha256: "s2", selection: "suspicion", ...pinId("| $1.222222$ | [RH] | x |") },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(mixed.includes("Checked against material for its cited source"), "positive control: the mixed-selection page renders a block");
  assert.ok(mixed.includes("drawn by its position in the list of cited rows, not because it looked wrong"), "a systematic row must say how it was drawn, in plain words that match the count sentence");
  assert.ok(!mixed.includes("drawn by position before it was read"), "the retired jargon label must not come back");
  assert.ok(mixed.includes("chosen because something already looked wrong"), "a suspicion-drawn row must say so on the page, not only in the store");
  assert.ok(/carries no rate/.test(mixed), "the page must say why a suspicion-drawn set is counted apart");
  assert.ok(/1 drawn by position, 1 chosen because/.test(mixed), "the per-page count names both populations");
  assert.ok(/ledger 1 row\(s\) have been drawn by position, against 999 rows/.test(mixed),
    "the ledger-wide coverage figure counts ONLY the rows drawn by position");
  assert.ok(/1 more were chosen for suspicion and checked; they are counted apart/.test(mixed), "and the suspicion-drawn rows are stated beside it, not hidden");

  // ...and ONE ROW AUDITED TWICE under different selections is ONE row, in ONE group. Found by
  // adversarial review 2026-09-13: counting each group's rows independently printed "1 bound row(s)
  // here" beside "1 drawn by position, 1 chosen because…", inflating the work and contradicting the
  // recheck invariant (h5) in the same sentence.
  const recheckPin = { constant: "9z", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/r2", rowFile: "ledger/x/9z.md", rowLine: 20, rowTextSha256: "same-row", ...pinId("| $2.222222$ | [RR] | x |") };
  const rechecked = renderPage(row, "abc1234def", {
    audits: [
      { ...recheckPin, id: "T-R1", citedRef: "RR", selection: "systematic" },
      { ...recheckPin, id: "T-R2", citedRef: "RR", selection: "suspicion" },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(/1 bound row\(s\) here/.test(rechecked), "positive control: two audits of one row are one row read");
  assert.ok(/\(1 drawn by position, 0 chosen because/.test(rechecked),
    "a row read twice under different selections lands in ONE group — a row the ladder reached stays coverage");
  assert.ok(!/1 drawn by position, 1 chosen because/.test(rechecked), "negative control: the double-counted split must not appear");
  assert.ok(/ledger 1 row\(s\) have been drawn by position/.test(rechecked), "and the ledger-wide figure counts it once");
  assert.ok(/0 more were chosen for suspicion/.test(rechecked), "with nothing left over in the suspicion set");

  // ...and the UNLABELLED case goes to suspicion, the direction that understates coverage. An
  // entry with no `selection` must never be counted into the systematic figure by default.
  const unlabelled = renderPage(row, "abc1234def", {
    audits: [{ id: "T-N", constant: "9z", citedRef: "RN", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/n", rowFile: "ledger/x/9z.md", rowLine: 12, rowTextSha256: "n1", ...pinId("| $4.444444$ | [RN] | x |") }],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(/ledger 0 row\(s\) have been drawn by position/.test(unlabelled), "an unlabelled row must NOT count as systematic coverage");
  assert.ok(/1 more were chosen for suspicion/.test(unlabelled), "an unlabelled row is counted with the suspicion set");

  // ...and the ledger-wide DRAW counts every drawn row, read or not (adversarial review, 2026-09-21).
  // The sentence counted only rows whose source was read and called them "drawn by position", so
  // five draws whose sources could not be reached vanished from the sampling history it describes.
  const drawnUnread = renderPage(row, "abc1234def", {
    audits: [
      { id: "T-D1", constant: "9z", citedRef: "RD", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/d1", rowFile: "ledger/x/9z.md", rowLine: 30, selection: "systematic", ...pinId("| $5.515151$ | [RD] | x |") },
      { id: "T-D2", constant: "9z", citedRef: "RU", leg: "value-vs-source", verdict: "UNREACHABLE", source: "https://example.invalid/d2", rowFile: "ledger/x/9z.md", rowLine: 31, selection: "systematic", ...pinId("| $6.616161$ | [RU] | x |") },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(drawnUnread.includes("<dt>Checked or tried against material for its cited source</dt>"), "positive control: the drawn-but-unread fixture renders a block, headed as both");
  assert.ok(/ledger 2 row\(s\) have been drawn by position/.test(drawnUnread), "a drawn row whose source could not be read is still a draw, and is counted as one");
  assert.ok(/1 were checked against material for their cited sources and for 1 the cited source could not be read at all/.test(drawnUnread), "the sentence says how many drawn rows were read and how many were not");

  // ...and the prohibition runs on THIS new surface too, which is the guard that was missing when
  // the audit block itself was added (2026-09-10) and again when a second render path appeared.
  for (const forbidden of [/\brecord\b(?!ed)/i, /strongest known/i, /best known bound/i]) {
    assert.ok(!forbidden.test(mixed.replace(DISCLAIMER, "")),
      `the selection-labelled page must not claim a record either — matched ${forbidden}`);
  }

  // (h10) THE VALUE CHECKED IS ON THE PAGE. On 2026-09-13 three of 1b's four audited values appeared
  //       nowhere in the served HTML — the row was named by line and citation only. MEANING first: the
  //       number is visible for a bound row, absent for a reference entry (whose first cell is not a
  //       bound), escaped when hostile, and a malformed rowText neither crashes nor prints.
  const sha16 = (t) => crypto.createHash("sha256").update(t.trim(), "utf8").digest("hex").slice(0, 16);
  const goodText = "| $0.380876$ | [RV] | TTT-Discover |";
  const goodRow = { id: "T-V1", constant: "9z", citedRef: "RV", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/v", rowFile: "ledger/x/9z.md", rowLine: 24, rowTextSha256: sha16(goodText), rowText: goodText, inMirror: true, selection: "suspicion" };
  const refText = "| $9.111111$ | [RV] | should not print |";
  const valued = renderPage(row, "abc1234def", {
    audits: [
      goodRow,
      { id: "T-V2", constant: "9z", citedRef: "RV", leg: "citation-well-formed", verdict: "UNREACHABLE", source: "https://example.invalid/dead", rowFile: "ledger/x/9z.md", rowLine: 25, rowTextSha256: sha16(refText), rowText: refText, inMirror: true, selection: "suspicion" },
    ],
    corpus: { citedRows: 999, measuredAt: "2026-01-02" },
  });
  assert.ok(valued.includes("<dt>Checked or tried against material for its cited source</dt>"), "positive control: the valued page renders a block (a reading and an unreachable citation check, so headed as both)");
  assert.ok(valued.includes("0.380876"), "a VERIFIED bound row must show the value that was checked, not only its line and citation");
  assert.ok(!valued.includes("9.111111"), "a reference entry must not print a first cell as though it were a checked bound");
  // THE LINE LINK LANDS ON ITS LINE (A-64, 2026-10-02). MEANING first: the anchor must be one GitHub
  // honours, and it only does in the code view. `lineLinks` reads the ONE shape rowLink emits (a
  // double-quoted href ending #L<digits>) and is used for the POSITIVE assertions only. The stale
  // assertions below assert ABSENCE with `hasLineAnchor`, which asks only whether "#L<digit>" occurs
  // anywhere in the page, so no change of attribute shape can make them pass on a stale row that links
  // (Codex review of f573da8, 2026-10-02: the first version used lineLinks for both and its comment
  // claimed it saw every shape, which its pattern does not). The old pattern named the pre-A-64 shape
  // outright, so the moment that shape changed it would have passed vacuously.
  const lineLinks = (html) => [...html.matchAll(/href="([^"]*#L\d+)"/g)].map((m) => m[1]);
  const hasLineAnchor = (html) => /#L\d/.test(html);
  assert.equal(lineLinks(valued).length, 1, "positive control: a verified bound row carries exactly one line link (the reference entry carries none)");
  assert.match(lineLinks(valued)[0], /\?plain=1#L24$/, "a line link must open GitHub's code view (?plain=1), or the #L anchor does nothing and the reader lands at the top of the file");
  assert.match(lineLinks(valued)[0], /\/blob\/main\/ledger\/x\/9z\.md\?plain=1#L24$/, "and it must name the audited row's own file and line");
  const attemptedLive = renderPage(row, "abc1234def", { audits: [{ ...goodRow, verdict: "UNREACHABLE" }], corpus: { citedRows: 999, measuredAt: "2026-01-02" } });
  // Linked twice (the verdict list and the "Attempted" sentence), so assert the shape of each.
  const attemptedHrefs = lineLinks(attemptedLive).map((h) => h.replace(/^.*\//, ""));
  assert.ok(attemptedHrefs.length > 0 && attemptedHrefs.every((h) => h === "9z.md?plain=1#L24"),
    `an attempted row that still stands at its line is linked the same way — got ${JSON.stringify(attemptedHrefs)}`);
  assert.ok(hasLineAnchor(valued) && hasLineAnchor(attemptedLive), "positive control for hasLineAnchor: both live fixtures carry a line anchor, so its absences below are not vacuous");

  // A PINNED audit whose identity can no longer be proved renders as HISTORICAL (review round 2): the
  // reading is kept, but the page must not say the source supports the row, must not link the live
  // line, must not print the number, and must not count it as read. MEANING FIRST, so a mutation names
  // the property it broke (the 2026-09-06 assertion-order rule).
  const staleHtml = (a, msg) => {
    const html = renderPage(row, "abc1234def", { audits: [a], corpus: { citedRows: 999, measuredAt: "2026-01-02" } });
    assert.ok(html.includes("says nothing about the row there now"), `(${msg}) a pinned audit that fails identity must render as HISTORICAL`);
    assert.ok(!html.includes("supports the claim we checked"), `(${msg}) and must NOT say the cited source supports the row there now`);
    assert.ok(!hasLineAnchor(html), `(${msg}) and must NOT link the live line a reader would land on`);
    assert.ok(!/have been checked against material for their cited source/.test(html), `(${msg}) and must NOT be counted as read`);
    assert.ok(/no longer match the current table/.test(html), `(${msg}) and the page must disclose it rather than drop it`);
    return html;
  };
  // (1) THE ROUND-1 REPRODUCTION: the stored value edited after its audit, hash left alone.
  assert.ok(!staleHtml({ ...goodRow, rowText: "| $9.999999$ | [RV] | TTT-Discover |" }, "edited value").includes("9.999999"),
    "a rowText whose hash no longer matches its recorded audit hash must NOT print its value");
  // (2) THE ROUND-2 REPRODUCTION: the row no longer stands at its recorded line.
  assert.ok(!staleHtml({ ...goodRow, inMirror: false }, "not at its line").includes("0.380876"),
    "a row that no longer stands at its recorded line must NOT print its value");
  // (3) non-table text comes through boundCell wholesale, so it is refused before boundCell sees it.
  const prose = "the bound is 7.777777 per the survey";
  assert.ok(!staleHtml({ ...goodRow, rowText: prose, rowTextSha256: sha16(prose) }, "non-table text").includes("7.777777"),
    "non-table rowText must NOT print, even with a matching hash");
  // (4) a VERIFIED row whose first cell is only a comment keeps its verdict and prints no value.
  const commentOnly = "| <!-- 6.666666 --> | [RV] | x |";
  const commentHtml = renderPage(row, "abc1234def", { audits: [{ ...goodRow, rowText: commentOnly, rowTextSha256: sha16(commentOnly) }], corpus: { citedRows: 999 } });
  assert.ok(commentHtml.includes("supports the claim we checked"), "positive control: a verified row keeps its verdict even when its cell is empty");
  assert.ok(!commentHtml.includes("6.666666"), "a comment-only first cell must not print its comment");
  assert.ok(!/padding:\.1rem \.3rem"><\/code>/.test(commentHtml), "and must not print an empty code span");

  // (5) REVIEW ROUND 3, first reproduction: an audit with NO stored rowText cannot prove identity, so it
  //     is historical too, with no live link, no support claim and no count, however complete it looks.
  staleHtml({ ...goodRow, rowText: undefined }, "unpinned");
  // (6) REVIEW ROUND 3, second reproduction: a stale UNREACHABLE audit must NOT claim the source was read.
  const staleUnreach = renderPage(row, "abc1234def", { audits: [{ ...goodRow, verdict: "UNREACHABLE", inMirror: false }], corpus: { citedRows: 999, measuredAt: "2026-01-02" } });
  // FIRST, because a highlighted line is the most confident wrong answer a stale row can give (A-64).
  assert.ok(!hasLineAnchor(staleUnreach), "an attempted row that no longer stands at its line must carry no line link: the link highlights ONE line, and that line now holds a different row (positive control: attemptedLive above)");
  assert.ok(staleUnreach.includes("attempted on an earlier version of the table and the cited source could not be read"), "a stale UNREACHABLE audit must say a check was ATTEMPTED, not that the source was read");
  assert.ok(!staleUnreach.includes("was read against its cited source"), "and must never claim the source was read");
  assert.ok(staleUnreach.includes("the source we could not read"), "positive control: its link text still says the source could not be read");
  assert.ok(!staleUnreach.includes("were attempted and the source could NOT be read"), "and it is not double-counted in the current-table attempted sentence");
  assert.ok(!staleUnreach.includes("Attempted, and the source could NOT be read"), "nor in that sentence's 2026-09-29 wording");
  assert.ok(staleUnreach.includes("no longer match the current table"), "it is disclosed with the other historical audits instead");

  // (7) REVIEW ROUND 4: every bound audit here historical AND a reference check present. The summary
  //     must not deny readings the list above just described as historical.
  const staleWithRef = renderPage(row, "abc1234def", { audits: [{ ...goodRow, inMirror: false }, { id: "T-RF", constant: "9z", citedRef: "RF", leg: "citation-well-formed", verdict: "UNRESOLVED", source: "https://example.invalid/rf", selection: "suspicion" }], corpus: { citedRows: 999, measuredAt: "2026-01-02" } });
  assert.ok(!staleWithRef.includes("has been read against its source yet"), "a page with historical bound reads must not claim no bound row was ever read");
  assert.ok(staleWithRef.includes("has been verified against the current table"), "it says instead that none has been verified against the current table");
  assert.ok(staleWithRef.includes("no longer match the current table"), "and the historical audit is still disclosed");

  // mirrorHas reads the live mirror AT THE RECORDED LINE, both polarities, and refuses a path outside
  // it. The positive leg is a row this lane audited on 2026-09-13, so a reader that always returned
  // false could not pass it.
  const aeText = "| $0.380924$ | [GGSWT2025] | AlphaEvolve |";
  assert.equal(mirrorHas("ledger/teorth-optimizationproblems/constants/1b.md", 23, aeText), true,
    "positive control: an audited row standing at its recorded line is found there");
  assert.equal(mirrorHas("ledger/teorth-optimizationproblems/constants/1b.md", 24, aeText), false,
    "the SAME text asked at a different line is NOT the audited row — surviving text elsewhere must not vouch for a changed row");
  assert.equal(mirrorHas("ledger/teorth-optimizationproblems/constants/1b.md", 23, "| $0.380925$ | [GGSWT2025] | AlphaEvolve |"), false,
    "a row differing by one digit at the recorded line is NOT the audited row");
  assert.equal(mirrorHas("ledger/teorth-optimizationproblems/constants/../../../package.json", 1, "{"), false,
    "a rowFile escaping the mirror directory is refused rather than read");

  const hostileText = "| <img src=x onerror=alert(1)> | [RH] | x |";
  const hostileValue = renderPage(row, "abc1234def", {
    audits: [{ id: "T-HV", constant: "9z", citedRef: "RH", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/hv", rowText: hostileText, rowTextSha256: sha16(hostileText), inMirror: true }],
    corpus: { citedRows: 999 },
  });
  assert.ok(hostileValue.includes("&lt;img"), "positive control: the hostile value DID pass verification and render, so the absence below is escaping");
  assert.ok(!/<img src=x/.test(hostileValue), "a hostile rowText reached the page as markup");
  const oddValue = renderPage(row, "abc1234def", {
    audits: [{ id: "T-OV", constant: "9z", citedRef: "RO", leg: "value-vs-source", verdict: "SOUND", source: "https://example.invalid/ov", rowText: { toString: null } }],
    corpus: { citedRows: 999 },
  });
  assert.ok(oddValue.includes("Checked against material for its cited source"), "a malformed rowText must neither crash rendering nor drop the row");
  assert.match(valued, /<code style="display:inline;padding:\.1rem \.3rem">\$0\.380876\$<\/code>/, "and the value renders as an inline code span, exactly");

  // (i) MEANING: only THIS constant's audits appear.
  assert.ok(!audited.includes("REF3"), "a constant page must not show another constant's audit rows");
  assert.ok(store.audits.some((a) => a.citedRef === "REF3"), "negative control: REF3 IS in the store, so the absence above is about filtering");

  // (j) BOTH POLARITIES: no audits, no block — and the page still renders.
  const unaudited = renderPage(row, "abc1234def", { audits: [], corpus: { citedRows: 999 } });
  assert.ok(unaudited.length > 800, "positive control: the unaudited page must still render");
  assert.ok(!unaudited.includes("Checked against material for its cited source"), "a constant nobody has audited must carry no audit block");
  assert.ok(!unaudited.includes('<ul class="audit">'), "no block under either heading");
  assert.ok(audited.includes("Checked against material for its cited source"), "positive control: the heading IS present when there are audits");

  // (k) A missing corpus renders a COUNT and explicitly refuses to imply a proportion.
  const noCorpus = renderPage(row, "abc1234def", { audits: [store.audits[0]], corpus: null });
  assert.ok(noCorpus.includes("not recorded"), "with no denominator the block must say so rather than showing verdicts alone");
  // The filed-report disclosure appears only when the record maps this constant.
  const withReport = renderPage(
    buildRows(claims, { withDates: false, reports: [{ path: "constants/9z.md", url: "https://example.invalid/i/1", state: "CLOSED", closedAt: "2026-08-23T00:00:00Z" }] })[0],
    "abc1234def",
  );
  assert.match(withReport, /we reported this row/);
  assert.ok(!/we reported this row/.test(html), "a constant we filed nothing against must carry no disclosure");

  console.log(`render-constant-pages selftest: PASS (renders title, both pinned rows and the upstream sha after proving the page is non-empty; carries a canonical URL, and its cite block quotes the SHARED citation unchanged — so the table and the page hand out the same address for the same constant, and a re-added local substitution fails here; a missing side reads "not pinned"; a hostile title is escaped, with the raw fixture proven to contain the markup so the check tests the renderer; the filed-report disclosure appears only for a mapped constant; and the A-47 audit block carries the no-record prohibition on the AUDITED page rather than only the unaudited one, drops an unrecognised verdict instead of printing it, matches link text to verdict so UNREACHABLE never offers 'the source we read', links each source as an anchor whose href IS that source, refuses a javascript: scheme, escapes hostile citedRef and sourceRead, survives a null entry beside a good one, renders the denominator FROM THE STORE with a fixture of 999 proving it is not baked in, carries the date it was measured, counts bound rows separately from reference entries against a bound-row denominator, shows only THIS constant's rows with the other proven present in the fixture, is ABSENT for an unaudited constant, says 'not recorded' rather than implying a proportion when the corpus is missing, and — since 2026-09-13 — tells the reader how each row was CHOSEN, counts the ledger-wide coverage figure from rows drawn by position ONLY — and, since 2026-09-21, counts every drawn row whether or not its source could be read and says how many were read, files an unlabelled row with the suspicion set rather than as coverage, and carries the no-record prohibition on that selection-labelled surface too)`);
}

export function main({ check = false, storePath = DEFAULT_AUDIT_STORE } = {}) {
  const claims = JSON.parse(readFileSync(join(ROOT, "ledger", "claims.json"), "utf8"));
  const manifest = JSON.parse(readFileSync(join(ROOT, "ledger", "teorth-optimizationproblems", "manifest.json"), "utf8"));
  const rows = buildRows(claims);
  // A-53 (b): refuse before anything is composed or written. Nothing above writes.
  if (refuseDroppedAudits("render-constant-pages", { storePath, pageIds: new Set(rows.map((r) => r.id)) })) { process.exitCode = 1; return; }
  const pages = new Map(rows.map((r) => [`${r.id}.html`, renderPage(r, manifest.sha)]));

  if (check) {
    const onDisk = existsSync(OUTDIR) ? readdirSync(OUTDIR).filter((f) => f.endsWith(".html")) : [];
    const missing = [...pages.keys()].filter((f) => !onDisk.includes(f));
    const extra = onDisk.filter((f) => !pages.has(f));
    // Compare CONTENT, not line endings — the same normalisation render-site.mjs's --check already
    // does, and for the same measured reason: the renderer writes LF while a Windows checkout
    // materialises these files as CRLF, so a byte-exact comparison calls a CORRECT tree stale. That
    // fired on README.md on 2026-08-16 simply from switching branches; this comparison was the last
    // one in the repo still unnormalised (cold-review finding, 2026-09-03). A red that means nothing
    // is worse than no alarm — it is the polarity that teaches people to ignore one.
    const lf = (s) => s.replace(/\r\n/g, "\n");
    const stale = [...pages]
      .filter(([f, html]) => onDisk.includes(f) && lf(readFileSync(join(OUTDIR, f), "utf8")) !== lf(html))
      .map(([f]) => f);
    if (missing.length || extra.length || stale.length) {
      console.log(`RESULT: FAIL — ${missing.length} missing, ${extra.length} orphaned, ${stale.length} stale constant page(s)`);
      for (const f of [...missing, ...extra, ...stale].slice(0, 10)) console.log(`  ${f}`);
      process.exitCode = 1;
      return;
    }
    console.log(`RESULT: PASS — ${pages.size} constant page(s) match committed state (@ ${String(manifest.sha).slice(0, 7)})`);
    return;
  }

  // Rewrite wholesale: a constant removed upstream must lose its page rather than linger as a
  // document nobody links but search engines still serve.
  if (existsSync(OUTDIR)) rmSync(OUTDIR, { recursive: true, force: true });
  mkdirSync(OUTDIR, { recursive: true });
  for (const [name, html] of pages) writeFileSync(join(OUTDIR, name), html);
  console.log(`wrote ${pages.size} constant page(s) to c/ @ ${String(manifest.sha).slice(0, 7)}`);
}

// THE ENTRY GUARD, added 2026-09-14 because render-site.mjs now imports badgeFor from this file.
// Without it, IMPORTING this module ran main(), and main() does rmSync(c/, {recursive:true}) before
// rewriting it — so any importer deleted the whole published c/ directory as a side effect, including
// during `render-site --check`, a command that must never write. It is the THIRD instance of the
// import-executes-CLI class here: lookup.mjs was bitten first and render-site.mjs repeated the shape
// the same commit fixed. Same form as render-site.mjs, deliberately, so the two cannot drift apart.
//
// ponytail: this file and render-site.mjs import each other. That is safe ONLY while neither calls
// across at module-evaluation time — which this guard is what guarantees. A future top-level call
// that reaches the other file's const bindings will throw a TDZ ReferenceError; `npm test` imports
// both and would crash on it. Upgrade path if that ever bites: move the audit-store functions into
// their own module that both renderers import.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : null;
const isMain = entry === import.meta.url;

if (isMain) {
  if (process.argv.includes("--selftest")) selftest();
  else main({ check: process.argv.includes("--check") });
} else if (process.argv[1]?.endsWith("render-constant-pages.mjs")) {
  console.error("render-constant-pages: COULD NOT RUN — invoked as main but module identity did not match");
  process.exit(2);
}
