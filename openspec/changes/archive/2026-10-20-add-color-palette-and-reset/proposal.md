# Proposal

## Why

The library's colors are a handful of hand-picked semantic hex values in `tokens.css`, and its reset is a minimal starter. We now have a harmonized OKLCH palette (Harmonizer export, `harmonized-palette(2).css`) with matching light and dark scales, and a more complete reset already proven in `pagina-nove`. Moving to both gives the library a real color system and better defaults, and splitting colors into their own file and layer makes the stylesheet structure clearer.

## What Changes

- Replace `reset.css` with the content of `pagina-nove/src/styles/reset.css` (adds `interpolate-size`, `100dvh` body, body container query context, `text-wrap: pretty/balance`, `#root` isolation).
- Add `colors.css`: the full palette from `harmonized-palette(2).css` only (purple, cyan, blue, red, orange, yellow, green, pink; steps 10–100), renamed with the `--nf-` prefix (e.g. `--nf-red-l-80`) and sorted alphabetically. `-d-` tokens are the dark-mode scale, `-l-` tokens the light-mode scale.
- **BREAKING** Remove all `--nf-color-*` semantic tokens from `tokens.css`. No semantic color layer replaces them: `base.css`, `typography.css`, `Button.astro` and the docs reference palette tokens directly.
- Update `index.css` layers: tokens and colors move into their own cascade layers ahead of reset/base/typography, and `colors.css` is imported.
- Remove declarations from `base.css` that the new reset now owns (`min-height`, font smoothing), so `100vh` doesn't override the reset's `100dvh`.
- Update the docs (`styles.mdx`, `components/button.mdx`) and `packages/ui/README.md` for the new file, layers, palette tokens and theming examples.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `library-styles`: exported stylesheet list gains `colors.css`; cascade layer order adds `nosferatu.tokens` and `nosferatu.colors`; new requirements for the color palette (naming, ordering, light/dark scales, no semantic color tokens) and the reset content; the re-theme scenario now overrides a palette token.

## Impact

- Code: `packages/ui/src/styles/{tokens,colors,reset,base,typography,index}.css`, `packages/ui/src/components/Button.astro`.
- Docs: `docs/src/content/docs/styles.mdx`, `docs/src/content/docs/components/button.mdx`, `packages/ui/README.md`.
- Consumers: anyone setting or reading `--nf-color-*` must switch to palette tokens. No package export changes (`./styles/*` already covers `colors.css`).
- Visual: colors shift to the palette's nearest steps; no dark-mode switching is added in this change.
