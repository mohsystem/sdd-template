# SDD Skills Kit — AI Enablement Program

This folder is a **Specification-Driven Development (SDD) skills kit**. It exists to weave one
methodology through all three days of the AI Enablement agenda instead of
teaching AI tool tricks in isolation.

## What SDD is, in one paragraph

The specification is the source of truth. Every business rule gets an ID
(`BR-1`, `BR-2`, ...). No code changes before the spec reflects it. Tests are
named after the BR they prove. Docs and commits cite the BR-ID. AI assistants
read the specs before acting and are corrected by them — no change begins
before the spec reflects it, and every business rule has an ID cited in
code, tests, and commits.

The material is written for the team's actual production stack, not kept
generic:

- **Backend:** Grails + Groovy, GORM domain classes, service-layer business
  logic, Spock for tests, CodeNarc for lint.
- **Frontend:** Grails-rendered GSP views with vanilla JavaScript and HTML —
  no SPA framework. JS lives in versioned asset files, not inline
  `<script>` blocks, and is progressively-enhancement-friendly.

Every standard, hook pattern, and skill lab prompt below uses this stack's
real commands and conventions (`./gradlew codenarcMain`, `GormEntity`
constraints, `<g:each>`/`encodeAsHTML()` in GSP, etc.) instead of bracketed
placeholders — copy them into a real repo and they should mostly just work,
with project-specific naming substituted in.

## Contents

| Path | Purpose |
|---|---|
| [`CLAUDE.md.template`](CLAUDE.md.template) | Entry-point file trainees copy into their lab repo on Day 1 and keep updating all week |
| [`EXAMPLE-FEATURE-PROMPTS.md`](EXAMPLE-FEATURE-PROMPTS.md) | 5 ready-to-use prompts implementing new features on the Equipment Custody Register domain — hand these to the team for the Day 2 Code Generation lab |
| [`docs/specs/spec-template.md`](docs/specs/spec-template.md) | BR-ID convention spec template (Day 1 Requirements Analysis) |
| [`docs/specs/plan-template.md`](docs/specs/plan-template.md) | Implementation plan template (Day 2 Solution Design) |
| [`docs/standards/`](docs/standards/) | Grails/Groovy/GSP/JS code style, testing methodology (Spock/CodeNarc), doc methodology, review checklist |
| [`.claude/skills/`](.claude/skills/) | 11 skills, one per lab-mapped capability, phase-grouped (Define/Plan/Build/Verify/Review/Ship) |
| [`.claude/hooks/`](.claude/hooks/) | 7 hook patterns (`HOOKS-REFERENCE.md`) — CodeNarc, affected Spock spec, GSP XSS check, doc-sync reminder, controller-mutation guard, BR-ID commit gate, Stop-hook full verification — 3 ship as real runnable scripts |
| [`facilitator/AGENDA-SKILL-MAP.md`](facilitator/AGENDA-SKILL-MAP.md) | Every agenda row mapped to the skill(s) and artifact used |
| [`facilitator/FACILITATION-NOTES.md`](facilitator/FACILITATION-NOTES.md) | Day-by-day notes on introducing/reinforcing SDD without a fixed demo app |

## How a facilitator uses this kit

1. Before Day 1, skim `facilitator/FACILITATION-NOTES.md` and
   `AGENDA-SKILL-MAP.md`.
2. Have trainees copy `CLAUDE.md.template` → `CLAUDE.md` and
   `docs/specs/spec-template.md` → `docs/specs/spec.md` into their lab
   workspace at the start of Day 1's Requirements Analysis lab.
3. Point Claude (or whichever assistant) at the relevant `.claude/skills/*`
   skill before each lab that needs it — the map tells you which one.
4. Standards and hooks stay the same all week; only the spec and plan grow.

## Skills reference

These skills are original content for this training, organized using the
same six-phase lifecycle (Define → Plan → Build → Verify → Review → Ship) and
`{skill-name}/SKILL.md` convention as
[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), so
that if the team later adopts that plugin directly, the mental model
transfers. Where topics overlap (e.g. code review, debugging), that public
repo's skills can be used as a general-purpose base, with the skills in this
kit adding the BR-ID/spec-traceability layer on top: a general-purpose
code-review skill plus this kit's own review-checklist gives you both
generic quality review and project-specific BR traceability, rather than
replacing one with the other.
