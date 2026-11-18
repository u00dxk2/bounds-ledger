// Design pass 2026-11-17 — the "flag". Produces first-screen VARIANTS of the index page into a
// scratch folder under tmp/ and NOWHERE else. It never writes index.html: it takes the default
// render as a string from render-site.mjs's buildIndexHtml() and transforms a copy.
//
// Fail closed:
//   - the only accepted invocations are `--variant a|b|c|all` and `--selfcheck`; anything else
//     exits 2 and writes nothing;
//   - every transform step must match EXACTLY ONCE or the run exits 1 before any write;
//   - the output root is fixed (tmp/design-pass/variants) and re-checked to sit under <repo>/tmp;
//   - index.html's bytes are hashed before and after, and a difference is exit 1.
import { createHash } from "node:crypto";
import { lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildIndexHtml } from "../../../scripts/render-site.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const OUT_ROOT = join(ROOT, "tmp", "design-pass", "variants");
const INDEX = join(ROOT, "index.html");
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");

const SHARED_CSS = `
/* design pass 2026-11-17: shared tokens (handbook of tables, errata slips) */
:root{--display:"Palatino Linotype",Palatino,"Iowan Old Style","Book Antiqua",Georgia,serif}
@media(prefers-color-scheme:light){:root{--bg:#fbfcfe;--fg:#14181f;--muted:#566072;--line:#dde2ea;--code:#f2f5fa;--accent:#0b5fff}}
h1,.mast{font-family:var(--display)}
h1{font-weight:700;letter-spacing:-.01em}
.mast{font-size:1.25rem;font-weight:700;margin:0 0 1.5rem;padding-bottom:.5rem;border-bottom:3px double var(--fg)}
a{color:var(--fg);text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:.15em}
tbody th>a:first-child{font-family:var(--display);font-size:1.125rem;font-weight:700;text-decoration:none}
tbody th>a:first-child:hover,tbody th>a:first-child:focus{text-decoration:underline}
thead th{text-transform:none;letter-spacing:0;font-size:.875rem;font-weight:600;color:var(--fg);border-bottom:3px double var(--fg)}
.scroll,tr,input,select,.note,.empty,.near,code,.copy{border-radius:2px}
input[type=search]{border:1px solid var(--fg);box-shadow:0 1px 2px rgb(20 30 60 / .08)}
input[type=search]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
td>code{background:none;border-left:1px solid var(--line);border-radius:0;padding:.1rem 0 .1rem .6rem}
.id{font:inherit;font-size:.8125rem}
.when{display:inline-block;margin-top:.5rem;font-size:.8125rem;color:var(--muted)}
.when:has(a){color:var(--fg);background:var(--bg);border:1px solid var(--fg);padding:.1rem .5rem}
.when a{color:inherit;text-decoration:none}
.when a:hover,.when a:focus{text-decoration:underline}
.empty,.near,.note{border:0;border-left:1px solid var(--fg);border-radius:0}
.cite summary,.copy{color:var(--fg)}
.browse{margin:.75rem 0 0;font-size:.875rem}
.browse button{font:inherit;color:var(--fg);background:none;border:0;padding:0;text-decoration:underline;text-underline-offset:.15em;cursor:pointer;min-height:24px}
@keyframes settle{from{opacity:0;transform:translateY(4px)}}
@media(prefers-reduced-motion:no-preference){.answer:not([hidden]),.empty:not([hidden]),.near:not([hidden]){animation:settle .16s ease-out}}
`;

