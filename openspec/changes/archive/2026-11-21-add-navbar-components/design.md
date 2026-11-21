# Design

## Context

See `proposal.md` for the motivation and `specs/` for the requirements. The library ships source, has no runtime JavaScript, and its components may style only their own markup (`library-styles`, "Components are self-styled through tokens"). The spacing scale stops at `32px` and has no `6px` or `14px` step. `reset.css` already makes `body` an inline-size container.

## Goals / Non-Goals

**Goals:**

- Five independent `.astro` files that compose through named slots, each one self-styled.
- The mobile menu works with no script.

**Non-Goals:**

- Sharing styles between `NavItemsDesktop` and `NavItemsMobile` through a third file. Their layouts differ, and the only thing they share is the `NavItem` type.

## Decisions

### 1. The wrapper owns the responsive switch, through wrapper elements

`Navbar` wraps each slot in an element of its own: `div.nf-navbar-logo`, `nav.nf-navbar-items-desktop`, `div.nf-navbar-social`, and `button.nf-navbar-burger` + `nav.nf-navbar-menu`. It shows and hides those wrappers, never the slotted components. This upholds invariant 5: `Navbar` never selects into `NavItemsDesktop`'s markup.
_Alternative:_ each list hides itself with a container query on a named `Navbar` container. Rejected, because the sub-components would then behave differently outside a `Navbar`.

### 2. A container query on the navbar, at a literal `856px`

`.nf-navbar` declares a named container, `container: nf-navbar / inline-size`, and the wrappers switch on `@container nf-navbar (width >= 856px)`. Because the container is named, the query always measures the navbar itself, even if a consumer nests it inside another container, such as `body-container` from `reset.css`. A container cannot query its own size, so the rules target `.nf-navbar`'s children, never the root. That lets a docs demo show the mobile arrangement inside a desktop page. `856px` matches `--nf-container-small-size`, but a custom property cannot appear in a container-query condition, so the value is written literally, with a comment naming the token it mirrors.
_Alternative:_ `@media`. Rejected, because it is tied to the viewport.

### 3. Spacing off the scale is composed, not tokenised

Invariant 2 / "Components are self-styled through tokens" forbids literal padding and gap values. So the off-scale values are built from scale tokens with `calc()`:

- `14px` = `calc(var(--nf-spacing-base-low-1) + var(--nf-spacing-base-low-4))` (12 + 2)
- `6px` = `calc(var(--nf-spacing-base-low-3) + var(--nf-spacing-base-low-4))` (4 + 2)
- `64px` = `calc(2 * var(--nf-spacing-base-up-4))` (2 × 32)

Each sum is held once, in a component-scoped property: `--nf-nav-items-desktop-link-padding-block`, `--nf-nav-social-link-padding` and `--nf-navbar-logo-gap`. This upholds the invariant without adding a published token.
_Alternative:_ add `--nf-spacing-*` steps. Rejected, because that is a new public API and needs its own proposal.

### 4. Row layout: one gap property, switched at the breakpoint

The container is `display: flex; align-items: center; column-gap: var(--nf-navbar-gap)`.

- `--nf-navbar-gap` is `--nf-spacing-base-up-2` (`24px`) below the breakpoint, and `--nf-navbar-logo-gap` (`64px`) at or above it.
- `.nf-navbar-logo` has `margin-inline-end: auto`, which pushes everything after it to the inline end (the `space-between` look) and keeps the minimum gap, with or without social links. At the breakpoint the desktop `nav` gets `flex: 1`, which takes that free space first, so the list sits right after the logo and the social links stay at the end.
- The burger comes after the social links.
- `--nf-navbar-max-inline-size: 1036px` is declared on the root as a component-scoped property. It has no library token, and it is meant to be retuned.

### 5. Menu: a native popover toggled by the burger, no script

The burger is `<button popovertarget={id}>`, and the menu is `<nav id={id} popover>`. The burger toggles the menu, and the browser exposes the button's expanded state, closes the menu on Esc and on a click outside it, and returns focus to the burger on Esc. The burger holds both icons, and `.nf-navbar:has(.nf-navbar-menu:popover-open)` swaps the burger icon for the × while the menu is open, inside `Navbar`'s own markup.

The `id` is `nf-navbar-menu-<8 hex>`, from `crypto.randomUUID()` in `Navbar`'s frontmatter, so ids stay unique across `Navbar`s on a page. (A module-level counter was the first plan, but Astro runs the frontmatter once per render, so the counter never persists. The cost is that the id changes between builds.) `Astro.slots.has("nav-items-mobile")` decides whether to render the burger and the menu. The icons are iconoir `menu.svg` and `xmark.svg`, imported the way `Accordion` imports its icons.
_Alternative:_ a modal `<dialog>` opened with invoker commands (`command="show-modal"`), the first implementation. Replaced, because the burger has to close the menu: a modal makes the bar inert, and without JavaScript invoker commands can only open a dialog as a modal. A popover also needs no invoker-command support, which the dialog did. The cost is that the menu is not modal, so the page behind it stays reachable by Tab.

### 6. Slide-in through `@starting-style` and discrete transitions

