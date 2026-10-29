# Design

## Context

- `docs/astro.config.mjs` already loads `astro-nosferatu/styles/index.css` through Starlight's `customCss`, which brings in `colors/index.css` and therefore every `--nf-<hue>-d-<step>` token on `:root`.
- Starlight 0.42 puts its own CSS in `@layer starlight.*`; `customCss` files are unlayered, so they win over Starlight without extra specificity.
- Starlight's dark theme is its `:root` default; the light theme overrides under `:root[data-theme='light']`. Starlight's inline script always sets `data-theme`.
- The colors the user named map onto Starlight's theme properties (from `@astrojs/starlight/dist/style/props.css` and the components that read them):

| Target | Starlight reads |
|---|---|
| content + TOC background | `--sl-color-bg` (body background; the right-hand TOC has no own background) |
| plain text | `--sl-color-text` |
| TOC current link | `--sl-color-text-accent` (`starlight-toc a[aria-current='true']`) |
| TOC hover | no accent hover rule — needs one |
| sidebar current-page background | `--sl-color-text-accent`, label in `--sl-color-text-invert` (`SidebarSublist.astro`) |
| inline code text | no property — `.sl-markdown-content code` sets only a background |
| top bar + mobile TOC bar background | `--sl-color-bg-nav` |
| left sidebar background | `--sl-color-bg-sidebar` |
| top bar, sidebar edge, mobile TOC summary / dropdown-top borders | `--sl-color-hairline-shade` (used only by these) |
| mobile TOC bar top border, mobile dropdown sides | hard-coded `--sl-color-gray-5` / `gray-6` — needs a rule |
| inline code background | `--sl-color-bg-inline-code` |
| code block radius / border | Expressive Code's `--ec-brdRad` / `--ec-brdCol`, declared inside `@layer starlight.components` |
| mobile TOC toggle + list background, toggle border | hard-coded `--sl-color-black` / `gray-5` (`.toggle`, `.dropdown`) — needs a rule |
| search button background / border | hard-coded `--sl-color-black` / `gray-5`, only at `min-width: 50rem` — needs a rule |
| desktop TOC left border | `--sl-color-hairline`, also used by content-panel separators — needs a rule |

## Goals / Non-Goals

**Goals:** the mappings above, dark theme only, read from library tokens; chrome borders transparent.

**Non-Goals:** light theme, the search dialog itself, Expressive Code blocks, the mobile TOC toggle button's own outline, separators inside page content, any library change.

## Decisions