const VARIANTS = {
  // One dominant object: the search field is the first screen.
  a: {
    head: (n) => `<h1>Search for a bound to find matching entries.</h1>
<p class="lede">Each entry shows the last-listed rows in its mirrored tables and, where available, when their pins changed or tracking began.</p>`,
    css: `
.v-a h1{font-size:clamp(2rem,4.6vw,3.25rem);line-height:1.1;max-width:17ch;margin:3rem 0 1rem}
.v-a .lede{font-size:1.125rem;max-width:52ch;margin-bottom:2rem}
.v-a .ctl.grow{flex:1 1 100%;max-width:46rem}
.v-a .ctl.grow label{font-size:1rem;font-weight:600;color:var(--fg);margin-bottom:.5rem}
.v-a #q{font-size:1.5rem;padding:1.1rem 1.2rem;border-width:2px}
.v-a .fresh{margin-top:2rem}
.v-a .scroll{margin-top:2rem}
@media(max-width:60rem){.v-a h1{margin-top:1.5rem}.v-a #q{font-size:1.125rem;padding:.9rem 1rem}}
`,
  },
  // An editorial column: a title page and a narrow measure, entries stacked beneath.
  b: {
    head: (n) => `<p class="mast">Bounds Ledger</p>
<h1>A ledger of ${n} mathematical constants showing the last-listed bounds rows and, where available, when their pins changed or tracking began.</h1>
<p class="lede">A job scheduled daily compares this ledger&rsquo;s copy with the upstream files in teorth/optimizationproblems and tests that each pinned row&rsquo;s text is still there. When the ledger can classify a change to pinned text, the label gives its type and date; when history shows only the initial pin, the label says &ldquo;no movement seen yet&rdquo;.</p>`,
    css: `
.v-b h1{font-size:1.75rem;line-height:1.25;font-weight:400;max-width:30ch;margin:0 0 1rem}
.v-b .lede{font-size:1rem;color:var(--fg);max-width:60ch;margin-bottom:2rem}
.v-b .mast{margin-top:1.5rem}
@media not all and (max-width:60rem){
.v-b.wrap{max-width:46rem;padding-top:3rem}
.v-b table{min-width:0;display:block;table-layout:auto}
.v-b thead{display:none}
.v-b tbody,.v-b tr,.v-b tbody th,.v-b td{display:block}
.v-b tbody th{min-width:0}
.v-b tr{border-bottom:1px solid var(--line);padding:1.5rem 0}
.v-b th,.v-b td{border:0;padding:.3rem 0}
.v-b td[data-label]::before{content:attr(data-label);display:block;font-size:.875rem;font-weight:600;margin:.75rem 0 .25rem}
.v-b .scroll{border:0;border-top:3px double var(--fg);border-radius:0;overflow:visible}
.v-b .src{white-space:normal;margin-top:.5rem}
}
`,
  },
  // A working demonstration: the table itself, set as a handbook page, high on the first screen.
  c: {
    head: (n) => `<p class="mast">Bounds Ledger</p>
<h1>${n} mathematical constants with last-listed bounds rows and, where available, dates for pin changes or the start of tracking.</h1>`,
    css: `
.v-c .mast{margin:0 0 .75rem}
.v-c h1{font-size:1.375rem;line-height:1.3;font-weight:400;max-width:62ch;margin:0 0 1rem}
.v-c .fresh{font-size:.875rem}
.v-c .scroll{border:0;border-top:1px solid var(--fg);border-radius:0;margin-top:.5rem}
.v-c th,.v-c td{padding:.75rem}
@media not all and (max-width:60rem){.v-c.wrap{padding-top:1.5rem}.v-c .controls{align-items:flex-end}}
`,
  },
};

const EMPTY = (askHref) => `<div class="empty" id="empty" hidden>
<p><strong>No entries match this search.</strong><span id="emptyq" hidden></span></p>
<p>This page lists the constants mirrored from <a href="https://github.com/teorth/optimizationproblems">teorth/optimizationproblems</a>. Search matches listed names, ids, pinned value text, and digit-bearing value text extracted from the mirror, so a match can come from a row higher in a constant&rsquo;s table or from a value pinned earlier, and part of a number is enough. Some alternate spellings also match. The index search does not index reference or comment columns.</p>
<p>Try the constant&rsquo;s listed name or id, or clear the search to see every entry. No match tells you only that the search found no entry.</p>
<p>Small Ramsey numbers are on <a href="ramsey.html">their own page</a>.</p>
<p><a id="emptyask" href="${askHref}">Tell us what you were looking for</a> (opens a GitHub issue draft carrying your search term; submitted issues are public).</p>
</div>`;

const BROWSE_SCRIPT = `<script>(function(){var b=document.getElementById('browse'),q=document.getElementById('q');if(!b||!q)return;b.addEventListener('click',function(){q.value='';q.dispatchEvent(new Event('input',{bubbles:true}));});})();</script>`;

// Replace exactly one occurrence, or throw: a transform that silently no-ops is the hazard.
function once(html, pattern, replacement, what) {
  const re = typeof pattern === "string" ? null : new RegExp(pattern.source, pattern.flags.replace("g", "") + "g");
  const count = re ? (html.match(re) || []).length : html.split(pattern).length - 1;
  if (count !== 1) throw new Error(`transform "${what}" matched ${count} time(s); expected exactly 1`);
  return re ? html.replace(new RegExp(pattern.source, pattern.flags.replace("g", "")), () => replacement) : html.replace(pattern, () => replacement);
}

