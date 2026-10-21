# Design

## Context

`index.css` today imports `tokens.css` unlayered and puts reset/base/typography in three `nosferatu.*` layers. Nine `--nf-color-*` hex tokens in `tokens.css` are read by `base.css`, `typography.css`, `Button.astro` and the docs. The new palette source is `~/Downloads/harmonized-palette(2).css` (160 OKLCH tokens, unprefixed, grouped by hue in the order purple, cyan, blue, red, orange, yellow, green, pink). The new reset source is `~/Documents/projects/pagina-nove/src/styles/reset.css`. Both are outside the repo, so their content gets copied in, not referenced.

## Goals / Non-Goals

**Goals:**
- Palette tokens are the only color tokens; every color in the library points at one.
- One layered entry point (`index.css`) covering all six files.

**Non-Goals:**
- Automatic dark mode (`prefers-color-scheme` switching). The `-d-` scale is shipped but unused by library styles in this change.
- Semantic aliases (`--nf-color-primary` etc.) — explicitly rejected by the user.
- A neutral/gray scale. The export has none, and only that file is used.

## Decisions

### 1. `colors.css` is a mechanical copy of the export
Rename `--<hue>-<d|l>-<step>` → `--nf-<hue>-<d|l>-<step>`, keep values byte-for-byte, drop the Harmonizer URL comment, reorder. Order: hue alphabetical (blue, cyan, green, orange, pink, purple, red, yellow), then `-d-` before `-l-`, then step ascending numerically (10, 20, … 100). Pure string sort would put `100` right after `10`; numeric step order is what "sorted" means for a scale, so steps stay ascending. One blank line between each hue/scale group, tabs for indentation (repo style).

Generate it with a short throwaway script (sed/awk or Python) reading the export, so values can't be mistyped; diff the value set against the source afterwards.

### 2. Layers: tokens and colors become layers too
```css
@layer nosferatu.tokens, nosferatu.colors, nosferatu.reset, nosferatu.base, nosferatu.typography;

@import './tokens.css' layer(nosferatu.tokens);
@import './colors.css' layer(nosferatu.colors);
@import './reset.css' layer(nosferatu.reset);
@import './base.css' layer(nosferatu.base);
@import './typography.css' layer(nosferatu.typography);
```
Previously tokens were unlayered, so a consumer `:root { --nf-… }` override only won if it loaded after the library. Layering them means any unlayered consumer override wins regardless of load order — consistent with the rest of the library's "unlayered CSS wins" contract. Alternative considered: one shared `nosferatu.tokens` layer for both files. Rejected: a layer per file mirrors the existing pattern and shows up clearly in DevTools; the cost is one extra name.

### 3. Reset copied as-is, reformatted to tabs
Content and comments from `pagina-nove` unchanged; only indentation switches to tabs to match the repo. `#root { isolation: isolate }` is kept although Astro pages usually have no `#root` — it's harmless and the user asked for the same content.

### 4. `base.css` drops what the reset now owns
The reset sets `body { min-height: 100dvh; line-height: 1.5; -webkit-font-smoothing: antialiased }`. `base.css` sits in a later layer and would override with `min-height: 100vh`. Remove `min-height` and `-webkit-font-smoothing` from `base.css`. Keep `line-height: var(--nf-line-height-body)` (1.6) in base on purpose: the token stays the theming knob, and base wins over the reset's 1.5.

### 5. Semantic → palette mapping (light scale only)
Each old semantic reference is replaced inline with a palette token. Picks are the nearest step in lightness/role; no white or gray exists in the palette, so neutrals use the low-chroma end of `blue` and white-ish roles use `-l-10`.

| Was | Used in | Becomes |
|---|---|---|
| `--nf-color-primary` (#b91c1c) | base `::selection`, typography `a`, Button primary bg | `--nf-red-l-80` |
| `--nf-color-primary-hover` | typography `a:hover`, Button primary hover | `--nf-red-l-90` |
| `--nf-color-on-primary` (#fff) | base `::selection`, Button primary text | `--nf-red-l-10` |
| `--nf-color-text` | base `body`, Button secondary text | `--nf-blue-l-100` |
| `--nf-color-text-muted` | typography `small` | `--nf-blue-l-80` |
| `--nf-color-background` (#fff) | base `body`, Button secondary bg | removed from `body` (browser default canvas); Button secondary bg → `transparent` |
| `--nf-color-surface` | typography `code`/`pre`, Button secondary hover | `--nf-blue-l-10` |
| `--nf-color-border` | Button secondary border | `--nf-blue-l-30` |
| `--nf-color-focus` | base `:focus-visible`, Button focus | `--nf-blue-l-60` |

`transparent` is a keyword, not a design value, so it doesn't break "values through `--nf-*`". Dropping the body background avoids inventing a white token.

### 6. Docs
- `styles.mdx`: file table adds `colors.css`; layer section shows the five-layer statement and order line and drops "Tokens are not layered"; token table loses the Color row and gains a Colors section describing naming (`--nf-<hue>-<d|l>-<step>`), the eight hues, `-d-` = dark mode / `-l-` = light mode; theming examples override palette tokens (e.g. `--nf-red-l-80`).
- `button.mdx`: theming demo overrides `--nf-red-l-80` / `--nf-red-l-90` with `var(--nf-green-l-80)` / `var(--nf-green-l-90)`.
- `README.md`: layer order line, single-file list, theming snippet.

## Risks / Trade-offs

- [Breaking for consumers using `--nf-color-*`] → Called out as **BREAKING** in the proposal; docs show the replacement tokens. Library is pre-1.0 with no known external consumers.
- [Re-theming a component means overriding a hue token, e.g. setting `--nf-red-l-80` to green, which also recolors every other use of that step] → Accepted consequence of having no semantic layer. Revisit with a semantic layer if consumers need per-role theming.
- [Contrast of picks not yet verified] → Task checks `--nf-red-l-10` on `--nf-red-l-80` and `--nf-blue-l-100` on white meet WCAG AA 4.5:1; adjust the step in the table if not.
- [Starlight docs styles vs layered tokens] → Starlight's own CSS is unlayered and keeps winning, as today; only `--nf-*` values are affected.
