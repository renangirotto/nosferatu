# Proposal

## Why

A `typography.css` now exists in [packages/ui/src/styles](../../../packages/ui/src/styles/typography.css) but nothing references it: `index.css` declares four layers and imports four files, so the sheet is published yet dead. The `library-styles` spec actively contradicts it — it requires that the library "SHALL NOT publish a typography stylesheet" and that the layer statement name "exactly `nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset`, with no `nosferatu.base` and no `nosferatu.typography`". Code and spec are in direct conflict, and the docs styles page tells readers something that is about to stop being true.

This change resolves the conflict in favour of shipping the stylesheet, and settles the three things the dead file leaves open: which layer it occupies, what its public property names are, and what it does to `BlogArticle`, which already ships its own fluid type scale.

## What Changes

- **BREAKING (consumer-visible).** `index.css` gains a fifth stylesheet. Every consumer already importing `astro-nosferatu/styles/index.css` starts getting `h1`, `h2`, `h3` and `p` sized by the library; until now the library sized no text at all. A page that relied on browser-default heading sizes will re-flow. Consumers who want the old behaviour import the other four stylesheets individually instead of `index.css`.
- **BREAKING.** The fixed cascade layer order grows a fifth, final layer: `nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset, nosferatu.typography`. Anything a consumer layered relative to the old order is unaffected, but the `@layer` statement's exact content is spec'd and changes.
- The stylesheet's custom properties are renamed from the generic `--nf-fluid-*` / `--nf-fs-*` it currently declares to `--nf-typography-*`, and every one is declared on `:root` so an unlayered `:root` override reaches it. This is the same correction the archived `spec-blog-article-typography` change made for the layout, applied before these names are ever published.
- Element coverage is fixed at `h1`, `h2`, `h3` and `p`. `a` is dropped from the sized set: giving links their own `font-size` shrinks a link inside a heading to body size, which is a bug rather than a style. `h4`–`h6` stay unsized, as today.
- The element rules are guarded by `@supports`, so a browser without `progress()` falls back to its own heading sizes rather than collapsing every heading to the inherited body size.
- `BlogArticle` is left exactly as it is. Its scoped type scale is unlayered and therefore keeps winning inside the article; nothing about the layout's rendering, props or property names changes.
- The docs styles page documents the new stylesheet, its layer, its overridable properties and the opt-out, and stops claiming the library styles no text.

## Capabilities

### New Capabilities

<!-- None. The stylesheet is a new file, but it is behaviour of the existing library-styles capability. -->

### Modified Capabilities

- `library-styles`: "Exported stylesheets" and "Cascade layer order without a base layer" are both retired — each one's name or scenarios assert that no typography stylesheet exists — and replaced by "Stylesheet exports" and "Cascade layer order", which carry every still-true scenario across. Two requirements are added: "Fluid type scale" (the `--nf-typography-*` surface, the defaults and the element coverage) and "Type scale degrades to browser defaults" (the `progress()` fallback).
- `documentation-site`: the "Stylesheets are documented" requirement gains the obligation to document a stylesheet that applies element styles — its layer, its overridable properties with defaults, and how to opt out — not just its import path and contents.

## Non-goals

- **No change to `BlogArticle`.** Its eleven `--nf-layout-blog-article-*` properties, its `pow()`-based scale and its rendered sizes all stay as they are. Unifying the two type scales is a separate change with its own breaking surface.
- **No typography tokens in `tokens.css`.** The fluid bounds live in `typography.css` so the sheet stays independently importable with no dependency on another stylesheet. The existing `--nf-font-size-*` ladder in `tokens.css` is untouched and is not wired into the fluid scale.
- **No `line-height`, `font-family`, `font-weight`, `margin` or `color` rules.** This change sizes text and nothing else; the library still sets no body font, no heading color and no vertical rhythm.
- **No lists, blockquotes, code or `h4`–`h6` styling.**
- **No `progress()` polyfill, and no `clamp()` reimplementation of the scale.** The fallback is the browser's own sizes, not a second type scale to keep in sync.
- **No bounding logic of the library's own.** `progress()` already clamps its result to `0`–`1`, so each element holds at its minimum below `560px` and at its maximum above `1088px` with nothing wrapped around it. The library adds no `clamp()`, and does not reach for `no-clamp`. See design Decision 3.
- **No new component or layout**, and no retro-fit of the scale into `Button` or `Callout`, which keep their fixed `1rem`.

## Impact

- `packages/ui/src/styles/typography.css` — rewritten in place: tab indentation, `--nf-typography-*` names, `h1`/`h2`/`h3`/`p` only, properties hoisted to `:root`, element rules behind `@supports`.
- `packages/ui/src/styles/index.css` — one line added to the `@layer` statement, one `@import` added.
- `docs/src/content/docs/styles.mdx` — the stylesheet table, the layer diagram and the "styles no headings, paragraphs…" sentence all change; a typography section is added.
- `docs/src/pages/examples/typography.astro` — new standalone demo page. The docs site's own Starlight layers outrank the library's, so the scale cannot be demonstrated inline on a documentation page; see design Decision 7.
- `packages/ui/package.json` — no change. `./styles/*` already exports the file and `files: ["src"]` already packs it; `pnpm pack:check` only needs to confirm it.
- Consumers: a visible re-flow on any page loading `index.css`. The library is pre-1.0, but this is the first time it styles a consumer's own markup rather than its own components, and it belongs in the release notes as a breaking change.
- Browsers without `progress()` (everything except recent Safari at the time of writing) render headings at their UA sizes. The scale is progressive enhancement, which the docs must say plainly.
