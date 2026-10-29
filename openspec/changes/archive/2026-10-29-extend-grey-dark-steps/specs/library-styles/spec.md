# Spec Delta

## MODIFIED Requirements

### Requirement: Color palette
The palette SHALL define, on `:root`, the hues `blue`, `cyan`, `green`, `grey`, `orange`, `pink`, `purple`, `red` and `yellow`, each with a dark scale (`-d-`) and a light scale (`-l-`) of steps `10` to `100` in tens, plus a 25%-opacity sibling for each of those tokens. `grey` SHALL additionally define steps `110` to `200` in tens on both scales, as given in the grey palette requirement; no other hue SHALL define a step above `100`. The eight hues other than `grey` SHALL keep the OKLCH values of the Harmonizer export `harmonized-palette(2).css` unchanged; `grey` SHALL follow the ramp given in the grey palette requirement. Each token SHALL be named `--nf-<hue>-<d|l>-<step>` or `--nf-<hue>-<d|l>-<step>-25`. Tokens SHALL be ordered by hue name alphabetically, then within each file by ascending step, with the opaque tier written before the 25% tier. `-d-` tokens are the dark-mode scale and `-l-` tokens the light-mode scale.

#### Scenario: Palette is complete and prefixed
- **WHEN** the custom properties declared across `colors-dark.css` and `colors-light.css` are listed together
- **THEN** there are 400 of them (9 hues × 2 scales × 10 steps × 2 opacity tiers, plus grey's 2 scales × 10 extra steps × 2 opacity tiers), every name matches `--nf-<hue>-<d|l>-<step>` or that name plus `-25`, and each opaque token of the eight pre-existing hues equals the export's value for the same unprefixed name

#### Scenario: Only grey goes past step 100
- **WHEN** the palette files are searched for a step above `100`
- **THEN** every match is a `--nf-grey-*` token, and `--nf-blue-d-110` and its counterparts for the other seven hues are undefined

#### Scenario: Alphabetical order
- **WHEN** the declarations in `colors-dark.css` are read top to bottom
- **THEN** the hues appear in the order `blue, cyan, green, grey, orange, pink, purple, red, yellow`, and the same order holds in `colors-light.css`

#### Scenario: Grey sits between green and orange
- **WHEN** a consumer scans either palette file for the new hue
- **THEN** the `grey` block falls between the `green` block and the `orange` block, because the palette is alphabetical and nothing special-cases the neutral

### Requirement: Shadow tokens
The library SHALL export a stylesheet `shadows.css` that defines, on `:root`, one custom property per palette color, named `--nf-shadow-<hue>-<d|l>-<step>`, whose value is the complete box-shadow `0px 4px 0px var(--nf-<hue>-<d|l>-<step>)` for the color of the same name — 200 properties, in the same hue order as the palette files — plus a single `--nf-shadow-depth` holding the shared offsets `0px 4px 0px` on their own, for a shadow whose color is resolved elsewhere. The values SHALL be written out literally rather than derived through a CSS function, so no `color-mix()`, relative color or custom-function support is required. `shadows.css` SHALL NOT define any other custom property, SHALL NOT contain element selectors, and SHALL NOT declare `box-shadow` on anything itself.

#### Scenario: A shadow token is a complete box-shadow value
- **WHEN** a consumer imports the palette and `shadows.css` and writes `box-shadow: var(--nf-shadow-purple-l-80)` on their own element
- **THEN** the element draws a solid `0px 4px 0px` shadow in the color `--nf-purple-l-80`

#### Scenario: Shadow tokens cover the whole palette
- **WHEN** the custom properties declared in `shadows.css` are listed
- **THEN** there are 201 of them — one for each opaque `--nf-<hue>-<d|l>-<step>` palette token, including grey's steps `110` to `200`, plus `--nf-shadow-depth` — and no token for the 25%-opacity tier

#### Scenario: Grey has shadow tokens like every other hue
- **WHEN** a consumer writes `box-shadow: var(--nf-shadow-grey-d-90)`
- **THEN** the element draws a `0px 4px 0px` shadow in `--nf-grey-d-90`

#### Scenario: Extended grey steps have shadow tokens
- **WHEN** a consumer writes `box-shadow: var(--nf-shadow-grey-l-200)`
- **THEN** the element draws a `0px 4px 0px` shadow in `--nf-grey-l-200`

#### Scenario: The depth token carries no color
- **WHEN** a consumer writes `box-shadow: var(--nf-shadow-depth) var(--my-color)`
- **THEN** the element draws the same `0px 4px 0px` shadow in their own color, because `--nf-shadow-depth` holds only the offsets
- **AND** a component whose shadow color changes with the color scheme can use it, which a complete shadow value cannot do: `light-dark()` resolves colors, not whole box-shadow values

#### Scenario: Shadows alone apply nothing
- **WHEN** a consumer imports only `astro-nosferatu/styles/shadows.css`
- **THEN** the `--nf-shadow-*` custom properties are defined, no element selectors are applied, and nothing on the page gains a shadow

#### Scenario: Shadow tokens need the palette
- **WHEN** a consumer imports `shadows.css` without the palette and uses a shadow token
- **THEN** the shadow does not render, because the palette token it references is undefined

### Requirement: Opacity tiers grouped, not interleaved
Within each palette file, a hue's tokens SHALL be written as two consecutive blocks: first every opaque step of that hue in ascending order (`10` through `100`, or `10` through `200` for `grey`), then the 25%-opacity steps in the same ascending order. A translucent token SHALL NOT appear between two opaque tokens. The blocks for one hue SHALL stay together, and hues SHALL remain in alphabetical order.

#### Scenario: Opaque block precedes the translucent block
- **WHEN** the declarations for one hue in `colors-dark.css` are read top to bottom
- **THEN** they appear as `<hue>-d-10 … <hue>-d-100`, then `<hue>-d-10-25 … <hue>-d-100-25`, with no translucent token among the opaque ones

#### Scenario: Grey's extended steps stay inside its blocks
- **WHEN** the grey declarations in `colors-dark.css` are read top to bottom
- **THEN** they appear as `grey-d-10 … grey-d-200`, then `grey-d-10-25 … grey-d-200-25`, and the `orange` block starts only after `grey-d-200-25`

#### Scenario: Grouping does not change any value
- **WHEN** a consumer who previously loaded the single `colors.css` compares every palette token's computed value against the same token loaded from the folder
- **THEN** every value for the eight pre-existing hues is unchanged

### Requirement: Grey palette ramp
The palette SHALL include a ninth hue, `grey`, that reads as a near-neutral greyscale. Its two scales SHALL share a hue angle of `277.5` and a chroma that rises with the step — `0, 0.002, 0.004, 0.007, 0.009, 0.011, 0.013, 0.016, 0.018, 0.02` for steps `10` through `100` — so the lightest greys are exactly neutral and the darkest carry a faint cool cast. The dark scale's lightness SHALL run `0.98, 0.93, 0.88, 0.83, 0.78, 0.70, 0.61, 0.51, 0.40, 0.29` and the light scale's `0.92, 0.85, 0.78, 0.71, 0.64, 0.57, 0.50, 0.43, 0.36, 0.29`, so both scales descend monotonically from light to dark like every other hue. `--nf-grey-d-10` SHALL be `oklch(0.98 0 277.5)`, the two-decimal OKLCH rounding of `#f9f9f9`, and `--nf-grey-d-100` and `--nf-grey-l-100` SHALL both be `oklch(0.29 0.02 277.5)`, the rounding of `#282A36` — the two anchors of the greyscale's main range.

Below that anchor, both scales SHALL continue with steps `110` through `200`, identical on the two scales: lightness `0.27, 0.25, 0.23, 0.21, 0.19, 0.17, 0.15, 0.13, 0.11, 0.09` and chroma `0.019, 0.018, 0.017, 0.016, 0.015, 0.014, 0.013, 0.012, 0.011, 0.01`, at the same hue angle `277.5`. The extension SHALL keep descending monotonically, SHALL end at a near-black rather than pure black, and SHALL let the cool cast fade as the color darkens.

Grey SHALL receive the same 25%-opacity tier and the same shadow tokens as every other hue, at every one of its steps, and SHALL NOT receive any component rule, token name or default treatment the other hues do not have.

#### Scenario: Grey is a neutral, not a tinted hue
- **WHEN** a reader compares a swatch of `--nf-grey-l-50` against `--nf-blue-l-50` at the same step
- **THEN** the grey swatch reads as grey, with no identifiable hue, while the blue is plainly blue

#### Scenario: The anchors land where specified
- **WHEN** `--nf-grey-d-10` and `--nf-grey-l-100` are rendered as swatches and sampled
- **THEN** the first is the near-white `#f9f9f9` and the second the dark `#282A36`, each within one 8-bit channel step of the source color, the difference coming from the palette's two-decimal precision

#### Scenario: Both grey scales descend without a flat run
- **WHEN** a reader looks at either grey scale rendered as twenty swatches in step order, `10` through `200`
- **THEN** each swatch is visibly darker than the one before it, with no pair that reads as the same color

#### Scenario: The extension continues from the shared anchor
- **WHEN** a consumer reads `--nf-grey-d-110` and `--nf-grey-l-110`
- **THEN** both are `oklch(0.27 0.019 277.5)`, a step darker than `--nf-grey-d-100` and `--nf-grey-l-100`

#### Scenario: The darkest grey is near-black, not black
- **WHEN** `--nf-grey-d-200` is rendered as a swatch next to `#000`
- **THEN** it is `oklch(0.09 0.01 277.5)` and still reads as a separate, very dark grey

#### Scenario: Extended steps behave like any other step
- **WHEN** a consumer uses `--nf-grey-d-150-25` as a background and `var(--nf-shadow-grey-d-180)` as a box-shadow
- **THEN** both resolve, exactly as `--nf-grey-d-50-25` and `--nf-shadow-grey-d-80` do

#### Scenario: Grey behaves like any other hue
- **WHEN** a consumer uses `--nf-grey-l-40-25` as a background and `var(--nf-shadow-grey-l-70)` as a box-shadow
- **THEN** both resolve, exactly as the equivalent tokens do for `purple`
