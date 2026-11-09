# Tasks

## 0. Prerequisite

- [x] 0.1 Archive `simplify-blog-article-styles` (complete, 9/9) so its requirements are in `openspec/specs/`; verify `openspec/specs/library-layouts/spec.md` contains `### Requirement: BlogArticle centres the article at a capped measure`

## 1. Container token and component

- [x] 1.1 Add `--nf-container-large-size: 1088px;` to `:root` in `packages/ui/src/styles/generic.css`, after `--nf-container-small-size`
- [x] 1.2 Create `packages/ui/src/components/Container.astro` following `component-build`: `interface Props extends HTMLAttributes<"div">`, destructure `class: className, ...attrs`, render `<div {...attrs} class:list={["nf-container", className]}><slot /></div>`, scoped style `.nf-container { margin-inline: auto; inline-size: 100%; max-inline-size: var(--nf-container-max-inline-size, var(--nf-container-large-size)); }` with a short comment on why the property is not declared; tabs
- [x] 1.3 Add one line to `.agents/skills/component-build/SKILL.md` step 5 naming the container width as the second allowed `var()` fallback, for the same reason as the colour default
- [x] 1.4 Run the `component-build` grep checks against `Container.astro`; the only `var(--nf-…, ` hit is the max-inline-size fallback

## 2. BlogArticle

- [x] 2.1 In `packages/ui/src/layouts/BlogArticle.astro`, import `Container` relatively (`../components/Container.astro`), wrap the `article` in `<Container>`, keep `class="nf-layout-blog-article-content"` on the `article`, delete the `.nf-layout-blog-article-content` rule, and add `--nf-container-max-inline-size: var(--nf-container-small-size);` with the other properties at the top of `.nf-layout-blog-article`; verify `grep -n "layout-blog-article-max-inline-size" packages/ui/src` returns nothing

## 3. Docs

- [x] 3.1 Create `docs/src/content/docs/components/container.mdx` with `component-doc`: import line, live demo (a container with visible content at default width and a `### Theming` demo using a `.narrow-container` class at `320px` — `component-doc` forbids theming through `style`), the native-attribute passthrough, and the property table (`--nf-container-max-inline-size` → not declared, falls back to `--nf-container-large-size`)
- [x] 3.2 Update `docs/src/content/docs/styles.mdx` container section: add `--nf-container-large-size` (`1088px`), and note that `--nf-container-max-inline-size` is the `Container` component's hook, not a token
- [x] 3.3 Update `docs/src/content/docs/layouts/blog-article.mdx`: structure shows `main > div.nf-container > article`, "The article's width" explains the layout sets the container's property to `--nf-container-small-size` with an override example on `.nf-container`, the property table drops `--nf-layout-blog-article-max-inline-size`, and a migration note says it was replaced by `--nf-container-max-inline-size`

- [x] 3.4 Drop the empty `## Props` section from `container.mdx`, move its pass-through/slot line to the end of `## Usage`, and make `component-doc` (page-structure table plus a note under `## Props`) say a component with no props of its own gets no Props section

## 4. Verification

- [x] 4.1 Run `pnpm lint`, `pnpm format:check`, `pnpm --filter docs check` and `pnpm build`; all exit 0
- [x] 4.2 Run `pnpm pack:check`; the list includes `src/components/Container.astro` and nothing outside the published set
- [x] 4.3 In `pnpm dev`, at a `1440px` window: the Container default demo fills the docs column (`670px`, narrower than `1088px`) and the class demo is `320px`; the BlogArticle demo's `article` is `856px` and centred; at `600px` both fill their parent with no horizontal scroll; setting `--nf-container-max-inline-size: 640px` on the article's `.nf-container` in devtools caps it at `640px`
- [x] 4.4 Run `openspec validate add-container-component --strict`; it passes
