# Spec Delta

## ADDED Requirements

### Requirement: Palette files split by scale
The palette SHALL be published as a folder rather than a single file. `colors/colors-dark.css` SHALL define every `-d-` token and no `-l-` token; `colors/colors-light.css` SHALL define every `-l-` token and no `-d-` token; `colors/index.css` SHALL define no tokens of its own and SHALL import exactly those two files, in that order. Each of the three SHALL be independently importable through the package's exports. A consumer who loads `colors/index.css` SHALL end up with the same set of custom properties, with the same values, as a consumer who loads `colors-dark.css` and `colors-light.css` separately.

#### Scenario: Importing one scale defines only that scale
- **WHEN** a consumer imports only `astro-nosferatu/styles/colors/colors-dark.css`
- **THEN** every `--nf-<hue>-d-<step>` and `--nf-<hue>-d-<step>-25` custom property is defined, no `--nf-<hue>-l-*` property is defined, and no element selector is applied

#### Scenario: The light scale is equally standalone
- **WHEN** a consumer imports only `astro-nosferatu/styles/colors/colors-light.css`
- **THEN** every `--nf-<hue>-l-<step>` and `--nf-<hue>-l-<step>-25` custom property is defined, no `--nf-<hue>-d-*` property is defined, and no element selector is applied

#### Scenario: The folder index is equivalent to both halves
- **WHEN** one page imports `astro-nosferatu/styles/colors/index.css` and another imports both scale files directly
- **THEN** the computed value of every palette token is identical on the two pages

#### Scenario: The index contributes no declarations of its own
- **WHEN** `colors/index.css` is read
- **THEN** it contains only the two `@import` statements and declares no custom property and no selector

#### Scenario: Both scales reach the colors layer
- **WHEN** a consumer loads `astro-nosferatu/styles/index.css` and inspects the cascade layers in the browser's developer tools
- **THEN** the tokens from both scale files appear inside `nosferatu.colors`, because the nested imports inherit the layer their entry point was assigned

### Requirement: Opacity tiers grouped, not interleaved
Within each palette file, a hue's tokens SHALL be written as two consecutive blocks: first the opaque steps `10` through `100` in ascending order, then the 25%-opacity steps `10` through `100` in ascending order. A translucent token SHALL NOT appear between two opaque tokens. The blocks for one hue SHALL stay together, and hues SHALL remain in alphabetical order.

#### Scenario: Opaque block precedes the translucent block
- **WHEN** the declarations for one hue in `colors-dark.css` are read top to bottom
- **THEN** they appear as `<hue>-d-10 … <hue>-d-100`, then `<hue>-d-10-25 … <hue>-d-100-25`, with no translucent token among the opaque ones

#### Scenario: Grouping does not change any value
- **WHEN** a consumer who previously loaded the single `colors.css` compares every palette token's computed value against the same token loaded from the folder
- **THEN** every value for the eight pre-existing hues is unchanged

### Requirement: Grey palette ramp
The palette SHALL include a ninth hue, `grey`, that reads as a near-neutral greyscale. Its two scales SHALL share a hue angle of `277.5` and a chroma that rises with the step — `0, 0.002, 0.004, 0.007, 0.009, 0.011, 0.013, 0.016, 0.018, 0.02` for steps `10` through `100` — so the lightest greys are exactly neutral and the darkest carry a faint cool cast. The dark scale's lightness SHALL run `0.98, 0.93, 0.88, 0.83, 0.78, 0.70, 0.61, 0.51, 0.40, 0.29` and the light scale's `0.92, 0.85, 0.78, 0.71, 0.64, 0.57, 0.50, 0.43, 0.36, 0.29`, so both scales descend monotonically from light to dark like every other hue. `--nf-grey-d-10` SHALL be `oklch(0.98 0 277.5)`, the two-decimal OKLCH rounding of `#f9f9f9`, and `--nf-grey-d-100` and `--nf-grey-l-100` SHALL both be `oklch(0.29 0.02 277.5)`, the rounding of `#282A36` — the two anchors that bound the greyscale. Grey SHALL receive the same 25%-opacity tier and the same shadow tokens as every other hue, and SHALL NOT receive any component rule, token name or default treatment the other hues do not have.

