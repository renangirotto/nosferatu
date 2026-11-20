# Spec Delta

## ADDED Requirements

### Requirement: ReadingProgress content API

The library SHALL publish a `ReadingProgress` component at `astro-nosferatu/components/ReadingProgress.astro` that renders a single `div` carrying the class `nf-reading-progress` and the attribute `aria-hidden="true"`, with no children and no slot. It SHALL accept every native `div` attribute and forward it to that element, and SHALL merge a consumer `class` with `nf-reading-progress` rather than replacing it.

It SHALL accept an optional `color` prop typed `ColorPalette`, with the same contract as `Button`'s: when passed, it is rendered as `data-ui-color`; when omitted, no `data-ui-color` attribute is rendered; a consumer-supplied `data-ui-color` attribute never reaches the element.

It SHALL accept an optional `target` prop: the `id` of an element on the same page whose scroll progress the bar shows. `target` SHALL match `^[A-Za-z][A-Za-z0-9_-]*$`; any other value SHALL make the consumer's build fail with an error naming the component, the rejected value and the accepted pattern. When `target` is passed it SHALL be rendered as `data-ui-target`; when omitted, no `data-ui-target` attribute is rendered; a consumer-supplied `data-ui-target` attribute never reaches the element.

#### Scenario: Default markup

- **WHEN** a consumer renders `<ReadingProgress />`
- **THEN** the output is one `div` with `class` containing `nf-reading-progress` and `aria-hidden="true"`, no `data-ui-color`, no `data-ui-target` and no children

#### Scenario: Color and target are exposed as attributes

- **WHEN** a consumer renders `<ReadingProgress color="blue" target="article-body" />`
- **THEN** the `div` carries `data-ui-color="blue"` and `data-ui-target="article-body"`, each exactly once

#### Scenario: Native attributes and class pass through

- **WHEN** a consumer renders `<ReadingProgress id="progress" class="my-bar" data-testid="bar" />`
- **THEN** the `div` carries `id="progress"`, `data-testid="bar"` and both the `nf-reading-progress` and `my-bar` classes

#### Scenario: Controlled attributes cannot be overridden from outside

- **WHEN** a consumer renders `<ReadingProgress data-ui-color="teal" data-ui-target="x" />`
- **THEN** the `div` carries neither `data-ui-color` nor `data-ui-target`

#### Scenario: An unsafe target fails the build

- **WHEN** a consumer renders `<ReadingProgress target="a b" />` (or any value outside the pattern, such as `x}</style>` or `1st`) and runs `astro build`
- **THEN** the build fails with an error that names `ReadingProgress`, the rejected value and the accepted pattern, and no page is emitted with that value in it

#### Scenario: Invalid color is a type error

- **WHEN** a consumer writes `<ReadingProgress color="teal" />` in an `.astro` file and runs `astro check`
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop

### Requirement: ReadingProgress color resolution

`ReadingProgress`'s fill color SHALL be resolved through one component-scoped custom property, `--nf-reading-progress-color`. Each `data-ui-color` value SHALL set it with `light-dark(var(--nf-<hue>-l-40), var(--nf-<hue>-d-50))`, the same step pairing as `Button`'s background. Where the property is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — the fill SHALL fall back to `light-dark(var(--nf-grey-l-40), var(--nf-grey-d-50))`, so an uncolored bar and `color="grey"` render identically. No semantic color token SHALL be introduced.

#### Scenario: Default fill

- **WHEN** a `ReadingProgress` with no `color` is inspected in a light and then a dark color scheme
- **THEN** its fill color equals `--nf-grey-l-40` in light and `--nf-grey-d-50` in dark, the same as `color="grey"`

#### Scenario: Explicit color

- **WHEN** a `ReadingProgress` with `color="purple"` is inspected in a light and then a dark color scheme
- **THEN** its fill color equals `--nf-purple-l-40` in light and `--nf-purple-d-50` in dark

#### Scenario: Re-themed through the property

- **WHEN** a consumer sets `--nf-reading-progress-color: var(--nf-red-l-60)` in an unlayered rule on an ancestor of an uncolored `ReadingProgress`
- **THEN** the fill uses that value

### Requirement: ReadingProgress appearance and progress

