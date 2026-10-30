# Spec Delta

## MODIFIED Requirements

### Requirement: Stylesheets are documented

The documentation site's styles page SHALL list every stylesheet the library exports, including `spacings.css`, `borders.css`, `shadows.css` and `typography.css`, with its import path and what it defines. It SHALL present `tokens.css` as the aggregate it is — the one import that brings in the palette, the shadows, the spacing scale and the border radii, and declares nothing itself — and SHALL state that the typographic properties are not part of it and come with `typography.css`. Where a stylesheet applies rules to a consumer's own elements rather than only defining custom properties, the page SHALL say so plainly, name the cascade layer it occupies, list every custom property a consumer can override together with that property's default, and show how to load the rest of the library without it. The page SHALL NOT claim the library leaves all text to the consumer, and SHALL NOT claim the library sets no font family or weight.

The page SHALL document every token the library publishes with the value it ships, grouped by the stylesheet that defines it, and SHALL NOT list a token the library no longer publishes. For the spacing and border-radius scales it SHALL give each step's name and `px` value in scale order, state that the values are absolute `px` and therefore do not follow the reader's root font size, and state what each scale is for — spacing for `margin`, `padding` and `gap`, the radius scale for corners.

The page SHALL document the removal of the previous `--nf-space-*`, `--nf-radius-*` and `--nf-font-*` ladder tokens as a migration note, in the same form as the note about the old flat palette path: it SHALL give the replacement for each removed token, or state plainly that there is none, and SHALL say that a consumer who wrote CSS against the former `nosferatu.colors` or `nosferatu.shadows` layer targets `nosferatu.tokens` instead.

The page SHALL document the library's three base fonts as an opt-in: it SHALL name the three family properties and the weight property with their defaults, state which text each one reaches, show the install and import lines for the Fontsource packages, and state plainly that the library ships no font file and that a project which installs nothing renders in the system fonts the stacks end with.

Because the documentation site is itself a consumer whose own cascade layers outrank the library's, a stylesheet whose effect the site's own CSS overrides SHALL be demonstrated on a standalone example page that loads the library's styles without the site's, rather than inline in the documentation page. The styles page SHALL link to that page, and SHALL state that the site's own layers are why the effect is not visible in the surrounding documentation.

#### Scenario: Shadows are listed

- **WHEN** a reader opens the styles page
- **THEN** they see `astro-nosferatu/styles/shadows.css`, the `--nf-shadow-<hue>-<d|l>-<step>` naming pattern, and an example of applying one

#### Scenario: The spacing scale is listed

- **WHEN** a reader opens the styles page
- **THEN** they see `astro-nosferatu/styles/spacings.css` in the stylesheet table and all ten steps with their values — `--nf-spacing-none` `0px`, `--nf-spacing-base-low-4` `2px`, `-low-3` `4px`, `-low-2` `8px`, `-low-1` `12px`, `--nf-spacing-base` `16px`, `-up-1` `20px`, `-up-2` `24px`, `-up-3` `28px`, `-up-4` `32px` — described as the tokens to use for margin, padding and gap

#### Scenario: The border radii are listed

- **WHEN** a reader opens the styles page
- **THEN** they see `astro-nosferatu/styles/borders.css` in the stylesheet table with `--nf-border-radius-base-low-1` `4px`, `--nf-border-radius-base` `8px` and `--nf-border-radius-base-up-1` `12px`, and a statement that the library publishes no token for the border's width, style or color

#### Scenario: The token table matches what the library ships

- **WHEN** a reader compares the styles page's token table against the library's stylesheets
- **THEN** no `--nf-space-*`, `--nf-radius-*`, `--nf-font-size-*`, `--nf-font-weight-normal|-medium|-bold`, `--nf-line-height-*`, `--nf-font-body`, `--nf-font-heading` or `--nf-font-mono` appears anywhere on the page except in the migration note

#### Scenario: The removals are documented as a migration

- **WHEN** a reader upgrading from the previous release opens the styles page
- **THEN** a migration note maps `--nf-space-1`, `-2`, `-3`, `-4`, `-6` and `-8` to `--nf-spacing-base-low-3`, `-low-2`, `-low-1`, `--nf-spacing-base`, `--nf-spacing-base-up-2` and `--nf-spacing-base-up-4`, maps `--nf-radius-sm` and `--nf-radius-md` to `--nf-border-radius-base-low-1` and `--nf-border-radius-base`, states that `--nf-radius-full` has no replacement, points the three font tokens at `--nf-font-family` and `--nf-font-family-code-blog-post`, gives the literal values the size, weight and line-height tokens held, and tells a reader who layered into `nosferatu.colors` or `nosferatu.shadows` to use `nosferatu.tokens`

