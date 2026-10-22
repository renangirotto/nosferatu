# Spec Delta

## ADDED Requirements

### Requirement: Callout page
The documentation site SHALL document `Callout` on its own page, rendering it live for every value of its `color` prop, with and without a body, and with and without icon-slot content. The page SHALL state that `title` is required and is not rendered as a tooltip or a heading, SHALL document the `icon` prop and the body slot, SHALL show the `--nf-callout-*` custom properties a consumer can override with a live theming demo, and SHALL state that the component's drop shadow comes from `shadows.css`. Because `icon` accepts any component, the page SHALL demonstrate more than one kind of icon component and state that the library ships none.

#### Scenario: Callout page renders the component
- **WHEN** a reader opens the Callout page
- **THEN** they see a rendered `Callout` and the import line `import Callout from 'astro-nosferatu/components/Callout.astro'`

#### Scenario: Every color is shown
- **WHEN** a reader opens the Callout page
- **THEN** they see a live `Callout` for each of `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`, each labelled with the value that produces it

#### Scenario: The icon prop is shown taking different components
- **WHEN** a reader opens the Callout page's icon section
- **THEN** they see live callouts whose `icon` is an imported SVG component and one that is a component rendering a text character, and a callout with no icon at all, each with the code that produces it
- **AND** the page states that the library ships no icon set, that the demos' icons come from a package the documentation site installs for itself, and that the prop takes a component rather than an element or a name

#### Scenario: The optional body is demonstrated
- **WHEN** a reader looks at the Callout page's content section
- **THEN** a callout with a body and a callout without one are shown side by side, with the code for each, so the difference in the separator rule and the spacing is visible

#### Scenario: Theming is documented with runnable code
- **WHEN** a reader looks at the Callout page's theming section
- **THEN** it shows a live demo of overriding the component's custom properties together with the exact code that produces it

### Requirement: Stylesheets are documented
The documentation site's styles page SHALL list every stylesheet the library exports, including `shadows.css`, with its import path and what it defines.

#### Scenario: Shadows are listed
- **WHEN** a reader opens the styles page
- **THEN** they see `astro-nosferatu/styles/shadows.css`, the `--nf-shadow-<hue>-<d|l>-<step>` naming pattern, and an example of applying one

## MODIFIED Requirements

### Requirement: Docs live demos
The documentation site SHALL render each documented component live on its page, alongside an example of how to import it. A component page SHALL show a live example of every value of each enumerated prop the component accepts, document each prop — enumerated or not — with its type, whether it is required, and its default, document every slot it renders, and state how the component can be re-themed. Where a component's rendering depends on whether a slot was supplied, the page SHALL show both cases live.

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

#### Scenario: Slots are documented
- **WHEN** a reader opens the page of a component that renders slots, such as `Callout`
- **THEN** the page lists each slot by name, says whether it is optional, and states what the component does when it is omitted
