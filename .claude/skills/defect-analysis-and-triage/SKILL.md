---
name: defect-analysis-and-triage
description: Use during Day 3's AI-Driven Defect Analysis lab to triage production incidents against BR-IDs — which rule broke, how severe, and what regressed.
phase: Review
---

# Defect Analysis and Triage

## Why

"Something broke in production" is not actionable. "BR-3's enforcement
regressed — items in MAINTENANCE could be checked out again" is. Triage
against BR-IDs turns an incident into a specific, testable claim, and tells
you exactly which existing test *should* have caught it (and didn't).

## Technique

1. **Identify the violated BR(s) first.** Ask: which rule in
   `docs/specs/spec.md` describes the behavior that broke? If none does,
   this incident reveals a spec gap, not a regression — route it to
   `requirements-and-gap-analysis` instead of a bug fix.
2. **Check whether a test should have caught it.** Search for the Spock
   feature `"BR-n: ..."` — if it exists and is passing, the test itself is
   insufficient (weak assertion, missing `where:` case) and needs
   strengthening, not just the code. If it doesn't exist, that's the actual
   root cause of the incident, not the code change that triggered it.
3. **Read the stack trace/logs for known Grails failure signatures first**:
   a `GrailsDataBindingException` or unexpected field bound onto a domain
   instance points at a missing command object (mass-assignment gap); a
   `StaleObjectStateException` points at a concurrency BR being violated
   under load, not a random glitch; a raw 500 instead of the app's 422 JSON
   shape means an exception handler is missing at the service boundary.
4. **Prioritize by BR criticality, not just user impact.** A rule protecting
   data integrity or chain-of-custody (as flagged in `test-planning`)
   outranks a cosmetic issue even with fewer affected users.
5. **Predict regression risk for the fix.** Before shipping a fix, ask which
   other BR-IDs share the same service method or GORM association, and
   confirm their Spock features still pass (`./gradlew test`) — this is
   where AI is genuinely faster than manual cross-referencing.

## Lab prompt

> "This incident: [description/logs/stack trace]. Identify which BR-ID in
> `docs/specs/spec.md` this violates, or state that it's a spec gap. Check
> whether the stack trace matches a known Grails failure signature
> (`GrailsDataBindingException`, `StaleObjectStateException`, an unhandled
> GORM validation error surfacing as a raw 500). Check whether a
> `\"BR-n: ...\"` Spock feature exists for it and why it didn't catch this.
> Propose a fix, then list which other BR-IDs share the same service
> method/GORM association and need their tests re-verified."
