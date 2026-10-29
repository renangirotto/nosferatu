# Proposal

## Why

The documentation site still wears Starlight's stock blue-grey dark theme, so the site that showcases `astro-nosferatu` looks unrelated to the palette the library ships. Theming the docs chrome from the library's own dark palette makes the site read as part of the same product.

## What Changes

- Add a docs-only stylesheet that re-themes Starlight's **dark** theme from the nosferatu dark palette:
  - page content, table of contents, left sidebar, top bar and mobile table-of-contents bar background → `--nf-grey-d-100`
  - borders of the left sidebar, top bar, mobile and desktop table of contents → `transparent`
  - plain body text → `--nf-grey-d-10`
  - table-of-contents links on hover and on the current section → `--nf-purple-d-50`
  - background of the current page's link in the sidebar navigation → `--nf-purple-d-50`
  - inline `<code>` in page content → text `--nf-green-d-50`, background `--nf-grey-d-120`, weight 600
  - code blocks → Dracula syntax theme (via Starlight's `expressiveCode.themes`), 8px radius, border `--nf-grey-d-80-25`
  - mobile table-of-contents toggle and its list → background `--nf-grey-d-110`; toggle border `--nf-grey-d-80-25`
  - search button → background `--nf-grey-d-110`, border `--nf-grey-d-80-25`
- Set `expressiveCode.themes` in `docs/astro.config.mjs` to Dracula for dark mode and Starlight's default for light mode.
- Set the docs' body and interface text in Outfit, in both themes, self-hosted via the `@fontsource-variable/outfit` package; code (inline and blocks, including code-block titles) keeps its existing fonts.
- Register that stylesheet in the docs site's Starlight `customCss`, after the library's `index.css`.
- The stylesheet reads the palette through `var(--nf-*)`, which the docs already load via `astro-nosferatu/styles/index.css`; no values are copied and `colors-dark.css` is not imported a second time.

**Consumer-visible:** no. Nothing under `packages/ui` changes, so the published package, its CSS, tokens, markup and exports are untouched. Only the private docs site's appearance changes.

## Non-goals

- Starlight's light theme keeps its colors (the font change applies to both themes).
- Headings, asides and buttons are not re-themed beyond what the mappings above imply.
- No new tokens in the library, and no semantic `--nf-color-*` aliases anywhere.
- No change to how live component demos render inside documentation pages.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `documentation-site`: adds a requirement that the docs site's dark theme takes its content background, body text, TOC link, sidebar current-link and inline-code colors from the library's dark palette.

## Impact

- `docs/src/styles/` — new stylesheet (the directory does not exist yet).
- `docs/astro.config.mjs` — `customCss` entries for the theme stylesheet and the font, plus `expressiveCode.themes`.
- `docs/package.json` — new dependency `@fontsource-variable/outfit` (docs only; the library still has none).
- Side effect: Starlight derives in-content link color from the same accent property as the TOC and sidebar, so links inside pages also turn `--nf-purple-d-50` (see design.md).
- `packages/ui` and the tarball are unchanged.