#### Scenario: Grey is a neutral, not a tinted hue
- **WHEN** a reader compares a swatch of `--nf-grey-l-50` against `--nf-blue-l-50` at the same step
- **THEN** the grey swatch reads as grey, with no identifiable hue, while the blue is plainly blue

#### Scenario: The anchors land where specified
- **WHEN** `--nf-grey-d-10` and `--nf-grey-l-100` are rendered as swatches and sampled
- **THEN** the first is the near-white `#f9f9f9` and the second the dark `#282A36`, each within one 8-bit channel step of the source color, the difference coming from the palette's two-decimal precision

#### Scenario: Both grey scales descend without a flat run
- **WHEN** a reader looks at either grey scale rendered as ten swatches in step order
- **THEN** each swatch is visibly darker than the one before it, with no pair that reads as the same color

#### Scenario: Grey behaves like any other hue
- **WHEN** a consumer uses `--nf-grey-l-40-25` as a background and `var(--nf-shadow-grey-l-70)` as a box-shadow
- **THEN** both resolve, exactly as the equivalent tokens do for `purple`

## MODIFIED Requirements

### Requirement: Exported stylesheets
The library SHALL export the stylesheets `tokens.css`, `shadows.css`, `reset.css` and `index.css`, and the palette as the folder `colors/`, holding `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of them. The library SHALL NOT publish a stylesheet at `styles/colors.css`. The library SHALL NOT publish a typography stylesheet: it styles no headings, paragraphs, lists, links or code, and leaves a consuming page's text to the consumer's own CSS.

#### Scenario: Import everything
- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens, colors, shadows and reset styles are all applied

#### Scenario: Import tokens only
- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the non-color `--nf-*` custom properties (spacing, fonts, radius) are defined, no color custom properties are defined, no shadow custom properties are defined, and no element selectors from the reset are applied

#### Scenario: Import colors only
- **WHEN** a consumer imports only `astro-nosferatu/styles/colors/index.css`
- **THEN** the `--nf-*` palette custom properties are defined, for both scales, and no element selectors are applied

#### Scenario: The old flat palette path is gone
- **WHEN** a consumer imports `astro-nosferatu/styles/colors.css`
- **THEN** module resolution fails, because no such file is published and no re-export shim stands in for it

#### Scenario: Import shadows only
- **WHEN** a consumer imports only `astro-nosferatu/styles/shadows.css`
- **THEN** the `--nf-shadow-*` custom properties are defined and no element selectors are applied

#### Scenario: No base stylesheet is published
- **WHEN** the published package is inspected, or a consumer imports `astro-nosferatu/styles/base.css`
- **THEN** no such file exists and the import fails, and nothing in the library sets a `body` color or font, a global focus outline, or a `::selection` treatment

#### Scenario: No typography stylesheet is published
- **WHEN** the published package is inspected, or a consumer imports `astro-nosferatu/styles/typography.css`
- **THEN** no such file exists and the import fails
- **AND** after importing `index.css`, headings, paragraphs, lists, links and code render at the browser's own sizes, weights, margins and colors, except where the reset changes them

### Requirement: Color palette
The palette SHALL define, on `:root`, the hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` and `yellow`, each with a dark scale (`-d-`) and a light scale (`-l-`) of steps `10` to `100` in tens, plus a 25%-opacity sibling for each of those tokens. The eight hues other than `grey` SHALL keep the OKLCH values of the Harmonizer export `harmonized-palette(2).css` unchanged; `grey` SHALL follow the ramp given in the grey palette requirement. Each token SHALL be named `--nf-<hue>-<d|l>-<step>` or `--nf-<hue>-<d|l>-<step>-25`. Tokens SHALL be ordered by hue name alphabetically, then within each file by ascending step, with the opaque tier written before the 25% tier. `-d-` tokens are the dark-mode scale and `-l-` tokens the light-mode scale.

#### Scenario: Palette is complete and prefixed
- **WHEN** the custom properties declared across `colors-dark.css` and `colors-light.css` are listed together
- **THEN** there are 360 of them (9 hues × 2 scales × 10 steps × 2 opacity tiers), every name matches `--nf-<hue>-<d|l>-<step>` or that name plus `-25`, and each opaque token of the eight pre-existing hues equals the export's value for the same unprefixed name

