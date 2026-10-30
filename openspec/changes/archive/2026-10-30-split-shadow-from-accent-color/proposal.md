# Proposal

## Why

`Button` and `Accordion` resolve their text, their drop shadow and their focus outline from a single custom property, `--nf-<component>-accent-color`. That made the shadow a copy of the text color, which is too heavy under the dark scheme's bright fills: the raised edge reads as a second block of text rather than as depth. The two roles need to move independently, which `Callout` already allows through its separate `--nf-callout-shadow-color`.

Separately, the grey palette's anchor was wrong and has already been corrected in `colors-dark.css` and `colors-light.css`: `--nf-grey-d-100`/`--nf-grey-l-100` were `oklch(0.29 0.02 277.5)`, which renders `#292B35` — one 8-bit step off on all three channels from the `#282A36` the greyscale is supposed to be anchored on. The corrected `oklch(0.2882 0.0221 277.51)` renders `#282A36` exactly, and the rest of the ramp was rescaled to flow through it. The spec and the docs still describe the old numbers, so they must catch up.

## What Changes

- **BREAKING** `Button` gains a third component-scoped property, `--nf-button-shadow-color`, which supplies its box-shadow color. `--nf-button-accent-color` keeps the text color and the focus outline only. Under the dark scheme the shadow moves from `--nf-<hue>-d-90` to `--nf-<hue>-d-80`; the text stays on `--nf-<hue>-d-90`.
- **BREAKING** `Accordion` gains `--nf-accordion-shadow-color` on the same terms: summary box-shadow on `--nf-<hue>-d-80` in dark, text, marker and focus outline still on `--nf-<hue>-d-90`.
- **BREAKING** `Callout`'s dark shadow step moves from `--nf-<hue>-d-90-25` to `--nf-<hue>-d-80-25`. Its property set is unchanged — `--nf-callout-shadow-color` already exists — and its surface, accent and rule steps are untouched.
- **BREAKING** `Accordion`'s summary and `Button`'s label both drop from `font-weight: 700` to `600`. The two stay on the same weight, because `Accordion`'s summary is specified as carrying `Button`'s treatment.
- The light scheme is untouched for all three components: `Button` and `Accordion` keep `--nf-<hue>-l-80` for both text and shadow, and `Callout` keeps `--nf-<hue>-l-70-25`. The new properties exist in both schemes, so a consumer can retune the shadow in light too; only the library's own default is unchanged there.
- **BREAKING** The grey palette ramp is re-anchored on `oklch(0.2882 0.0221 277.51)` at step `100`, the exact OKLCH of `#282A36`. Every grey step takes hue `277.51` and a chroma scaled by the same factor the anchor moved (`×1.105`), so the ramp still rises to a peak at the anchor and tapers below it. Both scales' lightness ladders are unchanged, and steps `100`–`200` stay identical across the two scales. This is already applied in the source; this change brings the spec and the docs in line with it.
- The palette documentation's grey table, its hue/chroma prose and its two anchor callouts are corrected to the new numbers, and the component pages stop describing the shadow as "the same accent color as its text".

All of it is consumer-visible. A consuming project that upgrades sees different dark-scheme shadows on all three components, lighter label text on buttons and accordion summaries, and slightly different greys at every step. A consumer who set `--nf-button-accent-color` or `--nf-accordion-accent-color` to theme a component loses control of that component's shadow, which now needs the new property as well — that is the breaking part of the API, and it warrants a major version bump.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `library-styles`: `Button color resolution`, `Button appearance and interaction states`, `Accordion color resolution`, `Accordion appearance and interaction states`, `Callout color resolution` and `Grey palette ramp` all change. The first four gain the shadow/accent split and the accordion's new summary weight; `Callout color resolution` changes one step; `Grey palette ramp` restates the anchor, the hue angle and the chroma ladder.

## Impact

- `packages/ui/src/components/Button.astro` — new `--nf-button-shadow-color`, declared per hue and read by `box-shadow`, plus `font-weight: 600` on the label.
- `packages/ui/src/components/Accordion.astro` — new `--nf-accordion-shadow-color`, plus `font-weight: 600` on the summary.
- `packages/ui/src/components/Callout.astro` — nine dark shadow-color values plus the default.
- `packages/ui/src/styles/colors/colors-dark.css` and `colors-light.css` — already edited; this change only makes the spec match them.
- `docs/src/content/docs/styles.mdx` — the grey section's table, prose and callouts.
- `docs/src/content/docs/components/button.mdx`, `accordion.mdx`, `callout.mdx` — the theming sections now list three properties for `Button` and `Accordion`, and the appearance prose stops equating shadow with text color.
- No change to package exports, the published file set, the layer order, the token naming scheme or the `ColorPalette` type. No new token is added to any stylesheet: the split is resolved entirely inside the components, out of palette steps that already exist.

## Non-goals

- Changing the light scheme's shadow steps. The split makes that possible, but the library's light defaults stay exactly as they are.
- Changing `Callout`'s surface, accent or rule steps, or any of its other properties.
- Touching the eight non-grey hues. Their OKLCH values stay as exported by Harmonizer.
- Adding a `--nf-shadow-*` token, a semantic color token, or any new palette step. The components compose their shadow from `--nf-shadow-depth` and an existing palette color, as `Callout` already does.
- Changing the shadow's geometry. It stays `0px 4px 0px` with the same hover, active and open depths, and the same constant travel-plus-depth sum.
- Re-deriving the grey lightness ladders. Only hue and chroma move; the `L` values at every step other than `100` are unchanged.
