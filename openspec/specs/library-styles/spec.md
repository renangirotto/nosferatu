# library-styles Specification

## Purpose

Defines the global stylesheets the library exports, how their tokens are named, how they sit in the cascade relative to consumer CSS, and how components consume them.

## Requirements

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

### Requirement: Token naming

Every CSS custom property defined by the library SHALL use the `--nf-` prefix.

#### Scenario: No unprefixed custom properties

- **WHEN** the library's stylesheets and component styles are searched for custom property declarations
- **THEN** every declared custom property name starts with `--nf-`

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
- **THEN** their color, line-height and margins are the browser's own, their size comes from the scale, and their family and weight are inherited from `body`, which is the single element the stylesheet gives a font to

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

### Requirement: Component class and property naming

Every class a component renders SHALL be `nf-` prefixed, with the root class `nf-<component name>` and every other part `nf-<component name>-<part>`, using plain hyphens — the library SHALL NOT use BEM `__` element or `--` modifier separators. Every component-scoped custom property SHALL be named `--nf-<component name>-<role>`, spelling the component's full name rather than an abbreviation. Within any rule in a component's styles, custom property declarations SHALL come before the rule's ordinary declarations.

#### Scenario: Callout's parts

- **WHEN** a rendered `Callout` is inspected
- **THEN** its element carries `nf-callout`, its title `nf-callout-title`, its icon box `nf-callout-icon` and its body `nf-callout-body`, and no class contains `__` or `--`

#### Scenario: Properties spell the component out

- **WHEN** a consumer looks for the properties that theme `Button` and `Callout`
- **THEN** they are `--nf-button-*` and `--nf-callout-*`, and no `--nf-btn-*` or `--nf-cal-*` property exists

### Requirement: Shared prop types

Prop types used by more than one component SHALL live in `src/types/`, exported by name — the palette hues a `color` prop accepts SHALL be the exported type `ColorPalette` — and components SHALL reference them instead of restating the literal union. Published component source SHALL import those modules by relative path, never through a path alias, because a consuming project does not have the library's alias configured and an unresolved type import degrades the prop to `any`, silently removing the prop's type checking on the consumer's side.

#### Scenario: One definition of the palette hues

- **WHEN** `Button`'s and `Callout`'s `color` props are inspected
- **THEN** both are typed `ColorPalette`, imported from the library's shared types, and neither restates the list of hues

#### Scenario: Invalid color is still a type error in a consuming project

- **WHEN** a consuming Astro project whose TypeScript configuration has no alias for the library's internals writes `<Callout title="x" color="teal" />` in an `.astro` file and runs `astro check`
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop

### Requirement: Button color API

`Button` SHALL accept an optional `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`. When `color` is passed, `Button` SHALL expose it on the rendered `<button>` as the attribute `data-ui-color`. When `color` is omitted, the rendered `<button>` SHALL carry no `data-ui-color` attribute and SHALL render in the grey palette, looking identical to `color="grey"`. `Button` SHALL NOT accept a `variant` prop. Every other `<button>` attribute SHALL continue to pass through to the element, and a consumer `class` SHALL be merged with the component's own classes.

#### Scenario: Default color

- **WHEN** a consumer renders `<Button>Button</Button>` with no `color`
- **THEN** the rendered element is `<button type="button" class="nf-button …">` with no `data-ui-color` attribute, and it is filled with the grey palette

#### Scenario: Explicit color

- **WHEN** a consumer renders `<Button color="green">Button</Button>`
- **THEN** the rendered element carries `data-ui-color="green"` and its background, text and shadow use green palette values

#### Scenario: A grey button

- **WHEN** a consumer renders `<Button color="grey">Button</Button>`
- **THEN** the rendered element carries `data-ui-color="grey"` and renders as a neutral grey button with the same raised shape, padding and interaction states as every other color

#### Scenario: Explicit grey matches the default

- **WHEN** a `<Button>` with no `color` and a `<Button color="grey">` are rendered side by side in each color scheme
- **THEN** their computed background, text color and shadow color are identical; only the presence of the attribute differs

