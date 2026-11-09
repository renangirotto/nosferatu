# Design

## Context

`BlogArticle` caps its `article` with `max-inline-size: var(--nf-layout-blog-article-max-inline-size, var(--nf-container-small-size))` (added by `simplify-blog-article-styles`, complete but unarchived). This change lifts that measure into a reusable `Container` component and has the layout use it.

## Decisions

### The width is a `var()` fallback, not a declared property

```css
.nf-container {
	margin-inline: auto;
	inline-size: 100%;
	max-inline-size: var(--nf-container-max-inline-size, var(--nf-container-large-size));
}
```

`component-build` says to declare a component's properties and use them bare, with the default colour as the one exception. This is a second, deliberate exception for the same reason: declaring `--nf-container-max-inline-size` on `.nf-container` would put it on the element, so an ancestor — `BlogArticle`'s `main`, or a consumer's wrapper — could never set it. Undeclared, it inherits from anywhere, and a value on the element itself (`style` or a class) still wins over an inherited one. It mirrors exactly how the layout property it replaces already worked.

`component-build` step 5 should gain one line naming this exception when the change is applied, so the skill and the component do not disagree.

### BlogArticle feeds the container through inheritance

The layout sets `--nf-container-max-inline-size: var(--nf-container-small-size)` on `.nf-layout-blog-article` (its `main`), alongside its font properties. The `Container` inherits it. Alternatives rejected:

- Passing `style` from the layout: inline style beats every consumer rule, breaking invariant 3.
- Passing a class from the layout and styling the container's root from the layout's `<style>`: reaches into another component's markup and ties on specificity with `.nf-container`, so the winner depends on stylesheet order.

The consumer re-tunes one article by setting the property on the article's `.nf-container`, which beats the inherited value regardless of order.

### Default comes from a new token, `--nf-container-large-size`

Lives in `generic.css` next to `--nf-container-small-size`, so the container scale stays in one file and one `:root` override moves every default-width container. This is a published token addition.

### Name overlap with the container tokens

`--nf-container-max-inline-size` (component-scoped, per the `--nf-<component>-<role>` rule) shares the `--nf-container-` prefix with the `generic.css` tokens `--nf-container-*-size`. They do not collide — the component's property ends in `-max-inline-size`, the tokens in `-<size>-size` — and the overlap is the convention working, since the component is literally named Container. The docs styles page will say that `--nf-container-*-size` are tokens and `--nf-container-max-inline-size` is the component's hook.

### `inline-size: 100%` is kept

The current article rule has it, and without it a `Container` inside a flex or grid parent shrinks to its content. Keeping it preserves the article's behaviour exactly.

## Invariants

- Upholds 1 (every property `--nf-`), 3 (no specificity raised; the layout sets an inherited property, never a selector on the container), 5 (scoped style, no selector outside its own `div`), 6 and 7 (published through the existing `./components/*` wildcard and `src/components`).
- Bends the `component-build` convention "declare a property, do not rely on a `var()` fallback", as recorded above.

## Risks

- **Breaking for consumers** of `--nf-layout-blog-article-max-inline-size` and of `main > article` selectors. Called out in the proposal and the docs migration note; major bump.
- **Ordering with the unarchived change.** The `library-layouts` deltas here MODIFY a requirement that `simplify-blog-article-styles` ADDS. Archive that change first, or the sync fails to find the requirement.
