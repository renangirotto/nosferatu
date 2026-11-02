# Spec Delta

## MODIFIED Requirements

### Requirement: Supported Astro versions

The library SHALL declare `astro` `^7.0.0` as a peer dependency. Its only runtime dependency SHALL be `iconoir`, declared under `dependencies` with a caret range, which supplies the SVG sources library components import internally and render at build time, and contains no JavaScript the consumer's pages load. Iconoir SHALL NOT be part of the library's public API: no published path re-exports it and no prop takes an Iconoir name. Its only other peer dependencies SHALL be the optional font packages, which no package manager installs on a consumer's behalf.

#### Scenario: Install in an Astro 7 project

- **WHEN** the library is installed into a project using Astro 7.x
- **THEN** the package manager reports no peer dependency conflict for `astro`

#### Scenario: Install in an older Astro project

- **WHEN** the library is installed into a project using Astro 6.x
- **THEN** the package manager reports an unmet `astro` peer dependency

#### Scenario: Nothing is installed alongside the library

- **WHEN** the library is installed into a project
- **THEN** the package manager adds nothing beyond `iconoir`, and no other transitive package on the library's behalf, because `dependencies` holds only `iconoir`, Iconoir itself declares no dependencies, and every peer dependency is either the consumer's own Astro or optional

#### Scenario: The consumer does not install Iconoir

- **WHEN** a consuming project's own manifest does not list `iconoir`
- **THEN** every default `Accordion` icon still renders

#### Scenario: The packed library installs under either package manager

- **WHEN** the packed library is installed from its tarball into a fresh Astro 7 project with npm, and separately with pnpm, and a page rendering `Accordion` with its default icons is built in each
- **THEN** both builds succeed with no configuration and no Iconoir entry added to the consuming project
