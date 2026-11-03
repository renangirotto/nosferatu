# Design

## Context

`docs/src/styles/theme.css` themes the dark mode by overriding Starlight's `--sl-*` properties under `:root[data-theme="dark"]`, plus a few targeted selectors for things Starlight paints without a property (TOC hover, inline code, chrome borders, mobile TOC, search button). Starlight 0.42 paints the relevant parts like this:

| Part                                          | Starlight source                                                       |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| page / nav / sidebar bg                       | `--sl-color-bg`, `--sl-color-bg-nav`, `--sl-color-bg-sidebar`          |
| body text                                     | `--sl-color-text`                                                      |
| headings, page title                          | `--sl-color-white` (in light mode Starlight sets it to near-black)     |
| links, TOC current, sidebar current bg        | `--sl-color-text-accent`                                               |
| sidebar current label                         | `--sl-color-text-invert`                                               |
| top bar / sidebar / mobile TOC bottom borders | `--sl-color-hairline-shade`                                            |
| desktop TOC border                            | `.right-sidebar` → `--sl-color-hairline`                               |
| title/content line                            | `.content-panel + .content-panel` `border-top` → `--sl-color-hairline` |
| mobile TOC toggle/dropdown borders            | `--sl-color-gray-5` / `--sl-color-gray-6`                              |

The site's theme stylesheet is unlayered, so its rules beat Starlight's `@layer starlight.*` rules without extra specificity (invariant 3 is about library CSS and is not touched).

## Goals / Non-Goals

**Goals:** mirror every dark-theme override in the light theme with the requested light tokens; make the title/content line invisible in both themes.

**Non-Goals:** see proposal.md. No change under `packages/ui`.

## Decisions

1. **Same file, mirrored block.** Add `:root[data-theme="light"]` rules next to each dark rule in `theme.css` rather than a new stylesheet. One place to read both themes; no `customCss` change.

2. **Headings via `--sl-color-white`.** In light mode Starlight already uses `--sl-color-white` as its strongest text color (headings, page title, site title). Setting it to `--nf-grey-l-100` in the light block alone colors every title without per-element selectors. Not done in dark: out of scope.

3. **Sidebar current label is the background, `--nf-grey-l-10`**, mirroring dark, which uses `--nf-grey-d-100` for `--sl-color-text-invert`. Chosen by the user over `--nf-grey-l-100`; it costs contrast (see Risks).

4. **Divider lines are painted with the background token, not `transparent`.** The request names `--nf-grey-l-10` explicitly; visually identical to transparent over a `--nf-grey-l-10` background. Set `--sl-color-hairline-shade: var(--nf-grey-l-10)` and set `border-color` on `.right-sidebar`, the mobile TOC `nav`/`.dropdown`, as dark does.

5. **Title/content line via a targeted selector, not `--sl-color-hairline`.** `--sl-color-hairline` also draws table rows, `<hr>`, `<Steps>` and sidebar sublists; overriding it would erase those too. Instead target the line itself: `:root[data-theme="light"] .content-panel + .content-panel { border-top-color: var(--nf-grey-l-10) }` and the same for dark with `--nf-grey-d-100`. `.content-panel` is a Starlight class outside the docs' own markup, but this is the docs site theming its host, the same kind of selector the dark block already uses (`starlight-toc`, `mobile-starlight-toc`, `.right-sidebar`); invariant 5 governs library components only.

6. **Unrequested parts adapted from dark by analogy** (recorded as assumptions):
   - inline code: `--nf-green-l-50`, weight 600, background `--nf-grey-l-20` (the light "field" step, as dark's code sits one step off its background);
   - code blocks: `--ec-brdRad: 8px` already applies to both themes once moved to `:root`; border `--ec-brdCol: var(--nf-grey-l-40-25)` in light (the search and TOC fields use `--nf-grey-l-10-25`, by request). Syntax theme stays `starlight-light`.
   - TOC hover color: the existing dark rule becomes theme-independent (`starlight-toc a:hover`), since it already reads `--sl-color-text-accent`.

## Risks / Trade-offs

- **Sidebar current label contrast**: `--nf-grey-l-10` on `--nf-purple-l-50` is roughly 2:1. Chosen by the user; `--nf-grey-l-100` (about 5:1) is the fallback.
- **Link contrast**: `--nf-purple-l-50` text on `--nf-grey-l-10` is roughly 2:1, below WCAG AA (4.5:1) for body links and TOC entries. Used as requested; if it reads poorly in the browser, a darker step (e.g. `--nf-purple-l-70`) is a one-line follow-up.
- **Inline code contrast**: `--nf-green-l-50` (L≈0.67) on `--nf-grey-l-20` (L≈0.85) is also low. Same follow-up path.
- **Starlight internals**: selectors such as `.content-panel + .content-panel` and `mobile-starlight-toc .toggle` are not a public API and may move on a Starlight upgrade; the dark block already carries this risk.
- Invariants upheld: 1, 2 (only palette tokens, no `--nf-color-*`), 6, 7, 8. None bent.
