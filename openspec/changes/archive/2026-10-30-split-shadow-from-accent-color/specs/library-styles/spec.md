# Spec Delta

## MODIFIED Requirements

### Requirement: Button color resolution

`Button`'s color SHALL be resolved through exactly three component-scoped custom properties: `--nf-button-color`, which supplies the background, `--nf-button-accent-color`, which supplies the text color and the focus outline color, and `--nf-button-shadow-color`, which supplies the box-shadow color alone. Each `data-ui-color` value SHALL set all three from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-button-color`, `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-button-accent-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-80` (dark) for `--nf-button-shadow-color`. Where a property is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of it SHALL fall back to the grey token of the same step in the same scheme (`--nf-grey-l-40`/`--nf-grey-d-50`, `--nf-grey-l-80`/`--nf-grey-d-90` and `--nf-grey-l-80`/`--nf-grey-d-80`). The accent and the shadow SHALL therefore resolve to the same value under the light scheme and to different values under the dark scheme, where the shadow is one step lighter than the text. No other palette token SHALL be referenced for the button's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and a `Button` with `color="purple"` is inspected
- **THEN** its computed background equals the value of `--nf-purple-l-40`, and its computed color and box-shadow color both equal the value of `--nf-purple-l-80`

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Button` is inspected
- **THEN** its computed background equals `--nf-purple-d-50`, its color equals `--nf-purple-d-90`, and its box-shadow color equals `--nf-purple-d-80`, which is a visibly lighter purple than the text

#### Scenario: Default appearance

- **WHEN** a `Button` with no `color` is inspected in a light and then a dark color scheme
- **THEN** its background equals `--nf-grey-l-40` and its color and box-shadow color both `--nf-grey-l-80` in light, and `--nf-grey-d-50`, `--nf-grey-d-90` and `--nf-grey-d-80` respectively in dark

#### Scenario: The shadow is independent of the text

- **WHEN** a consumer sets only `--nf-button-shadow-color` through the `style` attribute of a `Button`
- **THEN** the shadow takes the consumer's color while the label and the focus outline keep the color their `--nf-button-accent-color` resolves to
- **AND** setting only `--nf-button-accent-color` changes the label and the outline while leaving the shadow where its own property puts it

#### Scenario: Re-theme one button by overriding the component properties

- **WHEN** a consumer sets `--nf-button-color`, `--nf-button-accent-color` and `--nf-button-shadow-color` in unlayered CSS on an ancestor of a `Button` that has no `color`
- **THEN** that button uses the consumer's three values and no button outside that ancestor changes

#### Scenario: Re-theme a colored button on the element

- **WHEN** a consumer sets the same three properties through the `style` attribute of a `Button` that has a `color`
- **THEN** that button uses the consumer's values, while the same properties set on an ancestor leave it in its `color` hue, because its `data-ui-color` rule declares them on the element

#### Scenario: Re-theme by overriding a palette token

- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Button` with `color="purple"` picks up the new background
- **AND** overriding `--nf-grey-l-40` the same way changes every light-scheme `Button` with no `color` or with `color="grey"`

### Requirement: Button appearance and interaction states

`Button` SHALL render at `font-size: 1rem` and `font-weight: 600` with `padding-block: 8px`, `padding-inline: 16px`, `border-radius: 8px`, no border, and a `0px 4px 0px` box-shadow in `--nf-button-shadow-color`, giving a raised appearance. Its label weight SHALL match `Accordion`'s summary, so the two controls read as the same control in different elements. On hover, and whenever focus is within it, it SHALL translate down by `2px` and reduce the shadow to `0px 2px 0px`; while active it SHALL translate down by `4px` and reduce the shadow to `0px 0px 0px`, so the button appears pressed flat. The sum of the translation and the shadow depth SHALL stay constant across the states, so the button's bottom edge does not move. Every property that changes between these states SHALL animate over `0.15s` with an `ease-in-out` timing function, except when the user has requested reduced motion, in which case the states SHALL apply instantly. On `:focus-visible` the button SHALL additionally draw a `2px` solid outline in `--nf-button-accent-color` — the text color, not the shadow color — inset by its own width so that it reads as a border on the button rather than a ring around it. The button SHALL NOT apply the hover, focus or active movement while disabled.

