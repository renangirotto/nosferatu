# Spec Delta

## ADDED Requirements

### Requirement: Large container size

`generic.css` SHALL declare `--nf-container-large-size` on `:root` with the value `1088px`, beside `--nf-container-small-size`, as a general-purpose container width for page-level content. Like every value in `generic.css`, it SHALL reach the cascade in `nosferatu.tokens` when loaded through `index.css`, and SHALL be unlayered when `generic.css` is imported directly.

#### Scenario: Both container sizes are defined

- **WHEN** a consumer imports only `astro-nosferatu/styles/generic.css`
- **THEN** `--nf-container-small-size` computes to `856px` and `--nf-container-large-size` computes to `1088px` on `:root`

#### Scenario: The large size is overridable

- **WHEN** a consumer imports `index.css` and sets `--nf-container-large-size: 1200px` on `:root` in unlayered CSS, loaded before or after `index.css`
- **THEN** the consumer's value applies, and every `Container` that has no width of its own caps at `1200px`

### Requirement: Container content API

The library SHALL publish a `Container` component at `astro-nosferatu/components/Container.astro` that renders a single `div` carrying the class `nf-container` and renders its children through its default slot. It SHALL accept every native `div` attribute and forward it to that element, and SHALL merge a consumer `class` with `nf-container` rather than replacing it. It SHALL take no props of its own.

#### Scenario: Children render inside the container

- **WHEN** a consumer renders `<Container><p>Hello</p></Container>`
- **THEN** the output is a `div.nf-container` whose only child is that paragraph

#### Scenario: Native attributes and class pass through

- **WHEN** a consumer renders `<Container id="main-content" class="page" aria-label="Content">`
- **THEN** the `div` carries `id="main-content"`, `aria-label="Content"` and both the `nf-container` and `page` classes

### Requirement: Container appearance

A `Container` SHALL centre itself horizontally within its parent, fill the parent's available inline size, and cap that inline size at `--nf-container-max-inline-size` when it is set on the container or on any ancestor, falling back to `--nf-container-large-size` otherwise. The component SHALL NOT declare `--nf-container-max-inline-size` itself, so a value set on an ancestor reaches it. It SHALL style no other property — no padding, margin-block, color or font.

#### Scenario: Capped and centred on a wide viewport

- **WHEN** a page renders a `Container` as a child of `body` in a `1440px`-wide window, with `index.css` imported
- **THEN** the container's rendered width is `1088px` and the space either side of it is equal

#### Scenario: Fills a narrow viewport

- **WHEN** the same page is viewed in a `600px`-wide window
- **THEN** the container is as wide as its parent, with no horizontal scroll caused by it

#### Scenario: Width set on the instance

- **WHEN** a consumer renders `<Container style="--nf-container-max-inline-size: 640px">`
- **THEN** that container caps at `640px` and other containers on the page are unchanged

#### Scenario: Width set from an ancestor

- **WHEN** a consumer sets `--nf-container-max-inline-size: var(--nf-container-small-size)` in an unlayered rule on an element wrapping a `Container`
- **THEN** that container caps at `856px`

#### Scenario: Nothing else is styled

- **WHEN** a `Container` is inspected in devtools
- **THEN** its only library-authored declarations are its inline margin, inline size and maximum inline size, and a plain `div` next to it is unaffected
