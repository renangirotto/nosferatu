---
name: component-doc
description: Document an astro-nosferatu component on the Starlight docs site under docs/src/content/docs/components. Use when adding a component's documentation page, updating a page after a component's props or styling changed, or reviewing a page for the required sections. Does not change library source — see component-build for that.
---

# Document a component

You are writing or updating one page under `docs/src/content/docs/components/`. The docs site is private and never published, and it is also the project's integration test: it consumes the library exactly the way a real consumer does, so a page that builds proves the public exports work.

[button.mdx](../../../docs/src/content/docs/components/button.mdx) is the worked example. Read it before you start.

## Before you write anything

`openspec/specs/` is the source of truth for what a page must contain and for any component behaviour that is specified:

- [documentation-site](../../../openspec/specs/documentation-site/spec.md) — what a docs page must contain
- [library-styles](../../../openspec/specs/library-styles/spec.md) — component styling rules, and the specified behaviour of any component that has requirements there

Two things that spec will not give you:

- **The component's actual props.** Read `packages/ui/src/components/<Name>.astro` for the `Props` interface, the defaults, the attribute it renders, and its scoped `<style>` for the custom properties a consumer can override. A spec may not enumerate them.
- **In-flight requirements.** A requirement being added or changed right now lives in a delta under `openspec/changes/<change>/specs/<capability>/spec.md`, not yet in `openspec/specs/`. Check `openspec list --json` for active changes and read the matching delta before deciding a page is complete; the delta is what the change will be judged against.

Document what the spec says and the component does. If you find a disagreement between them, stop and report it — do not paper over it in prose. If the work changes specified behaviour of the site or the component, it goes through the OpenSpec workflow (`openspec-propose`, then `openspec-apply-change`) with the spec delta in the same change.

## Steps

### 1. One page per component

`docs/src/content/docs/components/<name>.mdx`, kebab-case of the component name (`Button` → `button.mdx`, `ButtonGroup` → `button-group.mdx`). The sidebar is `autogenerate`d from that directory — **never edit `astro.config.mjs`** to add a page.

Frontmatter is `title` (the component name) and `description` (what it is and what drives it):

```mdx
---
title: Button
description: A raised button whose palette hue is chosen with the color prop and driven by --nf-button-* custom properties.
---
```

### 2. Import through the package name

```mdx
import Button from 'astro-nosferatu/components/Button.astro';
```

Only this form. A relative path into `../../../../packages/ui/src` defeats the point of the docs site and breaks the documentation-site spec — it would keep building after the export was removed.

Show the reader the same line in a fenced `astro` block right under the import, then a first live demo.

The library's styles load globally through `customCss` in `astro.config.mjs`; never import `index.css` in a page.

### 3. Required sections

Every page has these, in this order. The heading is given — use it verbatim, as `##`, so every component page reads the same way:

1. _(no heading)_ **Import line** — the live `import`, then the same import in an `astro` code block, then one plain demo of the component with no props set.
2. `## <Prop>s` — **one demo per value of every enumerated prop the component declares itself** (`## Colors` for `color`, `## Sizes` for `size`). All of them, each labelled with the literal value that produces it. A reader must never have to guess what `color="cyan"` looks like. One section per such prop. For `color`, put an uncolored instance first, captioned `default`, and say in prose that leaving `color` out renders grey with **no** `data-ui-color` attribute, while `color="grey"` looks the same but carries the attribute. A native attribute you merely default (`type` on a button) is **not** one of these — it belongs in the props table only.
3. `## States` — what hover, active, focus and disabled do, in prose, next to a demo the reader can actually hover and press. Cover every state the component's CSS defines, including the dull ones: cursor, opacity, and which of them are animated.
4. `## Light and dark` — only if the component uses `light-dark()`. See step 6.
5. `## Props` — a table of every prop the component declares itself, with type, default and a note, plus any native attribute the component defaults. `color`'s default is written `grey (unset)`, never a hue, with a note that the attribute is rendered only when the prop is passed. Then one line stating that all other native attributes pass through.
6. `## Theming` — how to re-theme, live, with the exact code shown.
7. `## Scoped styles` — the component beside a plain element of the same kind, proving the component's styles do not leak.

Write the type column exactly as the component declares it, escaping the unions for the table: `` `'blue' \| 'cyan' \| …` ``.

If a component has no enumerated prop, no interactive states, or nothing themable, **drop that section** rather than writing a section that says "none".

### 4. Every demo is live, and every demo shows its code

````mdx
<div class="not-content demo">
	<Button color="green">Button</Button>
</div>

```astro
<Button color="green">Button</Button>
```
````

- `class="not-content"` keeps Starlight's prose styles off the demo.
- The code block shows the markup a reader would copy into their own page: the component calls themselves, without the `not-content demo` wrapper or any layout scaffolding the page added around them. What is inside the code block must be exactly what produced the demo above it.
- Every demo gets a code block — including the scoped-styles demo at the end.
- Keep the demo wrapper styling in one `<style>{`…`}</style>` block at the bottom of the page, scoped to `.demo`, and reuse Starlight's `--sl-*` variables for the chrome around the demo. There is no shared stylesheet — each page carries its own copy. The baseline is a flex row, plus a `.demo--grid` modifier for the labelled per-value grid:

```css
.demo {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.75rem;
	padding: 1.5rem;
	margin-block: 1rem;
	border: 1px solid var(--sl-color-gray-5);
	border-radius: 0.5rem;
}

.demo--grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
	gap: 1.25rem;
}
```

- Label a per-value demo with a `<figure>` + `<figcaption>` holding the literal value in `<code>`.

### 5. Theming demos override properties, never selectors

Show both levels when the component has them:

- the component's own custom properties (`--nf-button-color`, `--nf-button-accent-color`): on a wrapper for an instance with no `color`, and through `style` on the element for one that has a `color` — its `[data-ui-color]` rule declares them on the element, so an inherited value cannot win. Show both, and say so;
- a palette token on a wrapper, which re-themes every instance using that token.

Use unlayered `style="…"` on the wrapper — that is what a consumer would write, and it demonstrates that consumer CSS wins without `!important`.

### 6. Light and dark

If the component resolves colors with `light-dark()`, say which tokens each branch uses, mention that `reset.css` sets `color-scheme: light dark`, and show how a consumer pins a scheme. Starlight's own theme toggle drives `color-scheme` on this site, so a reader can verify it by flipping the toggle.

## Verify

From the repository root:

```bash
pnpm --filter docs check   # astro check over the site
pnpm build                 # must pass; this is what proves the exports resolve
```

Then read the page in `pnpm dev` and confirm, in the browser:

- every documented value renders a visibly distinct demo;
- hover, press, tab to and disable the component and watch the documented behaviour actually happen, in both themes;
- the theming demo looks different from the default;
- the plain element in the scoped-styles demo is untouched.

A page that builds but describes behaviour the component does not have is a failed page.

## Hand-off

If the component itself needs to change — a prop, its markup, its styles — that is [component-build](../component-build/SKILL.md)'s job. Do not edit `packages/ui/src/` from here.
