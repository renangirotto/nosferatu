# Design

## Context

See [proposal.md](proposal.md) — Why. Three facts shape the approach:

1. **`typography.css` already exists and is already published.** `exports` maps `./styles/*` and `files` is `["src"]`, so the file has been reachable at `astro-nosferatu/styles/typography.css` since it was written. The change is not "publish a file"; it is "wire it into `index.css` and make its public surface one the project can live with".
2. **The names it currently declares are the ones the project already rejected once.** `--nf-fluid-vmin`, `--nf-fluid-vmax`, `--nf-fluid`, `--nf-fs-vmin`, `--nf-fs-vmax` are generic. The archived `2026-10-28-spec-blog-article-typography` change renamed exactly this family off `BlogArticle`'s surface, calling `--nf-h1` "a global heading token the library does not have". Shipping them now on a global stylesheet would recreate the problem it fixed.
3. **`BlogArticle` already has a type scale, and it is not this one.** It interpolates a base size and a modular ratio and raises the ratio to `pow(…, 3 | 2.5 | 2 | 1.5)`; `typography.css` interpolates each size directly between two literal bounds. Both use `progress()` and the same `560px`/`1088px` viewport bounds, and they produce different numbers.

## Goals / Non-Goals

**Goals:**

- Wire `typography.css` into `index.css` without disturbing the four existing layers' relative order.
- Give it a public property surface that is uniform, discoverable, and overridable from a single unlayered `:root` block.
- Keep it standalone: importable with nothing else loaded, per the "each stylesheet is independently importable" invariant.
- Fail soft where `progress()` is unsupported.

**Non-Goals:**

- Reconciling the two type scales. See [proposal.md](proposal.md) — Non-goals.
- Any change to `BlogArticle.astro`. The analysis of why it needs none is Decision 5, but the file is not touched.

## Decisions

### 1. `nosferatu.typography` goes last, after `nosferatu.reset`

The layer statement becomes:

```css
@layer nosferatu.tokens, nosferatu.colors, nosferatu.shadows, nosferatu.reset, nosferatu.typography;
```

`reset.css` already touches the same elements (`overflow-wrap` and `text-wrap` on `p` and `h1`–`h6`). Those are different properties from `font-size`, so today the two would not actually collide — but the ordering question is settled once, for everything either file grows into later, and "the reset establishes a floor, typography builds on it" is the only ordering that stays true as both files grow. The reverse order would mean a future reset rule silently overrides a deliberate typographic one.

This matches the order the project context has carried all along (`… reset, base, typography`), minus the `base` layer that was deliberately removed and is not coming back.

*Alternative considered:* slot typography between `shadows` and `reset`, leaving `reset` last and the existing spec sentence "the reset is the last library layer" intact. Rejected — it makes the reset the authority over text sizing, which inverts the intent of both files.

### 2. Rename to `--nf-typography-*`, and put every property on `:root`

The current file sets `--nf-fs-vmin` / `--nf-fs-vmax` on each element selector and reads them from one shared `:is(h1, h2, h3, p, a)` rule. That is compact, but the two property names mean something different depending on which element is computing them, and overriding `h2`'s upper bound means writing an `h2` selector rather than setting a property. Worse, a consumer who sets `--nf-typography-font-size-max` on `:root` — the obvious guess — gets nothing, because the element rules re-declare it at equal specificity.

Instead, every property is declared on `:root` and spelled per element:

```
--nf-typography-viewport-min            560px
--nf-typography-viewport-max            1088px
--nf-typography-viewport-progress       progress(100svw, min, max)

--nf-typography-font-size-h1-min        3rem
--nf-typography-font-size-h1-max        3.5rem
--nf-typography-font-size-h1            calc(min + progress * (max − min))
…and the same triple for -h2, -h3 and -p
```

Fifteen properties, every one reachable from one unlayered `:root { … }` block, and every one named after what it does. The element rules then contain a single `font-size: var(--nf-typography-font-size-h1)` declaration each. This is the shape `BlogArticle` already uses — bounds, a progress value, resolved per-element sizes — so a reader who has seen one recognises the other.

Exposing the resolved `--nf-typography-font-size-h1` as a property, not just as an inline `calc()`, is what lets a consumer opt one element out of fluidity entirely by assigning it a constant.

*Alternative considered:* keep the compact element-scoped form and just rename `--nf-fs-*` to `--nf-typography-font-size-*`. Rejected for the `:root`-override trap above; the extra lines buy a surface that behaves the way its names suggest.

