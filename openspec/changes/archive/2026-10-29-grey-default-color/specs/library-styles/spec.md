# Spec Delta

## MODIFIED Requirements

### Requirement: Button color API
`Button` SHALL accept an optional `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`. When `color` is passed, `Button` SHALL expose it on the rendered `<button>` as the attribute `data-ui-color`. When `color` is omitted, the rendered `<button>` SHALL carry no `data-ui-color` attribute and SHALL render in the grey palette, looking identical to `color="grey"`. `Button` SHALL NOT accept a `variant` prop. Every other `<button>` attribute SHALL continue to pass through to the element, and a consumer `class` SHALL be merged with the component's own classes.

#### Scenario: Default color
- **WHEN** a consumer renders `<Button>Button</Button>` with no `color`
- **THEN** the rendered element is `<button type="button" class="nf-button …">` with no `data-ui-color` attribute, and it is filled with the grey palette

#### Scenario: Explicit color
- **WHEN** a consumer renders `<Button color="green">Button</Button>`
- **THEN** the rendered element carries `data-ui-color="green"` and its background, text and shadow use green palette values

#### Scenario: A grey button
- **WHEN** a consumer renders `<Button color="grey">Button</Button>`
- **THEN** the rendered element carries `data-ui-color="grey"` and renders as a neutral grey button with the same raised shape, padding and interaction states as every other color

#### Scenario: Explicit grey matches the default
- **WHEN** a `<Button>` with no `color` and a `<Button color="grey">` are rendered side by side in each color scheme
- **THEN** their computed background, text color and shadow color are identical; only the presence of the attribute differs

#### Scenario: Invalid color is a type error
- **WHEN** a consumer writes `<Button color="teal">Button</Button>` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop
- **AND** the same usage inside an `.mdx` page is not reported, because `astro check` type-checks `.astro` files only

#### Scenario: Native attributes still pass through
- **WHEN** a consumer renders `<Button color="red" disabled aria-label="Delete" class="my-cta">Delete</Button>`
- **THEN** the rendered `<button>` is disabled, carries `aria-label="Delete"`, and its class list contains both `nf-button` and `my-cta`

#### Scenario: The color attribute cannot be overridden from outside
- **WHEN** a consumer renders `<Button data-ui-color="teal">Button</Button>`
- **THEN** the rendered element carries no `data-ui-color` attribute, the consumer's value is dropped, and the button keeps its default grey coloring
- **AND** `<Button color="green" data-ui-color="teal">` carries `data-ui-color="green"` exactly once

### Requirement: Button color resolution
`Button`'s color SHALL be resolved through exactly two component-scoped custom properties: `--nf-button-color`, which supplies the background, and `--nf-button-accent-color`, which supplies the text color, the box-shadow color and the focus outline color. Each `data-ui-color` value SHALL set both properties from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-button-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-button-accent-color`. Where neither property is defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of them SHALL fall back to the grey pairing of the same steps (`--nf-grey-l-40`/`--nf-grey-d-50` and `--nf-grey-l-80`/`--nf-grey-d-90`). No other palette token SHALL be referenced for the button's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance
- **WHEN** the page resolves to a light color scheme and a `Button` with `color="purple"` is inspected
- **THEN** its computed background equals the value of `--nf-purple-l-40`, and its computed color and box-shadow color both equal the value of `--nf-purple-l-80`

#### Scenario: Dark appearance
- **WHEN** the page resolves to a dark color scheme and the same `Button` is inspected
- **THEN** its computed background equals `--nf-purple-d-50`, and its color and box-shadow color both equal `--nf-purple-d-90`

#### Scenario: Default appearance
- **WHEN** a `Button` with no `color` is inspected in a light and then a dark color scheme
- **THEN** its background equals `--nf-grey-l-40` and its color and box-shadow color `--nf-grey-l-80` in light, and `--nf-grey-d-50` and `--nf-grey-d-90` in dark

#### Scenario: Re-theme one button by overriding the component properties
- **WHEN** a consumer sets `--nf-button-color` and `--nf-button-accent-color` in unlayered CSS on an ancestor of a `Button` that has no `color`
- **THEN** that button uses the consumer's two values and no button outside that ancestor changes

#### Scenario: Re-theme a colored button on the element
- **WHEN** a consumer sets the same two properties through the `style` attribute of a `Button` that has a `color`
- **THEN** that button uses the consumer's values, while the same properties set on an ancestor leave it in its `color` hue, because its `data-ui-color` rule declares them on the element

