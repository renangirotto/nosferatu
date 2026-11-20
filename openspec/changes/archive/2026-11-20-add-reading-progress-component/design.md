# Design

## Context

See proposal.md for the why, and the `library-styles` delta for the observable behaviour. Three constraints shape the approach:

- The library ships source with no JavaScript runtime, so progress comes only from CSS scroll-driven animations.
- Invariant 5 says components never style outside their own markup. A `target` cannot be built without breaking that: a view timeline has to be declared **on the element it tracks**, and a fixed bar elsewhere in the tree can only see that timeline if a common ancestor declares `timeline-scope`.
- Astro scoped `<style>` blocks are static, so CSS that depends on the `target` value has to be generated at render time.

## Goals / Non-Goals

**Goals:**

- Keep the whole-page bar fully self-contained: no outside selector, no generated CSS.
- Keep the `target` bend as small as possible, and specify it exactly in the modified "Components are self-styled through tokens" requirement.
- Make unsupported browsers fail quietly, showing an empty transparent track.

**Non-Goals:**

- RTL-aware fill direction. The fill grows from the physical left. `transform-origin` has no logical keywords. Add a `:dir(rtl)` rule when a consumer needs it.
- Reduced-motion handling. The fill moves only while the user scrolls and never on its own, so there is nothing to suppress.

## Decisions

### The bar is its own fill

The root `div` is the fill. Its `background-color` is `var(--nf-reading-progress-color, light-dark(var(--nf-grey-l-40), var(--nf-grey-d-50)))`, and it grows with the `scale` property from `0 1` to `1 1`, with `transform-origin: 0 50%`. The space it hasn't covered yet is simply the page underneath, which gives the transparent track for free. That means no child element and no pseudo-element.

- `scale` over `transform`: this matches the skill's `translate` rule, so a consumer's own `transform` still composes. It is also compositor-friendly.
- Alternative considered: animating `inline-size` from `0%` to `100%`. That would be RTL-correct for free, but it runs layout on every frame. It was rejected because a fill driven by `scale` is the standard pattern, and RTL is a non-goal.

### Animation declared with longhands, gated by `@supports`

The base rule sets `scale: 0 1`. The animation is declared only inside `@supports (animation-timeline: scroll())`, and only with longhands:

```
animation-name: nf-reading-progress-fill;
animation-duration: auto;
animation-timing-function: linear;
animation-fill-mode: both;
animation-timeline: scroll(root block);
```

- Longhands are used because the `animation` shorthand resets `animation-timeline` to `auto`. A shorthand written after the timeline would silently fall back to a time-based animation.
- `animation-fill-mode: both` keeps the bar empty before the range and full after it. Without it, a targeted bar would snap back to empty once the reader scrolled past the block.
- `@supports` makes an unsupported browser fall back to the base `scale: 0 1`, which is an invisible bar. An inactive timeline does the same: a page that doesn't scroll, or a `target` that doesn't exist. This is the state the docs warning describes.
- The keyframes are named `nf-reading-progress-fill`. Astro does not rename `@keyframes`, so the `nf-` prefix is what keeps the name from colliding with anything else on the page.

### Target: validate, then generate one inline style block

When `target` is set, the frontmatter does two things.

1. It checks `target` against `^[A-Za-z][A-Za-z0-9_-]*$` and throws `new Error(...)` otherwise. The error names `ReadingProgress`, the value and the pattern. This check is the security boundary: the value is interpolated into raw CSS inside a `<style>` element, so anything outside the pattern could break out of the selector or out of the element. It also guarantees that `--nf-reading-progress-<target>` is a valid dashed-ident, and that `#<target>` is a valid selector without escaping.
2. It renders, next to the bar, `<style is:inline set:html={css}>`, where `css` is:

```
@supports (animation-timeline: scroll()) {
	:root { timeline-scope: --nf-reading-progress-<target>; }
	#<target> { view-timeline: --nf-reading-progress-<target> block; }
	.nf-reading-progress[data-ui-target="<target>"] {
		animation-timeline: --nf-reading-progress-<target>;
		animation-range: contain 0% contain 100%;
	}
}
```

- `contain` gives exactly the range in the spec. For a tall target it runs from the top edge at the top of the viewport to the bottom edge at the bottom of the viewport. For a short one it runs from the target being fully in view to its top reaching the top. `view-timeline-inset` is left at `auto`, so the root's `scroll-padding` insets those edges: on a site that pads for a sticky header (Starlight sets `88px`), progress starts below the header. Decided during apply, measured in Chrome; `view-timeline-inset: 0` would track the literal viewport edge instead. `cover`, which runs from first pixel visible to last pixel visible, was rejected: the bar would already be partly full while the reader is still above the content.
- The bar's own targeted rule lives in the same generated block, keyed on `data-ui-target`, rather than in an inline `style`. That avoids merging with a consumer's `style` attribute.
- This block is unlayered and global. That is acceptable because it only declares timeline properties, and no consumer has a reason to override them.
- Alternative considered: making the consumer put `view-timeline-name` on the target themselves. That keeps the invariant intact, but it leaks the implementation into every use site and makes the `target` prop a lie. Rejected, because the user explicitly asked for an ID-based API.
- Alternative considered: `timeline-scope: all`. That would let several targeted bars coexist, but browser support for the `all` keyword is narrower than for the feature itself. Rejected for now, and recorded as a non-goal in the proposal.

### Component-scoped properties

- `--nf-reading-progress-block-size: 6px` is declared on the root. It is retunable from outside, so it is hoisted.
- `--nf-reading-progress-inset-block-start` is never declared either, and is read as `var(--nf-reading-progress-inset-block-start, 0px)`. It is the same exception as `Container`'s width: declaring it on the root would stop a layout or `:root` from setting it for a fixed navbar. Added during apply, at the user's request.
- `--nf-reading-progress-color` is never declared on the root, and is only read with the grey fallback, per `component-build` step 4b. There is one rule per hue (nine `[data-ui-color]` blocks).
- `z-index: 100` is written inline. No token exists, and it appears once. The docs task verifies the bar draws above Starlight's header. If consumers ask to tune it, it gets hoisted.

### Invariants

- **Upheld:** `--nf-` prefix (1), palette-only colors and no semantic tokens (2), layer order untouched (3), public import path (6), tarball unchanged (7), docs private (8).
- **Bent:** 5, self-styling. The bend applies only with `target`, and only to the two declarations the modified requirement names.

## Risks / Trade-offs

- [A fixed bar can't escape an ancestor's stacking context (`isolation`, `z-index`, `transform`). Starlight's content pane is isolated, so the docs header painted over the bar regardless of its `z-index`] → The docs page offsets its demo bars below `--sl-nav-height` and tells consumers to render the bar outside such ancestors.

- [Browsers without `animation-timeline` see no progress] → This is intentional, per the user's request for no polyfill. The bar is invisible rather than broken, and the docs page warns about it.
- [`:root { timeline-scope }` overrides a consumer's own `timeline-scope` on `:root`, and a second targeted bar replaces the first] → This is documented as a non-goal. `timeline-scope: all` becomes the upgrade path once support for it is broad.
- [The generated `<style>` is the only runtime CSS string the library builds] → The strict pattern is enforced before interpolation, and a scenario checks that an unsafe value fails the build.
- [A fixed bar at `z-index: 100` may sit under a consumer's own high-z header] → The consumer can raise it with a class. The decision is recorded above.