#### Scenario: Invalid color is a type error

- **WHEN** a consumer writes `<Button color="teal">Button</Button>` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop
- **AND** the same usage inside an `.mdx` page is not reported, because `astro check` type-checks `.astro` files only

#### Scenario: Native attributes still pass through

- **WHEN** a consumer renders `<Button color="red" disabled aria-label="Delete" class="my-cta">Delete</Button>`
- **THEN** the rendered `<button>` is disabled, carries `aria-label="Delete"`, and its class list contains both `nf-button` and `my-cta`

#### Scenario: The color attribute cannot be overridden from outside

- **WHEN** a consumer renders `<Button data-ui-color="teal">Button</Button>`
- **THEN** the rendered element carries no `data-ui-color` attribute, the consumer's value is dropped, and the button keeps its default grey coloring
- **AND** `<Button color="green" data-ui-color="teal">` carries `data-ui-color="green"` exactly once

### Requirement: Button color resolution

`Button`'s color SHALL be resolved through exactly two component-scoped custom properties: `--nf-button-color`, which supplies the background, and `--nf-button-accent-color`, which supplies the text color, the box-shadow color and the focus outline color. Each `data-ui-color` value SHALL set both properties from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-button-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-button-accent-color`. Where neither property is defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of them SHALL fall back to the grey pairing of the same steps (`--nf-grey-l-40`/`--nf-grey-d-50` and `--nf-grey-l-80`/`--nf-grey-d-90`). No other palette token SHALL be referenced for the button's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and a `Button` with `color="purple"` is inspected
- **THEN** its computed background equals the value of `--nf-purple-l-40`, and its computed color and box-shadow color both equal the value of `--nf-purple-l-80`

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Button` is inspected
- **THEN** its computed background equals `--nf-purple-d-50`, and its color and box-shadow color both equal `--nf-purple-d-90`

#### Scenario: Default appearance

- **WHEN** a `Button` with no `color` is inspected in a light and then a dark color scheme
- **THEN** its background equals `--nf-grey-l-40` and its color and box-shadow color `--nf-grey-l-80` in light, and `--nf-grey-d-50` and `--nf-grey-d-90` in dark

#### Scenario: Re-theme one button by overriding the component properties

- **WHEN** a consumer sets `--nf-button-color` and `--nf-button-accent-color` in unlayered CSS on an ancestor of a `Button` that has no `color`
- **THEN** that button uses the consumer's two values and no button outside that ancestor changes

#### Scenario: Re-theme a colored button on the element

- **WHEN** a consumer sets the same two properties through the `style` attribute of a `Button` that has a `color`
- **THEN** that button uses the consumer's values, while the same properties set on an ancestor leave it in its `color` hue, because its `data-ui-color` rule declares them on the element

#### Scenario: Re-theme by overriding a palette token

- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Button` with `color="purple"` picks up the new background
- **AND** overriding `--nf-grey-l-40` the same way changes every light-scheme `Button` with no `color` or with `color="grey"`

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

### Requirement: Callout content API

The library SHALL export a component `Callout` at `astro-nosferatu/components/Callout.astro` that presents a tinted panel of supporting content. It SHALL render a plain `<div>` — not a landmark element, so a consumer decides whether a given callout is one by passing `role` and a label. It SHALL accept a required `title` prop rendered as the panel's heading line, an optional `icon` prop holding a component that the callout renders before the title, an optional default slot holding the panel's body, and an optional `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`. When `color` is passed it SHALL be exposed on the rendered element as `data-ui-color`; when it is omitted the element SHALL carry no `data-ui-color` attribute and SHALL render in the grey palette, looking identical to `color="grey"`. The `title` value SHALL NOT be forwarded to the element as the native `title` attribute, so it produces no browser tooltip. Every other native attribute of the rendered element SHALL pass through, and a consumer `class` SHALL be merged with the component's own classes.

#### Scenario: The rendered element is a div

