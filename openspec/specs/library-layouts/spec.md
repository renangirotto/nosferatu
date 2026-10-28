# library-layouts Specification

## Purpose

Defines the page layouts the library publishes: Astro files that render a consuming project's whole document rather than a fragment of one, and the markup and props each of them guarantees.

## Requirements

### Requirement: Layouts are a published surface of the library
The library SHALL publish page layouts as `.astro` source alongside its components and stylesheets, importable by a consuming Astro project at `astro-nosferatu/layouts/<Name>.astro`. A layout SHALL render a complete HTML document, so a consumer can use it as the only element of a page file. Layouts SHALL ship as source with no build step and SHALL add no runtime dependency.

#### Scenario: A consumer imports a layout
- **WHEN** a consuming Astro project imports `astro-nosferatu/layouts/BlogArticle.astro` and uses it as the root element of a page
- **THEN** the import resolves and the page builds without the consumer supplying its own doctype, `<html>`, `<head>` or `<body>`

#### Scenario: Layouts reach the consumer as source
- **WHEN** a maintainer runs a dry-run pack of the library from a clean checkout
- **THEN** the tarball lists the layouts' `.astro` files unmodified, with no build command having been run

### Requirement: Layouts build their document from the html surface
A layout SHALL obtain its document skeleton and its head metadata from the library's published document-structure files rather than authoring doctype, `<html>`, `<head>`, `<body>` or metadata tags itself, so that every layout exposes the same document contract and a fix to that contract reaches all of them at once.

#### Scenario: A layout's document matches the html surface
- **WHEN** a reader compares the document a layout produces with the document `BaseHtml` and `BaseHead` produce for the same title, description, language and social image
- **THEN** the skeleton and the head metadata are identical, and the layout's own markup appears only inside `<body>`

#### Scenario: A head fix reaches layouts
- **WHEN** a metadata tag is added to or corrected in `BaseHead`
- **THEN** every layout's rendered head carries the change with no edit to the layout itself

### Requirement: BlogArticle renders a titled, described article document
The library SHALL publish a `BlogArticle` layout that takes a required `title` string, a required `description` string, an optional `lang` string defaulting to `en`, and an optional `imageSocialMedia` string, and renders a complete HTML document. Within the document body it SHALL render a `main` element carrying the class `nf-layout-blog-article`, containing an `article` element, which contains — in order — an `h1` holding the `title`, a `p` holding the `description`, and then the layout's default slot. The `h1` and the `p` SHALL carry no class authored by the library; the scoping class or attribute Astro generates for a component that declares a `<style>` block is outside the library's control and SHALL NOT count as one. The `lang` value SHALL become the `lang` attribute of the `<html>` element. The document head SHALL be the full metadata set the library's `BaseHead` renders, with `title` as the document title, `description` as the page's description metadata, and `imageSocialMedia`, when supplied, as the social-media image. The layout SHALL render no other content around them.

#### Scenario: The article structure is rendered
- **WHEN** a reader opens a page built from `BlogArticle` with a title, a description and slot content, and inspects the document
- **THEN** the body contains `main.nf-layout-blog-article` > `article`, whose children in document order are an `h1` with the title text, a `p` with the description text, and the content passed into the layout
- **AND** neither the `h1` nor the `p` carries a library-authored class — the only class or attribute on them is the style scope Astro generates

#### Scenario: The title and description reach the document head
- **WHEN** a reader opens a page built from `BlogArticle` and looks at the browser tab and the page source
- **THEN** the tab shows the `title` value, and the head contains the `description` value as the page's description metadata

#### Scenario: The head carries the full metadata set
- **WHEN** a reader views the source of a page built from `BlogArticle`
- **THEN** the head contains every tag `BaseHead` renders — charset, color-scheme, generator, viewport, favicon, canonical, title and description, and the Open Graph and Twitter tags — and nothing the layout authored itself

#### Scenario: Language defaults to en and is overridable
- **WHEN** a page is built from `BlogArticle` without `lang`
- **THEN** its `<html>` element carries `lang="en"`
- **AND WHEN** the same page passes `lang="pt-BR"`
- **THEN** its `<html>` element carries `lang="pt-BR"`

#### Scenario: The social image is optional
- **WHEN** a page is built from `BlogArticle` with `imageSocialMedia` set to a path
- **THEN** the head carries `og:image` and `twitter:image` holding that path as an absolute URL
- **AND WHEN** the prop is omitted
- **THEN** neither tag is rendered

#### Scenario: Both props are required
- **WHEN** a consuming project renders `BlogArticle` without `title` or without `description` and runs `astro check`
- **THEN** the check reports the missing required prop rather than rendering an empty heading or paragraph

