# Spec Delta

## MODIFIED Requirements

### Requirement: Stylesheets are documented
The documentation site's styles page SHALL list every stylesheet the library exports, including `shadows.css` and `typography.css`, with its import path and what it defines. Where a stylesheet applies rules to a consumer's own elements rather than only defining custom properties, the page SHALL say so plainly, name the cascade layer it occupies, list every custom property a consumer can override together with that property's default, and show how to load the rest of the library without it. The page SHALL NOT claim the library leaves all text to the consumer.

Because the documentation site is itself a consumer whose own cascade layers outrank the library's, a stylesheet whose effect the site's own CSS overrides SHALL be demonstrated on a standalone example page that loads the library's styles without the site's, rather than inline in the documentation page. The styles page SHALL link to that page, and SHALL state that the site's own layers are why the effect is not visible in the surrounding documentation.

#### Scenario: Shadows are listed
- **WHEN** a reader opens the styles page
- **THEN** they see `astro-nosferatu/styles/shadows.css`, the `--nf-shadow-<hue>-<d|l>-<step>` naming pattern, and an example of applying one

#### Scenario: Typography is listed
- **WHEN** a reader opens the styles page
- **THEN** they see `astro-nosferatu/styles/typography.css` in the stylesheet table, and the layer diagram shows `nosferatu.typography` as the last library layer

#### Scenario: The page says which elements are styled
- **WHEN** a reader looks at the styles page's typography section
- **THEN** it states that importing `index.css` sizes `h1`, `h2`, `h3` and `p` on their own page, and that `a` and `h4`–`h6` are left alone
- **AND** no sentence anywhere on the page still says the library styles no headings or paragraphs

#### Scenario: Every typography property is documented with its default
- **WHEN** a reader looks for the knobs on the type scale
- **THEN** the page lists `--nf-typography-viewport-min`, `--nf-typography-viewport-max`, `--nf-typography-viewport-progress`, and for each of `h1`, `h2`, `h3` and `p` its `-min`, `-max` and resolved property, each with the value the library ships

#### Scenario: Retuning the scale is shown as runnable code
- **WHEN** a reader looks at the typography section's theming example
- **THEN** it shows unlayered CSS overriding a `--nf-typography-*` property on `:root`, and explains that an unlayered override wins over the library's layer without extra specificity

#### Scenario: The scale is demonstrated on a standalone page
- **WHEN** a reader wants to see the type scale actually working
- **THEN** the styles page links to a standalone example page that loads `astro-nosferatu/styles/index.css` and no documentation-site CSS
- **AND** that page renders an `h1`, `h2`, `h3` and `p` sized by the scale, and reports the current viewport width together with each element's computed `font-size`, so resizing the window shows the sizes change

#### Scenario: The docs site's own layers are explained
- **WHEN** a reader notices that the headings of the documentation page itself are not sized by the scale
- **THEN** the styles page states that the documentation site declares its own cascade layers after importing the library, so the site's heading rules outrank `nosferatu.typography`
- **AND** it presents this as ordinary layer precedence rather than a defect, and as the reason the live demo lives on its own page

#### Scenario: The bounds are explained as real limits
- **WHEN** a reader looks at what `--nf-typography-viewport-min` and `--nf-typography-viewport-max` do
- **THEN** the page states that each element reaches its named minimum at the first width and its maximum at the second, and holds at that size outside the range
- **AND** it shows how to opt one element out of the scale entirely by setting its resolved `--nf-typography-font-size-*` property to a constant

#### Scenario: Opting out is documented
- **WHEN** a reader does not want the library sizing their text
- **THEN** the page shows importing `tokens.css`, `colors/index.css`, `shadows.css` and `reset.css` individually in place of `index.css`, and notes that files imported on their own are not layered

#### Scenario: The browser-support caveat is stated
- **WHEN** a reader looks at the typography section
- **THEN** it states that the scale relies on the CSS `progress()` function, that browsers without it fall back to their own heading and paragraph sizes, and that the scale is therefore progressive enhancement rather than a guaranteed appearance
