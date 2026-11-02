# Spec Delta

## ADDED Requirements

### Requirement: Accordion appearance, disclosure icon and interaction states

`Accordion`'s `<details>` SHALL carry the component's raised depth: an `8px` corner radius and a `0px 4px 0px` box-shadow in `--nf-accordion-shadow-color`. That shadow SHALL show whether the panel is closed or open, SHALL follow the panel's outline as it grows and shrinks, and SHALL NOT change between states.

`Accordion`'s summary SHALL carry `padding-block: 8px`, `padding-inline: 16px`, `border-radius: 8px`, a fill of `--nf-accordion-color`, text in `--nf-accordion-accent-color` at `font-weight: 600`, and no shadow of its own. It SHALL hide the browser's own disclosure marker in every engine and SHALL instead lay out its text and its icon box on one row, the text at the start and the icon box at the end, with at least `8px` between them. The icon box SHALL be one line of the summary text tall, with the icon vertically centred in it, and each icon SHALL be rendered at a `font-size` of the component-scoped `--nf-accordion-icon-size`, `1.5rem` by default, so an icon sized in `em` renders at 24px; a consumer MAY override that property. The icon SHALL take `--nf-accordion-accent-color`. While the `<details>` is closed only the collapsed icon SHALL be displayed, and while it is `[open]` only the expanded icon, switching at the moment the state changes. The summary SHALL show a pointer cursor.

While the `<details>` is `[open]`, the summary's end-start and end-end corners SHALL be square, and the summary SHALL draw a `2px` solid `border-block-end` in `--nf-accordion-rule-color`, separating it from the content. The summary's outer height SHALL be identical closed and open, so opening never shifts the summary text or anything outside the component. Where the open and close animation runs, closing SHALL keep the square corners and the rule until the panel has finished shrinking, then restore the rounded corners and hide the rule in one step; opening SHALL square the corners and show the rule immediately. Where the animation does not run, or the user has requested reduced motion, both SHALL switch the moment the state changes.

Only the summary SHALL move between states, and only while the `<details>` is closed: on hover, and whenever focus is within it, it SHALL translate down by `1px`; while `:active` it SHALL translate down by `4px`, covering the `<details>`' shadow so it reads as pressed. While the `<details>` is `[open]` the summary SHALL NOT translate on hover, focus or `:active`. On `:focus-visible` the summary SHALL additionally draw a `2px` solid outline in `--nf-accordion-accent-color` — the text color, not the shadow color — inset by its own width so it reads as a border on the summary rather than a ring around it.

The content `<div>` SHALL carry the same `padding-block: 8px` and `padding-inline: 16px`, the same fill and the same text color as the summary, and no shadow of its own. Every property that changes between the states SHALL animate over `0.15s` with an `ease-in-out` timing function, except when the user has requested reduced motion, in which case each state SHALL be reached instantly while still looking exactly as described.

#### Scenario: Resting state is raised

- **WHEN** a reader looks at a closed `Accordion` that is neither hovered nor focused
- **THEN** the summary shows no visible border and a 4px-deep solid shadow directly beneath it, in the hue of its text but one step lighter than the text under the dark scheme, and the content is not visible

#### Scenario: The summary is semibold

- **WHEN** the computed `font-weight` of an `Accordion`'s summary is inspected
- **THEN** it is `600`, and the content panel's text keeps whatever weight it inherits from the page

#### Scenario: Hover nudges the summary

- **WHEN** the pointer hovers the summary of a closed `Accordion`
- **THEN** the summary moves down 1px over a shadow that does not itself change, and the movement is animated rather than instant

#### Scenario: Press sinks the summary into the shadow

- **WHEN** a reader presses the summary of a closed `Accordion`
- **THEN** the summary moves down 4px, covering the shadow beneath it, and returns when released

#### Scenario: The shadow follows the panel

- **WHEN** a reader opens an `Accordion` and inspects it closed and open
- **THEN** the computed `box-shadow` is on the `<details>`, not the summary, it is `0px 4px 0px` in `--nf-accordion-shadow-color` in both states, and it sits under the summary while closed and under the content while open

