# Spec Delta

## ADDED Requirements

### Requirement: BlogArticle centres the article at a capped measure

`BlogArticle` SHALL centre its `article` element horizontally within `main`, let it fill the available inline size, and cap that inline size at `--nf-layout-blog-article-max-inline-size` when a consumer sets it, falling back to `--nf-container-small-size` (`856px` by default) otherwise. The layout SHALL NOT declare `--nf-layout-blog-article-max-inline-size` itself, so a consumer may set it on `.nf-layout-blog-article`, on the article or on any ancestor, `:root` included. Apart from this measure and the font family and weight it sets on its prose and code, the layout SHALL style no other property — no font size, spacing, padding or color.

#### Scenario: The article is capped and centred on a wide viewport

- **WHEN** a reader opens a `BlogArticle` page in a `1440px`-wide window and inspects the `article`
- **THEN** its rendered width is `856px` and the space either side of it inside `main` is equal

#### Scenario: The article fills a narrow viewport

- **WHEN** the same page is viewed in a `600px`-wide window
- **THEN** the `article` is as wide as `main`, with no horizontal scroll caused by the layout

#### Scenario: One article re-tuned

- **WHEN** a consumer sets `--nf-layout-blog-article-max-inline-size: 640px` in an unlayered rule on `.nf-layout-blog-article`
- **THEN** that article's width caps at `640px`, and `--nf-container-small-size` is unchanged for everything else

#### Scenario: The shared container size moves the article

- **WHEN** a consumer sets `--nf-container-small-size: 720px` on `:root` in unlayered CSS and does not set the layout's own property
- **THEN** the article's width caps at `720px`

#### Scenario: Text size comes from the global scale

- **WHEN** a `BlogArticle` page renders an `h1` inside the article and another `h1` outside `main.nf-layout-blog-article`, at any viewport width
- **THEN** both have the same computed font size, because the layout sets no font size and both take it from the library's typography stylesheet

## MODIFIED Requirements

### Requirement: BlogArticle renders a titled, described article document

The library SHALL publish a `BlogArticle` layout that takes a required `title` string, a required `description` string, an optional `lang` string defaulting to `en`, and an optional `imageSocialMedia` string, and renders a complete HTML document. Within the document body it SHALL render a `main` element carrying the class `nf-layout-blog-article`, containing an `article` element carrying the class `nf-layout-blog-article-content`, which contains — in order — an `h1` holding the `title`, a `p` holding the `description`, and then the layout's default slot. The `h1` and the `p` SHALL carry no class authored by the library; the scoping class or attribute Astro generates for a component that declares a `<style>` block is outside the library's control and SHALL NOT count as one. The `lang` value SHALL become the `lang` attribute of the `<html>` element. The document head SHALL be the full metadata set the library's `BaseHead` renders, with `title` as the document title, `description` as the page's description metadata, and `imageSocialMedia`, when supplied, as the social-media image. The layout SHALL render no other content around them.

#### Scenario: The article structure is rendered

- **WHEN** a reader opens a page built from `BlogArticle` with a title, a description and slot content, and inspects the document
- **THEN** the body contains `main.nf-layout-blog-article` > `article.nf-layout-blog-article-content`, whose children in document order are an `h1` with the title text, a `p` with the description text, and the content passed into the layout
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

A layout MAY declare visual styles, under the same constraints a component obeys: the styles SHALL live in the layout's own scoped `<style>` block, and every design value SHALL be reachable through a `--nf-*` custom property. A layout's selectors SHALL be rooted at the layout's own hook class, so that they reach the layout's own markup and the content placed inside it — a layout renders the document a page's content lives in, and the article it is given is as much its subtree as the heading it renders itself — and SHALL NOT match anything outside that root. A layout's custom properties SHALL be named `--nf-layout-<layout name>-<role>`, spelling the layout's full name, so that they cannot collide with a consumer's properties or with a library token. A layout SHALL NOT raise specificity to defend its own declarations: a consumer's unlayered rule targeting the layout's hook or the elements inside it SHALL win.

#### Scenario: Styles stay inside the layout

- **WHEN** a page built from a layout renders its own `main`, `article`, `h1` and `p` elements outside the layout's hook, for example in a second `main` the page adds after the layout's content
- **THEN** only the elements inside the layout's root carry its styling

#### Scenario: Content inside the layout is styled

- **WHEN** a consumer passes headings, paragraphs and code into a layout's default slot
- **THEN** they are styled by the layout's rules exactly as the elements the layout renders itself, because the slot content sits inside the layout's root

#### Scenario: A consumer's unlayered rule wins

- **WHEN** a consumer writes an unlayered rule setting `font-family` on `.nf-layout-blog-article p` in its own stylesheet
- **THEN** the consumer's value applies, with no specificity contest from the layout

#### Scenario: Properties spell the layout out

- **WHEN** the custom properties a layout defines are inspected
- **THEN** every one of them is named `--nf-layout-<layout name>-<role>`, and none uses a generic name such as `--nf-h1`, `--nf-fs-base` or `--nf-max-width`

## REMOVED Requirements

### Requirement: BlogArticle sizes its text from a fluid type scale

**Reason**: It duplicated the fluid scale `typography.css` already applies to `h1`–`h3` and `p`, and since `BaseHead` loads `index.css` on every layout page both scales ran at once and disagreed on sizes.

**Migration**: Remove any override of `--nf-layout-blog-article-viewport-min`, `-viewport-max`, `-viewport-progress`, `-font-size-base`, `-type-scale-min`, `-type-scale-max`, `-type-scale`, `-font-size-h1`, `-font-size-h2`, `-font-size-h3`, `-font-size-h4` or `-font-size-p`; they no longer have an effect. Re-tune the article's text through the global `--nf-typography-*` properties, or with an unlayered rule scoped to `.nf-layout-blog-article` (for example `.nf-layout-blog-article h4 { font-size: 1.5rem; }`) when the article should differ from the rest of the page.
