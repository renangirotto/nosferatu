## ADDED Requirements

### Requirement: Docs dark theme uses the library palette
In its dark theme, the documentation site SHALL take the following colors from the library's dark palette rather than from Starlight's defaults: the background behind page content, the table of contents, the left sidebar navigation, the top bar and the mobile table-of-contents bar from `--nf-grey-d-100`, plain body text from `--nf-grey-d-10`, table-of-contents links on hover and for the current section from `--nf-purple-d-50`, the background of the sidebar link for the current page from `--nf-purple-d-50`, and the text of inline code in page content from `--nf-green-d-50`, with inline code drawn at font weight 600 on a `--nf-grey-d-120` background. Code blocks SHALL be highlighted with the Dracula theme and SHALL have an 8px corner radius and a `--nf-grey-d-80-25` border. The mobile table-of-contents toggle and its open list SHALL have a `--nf-grey-d-110` background, the toggle with a `--nf-grey-d-80-25` border. The search button, where it is drawn as a bordered field, SHALL have a `--nf-grey-d-110` background and a `--nf-grey-d-80-25` border. In the dark theme, the borders separating the left sidebar, the top bar, the mobile table of contents and the desktop table of contents from the content SHALL be transparent. The site SHALL read these colors from the palette tokens the library publishes, so a change to a palette value shows up in the docs without editing the docs. The light theme SHALL be unaffected. The library itself SHALL NOT change to support this.

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

#### Scenario: Light theme untouched
- **WHEN** a reader switches the site to the light theme
- **THEN** the background, border, text, link and code colors are Starlight's light-theme defaults

#### Scenario: Library unchanged
- **WHEN** a maintainer runs `pnpm pack:check` after this change
- **THEN** the listed tarball contents are identical to before the change

### Requirement: Docs text uses the Outfit font
In both its light and dark themes, the documentation site SHALL set its body and interface text — paragraphs, headings, sidebar, top bar, table of contents and search — in the Outfit font, served by the site itself rather than from a third-party font host. Code SHALL NOT use Outfit: inline code and fenced code blocks, including a code block's frame title and copy-button label, SHALL keep the fonts they had before this change. The library itself SHALL NOT load or name any font to support this.

#### Scenario: Plain text is in Outfit
- **WHEN** a reader inspects a body paragraph, a heading, a sidebar link and a table-of-contents link, in either theme
- **THEN** each one's rendered font is `Outfit Variable`

#### Scenario: Code is not in Outfit
- **WHEN** a reader inspects inline code, the code inside a fenced code block, and a code block's frame title
- **THEN** none of them renders in Outfit; inline and block code use the monospace font, and the frame title uses the system UI font

#### Scenario: Font is self-hosted
- **WHEN** a reader loads a documentation page with the browser's network panel open
- **THEN** the Outfit font file is requested from the docs site's own origin, and no request goes to a font CDN
