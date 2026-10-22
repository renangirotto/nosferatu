# Design

## Context

See [proposal.md](proposal.md) — Why. The constraints that shape every decision below are the ones in `openspec/specs`: the library ships `.astro` and `.css` source with no build step, no bundler and no test runner; every custom property is `--nf-` prefixed; colors come only from the palette; components are self-styled with scoped `<style>` and never reach outside their own markup; and the layer order is fixed so unlayered consumer CSS always wins.

The library ships no icons and depends on nothing. Anything icon-shaped in `Callout` is therefore a slot, and the only question is how that slot behaves in layout.

## Goals / Non-Goals

**Goals:**

- Let a consumer put any icon they already have into a callout, with the component controlling placement and size but never the content.
- Keep the new style tiers (25% colors, shadows) purely declarative, so they work in every browser that supports the existing palette.
- Keep `Callout`'s styling entirely inside its own markup, including the box around slotted content, so no `:global()` is needed anywhere.

**Non-Goals:**

- Shipping, wrapping or depending on an icon set, in the library or as an optional peer.
- Generating the 25% and shadow tiers at runtime or at pack time. They are committed source.
- Any change to `exports` or `files`; the package manifest keeps its single `astro` peer dependency.

## Decisions

### The icon is a component passed as a prop

`icon` holds a **component**, typed `(props: Record<string, any>) => any`, which `Callout` destructures as `Icon` and renders as `<Icon />` with no props. Astro imports a `.svg` as a component, so `icon={Bell}` works straight from any icon package; so does any `.astro` file or framework component.

The component owns only the box: one title line tall, centred on the first line so a wrapping title does not drag the icon down, and `font-size: var(--nf-callout-icon-size)` (`1.5rem`) so a component sized in `em` lands at 24px with nothing else said. One with a fixed size keeps it, because no props are passed down — a callout cannot know which props an arbitrary component accepts, and passing `width`/`height` to something that is not an SVG would be a guess.

That type is deliberately a bare function rather than Astro's `SvgComponent`: it must accept `.astro` factories and framework components too. It is still strict enough to matter — `astro check` rejects `icon="bell"` and `icon={<Bell />}`.

Rejected along the way:

- **An `icon` prop naming an icon the package resolves.** Built first, as an `Icon` component resolving `iconoir/icons/<name>.svg` through iconoir's `exports` map and inlining the file at build time. It forced one icon set on every consumer, added a peer dependency to a package whose premise is having none, typed `name` as a bare `string` against the project's own union rule, and read from the filesystem during render, which rules out edge runtimes.
- **An `icon` slot.** Equally free and needs no typing at all, but it puts the icon in the consumer's markup rather than in the component's call signature, and on `.mdx` pages a lowercase element next to body text silently lands in the default slot instead.
- **A raw HTML string rendered with `set:html`.** Maximum freedom, but the component would inject markup it did not create — an injection vector the moment the value comes from data.

The cost is that the component cannot mark the icon decorative: `aria-hidden` belongs on markup the component did not write, so the docs tell consumers to put it there themselves.

### `Callout` renders a plain `<div>`, with paragraphs inside

A `<div>`, typed `HTMLAttributes<'div'>` for passthrough. `<aside>` was the first choice and was wrong by default: it is a complementary **landmark**, so every callout on a page would announce itself as one, and a page with five explanatory panels would hand a screen-reader user five landmarks to wade through. Whether a given callout is really complementary is the consumer's call, which they make by passing `role` and a label — which the component forwards.

Title and body are both `<p>`. The title is not `<h2>`/`<h3>`: a component cannot know its position in the document outline, and injecting an arbitrary heading level is worse than injecting none. The body being a `<p>` means `typography.css` gives it a bottom margin, so the component zeroes it (`margin-block: var(--nf-space-4) 0`) rather than inheriting trailing space the panel never asked for. It also means the body is for prose: block content belongs outside a paragraph, and a consumer who needs it should nest their own wrapper. `title` is redeclared as a required `string` (narrowing the native `string | null | undefined`) and destructured away so it never reaches the element as the tooltip attribute.

The body slot is detected with `Astro.slots.has('default')`; the icon is simply the presence of the prop. The body wrapper and its separator rule are rendered only in that branch, which is what makes the "no leftover space" scenario true structurally rather than through an `:empty` selector — `:empty` would be fooled by whitespace and could not remove the rule's margins reliably.

### Five component properties, and a dark accent that is *lighter*, not darker