#### Scenario: Alphabetical order
- **WHEN** the declarations in `colors-dark.css` are read top to bottom
- **THEN** the hues appear in the order `blue, cyan, green, grey, orange, pink, purple, red, yellow`, and the same order holds in `colors-light.css`

#### Scenario: Grey sits between green and orange
- **WHEN** a consumer scans either palette file for the new hue
- **THEN** the `grey` block falls between the `green` block and the `orange` block, because the palette is alphabetical and nothing special-cases the neutral

### Requirement: Translucent palette tier
For every palette token `--nf-<hue>-<d|l>-<step>`, the palette SHALL also define `--nf-<hue>-<d|l>-<step>-25`, holding the same OKLCH color at 25% alpha. The 25% tokens for a hue SHALL be declared as one block following that hue's opaque block in the same file, and each value SHALL be written out literally — the same `oklch(L C H)` components with ` / 25%` appended — rather than computed from the base token at runtime.

#### Scenario: Every base color has a translucent sibling
- **WHEN** the declarations in either palette file are read
- **THEN** every `--nf-<hue>-<d|l>-<step>` has a matching `--nf-<hue>-<d|l>-<step>-25` in the same file, with the same lightness, chroma and hue and an alpha of 25%

#### Scenario: A translucent token lets the page through
- **WHEN** a consumer sets `background-color: var(--nf-purple-l-40-25)` on an element over a white page
- **THEN** the element renders as a pale purple tint rather than the solid `--nf-purple-l-40` fill

#### Scenario: Translucent tokens carry no new names
- **WHEN** the 25% tokens are inspected
- **THEN** each is named for the base token it derives from with a `-25` suffix, and no semantic or alias name is introduced

### Requirement: Shadow tokens
The library SHALL export a stylesheet `shadows.css` that defines, on `:root`, one custom property per palette color, named `--nf-shadow-<hue>-<d|l>-<step>`, whose value is the complete box-shadow `0px 4px 0px var(--nf-<hue>-<d|l>-<step>)` for the color of the same name — 180 properties, in the same hue order as the palette files — plus a single `--nf-shadow-depth` holding the shared offsets `0px 4px 0px` on their own, for a shadow whose color is resolved elsewhere. The values SHALL be written out literally rather than derived through a CSS function, so no `color-mix()`, relative color or custom-function support is required. `shadows.css` SHALL NOT define any other custom property, SHALL NOT contain element selectors, and SHALL NOT declare `box-shadow` on anything itself.

#### Scenario: A shadow token is a complete box-shadow value
- **WHEN** a consumer imports the palette and `shadows.css` and writes `box-shadow: var(--nf-shadow-purple-l-80)` on their own element
- **THEN** the element draws a solid `0px 4px 0px` shadow in the color `--nf-purple-l-80`

#### Scenario: Shadow tokens cover the whole palette
- **WHEN** the custom properties declared in `shadows.css` are listed
- **THEN** there are 181 of them — one for each `--nf-<hue>-<d|l>-<step>` token at steps 10 to 100 across all nine hues, plus `--nf-shadow-depth` — and no token for the 25%-opacity tier

#### Scenario: Grey has shadow tokens like every other hue
- **WHEN** a consumer writes `box-shadow: var(--nf-shadow-grey-d-90)`
- **THEN** the element draws a `0px 4px 0px` shadow in `--nf-grey-d-90`

#### Scenario: The depth token carries no color
- **WHEN** a consumer writes `box-shadow: var(--nf-shadow-depth) var(--my-color)`
- **THEN** the element draws the same `0px 4px 0px` shadow in their own color, because `--nf-shadow-depth` holds only the offsets
- **AND** a component whose shadow color changes with the color scheme can use it, which a complete shadow value cannot do: `light-dark()` resolves colors, not whole box-shadow values

#### Scenario: Shadows alone apply nothing
- **WHEN** a consumer imports only `astro-nosferatu/styles/shadows.css`
- **THEN** the `--nf-shadow-*` custom properties are defined, no element selectors are applied, and nothing on the page gains a shadow

#### Scenario: Shadow tokens need the palette
- **WHEN** a consumer imports `shadows.css` without the palette and uses a shadow token
- **THEN** the shadow does not render, because the palette token it references is undefined

