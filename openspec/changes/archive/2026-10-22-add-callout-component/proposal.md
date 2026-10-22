# Proposal

## Why

The library ships a single component (`Button`) and has no way to call out a piece of explanatory content — the shape used all over the project's own material: a tinted panel with an icon, a title, a rule, and an optional body. Building it forces three gaps in the style layer into the open: there is no translucent surface color in the palette, no shared definition of the raised `0px 4px 0px` shadow that `Button` draws by hand, and no way at all to render an icon.

## What Changes

- **New `Callout` component** (`astro-nosferatu/components/Callout.astro`): a tinted panel with a required `title` prop, the same 8-hue `color` prop as `Button` (rendered as `data-ui-color`, defaulting to `purple`), an optional default slot for body content and an optional `icon` prop. Every text node renders at `1rem` / weight `500`. The body is rendered only when the slot was supplied, so a callout with no body is the title row alone — no rule, no body box, no leftover spacing.
- **No icon component and no icon dependency.** `icon` takes a component — an imported `.svg`, an icon from any library, one of the consumer's own — and the callout renders it without props, so the library neither picks an icon set nor gains a dependency. The documentation site installs `iconoir` for its own demos; that is a private docs dependency and never reaches the package.
- **Naming conventions, applied to the whole library.** Component classes drop BEM: the root is `.nf-<component>` and parts are `.nf-<component>-<part>`. Component-scoped custom properties spell the component's full name, so `Button`'s `--nf-btn-color` / `--nf-btn-accent-color` become `--nf-button-*`. Every rule declares its custom properties above its ordinary declarations, and defaults move out of `var()` fallbacks into real declarations. **BREAKING** for anyone already overriding `--nf-btn-*`. The `component-build` skill and the repository instruction files carry the rules.
- **New stylesheet `styles/shadows.css`**: one `--nf-shadow-<hue>-<d|l>-<step>` custom property per palette color, each holding the complete value `0px 4px 0px var(--nf-<hue>-<d|l>-<step>)`. It is independently importable, included by `index.css`, and lives in a new `nosferatu.shadows` cascade layer between `nosferatu.colors` and `nosferatu.reset`. **BREAKING** against the requirement that pins the layer list to exactly four names.
- **160 new palette tokens in `colors.css`**: every existing token gains a `-25` sibling with the same OKLCH value at 25% alpha (`--nf-blue-d-10-25`), written out literally rather than derived, so no `color-mix()` or relative-color support is assumed. `colors.css` goes from 160 to 320 declarations. Additive for consumers; **BREAKING** against the requirement that pins the palette at exactly 160.
- **New docs page** `components/callout.mdx`, a `shadows.css` entry on the styles page, and the renamed properties through the Button page.

Consumer-visible: yes. A new exported component, a new exported stylesheet and new palette tokens are additive, but renaming `Button`'s two theming properties is a breaking change for any consumer overriding them, so this ships as a major-intent release. The package manifest is unchanged: still one peer dependency, still no runtime dependencies.

## Capabilities

### New Capabilities

None. Everything here belongs to capabilities the project already has.

### Modified Capabilities

- `library-styles`: adds the `Callout` requirements, the class/property naming requirement, the 25%-opacity palette tier, the `shadows.css` stylesheet and its cascade layer; amends the exported-stylesheet list, the layer-order requirement, the palette-completeness requirement and both `Button` requirements for the property rename.
- `documentation-site`: adds the `Callout` page, including demonstrating the `icon` prop with more than one kind of icon component, and the requirement that every slot a component renders is documented.

## Impact

- `packages/ui/src/components/Callout.astro` (new); `packages/ui/src/components/Button.astro` (property rename, declarations hoisted).
- `packages/ui/src/styles/shadows.css` (new), `packages/ui/src/styles/colors.css` (+160 tokens), `packages/ui/src/styles/index.css` (layer list and one import).
- `packages/ui/package.json` is unchanged apart from staying as it was: one peer dependency, no runtime dependencies, `exports` and `files` untouched.
- `docs/package.json` gains `iconoir` as a private dependency for demo icons; `docs/src/content/docs/components/callout.mdx` (new), `button.mdx` (renamed properties), `styles.mdx` (shadows section).
- `.agents/skills/component-build/SKILL.md`, `AGENTS.md`, `packages/ui/AGENTS.md` and `openspec/config.yaml` carry the naming and ordering conventions.

## Non-goals

- Changing `Button`. Its hand-written `box-shadow` animates its depth between states and cannot come from a fixed-depth shadow token; it keeps its current implementation.
- Shadow tokens at other depths, with other offsets, or over the 25%-opacity tier.
- Shipping, bundling or depending on any icon set. The `icon` prop is the whole icon story.
- A `color-mix()`- or relative-color-based palette, and CSS custom functions (`@function`) — noted as future work once support is broad.
- Interactive states on `Callout`: it is static content, so there is no hover, focus, active or disabled behaviour.
