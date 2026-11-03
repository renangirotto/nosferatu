## MODIFIED Requirements

### Requirement: Docs dark theme uses the library palette

In its dark theme, the documentation site SHALL take the following colors from the library's dark palette rather than from Starlight's defaults: the background behind page content, the table of contents, the left sidebar navigation, the top bar and the mobile table-of-contents bar from `--nf-grey-d-100`, plain body text from `--nf-grey-d-10`, table-of-contents links on hover and for the current section from `--nf-purple-d-50`, the background of the sidebar link for the current page from `--nf-purple-d-50`, and the text of inline code in page content from `--nf-green-d-50`, with inline code drawn at font weight 600 on a `--nf-grey-d-120` background. Code blocks SHALL be highlighted with the Dracula theme and SHALL have an 8px corner radius and a `--nf-grey-d-80-25` border. The mobile table-of-contents toggle and its open list SHALL have a `--nf-grey-d-110` background, the toggle with a `--nf-grey-d-80-25` border. The search button, where it is drawn as a bordered field, SHALL have a `--nf-grey-d-110` background and a `--nf-grey-d-80-25` border. In the dark theme, the borders separating the left sidebar, the top bar, the mobile table of contents and the desktop table of contents from the content SHALL be transparent. The line separating a page's title from its content SHALL take the background color, `--nf-grey-d-100`. The site SHALL read these colors from the palette tokens the library publishes, so a change to a palette value shows up in the docs without editing the docs. The library itself SHALL NOT change to support this.

#### Scenario: Content and table of contents background

- **WHEN** a reader opens any documentation page in the dark theme
- **THEN** the area behind the page content and behind the "On this page" table of contents has the computed background color of `--nf-grey-d-100`

#### Scenario: Chrome background

- **WHEN** a reader opens any documentation page in the dark theme, on a wide and on a narrow viewport
- **THEN** the left sidebar navigation, the top bar and the mobile "On this page" bar all have the computed background color of `--nf-grey-d-100`

#### Scenario: No chrome borders

- **WHEN** a reader opens any documentation page in the dark theme, on a wide and on a narrow viewport
- **THEN** no visible border line separates the left sidebar, the top bar, the mobile table of contents or the desktop table of contents from the page content; each of those borders computes to `transparent`

#### Scenario: Plain text color

- **WHEN** a reader inspects a body paragraph on a documentation page in the dark theme
- **THEN** its computed text color equals `--nf-grey-d-10`

#### Scenario: Table of contents links

- **WHEN** a reader hovers a link in the table of contents, or scrolls so a section becomes current
- **THEN** that link's text color equals `--nf-purple-d-50`, and other links return to the body text color when not hovered or current

#### Scenario: Sidebar current page

- **WHEN** a reader opens a page in the dark theme
- **THEN** that page's link in the left sidebar navigation has the background color `--nf-purple-d-50`, and its label remains legible against it

#### Scenario: Inline code

- **WHEN** a reader views inline code such as an import path inside a paragraph in the dark theme
- **THEN** the code's text color equals `--nf-green-d-50`, its background `--nf-grey-d-120` and its font weight 600, and code inside fenced code blocks keeps its syntax-highlighting colors

#### Scenario: Code blocks

- **WHEN** a reader views a fenced code block on a documentation page in the dark theme
- **THEN** its syntax colors and background come from the Dracula theme, and its frame has an 8px corner radius and a border whose color equals `--nf-grey-d-80-25`
- **AND** in the light theme the same block keeps Starlight's default light code theme

#### Scenario: Mobile table-of-contents toggle

- **WHEN** a reader on a narrow viewport opens the "On this page" toggle in the dark theme
- **THEN** the toggle and the list it opens have the background `--nf-grey-d-110`, and the toggle's border color equals `--nf-grey-d-80-25`

#### Scenario: Search button

- **WHEN** a reader views the top bar on a wide viewport in the dark theme
- **THEN** the search button has the background `--nf-grey-d-110` and a border whose color equals `--nf-grey-d-80-25`

#### Scenario: Title divider blends into the background

- **WHEN** a reader opens any documentation page in the dark theme
- **THEN** the line between the page title and the page content has the computed color of `--nf-grey-d-100`, so no visible line separates them

#### Scenario: Light theme untouched

