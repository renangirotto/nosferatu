# Spec Delta

## Purpose

Defines the page layouts the library publishes: Astro files that render a consuming project's whole document rather than a fragment of one, and the markup and props each of them guarantees.

## ADDED Requirements

### Requirement: Layouts are a published surface of the library
The library SHALL publish page layouts as `.astro` source alongside its components and stylesheets, importable by a consuming Astro project at `astro-nosferatu/layouts/<Name>.astro`. A layout SHALL render a complete HTML document, so a consumer can use it as the only element of a page file. Layouts SHALL ship as source with no build step and SHALL add no runtime dependency.

#### Scenario: A consumer imports a layout
- **WHEN** a consuming Astro project imports `astro-nosferatu/layouts/BlogArticle.astro` and uses it as the root element of a page
- **THEN** the import resolves and the page builds without the consumer supplying its own doctype, `<html>`, `<head>` or `<body>`

#### Scenario: Layouts reach the consumer as source
- **WHEN** a maintainer runs a dry-run pack of the library from a clean checkout
- **THEN** the tarball lists the layouts' `.astro` files unmodified, with no build command having been run

### Requirement: BlogArticle renders a titled, described article document
The library SHALL publish a `BlogArticle` layout that takes a required `title` string and a required `description` string, and renders a complete HTML document. Within the document body it SHALL render a `main` element carrying the class `nf-layout-blog-article`, containing an `article` element, which contains — in order — an `h1` holding the `title`, a `p` holding the `description`, and then the layout's default slot. The `h1` and the `p` SHALL carry no class authored by the library; the scoping class or attribute Astro generates for a component that declares a `<style>` block is outside the library's control and SHALL NOT count as one. The document head SHALL carry the `title` as the document title and the `description` as the page's description metadata. The layout SHALL render no other content around them.

#### Scenario: The article structure is rendered
- **WHEN** a reader opens a page built from `BlogArticle` with a title, a description and slot content, and inspects the document
- **THEN** the body contains `main.nf-layout-blog-article` > `article`, whose children in document order are an `h1` with the title text, a `p` with the description text, and the content passed into the layout
- **AND** neither the `h1` nor the `p` carries a library-authored class — the only class or attribute on them is the style scope Astro generates

#### Scenario: The title and description reach the document head
- **WHEN** a reader opens a page built from `BlogArticle` and looks at the browser tab and the page source
- **THEN** the tab shows the `title` value, and the head contains the `description` value as the page's description metadata

#### Scenario: Both props are required
- **WHEN** a consuming project renders `BlogArticle` without `title` or without `description` and runs `astro check`
- **THEN** the check reports the missing required prop rather than rendering an empty heading or paragraph

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
