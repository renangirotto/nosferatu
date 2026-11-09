# Spec Delta

## MODIFIED Requirements

### Requirement: Stylesheet exports

The library SHALL export the stylesheets `tokens.css`, `spacings.css`, `borders.css`, `shadows.css`, `generic.css`, `reset.css`, `typography.css` and `index.css`, and the palette as the folder `colors/`, holding `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of them.

`tokens.css` SHALL be the library's single entry point for tokens and SHALL declare no custom property of its own: it SHALL be exactly the aggregate of the token stylesheets — the palette, the shadows, the spacing scale and the border radii — so that a consumer who imports it gets every token the library publishes except the typographic ones, which `typography.css` owns because it also owns the element rules that use them, and the general-purpose layout values, which `generic.css` owns. A consumer who wants one group on its own SHALL still be able to import that file directly instead.

The library SHALL NOT publish a stylesheet at `styles/colors.css`. `typography.css` SHALL be the only library stylesheet other than `reset.css` that applies rules to a consumer's own elements, and it SHALL set text size, font family and font weight only: the library still sets no line-height, margin or color on headings, paragraphs, lists, links or code, and sets a family and a weight on `body` alone, never on an individual element.

#### Scenario: Import everything

- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens — palette, shadows, spacing and border radii alike — and `--nf-container-small-size`, together with the reset and the typography styles are all applied

`generic.css` SHALL declare the general-purpose layout values the library publishes on `:root`, and nothing else: no selector other than `:root` and no layer. It SHALL declare `--nf-container-small-size` with the value `856px`, a container width meant for reuse by any layout or component that needs a narrow, readable measure.

#### Scenario: Import generic only

- **WHEN** a consumer imports only `astro-nosferatu/styles/generic.css`
- **THEN** `--nf-container-small-size` computes to `856px` on `:root`, no palette, shadow, spacing, border-radius or typographic property is defined, and no element selectors are applied

#### Scenario: The container size is overridable

- **WHEN** a consumer imports `index.css` and sets `--nf-container-small-size: 720px` on `:root` in unlayered CSS
- **THEN** every value the library derives from it, such as the `BlogArticle` measure, uses `720px`

#### Scenario: Import tokens only

- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the palette, shadow, spacing and border-radius custom properties are all defined, no `--nf-container-*`, `--nf-typography-*`, `--nf-font-family*` or `--nf-font-weight` property is defined, and no element selectors from the reset are applied

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

`nosferatu.tokens` SHALL be the only layer holding custom properties: the palette, the shadows, the spacing scale and the border radii all arrive in it through the layered import of `tokens.css`, and the general-purpose layout values arrive in it through a second import of `generic.css` into the same layer. No `nosferatu.colors`, `nosferatu.shadows` or `nosferatu.base` layer SHALL be declared. None of the token stylesheets — `tokens.css`, `colors/index.css`, `colors/colors-dark.css`, `colors/colors-light.css`, `shadows.css`, `spacings.css`, `borders.css` or `generic.css` — SHALL introduce or name a layer of its own: they inherit `nosferatu.tokens` from that one import, and a consumer importing any of them directly gets unlayered tokens.

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

#### Scenario: The container size sits in the tokens layer

- **WHEN** a consumer imports `index.css` and inspects where `--nf-container-small-size` is declared
- **THEN** it is declared inside `nosferatu.tokens`, and an unlayered `:root { --nf-container-small-size: … }` loaded before or after `index.css` wins

#### Scenario: No base layer is declared

- **WHEN** the `@layer` statement in `index.css` is read
- **THEN** it names exactly `nosferatu.tokens, nosferatu.reset, nosferatu.typography`, with no `nosferatu.colors`, `nosferatu.shadows` or `nosferatu.base`

#### Scenario: Layering alongside the library's tokens

- **WHEN** a consumer wants their token overrides inside the library's layer order rather than unlayered
- **THEN** `@layer nosferatu.tokens { … }` is the one layer to target for the palette, the shadows, the spacing and the radii alike, and a rule written into the former `nosferatu.colors` or `nosferatu.shadows` creates a new consumer layer after the library's instead of joining one of its own

#### Scenario: No token stylesheet declares a layer

- **WHEN** `tokens.css`, `colors/index.css`, `colors/colors-dark.css`, `colors/colors-light.css`, `shadows.css`, `spacings.css`, `borders.css` and `generic.css` are searched for `@layer`
- **THEN** none of them contains one, and a consumer importing any of them directly gets unlayered tokens

#### Scenario: The palette folder declares no layer

- **WHEN** `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css` are searched for `@layer`
- **THEN** none of them contains one, and a consumer importing a scale file directly gets unlayered palette tokens

#### Scenario: Typography declares no layer of its own

- **WHEN** `typography.css` is searched for `@layer`
- **THEN** it contains none, so a consumer importing it directly gets unlayered rules and it takes `nosferatu.typography` only from the layered import in `index.css`