#### Scenario: Re-theme by overriding a palette token
- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Button` with `color="purple"` picks up the new background
- **AND** overriding `--nf-grey-l-40` the same way changes every light-scheme `Button` with no `color` or with `color="grey"`

### Requirement: Callout content API
The library SHALL export a component `Callout` at `astro-nosferatu/components/Callout.astro` that presents a tinted panel of supporting content. It SHALL render a plain `<div>` — not a landmark element, so a consumer decides whether a given callout is one by passing `role` and a label. It SHALL accept a required `title` prop rendered as the panel's heading line, an optional `icon` prop holding a component that the callout renders before the title, an optional default slot holding the panel's body, and an optional `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`. When `color` is passed it SHALL be exposed on the rendered element as `data-ui-color`; when it is omitted the element SHALL carry no `data-ui-color` attribute and SHALL render in the grey palette, looking identical to `color="grey"`. The `title` value SHALL NOT be forwarded to the element as the native `title` attribute, so it produces no browser tooltip. Every other native attribute of the rendered element SHALL pass through, and a consumer `class` SHALL be merged with the component's own classes.

#### Scenario: The rendered element is a div
- **WHEN** a rendered `Callout` is inspected
- **THEN** its root element is a `<div>` carrying `nf-callout`, with no implicit landmark role, and its title and body are both `<p>` elements

#### Scenario: Title only
- **WHEN** a consumer renders `<Callout title="What are harnesses?" />` with no children
- **THEN** the panel shows exactly that title, carries no `data-ui-color` attribute, renders in grey, and shows no separator rule, no empty body area and no extra space below the title

#### Scenario: Title and body
- **WHEN** a consumer renders `<Callout title="What are harnesses?">Harness is the infrastructure layer…</Callout>`
- **THEN** the panel shows the title, a full-width separator rule beneath it, and the body text below the rule

#### Scenario: A grey callout
- **WHEN** a consumer renders `<Callout title="Note" color="grey">Body</Callout>`
- **THEN** the panel carries `data-ui-color="grey"` and renders as a neutral grey panel with the same surface, rule, accent and shadow structure as every other color, identical in appearance to a `Callout` with no `color`

#### Scenario: Whitespace-only children are still a body
- **WHEN** a consumer renders a `Callout` whose children are present but render nothing visible
- **THEN** the body area and its rule are rendered, because the decision is made on whether the slot was supplied

#### Scenario: The icon prop takes any component
- **WHEN** a consumer passes an imported `.svg`, a third-party icon component or one of their own components as `icon`
- **THEN** the callout renders that component, with no props of its own, immediately before the title and on the same line, and the library neither requires nor bundles any icon set

#### Scenario: A non-component icon is a type error
- **WHEN** a consumer writes `<Callout title="x" icon="bell" />` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `string` is not assignable to the `icon` prop

#### Scenario: The icon is sized by its box
- **WHEN** a consumer passes an icon component that sizes itself in `em` units
- **THEN** it renders at `--nf-callout-icon-size` — `1.5rem`, 24px at the default root size — in the title's color, and setting `--nf-callout-icon-size` on an ancestor resizes it while the title keeps its own `1rem` size
- **AND** a component with a fixed size keeps that size, because the callout passes it no props

#### Scenario: No icon by default
- **WHEN** a consumer renders a `Callout` with no `icon`
- **THEN** no icon box is rendered and the title starts at the panel's inner edge, with no space reserved for an icon

#### Scenario: Title is not a tooltip
- **WHEN** a reader hovers the body of a `Callout` rendered with `title="Heads up"`
- **THEN** no browser tooltip appears, and the rendered element carries no `title` attribute

#### Scenario: Invalid color is a type error
- **WHEN** a consumer writes `<Callout title="x" color="teal" />` in an `.astro` file and runs `astro check` over that project (`pnpm --filter docs check` in this repository)
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop

#### Scenario: The color attribute cannot be overridden from outside
- **WHEN** a consumer renders `<Callout title="x" data-ui-color="teal" />`
- **THEN** the rendered element carries no `data-ui-color` attribute, the consumer's value is dropped, and the panel keeps its default grey coloring

#### Scenario: Native attributes still pass through
- **WHEN** a consumer renders `<Callout title="x" id="intro" class="my-callout" aria-describedby="note">Body</Callout>`
- **THEN** the rendered element carries `id="intro"` and `aria-describedby="note"`, and its class list contains both the component's own class and `my-callout`

### Requirement: Callout color resolution
`Callout`'s color SHALL be resolved through exactly five component-scoped custom properties, each spelling the component's full name: `--nf-callout-surface-color` for its background, `--nf-callout-accent-color` for the title, the icon and the body text, `--nf-callout-rule-color` for the separator between title and body, `--nf-callout-shadow-color` for the color of its drop shadow, and `--nf-callout-shadow` for the complete drop-shadow value. Each `data-ui-color` value SHALL set the first four from the palette with `light-dark()`, using the 25%-opacity tier for the surface (`--nf-<hue>-l-40-25` light, `--nf-<hue>-d-50-25` dark), for the rule (`--nf-<hue>-l-80-25` light, `--nf-<hue>-d-30-25` dark) and for the shadow color (`--nf-<hue>-l-70-25` light, `--nf-<hue>-d-90-25` dark), and the opaque palette for the accent (`--nf-<hue>-l-80` light, `--nf-<hue>-d-30` dark). Where any of those four is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of it SHALL fall back to the grey token of the same step and tier. The shadow's step SHALL pair with the surface's own step in each scheme — `l-40` with `l-70`, `d-50` with `d-90` — so the shadow is always a darker tint of the panel, and SHALL be translucent rather than opaque, so the page shows through it the way it shows through the surface. `--nf-callout-shadow` SHALL be composed once, for every hue and for the default, from `var(--nf-shadow-depth)` and the shadow color, so the depth comes from `shadows.css` and the color follows the scheme. No other palette token SHALL be referenced for the callout's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance
- **WHEN** the page resolves to a light color scheme and a `Callout` with `color="purple"` is inspected
- **THEN** its computed background equals `--nf-purple-l-40-25`, its title, icon and body color equal `--nf-purple-l-80`, its rule color equals `--nf-purple-l-80-25`, and its shadow color equals `--nf-purple-l-70-25`

#### Scenario: Shadow pairs with the surface step
- **WHEN** a `Callout`'s surface and shadow steps are compared in each scheme
- **THEN** a light panel's `l-40` surface is shadowed with `l-70`, and a dark panel's `d-50` surface is shadowed with `d-90`, both at 25% alpha

#### Scenario: Dark appearance
- **WHEN** the page resolves to a dark color scheme and the same `Callout` is inspected
- **THEN** its computed background equals `--nf-purple-d-50-25`, its title, icon and body color equal `--nf-purple-d-30`, its rule color equals `--nf-purple-d-30-25`, and its shadow color equals `--nf-purple-d-90-25`

#### Scenario: Default appearance
- **WHEN** a `Callout` with no `color` and a body is inspected in a light and then a dark color scheme
- **THEN** its surface, accent, rule and shadow colors equal the `grey` tokens a `color="grey"` callout uses in that scheme

#### Scenario: The surface shows the page through it
- **WHEN** a `Callout` is placed over a colored background
- **THEN** that background remains visible through the panel's tint, because the surface color carries 25% alpha

#### Scenario: Text stays legible in both schemes
- **WHEN** a reader flips between light and dark on a page of callouts
- **THEN** the accent reads as a dark tint of the hue over the pale surface in light, and as a light tint of the hue over the darkened surface in dark

#### Scenario: Re-theme one callout by overriding the component properties
- **WHEN** a consumer sets `--nf-callout-surface-color` and `--nf-callout-accent-color` in unlayered CSS on an ancestor of a `Callout` that has no `color`
- **THEN** that callout uses the consumer's values and no callout outside that ancestor changes

#### Scenario: Re-theme a colored callout on the element
- **WHEN** a consumer sets the same properties through the `style` attribute of a `Callout` that has a `color`
- **THEN** that callout uses the consumer's values, while the same properties set on an ancestor leave it in its `color` hue, because its `data-ui-color` rule declares them on the element

#### Scenario: Re-theme by overriding a palette token
- **WHEN** a consumer overrides `--nf-red-l-40-25` on `:root` in unlayered CSS
- **THEN** every light-scheme `Callout` with `color="red"` picks up the new surface tint

#### Scenario: The shadow depth comes from shadows.css
- **WHEN** a consumer loads `tokens.css` and `colors.css` but not `shadows.css`, and renders a `Callout`
- **THEN** the panel renders with its surface, accent and rule intact but draws no drop shadow, because `--nf-shadow-depth` is undefined

#### Scenario: The shadow follows the scheme
- **WHEN** the same `Callout` is inspected in a light subtree and in a subtree pinned with `color-scheme: only dark`
- **THEN** its shadow is `0px 4px 0px` in each subtree's own 25%-opacity shadow color, not a single fixed color

#### Scenario: The shadow is translucent
- **WHEN** a `Callout` is placed so that its shadow falls over page content
- **THEN** that content stays visible through the shadow, because the shadow color carries 25% alpha

### Requirement: Accordion content API
The library SHALL export a component `Accordion` at `astro-nosferatu/components/Accordion.astro` that discloses and hides a piece of content. It SHALL render a native `<details>` element containing a `<summary>` and, after it, a `<div>` holding the component's default slot. It SHALL accept a required `summary` prop, a `string`, rendered as the text of the `<summary>`, an optional default slot holding the disclosed content, and an optional `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`. When `color` is passed it SHALL be exposed on the rendered `<details>` as `data-ui-color`; when it is omitted the `<details>` SHALL carry no `data-ui-color` attribute and SHALL render in the grey palette, looking identical to `color="grey"`. The `summary` value SHALL NOT be forwarded to the element as a native attribute. Disclosure state and grouping SHALL remain the element's own: `Accordion` SHALL NOT declare props of its own for them, and the native `open` and `name` attributes SHALL pass through, as SHALL every other native attribute of `<details>`. A consumer `class` SHALL be merged with the component's own classes. The component SHALL ship no JavaScript, and the disclosure SHALL work with scripting disabled.

#### Scenario: The rendered markup is a details element
- **WHEN** a rendered `Accordion` with no `color` is inspected
- **THEN** its root is a `<details class="nf-accordion …">` with no `data-ui-color` attribute, whose first child is a `<summary class="nf-accordion-summary">` holding the `summary` text, followed by a `<div class="nf-accordion-content">` holding the slot content, and the page loads no script for it

#### Scenario: Closed by default
- **WHEN** a consumer renders `<Accordion summary="Details">Body</Accordion>`
- **THEN** only the summary is visible, and activating the summary with a click, with `Enter` or with `Space` reveals the body

#### Scenario: Starting open
- **WHEN** a consumer renders `<Accordion summary="Details" open>Body</Accordion>`
- **THEN** the body is visible at its full height on first paint, and the panel does not unfold from zero height on load

#### Scenario: Exclusive group through the native attribute
- **WHEN** a consumer renders three `Accordion`s that all carry `name="faq"`
- **THEN** opening one closes whichever was open, because the attribute reaches the `<details>` element, and the closing panel animates shut exactly as a user-closed one does

#### Scenario: Summary is not an attribute
- **WHEN** a reader hovers an `Accordion` rendered with `summary="Heads up"`
- **THEN** no browser tooltip appears, and the rendered `<details>` carries no `summary` attribute

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
`Accordion`'s color SHALL be resolved through exactly two component-scoped custom properties, matching `Button`'s approach: `--nf-accordion-color`, which fills both the summary and the content panel, and `--nf-accordion-accent-color`, which supplies the summary's text and disclosure marker, the content's text, the summary's box-shadow and its focus outline. Each `data-ui-color` value SHALL set both properties from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-accordion-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-accordion-accent-color`. Where neither property is defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of them SHALL fall back to the grey pairing of the same steps. No other palette token SHALL be referenced for the accordion's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance
- **WHEN** the page resolves to a light color scheme and an `Accordion` with `color="purple"` is inspected
- **THEN** the computed background of both its summary and its content equals the value of `--nf-purple-l-40`, and their computed color, together with the summary's box-shadow color, equals the value of `--nf-purple-l-80`

