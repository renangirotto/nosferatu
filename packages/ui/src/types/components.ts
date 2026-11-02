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
 * `.svg`, a framework component. The receiving component renders it with no
 * props and is never told what an icon is.
 */
export type IconComponent = (props: Record<string, any>) => any;