#### Scenario: Open summary sits on its rule

- **WHEN** a reader opens an `Accordion`
- **THEN** the summary's bottom corners are square, a 2px rule in `--nf-accordion-rule-color` separates it from the content, and the summary does not move away from its resting position

#### Scenario: Closing keeps the panel joined until it is shut

- **WHEN** a reader closes an open `Accordion` in a browser that runs the open and close animation
- **THEN** while the panel shrinks the summary keeps its square bottom corners and its rule, so it never shows rounded corners above the still-visible content, and its corners round only once the panel is gone

#### Scenario: Open is unaffected by hover

- **WHEN** the pointer hovers or presses the summary of an already-open `Accordion`
- **THEN** the summary does not move

#### Scenario: Opening does not shift the layout

- **WHEN** the summary's box is measured with the `Accordion` closed and then open
- **THEN** its height and the position of its text are the same in both states

#### Scenario: Keyboard focus draws an inset outline

- **WHEN** a reader tabs to an `Accordion`'s summary
- **THEN** a 2px outline in the accent color, matching the summary's text rather than its shadow, is drawn inside the summary's edge, following its corner radius, without changing its size, and the summary takes the 1px hover nudge while it is closed and does not move while it is open

#### Scenario: Padding is the same on both parts

- **WHEN** the summary and the content of an open `Accordion` are measured
- **THEN** both show 8px of padding above and below their text and 16px on each side

#### Scenario: The component's icon replaces the native marker

- **WHEN** a reader looks at a closed and then an open `Accordion` in Chromium, Firefox and Safari
- **THEN** no native triangle is visible in any of them, the summary's end shows a 24px plus while closed and a 24px minus while open, both in the accent color and centred on the summary's first line of text

#### Scenario: The icon size can be overridden

- **WHEN** a consumer sets `--nf-accordion-icon-size: 1rem` on an `Accordion` through its `style` attribute
- **THEN** that accordion's icon renders at 16px and no other accordion changes

#### Scenario: A long summary wraps beside the icon

- **WHEN** an `Accordion`'s `summary` is long enough to wrap onto several lines in a narrow container
- **THEN** the text wraps within its own part, the icon stays at the end aligned with the first line, and the two never overlap

#### Scenario: Reduced motion removes the animation

- **WHEN** the user has `prefers-reduced-motion: reduce` and hovers, presses or opens an `Accordion`
- **THEN** the resting, hover, active and open appearances are unchanged and still give the same feedback, but each one is reached instantly with no animated transition

## MODIFIED Requirements

### Requirement: Accordion content API

The library SHALL export a component `Accordion` at `astro-nosferatu/components/Accordion.astro` that discloses and hides a piece of content. It SHALL render a native `<details>` element containing a `<summary>` and, after it, a `<div>` holding the component's default slot. The `<summary>` SHALL hold, in order, the summary text in its own part and one icon box holding both disclosure icons. It SHALL accept a required `summary` prop, a `string`, rendered as the text of the `<summary>`, an optional default slot holding the disclosed content, and an optional `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`.

It SHALL accept two optional props for its disclosure icon: `iconCollapsed`, shown while the panel is closed, and `iconExpanded`, shown while it is open. Each SHALL accept a component, rendered with no props the way `Callout` renders its `icon`. When they are omitted the accordion SHALL render Iconoir's `plus` while closed and Iconoir's `minus` while open, which the library supplies itself: the consumer SHALL NOT need to install anything for the defaults. Both icons SHALL be decorative, hidden from assistive technology, because the `<summary>` already exposes the expanded state.

When `color` is passed it SHALL be exposed on the rendered `<details>` as `data-ui-color`; when it is omitted the `<details>` SHALL carry no `data-ui-color` attribute and SHALL render in the grey palette, looking identical to `color="grey"`. The `summary` value SHALL NOT be forwarded to the element as a native attribute, and neither SHALL `iconCollapsed` or `iconExpanded`. Disclosure state and grouping SHALL remain the element's own: `Accordion` SHALL NOT declare props of its own for them, and the native `open` and `name` attributes SHALL pass through, as SHALL every other native attribute of `<details>`. A consumer `class` SHALL be merged with the component's own classes. The component SHALL ship no JavaScript, and the disclosure, including the icon swap, SHALL work with scripting disabled.

