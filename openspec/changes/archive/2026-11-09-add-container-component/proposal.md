# Proposal

## Why

Centring a block and capping its width is something every page needs, and today the only place the library does it is inside `BlogArticle`, hard-wired to the `article` through a layout-only property. A `Container` component makes that measure reusable by consumers and by the library's own layouts, so a layout stops re-implementing it and a consumer stops hand-writing it.

## What Changes

- New component `astro-nosferatu/components/Container.astro`: renders a `div.nf-container` that centres itself (`margin-inline: auto`), fills the available inline size and caps it at `--nf-container-max-inline-size`, falling back to the new token `--nf-container-large-size` (`1088px`). It forwards native `div` attributes, merges a consumer `class` and renders its children through the default slot.
- `generic.css` gains `--nf-container-large-size: 1088px` beside `--nf-container-small-size: 856px`.
- `BlogArticle` wraps its `article` in a `Container` and sets `--nf-container-max-inline-size: var(--nf-container-small-size)` on its `nf-layout-blog-article` root, so the article still caps at `856px`. The `article` keeps its `nf-layout-blog-article-content` class but no longer carries the width rule.
- **BREAKING** `--nf-layout-blog-article-max-inline-size` is removed. A consumer re-tunes the article width with `--nf-container-max-inline-size` on `.nf-layout-blog-article` (or on the container itself) instead.
- **BREAKING** `BlogArticle`'s markup gains an element: `main.nf-layout-blog-article` > `div.nf-container` > `article.nf-layout-blog-article-content`. A consumer selector relying on `main > article` stops matching.

Consumer-visible: yes. A new component and token are additive; removing the layout property and changing the layout's markup are breaking and warrant a major bump.

This change builds on `simplify-blog-article-styles`, which is complete but not yet archived. That change must be archived first so its requirements are in `openspec/specs/` before this change's deltas apply.

## Non-goals

- Inline padding or gutters on `Container`; it caps and centres only.
- A size prop (`size="small"`) or a `data-ui-*` variant: the width is set through the custom property, and the container tokens already name the presets.
- A polymorphic element prop (`as="section"`); the container is always a `div`.
- Adding `--nf-container-medium-size` or any other size beyond `-large`.
- Using `Container` in any layout other than `BlogArticle`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `library-styles`: new `Container` component API and appearance; `generic.css` declares `--nf-container-large-size`.
- `documentation-site`: a component page has a `Props` section only when the component has a prop of its own; otherwise the pass-through/slot line closes `Usage`.
- `library-layouts`: `BlogArticle`'s article is wrapped in a `Container`, the measure requirement now goes through the container's property, and `--nf-layout-blog-article-max-inline-size` is removed.

## Impact

- `packages/ui/src/components/Container.astro` (new).
- `packages/ui/src/styles/generic.css`.
- `packages/ui/src/layouts/BlogArticle.astro` — markup and scoped style.
- `docs/src/content/docs/components/container.mdx` (new), `docs/src/content/docs/layouts/blog-article.mdx`, `docs/src/content/docs/styles.mdx`.
- No `package.json` change: `./components/*` is already a wildcard export and `files` already ships `src/components`.
