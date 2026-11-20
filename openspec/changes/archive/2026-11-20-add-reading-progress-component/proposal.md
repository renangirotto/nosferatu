# Proposal

## Why

Long articles and docs pages benefit from a quiet indicator of how far the reader has got, and today a consumer has to hand-write one, usually with a scroll listener. CSS scroll-driven animations (`animation-timeline`) now make this a pure-CSS component that fits the library's no-JavaScript, ships-source model.

## What Changes

- New component `astro-nosferatu/components/ReadingProgress.astro`: renders a single `div.nf-reading-progress`, fixed to the top of the viewport across its full width, `6px` tall, on a transparent track. Its fill grows along the inline axis from 0% to 100% as the reader scrolls.
- `color?: ColorPalette` prop with the library's usual behaviour: unset renders grey, each hue renders as `data-ui-color`, and the fill is themable through `--nf-reading-progress-color`.
- `target?: string` prop: the `id` of an element on the page. With it, progress tracks that element — 0% when its top reaches the top of the viewport (below any `scroll-padding-top`, so a sticky header is accounted for), 100% when its bottom reaches the bottom of the viewport — instead of the whole page's scroll. A `target` that is not a plain identifier fails the consumer's build.
- Progress is driven only by CSS `animation-timeline`, with no JavaScript and no polyfill. In a browser without scroll-driven animations the bar stays empty (an invisible transparent track); the docs page carries a browser-support warning.
- The bar is decorative and rendered `aria-hidden="true"`.
- **Invariant bend**: with `target`, the component sets timeline properties on the targeted element and `timeline-scope` on `:root`, which is outside its own markup. The `library-styles` requirement "Components are self-styled through tokens" is modified to allow exactly this, and nothing wider.

Consumer-visible: yes, purely additive — a new component file, no change to existing components, tokens, stylesheets or exports. No major bump needed.

## Non-goals

- A polyfill or JavaScript fallback for browsers without `animation-timeline`.
- More than one `ReadingProgress` with a `target` on a page: each writes `timeline-scope` on `:root`, so a second one would replace the first's. An untargeted bar alongside one targeted bar is fine.
- An accessible value (`role="progressbar"`, `aria-valuenow`): that needs JavaScript; the bar is decorative.
- Placement options (bottom of the viewport, inline in flow, vertical) or a configurable progress range.
- Theming the track: it is always transparent.
- New library tokens; the height and stacking order are component-scoped properties.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `library-styles`: new `ReadingProgress` content API, color resolution and appearance/progress requirements; "Components are self-styled through tokens" gains the narrow scroll-timeline exception for a targeted element.
- `documentation-site`: the ReadingProgress page warns that the component needs scroll-driven animation support and shows nothing without it.

## Impact

- `packages/ui/src/components/ReadingProgress.astro` (new).
- `docs/src/content/docs/components/reading-progress.mdx` (new).
- No `package.json` change: `./components/*` is already a wildcard export and `files` already ships `src/components`.
