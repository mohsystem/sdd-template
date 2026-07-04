---
name: architecture-and-solution-design
description: Use during Day 2's AI-Driven Solution Design lab to turn a spec into an implementation plan — architecture, data model, and task breakdown, all traced to BR-IDs.
phase: Plan
---

# Architecture and Solution Design

## Why

A spec says *what* must be true; a plan says *how* the system will make it
true. Skipping straight from spec to code means architecture decisions get
made ad hoc, mid-implementation, by whichever prompt happened to trigger
them — and they won't be consistent across the rest of the system.

## Technique

1. **Start from the spec, not a blank page.** Feed `docs/specs/spec.md` to
   the assistant and ask for a Grails MVC design (controller → service →
   GORM domain) that satisfies every BR-ID, not a generic scaffold.
2. **Name the layering rule explicitly**, per `docs/standards/code-style.md`:
   services own enforcement, controllers only bind/dispatch/respond, GORM
   constraints express the validation rules that map cleanly onto them.
   This single decision is what later prevents "quick fix in the
   controller" drift.
3. **Design the GORM domain model alongside the service layer**, not after:
   for each BR touching state, decide which domain class/field/`constraints`
   entry enforces it vs. which needs service-level logic (e.g. cross-entity
   rules GORM constraints can't express alone, like BR-1's "no second open
   custody record").
4. **Decide the JS/GSP split up front.** Which pages are full GSP renders,
   which actions are enhanced with a `fetch()` call to a JSON endpoint —
   and which BRs get a client-side echo for UX (still enforced server-side).
5. **Trace every component back to a BR.** If a proposed service method,
   endpoint, or GORM field doesn't serve any BR-ID, question whether it
   belongs in this iteration — this is where AI-assisted design tends to
   over-build unless checked against the spec.
6. **Break the plan into reviewable tasks**, each naming its BR(s) and
   acceptance criterion, using `docs/specs/plan-template.md`.

## Validating the design before coding starts

Ask the assistant to walk the plan against the spec BR-by-BR: "For each
BR-ID, which service method or GORM constraint enforces it, and which Spock
feature would prove it?" A plan that can't answer this for every BR isn't
ready for Code Generation.

## Lab prompt

> "Using `docs/specs/spec.md`, propose a Grails MVC design: GORM domain
> classes with constraints, service methods (with `@Transactional` where
> they mutate state), and which pages are GSP vs. JSON+fetch()-enhanced.
> State explicitly which layer enforces each BR, then write
> `docs/specs/plan.md` using the plan template, breaking the work into
> tasks that each cite the BR(s) they serve."