### Requirement: No semantic color tokens
The library SHALL NOT define semantic color custom properties (such as `--nf-color-primary` or `--nf-color-text`). Library stylesheets and components SHALL reference colors only through the palette tokens defined under `styles/colors/`. Adding a neutral hue SHALL NOT change this: `grey` is a palette hue named for its appearance, not a semantic role, and no `--nf-neutral-*`, `--nf-surface-*` or `--nf-muted-*` alias SHALL be introduced alongside it.

#### Scenario: No --nf-color-* tokens
- **WHEN** the library's stylesheets and component styles are searched for `--nf-color-`
- **THEN** there are no declarations or references

#### Scenario: Every color reference resolves
- **WHEN** every `var(--nf-…)` used for a color in the library's stylesheets and components is checked against the palette files
- **THEN** each referenced token is defined in `colors-dark.css` or `colors-light.css`

#### Scenario: Grey gains no alias
- **WHEN** the library is searched for `--nf-neutral`, `--nf-surface` and `--nf-muted`
- **THEN** nothing is found, and the only way to reach the greyscale is a `--nf-grey-*` palette token

### Requirement: Components are self-styled through tokens
Each component SHALL carry its own scoped styles, and those styles SHALL reference design values only through `--nf-*` custom properties. Components SHALL NOT style elements outside their own markup.

#### Scenario: Re-theme by overriding a token
- **WHEN** a consumer imports `astro-nosferatu/styles/colors/index.css` and sets a palette token a `Button` uses for its background (for example `--nf-purple-l-40`) to a different value on `:root`
- **THEN** a rendered `Button` uses the new value

#### Scenario: No style leakage
- **WHEN** a page renders a `Button` next to a plain `<button>` element
- **THEN** the plain `<button>` is not affected by the component's styles

#### Scenario: Attribute selectors stay inside the component
- **WHEN** a page renders a plain `<button data-ui-color="green">` next to a `Button`
- **THEN** the plain button receives none of the component's colors or raised styling

### Requirement: Button color API
`Button` SHALL accept a `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`, defaulting to `purple`, and SHALL expose the resolved value on the rendered `<button>` as the attribute `data-ui-color`. `Button` SHALL NOT accept a `variant` prop. Every other `<button>` attribute SHALL continue to pass through to the element, and a consumer `class` SHALL be merged with the component's own classes.

#### Scenario: Default color
- **WHEN** a consumer renders `<Button>Button</Button>` with no `color`
- **THEN** the rendered element is `<button type="button" class="nf-button …" data-ui-color="purple">` and it is filled with the purple palette

#### Scenario: Explicit color
- **WHEN** a consumer renders `<Button color="green">Button</Button>`
- **THEN** the rendered element carries `data-ui-color="green"` and its background, text and shadow use green palette values

#### Scenario: A grey button
- **WHEN** a consumer renders `<Button color="grey">Button</Button>`
- **THEN** the rendered element carries `data-ui-color="grey"` and renders as a neutral grey button with the same raised shape, padding and interaction states as every other color

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

### Requirement: Callout content API
The library SHALL export a component `Callout` at `astro-nosferatu/components/Callout.astro` that presents a tinted panel of supporting content. It SHALL render a plain `<div>` — not a landmark element, so a consumer decides whether a given callout is one by passing `role` and a label. It SHALL accept a required `title` prop rendered as the panel's heading line, an optional `icon` prop holding a component that the callout renders before the title, an optional default slot holding the panel's body, and a `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`, defaulting to `purple` and exposed on the rendered element as `data-ui-color`. The `title` value SHALL NOT be forwarded to the element as the native `title` attribute, so it produces no browser tooltip. Every other native attribute of the rendered element SHALL pass through, and a consumer `class` SHALL be merged with the component's own classes.

#### Scenario: The rendered element is a div
- **WHEN** a rendered `Callout` is inspected
- **THEN** its root element is a `<div>` carrying `nf-callout`, with no implicit landmark role, and its title and body are both `<p>` elements

#### Scenario: Title only
- **WHEN** a consumer renders `<Callout title="What are harnesses?" />` with no children
- **THEN** the panel shows exactly that title, carries `data-ui-color="purple"`, and shows no separator rule, no empty body area and no extra space below the title

