// The reviewed plain-text form of each upstream constant title that carries markup. Shared by
// render-constant-pages.mjs (page title, description, heading) and render-site.mjs (the index row
// heading, its accessible labels, and the citation's title line). Moved here 2026-11-05 (round 2)
// so the two renderers, which already import each other, read one table from a leaf module.

/**
 * PLAIN-TEXT TITLES (2026-11-05, the search-reach setup week). Upstream's titles carry LaTeX source
 * (`Sphere packing density in $\mathbf{R}^4$`), and nothing on these pages renders math, so a search
 * result, a browser tab and the page heading all showed the raw source.
 *
 * A REVIEWED TABLE, NOT A CONVERTER (Codex r2, 2026-11-05). The first shape was a LaTeX-to-plain
 * converter with a refusal on leftovers. Two review rounds each found a markup shape that slipped its
 * refusal (`R^4` in the prose, then a bare trailing `_`), the second appearance of one defect class,
 * so the converter is gone (portable rule 2: change the shape, claim less). A title with no markup
 * character passes through unchanged; a title WITH one must appear in PLAIN_TITLES, written and read
 * by a human, or the render REFUSES and names it. A new upstream title therefore costs one table line,
 * and nothing mechanical can publish a mis-converted title.
 * Two deliberate forms: `μ_Z²` keeps the underscore (NOT `μ(Z²)`, which reads as a function applied
 * to Z², Codex r1), and `L^∞` keeps the caret (Unicode has no superscript infinity).
 * The mirrored bound cells are NOT touched; this is for the title, description and heading only.
 */
export const MARKUP = /[$\\^_{}]/;
export const PLAIN_TITLES = new Map([
  ["The irrationality measure of $\\pi$", "The irrationality measure of π"],
  ["The irrationality measure of $\\Gamma(1/4)$", "The irrationality measure of Γ(1/4)"],
  ["The $L^1$ Poincaré constant on the Hamming cube", "The L¹ Poincaré constant on the Hamming cube"],
  ["Smallest $n$ for which the value of $BB(n)$ is undecidable", "Smallest n for which the value of BB(n) is undecidable"],
  ["Asymptotic constant for the off-diagonal Ramsey numbers $R(3,k)$", "Asymptotic constant for the off-diagonal Ramsey numbers R(3,k)"],
  ["The thin shell conjecture (variance of $|X|^2$)", "The thin shell conjecture (variance of |X|²)"],
  ["Rate at which $\\kappa(n)$ approaches $1$", "Rate at which κ(n) approaches 1"],
  ["Ihara constant over $\\mathbf{F}_2$", "Ihara constant over F₂"],
  ["Falconer distance problem in $\\mathbf{R}^2$", "Falconer distance problem in R²"],
  ["Sphere packing density in $\\mathbf{R}^4$", "Sphere packing density in R⁴"],
  ["Square-lattice self-avoiding walk connective constant $\\mu_{\\mathbb{Z}^2}$", "Square-lattice self-avoiding walk connective constant μ_Z²"],
  ["Hadwiger covering / illumination number in $\\mathbb{R}^3$", "Hadwiger covering / illumination number in R³"],
  ["Maximal number of relevant variables in degree-$d$ Boolean functions", "Maximal number of relevant variables in degree-d Boolean functions"],
  ["Restriction exponent for the 2-sphere (Stein's $L^\\infty$ extension problem)", "Restriction exponent for the 2-sphere (Stein's L^∞ extension problem)"],
  ["Centered Hardy–Littlewood maximal constant in dimension $2$", "Centered Hardy–Littlewood maximal constant in dimension 2"],
  ["Erdős–Szemerédi $3$-sunflower-free capacity", "Erdős–Szemerédi 3-sunflower-free capacity"],
  ["Davenport constant for $C_n^3$", "Davenport constant for Cₙ³"],
  ["$\\mathrm{GL}_2$ Ramanujan conjecture exponent", "GL₂ Ramanujan conjecture exponent"],
  ["Burgess-quality subconvexity exponent for Dirichlet $L$-functions", "Burgess-quality subconvexity exponent for Dirichlet L-functions"],
  ["10-point multi-point Seshadri constant on $\\mathbb{P}^2$", "10-point multi-point Seshadri constant on P²"],
  ["Asymptotic line-count constant for smooth degree-$d$ surfaces in $\\mathbb P^3$ in characteristic $0$", "Asymptotic line-count constant for smooth degree-d surfaces in P³ in characteristic 0"],
  ["Ramsey multiplicity constant of $K\\_4$", "Ramsey multiplicity constant of K₄"],
]);

export function plainTitle(title) {
  const t = String(title);
  if (!MARKUP.test(t)) return t;
  if (PLAIN_TITLES.has(t)) return PLAIN_TITLES.get(t);
  throw new Error(`plainTitle: "${t}" carries markup and has no reviewed plain form; add one to PLAIN_TITLES`);
}
