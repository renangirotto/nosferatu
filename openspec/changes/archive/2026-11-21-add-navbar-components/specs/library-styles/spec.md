# Spec Delta

## ADDED Requirements

### Requirement: Navbar content API

The library SHALL publish a `Navbar` component at `astro-nosferatu/components/Navbar.astro` that renders a `header` carrying the class `nf-navbar`. It SHALL accept every native `header` attribute and forward it to that element, and SHALL merge a consumer `class` with `nf-navbar` rather than replacing it.

`Navbar` SHALL expose four named slots and no default slot: `nav-logo`, `nav-items-desktop`, `nav-social` and `nav-items-mobile`. It SHALL render the content of each slot inside its own markup, in the order logo, desktop items, social, and SHALL render `nav-items-desktop` inside a `nav` element whose accessible name is the `label` prop (default `"Main"`).

`Navbar` SHALL accept an optional `color` prop typed `ColorPalette`, which colors only the current item (see "Navbar color resolution"). When passed, it SHALL be rendered as `data-ui-color`; when omitted, no `data-ui-color` attribute SHALL be rendered; a consumer-supplied `data-ui-color` attribute SHALL never reach the element.

When the `nav-items-mobile` slot is filled, `Navbar` SHALL also render a burger `button` and a menu: a `nav` element, labelled by the `label` prop, that holds that slot's content as a native popover. The burger SHALL toggle the menu through `popovertarget`, without JavaScript: activating it opens the menu, and activating it again closes it. The burger's accessible name SHALL be the `menuLabel` prop (default `"Menu"`), and it SHALL expose whether the menu is expanded. While the menu is open, the burger SHALL show a close (×) icon in place of the burger icon. Both icons SHALL be `22px` square, with a stroke width of `2`. The menu SHALL also close on Esc and on a click outside it. It SHALL NOT be modal: the page behind it stays interactive. Each `Navbar` on a page SHALL give its menu a distinct `id`. When the `nav-items-mobile` slot is empty, neither the burger nor the menu SHALL be rendered.

#### Scenario: Slots render in order

- **WHEN** a consumer renders a `Navbar` containing a `NavLogo` with `slot="nav-logo"`, a `NavItemsDesktop` with `slot="nav-items-desktop"` and a `NavSocial` with `slot="nav-social"`
- **THEN** the output is one `header.nf-navbar` that contains, in document order, the logo, a `nav` labelled `Main` holding the desktop items, and the social links

#### Scenario: No mobile slot, no burger

- **WHEN** a consumer renders a `Navbar` without any `nav-items-mobile` content
- **THEN** the output contains no burger button and no menu

#### Scenario: Burger toggles the menu without JavaScript

- **WHEN** a page with JavaScript disabled renders a `Navbar` with a `NavItemsMobile` in `slot="nav-items-mobile"`, and the reader activates the burger, then activates it again
- **THEN** the first activation opens the menu holding the mobile items, the burger shows a × icon and is exposed as expanded; the second closes the menu, and the burger shows the burger icon again, exposed as collapsed

#### Scenario: Menu closes on Esc and outside clicks

- **WHEN** the menu is open and the reader presses Esc, or clicks outside the menu (on the bar, for example)
- **THEN** the menu closes in each case, and after Esc focus is on the burger

#### Scenario: Labels are configurable

- **WHEN** a consumer renders `<Navbar label="Principal" menuLabel="Abrir menu">` with mobile items
- **THEN** the desktop `nav` and the mobile menu are named `Principal`, and the burger is named `Abrir menu`

#### Scenario: Two navbars on one page

- **WHEN** a page renders two `Navbar`s, each with mobile items, and the reader activates the second burger
- **THEN** the second navbar's menu opens, and the first one stays closed

#### Scenario: Color is exposed as an attribute

- **WHEN** a consumer renders `<Navbar color="blue">`, and separately `<Navbar data-ui-color="teal">`
- **THEN** the first `header` carries `data-ui-color="blue"` exactly once, and the second carries no `data-ui-color`

#### Scenario: Invalid color is a type error

- **WHEN** a consumer writes `<Navbar color="teal">` in an `.astro` file and runs `astro check`
- **THEN** the check fails

#### Scenario: Native attributes and class pass through

- **WHEN** a consumer renders `<Navbar id="top" class="site-nav">`
- **THEN** the `header` carries `id="top"` and both the `nf-navbar` and `site-nav` classes

### Requirement: Navbar layout

`Navbar`'s `header` SHALL be `80px` tall, overridable through `--nf-navbar-block-size`, with `16px` inline padding and no block padding. It SHALL lay its content out in a centred container of `max-inline-size` `1036px`, overridable through `--nf-navbar-max-inline-size`. The container's items SHALL be vertically centred. The layout SHALL respond to the navbar's own inline size, through a container query on the navbar, and never to the viewport's or to any other container's:

- At `856px` and wider, the desktop items SHALL be shown, `64px` after the logo, and the social links SHALL sit at the container's inline end. The burger SHALL NOT be shown.
- Below `856px`, the desktop items SHALL NOT be shown (and SHALL NOT be reachable by keyboard or assistive technology). The logo SHALL sit at the inline start, and the social links and the burger at the inline end, with at least `24px` between any two of them.

The `header` SHALL be sticky at the top of the viewport (`inset-block-start: 0`). It SHALL keep its own space in the page flow, so content that follows starts below it, and SHALL stay pinned to the top while its containing block scrolls. It SHALL stack above the page content, at a z-index overridable through `--nf-navbar-z-index` (default `100`).

The `header` SHALL have a solid background in the navbar's surface color, and its text SHALL be the navbar's text color (see "Navbar color resolution").

#### Scenario: Desktop arrangement

- **WHEN** a `Navbar` with a logo, three desktop items and three social links is rendered in a container `1200px` wide
- **THEN** the bar is `80px` tall, the content is centred at `1036px` wide with `16px` inline padding and vertically centred, the first desktop item starts `64px` after the logo, the social links end flush with the content's inline end, and no burger is visible

#### Scenario: Mobile arrangement

- **WHEN** the same `Navbar`, also given mobile items, is rendered `400px` wide
- **THEN** the desktop items are not displayed and tabbing skips them, the logo sits at the start, the social links and the burger sit at the end, and the gap between the logo and the social links is at least `24px`

#### Scenario: The breakpoint follows the navbar, not the viewport

- **WHEN** a `Navbar` is placed inside an element `600px` wide on a `1440px` viewport
- **THEN** it renders the mobile arrangement

#### Scenario: The breakpoint ignores an outer container

- **WHEN** a `Navbar` `600px` wide is placed inside a consumer element that is itself an inline-size container `1200px` wide
- **THEN** it still renders the mobile arrangement, because the query measures the navbar, not the outer container

#### Scenario: Takes its space, then sticks

- **WHEN** a page renders a `Navbar` as a direct child of `body`, followed by a long article, and the reader loads it and then scrolls down
- **THEN** on load the article's first line sits immediately below the navbar, not under it, and after scrolling the navbar stays at the top of the viewport, drawn over the article

#### Scenario: Solid surface

- **WHEN** the reader scrolls a colorful image under the navbar and inspects the `header`
- **THEN** the image is hidden behind the bar, and the computed `background-color` is the navbar's surface color

#### Scenario: Height is overridable

- **WHEN** a consumer sets `--nf-navbar-block-size: 64px` on a `Navbar` through a class
- **THEN** the bar is `64px` tall and the mobile menu opens `68px` from the top

#### Scenario: Container width is overridable

- **WHEN** a consumer sets `--nf-navbar-max-inline-size: 1200px` on a `Navbar` in an unlayered rule
- **THEN** its content container is `1200px` wide at most

### Requirement: Navbar mobile menu appearance

The mobile menu panel SHALL be offset from the top of the viewport by the navbar's height (`80px` by default, `--nf-navbar-block-size`) plus `4px`, so the bar and its burger stay visible above it with a `4px` gap, and by `8px` from its inline start, inline end and bottom edges. It SHALL have `8px` corner radius. Its surface and text SHALL be the navbar's surface and text colors (see "Navbar color resolution"). While it is open, the page below the bar SHALL be dimmed, and the bar SHALL NOT be. When it opens, the panel SHALL slide in from the inline end towards the inline start, and SHALL slide back out when it closes. Under `prefers-reduced-motion: reduce`, it SHALL open and close with no movement.

#### Scenario: Panel geometry

- **WHEN** the mobile menu is open on a `390px`-wide viewport with the navbar at the top
- **THEN** the panel is `374px` wide, its top edge is `84px` from the top of the viewport, `4px` below the bar, it ends `8px` above the bottom, and its corners are rounded at `8px`

#### Scenario: Slides in from the right

- **WHEN** the reader opens the menu in a left-to-right page with no reduced-motion preference
- **THEN** the panel moves in from beyond the right edge to its resting position, and moves back out to the right when closed

#### Scenario: Reduced motion

- **WHEN** the reader has `prefers-reduced-motion: reduce` and opens the menu
- **THEN** the panel appears in place with no slide

### Requirement: Navbar color resolution

`Navbar`'s colors SHALL be resolved through four component-scoped custom properties, read by the bar, the menu and the slotted lists, which inherit them from the `header`:

