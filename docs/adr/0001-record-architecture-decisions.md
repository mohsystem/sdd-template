# 0001 — Record architecture decisions

- **Status:** Accepted
- **Date:** [YYYY-MM-DD]
- **Deciders:** [names/roles]

## Context

We need a durable, reviewable record of significant technical decisions so
that new contributors and AI assistants understand *why* the system is the
way it is, not just *what* it is.

## Decision

We will use **Architecture Decision Records (ADRs)** in MADR-style, stored
in `docs/adr/`, numbered sequentially, and referenced from
`docs/specs/plan.md` and code where relevant. Each ADR states Context,
Decision, and Consequences. Accepted ADRs are immutable and are
superseded rather than edited.

## Consequences

- **Positive:** shared, searchable rationale; faster onboarding; less
  re-litigation of settled calls.
- **Negative:** small overhead to write and review ADRs.
- **Follow-up:** link ADRs from the affected spec/plan sections.
