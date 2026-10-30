# Design

## Context

See [proposal.md](proposal.md) — Why. Three facts shape the approach:

1. `Callout` already separates its shadow color from its accent, through `--nf-callout-shadow-color`, and composes the full shadow in `--nf-callout-shadow` from `var(--nf-shadow-depth)` plus that color. `Button` and `Accordion` do not: each repeats one `var(--nf-<component>-accent-color, light-dark(…))` expression in three places — `color`, `box-shadow` and the `:focus-visible` outline — with the grey pairing written inline as the `var()` fallback.
2. Those inline fallbacks are what makes an uncolored `Button` identical to `color="grey"` without a `:not([data-ui-color])` rule. The pattern has to survive the split, because `Button color API` requires the two to be indistinguishable.
3. The palette edit is already in the working tree. `colors-dark.css` and `colors-light.css` carry the re-anchored grey; the spec and docs do not. This change has no palette code to write — only spec and docs to reconcile.

## Goals / Non-Goals

**Goals:**

- Give `Button` and `Accordion` the property shape `Callout` already has, so all three components expose their shadow color as its own `--nf-<component>-shadow-color`.
- Keep the light scheme pixel-identical, so the only visual delta on upgrade is in dark mode plus the accordion's summary weight.
- Describe the corrected grey ramp once, in `Grey palette ramp`, and have the docs restate exactly those numbers.

**Non-Goals:**

- Introducing a `--nf-button-shadow` / `--nf-accordion-shadow` composed property to mirror `--nf-callout-shadow`. `Callout` needs one because its depth comes from `--nf-shadow-depth` whole; `Button` and `Accordion` animate their depth through `--nf-<component>-depth` and so must keep writing `0px var(--nf-<component>-depth) 0px <color>` inline.
- Collapsing the repeated `light-dark()` fallbacks into a shared property. It would need a rule that matches the element without a `data-ui-color`, which costs specificity the cascade-layer invariant does not want spent.

## Decisions

### Name the new property `--nf-<component>-shadow-color`

Chosen over `--nf-button-depth-color` or `--nf-button-accent-shadow-color`. `Callout` has already set the precedent with `--nf-callout-shadow-color` for exactly this role, and `Component class and property naming` requires the component's full name plus a role. Reusing the established role word means a consumer who has themed one component can guess the others.

Rejected: keeping one property and introducing a modifier such as `--nf-button-shadow-step`. Steps are not values a component can compute — there is no `--nf-<hue>-<scale>-<step>` indirection in CSS — so the "step" would have to be a whole color anyway.

### Declare the shadow color per hue, alongside the other two

Each `&[data-ui-color="<hue>"]` block gains a third declaration rather than deriving the shadow from the accent. There is no way to say "one step lighter" in CSS without `color-mix()` or a relative color, and `Shadow tokens` already establishes that the library writes values out literally rather than computing them, so no `color-mix()` support is required. This keeps the nine blocks symmetrical and greppable, at the cost of nine more lines per component.

### Keep the inline `light-dark()` fallback pattern

Every `var(--nf-<component>-shadow-color, light-dark(…))` carries the grey pairing as its fallback, exactly as the accent does today. This is what satisfies `Explicit grey matches the default` without a new selector, and it is the only mechanism that works when a consumer sets the property on an ancestor.

### The focus outline follows the accent, not the shadow

The outline exists to mark the focused control against its own fill; it is a text-weight mark, not a depth cue. Binding it to `--nf-button-accent-color` keeps it at the contrast the label has. This is stated explicitly in both appearance requirements so it cannot be "tidied" into the shadow property later.

### Light keeps `l-80` for both roles

The user's instruction covers dark only, and the light scheme's `l-80` already reads correctly against the `l-40` fill. The property still exists in light, so a consumer can split it there themselves; the library simply resolves both to the same token. Recorded because an implementer looking at the dark values will be tempted to make light symmetrical.

### `Callout` moves one step, nothing else

`d-90-25` → `d-80-25` brings `Callout`'s dark shadow onto the same step as `Button`'s and `Accordion`'s, so all three components' shadows sit at `-d-80` in dark, differing only in the opacity tier. The `Shadow pairs with the surface step` scenario is reworded to the new pairing rather than deleted — the principle (the shadow is a darker tint of the panel) still holds at `d-80`.

### The grey spec records the anchor as exact, not as a rounding

The old wording called `oklch(0.29 0.02 277.5)` "the rounding of `#282A36`", which was the bug in prose form: it renders `#292B35`. The new wording states that `oklch(0.2882 0.0221 277.51)` _is_ `#282A36`, and a scenario checks for zero channel drift. `--nf-grey-d-10` stays described as a rounding, because at two decimals of lightness it genuinely is one (`#F8F8F8` against `#f9f9f9`).

### Chroma is described as peaking at the anchor

The ramp is no longer monotonic in chroma across all twenty steps — it rises to `0.0221` at step `100` and tapers to `0.0111` at `200`. That was true before the re-anchor too, but the old text only said "rises with the step" in the first paragraph and left the taper implicit. The requirement now says it outright, so a future reader does not "fix" the taper.

## Risks / Trade-offs

- **A consumer who themed `--nf-button-accent-color` silently loses control of the shadow** → This is the breaking part and cannot be mitigated in CSS: a `var()` fallback chain that read the accent when the shadow property is unset would re-couple the two and defeat the change. It is called out as **BREAKING** in the proposal, both component docs pages gain the third property in their theming section, and the archive summary should flag the major bump.
- **The shadow at `-d-80` has less contrast against the `-d-50` fill than `-d-90` had** → That is the intent — the raised edge should read as depth, not as a second label. Verified by eye in the docs' dark mode across all nine hues before the change is called done.
- **The re-anchored grey shifts every neutral surface in the docs site very slightly** → The shift is sub-perceptual except at step `100`, where it corrects a one-channel error. The docs' own theming reads the tokens by name, so nothing needs re-tuning; a visual pass over the palette page is enough.
- **The spec and the source could drift again if only one is edited** → The tasks put the spec reconciliation and the docs table in the same change as the component work, and the verification task re-reads the palette files against the requirement's number lists.

## Migration Plan

For a consuming project, upgrading is a version bump with no code change required. Only a consumer who set `--nf-button-accent-color` or `--nf-accordion-accent-color` expecting it to colour the shadow needs to act: they add `--nf-button-shadow-color` / `--nf-accordion-shadow-color` with the same value to restore the old appearance. There is no deprecation window and no shim, because the library ships source and a shim would have to live in every consumer's compiled CSS.
