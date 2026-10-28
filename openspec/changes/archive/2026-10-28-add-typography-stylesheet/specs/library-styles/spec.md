# Spec Delta

## ADDED Requirements

### Requirement: Stylesheet exports
The library SHALL export the stylesheets `tokens.css`, `shadows.css`, `reset.css`, `typography.css` and `index.css`, and the palette as the folder `colors/`, holding `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of them. The library SHALL NOT publish a stylesheet at `styles/colors.css`. `typography.css` SHALL be the only library stylesheet other than `reset.css` that applies rules to a consumer's own elements, and it SHALL size text only: the library still sets no font family, weight, line-height, margin or color on headings, paragraphs, lists, links or code.

#### Scenario: Import everything
- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens, colors, shadows, reset and typography styles are all applied

#### Scenario: Import tokens only
- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the non-color `--nf-*` custom properties (spacing, fonts, radius) are defined, no color custom properties are defined, no shadow custom properties are defined, no `--nf-typography-*` property is defined, and no element selectors from the reset are applied

#### Scenario: Import colors only
- **WHEN** a consumer imports only `astro-nosferatu/styles/colors/index.css`
- **THEN** the `--nf-*` palette custom properties are defined, for both scales, and no element selectors are applied

#### Scenario: The old flat palette path is gone
- **WHEN** a consumer imports `astro-nosferatu/styles/colors.css`
- **THEN** module resolution fails, because no such file is published and no re-export shim stands in for it

#### Scenario: Import shadows only
- **WHEN** a consumer imports only `astro-nosferatu/styles/shadows.css`
- **THEN** the `--nf-shadow-*` custom properties are defined and no element selectors are applied

#### Scenario: Import typography only
- **WHEN** a consumer imports only `astro-nosferatu/styles/typography.css`
- **THEN** the `--nf-typography-*` custom properties are defined and `h1`, `h2`, `h3` and `p` are sized by the fluid scale, without needing `tokens.css`, the palette, `shadows.css` or `reset.css` to be loaded
- **AND** no color, spacing, radius or shadow custom property is defined, and no element gains a color, font family, weight, line-height or margin

#### Scenario: No base stylesheet is published
- **WHEN** the published package is inspected, or a consumer imports `astro-nosferatu/styles/base.css`
- **THEN** no such file exists and the import fails, and nothing in the library sets a `body` color or font, a global focus outline, or a `::selection` treatment

#### Scenario: Opting out of typography
- **WHEN** a consumer wants the library's tokens, palette, shadows and reset but not its text sizing, and imports those files individually instead of `index.css`
- **THEN** headings and paragraphs render at the browser's own sizes, and no `--nf-typography-*` property is defined

### Requirement: Cascade layer order
When loaded through `index.css`, the tokens, colors, shadows, reset and typography styles SHALL be placed in the cascade layers `nosferatu.tokens`, `nosferatu.colors`, `nosferatu.shadows`, `nosferatu.reset` and `nosferatu.typography`, declared in that order, so later layers win over earlier ones and any unlayered consumer CSS wins over all of them. `nosferatu.typography` SHALL be the last library layer, so the type scale wins over the reset where the two touch the same property. No `nosferatu.base` layer SHALL be declared. The palette's own nested imports SHALL NOT introduce or name a layer of their own: they inherit `nosferatu.colors` from the single layered import in `index.css`.

#### Scenario: Typography is the last library layer
- **WHEN** a rule in `nosferatu.typography` and a rule in any earlier library layer style the same element property
- **THEN** the `nosferatu.typography` value applies

#### Scenario: The reset wins over tokens, colors and shadows
- **WHEN** a rule in `nosferatu.reset` and a rule in `nosferatu.tokens`, `nosferatu.colors` or `nosferatu.shadows` style the same element property
- **THEN** the `nosferatu.reset` value applies

#### Scenario: Consumer CSS wins without extra specificity
- **WHEN** a consumer writes an unlayered rule `h1 { color: red; }` after importing `index.css`
- **THEN** `h1` elements are red, regardless of any library rule

#### Scenario: Consumer type-size override wins without extra specificity
- **WHEN** a consumer writes an unlayered rule `h1 { font-size: 2rem; }` after importing `index.css`
- **THEN** `h1` elements are `2rem`, because the library's rule sits in a layer and the consumer's does not

#### Scenario: Consumer token override wins regardless of order
- **WHEN** a consumer sets `--nf-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: Consumer shadow override wins regardless of order
- **WHEN** a consumer sets `--nf-shadow-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: Consumer typography override wins regardless of order
- **WHEN** a consumer sets `--nf-typography-font-size-h1-max` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

#### Scenario: No base layer is declared
- **WHEN** the `@layer` statement in `index.css` is read
- **THEN** it names exactly `nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset, nosferatu.typography`, with no `nosferatu.base`

#### Scenario: The palette folder declares no layer
- **WHEN** `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css` are searched for `@layer`
- **THEN** none of them contains one, and a consumer importing a scale file directly gets unlayered palette tokens

#### Scenario: Typography declares no layer of its own
- **WHEN** `typography.css` is searched for `@layer`
- **THEN** it contains none, so a consumer importing it directly gets unlayered rules and it takes `nosferatu.typography` only from the layered import in `index.css`

### Requirement: Fluid type scale
`typography.css` SHALL size `h1`, `h2`, `h3` and `p` with a font size that interpolates linearly with the viewport's inline size between a minimum and a maximum, so text grows smoothly as the viewport widens. The two bounds SHALL be real limits: at and below `--nf-typography-viewport-min` each element SHALL render at its minimum, and at and above `--nf-typography-viewport-max` at its maximum, holding there however much further the viewport goes. The interpolation SHALL be driven by the viewport's progress between `--nf-typography-viewport-min` (`560px`) and `--nf-typography-viewport-max` (`1088px`), exposed as `--nf-typography-viewport-progress`. Each sized element SHALL have its own pair of bounds and a resolved size, all declared on `:root`: `--nf-typography-font-size-h1-min` (`3rem`) and `-h1-max` (`3.5rem`), `-h2-min` (`2.5rem`) and `-h2-max` (`3rem`), `-h3-min` (`2rem`) and `-h3-max` (`2.5rem`), `-p-min` (`1rem`) and `-p-max` (`1.125rem`), each pair resolving into `--nf-typography-font-size-h1`, `-h2`, `-h3` and `-p`, which the element rules read. Declaring every property on `:root` SHALL be what makes the scale themeable: a consumer retunes it by overriding a property in unlayered CSS, without rewriting a selector or raising specificity.

`typography.css` SHALL size no other element. In particular it SHALL NOT set a `font-size` on `a`, so a link renders at the size of whatever contains it, and it SHALL NOT size `h4`, `h5` or `h6`, which keep the browser's own sizes.

#### Scenario: Text grows with the viewport
- **WHEN** a reader widens a page that imports `index.css` from `560px` to `1088px`
- **THEN** the `h1` grows smoothly from `3rem` to `3.5rem`, the `h2` from `2.5rem` to `3rem`, the `h3` from `2rem` to `2.5rem` and `p` from `1rem` to `1.125rem`, with no step changes at a breakpoint

#### Scenario: The scale holds at its bounds
- **WHEN** the viewport is narrower than `560px`, or wider than `1088px`
- **THEN** each sized element holds at its minimum, or at its maximum, instead of continuing to shrink or grow — at `500px` and at `320px` the `h1` renders at `3rem` and `p` at `1rem`, and at `2560px` and at `3840px` the `h1` renders at `3.5rem` and `p` at `1.125rem`
- **AND** the library achieves this without wrapping the progress value in any bounding function, because `progress()` clamps its own result to the range `0` to `1`

#### Scenario: A consumer can opt one element out of the scale
- **WHEN** a consumer sets a resolved property such as `--nf-typography-font-size-p` to a constant in unlayered CSS
- **THEN** that element renders at the constant at every viewport width, inside the `560px`–`1088px` range as well as outside it, while the other three elements keep scaling

#### Scenario: Retune one element
- **WHEN** a consumer sets `--nf-typography-font-size-h1-max: 5rem` on `:root` in unlayered CSS
- **THEN** `h1` interpolates up to `5rem` at the wide bound, and `h2`, `h3` and `p` are unchanged

#### Scenario: Retune the viewport bounds
- **WHEN** a consumer sets `--nf-typography-viewport-min` and `--nf-typography-viewport-max` on `:root` in unlayered CSS
- **THEN** every sized element reaches its minimum and maximum at the consumer's two widths instead of `560px` and `1088px`

#### Scenario: Replace one element's size outright
- **WHEN** a consumer sets `--nf-typography-font-size-h2: 2rem` on `:root` in unlayered CSS
- **THEN** `h2` renders at a fixed `2rem` at every viewport width, because the resolved size is itself a custom property

#### Scenario: A link inherits its context
- **WHEN** a page renders `<h1>Read <a href="/x">this</a></h1>` and a link inside a paragraph
- **THEN** the link inside the heading renders at the `h1` size and the link inside the paragraph at the paragraph size, because `typography.css` sets no `font-size` on `a`

#### Scenario: Minor headings are left alone
- **WHEN** a page renders `h4`, `h5` and `h6` after importing `index.css`
- **THEN** each renders at the browser's own size for that element, and no `--nf-typography-font-size-h4` property exists

#### Scenario: Only the size changes
- **WHEN** a sized `h1` and `p` are inspected after importing only `typography.css`
- **THEN** their font family, weight, color, line-height and margins are the browser's own, because the stylesheet declares `font-size` and nothing else

### Requirement: Type scale degrades to browser defaults
The fluid type scale depends on the CSS `progress()` function, which is not yet widely supported. `typography.css` SHALL apply its element rules only where `progress()` is supported, so that in a browser without it headings and paragraphs render at the browser's own sizes rather than collapsing to an inherited size. The `--nf-typography-*` custom properties MAY still be declared in such a browser, and no second type scale SHALL be maintained as a fallback.

#### Scenario: Unsupported browser keeps its own sizes
- **WHEN** a page importing `index.css` is opened in a browser that does not support `progress()`
- **THEN** `h1`, `h2`, `h3` and `p` render at that browser's default sizes, with the visible heading hierarchy intact and no heading rendered at body size

#### Scenario: Supported browser gets the scale
- **WHEN** the same page is opened in a browser that supports `progress()`
- **THEN** the fluid scale applies

#### Scenario: No duplicate scale to keep in sync
- **WHEN** `typography.css` is read
- **THEN** it expresses each element's size once, and contains no parallel `clamp()`-based or breakpoint-based ladder guarded by the inverse condition

## REMOVED Requirements

### Requirement: Exported stylesheets
**Reason**: Its text and its "No typography stylesheet is published" scenario forbid exactly what this change ships. Replaced by "Stylesheet exports", which carries every still-true scenario unchanged and states what `typography.css` applies instead of asserting the file does not exist.
**Migration**: None for consumers beyond the re-flow described in the proposal. For readers of the spec, "Stylesheet exports" is the same requirement under a name that no longer encodes an absent file.

### Requirement: Cascade layer order without a base layer
**Reason**: Its name and its "The reset is the last library layer" scenario both assert an ordering this change replaces. Replaced by "Cascade layer order", which keeps the no-`nosferatu.base` rule as a clause and a scenario rather than in the title, and makes `nosferatu.typography` the final layer.
**Migration**: A consumer who layered their own CSS relative to the library's layers is unaffected: the four existing layers keep their relative order and the new one is appended after them.
