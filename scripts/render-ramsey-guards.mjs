// render-ramsey-guards.mjs — the guards that refuse a rendered ramsey.html or copying.html making a
// claim the store does not support. Moved out of render-ramsey.mjs unchanged on 2026-11-13; it
// imports the shared vocabulary and never imports render-ramsey.mjs, so there is no import cycle.
import { frameOf, sameBound } from "./ds1-depth.mjs";
import { esc, unesc } from "./lib/html.mjs";
import { PUBLISHED_ON, OUTCOMES, numbersIn, STYLE, key, entriesOf, R, shownReading, readingConflicts, SURVEY_ONLY, stateOf, ibNote, keepsSurveyEntry, HOW_LINK, NOT_YET, NOTHING, boundsFor, BRIEF_URL, searchHtml, longDate } from "./render-ramsey-vocabulary.mjs";

const ALLOWED_HOSTS = new Set(["github.com", "u00dxk2.github.io", "www.combinatorics.org", "www.cs.rit.edu"]);

// The never-claim-a-record wordings. Shared so the disclosure page is held to the SAME rule as the
// table it describes: a new rendering path does not inherit the guards that already exist, and the
// blind one is always the guard written to prevent exactly what the new surface can now do
// (2026-09-10, docs/findings). This list is the one place to add a wording.
const RECORD_RES = [/\brecord\b(?!ed)/i, /\bbest[- ]known\b/i, /\bstrongest known\b/i, /\bstate of the art\b/i, /\bthe true value\b/i, /\bcurrent(ly)? best\b/i];

