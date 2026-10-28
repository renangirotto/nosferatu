# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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

### Requirement: Layouts are documented
The documentation site SHALL document each layout the library publishes on its own page, reachable from the sidebar under a layouts group. Because a layout renders a whole document and therefore cannot be embedded inside a documentation page, the page SHALL instead show the layout's import line, a copyable usage example, the exact markup the layout produces, a props table giving each prop's type, whether it is required and its default, and a description of each slot. The page SHALL link to a standalone example page on the docs site that is built with the layout, so a reader can see it rendered for real. Where a layout delegates its document skeleton or its head metadata to a published html file, the page SHALL say so and link to that file's page instead of repeating its metadata list.

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

#### Scenario: Unstyled state is stated
- **WHEN** a reader looks at the BlogArticle page's styling section
- **THEN** it states that the layout ships no styles of its own, names `.nf-layout-blog-article` as the hook to target, and shows how a consumer styles it from its own CSS

#### Scenario: The layout is reachable in the sidebar
- **WHEN** a reader browses the docs site's sidebar
- **THEN** a Layouts group lists the BlogArticle page, and following it opens that page
