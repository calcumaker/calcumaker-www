// Rasterise the brand mark for the contexts that can't take SVG.
// Apple touch icons must be PNG (no SVG support), so we render one from
// assets/calcumaker-mark.svg rather than hand-maintaining a second artwork.
//
//   npm run icons
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const OUT = join(ROOT, "assets");

// [source svg, output png, px]. Apple renders on its own rounded mask, but a
// full-bleed background avoids a transparent halo on older iOS.
const TARGETS = [["calcumaker-mark.svg", "apple-touch-icon.png", 180]];

const browser = await chromium.launch();
for (const [src, out, size] of TARGETS) {
  const svg = await readFile(join(OUT, src), "utf8");
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<body style="margin:0;background:#23262b">
       <div style="width:${size}px;height:${size}px">${svg}</div>
     </body>`,
  );
  await page.screenshot({ path: join(OUT, out), omitBackground: false });
  await page.close();
  console.log(`rendered assets/${out} (${size}x${size}) from ${src}`);
}
await browser.close();
