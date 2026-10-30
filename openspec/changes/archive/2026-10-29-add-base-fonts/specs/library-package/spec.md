# Spec Delta

## ADDED Requirements

### Requirement: Fonts are an optional peer dependency
The library SHALL name the Fontsource packages that supply its three base fonts — `@fontsource-variable/outfit`, `@fontsource-variable/plus-jakarta-sans` and `@fontsource-variable/geist-mono` — as peer dependencies marked optional in its manifest, so the version range it is written against is machine-readable while no package manager installs them for a consumer or warns about their absence. The library SHALL NOT list them under `dependencies`, and SHALL NOT import them from any published source file: a consumer who wants the fonts installs the packages and imports them from their own project.

#### Scenario: Install without the fonts
- **WHEN** the library is installed into an Astro 7 project that does not install any Fontsource package
- **THEN** the install succeeds, the package manager reports no unmet or missing peer dependency for the three font packages, and nothing in the library fails to resolve

#### Scenario: Install with the fonts
- **WHEN** the same project also installs the three Fontsource packages within the declared range and imports them
- **THEN** the package manager reports no peer dependency conflict, and the fonts render

#### Scenario: The manifest says they are optional
- **WHEN** the library's package manifest is inspected
- **THEN** each of the three packages appears under `peerDependencies` with a version range and under `peerDependenciesMeta` with `"optional": true`, and none of them appears under `dependencies`

#### Scenario: No published file imports a font package
- **WHEN** the library's published `.astro` and `.css` sources are searched for `@fontsource`
- **THEN** no import or `@import` of a font package is found, so a consumer without the packages never hits an unresolved module

## MODIFIED Requirements

### Requirement: Supported Astro versions
The library SHALL declare `astro` `^7.0.0` as a peer dependency and SHALL have no runtime dependencies. Its only other peer dependencies SHALL be the optional font packages, which no package manager installs on a consumer's behalf.

#### Scenario: Install in an Astro 7 project
- **WHEN** the library is installed into a project using Astro 7.x
- **THEN** the package manager reports no peer dependency conflict for `astro`

#### Scenario: Install in an older Astro project
- **WHEN** the library is installed into a project using Astro 6.x
- **THEN** the package manager reports an unmet `astro` peer dependency

#### Scenario: Nothing is installed alongside the library
- **WHEN** the library is installed into a project
- **THEN** the package manager adds no transitive package on the library's behalf, because `dependencies` is empty and every peer dependency is either the consumer's own Astro or optional

### Requirement: Tarball contents limited to library sources
The published tarball SHALL contain only the library's components, layouts, document-structure files, shared types, styles, package manifest, README and license. Stylesheets MAY be nested in subdirectories under `src/styles/`, and every such file SHALL be packed. The tarball SHALL NOT contain the documentation site, its dependencies, workspace configuration, tooling configuration such as `tsconfig.json`, tests, or any font binary.

#### Scenario: Dry-run pack lists only library files
- **WHEN** a maintainer runs a dry-run pack of the library
- **THEN** every listed file is either under `src/components/`, `src/layouts/`, `src/html/`, `src/types/` or `src/styles/` (at any depth), or is `package.json`, `README.md` or `LICENSE`

#### Scenario: Nested stylesheets are packed
- **WHEN** the packed file list is inspected
- **THEN** it contains `src/styles/colors/index.css`, `src/styles/colors/colors-dark.css` and `src/styles/colors/colors-light.css`, and no `src/styles/colors.css`

#### Scenario: Tooling configuration stays out
- **WHEN** the packed file list is inspected
- **THEN** it contains no `tsconfig.json`, even though the package has one for local type-checking

#### Scenario: No font binary is shipped
- **WHEN** the packed file list is inspected
- **THEN** it contains no `.woff`, `.woff2`, `.ttf`, `.otf` or `.eot` file, and the tarball's size is unchanged by the fonts the library names

#### Scenario: Starlight is not a dependency of the package
- **WHEN** the library's package manifest is inspected
- **THEN** `@astrojs/starlight` does not appear in `dependencies`, `peerDependencies` or `optionalDependencies`
