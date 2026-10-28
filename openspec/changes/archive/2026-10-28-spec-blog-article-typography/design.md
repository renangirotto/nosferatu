# Design

## Context

The `<style>` block in [BlogArticle.astro](../../../packages/ui/src/layouts/BlogArticle.astro) builds a fluid type scale out of eleven custom properties on `.nf-layout-blog-article`:

```css
--nf-fluid-vmin: 560px;
--nf-fluid-vmax: 1088px;
--nf-fluid-progress: progress(100svw, var(--nf-fluid-vmin), var(--nf-fluid-vmax));
--nf-fs-base: calc(1rem + var(--nf-fluid-progress) * 0.125rem);
--nf-fs-type-scale-small: 1.2;
--nf-fs-type-scale-large: 1.414;
--nf-fs-type-scale: calc(small + progress * (large - small));
--nf-h1 … --nf-h4: calc(var(--nf-fs-base) * pow(var(--nf-fs-type-scale), n));
--nf-fs-p: var(--nf-fs-base);
```

Two CSS features carry it: `progress(100svw, min, max)`, which yields a 0–1 number clamped at both ends, and `pow()`. Nesting under `.nf-layout-blog-article` keeps the `h1`–`h4` and `p` rules scoped both by Astro's component scope and by the hook class.

Nothing about this is in `openspec/specs`. The requirement that is there — "Layouts carry no visual styling of their own yet" — says the opposite, and the docs page's Styling section repeats it in prose.

## Goals / Non-Goals

**Goals:**

- `openspec/specs/library-layouts/spec.md` describes the layout that actually ships, so the spec can be used to review the file.
- A stated rule for whether a layout may style anything, applying to the next layout as well as this one.
- The theming surface follows the library's property-naming convention and is documented.

**Non-Goals:**

- Changing any rendered size. This is a rename plus a spec and docs correction.
- Tokenising the fluid bounds or the scale ratios.
- Anything about `BlogArticle`'s markup, props or head.

## Decisions

### Spec catches up with the code, not the other way round

The alternative — deleting the `<style>` block to satisfy the existing requirement — would throw away working fluid typography that was added deliberately in the layout's own change, and would leave `BlogArticle` rendering at browser defaults. The requirement was written as "…of their own **yet**", i.e. as a placeholder, before the typography landed. Honouring the implementation and rewriting the requirement is the smaller and more honest correction.

### A general allowance for layouts, not a `BlogArticle` exception

The replacement requirement states that a layout *may* ship scoped styles under component-like constraints — scoped block, `--nf-*` values, nothing outside its own markup, no specificity defence. The part of the old requirement worth keeping was never "no styles", it was "a consumer's unlayered CSS wins and the layout never reaches outward"; that survives verbatim. A per-layout exception would have left the same question open for layout number two.

### Rename the eleven properties to `--nf-layout-blog-article-*`

The library's naming convention is that a component's scoped properties spell the component's full name (`--nf-callout-surface-color`), and `library-styles` enforces that for components. Layouts had no stated rule, and the result is `--nf-h1`, `--nf-fs-base` and `--nf-fluid-vmax` — names general enough to read as library tokens. They are not: they exist only inside one layout's scope. Three concrete problems: a consumer setting `--nf-h1` on `:root` for its own purposes silently re-tunes the layout; a future heading token in `tokens.css` would collide; and a reader of the docs cannot tell which properties belong to what. The chosen names:

| Now | After |
| --- | --- |
| `--nf-fluid-vmin` | `--nf-layout-blog-article-viewport-min` |
| `--nf-fluid-vmax` | `--nf-layout-blog-article-viewport-max` |
| `--nf-fluid-progress` | `--nf-layout-blog-article-viewport-progress` |
| `--nf-fs-base` | `--nf-layout-blog-article-font-size-base` |
| `--nf-fs-type-scale-small` | `--nf-layout-blog-article-type-scale-min` |
| `--nf-fs-type-scale-large` | `--nf-layout-blog-article-type-scale-max` |
| `--nf-fs-type-scale` | `--nf-layout-blog-article-type-scale` |
| `--nf-h1` … `--nf-h4` | `--nf-layout-blog-article-font-size-h1` … `-h4` |
| `--nf-fs-p` | `--nf-layout-blog-article-font-size-p` |

`min`/`max` replace `vmin`/`vmax` and `small`/`large` because `vmin`/`vmax` are CSS viewport units and the pairing should be consistent. This is a breaking rename for an undocumented surface; the proposal records it.

### Literal values stay literal, inside property defaults

`560px`, `1088px`, `1rem`, `0.125rem`, `1.2`, `1.414` and the exponents have no token to reference: `tokens.css` has a static font-size ramp (`--nf-font-size-sm` … `-3xl`) and nothing fluid. Introducing `--nf-fluid-*` tokens would put layout-specific values into a global stylesheet every consumer imports, and would need its own `library-styles` change. The spec instead requires that each value be reachable through an overridable `--nf-layout-blog-article-*` property, which is what the self-styled-through-tokens rule is actually protecting: one place to re-tune, no rule-by-rule overriding. The exponents are the one exception — they are structural to the scale and stay inline in the `calc()`.

### `progress()` support is specced as graceful degradation, not worked around

`progress()` is very new; in a browser without it, the `calc()` chain is invalid at computed-value time and the font sizes fall back to inherited or default values. The headings still render as headings, in descending order, from the UA stylesheet — readable, just not fluid. A `@supports` fallback with a static ramp is a real option, but it doubles the style block and is a behaviour change rather than a spec correction. The spec states the degradation so that the next person reads it as intended rather than as a bug, and a fallback can be proposed on its own.

## Risks / Trade-offs

- **Silent break for an override.** A consumer who found `--nf-h1` by reading the source and overrode it gets the default back with no error. Undocumented and pre-1.0, but real; it needs a release note.
- **The spec now blesses layout styling.** Future layouts may ship more CSS than a consumer expects from a library that otherwise styles only components. The constraint that consumer CSS always wins is what keeps that safe, and it is now stated for layouts rather than implied.
- **`progress()` degradation is specced, not fixed.** Readers on older browsers get UA-default sizes until someone proposes a fallback.
- **Two changes touch the same docs requirement.** `add-html-base-components` modifies "Layouts are documented"; this change removes it and adds a renamed replacement carrying those scenarios. Applying them out of order would lose the html-composition scenario, so the order is recorded in both proposals.