- **WHEN** a rendered `Callout` is inspected
- **THEN** its root element is a `<div>` carrying `nf-callout`, with no implicit landmark role, and its title and body are both `<p>` elements

#### Scenario: Title only

- **WHEN** a consumer renders `<Callout title="What are harnesses?" />` with no children
- **THEN** the panel shows exactly that title, carries no `data-ui-color` attribute, renders in grey, and shows no separator rule, no empty body area and no extra space below the title

#### Scenario: Title and body

- **WHEN** a consumer renders `<Callout title="What are harnesses?">Harness is the infrastructure layer…</Callout>`
- **THEN** the panel shows the title, a full-width separator rule beneath it, and the body text below the rule

#### Scenario: A grey callout

- **WHEN** a consumer renders `<Callout title="Note" color="grey">Body</Callout>`
- **THEN** the panel carries `data-ui-color="grey"` and renders as a neutral grey panel with the same surface, rule, accent and shadow structure as every other color, identical in appearance to a `Callout` with no `color`

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
- **THEN** the rendered element carries no `data-ui-color` attribute, the consumer's value is dropped, and the panel keeps its default grey coloring

#### Scenario: Native attributes still pass through

- **WHEN** a consumer renders `<Callout title="x" id="intro" class="my-callout" aria-describedby="note">Body</Callout>`
- **THEN** the rendered element carries `id="intro"` and `aria-describedby="note"`, and its class list contains both the component's own class and `my-callout`

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

- **WHEN** a consumer loads `tokens.css` and `colors.css` but not `shadows.css`, and renders a `Callout`
- **THEN** the panel renders with its surface, accent and rule intact but draws no drop shadow, because `--nf-shadow-depth` is undefined

#### Scenario: The shadow follows the scheme

- **WHEN** the same `Callout` is inspected in a light subtree and in a subtree pinned with `color-scheme: only dark`
- **THEN** its shadow is `0px 4px 0px` in each subtree's own 25%-opacity shadow color, not a single fixed color

#### Scenario: The shadow is translucent

- **WHEN** a `Callout` is placed so that its shadow falls over page content
- **THEN** that content stays visible through the shadow, because the shadow color carries 25% alpha

### Requirement: Callout appearance

`Callout` SHALL render as a panel with no border, a `0.5rem` corner radius, `1.5rem` of padding on all sides, and the `0px 4px 0px` drop shadow supplied by `--nf-callout-shadow`, giving it the same raised look as `Button`. Every piece of text it renders — title and body alike — SHALL use `font-size: 1rem` and `font-weight: 500`, and both SHALL be rendered as paragraphs: the title SHALL NOT be a heading element, so it does not enter the document outline, and the body SHALL carry no margin of its own beyond the spacing described below, whatever margin a `<p>` inherits from the page. When a body is present, it SHALL be separated from the title by a `1px` rule in `--nf-callout-rule-color` spanning the panel's content width, with `1rem` of space between the title and the rule and between the rule and the body. The title row SHALL lay its icon and text out on one line with the icon vertically centred against the first line of the title and `0.5rem` between them. The icon's box SHALL set `font-size` to the component-scoped `--nf-callout-icon-size`, `1.5rem` by default, so content sized in `em` renders at 24px against the `1rem` title; a consumer MAY override that property. `Callout` SHALL define no hover, focus, active or disabled behaviour and SHALL NOT animate.

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

### Requirement: Accordion content API

The library SHALL export a component `Accordion` at `astro-nosferatu/components/Accordion.astro` that discloses and hides a piece of content. It SHALL render a native `<details>` element containing a `<summary>` and, after it, a `<div>` holding the component's default slot. It SHALL accept a required `summary` prop, a `string`, rendered as the text of the `<summary>`, an optional default slot holding the disclosed content, and an optional `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`. When `color` is passed it SHALL be exposed on the rendered `<details>` as `data-ui-color`; when it is omitted the `<details>` SHALL carry no `data-ui-color` attribute and SHALL render in the grey palette, looking identical to `color="grey"`. The `summary` value SHALL NOT be forwarded to the element as a native attribute. Disclosure state and grouping SHALL remain the element's own: `Accordion` SHALL NOT declare props of its own for them, and the native `open` and `name` attributes SHALL pass through, as SHALL every other native attribute of `<details>`. A consumer `class` SHALL be merged with the component's own classes. The component SHALL ship no JavaScript, and the disclosure SHALL work with scripting disabled.

