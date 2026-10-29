# Spec Delta

## ADDED Requirements

### Requirement: Accordion content API
The library SHALL export a component `Accordion` at `astro-nosferatu/components/Accordion.astro` that discloses and hides a piece of content. It SHALL render a native `<details>` element containing a `<summary>` and, after it, a `<div>` holding the component's default slot. It SHALL accept a required `summary` prop, a `string`, rendered as the text of the `<summary>`, an optional default slot holding the disclosed content, and a `color` prop whose value is one of the palette hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` or `yellow`, defaulting to `purple` and exposed on the rendered `<details>` as `data-ui-color`. The `summary` value SHALL NOT be forwarded to the element as a native attribute. Disclosure state and grouping SHALL remain the element's own: `Accordion` SHALL NOT declare props of its own for them, and the native `open` and `name` attributes SHALL pass through, as SHALL every other native attribute of `<details>`. A consumer `class` SHALL be merged with the component's own classes. The component SHALL ship no JavaScript, and the disclosure SHALL work with scripting disabled.

#### Scenario: The rendered markup is a details element
- **WHEN** a rendered `Accordion` is inspected
- **THEN** its root is a `<details class="nf-accordion …" data-ui-color="purple">` whose first child is a `<summary class="nf-accordion-summary">` holding the `summary` text, followed by a `<div class="nf-accordion-content">` holding the slot content, and the page loads no script for it

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
- **THEN** the rendered element carries `data-ui-color="purple"` exactly once, the consumer's value is dropped, and the accordion keeps its default coloring

#### Scenario: Native attributes still pass through
- **WHEN** a consumer renders `<Accordion summary="x" id="faq-1" class="my-accordion" aria-describedby="note">Body</Accordion>`
- **THEN** the rendered `<details>` carries `id="faq-1"` and `aria-describedby="note"`, and its class list contains both `nf-accordion` and `my-accordion`

### Requirement: Accordion color resolution
`Accordion`'s color SHALL be resolved through exactly two component-scoped custom properties, matching `Button`'s approach: `--nf-accordion-color`, which fills both the summary and the content panel, and `--nf-accordion-accent-color`, which supplies the summary's text and disclosure marker, the content's text, the summary's box-shadow and its focus outline. Each `data-ui-color` value SHALL set both properties from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-accordion-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-accordion-accent-color`. No other palette token SHALL be referenced for the accordion's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance
- **WHEN** the page resolves to a light color scheme and an `Accordion` with `color="purple"` is inspected
- **THEN** the computed background of both its summary and its content equals the value of `--nf-purple-l-40`, and their computed color, together with the summary's box-shadow color, equals the value of `--nf-purple-l-80`

#### Scenario: Dark appearance
- **WHEN** the page resolves to a dark color scheme and the same `Accordion` is inspected
- **THEN** both backgrounds equal `--nf-purple-d-50`, and the text and box-shadow color equal `--nf-purple-d-90`

#### Scenario: Every hue is distinct
- **WHEN** one `Accordion` is rendered for each of the nine hues
- **THEN** each renders in its own hue with the identical shape, padding, depth and interaction behaviour

#### Scenario: Re-theme one accordion by overriding the component properties
- **WHEN** a consumer sets `--nf-accordion-color` and `--nf-accordion-accent-color` on the `Accordion` element itself, through its `style` attribute
- **THEN** that accordion uses the consumer's two values, for its summary and its content alike, and no other accordion on the page changes

#### Scenario: An ancestor cannot supply the two properties
- **WHEN** a consumer sets the same two properties on an ancestor of an `Accordion` instead
- **THEN** the accordion keeps its `color` hue, because the rule that matches its own `data-ui-color` declares both properties on the element, and a declaration on the element always beats an inherited value
- **AND** the component's documentation tells consumers to set them on the element itself for this reason

