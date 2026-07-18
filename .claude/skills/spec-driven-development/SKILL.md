---
name: spec-driven-development
description: Use before starting any new feature or fix. Establishes the spec-first discipline that every other skill in this kit assumes — read this one first.
phase: Define
---

# Spec-Driven Development

## Why

AI output is plausible, not automatically compliant. Left ungoverned, an
assistant follows generic conventions instead of this project's — and it
looks right while quietly drifting. The fix is making the project's rules
explicit in a document the assistant reads before acting, and correcting it
against that document afterward.

## The core discipline

1. The specification (`docs/specs/spec.md`) is the source of truth. Code,
   tests, and docs are derived from it and checked against it — never the
   other way around.
2. No change begins before the spec reflects it. If a request doesn't map to
   an existing BR-ID, propose one and get the spec updated first.
3. Every business rule has a stable ID (`BR-1`, `BR-2`, ...), cited in code,
   tests, and commit messages.
4. The loop for every change, no exceptions: **spec → plan → failing test →
   code → docs → lint → commit.**

## What this looks like in a session (Grails/Groovy stack)

When asked to make a change:
- Check `docs/specs/spec.md` for a matching BR-ID. If none exists, draft one
  (rule text + rationale) and confirm it with whoever owns the spec before
  writing code.
- State which BR-ID(s) the change serves before touching code, and which
  layer will own it — service (`grails-app/services/`), domain constraint
  (`grails-app/domain/`), or GSP/JS (UX convenience only, per
  `docs/standards/code-style.md`).
- After implementing, confirm: the Spock feature `"BR-n: ..."` exists and
  passes, `./gradlew codenarcMain codenarcTest` is clean, and the relevant
  doc/README sections were updated — don't wait to be asked.

## Example prompt

Use this as the opening prompt for any new piece of work, adapted to the
task at hand:

> "Before making this change, check `docs/specs/spec.md` for the relevant
> business rule. If it doesn't exist yet, propose a BR-ID and rule text
> first. Then follow spec → plan → failing Spock feature → service-layer
> implementation → docs → `./gradlew codenarcMain codenarcTest` → commit for
> the rest."
