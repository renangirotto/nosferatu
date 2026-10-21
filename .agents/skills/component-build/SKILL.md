---
name: component-build
description: Build or change an Astro component in packages/ui/src/components for the astro-nosferatu library. Use when adding a component, changing a component's props, markup or scoped styles, or reviewing component code against the library's invariants. Does not write documentation — see component-doc for that.
---

# Build a component

You are adding or changing a `.astro` component in `packages/ui/src/components/`. The library ships **source**: this file is compiled by the consumer's Astro build, so there is no bundler, no build step and no test runner to catch mistakes. The docs site is the integration test.

[Button.astro](../../../packages/ui/src/components/Button.astro) is the worked example throughout. Read it before you start — it is the shape every other component copies.

## Before you write anything

`openspec/specs/` is the source of truth for behaviour, not the existing code. When they disagree, the spec wins.

- [library-styles](../../../openspec/specs/library-styles/spec.md) — tokens, cascade layers, palette, how components are styled, and the specified behaviour of shipped components
- [library-package](../../../openspec/specs/library-package/spec.md) — exports, published files, peer range

**Also read the in-flight deltas.** A requirement that is being added right now lives in `openspec/changes/<change>/specs/<capability>/spec.md` and is not yet merged into `openspec/specs/`. Run `openspec list --json` for active changes and read the matching delta — if `openspec/specs/library-styles/spec.md` has nothing to say about the component you are touching, its requirements are probably sitting in one. Component behaviour belongs to the `library-styles` capability.

If the work changes specified behaviour — a prop's values, a component's appearance, anything a consumer can observe — it goes through the OpenSpec workflow first (`openspec-propose`, then `openspec-apply-change`), and the spec delta lands in the same change as the code. Never let code and spec drift. Purely internal cleanups that no consumer can observe do not need a change.

## Steps

### 1. One file, PascalCase

`packages/ui/src/components/<Name>.astro`. Adding the file publishes it — `exports` already maps `./components/*`. Do not add an index file, a barrel, a `.ts` helper, or a second file for the styles.

Indent with **tabs**, in both the frontmatter and the `<style>` block.

### 2. Type props off the native element

```astro
---
import type { HTMLAttributes } from 'astro/types';

interface Props extends HTMLAttributes<'button'> {
	color?: 'blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'yellow';
}

const { color = 'purple', type = 'button', class: className, ...attrs } = Astro.props;
---
```

- Extend `HTMLAttributes<'<element>'>` so every native attribute keeps working and stays type-checked.
- Enumerate your own props as string literal unions, never `string`. The union is the API: a wrong value must fail `astro check`. Note that `astro check` type-checks `.astro` files only — a wrong value inside an `.mdx` docs page is **not** reported, so verify a new union from a scratch `.astro` file.
- Give every added prop a default, and destructure the native defaults you want to set (`type = 'button'`).
- Pull `class` out as `className` and collect the rest in `...attrs`.

### 3. Forward everything in the markup

```astro
<button {...attrs} type={type} data-ui-color={color} class:list={['nf-button', className]}>
	<slot />
</button>
```

- Spread `{...attrs}` so `disabled`, `aria-*`, `name`, `data-*` and event attributes pass through.
- **Take the attributes you control out of `attrs`, and spread first.** Astro emits every attribute it is given, so a consumer writing `<Button data-ui-color="teal">` would produce `data-ui-color` twice — and an HTML parser keeps the *first* one, whichever order you render them in. The component would then carry a value no rule matches and render uncolored. Destructure the controlled attribute away so it can never reach the element, and still put your own derived attributes after the spread:

```astro
const { color = 'purple', type = 'button', class: className, 'data-ui-color': _controlled, ...attrs } = Astro.props;
```
- `class:list` merges the consumer's `class` with the component's own. Never interpolate `class` into a template string, and never drop it.
- Render children through `<slot />`.

### 4. Express variation as a `data-ui-*` attribute, not modifier classes

A prop that selects from a set of values is rendered as `data-ui-<prop>={value}`, and the stylesheet matches it to set **component-scoped custom properties**. The base class holds the geometry once and reads those properties.

```css
.nf-button {
	background-color: var(--nf-btn-color);
	border: var(--nf-btn-border-width) solid var(--nf-btn-accent-color);
	color: var(--nf-btn-accent-color);
}

.nf-button[data-ui-color='green'] {
	--nf-btn-color: light-dark(var(--nf-green-l-40), var(--nf-green-d-50));
	--nf-btn-accent-color: light-dark(var(--nf-green-l-80), var(--nf-green-d-90));
}
```

Why this and not `.nf-button--green`: eight hues × five colored declarations × three states is ~120 declarations as modifier classes and sixteen lines as custom properties, adding a value is two lines, and the two properties double as the documented per-instance theming hook.

Rules for those properties:

- Name them `--nf-<short component name>-<role>`: `--nf-btn-color`, `--nf-btn-accent-color`. Pick one short name per component and use it for every property that component declares.
- Declare them inside the component's own rules only. They are component-local; do **not** add them to `tokens.css`.
- Never introduce semantic tokens. `--nf-color-primary`, `--nf-color-text` and anything else matching `--nf-color-*` is banned outright.
- Keep the attribute value and the prop value identical — no mapping table in the frontmatter.
- Where the value selects a palette hue, use the same step pairing as `Button` so components agree: `light-dark(var(--nf-<hue>-l-40), var(--nf-<hue>-d-50))` for the fill, `light-dark(var(--nf-<hue>-l-80), var(--nf-<hue>-d-90))` for the accent that carries text, border and shadow.
- These properties are a **public theming hook**: document them with `component-doc` and treat a rename as a breaking change. The rule that sets them is `.nf-x[data-ui-y='…']` — specificity (0,2,0) — so a consumer overriding them *on the element itself* through a class (0,1,0) loses. That is why the documented way to re-theme a single instance is to set them on an ancestor and let them inherit.

