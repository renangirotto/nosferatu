# Spec Delta

## MODIFIED Requirements

### Requirement: BlogArticle centres the article at a capped measure

`BlogArticle` SHALL wrap its `article` element in the library's `Container` component, so the article is centred horizontally within `main`, fills the available inline size, and is capped by the container. The layout SHALL set `--nf-container-max-inline-size` to `var(--nf-container-small-size)` on its `nf-layout-blog-article` root, so the article caps at `856px` by default rather than at the container's own `1088px` default. The layout SHALL NOT declare a width property of its own: a consumer re-tunes one article's width by setting `--nf-container-max-inline-size`, and every article's width by setting `--nf-container-small-size`. Apart from this measure and the font family and weight it sets on its prose and code, the layout SHALL style no other property — no font size, spacing, padding or color.

#### Scenario: The article is capped and centred on a wide viewport

- **WHEN** a reader opens a `BlogArticle` page in a `1440px`-wide window and inspects the `article`
- **THEN** its rendered width is `856px` and the space either side of it inside `main` is equal

#### Scenario: The article fills a narrow viewport

- **WHEN** the same page is viewed in a `600px`-wide window
- **THEN** the `article` is as wide as `main`, with no horizontal scroll caused by the layout

#### Scenario: One article re-tuned

- **WHEN** a consumer sets `--nf-container-max-inline-size: 640px` in an unlayered rule on the article's `.nf-container`
- **THEN** that article's width caps at `640px`, and `--nf-container-small-size` is unchanged for everything else

#### Scenario: The shared container size moves the article

- **WHEN** a consumer sets `--nf-container-small-size: 720px` on `:root` in unlayered CSS
- **THEN** the article's width caps at `720px`

#### Scenario: The old layout property has no effect

- **WHEN** a consumer sets `--nf-layout-blog-article-max-inline-size: 640px` on `.nf-layout-blog-article`
- **THEN** the article's width is unchanged, because the layout no longer reads that property

#### Scenario: Text size comes from the global scale

- **WHEN** a `BlogArticle` page renders an `h1` inside the article and another `h1` outside `main.nf-layout-blog-article`, at any viewport width
- **THEN** both have the same computed font size, because the layout sets no font size and both take it from the library's typography stylesheet

### Requirement: BlogArticle renders a titled, described article document

The library SHALL publish a `BlogArticle` layout that takes a required `title` string, a required `description` string, an optional `lang` string defaulting to `en`, and an optional `imageSocialMedia` string, and renders a complete HTML document. Within the document body it SHALL render a `main` element carrying the class `nf-layout-blog-article`, containing a `Container` (a `div` carrying the class `nf-container`), containing an `article` element carrying the class `nf-layout-blog-article-content`, which contains — in order — an `h1` holding the `title`, a `p` holding the `description`, and then the layout's default slot. The `h1` and the `p` SHALL carry no class authored by the library; the scoping class or attribute Astro generates for a component that declares a `<style>` block is outside the library's control and SHALL NOT count as one. The `lang` value SHALL become the `lang` attribute of the `<html>` element. The document head SHALL be the full metadata set the library's `BaseHead` renders, with `title` as the document title, `description` as the page's description metadata, and `imageSocialMedia`, when supplied, as the social-media image. The layout SHALL render no other content around them.

#### Scenario: The article structure is rendered

- **WHEN** a reader opens a page built from `BlogArticle` with a title, a description and slot content, and inspects the document
- **THEN** the body contains `main.nf-layout-blog-article` > `div.nf-container` > `article.nf-layout-blog-article-content`, whose children in document order are an `h1` with the title text, a `p` with the description text, and the content passed into the layout
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