- `--nf-navbar-surface-color`, the background of the bar and of the menu panel, falling back to `light-dark(var(--nf-grey-l-10), var(--nf-grey-d-100))`.
- `--nf-navbar-text-color`, the text of the bar and of the menu panel, falling back to `light-dark(var(--nf-grey-l-100), var(--nf-grey-d-10))`.
- `--nf-navbar-border-color`, the line under each mobile item, falling back to `light-dark(var(--nf-grey-l-30), var(--nf-grey-d-120))`.
- `--nf-navbar-active-color`, the current item's text and icon, falling back to `light-dark(var(--nf-purple-l-70), var(--nf-purple-d-30))`. Each `data-ui-color` SHALL set it to `light-dark(var(--nf-<hue>-l-70), var(--nf-<hue>-d-30))`.

The `color` prop SHALL set only the active color: the surface, text and border SHALL stay on their grey values whatever `color` is, and change only when a consumer sets their properties. A `Navbar` with no `color` SHALL render identically to `color="purple"`, because a grey current item would not stand out. These fallbacks SHALL also apply where `NavItemsDesktop` and `NavItemsMobile` read these properties outside a `Navbar`. No semantic color token SHALL be introduced.

#### Scenario: Default colors

- **WHEN** an uncolored `Navbar` with a current item is inspected in light and then dark schemes
- **THEN** the bar's and the open menu panel's surface is `--nf-grey-l-10` / `--nf-grey-d-100`, the text `--nf-grey-l-100` / `--nf-grey-d-10`, the mobile borders `--nf-grey-l-30` / `--nf-grey-d-120`, and the current item's text `--nf-purple-l-70` / `--nf-purple-d-30`

#### Scenario: Color changes only the current item

- **WHEN** a `Navbar` with `color="blue"` is inspected in light and then dark schemes
- **THEN** the current item's text is `--nf-blue-l-70` / `--nf-blue-d-30`, in both the bar and the open menu, and the surface, text and borders are the same grey values as an uncolored `Navbar`

#### Scenario: Re-themed through the properties

- **WHEN** a consumer sets `--nf-navbar-surface-color: var(--nf-blue-l-20)` and `--nf-navbar-active-color: var(--nf-red-l-60)` through a class on a `Navbar` with no `color`
- **THEN** the bar and the menu panel use the blue surface, and the current item uses the red

#### Scenario: Lists outside a Navbar keep the defaults

- **WHEN** a `NavItemsMobile` with a current item is rendered on its own, outside any `Navbar`
- **THEN** its borders are grey and its current item is purple, as in an uncolored `Navbar`

### Requirement: NavLogo content API and appearance

The library SHALL publish `NavLogo` at `astro-nosferatu/components/NavLogo.astro`. It SHALL render an `a` carrying the class `nf-nav-logo`, with `href` defaulting to `/`. It SHALL accept every native `a` attribute, forward it, and merge a consumer `class`. It SHALL take **either** a `text` prop, rendered as the link's text, **or** both `src` and `alt`, rendered as an `img` inside the link. Passing both `text` and `src`, neither of them, or `src` without `alt`, SHALL be a type error. Logo text SHALL be bold and larger than body text. A logo image SHALL be `32px` tall by default, overridable through `--nf-nav-logo-block-size`, with its width following its aspect ratio.

#### Scenario: Text logo

- **WHEN** a consumer renders `<NavLogo text="Nosferatu" />`
- **THEN** the output is `<a href="/" class="nf-nav-logo">` containing the bold text `Nosferatu`

#### Scenario: Image logo

- **WHEN** a consumer renders `<NavLogo src="/logo.svg" alt="Nosferatu" href="/home" />`
- **THEN** the link points to `/home` and contains an `img` with that `src` and `alt`, `32px` tall

#### Scenario: Ambiguous logo is a type error

- **WHEN** a consumer writes `<NavLogo text="A" src="/a.svg" alt="A" />` or `<NavLogo src="/a.svg" />` in an `.astro` file and runs `astro check`
- **THEN** the check fails

### Requirement: Navigation item lists

The library SHALL publish `NavItemsDesktop` and `NavItemsMobile` at `astro-nosferatu/components/NavItemsDesktop.astro` and `astro-nosferatu/components/NavItemsMobile.astro`. Each SHALL take a required `items` prop typed `NavItem[]` and render a `ul` (class `nf-nav-items-desktop` / `nf-nav-items-mobile`) with one `li` per item, in the given order. Each `li` SHALL hold an `a` that links to the item's `href`, with the item's `text` as its label. When the item has an `icon`, it SHALL be rendered before the text, on the inline-start side, `22px` square, with a stroke width of `2`, hidden from assistive technology. When the item has `current: true`, its link SHALL carry `aria-current="page"` and SHALL take its text and icon color from the navbar's active color. No other link SHALL carry `aria-current`. Both SHALL accept every native `ul` attribute, forward it, and merge a consumer `class`. Since the two components are independent, a consumer SHALL be able to give the desktop and mobile lists different items, order and icons.

`NavItemsDesktop` SHALL lay its items out in a row with no gap between them. Each link SHALL have `14px` block padding, `16px` inline padding and `1rem` text.