// The page's own guard. Returns the violations found; an empty list is a pass. Run on a fixture in
// the selftest AND on the committed file by --check.
export function guardPage(page, doc, rows = [], search = null) {
  // CRLF FIRST, before any assertion reads a newline. The entry-shape rule below matches `\n<dl>\n`,
  // and this checkout is core.autocrlf=true with no .gitattributes — so a fresh Windows clone would
  // hand this function CRLF and fail all 72 entries on a page whose content never changed. main()
  // normalises for its equality compare only AFTER calling this, which is too late. The lane already
  // documents this trap for test mutations (KP-78, "files are CRLF, so a \n pattern silently
  // no-ops"); here it was the guard itself (adversarial review round 5, 2026-09-19).
  const html = String(page).replace(/\r\n/g, "\n");
  const v = [];
  const { frame, left } = frameOf(doc);
  const shownReads = [];
  const text = html.replace(/<[^>]+>/g, " ");
  // 1. It never claims which bound is the record.
  for (const re of RECORD_RES) {
    if (re.test(text)) v.push(`claims a record: ${re}`);
  }
  // 2. It loads nothing from anywhere.
  if (/<script\b/i.test(html)) v.push("carries a <script>");
  if (/<(img|iframe|video|audio|source|embed|object)\b/i.test(html)) v.push("embeds media");
  if (/<link\b(?![^>]*rel="canonical")/i.test(html)) v.push("carries a <link> other than canonical");
  if (/\ssrc=/i.test(html) || /url\(/i.test(html) || /@import/i.test(html)) v.push("loads an external asset");
  // 3. Every absolute link goes to a host it has a reason to name.
  for (const m of html.matchAll(/href="(https?:\/\/[^"/]+)/g)) {
    const host = m[1].replace(/^https?:\/\//, "");
    if (!ALLOWED_HOSTS.has(host)) v.push(`links an unexpected host: ${host}`);
  }
  // 4. Every value the store holds is on the page, in its own entry — the store-vs-page gap (A-53)
  //    is asserted here rather than left to a hand count.
  const entries = entriesOf(doc);
  const sections = [...html.matchAll(/<section class="entry" id="r-(\d+)-(\d+)">([\s\S]*?)<\/section>/g)];
  if (sections.length !== entries.length) v.push(`renders ${sections.length} entries, the table holds ${entries.length}`);
  const ids = sections.map((m) => `${m[1]},${m[2]}`);
  if (new Set(ids).size !== ids.length) v.push("an entry id repeats");
  for (const e of entries) {
    const s = sections.find((m) => `${m[1]},${m[2]}` === key(e.k, e.l));
    if (!s) { v.push(`${R(e.k, e.l)} is missing from the page`); continue; }
    const body = s[3];
    for (const n of [e.ia?.exact, e.ia?.lower, e.ia?.upper].filter((x) => x !== undefined)) {
      if (!new RegExp(`(^|[^0-9])${n}([^0-9]|$)`).test(body.split("Table Ib prints")[0])) v.push(`${R(e.k, e.l)}: Table Ia value ${n} is not shown`);
    }
    if (e.ib && !new RegExp(`≤ ${e.ib.upper}<`).test(body.split("Table Ib prints")[1] ?? "")) v.push(`${R(e.k, e.l)}: Table Ib value ${e.ib.upper} is not shown`);
    // Every Table Ib value carries its mark too, in the same dd as the value: a Table Ib number with
    // no mark beside it would read as checked by default.
    if (e.ib && !((body.split("Table Ib prints</dt>")[1] ?? "").split("</dd>")[0] ?? "").includes(esc(ibNote(e, rows)))) v.push(`${R(e.k, e.l)}: Table Ib value ${e.ib.upper} does not carry its mark ("${ibNote(e, rows)}")`);
    // One read state per value Table Ia prints for the entry, and the machine state and the words
    // a reader sees must say the same thing.
    const auditPart = (body.split("Read against its credited source</dt>")[1] ?? "").split("</dl>")[0];
    const dds = [...auditPart.matchAll(/<dd([^>]*)>([\s\S]*?)<\/dd>/g)];
    const want = Math.max(1, boundsFor(e, frame, left).length);
    if (dds.length !== want) v.push(`${R(e.k, e.l)}: lists ${dds.length} read state(s), Table Ia prints ${want} value(s) for it`);
    for (const [, attrs, inner] of dds) {
      const ds = attrs.match(/data-state="([^"]+)"/)?.[1];
      const words = inner.replace(/<[^>]+>/g, "");
      const o = OUTCOMES.find(([, label]) => label === ds);
      // The verdict AND David's state it maps to, in the one form the renderer emits: a sound reading
      // marked credited-to-the-survey, or an unresolved one marked independently sourced, is refused.
      const st = o && stateOf(o[0]);
      const ok = o ? words.includes(`: ${st ? `${st} — ` : ""}${o[1]}: ${o[2]}.`)
        : ds === "not-yet-read" ? words.endsWith(`: ${SURVEY_ONLY} — ${NOT_YET}`)
        : ds === "nothing-to-read" ? words.endsWith(`: ${SURVEY_ONLY} — ${NOTHING}`) || words === `Table Ia prints nothing here: ${NOTHING}`
        : false;
      if (!ok) v.push(`${R(e.k, e.l)}: read state ${JSON.stringify(ds)} with the words "${words}" is not one of the four outcomes, "${NOT_YET}" or "${NOTHING}"`);
      if (!o) continue;
      // WHICH bound the reading is attached to, read off the page's own words. Counting readings is
      // not enough: a verdict moved from one bound of an entry to another keeps every count equal
      // (adversarial review round 2, 2026-09-18).
      const m = words.match(/the (exact value|lower bound|upper bound) (\d+), credited to \[([^\]]+)\]/);
      if (!m) v.push(`${R(e.k, e.l)}: a reading's words do not name the bound they belong to: "${words}"`);
      else shownReads.push({ k: e.k, l: e.l, bound: m[1] === "exact value" ? "exact" : m[1].split(" ")[0], value: Number(m[2]), ref: unesc(m[3]), verdict: o[0], words: unesc(words), raw: inner, attrs });
    }
    // THE ENTRY'S SHAPE, not just the reading's. Round 4 of the 2026-09-19 review hid readings by
    // wrapping the <dd> in an HTML comment, a <template> and a hidden <div>, and by putting `hidden`
    // on the enclosing <dl>: leg 7b reads the dd itself and could see none of it. A guard that
    // inspects an element and not its ancestors is the same defect three drafts running, so this
    // asserts the whole section is what the renderer emits — an h2, a <dl> of <dt>/<dd> pairs, the
    // looks-wrong link, and nothing else. Unknown markup is refused whether or not it hides anything.
    const dl = body.match(/\n<dl>\n([\s\S]*?)\n<\/dl>\n/);
    if (!dl) v.push(`${R(e.k, e.l)}: its readings are not inside the plain <dl> the renderer emits`);
    else {
      // `<dt>[\s\S]*?</dt>` would delete a WRAPPER along with its contents: round 6 hid a whole
      // reading in `<dt><template>…</template></dt>`, and stripping the dt subtree removed every
      // trace of it while the reading scan still counted the dd nested inside. A dt the renderer
      // emits holds plain text, so only plain-text dts are discarded and anything else stays behind
      // as stray markup.
      const strayInDl = dl[1].replace(/<dt>[^<]*<\/dt>/g, "").replace(/<dd[^>]*>[\s\S]*?<\/dd>/g, "").trim();
      if (strayInDl) v.push(`${R(e.k, e.l)}: its <dl> carries markup the renderer does not emit: ${JSON.stringify(strayInDl.slice(0, 60))}`);
      const strayInEntry = body.replace(/\n<dl>\n[\s\S]*?\n<\/dl>\n/, "").replace(/<h2>[\s\S]*?<\/h2>/, "").replace(/<a class="flag"[\s\S]*?<\/a>/, "").trim();
      if (strayInEntry) v.push(`${R(e.k, e.l)}: its entry carries markup the renderer does not emit: ${JSON.stringify(strayInEntry.slice(0, 60))}`);
    }
    const flag = body.match(/<a class="flag" href="([^"]+)">/);
    const title = flag ? decodeURIComponent(flag[1].replace(/&amp;/g, "&").match(/[?&]title=([^&]*)/)?.[1] ?? "") : "";
    if (title !== `Row looks wrong: Small Ramsey Numbers ${R(e.k, e.l)}`) v.push(`${R(e.k, e.l)}: its looks-wrong link has title "${title}"`);
  }
  // 5. The jump links go exactly to the entries.
  const jumps = [...html.matchAll(/<nav class="jump"[\s\S]*?<\/nav>/g)][0]?.[0] ?? "";
  const targets = [...jumps.matchAll(/href="#r-(\d+)-(\d+)"/g)].map((m) => `${m[1]},${m[2]}`);
  if (targets.length !== ids.length || targets.some((t) => !ids.includes(t))) v.push("the jump links do not match the entries");
  // 6. It says what is covered and what has been read, and the counts add up.
  if (!html.includes(`revision #${doc.source.revision}`)) v.push("does not name the revision");
  if (!/<strong>Not covered<\/strong>/.test(html)) v.push("does not say what is not covered");
  // 6b. The arXiv search (A-81). MEANING FIRST, the exact-match pin LAST (KP-78, 2026-09-06: a pin
  //     placed first trips on every mutation and leaves the guards that carry the meaning dead).
  const searchParas = [...html.matchAll(/<p id="arxiv-search">[\s\S]*?<\/p>/g)].map((m) => m[0]);
  const searchMentions = (html.match(/arxiv-search|Newer papers on arXiv|apart from the arXiv screen/g) ?? []).length;
  if (search?.render) {
    if (searchParas.length !== 1) v.push(`states the arXiv search ${searchParas.length} time(s), not once`);
    const p = searchParas[0] ?? "";
    const words = unesc(p.replace(/<[^>]+>/g, ""));
    for (const [need, what] of [
      [`${search.papersFound} papers`, "how many papers the search found"],
      [longDate(search.windowFrom), "the date the search starts"],
      [`as arXiv listed them on ${longDate(search.listedOn)}`, "the day arXiv was read"],
      [`the newest submitted on ${longDate(search.newestSubmitted)}`, "the newest submission it saw, so the listing date does not read as coverage"],
      ["math.CO", "the listing it searched"],
      ["&ldquo;Ramsey&rdquo; in the abstract", "the term it searched for"],
      ["Language-model readers screened", "that the papers were screened by a model, not read by a person"],
      ["a newer result could exist without appearing here", "that a newer result can exist without appearing here"],
    ]) if (!words.includes(need)) v.push(`the arXiv search does not state ${what}`);
    if (/\b(no|nothing) (newer|better|stronger)\b[^.]*\b(exists?|has been (found|published))\b/i.test(words) || /\bthere (is|are) no (newer|better|stronger)\b/i.test(words)) v.push("the arXiv search says no newer result exists");
    if (!p.includes(`href="${esc(BRIEF_URL)}"`)) v.push("the arXiv search does not link how the papers were screened");
    if (!html.includes(`after revision #${doc.source.revision}, apart from the arXiv screen described below.`)) v.push("the not-covered sentence does not point to the arXiv search, so the two read as contradicting");
    // Where it sits, as a reader would meet it: straight after What is watched and before What has been
    // checked, with nothing between. A paragraph wrapped in a comment or a hidden container still
    // counts once and still equals the pin below, so position is asserted on its own.
    if (searchParas.length === 1 && !html.includes(`this page is not.</p>\n${p}\n<p><strong>What has been checked against its source.</strong>`)) v.push("the arXiv search is not where the renderer puts it, between What is watched and What has been checked");
    // Hidden by an ANCESTOR or by CSS (Codex r1 SHOULD on 586770d): the position pin above cannot see
    // a stylesheet rule or a wrapper around all three paragraphs. So the stylesheet must be the
    // renderer's own and the only one, and the note box must open directly after the jump links with
    // its exact tag and hold nothing but one plain paragraph per line. Shape, not a list of ways to hide.
    if ((html.match(/<style\b/gi) ?? []).length !== 1 || !html.includes(`<style>${STYLE}</style>`)) v.push("the arXiv search page carries a stylesheet that is not the renderer's own");
    const box = html.match(/<\/nav>\n\n<div class="note">\n([\s\S]*?)\n<\/div>\n/);
    if (!box || !box[1].includes(p) || !box[1].split("\n").every((l) => /^<p(?: id="arxiv-search")?>[\s\S]*<\/p>$/.test(l) && !/<(?:div|template|details|style|script)\b/i.test(l))) v.push("the arXiv search is not in the plain note box, one plain paragraph per line, straight after the jump links");
    if (searchParas.length === 1 && p !== searchHtml(search)) v.push("the arXiv search paragraph differs from what the store renders");
  } else if (searchMentions) {
    v.push(`mentions the arXiv search ${searchMentions} time(s) while the store does not render it`);
  }
  // A STATED RULE, not a list of phrasings (Codex r2 BLOCKER on 8fe8abd: other prose in the note box
  // could claim an arXiv screen the gated store does not state, and the checks above read only the
  // canonical paragraph). Inside the note box, "arXiv" may appear ONLY in the gated paragraph, and not
  // at all while the store is dark. Its failure mode is a refusal. What it does NOT see, deliberately
  // (r2's SHOULD, the second round to find a hiding route outside what a check reads, so the shape
  // stops growing here): arXiv prose OUTSIDE the note box (entry notes legitimately cite arXiv
  // preprints), and a renderer LAYOUT change that wraps the page before the jump links. Both are
  // changes to this file's code, and a code change reaches the page only through review; the guard's
  // job is the committed page against the store under the layout this renderer emits.
  const noteBox = html.match(/<\/nav>\n\n<div class="note">\n([\s\S]*?)\n<\/div>\n/)?.[1];
  if (noteBox !== undefined) {
    // The two sanctioned places, both pinned above when the store renders: the paragraph itself and
    // the not-covered sentence's exact pointer to it.
    const outside = search?.render && searchParas.length === 1 ? noteBox.replace(searchParas[0], "").replace(", apart from the arXiv screen described below.", ".") : noteBox;
    if (/arxiv/i.test(outside)) v.push("the note box mentions arXiv outside the gated arXiv-search paragraph");
  }
  const so = html.match(/So far, of the (\d+) bounds Table Ia prints \([^)]*\): ([^<]*)\./);
  if (!so) v.push("does not state what has been checked");
  else {
    const nums = [...so[2].matchAll(/(sound|defective|unresolved|unreachable|not yet read|nothing to read it against) (\d+)/g)];
    if (nums.length !== 6) v.push(`the checked-so-far line names ${nums.length} states, expected the four outcomes, "${NOT_YET}" and "${NOTHING}"`);
    const sum = nums.reduce((a, m) => a + Number(m[2]), 0);
    const expected = entries.reduce((a, e) => a + Math.max(1, boundsFor(e, frame, left).length), 0);
    if (sum !== expected || Number(so[1]) !== expected) v.push(`the checked-so-far counts sum to ${sum} and the sentence names ${so[1]}, but Table Ia prints ${expected} values`);
  }
  // 7. Every stored reading is on the page, ON ITS OWN BOUND, with its own verdict. A reading the
  //    store holds and the page does not show is the store-vs-page gap (A-53) in the new area's
  //    first week, so it is refused, not tolerated.
  for (const c of readingConflicts(rows)) v.push(`two readings of one bound disagree: ${c}`);
  for (const r of rows) {
    const name = `${r.id ?? `${R(r.k, r.l)} ${r.bound}`} (${r.verdict} on the ${r.bound} bound ${r.value}, credited to [${r.ref}])`;
    const shown = shownReads.find((s) => sameBound(s, r) && s.verdict === r.verdict);
    if (!shown) { v.push(`the stored reading ${name} is not shown on the page`); continue; }
    // A second reading of a bound already shown agrees with it (readingConflicts above) and is kept
    // in the notes; the page shows the census reading, so only that one owes its pageNote ON the page.
    if (shownReading(rows, r) !== r) continue;
    // 7b. A reading that did NOT reach its credited source owes the reader its own sentence. The four
    //     outcome phrases alone say the reading fell short and nothing about WHY, which on 2026-09-19
    //     read as an errand still open for two bounds whose value the survey credits to a personal
    //     communication — uncheckable by anyone, not waiting on us. So UNRESOLVED and UNREACHABLE
    //     require a pageNote, and require it ON THE PAGE rather than merely present in the store.
    if (r.verdict === "UNRESOLVED" || r.verdict === "UNREACHABLE") {
      const note = String(r.pageNote ?? "").trim();
      if (!note) v.push(`the stored reading ${name} carries no pageNote, so the page says only that the reading fell short`);
      else if (!shown.words.includes(note)) v.push(`the pageNote of the stored reading ${name} is not on the page`);
      // A note the reader cannot SEE is not disclosed — the shape of the 2026-09-06 label that hid
      // in an aria-label where an equality check could not see it. This guard does NOT try to judge
      // visibility: the first attempt at that was a regex, and round 2 of the 2026-09-19 adversarial
      // review broke it in both directions (blind to `<dd hidden>` and to `display : none`, and it
      // refused a harmless aria-hidden="false"). A guard over a format is a parser, so this one
      // asserts the SHAPE the renderer actually emits instead: the note is plain text in a <dd>
      // whose only markup is the "How it was read" link, and whose only attributes are the ones
      // rendered here. Unknown markup is refused whether or not it hides anything, because the
      // renderer has no reason to add any and this guard cannot tell the two apart.
      // NOT COVERED, deliberately and by name: a STYLE rule that hides the dd without touching it.
      // Nothing here reads the stylesheet.
      else {
        // Round 3 broke the whitelist: exempting the anchor by TAG NAME exempted `<a hidden>` around
        // the whole note, and a scan for tags never saw an HTML comment. So this asserts the exact
        // string the renderer emits instead of enumerating what may appear: strip the one trailing
        // "How it was read" anchor, and the remainder must be plain escaped text — no `<` or `>` can
        // survive esc(), so any markup at all, comments and second anchors included, is refused.
        const body = shown.raw.trim();
        const rest = body.endsWith(HOW_LINK) ? body.slice(0, -HOW_LINK.length) : null;
        // Bare attributes count: the first draft matched only `name=`, so `<dd hidden data-state=…>`
        // — the plainest way to hide the whole reading — walked straight past it (review round 2).
        const extra = [...shown.attrs.matchAll(/([a-z-]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi)].map((m) => m[1].toLowerCase()).filter((a) => a !== "class" && a !== "data-state");
        if (rest === null) v.push(`the read state of ${name} does not end with the single "How it was read" link the renderer emits`);
        else if (/[<>]/.test(rest)) v.push(`the read state of ${name} carries markup around its words, so the page cannot be read as disclosing the pageNote to a reader`);
        else if (extra.length) v.push(`the pageNote of the stored reading ${name} sits in a <dd> carrying ${extra.join(", ")}, which the renderer never adds`);
      }
    }
  }
  const boundsRead = new Set(rows.map((r) => `${r.k},${r.l},${r.bound},${r.value},${r.ref}`)).size;
  if (shownReads.length !== boundsRead) v.push(`the page shows ${shownReads.length} reading(s) and the store holds readings of ${boundsRead} bound(s)`);
  return v;
}

