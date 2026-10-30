# nosferatu

Home of [`astro-nosferatu`](packages/ui), an Astro component library that ships styles (`.css`) and components (`.astro`), plus its documentation site.

```
packages/ui/   astro-nosferatu, the published npm package (src/components, src/styles)
docs/          Astro Starlight documentation site (private, never published)
```

## Prerequisites

- Node >= 22.22
- pnpm through Corepack: run `corepack enable` once. The version is pinned in `package.json` (`packageManager`).

## Commands

Run these from the repository root:

| Command           | What it does                                                      |
| ----------------- | ----------------------------------------------------------------- |
| `pnpm install`    | Installs the workspace                                            |
| `pnpm dev`        | Starts the docs site locally. Library edits show up on reload.    |
| `pnpm build`      | Builds the docs site                                              |
| `pnpm pack:check` | Lists exactly which files would be published in `astro-nosferatu` |
