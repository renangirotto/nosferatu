# Proposal

## Why

Every layout the library publishes has to re-author the same document scaffolding — doctype, `<html lang>`, `<head>`, `<body>` — and the same metadata block — charset, viewport, canonical URL, Open Graph and Twitter cards. `BlogArticle` today hand-writes a four-tag head that ships no canonical URL and no social metadata, so a consumer's article shares as a bare link. Extracting that scaffolding into two small, focused `.astro` files gives every present and future layout one correct implementation, and gives consumers the same pieces directly when they want to assemble a document themselves.

## What Changes

- Add a new published directory `packages/ui/src/html/`, holding `.astro` files whose only job is HTML document structure, exported to consumers as `astro-nosferatu/html/<Name>.astro`. **BREAKING** for the package surface only in the additive sense: it widens `exports`, which no existing consumer import depends on.
- Add `BaseHtml`: renders the doctype, `<html>`, `<head>` and `<body>`. Optional `lang` prop defaulting to `en`. A named `head` slot rendered inside `<head>` and a default slot rendered inside `<body>`.
- Add `BaseHead`: renders the metadata fragment adapted from the reference component at `renangirotto/src/components/BaseHead.astro` — charset, `color-scheme`, generator, viewport, favicon, canonical link, title/description, Open Graph and Twitter cards. The reference's font-family imports are dropped (the library ships no fonts); its CSS imports are replaced by the library's own `astro-nosferatu` stylesheets; and its `image` prop is renamed `imageSocialMedia`.
- Rebuild `BlogArticle` on top of both: it renders `BaseHtml` with `BaseHead` in the `head` slot. **BREAKING** for consumers of the layout's rendered output — the document head grows from four tags to the full metadata set, and the `<html>` element gains an explicit `lang`. The `title` and `description` props keep their meaning; `lang` and `imageSocialMedia` are added as optional props.
- Document the two new files on the docs site under a new HTML sidebar group, following the pattern established for layouts (import line, produced markup, props and slots tables) since a document-structure file cannot be embedded in a docs page.

## Capabilities

### New Capabilities

- `library-html`: the document-structure surface of the library — what `astro-nosferatu/html/*` publishes, and the markup, props and slots `BaseHtml` and `BaseHead` guarantee.

### Modified Capabilities

- `library-package`: public import paths gain `astro-nosferatu/html/<Name>.astro`, and the tarball-contents requirement gains `src/html`.
- `library-layouts`: `BlogArticle` is specified in terms of `BaseHtml` and `BaseHead`, gains the optional `lang` and `imageSocialMedia` props, and its head requirement grows from title + description to the full `BaseHead` metadata set.
- `documentation-site`: the site documents each published html file on its own page, reachable from an HTML sidebar group.

## Non-goals

- No change to any stylesheet, token, color or cascade layer. `BaseHead` only imports `astro-nosferatu/styles/index.css`; it does not author CSS.
- No new component under `src/components/` and no change to `Button` or `Callout`.
- No font loading. The reference component's `@fontsource` imports are deliberately not carried over; a consumer loads its own fonts through the `head` slot.
- No configurable favicon, Open Graph type, or Twitter card type: `BaseHead` hard-codes `/favicon.svg`, `website` and `summary_large_image` exactly as the reference does. A consumer that needs others adds them through the `head` slot.
- No change to `BlogArticle`'s body markup or to its existing `<style>` block.
- Not resolved here: `library-layouts` currently requires that `BlogArticle` declare no visual styles and define no custom properties, while the implemented file declares a fluid-typography `<style>` block. That pre-existing conflict is left exactly as it is; this change neither widens nor narrows it.

## Impact

- `packages/ui/src/html/BaseHtml.astro`, `packages/ui/src/html/BaseHead.astro` — new.
- `packages/ui/src/layouts/BlogArticle.astro` — rewritten above the `<style>` block.
- `packages/ui/package.json` — one new `exports` entry, `"./html/*"`. `files` already covers `src`, so no change there.
- `docs/src/content/docs/html/base-html.mdx`, `.../base-head.mdx` — new pages; `docs/astro.config.mjs` gains an HTML sidebar group autogenerating from that directory, as the Components and Layouts groups do.
- `docs/src/content/docs/layouts/blog-article.mdx` and the standalone example page — updated for the new props and head output.
- Consumers: anyone rendering `BlogArticle` gets a larger document head on their next install. `BaseHead` reads `Astro.site` to build the canonical URL, so a consuming project without `site` configured gets a canonical relative to the current URL rather than a build error.
