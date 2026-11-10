// A-101 2026-11-10: the search and copy checks for the break points, run with playwright-cli eval.
// Prints one JSON line. 89a's upper-bound cell carries the long exact fraction.
// Revised after Codex round 1 (finding F1): it now locates WHERE the fraction breaks (the numerator
// and the denominator each on one line, on two different lines, so the break is at the slash) and
// compares the selected cell text with the fraction literal copied from the mirror file
// (ledger/teorth-optimizationproblems/constants/89a.md), not only with the page's own text.
// Limit: Selection.toString() is what a copy of the selection carries; no real clipboard is driven.
() => {
  const NUM = '1126728298914655736634696330762614467', DEN = '37384537381450758925419573570384691200';
  const MIRROR = '$' + NUM + '/' + DEN + ' = 0.0301388856953\\ldots$'; // verbatim span from 89a.md line 26
  const tr = document.getElementById('c-89a');
  const code = tr.querySelectorAll('td code[data-mark]')[0];
  const lineTops = (start, len) => {
    const w = document.createTreeWalker(code, NodeFilter.SHOW_TEXT), nodes = []; let n = 0, node;
    while ((node = w.nextNode())) { nodes.push([node, n]); n += node.data.length; }
    const at = (k) => { for (let j = nodes.length - 1; j >= 0; j--) if (k >= nodes[j][1] && (k - nodes[j][1]) <= nodes[j][0].data.length) return [nodes[j][0], k - nodes[j][1]]; };
    const r = document.createRange(); const [sn, so] = at(start), [en, eo] = at(start + len); r.setStart(sn, so); r.setEnd(en, eo);
    return [...new Set([...r.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top)))];
  };
  const read = () => {
    const t = code.textContent, i = t.indexOf(NUM + '/' + DEN);
    const num = lineTops(i, NUM.length), den = lineTops(i + NUM.length + 1, DEN.length);
    return { numLines: num.length, denLines: den.length, breaksAtSlash: num.length === 1 && den.length === 1 && den[0] > num[0] };
  };
  const shipped = code.textContent;
  const before = read();
  const q = document.getElementById('q');
  q.value = '/'; q.dispatchEvent(new Event('input'));
  const during = { ...read(), marks: code.querySelectorAll('mark').length };
  q.value = ''; q.dispatchEvent(new Event('input'));
  const after = read();
  const sel = window.getSelection(); const r = document.createRange(); r.selectNodeContents(code); sel.removeAllRanges(); sel.addRange(r);
  const copied = sel.toString(); sel.removeAllRanges();
  return JSON.stringify({ before, during, after, textUnchanged: code.textContent === shipped,
    copiedEqualsText: copied === shipped, copiedHoldsMirrorSpan: copied.includes(MIRROR) });
}
