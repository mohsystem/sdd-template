# Example Feature Prompts — Hand These to the Team

Six ready-to-use prompts for implementing new features, in increasing
order of complexity. Prompts 1-5 exercise the core spec → plan → code →
test → review loop; they're also good input for later test-planning,
test-generation, and defect-analysis work. Prompt 6 exercises secure
coding, and its output becomes a good target for vulnerability-detection
and hardening work afterward.

Each prompt is copy-pasteable as-is into Claude Code. They assume the
`spec-driven-development` skill/`CLAUDE.md` discipline is already in place
in the project's workspace (see `README.md` and
`facilitator/FACILITATION-NOTES.md`).

## Assumed starting point: Equipment Custody Register

These prompts extend the same running example used throughout
`docs/standards/` and `.claude/skills/` in this kit, so the vocabulary
(`CustodyRecord`, `Equipment`, `Officer`, `CustodyService`) is already
familiar. If a team's own `docs/specs/spec.md` doesn't have this yet, seed
it with the rules below before starting:

| BR | Rule |
|---|---|
| BR-1 | An item with an open custody record cannot be checked out again. |
| BR-2 | Checkout sets item status to ASSIGNED; return sets it to AVAILABLE. |
| BR-3 | Items in MAINTENANCE cannot be checked out. |
| BR-4 | A record is OVERDUE when `dueAt < now` and not returned. |
| BR-5 | All mutations go through `CustodyService` — controllers never mutate state. |

Domain: `Equipment` (id, name, status: AVAILABLE/ASSIGNED/MAINTENANCE),
`Officer` (id, name), `CustodyRecord` (id, equipment, officer, dueAt,
returnedAt). Endpoints exist for listing equipment/custody and
checkout/return (see `docs/specs/spec-template.md` §4 for the contract
shape to follow for anything new).

---

## Prompt 1 — Condition rating on return

**Trains:** the core spec → test → code loop on a single service method.
**Adds:** BR-6 (new rule, state-machine branching).

> Add a condition rating to item return. When an item is returned, capture
> a condition value of `GOOD`, `DAMAGED`, or `LOST` alongside the existing
> return logic. `GOOD` sends the item to `AVAILABLE` as today. `DAMAGED`
> sends it to `MAINTENANCE` instead. `LOST` retires it permanently — add a
> `RETIRED` status that can never be checked out again.
>
> Follow our SDD process end to end: update `docs/specs/spec.md` first
> with a new BR-ID for the condition-driven routing rule and update the
> `Equipment.status` GORM constraint to include `RETIRED`. Then write the
> failing Spock feature named for that BR in `CustodyServiceSpec`. Then
> implement in `CustodyService` only — no status logic in the controller.
> Then update the API contract table and Groovydoc. Run
> `./gradlew test codenarcMain codenarcTest` before you tell me it's done.

## Prompt 2 — Overdue custody report page

**Trains:** a read-only feature with a real GSP + vanilla JS surface, not
just a JSON endpoint.
**Adds:** a new page; may reveal that BR-4's definition needs tightening
into its own BR-ID if it wasn't already spec'd precisely.

> Add a supervisor-facing "Overdue Custody" report page at `/custody/overdue`
> (GSP view, not just a JSON endpoint). It lists every custody record where
> BR-4 currently evaluates true, showing officer name, item name, due date,
> and days overdue, sorted most-overdue first. Add a small vanilla JS
> enhancement on the page: a client-side sort toggle (by days-overdue or by
> officer name) that re-sorts the existing table rows without a full page
> reload — no framework, plain JS querying the DOM.
>
> Update `docs/specs/spec.md` §4/§5 for the new page and confirm BR-4's
> rule text is precise enough to implement directly. Write the
> `@Integration` Spock spec asserting the page returns the right records
> for a seeded overdue/not-overdue data set. Confirm no raw/unescaped
> output was introduced in the GSP template and that the JS file lives in
> `grails-app/assets/javascripts/`, not an inline `<script>` block.

## Prompt 3 — Bulk check-in with partial-failure handling

