---
name: debugging-and-error-recovery
description: Use during Day 2's AI-Powered Debugging lab to root-cause errors against the spec and standards instead of guessing from the stack trace alone.
phase: Verify
---

# Debugging and Error Recovery

## Why

A stack trace tells you where something broke, not whether the *intended*
behavior was even defined correctly. Debugging against the spec turns "why
did this throw" into "which BR should have prevented this state, and did
it," which is a more useful and more teachable question in a multi-tier
system.

## Technique

1. **Classify the failure against the spec first.** Ask: does this violate
   an existing BR (a bug in enforcement), or does it reveal a state the spec
   never addressed (a gap, feed to `requirements-and-gap-analysis`)? These
   need different fixes.
2. **Reproduce with a named Spock feature.** Before fixing, write (or ask
   the assistant to write) a failing `"BR-n: ..."` feature if a BR is
   implicated, or a new candidate BR if this is a gap. This keeps the fix
   from becoming a one-off patch with no lasting proof it's fixed.
3. **Trace across tiers deliberately.** For multi-tier issues in this stack,
   ask the assistant to walk the path layer by layer — browser/JS
   (`fetch()` call or form submit) → `Controller` action → `@Transactional`
   service method → GORM/Hibernate — stating at each layer what it expects
   to be true and checking that against the spec's contract (API/error
   shape in `docs/specs/spec.md` §4). Don't let it jump straight to a fix in
   whichever layer looks most suspicious.
4. **Watch for Grails-specific failure classes** before assuming
   application logic is at fault: `LazyInitializationException` (session
   closed before an association is accessed — a symptom, not always the
   root cause), GORM validation errors surfacing as an unhandled 500
   instead of the app's 422 shape, and `StaleObjectStateException` from
   optimistic locking under concurrent edits (may indicate BR-1-style
   concurrency rule is genuinely being tested, not just a bug).
5. **Fix in the layer the plan designates**, not wherever is fastest —
   applying the same layering discipline as code generation, even under bug
   pressure.

## Lab prompt

> "This error occurs when [reproduction steps]. First tell me: does this
> violate an existing BR-ID in `docs/specs/spec.md`, or is it a gap the spec
> doesn't cover? Then trace the request across tiers — JS/GSP → controller
> → service → GORM — stating expected vs. actual behavior at each layer,
> and check whether this is a known Grails failure class
> (`LazyInitializationException`, unhandled GORM validation error,
> `StaleObjectStateException`) before proposing a fix. Write a failing
> Spock feature `\"BR-n: ...\"` before fixing."
