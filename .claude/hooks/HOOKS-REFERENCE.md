# Hooks Reference — Grails / Groovy / GSP

These are close to copy-pasteable `.claude/settings.json` hook entries for a
Grails project — the only per-project placeholders are paths/class names.
Hooks are SDD's Layer 5 — enforcement, not persuasion: a failed hook blocks
the edit instead of just guiding it. **Verify each one actually fires**
after wiring it into a real repo (run a trivial edit and confirm the
command runs) — a hook that silently doesn't run is worse than no hook.

Patterns 2, 5, and 6 ship with real, runnable scripts in this directory
(`run-affected-spec.js`, `controller-mutation-guard.js`,
`check-br-commit.js`) — not just described in prose. Patterns 1, 3, 4, and
7 are single-line commands you paste directly into `settings.json`.

## Pattern 1 — CodeNarc on changed files

Fires after an edit to a `.groovy` file; fails the edit if CodeNarc reports
violations.

```jsonc
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "case \"$FILE_PATH\" in *.groovy) ./gradlew codenarcMain codenarcTest -PtargetFile=\"$FILE_PATH\" ;; esac",
        "description": "CodeNarc-lint the changed Groovy file; non-zero exit blocks the edit"
      }
    ]
  }
}
```

If the project's `build.gradle` doesn't support a `-PtargetFile` filter,
fall back to running the full `codenarcMain codenarcTest` task — slower,
but still correct; consider scoping CodeNarc rule sets per-module to keep
it fast enough to run on every edit.

## Pattern 2 — Run only the affected Spock spec

Fires after an edit; maps the changed file to its corresponding Spock spec
by Grails' own naming convention and runs just that one, not the whole
suite (fast enough to actually get used).

```jsonc
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "node .claude/hooks/run-affected-spec.js \"$FILE_PATH\"",
        "description": "Run the Spock spec matching the changed file; non-zero exit blocks the edit"
      }
    ]
  }
}
```

`run-affected-spec.js` (in this directory) implements the mapping:

```
grails-app/services/.../FooService.groovy    -> ./gradlew test --tests "*FooServiceSpec"
grails-app/controllers/.../FooController.groovy -> ./gradlew test --tests "*FooControllerSpec"
grails-app/domain/.../Foo.groovy              -> ./gradlew test --tests "*FooSpec"
```

**If no spec with that name exists yet, the Gradle `--tests` filter fails
with "no tests found" — treat that as intentional, not a bug.** It's the
mechanism that enforces "write the failing test before the implementation"
(step 3 of the SDD loop): the hook simply can't run a test that doesn't
exist yet, so it fails loudly instead of silently passing.

This depends entirely on `docs/standards/testing-methodology.md`'s naming
rule (`"BR-n: ..."` Spock feature labels, `<Domain><Layer>Spec` class names)
being followed — without consistent naming, there's nothing for the hook
to find.

## Pattern 3 — GSP/JS safety check

Fires on any changed `.gsp` or `.js` file under `grails-app/`; fails the
edit on likely security regressions.

```jsonc
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "case \"$FILE_PATH\" in *.gsp) grep -nE 'encodeAsRaw\\(\\)|\\.raw\\(' \"$FILE_PATH\" && exit 1 || exit 0 ;; *) exit 0 ;; esac",
        "description": "Block GSP edits that introduce raw/unencoded output without review"
      }
    ]
  }
}
```

Treat a grep hit as a prompt to have a human confirm the `raw()`/
`encodeAsRaw()` call is genuinely safe (e.g. rendering trusted, sanitized
HTML) rather than an automatic hard fail — adjust the exit code logic to
your team's risk tolerance. A stricter variant can also grep for inline
`<script>` blocks containing more than a single `asset:javascript` include.

## Pattern 4 — Doc-sync reminder

Fires when a controller or `UrlMappings.groovy` changes; doesn't block, but
surfaces a reminder to update `docs/specs/spec.md` §4 and the README's
endpoint table.

```jsonc
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "case \"$FILE_PATH\" in *Controller.groovy|*UrlMappings.groovy) echo '[reminder] Endpoint changed — update docs/specs/spec.md API contract table and README.' ;; esac",
        "description": "Non-blocking reminder to keep the API contract in sync"
      }
    ]
  }
}
```

