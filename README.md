# calcumaker-www

The marketing site for **[Calcumaker](https://github.com/calcumaker/calcumaker)** —
served at [calcumaker.co](https://calcumaker.co).

**Calcumaker** is the brand/line; **Calcumaker 16** is the first device (see
`NAMING.md` in the engine repo). The site markets the line — `16` appears only in
copy about that device, never in brand positions (title, `og:title`, nav). Verify
enforces this.

Plain static HTML / CSS / JS. **No build step**: the repo *is* the deployable
tree. The hero's seven-segment strip uses the same glyph table and bit layout as
the firmware (`calcumaker-core`'s `seg7.rs`), so it lights the segments the
hardware would.

```
index.html
assets/  styles.css · main.js · calcumaker-mark.png · calcumaker-{logo,mark}*.svg
         favicon.svg · apple-touch-icon.png (generated) · emulator-*.png
BRAND.md   logo direction + where each asset is used
```

## Develop

```sh
npm install
npm run serve      # http://localhost:8080
npm run lint       # Stylelint (CSS) + ESLint (JS), --max-warnings 0
npm run verify     # drives the page in Chromium; screenshots -> .shots/
npm run icons      # re-render apple-touch-icon.png from the brand mark
```

`npm run verify` checks the things that silently rot: the hero strip really
lights segments, images actually decode (not just carry `alt`), declared
`width`/`height` match the intrinsic aspect, every external link is
`rel="noopener"`, the copyright is present, and nothing overflows horizontally at
320/390px. CI runs it, plus **actionlint** on the workflows.

## Deploy

There is nothing to compile — publish `index.html` + `assets/` to any static
host. CI also uploads that tree as a `site` artifact on every push to `main`.

## Screenshots

`assets/emulator-*.png` are captured from the real
[browser emulator](https://github.com/calcumaker/calcumaker-web) via its
Playwright harness, not mocked up.

## Licence

Copyright © 2026 Yann Ramin. This repo is split three ways — Creative Commons
[advises against](https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software)
using CC for software, and you don't CC-license a logo.

| | Covers | Licence |
|---|---|---|
| **Code** | `index.html` markup/scripts, `assets/main.js`, `assets/styles.css`, `scripts/`, `.github/` | [MIT](LICENSE) |
| **Content** | prose, the Markdown files, `assets/emulator-*.png` | [CC BY-SA 4.0](LICENSE-CONTENT) |
| **Brand** | the Calcumaker name and wordmark, `assets/calcumaker-mark.png`, `assets/calcumaker-{logo,mark}*.svg`, `assets/favicon.svg`, `assets/apple-touch-icon.png` | **All rights reserved** |

Brand assets are deliberately *not* open-licensed: copyright licences don't grant
trademark rights, and a freely licensed mark lets anyone imply endorsement. Fork
the site, keep the code and the words — swap the logo for your own.

Full scope and the per-file carve-out live in [NOTICE](NOTICE). `LICENSE` is kept
as the *unmodified* MIT text on purpose — appending scope notes to it makes GitHub
and SPDX scanners report `NOASSERTION` instead of `MIT`.

The project itself is licensed elsewhere: firmware
[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html), hardware
[CERN-OHL-S v2](https://cern-ohl.web.cern.ch/). AGPL is deliberately *not* used
here — its source-offer obligation is aimed at network services and buys nothing
on a brochure page.