#### Scenario: Dark appearance
- **WHEN** the page resolves to a dark color scheme and the same `Accordion` is inspected
- **THEN** both backgrounds equal `--nf-purple-d-50`, and the text and box-shadow color equal `--nf-purple-d-90`

#### Scenario: Default appearance
- **WHEN** an `Accordion` with no `color` is inspected in a light and then a dark color scheme
- **THEN** both backgrounds equal `--nf-grey-l-40` and the text and box-shadow color `--nf-grey-l-80` in light, and `--nf-grey-d-50` and `--nf-grey-d-90` in dark

#### Scenario: Every hue is distinct
- **WHEN** one `Accordion` is rendered for each of the nine hues
- **THEN** each renders in its own hue with the identical shape, padding, depth and interaction behaviour

#### Scenario: Re-theme one accordion by overriding the component properties
- **WHEN** a consumer sets `--nf-accordion-color` and `--nf-accordion-accent-color` on the `Accordion` element itself, through its `style` attribute
- **THEN** that accordion uses the consumer's two values, for its summary and its content alike, and no other accordion on the page changes

#### Scenario: An ancestor cannot supply the two properties
- **WHEN** a consumer sets the same two properties on an ancestor of an `Accordion` with no `color` and of one with `color="green"`
- **THEN** the uncolored accordion uses the consumer's values, and the green one keeps its hue, because the rule that matches its own `data-ui-color` declares both properties on the element, and a declaration on the element always beats an inherited value
- **AND** the component's documentation tells consumers to set them on the element itself when the accordion has a `color`

#### Scenario: Re-theme by overriding a palette token
- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Accordion` with `color="purple"` picks up the new fill