`NavItemsMobile` SHALL stack its items vertically, each link spanning the list's full inline size with `16px` padding on both axes, `1rem` text and centred content. Each item SHALL have a `1px` solid bottom border in the navbar's border color.

Both lists' links, other than the current one, SHALL inherit the surrounding text color, and SHALL show a visible `:focus-visible` outline.

#### Scenario: Items render in order with optional icons

- **WHEN** a consumer renders `<NavItemsDesktop items={[{ text: "Home", href: "/", icon: HomeIcon }, { text: "Blog", href: "/blog" }]} />`
- **THEN** the output is a `ul.nf-nav-items-desktop` with two links in that order, the first with the icon before `Home`, the second with text only

#### Scenario: Desktop spacing

- **WHEN** a rendered desktop item link is inspected
- **THEN** its padding is `14px 16px`, its font size is `1rem`, and there is no gap between adjacent items

#### Scenario: Mobile spacing and border

- **WHEN** a rendered mobile item is inspected in light and then dark schemes
- **THEN** its link fills the list's width with `16px` padding and `1rem` text, and its bottom border is `1px` solid, in `--nf-grey-l-30` in light and `--nf-grey-d-120` in dark

#### Scenario: Current item is marked

- **WHEN** a consumer passes `[{ text: "Home", href: "/" }, { text: "Blog", href: "/blog", current: true }]` to either list
- **THEN** only the `Blog` link carries `aria-current="page"`, and it is drawn in the active color

#### Scenario: Different lists for desktop and mobile

- **WHEN** a consumer passes `[Home, Blog]` to `NavItemsDesktop` and `[Blog, Home, About]` to `NavItemsMobile` in the same `Navbar`
- **THEN** the desktop row shows `Home, Blog`, and the opened menu shows `Blog, Home, About`

#### Scenario: Missing items is a type error

- **WHEN** a consumer writes `<NavItemsMobile />` in an `.astro` file and runs `astro check`
- **THEN** the check fails

### Requirement: NavSocial content API and appearance

The library SHALL publish `NavSocial` at `astro-nosferatu/components/NavSocial.astro`. It SHALL take a required `items` prop, an array of `{ icon, href, label }`, all three required, and render a `ul.nf-nav-social` with one `li` per item. Each `li` SHALL hold an `a` to `href` whose `aria-label` is `label` and whose only content is the `icon`, which is hidden from assistive technology. It SHALL accept every native `ul` attribute, forward it, and merge a consumer `class`. Items SHALL sit in a row `16px` apart. Each icon SHALL be `22px` by `22px`, with a stroke width of `2`, inside `6px` of padding, inherit the surrounding text color, and the link SHALL show a visible `:focus-visible` outline.

#### Scenario: Social links have accessible names

- **WHEN** a consumer renders `<NavSocial items={[{ icon: GithubIcon, href: "https://github.com/x", label: "GitHub" }]} />`
- **THEN** the output is a `ul.nf-nav-social` holding one link to that URL, announced as `GitHub`, showing only the icon

#### Scenario: Missing label is a type error

- **WHEN** a consumer writes an item without `label` in an `.astro` file and runs `astro check`
- **THEN** the check fails

#### Scenario: Icon geometry

- **WHEN** a rendered social link is inspected
- **THEN** its icon is `22px` square and the link is `34px` square, made of the icon plus `6px` padding on every side

## MODIFIED Requirements

### Requirement: Shared prop types

Prop types used by more than one component SHALL live in `src/types/`, exported by name, and components SHALL reference them instead of restating them. The palette hues a `color` prop accepts SHALL be the exported type `ColorPalette`. A navigation link, `{ text: string; href: string; icon?: IconComponent; current?: boolean }`, SHALL be the exported type `NavItem`, shared by `NavItemsDesktop` and `NavItemsMobile`. Published component source SHALL import those modules by relative path, never through a path alias: a consuming project does not have the library's alias configured, and an unresolved type import degrades the prop to `any`, which silently removes the prop's type checking on the consumer's side.

#### Scenario: One definition of the palette hues

- **WHEN** `Button`'s and `Callout`'s `color` props are inspected
- **THEN** both are typed `ColorPalette`, imported from the library's shared types, and neither restates the list of hues

#### Scenario: One definition of a navigation item

- **WHEN** `NavItemsDesktop`'s and `NavItemsMobile`'s `items` props are inspected
- **THEN** both are typed `NavItem[]`, imported from the library's shared types

#### Scenario: Invalid color is still a type error in a consuming project

- **WHEN** a consuming Astro project whose TypeScript configuration has no alias for the library's internals writes `<Callout title="x" color="teal" />` in an `.astro` file and runs `astro check`
- **THEN** the check fails, reporting that `"teal"` is not assignable to the `color` prop
