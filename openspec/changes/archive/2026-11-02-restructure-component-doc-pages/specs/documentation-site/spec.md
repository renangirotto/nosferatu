# Spec Delta

## ADDED Requirements

### Requirement: Component pages follow one structure

Every page documenting a component the library publishes under `astro-nosferatu/components/` SHALL present, in this order: the component name as the page title; a short description; a short paragraph stating that the component is built for both light and dark color schemes, followed by the dark/light switch; a `Usage` section; a `Color variants` section; a `States` section; an `Icons` section; a `Props` section; and a `CSS Variables` section containing a `Theming` subsection. `Color variants`, `States` and `Icons` SHALL appear only when the component has, respectively, a `color` prop, states a reader can trigger or set (such as disabled or open), and a prop that takes an icon; no page SHALL carry a section saying a feature is absent. No component page SHALL carry a scoped-styles, content, slots, light-and-dark or animation section.

- `Usage` SHALL show the import line and a usage example in one code block, followed by the live component that code produces.
- `Color variants` SHALL show a code block, then a live render of the component for every value of `color`, with no captions or other text inside the render.
- `Props` SHALL be a table with exactly the columns Prop, Type, Required and Default — no description column — with a default given for optional props that have one. When the component forwards a native element's attributes, the table SHALL be followed by a line naming that element; a slot the component renders SHALL be named in the same place.
- `States` SHALL give each state its own heading one level below `States` (a third-level heading named for the state, such as `Disabled` or `Open`), followed by that state's live demo and code, so every state appears in the page's table of contents.
- `CSS Variables` SHALL list every `--nf-<component>-*` custom property a consumer can override, each with a one-line description of what it affects. `Theming` SHALL show one live customization through those properties with the exact code that produces it.

Every code block on a component page SHALL be titled with only the file extension of its language (`.astro`, `.css`) and SHALL render in the terminal frame. Prose SHALL be short and direct: a page SHALL NOT explain how the component's animation works, how its base styles are built or loaded, or how its `data-ui-*` attributes drive styling.

#### Scenario: Sections appear in order

- **WHEN** a reader opens the Button, Callout or Accordion page
- **THEN** the second-level headings read, in order, `Usage`, then whichever of `Color variants`, `States` and `Icons` apply, then `Props`, then `CSS Variables`, and `Theming` is a heading inside `CSS Variables`

#### Scenario: Optional sections are omitted, not stubbed

- **WHEN** a reader opens the Callout page
- **THEN** there is no `States` section, because the callout has no states

#### Scenario: Each state has its own heading

- **WHEN** a reader opens the Button or Accordion page
- **THEN** each state under `States` has its own third-level heading, and each of those headings is listed under `States` in the "On this page" table of contents

#### Scenario: Usage is one code block

- **WHEN** a reader looks at a component page's `Usage` section
- **THEN** a single code block holds both the `import` from `astro-nosferatu/components/<Name>.astro` and the component markup, and the rendered component appears directly below it

#### Scenario: Color render is bare

- **WHEN** a reader looks at the `Color variants` render
- **THEN** it shows one instance per hue and no caption, label or paragraph between them

#### Scenario: Props table has four columns

- **WHEN** a reader looks at a component page's props table
- **THEN** its header is Prop, Type, Required, Default, and the native element the component extends is named in the line after it

#### Scenario: Code blocks carry only the extension

- **WHEN** a reader looks at any code block on a component page
- **THEN** it is drawn in the terminal frame with a title of `.astro` or `.css` and nothing else

#### Scenario: Dropped sections are gone

- **WHEN** a reader scans the Button, Callout and Accordion pages
- **THEN** none has a `Scoped styles`, `Content`, `Slots`, `Light and dark`, `Animation` or `Disclosure state` heading

### Requirement: Component pages offer a light/dark switch

Every component page SHALL render, right after its light-and-dark paragraph, a button that switches the documentation site to the opposite color scheme: from dark to light when the site is dark, and from light to dark when it is light. Switching SHALL change the whole site's theme exactly as Starlight's own theme picker would — the library components on the page follow it through `color-scheme` — and SHALL leave Starlight's picker showing the new choice and the choice remembered on the next page load. The switch is part of the private docs site and SHALL NOT be published by the library.

#### Scenario: Dark to light

- **WHEN** the site is in its dark theme and a reader activates the switch on a component page
- **THEN** the site turns light, the demos on the page render their light-scheme colors, and Starlight's theme picker shows `Light`

#### Scenario: Light to dark

- **WHEN** the site is in its light theme and a reader activates the switch
- **THEN** the site turns dark and the demos render their dark-scheme colors

#### Scenario: Choice persists

- **WHEN** a reader switches the theme and then reloads or opens another page
- **THEN** the site stays in the theme they switched to

#### Scenario: Keyboard operable

- **WHEN** a reader tabs to the switch and presses Enter or Space
- **THEN** the theme flips, as it does on click

#### Scenario: Not published

- **WHEN** `pnpm pack:check` lists the library tarball
- **THEN** it contains no theme-switch component

## MODIFIED Requirements

### Requirement: Docs live demos

The documentation site SHALL render each documented component live on its page, alongside an example of how to import it. A component page SHALL show a live example of every value of each enumerated prop the component accepts, document each prop — enumerated or not — with its type, whether it is required, and its default, name every slot it renders, and state how the component can be re-themed.

#### Scenario: Button page

- **WHEN** a reader opens the Button page of the docs site
- **THEN** they see a rendered `Button` and the import line `import Button from 'astro-nosferatu/components/Button.astro'`

