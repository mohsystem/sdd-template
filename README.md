# SDD Skills Kit — AI Enablement Program

This folder is a **Specification-Driven Development (SDD) skills kit**, not a
code sample despite the parent folder's name. It exists to weave one
methodology through all four days of the AI Enablement agenda instead of
teaching AI tool tricks in isolation.

## What SDD is, in one paragraph

The specification is the source of truth. Every business rule gets an ID
(`BR-1`, `BR-2`, ...). No code changes before the spec reflects it. Tests are
named after the BR they prove. Docs and commits cite the BR-ID. AI assistants
read the specs before acting and are corrected by them — no change begins
before the spec reflects it, and every business rule has an ID cited in
code, tests, and commits.

## Why this kit has no demo app

This kit is deliberately **not** built around one fixed demo application.
The 4-day agenda's labs each bring their own codebase or scenario (a legacy
module, a case-management app the trainees design themselves, production
incidents, etc.), so the material here — specs, standards, skills, hooks —
is written to apply to whatever the trainees are building that day, not to
one pre-built repo.

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

## How it threads through the 4 days

See [`facilitator/AGENDA-SKILL-MAP.md`](facilitator/AGENDA-SKILL-MAP.md) for
the full row-by-row mapping. In short:

- **Day 1** — trainees write the first spec (with BR-IDs) during the
  Requirements Analysis lab, and generate docs from it during the
  Documentation lab.
- **Day 2** — that same spec drives the Solution Design lab (produces
  `plan.md`), the Code Generation lab (implements against BR-IDs), the
  Debugging lab (root-causes against the spec, not guesswork), and the Code
  Review lab (reviews against `docs/standards/`).
- **Day 3** — the spec's BR-IDs drive test planning and test-case generation
  (tests named `BR-n: ...`), defect analysis (triage against which BR broke),
  and release automation (release notes cite BR-IDs).
- **Day 4** — vulnerability detection and secure coding add new BR-IDs
  for security/auth rules and fix findings against `security-standard.md`;
  hardening and compliance auditing turn the scan results and BR-IDs into
  release-gating evidence.

One spec, accumulating BR-IDs, carried across all four days — that's the
throughline this kit is built to support.

## Contents

| Path | Purpose |
|---|---|
| [`CLAUDE.md.template`](CLAUDE.md.template) | Entry-point file trainees copy into their lab repo on Day 1 and keep updating all week |
| [`EXAMPLE-FEATURE-PROMPTS.md`](EXAMPLE-FEATURE-PROMPTS.md) | 6 ready-to-use prompts implementing new features on the Equipment Custody Register domain — hand these to the team for the Day 2 Code Generation lab and Day 4's secure-coding lab |
| [`docs/specs/spec-template.md`](docs/specs/spec-template.md) | BR-ID convention spec template (Day 1 Requirements Analysis) |
| [`docs/specs/plan-template.md`](docs/specs/plan-template.md) | Implementation plan template (Day 2 Solution Design) |
| [`docs/standards/`](docs/standards/) | Grails/Groovy/GSP/JS code style, testing methodology (Spock/CodeNarc), doc methodology, review checklist, security standard (OWASP/Grails, Day 4) |
| [`.claude/skills/`](.claude/skills/) | 15 skills, one per lab-mapped capability, phase-grouped (Define/Plan/Build/Verify/Review/Ship) |
| [`.claude/hooks/`](.claude/hooks/) | 9 hook patterns (`HOOKS-REFERENCE.md`) — CodeNarc, affected Spock spec, GSP XSS check, doc-sync reminder, controller-mutation guard, BR-ID commit gate, Stop-hook full verification, dependency vulnerability gate, secret scan — 4 ship as real runnable scripts |
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
