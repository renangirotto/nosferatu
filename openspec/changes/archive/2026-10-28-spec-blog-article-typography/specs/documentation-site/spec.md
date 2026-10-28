# Spec Delta

## ADDED Requirements

### Requirement: Layout pages document markup, props, slots and styling
The documentation site SHALL document each layout the library publishes on its own page, reachable from the sidebar under a layouts group. Because a layout renders a whole document and therefore cannot be embedded inside a documentation page, the page SHALL instead show the layout's import line, a copyable usage example, the exact markup the layout produces, a props table giving each prop's type, whether it is required and its default, and a description of each slot. The page SHALL link to a standalone example page on the docs site that is built with the layout, so a reader can see it rendered for real. Where a layout delegates its document skeleton or its head metadata to a published html file, the page SHALL say so and link to that file's page instead of repeating its metadata list. The page SHALL state accurately what the layout styles and what it leaves to the consumer, and where the layout ships styles it SHALL list every custom property a consumer can override, with that property's default, together with runnable code for overriding them and for overriding the layout from unlayered CSS.

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

#### Scenario: The styling section describes what the layout really does
- **WHEN** a reader looks at the BlogArticle page's styling section
- **THEN** it states that the layout sizes its headings and paragraphs from a fluid type scale and styles nothing else, names `.nf-layout-blog-article` as the hook to target, and shows how a consumer styles it from its own unlayered CSS
- **AND** it does not claim that the layout ships no styles

#### Scenario: The theming properties are listed
- **WHEN** a reader looks for how to re-tune the BlogArticle type scale
- **THEN** the page lists every `--nf-layout-blog-article-*` property with its default value and shows a runnable override example, so a reader never has to read the layout's source to discover them

#### Scenario: The layout is reachable in the sidebar
- **WHEN** a reader browses the docs site's sidebar
- **THEN** a Layouts group lists the BlogArticle page, and following it opens that page

## REMOVED Requirements

### Requirement: Layouts are documented
**Reason**: Replaced by "Layout pages document markup, props, slots and styling", which carries every scenario forward unchanged except the styling one. The old requirement's "Unstyled state is stated" scenario asserts that a layout page tells readers the layout ships no styles, which stopped being true of `BlogArticle`; a scenario cannot be dropped from a requirement in place, so the requirement is restated under a name that matches what it now covers.

**Migration**: None for consumers — this is a documentation requirement. The replacement requirement keeps the import line, usage example, rendered markup, props table, slots description, example-page link and html-composition scenarios verbatim, and replaces the unstyled claim with two scenarios covering what the layout styles and which `--nf-layout-<name>-*` properties a reader can override.
