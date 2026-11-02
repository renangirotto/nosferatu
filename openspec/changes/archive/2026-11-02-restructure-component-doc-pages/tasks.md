# Tasks

No library change: nothing under `packages/ui/` is edited.

## 1. Dark/light switch

- [x] 1.1 Create `docs/src/components/DarkModeSwitch.astro`: renders the library `Button` (imported from `astro-nosferatu/components/Button.astro`) with a `data-` hook and the label "Toggle dark/light mode"; an inline module script flips `document.documentElement.dataset.theme` dark↔light, writes `localStorage['starlight-theme']`, and calls `StarlightThemeProvider?.updatePickers(next)`. Verify with `pnpm --filter docs check`.
- [x] 1.2 Pin `color-scheme` to `:root[data-theme]` in `docs/src/styles/theme.css` (unlayered), so library components follow the site theme instead of the OS. Verify the root's computed `color-scheme` reads `light`/`dark` after the switch.

## 2. component-doc skill

- [x] 2.1 Rewrite `.agents/skills/component-doc/SKILL.md`: open by scoping it to `packages/ui/src/components/` only; replace the "Required sections" step with the fixed order (title/description → light-and-dark paragraph + `<DarkModeSwitch />` → `## Usage` → `## Color variants`* → `## States`* (one `### <State>` heading per state, so each shows in the table of contents) → `## Icons`* → `## Props` → `## CSS Variables` → `### Theming`), marking the conditional ones; give the Prop | Type | Required | Default table with `color` default `grey (unset)` and the native-element/slot line after it; the CSS Variables table (property | short description); the code-block rule (` ```astro title=".astro" frame="terminal" `, import + usage in one block); bare color grid (no figures/captions, uncolored first, one sentence that omitting `color` renders grey); and the writing rules (short, no animation/style-loading/`data-ui-*` explanations, no scoped-styles/content/slots/light-and-dark sections). Keep the package-name import rule, the relative-import ban, sidebar autogeneration, verification commands and the hand-off to `component-build`. Verify by reading the skill against the `component-authoring-skills` delta scenarios, and run `pnpm format:check`.

## 3. Rewrite the component pages

- [x] 3.1 Rewrite `docs/src/content/docs/components/button.mdx` to the new structure (Usage, Color variants, States with a `### Disabled` demo, Props, CSS Variables + Theming; native `<button>` line). Verify it renders in `pnpm dev` with every heading in order and the switch flipping the theme.
- [x] 3.2 Rewrite `docs/src/content/docs/components/callout.mdx` (Usage, Color variants, Icons with two different icon components and no icon + "the library ships no icon set"; at least one callout with a body and one title-only, Props, CSS Variables + Theming; native `<div>` and body-slot line; no States). Verify in `pnpm dev`.
- [x] 3.3 Rewrite `docs/src/content/docs/components/accordion.mdx` (Usage, Color variants, States with `### Open` and `### Grouped` (shared `name`) headings, Icons with defaults and custom `iconCollapsed`/`iconExpanded`, Props, CSS Variables incl. `--nf-accordion-icon-size` and `--nf-accordion-rule-color` + Theming; native `<details>` and default-slot line). Verify in `pnpm dev`.
- [x] 3.4 For each page, cross-check the CSS Variables table against the `--nf-<component>-*` properties actually declared in `packages/ui/src/components/<Name>.astro`, and the props table against its `Props` interface.

## 4. Verification

- [x] 4.1 Run `pnpm format` then `pnpm format:check` and `pnpm lint` — both exit 0.
- [x] 4.2 Run `pnpm --filter docs check` (0 errors) and `pnpm build` (succeeds; pages emit `components/button/`, `callout/`, `accordion/`).
- [x] 4.3 Run `pnpm pack:check` — tarball file list unchanged, no `DarkModeSwitch`.
- [x] 4.4 In `pnpm dev`, on each of the three pages: click the switch in dark → site goes light and Starlight's picker reads Light; click again → dark; reload → choice kept; Tab + Enter flips it too. Confirm every state heading is listed under `States` in the "On this page" table of contents. Confirm no `Scoped styles`, `Content`, `Slots`, `Light and dark`, `Animation` or `Disclosure state` heading remains, and every code block shows the terminal frame titled `.astro`/`.css`.