#### Scenario: The rendered markup is a details element

- **WHEN** a rendered `Accordion` with no `color` is inspected
- **THEN** its root is a `<details class="nf-accordion …">` with no `data-ui-color` attribute, whose first child is a `<summary class="nf-accordion-summary">` holding the `summary` text, followed by a `<div class="nf-accordion-content">` holding the slot content, and the page loads no script for it

#### Scenario: Closed by default

- **WHEN** a consumer renders `<Accordion summary="Details">Body</Accordion>`
- **THEN** only the summary is visible, and activating the summary with a click, with `Enter` or with `Space` reveals the body

#### Scenario: Starting open

- **WHEN** a consumer renders `<Accordion summary="Details" open>Body</Accordion>`
- **THEN** the body is visible at its full height on first paint, and the panel does not unfold from zero height on load

#### Scenario: Exclusive group through the native attribute

- **WHEN** a consumer renders three `Accordion`s that all carry `name="faq"`
- **THEN** opening one closes whichever was open, because the attribute reaches the `<details>` element, and the closing panel animates shut exactly as a user-closed one does

#### Scenario: Summary is not an attribute

- **WHEN** a reader hovers an `Accordion` rendered with `summary="Heads up"`
- **THEN** no browser tooltip appears, and the rendered `<details>` carries no `summary` attribute

#### Scenario: A missing summary is a type error

- **WHEN** a consumer writes `<Accordion>Body</Accordion>` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `summary` is missing

#### Scenario: Invalid color is a type error

- **WHEN** a consumer writes `<Accordion summary="x" color="teal" />` in an `.astro` file and runs `astro check` over that project
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop

#### Scenario: The color attribute cannot be overridden from outside

- **WHEN** a consumer renders `<Accordion summary="x" data-ui-color="teal" />`
- **THEN** the rendered element carries no `data-ui-color` attribute, the consumer's value is dropped, and the accordion keeps its default grey coloring

#### Scenario: Native attributes still pass through

- **WHEN** a consumer renders `<Accordion summary="x" id="faq-1" class="my-accordion" aria-describedby="note">Body</Accordion>`
- **THEN** the rendered `<details>` carries `id="faq-1"` and `aria-describedby="note"`, and its class list contains both `nf-accordion` and `my-accordion`

### Requirement: Accordion color resolution

`Accordion`'s color SHALL be resolved through exactly two component-scoped custom properties, matching `Button`'s approach: `--nf-accordion-color`, which fills both the summary and the content panel, and `--nf-accordion-accent-color`, which supplies the summary's text and disclosure marker, the content's text, the summary's box-shadow and its focus outline. Each `data-ui-color` value SHALL set both properties from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-accordion-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-accordion-accent-color`. Where neither property is defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of them SHALL fall back to the grey pairing of the same steps. No other palette token SHALL be referenced for the accordion's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and an `Accordion` with `color="purple"` is inspected
- **THEN** the computed background of both its summary and its content equals the value of `--nf-purple-l-40`, and their computed color, together with the summary's box-shadow color, equals the value of `--nf-purple-l-80`

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Accordion` is inspected
- **THEN** both backgrounds equal `--nf-purple-d-50`, and the text and box-shadow color equal `--nf-purple-d-90`

#### Scenario: Default appearance

- **WHEN** an `Accordion` with no `color` is inspected in a light and then a dark color scheme
- **THEN** both backgrounds equal `--nf-grey-l-40` and the text and box-shadow color `--nf-grey-l-80` in light, and `--nf-grey-d-50` and `--nf-grey-d-90` in dark

#### Scenario: Every hue is distinct

- **WHEN** one `Accordion` is rendered for each of the nine hues
- **THEN** each renders in its own hue with the identical shape, padding, depth and interaction behaviour

#### Scenario: Re-theme one accordion by overriding the component properties

- **WHEN** a consumer sets `--nf-accordion-color` and `--nf-accordion-accent-color` on the `Accordion` element itself, through its `style` attribute
- **THEN** that accordion uses the consumer's two values, for its summary and its content alike, and no other accordion on the page changes

#### Scenario: An ancestor cannot supply the two properties

- **WHEN** a consumer sets the same two properties on an ancestor of an `Accordion` with no `color` and of one with `color="green"`
- **THEN** the uncolored accordion uses the consumer's values, and the green one keeps its hue, because the rule that matches its own `data-ui-color` declares both properties on the element, and a declaration on the element always beats an inherited value
- **AND** the component's documentation tells consumers to set them on the element itself when the accordion has a `color`

#### Scenario: Re-theme by overriding a palette token

- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Accordion` with `color="purple"` picks up the new fill

