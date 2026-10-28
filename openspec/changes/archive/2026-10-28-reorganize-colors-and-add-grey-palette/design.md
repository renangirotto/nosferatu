# Design

## Context

See [proposal.md](proposal.md) — Why. The constraints that shape this design:

- The library ships source. There is no build step that could generate the palette, so every one of the 360 tokens is hand-written CSS that a human reviews in a diff.
- `styles/index.css` is the only place a cascade layer is named. The palette must land in `nosferatu.colors` without the new folder naming a layer of its own.
- `package.json` exposes stylesheets through the single pattern `"./styles/*": "./src/styles/*"`. Node subpath patterns let `*` match across `/`, so a nested file is already reachable and the manifest needs no edit.
- The eight existing hues come from a Harmonizer export and their OKLCH values are frozen by [library-styles](../../specs/library-styles/spec.md). Grey is authored by hand and has no export to defer to, so its ramp is a decision this document has to record.

## Goals / Non-Goals

**Goals:**

- Make each palette file readable on its own: one scale, one tier at a time.
- Give the greyscale a shape that is defensible step by step, not just at its two anchors.
- Land grey without touching any component's color-resolution rules.

**Non-Goals:**

- Choosing which grey step a component should use. Grey is available; no library component defaults to it.
- Any generation tooling. If the palette grows again it is still hand-edited.
- Re-deriving the eight existing hues to sit on the same lightness ladder as grey.

## Decisions

### 1. Split by scale (`-d-` / `-l-`), not by hue or tier

`colors-dark.css` and `colors-light.css`, each holding all nine hues for one scale.

*Why:* the scales are what a consumer swaps between — a project pinned to `color-scheme: only light` loads one and ignores the other, and can now do so literally. Splitting by hue would give nine files that no one imports individually; splitting by tier would separate a color from its own translucent sibling across files, which makes a value edit a two-file change.

*Alternative rejected:* one file per hue plus a tier file. More files, no reader benefit, and `index.css` would grow to 18 imports.

### 2. The folder index imports; it does not re-declare

`colors/index.css` is two `@import` lines and nothing else. `styles/index.css` keeps a single layered import, `@import './colors/index.css' layer(nosferatu.colors)`.

*Why:* a nested `@import` inherits the layer assigned to the file that pulled it in, so one layer assignment at the top still covers all 360 tokens. Declaring `@layer` inside the palette folder would instead make the scale files unusable as standalone unlayered imports, and would put a second source of truth for the layer name next to the one in `styles/index.css`.

*Verification risk:* this relies on Vite resolving a nested relative `@import` inside a layered import. It is the first place in the library with two levels of CSS import, so the task list verifies it in the browser rather than assuming it.

### 3. Opacity tiers as per-hue blocks

Per hue: the ten opaque steps, a blank line, the ten 25% steps. Not file-wide blocks of all 90 opaque tokens followed by all 90 translucent ones.

*Why:* the user asked for the tiers not to share "the same list of each color" — the grouping is per color. Keeping a hue's two blocks adjacent means editing a hue stays a single contiguous hunk, and the alphabetical hue order the spec already requires still reads top to bottom.

*Cost:* the invariant "each 25% token immediately follows its base token" is gone, so a reviewer can no longer check a pair by looking at two adjacent lines. The spec's [Translucent palette tier](specs/library-styles/spec.md) requirement is reworded to the block form, and a value edit now has to be made in two places in the file.

### 4. Grey's ramp: both anchors are scale endpoints, not step 50

This is the decision that moved furthest from the request, so it is recorded in full.

Converted, the anchors are `#f9f9f9` → `oklch(0.9821 0 –)` and `#282A36` → `oklch(0.2882 0.0221 277.5)`. The first is *lighter* than every existing hue's step 10 (`d-10` is `0.98`); the second sits *between* every existing hue's `l-90` (`0.38`) and `l-100` (`0.24`). Pinning either at step 50 forces the other half of that scale into a range it cannot fill: `grey-d` steps 10–40 would have to share `0.98 → 1.0`, four whites no one can tell apart, and `grey-l` steps 60–100 would share `0.29 → ~0.14`.

So the anchors become the ends of a single greyscale, and the two scales are two different traversals of it:

