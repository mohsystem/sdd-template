# Testing Methodology Standard — Spock / CodeNarc

## The naming rule (this is what makes SDD demos and hooks work)

Every Spock feature method that proves a business rule is labeled:

```groovy
def "BR-n: <short description of what it proves>"() { ... }
```

Test class naming follows Grails convention:
`grails-app/services/.../CustodyService.groovy` →
`src/test/groovy/.../CustodyServiceSpec.groovy` (unit, mocked GORM via
`@TestFor`/`GroovyTestCase` helpers or `HibernateSpec` for integration).

```groovy
class CustodyServiceSpec extends HibernateSpec {

    def "BR-1: cannot check out an item with an open custody record"() {
        given:
        def item = new Equipment(status: 'ASSIGNED').save(failOnError: true)

        when:
        custodyService.checkout(officerId: officer.id, itemId: item.id, dueAt: tomorrow)

        then:
        def ex = thrown(BusinessRuleException)
        ex.brId == 'BR-1'
    }

    def "BR-4: overdue is true when dueAt has passed and item not returned"() {
        expect:
        custodyService.isOverdue(record) == expected

        where:
        dueAt              | returnedAt | expected
        yesterday          | null       | true
        tomorrow           | null       | false
        yesterday          | today      | false
    }
}
```

This is not cosmetic. It's the mechanism that lets:
- a facilitator (or a hook, in a real repo) find "the test for BR-4" by
  searching Spock feature names instead of reading the whole suite,
- a spec change ("BR-4 now has a 24-hour grace period") map directly to
  "which test do I update" without guessing,
- a defect report cite the BR whose test should have caught it (see
  `defect-analysis-and-triage` skill).

## Coverage expectations

1. Every BR-ID in `docs/specs/spec.md` has at least one Spock feature method
   named for it before the implementing code is considered done.
2. A test named for a BR must actually fail if that BR's logic is removed —
   don't let a vanity test pass regardless of the implementation.
3. Edge cases belonging to a BR (boundary conditions, the grace-period
   example above) get their own `where:` row or feature method, still named
   after the same BR-ID, distinguished by the description suffix.
4. Controller actions get an integration-level Spock spec
   (`@Integration`) asserting the HTTP status and JSON error shape for BR
   violations — a unit spec on the service alone doesn't prove the
   controller wires the 422 correctly.
5. JS behavior that mirrors a BR client-side (e.g. disabling a submit
   button) gets a lightweight browser-level check as part of the relevant
   lab's manual QA pass — this kit doesn't mandate a JS test runner, but
   any non-trivial JS logic should still be covered, even by a simple
   assertion script loaded in a scratch HTML page during development.
6. Zero CodeNarc violations (`./gradlew codenarcMain codenarcTest`) — lint
   is part of "done," not a separate optional pass.

## Test-first discipline

Write the failing Spock feature named after the BR **before** the
implementation. This is step 3 of the SDD loop (spec → plan → failing test
→ code → docs → lint → commit) and is what the `code-generation-with-specs`
and `test-case-generation` skills assume you're doing.

## When a spec changes

When a BR's definition changes, locate its Spock feature by name first
(`./gradlew test --tests "*BR-4*"` narrows the run), update it to the new
boundary/behavior, confirm it fails against the old code, then update the
implementation. Never edit the implementation first "and fix the test
after" — that inverts the discipline and hides regressions.
