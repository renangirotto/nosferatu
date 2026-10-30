# Spec Delta

## ADDED Requirements

### Requirement: Spacing scale

The library SHALL publish its spacing scale as the stylesheet `spacings.css`, which SHALL declare on `:root` exactly ten custom properties, named around a `16px` base and written as absolute `px` values: `--nf-spacing-none` (`0px`), `--nf-spacing-base-low-4` (`2px`), `--nf-spacing-base-low-3` (`4px`), `--nf-spacing-base-low-2` (`8px`), `--nf-spacing-base-low-1` (`12px`), `--nf-spacing-base` (`16px`), `--nf-spacing-base-up-1` (`20px`), `--nf-spacing-base-up-2` (`24px`), `--nf-spacing-base-up-3` (`28px`) and `--nf-spacing-base-up-4` (`32px`). The scale SHALL be ordered from `none` through the `low` steps to the base and on through the `up` steps, so the file reads as one ascending ramp.

These SHALL be the library's only tokens for space between and inside elements, and SHALL be the tokens its own components use for `margin`, `padding`, `gap` and equivalent properties. They SHALL NOT be used for border widths, shadow offsets, translation distances or type metrics, which are not spacing. The library SHALL publish no other spacing token: no `--nf-space-*` property SHALL exist.

#### Scenario: The scale is defined

- **WHEN** a consumer imports `astro-nosferatu/styles/spacings.css` and inspects the computed `:root` properties
- **THEN** all ten `--nf-spacing-*` properties are defined with the values above, no other custom property is defined by that file, and no element selector is applied

#### Scenario: The scale does not follow the root font size

- **WHEN** a consumer sets `html { font-size: 20px }` and renders a `Button`
- **THEN** its padding is still `8px` by `16px`, because the spacing tokens are absolute `px` rather than `rem`

#### Scenario: Retune one step

- **WHEN** a consumer sets `--nf-spacing-base: 20px` on `:root` in unlayered CSS
- **THEN** every library component that pads with `--nf-spacing-base` picks up `20px`, with no selector rewritten and no specificity raised

#### Scenario: The old spacing tokens are gone

- **WHEN** the library's stylesheets are searched for `--nf-space-`
- **THEN** nothing matches, and a consumer's `padding: var(--nf-space-4)` resolves to nothing unless they define the property themselves

### Requirement: Border radius scale

The library SHALL publish its border tokens as the stylesheet `borders.css`, which SHALL declare on `:root` exactly three custom properties, written as absolute `px` values: `--nf-border-radius-base-low-1` (`4px`), `--nf-border-radius-base` (`8px`) and `--nf-border-radius-base-up-1` (`12px`). `borders.css` SHALL define no other token — no border width, no border style and no border color — so a component that draws a border states the width itself and takes the color from the palette.

Every corner the library rounds SHALL come from this scale. The library SHALL publish no other radius token: no `--nf-radius-*` property SHALL exist, and no token SHALL stand for a fully rounded, pill-shaped corner.

#### Scenario: The scale is defined

- **WHEN** a consumer imports `astro-nosferatu/styles/borders.css` and inspects the computed `:root` properties
- **THEN** exactly the three `--nf-border-radius-*` properties are defined with the values above, no border-width, border-style or border-color property is defined, and no element selector is applied

#### Scenario: Components round their corners from the scale

- **WHEN** a `Button`, a `Callout` and an `Accordion` are inspected
- **THEN** each computes an `8px` corner radius, and setting `--nf-border-radius-base: 0px` on `:root` in unlayered CSS squares all three

#### Scenario: The old radius tokens are gone

- **WHEN** the library's stylesheets are searched for `--nf-radius-`
- **THEN** nothing matches, and no replacement exists for the former `--nf-radius-full`

## MODIFIED Requirements

### Requirement: Stylesheet exports

