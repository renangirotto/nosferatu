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

`index.css` puts every stylesheet in its own cascade layer, in this order:

```
nosferatu.tokens < nosferatu.colors < nosferatu.shadows < nosferatu.reset < your unlayered CSS
```

Any CSS you write outside a layer wins, with no `!important` or extra specificity needed.

You can also import single files: `tokens.css`, `colors.css`, `shadows.css`, `reset.css`. Files imported on their own are **not** layered; only `index.css` adds the layers.

### Theming

Every design value is a CSS custom property prefixed with `--nf-`. Colors come from a palette named `--nf-<hue>-<d|l>-<step>` (`d` dark mode, `l` light mode, steps 10–100). Override one to re-theme:

```css
:root {
  --nf-red-l-80: var(--nf-purple-l-80);
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

`--nf-font-body` and `--nf-font-heading` follow `--nf-font-family`, and `--nf-font-mono` follows `--nf-font-family-code-blog-post`.

## Components

```astro
---
import Button from 'astro-nosferatu/components/Button.astro';
---
<Button>Save</Button>
<Button color="red">Delete</Button>
```

`Button` takes a `color` of `blue`, `cyan`, `green`, `orange`, `pink`, `purple` (default), `red` or `yellow`, and passes every other `<button>` attribute through.

Components read their values from the `--nf-*` tokens, so load `tokens.css` and `colors.css` (or `index.css`) on the page. `reset.css` sets `color-scheme: light dark`, so components that use `light-dark()` follow the reader's preferred scheme; set `color-scheme` yourself in unlayered CSS to pin one.

## License

MIT
