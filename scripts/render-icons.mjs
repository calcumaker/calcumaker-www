// Rasterise the brand mark for the contexts that need a specific PNG size.
// The active mark is already a transparent PNG generated from the image-model
// render; this script only resizes it for Apple touch icon consumers.
//
//   npm run icons
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const OUT = join(ROOT, "assets");

// [source image, output png, px].
const TARGETS = [["calcumaker-mark.png", "apple-touch-icon.png", 180]];

const browser = await chromium.launch();
for (const [src, out, size] of TARGETS) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const srcData = (await readFile(join(OUT, src))).toString("base64");
  await page.setContent(
    `<body style="margin:0;background:transparent">
       <div style="width:${size}px;height:${size}px">
         <img src="data:image/png;base64,${srcData}" style="width:${size}px;height:${size}px;object-fit:contain" />
       </div>
     </body>`,
  );
  await page.locator("img").evaluate((img) => img.decode());
  await page.screenshot({ path: join(OUT, out), omitBackground: true });
  await page.close();
  console.log(`rendered assets/${out} (${size}x${size}) from ${src}`);
}
await browser.close();
