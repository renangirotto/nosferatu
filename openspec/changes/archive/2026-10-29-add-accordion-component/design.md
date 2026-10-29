# Design

## Context

See [proposal.md](proposal.md) — Why. The constraints are the project's: the library ships `.astro` and `.css` source with no build step, no bundler, no runtime and no test runner; every custom property is `--nf-` prefixed; colors come only from the palette; components are self-styled with a scoped `<style>` and never reach outside their own markup; and unlayered consumer CSS must keep winning, so specificity is never raised to force anything.

The only genuinely new ground here is the animation. `Button` and `Callout` animate nothing harder than a `translate`; an accordion has to animate a box from zero to a height nobody knows in advance, in both directions, without JavaScript. That is the decision this document exists for — everything else (the two color properties, the `data-ui-color` attribute, the depth states) is `Button`'s shape reapplied, and the spec delta already says what it must look like.

## Goals / Non-Goals

**Goals:**

- Keep the disclosure the browser's: one `<details>`, the native toggle, the native keyboard behaviour, the native marker, the native `open` and `name` attributes. The component adds appearance, not behaviour.
- Animate open *and* close, for content of any height, with no measurement and no script.
- Degrade to the browser's own instant `<details>` wherever the animation is not supported — never to a panel that opens to nothing.
- Stay self-contained: the component must not depend on `reset.css` being loaded for its animation to work.

**Non-Goals:**

- Sharing the raised-control styling with `Button`. Scoped styles are per component by design; a shared rule would have to live in a published stylesheet, which is a new public API and a separate proposal.
- A `summary` slot. The summary is a single string; a slot would let a consumer put block content into `<summary>`, which is a place block content behaves badly.
- Controlling the panel from outside (a `toggle` API, an animation-end hook). Both need script.

## Decisions

### The animation runs on `::details-content`, not on the content `<div>`

The content lives in a `<div>` the component renders, as the spec requires, but the **animated box is the `::details-content` pseudo-element** of the `<details>` itself:

```css
.nf-accordion::details-content {
	block-size: 0;
	overflow: clip;
	transition-property: block-size, content-visibility;
	transition-duration: var(--nf-accordion-disclosure-duration);
	transition-timing-function: ease-in-out;
	transition-behavior: allow-discrete;
}

.nf-accordion[open]::details-content {
	block-size: calc-size(auto, size);
}
```

The reason is that nothing else can animate *closing*. When `open` is removed, the browser stops rendering everything inside `<details>` in the same frame; a transition declared on the inner `<div>` has no frames to run in and the panel simply vanishes. `::details-content` is the box the browser uses to hide that subtree, so it is the one box that still exists in both states — which is exactly why it was specified. `content-visibility` is in the transition list with `transition-behavior: allow-discrete` so the discrete `visible` → `hidden` flip is deferred to the end of the closing transition instead of happening immediately.

The inner `<div>` is still load-bearing: it carries the panel's padding and fill. Putting padding on `::details-content` instead would make the collapsed height `0` plus `16px` of padding, so a closed accordion would show a stripe of color — the classic reason a collapsible needs an inner box.

Alternatives rejected:

- **`grid-template-rows: 0fr → 1fr` on a wrapper.** The standard pre-`::details-content` trick, and it animates no better on close for the same reason: the wrapper stops being rendered the instant `open` goes away. It also needs `min-height: 0` plumbing and still cannot animate a `<details>` closed.
- **`max-block-size` to a guessed large value.** Animates both ways but the duration becomes a function of the guess, short content snaps, and tall content is clipped. The spec forbids requiring a measurement from the consumer for exactly this reason.
- **A tiny inline script measuring `scrollHeight`.** Works everywhere and is what everyone did before. The library has no runtime and adding one is a breaking architectural change, so it is not available.

### `calc-size(auto, size)` for the open height, rather than relying on `interpolate-size` from the reset

`reset.css` already sets `interpolate-size: allow-keywords` on `html`, which would make a bare `block-size: auto` animate. The component does not use that: it writes `calc-size(auto, size)` itself.

Two reasons. First, **independence** — a consumer may import `tokens.css` and the palette without `reset.css` (each stylesheet is independently importable by spec), and an animation that silently stops working depending on which stylesheets are loaded is a trap. Second, **reduced motion** — the reset only grants `interpolate-size` when the user has no reduced-motion preference, which is the right call for the reset but means the component would inherit a motion policy through a property it does not control. The component expresses reduced motion the way `Button` does, by zeroing its own duration property, and keeps its height behaviour constant.

### One `@supports` gate around the whole animated block

```css
@supports (block-size: calc-size(auto, size)) and selector(::details-content) {
	/* the four rules above */
}
```

The gate is tested as a unit, and it wraps the declarations that *collapse* the panel as well as the ones that animate it. That ordering is the whole safety argument: a browser that fails the test never sees `block-size: 0`, so it renders a plain `<details>` that opens instantly and completely. The failure mode of getting this backwards — gating only `calc-size` and leaving `block-size: 0` unconditional — is a permanently empty panel, which is worse than no animation at all.

`selector(::details-content)` is included because the two features shipped at different times in different engines; a browser with size interpolation but no content pseudo-element would otherwise match the rules and apply them to nothing, and one with the pseudo-element but no size interpolation would collapse the panel to `0` with no way back to `auto`.

### `@starting-style` gives the content its entry, and is deliberately *not* used for the height

