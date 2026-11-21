# Spec Delta

## ADDED Requirements

### Requirement: TableOfContent content API

The library SHALL publish a `TableOfContent` component at `astro-nosferatu/components/TableOfContent.astro`. It SHALL accept a required `headings` prop typed as Astro's `MarkdownHeading[]` (`{ depth, slug, text }`) and SHALL render a `nav` carrying the class `nf-table-of-content`, which contains a title element (`nf-table-of-content-title`) followed by an ordered list (`nf-table-of-content-list`) of anchor links. Each link's `href` SHALL be `#` followed by the heading's `slug`, and its text SHALL be the heading's `text`.

Headings of depth 2 SHALL render as main links: each is an item `nf-table-of-content-item` holding a link `nf-table-of-content-link`. Headings of depth 3 SHALL render as sub-links of the closest preceding depth-2 heading: they go in an ordered list `nf-table-of-content-sublist` inside that main item, where each is an item `nf-table-of-content-subitem` holding a link `nf-table-of-content-sublink`. A depth-3 heading that has no preceding depth-2 heading SHALL render as a main link. Headings of any other depth SHALL be ignored. Source order SHALL be preserved. When no heading of depth 2 or 3 is given, the component SHALL render nothing.

It SHALL accept an optional `title` prop, defaulting to `"Table of contents"`. The title element SHALL show that text, and the `nav` SHALL carry it as its `aria-label`.

It SHALL accept every native `nav` attribute and forward it to the `nav`, and SHALL merge a consumer `class` with `nf-table-of-content` rather than replacing it.

It SHALL accept an optional `color` prop typed `ColorPalette`, with the same contract as `Button`'s: when passed, it is rendered as `data-ui-color` on the `nav`; when omitted, no `data-ui-color` attribute is rendered; a consumer-supplied `data-ui-color` attribute never reaches the element.

#### Scenario: Two-level markup from headings

- **WHEN** a consumer renders `<TableOfContent headings={[{depth:2,slug:"a",text:"A"},{depth:2,slug:"b",text:"B"},{depth:3,slug:"b1",text:"B1"},{depth:3,slug:"b2",text:"B2"}]} />`
- **THEN** the output is a `nav.nf-table-of-content` with `aria-label="Table of contents"`, a title reading "Table of contents", and a list with two main links (`#a`, `#b`), where the `#b` item holds a sublist with the links `#b1` and `#b2`, in that order

#### Scenario: Other depths are ignored

- **WHEN** the `headings` passed include depth 1, 4, 5 and 6 entries alongside depth 2 and 3 entries
- **THEN** only the depth 2 and 3 entries appear as links

#### Scenario: Orphan sub-heading

- **WHEN** the first heading passed has depth 3 and is followed by a depth-2 heading
- **THEN** the depth-3 heading renders as a main link before the depth-2 one

#### Scenario: Nothing to list

- **WHEN** a consumer renders `<TableOfContent headings={[]} />`, or passes only depth 1 and 4 headings
- **THEN** nothing is rendered: no `nav`, no title

#### Scenario: Custom title

- **WHEN** a consumer renders `<TableOfContent title="On this page" headings={…} />`
- **THEN** the title element shows "On this page" and the `nav` carries `aria-label="On this page"`

#### Scenario: Native attributes, class and controlled color

- **WHEN** a consumer renders `<TableOfContent id="toc" class="my-toc" data-ui-color="teal" headings={…} />`
- **THEN** the `nav` carries `id="toc"` and both the `nf-table-of-content` and `my-toc` classes, and no `data-ui-color`

#### Scenario: Invalid color is a type error

- **WHEN** a consumer writes `<TableOfContent color="teal" headings={[]} />` in an `.astro` file and runs `astro check`
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop

### Requirement: TableOfContent active color resolution

The active link's color SHALL be resolved through one component-scoped custom property, `--nf-table-of-content-active-color`. Each `data-ui-color` value SHALL set it with `light-dark(var(--nf-<hue>-l-40), var(--nf-<hue>-d-50))`, the same step pairing as `Button`'s background. Where the property is not defined for the element (no `data-ui-color` and no value inherited from an ancestor), the active color SHALL fall back to `light-dark(var(--nf-purple-l-40), var(--nf-purple-d-50))`, so an uncolored component and `color="purple"` render identically. Unlike the library's other colored components, the default hue is purple. No semantic color token SHALL be introduced.

