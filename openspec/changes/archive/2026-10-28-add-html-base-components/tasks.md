# Tasks

## 1. Publish the html surface

- [x] 1.1 Create `packages/ui/src/html/BaseHtml.astro` with tab indentation: `interface Props { lang?: string }`, `const { lang = 'en' } = Astro.props;`, and markup of `<!doctype html>` + `<html lang={lang}>` containing `<head><slot name="head" /></head>` and `<body><slot /></body>`. No `HTMLAttributes` extension, no `class:list`, no spread, no `<style>` block.
- [x] 1.2 Create `packages/ui/src/html/BaseHead.astro` from the reference component, with tab indentation: drop the `@fontsource` imports, replace the CSS imports with the single relative `import '../styles/index.css';`, rename the `image` prop to `imageSocialMedia`, and keep the tag list and order otherwise identical (charset, color-scheme, generator, viewport, favicon, canonical, title + title meta + description, four `og:` tags, four `twitter:` tags).
- [x] 1.3 In `BaseHead`, resolve the canonical base as `Astro.site ?? Astro.url` so a consuming project with no `site` configured still builds, and resolve `imageSocialMedia` with `new URL(imageSocialMedia, Astro.url)`. Render the `og:image` and `twitter:image` tags only when the prop is supplied.
- [x] 1.4 Add `"./html/*": "./src/html/*"` to `exports` in `packages/ui/package.json`, placed after `./layouts/*`. Leave `files` unchanged.
- [x] 1.5 Confirm neither new file uses the `@/*` alias and that no `--nf-*` property or CSS rule was introduced.

## 2. Rebuild BlogArticle on the html surface

- [x] 2.1 In `packages/ui/src/layouts/BlogArticle.astro`, import `BaseHtml` and `BaseHead` relatively from `../html/`, and extend `Props` with optional `lang?: string` (defaulting to `en`) and `imageSocialMedia?: string`.
- [x] 2.2 Replace the hand-written doctype/`html`/`head`/`body` with `<BaseHtml lang={lang}>`, putting `<BaseHead title={title} description={description} imageSocialMedia={imageSocialMedia} />` in the `head` slot and the existing `main.nf-layout-blog-article` markup in the default slot. Leave the `main`/`article`/`h1`/`p`/slot structure and the `<style>` block exactly as they are.
- [x] 2.3 Verify the rendered head of `/examples/blog-article/` now contains the full `BaseHead` tag set and that the `<html>` element carries `lang="en"`.

## 3. Document the html surface

- [x] 3.1 Add an HTML group to the sidebar in `docs/astro.config.mjs`, autogenerating from a `html` directory, placed after the Layouts group.
- [x] 3.2 Write `docs/src/content/docs/html/base-html.mdx`: import line `import BaseHtml from 'astro-nosferatu/html/BaseHtml.astro'`, a copyable usage example filling both slots, the markup it produces, a props table (`lang`, `string`, optional, default `en`) and a slots table (named `head` → inside `<head>`, default → inside `<body>`, both optional).
- [x] 3.3 Write `docs/src/content/docs/html/base-head.mdx`: import line `import BaseHead from 'astro-nosferatu/html/BaseHead.astro'`, the full list of tags it renders, a props table (`title` and `description` required `string`, `imageSocialMedia` optional `string`), a note that the image tags appear only when `imageSocialMedia` is set, that it imports `astro-nosferatu/styles/index.css` on the consumer's behalf, that it loads no font, and that the favicon path, `og:type` and `twitter:card` are fixed and extended through `BaseHtml`'s `head` slot.
- [x] 3.4 Update `docs/src/content/docs/layouts/blog-article.mdx`: add `lang` and `imageSocialMedia` to the props table, replace the hand-written head in the "markup produced" block with the real output, and state that the document and head come from `BaseHtml` and `BaseHead` with links to those pages.
- [x] 3.5 Pass the new props where useful in `docs/src/pages/examples/blog-article.astro` so the example exercises them, keeping the page rendering as it does today.

## 4. Verify

- [x] 4.1 Run `pnpm build` from the repository root. A pass means the docs site builds with no unresolved import and no `Invalid URL` error from the canonical link, which proves the new `astro-nosferatu/html/*` exports resolve through the package name and that `BaseHead` tolerates the docs site's missing `site` setting.
- [x] 4.2 Run `pnpm --filter docs check`. A pass means no missing or mistyped prop on `BaseHtml`, `BaseHead` or `BlogArticle`.
- [x] 4.3 Run `pnpm pack:check` from the repository root. A pass means the file list gained `src/html/BaseHtml.astro` and `src/html/BaseHead.astro` and nothing else, and still contains no `tsconfig.json`.
- [x] 4.4 Run `pnpm dev` and check in the browser: `/examples/blog-article/` renders as before and its source shows the full metadata set with a canonical link and `lang="en"`; the HTML sidebar group lists both pages and they open.
