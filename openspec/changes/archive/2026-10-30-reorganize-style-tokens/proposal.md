# Proposal

## Why

`tokens.css` is the library's leftover drawer: a single `:root` block holding a six-step spacing ramp, a three-step radius ramp, three font families, a six-step font-size ladder, three weights and two line heights — most of it unused, none of it organised, and all of it sitting beside `colors/` and `shadows.css`, which are the two token groups that actually earned their own files. The ramps are also named for nothing in particular (`--nf-space-6` is the sixth of six values but the fifth step, `--nf-radius-md` is the middle of three) and expressed in `rem`, so a consumer who changes the root font size silently rescales every gap and corner in the library.

This change makes `tokens.css` the one entry point for every token the library publishes, splits the two ramps worth keeping into files of their own on a named, symmetric scale in `px`, and deletes the rest rather than carry an unused ladder into that structure.

## What Changes

This change is **consumer-visible and breaking**: published custom properties are removed and renamed, the set of cascade layers changes, and two values change from `rem` to `px`.

- **`tokens.css` becomes an aggregate.** It declares no custom property of its own and is exactly four imports: `colors/index.css`, `shadows.css`, `spacings.css` and `borders.css`. Importing it gives a consumer every token the library publishes except the typographic ones, which stay in `typography.css` because that file owns the element rules that use them.
- **New `spacings.css`** defines a nine-step scale in `px`, named around a `16px` base: `--nf-spacing-none` (`0px`), `--nf-spacing-base-low-4` (`2px`), `-low-3` (`4px`), `-low-2` (`8px`), `-low-1` (`12px`), `--nf-spacing-base` (`16px`), `-up-1` (`20px`), `-up-2` (`24px`), `-up-3` (`28px`), `-up-4` (`32px`). These are for `margin`, `padding`, `gap` and the like.
- **New `borders.css`** defines three corner radii in `px`: `--nf-border-radius-base-low-1` (`4px`), `--nf-border-radius-base` (`8px`), `--nf-border-radius-base-up-1` (`12px`). No token for the border itself.
- **BREAKING — the spacing scale is renamed and re-based.** `--nf-space-1`, `-2`, `-3`, `-4`, `-6` and `-8` are removed. `0.25rem`/`0.5rem`/`0.75rem`/`1rem`/`1.5rem`/`2rem` become `4px`/`8px`/`12px`/`16px`/`24px`/`32px` — identical at the default root size, different for a consumer who changed it.
- **BREAKING — the radius scale is renamed.** `--nf-radius-sm`, `--nf-radius-md` and `--nf-radius-full` are removed; `9999px` has no replacement because nothing in the library uses it.
- **BREAKING — every font token in `tokens.css` is removed**: `--nf-font-body`, `--nf-font-heading`, `--nf-font-mono`, `--nf-font-size-sm`…`-3xl`, `--nf-font-weight-normal`/`-medium`/`-bold`, `--nf-line-height-body` and `--nf-line-height-heading`. The three families were deferrals to `--nf-font-family` and `--nf-font-family-code-blog-post`, which stay in `typography.css` and remain the single place to substitute a font; the size, weight and line-height ladders were never wired into the fluid type scale and only `Button`, `Callout` and `Accordion` read four of them.
- **BREAKING — the cascade layers collapse to three**: `nosferatu.tokens, nosferatu.reset, nosferatu.typography`. `nosferatu.colors` and `nosferatu.shadows` are gone, because the palette and the shadows now arrive through `tokens.css` inside `nosferatu.tokens`. Nothing in the library styles the same property from two of those layers, so no resolved value changes; a consumer who wrote `@layer nosferatu.colors { … }` must now write `@layer nosferatu.tokens { … }`.
- **`index.css` keeps including everything** and shrinks to three layered imports: `tokens.css`, `reset.css`, `typography.css`. `colors/index.css` and `shadows.css` stay published and stay importable on their own; they are simply no longer named in `index.css`.
- **The three components are updated** to the new tokens: `Button`, `Callout` and `Accordion` take their padding, gap and margins from `--nf-spacing-*` and their corners from `--nf-border-radius-base`. Where a deleted token had no replacement, the component inlines the value it resolved to — `font-size: 1rem`, `font-weight: 500`/`700`, `line-height: 1.2` — except `Button`'s font family, which reads `--nf-font-family` directly so a consumer's override still reaches it. No rendered pixel changes at the default root size.
- **The docs styles page is rewritten** around the new grouping: the stylesheet table gains `spacings.css` and `borders.css`, the token table lists the two new scales with their `px` values, the layer diagram shows three layers, and the removals are documented as a migration note beside the existing one about `colors.css`.

## Capabilities

### New Capabilities

None. The new stylesheets are additional token groups inside the existing `library-styles` capability.

### Modified Capabilities

- `library-styles`: the exported stylesheet set and what `tokens.css` contains; the cascade layer order; new spacing-scale and border-radius-scale requirements; removal of the font-token requirement; the spacing and radius values restated in `px` in `Button`'s, `Callout`'s and `Accordion`'s appearance requirements.
- `documentation-site`: the styles page documents the two new stylesheets, the two new token scales and the three-layer order, and carries the migration note for the removed tokens.

## Impact

- **Published CSS**: `packages/ui/src/styles/tokens.css` (rewritten as imports), `index.css` (three layers), new `spacings.css` and `borders.css`. `colors/`, `shadows.css`, `reset.css` and `typography.css` are untouched.
- **Components**: `Button.astro`, `Callout.astro`, `Accordion.astro`. `BlogArticle.astro` references none of the removed tokens.
- **Package exports**: unchanged — `./styles/*` already publishes any file added under `src/styles/`, so the two new files are importable with no manifest edit.
- **Docs**: `docs/src/content/docs/styles.mdx` and the token references in `packages/ui/README.md`; `docs/src/content/docs/components/callout.mdx` mentions the "`tokens.css` without `shadows.css`" combination, which is no longer possible.
- **Consumers**: a major version bump. Anyone referencing `--nf-space-*`, `--nf-radius-*` or the `--nf-font-*` ladders must rename, and anyone layering into `nosferatu.colors` or `nosferatu.shadows` must retarget `nosferatu.tokens`.

## Non-goals

- **No change to the palette or the shadows.** `colors/` and `shadows.css` keep their contents, their names and their standalone import paths; only the file that pulls them in changes.
- **No change to `typography.css`.** The fluid scale, the three font families and `--nf-font-weight` stay exactly as they are, in their own layer.
- **No token for borders other than the radius.** No width, no style, no color — the proposal explicitly leaves `border` itself untokenised.
- **No spacing token for the components' raise geometry.** `--nf-button-depth`, `--nf-button-lift`, `--nf-button-border-width` and their `Accordion` equivalents stay component-scoped literals: they are shadow offsets and travel distances, not spacing.
- **No `rem`-based alias** and no compatibility shim re-declaring the old names. The break is the point.
- **No new component and no change to any component's props or markup.**
