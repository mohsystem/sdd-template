---
name: test-planning
description: Use during Day 3's AI-Accelerated Test Planning lab to build a test strategy that has systematic BR coverage, not ad hoc scenario lists.
phase: Verify
---

# Test Planning

## Why

Without a spec, test planning tends to cover whatever scenarios the author
happens to think of — usually the happy path plus one or two obvious edge
cases. With BR-IDs, coverage becomes a checklist: every rule in the spec
needs a plan entry, full stop.

## Technique

1. **Derive the plan from `docs/specs/spec.md`, row by row.** For every
   BR-ID, the test plan states: what proves it, what breaks it (the
   adversarial case), and what tier it's tested at — Spock unit spec
   (service, mocked GORM), Spock integration spec (`@Integration`, real
   Hibernate session, asserts controller HTTP/JSON behavior), or manual
   GSP/JS check.
2. **Ask explicitly for edge cases per BR**, not just one test per rule —
   boundary conditions (the BR-4 grace-period example from the reference
   deck, expressed as a Spock `where:` table), concurrent access (GORM
   optimistic locking — two updates racing on the same `version`), and
   invalid/malicious input (mass-assignment attempts against command
   objects, oversized/invalid GSP form submissions) each deserve their own
   plan line.
3. **Classify by risk, not just by rule.** Rules touching data integrity,
   authorization, or irreversible actions (e.g. anything police
   case-management data) get flagged for extra scrutiny/tiers in the plan —
   these are exactly the ones that warrant an integration spec, not just a
   unit spec.
4. **Include non-functional coverage** — performance (N+1 query risk on
   GORM associations under load) and security (CSRF on `<g:form>`/fetch()
   calls, XSS via unescaped GSP output, CodeNarc security rule set) — as
   their own section, since they don't map to a BR-ID directly but still
   need planned coverage.

## Lab prompt

> "Using `docs/specs/spec.md`, produce a test plan with one row per BR-ID:
> what proves it, what would break it (the adversarial case), and which
> tier covers it (Spock unit spec / Spock `@Integration` spec / manual
> GSP-JS check). Add a section for non-functional coverage: GORM N+1 query
> risk, CSRF/XSS on any GSP forms, CodeNarc security rules. Flag any BR
> touching data integrity or authorization for integration-level coverage,
> not just unit."
