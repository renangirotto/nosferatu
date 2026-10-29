# Design

## Context

Today each color-variant component destructures `color = "purple"`, always renders `data-ui-color`, and resolves its color properties only inside `&[data-ui-color="…"]` rules. Use sites read the properties bare (`background-color: var(--nf-button-color)`), as `component-build` requires ("Declare a property, do not rely on a `var()` fallback"). See proposal.md for why the default moves to grey.

## Goals / Non-Goals

**Goals:**
- An uncolored instance renders no `data-ui-color` and looks exactly like `color="grey"`.
- One pattern, written once in `component-build`, that every color-variant component follows.

**Non-Goals:**
- Removing the `[data-ui-color="grey"]` rule. Explicit grey keeps its rule so it behaves like every other hue (declared on the element, beats an inherited value).

## Decisions

### Grey lives in a `var()` fallback at each use site

```css
background-color: var(--nf-button-color, light-dark(var(--nf-grey-l-40), var(--nf-grey-d-50)));
color: var(--nf-button-accent-color, light-dark(var(--nf-grey-l-80), var(--nf-grey-d-90)));
```

Frontmatter drops the default (`color` stays `undefined`), and Astro omits an attribute whose value is `undefined`, so `data-ui-color={color}` needs no conditional.

The fallback uses the **same steps as the component's own grey rule**, not the `--nf-grey-d-10` in the request's example: that example was single-scheme and would make the default differ from `color="grey"`. Each component copies its own grey pairing — Callout's four properties fall back to its 25%-tier grey tokens, Accordion and Button to `l-40/d-50` and `l-80/d-90`.

Alternatives considered:
- *Declare the grey values on the root class* (`.nf-button { --nf-button-color: … }`). Rejected: it declares the property on the element, so ancestor theming of an uncolored instance would stop working — the opposite of what this change gains — and it is what the request explicitly ruled out.
- *A private default property* (`--nf-button-default-color`) referenced as the fallback. Fewer repeated literals, but it adds a new name to each component's custom-property surface, which the spec treats as public API. Rejected for now; the repetition is two values × a handful of use sites per component.
- *`@property` with `inherits: false`*. Rejected: registration is global, `initial-value` cannot be a `light-dark()`/`var()` expression, and it would also kill ancestor theming.

### Callout's composed shadow carries the fallback inside it

`--nf-callout-shadow` is declared on the root as `var(--nf-shadow-depth) var(--nf-callout-shadow-color)`. The fallback goes inside that declaration — `var(--nf-callout-shadow-color, light-dark(var(--nf-grey-l-70-25), var(--nf-grey-d-90-25)))` — so the composition is still written once. `--nf-callout-shadow` itself is always declared and needs no fallback.

### `component-build` gets one named exception to its no-fallback rule

The rule exists because a fallback hides a resting value at a use site and two sites can drift. The color default is the case where a fallback is the *point*: declaring the value would put it on the element and defeat inheritance. The skill states this as the sole exception, requires the fallback to equal the component's own `grey` rule, and keeps the rule for everything else (depth, widths, durations).

### Theming docs are corrected, not just extended

Button's and Callout's docs (and the Button/Callout spec scenarios) currently say to set the color properties on an **ancestor**. For an instance that has `data-ui-color`, that is wrong: the attribute rule declares them on the element and beats inheritance — Accordion's docs already say so. After this change the accurate statement for all three is: an uncolored instance takes them from an ancestor; a colored one needs them on the element (`style`). The spec deltas and docs tasks encode this.

## Invariants

- Upholds **2** (colors only from palette tokens; no `--nf-color-*`), **3** (no specificity raised; the default path adds *no* selector at all), **5** (scoped styles, `var(--nf-*)` only).
- Bends a `component-build` convention (no `var()` fallbacks), not a spec invariant — recorded above.

## Risks / Trade-offs

- [A default instance nested inside a colored instance of the **same** component inherits the outer hue — e.g. an uncolored `Accordion` inside a `color="green"` `Accordion`'s content, or a `Callout` inside a `Callout`.] → Accepted as the cost of ancestor theming; documented on each page. A consumer who wants grey there passes `color="grey"`.
- [Breaking: default appearance and markup change.] → Called out in the proposal; package is `0.1.0`, so a minor bump with a changelog note.
- [Repeated fallback literals can drift from the grey rule.] → `component-build` requires them to match; the "explicit grey matches the default" scenario is the browser check.
