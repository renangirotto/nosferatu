# Spec Delta

## ADDED Requirements

### Requirement: Shadow tokens
The library SHALL export a stylesheet `shadows.css` that defines, on `:root`, one custom property per palette color, named `--nf-shadow-<hue>-<d|l>-<step>`, whose value is the complete box-shadow `0px 4px 0px var(--nf-<hue>-<d|l>-<step>)` for the color of the same name — 160 properties, in the same order as `colors.css` — plus a single `--nf-shadow-depth` holding the shared offsets `0px 4px 0px` on their own, for a shadow whose color is resolved elsewhere. The values SHALL be written out literally rather than derived through a CSS function, so no `color-mix()`, relative color or custom-function support is required. `shadows.css` SHALL NOT define any other custom property, SHALL NOT contain element selectors, and SHALL NOT declare `box-shadow` on anything itself.

#### Scenario: A shadow token is a complete box-shadow value
- **WHEN** a consumer imports `colors.css` and `shadows.css` and writes `box-shadow: var(--nf-shadow-purple-l-80)` on their own element
- **THEN** the element draws a solid `0px 4px 0px` shadow in the color `--nf-purple-l-80`

#### Scenario: Shadow tokens cover the whole palette
- **WHEN** the custom properties declared in `shadows.css` are listed
- **THEN** there are 161 of them — one for each `--nf-<hue>-<d|l>-<step>` token at steps 10 to 100, plus `--nf-shadow-depth` — and no token for the 25%-opacity tier

#### Scenario: The depth token carries no color
- **WHEN** a consumer writes `box-shadow: var(--nf-shadow-depth) var(--my-color)`
- **THEN** the element draws the same `0px 4px 0px` shadow in their own color, because `--nf-shadow-depth` holds only the offsets
- **AND** a component whose shadow color changes with the color scheme can use it, which a complete shadow value cannot do: `light-dark()` resolves colors, not whole box-shadow values

#### Scenario: Shadows alone apply nothing
- **WHEN** a consumer imports only `astro-nosferatu/styles/shadows.css`
- **THEN** the `--nf-shadow-*` custom properties are defined, no element selectors are applied, and nothing on the page gains a shadow

#### Scenario: Shadow tokens need the palette
- **WHEN** a consumer imports `shadows.css` without `colors.css` and uses a shadow token
- **THEN** the shadow does not render, because the palette token it references is undefined

### Requirement: Translucent palette tier
For every palette token `--nf-<hue>-<d|l>-<step>`, `colors.css` SHALL also define `--nf-<hue>-<d|l>-<step>-25`, holding the same OKLCH color at 25% alpha. Each 25% token SHALL be declared immediately after the token it is derived from, and its value SHALL be written out literally — the same `oklch(L C H)` components with ` / 25%` appended — rather than computed from the base token at runtime.

#### Scenario: Every base color has a translucent sibling
- **WHEN** the declarations in `colors.css` are read
- **THEN** every `--nf-<hue>-<d|l>-<step>` is immediately followed by `--nf-<hue>-<d|l>-<step>-25` with the same lightness, chroma and hue and an alpha of 25%

#### Scenario: A translucent token lets the page through
- **WHEN** a consumer sets `background-color: var(--nf-purple-l-40-25)` on an element over a white page
- **THEN** the element renders as a pale purple tint rather than the solid `--nf-purple-l-40` fill

#### Scenario: Translucent tokens carry no new names
- **WHEN** the 25% tokens are inspected
- **THEN** each is named for the base token it derives from with a `-25` suffix, and no semantic or alias name is introduced

### Requirement: Shared prop types
Prop types used by more than one component SHALL live in `src/types/`, exported by name — the palette hues a `color` prop accepts SHALL be the exported type `ColorPalette` — and components SHALL reference them instead of restating the literal union. Published component source SHALL import those modules by relative path, never through a path alias, because a consuming project does not have the library's alias configured and an unresolved type import degrades the prop to `any`, silently removing the prop's type checking on the consumer's side.

#### Scenario: One definition of the palette hues
- **WHEN** `Button`'s and `Callout`'s `color` props are inspected
- **THEN** both are typed `ColorPalette`, imported from the library's shared types, and neither restates the list of hues

#### Scenario: Invalid color is still a type error in a consuming project
- **WHEN** a consuming Astro project whose TypeScript configuration has no alias for the library's internals writes `<Callout title="x" color="teal" />` in an `.astro` file and runs `astro check`
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop

### Requirement: Component class and property naming
Every class a component renders SHALL be `nf-` prefixed, with the root class `nf-<component name>` and every other part `nf-<component name>-<part>`, using plain hyphens — the library SHALL NOT use BEM `__` element or `--` modifier separators. Every component-scoped custom property SHALL be named `--nf-<component name>-<role>`, spelling the component's full name rather than an abbreviation. Within any rule in a component's styles, custom property declarations SHALL come before the rule's ordinary declarations.

