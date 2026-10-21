# Design

## Context

See proposal.md — Why. The constraints that actually shape the approach:

- `Button.astro` today styles itself with `.nf-button--primary` / `.nf-button--secondary` and hard-coded `--nf-red-*` / `--nf-blue-*` tokens. There is one component, so the pattern chosen here is the pattern the two new skills will teach.
- `colors.css` ships 160 palette tokens named `--nf-<hue>-<d|l>-<step>` and nothing else; semantic tokens are banned (invariant 2). A per-hue component style therefore needs some indirection that is *not* a new global token layer.
- `tokens.css` already defines `--nf-font-size-md: 1rem`, `--nf-space-2: 0.5rem`, `--nf-space-4: 1rem` and `--nf-radius-md: 0.5rem` — exactly the 1rem / 8px / 16px / 8px values the new Button needs. The raise geometry (2px border, 4px shadow, 2px and 4px travel, 0.15s) has no token.
- Astro scopes a component's `<style>` by appending a hash attribute to its own elements, so an attribute selector on the component's root element stays inside the component (invariant 5).
- The docs site is Starlight, which drives its light/dark theming through `color-scheme` on the root element and flips it with a toggle.
- `.agents/skills/` currently holds only `openspec-*` SKILL.md files written by `openspec update`.

## Goals / Non-Goals

**Goals:**
- One styling recipe that scales to 8 hues with one rule per hue and no duplicated geometry.
- Dark mode with no JS, no media query inside the component, and no second set of selectors.
- Keep every consumer override working through plain, unlayered CSS at normal specificity.
- Make the Button file readable enough to be quoted verbatim in `component-build`.

