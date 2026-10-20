# Design

## Context

The repository is empty (only a README and OpenSpec setup). See proposal.md for motivation and specs/ for the required behavior. The current versions are Astro 7.4.1 and Starlight 0.42.6, which needs `astro ^7.2.10` and Node >= 22.22. pnpm is not installed on the maintainer's machine; Node 24 ships Corepack.

## Goals / Non-Goals

**Goals:**
- The tarball boundary comes from the project structure, not from developer discipline.
- The docs site breaks when the public exports break.
- Zero build tooling in the library.

**Non-Goals:**
- Type declaration generation, bundling or minification (consumers' Astro/Vite does this).
- A component-preview tool other than Starlight (no Storybook).
- Automated releases. Publishing stays a manual, reviewed step.

## Decisions

### 1. Two workspace packages instead of one package with a docs folder

```
nosferatu/                      private root: scripts, packageManager, workspace config
+-- pnpm-workspace.yaml         packages: ["packages/*", "docs"]
+-- packages/ui/                astro-nosferatu   (published)
|   +-- package.json
|   +-- README.md, LICENSE
|   +-- src/components/Button.astro
|   +-- src/styles/{tokens,reset,base,typography,index}.css
+-- docs/                       private Starlight site
    +-- package.json            deps: astro, @astrojs/starlight, astro-nosferatu: workspace:*
    +-- astro.config.mjs
    +-- src/content/docs/       index.mdx, styles.mdx, components/button.mdx
```

Starlight sits in a different manifest, so it cannot leak into the library's dependencies or tarball by mistake. **Alternative:** one package with `docs/` inside and `files` filtering. Rejected because isolation would then depend on `files` and `devDependencies` staying correct by hand.

### 2. Ship source with an `exports` map

`packages/ui/package.json` (relevant fields):

```json
{
  "name": "astro-nosferatu",
  "type": "module",
  "exports": {
    "./components/*": "./src/components/*",
    "./styles/*": "./src/styles/*",
    "./package.json": "./package.json"
  },
  "files": ["src"],
  "keywords": ["astro-component", "astro", "ui", "css"],
  "peerDependencies": { "astro": "^7.0.0" },
  "devDependencies": { "astro": "^7.4.1" }
}
```

The `*` patterns keep the file extension in the specifier (`components/Button.astro`, `styles/index.css`), so adding a component or stylesheet never requires editing `exports`. `./package.json` is exposed because some tooling reads it. Astro and Vite compile `.astro` files coming from `node_modules`, so no build step is needed. **Alternative:** a Vite library build to `dist/`. Rejected because Astro components can't be pre-compiled usefully and it adds tooling for nothing.

### 3. Styles: plain CSS, layered in `index.css`

`reset.css`, `base.css` and `typography.css` hold plain, unlayered rules. `index.css` declares the order and imports them into layers:

```css
@layer nosferatu.reset, nosferatu.base, nosferatu.typography;
@import "./tokens.css";
@import "./reset.css" layer(nosferatu.reset);
@import "./base.css" layer(nosferatu.base);
@import "./typography.css" layer(nosferatu.typography);
```

`@import` statements stay ahead of any rules (the `@layer` statement is allowed before them). Tokens stay unlayered: custom properties on `:root` don't compete with consumer rules. **Trade-off:** a consumer who imports `reset.css` directly gets it unlayered. That's acceptable and gets documented: individual files are for opting in to one piece, and `index.css` is the layered entry point.

Token naming: `--nf-<group>-<name>`, for example `--nf-color-primary`, `--nf-space-3`, `--nf-font-body`, `--nf-radius-md`. The starter set stays small: colors, spacing scale, font families/sizes, radius.

### 4. Components: scoped `<style>`, tokens only

`Button.astro` defines a typed `Props` interface (`variant`, `type`, plus any other attributes passed through to `<button>`), renders a `<slot />`, and styles itself with Astro's default scoped `<style>`, using only `var(--nf-*)` values. A `var()` fallback isn't needed: the docs and consumers are expected to load `tokens.css`, and the docs show this.

### 5. Docs import by package name

The docs pages import `astro-nosferatu/components/Button.astro` and load `astro-nosferatu/styles/index.css` through Starlight's `customCss` option. pnpm symlinks the workspace package, so library edits show up in the docs dev server without reinstalling.

### 6. pnpm via Corepack

The root `package.json` has `"private": true`, `"packageManager": "pnpm@12.14.0"`, `"engines": { "node": ">=22.22" }`, and scripts `dev` / `build` (filter to docs) and `pack:check` (`pnpm --filter astro-nosferatu pack --dry-run`). Contributors run `corepack enable` once.

## Risks / Trade-offs

- [Starlight's global styles could hide problems in the library's reset/base, since Starlight has its own styling] → The docs render demos inside Starlight's content area, where the library's unlayered component styles still win. The layered globals mainly get checked by importing them in a consumer page. Acceptable for the initial setup; a plain demo page in the docs can come later if needed.
- [A consumer's Vite setup might not process `.astro` from `node_modules`] → Astro handles this for packages that list `astro` as a peer; the `astro-component` keyword and the peer dep cover it.
- [The `files: ["src"]` boundary could quietly widen if non-library folders are added under `src/`] → The `pack:check` script lists the tarball, and the spec states which paths are allowed.
- [Starlight is pre-1.0, so minor versions can break] → Pin it with a caret on the current minor in `docs/` only; it never affects consumers.

## Open Questions

- License: assumed MIT (the usual default for open-source npm packages). Confirm before the first publish; changing it only swaps the `LICENSE` file and the `license` field.
