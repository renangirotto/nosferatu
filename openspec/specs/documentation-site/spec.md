# documentation-site Specification

## Purpose

Defines the Starlight documentation site for `astro-nosferatu`: it documents the library by using its public exports and is never published as a package.

## Requirements

### Requirement: Docs consume the library through its public exports

The documentation site SHALL import components, layouts, document-structure files and styles only through the library's package name and public import paths, never through relative paths into the library's source.

#### Scenario: Docs build exercises the exports

- **WHEN** a component is removed from the library's public exports and the docs site is built
- **THEN** the docs build fails on the unresolved import

#### Scenario: Layouts are exercised too

- **WHEN** the docs site is built
- **THEN** it imports every documented layout as `astro-nosferatu/layouts/<Name>.astro`, so a missing or misnamed layout export fails the build

#### Scenario: Html files are exercised too

- **WHEN** the docs site is built
- **THEN** it imports every documented html file as `astro-nosferatu/html/<Name>.astro`, so a missing or misnamed html export fails the build

### Requirement: Docs live demos

The documentation site SHALL render each documented component live on its page, alongside an example of how to import it. A component page SHALL show a live example of every value of each enumerated prop the component accepts, document each prop — enumerated or not — with its type, whether it is required, and its default, document every slot it renders, and state how the component can be re-themed. Where a component's rendering depends on whether a slot was supplied, the page SHALL show both cases live.

#### Scenario: Button page

- **WHEN** a reader opens the Button page of the docs site
- **THEN** they see a rendered `Button` and the import line `import Button from 'astro-nosferatu/components/Button.astro'`

#### Scenario: Every color is shown

- **WHEN** a reader opens the Button page
- **THEN** they see a live `Button` for each of `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`, each labelled with the value that produces it

#### Scenario: Interaction states are demonstrable

- **WHEN** a reader hovers and presses a `Button` in a demo on its page
- **THEN** the button visibly sinks and flattens, and the page explains the resting, hover and active behaviour in prose

#### Scenario: Theming is documented with runnable code

- **WHEN** a reader looks at the Button page's theming section
- **THEN** it shows a live demo of overriding the component's color custom properties together with the exact code that produces it

#### Scenario: Slots are documented

- **WHEN** a reader opens the page of a component that renders slots, such as `Callout`
- **THEN** the page lists each slot by name, says whether it is optional, and states what the component does when it is omitted

### Requirement: Callout page

The documentation site SHALL document `Callout` on its own page, rendering it live for every value of its `color` prop, with and without a body, and with and without icon-slot content. The page SHALL state that `title` is required and is not rendered as a tooltip or a heading, SHALL document the `icon` prop and the body slot, SHALL show the `--nf-callout-*` custom properties a consumer can override with a live theming demo, and SHALL state that the component's drop shadow comes from `shadows.css`. Because `icon` accepts any component, the page SHALL demonstrate more than one kind of icon component and state that the library ships none.

#### Scenario: Callout page renders the component

- **WHEN** a reader opens the Callout page
- **THEN** they see a rendered `Callout` and the import line `import Callout from 'astro-nosferatu/components/Callout.astro'`

#### Scenario: Every color is shown

- **WHEN** a reader opens the Callout page
- **THEN** they see a live `Callout` for each of `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`, each labelled with the value that produces it

#### Scenario: The icon prop is shown taking different components

- **WHEN** a reader opens the Callout page's icon section
- **THEN** they see live callouts whose `icon` is an imported SVG component and one that is a component rendering a text character, and a callout with no icon at all, each with the code that produces it
- **AND** the page states that the library ships no icon set, that the demos' icons come from a package the documentation site installs for itself, and that the prop takes a component rather than an element or a name

#### Scenario: The optional body is demonstrated

- **WHEN** a reader looks at the Callout page's content section
- **THEN** a callout with a body and a callout without one are shown side by side, with the code for each, so the difference in the separator rule and the spacing is visible

#### Scenario: Theming is documented with runnable code

- **WHEN** a reader looks at the Callout page's theming section
- **THEN** it shows a live demo of overriding the component's custom properties together with the exact code that produces it

### Requirement: Accordion page

The documentation site SHALL document `Accordion` on its own page, rendering it live for every value of its `color` prop. The page SHALL state that `summary` is required and is not rendered as a native attribute, SHALL document the default slot, and SHALL show live examples of a closed accordion, one rendered with the native `open` attribute, and a group of accordions sharing a native `name` so that opening one closes the others — each with the code that produces it. The page SHALL describe the summary's resting, hover, active, focus and `[open]` appearances in prose beside a demo the reader can actually operate, SHALL list the `--nf-accordion-*` custom properties a consumer can override together with a live theming demo and its exact code, and SHALL end with a demo placing the component beside a plain `<details>` element to show the component's styles do not leak. Because the open and close animation is progressive enhancement, the page SHALL state what the animation depends on, what a browser without that support does instead, and that reduced motion turns it off.

