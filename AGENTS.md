# nosferatu

pnpm workspace holding `astro-nosferatu` — an Astro component library that ships **source** `.astro` components and `.css` stylesheets — plus its Starlight documentation site.

```
packages/ui/   astro-nosferatu, the published npm package (src/components, src/styles)
docs/          Starlight documentation site (private, never published)
openspec/      specs (source of truth for behaviour) and change proposals
```

## Environment

- Node >= 22.22, pnpm via Corepack (`corepack enable`); the version is pinned in `package.json` → `packageManager`.
- If `pnpm` or `node` is not on `PATH`, they live in `/usr/local/bin`.

## Commands

Run from the repository root:

| Command | What it does |
|---|---|
| `pnpm install` | Install the workspace |
| `pnpm dev` | Start the docs site (library edits appear on reload, no reinstall) |
| `pnpm build` | Build the docs site — the closest thing to a full check |
| `pnpm pack:check` | Dry-run pack of `astro-nosferatu`; lists exactly what would be published |
| `pnpm --filter docs check` | `astro check` over the docs site |

There is **no build step, no bundler, and no test runner** for the library: consumers compile the sources. Never add one without an approved OpenSpec change. Verify library work with `pnpm build` (docs builds against the real package exports) and `pnpm pack:check`.

## Specs come first

`openspec/specs/` is the authoritative description of how this project must behave. Before changing library or docs behaviour, read the relevant spec:

- [library-package](openspec/specs/library-package/spec.md) — publishing, exports, tarball contents, Astro peer range
- [library-styles](openspec/specs/library-styles/spec.md) — stylesheets, tokens, cascade layers, palette
- [documentation-site](openspec/specs/documentation-site/spec.md) — docs behaviour and constraints

Non-trivial work goes through the OpenSpec workflow rather than straight into code. Use the `openspec-explore`, `openspec-propose`, `openspec-apply-change`, `openspec-update-change`, `openspec-sync-specs` and `openspec-archive-change` skills. Planning skills never edit project code; implementation happens only under `openspec-apply-change`. If behaviour changes, the spec delta changes with it — code and spec never drift apart.

## Hard invariants

These are spec requirements, not preferences. Breaking one is a bug:

1. **Every CSS custom property is `--nf-` prefixed.** No exceptions, in stylesheets and in component styles.
2. **No semantic color tokens.** Never define or reference `--nf-color-*`; colors come only from the palette in [colors.css](packages/ui/src/styles/colors.css) (`--nf-<hue>-<d|l>-<step>`, 8 hues × dark/light × steps 10–100 = 160 tokens, alphabetical by hue, dark before light, ascending step, OKLCH values unchanged).
3. **Layer order is fixed**: `nosferatu.tokens, nosferatu.colors, nosferatu.reset, nosferatu.typography`, declared in [index.css](packages/ui/src/styles/index.css). Unlayered consumer CSS must keep winning over all library CSS — so never raise specificity to "fix" an override.
4. **Each stylesheet is independently importable**, and `index.css` includes all of them.
5. **Components are self-styled through tokens**: scoped `<style>` only, design values exclusively via `var(--nf-*)`, and never a selector that reaches outside the component's own markup.
6. **Public import paths only**: `astro-nosferatu/components/<Name>.astro` and `astro-nosferatu/styles/<name>.css`. Docs must import through the package name, never by relative path into `packages/ui/src`.
7. **The library ships sources**, has no runtime dependencies, and declares `astro` `^7.0.0` as its only peer dependency. The published tarball contains only `src/components`, `src/types`, `src/styles`, `package.json`, `README.md`, `LICENSE`.
8. **`docs` stays private** and never becomes a dependency of the library.

## Conventions

- Indentation is **tabs** in `.astro` and `.css` sources; keep the existing style of any file you touch.
- Component classes are `nf-` prefixed and **not BEM**: the root is `.nf-<component>` and every other part is `.nf-<component>-<part>` (`.nf-callout-title`), with plain hyphens. Component-scoped custom properties spell the component's full name: `--nf-button-color`, `--nf-callout-surface-color`, never `--nf-btn-*`. Inside every rule, `--nf-*` declarations come before the ordinary properties. A prop that selects from a set of values renders as `data-ui-<prop>` and is matched in CSS to set those properties, rather than as a modifier class — see the `component-build` skill.
- Prop types shared by more than one component live in `packages/ui/src/types/` (`ColorPalette` for the palette hues) and are imported **relatively** from component source. The `@/*` alias is configured for `packages/ui` and `docs` but must never appear in published source: a consumer compiles it without the library's tsconfig, and an aliased type import degrades the prop to `any`.
- Components accept and forward native attributes (`interface Props extends HTMLAttributes<'button'>`), merge a consumer `class` through `class:list`, and spread the rest.
- Commit messages are Conventional Commits, scoped where useful: `feat(ui)!:`, `docs(openspec):`, `chore:`.

## Agent tooling in this repo

- `.agents/skills/` — skills read by DSH and other AGENTS-convention tools. Two kinds live here, and they are maintained differently:
  - `openspec-*` — **generated** by the `openspec` CLI. Refresh with `openspec update`; never hand-patch a generated `SKILL.md`.
  - `component-build`, `component-doc` — **hand-written**, owned by this repo. `openspec update` never touches them. `component-build` covers authoring a component under `packages/ui/src/components/`, `component-doc` covers its page under `docs/src/content/docs/components/`; each defers to the other for the half it does not do.
- `.dsh/skills/` — not present. Add it only for DSH-specific skills; it takes precedence over `.agents/skills/`.
- `.claude/launch.json` — hand-written docs dev-server config, not generated by any tool. The rest of `.claude/` was removed when the project moved to the AGENTS convention; to bring Claude Code back, run `openspec init --tools claude`.
- Instruction files are `AGENTS.md` at the repo root and in `packages/ui/` and `docs/`; the nested ones layer over the root when working in those directories.
