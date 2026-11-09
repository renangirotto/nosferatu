# Spec Delta

## MODIFIED Requirements

### Requirement: Component pages follow one structure

Every page documenting a component the library publishes under `astro-nosferatu/components/` SHALL present, in this order: the component name as the page title; a short description; a short paragraph stating that the component is built for both light and dark color schemes, followed by the dark/light switch; a `Usage` section; a `Color variants` section; a `States` section; an `Icons` section; a `Props` section; and a `CSS Variables` section containing a `Theming` subsection. `Color variants`, `States`, `Icons` and `Props` SHALL appear only when the component has, respectively, a `color` prop, states a reader can trigger or set (such as disabled or open), a prop that takes an icon, and at least one prop of its own — a native attribute whose default the component sets, such as `type` on `Button`, counts as one; no page SHALL carry a section saying a feature is absent. No component page SHALL carry a scoped-styles, content, slots, light-and-dark or animation section.

- `Usage` SHALL show the import line and a usage example in one code block, followed by the live component that code produces.
- `Color variants` SHALL show a code block, then a live render of the component for every value of `color`, with no captions or other text inside the render.
- `Props` SHALL be a table with exactly the columns Prop, Type, Required and Default — no description column — with a default given for optional props that have one. When the component forwards a native element's attributes, the table SHALL be followed by a line naming that element; a slot the component renders SHALL be named in the same place. A page with no `Props` section SHALL give that line at the end of `Usage` instead.
- `States` SHALL give each state its own heading one level below `States` (a third-level heading named for the state, such as `Disabled` or `Open`), followed by that state's live demo and code, so every state appears in the page's table of contents.
- `CSS Variables` SHALL list every `--nf-<component>-*` custom property a consumer can override, each with a one-line description of what it affects. `Theming` SHALL show one live customization through those properties with the exact code that produces it.

Every code block on a component page SHALL be titled with only the file extension of its language (`.astro`, `.css`) and SHALL render in the terminal frame. Prose SHALL be short and direct: a page SHALL NOT explain how the component's animation works, how its base styles are built or loaded, or how its `data-ui-*` attributes drive styling.

#### Scenario: Sections appear in order

- **WHEN** a reader opens the Button, Callout or Accordion page
- **THEN** the second-level headings read, in order, `Usage`, then whichever of `Color variants`, `States` and `Icons` apply, then `Props`, then `CSS Variables`, and `Theming` is a heading inside `CSS Variables`

#### Scenario: Optional sections are omitted, not stubbed

- **WHEN** a reader opens the Callout page
- **THEN** there is no `States` section, because the callout has no states

#### Scenario: A component without props has no Props section

- **WHEN** a reader opens the Container page
- **THEN** there is no `Props` heading and no empty props table, and the line naming the forwarded `<div>` attributes and the default slot closes the `Usage` section

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
