# Spec Delta

## RENAMED Requirements

- FROM: `### Requirement: Docs text uses the Outfit font`
- TO: `### Requirement: Docs text uses the library's base fonts`

## MODIFIED Requirements

### Requirement: Stylesheets are documented
The documentation site's styles page SHALL list every stylesheet the library exports, including `shadows.css` and `typography.css`, with its import path and what it defines. Where a stylesheet applies rules to a consumer's own elements rather than only defining custom properties, the page SHALL say so plainly, name the cascade layer it occupies, list every custom property a consumer can override together with that property's default, and show how to load the rest of the library without it. The page SHALL NOT claim the library leaves all text to the consumer, and SHALL NOT claim the library sets no font family or weight.

The page SHALL document the library's three base fonts as an opt-in: it SHALL name the three family properties and the weight property with their defaults, state which text each one reaches, show the install and import lines for the Fontsource packages, and state plainly that the library ships no font file and that a project which installs nothing renders in the system fonts the stacks end with.

Because the documentation site is itself a consumer whose own cascade layers outrank the library's, a stylesheet whose effect the site's own CSS overrides SHALL be demonstrated on a standalone example page that loads the library's styles without the site's, rather than inline in the documentation page. The styles page SHALL link to that page, and SHALL state that the site's own layers are why the effect is not visible in the surrounding documentation.

#### Scenario: Shadows are listed
- **WHEN** a reader opens the styles page
- **THEN** they see `astro-nosferatu/styles/shadows.css`, the `--nf-shadow-<hue>-<d|l>-<step>` naming pattern, and an example of applying one

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
- **THEN** the page shows setting `--nf-font-family` on `:root` in unlayered CSS and explains that `--nf-font-body` and `--nf-font-heading` follow it

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
- **THEN** the page shows importing `tokens.css`, `colors/index.css`, `shadows.css` and `reset.css` individually in place of `index.css`, notes that files imported on their own are not layered, and states that the font properties come with `typography.css`

#### Scenario: The browser-support caveat is stated
- **WHEN** a reader looks at the typography section
- **THEN** it states that the scale relies on the CSS `progress()` function, that browsers without it fall back to their own heading and paragraph sizes, and that the scale is therefore progressive enhancement rather than a guaranteed appearance

### Requirement: Layout pages document markup, props, slots and styling
The documentation site SHALL document each layout the library publishes on its own page, reachable from the sidebar under a layouts group. Because a layout renders a whole document and therefore cannot be embedded inside a documentation page, the page SHALL instead show the layout's import line, a copyable usage example, the exact markup the layout produces, a props table giving each prop's type, whether it is required and its default, and a description of each slot. The page SHALL link to a standalone example page on the docs site that is built with the layout, so a reader can see it rendered for real. Where a layout delegates its document skeleton or its head metadata to a published html file, the page SHALL say so and link to that file's page instead of repeating its metadata list. The page SHALL state accurately what the layout styles and what it leaves to the consumer, and where the layout ships styles it SHALL list every custom property a consumer can override, with that property's default, together with runnable code for overriding them and for overriding the layout from unlayered CSS. Where a layout styles the content passed into a slot, the page SHALL say so, rather than describing the styling as limited to the markup the layout renders itself.

#### Scenario: BlogArticle page
- **WHEN** a reader opens the BlogArticle page of the docs site
- **THEN** they see the import line `import BlogArticle from 'astro-nosferatu/layouts/BlogArticle.astro'`, an example page using it, and the rendered markup showing `main.nf-layout-blog-article` > `article` > `h1` + `p` + slot content

#### Scenario: Props are documented
- **WHEN** a reader looks at the BlogArticle page's props table
- **THEN** it lists `title` and `description`, both `string` and both required, `lang`, an optional `string` defaulting to `en`, and `imageSocialMedia`, an optional `string`, and states that `title` becomes the document title and the `h1`, `description` becomes the page description metadata and the paragraph under the heading, `lang` becomes the `<html>` element's language, and `imageSocialMedia` becomes the Open Graph and Twitter image

#### Scenario: The composition is documented
- **WHEN** a reader looks at the BlogArticle page
- **THEN** it states that the layout's document and head come from `BaseHtml` and `BaseHead` and links to those pages for the metadata the head contains

#### Scenario: A real rendered example exists
- **WHEN** a reader follows the example link on the BlogArticle page
- **THEN** a standalone page of the docs site, built with the layout, opens and shows the heading, the description paragraph and the article body outside the Starlight documentation chrome
- **AND** that page's prose renders in Plus Jakarta Sans, its code in Geist Mono and its headings in Outfit, because the docs site installs the font packages

#### Scenario: The styling section describes what the layout really does
- **WHEN** a reader looks at the BlogArticle page's styling section
- **THEN** it states that the layout sizes its headings and paragraphs from a fluid type scale, sets its prose in the article font and its code in the code font, and styles nothing else, names `.nf-layout-blog-article` as the hook to target, and shows how a consumer styles it from its own unlayered CSS
- **AND** it does not claim that the layout ships no styles or sets no font

#### Scenario: The article's fonts are documented
- **WHEN** a reader looks for which elements the article font reaches
- **THEN** the page states that `p`, `strong`, `span` and `a` take the article font at weight `400`, that `code` and `pre` take the code font, that headings keep the page's general font, and that all of it applies to slot content as well as to the heading and description the layout renders

#### Scenario: The theming properties are listed
- **WHEN** a reader looks for how to re-tune the BlogArticle type scale or its fonts
- **THEN** the page lists every `--nf-layout-blog-article-*` property with its default value, including the two font-family properties and the font-weight property, and shows a runnable override example, so a reader never has to read the layout's source to discover them

#### Scenario: The layout is reachable in the sidebar
- **WHEN** a reader browses the docs site's sidebar
- **THEN** a Layouts group lists the BlogArticle page, and following it opens that page

### Requirement: Docs text uses the library's base fonts
In both its light and dark themes, the documentation site SHALL set its body and interface text — paragraphs, headings, sidebar, top bar, table of contents and search — in the library's general font, and its code — inline code and fenced code blocks — in the library's code font, served by the site itself rather than from a third-party font host. The site SHALL take both from the library's font properties rather than naming a family of its own, so that the docs demonstrate the opt-in path a consumer follows: it installs the Fontsource packages, imports them, and feeds its own theme from `--nf-font-family` and `--nf-font-family-code-blog-post`. The library SHALL still load no font on the site's behalf.

#### Scenario: Plain text is in Outfit
- **WHEN** a reader inspects a body paragraph, a heading, a sidebar link and a table-of-contents link, in either theme
- **THEN** each one's rendered font is `Outfit Variable`

#### Scenario: Code is not in Outfit
- **WHEN** a reader inspects inline code and the code inside a fenced code block
- **THEN** each renders in `Geist Mono Variable`, and no code renders in Outfit

#### Scenario: The theme reads the library's properties
- **WHEN** the docs site's own theme stylesheet is inspected
- **THEN** its font variables are defined from `var(--nf-font-family)` and `var(--nf-font-family-code-blog-post)`, and no font family name is written literally in the site's CSS

#### Scenario: Font is self-hosted
- **WHEN** a reader loads a documentation page with the browser's network panel open
- **THEN** the font files are requested from the docs site's own origin, and no request goes to a font CDN
