# Design

## Context

Starlight (0.42) owns the site theme: its `ThemeSelect` sets `document.documentElement.dataset.theme` to `dark` or `light`, stores the choice in `localStorage['starlight-theme']`, and calls the global `StarlightThemeProvider.updatePickers(theme)` to keep every picker in sync. Starlight's CSS maps `[data-theme]` to `color-scheme`, and the library's components resolve their colors with `light-dark()`, so they follow automatically. `docs/src/components/` exists and is empty.

## Goals / Non-Goals

**Goals:** a docs-only switch that reuses Starlight's theme state; one page template every component page matches.

**Non-Goals:** an "auto" option, a library-published theme component, a shared MDX layout/wrapper for pages.

## Decisions

**DarkModeSwitch is a plain `<button>` with a small inline module script, in `docs/src/components/DarkModeSwitch.astro`.** On click it reads `document.documentElement.dataset.theme`, computes the opposite, then does the same three things Starlight's picker does: set `dataset.theme`, write `localStorage['starlight-theme']`, call `StarlightThemeProvider.updatePickers(next)`. Alternative — programmatically changing Starlight's `<select>` and dispatching `change` — couples us to its markup (there are two selects, desktop and mobile) and is no smaller. Alternative — overriding Starlight's `ThemeSelect` component — replaces the header picker, which the user did not ask for.
The button is styled by the library's own `Button` component (`astro-nosferatu/components/Button.astro`), so it is itself a live demo of the lib in both schemes; the script attaches by a `data-` hook on the rendered element. Label: "Switch to light" / "Switch to dark" is not knowable at build time, so the label is a fixed "Toggle dark/light mode" (a label reflecting the next theme can come later if readers ask).

**The docs pin `color-scheme` to Starlight's theme.** Found during apply: the library's `reset.css` sets `color-scheme: light dark` on `:root`, and that wins over Starlight's own `[data-theme]` rule, so the components' `light-dark()` colors followed the OS preference rather than the site theme (the old pages' "flip the toggle and watch them change" never actually worked). `docs/src/styles/theme.css` now sets `color-scheme: light` / `dark` on `:root[data-theme=…]`, unlayered — exactly what a consumer would write, and it wins without extra specificity (invariant 3 upheld). No library change.

**Imported per page, not globally.** Each component page imports `DarkModeSwitch` with an `@/components/...` alias import (the docs-only alias already configured in `astro.config.mjs`). This is docs code, so invariant 6 (public import paths) applies only to library imports and is upheld.

**Code-block convention via Expressive Code meta**: ` ```astro title=".astro" frame="terminal" `. Already bundled with Starlight; no config change.

**Slots move to the line after the Props table.** The user's structure has no Slots section, but the existing spec requires slots be documented; naming them in the native-element line keeps that obligation without a new section.

**Accordion's `open` and `name` go under `States`.** They are the component's disclosure states, even though they come from native `<details>`. Each state is a `###` heading (`### Open`, `### Grouped`); Starlight's table of contents already includes levels 2–3 by default, so no config change is needed.

**Demo wrapper styling stays per-page** (one `<style>` block scoped to `.demo`), as today. The `Color variants` grid drops `<figure>`/`<figcaption>`.

Invariants upheld: 5 (component self-styling — no library change), 6 (docs import library by package name), 8 (DarkModeSwitch lives in `docs/`, never in the tarball). None bent.

## Risks / Trade-offs

- [`StarlightThemeProvider` is a Starlight internal global, not public API] → guard with optional chaining so the toggle still flips `data-theme` and storage if it disappears; a Starlight upgrade that breaks it shows up as a picker out of sync, not a broken page.
- [Spec content is removed (scoped-styles proof, animation fallback prose, text-character icon demo, body-vs-no-body demo)] → intentional per the user's request; the behaviour still exists in the library and its library-styles spec, only the docs stop describing it.