#### Scenario: The rendered markup is a details element

- **WHEN** a rendered `Accordion` with no `color` is inspected
- **THEN** its root is a `<details class="nf-accordion …">` with no `data-ui-color` attribute, whose first child is a `<summary class="nf-accordion-summary">` holding a `nf-accordion-label` part with the `summary` text followed by a `nf-accordion-icon` part, followed by a `<div class="nf-accordion-content">` holding the slot content, and the page loads no script for it

#### Scenario: Default icons

- **WHEN** a consumer renders `<Accordion summary="Details">Body</Accordion>` and opens it
- **THEN** the summary shows Iconoir's plus while closed and Iconoir's minus while open, and the consumer installed nothing beyond the library for either

#### Scenario: A name is not an icon

- **WHEN** a consumer writes `<Accordion summary="x" iconCollapsed="nav-arrow-down" />` in an `.astro` file and runs `astro check`
- **THEN** the check fails, reporting that a string is not assignable to `iconCollapsed`

#### Scenario: Icons replaced by component

- **WHEN** a consumer passes an imported SVG component or an `.astro` component as `iconCollapsed` and another as `iconExpanded`
- **THEN** each renders in place of the default for its state

#### Scenario: Icons are not announced

- **WHEN** a screen reader focuses the summary of an `Accordion`
- **THEN** it announces the summary text and the expanded or collapsed state, and nothing for the icons

#### Scenario: Closed by default

- **WHEN** a consumer renders `<Accordion summary="Details">Body</Accordion>`
- **THEN** only the summary is visible, and activating the summary with a click, with `Enter` or with `Space` reveals the body

#### Scenario: Starting open

- **WHEN** a consumer renders `<Accordion summary="Details" open>Body</Accordion>`
- **THEN** the body is visible at its full height on first paint, the summary shows the expanded icon, and the panel does not unfold from zero height on load

#### Scenario: Exclusive group through the native attribute

- **WHEN** a consumer renders three `Accordion`s that all carry `name="faq"`
- **THEN** opening one closes whichever was open, because the attribute reaches the `<details>` element, and the closing panel animates shut exactly as a user-closed one does

#### Scenario: Summary is not an attribute

- **WHEN** a reader hovers an `Accordion` rendered with `summary="Heads up"`
- **THEN** no browser tooltip appears, and the rendered `<details>` carries no `summary`, `iconCollapsed` or `iconExpanded` attribute

#### Scenario: A missing summary is a type error

- **WHEN** a consumer writes `<Accordion>Body</Accordion>` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `summary` is missing

#### Scenario: Invalid color is a type error

- **WHEN** a consumer writes `<Accordion summary="x" color="teal" />` in an `.astro` file and runs `astro check` over that project
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop

#### Scenario: The color attribute cannot be overridden from outside

- **WHEN** a consumer renders `<Accordion summary="x" data-ui-color="teal" />`
- **THEN** the rendered element carries no `data-ui-color` attribute, the consumer's value is dropped, and the accordion keeps its default grey coloring

#### Scenario: Native attributes still pass through

- **WHEN** a consumer renders `<Accordion summary="x" id="faq-1" class="my-accordion" aria-describedby="note">Body</Accordion>`
- **THEN** the rendered `<details>` carries `id="faq-1"` and `aria-describedby="note"`, and its class list contains both `nf-accordion` and `my-accordion`

### Requirement: Accordion color resolution

