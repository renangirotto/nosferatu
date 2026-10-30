# Design

## Context

See [proposal.md](proposal.md) — Why. What shapes the approach here:

- The repository is a pnpm workspace with **no build step, no bundler, no test runner**. Any tooling added has to be a command a contributor runs, never something the library's consumers inherit.
- The dominant source formats are `.astro` and `.css`. There is almost no standalone JavaScript: `docs/astro.config.mjs`, `docs/src/content.config.ts`, `packages/ui/src/types/components.ts`, and the frontmatter of each `.astro` file.
- Indentation is **tabs** in `.astro` and `.css`, and also in the three `tsconfig.json` files. `package.json` files are two-space, because pnpm writes them that way.
- The published package is defined by `files: ["src"]` in [packages/ui/package.json](packages/ui/package.json). Anything at the workspace root is invisible to the tarball.
- `openspec/changes/archive/` holds the written record of past changes; rewriting it would create noise in every future diff.

## Goals / Non-Goals

**Goals:**

- One linter and one formatter, configured once at the workspace root, covering both packages.
- The formatter _encodes_ the repository's existing conventions; adopting it must not silently change what the conventions are.
- A single adoption commit whose non-config diff is provably whitespace-only over `packages/ui/src`.
- Leave a clean path to CI later (the scripts already exit non-zero correctly) without adding CI now.

**Non-Goals:**

- Beyond the proposal's Non-goals: no attempt to make the linter enforce the library's CSS invariants, and no custom rules of any kind. Rule-set tuning beyond Oxlint's defaults is deliberately left for a later change, once the defaults have been lived with.
- No per-package configuration. Nested Oxlint configs and per-package Prettier files are explicitly avoided.

## Decisions

### Oxlint as the linter, with default rules and a root config

