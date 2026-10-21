# documentation-site Specification

## Purpose

Defines the Starlight documentation site for `astro-nosferatu`: it documents the library by using its public exports and is never published as a package.

## Requirements

### Requirement: Docs consume the library through its public exports
The documentation site SHALL import components and styles only through the library's package name and public import paths, never through relative paths into the library's source.

#### Scenario: Docs build exercises the exports
- **WHEN** a component is removed from the library's public exports and the docs site is built
- **THEN** the docs build fails on the unresolved import

### Requirement: Docs live demos
The documentation site SHALL render each documented component live on its page, alongside an example of how to import it. A component page SHALL show a live example of every value of each enumerated prop the component accepts, document each prop with its type and default, and state how the component can be re-themed.

#### Scenario: Button page
- **WHEN** a reader opens the Button page of the docs site
- **THEN** they see a rendered `Button` and the import line `import Button from 'astro-nosferatu/components/Button.astro'`

#### Scenario: Every color is shown
- **WHEN** a reader opens the Button page
- **THEN** they see a live `Button` for each of `blue`, `cyan`, `green`, `orange`, `pink`, `purple`, `red` and `yellow`, each labelled with the value that produces it

#### Scenario: Interaction states are demonstrable
- **WHEN** a reader hovers and presses a `Button` in a demo on its page
- **THEN** the button visibly sinks and flattens, and the page explains the resting, hover and active behaviour in prose

#### Scenario: Theming is documented with runnable code
- **WHEN** a reader looks at the Button page's theming section
- **THEN** it shows a live demo of overriding the component's color custom properties together with the exact code that produces it

### Requirement: Docs are never published
The documentation site SHALL be marked private so it cannot be published to a registry.

#### Scenario: Publish attempt is refused
- **WHEN** a maintainer runs a publish command from the docs site's directory
- **THEN** the package manager refuses because the package is private

### Requirement: Local docs development
Maintainers SHALL be able to start the docs site locally with one command from the repository root, and changes to library components or styles SHALL appear in the running site without reinstalling.

#### Scenario: Edit a component while docs run
- **WHEN** the docs dev server is running and a maintainer edits `Button.astro` in the library
- **THEN** the docs page reflects the change after reload, without a reinstall
