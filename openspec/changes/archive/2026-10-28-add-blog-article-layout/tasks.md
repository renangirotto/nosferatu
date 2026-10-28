# Tasks

## 1. Library: the layouts surface

- [x] 1.1 Create `packages/ui/src/layouts/` and add `BlogArticle.astro` with tab indentation: a `Props` interface with required `title: string` and `description: string`, destructured from `Astro.props` with no spread and no `class` merging; verify the file exists and matches the surrounding `.astro` style
- [x] 1.2 Render the document shell in `BlogArticle.astro` — doctype, `<html lang="en">`, `<head>` with `<meta charset="utf-8">`, the viewport meta, `<title>{title}</title>` and `<meta name="description" content={description}>`; verify by viewing source on a page built with it that the tab title and the description meta carry the prop values
- [x] 1.3 Render the body in `BlogArticle.astro` — `<body>` > `<main class="nf-layout-blog-article">` > `<article>` containing, in order, an unclassed `<h1>{title}</h1>`, an unclassed `<p>{description}</p>` and `<slot />`; verify in the browser inspector that the structure and order match and that neither the `h1` nor the `p` has a `class` attribute
- [x] 1.4 Add an empty scoped `<style></style>` block at the end of `BlogArticle.astro` and confirm no `--nf-*` property is defined and no rule is written; verify the rendered example page shows browser defaults only, with no spacing, color or typography from the layout. Note: declaring the block makes Astro stamp its generated scope class on every element the layout renders — kept deliberately, and the spec and docs page now say so
- [x] 1.5 Add `"./layouts/*": "./src/layouts/*"` to `exports` in [packages/ui/package.json](../../../packages/ui/package.json), leaving `files`, `dependencies` and the `astro` peer range untouched; verify `pnpm pack:check` lists `src/layouts/BlogArticle.astro` and nothing else new

## 2. Docs: page, example and sidebar

- [x] 2.1 Add `docs/src/pages/examples/blog-article.astro` importing `astro-nosferatu/layouts/BlogArticle.astro` by package name with a title, a description and a few paragraphs of body; verify `/examples/blog-article/` renders the heading, the description and the body outside the Starlight chrome
- [x] 2.2 Add `docs/src/content/docs/layouts/blog-article.mdx` with the import line, a copyable usage example, the exact markup the layout produces, a props table (`title` and `description`, both `string`, both required, no default, each stating its double role) and the default slot; verify the page renders and every statement matches the implemented layout
- [x] 2.3 In the same page, add the styling section stating that the layout ships no styles, naming `.nf-layout-blog-article` as the hook with an example consumer rule, and the known limitation that `lang` is fixed to `en`; link to `/examples/blog-article/`; verify the link opens the rendered example
- [x] 2.4 Add a `Layouts` group to the sidebar in [docs/astro.config.mjs](../../../docs/astro.config.mjs) autogenerating the `layouts` directory; verify the sidebar lists BlogArticle and that the example page under `src/pages/` does not appear in it

## 3. Repository documentation

- [x] 3.1 Update [packages/ui/AGENTS.md](../../../packages/ui/AGENTS.md) — add `src/layouts/` to the Layout section and `./layouts/*` to the Exports section, keeping the "do not widen exports without an approved change" rule intact; verify the file describes the three published surfaces
- [x] 3.2 Update the root [AGENTS.md](../../../AGENTS.md) tree and the public-import-paths invariant to include `astro-nosferatu/layouts/<Name>.astro`; verify it agrees with the updated `library-package` spec delta

## 4. Verification

- [x] 4.1 Run `pnpm --filter docs check` — passes with no errors, and reports the missing-prop error when `title` or `description` is temporarily removed from the example page (restore it afterwards)
- [x] 4.2 Run `pnpm build` — the docs site builds, which proves `astro-nosferatu/layouts/BlogArticle.astro` resolves through the real package exports
- [x] 4.3 Run `pnpm pack:check` — every listed file is under `src/components/`, `src/layouts/`, `src/types/` or `src/styles/`, or is `package.json`, `README.md` or `LICENSE`; no `tsconfig.json`
