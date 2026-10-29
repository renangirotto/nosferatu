# Tasks

Extended grey values, identical on both scales:

| Step | Lightness | Chroma |
|---|---|---|
| 110 | 0.27 | 0.019 |
| 120 | 0.25 | 0.018 |
| 130 | 0.23 | 0.017 |
| 140 | 0.21 | 0.016 |
| 150 | 0.19 | 0.015 |
| 160 | 0.17 | 0.014 |
| 170 | 0.15 | 0.013 |
| 180 | 0.13 | 0.012 |
| 190 | 0.11 | 0.011 |
| 200 | 0.09 | 0.01 |

## 1. Palette tokens

- [x] 1.1 In `packages/ui/src/styles/colors/colors-dark.css`, add `--nf-grey-d-110` … `--nf-grey-d-200` (`oklch(L C 277.5)`) right after `--nf-grey-d-100`, and `--nf-grey-d-110-25` … `--nf-grey-d-200-25` (same values with ` / 25%`) right after `--nf-grey-d-100-25`. Use tabs. Verify: `grep -c 'nf-grey-d-' packages/ui/src/styles/colors/colors-dark.css` prints `40`, and `orange` still starts after `grey-d-200-25`.
- [x] 1.2 Make the same additions with the `-l-` scale in `packages/ui/src/styles/colors/colors-light.css`. Verify: `grep -c 'nf-grey-l-' packages/ui/src/styles/colors/colors-light.css` prints `40`, and no existing line changed (`git diff` shows additions only).

## 2. Shadow tokens

- [x] 2.1 In `packages/ui/src/styles/shadows.css`, add `--nf-shadow-grey-d-110` … `--nf-shadow-grey-d-200` after `--nf-shadow-grey-d-100`, and `--nf-shadow-grey-l-110` … `--nf-shadow-grey-l-200` after `--nf-shadow-grey-l-100`, each `0px 4px 0px var(--nf-grey-<d|l>-<step>)`. Verify: `grep -c -- '--nf-shadow-' packages/ui/src/styles/shadows.css` prints `201`.

## 3. Documentation

- [x] 3.1 In `docs/src/content/docs/styles.mdx`, update the step bullet ("`10` to `100`, in tens; `grey` also has `110` to `200`"). In the Grey section, describe the near-black extension below the `#282A36` anchor, add the `d-110` … `d-200` and `l-110` … `l-200` swatches to the two ramps, and add rows 110–200 to the ramp table. Verify: open `/styles/` under `pnpm dev`, then check that both ramps show twenty swatches, each darker than the one before it, and that `d-200` is distinguishable from black.

## 4. Verification

- [x] 4.1 Run `pnpm build` and `pnpm --filter docs check`. Passing means both exit 0 with no errors.
- [x] 4.2 Run `pnpm pack:check`. Passing means the file list is unchanged: same files, nothing added or removed.
- [x] 4.3 Run `openspec validate extend-grey-dark-steps --strict`. Passing means it reports the change as valid.
