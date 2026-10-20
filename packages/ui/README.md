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

`index.css` loads the tokens and puts the reset, base and typography styles in cascade layers, in this order:

```
nosferatu.reset < nosferatu.base < nosferatu.typography < your unlayered CSS
```

Any CSS you write outside a layer wins, with no `!important` or extra specificity needed.

You can also import single files: `tokens.css`, `reset.css`, `base.css`, `typography.css`. Files imported on their own are **not** layered; only `index.css` adds the layers.

### Theming

Every design value is a CSS custom property prefixed with `--nf-`. Override one to re-theme:

```css
:root {
  --nf-color-primary: #7c3aed;
}
```

## Components

```astro
---
import Button from 'astro-nosferatu/components/Button.astro';
---
<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
```

Components read their values from the `--nf-*` tokens, so load `tokens.css` (or `index.css`) on the page.

## License

MIT
