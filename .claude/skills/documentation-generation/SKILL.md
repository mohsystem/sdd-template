---
name: documentation-generation
description: Use during Day 1's AI-Powered Documentation lab (and any time docs need to be produced/updated) to generate documentation from the spec rather than reverse-engineering it from code alone.
phase: Build
---

# Documentation Generation

## Why

Documentation that's reverse-engineered purely from code tends to describe
*what the code happens to do* rather than *what it's supposed to do* — and
it inherits every accidental behavior as if it were intentional. Generating
docs from the spec keeps them describing intent, with the code checked
against that same intent.

## Technique

1. **Feed the spec and plan as source material**, not just the code. Ask:
   "using `docs/specs/spec.md` and `docs/specs/plan.md`, document the
   [module/API/architecture]." Let the code confirm the docs are accurate,
   not generate them from scratch.
2. **Follow `docs/standards/documentation-methodology.md`** for what must be
   documented and where (README, inline docs, API contract, changelog).
3. **For legacy Grails modules with no spec yet** (a likely Day 1 lab
   scenario): reverse the flow deliberately — ask the assistant to read the
   domain class, service, and controller together and *propose* a spec
   (candidate BR-IDs, inferred GORM constraints) as a documentation
   artifact, flagged clearly as "inferred, needs confirmation" rather than
   presented as fact. This produces a first-draft spec as a side effect of
   documenting legacy code, which is exactly the gap-analysis input the
   `requirements-and-gap-analysis` skill needs.
4. **Keep an API contract table current** — method, path, JSON vs. GSP,
   behavior, and which BR it enforces — matching the shape in
   `docs/specs/spec-template.md` §4.
5. **Add Groovydoc to legacy service methods as you document them**,
   citing the inferred BR-ID — don't just write external prose about a
   method with no inline trace back to it.

## Lab prompt

For documenting a legacy Grails module with no existing spec:

> "Read `[Domain].groovy`, `[Domain]Service.groovy`, and
> `[Domain]Controller.groovy` together and produce three things: (1)
> documentation of current behavior — README section and Groovydoc on the
> service methods, (2) a proposed set of BR-IDs for `docs/specs/spec.md`
> inferred from the code (including GORM `constraints` you find), and (3)
> an updated API contract table entry. Mark all inferred BR-IDs explicitly
> as needing confirmation before they're treated as authoritative."
