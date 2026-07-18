---
name: security-compliance-and-auditing
description: Use during Day 4's Security Compliance & Auditing lab to map requirements to real evidence in the repo and gate releases on it, instead of writing a narrative audit report from memory.
phase: Ship
---

# Security Compliance and Auditing

## Why

An audit report that isn't traceable to something checkable (a test, a CI
run, a spec line) is a story, not evidence. This is the same traceability
discipline as BR-IDs, applied to compliance requirements instead of
business rules.

## Technique

1. **Fill in the compliance mapping table** in
   `docs/standards/security-standard.md` §5 — one row per requirement,
   pointing to the actual control (a `@PreAuthorize` annotation, a spec
   BR-ID, a CI job) and the evidence that proves it's real (a passing
   test, a scan artifact).
2. **Don't invent controls that aren't implemented yet.** If a requirement
   has no real control, that's a gap for `requirements-and-gap-analysis` or
   `application-hardening-with-ai` to close first — the audit table
   reflects reality, not intent.
3. **Wire the compliance-relevant checks into CI/release**, not just into a
   document — see `release-automation-with-specs` and Hook Patterns 7-9 in
   `HOOKS-REFERENCE.md` (full verification gate, secret scan, dependency
   check). A compliance report is worth little if the checks it cites
   don't actually run on every release.
4. **Version the report alongside the code** it describes — a compliance
   report is stale the moment the code it maps to changes without an
   update.

## Lab prompt

> "Using `docs/standards/security-standard.md` §5, produce a compliance
> report for `[requirement set]`: one row per requirement, the actual
> control implementing it (annotation, BR-ID, CI job), and the evidence
> that proves it runs (test name, scan artifact). Flag any requirement with
> no real control yet as a gap, not a placeholder claim."
