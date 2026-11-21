# Spec Delta

## ADDED Requirements

### Requirement: Navbar page documents the component set

A single page, `Navbar`, SHALL document `Navbar`, `NavLogo`, `NavItemsDesktop`, `NavItemsMobile` and `NavSocial` together, and SHALL follow the component page structure, with these adaptations:

- Before `Usage`, a warning SHALL say that the navbar is sticky, and that it must be placed directly in the page flow (for example, as a child of `body`), because it stops sticking once its parent scrolls away.
- `Usage` SHALL show, in one code block, the imports of all five components and a `Navbar` filling every named slot, followed by that navbar rendered live. The docs content column is narrower than the `856px` breakpoint, so the live demo shows the mobile arrangement. `Usage` SHALL also link to a standalone example page.
- The standalone example page, at `/examples/navbar/`, SHALL render a `Navbar` at the full viewport width, as a direct child of `body`, above content long and colorful enough that the reader sees the desktop arrangement on a wide screen and the navbar sticking on scroll. Like the other example pages, it SHALL load the library's styles and not the docs site's.
- `Color variants` SHALL say that `color` changes only the current item and falls back to purple, and SHALL render one navbar per `color` value, wide enough to show the desktop links, so each current item shows its color without opening a menu.
- A `States` section SHALL have an `Open` subsection, where the reader can open and close the mobile menu from a live demo.
- An `Icons` section SHALL show items with icons in both lists.
- `Props` SHALL have one third-level subsection per component, each with its own four-column table and the line naming the native element it forwards. The `Navbar` subsection SHALL also name its four slots. The `NavItem` type SHALL be shown once.
- `CSS Variables` SHALL list every overridable `--nf-navbar-*` and `--nf-nav-*` property, including the four color properties, and `Theming` SHALL show one live customization through them.

#### Scenario: Warning is visible

- **WHEN** a reader opens the Navbar page
- **THEN** a warning callout above `Usage` says the navbar is sticky and must sit directly in the page flow

#### Scenario: The example page shows the desktop arrangement

- **WHEN** a reader on a `1440px` screen follows the example link from `Usage`, then scrolls the example page
- **THEN** they see the desktop arrangement, and the navbar stays pinned to the top

#### Scenario: The inline demo shows the mobile arrangement

- **WHEN** a reader on a `1440px` screen looks at the `Usage` demo
- **THEN** they see the mobile arrangement, with a burger that opens the menu

#### Scenario: The menu opens from the docs

- **WHEN** a reader in a supporting browser activates a burger on the page
- **THEN** the mobile menu slides in with the demo's mobile items, and closes on Esc or a click outside it; the `Open` state says that a mid-page demo's menu covers its burger and links to the example page, where the burger closes it

#### Scenario: One props table per component

- **WHEN** a reader looks at the `Props` section
- **THEN** it has a subsection for each of `Navbar`, `NavLogo`, `NavItemsDesktop`, `NavItemsMobile` and `NavSocial`, each with a Prop/Type/Required/Default table

## MODIFIED Requirements

### Requirement: Color-variant pages document the unset default

On the page of every component that accepts a `color` prop, the documentation site SHALL list the prop's default in the props table as grey (unset) rather than as a hue the component writes into its markup, and the `Color variants` render SHALL begin with an instance rendered with no `color`. The one exception is the Navbar page: `Navbar`'s `color` colors only the current item and falls back to purple, so its props table SHALL give the default as purple (unset) and its `Color variants` section SHALL say that leaving `color` out renders purple.

#### Scenario: Default stated in prose and table

- **WHEN** a reader opens the Button, Callout or Accordion page
- **THEN** the props table gives the `color` default as grey (unset), the `Color variants` section says in one sentence that leaving `color` out renders grey, and no page says the default is `purple`

#### Scenario: Default shown live

- **WHEN** a reader looks at the `Color variants` render of one of those pages
- **THEN** its first instance is rendered with no `color`, and the code block shows that instance without a `color` attribute

#### Scenario: The Navbar default is purple

- **WHEN** a reader opens the Navbar page
- **THEN** the props table gives the `color` default as purple (unset), the `Color variants` section says leaving `color` out renders a purple current item, and its first instance is rendered with no `color`