#### Scenario: Title and body
- **WHEN** a consumer renders `<Callout title="What are harnesses?">Harness is the infrastructure layer…</Callout>`
- **THEN** the panel shows the title, a full-width separator rule beneath it, and the body text below the rule

#### Scenario: A grey callout
- **WHEN** a consumer renders `<Callout title="Note" color="grey">Body</Callout>`
- **THEN** the panel carries `data-ui-color="grey"` and renders as a neutral grey panel with the same surface, rule, accent and shadow structure as every other color

#### Scenario: Whitespace-only children are still a body
- **WHEN** a consumer renders a `Callout` whose children are present but render nothing visible
- **THEN** the body area and its rule are rendered, because the decision is made on whether the slot was supplied

#### Scenario: The icon prop takes any component
- **WHEN** a consumer passes an imported `.svg`, a third-party icon component or one of their own components as `icon`
- **THEN** the callout renders that component, with no props of its own, immediately before the title and on the same line, and the library neither requires nor bundles any icon set

#### Scenario: A non-component icon is a type error
- **WHEN** a consumer writes `<Callout title="x" icon="bell" />` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `string` is not assignable to the `icon` prop

#### Scenario: The icon is sized by its box
- **WHEN** a consumer passes an icon component that sizes itself in `em` units
- **THEN** it renders at `--nf-callout-icon-size` — `1.5rem`, 24px at the default root size — in the title's color, and setting `--nf-callout-icon-size` on an ancestor resizes it while the title keeps its own `1rem` size
- **AND** a component with a fixed size keeps that size, because the callout passes it no props

#### Scenario: No icon by default
- **WHEN** a consumer renders a `Callout` with no `icon`
- **THEN** no icon box is rendered and the title starts at the panel's inner edge, with no space reserved for an icon

#### Scenario: Title is not a tooltip
- **WHEN** a reader hovers the body of a `Callout` rendered with `title="Heads up"`
- **THEN** no browser tooltip appears, and the rendered element carries no `title` attribute

#### Scenario: Invalid color is a type error
- **WHEN** a consumer writes `<Callout title="x" color="teal" />` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop

#### Scenario: The color attribute cannot be overridden from outside
- **WHEN** a consumer renders `<Callout title="x" data-ui-color="teal" />`
- **THEN** the rendered element carries `data-ui-color="purple"` exactly once, the consumer's value is dropped, and the panel keeps its default coloring

#### Scenario: Native attributes still pass through
- **WHEN** a consumer renders `<Callout title="x" id="intro" class="my-callout" aria-describedby="note">Body</Callout>`
- **THEN** the rendered element carries `id="intro"` and `aria-describedby="note"`, and its class list contains both the component's own class and `my-callout`

### Requirement: Cascade layer order without a base layer
When loaded through `index.css`, the tokens, colors, shadows and reset styles SHALL be placed in the cascade layers `nosferatu.tokens`, `nosferatu.colors`, `nosferatu.shadows` and `nosferatu.reset`, declared in that order, so later layers win over earlier ones and any unlayered consumer CSS wins over all of them. The palette's own nested imports SHALL NOT introduce or name a layer of their own: they inherit `nosferatu.colors` from the single layered import in `index.css`.

#### Scenario: The reset is the last library layer
- **WHEN** a rule in `nosferatu.reset` and a rule in any earlier library layer style the same element property
- **THEN** the `nosferatu.reset` value applies

#### Scenario: Consumer CSS wins without extra specificity
- **WHEN** a consumer writes an unlayered rule `h1 { color: red; }` after importing `index.css`
- **THEN** `h1` elements are red, regardless of any library rule

#### Scenario: Consumer token override wins regardless of order
- **WHEN** a consumer sets `--nf-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: Consumer shadow override wins regardless of order
- **WHEN** a consumer sets `--nf-shadow-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: No base layer is declared
- **WHEN** the `@layer` statement in `index.css` is read
- **THEN** it names exactly `nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset`, with no `nosferatu.base` and no `nosferatu.typography`

#### Scenario: The palette folder declares no layer
- **WHEN** `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css` are searched for `@layer`
- **THEN** none of them contains one, and a consumer importing a scale file directly gets unlayered palette tokens
