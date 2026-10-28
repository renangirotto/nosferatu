# Proposal

## Why

The library ships components and stylesheets, but nothing that gives a consumer a whole page. A blog consuming `astro-nosferatu` has to hand-write its own document shell — doctype, `<head>`, title and description metadata, article scaffolding — before it can use a single component. A first layout, `BlogArticle`, establishes the layouts surface of the package and covers the most common page the library is used for.

## What Changes

- Add a new published directory `packages/ui/src/layouts/` holding `.astro` layouts, alongside the existing `src/components/` and `src/styles/`.
- Add `BlogArticle.astro` as the first layout. It takes two required props, `title` (string) and `description` (string), and renders a complete HTML document: doctype, `<html>`, a `<head>` carrying the title and the description as metadata, and a `<body>` containing `<main class="nf-layout-blog-article">` → `<article>` → an unclassed `<h1>` with the title, an unclassed `<p>` with the description, and then the default slot for the article body.
- The layout carries an empty scoped `<style>` block: the markup and the public `.nf-layout-blog-article` hook land now, the visual design lands in a later change.
- Widen the package `exports` with `./layouts/*` so the public import path is `astro-nosferatu/layouts/BlogArticle.astro`. **Not breaking** — this is purely additive, no existing import path, component, class or token changes.
- Document the layout on the docs site under `docs/src/content/docs/layouts/`, with a `Layouts` sidebar group (the existing sidebar autogenerates only the `components` directory, so `docs/astro.config.mjs` gains one entry).

## Non-goals

- No styling. The `<style>` block stays empty and no new `--nf-*` tokens or component-scoped custom properties are introduced; `.nf-layout-blog-article` is an unstyled hook for now.
- No other layout. `BlogArticle` is the only one in this change; no base/shell layout, no slots beyond the default one, no `<head>` extension slot.
- No optional props, no native attribute forwarding, no `class` merging: both props are required and the markup is fixed, so the component-level `class:list`/`...attrs` convention does not apply to this layout yet.
- No build step, bundler or test runner — layouts ship as source like everything else.
- No change to components, stylesheets, tokens, the palette or the cascade layer order.
- No new `component-build`/`component-doc` skill coverage for layouts; the hand-written skills keep their component scope in this change.

## Capabilities

### New Capabilities

- `library-layouts`: the layouts the library publishes — what a layout is in this package, how it is imported, and the markup contract and props of `BlogArticle`.

### Modified Capabilities

- `library-package`: the public import paths requirement gains `astro-nosferatu/layouts/<Name>.astro`, and the tarball-contents requirement gains `src/layouts/`.
- `documentation-site`: the docs site must document the layouts the library publishes, including a `BlogArticle` page reachable from the sidebar.

## Impact

- `packages/ui/src/layouts/BlogArticle.astro` — new file.
- `packages/ui/package.json` — one new `exports` entry, `"./layouts/*"`. `files` already covers `src`, so the tarball picks the directory up with no further change.
- `packages/ui/AGENTS.md` and the root `AGENTS.md` — the layout listings and the "do not widen `exports`" note need to record the new directory and path.
- `docs/src/content/docs/layouts/blog-article.mdx` — new page; `docs/astro.config.mjs` — one new sidebar group.
- Consumers: additive only. Existing imports keep resolving; a consumer on the current version is unaffected until it imports a layout.
- Verification: `pnpm build`, `pnpm --filter docs check`, `pnpm pack:check`.
