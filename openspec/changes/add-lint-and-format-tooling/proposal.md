# Proposal

## Why

The repository has no linter and no formatter. Style rules that the project treats as binding — tabs in `.astro` and `.css`, no stray debugging code, consistent quoting and spacing — live only in `AGENTS.md` and in whatever the author's editor happens to do. Every contributor (human or agent) re-derives them, and nothing catches a regression before `pnpm build`, which only reports what breaks the Starlight build. A linter and a formatter make those rules executable and give reviews one less thing to argue about.

## What Changes

- Add **Oxlint** (`oxlint`) as the repository's linter, installed as a root dev dependency, configured by a single `.oxlintrc.json` at the workspace root, and exposed as `pnpm lint` and `pnpm lint:fix`. This is the setup the [Oxlint docs recommend](https://oxc.rs/docs/guide/usage/linter.html). It covers `.ts`, `.mjs`, `.js` and the `<script>`/frontmatter blocks of `.astro` files.
- Add **Prettier** with **`prettier-plugin-astro`** as the repository's formatter, installed as exact-version root dev dependencies, configured by `.prettierrc.json` plus `.prettierignore` at the workspace root, and exposed as `pnpm format` and `pnpm format:check`. This is [Astro's documented approach](https://docs.astro.build/en/editor-setup/) for formatting `.astro` files outside the editor; the official plugin is the only formatter Astro itself maintains.
- Configure Prettier with `useTabs: true` so the formatter enforces — rather than fights — the repository's tab convention in `.astro` and `.css`, with a spaces override for `.json` so pnpm's own rewrites of `package.json` do not fight the formatter.
- Format the whole repository once in the adopting change: `.astro`, `.css`, `.ts`, `.mjs`, `.json`, `.md` and `.mdx`, excluding `node_modules`, `dist`, `.astro/` and `openspec/changes/archive/`.
- Document both tools in the root `AGENTS.md` command table and in the tooling section, so agents run them instead of re-deriving style by hand.
- No CI workflow is added: enforcement stays at the `pnpm` scripts, matching how every other check in this repository is run.

**Not a breaking change for consumers.** No published file's *content* changes meaning: formatting rewrites whitespace in `packages/ui/src/**`, but no selector, declaration, token name, token value, prop, class name or export path is touched. The published tarball's file list is unchanged — `packages/ui/package.json` gains no scripts and no dependencies, and the new config files live at the workspace root, outside `files: ["src"]`. Consumers see byte-different but semantically identical sources.

## Non-goals

- **No CI.** No GitHub Actions workflow, no pre-commit hook, no `lint-staged`. Enforcement is the documented `pnpm` scripts only.
- **No CSS linting.** Stylelint is not added. The library's CSS invariants (`--nf-` prefix, no `--nf-color-*`, layer order) stay enforced by spec review, not by a tool — Oxlint does not lint CSS and inventing a rule set for it is a separate decision.
- **No Oxfmt.** Oxc's own formatter does not support `.astro`, which is the repository's primary source format; Astro's documented Prettier setup wins here.
- **No ESLint.** Oxlint replaces it outright; there is no existing ESLint config to migrate.
- **No type-aware or multi-file Oxlint analysis**, and no custom JS plugins. The default correctness rule set is the starting point.
- **No build step, bundler or test runner.** The library still ships source; neither tool runs at publish time.
- **No reordering, renaming or value change in any stylesheet**, in particular `colors/colors-dark.css` and `colors/colors-light.css` — formatting must leave all 160 palette tokens in place, in order, with their OKLCH values untouched.

## Capabilities

### New Capabilities

- `repository-tooling`: the linter and formatter the repository runs, the commands that invoke them, which files each one owns, and the style decisions they encode (tabs, JSON exception, ignore set). Covers the fact that running the formatter must never change the meaning of a published source file.

### Modified Capabilities

None. No library or documentation-site behaviour changes: no component markup, no token, no stylesheet content, no export path, no docs page content.

## Impact

- **Root `package.json`**: new `devDependencies` (`oxlint`, `prettier`, `prettier-plugin-astro`) and four new scripts (`lint`, `lint:fix`, `format`, `format:check`).
- **New root files**: `.oxlintrc.json`, `.prettierrc.json`, `.prettierignore`.
- **`pnpm-lock.yaml`**: updated by the install.
- **Whitespace-only rewrites** across `packages/ui/src/**`, `docs/src/**`, `docs/astro.config.mjs`, the three `tsconfig.json` files and the repository's Markdown.
- **`AGENTS.md`**: command table and tooling section gain the new commands.
- **`packages/ui/package.json` and `docs/package.json`**: unchanged.
- Nothing in `openspec/specs/` changes except the new `repository-tooling` capability.
