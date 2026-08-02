---
product: bounds-ledger
date: 2026-08-02
lifecycle_stage: prelaunch
north_star_metric: externally-acknowledged corrections/confirmations on a stewarded surface (G-1; leading indicator = drift catches)
north_star_value: 0
north_star_status: amber
north_star_classification: emerging
last_deploy: cc2d26a
sentry_open_p1: 0
sentry_open_p2: 0
mrr_usd: null
n_active_users_28d: 0
on_hold_items: 4
top_action_today: "Our own brief-drift checker was blaming the orchestrator for a login wall: /t/lanes/* now 307s to a sign-in page that returns HTTP 200, so the checker compared our dated blocks against the markup of a login form and reported '4 of 4 missing — the port is the orchestrator's'. Third variation on this lane's founding defect (7/24 the alarm could not speak; 7/25 it spoke and said the wrong thing; today it spoke confidently about a page it never received). Fixed, both sides demonstrated live, self-test wired into CI. A-12's 8/07 escalation clause would have delivered a false accusation and is suspended pending one orchestrator question."
---

# bounds-ledger — daily (prelaunch) — 2026-08-02 (MT)

Paced rail, day 1. Steward cadence first, then a launch increment. No self-rating.

**Exit criterion, verbatim (A-13):** *"the repo flips PUBLIC with a stranger-readable surface —
README-as-product (what this is, what the alarm has caught, live counts), SECURITY.md (landed
2026-08-01, closing A-9's R3), a status view (the CI badge + latest-run read is the zero-infra v1),
and a verified no-secrets history sweep."*

**Today's ship:** the public-route correction wording for erdosproblems.com/36 — record state
re-verified, venue verified by fetching, 8-angle adversarial review passed, David-gated and unsent.
That is A-13-backlog work in the sense that matters (it is the first artifact prepared under the
8/01 standing rule that everything public-touching gets a review), but it is **not** a README /
history-sweep increment — see Recommendation.

## BLUF

The steward cadence was clean and boring: **no drift, 111 files at `621429c`, 229 claims / 227 hold
/ 0 broken / 2 UNVERIFIED by design, green streak day 10 of 30**, and both page legs of W-3 (the
watch on acknowledgement of the /36 correction) re-read at HTTP 200, unchanged. The day's real event came out of the cadence rather than the launch queue:
**`check-brief.mjs` was reporting a login wall as staleness and naming the orchestrator as the
cause.** `/t/lanes/*` went behind a Supabase sign-in wall (skylark-site `53c87f83`); it 307s to
`/t/signin`, that page returns HTTP 200, so `res.ok` was true and the checker compared our four
dated blocks against a login form. Missing-count went 3 → 4, which reads exactly like the port
falling further behind — a number moving in the expected direction for an unexpected reason.
Fixed same session, both sides demonstrated live, self-test in CI.

The consequence is not cosmetic: **A-12's escalation clause fires 8/07 and would have delivered a
false accusation** to the orchestrator, from the lane whose entire product is not asserting things
it hasn't checked. Escalation suspended pending one question below.

## What changed

- **Brief checker fixed (A-12).** It now proves the response *is* the brief — by testing for the
  source's own H1, derived from `docs/lane-brief.md`, never hardcoded — before assessing staleness.
  Absent title → new **exit 3, `BRIEF UNVERIFIABLE`**, naming the redirect target and stating
  explicitly that this is not evidence the re-port is behind. Generalises past login walls to 404
  shells, renamed routes and wrong-page ports. Verdict logic split into a pure `assess()`;
  `--selftest` covers in-sync / stale / wall / wall-behind-redirect plus a guard that the wall
  verdict never says `BRIEF STALE` or blames the port. `bb22c4e`.
- **Both sides demonstrated live** under W-4 — the standing watch that every new detector proves
  both directions at write time, applying KP-78 (prove the instrument can fail). Mutation proved
  landed via `git diff --numstat`
  (102/19) before either result was believed. Fires on production: exit 3, names
  `/t/signin?next=%2Ft%2Flanes%2Fbounds-ledger`. Stays silent on the *identical captured sign-in
  HTML with only the brief's H1 prepended* → `BRIEF STALE 4 of 4`, exit 1. The second run is the
  load-bearing one: a gate that swallowed the stale verdict would pass "can it fire" while blinding
  the alarm it lives inside.
- **A-8's ratchet fired for the first time in anger.** Adding the self-test to `npm test` without a
  CI step failed immediately, naming the offender: *"self-test(s) run by `npm test` but absent from
  the workflow — unguarded in CI: node scripts/check-brief.mjs --selftest"*. Built 7/31 against a
  fixture; this is its first real catch. CI now runs 4 self-tests across 8 steps.
- **Public-route correction prepared + reviewed** — logged as note8 on W-3 (the acknowledgement
  watch above); this was the session's launch increment. `cc2d26a`. Record
  state re-verified rather than inherited; venue verified by fetching /36 rather than reasoning from
  CONTRIBUTING.md. **Nothing posted, no account created, no contact made.**

## Inputs (controllable)

- Steward cadence: CI log read (not the badge) — `No drift. 111 files match upstream 621429c…`,
  `229 claim(s): 227 hold, 0 broken/unreachable, 2 unverified (manual)`, two expected 403 advisory
  lines. Local `npm run check` re-read both page legs of W-3 — the acknowledgement watch on the /36
  correction — at HTTP 200: `0.380876` still present, `last edited 23 January 2026` still present.
  No trigger.
- Two commits, both pushed: `bb22c4e` (detector fix + finding + A-12 note2), `cc2d26a` (public
  wording + 8-angle review + that watch's note8). `npm test` 4/4 green.
- Adversarial review ran 8 angles — 5 re-run from 7/24, **3 new because the venue changed from a
  private inbox to a public page**. Two changed the wording, one added a line, one surfaced a
  judgment that is David's.

## Outputs (lagging)

- **North star (externally-acknowledged corrections): 0.** Unmoved. The page has not been touched
  since 23 January 2026; the 7/24 email is nine days unanswered.
- **G-1 green streak: day 10 of 30** (day 1 = 7/24; ends ~8/22).
- Ledger: 229 claims, 227 hold, 0 broken, 2 UNVERIFIED by design. Mirror 111 files at `621429c`.
- Drift catches to date: 3 (7/28 ×2 editorial, 8/01 additive). Instrument defects caught to date: 5
  (7/24 never-armed, 7/25 A-4 + A-5, 7/31 BC-1/BC-2, today).

## Recommendation

**Next session's launch increment should be the README-as-product rewrite, not more correction
work.** Today's increment was legitimate and David-authorised, but it advances the *north star*,
not the *exit criterion* — and A-13's package still needs README + history sweep + a package-level
review before the flip can go to him. Two of three package items remain. The paced rail's point is
that the exit gets a slice every session; today's slice went to the adjacent thing.

Secondary: the history sweep is mechanical, needs no gate, and is the cheapest remaining package
item. It is a good pairing with the README in one session.

## On hold pending data

- **A-12** — the hosted-brief drift item; **escalation suspended today.** Two independent questions
  now sit with the orchestrator: (1) *is `/t/lanes/*` meant to be gated?* If yes its `closeWhen`
  ("check-brief.mjs exits 0 against production") is **unreachable as written** and it needs
  re-scoping, not escalating. (2) *Are the four dated blocks actually ported?* Unanswerable from
  here since 8/01 — only an authenticated reader can say.
- **W-3** — the acknowledgement watch: monitor only per David 8/01, page unchanged today, reply leg
  is his inbox. Not a blocker. **A-7** and **A-11** unchanged since 7/31 — see State Appendix.

## State Appendix

- **G-1** — the goal: one record inventory under automated re-verification with a 30-day green CI
  streak and ≥1 externally-acknowledged correction. Streak day 10/30; acks 0.
- **A-2** — the CI re-verification instrument for the adopted surface. Green; three real drifts
  caught in production to date.
- **A-3** — the /36 correction, closed on send 7/24. Its public-route conversion is tracked under
  the acknowledgement watch below, not reopened here.
- **W-3** — the watch on acknowledgement of the /36 correction. Open; monitor only; note8 added
  today with the reviewed public wording.
- **W-4** — the standing watch that every new detector demonstrates both sides at write time.
  Applied today to the brief-checker gate; both outputs recorded in the finding.
- **A-7** — the engineering-health P1 backlog (fleet-shared controls). Open, blocked.
- **A-9** — the engineering-health P2 fix-on-touch backlog. Open; R3 closed 8/01, R13/R29/R34/R19 left.
- **A-11** — the accepted BC-2 blind class, with pin-a-negative still open for C-6/C-8. Open.
- **A-12** — the hosted-brief drift item. Open; note2 added today; escalation suspended.
- **A-13** — the launch definition and public-flip package. Open; David approved the flip in
  principle 8/01, gated on package + adversarial review. README and history sweep outstanding.
- Findings today: `docs/findings/2026-08-02-the-brief-check-blamed-the-porter-for-a-login-wall.md`.
- Decisions today: `docs/decisions/2026-08-02-public-comment-erdosproblems-36.md` (David-gated).