### 3. Let `progress()` do its own clamping — add nothing around it

An earlier draft of this decision claimed `progress()` was unclamped and needed wrapping in `clamp(0, …, 1)`. **That was wrong.** `progress()` clamps its return value to `0`–`1` by default; the optional `no-clamp` keyword is what opts out of clamping ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/progress)). So the plain call is already bounded at both ends, and any wrapper would have been a no-op:

```css
--nf-typography-viewport-progress: progress(
	100svw,
	var(--nf-typography-viewport-min),
	var(--nf-typography-viewport-max)
);
```

`--nf-typography-viewport-min` and `--nf-typography-viewport-max` are therefore real bounds: each element reaches its minimum at `560px` and its maximum at `1088px`, and holds there outside that range. Measured in headless Chrome against the shipped stylesheet:

| Viewport | `h1` | `p` |
|---|---|---|
| `500px` | 48px (3rem) | 16px (1rem) |
| `560px` | 48px (3rem) | 16px (1rem) |
| `800px` | 51.64px (3.227rem) | 16.91px (1.057rem) |
| `1088px` | 56px (3.5rem) | 18px (1.125rem) |
| `2560px` | 56px (3.5rem) | 18px (1.125rem) |
| `3840px` | 56px (3.5rem) | 18px (1.125rem) |

This also makes the unbounded-growth risk disappear: body text cannot run away on a 4K display, and a consumer gets a predictable size envelope without writing anything.

`BlogArticle` uses the same plain `progress()` call, so it is clamped too, and the two scales agree about what a bound means even though they compute different sizes inside the range.

*Alternatives considered, both rejected:* `progress(no-clamp 100svw, …)` for genuinely unbounded growth — tested and **not supported in Chrome**, where it fails to parse and collapses the element to the inherited size, so it would be a live bug. And `calc((100svw - var(--min)) / (var(--max) - var(--min)))`, typed arithmetic that does extrapolate — verified working, giving `78.3px` at `2560px` — but it abandons `progress()`, diverges from `BlogArticle`, and reintroduces the runaway-size problem for no benefit anyone asked for.

### 4. Guard the element rules with `@supports`

```css
@supports (font-size: calc(1rem + progress(100svw, 0px, 1px) * 1rem)) {
	h1 { font-size: var(--nf-typography-font-size-h1); }
	…
}
```

Without the guard, a browser that does not understand `progress()` still accepts `--nf-typography-viewport-progress` — custom properties accept arbitrary token sequences — and the failure surfaces later, when `font-size: var(--nf-typography-font-size-h1)` turns out to reference an invalid `calc()`. That makes the declaration *invalid at computed-value time*, and because `font-size` is an inherited property, the element falls back to the **inherited** value. Every `h1`, `h2` and `h3` on the page would render at body size and the document's visual hierarchy would disappear. That is a far worse outcome than no type scale at all.

Inside the guard, an unsupporting browser simply never applies the rules and the UA's own heading sizes stand.

`BlogArticle` ships no such guard, and the archived change explicitly declined to add one. That decision is not being reversed here, but it also does not bind this file: the blast radius differs by an order of magnitude. `BlogArticle`'s rules are scoped to one layout a consumer opted into; `typography.css` arrives with `index.css` and hits every heading in the consumer's project.

*Alternative considered:* a `clamp()`-based fluid fallback in the `@supports not` branch. Rejected — two type scales that must be kept numerically in sync, for a progressive-enhancement nicety.

### 5. `BlogArticle` needs no change, and gets none

Astro scoped styles are emitted **unlayered**, with a `[data-astro-cid-…]` attribute selector for scoping. Unlayered CSS beats every layered rule regardless of specificity, so `BlogArticle`'s `h1 { font-size: var(--nf-layout-blog-article-font-size-h1) }` wins over `nosferatu.typography` inside the article without anyone doing anything. Headings *outside* the layout's `main.nf-layout-blog-article` — a consumer's site header, a sidebar — pick up the global scale, which is the intended division.

This is the same mechanism that already makes `Button` and `Callout` immune to the reset, so it needs no new rule, only a note in the docs so the interaction is not a surprise.

The consequence worth stating: the two scales coexist and disagree. A reader who measures an `h2` inside a blog article and one outside it gets different numbers at the same viewport width. That is a real wart, and the reason a follow-up change to unify them is worth writing — but unifying them is breaking for `BlogArticle`'s consumers and does not belong bundled into this one.

