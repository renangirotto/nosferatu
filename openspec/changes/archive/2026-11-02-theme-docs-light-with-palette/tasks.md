# Tasks

No `packages/ui` change and no component is touched, so there is no library task and no component docs page to add; all work is in `docs/src/styles/theme.css` (tabs).

## 1. Light theme

- [x] 1.1 Add a `:root[data-theme="light"]` block setting `--sl-color-bg`, `--sl-color-bg-nav`, `--sl-color-bg-sidebar` and `--sl-color-hairline-shade` to `var(--nf-grey-l-10)`; `--sl-color-text` and `--sl-color-white` to `var(--nf-grey-l-100)`; `--sl-color-text-accent` to `var(--nf-purple-l-50)`; `--sl-color-text-invert` to `var(--nf-grey-l-10)`; `--sl-color-bg-inline-code` to `var(--nf-grey-l-20)`; `--ec-brdCol` to `var(--nf-grey-l-40-25)` (on `:root[data-theme="light"] .expressive-code`, because Expressive Code declares its light border on the block itself). Move `--ec-brdRad: 8px` from the dark block to `:root` so both themes get it.
- [x] 1.2 Make the TOC hover rule theme-independent (`starlight-toc a:hover`, drop the dark prefix) and add a light inline-code rule: `.sl-markdown-content :not(pre) > code` → `color: var(--nf-green-l-50); font-weight: 600`.
- [x] 1.3 Add light rules mirroring dark: `border-color: var(--nf-grey-l-10)` on `.right-sidebar`, `mobile-starlight-toc nav` and `mobile-starlight-toc .dropdown`; `background-color: var(--nf-grey-l-20)` on `mobile-starlight-toc :is(.toggle, .dropdown)`; `border-color: var(--nf-grey-l-10-25)` on `mobile-starlight-toc .toggle`; inside the existing `min-width: 50rem` query, `site-search button[data-open-modal]` with `border-color: var(--nf-grey-l-10-25)` and `background-color: var(--nf-grey-l-20)`.
- [x] 1.4 Add the title/content line rule for light: `.content-panel + .content-panel` → `border-top-color: var(--nf-grey-l-10)`. Verify the file references only `var(--nf-*)` palette tokens, defines no `--nf-*` property, and uses no `!important` or ID selector.

## 2. Dark theme title line

- [x] 2.1 Add `:root[data-theme="dark"] .content-panel + .content-panel { border-top-color: var(--nf-grey-d-100); }`; leave every other dark rule as is.

## 3. Verification

- [x] 3.1 Run `pnpm format:check` and `pnpm lint`; both exit 0.
- [x] 3.2 Run `pnpm build`; passes with no errors.
- [x] 3.3 Run `pnpm pack:check`; the file list is identical to `main` (no `packages/ui` change).
- [x] 3.4 With `pnpm dev`, in the **light** theme, check in devtools on the Button and Styles pages, wide and narrow: content, TOC, sidebar, top bar and mobile TOC bar backgrounds compute to `--nf-grey-l-10`; sidebar, top bar, desktop/mobile TOC borders and the title/content line compute to `--nf-grey-l-10` (no visible line); a paragraph, an `h2` and the page title compute to `--nf-grey-l-100`; an in-content link, hovered and current TOC links to `--nf-purple-l-50`; the current sidebar link has a `--nf-purple-l-50` background and `--nf-grey-l-10` label; the desktop search button and the mobile TOC toggle have `--nf-grey-l-20` background and `--nf-grey-l-10-25` border, the opened TOC list `--nf-grey-l-20`; inline code is `--nf-green-l-50` at weight 600 on `--nf-grey-l-20`; code blocks keep Starlight's light syntax colors with an 8px radius and `--nf-grey-l-40-25` border; live demos still render their light colors.
- [x] 3.5 Switch to the **dark** theme: the title/content line now computes to `--nf-grey-d-100`, and every other dark color is unchanged from before.
- [x] 3.6 Note in the apply summary how the `--nf-purple-l-50` links and `--nf-green-l-50` inline code read on the light background (design.md, Risks), so the user can decide on a darker step.
