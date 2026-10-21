# library-styles Specification

## Purpose

Defines the global stylesheets the library exports, how their tokens are named, how they sit in the cascade relative to consumer CSS, and how components consume them.

## Requirements

### Requirement: Exported stylesheets
The library SHALL export the stylesheets `tokens.css`, `colors.css`, `reset.css`, `base.css`, `typography.css` and `index.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of the others.

#### Scenario: Import everything
- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens, colors, reset, base and typography styles are all applied

#### Scenario: Import tokens only
- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the non-color `--nf-*` custom properties (spacing, fonts, radius) are defined, no color custom properties are defined, and no element selectors from reset, base or typography are applied

#### Scenario: Import colors only
- **WHEN** a consumer imports only `astro-nosferatu/styles/colors.css`
- **THEN** the `--nf-*` palette custom properties are defined and no element selectors are applied

### Requirement: Token naming
Every CSS custom property defined by the library SHALL use the `--nf-` prefix.

#### Scenario: No unprefixed custom properties
- **WHEN** the library's stylesheets and component styles are searched for custom property declarations
- **THEN** every declared custom property name starts with `--nf-`

### Requirement: Cascade layer order
When loaded through `index.css`, the tokens, colors, reset, base and typography styles SHALL be placed in the cascade layers `nosferatu.tokens`, `nosferatu.colors`, `nosferatu.reset`, `nosferatu.base` and `nosferatu.typography`, declared in that order, so later layers win over earlier ones and any unlayered consumer CSS wins over all of them.

#### Scenario: Typography overrides base
- **WHEN** both `nosferatu.base` and `nosferatu.typography` style the same element property
- **THEN** the `nosferatu.typography` value applies

#### Scenario: Consumer CSS wins without extra specificity
- **WHEN** a consumer writes an unlayered rule `h1 { color: red; }` after importing `index.css`
- **THEN** `h1` elements are red, regardless of the library's typography rules

#### Scenario: Consumer token override wins regardless of order
- **WHEN** a consumer sets `--nf-red-l-80` on `:root` in unlayered CSS loaded before `index.css`
- **THEN** the consumer's value applies

### Requirement: Components are self-styled through tokens
Each component SHALL carry its own scoped styles, and those styles SHALL reference design values only through `--nf-*` custom properties. Components SHALL NOT style elements outside their own markup.

#### Scenario: Re-theme by overriding a token
- **WHEN** a consumer imports `colors.css` and sets the palette token a `Button` uses for its primary background (for example `--nf-red-l-80`) to a different value on `:root`
- **THEN** a rendered `Button` uses the new value

#### Scenario: No style leakage
- **WHEN** a page renders a `Button` next to a plain `<button>` element
- **THEN** the plain `<button>` is not affected by the component's styles

### Requirement: Color palette
`colors.css` SHALL define, on `:root`, exactly the palette from the Harmonizer export `harmonized-palette(2).css`: the hues `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`, each with a dark scale (`-d-`) and a light scale (`-l-`) of steps `10` to `100` in tens, with the export's OKLCH values unchanged. Each token SHALL be named `--nf-<hue>-<d|l>-<step>`. Tokens SHALL be ordered by hue name alphabetically, then dark scale before light scale, then by ascending step. `-d-` tokens are the dark-mode scale and `-l-` tokens the light-mode scale.

#### Scenario: Palette is complete and prefixed
- **WHEN** the custom properties declared in `colors.css` are listed
- **THEN** there are 160 of them (8 hues × 2 scales × 10 steps), every name matches `--nf-<hue>-<d|l>-<step>`, and each value equals the export's value for the same unprefixed name

#### Scenario: Alphabetical order
- **WHEN** the declarations in `colors.css` are read top to bottom
- **THEN** they appear as `blue-d-10 … blue-d-100, blue-l-10 … blue-l-100, cyan-d-10 …` through `yellow-l-100`

### Requirement: No semantic color tokens
The library SHALL NOT define semantic color custom properties (such as `--nf-color-primary` or `--nf-color-text`). Library stylesheets and components SHALL reference colors only through the palette tokens defined in `colors.css`.

#### Scenario: No --nf-color-* tokens
- **WHEN** the library's stylesheets and component styles are searched for `--nf-color-`
- **THEN** there are no declarations or references

#### Scenario: Every color reference resolves
- **WHEN** every `var(--nf-…)` used for a color in the library's stylesheets and components is checked against `colors.css`
- **THEN** each referenced token is defined there

### Requirement: Reset defaults
`reset.css` SHALL apply: border-box sizing on all elements and pseudo-elements; zero default margin; `interpolate-size: allow-keywords` on `html` when the user has no reduced-motion preference; a `body` with `min-height: 100dvh`, an inline-size container named `body-container`, line-height `1.5` and antialiased font smoothing; block, max-width-100% media; inherited fonts on form controls; `overflow-wrap: break-word` on paragraphs and headings; `text-wrap: pretty` on paragraphs and blockquotes; `text-wrap: balance` on headings; and an isolated stacking context on `#root`.

#### Scenario: Body fills the dynamic viewport
- **WHEN** a page loads `index.css` and has little content
- **THEN** the `body` computed `min-height` is `100dvh`, not overridden by `base.css`

#### Scenario: Body is a container
- **WHEN** a consumer writes `@container body-container (min-width: 40rem) { … }`
- **THEN** the rule applies based on the body's inline size

#### Scenario: Reduced motion skips keyword interpolation
- **WHEN** the user has `prefers-reduced-motion: reduce`
- **THEN** `html` does not get `interpolate-size: allow-keywords`
