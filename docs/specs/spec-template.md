# Specification — [Project / Lab Name]

Produced during: **Day 1, AI-Assisted Requirements Analysis lab.**
Owner: whoever runs the lab; updated by every trainee session afterward.

## 1. Objective

[Purpose of the system, its users, and what "done" looks like. Reframe any
vague ask into a measurable success criterion before moving on — "code
without a spec is guessing."]

## 2. Domain model

[Entities, their fields, and the relationships between them, expressed as
they'll become GORM domain classes. A short table is enough at this stage —
GORM `constraints`/`mapping` blocks grow directly out of it.]

| Entity | Field | Type | GORM constraint | BR(s) driving it |
|---|---|---|---|---|
| [e.g. `CustodyRecord`] | `status` | `String` (enum-like) | `inList: ['ASSIGNED', 'AVAILABLE', 'MAINTENANCE']` | BR-2, BR-3 |
| | `dueAt` | `Date` | `nullable: false` | BR-4 |

## 3. Business rules (BR-IDs)

Every rule gets a stable ID. IDs are never renumbered or reused, even if a
rule is later removed (mark it `[SUPERSEDED]` instead). Every BR must have at
least one test named `BR-n: <short description>` — see
`docs/standards/testing-methodology.md`.

| ID | Rule | Notes |
|---|---|---|
| BR-1 | [State the rule as a single, testable sentence] | [Why it exists / what it prevents] |
| BR-2 | | |
| BR-3 | | |

## 4. API contract

Method, path, request/response shape, and which BR(s) each endpoint
enforces. This app mixes JSON endpoints (called from vanilla JS via
`fetch()`) and GSP-rendered pages — mark which each row is.

BR violations return `respond(model, [status: 422])` with a JSON body:

```json
{ "error": "BR-1", "message": "Item already has an open custody record." }
```

The JS layer maps `error` codes to user-facing messages via a single lookup
(e.g. `assets/javascripts/errorMessages.js`) — never hardcode the message
string in more than one place.

| Method | Path | Type | Behavior | Enforces |
|---|---|---|---|---|
| GET | `/[resource]` | GSP page | [list/detail view] | — |
| GET | `/api/[resource]` | JSON | [list, optional filters] | — |
| POST | `/api/[resource]` | JSON | [behavior] → `201` or `422` | BR-1, BR-2 |

## 5. GSP views and JS behavior

[For each page: which GSP template renders it, what vanilla JS enhances it
(e.g. a `fetch()` call replacing a full page reload on form submit), and
which BR-driven validation must be mirrored client-side for UX — while the
service layer remains the actual enforcement point. Client-side checks are
a convenience, never the authority.]

## 6. Out of scope

[What this spec deliberately does not cover, so gap-analysis in later labs
has a documented boundary to check against.]

## 7. Change log

Every time this spec changes (a new BR, a rule amended), record it here with
the date and which lab/day drove the change. This is what later labs
(Solution Design, Code Gen, Defect Analysis, Release Automation) point back
to.

| Date | Change | Driven by |
|---|---|---|
| [YYYY-MM-DD] | Initial spec drafted | Day 1 — Requirements Analysis lab |
