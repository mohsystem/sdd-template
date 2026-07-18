# Architecture Decision Records (ADRs)

ADRs capture significant architectural decisions: the context, the
decision, and the consequences. They are immutable once accepted —
superseded, never edited.

## When to write one

Any decision that is costly to reverse, affects multiple modules/layers,
or changes a cross-cutting concern (e.g. choice of a major library,
a data-modeling approach, an authentication strategy, a decision to
introduce or reject a pattern in `docs/standards/`) gets an ADR. Routine
implementation choices already covered by `docs/specs/plan.md` don't need
one — ADRs are for decisions the team would otherwise re-litigate later
without a record of why.

## How to use them

- Copy `adr-template.md` to `NNNN-short-title.md` (next sequential number,
  zero-padded to 4 digits).
- Status starts `Proposed`, moves to `Accepted` once agreed, and becomes
  `Superseded by NNNN` if a later ADR reverses or replaces it — never edit
  an accepted ADR's decision after the fact.
- Add the new ADR to the index table below.
- Reference the ADR from the spec/plan section it justifies (e.g.
  `docs/specs/plan.md` §1 Architecture overview), so a reader lands on the
  rationale, not just the outcome.

## Index

| # | Title | Status |
|---|-------|--------|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |

Add new ADRs by copying `adr-template.md`.