### Requirement: Accordion appearance and interaction states

`Accordion`'s summary SHALL carry the same raised treatment as `Button`: `padding-block: 8px`, `padding-inline: 16px`, `border-radius: 8px`, no border, a fill of `--nf-accordion-color`, text in `--nf-accordion-accent-color`, and a `0px 4px 0px` box-shadow in `--nf-accordion-accent-color`. It SHALL keep the browser's own disclosure marker, which inherits the summary's color, and SHALL show a pointer cursor. On hover, and whenever focus is within it, the summary SHALL translate down by `2px` and reduce its shadow to `0px 2px 0px`; while `:active` it SHALL translate down by `4px` and reduce the shadow to `0px 0px 0px`. While the `<details>` is `[open]` the summary SHALL hold that pressed appearance — down `4px` with no shadow — regardless of hover, so an open panel reads as a button that stays pressed, and SHALL return to the raised resting appearance when the panel closes. The sum of the translation and the shadow depth SHALL stay constant across every state, so the summary's bottom edge does not move. On `:focus-visible` the summary SHALL additionally draw a `2px` solid outline in `--nf-accordion-accent-color`, inset by its own width so it reads as a border on the summary rather than a ring around it.

The content `<div>` SHALL carry the same `padding-block: 8px` and `padding-inline: 16px`, the same fill and the same text color as the summary, and no shadow of its own. Every property that changes between the states SHALL animate over `0.15s` with an `ease-in-out` timing function, except when the user has requested reduced motion, in which case each state SHALL be reached instantly while still looking exactly as described.

#### Scenario: Resting state is raised

- **WHEN** a reader looks at a closed `Accordion` that is neither hovered nor focused
- **THEN** its summary shows no border and a 4px-deep solid shadow directly beneath it, in the same accent color as its text, and the content is not visible

#### Scenario: Hover sinks the summary halfway

- **WHEN** the pointer hovers the summary of a closed `Accordion`
- **THEN** it moves down 2px and its shadow shortens to 2px, so its bottom edge stays in place, and the movement is animated rather than instant

#### Scenario: Open holds the summary pressed

- **WHEN** a reader opens an `Accordion` and then moves the pointer away from the summary
- **THEN** the summary stays down 4px with no shadow, sitting flush against the content panel below it, and it returns to the raised appearance only when the panel is closed again

#### Scenario: Open is unaffected by hover

- **WHEN** the pointer hovers the summary of an already-open `Accordion`
- **THEN** the summary does not rise to the 2px hover depth; it stays pressed flat

#### Scenario: Keyboard focus draws an inset outline

- **WHEN** a reader tabs to an `Accordion`'s summary
- **THEN** a 2px outline in the accent color is drawn inside the summary's edge, following its corner radius, without changing its size or position, and the summary takes the hover depth while it is closed and stays pressed while it is open

#### Scenario: Padding is the same on both parts

- **WHEN** the summary and the content of an open `Accordion` are measured
- **THEN** both show 8px of padding above and below their text and 16px on each side

