# Design

## Context

`BaseHead` imports `index.css`, so every `BlogArticle` page already has `typography.css` (in `nosferatu.typography`) sizing `h1`–`h3` and `p`. The layout's scoped `<style>` is unlayered, so its own scale currently wins inside the article. See proposal.md — Why.

## Goals / Non-Goals

**Goals:**

- One type scale on an article page: the global one.
- A centred, capped article whose cap a consumer can move per article or site-wide.
- A reusable container width token that is not tied to this layout.

**Non-Goals:**

- Any new cascade layer, or any change to `tokens.css`.

## Decisions

### `generic.css` is imported by `index.css` into `nosferatu.tokens`, not through `tokens.css`

`index.css` gains `@import "./generic.css" layer(nosferatu.tokens);` between the `tokens.css` and `reset.css` imports. The layer statement stays `nosferatu.tokens, nosferatu.reset, nosferatu.typography`.

- _Alternative — import it from `tokens.css`_: would keep "`tokens.css` is every token" literally true, but the request names `index.css`, and `--nf-container-small-size` is a layout measure rather than a design token group like color or spacing.
- _Alternative — a new `nosferatu.generic` layer_: rejected, it bends invariant 3 (fixed layer order) for no gain; a `:root` custom property needs no layer of its own.

Upholds invariants 1 (`--nf-` prefix), 3 (layer order unchanged, unlayered consumer CSS still wins) and 4 (`generic.css` imports on its own, unlayered).

### The layout reads an undeclared property with a token fallback

```css
.nf-layout-blog-article-content {
	margin-inline: auto;
	inline-size: 100%;
	max-inline-size: var(--nf-layout-blog-article-max-inline-size, var(--nf-container-small-size));
}
```

The layout does **not** declare `--nf-layout-blog-article-max-inline-size`. Because it is never declared by the library, a consumer can set it anywhere up the tree (`:root`, the hook, the article) and it always wins without a specificity or order contest — unlike the font properties, which the layout declares on the hook and a consumer must therefore override on the same selector.

- _Alternative — declare it on the hook, like the font properties_: consistent with the existing pattern, but makes the override order-dependent against Astro's scoped rule; the fallback form is strictly easier to override.
- _Alternative — literal `856px` fallback_: rejected per request; the cap must follow `--nf-container-small-size` so one change moves every container that uses it.

Fallback chain when nothing is loaded: if a consumer somehow renders the layout without `index.css`, `--nf-container-small-size` is undefined, `max-inline-size` is invalid at computed-value time and resolves to `none` — the article is full width, exactly today's behaviour. `BaseHead` always loads `index.css`, so in practice this does not occur.

### Class name `nf-layout-blog-article-content`

Follows the non-BEM `.nf-<component>-<part>` convention with the layout's full name. `article` would read as `nf-layout-blog-article-article`; `content` names the role. Only the `article` gains a class — the `h1` and `p` stay class-free, as the spec requires.

### The scoped style keeps only the font block and the new rule

Everything from `--nf-layout-blog-article-viewport-min` down to the `h1`–`h4` and `p` `font-size` rules is deleted. The `p` rule keeps `font-family` and `font-weight`; `strong, span, a` and `code, pre` rules are untouched, comments included.

## Risks / Trade-offs

- [Breaking: consumers overriding the removed properties silently lose the effect] → REMOVED requirement carries a migration; docs page lists the removed names; flag for a major bump at archive.
- [`h4` inside an article drops from `~1.5×` base to the browser default, since `typography.css` does not size `h4`] → accepted and stated in docs; adding `h4` to the global scale is a separate change.
- [Article text gets visibly larger: global `h1` max is `3.5rem` vs the layout's `~3.18rem`] → expected outcome of having one scale; noted in docs.

## Migration Plan

Consumers delete overrides of the removed `--nf-layout-blog-article-*` size properties and, if they had hand-written `max-width`/`margin-inline: auto` on the hook, can drop it or switch to `--nf-layout-blog-article-max-inline-size`. Rollback is a revert of the change commit.