The library SHALL export the stylesheets `tokens.css`, `spacings.css`, `borders.css`, `shadows.css`, `reset.css`, `typography.css` and `index.css`, and the palette as the folder `colors/`, holding `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of them.

`tokens.css` SHALL be the library's single entry point for tokens and SHALL declare no custom property of its own: it SHALL be exactly the aggregate of the token stylesheets — the palette, the shadows, the spacing scale and the border radii — so that a consumer who imports it gets every token the library publishes except the typographic ones, which `typography.css` owns because it also owns the element rules that use them. A consumer who wants one group on its own SHALL still be able to import that file directly instead.

The library SHALL NOT publish a stylesheet at `styles/colors.css`. `typography.css` SHALL be the only library stylesheet other than `reset.css` that applies rules to a consumer's own elements, and it SHALL set text size, font family and font weight only: the library still sets no line-height, margin or color on headings, paragraphs, lists, links or code, and sets a family and a weight on `body` alone, never on an individual element.

#### Scenario: Import everything

- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens — palette, shadows, spacing and border radii alike — together with the reset and the typography styles are all applied

#### Scenario: Import tokens only

- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the palette, shadow, spacing and border-radius custom properties are all defined, no `--nf-typography-*`, `--nf-font-family*` or `--nf-font-weight` property is defined, and no element selectors from the reset are applied

#### Scenario: Tokens define nothing themselves

- **WHEN** `tokens.css` is read
- **THEN** it contains only `@import` rules for `colors/index.css`, `shadows.css`, `spacings.css` and `borders.css`, and declares no custom property and no selector of its own

#### Scenario: Import colors only

- **WHEN** a consumer imports only `astro-nosferatu/styles/colors/index.css`
- **THEN** the `--nf-*` palette custom properties are defined, for both scales, and no element selectors are applied

#### Scenario: The old flat palette path is gone

- **WHEN** a consumer imports `astro-nosferatu/styles/colors.css`
- **THEN** module resolution fails, because no such file is published and no re-export shim stands in for it

#### Scenario: Import shadows only

- **WHEN** a consumer imports only `astro-nosferatu/styles/shadows.css`
- **THEN** the `--nf-shadow-*` custom properties are defined and no element selectors are applied

#### Scenario: Import spacing only

- **WHEN** a consumer imports only `astro-nosferatu/styles/spacings.css`
- **THEN** the `--nf-spacing-*` custom properties are defined, no palette, shadow, border-radius or typographic property is defined, and no element selectors are applied

#### Scenario: Import borders only

- **WHEN** a consumer imports only `astro-nosferatu/styles/borders.css`
- **THEN** the `--nf-border-radius-*` custom properties are defined, no palette, shadow, spacing or typographic property is defined, and no element selectors are applied

#### Scenario: Import typography only

- **WHEN** a consumer imports only `astro-nosferatu/styles/typography.css`
- **THEN** the `--nf-typography-*` custom properties are defined, the three `--nf-font-family*` properties and `--nf-font-weight` are defined, `h1`, `h2`, `h3` and `p` are sized by the fluid scale, and `body` carries the general font family and weight, without needing `tokens.css`, the palette, `shadows.css`, `spacings.css`, `borders.css` or `reset.css` to be loaded
- **AND** no color, spacing, radius or shadow custom property is defined, and no element gains a color, line-height or margin

#### Scenario: No base stylesheet is published

- **WHEN** the published package is inspected, or a consumer imports `astro-nosferatu/styles/base.css`
- **THEN** no such file exists and the import fails, and nothing in the library sets a `body` color, a global focus outline, or a `::selection` treatment

#### Scenario: Opting out of typography

- **WHEN** a consumer wants the library's tokens and reset but not its text sizing or its fonts, and imports `tokens.css` and `reset.css` individually instead of `index.css`
- **THEN** headings and paragraphs render at the browser's own sizes in the browser's own font, and no `--nf-typography-*`, `--nf-font-family*` or `--nf-font-weight` property is defined

#### Scenario: Keeping the fonts without the scale

- **WHEN** a consumer imports `index.css` and sets `--nf-typography-font-size-h1`, `-h2`, `-h3` and `-p` to constants in unlayered CSS
- **THEN** the page keeps the library's font families and weight and loses only the fluid sizing, because family and size are separate properties

### Requirement: Cascade layer order

When loaded through `index.css`, the tokens, reset and typography styles SHALL be placed in the cascade layers `nosferatu.tokens`, `nosferatu.reset` and `nosferatu.typography`, declared in that order, so later layers win over earlier ones and any unlayered consumer CSS wins over all of them. `nosferatu.typography` SHALL be the last library layer, so the type scale wins over the reset where the two touch the same property.

`nosferatu.tokens` SHALL be the only layer holding custom properties: the palette, the shadows, the spacing scale and the border radii all arrive in it through the single layered import of `tokens.css`. No `nosferatu.colors`, `nosferatu.shadows` or `nosferatu.base` layer SHALL be declared. None of the token stylesheets — `tokens.css`, `colors/index.css`, `colors/colors-dark.css`, `colors/colors-light.css`, `shadows.css`, `spacings.css` or `borders.css` — SHALL introduce or name a layer of its own: they inherit `nosferatu.tokens` from that one import, and a consumer importing any of them directly gets unlayered tokens.

#### Scenario: Typography is the last library layer

- **WHEN** a rule in `nosferatu.typography` and a rule in any earlier library layer style the same element property
- **THEN** the `nosferatu.typography` value applies

#### Scenario: The reset wins over tokens, colors and shadows

- **WHEN** a rule in `nosferatu.reset` and a rule in `nosferatu.tokens` — which is where the tokens, the colors and the shadows now all sit — style the same element property
- **THEN** the `nosferatu.reset` value applies

#### Scenario: Consumer CSS wins without extra specificity

- **WHEN** a consumer writes an unlayered rule `h1 { color: red; }` after importing `index.css`
- **THEN** `h1` elements are red, regardless of any library rule

#### Scenario: Consumer type-size override wins without extra specificity

- **WHEN** a consumer writes an unlayered rule `h1 { font-size: 2rem; }` after importing `index.css`
- **THEN** `h1` elements are `2rem`, because the library's rule sits in a layer and the consumer's does not

#### Scenario: Consumer token override wins regardless of order

- **WHEN** a consumer sets `--nf-red-l-80`, `--nf-spacing-base` or `--nf-border-radius-base` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies in every case

#### Scenario: Consumer shadow override wins regardless of order

- **WHEN** a consumer sets `--nf-shadow-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies, even though the shadows now arrive inside `nosferatu.tokens`

