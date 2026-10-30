# Spec Delta

## ADDED Requirements

### Requirement: Base font families are named, never loaded
The library SHALL name three base font families and one default weight as `:root` custom properties declared in `typography.css`: `--nf-font-family` for the page's general text, `--nf-font-family-blog-post` for article prose, `--nf-font-family-code-blog-post` for code, and `--nf-font-weight`, whose value SHALL be `400`. Each family property SHALL hold a complete font stack whose first entry is the variable-font family name published by the matching Fontsource package, followed by the static family name, followed by the system stack the library used before: `Outfit Variable`, `Outfit` then the system sans stack for `--nf-font-family`; `Plus Jakarta Sans Variable`, `Plus Jakarta Sans` then the same system sans stack for `--nf-font-family-blog-post`; `Geist Mono Variable`, `Geist Mono` then the system monospace stack for `--nf-font-family-code-blog-post`.

The library SHALL NOT load these fonts. It SHALL publish no font file, declare no `@font-face` rule, and request nothing from a font host. Obtaining the font files is the consumer's choice: when the consumer loads a matching family — by installing the Fontsource package, by their own `@font-face`, or because the family is installed locally — text renders in it, and when they do not, every stack falls through to the system font it ends with, with no network request, no layout shift and no error.

#### Scenario: Fonts opted in
- **WHEN** a consuming Astro project imports `astro-nosferatu/styles/index.css` and also imports `@fontsource-variable/outfit`, `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/geist-mono`
- **THEN** page text renders in Outfit, `BlogArticle` prose in Plus Jakarta Sans and `BlogArticle` code in Geist Mono

#### Scenario: Fonts not opted in
- **WHEN** a consuming Astro project imports `astro-nosferatu/styles/index.css` and installs none of the Fontsource packages
- **THEN** the page renders in the system sans font and code in the system monospace font, exactly as before this change
- **AND** the browser's network panel shows no request for a font file originating from the library

#### Scenario: Either Fontsource flavour works
- **WHEN** a consumer installs the static `@fontsource/outfit` instead of `@fontsource-variable/outfit`
- **THEN** the page still renders in Outfit, because the stack names the static family after the variable one

#### Scenario: A consumer substitutes their own font
- **WHEN** a consumer sets `--nf-font-family` on `:root` in unlayered CSS to a family they load themselves
- **THEN** every element that takes the general font renders in it, without overriding a single element rule

#### Scenario: No font file is published
- **WHEN** the published tarball is inspected, or the library's stylesheets are searched for `@font-face` or a font-host URL
- **THEN** no `.woff`, `.woff2`, `.ttf` or `.otf` file is present, no `@font-face` rule exists, and no font-host hostname appears

### Requirement: Font tokens defer to the base font families
`tokens.css` SHALL keep exporting `--nf-font-body`, `--nf-font-heading` and `--nf-font-mono`, and SHALL define them in terms of the base font families rather than restating a font stack: `--nf-font-body` SHALL resolve to `--nf-font-family`, `--nf-font-mono` to `--nf-font-family-code-blog-post`, and `--nf-font-heading` SHALL continue to resolve to `--nf-font-body`. Each deferral SHALL carry the system stack the token held before as its fallback, so that `tokens.css` loaded on its own — without `typography.css` and therefore without the family properties — still resolves every font token to a renderable system stack. A consumer overriding `--nf-font-family` SHALL see `--nf-font-body` follow it, with no second place to change.

#### Scenario: Tokens follow the base families
- **WHEN** a consumer imports `index.css` and inspects the computed value of `--nf-font-body` and `--nf-font-mono`
- **THEN** `--nf-font-body` resolves to the Outfit stack and `--nf-font-mono` to the Geist Mono stack

#### Scenario: One override moves both
- **WHEN** a consumer sets `--nf-font-family` on `:root` in unlayered CSS
- **THEN** `--nf-font-body` and `--nf-font-heading` resolve to the consumer's value, and no library stylesheet has to be edited

#### Scenario: Tokens alone still resolve
- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css` and applies `font-family: var(--nf-font-body)` to an element
- **THEN** it renders in the system sans stack rather than falling back to the browser's default family through an unresolved variable

#### Scenario: No stack is written twice
- **WHEN** the library's stylesheets are searched for the literal family names `Outfit`, `Plus Jakarta Sans` and `Geist Mono`
- **THEN** each appears exactly once, in `typography.css`

## MODIFIED Requirements

### Requirement: Stylesheet exports
The library SHALL export the stylesheets `tokens.css`, `shadows.css`, `reset.css`, `typography.css` and `index.css`, and the palette as the folder `colors/`, holding `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of them. The library SHALL NOT publish a stylesheet at `styles/colors.css`. `typography.css` SHALL be the only library stylesheet other than `reset.css` that applies rules to a consumer's own elements, and it SHALL set text size, font family and font weight only: the library still sets no line-height, margin or color on headings, paragraphs, lists, links or code, and sets a family and a weight on `body` alone, never on an individual element.

#### Scenario: Import everything
- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens, colors, shadows, reset and typography styles are all applied

#### Scenario: Import tokens only
- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the non-color `--nf-*` custom properties (spacing, fonts, radius) are defined, no color custom properties are defined, no shadow custom properties are defined, no `--nf-typography-*` property is defined, and no element selectors from the reset are applied
- **AND** `--nf-font-body`, `--nf-font-heading` and `--nf-font-mono` resolve to the system font stacks, because the font-family properties they defer to are declared in `typography.css`, which is not loaded, and each deferral carries the system stack as its fallback

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
- **THEN** the `--nf-typography-*` custom properties are defined, the three `--nf-font-family*` properties and `--nf-font-weight` are defined, `h1`, `h2`, `h3` and `p` are sized by the fluid scale, and `body` carries the general font family and weight, without needing `tokens.css`, the palette, `shadows.css` or `reset.css` to be loaded
- **AND** no color, spacing, radius or shadow custom property is defined, and no element gains a color, line-height or margin

#### Scenario: No base stylesheet is published
- **WHEN** the published package is inspected, or a consumer imports `astro-nosferatu/styles/base.css`
- **THEN** no such file exists and the import fails, and nothing in the library sets a `body` color, a global focus outline, or a `::selection` treatment

#### Scenario: Opting out of typography
- **WHEN** a consumer wants the library's tokens, palette, shadows and reset but not its text sizing or its fonts, and imports those files individually instead of `index.css`
- **THEN** headings and paragraphs render at the browser's own sizes in the browser's own font, and no `--nf-typography-*`, `--nf-font-family*` or `--nf-font-weight` property is defined

#### Scenario: Keeping the fonts without the scale
- **WHEN** a consumer imports `index.css` and sets `--nf-typography-font-size-h1`, `-h2`, `-h3` and `-p` to constants in unlayered CSS
- **THEN** the page keeps the library's font families and weight and loses only the fluid sizing, because family and size are separate properties

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
- **THEN** their color, line-height and margins are the browser's own, their size comes from the scale, and their family and weight are inherited from `body`, which is the single element the stylesheet gives a font to