#### Scenario: Callout's parts
- **WHEN** a rendered `Callout` is inspected
- **THEN** its element carries `nf-callout`, its title `nf-callout-title`, its icon box `nf-callout-icon` and its body `nf-callout-body`, and no class contains `__` or `--`

#### Scenario: Properties spell the component out
- **WHEN** a consumer looks for the properties that theme `Button` and `Callout`
- **THEN** they are `--nf-button-*` and `--nf-callout-*`, and no `--nf-btn-*` or `--nf-cal-*` property exists

### Requirement: Callout content API
The library SHALL export a component `Callout` at `astro-nosferatu/components/Callout.astro` that presents a tinted panel of supporting content. It SHALL render a plain `<div>` — not a landmark element, so a consumer decides whether a given callout is one by passing `role` and a label. It SHALL accept a required `title` prop rendered as the panel's heading line, an optional `icon` prop holding a component that the callout renders before the title, an optional default slot holding the panel's body, and a `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` or `yellow`, defaulting to `purple` and exposed on the rendered element as `data-ui-color`. The `title` value SHALL NOT be forwarded to the element as the native `title` attribute, so it produces no browser tooltip. Every other native attribute of the rendered element SHALL pass through, and a consumer `class` SHALL be merged with the component's own classes.

#### Scenario: The rendered element is a div
- **WHEN** a rendered `Callout` is inspected
- **THEN** its root element is a `<div>` carrying `nf-callout`, with no implicit landmark role, and its title and body are both `<p>` elements

#### Scenario: Title only
- **WHEN** a consumer renders `<Callout title="What are harnesses?" />` with no children
- **THEN** the panel shows exactly that title, carries `data-ui-color="purple"`, and shows no separator rule, no empty body area and no extra space below the title

#### Scenario: Title and body
- **WHEN** a consumer renders `<Callout title="What are harnesses?">Harness is the infrastructure layer…</Callout>`
- **THEN** the panel shows the title, a full-width separator rule beneath it, and the body text below the rule

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

### Requirement: Callout color resolution
`Callout`'s color SHALL be resolved through exactly five component-scoped custom properties, each spelling the component's full name: `--nf-callout-surface-color` for its background, `--nf-callout-accent-color` for the title, the icon and the body text, `--nf-callout-rule-color` for the separator between title and body, `--nf-callout-shadow-color` for the color of its drop shadow, and `--nf-callout-shadow` for the complete drop-shadow value. Each `data-ui-color` value SHALL set the first four from the palette with `light-dark()`, using the 25%-opacity tier for the surface (`--nf-<hue>-l-40-25` light, `--nf-<hue>-d-50-25` dark), for the rule (`--nf-<hue>-l-80-25` light, `--nf-<hue>-d-30-25` dark) and for the shadow color (`--nf-<hue>-l-70-25` light, `--nf-<hue>-d-90-25` dark), and the opaque palette for the accent (`--nf-<hue>-l-80` light, `--nf-<hue>-d-30` dark). The shadow's step SHALL pair with the surface's own step in each scheme — `l-40` with `l-70`, `d-50` with `d-90` — so the shadow is always a darker tint of the panel, and SHALL be translucent rather than opaque, so the page shows through it the way it shows through the surface. `--nf-callout-shadow` SHALL be composed once, for every hue, as `var(--nf-shadow-depth) var(--nf-callout-shadow-color)`, so the depth comes from `shadows.css` and the color follows the scheme. No other palette token SHALL be referenced for the callout's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance
- **WHEN** the page resolves to a light color scheme and a `Callout` with `color="purple"` is inspected
- **THEN** its computed background equals `--nf-purple-l-40-25`, its title, icon and body color equal `--nf-purple-l-80`, its rule color equals `--nf-purple-l-80-25`, and its shadow color equals `--nf-purple-l-70-25`

#### Scenario: Shadow pairs with the surface step
- **WHEN** a `Callout`'s surface and shadow steps are compared in each scheme
- **THEN** a light panel's `l-40` surface is shadowed with `l-70`, and a dark panel's `d-50` surface is shadowed with `d-90`, both at 25% alpha

#### Scenario: Dark appearance
- **WHEN** the page resolves to a dark color scheme and the same `Callout` is inspected
- **THEN** its computed background equals `--nf-purple-d-50-25`, its title, icon and body color equal `--nf-purple-d-30`, its rule color equals `--nf-purple-d-30-25`, and its shadow color equals `--nf-purple-d-90-25`

#### Scenario: The surface shows the page through it
- **WHEN** a `Callout` is placed over a colored background
- **THEN** that background remains visible through the panel's tint, because the surface color carries 25% alpha

