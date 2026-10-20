# Spec Delta

## Purpose

Defines the global stylesheets the library exports, how their tokens are named, how they sit in the cascade relative to consumer CSS, and how components consume them.

## ADDED Requirements

### Requirement: Exported stylesheets
The library SHALL export the stylesheets `tokens.css`, `reset.css`, `base.css`, `typography.css` and `index.css`. Each SHALL be importable on its own, and `index.css` SHALL include all of the others.

#### Scenario: Import everything
- **WHEN** a consumer imports `astro-nosferatu/styles/index.css`
- **THEN** the tokens, reset, base and typography styles are all applied

#### Scenario: Import tokens only
- **WHEN** a consumer imports only `astro-nosferatu/styles/tokens.css`
- **THEN** the `--nf-*` custom properties are defined and no element selectors from reset, base or typography are applied

### Requirement: Token naming
Every CSS custom property defined by the library SHALL use the `--nf-` prefix.

#### Scenario: No unprefixed custom properties
- **WHEN** the library's stylesheets and component styles are searched for custom property declarations
- **THEN** every declared custom property name starts with `--nf-`

### Requirement: Cascade layer order
When loaded through `index.css`, the reset, base and typography styles SHALL be placed in the cascade layers `nosferatu.reset`, `nosferatu.base` and `nosferatu.typography`, declared in that order, so later layers win over earlier ones and any unlayered consumer CSS wins over all of them.

#### Scenario: Typography overrides base
- **WHEN** both `nosferatu.base` and `nosferatu.typography` style the same element property
- **THEN** the `nosferatu.typography` value applies

#### Scenario: Consumer CSS wins without extra specificity
- **WHEN** a consumer writes an unlayered rule `h1 { color: red; }` after importing `index.css`
- **THEN** `h1` elements are red, regardless of the library's typography rules

### Requirement: Components are self-styled through tokens
Each component SHALL carry its own scoped styles, and those styles SHALL reference design values only through `--nf-*` custom properties. Components SHALL NOT style elements outside their own markup.

#### Scenario: Re-theme by overriding a token
- **WHEN** a consumer imports `tokens.css` and sets `--nf-color-primary` to a different value on `:root`
- **THEN** a rendered `Button` uses the new value

#### Scenario: No style leakage
- **WHEN** a page renders a `Button` next to a plain `<button>` element
- **THEN** the plain `<button>` is not affected by the component's styles
