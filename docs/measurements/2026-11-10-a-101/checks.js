// A-101 2026-11-10: the search and copy checks for the break points, run with playwright-cli eval.
// Prints one JSON line. 89a's upper-bound cell carries the long exact fraction.
() => {
  const tr = document.getElementById('c-89a');
  const code = tr.querySelectorAll('td code[data-mark]')[0];
  const before = { wbr: code.querySelectorAll('wbr').length, text: code.textContent };
  const q = document.getElementById('q');
  q.value = '/'; q.dispatchEvent(new Event('input'));
  const during = { wbr: code.querySelectorAll('wbr').length, marks: code.querySelectorAll('mark').length, text: code.textContent };
  q.value = ''; q.dispatchEvent(new Event('input'));
  const after = { wbr: code.querySelectorAll('wbr').length, text: code.textContent };
  const sel = window.getSelection(); const r = document.createRange(); r.selectNodeContents(code); sel.removeAllRanges(); sel.addRange(r);
  const copied = sel.toString(); sel.removeAllRanges();
  const frac = '1126728298914655736634696330762614467/37384537381450758925419573570384691200';
  const lines = (() => { const i = after.text.indexOf(frac); const rg = document.createRange();
    let n = 0, node = null, off = 0; const w = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
    const starts = []; while ((node = w.nextNode())) { starts.push([node, n]); n += node.data.length; }
    const at = (k) => { for (let j = starts.length - 1; j >= 0; j--) if (k >= starts[j][1]) return [starts[j][0], k - starts[j][1]]; };
    const [sn, so] = at(i), [en, eo] = at(i + frac.length); rg.setStart(sn, so); rg.setEnd(en, eo);
    return new Set([...rg.getClientRects()].map((x) => Math.round(x.top))).size; })();
  return JSON.stringify({ before: before.wbr, during, after: after.wbr, sameText: before.text === after.text && during.text === before.text,
    copiedEqualsText: copied === before.text, fractionInCell: before.text.includes(frac), fractionLines: lines });
}
