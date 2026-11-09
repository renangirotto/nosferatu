---
name: component-doc
description: Document an astro-nosferatu component from packages/ui/src/components on the Starlight docs site under docs/src/content/docs/components. Use when adding a component's documentation page, updating a page after a component's props or styling changed, or reviewing a page for the required sections. Does not change library source — see component-build for that.
---

# Document a component

This skill is **only** for the components that live in `packages/ui/src/components/`. Each one gets one page under `docs/src/content/docs/components/`. Layouts, html files and stylesheets are out of scope — their pages follow their own requirements in the documentation-site spec.

The docs site is private and never published, and it is also the project's integration test: it consumes the library exactly the way a real consumer does, so a page that builds proves the public exports work.

[button.mdx](../../../docs/src/content/docs/components/button.mdx) is the worked example. Read it before you start.

## Before you write anything

`openspec/specs/` is the source of truth for what a page must contain and for any component behaviour that is specified:

- [documentation-site](../../../openspec/specs/documentation-site/spec.md) — what a component page must contain
- [library-styles](../../../openspec/specs/library-styles/spec.md) — component styling rules, and the specified behaviour of any component that has requirements there

Two things that spec will not give you:

- **The component's actual props.** Read `packages/ui/src/components/<Name>.astro` for the `Props` interface, the defaults, the native element it extends, its slots, and its scoped `<style>` for the custom properties a consumer can override.
- **In-flight requirements.** A requirement being added or changed right now lives in a delta under `openspec/changes/<change>/specs/<capability>/spec.md`. Check `openspec list --json` for active changes and read the matching delta before deciding a page is complete.

Document what the spec says and the component does. If they disagree, stop and report it — do not paper over it in prose. If the work changes specified behaviour of the site or the component, it goes through the OpenSpec workflow (`openspec-propose`, then `openspec-apply-change`) with the spec delta in the same change.

## Writing rules

- **Short and direct.** Say what the reader needs to use the component, nothing more.
- **Do not explain internals**: how the animation works, how the base styles are built or loaded, how `data-ui-*` attributes drive the styling, which palette steps each scheme uses.
- Saying in one line that the component is built on a native element (`<button>`, `<details>`) is welcome.
- No `Scoped styles`, `Content`, `Slots`, `Light and dark` or `Animation` section.
- If a component has no `color`, no states or no icon prop, **drop that section** — never write a section saying "none".

## Page structure

The page is `docs/src/content/docs/components/<kebab-name>.mdx` (`Button` → `button.mdx`, `ButtonGroup` → `button-group.mdx`). The sidebar is `autogenerate`d from that directory — **never edit `astro.config.mjs`** to add a page.

Every page has these parts, in this order. Headings are verbatim:

| Part                    | Heading             | When                                   |
| ----------------------- | ------------------- | -------------------------------------- |
| Title                   | frontmatter `title` | always — the component name            |
| Short description       | _(none)_            | always — one or two sentences          |
| Light and dark + switch | _(none)_            | always                                 |
| Usage                   | `## Usage`          | always                                 |
| Color variants          | `## Color variants` | only if the component has `color`      |
| States                  | `## States`         | only if the component has states       |
| Icons                   | `## Icons`          | only if the component has an icon prop |
| Props                   | `## Props`          | only if the component has its own prop |
| CSS Variables           | `## CSS Variables`  | always                                 |
| Theming                 | `### Theming`       | always, inside `CSS Variables`         |

### Top of the page

```mdx
---
title: Button
description: A raised button in any palette hue.
---

import Button from 'astro-nosferatu/components/Button.astro';
import DarkModeSwitch from '@/components/DarkModeSwitch.astro';

A raised button built on the native `<button>` element.

Every component is built for both light and dark color schemes. Switch the site's theme to see this one in each:

<DarkModeSwitch />
```

`DarkModeSwitch` is a docs-only component in `docs/src/components/`; it flips the whole site between dark and light. The `@/` alias is fine here because it points into the docs site, not the library.

Import the component **only** through the package name, `astro-nosferatu/components/<Name>.astro`. A relative path into `../../../../packages/ui/src` is forbidden: it defeats the point of the docs site and would keep building after the export was removed. The library's styles load globally through `customCss`; never import `index.css` in a page.

### Code blocks

Every code block is titled with **only** the file extension and drawn in the terminal frame:

````mdx
```astro title=".astro" frame="terminal"
<Button color="green">Button</Button>
```
````

