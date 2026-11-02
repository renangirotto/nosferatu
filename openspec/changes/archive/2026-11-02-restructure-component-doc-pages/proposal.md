# Proposal

## Why

Component pages have grown into long essays — animation internals, `data-ui-*` mechanics, scoped-style proofs, light/dark token tables — and every page orders its sections differently (`Disclosure state`, `Animation`, `Content`, `Slots`…). Readers want one predictable, short page per component: how to use it, what it looks like, what to pass, what to override. The docs site should also let a reader flip light/dark right next to the demos, since every component is built for both schemes.

## What Changes

- `component-doc` skill states up front that it documents only components under `packages/ui/src/components/` (not layouts, html files or stylesheets).
- `component-doc` prescribes one fixed page structure, in this order:
  1. `# Title` (frontmatter) → short description → one short paragraph saying the component supports light and dark, followed by the new **DarkModeSwitch** button.
  2. `## Usage` — import + usage in **one** code block, then the live render.
  3. `## Color variants` — only if the component has `color`: code block, then a render of every hue with nothing but the components (no captions, no extra text).
  4. `## States` — only if the component has states (disabled, open, loading…). Each state gets its own `###` heading (`### Disabled`, `### Open`…) so it shows in the "On this page" table of contents.
  5. `## Icons` — only if the component has an icon prop.
  6. `## Props` — table with **Prop | Type | Required | Default** only, no notes column; after it, one line naming the native element whose attributes pass through (and any slot).
  7. `## CSS Variables` — table of each overridable `--nf-<component>-*` property with a short description.
  8. `### Theming` (under CSS Variables) — one simple customization example.
- General writing rules in the skill: direct and short; no explaining animation internals, how base styles load, or how `data-ui-*` works; mentioning that the component uses a native element is welcome.
- Every code block is titled with only its extension (`title=".astro"`, `title=".css"`) and uses `frame="terminal"`.
- Dropped sections: `Scoped styles`, `Content`, `Light and dark`, `Animation`, `Disclosure state`, `Slots` (slot info moves to the line after the Props table).
- New docs-only component `docs/src/components/DarkModeSwitch.astro`: a button that flips Starlight's theme to the opposite of the current one (dark → light, light → dark), keeping Starlight's own theme picker and stored preference in sync.
- Rewrite `button.mdx`, `accordion.mdx` and `callout.mdx` to the new structure.

**Not consumer-visible.** Nothing under `packages/ui/` changes; the published package, its CSS, markup and exports are untouched. Only the private docs site, the repo's own skill and the specs that describe them change.

## Non-goals

- No change to any library component, stylesheet, token or export.
- No restructuring of layout, html-file or stylesheet pages.
- DarkModeSwitch does not ship in the library and is not a reusable "auto" theme picker — it only toggles between dark and light.
- No shared demo stylesheet or MDX wrapper component for pages beyond DarkModeSwitch.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `documentation-site`: component pages follow one fixed structure; the Button/Callout/Accordion page requirements drop the scoped-styles, animation-explanation, light/dark and content-section obligations; the unset-color default no longer needs a labelled caption; a new requirement adds the dark/light switch on component pages.
- `component-authoring-skills`: `component-doc` is scoped to `src/components`, prescribes the new section list and writing/code-block rules, and no longer requires a scoped-styles demonstration; its unset-color guidance moves to the props table and an uncaptioned uncolored demo.

## Impact

- `.agents/skills/component-doc/SKILL.md` — rewritten.
- `docs/src/components/DarkModeSwitch.astro` — new.
- `docs/src/content/docs/components/{button,accordion,callout}.mdx` — rewritten.
- `openspec/specs/documentation-site/spec.md`, `openspec/specs/component-authoring-skills/spec.md` — via deltas.
- Library (`packages/ui/`) — none.
