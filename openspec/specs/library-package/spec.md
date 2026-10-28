# library-package Specification

## Purpose

Defines how the `astro-nosferatu` package is published and consumed: its identity, public import paths, what the npm tarball contains, and which Astro versions it supports.

## Requirements

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
The library SHALL expose components at `astro-nosferatu/components/<Name>.astro`, layouts at `astro-nosferatu/layouts/<Name>.astro`, document-structure files at `astro-nosferatu/html/<Name>.astro`, and stylesheets at `astro-nosferatu/styles/<name>.css`. Paths outside these four entry points SHALL NOT be importable through the package's exports, so the shared types under `src/types/` remain an internal implementation detail even though they are published.

#### Scenario: Import a component
- **WHEN** a consumer Astro project imports `astro-nosferatu/components/Button.astro`
- **THEN** the import resolves and the component renders

#### Scenario: Import a layout
- **WHEN** a consumer Astro project imports `astro-nosferatu/layouts/BlogArticle.astro`
- **THEN** the import resolves and the layout renders the page

#### Scenario: Import an html file
- **WHEN** a consumer Astro project imports `astro-nosferatu/html/BaseHtml.astro` or `astro-nosferatu/html/BaseHead.astro`
- **THEN** the import resolves and the file renders its part of the document

#### Scenario: Import a stylesheet
- **WHEN** a consumer Astro project imports `astro-nosferatu/styles/index.css`
- **THEN** the import resolves and the styles are applied

#### Scenario: Private path is blocked
- **WHEN** a consumer imports a file from the package that is not under `components/`, `layouts/`, `html/` or `styles/`, including `astro-nosferatu/types/components.ts`
- **THEN** module resolution fails with a package-exports error

### Requirement: Shipped source resolves without consumer configuration
Every module specifier in published source SHALL resolve in a consuming project with no configuration of its own: a bare specifier that the package itself declares, or a relative path. Published source SHALL NOT use a path alias, even for type-only imports, because the alias is defined by the library's own TypeScript configuration, which a consumer never loads.

#### Scenario: A consumer needs no aliases
- **WHEN** a consuming Astro project with a default TypeScript configuration builds and type-checks a page using the library
- **THEN** every import inside the library's source resolves, and no prop type silently widens to `any`

#### Scenario: The alias is for unpublished code only
- **WHEN** the library's `tsconfig.json` is inspected
- **THEN** it maps `@/*` to `./src/*` for local type-checking, and no file under `src/components/` uses that alias

### Requirement: Tarball contents limited to library sources
The published tarball SHALL contain only the library's components, layouts, document-structure files, shared types, styles, package manifest, README and license. It SHALL NOT contain the documentation site, its dependencies, workspace configuration, tooling configuration such as `tsconfig.json`, or tests.

#### Scenario: Dry-run pack lists only library files
- **WHEN** a maintainer runs a dry-run pack of the library
- **THEN** every listed file is either under `src/components/`, `src/layouts/`, `src/html/`, `src/types/` or `src/styles/`, or is `package.json`, `README.md` or `LICENSE`

#### Scenario: Tooling configuration stays out
- **WHEN** the packed file list is inspected
- **THEN** it contains no `tsconfig.json`, even though the package has one for local type-checking

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