#### Scenario: Default active color is purple

- **WHEN** an active link in a `TableOfContent` with no `color` is inspected in a light and then a dark color scheme
- **THEN** its color equals `--nf-purple-l-40` in light and `--nf-purple-d-50` in dark, the same as with `color="purple"`

#### Scenario: Explicit color

- **WHEN** an active link in a `TableOfContent` with `color="green"` is inspected in a light and then a dark color scheme
- **THEN** its color equals `--nf-green-l-40` in light and `--nf-green-d-50` in dark

#### Scenario: Re-themed through the property

- **WHEN** a consumer sets `--nf-table-of-content-active-color: var(--nf-red-l-60)` in an unlayered rule on an ancestor of an uncolored `TableOfContent`
- **THEN** the active link uses that value

### Requirement: TableOfContent appearance and active state

The title SHALL always display in uppercase, whatever the case of the `title` prop, and SHALL be followed by `--nf-spacing-base` (16px) before the list. Lists SHALL show no markers and add no padding of their own. Between consecutive main items there SHALL be `--nf-spacing-base-low-1` (12px), measured from the end of the first item, so the same 12px separates a main link from the next one and the last sub-link of an item from the next main link. Between a main link and its first sub-link there SHALL be `--nf-spacing-base-low-3` (4px), and between consecutive sub-items `--nf-spacing-base-low-3` (4px). The last item of each list SHALL add no trailing space. The sublist SHALL be indented from the main links by `--nf-spacing-base-low-2` (8px). Main links SHALL be set in a larger type size than sub-links and the title. Inactive links and the title SHALL take the surrounding text color, and links SHALL never show an underline. A hovered link SHALL take the active color, the same value an active link resolves to. Link color changes, on hover and on becoming active, SHALL transition over 0.25s with `ease-in-out`, held in `--nf-table-of-content-transition-duration`, and SHALL change instantly when the user prefers reduced motion. Every link SHALL show a visible outline on `:focus-visible`.

A link SHALL be shown in the active color when either:

- it carries `aria-current="location"`, whoever set it; or
- in a browser that supports `scroll-target-group`, it is the link whose target section is currently in view (the browser's `:target-current`).

The component SHALL ship no JavaScript. It SHALL NOT set `aria-current` itself, and in a browser without `scroll-target-group` support no link SHALL be active unless the page sets `aria-current="location"`.

#### Scenario: Title is uppercase

- **WHEN** a consumer renders `<TableOfContent title="On this page" headings={…} />`
- **THEN** the title reads "ON THIS PAGE" on screen while the DOM text and `aria-label` stay "On this page"

#### Scenario: Spacing

- **WHEN** a rendered `TableOfContent` with main links and sub-links is inspected in devtools
- **THEN** the title has a 16px block-end margin, main items are 12px apart, the last sub-link of an item is 12px above the next main link, the first sub-link sits 4px below its main link, sub-items are 4px apart, the last item in each list has no trailing margin, and the sublist is indented 8px

#### Scenario: Hover takes the active color

- **WHEN** the pointer hovers an inactive link in a `TableOfContent` with `color="green"`, and the link is inspected in devtools
- **THEN** its color eases over 0.25s to the green active color, and no underline appears; with reduced motion preferred, the color changes with no transition

#### Scenario: Page sets the active link

- **WHEN** a page script sets `aria-current="location"` on one link of a `TableOfContent`
- **THEN** that link, and only that link, is shown in the active color, in any browser

#### Scenario: Native scroll-spy

- **WHEN** a page renders a `TableOfContent` whose slugs match heading `id`s on the page, in a browser that supports `scroll-target-group` and with no page script, and the reader scrolls through the sections
- **THEN** the link for the section currently in view is shown in the active color, and the highlight moves as the reader scrolls

#### Scenario: Unsupported browser without a page script

- **WHEN** the same page is viewed in a browser without `scroll-target-group` support, or in Chrome with the `@supports` block disabled in devtools, and no link carries `aria-current`
- **THEN** no link is shown in the active color, and every link still navigates to its section
