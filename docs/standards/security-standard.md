# Security Standard — Grails / Groovy

Shared reference for security work. The 4 security skills in
`.claude/skills/` each point here instead of repeating this content —
read the relevant table below when a skill's prompt tells you to.
GSP output-encoding and CSRF rules already live in `code-style.md` — not
duplicated here.

## 1. OWASP Top 10, mapped to this stack

| OWASP category | Grails-specific manifestation | Control |
|---|---|---|
| A01 Broken Access Control | Missing role check in a controller/service action | Spring Security `@Secured`/`@PreAuthorize` on the service method, never only hidden in GSP |
| A02 Cryptographic Failures | Plaintext or weakly-hashed passwords | Spring Security Core's `bcrypt` password encoder; never roll your own hashing |
| A03 Injection | String-concatenated HQL/SQL (`executeQuery("...${input}...")`) | GORM criteria/`where{}` DSL only — params are always bound, never interpolated |
| A04 Insecure Design | A business rule enforced only client-side (GSP/JS) | Server-side enforcement in the service layer is mandatory; see `code-style.md` layering rule |
| A05 Security Misconfiguration | Debug/stack-trace pages, verbose errors in prod `application.yml` | `grails.config.environments.production` disables detailed error pages; verify before release |
| A06 Vulnerable Components | Outdated Grails plugin/Gradle dependency with a known CVE | `./gradlew dependencyCheckAnalyze` (see §2) before every release |
| A07 Auth Failures | No lockout/rate-limit on login, session fixation | Spring Security Core defaults handle most of this — don't disable them for "convenience" |
| A08 Data Integrity Failures | Unsigned/unverified deserialization, unpinned dependency versions | Pin dependency versions in `build.gradle`; avoid Java native deserialization of untrusted input |
| A09 Logging Failures | Secrets or PII logged in plaintext; no audit trail for sensitive actions | Never log request bodies containing credentials; see `defect-analysis-and-triage` skill for audit-log expectations |
| A10 SSRF | Server-side HTTP calls built from unvalidated user input | Allowlist target hosts; never pass a raw user-supplied URL to an HTTP client |

## 2. Dependency vulnerability scanning

```bash
./gradlew dependencyCheckAnalyze
```

Add the [OWASP Dependency-Check Gradle plugin](https://plugins.gradle.org/plugin/org.owasp.dependencycheck)
to `build.gradle` if not already present. Treat any `HIGH`/`CRITICAL`
finding as a release blocker (see Hook Pattern 8 in `HOOKS-REFERENCE.md`) —
`MEDIUM` findings get triaged, not auto-blocked.

## 3. Secrets management

- No credentials, API keys, or connection strings in `application.yml`,
  `.groovy` source, or GSP — externalize via environment variables
  (`${MY_SECRET:defaultOnlyForLocalDev}` in Grails config) or a secrets
  manager.
- Rotate anything that appears in git history, even after removal —
  history persists.
- The secret-scan hook (Pattern 9 in `HOOKS-REFERENCE.md`) blocks commits
  containing common credential patterns; it is a safety net, not a
  substitute for not writing secrets in the first place.

## 4. Authentication and authorization

- Use Spring Security Core (the standard Grails plugin) rather than
  hand-rolled session/token handling.
- Authorization checks belong in the service layer
  (`@PreAuthorize("hasRole('SUPERVISOR')")` or equivalent), never only as a
  hidden UI element — this is the same layering discipline as any other
  business rule (see `code-style.md` and `EXAMPLE-FEATURE-PROMPTS.md`
  Prompt 4).
- When a security requirement is genuinely a business rule (e.g. "only
  supervisors can release an item from maintenance"), give it a BR-ID in
  `docs/specs/spec.md` like any other rule — don't invent a parallel ID
  scheme for rules that belong in the spec.

## 5. Compliance mapping and audit reports

For compliance auditing, map each control a regulator/standard requires
to concrete evidence in this repo:

| Requirement | Control in this repo | Evidence |
|---|---|---|
| [e.g. "access to sensitive records is role-restricted"] | Spring Security `@PreAuthorize` on `[Service.method]` | The BR-ID in `docs/specs/spec.md`, its Spock feature, and the CI run that passed it |
| [e.g. "dependencies are scanned for known vulnerabilities"] | `./gradlew dependencyCheckAnalyze` in CI | Latest scan report artifact + release notes entry (see `release-automation-with-specs`) |

An audit report is this table filled in, with links to real evidence — not
a narrative document written from memory.
