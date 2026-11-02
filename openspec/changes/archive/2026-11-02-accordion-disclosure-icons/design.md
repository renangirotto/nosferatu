# Design

## Context

- The library ships `.astro` source and has no build step. The consumer's Vite (8.x under Astro 7) compiles it.
- Iconoir 7.12.1 is SVG files only (about 250 B each, 12 MB on disk), with no `dependencies` of its own.
- Under pnpm a consumer cannot import a package that is only a dependency of `astro-nosferatu`, but library source can. An import resolves from the library's location as long as its path is a literal Vite can see at build time.
- History: this change first planned a public `Icon` component that took any Iconoir name. A name chosen at runtime needs a generated map of all 1,383 imports, since globs over a package and variable import paths do not resolve in Vite 8 (both spiked). That was built and verified, then dropped by decision: Iconoir stays internal.

## Goals / Non-Goals

**Goals:**

- The Accordion's default icons render with nothing installed by the consumer, under npm and pnpm.
- Accordion's icon swap is pure CSS.

**Non-Goals:**

- Exposing Iconoir to consumers in any form, or taking icon names.

## Decisions

### 1. Iconoir as an internal dependency, imported by literal path

`packages/ui/package.json` gains `"dependencies": { "iconoir": "^7.12.1" }`. `Accordion.astro` imports `iconoir/icons/regular/plus.svg` and `minus.svg` as Astro SVG components and renders them at `width="1em" height="1em"`.

- **Why it works:** the specifiers are literal, so Vite resolves `iconoir` from the library's own location under any package manager. Verified with fresh npm and pnpm consumers installed from the packed tarball.
- **Why SVG components, not `?raw`:** Astro copies each imported SVG into the consumer's build output as an asset, but for two files of about 250 B that cost is negligible, and the component form takes `width`/`height` as props with no string handling.
- **Rule for future internal icons:** always a literal path. A path built from a variable is left unbundled by Vite and fails at runtime (spiked: `ERR_PACKAGE_PATH_NOT_EXPORTED`).

### 2. Accordion renders the default or the consumer's component

When a prop is passed, the accordion renders that component with no props. Otherwise it renders the Iconoir default at `1em`. The decision is a plain conditional in the markup.

### 3. Accordion icon props: `IconComponent`

The `IconComponent` type moves from `Callout.astro` to `src/types/components.ts`, under the shared-prop-types rule, and is imported relatively. `iconCollapsed?: IconComponent` and `iconExpanded?: IconComponent` mirror `Callout.icon`. A string is a type error.

The names `iconCollapsed` and `iconExpanded` describe the **state the icon is shown in**. `iconClose`/`iconOpen` would read as actions, which is ambiguous.

### 4. Accordion markup and the swap

```
<summary class="nf-accordion-summary">            display:flex; justify-content:space-between
  <span class="nf-accordion-label">{summary}</span>
  <span class="nf-accordion-icon" aria-hidden="true">
    <span class="nf-accordion-icon-collapsed">…</span>
    <span class="nf-accordion-icon-expanded">…</span>
  </span>
</summary>
```

- The native marker is hidden with `list-style: none` on the summary plus `&::-webkit-details-marker { display: none }` for Safari. Both selectors stay on the component's own element.
- `.nf-accordion[open] .nf-accordion-icon-collapsed` and the inverse toggle `display`, with no transition. A component icon without `aria-hidden` of its own is still hidden from assistive technology by the wrapper.
- The icon box stays at the summary's font size with `block-size: 1lh`, exactly one summary line, so the icon centres on the first line when the text wraps. The two icon parts inside it set `font-size: var(--nf-accordion-icon-size)` (`1.5rem`, declared on `.nf-accordion`). This differs from Callout, whose box carries the size, because `1lh` on a box at the icon size would measure the icon's line, not the summary's.
- `display:flex` on `<summary>` already removes the marker in Chromium and Firefox. The explicit `list-style: none` is kept for clarity and the WebKit pseudo-element for Safari.
- The `gap` comes from `--nf-spacing-base-low-2` (8px).

