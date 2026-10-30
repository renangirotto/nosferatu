# Design

## Context

See [proposal.md](proposal.md) for motivation. The constraints that shape this design come from the specs and the repository's invariants:

- The library ships **source only** and has **no runtime dependencies**; `packages/ui` has no build step that could emit or hash a font file.
- The cascade layer order `nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset, nosferatu.typography` is a hard invariant, and unlayered consumer CSS must keep winning over all of it.
- Every custom property is `--nf-` prefixed; a layout's properties are `--nf-layout-<name>-<role>`.
- Verification is `pnpm build`, `pnpm pack:check`, `pnpm --filter docs check` plus manual browser checks. There are no unit tests.
- The docs site already installs `@fontsource-variable/outfit`, imports it through `customCss` in [astro.config.mjs](../../../docs/astro.config.mjs) and hard-codes `--sl-font: "Outfit Variable"` in [theme.css](../../../docs/src/styles/theme.css). That is the exact opt-in path this change asks consumers to follow, written before the library had anything to offer.

One behaviour of Astro's style scoping is load-bearing here and was verified against the built output in `docs/dist/examples/blog-article/index.html` rather than assumed: the layout's scope marker is written **only on the elements the layout itself renders** (`main`, `h1`, the description `p`), but its nested rules compile to `.nf-layout-blog-article:where(.astro-<hash>) p`, with no scope marker on the descendant. Slot content therefore *is* matched today — the example page's slotted `h2` and paragraphs are already sized by the layout. The current `library-layouts` wording ("the slot content is untouched by it") describes something the implementation has never done, and the fonts this change adds are meaningless unless they reach slot content, since an article's body is slot content. The delta corrects the wording rather than the behaviour.

## Goals / Non-Goals

**Goals:**

- One place per family. A family name appears exactly once in the library; everything else is a `var()` away from it.
- A consumer can go from "system fonts" to "the three fonts" by installing three packages and importing them, with no CSS of their own.
- A consumer can swap any of the three fonts by setting one property in unlayered CSS.
- Nothing degrades when no font is installed: the same page, in the same system font it renders in today.

**Non-Goals:**

- No `@font-face`, no font subsetting, no `font-display` policy, no preload hints — those belong to whoever ships the bytes, which is Fontsource and the consumer's build.
- No new stylesheet and no new layer: a `fonts.css` would force a fifth layer into a fixed order and a new export for no behaviour the existing files cannot carry.
- No variable-axis API (`font-variation-settings`, optical sizing, `font-weight` ranges beyond the single default).

## Decisions

### D1 — The library names fonts, it never loads them

The alternative was vendoring the `.woff2` files under `src/styles/fonts/` with the library's own `@font-face` rules. Rejected: it puts ~6 binaries in a source-only package, makes the library responsible for subsetting and `unicode-range` decisions, and ties font updates to a library release. Declaring the packages as **optional peer dependencies** keeps the intended range machine-readable (`^5.3.0`, the current Fontsource major) while npm and pnpm install nothing and warn about nothing. The `@import "@fontsource-variable/outfit"` approach inside a library stylesheet was also rejected: it is a hard module resolution error for every consumer who did not install the package, which is exactly the failure mode this design is avoiding.

### D2 — Three-tier font stacks

Each family property is `'<Family> Variable', '<Family>', <the system stack the library already used>`. Fontsource publishes two flavours under different CSS family names — `@fontsource-variable/outfit` declares `Outfit Variable`, `@fontsource/outfit` declares `Outfit` (verified against the published `index.css` of all three packages) — so naming both means either install works and the variable one wins when both are present. The third tier is the existing `tokens.css` system stack, so "no font installed" is byte-for-byte today's rendering.

### D3 — The properties live in `typography.css`, not `tokens.css`

Fonts are typography, the `body` rule that applies them is in the same file, and `typography.css` is the file a consumer drops to opt out of the library's text opinions — fonts included. `tokens.css` then defers: `--nf-font-body: var(--nf-font-family, <system stack>)`. The `var()` fallback is what keeps the "tokens imported alone" scenario true, since the family properties are not defined in that case.

The cost is a naming inconsistency: the three new properties are `--nf-font-*`, not `--nf-typography-font-*` like everything else in that file. This is deliberate — they are the library's font API, not knobs on the type scale, and `--nf-font-family` is the name a consumer would guess — but it is a convention bent, recorded here so the next reader does not "fix" it. `--nf-font-weight` also sits beside the existing `--nf-font-weight-normal/-medium/-bold` in `tokens.css`; they do not collide, and the new one is the *default applied to the page* rather than a named step on a scale.