#### Scenario: Consumer typography override wins regardless of order

- **WHEN** a consumer sets `--nf-typography-font-size-h1-max` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: No base layer is declared

- **WHEN** the `@layer` statement in `index.css` is read
- **THEN** it names exactly `nosferatu.tokens, nosferatu.reset, nosferatu.typography`, with no `nosferatu.colors`, `nosferatu.shadows` or `nosferatu.base`

#### Scenario: Layering alongside the library's tokens

- **WHEN** a consumer wants their token overrides inside the library's layer order rather than unlayered
- **THEN** `@layer nosferatu.tokens { … }` is the one layer to target for the palette, the shadows, the spacing and the radii alike, and a rule written into the former `nosferatu.colors` or `nosferatu.shadows` creates a new consumer layer after the library's instead of joining one of its own

#### Scenario: No token stylesheet declares a layer

- **WHEN** `tokens.css`, `colors/index.css`, `colors/colors-dark.css`, `colors/colors-light.css`, `shadows.css`, `spacings.css` and `borders.css` are searched for `@layer`
- **THEN** none of them contains one, and a consumer importing any of them directly gets unlayered tokens

#### Scenario: The palette folder declares no layer

- **WHEN** `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css` are searched for `@layer`
- **THEN** none of them contains one, and a consumer importing a scale file directly gets unlayered palette tokens

#### Scenario: Typography declares no layer of its own

- **WHEN** `typography.css` is searched for `@layer`
- **THEN** it contains none, so a consumer importing it directly gets unlayered rules and it takes `nosferatu.typography` only from the layered import in `index.css`

### Requirement: Components are self-styled through tokens

Each component SHALL carry its own scoped styles, and those styles SHALL take every value that has a library token from that token: colors from the palette, shadow offsets from `shadows.css`, space from the spacing scale and corner radii from the border-radius scale. A component SHALL NOT write a literal color, a literal margin, padding or gap, or a literal corner radius.

A value with no library token — a type size, a font weight, a line height, a border width, a transition duration, a travel distance — SHALL either be written inline or be held in a component-scoped `--nf-<component name>-*` property, and SHALL be held in such a property whenever it appears more than once in the component or is meant to be retunable from outside. Font family SHALL come from `--nf-font-family`, published by `typography.css`, so that a consumer's substitution reaches the components too.

Components SHALL NOT style elements outside their own markup.

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

### Requirement: Callout color resolution

