# component-authoring-skills Specification

## Purpose

Defines the repository-local agent skills that capture how a component in this library is built and how it is documented on the Starlight site, so that every new component follows the same markup, token and documentation recipe without rediscovering it.

## Requirements

### Requirement: Skills are discoverable where the project keeps them
The repository SHALL provide two skills, `component-build` and `component-doc`, each as `SKILL.md` at `.agents/skills/<skill-name>/SKILL.md`, with YAML frontmatter carrying a `name` matching the directory and a `description` stating when the skill applies. Both SHALL be hand-written and SHALL NOT be produced or overwritten by `openspec update`.

#### Scenario: An agent finds the skills
- **WHEN** an AGENTS-convention tool loads the repository's skills
- **THEN** `component-build` and `component-doc` appear in its skill catalog alongside the generated `openspec-*` skills

#### Scenario: Regenerating OpenSpec tooling leaves them alone
- **WHEN** a maintainer runs `openspec update`
- **THEN** `.agents/skills/component-build/SKILL.md` and `.agents/skills/component-doc/SKILL.md` are unchanged

#### Scenario: The convention is written down
- **WHEN** a contributor reads the repository's root `AGENTS.md` section on agent tooling
- **THEN** it distinguishes the generated `openspec-*` skills from these two hand-written ones

### Requirement: component-build covers authoring a component
`component-build` SHALL describe, as repeatable steps, how to add or change a component in `packages/ui/src/components/`: file location and naming, tab indentation, typing props off the native element and forwarding the rest, merging a consumer `class` through `class:list`, the `nf-` class naming, expressing a component's variation through a `data-ui-*` attribute that maps to component-scoped `--nf-*` custom properties rather than modifier classes, sourcing every design value from `--nf-*` tokens with colors drawn only from the palette, keeping all selectors inside the component's own markup, providing focus-visible and disabled treatments, and verifying with `pnpm build`, `pnpm --filter docs check` and `pnpm pack:check`. It SHALL use the current `Button` as its worked example and SHALL state that it does not write documentation pages.

#### Scenario: Building a new component from the skill alone
- **WHEN** an agent is asked to add a new component and follows `component-build` without further instruction
- **THEN** the result is a single `.astro` file under `packages/ui/src/components/` that compiles in `pnpm build`, uses tab indentation, forwards native attributes, carries only scoped styles, and references colors solely through palette tokens

#### Scenario: Invariants are enforced, not just mentioned
- **WHEN** a reader checks `component-build` against the library's hard invariants
- **THEN** the skill states the `--nf-` prefix rule, the ban on `--nf-color-*` and semantic color tokens, the ban on selectors reaching outside the component, and the rule against raising specificity to beat consumer CSS

#### Scenario: Build skill stays out of the docs site
- **WHEN** an agent follows `component-build`
- **THEN** it is directed to `component-doc` for the documentation page instead of editing `docs/`

### Requirement: component-doc covers documenting a component
`component-doc` SHALL describe how to add or update a component's page under `docs/src/content/docs/components/`: the file name and frontmatter, importing the component through the package name only, the required page sections (import line, a live demo of every value of each enumerated prop, interaction-state guidance, a props table with types and defaults, a theming example, and a scoped-styles demonstration), the shared demo styling approach, the fact that the sidebar autogenerates, and verifying with `pnpm --filter docs check` and `pnpm build`. It SHALL use the current Button page as its worked example and SHALL state that it does not change library source.

#### Scenario: Documenting a component from the skill alone
- **WHEN** an agent is asked to document an existing component and follows `component-doc` without further instruction
- **THEN** it produces one `.mdx` page under `docs/src/content/docs/components/` that imports the component by package name, renders it live, lists its props, and builds cleanly with `pnpm build`

#### Scenario: Docs skill stays out of the library
- **WHEN** an agent follows `component-doc`
- **THEN** it is directed to `component-build` for any component change instead of editing `packages/ui/src/`

#### Scenario: Relative imports are refused
- **WHEN** a reader checks `component-doc` for how to import a component into a docs page
- **THEN** it requires `astro-nosferatu/components/<Name>.astro` and explicitly forbids relative paths into `packages/ui/src`

### Requirement: Skills defer to the specs and the OpenSpec workflow
Both skills SHALL point to `openspec/specs/` as the source of truth for behaviour and SHALL state that non-trivial or behaviour-changing work goes through the OpenSpec change workflow rather than straight into code.

#### Scenario: A behaviour change is routed through OpenSpec
- **WHEN** an agent following either skill is asked for work that changes the library's or the docs site's specified behaviour
- **THEN** the skill directs it to the OpenSpec propose/apply workflow and to update the matching spec delta in the same change

### Requirement: Skills teach the unset-color default
`component-build` SHALL describe how a component with a `color` prop handles its default: the prop has no default value in the frontmatter, the `data-ui-color` attribute is rendered only when `color` is passed, and every use of a component color property carries a `var()` fallback to the grey `light-dark()` pairing that the component's own `data-ui-color="grey"` rule sets, so the uncolored and explicitly grey instances look identical. It SHALL state this as the one sanctioned exception to its rule against `var()` fallbacks, and SHALL use the current `Button` as the worked example of it. `component-doc` SHALL describe how such a component's page documents the default — grey, with no attribute rendered — in prose, in the props table and with a live uncolored demo.

#### Scenario: Building a color-variant component from the skill alone
- **WHEN** an agent adds a new component with a `color` prop by following `component-build`
- **THEN** the component renders no `data-ui-color` attribute when `color` is omitted, and its color property use sites fall back to grey palette tokens matching its `grey` variant

#### Scenario: The fallback exception is explicit
- **WHEN** a reader checks `component-build`'s rule against `var()` fallbacks
- **THEN** it names the color-default fallback as the only exception and explains why, and gives no example that defaults `color` to a hue in the frontmatter

#### Scenario: Documenting the default from the skill alone
- **WHEN** an agent documents a color-variant component by following `component-doc`
- **THEN** the page lists the `color` default as grey with no attribute rendered, and shows an uncolored live demo