#### Scenario: Text stays legible in both schemes
- **WHEN** a reader flips between light and dark on a page of callouts
- **THEN** the accent reads as a dark tint of the hue over the pale surface in light, and as a light tint of the hue over the darkened surface in dark

#### Scenario: Re-theme one callout by overriding the component properties
- **WHEN** a consumer sets `--nf-callout-surface-color` and `--nf-callout-accent-color` in unlayered CSS on an ancestor of a `Callout`
- **THEN** that callout uses the consumer's values and no other callout on the page changes

#### Scenario: Re-theme by overriding a palette token
- **WHEN** a consumer overrides `--nf-red-l-40-25` on `:root` in unlayered CSS
- **THEN** every light-scheme `Callout` with `color="red"` picks up the new surface tint

#### Scenario: The shadow depth comes from shadows.css
- **WHEN** a consumer loads `tokens.css` and `colors.css` but not `shadows.css`, and renders a `Callout`
- **THEN** the panel renders with its surface, accent and rule intact but draws no drop shadow, because `--nf-shadow-depth` is undefined

#### Scenario: The shadow follows the scheme
- **WHEN** the same `Callout` is inspected in a light subtree and in a subtree pinned with `color-scheme: only dark`
- **THEN** its shadow is `0px 4px 0px` in each subtree's own 25%-opacity shadow color, not a single fixed color

#### Scenario: The shadow is translucent
- **WHEN** a `Callout` is placed so that its shadow falls over page content
- **THEN** that content stays visible through the shadow, because the shadow color carries 25% alpha

### Requirement: Callout appearance
`Callout` SHALL render as a panel with no border, a `0.5rem` corner radius, `1.5rem` of padding on all sides, and the `0px 4px 0px` drop shadow supplied by `--nf-callout-shadow`, giving it the same raised look as `Button`. Every piece of text it renders — title and body alike — SHALL use `font-size: 1rem` and `font-weight: 500`, and both SHALL be rendered as paragraphs: the title SHALL NOT be a heading element, so it does not enter the document outline, and the body SHALL carry no margin of its own beyond the spacing described below, whatever the typography stylesheet gives a `<p>`. When a body is present, it SHALL be separated from the title by a `1px` rule in `--nf-callout-rule-color` spanning the panel's content width, with `1rem` of space between the title and the rule and between the rule and the body. The title row SHALL lay its icon and text out on one line with the icon vertically centred against the first line of the title and `0.5rem` between them. The icon's box SHALL set `font-size` to the component-scoped `--nf-callout-icon-size`, `1.5rem` by default, so content sized in `em` renders at 24px against the `1rem` title; a consumer MAY override that property. `Callout` SHALL define no hover, focus, active or disabled behaviour and SHALL NOT animate.

#### Scenario: Resting appearance
- **WHEN** a reader looks at a `Callout`
- **THEN** it shows a tinted rounded panel with no border, a 4px-deep shadow directly beneath it in a translucent, darker tint of its own hue, and 1.5rem of padding around its content

#### Scenario: One typographic size and weight
- **WHEN** the title and the body text of a `Callout` are inspected
- **THEN** both compute to `font-size: 16px` at the default root size and `font-weight: 500`

#### Scenario: Title is not a heading
- **WHEN** a page's heading outline is inspected
- **THEN** a `Callout`'s title does not appear in it

#### Scenario: Body-less callout has no leftover space
- **WHEN** a `Callout` with no children and one with children are compared
- **THEN** the body-less panel's height is exactly its padding plus its title line, with no rule and no trailing gap

#### Scenario: Callout does not react to the pointer
- **WHEN** a reader hovers, clicks or tabs through a `Callout`
- **THEN** its appearance does not change

## MODIFIED Requirements

### Requirement: Button color resolution
`Button`'s color SHALL be resolved through exactly two component-scoped custom properties: `--nf-button-color`, which supplies the background, and `--nf-button-accent-color`, which supplies the text color, the box-shadow color and the focus outline color. Each `data-ui-color` value SHALL set both properties from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-button-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-button-accent-color`. No other palette token SHALL be referenced for the button's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance
- **WHEN** the page resolves to a light color scheme and a `Button` with `color="purple"` is inspected
- **THEN** its computed background equals the value of `--nf-purple-l-40`, and its computed color and box-shadow color both equal the value of `--nf-purple-l-80`

#### Scenario: Dark appearance
- **WHEN** the page resolves to a dark color scheme and the same `Button` is inspected
- **THEN** its computed background equals `--nf-purple-d-50`, and its color and box-shadow color both equal `--nf-purple-d-90`

#### Scenario: Re-theme one button by overriding the component properties
- **WHEN** a consumer sets `--nf-button-color` and `--nf-button-accent-color` in unlayered CSS on an ancestor of a `Button`
- **THEN** that button uses the consumer's two values and no other button on the page changes

