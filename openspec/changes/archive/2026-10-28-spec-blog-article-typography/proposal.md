# Proposal

## Why

`library-layouts` requires that `BlogArticle` "declare no visual styles of its own, and define no custom properties", and the docs page repeats that claim in prose. The shipped [BlogArticle.astro](../../../packages/ui/src/layouts/BlogArticle.astro) does the opposite: it declares a scoped `<style>` block that defines eleven custom properties and sizes `h1`–`h4` and `p` from a fluid type scale. Consumers are being told the layout ships nothing while it ships a typography system, and the spec that is supposed to be the source of truth cannot be used to review the file. The drift also leaves the next layout with no stated rule about whether it may style anything at all.

This change closes the gap in the direction of the implementation — the fluid typography is wanted — while fixing the one thing about it that is genuinely wrong: the property names.

## What Changes

- Replace the `library-layouts` requirement "Layouts carry no visual styling of their own yet" with a general rule: a layout MAY ship scoped styles, under the same constraints a component obeys — scoped `<style>` only, design values through `--nf-*` properties, and no selector reaching outside its own markup.
- Specify `BlogArticle`'s fluid typography as behaviour: a viewport-interpolated base font size between two bounds, a type scale that interpolates alongside it, and `h1`–`h4` and `p` sized from them, with every input exposed as an overridable custom property.
- **BREAKING** for anyone already overriding the layout's properties: rename the eleven custom properties from the generic `--nf-fluid-*`, `--nf-fs-*` and `--nf-h1`–`--nf-h4` to the convention-compliant `--nf-layout-blog-article-*`. Generic names on a layout's public surface collide with a consumer's own properties and with any future library token of the same name; `--nf-h1` in particular reads as a global heading token the library does not have. No visual change, no markup change, no prop change.
- Correct the docs page's Styling section, which currently states the layout ships no styles, and document the theming surface with the new names.

## Capabilities

### New Capabilities

<!-- None. -->

### Modified Capabilities

- `library-layouts`: the blanket "no visual styling" requirement is replaced by a styling allowance for layouts plus a requirement describing `BlogArticle`'s fluid typography and its overridable properties.
- `documentation-site`: the layouts-documentation requirement stops asserting a layout is unstyled and instead requires each layout page to state what it styles and list the properties a consumer can override.

## Non-goals

- No change to the fluid typography's visual result. The bounds (`560px`/`1088px`), the base size (`1rem` growing by `0.125rem`), the scale (`1.2` → `1.414`) and the exponents (`3`, `2.5`, `2`, `1.5`) all keep their current values; only the property names change.
- No new tokens in `tokens.css`. The fluid bounds and the scale ratios have no counterpart in the token set, and adding a typography-token family is a `library-styles` change with its own tradeoffs.
- No change to `BlogArticle`'s markup, props, slots or head — that is `add-html-base-components`.
- No styling for any other layout, and no retro-fit of the type scale into components.
- No `progress()` fallback implementation; its browser support is recorded as a risk and in the spec, not worked around here.

## Impact

- `packages/ui/src/layouts/BlogArticle.astro` — the `<style>` block only: eleven property renames, same values, same selectors.
- `docs/src/content/docs/layouts/blog-article.mdx` — the Styling section is rewritten; it currently tells consumers something untrue.
- Consumers: a page that overrode `--nf-h1` or `--nf-fluid-vmax` on the layout silently loses that override and falls back to the default. The library is pre-1.0 and the properties were never documented — they are absent from the docs page and from the spec — so the exposure is small, but it is a real break and belongs in the release notes.
- Ordering: this change is written against the state of the repository **after** `add-html-base-components` is applied. Both modify the `documentation-site` requirement "Layouts are documented"; this one's delta includes that change's scenarios so the two reconcile. Apply `add-html-base-components` first.