export function buildVariant(base, key) {
  const v = VARIANTS[key];
  if (!v) throw new Error(`unknown variant ${JSON.stringify(key)}`);
  const n = (base.match(/<tr id="c-/g) || []).length;
  if (n === 0) throw new Error("the default render has no entries; refusing to build a variant of an empty page");
  let h = base;
  h = once(h, "</style>", `${SHARED_CSS}${v.css}</style>`, "append css");
  h = once(h, '<div class="wrap">', `<div class="wrap v-${key}">`, "variant hook");
  h = once(h, /<h1>[\s\S]*?<\/h1>\s*<p class="lede">[\s\S]*?<\/p>/, v.head(n), "headline and lede");
  h = once(h, /<label for="q">[\s\S]*?<\/label>/, '<label for="q">Look up a bound you are about to cite</label>', "field label");
  h = once(h, 'placeholder="Type to filter&hellip;"', 'placeholder="Type a name, an id, or a bound value"', "placeholder");
  h = once(h, '<div class="answer" id="answer"', `<p class="browse"><button type="button" id="browse">Browse all ${n} constants</button></p>\n<div class="answer" id="answer"`, "browse control");
  const ask = h.match(/<a id="emptyask" href="([^"]*)"/);
  if (!ask) throw new Error("the empty state's report link was not found");
  h = once(h, /<div class="empty" id="empty" hidden>[\s\S]*?<\/div>/, EMPTY(ask[1]), "empty state");
  h = once(h, "</footer>", `</footer>\n${BROWSE_SCRIPT}`, "browse script");
  return h;
}

function main(argv) {
  const usage = "usage: node design-variants.mjs --variant a|b|c|all   |   --selfcheck";
  const okArgs = (argv.length === 1 && argv[0] === "--selfcheck") || (argv.length === 2 && argv[0] === "--variant" && ["a", "b", "c", "all"].includes(argv[1]));
  if (!okArgs) {
    console.error(`design-variants: REFUSED — unrecognised arguments ${JSON.stringify(argv)}. Nothing was written.\n${usage}`);
    return 2;
  }
  const before = sha(INDEX);
  if (argv.length === 1 && argv[0] === "--selfcheck") {
    // Both answers for the fail-closed claims, with nothing written.
    const base = buildIndexHtml().html;
    let refusedUnknown = false, refusedEmpty = false, refusedMiss = false;
    try { buildVariant(base, "z"); } catch { refusedUnknown = true; }
    try { buildVariant("<style></style><div class=\"wrap\">", "a"); } catch { refusedEmpty = true; }
    try { buildVariant(base.replace("<h1>", "<h2>"), "a"); } catch { refusedMiss = true; }
    const ok = ["a", "b", "c"].every((k) => buildVariant(base, k).includes(`wrap v-${k}`));
    const same = sha(INDEX) === before;
    console.log(JSON.stringify({ refusedUnknown, refusedEmpty, refusedMiss, buildsAll: ok, indexUnchanged: same }));
    const pass = refusedUnknown && refusedEmpty && refusedMiss && ok && same;
    console.log(pass ? "RESULT: PASS" : "RESULT: FAIL");
    return pass ? 0 : 1;
  }
  if (argv.length !== 2 || argv[0] !== "--variant" || !["a", "b", "c", "all"].includes(argv[1])) {
    console.error(`design-variants: REFUSED — unrecognised arguments ${JSON.stringify(argv)}. Nothing was written.\n${usage}`);
    return 2;
  }
  const rel = relative(join(ROOT, "tmp"), OUT_ROOT);
  if (rel.startsWith("..") || resolve(OUT_ROOT) === resolve(ROOT)) {
    console.error("design-variants: REFUSED — the output root is not under the repository's tmp folder. Nothing was written.");
    return 2;
  }
  const keys = argv[1] === "all" ? ["a", "b", "c"] : [argv[1]];
  const base = buildIndexHtml().html;
  const built = keys.map((k) => [k, buildVariant(base, k)]); // every transform proven before any write
  // The path check above is lexical. A junction or link under tmp/ could still point the write
  // somewhere else (the repository root, for one), so resolve the REAL directory and refuse unless
  // it sits inside the real tmp folder, and refuse a target that is a link.
  const realTmp = realpathSync(join(ROOT, "tmp"));
  for (const [k, html] of built) {
    const dir = join(OUT_ROOT, k);
    mkdirSync(dir, { recursive: true });
    const realDir = realpathSync(dir);
    const inside = relative(realTmp, realDir);
    const target = join(dir, "index.html");
    let isLink = false;
    try { isLink = lstatSync(target).isSymbolicLink(); } catch { /* absent is fine */ }
    if (inside === "" || inside.startsWith("..") || isAbsolute(inside) || isLink) {
      console.error(`design-variants: REFUSED — the output for variant ${k} does not resolve inside the repository's tmp folder, or is a link. Not written.`);
      return 2;
    }
    writeFileSync(target, html);
    console.log(`wrote tmp/design-pass/variants/${k}/index.html (${html.length} chars)`);
  }
  if (sha(INDEX) !== before) {
    console.error("design-variants: FAIL — index.html changed during this run.");
    return 1;
  }
  console.log(`index.html unchanged (sha256 ${before.slice(0, 12)})`);
  return 0;
}

process.exit(main(process.argv.slice(2)));