Reach for a modifier class only when the variation changes the component's *structure or role* rather than selecting a value.

### 5. Every design value comes from a token

Every custom property the library declares — in a stylesheet or in a component — is `--nf-` prefixed. No exceptions.

Check [tokens.css](../../../packages/ui/src/styles/tokens.css) before writing a number: the scale may already have it. `--nf-font-size-md` is `1rem`, `--nf-space-2` is `0.5rem`, `--nf-space-4` is `1rem` and `--nf-radius-md` is `0.5rem` — the 1rem/8px/16px/8px a design hands you at a default root font size.

```css
font-size: var(--nf-font-size-md);
padding-block: var(--nf-space-2);
padding-inline: var(--nf-space-4);
border-radius: var(--nf-radius-md);
```

- Colors come **only** from the palette in [colors.css](../../../packages/ui/src/styles/colors.css), named `--nf-<hue>-<d|l>-<step>`. No hex, no `rgb()`, no `oklch()` literal, no new palette entries.
- `-l-` is the light scale, `-d-` the dark scale. Pair them with `light-dark()` in a single declaration rather than writing a `prefers-color-scheme` block; `reset.css` sets `color-scheme: light dark` so both branches resolve, and a consumer can pin or flip the scheme per subtree.
- A value with no token that describes *this component* (border width, shadow depth, travel distance, duration) becomes a component-scoped custom property on the root class. Do not add it to `tokens.css` — that is a published API addition and needs its own proposal.
- Hoist a raw value when the component's own states change it, or when two declarations must stay equal (`Button`'s focus outline reuses `--nf-btn-border-width`). A number that appears exactly once and never changes — `opacity: 0.5` on `:disabled` — can stay inline.

### 6. Animate state through the properties

Put the state values in the properties and let the base declarations follow:

```css
.nf-button:hover:not(:disabled) {
	--nf-btn-depth: 2px;
	--nf-btn-lift: 2px;
}
```

- Guard `:hover` and `:active` with `:not(:disabled)` — a disabled control must not react to the pointer. `:focus-visible` needs no guard; a disabled element is not focusable.
- Enumerate `transition-property` — never `transition: all`, which also animates anything a consumer adds later.
- Use the `translate` property, not `transform: translateY()`, so a consumer's own `transform` still composes.
- Animating a value that a `light-dark()` custom property feeds is fine, but keep the animated list short: a property in `transition-property` is also animated when the color scheme flips.
- **Honour reduced motion.** Hoist the duration into a property and zero it in one media query, so the states keep working and only the animation goes away:

```css
@media (prefers-reduced-motion: reduce) {
	.nf-button {
		--nf-btn-transition-duration: 0s;
	}
}
```

  Do not drop the state changes themselves — the movement *is* the feedback. Remove the animation, keep the destination.

### 7. Accessibility floor

- A visible `:focus-visible` outline, `outline-offset` clear of any border the component draws.
- A `:disabled` treatment wherever the element supports the attribute.
- Never remove an outline without replacing it.

### 8. Stay inside your own markup

Scoped `<style>` in the component file only — Astro scopes it to this component's elements.

Banned: `:global()`, bare element selectors meant to reach children a consumer passes in, styling anything the component does not render, and a second stylesheet for a component.

**Never raise specificity to win an override, and never use `!important`.** Astro's default scoping wraps the scope in `:where(…)`, which adds nothing, so `.nf-button` stays at (0,1,0) and a consumer's own class competes with it on equal terms — keep it that way. Every selector you add on top of the root class (an attribute match, a state) raises specificity for the declarations inside it, so put *only* what varies there and leave the rest on the plain root class.

## Verify

From the repository root:

```bash
pnpm build                 # docs builds against the real package exports — must pass
pnpm --filter docs check   # astro check over the site's .astro files (not its .mdx pages)
pnpm pack:check            # only needed if packages/ui/package.json or the published file set changed
```

Those three commands prove the component compiles, type-checks and ships. They check **none** of the CSS invariants — there is no test runner — so the real gate is the two steps below. Do not report the work done without them.

Grep your own file:

```bash
grep -nE "oklch\(|lab\(|hsl\(|rgb\(|color-mix\(|#[0-9a-fA-F]{3}|:global|transition: *all|--nf-color-|!important" packages/ui/src/components/<Name>.astro
grep -nE "^\s+--(?!nf-)" packages/ui/src/components/<Name>.astro   # custom properties missing the --nf- prefix
```

Any hit is a bug, not a judgement call. Check the indentation is tabs while you are in there.

Then look at it in a browser with `pnpm dev`:

- every prop value renders distinctly, and the colors are the tokens you named (read them back in devtools — do not trust a screenshot taken at load, which can catch a transition mid-flight);
- hover, press, tab to and disable the component and watch each state do what you wrote;
- flip the OS or site theme and confirm both `light-dark()` branches resolve;
- a plain element of the same kind sitting next to the component — including one carrying the same `data-ui-*` attribute — is completely unstyled by it.

## Hand-off

A component is not done until it has a docs page with a live demo. That is [component-doc](../component-doc/SKILL.md)'s job — switch to it rather than editing `docs/` from here. Hand over: the prop table (names, literal unions, defaults, straight from your `Props` interface), the custom properties a consumer may override, and what each state does.
