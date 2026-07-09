# Calcumaker 16 Brand Direction

## Logo concept

**Name:** Calcumaker 16

**Tagline:** Every base. Every digit.

**Core mark:** a seven-segment `C` next to segmented `16`, framed by a hex shape and captioned `0x10`. The mark ties together the product's three strongest signals from the repos:

- programmer/RPN calculator lineage
- base-16 identity
- real hardware with 7-segment and matrix displays

The colors reuse the existing emulator language:

- case: `#23262b`
- shift gold: `#f0c25a`
- shift blue: `#6ea8ff`
- LED red: `#ff3b30`
- ink: `#e7e9ee`

## Assets

- `assets/calcumaker-logo.svg` - primary horizontal lockup for dark backgrounds
- `assets/calcumaker-logo-light.svg` - horizontal lockup for light backgrounds
- `assets/calcumaker-mark.svg` - square app/icon mark
- `assets/calcumaker-mark-mono.svg` - one-color PCB silk / engraving mark
- `assets/calcumaker-logo-sheet.svg` - concept sheet with rationale and variants

## Site usage (calcumaker-www)

| Asset | Where |
|---|---|
| `calcumaker-logo.svg` | hero lockup (rendered ~480px wide, so the tagline stays legible) |
| `calcumaker-mark.svg` | nav mark (30px), and rasterised to `apple-touch-icon.png` |
| `favicon.svg` | tab icon — a **reduction** of the mark (see below) |
| `calcumaker-logo-light.svg` | not used on the site (dark-only); kept for light contexts |
| `calcumaker-mark-mono.svg` | not used on the site; PCB silk / engraving |
| `calcumaker-logo-sheet.svg` | concept sheet, documentation only |

`assets/apple-touch-icon.png` is generated — `npm run icons` re-renders it from
`calcumaker-mark.svg`. Don't hand-edit it.

Two things worth knowing about the assets:

1. **The full mark doesn't survive a 16px favicon.** The `0x10` caption and the
   segmented `16` collapse into noise below ~32px. `favicon.svg` therefore keeps
   only what reads at tab size — the gold hex and the seven-segment `C` — using
   the mark's own geometry and palette.
2. **`calcumaker-mark-mono.svg` hardcodes `fill="#111820"`.** Switching it to
   `currentColor` would make it reusable (silk, engraving, inline on any
   background) without editing the file.

## Notes

This is intentionally not a Voyager-style wordmark. The product can acknowledge the HP-16C lineage in copy, but the logo should own the Calcumaker hardware language: visible stack, base modes, full-size keys, and arbitrary precision.
