# Spec Delta

## MODIFIED Requirements

### Requirement: Docs consume the library through its public exports
The documentation site SHALL import components, layouts and styles only through the library's package name and public import paths, never through relative paths into the library's source.

#### Scenario: Docs build exercises the exports
- **WHEN** a component is removed from the library's public exports and the docs site is built
- **THEN** the docs build fails on the unresolved import

#### Scenario: Layouts are exercised too
- **WHEN** the docs site is built
- **THEN** it imports every documented layout as `astro-nosferatu/layouts/<Name>.astro`, so a missing or misnamed layout export fails the build

## ADDED Requirements

### Requirement: Layouts are documented
The documentation site SHALL document each layout the library publishes on its own page, reachable from the sidebar under a layouts group. Because a layout renders a whole document and therefore cannot be embedded inside a documentation page, the page SHALL instead show the layout's import line, a copyable usage example, the exact markup the layout produces, a props table giving each prop's type, whether it is required and its default, and a description of each slot. The page SHALL link to a standalone example page on the docs site that is built with the layout, so a reader can see it rendered for real.

#### Scenario: BlogArticle page
- **WHEN** a reader opens the BlogArticle page of the docs site
- **THEN** they see the import line `import BlogArticle from 'astro-nosferatu/layouts/BlogArticle.astro'`, an example page using it, and the rendered markup showing `main.nf-layout-blog-article` > `article` > `h1` + `p` + slot content

#### Scenario: Props are documented
- **WHEN** a reader looks at the BlogArticle page's props table
- **THEN** it lists `title` and `description`, both `string` and both required, and states that `title` becomes the document title and the `h1`, and `description` becomes the page description metadata and the paragraph under the heading

#### Scenario: The layout is reachable in the sidebar
- **WHEN** a reader browses the docs site's sidebar
- **THEN** a Layouts group lists the BlogArticle page, and following it opens that page

#### Scenario: A real rendered example exists
- **WHEN** a reader follows the example link on the BlogArticle page
- **THEN** a standalone page of the docs site, built with the layout, opens and shows the heading, the description paragraph and the article body outside the Starlight documentation chrome

#### Scenario: Unstyled state is stated
- **WHEN** a reader looks at the BlogArticle page's styling section
- **THEN** it states that the layout ships no styles of its own, names `.nf-layout-blog-article` as the hook to target, and shows how a consumer styles it from its own CSS
