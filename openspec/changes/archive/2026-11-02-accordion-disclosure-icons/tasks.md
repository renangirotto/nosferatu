# Tasks

## 1. Internal Iconoir dependency

- [x] 1.1 Add `"dependencies": { "iconoir": "^7.12.1" }` to `packages/ui/package.json` and run `pnpm install`. Verify `packages/ui/node_modules/iconoir/icons/regular/plus.svg` exists.
- [x] 1.2 Remove the earlier public-`Icon` work: delete `Icon.astro`, `src/types/icons.ts`, `scripts/generate-icons.mjs`, the root `icons:generate` script and the Icon docs page, and restore `callout.mdx`. Verify `grep -rn "Icon.astro\|IconName\|icons:generate"` over `packages/ui/src`, `docs/src`, `AGENTS.md` and `package.json` finds nothing.

## 2. Accordion icons (library + docs)

- [x] 2.1 Move `IconComponent` from `Callout.astro` to `packages/ui/src/types/components.ts` (exported, with a doc comment) and import it relatively in `Callout.astro`. Verify `pnpm --filter docs check` passes and the Callout page renders unchanged.
- [x] 2.2 In `Accordion.astro`, import `iconoir/icons/regular/plus.svg` and `minus.svg` by literal path. Type `iconCollapsed` and `iconExpanded` as `IconComponent`, render the consumer's component when one is passed and the Iconoir default at `1em` otherwise, inside `nf-accordion-label` plus the `nf-accordion-icon` box holding `nf-accordion-icon-collapsed` and `nf-accordion-icon-expanded` (design Decisions 1–4). Verify:
  - in the built HTML, neither prop appears as an attribute on `<details>`
  - from a scratch `.astro` page, `astro check` accepts a component and rejects `iconCollapsed="nav-arrow-down"`
- [x] 2.3 Style it: hide the native marker (`list-style: none` plus `::-webkit-details-marker`), lay the summary out as a flex row with an 8px `--nf-spacing-base-low-2` gap, add `--nf-accordion-icon-size: 1.5rem` to the declarations at the top of `.nf-accordion`, size the icon box to one line of text, and toggle the two icons on `[open]`. Verified in Chrome, Firefox and WebKit: no triangle, plus closed and minus open, 24px, a wrapped summary keeps the icon on its first line.
- [x] 2.4 Apply design Decision 5 in `Accordion.astro`: shadow and radius on `.nf-accordion`, only `--nf-accordion-lift` changing (0, then 1px on hover, then 4px on press, and 0 while `[open]`), an always-present 2px `border-block-end` that is the fill color when closed and `--nf-accordion-rule-color` when open, square bottom corners when open, and `--nf-accordion-rule-color` (`l-60-25`/`d-70-25`) in every `data-ui-color` rule. Verified in Chrome, Firefox and WebKit, light and dark, for the default, orange and green:
  - the shadow is on `<details>` in both states
  - closed: 1px on hover, 4px on press
  - open: no movement
  - open: square corners and the hue rule
  - 46px summary height in both states
  - the close-animation corner rounding is screenshotted and left to the user (design Risks)
- [x] 2.5 Update `docs/src/content/docs/components/accordion.mdx` following `component-doc` and the modified "Accordion page" requirement:
  - an icon section with the default demo, the note that the defaults need nothing installed, and a by-component demo with code
  - `iconCollapsed`, `iconExpanded`, `--nf-accordion-icon-size` and `--nf-accordion-rule-color` in the tables
  - the interaction-state prose rewritten for the summary-only sink, the open rule and the panel-wide shadow
  - the marker-hidden and decorative notes

  Verify the page builds and its demos render with icons.

- [x] 2.6 Defer the summary's corner and rule switch to the end of the close animation, inside the animation's `@supports` block (design Decision 5). Verified in Chrome: corners square at 40 and 150ms into a close and rounded after it, square 20ms after opening, instant under reduced motion. Firefox and WebKit, which skip the animation, switch at once.

## 3. Project guidance

- [x] 3.1 Update AGENTS.md invariant 7 and the matching wording in `openspec/config.yaml` `context` to "one runtime dependency, `iconoir`, internal", and describe the literal-path rule in `packages/ui/AGENTS.md`. Verify with `grep -rn "no runtime dependenc" AGENTS.md packages/ui/AGENTS.md openspec/config.yaml` that no stale claim is left.

## 4. Verification

- [x] 4.1 Run `pnpm --filter astro-nosferatu pack` into the session scratchpad and install the tarball into fresh Astro 7 projects with npm and with pnpm, neither listing `iconoir`. Verify a page with a default `Accordion` builds in each and its HTML holds the plus and minus SVGs. Delete the scratch projects.
- [x] 4.2 Run `pnpm build`, `pnpm --filter docs check`, `pnpm lint`, `pnpm format:check` and `pnpm pack:check`. All must pass, and the pack list must hold only `src/components`, `src/layouts`, `src/html`, `src/types`, `src/styles`, `package.json`, `README.md` and `LICENSE`, with no Iconoir file packed.
- [x] 4.3 Run `openspec validate add-icon-component --strict` and verify it reports the change as valid.
- [x] 4.4 VoiceOver pass on the Accordion page: the summary announces its text and expanded/collapsed state, and nothing for the icons. Needs a person.
