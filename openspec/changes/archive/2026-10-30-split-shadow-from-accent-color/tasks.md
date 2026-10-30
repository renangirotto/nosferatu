# Tasks

## 1. Button

- [x] 1.1 In `packages/ui/src/components/Button.astro`, add `--nf-button-shadow-color` to each of the nine `&[data-ui-color="<hue>"]` blocks, set to `light-dark(var(--nf-<hue>-l-80), var(--nf-<hue>-d-80))`, declared after `--nf-button-accent-color`; verify by grepping the file for `shadow-color` and counting nine matches, one per hue, in the same alphabetical order as the existing blocks
- [x] 1.2 Point the `box-shadow` declaration at `var(--nf-button-shadow-color, light-dark(var(--nf-grey-l-80), var(--nf-grey-d-80)))`, leaving the `0px var(--nf-button-depth) 0px` offsets untouched; verify the `color` and `:focus-visible` outline still read `--nf-button-accent-color` with the `--nf-grey-l-80`/`--nf-grey-d-90` fallback, so only the shadow moved
- [x] 1.5 Change the `.nf-button` `font-weight` from `700` to `600`, matching `Accordion`'s summary; verify the computed style in devtools reads `600` and that a `Button` and an `Accordion` summary side by side render at the same weight
- [x] 1.3 Run `pnpm format` and `pnpm lint`; verify both exit zero and that `packages/ui/src/components/Button.astro` is still tab-indented with the custom properties declared above the ordinary properties in every rule
- [x] 1.4 Update the theming section of `docs/src/content/docs/components/button.mdx` to list three properties, add `--nf-button-shadow-color` to both the live demo's inline style and the copied snippet beside it, and reword the appearance prose at line ~56 so the shadow is no longer described as "the same accent color as its text"; verify the rendered page's demo button shows a shadow in the third color and the snippet matches what the demo actually sets

## 2. Accordion

- [x] 2.1 In `packages/ui/src/components/Accordion.astro`, add `--nf-accordion-shadow-color` to each of the nine `&[data-ui-color="<hue>"]` blocks as `light-dark(var(--nf-<hue>-l-80), var(--nf-<hue>-d-80))`; verify nine matches in alphabetical order
- [x] 2.2 Point the `.nf-accordion-summary` `box-shadow` at `var(--nf-accordion-shadow-color, light-dark(var(--nf-grey-l-80), var(--nf-grey-d-80)))`, leaving the summary text, the content text and the `:focus-visible` outline on `--nf-accordion-accent-color`; verify by inspecting an open and a closed accordion in the browser that the marker and both text blocks still match the label color while the shadow does not
- [x] 2.3 Change the `.nf-accordion-summary` `font-weight` from `700` to `600`; verify the computed style in devtools reads `600` and the content `<div>` is unaffected
- [x] 2.4 Run `pnpm format` and `pnpm lint`; verify both exit zero
- [x] 2.5 Update `docs/src/content/docs/components/accordion.mdx`: three properties in the theming section at line ~185 with `--nf-accordion-shadow-color` added to the demo's inline style, the copied snippet and the surrounding prose, and reword the appearance paragraph at line ~98 that currently says the shadow is "in the same accent color as its text"; verify the demo and the snippet agree

## 3. Callout

- [x] 3.1 In `packages/ui/src/components/Callout.astro`, change the dark half of `--nf-callout-shadow-color` from `var(--nf-<hue>-d-90-25)` to `var(--nf-<hue>-d-80-25)` in all nine hue blocks and in the default `var()` fallback on `--nf-callout-shadow`; verify `grep -c 'd-90-25' packages/ui/src/components/Callout.astro` returns zero and that the light `l-70-25` values are untouched
- [x] 3.2 Update the comment above `--nf-callout-shadow` that describes the color as "one step below the surface in each scheme" so it matches the new dark pairing; verify the comment names the same steps the code now uses
- [x] 3.3 Run `pnpm format` and `pnpm lint`; verify both exit zero
- [x] 3.4 Check `docs/src/content/docs/components/callout.mdx` for any prose or table naming the `d-90-25` shadow step and correct it to `d-80-25`; verify by grepping the page for `d-90` and finding no stale reference

## 4. Palette spec and documentation

- [x] 4.1 Confirm `packages/ui/src/styles/colors/colors-dark.css` and `colors-light.css` already match the `Grey palette ramp` requirement's number lists exactly — hue `277.51` on all forty grey tokens per file, the chroma ladder peaking at `0.0221`, and `oklch(0.2882 0.0221 277.51)` at step `100` on both scales; verify with a grep that no `--nf-grey-*` declaration still carries `277.5 ` or a pre-scale chroma such as `0.018`
- [x] 4.2 Verify steps `100` through `200` are byte-identical between the two files, opaque and 25% tiers alike, by diffing the two grey blocks with the scale letter normalised away; verify the diff is empty from step `100` down
- [x] 4.3 Rewrite the grey section of `docs/src/content/docs/styles.mdx`: the step table at lines ~262–282 takes the new lightness, chroma and hex columns (`d-100`/`l-100` both `#282A36`), the prose at line ~284 takes hue `277.51` and the `0` → `0.0221` chroma climb with its taper below the anchor, and the paragraph at line ~286 takes the new `0.021` → `0.0111` chroma ladder; verify every number on the page matches the requirement's lists with no leftover `277.5` or `0.02`
- [x] 4.4 Update the two callouts at lines ~288–289 of the same page so the `#282A36` anchor is described as exact rather than as a rounding, keeping the existing note that `grey-d-100` and `grey-l-100` resolve identically; verify the page no longer claims the anchor is approximate

## 5. Verification

- [x] 5.1 Run `pnpm build`; verify it exits zero and the docs site builds with no unresolved token or import error
- [x] 5.2 Run `pnpm --filter docs check`; verify zero errors, confirming no component page passes a prop that no longer type-checks
- [x] 5.3 Run `pnpm format:check` and `pnpm lint`; verify both exit zero
- [x] 5.4 Open the built docs in a browser in dark mode and walk the Button, Accordion and Callout pages across all nine hues plus the default; verify every shadow reads one step lighter than its text, the accordion summary reads semibold, no focus outline changed color, and each component's bottom edge still holds still through hover and active
- [x] 5.5 Switch the same pages to light mode; verify nothing changed from before this work except the accordion summary's weight — shadows still match their text color exactly
- [x] 5.6 Open the palette page and sample `--nf-grey-d-100` and `--nf-grey-l-100` with a color picker; verify both read `#282A36` exactly and that the twenty swatches of each scale still step visibly darker with no flat pair
- [x] 5.7 Run `pnpm pack:check` only if `packages/ui/package.json` or the published file set changed in this work; verify the tarball still lists exactly `src/components`, `src/layouts`, `src/types`, `src/styles`, `package.json`, `README.md` and `LICENSE`
