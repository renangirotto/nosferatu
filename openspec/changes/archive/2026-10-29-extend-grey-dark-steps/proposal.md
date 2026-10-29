# Proposal

## Why

The grey ramp stops at `--nf-grey-d-100` / `--nf-grey-l-100` (`#282A36`, lightness `0.29`). That is too light for deep dark-mode surfaces such as page backgrounds behind raised panels, wells and overlays, so anyone who needs a darker neutral has to hand-roll one outside the palette.

## What Changes

- Add ten darker steps, `110` to `200` in tens, to **both** grey scales (`--nf-grey-d-110 … --nf-grey-d-200` and `--nf-grey-l-110 … --nf-grey-l-200`), continuing the ramp below the shared `0.29` anchor down to a near-black `0.09`.
- Give each new step the same siblings every palette color has: a 25%-opacity token (`--nf-grey-<d|l>-<step>-25`) and a shadow token (`--nf-shadow-grey-<d|l>-<step>`).
- Only `grey` gets the extension. The other eight hues keep steps `10`–`100`.
- Update the palette, shadow-token and grey-ramp requirements in `library-styles` (token counts go from 360 to 400 palette tokens and from 181 to 201 shadow tokens).
- Extend the grey section of the docs Styles page with the new swatches and ramp rows.

**Consumer-visible:** yes, additive only. New custom properties appear in the published `colors-dark.css`, `colors-light.css` and `shadows.css`. No existing token is renamed, removed or changes value, so this is **not** breaking.

## Non-goals

- No extended steps for `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` or `yellow`.
- No change to any existing grey value, including the `#f9f9f9` and `#282A36` anchors.
- No semantic alias (`--nf-surface-*`, `--nf-neutral-*`, `--nf-color-*`) for the new dark steps.
- No component or library stylesheet starts using the new steps in this change. Re-pointing the docs dark theme (`theme-docs-with-palette`) at a darker step is left to that change.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `library-styles`: the color palette, shadow token and grey palette ramp requirements gain grey steps `110`–`200`.

## Impact

- `packages/ui/src/styles/colors/colors-dark.css`: 20 new declarations in the grey block (10 opaque, 10 at 25%).
- `packages/ui/src/styles/colors/colors-light.css`: the same 20 for the `-l-` scale.
- `packages/ui/src/styles/shadows.css`: 20 new `--nf-shadow-grey-*` tokens.
- `docs/src/content/docs/styles.mdx`: grey swatches, ramp table and step description.
- No change to package exports, layers, components or dependencies.
