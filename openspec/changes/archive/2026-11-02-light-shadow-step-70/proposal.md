# Proposal

## Why

In the light scheme, `Button` and `Accordion` draw their raised shadow in `--nf-<hue>-l-80`, the same token as their text, so the shadow and the label share a color. Moving the light shadow one step lighter, to `--nf-<hue>-l-70`, softens the depth and mirrors the dark scheme, where the shadow (`d-80`) is already one step away from the text (`d-90`).

## What Changes

- `Button`: the light-scheme value of `--nf-button-shadow-color` becomes `--nf-<hue>-l-70` for every `data-ui-color` hue, and the default (no `color`) falls back to `--nf-grey-l-70`.
- `Accordion`: the light-scheme value of `--nf-accordion-shadow-color` becomes `--nf-<hue>-l-70` for every hue, and the default falls back to `--nf-grey-l-70`.
- Dark-scheme values, the accent/text color (`l-80`), the fill, the rule, and the shadow geometry (`0px 4px 0px` and the hover/active depths) stay as they are.
- The specs no longer say "accent and shadow resolve to the same value under the light scheme". In both schemes, the shadow is now one step lighter than the text.

**Consumer-visible:** yes. This is published CSS, and every light-scheme `Button` and `Accordion` renders a lighter shadow. It is a visual change only. No prop, class, custom-property name or export changes, and consumer overrides of `--nf-button-shadow-color` / `--nf-accordion-shadow-color` keep working unchanged. It ships as a minor/visual change, not **BREAKING** to the API.

## Non-goals

- Changing `Callout`'s shadow, which already uses its own `l-70-25` translucent tier.
- Changing any dark-scheme value or the accent/text color.
- Introducing a shared shadow-color token or changing `shadows.css`.
- Updating the docs theming examples, which already set `--nf-*-shadow-color: var(--nf-blue-l-70)` as consumer overrides and do not describe the defaults.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `library-styles`: the "Button color resolution" and "Accordion color resolution" requirements change the light-scheme shadow token from `l-80` to `l-70`. The "Button appearance and interaction states" resting-state scenario no longer says the light shadow matches the text color.

## Impact

- `packages/ui/src/components/Button.astro`: the fallback in `box-shadow` and the nine `data-ui-color` blocks (shadow line only).
- `packages/ui/src/components/Accordion.astro`: the fallback in `box-shadow` and the nine `data-ui-color` blocks (shadow line only).
- `openspec/specs/library-styles/spec.md`: three requirements, through the delta.
- No dependency, export or tarball change.
