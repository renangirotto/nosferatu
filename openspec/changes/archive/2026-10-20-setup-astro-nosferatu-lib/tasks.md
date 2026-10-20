# Tasks

## 1. Workspace scaffold

- [x] 1.1 Create the root `package.json` (`private: true`, `packageManager: "pnpm@12.14.0"`, `engines.node: ">=22.22"`, scripts `dev`, `build`, `pack:check`), plus `pnpm-workspace.yaml` (`packages/*`, `docs`) and `.gitignore` (`node_modules`, `dist`, `.astro`). Verify `corepack enable && pnpm -v` prints 12.14.0 from the repo root.
- [x] 1.2 Update the root `README.md` with the repo layout, prerequisites (Node >= 22.22, `corepack enable`) and the `dev` / `build` / `pack:check` commands. Verify each documented command exists in the root `package.json` scripts.

## 2. Library package skeleton

- [x] 2.1 Create `packages/ui/package.json` per design decision 2 (`name: astro-nosferatu`, `type: module`, `exports` for `./components/*`, `./styles/*` and `./package.json`, `files: ["src"]`, keywords including `astro-component`, `license: MIT`, `peerDependencies.astro: ^7.0.0`, `devDependencies.astro: ^7.4.1`, no `dependencies`). Verify `pnpm install` succeeds and `@astrojs/starlight` does not appear in this manifest.
- [x] 2.2 Add `packages/ui/README.md` (install, import paths for components and styles, the layered vs. individual stylesheet note) and `packages/ui/LICENSE` (MIT). Verify both files exist.
- [x] 2.3 Verify `pnpm pack:check` runs from the root and lists only `package.json`, `README.md` and `LICENSE` (the `src/` files arrive in groups 4–5).

## 3. Docs site skeleton

- [x] 3.1 Create `docs/` as a Starlight site: `docs/package.json` (`private: true`, deps `astro ^7.4.1`, `@astrojs/starlight` on the current minor, `astro-nosferatu: workspace:*`), `astro.config.mjs` with title, sidebar (Getting started, Styles, Components) and `customCss: ["astro-nosferatu/styles/index.css"]` (add once 4.4 exists), and `src/content/docs/index.mdx` covering install and basic usage. Verify `pnpm dev` serves the home page and `pnpm build` succeeds.
- [x] 3.2 Verify the docs are unpublishable: `docs/package.json` has `"private": true`. (Dry runs of `pnpm publish` and `npm publish` do not enforce `private`; a real publish fails with EPRIVATE, which is not run here.)

## 4. Styles

- [x] 4.1 Add `src/styles/tokens.css` with the starter `--nf-*` tokens on `:root` (colors including `--nf-color-primary`, spacing scale, font families and sizes, radius). Verify with `grep -E -- '--[a-z]' src/styles/*.css` that every declared custom property starts with `--nf-`.
- [x] 4.2 Add `src/styles/reset.css` (box-sizing, margin reset, media defaults) and `src/styles/base.css` (html/body defaults from tokens, `:focus-visible` ring, selection) as plain unlayered CSS. Verify they contain no `@layer` and use only `--nf-*` values for design values.
- [x] 4.3 Add `src/styles/typography.css` (headings, paragraphs, lists, links, code) using `--nf-*` tokens. Verify it contains no `@layer` and only `--nf-*` custom properties.
- [x] 4.4 Add `src/styles/index.css` per design decision 3 (`@layer nosferatu.reset, nosferatu.base, nosferatu.typography;` followed by the four `@import`s, tokens unlayered). Enable it in the docs' `customCss`. Verify in the built docs that DevTools shows the three `nosferatu.*` layers in order, and that an unlayered `h1 { color: red }` added to a test page wins over typography.
- [x] 4.5 Write `docs/src/content/docs/styles.mdx`: importing `index.css` vs. individual files, the layer order and how consumer CSS wins, the `--nf-` token list, and re-theming by overriding a token. Verify the page renders in `pnpm dev` and its import snippets match the real export paths.

## 5. Button component

- [x] 5.1 Add `src/components/Button.astro` per design decision 4: typed `Props` (`variant: "primary" | "secondary"`, `type` defaulting to `"button"`, other attributes passed through), `<slot />`, and a scoped `<style>` using only `var(--nf-*)`. Verify `pnpm --filter docs exec astro check` passes.
- [x] 5.2 Write `docs/src/content/docs/components/button.mdx` importing `astro-nosferatu/components/Button.astro`, with live demos of each variant and the import line shown. Verify the page renders the buttons, a plain `<button>` on the same page is unstyled by the component, and overriding `--nf-color-primary` on the page changes the button color.

## 6. Integration checks

- [x] 6.1 Run `pnpm pack:check` and confirm every listed file is `package.json`, `README.md`, `LICENSE`, `src/components/**` or `src/styles/**`.
- [x] 6.2 Confirm the docs build depends on the exports: temporarily change `./components/*` in `packages/ui/package.json` to an invalid target, run `pnpm build`, see it fail on the import, then revert.
- [x] 6.3 With `pnpm dev` running, edit `Button.astro` and confirm the docs page reflects it after reload, without reinstalling.
- [x] 6.4 Pack the library (`pnpm --filter astro-nosferatu pack`), install the tarball into a throwaway Astro 7 project in the scratchpad, import `Button.astro` and `styles/index.css`, and confirm it builds with no peer warnings. Then confirm that importing a non-exported path (such as `astro-nosferatu/package.json` is allowed, `astro-nosferatu/src/components/Button.astro` is not) fails with a package-exports error.