#### Scenario: Resting state is raised

- **WHEN** a reader looks at a `Button` that is neither hovered, focused nor pressed
- **THEN** it shows no border and a 4px-deep solid shadow directly beneath it, in the hue of its text but one step lighter than the text under the dark scheme, and in the same color as the text under the light scheme

#### Scenario: The label is semibold

- **WHEN** the computed `font-weight` of a `Button` is inspected
- **THEN** it is `600`, lighter than it was, and it equals the computed `font-weight` of an `Accordion`'s summary rendered beside it

#### Scenario: Hover sinks the button halfway

- **WHEN** the pointer hovers an enabled `Button`
- **THEN** it moves down 2px and its shadow shortens to 2px, so the button's bottom edge stays in place, and the movement is animated rather than instant

#### Scenario: Active presses the button flat

- **WHEN** the reader holds the pointer down on an enabled `Button`
- **THEN** it moves down 4px and its shadow disappears, so the button sits flush with where the shadow was

#### Scenario: Disabled button does not react

- **WHEN** the pointer hovers or presses a `Button` rendered with `disabled`
- **THEN** it neither moves nor changes its shadow, and it shows the disabled treatment

#### Scenario: Keyboard focus draws an inset outline

- **WHEN** a reader tabs to a `Button`
- **THEN** it takes the hover appearance — down 2px with a 2px shadow — and a 2px outline in its accent color, matching its label rather than its shadow, is drawn inside its edge, following its corner radius, without changing the button's size or position

#### Scenario: Pointer focus does not draw the outline

- **WHEN** a reader clicks a `Button` and the pointer leaves it while the button keeps focus
- **THEN** the button keeps the hover appearance but draws no outline, because the outline is bound to `:focus-visible`

#### Scenario: Reduced motion removes the animation

- **WHEN** the user has `prefers-reduced-motion: reduce` and hovers or presses a `Button`
- **THEN** the resting, hover and active appearances are unchanged and still give the same feedback, but each one is reached instantly with no animated transition

### Requirement: Accordion color resolution

`Accordion`'s color SHALL be resolved through exactly three component-scoped custom properties, matching `Button`'s approach: `--nf-accordion-color`, which fills both the summary and the content panel, `--nf-accordion-accent-color`, which supplies the summary's text and disclosure marker, the content's text and the summary's focus outline, and `--nf-accordion-shadow-color`, which supplies the summary's box-shadow color alone. Each `data-ui-color` value SHALL set all three from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-accordion-color`, `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-accordion-accent-color`, and `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-80` (dark) for `--nf-accordion-shadow-color`. Where a property is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of it SHALL fall back to the grey token of the same step in the same scheme. The accent and the shadow SHALL therefore resolve to the same value under the light scheme and to different values under the dark scheme, where the shadow is one step lighter than the text. No other palette token SHALL be referenced for the accordion's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and an `Accordion` with `color="purple"` is inspected
- **THEN** the computed background of both its summary and its content equals the value of `--nf-purple-l-40`, and their computed color, together with the summary's box-shadow color, equals the value of `--nf-purple-l-80`

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Accordion` is inspected
- **THEN** both backgrounds equal `--nf-purple-d-50`, the text of the summary and of the content equals `--nf-purple-d-90`, and the summary's box-shadow color equals `--nf-purple-d-80`

#### Scenario: Default appearance

- **WHEN** an `Accordion` with no `color` is inspected in a light and then a dark color scheme
- **THEN** both backgrounds equal `--nf-grey-l-40` and the text and box-shadow color `--nf-grey-l-80` in light, and `--nf-grey-d-50`, `--nf-grey-d-90` and `--nf-grey-d-80` respectively in dark

#### Scenario: The shadow is independent of the text

- **WHEN** a consumer sets only `--nf-accordion-shadow-color` through the `style` attribute of an `Accordion`
- **THEN** the summary's shadow takes the consumer's color while the summary text, the disclosure marker, the content text and the focus outline keep the color `--nf-accordion-accent-color` resolves to

