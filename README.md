# calcumaker-www

The marketing site for **[Calcumaker 16](https://github.com/calcumaker/calcumaker)** —
served at [calcumaker.co](https://calcumaker.co).

Plain static HTML / CSS / JS. **No build step**: the repo *is* the deployable
tree. The hero's seven-segment strip uses the same glyph table and bit layout as
the firmware (`calcumaker-core`'s `seg7.rs`), so it lights the segments the
hardware would.

```
index.html
assets/  styles.css · main.js · calcumaker-{logo,mark}*.svg · favicon.svg
         apple-touch-icon.png (generated) · emulator-*.png
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

Copyright © 2026 Yann Ramin.

The site's content and code have **no licence declared yet** — pick one before
accepting outside contributions. The project itself: firmware
[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html), hardware
[CERN-OHL-S v2](https://cern-ohl.web.cern.ch/).
