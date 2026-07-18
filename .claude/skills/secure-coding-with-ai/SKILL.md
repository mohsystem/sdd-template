---
name: secure-coding-with-ai
description: Use during Day 4's Secure Coding with AI Assistance lab to build authentication/authorization and input handling correctly from the start, not patch it in later.
phase: Build
---

# Secure Coding with AI

## Why

Security bolted on after a feature ships costs far more than building it
in from the spec forward. Authentication/authorization is exactly the kind
of "requirement invisible until it fails" that SDD's spec-first discipline
is meant to catch early.

## Technique

1. **Treat auth requirements as business rules.** If a feature needs "only
   role X can do Y," that's a BR-ID in `docs/specs/spec.md`, not a detail
   invented silently in code — see `EXAMPLE-FEATURE-PROMPTS.md` Prompt 4
   for the worked example.
2. **Use Spring Security Core conventions**, not hand-rolled session/token
   logic — see `docs/standards/security-standard.md` §4.
3. **Validate and sanitize all input via command objects**
   (`grails.validation.Validateable`), never by binding raw `params` onto a
   domain instance — this is also a mass-assignment guard, not just an
   input-validation one.
4. **Write the denial-path test, not just the happy path.** Every auth
   feature needs a test proving the wrong role/no-auth case is rejected,
   named for its BR-ID, same as any other rule.

## Lab prompt

> "Implement authentication/authorization for `[feature]` following
> `docs/standards/security-standard.md` §4: Spring Security Core, a
> command object for input, and a BR-ID in `docs/specs/spec.md` for the
> access rule. Write Spock features for both the allowed and denied cases
> before implementing."
