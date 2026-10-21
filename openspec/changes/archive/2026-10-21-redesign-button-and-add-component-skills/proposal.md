# Proposal

## Why

`Button` is the library's only component and its `variant` API (`primary` / `secondary`) hard-codes two red/blue treatments that do not scale to the eight-hue palette. We want a single visual recipe — a raised, chunky button whose colors are driven by a `color` prop over the whole palette — and we want that recipe to be the reference example for how every future component in this library is built and documented. Capturing it now, while there is exactly one component, is what makes the pattern cheap to repeat.

## What Changes

- **BREAKING** `Button` drops the `variant` prop. `.nf-button--primary` and `.nf-button--secondary` no longer exist, and any consumer passing `variant` loses its styling (and fails `astro check`).
- `Button` gains a `color` prop accepting `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` or `yellow`, defaulting to `purple`. It is emitted as `data-ui-color` on the rendered `<button>`.
- Component styling moves from modifier classes to attribute-selected custom properties: `[data-ui-color="<hue>"]` sets `--nf-btn-color` (background) and `--nf-btn-accent-color` (text, border, box-shadow), both via `light-dark()` over the palette — `-l-40`/`-l-80` for light, `-d-50`/`-d-90` for dark. The base `.nf-button` rules reference only those two properties for color.
- `Button` gets the raised look from the reference screenshot: 1rem text, 8px/16px padding, 8px radius, 2px solid border, `0 4px 0` shadow, and a 0.15s ease-in-out transition; hover translates 2px down with a 2px shadow, active 4px down with no shadow.
- **BREAKING** `base.css` is deleted and the `nosferatu.base` layer disappears from `index.css`, taking the library's `body` color and font, its global `:focus-visible` ring, its `::selection` treatment and `text-size-adjust` with it. Its content is deferred for a later refactor; nothing replaces it in this change. `Button` carries its own focus outline instead of relying on the global one.
- **BREAKING** `reset.css` sets `color-scheme: light dark` on `:root`, so `light-dark()` resolves to the dark branch under an OS dark preference. Consumers who never set `color-scheme` will see UA form controls and scrollbars follow the OS theme.
- The Button docs page is rewritten around the `color` prop: a live swatch row for all eight hues, hover/active guidance, and the token-override theming example retargeted at `--nf-btn-*`.
- Two hand-written agent skills land in `.agents/skills/`: `component-build` (how to author a component in this library) and `component-doc` (how to document one on the Starlight site), both written from the new `Button` as the worked example.
- Root `AGENTS.md` gains a line distinguishing the generated `openspec-*` skills in `.agents/skills/` from these hand-written ones, so `openspec update` guidance stays accurate.

Consumer-visible: yes, and breaking twice over — the component's public prop API and class names change, and a published stylesheet changes a document-level property. The library is `0.1.0`; this warrants a `feat(ui)!:` commit and a minor bump under 0.x semantics.

## Non-goals

- No new hues, steps or values in `colors.css`; the palette is untouched.
- No semantic color tokens. `--nf-btn-color` / `--nf-btn-accent-color` are component-local properties resolved from palette tokens, not a `--nf-color-*` layer.
- No second component. The skills are written from `Button`, not validated against a new one in this change.
- No build step, bundler or test runner.
- No new cascade layers; the only layer change is `nosferatu.base` disappearing with its stylesheet, and the remaining four keep their relative order.
- No replacement for `base.css` in this change — the `body` and `::selection` defaults simply stop shipping until that refactor happens.
- No manual dark-mode toggle, class or media-query theming API beyond `color-scheme` plus `light-dark()`.
- No changes to package `exports`, `files`, dependencies or the Astro peer range.

## Capabilities

### New Capabilities
- `component-authoring-skills`: the repository-local agent skills that define how a component is built (`component-build`) and documented (`component-doc`), where they live, and what a maintainer or agent can rely on them to cover.

### Modified Capabilities
- `library-styles`: `Button`'s public prop API and color mechanism become spec'd behaviour (`color` prop → `data-ui-color` → `--nf-btn-*` via `light-dark()`), plus the interaction states; `reset.css` reset defaults gain `color-scheme: light dark`.
- `documentation-site`: the Button page's live demo requirement is sharpened to cover every supported `color` value and the component's interaction states.

## Impact

- `packages/ui/src/components/Button.astro` — rewritten props and scoped styles.
- `packages/ui/src/styles/reset.css` — one added declaration on `:root`.
- `packages/ui/src/styles/base.css` — deleted; `index.css` drops its import and its layer.
- `docs/src/content/docs/styles.mdx`, `packages/ui/README.md`, root `AGENTS.md` — stylesheet list, layer order and invariant 3 follow the removal.
- `docs/src/content/docs/components/button.mdx` — rewritten demos, props table and theming section.
- `.agents/skills/component-build/SKILL.md`, `.agents/skills/component-doc/SKILL.md` — new, hand-written, never regenerated by `openspec update`.
- `AGENTS.md` — note on generated vs. hand-written skills.
- Downstream consumers using `variant`, `.nf-button--primary` / `.nf-button--secondary`, or relying on a light-only `color-scheme`.
- No change to `packages/ui/package.json`, so the published file set is unchanged.
