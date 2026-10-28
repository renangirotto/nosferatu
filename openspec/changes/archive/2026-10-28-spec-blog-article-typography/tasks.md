# Tasks

## 1. Prerequisite

- [x] 1.1 Confirm `add-html-base-components` has been applied: `packages/ui/src/html/` exists and `BlogArticle` renders `BaseHtml`/`BaseHead`. If it has not, stop and apply it first — this change's `documentation-site` delta carries that change's scenarios forward.

## 2. Rename the layout's custom properties

- [x] 2.1 In the `<style>` block of `packages/ui/src/layouts/BlogArticle.astro`, rename all eleven properties to the `--nf-layout-blog-article-*` names in the design's table, keeping tab indentation, the declaration order, every literal value and the `progress()`/`pow()` expressions exactly as they are.
- [x] 2.2 Grep the repository for the old names (`--nf-fluid-`, `--nf-fs-`, `--nf-h1`, `--nf-h2`, `--nf-h3`, `--nf-h4`) and confirm no other file — library, docs page or example page — referenced them.
- [x] 2.3 Confirm the block still declares custom properties before ordinary declarations in each rule, still styles only `h1`–`h4` and `p` inside `.nf-layout-blog-article`, and still sets no property other than `font-size`.

## 3. Correct the documentation

- [x] 3.1 Rewrite the Styling section of `docs/src/content/docs/layouts/blog-article.mdx`: remove the claim that the layout ships no styles and no custom properties, and state that it sizes `h1`–`h4` and `p` from a viewport-interpolated type scale and styles nothing else.
- [x] 3.2 Add a table of the `--nf-layout-blog-article-*` properties with their defaults (`560px`, `1088px`, the computed progress, `calc(1rem + …)`, `1.2`, `1.414`, the computed scale, the four heading sizes, the paragraph size) and a runnable example overriding a couple of them on `.nf-layout-blog-article`.
- [x] 3.3 Keep the existing point that an unlayered consumer rule wins, and note that `progress()` is new enough that browsers without it fall back to default heading sizes.

## 4. Verify

- [x] 4.1 Run `pnpm build` from the repository root. A pass means the docs site still builds with the renamed properties.
- [x] 4.2 Run `pnpm dev` and open `/examples/blog-article/`. Resize the window from under 560px to over 1088px: paragraph text moves between 16px and 18px and the headings scale with it, exactly as before the rename — compare computed `font-size` values in devtools against the pre-change build if in doubt.
- [x] 4.3 In devtools on that page, confirm the inspected `.nf-layout-blog-article` element lists only `--nf-layout-blog-article-*` properties and no `--nf-h1`, `--nf-fs-*` or `--nf-fluid-*`.
- [x] 4.4 In the same devtools session, add an unlayered `.nf-layout-blog-article h1 { font-size: 20px }` rule and confirm it wins over the layout's declaration.
