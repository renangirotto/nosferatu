# docs (Starlight site)

Private documentation site for `astro-nosferatu`. It is never published, and it is also the project's integration test: it consumes the library exactly the way a real consumer does.

## Rules

- Import **only** through the package name: `astro-nosferatu/components/Button.astro`, `astro-nosferatu/styles/index.css`. A relative path into `../../packages/ui/src` defeats the point and breaks the [documentation-site spec](../openspec/specs/documentation-site/spec.md).
- Every documented component page renders the component **live** and shows its import line.
- Keep `"private": true` in [package.json](package.json).
- The library's styles are loaded globally through `customCss` in [astro.config.mjs](astro.config.mjs); don't re-import `index.css` per page.

## Layout

```
src/content/docs/index.mdx          Getting started
src/content/docs/styles.mdx         Styles overview
src/content/docs/components/*.mdx   One page per component (sidebar autogenerates)
```

New component → new `src/content/docs/components/<name>.mdx`. The sidebar picks it up automatically via `autogenerate`; no config edit needed.

The `component-doc` skill in [.agents/skills/component-doc](../.agents/skills/component-doc/SKILL.md) is the full procedure for one of these pages, including the sections every page must have.

## Checks

```
pnpm dev              # from the repo root
pnpm build            # must pass before any library change is considered done
pnpm --filter docs check
```
