# Proposal

## Why

`Accordion` leans on the browser's disclosure triangle, which looks different in every engine and cannot be themed, and its raised summary loses its depth the moment the panel opens. A consistent plus/minus that the consumer can swap, and a depth that belongs to the whole panel, make it read as one control. Iconoir supplies the icons as an internal dependency, so the consumer installs nothing for them.

## What Changes

- **`Accordion` renders its own disclosure icon.** The native marker is hidden. Iconoir's plus shows while collapsed and its minus while expanded, at the end of the summary row, swapped by CSS with no script. **BREAKING:** visible markup and appearance change. The `<summary>` now wraps its text and the icons in parts of their own.
- **New `Accordion` props `iconCollapsed` and `iconExpanded`.** Each takes a component, the same way `Callout`'s `icon` does, and replaces the default for its state.
- **`Accordion` depth and open state.** The shadow moves from the summary to the whole `<details>` and shows in every state. Only the summary sinks, and only while closed: 1px on hover, 4px on press. An open accordion's summary no longer stays pressed. It sits still with square bottom corners over a 2px rule in a new `--nf-accordion-rule-color` (the hue's `l-60-25`/`d-70-25`). **BREAKING:** visible appearance changes.
- **New runtime dependency, internal only:** `iconoir` becomes a `dependency` of `astro-nosferatu`, so the Accordion's defaults resolve under any package manager with nothing installed by the consumer. It is not part of the public API. **BREAKING** for the library's "no runtime dependencies" contract (spec and AGENTS.md invariant).
- The component type that `Callout.icon` accepts moves into the shared types so `Accordion` reuses it. `Callout`'s behaviour is unchanged.

Consumer-visible: yes. The `Accordion` markup, marker, depth and open state change, and the new dependency installs with the library.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `library-styles`: changes `Accordion`'s content API (icon props, summary parts), appearance (own icon instead of the native marker, panel-wide shadow, summary-only sink, open rule) and color resolution (a fourth property, `--nf-accordion-rule-color`).
- `library-package`: allows exactly one runtime dependency, `iconoir`, for internal use.
- `documentation-site`: the Accordion page documents the icons, the icon props and the new states.

## Non-goals

- An `Icon` component, or any other way for a consumer to render Iconoir through the library. Iconoir is an implementation detail.
- Accepting an icon **name** in `iconCollapsed`/`iconExpanded`. A name chosen by the consumer would need a map of every Iconoir file inside the library; the props take a component instead.
- Changing `Callout`.
- Animating the plus-to-minus swap. It switches with the `[open]` state.

## Impact

- `packages/ui/package.json`: `dependencies.iconoir`.
- `packages/ui/src/components/Accordion.astro`. `Callout.astro` only changes where its icon type is imported from.
- `packages/ui/src/types/components.ts`: the shared `IconComponent` type.
- `docs/src/content/docs/components/accordion.mdx`.
- `AGENTS.md`, `packages/ui/AGENTS.md` and `openspec/config.yaml` context: the "no runtime dependencies" wording.
- Consumers: install size grows by Iconoir's package (about 12 MB on disk, SVG only). Their build output gains the two SVG files the Accordion imports (about 450 bytes). There is no change to client JS.