#### Scenario: Re-theme by overriding a palette token
- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Accordion` with `color="purple"` picks up the new fill

### Requirement: Accordion appearance and interaction states
`Accordion`'s summary SHALL carry the same raised treatment as `Button`: `padding-block: 8px`, `padding-inline: 16px`, `border-radius: 8px`, no border, a fill of `--nf-accordion-color`, text in `--nf-accordion-accent-color`, and a `0px 4px 0px` box-shadow in `--nf-accordion-accent-color`. It SHALL keep the browser's own disclosure marker, which inherits the summary's color, and SHALL show a pointer cursor. On hover, and whenever focus is within it, the summary SHALL translate down by `2px` and reduce its shadow to `0px 2px 0px`; while `:active` it SHALL translate down by `4px` and reduce the shadow to `0px 0px 0px`. While the `<details>` is `[open]` the summary SHALL hold that pressed appearance — down `4px` with no shadow — regardless of hover, so an open panel reads as a button that stays pressed, and SHALL return to the raised resting appearance when the panel closes. The sum of the translation and the shadow depth SHALL stay constant across every state, so the summary's bottom edge does not move. On `:focus-visible` the summary SHALL additionally draw a `2px` solid outline in `--nf-accordion-accent-color`, inset by its own width so it reads as a border on the summary rather than a ring around it.

The content `<div>` SHALL carry the same `padding-block: 8px` and `padding-inline: 16px`, the same fill and the same text color as the summary, and no shadow of its own. Every property that changes between the states SHALL animate over `0.15s` with an `ease-in-out` timing function, except when the user has requested reduced motion, in which case each state SHALL be reached instantly while still looking exactly as described.

#### Scenario: Resting state is raised
- **WHEN** a reader looks at a closed `Accordion` that is neither hovered nor focused
- **THEN** its summary shows no border and a 4px-deep solid shadow directly beneath it, in the same accent color as its text, and the content is not visible

#### Scenario: Hover sinks the summary halfway
- **WHEN** the pointer hovers the summary of a closed `Accordion`
- **THEN** it moves down 2px and its shadow shortens to 2px, so its bottom edge stays in place, and the movement is animated rather than instant

#### Scenario: Open holds the summary pressed
- **WHEN** a reader opens an `Accordion` and then moves the pointer away from the summary
- **THEN** the summary stays down 4px with no shadow, sitting flush against the content panel below it, and it returns to the raised appearance only when the panel is closed again

#### Scenario: Open is unaffected by hover
- **WHEN** the pointer hovers the summary of an already-open `Accordion`
- **THEN** the summary does not rise to the 2px hover depth; it stays pressed flat

#### Scenario: Keyboard focus draws an inset outline
- **WHEN** a reader tabs to an `Accordion`'s summary
- **THEN** a 2px outline in the accent color is drawn inside the summary's edge, following its corner radius, without changing its size or position, and the summary takes the hover depth while it is closed and stays pressed while it is open

#### Scenario: Padding is the same on both parts
- **WHEN** the summary and the content of an open `Accordion` are measured
- **THEN** both show 8px of padding above and below their text and 16px on each side

#### Scenario: The disclosure marker is the browser's own
- **WHEN** a reader looks at a closed and then an open `Accordion`
- **THEN** the native marker is present in the summary's accent color and turns as the browser turns it, and the component renders no icon of its own

#### Scenario: Reduced motion removes the animation
- **WHEN** the user has `prefers-reduced-motion: reduce` and hovers, presses or opens an `Accordion`
- **THEN** the resting, hover, active and open appearances are unchanged and still give the same feedback, but each one is reached instantly with no animated transition

### Requirement: Accordion open and close animation
`Accordion` SHALL animate its disclosure in CSS alone, with no script: opening SHALL grow the panel from zero to the content's natural height while the content itself fades and slides into place, and closing SHALL shrink the panel back to zero, over `0.3s` with an `ease-in-out` timing function, with the content clipped while the panel moves so no text spills outside it. The growth and shrink SHALL be driven by the `::details-content` pseudo-element of the component's own `<details>`, and the content's entry SHALL be driven by a starting style on the component's content `<div>`, which has no previous value to transition from because it is not rendered while the panel is closed. Both SHALL be applied only inside an `@supports` test for the CSS size interpolation and pseudo-element they depend on. Where that test fails, the component SHALL leave the browser's native `<details>` behaviour untouched, so the panel appears and disappears instantly, fully rendered and fully readable. When the user has requested reduced motion, the disclosure SHALL also be instant. The animation SHALL NOT require the consumer to load `reset.css` or any other library stylesheet beyond the tokens and palette the component's colors already need, and SHALL NOT require the consumer to declare a height, a maximum height or any other measurement of their content.

#### Scenario: Opening animates to the content's own height
- **WHEN** a reader opens an `Accordion` in a browser that supports the animation
- **THEN** the panel grows smoothly from nothing to exactly the height of its content, its content fading and sliding into place as it goes, over about a third of a second, and no content is visible outside the growing panel while it moves

#### Scenario: Closing animates too
- **WHEN** the reader closes the same `Accordion`
- **THEN** the panel shrinks back to nothing over the same duration instead of vanishing in one frame

#### Scenario: Content of any height is handled
- **WHEN** two `Accordion`s are rendered, one with a single line of text and one with several paragraphs and an image
- **THEN** each animates to its own full height with no measurement, no fixed maximum and no clipped content once open

#### Scenario: Unsupported browser still works
- **WHEN** the same page is opened in a browser that supports neither CSS size interpolation nor the content pseudo-element
- **THEN** the accordion opens and closes instantly, showing its full content, and never renders as an open panel of zero height

#### Scenario: Reduced motion opens instantly
- **WHEN** a user with `prefers-reduced-motion: reduce` opens an `Accordion`
- **THEN** the content appears immediately at full height and full opacity, with no growth and no fade

#### Scenario: The animation does not depend on the reset
- **WHEN** a consumer loads only `tokens.css` and the palette, not `reset.css`, and opens an `Accordion` in a supporting browser
- **THEN** the open and close animation still runs, because the component supplies the size interpolation its own animation needs

#### Scenario: Scoped styles stay inside the component
- **WHEN** a page renders an `Accordion` next to a plain `<details data-ui-color="green"><summary>Plain</summary>Body</details>`
- **THEN** the plain element keeps the browser's default appearance and instant disclosure, receiving none of the component's colors, padding, depth or animation