Upholds invariants 1, 2 and 5. Everything is scoped, values come from tokens or `--nf-accordion-*` properties, and there are no new color tokens.

### 5. Shadow on `<details>`, summary-only sink, open rule

- `box-shadow: 0px 4px 0px var(--nf-accordion-shadow-color, …)` and `border-radius: var(--nf-border-radius-base)` move to `.nf-accordion`. The shadow is constant. `--nf-accordion-depth` stays as its one declared value (4px) and no state changes it. Only `--nf-accordion-lift` changes: `0` at rest, `1px` on hover or `:focus-within`, `4px` on `:active`. The 4px press covers the shadow, so a closed accordion still reads as pressed.
- `.nf-accordion[open] .nf-accordion-summary` sets the lift back to `0`. It sits after the hover and active rules with the same specificity, so source order wins, the same trick the current code uses for its pressed-open state.
- No layout shift: a closed summary always carries `border-block-end: 2px solid var(--nf-accordion-color, …)`, which is invisible against its own fill. `[open]` only swaps that border's color to `--nf-accordion-rule-color` and zeroes `border-end-start-radius` and `border-end-end-radius`, so the box height never changes. The focus outline stays inset by its own width as before.
- `--nf-accordion-rule-color` follows the existing per-hue pattern: `light-dark(var(--nf-<hue>-l-60-25), var(--nf-<hue>-d-70-25))`, with a grey fallback at every use, like `--nf-callout-rule-color`.
- `transition-property` on the summary drops `box-shadow` and adds `border-color`. The reduced-motion rule is unchanged.
- Closing defers the corner and rule switch to the end of the panel's shrink: a transition takes its timing from the state being entered, so only the closed state carries the delay. It lives inside the animation's `@supports` block, because a browser without the animation closes instantly and must not hold square corners for 0.3s. Reduced motion zeroes the disclosure duration, and with it the delay.

Alternative considered: keep the shadow on the summary and add a second one to the content while open. It was rejected because two shadows meet at a seam while the panel animates, and the user asked for one shadow on the whole accordion.

The hover nudge is `1px`, matching the shipped code. The main spec's `2px` had drifted from it, and this change brings the spec in line with the code.

### 6. Invariant bent: "no runtime dependencies"

`library-package` and AGENTS.md invariant 7 both say it. The change amends the spec (see the delta) and updates AGENTS.md and the `openspec/config.yaml` context wording in the same change, so code, spec and agent guidance stay in line. The tarball contents are unchanged. Iconoir is installed beside the library, not packed into it.

## Risks / Trade-offs

- [The packed library behaves differently from the workspace, which is symlinked] → Verified: fresh npm and pnpm consumers built from the tarball resolve the defaults with no Iconoir entry of their own.
- [About 12 MB added to every consumer's `node_modules` for two icons] → Accepted, as the price of not vendoring files. Vendoring two SVG paths into the component is the fallback if the size ever matters.
- [Iconoir renames `plus` or `minus` in a minor release] → The import fails the build loudly. Both names are core and stable.
- [On close, `[open]` drops at once while the panel still shrinks for 0.3s, so the summary would round its corners above visible content] → Resolved (Decision 5): inside the animation's `@supports` block, the closed summary's radius and border color transition with `0s` duration and a delay of `--nf-accordion-disclosure-duration`, and `[open]` resets the delay to `0s`. Verified in Chrome: square at 40 and 150ms into a close, rounded after it; square 20ms after opening; instant under reduced motion. Firefox and WebKit as tested fail the `@supports` test, close instantly and switch at once, as intended.
- [Breaking Accordion markup] → It ships under a `feat(ui)!:` commit. The REMOVED/ADDED pair in the spec delta carries the migration note.

## Migration Plan

Consumers upgrade the package and nothing else. Anyone who styled the Accordion's native marker switches to `--nf-accordion-icon-size` and `--nf-accordion-accent-color`, or passes their own icons. Rollback is reverting the commit. Nothing persistent is involved.
