# Spec Delta

## ADDED Requirements

### Requirement: Accordion page
The documentation site SHALL document `Accordion` on its own page, rendering it live for every value of its `color` prop. The page SHALL state that `summary` is required and is not rendered as a native attribute, SHALL document the default slot, and SHALL show live examples of a closed accordion, one rendered with the native `open` attribute, and a group of accordions sharing a native `name` so that opening one closes the others — each with the code that produces it. The page SHALL describe the summary's resting, hover, active, focus and `[open]` appearances in prose beside a demo the reader can actually operate, SHALL list the `--nf-accordion-*` custom properties a consumer can override together with a live theming demo and its exact code, and SHALL end with a demo placing the component beside a plain `<details>` element to show the component's styles do not leak. Because the open and close animation is progressive enhancement, the page SHALL state what the animation depends on, what a browser without that support does instead, and that reduced motion turns it off.

#### Scenario: Accordion page renders the component
- **WHEN** a reader opens the Accordion page
- **THEN** they see a rendered `Accordion` and the import line `import Accordion from 'astro-nosferatu/components/Accordion.astro'`

#### Scenario: Every color is shown
- **WHEN** a reader opens the Accordion page
- **THEN** they see a live `Accordion` for each of `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` and `yellow`, each labelled with the value that produces it

#### Scenario: The animation is demonstrable
- **WHEN** a reader clicks the summary of a demo on the page
- **THEN** the panel visibly grows open and shrinks closed, and the page explains in prose that the animation is CSS-only, that it depends on `::details-content` and CSS size interpolation, and that a browser without them opens the panel instantly instead

#### Scenario: Native attributes are demonstrated
- **WHEN** a reader looks at the page's section on disclosure state
- **THEN** they see a live accordion rendered with `open`, and a live group of accordions sharing the same `name` where opening one closes the previously open one, with the code for each and a note that both come from the native `<details>` element rather than from props

#### Scenario: Interaction states are documented
- **WHEN** a reader hovers, presses, tabs to and opens an `Accordion` in a demo
- **THEN** the summary visibly sinks, flattens, shows its inset focus outline and stays pressed while open, and the page describes each of those states in prose

#### Scenario: Theming is documented with runnable code
- **WHEN** a reader looks at the Accordion page's theming section
- **THEN** it shows a live demo overriding `--nf-accordion-color` and `--nf-accordion-accent-color` on the component element itself, and one overriding a palette token, together with the exact code that produces each
- **AND** it states that the two properties must be set on the element rather than on an ancestor, because the component's own `data-ui-color` rule declares them on the element and an inherited value cannot win against that

#### Scenario: The slot is documented
- **WHEN** a reader looks at the Accordion page's props and slots tables
- **THEN** `summary` is listed as a required `string` that is not forwarded as an attribute, `color` as an optional palette hue defaulting to `purple`, the default slot is described as the disclosed content, and the page states that all other native `<details>` attributes pass through
