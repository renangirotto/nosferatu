# Tasks

## 1. Container token

- [x] 1.1 Create `packages/ui/src/styles/generic.css` declaring only `:root { --nf-container-small-size: 856px; }` (tabs, short header comment, no `@layer`); verify `grep -n "@layer" packages/ui/src/styles/generic.css` returns nothing
- [x] 1.2 Add `@import "./generic.css" layer(nosferatu.tokens);` to `packages/ui/src/styles/index.css` after the `tokens.css` import, leaving the `@layer` statement unchanged; verify the statement still reads `nosferatu.tokens, nosferatu.reset, nosferatu.typography`
- [x] 1.3 Document `generic.css` in `docs/src/content/docs/styles.mdx`: add it to the stylesheet table, note it is imported by `index.css` into `nosferatu.tokens` and is not part of `tokens.css`, and list `--nf-container-small-size` (`856px`) with an override example; verify `pnpm --filter docs check` passes

## 2. BlogArticle layout

- [x] 2.1 In `packages/ui/src/layouts/BlogArticle.astro`, delete every `--nf-layout-blog-article-viewport-*`, `-type-scale*` and `-font-size-*` declaration and the `h1`–`h4` rules, and drop `font-size` from the `p` rule; keep the font-family/weight properties, the `p`, `strong, span, a` and `code, pre` rules and their comments; verify `grep -n "font-size\|viewport\|type-scale" packages/ui/src/layouts/BlogArticle.astro` returns nothing
- [x] 2.2 Add `class="nf-layout-blog-article-content"` to the `article` and a `.nf-layout-blog-article-content` rule with `margin-inline: auto`, `inline-size: 100%` and `max-inline-size: var(--nf-layout-blog-article-max-inline-size, var(--nf-container-small-size))`, without declaring the layout property; verify in `pnpm dev` that the article is `856px` wide and centred at a `1440px` window and full width at `600px`
- [x] 2.3 Update `docs/src/content/docs/layouts/blog-article.mdx`: replace the type-scale prose, the "overrides the global type scale" note and the size rows of the property table with the new measure (`--nf-layout-blog-article-max-inline-size` → `--nf-container-small-size`), mention the `nf-layout-blog-article-content` class in the structure, drop `max-width`/`margin-inline` from the "Everything else" example, and add a migration note listing the removed properties and that `h4` now uses the browser size; verify the page renders in `pnpm dev` with a live demo and `pnpm --filter docs check` passes

## 3. Verification

- [x] 3.1 Run `pnpm lint`, `pnpm format:check` and `pnpm build`; all exit 0
- [x] 3.2 Run `pnpm pack:check`; the file list includes `src/styles/generic.css` and nothing outside the published set
- [x] 3.3 In the built docs, confirm an `h1` inside the article and one outside it have the same computed font size, and that setting `--nf-container-small-size: 720px` on `:root` in devtools caps the article at `720px`
