# Design

## Context

See proposal.md for the why and the `library-styles` delta for the observable behavior. Three constraints shape the approach:

- No library component ships a `<script>`. ReadingProgress set the precedent: use native CSS behind `@supports`, with no polyfill.
- Every other colored component falls back to grey when `color` is unset (component-build step 4b).

## Goals / Non-Goals

**Goals:**

- The component stays fully self-contained: no selector outside its markup and no generated CSS.
- One visual contract for "active" that works whether a browser or a page script decides which link that is.

**Non-Goals:**

- Choosing which section counts as current (threshold, offset under a sticky header). The browser decides natively, and in the fallback the page script decides.

## Decisions

### Scroll-spy: the component owns the look, the page owns the timing

The component styles two things as active: `[aria-current="location"]` and `:target-current`. It turns on native scroll-spy with `scroll-target-group: auto` on its root list, inside `@supports (scroll-target-group: auto)`. With that set, the browser treats each in-page anchor in the list as a scroll marker and matches `:target-current` on the one whose target is in view.

- **Why `aria-current="location"`:** it is the ARIA value for "current location within a set of in-page links". The same attribute that tells assistive technology which link is current also drives the style, so a page script never touches a class name, and the hook adds no API.
- **Why not a script in the component:** it would be the library's first client JS, every consumer would pay for it whether or not they want scroll-spy, and the threshold choices (sticky header offset, which section wins when two are visible) depend on the page layout the component cannot see.- **Why not a hook alone:** native scroll-spy costs a few lines of CSS and gives most readers the behavior with zero setup.
- **Selectors:** the base styles match `[aria-current="location"]` on `.nf-table-of-content-link` and `.nf-table-of-content-sublink`. A second rule matching `:target-current` lives only inside the `@supports` block, next to `scroll-target-group`. Keeping the two rules apart means an engine that doesn't know `:target-current` can never drop the `aria-current` rule along with it.
- **Risk of a double highlight:** if a page runs a fallback script in a browser that also supports native scroll-spy, two links can be active at once. The documented script guards itself with `if (!CSS.supports("scroll-target-group: auto"))`.

### Purple default bends component-build step 4b

The default stays in a `var()` fallback, never declared on the root, which keeps ancestor theming working exactly as step 4b requires. Only the hue differs: `light-dark(var(--nf-purple-l-40), var(--nf-purple-d-50))`. A `[data-ui-color='purple']` rule exists as it does for every hue, so explicit purple equals the default. The skill's step 4b gets one line naming this exception. No invariant in `openspec/specs` requires grey globally; each component's color-resolution requirement says what its fallback is.

### Spacing: 12px before a main link, 4px before every sub-link

The decision was made with the user. Gaps are margins on `:not(:last-child)`, with no flex or grid:

```
.nf-table-of-content-title                     margin-block: 0 var(--nf-spacing-base)
.nf-table-of-content-list, -sublist            margin: 0; padding: 0; list-style: none
.nf-table-of-content-item:not(:last-child)     margin-block-end: var(--nf-spacing-base-low-1)
.nf-table-of-content-sublist                   margin-block-start: var(--nf-spacing-base-low-3);
                                               padding-inline-start: var(--nf-spacing-base-low-2)
.nf-table-of-content-subitem:not(:last-child)  margin-block-end: var(--nf-spacing-base-low-3)
```

Margins on a `:not(:last-child)` item never leave trailing space, and they don't collapse with the sublist's own margin, because the sublist is inside the item. Links stay `display: inline` by default. If line wrapping makes the focus outline look wrong, `display: inline-block` is the fix, decided in the browser.

### Type and color

- Type sizes have no token, so they are written inline: main links `1rem`, sub-links and title `0.875rem`. Because two parts share it, `0.875rem` is held in `--nf-table-of-content-small-font-size`. Font family comes from `--nf-font-family`. The title gets `text-transform: uppercase` a `font-weight` of 600 and `letter-spacing: 1px`.
- Inactive links and the title use `color: inherit`. This adds no literal color, follows the page's text color, and matches the white-on-dark of the reference design in dark mode.
- Links: `text-decoration: none`, with no underline, even on hover. `:hover` shares the active rule, so a hovered link previews the active color. `:focus-visible` gets `outline: 2px solid currentColor` with an `outline-offset`.
- `color` transitions with `ease-in-out` over `--nf-table-of-content-transition-duration` (0.25s), which is zeroed under `prefers-reduced-motion: reduce`. The same transition also softens the scroll-spy highlight moving between links. If the highlight feels slow while scrolling, lower the duration.

### Headings API: Astro's `MarkdownHeading[]`

`import type { MarkdownHeading } from "astro"` is a type import from the peer dependency, so it adds no new dependency. Nesting happens in the frontmatter in one pass: a depth-2 heading starts a new item, a depth-3 heading is appended to the last item's children (or becomes an item if there is none yet), and anything else is skipped. Slugs reach only `href` attributes, which Astro escapes, so unlike ReadingProgress's `target` there is no injection boundary to validate.

Markup is `nav > p.title + ol.list > li.item > (a.link + ol.sublist > li.subitem > a.sublink)`. The title is a `<p>`, not a heading, so the TOC never appears in the page's own heading outline or in a Starlight TOC.

## Risks / Trade-offs

- [`scroll-target-group` is Chromium-only at the time of writing] → The `aria-current` hook plus the documented script cover the other browsers. The docs page says so.
- [`nav` has both a visible title and the same `aria-label`] → Some screen readers announce the text twice. This was accepted because `aria-labelledby` would need a generated unique `id`. Revisit if it becomes a problem.
- [Slugs that don't match any heading `id`] → The link is dead and never becomes active natively. This was accepted, and the proposal names it as a non-goal.
- [The purple fallback surprises someone used to grey defaults] → The exception is documented in the component-build skill and on the docs page.