A `ReadingProgress` SHALL be fixed to the top edge of the viewport, offset downwards by `--nf-reading-progress-inset-block-start` when it is set on the bar or on any ancestor (`0px` otherwise, and the component SHALL NOT declare it itself, so an ancestor's value reaches it), spanning its full inline size, with a block size of `6px` held in `--nf-reading-progress-block-size`, and SHALL stack above the page's ordinary content. Its track SHALL be transparent: only the filled portion is drawn. The fill SHALL start at the inline-start edge and cover a share of the bar's inline size equal to the current progress, from 0% to 100%, following the scroll position continuously in both directions, with no JavaScript.

Without `target`, progress SHALL be the root scroller's block-axis scroll position: 0% at the top of the page and 100% at the bottom. With `target`, progress SHALL track the targeted element: 0% while its top edge is at or below the top of the viewport, 100% once its bottom edge is at or above the bottom of the viewport, linear in between; for a target shorter than the viewport, 0% until it is fully in view and 100% once its top edge reaches the top of the viewport. In this paragraph the viewport's edges are inset by the root scroller's `scroll-padding`, so on a page with `scroll-padding-top` set for a sticky header, "the top of the viewport" is the line just below that header. Before the range the fill SHALL be empty and after it full.

Progress SHALL be produced by CSS scroll-driven animations only. In a browser that does not support `animation-timeline`, or when there is nothing to track (the page does not scroll, or no element has the `target` id), the bar SHALL show no fill and SHALL NOT obstruct the page.

#### Scenario: Placement and size

- **WHEN** a page renders a `ReadingProgress` and is scrolled anywhere
- **THEN** the bar stays at the top of the viewport, is as wide as the viewport and `6px` tall, and draws above the page content

#### Scenario: Whole-page progress

- **WHEN** a page taller than the viewport renders `<ReadingProgress />` and the reader scrolls from the top to halfway and then to the bottom, in a browser that supports `animation-timeline`
- **THEN** the fill is empty at the top, covers half the viewport width at halfway, and the full width at the bottom, and shrinks again when the reader scrolls back up

#### Scenario: Target progress

- **WHEN** a page renders `<ReadingProgress target="article-body" />` and an element `id="article-body"` taller than the viewport, and the reader scrolls it through, in a supporting browser
- **THEN** the fill is empty until the element's top reaches the top of the viewport, grows while the element is read, is full when its bottom reaches the bottom of the viewport, and stays full while scrolling further down

#### Scenario: Sticky-header offset is respected

- **WHEN** the page sets `scroll-padding-top: 88px` on `:root` and renders a targeted `ReadingProgress`
- **THEN** the fill starts growing when the element's top reaches `88px` below the top of the viewport, not `0px`

#### Scenario: Missing target

- **WHEN** a page renders `<ReadingProgress target="nowhere" />` and no element has `id="nowhere"`
- **THEN** the bar shows no fill at any scroll position and the build still succeeds

#### Scenario: Unsupported browser

- **WHEN** a page with a `ReadingProgress` is opened in a browser without `animation-timeline` support and scrolled
- **THEN** no fill is drawn at any scroll position, and the page is otherwise unaffected

#### Scenario: Offset below a fixed navbar

- **WHEN** a consumer sets `--nf-reading-progress-inset-block-start: 64px` in an unlayered rule on `:root` or on an ancestor of the bar
- **THEN** the bar's top edge is `64px` below the top of the viewport, and with the property unset it is at `0px`

#### Scenario: Re-sized through the property

- **WHEN** a consumer sets `--nf-reading-progress-block-size: 4px` on the component through a class
- **THEN** the bar is `4px` tall

#### Scenario: Hidden from assistive technology

- **WHEN** the page is read with a screen reader
- **THEN** the bar is not announced

## MODIFIED Requirements

### Requirement: Components are self-styled through tokens

Each component SHALL carry its own scoped styles, and those styles SHALL take every value that has a library token from that token: colors from the palette, shadow offsets from `shadows.css`, space from the spacing scale and corner radii from the border-radius scale. A component SHALL NOT write a literal color, a literal margin, padding or gap, or a literal corner radius.

A value with no library token — a type size, a font weight, a line height, a border width, a transition duration, a travel distance — SHALL either be written inline or be held in a component-scoped `--nf-<component name>-*` property, and SHALL be held in such a property whenever it appears more than once in the component or is meant to be retunable from outside. Font family SHALL come from `--nf-font-family`, published by `typography.css`, so that a consumer's substitution reaches the components too.

Components SHALL NOT style elements outside their own markup, with one exception: a `ReadingProgress` given a `target` SHALL declare, only while `animation-timeline` is supported, a view timeline on the element whose `id` equals `target` and `timeline-scope` for that timeline on `:root`. It SHALL set no other property on either element, and the timeline name SHALL be `--nf-reading-progress-<target>`.

#### Scenario: Re-theme by overriding a token

- **WHEN** a consumer imports `astro-nosferatu/styles/colors/index.css` and sets a palette token a `Button` uses for its background (for example `--nf-purple-l-40`) to a different value on `:root`
- **THEN** a rendered `Button` uses the new value

#### Scenario: No literal spacing, radius or color in a component

- **WHEN** the components' scoped styles are searched for a literal color, a literal length on a `margin`, `padding` or `gap` property, or a literal `border-radius`
- **THEN** nothing matches, because each of those values comes from a `--nf-*` token

#### Scenario: A component follows the consumer's font

- **WHEN** a consumer sets `--nf-font-family` on `:root` in unlayered CSS
- **THEN** a rendered `Button`'s label is set in that family, with no second property to change

#### Scenario: No style leakage

- **WHEN** a page renders a `Button` next to a plain `<button>` element
- **THEN** the plain `<button>` is not affected by the component's styles

#### Scenario: Attribute selectors stay inside the component

- **WHEN** a page renders a plain `<button data-ui-color="green">` next to a `Button`
- **THEN** the plain button receives none of the component's colors or raised styling

#### Scenario: The reading-progress exception stays narrow

- **WHEN** a page renders `<ReadingProgress target="article-body" />` and the element `id="article-body"` and `:root` are inspected in devtools
- **THEN** the only declarations the library adds to them are a view timeline named `--nf-reading-progress-article-body` on the element and `timeline-scope: --nf-reading-progress-article-body` on `:root`, and a page rendering `<ReadingProgress />` with no `target` adds nothing outside the bar
