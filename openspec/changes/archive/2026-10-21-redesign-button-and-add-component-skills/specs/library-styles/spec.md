# Spec Delta

## ADDED Requirements

### Requirement: Button color API
`Button` SHALL accept a `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` or `yellow`, defaulting to `purple`, and SHALL expose the resolved value on the rendered `<button>` as the attribute `data-ui-color`. `Button` SHALL NOT accept a `variant` prop. Every other `<button>` attribute SHALL continue to pass through to the element, and a consumer `class` SHALL be merged with the component's own classes.

#### Scenario: Default color
- **WHEN** a consumer renders `<Button>Button</Button>` with no `color`
- **THEN** the rendered element is `<button type="button" class="nf-button …" data-ui-color="purple">` and it is filled with the purple palette

#### Scenario: Explicit color
- **WHEN** a consumer renders `<Button color="green">Button</Button>`
- **THEN** the rendered element carries `data-ui-color="green"` and its background, text and shadow use green palette values

#### Scenario: Invalid color is a type error
- **WHEN** a consumer writes `<Button color="teal">Button</Button>` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop
- **AND** the same usage inside an `.mdx` page is not reported, because `astro check` type-checks `.astro` files only

#### Scenario: Native attributes still pass through
- **WHEN** a consumer renders `<Button color="red" disabled aria-label="Delete" class="my-cta">Delete</Button>`
- **THEN** the rendered `<button>` is disabled, carries `aria-label="Delete"`, and its class list contains both `nf-button` and `my-cta`

#### Scenario: The color attribute cannot be overridden from outside
- **WHEN** a consumer renders `<Button data-ui-color="teal">Button</Button>`
- **THEN** the rendered element carries `data-ui-color="purple"` exactly once, the consumer's value is dropped, and the button keeps its default coloring

### Requirement: Button color resolution
`Button`'s color SHALL be resolved through exactly two component-scoped custom properties: `--nf-btn-color`, which supplies the background, and `--nf-btn-accent-color`, which supplies the text color, the box-shadow color and the focus outline color. Each `data-ui-color` value SHALL set both properties from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-btn-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-btn-accent-color`. No other palette token SHALL be referenced for the button's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance
- **WHEN** the page resolves to a light color scheme and a `Button` with `color="purple"` is inspected
- **THEN** its computed background equals the value of `--nf-purple-l-40`, and its computed color and box-shadow color both equal the value of `--nf-purple-l-80`

#### Scenario: Dark appearance
- **WHEN** the page resolves to a dark color scheme and the same `Button` is inspected
- **THEN** its computed background equals `--nf-purple-d-50`, and its color and box-shadow color both equal `--nf-purple-d-90`

#### Scenario: Re-theme one button by overriding the component properties
- **WHEN** a consumer sets `--nf-btn-color` and `--nf-btn-accent-color` in unlayered CSS on an ancestor of a `Button`
- **THEN** that button uses the consumer's two values and no other button on the page changes

#### Scenario: Re-theme by overriding a palette token
- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Button` with `color="purple"` picks up the new background

### Requirement: Button appearance and interaction states
`Button` SHALL render at `font-size: 1rem` with `padding-block: 8px`, `padding-inline: 16px`, `border-radius: 8px`, no border, and a `0px 4px 0px` box-shadow in `--nf-btn-accent-color`, giving a raised appearance. On hover, and whenever focus is within it, it SHALL translate down by `2px` and reduce the shadow to `0px 2px 0px`; while active it SHALL translate down by `4px` and reduce the shadow to `0px 0px 0px`, so the button appears pressed flat. The sum of the translation and the shadow depth SHALL stay constant across the states, so the button's bottom edge does not move. Every property that changes between these states SHALL animate over `0.15s` with an `ease-in-out` timing function, except when the user has requested reduced motion, in which case the states SHALL apply instantly. On `:focus-visible` the button SHALL additionally draw a `2px` solid outline in `--nf-btn-accent-color`, inset by its own width so that it reads as a border on the button rather than a ring around it. The button SHALL NOT apply the hover, focus or active movement while disabled.

#### Scenario: Resting state is raised
- **WHEN** a reader looks at a `Button` that is neither hovered, focused nor pressed
- **THEN** it shows no border and a 4px-deep solid shadow directly beneath it, in the same accent color as its text

#### Scenario: Hover sinks the button halfway
- **WHEN** the pointer hovers an enabled `Button`
- **THEN** it moves down 2px and its shadow shortens to 2px, so the button's bottom edge stays in place, and the movement is animated rather than instant

#### Scenario: Active presses the button flat
- **WHEN** the reader holds the pointer down on an enabled `Button`
- **THEN** it moves down 4px and its shadow disappears, so the button sits flush with where the shadow was

#### Scenario: Disabled button does not react
- **WHEN** the pointer hovers or presses a `Button` rendered with `disabled`
- **THEN** it neither moves nor changes its shadow, and it shows the disabled treatment

#### Scenario: Keyboard focus draws an inset outline
- **WHEN** a reader tabs to a `Button`
- **THEN** it takes the hover appearance — down 2px with a 2px shadow — and a 2px outline in its accent color is drawn inside its edge, following its corner radius, without changing the button's size or position

#### Scenario: Pointer focus does not draw the outline
- **WHEN** a reader clicks a `Button` and the pointer leaves it while the button keeps focus
- **THEN** the button keeps the hover appearance but draws no outline, because the outline is bound to `:focus-visible`

#### Scenario: Reduced motion removes the animation
- **WHEN** the user has `prefers-reduced-motion: reduce` and hovers or presses a `Button`
- **THEN** the resting, hover and active appearances are unchanged and still give the same feedback, but each one is reached instantly with no animated transition

### Requirement: Cascade layer order without a base layer
When loaded through `index.css`, the tokens, colors, reset and typography styles SHALL be placed in the cascade layers `nosferatu.tokens`, `nosferatu.colors`, `nosferatu.reset` and `nosferatu.typography`, declared in that order, so later layers win over earlier ones and any unlayered consumer CSS wins over all of them.

#### Scenario: Typography overrides the reset
- **WHEN** both `nosferatu.reset` and `nosferatu.typography` style the same element property
- **THEN** the `nosferatu.typography` value applies

#### Scenario: Consumer CSS wins without extra specificity
- **WHEN** a consumer writes an unlayered rule `h1 { color: red; }` after importing `index.css`
- **THEN** `h1` elements are red, regardless of the library's typography rules

#### Scenario: Consumer token override wins regardless of order
- **WHEN** a consumer sets `--nf-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: No base layer is declared
- **WHEN** the `@layer` statement in `index.css` is read
- **THEN** it names exactly `nosferatu.tokens, nosferatu.colors, nosferatu.reset, nosferatu.typography`, with no `nosferatu.base`

