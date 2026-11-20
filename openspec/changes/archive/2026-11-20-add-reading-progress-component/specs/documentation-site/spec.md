# Spec Delta

## ADDED Requirements

### Requirement: ReadingProgress page states browser support

The ReadingProgress page SHALL follow the component page structure and SHALL show, before its `Usage` section, a warning that the component relies on CSS scroll-driven animations (`animation-timeline`), ships no polyfill, and shows no fill in a browser without that support. The page SHALL demonstrate both whole-page progress and progress tracking a `target` element on the page itself.

#### Scenario: Warning is visible

- **WHEN** a reader opens the ReadingProgress page
- **THEN** a warning callout above `Usage` names `animation-timeline`, says there is no polyfill, and says the bar stays empty in unsupported browsers

#### Scenario: Target demo works on the page

- **WHEN** a reader in a supporting browser scrolls through the page's target demo block
- **THEN** a bar driven by that block fills from empty to full as the block is scrolled through, independently of the page's overall scroll position
