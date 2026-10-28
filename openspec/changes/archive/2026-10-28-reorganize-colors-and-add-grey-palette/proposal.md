# Proposal

## Why

`colors.css` is a single 337-line file that interleaves four unrelated axes — hue, dark/light scale, step, and opacity tier — so finding or reviewing one scale means scrolling past the other. Splitting the palette by scale, and grouping the opaque tier apart from the 25% tier, makes each file readable on its own and gives the palette a folder it can grow into. The library also has no neutral: every surface, rule and body color a consumer builds has to borrow a chromatic hue or come from outside the library, which is the gap a `grey` palette fills.

## What Changes

- **BREAKING** — `packages/ui/src/styles/colors.css` is removed and replaced by a `styles/colors/` folder. The public import path `astro-nosferatu/styles/colors.css` stops resolving; `astro-nosferatu/styles/colors/index.css` replaces it. Consumers importing the palette on its own must update that one line. Consumers importing `astro-nosferatu/styles/index.css` are unaffected.
- The palette is split by scale alias: `colors/colors-dark.css` holds every `-d-` token and `colors/colors-light.css` every `-l-` token. `colors/index.css` imports both and is what `styles/index.css` places into the `nosferatu.colors` layer.
- Inside each file, a hue's opaque steps 10–100 are listed as one block, followed by that hue's 25%-opacity steps 10–100 as a second block — the two tiers are no longer interleaved. Hues stay alphabetical.
- **BREAKING (additive)** — a ninth hue, `grey`, joins the palette: a near-neutral greyscale with a faint `277.5` cast, bounded by `#f9f9f9` at `grey-d-10` and `#282A36` at `grey-d-100` and `grey-l-100`. Palette tokens go from 320 to 360.
- `shadows.css` gains the 20 matching `--nf-shadow-grey-*` tokens, keeping one shadow per opaque palette color (161 → 181 properties).
- `ColorPalette` gains `"grey"`, so `Button` and `Callout` accept `color="grey"`. Neither component's color-resolution rules change — grey resolves through the same steps as every other hue.
- Docs: the styles page documents the new paths, the folder split and the grey ramp; the `Button` and `Callout` pages gain grey in their color demos and prop tables.

## Non-goals

- No semantic color tokens. `grey` is a palette hue like the other eight; nothing named `--nf-color-*`, `--nf-surface-*` or `--nf-neutral-*` is introduced.
- No change to the cascade layer names or their order, and no change to how `styles/index.css` layers anything other than the colors import path.
- No change to the OKLCH values of the eight existing hues, or to any `Button`/`Callout` step mapping.
- No re-export shim at `styles/colors.css`. The old path is gone, not deprecated.
- No build step, bundler, or token-generation script. The CSS stays hand-written source.
- No grey-specific component styling, no default "neutral" variant, and no change to which hue a component defaults to (`purple` stays).

## Capabilities

### New Capabilities

None. The change extends existing capabilities rather than introducing a new one.

### Modified Capabilities

- `library-styles`: the exported-stylesheet list and the independent-import scenarios change to the `colors/` folder; the "Color palette" requirement grows to nine hues and gains the file-split and tier-grouping rules; "Shadow tokens" counts change; `Button` and `Callout` color APIs and the `ColorPalette` type gain `grey`.
- `library-package`: the public import-path requirement is widened so a stylesheet may live in a subdirectory under `styles/`, and the tarball-contents scenario covers the new folder.

## Impact

- `packages/ui/src/styles/colors.css` — deleted.
- `packages/ui/src/styles/colors/colors-dark.css`, `colors/colors-light.css`, `colors/index.css` — new.
- `packages/ui/src/styles/index.css` — the colors import points at the folder.
- `packages/ui/src/styles/shadows.css` — 20 grey tokens inserted between `green` and `orange`.
- `packages/ui/src/types/components.ts` — `ColorPalette` gains `"grey"`.
- `packages/ui/src/components/Button.astro`, `Callout.astro` — a `data-ui-color="grey"` rule each.
- `docs/src/content/docs/styles.mdx`, `components/button.mdx`, `components/callout.mdx` — updated.
- Consumer API: one removed import path, one added hue. Warrants a major version bump.