#### Scenario: The disclosure marker is the browser's own

- **WHEN** a reader looks at a closed and then an open `Accordion`
- **THEN** the native marker is present in the summary's accent color and turns as the browser turns it, and the component renders no icon of its own

#### Scenario: Reduced motion removes the animation

- **WHEN** the user has `prefers-reduced-motion: reduce` and hovers, presses or opens an `Accordion`
- **THEN** the resting, hover, active and open appearances are unchanged and still give the same feedback, but each one is reached instantly with no animated transition

### Requirement: Accordion open and close animation

`Accordion` SHALL animate its disclosure in CSS alone, with no script: opening SHALL grow the panel from zero to the content's natural height while the content itself fades and slides into place, and closing SHALL shrink the panel back to zero, over `0.3s` with an `ease-in-out` timing function, with the content clipped while the panel moves so no text spills outside it. The growth and shrink SHALL be driven by the `::details-content` pseudo-element of the component's own `<details>`, and the content's entry SHALL be driven by a starting style on the component's content `<div>`, which has no previous value to transition from because it is not rendered while the panel is closed. Both SHALL be applied only inside an `@supports` test for the CSS size interpolation and pseudo-element they depend on. Where that test fails, the component SHALL leave the browser's native `<details>` behaviour untouched, so the panel appears and disappears instantly, fully rendered and fully readable. When the user has requested reduced motion, the disclosure SHALL also be instant. The animation SHALL NOT require the consumer to load `reset.css` or any other library stylesheet beyond the tokens and palette the component's colors already need, and SHALL NOT require the consumer to declare a height, a maximum height or any other measurement of their content.

#### Scenario: Opening animates to the content's own height

- **WHEN** a reader opens an `Accordion` in a browser that supports the animation
- **THEN** the panel grows smoothly from nothing to exactly the height of its content, its content fading and sliding into place as it goes, over about a third of a second, and no content is visible outside the growing panel while it moves

#### Scenario: Closing animates too

- **WHEN** the reader closes the same `Accordion`
- **THEN** the panel shrinks back to nothing over the same duration instead of vanishing in one frame

#### Scenario: Content of any height is handled

- **WHEN** two `Accordion`s are rendered, one with a single line of text and one with several paragraphs and an image
- **THEN** each animates to its own full height with no measurement, no fixed maximum and no clipped content once open

#### Scenario: Unsupported browser still works

- **WHEN** the same page is opened in a browser that supports neither CSS size interpolation nor the content pseudo-element
- **THEN** the accordion opens and closes instantly, showing its full content, and never renders as an open panel of zero height

#### Scenario: Reduced motion opens instantly

- **WHEN** a user with `prefers-reduced-motion: reduce` opens an `Accordion`
- **THEN** the content appears immediately at full height and full opacity, with no growth and no fade

#### Scenario: The animation does not depend on the reset

- **WHEN** a consumer loads only `tokens.css` and the palette, not `reset.css`, and opens an `Accordion` in a supporting browser
- **THEN** the open and close animation still runs, because the component supplies the size interpolation its own animation needs

#### Scenario: Scoped styles stay inside the component

- **WHEN** a page renders an `Accordion` next to a plain `<details data-ui-color="green"><summary>Plain</summary>Body</details>`
- **THEN** the plain element keeps the browser's default appearance and instant disclosure, receiving none of the component's colors, padding, depth or animation

### Requirement: Color palette