`oxlint` as a root dev dependency, `.oxlintrc.json` at the root generated from `oxlint --init` and then trimmed, scripts `lint` / `lint:fix`. This is exactly the setup [the Oxlint docs recommend](https://oxc.rs/docs/guide/usage/linter.html).

Why: it needs no plugin to read `.astro` files — Oxlint lints the script blocks of `.astro`, `.vue` and `.svelte` natively — and its default rule set is correctness-focused, so adoption produces signal rather than a wall of style complaints that Prettier is about to settle anyway.

Alternatives considered:

- **ESLint + `eslint-plugin-astro`**, which Astro's editor-setup page lists first. Rejected: a large dependency tree and a flat-config file to maintain, for a repository with four JavaScript files. There is no existing ESLint config to preserve, so the usual migration argument does not apply.
- **Biome** as one tool for both jobs. Rejected: its `.astro` support is explicitly experimental and limited to frontmatter, and Astro's own docs say so. The formatter half is the part this repository cares about most, and it is the weakest.
- **Type-aware linting** (`tsgo`). Rejected for now: it needs a running TypeScript program per package and buys little when the only typed code is prop interfaces, which `astro check` already covers.

Scope note: Oxlint will effectively see very little code. That is accepted — its value is the floor it sets as components grow client-side scripts, not the defects it finds today.

### Prettier + `prettier-plugin-astro` as the formatter

`prettier` and `prettier-plugin-astro` as **exact-version** root dev dependencies, `.prettierrc.json` registering the plugin with a `*.astro` → `parser: astro` override, scripts `format` / `format:check`. This is [Astro's documented approach](https://docs.astro.build/en/editor-setup/) verbatim, including the exact-version pin, which Prettier recommends so that a patch release cannot reformat the repository under you.

Why this and not Oxc's own formatter: **Oxfmt does not support `.astro`**, the repository's primary source format. Picking Oxfmt would mean formatting four JavaScript files and leaving every component and stylesheet unformatted — the opposite of the goal. Mixing Oxfmt for JS with Prettier for Astro would mean two formatters disagreeing about the same frontmatter. So the toolchain is deliberately split: Oxc for linting, Prettier for formatting.

Alternatives considered: **dprint + `markup_fmt`** (also listed by Astro) — more configurable and faster, but a community plugin for `.astro` against Astro's own first-party one; the official plugin is the safer default for a library whose source _is_ its artifact.

### `useTabs: true`, with a two-space override for JSON

The one place the configuration is opinionated. Prettier defaults to spaces; this repository is tabs. Setting `useTabs: true` makes the formatter agree with [AGENTS.md](../../../AGENTS.md) instead of overturning it, so adoption does not rewrite every `.astro` and `.css` file's indentation.

JSON is the exception: pnpm rewrites `package.json` with two spaces on every install, so a tab rule there would produce a formatting diff after every `pnpm install`. The override keeps `format:check` honest. `tsconfig.json` files currently use tabs and will be rewritten to spaces by this override — a deliberate, inert change.

No other Prettier option is set. Print width, quotes and semicolons stay at Prettier's defaults rather than being argued about.

### Code inside Markdown fences is never reformatted

`embeddedLanguageFormatting: "off"`, scoped by an override to `*.md` and `*.mdx` only.

Discovered during implementation: with Prettier's default (`auto`), formatting the docs rewrote the code samples readers see — every `import Button from 'astro-nosferatu/…'` became double-quoted, and one sample gained a blank line. Six scenarios in the live `documentation-site` spec quote those import lines with single quotes, so the default would have put the docs out of step with their own spec inside a change that is not meant to touch documentation behaviour at all.

Documented samples are hand-curated teaching material, not code the formatter owns. Turning embedded formatting off for Markdown keeps them byte-for-byte as authored while the surrounding MDX prose, tables and JSX are still formatted. Verified: the built documentation HTML is byte-identical to the pre-format build.

The override is deliberately scoped rather than global, because `prettier-plugin-astro` formats a component's `<style>` block through the same embedded-formatting mechanism, and those blocks _are_ the formatter's job.

Alternatives considered: updating the six `documentation-site` scenarios to double quotes (grows this change into a live spec it was not meant to touch); `singleQuote: true` repo-wide (flips every import in published source for the sake of documentation prose).

### Formatter ownership includes `.css` and `.mdx`

Chosen over a narrower file set so that there is exactly one answer to "how is this file formatted". The cost is a large one-time diff in the palette stylesheets and the docs pages; the mitigations are below.

### The formatter does not own generated files

Also discovered during implementation: the first full `pnpm format` rewrote the eight generated `.agents/skills/openspec-*/SKILL.md` files, which `AGENTS.md` states are produced by `openspec update` and must never be hand-patched. Formatting them would be undone on the next regeneration, so the diff is pure churn. They join `openspec/changes/archive/` in `.prettierignore`, by the same rule: the formatter owns files this repository authors and maintains, not files another tool generates or has frozen. The hand-written `component-build` and `component-doc` skills next to them stay formatted.

### Everything at the workspace root; `packages/ui` untouched

Config files, dev dependencies and scripts all live at the root. `packages/ui/package.json` gains nothing, so the publish surface is provably unchanged and `pnpm pack:check` is the proof.

### Invariants

Upholds, and does not bend, every invariant in `openspec/specs`:

- Invariants 1, 2, 3, 4, 5 (`--nf-` prefix, no semantic color tokens, fixed layer order, independently importable stylesheets, self-styled components) — the formatter rewrites whitespace only; none of these are whitespace properties. Verified by a whitespace-ignoring diff.
- Invariant 6 (public import paths) — the formatter does not touch import specifiers; the linter is not configured with any import-rewriting rule.
- Invariant 7 (tarball contents) — guaranteed by keeping configuration at the root; verified by `pnpm pack:check`.
- Invariant 8 (`docs` stays private) — no dependency direction changes; both tools are root dev dependencies.
- The project context's "no build step, no bundler, no test runner" rule — neither tool is wired into `pnpm build`, `pnpm dev` or publishing. This is stated as a requirement in the spec precisely so a later change cannot quietly turn the linter into a build step.

## Risks / Trade-offs

- **Prettier reformats `.mdx` in a way Starlight dislikes** (component JSX in MDX, `<Steps>` blocks, code fences with meta). → Format `.mdx` in its own step, before the rest, and run `pnpm build` and `pnpm --filter docs check` immediately after that step alone. If a page breaks, add that file to `.prettierignore` and record it, rather than abandoning MDX formatting wholesale.
- **The palette stylesheets get reordered or their values rewritten.** → Explicit verification: `git diff -w` over `packages/ui/src/styles/colors/` must be empty, plus a token count of 160. This is in the task list, not left to review.
- **The one-time reformat buries a real change in whitespace noise.** → The adoption keeps configuration and reformat as separate commits, so `git log` has a reviewable "install tooling" commit and a mechanical "format repository" commit that reviewers can read with `-w`.
- **`prettier-plugin-astro` and `prettier` drift apart on a patch release.** → Both pinned exactly, as Astro's docs instruct; upgrades become a visible, intentional change.
- **Oxlint's defaults flag something in `docs/`** that is idiomatic Astro. → Disable the specific rule in `.oxlintrc.json` with a comment saying why; do not disable whole plugins and do not add file-level ignore comments.
- **`prettier-plugin-astro` requires Node >= 22.12 and Oxlint >= 22.12** → already satisfied by the repository's `engines.node: ">=22.22"`.
- **Two tools instead of one.** Accepted: no single tool formats `.astro` well _and_ lints as well as Oxlint today. If Oxfmt gains `.astro` support, consolidating becomes a small, isolated follow-up change.

## Migration Plan

1. Install and configure both tools; commit with the repository still unformatted. `pnpm lint` must already pass at this point.
2. Reformat in widening rings, building after each: `packages/ui/src` → `docs/src` → root config and Markdown.
3. Update `AGENTS.md`.
4. Rollback is `git revert` of the two commits plus `pnpm install`; nothing persists outside the repository.

## Open Questions

- Which Oxlint rules beyond the defaults are worth enabling once the repository has lived with them. Deferred intentionally: it changes no requirement here and is a config-only follow-up.
