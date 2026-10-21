# Spec Delta

## MODIFIED Requirements

### Requirement: Docs live demos
The documentation site SHALL render each documented component live on its page, alongside an example of how to import it. A component page SHALL show a live example of every value of each enumerated prop the component accepts, document each prop with its type and default, and state how the component can be re-themed.

#### Scenario: Button page
- **WHEN** a reader opens the Button page of the docs site
- **THEN** they see a rendered `Button` and the import line `import Button from 'astro-nosferatu/components/Button.astro'`

#### Scenario: Every color is shown
- **WHEN** a reader opens the Button page
- **THEN** they see a live `Button` for each of `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`, each labelled with the value that produces it

#### Scenario: Interaction states are demonstrable
- **WHEN** a reader hovers and presses a `Button` in a demo on its page
- **THEN** the button visibly sinks and flattens, and the page explains the resting, hover and active behaviour in prose

#### Scenario: Theming is documented with runnable code
- **WHEN** a reader looks at the Button page's theming section
- **THEN** it shows a live demo of overriding the component's color custom properties together with the exact code that produces it