#### Scenario: The layer diagram shows three layers

- **WHEN** a reader looks at the cascade-layers section
- **THEN** the `@layer` line and the precedence diagram both read `nosferatu.tokens`, `nosferatu.reset`, `nosferatu.typography`, followed by the reader's own unlayered CSS, and the page explains that the palette and the shadows sit inside `nosferatu.tokens` because `tokens.css` imports them

#### Scenario: Typography is listed

- **WHEN** a reader opens the styles page
- **THEN** they see `astro-nosferatu/styles/typography.css` in the stylesheet table, and the layer diagram shows `nosferatu.typography` as the last library layer

#### Scenario: The page says which elements are styled

- **WHEN** a reader looks at the styles page's typography section
- **THEN** it states that importing `index.css` sizes `h1`, `h2`, `h3` and `p` on their own page and sets the font family and weight of `body`, and that `a` and `h4`–`h6` are left alone
- **AND** no sentence anywhere on the page still says the library styles no headings or paragraphs, or that it sets no font family

#### Scenario: The three fonts are documented with their jobs

- **WHEN** a reader looks for what font the library uses
- **THEN** the page lists `--nf-font-family` (Outfit, the page's general text), `--nf-font-family-blog-post` (Plus Jakarta Sans, `BlogArticle` prose), `--nf-font-family-code-blog-post` (Geist Mono, `BlogArticle` code) and `--nf-font-weight` (`400`), each with the full stack it ships

#### Scenario: Opting in is shown as runnable code

- **WHEN** a reader wants the actual fonts
- **THEN** the page shows the package manager line installing `@fontsource-variable/outfit`, `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/geist-mono`, and the import lines that load them in a consumer's own layout or config
- **AND** it states that the library ships no font file, loads nothing on the reader's behalf, and falls back to the system stacks when the packages are absent

#### Scenario: Substituting a font is documented

- **WHEN** a reader wants a different font
- **THEN** the page shows setting `--nf-font-family` on `:root` in unlayered CSS and explains that `body`, everything inheriting from it, and the library's own components all follow it, because `--nf-font-family` is the single property for the page's general text

#### Scenario: Every typography property is documented with its default

- **WHEN** a reader looks for the knobs on the type scale
- **THEN** the page lists `--nf-typography-viewport-min`, `--nf-typography-viewport-max`, `--nf-typography-viewport-progress`, and for each of `h1`, `h2`, `h3` and `p` its `-min`, `-max` and resolved property, each with the value the library ships

#### Scenario: Retuning the scale is shown as runnable code

- **WHEN** a reader looks at the typography section's theming example
- **THEN** it shows unlayered CSS overriding a `--nf-typography-*` property on `:root`, and explains that an unlayered override wins over the library's layer without extra specificity

#### Scenario: The scale is demonstrated on a standalone page

- **WHEN** a reader wants to see the type scale actually working
- **THEN** the styles page links to a standalone example page that loads `astro-nosferatu/styles/index.css` and no documentation-site CSS
- **AND** that page renders an `h1`, `h2`, `h3` and `p` sized by the scale, and reports the current viewport width together with each element's computed `font-size`, so resizing the window shows the sizes change

#### Scenario: The docs site's own layers are explained

- **WHEN** a reader notices that the headings of the documentation page itself are not sized by the scale
- **THEN** the styles page states that the documentation site declares its own cascade layers after importing the library, so the site's heading rules outrank `nosferatu.typography`
- **AND** it presents this as ordinary layer precedence rather than a defect, and as the reason the live demo lives on its own page

#### Scenario: The bounds are explained as real limits

- **WHEN** a reader looks at what `--nf-typography-viewport-min` and `--nf-typography-viewport-max` do
- **THEN** the page states that each element reaches its named minimum at the first width and its maximum at the second, and holds at that size outside the range
- **AND** it shows how to opt one element out of the scale entirely by setting its resolved `--nf-typography-font-size-*` property to a constant

#### Scenario: Opting out is documented

- **WHEN** a reader does not want the library sizing their text or setting their font
- **THEN** the page shows importing `tokens.css` and `reset.css` individually in place of `index.css`, notes that files imported on their own are not layered, and states that the font properties come with `typography.css`
- **AND** it shows that a reader who wants one token group alone imports `colors/index.css`, `shadows.css`, `spacings.css` or `borders.css` directly rather than `tokens.css`

#### Scenario: The browser-support caveat is stated

- **WHEN** a reader looks at the typography section
- **THEN** it states that the scale relies on the CSS `progress()` function, that browsers without it fall back to their own heading and paragraph sizes, and that the scale is therefore progressive enhancement rather than a guaranteed appearance