#### Scenario: Accordion page renders the component

- **WHEN** a reader opens the Accordion page
- **THEN** they see a rendered `Accordion` and the import line `import Accordion from 'astro-nosferatu/components/Accordion.astro'`

#### Scenario: Every color is shown

- **WHEN** a reader opens the Accordion page
- **THEN** they see a live `Accordion` for each of `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` and `yellow`, each labelled with the value that produces it

#### Scenario: The animation is demonstrable

- **WHEN** a reader clicks the summary of a demo on the page
- **THEN** the panel visibly grows open and shrinks closed, and the page explains in prose that the animation is CSS-only, that it depends on `::details-content` and CSS size interpolation, and that a browser without them opens the panel instantly instead

#### Scenario: Native attributes are demonstrated

- **WHEN** a reader looks at the page's section on disclosure state
- **THEN** they see a live accordion rendered with `open`, and a live group of accordions sharing the same `name` where opening one closes the previously open one, with the code for each and a note that both come from the native `<details>` element rather than from props

#### Scenario: Interaction states are documented

- **WHEN** a reader hovers, presses, tabs to and opens an `Accordion` in a demo
- **THEN** the summary visibly sinks, flattens, shows its inset focus outline and stays pressed while open, and the page describes each of those states in prose

#### Scenario: Theming is documented with runnable code

- **WHEN** a reader looks at the Accordion page's theming section
- **THEN** it shows a live demo overriding `--nf-accordion-color` and `--nf-accordion-accent-color` on the component element itself, and one overriding a palette token, together with the exact code that produces each
- **AND** it states that an accordion with no `color` also takes the two properties from an ancestor, while one with a `color` needs them on the element, because its own `data-ui-color` rule declares them there and an inherited value cannot win against that

#### Scenario: The slot is documented

- **WHEN** a reader looks at the Accordion page's props and slots tables
- **THEN** `summary` is listed as a required `string` that is not forwarded as an attribute, `color` as an optional palette hue whose default is grey with no `data-ui-color` attribute rendered, the default slot is described as the disclosed content, and the page states that all other native `<details>` attributes pass through

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

### Requirement: Html files are documented

The documentation site SHALL document each document-structure file the library publishes on its own page, reachable from the sidebar under an HTML group. Because such a file renders document structure or head metadata and therefore cannot be embedded inside a documentation page, the page SHALL instead show the file's import line, a copyable usage example, the markup it produces, a props table giving each prop's type, whether it is required and its default, and a description of each slot it renders. The `BaseHead` page SHALL additionally state which stylesheet it imports on the consumer's behalf, and that the favicon path, the Open Graph type and the Twitter card type are fixed and are extended through `BaseHtml`'s `head` slot.

#### Scenario: BaseHtml page

- **WHEN** a reader opens the BaseHtml page of the docs site
- **THEN** they see the import line `import BaseHtml from 'astro-nosferatu/html/BaseHtml.astro'`, the document skeleton it produces, and a usage example placing a head fragment in the `head` slot and page content in the default slot

#### Scenario: BaseHtml props and slots are documented

- **WHEN** a reader looks at the BaseHtml page's tables
- **THEN** they list `lang` as an optional `string` defaulting to `en`, and describe both the named `head` slot, rendered inside `<head>`, and the default slot, rendered inside `<body>`, each as optional

#### Scenario: BaseHead page

- **WHEN** a reader opens the BaseHead page of the docs site
- **THEN** they see the import line `import BaseHead from 'astro-nosferatu/html/BaseHead.astro'`, the full list of metadata tags it renders, and a props table listing `title` and `description` as required strings and `imageSocialMedia` as an optional string
- **AND** the page states that the two image tags are rendered only when `imageSocialMedia` is supplied, and that the component loads no font

#### Scenario: The HTML group is reachable in the sidebar

- **WHEN** a reader browses the docs site's sidebar
- **THEN** an HTML group lists the BaseHtml and BaseHead pages, and following either opens that page

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

### Requirement: Docs are never published

The documentation site SHALL be marked private so it cannot be published to a registry.

#### Scenario: Publish attempt is refused

- **WHEN** a maintainer runs a publish command from the docs site's directory
- **THEN** the package manager refuses because the package is private

### Requirement: Local docs development

Maintainers SHALL be able to start the docs site locally with one command from the repository root, and changes to library components or styles SHALL appear in the running site without reinstalling.

#### Scenario: Edit a component while docs run

- **WHEN** the docs dev server is running and a maintainer edits `Button.astro` in the library
- **THEN** the docs page reflects the change after reload, without a reinstall

### Requirement: Docs dark theme uses the library palette

