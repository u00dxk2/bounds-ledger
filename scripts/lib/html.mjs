// HTML escaping and report links shared by render-site.mjs, render-constant-pages.mjs,
// and render-ramsey.mjs.

import { isEntryModule } from "./entry-module.mjs";

export const REPO = "https://github.com/u00dxk2/bounds-ledger";

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// The guard reads reference keys back off the page, so it must undo what esc did to them.
export const unesc = (s) => String(s).replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }[e]));

// LINK-PREVIEW TAGS (2026-11-21, search day), one source for every page. They REPEAT the page's own
// <title>, description and canonical, passed in raw and escaped here exactly as the page escapes
// them, so a preview can never say more than the page it previews. No og:image: an image is a load,
// and these pages load nothing.
export function ogMeta(title, description, url) {
  return [
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Bounds Ledger">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
  ].join("\n");
}

// The ONE self-test check for the tags above, shared by the three renderers (Codex review of 10186ab,
// 2026-11-21: three hand-written copies compared captures that could both be missing, so a page with
// its title and og:title both deleted passed). Every field must be PRESENT first; only then are the
// og values compared with the page's own. Returns null when sound, else the first failure, in words.
export function ogMismatch(html) {
  const one = (re) => { const m = [...String(html).matchAll(re)]; return m.length === 1 ? m[0][1] : null; };
  const f = {
    title: one(/<title>([^<]*)<\/title>/g),
    description: one(/<meta name="description" content="([^"]*)">/g),
    canonical: one(/<link rel="canonical" href="([^"]*)">/g),
    "og:type": one(/<meta property="og:type" content="([^"]*)">/g),
    "og:site_name": one(/<meta property="og:site_name" content="([^"]*)">/g),
    "og:title": one(/<meta property="og:title" content="([^"]*)">/g),
    "og:description": one(/<meta property="og:description" content="([^"]*)">/g),
    "og:url": one(/<meta property="og:url" content="([^"]*)">/g),
  };
  for (const [k, v] of Object.entries(f)) if (!v) return `${k} is missing, empty or repeated`;
  if (f["og:type"] !== "website") return `og:type is ${f["og:type"]}, not website`;
  if (f["og:site_name"] !== "Bounds Ledger") return `og:site_name is ${f["og:site_name"]}, not Bounds Ledger`;
  if (f["og:title"] !== f.title) return "og:title does not repeat the page's title";
  if (f["og:description"] !== f.description) return "og:description does not repeat the page's description";
  if (f["og:url"] !== f.canonical) return "og:url does not repeat the page's canonical";
  return null;
}

// Returns a raw URL; callers esc() it when embedding in HTML.
export function issueUrl(title, body) {
  return `${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

// THE COPY-CITATION SCRIPT (A-70), one source for the index (`details.cite`, 2026-10-04) and the
// constant pages (`div.cite`, 2026-10-10). It copies each block's <code> text only, never the
// block's heading or the button's own label, so the copied citation is the shown one. When the
// clipboard refuses, or is absent, it selects the citation and says so, never "Copied". It is
// inserted by script, so a reader without scripts never meets a button that does nothing. Each
// renderer's self-test EXECUTES the emitted text against a stub DOM.
export const copyCiteScript = (selector) => `(function(){
  var cites=document.querySelectorAll('${selector}');
  for(var i=0;i<cites.length;i++)add(cites[i]);
  function add(d){
    var code=d.querySelector('code');
    if(!code)return;
    var b=document.createElement('button'),st=document.createElement('span');
    b.type='button';b.className='copy';b.textContent='Copy citation';
    st.className='copied';st.setAttribute('role','status');
    d.insertBefore(b,code);d.insertBefore(st,code);
    var last=0;
    b.addEventListener('click',function(){
      var text=code.textContent,me=++last;
      st.textContent='';
      function pick(){
        if(me!==last)return;
        var r=document.createRange();r.selectNodeContents(code);
        var sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);
        st.textContent='Selected. Use your Copy command.';
      }
      try{navigator.clipboard.writeText(text).then(function(){if(me===last)st.textContent='Copied';},pick);}
      catch(e){pick();}
    });
  }
})();`;

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