- **WHEN** a reader switches the site to the light theme
- **THEN** none of the dark-theme colors above apply; the light theme's colors are the ones the light-theme requirement names

#### Scenario: Library unchanged

- **WHEN** a maintainer runs `pnpm pack:check` after this change
- **THEN** the listed tarball contents are identical to before the change

## ADDED Requirements

### Requirement: Docs light theme uses the library palette

In its light theme, the documentation site SHALL take the following colors from the library's light palette rather than from Starlight's defaults: the background behind page content, the table of contents, the left sidebar navigation, the top bar and the mobile table-of-contents bar from `--nf-grey-l-10`; plain body text and headings, the page title included, from `--nf-grey-l-100`; links in page content, table-of-contents links on hover and for the current section, and the background of the sidebar link for the current page from `--nf-purple-l-50`, with that link's label in `--nf-grey-l-10`; and the text of inline code in page content from `--nf-green-l-50`, drawn at font weight 600 on a `--nf-grey-l-20` background. The lines separating the left sidebar, the top bar, the mobile table of contents and the desktop table of contents from the content, and the line separating a page's title from its content, SHALL have the color `--nf-grey-l-10`. The search button, where it is drawn as a bordered field, and the mobile table-of-contents toggle SHALL have a `--nf-grey-l-20` background and a `--nf-grey-l-10-25` border, and the list the toggle opens a `--nf-grey-l-20` background. Code blocks SHALL keep Starlight's default light syntax theme and SHALL have an 8px corner radius and a `--nf-grey-l-40-25` border. The site SHALL read these colors from the palette tokens the library publishes, so a change to a palette value shows up in the docs without editing the docs. The library itself SHALL NOT change to support this.

#### Scenario: Content and chrome background

- **WHEN** a reader opens any documentation page in the light theme, on a wide and on a narrow viewport
- **THEN** the area behind the page content, the "On this page" table of contents, the left sidebar navigation, the top bar and the mobile "On this page" bar all have the computed background color of `--nf-grey-l-10`

#### Scenario: Divider lines match the background

- **WHEN** a reader opens any documentation page in the light theme, on a wide and on a narrow viewport
- **THEN** the borders of the left sidebar, the top bar, the mobile and desktop tables of contents, and the line between the page title and its content all compute to `--nf-grey-l-10`, so no visible line separates them from the content

#### Scenario: Text and heading color

- **WHEN** a reader inspects a body paragraph, a heading inside the content and the page title in the light theme
- **THEN** each one's computed text color equals `--nf-grey-l-100`

#### Scenario: Links and table of contents

- **WHEN** a reader views a link inside page content, hovers a table-of-contents link, or scrolls so a section becomes current, in the light theme
- **THEN** that link's text color equals `--nf-purple-l-50`, and table-of-contents links return to the body text color when not hovered or current

#### Scenario: Sidebar current page

- **WHEN** a reader opens a page in the light theme
- **THEN** that page's link in the left sidebar navigation has the background color `--nf-purple-l-50` and a label color of `--nf-grey-l-10`

#### Scenario: Search button

- **WHEN** a reader views the top bar on a wide viewport in the light theme
- **THEN** the search button has the background `--nf-grey-l-20` and a border whose color equals `--nf-grey-l-10-25`

#### Scenario: Mobile table-of-contents toggle

- **WHEN** a reader on a narrow viewport opens the "On this page" toggle in the light theme
- **THEN** the toggle and the list it opens have the background `--nf-grey-l-20`, and the toggle's border color equals `--nf-grey-l-10-25`

#### Scenario: Inline code

- **WHEN** a reader views inline code inside a paragraph in the light theme
- **THEN** the code's text color equals `--nf-green-l-50`, its background `--nf-grey-l-20` and its font weight 600, and code inside fenced code blocks keeps its syntax-highlighting colors

#### Scenario: Code blocks

- **WHEN** a reader views a fenced code block in the light theme
- **THEN** its syntax colors come from Starlight's default light code theme, and its frame has an 8px corner radius and a border whose color equals `--nf-grey-l-40-25`

#### Scenario: Dark theme unaffected

- **WHEN** a reader switches the site back to the dark theme
- **THEN** every color it shows is the one the dark-theme requirement names; none of the light-theme values leak into it

#### Scenario: Library unchanged

- **WHEN** a maintainer runs `pnpm pack:check` after this change
- **THEN** the listed tarball contents are identical to before the change
