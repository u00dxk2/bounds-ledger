// A-101: measures, in a real browser, whether the index breaks a number across two lines.
// Run with: playwright-cli eval "<this file's text>" on the index, at each viewport.
// It reads layout and restores what it changes; it changes nothing permanently on the page.
//
// Population: the two bound cells of all 120 rows (td code[data-mark]). The citation blocks are
// excluded: they are closed by default and their text is ours, not a bound value.
//
// Two definitions, both counted, because the review of 2026-11-09 asked for both:
//   OLD    a run of digit, then digits or dots or commas, then a digit. A comma-joined list
//          such as 1971,2016,2100 counts as one run.
//   SINGLE a single number. A comma ends a number unless it is a thousands group: exactly three
//          digits after each comma, with no digit after them. So the list above is three numbers,
//          12,345,678 is one, and [0,26972] is two (corrected 2026-11-09 after Codex review; the
//          first version read it as 0,269 and 72). A bare 123,456 still reads as one number, a
//          known limit of any rule that cannot see the meaning.
// A run is BROKEN when its Range has client rects on more than one line. One digit cannot break.
//
// Three views: ALL rows shown (the default page); ONE row shown at a time, by hiding the others,
// since the layout differed between them before this change; and SEARCH, the page's own filter
// with 0.379005 typed into it, which is the journey walk's case and what a reader sees (it adds
// a <mark>, which splits the cell's text, so every text node in a cell is walked).
//
// Sideways scroll is read four ways: all rows, one row, each row with its cite block open, and
// the whole document.
() => {
  const rows = [...document.querySelectorAll('tbody tr[id^=c-]')];
  const OLD = /\d[\d.,]*\d/g;
  const SINGLE = /\d{1,3}(?:,\d{3}(?!\d))+(?:\.\d+)?|\d+(?:\.\d+)?/g;
  // Map a character offset in an element's whole text to (text node, offset), across marks.
  const at = (el, i) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n, seen = 0, last = null;
    while ((n = w.nextNode())) {
      last = n;
      if (i <= seen + n.length) return [n, i - seen];
      seen += n.length;
    }
    return [last, last ? last.length : 0];
  };
  const linesOf = (el, a, b) => {
    const r = document.createRange();
    r.setStart(...at(el, a));
    r.setEnd(...at(el, b));
    return new Set([...r.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size;
  };
  const scan = (tr) => {
    const out = { old: [], single: [] };
    tr.querySelectorAll('td code[data-mark]').forEach((code) => {
      const t = code.textContent;
      if (!t) return;
      const width = Math.round(code.getBoundingClientRect().width);
      const run = (re, into) => {
        for (const m of t.matchAll(re)) {
          if (m[0].length > 1 && linesOf(code, m.index, m.index + m[0].length) > 1) {
            into.push({ id: tr.id.slice(2), len: m[0].length, codeWidth: width, head: m[0].slice(0, 24) });
          }
        }
      };
      run(OLD, out.old);
      run(SINGLE, out.single);
    });
    return out;
  };
  const table = document.querySelector('table');
  const box = document.querySelector('.scroll');
  const sideways = () => box.scrollWidth > box.clientWidth + 1;
  const docSideways = () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  const prev = rows.map((r) => r.hidden);

  const all = rows.map(scan);
  const res = {
    viewport: innerWidth,
    rows: rows.length,
    boxWidth: box.clientWidth,
    all: {
      oldBroken: all.flatMap((x) => x.old).length,
      singleBroken: all.flatMap((x) => x.single).length,
      singleList: all.flatMap((x) => x.single),
      tableWidth: Math.round(table.getBoundingClientRect().width),
      sideways: sideways(),
      documentSideways: docSideways(),
      // Any cell whose content is wider than the cell (spills into its neighbour or is clipped).
      cellsOverflowing: rows.flatMap((tr) => [...tr.children].filter((c) => c.scrollWidth > c.clientWidth + 1).map((c) => tr.id.slice(2) + ':' + c.tagName + ':' + (c.scrollWidth - c.clientWidth))),
    },
  };

  const oneOld = [], oneSingle = [];
  const widths = new Set();
  let oneSideways = 0, citeSideways = 0, citeDocSideways = 0, b1 = null;
  const citeList = [];
  rows.forEach((tr) => {
    rows.forEach((r) => { r.hidden = r !== tr; });
    const s = scan(tr);
    oneOld.push(...s.old);
    oneSingle.push(...s.single);
    widths.add([...tr.children].map((c) => Math.round(c.getBoundingClientRect().width)).join('/'));
    if (sideways()) oneSideways++;
    if (tr.id === 'c-1b') {
      const c = tr.querySelectorAll('td code[data-mark]');
      b1 = {
        widths: [...tr.children].map((x) => Math.round(x.getBoundingClientRect().width)),
        upper: c[0] && c[0].textContent,
        lower: c[1] && c[1].textContent,
        lowerValueLines: c[1] ? linesOf(c[1], c[1].textContent.indexOf('$0.379005$'), c[1].textContent.indexOf('$0.379005$') + 10) : null,
      };
    }
    const d = tr.querySelector('details.cite');
    if (d) {
      d.open = true;
      const code = d.querySelector('code');
      const cr = code.getBoundingClientRect();
      const tdr = d.closest('td').getBoundingClientRect();
      const over = cr.right > tdr.right + 1 || sideways();
      if (over) { citeSideways++; if (citeList.length < 5) citeList.push(tr.id.slice(2) + ':' + Math.round(cr.right - tdr.right)); }
      if (docSideways()) citeDocSideways++;
      d.open = false;
    }
  });
  rows.forEach((r, i) => { r.hidden = prev[i]; });
  res.one = {
    oldBroken: oneOld.length,
    singleBroken: oneSingle.length,
    singleList: oneSingle,
    distinctColumnWidths: widths.size,
    rowsSideways: oneSideways,
    citeOpenOverflowing: citeSideways,
    citeOpenOverflowSample: citeList,
    citeOpenDocumentSideways: citeDocSideways,
    row1b: b1,
  };

  // SEARCH: the page's own filter, typed as a reader would.
  const q = document.getElementById('q');
  const before = q.value;
  q.value = '0.379005';
  q.dispatchEvent(new Event('input', { bubbles: true }));
  const shown = rows.filter((r) => !r.hidden);
  const lower = document.querySelectorAll('#c-1b td code[data-mark]')[1];
  const k = lower ? lower.textContent.indexOf('$0.379005$') : -1;
  res.search = {
    term: q.value,
    rowsShown: shown.map((r) => r.id.slice(2)),
    marksIn1b: document.querySelectorAll('#c-1b mark').length,
    singleBroken: shown.flatMap((r) => scan(r).single),
    lowerValueLines: lower && k > -1 ? linesOf(lower, k, k + 10) : null,
    widths1b: [...document.querySelector('#c-1b').children].map((x) => Math.round(x.getBoundingClientRect().width)),
    sideways: sideways(),
  };
  q.value = before;
  q.dispatchEvent(new Event('input', { bubbles: true }));
  return JSON.stringify(res);
}