## Pattern 5 — Controller mutation guard

Fires after an edit to a `*Controller.groovy` file; mechanizes the
layering rule in `docs/standards/code-style.md` (business-rule mutation
belongs in an `@Transactional` service, never the controller) instead of
leaving it to review alone. This is exactly the pressure point `BR-5` in
this kit's example domain exists to test (see `EXAMPLE-FEATURE-PROMPTS.md`)
— now enforced, not just documented.

```jsonc
// .claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "node .claude/hooks/controller-mutation-guard.js \"$FILE_PATH\"",
        "description": "Block controller edits that mutate domain state directly"
      }
    ]
  }
}
```

`controller-mutation-guard.js` (in this directory) greps the changed
controller for `.save(`, `.delete(`, and direct status-field assignment.
It's a heuristic, not a parser — it will have false positives (e.g. a
legitimate test fixture in the same file). Treat a failure as "have a
human look at this," and tune the patterns in the script to your codebase
rather than trusting it blindly.

## Pattern 6 — BR-ID commit message gate

Fires before a `git commit` runs; blocks it if staged changes touch
`grails-app/services/` or `grails-app/domain/` but the commit message
doesn't cite a BR-ID. Mechanizes the traceability rule in
`CLAUDE.md.template` ("commits that implement or fix a BR cite its ID").

```jsonc
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "node .claude/hooks/check-br-commit.js",
        "description": "Require a BR-ID in commit messages touching service/domain code"
      }
    ]
  }
}
```

`check-br-commit.js` reads the tool call as JSON from stdin (Claude Code's
`PreToolUse` convention), extracts the `-m "..."` message from any `git
commit` command, and checks `git diff --cached --name-only` for
service/domain files. Exits `2` (blocking) if the layer is touched but no
`BR-\d+` pattern is found in the message. A refactor with genuinely no BR
should state that explicitly in the message rather than being silently
waved through.

## Pattern 7 — Full verification gate (Stop hook)

Fires once, at the end of the session; doesn't block individual edits but
gives a final pass/fail signal before the trainee (or facilitator) treats
the session's work as done.

```jsonc
// .claude/settings.json
{
  "hooks": {
    "Stop": [
      {
        "command": "./gradlew test codenarcMain codenarcTest",
        "description": "Full test + lint run before ending the session"
      }
    ]
  }
}
```

Slower than the per-edit hooks above by design — it's meant to catch
anything the fast, file-scoped hooks missed (e.g. a test broken by a
change in a different file than the one that triggered Pattern 2). Good
moment for a facilitator to point out: "the fast hooks kept you moving;
this one is the actual gate before you call it finished."

## Ordering

Recommended order for `PostToolUse` hooks: CodeNarc first (fastest, catches
style issues before running tests), controller mutation guard second (also
fast, no test run), affected Spock spec third, GSP/JS safety check fourth
(only relevant on frontend files), doc-sync reminder last (non-blocking, so
it shouldn't gate anything ahead of it). The BR-commit gate is a
`PreToolUse` hook on `Bash`, independent of this ordering. The full
verification gate is a `Stop` hook and runs once, at session end.

## Verifying each hook actually fires

Before trusting any of these in a lab, prove each one blocks what it claims
to, on purpose:

| Hook | Trigger a failure by... | Expect |
|---|---|---|
| CodeNarc (1) | Adding an obvious style violation (e.g. an unused import) to a `.groovy` file | Edit blocked, CodeNarc output shown |
| Affected Spock spec (2) | Editing a service method with no matching `*Spec.groovy` yet | Edit blocked, "no tests found" |
| GSP/JS safety (3) | Adding `${something.encodeAsRaw()}` to a `.gsp` file | Edit blocked, grep hit shown |
| Doc-sync reminder (4) | Editing any `*Controller.groovy` | Reminder printed, edit NOT blocked |
| Controller mutation guard (5) | Adding `equipment.save()` to a controller action | Edit blocked, violation listed |
| BR-commit gate (6) | `git commit -m "fix stuff"` after staging a service change | Commit blocked, exit code 2 |
| Full verification (7) | Ending a session with a failing test | Stop hook output shows the failure |

If a hook doesn't fire when it should, or blocks something it shouldn't,
fix the hook before the lab — a hook that silently misses its target
teaches the opposite lesson from the one intended.
