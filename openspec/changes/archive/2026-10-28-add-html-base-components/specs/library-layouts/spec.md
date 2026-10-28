# Spec Delta

## ADDED Requirements

### Requirement: Layouts build their document from the html surface
A layout SHALL obtain its document skeleton and its head metadata from the library's published document-structure files rather than authoring doctype, `<html>`, `<head>`, `<body>` or metadata tags itself, so that every layout exposes the same document contract and a fix to that contract reaches all of them at once.

#### Scenario: A layout's document matches the html surface
- **WHEN** a reader compares the document a layout produces with the document `BaseHtml` and `BaseHead` produce for the same title, description, language and social image
- **THEN** the skeleton and the head metadata are identical, and the layout's own markup appears only inside `<body>`

#### Scenario: A head fix reaches layouts
- **WHEN** a metadata tag is added to or corrected in `BaseHead`
- **THEN** every layout's rendered head carries the change with no edit to the layout itself

## MODIFIED Requirements

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
