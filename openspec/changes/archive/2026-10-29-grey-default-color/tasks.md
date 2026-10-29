# Tasks

## 1. Button

- [x] 1.1 In `packages/ui/src/components/Button.astro`, drop the `"purple"` default from `color` (keep `"data-ui-color": _controlled` destructured away); verify in `pnpm dev` that `<Button>` renders no `data-ui-color` and `<Button data-ui-color="teal">` also renders none.
- [x] 1.2 Add the grey fallback to every use of `--nf-button-color` / `--nf-button-accent-color` (background, color, box-shadow, focus outline), matching the `[data-ui-color="grey"]` steps exactly; verify an uncolored and a `color="grey"` button compute the same background, color and shadow in light and dark.
- [x] 1.3 Update `docs/src/content/docs/components/button.mdx`: color prose and props-table default to "grey (unset) — no `data-ui-color`", add an uncolored "default" demo beside the hues, and correct the theming prose (ancestor works for an uncolored button; a colored one needs `style` on the element) with a live demo of each; verify on the page in both themes.

## 2. Callout

- [x] 2.1 In `packages/ui/src/components/Callout.astro`, drop the `"purple"` default; verify `<Callout title="x" />` renders no `data-ui-color`.
- [x] 2.2 Add grey fallbacks at every use of `--nf-callout-surface-color`, `--nf-callout-accent-color`, `--nf-callout-rule-color`, and inside the `--nf-callout-shadow` composition for `--nf-callout-shadow-color`, matching the grey rule's 25%-tier steps; verify an uncolored and a `color="grey"` callout with a body match in surface, text, rule and shadow in both themes.
- [x] 2.3 Update `docs/src/content/docs/components/callout.mdx` the same way as 1.3 (default prose, props table, uncolored demo, corrected ancestor/element theming prose and demo); verify on the page in both themes.

## 3. Accordion

- [x] 3.1 In `packages/ui/src/components/Accordion.astro`, drop the `"purple"` default; verify `<Accordion summary="x">` renders no `data-ui-color`.
- [x] 3.2 Add grey fallbacks at every use of `--nf-accordion-color` / `--nf-accordion-accent-color` in the summary (fill, text, shadow, focus outline) and content (fill, text); verify an uncolored and a `color="grey"` accordion match open and closed, in both themes.
- [x] 3.3 Update `docs/src/content/docs/components/accordion.mdx`: default prose and props table, uncolored demo, and narrow the "set them on the element" note to accordions that have a `color`, adding an ancestor demo on an uncolored one; also note that an uncolored accordion nested in a colored one inherits its hue; verify on the page.

## 4. Skills

- [x] 4.1 Update `.agents/skills/component-build/SKILL.md`: remove `color = 'purple'` from both frontmatter examples, show the attribute rendered only when `color` is passed, add the fallback to the section 4 CSS example, state the default-color fallback as the sole exception in the "do not rely on a `var()` fallback" rule (it must equal the component's own grey rule), and correct the ancestor-theming bullet; verify the skill no longer contains `'purple'` as a default (`grep -n "= 'purple'" .agents/skills/component-build/SKILL.md` prints nothing).
- [x] 4.2 Update `.agents/skills/component-doc/SKILL.md`: require the color section and props table to state the grey/no-attribute default and include an uncolored demo, document ancestor vs element theming, and fix the stale `--nf-btn-*` names in its theming section to `--nf-button-*`; verify by reading the section against the `component-authoring-skills` delta.

## 5. Verification

- [x] 5.1 Run `pnpm --filter docs check` — passes with no new errors.
- [x] 5.2 Run `pnpm build` — passes; the built Button, Callout and Accordion pages show an uncolored default demo in grey, and `grep -c 'data-ui-color="purple"'` over those built pages counts only the explicit purple demos.
- [x] 5.3 `pnpm pack:check` is not required (no package.json or published-file-set change); run `openspec validate grey-default-color --strict` — passes.