#### Scenario: The optional props are optional
- **WHEN** a consuming project renders `BlogArticle` with only `title` and `description` and runs `astro check`
- **THEN** the check reports no missing prop

#### Scenario: Slot content is the article body
- **WHEN** a consuming project passes paragraphs and library components as children of `BlogArticle`
- **THEN** they render inside the `article`, after the description paragraph, in the order they were written

### Requirement: Layouts may ship scoped styles
A layout MAY declare visual styles, under the same constraints a component obeys: the styles SHALL live in the layout's own scoped `<style>` block, every design value SHALL be reachable through a `--nf-*` custom property, and no selector SHALL reach outside the markup the layout itself renders. A layout's custom properties SHALL be named `--nf-layout-<layout name>-<role>`, spelling the layout's full name, so that they cannot collide with a consumer's properties or with a library token. A layout SHALL NOT raise specificity to defend its own declarations: a consumer's unlayered rule targeting the layout's hook or the elements inside it SHALL win.

#### Scenario: Styles stay inside the layout
- **WHEN** a page renders a layout's document and the consumer's own `main`, `article`, `h1` and `p` elements appear elsewhere on a page built from the layout's default slot
- **THEN** only the elements the layout itself renders carry its styling, and the slot content is untouched by it

#### Scenario: A consumer's unlayered rule wins
- **WHEN** a consumer writes an unlayered rule setting `font-size` on `.nf-layout-blog-article h1` in its own stylesheet
- **THEN** the consumer's value applies, with no specificity contest from the layout

#### Scenario: Properties spell the layout out
- **WHEN** the custom properties a layout defines are inspected
- **THEN** every one of them is named `--nf-layout-<layout name>-<role>`, and none uses a generic name such as `--nf-h1`, `--nf-fs-base` or `--nf-fluid-vmax`

### Requirement: BlogArticle sizes its text from a fluid type scale
`BlogArticle` SHALL size the text it renders from a type scale that interpolates with the viewport width, declared on its `nf-layout-blog-article` hook. Between a lower viewport bound of `560px` and an upper bound of `1088px`, the layout SHALL interpolate a base font size from `1rem` to `1.125rem` and a type-scale ratio from `1.2` to `1.414`, clamping to the end values outside that range. It SHALL size `h1`, `h2`, `h3` and `h4` as the base size multiplied by that ratio raised to the power `3`, `2.5`, `2` and `1.5` respectively, and `p` at the base size. Every input SHALL be exposed as an overridable custom property named `--nf-layout-blog-article-*`, with the literal values above as their defaults, so a consumer re-tunes the scale by setting properties rather than by overriding each rule. The layout SHALL style no property other than `font-size` — no spacing, color, width or font family — and SHALL apply its sizing only to the elements it renders itself.

#### Scenario: Text grows with the viewport
- **WHEN** a reader opens a `BlogArticle` page and widens the window from below 560px to above 1088px
- **THEN** the paragraph text grows from 16px to 18px, and each heading grows with it, the gaps between heading levels widening as the ratio moves from 1.2 to 1.414

#### Scenario: The scale is clamped at both ends
- **WHEN** the same page is viewed at 320px and at 1920px
- **THEN** the text is sized as it is at 560px and at 1088px respectively, rather than continuing to shrink or grow

#### Scenario: Heading levels are ordered
- **WHEN** a `BlogArticle` page renders an `h1`, `h2`, `h3`, `h4` and a paragraph at any viewport width
- **THEN** their computed font sizes are in strictly descending order, with the paragraph smallest

#### Scenario: The scale is re-tunable from one place
- **WHEN** a consumer sets `--nf-layout-blog-article-font-size-base` and `--nf-layout-blog-article-type-scale-max` in an unlayered rule on `.nf-layout-blog-article`
- **THEN** every heading and paragraph the layout renders resizes accordingly, with no rule-by-rule overriding

#### Scenario: Nothing but size is imposed
- **WHEN** a `BlogArticle` page is rendered without the consumer importing any library stylesheet
- **THEN** the only thing the layout contributes is the font sizes described above: colors, spacing, measure and font family are browser defaults

#### Scenario: Slot content keeps its own sizing
- **WHEN** a consumer passes a library component with its own font size, such as `Button` or `Callout`, into the layout's default slot
- **THEN** that component renders at its own size, unaffected by the layout's scale

#### Scenario: Browsers without the interpolation function stay readable
- **WHEN** a `BlogArticle` page is opened in a browser that does not support the CSS interpolation the fluid scale is built on
- **THEN** the headings and paragraphs render at the browser's own default sizes, in descending order, rather than collapsing to a single size or to zero
