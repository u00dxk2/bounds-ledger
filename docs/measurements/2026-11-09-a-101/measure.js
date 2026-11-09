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
//   SINGLE a single number. A comma ends a number unless it is a thousands group, so the list
//          above is three numbers and 12,345,678 is one. A bare 123,456 reads as one number, a
//          known limit of any rule that cannot see the meaning.
// A run is BROKEN when its Range has client rects on more than one line. One digit cannot break.
//
// Two views: ALL rows shown (the default page), and ONE row shown at a time (a filtered page),
// since the layout differed between them before this change.
//
// Sideways scroll is read four ways: all rows, one row, each row with its cite block open, and
// the whole document.
() => {
  const rows = [...document.querySelectorAll('tbody tr[id^=c-]')];
  const OLD = /\d[\d.,]*\d/g;
  const SINGLE = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;
  const linesOf = (node, a, b) => {
    const r = document.createRange();
    r.setStart(node, a);
    r.setEnd(node, b);
    return new Set([...r.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size;
  };
  const scan = (tr) => {
    const out = { old: [], single: [] };
    tr.querySelectorAll('td code[data-mark]').forEach((code) => {
      const node = code.firstChild;
      if (!node || node.nodeType !== 3) return;
      const t = node.textContent;
      const width = Math.round(code.getBoundingClientRect().width);
      const run = (re, into) => {
        for (const m of t.matchAll(re)) {
          if (m[0].length > 1 && linesOf(node, m.index, m.index + m[0].length) > 1) {
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
        lowerValueLines: c[1] ? linesOf(c[1].firstChild, c[1].firstChild.textContent.indexOf('$0.379005$'), c[1].firstChild.textContent.indexOf('$0.379005$') + 10) : null,
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
  return JSON.stringify(res);
}