**Non-Goals:**
- A general theming API (`--nf-btn-*` is Button's, not a pattern other components inherit by name).
- Covering components that are not buttons in the geometry decisions below.
- Validating the skills against a second component in this change.

## Decisions

### Attribute + two custom properties, not modifier classes

`color` renders as `data-ui-color="<hue>"`, and the scoped stylesheet carries one rule per hue setting `--nf-btn-color` and `--nf-btn-accent-color`. The geometry lives once in `.nf-button` and reads only those two properties for color.

- *Why:* 8 hues × 5 colored declarations × 3 states as modifier classes is ~120 declarations; as custom properties it is 8 two-line rules plus one base block. Adding a hue later is two lines.
- *Why an attribute and not a class:* the value is data (`data-ui-color="green"`), it is readable in devtools, and it keeps the selector a single attribute match rather than a BEM name that implies a new variant type. `.nf-button--green` would also read as a visual variant rather than a palette selection.
- *Rejected:* passing the token name through an inline `style` attribute (`style={`--nf-btn-color: var(--nf-${color}-l-40)`}`). It works, but inline styles beat consumer CSS without `!important`, which is exactly the override hierarchy invariant 3 protects.
- *Naming:* `--nf-btn-*`, not `--nf-button-*`, because the user's requirement names those properties exactly. They are `--nf-` prefixed (invariant 1) and component-local, not semantic global tokens (invariant 2).

### `light-dark()` over the palette, with `color-scheme` from the reset

Each hue rule is `--nf-btn-color: light-dark(var(--nf-<hue>-l-40), var(--nf-<hue>-d-50))` and `--nf-btn-accent-color: light-dark(var(--nf-<hue>-l-80), var(--nf-<hue>-d-90))`.

- *Why:* `light-dark()` collapses both schemes into one declaration, so there is no second `@media (prefers-color-scheme: dark)` block duplicating all 8 rules, and a consumer can pin or flip the scheme by setting `color-scheme` anywhere up the tree — including per-subtree, which a media query cannot do.
- *Consequence:* `light-dark()` only reaches its dark branch when `color-scheme` includes `dark`. Nothing in the library declares it today, so the reset gains `:root { color-scheme: light dark; }`. This sits in the `nosferatu.reset` layer, so any unlayered consumer declaration wins (invariant 3), which is how "pin to light" stays a one-liner.
- *Rejected:* `color-scheme` on `.nf-button` only. It would keep the reset untouched, but a button declaring its own scheme while the page around it is light produces a dark button on a light page — the component would be deciding the page's theme. Scheme belongs to the document.
- *Rejected:* `@media (prefers-color-scheme: dark)` — doubles the hue rules and cannot be overridden per subtree.

### Geometry from existing tokens; raise geometry as component properties

`font-size: var(--nf-font-size-md)`, `padding-block: var(--nf-space-2)`, `padding-inline: var(--nf-space-4)`, `border-radius: var(--nf-radius-md)` — the four existing tokens already equal the requested 1rem / 8px / 16px / 8px, so the Button requires no literal there.

The raise values have no token and do not belong in the global scale (they describe this button's depth, not the system's spacing). They become component-scoped properties declared on `.nf-button`: border width, resting/hover/active shadow depth, hover/active travel and the transition duration. The state rules then change the property, not the declaration.

- *Why not add `--nf-border-width-*` / `--nf-duration-*` to `tokens.css`:* that is a published API addition that this change does not need, and it invites the next component to reuse a depth scale invented for one button.
- *Why not literal px in the state rules:* invariant 5 asks for design values through `--nf-*`; component-scoped properties satisfy it and keep the three states readable as one number each.

### Movement via `translate`, transition enumerated

The component uses the `translate` property (`translate: 0 2px`) rather than `transform: translateY(2px)`, and the transition enumerates the properties that actually change — `translate`, `box-shadow`, `background-color`, `color`, `border-color` — at `0.15s ease-in-out`.

- *Why `translate`:* it composes with any `transform` a consumer sets on the button instead of overwriting it.
- *Why not `transition: all`:* `all` animates the custom-property-driven color swap on first paint and anything a consumer adds later; the requirement is "all props that will be modified by the state", which is this explicit list.

### Hover/active guarded by `:not(:disabled)`

Consistent with the existing component and the repo's component guidance; the disabled button keeps the resting shadow and the existing `opacity` treatment, and `:focus-visible` keeps its outline, offset so it clears the 2px border.

### Skills live in `.agents/skills/`, hand-written

`component-build` and `component-doc` are plain `SKILL.md` files next to the generated `openspec-*` ones, with frontmatter `name` + `description`.

- *Why there and not `.dsh/skills/`:* `.agents/` is the convention this repo moved to, and the skills describe the project, not a DSH capability — any AGENTS-convention tool should get them.
- *Risk this creates:* `.agents/skills/` stops being "all generated". `AGENTS.md` gets one line saying the `openspec-*` entries are generated by `openspec update` and the `component-*` entries are hand-written, so nobody regenerates over them or hand-patches a generated one.
- *Split:* `component-build` owns `packages/ui/src/`, `component-doc` owns `docs/`. Each names the other for the half it does not do, so "add a component" is a two-skill job and neither file grows into a general contributor guide. Both defer behaviour questions to `openspec/specs/` and behaviour *changes* to the OpenSpec workflow.

## Risks / Trade-offs

- **`color-scheme: light dark` changes every consumer's page, not just buttons** (UA form controls, scrollbars, default canvas follow the OS) → called out as breaking in the proposal, spec'd with an explicit "consumer can pin a scheme" scenario, and documented on the docs page.
- **Starlight drives its own `color-scheme`, so the docs may not exercise both branches as expected** → verification includes flipping the Starlight theme toggle and confirming the buttons change branch; if Starlight's toggle does not set `color-scheme`, the docs page adds its own scoped declaration on the demo wrapper rather than the library compensating.
- **`light-dark()` needs a 2024-era browser** → acceptable for an Astro 7 library; buttons degrade to an unstyled-color button rather than breaking layout, and the docs page states the requirement.
- **Dropping `variant` silently de-styles existing usage** (a `.nf-button--primary` class simply stops matching) → flagged **BREAKING** in the proposal, `feat(ui)!:` commit, and the docs page's props table documents only the new API so there is no ambiguity about what replaced it.
- **The skills can drift from the code they describe** → both skills point at `openspec/specs/` as the authority rather than restating requirements, and quote `Button` only as the worked example.
- **`--nf-btn-*` is a public surface the moment it ships** (consumers will override it) → that is intended and spec'd; it is documented as the per-instance theming hook.

## Migration Plan

For consumers on `0.1.0`: replace `variant="primary"` with a `color` (`red` reproduces the old primary hue closest), delete `variant="secondary"` usages or restyle them — there is no outline button in this release — and drop any CSS targeting `.nf-button--primary` / `.nf-button--secondary`. If a project needs the previous light-only rendering, add `:root { color-scheme: only light; }` in its own unlayered CSS. Rollback is a version pin; nothing persists outside the published sources.
