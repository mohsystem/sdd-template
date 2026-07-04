# Review Checklist Standard

Used during the Day 2 Code Review lab, and by anyone reviewing AI-generated
changes throughout the program. Every item traces back to a rule in
`code-style.md`, `testing-methodology.md`, or `documentation-methodology.md`
— if a reviewer wants to add a new check, it belongs in one of those files
first, then here.

## Traceability

- [ ] Every changed behavior traces to a BR-ID in `docs/specs/spec.md`. If it
      doesn't, either the spec is missing a rule or the change is
      out-of-scope creep.
- [ ] The commit message cites the BR-ID(s) the change serves.

## Layering (`code-style.md`)

- [ ] No business-rule logic in controllers or GSP/JS — only in
      `@Transactional` service methods.
- [ ] No BR-ID's enforcement duplicated in two places (e.g. same rule
      checked in both the service and a GORM constraint in a way that can
      drift out of sync).
- [ ] Mutating input arrives via a command object (`Validateable`), not
      unchecked `params` binding directly onto a domain instance
      (mass-assignment risk).

## Grails/Groovy production checks

- [ ] `./gradlew codenarcMain codenarcTest` — zero violations on changed
      files.
- [ ] No new N+1 query pattern introduced (check GORM associations touched
      in a loop — use `fetch: 'join'`/criteria projections or `.list(fetch:
      [...])` instead).
- [ ] `@Transactional` boundaries are correct — a service method that reads
      then writes across multiple domain instances is one transaction, not
      several implicit ones.
- [ ] No raw SQL/`executeQuery` where a GORM criteria or HQL-via-`where{}`
      query would do the same thing safely.
- [ ] GORM domain `constraints` actually match the rule in the spec (e.g. a
      `maxSize`/`inList` matches what BR-n states, not a rounder/looser
      value).

## Frontend (GSP / JavaScript) checks

- [ ] No unescaped/raw output of user-supplied or BR-relevant data in GSP
      (`encodeAsRaw()`/`raw()` used without a reviewed, documented reason).
- [ ] No inline `<script>` with logic; JS lives in
      `grails-app/assets/javascripts/`.
- [ ] Forms use `<g:form>` or otherwise carry a CSRF token; no fetch() call
      bypasses CSRF protection.
- [ ] Client-side validation mirroring a BR is clearly a UX convenience —
      the service layer still enforces it server-side.

## Tests (`testing-methodology.md`)

- [ ] Every touched/new BR has a Spock feature named `"BR-n: <description>"`.
- [ ] That test fails if the BR's logic is removed (not a vanity pass).
- [ ] No test was weakened or deleted to make the suite pass.
- [ ] Controller-level integration spec asserts the HTTP status/JSON error
      shape for any BR violation path touched.

## Documentation (`documentation-methodology.md`)

- [ ] Spec change log updated if a BR was added/changed.
- [ ] API contract table updated if an endpoint changed.
- [ ] Inline docs updated on anything touching a BR.

## AI-specific checks

- [ ] The change follows *this project's* conventions, not generic
      framework defaults the assistant may have defaulted to.
- [ ] If the assistant pushed back on a request (cited a BR or standard and
      declined/rerouted it), confirm the pushback was correct — don't
      silently override it without recording why.
- [ ] If the assistant complied with something that should have been
      refused, flag it as a standards-drift instance for the Defect
      Analysis lab (Day 3) to reference.

## Verdict

Any unchecked box above is a HIGH or CRITICAL finding depending on whether it
touches security/data integrity (CRITICAL) or quality/consistency (HIGH). Do
not approve with unresolved CRITICAL findings.
