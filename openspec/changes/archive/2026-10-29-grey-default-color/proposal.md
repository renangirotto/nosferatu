# Proposal

## Why

`Button`, `Accordion` and `Callout` default to `purple`, which makes every un-configured component a loud brand accent. A neutral grey is the better resting state. Rendering that default as `data-ui-color="purple"` also means the attribute rule declares the color properties on the element itself, so an un-colored instance cannot be themed from an ancestor (the Accordion docs have to warn about this). Defaulting through a CSS fallback instead keeps the markup free of an attribute nobody asked for.

## What Changes

- **BREAKING**: `Button`, `Accordion` and `Callout` render grey when `color` is omitted, not purple. A consumer who relied on the purple default must now pass `color="purple"`.
- **BREAKING**: with no `color` prop, the rendered element carries **no** `data-ui-color` attribute. A consumer's own `data-ui-color` is still dropped. Passing `color="grey"` explicitly still renders `data-ui-color="grey"`.
- The grey default lives in the component's CSS: each use of a component color property gets a `var()` fallback to the same grey `light-dark()` pairing that `color="grey"` sets (for example `background-color: var(--nf-button-color, light-dark(var(--nf-grey-l-40), var(--nf-grey-d-50)))`). An un-colored instance and a `color="grey"` instance look identical.
- Because nothing declares the color properties on an un-colored element, they can now be supplied from an ancestor for all three components. Accordion's "set them on the element, not an ancestor" caveat applies only once `color` is set.
- `color` stays optional and keeps its `ColorPalette` type; no hue is added or removed.
- This becomes the pattern for every component with a color prop: the `component-build` skill teaches it, replacing the `color = 'purple'` default in its worked example and carving the color default out of its "do not rely on a `var()` fallback" rule; the `component-doc` skill documents the default as `grey (unset)` with no attribute.
- Docs pages for the three components update their default, props table and theming prose.

## Non-goals

- No change to the palette, to any hue's step pairing, or to which tokens an explicit `color` uses.
- No new semantic token (no `--nf-color-default` or similar) — the fallback references grey palette tokens directly.
- No change to non-color props, interaction states, animation or layout.
- No `@property` registration of the component color properties.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `library-styles`: Button, Callout and Accordion content/color APIs — default becomes grey via CSS fallback and no `data-ui-color` is rendered without a `color` prop; Accordion's ancestor-theming scenario narrows to colored instances.
- `documentation-site`: the Accordion page's props/slot scenario (default `grey`, no attribute) and theming scenario (element-only caveat applies when `color` is set).
- `component-authoring-skills`: `component-build` and `component-doc` SHALL teach the unset-color fallback pattern.

## Impact

- `packages/ui/src/components/Button.astro`, `Accordion.astro`, `Callout.astro` — frontmatter default and color property use sites.
- `docs/src/content/docs/components/button.mdx`, `accordion.mdx`, `callout.mdx`.
- `.agents/skills/component-build/SKILL.md`, `.agents/skills/component-doc/SKILL.md`.
- Consumer-visible and breaking: published markup and default appearance change. Package is at `0.1.0`, so a minor bump carries it under semver's 0.x rules; flag it in the changelog.
