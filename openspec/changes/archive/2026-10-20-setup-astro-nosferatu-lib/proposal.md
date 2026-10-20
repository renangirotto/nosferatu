# Proposal

## Why

We want an open-source Astro component library, `astro-nosferatu`, that ships reusable styles and `.astro` components, plus a documentation site for it. The repository is empty, so we need a project setup that keeps the published package down to just the styles and components, while the Starlight docs live alongside it and are never published.

## What Changes

- Add a pnpm workspace at the repository root (private root `package.json`, `pnpm-workspace.yaml`, pnpm pinned through Corepack with the `packageManager` field).
- Add `packages/ui`: the `astro-nosferatu` package, published publicly on npm. It ships `.astro` and `.css` source files with no build step, exposes `./components/*` and `./styles/*` through `exports`, limits the tarball to `src/` through `files`, and declares `astro ^7.0.0` as a peer dependency.
- Add the global styles: `tokens.css` (`--nf-` custom properties), `reset.css`, `base.css`, `typography.css`, and an aggregate `index.css` that loads them into the cascade layers `nosferatu.reset`, `nosferatu.base` and `nosferatu.typography`.
- Add one starter component, `Button.astro`, with a scoped `<style>` that uses only `--nf-*` tokens.
- Add `docs/`: a private Astro Starlight site that depends on `astro-nosferatu` through `workspace:*` and imports it by package name, the same way a consumer would.
- Add a check that lists the publishable tarball (`pnpm pack --dry-run`) to confirm only `src/` and `package.json`-level files ship.

Out of scope: build/bundle step, release tooling (changesets), docs deployment, CI.

## Capabilities

### New Capabilities
- `library-package`: How `astro-nosferatu` is packaged and consumed: package identity, public exports, tarball contents, peer dependency range, and no build step.
- `library-styles`: The global stylesheet set, the `--nf-` token prefix, the `nosferatu.*` cascade layer order, and the rule that components style themselves through scoped styles and tokens.
- `documentation-site`: The Starlight documentation site: private, never published, consuming the library through its public exports.

### Modified Capabilities

None.

## Impact

- New files at the repo root (`package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.gitignore`) and two new workspace packages (`packages/ui`, `docs`).
- New dependencies: `astro` (^7) and `@astrojs/starlight` in `docs/` only. `packages/ui` has `astro` as a peer and dev dependency only, with no runtime dependencies.
- Contributors need Node >= 22.22 and Corepack enabled to get the pinned pnpm.
- Publishing to npm stays a manual, human-approved step. This change does not publish anything.
