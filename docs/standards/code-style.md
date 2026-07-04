# Code Style Standard — Grails / Groovy / GSP / JavaScript

## Layering (Grails MVC)

- Business-rule logic lives **only** in `grails-app/services/**Service.groovy`,
  methods annotated `@Transactional` when they mutate state.
- `grails-app/controllers/**Controller.groovy` only: bind/validate input
  (via a command object, not raw `params`), call one service method,
  `respond`/`render` the result. A controller action should read as
  3-6 lines. If you find a BR-ID's logic sitting in a controller — a
  `.save()`, a status assignment, an `if` branch implementing a rule — that
  is a standards violation regardless of how small the change was.
- `BR-5` in this kit's example domain (see `EXAMPLE-FEATURE-PROMPTS.md`)
  exists specifically to catch "quick fix, just do it in the controller"
  requests — expect the same pressure in these labs and hold the line the
  same way.
- GORM domain classes (`grails-app/domain/**.groovy`) hold `constraints` and
  `mapping` only — no business methods beyond simple derived/computed
  properties (e.g. a `getOverdue()` GString-free boolean getter is fine; a
  method that sends a notification is not).

```groovy
// GOOD — CustodyController.groovy
def checkout(CheckoutCommand cmd) {
    if (cmd.hasErrors()) {
        respond cmd.errors, view: 'checkout'
        return
    }
    def result = custodyService.checkout(cmd.officerId, cmd.itemId, cmd.dueAt)
    respond result.record, status: result.created ? CREATED : UNPROCESSABLE_ENTITY
}

// BAD — logic and mutation in the controller
def checkout() {
    def item = Equipment.get(params.itemId)
    if (item.status == 'ASSIGNED') {
        render(status: 422, text: 'already assigned')
        return
    }
    item.status = 'ASSIGNED'   // BR-2 enforcement belongs in CustodyService
    item.save()
}
```

## Naming

- Domain classes: singular `PascalCase` nouns (`CustodyRecord`, not
  `CustodyRecords`). Services: `<Domain>Service`. Controllers:
  `<Domain>Controller`. Command objects: `<Action><Domain>Command`
  (`CheckoutCustodyCommand`).
- A service method enforcing a specific BR should make that traceable —
  cite the BR-ID in the method's Groovydoc (`@see BR-2`) or an adjacent
  comment. Don't make a reviewer hunt through the spec to find out why a
  branch exists.
- Groovy: prefer `@CompileStatic` on services where feasible for both
  performance and earlier error detection; drop to dynamic only where GORM
  criteria/DSL usage requires it, and note why.

## Constants and magic values

- No unexplained literals in business-rule logic (durations, thresholds,
  status strings). Name them as `static final` constants on the owning
  service or domain class, and if the value came from a spec ("24-hour
  grace period"), say so in the constant's name (`GRACE_PERIOD_HOURS = 24`)
  or an adjacent comment citing the BR-ID.
- GORM `inList` constraints should reference the same constant list the
  service uses for status values — don't duplicate the literal string list
  in two places.

## Error handling

- BR violations `respond` with HTTP 422 and a JSON body identifying which
  BR failed (see `docs/specs/spec-template.md` §4). Don't collapse distinct
  BR violations into one generic error — the JS layer and the Spock suite
  both need to distinguish them by `error` code.
- Never let a GORM `ValidationException` or generic `Exception` leak to the
  client as a raw stack trace; catch at the service boundary and translate
  to the structured error shape.

## Frontend: GSP + vanilla JavaScript

- No inline `<script>` blocks containing logic — JS lives in
  `grails-app/assets/javascripts/<feature>.js`, loaded via the asset
  pipeline (`asset-pipeline` `require` comments or `<asset:javascript>`).
  Inline `onclick="..."` attributes are not allowed; attach listeners in
  the JS file.
- All dynamic data interpolated into a GSP page is auto-encoded by default
  (`${...}`) — never call `.encodeAsRaw()` / `raw()` on user-supplied or
  BR-relevant data without a one-line comment explaining why it's safe.
- Semantic HTML5 elements first (`<nav>`, `<main>`, `<table>`, `<form>`) —
  don't reach for `<div>`/`<span>` soup when a semantic element exists.
  Forms use Grails' CSRF-protected `<g:form>` (or an equivalent hidden
  `_csrf` field on manually-written forms posting via `fetch()`).
- JS talking to JSON endpoints uses `fetch()` with the CSRF token read from
  a `<meta>` tag or hidden field — never disable Grails' CSRF protection to
  make a fetch call simpler.
- No JS framework/bundler assumed. Keep functions small, avoid global
  variables (wrap feature scripts in an IIFE or ES module), and prefer
  `const`/`let` over `var`.

## What a reviewer checks against this file

See `docs/standards/review-checklist.md` — every item there traces back to a
rule in this file or in `testing-methodology.md`.