`Callout`'s color SHALL be resolved through exactly five component-scoped custom properties, each spelling the component's full name: `--nf-callout-surface-color` for its background, `--nf-callout-accent-color` for the title, the icon and the body text, `--nf-callout-rule-color` for the separator between title and body, `--nf-callout-shadow-color` for the color of its drop shadow, and `--nf-callout-shadow` for the complete drop-shadow value. Each `data-ui-color` value SHALL set the first four from the palette with `light-dark()`, using the 25%-opacity tier for the surface (`--nf-<hue>-l-40-25` light, `--nf-<hue>-d-50-25` dark), for the rule (`--nf-<hue>-l-80-25` light, `--nf-<hue>-d-30-25` dark) and for the shadow color (`--nf-<hue>-l-70-25` light, `--nf-<hue>-d-90-25` dark), and the opaque palette for the accent (`--nf-<hue>-l-80` light, `--nf-<hue>-d-30` dark). Where any of those four is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of it SHALL fall back to the grey token of the same step and tier. The shadow's step SHALL pair with the surface's own step in each scheme — `l-40` with `l-70`, `d-50` with `d-90` — so the shadow is always a darker tint of the panel, and SHALL be translucent rather than opaque, so the page shows through it the way it shows through the surface. `--nf-callout-shadow` SHALL be composed once, for every hue and for the default, from `var(--nf-shadow-depth)` and the shadow color, so the depth comes from `shadows.css` and the color follows the scheme. No other palette token SHALL be referenced for the callout's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and a `Callout` with `color="purple"` is inspected
- **THEN** its computed background equals `--nf-purple-l-40-25`, its title, icon and body color equal `--nf-purple-l-80`, its rule color equals `--nf-purple-l-80-25`, and its shadow color equals `--nf-purple-l-70-25`

#### Scenario: Shadow pairs with the surface step

