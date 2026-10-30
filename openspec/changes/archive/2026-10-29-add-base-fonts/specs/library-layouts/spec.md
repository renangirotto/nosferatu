# Spec Delta

## ADDED Requirements

### Requirement: BlogArticle sets prose in the article font and code in the code font
`BlogArticle` SHALL set the text it presents in the library's article font and the code it presents in the library's code font, reading both from the base font properties rather than naming a family itself. Plain text — `p`, `strong`, `span` and `a` — SHALL take `--nf-layout-blog-article-font-family`, which SHALL default to `var(--nf-font-family-blog-post)`, and `code` and `pre` SHALL take `--nf-layout-blog-article-font-family-code`, which SHALL default to `var(--nf-font-family-code-blog-post)`. Paragraphs SHALL take the weight `--nf-layout-blog-article-font-weight`, defaulting to `var(--nf-font-weight)` and therefore to `400`; `strong` SHALL NOT be given a weight by the layout, so emphasised text stays bolder than the prose around it.

Headings SHALL NOT be given a family by the layout: they inherit the page's general font, so an article reads as the library's general font for its structure and the article font for its prose. The layout's rules SHALL apply to the whole article subtree — the elements the layout renders itself and the markup passed into its default slot alike — because the body of an article is slot content, and SHALL NOT apply to anything outside the layout's `nf-layout-blog-article` root. The layout SHALL NOT load a font, and SHALL render unchanged apart from the family when no font is installed, because each property resolves to a stack ending in a system font.

#### Scenario: Prose, code and headings each get their font
- **WHEN** a reader opens a page built from `BlogArticle`, with the three Fontsource packages installed, and inspects a paragraph, a link inside it, a `code` element and an `h2`
- **THEN** the paragraph, the link and any `strong` or `span` render in Plus Jakarta Sans, the `code` element renders in Geist Mono, and the `h2` renders in Outfit

#### Scenario: Slot content gets the fonts too
- **WHEN** the paragraphs, links and code of an article are passed into the layout's default slot rather than rendered by the layout
- **THEN** they are set in the same fonts as the description paragraph the layout renders itself

#### Scenario: Emphasis survives the default weight
- **WHEN** a paragraph in an article contains a `<strong>`
- **THEN** the paragraph renders at weight `400` and the `strong` renders heavier than the text around it

#### Scenario: Fonts stay inside the article
- **WHEN** a page built from `BlogArticle` renders its own `p`, `a` or `code` outside `main.nf-layout-blog-article`
- **THEN** those elements are untouched by the layout's font rules

#### Scenario: Re-tuning the article's fonts
- **WHEN** a consumer sets `--nf-layout-blog-article-font-family` and `--nf-layout-blog-article-font-family-code` in an unlayered rule on `.nf-layout-blog-article`
- **THEN** that article's prose and code use the consumer's families, while the page's general font and every other article are unchanged

#### Scenario: Moving the whole page's article font
- **WHEN** a consumer sets `--nf-font-family-blog-post` on `:root` in unlayered CSS
- **THEN** every `BlogArticle` prose element follows it, because the layout's own property defaults to it

#### Scenario: No font installed
- **WHEN** a page built from `BlogArticle` is opened in a project that installed none of the font packages
- **THEN** prose renders in the system sans font, code in the system monospace font, and the page requests no font file

## MODIFIED Requirements

### Requirement: Layouts may ship scoped styles
A layout MAY declare visual styles, under the same constraints a component obeys: the styles SHALL live in the layout's own scoped `<style>` block, and every design value SHALL be reachable through a `--nf-*` custom property. A layout's selectors SHALL be rooted at the layout's own hook class, so that they reach the layout's own markup and the content placed inside it — a layout renders the document a page's content lives in, and the article it is given is as much its subtree as the heading it renders itself — and SHALL NOT match anything outside that root. A layout's custom properties SHALL be named `--nf-layout-<layout name>-<role>`, spelling the layout's full name, so that they cannot collide with a consumer's properties or with a library token. A layout SHALL NOT raise specificity to defend its own declarations: a consumer's unlayered rule targeting the layout's hook or the elements inside it SHALL win.

#### Scenario: Styles stay inside the layout
- **WHEN** a page built from a layout renders its own `main`, `article`, `h1` and `p` elements outside the layout's hook, for example in a second `main` the page adds after the layout's content
- **THEN** only the elements inside the layout's root carry its styling

#### Scenario: Content inside the layout is styled
- **WHEN** a consumer passes headings, paragraphs and code into a layout's default slot
- **THEN** they are styled by the layout's rules exactly as the elements the layout renders itself, because the slot content sits inside the layout's root

#### Scenario: A consumer's unlayered rule wins
- **WHEN** a consumer writes an unlayered rule setting `font-size` on `.nf-layout-blog-article h1` in its own stylesheet
- **THEN** the consumer's value applies, with no specificity contest from the layout

#### Scenario: Properties spell the layout out
- **WHEN** the custom properties a layout defines are inspected
- **THEN** every one of them is named `--nf-layout-<layout name>-<role>`, and none uses a generic name such as `--nf-h1`, `--nf-fs-base` or `--nf-fluid-vmax`

### Requirement: BlogArticle sizes its text from a fluid type scale
`BlogArticle` SHALL size the text it renders from a type scale that interpolates with the viewport width, declared on its `nf-layout-blog-article` hook. Between a lower viewport bound of `560px` and an upper bound of `1088px`, the layout SHALL interpolate a base font size from `1rem` to `1.125rem` and a type-scale ratio from `1.2` to `1.414`, clamping to the end values outside that range. It SHALL size `h1`, `h2`, `h3` and `h4` as the base size multiplied by that ratio raised to the power `3`, `2.5`, `2` and `1.5` respectively, and `p` at the base size. Every input SHALL be exposed as an overridable custom property named `--nf-layout-blog-article-*`, with the literal values above as their defaults, so a consumer re-tunes the scale by setting properties rather than by overriding each rule. Apart from the font family and weight it sets on its prose and code, the layout SHALL style no other property — no spacing, color or width.

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
- **THEN** the only things the layout contributes are the font sizes described above and the prose and code font families, each resolving to a system stack because no library stylesheet defined the base font properties; colors, spacing and measure are browser defaults

#### Scenario: Slot content keeps its own sizing
- **WHEN** a consumer passes a library component with its own font size, such as `Button` or `Callout`, into the layout's default slot
- **THEN** that component renders at its own size, unaffected by the layout's scale

#### Scenario: Browsers without the interpolation function stay readable
- **WHEN** a `BlogArticle` page is opened in a browser that does not support the CSS interpolation the fluid scale is built on
- **THEN** the headings and paragraphs render at the browser's own default sizes, in descending order, rather than collapsing to a single size or to zero
