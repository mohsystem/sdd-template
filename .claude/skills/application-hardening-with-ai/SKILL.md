---
name: application-hardening-with-ai
description: Use during Day 4's Application Hardening lab to find and patch vulnerable dependencies and validate production configuration.
phase: Review
---

# Application Hardening with AI

## Why

Most real-world breaches exploit a known, patched vulnerability in a
dependency nobody updated — not a novel zero-day. Hardening is mostly
diligence: run the scan, read the config, fix what's actually flagged.

## Technique

1. **Run the dependency scan** (`docs/standards/security-standard.md` §2:
   `./gradlew dependencyCheckAnalyze`) and triage by severity — `HIGH`/
   `CRITICAL` block release, `MEDIUM` gets a tracked follow-up, not a
   silent ignore.
2. **For each flagged dependency**, ask the assistant for the minimum safe
   upgrade (not just "latest") and check `build.gradle` for anything
   pinned that would break — report the diff, don't blind-bump versions.
3. **Validate production configuration** against
   `docs/standards/security-standard.md` §1's A05 row: verbose errors,
   debug endpoints, and default credentials must all be disabled in
   `grails.config.environments.production`.
4. **Re-run the full test suite after any dependency bump** — a patched
   library can change behavior, not just close a CVE.

## Lab prompt

> "Run `./gradlew dependencyCheckAnalyze`, list every HIGH/CRITICAL
> finding, and propose the minimum safe version bump for each — checking
> `build.gradle` for pins that would conflict. Then review
> `application.yml`'s production block against
> `docs/standards/security-standard.md` §1 (A05) and flag anything
> misconfigured. Run the full test suite after applying any dependency
> change."
