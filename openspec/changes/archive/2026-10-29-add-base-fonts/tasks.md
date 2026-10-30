# Tasks

## 1. Name the fonts in the library's styles

- [x] 1.1 In `packages/ui/src/styles/typography.css`, add to the existing `:root` block the four properties from the `library-styles` delta — `--nf-font-family` (`'Outfit Variable', 'Outfit'` + the sans stack currently in `tokens.css`), `--nf-font-family-blog-post` (`'Plus Jakarta Sans Variable', 'Plus Jakarta Sans'` + the same sans stack), `--nf-font-family-code-blog-post` (`'Geist Mono Variable', 'Geist Mono'` + the mono stack currently in `tokens.css`) and `--nf-font-weight: 400` — keeping the file's existing two-space indentation; verify `pnpm build` succeeds and the built docs CSS contains each stack once.
- [x] 1.2 In the same file, add a `body` rule setting `font-family: var(--nf-font-family)` and `font-weight: var(--nf-font-weight)`, placed **outside** the `@supports (font-size: calc(… progress(…) …))` guard (design D9); verify in the browser that a docs example page's `body` computes to the Outfit stack and that the guard still wraps only the size rules.
- [x] 1.3 In `packages/ui/src/styles/tokens.css` (tabs), redefine `--nf-font-body: var(--nf-font-family, <current sans stack>)` and `--nf-font-mono: var(--nf-font-family-code-blog-post, <current mono stack>)`, leaving `--nf-font-heading: var(--nf-font-body)` as it is; verify by importing only `tokens.css` in a scratch page that `var(--nf-font-body)` still resolves to the system stack, and that with `index.css` it resolves to Outfit.
- [x] 1.4 Confirm no literal family name is written twice: `grep -rn "Outfit\|Plus Jakarta\|Geist Mono" packages/ui/src` returns matches in `typography.css` only.

## 2. Set the article's fonts in BlogArticle

- [x] 2.1 In `packages/ui/src/layouts/BlogArticle.astro` (two-space indentation), declare `--nf-layout-blog-article-font-family: var(--nf-font-family-blog-post)`, `--nf-layout-blog-article-font-family-code: var(--nf-font-family-code-blog-post)` and `--nf-layout-blog-article-font-weight: var(--nf-font-weight)` on the `.nf-layout-blog-article` rule, above the existing ordinary declarations and beside the other `--nf-layout-blog-article-*` properties; verify `pnpm build` succeeds.
- [x] 2.2 Add the nested rules inside the same block: `& p` taking the family and the weight, `& strong, & span, & a` taking the family only (design D4), and `& code, & pre` taking the code family (design D6); verify on `/examples/blog-article/` that the description paragraph, the slotted paragraphs, their links and their `code` elements all take the new families while an `h2` does not.
- [x] 2.3 Verify the rules reach slot content and stop at the layout's root: on the same example page, confirm in DevTools that a slotted `<p>` matches `.nf-layout-blog-article … p` and that a `<p>` rendered outside `main.nf-layout-blog-article` (add one temporarily) does not.
- [x] 2.4 Verify emphasis survives: add a `<strong>` to the example page's slot and confirm it renders heavier than its paragraph, which computes to `font-weight: 400`.
- [x] 2.5 Update `docs/src/content/docs/layouts/blog-article.mdx` — the Styling section currently says the layout only sizes text: state which elements take the article font and the code font, that headings keep the general font, that the rules apply to slot content, and add the three new properties with their defaults to the theming table plus a runnable override example; verify `pnpm --filter docs check` passes and the page renders.

## 3. Declare the fonts as optional peer dependencies

- [x] 3.1 In `packages/ui/package.json`, add `@fontsource-variable/outfit`, `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/geist-mono` at `^5.3.0` to `peerDependencies`, and mark each `"optional": true` under `peerDependenciesMeta`, leaving `dependencies` absent; verify `pnpm install` at the root completes with no unmet-peer error for the three packages.
- [x] 3.2 Verify nothing in the published source imports them: `grep -rn "@fontsource" packages/ui/src` returns nothing.
- [x] 3.3 Add the opt-in install and import lines to `packages/ui/README.md`, stating that the library ships no font file and falls back to system fonts; verify the install line is copy-pasteable and names all three packages.

## 4. Make the docs site the reference consumer

- [x] 4.1 Install `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/geist-mono` in `docs` (`pnpm --filter docs add …`); verify both appear in `docs/package.json` beside the existing `@fontsource-variable/outfit`.
- [x] 4.2 Add both to the `customCss` array in `docs/astro.config.mjs`, before `astro-nosferatu/styles/index.css` and `./src/styles/theme.css` (design D8); verify `pnpm build` emits the three font files under `docs/dist/_astro/` and that the built HTML requests them from the site's own origin.
- [x] 4.3 In `docs/src/styles/theme.css`, replace the literal `--sl-font: "Outfit Variable"` with `var(--nf-font-family)` and set `--sl-font-mono: var(--nf-font-family-code-blog-post)`; verify in the browser that docs body text computes to `Outfit Variable`, inline code and fenced code blocks to `Geist Mono Variable`, and that `grep -n "Outfit\|Geist\|Jakarta" docs/src/styles/theme.css` returns nothing.
- [x] 4.4 Update `docs/src/content/docs/styles.mdx`: correct every sentence claiming the library sets no font family or weight, add the font properties with their stacks and defaults to the typography section, document the opt-in install and import, and show substituting a font by overriding `--nf-font-family`; verify `pnpm --filter docs check` passes and the sentence "it sets no font family" no longer appears on the page.
- [x] 4.5 Extend `docs/src/pages/examples/typography.astro` so the standalone page also reports the computed `font-family` and `font-weight` of `body` alongside the sizes it already reports; verify the page shows `Outfit Variable` at the top of the stack.

## 5. Verification

- [x] 5.1 Run `pnpm build` from the repository root; it completes with no error, and the built `/examples/blog-article/` page renders headings in Outfit, prose in Plus Jakarta Sans and code in Geist Mono.
- [x] 5.2 Run `pnpm pack:check`; the file list is unchanged apart from nothing new — it contains no `.woff2` or other font binary, and `packages/ui/package.json` still has no `dependencies` field.
- [x] 5.3 Run `pnpm --filter docs check`; it reports no error.
- [x] 5.4 Simulate the no-font consumer: temporarily remove the three `customCss` font imports from `docs/astro.config.mjs`, run `pnpm build`, and confirm the example pages render in the system sans and system monospace fonts with no failed font request and no console error; restore the imports afterwards.
- [x] 5.5 Verify the consumer escape hatch: add an unlayered `:root { --nf-font-family: Georgia, serif; }` to the example page, confirm body text and `--nf-font-body` follow it while `BlogArticle` prose stays in Plus Jakarta Sans, then remove it.
- [x] 5.6 Run `openspec validate add-base-fonts --strict`; it reports the change valid, and every scenario in the four delta specs has been exercised by one of the checks above.