#### Scenario: Re-theme by overriding a palette token
- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Button` with `color="purple"` picks up the new background

### Requirement: Button appearance and interaction states
`Button` SHALL render at `font-size: 1rem` with `padding-block: 8px`, `padding-inline: 16px`, `border-radius: 8px`, no border, and a `0px 4px 0px` box-shadow in `--nf-button-accent-color`, giving a raised appearance. On hover, and whenever focus is within it, it SHALL translate down by `2px` and reduce the shadow to `0px 2px 0px`; while active it SHALL translate down by `4px` and reduce the shadow to `0px 0px 0px`, so the button appears pressed flat. The sum of the translation and the shadow depth SHALL stay constant across the states, so the button's bottom edge does not move. Every property that changes between these states SHALL animate over `0.15s` with an `ease-in-out` timing function, except when the user has requested reduced motion, in which case the states SHALL apply instantly. On `:focus-visible` the button SHALL additionally draw a `2px` solid outline in `--nf-button-accent-color`, inset by its own width so that it reads as a border on the button rather than a ring around it. The button SHALL NOT apply the hover, focus or active movement while disabled.

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

### Requirement: Exported stylesheets
The library SHALL export the stylesheets `tokens.css`, `colors.css`, `shadows.css`, `reset.css`, `typography.css` and `index.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of the others.

#### Scenario: Import everything
- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens, colors, shadows, reset and typography styles are all applied

#### Scenario: Import tokens only
- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the non-color `--nf-*` custom properties (spacing, fonts, radius) are defined, no color custom properties are defined, no shadow custom properties are defined, and no element selectors from reset or typography are applied

#### Scenario: Import colors only
- **WHEN** a consumer imports only `astro-nosferatu/styles/colors.css`
- **THEN** the `--nf-*` palette custom properties are defined and no element selectors are applied

#### Scenario: Import shadows only
- **WHEN** a consumer imports only `astro-nosferatu/styles/shadows.css`
- **THEN** the `--nf-shadow-*` custom properties are defined and no element selectors are applied

#### Scenario: No base stylesheet is published
- **WHEN** the published package is inspected, or a consumer imports `astro-nosferatu/styles/base.css`
- **THEN** no such file exists and the import fails, and nothing in the library sets a `body` color or font, a global focus outline, or a `::selection` treatment

### Requirement: Cascade layer order without a base layer
When loaded through `index.css`, the tokens, colors, shadows, reset and typography styles SHALL be placed in the cascade layers `nosferatu.tokens`, `nosferatu.colors`, `nosferatu.shadows`, `nosferatu.reset` and `nosferatu.typography`, declared in that order, so later layers win over earlier ones and any unlayered consumer CSS wins over all of them.

#### Scenario: Typography overrides the reset
- **WHEN** both `nosferatu.reset` and `nosferatu.typography` style the same element property
- **THEN** the `nosferatu.typography` value applies

#### Scenario: Consumer CSS wins without extra specificity
- **WHEN** a consumer writes an unlayered rule `h1 { color: red; }` after importing `index.css`
- **THEN** `h1` elements are red, regardless of the library's typography rules

#### Scenario: Consumer token override wins regardless of order
- **WHEN** a consumer sets `--nf-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: Consumer shadow override wins regardless of order
- **WHEN** a consumer sets `--nf-shadow-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: No base layer is declared
- **WHEN** the `@layer` statement in `index.css` is read
- **THEN** it names exactly `nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset, nosferatu.typography`, with no `nosferatu.base`

### Requirement: Color palette
`colors.css` SHALL define, on `:root`, exactly the palette from the Harmonizer export `harmonized-palette(2).css`: the hues `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`, each with a dark scale (`-d-`) and a light scale (`-l-`) of steps `10` to `100` in tens, with the export's OKLCH values unchanged, plus a 25%-opacity sibling for each of those tokens. Each token SHALL be named `--nf-<hue>-<d|l>-<step>` or `--nf-<hue>-<d|l>-<step>-25`. Tokens SHALL be ordered by hue name alphabetically, then dark scale before light scale, then by ascending step, with each 25% token immediately after its base token. `-d-` tokens are the dark-mode scale and `-l-` tokens the light-mode scale.

#### Scenario: Palette is complete and prefixed
- **WHEN** the custom properties declared in `colors.css` are listed
- **THEN** there are 320 of them (8 hues × 2 scales × 10 steps × 2 opacity tiers), every name matches `--nf-<hue>-<d|l>-<step>` or that name plus `-25`, and each opaque token's value equals the export's value for the same unprefixed name

#### Scenario: Alphabetical order
- **WHEN** the declarations in `colors.css` are read top to bottom
- **THEN** they appear as `blue-d-10, blue-d-10-25, blue-d-20, blue-d-20-25 … blue-d-100-25, blue-l-10 … cyan-d-10 …` through `yellow-l-100-25`
