# SDD Skills Kit — Standardized Toolkit

This folder is a standardized **Specification-Driven Development (SDD)
toolkit skeleton**, not a code sample despite the parent folder's name.
It's meant to be copied into any Grails/Groovy project as the baseline for
spec-first, BR-ID-traceable development — not tied to one application or
one-off exercise.

## What SDD is, in one paragraph

The specification is the source of truth. Every business rule gets an ID
(`BR-1`, `BR-2`, ...). No code changes before the spec reflects it. Tests are
named after the BR they prove. Docs and commits cite the BR-ID. AI assistants
read the specs before acting and are corrected by them — no change begins
before the spec reflects it, and every business rule has an ID cited in
code, tests, and commits.

## Why this kit has no demo app

This kit is deliberately **not** built around one fixed demo application.
Every project brings its own codebase or scenario (a legacy module, a new
service, a case-management app, production incidents, etc.), so the
material here — specs, standards, skills, hooks — is written to apply to
whatever a team is building, not to one pre-built repo.

The material is written for a real production stack, not kept generic:

- **Backend:** Grails + Groovy, GORM domain classes, service-layer business
  logic, Spock for tests, CodeNarc for lint.
- **Frontend:** Grails-rendered GSP views with vanilla JavaScript and HTML —
  no SPA framework. JS lives in versioned asset files, not inline
  `<script>` blocks, and is progressively-enhancement-friendly.

Every standard, hook pattern, and skill prompt below uses this stack's
real commands and conventions (`./gradlew codenarcMain`, `GormEntity`
constraints, `<g:each>`/`encodeAsHTML()` in GSP, etc.) instead of bracketed
placeholders — copy them into a real repo and they should mostly just work,
with project-specific naming substituted in.

## How the pieces fit together

One spec (`docs/specs/spec.md`), started at project kickoff, accumulates
BR-IDs and detail for the life of the project — nothing here is "done with
the spec" until release notes and the security compliance report are
written for a given change.

- Requirements work writes the first spec (with BR-IDs) and generates docs
  from it.
- That same spec drives solution design (produces `plan.md`), code
  generation (implements against BR-IDs), debugging (root-causes against
  the spec, not guesswork), and code review (reviews against
  `docs/standards/`).
- The spec's BR-IDs drive test planning and test-case generation (tests
  named `"BR-n: ..."`), defect analysis (triage against which BR broke),
  and release automation (release notes cite BR-IDs).
- Vulnerability detection and secure coding add new BR-IDs for
  security/auth rules and fix findings against `security-standard.md`;
  hardening and compliance auditing turn scan results and BR-IDs into
  release-gating evidence.

One spec, accumulating BR-IDs, carried across the whole lifecycle of a
project — that's the throughline this kit is built to support.

## Contents

| Path | Purpose |
|---|---|
| [`CLAUDE.md.template`](CLAUDE.md.template) | Entry-point file copied into a project's repo root at kickoff and kept updated throughout |
| [`EXAMPLE-FEATURE-PROMPTS.md`](EXAMPLE-FEATURE-PROMPTS.md) | 6 ready-to-use prompts demonstrating SDD-driven feature implementation on a sample Equipment Custody Register domain |
| [`docs/specs/spec-template.md`](docs/specs/spec-template.md) | BR-ID convention spec template |
| [`docs/specs/plan-template.md`](docs/specs/plan-template.md) | Implementation plan template |
| [`docs/standards/`](docs/standards/) | Grails/Groovy/GSP/JS code style (incl. tactical & anti-patterns), testing methodology (Spock/CodeNarc), doc methodology, review checklist, security standard (OWASP/Grails), data architecture, API guidelines |
| [`docs/adr/`](docs/adr/) | Architecture Decision Record practice — index, self-referential ADR 0001, and a blank template for new decisions |
| [`.claude/skills/`](.claude/skills/) | 15 skills, one per SDD lifecycle capability, phase-grouped (Define/Plan/Build/Verify/Review/Ship) |
| [`.claude/hooks/`](.claude/hooks/) | 9 hook patterns (`HOOKS-REFERENCE.md`) — CodeNarc, affected Spock spec, GSP XSS check, doc-sync reminder, controller-mutation guard, BR-ID commit gate, Stop-hook full verification, dependency vulnerability gate, secret scan — 4 ship as real runnable scripts |
| [`facilitator/`](facilitator/) | Reference notes for structured onboarding, kept separate from the toolkit itself |

## How a project adopts this kit

1. Copy `CLAUDE.md.template` → `CLAUDE.md` and
   `docs/specs/spec-template.md` → `docs/specs/spec.md` into the project's
   repo at kickoff.
2. Point Claude (or whichever assistant) at the relevant `.claude/skills/*`
   skill for whatever phase of work is happening — each skill's
   description says when to use it.
3. Standards and hooks stay constant for the life of the project; only the
   spec and plan grow.

## Skills reference

These skills are original content for this toolkit, organized using the
same six-phase lifecycle (Define → Plan → Build → Verify → Review → Ship) and
`{skill-name}/SKILL.md` convention as
[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), so
that if a team later adopts that plugin directly, the mental model
transfers. Where topics overlap (e.g. code review, debugging), that public
repo's skills can be used as a general-purpose base, with the skills in this
kit adding the BR-ID/spec-traceability layer on top: a general-purpose
code-review skill plus this kit's own review-checklist gives you both
generic quality review and project-specific BR traceability, rather than
replacing one with the other.