- **WHEN** a `Callout`'s surface and shadow steps are compared in each scheme
- **THEN** a light panel's `l-40` surface is shadowed with `l-70`, and a dark panel's `d-50` surface is shadowed with `d-90`, both at 25% alpha

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Callout` is inspected
- **THEN** its computed background equals `--nf-purple-d-50-25`, its title, icon and body color equal `--nf-purple-d-30`, its rule color equals `--nf-purple-d-30-25`, and its shadow color equals `--nf-purple-d-90-25`

#### Scenario: Default appearance

- **WHEN** a `Callout` with no `color` and a body is inspected in a light and then a dark color scheme
- **THEN** its surface, accent, rule and shadow colors equal the `grey` tokens a `color="grey"` callout uses in that scheme

#### Scenario: The surface shows the page through it

- **WHEN** a `Callout` is placed over a colored background
- **THEN** that background remains visible through the panel's tint, because the surface color carries 25% alpha

#### Scenario: Text stays legible in both schemes

- **WHEN** a reader flips between light and dark on a page of callouts
- **THEN** the accent reads as a dark tint of the hue over the pale surface in light, and as a light tint of the hue over the darkened surface in dark

#### Scenario: Re-theme one callout by overriding the component properties

- **WHEN** a consumer sets `--nf-callout-surface-color` and `--nf-callout-accent-color` in unlayered CSS on an ancestor of a `Callout` that has no `color`
- **THEN** that callout uses the consumer's values and no callout outside that ancestor changes

#### Scenario: Re-theme a colored callout on the element

- **WHEN** a consumer sets the same properties through the `style` attribute of a `Callout` that has a `color`
- **THEN** that callout uses the consumer's values, while the same properties set on an ancestor leave it in its `color` hue, because its `data-ui-color` rule declares them on the element

#### Scenario: Re-theme by overriding a palette token

- **WHEN** a consumer overrides `--nf-red-l-40-25` on `:root` in unlayered CSS
- **THEN** every light-scheme `Callout` with `color="red"` picks up the new surface tint

#### Scenario: The shadow depth comes from shadows.css

- **WHEN** a consumer loads `colors/index.css`, `spacings.css` and `borders.css` individually — not `tokens.css`, which would bring the shadows with it — and renders a `Callout`
- **THEN** the panel renders with its surface, accent, rule, padding and corners intact but draws no drop shadow, because `--nf-shadow-depth` is undefined

#### Scenario: The shadow follows the scheme

- **WHEN** the same `Callout` is inspected in a light subtree and in a subtree pinned with `color-scheme: only dark`
- **THEN** its shadow is `0px 4px 0px` in each subtree's own 25%-opacity shadow color, not a single fixed color

#### Scenario: The shadow is translucent

- **WHEN** a `Callout` is placed so that its shadow falls over page content
- **THEN** that content stays visible through the shadow, because the shadow color carries 25% alpha

### Requirement: Callout appearance

`Callout` SHALL render as a panel with no border, an `8px` corner radius, `24px` of padding on all sides, and the `0px 4px 0px` drop shadow supplied by `--nf-callout-shadow`, giving it the same raised look as `Button`. Every piece of text it renders — title and body alike — SHALL use `font-size: 1rem` and `font-weight: 500`, and both SHALL be rendered as paragraphs: the title SHALL NOT be a heading element, so it does not enter the document outline, and the body SHALL carry no margin of its own beyond the spacing described below, whatever margin a `<p>` inherits from the page. When a body is present, it SHALL be separated from the title by a `1px` rule in `--nf-callout-rule-color` spanning the panel's content width, with `16px` of space between the title and the rule and between the rule and the body. The title row SHALL lay its icon and text out on one line with the icon vertically centred against the first line of the title and `8px` between them. The icon's box SHALL set `font-size` to the component-scoped `--nf-callout-icon-size`, `1.5rem` by default, so content sized in `em` renders at 24px against the `1rem` title; a consumer MAY override that property. `Callout` SHALL define no hover, focus, active or disabled behaviour and SHALL NOT animate.

#### Scenario: Resting appearance

- **WHEN** a reader looks at a `Callout`
- **THEN** it shows a tinted rounded panel with no border, a 4px-deep shadow directly beneath it in a translucent, darker tint of its own hue, and 24px of padding around its content

#### Scenario: One typographic size and weight

- **WHEN** the title and the body text of a `Callout` are inspected
- **THEN** both compute to `font-size: 16px` at the default root size and `font-weight: 500`

#### Scenario: Title is not a heading

- **WHEN** a page's heading outline is inspected
- **THEN** a `Callout`'s title does not appear in it

#### Scenario: Body-less callout has no leftover space

- **WHEN** a `Callout` with no children and one with children are compared
- **THEN** the body-less panel's height is exactly its padding plus its title line, with no rule and no trailing gap

#### Scenario: The panel's geometry is absolute

- **WHEN** a `Callout` is rendered on a page whose root font size is `20px`
- **THEN** its padding is still `24px`, its corner radius still `8px` and the space around its rule still `16px`, while its text scales with the root size
- **AND** overriding `--nf-spacing-base-up-2` on `:root` in unlayered CSS changes the panel's padding

#### Scenario: Callout does not react to the pointer

- **WHEN** a reader hovers, clicks or tabs through a `Callout`
- **THEN** its appearance does not change

## REMOVED Requirements

### Requirement: Font tokens defer to the base font families

**Reason**: `tokens.css` becomes an aggregate of token stylesheets and declares no custom property of its own, so the three deferring font tokens — along with the unused `--nf-font-size-*`, `--nf-font-weight-*` and `--nf-line-height-*` ladders that sat beside them — have nowhere left to live. They were a second name for something `typography.css` already publishes: `--nf-font-body` and `--nf-font-heading` were `--nf-font-family` with a fallback, and `--nf-font-mono` was `--nf-font-family-code-blog-post` with a fallback.

**Migration**: Replace `var(--nf-font-body)` and `var(--nf-font-heading)` with `var(--nf-font-family)`, and `var(--nf-font-mono)` with `var(--nf-font-family-code-blog-post)`, both published by `typography.css` and both still the single place to substitute a font — the substitution scenarios in the base-font requirement are unaffected. A consumer who imported `tokens.css` alone for a font token must now also import `typography.css`, or write their own stack. The size, weight and line-height ladders have no replacement: `--nf-font-size-sm` through `-3xl` were `0.875rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem` and `2.5rem`; `--nf-font-weight-normal`, `-medium` and `-bold` were `400`, `500` and `700`; `--nf-line-height-body` and `--nf-line-height-heading` were `1.6` and `1.2`. Use those values directly, or the fluid `--nf-typography-font-size-*` properties for document text.