The height needs no starting style: `::details-content` exists in both states, so its `block-size` already has a previous value — `0` — to transition from. Writing `@starting-style` for it would add nothing and would risk replaying the growth on page load for an accordion rendered `open`.

Where a starting style is actually required is the content `<div>`. It is inside a subtree the browser stops rendering while the panel is closed, so when the panel opens the `<div>` is rendered for the first time and has no previous value for anything. A plain transition on it never runs; `@starting-style` is the only way to give it one:

```css
.nf-accordion-content {
	opacity: 1;
	translate: 0 0;
	transition-property: opacity, translate;
	transition-duration: var(--nf-accordion-disclosure-duration);
	transition-timing-function: ease-in-out;

	@starting-style {
		opacity: 0;
		translate: 0 calc(-1 * var(--nf-space-2));
	}
}
```

So the two halves of the animation have different jobs: `::details-content` opens and closes the box, and `@starting-style` on the `<div>` fades and slides its content in behind it. The entry runs only on opening — there is no exit counterpart, because by the time the panel closes the `<div>` has already stopped being rendered and the shrinking box is what the reader sees.

Two consequences, both accepted: an accordion rendered `open` plays the fade once on load (the panel itself does not unfold, which is the part that would look broken), and if an engine declines to treat the content-visibility flip as a first render, the content simply appears at full opacity inside a panel that still animates correctly.

### `[open]` presses the summary flat, and wins over `:hover`

The summary reproduces `Button` exactly — `--nf-accordion-depth` and `--nf-accordion-lift` swapped between `4px/0px`, `2px/2px` and `0px/4px` — with one addition: `[open]` holds the `0px/4px` pressed values. This is what makes the open state readable without a custom marker: the summary looks like a button somebody is still holding down, and it sits flush against the panel it opened.

Because `.nf-accordion[open] .nf-accordion-summary` and `.nf-accordion-summary:hover` set the same two properties, order decides. The `[open]` rule is written **after** the hover and active rules, so hovering an open summary does not lift it back to the halfway depth. Both selectors are (0,2,0) and (0,2,0) respectively, so this is a source-order decision rather than a specificity one — which is the way the project wants it, since raising specificity to win is banned.

One consequence worth stating: the summary translates down `4px` while open, so it overlaps the top of the content panel by `4px`. That is deliberate — the two share a fill, so the overlap reads as the summary sinking into the panel rather than as a seam.

### Two color properties, same pairing as `Button`

`--nf-accordion-color` and `--nf-accordion-accent-color`, set per `data-ui-color` from `light-dark(var(--nf-<hue>-l-40), var(--nf-<hue>-d-50))` and `light-dark(var(--nf-<hue>-l-80), var(--nf-<hue>-d-90))`.

`Callout` deviates from that pairing because its surface is translucent; this component does not, because its fill is opaque in both schemes exactly like `Button`'s, so the same accent is legible on it. Both the summary and the content panel take the same fill and the same text color: the content is not a tinted area on the page, it is the inside of the control. That is also why there are two properties here and not five — the content needs no rule, no separate surface and no shadow of its own.

The native disclosure marker needs no treatment: it is painted in the summary's `color`, which is already the accent.

### Theming one instance happens **on** the element, not on an ancestor

`component-build` and the `Button` page both say to set a component's two color properties on an *ancestor* and let them inherit. Measured in Chrome during this change, that does not work, for `Button` either: `.nf-accordion[data-ui-color='purple']` declares both properties **on the element**, and a declaration on an element always beats a value inherited into it — this is value origin, not specificity, so no selector on an ancestor can win. The library's own spec scenario for `Button` is therefore false, which is being reported separately; this change does not touch `Button` or `Callout`.

For `Accordion` the documented hook is the `style` attribute on the component itself, which was verified to work: the summary, its shadow and the content panel all follow, because only the root declares the properties and the parts inherit them. The delta spec carries both the working scenario and an explicit one saying the ancestor route does not work, so the next person does not rediscover it.

## Risks / Trade-offs

- **Browser support for the animation is partial and moving.** `::details-content` and CSS size interpolation (`calc-size()`) are not universal, and they did not ship together. → The `@supports` gate makes the unsupported path the browser's own `<details>`, which is fully functional; the docs page states this plainly as progressive enhancement, the way the typography spec already does for `progress()`. Verification includes opening the page in a non-Chromium browser and confirming instant-but-complete disclosure.
- **Whether `@starting-style` fires for an element revealed by a `content-visibility` flip is engine-dependent.** → The entry effect is cosmetic: if it does not fire, the content appears at full opacity inside a panel that still grows and shrinks correctly. The apply phase checks it in every engine that passes the `@supports` gate and records what each one does on the docs page rather than claiming a guarantee.
- **`overflow: clip` on the content box clips anything a consumer positions outside it** — a dropdown or a tooltip inside an accordion panel will be cut off while it is open. → Unavoidable for a height animation, and documented. A consumer who needs overflow can turn the clipping off themselves from unlayered CSS, which wins without `!important`.
- **The `0.3s` disclosure is longer than the `0.15s` state animation, so an accordion opened by keyboard holds the pressed summary before the panel finishes.** → Intentional: the two read as one gesture, the summary committing first and the panel following. Both durations are component properties, so a consumer can retune either.
- **An accordion rendered `open` plays the content's fade once on page load.** → Accepted. The panel itself does not unfold from zero — that is the part that would read as a defect — because the height has no starting style to replay from. The spec pins the load behaviour at "full height on first paint", and the apply phase verifies exactly that.
