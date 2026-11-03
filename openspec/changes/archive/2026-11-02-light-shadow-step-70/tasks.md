# Tasks

## 1. Button

- [x] 1.1 In `packages/ui/src/components/Button.astro`, change the light half of the `box-shadow` fallback from `var(--nf-grey-l-80)` to `var(--nf-grey-l-70)`, and in each of the nine `&[data-ui-color]` blocks change only the `--nf-button-shadow-color` light value from `--nf-<hue>-l-80` to `--nf-<hue>-l-70`. Leave `--nf-button-accent-color`, the `color` fallback, the focus outline and every dark value alone. Verify: `grep -A2 "shadow-color" packages/ui/src/components/Button.astro` shows `-l-70` on every light shadow line and no `-l-80`, and `grep -c "l-80" Button.astro` still matches the accent lines (9 hues + 2 fallbacks = 11).

## 2. Accordion

- [x] 2.1 In `packages/ui/src/components/Accordion.astro`, change the light half of the `box-shadow` fallback from `var(--nf-grey-l-80)` to `var(--nf-grey-l-70)`, and in each `&[data-ui-color]` block change only the `--nf-accordion-shadow-color` light value from `--nf-<hue>-l-80` to `--nf-<hue>-l-70`. Leave the accent, the fill, the rule and every dark value alone. Verify: `grep -A2 "shadow-color" packages/ui/src/components/Accordion.astro` shows `-l-70` on every light shadow line, and no `--nf-accordion-accent-color` line changed (`git diff` touches shadow lines only).

## 3. Docs

- [x] 3.1 Confirm that `docs/src/content/docs/components/button.mdx` and `accordion.mdx` state no default shadow token. They currently only show consumer theming with `--nf-blue-l-70`, so no edit is expected. Verify: `grep -n "l-80" docs/src/content/docs/components/{button,accordion}.mdx` returns nothing about the shadow.

## 4. Verification

- [x] 4.1 Run `pnpm format:check`, `pnpm lint`, `pnpm build` and `pnpm pack:check`. A pass means all four exit 0, the docs build completes, and the pack listing is unchanged (`src/components`, `src/layouts`, `src/types`, `src/styles`, `package.json`, `README.md`, `LICENSE`).
- [x] 4.2 Run `pnpm dev`, open the Button and Accordion docs pages in light mode, and inspect a `color="purple"` instance and an uncolored one. The computed box-shadow color equals `--nf-purple-l-70` / `--nf-grey-l-70` and is visibly lighter than the label. Switch to dark mode: shadow `d-80`, text `d-90`, unchanged from before.