#### Scenario: Every color is shown

- **WHEN** a reader opens the Button page
- **THEN** they see a live `Button` for each of `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`

#### Scenario: Interaction states are demonstrable

- **WHEN** a reader hovers and presses a `Button` in a demo on its page, and looks at the `States` section
- **THEN** the button visibly sinks and flattens, and the `States` section shows a live disabled button with its code under a `Disabled` heading

#### Scenario: Theming is documented with runnable code

- **WHEN** a reader looks at the Button page's theming section
- **THEN** it shows a live demo of overriding the component's color custom properties together with the exact code that produces it

#### Scenario: Slots are documented

- **WHEN** a reader opens the page of a component that renders slots, such as `Callout`
- **THEN** the line after the props table names each slot and says what it holds

### Requirement: Callout page

The documentation site SHALL document `Callout` on its own page, rendering it live for every value of its `color` prop. The page SHALL list `title` as required, SHALL document the `icon` prop and name the body slot, and SHALL list the `--nf-callout-*` custom properties a consumer can override with a live theming demo. Because `icon` accepts any component, the page SHALL show live callouts with an icon component and without one, and state that the library ships no icon set.

#### Scenario: Callout page renders the component

- **WHEN** a reader opens the Callout page
- **THEN** they see a rendered `Callout` and the import line `import Callout from 'astro-nosferatu/components/Callout.astro'`

#### Scenario: Every color is shown

- **WHEN** a reader opens the Callout page
- **THEN** they see a live `Callout` for each of `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`

#### Scenario: The icon prop is shown taking different components

- **WHEN** a reader opens the Callout page's `Icons` section
- **THEN** they see live callouts using two different imported icon components and one with no icon, each with the code that produces it, and the page states that the library ships no icon set and that the prop takes a component

#### Scenario: The optional body is demonstrated

- **WHEN** a reader scans the Callout page's demos
- **THEN** at least one live callout has a body and at least one has only a title, without a dedicated content section

#### Scenario: Theming is documented with runnable code

- **WHEN** a reader looks at the Callout page's theming section
- **THEN** it shows a live demo of overriding the component's custom properties together with the exact code that produces it

### Requirement: Accordion page

The documentation site SHALL document `Accordion` on its own page, rendering it live for every value of its `color` prop. The page SHALL list `summary` as required, SHALL name the default slot as the disclosed content, and SHALL state that the component is built on the native `<details>` element. Its `States` section SHALL show live, each under its own heading and with its code, an accordion rendered with the native `open` attribute and a group of accordions sharing a native `name` so that opening one closes the others. Its `Icons` section SHALL show the default plus/minus icons live, state that the library supplies them, and show one accordion whose icons are replaced through `iconCollapsed` and `iconExpanded`, with its code. The page SHALL list the `--nf-accordion-*` custom properties a consumer can override, `--nf-accordion-icon-size` and `--nf-accordion-rule-color` included, together with a live theming demo and its exact code.

#### Scenario: Accordion page renders the component

- **WHEN** a reader opens the Accordion page
- **THEN** they see a rendered `Accordion` and the import line `import Accordion from 'astro-nosferatu/components/Accordion.astro'`

#### Scenario: Every color is shown

- **WHEN** a reader opens the Accordion page
- **THEN** they see a live `Accordion` for each of `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` and `yellow`

#### Scenario: The icons are demonstrable

- **WHEN** a reader looks at the Accordion page's `Icons` section and opens its demos
- **THEN** they see the default plus turning into a minus and an accordion using two components of its own, each with the code that produces it

#### Scenario: The animation is demonstrable

- **WHEN** a reader clicks the summary of a demo on the Accordion page
- **THEN** the panel opens and closes live, and the page does not explain how the animation is implemented

#### Scenario: Interaction states are documented

- **WHEN** a reader hovers, presses, tabs to and opens an `Accordion` in a demo
- **THEN** the summary reacts live as the component's styles define, and the `States` section names the states it demonstrates in at most a sentence each

#### Scenario: Native attributes are demonstrated

- **WHEN** a reader looks at the Accordion page's `States` section
- **THEN** they see a live accordion rendered with `open`, and a live group of accordions sharing the same `name` where opening one closes the previously open one, with the code for each

#### Scenario: Theming is documented with runnable code

- **WHEN** a reader looks at the Accordion page's theming section
- **THEN** it shows a live demo overriding `--nf-accordion-*` properties together with the exact code that produces it

#### Scenario: The slot is documented

- **WHEN** a reader looks at the Accordion page's props table
- **THEN** `summary` is listed as a required `string`, `color` as an optional palette hue whose default is grey (unset), `iconCollapsed` and `iconExpanded` as optional components, and the line after the table names `<details>` as the element whose attributes pass through and the default slot as the disclosed content

### Requirement: Color-variant pages document the unset default

On the page of every component that accepts a `color` prop, the documentation site SHALL list the prop's default in the props table as grey (unset) rather than as a hue the component writes into its markup, and the `Color variants` render SHALL begin with an instance rendered with no `color`.

#### Scenario: Default stated in prose and table

- **WHEN** a reader opens the Button, Callout or Accordion page
- **THEN** the props table gives the `color` default as grey (unset), the `Color variants` section says in one sentence that leaving `color` out renders grey, and no page says the default is `purple`

#### Scenario: Default shown live

- **WHEN** a reader looks at the `Color variants` render of one of those pages
- **THEN** its first instance is rendered with no `color`, and the code block shows that instance without a `color` attribute
