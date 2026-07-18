---
name: release-automation-with-specs
description: Use when generating deployment scripts and release notes that cite BR-IDs, keeping releases traceable to the spec.
phase: Ship
---

# Release Automation with Specs

## Why

Release notes that say "various bug fixes and improvements" are useless for
audit and rollback decisions. Release notes that cite BR-IDs let anyone
answer "did this release change how BR-3 is enforced" without reading the
diff — which matters a lot more in a system handling case/custody data than
in a typical consumer app.

## Technique

1. **Generate release notes from the spec's change log**
   (`docs/specs/spec.md` §7), not from raw commit messages — commits cite
   BR-IDs, but the change log states what actually changed in the rule.
   Cross-reference both.
2. **Flag BR changes distinctly from non-BR changes** (refactors, dependency
   bumps) in release notes — a reader triaging risk needs to find the
   rule-affecting changes immediately, not scan past twenty dependency
   bumps first.
3. **Validate the Grails build/deploy pipeline against the plan.** Ask the
   assistant to check the CI config runs `./gradlew test codenarcMain
   codenarcTest` (not just a subset), builds the deployable WAR
   (`./gradlew war` or `bootWar`), and — if the schema changed for a BR —
   that a migration (e.g. Liquibase changelog, or Grails' own
   `dbm-generate-gorm-changelog` output) is included and applied before the
   app starts against the new schema.
4. **Treat the release as citable evidence.** For a regulated/law-enforcement
   context, being able to say "BR-4's grace period was introduced in release
   X, tested by `\"BR-4: ...\"`" is the deliverable, not just the shipped
   code.

## Example prompt

> "Generate release notes for this release using `docs/specs/spec.md` §7
> (change log) and the commit history. Separate BR-affecting changes from
> other changes, and cite the BR-ID for each. Then review the CI/deploy
> pipeline and confirm: it runs `./gradlew test codenarcMain codenarcTest`
> in full for every BR touched in this release, it builds the WAR, and any
> schema-changing BR has a migration included and sequenced before app
> startup."