// The disclosure page's OWN guard. The table's guard reads entries and readings and would pass this
// page while saying nothing about it. Assertions carry MEANING FIRST and the revision pin LAST, so a
// mutation names the property it broke rather than only reporting that a string differs
// (the 2026-09-06 assertion-order rule).
export function guardCopying(page, doc, rows = []) {
  const html = String(page).replace(/\r\n/g, "\n");
  const text = html.replace(/<[^>]+>/g, " ");
  const v = [];
  for (const re of RECORD_RES) if (re.test(text)) v.push(`claims a record: ${re}`);
  if (!/<strong>What is not copied\.<\/strong>/.test(html)) v.push("does not say what is NOT copied");
  // The repository holds more of the survey than the table shows, and the disclosure must say so
  // with a number that matches the store. A disclosure that UNDER-states what we keep is the one
  // failure this page cannot have.
  if (!/<strong>What else the repository keeps\.<\/strong>/.test(html)) {
    v.push("does not disclose the survey material kept OUTSIDE the table (the bibliography entries in the audit notes)");
  }
  // The amount reproduced, in NUMBERS, recomputed from the committed table. A disclosure that
  // states an entry count as though it were a value count understates the material it exists to
  // disclose, and both validation commands accepted exactly that until it was caught.
  const wantNums = numbersIn(doc.tableIa);
  const saidNums = Number(html.match(/<strong>(\d+) numbers<\/strong>/)?.[1] ?? NaN);
  if (!Number.isFinite(saidNums)) v.push("does not state how many NUMBERS of Table Ia it reproduces");
  else if (saidNums !== wantNums) v.push(`says it reproduces ${saidNums} numbers from Table Ia, the committed table prints ${wantNums}`);
  const want = rows.filter(keepsSurveyEntry).length;
  const said = text.match(/&mdash;\s*(\d+)\s*of them so far|—\s*(\d+)\s*of them so far/);
  const saidN = said ? Number(said[1] ?? said[2]) : null;
  if (saidN === null) v.push("does not state how many of the survey's bibliography entries the repository keeps");
  else if (saidN !== want) v.push(`says the repository keeps ${saidN} bibliography entr(y/ies) from the survey, the audit store holds ${want}`);
  if (!/carries no licence permitting republication/.test(text)) v.push("does not say the survey carries no licence to republish");
  // The trap this page exists to avoid: describing a clearance that was never obtained.
  if (!text.includes(longDate(PUBLISHED_ON))) v.push("does not name the date the table was published");
  if (!/account of a page already public rather than a clearance obtained beforehand/.test(text)) {
    v.push("does not disclose that it was written AFTER publication — a disclosure that reads as prior clearance is a false account");
  }
  if (!/acted on, not argued with/.test(text)) v.push("does not promise to act on a change-or-removal request");
  if (!/issues\/new/.test(html)) v.push("carries no route for asking for a change or removal");
  if (/<script\b/i.test(html)) v.push("carries a <script>");
  if (/<(img|iframe|video|audio|source|embed|object)\b/i.test(html)) v.push("embeds media");
  if (/\ssrc=/i.test(html) || /url\(/i.test(html) || /@import/i.test(html)) v.push("loads an external asset");
  for (const m of html.matchAll(/href="(https?:\/\/[^"/]+)/g)) {
    const host = m[1].replace(/^https?:\/\//, "");
    if (!ALLOWED_HOSTS.has(host)) v.push(`links an unexpected host: ${host}`);
  }
  if (!html.includes(`revision #${doc.source.revision}`)) v.push("does not name the revision");
  return v;
}
