# Tasks

## 1. Color scheme in the reset

- [x] 1.1 Add `:root { color-scheme: light dark; }` to `packages/ui/src/styles/reset.css`, placed with the other document-level rules and using tab indentation; verify with `pnpm build` and by checking in devtools on the running docs site that `:root` resolves `color-scheme` to `light dark` unless Starlight pins it
- [x] 1.2 Confirm the layering holds: add `:root { color-scheme: only light; }` as unlayered CSS in a scratch page or devtools and verify the consumer value wins over the `nosferatu.reset` layer without `!important`, then revert the scratch change

## 2. Button component

- [x] 2.1 Rewrite the props block of `packages/ui/src/components/Button.astro`: `interface Props extends HTMLAttributes<'button'>` with `color?: 'blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'yellow'`, no `variant`, destructure `color = 'purple'`, `type = 'button'`, `class: className` and `...attrs`; verify `pnpm --filter docs check` reports no type error for the component itself
- [x] 2.2 Render `<button type={type} data-ui-color={color} class:list={['nf-button', className]} {...attrs}><slot /></button>`; verify in the running docs site that the element carries `data-ui-color="purple"` by default and the consumer `class` survives alongside `nf-button`
- [x] 2.3 Write the `.nf-button` base rule: geometry from `var(--nf-font-size-md)`, `var(--nf-space-2)` block padding, `var(--nf-space-4)` inline padding, `var(--nf-radius-md)` radius, plus component-scoped `--nf-btn-*` properties for border width, shadow depth and travel distance, with `background` from `var(--nf-btn-color)` and `color`, `border-color` and the `box-shadow` color all from `var(--nf-btn-accent-color)`; verify a rendered button is 2px-bordered with a 4px solid shadow in its accent color
- [x] 2.4 Add the eight `[data-ui-color="<hue>"]` rules setting `--nf-btn-color: light-dark(var(--nf-<hue>-l-40), var(--nf-<hue>-d-50))` and `--nf-btn-accent-color: light-dark(var(--nf-<hue>-l-80), var(--nf-<hue>-d-90))`, in alphabetical hue order; verify each hue renders distinctly in the docs demo and that computed values match the named tokens for at least `purple` and `green`
- [x] 2.5 Add the state rules — `:hover:not(:disabled)` translating 2px down with a 2px shadow, `:active:not(:disabled)` translating 4px down with no shadow — plus the `0.15s ease-in-out` transition over `translate`, `box-shadow`, `background-color`, `color` and `border-color`; verify by hovering and pressing a button in the docs site that it sinks then flattens with the bottom edge staying put, and that a `disabled` button does neither
- [x] 2.6 Keep the `:focus-visible` outline and `:disabled` treatment, and confirm no selector reaches outside the component; verify by tabbing to a button in the docs site and by rendering a plain `<button data-ui-color="green">` next to a `Button` and seeing it unstyled
- [x] 2.7 Grep the component for literal colors, `--nf-color-`, non-`--nf-` custom properties and `:global`; verify there are no matches and that every `var(--nf-…)` color it uses is defined in `colors.css`
- [x] 2.8 Add a `@media (prefers-reduced-motion: reduce)` block setting the component's transition duration to `0s`, so the three states still apply but without animation; verify in a browser with reduced motion forced that the button's computed `transition-duration` is `0s` and that hover and active still change its position and shadow, and document the behaviour on the Button page and in the `component-build` skill
- [x] 2.9 Restyle the raise: resting depth `3px`, hover and `:focus-within` at depth `2px` / lift `1px`, active at depth `0px` / lift `3px`; express the hue, state and disabled rules as CSS nesting inside `.nf-button`; remove the focus outline so focus reads as hover. Verify in a browser that the compiled selectors stay scoped to the component, that the bottom edge is identical across rest, hover, focus and active, and that a focused button has `outline-style: none`

## 2b. Remove the base stylesheet

