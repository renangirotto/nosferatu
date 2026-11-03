# Proposal

## Why

The docs site's dark theme already wears the nosferatu palette, but its light theme is still Starlight's stock blue-grey. Now that every component page has a light/dark switch, readers land in the light theme often, and it looks unrelated to the library. Theming light mode from the library's light palette, mirroring the dark-theme mappings, closes that gap. One dark-theme gap is fixed alongside: the line between a page's title and its content is still Starlight's grey.

## What Changes

- Re-theme Starlight's **light** theme from the nosferatu light palette, mirroring the existing dark-theme mappings:
  - page content, table of contents, left sidebar and top bar background → `--nf-grey-l-10`
  - lines separating the table of contents, the left sidebar and the top bar from the content, and the line between a page's title and its content → `--nf-grey-l-10` (same as the background, so they disappear)
  - plain body text and headings (page title included) → `--nf-grey-l-100`
  - links, table-of-contents links on hover and for the current section, and the background of the sidebar link for the current page → `--nf-purple-l-50`; that link's label → `--nf-grey-l-10`
  - search button, mobile table-of-contents toggle and its open list background → `--nf-grey-l-20`
  - search button and mobile table-of-contents toggle border → `--nf-grey-l-10-25`
  - adapted from dark (not specified by the request): inline code text `--nf-green-l-50`, weight 600, on `--nf-grey-l-20`; code block frame 8px radius with a `--nf-grey-l-40-25` border, keeping Starlight's light syntax theme
- **Dark theme:** the line between a page's title and its content takes the background color, `--nf-grey-d-100`.
- Drop the dark-theme requirement's "light theme unaffected" clause and scenario, which this change supersedes.

**Consumer-visible:** no. Only `docs/src/styles/theme.css` changes; `packages/ui`, its CSS, tokens, markup and exports are untouched.

## Non-goals

- No new library tokens, no `--nf-color-*` aliases, no change under `packages/ui`.
- No change to the light code-block syntax theme (Starlight's `starlight-light` stays).
- Asides, badges, buttons and other Starlight content components are not re-themed beyond what the mapped properties imply.
- Other dark-theme colors stay as they are.
- No contrast tuning: the requested colors are used as given (see Risks in design.md).

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `documentation-site`: the dark-theme palette requirement gains the title/content line color and loses its "light theme untouched" clause; a new requirement themes the light mode from the light palette.

## Impact

- `docs/src/styles/theme.css` — new `:root[data-theme="light"]` rules and one dark-theme rule.
- Side effect: Starlight derives in-content link color from the same accent property, so links inside pages turn `--nf-purple-l-50` in light mode (requested).
- `packages/ui` and the tarball are unchanged.
