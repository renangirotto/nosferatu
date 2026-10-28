# Tasks

Values for the grey ramp are in [design.md](design.md) — Decision 4. Do not re-derive them.

## 1. Prove the nested import carries its layer

Decision 2 in [design.md](design.md) depends on a nested relative `@import` inheriting the layer of the file that pulled it in. Nothing downstream is worth writing until that holds in this repo's actual toolchain.

- [x] 1.1 Create `packages/ui/src/styles/colors/` and move `colors.css` into it unchanged as a temporary `colors/colors-dark.css` (contents untouched for now), add `colors/index.css` containing only `@import './colors-dark.css';`, and point `styles/index.css` at `@import './colors/index.css' layer(nosferatu.colors);` — verify `pnpm build` completes and `pnpm dev` serves the docs with the palette still applied
- [x] 1.2 In the browser on a `pnpm dev` docs page, confirm a palette token still resolves (a `Button` renders in its hue) and that in DevTools the `:root` palette rule is shown inside the `nosferatu.colors` layer, not unlayered — if it is unlayered, stop and switch to the fallback in design.md's first risk before continuing

## 2. Split the palette by scale and regroup the tiers

- [x] 2.1 Rewrite `colors/colors-dark.css` to hold only the `-d-` tokens of the eight existing hues, as per-hue blocks of ten opaque steps followed by ten `-25` steps, hues alphabetical, tabs, values copied verbatim — verify `grep -c '^\t--nf-' ` reports 160 and `grep -c '\-l\-'` reports 0
- [x] 2.2 Write `colors/colors-light.css` with the `-l-` tokens under the same rules — verify the same two counts (160, and 0 occurrences of `-d-`)
- [x] 2.3 Update `colors/index.css` to import `./colors-dark.css` then `./colors-light.css`, and delete `packages/ui/src/styles/colors.css` — verify the file is gone and that `grep -r "styles/colors.css" packages docs` returns nothing
- [x] 2.4 Diff the sorted list of declared token names across the two new files against the same list from the deleted `colors.css` at the previous commit (`git show HEAD:packages/ui/src/styles/colors.css`) — verify the two sorted lists are identical, catching any token dropped or duplicated by the split
- [x] 2.5 Run `pnpm build` and open the docs styles page — verify every existing swatch renders in the same color as before the split

## 3. Add the grey hue

- [x] 3.1 Insert the `grey` `-d-` blocks (opaque then `-25`) between `green` and `orange` in `colors-dark.css`, using the L/C values from design.md Decision 4 at hue `277.5` — verify the file now declares 180 tokens and that `--nf-grey-d-10` is `oklch(0.98 0 277.5)` and `--nf-grey-d-100` is `oklch(0.29 0.02 277.5)`
- [x] 3.2 Insert the matching `grey` `-l-` blocks in `colors-light.css` — verify 180 tokens and `--nf-grey-l-100: oklch(0.29 0.02 277.5)`
- [x] 3.3 Add the 20 `--nf-shadow-grey-<d|l>-<step>` tokens to `shadows.css` between the `green` and `orange` groups, each `0px 4px 0px var(--nf-grey-…)` — verify `grep -c '^\t--nf-shadow-' packages/ui/src/styles/shadows.css` reports 181
- [x] 3.4 Render the twenty grey steps as swatches on a scratch docs page and look at them — verify each step is visibly darker than the one before on both scales, that steps 10–30 read as neutral rather than blue, and that `grey-d-10` and `grey-l-100` match `#f9f9f9` and `#282A36` to the eye

## 4. Open grey to the components

- [x] 4.1 Add `"grey"` to `ColorPalette` in `packages/ui/src/types/components.ts`, in alphabetical position — verify `pnpm --filter docs check` still passes
- [x] 4.2 Add a `[data-ui-color='grey']` rule to `Button.astro` setting `--nf-button-color` and `--nf-button-accent-color` with `light-dark()` on `grey-l-40`/`grey-d-50` and `grey-l-80`/`grey-d-90`, shaped exactly like the existing hue rules — verify a `<Button color="grey">` on a docs page renders grey, and that its text and shadow share one accent color in both light and dark
- [x] 4.3 Add the matching `[data-ui-color='grey']` rule to `Callout.astro` for the four surface/accent/rule/shadow properties on the same steps the other hues use — verify a `<Callout color="grey">` renders a neutral panel with a visible rule and a translucent shadow in both schemes
- [x] 4.4 Confirm `<Button color="teal">` is still a type error — verify `pnpm --filter docs check` fails on a temporary `.astro` file containing it, then remove that file

## 5. Documentation

- [x] 5.1 Update `docs/src/content/docs/styles.mdx`: the stylesheet table row for the palette now names `colors/index.css`, `colors/colors-dark.css` and `colors/colors-light.css`; the manual-import example uses the new path — verify no occurrence of `styles/colors.css` remains on the page and each shown import is one a consumer can paste
- [x] 5.2 Add a grey section to the styles page showing the two ramps as swatches with their step numbers, naming `#f9f9f9` and `#282A36` as the anchors, and stating plainly that `grey-d-100` and `grey-l-100` are the same color — verify the page renders the swatches and the note is present
- [x] 5.3 Add `grey` to the `color` prop documentation and the color demo grid on `docs/src/content/docs/components/button.mdx` and `callout.mdx` — verify both pages list nine hues and show a live grey example
- [x] 5.4 Add a short migration note on the styles page for consumers moving off `astro-nosferatu/styles/colors.css` — verify it gives the exact replacement line

## 6. Verification

- [x] 6.1 Run `pnpm build` from the repository root — passing means the docs site builds with no unresolved import and no CSS warning about the palette folder
- [x] 6.2 Run `pnpm pack:check` — passing means the file list contains `src/styles/colors/index.css`, `src/styles/colors/colors-dark.css` and `src/styles/colors/colors-light.css`, contains no `src/styles/colors.css`, and is otherwise unchanged
- [x] 6.3 Run `pnpm --filter docs check` — passing means zero errors, with `grey` accepted on both components' `color` prop
- [x] 6.4 With `pnpm dev`, toggle the OS between light and dark on a page holding a grey `Button` and a grey `Callout` — verify both swap scales, stay legible in each, and that the rest of the page's hues are visually unchanged from before this change
- [x] 6.5 In a scratch docs page, import only `astro-nosferatu/styles/colors/colors-dark.css` and confirm in DevTools that `--nf-grey-d-50` is defined and `--nf-grey-l-50` is not — verify each scale file stands alone, then remove the page