The palette SHALL define, on `:root`, the hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` and `yellow`, each with a dark scale (`-d-`) and a light scale (`-l-`) of steps `10` to `100` in tens, plus a 25%-opacity sibling for each of those tokens. `grey` SHALL additionally define steps `110` to `200` in tens on both scales, as given in the grey palette requirement; no other hue SHALL define a step above `100`. The eight hues other than `grey` SHALL keep the OKLCH values of the Harmonizer export `harmonized-palette(2).css` unchanged; `grey` SHALL follow the ramp given in the grey palette requirement. Each token SHALL be named `--nf-<hue>-<d|l>-<step>` or `--nf-<hue>-<d|l>-<step>-25`. Tokens SHALL be ordered by hue name alphabetically, then within each file by ascending step, with the opaque tier written before the 25% tier. `-d-` tokens are the dark-mode scale and `-l-` tokens the light-mode scale.

#### Scenario: Palette is complete and prefixed

- **WHEN** the custom properties declared across `colors-dark.css` and `colors-light.css` are listed together
- **THEN** there are 400 of them (9 hues × 2 scales × 10 steps × 2 opacity tiers, plus grey's 2 scales × 10 extra steps × 2 opacity tiers), every name matches `--nf-<hue>-<d|l>-<step>` or that name plus `-25`, and each opaque token of the eight pre-existing hues equals the export's value for the same unprefixed name

#### Scenario: Only grey goes past step 100

- **WHEN** the palette files are searched for a step above `100`
- **THEN** every match is a `--nf-grey-*` token, and `--nf-blue-d-110` and its counterparts for the other seven hues are undefined

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

The library SHALL export a stylesheet `shadows.css` that defines, on `:root`, one custom property per palette color, named `--nf-shadow-<hue>-<d|l>-<step>`, whose value is the complete box-shadow `0px 4px 0px var(--nf-<hue>-<d|l>-<step>)` for the color of the same name — 200 properties, in the same hue order as the palette files — plus a single `--nf-shadow-depth` holding the shared offsets `0px 4px 0px` on their own, for a shadow whose color is resolved elsewhere. The values SHALL be written out literally rather than derived through a CSS function, so no `color-mix()`, relative color or custom-function support is required. `shadows.css` SHALL NOT define any other custom property, SHALL NOT contain element selectors, and SHALL NOT declare `box-shadow` on anything itself.

#### Scenario: A shadow token is a complete box-shadow value

- **WHEN** a consumer imports the palette and `shadows.css` and writes `box-shadow: var(--nf-shadow-purple-l-80)` on their own element
- **THEN** the element draws a solid `0px 4px 0px` shadow in the color `--nf-purple-l-80`

#### Scenario: Shadow tokens cover the whole palette

- **WHEN** the custom properties declared in `shadows.css` are listed
- **THEN** there are 201 of them — one for each opaque `--nf-<hue>-<d|l>-<step>` palette token, including grey's steps `110` to `200`, plus `--nf-shadow-depth` — and no token for the 25%-opacity tier

#### Scenario: Grey has shadow tokens like every other hue

- **WHEN** a consumer writes `box-shadow: var(--nf-shadow-grey-d-90)`
- **THEN** the element draws a `0px 4px 0px` shadow in `--nf-grey-d-90`

#### Scenario: Extended grey steps have shadow tokens

- **WHEN** a consumer writes `box-shadow: var(--nf-shadow-grey-l-200)`
- **THEN** the element draws a `0px 4px 0px` shadow in `--nf-grey-l-200`

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

Within each palette file, a hue's tokens SHALL be written as two consecutive blocks: first every opaque step of that hue in ascending order (`10` through `100`, or `10` through `200` for `grey`), then the 25%-opacity steps in the same ascending order. A translucent token SHALL NOT appear between two opaque tokens. The blocks for one hue SHALL stay together, and hues SHALL remain in alphabetical order.

#### Scenario: Opaque block precedes the translucent block

- **WHEN** the declarations for one hue in `colors-dark.css` are read top to bottom
- **THEN** they appear as `<hue>-d-10 … <hue>-d-100`, then `<hue>-d-10-25 … <hue>-d-100-25`, with no translucent token among the opaque ones

#### Scenario: Grey's extended steps stay inside its blocks

- **WHEN** the grey declarations in `colors-dark.css` are read top to bottom
- **THEN** they appear as `grey-d-10 … grey-d-200`, then `grey-d-10-25 … grey-d-200-25`, and the `orange` block starts only after `grey-d-200-25`

#### Scenario: Grouping does not change any value

- **WHEN** a consumer who previously loaded the single `colors.css` compares every palette token's computed value against the same token loaded from the folder
- **THEN** every value for the eight pre-existing hues is unchanged

### Requirement: Grey palette ramp

The palette SHALL include a ninth hue, `grey`, that reads as a near-neutral greyscale. Its two scales SHALL share a hue angle of `277.5` and a chroma that rises with the step — `0, 0.002, 0.004, 0.007, 0.009, 0.011, 0.013, 0.016, 0.018, 0.02` for steps `10` through `100` — so the lightest greys are exactly neutral and the darkest carry a faint cool cast. The dark scale's lightness SHALL run `0.98, 0.93, 0.88, 0.83, 0.78, 0.70, 0.61, 0.51, 0.40, 0.29` and the light scale's `0.92, 0.85, 0.78, 0.71, 0.64, 0.57, 0.50, 0.43, 0.36, 0.29`, so both scales descend monotonically from light to dark like every other hue. `--nf-grey-d-10` SHALL be `oklch(0.98 0 277.5)`, the two-decimal OKLCH rounding of `#f9f9f9`, and `--nf-grey-d-100` and `--nf-grey-l-100` SHALL both be `oklch(0.29 0.02 277.5)`, the rounding of `#282A36` — the two anchors of the greyscale's main range.

