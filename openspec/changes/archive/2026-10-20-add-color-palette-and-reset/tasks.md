# Tasks

## 1. Reset

- [x] 1.1 Replace `packages/ui/src/styles/reset.css` with the content of `~/Documents/projects/pagina-nove/src/styles/reset.css`, indentation converted to tabs (design decision 3). Verify `diff <(sed 's/^\t*//' packages/ui/src/styles/reset.css) <(sed 's/^ *//' ~/Documents/projects/pagina-nove/src/styles/reset.css)` prints nothing.
- [x] 1.2 Remove `min-height` and `-webkit-font-smoothing` from `body` in `base.css`, keeping `line-height: var(--nf-line-height-body)` (design decision 4). Verify `grep -n 'min-height\|font-smoothing' packages/ui/src/styles/base.css` prints nothing.

## 2. Color palette

- [x] 2.1 Generate `packages/ui/src/styles/colors.css` from `~/Downloads/harmonized-palette(2).css` with a throwaway script in the scratchpad: `--nf-` prefix, values unchanged, sorted per design decision 1, tabs, blank line between hue/scale groups, no Harmonizer comment. Verify 160 declarations (`grep -c -- '--nf-' colors.css`), the first is `--nf-blue-d-10` and the last `--nf-yellow-l-100`, and the sorted `name: value` set with `--nf-` stripped equals the sorted set from the source file.
- [x] 2.2 Remove the `/* Color */` block from `tokens.css`. Verify `grep -- '--nf-color' packages/ui/src/styles/tokens.css` prints nothing.
- [x] 2.3 Replace every `--nf-color-*` reference in `base.css`, `typography.css` and `components/Button.astro` per the mapping table in design decision 5 (drop `body` `background-color`; Button secondary bg `transparent`). Verify `grep -rn -- '--nf-color' packages/ui/src` prints nothing and every `var(--nf-<hue>-…)` used in those files is defined in `colors.css`.
- [x] 2.4 Check contrast of `--nf-red-l-10` on `--nf-red-l-80` and `--nf-blue-l-100` on white (OKLCH → sRGB, WCAG ratio) with a scratchpad script. Verify both are ≥ 4.5:1; if not, move to the next darker/lighter step and update design decision 5's table.

## 3. Layers and docs

- [x] 3.1 Rewrite `packages/ui/src/styles/index.css` per design decision 2 (five-layer statement, five layered `@import`s). Verify in the built docs (`pnpm --filter docs build`, open in browser) that DevTools lists `nosferatu.tokens`, `nosferatu.colors`, `nosferatu.reset`, `nosferatu.base`, `nosferatu.typography` in that order, `body` computed `min-height` is `100dvh`, and `getComputedStyle(document.documentElement).getPropertyValue('--nf-red-l-80')` returns the palette value.
- [x] 3.2 Update `docs/src/content/docs/styles.mdx` per design decision 6 (file table with `colors.css`, five-layer order, tokens now layered, Color row removed, new Colors section on naming and `-d-`/`-l-`, theming examples using palette tokens). Verify `grep -- '--nf-color' docs/src/content/docs/styles.mdx` prints nothing and the page renders in `pnpm --filter docs dev`.
- [x] 3.3 Update the theming demo in `docs/src/content/docs/components/button.mdx` to override `--nf-red-l-80` / `--nf-red-l-90` with the green steps. Verify on the dev server that the demo button renders green and the default button renders with `--nf-red-l-80`.
- [x] 3.4 Update `packages/ui/README.md` (layer order line, single-file list with `colors.css`, theming snippet with a palette token). Verify `grep -- '--nf-color' packages/ui/README.md` prints nothing.

## 4. Integration

- [x] 4.1 Run `grep -rn -- '--nf-color' packages docs --include='*.css' --include='*.astro' --include='*.md' --include='*.mdx'` (excluding `node_modules`) and `pnpm build` from the root. Verify no matches and a clean build.
