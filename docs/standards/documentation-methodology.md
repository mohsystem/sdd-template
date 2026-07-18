# Documentation Methodology Standard — Groovydoc / GSP / JSDoc

## What must stay in sync, and where

| Change | Update this |
|---|---|
| New or changed BR | `docs/specs/spec.md` §3 (rule text) and §7 (change log) |
| New or changed endpoint (JSON or GSP page) | `docs/specs/spec.md` §4 (API contract table) and the project README's endpoint table |
| New/changed architecture decision | `docs/specs/plan.md` |
| Service method enforcing a BR | Groovydoc on the method, citing `@see BR-n` |
| GORM domain class constraint driven by a BR | A one-line comment above the `constraints` entry citing the BR-ID |
| Non-trivial JS function | JSDoc-style `/** ... */` comment stating what it does and which GSP page/element it's wired to |

Example Groovydoc on a service method:

```groovy
/**
 * Checks out an item to an officer.
 *
 * @see BR-1 rejects checkout if the item has an open custody record
 * @see BR-3 rejects checkout if the item is in MAINTENANCE
 */
@Transactional
CheckoutResult checkout(Long officerId, Long itemId, Date dueAt) { ... }
```

## The rule that matters most

**Documentation updates are never a separate, optional step you do "if there
is time."** They are part of the same change as the code — same commit where
practical, same review. If a code change ships without a matching doc
update, that is an incomplete change, not a finished one with a follow-up.

## Generating docs from the spec, not the other way around

When using AI to produce documentation, give the assistant the spec and
plan as source material and ask it to
derive the docs — don't ask it to reverse-engineer docs from code alone and
then leave the spec stale. The spec is the steering wheel; docs describe
where it's pointing, not the other way around.

## Minimum documentation per project

- A README with: what the project is, how to run it (`./gradlew bootRun` or
  `grails run-app`, plus any required local datasource setup), and its
  current API contract (kept in sync with `docs/specs/spec.md` §4).
- Groovydoc on every service method and domain-class constraint that
  implements a BR, citing the BR-ID.
- JSDoc-style comments on non-trivial JS in
  `grails-app/assets/javascripts/`.
- A changelog or release notes entry per shipped change (see
  `release-automation-with-specs` skill), citing the BR-ID(s) it touches.