`Accordion`'s color SHALL be resolved through exactly four component-scoped custom properties: `--nf-accordion-color`, which fills both the summary and the content panel, `--nf-accordion-accent-color`, which supplies the summary's text and disclosure icon, the content's text and the summary's focus outline, `--nf-accordion-shadow-color`, which supplies the color of the `<details>`' box-shadow alone, and `--nf-accordion-rule-color`, which supplies the rule under the summary of an open accordion alone. Each `data-ui-color` value SHALL set all four from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-accordion-color`, `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-accordion-accent-color`, `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-80` (dark) for `--nf-accordion-shadow-color`, and the 25%-opacity tier `--nf-<hue>-l-60-25` (light) and `--nf-<hue>-d-70-25` (dark) for `--nf-accordion-rule-color`. Where a property is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of it SHALL fall back to the grey token of the same step and tier in the same scheme. The accent and the shadow SHALL therefore resolve to the same value under the light scheme and to different values under the dark scheme, where the shadow is one step lighter than the text. No other palette token SHALL be referenced for the accordion's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and an open `Accordion` with `color="purple"` is inspected
- **THEN** the computed background of both its summary and its content equals the value of `--nf-purple-l-40`, their computed color, together with the accordion's box-shadow color, equals the value of `--nf-purple-l-80`, and the summary's bottom rule equals `--nf-purple-l-60-25`

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Accordion` is inspected
- **THEN** both backgrounds equal `--nf-purple-d-50`, the text of the summary and of the content equals `--nf-purple-d-90`, the accordion's box-shadow color equals `--nf-purple-d-80`, and the summary's bottom rule equals `--nf-purple-d-70-25`

#### Scenario: Default appearance

- **WHEN** an open `Accordion` with no `color` is inspected in a light and then a dark color scheme
- **THEN** both backgrounds equal `--nf-grey-l-40`, the text and box-shadow color `--nf-grey-l-80` and the rule `--nf-grey-l-60-25` in light, and `--nf-grey-d-50`, `--nf-grey-d-90`, `--nf-grey-d-80` and `--nf-grey-d-70-25` respectively in dark

#### Scenario: The shadow is independent of the text

- **WHEN** a consumer sets only `--nf-accordion-shadow-color` through the `style` attribute of an `Accordion`
- **THEN** the accordion's shadow takes the consumer's color while the summary text, the disclosure icon, the content text, the focus outline and the open rule keep their own colors

#### Scenario: Every hue is distinct

- **WHEN** one `Accordion` is rendered for each of the nine hues
- **THEN** each renders in its own hue with the identical shape, padding, depth and interaction behaviour

#### Scenario: Re-theme one accordion by overriding the component properties

- **WHEN** a consumer sets `--nf-accordion-color`, `--nf-accordion-accent-color`, `--nf-accordion-shadow-color` and `--nf-accordion-rule-color` on the `Accordion` element itself, through its `style` attribute
- **THEN** that accordion uses the consumer's four values, for its summary and its content alike, and no other accordion on the page changes

#### Scenario: An ancestor cannot supply the two properties

- **WHEN** a consumer sets the same four properties on an ancestor of an `Accordion` with no `color` and of one with `color="green"`
- **THEN** the uncolored accordion uses the consumer's values, and the green one keeps its hue, because the rule that matches its own `data-ui-color` declares all four properties on the element, and a declaration on the element always beats an inherited value
- **AND** the component's documentation tells consumers to set them on the element itself when the accordion has a `color`

#### Scenario: Re-theme by overriding a palette token

- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Accordion` with `color="purple"` picks up the new fill

## REMOVED Requirements

### Requirement: Accordion appearance and interaction states

**Reason**: The accordion now hides the native marker and renders its own icon, its shadow moves from the summary to the whole `<details>`, and an open accordion no longer holds its summary pressed. The "disclosure marker is the browser's own" and "open holds the summary pressed" scenarios no longer hold, and a MODIFIED block cannot drop a scenario.
**Migration**: Replaced by "Accordion appearance, disclosure icon and interaction states". Padding, fill, weight, focus outline and timings carry over. The summary now sinks only while closed (1px on hover, 4px on press), the 4px shadow sits under the `<details>` in every state, and an open summary has square bottom corners over a 2px rule in `--nf-accordion-rule-color`. Consumers styling `::marker` or `::-webkit-details-marker` on the summary should use `--nf-accordion-icon-size` and `--nf-accordion-accent-color` or pass their own icons. Consumers who targeted the summary's `box-shadow` should target the `<details>` instead.