`--nf-callout-surface-color`, `--nf-callout-accent-color`, `--nf-callout-rule-color`, `--nf-callout-shadow-color`, `--nf-callout-shadow`, set per `data-ui-color` exactly like `Button`'s two.

The shadow is **25% alpha**, not opaque, and in light mode it is one step lighter than the accent (`l-70`, not `l-80`): the panel's surface is translucent, so an opaque bar under it reads as a harder edge than the component has anywhere else, and a tinted shadow keeps the whole component on one material. Its step pairs with the *surface*, not with the accent — `l-40` surface with an `l-80` shadow, `d-50` surface with a `d-90` shadow — which is the same relationship `Button` uses between its fill and its shadow, so a shadow always reads as a darker edge of the panel it belongs to. That is why `--nf-callout-shadow-color` is its own property and not an alias of `--nf-callout-rule-color`, which stays on the accent's tint (`l-80-25` / `d-30-25`).

The icon box is `24px` (`--nf-callout-icon-size`, `--nf-font-size-xl`) against a `1rem` title, applied as `font-size` on the component's **own** wrapper — never on the icon component itself, which `Callout` does not own. The wrapper stays one title line tall with its content centred, so a larger icon overflows symmetrically instead of stretching the title row.

`Button` pairs `l-80` with `d-90` for its accent because it sits on an *opaque* fill that is light in both schemes, so dark text works in both. `Callout`'s surface is 25% alpha: in dark mode the page shows through and the panel reads dark, so a `d-90` accent (L ≈ 0.53) would be dark-on-dark. The accent therefore pairs `l-80` (L ≈ 0.47, dark) with `d-30` (L ≈ 0.89, light) — the deliberate deviation from the shared step pairing, recorded here because `component-build` otherwise mandates `Button`'s pairing. The surface keeps the pairing (`l-40-25` / `d-50-25`), and the rule is the accent at 25% (`l-80-25` / `d-30-25`), which is the first real consumer of the new opacity tier.

### `shadows.css` holds complete box-shadow values, one per palette color

```css
--nf-shadow-purple-l-80: 0px 4px 0px var(--nf-purple-l-80);
```

A token is the whole value, so a consumer writes `box-shadow: var(--nf-shadow-purple-l-80)` and gets the house shadow. 160 declarations is mechanical, and when CSS custom functions are widely supported this entire file collapses to one `@function --nf-shadow(--color)` without changing any call site that used a token — which is why the token name encodes the color rather than a depth.

The file also carries one depth-only token, `--nf-shadow-depth: 0px 4px 0px`. It exists because `light-dark()` resolves **colors**, not whole values: a component whose shadow color changes with the scheme cannot pick between two complete shadow tokens — `light-dark(var(--nf-shadow-green-l-80), var(--nf-shadow-green-d-30))` substitutes something that is not a valid `box-shadow`, so the declaration is dropped and the shadow silently disappears. (Found during implementation, by sampling pixels under a built panel.) `Callout` therefore composes `var(--nf-shadow-depth) var(--nf-callout-accent-color)`, which keeps the 4px depth in `shadows.css` and keeps the color scheme-aware per subtree. Using a `prefers-color-scheme` media query instead would have fixed the shadow but broken `color-scheme` pinning for it alone.

Rejected: replacing the 160 color tokens with depth-only tokens — the color would then have to be appended at every call site, which is the duplication the file exists to remove, and a consumer's one-declaration `box-shadow: var(--nf-shadow-purple-l-80)` is the point; and tokens over the 25% tier — a translucent drop shadow is not a thing this design needs.

`Button` is not refactored onto these tokens. Its shadow depth animates between `4px`, `2px` and `0px`, so its value must stay composed from a live `--nf-button-depth`; a fixed-depth token cannot express it. `Callout` is static and has no such problem.

### The new layer goes between `colors` and `reset`

`@layer nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset, nosferatu.typography;`

`shadows.css` only declares custom properties, so its layer position cannot change any cascade outcome today; it sits next to `colors` because it is the same kind of file and because the shadows reference the palette. Unlayered consumer CSS still beats every layer, so the invariant holds unchanged — only the literal list in the spec's scenario moves.

A consumer who imports `tokens.css` and `colors.css` but not `shadows.css` gets a `Callout` with no drop shadow, because `--nf-shadow-depth` is undefined. That is accepted rather than papered over with a `var(…, fallback)` chain: a `var()` that resolves to an undefined property inside a custom property makes the *using* declaration invalid at computed-value time, so the fallback would not fire reliably anyway, and the component already depends on `tokens.css` and `colors.css` being loaded. The docs state the dependency; `index.css` satisfies it.