Below that anchor, both scales SHALL continue with steps `110` through `200`, identical on the two scales: lightness `0.27, 0.25, 0.23, 0.21, 0.19, 0.17, 0.15, 0.13, 0.11, 0.09` and chroma `0.019, 0.018, 0.017, 0.016, 0.015, 0.014, 0.013, 0.012, 0.011, 0.01`, at the same hue angle `277.5`. The extension SHALL keep descending monotonically, SHALL end at a near-black rather than pure black, and SHALL let the cool cast fade as the color darkens.

Grey SHALL receive the same 25%-opacity tier and the same shadow tokens as every other hue, at every one of its steps, and SHALL NOT receive any component rule, token name or default treatment the other hues do not have.

#### Scenario: Grey is a neutral, not a tinted hue

- **WHEN** a reader compares a swatch of `--nf-grey-l-50` against `--nf-blue-l-50` at the same step
- **THEN** the grey swatch reads as grey, with no identifiable hue, while the blue is plainly blue

#### Scenario: The anchors land where specified

- **WHEN** `--nf-grey-d-10` and `--nf-grey-l-100` are rendered as swatches and sampled
- **THEN** the first is the near-white `#f9f9f9` and the second the dark `#282A36`, each within one 8-bit channel step of the source color, the difference coming from the palette's two-decimal precision

#### Scenario: Both grey scales descend without a flat run

- **WHEN** a reader looks at either grey scale rendered as twenty swatches in step order, `10` through `200`
- **THEN** each swatch is visibly darker than the one before it, with no pair that reads as the same color

#### Scenario: The extension continues from the shared anchor

- **WHEN** a consumer reads `--nf-grey-d-110` and `--nf-grey-l-110`
- **THEN** both are `oklch(0.27 0.019 277.5)`, a step darker than `--nf-grey-d-100` and `--nf-grey-l-100`

#### Scenario: The darkest grey is near-black, not black

- **WHEN** `--nf-grey-d-200` is rendered as a swatch next to `#000`
- **THEN** it is `oklch(0.09 0.01 277.5)` and still reads as a separate, very dark grey

#### Scenario: Extended steps behave like any other step

- **WHEN** a consumer uses `--nf-grey-d-150-25` as a background and `var(--nf-shadow-grey-d-180)` as a box-shadow
- **THEN** both resolve, exactly as `--nf-grey-d-50-25` and `--nf-shadow-grey-d-80` do

#### Scenario: Grey behaves like any other hue

- **WHEN** a consumer uses `--nf-grey-l-40-25` as a background and `var(--nf-shadow-grey-l-70)` as a box-shadow
- **THEN** both resolve, exactly as the equivalent tokens do for `purple`
