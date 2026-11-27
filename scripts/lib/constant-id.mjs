// THE CONSTANT ID RULE (A-108, 2026-11-27). A constant's id is the stem of upstream's file name in
// ledger/teorth-optimizationproblems/constants/, and it travels unchecked into claims.json, page and
// feed file names, URLs and fixed text. So ONE stated rule, a refusal, shared by every reader that takes
// an id from the mirror: an id is one or more digits followed by ONE lowercase letter, nothing else.
// A name that does not match is REFUSED with its position, never escaped, stripped or skipped.
// Measured 2026-11-27: all 123 mirrored file stems match, so the rule refuses no real constant today.
// Why a refusal and not a sanitiser: A-106 stopped at Codex round 3 because a crafted file name could
// have put upstream text into a feed (A-108's note), and this repo's rule for a repeat class is to claim
// less with a stated rule whose failure mode is a refusal (portable rule 2).

export const CONSTANT_ID = /^[0-9]+[a-z]$/;

export const isConstantId = (id) => typeof id === "string" && CONSTANT_ID.test(id);

/**
 * The first id in `ids` that breaks the rule, as { index, id }, or null when every one holds.
 * `ids` is read in order, so the caller can name the position in its refusal.
 */
export function firstBadConstantId(ids) {
  let index = 0;
  for (const id of ids) {
    if (!isConstantId(id)) return { index, id };
    index += 1;
  }
  return null;
}

/** The fixed refusal sentence, with the offending id JSON-quoted so control characters stay visible. */
export function constantIdRefusal(label, bad) {
  return `${label}: refusing — item ${bad.index} has constant id ${JSON.stringify(bad.id)}, which is not one or more digits followed by one lowercase letter (scripts/lib/constant-id.mjs); nothing was composed or written`;
}