- [x] 2b.1 Delete `packages/ui/src/styles/base.css` and drop both its `@import` and `nosferatu.base` from the `@layer` statement in `index.css`; verify `pnpm build` passes and the built CSS contains no `nosferatu.base` layer and no `::selection` or global `:focus-visible` rule from the library
- [x] 2b.2 Restore a focus ring on `Button` itself — `:focus-visible` drawing a 2px outline in `--nf-btn-accent-color`, inset by its own width so it reads as the border the component no longer has; verify in a browser that a tabbed-to button shows the inset outline, that its size and position are unchanged, and that a clicked button sinks without drawing it
- [x] 2b.3 Follow the removal through the stylesheet list and layer order in `docs/src/content/docs/styles.mdx`, `packages/ui/README.md` and invariant 3 of the root `AGENTS.md`; verify no file still names `base.css` or `nosferatu.base` outside the archive

## 3. Button documentation

- [x] 3.1 Rewrite `docs/src/content/docs/components/button.mdx`: frontmatter describing the `color` API, the import line, and a live demo row with one `Button` per hue labelled by its value; verify the page renders all eight buttons at `pnpm dev`
- [x] 3.2 Document the interaction states in prose next to a live demo the reader can hover and press, and state the `color-scheme`/`light-dark()` behaviour including how a consumer pins a scheme; verify the described behaviour matches what the demo does in the browser in both Starlight themes
- [x] 3.3 Replace the props table with `color` (type, default `purple`) and `type`, keep the pass-through note, and rewrite the theming section around overriding `--nf-btn-color` / `--nf-btn-accent-color` on a wrapper with the code shown; verify the theming demo visibly differs from the default button
- [x] 3.4 Keep a scoped-styles demo pairing a `Button` with a plain `<button>`; verify the plain button is untouched on the rendered page

## 4. Authoring skills

- [x] 4.1 Write `.agents/skills/component-build/SKILL.md` with `name`/`description` frontmatter covering file location and naming, tabs, prop typing and attribute forwarding, `class:list` merging, the `data-ui-*` + `--nf-btn-*`-style custom-property pattern over modifier classes, token-only design values, palette-only colors, no selectors outside the component, focus-visible and disabled treatments, the `openspec/specs` authority and OpenSpec workflow, the hand-off to `component-doc`, and the verification commands; verify the finished `Button.astro` from group 2 satisfies every instruction the skill gives
- [x] 4.2 Write `.agents/skills/component-doc/SKILL.md` with `name`/`description` frontmatter covering page location and frontmatter, package-name-only imports with relative paths forbidden, the required sections (import line, a live demo per enumerated prop value, interaction states, props table, theming, scoped-styles demo), the shared demo styling block, the autogenerated sidebar, the `openspec/specs` authority and OpenSpec workflow, the hand-off to `component-build`, and `pnpm --filter docs check` / `pnpm build`; verify the finished `button.mdx` from group 3 satisfies every instruction the skill gives
- [x] 4.3 Add the generated-vs-hand-written note to the "Agent tooling in this repo" section of the root `AGENTS.md`; verify it names `openspec-*` as generated by `openspec update` and `component-build` / `component-doc` as hand-written and never regenerated
- [x] 4.4 Dry-run both skills: follow `component-doc` end to end against the existing Button page and confirm it produces no instruction that contradicts the page or the specs; verify no step in either skill tells an agent to edit the other's directory

## 5. Verification

- [x] 5.1 Run `pnpm build` from the repository root; verify it completes with no errors and the Button page is in the output
- [x] 5.2 Run `pnpm --filter docs check`; verify zero errors, and separately confirm that a temporary `<Button color="teal">` makes it fail before reverting that edit
- [x] 5.3 Run `pnpm pack:check`; verify the file list still contains only `src/components`, `src/styles`, `package.json`, `README.md` and `LICENSE` — unchanged from before this change
- [x] 5.4 In a browser on the built docs site, toggle the Starlight theme and verify each hue switches between its `-l-40`/`-l-80` and `-d-50`/`-d-90` pairs, then hover and press buttons in both themes and confirm the raise, sink and flatten behaviour
- [x] 5.5 Grep the whole repository for `nf-button--`, `variant=` on Button and `--nf-color-`; verify there are no remaining references in `packages/ui`, `docs` or the two new skills
