# repository-tooling Specification

## Purpose

Defines the linter and the formatter this repository runs, the commands that invoke them, which files each one owns and which it must leave alone, so that the project's style rules are executable instead of being re-derived by every contributor, and so that running them can never change what the library publishes.

## Requirements

### Requirement: The repository lints its JavaScript, TypeScript and Astro script code

The repository SHALL provide a linter, run from the repository root over the whole workspace, invoked as `pnpm lint` to report problems and `pnpm lint:fix` to apply the linter's safe automatic fixes. It SHALL be Oxlint, installed as a dev dependency of the workspace root, driven by a single configuration file at the repository root, and SHALL cover `.js`, `.mjs`, `.cjs`, `.ts` and the script and frontmatter blocks of `.astro` files in both `packages/ui` and `docs`. `pnpm lint` SHALL exit non-zero when the linter reports an error and zero when it reports none, so it can gate a change by hand today and in CI later. The linter SHALL NOT be wired into `pnpm build`, `pnpm dev` or the publish path: it is a command a contributor runs, not a build step.

#### Scenario: Linting a clean workspace

- **WHEN** a maintainer runs `pnpm lint` on an unmodified checkout after `pnpm install`
- **THEN** the command reports no errors and exits zero

#### Scenario: The linter catches a real defect

- **WHEN** a contributor leaves an unmistakable defect in a linted file — a `debugger` statement, or the same object key declared twice — and runs `pnpm lint`
- **THEN** the command names the file and line, reports an error, and exits non-zero

#### Scenario: The linter reads Astro frontmatter

- **WHEN** the defect is inside the frontmatter of a `.astro` file under `packages/ui/src` rather than in a `.ts` file
- **THEN** `pnpm lint` still reports it

#### Scenario: Fixing what can be fixed

- **WHEN** a contributor runs `pnpm lint:fix`
- **THEN** the linter rewrites only the problems it can fix safely, and a following `pnpm lint` reports strictly fewer problems than before

#### Scenario: Building does not lint

- **WHEN** a maintainer runs `pnpm build` in a workspace that has a lint error
- **THEN** the docs site still builds successfully, because the linter is not part of the build

### Requirement: The repository formats its sources with Astro's documented formatter

The repository SHALL provide a formatter, run from the repository root over the whole workspace, invoked as `pnpm format` to rewrite files and `pnpm format:check` to verify them without writing. It SHALL be Prettier together with the official `prettier-plugin-astro`, both installed as exact-version dev dependencies of the workspace root and configured by a single Prettier configuration file at the repository root that registers the plugin and selects the `astro` parser for `*.astro`. The formatter SHALL own `.astro`, `.css`, `.ts`, `.mjs`, `.json`, `.md` and `.mdx` files. `pnpm format:check` SHALL exit non-zero when any owned file is not formatted and zero when all of them are. Running the formatter SHALL be idempotent: a second run SHALL change nothing.

#### Scenario: A formatted repository verifies clean

- **WHEN** a maintainer runs `pnpm format:check` on an unmodified checkout
- **THEN** the command reports every owned file as already formatted and exits zero

#### Scenario: An unformatted file is caught

- **WHEN** a contributor commits an `.astro` component with inconsistent indentation and runs `pnpm format:check`
- **THEN** the command names that file and exits non-zero

#### Scenario: Astro files are actually parsed, not skipped

- **WHEN** a contributor mangles the whitespace of a component's markup and scoped `<style>` block, runs `pnpm format`, and reopens the file
- **THEN** the frontmatter, the markup and the styles are all reformatted, and the component still renders identically in `pnpm build`

#### Scenario: Formatting twice changes nothing

- **WHEN** a maintainer runs `pnpm format` and then runs it again
- **THEN** the second run reports no file as changed

### Requirement: Documented code samples are preserved exactly as authored

The formatter SHALL NOT reformat code inside Markdown or MDX fenced code blocks. A code sample on a documentation page is written to teach a reader the exact line to copy, and the `documentation-site` capability specifies several of those lines verbatim; the formatter must not rewrite them. The surrounding Markdown — prose, tables and the MDX markup around the fences — SHALL still be formatted. This exemption SHALL apply to Markdown and MDX only, and SHALL NOT disable the formatting of a component's `<style>` or `<script>` block inside an `.astro` file.

#### Scenario: A documented import line survives formatting

- **WHEN** a maintainer runs `pnpm format` and reopens a component's documentation page
- **THEN** its import line is character-for-character what it was before, quote style included

#### Scenario: The prose around a sample is still formatted

- **WHEN** a documentation page has a ragged Markdown table next to a code fence and a maintainer runs `pnpm format`
- **THEN** the table is aligned and the fenced sample is untouched

#### Scenario: Component styles are still formatted

