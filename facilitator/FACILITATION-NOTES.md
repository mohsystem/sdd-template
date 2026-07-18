# Facilitation Notes — Running SDD Without a Fixed Demo App

This kit deliberately ships no demo application (see `README.md`). These
notes cover the one thing that's genuinely harder without one: keeping a
*continuous* artifact (the spec) alive across labs that would otherwise be
disconnected exercises.

## The shared-scenario decision (make this call before Day 1)

Pick one:

- **Option A — Shared scenario.** Everyone works on the same fictional
  system for the whole 4 days — the Day 2 agenda's own lab title, "design a
  case management microservice," maps here to a standalone Grails
  application (a single deployable app, not literally a microservices
  architecture — "microservice" in the agenda just means "small, scoped
  system"). One spec per trainee/team, same scenario, so
  `AGENDA-SKILL-MAP.md` applies literally.
- **Option B — Bring your own.** Trainees each use a real (sanitized) legacy
  Grails module they work with day to day. More directly useful to them,
  but the facilitator can't rely on a shared example when demonstrating
  concepts live — demo on a throwaway example, let trainees apply the
  pattern to their own material.

Option A is simpler to facilitate and is assumed in the notes below; adapt
if you choose B.

### Environment prerequisite (either option)

Before Day 1's afternoon lab, every team needs a **buildable Grails project**
— `grails create-app` (or your org's Grails project template) with Spock
and CodeNarc already wired into `build.gradle`, `./gradlew test` and
`./gradlew codenarcMain` running clean on the empty scaffold. Requirements
Analysis (writing the spec) doesn't need this, but Solution Design on Day 2
does — don't let environment setup eat into Day 2 lab time.

Before Day 4, also add the [OWASP Dependency-Check Gradle
plugin](https://plugins.gradle.org/plugin/org.owasp.dependencycheck) to
`build.gradle` and confirm `./gradlew dependencyCheckAnalyze` runs (it can
be slow on first run while it builds its local CVE database — do this a
day ahead, not live in the lab).

## Day 1

- Morning (AI Fundamentals, Prompt Engineering): don't introduce BR-IDs or
  `docs/specs/` yet. Plant one sentence: "everything you do this week feeds
  one document that the AI reads before every change." That's the hook for
  the afternoon.
- Requirements Analysis lab: have every team copy
  `CLAUDE.md.template` → `CLAUDE.md` and
  `docs/specs/spec-template.md` → `docs/specs/spec.md` into their
  workspace *before* the lab starts, not as a lab step — it should already
  exist when the interview technique in `requirements-and-gap-analysis`
  kicks in.
- Documentation lab (legacy module): if using Option A, this is often best
  run as "document a *different*, unrelated legacy module" so trainees see
  documentation-generation applied to code with no spec at all, then compare
  it to the spec-first artifact from the morning.
- End of day: collect/checkpoint each team's `spec.md` — this is the asset
  Day 2 depends on.

## Day 2

- Solution Design lab: teams start from their own Day 1 spec. If a team's
  spec is thin, the design lab will surface the gaps fast — that's a
  feature, route them back to add BR-IDs before designing around a hole.
- Code Generation and Debugging labs: keep reinforcing "which BR does this
  serve" out loud, especially under the Day 2 time pressure — this is where
  the "quick fix, just do it here" pattern from `BR-5` (see
  `EXAMPLE-FEATURE-PROMPTS.md`) shows up naturally without needing to
  script it.
- Code Review lab: pair teams to review each other's Day 2 morning/midday
  output using `docs/standards/review-checklist.md` — peer review surfaces
  standards drift a self-review misses.

## Day 3

- Test Planning / Test Case Generation: run directly against each team's
  accumulated spec — by Day 3 it should have enough BR-IDs (including any
  added during Day 2 debugging) to make the exercise nontrivial.
- Defect Analysis lab: inject a synthetic "incident" per team if their spec
  has been too clean so far — deliberately violate one BR in a shared
  snippet and hand it out, so triage has something concrete to diagnose.
- Release Automation lab: close the loop — have each team read their own
  spec's change log (§7) start to finish as the closing exercise. This is
  the "one spec, one week" moment; make sure it's visible.

## Day 4

- Vulnerability Detection lab: run it against whatever the team built by
  end of Day 3 — Prompt 6 (`EXAMPLE-FEATURE-PROMPTS.md`) is the highest-value
  target if a team got to it; otherwise scan the earlier prompts' output.
  Don't hand out a separately-prepared "vulnerable sample file" — scanning
  code the trainees actually wrote lands harder than scanning a canned
  example.
- Secure Coding lab: if a team skipped Prompt 6 on Day 3, this is where
  they build it — same prompt, just later. Either way, the denial-path
  test (wrong role/no auth rejected) is the part teams skip under time
  pressure; check for it explicitly.
- Hardening lab: the dependency scan's first run is slow (building its
  local CVE database) — this should already be warmed up per the
  environment prerequisite above, or the lab loses 10+ minutes to a
  progress bar.
- Compliance & Auditing lab: push teams to fill `security-standard.md` §5
  with real links (a BR-ID, a test name, an actual CI run) rather than
  prose descriptions — a report with no working links is the exact failure
  mode `security-compliance-and-auditing` exists to prevent.

## Common facilitation pitfalls

- **Letting a team's spec go stale.** If a lab produces a code/design change
  with no corresponding spec update, stop and fix it in the moment — don't
  let "we'll update the spec later" become the norm, since later never
  comes and the throughline breaks for every subsequent lab.
- **Treating skills as slides.** These are meant to be pasted/pointed to
  during live prompting, not summarized verbally. Have trainees actually
  reference the skill file in their prompt.
- **Skipping the gap-analysis step on Day 1.** A spec that only covers the
  happy path will make every later lab too easy and less instructive. Budget
  time for the explicit gap-analysis pass in `requirements-and-gap-analysis`.
- **Accepting Grails scaffold defaults as "done."** `grails generate-controller`
  / `generate-all` produces controllers that `.save()`/mutate domain
  instances directly — exactly what `docs/standards/code-style.md`
  forbids. If a team scaffolds first, treat moving logic into the service
  layer as a required refactor before the Code Review lab, not an optional
  cleanup.
- **Security theater on Day 4.** Running a scan and reporting the count of
  findings isn't the lab — fixing them (with a proving test) and updating
  the compliance table with real evidence is. Watch for teams that treat
  `./gradlew dependencyCheckAnalyze` output as a deliverable in itself
  rather than a to-do list.
