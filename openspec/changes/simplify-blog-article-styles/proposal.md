# Proposal

## Why

`BlogArticle` carries its own fluid type scale (`--nf-layout-blog-article-viewport-*`, `-type-scale-*`, `-font-size-*`) that duplicates what `typography.css` already does for `h1`–`h3` and `p` — and since `BaseHead` always loads `index.css`, both scales run on every article page and disagree (at a `1200px` viewport the layout's `h1` is `50.9px`, the global one `56px`). One scale is enough. At the same time the article has no measure: it spans the full width of the page, so every consumer re-writes the same centred, capped container by hand.

## What Changes

- **BREAKING** `BlogArticle` stops sizing text. Its viewport/type-scale/font-size custom properties are removed (`--nf-layout-blog-article-viewport-min`, `-viewport-max`, `-viewport-progress`, `-font-size-base`, `-type-scale-min`, `-type-scale-max`, `-type-scale`, `-font-size-h1`…`-h4`, `-font-size-p`). Inside the article, headings and paragraphs now take the global scale from `typography.css`; `h4` falls back to the browser's size.
- `BlogArticle` keeps its font rules unchanged: `--nf-layout-blog-article-font-family`, `-font-family-code` and `-font-weight` on `p`, `strong`, `span`, `a`, `code` and `pre`.
- `BlogArticle`'s `article` element gains the class `nf-layout-blog-article-content` and is centred with a capped width: `margin-inline: auto`, `inline-size: 100%`, `max-inline-size: var(--nf-layout-blog-article-max-inline-size, var(--nf-container-small-size))`.
- New stylesheet `styles/generic.css`, declaring `--nf-container-small-size: 856px` on `:root` — a general-purpose container width meant to be reused beyond this layout. `index.css` imports it into the existing `nosferatu.tokens` layer.

Consumer-visible: yes. Removing published custom properties and changing the article's rendered size and width is a breaking change and warrants a major bump.

## Non-goals

- Changing `typography.css`'s scale, or adding an `h4` size to it.
- Adding a new cascade layer, or folding `generic.css` into `tokens.css`.
- Adding any other container size (`-medium`, `-large`) before something needs it.
- Spacing, padding or color on the layout.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `library-layouts`: `BlogArticle`'s `article` gets a class and a capped, centred measure; the fluid type-scale requirement is removed; the font requirement is unchanged.
- `library-styles`: a new exported stylesheet `generic.css` holding `--nf-container-small-size`, included by `index.css` inside `nosferatu.tokens`.

## Impact

- `packages/ui/src/layouts/BlogArticle.astro` — markup (class on `article`) and scoped style.
- `packages/ui/src/styles/generic.css` (new), `packages/ui/src/styles/index.css`.
- `docs/src/content/docs/layouts/blog-article.mdx` and `docs/src/content/docs/styles.mdx`.
- No `package.json` change: `./styles/*` is already a wildcard export, and `files: ["src"]` already ships the new file.
