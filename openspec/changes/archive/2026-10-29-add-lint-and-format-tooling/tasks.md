# Tasks

## 1. Install and wire the linter

- [x] 1.1 Add `oxlint` as a dev dependency of the workspace root (`pnpm add -D -w oxlint`) and verify `pnpm exec oxlint --version` prints a version and `pnpm-lock.yaml` is updated.
- [x] 1.2 Generate `.oxlintrc.json` at the repository root with `pnpm exec oxlint --init`, trim it to the default correctness rule set plus an `ignorePatterns` entry covering `node_modules`, `dist`, `**/.astro/**` and `pnpm-lock.yaml`, and verify `pnpm exec oxlint --print-config docs/astro.config.mjs` resolves without error.
- [x] 1.3 Add `"lint": "oxlint"` and `"lint:fix": "oxlint --fix"` to the root `package.json` scripts, and verify `pnpm lint` runs over both `packages/ui` and `docs` and exits zero on the current checkout. If it reports errors, fix the offending code — do not disable a rule to silence a genuine defect.
- [x] 1.4 Confirm the linter reads Astro frontmatter: temporarily insert a `debugger` statement in the frontmatter of `packages/ui/src/components/Button.astro`, verify `pnpm lint` reports it and exits non-zero, then remove it and verify `pnpm lint` is clean again.
- [x] 1.5 Confirm the linter is not a build step: verify `pnpm build` succeeds while a deliberate lint error is present, then remove the error.

## 2. Install and configure the formatter

- [x] 2.1 Add `prettier` and `prettier-plugin-astro` as **exact-version** dev dependencies of the workspace root (`pnpm add -D -E -w prettier prettier-plugin-astro`) and verify both appear in the root `package.json` with no `^` range.
- [x] 2.2 Create `.prettierrc.json` at the repository root registering `prettier-plugin-astro`, overriding `*.astro` to `parser: "astro"`, setting `useTabs: true`, and overriding `*.json` to `useTabs: false` with `tabWidth: 2`. Verify with `pnpm exec prettier --file-info packages/ui/src/components/Button.astro` that the resolved parser is `astro` and the config file is the root one.
- [x] 2.3 Create `.prettierignore` at the repository root ignoring `node_modules`, `dist`, `**/.astro/`, `pnpm-lock.yaml`, `openspec/changes/archive/` and the generated `.agents/skills/openspec-*/` directories, and verify `pnpm exec prettier --check openspec/changes/archive` reports no matching files.
- [x] 2.4 Add `"format": "prettier . --write"` and `"format:check": "prettier . --check"` to the root `package.json` scripts and verify `pnpm format:check` runs and reports the still-unformatted files (a non-zero exit here is expected at this point).
- [x] 2.5 Commit the configuration before reformatting anything, so the reformat lands as its own reviewable commit.

## 3. Reformat the library sources

- [x] 3.1 Run `pnpm exec prettier "packages/ui/**/*.{astro,css,ts,json}" --write`, then verify that every changed file is equivalent to its pre-format version once whitespace and quote style are normalized — no selector, declaration, token, class, prop or import specifier changed. (`git diff -w` alone is not sufficient: Prettier re-wraps long `var()` values and JSX expressions across lines, and `-w` still reports those. Compare each file's `git show HEAD:<file>` against its new contents with all whitespace stripped and `'` normalized to `"`.)
- [x] 3.2 Verify the palette survived: `git diff -w -- packages/ui/src/styles/colors/` is empty, and `grep -c -- '--nf-' packages/ui/src/styles/colors/colors-dark.css` and the light file still report their original token counts with the OKLCH values unchanged.
- [x] 3.3 Verify indentation is still tabs: no `.astro` or `.css` file under `packages/ui/src` contains a line indented with leading spaces.
- [x] 3.4 Verify the layer order block in `packages/ui/src/styles/index.css` is intact and in the order `nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset, nosferatu.typography`, exactly as before formatting, with each `@import` still carrying its matching `layer()`.
- [x] 3.5 Run `pnpm build` and `pnpm --filter docs check` and verify both succeed.

## 4. Reformat the docs site

- [x] 4.1 Run `pnpm exec prettier "docs/**/*.{md,mdx}" --write` **first, on its own**, then run `pnpm build` and `pnpm --filter docs check` and verify both succeed. For any page the formatter breaks, add that exact file to `.prettierignore` with a comment saying why, revert it, and re-verify. (No page needed ignoring. The default `embeddedLanguageFormatting: "auto"` did rewrite the code samples readers see — single quotes to double, plus a blank line — so `.prettierrc.json` now sets `embeddedLanguageFormatting: "off"` for `*.md` and `*.mdx`; see design.md.)
- [x] 4.2 Verify the built docs are unchanged by the reformat: build the site from the pre-format Markdown, build it again from the formatted Markdown, and diff every generated `.html` file. All 11 pages — including the Button, Callout and Accordion pages and `examples/blog-article` — must come out byte-identical. (Stronger than opening each page by hand, and it covers all of them.)
- [x] 4.3 Run `pnpm exec prettier "docs/**/*.{astro,css,ts,mjs,json}" --write`, then verify `pnpm build` and `pnpm --filter docs check` still succeed and `git diff -w -- docs` shows no non-whitespace change outside the files `.prettierignore` now lists.

## 5. Reformat the remaining repository files

- [x] 5.1 Run `pnpm format` over the whole repository and verify `git status` shows no modification under `openspec/changes/archive/`, the generated `.agents/skills/openspec-*/` directories, `node_modules`, `dist` or any `.astro/` directory.
- [x] 5.2 Verify idempotence: run `pnpm format` a second time and confirm it reports no file as changed, then run `pnpm format:check` and confirm it exits zero.
- [x] 5.3 Run `pnpm install` and then `pnpm format:check` again, and verify no `package.json` is reported as unformatted (this is what the JSON spaces override exists for).

## 6. Document the tooling

- [x] 6.1 Add `pnpm lint`, `pnpm lint:fix`, `pnpm format` and `pnpm format:check` to the command table in the root `AGENTS.md`, each with a one-line description, and verify every command in the table runs as written.
- [x] 6.2 In `AGENTS.md`, state that Oxlint backs the lint commands and Prettier with `prettier-plugin-astro` backs the format commands, that neither runs as part of `pnpm build`, and update the indentation convention line to say `pnpm format` applies the tab rule rather than asking contributors to apply it by hand.
- [x] 6.3 Note in `AGENTS.md` that the formatter's configuration and ignore files live at the workspace root and that `packages/ui` deliberately carries none, so the published tarball is unaffected.

## 7. Verification

- [x] 7.1 Run `pnpm install && pnpm lint && pnpm format:check && pnpm build && pnpm --filter docs check`. Passing means: install resolves, the linter reports no errors, every owned file is already formatted, the docs site builds without error, and `astro check` reports zero errors.
- [x] 7.2 Run `pnpm pack:check` and verify the listed files are exactly `src/components`, `src/html`, `src/layouts`, `src/styles`, `src/types`, `package.json`, `README.md` and `LICENSE` — no `.prettierrc.json`, `.prettierignore` or `.oxlintrc.json` among them — and that `packages/ui/package.json` gained no scripts and no dependencies.
- [x] 7.3 Review the full change with `git diff -w` across `packages/ui/src` and confirm the only non-whitespace changes in the repository are the three new root config files, the root `package.json`, `pnpm-lock.yaml`, `AGENTS.md` and this change's OpenSpec artifacts.
