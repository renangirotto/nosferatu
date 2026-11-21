/**
 * Shared prop types for the library's components.
 *
 * Published components import this file by **relative** path, never through
 * the `@/*` alias: the library ships source, and a consumer's TypeScript has
 * no such alias, so an aliased import would resolve to `any` on their side and
 * silently drop the prop's type checking.
 */

/** The palette hues a component's `color` prop accepts. */
export type ColorPalette =
	| "blue"
	| "cyan"
	| "green"
	| "grey"
	| "orange"
	| "pink"
	| "purple"
	| "red"
	| "yellow";

/**
 * Any component a prop renders as an icon: an `.astro` file, an imported
 * `.svg`, a framework component. The receiving component is never told what
 * an icon is: it renders it with no props, or, where it fixes the icon's look
 * (the navbar parts), with `width` and `height` of `1em` and a `stroke-width`
 * of `2`, which an imported `.svg` honours and any other component may ignore.
 */
export type IconComponent = (props: Record<string, any>) => any;

/**
 * One link in a navigation list. `NavItemsDesktop` and `NavItemsMobile` both
 * take an array of these, so the two lists can differ in items, order and icons.
 */
export type NavItem = {
	text: string;
	href: string;
	/** Rendered before the text, hidden from assistive technology. */
	icon?: IconComponent;
	/** Marks the link `aria-current="page"` and draws it in the active color. */
	current?: boolean;
};
