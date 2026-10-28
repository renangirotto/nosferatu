# Design

## Context

The library publishes two kinds of `.astro` file today: `src/components/` (fragments, native-attribute forwarding, `class:list` merge, scoped styles) and `src/layouts/` (whole documents, explicit props only, no spread). `exports` in [package.json](../../../packages/ui/package.json) maps `./components/*`, `./layouts/*`, `./styles/*` and `./package.json`; `files` is `src`, so a new directory under `src/` is published the moment a file lands in it, but it stays unreachable until `exports` names it.

The reference `BaseHead.astro` comes from an application, not a library. Three of its assumptions do not hold here: it imports fonts from `@fontsource` packages (the library has no dependencies), it imports `@/styles/*` (the `@/*` alias must never appear in published source — a consumer compiles without the library's tsconfig), and it builds its canonical URL from `Astro.site`, which an application configures but a consuming project may not.

[BlogArticle.astro](../../../packages/ui/src/layouts/BlogArticle.astro) currently hand-writes the skeleton and a four-tag head. The docs site has no `site` configured in [astro.config.mjs](../../../docs/astro.config.mjs) and lists its sidebar groups explicitly, so both need attention when the layout starts using `BaseHead`.

## Goals / Non-Goals

**Goals:**

- One published home for files that render document structure, with the same import ergonomics as components and layouts.
- `BaseHtml` and `BaseHead` usable independently, by a consumer assembling a page by hand, and composable into every layout the library publishes.
- `BlogArticle`'s rendered document stays a layout contract while its skeleton and head become shared.
- Everything builds in a consuming project with no configuration — no alias, no `site`, no font package.

**Non-Goals:**

- Turning every head concern into a prop. The fixed favicon, `og:type` and `twitter:card` stay fixed; the `head` slot is the extension point.
- Styling. Neither file declares CSS.
- Reconciling the pre-existing conflict between `library-layouts`'s "no visual styling" requirement and `BlogArticle`'s fluid-typography `<style>` block.

## Decisions

### A third published directory, `src/html/`, rather than `src/components/`

`BaseHtml` and `BaseHead` fail the component contract on every point: no root `nf-` class, no scoped styles, no native-attribute forwarding, no `class:list` merge, and in `BaseHead`'s case not even a single root element. Filing them under `src/components/` would force the `component-build` skill's rules onto files that cannot satisfy them and would put them in the Components sidebar group next to `Button`. A sibling directory with its own capability spec (`library-html`) keeps each contract clean. The cost is one more `exports` entry and one more docs group; `files: ["src"]` means no manifest change beyond that.

Alternative considered: `src/layouts/BaseHtml.astro`. Rejected — a layout renders a *complete* document on its own, which `BaseHead` never does and `BaseHtml` only does once a consumer fills both slots.

### `BaseHead` imports `../styles/index.css`, relatively

A relative specifier inside published source resolves for a consumer with no configuration, which the `@/*` alias does not. `index.css` rather than the four stylesheets individually: it is the file that declares the layer order, and importing the parts separately would put them outside their layers and break the fixed cascade order. Importing styles from a head component also means a consumer gets the library's CSS by using `BaseHead` and nothing else — the docs site keeps its own `customCss` import regardless, so the two paths do not conflict (a second import of the same file is deduplicated by the bundler).

Trade-off recorded: this makes `BaseHead` opinionated — you cannot use its metadata without the library's reset. That is accepted for a library whose head component exists to be the base of its layouts; a consumer who wants only the tags copies them or uses the `head` slot.

### Canonical URL falls back to `Astro.url` when `Astro.site` is unset

`new URL(Astro.url.pathname, Astro.site)` throws `Invalid URL` when `Astro.site` is `undefined`, which would fail the build of any consuming project — including this repo's own docs site — that has not configured `site`. The implementation resolves the base as `Astro.site ?? Astro.url`, producing a correct absolute canonical when `site` is configured and a current-page-absolute one when it is not. The same `new URL(value, base)` treatment gives `imageSocialMedia` an absolute URL, matching the reference's behaviour for `image`.

Alternative considered: requiring `site` and documenting it. Rejected — a library must not impose configuration on a consumer to render a page, and the docs build would be the first casualty.

### `BaseHtml` takes explicit props only, like a layout

No `HTMLAttributes<'html'>` extension, no `class:list`, no `{...attrs}`. The markup it renders *is* the contract, exactly as for layouts, and forwarding arbitrary attributes onto `<html>` would make the document skeleton unpredictable. `lang` is the single prop, defaulting to `en`.

### `BlogArticle` keeps its props and its `<style>` block

The layout composes `BaseHtml` with `BaseHead` in the `head` slot and moves its `main` into the default slot; `title` and `description` pass straight through to `BaseHead`, and the two new props are optional so no existing usage breaks at the call site. The `<style>` block and the `main`/`article` markup are untouched. The rendered head changes, which is the consumer-visible part of this change.

### Docs get an explicit HTML sidebar group

The sidebar in `docs/astro.config.mjs` is a list of groups with autogenerated items, so a new content directory needs one line. The pages follow the layouts pattern — import line, produced markup, props and slots tables, no embedded demo — because neither file renders anything a documentation page can show inline. The existing BlogArticle example page under the docs site exercises the whole stack for real, so it doubles as the live proof that `BaseHtml` and `BaseHead` work through the package exports.

## Risks / Trade-offs

- **Consumer-visible head change.** Existing `BlogArticle` pages gain a canonical link, a `/favicon.svg` icon link, `color-scheme`, a generator meta and the social tags. A consumer who already injected their own canonical or favicon in a wrapper will now have two. Mitigated only by release notes; the layout has no opt-out and gaining one is out of scope.
- **`/favicon.svg` is assumed to exist.** A consuming project without that file serves a 404 for it, which is what the reference does too and what Astro's own starter templates ship.
- **`BaseHead` pulls in the full stylesheet.** Any page that uses it inherits the reset. Documented on its page rather than made configurable.
- **Capability count grows.** A fourth library capability (`library-html`) means one more spec to keep in step with `library-package` whenever the export surface changes.
