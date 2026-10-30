# astro-nosferatu

Styles and `.astro` components for [Astro](https://astro.build) 7.

```sh
npm install astro-nosferatu
```

## Styles

Import the full set once, for example in your base layout:

```astro
---
import 'astro-nosferatu/styles/index.css';
---
```

`index.css` declares three cascade layers, in this order:

```
nosferatu.tokens < nosferatu.reset < nosferatu.typography < your unlayered CSS
```

Any CSS you write outside a layer wins, with no `!important` or extra specificity needed.

You can also import single files: `tokens.css`, `reset.css`, `typography.css`, or one token group at a time with `colors/index.css`, `shadows.css`, `spacings.css` and `borders.css`. `tokens.css` is exactly those four imports and declares nothing itself. Files imported on their own are **not** layered; only `index.css` adds the layers.

### Theming

Every design value is a CSS custom property prefixed with `--nf-`. Colors come from a palette named `--nf-<hue>-<d|l>-<step>` (`d` dark mode, `l` light mode, steps 10–100). Space is the `--nf-spacing-*` scale and corners the `--nf-border-radius-*` scale, both in absolute `px`, named around a base step: `--nf-spacing-base` is `16px`, `--nf-border-radius-base` is `8px`, and `-low-N`/`-up-N` step down and up from there. Override one to re-theme:

```css
:root {
  --nf-red-l-80: var(--nf-purple-l-80);
  --nf-spacing-base: 20px;
}
```

### Fonts

The library **names** three fonts and never loads them: Outfit for the page, Plus Jakarta Sans for `BlogArticle` prose and Geist Mono for its code. No font file ships in this package, and nothing is requested from a font host.

Install the ones you want — they are optional peer dependencies — and import them yourself:

```sh
npm install @fontsource-variable/outfit @fontsource-variable/plus-jakarta-sans @fontsource-variable/geist-mono
```

```astro
---
import '@fontsource-variable/outfit';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/geist-mono';
import 'astro-nosferatu/styles/index.css';
---
```

Install nothing and every stack falls through to the system font it ends with, with no failed request. The four properties are `--nf-font-family`, `--nf-font-family-blog-post`, `--nf-font-family-code-blog-post` and `--nf-font-weight` (`400`); override any of them in unlayered CSS to use your own font:

```css
:root {
  --nf-font-family: 'Inter Variable', system-ui, sans-serif;
}
```

`--nf-font-family` is the one property for the page's general text: `body` takes it, everything inside inherits it, and the components read it directly, so a single override moves all of them.

## Components

```astro
---
import Button from 'astro-nosferatu/components/Button.astro';
---
<Button>Save</Button>
<Button color="red">Delete</Button>
```

`Button` takes a `color` of `blue`, `cyan`, `green`, `orange`, `pink`, `purple` (default), `red` or `yellow`, and passes every other `<button>` attribute through.

Components read their values from the `--nf-*` tokens, so load `tokens.css` (or `index.css`) on the page — it brings the palette, the shadows, the spacing and the radii together. `reset.css` sets `color-scheme: light dark`, so components that use `light-dark()` follow the reader's preferred scheme; set `color-scheme` yourself in unlayered CSS to pin one.

## License

MIT
