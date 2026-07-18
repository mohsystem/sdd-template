# API Design Guidelines

House style for every JSON endpoint in this project, so each one feels the
same and is safe by default. GSP-rendered pages follow `code-style.md`
instead — this file is for the `/api/...` surface.

## 1. Style & versioning

- REST over HTTPS, JSON, UTF-8. Base path `/api/v1` — version in the path;
  a breaking change bumps the major version, not a query param or header.
- Resource names are plural nouns, `kebab-case` where multi-word:
  `/api/v1/custody-records`. Actions that aren't plain CRUD use a
  sub-resource or explicit command noun, not a verb:
  `POST /api/v1/custody/{id}/returns`, not `/api/v1/return-custody`.

## 2. Methods & status codes

| Method | Use | Success |
|--------|-----|---------|
| GET | Read | 200 |
| POST | Create / command | 201 (create) / 200 (command) |
| PUT | Full replace | 200 |
| PATCH | Partial update | 200 |
| DELETE | Remove | 204 |

Errors: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found,
409 conflict, 422 semantic/BR violation, 429 rate limited, 500 server.
Never leak a stack trace to the client.

## 3. Standard response envelope

Success (single):
```json
{ "data": { "id": "…" }, "meta": null, "error": null }
```
Success (paginated):
```json
{ "data": [ /* … */ ], "meta": { "page": 0, "size": 20, "totalElements": 137, "totalPages": 7 }, "error": null }
```
Error — this is the same shape already established for BR violations in
`docs/specs/spec-template.md` §4, applied consistently to every error, not
just BR ones:
```json
{
  "data": null,
  "error": {
    "code": "BR-1",
    "message": "This item already has an open custody record.",
    "details": [ { "field": "itemId", "issue": "conflict" } ],
    "traceId": "b1e2…"
  }
}
```
`code` is a stable, documented value — a `BR-n` for business-rule
violations, or a module-prefixed enum for other errors (e.g.
`VALIDATION_ERROR`). Never change a `code` value once a client may depend
on it; deprecate and introduce a new one instead.

## 4. Pagination, filtering, sorting

- Pagination: `?page=0&size=20` (0-based). Always bounded — enforce a
  server-side max `size` regardless of what the client requests.
- Sorting: `?sort=createdAt,desc`. Only sort on documented, indexed
  fields.
- Filtering: explicit, documented query params per endpoint — never
  accept a raw filter/query expression from the client.

## 5. Idempotency

Unsafe, retryable commands (payments, issuing a document, anything a
client might legitimately retry after a timeout) accept an
`Idempotency-Key` header; repeating the same key returns the original
result instead of creating a duplicate.

## 6. Validation & security

- Validate every input at the boundary (a command object, per
  `docs/standards/code-style.md`). Reject unknown fields rather than
  silently ignoring them.
- Enforce authorization per endpoint; default deny, not default allow.
- Rate-limit public and authentication endpoints.
- Never place sensitive data in a URL or query string — see
  `docs/standards/data-architecture.md` §2 and `security-standard.md`.

## 7. Headers & conventions

- `X-Correlation-Id` (or similar): accept it if present, generate one if
  absent, echo it back and include it in server-side logs for that
  request.
- Timestamps in responses are ISO-8601 UTC.
- `ETag` / `If-None-Match` for cacheable reads where it's worth the
  complexity.

## 8. Documentation

- Every endpoint's contract lives in `docs/specs/spec.md` §4 (method,
  path, behavior, which BR it enforces) — keep it current in the same
  commit as the code, per `documentation-methodology.md`.
- If the project generates an OpenAPI/Swagger spec from code, treat that
  as the detailed reference and `spec.md` §4 as the BR-traceable summary —
  don't let the two drift apart.

## 9. Deprecation

Deprecate with a documented migration note and a real removal window
(tied to a major version bump) — never remove a field or endpoint a
client may depend on without warning.
