# astro-nosferatu (library)

The published package. Everything here ends up in consumers' projects as **source**, compiled by their Astro build.

## Layout

```
src/components/   .astro components, one file per component, PascalCase
src/styles/       tokens.css colors.css reset.css typography.css index.css
```

`index.css` only declares the layer order and `@import`s the other four into their layers — put real declarations in the specific stylesheet, never in `index.css`.

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
4. Style in the component's own scoped `<style>` block. Root class `nf-<name>`. Render a value-selecting prop as `data-ui-<prop>` and match it in CSS to set component-scoped `--nf-*` custom properties that the root class reads — not as a `nf-<name>--<value>` modifier.
5. Reference every design value through `var(--nf-*)` — spacing, radius, fonts from [tokens.css](src/styles/tokens.css), colors from [colors.css](src/styles/colors.css). No literal colors, no hard-coded px/rem for spacing, no `--nf-color-*`.
6. Include a visible `:focus-visible` outline and a `:disabled` treatment where the element supports them; use `:hover:not(:disabled)` for hover states.
7. Never style anything outside the component's own markup (no bare `button`, no `:global`).
8. Document it in [docs](../../docs) — a component without a docs page with a live demo violates the documentation-site spec.

## Exports

`exports` in [package.json](package.json) deliberately exposes only `./components/*`, `./styles/*` and `./package.json`. Adding a file under those directories publishes it automatically; anything else stays unreachable by design. Do not widen `exports`, add `dependencies`, loosen the `astro` peer range, or extend `files` beyond `src` without an approved change.

## Checks

```
pnpm pack:check     # from the repo root — what would actually be published
pnpm build          # docs build resolves the package exports for real
```
