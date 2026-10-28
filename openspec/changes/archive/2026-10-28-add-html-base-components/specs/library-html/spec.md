# Spec Delta

## Purpose

Defines the document-structure surface of the library: Astro files that render the skeleton and the metadata of an HTML document rather than visible page content, so that layouts and consumers assemble a document from one shared, correct implementation.

## ADDED Requirements

### Requirement: Html files are a published surface of the library
The library SHALL publish document-structure files as `.astro` source alongside its components, layouts and stylesheets, importable by a consuming Astro project at `astro-nosferatu/html/<Name>.astro`. These files SHALL ship as source with no build step and SHALL add no runtime dependency. Each of them SHALL render document structure or document metadata only, never visible page content.

#### Scenario: A consumer imports an html file
- **WHEN** a consuming Astro project imports `astro-nosferatu/html/BaseHtml.astro` and `astro-nosferatu/html/BaseHead.astro` and builds a page from them
- **THEN** both imports resolve and the page builds without the consumer supplying its own doctype, `<html>`, `<head>`, `<body>` or metadata tags

#### Scenario: Html files reach the consumer as source
- **WHEN** a maintainer runs a dry-run pack of the library from a clean checkout
- **THEN** the tarball lists the html `.astro` files unmodified, with no build command having been run

#### Scenario: They render no visible content
- **WHEN** a page built only from `BaseHtml` and `BaseHead`, with nothing passed into the default slot, is opened in a browser
- **THEN** the viewport shows an empty document: the files contribute only the document skeleton and head metadata

### Requirement: BaseHtml renders the document skeleton
The library SHALL publish `BaseHtml`, which renders — in order — the HTML5 doctype, an `<html>` element, a `<head>` element and a `<body>` element, and nothing else. It SHALL accept an optional `lang` string prop, defaulting to `en`, rendered as the `lang` attribute of `<html>`. It SHALL render a named `head` slot as the content of `<head>` and its default slot as the content of `<body>`. It SHALL NOT render any element of its own inside either slot's position, so the document contains exactly the tags the consumer supplied plus the skeleton.

#### Scenario: The skeleton is rendered
- **WHEN** a consuming project renders `BaseHtml` and views the page source
- **THEN** the document starts with `<!DOCTYPE html>` and contains an `<html>` element whose children are `<head>` and `<body>`, in that order

#### Scenario: lang defaults to en
- **WHEN** a consuming project renders `BaseHtml` without passing `lang`
- **THEN** the `<html>` element carries `lang="en"`

#### Scenario: lang is overridable
- **WHEN** a consuming project renders `BaseHtml` with `lang="pt-BR"`
- **THEN** the `<html>` element carries `lang="pt-BR"`

#### Scenario: The head slot lands in the head
- **WHEN** a consuming project passes `<meta>`, `<title>` and `<link>` elements into the `head` slot
- **THEN** they render inside `<head>`, in the order they were written, and nothing from the default slot appears there

#### Scenario: The default slot lands in the body
- **WHEN** a consuming project passes page markup as the children of `BaseHtml`
- **THEN** that markup renders inside `<body>`, in the order it was written

#### Scenario: Both slots are optional
- **WHEN** a consuming project renders `BaseHtml` with neither slot filled and runs `astro check`
- **THEN** the check reports no missing required prop or slot, and the page renders an empty but valid document

### Requirement: BaseHead renders the document metadata
The library SHALL publish `BaseHead`, a fragment intended for `BaseHtml`'s `head` slot, which takes a required `title` string, a required `description` string and an optional `imageSocialMedia` string. It SHALL render, as direct children of the head it is placed in:

- `<meta charset="utf-8">`, `<meta name="color-scheme" content="dark light">`, a `generator` meta naming the Astro version that built the page, and `<meta name="viewport" content="width=device-width,initial-scale=1">`
- `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
- a `<link rel="canonical">` to the current page's canonical URL
- `<title>` and `<meta name="title">` holding `title`, and `<meta name="description">` holding `description`
- Open Graph metadata: `og:type` of `website`, `og:url` of the current page URL, `og:title` and `og:description`
- Twitter metadata: `twitter:card` of `summary_large_image`, `twitter:url` of the current page URL, `twitter:title` and `twitter:description`

When `imageSocialMedia` is supplied, it SHALL additionally render `og:image` and `twitter:image`, each holding `imageSocialMedia` resolved to an absolute URL against the current page URL, so a relative path such as `/og.png` is published as a full URL. When it is omitted, neither image tag SHALL be rendered. `BaseHead` SHALL NOT render `<head>` itself, SHALL NOT load any font, and SHALL expose no prop for the favicon, the Open Graph type or the Twitter card type.

#### Scenario: The metadata set is rendered
- **WHEN** a reader opens a page whose head is `BaseHead` with a title and a description and views the source
- **THEN** the head contains the charset, color-scheme, generator and viewport metas, the favicon link, the canonical link, the title element and title meta, the description meta, the four `og:` tags and the four `twitter:` tags listed above

#### Scenario: The social image is optional
- **WHEN** a page renders `BaseHead` without `imageSocialMedia`
- **THEN** the head contains no `og:image` and no `twitter:image` tag
- **AND WHEN** the same page renders `BaseHead` with `imageSocialMedia="/og.png"`
- **THEN** the head contains an `og:image` and a `twitter:image` whose content is the absolute URL of `/og.png` for that page's origin

#### Scenario: title and description are required
- **WHEN** a consuming project renders `BaseHead` without `title` or without `description` and runs `astro check`
- **THEN** the check reports the missing required prop

#### Scenario: No font is loaded
- **WHEN** the network requests of a page built from `BaseHead` are inspected
- **THEN** the page requests no font file on the library's behalf, and a consumer wanting one adds it through `BaseHtml`'s `head` slot

### Requirement: BaseHead resolves a canonical URL without consumer configuration
`BaseHead` SHALL build its canonical link from the current page's path against the consuming project's configured site URL. When the consuming project configures no site URL, `BaseHead` SHALL fall back to the current page URL rather than failing the build, so a page using it builds in a project with no `site` setting.

#### Scenario: Canonical uses the configured site
- **WHEN** a consuming project configures its site as `https://example.com` and builds a page at `/blog/post/`
- **THEN** that page's canonical link is `https://example.com/blog/post/`

#### Scenario: No site configured still builds
- **WHEN** a consuming project with no site URL configured builds a page using `BaseHead`
- **THEN** the build succeeds and the page renders a canonical link for the current page rather than reporting an invalid URL

### Requirement: BaseHead brings in the library stylesheets and authors none
`BaseHead` SHALL import the library's own aggregated stylesheet, so that a page using it gets the library's tokens, palette, shadows and reset in their declared layer order without the consumer importing anything else. It SHALL declare no CSS of its own and define no custom property, so a consumer's unlayered CSS keeps winning over everything the library contributes.

#### Scenario: Styles arrive with the head
- **WHEN** a consuming project renders a page whose head is `BaseHead` and imports no stylesheet itself
- **THEN** the library's reset applies and `--nf-` tokens and palette values resolve on that page

#### Scenario: Consumer CSS still wins
- **WHEN** that consumer writes an unlayered rule of its own for an element on the page
- **THEN** the rule applies over every library declaration, with no specificity contest introduced by `BaseHead`