#### Scenario: Every hue is distinct

- **WHEN** one `Accordion` is rendered for each of the nine hues
- **THEN** each renders in its own hue with the identical shape, padding, depth and interaction behaviour

#### Scenario: Re-theme one accordion by overriding the component properties

- **WHEN** a consumer sets `--nf-accordion-color`, `--nf-accordion-accent-color` and `--nf-accordion-shadow-color` on the `Accordion` element itself, through its `style` attribute
- **THEN** that accordion uses the consumer's three values, for its summary and its content alike, and no other accordion on the page changes

#### Scenario: An ancestor cannot supply the two properties

- **WHEN** a consumer sets the same three properties on an ancestor of an `Accordion` with no `color` and of one with `color="green"`
- **THEN** the uncolored accordion uses the consumer's values, and the green one keeps its hue, because the rule that matches its own `data-ui-color` declares all three properties on the element, and a declaration on the element always beats an inherited value
- **AND** the component's documentation tells consumers to set them on the element itself when the accordion has a `color`

#### Scenario: Re-theme by overriding a palette token

- **WHEN** a consumer overrides `--nf-purple-l-40` on `:root` in unlayered CSS
- **THEN** every light-scheme `Accordion` with `color="purple"` picks up the new fill

### Requirement: Accordion appearance and interaction states

`Accordion`'s summary SHALL carry the same raised treatment as `Button`: `padding-block: 8px`, `padding-inline: 16px`, `border-radius: 8px`, no border, a fill of `--nf-accordion-color`, text in `--nf-accordion-accent-color` at `font-weight: 600`, and a `0px 4px 0px` box-shadow in `--nf-accordion-shadow-color`. It SHALL keep the browser's own disclosure marker, which inherits the summary's color, and SHALL show a pointer cursor. On hover, and whenever focus is within it, the summary SHALL translate down by `2px` and reduce its shadow to `0px 2px 0px`; while `:active` it SHALL translate down by `4px` and reduce the shadow to `0px 0px 0px`. While the `<details>` is `[open]` the summary SHALL hold that pressed appearance — down `4px` with no shadow — regardless of hover, so an open panel reads as a button that stays pressed, and SHALL return to the raised resting appearance when the panel closes. The sum of the translation and the shadow depth SHALL stay constant across every state, so the summary's bottom edge does not move. On `:focus-visible` the summary SHALL additionally draw a `2px` solid outline in `--nf-accordion-accent-color` — the text color, not the shadow color — inset by its own width so it reads as a border on the summary rather than a ring around it.

The content `<div>` SHALL carry the same `padding-block: 8px` and `padding-inline: 16px`, the same fill and the same text color as the summary, and no shadow of its own. Every property that changes between the states SHALL animate over `0.15s` with an `ease-in-out` timing function, except when the user has requested reduced motion, in which case each state SHALL be reached instantly while still looking exactly as described.

#### Scenario: Resting state is raised

- **WHEN** a reader looks at a closed `Accordion` that is neither hovered nor focused
- **THEN** its summary shows no border and a 4px-deep solid shadow directly beneath it, in the hue of its text but one step lighter than the text under the dark scheme, and the content is not visible

#### Scenario: The summary is semibold

- **WHEN** the computed `font-weight` of an `Accordion`'s summary is inspected
- **THEN** it is `600`, lighter than it was, and the content panel's text keeps whatever weight it inherits from the page

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
- **THEN** a 2px outline in the accent color, matching the summary's text rather than its shadow, is drawn inside the summary's edge, following its corner radius, without changing its size or position, and the summary takes the hover depth while it is closed and stays pressed while it is open

#### Scenario: Padding is the same on both parts

- **WHEN** the summary and the content of an open `Accordion` are measured
- **THEN** both show 8px of padding above and below their text and 16px on each side

#### Scenario: The disclosure marker is the browser's own

