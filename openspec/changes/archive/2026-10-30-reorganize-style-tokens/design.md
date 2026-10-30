# Design

## Context

See [proposal.md](proposal.md) — Why. What shapes the approach here:

- The library ships source CSS with no bundler. `@import` in a published stylesheet is resolved by the consumer's Astro/Vite build, which already happens today for `colors/index.css` and for `index.css` itself. Nesting imports one level deeper (`index.css` → `tokens.css` → `colors/index.css` → `colors-dark.css`) is the same mechanism, not a new one.
- CSS requires `@import` rules to precede every other rule in a file. A `tokens.css` that is nothing but imports is legal; a `tokens.css` that keeps a `:root` block **and** imports would have to put the imports first, which reads backwards. That constraint is part of why the file ends up empty of declarations.
- `exports` in [package.json](../../../packages/ui/package.json) already maps `./styles/*` with a wildcard, so `spacings.css` and `borders.css` become importable the moment they exist. Nothing in the manifest changes.
- Four tokens outside the spacing and radius ramps are actually consumed: `--nf-font-body` (Button), `--nf-font-size-md` and `--nf-line-height-heading` (Callout), `--nf-font-weight-medium`/`-bold` (Callout, Accordion), `--nf-font-size-xl` (Callout's icon box). Everything else in `tokens.css` is dead weight.
- Three invariants in [AGENTS.md](../../../AGENTS.md) are in play: the fixed layer order (3), independent importability (4), and components being self-styled through tokens (5). This change rewrites the first and bends the third; the second is preserved as-is.

## Goals / Non-Goals

**Goals:**

- One entry point for tokens (`tokens.css`), one file per token group, and a name for every step that says where it sits on its scale.
- No visual change at the default root font size: every value a component renders today it renders after the change.
- Keep every current standalone import path working, including the ones `index.css` no longer names.

**Non-Goals:**

- A general `px`-for-`rem` sweep. Only the spacing and radius values convert; type stays in `rem` because it should follow the reader's font size.
- Tokenising the components' raise geometry, or inventing tokens for border width, transition duration or travel distance.
- Any deprecation period. The old names are removed in the same change that adds the new ones.

## Decisions

### 1. `tokens.css` becomes a pure aggregate rather than a file that also declares tokens

`tokens.css` ends up as four `@import` lines and nothing else. The alternative — keep the spacing and radius ramps inside `tokens.css` and add only `colors` and `shadows` imports — was rejected for two reasons: the `@import`-must-come-first rule makes a mixed file read oddly, and the point of the reorganisation is that a reader opening `tokens.css` sees the _map_ of what the library publishes, not one group's values plus pointers to the rest. A consumer who wants only spacing imports `spacings.css`; a consumer who wants everything imports `tokens.css`. Those are the two sensible shapes, and a mixed file serves neither.

The cost: "import `tokens.css` to get the non-color tokens" stops being true, and the Callout documentation sentence about loading `tokens.css` without `shadows.css` becomes wrong. Both are updated in this change.

### 2. The layers collapse to `nosferatu.tokens, nosferatu.reset, nosferatu.typography`

A cascade layer only matters where two rules compete. `nosferatu.colors` and `nosferatu.shadows` never competed with `nosferatu.tokens` with anything: all three contain `:root` custom property declarations and nothing else, and no property name appears in two of them. Collapsing them changes no resolved value — it only removes two layer names from the public surface. Keeping them would mean `tokens.css` importing its children with `layer(nosferatu.colors)` written inside the published file, which would then put a layer name into a stylesheet a consumer may import standalone, breaking the current rule that only `index.css` layers anything.

`reset.css` and `typography.css` keep their own layers because they style consumer elements and genuinely compete — the type scale has to win over the reset.

This bends invariant 3 by rewriting it; the part of it that actually protects consumers — unlayered consumer CSS beats every library layer — is untouched, and is re-asserted in the spec delta.

### 3. The scale is named by distance from a `16px` base, in `px`

`--nf-spacing-base` is the anchor; `-low-N` steps down and `-up-N` steps up. The ramp is deliberately uneven below the base (2, 4, 8, 12) and even above it (20, 24, 28, 32): the small end is where a 4px difference is visible and the large end is where consistency matters more than resolution. `--nf-spacing-none` exists as a name for `0px` so a component can say "deliberately no space" rather than leaving a property out.

`px` over `rem` is the user's call and it is the right one for this scale: spacing and corner radii are geometry, and tying them to the root font size means a consumer who bumps `html { font-size }` for accessibility also inflates every gap, padding and corner in the library. Type stays in `rem` precisely because it _should_ follow that setting. The practical consequence is that `--nf-space-6` (`1.5rem`) and `--nf-spacing-base-up-2` (`24px`) are the same today and differ for a consumer who changed the root size — which is covered in the spec as a scenario rather than left implicit.

Mapping used throughout the implementation:

| Old                | Value     | New                             | Value  |
| ------------------ | --------- | ------------------------------- | ------ |
| `--nf-space-1`     | `0.25rem` | `--nf-spacing-base-low-3`       | `4px`  |
| `--nf-space-2`     | `0.5rem`  | `--nf-spacing-base-low-2`       | `8px`  |
| `--nf-space-3`     | `0.75rem` | `--nf-spacing-base-low-1`       | `12px` |
| `--nf-space-4`     | `1rem`    | `--nf-spacing-base`             | `16px` |
| `--nf-space-6`     | `1.5rem`  | `--nf-spacing-base-up-2`        | `24px` |
| `--nf-space-8`     | `2rem`    | `--nf-spacing-base-up-4`        | `32px` |
| `--nf-radius-sm`   | `0.25rem` | `--nf-border-radius-base-low-1` | `4px`  |
| `--nf-radius-md`   | `0.5rem`  | `--nf-border-radius-base`       | `8px`  |
| `--nf-radius-full` | `9999px`  | —                               | —      |

`--nf-spacing-base-low-4` (`2px`), `-up-1` (`20px`), `-up-3` (`28px`) and `--nf-border-radius-base-up-1` (`12px`) are new steps with no current consumer; they exist so the scale is complete and symmetric rather than only as wide as today's needs.

### 4. `borders.css` holds radii only, and the file is still called `borders.css`

The file is named for the property family, not for its current contents, so a later border-width or border-style token lands in the obvious place without another file and another layer conversation. Nothing in the library needs one today: `Button` and `Accordion` draw their focus outline with a component-scoped `--nf-*-border-width: 2px`, which stays where it is (decision 6).

### 5. Deleted font tokens resolve to literals, except the family

- `Button`'s `font-family: var(--nf-font-body)` becomes `var(--nf-font-family)`. The deleted token was a deferral _to that property_ with a system-stack fallback, so pointing at the property directly preserves the one behaviour that mattered: a consumer who overrides `--nf-font-family` re-fonts the components too. The fallback is dropped — a component rendered without `typography.css` inherits whatever the page already uses, which is the right outcome for a component and is why the fallback existed only on a `:root` token in the first place.
- `--nf-font-size-md` → `1rem`, `--nf-font-weight-medium` → `500`, `--nf-font-weight-bold` → `700`, `--nf-line-height-heading` → `1.2`, `--nf-font-size-xl` → `1.5rem` (as the value of the existing `--nf-callout-icon-size`). `Callout`'s icon-box height becomes `calc(1rem * 1.2)`.

Alternative considered: move the size/weight/line-height ladder into `typography.css` instead of deleting it. Rejected — that file owns a _fluid_ scale driven by viewport progress, and dropping a second, static ladder beside it is exactly the redundancy the previous change flagged and this one is meant to clear. Keeping unused tokens alive for symmetry is how `tokens.css` got into this state.

### 6. Spacing tokens are for spacing; geometry stays component-scoped

`--nf-button-depth: 4px`, `--nf-button-lift`, `--nf-button-border-width: 2px`, `--nf-accordion-*` equivalents and the `calc(-1 * …)` content slide keep literal values in component-scoped properties. A shadow offset that happens to equal `4px` is not "one spacing unit"; coupling them would mean a consumer retuning `--nf-spacing-base-low-3` to tighten their padding also changes how far every button travels when pressed. The one exception already in the code is `Accordion`'s `@starting-style` slide, which reads `var(--nf-space-2)`; it becomes `8px` inline rather than `var(--nf-spacing-base-low-2)`, since it is a travel distance.

This is where invariant 5 bends, and the spec delta rewrites it to say what it was always protecting: values that have a token come from the token, and values that do not are either inline or in a `--nf-<component>-*` property. Without that rewrite, "design values exclusively via `var(--nf-*)`" would be false the moment `font-weight: 500` appears — as it already is today for `2px`, `4px` and `0.15s`.

### 7. Docs changes stay inside the existing styles page

The stylesheet table, the token table, the layer diagram and the single-file import section all live in [styles.mdx](../../../docs/src/content/docs/styles.mdx), and the removals get a migration note in the same `:::note[Moved in this release]` shape the palette move already uses. No new page: a reader looking for "what tokens exist" should find one page, and the component pages only need the one stale sentence in `callout.mdx` fixed.

## Risks / Trade-offs

- **A consumer's CSS silently stops resolving.** `padding: var(--nf-space-4)` becomes an invalid declaration rather than an error, so a project that upgrades without reading the notes gets collapsed padding with nothing in the console. → Mitigation: this is a major version bump, and the migration note on the styles page maps every removed name to its replacement or states there is none. No shim: a shim that re-declares `--nf-space-4: var(--nf-spacing-base)` would keep the old names alive indefinitely, which is the thing being removed.
- **`rem` → `px` changes rendering for consumers who scaled the root font.** A project with `html { font-size: 20px }` currently gets 20px padding where the library asked for `1rem`; it will get `16px`. → Mitigation: documented explicitly, with the override (`--nf-spacing-base`) that restores a scaled value. This is the intended behaviour, not an accident.
- **Deeper import nesting could surprise a non-Astro consumer.** A tool that resolves `@import` differently now has three levels to follow. → Mitigation: `pnpm build` resolves the real exports through Vite, and `pnpm pack:check` confirms every file is packed; both run as the change's final task.
- **A standalone `tokens.css` import now pulls 400 palette tokens plus the shadows.** A consumer who wanted "just the small stuff" gets more CSS than before. → Mitigation: that is what the per-group files are for, and the styles page says so in the single-file import section.
- **Scope creep into `typography.css`.** The font deletions make it tempting to also tidy the type scale. → Mitigation: explicitly a non-goal in the proposal; `typography.css` is not touched by any task.

## Migration Plan

1. Add `spacings.css` and `borders.css`; they are inert until something imports them.
2. Rewrite `tokens.css` as the four imports and `index.css` as three layered imports. At this point the old `--nf-space-*`, `--nf-radius-*` and font tokens are gone and the components are broken (unresolved variables), so steps 2 and 3 land together.
3. Update `Button`, `Callout` and `Accordion`.
4. Update the docs and `README.md`.

Rollback is a revert of the commit: no data, no generated artefact and no manifest change is involved. For a consumer, the rollback is pinning the previous version.

## Open Questions

None.