| Step | `grey-d` L | `grey-l` L | Chroma |
|---|---|---|---|
| 10 | **0.98** (`#f9f9f9`) | 0.92 | 0 |
| 20 | 0.93 | 0.85 | 0.002 |
| 30 | 0.88 | 0.78 | 0.004 |
| 40 | 0.83 | 0.71 | 0.007 |
| 50 | 0.78 | 0.64 | 0.009 |
| 60 | 0.70 | 0.57 | 0.011 |
| 70 | 0.61 | 0.50 | 0.013 |
| 80 | 0.51 | 0.43 | 0.016 |
| 90 | 0.40 | 0.36 | 0.018 |
| 100 | **0.29** (`#282A36`) | **0.29** (`#282A36`) | 0.02 |

Hue is `277.5` throughout — the cast measured off `#282A36`.

- `grey-d` eases: steps 10–50 fall by `0.05`, then 60–100 by `0.08 … 0.11`, the same accelerating shape the eight Harmonizer hues use on their dark scale. It spends its light half near the top because that is where a dark-mode surface lives.
- `grey-l` is linear at `−0.07` per step. A light-mode neutral is used for text and rules far more than for surfaces, so even spacing across the whole range is more useful than a weighted one.
- Chroma rises `0 → 0.02` with the step, identically on both scales. The light greys are mathematically neutral and only the dark end carries the `#282A36` cast, which is where it is visible and where it keeps the greyscale from reading as a dead flat grey against the Dracula-ish hues around it.

*Consequence to accept:* `grey-d-100` and `grey-l-100` are the same color. Every other hue has distinct `d-100` and `l-100`. That falls out of both scales being bounded by the same anchor and is the honest result of the request; the alternative is moving one anchor off its exact hex.

*Rounding:* L and C are written at two to three decimals to match the file's existing style. `oklch(0.98 0 277.5)` renders as `#F8F8F8` and `oklch(0.29 0.02 277.5)` as `#292B35` — each within one 8-bit channel of the source hex. Carrying four decimals for two tokens and two for the other 358 was judged worse than being one step off.

### 5. Grey reuses the existing color-resolution mappings

`Button` keeps `l-40`/`l-80` and `d-50`/`d-90`; `Callout` keeps `l-40-25`/`l-80`/`l-80-25`/`l-70-25` and the dark equivalents. Each component gains one `[data-ui-color='grey']` rule shaped exactly like the other eight.

*Why:* the mappings are spec'd behaviour that applies to "each `data-ui-color` value". Special-casing the neutral would mean a component rule that reads differently for one hue, and a spec requirement that has to enumerate the exception. On the chosen ramp the existing steps land sensibly anyway — a light grey button is `grey-l-40` (`#A0A1A6`) on `grey-l-80` (`#4D4F59`) text, a contrast ratio in the same band as the chromatic hues at those steps.

### 6. Hard break at `styles/colors.css`, no shim

*Why:* a shim that only re-imports the folder leaves two documented ways to load the palette forever, and the spec would have to describe both. The library is pre-1.0 and the migration is a one-line find-and-replace, so the cost of breaking is lower than the cost of carrying the alias.

## Risks / Trade-offs

- **Nested `@import` does not survive the docs build or loses its layer** → the task list checks the computed value of a palette token *and* the layer it sits in via developer tools, before anything downstream is touched. If it fails, the fallback is to flatten `colors/index.css` away and have `styles/index.css` import the two scale files directly with `layer(nosferatu.colors)` on each — the folder split survives, only the index goes.
- **A hand-split of 320 tokens drops or duplicates one** → the split is mechanical; the task list verifies by counting declarations per file (180 each) and diffing the sorted token names against the pre-change file, rather than by reading.
- **`grey-d-100` equalling `grey-l-100` surprises someone writing a `light-dark()` pair** → documented explicitly on the styles page next to the ramp, as a property of the greyscale rather than an oversight.
- **Grey's lightness ladder differs from the other eight hues**, so `grey-l-50` is not as light as `blue-l-50` → unavoidable once the anchors are honoured. Mitigated by the step order still being monotonic and by the ramp table being published in the docs so a reader picks a step by looking, not by analogy.
- **The tier regrouping makes the diff of this change unreadable** → the colors diff is a full-file rewrite either way because the file is being moved; reviewers are pointed at the token-name diff and the per-file counts instead of the raw hunk.

## Migration Plan

For a consumer: replace `import 'astro-nosferatu/styles/colors.css'` with `import 'astro-nosferatu/styles/colors/index.css'`. Consumers on `styles/index.css` change nothing. No token is renamed or revalued, so no component or stylesheet override breaks. The change warrants a major version bump.
