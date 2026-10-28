# astro-nosferatu (library)

The published package. Everything here ends up in consumers' projects as **source**, compiled by their Astro build.

## Layout

```
src/components/   .astro components, one file per component, PascalCase
src/layouts/      .astro page layouts, one file per layout, PascalCase
src/styles/       tokens.css colors.css shadows.css reset.css index.css
src/types/        shared prop types (ColorPalette), published but not exported
```

`index.css` only declares the layer order and `@import`s the other four into their layers — put real declarations in the specific stylesheet, never in `index.css`.

A **component** renders a fragment; a **layout** renders the whole document — doctype, `<html>`, `<head>` and `<body>` — so a consumer's page file can be nothing but the layout and its content. A layout takes explicit props only: no `HTMLAttributes` extension, no `class:list` merge, no `{...attrs}` spread, because the markup it renders is its contract. Its root class is `nf-layout-<name>`, and it is documented under `docs/src/content/docs/layouts/` with a standalone rendered example page, since a document cannot be demoed inside a docs page.

## Adding or changing a component

The `component-build` skill in [.agents/skills/component-build](../../.agents/skills/component-build/SKILL.md) is the full procedure; this is the summary.

1. Confirm the behaviour against [library-styles](../../openspec/specs/library-styles/spec.md) and [library-package](../../openspec/specs/library-package/spec.md) first.
2. Create `src/components/<Name>.astro` with tab indentation.
3. Type props off the native element and forward the rest:
   ```astro
   interface Props extends HTMLAttributes<'button'> { color?: 'blue' | 'green' | 'purple' }
   const { color = 'purple', class: className, ...attrs } = Astro.props;
   ```
   Merge the consumer `class` with `class:list` and spread `{...attrs}` so native attributes keep working.
4. Style in the component's own scoped `<style>` block. Root class `nf-<name>`, other parts `nf-<name>-<part>` — no BEM `__`/`--` separators. Render a value-selecting prop as `data-ui-<prop>` and match it in CSS to set component-scoped `--nf-<name>-<role>` custom properties (the component's full name, so `--nf-callout-surface-color`) that the root class reads — not as a `nf-<name>--<value>` modifier. Declare those properties at the top of each rule, above the ordinary declarations.
5. Share prop types through `src/types/` (`ColorPalette` for the palette hues) and import them **relatively** — `../types/components`, never `@/types/components`. The `@/*` alias exists in `tsconfig.json` for local type-checking only; a consumer compiles this source without that config, so an aliased type import silently degrades the prop to `any`.
6. Reference every design value through `var(--nf-*)` — spacing, radius, fonts from [tokens.css](src/styles/tokens.css), colors from [colors.css](src/styles/colors.css). No literal colors, no hard-coded px/rem for spacing, no `--nf-color-*`.
7. Include a visible `:focus-visible` outline and a `:disabled` treatment where the element supports them; use `:hover:not(:disabled)` for hover states.
8. Never style anything outside the component's own markup (no bare `button`, no `:global`).
9. Document it in [docs](../../docs) — a component without a docs page with a live demo violates the documentation-site spec.

## Exports

`exports` in [package.json](package.json) deliberately exposes only `./components/*`, `./layouts/*`, `./styles/*` and `./package.json`. Adding a file under those directories publishes it automatically; anything else stays unreachable by design. Do not widen `exports`, add `dependencies`, loosen the `astro` peer range, or extend `files` beyond `src` without an approved change.

## Checks

```
pnpm pack:check     # from the repo root — what would actually be published
pnpm build          # docs build resolves the package exports for real
```
