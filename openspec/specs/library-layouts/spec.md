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

### Requirement: Layouts carry no visual styling of their own yet
`BlogArticle` SHALL expose `nf-layout-blog-article` as a styling hook but SHALL declare no visual styles of its own, and SHALL define no custom properties. Any styling a page shows SHALL come from the consumer's own CSS or from the library's stylesheets if the consumer imports them, so that a consumer's unlayered CSS targeting the hook applies with no specificity contest.

#### Scenario: The layout imposes no design values
- **WHEN** a consumer renders a `BlogArticle` page without importing any library stylesheet
- **THEN** the page shows plain unstyled browser defaults, with no spacing, color, typography or width coming from the layout

#### Scenario: The hook is usable from consumer CSS
- **WHEN** a consumer writes an unlayered rule for `.nf-layout-blog-article` in its own stylesheet
- **THEN** the rule applies, with no layout-declared rule competing with it
