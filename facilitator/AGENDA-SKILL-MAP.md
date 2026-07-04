# Agenda → Skill Map

Every row of the pasted 3-day agenda, mapped to the skill(s) in
`.claude/skills/` used during that session, the artifact it produces or
updates, and how that artifact carries forward. Read this alongside
`FACILITATION-NOTES.md`.

The throughline: **one spec (`docs/specs/spec.md`), started Day 1 morning,
accumulates BR-IDs and detail all the way through Day 3 afternoon.** Nothing
in this program is "done with the spec" until release notes are written.

Stack for every lab from Day 2 onward: **Grails + Groovy backend (GORM
domain classes, `@Transactional` services, thin controllers), GSP views
progressively enhanced with vanilla JavaScript, Spock for tests, CodeNarc
for lint.** See `docs/standards/` for the concrete conventions.

## Day 1

| Time | Topic / Lab | Skill(s) | Artifact produced/updated | Carries forward as |
|---|---|---|---|---|
| 9:00–10:30 | AI Fundamentals for Developers | — (foundational; no lab) | none | Introduce the idea that "the spec is what the AI reads before it acts" as a preview — don't teach SDD mechanics yet, just plant the phrase. |
| 10:45–12:30 | Prompt Engineering Fundamentals — *Hands-on: Writing technical prompts* | `spec-driven-development` (read-only, as a worked example of an effective prompt) | none yet | Trainees practice prompt anatomy on a prompt that cites a rule/spec, previewing the pattern every later lab prompt uses. |
| 1:30–3:00 | AI for Requirements Analysis — *Lab: Analyzing law enforcement use cases* | `requirements-and-gap-analysis` | `docs/specs/spec.md` created, BR-1..BR-n drafted | This is the spec every later lab builds on. Keep it — don't let trainees discard it at day end. |
| 3:15–5:00 | AI-Powered Documentation — *Lab: Document a legacy system module* | `documentation-generation` | README/inline docs for the legacy module; optionally a proposed spec fragment inferred from that legacy code | If the legacy module is unrelated to the Day 1 spec, keep its inferred BR-IDs in a separate section — don't merge unrelated domains into one spec. |

## Day 2

| Time | Topic / Lab | Skill(s) | Artifact produced/updated | Carries forward as |
|---|---|---|---|---|
| 9:00–10:30 | AI-Driven Solution Design — *Lab: Design a case management microservice* | `architecture-and-solution-design` | `docs/specs/plan.md`: GORM domain classes, service methods, controller/GSP/JS split — traced to the Day 1 spec's BR-IDs | The plan drives every remaining lab's "which layer does this code belong in" question. |
| 10:45–12:30 | AI-Assisted Code Generation — *Lab: Build REST API endpoints with AI* | `code-generation-with-specs` + `EXAMPLE-FEATURE-PROMPTS.md` (hand out prompts 1-3) | `@Transactional` service methods + GORM domain classes implementing BR-IDs, thin controllers, plus their `"BR-n: ..."` Spock features (failing-then-passing) | Code + tests become the subject of the afternoon's review lab and Day 3's test-generation lab. |
| 1:30–3:00 | AI-Powered Debugging — *Lab: Debug complex multi-tier issues* | `debugging-and-error-recovery` | Root-cause classification (BR violation vs. spec gap vs. known Grails failure signature) + a new/updated `"BR-n: ..."` Spock feature proving the fix | Any spec gap found here feeds back into `docs/specs/spec.md` §3 as a new BR — update the change log (§7). |
| 3:15–5:00 | Enhanced Code Reviews with AI — *Lab: Review and improve legacy code* | `code-review-and-quality` | Completed `docs/standards/review-checklist.md` pass (incl. CodeNarc run, N+1/GSP-XSS checks) on the morning's generated code (and/or the Day 1 legacy module) | Findings here are exactly the input `defect-analysis-and-triage` uses on Day 3 if any finding was missed and later causes an incident. |

## Day 3

| Time | Topic / Lab | Skill(s) | Artifact produced/updated | Carries forward as |
|---|---|---|---|---|
| 9:00–10:30 | AI-Accelerated Test Planning — *Lab: Create comprehensive test plans* | `test-planning` | Test plan: one row per BR-ID, Spock unit vs. `@Integration` tier, edge cases, risk classification | Directly consumed by the next session. |
| 10:45–12:30 | Automated Test Case Generation — *Lab: Generate test suites for APIs* | `test-case-generation` | Concrete `"BR-n: ..."` Spock features + `where:` boundary test data, generated from the morning's plan | Closes the loop on Day 2's code-generation lab — confirms it actually has BR coverage, not just passing generic tests. |
| 1:30–3:00 | AI-Driven Defect Analysis — *Lab: Analyze production incidents* | `defect-analysis-and-triage` | Incident triaged to a specific BR-ID (or flagged as a spec gap) using stack traces/Grails failure signatures, regression-risk check across related BR-IDs | If a spec gap is found, `docs/specs/spec.md` gets a new BR — the spec is still growing on the last day. |
| 3:15–5:00 | Release Automation with AI — *Lab: Automate deployment workflows* | `release-automation-with-specs` | Release notes citing BR-IDs from the spec's change log; CI/deploy pipeline reviewed for full `./gradlew test codenarcMain codenarcTest` coverage and schema migrations | Closing artifact for the whole program — the spec's change log (§7) should now read as a full history of the week. |

## Facilitator note on gaps in the mapping

Rows 1–2 on Day 1 (AI Fundamentals, Prompt Engineering) don't have a
dedicated skill file — they're intentionally foundational and precede the
first spec. Don't force an SDD skill onto them; use them to set up
vocabulary (BR-ID, spec-first, persuasion vs. enforcement) that row 3
onward relies on.
