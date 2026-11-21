# Proposal

## Why

Long articles and docs pages need a list of in-page links to their sections, and today a consumer has to build one by hand from the page's headings. Astro already hands every Markdown/MDX page its headings (`render()` → `headings`), so the library can turn that list into a styled, two-level table of contents with no extra work for the consumer. CSS now also has native scroll-spy (`scroll-target-group` + `:target-current`), which lets the component highlight the current section without shipping JavaScript.

## What Changes

- New component `astro-nosferatu/components/TableOfContent.astro`. It renders a `<nav>` holding a title and an ordered list of anchor links (`href="#<slug>"`) to sections of the current page, two levels deep.
- `headings: MarkdownHeading[]` prop (required), using Astro's own `{ depth, slug, text }` type. Depth-2 headings become main links and depth-3 headings become sub-links nested under the preceding main link. Every other depth is ignored. A depth-3 heading that comes before any depth-2 heading is rendered as a main link. If nothing is left after filtering, the component renders nothing.
- `title?: string` prop, default `"Table of contents"`. It is always displayed uppercase (CSS `text-transform`) and also serves as the `<nav>`'s accessible name.
- `color?: ColorPalette` prop for the active link's color, rendered as `data-ui-color` and themable through `--nf-table-of-content-active-color`. **When unset, the active link is purple, not grey.** This departs from the grey default every other colored component uses.
- Active link, with two sources and no JavaScript in the library:
  - **Page hook:** any link carrying `aria-current="location"` is shown in the active color. The page decides when a link is active, for example with its own IntersectionObserver.
  - **Native scroll-spy:** where the browser supports `scroll-target-group`, the component enables it on its own list, and the link whose section is currently in view is shown in the active color automatically.
- Spacing comes only from the spacing scale: 16px below the title, 12px before every main link (whether it follows a main link or a sub-link), 4px between a main link and its first sub-link and 4px between sub-links. Gaps are margins on `:not(:last-child)` items, with no flex or grid.
- Docs page `table-of-content.mdx` with a live demo and the page-level scroll-spy script.

Consumer-visible: yes, but purely additive. It adds a new component file and changes no existing component, token, stylesheet or export. No major bump is needed.

## Non-goals

- Shipping client JavaScript in the library. Scroll-spy in browsers without `scroll-target-group` is the page's job, through the `aria-current` hook.
- More than two levels, or configurable depths (for example h3/h4). This can be added when a consumer needs it.
- Collapsing or expanding sections, sticky positioning, or any layout around the list. The consumer places the `<nav>`.
- Smooth scrolling on click. That belongs to the page (`scroll-behavior` on `html`).
- Generating heading `id`s. The component links to the slugs it is given and does not check that they exist.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `library-styles`: new `TableOfContent` content API, active color resolution, and appearance/active-state requirements.
- `documentation-site`: the TableOfContent page documents the two active-link sources, the `aria-current` contract and a page-level fallback script.

## Impact

- `packages/ui/src/components/TableOfContent.astro` (new).
- `docs/src/content/docs/components/table-of-content.mdx` (new).
- `.agents/skills/component-build/SKILL.md`: step 4b names TableOfContent's purple fallback as the one non-grey default.
- No `package.json` change: `./components/*` is already a wildcard export, and `files` already ships `src/components`.
