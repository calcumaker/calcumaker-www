# Calcumaker Brand Direction

## Logo concept

**Name:** Calcumaker (the brand/line). **Calcumaker 16** is the first device.

**Tagline:** Every base. Every digit.

**Core mark:** a precision faceplate badge: a gold angular `C` shell around a
red seven-segment `16`, with small trace and annunciator accents. The mark ties
together the product's strongest signals from the repos:

- programmer/RPN calculator lineage
- base-16 identity
- real hardware with 7-segment display, shift legends, and PCB detail

The colors reuse the existing emulator language:

- case: `#23262b`
- shift gold: `#f0c25a`
- shift blue: `#6ea8ff`
- LED red: `#ff3b30`
- ink: `#e7e9ee`

## Assets

- `assets/calcumaker-logo.svg` - primary horizontal lockup for dark backgrounds
- `assets/calcumaker-logo-light.svg` - horizontal lockup for light backgrounds
- `assets/calcumaker-mark.png` - active transparent PNG site mark
- `assets/calcumaker-mark.svg` - square app/icon mark
- `assets/calcumaker-mark-mono.svg` - one-color PCB silk / engraving mark
- `assets/calcumaker-logo-sheet.svg` - concept sheet with rationale and variants

## Site usage (calcumaker-www)

> ### ⚠ Open issue: the brand assets name the *device*, not the line
>
> Per [`NAMING.md`](https://github.com/calcumaker/calcumaker/blob/main/NAMING.md):
> **Calcumaker** is the brand/line; **Calcumaker 16** is the first device, and
> `16` is deliberately left free for siblings ("a future Calcumaker 10").
>
> But today every asset bakes `16` in: the lockups append a gold `16` to the
> wordmark, and the **mark's centre is a seven-segment `16`**. That makes them all
> *device* assets — none of them can represent the line.
>
> calcumaker.co markets the **line**, so it uses the mark plus a CSS wordmark and
> avoids the lockups. **A line mark and a line lockup (no `16`) are still needed.**
> Until then the site carries a mark that says "16" while the copy says the 16 is
> only one device.

| Asset | Where |
|---|---|
| `calcumaker-mark.png` | active nav mark, hero mark, and PNG favicon — **contains `16`** |
| `calcumaker-mark.svg` | **not used on the site**: weaker vector trace draft — **contains `16`** |
| `favicon.svg` | not used on the site; SVG favicon draft — **contains `16`** |
| `calcumaker-logo.svg` | **not used on the site**: appends `16` to the wordmark (device lockup) |
| `calcumaker-logo-light.svg` | not used on the site (dark-only); also a device lockup |
| `calcumaker-mark-mono.svg` | not used on the site; PCB silk / engraving |
| `calcumaker-logo-sheet.svg` | concept sheet, documentation only |

`assets/apple-touch-icon.png` is generated — `npm run icons` re-renders it from
`calcumaker-mark.png`. Don't hand-edit it.

Two things worth knowing about the assets:

1. **The active mark is a transparent PNG.** The SVG trace attempts are retained
   as drafts, but the site uses the original image-model render for now.
2. **`calcumaker-mark-mono.svg` hardcodes `fill="#111820"`.** Switching it to
   `currentColor` would make it reusable (silk, engraving, inline on any
   background) without editing the file.

## Notes

This is intentionally not a Voyager-style wordmark. The product can acknowledge the HP-16C lineage in copy, but the logo should own the Calcumaker hardware language: visible stack, base modes, full-size keys, and arbitrary precision.
