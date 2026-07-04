---
name: requirements-and-gap-analysis
description: Use during Day 1's AI-Assisted Requirements Analysis lab to turn a raw use case into a spec with BR-IDs, and to find gaps a first draft misses.
phase: Define
---

# Requirements and Gap Analysis

## Why

"Code without a spec is guessing." A vague ask ("track custody of
equipment") has to become measurable, testable rules before any design or
code work starts — otherwise every later lab (design, code gen, testing) is
building on sand.

## Technique

1. **Interview, don't dictate.** Ask the assistant to interview you (or the
   use case owner) about the domain before drafting anything: who are the
   actors, what states can an entity be in, what must never happen, what
   must always happen after an action.
2. **Turn every answer into a candidate BR.** A rule is a single, testable
   sentence — "An item with an open custody record cannot be checked out
   again" is a BR; "the system should handle custody well" is not.
3. **Run a gap pass deliberately.** After a first-draft spec, ask the
   assistant explicitly: "What states/transitions/actors does this spec not
   cover yet?" Don't assume completeness from a fluent-sounding first draft.
4. **Number and record.** Every surviving rule gets a BR-ID in
   `docs/specs/spec.md` §3, using the template in
   `docs/specs/spec-template.md`. Sketch each entity's fields against
   §2's GORM-shaped table at the same time — a field with no constraint
   yet is a gap, not a detail to fill in later.

## Common gaps to prompt for explicitly

- Concurrent/conflicting actions (two actors acting on the same entity at
  once — GORM optimistic locking via `version` needs a plan, not an
  afterthought)
- Error and edge states (what happens on failure, not just the happy path)
- Authorization boundaries (who is allowed to trigger which transition —
  Grails Spring Security roles/annotations if the app has them)
- Data lifecycle (what happens to a record after its use is over — soft
  delete vs. hard delete affects the domain model directly)
- Which rules need a client-side echo for UX (disabling a button, inline
  validation message) vs. server-only enforcement — flag these now so the
  Solution Design lab knows to plan the GSP/JS mirror deliberately.

## Lab prompt

> "Interview me about [the use case] to surface the actors, entity states,
> and transitions. Then draft `docs/specs/spec.md` using the template in
> `docs/specs/spec-template.md`, assigning a BR-ID to every rule. Finally,
> run a gap-analysis pass and list anything the draft doesn't cover yet."
