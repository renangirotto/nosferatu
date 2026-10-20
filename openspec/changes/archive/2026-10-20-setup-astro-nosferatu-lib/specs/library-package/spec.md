# Spec Delta

## Purpose

Defines how the `astro-nosferatu` package is published and consumed: its identity, public import paths, what the npm tarball contains, and which Astro versions it supports.

## ADDED Requirements

### Requirement: Public package identity
The library SHALL be published to the public npm registry under the unscoped name `astro-nosferatu`, and its package metadata SHALL include the `astro-component` keyword.

#### Scenario: Package metadata
- **WHEN** the library's package manifest is inspected
- **THEN** its name is `astro-nosferatu`, it is not marked private, and its keywords include `astro-component`

### Requirement: Source distribution without a build step
The library SHALL ship its components as `.astro` source files and its styles as `.css` source files, compiled by the consumer's Astro project. No build step SHALL be required before packing or publishing.

#### Scenario: Pack without building
- **WHEN** a maintainer packs the library from a clean checkout without running any build command
- **THEN** the tarball contains the `.astro` and `.css` source files

### Requirement: Public import paths
The library SHALL expose components at `astro-nosferatu/components/<Name>.astro` and stylesheets at `astro-nosferatu/styles/<name>.css`. Paths outside these two entry points SHALL NOT be importable through the package's exports.

#### Scenario: Import a component
- **WHEN** a consumer Astro project imports `astro-nosferatu/components/Button.astro`
- **THEN** the import resolves and the component renders

#### Scenario: Import a stylesheet
- **WHEN** a consumer Astro project imports `astro-nosferatu/styles/index.css`
- **THEN** the import resolves and the styles are applied

#### Scenario: Private path is blocked
- **WHEN** a consumer imports a file from the package that is not under `components/` or `styles/`
- **THEN** module resolution fails with a package-exports error

### Requirement: Tarball contents limited to library sources
The published tarball SHALL contain only the library's components, styles, package manifest, README and license. It SHALL NOT contain the documentation site, its dependencies, workspace configuration, or tests.

#### Scenario: Dry-run pack lists only library files
- **WHEN** a maintainer runs a dry-run pack of the library
- **THEN** every listed file is either under `src/components/`, under `src/styles/`, or is `package.json`, `README.md` or `LICENSE`

#### Scenario: Starlight is not a dependency of the package
- **WHEN** the library's package manifest is inspected
- **THEN** `@astrojs/starlight` does not appear in `dependencies`, `peerDependencies` or `optionalDependencies`

### Requirement: Supported Astro versions
The library SHALL declare `astro` `^7.0.0` as a peer dependency and SHALL have no runtime dependencies.

#### Scenario: Install in an Astro 7 project
- **WHEN** the library is installed into a project using Astro 7.x
- **THEN** the package manager reports no peer dependency conflict for `astro`

#### Scenario: Install in an older Astro project
- **WHEN** the library is installed into a project using Astro 6.x
- **THEN** the package manager reports an unmet `astro` peer dependency
