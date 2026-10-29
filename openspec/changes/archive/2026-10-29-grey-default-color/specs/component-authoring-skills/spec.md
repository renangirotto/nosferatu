# Spec Delta

## ADDED Requirements

### Requirement: Skills teach the unset-color default
`component-build` SHALL describe how a component with a `color` prop handles its default: the prop has no default value in the frontmatter, the `data-ui-color` attribute is rendered only when `color` is passed, and every use of a component color property carries a `var()` fallback to the grey `light-dark()` pairing that the component's own `data-ui-color="grey"` rule sets, so the uncolored and explicitly grey instances look identical. It SHALL state this as the one sanctioned exception to its rule against `var()` fallbacks, and SHALL use the current `Button` as the worked example of it. `component-doc` SHALL describe how such a component's page documents the default — grey, with no attribute rendered — in prose, in the props table and with a live uncolored demo.

#### Scenario: Building a color-variant component from the skill alone
- **WHEN** an agent adds a new component with a `color` prop by following `component-build`
- **THEN** the component renders no `data-ui-color` attribute when `color` is omitted, and its color property use sites fall back to grey palette tokens matching its `grey` variant

#### Scenario: The fallback exception is explicit
- **WHEN** a reader checks `component-build`'s rule against `var()` fallbacks
- **THEN** it names the color-default fallback as the only exception and explains why, and gives no example that defaults `color` to a hue in the frontmatter

#### Scenario: Documenting the default from the skill alone
- **WHEN** an agent documents a color-variant component by following `component-doc`
- **THEN** the page lists the `color` default as grey with no attribute rendered, and shows an uncolored live demo