Use `title=".css"` for CSS. When an example needs an import, the import and the usage go in **the same** block. The code shows exactly what produced the demo, without the `not-content demo` wrapper.

### `## Usage`

One code block with the import and the usage, then the live render:

````mdx
```astro title=".astro" frame="terminal"
---
import Button from 'astro-nosferatu/components/Button.astro';
---

<Button>Button</Button>
```

<div class="not-content demo">
	<Button>Button</Button>
</div>
````

### `## Color variants`

Open with this sentence, verbatim:

```mdx
You can change the color theme of the component with the `color` prop. If you don't pass it the fallback will be the default grey palette.
```

Then a code block with every value, the uncolored instance first, then the live render — **only the components**: no `<figure>`, no caption, no text between them.

### `## States`

Each state gets its **own `###` heading** (`### Disabled`, `### Open`, `### Loading`…) so it shows in the "On this page" table of contents. Under each: at most one sentence, the code block, the live demo. Hover and press feedback needs no section of its own — every demo on the page already shows it.

### `## Icons`

Show the icon prop in use, with code and a live render. If the library supplies defaults, say so; if it ships no icon set, say that the prop takes a component and the docs' icons come from a package the site installs.

### `## Props`

Exactly four columns, no notes:

```mdx
| Prop    | Type                                       | Required | Default      |
| ------- | ------------------------------------------ | -------- | ------------ |
| `color` | `'blue' \| 'cyan' \| …`                    | No       | grey (unset) |
| `type`  | `'button' \| 'submit' \| 'reset'`          | No       | `'button'`   |
```

- Write the type exactly as the component declares it, escaping `|` as `\|`. A prop typed as a component is written `component`.
- `color`'s default is `grey (unset)`, never a hue. Leave Default empty (`—`) for a required prop or an optional one with no default.
- List a native attribute only when the component sets its default (`type` on a button).

After the table, one line naming the native element whose attributes pass through, and any slot:

```mdx
Every other `<button>` attribute passes through to the element. The default slot is the button's label.
```

**No props of its own, no `## Props`.** A component that only forwards native attributes (`Container`) gets no Props heading and no empty table — never a row of dashes. A native attribute whose default the component sets (`type` on `Button`) does count as a prop. Without the section, the pass-through/slot line closes `## Usage` instead, right after the demo.

### `## CSS Variables`

Two columns, Variable and Description, one short line each. List the `--nf-<component>-*` properties a consumer sets to customize the component: colors, sizes, durations. Leave out properties the component reassigns in its own state rules (such as `--nf-button-depth` and `--nf-button-lift`) — overriding them would freeze the hover and press feedback.

### `### Theming`

One live example of customizing the component through those properties with **a CSS class** on the component — never the `style` prop. Show the class in a `.css` block, the usage in an `.astro` block, then the live render:

````mdx
Set the variables in a class from a global stylesheet and pass it to the component. Leave `color` out: a `color` sets its own values, which win over the class.

```css title=".css" frame="terminal"
.themed-button {
	--nf-button-color: var(--nf-green-l-20);
}
```

```astro title=".astro" frame="terminal"
<Button class="themed-button">Themed</Button>
```

<div class="not-content demo">
	<Button class="themed-button">Themed</Button>
</div>
````

The class must come from a global stylesheet (or `<style is:global>`): with Astro's default scoping, a page's local `<style>` only matches that page's own elements, so its rules never reach the component's root. For the live demo, put the same rule in the page's bottom `<style>` block, which MDX does not scope.

### Demo styling

Every demo sits in `<div class="not-content demo">` (`not-content` keeps Starlight's prose styles off it). Keep the wrapper styling in one `<style>{`…`}</style>` block at the bottom of the page, using Starlight's `--sl-*` variables. There is no shared stylesheet — each page carries its own copy:

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
```

Add a modifier such as `.demo--stack` (one per row) or `.demo--grid` when a component needs it.

## Verify

From the repository root:

```bash
pnpm --filter docs check   # astro check over the site
pnpm build                 # must pass; this is what proves the exports resolve
```

Then read the page in `pnpm dev` and confirm:

- the headings follow the order above, and every state appears under `States` in the table of contents;
- every color renders a visibly distinct demo;
- the switch flips the site between dark and light;
- the theming demo looks different from the default;
- every code block shows the terminal frame and an extension-only title.

A page that builds but describes behaviour the component does not have is a failed page.

## Hand-off

If the component itself needs to change — a prop, its markup, its styles — that is [component-build](../component-build/SKILL.md)'s job. Do not edit `packages/ui/src/` from here.