**Trains:** transactional design and API error-shape discipline under a
harder case — some items in a batch may legitimately fail while others
succeed.
**Adds:** BR-7 (a rule about how partial failure is reported, since this
doesn't exist yet in the base spec).

> Add a bulk check-in endpoint: `POST /api/custody/bulk-return` accepting a
> list of custody record IDs (with optional per-item condition ratings from
> Prompt 1's feature, if implemented). Each item should be returned
> independently — if one record is already returned or doesn't exist, that
> one fails but the others in the batch still succeed. Respond with a
> per-item result list (`id`, `status`: `RETURNED` or `error` with a BR
> code), not an all-or-nothing failure.
>
> Update `docs/specs/spec.md` with a new BR-ID describing this
> partial-success behavior explicitly (this is a real design decision, not
> a default — state why we chose partial success over all-or-nothing in
> the spec). Decide and document whether each item's return happens in its
> own transaction or one transaction for the whole batch, and why. Write
> Spock features for: all-succeed, all-fail, and mixed-result cases before
> implementing. Implement in `CustodyService` — the controller only maps
> the response list.

## Prompt 4 — Supervisor-only maintenance release

**Trains:** authorization as a business rule, not just a technical
concern — and the difference between "can't" (a state-machine BR) and
"isn't allowed to" (an authorization BR).
**Adds:** BR-8, and a role concept if the app doesn't have one yet.

> Currently any authenticated user can move an item out of `MAINTENANCE`
> back to `AVAILABLE`. Change this so only officers with a `SUPERVISOR`
> role can do it; anyone else attempting it gets a 403 with a clear error
> body, the same shape as our other BR violations.
>
> Update `docs/specs/spec.md` with a new BR-ID for this authorization rule,
> stated as precisely as BR-1 through BR-5 are (name the exact action it
> gates). If the domain has no role concept yet, propose the smallest
> addition that supports this (e.g. a `role` field on `Officer` or a
> Spring Security role) and note it as a plan update in
> `docs/specs/plan.md`, not something invented silently in code. Write
> Spock features for both the allowed and denied cases, named for the new
> BR-ID. Implement the check in `CustodyService`, not as a controller
> `if`-check and not only as a UI-level hide-the-button change — the
> service must reject it even if the request bypasses the UI.

## Prompt 5 — Custody history and audit trail

**Trains:** GORM associations and modeling an append-only audit concept —
useful groundwork for defect analysis, which often needs exactly this kind
of trail to diagnose an incident.
**Adds:** BR-9, plus a new domain class.

> Add a full custody history view per item: every past checkout/return for
> a given `Equipment`, including who did it and when, even after the
> current `CustodyRecord` is closed. Right now closing/returning a record
> doesn't preserve enough history for this — decide whether that requires
> a new `CustodyHistoryEntry` domain class written once and never mutated,
> or another approach, and justify the choice in `docs/specs/plan.md`.
>
> Update `docs/specs/spec.md` with a new BR-ID stating that history entries
> are immutable once created (never updated or deleted, only inserted) —
> this is itself a business rule, not just an implementation detail, since
> it's what makes this data trustworthy for later incident analysis. Write
> a Spock feature proving that attempting to modify a past history entry
> is rejected or structurally impossible. Add a read-only GSP page showing
> an item's full history, newest first, paginated. Implement all writes to
> history through `CustodyService` alongside the existing
> checkout/return methods — never as a separate, forgettable step.

## Prompt 6 — Secure officer authentication

**Trains:** the `secure-coding-with-ai` skill — authentication/authorization
as a business rule, built in from the start rather than patched on.
Complete this before running vulnerability-detection or hardening work —
this feature is the highest-value target for both.
**Adds:** BR-10, plus real authentication where none exists today.

> Right now custody actions trust a client-supplied `officerId` with no
> real authentication behind it. Add proper login: officers authenticate
> with a username and password (Spring Security Core, `bcrypt`-hashed
> storage — never plaintext or a custom hash), and every custody action
> uses the currently-authenticated officer instead of trusting a
> client-supplied ID. Reject unauthenticated requests to any custody
> mutation with 401, in the same structured error shape as our BR
> violations.
>
> Update `docs/specs/spec.md` with a new BR-ID stating that custody
> mutations require an authenticated officer, per
> `docs/standards/security-standard.md` §4. Write Spock features for:
> authenticated success, unauthenticated rejection, and wrong-password
> rejection. Implement the check in `CustodyService`, not as a filter that
> only some controllers remember to apply. Run the secret-scan hook
> mentally as you work — no password or secret literal belongs in the
> code, only in externalized config.

---

## Notes

- Prompts 1 and 2 are quick. Prompts 3-5 are meaningfully harder and
  usually take longer sessions — budget time accordingly.
- Complete Prompt 6 before running vulnerability-detection or hardening
  work — those operate best against a codebase that already has real
  authentication to scan and harden.
- Every prompt deliberately withholds the exact BR-ID number and asks the
  assistant to propose one — this is intentional. Watch whether the
  assistant just invents a number without checking `docs/specs/spec.md`
  for the next unused one; that's a small but real spec-discipline slip
  worth catching.
- Prompt 4 is the best one to watch for standards drift: a scaffolded or
  under-specified answer often puts the check in the controller or (worse)
  only in the GSP/JS layer. Both are BR-5-style violations even though this
  is a new rule, not one of the original five.
- All six assume a team is extending one shared app. If a team is instead
  bringing its own existing codebase (see `FACILITATION-NOTES.md`), use
  these as a pattern to write equivalent prompts against that domain
  instead.
