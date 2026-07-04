---
name: code-review-and-quality
description: Use during Day 2's Enhanced Code Reviews lab to review AI-generated (or legacy) code against docs/standards, catching standards drift review-after-the-fact can miss.
phase: Review
---

# Code Review and Quality

## Why

Review is the backstop layer for everything the persuasion layers (spec,
plan, standards, skills) failed to prevent — including cases where the
assistant complied with a request it should have refused. Reviewing against
a written checklist catches this consistently; reviewing from memory of
"what generally looks right" does not.

## Technique

1. **Run `docs/standards/review-checklist.md` line by line** — don't
   freehand the review. Ask the assistant to self-check against it before a
   human reviews, then have the human review independently.
2. **Check for standards drift specifically**, not just bugs: does this
   change follow *this project's* layering/naming/testing conventions, or
   generic Grails scaffold defaults the assistant may have reached for
   (e.g. scaffolded CRUD controllers that mutate domain instances directly,
   which is exactly the pattern `docs/standards/code-style.md` forbids)?
   This is the failure mode SDD's persuasion layers exist to prevent, and
   review is what catches it when they don't.
3. **Run the Grails/Groovy production checks explicitly** —
   `./gradlew codenarcMain codenarcTest`, scan touched GORM associations
   for N+1 risk, confirm `@Transactional` boundaries are correct, confirm
   no raw/`encodeAsRaw()` output was introduced in touched GSP files.
4. **Ask the assistant to justify, not just fix.** For any finding, ask
   "why does this violate the standard" before asking for the fix — this
   surfaces cases where the "violation" is actually a standards gap
   (missing rule), not a code defect.
5. **Treat refactoring suggestions the same way as feature review** — a
   refactor that improves style but breaks a BR's enforcement (e.g. moving
   logic "for cleanliness" from a service back into a controller) is a
   regression, not an improvement. Check traceability even on "just
   cleanup" changes.

## Lab prompt

> "Review this change against `docs/standards/review-checklist.md`,
> including the Grails/Groovy production checks and the GSP/JavaScript
> checks. Run `./gradlew codenarcMain codenarcTest` and report the result.
> For each unchecked item, state which rule in `code-style.md`,
> `testing-methodology.md`, or `documentation-methodology.md` it violates
> and why. Separately, flag anything that looks like standards drift —
> e.g. scaffolded Grails conventions instead of this project's layering."
