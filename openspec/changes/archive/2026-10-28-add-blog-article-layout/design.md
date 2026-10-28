# Design

## Context

See [proposal.md](proposal.md) — Why. The constraints that shape this change:

- The package publishes source and exposes exactly two public path patterns today (`./components/*`, `./styles/*`). `files: ["src"]` already ships everything under `src/`, so a new directory is *published* the moment it exists but stays *unreachable* until `exports` grows a pattern — that asymmetry is deliberate, and widening `exports` is explicitly gated on an approved change ([packages/ui/AGENTS.md](../../../packages/ui/AGENTS.md)).
- The library's invariants are written for *components*: self-styled through `--nf-*` tokens, scoped `<style>` only, never a selector reaching outside the component's own markup. A layout is the first thing in the package that legitimately owns `<html>` and `<body>`, so the relationship between those invariants and layouts needs to be stated rather than assumed.
- Starlight pages cannot embed a layout that emits its own doctype and `<html>`, so the documentation-site requirement for a live demo cannot be met the way component pages meet it.

## Goals / Non-Goals

**Goals:**

- Establish `layouts` as a third published surface with the same source-shipping, zero-dependency properties as the other two.
- Land `BlogArticle`'s markup contract and its `.nf-layout-blog-article` hook exactly as specified, so a later styling change is purely additive CSS.
- Keep the docs site honest about a surface it cannot demo inline.

**Non-Goals:**

- Choosing the layout's visual design, spacing scale or measure — the `<style>` block ships empty on purpose.
- Generalising the layout: no shared base layout, no head-extension slot, no per-page `lang`/`og:` metadata API. Those are separate proposals once a second layout exists to generalise *from*.
- Extending `component-build`/`component-doc` to layouts.

## Decisions

### Layouts get their own directory and their own `exports` pattern

`packages/ui/src/layouts/` + `"./layouts/*": "./src/layouts/*"`, mirroring `components`. The alternative — shipping `BlogArticle.astro` under `src/components/` — would have been zero manifest churn, but it conflates a page-level document with a fragment, makes `astro-nosferatu/components/BlogArticle.astro` the public name of something that is not a component, and leaves no room to state different authoring rules for the two. The `exports` map stays an explicit allowlist: nothing else becomes reachable.

### The layout owns the whole document, including head metadata

The props are consumed twice: `title` renders as the `h1` *and* as `<title>`; `description` renders as the `p` *and* as the description meta. That is the point of a layout that a page file can be the whole of — a consumer never writes a `<head>`. The shell stays minimal and non-negotiable: doctype, `<html lang="en">`, `<meta charset="utf-8">`, `<meta name="viewport">`, `<title>`, `<meta name="description">`. No canonical URL, no Open Graph, no favicon, no stylesheet link — anything the layout cannot know for every consumer stays out rather than being guessed and then needing a breaking removal.

`lang="en"` is hard-coded because the spec defines exactly two props and adding a third now would pre-empt the metadata API this change defers. It is recorded as a known limitation below, not as an oversight.

### `.nf-layout-blog-article` is the only class, and it is unstyled

Naming follows the component rule one level out: the root hook is `nf-layout-<name>`, prefixed and not BEM. The `h1` and `p` get no class of the library's own — a consumer reaches them with `.nf-layout-blog-article h1`, which is a descendant of the hook and therefore still a contract the layout controls.

The `<style>` block is written empty rather than omitted: it marks where the styling change lands and keeps the file's shape consistent with every other `.astro` file in the package. Astro emits no CSS for an empty block, so the rendered page carries no library styling at all — which is what the spec's "no design values" scenario checks.

It is not inert in the markup, though. Declaring any `<style>` block, empty included, makes Astro scope the component and stamp its generated scope — an `astro-<hash>` class in this build — onto every element the layout renders, the `h1` and the `p` among them. Keeping the marker was chosen over perfectly bare markup, so the spec now says those two carry no *library-authored* class rather than no class at all. Astro's scope is generated, its form follows the consumer's own `scopedStyleStrategy`, and it is not a hook the library offers or documents: a consumer still targets `.nf-layout-blog-article` and its descendants. The alternatives were dropping the block (bare markup, no marker) and `is:global` (no scope, but it breaks the scoped-styles-only convention before a single rule exists).

This is also where the component invariants are *bent, on purpose*: a layout's markup legitimately includes `<html>` and `<body>`, so a future styling change may style them — but only as the layout's own elements, never via `:global` reaching into slot content. The "no selector outside its own markup" invariant holds; what counts as "its own markup" is simply larger for a layout. Nothing bends today, since no rule is written.

### No prop forwarding, no `class` merging

Components extend `HTMLAttributes<'element'>`, merge a consumer `class` and spread the rest. `BlogArticle`'s `Props` is a plain interface with two required strings. There is no single native element to type against (`<html>`? `<main>`?), and silently spreading arbitrary attributes onto a document element would make the markup contract untrue. A consumer that needs its own class on `main` is better served by a later explicit prop than by an ambiguous spread.

### Docs: a documentation page plus a standalone rendered example

The layout page under `docs/src/content/docs/layouts/` carries the import line, usage code, the produced markup, the props table and the styling note; a standalone Astro page outside the Starlight content collection (`docs/src/pages/examples/blog-article.astro`) is built *with* the layout and linked from it. That satisfies "see it rendered for real" without nesting one document inside another, and it makes the docs build fail if the layout export breaks — which is the point of the docs-consume-the-exports requirement.

The sidebar autogenerates only the `components` directory, so `docs/astro.config.mjs` gains one `Layouts` group. The example page lives under `src/pages/`, not the content collection, so it is not swept into the sidebar.

## Risks / Trade-offs

- **`lang="en"` is wrong for non-English consumers, and the layout gives no way to change it** → Accepted for this change and recorded in the docs page as a known limitation; the metadata/`lang` API arrives with the second layout, which is when the right shape will be visible.
- **A minimal `<head>` will not satisfy anyone shipping a real blog (no canonical, no OG tags, no stylesheet link)** → Consumers can still import the library stylesheet in their own entry; the alternative, guessing a metadata API now, risks a breaking change later. The docs page states what the head contains so there is no surprise.
- **An empty `<style>` block may read as unfinished work and get deleted by a drive-by edit** → The spec pins the unstyled state with two scenarios, and the docs page states it; a deletion is then a visible spec violation rather than a judgement call.
- **Widening `exports` is irreversible in practice** — `astro-nosferatu/layouts/*` becomes a supported path the moment it publishes → Mitigated by the allowlist staying narrow: one new pattern, no `./*` wildcard, no `files` change.
- **The standalone example page is outside Starlight's chrome and easy to forget when the layout changes** → It is imported through the package name, so `pnpm build` breaks if the export breaks; the content drift risk is small and the page is tiny.