- **WHEN** a maintainer mangles the whitespace inside a component's scoped `<style>` block and runs `pnpm format`
- **THEN** the style block is reformatted, because the Markdown exemption does not reach `.astro` files

#### Scenario: Documentation renders identically

- **WHEN** a maintainer builds the docs site before and after formatting every Markdown and MDX file
- **THEN** the generated HTML is identical

### Requirement: The formatter enforces the repository's indentation convention

The formatter SHALL be configured to indent with tabs, so that `.astro` and `.css` sources keep the tab indentation this repository requires rather than being rewritten to spaces. JSON files SHALL be the single exception and SHALL be indented with two spaces, because the package manager rewrites `package.json` with spaces on install and the formatter must not fight it.

#### Scenario: A component keeps its tabs

- **WHEN** a contributor runs `pnpm format` over `packages/ui/src/components`
- **THEN** every line in every `.astro` file is still indented with tab characters

#### Scenario: A stylesheet keeps its tabs

- **WHEN** a contributor runs `pnpm format` over `packages/ui/src/styles`
- **THEN** every indented declaration in every `.css` file is still indented with tab characters

#### Scenario: Installing does not create a formatting diff

- **WHEN** a maintainer runs `pnpm install` and then `pnpm format:check`
- **THEN** no `package.json` is reported as unformatted

### Requirement: Generated, vendored and archived paths are left alone

Both tools SHALL ignore `node_modules`, build output (`dist`), Astro's generated `.astro/` directories, and `pnpm-lock.yaml`. The formatter SHALL additionally ignore two paths whose contents it does not own: `openspec/changes/archive/`, so that archived change artifacts stay exactly as they were written when they were archived, and the generated `openspec-*` agent skills, which are produced by the `openspec` CLI and would be rewritten back on the next `openspec update`. The hand-written skills beside them SHALL still be formatted. Ignores SHALL be declared in files at the repository root.

#### Scenario: Archived changes are untouched

- **WHEN** a maintainer runs `pnpm format` and then inspects `git status`
- **THEN** no file under `openspec/changes/archive/` appears as modified

#### Scenario: Generated agent skills are not formatted

- **WHEN** a maintainer runs `pnpm format` and then inspects `git status`
- **THEN** no `SKILL.md` under a generated `.agents/skills/openspec-*/` directory appears as modified, while the hand-written `component-build` and `component-doc` skills are formatted normally

#### Scenario: Generated output is not formatted

- **WHEN** a maintainer runs `pnpm format` after a `pnpm build`
- **THEN** nothing under `docs/dist` or any `.astro/` directory is reported as changed, and the run does not slow down walking `node_modules`

### Requirement: Tooling never changes what the library publishes

Adding or running the linter and the formatter SHALL leave the published package identical in substance. `packages/ui/package.json` SHALL gain no scripts, no dependencies and no dev dependencies for this tooling, and all configuration SHALL live at the workspace root, outside the published file set. Formatting SHALL be whitespace-only over `packages/ui/src`: no selector, declaration, custom-property name, custom-property value, class name, prop, import specifier or export path may change, and in particular the palette stylesheets SHALL keep all 160 tokens, in the same order, with their OKLCH values byte-identical.

#### Scenario: The tarball is unchanged

- **WHEN** a maintainer runs `pnpm pack:check` after this tooling is installed and the repository is formatted
- **THEN** the listed files are exactly `src/components`, `src/layouts`, `src/html`, `src/types`, `src/styles`, `package.json`, `README.md` and `LICENSE`, with no configuration file among them

#### Scenario: The palette survives formatting

- **WHEN** a maintainer diffs `packages/ui/src/styles/colors/colors-dark.css` and `colors-light.css` before and after `pnpm format`, ignoring whitespace
- **THEN** the diff is empty: every `--nf-<hue>-<d|l>-<step>` token is present, in the same order, with the same OKLCH value

#### Scenario: Components render the same after formatting

- **WHEN** a maintainer runs `pnpm build` and `pnpm --filter docs check` after formatting the whole repository
- **THEN** both succeed, and every component demo page renders as it did before

### Requirement: The commands are documented where contributors and agents look

The repository's root `AGENTS.md` SHALL list `pnpm lint`, `pnpm lint:fix`, `pnpm format` and `pnpm format:check` in its command table with a one-line description of each, and SHALL state which tool backs each command, that tab indentation is enforced by the formatter rather than by convention alone, and that neither tool runs as part of `pnpm build`.

#### Scenario: An agent finds the commands

- **WHEN** an agent reads the root `AGENTS.md` before changing a component
- **THEN** it finds the lint and format commands in the same table as `pnpm build` and `pnpm pack:check`

#### Scenario: The indentation rule points at the tool

- **WHEN** a contributor reads the conventions section of `AGENTS.md` about tabs
- **THEN** it tells them `pnpm format` applies that rule, instead of asking them to apply it by hand
