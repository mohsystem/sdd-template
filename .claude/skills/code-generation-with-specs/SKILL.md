---
name: code-generation-with-specs
description: Use when implementing a feature against BR-IDs instead of generic prompts, keeping generated code traceable to the spec.
phase: Build
---

# Code Generation with Specs

## Why

The same prompt ("build a REST endpoint for X") produces different code
depending on whether the assistant has a spec to follow. Without one, it
reaches for generic, plausible-looking conventions — sometimes yours,
sometimes not. With one, every generated function has a reason to exist that
a reviewer can check.

## Technique

1. **Cite the BR-ID in the prompt, not just the feature name.** Instead of
   "add a checkout endpoint," say "implement BR-1 and BR-2 from
   `docs/specs/spec.md` in `CustodyService`." This anchors the assistant to
   the actual rule text, not your paraphrase of it.
2. **Write the failing Spock feature first** (see `test-case-generation` /
   `docs/standards/testing-methodology.md`), named `"BR-n: ..."`, before
   asking for the implementation. This is non-negotiable in the SDD loop —
   it's the step most likely to get skipped under time pressure.
3. **Implement in the layer the plan designated.** Point the assistant at
   `docs/specs/plan.md` §4 (layering rule) so generated code lands in the
   `@Transactional` service method or a GORM `constraints` entry, not the
   controller — this is exactly the pressure point `BR-5` in the reference
   deck exists to test. Controller actions should stay 3-6 lines: bind a
   command object, call one service method, `respond`.
4. **Ask for `@CompileStatic` and Groovydoc citing the BR-ID** on any new
   service method — both are part of "done," not optional polish.
5. **For JSON endpoints, confirm the 422 error path**, not just the happy
   path — ask specifically: "what does the response look like when BR-n is
   violated, and does it match `docs/specs/spec.md` §4's error shape?"
6. **Ask for the diff to be narrated against the spec**, not just produced:
   "which BR(s) does this satisfy, and how." If the assistant can't answer,
   the code probably doesn't actually satisfy them yet.

## Example prompt

See `EXAMPLE-FEATURE-PROMPTS.md` at the kit root for six ready-to-use,
concrete prompts (not bracketed placeholders) built on this exact pattern —
use those directly. The template below is for writing new ones against a
different domain.

> "Implement BR-[n] from `docs/specs/spec.md` in `[ServiceName]`, following
> the layering in `docs/specs/plan.md` — service method only,
> `@Transactional` if it mutates state, controller stays a thin
> bind/call/respond. Write the failing Spock feature `\"BR-[n]: ...\"`
> first, then the implementation, including the 422 JSON error path. Run
> `./gradlew test codenarcMain codenarcTest`. When done, tell me exactly
> which BR-ID(s) this change satisfies and how."