## MODIFIED Requirements

### Requirement: Exported stylesheets
The library SHALL export the stylesheets `tokens.css`, `colors.css`, `reset.css`, `typography.css` and `index.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of the others.

#### Scenario: Import everything
- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens, colors, reset and typography styles are all applied

#### Scenario: Import tokens only
- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the non-color `--nf-*` custom properties (spacing, fonts, radius) are defined, no color custom properties are defined, and no element selectors from reset or typography are applied

#### Scenario: Import colors only
- **WHEN** a consumer imports only `astro-nosferatu/styles/colors.css`
- **THEN** the `--nf-*` palette custom properties are defined and no element selectors are applied

#### Scenario: No base stylesheet is published
- **WHEN** the published package is inspected, or a consumer imports `astro-nosferatu/styles/base.css`
- **THEN** no such file exists and the import fails, and nothing in the library sets a `body` color or font, a global focus outline, or a `::selection` treatment

### Requirement: Components are self-styled through tokens
Each component SHALL carry its own scoped styles, and those styles SHALL reference design values only through `--nf-*` custom properties. Components SHALL NOT style elements outside their own markup.

#### Scenario: Re-theme by overriding a token
- **WHEN** a consumer imports `colors.css` and sets a palette token a `Button` uses for its background (for example `--nf-purple-l-40`) to a different value on `:root`
- **THEN** a rendered `Button` uses the new value

#### Scenario: No style leakage
- **WHEN** a page renders a `Button` next to a plain `<button>` element
- **THEN** the plain `<button>` is not affected by the component's styles

#### Scenario: Attribute selectors stay inside the component
- **WHEN** a page renders a plain `<button data-ui-color="green">` next to a `Button`
- **THEN** the plain button receives none of the component's colors or raised styling

### Requirement: Reset defaults
`reset.css` SHALL apply: border-box sizing on all elements and pseudo-elements; zero default margin; `color-scheme: light dark` on `:root`, so `light-dark()` values and UA-rendered controls follow the user's preferred scheme; `interpolate-size: allow-keywords` on `html` when the user has no reduced-motion preference; a `body` with `min-height: 100dvh`, an inline-size container named `body-container`, line-height `1.5` and antialiased font smoothing; block, max-width-100% media; inherited fonts on form controls; `overflow-wrap: break-word` on paragraphs and headings; `text-wrap: pretty` on paragraphs and blockquotes; `text-wrap: balance` on headings; and an isolated stacking context on `#root`.

#### Scenario: Body fills the dynamic viewport
- **WHEN** a page loads `index.css` and has little content
- **THEN** the `body` computed `min-height` is `100dvh`

#### Scenario: Body is a container
- **WHEN** a consumer writes `@container body-container (min-width: 40rem) { … }`
- **THEN** the rule applies based on the body's inline size

#### Scenario: Reduced motion skips keyword interpolation
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** `html` does not get `interpolate-size: allow-keywords`

#### Scenario: Dark preference reaches light-dark()
- **WHEN** a consumer imports `reset.css` and the OS is set to dark mode
- **THEN** `light-dark()` values in library components resolve to their dark branch without the consumer declaring `color-scheme`

#### Scenario: Consumer can pin a scheme
- **WHEN** a consumer sets `color-scheme: only light` on `:root` in unlayered CSS
- **THEN** the consumer's value wins and components keep their light appearance under an OS dark preference

## REMOVED Requirements

### Requirement: Cascade layer order
**Reason**: `base.css` is gone, so the `nosferatu.base` layer it occupied no longer exists and the fixed five-layer order it describes cannot be satisfied. Replaced by the four-layer requirement of the same intent, added by this change as "Cascade layer order without a base layer".
**Migration**: Consumers who placed their own rules in `@layer nosferatu.base` must move them to another layer or leave them unlayered — unlayered CSS still wins over every `nosferatu.*` layer, so unlayered is the safe destination.
