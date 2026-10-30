# Proposal

## Why

The library has an opinion about how big text is and no opinion at all about what it is set in: [tokens.css](../../../packages/ui/src/styles/tokens.css) points `--nf-font-body` and `--nf-font-mono` at system stacks, [typography.css](../../../packages/ui/src/styles/typography.css) sizes `h1`–`h3` and `p` and deliberately sets no family, and [BlogArticle.astro](../../../packages/ui/src/layouts/BlogArticle.astro) does the same for an article document. Every page built on `astro-nosferatu` therefore renders in whatever the operating system supplies, and the one place in this repository where a real font appears — the docs site, which installs `@fontsource-variable/outfit` and wires it into Starlight's own `--sl-font` — proves the library gives a consumer no way to express that choice.

This change gives the library three named base fonts with distinct jobs — Outfit for the page, Plus Jakarta Sans for article prose, Geist Mono for code — as an **opt-in** surface: the library names the families and never loads a byte. A consumer who installs the matching Fontsource package gets the fonts; a consumer who does not keeps the system stacks, with nothing broken and no request made.

## What Changes

- **`typography.css` gains four `:root` properties** that name the three families and the default weight: `--nf-font-family` (Outfit), `--nf-font-family-blog-post` (Plus Jakarta Sans), `--nf-font-family-code-blog-post` (Geist Mono) and `--nf-font-weight` (`400`). Each family value is a full stack — the Fontsource *variable* family name first, then the static one, then the previous system fallback — so the property always resolves to something renderable.
- **`typography.css` applies a font to `body`**, setting `font-family: var(--nf-font-family)` and `font-weight: var(--nf-font-weight)`. This is consumer-visible: importing `index.css` now changes what a page is set in, not only how big it is.
- **`tokens.css` repoints its font tokens** at the new properties with the current system stacks kept as the `var()` fallback: `--nf-font-body: var(--nf-font-family, …)` and `--nf-font-mono: var(--nf-font-family-code-blog-post, …)`. Importing `tokens.css` alone still resolves to the system stacks, so the "tokens only" contract holds.
- **`BlogArticle` sets its prose in Plus Jakarta Sans and its code in Geist Mono**, reading the two properties above. Plain text (`p`, `strong`, `span`, `a`) takes `--nf-font-family-blog-post` at `--nf-font-weight`; `code` and `pre` take `--nf-font-family-code-blog-post`. The layout keeps naming its own knobs `--nf-layout-blog-article-*`, which default to those two properties, so a consumer re-tunes one article without touching the global font.
- **The package declares the three Fontsource packages as *optional* peer dependencies** (`peerDependenciesMeta.*.optional: true`), so the intended version range is machine-readable while no package manager installs or warns about them. The library keeps zero runtime dependencies and ships no font file.
- **The docs site installs all three packages** and imports them, so its pages and the standalone `BlogArticle` example render in the real fonts, and the styles and layout pages document the opt-in install.
- **Not breaking in the sense of an API removal**, but visibly breaking for a consumer who imports `index.css` and expects their `body` font untouched: the escape hatch is one unlayered `body { font-family: … }` rule, or setting `--nf-font-family` to their own stack.

## Capabilities

### New Capabilities

<!-- None. The three fonts extend existing style, layout and packaging capabilities. -->

### Modified Capabilities

- `library-styles`: `typography.css` stops being size-only — it defines the three font-family properties and the weight, and applies them to `body`; `tokens.css`'s font tokens are redefined in terms of them. The "no base stylesheet" requirement, which asserts nothing in the library sets a `body` font, is narrowed to color.
- `library-layouts`: `BlogArticle`'s styling requirement, which today forbids it to set anything but `font-size`, is extended with the article's prose and code families and the properties that control them.
- `library-package`: the "no runtime dependencies" requirement gains the three optional peer dependencies and states that the library ships no font file and loads no font.
- `documentation-site`: the stylesheets page must document the font properties, their defaults and the opt-in install; the layout page must describe the article's two fonts; and the requirement that the library "SHALL NOT load or name any font" is replaced by one where the docs site consumes the library's font properties instead of naming Outfit itself.

## Non-goals

- **The library will not ship font files.** No `.woff2` enters `packages/ui`, no `@font-face` rule is written, and no `fonts.css` is published. The consumer installs the Fontsource package, or gets the fallback.
- **No CDN.** Nothing in the library or the docs references a third-party font host; the docs' self-hosted-font guarantee stands.
- **No new stylesheet and no new cascade layer.** The font properties live in `typography.css`, inside the existing `nosferatu.typography` layer, so the layer order invariant is untouched.
- **No font change to `Button`, `Callout` or `Accordion`.** They inherit, like any other element; none of them gains a `font-family` declaration.
- **No new size, line-height, letter-spacing or color.** This change is families and one weight.
- **No replacement of `--nf-font-body`, `--nf-font-heading` or `--nf-font-mono`.** They keep their names and are redefined, not removed.
- **No `@fontsource/*` (static) install path in the docs.** The stacks accept it, the docs recommend the variable packages.

## Impact

- `packages/ui/src/styles/typography.css` — four new `:root` properties and one `body` rule, outside the existing `@supports` guard, which stays bound to `progress()`.
- `packages/ui/src/styles/tokens.css` — three token values become `var()` indirections; the literal system stacks survive as their fallbacks.
- `packages/ui/src/layouts/BlogArticle.astro` — the scoped `<style>` block gains a family and weight on the prose elements and a family on code, plus the `--nf-layout-blog-article-font-family*` properties that feed them.
- `packages/ui/package.json` — `peerDependenciesMeta` and three optional entries; `dependencies` stays absent.
- `packages/ui/README.md` — the install line for the fonts.
- `docs/package.json`, `docs/astro.config.mjs`, `docs/src/styles/theme.css` — two more Fontsource packages imported, and Starlight's `--sl-font` fed from `--nf-font-family` instead of a hard-coded `"Outfit Variable"`.
- `docs/src/content/docs/styles.mdx` and `docs/src/content/docs/layouts/blog-article.mdx` — both currently state the library sets no font family; both become wrong the moment this lands.
- Consumers: a page importing `index.css` changes appearance on upgrade. Pre-1.0, documented in the release notes, one unlayered rule to opt out.