- **WHEN** a reader looks at a closed and then an open `Accordion`
- **THEN** the native marker is present in the summary's accent color and turns as the browser turns it, and the component renders no icon of its own

#### Scenario: Reduced motion removes the animation

- **WHEN** the user has `prefers-reduced-motion: reduce` and hovers, presses or opens an `Accordion`
- **THEN** the resting, hover, active and open appearances are unchanged and still give the same feedback, but each one is reached instantly with no animated transition

### Requirement: Callout color resolution

`Callout`'s color SHALL be resolved through exactly five component-scoped custom properties, each spelling the component's full name: `--nf-callout-surface-color` for its background, `--nf-callout-accent-color` for the title, the icon and the body text, `--nf-callout-rule-color` for the separator between title and body, `--nf-callout-shadow-color` for the color of its drop shadow, and `--nf-callout-shadow` for the complete drop-shadow value. Each `data-ui-color` value SHALL set the first four from the palette with `light-dark()`, using the 25%-opacity tier for the surface (`--nf-<hue>-l-40-25` light, `--nf-<hue>-d-50-25` dark), for the rule (`--nf-<hue>-l-80-25` light, `--nf-<hue>-d-30-25` dark) and for the shadow color (`--nf-<hue>-l-70-25` light, `--nf-<hue>-d-80-25` dark), and the opaque palette for the accent (`--nf-<hue>-l-80` light, `--nf-<hue>-d-30` dark). Where any of those four is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of it SHALL fall back to the grey token of the same step and tier. The shadow SHALL be translucent rather than opaque, so the page shows through it the way it shows through the surface, and SHALL read as a darker tint of the panel in each scheme. `--nf-callout-shadow` SHALL be composed once, for every hue and for the default, from `var(--nf-shadow-depth)` and the shadow color, so the depth comes from `shadows.css` and the color follows the scheme. No other palette token SHALL be referenced for the callout's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and a `Callout` with `color="purple"` is inspected
- **THEN** its computed background equals `--nf-purple-l-40-25`, its title, icon and body color equal `--nf-purple-l-80`, its rule color equals `--nf-purple-l-80-25`, and its shadow color equals `--nf-purple-l-70-25`

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Callout` is inspected
- **THEN** its computed background equals `--nf-purple-d-50-25`, its title, icon and body color equal `--nf-purple-d-30`, its rule color equals `--nf-purple-d-30-25`, and its shadow color equals `--nf-purple-d-80-25`

#### Scenario: Shadow pairs with the surface step

- **WHEN** a `Callout`'s surface and shadow steps are compared in each scheme
- **THEN** a light panel's `l-40` surface is shadowed with `l-70`, and a dark panel's `d-50` surface is shadowed with `d-80`, both at 25% alpha

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

- **WHEN** a consumer loads `colors/index.css`, `spacings.css` and `borders.css` individually — not `tokens.css`, which would bring the shadows with it — and renders a `Callout`
- **THEN** the panel renders with its surface, accent, rule, padding and corners intact but draws no drop shadow, because `--nf-shadow-depth` is undefined

#### Scenario: The shadow follows the scheme

- **WHEN** the same `Callout` is inspected in a light subtree and in a subtree pinned with `color-scheme: only dark`
- **THEN** its shadow is `0px 4px 0px` in each subtree's own 25%-opacity shadow color, not a single fixed color

#### Scenario: The shadow is translucent

- **WHEN** a `Callout` is placed so that its shadow falls over page content
- **THEN** that content stays visible through the shadow, because the shadow color carries 25% alpha

### Requirement: Grey palette ramp

The palette SHALL include a ninth hue, `grey`, that reads as a near-neutral greyscale. Its two scales SHALL share a hue angle of `277.51` and a chroma that rises with the step through the main range — `0, 0.0022, 0.0044, 0.0077, 0.0099, 0.0122, 0.0144, 0.0177, 0.0199, 0.0221` for steps `10` through `100` — so the lightest greys are exactly neutral and the darkest carry a faint cool cast. The dark scale's lightness SHALL run `0.98, 0.93, 0.88, 0.83, 0.78, 0.70, 0.61, 0.51, 0.40, 0.2882` and the light scale's `0.92, 0.85, 0.78, 0.71, 0.64, 0.57, 0.50, 0.43, 0.36, 0.2882`, so both scales descend monotonically from light to dark like every other hue. `--nf-grey-d-10` SHALL be `oklch(0.98 0 277.51)`, the OKLCH rounding of `#f9f9f9`, and `--nf-grey-d-100` and `--nf-grey-l-100` SHALL both be `oklch(0.2882 0.0221 277.51)`, which is `#282A36` exactly rather than a rounding of it — the two anchors of the greyscale's main range.

