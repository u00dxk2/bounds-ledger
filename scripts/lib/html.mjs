// HTML escaping and report links shared by render-site.mjs, render-constant-pages.mjs,
// and render-ramsey.mjs.

export const REPO = "https://github.com/u00dxk2/bounds-ledger";

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// The guard reads reference keys back off the page, so it must undo what esc did to them.
export const unesc = (s) => String(s).replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" }[e]));

// Returns a raw URL; callers esc() it when embedding in HTML.
export function issueUrl(title, body) {
  return `${REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}
