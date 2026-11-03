# Spec Delta

## MODIFIED Requirements

### Requirement: Button color resolution

`Button`'s color SHALL be resolved through exactly three component-scoped custom properties: `--nf-button-color`, which supplies the background, `--nf-button-accent-color`, which supplies the text color and the focus outline color, and `--nf-button-shadow-color`, which supplies the box-shadow color alone. Each `data-ui-color` value SHALL set all three from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-button-color`, `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-button-accent-color`, and `--nf-<hue>-l-70` (light) and `--nf-<hue>-d-80` (dark) for `--nf-button-shadow-color`. Where a property is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of it SHALL fall back to the grey token of the same step in the same scheme (`--nf-grey-l-40`/`--nf-grey-d-50`, `--nf-grey-l-80`/`--nf-grey-d-90` and `--nf-grey-l-70`/`--nf-grey-d-80`). The shadow SHALL therefore be one step lighter than the text in both schemes: `l-70` against `l-80` in light, and `d-80` against `d-90` in dark. No other palette token SHALL be referenced for the button's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and a `Button` with `color="purple"` is inspected
- **THEN** its computed background equals the value of `--nf-purple-l-40`, its computed color equals the value of `--nf-purple-l-80`, and its box-shadow color equals `--nf-purple-l-70`, which is a visibly lighter purple than the text

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Button` is inspected
- **THEN** its computed background equals `--nf-purple-d-50`, its color equals `--nf-purple-d-90`, and its box-shadow color equals `--nf-purple-d-80`, which is a visibly lighter purple than the text

#### Scenario: Default appearance

- **WHEN** a `Button` with no `color` is inspected in a light and then a dark color scheme
- **THEN** its background equals `--nf-grey-l-40` and its color `--nf-grey-l-80` and its box-shadow color `--nf-grey-l-70` in light, and `--nf-grey-d-50`, `--nf-grey-d-90` and `--nf-grey-d-80` respectively in dark

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
- **THEN** it shows no border and a 4px-deep solid shadow directly beneath it, in the hue of its text but one step lighter than the text under both the light and the dark scheme

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

`Accordion`'s color SHALL be resolved through exactly four component-scoped custom properties: `--nf-accordion-color`, which fills both the summary and the content panel, `--nf-accordion-accent-color`, which supplies the summary's text and disclosure icon, the content's text and the summary's focus outline, `--nf-accordion-shadow-color`, which supplies the color of the `<details>`' box-shadow alone, and `--nf-accordion-rule-color`, which supplies the rule under the summary of an open accordion alone. Each `data-ui-color` value SHALL set all four from the palette with `light-dark()`, using `--nf-<hue>-l-40` (light) and `--nf-<hue>-d-50` (dark) for `--nf-accordion-color`, `--nf-<hue>-l-80` (light) and `--nf-<hue>-d-90` (dark) for `--nf-accordion-accent-color`, `--nf-<hue>-l-70` (light) and `--nf-<hue>-d-80` (dark) for `--nf-accordion-shadow-color`, and the 25%-opacity tier `--nf-<hue>-l-60-25` (light) and `--nf-<hue>-d-70-25` (dark) for `--nf-accordion-rule-color`. Where a property is not defined for the element — no `data-ui-color` and no value inherited from an ancestor — every use of it SHALL fall back to the grey token of the same step and tier in the same scheme. The shadow SHALL therefore be one step lighter than the text in both schemes: `l-70` against `l-80` in light, and `d-80` against `d-90` in dark. No other palette token SHALL be referenced for the accordion's own colors, and no semantic color token SHALL be introduced.

#### Scenario: Light appearance

- **WHEN** the page resolves to a light color scheme and an open `Accordion` with `color="purple"` is inspected
- **THEN** the computed background of both its summary and its content equals the value of `--nf-purple-l-40`, their computed color equals the value of `--nf-purple-l-80`, the accordion's box-shadow color equals `--nf-purple-l-70`, which is a visibly lighter purple than the text, and the summary's bottom rule equals `--nf-purple-l-60-25`

#### Scenario: Dark appearance

- **WHEN** the page resolves to a dark color scheme and the same `Accordion` is inspected
- **THEN** both backgrounds equal `--nf-purple-d-50`, the text of the summary and of the content equals `--nf-purple-d-90`, the accordion's box-shadow color equals `--nf-purple-d-80`, and the summary's bottom rule equals `--nf-purple-d-70-25`

#### Scenario: Default appearance

- **WHEN** an open `Accordion` with no `color` is inspected in a light and then a dark color scheme
- **THEN** both backgrounds equal `--nf-grey-l-40`, the text `--nf-grey-l-80`, the box-shadow color `--nf-grey-l-70` and the rule `--nf-grey-l-60-25` in light, and `--nf-grey-d-50`, `--nf-grey-d-90`, `--nf-grey-d-80` and `--nf-grey-d-70-25` respectively in dark

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