Below that anchor, both scales SHALL continue with steps `110` through `200`, identical on the two scales: lightness `0.27, 0.25, 0.23, 0.21, 0.19, 0.17, 0.15, 0.13, 0.11, 0.09` and chroma `0.021, 0.0199, 0.0188, 0.0177, 0.0166, 0.0155, 0.0144, 0.0133, 0.0122, 0.0111`, at the same hue angle `277.51`. Chroma SHALL therefore peak at the `#282A36` anchor and taper on either side of it. The extension SHALL keep descending monotonically, SHALL end at a near-black rather than pure black, and SHALL let the cool cast fade as the color darkens.

Grey SHALL receive the same 25%-opacity tier and the same shadow tokens as every other hue, at every one of its steps, and SHALL NOT receive any component rule, token name or default treatment the other hues do not have.

#### Scenario: Grey is a neutral, not a tinted hue

- **WHEN** a reader compares a swatch of `--nf-grey-l-50` against `--nf-blue-l-50` at the same step
- **THEN** the grey swatch reads as grey, with no identifiable hue, while the blue is plainly blue

#### Scenario: The dark anchor is exact

- **WHEN** `--nf-grey-d-100` and `--nf-grey-l-100` are rendered as swatches and sampled with a color picker
- **THEN** both read `#282A36` with no channel off by even one 8-bit step, because the token is the full-precision OKLCH of that color rather than a two-decimal rounding of it

#### Scenario: The anchors land where specified

- **WHEN** `--nf-grey-d-10` and `--nf-grey-l-100` are rendered as swatches and sampled
- **THEN** the first is the near-white `#f9f9f9` to within one 8-bit channel step, the difference coming from that step's two-decimal lightness, and the second is the dark `#282A36` with no channel off at all

#### Scenario: Both grey scales descend without a flat run

- **WHEN** a reader looks at either grey scale rendered as twenty swatches in step order, `10` through `200`
- **THEN** each swatch is visibly darker than the one before it, with no pair that reads as the same color

#### Scenario: The extension continues from the shared anchor

- **WHEN** a consumer reads `--nf-grey-d-110` and `--nf-grey-l-110`
- **THEN** both are `oklch(0.27 0.021 277.51)`, a step darker than `--nf-grey-d-100` and `--nf-grey-l-100`

#### Scenario: The darkest grey is near-black, not black

- **WHEN** `--nf-grey-d-200` is rendered as a swatch next to `#000`
- **THEN** it is `oklch(0.09 0.0111 277.51)` and still reads as a separate, very dark grey

#### Scenario: The two scales share everything from the anchor down

- **WHEN** the declarations for steps `100` through `200` in `colors-dark.css` and `colors-light.css` are compared token by token
- **THEN** each `--nf-grey-d-<step>` has the identical OKLCH value to the `--nf-grey-l-<step>` of the same step, opaque and 25% tiers alike

#### Scenario: Extended steps behave like any other step

- **WHEN** a consumer uses `--nf-grey-d-150-25` as a background and `var(--nf-shadow-grey-d-180)` as a box-shadow
- **THEN** both resolve, exactly as `--nf-grey-d-50-25` and `--nf-shadow-grey-d-80` do

#### Scenario: Grey behaves like any other hue

- **WHEN** a consumer uses `--nf-grey-l-40-25` as a background and `var(--nf-shadow-grey-l-70)` as a box-shadow
- **THEN** both resolve, exactly as the equivalent tokens do for `purple`
