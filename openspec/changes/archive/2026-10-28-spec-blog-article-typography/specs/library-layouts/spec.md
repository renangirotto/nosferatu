# Spec Delta

## ADDED Requirements

### Requirement: Layouts may ship scoped styles
A layout MAY declare visual styles, under the same constraints a component obeys: the styles SHALL live in the layout's own scoped `<style>` block, every design value SHALL be reachable through a `--nf-*` custom property, and no selector SHALL reach outside the markup the layout itself renders. A layout's custom properties SHALL be named `--nf-layout-<layout name>-<role>`, spelling the layout's full name, so that they cannot collide with a consumer's properties or with a library token. A layout SHALL NOT raise specificity to defend its own declarations: a consumer's unlayered rule targeting the layout's hook or the elements inside it SHALL win.

#### Scenario: Styles stay inside the layout
- **WHEN** a page renders a layout's document and the consumer's own `main`, `article`, `h1` and `p` elements appear elsewhere on a page built from the layout's default slot
- **THEN** only the elements the layout itself renders carry its styling, and the slot content is untouched by it

#### Scenario: A consumer's unlayered rule wins
- **WHEN** a consumer writes an unlayered rule setting `font-size` on `.nf-layout-blog-article h1` in its own stylesheet
- **THEN** the consumer's value applies, with no specificity contest from the layout

#### Scenario: Properties spell the layout out
- **WHEN** the custom properties a layout defines are inspected
- **THEN** every one of them is named `--nf-layout-<layout name>-<role>`, and none uses a generic name such as `--nf-h1`, `--nf-fs-base` or `--nf-fluid-vmax`

### Requirement: BlogArticle sizes its text from a fluid type scale
`BlogArticle` SHALL size the text it renders from a type scale that interpolates with the viewport width, declared on its `nf-layout-blog-article` hook. Between a lower viewport bound of `560px` and an upper bound of `1088px`, the layout SHALL interpolate a base font size from `1rem` to `1.125rem` and a type-scale ratio from `1.2` to `1.414`, clamping to the end values outside that range. It SHALL size `h1`, `h2`, `h3` and `h4` as the base size multiplied by that ratio raised to the power `3`, `2.5`, `2` and `1.5` respectively, and `p` at the base size. Every input SHALL be exposed as an overridable custom property named `--nf-layout-blog-article-*`, with the literal values above as their defaults, so a consumer re-tunes the scale by setting properties rather than by overriding each rule. The layout SHALL style no property other than `font-size` — no spacing, color, width or font family — and SHALL apply its sizing only to the elements it renders itself.

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
- **THEN** the only thing the layout contributes is the font sizes described above: colors, spacing, measure and font family are browser defaults

#### Scenario: Slot content keeps its own sizing
- **WHEN** a consumer passes a library component with its own font size, such as `Button` or `Callout`, into the layout's default slot
- **THEN** that component renders at its own size, unaffected by the layout's scale

#### Scenario: Browsers without the interpolation function stay readable
- **WHEN** a `BlogArticle` page is opened in a browser that does not support the CSS interpolation the fluid scale is built on
- **THEN** the headings and paragraphs render at the browser's own default sizes, in descending order, rather than collapsing to a single size or to zero

## REMOVED Requirements

### Requirement: Layouts carry no visual styling of their own yet
**Reason**: Contradicted by the shipped layout, which has declared a fluid-typography `<style>` block since it was built. The blanket ban is replaced by "Layouts may ship scoped styles", which keeps the part that mattered — a consumer's unlayered CSS always wins, and the layout never reaches outside its own markup — and by "BlogArticle sizes its text from a fluid type scale", which specifies what it actually does.

**Migration**: A consumer relying on the layout being unstyled now inherits font sizes for `h1`–`h4` and `p`. Setting `font-size` on those elements in unlayered CSS overrides the layout, as it did before; to keep the fluid behaviour but re-tune it, set the `--nf-layout-blog-article-*` properties instead.
