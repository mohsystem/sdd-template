---
name: test-case-generation
description: Use during Day 3's Automated Test Case Generation lab to turn a test plan (or existing code) into concrete, correctly-named tests and test data.
phase: Verify
---

# Test Case Generation

## Why

Generating tests from code alone tends to just re-describe what the code
does — including its bugs. Generating tests from the test plan (which was
itself derived from the spec) keeps tests describing what *should* be true,
so they can actually catch regressions instead of just documenting current
behavior.

## Technique

1. **Generate from the test-plan row, not the implementation.** For each
   plan row, ask the assistant to produce the concrete Spock feature method
   — labeled `"BR-n: <description>"` per
   `docs/standards/testing-methodology.md`, in the class matching Grails
   convention (`CustodyServiceSpec`, `CustodyControllerSpec`). If asked to
   generate from code instead, explicitly flag any assertion that just
   mirrors current behavior with no basis in a BR.
2. **Generate test data deliberately for boundaries**, using Spock `where:`
   tables — data sets that hit the boundary conditions named in the plan
   (just-before/at/after a threshold), not just arbitrary valid/invalid
   examples.
3. **Verify the test actually fails without the fix.** Ask the assistant to
   confirm (or you confirm by running `./gradlew test`) that a generated
   test fails against a naive/incorrect implementation — a test that can't
   fail isn't proving anything.
4. **Generate integration-level Spock specs (`@Integration`) against the
   contract**, using the request/response/error shapes in
   `docs/specs/spec.md` §4, so tests catch HTTP status/JSON contract drift
   at the controller boundary, not just internal service logic bugs.
5. **For any BR with a GSP/JS echo**, note in the test what the equivalent
   manual browser check is (this kit doesn't generate a JS test runner
   suite) so it isn't silently skipped.

## Lab prompt

> "For each row in the test plan, generate the concrete Spock feature,
> labeled `\"BR-n: <description>\"`, in the correctly-named spec class.
> Include boundary-condition test data as a `where:` table. Generate the
> matching `@Integration` controller spec for the HTTP/JSON contract where
> applicable. For each generated test, state what specific bug or
> violation it would catch — if you can't state one, don't include that
> test."