In its dark theme, the documentation site SHALL take the following colors from the library's dark palette rather than from Starlight's defaults: the background behind page content, the table of contents, the left sidebar navigation, the top bar and the mobile table-of-contents bar from `--nf-grey-d-100`, plain body text from `--nf-grey-d-10`, table-of-contents links on hover and for the current section from `--nf-purple-d-50`, the background of the sidebar link for the current page from `--nf-purple-d-50`, and the text of inline code in page content from `--nf-green-d-50`, with inline code drawn at font weight 600 on a `--nf-grey-d-120` background. Code blocks SHALL be highlighted with the Dracula theme and SHALL have an 8px corner radius and a `--nf-grey-d-80-25` border. The mobile table-of-contents toggle and its open list SHALL have a `--nf-grey-d-110` background, the toggle with a `--nf-grey-d-80-25` border. The search button, where it is drawn as a bordered field, SHALL have a `--nf-grey-d-110` background and a `--nf-grey-d-80-25` border. In the dark theme, the borders separating the left sidebar, the top bar, the mobile table of contents and the desktop table of contents from the content SHALL be transparent. The site SHALL read these colors from the palette tokens the library publishes, so a change to a palette value shows up in the docs without editing the docs. The light theme SHALL be unaffected. The library itself SHALL NOT change to support this.

#### Scenario: Content and table of contents background

- **WHEN** a reader opens any documentation page in the dark theme
- **THEN** the area behind the page content and behind the "On this page" table of contents has the computed background color of `--nf-grey-d-100`

#### Scenario: Chrome background

- **WHEN** a reader opens any documentation page in the dark theme, on a wide and on a narrow viewport
- **THEN** the left sidebar navigation, the top bar and the mobile "On this page" bar all have the computed background color of `--nf-grey-d-100`

#### Scenario: No chrome borders

- **WHEN** a reader opens any documentation page in the dark theme, on a wide and on a narrow viewport
- **THEN** no visible border line separates the left sidebar, the top bar, the mobile table of contents or the desktop table of contents from the page content; each of those borders computes to `transparent`

#### Scenario: Plain text color

- **WHEN** a reader inspects a body paragraph on a documentation page in the dark theme
- **THEN** its computed text color equals `--nf-grey-d-10`

#### Scenario: Table of contents links

- **WHEN** a reader hovers a link in the table of contents, or scrolls so a section becomes current
- **THEN** that link's text color equals `--nf-purple-d-50`, and other links return to the body text color when not hovered or current

#### Scenario: Sidebar current page

- **WHEN** a reader opens a page in the dark theme
- **THEN** that page's link in the left sidebar navigation has the background color `--nf-purple-d-50`, and its label remains legible against it

#### Scenario: Inline code

- **WHEN** a reader views inline code such as an import path inside a paragraph in the dark theme
- **THEN** the code's text color equals `--nf-green-d-50`, its background `--nf-grey-d-120` and its font weight 600, and code inside fenced code blocks keeps its syntax-highlighting colors

#### Scenario: Code blocks

- **WHEN** a reader views a fenced code block on a documentation page in the dark theme
- **THEN** its syntax colors and background come from the Dracula theme, and its frame has an 8px corner radius and a border whose color equals `--nf-grey-d-80-25`
- **AND** in the light theme the same block keeps Starlight's default light code theme

#### Scenario: Mobile table-of-contents toggle

- **WHEN** a reader on a narrow viewport opens the "On this page" toggle in the dark theme
- **THEN** the toggle and the list it opens have the background `--nf-grey-d-110`, and the toggle's border color equals `--nf-grey-d-80-25`

#### Scenario: Search button

- **WHEN** a reader views the top bar on a wide viewport in the dark theme
- **THEN** the search button has the background `--nf-grey-d-110` and a border whose color equals `--nf-grey-d-80-25`

#### Scenario: Light theme untouched

- **WHEN** a reader switches the site to the light theme
- **THEN** the background, border, text, link and code colors are Starlight's light-theme defaults

#### Scenario: Library unchanged

- **WHEN** a maintainer runs `pnpm pack:check` after this change
- **THEN** the listed tarball contents are identical to before the change

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

### Requirement: Color-variant pages document the unset default

On the page of every component that accepts a `color` prop, the documentation site SHALL state that omitting `color` renders the component in grey with no `data-ui-color` attribute, that `color="grey"` looks the same but carries the attribute, and SHALL list the prop's default in the props table as grey (unset) rather than as a hue the component writes into its markup.

#### Scenario: Default stated in prose and table

- **WHEN** a reader opens the Button, Callout or Accordion page
- **THEN** the color section and the props table both say the default is grey with no `data-ui-color` attribute, and no page says the default is `purple`

#### Scenario: Default shown live

- **WHEN** a reader looks at the color section of one of those pages
- **THEN** it includes a live instance rendered with no `color`, labelled as the default, beside the per-hue demos