1. **Reference tokens, don't copy values.** The palette is already on `:root` in the docs, so the stylesheet uses `var(--nf-grey-d-100)` etc. Copying OKLCH values would create a second source of truth that drifts when the palette changes. *Alternative:* copy the palette values into the docs file — rejected, unnecessary since the tokens are loaded.
2. **One stylesheet, `docs/src/styles/theme.css`, listed in `customCss` after `index.css`.** Unlayered, so it beats `starlight.*` layers by cascade order alone; no specificity raised.
3. **Set Starlight's properties, add rules only where none exists.** Override `--sl-color-bg`, `--sl-color-text` and `--sl-color-text-accent` under `:root[data-theme='dark']`; add `starlight-toc a:hover` for the TOC hover color and `.sl-markdown-content :not(pre) > code` for inline code color. The `:not(pre) >` guard keeps Expressive Code and plain `<pre>` blocks untouched.
4. **Sidebar label contrast.** Starlight draws the current link's label in `--sl-color-text-invert` (a dark blue by default). Set it to `--nf-grey-d-100` so the label is legible on `--nf-purple-d-50` and matches the palette. *Alternative:* leave the default — a dark blue label on purple reads as an unrelated color.
5. **Chrome borders.** Set `--sl-color-hairline-shade: transparent`, since only the chrome borders read it. The desktop TOC border reads `--sl-color-hairline`, which also draws separators between content panels, and the mobile TOC bar and dropdown use hard-coded grays — so those three get one `border-color: transparent` rule on `.right-sidebar`, `mobile-starlight-toc nav` and `mobile-starlight-toc .dropdown`. Borders stay `transparent` rather than `none` so layout doesn't shift by a pixel. *Alternative:* `--sl-color-hairline: transparent` — rejected, it would also erase in-content separators.
6. **Code blocks through Expressive Code's variables.** Override `--ec-brdRad` and `--ec-brdCol` in the same unlayered dark-theme block. Expressive Code declares them inside `@layer starlight.components`, so the unlayered value wins. *Alternative:* `expressiveCode.styleOverrides` in `astro.config.mjs` — rejected, it would split the theme across two files and apply to the light theme too.
7. **Mobile toggle and search button keep one color in every state.** The unlayered border colors also win over Starlight's hover/open border colors (accent when open, `gray-2` on hover), so those states no longer change the border. The search-button rule sits inside `@media (min-width: 50rem)`, matching Starlight: below that the button is a borderless icon, and giving it a background there would draw an unrounded box.
8. **Dracula through Starlight's `expressiveCode.themes`, not CSS.** Expressive Code ships Dracula, so the docs set `themes: ['dracula', 'starlight-light']` in `astro.config.mjs`. Starlight shows the first dark theme in dark mode and the first light theme in light mode, so pairing Dracula with Starlight's default light theme keeps light mode unchanged. The radius and border overrides in `theme.css` still win because they're unlayered. *Alternative:* recolor tokens by hand in CSS — rejected, it would mean hand-maintaining a syntax theme.
9. **Outfit through `--sl-font`, self-hosted with Fontsource.** `@fontsource-variable/outfit` ships one variable file covering weights 100–900 and its own `@font-face`, so listing the package first in `customCss` is the whole loading step; `--sl-font: 'Outfit Variable'` on `:root` (both themes) switches Starlight's text font. Starlight already keeps code on a separate `--sl-font-mono`, so inline and block code are unaffected. Expressive Code, however, draws its frame titles and copy-button label from `--sl-font`, so `--ec-uiFontFml` is pinned back to `var(--sl-font-system)` — the font those labels used before. *Alternatives:* Google Fonts `<link>` in `head` — rejected, it sends readers' requests to a third party; the static `@fontsource/outfit` package — rejected, it needs one import per weight.
10. **Selector for dark theme** is `:root[data-theme='dark']`, so the light theme's own `:root[data-theme='light']` block remains the only thing applied in light mode.

**Invariants upheld:** library invariants are untouched — nothing in `packages/ui` changes (2, 3, 7). The docs file defines `--sl-*` properties, which are Starlight's documented theming API, not library properties, so invariant 1 (`--nf-` prefix) is about the library and is not bent; no `--nf-color-*` is introduced (2). Docs still consume the library only through `astro-nosferatu/styles/index.css` (6).

## Risks / Trade-offs

- [Live component demos inherit Outfit, since the library sets no font family] → expected: a consumer's font applies to the components too, and the demos now show that.
- [`--sl-color-text-accent` also colors in-content links, the mobile TOC indicator and some Starlight UI accents] → accepted: they become `--nf-purple-d-50`, which is coherent with the requested theme. Called out in the proposal.
- [With one background and no borders, chrome and content are no longer visually separated] → requested; spacing alone separates them.
- [Hover/open feedback on the mobile toggle and search button border is lost] → accepted for a consistent border; restore with `:hover` rules if missed.
- [`--ec-*` variable names, `.right-sidebar`, `mobile-starlight-toc` and `site-search` structure are Starlight / Expressive Code internals] → rechecked by the browser verification task on upgrade.
- [Live component demos inside docs pages now sit on `--nf-grey-d-100`] → demos are self-styled and should still read; verify visually on the component pages.
- [Starlight internals (selectors, `aria-current` usage) may change on upgrade] → the two added rules target stable, documented hooks; rechecked by the browser verification task.
