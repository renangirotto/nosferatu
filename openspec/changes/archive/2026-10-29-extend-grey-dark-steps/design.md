# Design

## Context

Both grey scales end at the shared anchor `oklch(0.29 0.02 277.5)`. Above that anchor, the dark scale drops about `0.11` per step and the light scale about `0.07`. Keeping either slope would reach black in three or four steps, so ten new steps cannot simply continue the existing slope.

## Goals / Non-Goals

**Goals:** ten distinguishable near-black greys below `100` on both scales, named and tiered like every other palette token.

**Non-Goals:** reshaping steps `10`–`100`, or adding extended steps to the other hues.

## Decisions

- **Naming continues the numeric step, `110`–`200`.** This keeps the `--nf-<hue>-<d|l>-<step>` pattern, so the token-naming and `--nf-` prefix invariants hold with no new name shape. A higher step still means darker, as it already does. We rejected two alternatives. A new suffix such as `--nf-grey-d-dark-10` invents a second naming scheme. Re-spreading `10`–`100` over the wider range would change every existing grey value, which is a breaking change.
- **Even `0.02` lightness steps from `0.27` to `0.09`.** At low lightness a `0.02` OKLCH step stays visibly distinct, and stopping at `0.09` keeps step `200` apart from pure black. We rejected a curve that ends at `0`, because its last steps become hard to tell apart.
- **The two scales get identical values below `100`.** They already meet at `100`, and the user chose one shared ramp. Different slopes would need two arbitrary curves with no source to anchor them.
- **Chroma eases from `0.02` to `0.01`.** A constant `0.02` reads as a stronger cool cast as lightness falls, so the chroma tapers to keep the near-blacks neutral. The hue angle stays at `277.5`.
- **Values are written out literally**, as for every other palette token. No `color-mix()` or relative color is used.

**Invariant bent:** the palette spec described a uniform `10`–`100` step range for every hue. Grey now has twenty steps and the other hues ten. The spec delta records this exception explicitly, and no component depends on the step count.

## Risks / Trade-offs

- [Consumers or tools that assume every hue has exactly ten steps, such as generated swatch grids] → The change is additive and documented on the Styles page. No existing token moves.
- [The near-black steps can look the same on low-contrast displays] → The `0.02` spacing is the narrowest the user accepted. Check it in the browser through the docs swatches (task 3).
