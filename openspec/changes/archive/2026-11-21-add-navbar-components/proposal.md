# Proposal

## Why

Almost every site built on the library needs a top navigation bar, and today a consumer has to build one by hand, including the mobile menu. A small set of components that fit together through named slots gives them a navbar that works on desktop and mobile out of the box. It keeps the library's ships-source, no-JavaScript model: a native popover holds the mobile menu, and the burger toggles it with no script.

## What Changes

Five new components, all under `astro-nosferatu/components/`:

- `Navbar.astro`: the wrapper. It renders a full-width, `80px`-tall `header` (`--nf-navbar-block-size`) with `16px` inline padding and no block padding, around a centred container (`max-inline-size: 1036px`). It exposes four named slots: `nav-logo`, `nav-items-desktop`, `nav-social` and `nav-items-mobile`.
  - The layout switches on a container query against the navbar's own inline size (`container: nf-navbar / inline-size`), never the viewport's.
  - At `856px` of navbar width and above, the logo, the desktop list and the social links sit in a row: `64px` between the logo and the list, with the social links pushed to the inline end.
  - Below `856px`, the desktop list is hidden. The logo and the social links are spaced apart (`space-between`, at least `24px` apart), and a burger button sits at the inline end.
  - The burger toggles a native popover menu holding the `nav-items-mobile` slot (`popovertarget`, no JavaScript). While the menu is open, the burger shows a close (×) icon and closes it; Esc and a click outside close it too. The panel opens `4px` below the bar, at the navbar's height plus `4px` from the top, `8px` from the other sides, with `8px` corners, and slides in from right to left (`@starting-style`).
  - The burger and the menu are rendered only when the `nav-items-mobile` slot is filled.
  - The navbar is `position: sticky` at the top of the viewport. It keeps its own space in the page flow, so on load it pushes the content down rather than sitting on top of it, and it stays pinned while the page scrolls.
  - The bar and the menu panel have a solid grey surface, `light-dark(grey-l-10, grey-d-100)`, with grey text and borders. These are themable through `--nf-navbar-*` properties, but no prop changes them.
  - `color?: ColorPalette` sets only the text color of the current item, `light-dark(<hue>-l-70, <hue>-d-30)`. It defaults to **purple**, because a grey current item would not stand out.
  - The slotted lists pick these colors up through inherited `--nf-navbar-*` custom properties. Outside a `Navbar`, they fall back to the same defaults.
- `NavLogo.astro`: the logo as a link. It takes either `text` or `src` + `alt`, plus `href` (default `/`).
- `NavItemsDesktop.astro` and `NavItemsMobile.astro`: each takes `items: NavItem[]`, where a `NavItem` is `{ text, href, icon?, current? }`. The icon renders on the inline-start side, and a `current` item gets `aria-current="page"` and the active color. The two are separate components so the desktop and mobile lists can have different items, order and icons. They share the `NavItem` type, which is added to `src/types/components.ts`.
  - Every icon in the set (item icons, social icons, burger and ×) is `22px` with a stroke width of `2`. The components pass `width`/`height` of `1em` and `stroke-width="2"` to the icon, which an imported `.svg` such as iconoir's honours.
  - Desktop links: no gap between them, `14px`/`16px` block/inline padding, `1rem` text.
  - Mobile links: full width, `16px` padding, `1rem` text, and a `1px` bottom border in `light-dark(var(--nf-grey-l-30), var(--nf-grey-d-120))` by default; for any other `color`, `light-dark(<hue>-l-30, <hue>-d-90)`, because only grey has steps above `100`.
- `NavSocial.astro`: takes `items: { icon, href, label }[]` and renders icon-only links. Each icon is `22px` with `6px` of padding. `label` is **required** and becomes the link's `aria-label`, so no icon link is left without an accessible name.
- Docs: one `navbar.mdx` page documents the whole set.

Consumer-visible: yes, purely additive. It adds new component files and one new exported type (`NavItem`), and changes no existing component, token, stylesheet or export. No major bump is needed.

## Non-goals

- A modal menu. A modal would make the bar inert, so the burger could not close it without JavaScript.
- Closing the menu automatically when a same-page anchor link (`#section`) is followed. That needs JavaScript. Links to other pages navigate away, which closes it anyway.
- Detecting the current page automatically from the URL. The consumer marks it with `current: true`.
- Dropdown or nested menus.
- A `position: fixed` variant. A sticky navbar stops sticking once its parent element scrolls away, so it must sit directly in the page flow (for example, as a child of `body`). The docs page says so.
- A configurable breakpoint. `856px` is fixed, because a container query cannot read a custom property.
- New library tokens. `14px`, `6px` and `64px` are composed from existing spacing tokens with `calc()`. The container width is a component-scoped property.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `library-styles`: new requirements for the content API, appearance and responsive behaviour of `Navbar`, `NavLogo`, `NavItemsDesktop`, `NavItemsMobile` and `NavSocial`, and for the mobile menu. `Shared prop types` gains `NavItem`.
- `documentation-site`: one Navbar page documents the five components together, and warns that the navbar is sticky. "Color-variant pages document the unset default" gains the Navbar exception: its `color` defaults to purple.

## Impact

- `packages/ui/src/components/{Navbar,NavLogo,NavItemsDesktop,NavItemsMobile,NavSocial}.astro` (new).
- `packages/ui/src/types/components.ts`: adds `NavItem`.
- `docs/src/content/docs/components/navbar.mdx` (new).
- No `package.json` change: `./components/*` is already a wildcard export, `src/types` already ships, and the burger and close icons come from `iconoir` (`menu.svg`, `xmark.svg`), which is already the runtime dependency.