### The 25% tier is literal, and both tiers are generated once by a throwaway script

Each token is written out as `oklch(L C H / 25%)` beside its base. No `color-mix()`, no relative color syntax, no `@function` — the user's stated constraint, and it keeps `colors.css` readable as data.

320 color declarations and 160 shadow declarations are not hand-typed. Implementation generates both files with a one-off Node script run from `/tmp` that parses the existing `colors.css`, and the script is **not** committed — the library gains no tooling, no dependency and no build step. The generated output is reviewed and committed as ordinary source, tabs and all. Adjacency (`--nf-blue-d-10` immediately followed by `--nf-blue-d-10-25`) is chosen over a separate block per scale so a hue's two tiers are diffed together and a missing sibling is obvious on sight.

### Shared prop types, and why published source cannot use the `@/` alias

`src/types/components.ts` holds prop types more than one component needs — today `ColorPalette`, the eight palette hues, consumed by both `Button` and `Callout` instead of each restating the union.

`tsconfig.json` in `packages/ui` maps `@/*` to `./src/*`, and the docs site has the same mapping plus a matching Vite alias, so `@/types/components` works when type-checking the library and anywhere in the docs. **Published components still import it relatively**, and that is not a style preference. Measured both ways:

- with `import type { ColorPalette } from '@/types/components'` in `Callout.astro`, the docs build passes — `import type` is erased before Vite resolves anything — but `astro check` in the consuming project cannot resolve the alias, `ColorPalette` degrades to `any`, and `<Callout color="teal">` stops being an error: the check reported **0 errors** where it must report one;
- with `'../types/components'`, the same probe reports **1 error**, as specified.

The library ships source into projects that never load its `tsconfig.json`, so any alias in published source is a silent type hole. The rule is in the `library-package` delta, the `component-build` skill and both AGENTS files.

Note also that `paths` is declared without `baseUrl`: TypeScript 6 deprecates `baseUrl` and errors on it, and `paths` entries resolve relative to the config file without it.

### `iconoir` is a documentation dependency only

`docs/package.json` installs `iconoir` so the Callout page's demos have real icons to pass; it is private to the docs site and appears nowhere in the published package. Astro imports its `.svg` files as components directly (`import Bell from 'iconoir/icons/bell.svg'`), which is exactly the one-line approach a consumer would use, so the demos double as the recommended pattern. `exports` and `files` are untouched, so `pack:check` shows one new component and one new stylesheet and nothing else.

### Naming: no BEM, full component names, properties first

Three conventions landed with this change and were applied to `Button` as well as `Callout`:

- **Parts are `nf-<component>-<part>`.** Astro scopes every selector to the component already, so BEM's `__` buys a global uniqueness these styles do not need.
- **Properties spell the component out** — `--nf-button-color`, not `--nf-btn-color`. These names are the public theming API; a consumer should be able to guess them from the component's name. Renaming `Button`'s two is breaking, which at `0.1.0` costs nothing and would only get more expensive later.
- **Custom properties are declared at the top of their rule**, before ordinary declarations, so a rule's API is readable before its implementation. Related: defaults now live in real declarations instead of `var()` fallbacks, which had already produced one silent bug — `Button`'s focus outline read `var(--nf-button-outline-width, 2px)` for its width and `calc(-1 * var(--nf-button-outline-width, 1px))` for its offset, so the inset never matched the width the spec describes.

## Risks / Trade-offs

- **The icon cannot be made decorative by the component** → `aria-hidden` has to come from the consumer's own markup. Stated on the Callout page beside the slot documentation.
- **`colors.css` doubles in size** → 320 declarations in one file, and every consumer loading `colors.css` pays for both tiers. Custom properties are cheap, the file gzips well, and splitting the tier into its own stylesheet would add a fifth import path and a fourth layer for no behavioural gain.
- **Renaming `--nf-btn-*`** → Breaking for any consumer already overriding them. Mitigated by doing it now, at `0.1.0`, with the rule written into the `component-build` skill so no component drifts back.
- **The dark-mode accent deviates from `Button`'s step pairing** → A future component with a translucent surface must follow `Callout`, not `Button`. Recorded in the spec delta (`Callout color resolution`) rather than left to the next reader's judgement.
