# Spec Delta

## ADDED Requirements

### Requirement: TableOfContent page documents the active-link contract

The TableOfContent page SHALL follow the component page structure. Before its `Usage` section it SHALL explain that the active link comes from two sources: native scroll-spy where `scroll-target-group` is supported, and `aria-current="location"` set by the page. It SHALL show a page-level script that sets `aria-current="location"` on the link for the section in view, runs only when `scroll-target-group` is unsupported, and is not part of the library. The page's live demo SHALL link to the page's own sections, so that scrolling the page moves the active link.

#### Scenario: Contract is visible

- **WHEN** a reader opens the TableOfContent page
- **THEN** a note above `Usage` names `scroll-target-group` and `aria-current="location"`, and the page shows the fallback script as a code block

#### Scenario: Demo follows the page scroll

- **WHEN** a reader scrolls through the TableOfContent page in Chrome, and then in a browser without `scroll-target-group`
- **THEN** in both browsers the demo's active link follows the section in view: natively in Chrome, and through the page's fallback script in the other browser
