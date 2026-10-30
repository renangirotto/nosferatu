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
import type { ColorPalette } from '../types/components';

interface Props extends HTMLAttributes<'button'> {
	color?: ColorPalette;
}

const { color, type = 'button', class: className, ...attrs } = Astro.props;
---
```

- Extend `HTMLAttributes<'<element>'>` so every native attribute keeps working and stays type-checked.
- Reuse a shared prop type when one exists: the palette hues are `ColorPalette` in [src/types/components.ts](../../../packages/ui/src/types/components.ts), and a type two components need belongs there rather than restated in each.
- **Import internal modules by relative path — never through the `@/*` alias.** The alias is real (`packages/ui/tsconfig.json` maps it, and the docs site mirrors it), but it is for code that is _not_ published. A consumer compiles this file without the library's `tsconfig.json`, so `@/types/components` resolves to nothing on their side: the build still passes, because `import type` is erased, and the prop quietly becomes `any` — a wrong `color` stops being an error in their editor and their `astro check`. Measured, not theoretical.
- Enumerate your own props as string literal unions, never `string`. The union is the API: a wrong value must fail `astro check`. Note that `astro check` type-checks `.astro` files only — a wrong value inside an `.mdx` docs page is **not** reported, so verify a new union from a scratch `.astro` file.
- Give every added prop a default, and destructure the native defaults you want to set (`type = 'button'`). **`color` is the exception: it has no default in the frontmatter.** Leave it `undefined` and the component renders grey through a CSS fallback (step 4b), with no `data-ui-color` attribute — Astro omits an attribute whose value is `undefined`, so `data-ui-color={color}` needs no conditional.
- Pull `class` out as `className` and collect the rest in `...attrs`.

### 3. Forward everything in the markup

```astro
<button {...attrs} type={type} data-ui-color={color} class:list={['nf-button', className]}>
	<slot />
</button>
```

- Spread `{...attrs}` so `disabled`, `aria-*`, `name`, `data-*` and event attributes pass through.
- **Take the attributes you control out of `attrs`, and spread first.** Astro emits every attribute it is given, so a consumer writing `<Button data-ui-color="teal">` would produce `data-ui-color` twice — and an HTML parser keeps the _first_ one, whichever order you render them in. The component would then carry a value no rule matches, and — worse — with no `color` passed it would carry an attribute it should not have at all. Destructure the controlled attribute away so it can never reach the element, and still put your own derived attributes after the spread:

```astro
const { color, type = 'button', class: className, 'data-ui-color': _controlled, ...attrs } = Astro.props;
```

- `class:list` merges the consumer's `class` with the component's own. Never interpolate `class` into a template string, and never drop it.
- Render children through `<slot />`.

### 4. Express variation as a `data-ui-*` attribute, not modifier classes

A prop that selects from a set of values is rendered as `data-ui-<prop>={value}`, and the stylesheet matches it to set **component-scoped custom properties**. The base class holds the geometry once and reads those properties.

```css
.nf-button {
	background-color: var(--nf-button-color, light-dark(var(--nf-grey-l-40), var(--nf-grey-d-50)));
	border: var(--nf-button-border-width) solid var(--nf-button-accent-color, light-dark(var(--nf-grey-l-80), var(--nf-grey-d-90)));
	color: var(--nf-button-accent-color, light-dark(var(--nf-grey-l-80), var(--nf-grey-d-90)));
}

.nf-button[data-ui-color='green'] {
	--nf-button-color: light-dark(var(--nf-green-l-40), var(--nf-green-d-50));
	--nf-button-accent-color: light-dark(var(--nf-green-l-80), var(--nf-green-d-90));
}
```

Why this and not `.nf-button--green`: eight hues × five colored declarations × three states is ~120 declarations as modifier classes and sixteen lines as custom properties, adding a value is two lines, and the two properties double as the documented per-instance theming hook.

Rules for those properties:

- Name them `--nf-<component name>-<role>`, with the component's **full** name, lowercased: `--nf-button-color`, `--nf-callout-surface-color`. Never abbreviate it — `--nf-btn-*` and `--nf-cal-*` are wrong. The name a consumer overrides should be guessable from the component they are using.
- Declare them inside the component's own rules only. They are component-local; do **not** add them to `tokens.css`.
- Never introduce semantic tokens. `--nf-color-primary`, `--nf-color-text` and anything else matching `--nf-color-*` is banned outright.
- Keep the attribute value and the prop value identical — no mapping table in the frontmatter.
- Where the value selects a palette hue, use the same step pairing as `Button` so components agree: `light-dark(var(--nf-<hue>-l-40), var(--nf-<hue>-d-50))` for the fill, `light-dark(var(--nf-<hue>-l-80), var(--nf-<hue>-d-90))` for the accent that carries text, border and shadow.
- These properties are a **public theming hook**: document them with `component-doc` and treat a rename as a breaking change. When the attribute is present, the rule that sets them is `.nf-x[data-ui-y='…']`, which declares them _on the element_ — so an ancestor's value cannot reach it (a declaration on the element always beats an inherited one), and a consumer class on the element (0,1,0) loses on specificity (0,2,0). Such an instance is re-themed through its own `style`. An instance with no `color` declares nothing, so it takes the properties from an ancestor too.

### 4b. The default color is grey, and lives in a `var()` fallback

A component with a `color` prop has no default hue in its markup. Every **use** of a color property falls back to the same grey `light-dark()` pairing that the component's own `[data-ui-color='grey']` rule sets:

```css
.nf-button {
	background-color: var(--nf-button-color, light-dark(var(--nf-grey-l-40), var(--nf-grey-d-50)));
	color: var(--nf-button-accent-color, light-dark(var(--nf-grey-l-80), var(--nf-grey-d-90)));
}
```

- Put the fallback on **every** use site of every color property — background, text, shadow, outline, border — and inside a composed property such as `Callout`'s `--nf-callout-shadow`.
- The fallback must equal the component's grey rule exactly, so `<X>` and `<X color="grey">` render identically; keep the grey rule too, so explicit grey behaves like every other hue.
- Do **not** declare the grey values on the root class instead. That declares them on the element, and an ancestor could no longer theme an uncolored instance.
- Consequence to document: an uncolored instance nested inside a colored instance of the same component inherits the outer hue.

Reach for a second class only when the variation changes the component's _structure or role_ rather than selecting a value — and name it like any other part (below), never as a BEM modifier.

### 4a. Class names: `nf-<component>-<part>`, no BEM

The root class is `nf-<component name>`, lowercased: `.nf-button`, `.nf-callout`. Every other element the component renders gets `nf-<component name>-<part>`, with plain hyphens:

```astro
<aside class:list={['nf-callout', className]}>
	<p class="nf-callout-title">…</p>
	<div class="nf-callout-body">…</div>
</aside>
```

**No BEM.** `__element` and `--modifier` separators are not used anywhere in this project. Astro already scopes every one of these selectors to this component's markup, so the double-underscore exists only to buy a global uniqueness the styles do not need — the hyphen says the same thing and reads better. A part name may itself contain hyphens (`.nf-callout-icon-badge`); the pattern is a prefix, not a two-level grammar.

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
- A value with no token that describes _this component_ (border width, shadow depth, travel distance, duration) becomes a component-scoped custom property on the root class. Do not add it to `tokens.css` — that is a published API addition and needs its own proposal.
- Hoist a raw value when the component's own states change it, or when two declarations must stay equal (`Button`'s focus outline reuses `--nf-button-border-width`). A number that appears exactly once and never changes — `opacity: 0.5` on `:disabled` — can stay inline.
- **Declare a property, do not rely on a `var()` fallback.** `box-shadow: 0px var(--nf-button-depth, 4px) 0px …` hides the default inside a use site: a reader cannot see what the component's resting depth is without finding every reference, and two references can disagree (the focus outline once read `var(--nf-button-outline-width, 2px)` with `calc(-1 * var(--nf-button-outline-width, 1px))` beside it, so the inset silently did not match the width). Declare it once with its real value and use it bare. **The one exception is the default color** (step 4b): there the fallback is the point, because declaring the value would put it on the element and block ancestor theming.

### 5a. Custom properties go at the top of their selector

Inside any rule, every `--nf-*` declaration comes **first**, as a block, before the first ordinary property:

```css
.nf-callout {
	--nf-callout-icon-size: var(--nf-font-size-xl);
	--nf-callout-shadow: var(--nf-shadow-depth) var(--nf-callout-shadow-color);

	border: none;
	border-radius: var(--nf-radius-md);
	color: var(--nf-callout-accent-color);
}
```

This holds for every selector — the root class, each `[data-ui-*]` block, each state, each part. A rule that sets only custom properties (a hue block, a `:hover`) is already in that shape. The payoff is that a component's whole API is readable from the first few lines of each rule, instead of being scattered between the declarations that consume it.

### 6. Animate state through the properties

Put the state values in the properties and let the base declarations follow:

```css
.nf-button:hover:not(:disabled) {
	--nf-button-depth: 2px;
	--nf-button-lift: 2px;
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
		--nf-button-transition-duration: 0s;
	}
}
```

Do not drop the state changes themselves — the movement _is_ the feedback. Remove the animation, keep the destination.

### 7. Accessibility floor

- A visible `:focus-visible` outline, `outline-offset` clear of any border the component draws.
- A `:disabled` treatment wherever the element supports the attribute.
- Never remove an outline without replacing it.

### 8. Stay inside your own markup

Scoped `<style>` in the component file only — Astro scopes it to this component's elements.

Banned: `:global()`, bare element selectors meant to reach children a consumer passes in, styling anything the component does not render, and a second stylesheet for a component.

**Never raise specificity to win an override, and never use `!important`.** Astro's default scoping wraps the scope in `:where(…)`, which adds nothing, so `.nf-button` stays at (0,1,0) and a consumer's own class competes with it on equal terms — keep it that way. Every selector you add on top of the root class (an attribute match, a state) raises specificity for the declarations inside it, so put _only_ what varies there and leave the rest on the plain root class.

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
grep -nE "class=\"[^\"]*(__|--)" packages/ui/src/components/<Name>.astro   # BEM separators in class names
grep -nE "var\(--nf-[a-z-]+, " packages/ui/src/components/<Name>.astro | grep -v "light-dark(var(--nf-grey-"   # defaults hidden in a var() fallback (the grey color default is allowed)
grep -nE "from \"@/|from '@/" packages/ui/src/components/<Name>.astro        # alias import that a consumer cannot resolve
```

Any hit is a bug, not a judgement call. Check the indentation is tabs while you are in there, that every class matches `nf-<component>-<part>`, and that each rule declares its `--nf-*` properties before its first ordinary property.

Then look at it in a browser with `pnpm dev`:

- every prop value renders distinctly, and the colors are the tokens you named (read them back in devtools — do not trust a screenshot taken at load, which can catch a transition mid-flight);
- hover, press, tab to and disable the component and watch each state do what you wrote;
- flip the OS or site theme and confirm both `light-dark()` branches resolve;
- a plain element of the same kind sitting next to the component — including one carrying the same `data-ui-*` attribute — is completely unstyled by it.

## Hand-off

A component is not done until it has a docs page with a live demo. That is [component-doc](../component-doc/SKILL.md)'s job — switch to it rather than editing `docs/` from here. Hand over: the prop table (names, literal unions, defaults, straight from your `Props` interface), the custom properties a consumer may override, and what each state does.
