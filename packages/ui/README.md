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
