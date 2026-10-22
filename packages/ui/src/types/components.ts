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
	| "orange"
	| "pink"
	| "purple"
	| "red"
	| "yellow";