### 6. No typography entry in `tokens.css`

`tokens.css` already has a static `--nf-font-size-sm … -3xl` ladder. It is *not* wired into the fluid scale and is not removed: it is what `Button` and `Callout` would reach for, and the two serve different jobs (fixed component sizing versus fluid document sizing). Putting the fluid bounds in `tokens.css` instead would make `typography.css` useless on its own, breaking the independent-importability invariant. Keeping both is mild redundancy; it is not a conflict.

### 7. The live demo gets its own page, because Starlight's layers outrank ours

Found while implementing, not while planning. The docs site loads `index.css` through Starlight's `customCss`, which emits the library's stylesheet *before* Starlight's own. Cascade layer order follows first-declaration order, so every `starlight.*` layer outranks every `nosferatu.*` layer, and Starlight's heading rules — `h1:where(.astro-srrvghlj)` in `starlight.core`, `.sl-markdown-content h2:not(…)` in `starlight.content` — win over `nosferatu.typography` no matter what specificity either side uses.

The practical effect on the docs site: headings are unchanged, and only `p` picks up the scale, since Starlight sets no paragraph size. So the documentation page a reader is standing on cannot show the thing it documents.

This is not a library defect. It is the same mechanism as invariant 3 seen from the other side: the library deliberately sits in layers so a consumer can win, and a consumer that declares layers after importing it wins by exactly that design. `BlogArticle` is unaffected because Astro scoped styles are unlayered (Decision 5), which is also why the existing `/examples/blog-article/` page renders correctly.

So the demo moves to `docs/src/pages/examples/typography.astro`, a standalone document that loads `astro-nosferatu/styles/index.css` and nothing else. This follows a pattern the project already has — `/examples/blog-article/` exists for the same class of reason — and the `documentation-site` spec already prefers a standalone example page for anything that cannot be shown inline. The page reports the viewport width and each element's computed `font-size`, which makes the scale from Decision 3 — including where it stops at each bound — directly observable by dragging the window.

*Alternative considered:* reordering so `nosferatu.*` is declared after `starlight.*`. Rejected — it would mean fighting Starlight's injection order for the benefit of the docs site only, and it would misrepresent what a real consumer sees.

## Risks / Trade-offs

- **Every existing consumer's pages re-flow on upgrade.** → Unavoidable given the goal; mitigated by the documented opt-out (import the four other stylesheets individually), by the fact that every size is a `:root` property away from being retuned, and by calling it breaking in the proposal and release notes.
- **`progress()` has very thin support.** → Decision 4 makes the unsupported path the browser's own sizes rather than a collapsed hierarchy. The docs state it as progressive enhancement, so nobody ships a layout that depends on the exact rendered size.
- **Two divergent type scales in one library.** → Decision 5. Accepted knowingly, documented on the styles page and the BlogArticle page, and left for a follow-up change.
- **The planning artifacts asserted the opposite clamping behaviour until it was measured.** → Decision 3 was written from a wrong reading of `progress()` and corrected only when headless Chrome contradicted it. The figures now in the spec and design come from measuring the shipped stylesheet, not from arithmetic on an assumption; task 3.4 re-measures them so the two cannot drift apart again.
- **`p { font-size }` reaches paragraphs inside the consumer's own components.** → This is the point of a global typography sheet, but it is the single most intrusive rule in the file. The docs call it out by name so it is not discovered by accident.
- **Verification is visual only.** There is no test runner. → `pnpm build` and `pnpm --filter docs check` confirm nothing breaks; the sizing itself must be checked by resizing a real browser window, which the tasks spell out step by step.

## Migration Plan

For a consumer on the previous version:

1. Upgrade. Headings and paragraphs are now sized by the library.
2. To keep the old rendering, replace the single `import 'astro-nosferatu/styles/index.css'` with the four individual imports (`tokens.css`, `colors/index.css`, `shadows.css`, `reset.css`). Note those are unlayered, so consumer CSS no longer automatically wins over the reset.
3. To keep `index.css` but retune, override any `--nf-typography-*` property in unlayered CSS on `:root`.
4. To keep `index.css` but drop the sizing for one element, write an unlayered rule for it — `h1 { font-size: 2.5rem }` wins over the layer with no `!important`.

Rollback is removing the one `@import` line and the layer name from `index.css`; the stylesheet stays published and harmless, exactly as it is today.
