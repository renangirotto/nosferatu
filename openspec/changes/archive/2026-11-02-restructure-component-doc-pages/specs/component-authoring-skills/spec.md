# Spec Delta

## MODIFIED Requirements

### Requirement: component-doc covers documenting a component

`component-doc` SHALL state that it documents only the components that live in `packages/ui/src/components/`, and that layouts, html files and stylesheets are out of its scope. It SHALL describe how to add or update a component's page under `docs/src/content/docs/components/`: the file name and frontmatter, importing the component through the package name only, the fixed section order (title, short description, a light-and-dark paragraph followed by the docs site's dark/light switch, `Usage`, `Color variants`, `States`, `Icons`, `Props`, `CSS Variables` with a `Theming` subsection), which sections are conditional and when to drop them, one third-level heading per state under `States` so each state appears in the table of contents, the four-column props table followed by the native-element line, the code-block convention (title is only the extension, terminal frame, import and usage in one block), the writing rules (short and direct; no animation internals, style-loading or `data-ui-*` explanations; no scoped-styles or content section), the fact that the sidebar autogenerates, and verifying with `pnpm --filter docs check` and `pnpm build`. It SHALL use the current Button page as its worked example and SHALL state that it does not change library source.

#### Scenario: Documenting a component from the skill alone

- **WHEN** an agent is asked to document an existing component and follows `component-doc` without further instruction
- **THEN** it produces one `.mdx` page under `docs/src/content/docs/components/` that imports the component by package name, follows the fixed section order, renders the component live, lists its props in the four-column table, and builds cleanly with `pnpm build`

#### Scenario: Scope is explicit

- **WHEN** an agent is asked to document a layout or a stylesheet and reads `component-doc`
- **THEN** the skill tells it that only components under `packages/ui/src/components/` are in its scope

#### Scenario: Docs skill stays out of the library

- **WHEN** an agent follows `component-doc`
- **THEN** it is directed to `component-build` for any component change instead of editing `packages/ui/src/`

#### Scenario: Relative imports are refused

- **WHEN** a reader checks `component-doc` for how to import a component into a docs page
- **THEN** it requires `astro-nosferatu/components/<Name>.astro` and explicitly forbids relative paths into `packages/ui/src`

### Requirement: Skills teach the unset-color default

`component-build` SHALL describe how a component with a `color` prop handles its default: the prop has no default value in the frontmatter, the `data-ui-color` attribute is rendered only when `color` is passed, and every use of a component color property carries a `var()` fallback to the grey `light-dark()` pairing that the component's own `data-ui-color="grey"` rule sets, so the uncolored and explicitly grey instances look identical. It SHALL state this as the one sanctioned exception to its rule against `var()` fallbacks, and SHALL use the current `Button` as the worked example of it. `component-doc` SHALL describe how such a component's page documents the default: grey (unset) in the props table, one sentence in `Color variants`, and an uncolored instance first in the `Color variants` render.

#### Scenario: Building a color-variant component from the skill alone

- **WHEN** an agent adds a new component with a `color` prop by following `component-build`
- **THEN** the component renders no `data-ui-color` attribute when `color` is omitted, and its color property use sites fall back to grey palette tokens matching its `grey` variant

#### Scenario: The fallback exception is explicit

- **WHEN** a reader checks `component-build`'s rule against `var()` fallbacks
- **THEN** it names the color-default fallback as the only exception and explains why, and gives no example that defaults `color` to a hue in the frontmatter

#### Scenario: Documenting the default from the skill alone

- **WHEN** an agent documents a color-variant component by following `component-doc`
- **THEN** the page lists the `color` default as grey (unset) in the props table, and the `Color variants` render starts with an uncolored instance