The open menu (`:popover-open`) sits at `translate: 0`. Its closed state and its `@starting-style` are at `translate: 100% 0`, which makes it slide in from right to left.

- `transition-property: translate, display, overlay` with `transition-behavior: allow-discrete`, so the panel also slides out when it closes.
- The duration lives in `--nf-navbar-transition-duration`, and is set to `0s` under `prefers-reduced-motion: reduce`.
- `::backdrop` starts at `--nf-navbar-block-size` from the top, so the bar and the burger stay undimmed and clickable, and uses the 25% grey tier: `light-dark(var(--nf-grey-l-100-25), var(--nf-grey-d-200-25))`.

### 7. Color sets only the current item; everything else is grey and inherited

`Navbar` takes one palette prop, `color`, rendered as `data-ui-color`. Each `[data-ui-color]` rule on `.nf-navbar` sets only `--nf-navbar-active-color`. The other three properties are never declared by the library, only read with grey fallbacks, so a consumer can set them:

| Property                    | Set by `color`                       | Fallback                            |
| --------------------------- | ------------------------------------ | ----------------------------------- |
| `--nf-navbar-surface-color` | —                                    | `light-dark(grey-l-10, grey-d-100)` |
| `--nf-navbar-text-color`    | —                                    | `light-dark(grey-l-100, grey-d-10)` |
| `--nf-navbar-border-color`  | —                                    | `light-dark(grey-l-30, grey-d-120)` |
| `--nf-navbar-active-color`  | `light-dark(<hue>-l-70, <hue>-d-30)` | **purple** (`l-70` / `d-30`)        |

- The bar and the menu panel both read the surface and text properties.
- `NavItemsMobile` reads the border property for its item borders.
- Both item lists read the active property for the link with `aria-current="page"`.

Custom properties inherit through the DOM, and the slotted lists, and the menu in the top layer, are DOM descendants of the `header`. So no selector reaches outside a component's markup, which upholds invariant 5. Each use site carries the fallback, so a list used outside a `Navbar` renders the same defaults.

This bends one convention. `component-build` §4b says a `color` prop defaults to grey, and `Navbar`'s defaults to purple instead, because it colors only the current item and a grey current item is indistinguishable from the others. `component-build` gets a note naming it, and the documentation-site requirement "Color-variant pages document the unset default" gets a Navbar exception.

_Earlier plan:_ `color` repainted the surface, text and border per hue, and a separate `activeColor` prop colored the current item. The user asked for the bar to stay on the grey surface pattern, so the two props collapsed into one.

### 8. Sticky, 80px, solid

`.nf-navbar` is `position: sticky; inset-block-start: 0; z-index: var(--nf-navbar-z-index)` (`100`), `block-size: var(--nf-navbar-block-size)` (`80px`) with inline padding only, and a solid background from `--nf-navbar-surface-color`. The container fills the height and centres its items. The menu reads the same `--nf-navbar-block-size` for its top offset, plus `--nf-spacing-base-low-3` (`4px`), so it always opens `4px` below the bar.

A transparent bar with `backdrop-filter: blur(32px)` was tried first and replaced with a solid surface at the user's request.

- Sticky keeps the navbar in the page flow, which gives the "room" a static spacer would. There is no wrapper and no hard-coded height to keep in sync with the content, and the navbar's width stays its parent's, so the narrow docs demo and the container query keep working.
- _Alternative:_ a `fixed` bar inside a static spacer with `--nf-navbar-block-size`. Rejected: the height would be a guess that breaks when the logo or links change size, and a fixed bar spans the whole viewport whatever its wrapper's width.

### 9. NavLogo's either/or is a union type

`Props = HTMLAttributes<"a"> & ({ text: string; src?: never; alt?: never } | { src: string; alt: string; text?: never })`. `astro check` rejects an ambiguous logo. There is no runtime check: an `.mdx` page is not type-checked, and a bad logo shows up visibly anyway.

## Risks / Trade-offs

- [The menu is not modal, so Tab can move past it into the page] → Tab from the burger moves into the menu first, and Esc or the burger closes it. A modal would need JavaScript to close from the burger.
- [The menu opens at a fixed `--nf-navbar-block-size` from the top, which matches the bar only while the bar is at the top of the viewport] → The navbar is sticky and meant to sit at the top of the page, so this holds in normal use.
- [Following a same-page anchor link from the menu leaves it open] → This is listed as a non-goal. Cross-page links navigate away.
- [A sticky navbar unsticks if its parent element is only as tall as the navbar, for example when it is wrapped in a layout's `<div>`] → The docs page states that it must sit in the page flow, and the consumer controls the markup around it.
- [The `100` z-index matches `ReadingProgress`'s] → `ReadingProgress` already exposes `--nf-reading-progress-inset-block-start` to sit below a navbar, and `--nf-navbar-z-index` is retunable.
- [An uncolored `Navbar` nested inside a colored one inherits the outer navbar's hue] → This is the library's usual behaviour for uncolored components, and a nested navbar is unlikely.
- [The `856px` breakpoint duplicates the value of `--nf-container-small-size`] → A comment in the source names the token. If the token changes, the literal has to follow by hand.