### D4 — `strong` gets the family but not the weight

Applying `font-weight: var(--nf-font-weight)` (400) to `strong` would un-bold every emphasis in an article. The layout therefore sets family on `p`, `strong`, `span` and `a`, and weight on `p` only; `strong` keeps the UA's `bolder`. This is the one place the implementation deliberately departs from a literal reading of "p, strong, span, a — default font weight 400".

### D5 — Headings stay in the general font

`BlogArticle` gives the article font to prose and leaves headings to inherit from `body`. Outfit for structure, Plus Jakarta Sans for reading is the point of having two families; pulling headings into the article font would make `--nf-font-family` reach almost nothing on an article page.

### D6 — `code` and `pre`, not just `code`

The request names `code` tags and code blocks. A fenced block renders `<pre><code>`, and `pre` carries the UA's own `monospace`, which beats inheritance — so a `pre` without an inner `code` would silently keep the system mono. Both get the rule; the inner `code` of a fenced block simply matches twice with the same value.

### D7 — The layout keeps its own indirection layer

`.nf-layout-blog-article` declares `--nf-layout-blog-article-font-family: var(--nf-font-family-blog-post)` rather than reading the global property directly from the element rules. One extra hop buys per-article re-tuning (`.nf-layout-blog-article { --nf-layout-blog-article-font-family: … }`) without touching the page-wide font, and it keeps the layout's public surface uniformly `--nf-layout-blog-article-*`, as `library-layouts` requires.

A consequence worth stating: a library component placed in the article's slot inherits the article font through its own `p`/`span` elements — a `Callout` inside a `BlogArticle` will read in Plus Jakarta Sans. Components set no `font-family` of their own, so this is ordinary inheritance, and D7's property is the escape hatch. No component is changed to opt out.

### D8 — The docs site becomes the reference consumer

`theme.css` stops naming `"Outfit Variable"` and feeds Starlight's `--sl-font` from `var(--nf-font-family)` and `--sl-font-mono` from `var(--nf-font-family-code-blog-post)`, with all three packages imported through `customCss`. The docs then demonstrate the opt-in path instead of describing it, and the `BlogArticle` example page renders in the real fonts. Starlight's `customCss` array is order-sensitive: the font packages must come before `astro-nosferatu/styles/index.css` and `./src/styles/theme.css`, as `@fontsource-variable/outfit` already does.

### D9 — No `@supports` guard on the font rules

The existing guard in `typography.css` exists for `progress()`. `font-family` and `font-weight` need no guard, so the `body` rule sits outside it; a browser without `progress()` still gets the fonts.

## Risks / Trade-offs

- **Every consumer's page changes appearance on upgrade.** → The library is pre-1.0; the change is called out in the proposal as consumer-visible, the docs show the one-line opt-out (`body { font-family: … }` unlayered, or `--nf-font-family` on `:root`), and nothing is removed from the token API.
- **A consumer installs the static `@fontsource/*` and expects the variable axis.** → Both family names are in every stack, so the font renders either way; the docs recommend the variable packages explicitly.
- **FOUT/CLS when the consumer loads a font.** → Out of scope by D1: the consumer's own `@font-face` (Fontsource's, in practice) owns `font-display`. The library's stacks end in system fonts, so the fallback metrics are the same ones the page has today.
- **Optional peer dependencies are a weak contract.** → They are advisory by construction. The compensating control is that no published file imports a font package, so a missing package can never break a build (asserted as a spec scenario).
- **`pnpm` may report an unused-optional-peer warning in the workspace** since `docs` installs the packages and `packages/ui` declares them optional. → Verified by `pnpm install` during implementation; if a warning appears it is in the workspace only and not in a consumer's install.
- **The `library-layouts` wording change admits that layouts style slot content.** → This documents existing behaviour (verified in the built example page) rather than granting new reach; the "rooted at the layout's hook" constraint is what keeps it bounded, and consumer unlayered CSS still wins.

## Migration Plan

Single release, no data and no runtime. A consumer upgrading gets new fonts on `index.css` import; a consumer who wants the old appearance sets `--nf-font-family` (and, if they use `BlogArticle`, `--nf-font-family-blog-post` and `--nf-font-family-code-blog-post`) to the system stacks in unlayered CSS. Rollback is a revert of the three source files and the manifest; nothing persists outside the package.
